/* Caixa de escolha (como um "select" bonito): ocupa uma linha na tela e abre a lista de opções por baixo.
   - Escolha única: toca e já fecha.
   - Várias escolhas: marca quantas quiser e toca em "Pronto" (avisa "pode escolher várias").
   - Lista grande (ex.: religião): aparece uma busca no topo. */
import { esc } from './utils.js';
import { icon } from './icons.js';

const norm = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
export function pickText(options, value, multi) {
  const vals = multi ? (Array.isArray(value) ? value.map(String) : []) : [String(value ?? '')];
  const ch = options.filter((o) => vals.includes(String(o.v)));
  if (!ch.length) return '';
  if (multi && ch.length > 2) return `${ch.slice(0, 2).map((o) => o.l).join(', ')} e mais ${ch.length - 2}`;
  return ch.map((o) => o.l).join(', ');
}
export function pickField({ key, label = '', options, value, multi = false, placeholder = 'Toque para escolher', hint = '' }) {
  const text = pickText(options, value, multi);
  const n = multi && Array.isArray(value) ? value.length : 0;
  return `<div class="pkf" data-pkf="${esc(key)}">${label ? `<span class="flabel">${esc(label)}${multi ? ' <small class="pkf__multi">pode escolher várias</small>' : ''}</span>` : ''}
    <button type="button" class="pkf__btn${text ? '' : ' is-empty'}" data-pickf="${esc(key)}" aria-haspopup="listbox">
      <span class="pkf__v">${esc(text || placeholder)}</span>${n ? `<span class="pkf__n">${n}</span>` : ''}<span class="pkf__chev">${icon('down', 18)}</span>
    </button>${hint ? `<p class="fhelp">${esc(hint)}</p>` : ''}</div>`;
}
export function openPicker({ title, hint = '', options, multi = false, value, onDone }) {
  let sel = multi ? new Set((Array.isArray(value) ? value : []).map(String)) : String(value ?? '');
  let q = '';
  const el = document.createElement('div');
  el.className = 'pkr';
  const search = options.length > 10;
  const list = () => options.filter((o) => !q || norm(o.l + ' ' + (o.d || '')).includes(norm(q))).map((o) => {
    const on = multi ? sel.has(String(o.v)) : sel === String(o.v);
    return `<button type="button" class="pkr__opt${on ? ' is-on' : ''}" data-v="${esc(String(o.v))}" role="option" aria-selected="${on}">
      <span class="pkr__mark ${multi ? 'pkr__mark--box' : ''}">${on ? icon('check', 14) : ''}</span>
      <span class="pkr__t"><b>${esc(o.l)}</b>${o.d ? `<small>${esc(o.d)}</small>` : ''}</span></button>`;
  }).join('') || '<p class="fhelp" style="padding:14px 18px">Nada encontrado.</p>';
  const foot = () => (multi ? `<div class="pkr__foot"><button type="button" class="btn btn--primary btn--block" data-done>${sel.size ? `Pronto · ${sel.size} ${sel.size === 1 ? 'escolhida' : 'escolhidas'}` : 'Pronto'}</button></div>` : '');
  el.innerHTML = `<div class="pkr__bg" data-x></div>
    <div class="pkr__panel" role="dialog" aria-label="${esc(title)}">
      <div class="pkr__grab"><span></span></div>
      <div class="pkr__head"><b>${esc(title)}</b><button type="button" class="pkr__close" data-x aria-label="Fechar">${icon('x', 18)}</button></div>
      ${hint || multi ? `<p class="pkr__hint">${esc(hint || 'Pode escolher várias.')}</p>` : ''}
      ${search ? `<div class="pkr__search">${icon('search', 16)}<input type="search" placeholder="Buscar" data-q autocomplete="off"></div>` : ''}
      <div class="pkr__list" role="listbox" aria-multiselectable="${multi}" data-list>${list()}</div>
      <div data-foot>${foot()}</div>
    </div>`;
  document.body.appendChild(el);
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('is-open')));
  const close = (commit) => {
    el.classList.remove('is-open');
    setTimeout(() => el.remove(), 260);
    if (commit) {
      if (multi) onDone(options.filter((o) => sel.has(String(o.v))).map((o) => o.v));
      else { const o = options.find((x) => String(x.v) === sel); if (o) onDone(o.v); }
    }
  };
  const bindList = () => el.querySelectorAll('[data-v]').forEach((b) => (b.onclick = () => {
    const v = b.dataset.v;
    if (multi) {
      sel.has(v) ? sel.delete(v) : sel.add(v);
      b.classList.toggle('is-on', sel.has(v)); b.setAttribute('aria-selected', sel.has(v));
      b.querySelector('.pkr__mark').innerHTML = sel.has(v) ? icon('check', 14) : '';
      el.querySelector('[data-foot]').innerHTML = foot(); bindFoot();
      return;
    }
    sel = v;
    el.querySelectorAll('[data-v]').forEach((x) => { const on = x.dataset.v === v; x.classList.toggle('is-on', on); x.querySelector('.pkr__mark').innerHTML = on ? icon('check', 14) : ''; });
    setTimeout(() => close(true), 170);
  }));
  const bindFoot = () => { const d = el.querySelector('[data-done]'); if (d) d.onclick = () => close(true); };
  bindList(); bindFoot();
  // fechar sem "Pronto": na escolha múltipla guarda o que marcou (como no iPhone); na única, não muda nada
  el.querySelectorAll('[data-x]').forEach((b) => (b.onclick = () => close(multi)));
  const qi = el.querySelector('[data-q]');
  if (qi) qi.oninput = () => { q = qi.value; el.querySelector('[data-list]').innerHTML = list(); bindList(); };
  return { close };
}
