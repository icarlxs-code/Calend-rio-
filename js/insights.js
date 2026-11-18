/* Motor de dicas: conflitos, deslocamento, sobrecarga e lembretes */
import { store } from './store.js';
import { TYPES, isPost, durationOf, GENERAL_TIPS } from './constants.js';
import { toMin, fromMin, nowMin, todayKey, addDays, diffDays, fmtTime } from './utils.js';

const span = (e) => {
  const s = toMin(e.time);
  if (s == null) return null;
  return [s, s + durationOf(e)];
};
const overlaps = (a, b) => a[0] < b[1] && b[0] < a[1];
const label = (e) => {
  const c = store.company(e.companyId);
  return `${TYPES[e.type]?.label || 'Evento'}${c ? ' · ' + c.name : ''}`;
};
const nameOf = (id) => store.member(id)?.name || id;
const isOnSite = (e) => ['shoot', 'meeting'].includes(TYPES[e.type]?.kind);

/* Conflitos de UMA pessoa num dia */
function personConflicts(personId, date) {
  const out = [];
  const evs = store.eventsOn(date, { person: personId }).filter((e) => e.time && e.status !== 'feito');
  for (let i = 0; i < evs.length; i++) {
    for (let j = i + 1; j < evs.length; j++) {
      const a = evs[i], b = evs[j];
      const sa = span(a), sb = span(b);
      if (!overlaps(sa, sb)) continue;
      const block = isOnSite(a) ? a : isOnSite(b) ? b : null;
      const other = block === a ? b : a;
      if (block && isPost(other.type)) {
        const partner = store.team.find((m) => m.id !== personId);
        const partnerFree = partner && isFree(partner.id, date, span(other), other.id);
        out.push({
          level: 'warn', icon: 'alert', ids: [a.id, b.id],
          title: `${nameOf(personId)}: post durante ${TYPES[block.type].label.toLowerCase()}`,
          text: `“${label(other)}” às ${fmtTime(other.time)} cai no meio de “${label(block)}” (${fmtTime(block.time)}–${fmtTime(fromMin(span(block)[1]))}). ` +
            (partnerFree
              ? `Sugestão: deixe programado no Meta Business Suite antes de sair, ou passe para o ${partner.name}, que está livre nesse horário.`
              : 'Sugestão: deixe o post programado no Meta Business Suite antes de sair.'),
        });
      } else if (block && isOnSite(other)) {
        out.push({
          level: 'warn', icon: 'alert', ids: [a.id, b.id],
          title: `${nameOf(personId)} em dois lugares ao mesmo tempo`,
          text: `“${label(a)}” (${fmtTime(a.time)}) e “${label(b)}” (${fmtTime(b.time)}) se sobrepõem. Mude o horário ou divida entre a dupla.`,
        });
      } else if (isPost(a.type) && isPost(b.type) && Math.abs(toMin(a.time) - toMin(b.time)) < 10) {
        out.push({
          level: 'info', icon: 'clock', ids: [a.id, b.id],
          title: `${nameOf(personId)}: dois posts no mesmo horário`,
          text: `“${label(a)}” e “${label(b)}” às ${fmtTime(a.time)}. Espace em 15–30 min para revisar cada um com calma.`,
        });
      } else if (!block && (TYPES[a.type].kind === 'work' || TYPES[b.type].kind === 'work')) {
        const work = TYPES[a.type].kind === 'work' ? a : b;
        const post = work === a ? b : a;
        if (isPost(post.type)) {
          out.push({
            level: 'info', icon: 'clock', ids: [a.id, b.id],
            title: `${nameOf(personId)}: pausa na edição`,
            text: `“${label(post)}” às ${fmtTime(post.time)} interrompe “${label(work)}”. Tudo bem, só não esqueça de pausar para postar.`,
          });
        }
      }
    }
  }
  // Deslocamento entre compromissos externos
  const onsite = evs.filter(isOnSite);
  for (let i = 0; i < onsite.length - 1; i++) {
    const a = onsite[i], b = onsite[i + 1];
    const gap = toMin(b.time) - span(a)[1];
    const diffPlace = (a.location || a.companyId) !== (b.location || b.companyId);
    if (diffPlace && gap >= 0 && gap < 45) {
      out.push({
        level: 'warn', icon: 'route', ids: [a.id, b.id],
        title: `${nameOf(personId)}: pouco tempo de deslocamento`,
        text: `Só ${gap} min entre “${label(a)}” e “${label(b)}”, em lugares diferentes. O ideal é deixar ao menos 45 min.`,
      });
    }
  }
  return out;
}

function isFree(personId, date, range, excludeId = null) {
  return !store.eventsOn(date, { person: personId })
    .some((e) => e.id !== excludeId && e.time && e.status !== 'feito' && overlaps(span(e), range));
}

