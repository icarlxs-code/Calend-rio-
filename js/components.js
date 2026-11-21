/* Componentes visuais reutilizáveis + folhas (sheets), toasts e diálogos */
import { store } from './store.js';
import { TYPES, STATUS, durationOf, isMarketing, WORK } from './constants.js';
import { esc, initials, rgba, textOn, fmtTime, toMin, fromMin, nowMin, todayKey } from './utils.js';
import { icon } from './icons.js';
import { platformIcons } from './platforms.js';

/* ---------- Pessoas e empresas ---------- */
export function avatar(id, size = 26) {
  const m = store.member(id);
  if (!m) return '';
  if (m.photo) return `<span class="avatar avatar--photo" style="--s:${size}px;background:${m.color}" title="${esc(m.name)}"><img src="${m.photo}" alt="" loading="lazy"></span>`;
  return `<span class="avatar" style="--s:${size}px;background:${m.color}" title="${esc(m.name)}">${esc(m.name[0])}</span>`;
}
/* foto da pessoa com o anel de nível (progresso até o próximo nível) e o número do nível, como nas redes sociais */
export function meRing(id, size = 34) {
  const L = typeof window !== 'undefined' ? window.__lvl : null;
  return `<span class="lvring${L ? '' : ' is-off'}" data-lvring style="--s:${size}px;--p:${L ? L.deg : 0}deg;--h:${L ? L.hue : '#8E8E93'}">${avatar(id, size)}<i class="lvring__n">${L ? L.level : ''}</i></span>`;
}
/* atualiza os anéis já desenhados (sem redesenhar a tela) */
export function refreshLevelRings() {
  const L = window.__lvl;
  if (!L) return;
  document.querySelectorAll('[data-lvring]').forEach((el) => {
    el.classList.remove('is-off');
    el.style.setProperty('--p', `${L.deg}deg`); el.style.setProperty('--h', L.hue);
    const n = el.querySelector('.lvring__n'); if (n && n.textContent !== String(L.level)) { n.textContent = L.level; n.classList.remove('is-pop'); void n.offsetWidth; n.classList.add('is-pop'); }
  });
}
export function avatars(ids = [], size = 24) {
  if (!ids.length) return `<span class="avatar avatar--empty" style="--s:${size}px" title="Sem responsável">?</span>`;
  return `<span class="avatars">${ids.map((id) => avatar(id, size)).join('')}</span>`;
}
export const whoText = (ids = []) => {
  const names = ids.map((id) => store.member(id)?.name).filter(Boolean);
  if (!names.length) return 'Sem responsável';
  if (names.length === store.team.length && names.length > 1) return 'Os dois';
  return names.join(' e ');
};

/* Sem empresa/local: nas outras profissões mostra o ícone do tipo (Plantão, Aula…) em vez de "?" */
export function logoOrType(company, type, size = 36, radius = null) {
  if (company || isMarketing()) return logo(company, size, radius);
  const t = TYPES[type] || TYPES.outro;
  const r = radius ?? Math.round(size * 0.28);
  return `<span class="logo logo--type" style="--s:${size}px;--r:${r}px;background:${t.color || '#71717A'};color:#fff">${icon(t.icon, Math.round(size * 0.55))}</span>`;
}
export function logo(company, size = 36, radius = null) {
  const r = radius ?? Math.round(size * 0.28);
  if (!company) return `<span class="logo" style="--s:${size}px;--r:${r}px;background:#999">?</span>`;
  if (company.logo) {
    return `<span class="logo logo--img" style="--s:${size}px;--r:${r}px"><img src="${esc(company.logo)}" alt=""></span>`;
  }
  return `<span class="logo" style="--s:${size}px;--r:${r}px;background:${company.color};color:${textOn(company.color)}">${esc(initials(company.name))}</span>`;
}

export function typeBadge(type, { solid = false } = {}) {
  const t = TYPES[type] || TYPES.outro;
  const custom = t.color && !['feed', 'carrossel', 'reels', 'story', 'captacao', 'reuniao', 'producao', 'outro'].includes(type);
  return `<span class="tbadge tbadge--${type}${solid ? ' is-solid' : ''}"${custom ? ` style="--tc:${t.color}"` : ''}>${icon(t.icon, 13)}${t.label}</span>`;
}

export function statusPill(status) {
  return `<span class="spill spill--${status}">${status === 'feito' ? icon('check', 12) : ''}${STATUS[status]?.label || ''}</span>`;
}

