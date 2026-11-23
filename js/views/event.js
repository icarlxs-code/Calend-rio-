/* Detalhe do evento e editor (criar/editar) */
import { postStory } from '../stories.js';
import { previewStory } from '../game.js';
import { okFx } from '../okfx.js';
import { store } from '../store.js';
import { CONFIG } from '../../config.js';
import { ui } from '../ui.js';
import { TYPES, TYPE_ORDER, STATUS, STATUS_ORDER, DURATIONS, REMINDERS, REPEATS, durationOf, typeStyle, WORK, ent, isMarketing, novo } from '../constants.js';
import { esc, todayKey, addDays, fmtDayLong, fmtDuration, fmtTime, uid, rgba, fromKey, relDay, toMin, fromMin, dayLabel, nowMin } from '../utils.js';
import { icon } from '../icons.js';
import {
  openSheet, sheetHead, avatar, logo, typeBadge, whoText, timeRange, toast, confirmDialog, chooseDialog,
} from '../components.js';
import { validateDraft, bestSlots, freePeople, spanOf, evLabel } from '../planner.js';
import { downloadICS } from '../ics.js';
import { POST_NETS, platformById } from '../platforms.js';
import { tidyTitle } from '../tidy.js';
import { onDone } from '../reward.js';
import { platformIcons } from '../platforms.js';
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
  const mine = store.canEdit('events', e);
  const ownerName = store.member(store.ownerOf('events', e))?.name || 'o parceiro';
  return `
  ${sheetHead('', { right: mine ? `<button class="btn-text" data-act="edit">Editar</button>` : '' })}
  <div class="detail">
    <div class="detail__hero" style="--cc:${color};--cc-soft:${rgba(color, 0.12)}">
      <div class="detail__co">${logo(c, 40)}<div><strong>${esc(c?.name || 'Sem ' + ent(false, true))}</strong>${c?.instagram ? `<small>@${esc(c.instagram)}</small>` : ''}</div>${typeBadge(e.type, { solid: true })}</div>
      <h2><span class="pfrow">${platformIcons(e, 24)}</span>${esc(e.title || TYPES[e.type].label)}</h2>
      <p class="detail__when">${icon('calendar', 15)} ${esc(relDay(e.date))}, ${esc(fmtDayLong(e.date).split(', ')[1])} · ${icon('clock', 15)} ${esc(timeRange(e))}</p>
    </div>

    ${mine ? '' : `<p class="detail__lock">${icon('eye', 14)} Cadastrado por ${esc(ownerName)} — ${store.canComplete(e) ? 'você é responsável: pode marcar o andamento, mas não editar.' : 'você só pode ver. Use “Duplicar” para criar uma cópia sua.'}</p>`}
    <div class="seg seg--status"${mine || store.canComplete(e) ? '' : ' hidden'}>
      ${STATUS_ORDER.map((s) => `<button class="seg__btn${e.status === s ? ' is-on' : ''} st-${s}" data-status="${s}">${s === 'feito' ? icon('check', 14) : ''}${STATUS[s].label}</button>`).join('')}
    </div>

    ${e.status === 'feito' && (e.assignees || []).concat(e.createdBy).includes(store.me) && store.mode === 'cloud' ? `<button class="storybtn" data-act="story"><span class="storybtn__ic">${icon('camera', 20)}</span>${(() => { const P = previewStory('w', `e:${e.id}`); return P.ja ? '<span><b>Postar outro story</b><small>O bônus dessa você já ganhou ✔️ · some em 24 h</small></span></button>' : `<span><b>Postar story do que você fez</b><small>${P.got ? `+${P.total} XP agora` : 'Foto tirada agora'}${P.badges[0] ? ` · desbloqueia “${esc(P.badges[0].name())}”` : P.lv1 > P.lv0 ? ` · sobe pro nível ${P.lv1}` : ' · XP em dobro'} · some em 24 h</small></span><i class="storybtn__x2">2×</i></button>`; })()}` : ''}
    <ul class="rows">
      ${solo() ? '' : `<li><span class="rows__k">${icon('users', 16)} Responsável</span><span class="rows__v">${(e.assignees || []).map((a) => avatar(a, 22)).join('')} ${esc(whoText(e.assignees))}</span></li>`}
      ${e.location ? `<li><span class="rows__k">${icon('pin', 16)} Local</span><a class="rows__v link" href="https://maps.apple.com/?q=${encodeURIComponent(e.location)}" target="_blank" rel="noopener">${esc(e.location)}</a></li>` : ''}
      ${TYPES[e.type].kind !== 'post' || e.duration ? `<li><span class="rows__k">${icon('clock', 16)} Duração</span><span class="rows__v">${esc(fmtDuration(durationOf(e)))}</span></li>` : ''}
      <li><span class="rows__k">${icon('bell', 16)} Lembrete</span><span class="rows__v">${esc(rem?.label || '—')}</span></li>
      ${series ? `<li><span class="rows__k">${icon('repeat', 16)} Repetição</span><span class="rows__v">${series} eventos na série</span></li>` : ''}
      ${WORK.clientLike ? `<li><span class="rows__k">${icon(e.visibleToClient === false ? 'eyeoff' : 'eye', 16)} Cliente</span><span class="rows__v">${e.visibleToClient === false ? 'Não aparece para o cliente' : 'Aparece no link do cliente'}</span></li>` : ''}
    </ul>

    ${e.description ? `<div class="textbox"><h4>${esc(WORK.form.desc[0])}</h4><p>${esc(e.description)}</p></div>` : ''}
    ${e.internalNote ? `<div class="textbox textbox--note"><h4>${icon('eyeoff', 13)} ${esc(WORK.form.note[0])} (${noteTag()})</h4><p>${esc(e.internalNote)}</p></div>` : ''}

    <div class="actions">
      <button data-act="ics">${icon('bell', 20)}<span>Lembrete no iPhone</span></button>
      ${mine ? `<button data-act="tomorrow">${icon('right', 20)}<span>Passar p/ amanhã</span></button>` : ''}
      <button data-act="dup">${icon('copy', 20)}<span>Duplicar</span></button>
      ${mine ? `<button data-act="del" class="is-danger">${icon('trash', 20)}<span>Excluir</span></button>` : ''}
    </div>
    <p class="detail__meta">Criado por ${esc(store.member(e.createdBy)?.name || '—')}${e.updatedAt ? ' · atualizado ' + new Date(e.updatedAt).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : ''}</p>
  </div>`;
}

