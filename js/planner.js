/* Assistente de agenda (roda no próprio app, sem internet e sem chave):
   conflitos, horários livres, tempo livre de cada um e correções automáticas. */
import { store } from './store.js';
import { TYPES, isPost, durationOf } from './constants.js';
import { toMin, fromMin, nowMin, todayKey, fromKey, fmtTime, fmtDuration, WEEKDAYS } from './utils.js';

export const DEFAULT_ROUTINE = {
  workStart: '08:00',
  workEnd: '19:00',
  lunchStart: '12:00',
  lunchEnd: '13:00',
  daysOff: [0], // domingo
  travelMin: 45,
  maxTasks: 8,
};
export const routine = () => ({ ...DEFAULT_ROUTINE, ...(store.state.settings.find((s) => s.id === 'routine') || {}) });

/* ---------- intervalos ---------- */
export const spanOf = (e) => {
  const s = toMin(e.time);
  if (s == null) return null;
  return [s, s + durationOf(e)];
};
const overlaps = (a, b) => a && b && a[0] < b[1] && b[0] < a[1];
const isOnSite = (e) => ['shoot', 'meeting'].includes(TYPES[e.type]?.kind);
const isLong = (e) => !isPost(e.type);
const coName = (e) => store.company(e.companyId)?.name || '';
export const evLabel = (e) => `${TYPES[e.type]?.label || 'Evento'}${coName(e) ? ' · ' + coName(e) : ''}`;
const nameOf = (id) => store.member(id)?.name || '—';
const rangeText = (e) => (isPost(e.type) && !e.duration ? `às ${fmtTime(e.time)}` : `das ${fmtTime(e.time)} às ${fmtTime(fromMin(spanOf(e)[1]))}`);
const samePlace = (a, b) => (a.location || a.companyId) === (b.location || b.companyId);

/* compromissos ativos de uma pessoa num dia (exceto um id) */
const busyOf = (person, date, excludeId) =>
  store.state.events.filter((e) => e.date === date && e.id !== excludeId && e.time && e.status !== 'feito' && (e.assignees || []).includes(person));

