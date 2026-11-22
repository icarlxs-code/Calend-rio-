/* Suporte: chat da pessoa com o dono do app (mensagens guardadas no servidor de avisos).
   A pessoa escreve → o dono recebe notificação → resposta automática "respondemos em até 24h".
   O dono responde pelo Painel do dono → a pessoa recebe notificação e vê aqui. */
import { store } from '../store.js';
import { openSheet, sheetHead, toast, confirmDialog } from '../components.js';
import { icon } from '../icons.js';
import { esc } from '../utils.js';
import { brand } from '../brand.js';

const api = async (path, body = {}) => (await import('../avisos.js')).api(path, body);
const hm = (ms) => new Date(ms).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
const bubbles = (msgs, mine) => (msgs || []).map((m) => m.from === 'closed' ? `<div class="smsg-closed">${icon('check', 14)} ${esc(m.text)}<time>${hm(m.at)}</time></div>` : `<div class="smsg ${m.from === mine ? 'smsg--me' : m.from === 'auto' ? 'smsg--auto' : ''}">
    ${m.from === 'auto' ? `<small><span class="smsg__av">${brand('letra', { h: 12 })}</span> Suporte Lembra · resposta automática</small>` : m.from !== mine ? `<small>${m.from === 'owner' ? `<span class="smsg__av">${brand('letra', { h: 12 })}</span> Suporte Lembra` : 'Cliente'}</small>` : ''}
    <p>${esc(m.text)}</p><time>${hm(m.at)}</time></div>`).join('');
const box = (placeholder) => `<form class="schat__form" data-sform><textarea name="t" rows="1" maxlength="1000" placeholder="${placeholder}"></textarea><button class="iconbtn iconbtn--accent" aria-label="Enviar">${icon('right', 18)}</button></form>`;
function wire(a, send) {
  const f = a.el.querySelector('[data-sform]');
  const list = a.el.querySelector('[data-list]');
  if (list) list.scrollTop = list.scrollHeight;
  if (!f) return;
  const ta = f.querySelector('textarea');
  ta.oninput = () => { ta.style.height = 'auto'; ta.style.height = Math.min(140, ta.scrollHeight) + 'px'; };
  f.onsubmit = async (e) => {
    e.preventDefault();
    const text = ta.value.trim();
    if (!text) return;
    f.querySelector('button').disabled = true;
    try { await send(text); } catch (x) { toast(x.message || 'Não consegui enviar. Tente de novo.'); f.querySelector('button').disabled = false; }
  };
}

/* Para a pessoa: abre o chat com o suporte */
export async function openSupport() {
  if (store.mode !== 'cloud') { toast('O suporte precisa de internet e da sua conta.'); return; }
  let msgs = [];
  const html = () => `${sheetHead('Suporte Lembra', { left: '<button class="btn-text" data-close>Fechar</button>' })}
    <div class="schat">
      <div class="schat__who"><span class="schat__logo">${brand('simbolo', { h: 30 })}</span><div><b>Suporte Lembra</b><small>Equipe do Lembra · responde em até 24h</small></div></div>
      <div class="schat__list" data-list>
        <div class="smsg smsg--auto"><p>Oi${store.member(store.me)?.name ? ', ' + esc(store.member(store.me).name) : ''}! 👋 Conte aqui sua dúvida, problema ou sugestão. A gente lê tudo.</p></div>
        ${bubbles(msgs, 'user')}
      </div>
      ${box('Escreva sua mensagem…')}
    </div>`;
  const a = openSheet({ className: 'sheet--tall', html: html(), onMount: (x) => wire(x, async (text) => { const r = await api('/support/send', { text }); msgs = r.thread || msgs; x.set(html()); }) });
  try { const r = await api('/support/thread'); msgs = r.thread || []; a.set(html()); } catch { /* sem conexão: mostra vazio */ }
  return a;
}

