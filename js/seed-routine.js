/* Rotina do Henrique com a Garcia Hortifruti (19 a 30/11/2026), registrada uma única vez.
   Segunda/quarta/sexta: gravação com o personagem Gelado (07h–14h), alternando as unidades.
   Terça/quinta/sábado: CEASA 07h–14h · Domingo: planejamento 07h–14h. */
import { store } from './store.js';

const SEED_ID = 'seed-garcia-nov-2026';
const COMPANY = 'c_garciahortifruti';
const WD = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];

export function buildGarciaRoutine(from = '2026-11-19', to = '2026-11-30') {
  const out = [];
  let unitIdx = 0;
  const units = ['Marechal', 'Vila Valqueire'];
  for (let d = new Date(from + 'T12:00:00'); d <= new Date(to + 'T12:00:00'); d.setDate(d.getDate() + 1)) {
    const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const wd = d.getDay();
    const base = { id: `e_garcia_${date}`, date, time: '07:00', companyId: COMPANY, assignees: ['henrique'], status: 'pendente', description: '', seedRoutine: true };
    if ([1, 3, 5].includes(wd)) {
      const unit = units[unitIdx++ % 2];
      out.push({
        ...base, type: 'captacao', duration: 420, reminder: 1440,
        title: `Gravação com o Gelado — unidade ${unit}`,
        location: `Garcia Hortifruti — ${unit}`,
        internalNote: `Rotina CEASA + gravação. Chegada às 07h. Personagem: Gelado (filmar para Reels e feed). Programação pode mudar conforme abastecimento e disponibilidade do Gelado.`,
        visibleToClient: true,
      });
    } else if (wd === 0) {
      out.push({ ...base, type: 'outro', duration: 420, reminder: 30, title: 'Planejamento da semana', location: '', internalNote: 'Planejamento — 07h às 14h.', visibleToClient: false });
    } else {
      out.push({ ...base, type: 'outro', duration: 420, reminder: 30, title: `CEASA (${WD[wd]})`, location: 'CEASA', internalNote: 'CEASA — 07h às 14h.', visibleToClient: false });
    }
  }
  return out;
}

let running = false;
const FIX_ID = 'seed-garcia-nov-2026-ate14h';
export async function ensureSeedRoutine() {
  // correção: o horário com a Garcia vai até as 14h também aos sábados
  if (store.ready && !store.state.settings.some((s) => s.id === FIX_ID) && store.state.settings.some((s) => s.id === SEED_ID)) {
    const fix = store.state.events.filter((e) => e.seedRoutine && e.duration === 300).map((e) => ({ ...e, duration: 420, internalNote: 'CEASA — 07h às 14h.' }));
    if (fix.length) await store.upsertMany('events', fix);
    await store.upsert('settings', { id: FIX_ID, done: [] });
  }
  if (running || !store.ready || store.state.settings.some((s) => s.id === SEED_ID)) return;
  if (!store.company(COMPANY)) return; // a empresa entra primeiro (pré-cadastro)
  running = true;
  try {
    const items = buildGarciaRoutine().filter((e) => !store.event(e.id));
    if (items.length) await store.upsertMany('events', items);
    await store.upsert('settings', { id: SEED_ID, done: [] });
    await store.upsert('settings', { id: FIX_ID, done: [] });
  } finally {
    running = false;
  }
}
