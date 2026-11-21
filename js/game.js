/* Conquistas do Lembra: XP, níveis 0–100 e 105 emblemas.
   Pensado para quem tem dificuldade de manter o hábito (inclusive TDAH): recompensa NA HORA, metas pequenas,
   nada de perder o que conquistou, e quem volta depois de uns dias ganha um emblema ("Volta por cima") em vez de culpa.

   Anti-trapaça (sem prêmio em dinheiro aqui — o ranking com prêmio é conferido no servidor):
   - cada compromisso dá XP de conclusão uma vez só (desmarcar e marcar de novo não conta);
   - criar e concluir na mesma hora algo marcado para depois quase não rende XP;
   - limite por dia de XP por criar compromisso e por bilhete, e teto de XP por dia.
   Fica salvo na conta (users/{uid}.game): aparece igual em qualquer celular. */
import { store, saveProfileQuiet } from './store.js';
import { todayKey, addDays, isStandalone } from './utils.js';
import { personal, overdue } from './personal.js';
import { BADGES, RARITY, badgeArt, crest, tierOf, badgeById } from './badges.js';
import { esc } from './utils.js';
import { icon } from './icons.js';
import { brand } from './brand.js';

export const MAX_LEVEL = 100;
/* XP total para chegar ao nível L (curva: começo rápido, fim desafiador). Nível 10 ≈ 1 semana de uso, nível 100 ≈ 1 ano e meio */
export const xpFor = (L) => Math.round(25 * Math.pow(L, 1.8));
export function levelOf(xp) {
  let L = 0;
  while (L < MAX_LEVEL && xpFor(L + 1) <= xp) L++;
  return L;
}
export function levelInfo(xp = state().xp) {
  const level = levelOf(xp), cur = xpFor(level), next = level >= MAX_LEVEL ? cur : xpFor(level + 1);
  return { level, xp, cur, next, need: Math.max(0, next - xp), pct: level >= MAX_LEVEL ? 1 : (xp - cur) / Math.max(1, next - cur), tier: tierOf(level) };
}

const CAPS = { createXp: 10, noteXp: 5, personalXp: 20, dayXp: 900, createCount: 30, noteCount: 12 };
const XP = { onTime: 20, late: 8, quick: 2, personal: 12, create: 5, note: 3, open: 10, perfect: 40, comeback: 30 };