/* ======================== VALIDAÇÃO DE UMA MARCAÇÃO ======================== */
/* level: block (marcação em cima de outra) · warn (atenção) · info (contexto) */
export function validateDraft(d, { isNew = false } = {}) {
  const out = [];
  if (!d.date) return out;
  const r = routine();
  const range = d.time ? [toMin(d.time), toMin(d.time) + durationOf(d)] : null;
  const people = d.assignees || [];

  if (range) {
    // 1) Pessoa já ocupada nesse horário
    people.forEach((p) => {
      busyOf(p, d.date, d.id).forEach((e) => {
        if (!overlaps(range, spanOf(e))) return;
        const soft = isPost(d.type) !== isPost(e.type) && (isPost(d.type) || isPost(e.type));
        out.push({
          level: 'block', code: 'overlap', person: p, eventIds: [e.id],
          title: `${nameOf(p)} já tem compromisso nesse horário`,
          text: `${evLabel(e)} ${rangeText(e)}${e.createdBy ? ` (marcado por ${e.createdBy === store.me ? 'você' : nameOf(e.createdBy)})` : ''}.` +
            (soft ? ' Se for manter, deixe o post programado antes.' : ''),
        });
      });
    });

    // 2) Provável duplicado (mesma empresa, mesmo tipo, mesmo dia, horário parecido)
    store.state.events
      .filter((e) => e.id !== d.id && e.date === d.date && e.companyId === d.companyId && e.type === d.type && e.time && Math.abs(toMin(e.time) - range[0]) <= 30)
      .forEach((e) => {
        if (out.some((o) => o.eventIds?.includes(e.id))) return;
        out.push({
          level: 'block', code: 'duplicate', eventIds: [e.id],
          title: 'Parece que isso já foi marcado',
          text: `Já existe ${evLabel(e)} ${rangeText(e)}, com ${(e.assignees || []).map(nameOf).join(' e ') || 'ninguém'}${e.createdBy ? `, marcado por ${e.createdBy === store.me ? 'você' : nameOf(e.createdBy)}` : ''}.`,
        });
      });

    // 3) Deslocamento entre compromissos externos
    if (isOnSite(d)) {
      people.forEach((p) => {
        busyOf(p, d.date, d.id).filter(isOnSite).forEach((e) => {
          const s = spanOf(e);
          const gap = range[0] >= s[1] ? range[0] - s[1] : s[0] >= range[1] ? s[0] - range[1] : -1;
          if (gap >= 0 && gap < r.travelMin && !samePlace(d, e)) {
            out.push({
              level: 'warn', code: 'travel', person: p, eventIds: [e.id],
              title: `Pouco tempo de deslocamento para ${nameOf(p)}`,
              text: `Só ${gap} min entre isto e ${evLabel(e)} (${fmtTime(e.time)}). O combinado é ${r.travelMin} min.`,
            });
          }
        });
      });
    }

    // 4) Expediente e almoço (tempo livre)
    const ws = toMin(r.workStart), we = toMin(r.workEnd);
    if (isLong(d) && (range[0] < ws || range[1] > we)) {
      out.push({ level: 'warn', code: 'hours', title: 'Fora do expediente', text: `O horário de trabalho de vocês é das ${fmtTime(r.workStart)} às ${fmtTime(r.workEnd)}. Preservar o tempo livre evita esgotamento.` });
    } else if (isPost(d.type) && (range[0] < ws || range[0] >= we)) {
      out.push({ level: 'info', code: 'hours', title: 'Post fora do expediente', text: 'Deixe programado no Meta Business Suite para ninguém precisar parar o descanso para postar.' });
    }
    if (isLong(d) && overlaps(range, [toMin(r.lunchStart), toMin(r.lunchEnd)])) {
      out.push({ level: 'warn', code: 'lunch', title: 'Invade o almoço', text: `O almoço de vocês é das ${fmtTime(r.lunchStart)} às ${fmtTime(r.lunchEnd)}.` });
    }
    if (range[1] > 1440) out.push({ level: 'warn', code: 'midnight', title: 'Passa da meia-noite', text: 'Confira a duração.' });

    // 5) Horário que já passou
    if (isNew && (d.date < todayKey() || (d.date === todayKey() && range[0] < nowMin() - 5))) {
      out.push({ level: 'warn', code: 'past', title: 'Esse horário já passou', text: 'Confira o dia e a hora.' });
    }

    // 6) Mesma empresa com feed/Reels muito perto
    if (['feed', 'reels', 'carrossel'].includes(d.type)) {
      store.state.events
        .filter((e) => e.id !== d.id && e.date === d.date && e.companyId === d.companyId && ['feed', 'reels', 'carrossel'].includes(e.type) && e.time)
        .forEach((e) => {
          const gap = Math.abs(toMin(e.time) - range[0]);
          if (gap > 30 && gap < 180) out.push({ level: 'warn', code: 'spacing', eventIds: [e.id], title: 'Posts da mesma empresa muito próximos', text: `${evLabel(e)} às ${fmtTime(e.time)}. Espacem pelo menos 3 h.` });
        });
    }

    // 7) O que o parceiro está fazendo nesse horário (contexto)
    store.team.filter((m) => !people.includes(m.id)).forEach((m) => {
      busyOf(m.id, d.date, d.id).filter((e) => overlaps(range, spanOf(e))).forEach((e) => {
        out.push({ level: 'info', code: 'partner', person: m.id, eventIds: [e.id], title: `${m.name} nesse horário`, text: `${evLabel(e)} ${rangeText(e)}${e.location ? ' · ' + e.location : ''}.` });
      });
    });
  }

  // 8) Folga e sobrecarga
  const wd = fromKey(d.date).getDay();
  if (r.daysOff.includes(wd) && !isPost(d.type)) {
    out.push({ level: 'warn', code: 'dayoff', title: `${WEEKDAYS[wd]} é dia de folga`, text: 'Se der, mude para um dia útil. Posts podem ficar programados.' });
  }
  people.forEach((p) => {
    const count = store.state.events.filter((e) => e.date === d.date && e.id !== d.id && (e.assignees || []).includes(p)).length + 1;
    if (count > r.maxTasks) out.push({ level: 'warn', code: 'load', person: p, title: `${nameOf(p)} ficaria sobrecarregado`, text: `${count} tarefas nesse dia (limite combinado: ${r.maxTasks}).` });
  });
  return out;
}