/* Para o dono: caixa de entrada e conversa */
let inboxOpen = null;
export async function openSupportInbox() {
  // já aberta (ex.: veio do aviso e do link ao mesmo tempo): não abre outra por cima
  if (inboxOpen && !inboxOpen.closed) return inboxOpen;
  let inbox = [], cur = null, thread = [], who = {};
  const html = () => cur ? `${sheetHead(esc(who.name || 'Conversa'), { left: '<button class="btn-text" data-back>Voltar</button>', right: who.closedAt ? '<button class="btn-text" data-reopen>Reabrir</button>' : '<button class="btn-text sresolve" data-resolve>Resolvido</button>' })}
    <div class="schat"><p class="fhelp" style="margin:8px 16px 0">${esc(who.email || '')}${who.guest ? ` · <b>sem login</b>: responda por e-mail · <a href="mailto:${esc(who.email || '')}?subject=${encodeURIComponent('Suporte Lembra')}">Escrever e-mail</a>` : ''}</p>
      <div class="schat__list" data-list>${bubbles(thread, 'owner')}</div>
      ${box('Responder…')}</div>`
    : `${sheetHead('Suporte · mensagens', { left: '<button class="btn-text" data-close>Fechar</button>' })}
    <div class="page page--sheet">
      ${inbox.length ? [['Abertos', inbox.filter((c) => !c.closed)], ['Resolvidos', inbox.filter((c) => c.closed)]].filter(([, l]) => l.length).map(([t, l]) => `<h3 class="ah">${t} · ${l.length}</h3><div class="glist">${l.map((c) => `<button class="sinbox" data-open="${esc(c.id)}">
        <div><strong>${esc(c.name || c.email || 'Sem nome')}</strong><small>${esc(c.last || '')}</small></div>
        <div class="sinbox__r"><time>${hm(c.at)}</time>${c.unread ? `<span class="sinbox__n">${c.unread}</span>` : c.closed ? '<small class="ok">✓ resolvido</small>' : c.answered ? '<small>respondido</small>' : ''}</div></button>`).join('')}</div>`).join('')
        : '<p class="fhelp">Nenhuma mensagem de suporte ainda.</p>'}
    </div>`;
  const a = openSheet({
    className: 'sheet--tall', html: html(),
    onMount: (x) => {
      x.el.querySelectorAll('[data-open]').forEach((b) => (b.onclick = async () => {
        b.disabled = true; b.classList.add('is-loading');
        try {
          const r = await api('/support/inbox', { id: b.dataset.open });
          cur = b.dataset.open; thread = r.thread || []; who = { name: r.name, email: r.email, closedAt: r.closedAt, guest: /^g[0-9a-f]{16}$/.test(b.dataset.open) }; x.set(html());
          const l = x.el.querySelector('[data-list]'); if (l) l.scrollTop = l.scrollHeight;
        } catch (e) { b.disabled = false; b.classList.remove('is-loading'); toast('Não consegui abrir a conversa: ' + (e.message || 'sem internet'), { ms: 4000 }); }
      }));
      const back = x.el.querySelector('[data-back]');
      if (back) back.onclick = async () => { cur = null; const r = await api('/support/inbox').catch(() => ({})); inbox = r.inbox || inbox; x.set(html()); };
      const res = x.el.querySelector('[data-resolve]'), reo = x.el.querySelector('[data-reopen]');
      if (res) res.onclick = async () => {
        if (!(await confirmDialog({ title: `Encerrar o atendimento de ${(who.name || 'cliente').split(' ')[0]}?`, text: 'Fica marcado como resolvido e a pessoa recebe um aviso. Se ela escrever de novo, o atendimento reabre sozinho.', ok: 'Marcar como resolvido' }))) return;
        try { const r = await api('/support/close', { id: cur }); thread = r.thread || thread; who.closedAt = r.closedAt; x.set(html()); toast('Atendimento resolvido ✓'); } catch (e) { toast(e.message || 'Não consegui agora.'); }
      };
      if (reo) reo.onclick = async () => { try { const r = await api('/support/close', { id: cur, reopen: true }); who.closedAt = r.closedAt; x.set(html()); toast('Atendimento reaberto'); } catch (e) { toast(e.message || 'Não consegui agora.'); } };
      if (cur) wire(x, async (text) => { const r = await api('/support/reply', { id: cur, text }); thread = r.thread || thread; x.set(html()); toast('Resposta enviada ✓'); });
    },
  });
  inboxOpen = a;
  try { const r = await api('/support/inbox'); inbox = r.inbox || []; a.set(html()); } catch (e) { toast('Não consegui abrir o suporte: ' + e.message); }
  return a;
}
