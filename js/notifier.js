/* Liga a agenda ao servidor de avisos:
   - quando alguém marca/muda/conclui/remove algo, avisa o parceiro NA HORA
   - mantém no servidor a lista dos próximos lembretes (ele dispara no horário,
     mesmo com os celulares fechados) */
import { semNome, avisoRemedio, tituloSeguro } from '../functions/remedio.js';
import { piadaFixa } from './humor.js';
import { folga } from './habito.js';
import { store } from './store.js';
import { WORK } from './constants.js';
import { api, server } from './avisos.js';
import { debounce, todayKey, addDays } from './utils.js';
import { reminderOffsets, reminderMessage, lateReminders, changeMessage, dailyMessage, isPostType, TYPE_LABEL as TYPE_NAME } from '../functions/reminder-rules.js';

const nameOf = (id) => store.member(id)?.name || 'Alguém';
const coName = (id) => store.company(id)?.name || '';
const nowSP = () => {
  const d = new Date();
  return { date: todayKey(), minutes: d.getHours() * 60 + d.getMinutes() };
};
// horário de Brasília (sem horário de verão desde 2019)
const epoch = (date, time) => new Date(`${date}T${time}:00`).getTime();
const active = () => store.mode === 'cloud' && !!server() && !!store.me;

/* ---------- aviso imediato (parceiro e o próprio celular) ---------- */
let onResult = null;
export const setNotifyFeedback = (fn) => (onResult = fn);
/* Empresa com dono das notificações (ex.: Garcia Hortifruti → só o Henrique) */
const onlyFor = (companyId) => store.company(companyId)?.notifyOnly || null;
const allowedFor = (member, companyId) => { const o = onlyFor(companyId); return !o || o === member; };
function notify(to, msg, tag, url = './', includeSelf = false) {
  if (!msg || !to.length) return Promise.resolve(null);
  return api('/notify', { to, title: msg.title, body: msg.body, tag, url, includeSelf })
    .catch((e) => {
      console.warn('aviso', e.message);
      return { error: e.message };
    });
}
const whenText = (e) => {
  const t = todayKey();
  const day = e.date === t ? 'hoje' : e.date === addDays(t, 1) ? 'amanhã' : `${e.date.slice(8, 10)}/${e.date.slice(5, 7)}`;
  return `${day}${e.time ? ', ' + e.time.replace(':00', 'h').replace(':', 'h').replace(/^0/, '') : ''}`;
};

export function onEventChange(before0, after0) {
  if (!active()) return;
  const before = semNome(before0), after = semNome(after0);
  const ev = after || before;
  const what = `${TYPE_NAME[ev.type] || 'Tarefa'}${coName(ev.companyId) ? ' · ' + coName(ev.companyId) : ''}`;
  const who = (ev.assignees || []).map(nameOf).join(' e ') || 'sem responsável';
  // qualquer mudança vira aviso (as pequenas, como legenda ou título, também)
  const generic = (actor) => ({ title: `${actor} alterou: ${what}`, body: `${whenText(ev)}${ev.title ? ' · ' + ev.title : ''} · ${who}` });
  // "Avisar o parceiro" desligado no evento: o outro só recebe se for responsável por ele
  const silent = (after || before).notifyPartner === false;
  const others = store.team.map((m) => m.id).filter((id) => id !== store.me && allowedFor(id, ev.companyId) && (!silent || (ev.assignees || []).includes(id)));
  const jobs = others.map((r) => {
    const cob = (e) => (e && e.title === 'Seu remédio' && !(e.assignees || []).includes(r) ? { ...e, title: 'Compromisso' } : e); // saúde é da pessoa: o parceiro vê só "Compromisso"
    const msg = changeMessage(cob(before), cob(after), { actor: nameOf(store.me), company: coName(ev.companyId), recipient: r, now: nowSP() }) || (ev.title === 'Seu remédio' ? { title: `${nameOf(store.me)} alterou um compromisso`, body: whenText(ev) } : generic(nameOf(store.me)));
    return notify([r], msg, `ev-${ev.id}`, `./#/e/${ev.id}`).then((d) => ({ r, d }));
  });
  // o próprio celular também recebe tudo
  let mine;
  if (!before && after) mine = { title: `Novo na agenda: ${what}`, body: `${whenText(after)}${after.title ? ' · ' + after.title : ''} · ${who}` };
  else if (before && after && (before.date !== after.date || before.time !== after.time)) mine = { title: `Horário alterado: ${what}`, body: `${whenText(before)} → ${whenText(after)} · ${who}` };
  else mine = changeMessage(before, after, { actor: 'Você', company: coName(ev.companyId), recipient: null, now: nowSP() }) || generic('Você');
  // quem acabou de fazer a mudança já viu na tela: o próprio celular não apita por isso
  if (document.hidden && mine && allowedFor(store.me, ev.companyId)) notify([store.me], mine, `ev-${ev.id}`, after ? `./#/e/${ev.id}` : './', true);
  if (jobs.length && onResult) {
    Promise.all(jobs).then((list) => {
      const missing = list.filter((x) => x.d && !x.d.error && x.d.results && !x.d.results[x.r]).map((x) => nameOf(x.r));
      const failed = list.find((x) => x.d && x.d.error);
      const ok = list.filter((x) => x.d && x.d.results && x.d.results[x.r]).map((x) => nameOf(x.r));
      onResult({ ok, missing, error: failed?.d.error });
    });
  }
  syncSchedule();
}

