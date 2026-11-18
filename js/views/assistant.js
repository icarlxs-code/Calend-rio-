/* Assistente: análise automática da agenda + "Perguntar ao Claude" (login normal) */
import { store } from '../store.js';
import { ui } from '../ui.js';
import { TYPES, TYPE_ORDER, isPost } from '../constants.js';
import { esc, todayKey, addDays, fromKey, fmtTime, fmtDuration, dayLabel, WD_SHORT, toMin, nowMin } from '../utils.js';
import { icon } from '../icons.js';
import { openSheet, sheetHead, avatar, toast } from '../components.js';
import { dayBrief, freeTime, bestSlots, routine, evLabel } from '../planner.js';
import { personConflicts } from '../insights.js';
import { askClaude, PRESETS } from '../claude-link.js';

const esca = (o) => esc(JSON.stringify(o));

/* Lista de problemas dos próximos 7 dias, com correções de 1 toque */
export function weekProblems(person = 'all') {
  const t = todayKey();
  const people = person === 'all' ? store.team.map((m) => m.id) : [person];
  const out = [];
  const seen = new Set();
  for (let i = 0; i < 7; i++) {
    const d = addDays(t, i);
    people.forEach((p) => personConflicts(p, d).forEach((c) => {
      const key = c.ids.slice().sort().join('|') + c.title;
      if (seen.has(key)) return;
      seen.add(key);
      out.push({ ...c, date: d });
    }));
    const orphan = store.eventsOn(d).filter((e) => !(e.assignees || []).length && e.status !== 'feito');
    orphan.forEach((e) => out.push({
      date: d, level: 'warn', icon: 'user', ids: [e.id], title: 'Sem responsável', text: `${fmtTime(e.time)} ${evLabel(e)}`,
      fixes: store.team.map((m) => ({ label: `Dar para ${m.name}`, eventId: e.id, patch: { assignees: [m.id] } })),
    }));
  }
  const late = store.state.events.filter((e) => e.status === 'pendente' && (e.date < t || (e.date === t && e.time && toMin(e.time) + 15 < nowMin())) && e.date >= addDays(t, -7));
  if (late.length) {
    out.unshift({ date: t, level: 'warn', icon: 'flag', ids: late.map((e) => e.id), title: `${late.length} tarefa${late.length > 1 ? 's' : ''} pendente${late.length > 1 ? 's' : ''} no passado`, text: 'Marquem como feito ou reagendem para o cronograma do cliente ficar correto.' });
  }
  return out;
}

