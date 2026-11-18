/* Assistente: conversa com o Claude dentro do app + análise automática da agenda */
import { store } from '../store.js';
import { ui } from '../ui.js';
import { TYPES, TYPE_ORDER, isPost } from '../constants.js';
import { esc, todayKey, addDays, fromKey, fmtTime, fmtDuration, dayLabel, WD_SHORT, toMin, nowMin } from '../utils.js';
import { icon } from '../icons.js';
import { openSheet, sheetHead, avatar, toast } from '../components.js';
import { dayBrief, freeTime, bestSlots, routine, evLabel } from '../planner.js';
import { personConflicts } from '../insights.js';
import { askClaude, PRESETS } from '../claude-link.js';

/* ---------- conversa ---------- */
const LS_CHAT = 'cal.chat';
let chat = (() => {
  try {
    return JSON.parse(localStorage.getItem(LS_CHAT) || '[]').slice(-30);
  } catch {
    return [];
  }
})();
let thinking = false;
const saveChat = () => {
  try {
    localStorage.setItem(LS_CHAT, JSON.stringify(chat.slice(-30)));
  } catch { /* ok */ }
};
/* texto simples com **negrito**, listas e quebras de linha (sempre escapado antes) */
const md = (t) => esc(t)
  .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
  .replace(/^#{1,4}\s*(.+)$/gm, '<b>$1</b>')
  .replace(/^\s*[-•*]\s+(.+)$/gm, '<span class="li">$1</span>')
  .replace(/<\/span>\n+(?=<span class="li">)/g, '</span>')
  .replace(/\n{2,}/g, '\n')
  .replace(/\n/g, '<br>');
const ERR = {
  'functions/failed-precondition': null, // usa a mensagem do servidor
  'functions/permission-denied': 'Só a equipe pode usar o assistente.',
  'functions/resource-exhausted': null,
  'functions/unavailable': 'Sem conexão com o assistente agora. Tente de novo.',
  'functions/deadline-exceeded': 'O assistente demorou demais. Tente de novo.',
};
function errText(e) {
  if (e?.code === 'local') return 'O assistente precisa da sincronização na nuvem ligada.';
  if (e?.code in ERR) return ERR[e.code] || e.message;
  if (e?.code === 'functions/not-found' || e?.code === 'functions/internal' && !/assistente|Claude/.test(e.message || '')) {
    return 'O assistente ainda não foi ligado no servidor. Falta publicar o servidor com a chave do Claude (veja o README, seção 5).';
  }
  return e?.message || 'Não consegui falar com o assistente.';
}
function chatHtml() {
  return `<section class="block" data-chat>
    <h2 class="block__title">${icon('sparkle', 16)} Pergunte ao assistente</h2>
    <div class="chat">
      ${chat.length ? chat.map((m) => `<div class="msg msg--${m.role}${m.error ? ' msg--err' : ''}">${md(m.text)}</div>`).join('')
        : `<div class="msg msg--assistant">Oi! Eu vejo a agenda inteira de vocês: posts, captações, reuniões, empresas e a rotina. Pergunte o que quiser, por exemplo “o que eu tenho amanhã?” ou “qual o melhor horário para um Reels da Pura Vida na sexta?”.</div>`}
      ${thinking ? `<div class="msg msg--assistant msg--typing"><i></i><i></i><i></i></div>` : ''}
    </div>
    <div class="presets">${PRESETS.map((p, i) => `<button class="preset" data-preset="${i}">${esc(p.label)}</button>`).join('')}</div>
    <form class="chat__form" data-chatform onsubmit="return false">
      <textarea class="input" rows="1" name="q" placeholder="Escreva sua pergunta…" ${thinking ? 'disabled' : ''}></textarea>
      <button class="iconbtn iconbtn--accent" type="submit" aria-label="Enviar" ${thinking ? 'disabled' : ''}>${icon('right', 20)}</button>
    </form>
    <div class="chat__foot">
      ${chat.length ? `<button class="btn-text btn-text--sm" data-clearchat>Limpar conversa</button>` : '<span></span>'}
      <button class="btn-text btn-text--sm" data-extclaude>Abrir no app do Claude</button>
    </div>
  </section>`;
}

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

      ${chatHtml()}

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

    </div>`;
  };

  const api = openSheet({
    className: 'sheet--tall',
    html: html(),
    onMount: (a) => {
      const el = a.el;
      el.querySelector('[data-f="type"]').onchange = (e) => { st.type = e.target.value; a.set(html()); };
      el.querySelector('[data-f="date"]').onchange = (e) => { if (e.target.value) { st.date = e.target.value; a.set(html()); } };
      el.querySelectorAll('[data-new]').forEach((b) => (b.onclick = async () => {
        const [who, time] = b.dataset.new.split('|');
        const { openEventEditor } = await import('./event.js');
        openEventEditor({ date: st.date, type: st.type, time, assignees: [who] });
      }));
      const send = async (q) => {
        q = (q || '').trim();
        if (!q || thinking) return;
        const history = chat.filter((m) => !m.error).map((m) => ({ role: m.role, text: m.text }));
        chat.push({ role: 'user', text: q });
        thinking = true;
        redrawChat(a);
        try {
          const answer = await store.askAssistant(q, history);
          chat.push({ role: 'assistant', text: answer });
        } catch (e) {
          chat.push({ role: 'assistant', text: errText(e), error: true });
        }
        thinking = false;
        saveChat();
        redrawChat(a);
      };
      bindChat(a, send);
    },
  });
  function redrawChat(a) {
    const box = a.el.querySelector('[data-chat]');
    if (!box) return;
    box.outerHTML = chatHtml();
    bindChat(a, a.send);
    const c = a.el.querySelector('.chat');
    if (c) c.lastElementChild?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
  function bindChat(a, send) {
    a.send = send;
    const el = a.el;
    el.querySelectorAll('[data-preset]').forEach((b) => (b.onclick = () => send(PRESETS[+b.dataset.preset].q)));
    const f = el.querySelector('[data-chatform]');
    const ta = f.q;
    ta.oninput = () => {
      ta.style.height = 'auto';
      ta.style.height = Math.min(ta.scrollHeight, 140) + 'px';
    };
    ta.onkeydown = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        send(ta.value);
      }
    };
    f.onsubmit = (e) => {
      e.preventDefault();
      send(ta.value);
    };
    const clr = el.querySelector('[data-clearchat]');
    if (clr) clr.onclick = () => {
      chat = [];
      saveChat();
      redrawChat(a);
    };
    el.querySelector('[data-extclaude]').onclick = () => askClaude(ta.value.trim() || 'Analise a agenda e me diga o que é mais importante agora.');
  }
  api.refresh = () => {
    const a = document.activeElement;
    if (a && api.el.contains(a) && /INPUT|TEXTAREA|SELECT/.test(a.tagName)) return; // não atrapalha quem está digitando
    const sc = api.el.scrollTop;
    api.set(html());
    api.el.scrollTop = sc;
  };
}
