/* Telas "Hoje" (agenda do dia) e "Calendário" (mês) */
import { streak } from '../reward.js';
import { store } from '../store.js';
import { ui } from '../ui.js';
import { TYPES, isPost, durationOf, typeStyle, WORK, ent, isMarketing, crew, todos } from '../constants.js';
import {
  esc, todayKey, addDays, startOfWeek, fromKey, toKey, fmtDayLong, fmtDayShort, relDay, fmtMonth,
  WD_LETTER, WD_SHORT, dayLabel, fmtDuration, MONTHS_SHORT, MONTHS, toMin, nowMin, fmtTime, fmtCountdown, greeting, rgba, textOn,
} from '../utils.js';
import { icon } from '../icons.js';
import { avatar, avatars, logo, eventCard, emptyState, typeBadge, whoText, timeRange, logoOrType } from '../components.js';
import { dayInsights, nextUp } from '../insights.js';
import { dayBrief, dayBriefRows, freeTime } from '../planner.js';

/* ---------- elementos compartilhados ---------- */
export function personSwitch() {
  if (store.team.length < 2) return ''; // conta própria: sem seletor de pessoa
  const opts = [{ id: 'all', name: 'Todos' }, ...store.team];
  return `<div class="seg" role="tablist">
    ${opts.map((o) => `<button class="seg__btn${ui.person === o.id ? ' is-on' : ''}" data-action="set-person" data-p="${o.id}">
      ${o.id === 'all' ? icon('users', 15) : avatar(o.id, 18)}<span>${esc(o.name)}${store.me === o.id ? '<em> (você)</em>' : ''}</span></button>`).join('')}
  </div>`;
}

function companyDots(evs, max = 4) {
  const seen = [];
  evs.forEach((e) => {
    if (!seen.includes(e.companyId)) seen.push(e.companyId);
  });
  return seen.slice(0, max).map((id) => `<i style="background:${store.company(id)?.color || '#999'}"></i>`).join('');
}

