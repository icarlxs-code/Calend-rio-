/* Detalhe do evento e editor (criar/editar) */
import { store } from '../store.js';
import { ui } from '../ui.js';
import { TYPES, TYPE_ORDER, STATUS, STATUS_ORDER, DURATIONS, REMINDERS, REPEATS, durationOf } from '../constants.js';
import { esc, todayKey, addDays, fmtDayLong, fmtDuration, fmtTime, uid, rgba, fromKey, relDay } from '../utils.js';
import { icon } from '../icons.js';
import {
  openSheet, sheetHead, avatar, logo, typeBadge, whoText, timeRange, toast, confirmDialog, chooseDialog,
} from '../components.js';
import { draftConflicts, suggestTimes } from '../insights.js';
import { downloadICS } from '../ics.js';
import { openCompanyEditor } from './companies.js';

/* ======================== DETALHE ======================== */
export function openEventDetail(id) {
  const api = openSheet({ html: detailHtml(id), className: 'sheet--tall', onMount: (a) => mountDetail(a, id) });
  api.refresh = () => {
    if (!store.event(id)) return api.close();
    api.set(detailHtml(id));
  };
}

function detailHtml(id) {
  const e = store.event(id);
  if (!e) return '';
  const c = store.company(e.companyId);
  const color = c?.color || '#666';
  const rem = REMINDERS.find((r) => r.v === (e.reminder ?? 30));
  const series = e.seriesId ? store.state.events.filter((x) => x.seriesId === e.seriesId).length : 0;
  return `
  ${sheetHead('', { right: `<button class="btn-text" data-act="edit">Editar</button>` })}
  <div class="detail">
    <div class="detail__hero" style="--cc:${color};--cc-soft:${rgba(color, 0.12)}">
      <div class="detail__co">${logo(c, 40)}<div><strong>${esc(c?.name || 'Sem empresa')}</strong>${c?.instagram ? `<small>@${esc(c.instagram)}</small>` : ''}</div>${typeBadge(e.type, { solid: true })}</div>
      <h2>${esc(e.title || TYPES[e.type].label)}</h2>
      <p class="detail__when">${icon('calendar', 15)} ${esc(relDay(e.date))}, ${esc(fmtDayLong(e.date).split(', ')[1])} · ${icon('clock', 15)} ${esc(timeRange(e))}</p>
    </div>

    <div class="seg seg--status">
      ${STATUS_ORDER.map((s) => `<button class="seg__btn${e.status === s ? ' is-on' : ''} st-${s}" data-status="${s}">${s === 'feito' ? icon('check', 14) : ''}${STATUS[s].label}</button>`).join('')}
    </div>

    <ul class="rows">
      <li><span class="rows__k">${icon('users', 16)} Responsável</span><span class="rows__v">${(e.assignees || []).map((a) => avatar(a, 22)).join('')} ${esc(whoText(e.assignees))}</span></li>
      ${e.location ? `<li><span class="rows__k">${icon('pin', 16)} Local</span><a class="rows__v link" href="https://maps.apple.com/?q=${encodeURIComponent(e.location)}" target="_blank" rel="noopener">${esc(e.location)}</a></li>` : ''}
      ${TYPES[e.type].kind !== 'post' || e.duration ? `<li><span class="rows__k">${icon('clock', 16)} Duração</span><span class="rows__v">${esc(fmtDuration(durationOf(e)))}</span></li>` : ''}
      <li><span class="rows__k">${icon('bell', 16)} Lembrete</span><span class="rows__v">${esc(rem?.label || '—')}</span></li>
      ${series ? `<li><span class="rows__k">${icon('repeat', 16)} Repetição</span><span class="rows__v">${series} eventos na série</span></li>` : ''}
      <li><span class="rows__k">${icon(e.visibleToClient === false ? 'eyeoff' : 'eye', 16)} Cliente</span><span class="rows__v">${e.visibleToClient === false ? 'Não aparece para o cliente' : 'Aparece no calendário do cliente'}</span></li>
    </ul>

    ${e.description ? `<div class="textbox"><h4>Descrição / legenda</h4><p>${esc(e.description)}</p></div>` : ''}
    ${e.internalNote ? `<div class="textbox textbox--note"><h4>${icon('eyeoff', 13)} Nota interna (só a equipe vê)</h4><p>${esc(e.internalNote)}</p></div>` : ''}

    <div class="actions">
      <button data-act="ics">${icon('bell', 20)}<span>Lembrete no iPhone</span></button>
      <button data-act="tomorrow">${icon('right', 20)}<span>Passar p/ amanhã</span></button>
      <button data-act="dup">${icon('copy', 20)}<span>Duplicar</span></button>
      <button data-act="del" class="is-danger">${icon('trash', 20)}<span>Excluir</span></button>
    </div>
    <p class="detail__meta">Criado por ${esc(store.member(e.createdBy)?.name || '—')}${e.updatedAt ? ' · atualizado ' + new Date(e.updatedAt).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : ''}</p>
  </div>`;
}

