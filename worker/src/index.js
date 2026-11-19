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
import { startTrial, billingStatus, createCheckout, createPortal, verifyStripe, handleStripeEvent, billingAll, syncTeam, teamActive } from './billing.js';

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
  const reg = (await env.CAL.get('users', 'json')) || {};
  const others = await Promise.all([...new Set(Object.values(reg).map((u) => u.ws))].map((ws) => env.CAL.get(`schedule:${ws}`, 'json')));
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
const reply = (env, req, data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', ...cors(env, req) } });

const clean = (s, n) => String(s || '').slice(0, n);
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
async function registerUser(env, me) {
  if (me.ws === 'main' || me.guest) return; // convidado: o relógio já roda pela agenda do dono
  const reg = (await env.CAL.get('users', 'json')) || {};
  const cur = reg[me.id];
  if (cur && cur.name === me.name && cur.ws === me.ws) return; // já conhecido: não gasta gravação
  reg[me.id] = { name: me.name, ws: me.ws, at: Date.now() };
  await env.CAL.put('users', JSON.stringify(reg));
}
/* Todas as pessoas para o relógio: a dupla + contas próprias */
export async function everyone(env) {
  const team = JSON.parse(env.TEAM || '[]').map((m) => ({ ...m, ws: 'main', ctxKey: 'coach-ctx' }));
  const reg = (await env.CAL.get('users', 'json')) || {};
  return [...team, ...Object.entries(reg).map(([id, u]) => ({ id, name: u.name, ws: u.ws, ctxKey: `coach-ctx:${u.ws}` }))];
}
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
    },
    work: p.work && typeof p.work === 'object' ? { profession: clean(p.work.profession, 80), goal: clean(p.work.goal, 80) } : null,
    today: arr(p.today, 20).map(ev), tomorrow: arr(p.tomorrow, 20).map(ev), overdue: arr(p.overdue, 10).map(ev),
    lastByCat: byCat(p.lastByCat), nextByCat: byCat(p.nextByCat),
    birthdays: arr(p.birthdays, 10).map((b) => ({ name: clean(b?.name, 60), inDays: Number.isFinite(b?.inDays) ? b.inDays : 99 })),
    lists: arr(p.lists, 10).map((l) => ({ name: clean(l?.name, 60), open: Number.isFinite(l?.open) ? l.open : 0 })),
    updatedAt: Date.now(),
  };
}

