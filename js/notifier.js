/* Liga a agenda ao servidor de avisos:
   - quando alguém marca/muda/conclui/remove algo, avisa o parceiro NA HORA
   - mantém no servidor a lista dos próximos lembretes (ele dispara no horário,
     mesmo com os celulares fechados) */
import { store } from './store.js';
import { api, server } from './avisos.js';
import { debounce, todayKey, addDays } from './utils.js';
import { reminderOffsets, reminderMessage, changeMessage, dailyMessage, isPostType } from '../functions/reminder-rules.js';

const nameOf = (id) => store.member(id)?.name || 'Alguém';
const coName = (id) => store.company(id)?.name || '';
const nowSP = () => {
  const d = new Date();
  return { date: todayKey(), minutes: d.getHours() * 60 + d.getMinutes() };
};
// horário de Brasília (sem horário de verão desde 2019)
const epoch = (date, time) => Date.parse(`${date}T${time}:00-03:00`);
const active = () => store.mode === 'cloud' && !!server() && !!store.me;

/* ---------- aviso imediato ao parceiro ---------- */
function notify(to, msg, tag, url = './') {
  if (!msg || !to.length) return;
  api('/notify', { to, title: msg.title, body: msg.body, tag, url }).catch((e) => console.warn('aviso ao parceiro', e.message));
}

export function onEventChange(before, after) {
  if (!active()) return;
  const ev = after || before;
  const others = store.team.map((m) => m.id).filter((id) => id !== store.me);
  others.forEach((r) => {
    const msg = changeMessage(before, after, { actor: nameOf(store.me), company: coName(ev.companyId), recipient: r, now: nowSP() });
    notify([r], msg, `ev-${ev.id}`, `./#/e/${ev.id}`);
  });
  syncSchedule();
}

export function onActivity(a) {
  if (!active()) return;
  const others = store.team.map((m) => m.id).filter((id) => id !== store.me);
  const actor = nameOf(store.me);
  let msg = null;
  if (a.kind === 'deleted' && a.events?.length) {
    const e = a.events[0];
    msg = a.events.length === 1
      ? changeMessage(e, null, { actor, company: coName(e.companyId), now: nowSP() })
      : { title: `${actor} removeu ${a.events.length} itens da agenda`, body: `${coName(e.companyId) ? coName(e.companyId) + ' · ' : ''}a partir de ${e.date.slice(8, 10)}/${e.date.slice(5, 7)}` };
  } else if (a.kind === 'series') {
    msg = { title: `${actor} adicionou ${a.count} itens repetidos`, body: `${a.label || ''}${coName(a.sample?.companyId) ? ' · ' + coName(a.sample.companyId) : ''}` };
  } else if (a.kind === 'series-edit') {
    msg = { title: `${actor} alterou ${a.count} itens repetidos`, body: `${a.label || ''}${coName(a.sample?.companyId) ? ' · ' + coName(a.sample.companyId) : ''}` };
  } else if (a.kind === 'import') {
    msg = { title: `${actor} importou a agenda`, body: `${a.count || 0} itens atualizados.` };
  }
  notify(others, msg, `act-${a.id || Date.now()}`);
  syncSchedule();
}

/* ---------- lista de lembretes para o servidor ---------- */
export function buildSchedule(now = Date.now()) {
  const items = [];
  const from = addDays(todayKey(), -1), to = addDays(todayKey(), 4);
  const evs = store.eventsBetween(from, to).filter((e) => e.time && e.status !== 'feito');
  const pendingOn = (member, date) => store.eventsOn(date, { person: member }).filter((e) => e.status !== 'feito').length;
  evs.forEach((ev) => {
    const at0 = epoch(ev.date, ev.time);
    reminderOffsets(ev).forEach((offset) => {
      if (offset < 0 && ev.status !== 'pendente') return;
      const at = at0 - offset * 60e3;
      if (at < now - 10 * 60e3 || at > now + 4 * 86400e3) return;
      const msg = reminderMessage(ev, offset, coName(ev.companyId));
      const who = ev.assignees?.length ? ev.assignees : store.team.map((m) => m.id);
      who.forEach((member) => items.push({
        id: `r_${ev.id}_${offset}_${ev.date}${ev.time.replace(':', '')}_${member}`,
        at, member, title: msg.title, body: msg.body, tag: `rem-${ev.id}`, url: `./#/e/${ev.id}`, kind: 'reminders', badge: pendingOn(member, ev.date),
      }));
    });
  });
  // resumo do dia (8h) e da véspera (20h)
  for (let i = 0; i < 4; i++) {
    const day = addDays(todayKey(), i);
    store.team.forEach((m) => {
      [['morning', day, '08:00'], ['evening', addDays(day, 1), '20:00']].forEach(([kind, target, time]) => {
        const at = epoch(day, time);
        if (at < now - 10 * 60e3) return;
        const mine = store.eventsOn(target, { person: m.id }).filter((e) => e.status !== 'feito');
        const msg = dailyMessage(kind, m.name, mine, (e) => coName(e.companyId));
        if (msg) items.push({ id: `d_${kind}_${target}_${m.id}`, at, member: m.id, title: msg.title, body: msg.body, tag: `daily-${kind}`, url: './', kind: 'daily', badge: pendingOn(m.id, target) });
      });
    });
  }
  return items.sort((a, b) => a.at - b.at);
}

let lastSent = '';
export const syncSchedule = debounce(async () => {
  if (!active()) return;
  const items = buildSchedule();
  const sig = JSON.stringify(items.map((i) => [i.id, i.at, i.title, i.body]));
  if (sig === lastSent) return;
  try {
    await api('/schedule', { items });
    lastSent = sig;
  } catch (e) {
    console.warn('lista de lembretes', e.message);
  }
}, 3000);

export { isPostType };