function mountDetail(api, id) {
  const el = api.el;
  el.querySelectorAll('[data-status]').forEach((b) => (b.onclick = async () => {
    const e = store.event(id);
    const at = b.getBoundingClientRect();
    await store.upsert('events', { ...e, status: b.dataset.status });
    if (b.dataset.status === 'feito' && e.status !== 'feito' && store.event(id)?.status === 'feito') {
      const left = e.date === todayKey() ? store.eventsOn(e.date, { person: store.me }).filter((x) => x.status !== 'feito').length : null;
      toast(onDone({ el: at, left }));
    }
  }));
  const act = (name, fn) => {
    const b = el.querySelector(`[data-act="${name}"]`);
    if (b) b.onclick = fn;
  };
  act('edit', () => openEventEditor({ id }));
  act('story', () => { const e = store.event(id); postStory({ title: e.title || TYPES[e.type]?.label || '', ref: `e:${id}`, kind: 'w' }); });

  act('dup', async () => {
    const e = store.event(id);
    const copy = { ...e, id: uid('e_'), status: 'pendente', seriesId: null, createdAt: null, createdBy: null };
    await store.upsert('events', copy);
    api.close();
    toast(`${EVc()} duplicado`);
    openEventEditor({ id: copy.id });
  });
  act('tomorrow', async () => {
    const e = store.event(id);
    if (!(await confirmMove(e, { date: addDays(e.date, 1) }))) return;
    await store.upsert('events', { ...e, date: addDays(e.date, 1) });
    toast('Movido para ' + relDay(addDays(e.date, 1)).toLowerCase(), {
      action: 'Desfazer',
      onAction: () => store.upsert('events', { ...store.event(id), date: e.date }),
    });
  });
  act('ics', () => {
    const e = store.event(id);
    downloadICS([e], `${TYPES[e.type].label}-${e.date}.ics`, CONFIG.appName);
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
        title: `Excluir ${EV()} repetido`,
        options: [
          { label: 'Só este', value: 'one', danger: true },
          { label: `Este e os próximos (${next.length})`, value: 'next', danger: true },
        ],
      });
      if (!r) return;
      if (r === 'next') ids = next;
    } else if (!(await confirmDialog({ title: `Excluir este ${EV()}?`, ok: 'Excluir', danger: true }))) return;
  } else if (!(await confirmDialog({ title: `Excluir este ${EV()}?`, text: store.team.length > 1 ? 'Ele some da agenda de todos.' : 'Ele some da sua agenda.', ok: 'Excluir', danger: true }))) return;
  const backup = ids.map((i) => ({ ...store.event(i) }));
  await store.removeMany('events', ids);
  api && api.close();
  toast(ids.length > 1 ? `${ids.length} ${EV()}s excluídos` : `${EVc()} excluído`, {
    action: 'Desfazer',
    onAction: () => store.upsertMany('events', backup),
    ms: 4500,
  });
}

