/* Servidor gratuito do Calendário (Cloudflare Workers) — publicado pelo Cloudflare a partir do GitHub.
   - Notificações em tempo real para o parceiro (/notify)
   - Lembretes no horário certo: o app envia a lista (/schedule) e o servidor
     confere a cada minuto, mesmo com os celulares fechados
   - Conversa com o Claude dentro do app (/ask), se houver chave da Anthropic
   Dados guardados no KV "CAL": chaves VAPID, aparelhos e lista de lembretes. */
import { generateVapid, sendPush } from './webpush.js';
import { verifyIdToken } from './auth.js';

const SUBJECT = 'mailto:avisos@calendario.app';

async function getVapid(env) {
  let v = await env.CAL.get('vapid', 'json');
  if (!v) {
    v = await generateVapid();
    await env.CAL.put('vapid', JSON.stringify(v));
  }
  return v;
}
const getSubs = async (env) => (await env.CAL.get('subs', 'json')) || {};
const getSchedule = async (env) => (await env.CAL.get('schedule', 'json')) || { items: [], sent: {} };

/* Manda para todos os aparelhos de uma pessoa, respeitando as preferências do aparelho */
async function sendToMember(env, member, msg, pref, statuses = []) {
  const [subs, vapid] = await Promise.all([getSubs(env), getVapid(env)]);
  let sent = 0, changed = false;
  await Promise.all(Object.entries(subs).map(async ([id, d]) => {
    if (d.member !== member) return;
    if (pref && d.prefs && d.prefs[pref] === false) return;
    try {
      const status = await sendPush(d.subscription, msg, vapid, { subject: SUBJECT });
      console.log(`envio para ${member}: ${status} — ${msg.title}`);
      statuses.push(status);
      if (status === 404 || status === 410) {
        delete subs[id];
        changed = true;
      } else if (status < 300) sent++;
    } catch (e) {
      console.log('falha no envio', member, e.message);
      statuses.push('erro: ' + e.message);
    }
  }));
  if (changed) await env.CAL.put('subs', JSON.stringify(subs));
  return sent;
}

/* ---------- lembretes (a cada minuto) ---------- */
async function runSchedule(env) {
  const now = Date.now();
  const sch = await getSchedule(env);
  const due = sch.items.filter((it) => it.at <= now && it.at > now - 15 * 60e3 && !sch.sent[it.id]);
  if (!due.length) return 0;
  for (const it of due) {
    sch.sent[it.id] = now;
    await sendToMember(env, it.member, { title: it.title, body: it.body, tag: it.tag, url: it.url, badge: it.badge }, it.kind);
  }
  // limpa registros de envio com mais de 3 dias
  for (const [k, t] of Object.entries(sch.sent)) if (t < now - 3 * 86400e3) delete sch.sent[k];
  await env.CAL.put('schedule', JSON.stringify(sch));
  return due.length;
}