export function timeRange(e) {
  if (!e.time) return 'Dia todo';
  const t = TYPES[e.type];
  if (t && (t.kind === 'shoot' || t.kind === 'meeting' || t.kind === 'work' || e.duration)) {
    if (t.kind === 'post' && !e.duration) return fmtTime(e.time);
    return `${fmtTime(e.time)}–${fmtTime(fromMin(toMin(e.time) + durationOf(e)))}`;
  }
  return fmtTime(e.time);
}

/* Cartão de evento (lista do dia) */
export function eventCard(e, { showDate = false, compact = false, highlight = [] } = {}) {
  const c = store.company(e.companyId);
  // sem empresa/cliente: a cor da faixa é a do tipo (Consulta, Plantão, Encomenda…)
  const color = c?.color || TYPES[e.type]?.color || '#888';
  const done = e.status === 'feito';
  const isToday = e.date === todayKey();
  const solo = store.team.length < 2;
  // atrasado: posts assim que passa o horário; o resto quando passa do fim; dias anteriores também
  const today = todayKey();
  const startMin = e.time ? toMin(e.time) : null;
  const past = e.date < today || (isToday && startMin !== null && (TYPES[e.type]?.kind === 'post' ? startMin : startMin + durationOf(e)) < nowMin());
  const late = past && e.status === 'pendente';
  const lateBy = late && isToday && startMin !== null ? nowMin() - startMin : null;
  const flagged = highlight.includes(e.id);
  return `
  <article class="ecard${done ? ' is-done' : ''}${late ? ' is-late' : ''}${flagged ? ' is-flagged' : ''}${compact ? ' is-compact' : ''}"
    style="--cc:${color};--cc-soft:${rgba(color, 0.1)}" data-action="open-event" data-id="${e.id}">
    <div class="ecard__time">
      <strong>${e.time ? fmtTime(e.time) : '—'}</strong>
      ${showDate ? `<small>${esc(e.date.slice(8))}/${esc(e.date.slice(5, 7))}</small>` : e.time && (TYPES[e.type]?.kind !== 'post' || e.duration) ? `<small>${fmtTime(fromMin(toMin(e.time) + durationOf(e)))}</small>` : ''}
    </div>
    <div class="ecard__body">
      <div class="ecard__top">
        ${c || isMarketing() ? logoOrType(c, e.type, 20, 6) : ''}
        ${c || isMarketing() ? `<span class="ecard__company">${esc(c?.name || 'Sem empresa')}</span>` : ''}
        ${typeBadge(e.type)}
      </div>
      <div class="ecard__title"><span class="pfrow">${platformIcons(e, 17)}</span>${esc(e.title || TYPES[e.type]?.label || 'Evento')}</div>
        ${late ? `<span class="ecard__late ecard__late--row">${icon('alert', 12)} Atrasado${lateBy ? ` · ${lateBy >= 60 ? Math.floor(lateBy / 60) + 'h' + (lateBy % 60 ? String(lateBy % 60).padStart(2, '0') : '') : lateBy + ' min'}` : ''}</span>` : ''}
      ${!compact && (!solo || e.location || e.visibleToClient === false) ? `<div class="ecard__meta">
        ${solo ? '' : `${avatars(e.assignees, 20)}<span>${esc(whoText(e.assignees))}</span>`}
        ${e.location ? `<span class="ecard__loc">${icon('pin', 12)}${esc(e.location)}</span>` : ''}

        ${e.visibleToClient === false ? `<span class="ecard__private" title="Não aparece para o cliente">${icon('eyeoff', 12)}</span>` : ''}
      </div>` : ''}
    </div>
    ${store.canComplete(e) ? `<button class="ecard__check${done ? ' is-on' : ''}" data-action="toggle-done" data-id="${e.id}" aria-label="${done ? 'Desmarcar' : 'Marcar como feito'}">
      ${icon('check', 16)}
    </button>` : ''}
  </article>`;
}

export function emptyState(title, text, actionHtml = '') {
  return `<div class="empty">${icon('sparkle', 28)}<h3>${esc(title)}</h3><p>${esc(text)}</p>${actionHtml}</div>`;
}