/* ======================== EDITOR ======================== */
export function openEventEditor({ id = null, date = null, companyId = null, type = null, time = null, assignees = null, title = '' } = {}) {
  const existing = id ? store.event(id) : null;
  if (existing && !store.canEdit('events', existing)) { store._denied('events', existing); return; }
  const companies = store.companiesSorted();
  // tipo inicial: o primeiro da profissão (Feed só para marketing)
  const defType = type || (TYPE_ORDER.includes('feed') ? 'feed' : TYPE_ORDER[0]);
  const draft = existing
    ? JSON.parse(JSON.stringify(existing))
    : {
        id: uid('e_'),
        type: defType,
        companyId: companyId || (ui.monthCompany || (companies.length === 1 ? companies[0].id : null)),
        title: title || '',
        date: date || (ui.tab === 'mes' ? ui.monthSel : ui.date) || todayKey(),
        time: time || TYPES[defType].best[0] || '12:00',
        duration: ['shoot', 'meeting', 'work', 'other'].includes(TYPES[defType].kind) ? TYPES[defType].dur : null,
        assignees: assignees || (ui.person !== 'all' ? [ui.person] : store.me ? [store.me] : []),
        location: '',
        description: '',
        internalNote: '',
        reminder: 30,
        visibleToClient: TYPES[defType].client,
        status: 'pendente',
      };
  // compromisso novo sem horário escolhido: já vem no próximo horário livre (fora do almoço e sem conflito)
  if (!existing && !time && !isMarketing()) {
    const sl = bestSlots(draft, { limit: 6 }).map((x) => x.time).sort();
    if (sl.length) draft.time = sl[0];
    else if (draft.date === todayKey()) { const n = Math.ceil((nowMin() + 30) / 30) * 30; if (n < 24 * 60) draft.time = fromMin(n); }
  }
  const original = existing ? JSON.parse(JSON.stringify(existing)) : null;
  const rep = { mode: 'none', until: addDays(draft.date, 28) };

  const api = openSheet({
    className: 'sheet--tall',
    html: editorHtml(draft, !!existing, rep),
    onMount: (a) => mountEditor(a, draft, original, rep),
  });
  return api;
}

