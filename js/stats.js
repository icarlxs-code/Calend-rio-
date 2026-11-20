/* Resumo de uso desta conta, enviado ao abrir o app (o dono do app vê no Painel do dono).
   Só números e dados da conta — nunca o conteúdo da agenda pessoal. */
import { store } from './store.js';
import { personal, birthdays } from './personal.js';
import { todayKey, addDays, isStandalone } from './utils.js';
import { TYPES } from './constants.js';
import { platform } from './install.js';
import * as push from './avisos.js';
import { ageOf } from './persona.js';

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
    },
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