function mountDetail(api, id) {
  const el = api.el;
  el.querySelectorAll('[data-status]').forEach((b) => (b.onclick = async () => {
    const e = store.event(id);
    await store.upsert('events', { ...e, status: b.dataset.status });
  }));
  const act = (name, fn) => {
    const b = el.querySelector(`[data-act="${name}"]`);
    if (b) b.onclick = fn;
  };
  act('edit', () => openEventEditor({ id }));
  act('dup', async () => {
    const e = store.event(id);
    const copy = { ...e, id: uid('e_'), status: 'pendente', seriesId: null, createdAt: null, createdBy: null };
    await store.upsert('events', copy);
    api.close();
    toast('Evento duplicado');
    openEventEditor({ id: copy.id });
  });
  act('tomorrow', async () => {
    const e = store.event(id);
    await store.upsert('events', { ...e, date: addDays(e.date, 1) });
    toast('Movido para ' + relDay(addDays(e.date, 1)).toLowerCase(), {
      action: 'Desfazer',
      onAction: () => store.upsert('events', { ...store.event(id), date: e.date }),
    });
  });
  act('ics', () => {
    const e = store.event(id);
    downloadICS([e], `${TYPES[e.type].label}-${e.date}.ics`, 'Pauta');
  });
  act('del', () => deleteEvent(id, api));
}

async function deleteEvent(id, api) {
  const e = store.event(id);
  let ids = [id];
  if (e.seriesId) {
    const next = store.state.events.filter((x) => x.seriesId === e.seriesId && x.date >= e.date).map((x) => x.id);
    if (next.length > 1) {
      const r = await chooseDialog({
        title: 'Excluir evento repetido',
        options: [
          { label: 'Só este', value: 'one', danger: true },
          { label: `Este e os próximos (${next.length})`, value: 'next', danger: true },
        ],
      });
      if (!r) return;
      if (r === 'next') ids = next;
    } else if (!(await confirmDialog({ title: 'Excluir este evento?', ok: 'Excluir', danger: true }))) return;
  } else if (!(await confirmDialog({ title: 'Excluir este evento?', text: 'Ele some para a dupla e para o cliente.', ok: 'Excluir', danger: true }))) return;
  const backup = ids.map((i) => ({ ...store.event(i) }));
  await store.removeMany('events', ids);
  api && api.close();
  toast(ids.length > 1 ? `${ids.length} eventos excluídos` : 'Evento excluído', {
    action: 'Desfazer',
    onAction: () => store.upsertMany('events', backup),
    ms: 4500,
  });
}

/* ======================== EDITOR ======================== */
export function openEventEditor({ id = null, date = null, companyId = null, type = null } = {}) {
  const existing = id ? store.event(id) : null;
  const companies = store.companiesSorted();
  const defType = type || 'feed';
  const draft = existing
    ? JSON.parse(JSON.stringify(existing))
    : {
        id: uid('e_'),
        type: defType,
        companyId: companyId || (ui.monthCompany || (companies.length === 1 ? companies[0].id : null)),
        title: '',
        date: date || (ui.tab === 'mes' ? ui.monthSel : ui.date) || todayKey(),
        time: TYPES[defType].best[0] || '12:00',
        duration: null,
        assignees: ui.person !== 'all' ? [ui.person] : store.me ? [store.me] : [],
        location: '',
        description: '',
        internalNote: '',
        reminder: 30,
        visibleToClient: TYPES[defType].client,
        status: 'pendente',
      };
  if (draft.date < todayKey() && !existing) draft.date = todayKey();
  const original = existing ? JSON.parse(JSON.stringify(existing)) : null;
  const rep = { mode: 'none', until: addDays(draft.date, 28) };

  const api = openSheet({
    className: 'sheet--tall',
    html: editorHtml(draft, !!existing, rep),
    onMount: (a) => mountEditor(a, draft, original, rep),
  });
  return api;
}

const needsDuration = (type) => ['shoot', 'meeting', 'work', 'other'].includes(TYPES[type].kind);
const needsLocation = (type) => ['shoot', 'meeting'].includes(TYPES[type].kind);