/* Explica o que acontece com a chave "Avisar o parceiro" */
function notifyHelp(d, m) {
  const resp = (d.assignees || []).includes(m.id);
  if (d.notifyPartner === false) return resp ? `Sem aviso agora. Como ${m.name} é responsável, ele ainda recebe os lembretes do horário.` : `${m.name} não recebe aviso nem lembretes deste evento. Fica só na agenda.`;
  return `${m.name} recebe o aviso de que você marcou e os lembretes do horário.`;
}
const EV = () => (isMarketing() ? 'evento' : 'compromisso');
const EVc = () => (isMarketing() ? 'Evento' : 'Compromisso');
const solo = () => store.team.length < 2;
const noteTag = () => (solo() ? 'só você vê' : `só ${store.team.length > 2 ? 'a equipe' : 'vocês'} veem`);
const needsDuration = (type) => ['shoot', 'meeting', 'work', 'other'].includes(TYPES[type].kind);
const needsLocation = (type) => ['shoot', 'meeting'].includes(TYPES[type].kind);

function editorHtml(d, editing, rep) {
  const companies = store.companiesSorted();
  return `
  ${sheetHead(editing ? `Editar ${EV()}` : `Novo ${EV()}`, {
    left: `<button class="btn-text" data-close>Cancelar</button>`,
    right: `<button class="btn btn--primary btn--sm" data-save>Salvar</button>`,
  })}
  <form class="form" data-editor onsubmit="return false">
    <div class="fgroup">
      <label class="flabel">O que é?</label>
      <div class="typegrid">
        ${TYPE_ORDER.map((t) => `<button type="button" class="typebtn tbadge--${t}${d.type === t ? ' is-on' : ''}"${typeStyle(t)} data-type="${t}">${icon(TYPES[t].icon, 20)}<span>${TYPES[t].label}</span></button>`).join('')}
      </div>
    </div>

    <div class="fgroup">
      <label class="flabel">${ent()}${isMarketing() ? '' : ' <em class="tag">opcional</em>'}</label>
      <div class="cogrid">
        ${companies.map((c) => `<button type="button" class="cobtn${d.companyId === c.id ? ' is-on' : ''}" style="--cc:${c.color}" data-company="${c.id}">${logo(c, 26, 7)}<span>${esc(c.name)}</span></button>`).join('')}
        <button type="button" class="cobtn cobtn--add" data-newco>${icon('plus', 18)}<span>${novo()} ${ent(false, true)}</span></button>
      </div>
    </div>

    ${TYPE_ORDER.some((t) => TYPES[t].kind === 'post') || TYPES[d.type].kind === 'post' ? `<div class="fgroup" data-when="net" ${TYPES[d.type].kind === 'post' ? '' : 'hidden'}>
      <label class="flabel">Onde vai postar?</label>
      <div class="netgrid">${POST_NETS.map((id) => { const p = platformById(id); return p ? `<button type="button" class="netbtn${(d.platform || 'instagram') === id ? ' is-on' : ''}" data-net="${id}"><span class="pf" style="width:22px;height:22px">${p.svg}</span><span>${esc(p.name.replace(' (Twitter)', ''))}</span></button>` : ''; }).join('')}</div>
    </div>` : ''}

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

    <div class="fgroup"${solo() ? ' hidden' : ''}>
      <label class="flabel">Quem vai fazer?</label>
      <div class="whogrid">
        ${store.team.map((m) => `<button type="button" class="whobtn${(d.assignees || []).includes(m.id) ? ' is-on' : ''}" style="--mc:${m.color}" data-who="${m.id}">${avatar(m.id, 30)}<span>${esc(m.name)}</span><i class="whobtn__check">${icon('check', 14)}</i></button>`).join('')}
      </div>
      <p class="fhelp">${store.team.length > 2 ? 'Marque todos que vão juntos.' : 'Marque os dois se forem juntos.'}</p>
      ${store.team.filter((m) => m.id !== store.me).map((m) => `<label class="list__row notifyrow"><span><b>${icon('bell', 15)} Avisar ${m.name === 'Matheus' || m.name === 'Henrique' ? 'o ' : ''}${esc(m.name)}</b><small data-notifyhelp>${notifyHelp(d, m)}</small></span><input type="checkbox" class="switch" name="notifyPartner" ${d.notifyPartner !== false ? 'checked' : ''}></label>`).join('')}
    </div>

    <div class="fgroup" data-when="location" ${needsLocation(d.type) ? '' : 'hidden'}>
      <label class="flabel" for="f-loc">Local</label>
      <input id="f-loc" class="input" name="location" value="${esc(d.location || '')}" placeholder="Endereço ou nome do lugar" autocomplete="off">
      <button type="button" class="btn-text btn-text--sm" data-useaddr hidden>${icon('pin', 14)} Usar o endereço cadastrado</button>
    </div>

    <div class="fgroup">
      <label class="flabel" for="f-desc">${esc(WORK.form.desc[0])}${WORK.clientLike ? ` <em class="tag">${icon('eye', 12)} cliente vê</em>` : ''}</label>
      <textarea id="f-desc" class="input" name="description" rows="3" placeholder="${esc(WORK.form.desc[1])}">${esc(d.description || '')}</textarea>
    </div>
    <div class="fgroup">
      <label class="flabel" for="f-note">${esc(WORK.form.note[0])} <em class="tag tag--note">${icon('eyeoff', 12)} ${noteTag()}</em></label>
      <textarea id="f-note" class="input" name="internalNote" rows="2" placeholder="${esc(WORK.form.note[1])}">${esc(d.internalNote || '')}</textarea>
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
      <label class="list__row"${WORK.clientLike ? '' : ' hidden'}><span>${icon('eye', 18)} Aparece no link do cliente</span>
        <input type="checkbox" class="switch" name="visibleToClient" ${d.visibleToClient !== false ? 'checked' : ''}>
      </label>
      ${editing ? `<label class="list__row"><span>${icon('check', 18)} Status</span>
        <select name="status">${STATUS_ORDER.map((s) => `<option value="${s}"${d.status === s ? ' selected' : ''}>${STATUS[s].label}</option>`).join('')}</select>
      </label>` : ''}
    </div>

    ${editing ? `<button type="button" class="btn btn--danger-soft btn--block" data-delete>${icon('trash', 18)} Excluir ${EV()}</button>` : ''}
    <div class="form__spacer"></div>
  </form>`;
}

