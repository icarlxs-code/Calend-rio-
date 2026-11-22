/* Placar da equipe: quem cumpriu o que marcou (agenda de trabalho compartilhada).
   Para cada pessoa, na semana (ou mês): concluídos no horário, concluídos com atraso e não feitos.
   A porcentagem de cumprimento define a posição. Tocando na pessoa, aparece a lista de cada compromisso
   com o resultado — transparente e justo, para gerar uma competição saudável.
   Só o modo Trabalho compartilhado entra aqui: o modo Pessoal de cada um continua privado. */
import { store } from '../store.js';
import { openSheet, sheetHead, avatar } from '../components.js';
import { icon } from '../icons.js';
import { esc, todayKey, addDays, fmtTime } from '../utils.js';

const GRACE = 15 * 60e3; // 15 min de tolerância conta como "no horário"
const dueOf = (e) => new Date(`${e.date}T${/^\d{2}:\d{2}$/.test(e.time || '') ? e.time : '23:59'}:00`).getTime();
const weekStart = (k) => { const d = new Date(`${k}T12:00:00`); const dow = (d.getDay() + 6) % 7; return addDays(k, -dow); }; // segunda-feira
const br = (k) => k.split('-').reverse().slice(0, 2).join('/');
const ago = (ms) => { const m = Math.round(ms / 60e3); return m < 60 ? `${m} min` : m < 1440 ? `${Math.round(m / 60)}h` : `${Math.round(m / 1440)} dia${Math.round(m / 1440) > 1 ? 's' : ''}`; };

/* resultado de um compromisso: 'ok' (no horário) · 'late' (feito com atraso) · 'miss' (não feito) · 'wait' (ainda não venceu) */
export function outcome(e, now = Date.now()) {
  const due = dueOf(e);
  if (e.status === 'feito') {
    if (!e.doneAt) return { k: 'ok', label: 'Concluído' };
    return e.doneAt <= due + GRACE ? { k: 'ok', label: 'No horário' } : { k: 'late', label: `Concluído ${ago(e.doneAt - due)} depois` };
  }
  if (now > due + GRACE) return { k: 'miss', label: 'Não feito' };
  return { k: 'wait', label: e.time ? `Às ${fmtTime(e.time)}` : 'Hoje' };
}
export function teamScores(from, to, now = Date.now()) {
  const evs = store.eventsBetween(from, to, {});
  return store.team.map((m) => {
    const mine = evs.filter((e) => (e.assignees || []).includes(m.id) && e.status !== 'cancelado');
    const rows = mine.map((e) => ({ e, o: outcome(e, now) }));
    const ok = rows.filter((r) => r.o.k === 'ok').length, late = rows.filter((r) => r.o.k === 'late').length, miss = rows.filter((r) => r.o.k === 'miss').length;
    const due = ok + late + miss;
    const pct = due ? Math.round(((ok + late * 0.5) / due) * 100) : null;
    return { m, rows, ok, late, miss, due, wait: rows.length - due, pct };
  }).sort((a, b) => (b.pct ?? -1) - (a.pct ?? -1) || b.ok - a.ok || a.miss - b.miss);
}