export function openAssistant() {
  const st = { type: 'feed', date: ui.date >= todayKey() ? ui.date : todayKey(), q: '' };
  const html = () => {
    const t = todayKey();
    const problems = weekProblems();
    const r = routine();
    const week = Array.from({ length: 7 }, (_, i) => addDays(t, i));
    const slotDraft = { id: '__probe', type: st.type, date: st.date, assignees: [] };
    return `
    ${sheetHead('Assistente')}
    <div class="page page--sheet">
      <div class="assist-hero">
        <span class="assist-hero__ic">${icon('sparkle', 22)}</span>
        <div><strong>Analisando a agenda de vocês</strong><p>Funciona sozinho, sem internet. Confere conflitos, tempo livre e os melhores horários sempre que algo muda.</p></div>
      </div>

      <section class="block">
        <h2 class="block__title">${icon('today', 16)} Hoje</h2>
        <div class="card">${dayBrief(t).map((l) => `<p>${esc(l)}</p>`).join('')}</div>
        <h2 class="block__title">${icon('calendar', 16)} Amanhã</h2>
        <div class="card">${dayBrief(addDays(t, 1)).map((l) => `<p>${esc(l)}</p>`).join('')}</div>
      </section>

      <section class="block">
        <h2 class="block__title">${icon('alert', 16)} Precisa de atenção (7 dias)</h2>
        ${problems.length ? `<div class="tips">${problems.map((p) => `
          <div class="tip tip--${p.level}">
            <span class="tip__ic">${icon(p.icon, 16)}</span>
            <div>
              <small class="tip__date">${esc(dayLabel(p.date))}</small>
              <strong>${esc(p.title)}</strong><p>${esc(p.text)}</p>
              ${p.fixes?.length ? `<div class="fixes">${p.fixes.map((f) => `<button class="fixbtn" data-action="apply-fix" data-id="${f.eventId}" data-patch="${esca(f.patch)}">${icon('check', 13)} ${esc(f.label)}</button>`).join('')}</div>` : ''}
              ${p.ids?.length === 1 ? `<button class="btn-text btn-text--sm" data-action="open-event" data-id="${p.ids[0]}">Ver evento</button>` : ''}
            </div>
          </div>`).join('')}</div>`
          : `<div class="tip tip--ok"><span class="tip__ic">${icon('check', 16)}</span><div><strong>Tudo certo</strong><p>Nenhum conflito nos próximos 7 dias.</p></div></div>`}
      </section>

      <section class="block">
        <h2 class="block__title">${icon('clock', 16)} Tempo livre no expediente (${fmtTime(r.workStart)}–${fmtTime(r.workEnd)})</h2>
        <div class="freegrid">
          <span></span>${week.map((k) => `<span class="freegrid__d">${WD_SHORT[fromKey(k).getDay()]}<b>${fromKey(k).getDate()}</b></span>`).join('')}
          ${store.team.map((m) => `${avatar(m.id, 24)}${week.map((k) => {
            const f = freeTime(m.id, k);
            if (f.dayOff) return `<span class="freecell is-off">folga</span>`;
            const h = f.minutes / 60;
            const cls = h >= 4 ? 'is-good' : h >= 2 ? 'is-mid' : 'is-low';
            return `<span class="freecell ${cls}">${fmtDuration(Math.round(f.minutes / 15) * 15) || '0'}</span>`;
          }).join('')}`).join('')}
        </div>
        <p class="fhelp">Verde: dia tranquilo · amarelo: apertado · vermelho: sem respiro. Ajuste a rotina em Ajustes.</p>
      </section>

      <section class="block">
        <h2 class="block__title">${icon('bulb', 16)} Encontrar o melhor horário</h2>
        <div class="card">
          <div class="row2">
            <select class="input" data-f="type">${TYPE_ORDER.map((ty) => `<option value="${ty}"${st.type === ty ? ' selected' : ''}>${TYPES[ty].label}</option>`).join('')}</select>
            <input class="input" type="date" data-f="date" value="${st.date}">
          </div>
          ${store.team.map((m) => {
            const slots = bestSlots({ ...slotDraft }, { people: [m.id], limit: 4 });
            return `<div class="findrow">${avatar(m.id, 26)}<div class="hintbox__times">${slots.length ? slots.map((s) => `<button class="tchip" data-new="${m.id}|${s.time}">${fmtTime(s.time)}${s.peak ? '<small>pico</small>' : ''}</button>`).join('') : '<span class="muted">Sem horário livre</span>'}</div></div>`;
          }).join('')}
          <p class="fhelp">Toque num horário para já criar o evento com a pessoa certa.</p>
        </div>
      </section>

      <section class="block">
        <h2 class="block__title">${icon('sparkle', 16)} Perguntar ao Claude</h2>
        <div class="card">
          <p>Abre o Claude <b>com o seu login normal</b> (app ou site), já com a agenda de vocês e a pergunta prontas. Não precisa de chave.</p>
          <div class="presets">${PRESETS.map((p, i) => `<button class="preset" data-preset="${i}">${esc(p.label)}</button>`).join('')}</div>
          <textarea class="input" rows="3" data-f="q" placeholder="Ou escreva sua pergunta… ex.: monte o cronograma da Pura Vida para dezembro">${esc(st.q)}</textarea>
          <button class="btn btn--primary btn--block" data-ask>${icon('sparkle', 18)} Perguntar ao Claude</button>
          <p class="fhelp">A agenda também é copiada. Se o Claude abrir vazio, toque e segure no campo de mensagem e escolha <b>Colar</b>.</p>
        </div>
      </section>
    </div>`;
  };

  const api = openSheet({
    className: 'sheet--tall',
    html: html(),
    onMount: (a) => {
      const el = a.el;
      el.querySelector('[data-f="type"]').onchange = (e) => { st.type = e.target.value; a.set(html()); };
      el.querySelector('[data-f="date"]').onchange = (e) => { if (e.target.value) { st.date = e.target.value; a.set(html()); } };
      el.querySelector('[data-f="q"]').oninput = (e) => (st.q = e.target.value);
      el.querySelectorAll('[data-new]').forEach((b) => (b.onclick = async () => {
        const [who, time] = b.dataset.new.split('|');
        const { openEventEditor } = await import('./event.js');
        openEventEditor({ date: st.date, type: st.type, time, assignees: [who] });
      }));
      el.querySelectorAll('[data-preset]').forEach((b) => (b.onclick = () => askClaude(PRESETS[+b.dataset.preset].q)));
      el.querySelector('[data-ask]').onclick = () => {
        if (!st.q.trim()) return toast('Escreva a pergunta ou escolha uma sugestão');
        askClaude(st.q.trim());
      };
    },
  });
  api.refresh = () => {
    const a = document.activeElement;
    if (a && api.el.contains(a) && /INPUT|TEXTAREA|SELECT/.test(a.tagName)) return; // não atrapalha quem está digitando
    const sc = api.el.scrollTop;
    api.set(html());
    api.el.scrollTop = sc;
  };
}