function mountEditor(api, d, original, rep) {
  const el = api.el;
  const form = el.querySelector('[data-editor]');
  const $ = (s) => el.querySelector(s);

  const refreshHint = () => {
    const box = $('[data-hint]');
    box.innerHTML = assistantPanel(d, !original);
    box.querySelectorAll('[data-settime]').forEach((b) => (b.onclick = () => {
      d.time = b.dataset.settime;
      form.time.value = d.time;
      refreshHint();
    }));
    box.querySelectorAll('[data-setwho]').forEach((b) => (b.onclick = () => {
      d.assignees = [b.dataset.setwho];
      el.querySelectorAll('[data-who]').forEach((x) => x.classList.toggle('is-on', d.assignees.includes(x.dataset.who)));
      refreshHint();
    }));
  };

  const refreshWhen = () => {
    el.querySelector('[data-when="duration"]').hidden = !needsDuration(d.type);
    const net = el.querySelector('[data-when="net"]');
    if (net) net.hidden = TYPES[d.type].kind !== 'post';
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
    const h = el.querySelector('[data-notifyhelp]');
    const partner = store.team.find((m) => m.id !== store.me);
    if (h && partner) h.textContent = notifyHelp(d, partner);
  }));
  const nt = el.querySelector('input[name="notifyPartner"]');
  if (nt) nt.onchange = () => {
    d.notifyPartner = nt.checked;
    const h = el.querySelector('[data-notifyhelp]');
    const partner = store.team.find((m) => m.id !== store.me);
    if (h && partner) h.textContent = notifyHelp(d, partner);
  };

  $('[data-useaddr]').onclick = () => {
    const c = store.company(d.companyId);
    form.location.value = c.address;
    d.location = c.address;
    refreshWhen();
  };

  el.querySelectorAll('[data-net]').forEach((b) => (b.onclick = () => {
    d.platform = b.dataset.net;
    el.querySelectorAll('[data-net]').forEach((x) => x.classList.toggle('is-on', x === b));
  }));
  const readForm = () => {
    d.title = tidyTitle(form.title.value.trim(), d.type);
    if (TYPES[d.type].kind === 'post' && !d.platform) d.platform = 'instagram';
    if (TYPES[d.type].kind !== 'post') d.platform = null;
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
    if (saving) return;
    if (!d.companyId && isMarketing()) {
      toast('Escolha a empresa');
      el.querySelector('.cogrid').scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (!d.date) return toast('Escolha o dia');
    // agenda só sua: o compromisso é sempre seu
    if (solo() && store.me && !d.assignees.length) d.assignees = [store.me];
    if (!d.assignees.length) {
      const ok = await confirmDialog({ title: 'Ninguém responsável?', text: `Este ${EV()} ficará sem responsável. Deseja salvar assim mesmo?`, ok: 'Salvar assim' });
      if (!ok) return;
    }
    if (saving) return;
    saving = true;
    try {
      await doSave();
    } finally {
      saving = false;
    }
  };
  let saving = false;
  const doSave = async () => {
    if (original) {
      const timingChanged = ['date', 'time', 'duration', 'type', 'assignees', 'companyId'].some((f) => JSON.stringify(d[f]) !== JSON.stringify(original[f]));
      if (timingChanged && !(await checkBeforeSave(d, false, api, refreshAll))) return;
      await saveEdit(d, original);
    } else if (rep.mode !== 'none') {
      const dates = repeatDates(d.date, rep);
      const bad = dates.filter((date) => validateDraft({ ...d, date }, { isNew: true }).some((i) => i.level === 'block'));
      let use = dates;
      if (bad.length) {
        const r = await chooseDialog({
          title: `${bad.length} de ${dates.length} datas já têm compromisso nesse horário`,
          text: bad.slice(0, 6).map((k) => dayLabel(k)).join(' · ') + (bad.length > 6 ? ' …' : ''),
          options: [
            { label: `Criar só nas ${dates.length - bad.length} datas livres`, value: 'free', primary: true },
            { label: 'Criar em todas mesmo assim', value: 'all' },
          ],
        });
        if (!r) return;
        if (r === 'free') use = dates.filter((k) => !bad.includes(k));
        if (!use.length) return toast('Nenhuma data livre');
      }
      const seriesId = uid('s_');
      await store.upsertMany('events', use.map((date, i) => ({ ...d, id: i === 0 ? d.id : uid('e_'), date, seriesId })), {
        activity: { notifyPartner: d.notifyPartner, kind: 'series', count: use.length, label: `${TYPES[d.type].label} ${REPEATS.find((x) => x.v === rep.mode)?.label.toLowerCase() || ''} às ${fmtTime(d.time)}`, sample: { companyId: d.companyId, date: use[0] } },
      });
      api.close();
      okFx({ title: `${use.length} ${EV()}s marcados`, sub: `${REPEATS.find((x) => x.v === rep.mode)?.label || ''}${d.time ? ' · ' + fmtTime(d.time) : ''}`.replace(/^ · /, '') });
      return;
    } else {
      if (!(await checkBeforeSave(d, true, api, refreshAll))) return;
      await store.upsert('events', { ...d });
      api.close();
      okFx({ title: `${EVc()} marcado`, sub: `${dayLabel(d.date)}${d.time ? ' · ' + fmtTime(d.time) : ''}` });
      return;
    }
    api.close();
  };

  function refreshAll() {
    form.time.value = d.time || '';
    form.date.value = d.date;
    el.querySelectorAll('[data-who]').forEach((x) => x.classList.toggle('is-on', d.assignees.includes(x.dataset.who)));
    refreshWhen();
    refreshHint();
  }

  refreshWhen();
  refreshHint();
}

