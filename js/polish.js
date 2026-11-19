/* Arruma os títulos dos MEUS eventos (de hoje em diante): primeiro pelas regras locais,
   depois a IA corrige ortografia e acentos ("manga palmer" → "Manga Palmer").
   Gravado em lote, sem disparar aviso para o parceiro. Cada título é arrumado uma vez só. */
import { store } from './store.js';
import { todayKey, addDays } from './utils.js';
import { tidyTitle } from './tidy.js';
import { server, api } from './avisos.js';

const plain = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');
function dist(a, b) {
  const m = a.length, n = b.length;
  if (Math.abs(m - n) > 6) return 99;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[n];
}
/* A IA só pode corrigir escrita: se mudar o sentido (muitas letras diferentes), fica a versão local */
export const safeFix = (local, ai) => {
  if (!ai || typeof ai !== 'string') return local;
  const a = plain(local), b = plain(ai);
  if (!b || ai.length > local.length + 12) return local;
  return dist(a, b) <= Math.max(2, Math.round(a.length * 0.25)) ? ai.trim() : local;
};

let busy = false, timer = null;
export function polishSoon() {
  clearTimeout(timer);
  timer = setTimeout(run, 2500);
}
async function run() {
  if (busy || store.mode !== 'cloud' || !store.me || !store.ready) return;
  const from = addDays(todayKey(), -1);
  const mine = store.state.events.filter((e) => e.date >= from && e.title && e.titlePolished !== e.title && (e.createdBy || store.me) === store.me && store.canEdit('events', e)).slice(0, 20);
  if (!mine.length) return;
  busy = true;
  try {
    const local = mine.map((e) => tidyTitle(e.title));
    let ai = [];
    if (server()) {
      try { ai = (await api('/tidy', { titles: local })).titles || []; } catch { ai = []; }
    }
    const items = mine.map((e, i) => {
      const t = safeFix(local[i], ai[i]);
      return { ...e, title: t, titlePolished: t };
    });
    await store.upsertMany('events', items);
  } finally {
    busy = false;
  }
}
