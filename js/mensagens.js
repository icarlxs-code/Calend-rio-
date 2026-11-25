/* Lista de conversas: arrastar para os lados (fixar, silenciar, arquivar, trancar), segurar abre o menu,
   e a busca acha conversa, amigo ou qualquer pessoa por nome, telefone, e-mail ou ID.
   A busca nunca é redesenhada enquanto a pessoa digita (no iPhone isso fechava o teclado). */
import { store } from './store.js';
import { openSheet, sheetHead, toast, confirmDialog } from './components.js';
import { icon } from './icons.js';
import { esc } from './utils.js';
import { boneco3d } from './cena.js';
import { call, podeSocial, ICO, rosto, desde, ouvir, atualiza, conversas, organiza, semSelecao } from './social.js';
import { entende, procura, abreAchar } from './achar.js';
import { tranca, estaAberta } from './tranca.js';

const online = (t) => t && Date.now() - t < 5 * 60e3;
const vib = (q) => { try { navigator.vibrate && navigator.vibrate(q); } catch { /* ok */ } };
const abre = async (uid, c) => (await import('./privado.js')).openConversa(uid, c);
const previa = (c) => `${c.meu ? 'Você: ' : ''}${c.unica ? `① ${c.tipo === 'audio' ? 'Áudio' : 'Foto'}` : c.tipo === 'foto' ? '📷 Foto' : c.tipo === 'audio' ? '🎤 Áudio' : c.tipo === 'apagada' ? 'Mensagem apagada' : c.tipo === 'story' ? `Respondeu ao story: ${c.txt}` : c.txt}`;
const PIN = '<svg class="ic" width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 2h8l-1 7 4 4v2h-6v6l-1 2-1-2v-6H5v-2l4-4z"/></svg>';
const ARQ = (t) => `<svg class="ic" width="${t}" height="${t}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="5" rx="1.5"/><path d="M5 9v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9M10 13h4"/></svg>`;

/** muda uma opção da conversa; volta atrás se o servidor recusar */
export async function muda(uid, campo, on, nome = '') {
  const T = { fix: ['Conversa fixada', 'Conversa solta'], arq: ['Conversa arquivada', 'Conversa de volta à lista'], tra: ['Conversa trancada', 'Conversa destrancada'], mudo: ['Conversa silenciada', 'Avisos ligados'] }[campo];
  if (campo === 'tra' && !(await tranca(on ? 'Trancar conversa' : 'Destrancar conversa'))) return false;
  try { await organiza(uid, campo, on); vib(10); toast(`${nome ? `${nome}: ` : ''}${T[on ? 0 : 1].toLowerCase()}`.replace(/^./, (x) => x.toUpperCase())); return true; } catch (e) { toast(e.message || 'Não consegui agora.'); return false; }
}

