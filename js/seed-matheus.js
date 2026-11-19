/* Pedido do Matheus feito no assistente (19/11), que ainda não tinha sido colocado na agenda:
   "JG Garcia — captação e edição, das 7h ao meio-dia, de segunda a sábado, até o fim do mês".
   Entra uma única vez, em nome do Matheus (só ele pode alterar). Não duplica se ele já tiver marcado. */
import { store } from './store.js';

const SEED_ID = 'seed-matheus-jg-nov-2026';
const DATES = ['2026-11-20', '2026-11-21', '2026-11-23', '2026-11-24', '2026-11-25', '2026-11-26', '2026-11-27', '2026-11-28', '2026-11-30'];

let running = false;
export async function ensureMatheusJG() {
  if (running || !store.ready || store.mode !== 'cloud' || store.state.settings.some((s) => s.id === SEED_ID)) return;
  const co = store.state.companies.find((c) => c.id === 'c_jggarcia') || store.state.companies.find((c) => /jg\s*garcia/i.test(c.name));
  if (!co) return; // empresa ainda não carregou: tenta na próxima abertura
  running = true;
  try {
    const has = (date) => store.state.events.some((e) => e.date === date && e.companyId === co.id && (e.assignees || []).includes('matheus') && e.time && e.time <= '08:00');
    const items = DATES.filter((d) => !has(d)).map((date) => ({
      id: `e_mjg_${date.replace(/-/g, '')}`, type: 'captacao', companyId: co.id, title: 'Captação e edição', date, time: '07:00', duration: 300,
      assignees: ['matheus'], status: 'pendente', reminder: 30, visibleToClient: true, description: '', location: '',
      seriesId: 's_matheus_jg_nov', createdBy: 'matheus',
    }));
    if (items.length) await store.upsertMany('events', items, { activity: { kind: 'series', count: items.length, label: 'Captação e edição JG Garcia (seg a sáb, 7h às 12h)', sample: { companyId: co.id, date: items[0].date } } });
    await store.upsert('settings', { id: SEED_ID, done: items.map((i) => i.id) });
  } finally {
    running = false;
  }
}
