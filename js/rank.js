/* Ranking semanal: o app só avisa o servidor do que a pessoa FEZ (criou, concluiu, anotou).
   Quem conta os pontos e confere fraude é o servidor. Só vale para o plano mensal. */
import { store } from './store.js';
import { api, server } from './avisos.js';

const eligible = () => store.mode === 'cloud' && store.solo && !!server() && store.billing?.plan === 'monthly' && store.billing?.active;
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
export function rankAct(type, ref) {
  if (!eligible() || !document.hasFocus || document.visibilityState !== 'visible') return;
  if (queue.some((q) => q.type === type && q.ref === ref) || queue.length > 20) return;
  queue.push({ type, ref: String(ref || '').replace(/[^\w-]/g, '').slice(0, 80) });
  flush();
}
export function rankEvent(before, after) {
  if (!after) return;
  if (!before && (after.createdBy || store.me) === store.me) rankAct('create', after.id);
  else if (before && before.status !== 'feito' && after.status === 'feito') rankAct('done', after.id);
}
export function rankPersonal(before, after) {
  if (!after || ['prefs', 'list'].includes(after.kind)) return;
  if (!before) rankAct('personal', after.id);
  else if (!before.done && after.done) rankAct('done', after.id);
}
