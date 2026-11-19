/* "Pessoal": agenda privada (aniversários, cabelo, buscar alguém...). Só o dono vê. */
import { personal, CATS, REPEATS, occurrences, overdue, savePersonal, removePersonal, toggleDone, parseQuick, doneOn } from '../personal.js';
import { openSheet, sheetHead, toast, confirmDialog } from '../components.js';
import { icon } from '../icons.js';
import { esc, todayKey, addDays, dayLabel, fmtTime, fromKey, diffDays } from '../utils.js';

const row = (it, date, done) => {
  const c = CATS[it.cat] || CATS.lembrete;
  const age = it.cat === 'aniversario' && it.birthYear ? ` · faz ${+date.slice(0, 4) - it.birthYear} anos` : '';
  return `<div class="prow${done ? ' is-done' : ''}" style="--pc:${c.color}" data-action="p-open" data-id="${it.id}" data-date="${date}">
    <span class="prow__emo">${c.emoji}</span>
    <div class="prow__body"><strong>${esc(it.title)}</strong><small>${it.time ? fmtTime(it.time) + ' · ' : ''}${esc(c.label)}${age}${it.repeat && it.repeat !== 'none' ? ' · ' + icon('repeat', 11) : ''}${it.note ? ' · ' + esc(it.note.slice(0, 40)) : ''}</small></div>
    <button class="prow__check${done ? ' is-on' : ''}" data-action="p-done" data-id="${it.id}" data-date="${date}" aria-label="Feito">${icon('check', 15)}</button>
  </div>`;
};

export function renderPersonal() {
  const t = todayKey();
  const late = overdue();
  const occ = occurrences(t, addDays(t, 30));
  const days = {};
  occ.forEach((o) => (days[o.date] = days[o.date] || []).push(o));
  const bdays = occurrences(addDays(t, 1), addDays(t, 60)).filter((o) => o.item.cat === 'aniversario').slice(0, 6);
  const list = Object.entries(days).map(([d, os]) => `<section class="block">
      <h2 class="block__title">${esc(dayLabel(d))}${d === t ? ' <span class="pbadge">hoje</span>' : ''}</h2>
      <div class="plist">${os.map((o) => row(o.item, o.date, o.done)).join('')}</div></section>`).join('');
  return `
  <header class="hdr"><div class="hdr__row"><div class="hdr__titles"><p class="hdr__eyebrow">${icon('lock', 12)} Só você vê</p><h1>Pessoal</h1></div></div></header>
  <div class="page">
    <form class="pquick" data-form="pquick" onsubmit="return false">
      <input name="q" placeholder="Ex.: cortar cabelo amanhã 15h" autocomplete="off" enterkeyhint="done" maxlength="160">
      <button class="iconbtn iconbtn--accent" aria-label="Anotar">${icon('plus', 18)}</button>
    </form>
    <p class="fhelp" style="margin-top:-14px">Escreva do jeito que fala: “aniversário da Maria 25/12”, “buscar a Ana sexta às 18”, “dentista dia 3/12 14:30”. Separado do trabalho — nem o parceiro vê.</p>
    ${late.length ? `<section class="block"><h2 class="block__title" style="color:var(--danger,#FF3B30)">Ficou pra trás</h2><div class="plist">${late.map((it) => row(it, it.date, false)).join('')}</div></section>` : ''}
    ${list || `<div class="empty">${icon('sparkle', 28)}<h3>Nada anotado</h3><p>Anote aniversários, compromissos, coisas pra buscar… O celular te lembra na hora certa.</p></div>`}
    ${bdays.length ? `<section class="block"><h2 class="block__title">🎂 Próximos aniversários</h2><div class="plist">${bdays.map((o) => `<div class="prow" style="--pc:#FF2D55" data-action="p-open" data-id="${o.item.id}" data-date="${o.date}"><span class="prow__emo">🎂</span><div class="prow__body"><strong>${esc(o.item.title)}</strong><small>${esc(dayLabel(o.date))} · em ${diffDays(t, o.date)} dia${diffDays(t, o.date) > 1 ? 's' : ''}</small></div></div>`).join('')}</div></section>` : ''}
    <div style="height:24px"></div>
  </div>`;
}

export function bindPersonal(view) {
  const f = view.querySelector('[data-form="pquick"]');
  if (!f) return;
  f.onsubmit = () => {
    const q = f.q.value.trim();
    if (!q) return openPersonalEditor();
    f.q.value = '';
    const it = savePersonal({ ...parseQuick(q), remind: 'auto' });
    const c = CATS[it.cat];
    toast(`${c.emoji} Anotado: ${dayLabel(it.date)}${it.time ? ' às ' + fmtTime(it.time) : ''}`, { action: 'Ajustar', onAction: () => openPersonalEditor(it.id), ms: 4000 });
    return false;
  };
}

