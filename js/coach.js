/* Envia ao servidor o resumo das empresas para as dicas ao longo do dia (coach) */
import { store } from './store.js';
import { todayKey, diffDays } from './utils.js';
import { TYPES, WORK, isMarketing } from './constants.js';
import { toMin } from './utils.js';
import { server, api } from './avisos.js';

const KNOWN = [
  [/pura vida|hortifruti|jg garcia/i, 'hortifruti: frutas, verduras e legumes frescos'],
  [/bbq|burger|hamb/i, 'hamburgueria e churrasco (BBQ)'],
  [/multimarcas|moda|roupa/i, 'loja de roupas multimarcas'],
  [/festa/i, 'loja de artigos e decoração de festas'],
];
export function nicheOf(c) {
  if (c?.niche) return c.niche;
  const k = KNOWN.find(([re]) => re.test(c?.name || ''));
  return k ? k[1] : '';
}

export function coachContext() {
  const t = todayKey();
  return store.state.companies.map((c) => {
    const posts = store.state.events.filter((e) => e.companyId === c.id && TYPES[e.type]?.kind === 'post');
    const past = posts.filter((e) => e.date <= t && (e.status === 'feito' || e.date < t)).map((e) => e.date).sort();
    const next = posts.filter((e) => e.date >= t && e.status !== 'feito').map((e) => e.date).sort();
    const last = past[past.length - 1] || '';
    return { onlyFor: c.notifyOnly || null, name: c.name, niche: nicheOf(c) || 'pequena empresa local', lastPost: last, nextPost: next[0] || '', daysSincePost: last ? diffDays(last, t) : null };
  });
}

/* Profissão do espaço + próximos compromissos (para as dicas do servidor falarem da rotina da pessoa) */
export function workContext() {
  const t = todayKey();
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const pending = store.state.events.filter((e) => e.status !== 'feito' && e.date >= t).sort((a, b) => (a.date + (a.time || '')).localeCompare(b.date + (b.time || '')));
  const late = store.state.events.filter((e) => e.status !== 'feito' && e.time && (e.date < t || (e.date === t && toMin(e.time) < nowMin))).length;
  return {
    arch: WORK.arch, profession: WORK.profession || '', entity: WORK.entity.many,
    tips: isMarketing() ? [] : (WORK.tips || []).slice(0, 12),
    next: pending.slice(0, 5).map((e) => ({ date: e.date, time: e.time || '', label: TYPES[e.type]?.label || 'Compromisso', title: (e.title || '').slice(0, 60), who: (e.assignees || [])[0] || '' })),
    late,
  };
}

let timer = null, lastSig = '';
export function syncCoach() {
  if (store.mode !== 'cloud' || !server() || !store.ready) return;
  clearTimeout(timer);
  timer = setTimeout(() => {
    const companies = coachContext();
    const work = workContext();
    const sig = JSON.stringify([companies, work]);
    if (sig === lastSig) return;
    api('/coach', { companies, work }).then(() => (lastSig = sig)).catch(() => {});
  }, 4000);
}
export const coachTest = () => api('/coach-test', {});