/* bilhete novo: quem foi marcado recebe "fulano marcou você"; sem marcação, a dupla/equipe toda recebe */
export function onNoteAdded(n) {
  if (!active() || !n) return;
  const me = nameOf(store.me);
  const team = store.team.map((m) => m.id).filter((id) => id !== store.me);
  const marked = (n.mentions || []).filter((id) => team.includes(id));
  const day = n.date === todayKey() ? 'hoje' : `${n.date.slice(8, 10)}/${n.date.slice(5, 7)}`;
  const body = n.text.length > 140 ? n.text.slice(0, 137) + '…' : n.text;
  if (marked.length) notify(marked, { title: `${me} marcou você num bilhete (${day})`, body }, `note-${n.id}`, './');
  const rest = team.filter((id) => !marked.includes(id));
  if (rest.length) notify(rest, { title: `Bilhete de ${me} (${day})`, body }, `note-${n.id}`, './');
}

export function onActivity(a) {
  if (!active()) return;
  const co = a.sample?.companyId || a.events?.[0]?.companyId;
  const others = a.notifyPartner === false ? [] : store.team.map((m) => m.id).filter((id) => id !== store.me && allowedFor(id, co));
  const actor = nameOf(store.me);
  let msg = null;
  if (a.kind === 'deleted' && a.events?.length) {
    const e = semNome(a.events[0]);
    msg = a.events.length === 1
      ? changeMessage(e, null, { actor, company: coName(e.companyId), now: nowSP() })
      : { title: `${actor} removeu ${a.count || a.events.length} itens da agenda`, body: `${coName(e.companyId) ? coName(e.companyId) + ' · ' : ''}a partir de ${e.date.slice(8, 10)}/${e.date.slice(5, 7)}` };
  } else if (a.kind === 'restored') {
    msg = { title: `${actor} restaurou ${a.count === 1 ? 'um item' : `${a.count} itens`} da agenda`, body: a.events?.[0] ? `${coName(a.events[0].companyId) ? coName(a.events[0].companyId) + ' · ' : ''}a partir de ${a.events[0].date.slice(8, 10)}/${a.events[0].date.slice(5, 7)}` : '' };
  } else if (a.kind === 'series') {
    msg = { title: `${actor} adicionou ${a.count} itens repetidos`, body: `${tituloSeguro({ title: a.label || '' })}${coName(a.sample?.companyId) ? ' · ' + coName(a.sample.companyId) : ''}` };
  } else if (a.kind === 'series-edit') {
    msg = { title: `${actor} alterou ${a.count} itens repetidos`, body: `${a.label || ''}${coName(a.sample?.companyId) ? ' · ' + coName(a.sample.companyId) : ''}` };
  } else if (a.kind === 'import') {
    msg = { title: `${actor} importou a agenda`, body: `${a.count || 0} itens atualizados.` };
  }
  notify([...others, ...(document.hidden && allowedFor(store.me, co) ? [store.me] : [])], msg, `act-${a.id || Date.now()}`, './', true);
  syncSchedule();
}

