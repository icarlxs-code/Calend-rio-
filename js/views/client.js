/* Tela do CLIENTE: somente leitura, somente a empresa dele */
import { TYPES, isPost, clientStatus, durationOf } from '../constants.js';
import {
  esc, dayLabel, todayKey, addDays, fromKey, toKey, relDay, fmtDayShort, fmtDayLong, fmtMonth, monthKey, addMonths,
  WD_LETTER, fmtTime, toMin, fromMin, rgba, textOn, initials,
} from '../utils.js';
import { icon } from '../icons.js';
import { CONFIG } from '../../config.js';

const st = { data: null, tab: 'proximos', month: monthKey(todayKey()), sel: todayKey() };

export function showClient(root, data, { canGoBack = false } = {}) {
  st.data = data;
  document.title = `${data.company.name} · Cronograma`;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', data.company.color);
  document.body.classList.add('is-client');
  const draw = () => {
    root.innerHTML = clientHtml(canGoBack);
    root.querySelectorAll('[data-c]').forEach((b) => (b.onclick = () => {
      const a = b.dataset.c;
      if (a === 'tab') st.tab = b.dataset.v;
      if (a === 'month') st.month = addMonths(st.month, Number(b.dataset.v));
      if (a === 'sel') st.sel = b.dataset.v;
      if (a === 'back') {
        location.hash = '';
        location.reload();
        return;
      }
      draw();
    }));
  };
  draw();
}

export function showClientError(root, msg) {
  document.body.classList.add('is-client');
  root.innerHTML = `<div class="client-error">${icon('link', 36)}<h2>Link indisponível</h2><p>${esc(msg)}</p></div>`;
}

function coLogo(c, size) {
  if (c.logo) return `<span class="logo logo--img" style="--s:${size}px;--r:${Math.round(size * 0.28)}px"><img src="${c.logo}" alt=""></span>`;
  return `<span class="logo" style="--s:${size}px;--r:${Math.round(size * 0.28)}px;background:#fff;color:${c.color}">${esc(initials(c.name))}</span>`;
}

function card(e) {
  const t = TYPES[e.type] || TYPES.outro;
  const status = clientStatus(e);
  const showRange = !isPost(e.type) && e.time;
  return `<article class="ccard ccard--${e.status}">
    <div class="ccard__time"><strong>${e.time ? fmtTime(e.time) : '—'}</strong>${showRange ? `<small>${fmtTime(fromMin(toMin(e.time) + durationOf(e)))}</small>` : ''}</div>
    <div class="ccard__body">
      <div class="ccard__top"><span class="tbadge tbadge--${e.type}">${icon(t.icon, 13)}${t.label}</span><span class="cstatus cstatus--${e.status}">${e.status === 'feito' ? icon('check', 12) : ''}${status}</span></div>
      <h4>${esc(e.title || t.label)}</h4>
      ${e.description ? `<p>${esc(e.description)}</p>` : ''}
      ${e.location ? `<p class="ccard__loc">${icon('pin', 13)} ${esc(e.location)}</p>` : ''}
    </div>
  </article>`;
}

function grouped(evs) {
  let last = '';
  return evs.map((e) => {
    const h = e.date !== last ? `<h3 class="dayhead${e.date === todayKey() ? ' is-today' : ''}">${esc(dayLabel(e.date))}</h3>` : '';
    last = e.date;
    return h + card(e);
  }).join('');
}