export const personalActions = {
  'p-open': (b) => openPersonalEditor(b.dataset.id),
  'p-done': (b) => {
    const it = personal.item(b.dataset.id);
    if (!it) return;
    const was = doneOn(it, b.dataset.date);
    toggleDone(it, b.dataset.date);
    if (!was) toast('Feito ✓', { action: 'Desfazer', onAction: () => toggleDone(personal.item(it.id), b.dataset.date) });
  },
  'p-new': () => openPersonalEditor(),
};

export function openPersonalEditor(id = null) {
  const old = id ? personal.item(id) : null;
  const d = old ? { ...old } : { title: '', date: todayKey(), time: '', cat: 'lembrete', repeat: 'none', note: '', remind: 'auto' };
  const api = openSheet({
    className: 'sheet--tall',
    html: `${sheetHead(old ? 'Editar' : 'Anotar', { left: '<button class="btn-text" data-close>Cancelar</button>', right: '<button class="btn btn--primary btn--sm" data-save>Salvar</button>' })}
    <form class="form" onsubmit="return false">
      <div class="fgroup"><label class="flabel">Tipo</label><div class="pcats">
        ${Object.entries(CATS).map(([k, c]) => `<button type="button" class="pcat${d.cat === k ? ' is-on' : ''}" style="--pc:${c.color}" data-cat="${k}"><span>${c.emoji}</span>${esc(c.label)}</button>`).join('')}
      </div></div>
      <div class="fgroup"><label class="flabel" for="p-title">O quê?</label><input id="p-title" class="input" name="title" value="${esc(d.title)}" placeholder="Ex.: Buscar a Ana no trabalho" maxlength="120" autocomplete="off"></div>
      <div class="fgroup row2">
        <div><label class="flabel" for="p-date">Dia</label><input id="p-date" class="input" type="date" name="date" value="${d.date}"></div>
        <div><label class="flabel" for="p-time">Horário (opcional)</label><input id="p-time" class="input" type="time" name="time" value="${d.time || ''}" step="300"></div>
      </div>
      <div class="fgroup row2">
        <div><label class="flabel" for="p-rep">Repetir</label><select id="p-rep" class="input" name="repeat">${Object.entries(REPEATS).map(([k, l]) => `<option value="${k}"${(d.repeat || 'none') === k ? ' selected' : ''}>${l}</option>`).join('')}</select></div>
        <div data-by ${d.cat === 'aniversario' ? '' : 'hidden'}><label class="flabel" for="p-year">Ano que nasceu</label><input id="p-year" class="input" type="number" inputmode="numeric" name="birthYear" value="${d.birthYear || ''}" placeholder="opcional" min="1900" max="2100"></div>
      </div>
      <div class="fgroup"><label class="flabel" for="p-note">Observação</label><textarea id="p-note" class="input" name="note" rows="3" placeholder="Endereço, telefone, o que levar…" maxlength="500">${esc(d.note || '')}</textarea></div>
      <label class="list__row premind"><span><b>Me lembrar no celular</b><small>Aniversário: na véspera às 20h e no dia às 8h · Com horário: 1h e 15 min antes e na hora · Sem horário: na véspera e às 8h</small></span><input type="checkbox" class="switch" name="remind" ${d.remind !== 'none' ? 'checked' : ''}></label>
      ${old ? `<button type="button" class="btn btn--block btn--danger-soft" data-del>${icon('trash', 16)} Apagar</button>` : ''}
      <div class="form__spacer"></div>
    </form>`,
    onMount: (a) => {
      const el = a.el, form = el.querySelector('form');
      el.querySelectorAll('[data-cat]').forEach((b) => (b.onclick = () => {
        d.cat = b.dataset.cat;
        el.querySelectorAll('[data-cat]').forEach((x) => x.classList.toggle('is-on', x === b));
        el.querySelector('[data-by]').hidden = d.cat !== 'aniversario';
        if (d.cat === 'aniversario' && form.repeat.value === 'none') form.repeat.value = 'yearly';
      }));
      el.querySelector('[data-save]').onclick = () => {
        const title = form.title.value.trim();
        if (!title) { form.title.focus(); return toast('Escreva o que é'); }
        savePersonal({ ...d, title, date: form.date.value || todayKey(), time: form.time.value || null, repeat: form.repeat.value, note: form.note.value.trim(), birthYear: +form.birthYear.value || null, remind: form.remind.checked ? 'auto' : 'none' });
        a.close();
        toast('Salvo');
      };
      const del = el.querySelector('[data-del]');
      if (del) del.onclick = async () => {
        if (!(await confirmDialog({ title: 'Apagar?', text: old.title, ok: 'Apagar', danger: true }))) return;
        removePersonal(old.id);
        a.close();
        toast('Apagado', { action: 'Desfazer', onAction: () => savePersonal(old) });
      };
      if (!old) setTimeout(() => form.title.focus(), 300);
    },
  });
  return api;
}
