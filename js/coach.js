/* Envia ao servidor o resumo das empresas para as dicas ao longo do dia (coach) */
import { store } from './store.js';
import { todayKey, diffDays } from './utils.js';
import { TYPES } from './constants.js';
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
    return { name: c.name, niche: nicheOf(c) || 'pequena empresa local', lastPost: last, nextPost: next[0] || '', daysSincePost: last ? diffDays(last, t) : null };
  });
}

let timer = null, lastSig = '';
export function syncCoach() {
  if (store.mode !== 'cloud' || !server() || !store.ready) return;
  clearTimeout(timer);
  timer = setTimeout(() => {
    const companies = coachContext();
    const sig = JSON.stringify(companies);
    if (sig === lastSig) return;
    api('/coach', { companies }).then(() => (lastSig = sig)).catch(() => {});
  }, 4000);
}
export const coachTest = () => api('/coach-test', {});