/* ======================== HOJE ======================== */
export function renderToday() {
  const date = ui.date;
  const today = todayKey();
  const evs = store.eventsOn(date, { person: ui.person });
  const insights = dayInsights(date, ui.person);
  const flagged = insights.filter((i) => i.level === 'warn' && i.icon !== 'flag').flatMap((i) => i.ids || []);
  const me = store.member(store.me);

  // Semana
  // faixa contínua de dias (rola sem parar e vira o mês sozinha); a janela anda junto com a rolagem
  const center = ui.stripCenter || date;
  const stripFrom = addDays(startOfWeek(center), -42);
  const week = Array.from({ length: 126 }, (_, i) => addDays(stripFrom, i));
  const weekLabel = (() => { const d = fromKey(center); const m = MONTHS[d.getMonth()]; return `${m.charAt(0).toUpperCase() + m.slice(1)} de ${d.getFullYear()}`; })();

  const header = `
  <header class="hdr">
    <div class="hdr__row">
      <div class="hdr__titles">
        <p class="hdr__eyebrow">${date === today ? `${greeting()}${me ? ', ' + esc(me.name) : ''}` : esc(fmtDayLong(date))}</p>
        <h1>${esc(relDay(date))}${date === today ? `<span class="hdr__date">${esc(fmtDayShort(date))}</span>` : ''}</h1>
        ${(!isMarketing() && WORK.profession) || store.shared || Object.keys(store.profile?.teams || {}).length ? `<div class="hdr__chips">
          ${!isMarketing() && WORK.profession ? `<button class="profchip" data-action="ficha">${icon(WORK.badge || 'briefcase', 13)} ${esc(WORK.profession)}</button>` : ''}
          ${store.shared || Object.keys(store.profile?.teams || {}).length ? `<button class="wschip" data-action="share">${icon('users', 13)} ${store.shared ? `Agenda de ${esc(store.shared.ownerName)}` : 'Minha agenda'} ${icon('down', 12)}</button>` : ''}
        </div>` : ''}
      </div>
      <div class="hdr__actions">
        ${date !== today ? `<button class="chip chip--accent" data-action="go-today">Hoje</button>` : ''}
        <button class="iconbtn iconbtn--personal" data-action="space" data-space="personal" aria-label="Ir para o Pessoal">${icon('heart', 19)}</button>
        <button class="iconbtn iconbtn--ai" data-action="assistant" aria-label="Assistente">${icon('sparkle', 20)}</button>
        <button class="iconbtn" data-action="tab" data-tab="ajustes" aria-label="Perfil">${me ? avatar(me.id, 34) : icon('user', 20)}</button>
      </div>
    </div>
    ${personSwitch()}
    <div class="week">
      <div class="week__bar">
        <button class="iconbtn iconbtn--sm" data-action="week" data-n="-7" aria-label="Semana anterior">${icon('left', 18)}</button>
        <span data-striplabel>${esc(weekLabel)}</span>
        <button class="iconbtn iconbtn--sm" data-action="week" data-n="7" aria-label="Próxima semana">${icon('right', 18)}</button>
      </div>
      <div class="week__days daystrip" data-strip data-sel="${date}">
        ${week.map((k) => {
          const d = fromKey(k);
          const de = store.eventsOn(k, { person: ui.person });
          const pending = de.filter((e) => e.status !== 'feito').length;
          return `<button class="wday${k === date ? ' is-sel' : ''}${k === today ? ' is-today' : ''}${k.slice(8) === '01' ? ' is-first' : ''}" data-action="set-date" data-k="${k}">
            <span class="wday__l">${WD_SHORT[d.getDay()]}</span>
            <span class="wday__n">${d.getDate()}</span>
            <span class="wday__dots">${companyDots(de, 3)}${!de.length ? '<i class="none"></i>' : ''}</span>
            ${pending ? `<span class="sr">${pending} pendentes</span>` : ''}
          </button>`;
        }).join('')}
      </div>
    </div>
  </header>`;

  // Resumo
  const counts = {};
  evs.forEach((e) => (counts[e.type] = (counts[e.type] || 0) + 1));
  const done = evs.filter((e) => e.status === 'feito').length;
  const pct = evs.length ? Math.round((done / evs.length) * 100) : 0;
  const summary = evs.length
    ? `<div class="summary">
        <div class="summary__progress">
          <div class="ring" style="--p:${pct}"><span>${pct}%</span></div>
          <div><strong>${done} de ${evs.length}</strong><small>${done === evs.length ? 'Dia 100% concluído 🏆' : evs.length - done === 1 && date === today ? 'Falta só 1 para fechar o dia' : 'concluídos'}</small>${streak().days >= 2 ? `<span class="streak">🔥 ${streak().days} dias seguidos</span>` : ''}</div>
        </div>
        <div class="summary__types">
          ${Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([t, n]) => `<span class="tcount tbadge--${t}"${typeStyle(t)}>${icon(TYPES[t].icon, 13)}${TYPES[t].label} <b>${n}</b></span>`).join('')}
        </div>
      </div>`
    : '';

  // Equipe no dia (onde cada um estará)
  const team = ui.person === 'all' && store.team.length > 1 ? `<section class="block">
      <h2 class="block__title">${icon('route', 16)} Onde cada um vai estar</h2>
      <div class="team">${store.team.map((m) => teamCol(m, date)).join('')}</div>
    </section>` : '';

  // Próximo
  let next = '';
  if (date === today) {
    const n = nextUp(ui.person);
    if (n) {
      const c = store.company(n.companyId);
      const mins = toMin(n.time) - nowMin();
      const color = c?.color || '#555';
      next = `<button class="next" style="--cc:${color};--cc-soft:${rgba(color, 0.12)}" data-action="open-event" data-id="${n.id}">
        <div class="next__label">${icon('bell', 14)} ${mins > 0 ? 'Próximo · ' + fmtCountdown(mins) : 'Acontecendo agora'}</div>
        <div class="next__row">
          ${logoOrType(c, n.type, 44)}
          <div class="next__txt">
            <strong>${[fmtTime(n.time), esc(TYPES[n.type].label), c ? esc(c.name) : ''].filter(Boolean).join(' · ')}</strong>
            <span>${esc(n.title || '')}</span>
          </div>
          ${avatars(n.assignees, 26)}
        </div>
        ${n.location ? `<div class="next__loc">${icon('pin', 13)} ${esc(n.location)}</div>` : ''}
      </button>`;
    }
  }

  // Dicas e alertas
  const warnCount = insights.filter((i) => i.level === 'warn').length;
  // dicas e alertas ficam recolhidos: só aparecem se a pessoa quiser ver
  const tips = `<section class="block">
    <button class="tipsbar${ui.showAllTips ? ' is-open' : ''}" data-action="toggle-tips">
      <span>${icon('bulb', 17)} Dicas e alertas</span>
      ${warnCount ? `<em class="tipsbar__warn">${warnCount} ${warnCount === 1 ? 'alerta' : 'alertas'}</em>` : `<em>${insights.length}</em>`}
      ${icon(ui.showAllTips ? 'down' : 'right', 16, 'muted')}
    </button>
    ${ui.showAllTips ? `<div class="tips">${insights.map(tipCard).join('')}</div>` : ''}
  </section>`;

  // Linha do tempo
  let timeline;
  if (!evs.length) {
    timeline = emptyState('Dia livre', ui.person === 'all' ? 'Nada agendado para este dia.' : `Nada agendado para ${store.member(ui.person)?.name}.`,
      `<button class="btn btn--primary" data-action="new-event" data-date="${date}">${icon('plus', 18)} Adicionar</button>`);
  } else {
    const groups = [
      { k: 'Manhã', icon: 'sun', items: evs.filter((e) => e.time && toMin(e.time) < 720) },
      { k: 'Tarde', items: evs.filter((e) => e.time && toMin(e.time) >= 720 && toMin(e.time) < 1080) },
      { k: 'Noite', items: evs.filter((e) => e.time && toMin(e.time) >= 1080) },
      { k: 'Sem horário', items: evs.filter((e) => !e.time) },
    ];
    const now = nowMin();
    let nowPlaced = date !== today;
    timeline = groups.filter((g) => g.items.length).map((g) => `
      <div class="tl-group">
        <h3 class="tl-group__h">${g.k}<span>${g.items.length}</span></h3>
        ${g.items.map((e) => {
          let line = '';
          if (!nowPlaced && e.time && toMin(e.time) > now) {
            nowPlaced = true;
            line = `<div class="nowline"><span>Agora · ${fmtTime(`${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`)}</span></div>`;
          }
          return line + eventCard(e, { highlight: flagged });
        }).join('')}
      </div>`).join('');
    if (!nowPlaced && date === today) timeline += `<div class="nowline nowline--end"><span>Agora · ${fmtTime(`${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`)} · fim da agenda</span></div>`;
  }

  // Bilhetes: hora em que foi escrito (e o dia, se não foi hoje)
  const noteWhen = (n) => {
    if (!n.createdAt) return '';
    const d = new Date(n.createdAt), hm = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    return `<time class="note__time">${k === today ? `às ${hm}` : `${k.slice(8, 10)}/${k.slice(5, 7)} às ${hm}`}</time>`;
  };
  const notes = store.notesOn(date);
  const notesHtml = `<section class="block">
    <h2 class="block__title">${icon('note', 16)} Bilhetes do dia</h2>
    <div class="notes">
      ${notes.map((n) => `<div class="note">
        ${(n.mentions || []).length ? `<div class="note__to">${(n.mentions || []).map((id) => `<span>@${esc(store.member(id)?.name || '')}</span>`).join('')}</div>` : ''}
        <p>${esc(n.text)}</p>
        <footer>${avatar(n.author, 18)}<span>${esc(store.member(n.author)?.name || '')}</span>${noteWhen(n)}
          ${store.canEdit('notes', n) ? `<button class="note__del" data-action="del-note" data-id="${n.id}" aria-label="Apagar bilhete">${icon('x', 14)}</button>` : ''}</footer>
      </div>`).join('')}
      <form class="note-add" data-form="note">
        <input name="text" placeholder="${store.team.length > 1 ? `Escreva um bilhete para a ${crew()}…` : 'Escreva um bilhete para você…'}" autocomplete="off" maxlength="280">
        <button class="iconbtn iconbtn--accent" aria-label="Adicionar bilhete">${icon('plus', 18)}</button>
        ${store.team.length > 1 ? `<div class="note-to"><small>Marcar:</small>${store.team.filter((m) => m.id !== store.me).map((m) => `<label class="note-to__chip"><input type="checkbox" name="mention" value="${esc(m.id)}">${avatar(m.id, 18)}<span>${esc(m.name)}</span></label>`).join('')}</div>` : ''}
      </form>
    </div>
  </section>`;

  return `${header}
  <div class="page">
    ${store.demo ? demoBanner() : ''}
    ${next}
    <button class="brief" data-action="assistant">
      <span class="brief__ic">${icon('sparkle', 18)}</span>
      <div class="brief__body">
        ${dayBriefRows(date, ui.person).map((r) => {
          const left = r.total - r.done;
          const status = !r.total ? 'nada marcado hoje'
            : r.late ? `${r.late} atrasad${r.late > 1 ? 'as' : 'a'}`
            : !left ? 'fez tudo ✓'
            : `${left} para fazer`;
          const cls = !r.total ? '' : r.late ? ' is-late' : !left ? ' is-ok' : '';
          return `<div class="brow">${avatar(r.id, 22)}<b>${esc(r.name)}</b><span class="brow__st${cls}">${esc(status)}</span>${r.next && !r.late ? `<small class="brow__next">· próximo às ${esc(r.next.split(' · ')[0])}</small>` : ''}</div>`;
        }).join('')}
      </div>
      ${icon('right', 18, 'muted')}
    </button>
    ${team}
    <section class="block">
      <h2 class="block__title">${icon('clock', 16)} Agenda ${store.team.length < 2 ? 'do dia' : ui.person === 'all' ? `da ${crew()}` : 'de ' + esc(store.member(ui.person)?.name || '')}</h2>
      ${summary}
      ${timeline}
    </section>
    ${tips}
    ${notesHtml}
  </div>`;
}

function teamCol(m, date) {
  const evs = store.eventsOn(date, { person: m.id });
  const now = date === todayKey() ? nowMin() : -1;
  const onsite = evs.filter((e) => TYPES[e.type]?.onSite || ['shoot', 'meeting'].includes(TYPES[e.type]?.kind));
  const posts = evs.filter((e) => isPost(e.type)).length;
  const next = evs.find((e) => e.time && e.status !== 'feito' && toMin(e.time) + durationOf(e) > now);
  const ft = freeTime(m.id, date);
  const freeTxt = ft.dayOff ? 'Folga' : `${fmtDuration(Math.round(ft.minutes / 15) * 15) || '0 min'} livres`;
  return `<button class="team__col" data-action="set-person" data-p="${m.id}">
    <span class="team__free ${ft.dayOff ? 'is-off' : ft.minutes >= 240 ? 'is-good' : ft.minutes >= 120 ? 'is-mid' : 'is-low'}">${icon('clock', 12)} ${freeTxt}</span>
    <div class="team__head">${avatar(m.id, 30)}<div><strong>${esc(m.name)}</strong><small>${evs.length} ${isMarketing() ? 'tarefa' : 'compromisso'}${evs.length === 1 ? '' : 's'}${isMarketing() ? ` · ${posts} post${posts === 1 ? '' : 's'}` : ''}</small></div></div>
    <ul class="team__where">
      ${onsite.length ? onsite.map((e) => `<li>${icon(TYPES[e.type].icon, 13)}<span><b>${fmtTime(e.time)}</b> ${esc(store.company(e.companyId)?.name || '')}</span></li>`).join('')
        : `<li class="muted">${icon('building', 13)}<span>Trabalho interno / remoto</span></li>`}
    </ul>
    ${next ? `<div class="team__next">Próximo: <b>${fmtTime(next.time)}</b> ${esc(TYPES[next.type].label)}${store.company(next.companyId) ? ' · ' + esc(store.company(next.companyId).name) : ''}</div>` : `<div class="team__next muted">${evs.length ? 'Tudo concluído ✓' : 'Livre'}</div>`}
  </button>`;
}

function tipCard(t) {
  const fixes = t.fixes?.length
    ? `<div class="fixes">${t.fixes.map((f) => `<button class="fixbtn" data-action="apply-fix" data-id="${f.eventId}" data-patch="${esc(JSON.stringify(f.patch))}">${icon('check', 13)} ${esc(f.label)}</button>`).join('')}</div>`
    : '';
  return `<div class="tip tip--${t.level}"${t.ids?.length === 1 && !fixes ? ` data-action="open-event" data-id="${t.ids[0]}"` : ''}>
    <span class="tip__ic">${icon(t.icon, 16)}</span>
    <div><strong>${esc(t.title)}</strong><p>${esc(t.text)}</p>${fixes}</div>
  </div>`;
}

function demoBanner() {
  return `<div class="banner">
    ${icon('sparkle', 18)}
    <p><strong>Você está vendo dados de exemplo.</strong> Explore à vontade e, quando quiser começar de verdade, apague os exemplos.</p>
    <button class="btn btn--soft btn--sm" data-action="clear-demo">Apagar exemplos</button>
  </div>`;
}

/* ======================== MÊS ======================== */
export function renderMonth() {
  const mk = ui.month;
  const [y, m] = mk.split('-').map(Number);
  const first = new Date(y, m - 1, 1);
  const startK = addDays(toKey(first), -first.getDay());
  const today = todayKey();
  const cells = Array.from({ length: 42 }, (_, i) => addDays(startK, i));
  const lastRowUsed = cells.slice(35).some((k) => k.slice(0, 7) === mk);
  const shown = lastRowUsed ? cells : cells.slice(0, 35);
  const filter = { person: ui.person, companyId: ui.monthCompany };

  const companies = store.companiesSorted();
  const sel = ui.monthSel;
  const selEvents = store.eventsOn(sel, filter);

  // Estatística do mês
  const monthEvs = store.eventsBetween(`${mk}-01`, `${mk}-31`, filter);
  const posts = monthEvs.filter((e) => isPost(e.type)).length;
  const shoots = monthEvs.filter((e) => e.type === 'captacao').length;
  const meetings = monthEvs.filter((e) => e.type === 'reuniao').length;

  return `
  <header class="hdr">
    <div class="hdr__row">
      <div class="hdr__titles">
        <p class="hdr__eyebrow">Calendário</p>
        <h1>${esc(fmtMonth(mk).split(' ')[0])}<span class="hdr__date">${mk.slice(0, 4)}</span></h1>
      </div>
      <div class="hdr__actions">
        <button class="iconbtn" data-action="month" data-n="-1" aria-label="Mês anterior">${icon('left', 20)}</button>
        <button class="chip" data-action="month-today">Hoje</button>
        <button class="iconbtn" data-action="month" data-n="1" aria-label="Próximo mês">${icon('right', 20)}</button>
      </div>
    </div>
    ${personSwitch()}
  </header>
  <div class="page">
    <div class="chips-scroll">
      <button class="chip${!ui.monthCompany ? ' is-on' : ''}" data-action="month-company" data-id="">${todos()}</button>
      ${companies.map((c) => `<button class="chip chip--co${ui.monthCompany === c.id ? ' is-on' : ''}" style="--cc:${c.color}" data-action="month-company" data-id="${c.id}">${logo(c, 18, 5)}${esc(c.name)}</button>`).join('')}
    </div>

    <div class="mstats">
      ${isMarketing() ? `<div><b>${posts}</b><span>posts</span></div>
      <div><b>${shoots}</b><span>captações</span></div>` : `<div><b>${monthEvs.length}</b><span>compromissos</span></div>
      <div><b>${monthEvs.filter((e) => TYPES[e.type]?.onSite).length}</b><span>fora de casa</span></div>`}
      ${isMarketing() ? `<div><b>${meetings}</b><span>reuniões</span></div>` : `<div><b>${monthEvs.filter((e) => e.status === 'pendente' && e.date < todayKey()).length}</b><span>atrasados</span></div>`}
      <div><b>${monthEvs.filter((e) => e.status === 'feito').length}/${monthEvs.length}</b><span>concluídos</span></div>
    </div>

    <div class="month" data-swipe="month">
      <div class="month__wd">${WD_LETTER.map((l) => `<span>${l}</span>`).join('')}</div>
      <div class="month__grid">
        ${shown.map((k) => {
          const inMonth = k.slice(0, 7) === mk;
          const de = store.eventsOn(k, filter);
          const hasShoot = de.some((e) => e.type === 'captacao');
          return `<button class="mday${inMonth ? '' : ' is-out'}${k === today ? ' is-today' : ''}${k === sel ? ' is-sel' : ''}" data-action="month-select" data-k="${k}">
            <span class="mday__n">${Number(k.slice(8))}</span>
            ${de.length ? `<span class="mday__bars">${companyBars(de)}</span><span class="mday__count">${hasShoot ? icon('camera', 10) : ''}${de.length}</span>` : ''}
          </button>`;
        }).join('')}
      </div>
    </div>

    <section class="block">
      <div class="block__row">
        <h2 class="block__title">${esc(dayLabel(sel))}</h2>
        <button class="btn-text btn-text--sm" data-action="open-day" data-k="${sel}">Abrir dia ${icon('right', 14)}</button>
      </div>
      ${selEvents.length ? selEvents.map((e) => eventCard(e)).join('')
        : emptyState('Nada neste dia', 'Toque no + para agendar.', `<button class="btn btn--soft" data-action="new-event" data-date="${sel}">${icon('plus', 16)} Novo evento</button>`)}
    </section>

    ${companies.length ? `<section class="block">
      <h2 class="block__title">Legenda</h2>
      <div class="legend">${companies.map((c) => `<span><i style="background:${c.color}"></i>${esc(c.name)}</span>`).join('')}</div>
    </section>` : ''}
  </div>`;
}

function companyBars(evs) {
  const byC = {};
  evs.forEach((e) => (byC[e.companyId] = (byC[e.companyId] || 0) + 1));
  return Object.entries(byC).slice(0, 4).map(([id]) => `<i style="background:${store.company(id)?.color || '#999'}"></i>`).join('');
}
