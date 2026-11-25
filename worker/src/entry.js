/* Ponto de entrada na Cloudflare. Todo pedido e o relógio passam por UM Durable Object ("Hub") com SQLite:
   - grava sem o limite de 1.000/dia do KV (o SQLite grátis aguenta 100 mil gravações/dia)
   - atende um pedido de cada vez no armazenamento (ninguém apaga a gravação de outra pessoa)
   - o relógio manda os avisos em lotes e agenda a continuação logo em seguida (alarme), para
     cada execução caber no limite grátis de processamento */
import { DurableObject } from 'cloudflare:workers';
import { safeHandle, cronTick } from './index.js';
import { makeKv, makeDue } from './kvsql.js';
import { sqlBoard } from './leaderboard.js';
import { makeSocial } from './social.js';
import { verifyIdToken } from './auth.js';
import { NET } from './webpush.js';

const HUB = 'lembra';
/* IA grátis (10 mil "neurônios" por dia): estimativa por chamada, com reserva para o assistente */
const RATE = { big: [0.0267, 0.205], small: [0.0041, 0.035] };
function limitedAI(ai, kv, cap) {
  if (!ai) return ai;
  return {
    async run(model, input, opts) {
      const day = new Date().toISOString().slice(0, 10), key = `ai-neurons:${day}`;
      const used = Number(await kv.get(key)) || 0;
      if (used >= cap) throw new Error('limite diário da IA grátis atingido');
      const r = await ai.run(model, input, opts);
      const [ri, ro] = /70b|3\.3/.test(model) ? RATE.big : RATE.small;
      const inTok = JSON.stringify(input?.messages || input || '').length / 3.5;
      const outTok = String(r?.response || '').length / 3.5;
      await kv.put(key, String(Math.round(used + inTok * ri + outTok * ro)), { expirationTtl: 3 * 86400 });
      return r;
    },
  };
}

