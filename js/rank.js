/* Ranking semanal: o app só avisa o servidor do que a pessoa FEZ (criou, concluiu, anotou).
   Quem conta os pontos e confere fraude é o servidor. Só vale para o plano mensal. */
import { store } from './store.js';
import { api, server } from './avisos.js';

// mesmos planos que o servidor aceita no ranking (worker/src/rank.js): o Essencial fica de fora
const RANK_PLANS = ['gratis', 'monthly', 'lifetime', 'comp', 'team', 'equipe'];
const eligible = () => store.mode === 'cloud' && store.solo && !!server() && RANK_PLANS.includes(store.billing?.plan) && !!store.billing?.active && store.billing?.tier !== 'essencial';
const queue = [];
let busy = false;
async function flush() {
  if (busy) return;
  busy = true;
  while (queue.length) {
    const a = queue.shift();
    await api('/rank/act', a).catch(() => {});
    await new Promise((r) => setTimeout(r, 6500)); // respeita o intervalo mínimo do servidor
  }
  busy = false;
}
export function rankAct(type, ref, extra = {}) {
  if (!eligible() || !document.hasFocus || document.visibilityState !== 'visible') return;
  if (queue.some((q) => q.type === type && q.ref === ref) || queue.length > 20) return;
  queue.push({ type, ref: String(ref || '').replace(/[^\w-]/g, '').slice(0, 80), ...extra });
  flush();
}
export function rankEvent(before, after) {
  if (!after) return;
  if (!before && (after.createdBy || store.me) === store.me) rankAct('create', after.id);
  else if (before && before.status !== 'feito' && after.status === 'feito') {
    // no horário = concluiu até 30 min depois do fim previsto (vale mais pontos)
    const start = after.time ? Date.parse(`${after.date}T${after.time}:00-03:00`) : Date.parse(`${after.date}T23:59:00-03:00`);
    const end = start + (Number(after.duration) || 60) * 60e3;
    rankAct('done', after.id, { ontime: Date.now() <= end + 30 * 60e3 });
  }
}
export function rankPersonal(before, after) {
  if (!after || ['prefs', 'list'].includes(after.kind)) return;
  if (!before) rankAct('personal', after.id);
  else if (!before.done && after.done) rankAct('done', after.id);
}
