/* Lembra · classificador de lembretes → ícone da lista + fantasia do mascote.
   JS puro (ES module), sem dependências, sem IA, sem rede: roda no aparelho.

   Uso:
     import DIC from './dicionario.json';            // esbuild empacota o JSON
     import { criarClassificador } from './classificar.js';
     const classificar = criarClassificador(DIC);
     classificar('Levar a Ana no dentista 15h')
     // → { categoria:'dentista', nome:'Dentista', grupo:'saude', confianca:0.83,
     //     simbolo:'tooth', cor:'#12894B', fantasia:'dentista', emoji:'🦷', cena:'…' }

   Como pontua (do texto normalizado: minúsculas, sem acento, sem pontuação):
     • palavra solta exata ........................... 3
     • expressão de N palavras (frase exata) ......... 3 + 2·(N−1)   ("conta de luz" = 7)
     • palavra com 1 erro de digitação (≥5 letras,
       mesma 1ª letra, troca/falta/sobra/inversão) ... 2,2
     • padrão verbo + objeto (até 3 palavras no meio)  peso do padrão ("buscar … escola" = 7);
       verbo de buscar/levar sozinho = 2,5 → perde para qualquer lugar/assunto citado
       ("levar no hospital" = hospital, "buscar Ana" = transporte)
     Nota da categoria = maior acerto + 0,3 × soma dos outros, × peso da categoria.
     Termo negativo presente → categoria zerada.
     Desempate: nota → prioridade → tamanho do trecho que casou.
     Nota < 2 → categoria "geral" (fallback). */

const ACENTOS = /[\u0300-\u036f]/g;
export const normalizar = (s) => String(s || '').toLowerCase().normalize('NFD').replace(ACENTOS, '')
  .replace(/[^a-z0-9]+/g, ' ').trim();

/* horários e números soltos não ajudam ("15h", "14:30", "dia 12") */
const RUIDO = /^(\d{1,2}h\d{0,2}|\d{1,2}|\d{1,2}hs|\d{1,2}hrs|\d{3,})$/;

/* Damerau-Levenshtein ≤ 1 (rápido, sem matriz) */
function umErro(a, b) {
  const la = a.length, lb = b.length;
  if (Math.abs(la - lb) > 1 || a === b) return a === b;
  let i = 0; while (i < la && i < lb && a[i] === b[i]) i++;
  if (la === lb) {
    if (a.slice(i + 1) === b.slice(i + 1)) return true;                       // troca
    return a[i] === b[i + 1] && a[i + 1] === b[i] && a.slice(i + 2) === b.slice(i + 2); // inversão
  }
  return la > lb ? a.slice(i + 1) === b.slice(i) : a.slice(i) === b.slice(i + 1); // sobra / falta
}

