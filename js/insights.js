/* Dicas e alertas do dia (usa o motor do assistente em planner.js) */
import { store } from './store.js';
import { TYPES, isPost, durationOf, GENERAL_TIPS, WORK } from './constants.js';
import { toMin, fromMin, nowMin, todayKey, addDays, diffDays, fmtTime, fmtDuration } from './utils.js';
import { spanOf, evLabel, fixesFor, routine, freeTime } from './planner.js';

const overlaps = (a, b) => a && b && a[0] < b[1] && b[0] < a[1];
const nameOf = (id) => store.member(id)?.name || id;
const isOnSite = (e) => !!TYPES[e.type]?.onSite || ['shoot', 'meeting'].includes(TYPES[e.type]?.kind);

/* Conflitos de uma pessoa num dia */
export function personConflicts(personId, date) {
  const out = [];
  const r = routine();
  const evs = store.eventsOn(date, { person: personId }).filter((e) => e.time && e.status !== 'feito');
  for (let i = 0; i < evs.length; i++) {
    for (let j = i + 1; j < evs.length; j++) {
      const a = evs[i], b = evs[j];
      if (!overlaps(spanOf(a), spanOf(b))) continue;
      const block = isOnSite(a) ? a : isOnSite(b) ? b : null;
      const other = block === a ? b : a;
      let title, text;
      if (block && isPost(other.type)) {
        title = `${nameOf(personId)}: post durante ${TYPES[block.type].label.toLowerCase()}`;
        text = `“${evLabel(other)}” às ${fmtTime(other.time)} cai no meio de “${evLabel(block)}” (${fmtTime(block.time)}–${fmtTime(fromMin(spanOf(block)[1]))}).`;
      } else if (block && isOnSite(other)) {
        title = `${nameOf(personId)} em dois lugares ao mesmo tempo`;
        text = `“${evLabel(a)}” (${fmtTime(a.time)}) e “${evLabel(b)}” (${fmtTime(b.time)}) se sobrepõem.`;
      } else {
        title = `${nameOf(personId)}: duas tarefas no mesmo horário`;
        text = `“${evLabel(a)}” (${fmtTime(a.time)}) e “${evLabel(b)}” (${fmtTime(b.time)}).`;
      }
      out.push({ level: 'warn', kind: 'conflict', icon: 'alert', ids: [a.id, b.id], title, text, fixes: fixesFor(personId, a, b) });
    }
  }
  // deslocamento
  const onsite = evs.filter(isOnSite);
  for (let i = 0; i < onsite.length - 1; i++) {
    const a = onsite[i], b = onsite[i + 1];
    const gap = toMin(b.time) - spanOf(a)[1];
    const diffPlace = (a.location || a.companyId) !== (b.location || b.companyId);
    if (diffPlace && gap >= 0 && gap < r.travelMin) {
      out.push({
        level: 'warn', kind: 'conflict', icon: 'route', ids: [a.id, b.id],
        title: `${nameOf(personId)}: pouco tempo de deslocamento`,
        text: `Só ${gap} min entre “${evLabel(a)}” e “${evLabel(b)}”, em lugares diferentes (combinado: ${r.travelMin} min).`,
        fixes: [{ label: `Mover para ${fmtTime(fromMin(spanOf(a)[1] + r.travelMin))}`, eventId: b.id, patch: { time: fromMin(Math.ceil((spanOf(a)[1] + r.travelMin) / 15) * 15) } }],
      });
    }
  }
  return out;
}