function clientHtml(canGoBack) {
  const { company: c, events, updatedAt } = st.data;
  const t = todayKey();
  const color = c.color || '#333';
  const mk = st.month;
  const monthEvs = events.filter((e) => e.date.slice(0, 7) === mk);
  const count = (types) => monthEvs.filter((e) => types.includes(e.type)).length;
  const published = monthEvs.filter((e) => e.status === 'feito').length;

  let body;
  if (st.tab === 'proximos') {
    const upcoming = events.filter((e) => e.date >= t);
    const recent = events.filter((e) => e.date < t && e.date >= addDays(t, -14)).reverse();
    body = `
      ${upcoming.length ? grouped(upcoming) : `<div class="empty">${icon('calendar', 28)}<h3>Nada programado ainda</h3><p>Assim que o cronograma for montado, ele aparece aqui.</p></div>`}
      ${recent.length ? `<h2 class="csection">Últimos 14 dias</h2>${grouped(recent)}` : ''}`;
  } else {
    const [y, m] = mk.split('-').map(Number);
    const first = new Date(y, m - 1, 1);
    const start = addDays(toKey(first), -first.getDay());
    const cells = Array.from({ length: 42 }, (_, i) => addDays(start, i));
    const shown = cells.slice(35).some((k) => k.slice(0, 7) === mk) ? cells : cells.slice(0, 35);
    const selEvs = events.filter((e) => e.date === st.sel);
    body = `
      <div class="cmonth__nav">
        <button class="iconbtn" data-c="month" data-v="-1" aria-label="Mês anterior">${icon('left', 20)}</button>
        <strong>${esc(fmtMonth(mk))}</strong>
        <button class="iconbtn" data-c="month" data-v="1" aria-label="Próximo mês">${icon('right', 20)}</button>
      </div>
      <div class="month month--client">
        <div class="month__wd">${WD_LETTER.map((l) => `<span>${l}</span>`).join('')}</div>
        <div class="month__grid">
          ${shown.map((k) => {
            const de = events.filter((e) => e.date === k);
            return `<button class="mday${k.slice(0, 7) === mk ? '' : ' is-out'}${k === t ? ' is-today' : ''}${k === st.sel ? ' is-sel' : ''}" data-c="sel" data-v="${k}">
              <span class="mday__n">${Number(k.slice(8))}</span>
              ${de.length ? `<span class="mday__types">${[...new Set(de.map((e) => e.type))].slice(0, 3).map((ty) => `<i class="tdot tdot--${ty}"></i>`).join('')}</span>` : ''}
            </button>`;
          }).join('')}
        </div>
      </div>
      <h2 class="csection">${esc(dayLabel(st.sel))}</h2>
      ${selEvs.length ? selEvs.map(card).join('') : `<p class="muted center">Nada programado neste dia.</p>`}`;
  }

  return `
  <div class="client" style="--cc:${color};--cc-on:${textOn(color)};--cc-soft:${rgba(color, 0.1)}">
    <header class="client__hero">
      ${canGoBack ? `<button class="client__back" data-c="back">${icon('left', 18)} Voltar ao app</button>` : ''}
      ${coLogo(c, 76)}
      <h1>${esc(c.name)}</h1>
      <p>Cronograma de conteúdo${c.instagram ? ` · @${esc(c.instagram)}` : ''}</p>
    </header>
    <div class="client__body">
      <div class="cstats">
        <div><b>${count(['feed', 'carrossel'])}</b><span>Feed</span></div>
        <div><b>${count(['reels'])}</b><span>Reels</span></div>
        <div><b>${count(['story'])}</b><span>Stories</span></div>
        <div><b>${count(['captacao'])}</b><span>Captações</span></div>
      </div>
      <p class="cstats__cap">${esc(fmtMonth(mk))} · ${published} de ${monthEvs.length} já publicados/realizados</p>

      <div class="seg seg--client">
        <button class="seg__btn${st.tab === 'proximos' ? ' is-on' : ''}" data-c="tab" data-v="proximos">${icon('clock', 15)} Próximos</button>
        <button class="seg__btn${st.tab === 'mes' ? ' is-on' : ''}" data-c="tab" data-v="mes">${icon('calendar', 15)} Calendário</button>
      </div>

      ${body}

      <div class="clegend">
        <span><i class="cstatus cstatus--pendente"></i>Planejado</span>
        <span><i class="cstatus cstatus--pronto"></i>Agendado / confirmado</span>
        <span><i class="cstatus cstatus--feito"></i>Publicado / realizado</span>
      </div>
      <footer class="client__foot">
        Atualizado em ${new Date(updatedAt || Date.now()).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}<br>
        Gestão de conteúdo: <b>${esc(CONFIG.agencyName)}</b>
      </footer>
    </div>
  </div>`;
}
