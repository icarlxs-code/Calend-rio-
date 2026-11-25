/* Cópia diária da agenda neste aparelho (últimos 3 dias, sem custo). Sai do aparelho quando a pessoa sai da conta. */
import { store } from './store.js';
import { personal } from './personal.js';
import { todayKey } from './utils.js';
const abre = () => new Promise((ok, no) => { const r = indexedDB.open('lembra-backup', 1); r.onupgradeneeded = () => r.result.createObjectStore('d'); r.onsuccess = () => ok(r.result); r.onerror = () => no(r.error); });
const faz = async (modo, fn) => { const d = await abre(); return new Promise((ok, no) => { const t = d.transaction('d', modo), q = fn(t.objectStore('d')); t.oncomplete = () => ok(q && q.result); t.onerror = () => no(t.error); }); };
const chave = (dia) => `${store.user?.uid || 'local'}|${store.workspace}|${dia}`;
export async function backupDiario() {
  try {
    if (!store.ready || !(store.state.events.length + store.state.companies.length + personal.items.length)) return false;
    const k = chave(todayKey()); if (await faz('readonly', (s) => s.get(k))) return false;
    await faz('readwrite', (s) => s.put({ at: Date.now(), trabalho: JSON.parse(store.exportData()), pessoal: personal.items }, k));
    const pre = chave(''), ks = ((await faz('readonly', (s) => s.getAllKeys())) || []).filter((x) => x.startsWith(pre)).sort();
    for (const velho of ks.slice(0, -3)) await faz('readwrite', (s) => s.delete(velho)); // só cópias antigas; a agenda não é tocada
    return true;
  } catch { return false; }
}
export const limpaBackups = () => new Promise((ok) => { try { const r = indexedDB.deleteDatabase('lembra-backup'); r.onsuccess = r.onerror = r.onblocked = () => ok(); } catch { ok(); } });
