/* Servidor gratuito do Calendário (Cloudflare Workers) — publicado pelo Cloudflare a partir do GitHub.
   - Notificações em tempo real para o parceiro (/notify)
   - Lembretes no horário certo: o app envia a lista (/schedule) e o servidor
     confere a cada minuto, mesmo com os celulares fechados
   - Conversa com o Claude dentro do app (/ask), se houver chave da Anthropic
   Dados guardados num Durable Object com SQLite (veja entry.js e kvsql.js): chaves VAPID, aparelhos,
   listas de lembretes e a fila do relógio. O código usa a mesma interface do KV (env.CAL). */
import { generateVapid, sendPush } from './webpush.js';
import { verifyIdToken } from './auth.js';
import { recordAct, getBoard, adminBoard, monthlyAward, eligible as rankEligible, standing as rankStanding, weekKey as rankWeek } from './rank.js';
import { getBill, putBill, stripe as stripeApi } from './billing.js';
import { getDevices, removeDevices, addDevice, upgradeSubs } from './devices.js';
import { runTick, planReminders, planPersonal, seedPerson, upgradeLegacy, usageMeter } from './tick.js';
import { dueOf } from './kvsql.js';
import { regGet, regPut, regDel, regAll, idOfWs } from './registry.js';
import { boardOf } from './leaderboard.js';
import { startTrial, billingStatus, createCheckout, createPortal, verifyStripe, handleStripeEvent, billingAll, syncTeam, teamActive, closeBilling, untilOf, statusOf, grantComp, markVipSent, vipMigrate } from './billing.js';

const SUBJECT = 'mailto:avisos@calendario.app';

const vapidMem = new WeakMap();
async function getVapid(env) {
  const hit = vapidMem.get(env.CAL);
  if (hit) return hit;
  let v = await env.CAL.get('vapid', 'json');
  if (!v) {
    v = await generateVapid();
    await env.CAL.put('vapid', JSON.stringify(v));
  }
  vapidMem.set(env.CAL, v);
  return v;
}

/* Manda para todos os aparelhos de uma pessoa, respeitando as preferências do aparelho.
   meter.pushes conta as tentativas (o relógio para o lote antes de passar do limite grátis). */
