/* Assistente: conversa com o Claude dentro do app + análise automática da agenda */
import { store } from '../store.js';
import { ui } from '../ui.js';
import { TYPES, TYPE_ORDER, isPost, isMarketing } from '../constants.js';
import { esc, todayKey, addDays, fromKey, fmtTime, fmtDuration, dayLabel, WD_SHORT, toMin, nowMin } from '../utils.js';
import { icon } from '../icons.js';
import { openSheet, sheetHead, avatar, toast, confirmDialog } from '../components.js';
import { dayBrief, freeTime, bestSlots, routine, evLabel } from '../planner.js';
import { personConflicts } from '../insights.js';
import { askClaude, presets } from '../claude-link.js';
import { planAction, congela, mudou, executa, desfaz, quantosApaga, pedeSegunda } from '../agent.js';
import { avisaApagado, listaHtml } from '../lixeira.js';
import { novoLote } from '../lixeira-core.js';
import { entende } from '../destino.js';
import { entendeConta, respostaConta } from '../contas.js';
import { personal, savePersonal, removePersonal, addMemo, guessCat, REPEATS } from '../personal.js';
import { reaisTxt, proximoDiaDoMes } from '../frase-conta.js';
import { ehConta, novaConta, proximo as proximoPasso, responde as respondeConta } from '../conta-conversa.js';
import { hasPro } from '../billing.js';
import { okFx } from '../okfx.js';

