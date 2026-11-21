/* Resumo de uso desta conta, enviado ao abrir o app (o dono do app vê no Painel do dono).
   Só números e dados da conta — nunca o conteúdo da agenda pessoal. */
import { store } from './store.js';
import { personal, birthdays } from './personal.js';
import { todayKey, addDays, isStandalone } from './utils.js';
import { TYPES } from './constants.js';
import { platform } from './install.js';
import * as push from './avisos.js';
import { ageOf } from './persona.js';
import { appInfo } from './version.js';
import { usage30 } from './track.js';

let lastFull = 0;
const ageBand = (birth) => {
  const a = ageOf(birth);
  if (a === null) return '';
  return a < 18 ? 'até 17' : a < 25 ? '18–24' : a < 35 ? '25–34' : a < 45 ? '35–44' : a < 55 ? '45–54' : a < 65 ? '55–64' : '65+';
};
function profileSummary() {
  const p = store.profile || {};
  if (!p.onboardedAt) return { done: false };
  return {
    done: true, profession: p.profession || '', area: p.area || '', arch: p.arch || '', age: ageBand(p.birth), index: Number(p.index) || 0,
    forget: Number(p.forget) || 0, difficulties: Array.isArray(p.difficulties) ? p.difficulties.slice(0, 12) : [], goal: p.goal || '', journey: p.journey || '', tone: p.tone || '',
    gender: p.gender || '', volume: p.volume || '', method: p.method || '',
    at: p.onboardedAt,
  };
}
export function reportStats({ open = false, force = false } = {}) {
  const api = store.backendApi;
  if (store.mode !== 'cloud' || !api || !api.writeStats || !store.user) return;
  const now = Date.now();
  if (!open && !force && now - lastFull < 60e3) return; // no máximo 1 vez por minuto
  lastFull = now;
  const t = todayKey(), weekEnd = addDays(t, 6), monthAgo = addDays(t, -30);
  const me = store.member(store.me) || {};
  const evs = store.state.events;
  const mine = evs.filter((e) => (e.createdBy || store.me) === store.me);
  const posts = mine.filter((e) => TYPES[e.type]?.kind === 'post');
  const pEvents = personal.events || [];
  const data = {
    name: me.name || '', email: (store.user.email || '').toLowerCase(), photo: me.photo || null, color: me.color || null,
    workspace: store.shared ? 'compartilhada' : store.solo ? 'proprio' : 'dupla',
    createdAt: store.user.metadata?.creationTime ? Date.parse(store.user.metadata.creationTime) : null,
    lastSeen: now,
    // versão do app neste aparelho (o Painel do dono vê quem está atualizado)
    app: appInfo(),
    device: { platform: platform(), installed: isStandalone(), notifications: push.permission(), registered: push.deviceRegistered(), ua: navigator.userAgent.slice(0, 160) },
    space: document.documentElement.dataset.space || 'work',
    // ficha (sem dados sensíveis: nada de CPF, telefone ou data exata de nascimento)
    profile: profileSummary(),
    // de onde veio (anúncio, Instagram…): para o dono medir a divulgação
    origin: (() => { try { const o = JSON.parse(localStorage.getItem('lembra.origem') || 'null'); return o ? { source: String(o.source || '').slice(0, 60), medium: String(o.medium || '').slice(0, 60), campaign: String(o.campaign || '').slice(0, 60), content: String(o.content || '').slice(0, 60) } : null; } catch { return null; } })(),
    counts: {
      companies: store.state.companies.length,
      events: evs.length,
      myEvents: mine.length,
      thisWeek: evs.filter((e) => e.date >= t && e.date <= weekEnd).length,
      done30: mine.filter((e) => e.status === 'feito' && e.date >= monthAgo).length,
      late: mine.filter((e) => e.status === 'pendente' && e.date < t && e.date >= monthAgo).length,
      posts30: posts.filter((e) => e.date >= monthAgo).length,
      notes: store.state.notes.length,
      personal: pEvents.length,
      lists: (personal.lists || []).length,
      birthdays: birthdays().length,
      // atraso ao concluir (últimos 30 dias): quanto tempo depois do horário marcado a pessoa concluiu
      ...(() => {
        const done = mine.filter((e) => e.status === 'feito' && e.date >= monthAgo && e.doneAt && /^\d{2}:\d{2}$/.test(e.time || ''));
        let sum = 0, onTime = 0;
        for (const e of done) {
          const [h, m] = e.time.split(':').map(Number);
          const [y, mo, d] = e.date.split('-').map(Number);
          const late = Math.max(0, Math.round((e.doneAt - new Date(y, mo - 1, d, h, m).getTime()) / 60e3));
          sum += Math.min(late, 1440);
          if (late <= 30) onTime++;
        }
        return { timed30: done.length, delaySum30: sum, onTime30: onTime };
      })(),
    },
    // botões e telas mais usados (só contagem)
    usage: usage30(),
    vipSeen: !!store.profile?.vipSeen || (() => { try { return !!localStorage.getItem('lembra.vip.seen'); } catch { return false; } })(),
  };
  const day = t;
  const prevDays = (store.statsDays || []).filter((d) => d >= monthAgo);
  data.activeDays = [...new Set([...prevDays, day])].slice(-31);
  store.statsDays = data.activeDays;
  (open ? api.writeStats(store.user.uid, data) : api.touchStats(store.user.uid, data)).catch((e) => console.warn('stats', e.code || e.message));
}
/* Depois de mudanças na agenda, atualiza o resumo (com folga, para gastar pouco) */
let deb = null;
export function reportSoon() { clearTimeout(deb); deb = setTimeout(() => reportStats({ force: true }), 20000); }
/* Lê os dias ativos já salvos (para não perder o histórico) */
export async function loadStatsDays() {
  try {
    const d = await store.readDoc(`stats/${store.user.uid}`);
    store.statsDays = (d && Array.isArray(d.activeDays)) ? d.activeDays : [];
  } catch { store.statsDays = []; }
}

