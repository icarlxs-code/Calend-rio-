/* Rotina do Henrique com a Garcia Hortifruti — novembro de 2026 (calendário corrigido).
   Seg/Qua/Sex: CEASA 07h–10h30, depois Garcia Hortifruti + gravação com o Gelado até 14h.
   Ter/Qui: somente CEASA 07h–14h · Sáb: somente CEASA 07h–12h · Dom: planejamento 07h–14h.
   Registrada uma única vez (de hoje até 30/11). Substitui a versão anterior, se existir. */
import { store } from './store.js';
import { uid } from './utils.js';

const SEED_ID = 'seed-garcia-nov-2026-v2';
const OLD_IDS = ['seed-garcia-nov-2026', 'seed-garcia-nov-2026-ate14h'];
const COMPANY = 'c_garciahortifruti';
const WD = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
const UNITS = {
  '2026-11-09': 'Marechal', '2026-11-11': 'Vila Valqueire', '2026-11-13': 'Marechal', '2026-11-16': 'Vila Valqueire',
  '2026-11-18': 'Marechal', '2026-11-20': 'Vila Valqueire', '2026-11-23': 'Marechal', '2026-11-25': 'Vila Valqueire',
  '2026-11-27': 'Marechal', '2026-11-30': 'Vila Valqueire',
};
const NOTES = [
  { date: '2026-11-20', text: 'Garcia · Consciência Negra: publicação institucional respeitosa e representativa.' },
  { date: '2026-11-23', text: 'Garcia · Black Friday (23 a 27/11): campanha principal de ofertas e chamadas diárias.' },
  { date: '2026-11-28', text: 'Garcia · Esquenta de Natal e verão (28 a 30/11): frutas da estação, receitas, saladas e planejamento das compras.' },
];

export function buildGarciaRoutine(from = '2026-11-19', to = '2026-11-30') {
  const out = [];
  for (let d = new Date(from + 'T12:00:00'); d <= new Date(to + 'T12:00:00'); d.setDate(d.getDate() + 1)) {
    const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const wd = d.getDay();
    const base = { date, companyId: COMPANY, assignees: ['henrique'], status: 'pendente', description: '', seedRoutine: 2 };
    if ([1, 3, 5].includes(wd)) {
      const unit = UNITS[date] || '';
      out.push({ ...base, id: `e_garcia2_${date}_ceasa`, type: 'outro', time: '07:00', duration: 210, reminder: 30, title: 'CEASA', location: 'CEASA', internalNote: 'CEASA — 07h às 10h30. Depois segue para a Garcia Hortifruti.', visibleToClient: false });
      out.push({
        ...base, id: `e_garcia2_${date}_gravacao`, type: 'captacao', time: '10:30', duration: 210, reminder: 60,
        title: `Gravação com o Gelado — ${unit || 'Garcia'}`,
        location: unit ? `Garcia Hortifruti — ${unit}` : 'Garcia Hortifruti',
        internalNote: 'Saída do CEASA por volta das 10h30. Personagem: Gelado (filmar para Reels, feed e stories). Ajustar conforme abastecimento, preços e necessidades da unidade.',
        visibleToClient: true,
      });
    } else if (wd === 0) {
      out.push({ ...base, id: `e_garcia2_${date}_plan`, type: 'outro', time: '07:00', duration: 420, reminder: 30, title: 'Planejamento da semana', location: '', internalNote: 'Planejamento — 07h às 14h.', visibleToClient: false });
    } else {
      const sat = wd === 6;
      out.push({ ...base, id: `e_garcia2_${date}_ceasa`, type: 'outro', time: '07:00', duration: sat ? 300 : 420, reminder: 30, title: `Somente CEASA (${WD[wd]})`, location: 'CEASA', internalNote: `Somente CEASA — 07h às ${sat ? '12h' : '14h'}.`, visibleToClient: false });
    }
  }
  return out;
}

let running = false;
export async function ensureSeedRoutine() {
  if (running || !store.ready || store.state.settings.some((s) => s.id === SEED_ID)) return;
  if (!store.company(COMPANY)) return; // a empresa entra primeiro (pré-cadastro)
  running = true;
  try {
    // tira a versão anterior (deduzida do PDF de setembro), sem avisar o parceiro
    const old = store.state.events.filter((e) => e.seedRoutine === true || /^e_garcia_\d/.test(e.id)).map((e) => e.id);
    if (old.length) await store.removeMany('events', old, { silent: true });
    const items = buildGarciaRoutine().filter((e) => !store.event(e.id));
    if (items.length) await store.upsertMany('events', items);
    const notes = NOTES.filter((n) => !store.state.notes.some((x) => x.date === n.date && x.text === n.text))
      .map((n) => ({ id: uid('n_'), date: n.date, text: n.text, author: 'henrique' }));
    if (notes.length) await store.upsertMany('notes', notes);
    for (const id of [SEED_ID, ...OLD_IDS]) await store.upsert('settings', { id, done: [] });
  } finally {
    running = false;
  }
}
