/* Lixeira: o que a pessoa apagou nas últimas 24 horas, com restaurar em um toque. */
import { store } from './store.js';
import { personal, restorePersonal, restoreEntries } from './personal.js';
import { openSheet, toast } from './components.js';
import { icon } from './icons.js';
import { esc, fmtTime, dayLabel } from './utils.js';
import { sininho, alive } from './sininho.js';
import { vencido, faltaTxt } from './lixeira-core.js';

const NOME = { events: ['compromisso', 'compromissos'], notes: ['bilhete', 'bilhetes'], companies: ['empresa', 'empresas'], settings: ['ajuste', 'ajustes'], pessoal: ['item pessoal', 'itens pessoais'], entrada: ['item de lista', 'itens de lista'] };
const tituloDe = (x) => x.title || x.name || x.text || 'Sem título';
const quandoDe = (x) => [x.date ? dayLabel(x.date).split(' · ')[0] : '', x.time ? fmtTime(x.time) : ''].filter(Boolean).join(' · ');
/** tudo que dá para restaurar agora */
export function itensDaLixeira(agora = Date.now()) {
  const L = [...store.trash.map(({ col, item }) => ({ col, item })), ...personal.trash.map((item) => ({ col: 'pessoal', item }))];
  for (const l of personal.entradasNaLixeira) L.push({ col: 'entrada', item: l.entry, lista: l.lista });
  return L.filter((x) => !vencido(x.item, agora));
}
export function lotes(agora = Date.now()) {
  const m = new Map();
  for (const x of itensDaLixeira(agora)) { const k = x.item.deleteBatch || `${x.col}:${x.item.id}`; if (!m.has(k)) m.set(k, { lote: k, itens: [], at: x.item.deletedAt, por: x.item.deletedBy, via: x.item.deletedVia, purgeAt: x.item.purgeAt }); m.get(k).itens.push(x); }
  return [...m.values()].sort((a, b) => b.at - a.at);
}
export async function restaura(itens) {
  const porCol = {}; for (const x of itens) (porCol[x.col] = porCol[x.col] || []).push(x);
  let n = 0;
  for (const [col, L] of Object.entries(porCol)) {
    if (col === 'pessoal') n += restorePersonal(L.map((x) => x.item.id)); else if (col === 'entrada') n += restoreEntries(L.map((x) => [x.lista.id, x.item.id])); else n += await store.restore(col, L.map((x) => x.item.id));
  }
  return n;
}
export const restauraLote = (lote) => restaura(lotes().find((l) => l.lote === lote)?.itens || []);
/** aviso com Desfazer por 10 segundos (depois continua na lixeira por 24 h) */
export function avisaApagado(lote, texto = 'Apagado') {
  if (!lote) return;
  toast(`${texto} · na lixeira por 24 h`, { action: 'Desfazer', ms: 10000, onAction: async () => { const n = await restauraLote(lote); toast(n ? 'Tudo de volta ✓' : 'Esse item já saiu da lixeira.'); window.__calRender && window.__calRender(); } });
}
const quem = (por) => (!por || por === store.user?.uid || por === store.me ? 'você' : store.team.find((m) => m.uid === por || m.id === por)?.name || 'alguém da equipe');
const VIA = { assistente: ' pelo assistente', empresa: ' junto com a empresa', tudo: ' em “Apagar tudo”' };
const resumo = (l) => {
  if (l.itens.length === 1) return tituloDe(l.itens[0].item);
  const emp = l.itens.find((x) => x.col === 'companies'), t = {}; l.itens.forEach((x) => (t[x.col] = (t[x.col] || 0) + 1));
  const cos = new Set(l.itens.filter((x) => x.col === 'events').map((x) => x.item.companyId)), nomeCo = cos.size === 1 ? store.company([...cos][0])?.name || store.trash.find((x) => x.col === 'companies' && x.item.id === [...cos][0])?.item.name : '';
  return `${Object.entries(t).filter(([c]) => c !== 'settings').map(([c, n]) => `${n} ${NOME[c][n > 1 ? 1 : 0]}`).join(' e ') || 'Ajustes'}${emp ? ` · ${emp.item.name}` : nomeCo ? ` da ${nomeCo}` : ''}`;
};
export function openLixeira() {
  let abertos = new Set();
  const html = () => {
    const L = lotes();
    return `<div class="fx lix"><header class="fx__head"><button class="fx__pill" data-close>Fechar</button><h2 class="fx__title">Lixeira</h2><span class="fx__right"></span></header>
      <p class="fhelp lix__p">O que você apaga fica aqui por 24 horas. Depois sai de vez.</p>
      ${L.length ? L.map((l) => `<section class="lix__l"><div class="lix__t"><span class="lix__ic">${icon('trash', 20)}</span><span class="lix__tx"><b>${esc(resumo(l))}</b><small>por ${esc(quem(l.por))}${VIA[l.via] || ''} · ${new Date(l.at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} · ${faltaTxt(l)}</small></span><button class="lix__b" data-lote="${esc(l.lote)}">Restaurar</button></div>
        ${l.itens.length > 1 ? `<button class="lix__ver" data-ver="${esc(l.lote)}" aria-expanded="${abertos.has(l.lote)}">${abertos.has(l.lote) ? 'Esconder' : `Ver os ${l.itens.length}`}</button>${abertos.has(l.lote) ? l.itens.map((x, i) => `<div class="lix__i"><span><b>${esc(tituloDe(x.item))}</b><small>${esc([NOME[x.col][0], quandoDe(x.item)].filter(Boolean).join(' · '))}</small></span><button class="lix__b lix__b--s" data-um="${esc(l.lote)}" data-i="${i}">Restaurar</button></div>`).join('') : ''}` : `<p class="lix__q">${esc(quandoDe(l.itens[0].item))}</p>`}</section>`).join('')
        : `<div class="lix__v">${sininho('feliz', { size: 130 })}<h3>Lixeira vazia</h3><p>Nada apagado nas últimas 24 horas.</p></div>`}</div>`;
  };
  const a = openSheet({ className: 'sheet--tall sheet--fx', html: html(), onMount: (x) => {
    alive();
    const faz = (b, pega) => (b.onclick = async () => { b.disabled = true; const n = await restaura(pega()); toast(n > 1 ? `${n} itens de volta ✓` : n ? 'De volta ✓' : 'Não deu para restaurar.'); window.__calRender && window.__calRender(); if (!a.closed) a.set(html()); });
    x.el.querySelectorAll('[data-lote]').forEach((b) => faz(b, () => lotes().find((l) => l.lote === b.dataset.lote)?.itens || []));
    x.el.querySelectorAll('[data-um]').forEach((b) => faz(b, () => [lotes().find((l) => l.lote === b.dataset.um)?.itens[+b.dataset.i]].filter(Boolean)));
    x.el.querySelectorAll('[data-ver]').forEach((b) => (b.onclick = () => { const k = b.dataset.ver; abertos.has(k) ? abertos.delete(k) : abertos.add(k); a.set(html()); }));
  } });
  return a;
}
/** lista exata do que vai sair (para os diálogos de confirmação) */
export function listaHtml(itens, max = 5) {
  const li = (x) => `<li><b>${esc(tituloDe(x))}</b><small>${esc(quandoDe(x))}</small></li>`;
  return `<ul class="dlista">${itens.slice(0, max).map(li).join('')}</ul>${itens.length > max ? `<details class="dmais"><summary>Ver todos (${itens.length})</summary><ul class="dlista">${itens.slice(max, 300).map(li).join('')}</ul></details>` : ''}`;
}