async function sendToMember(env, member, msg, pref, statuses = [], meter = null) {
  const devs = await getDevices(env, member);
  const list = Object.entries(devs).filter(([, d]) => !(pref && d.prefs && d.prefs[pref] === false));
  if (!list.length) return 0;
  const vapid = await getVapid(env);
  let sent = 0;
  const dead = [];
  await Promise.all(list.map(async ([id, d]) => {
    if (meter) meter.pushes = (meter.pushes || 0) + 1;
    try {
      let status;
      try { status = await sendPush(d.subscription, msg, vapid, { subject: SUBJECT }); }
      catch (e) { await new Promise((r) => setTimeout(r, 400)); status = await sendPush(d.subscription, msg, vapid, { subject: SUBJECT }); } // falha de rede: mais uma tentativa
      // serviço de push ocupado ou fora do ar por um instante: tenta mais uma vez
      if (status === 429 || status >= 500) status = await sendPush(d.subscription, msg, vapid, { subject: SUBJECT });
      if (status >= 300) console.log(`envio para ${member}: ${status}`); // só os problemas (cada log custa processamento)
      statuses.push(status);
      if (status === 404 || status === 410) dead.push(id);
      else if (status < 300) sent++;
    } catch (e) {
      console.log('falha no envio', member, e.message);
      statuses.push('erro: ' + e.message);
    }
  }));
  if (dead.length) await removeDevices(env, member, dead);
  return sent;
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
const SEC = { 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer', 'Cache-Control': 'no-store' };
const reply = (env, req, data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', ...SEC, ...cors(env, req) } });

const clean = (s, n) => String(s || '').slice(0, n);
/* quem está com o app aberto agora (na memória do servidor) */
const presences = new WeakMap();
const presenceOf = (env) => env.PRESENCE || presences.get(env.CAL) || (presences.set(env.CAL, new Map()), presences.get(env.CAL));
/* Endereço de uma notificação: só telas do próprio app ("./" ou "./#/e/<id>"), nunca um site de fora */
const appUrl = (u) => { const v = String(u || ''); return /^\.\/(#\/[\w/-]{0,120})?$/.test(v) ? v : './'; };
const MEMBERS = (env) => JSON.parse(env.TEAM || '[]').map((m) => m.id);
/* Com quem a pessoa divide a agenda: a dupla entre si; agenda compartilhada (paga), o dono e os convidados;
   conta própria, só ela mesma */
const membersOf = (me, env) => (me.ws === 'main' ? MEMBERS(env) : me.team ? [me.team.ownerId, ...me.team.members.map((m) => m.id)] : [me.id]);
/* Em qual agenda a pessoa está mexendo: a própria ou a de uma equipe em que entrou (conferido aqui) */
export async function withWorkspace(env, me, ws) {
  if (me.ws === 'main') return me;
  const target = /^[A-Za-z0-9]{6,64}$/.test(ws || '') ? ws : me.ws;
  const team = await env.CAL.get(`team:${target}`, 'json');
  if (target === me.ws) return team && team.members?.length && (await teamActive(env, team)) ? { ...me, team } : me;
  if (!team || !(team.members || []).some((m) => m.uid === me.ws) || !(await teamActive(env, team))) throw Object.assign(new Error('Você não faz parte dessa agenda compartilhada (ou ela não está ativa).'), { status: 403 });
  return { ...me, ws: target, team, guest: true };
}
const scheduleKey = (me) => (me.ws === 'main' ? 'schedule' : `schedule:${me.ws}`);
/* Contas próprias conhecidas pelo servidor (para os lembretes e mensagens rodarem para elas também) */
async function registerUser(env, me, st = null) {
  if (me.ws === 'main' || me.guest) return; // convidado: o relógio já roda pela agenda do dono
  const cur = await regGet(env, me.id);
  const until = st ? untilOf(st) : cur?.until;
  if (cur && cur.name === me.name && cur.ws === me.ws && cur.until === until) return; // já conhecido: não gasta gravação
  await regPut(env, me.id, { name: me.name, ws: me.ws, at: cur?.at || Date.now(), ...(until !== undefined ? { until } : {}) });
  if ((until || 0) > Date.now()) await seedPerson(env, me.id);
}
/* Conta nova abriu o app pela primeira vez: avisa o dono do app no celular (nome e e-mail).
   Quem já existia (já tem cobrança ou já está no registro) é só marcado, sem aviso. */
async function announceNewUser(env, me) {
  if (me.ws === 'main' || me.guest || !me.id) return;
  const key = `known:${me.id}`;
  if (await env.CAL.get(key)) return;
  await env.CAL.put(key, String(Date.now()));
  if ((await regGet(env, me.id)) || (await env.CAL.get(`bill:${me.ws}`))) return; // conta antiga
  const em = (env.ADMIN_EMAIL || JSON.parse(env.TEAM || '[]')[0]?.email || '').toLowerCase();
  if ((me.email || '').toLowerCase() === em || me.founder) return;
  const owner = await adminMember(env);
  if (!owner) return;
  const total = Number(await env.CAL.get('signups-count') || 0) + 1;
  await env.CAL.put('signups-count', String(total));
  await sendToMember(env, owner, { title: `🎉 Novo cadastro: ${me.name || 'Sem nome'}`, body: `${me.email || ''} acabou de criar uma conta no Lembra. Total: ${total} cadastros.`, tag: `novo-${me.id}`, url: './' });
}
/* Plano mudou (pagou, renovou, cancelou, reembolso, teste começou): atualiza até quando a conta tem direito */
async function refreshUntil(env, ws) {
  if (!ws || ws === 'main') return;
  const st = await billingStatus(env, { ws, id: '' });
  const until = untilOf(st);
  const id = idOfWs(ws), u = await regGet(env, id);
  if (!u || u.until === until) return;
  const back = until > Date.now() && !((u.until || 0) > Date.now());
  await regPut(env, id, { ...u, until });
  if (back) await seedPerson(env, id); // voltou a ter plano: o relógio volta a olhar a pessoa
}
/* Tem plano ativo? (teste, mensal, vitalício, convidado de agenda compartilhada ativa ou a dupla).
   Sem plano: o servidor não guarda lembretes, não manda mensagens e o assistente não responde. */
async function entitled(env, me) {
  if (me.ws === 'main' || me.guest) return { plan: 'team', active: true };
  return billingStatus(env, me);
}
const LOCKED = { error: 'Sem plano ativo: comece o teste grátis ou assine para usar.', locked: true };
/* Registro com o prazo do plano; contas antigas (sem prazo) são conferidas uma vez */
async function registry(env, now = Date.now()) {
  const reg = await regAll(env);
  for (const [id, u] of Object.entries(reg)) if (u.until === undefined) { u.until = untilOf(statusOf(await env.CAL.get(`bill:${u.ws}`, 'json'), { ws: u.ws }, now), now); await regPut(env, id, u); }
  return reg;
}
const activeRegs = (reg, now = Date.now()) => Object.entries(reg).filter(([, u]) => (u.until || 0) > now);
/* Todas as pessoas para o relógio: a dupla + contas próprias COM PLANO ATIVO */
export async function everyone(env) {
  // a antiga dupla agora são duas contas próprias (entram pelo registro, como todo mundo)
  const reg = await registry(env);
  return [...activeRegs(reg).map(([id, u]) => ({ id, name: u.name, ws: u.ws, ctxKey: `coach-ctx:${u.ws}` }))];
}
/* id do dono do app nos avisos (gravado quando ele usa o app; antes, o da lista TEAM) */
let adminSeen = '';
async function adminMember(env) {
  const saved = await env.CAL.get('admin-member');
  if (saved) return saved;
  const em = (env.ADMIN_EMAIL || JSON.parse(env.TEAM || '[]')[0]?.email || '').toLowerCase();
  return JSON.parse(env.TEAM || '[]').find((m) => (m.email || '').toLowerCase() === em)?.id || null;
}
async function rememberAdmin(env, me) {
  if (!isAdmin(env, me) || adminSeen === me.id) return;
  adminSeen = me.id;
  if ((await env.CAL.get('admin-member')) !== me.id) await env.CAL.put('admin-member', me.id);
}
/* Dono do app (painel): e-mail configurado no servidor (ADMIN_EMAIL) */
const isAdmin = (env, me) => {
  const owner = (env.ADMIN_EMAIL || JSON.parse(env.TEAM || '[]')[0]?.email || '').toLowerCase();
  return !!owner && (me.email || '').toLowerCase() === owner;
};
/* Separa o texto da resposta das ações (<acoes>[...]</acoes>) que o app executa após confirmação */
export function splitActions(raw) {
  let text = String(raw || '');
  let actions = [];
  const m = /<acoes>\s*([\s\S]*?)\s*(?:<\/acoes>|$)/i.exec(text) || /```json\s*(\[[\s\S]*?\])\s*```/i.exec(text);
  if (m) {
    try {
      const j = JSON.parse(m[1].replace(/^[^\[{]*/, '').replace(/[^\]}]*$/, ''));
      actions = (Array.isArray(j) ? j : [j]).filter((a) => a && typeof a === 'object' && typeof a.acao === 'string').slice(0, 20);
    } catch { /* sem ações válidas */ }
    text = text.replace(m[0], '').trim();
  }
  return { answer: text.replace(/<\/?acoes>/gi, '').trim() || (actions.length ? 'Pronto, confira e confirme abaixo 👇' : ''), actions };
}

/* Resumo da agenda pessoal usado pelas mensagens de ânimo (só títulos, datas e categorias) */
function cleanProfile(p, me) {
  const arr = (a, n) => (Array.isArray(a) ? a.slice(0, n) : []);
  const ev = (x) => ({ title: clean(x?.title, 80), cat: clean(x?.cat, 20), time: /^\d{2}:\d{2}$/.test(x?.time || '') ? x.time : null, done: !!x?.done });
  const day = (d) => (/^\d{4}-\d{2}-\d{2}$/.test(d || '') ? d : null);
  const byCat = (o) => Object.fromEntries(Object.entries(o && typeof o === 'object' ? o : {}).slice(0, 12).map(([k, v]) => [clean(k, 20), day(v)]).filter(([, v]) => v));
  const P = p.prefs || {};
  return {
    name: me.name,
    ia: p.ia === true, // a pessoa autorizou a IA no app (sem isso, só frases prontas)
    date: day(p.date),
    prefs: {
      nudges: P.nudges !== false, water: P.water !== false, meals: P.meals !== false, faith: P.faith !== false, freq: ['alta', 'normal', 'calma'].includes(P.freq) ? P.freq : 'normal',
      // horários da ficha (janela das mensagens do dia) e o tom que a pessoa escolheu
      ...Object.fromEntries(['wake', 'sleep', 'lunch'].filter((k) => /^\d{2}:\d{2}$/.test(P[k] || '')).map((k) => [k, P[k]])),
      ...(['carinhoso', 'firme', 'direto'].includes(P.tone) ? { tone: P.tone } : {}),
      ...(['f', 'm', 'n'].includes(P.pronoun) ? { pronoun: P.pronoun } : {}),
      // perfil psicológico da ficha (as mensagens se adaptam a cada pessoa)
      ...(typeof P.nickname === 'string' && P.nickname.trim() ? { nickname: clean(P.nickname, 30) } : {}),
      ...(Number.isFinite(P.age) && P.age > 5 && P.age < 120 ? { age: Math.round(P.age) } : {}),
      ...(typeof P.religion === 'string' && /^[a-z_]{2,20}$/.test(P.religion) ? { religion: P.religion } : {}),
      ...(P.motivation === false ? { motivation: false } : {}),
      ...(Number.isFinite(P.perDay) ? { perDay: Math.max(2, Math.min(16, Math.round(P.perDay))) } : {}),
      ...(Number.isFinite(P.waterEvery) ? { waterEvery: [0, 60, 90, 120, 150, 180, 240].includes(P.waterEvery) ? P.waterEvery : 150 } : {}),
      ...(P.mind && typeof P.mind === 'object' ? { mind: {
        motivation: ['baixa', 'media', 'alta'].includes(P.mind.motivation) ? P.mind.motivation : null,
        selfesteem: ['baixa', 'oscila', 'boa'].includes(P.mind.selfesteem) ? P.mind.selfesteem : null,
        anxiety: ['muita', 'as_vezes', 'pouca'].includes(P.mind.anxiety) ? P.mind.anxiety : null,
        traits: (Array.isArray(P.mind.traits) ? P.mind.traits : []).filter((t) => /^[a-z_]{3,20}$/.test(t)).slice(0, 8),
        focus: (Array.isArray(P.mind.focus) ? P.mind.focus : []).filter((t) => /^[a-z_]{2,20}$/.test(t)).slice(0, 10),
      } } : {}),
    },
    work: p.work && typeof p.work === 'object' ? { profession: clean(p.work.profession, 80), goal: clean(p.work.goal, 80) } : null,
    today: arr(p.today, 20).map(ev), tomorrow: arr(p.tomorrow, 20).map(ev), overdue: arr(p.overdue, 10).map(ev),
    lastByCat: byCat(p.lastByCat), nextByCat: byCat(p.nextByCat),
    birthdays: arr(p.birthdays, 10).map((b) => ({ name: clean(b?.name, 60), inDays: Number.isFinite(b?.inDays) ? b.inDays : 99 })),
    lists: arr(p.lists, 10).map((l) => ({ name: clean(l?.name, 60), open: Number.isFinite(l?.open) ? l.open : 0 })),
    updatedAt: Date.now(),
  };
}

/* A pessoa entrou mesmo na equipe? Lê teams/{dono}/joins/{uid} no Firestore com o login do próprio dono
   (as regras do banco só deixam criar esse registro gastando um convite válido). */
async function joinedProof(env, token, owner, uid) {
  if (!env.PROJECT_ID || !token) return false;
  const base = (env.FIRESTORE_URL || 'https://firestore.googleapis.com').replace(/\/+$/, '');
  try {
    const r = await fetch(`${base}/v1/projects/${env.PROJECT_ID}/databases/(default)/documents/teams/${owner}/joins/${uid}`, { headers: { Authorization: `Bearer ${token}` } });
    if (!r.ok) return false;
    const j = await r.json();
    return !!j?.fields?.token?.stringValue;
  } catch { return false; }
}

/* Limite de pedidos por minuto (por pessoa e por rota). Protege contra abuso e contra derrubar o servidor. */
const LIMITS = { '/admin/grant': 30, '/admin/nudge-update': 20, '/log': 10, '/notify': 60, '/schedule': 30, '/personal': 30, '/coach': 20, '/ask': 15, '/tidy': 20, '/billing/checkout': 8, '/billing/portal': 8, '/billing/store-verify': 10, '/billing/trial': 5, '/subscribe': 10, '/unsubscribe': 10, '/test': 6, '/coach-test': 4, '/pnudge-test': 4, '/account/delete': 3, '/share/sync': 20, '/seen': 20, '/support/send': 10, '/support/thread': 30, '/support/inbox': 30, '/support/reply': 30, '/rank/act': 40, '/rank/board': 20, '/rank/admin': 20, '/friends/link': 10, '/friends/open': 20, '/friends/answer': 30, '/friends/remove': 20, '/friends/card': 10, '/friends/list': 30, '/friends/story-post': 6, '/friends/story-delete': 10, '/friends/stories': 30, '/friends/story-view': 90, '/friends/story-viewers': 20, '/friends/visit': 30, '/friends/visitors': 20, '/friends/report': 10, '/friends/block': 10, '/lb/report': 20, '/lb/board': 40 };
const hits = new Map();
export function tooMany(key, max, now = Date.now()) {
  const h = hits.get(key);
  if (!h || now - h.t > 60e3) { hits.set(key, { t: now, n: 1 }); if (hits.size > 5000) hits.clear(); return false; }
  h.n++;
  return h.n > max;
}
const MAX_BODY = 1_500_000; // 1,5 MB (a lista de lembretes de 8 dias cabe com folga)

async function handle(req, env) {
  const url = new URL(req.url);
  if (Number(req.headers.get('Content-Length') || 0) > MAX_BODY) return reply(env, req, { error: 'pedido grande demais' }, 413);
  if (req.method === 'OPTIONS') return new Response(null, { headers: cors(env, req) });
  if (url.pathname === '/vapid') return reply(env, req, { publicKey: (await getVapid(env)).publicKey });
  if (url.pathname === '/' || url.pathname === '/health') return reply(env, req, { ok: true, servico: 'Lembra', chat: !!(env.ANTHROPIC_API_KEY || env.AI) });
  // Abre o lembrete direto na tela "Adicionar ao Calendário" do iPhone (sem menu de apps)
  if (url.pathname === '/ics' && req.method === 'POST') {
    const form = await req.formData().catch(() => null);
    const text = String((form && form.get('ics')) || '');
    if (!text.startsWith('BEGIN:VCALENDAR') || text.length > 300000) return new Response('Arquivo inválido', { status: 400 });
    if (/<\s*script|<\s*html|javascript:/i.test(text)) return new Response('Arquivo inválido', { status: 400 });
    return new Response(text, { headers: { 'Content-Type': 'text/calendar; charset=utf-8', 'Content-Disposition': 'inline; filename="lembrete.ics"', 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'no-store' } });
  }
  // Avisos da Stripe (pagamento confirmado, renovação, cancelamento): conferidos pela assinatura
  if (url.pathname === '/billing/webhook' && req.method === 'POST') {
    const payload = await req.text();
    if (payload.length > 512_000) return new Response('grande demais', { status: 413 });
    try {
      const ev = await verifyStripe(env, payload, req.headers.get('Stripe-Signature'));
      const uid = await handleStripeEvent(env, ev);
      if (uid) await refreshUntil(env, uid);
      return new Response('ok');
    } catch (e) {
      console.log('webhook stripe', e.message);
      return new Response('assinatura inválida', { status: 400 });
    }
  }
  if (req.method !== 'POST') return reply(env, req, { error: 'método não permitido' }, 405);

  // ajuda sem login (ex.: "o e-mail de trocar a senha não chegou"): vai para a caixa de suporte do dono
  if (url.pathname === '/support/guest') {
    const ip = req.headers.get('CF-Connecting-IP') || 'local';
    if (tooMany(`guest:${ip}`, 3)) return reply(env, req, { error: 'Muitos pedidos seguidos. Espere um minuto.' }, 429);
    let b = {};
    try { b = JSON.parse((await req.text()).slice(0, 4000) || '{}'); } catch { b = {}; }
    const email = clean(b.email, 120).trim().toLowerCase(), text = clean(b.text, 1000).trim();
    if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email)) return reply(env, req, { error: 'Digite um e-mail válido para a gente responder.' }, 400);
    if (text.length < 5) return reply(env, req, { error: 'Escreva o que aconteceu.' }, 400);
    const day = new Date().toISOString().slice(0, 10), dk = `guest-day:${day}`;
    const n = Number((await env.CAL.get(dk)) || 0);
    if (n > 200) return reply(env, req, { error: 'Muitos pedidos hoje. Tente amanhã ou escreva para o e-mail de suporte.' }, 429);
    await env.CAL.put(dk, String(n + 1), { expirationTtl: 2 * 86400 });
    const id = 'g' + Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(email)))).slice(0, 8).map((x) => x.toString(16).padStart(2, '0')).join('');
    const now = Date.now(), key = `support:${id}`;
    const th = (await env.CAL.get(key, 'json')) || { id, name: 'Sem login', email, msgs: [], guest: true };
    th.msgs.push({ from: 'user', text: `[${b.about === 'senha' ? 'Não consegue entrar / senha' : 'Pedido de ajuda'}] ${text}`, at: now });
    th.msgs = th.msgs.slice(-50); th.updatedAt = now; th.unread = (th.unread || 0) + 1; th.guest = true;
    await env.CAL.put(key, JSON.stringify(th));
    const idx = (await env.CAL.get('support-index', 'json')) || {};
    idx[id] = { name: 'Sem login', email, at: now, unread: th.unread, last: text.slice(0, 80), guest: true };
    await env.CAL.put('support-index', JSON.stringify(idx));
    const owner = await adminMember(env);
    if (owner) await sendToMember(env, owner, { title: '🔑 Ajuda sem login', body: `${email}: ${text.slice(0, 140)}`, tag: `sup-${id}`, url: './#/suporte-dono' }).catch(() => 0);
    return reply(env, req, { ok: true });
  }

  let me;
  try {
    me = await verifyIdToken((req.headers.get('Authorization') || '').replace(/^Bearer\s+/i, ''), env);
  } catch (e) {
    return reply(env, req, { error: 'Sem permissão: ' + e.message }, 401);
  }
  if (tooMany(`${me.id}:${url.pathname}`, LIMITS[url.pathname] || 120)) return reply(env, req, { error: 'Muitos pedidos seguidos. Espere um minuto.' }, 429);
  await rememberAdmin(env, me).catch(() => {});
  const raw = await req.text().catch(() => '');
  if (raw.length > MAX_BODY) return reply(env, req, { error: 'pedido grande demais' }, 413);
  let body = {};
  try { body = raw ? JSON.parse(raw) : {}; } catch { body = {}; }
  if (!body || typeof body !== 'object' || Array.isArray(body)) body = {};

  // ---------- agenda compartilhada (complemento pago) ----------
  if (url.pathname === '/share/sync') {
    try {
      const wanted = (Array.isArray(body.members) ? body.members : []).slice(0, 20).map((m) => ({ uid: clean(m?.uid, 64), name: clean(m?.name, 40) })).filter((m) => /^[A-Za-z0-9]{6,64}$/.test(m.uid));
      // segurança: só entra quem tem a prova de entrada no banco (criada pela própria pessoa ao gastar um convite).
      // O dono não consegue colocar alguém na equipe só por mandar a lista.
      const token = (req.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '');
      const proven = await Promise.all(wanted.map((m) => joinedProof(env, token, me.ws, m.uid)));
      return reply(env, req, await syncTeam(env, me, wanted.filter((_, i) => proven[i]), Date.now(), clean(body.ownerName, 40)));
    } catch (e) { return reply(env, req, { error: e.message }, e.status || 500); }
  }
  if (url.pathname === '/share/status') {
    try {
      const w = await withWorkspace(env, me, clean(body.ws, 64));
      return reply(env, req, { ok: true, ws: w.ws, active: !!w.team, members: w.team ? membersOf(w, env) : [me.id] });
    } catch (e) { return reply(env, req, { ok: false, error: e.message }, e.status || 500); }
  }
  // as outras rotas valem para a agenda que a pessoa está usando (a própria ou a compartilhada)
  if (['/notify', '/schedule', '/coach'].includes(url.pathname)) {
    try { me = await withWorkspace(env, me, clean(body.ws, 64)); } catch (e) { return reply(env, req, { error: e.message }, e.status || 403); }
  }

  // ---------- cobrança e teste grátis ----------
  if (url.pathname === '/billing/status') {
    await announceNewUser(env, me).catch((e) => console.log('aviso de cadastro', e.message));
    const st = { ...(await billingStatus(env, me)), foundersLeft: Math.max(0, 200 - Number(await env.CAL.get('founders-count') || 0)) };
    if (st.vip) st.vip.total = Math.max(st.vip.no, Number(await env.CAL.get('vip-count') || 0));
    // mantém o prazo do relógio em dia (ex.: o teste acabou, o mensal renovou)
    if (me.ws !== 'main') { const cur = await regGet(env, me.id); if ((cur || me.founder) && cur?.until !== untilOf(st)) await registerUser(env, me, st); }
    return reply(env, req, st);
  }
  if (url.pathname === '/billing/trial') {
    const st = await startTrial(env, me, { deviceId: clean(body.deviceId, 80), ip: req.headers.get('CF-Connecting-IP') || '', cpf: clean(body.cpf, 20) });
    await registerUser(env, me, st);
    return reply(env, req, st);
  }
  let plan = null;
  if (['/notify', '/schedule', '/coach', '/personal', '/ask', '/tidy', '/test', '/coach-test', '/pnudge-test'].includes(url.pathname)) {
    plan = await entitled(env, me);
    if (!plan.active) return reply(env, req, LOCKED, 402);
    // assistente com IA: recurso do plano Profissional
    if (['/ask', '/tidy'].includes(url.pathname) && plan.tier === 'essencial') return reply(env, req, { error: 'O assistente com IA faz parte do plano Profissional.', upgrade: true }, 402);
  }
  if (url.pathname === '/billing/checkout' || url.pathname === '/billing/portal') {
    try {
      const fn = url.pathname === '/billing/checkout' ? createCheckout : createPortal;
      return reply(env, req, await fn(env, me, { plan: clean(body.plan, 20), returnUrl: clean(body.returnUrl, 300) }));
    } catch (e) {
      return reply(env, req, { error: e.message }, e.status || 500);
    }
  }
  if (url.pathname === '/admin/grant') {
    if (!isAdmin(env, me)) return reply(env, req, { error: 'só o dono do app' }, 403);
    try {
      const uid = clean(body.uid, 64);
      const { gifted, ...st } = await grantComp(env, uid, body.on === true, Date.now(), Number(body.until) || 0);
      await refreshUntil(env, uid);
      // presente vitalício: aviso no celular da pessoa (sem dizer o que é: a surpresa fica para quando ela abrir)
      let sent = 0;
      if (gifted) { sent = await vipNotify(env, uid); await markVipSent(env, uid, sent); st.vip = { ...st.vip, sent }; }
      return reply(env, req, { ok: true, status: st, ...(gifted ? { gifted: true, sent } : {}) });
    } catch (e) { return reply(env, req, { error: e.message }, e.status || 500); }
  }
  // dono do app pede para uma pessoa atualizar (notificação que abre o app já na versão nova)
  if (url.pathname === '/admin/nudge-update') {
    if (!isAdmin(env, me)) return reply(env, req, { error: 'só o dono do app' }, 403);
    const uid = clean(body.uid, 64), email = clean(body.email, 120).toLowerCase(), v = /^\d+\.\d+\.\d+$/.test(body.version || '') ? body.version : '';
    const teamMember = JSON.parse(env.TEAM || '[]').find((m) => (m.email || '').toLowerCase() === email);
    const member = teamMember ? teamMember.id : 'u' + uid.replace(/[^A-Za-z0-9]/g, '').slice(0, 24);
    const sent = await sendToMember(env, member, { title: `✨ Lembra ${v ? v + ' ' : ''}chegou`, body: 'Toque aqui para abrir: o app se atualiza sozinho em 2 segundos.', tag: 'atualizar', url: './' }).catch(() => 0);
    return reply(env, req, { ok: true, sent });
  }
  // compra feita dentro do app da App Store / Google Play: o servidor confere o recibo com a loja antes de liberar.
  // Fica desligada até existirem as contas de desenvolvedor e as chaves (APPLE_ISSUER_ID/APPLE_KEY_ID/APPLE_PRIVATE_KEY,
  // GOOGLE_PLAY_SERVICE_ACCOUNT) — veja app-nativo/README.md. Nunca libera plano sem recibo validado.
  if (url.pathname === '/billing/store-verify') {
    const pl = clean(body.plataforma, 10);
    const pronta = pl === 'ios' ? !!(env.APPLE_ISSUER_ID && env.APPLE_PRIVATE_KEY) : pl === 'android' ? !!env.GOOGLE_PLAY_SERVICE_ACCOUNT : false;
    if (!pronta) return reply(env, req, { error: 'A compra pela loja ainda está sendo ativada. Tente de novo mais tarde ou fale com o suporte.' }, 503);
    return reply(env, req, { error: 'Validação da loja ainda não configurada.' }, 501);
  }
  if (url.pathname === '/billing/all') {
    if (!isAdmin(env, me)) return reply(env, req, { error: 'só o dono do app' }, 403);
    return reply(env, req, { ok: true, byWs: await billingAll(env) });
  }

  // ---------- erros do app (para o Painel do dono) ----------
  if (url.pathname === '/log') {
    const e = { msg: clean(body.msg, 300), where: clean(body.where, 160), ver: clean(body.ver, 40), dev: clean(body.dev, 40), space: clean(body.space, 20), steps: clean(body.steps, 160) };
    if (!e.msg) return reply(env, req, { ok: true });
    const list = (await env.CAL.get('errors', 'json')) || [];
    const sig = `${e.msg}|${e.where}`.slice(0, 400);
    const now = Date.now();
    const hit = list.find((x) => x.sig === sig);
    // o mesmo erro da mesma pessoa na última hora não gasta outra gravação
    if (hit && now - hit.last < 3600e3 && (hit.users || []).includes(me.id)) return reply(env, req, { ok: true });
    if (hit) { hit.count++; hit.last = now; hit.ver = e.ver || hit.ver; hit.steps = e.steps || hit.steps; hit.dev = e.dev || hit.dev; hit.users = [...new Set([...(hit.users || []), me.id])].slice(-20); }
    else list.unshift({ sig, ...e, count: 1, first: now, last: now, users: [me.id] });
    await env.CAL.put('errors', JSON.stringify(list.sort((a, b) => b.last - a.last).slice(0, 150)));
    return reply(env, req, { ok: true });
  }
  if (url.pathname === '/admin/errors') {
    if (!isAdmin(env, me)) return reply(env, req, { error: 'só o dono do app' }, 403);
    if (body.clear) { await env.CAL.put('errors', '[]'); return reply(env, req, { ok: true, errors: [] }); }
    return reply(env, req, { ok: true, errors: (await env.CAL.get('errors', 'json')) || [] });
  }

  if (url.pathname === '/subscribe') {
    const sub = body.subscription;
    // endereço de push precisa ser https (no modo de teste local, aceita o simulador em 127.0.0.1)
    const okEp = /^https:\/\//.test(sub?.endpoint || '') || (env.ALLOW_EMULATOR_TOKENS === '1' && /^http:\/\/127\.0\.0\.1:\d+\//.test(sub?.endpoint || ''));
    if (!okEp || !sub.keys?.p256dh || !sub.keys?.auth) return reply(env, req, { error: 'aparelho inválido' }, 400);
    const from = clean(req.headers.get('Origin') || '', 80), ua = clean(req.headers.get('User-Agent') || '', 200);
    const id = await addDevice(env, me, {
      id: clean(body.id, 80) || sub.endpoint.slice(-40),
      subscription: { endpoint: clean(sub.endpoint, 1000), keys: { p256dh: clean(sub.keys.p256dh, 200), auth: clean(sub.keys.auth, 100) } },
      prefs: { reminders: body.prefs?.reminders !== false, partner: body.prefs?.partner !== false, daily: body.prefs?.daily !== false, coach: body.prefs?.coach !== false },
      origin: from, ua, founder: me.founder,
    });
    await registerUser(env, me);
    return reply(env, req, { ok: true, id });
  }

  // saiu da conta neste celular: o aparelho para de receber os avisos dela
  if (url.pathname === '/unsubscribe') {
    const endpoint = clean(body.endpoint, 1000), id = clean(body.id, 120);
    const devs = await getDevices(env, me.id);
    const ids = Object.entries(devs).filter(([k, d]) => k === id || (endpoint && d.subscription?.endpoint === endpoint)).map(([k]) => k);
    const n = await removeDevices(env, me.id, ids);
    return reply(env, req, { ok: true, removed: n });
  }

  if (url.pathname === '/notify') {
    const to = (Array.isArray(body.to) ? body.to : []).filter((m) => membersOf(me, env).includes(m) && (m !== me.id || body.includeSelf === true));
    const msg = { title: clean(body.title, 120), body: clean(body.body, 300), tag: clean(body.tag, 80), url: appUrl(body.url) };
    if (!msg.title) return reply(env, req, { error: 'sem texto' }, 400);
    const counts = await Promise.all(to.map((m) => sendToMember(env, m, msg, 'partner')));
    const results = Object.fromEntries(to.map((m, i) => [m, counts[i]]));
    return reply(env, req, { ok: true, sent: counts.reduce((a, b) => a + b, 0), results });
  }

  if (url.pathname === '/schedule') {
    const now = Date.now();
    const items = (Array.isArray(body.items) ? body.items : [])
      .filter((it) => it && membersOf(me, env).includes(it.member) && Number.isFinite(it.at) && it.at > now - 15 * 60e3 && it.at < now + 8 * 86400e3)
      .slice(0, 1500)
      .map((it) => ({ id: clean(it.id, 120), at: it.at, member: it.member, title: clean(it.title, 120), body: clean(it.body, 300), tag: clean(it.tag, 80), url: appUrl(it.url), kind: ['reminders', 'daily'].includes(it.kind) ? it.kind : 'reminders', badge: Number.isFinite(it.badge) ? it.badge : undefined }));
    const prev = await env.CAL.get(scheduleKey(me), 'json');
    if (!prev || JSON.stringify(prev.items) !== JSON.stringify(items)) {
      await env.CAL.put(scheduleKey(me), JSON.stringify({ items, updatedAt: now, by: me.id }));
      await planReminders(env, me.ws, items, now);
    }
    await registerUser(env, me, plan);
    return reply(env, req, { ok: true, count: items.length });
  }

  // Excluir conta (LGPD): assinaturas, aparelhos, lembretes, mensagens e registro de uso
  if (url.pathname === '/account/delete') {
    const out = await closeBilling(env, me);
    const devices = await removeDevices(env, me.id, Object.keys(await getDevices(env, me.id)));
    await boardOf(env).remove(me.ws).catch(() => {});
    await Promise.all([`pitems:${me.id}`, `pprofile:${me.id}`, `psent:${me.id}`, `pc:${me.id}`, `co:${me.id}`, `seen:${me.id}`, `card:${me.ws}`].map((k) => env.CAL.delete(k)));
    // amizades, stories e visitas: apaga as fotos (mesmo antes das 24 h), as visitas e tira a pessoa da lista dos amigos
    try {
      const sts = (await env.CAL.get(`stories:${me.ws}`, 'json')) || [];
      await Promise.all(sts.map((x) => env.CAL.delete(`storyimg:${x.id}`)));
      const frs = (await env.CAL.get(`friends:${me.ws}`, 'json')) || [];
      for (const f of frs) { const l = (await env.CAL.get(`friends:${f}`, 'json')) || []; await env.CAL.put(`friends:${f}`, JSON.stringify(l.filter((x) => x !== me.ws))); }
      await Promise.all([`stories:${me.ws}`, `visits:${me.ws}`, `friends:${me.ws}`, `freq:${me.ws}`].map((k) => env.CAL.delete(k)));
    } catch { /* ok */ }
    const D = dueOf(env);
    await Promise.all([`per:${me.id}`, `amg:${me.id}`, `cch:${me.id}`, `rem:${me.ws}`].map((k) => D.del(k)));
    if (me.ws !== 'main') {
      await Promise.all([`schedule:${me.ws}`, `coach-ctx:${me.ws}`, `ssent:${me.ws}`].map((k) => env.CAL.delete(k)));
      await regDel(env, me.id);
    }
    return reply(env, req, { ok: true, devices, ...out });
  }

  if (url.pathname === '/test') {
    const statuses = [];
    const sent = await sendToMember(env, me.id, { title: 'Notificações ativadas ✓', body: 'É assim que os lembretes e os avisos do parceiro vão chegar.', tag: 'teste', url: './' }, null, statuses);
    return reply(env, req, { ok: true, sent, devices: Object.keys(await getDevices(env, me.id)).length, statuses });
  }

  if (url.pathname === '/coach') {
    const companies = (Array.isArray(body.companies) ? body.companies : []).slice(0, 40).map((c) => ({
      onlyFor: /^[\w-]{1,40}$/.test(c.onlyFor || '') ? c.onlyFor : null, name: clean(c.name, 80), niche: clean(c.niche, 160), lastPost: clean(c.lastPost, 10), nextPost: clean(c.nextPost, 10),
      daysSincePost: typeof c.daysSincePost === 'number' ? c.daysSincePost : null,
    }));
    const W = body.work && typeof body.work === 'object' ? body.work : null;
    const work = W ? {
      arch: /^[a-z_]{2,30}$/.test(W.arch || '') ? W.arch : 'generico', profession: clean(W.profession, 80), entity: clean(W.entity, 30),
      tips: (Array.isArray(W.tips) ? W.tips : []).slice(0, 12).map((t) => clean(t, 240)).filter(Boolean),
      next: (Array.isArray(W.next) ? W.next : []).slice(0, 5).map((e) => ({ date: clean(e?.date, 10), time: /^\d{2}:\d{2}$/.test(e?.time || '') ? e.time : '', label: clean(e?.label, 40), title: clean(e?.title, 60), who: /^[\w-]{1,40}$/.test(e?.who || '') ? e.who : '' })),
      late: Number.isFinite(W.late) ? Math.min(99, Math.max(0, W.late)) : 0,
    } : null;
    const ctxKey = me.ws === 'main' ? 'coach-ctx' : `coach-ctx:${me.ws}`;
    const oldCtx = await env.CAL.get(ctxKey, 'json');
    if (!oldCtx || oldCtx.ia !== (body.ia === true) || JSON.stringify([oldCtx.companies, oldCtx.work]) !== JSON.stringify([companies, work]) || Date.now() - (oldCtx.updatedAt || 0) > 6 * 3600e3) await env.CAL.put(ctxKey, JSON.stringify({ companies, work, ia: body.ia === true, updatedAt: Date.now() }));
    await registerUser(env, me, plan);
    return reply(env, req, { ok: true });
  }
  if (url.pathname === '/coach-test' || url.pathname === '/pnudge-test') {
    const coach = url.pathname === '/coach-test';
    await env.CAL.put(`${coach ? 'cof' : 'pcf'}:${me.id}`, String(Date.now()));
    await dueOf(env).set(`${coach ? 'cch' : 'amg'}:${me.id}`, Date.now());
    return reply(env, req, { ok: true });
  }

  // ---------- amizades: convite por link → pedido na conta da pessoa → ela aceita ----------
  if (url.pathname.startsWith('/friends/')) {
    const meU = me.solo && !me.guest ? me.ws : null; // a própria conta (nunca a agenda de outra pessoa)
    if (!meU || !/^[A-Za-z0-9]{6,64}$/.test(meU)) return reply(env, req, { error: 'Entre com a sua conta para ter amigos.' }, 400);
    const getL = async (k) => (await env.CAL.get(k, 'json')) || [];
    const vipOfU = async (u) => { const b = await getBill(env, u); return b && b.lifetime && b.comp && b.vip ? { no: b.vip.no } : null; };
    const cardOf = async (u) => {
      const c = (await env.CAL.get(`card:${u}`, 'json')) || {};
      return { uid: u, name: c.name || 'Alguém', photo: c.photo || null, color: c.color || '#7C5CFF', level: c.level || 0, xp: c.xp || 0, badges: c.badges || [], tier: c.tier || '', since: c.since || null, vip: await vipOfU(u) };
    };
    if (url.pathname === '/friends/card') {
      const photo = typeof body.photo === 'string' && body.photo.length < 90000 && /^data:image\/(png|jpe?g|webp);base64,[A-Za-z0-9+/=]+$/.test(body.photo) ? body.photo : null;
      const card = { name: clean(body.name, 40) || me.name, photo, color: /^#[0-9a-fA-F]{6}$/.test(body.color || '') ? body.color : '#7C5CFF', level: Math.max(0, Math.min(100, Math.round(Number(body.level) || 0))), xp: Math.max(0, Math.round(Number(body.xp) || 0)), tier: clean(body.tier, 30), since: Number(body.since) || null, teen: body.teen === true,
        badges: (Array.isArray(body.badges) ? body.badges : []).filter((x) => typeof x === 'string' && /^[a-z0-9_-]{1,30}$/.test(x)).slice(0, 150), at: Date.now() };
      await env.CAL.put(`card:${meU}`, JSON.stringify(card));
      return reply(env, req, { ok: true });
    }
    if (url.pathname === '/friends/link') {
      const token = Array.from(crypto.getRandomValues(new Uint8Array(18)), (x) => 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789'[x % 56]).join('');
      await env.CAL.put(`flink:${token}`, JSON.stringify({ uid: meU, at: Date.now() }), { expirationTtl: 14 * 86400 });
      return reply(env, req, { ok: true, token });
    }
    if (url.pathname === '/friends/open') {
      const token = clean(body.token, 40);
      const l = /^[A-Za-z0-9]{10,40}$/.test(token) ? await env.CAL.get(`flink:${token}`, 'json') : null;
      if (!l) return reply(env, req, { error: 'Este convite de amizade não existe mais. Peça um novo.' }, 404);
      if (l.uid === meU) return reply(env, req, { ok: true, self: true });
      if ((await getL(`blocks:${l.uid}`)).includes(meU) || (await getL(`blocks:${meU}`)).includes(l.uid)) return reply(env, req, { error: 'Este convite não está disponível.' }, 403);
      if ((await getL(`friends:${meU}`)).includes(l.uid)) return reply(env, req, { ok: true, already: true, from: await cardOf(l.uid) });
      const reqs = (await getL(`freq:${meU}`)).filter((r) => r.from !== l.uid);
      reqs.unshift({ from: l.uid, at: Date.now() });
      await env.CAL.put(`freq:${meU}`, JSON.stringify(reqs.slice(0, 50)));
      return reply(env, req, { ok: true, from: await cardOf(l.uid) });
    }
    if (url.pathname === '/friends/answer') {
      const from = clean(body.from, 64);
      const reqs = await getL(`freq:${meU}`);
      if (!reqs.some((r) => r.from === from)) return reply(env, req, { error: 'Pedido não encontrado.' }, 404);
      await env.CAL.put(`freq:${meU}`, JSON.stringify(reqs.filter((r) => r.from !== from)));
      if (body.ok === true) {
        const a = await getL(`friends:${meU}`), b = await getL(`friends:${from}`);
        await env.CAL.put(`friends:${meU}`, JSON.stringify([...new Set([from, ...a])].slice(0, 300)));
        await env.CAL.put(`friends:${from}`, JSON.stringify([...new Set([meU, ...b])].slice(0, 300)));
        const mine = await cardOf(meU);
        await sendToMember(env, 'u' + from.replace(/[^A-Za-z0-9]/g, '').slice(0, 24), { title: '🤝 Nova amizade no Lembra', body: `${mine.name} aceitou o seu convite. Veja o perfil, o nível e os emblemas.`, tag: `amigo-${meU}`, url: './#/amigos' }).catch(() => 0);
      }
      return reply(env, req, { ok: true });
    }
    if (url.pathname === '/friends/remove') {
      const other = clean(body.uid, 64);
      await env.CAL.put(`friends:${meU}`, JSON.stringify((await getL(`friends:${meU}`)).filter((x) => x !== other)));
      await env.CAL.put(`friends:${other}`, JSON.stringify((await getL(`friends:${other}`)).filter((x) => x !== meU)));
      return reply(env, req, { ok: true });
    }
    // ---------- stories (24h) e visitas ao perfil ----------
    const memberOf = (u) => 'u' + String(u).replace(/[^A-Za-z0-9]/g, '').slice(0, 24);
    const DAY = 864e5, now = Date.now();
    const vivos = (l) => l.filter((x) => now - x.at < DAY);
    const brHora = () => new Date(Date.now() - 3 * 3600e3).getUTCHours();
    const dormindo = async (u) => { const c = (await env.CAL.get(`card:${u}`, 'json')) || {}; const h = brHora(); return c.teen === true && (h >= 22 || h < 7); }; // modo dormir (menores)
    const isFriend = async (a, b) => a === b || (await getL(`friends:${a}`)).includes(b);
    if (url.pathname === '/friends/story-post') {
      const photo = typeof body.photo === 'string' && body.photo.length < 420000 && /^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(body.photo) ? body.photo : null;
      if (!photo) return reply(env, req, { error: 'Foto inválida. Tire a foto pela câmera do app.' }, 400);
      if (body.camera !== true) return reply(env, req, { error: 'O story precisa ser uma foto tirada agora, pela câmera.' }, 400);
      const id = Array.from(crypto.getRandomValues(new Uint8Array(12)), (x) => 'abcdefghijkmnpqrstuvwxyz23456789'[x % 32]).join('');
      const list = vivos(await getL(`stories:${meU}`));
      if (list.length >= 10) return reply(env, req, { error: 'Você já postou 10 stories hoje. Espere alguns sumirem.' }, 429);
      list.push({ id, at: now, title: clean(body.title, 60), caption: clean(body.caption, 120), ref: clean(body.ref, 80), views: {} });
      await env.CAL.put(`stories:${meU}`, JSON.stringify(list), { expirationTtl: 26 * 3600 });
      await env.CAL.put(`storyimg:${id}`, photo, { expirationTtl: 24 * 3600 }); // a foto some sozinha em 24h (não fica guardada)
      const mine = await cardOf(meU), fr = await getL(`friends:${meU}`);
      const TIT = ['👀 Story novo no ar', '📸 Alguém postou agora', '🔥 Saiu story novo'];
      await Promise.all(fr.slice(0, 200).map(async (u) => (await dormindo(u)) ? 0 : sendToMember(env, memberOf(u), { title: TIT[now % TIT.length], body: `${mine.name.split(' ')[0]} acabou de postar um story${body.title ? ` de “${clean(body.title, 40)}”` : ''}. Toque pra ver antes que suma!`, tag: `story-${meU}`, url: './#/stories' }).catch(() => 0)));
      return reply(env, req, { ok: true, id });
    }
    if (url.pathname === '/friends/story-delete') {
      const id = clean(body.id, 40), list = await getL(`stories:${meU}`);
      if (!list.some((x) => x.id === id)) return reply(env, req, { error: 'Story não encontrado.' }, 404);
      await env.CAL.put(`stories:${meU}`, JSON.stringify(list.filter((x) => x.id !== id)), { expirationTtl: 26 * 3600 });
      await env.CAL.delete(`storyimg:${id}`);
      return reply(env, req, { ok: true });
    }
    if (url.pathname === '/friends/stories') {
      const fr = await getL(`friends:${meU}`);
      const donos = [meU, ...fr.slice(0, 200)];
      const rows = (await Promise.all(donos.map(async (u) => {
        const l = vivos(await getL(`stories:${u}`)); if (!l.length) return null;
        return { ...(await cardOf(u)), me: u === meU, stories: l.map((x) => ({ id: x.id, at: x.at, title: x.title, caption: x.caption, seen: !!x.views[meU], views: u === meU ? Object.keys(x.views).length : undefined })) };
      }))).filter(Boolean);
      // como no Instagram/WhatsApp: os seus primeiro, depois quem tem novidade, do mais recente ao mais antigo
      rows.sort((a, b) => (b.me - a.me) || (a.stories.every((x) => x.seen) - b.stories.every((x) => x.seen)) || (Math.max(...b.stories.map((x) => x.at)) - Math.max(...a.stories.map((x) => x.at))));
      return reply(env, req, { ok: true, rows });
    }
    if (url.pathname === '/friends/story-view') {
      const owner = clean(body.owner, 64), id = clean(body.id, 40);
      if (!(await isFriend(meU, owner))) return reply(env, req, { error: 'Só amigos veem os stories.' }, 403);
      const list = await getL(`stories:${owner}`), st = list.find((x) => x.id === id && now - x.at < DAY);
      const photo = st && (await env.CAL.get(`storyimg:${id}`));
      if (!st || !photo) return reply(env, req, { error: 'Esse story já sumiu.' }, 404);
      if (owner !== meU && !st.views[meU]) { st.views[meU] = now; await env.CAL.put(`stories:${owner}`, JSON.stringify(list), { expirationTtl: 26 * 3600 }); }
      return reply(env, req, { ok: true, photo });
    }
    if (url.pathname === '/friends/story-viewers') {
      const st = (await getL(`stories:${meU}`)).find((x) => x.id === clean(body.id, 40));
      if (!st) return reply(env, req, { error: 'Story não encontrado.' }, 404);
      const v = Object.entries(st.views).sort((a, b) => b[1] - a[1]).slice(0, 100);
      return reply(env, req, { ok: true, viewers: await Promise.all(v.map(async ([u, at]) => ({ ...(await cardOf(u)), at }))) });
    }
    if (url.pathname === '/friends/visit') {
      const other = clean(body.uid, 64);
      if (other === meU || !(await isFriend(meU, other))) return reply(env, req, { ok: true });
      const l = (await getL(`visits:${other}`)).filter((x) => now - x.at < 7 * DAY);
      const prev = l.find((x) => x.from === meU);
      const novo = [{ from: meU, at: now, n: (prev?.n || 0) + 1 }, ...l.filter((x) => x.from !== meU)].slice(0, 60);
      await env.CAL.put(`visits:${other}`, JSON.stringify(novo), { expirationTtl: 8 * 24 * 3600 });
      // gatilho de curiosidade: não diz quem foi (pra pessoa abrir o app); no máximo 1 aviso a cada 6h por visitante
      if ((!prev || now - prev.at > 6 * 3600e3) && !(await dormindo(other))) {
        const B = ['Alguém acabou de olhar o seu perfil 👀 Toque pra ver quem foi', 'Tem gente bisbilhotando o seu perfil 🤭 Quer saber quem?', 'Seu perfil recebeu uma visita agora. Curioso(a)? 👀'];
        await sendToMember(env, memberOf(other), { title: '👀 Visita no seu perfil', body: B[now % B.length], tag: 'visitas', url: './#/visitas' }).catch(() => 0);
      }
      return reply(env, req, { ok: true });
    }
    // denúncia e bloqueio (exigência das lojas para conteúdo de usuário)
    if (url.pathname === '/friends/report') {
      const owner = clean(body.owner, 64), id = clean(body.id, 40), motivo = clean(body.motivo, 200);
      const rep = (await getL('reports')).slice(0, 499);
      rep.unshift({ by: meU, owner, id, motivo, at: now });
      await env.CAL.put('reports', JSON.stringify(rep));
      // 2 denúncias diferentes no mesmo story: ele sai do ar na hora, até o dono do app revisar
      if (id && rep.filter((r) => r.id === id).length >= 2) {
        const l = await getL(`stories:${owner}`); await env.CAL.put(`stories:${owner}`, JSON.stringify(l.filter((x) => x.id !== id)), { expirationTtl: 26 * 3600 }); await env.CAL.delete(`storyimg:${id}`);
      }
      const adm = await adminMember(env);
      if (adm) await sendToMember(env, adm, { title: '🚩 Denúncia no Lembra', body: `${motivo || 'Sem motivo'} · ${id ? 'story' : 'perfil'}`, tag: 'denuncia', url: './' }).catch(() => 0);
      return reply(env, req, { ok: true });
    }
    if (url.pathname === '/friends/block') {
      const other = clean(body.uid, 64);
      if (!other || other === meU) return reply(env, req, { error: 'Não dá para bloquear.' }, 400);
      const bl = await getL(`blocks:${meU}`); await env.CAL.put(`blocks:${meU}`, JSON.stringify([...new Set([other, ...bl])].slice(0, 500)));
      await env.CAL.put(`friends:${meU}`, JSON.stringify((await getL(`friends:${meU}`)).filter((x) => x !== other)));
      await env.CAL.put(`friends:${other}`, JSON.stringify((await getL(`friends:${other}`)).filter((x) => x !== meU)));
      await env.CAL.put(`freq:${meU}`, JSON.stringify((await getL(`freq:${meU}`)).filter((r) => r.from !== other)));
      await env.CAL.put(`visits:${meU}`, JSON.stringify((await getL(`visits:${meU}`)).filter((v) => v.from !== other)), { expirationTtl: 8 * 24 * 3600 });
      return reply(env, req, { ok: true });
    }
    if (url.pathname === '/friends/visitors') {
      const l = (await getL(`visits:${meU}`)).filter((x) => now - x.at < 7 * DAY);
      return reply(env, req, { ok: true, visitors: await Promise.all(l.map(async (x) => ({ ...(await cardOf(x.from)), at: x.at, n: x.n }))) });
    }
    if (url.pathname === '/friends/list') {
      const [fr, rq] = [await getL(`friends:${meU}`), await getL(`freq:${meU}`)];
      const friends = await Promise.all(fr.slice(0, 200).map(cardOf));
      const requests = await Promise.all(rq.slice(0, 30).map(async (r) => ({ ...(await cardOf(r.from)), at: r.at })));
      return reply(env, req, { ok: true, friends: friends.sort((x, y) => y.level - x.level || y.xp - x.xp), requests, me: await cardOf(meU) });
    }
    return reply(env, req, { error: 'não encontrado' }, 404);
  }

  // ---------- suporte: chat da pessoa com o dono do app ----------
  if (url.pathname.startsWith('/support/')) {
    const ownerMember = () => adminMember(env);
    const key = (id) => `support:${id}`;
    const AUTO = 'Recebemos sua mensagem! 💜 Nós responderemos em até 24h, aqui mesmo neste chat. Você vai receber uma notificação quando chegar a resposta.';
    if (url.pathname === '/support/send') {
      const text = clean(body.text, 1000).trim();
      if (!text) return reply(env, req, { error: 'mensagem vazia' }, 400);
      const now = Date.now();
      const th = (await env.CAL.get(key(me.id), 'json')) || { id: me.id, name: me.name, email: me.email, msgs: [] };
      th.name = me.name; th.email = me.email; th.member = me.id;
      th.msgs.push({ from: 'user', text, at: now });
      // resposta automática na primeira mensagem e sempre que ficou mais de 24h sem resposta automática
      const lastAuto = [...th.msgs].reverse().find((m) => m.from === 'auto');
      if (!lastAuto || now - lastAuto.at > 864e5) th.msgs.push({ from: 'auto', text: AUTO, at: now + 1 });
      th.msgs = th.msgs.slice(-200);
      th.updatedAt = now; th.unread = (th.unread || 0) + 1; th.userUnread = 0; delete th.closedAt; // mensagem nova reabre o atendimento
      await env.CAL.put(key(me.id), JSON.stringify(th));
      const idx = (await env.CAL.get('support-index', 'json')) || {};
      idx[me.id] = { name: me.name, email: me.email, at: now, unread: th.unread, last: text.slice(0, 80) };
      await env.CAL.put('support-index', JSON.stringify(idx));
      const owner = await ownerMember();
      if (owner) await sendToMember(env, owner, { title: `💬 Suporte · ${me.name || me.email}`, body: text.slice(0, 160), tag: `sup-${me.id}`, url: './#/suporte-dono' }).catch(() => 0);
      return reply(env, req, { ok: true, thread: th.msgs });
    }
    if (url.pathname === '/support/thread') {
      const th = await env.CAL.get(key(me.id), 'json');
      if (th && th.userUnread) { th.userUnread = 0; await env.CAL.put(key(me.id), JSON.stringify(th)); }
      return reply(env, req, { ok: true, thread: th ? th.msgs : [] });
    }
    if (!isAdmin(env, me)) return reply(env, req, { error: 'só o dono do app' }, 403);
    if (url.pathname === '/support/inbox') {
      const idx = (await env.CAL.get('support-index', 'json')) || {};
      const id = clean(body.id, 80);
      if (id) {
        const th = await env.CAL.get(key(id), 'json');
        if (th && th.unread) { th.unread = 0; await env.CAL.put(key(id), JSON.stringify(th)); if (idx[id]) { idx[id].unread = 0; await env.CAL.put('support-index', JSON.stringify(idx)); } }
        return reply(env, req, { ok: true, thread: th ? th.msgs : [], name: th?.name, email: th?.email, closedAt: th?.closedAt || null });
      }
      return reply(env, req, { ok: true, inbox: Object.entries(idx).map(([id, v]) => ({ id, ...v })).sort((a, b) => b.at - a.at) });
    }
    if (url.pathname === '/support/reply') {
      const id = clean(body.id, 80), text = clean(body.text, 1000).trim();
      const th = await env.CAL.get(key(id), 'json');
      if (!th || !text) return reply(env, req, { error: 'conversa não encontrada' }, 404);
      const now = Date.now();
      th.msgs.push({ from: 'owner', text, at: now });
      th.msgs = th.msgs.slice(-200); th.unread = 0; th.userUnread = (th.userUnread || 0) + 1; th.updatedAt = now;
      await env.CAL.put(key(id), JSON.stringify(th));
      const idx = (await env.CAL.get('support-index', 'json')) || {};
      if (idx[id]) { idx[id].unread = 0; idx[id].answered = now; await env.CAL.put('support-index', JSON.stringify(idx)); }
      await sendToMember(env, th.member || id, { title: '💬 Resposta do suporte Lembra', body: text.slice(0, 160), tag: 'suporte', url: './#/suporte' }).catch(() => 0);
      return reply(env, req, { ok: true, thread: th.msgs });
    }
    // encerrar o atendimento como resolvido (ou reabrir)
    if (url.pathname === '/support/close') {
      const id = clean(body.id, 80);
      const th = await env.CAL.get(key(id), 'json');
      if (!th) return reply(env, req, { error: 'conversa não encontrada' }, 404);
      const now = Date.now(), reopen = body.reopen === true;
      if (reopen) delete th.closedAt;
      else if (!th.closedAt) {
        th.closedAt = now;
        th.msgs.push({ from: 'closed', text: 'Atendimento encerrado como resolvido. Se precisar de mais alguma coisa, é só mandar uma nova mensagem aqui.', at: now });
        th.msgs = th.msgs.slice(-200); th.unread = 0; th.userUnread = (th.userUnread || 0) + 1;
        await sendToMember(env, th.member || id, { title: '✅ Atendimento resolvido', body: 'Seu atendimento no suporte Lembra foi encerrado como resolvido. Precisando, é só escrever de novo.', tag: 'suporte', url: './#/suporte' }).catch(() => 0);
      }
      th.updatedAt = now;
      await env.CAL.put(key(id), JSON.stringify(th));
      const idx = (await env.CAL.get('support-index', 'json')) || {};
      if (idx[id]) { idx[id].unread = 0; if (reopen) delete idx[id].closed; else idx[id].closed = th.closedAt; await env.CAL.put('support-index', JSON.stringify(idx)); }
      return reply(env, req, { ok: true, thread: th.msgs, closedAt: th.closedAt || null });
    }
    return reply(env, req, { error: 'não encontrado' }, 404);
  }
  // ---------- ranking semanal (só plano mensal; pontos contados aqui, com anti-fraude) ----------
  if (url.pathname === '/rank/act') {
    const st = await billingStatus(env, me);
    return reply(env, req, await recordAct(env, me, st, { type: clean(body.type, 20), ref: clean(body.ref, 80), ontime: body.ontime !== false }));
  }
  if (url.pathname === '/rank/board') {
    const st = await billingStatus(env, me);
    return reply(env, req, { ...(await getBoard(env, me)), eligible: rankEligible(st) });
  }
  if (url.pathname === '/rank/admin') {
    if (!isAdmin(env, me)) return reply(env, req, { error: 'só o dono do app' }, 403);
    return reply(env, req, { ok: true, ...(await adminBoard(env)) });
  }
  // a pessoa abriu o app: o "amigo" do Pessoal sabe há quanto tempo ela não entra
  if (url.pathname === '/seen') {
    // guarda: última abertura, horários em que costuma abrir, por onde abriu (aviso ou ícone), sequência e permissão de avisos
    const now = Date.now(), raw = await env.CAL.get(`seen:${me.id}`);
    let sn = {}; try { sn = raw && raw.startsWith('{') ? JSON.parse(raw) : { last: Number(raw) || 0 }; } catch { sn = {}; }
    const h = new Date(now - 3 * 3600e3).getUTCHours();
    sn.hours = Array.isArray(sn.hours) && sn.hours.length === 24 ? sn.hours : Array(24).fill(0);
    if (now - (sn.last || 0) > 30 * 60e3) sn.hours[h] = Math.min(999, sn.hours[h] + 1);
    sn.last = now; sn.opens = (sn.opens || 0) + 1;
    if (body.src === 'notif') sn.viaNotif = (sn.viaNotif || 0) + 1;
    sn.streak = Math.max(0, Math.min(3650, Number(body.streak) || 0));
    sn.perm = clean(body.notif, 12);
    await env.CAL.put(`seen:${me.id}`, JSON.stringify(sn), { expirationTtl: 60 * 864e2 });
    return reply(env, req, { ok: true });
  }
  if (url.pathname === '/personal') {
    const items = (Array.isArray(body.items) ? body.items : []).slice(0, 300)
      .filter((it) => it && typeof it.at === 'number')
      .map((it) => ({ id: clean(it.id, 120), at: it.at, title: clean(it.title, 80), body: clean(it.body, 200), tag: clean(it.tag, 80), url: appUrl(it.url) }));
    const prevItems = await env.CAL.get(`pitems:${me.id}`);
    if (prevItems !== JSON.stringify(items)) {
      await env.CAL.put(`pitems:${me.id}`, JSON.stringify(items));
      await planPersonal(env, me.id, items);
    }
    if (body.profile && typeof body.profile === 'object') {
      const { updatedAt, ...prof } = cleanProfile(body.profile, me);
      const old = await env.CAL.get(`pprofile:${me.id}`, 'json');
      const { updatedAt: u0, ...oldProf } = old || {};
      // grava se mudou ou a cada 3h (o "hoje" do servidor se baseia nesse resumo)
      if (!old || JSON.stringify(oldProf) !== JSON.stringify(prof) || Date.now() - (u0 || 0) > 3 * 3600e3) {
        await env.CAL.put(`pprofile:${me.id}`, JSON.stringify({ ...prof, updatedAt: Date.now() }));
        // primeiro resumo (ou mudou a rotina): o amigo recalcula logo
        if (!old || JSON.stringify(old.prefs) !== JSON.stringify(prof.prefs)) await dueOf(env).set(`amg:${me.id}`, Date.now());
      }
    }
    await registerUser(env, me, plan);
    return reply(env, req, { ok: true, count: items.length });
  }

  // Corrige ortografia e acentos de títulos curtos (sem mudar o sentido)
  if (url.pathname === '/tidy') {
    const titles = (Array.isArray(body.titles) ? body.titles : []).slice(0, 20).map((t) => clean(t, 120));
    if (!titles.length || !env.AI) return reply(env, req, { titles: [] });
    const prompt = `Corrija SÓ a ortografia, os acentos e as maiúsculas destes títulos curtos de compromissos de uma agenda (trabalho de qualquer profissão ou posts de redes sociais) em português do Brasil. Nomes próprios, produtos e variedades com inicial maiúscula (ex.: Manga Palmer, Couve-flor). NÃO acrescente nem tire palavras, NÃO mude o sentido. Responda só com um JSON: lista de textos na mesma ordem.\n${JSON.stringify(titles)}`;
    for (const model of ['@cf/meta/llama-3.3-70b-instruct-fp8-fast', '@cf/meta/llama-3.1-8b-instruct-fast']) {
      try {
        const out = await env.AI.run(model, { messages: [{ role: 'user', content: prompt }], max_tokens: 800, temperature: 0 });
        const m = /\[[\s\S]*\]/.exec(String(out?.response || ''));
        const arr = m ? JSON.parse(m[0]) : null;
        if (Array.isArray(arr) && arr.length === titles.length) return reply(env, req, { titles: arr.map((t) => clean(t, 140)) });
      } catch (e) { console.log('tidy', model, e.message); }
    }
    return reply(env, req, { titles: [] });
  }

  // Uso de hoje (para o dono saber se está dentro do limite grátis)
  if (url.pathname === '/usage') {
    if (!isAdmin(env, me)) return reply(env, req, { error: 'só o dono do app' }, 403);
    const u = env.USAGE || { amigo: { sent: 0, ai: 0 }, coach: { sent: 0, ai: 0 } };
    const aiMsgs = (u.amigo?.ai || 0) + (u.coach?.ai || 0);
    return reply(env, req, {
      ok: true, lembretes: u.lembretes || 0, pessoais: u.pessoais || 0, amigo: u.amigo, coach: u.coach,
      fila: await dueOf(env).size(), banco: env.METER || null, relogio: env.RUNS || null, neuronios: Number(await env.CAL.get(`ai-neurons:${new Date().toISOString().slice(0, 10)}`)) || 0,
      // estimativa: cada mensagem escrita pela IA gasta ~40 "neurônios" de 10.000 grátis por dia
      iaPercent: Math.min(100, Math.round((aiMsgs * 40) / 10000 * 100)),
    });
  }

  // ---------- ranking mundial (geral e mensal): todo mundo vê o top e a própria posição ----------
  if (url.pathname === '/lb/report') {
    const uid = me.solo && !me.guest ? me.ws : null;
    if (!uid || !/^[A-Za-z0-9]{6,64}$/.test(uid)) return reply(env, req, { ok: true });
    const e = await boardOf(env).report(uid, body);
    return reply(env, req, { ok: true, xp: e.xp, mxp: e.mxp });
  }
  if (url.pathname === '/lb/board') {
    return reply(env, req, { ok: true, ...(await boardOf(env).view(me.ws, body.kind === 'month' ? 'month' : 'all', { limit: Math.max(10, Math.min(100, Number(body.limit) || 50)) })) });
  }

  // ---------- presença ao vivo (Painel do dono): fica na memória do servidor, sem gravar no banco ----------
  if (url.pathname === '/presence') {
    const P = presenceOf(env);
    const prev = P.get(me.ws) || {};
    // sinais podem chegar fora de ordem (ex.: o "saí" da página velha depois do "entrei" da nova): vale o mais novo
    const t = Number(body.t) || 0;
    if (t && prev.t && t < prev.t) return reply(env, req, { ok: true, ignored: true });
    const on = body.state !== 'off';
    const app = body.app && typeof body.app === 'object' ? { v: clean(body.app.v, 20), b: clean(body.app.b, 20) } : prev.app;
    P.set(me.ws, { t: t || prev.t || 0, online: on, lastPing: Date.now(), ...(on ? { lastOpen: body.state === 'open' ? Date.now() : prev.lastOpen || Date.now() } : { closedAt: Date.now(), lastOpen: prev.lastOpen }), ...(app ? { app } : {}) });
    if (P.size > 20000) { const old = [...P.entries()].sort((x, y) => x[1].lastPing - y[1].lastPing).slice(0, 5000); for (const [k] of old) P.delete(k); }
    return reply(env, req, { ok: true });
  }
  if (url.pathname === '/admin/presence') {
    if (!isAdmin(env, me)) return reply(env, req, { error: 'só o dono do app' }, 403);
    return reply(env, req, { ok: true, now: Date.now(), byUid: Object.fromEntries(presenceOf(env)) });
  }

  if (url.pathname === '/devices') {
    const counts = {};
    for (const m of membersOf(me, env)) { const n = Object.keys(await getDevices(env, m)).length; if (n) counts[m] = n; }
    return reply(env, req, { ok: true, counts });
  }

  if (url.pathname === '/ask') {
    if (!env.ANTHROPIC_API_KEY && !env.AI) return reply(env, req, { error: 'A IA do assistente ainda não foi ligada no servidor.' }, 412);
    // com chave da Anthropic usa o Claude; sem chave, a IA grátis do Cloudflare
    const ask = env.ANTHROPIC_API_KEY ? (await import('./claude.js')).askClaude : (await import('./freeai.js')).askFree;
    try {
      const raw = await ask(env, { question: clean(body.question, 2000), history: body.history, context: clean(body.context, 60000), me, today: clean(body.today, 10) });
      const { answer, actions } = splitActions(raw);
      return reply(env, req, { answer, actions });
    } catch (e) {
      return reply(env, req, { error: e.message || 'O Claude não respondeu. Tente de novo.' }, e.status || 502);
    }
  }
  return reply(env, req, { error: 'não encontrado' }, 404);
}

/* Avisos únicos para uma pessoa (manda uma vez só, no próximo minuto do relógio; depois marca como enviado) */
const ONE_SHOT = [
  { key: 'upd-matheus-2026-11', member: 'matheus', title: '📲 Atualize o Lembra, Matheus', body: 'Saiu uma versão nova com muita coisa. Abra o app: vai aparecer o link para instalar a versão nova pelo Safari.', tag: 'atualizar', url: './#/atualizar' },
];
/* Avisos únicos para TODO MUNDO (uma vez por pessoa cadastrada) */
const ONE_SHOT_ALL = [
  { key: 'upd-todos-2.11.0', title: '✨ O Lembra atualizou!', body: 'Ícone novo, visual novo e o Lembra mais vivo. No iPhone: apague o ícone antigo da tela inicial, abra meulembra.com.br no Safari e toque em Compartilhar → Adicionar à Tela de Início.', tag: 'atualizar', url: './' },
];
async function oneShotAll(env) {
  for (const m of ONE_SHOT_ALL) {
    const k = `oneshot:${m.key}`;
    if (await env.CAL.get(k)) continue;
    await env.CAL.put(k, String(Date.now()));
    const reg = await regAll(env);
    for (const id of Object.keys(reg)) await sendToMember(env, id, { title: m.title, body: m.body, tag: m.tag, url: m.url }, null).catch(() => 0);
  }
}
async function oneShot(env) {
  await oneShotAll(env);
  for (const m of ONE_SHOT) {
    const k = `oneshot:${m.key}`;
    if (await env.CAL.get(k)) continue;
    await env.CAL.put(k, String(Date.now()));
    await sendToMember(env, m.member, { title: m.title, body: m.body, tag: m.tag, url: m.url }, null);
  }
}

/* aviso do presente Vitalício: não diz o que é nem quem deu (a surpresa fica para quando a pessoa abrir) */
const vipNotify = (env, uid) => sendToMember(env, 'u' + String(uid).replace(/[^A-Za-z0-9]/g, '').slice(0, 24), { title: 'Você recebeu algo raro.', body: 'Poucas pessoas no mundo vão ver o que está esperando por você no Lembra.', tag: 'vitalicio', url: './#/vitalicio' }).catch(() => 0);

/* Uma rodada do relógio (chamada pelo Durable Object a cada minuto e nas continuações) */
export async function cronTick(env, { now = Date.now(), meter = { pushes: 0 }, maxPushes = 8, maxKeys = 15, kinds = null } = {}) {
  const send = (e, m, msg, pref) => sendToMember(e, m, msg, pref, [], meter);
  const wk = rankWeek(now);
  let board = null;
  const rankInfo = async (ws) => {
    board = board || (await env.CAL.get(`rank:${wk}`, 'json')) || {};
    const s = rankStanding(board, ws);
    if (!s || !s.pos) return null;
    const ahead = s.pos > 1 ? s.group[s.pos - 2][1].pts - s.pts + 1 : 0;
    return { pos: s.pos, week: wk, leagueName: { bronze: 'Bronze', prata: 'Prata', ouro: 'Ouro' }[s.league], ahead };
  };
  const r = await runTick(env, { now, send, maxPushes, maxKeys, meter, rankInfo, kinds });
  // tarefas raras (cada uma confere uma marca e sai na hora quando não há nada a fazer)
  if (!r.more && !kinds) {
    const safe = (name, p) => p.catch((e) => console.log(name, e.message));
    await safe('aviso único', oneShot(env));
    await safe('vitalício (quem ganhou antes da surpresa)', vipMigrate(env, (uid) => vipNotify(env, uid)));
    await safe('ranking', monthlyAward(env, { stripe: stripeApi, getBill, putBill, notify: (id, msg) => send(env, id, msg) }));
  }
  const more = r.more || (await dueOf(env).dueBefore(now, 1)).length > 0;
  return { ...r, more, pushes: meter.pushes };
}

/* resposta de erro com os cabeçalhos certos (o app sempre recebe uma resposta legível) */
export const safeHandle = (req, env) => handle(req, env).catch((e) => { console.log('erro interno', e.stack || e.message); return reply(env, req, { error: 'erro interno: ' + e.message }, 500); });
export { handle, sendToMember };