/* ---------- estado ---------- */
const blank = () => ({ v: 1, xp: 0, badges: {}, c: {}, d: { day: '', xp: 0, created: 0, notes: 0, personal: 0, done: 0, times: [] }, ids: [], days: [], mon: {}, seeded: false });
let S = null, uidKey = '';
const LS = () => `lembra.game.${store.user?.uid || store.me || 'x'}`;
function load() {
  try { window.__pronoun = store.profile?.pronoun || 'n'; } catch { /* ok */ }
  const key = LS();
  if (S && uidKey === key) return S;
  uidKey = key;
  let local = null;
  try { local = JSON.parse(localStorage.getItem(key) || 'null'); } catch { /* ok */ }
  S = merge(blank(), merge(local, store.profile?.game));
  return S;
}
/* junta dois estados (celular + nuvem) sem perder nada: maior XP, todos os emblemas, maiores contadores */
function merge(a, b) {
  if (!a) return b && typeof b === 'object' ? clean(b) : null;
  if (!b || typeof b !== 'object') return a;
  b = clean(b);
  const out = { ...a, xp: Math.max(a.xp || 0, b.xp || 0), seeded: !!(a.seeded || b.seeded) };
  out.badges = { ...(b.badges || {}) };
  for (const [k, t] of Object.entries(a.badges || {})) out.badges[k] = Math.min(t, out.badges[k] || t);
  out.c = { ...(a.c || {}) };
  for (const [k, v] of Object.entries(b.c || {})) if (typeof v === 'number') out.c[k] = Math.max(out.c[k] || 0, v); else if (typeof v === 'string' && (!out.c[k] || v > out.c[k])) out.c[k] = v;
  out.ids = [...new Set([...(a.ids || []), ...(b.ids || [])])].slice(-500);
  out.days = [...new Set([...(a.days || []), ...(b.days || [])])].sort().slice(-400);
  out.mon = { ...(a.mon || {}) };
  for (const [k, v] of Object.entries(b.mon || {})) out.mon[k] = Math.max(out.mon[k] || 0, v);
  out.d = (a.d?.day || '') >= (b.d?.day || '') ? a.d : b.d;
  return out;
}
function clean(g) {
  const n = (v, max = 1e9) => (Number.isFinite(+v) ? Math.max(0, Math.min(max, +v)) : 0);
  const ok = (k) => /^[a-z0-9_]{1,24}$/i.test(k);
  return {
    v: 1, xp: n(g.xp, 5e6), seeded: !!g.seeded,
    badges: Object.fromEntries(Object.entries(g.badges || {}).filter(([k, t]) => ok(k) && badgeById(k) && Number.isFinite(+t)).map(([k, t]) => [k, +t])),
    c: Object.fromEntries(Object.entries(g.c || {}).filter(([k]) => ok(k)).map(([k, v]) => [k, typeof v === 'string' ? v.slice(0, 12) : n(v)])),
    d: g.d && typeof g.d === 'object' ? { day: String(g.d.day || '').slice(0, 10), xp: n(g.d.xp), created: n(g.d.created), notes: n(g.d.notes), personal: n(g.d.personal), done: n(g.d.done), times: (Array.isArray(g.d.times) ? g.d.times : []).filter(Number.isFinite).slice(-6) } : blank().d,
    ids: (Array.isArray(g.ids) ? g.ids : []).filter((x) => typeof x === 'string').map((x) => x.slice(0, 60)).slice(-500),
    days: (Array.isArray(g.days) ? g.days : []).filter((x) => /^\d{4}-\d{2}-\d{2}$/.test(x)).slice(-400),
    mon: Object.fromEntries(Object.entries(g.mon || {}).filter(([k]) => /^\d{4}-\d{2}$/.test(k)).slice(-14).map(([k, v]) => [k, n(v, 31)])),
  };
}
export const state = () => load();
let saveT = null;
function save(now = false) {
  try { localStorage.setItem(LS(), JSON.stringify(S)); } catch { /* ok */ }
  clearTimeout(saveT);
  const go = () => {
    if (store.mode !== 'cloud' || !store.user) return;
    const g = { ...S, ids: S.ids.slice(-300) };
    saveProfileQuiet({ game: g }).catch(() => {});
    // resumo para o Painel do dono e para o placar da equipe
    store.backendApi?.touchStats?.(store.user.uid, { game: { level: levelOf(S.xp), xp: S.xp, badges: Object.keys(S.badges).length } }).catch(() => {});
    teamLevel();
  };
  if (now) go(); else saveT = setTimeout(go, 4000);
}
const dayReset = () => { const t = todayKey(); if (S.d.day !== t) S.d = { day: t, xp: 0, created: 0, notes: 0, personal: 0, done: 0, times: [] }; };

/* ---------- XP ---------- */
let listeners = [];
export const onGame = (fn) => { listeners.push(fn); return () => { listeners = listeners.filter((f) => f !== fn); }; };
function gain(xp, why = '', { fly = true } = {}) {
  load(); dayReset();
  const room = Math.max(0, CAPS.dayXp - S.d.xp);
  const got = Math.max(0, Math.min(xp, room));
  if (!got) return 0;
  S.xp += got; S.d.xp += got;
  if (fly) xpFly(got, why);
  return got;
}
/* depois de qualquer mudança: confere emblemas, nível e salva */
function settle({ quiet = false } = {}) {
  load();
  const before = S.c._lvl ?? levelOf(S.xp);
  const fresh = [];
  for (let round = 0; round < 3; round++) {
    const m = metrics();
    const now = BADGES.filter((b) => !S.badges[b.id] && (m[b.metric] || 0) >= b.goal);
    if (!now.length) break;
    for (const b of now) { S.badges[b.id] = Date.now(); fresh.push(b); S.xp += RARITY[b.rarity].xp; }
  }
  const after = levelOf(S.xp);
  S.c._lvl = after;
  publishRing();
  save();
  if (!quiet) {
    if (after > before) {
      const newTier = tierOf(before).from !== tierOf(after).from;
      // logo depois das boas-vindas (que já mostram o nível), não repete; níveis baixos sem brasão novo: aviso pequeno
      if (Date.now() - welcomedAt < 90e3) { /* já mostrado nas boas-vindas */ }
      else if (after < 5 && !newTier) { mini.push({ level: after }); setTimeout(pumpMini, 300); }
      else celebrate({ type: 'level', level: after, from: before });
    }
    fresh.filter((b) => !b.crestTier).forEach((b) => celebrate({ type: 'badge', b }));
  }
  listeners.forEach((f) => { try { f(); } catch { /* ok */ } });
  return fresh;
}