/* Personalização de cada pessoa (calculada pela ficha e guardada no espaço) */
export const personaOf = (member) => store.state.settings.find((x) => x.id === `persona-${member}`) || null;

/* ---------- lista de lembretes para o servidor ---------- */
export function buildSchedule(now = Date.now()) {
  const items = [];
  const from = addDays(todayKey(), -1), to = addDays(todayKey(), 4);
  const evs = store.eventsBetween(from, to).filter((e) => e.time && e.status !== 'feito').map(semNome);
  const pendingOn = (member, date) => store.eventsOn(date, { person: member }).filter((e) => e.status !== 'feito').length;
  evs.forEach((ev) => {
    const at0 = epoch(ev.date, ev.time);
    // lembretes de cada pessoa seguem a ficha dela (quantos avisos e quanto antes)
    const memberOffsets = (member) => reminderOffsets(ev, personaOf(member));
    const allOffsets = [...new Set(store.team.flatMap((m) => memberOffsets(m.id)))];
    allOffsets.forEach((offset) => {
      if (offset < 0 && ev.status !== 'pendente') return;
      const at = at0 - offset * 60e3;
      if (at < now - 10 * 60e3 || at > now + 4 * 86400e3) return;
      const rem = ev.title === 'Seu remédio', msg = rem ? avisoRemedio(offset > 0 ? (offset >= 60 ? 'm60' : offset >= 30 ? 'm30' : 'm20') : 'm0') : reminderMessage(ev, offset, coName(ev.companyId));
      if (rem && offset > 0 && ![20, 30, 60].includes(offset)) msg.title = '💊 Remédio mais tarde';
      // com 60 minutos ou menos, o texto ganha a voz do Lembra (o título continua dizendo o essencial)
      if (!rem && offset > 0 && offset <= 60) { const p = piadaFixa(ev.title, 'a', `${ev.id}|${offset}|${ev.date}`); if (p) msg.body = `${ev.title ? `“${ev.title}”` : ''}${ev.location ? ` · ${ev.location}` : ''}${ev.title || ev.location ? ' · ' : ''}${p}`; }
      const resp = (ev.assignees || []).map(nameOf).join(' e ');
      store.team.map((m) => m.id).filter((member) => (!rem || (ev.assignees || []).includes(member) || (!(ev.assignees || []).length && member === ev.createdBy)) && memberOffsets(member).includes(offset) && allowedFor(member, ev.companyId) && (ev.notifyPartner !== false || member === ev.createdBy || (ev.assignees || []).includes(member))).forEach((member) => items.push({
        id: `r_${ev.id}_${offset}_${ev.date}${ev.time.replace(':', '')}_${member}`,
        at, member, title: msg.title, body: resp && !(ev.assignees.length === 1 && ev.assignees[0] === member) ? `${msg.body} · ${resp}` : msg.body, tag: `rem-${ev.id}`, url: `./#/e/${ev.id}`, kind: 'reminders', badge: pendingOn(member, ev.date),
      }));
    });
    // atrasado: cobrança a cada 10 min (só para quem é responsável) até marcar como feito — recurso do plano Profissional
    const essencial = store.solo && store.billing?.plan === 'monthly' && store.billing?.tier === 'essencial';
    if (ev.status === 'pendente' && !essencial) {
      const owner = onlyFor(ev.companyId);
      const who = owner ? [owner] : (ev.assignees || []).length ? ev.assignees : [ev.createdBy || store.me].filter(Boolean);
      who.forEach((member) => lateReminders(ev, at0 + folga(ev.type) * 60e3, coName(ev.companyId), personaOf(member), { clientLike: WORK.clientLike }).forEach((r, k) => {
        // a primeira cobrança é sempre leve; o tom escolhido na ficha vale das próximas em diante
        if (ev.title === 'Seu remédio') Object.assign(r, avisoRemedio('after'));
        else if (k === 0) { const p = piadaFixa(ev.title, 't', `${ev.id}|${ev.date}`); if (p) r.body = `${ev.title ? ev.title + '. ' : ''}${p}`; }
        if (r.at < now - 10 * 60e3 || r.at > now + 4 * 86400e3) return;
        items.push({
          id: `l_${ev.id}_${r.late}_${ev.date}${ev.time.replace(':', '')}_${member}`,
          at: r.at, member, title: r.title, body: r.body, tag: `late-${ev.id}`, url: `./#/e/${ev.id}`, kind: 'reminders', badge: pendingOn(member, ev.date),
        });
      }));
    }
  });
  // resumo do dia (8h) e da véspera (20h)
  for (let i = 0; i < 4; i++) {
    const day = addDays(todayKey(), i);
    store.team.forEach((m) => {
      [['morning', day, '08:00'], ['evening', addDays(day, 1), '20:00']].forEach(([kind, target, time]) => {
        const at = epoch(day, time);
        if (at < now - 10 * 60e3) return;
        const mine = store.eventsOn(target, { person: m.id }).filter((e) => e.status !== 'feito').map(semNome);
        const msg = dailyMessage(kind, m.name, mine, (e) => coName(e.companyId));
        if (msg) items.push({ id: `d_${kind}_${target}_${m.id}`, at, member: m.id, title: msg.title, body: msg.body, tag: `daily-${kind}`, url: './', kind: 'daily', badge: pendingOn(m.id, target) });
      });
    });
  }
  return esperto(items);
}