/* Presença em tempo real (Painel do dono): "no app agora" enquanto a tela está aberta,
   "saiu há X" quando fecha. Um sinal por minuto só enquanto o app está na frente. */
let beat = null;
export function startPresence() {
  const api = store.backendApi;
  if (store.mode !== 'cloud' || !api || !api.touchStats || !store.user) return;
  const uidv = store.user.uid;
  const send = (data) => api.touchStats(uidv, data).catch(() => {});
  const on = () => {
    send({ online: true, lastPing: Date.now(), lastOpen: Date.now(), app: appInfo() });
    clearInterval(beat);
    beat = setInterval(() => send({ online: true, lastPing: Date.now() }), 60e3);
    seenServer();
    import('./rank.js').then((r) => r.rankAct('open', 'app')).catch(() => {});
  };
  const off = () => { clearInterval(beat); send({ online: false, closedAt: Date.now(), lastPing: Date.now() }); };
  document.addEventListener('visibilitychange', () => (document.visibilityState === 'visible' ? on() : off()));
  window.addEventListener('pagehide', off);
  if (document.visibilityState === 'visible') on();
}
/* avisa o servidor de avisos que a pessoa abriu o app (para os "tem algo pra marcar hoje?") */
let lastSeenPost = 0;
export function seenServer(force = false) {
  const fromNotif = window.__openSrc === 'notif' || /[?&]src=notif/.test(location.search);
  if (!force && !fromNotif && Date.now() - lastSeenPost < 20 * 60e3) return;
  lastSeenPost = Date.now();
  const src = fromNotif ? 'notif' : 'icon';
  window.__openSrc = '';
  if (/[?&]src=notif/.test(location.search)) try { history.replaceState(null, '', location.pathname + location.hash); } catch { /* ok */ }
  Promise.all([import('./avisos.js'), import('./reward.js')]).then(([{ api, server }, r]) => {
    if (!server()) return;
    let streak = 0; try { streak = r.streak().days || 0; } catch { /* ok */ }
    api('/seen', { src, streak, notif: typeof Notification !== 'undefined' ? Notification.permission : 'unsupported' }).catch(() => {});
  });
}