/* ---------- números que os emblemas usam ---------- */
const mineEv = (e) => !store.me || (e.assignees || []).includes(store.me) || e.createdBy === store.me || !(e.assignees || []).length;
export function metrics() {
  load();
  const c = S.c, me = store.member(store.me) || {};
  let best = c.bestStreak || 0;
  try { best = Math.max(best, JSON.parse(localStorage.getItem(`lembra.streak.${store.user?.uid || store.me || 'x'}`) || '{}').best || 0); } catch { /* ok */ }
  const created = store.user?.metadata?.creationTime ? Date.parse(store.user.metadata.creationTime) : 0;
  return {
    ...c,
    xp: S.xp, level: levelOf(S.xp), bestStreak: best,
    ficha: store.profile?.onboardedAt ? 1 : 0,
    photo: me.photo ? 1 : 0,
    notif: typeof Notification !== 'undefined' && Notification.permission === 'granted' ? 1 : 0,
    installed: isStandalone() ? 1 : 0,
    phoneOk: store.profile?.phoneVerified ? 1 : 0,
    personalItems: (personal.events || []).length,
    birthdays: (personal.events || []).filter((x) => x.cat === 'aniversario').length,
    lists: (personal.lists || []).length,
    companies: store.state.companies.filter((x) => store.solo || !x.createdBy || x.createdBy === store.me).length,
    team: store.team.length > 1 ? 1 : 0,
    goodMonths: Object.values(S.mon || {}).filter((n) => n >= 20).length,
    accountYears: created ? Math.floor((Date.now() - created) / (365.25 * 864e5)) : 0,
    founder: store.billing?.founder ? 1 : 0,
    // só conta depois que a pessoa viu a revelação do presente (ela mesma mostra o emblema)
    vip: store.billing?.plan === 'lifetime' && store.billing?.vip && (() => { try { return localStorage.getItem('lembra.vip.seen') === String(store.billing.vip.no); } catch { return false; } })() ? 1 : 0,
  };
}
export function progressOf(b) {
  const v = metrics()[b.metric] || 0;
  return { value: Math.min(v, b.goal), goal: b.goal, pct: Math.min(1, v / b.goal), done: !!S.badges[b.id], at: S.badges[b.id] || 0 };
}

