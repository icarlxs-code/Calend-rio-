/* O cofre: os dados do aparelho são insubstituíveis, então nunca ficam num lugar só e nunca somem em silêncio.
   - grava em DOIS lugares: localStorage (leitura instantânea) e IndexedDB (sem o limite de 5 MB);
   - guarda as últimas versões: se a principal corromper ou encolher do nada, dá para voltar;
   - desconfia de encolhimento: se a conta de itens cai muito de uma vez, a versão anterior fica protegida;
   - se um dos lados falhar (bloqueado, cheio), o app continua pelo outro e AVISA. Nada de try/catch mudo;
   - pede ao navegador para não apagar os dados (storage.persist). */
const BANCO = 'lembra-cofre', LOJA = 'dados', DIARIO = 'diario', GERACOES = 4;
const memoria = new Map();            // o que o cofre leu/escreveu nesta sessão (vale como leitura rápida)
const avisos = new Set();
let db = null, pronto = null;
export const estado = { idb: false, ls: true, persistente: false, usado: 0, limite: 0, falhas: [], recuperou: [], encolheu: [] };
export const aoAvisar = (f) => { avisos.add(f); return () => avisos.delete(f); };
const avisa = (tipo, detalhe) => { estado.falhas = estado.falhas.slice(-9); avisos.forEach((f) => { try { f(tipo, detalhe); } catch (e) { console.warn('cofre', e); } }); };

const abre = () => new Promise((ok, no) => {
  if (!self.indexedDB) return no(new Error('sem IndexedDB'));
  const r = indexedDB.open(BANCO, 1);
  r.onupgradeneeded = () => { const d = r.result; if (!d.objectStoreNames.contains(LOJA)) d.createObjectStore(LOJA); if (!d.objectStoreNames.contains(DIARIO)) d.createObjectStore(DIARIO, { keyPath: 'n', autoIncrement: true }).createIndex('k', 'k'); };
  r.onsuccess = () => ok(r.result); r.onerror = () => no(r.error); r.onblocked = () => no(new Error('bloqueado'));
});
const tx = (lojas, modo, fn) => new Promise((ok, no) => {
  if (!db) return no(new Error('cofre fechado'));
  const t = db.transaction(lojas, modo); let v;
  t.oncomplete = () => ok(v); t.onerror = () => no(t.error || new Error('falhou')); t.onabort = () => no(t.error || new Error('cancelado'));
  try { v = fn(...lojas.map((l) => t.objectStore(l))); } catch (e) { no(e); }
});
const peca = (req) => new Promise((ok, no) => { req.onsuccess = () => ok(req.result); req.onerror = () => no(req.error); });

/* chamado uma vez, bem no começo do app */
export function prepara(chaves = []) {
  return (pronto ||= (async () => {
    try { db = await abre(); estado.idb = true; } catch (e) { estado.falhas.push('idb:' + ((e && (e.message || e.name)) || e)); avisa('sem-idb', e); }
    try { if (navigator.storage?.persist) estado.persistente = (await navigator.storage.persisted?.()) || (await navigator.storage.persist()); } catch { /* o navegador decide */ }
    try { const q = await navigator.storage?.estimate?.(); if (q) { estado.usado = q.usage || 0; estado.limite = q.quota || 0; } } catch { /* ok */ }
    for (const k of chaves) await confere(k);
    return estado;
  })());
}
/* a principal sumiu, veio vazia ou menor que a cópia? então repõe do cofre */
async function confere(k) {
  let local = null;
  try { local = localStorage.getItem(k); } catch (e) { estado.ls = false; estado.falhas.push('ls:' + ((e && (e.name || e.message)) || e)); avisa('sem-localstorage', e); }
  const guardado = estado.idb ? await tx([LOJA], 'readonly', (s) => peca(s.get(k))).catch(() => null) : null;
  const g = await guardado;
  if (g && g.txt) memoria.set(k, g);
  const nLocal = local ? conta(local) : -1;
  if (!g) { if (local) memoria.set(k, { txt: local, n: nLocal, at: Date.now() }); return; }
  if (local == null || (g.n > 0 && nLocal < g.n)) {           // o cofre tem mais: a principal perdeu coisa
    memoria.set(k, g);
    estado.recuperou.push({ k, de: nLocal, para: g.n });
    try { localStorage.setItem(k, g.txt); } catch { /* segue pela memória */ }
    avisa('recuperou', { k, de: nLocal, para: g.n });
  } else if (nLocal > g.n) memoria.set(k, { txt: local, n: nLocal, at: Date.now() });
}
const conta = (txt) => { try { const v = JSON.parse(txt); return Array.isArray(v) ? v.length : v && typeof v === 'object' ? Object.values(v).reduce((s, x) => s + (Array.isArray(x) ? x.length : 0), 0) || 1 : 0; } catch { return -1; } };

