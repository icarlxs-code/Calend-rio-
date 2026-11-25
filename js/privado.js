/* Privado: lista de conversas e a conversa (texto, foto, áudio, resposta de story).
   Tudo some em 24 h; nada fica guardado no aparelho. */
import { store } from './store.js';
import { openSheet, sheetHead, toast, confirmDialog } from './components.js';
import { icon } from './icons.js';
import { esc } from './utils.js';
import { boneco3d } from './cena.js';
import { call, podeSocial, ICO, rosto, desde, falta, ouvir, atualiza, conversas, aoVivo, conversaAberta, digitando, semSelecao } from './social.js';
import { isTeen } from './teen.js';
import { tranca } from './tranca.js';
import { muda } from './mensagens.js';
import { sininho, alive, veste, act, lookAt } from './sininho.js';
import { roupa } from './roupas.js';
import { mascotOn } from './mascote.js';

const som = (f, ...a) => import('./sound.js').then((s) => s[f] && s[f](...a)).catch(() => {});
const vib = (q) => { try { navigator.vibrate && navigator.vibrate(q); } catch { /* ok */ } };
const hora = (at) => new Date(at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
const online = (t) => t && Date.now() - t < 5 * 60e3;

export { openMensagens } from './mensagens.js';

/* ======================== CONVERSA ======================== */
const MIDIA = new Map();                 // foto/áudio já baixados (só na memória)
const baixa = (com, m) => { if (m.unica) return Promise.reject(new Error('única')); const k = m.id; if (!MIDIA.has(k)) { const p = call('/friends/msg-media', { com, id: m.id, at: m.at }).then((r) => r.v); p.catch(() => MIDIA.delete(k)); MIDIA.set(k, p); if (MIDIA.size > 80) MIDIA.delete(MIDIA.keys().next().value); } return MIDIA.get(k); };
const REACOES = ['❤️', '😂', '😮', '😢', '🔥', '👏'];
let tocando = null;
const paraTudo = () => { if (tocando) { tocando.pause(); tocando = null; } };

export async function openConversa(uid, prev = {}) {
  if (!podeSocial()) return toast('Entre na sua conta para conversar.');
  if (!conversas().at) await atualiza(true);
  if (conversas().cfg.tra.includes(uid) && !(await tranca('Conversa trancada'))) return null;
  let D = { com: { uid, name: prev?.name || 'Amigo', photo: prev?.photo, color: prev?.color }, msgs: [], lidoAte: 0, amigo: true, online: prev?.online || 0, mudo: false, carregou: false };
  const fila = []; let resp = null, gravando = null, digT = 0, digV = '', sonda = 0, abertas = new Set(), grude = true, montou = false;
  const n1 = () => D.com.name.split(' ')[0];
  const todas = () => [...D.msgs, ...fila];
  const a = openSheet({ className: 'sheet--tall sheet--fx sheet--conv', html: casca(), onClose: () => { sai(); clearInterval(sonda); paraTudo(); if (gravando) gravando.cancela(); conversaAberta(''); vv && vv.removeEventListener('resize', encaixa); }, onMount: liga });
  const $ = (s) => a.el.querySelector(s);
  function casca() {
    return `<div class="conv"><header class="conv__top"><button class="iconbtn" data-close aria-label="Voltar">${icon('left', 22)}</button><button class="conv__quem" data-perfil>${rosto(D.com, 42)}<span><b>${esc(D.com.name)}</b><small data-st></small></span></button><button class="iconbtn" data-menu aria-label="Opções">${icon('dots', 20)}</button></header>
      <div class="conv__lista" data-lista aria-live="polite"></div>
      <div class="conv__resp" data-resp hidden></div>
      <form class="conv__barra" data-barra autocomplete="off"><label class="conv__b" aria-label="Enviar foto">${icon('camera', 22)}<input type="file" accept="image/*" data-foto hidden></label><textarea rows="1" maxlength="1000" placeholder="Mensagem" data-txt enterkeyhint="send" aria-label="Mensagem"></textarea><button type="button" class="conv__b conv__b--mic" data-mic aria-label="Gravar áudio">${icon('mic', 22)}</button><button type="submit" class="conv__b conv__b--ir" data-ir aria-label="Enviar" hidden>${ICO.manda(21)}</button></form>
      <div class="conv__grava" data-grava hidden><button type="button" class="conv__b" data-cancela aria-label="Cancelar áudio">${icon('trash', 20)}</button><span class="conv__tempo" data-tempo>0:00</span><span class="conv__ondas" data-ondas></span><button type="button" class="conv__um" data-um1 aria-pressed="false" aria-label="Visualização única">1</button><button type="button" class="conv__b conv__b--ir" data-envia aria-label="Enviar áudio">${ICO.manda(21)}</button></div></div>`;
  }
  let quem = D.com.name + (D.com.photo || '');
  const status = () => { const s = $('[data-st]'); if (!s) return; const ch = D.com.name + (D.com.photo || ''); if (ch !== quem) { quem = ch; const b = $('[data-perfil]'); const v = b.querySelector('.stface'); if (v) v.outerHTML = rosto(D.com, 42); b.querySelector('b').textContent = D.com.name; } s.className = Date.now() < digT ? 'is-dig' : online(D.online) ? 'is-on' : ''; s.textContent = Date.now() < digT ? (digV === 'audio' ? 'gravando áudio…' : 'digitando…') : online(D.online) ? 'online agora' : D.online ? `visto há ${desde(D.online)}` : 'some em 24 h'; };
  const citacao = (m) => `<span class="cit"><b>${m.de === D.com.uid || (!m.meu && m.de !== eu()) ? esc(n1()) : 'Você'}</b><small>${m.unica ? '① ' : ''}${m.tipo === 'foto' ? '📷 Foto' : m.tipo === 'audio' ? '🎤 Áudio' : esc(m.txt || '')}</small></span>`;
  const eu = () => store.user?.uid;
  const bolha = (m, i, L) => {
    const ant = L[i - 1], dep = L[i + 1], junto = ant && ant.meu === m.meu && m.at - ant.at < 12e4, fim = !dep || dep.meu !== m.meu || dep.at - m.at >= 12e4;
    const rc = Object.values(m.reac || {}), bl = isTeen() && !m.meu && m.tipo === 'foto' && !abertas.has(m.id);
    const dentro = m.tipo === 'apagada' ? `<i class="bol__apagada">${icon('trash', 14)} Mensagem apagada</i>`
      : m.unica ? `<button type="button" class="bol__um${m.vista ? ' is-vista' : ''}" ${m.meu || m.vista ? 'disabled' : `data-um="${esc(m.id)}"`}><i>${m.vista ? icon('check', 17) : '1'}</i><span><b>${m.tipo === 'audio' ? 'Áudio' : 'Foto'}</b><small>${m.vista ? 'Aberta' : m.meu ? 'Visualização única' : 'Toque para ver uma vez'}</small></span></button>`
      : m.tipo === 'foto' ? `<button type="button" class="bol__foto${bl ? ' is-borrada' : ''}" style="aspect-ratio:${m.w || 3}/${m.h || 4}" data-abre="${esc(m.id)}"><span class="bol__carga"></span>${bl ? `<em>${icon('eyeoff', 20)} Toque para ver</em>` : ''}</button>${m.txt ? `<p>${esc(m.txt)}</p>` : ''}`
      : m.tipo === 'audio' ? `<span class="bol__audio" data-audio="${esc(m.id)}"><button type="button" class="bol__play" aria-label="Tocar áudio">${ICO.toca(22)}</button><span class="bol__onda" data-onda>${(m.onda || []).map((h) => `<i style="--h:${Math.max(10, +h || 0)}%"></i>`).join('')}</span><small data-dur>${Math.floor(m.dur / 60)}:${String(Math.round(m.dur % 60)).padStart(2, '0')}</small><button type="button" class="bol__vel" data-vel aria-label="Velocidade">1x</button></span>`
      : m.tipo === 'story' ? `<button type="button" class="bol__story" data-story="${esc(m.st?.id || '')}" data-dono="${esc(m.st?.owner || '')}"><span class="bol__mini"></span><small>${m.meu ? `Você respondeu ao story de ${esc(n1())}` : 'Respondeu ao seu story'}</small></button><p class="${/^\p{Extended_Pictographic}/u.test(m.txt) && m.txt.length <= 4 ? 'is-emo' : ''}">${esc(m.txt)}</p>`
      : `<p class="${/^(\p{Extended_Pictographic}️?){1,3}$/u.test(m.txt) ? 'is-emo' : ''}">${esc(m.txt)}</p>`;
    const dia = !ant || new Date(ant.at).getDate() !== new Date(m.at).getDate() ? `<div class="conv__dia"><span>${new Date(m.at).getDate() === new Date().getDate() ? 'Hoje' : 'Ontem'}</span></div>` : '';
    return `${dia}<div class="bol${m.meu ? ' bol--eu' : ''}${junto ? ' is-junto' : ''}${fim ? ' is-fim' : ''}${m.nova ? ' is-entra' : ''}${rc.length ? ' tem-reac' : ''}" data-m="${esc(m.id)}"><div class="bol__c">${m.resp ? citacao(m.resp) : ''}${dentro}<span class="bol__pe">${hora(m.at)}${m.meu && m.tipo !== 'apagada' ? (m.falhou ? ` <button type="button" class="bol__re" data-re="${esc(m.id)}">não foi · tentar</button>` : m.envio ? ` ${icon('clock', 12)}` : D.lidoAte >= m.at ? ' <b class="bol__visto">visto</b>' : ` ${icon('check', 12)}`) : ''}</span></div>${rc.length ? `<span class="bol__reac">${[...new Set(rc)].map(esc).join('')}${rc.length > 1 ? `<small>${rc.length}</small>` : ''}</span>` : ''}</div>`;
  };
  let assin = '', viuAte = 0;
  /* o Lembra na conversa: digita, grava, e quando a última mensagem é vista ele chega e lê */
  const vesteCenas = () => { const L = a.el.querySelectorAll('[data-cena]'); if (!L.length) return; alive(); L.forEach((n) => { const e = n.querySelector('[data-snh]'); veste(e, roupa(n.dataset.cena)); if (n.dataset.cena === 'le') { const b = [...a.el.querySelectorAll('.bol--eu')].pop()?.getBoundingClientRect(); if (b) setTimeout(() => lookAt(e, b.left + b.width / 3, b.top, 2), 350); setTimeout(() => act(e, 'sim'), 2200); } }); };
  const cenaVisto = (L) => { const u = L[L.length - 1]; if (!mascotOn() || !u || !u.meu || u.tipo === 'apagada' || u.envio || u.falhou || D.lidoAte < u.at) return ''; const novo = montou && viuAte < u.at; viuAte = u.at; return `<div class="conv__viu${novo ? ' is-novo' : ''}"><small>${esc(n1())} viu</small><span class="bol__snh" data-cena="le">${sininho('feliz', { size: 74, label: '' })}</span></div>`; };
  function pinta(forca) {
    const l = $('[data-lista]'); if (!l) return;
    const L = todas(), s = JSON.stringify([L.map((m) => [m.id, m.tipo, m.reac, m.envio, m.falhou, m.vista, abertas.has(m.id)]), D.lidoAte, D.amigo, D.carregou, Date.now() < digT && (digV || 1)]);
    status(); if (s === assin && !forca) return; assin = s;
    const perto = l.scrollHeight - l.scrollTop - l.clientHeight < 140; if (tocando && !forca && !perto) { /* não mexe na rolagem de quem está lendo */ }
    const topo = l.scrollTop, alt = l.scrollHeight;
    l.innerHTML = `<div class="conv__selo">${icon('lock', 15)}<span>Só você e ${esc(n1())}. Cada mensagem é apagada do servidor 24 h depois.</span></div>${!D.carregou ? '<div class="fx__load"><i></i><i></i><i></i></div>' : !L.length ? `<div class="conv__vazio">${boneco3d('acena', 150)}<p>Comece a conversa com ${esc(n1())}</p><div>${['Oi! 👋', 'Bora marcar algo?', 'Vi seu story 😄'].map((t) => `<button type="button" data-rapida="${esc(t)}">${esc(t)}</button>`).join('')}</div></div>` : L.map(bolha).join('') + (Date.now() < digT ? '' : cenaVisto(L))}${Date.now() < digT ? `<div class="bol is-dig"><span class="bol__snh"${mascotOn() ? '' : ' hidden'} data-cena="${digV === 'audio' ? 'grava' : 'digita'}">${sininho('feliz', { size: 80, label: '' })}</span><div class="bol__c${digV === 'audio' ? ' is-aud' : ''}" role="img" aria-label="${digV === 'audio' ? 'gravando áudio' : 'digitando'}">${'<i></i>'.repeat(digV === 'audio' ? 5 : 3)}</div></div>` : ''}${D.amigo ? '' : `<p class="conv__fim">Vocês não são mais amigos. As mensagens somem em até 24 h.</p>`}`;
    vesteCenas();
    $('[data-barra]').classList.toggle('is-off', !D.amigo);
    if (!montou || perto || grude) l.scrollTop = l.scrollHeight; else l.scrollTop = topo + (l.scrollHeight - alt > 0 && topo < 10 ? l.scrollHeight - alt : 0);
    grude = false; montou = montou || D.carregou;
    L.forEach((m) => { delete m.nova; });
    carrega();
  }
  function carrega() { // fotos, capas de story e áudio só quando aparecem
    a.el.querySelectorAll('[data-abre]').forEach((b) => { const m = todas().find((x) => x.id === b.dataset.abre); if (!m || b.querySelector('img')) return; const bota = (v) => { const i = new Image(); i.alt = 'Foto'; i.src = v; b.prepend(i); b.querySelector('.bol__carga')?.remove(); }; if (m.local) return bota(m.local); baixa(uid, m).then(bota).catch(() => { b.innerHTML = '<em>Sumiu</em>'; }); });
    a.el.querySelectorAll('[data-story]').forEach(async (b) => { const c = b.querySelector('.bol__mini'); if (!c || c.dataset.ok) return; c.dataset.ok = 1; try { const S = await import('./stories.js'); const f = await S.fotoDoStory(b.dataset.dono, b.dataset.story); if (f) c.style.backgroundImage = `url("${f}")`; else throw 0; } catch { c.classList.add('is-fim'); c.textContent = 'sumiu'; } });
  }
  async function traz() {
    try {
      const r = await call('/friends/msg-list', { com: uid });
      const velhas = new Set(D.msgs.map((m) => m.id));
      r.msgs.forEach((m) => { if (D.carregou && !velhas.has(m.id)) m.nova = true; });
      if (D.carregou && r.msgs.some((m) => !m.meu && !velhas.has(m.id))) { som('msgVem'); vib(8); digT = 0; }
      const antigos = D.msgs.filter((m) => r.mais && r.msgs[0] && m.at < r.msgs[0].at && Date.now() - m.at < 864e5);
      D = { ...D, ...r, com: { ...D.com, ...r.com }, msgs: [...antigos, ...r.msgs], carregou: true };
      for (let i = fila.length - 1; i >= 0; i--) if (fila[i].ok && r.msgs.some((m) => m.id === fila[i].ok)) fila.splice(i, 1);
      pinta();
    } catch (e) { if (!D.carregou) { D.carregou = true; pinta(true); toast(e.message || 'Sem internet agora.'); } }
  }
  async function envia(o, local = {}) {
    const m = { id: 'l' + Math.random().toString(36).slice(2), at: Date.now(), meu: true, de: eu(), tipo: o.tipo || 'txt', txt: o.txt || '', reac: {}, envio: true, nova: true, resp: resp ? { ...resp } : undefined, ...local };
    const pacote = { com: uid, ...o, ...(resp ? { resp: { id: resp.id, at: resp.at } } : {}) };
    m.pacote = pacote; fila.push(m); resp = null; mostraResp(); grude = true; pinta(); som('msgVai'); vib(6);
    despacha(m);
  }
  async function despacha(m) {
    m.falhou = false; m.envio = true; pinta(true);
    try { const r = await call('/friends/msg-send', m.pacote); m.ok = r.id; m.envio = false; if (m.local) MIDIA.set(r.id, Promise.resolve(m.local)); if (m.midiaLocal) MIDIA.set(r.id, Promise.resolve(m.midiaLocal)); await traz(); } catch (e) { m.envio = false; m.falhou = true; pinta(true); toast(e.message || 'Não foi. Toque em “tentar”.'); }
  }
  function mostraResp() { const r = $('[data-resp]'); if (!r) return; r.hidden = !resp; r.innerHTML = resp ? `${ICO.volta(18)}${citacao(resp)}<button type="button" class="iconbtn" data-semresp aria-label="Cancelar resposta">${icon('x', 18)}</button>` : ''; const x = r.querySelector('[data-semresp]'); if (x) x.onclick = () => { resp = null; mostraResp(); }; }
  /* toque longo (ou dois toques): reagir, responder, copiar, apagar, denunciar */
  function opcoes(m) {
    if (m.envio || m.falhou || m.tipo === 'apagada') return;
    vib(14); semSelecao();
    const s = openSheet({ className: 'sheet--solid sheet--opc', html: `<div class="opc"><div class="opc__emo">${REACOES.map((e) => `<button type="button" data-e="${e}" class="${(m.reac || {})[eu()] === e ? 'is-on' : ''}">${e}</button>`).join('')}</div>
      <button class="frow" data-o="resp">${ICO.volta(20)}<span class="frow__id"><b>Responder</b></span></button>
      ${m.txt && !m.unica ? `<button class="frow" data-o="copia">${icon('copy', 20)}<span class="frow__id"><b>Copiar texto</b></span></button>` : ''}
      ${m.meu ? `<button class="frow is-danger" data-o="apaga">${icon('trash', 20)}<span class="frow__id"><b>Apagar para os dois</b></span></button>` : `<button class="frow is-danger" data-o="denuncia">${icon('flag', 20)}<span class="frow__id"><b>Denunciar</b></span></button>`}
      <p class="fhelp">${icon('clock', 13)} Some sozinha em ${falta(m.at)}</p></div>`, onMount: (x) => {
      x.el.style.pointerEvents = 'none'; const solta = () => setTimeout(() => { x.el.style.pointerEvents = ''; semSelecao(); }, 60); addEventListener('pointerup', solta, { once: true }); addEventListener('touchend', solta, { once: true }); setTimeout(solta, 700); // o dedo que segurou não escolhe nada sem querer
      x.el.querySelectorAll('[data-e]').forEach((b) => (b.onclick = () => { s.close(); reage(m, b.dataset.e); }));
      x.el.querySelectorAll('[data-o]').forEach((b) => (b.onclick = async () => {
        s.close(); const o = b.dataset.o;
        if (o === 'resp') { resp = m; mostraResp(); $('[data-txt]').focus(); }
        if (o === 'copia') { try { await navigator.clipboard.writeText(m.txt); toast('Copiado'); } catch { toast('Não consegui copiar.'); } }
        if (o === 'apaga') { if (!(await confirmDialog({ title: 'Apagar para os dois?', text: 'A mensagem some na hora, inclusive do servidor.', ok: 'Apagar', danger: true }))) return; try { await call('/friends/msg-del', { com: uid, id: m.id, at: m.at }); MIDIA.delete(m.id); traz(); } catch (e) { toast(e.message); } }
        if (o === 'denuncia') denuncia(m);
      }));
    } });
  }
  function denuncia(m) {
    const MOT = ['Assédio ou bullying', 'Nudez ou conteúdo sexual', 'Ameaça ou violência', 'Golpe ou spam', 'Outro motivo'];
    const s = openSheet({ className: 'sheet--solid', html: `${sheetHead('Denunciar', { left: '<button class="btn-text" data-close>Fechar</button>' })}<div class="page page--sheet"><p class="fhelp">${esc(n1())} não fica sabendo. ${m ? 'O texto desta mensagem vai para a revisão, mesmo depois de sumir.' : ''}</p><div class="agroup">${MOT.map((t) => `<button class="frow" data-t="${esc(t)}">${icon('flag', 18)}<span class="frow__id"><b>${esc(t)}</b></span></button>`).join('')}</div><button class="btn btn--danger-soft btn--block" data-bloq>Bloquear ${esc(n1())} e apagar a conversa</button></div>`, onMount: (x) => {
      x.el.querySelectorAll('[data-t]').forEach((b) => (b.onclick = async () => { try { await call('/friends/report', { owner: uid, motivo: b.dataset.t, ...(m ? { msg: { id: m.id, at: m.at } } : {}) }); toast('Denúncia enviada. Obrigado por avisar 🙏'); } catch { toast('Não consegui enviar agora.'); } s.close(); }));
      x.el.querySelector('[data-bloq]').onclick = async () => { if (!(await confirmDialog({ title: `Bloquear ${n1()}?`, text: 'A amizade acaba e a conversa é apagada para os dois, agora.', ok: 'Bloquear', danger: true }))) return; try { await call('/friends/block', { uid }); s.close(); a.close(); atualiza(true); toast(`${n1()} não fala mais com você por aqui.`); } catch { toast('Não consegui agora.'); } };
    } });
  }
  async function reage(m, emo) { m.reac = { ...(m.reac || {}) }; if (m.reac[eu()] === emo) delete m.reac[eu()]; else { m.reac[eu()] = emo; som('curtida'); vib(10); } pinta(true); if (m.reac[eu()]) { const b = a.el.querySelector(`[data-m="${CSS.escape(m.id)}"] .bol__reac`); b && b.animate([{ transform: 'scale(0)' }, { transform: 'scale(1.5)', offset: 0.5 }, { transform: 'scale(1)' }], { duration: 380, easing: 'cubic-bezier(.2,1.1,.3,1)' }); } try { await call('/friends/msg-react', { com: uid, id: m.id, at: m.at, emo }); } catch (e) { toast(e.message); traz(); } }
  async function tocaAudio(el, m) {
    const b = el.querySelector('.bol__play'), bar = [...el.querySelectorAll('[data-onda] i')], dur = el.querySelector('[data-dur]');
    if (el._au && tocando === el._au) { el._au.paused ? el._au.play() : el._au.pause(); return; }
    paraTudo();
    if (!el._au) {
      b.classList.add('is-carga');
      try { const V = await import('./voz.js'); const v = m.midiaLocal || (await baixa(uid, m)); el._au = new Audio(V.paraTocar(v)); el._au.preservesPitch = true; } catch { b.classList.remove('is-carga'); return toast('Esse áudio já sumiu.'); }
      b.classList.remove('is-carga');
      const au = el._au, mostra = (t) => { const k = m.dur ? t / m.dur : 0; bar.forEach((x, i) => x.classList.toggle('is-on', i / bar.length < k)); dur.textContent = `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`; };
      au.onplay = () => { b.innerHTML = ICO.pausa(22); el.classList.add('is-toca'); const f = () => { if (au.paused) return; mostra(au.currentTime); requestAnimationFrame(f); }; f(); };
      au.onpause = () => { b.innerHTML = ICO.toca(22); el.classList.remove('is-toca'); };
      au.onended = () => { mostra(0); dur.textContent = `${Math.floor(m.dur / 60)}:${String(Math.round(m.dur % 60)).padStart(2, '0')}`; tocando = null; const L = todas(), p = L[L.indexOf(m) + 1]; if (p && p.tipo === 'audio' && p.meu === m.meu) { const e2 = a.el.querySelector(`[data-audio="${CSS.escape(p.id)}"]`); if (e2) tocaAudio(e2, p); } };
      el.querySelector('[data-onda]').onclick = (ev) => { const r = ev.currentTarget.getBoundingClientRect(); au.currentTime = Math.max(0, Math.min(1, (ev.clientX - r.left) / r.width)) * (m.dur || au.duration || 0); mostra(au.currentTime); };
    }
    tocando = el._au; el._au.playbackRate = +(el.dataset.v || 1); el._au.play().catch(() => toast('Não consegui tocar o áudio.'));
  }
  const podeUnica = () => !isTeen() && !D.com.teen;
  let termina = null;
  async function gravar() {
    const V = await import('./voz.js');
    if (!V.podeGravar()) return toast('Este navegador não grava áudio.');
    const bar = $('[data-barra]'), g = $('[data-grava]'), t = $('[data-tempo]'), o = $('[data-ondas]');
    let k = 0;
    try { gravando = await V.grava((v, s) => { t.textContent = `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`; if (k++ % 4 === 0) { const i = document.createElement('i'); i.style.setProperty('--h', Math.max(10, Math.min(100, v * 160)) + '%'); o.appendChild(i); if (o.children.length > 36) o.firstChild.remove(); digitando(uid, 'audio'); } if (s >= V.MAX) fim(true); }); } catch (e) { return toast(e.name === 'NotAllowedError' ? 'Permita o microfone para gravar áudio.' : 'Não achei o microfone.'); }
    vib(16); som('pulso'); semSelecao(); bar.hidden = true; g.hidden = false; o.innerHTML = ''; let um = false; const bu = $('[data-um1]'); bu.hidden = !podeUnica(); bu.setAttribute('aria-pressed', 'false'); bu.onclick = () => { um = !um; bu.setAttribute('aria-pressed', um); if (um) toast('Vai tocar uma vez só'); };
    const fim = async (manda) => {
      if (!gravando) return; const x = gravando; gravando = null; g.hidden = true; bar.hidden = false;
      if (!manda) { x.cancela(); return som('tick', 0); }
      const r = await x.para();
      if (r.dur < 0.7 || !r.dados) return toast('Muito curto. Grave um pouquinho mais 😄');
      envia({ tipo: 'audio', midia: r.dados, dur: r.dur, onda: r.onda, ...(um ? { unica: true } : {}) }, um ? { dur: r.dur, unica: true } : { dur: r.dur, onda: r.onda, midiaLocal: r.dados });
    };
    termina = fim;
    $('[data-cancela]').onclick = () => fim(false); $('[data-envia]').onclick = () => fim(true);
  }
  async function mandaFoto(f) {
    const S = await import('./stories.js'); let foto; try { foto = await S.prepara(f); } catch (e) { return toast(e.message); }
    const im = new Image(); im.src = foto; await im.decode().catch(() => {});
    const w = document.createElement('div'); w.className = 'stv stv--edit is-in stv--foto'; w.setAttribute('role', 'dialog'); w.setAttribute('aria-label', 'Enviar foto');
    w.innerHTML = `<header class="stv__top"><button class="stv__x" data-x aria-label="Cancelar">${icon('x', 22)}</button><span><b>Para ${esc(n1())}</b><small>some em 24 h</small></span></header><div class="stv__img"><img src="${foto}" alt="" draggable="false"></div><div class="stve"><input class="stve__cap" type="text" maxlength="200" placeholder="Escreva algo (opcional)" data-cap>${podeUnica() ? `<button type="button" class="conv__um" data-um1 aria-pressed="false" aria-label="Visualização única">1</button>` : ''}<button class="stve__go" data-go>${ICO.manda(20)}<span>Enviar</span></button></div>`;
    (document.getElementById('sheets') || document.body).appendChild(w);
    w.querySelector('[data-x]').onclick = () => w.remove();
    let um = false; const bu = w.querySelector('[data-um1]'); if (bu) bu.onclick = () => { um = !um; bu.setAttribute('aria-pressed', um); w.querySelector('.stv__top small').textContent = um ? 'visualização única' : 'some em 24 h'; };
    w.querySelector('[data-go]').onclick = () => { const txt = w.querySelector('[data-cap]').value.trim(); w.remove(); envia({ tipo: 'foto', midia: foto, w: im.naturalWidth || 3, h: im.naturalHeight || 4, txt, ...(um ? { unica: true } : {}) }, um ? { unica: true } : { local: foto, w: im.naturalWidth || 3, h: im.naturalHeight || 4 }); };
  }
  function abreFoto(v, leg = '') { const w = document.createElement('div'); w.className = 'stv is-in stv--ver'; w.setAttribute('role', 'dialog'); w.setAttribute('aria-label', 'Foto'); w.innerHTML = `<button class="stv__x" data-x aria-label="Fechar">${icon('x', 24)}</button><div class="stv__img"><img src="${v}" alt="Foto" draggable="false"></div>${leg ? `<p class="stv__leg">${esc(leg)}</p>` : ''}`; w.onclick = () => w.remove(); (document.getElementById('sheets') || document.body).appendChild(w); w.querySelector('.stv__img').animate([{ transform: 'scale(.86)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 300, easing: 'cubic-bezier(.16,1,.3,1)' }); }
  /* visualização única: baixa na hora de abrir (o servidor apaga junto), mostra e não guarda nada */
  let abrindoUm = false;
  async function abreUm(m) {
    if (abrindoUm) return; if (!(await confirmDialog({ title: m.tipo === 'audio' ? 'Ouvir uma vez?' : 'Ver uma vez?', text: 'Depois de fechar, não dá para abrir de novo.', ok: m.tipo === 'audio' ? 'Ouvir' : 'Ver' }))) return;
    abrindoUm = true; let v; try { v = (await call('/friends/msg-media', { com: uid, id: m.id, at: m.at, abrir: true })).v; } catch (e) { toast(e.message || 'Não consegui abrir agora.'); abrindoUm = false; traz(); return; }
    abrindoUm = false; m.vista = Date.now(); pinta(true);
    if (m.tipo === 'foto') { abreFoto(v, m.txt); return; }
    const V = await import('./voz.js'); paraTudo(); const au = new Audio(V.paraTocar(v)); tocando = au;
    const s = openSheet({ className: 'sheet--solid', onClose: () => { au.pause(); au.src = ''; }, html: `<div class="opc umaud"><span class="bol__snh" data-cena="grava">${sininho('feliz', { size: 110, label: '' })}</span><h3>Áudio de ${esc(n1())}</h3><div class="umaud__b"><i data-b></i></div><button class="btn btn--primary btn--block" data-t>Tocar</button><button class="btn btn--ghost btn--block" data-close>Fechar</button></div>`, onMount: (x) => { alive(); veste(x.el.querySelector('[data-snh]'), roupa('grava')); const t = x.el.querySelector('[data-t]'), b = x.el.querySelector('[data-b]'); t.onclick = () => (au.paused ? au.play() : au.pause()); au.onplay = () => { t.textContent = 'Pausar'; }; au.onpause = () => { t.textContent = 'Continuar'; }; au.ontimeupdate = () => { b.style.transform = `scaleX(${Math.min(1, au.currentTime / (m.dur || au.duration || 1))})`; }; au.onended = () => s.close(); au.play().catch(() => { /* toca no botão */ }); } });
  }
  function menu() {
    const s = openSheet({ className: 'sheet--solid', html: `${sheetHead(esc(n1()), { left: '<button class="btn-text" data-close>Fechar</button>' })}<div class="page page--sheet"><div class="agroup"><button class="frow" data-o="perfil">${icon('user', 18)}<span class="frow__id"><b>Ver perfil</b></span></button><button class="frow" data-o="mudo">${icon(D.mudo ? 'bell' : 'eyeoff', 18)}<span class="frow__id"><b>${D.mudo ? 'Voltar a avisar' : 'Silenciar'}</b><small>${D.mudo ? 'Recebe os avisos de novo' : 'Continua recebendo, sem aviso no celular'}</small></span></button>${[['fix', 'left', 'Fixar no topo', 'Soltar do topo'], ['arq', 'download', 'Arquivar', 'Tirar das arquivadas'], ['tra', 'lock', 'Trancar com PIN', 'Destrancar']].map(([k, ic, x, y]) => `<button class="frow" data-o="${k}">${icon(k === 'fix' ? 'star' : ic, 18)}<span class="frow__id"><b>${conversas().cfg[k].includes(uid) ? y : x}</b></span></button>`).join('')}<button class="frow" data-o="limpa">${icon('trash', 18)}<span class="frow__id"><b>Limpar conversa</b><small>Só para você</small></span></button><button class="frow is-danger" data-o="den">${icon('flag', 18)}<span class="frow__id"><b>Denunciar ou bloquear</b></span></button></div></div>`, onMount: (x) => x.el.querySelectorAll('[data-o]').forEach((b) => (b.onclick = async () => {
      s.close(); const o = b.dataset.o;
      if (o === 'perfil') (await import('./friends.js')).openPublicProfile(uid, D.com);
      if (o === 'mudo') call('/friends/msg-mute', { com: uid, on: !D.mudo }).then((r) => { D.mudo = r.mudo; toast(r.mudo ? 'Conversa silenciada' : 'Avisos ligados'); atualiza(true); }).catch((e) => toast(e.message));
      if (['fix', 'arq', 'tra'].includes(o)) muda(uid, o, !conversas().cfg[o].includes(uid), n1());
      if (o === 'limpa') { if (!(await confirmDialog({ title: 'Limpar a conversa?', text: 'As mensagens somem só para você.', ok: 'Limpar', danger: true }))) return; try { await call('/friends/msg-clear', { com: uid }); D.msgs = []; pinta(true); atualiza(true); } catch (e) { toast(e.message); } }
      if (o === 'den') denuncia(null);
    })) });
  }
  function liga(x) {
    const q = (s) => x.el.querySelector(s), tx = q('[data-txt]'), ir = q('[data-ir]'), mic = q('[data-mic]'), l = q('[data-lista]');
    const cresce = () => { tx.style.height = 'auto'; tx.style.height = Math.min(132, tx.scrollHeight) + 'px'; const tem = !!tx.value.trim(); ir.hidden = !tem; mic.hidden = tem; };
    tx.oninput = () => { cresce(); if (tx.value.trim()) digitando(uid); };
    tx.onkeydown = (e) => { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); q('[data-barra]').requestSubmit(); } };
    tx.onfocus = () => setTimeout(() => { l.scrollTop = l.scrollHeight; }, 250);
    q('[data-barra]').onsubmit = (e) => { e.preventDefault(); const t = tx.value.trim(); if (!t) return; tx.value = ''; cresce(); envia({ tipo: 'txt', txt: t }); tx.focus(); };
    // toque: grava até tocar em enviar · segurar: grava enquanto segura; soltou, envia; arrastou para a esquerda, cancela
    let tS = 0, seg = false, mx = 0, pulaClique = 0;
    mic.onclick = () => { if (Date.now() - pulaClique < 900) return; gravar(); };
    mic.addEventListener('pointerdown', (e) => { if (e.button) return; mx = e.clientX; let vivo = true, canc = false, ini = Date.now(); clearTimeout(tS); seg = false;
      const mexe = (ev) => { if (seg && mx - ev.clientX > 90 && !canc) { canc = true; vib(20); termina && termina(false); fora(); } };
      const fora = () => { vivo = false; clearTimeout(tS); removeEventListener('pointermove', mexe); removeEventListener('pointerup', sobe); removeEventListener('touchend', sobe); removeEventListener('pointercancel', cai); };
      const sobe = () => { const era = seg; fora(); semSelecao(); if (era) { pulaClique = Date.now(); if (gravando && Date.now() - ini > 900) termina && termina(true); else if (gravando) toast('Gravando. Toque na seta para enviar.'); } };
      const cai = () => { if (seg) pulaClique = Date.now(); fora(); };
      tS = setTimeout(async () => { if (!vivo) return; seg = true; semSelecao(); await gravar(); ini = Date.now(); }, 280);
      addEventListener('pointermove', mexe); addEventListener('pointerup', sobe); addEventListener('touchend', sobe); addEventListener('pointercancel', cai); });
    mic.addEventListener('contextmenu', (e) => e.preventDefault());
    ir.addEventListener('pointerdown', (e) => e.preventDefault()); // o teclado não fecha ao enviar
    q('[data-foto]').onchange = (e) => { const f = e.target.files && e.target.files[0]; e.target.value = ''; if (f) mandaFoto(f); };
    q('[data-perfil]').onclick = async () => (await import('./friends.js')).openPublicProfile(uid, D.com);
    q('[data-menu]').onclick = menu;
    // toques na lista
    let tL = 0, ult = 0, ultId = '', px = 0, py = 0, arr = null;
    const de = (e) => { const b = e.target.closest('[data-m]'); return b && todas().find((m) => m.id === b.dataset.m); };
    l.addEventListener('pointerdown', (e) => { const m = de(e); if (!m) return; px = e.clientX; py = e.clientY; arr = { m, el: e.target.closest('.bol'), d: 0 }; tL = setTimeout(() => { tL = 0; arr = null; opcoes(m); }, 430); });
    l.addEventListener('pointermove', (e) => { if (!arr) return; const dx = e.clientX - px, dy = e.clientY - py; if (Math.abs(dx) > 8 || Math.abs(dy) > 8) clearTimeout(tL); if (Math.abs(dx) > 8) semSelecao(); if (Math.abs(dy) > 24 && arr.d < 10) { solta(); return; } if (dx > 10) { arr.d = Math.min(70, dx * 0.6); arr.el.style.transform = `translateX(${arr.d}px)`; } });
    const solta = () => { clearTimeout(tL); if (arr) { arr.el.style.transform = ''; if (arr.d > 44 && !arr.m.envio && arr.m.tipo !== 'apagada') { resp = arr.m; mostraResp(); vib(10); $('[data-txt]').focus(); } } arr = null; };
    ['pointerup', 'pointercancel', 'pointerleave'].forEach((n) => l.addEventListener(n, solta));
    l.addEventListener('contextmenu', (e) => { const m = de(e); if (m) { e.preventDefault(); clearTimeout(tL); opcoes(m); } });
    l.addEventListener('click', (e) => {
      const m = de(e), r = e.target.closest('[data-rapida]'), re = e.target.closest('[data-re]');
      if (r) return envia({ tipo: 'txt', txt: r.dataset.rapida });
      if (!m) return;
      if (re) return despacha(m);
      const vel = e.target.closest('[data-vel]'), au = e.target.closest('[data-audio]');
      if (vel) { const v = { 1: 1.5, 1.5: 2, 2: 1 }[+(au.dataset.v || 1)]; au.dataset.v = v; vel.textContent = v + 'x'; if (au._au) au._au.playbackRate = v; return; }
      if (e.target.closest('.bol__play')) return tocaAudio(au, m);
      if (e.target.closest('[data-um]')) return abreUm(m);
      const ft = e.target.closest('[data-abre]'); if (ft) { if (ft.classList.contains('is-borrada')) { abertas.add(m.id); return pinta(true); } const i = ft.querySelector('img'); if (i) abreFoto(i.src); return; }
      const st = e.target.closest('[data-story]'); if (st) { import('./stories.js').then((S) => S.openViewer(st.dataset.dono, null, st.dataset.story)); return; }
      if (Date.now() - ult < 320 && ultId === m.id) { ult = 0; return reage(m, '❤️'); } ult = Date.now(); ultId = m.id;
    });
    l.addEventListener('scroll', async () => { if (l.scrollTop > 30 || !D.mais || l._b || !D.msgs.length) return; l._b = 1; try { const r = await call('/friends/msg-list', { com: uid, antes: D.msgs[0].at }); D.msgs = [...r.msgs, ...D.msgs]; D.mais = r.mais; pinta(); } catch { /* ok */ } l._b = 0; });
  }
  // teclado do celular: a conversa ocupa só o que está visível
  const vv = window.visualViewport;
  // sem campo em foco não existe teclado: a folha volta ao tamanho inteiro (o iPhone às vezes não avisa que ele fechou)
  const escrevendo = () => { const n = document.activeElement; return !!n && a.el.contains(n) && /INPUT|TEXTAREA/.test(n.tagName); };
  const encaixa = () => { if (!a || a.closed || !vv) return; const fora = escrevendo() ? Math.max(0, innerHeight - vv.height - vv.offsetTop) : 0; a.panel.style.setProperty('--teclado', fora + 'px'); const l = $('[data-lista]'); if (l && fora > 80) l.scrollTop = l.scrollHeight; };
  const depois = () => { encaixa(); [80, 250, 500, 900].forEach((t) => setTimeout(encaixa, t)); };
  if (vv) { vv.addEventListener('resize', encaixa); vv.addEventListener('scroll', encaixa); }
  a.el.addEventListener('focusin', depois); a.el.addEventListener('focusout', depois); addEventListener('orientationchange', depois); addEventListener('pageshow', depois); document.addEventListener('visibilitychange', depois);
  const sai = ouvir((e) => {
    if ((e.t === 'msg' || e.t === 'mudou') && e.de === uid) traz();
    if (e.t === 'eu' && e.com === uid) traz();
    if (e.t === 'lida' && e.de === uid) { D.lidoAte = Math.max(D.lidoAte, +e.ate || 0); pinta(); }
    if (e.t === 'dig' && e.de === uid) { digT = Date.now() + 4500; digV = e.v; D.online = Date.now(); pinta(); setTimeout(() => pinta(), 4700); }
    if (e.t === 'ligou') traz();
  });
  conversaAberta(uid); pinta(true); traz();
  sonda = setInterval(() => { if (document.hidden) return; encaixa(); if (!aoVivo()) traz(); else status(); }, 6000);
  return a;
}