/* ---------- quando algo acontece ---------- */
const dueOf = (date, time) => new Date(`${date}T${/^\d{2}:\d{2}$/.test(time || '') ? time : '23:59'}:00`).getTime();
/* concluiu algo (trabalho ou Pessoal) */
function completed({ key, due, createdAt = 0, kind = 'work', hasTime = false }) {
  load(); dayReset();
  if (S.ids.includes(key)) return; // já deu XP por isso
  S.ids.push(key); if (S.ids.length > 500) S.ids = S.ids.slice(-500);
  const now = Date.now(), d = new Date(now), t = todayKey();
  const quick = createdAt && now - createdAt < 3 * 60e3 && due - now > 30 * 60e3;
  const c = S.c;
  c.doneAll = (c.doneAll || 0) + 1;
  let xp = 0, why = '';
  if (kind === 'personal') {
    c.personalDone = (c.personalDone || 0) + 1;
    S.d.personal++;
    xp = S.d.personal <= CAPS.personalXp ? (quick ? XP.quick : XP.personal) : 0; why = 'Pessoal';
  } else if (quick) { xp = XP.quick; why = 'concluído'; }
  else if (now <= due + 15 * 60e3) { c.onTime = (c.onTime || 0) + 1; xp = XP.onTime; why = 'no horário'; }
  else { c.late = (c.late || 0) + 1; xp = XP.late; why = 'concluído'; }
  if (!quick && kind === 'work') {
    if (hasTime && Math.abs(now - due) <= 5 * 60e3) c.exact = (c.exact || 0) + 1;
    if (due - now >= 60 * 60e3) c.ahead = (c.ahead || 0) + 1;
  }
  const h = d.getHours(), dow = d.getDay();
  if (h < 8) c.early = (c.early || 0) + 1;
  if (h >= 21) c.night = (c.night || 0) + 1;
  if (dow === 0 || dow === 6) c.weekend = (c.weekend || 0) + 1;
  if (dow === 1 && h < 9 && c.lastMonday !== t) { c.mondayEarly = (c.mondayEarly || 0) + 1; c.lastMonday = t; }
  if (d.getMonth() === 0 && d.getDate() === 1) c.newYear = 1;
  // voltou depois de 3+ dias sem concluir nada: comemora a volta (sem culpa)
  if (c.lastDone && c.lastDone < addDays(t, -3)) { c.comebacks = (c.comebacks || 0) + 1; xp += XP.comeback; why = 'volta por cima'; }
  c.lastDone = t;
  if (!S.days.includes(t)) S.days = [...S.days, t].slice(-400);
  S.d.done++; c.maxDay = Math.max(c.maxDay || 0, S.d.done);
  S.d.times = [...S.d.times, now].slice(-5);
  if (S.d.times.length === 5 && now - S.d.times[0] <= 60 * 60e3) c.blitz = 1;
  // sequência (dias seguidos) — a mesma do círculo de progresso
  try { const st = JSON.parse(localStorage.getItem(`lembra.streak.${store.user?.uid || store.me || 'x'}`) || '{}'); c.bestStreak = Math.max(c.bestStreak || 0, st.best || 0); } catch { /* ok */ }
  gain(xp, why);
  // dia 100%: tudo de hoje concluído (pelo menos 2 coisas)
  if (kind === 'work') {
    const today = store.eventsOn(t, { person: store.me || 'all' }).filter(mineEv);
    if (today.length >= 2 && today.every((e) => e.status === 'feito') && c.perfectDay !== t) { c.perfectDays = (c.perfectDays || 0) + 1; c.perfectDay = t; gain(XP.perfect, 'dia 100%'); }
  }
  // caixa zerada: nada atrasado no trabalho nem no Pessoal (depois de pegar o ritmo)
  if ((c.doneAll || 0) >= 5) {
    const lateWork = store.state.events.filter((e) => mineEv(e) && e.status !== 'feito' && e.date < t && e.date >= addDays(t, -60)).length;
    if (!lateWork && !overdue().length) c.zeroed = 1;
  }
  // sextou em paz: sexta depois das 18h com a semana (seg–sex) toda concluída
  if (dow === 5 && h >= 18) {
    const week = store.eventsBetween(addDays(t, -4), t, { person: store.me || 'all' }).filter(mineEv);
    if (week.length >= 3 && week.every((e) => e.status === 'feito')) c.fridayClear = 1;
  }
  settle();
}
/* compromisso criado / concluído (gancho do store) */
export function onEvent(prev, item) {
  if (!item || store.mode === 'local' && !store.me) return;
  load(); dayReset();
  if (!prev && mineEv(item) && item.createdBy === store.me) {
    S.d.created++;
    if (S.d.created <= CAPS.createCount) S.c.created = (S.c.created || 0) + 1;
    if (S.d.created <= CAPS.createXp) gain(XP.create, 'compromisso marcado', { fly: false });
    settle();
  }
  if (item.status === 'feito' && prev?.status !== 'feito' && mineEv(item)) completed({ key: `e:${item.id}`, due: dueOf(item.date, item.time), createdAt: item.createdAt || 0, hasTime: /^\d{2}:\d{2}$/.test(item.time || '') });
}
/* Pessoal: concluiu um lembrete (ou um dia de um lembrete que repete) */
export function onPersonal(before, after) {
  if (!after) return;
  if (!after.repeat || after.repeat === 'none') {
    if (after.done && !before?.done) completed({ key: `p:${after.id}`, due: dueOf(after.date, after.time), createdAt: after.createdAt || 0, kind: 'personal' });
    return;
  }
  const had = new Set(before?.doneDates || []);
  (after.doneDates || []).filter((d) => !had.has(d)).forEach((d) => completed({ key: `p:${after.id}:${d}`, due: dueOf(d, after.time), createdAt: after.createdAt || 0, kind: 'personal' }));
}
/* bilhete escrito */
export function onNote(note) {
  load(); dayReset();
  S.d.notes++;
  if (S.d.notes <= CAPS.noteCount) S.c.notes = (S.c.notes || 0) + 1;
  if ((note?.mentions || []).length) S.c.mentions = (S.c.mentions || 0) + 1;
  if (S.d.notes <= CAPS.noteXp) gain(XP.note, 'bilhete', { fly: false });
  settle();
}
/* entrega emblemas pendentes sem comemoração (ex.: Vitalício, que já tem a própria revelação) */
export function quietSettle() { settle({ quiet: true }); }
export function onInvite() { load(); S.c.invites = (S.c.invites || 0) + 1; settle(); }
/* ranking: guarda a melhor liga e pódios (vem da tela do ranking) */
export function onRank(board) {
  if (!board) return;
  load();
  const L = { bronze: 0, prata: 1, ouro: 2 }[board.league] ?? 0;
  S.c.league = Math.max(S.c.league || 0, L);
  if (board.me && board.me.pos && board.me.pos <= 3 && board.me.pts > 0 && !board.me.flagged) S.c.podium = 1;
  if (board.lastWinner && board.lastWinner.me) S.c.champion = 1;
  settle();
}
export function onTeamBoard({ top = false, perfect = false } = {}) {
  load();
  if (top) S.c.teamTop = 1;
  if (perfect) S.c.teamPerfectWeeks = Math.max(S.c.teamPerfectWeeks || 0, 1);
  settle();
}