/* Avisos espertos: insistem quando importa e calam quando já disseram.
   1) atraso: as 2 primeiras cobranças vêm no ritmo da pessoa; depois o intervalo dobra, no máximo 5 por compromisso;
   2) dois ou mais lembretes da mesma pessoa no mesmo minuto viram um aviso só;
   3) lembrete "daqui a pouco" colado no de "agora" (menos de 5 min) não sai duas vezes. */
export function esperto(items) {
  const out = [], porEv = {};
  const ord = [...items].sort((a, b) => a.at - b.at);
  for (const it of ord) {
    if (/^late-/.test(it.tag || '')) {
      const k = it.member + it.tag, s = porEv[k] || (porEv[k] = { n: 0, ult: 0, vao: 0 });
      if (s.n >= 5) continue;
      if (s.n >= 2 && it.at - s.ult < s.vao * 2 - 60e3) continue;
      if (s.n >= 1) s.vao = it.at - s.ult;
      s.n++; s.ult = it.at;
    }
    if (/^rem-/.test(it.tag || '')) {
      const antes = out.find((x) => x.member === it.member && x.tag === it.tag && it.at - x.at > 0 && it.at - x.at < 5 * 60e3);
      if (antes) out.splice(out.indexOf(antes), 1);
      const junto = out.find((x) => x.member === it.member && /^rem-/.test(x.tag || '') && x.tag !== it.tag && x.at === it.at);
      if (junto) {
        junto.juntos = [...(junto.juntos || [junto.title]), it.title];
        junto.title = `${junto.juntos.length} compromissos ao mesmo tempo`;
        junto.body = junto.juntos.map((t) => t.replace(/^Daqui a ([^:]+): /, '')).join(' · ').slice(0, 170);
        junto.url = './';
        junto.id += '+' + it.id.slice(2, 18);
        continue;
      }
    }
    out.push({ ...it });
  }
  return out.map(({ juntos, ...x }) => x);
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