function editorHtml(d, editing, rep) {
  const companies = store.companiesSorted();
  return `
  ${sheetHead(editing ? 'Editar evento' : 'Novo evento', {
    left: `<button class="btn-text" data-close>Cancelar</button>`,
    right: `<button class="btn btn--primary btn--sm" data-save>Salvar</button>`,
  })}
  <form class="form" data-editor onsubmit="return false">
    <div class="fgroup">
      <label class="flabel">O que é?</label>
      <div class="typegrid">
        ${TYPE_ORDER.map((t) => `<button type="button" class="typebtn tbadge--${t}${d.type === t ? ' is-on' : ''}" data-type="${t}">${icon(TYPES[t].icon, 20)}<span>${TYPES[t].label}</span></button>`).join('')}
      </div>
    </div>

    <div class="fgroup">
      <label class="flabel">Empresa</label>
      <div class="cogrid">
        ${companies.map((c) => `<button type="button" class="cobtn${d.companyId === c.id ? ' is-on' : ''}" style="--cc:${c.color}" data-company="${c.id}">${logo(c, 26, 7)}<span>${esc(c.name)}</span></button>`).join('')}
        <button type="button" class="cobtn cobtn--add" data-newco>${icon('plus', 18)}<span>Nova empresa</span></button>
      </div>
    </div>

    <div class="fgroup">
      <label class="flabel" for="f-title">Título</label>
      <input id="f-title" class="input" name="title" value="${esc(d.title)}" placeholder="${esc(TYPES[d.type].placeholder)}" autocomplete="off" maxlength="120">
    </div>

    <div class="fgroup row2">
      <div><label class="flabel" for="f-date">Dia</label><input id="f-date" class="input" type="date" name="date" value="${d.date}" required></div>
      <div><label class="flabel" for="f-time">Horário</label><input id="f-time" class="input" type="time" name="time" value="${d.time || ''}" step="300"></div>
    </div>

    <div class="fgroup" data-when="duration" ${needsDuration(d.type) ? '' : 'hidden'}>
      <label class="flabel" for="f-dur">Duração</label>
      <select id="f-dur" class="input" name="duration">
        ${DURATIONS.map((m) => `<option value="${m}"${(d.duration || TYPES[d.type].dur) === m ? ' selected' : ''}>${fmtDuration(m)}</option>`).join('')}
      </select>
    </div>

    <div data-hint></div>

    <div class="fgroup">
      <label class="flabel">Quem vai fazer?</label>
      <div class="whogrid">
        ${store.team.map((m) => `<button type="button" class="whobtn${(d.assignees || []).includes(m.id) ? ' is-on' : ''}" style="--mc:${m.color}" data-who="${m.id}">${avatar(m.id, 30)}<span>${esc(m.name)}</span><i class="whobtn__check">${icon('check', 14)}</i></button>`).join('')}
      </div>
      <p class="fhelp">Marque os dois se forem juntos.</p>
    </div>

    <div class="fgroup" data-when="location" ${needsLocation(d.type) ? '' : 'hidden'}>
      <label class="flabel" for="f-loc">Local</label>
      <input id="f-loc" class="input" name="location" value="${esc(d.location || '')}" placeholder="Endereço ou nome do lugar" autocomplete="off">
      <button type="button" class="btn-text btn-text--sm" data-useaddr hidden>${icon('pin', 14)} Usar endereço da empresa</button>
    </div>

    <div class="fgroup">
      <label class="flabel" for="f-desc">Descrição / legenda <em class="tag">${icon('eye', 12)} cliente vê</em></label>
      <textarea id="f-desc" class="input" name="description" rows="3" placeholder="Ideia do post, legenda, roteiro…">${esc(d.description || '')}</textarea>
    </div>
    <div class="fgroup">
      <label class="flabel" for="f-note">Nota interna <em class="tag tag--note">${icon('eyeoff', 12)} só a equipe</em></label>
      <textarea id="f-note" class="input" name="internalNote" rows="2" placeholder="Equipamento, observações, combinados…">${esc(d.internalNote || '')}</textarea>
    </div>

    <div class="list">
      <label class="list__row"><span>${icon('bell', 18)} Lembrete</span>
        <select name="reminder">${REMINDERS.map((r) => `<option value="${r.v}"${(d.reminder ?? 30) === r.v ? ' selected' : ''}>${r.label}</option>`).join('')}</select>
      </label>
      ${!editing ? `<label class="list__row"><span>${icon('repeat', 18)} Repetir</span>
        <select name="repeat">${REPEATS.map((r) => `<option value="${r.v}"${rep.mode === r.v ? ' selected' : ''}>${r.label}</option>`).join('')}</select>
      </label>
      <label class="list__row" data-when="until" hidden><span>${icon('calendar', 18)} Até</span>
        <input type="date" name="until" value="${rep.until}">
      </label>` : ''}
      <label class="list__row"><span>${icon('eye', 18)} Aparece para o cliente</span>
        <input type="checkbox" class="switch" name="visibleToClient" ${d.visibleToClient !== false ? 'checked' : ''}>
      </label>
      ${editing ? `<label class="list__row"><span>${icon('check', 18)} Status</span>
        <select name="status">${STATUS_ORDER.map((s) => `<option value="${s}"${d.status === s ? ' selected' : ''}>${STATUS[s].label}</option>`).join('')}</select>
      </label>` : ''}
    </div>

    ${editing ? `<button type="button" class="btn btn--danger-soft btn--block" data-delete>${icon('trash', 18)} Excluir evento</button>` : ''}
    <div class="form__spacer"></div>
  </form>`;
}