/* abriu o app: XP do dia, dias ativos e meses constantes. Na 1ª vez, calcula o que a pessoa já fez antes */
export function startGame() {
  load(); dayReset();
  if (!S.seeded) seed();
  const t = todayKey(), c = S.c;
  if (c.lastOpen !== t) {
    c.lastOpen = t;
    c.activeDays = (c.activeDays || 0) + 1;
    const ym = t.slice(0, 7);
    S.mon[ym] = (S.mon[ym] || 0) + 1;
    S.mon = Object.fromEntries(Object.entries(S.mon).sort().slice(-14));
    gain(XP.open, 'bom te ver', { fly: false });
  }
  settle({ quiet: !S.c._welcomed });
  if (!S.c._welcomed) { S.c._welcomed = 1; welcomedAt = Date.now(); save(true); celebrate({ type: 'welcome' }); }
}
/* primeira vez: o que já existe na conta vira XP e emblemas (sem enxurrada de comemorações) */
function seed() {
  const mine = store.state.events.filter(mineEv);
  const done = mine.filter((e) => e.status === 'feito');
  const c = S.c;
  c.created = Math.max(c.created || 0, Math.min(1000, mine.filter((e) => e.createdBy === store.me).length));
  c.doneAll = Math.max(c.doneAll || 0, done.length);
  c.onTime = Math.max(c.onTime || 0, done.length);
  c.notes = Math.max(c.notes || 0, store.state.notes.filter((n) => n.author === store.me).length);
  c.mentions = Math.max(c.mentions || 0, store.state.notes.filter((n) => n.author === store.me && (n.mentions || []).length).length);
  const pDone = (personal.events || []).reduce((a, it) => a + (it.done ? 1 : 0) + (it.doneDates || []).length, 0);
  c.personalDone = Math.max(c.personalDone || 0, pDone);
  S.ids = [...new Set([...S.ids, ...done.map((e) => `e:${e.id}`)])].slice(-500);
  S.xp = Math.max(S.xp, Math.min(4000, c.created * XP.create + done.length * 15 + c.notes * XP.note + pDone * 10));
  S.seeded = true;
}

/* ---------- placar da equipe: o nível de cada um aparece para os colegas ---------- */
let lastTeamLvl = '';
function teamLevel() {
  const L = levelOf(S.xp), vip = !!(store.billing?.plan === 'lifetime' && store.billing?.vip), key = `${L}:${vip}`;
  if (key === lastTeamLvl || !store.backendApi?.setMyTeamLevel) return;
  lastTeamLvl = key;
  store.backendApi.setMyTeamLevel(store.shared?.owner || null, store.user?.uid, L, vip).catch(() => {});
}

/* ---------- "+20 XP" subindo na tela ---------- */
function xpFly(n, why) {
  if (typeof document === 'undefined' || n <= 0) return;
  const el = document.createElement('div');
  el.className = 'xpfly';
  el.innerHTML = `<b>+${n} XP</b>${why ? `<span>${esc(why)}</span>` : ''}`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1700);
}