export async function openMensagens({ modo = '' } = {}) {
  if (!(await (await import('./comeco.js')).pedeIdade())) return null;
  if (!podeSocial()) return toast('Entre na sua conta para conversar com amigos.');
  if (modo === 'tra' && !(await tranca('Conversas trancadas'))) return null;
  let amigos = null, q = '', achado = null, vez = 0, aberta = null, arrasta = false, pendente = false;
  const cfg = () => conversas().cfg;
  const mortas = () => { // fixadas e trancadas continuam na lista mesmo depois que as mensagens somem
    const L = conversas().lista; return (amigos || []).filter((a) => !L.some((c) => c.uid === a.uid) && (cfg().fix.includes(a.uid) || cfg().tra.includes(a.uid) || cfg().arq.includes(a.uid))).map((a) => ({ ...a, ult: 0, novas: 0, vazia: true }));
  };
  const linha = (c) => {
    const f = cfg().fix.includes(c.uid), arq = cfg().arq.includes(c.uid), mudo = c.mudo, n = c.name;
    return `<div class="pvsw" data-sw="${esc(c.uid)}"><div class="pvsw__a pvsw__a--e" aria-hidden="true"><button tabindex="-1" data-ac="fix">${PIN.replace(/15/g, '22')}<span>${f ? 'Soltar' : 'Fixar'}</span></button><button tabindex="-1" data-ac="mudo">${icon(mudo ? 'bell' : 'eyeoff', 22)}<span>${mudo ? 'Avisar' : 'Silenciar'}</span></button></div>
      <div class="pvsw__a pvsw__a--d" aria-hidden="true"><button tabindex="-1" data-ac="tra">${icon('lock', 22)}<span>${modo === 'tra' ? 'Destrancar' : 'Trancar'}</span></button><button tabindex="-1" data-ac="arq">${ARQ(22)}<span>${arq ? 'Voltar' : 'Arquivar'}</span></button></div>
      <button class="pvrow${c.novas ? ' is-nova' : ''}" data-c="${esc(c.uid)}"><span class="pv__face">${rosto(c, 54)}${online(c.online) ? '<i class="pv__bola"></i>' : ''}</span><span class="pvrow__t"><b>${esc(n)}</b><small>${c.vazia ? 'Sem mensagens nas últimas 24 h' : esc(previa(c))}</small></span><span class="pvrow__d">${c.ult ? `<small>${desde(c.ult)}</small>` : ''}<span class="pvrow__i">${f ? `<i class="is-fix" aria-label="Fixada">${PIN}</i>` : ''}${mudo ? icon('eyeoff', 15) : ''}${c.novas ? `<em>${c.novas > 99 ? '99+' : c.novas}</em>` : c.meu && c.visto ? '<small class="pv__visto">visto</small>' : ''}</span></span></button></div>`;
  };
  const novo = (a) => `<button class="pvrow" data-c="${esc(a.uid)}"><span class="pv__face">${rosto(a, 48)}${online(a.online) ? '<i class="pv__bola"></i>' : ''}</span><span class="pvrow__t"><b>${esc(a.name)}</b><small>${online(a.online) ? 'online agora' : 'toque para mandar um oi'}</small></span>${ICO.chat(20)}</button>`;
  const fora = () => { // resultado fora da lista: telefone, e-mail ou ID
    const e = entende(q); if (!['tel', 'email', 'id', 'ddd', 'erro'].includes(e.tipo)) return '';
    if (e.tipo === 'erro') return /^[\d\s()+-]+$/.test(q.trim()) && q.replace(/\D/g, '').length > 3 ? `<p class="achar__msg">${esc(e.msg)}</p>` : '';
    if (e.tipo === 'ddd') return `<button class="pvrow pvrow--busca" data-ddd>${icon('phone', 22)}<span class="pvrow__t"><b>Procurar ${esc(q.trim())}</b><small>toque e diga o DDD</small></span>${icon('right', 18)}</button>`;
    if (!achado || achado.q !== q) return e.tipo === 'id' && !/^@/.test(q.trim()) && q.trim().length < 4 ? '' : '<div class="fx__load"><i></i><i></i><i></i></div>';
    if (achado.erro) return `<p class="achar__msg">${esc(achado.erro)}</p>`;
    if (!achado.row) return achado.self ? '<p class="achar__msg">Esse é você 😄</p>' : (e.tipo === 'id' && !/^@/.test(q.trim()) ? '' : '<p class="achar__msg">Ninguém com esse dado foi encontrado no Lembra.</p>');
    const c = achado.row; return `<h3 class="fx__h">No Lembra</h3><button class="pvrow" data-p="${esc(c.uid)}"><span class="pv__face">${rosto(c, 54)}</span><span class="pvrow__t"><b>${esc(c.name)}</b><small>${c.rel === 'amigo' ? 'Amigo · toque para conversar' : c.rel === 'enviado' ? 'Pedido enviado' : 'Toque para ver o perfil'}</small></span>${icon('right', 18)}</button>`;
  };
  const corpo = () => {
    const n = q.trim().toLowerCase(), nu = n.replace(/^@/, ''), bate = (x) => !n || x.name.toLowerCase().includes(nu), tr = cfg().tra, ar = cfg().arq;
    const soltas = (x) => (modo === 'tra' ? tr.includes(x.uid) : !tr.includes(x.uid)) && (modo === 'arq' ? ar.includes(x.uid) : modo === 'tra' || n ? true : !ar.includes(x.uid));
    const L = [...conversas().lista, ...mortas()].filter(soltas).filter(bate).sort((a, b) => (cfg().fix.includes(b.uid) ? 1 : 0) - (cfg().fix.includes(a.uid) ? 1 : 0) || b.ult - a.ult);
    const on = (amigos || []).filter((a) => online(a.online) && !tr.includes(a.uid)), sem = modo ? [] : (amigos || []).filter((a) => !tr.includes(a.uid) && !L.some((c) => c.uid === a.uid) && bate(a) && (n || !ar.includes(a.uid)));
    const nAr = ar.filter((u) => !tr.includes(u)).length, novasAr = conversas().lista.filter((c) => ar.includes(c.uid) && !tr.includes(c.uid) && c.novas).length;
    return `${!modo && !n && on.length ? `<div class="pv__on" role="list">${on.slice(0, 12).map((a) => `<button role="listitem" data-c="${esc(a.uid)}"><span class="pv__face">${rosto(a, 56)}<i class="pv__bola"></i></span><small>${esc(a.name.split(' ')[0])}</small></button>`).join('')}</div>` : ''}
      ${!modo && !n && tr.length ? `<button class="pvpasta" data-modo="tra">${icon('lock', 20)}<b>Conversas trancadas</b>${icon('right', 18)}</button>` : ''}
      ${!modo && !n && nAr ? `<button class="pvpasta" data-modo="arq">${ARQ(20)}<b>Arquivadas</b><small>${novasAr || nAr}</small>${icon('right', 18)}</button>` : ''}
      ${L.map(linha).join('')}${modo && !L.length ? `<p class="achar__msg">${modo === 'arq' ? 'Nenhuma conversa arquivada.' : 'Nenhuma conversa trancada.'}</p>` : ''}
      ${n && !modo ? fora() : ''}
      ${modo ? '' : amigos === null ? '<div class="fx__load"><i></i><i></i><i></i></div>' : !amigos.length && !n ? `<div class="pv__vazio">${boneco3d('triste', 150)}<h3>Ainda sem amigos por aqui</h3><p>Convide alguém e a conversa começa na hora.</p><button class="btn btn--primary" data-amigos>${icon('plus', 18)} Encontrar amigos</button></div>`
        : `${!L.length && !n && !tr.length && !nAr ? `<div class="pv__vazio">${boneco3d('acena', 150)}<h3>Nenhuma conversa agora</h3><p>Aqui as mensagens duram só 24 h. Manda um oi antes que o dia acabe!</p></div>` : ''}${sem.length ? `<h3 class="fx__h">Começar conversa</h3>${sem.slice(0, 40).map(novo).join('')}` : ''}${n && !L.length && !sem.length && entende(q).tipo === 'id' && achado && achado.q === q && !achado.row && !/^@/.test(q.trim()) ? '<p class="achar__msg">Ninguém com esse nome ou ID.</p>' : ''}`}`;
  };
  const html = () => `<div class="fx pv"><header class="fx__head"><button class="fx__pill" data-close>${modo ? 'Voltar' : 'Fechar'}</button><h2 class="fx__title">${modo === 'arq' ? 'Arquivadas' : modo === 'tra' ? 'Trancadas' : 'Mensagens'}</h2><span class="fx__right">${modo ? '' : `<button class="iconbtn" data-amigos aria-label="Amigos">${icon('users', 20)}</button>`}</span></header>
      ${modo ? '' : `<p class="pv__cadeado">${icon('lock', 14)} Privado · some em 24 h</p><label class="fsearch pv__busca">${icon('search', 18)}<input type="text" inputmode="search" enterkeyhint="search" placeholder="Nome, telefone ou ID" aria-label="Buscar por nome, telefone ou ID" autocapitalize="none" autocomplete="off" spellcheck="false" data-q><button type="button" class="pv__lq" data-lq aria-label="Limpar busca" hidden>${icon('x', 18)}</button></label>`}
      <div data-corpo>${corpo()}</div>
      ${modo ? '' : `<label class="pv__cfg"><span><b>Confirmação de leitura</b><small>Se desligar, você também não vê quando leram as suas</small></span><input type="checkbox" class="switch" data-lido ${conversas().semLido ? '' : 'checked'}></label>`}</div>`;
  const acha = (u) => conversas().lista.find((y) => y.uid === u) || (amigos || []).find((y) => y.uid === u);
  const refaz = () => { if (a.closed) return; if (arrasta) { pendente = true; return; } aberta = null; const b = a.el.querySelector('[data-corpo]'); if (b) { b.innerHTML = corpo(); ligaCorpo(b); } if (modo === 'tra' && !estaAberta()) a.close(); };
  const faz = async (uid, ac) => { const c = acha(uid); if (!c) return; const on = ac === 'mudo' ? !c.mudo : !cfg()[ac].includes(uid); await muda(uid, ac, on, c.name.split(' ')[0]); refaz(); };
  const opcoes = (uid) => {
    const c = acha(uid); if (!c) return; vib(14); semSelecao(); const tem = (k) => cfg()[k].includes(uid);
    const s = openSheet({ className: 'sheet--solid sheet--opc', html: `<div class="opc"><h3 class="opc__t">${esc(c.name)}</h3>
      <button class="frow" data-o="fix">${PIN.replace(/15/g, '20')}<span class="frow__id"><b>${tem('fix') ? 'Soltar do topo' : 'Fixar no topo'}</b></span></button>
      <button class="frow" data-o="mudo">${icon(c.mudo ? 'bell' : 'eyeoff', 20)}<span class="frow__id"><b>${c.mudo ? 'Voltar a avisar' : 'Silenciar'}</b></span></button>
      <button class="frow" data-o="arq">${ARQ(20)}<span class="frow__id"><b>${tem('arq') ? 'Tirar das arquivadas' : 'Arquivar'}</b></span></button>
      <button class="frow" data-o="tra">${icon('lock', 20)}<span class="frow__id"><b>${tem('tra') ? 'Destrancar' : 'Trancar com PIN'}</b></span></button>
      <button class="frow" data-o="perfil">${icon('user', 20)}<span class="frow__id"><b>Ver perfil</b></span></button>
      ${conversas().lista.some((y) => y.uid === uid) ? `<button class="frow is-danger" data-o="limpa">${icon('trash', 20)}<span class="frow__id"><b>Limpar conversa</b><small>Só para você</small></span></button>` : ''}</div>`,
    onMount: (x) => x.el.querySelectorAll('[data-o]').forEach((b) => (b.onclick = async () => {
      s.close(); const o = b.dataset.o;
      if (o === 'perfil') return (await import('./friends.js')).openPublicProfile(uid, c);
      if (o === 'limpa') { if (!(await confirmDialog({ title: 'Limpar a conversa?', text: 'As mensagens somem só para você.', ok: 'Limpar', danger: true }))) return; try { await call('/friends/msg-clear', { com: uid }); await atualiza(true); } catch (e) { toast(e.message); } return refaz(); }
      faz(uid, o);
    })) });
  };
  function ligaCorpo(b) {
    b.querySelectorAll('[data-c]').forEach((n) => (n.onclick = () => { if (n.dataset.pula) { delete n.dataset.pula; return; } if (aberta) { fecha(); return; } abre(n.dataset.c, acha(n.dataset.c)); }));
    b.querySelectorAll('[data-modo]').forEach((n) => (n.onclick = () => openMensagens({ modo: n.dataset.modo }).then(() => {})));
    b.querySelectorAll('[data-amigos]').forEach((n) => (n.onclick = async () => (await import('./friends.js')).openFriends()));
    b.querySelectorAll('[data-ac]').forEach((n) => (n.onclick = (e) => { e.stopPropagation(); const u = n.closest('[data-sw]').dataset.sw; fecha(); faz(u, n.dataset.ac); }));
    const d = b.querySelector('[data-ddd]'); if (d) d.onclick = () => abreAchar({ inicial: q, conversa: true });
    const p = b.querySelector('[data-p]'); if (p) p.onclick = async () => { const c = achado.row; if (c.rel === 'amigo') abre(c.uid, c); else (await import('./friends.js')).openPublicProfile(c.uid, c); };
    b.querySelectorAll('[data-sw]').forEach(arrastavel);
  }
  function fecha() { if (!aberta) return; const r = aberta.querySelector('.pvrow'); r.style.transform = ''; aberta.classList.remove('is-e', 'is-d'); aberta = null; }
  /* arrastar: um pouco mostra os botões; até o fim já faz (direita = fixar, esquerda = arquivar) */
  function arrastavel(sw) {
    const r = sw.querySelector('.pvrow'), uid = sw.dataset.sw; let x0 = 0, y0 = 0, base = 0, dx = 0, modoT = '', tL = 0, id = null;
    const larg = () => Math.min(168, sw.offsetWidth * 0.5);
    r.addEventListener('pointerdown', (e) => { if (e.button) return; x0 = e.clientX; y0 = e.clientY; dx = 0; modoT = ''; id = e.pointerId; base = aberta === sw ? (sw.classList.contains('is-e') ? larg() : -larg()) : 0; if (aberta && aberta !== sw) fecha(); clearTimeout(tL); tL = setTimeout(() => { if (!modoT) { modoT = 'longo'; r.dataset.pula = 1; opcoes(uid); } }, 480); });
    r.addEventListener('pointermove', (e) => {
      if (e.pointerId !== id || modoT === 'longo' || modoT === 'rola') return;
      const ax = e.clientX - x0, ay = e.clientY - y0;
      if (!modoT) { if (Math.abs(ay) > 9 && Math.abs(ay) > Math.abs(ax)) { modoT = 'rola'; clearTimeout(tL); return; } if (Math.abs(ax) < 9) return; modoT = 'x'; arrasta = true; clearTimeout(tL); try { r.setPointerCapture(id); } catch { /* ok */ } r.style.transition = 'none'; }
      dx = base + ax; const m = sw.offsetWidth * 0.72; dx = Math.max(-m, Math.min(m, dx)); r.style.transform = `translateX(${dx}px)`;
      sw.classList.toggle('is-e', dx > 0); sw.classList.toggle('is-d', dx < 0); const cheio = Math.abs(dx) > sw.offsetWidth * 0.6; if (cheio !== sw.classList.contains('is-cheio')) { sw.classList.toggle('is-cheio', cheio); if (cheio) vib(12); }
    });
    const fim = (e) => {
      clearTimeout(tL); if (e.pointerId !== id) return; id = null; if (modoT !== 'x') return;
      arrasta = false; r.style.transition = ''; r.dataset.pula = 1; setTimeout(() => delete r.dataset.pula, 60);
      const cheio = sw.classList.contains('is-cheio'), dir = dx > 0; sw.classList.remove('is-cheio');
      if (cheio && e.type !== 'pointercancel') { r.style.transform = ''; sw.classList.remove('is-e', 'is-d'); aberta = null; faz(uid, dir ? 'fix' : modo === 'tra' ? 'tra' : 'arq'); return; }
      if (Math.abs(dx) > 62) { aberta = sw; r.style.transform = `translateX(${dir ? larg() : -larg()}px)`; sw.classList.toggle('is-e', dir); sw.classList.toggle('is-d', !dir); } else { r.style.transform = ''; sw.classList.remove('is-e', 'is-d'); if (aberta === sw) aberta = null; }
      if (pendente) { pendente = false; if (!aberta) refaz(); }
    };
    r.addEventListener('pointerup', fim); r.addEventListener('pointercancel', fim);
    r.addEventListener('contextmenu', (e) => { e.preventDefault(); if (modoT !== 'longo') { clearTimeout(tL); modoT = 'longo'; opcoes(uid); } });
  }
  let tB = 0;
  const busca = () => { clearTimeout(tB); achado = achado && achado.q === q ? achado : null; const e = entende(q), v = ++vez, meu = q; if (!['tel', 'email', 'id'].includes(e.tipo) || (e.tipo === 'id' && !/^@/.test(q.trim()) && q.trim().length < 4)) return; tB = setTimeout(async () => { let r; try { r = await procura(e); } catch (x) { r = { erro: x.message || 'Não consegui agora.' }; } if (v === vez) { achado = { ...r, q: meu }; refaz(); } }, 600); };
  const a = openSheet({ className: 'sheet--tall sheet--fx sheet--pv', html: html(), onClose: () => { sai(); clearTimeout(tB); }, onMount: (x) => {
    const i = x.el.querySelector('[data-q]'), lq = x.el.querySelector('[data-lq]');
    if (i) { i.oninput = () => { q = i.value; lq.hidden = !q; busca(); refaz(); }; i.onkeydown = (e) => { if (e.key === 'Enter') i.blur(); }; lq.onclick = () => { i.value = ''; i.oninput(); i.focus(); }; }
    x.el.querySelectorAll('.fx__head [data-amigos]').forEach((b) => (b.onclick = async () => (await import('./friends.js')).openFriends()));
    const l = x.el.querySelector('[data-lido]'); if (l) l.onchange = () => call('/friends/msg-config', { semLido: !l.checked }).then(() => atualiza(true)).catch(() => { l.checked = !l.checked; toast('Não consegui salvar agora.'); });
    ligaCorpo(x.el.querySelector('[data-corpo]'));
  } });
  const sai = ouvir((e) => { if (e.t === 'convs' && !aberta) refaz(); if (e.t === 'trancou' && modo === 'tra') a.close(); });
  await Promise.all([atualiza(true), call('/friends/list').then((r) => { amigos = (r.friends || []).sort((x, y) => (y.close ? 1 : 0) - (x.close ? 1 : 0) || (y.online || 0) - (x.online || 0)); }).catch(() => { amigos = amigos || []; })]);
  refaz();
  return a;
}