/* Dicas do dia para o filtro atual */
export function dayInsights(date, person = 'all') {
  const list = [];
  const people = person === 'all' ? store.team.map((m) => m.id) : [person];
  people.forEach((p) => list.push(...personConflicts(p, date)));

  const evs = store.eventsOn(date, { person });

  // Mesma empresa com feeds muito próximos
  const byCompany = {};
  evs.filter((e) => ['feed', 'reels', 'carrossel'].includes(e.type)).forEach((e) => (byCompany[e.companyId] ||= []).push(e));
  Object.values(byCompany).forEach((arr) => {
    if (arr.length < 2) return;
    for (let i = 0; i < arr.length - 1; i++) {
      const gap = toMin(arr[i + 1].time) - toMin(arr[i].time);
      if (gap < 180) {
        const c = store.company(arr[i].companyId);
        list.push({
          level: 'info', icon: 'clock', ids: [arr[i].id, arr[i + 1].id],
          title: `${c?.name || 'Empresa'}: posts muito próximos`,
          text: `Dois posts de feed/Reels com só ${Math.round(gap / 6) / 10}h de diferença. Espace ao menos 3h para um não “roubar” o alcance do outro.`,
        });
      }
    }
  });

  // Atrasados
  if (date === todayKey()) {
    const late = evs.filter((e) => e.time && e.status === 'pendente' && toMin(e.time) + 15 < nowMin());
    if (late.length) {
      list.unshift({
        level: 'warn', icon: 'flag', ids: late.map((e) => e.id),
        title: late.length === 1 ? '1 tarefa atrasada' : `${late.length} tarefas atrasadas`,
        text: late.map((e) => `${fmtTime(e.time)} ${label(e)}`).join(' · ') + '. Marque como feito ou reagende.',
      });
    }
  }

  // Sem responsável
  const orphan = evs.filter((e) => !(e.assignees || []).length);
  if (orphan.length && person === 'all') {
    list.push({
      level: 'warn', icon: 'user', ids: orphan.map((e) => e.id),
      title: 'Tarefa sem responsável',
      text: orphan.map((e) => `${fmtTime(e.time)} ${label(e)}`).join(' · ') + '. Definam quem vai fazer.',
    });
  }

  // Equilíbrio entre a dupla
  if (person === 'all' && store.team.length === 2) {
    const [a, b] = store.team;
    const ca = store.eventsOn(date, { person: a.id }).length;
    const cb = store.eventsOn(date, { person: b.id }).length;
    if (Math.abs(ca - cb) >= 4) {
      const [busy, free] = ca > cb ? [a, b] : [b, a];
      list.push({
        level: 'info', icon: 'users',
        title: 'Dia desequilibrado',
        text: `${busy.name} tem ${Math.max(ca, cb)} tarefas e ${free.name} tem ${Math.min(ca, cb)}. Que tal passar alguns stories para o ${free.name}?`,
      });
    }
  }

  // Preparação para captação do dia seguinte
  const tomorrow = addDays(date, 1);
  store.eventsOn(tomorrow, { person }).filter((e) => e.type === 'captacao').forEach((e) => {
    list.push({
      level: 'prep', icon: 'camera', ids: [e.id],
      title: `Amanhã: captação ${store.company(e.companyId)?.name ? 'na ' + store.company(e.companyId).name : ''} às ${fmtTime(e.time)}`,
      text: 'Hoje: carregue baterias, esvazie cartões de memória, confirme o horário com o cliente e defina o roteiro de tomadas.',
    });
  });

  if (!list.some((x) => x.level === 'warn') && evs.length) {
    list.push({ level: 'ok', icon: 'check', title: 'Agenda sem conflitos', text: 'Ninguém está em dois lugares ao mesmo tempo. Bom trabalho de organização!' });
  }

  // Dica geral (rodízio por dia)
  const idx = Math.abs(diffDays('2024-01-01', date)) % GENERAL_TIPS.length;
  list.push({ level: 'tip', icon: 'bulb', title: 'Dica do dia', text: GENERAL_TIPS[idx] });
  return list;
}

/* Conflitos ao editar um evento (prévia em tempo real) */
export function draftConflicts(draft) {
  if (!draft.time || !draft.date) return [];
  const range = [toMin(draft.time), toMin(draft.time) + (draft.duration || TYPES[draft.type]?.dur || 30)];
  const out = [];
  (draft.assignees || []).forEach((p) => {
    store.eventsOn(draft.date, { person: p })
      .filter((e) => e.id !== draft.id && e.time && e.status !== 'feito')
      .forEach((e) => {
        if (overlaps(range, span(e))) out.push({ person: p, event: e });
      });
  });
  return out;
}

/* Horários sugeridos que não conflitam */
export function suggestTimes(draft) {
  const best = TYPES[draft.type]?.best || [];
  return best.map((t) => {
    const range = [toMin(t), toMin(t) + (draft.duration || TYPES[draft.type]?.dur || 30)];
    const busy = (draft.assignees || []).some((p) => !isFree(p, draft.date, range, draft.id));
    return { time: t, busy };
  });
}

/* Próximo compromisso (para o card “Próximo”) */
export function nextUp(person = 'all') {
  const t = todayKey();
  const now = nowMin();
  return store.eventsOn(t, { person }).find((e) => e.time && e.status !== 'feito' && toMin(e.time) + durationOf(e) > now) || null;
}