export function openTeamBoard() {
  let period = 'semana', open = null;
  const range = () => {
    const t = todayKey();
    if (period === 'passada') { const s = addDays(weekStart(t), -7); return [s, addDays(s, 6), `Semana de ${br(s)} a ${br(addDays(s, 6))}`]; }
    if (period === 'mes') return [`${t.slice(0, 8)}01`, t, 'Este mês'];
    const s = weekStart(t); return [s, addDays(s, 6), `Semana de ${br(s)} a ${br(addDays(s, 6))}`];
  };
  const html = () => {
    const [from, to, label] = range();
    const list = teamScores(from, to);
    const meRow = list.findIndex((x) => x.m.id === store.me);
    const lvl = (m) => (m.id === store.me && window.__lvl ? window.__lvl.level : m.level);
    const detail = (x) => `<div class="tbd__list">${x.rows.length ? x.rows.sort((a, b) => dueOf(a.e) - dueOf(b.e)).map(({ e, o }) => `<div class="tbd__it is-${o.k}">
        <span class="tbd__ic">${icon(o.k === 'ok' ? 'check' : o.k === 'late' ? 'clock' : o.k === 'miss' ? 'x' : 'dot', 14)}</span>
        <div><b>${esc(e.title || 'Compromisso')}</b><small>${esc(br(e.date))}${e.time ? ' · ' + esc(fmtTime(e.time)) : ''} · ${esc(o.label)}</small></div></div>`).join('')
      : '<p class="fhelp">Nada marcado para esta pessoa no período.</p>'}</div>`;
    return `${sheetHead('Placar da equipe')}
    <div class="page page--sheet tboard">
      <div class="seg3 tboard__seg">${[['semana', 'Esta semana'], ['passada', 'Semana passada'], ['mes', 'Este mês']].map(([k, l]) => `<button class="seg3__btn${period === k ? ' is-on' : ''}" data-period="${k}"><b>${l}</b></button>`).join('')}</div>
      <p class="tboard__sub">${esc(label)} · só compromissos de trabalho que já venceram contam</p>
      ${meRow >= 0 && list[meRow].due ? `<div class="tboard__me">${meRow === 0 ? '🏆 Você está em <b>1º lugar</b>! Continue assim.' : `Você está em <b>${meRow + 1}º</b>. ${list[0].pct - (list[meRow].pct || 0) > 0 ? `Faltam ${list[0].pct - list[meRow].pct} pontos percentuais para alcançar ${esc(list[0].m.name)}.` : 'Empatado com o 1º lugar!'}`}</div>` : ''}
      <div class="tboard__rows">${list.map((x, i) => `<div class="tbr${open === x.m.id ? ' is-open' : ''}">
        <button class="tbr__top" data-who="${esc(x.m.id)}">
          <span class="tbr__pos tbr__pos--${i < 3 && x.due ? i + 1 : 0}">${x.due ? i + 1 : '–'}</span>
          <span class="tbr__av">${avatar(x.m.id, 40)}${Number.isFinite(lvl(x.m)) ? `<i class="tbr__lv">${lvl(x.m)}</i>` : ''}</span>
          <span class="tbr__txt"><b>${esc(x.m.name)}${x.m.id === store.me ? ' <em>(você)</em>' : ''}</b>
            <span class="tbr__bar">${x.due ? `<i class="ok" style="flex:${x.ok}"></i><i class="late" style="flex:${x.late}"></i><i class="miss" style="flex:${x.miss}"></i>` : '<i class="none" style="flex:1"></i>'}</span>
            <small>${x.due ? `${x.ok} no horário · ${x.late} com atraso · ${x.miss} não ${x.miss === 1 ? 'feito' : 'feitos'}` : 'Nada vencido ainda'}${x.wait ? ` · ${x.wait} por vir` : ''}</small></span>
          <span class="tbr__pct">${x.pct === null ? '—' : `${x.pct}%`}</span>
        </button>
        ${open === x.m.id ? detail(x) : ''}
      </div>`).join('')}</div>
      <p class="fhelp">Como funciona: concluir até 15 min depois do horário conta como <b>no horário</b>; concluir mais tarde vale meio ponto; o que venceu e não foi feito conta como <b>não feito</b>. O modo Pessoal de cada um continua privado.</p>
    </div>`;
  };
  const a = openSheet({
    className: 'sheet--tall',
    html: html(),
    onMount: (x) => {
      x.el.querySelectorAll('[data-period]').forEach((b) => (b.onclick = () => { period = b.dataset.period; open = null; x.set(html()); }));
      x.el.querySelectorAll('[data-who]').forEach((b) => (b.onclick = () => { open = open === b.dataset.who ? null : b.dataset.who; x.set(html()); }));
    },
  });
  // conquistas: líder do placar e semana 100% da equipe (semana passada, já fechada)
  try {
    const s = addDays(weekStart(todayKey()), -7), last = teamScores(s, addDays(s, 6));
    const withDue = last.filter((x) => x.due >= 3);
    const top = withDue.length >= 2 && withDue[0].m.id === store.me && (withDue[0].pct ?? 0) > (withDue[1].pct ?? 0);
    const perfect = withDue.length >= 2 && withDue.every((x) => x.miss === 0 && x.late === 0);
    if (top || perfect) import('../game.js').then((g) => g.onTeamBoard({ top, perfect })).catch(() => {});
  } catch { /* ok */ }
  return a;
}

/* cartão curto na tela Hoje: "Placar da semana: você está em 2º" */
export function teamBoardCard() {
  if (store.team.length < 2) return '';
  const t = todayKey(), s = weekStart(t);
  const list = teamScores(s, addDays(s, 6));
  const i = list.findIndex((x) => x.m.id === store.me);
  const leader = list[0];
  // quantos compromissos no horário faltam para passar quem está na frente (ou para alguém te passar)
  const toPass = (me, other) => { if (!other || other.pct == null) return 0; for (let x = 1; x <= 30; x++) { const p = Math.round(((me.ok + x + me.late * 0.5) / (me.due + x)) * 100); if (p > other.pct || (p === other.pct && me.ok + x > other.ok)) return x; } return 0; };
  const nm = (x) => esc((x.m.name || '').split(' ')[0]);
  let txt;
  if (!leader || !leader.due) txt = 'A semana começou: quem cumprir primeiro sai na frente';
  else if (i === 0) { const sec = list[1]; const n = sec && sec.due ? toPass(sec, leader) : 0; txt = `Você lidera com ${leader.pct}%${n ? ` · ${nm(sec)} está a ${n} de te passar` : ' · continue assim'}`; }
  else if (i > 0 && list[i].due) { const n = toPass(list[i], list[i - 1]); txt = `Você está em ${i + 1}º (${list[i].pct}%)${n ? ` · faltam ${n} no horário para passar ${nm(list[i - 1])}` : ''}`; }
  else if (i > 0) txt = `${nm(leader)} lidera com ${leader.pct}% · conclua no horário para entrar na disputa`;
  else txt = `${nm(leader)} lidera com ${leader.pct}% cumprido`;
  // campeão da semana passada (fica 7 dias em destaque)
  const ps = addDays(s, -7), last = teamScores(ps, addDays(ps, 6)).filter((x) => x.due)[0];
  const champ = last ? `<small class="tcard__champ">${icon('crown', 11)} Campeão da semana passada: ${last.m.id === store.me ? 'você' : nm(last)} (${last.pct}%)</small>` : '';
  return `<button class="tcard" data-action="team-board">
    <span class="tcard__ic">${icon('trophy', 18)}</span>
    <span class="tcard__txt"><b>Placar da semana</b><small>${txt}</small>${champ}</span>
    <span class="tcard__avs">${list.slice(0, 3).map((x) => avatar(x.m.id, 24)).join('')}</span>${icon('right', 16, 'muted')}
  </button>`;
}