/** leitura rápida (o app continua síncrono como era) */
export function leSync(k) {
  // o lugar principal manda. A memória do cofre só entra quando ele NÃO RESPONDE (bloqueado);
  // chave apagada de propósito tem que voltar vazia, senão dado velho ressuscita.
  try {
    const v = localStorage.getItem(k);
    if (v != null) { memoria.set(k, { txt: v, n: conta(v), at: Date.now() }); return v; }
    if (estado.ls) return null;
  } catch (e) { estado.ls = false; avisa('sem-localstorage', e); }
  return memoria.has(k) ? memoria.get(k).txt : null;
}
/** grava nos dois lugares. Devolve { ls, idb }: se os DOIS falharem, lança erro (o app precisa saber). */
export async function guarda(k, txt) {
  const n = conta(txt), antes = memoria.get(k);
  memoria.set(k, { txt, n, at: Date.now() });
  let ls = false, idb = false, erro = null;
  try { localStorage.setItem(k, txt); ls = true; if (!estado.ls) { estado.ls = true; avisa('localstorage-voltou', { k }); } }
  catch (e) { erro = e; estado.ls = false; estado.falhas.push('ls:' + ((e && (e.name || e.message)) || e)); avisa(/quota|exceed/i.test(e.name + e.message) ? 'cheio' : 'sem-localstorage', e); }
  if (estado.idb) {
    try {
      const suspeito = !!antes && antes.n >= 5 && n >= 0 && n < antes.n * 0.6;    // encolheu demais de uma vez
      await tx([LOJA, DIARIO], 'readwrite', (s, d) => {
        s.put({ txt, n, at: Date.now() }, k);
        if (antes) d.add({ k, at: antes.at || Date.now(), txt: antes.txt, itens: antes.n, protegida: suspeito });
      });
      idb = true;
      if (suspeito) { estado.encolheu.push({ k, de: antes.n, para: n }); avisa('encolheu', { k, de: antes.n, para: n }); }
      limpa(k).catch(() => {});
    } catch (e) { erro = erro || e; estado.falhas.push('idb:' + ((e && (e.name || e.message)) || e)); avisa('idb-falhou', e); }
  }
  if (!ls && !idb) throw erro || new Error('não consegui salvar em lugar nenhum');
  return { ls, idb };
}
/* mantém poucas versões: as últimas e todas as protegidas */
async function limpa(k) {
  const todas = await tx([DIARIO], 'readonly', (d) => peca(d.index('k').getAll(k)));
  const velhas = (todas || []).filter((x) => !x.protegida).sort((a, b) => b.n - a.n).slice(GERACOES);
  if (velhas.length) await tx([DIARIO], 'readwrite', (d) => velhas.forEach((v) => d.delete(v.n)));
}
/** versões que dá para voltar (a mais nova primeiro) */
export async function copias(k) {
  if (!estado.idb) return [];
  const todas = (await tx([DIARIO], 'readonly', (d) => peca(d.index('k').getAll(k)))) || [];
  return todas.sort((a, b) => b.at - a.at).map((x) => ({ n: x.n, at: x.at, itens: x.itens, protegida: !!x.protegida }));
}
/** volta uma versão guardada e devolve o texto */
export async function restaura(k, n) {
  const v = await tx([DIARIO], 'readonly', (d) => peca(d.get(n)));
  if (!v) throw new Error('essa cópia não existe mais');
  await guarda(k, v.txt);
  return v.txt;
}
/** tudo que está no cofre, para exportar e nunca depender de um aparelho só */
export async function tudo() {
  const out = {};
  for (const [k, v] of memoria) out[k] = v.txt;
  if (estado.idb) {
    const ks = (await tx([LOJA], 'readonly', (s) => peca(s.getAllKeys()))) || [];
    for (const k of ks) if (!(k in out)) out[k] = (await tx([LOJA], 'readonly', (s) => peca(s.get(k))))?.txt;
  }
  return out;
}