/* ======================== PAINEL DO ASSISTENTE NO EDITOR ======================== */
const LANE_FROM = 7 * 60, LANE_TO = 23 * 60;
const pct = (m) => ((Math.min(Math.max(m, LANE_FROM), LANE_TO) - LANE_FROM) / (LANE_TO - LANE_FROM)) * 100;

function lanes(d, issues) {
  const range = d.time ? spanOf(d) : null;
  const ticks = [8, 10, 12, 14, 16, 18, 20, 22];
  return `<div class="lanes">
    <div class="lanes__head"><strong>${store.team.length > 1 ? `Agenda ${store.team.length === 2 ? 'dos dois' : 'de todos'}` : 'Sua agenda'} em ${esc(dayLabel(d.date))}</strong></div>
    ${store.team.map((m) => {
      const evs = store.eventsOn(d.date, { person: m.id }).filter((e) => e.id !== d.id && e.time);
      const mine = (d.assignees || []).includes(m.id);
      const clash = issues.some((i) => i.level === 'block' && i.person === m.id);
      return `<div class="lane">
        <span class="lane__who">${avatar(m.id, 22)}</span>
        <div class="lane__track">
          ${ticks.map((h) => `<i class="lane__tick" style="left:${pct(h * 60)}%"></i>`).join('')}
          ${evs.map((e) => {
            const s = spanOf(e);
            const c = store.company(e.companyId);
            return `<span class="lane__ev" style="left:${pct(s[0])}%;width:max(4px,${pct(s[1]) - pct(s[0])}%);background:${c?.color || '#888'}" title="${esc(evLabel(e))}"></span>`;
          }).join('')}
          ${range && mine ? `<span class="lane__draft${clash ? ' is-clash' : ''}" style="left:${pct(range[0])}%;width:max(6px,${pct(range[1]) - pct(range[0])}%)"></span>` : ''}
        </div>
      </div>`;
    }).join('')}
    <div class="lane lane--axis"><span class="lane__who"></span><div class="lane__track">${ticks.map((h) => `<small style="left:${pct(h * 60)}%">${h}h</small>`).join('')}</div></div>
  </div>`;
}

