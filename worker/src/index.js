/* Servidor gratuito do Calendário (Cloudflare Workers) — publicado pelo Cloudflare a partir do GitHub.
   - Notificações em tempo real para o parceiro (/notify)
   - Lembretes no horário certo: o app envia a lista (/schedule) e o servidor
     confere a cada minuto, mesmo com os celulares fechados
   - Conversa com o Claude dentro do app (/ask), se houver chave da Anthropic
   Dados guardados no KV "CAL": chaves VAPID, aparelhos e lista de lembretes. */
import { generateVapid, sendPush } from './webpush.js';
import { verifyIdToken } from './auth.js';
import { runCoach } from './coach.js';
import { runPersonalCoach } from './pcoach.js';
import { recordAct, getBoard, adminBoard, monthlyAward, eligible as rankEligible, standing as rankStanding, weekKey as rankWeek } from './rank.js';
import { getBill, putBill, stripe as stripeApi } from './billing.js';
import { startTrial, billingStatus, createCheckout, createPortal, verifyStripe, handleStripeEvent, billingAll, syncTeam, teamActive, closeBilling, untilOf, statusOf, grantComp } from './billing.js';

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
const getSchedule = async (env) => (await env.CAL.get('schedule', 'json')) || { items: [] };
/* "Já enviados" ficam em chaves próprias, escritas só pelo relógio do servidor:
   assim o app atualizando a lista nunca apaga o registro (evita aviso repetido). */
async function getSent(env, key, legacy) {
  const s = await env.CAL.get(key, 'json');
  return s || (legacy && legacy.sent) || {};
}
const prune = (sent, now) => { for (const [k, t] of Object.entries(sent)) if (t < now - 3 * 86400e3) delete sent[k]; return sent; };

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
  const reg = await registry(env, now);
  const others = await Promise.all([...new Set(activeRegs(reg, now).map(([, u]) => u.ws))].map((ws) => env.CAL.get(`schedule:${ws}`, 'json')));
  const allItems = [...(sch.items || []), ...others.flatMap((o) => (o && o.items) || [])];
  const due0 = allItems.filter((it) => it.at <= now && it.at > now - 15 * 60e3);
  if (!due0.length) return 0;
  const sent = await getSent(env, 'schedule-sent', sch);
  const due = due0.filter((it) => !sent[it.id]);
  if (!due.length) return 0;
  for (const it of due) sent[it.id] = now;
  // grava antes de enviar: se o envio demorar, o minuto seguinte não manda de novo
  await env.CAL.put('schedule-sent', JSON.stringify(prune(sent, now)));
  for (const it of due) await sendToMember(env, it.member, { title: it.title, body: it.body, tag: it.tag, url: it.url, badge: it.badge }, it.kind);
  return due.length;
}