/* ---------- conversa ---------- */
const LS_CHAT = 'cal.chat';
let chat = (() => {
  try {
    // mensagens de erro antigas não ficam na conversa
    const L = JSON.parse(localStorage.getItem(LS_CHAT) || '[]');
    // passadas as 24 h da lixeira, a conversa também não guarda o conteúdo do que foi apagado
    for (const m of L) if (m.undo && Date.now() - (m.undo.at || 0) > 864e5) { delete m.undo; if (m.plan?.some((x) => x.apaga)) { m.plan = m.plan.map((x) => (x.apaga ? { ...x, text: 'Itens apagados', apaga: null, a: { acao: 'excluir' } } : x)); m.actions = m.plan.map((x) => x.a); } }
    return L.filter((m) => !m.error && !/chave do Claude/.test(m.text || '')).slice(-30);
  } catch {
    return [];
  }
})();
let thinking = false;
/* Resposta dentro do app só se o servidor tiver chave da Anthropic; senão, abre o Claude com o login normal */
let inAppChat = false;
(async () => {
  try {
    const { server } = await import('../avisos.js');
    if (server()) inAppChat = !!(await (await fetch(server() + '/health')).json()).chat;
  } catch { /* fica no modo "abrir no Claude" */ }
})();
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
/* Cartão com o que o assistente vai fazer na agenda */
function actionsCard(m, i) {
  if (!m.plan) m.plan = congela(m.actions); // congelado: o cartão e o Confirmar usam a mesma lista
  const plans = m.plan;
  const okCount = plans.filter((p) => p.ok).length;
  const st = m.actStatus || 'pending';
  const apaga = quantosApaga(plans), novos = plans.filter((p) => p.ok && !p.apaga).length;
  if (st === 'done' || st === 'undone' || st === 'cancelled') {
    const L = plans.filter((p) => p.ok);
    return `<details class="acard is-fim acard--${st}"><summary><span class="acard__ok">${icon(st === 'done' ? 'check' : 'x', 17)}</span><b>${st === 'done' ? esc(m.actResult || 'Pronto') : st === 'undone' ? esc(m.actResult || 'Desfeito') : 'Nada foi alterado'}</b>${st === 'done' && m.undo ? `<button class="acard__undo" data-act-undo="${i}">Desfazer</button>` : ''}</summary>${st === 'cancelled' ? '' : L.map((p) => `<div class="acard__row">${icon(p.apaga ? 'trash' : 'check', 15)}<span>${esc(p.text)}</span></div>`).join('')}${(m.result || []).filter((r) => !r.ok).map((r) => `<div class="acard__row"><span>${esc(r.title)}: ficou de fora</span></div>`).join('')}</details>`;
  }
  return `<div class="acard">
    <div class="acard__head"><b>${apaga && !novos ? 'Apagar estes?' : plans.some((p) => /^(Mover|Alterar)/.test(p.text)) ? 'Posso mudar?' : 'Quer que eu crie?'}</b><small>${okCount} ${okCount === 1 ? 'item' : 'itens'}</small></div>
    ${plans.map((p) => `<div class="acard__row${p.ok ? '' : ' is-bad'}">${p.ok ? `<span class="acard__ic">${icon(p.apaga ? 'trash' : 'calendar', 17)}</span>` : icon('alert', 16)}<span><b>${esc(p.titulo || p.text)}</b>${p.quando ? `<small class="is-q">${esc(p.quando)}</small>` : ''}${p.warn ? `<small>${esc(p.warn)}</small>` : ''}</span>${p.apaga ? '<em class="apaga">APAGA</em>' : p.novo ? '<em class="novo">Novo</em>' : ''}</div>${p.apaga ? listaHtml(p.apaga) : ''}`).join('')}
    ${okCount ? `<div class="acard__btns"><button class="btn btn--primary" data-act-ok="${i}">Confirmar</button><button class="btn btn--soft" data-act-no="${i}">Agora não</button></div>` : ''}
  </div>`;
}
/* Agenda ou nota? A pessoa escolhe antes de qualquer coisa ser guardada */
const quandoTxt = (x) => `${x.repetir === 'monthly' ? `Todo dia ${x.diaMes || +String(x.data).slice(8)} · 1º ${dayLabel(x.data).toLowerCase()}` : x.repetir && x.repetir !== 'none' ? `${REPEATS[x.repetir] || 'Repete'} · desde ${dayLabel(x.data).toLowerCase()}` : dayLabel(x.data)}${x.hora ? ' às ' + fmtTime(x.hora) : ''}${Number(x.valor) > 0 ? ` · ${reaisTxt(x.valor)}` : ''}`;
function escolhaCard(m, i) {
  const x = m.escolha, st = m.escStatus || 'pergunta';
  if (st === 'feito') return `<div class="esco is-feito"><span class="esco__ok">${icon('check', 18)}</span><span class="esco__r"><b>${esc(m.escResult)}</b><small>${esc(x.titulo)}</small></span>${m.desfaz ? `<button class="btn-text btn-text--sm" data-esc-undo="${i}">Desfazer</button>` : ''}</div>`;
  if (st === 'cancelado') return '<div class="esco is-feito"><span class="esco__r"><small>Desfeito. Nada ficou guardado.</small></span></div>';
  return `<div class="esco">
    <div class="esco__q"><b>${esc(x.titulo)}</b><small>${x.data ? icon('clock', 14) + ' ' + esc(quandoTxt(x)) : 'Sem dia definido'}</small></div>
    ${st === 'dia' ? `<p class="esco__p">Para que dia?</p><div class="esco__dias"><button data-esc-dia="${i}" data-d="${todayKey()}">Hoje</button><button data-esc-dia="${i}" data-d="${addDays(todayKey(), 1)}">Amanhã</button><label>Outro dia<input type="date" data-esc-data="${i}" min="${todayKey()}" aria-label="Escolher o dia"></label></div>`
    : `<div class="esco__onde" role="group" aria-label="Em qual agenda"><button data-esc-esp="${i}" data-v="personal" aria-pressed="${x.espaco === 'personal'}">${icon('heart', 15)} Pessoal</button><button data-esc-esp="${i}" data-v="work" aria-pressed="${x.espaco === 'work'}">${icon('briefcase', 15)} Trabalho</button></div>
    <div class="esco__b"><button class="esco__op esco__op--ag" data-esc-ag="${i}">${icon('calendar', 26)}<b>Agenda ${x.espaco === 'work' ? 'de trabalho' : 'pessoal'}</b><small>Aparece no dia e eu te aviso</small></button>${x.nota ? '' : `<button class="esco__op" data-esc-nota="${i}">${icon('note', 26)}<b>Só nota</b><small>Guarda o texto, sem aviso</small></button>`}</div>`}
  </div>`;
}
async function guarda(m, onde) {
  const x = m.escolha;
  if (onde === 'nota') {
    const it = addMemo(x.texto); if (!it) return false;
    m.escStatus = 'feito'; m.escResult = 'Guardado nas Notas'; m.desfaz = { pessoal: it.id };
    okFx({ title: 'Nota guardada!', sub: 'Sem aviso', item: { title: x.texto, date: it.date } });
    return true;
  }
  if (!x.data) { m.escStatus = 'dia'; return true; }
  if (x.espaco === 'work') {
    const antes = new Set(store.state.events.map((e) => e.id));
    const co = store.companiesSorted().find((c) => c.name && x.texto.toLowerCase().includes(c.name.toLowerCase()));
    const p = planAction({ acao: 'criar', titulo: x.titulo, data: x.data, inicio: x.hora, empresa: co ? co.name : '' });
    if (!p.ok) { // falta algo (ex.: a empresa): abre o cadastro já preenchido
      const { openEventEditor } = await import('./event.js'); openEventEditor({ title: x.titulo, date: x.data, time: x.hora });
      m.escStatus = 'feito'; m.escResult = 'Abri o cadastro do trabalho: complete e salve'; m.desfaz = null;
      return true;
    }
    if (!(await p.run())) return false;
    const novo = store.state.events.find((e) => !antes.has(e.id)); if (!novo) return false;
    m.desfaz = { trab: novo.id };
  } else {
    const rep = x.repetir || 'none';
    const it = savePersonal({ title: x.titulo, date: x.data, time: x.hora, cat: x.cat || guessCat(x.texto), repeat: rep, ...(rep === 'monthly' && x.diaMes ? { diaMes: x.diaMes } : {}), ...(Number(x.valor) > 0 ? { valor: Number(x.valor) } : {}), remind: 'auto' }); if (!it) return false;
    m.desfaz = { pessoal: it.id };
  }
  if (x.nota && personal.item(x.nota)) { const lt = removePersonal(x.nota, { via: 'assistente' }); m.notaLote = lt; } // a nota virou compromisso (fica na lixeira por 24 h)
  m.escStatus = 'feito'; m.escResult = `Na agenda ${x.espaco === 'work' ? 'de trabalho' : 'pessoal'}: ${quandoTxt(x)}`;
  okFx({ title: 'Na agenda!', sub: quandoTxt(x), item: { title: x.titulo, date: x.data, time: x.hora } });
  return true;
}
const ERR = {
  'functions/failed-precondition': null, // usa a mensagem do servidor
  'functions/permission-denied': 'Só a equipe pode usar o assistente.',
  'functions/resource-exhausted': null,
  'functions/unavailable': 'Sem conexão com o assistente agora. Tente de novo.',
  'functions/deadline-exceeded': 'O assistente demorou demais. Tente de novo.',
};
function errText(e) {
  if (e?.code === 'local') return 'O assistente precisa da sincronização na nuvem ligada.';
  if (e?.code === 'no-server') return 'O assistente está fora do ar agora. Sua agenda continua aqui.';
  if (e?.status) return e.message;
  if (e?.code in ERR) return ERR[e.code] || e.message;
  if (e?.code === 'functions/not-found' || e?.code === 'functions/internal' && !/assistente|Claude/.test(e.message || '')) {
    return 'O assistente está fora do ar agora. Sua agenda continua aqui.';
  }
  return e?.message || 'Não consegui falar com o assistente.';
}
/* Pedidos antigos (de antes do assistente poder agir) que nunca foram feitos na agenda */
const ORDER = /\b(marc|coloc|agend|cri[ae]|lan[cç]|cadastr|inclu|adicion|bota|põe|poe|p[oô]r\b|mud|mov|remarc|passa|apag|exclu|tira|anot)/i;
function pendingOrders() {
  const out = [];
  chat.forEach((m, i) => {
    if (m.role !== 'user' || m.redone || chat[i + 1]?.escolha || !ORDER.test(m.text || '')) return;
    const next = chat[i + 1];
    if (next && next.role === 'assistant' && !next.error && Array.isArray(next.actions)) return; // já veio com ações
    out.push(i);
  });
  return out;
}
function chatHtml() {
  const pend = inAppChat && !thinking ? pendingOrders() : [];
  return `<section class="block" data-chat>
    ${pend.length ? `<div class="acard"><div class="acard__head">${icon('alert', 15)} Pedidos que ficaram sem fazer</div>
      ${pend.map((i) => `<div class="acard__row">${icon('calendar', 14)}<span>${esc(chat[i].text.slice(0, 160))}</span></div>`).join('')}
      <div class="acard__btns"><button class="btn btn--primary btn--sm" data-redo>Fazer agora</button><button class="btn btn--soft btn--sm" data-redo-skip>Ignorar</button></div></div>` : ''}
    <div class="chat" aria-live="polite">
      ${true ? `<p class="ia__aviso">IA pode errar · nada muda sem você confirmar</p>` : ''}${chat.length ? chat.map((m, i) => `<div class="msg msg--${m.role}${m.error ? ' msg--err' : ''}" data-i="${i}">${md(m.text)}${m.chips ? `<span class="msg__chips">${m.chips.map((c) => `<i>${esc(c)}</i>`).join('')}</span>` : ''}</div>${m.escolha ? escolhaCard(m, i) : ''}${m.actions && m.actions.length ? actionsCard(m, i) : ''}`).join('')
        : `<div class="assist-oi"><img src="assets/mascot/3d/acena.webp" alt="" width="132" height="132"><b>Oi! Como posso ajudar?</b><p>Peça do seu jeito: “dentista amanhã às 15h”, “o que tenho sexta?”, “apaga a reunião de segunda”.</p></div>`}
      ${thinking ? `<div class="msg msg--assistant msg--typing"><i></i><i></i><i></i></div>` : ''}
    </div>
    <div class="assist-pe"><div class="presets">${presets().map((p, i) => `<button class="preset" data-preset="${i}">${esc(p.label)}</button>`).join('')}</div>
    <form class="chat__form" data-chatform onsubmit="return false">
      <textarea class="input" rows="1" name="q" placeholder="Pergunte ou peça…" aria-label="Mensagem para o assistente" ${thinking ? 'disabled' : ''}></textarea>
      <button class="iconbtn iconbtn--accent" type="submit" aria-label="Enviar" ${thinking ? 'disabled' : ''}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5.5 11.5 12 5l6.5 6.5"/></svg></button>
    </form>
    ${inAppChat ? '' : '<button class="btn-text btn-text--sm" data-extclaude>Abrir no app do Claude</button>'}</div>
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

export function openAssistant(pergunta = '', { agenda = false, nota = '' } = {}) {
  const pro = hasPro();
  let modo = '';
  const st = { type: 'feed', date: ui.date >= todayKey() ? ui.date : todayKey(), q: '' };
  const html = () => {
    const t = todayKey();
    const problems = weekProblems();
    const r = routine();
    const week = Array.from({ length: 7 }, (_, i) => addDays(t, i));
    const slotDraft = { id: '__probe', type: st.type, date: st.date, assignees: [] };
    return modo === 'analise' ? `${sheetHead('Análise da agenda', { left: '<button class="btn-text" data-voltachat>Voltar</button>' })}<div class="page page--sheet">      ${!pro ? '<p class="fhelp">A análise faz parte do plano Profissional.</p>' : `
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
      </section>`}

</div>` : `<header class="assist-top"><button class="iconbtn" data-close aria-label="Voltar">${icon('left', 22)}</button><img src="assets/mascot/3d/joia.webp" alt="" width="46" height="46"><span><b>Lembra</b><small>Seu assistente da agenda</small></span><button class="iconbtn" data-opc aria-label="Opções">${icon('dots', 22)}</button></header>${chatHtml()}`;
  };

  const api = openSheet({
    className: 'sheet--tall sheet--assist',
    html: html(),
    onMount: (a) => {
      a.el.querySelector('[data-opc]')?.addEventListener('click', () => opcoes(a)); a.el.querySelector('[data-voltachat]')?.addEventListener('click', () => { modo = ''; a.set(html()); });
      const el = a.el;
      if (modo === 'analise' && pro) el.querySelector('[data-f="type"]').onchange = (e) => { st.type = e.target.value; a.set(html()); };
      if (modo === 'analise' && pro) el.querySelector('[data-f="date"]').onchange = (e) => { if (e.target.value) { st.date = e.target.value; a.set(html()); } };
      el.querySelectorAll('[data-new]').forEach((b) => (b.onclick = async () => {
        const [who, time] = b.dataset.new.split('|');
        const { openEventEditor } = await import('./event.js');
        openEventEditor({ date: st.date, type: st.type, time, assignees: [who] });
      }));
      const send = async (q) => {
        q = (q || '').trim();
        if (!q || thinking) return;
        // "desfaz" / "volta como estava": o último que o assistente fez nesta conversa
        const x0 = entende(q, ui.space === 'personal' ? 'personal' : 'work');
        if (x0 && x0.intencao === 'desfazer') {
          const u = [...chat].reverse().find((m) => m.undo || (m.escStatus === 'feito' && m.desfaz)); chat.push({ role: 'user', text: q });
          if (u && u.undo) await desfazMsg(u, null); else if (u) await desfazEscolha(u);
          chat.push({ role: 'assistant', text: u ? u.actResult || 'Desfeito. Nada ficou guardado.' : 'Não tem nada pra desfazer agora.' }); saveChat(); redrawChat(a); return;
        }
        if (x0 && x0.intencao === 'qual') { chat.push({ role: 'user', text: q }, { role: 'assistant', text: `O que você quer ${/^desmarc/.test(x0.verbo) ? 'desmarcar' : /^cancel/.test(x0.verbo) ? 'cancelar' : 'tirar'}?` }); saveChat(); redrawChat(a); return; }
        // conta de empréstimo ou parcela: quem faz é o app, nunca a IA
        const conta = entendeConta(q, todayKey());
        if (conta) { const r = respostaConta(conta); chat.push({ role: 'user', text: q }, { role: 'assistant', text: r.texto, chips: r.chips, actions: r.acoes, actStatus: 'pending' }); saveChat(); redrawChat(a); return; }
        // conta que se repete (aluguel, boleto…): conversa de verdade, uma pergunta por vez
        // com a IA ligada (plano Profissional), a conversa é toda com ela: entende, pergunta o que falta e lembra do que já foi dito
        const ia = pro && inAppChat;
        const ativa = ia ? null : [...chat].reverse().find((m) => m.role === 'assistant' && m.coleta && !m.coleta.fim);
        if (ativa) {
          chat.push({ role: 'user', text: q });
          const r = respondeConta(ativa.coleta, q);
          ativa.coleta = null;
          const msg = { role: 'assistant', text: r.fala };
          chat.push(msg);
          if (r.salvar) {
            const c = r.c, diaMes = c.diaMes || 0;
            const x = { texto: c.titulo, titulo: c.titulo, data: diaMes ? proximoDiaDoMes(diaMes, todayKey()) : todayKey(), hora: null, cat: guessCat(c.titulo), espaco: c.espaco || 'personal', repetir: diaMes ? 'monthly' : 'none', ...(diaMes ? { diaMes } : {}), ...(c.valor > 0 ? { valor: c.valor } : {}) };
            msg.escolha = x;
            const ok = c.destino === 'nota' ? await guarda(msg, 'nota') : await guarda(msg, 'agenda');
            msg.text = ok ? `${r.fala}\n\n${msg.escResult || 'Guardado.'}${diaMes ? ` Vai repetir todo dia ${diaMes}.` : ''}` : 'Não consegui guardar agora. Tenta de novo?';
          } else if (!r.fim) {
            msg.coleta = r.c;
          }
          saveChat(); redrawChat(a);
          return;
        }
        if (!ia && x0 && ehConta(x0, q)) {
          const c = novaConta(x0, q), p = proximoPasso(c);
          chat.push({ role: 'user', text: q }, { role: 'assistant', text: p.fala, coleta: c });
          saveChat(); redrawChat(a);
          return;
        }
        // coisa para guardar: pergunta o lugar (ou vai direto quando a pessoa já disse)
        const x = ia ? null : x0;
        if (x) {
          const m = { role: 'assistant', text: x.dito ? 'Certo!' : 'Onde eu guardo isso?', escolha: x };
          chat.push({ role: 'user', text: q }, m);
          if (x.dito && !(await guarda(m, x.dito))) m.text = 'Não consegui guardar. Escolha de novo:';
          saveChat(); redrawChat(a);
          return;
        }
        if (!pro) {
          toast('Perguntar à IA faz parte do plano Profissional. Marcar e anotar é livre.', { ms: 4500 });
          const p = document.createElement('button'); p.dataset.action = 'plans'; p.hidden = true; document.body.appendChild(p); p.click(); p.remove();
          return;
        }
        // sem chave no servidor: abre o Claude com o login normal (precisa ser no mesmo toque)
        if (!inAppChat) {
          askClaude(q);
          chat.push({ role: 'user', text: q });
          chat.push({ role: 'assistant', text: 'Abri sua pergunta no **app do Claude**, com o seu login, já com a ' + (store.team.length > 1 ? 'agenda de vocês' : 'sua agenda') + '. É só tocar em enviar lá. A agenda também foi copiada: se a mensagem aparecer vazia, segure no campo e toque em **Colar**.' });
          saveChat();
          redrawChat(a);
          return;
        }
        const history = chat.filter((m) => !m.error).map((m) => ({ role: m.role, text: m.text + (m.escolha ? ` (${m.escolha.titulo}: ${m.escStatus === 'feito' ? m.escResult : 'ainda não guardado'})` : '') + (m.actions?.length ? (m.actStatus === 'done' ? ' (ações confirmadas e feitas na agenda)' : m.actStatus === 'cancelled' ? ' (a pessoa cancelou essas ações)' : ' (ações aguardando confirmação)') : '') }));
        chat.push({ role: 'user', text: q });
        thinking = true;
        redrawChat(a);
        try {
          const r = await store.askAssistant(q, history);
          const text = typeof r === 'string' ? r : r.text;
          const actions = typeof r === 'string' ? [] : r.actions || [];
          const so = actions.length === 1 ? actions[0] : null;
          if (so && /^(pessoal|anota[cç][aã]o|bilhete)$/i.test(so.acao || '') && (!so.repetir || so.repetir === 'none') && !so.datas) { // a IA não decide sozinha entre agenda e nota
            const e2 = entende(q.slice(0, 160).replace(/\?+$/, ''), 'personal') || {};
            chat.push({ role: 'assistant', text: text || 'Onde eu guardo isso?', escolha: { texto: so.texto || so.titulo || q, titulo: so.titulo || e2.titulo || so.texto || q, data: so.data || e2.data || null, hora: so.inicio || so.hora || e2.hora || null, cat: so.categoria, espaco: 'personal' } });
            thinking = false; saveChat(); redrawChat(a);
            return;
          }
          chat.push({ role: 'assistant', text: text || 'Certo.', actions, actStatus: actions.length ? 'pending' : undefined });
        } catch (e) {
          chat.push({ role: 'assistant', text: errText(e), error: true });
        }
        thinking = false;
        saveChat();
        redrawChat(a);
      };
      if (modo !== 'analise') bindChat(a, send); else a.send = send;
    },
  });
  /* ⋯ do cabeçalho */
  function opcoes(a) {
    const o = openSheet({ className: 'sheet--solid', html: `${sheetHead('Assistente', { left: '<button class="btn-text" data-close>Fechar</button>' })}<div class="page page--sheet"><div class="agroup"><button class="frow" data-o="an">${icon('today', 18)}<span class="frow__id"><b>Análise da agenda</b><small>Conflitos, tempo livre e melhores horários</small></span></button><button class="frow" data-o="ia">${icon('sparkle', 18)}<span class="frow__id"><b>Ajustes de IA</b></span></button>${chat.length ? `<button class="frow is-danger" data-o="li">${icon('trash', 18)}<span class="frow__id"><b>Limpar conversa</b><small>Sua agenda não muda</small></span></button>` : ''}</div></div>`, onMount: (x) => x.el.querySelectorAll('[data-o]').forEach((b) => (b.onclick = async () => { o.close(); const k = b.dataset.o; if (k === 'an') { modo = 'analise'; a.set(html()); } if (k === 'ia') (await import('../ia-consent.js')).pedeIa({ motivo: 'usar o assistente' }); if (k === 'li' && (await confirmDialog({ title: 'Limpar a conversa?', text: 'Só as mensagens daqui. Sua agenda não muda.', ok: 'Limpar' }))) { chat = []; saveChat(); redrawChat(a); } })) });
  }
  async function denuncia(i) {
    const m = chat[i]; if (!m || m.role !== 'assistant' || m.error) return;
    if (!(await confirmDialog({ title: 'Denunciar esta resposta?', text: 'O começo do texto vai para a nossa revisão.', ok: 'Denunciar' }))) return;
    try { const { api } = await import('../avisos.js'); await api('/friends/report', { ws: '', owner: 'ia', id: '', motivo: `Resposta da IA: ${String(m.text).slice(0, 150)}` }); } catch { /* ok */ }
    toast('Obrigado! Vamos revisar essa resposta.');
  }
  function redrawChat(a) {
    const box = a.el.querySelector('[data-chat]');
    if (!box) return;
    box.outerHTML = chatHtml();
    bindChat(a, a.send);
    const c = a.el.querySelector('.chat');
    if (c) c.scrollTo({ top: c.scrollHeight, behavior: 'smooth' });
  }
  async function desfazEscolha(m) { const d = m.desfaz || {}; if (d.pessoal) removePersonal(d.pessoal, { via: 'assistente' }); if (d.trab) await store.removeMany('events', [d.trab], { via: 'assistente' }); if (m.notaLote) { const { restauraLote } = await import('../lixeira.js'); await restauraLote(m.notaLote); m.notaLote = null; } m.escStatus = 'cancelado'; m.desfaz = null; }
  async function desfazMsg(m, a) {
    if (!m || !m.undo) return;
    const n = await desfaz(m.undo); m.undo = null; m.actStatus = 'undone'; m.actResult = n ? 'Desfeito: voltou como estava.' : 'Não deu para desfazer: já saiu da lixeira.';
    saveChat(); toast(n ? 'Voltou como estava ✓' : 'Já saiu da lixeira.'); if (a && !a.closed) redrawChat(a);
  }
  function bindChat(a, send) {
    a.send = send;
    const el = a.el;
    el.querySelectorAll('[data-preset]').forEach((b) => (b.onclick = () => { const p = presets()[+b.dataset.preset]; if (!p.escreve) return send(p.q); const t = el.querySelector('[data-chatform]').q; t.value = p.escreve; t.focus(); t.setSelectionRange(t.value.length, t.value.length); }));
    el.querySelectorAll('.msg--assistant[data-i]').forEach((n) => { let t = 0; n.addEventListener('pointerdown', () => { t = setTimeout(() => denuncia(+n.dataset.i), 650); }); ['pointerup', 'pointermove', 'pointercancel', 'pointerleave'].forEach((e) => n.addEventListener(e, () => clearTimeout(t))); });
    el.querySelectorAll('[data-act-ok]').forEach((b) => (b.onclick = async () => {
      const m = chat[+b.dataset.actOk];
      if (!m || m.actStatus !== 'pending') return;
      b.disabled = true;
      m.plan = m.plan || congela(m.actions);
      if (mudou(m.plan)) { m.plan = congela(m.actions); saveChat(); toast('A agenda mudou. Confira a lista de novo.'); redrawChat(a); return; }
      const q = quantosApaga(m.plan);
      if (pedeSegunda(m.plan) && !(await confirmDialog({ title: `Apagar ${q} ${q === 1 ? 'item' : 'itens'}?`, text: 'Vão para a lixeira por 24 horas.', html: listaHtml(m.plan.filter((x) => x.ok && x.apaga).flatMap((x) => x.apaga)), ok: `Apagar ${q}`, danger: true }))) { b.disabled = false; return; }
      if (mudou(m.plan)) { m.plan = congela(m.actions); saveChat(); toast('A agenda mudou. Confira a lista de novo.'); redrawChat(a); return; }
      const lote = novoLote(), r = await executa(m.plan, { lote });
      m.undo = r.undo; m.actStatus = 'done';
      m.actResult = `${r.apagou ? `${r.apagou} ${r.apagou === 1 ? 'item' : 'itens'} na lixeira` : ''}${r.apagou && r.n > r.apagou ? ' · ' : ''}${r.n > r.apagou || !r.apagou ? `${r.n - r.apagou} alteraç${r.n - r.apagou === 1 ? 'ão feita' : 'ões feitas'}` : ''}${r.fails ? ` · ${r.fails} não deu para fazer` : ''}.`;
      saveChat();
      toast(r.n ? (r.apagou ? `✓ ${r.apagou} ${r.apagou === 1 ? 'item' : 'itens'} na lixeira` : 'Pronto! Agenda atualizada ✓') : 'Nada foi alterado', r.n ? { action: 'Desfazer', ms: 10000, onAction: () => desfazMsg(m, a) } : {});
      redrawChat(a);
    }));
    const esco = (attr, fn) => el.querySelectorAll(`[data-esc-${attr}]`).forEach((b) => { const k = 'esc' + attr[0].toUpperCase() + attr.slice(1); b[b.tagName === 'INPUT' ? 'onchange' : 'onclick'] = async () => { const m = chat[+b.dataset[k]]; if (!m || !m.escolha || m._b) return; m._b = 1; try { await fn(m, b); } finally { delete m._b; } saveChat(); redrawChat(a); }; });
    esco('esp', (m, b) => { m.escolha.espaco = b.dataset.v; });
    esco('ag', (m) => guarda(m, 'agenda'));
    esco('nota', (m) => guarda(m, 'nota'));
    esco('dia', (m, b) => { m.escolha.data = b.dataset.d; return guarda(m, 'agenda'); });
    esco('data', (m, b) => { if (!b.value) return null; m.escolha.data = b.value; return guarda(m, 'agenda'); });
    esco('undo', (m) => desfazEscolha(m));
    el.querySelectorAll('[data-act-undo]').forEach((b) => (b.onclick = () => { b.disabled = true; desfazMsg(chat[+b.dataset.actUndo], a); }));
    const redo = el.querySelector('[data-redo]');
    if (redo) redo.onclick = () => {
      const pend = pendingOrders();
      const text = pend.map((i) => chat[i].text);
      pend.forEach((i) => (chat[i].redone = true));
      saveChat();
      send(`Antes eu pedi isto e não foi feito na agenda. Faça agora (gere as ações), considerando a conversa:\n- ${text.join('\n- ')}`);
    };
    const skip = el.querySelector('[data-redo-skip]');
    if (skip) skip.onclick = () => { pendingOrders().forEach((i) => (chat[i].redone = true)); saveChat(); redrawChat(a); };
    el.querySelectorAll('[data-act-no]').forEach((b) => (b.onclick = () => {
      const m = chat[+b.dataset.actNo];
      if (!m) return;
      m.actStatus = 'cancelled';
      saveChat();
      redrawChat(a);
    }));
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
    const ext = el.querySelector('[data-extclaude]'); if (ext) ext.onclick = () => askClaude(ta.value.trim() || 'Analise a agenda e me diga o que é mais importante agora.');
  }
  if (pergunta) setTimeout(() => {
    if (!agenda) return api.send(pergunta);
    const e0 = entende(pergunta, 'personal'), x = (e0 && !e0.intencao && e0) || { texto: pergunta, titulo: pergunta.slice(0, 120), data: null, hora: null, espaco: 'personal' };
    chat.push({ role: 'user', text: pergunta }, { role: 'assistant', text: 'Vamos colocar na agenda:', escolha: { ...x, nota } }); saveChat(); redrawChat(api);
  }, 380);
  api.refresh = () => {
    const a = document.activeElement;
    if (a && api.el.contains(a) && /INPUT|TEXTAREA|SELECT/.test(a.tagName)) return; // não atrapalha quem está digitando
    const sc = api.el.scrollTop;
    api.set(html());
    api.el.scrollTop = sc;
  };
}