/* ======================== HORÁRIOS LIVRES ======================== */
/* Retorna os melhores horários livres para o rascunho, considerando os responsáveis,
   o expediente, o almoço, o deslocamento e os horários de pico do tipo de post. */
export function bestSlots(d, { limit = 3, people = null } = {}) {
  if (!d.date) return [];
  const r = routine();
  const who = people || (d.assignees?.length ? d.assignees : []);
  const dur = durationOf(d);
  const post = isPost(d.type);
  const from = post ? 7 * 60 : toMin(r.workStart);
  const to = post ? 22 * 60 : toMin(r.workEnd);
  const lunch = [toMin(r.lunchStart), toMin(r.lunchEnd)];
  const best = (TYPES[d.type]?.best || []).map(toMin);
  const minStart = d.date === todayKey() ? Math.ceil((nowMin() + 15) / 15) * 15 : 0;
  // horários de posts iguais da mesma empresa (evita sugerir duplicado ou post colado)
  const sameCo = store.state.events
    .filter((e) => e.id !== d.id && e.date === d.date && e.companyId && e.companyId === d.companyId && e.time && (e.type === d.type || (post && isPost(e.type) && e.type !== 'story' && d.type !== 'story')))
    .map((e) => ({ t: toMin(e.time), gap: e.type === d.type && d.type === 'story' ? 45 : e.type === d.type ? 180 : 120 }));
  const cands = [];
  for (let t = Math.max(from, minStart); t + dur <= to; t += 15) {
    const range = [t, t + dur];
    if (!post && overlaps(range, lunch)) continue;
    if (sameCo.some((x) => Math.abs(x.t - t) < x.gap)) continue;
    const clash = who.some((p) =>
      busyOf(p, d.date, d.id).some((e) => {
        const s = spanOf(e);
        if (overlaps(range, s)) return true;
        if (isOnSite(d) && isOnSite(e) && !samePlace(d, e)) {
          return overlaps([range[0] - r.travelMin, range[1] + r.travelMin], s);
        }
        return false;
      }));
    if (clash) continue;
    const dist = best.length ? Math.min(...best.map((b) => Math.abs(b - t))) : Math.abs(t - toMin(r.workStart) - 60);
    cands.push({ time: fromMin(t), score: dist });
  }
  cands.sort((a, b) => a.score - b.score);
  const picked = [];
  for (const c of cands) {
    if (picked.every((p) => Math.abs(toMin(p.time) - toMin(c.time)) >= 60)) picked.push(c);
    if (picked.length >= limit) break;
  }
  return picked.sort((a, b) => toMin(a.time) - toMin(b.time)).map((p) => ({ ...p, peak: p.score <= 30 }));
}

/* Quem está livre no horário do rascunho (para sugerir troca de responsável) */
export function freePeople(d) {
  if (!d.time) return store.team.map((m) => m.id);
  const range = [toMin(d.time), toMin(d.time) + durationOf(d)];
  return store.team.filter((m) => !busyOf(m.id, d.date, d.id).some((e) => overlaps(range, spanOf(e)))).map((m) => m.id);
}

/* ======================== TEMPO LIVRE ======================== */
export function freeTime(person, date) {
  const r = routine();
  if (r.daysOff.includes(fromKey(date).getDay())) return { minutes: null, longest: null, dayOff: true };
  const ws = toMin(r.workStart), we = toMin(r.workEnd);
  const blocks = [[toMin(r.lunchStart), toMin(r.lunchEnd)]];
  store.eventsOn(date, { person }).filter((e) => e.time).forEach((e) => {
    const s = spanOf(e);
    blocks.push([s[0], isPost(e.type) ? s[0] + 15 : s[1] + (isOnSite(e) ? 30 : 0)]);
  });
  blocks.sort((a, b) => a[0] - b[0]);
  let cur = ws, free = 0, longest = 0;
  blocks.forEach(([s, e]) => {
    if (s >= we || e <= ws) return; // fora do expediente
    const st = Math.max(s, ws), en = Math.min(e, we);
    if (en <= cur) return;
    if (st > cur) {
      free += st - cur;
      longest = Math.max(longest, st - cur);
    }
    cur = Math.max(cur, en);
  });
  if (we > cur) {
    free += we - cur;
    longest = Math.max(longest, we - cur);
  }
  return { minutes: free, longest, dayOff: false };
}