function mountEditor(api, d, original, rep) {
  const el = api.el;
  const form = el.querySelector('[data-editor]');
  const $ = (s) => el.querySelector(s);

  const refreshHint = () => {
    const box = $('[data-hint]');
    const t = TYPES[d.type];
    const sugg = d.time !== undefined ? suggestTimes(d) : [];
    const conflicts = draftConflicts(d);
    box.innerHTML = `
      ${conflicts.length ? `<div class="warnbox">${icon('alert', 16)}<div><strong>Conflito de horário</strong>
        ${conflicts.map((cf) => `<p>${esc(store.member(cf.person)?.name)} já tem <b>${esc(TYPES[cf.event.type].label)} · ${esc(store.company(cf.event.companyId)?.name || '')}</b> às ${fmtTime(cf.event.time)}.</p>`).join('')}
      </div></div>` : ''}
      ${t.tip ? `<div class="hintbox">${icon('bulb', 16)}<div><p>${esc(t.tip)}</p>
        ${sugg.length ? `<div class="hintbox__times">${sugg.map((s) => `<button type="button" class="tchip${s.busy ? ' is-busy' : ''}${d.time === s.time ? ' is-on' : ''}" data-settime="${s.time}">${fmtTime(s.time)}${s.busy ? '<small>ocupado</small>' : ''}</button>`).join('')}</div>` : ''}
      </div></div>` : ''}`;
    box.querySelectorAll('[data-settime]').forEach((b) => (b.onclick = () => {
      d.time = b.dataset.settime;
      form.time.value = d.time;
      refreshHint();
    }));
  };

  const refreshWhen = () => {
    el.querySelector('[data-when="duration"]').hidden = !needsDuration(d.type);
    el.querySelector('[data-when="location"]').hidden = !needsLocation(d.type);
    const c = store.company(d.companyId);
    const useAddr = $('[data-useaddr]');
    useAddr.hidden = !(c && c.address && form.location.value !== c.address);
    const until = el.querySelector('[data-when="until"]');
    if (until) until.hidden = rep.mode === 'none';
  };

  // tipo
  el.querySelectorAll('[data-type]').forEach((b) => (b.onclick = () => {
    const prev = d.type;
    d.type = b.dataset.type;
    el.querySelectorAll('[data-type]').forEach((x) => x.classList.toggle('is-on', x === b));
    form.title.placeholder = TYPES[d.type].placeholder;
    if (!original || prev !== d.type) {
      d.duration = needsDuration(d.type) ? TYPES[d.type].dur : null;
      form.duration.value = String(TYPES[d.type].dur);
      if (!original) {
        d.visibleToClient = TYPES[d.type].client;
        form.visibleToClient.checked = d.visibleToClient;
      }
    }
    if (needsLocation(d.type) && !form.location.value) {
      const c = store.company(d.companyId);
      if (c?.address) {
        form.location.value = c.address;
        d.location = c.address;
      }
    }
    refreshWhen();
    refreshHint();
  }));

  // empresa
  el.querySelectorAll('[data-company]').forEach((b) => (b.onclick = () => {
    d.companyId = b.dataset.company;
    el.querySelectorAll('[data-company]').forEach((x) => x.classList.toggle('is-on', x === b));
    const c = store.company(d.companyId);
    if (needsLocation(d.type) && c?.address && !form.location.value) {
      form.location.value = c.address;
      d.location = c.address;
    }
    refreshWhen();
  }));
  $('[data-newco]').onclick = () => {
    openCompanyEditor(null, (c) => {
      d.companyId = c.id;
      // re-renderiza preservando o rascunho
      readForm();
      api.set(editorHtml(d, !!original, rep));
    });
  };

  // pessoas
  el.querySelectorAll('[data-who]').forEach((b) => (b.onclick = () => {
    const id = b.dataset.who;
    d.assignees = d.assignees.includes(id) ? d.assignees.filter((x) => x !== id) : [...d.assignees, id];
    b.classList.toggle('is-on', d.assignees.includes(id));
    refreshHint();
  }));

  $('[data-useaddr]').onclick = () => {
    const c = store.company(d.companyId);
    form.location.value = c.address;
    d.location = c.address;
    refreshWhen();
  };

  const readForm = () => {
    d.title = form.title.value.trim();
    d.date = form.date.value;
    d.time = form.time.value || '';
    d.duration = needsDuration(d.type) ? Number(form.duration.value) : null;
    d.location = needsLocation(d.type) ? form.location.value.trim() : '';
    d.description = form.description.value.trim();
    d.internalNote = form.internalNote.value.trim();
    d.reminder = Number(form.reminder.value);
    d.visibleToClient = form.visibleToClient.checked;
    if (form.status) d.status = form.status.value;
    if (form.repeat) rep.mode = form.repeat.value;
    if (form.until) rep.until = form.until.value;
  };
  form.addEventListener('input', () => {
    readForm();
    refreshWhen();
  });
  form.addEventListener('change', () => {
    readForm();
    refreshWhen();
    refreshHint();
  });

  const del = $('[data-delete]');
  if (del) del.onclick = () => deleteEvent(d.id, null).then(() => !store.event(d.id) && api.close());

  $('[data-save]').onclick = async () => {
    readForm();
    if (!d.companyId) {
      toast('Escolha a empresa');
      el.querySelector('.cogrid').scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (!d.date) return toast('Escolha o dia');
    if (!d.assignees.length) {
      const ok = await confirmDialog({ title: 'Ninguém responsável?', text: 'Este evento ficará sem responsável. Deseja salvar assim mesmo?', ok: 'Salvar assim' });
      if (!ok) return;
    }
    if (original) {
      await saveEdit(d, original);
    } else if (rep.mode !== 'none') {
      const dates = repeatDates(d.date, rep);
      const seriesId = uid('s_');
      await store.upsertMany('events', dates.map((date, i) => ({ ...d, id: i === 0 ? d.id : uid('e_'), date, seriesId })));
      toast(`${dates.length} eventos criados`);
    } else {
      await store.upsert('events', { ...d });
      toast('Evento salvo');
    }
    api.close();
  };

  refreshWhen();
  refreshHint();
}

function repeatDates(start, rep) {
  const out = [];
  let k = start;
  const until = rep.until && rep.until >= start ? rep.until : addDays(start, 28);
  while (k <= until && out.length < 150) {
    const wd = fromKey(k).getDay();
    if (rep.mode === 'daily') out.push(k);
    else if (rep.mode === 'weekdays' && wd >= 1 && wd <= 5) out.push(k);
    else if (rep.mode === 'weekly' && fromKey(k).getDay() === fromKey(start).getDay()) out.push(k);
    k = addDays(k, 1);
  }
  return out;
}

const SERIES_FIELDS = ['type', 'companyId', 'title', 'time', 'duration', 'assignees', 'location', 'description', 'internalNote', 'reminder', 'visibleToClient'];

async function saveEdit(d, original) {
  const changed = SERIES_FIELDS.filter((f) => JSON.stringify(d[f]) !== JSON.stringify(original[f]));
  if (d.seriesId && changed.length) {
    const next = store.state.events.filter((x) => x.seriesId === d.seriesId && x.date > original.date);
    if (next.length) {
      const r = await chooseDialog({
        title: 'Evento repetido',
        text: 'Aplicar as alterações a quais eventos?',
        options: [
          { label: 'Só a este', value: 'one', primary: true },
          { label: `A este e aos próximos (${next.length + 1})`, value: 'next' },
        ],
      });
      if (!r) return;
      if (r === 'next') {
        const patch = Object.fromEntries(changed.map((f) => [f, d[f]]));
        await store.upsertMany('events', [{ ...d }, ...next.map((x) => ({ ...x, ...patch }))]);
        toast('Série atualizada');
        return;
      }
    }
  }
  await store.upsert('events', { ...d });
  toast('Alterações salvas');
}