/* ---------- HTTP ---------- */
const cors = (env, req) => {
  const origin = req.headers.get('Origin') || '';
  const allowed = (env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
  const ok = allowed.includes(origin) || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
  return {
    'Access-Control-Allow-Origin': ok ? origin : allowed[0] || '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
};
const reply = (env, req, data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', ...cors(env, req) } });

const clean = (s, n) => String(s || '').slice(0, n);
const MEMBERS = (env) => JSON.parse(env.TEAM || '[]').map((m) => m.id);

async function handle(req, env) {
  const url = new URL(req.url);
  if (req.method === 'OPTIONS') return new Response(null, { headers: cors(env, req) });
  if (url.pathname === '/vapid') return reply(env, req, { publicKey: (await getVapid(env)).publicKey });
  if (url.pathname === '/' || url.pathname === '/health') return reply(env, req, { ok: true, servico: 'Calendário' });
  if (req.method !== 'POST') return reply(env, req, { error: 'método não permitido' }, 405);

  let me;
  try {
    me = await verifyIdToken((req.headers.get('Authorization') || '').replace(/^Bearer\s+/i, ''), env);
  } catch (e) {
    return reply(env, req, { error: 'Sem permissão: ' + e.message }, 401);
  }
  const body = await req.json().catch(() => ({}));

  if (url.pathname === '/subscribe') {
    const s = body.subscription;
    if (!s?.endpoint || !/^https:\/\//.test(s.endpoint) || !s.keys?.p256dh || !s.keys?.auth) return reply(env, req, { error: 'aparelho inválido' }, 400);
    const subs = await getSubs(env);
    const id = clean(body.id, 80) || s.endpoint.slice(-40);
    subs[id] = {
      member: me.id,
      subscription: { endpoint: s.endpoint, keys: { p256dh: clean(s.keys.p256dh, 200), auth: clean(s.keys.auth, 100) } },
      prefs: { reminders: body.prefs?.reminders !== false, partner: body.prefs?.partner !== false, daily: body.prefs?.daily !== false },
      updatedAt: Date.now(),
    };
    await env.CAL.put('subs', JSON.stringify(subs));
    return reply(env, req, { ok: true, id });
  }

  if (url.pathname === '/notify') {
    const to = (Array.isArray(body.to) ? body.to : []).filter((m) => MEMBERS(env).includes(m) && m !== me.id);
    const msg = { title: clean(body.title, 120), body: clean(body.body, 300), tag: clean(body.tag, 80), url: clean(body.url, 200) || './' };
    if (!msg.title) return reply(env, req, { error: 'sem texto' }, 400);
    const sent = (await Promise.all(to.map((m) => sendToMember(env, m, msg, 'partner')))).reduce((a, b) => a + b, 0);
    return reply(env, req, { ok: true, sent });
  }

  if (url.pathname === '/schedule') {
    const now = Date.now();
    const items = (Array.isArray(body.items) ? body.items : [])
      .filter((it) => it && MEMBERS(env).includes(it.member) && Number.isFinite(it.at) && it.at > now - 15 * 60e3 && it.at < now + 8 * 86400e3)
      .slice(0, 1500)
      .map((it) => ({ id: clean(it.id, 120), at: it.at, member: it.member, title: clean(it.title, 120), body: clean(it.body, 300), tag: clean(it.tag, 80), url: clean(it.url, 200), kind: ['reminders', 'daily'].includes(it.kind) ? it.kind : 'reminders', badge: Number.isFinite(it.badge) ? it.badge : undefined }));
    const sch = await getSchedule(env);
    await env.CAL.put('schedule', JSON.stringify({ items, sent: sch.sent, updatedAt: now, by: me.id }));
    return reply(env, req, { ok: true, count: items.length });
  }

  if (url.pathname === '/test') {
    const statuses = [];
    const sent = await sendToMember(env, me.id, { title: 'Notificações ativadas ✓', body: 'É assim que os lembretes e os avisos do parceiro vão chegar.', tag: 'teste', url: './' }, null, statuses);
    const subs = await getSubs(env);
    return reply(env, req, { ok: true, sent, devices: Object.values(subs).filter((d) => d.member === me.id).length, statuses });
  }

  if (url.pathname === '/ask') {
    if (!env.ANTHROPIC_API_KEY) return reply(env, req, { error: 'A chave do Claude ainda não foi configurada no servidor.' }, 412);
    const { askClaude } = await import('./claude.js');
    try {
      const answer = await askClaude(env, { question: clean(body.question, 2000), history: body.history, context: clean(body.context, 60000), me });
      return reply(env, req, { answer });
    } catch (e) {
      return reply(env, req, { error: e.message || 'O Claude não respondeu. Tente de novo.' }, e.status || 502);
    }
  }
  return reply(env, req, { error: 'não encontrado' }, 404);
}

export default {
  fetch: (req, env) => handle(req, env).catch((e) => reply(env, req, { error: 'erro interno: ' + e.message }, 500)),
  scheduled: (_event, env, ctx) => ctx.waitUntil(runSchedule(env)),
};
export { runSchedule, handle };
