/* Telas "Hoje" (agenda do dia) e "Calendário" (mês) */
import { streak } from '../reward.js';
import { store } from '../store.js';
import { ui } from '../ui.js';
import { TYPES, isPost, durationOf, typeStyle, WORK, ent, isMarketing, crew, todos } from '../constants.js';
import {
  esc, todayKey, addDays, diffDays, startOfWeek, fromKey, toKey, fmtDayLong, fmtDayShort, relDay, fmtMonth,
  WD_LETTER, WD_SHORT, dayLabel, fmtDuration, MONTHS_SHORT, MONTHS, toMin, nowMin, fmtTime, fmtCountdown, greeting, rgba, textOn,
} from '../utils.js';
import { icon } from '../icons.js';
import { modoSwitch, meRing, avatar, avatars, logo, eventCard, emptyState, typeBadge, whoText, timeRange, logoOrType } from '../components.js';
import { dayInsights, nextUp } from '../insights.js';
import { teamBoardCard } from './teamboard.js';
import { professionFor } from '../../functions/catalog.js';
import { dayBrief, dayBriefRows, freeTime } from '../planner.js';
import { itensAtrasados } from './atrasados.js';
import { sininho } from '../sininho.js';

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
  const weekLabel = (() => { const d = fromKey(center); const m = MONTHS[d.getMonth()]; return `${m.charAt(0).toUpperCase() + m.slice(1)}${d.getFullYear() !== new Date().getFullYear() ? ` de ${d.getFullYear()}` : ''}`; })();

  // topo compacto: "Hoje" + a data; a saudação vai para o Foco
  const header = `
  <header class="hdr hdr--hoje">
    <div class="hdr__row">
      <div class="hdr__titles">
        <h1>${esc(relDay(date))}</h1>
        <p class="hdr__sub">${esc(date === today ? fmtDayShort(date) : fmtDayLong(date))}</p>
        ${(!isMarketing() && WORK.profession) || store.shared || Object.keys(store.profile?.teams || {}).length ? `<div class="hdr__chips">
          ${!isMarketing() && WORK.profession ? `<button class="profchip" data-action="ficha">${icon(WORK.badge || 'briefcase', 13)} ${esc(professionFor(WORK.profession, store.profile?.pronoun))}</button>` : ''}
          ${store.shared || Object.keys(store.profile?.teams || {}).length ? `<button class="wschip" data-action="share">${icon('users', 13)} ${store.shared ? `Agenda de ${esc(store.shared.ownerName)}` : 'Minha agenda'} ${icon('down', 12)}</button>` : ''}
        </div>` : ''}
      </div>
      <div class="hdr__actions">
        ${date !== today ? `<button class="chip chip--accent" data-action="go-today">Hoje</button>` : ''}
        ${modoSwitch('work')}
        <button class="iconbtn iconbtn--ai" data-action="assistant" aria-label="Assistente">${icon('sparkle', 20)}</button>
        <button class="iconbtn iconbtn--me" data-action="profile" aria-label="Seu perfil e conquistas">${me ? meRing(me.id, 32) : icon('user', 20)}</button>
      </div>
    </div>
  </header>`;
  // semana compacta: só os dias (rola) e o mês embaixo (abre o Calendário)
  const weekHtml = `<div class="week week--c">
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
      <button class="week__mes" data-action="tab" data-tab="mes"><span data-striplabel>${esc(weekLabel)}</span></button>
    </div>`;

  // contas do dia (usadas no Foco): feitos, total e os tipos (chips recolhidos)
  const counts = {};
  evs.forEach((e) => (counts[e.type] = (counts[e.type] || 0) + 1));
  const done = evs.filter((e) => e.status === 'feito').length;
  const pct = evs.length ? Math.round((done / evs.length) * 100) : 0;
  const typesHtml = `<div class="summary__types">
          ${Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([t, n]) => `<span class="tcount tbadge--${t}"${typeStyle(t)}>${icon(TYPES[t].icon, 13)}${TYPES[t].label} <b>${n}</b></span>`).join('')}
        </div>`;

  // Equipe no dia (onde cada um estará)
  const team = ui.person === 'all' && store.team.length > 1 ? `<section class="block">
      <h2 class="block__title">${icon('route', 16)} Onde cada um vai estar</h2>
      <div class="team">${store.team.map((m) => teamCol(m, date)).join('')}</div>
    </section>` : '';

  // ---------- FOCO: uma coisa em destaque, uma ação principal ----------
  const atras = date === today ? itensAtrasados() : [];
  const nUp = date === today ? nextUp(ui.person) : null;
  const pend1 = date === today && !nUp ? evs.find((e) => e.status !== 'feito') : null;
  const alvo = nUp || pend1;
  const totalGeral = store.state.events.length;
  const dias = streak().days;
  const amanha = addDays(today, 1);
  const prim = (attrs, label) => `<button class="foco__go" ${attrs}>${label}</button>`;
  const sec = (attrs, label) => `<button class="foco__sec" ${attrs}>${label}</button>`;
  let F;
  if (atras.length) F = { mood: 'desconfiado', lbl: 'Ficou pra trás', tit: atras.length === 1 ? '1 ficou pra trás' : `${atras.length} ficaram pra trás`, sub: atras.slice(0, 2).map((x) => x.title).join(' · '), acts: prim('data-action="atrasados"', 'Resolver') };
  else if (!evs.length) F = { mood: 'acena', lbl: 'Comece por aqui', tit: `O que você não pode esquecer ${date === today ? 'hoje' : relDay(date).toLowerCase()}?`, sub: 'Eu te aviso na hora certa.', vazio: true, acts: prim(`data-action="new-event" data-date="${date}"`, `${icon('plus', 18)} Criar meu 1º lembrete`) };
  else if (date !== today) F = { mood: 'feliz', lbl: fmtDayLong(date), tit: `${evs.length} ${evs.length === 1 ? 'lembrete' : 'lembretes'}`, sub: done ? `${done} já ${done === 1 ? 'feito' : 'feitos'}` : '', acts: prim(`data-action="new-event" data-date="${date}"`, `${icon('plus', 18)} Adicionar`) };
  else if (alvo) {
    const mins = alvo.time ? toMin(alvo.time) - nowMin() : null, c = store.company(alvo.companyId);
    F = { id: alvo.id, mood: 'feliz', lbl: nUp ? (mins > 0 ? `Próximo · ${fmtCountdown(mins)}` : 'Acontecendo agora') : `${greeting()}${me ? ', ' + me.name : ''}`,
      tit: `${alvo.time ? fmtTime(alvo.time) + ' · ' : ''}${alvo.title || TYPES[alvo.type]?.label || ''}`, sub: [TYPES[alvo.type]?.label, c ? c.name : '', alvo.location || ''].filter(Boolean).join(' · '),
      acts: prim(`data-action="toggle-done" data-id="${alvo.id}"`, `${icon('check', 18)} Concluir`) + sec(`data-action="adiar-1h" data-id="${alvo.id}"`, 'Adiar 1 h') };
  } else F = { mood: 'comemora', lbl: `${greeting()}${me ? ', ' + me.name : ''}`, tit: 'Dia 100%! 🏆', sub: 'Tudo feito. Que tal deixar amanhã pronto?', acts: prim(`data-action="new-event" data-date="${amanha}"`, 'Planejar amanhã') };
  const atalhos = F.vazio ? `<div class="foco__atalhos">
      <button data-action="new-event-preset" data-title="Tomar remédio" data-time="08:00" data-date="${date}">💊 Tomar remédio <b>08:00</b></button>
      <button data-action="new-event-preset" data-title="Pagar uma conta" data-date="${date === today ? amanha : date}">💸 Pagar uma conta <b>${date === today ? 'amanhã' : ''}</b></button>
      <button data-action="new-event-preset" data-title="Aniversário de alguém" data-date="${date}">🎂 Aniversário de alguém</button>
    </div>` : '';
  const prog = evs.length ? `<button class="foco__prog" data-action="toggle-types" aria-expanded="${!!ui.showTypes}">
      <span>${done} de ${evs.length} ${date === today ? 'hoje' : ''}</span><i class="foco__bar"><b style="width:${pct}%"></b></i>${dias >= 1 ? `<span>🔥 ${dias} ${dias === 1 ? 'dia' : 'dias'}</span>` : ''}
    </button>${ui.showTypes ? typesHtml : ''}` : '';
  const foco = `<section class="foco" aria-label="Em foco">
      <div class="foco__snh"><i class="foco__blob"></i>${sininho(F.mood, { size: 72 })}</div>
      <p class="foco__lbl">${esc(F.lbl)}</p>
      <h2 class="foco__tit"${F.id ? ` data-action="open-event" data-id="${F.id}"` : ''}>${esc(F.tit)}</h2>
      ${F.sub ? `<p class="foco__sub">${esc(F.sub)}</p>` : ''}
      ${atalhos}
      <div class="foco__acts">${F.acts}</div>
      ${prog}
    </section>`;

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
  if (!evs.length && !totalGeral) timeline = '';
  else if (!evs.length) {
    timeline = emptyState('Dia livre', ui.person === 'all' ? 'Nada agendado para este dia.' : `Nada agendado para ${store.member(ui.person)?.name}.`,
      `<button class="btn btn--primary" data-action="new-event" data-date="${date}">${icon('plus', 18)} Adicionar</button>`);
  } else {
    const groups = [
      { k: 'Manhã', icon: 'sun', items: evs.filter((e) => e.time && toMin(e.time) < 720) },
      { k: 'Tarde', icon: 'sun', items: evs.filter((e) => e.time && toMin(e.time) >= 720 && toMin(e.time) < 1080) },
      { k: 'Noite', icon: 'moon', items: evs.filter((e) => e.time && toMin(e.time) >= 1080) },
      { k: 'Sem horário', icon: 'clock', items: evs.filter((e) => !e.time) },
    ];
    const now = nowMin();
    const emFoco = !atras.length && date === today && alvo ? alvo.id : ''; // já está no cartão de cima: não repete
    let nowPlaced = date !== today;
    groups.forEach((g) => { g.items = g.items.filter((e) => e.status !== 'feito' && e.id !== emFoco); });
    const feitos = evs.filter((e) => e.status === 'feito');
    timeline = groups.filter((g) => g.items.length).map((g) => `
      <div class="tl-group">
        <h3 class="tl-group__h tl-group__h--txt">${g.k}</h3>
        ${g.items.map((e) => {
          let line = '';
          if (!nowPlaced && e.time && toMin(e.time) > now) {
            nowPlaced = true;
            line = `<div class="nowline"><span>Agora · ${fmtTime(`${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`)}</span></div>`;
          }
          return line + (alvo && e.id === alvo.id ? `<div class="tl-next">${eventCard(e, { highlight: flagged })}</div>` : eventCard(e, { highlight: flagged }));
        }).join('')}
      </div>`).join('');
    if (!timeline && evs.length > feitos.length) timeline = '<p class="agfim">Depois disso, seu dia está livre.</p>';
    if (feitos.length) timeline += `<button class="dobra" data-action="ui-toggle" data-k="showFeitos" aria-expanded="${!!ui.showFeitos}"><span class="dobra__ok">${icon('check', 14)}</span><b>${feitos.length} ${feitos.length === 1 ? 'concluído' : 'concluídos'}</b>${icon('down', 16)}</button>${ui.showFeitos ? feitos.map((e) => eventCard(e)).join('') : ''}`;
    if (false) timeline += `<div class="nowline nowline--end"><span>Agora · ${fmtTime(`${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`)} · fim da agenda</span></div>`;
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

  // equipe: quem está como hoje, numa linha pequena no título da agenda
  const teamRow = store.team.length > 1 ? `<span class="agteam">${dayBriefRows(date, ui.person).map((r) => {
      const left = r.total - r.done, st = !r.total ? '' : r.late ? 'is-late' : !left ? 'is-ok' : 'is-on';
      return `<span class="agteam__p ${st}" title="${esc(r.name)}: ${!r.total ? 'nada marcado' : r.late ? `${r.late} atrasada(s)` : !left ? 'fez tudo' : `${left} para fazer`}">${avatar(r.id, 20)}</span>`;
    }).join('')}</span>` : '';
  const semNada = !totalGeral; // conta nova: só o Foco (sem "Dia livre", dicas e bilhetes)
  return `${header}
  ${weekHtml}
  <div class="page">
    ${foco}
    ${store.demo ? demoBanner() : ''}
    <section class="block">
      <h2 class="block__title agtitle">${store.team.length < 2 ? (date === today ? 'Agenda de hoje' : 'Agenda do dia') : ui.person === 'all' ? `Agenda da ${crew()}` : 'Agenda de ' + esc(store.member(ui.person)?.name || '')}</h2>
      ${personSwitch()}
      ${timeline}
    </section>
    ${semNada ? '' : `<section class="block mais"><button class="dobra dobra--mais" data-action="ui-toggle" data-k="showMais" aria-expanded="${!!ui.showMais}"><b>Mais do dia</b><small>${[store.team.length > 1 ? 'equipe' : '', 'dicas', notes.length ? `${notes.length} ${notes.length === 1 ? 'bilhete' : 'bilhetes'}` : 'bilhetes'].filter(Boolean).join(' · ')}</small>${warnCount ? `<em>${warnCount}</em>` : ''}${icon('down', 18)}</button></section>
    ${ui.showMais ? `${team}${teamBoardCard()}${tips}${notesHtml}` : ''}`}
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
  </header>
  <div class="page">
    <div class="chips-scroll">
      <button class="chip${!ui.monthCompany ? ' is-on' : ''}" data-action="month-company" data-id="">${todos()}</button>
      ${companies.map((c) => `<button class="chip chip--co${ui.monthCompany === c.id ? ' is-on' : ''}" style="--cc:${c.color}" data-action="month-company" data-id="${c.id}">${logo(c, 18, 5)}${esc(c.name)}</button>`).join('')}
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

    ${personSwitch()}
    <section class="block">
      <div class="block__row">
        <h2 class="block__title">${esc(dayLabel(sel))}</h2>
        <button class="btn-text btn-text--sm" data-action="open-day" data-k="${sel}">Abrir dia ${icon('right', 14)}</button>
      </div>
      ${selEvents.length ? selEvents.map((e) => eventCard(e)).join('')
        : emptyState('Nada neste dia', 'Toque no + para agendar.', `<button class="btn btn--soft" data-action="new-event" data-date="${sel}">${icon('plus', 16)} Novo evento</button>`)}
    </section>

    <section class="block"><h2 class="block__title">Resumo do mês</h2>
    <div class="mstats">
      ${isMarketing() ? `<div><b>${posts}</b><span>posts</span></div>
      <div><b>${shoots}</b><span>captações</span></div>` : `<div><b>${monthEvs.length}</b><span>compromissos</span></div>
      <div><b>${monthEvs.filter((e) => TYPES[e.type]?.onSite).length}</b><span>fora de casa</span></div>`}
      ${isMarketing() ? `<div><b>${meetings}</b><span>reuniões</span></div>` : `<div><b>${monthEvs.filter((e) => e.status === 'pendente' && e.date < todayKey()).length}</b><span>atrasados</span></div>`}
      <div><b>${monthEvs.filter((e) => e.status === 'feito').length}/${monthEvs.length}</b><span>concluídos</span></div>
    </div>
    </section>
}
  </div>`;
}

function companyBars(evs) {
  const byC = {};
  evs.forEach((e) => (byC[e.companyId] = (byC[e.companyId] || 0) + 1));
  return Object.entries(byC).slice(0, 4).map(([id]) => `<i style="background:${store.company(id)?.color || '#999'}"></i>`).join('');
}

/* o que ficou pra trás, com nome — um toque abre a lista com Feito / Pra hoje */
function atrasCard() {
  const L = itensAtrasados();
  if (!L.length) return '';
  const nomes = L.slice(0, 3).map((x) => `<li>${esc(x.title)}<small>${diffDays(x.date, todayKey()) <= 1 ? 'ontem' : `há ${diffDays(x.date, todayKey())} dias`}</small></li>`).join('');
  return `<button class="atrcard" data-action="atrasados">
    <span class="atrcard__ic">${icon('alert', 18)}</span>
    <span class="atrcard__body"><b>${L.length === 1 ? '1 coisa ficou pra trás' : `${L.length} coisas ficaram pra trás`}</b><ul>${nomes}</ul>${L.length > 3 ? `<small class="atrcard__mais">e mais ${L.length - 3}</small>` : ''}</span>
    <span class="atrcard__go">Resolver ${icon('right', 14)}</span>
  </button>`;
}