/* Dicas do dia para o filtro atual */
export function dayInsights(date, person = 'all') {
  const list = [];
  const people = person === 'all' ? store.team.map((m) => m.id) : [person];
  people.forEach((p) => list.push(...personConflicts(p, date)));
  const r = routine();
  const evs = store.eventsOn(date, { person });

  // Mesma empresa com feeds muito próximos
  const byCompany = {};
  evs.filter((e) => e.time && ['feed', 'reels', 'carrossel'].includes(e.type)).forEach((e) => (byCompany[e.companyId] ||= []).push(e));
  Object.values(byCompany).forEach((arr) => {
    for (let i = 0; i < arr.length - 1; i++) {
      const gap = toMin(arr[i + 1].time) - toMin(arr[i].time);
      if (gap < 180) {
        list.push({
          level: 'info', icon: 'clock', ids: [arr[i].id, arr[i + 1].id],
          title: `${store.company(arr[i].companyId)?.name || 'Empresa'}: posts muito próximos`,
          text: `Dois posts de feed/Reels com só ${fmtDuration(gap)} de diferença. Espacem ao menos 3 h para um não “roubar” o alcance do outro.`,
        });
      }
    }
  });

  // Atrasados
  if (date === todayKey()) {
    const late = evs.filter((e) => e.time && e.status === 'pendente' && toMin(e.time) + 15 < nowMin());
    if (late.length) {
      list.unshift({
        level: 'warn', kind: 'late', icon: 'flag', ids: late.map((e) => e.id),
        title: late.length === 1 ? '1 tarefa atrasada' : `${late.length} tarefas atrasadas`,
        text: late.map((e) => `${fmtTime(e.time)} ${evLabel(e)}`).join(' · ') + '. Marque como feito ou reagende.',
      });
    }
  }

  // Sem responsável
  const orphan = evs.filter((e) => !(e.assignees || []).length);
  if (orphan.length && person === 'all') {
    list.push({
      level: 'warn', icon: 'user', ids: orphan.map((e) => e.id),
      title: 'Tarefa sem responsável',
      text: orphan.map((e) => `${fmtTime(e.time)} ${evLabel(e)}`).join(' · ') + '. Definam quem vai fazer.',
    });
  }

  // Tempo livre e equilíbrio (cuidado com a dupla)
  if (person === 'all' && store.team.length === 2) {
    const [a, b] = store.team;
    const ca = store.eventsOn(date, { person: a.id }).length;
    const cb = store.eventsOn(date, { person: b.id }).length;
    if (Math.abs(ca - cb) >= 4) {
      const [busy, free] = ca > cb ? [a, b] : [b, a];
      list.push({ level: 'info', icon: 'users', title: 'Dia desequilibrado', text: `${busy.name} tem ${Math.max(ca, cb)} tarefas e ${free.name} tem ${Math.min(ca, cb)}. Que tal passar alguns stories para o ${free.name}?` });
    }
  }
  people.forEach((p) => {
    const ft = freeTime(p, date);
    const count = store.eventsOn(date, { person: p }).length;
    if (!ft.dayOff && ft.minutes != null && count && ft.longest < 45) {
      list.push({ level: 'info', kind: 'rest', icon: 'clock', title: `${nameOf(p)} está sem pausa`, text: ft.longest > 0 ? `O maior intervalo livre do dia é de ${fmtDuration(ft.longest)}. Programem posts com antecedência para abrir espaço.` : 'Não sobra nenhum intervalo livre no expediente. Programem posts com antecedência para abrir espaço.' });
    }
    if (ft.dayOff && count) {
      list.push({ level: 'info', kind: 'rest', icon: 'clock', title: `${nameOf(p)}: dia de folga`, text: `Há ${count} tarefa${count > 1 ? 's' : ''} marcada${count > 1 ? 's' : ''} na folga. Posts podem ficar programados para ninguém trabalhar.` });
    }
    if (count > r.maxTasks) {
      list.push({ level: 'warn', kind: 'rest', icon: 'alert', title: `${nameOf(p)} sobrecarregado`, text: `${count} tarefas (limite combinado: ${r.maxTasks}).` });
    }
  });

  // Preparação para captação do dia seguinte
  store.eventsOn(addDays(date, 1), { person }).filter((e) => e.type === 'captacao').forEach((e) => {
    const c = store.company(e.companyId);
    list.push({
      level: 'prep', icon: 'camera', ids: [e.id],
      title: `Amanhã: captação${c ? ' na ' + c.name : ''} às ${fmtTime(e.time)}`,
      text: 'Hoje: carregue baterias, esvazie cartões de memória, confirme o horário com o cliente e defina o roteiro de tomadas.',
    });
  });

  if (!list.some((x) => x.kind === 'conflict') && evs.length) {
    list.push({ level: 'ok', icon: 'check', title: 'Agenda sem conflitos', text: 'Ninguém está em dois lugares ao mesmo tempo.' });
  }

  const tips = WORK.arch === 'marketing' ? GENERAL_TIPS : WORK.tips;
  const idx = Math.abs(diffDays('2024-01-01', date)) % tips.length;
  list.push({ level: 'tip', icon: 'bulb', title: 'Dica do dia', text: tips[idx] });
  return list;
}

/* Todos os conflitos de uma pessoa nos próximos dias (para avisar quando chegar algo novo) */
export function upcomingConflicts(personId, days = 14) {
  const out = [];
  const t = todayKey();
  for (let i = 0; i < days; i++) {
    const d = addDays(t, i);
    personConflicts(personId, d).forEach((c) => out.push({ ...c, date: d }));
  }
  return out;
}

/* Próximo compromisso (card “Próximo”) */
export function nextUp(person = 'all') {
  const t = todayKey();
  const now = nowMin();
  return store.eventsOn(t, { person }).find((e) => e.time && e.status !== 'feito' && toMin(e.time) + durationOf(e) > now) || null;
}