/* Lembretes da agenda pessoal: cada lista vai só para o celular do dono */
async function runPersonal(env) {
  const now = Date.now();
  const team = (await everyone(env)).map((m) => m.id);
  const lists = await Promise.all(team.map((m) => env.CAL.get(`pitems:${m}`, 'json')));
  let legacy = null;
  if (lists.some((l) => !l)) legacy = await env.CAL.get('personal', 'json'); // formato antigo
  const due0 = [];
  team.forEach((m, i) => {
    const list = lists[i] || legacy?.byMember?.[m] || [];
    for (const it of list) if (it.at <= now && it.at > now - 15 * 60e3) due0.push([m, it]);
  });
  if (!due0.length) return 0;
  const sent = await getSent(env, 'personal-sent', legacy);
  const due = due0.filter(([, it]) => !sent[it.id]);
  if (!due.length) return 0;
  for (const [, it] of due) sent[it.id] = now;
  await env.CAL.put('personal-sent', JSON.stringify(prune(sent, now)));
  for (const [member, it] of due) await sendToMember(env, member, { title: it.title, body: it.body, tag: it.tag, url: it.url });
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
const SEC = { 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer', 'Cache-Control': 'no-store' };
const reply = (env, req, data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', ...SEC, ...cors(env, req) } });

const clean = (s, n) => String(s || '').slice(0, n);
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
  const reg = (await env.CAL.get('users', 'json')) || {};
  const cur = reg[me.id];
  const until = st ? untilOf(st) : cur?.until;
  if (cur && cur.name === me.name && cur.ws === me.ws && cur.until === until) return; // já conhecido: não gasta gravação
  reg[me.id] = { name: me.name, ws: me.ws, at: cur?.at || Date.now(), ...(until !== undefined ? { until } : {}) };
  await env.CAL.put('users', JSON.stringify(reg));
}
/* Plano mudou (pagou, renovou, cancelou, reembolso, teste começou): atualiza até quando a conta tem direito */
async function refreshUntil(env, ws) {
  if (!ws || ws === 'main') return;
  const st = await billingStatus(env, { ws, id: '' });
  const until = untilOf(st);
  const reg = (await env.CAL.get('users', 'json')) || {};
  let changed = false;
  for (const u of Object.values(reg)) if (u.ws === ws && u.until !== until) { u.until = until; changed = true; }
  if (changed) await env.CAL.put('users', JSON.stringify(reg));
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
  const reg = (await env.CAL.get('users', 'json')) || {};
  const legacy = Object.values(reg).filter((u) => u.until === undefined);
  if (legacy.length) {
    await Promise.all(legacy.map(async (u) => { u.until = untilOf(statusOf(await env.CAL.get(`bill:${u.ws}`, 'json'), { ws: u.ws }, now), now); }));
    await env.CAL.put('users', JSON.stringify(reg));
  }
  return reg;
}
const activeRegs = (reg, now = Date.now()) => Object.entries(reg).filter(([, u]) => (u.until || 0) > now);
/* Todas as pessoas para o relógio: a dupla + contas próprias COM PLANO ATIVO */
export async function everyone(env) {
  const team = JSON.parse(env.TEAM || '[]').map((m) => ({ ...m, ws: 'main', ctxKey: 'coach-ctx' }));
  const reg = await registry(env);
  return [...team, ...activeRegs(reg).map(([id, u]) => ({ id, name: u.name, ws: u.ws, ctxKey: `coach-ctx:${u.ws}` }))];
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
const LIMITS = { '/admin/grant': 30, '/admin/nudge-update': 20, '/log': 10, '/notify': 60, '/schedule': 30, '/personal': 30, '/coach': 20, '/ask': 15, '/tidy': 20, '/billing/checkout': 8, '/billing/portal': 8, '/billing/trial': 5, '/subscribe': 10, '/unsubscribe': 10, '/test': 6, '/coach-test': 4, '/pnudge-test': 4, '/account/delete': 3, '/share/sync': 20, '/seen': 20, '/support/send': 10, '/support/thread': 30, '/support/inbox': 30, '/support/reply': 30, '/rank/act': 40, '/rank/board': 20, '/rank/admin': 20 };
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
    const em = (env.ADMIN_EMAIL || JSON.parse(env.TEAM || '[]')[0]?.email || '').toLowerCase();
    const owner = JSON.parse(env.TEAM || '[]').find((m) => (m.email || '').toLowerCase() === em)?.id;
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
    const st = { ...(await billingStatus(env, me)), foundersLeft: Math.max(0, 200 - Number(await env.CAL.get('founders-count') || 0)) };
    // mantém o prazo do relógio em dia (ex.: o teste acabou, o mensal renovou)
    if (me.ws !== 'main') { const reg = (await env.CAL.get('users', 'json')) || {}; if (reg[me.id] && reg[me.id].until !== untilOf(st)) await registerUser(env, me, st); }
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
      const st = await grantComp(env, clean(body.uid, 64), body.on === true, Date.now(), Number(body.until) || 0);
      await refreshUntil(env, clean(body.uid, 64));
      return reply(env, req, { ok: true, status: st });
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
  if (url.pathname === '/billing/all') {
    if (!isAdmin(env, me)) return reply(env, req, { error: 'só o dono do app' }, 403);
    return reply(env, req, { ok: true, byWs: await billingAll(env) });
  }

  // ---------- erros do app (para o Painel do dono) ----------
  if (url.pathname === '/log') {
    const e = { msg: clean(body.msg, 300), where: clean(body.where, 160), ver: clean(body.ver, 40), dev: clean(body.dev, 40), space: clean(body.space, 20) };
    if (!e.msg) return reply(env, req, { ok: true });
    const list = (await env.CAL.get('errors', 'json')) || [];
    const sig = `${e.msg}|${e.where}`.slice(0, 400);
    const now = Date.now();
    const hit = list.find((x) => x.sig === sig);
    // o mesmo erro da mesma pessoa na última hora não gasta outra gravação
    if (hit && now - hit.last < 3600e3 && (hit.users || []).includes(me.id)) return reply(env, req, { ok: true });
    if (hit) { hit.count++; hit.last = now; hit.ver = e.ver || hit.ver; hit.users = [...new Set([...(hit.users || []), me.id])].slice(-20); }
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
    const s = body.subscription;
    if (!s?.endpoint || !/^https:\/\//.test(s.endpoint) || !s.keys?.p256dh || !s.keys?.auth) return reply(env, req, { error: 'aparelho inválido' }, 400);
    const subs = await getSubs(env);
    let id = clean(body.id, 80) || s.endpoint.slice(-40);
    // o identificador do aparelho de outra pessoa não pode ser reaproveitado (não dá para "sequestrar" os avisos dela)
    if (subs[id] && subs[id].member !== me.id) id = `${me.id}:${id}`.slice(0, 120);
    // o mesmo endereço de notificação não pode ficar registrado em nome de duas pessoas
    for (const [k, d] of Object.entries(subs)) if (k !== id && d.subscription?.endpoint === s.endpoint && d.member !== me.id) delete subs[k];
    subs[id] = {
      member: me.id,
      subscription: { endpoint: s.endpoint, keys: { p256dh: clean(s.keys.p256dh, 200), auth: clean(s.keys.auth, 100) } },
      prefs: { reminders: body.prefs?.reminders !== false, partner: body.prefs?.partner !== false, daily: body.prefs?.daily !== false, coach: body.prefs?.coach !== false },
      updatedAt: Date.now(),
    };
    await env.CAL.put('subs', JSON.stringify(subs));
    await registerUser(env, me);
    return reply(env, req, { ok: true, id });
  }

  // saiu da conta neste celular: o aparelho para de receber os avisos dela
  if (url.pathname === '/unsubscribe') {
    const endpoint = clean(body.endpoint, 1000), id = clean(body.id, 120);
    const subs = await getSubs(env);
    let n = 0;
    for (const [k, d] of Object.entries(subs)) if (d.member === me.id && (k === id || (endpoint && d.subscription?.endpoint === endpoint))) { delete subs[k]; n++; }
    if (n) await env.CAL.put('subs', JSON.stringify(subs));
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
    if (!prev || JSON.stringify(prev.items) !== JSON.stringify(items)) await env.CAL.put(scheduleKey(me), JSON.stringify({ items, updatedAt: now, by: me.id }));
    await registerUser(env, me, plan);
    return reply(env, req, { ok: true, count: items.length });
  }

  // Excluir conta (LGPD): assinaturas, aparelhos, lembretes, mensagens e registro de uso
  if (url.pathname === '/account/delete') {
    const out = await closeBilling(env, me);
    const subs = await getSubs(env);
    let devices = 0;
    for (const [id, d] of Object.entries(subs)) if (d.member === me.id) { delete subs[id]; devices++; }
    if (devices) await env.CAL.put('subs', JSON.stringify(subs));
    await Promise.all([`pitems:${me.id}`, `pprofile:${me.id}`].map((k) => env.CAL.delete(k)));
    if (me.ws !== 'main') {
      await Promise.all([`schedule:${me.ws}`, `coach-ctx:${me.ws}`].map((k) => env.CAL.delete(k)));
      const reg = (await env.CAL.get('users', 'json')) || {};
      if (reg[me.id]) { delete reg[me.id]; await env.CAL.put('users', JSON.stringify(reg)); }
    }
    return reply(env, req, { ok: true, devices, ...out });
  }

  if (url.pathname === '/test') {
    const statuses = [];
    const sent = await sendToMember(env, me.id, { title: 'Notificações ativadas ✓', body: 'É assim que os lembretes e os avisos do parceiro vão chegar.', tag: 'teste', url: './' }, null, statuses);
    const subs = await getSubs(env);
    return reply(env, req, { ok: true, sent, devices: Object.values(subs).filter((d) => d.member === me.id).length, statuses });
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
    if (!oldCtx || JSON.stringify([oldCtx.companies, oldCtx.work]) !== JSON.stringify([companies, work]) || Date.now() - (oldCtx.updatedAt || 0) > 6 * 3600e3) await env.CAL.put(ctxKey, JSON.stringify({ companies, work, updatedAt: Date.now() }));
    await registerUser(env, me, plan);
    return reply(env, req, { ok: true });
  }
  if (url.pathname === '/coach-test' || url.pathname === '/pnudge-test') {
    const key = url.pathname === '/coach-test' ? 'coach-force' : 'pnudge-force';
    const f = (await env.CAL.get(key, 'json')) || {};
    f[me.id] = Date.now();
    await env.CAL.put(key, JSON.stringify(f));
    return reply(env, req, { ok: true });
  }

  // ---------- suporte: chat da pessoa com o dono do app ----------
  if (url.pathname.startsWith('/support/')) {
    const ownerMember = () => { const em = (env.ADMIN_EMAIL || JSON.parse(env.TEAM || '[]')[0]?.email || '').toLowerCase(); return JSON.parse(env.TEAM || '[]').find((m) => (m.email || '').toLowerCase() === em)?.id || null; };
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
      th.updatedAt = now; th.unread = (th.unread || 0) + 1; th.userUnread = 0;
      await env.CAL.put(key(me.id), JSON.stringify(th));
      const idx = (await env.CAL.get('support-index', 'json')) || {};
      idx[me.id] = { name: me.name, email: me.email, at: now, unread: th.unread, last: text.slice(0, 80) };
      await env.CAL.put('support-index', JSON.stringify(idx));
      const owner = ownerMember();
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
        return reply(env, req, { ok: true, thread: th ? th.msgs : [], name: th?.name, email: th?.email });
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
    if (prevItems !== JSON.stringify(items)) await env.CAL.put(`pitems:${me.id}`, JSON.stringify(items));
    if (body.profile && typeof body.profile === 'object') {
      const { updatedAt, ...prof } = cleanProfile(body.profile, me);
      const old = await env.CAL.get(`pprofile:${me.id}`, 'json');
      const { updatedAt: u0, ...oldProf } = old || {};
      // grava se mudou ou a cada 3h (o "hoje" do servidor se baseia nesse resumo)
      if (!old || JSON.stringify(oldProf) !== JSON.stringify(prof) || Date.now() - (u0 || 0) > 3 * 3600e3) await env.CAL.put(`pprofile:${me.id}`, JSON.stringify({ ...prof, updatedAt: Date.now() }));
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

  // Uso de hoje (para a pessoa saber se está dentro do limite grátis)
  if (url.pathname === '/usage') {
    if (!isAdmin(env, me)) return reply(env, req, { error: 'só o dono do app' }, 403);
    const dayStart = Date.parse(new Date(Date.now() - 3 * 3600e3).toISOString().slice(0, 10) + 'T00:00:00-03:00');
    const [ss, ps, pc, co] = await Promise.all(['schedule-sent', 'personal-sent', 'pcoach', 'coach'].map((k) => env.CAL.get(k, 'json')));
    const today = (o) => Object.values(o || {}).filter((t) => t >= dayStart).length;
    const date = new Date(Date.now() - 3 * 3600e3).toISOString().slice(0, 10);
    const amigo = Object.values(pc || {}).reduce((acc, st) => (st.usage?.date === date ? { sent: acc.sent + st.usage.sent, ai: acc.ai + st.usage.ai } : acc), { sent: 0, ai: 0 });
    const coach = co?.usage?.date === date ? co.usage : { sent: 0, ai: 0 };
    const aiMsgs = amigo.ai + coach.ai;
    return reply(env, req, {
      ok: true,
      lembretes: today(ss), pessoais: today(ps), amigo, coach,
      // estimativa: cada mensagem escrita pela IA gasta ~40 "neurônios" de 10.000 grátis por dia
      iaPercent: Math.min(100, Math.round((aiMsgs * 40) / 10000 * 100)),
    });
  }

  if (url.pathname === '/devices') {
    const subs = Object.values(await getSubs(env));
    const counts = {};
    const mine = membersOf(me, env);
    for (const d of subs) if (mine.includes(d.member)) counts[d.member] = (counts[d.member] || 0) + 1;
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
async function oneShot(env) {
  for (const m of ONE_SHOT) {
    const k = `oneshot:${m.key}`;
    if (await env.CAL.get(k)) continue;
    await env.CAL.put(k, String(Date.now()));
    await sendToMember(env, m.member, { title: m.title, body: m.body, tag: m.tag, url: m.url }, null);
  }
}

export default {
  fetch: (req, env) => handle(req, env).catch((e) => reply(env, req, { error: 'erro interno: ' + e.message }, 500)),
  scheduled: (_event, env, ctx) => {
    const safe = (name, p) => p.catch((e) => console.log(name, e.message));
    ctx.waitUntil(everyone(env).then((team) => Promise.all([
      safe('lembretes', runSchedule(env)),
      safe('pessoal', runPersonal(env)),
      safe('coach', runCoach(env, sendToMember, team)),
      safe('amigo', (async () => {
        const wk = rankWeek(Date.now());
        let board = null;
        const rankInfo = async (ws) => {
          board = board || (await env.CAL.get(`rank:${wk}`, 'json')) || {};
          const s = rankStanding(board, ws);
          if (!s || !s.pos) return null;
          const ahead = s.pos > 1 ? s.group[s.pos - 2][1].pts - s.pts + 1 : 0;
          return { pos: s.pos, week: wk, leagueName: { bronze: 'Bronze', prata: 'Prata', ouro: 'Ouro' }[s.league], ahead };
        };
        return runPersonalCoach(env, sendToMember, team, rankInfo);
      })()),
      safe('aviso único', oneShot(env)),
      safe('ranking', monthlyAward(env, { stripe: stripeApi, getBill, putBill, notify: (id, msg) => sendToMember(env, id, msg) })),
    ])));
  },
};
export { runSchedule, runPersonal, handle, sendToMember };