async function handle(req, env) {
  const url = new URL(req.url);
  if (req.method === 'OPTIONS') return new Response(null, { headers: cors(env, req) });
  if (url.pathname === '/vapid') return reply(env, req, { publicKey: (await getVapid(env)).publicKey });
  if (url.pathname === '/' || url.pathname === '/health') return reply(env, req, { ok: true, servico: 'Lembra', chat: !!(env.ANTHROPIC_API_KEY || env.AI) });
  // Abre o lembrete direto na tela "Adicionar ao Calendário" do iPhone (sem menu de apps)
  if (url.pathname === '/ics' && req.method === 'POST') {
    const form = await req.formData().catch(() => null);
    const text = String((form && form.get('ics')) || '');
    if (!text.startsWith('BEGIN:VCALENDAR') || text.length > 300000) return new Response('Arquivo inválido', { status: 400 });
    return new Response(text, { headers: { 'Content-Type': 'text/calendar; charset=utf-8', 'Content-Disposition': 'inline; filename="lembrete.ics"', 'Cache-Control': 'no-store' } });
  }
  // Avisos da Stripe (pagamento confirmado, renovação, cancelamento): conferidos pela assinatura
  if (url.pathname === '/billing/webhook' && req.method === 'POST') {
    const payload = await req.text();
    try {
      const ev = await verifyStripe(env, payload, req.headers.get('Stripe-Signature'));
      await handleStripeEvent(env, ev);
      return new Response('ok');
    } catch (e) {
      console.log('webhook stripe', e.message);
      return new Response('assinatura inválida', { status: 400 });
    }
  }
  if (req.method !== 'POST') return reply(env, req, { error: 'método não permitido' }, 405);

  let me;
  try {
    me = await verifyIdToken((req.headers.get('Authorization') || '').replace(/^Bearer\s+/i, ''), env);
  } catch (e) {
    return reply(env, req, { error: 'Sem permissão: ' + e.message }, 401);
  }
  const body = await req.json().catch(() => ({}));

  // ---------- agenda compartilhada (complemento pago) ----------
  if (url.pathname === '/share/sync') {
    try {
      return reply(env, req, await syncTeam(env, me, (Array.isArray(body.members) ? body.members : []).slice(0, 20).map((m) => ({ uid: clean(m?.uid, 64), name: clean(m?.name, 40) })), Date.now(), clean(body.ownerName, 40)));
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
  if (url.pathname === '/billing/status') return reply(env, req, await billingStatus(env, me));
  if (url.pathname === '/billing/trial') {
    const st = await startTrial(env, me, { deviceId: clean(body.deviceId, 80), ip: req.headers.get('CF-Connecting-IP') || '', cpf: clean(body.cpf, 20) });
    await registerUser(env, me);
    return reply(env, req, st);
  }
  if (url.pathname === '/billing/checkout' || url.pathname === '/billing/portal') {
    try {
      const fn = url.pathname === '/billing/checkout' ? createCheckout : createPortal;
      return reply(env, req, await fn(env, me, { plan: clean(body.plan, 20), returnUrl: clean(body.returnUrl, 300) }));
    } catch (e) {
      return reply(env, req, { error: e.message }, e.status || 500);
    }
  }
  if (url.pathname === '/billing/all') {
    const owner = (env.ADMIN_EMAIL || JSON.parse(env.TEAM || '[]')[0]?.email || '').toLowerCase();
    if (me.email?.toLowerCase() !== owner) return reply(env, req, { error: 'só o dono do app' }, 403);
    return reply(env, req, { ok: true, byWs: await billingAll(env) });
  }

  if (url.pathname === '/subscribe') {
    const s = body.subscription;
    if (!s?.endpoint || !/^https:\/\//.test(s.endpoint) || !s.keys?.p256dh || !s.keys?.auth) return reply(env, req, { error: 'aparelho inválido' }, 400);
    const subs = await getSubs(env);
    const id = clean(body.id, 80) || s.endpoint.slice(-40);
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

  if (url.pathname === '/notify') {
    const to = (Array.isArray(body.to) ? body.to : []).filter((m) => membersOf(me, env).includes(m) && (m !== me.id || body.includeSelf === true));
    const msg = { title: clean(body.title, 120), body: clean(body.body, 300), tag: clean(body.tag, 80), url: clean(body.url, 200) || './' };
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
      .map((it) => ({ id: clean(it.id, 120), at: it.at, member: it.member, title: clean(it.title, 120), body: clean(it.body, 300), tag: clean(it.tag, 80), url: clean(it.url, 200), kind: ['reminders', 'daily'].includes(it.kind) ? it.kind : 'reminders', badge: Number.isFinite(it.badge) ? it.badge : undefined }));
    await env.CAL.put(scheduleKey(me), JSON.stringify({ items, updatedAt: now, by: me.id }));
    await registerUser(env, me);
    return reply(env, req, { ok: true, count: items.length });
  }

  if (url.pathname === '/test') {
    const statuses = [];
    const sent = await sendToMember(env, me.id, { title: 'Notificações ativadas ✓', body: 'É assim que os lembretes e os avisos do parceiro vão chegar.', tag: 'teste', url: './' }, null, statuses);
    const subs = await getSubs(env);
    return reply(env, req, { ok: true, sent, devices: Object.values(subs).filter((d) => d.member === me.id).length, statuses });
  }

  if (url.pathname === '/coach') {
    const companies = (Array.isArray(body.companies) ? body.companies : []).slice(0, 40).map((c) => ({
      onlyFor: /^[a-z]{1,20}$/.test(c.onlyFor || '') ? c.onlyFor : null, name: clean(c.name, 80), niche: clean(c.niche, 160), lastPost: clean(c.lastPost, 10), nextPost: clean(c.nextPost, 10),
      daysSincePost: typeof c.daysSincePost === 'number' ? c.daysSincePost : null,
    }));
    const W = body.work && typeof body.work === 'object' ? body.work : null;
    const work = W ? {
      arch: /^[a-z_]{2,30}$/.test(W.arch || '') ? W.arch : 'generico', profession: clean(W.profession, 80), entity: clean(W.entity, 30),
      tips: (Array.isArray(W.tips) ? W.tips : []).slice(0, 12).map((t) => clean(t, 240)).filter(Boolean),
      next: (Array.isArray(W.next) ? W.next : []).slice(0, 5).map((e) => ({ date: clean(e?.date, 10), time: /^\d{2}:\d{2}$/.test(e?.time || '') ? e.time : '', label: clean(e?.label, 40), title: clean(e?.title, 60), who: /^[\w-]{1,40}$/.test(e?.who || '') ? e.who : '' })),
      late: Number.isFinite(W.late) ? Math.min(99, Math.max(0, W.late)) : 0,
    } : null;
    await env.CAL.put(me.ws === 'main' ? 'coach-ctx' : `coach-ctx:${me.ws}`, JSON.stringify({ companies, work, updatedAt: Date.now() }));
    await registerUser(env, me);
    return reply(env, req, { ok: true });
  }
  if (url.pathname === '/coach-test' || url.pathname === '/pnudge-test') {
    const key = url.pathname === '/coach-test' ? 'coach-force' : 'pnudge-force';
    const f = (await env.CAL.get(key, 'json')) || {};
    f[me.id] = Date.now();
    await env.CAL.put(key, JSON.stringify(f));
    return reply(env, req, { ok: true });
  }

  if (url.pathname === '/personal') {
    const items = (Array.isArray(body.items) ? body.items : []).slice(0, 300)
      .filter((it) => it && typeof it.at === 'number')
      .map((it) => ({ id: clean(it.id, 120), at: it.at, title: clean(it.title, 80), body: clean(it.body, 200), tag: clean(it.tag, 80), url: clean(it.url, 120) }));
    await env.CAL.put(`pitems:${me.id}`, JSON.stringify(items));
    if (body.profile && typeof body.profile === 'object') await env.CAL.put(`pprofile:${me.id}`, JSON.stringify(cleanProfile(body.profile, me)));
    await registerUser(env, me);
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

export default {
  fetch: (req, env) => handle(req, env).catch((e) => reply(env, req, { error: 'erro interno: ' + e.message }, 500)),
  scheduled: (_event, env, ctx) => {
    const safe = (name, p) => p.catch((e) => console.log(name, e.message));
    ctx.waitUntil(everyone(env).then((team) => Promise.all([
      safe('lembretes', runSchedule(env)),
      safe('pessoal', runPersonal(env)),
      safe('coach', runCoach(env, sendToMember, team)),
      safe('amigo', runPersonalCoach(env, sendToMember, team)),
    ])));
  },
};
export { runSchedule, runPersonal, handle, sendToMember };