function assistantPanel(d, isNew) {
  if (!d.date) return '';
  const issues = validateDraft(d, { isNew });
  const blocks = issues.filter((i) => i.level === 'block');
  const warns = issues.filter((i) => i.level === 'warn');
  const infos = issues.filter((i) => i.level === 'info');
  const slots = bestSlots(d, { limit: 4 });
  const free = freePeople(d);
  const single = (d.assignees || []).length === 1 ? d.assignees[0] : null;
  const swap = blocks.length && single ? store.team.find((m) => m.id !== single && free.includes(m.id)) : null;
  const t = TYPES[d.type];
  const issue = (i) => `<li class="issue issue--${i.level}">${icon(i.level === 'block' ? 'alert' : i.level === 'warn' ? 'flag' : i.code === 'partner' ? 'user' : 'bulb', 15)}<div><strong>${esc(i.title)}</strong><p>${esc(i.text)}</p></div></li>`;
  return `
  <section class="assist">
    <header class="assist__head">${icon('sparkle', 16)} Assistente</header>
    ${lanes(d, issues)}
    ${issues.length ? `<ul class="issues">${[...blocks, ...warns, ...infos].map(issue).join('')}</ul>`
      : d.time ? `<p class="assist__ok">${icon('check', 15)} Horário livre para ${esc(whoText(d.assignees))}, sem conflitos.</p>` : ''}
    ${swap ? `<button type="button" class="tchip tchip--wide" data-setwho="${swap.id}">${avatar(swap.id, 18)} Passar para ${esc(swap.name)} (está livre)</button>` : ''}
    <div class="assist__sugg">
      <p>${esc(t.tip)}</p>
      ${slots.length ? `<div class="hintbox__times">${slots.map((s) => `<button type="button" class="tchip${d.time === s.time ? ' is-on' : ''}" data-settime="${s.time}">${fmtTime(s.time)}${s.peak ? '<small>pico</small>' : '<small>livre</small>'}</button>`).join('')}</div>`
        : `<p class="muted">Nenhum horário livre nesse dia${(d.assignees || []).length ? ' para ' + esc(whoText(d.assignees)) : ''}. Tente outro dia${store.team.length > 1 ? ' ou outra pessoa' : ''}.</p>`}
    </div>
  </section>`;
}

