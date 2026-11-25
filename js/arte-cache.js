/* Artes das frases guardadas no aparelho (IndexedDB "lembra-arte"): receita + imagem de story e de feed, até 60.
   Sem banco (aba privada, pouco espaço) tudo continua funcionando: a arte é redesenhada pela receita. */
const MAX = 60; let db = null;
function abre() {
  if (db) return db;
  db = new Promise((ok) => { try { const r = indexedDB.open('lembra-arte', 1); r.onupgradeneeded = () => { const s = r.result.createObjectStore('artes', { keyPath: 'msgId' }); s.createIndex('uso', 'uso'); }; r.onsuccess = () => ok(r.result); r.onerror = r.onblocked = () => ok(null); } catch { ok(null); } });
  return db;
}
const faz = async (modo, fn) => { const d = await abre(); if (!d) return null; return new Promise((ok) => { try { const t = d.transaction('artes', modo), s = t.objectStore('artes'); const q = fn(s); if (modo === 'readonly') { q.onsuccess = () => ok(q.result ?? null); q.onerror = () => ok(null); } else { t.oncomplete = () => ok(true); t.onerror = t.onabort = () => ok(null); } } catch { ok(null); } }); };
export async function pega(msgId) { const x = await faz('readonly', (s) => s.get(msgId)); if (x) faz('readwrite', (s) => s.put({ ...x, uso: Date.now() })); return x; }
export async function guarda(x) {
  await faz('readwrite', (s) => s.put({ ...x, uso: Date.now() }));
  const n = await faz('readonly', (s) => s.count()); if (!n || n <= MAX) return;
  await faz('readwrite', (s) => { let sobra = n - MAX; const q = s.index('uso').openCursor(); q.onsuccess = () => { const c = q.result; if (c && sobra-- > 0) { c.delete(); c.continue(); } }; return q; }); // sai a que está há mais tempo sem uso
}
export const apaga = (msgId) => faz('readwrite', (s) => s.delete(msgId));
export const limpaTudo = () => faz('readwrite', (s) => s.clear());
export const conta = () => faz('readonly', (s) => s.count());