/* ======================== CORREÇÕES PRONTAS (1 toque) ======================== */
/* Para um conflito entre dois eventos de uma pessoa, propõe soluções concretas */
export function fixesFor(person, a, b) {
  const fixes = [];
  // qual mexer: o post (se houver) ou o que foi criado por último
  const move = isPost(a.type) && !isPost(b.type) ? a : isPost(b.type) && !isPost(a.type) ? b : (a.createdAt || 0) > (b.createdAt || 0) ? a : b;
  const partner = store.team.find((m) => m.id !== person);
  if (partner && freePeople(move).includes(partner.id) && (move.assignees || []).length === 1) {
    fixes.push({ label: `Passar para ${partner.name}`, eventId: move.id, patch: { assignees: [partner.id] } });
  }
  const slot = bestSlots(move, { limit: 1 })[0];
  if (slot) fixes.push({ label: `Mover ${TYPES[move.type].label.toLowerCase()} para ${fmtTime(slot.time)}`, eventId: move.id, patch: { time: slot.time } });
  return fixes;
}

/* ======================== RESUMO DO DIA (texto do assistente) ======================== */
/* Resumo do dia em dados (para o cartão organizado): uma linha por pessoa */
export function dayBriefRows(date, person = 'all') {
  const people = person === 'all' ? store.team : store.team.filter((m) => m.id === person);
  const nowM = date === todayKey() ? nowMin() : -1;
  return people.map((m) => {
    const mine = store.eventsOn(date, { person: m.id });
    const done = mine.filter((e) => e.status === 'feito').length;
    const late = mine.filter((e) => e.status === 'pendente' && e.time && nowM >= 0 && (isPost(e.type) ? toMin(e.time) : toMin(e.time) + durationOf(e)) < nowM).length;
    const ft = freeTime(m.id, date);
    const next = mine.find((e) => e.status !== 'feito' && e.time && toMin(e.time) >= nowM);
    return {
      id: m.id, name: m.name, total: mine.length, done, late,
      free: ft.dayOff ? 'Folga' : ft.minutes == null ? null : ft.minutes < 30 ? 'Dia cheio' : `${fmtDuration(ft.minutes)} livre${ft.minutes >= 120 ? 's' : ''}`,
      busy: !ft.dayOff && ft.minutes != null && ft.minutes < 30,
      next: next ? `${fmtTime(next.time)} · ${next.title || coName(next)}` : null,
    };
  });
}
export function dayBrief(date, person = 'all') {
  const people = person === 'all' ? store.team : store.team.filter((m) => m.id === person);
  const lines = [];
  const evs = store.eventsOn(date, { person });
  if (!evs.length) return [`Nenhum compromisso${person === 'all' ? '' : ' para ' + nameOf(person)}. Bom dia para planejar a pauta ou adiantar edições.`];
  people.forEach((m) => {
    const mine = store.eventsOn(date, { person: m.id });
    const ft = freeTime(m.id, date);
    const onsite = mine.filter(isOnSite);
    const parts = [`${mine.length} tarefa${mine.length === 1 ? '' : 's'}`];
    if (onsite.length) parts.push(`sai para ${onsite.map((e) => `${coName(e)} às ${fmtTime(e.time)}`).join(' e ')}`);
    if (ft.dayOff) parts.push('é dia de folga');
    else if (ft.minutes != null) parts.push(ft.minutes >= 30 ? `${fmtDuration(ft.minutes)} livres no expediente (maior intervalo: ${fmtDuration(ft.longest)})` : 'quase sem tempo livre');
    lines.push(`${m.name}: ${parts.join(', ')}.`);
  });
  return lines;
}