export function criarClassificador(dic, opcoes = {}) {
  const MIN = opcoes.notaMinima ?? 2;
  const cats = dic.categorias;
  const porId = new Map(cats.map((c) => [c.id, c]));
  const geral = porId.get(dic.fallback || 'geral');

  // índices: palavra → [{ci, peso, len}], expressões por 1ª palavra, palavras para erro por 1ª letra
  const palavra = new Map(), expr = new Map(), fuzzy = new Map(), negs = [], padroes = [];
  cats.forEach((c, ci) => {
    const vistas = new Set();
    for (const raw of c.palavras) {
      const k = normalizar(raw); if (!k || vistas.has(k)) continue; vistas.add(k);
      const toks = k.split(' ');
      if (toks.length === 1) {
        if (!palavra.has(k)) palavra.set(k, []);
        palavra.get(k).push({ ci, peso: 3, len: k.length });
        if (k.length >= 5 && !/\d/.test(k)) {
          const f = k[0]; if (!fuzzy.has(f)) fuzzy.set(f, []);
          fuzzy.get(f).push({ k, ci });
        }
      } else {
        if (!expr.has(toks[0])) expr.set(toks[0], []);
        expr.get(toks[0]).push({ ci, toks, peso: 3 + 2 * (toks.length - 1), len: k.length });
      }
    }
    if (c.negativos) negs[ci] = c.negativos.map((n) => normalizar(n).split(' '));
    if (c.padroes) for (const p of c.padroes) padroes.push({ ci, peso: p.peso, seq: p.seq.map((s) => (s === '*' ? null : new Set(s.split('|').map(normalizar)))) });
  });

  const temSeq = (toks, seq) => { // sequência contígua
    outer: for (let i = 0; i + seq.length <= toks.length; i++) { for (let j = 0; j < seq.length; j++) if (toks[i + j] !== seq[j]) continue outer; return true; }
    return false;
  };
  const casaPadrao = (toks, seq) => { // cada passo pode pular até 3 palavras
    for (let i = 0; i < toks.length; i++) {
      if (seq[0] && !seq[0].has(toks[i])) continue;
      let pos = i, ok = true;
      for (let j = 1; j < seq.length; j++) {
        let achou = -1;
        for (let k = pos + 1; k <= Math.min(pos + 4, toks.length - 1); k++) if (!seq[j] || seq[j].has(toks[k])) { achou = k; break; }
        if (achou < 0) { ok = false; break; }
        pos = achou;
      }
      if (ok) return true;
    }
    return false;
  };

  const cache = new Map();
  function classificar(texto) {
    const chave = String(texto || '');
    if (cache.has(chave)) return cache.get(chave);
    const toks = normalizar(chave).split(' ').filter((t) => t && (!RUIDO.test(t) || palavra.has(t) || expr.has(t)));
    const hits = new Map(); // ci → [{peso, len}]
    const add = (ci, peso, len) => { let a = hits.get(ci); if (!a) hits.set(ci, (a = [])); a.push({ peso, len }); };
    const usados = new Set();
    for (let i = 0; i < toks.length; i++) {
      const t = toks[i];
      const ex = expr.get(t);
      if (ex) for (const e of ex) {
        let ok = true; for (let j = 1; j < e.toks.length; j++) if (toks[i + j] !== e.toks[j]) { ok = false; break; }
        if (ok) add(e.ci, e.peso, e.len);
      }
      const p = palavra.get(t);
      if (p) { for (const h of p) add(h.ci, h.peso, h.len); usados.add(i); }
    }
    // erro de digitação: só palavras sem acerto exato, ≥5 letras
    for (let i = 0; i < toks.length; i++) {
      const t = toks[i]; if (usados.has(i) || t.length < 5 || palavra.has(t)) continue;
      const lista = fuzzy.get(t[0]); if (!lista) continue;
      const vistos = new Set();
      for (const f of lista) if (!vistos.has(f.ci) && umErro(t, f.k)) { vistos.add(f.ci); add(f.ci, 2.2, f.k.length - 1); }
    }
    for (const p of padroes) if (casaPadrao(toks, p.seq)) add(p.ci, p.peso, 0);

    let melhor = null, segunda = 0;
    for (const [ci, arr] of hits) {
      if (negs[ci] && negs[ci].some((n) => temSeq(toks, n))) continue;
      arr.sort((a, b) => b.peso - a.peso);
      let nota = arr[0].peso; for (let k = 1; k < arr.length; k++) nota += 0.3 * arr[k].peso;
      nota *= cats[ci].peso || 1;
      const len = Math.max(...arr.map((h) => h.len));
      const c = { ci, nota, prio: cats[ci].prioridade || 0, len };
      if (!melhor || c.nota > melhor.nota + 1e-9 || (Math.abs(c.nota - melhor.nota) < 1e-9 && (c.prio > melhor.prio || (c.prio === melhor.prio && c.len > melhor.len)))) {
        if (melhor) segunda = Math.max(segunda, melhor.nota);
        melhor = c;
      } else segunda = Math.max(segunda, c.nota);
    }
    let cat = geral, confianca = 0;
    if (melhor && melhor.nota >= MIN) {
      cat = cats[melhor.ci];
      const forca = Math.min(1, melhor.nota / 4);
      const margem = 1 - Math.min(1, segunda / melhor.nota);
      confianca = +(forca * (0.6 + 0.4 * margem)).toFixed(2);
    }
    const out = { categoria: cat.id, nome: cat.nome, grupo: cat.grupo, confianca, simbolo: cat.simbolo, cor: cat.cor, fantasia: cat.fantasia, emoji: cat.emoji, cena: cat.cena };
    if (cache.size > 500) cache.clear();
    cache.set(chave, out);
    return out;
  }
  classificar.categoria = (id) => porId.get(id);
  return classificar;
}

/* Adaptador para o ponto que o app usa hoje (js/itemicons.js → itemLook(title, extra)):
   devolve { ic, g:[cor,cor], emoji } ou null quando caiu no "geral" (aí vale o ícone da categoria). */
export function criarItemLook(dic) {
  const classificar = criarClassificador(dic);
  return (title, extra = '') => {
    const r = classificar(`${title || ''} ${extra || ''}`);
    return r.categoria === (dic.fallback || 'geral') ? null : { ic: r.simbolo, g: [r.cor, r.cor], emoji: r.emoji, cat: r.categoria, fantasia: r.fantasia };
  };
}