export class Hub extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.meter = {};
    this.kv = makeKv(ctx.storage.sql, this.meter);
    this.due = makeDue(ctx.storage.sql, this.kv, this.meter);
    this.social = makeSocial(ctx.storage.sql, this.meter);
    this.runs = [];
    this.presence = new Map();
    this.presSaved = 0; this.presSig = '';
    const base = { ...env, LB: sqlBoard(ctx.storage.sql, this.meter), CAL: this.kv, DUE: this.due, PRESENCE: this.presence, KV_OLD: env.CAL, METER: this.meter, RUNS: this.runs, SOCIAL: this.social,
      // tempo real: manda o recado para os aparelhos abertos da pessoa; "visível" = com o app na frente agora
      AVISA: (u, o) => { const t = JSON.stringify(o); for (const w of ctx.getWebSockets(u)) { try { w.send(t); } catch { /* fechou */ } } },
      VISIVEL: (u) => ctx.getWebSockets(u).some((w) => { try { return !!w.deserializeAttachment()?.vis; } catch { return false; } }) };
    try { ctx.setWebSocketAutoResponse(new WebSocketRequestResponsePair('ping', 'pong')); } catch { /* ok */ }
    this.http = { ...base, AI: limitedAI(env.AI, this.kv, 9500) };   // assistente: quase tudo
    this.bg = { ...base, AI: limitedAI(env.AI, this.kv, 6000) };     // mensagens automáticas: até 6.000
    this.bg.USAGE = this.http.USAGE = base.USAGE = { date: '', amigo: { sent: 0, ai: 0 }, coach: { sent: 0, ai: 0 } };
    this.running = false;
    ctx.blockConcurrencyWhile(async () => {
      await this.migrate();
      // quem estava com o app aberto (foto guardada): o painel não "esquece" quando o servidor acorda
      const snap = await this.kv.get('presence-snap', 'json');
      if (snap && typeof snap === 'object') for (const [k, v] of Object.entries(snap)) this.presence.set(k, v);
    });
  }

  /* Primeira vez: copia tudo do KV antigo para o SQLite (as chaves dos avisos, os aparelhos, as agendas…).
     Primeiro as chaves críticas (a chave das notificações: sem ela os celulares parariam de receber);
     depois o resto, até 800 por execução (limite de pedidos internos do plano grátis), continuando sozinho. */
  async migrate() {
    if (await this.kv.get('migrated:kv')) return true;
    const old = this.env.CAL;
    if (!old || !old.list) { await this.kv.put('migrated:kv', String(Date.now())); return true; }
    for (const k of ['vapid', 'subs', 'users', 'admin-member']) {
      if (await this.kv.get(k)) continue;
      const v = await old.get(k);
      if (v !== null) await this.kv.put(k, v);
    }
    let cursor = (await this.kv.get('migrate-cursor')) || undefined, budget = 800;
    while (budget > 0) {
      const page = await old.list({ cursor, limit: Math.min(1000, budget) });
      budget--;
      for (const k of page.keys) {
        if (budget <= 0) break;
        if (await this.kv.get(k.name)) continue;
        const v = await old.get(k.name);
        budget--;
        if (v !== null) await this.kv.put(k.name, v, k.expiration ? { expiration: k.expiration } : {});
      }
      if (page.list_complete && budget > 0) { await this.kv.put('migrated:kv', String(Date.now())); await this.kv.delete('migrate-cursor'); return true; }
      if (budget <= 0) break;
      cursor = page.cursor;
      await this.kv.put('migrate-cursor', cursor);
    }
    // ainda falta: continua daqui a pouco (nova execução, novo limite)
    await this.ctx.storage.setAlarm(Date.now() + 1000);
    return false;
  }

  /* conexão em tempo real (dorme sem custo quando ninguém fala). O login vai no subprotocolo: new WebSocket(url, ['lembra', token]) */
  async ws(req) {
    const origem = req.headers.get('Origin') || '', ok = (this.env.ALLOWED_ORIGINS || '').split(',').map((x) => x.trim()).includes(origem) || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origem);
    if (!ok) return new Response('origem', { status: 403 });
    const p = (req.headers.get('Sec-WebSocket-Protocol') || '').split(',').map((x) => x.trim());
    let me; try { if (p[0] !== 'lembra') throw new Error('protocolo'); me = await verifyIdToken(p[1], this.http); } catch { return new Response('login', { status: 401 }); }
    const u = me.ws, velhos = this.ctx.getWebSockets(u);
    if (velhos.length >= 4) { try { velhos[0].close(4000, 'muitos aparelhos'); } catch { /* ok */ } }
    const par = new WebSocketPair();
    this.ctx.acceptWebSocket(par[1], [u]);
    par[1].serializeAttachment({ u, vis: true, d: 0 });
    return new Response(null, { status: 101, webSocket: par[0], headers: { 'Sec-WebSocket-Protocol': 'lembra' } });
  }
  async webSocketMessage(w, m) {
    if (typeof m !== 'string' || m.length > 300) return;
    let o; try { o = JSON.parse(m); } catch { return; }
    const a = w.deserializeAttachment() || {};
    if (o.t === 'vis') return w.serializeAttachment({ ...a, vis: o.v === true });
    if (o.t === 'dig' && typeof o.para === 'string') { // "digitando…" (no máximo um a cada 2 s, só entre amigos)
      if (Date.now() - (a.d || 0) < 2000) return;
      w.serializeAttachment({ ...a, d: Date.now() });
      const l = (await this.kv.get(`friends:${a.u}`, 'json')) || [];
      if (l.includes(o.para)) this.http.AVISA(o.para, { t: 'dig', de: a.u, v: o.v === 'audio' ? 'audio' : 'txt' });
    }
  }
  async webSocketClose(w, code) { try { w.close(code === 1005 || code === 1006 ? 1000 : code); } catch { /* ok */ } }
  async webSocketError() { /* o navegador reconecta */ }

  async fetch(req) {
    if (req.headers.get('Upgrade') === 'websocket' && new URL(req.url).pathname === '/ws') return this.ws(req);
    const res = await safeHandle(req, this.http);
    // alguém entrou na fila (cadastro, primeira agenda): grava já, para não se perder se o servidor dormir
    try { await this.due.flush(); } catch (e) { console.log('fila', e.message); }
    try { await this.savePresence(); } catch (e) { console.log('presença', e.message); }
    return res;
  }

  /* foto de quem está no app (no máximo a cada 10 s, só se mudou, só quem apareceu nos últimos 15 min) */
  async savePresence(force = false) {
    if (!force && Date.now() - this.presSaved < 10e3) return;
    const cut = Date.now() - 15 * 60e3, snap = {};
    for (const [k, v] of this.presence) if (v.lastPing > cut) snap[k] = v;
    const sig = JSON.stringify(snap);
    if (sig === this.presSig) return;
    this.presSig = sig; this.presSaved = Date.now();
    await this.kv.put('presence-snap', sig);
  }

  /* relógio (a cada minuto) e continuação dos lotes (alarme) */
  async tick() { return this.run(); }
  async alarm() {
    if (!(await this.kv.get('migrated:kv'))) { await this.migrate(); return; }
    await this.run();
  }
  async run() {
    if (this.running) return { busy: true };
    if (!(await this.kv.get('migrated:kv'))) { await this.migrate(); return { migrating: true }; }
    this.running = true;
    const t0 = performance.now(), n0 = NET.ms;
    try {
      const r = await cronTick(this.bg, {});
      // últimas execuções do relógio (para o painel e para os testes de carga)
      this.runs.push({ at: Date.now(), ms: Math.round(performance.now() - t0), semRede: Math.round(performance.now() - t0 - (NET.ms - n0)), pushes: r.pushes || 0, keys: r.processed || 0, more: !!r.more });
      if (this.runs.length > 60) this.runs.splice(0, this.runs.length - 60);
      if (r.more) await this.ctx.storage.setAlarm(Date.now() + 50); // continua o lote quase na hora
      this.kv.sweep(120);
      this.social.limpa(); // mensagens, fotos e áudios com mais de 24 h: apagados de verdade
      await this.due.flush();
      await this.savePresence(true);
      return r;
    } catch (e) {
      console.log('relógio', e.stack || e.message);
      await this.ctx.storage.setAlarm(Date.now() + 30e3);
      return { error: e.message };
    } finally { this.running = false; }
  }
}

const hub = (env) => env.HUB.get(env.HUB.idFromName(HUB));
export default {
  fetch: (req, env) => hub(env).fetch(req),
  scheduled: (_e, env, ctx) => ctx.waitUntil(hub(env).tick()),
};