/* Antes de salvar: se for marcar em cima de outra coisa, avisa e oferece saídas */
async function checkBeforeSave(d, isNew, api, refreshAll) {
  const issues = validateDraft(d, { isNew });
  const blocks = issues.filter((i) => i.level === 'block');
  if (!blocks.length) return true;
  const slots = bestSlots(d, { limit: 2 });
  const single = (d.assignees || []).length === 1 ? d.assignees[0] : null;
  const swap = single && store.team.find((m) => m.id !== single && freePeople(d).includes(m.id));
  const options = [
    ...slots.map((s) => ({ label: `Mudar para ${fmtTime(s.time)} (livre)`, value: 'time:' + s.time, primary: true })),
    ...(swap ? [{ label: `Passar para ${swap.name} (está livre)`, value: 'who:' + swap.id, primary: !slots.length }] : []),
    { label: 'Marcar mesmo assim', value: 'force' },
  ];
  const r = await chooseDialog({
    title: blocks[0].code === 'duplicate' ? 'Isso já está na agenda' : 'Já tem compromisso nesse horário',
    bodyHtml: `<ul class="issues issues--dialog">${blocks.map((i) => `<li class="issue issue--block">${icon('alert', 15)}<div><strong>${esc(i.title)}</strong><p>${esc(i.text)}</p></div></li>`).join('')}</ul>`,
    options,
  });
  if (!r) return false;
  if (r === 'force') return true;
  if (r.startsWith('time:')) d.time = r.slice(5);
  if (r.startsWith('who:')) d.assignees = [r.slice(4)];
  refreshAll();
  // confere de novo com a mudança aplicada
  return checkBeforeSave(d, isNew, api, refreshAll);
}

/* Usado por outras telas (ex.: "Passar para amanhã", correções do assistente) */
export async function confirmMove(ev, patch) {
  const next = { ...ev, ...patch };
  const blocks = validateDraft(next).filter((i) => i.level === 'block');
  if (!blocks.length) return true;
  const r = await chooseDialog({
    title: 'Já tem compromisso nesse horário',
    bodyHtml: `<ul class="issues issues--dialog">${blocks.map((i) => `<li class="issue issue--block">${icon('alert', 15)}<div><strong>${esc(i.title)}</strong><p>${esc(i.text)}</p></div></li>`).join('')}</ul>`,
    options: [{ label: 'Mover mesmo assim', value: 'force', primary: true }],
  });
  return r === 'force';
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
        title: `${EVc()} repetido`,
        text: 'Aplicar as alterações a quais eventos?',
        options: [
          { label: 'Só a este', value: 'one', primary: true },
          { label: `A este e aos próximos (${next.length + 1})`, value: 'next' },
        ],
      });
      if (!r) return;
      if (r === 'next') {
        const patch = Object.fromEntries(changed.map((f) => [f, d[f]]));
        await store.upsertMany('events', [{ ...d }, ...next.map((x) => ({ ...x, ...patch }))], {
          activity: { kind: 'series-edit', count: next.length + 1, label: `${TYPES[d.type].label} · a partir de ${d.date.slice(8)}/${d.date.slice(5, 7)}`, sample: { companyId: d.companyId, date: d.date } },
        });
        toast('Série atualizada');
        return;
      }
    }
  }
  await store.upsert('events', { ...d });
  toast('Alterações salvas');
}