/* ---------- comemoração (uma de cada vez, sem atropelar o que a pessoa está fazendo) ---------- */
const queue = [];
let showing = false;
export function celebrate(item) {
  // emblema comum: aviso pequeno no topo (não interrompe); raro para cima e níveis: tela cheia
  if (item.type === 'badge' && item.b.rarity === 'comum') { mini.push(item.b); setTimeout(pumpMini, 700); return; }
  queue.push(item); setTimeout(pump, 350);
}
const mini = [];
let miniOn = false, welcomedAt = 0;
function pumpMini() {
  if (miniOn || !mini.length) return;
  if (document.querySelector('.gx, .okfx, .ficha, .paywall, .photogate')) { setTimeout(pumpMini, 1200); return; }
  miniOn = true;
  // várias conquistas de uma vez: um aviso só, com as medalhas empilhadas
  const group = mini.filter((x) => !x.level);
  let b = mini.shift();
  const el = document.createElement('button');
  el.className = 'gxmini';
  if (!b.level && group.length > 1) {
    group.forEach((x) => { const i = mini.indexOf(x); if (i >= 0) mini.splice(i, 1); });
    const xp = group.reduce((a, x) => a + RARITY[x.rarity].xp, 0);
    el.innerHTML = `<span class="gxmini__m gxmini__stack">${group.slice(0, 3).map((x) => badgeArt(x, 44)).join('')}</span><span class="gxmini__t"><small>${group.length} conquistas desbloqueadas</small><b>${esc(group.slice(0, 2).map((x) => x.name()).join(' · '))}${group.length > 2 ? '…' : ''}</b></span><span class="gxmini__xp">+${xp} XP</span>`;
    b = { many: true };
  } else if (b.level) el.innerHTML = `<span class="gxmini__m">${crest(b.level, 50)}</span><span class="gxmini__t"><small>Subiu de nível</small><b>Nível ${b.level}</b></span><span class="gxmini__xp">${esc(tierOf(b.level).name())}</span>`;
  else el.innerHTML = `<span class="gxmini__m">${badgeArt(b, 50)}</span><span class="gxmini__t"><small>Conquista desbloqueada</small><b>${esc(b.name())}</b></span><span class="gxmini__xp">+${RARITY[b.rarity].xp} XP</span>`;
  document.body.appendChild(el);
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('is-in')));
  import('./sound.js').then((s) => s.pop(true)).catch(() => {});
  try { navigator.vibrate && navigator.vibrate([10, 40, 14]); } catch { /* ok */ }
  const close = () => { el.classList.remove('is-in'); setTimeout(() => { el.remove(); miniOn = false; setTimeout(pumpMini, 250); }, 320); };
  const t = setTimeout(close, 3600);
  el.onclick = () => { clearTimeout(t); close(); import('./views/profile.js').then((m) => (b.level ? m.openProfilePage({ tab: 'niveis' }) : b.many ? m.openProfilePage({ tab: 'emblemas' }) : m.badgeDetail(b.id))).catch(() => {}); };
}
const busy = () => !!document.querySelector('.sheet-wrap.is-open, .ficha, .paywall, .ob, .guide, .photogate, .termsgate, .okfx, .mustupd');
function pump() {
  if (showing || !queue.length) return;
  if (busy()) { setTimeout(pump, 1500); return; }
  // muitos emblemas de uma vez: mostra os 2 primeiros e resume o resto
  const badges = queue.filter((x) => x.type === 'badge');
  if (badges.length > 3) {
    const rest = badges.slice(2);
    rest.forEach((x) => queue.splice(queue.indexOf(x), 1));
    queue.push({ type: 'many', list: rest.map((x) => x.b) });
  }
  showing = true;
  show(queue.shift(), () => { showing = false; setTimeout(pump, 300); });
}
function show(it, done) {
  const L = levelInfo();
  let medalHtml = '', kicker = '', title = '', sub = '', xp = 0, color = '#FFD60A';
  if (it.type === 'badge') {
    const r = RARITY[it.b.rarity];
    medalHtml = badgeArt(it.b, 190); kicker = `Conquista ${r.fem} desbloqueada`; title = it.b.name(); sub = esc(it.b.desc()); xp = r.xp; color = r.color;
  } else if (it.type === 'level') {
    const t = tierOf(it.level), newTier = tierOf(it.from || 0).from !== t.from;
    medalHtml = crest(it.level, 190); kicker = 'Subiu de nível!'; title = `Nível ${it.level}`;
    sub = newTier ? `Agora você é <b>${esc(t.name())}</b>. Brasão novo liberado!` : `Faltam ${L.need.toLocaleString('pt-BR')} XP para o nível ${Math.min(100, it.level + 1)}.`;
    color = t.hue;
  } else if (it.type === 'many') {
    medalHtml = `<div class="gx__many">${it.list.slice(0, 6).map((b) => badgeArt(b, 74)).join('')}</div>`;
    kicker = 'E tem mais!'; title = `+${it.list.length} emblemas`; sub = it.list.slice(0, 4).map((b) => esc(b.name())).join(' · ') + (it.list.length > 4 ? '…' : '');
    xp = it.list.reduce((a, b) => a + RARITY[b.rarity].xp, 0);
  } else if (it.type === 'welcome') {
    const n = Object.keys(S.badges).length;
    medalHtml = crest(L.level, 190); kicker = 'Novo no Lembra: Conquistas';
    title = L.level ? `Você já começa no nível ${L.level}` : 'Seu nível 0 começa agora';
    sub = `${n ? `Com o que você já fez, ganhou <b>${n} ${n === 1 ? 'emblema' : 'emblemas'}</b>. ` : ''}Cada compromisso cumprido vale XP. São 100 níveis e mais de 100 emblemas para colecionar.`;
  }
  const el = document.createElement('div');
  el.className = 'gx';
  el.style.setProperty('--gx', color);
  el.innerHTML = `<div class="gx__rays"></div>
    <div class="gx__card" role="dialog" aria-label="${esc(kicker)}">
      <div class="gx__medal">${medalHtml}</div>
      <p class="gx__kicker">${esc(kicker)}</p>
      <h2 class="gx__title">${esc(title)}</h2>
      <p class="gx__sub">${sub}</p>
      ${xp ? `<span class="gx__xp">+${xp} XP</span>` : ''}
      <div class="gx__bar"><i style="width:${Math.round(L.pct * 100)}%"></i><small>Nível ${L.level} · ${L.xp.toLocaleString('pt-BR')} XP</small></div>
      <button class="btn gx__go" data-gx-close>Continuar</button>
      <button class="btn-text gx__see" data-gx-see>Ver minhas conquistas</button>
      <div class="gx__brand">${brand('palavra', { h: 16, on: 'dark' })}</div>
    </div>`;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add('is-in'));
  import('./sound.js').then((s) => (it.type === 'level' || it.type === 'welcome' ? s.levelUp() : s.fanfare())).catch(() => {});
  try { navigator.vibrate && navigator.vibrate([18, 60, 26, 60, 40]); } catch { /* ok */ }
  setTimeout(() => import('./reward.js').then((r) => { const m = el.querySelector('.gx__medal'); if (m) r.burst(m, { big: true }); }).catch(() => {}), 650);
  let closed = false;
  const close = (see = false) => {
    if (closed) return; closed = true;
    el.classList.remove('is-in'); el.classList.add('is-out');
    setTimeout(() => { el.remove(); done(); if (see) openProfileSoon(); }, 320);
  };
  el.querySelector('[data-gx-close]').onclick = () => close();
  el.querySelector('[data-gx-see]').onclick = () => close(true);
  el.addEventListener('click', (e) => { if (e.target === el) close(); });
}
const openProfileSoon = () => import('./views/profile.js').then((m) => m.openProfilePage({ tab: 'emblemas' })).catch(() => {});

/* o topo das telas lê isto (sem esperar este módulo carregar) */
function publishRing() {
  const L = levelInfo();
  try { window.__lvl = { level: L.level, deg: Math.round(L.pct * 360), hue: L.tier.hue }; } catch { /* ok */ }
}
/* anel de nível em volta da foto (topo das telas) */
export function levelRing(inner, size = 34) {
  const L = levelInfo();
  return `<span class="lvring" style="--p:${Math.round(L.pct * 360)}deg;--s:${size + 8}px;--h:${L.tier.hue}">${inner}<i class="lvring__n">${L.level}</i></span>`;
}
export const badgeCount = () => Object.keys(load().badges).length;
export { BADGES, RARITY, badgeArt, crest };
export const iconFor = (b) => icon(b.icon || 'star', 16);