/* ---------- Folhas (bottom sheets) ---------- */
const sheets = [];
export function openSheet({ html, onMount, className = '', onClose }) {
  const root = document.getElementById('sheets');
  const wrap = document.createElement('div');
  wrap.className = 'sheet-wrap';
  wrap.innerHTML = `<div class="sheet-backdrop" data-close></div>
    <section class="sheet ${className}" role="dialog" aria-modal="true">
      <div class="sheet__grab" data-grab><span></span></div>
      <div class="sheet__inner"></div>
    </section>`;
  root.appendChild(wrap);
  const inner = wrap.querySelector('.sheet__inner');
  const panel = wrap.querySelector('.sheet');
  const api = {
    el: inner,
    panel,
    set(h) {
      inner.innerHTML = h;
      onMount && onMount(api);
    },
    close() {
      if (api.closed) return;
      api.closed = true;
      wrap.classList.remove('is-open');
      const i = sheets.indexOf(api);
      if (i >= 0) sheets.splice(i, 1);
      setTimeout(() => wrap.remove(), 280);
      onClose && onClose();
      document.body.classList.toggle('has-sheet', sheets.length > 0);
    },
  };
  sheets.push(api);
  api.set(html);
  document.body.classList.add('has-sheet');
  requestAnimationFrame(() => requestAnimationFrame(() => wrap.classList.add('is-open')));
  wrap.addEventListener('click', (ev) => {
    if (ev.target.closest('[data-close]')) api.close();
  });
  // arrastar para baixo para fechar
  let startY = null, dy = 0;
  const grab = wrap.querySelector('[data-grab]');
  const onStart = (ev) => {
    if (!ev.target.closest('[data-grab], .sheet__head') || ev.target.closest('button, input, select, textarea')) return;
    startY = ev.touches[0].clientY;
    dy = 0;
    panel.style.transition = 'none';
  };
  const onMove = (ev) => {
    if (startY == null) return;
    dy = Math.max(0, ev.touches[0].clientY - startY);
    panel.style.transform = `translateY(${dy}px)`;
  };
  const onEnd = () => {
    if (startY == null) return;
    panel.style.transition = '';
    panel.style.transform = '';
    if (dy > 110) api.close();
    startY = null;
  };
  panel.addEventListener('touchstart', onStart, { passive: true });
  panel.addEventListener('touchmove', onMove, { passive: true });
  panel.addEventListener('touchend', onEnd);
  grab && grab.addEventListener('click', () => {});
  return api;
}
export const topSheet = () => sheets[sheets.length - 1];
export const closeAllSheets = () => [...sheets].forEach((s) => s.close());
export const openSheets = () => sheets;

export function sheetHead(title, { left = '', right = '' } = {}) {
  return `<header class="sheet__head">
    <div class="sheet__head-l">${left || `<button class="btn-text" data-close>Fechar</button>`}</div>
    <h2>${esc(title)}</h2>
    <div class="sheet__head-r">${right}</div>
  </header>`;
}

/* ---------- Toast ---------- */
let toastTimer;
export function toast(msg, { action, onAction, ms = 2600 } = {}) {
  const el = document.getElementById('toast');
  el.innerHTML = `<span>${esc(msg)}</span>${action ? `<button>${esc(action)}</button>` : ''}`;
  el.classList.add('is-on');
  if (action) el.querySelector('button').onclick = () => {
    el.classList.remove('is-on');
    onAction && onAction();
  };
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('is-on'), ms);
}

/* ---------- Diálogos ---------- */
export function confirmDialog({ title, text = '', ok = 'Confirmar', danger = false }) {
  return new Promise((resolve) => {
    const s = openSheet({
      className: 'sheet--dialog',
      html: `<div class="dialog">
        <h3>${esc(title)}</h3>${text ? `<p>${esc(text)}</p>` : ''}
        <button class="btn ${danger ? 'btn--danger' : 'btn--primary'} btn--block" data-ok>${esc(ok)}</button>
        <button class="btn btn--ghost btn--block" data-close>Cancelar</button>
      </div>`,
      onClose: () => resolve(false),
      onMount: (api) => {
        api.el.querySelector('[data-ok]').onclick = () => {
          resolve(true);
          api.close();
        };
      },
    });
    return s;
  });
}

export function chooseDialog({ title, text = '', bodyHtml = '', options }) {
  return new Promise((resolve) => {
    let picked = null;
    openSheet({
      className: 'sheet--dialog',
      html: `<div class="dialog">
        <h3>${esc(title)}</h3>${text ? `<p>${esc(text)}</p>` : ''}${bodyHtml}
        ${options.map((o, i) => `<button class="btn ${o.danger ? 'btn--danger' : o.primary ? 'btn--primary' : 'btn--soft'} btn--block" data-i="${i}">${esc(o.label)}</button>`).join('')}
        <button class="btn btn--ghost btn--block" data-close>Cancelar</button>
      </div>`,
      onClose: () => resolve(picked),
      onMount: (api) => {
        api.el.querySelectorAll('[data-i]').forEach((b) => (b.onclick = () => {
          picked = options[+b.dataset.i].value;
          api.close();
        }));
      },
    });
  });
}
