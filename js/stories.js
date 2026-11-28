/* Stories do Lembra (estilo WhatsApp/Instagram, mas ligados à agenda):
   - só existe story de um compromisso CONCLUÍDO, com foto tirada NA HORA pela câmera (não dá para escolher da galeria);
   - postar dá XP em dobro; apagar a foto tira só o bônus;
   - a foto some sozinha em 24h (o servidor apaga; nada fica guardado);
   - só os amigos veem; quem viu aparece para o dono do story ("Visto por");
   - visitas ao perfil: cada um vê quem passou pelo perfil nos últimos 7 dias. */
import { anel, bolinha, rotulo, pulsa, conta } from './anel.js';
import { store } from './store.js';
import { api } from './avisos.js';
import { openSheet, sheetHead, toast, confirmDialog } from './components.js';
import { icon } from './icons.js';
import { esc } from './utils.js';
import { sininho, setMood, act, say, alive, vivo } from './sininho.js';
import { mascotOn } from './mascote.js';
import { APP_VERSION, APP_NOTES } from './version.js';
import { leCache, gravaCache } from './cache.js';
import { personal } from './personal.js';
import { previewStory } from './game.js';
import { todayKey } from './utils.js';
import { ICO, rosto, falta, conversas } from './social.js';
import { isTeen } from './teen.js';
import { NOVIDADES } from './novidades.js';

const call = (path, body = {}) => api(path, { ws: '', ...body });
const som = (f, ...a) => import('./sound.js').then((m) => m[f] && m[f](...a)).catch(() => {});
/* quem pode o quê nos meus stories (a escolha fica lembrada; repostar só liga se a pessoa ligar ou deixar ligado no editor) */
const pref = (k, p) => { try { const v = localStorage.getItem('lembra.st.' + k); return v === null ? p : v === '1'; } catch { return p; } };
const guardaPref = (k, v) => { try { localStorage.setItem('lembra.st.' + k, v ? '1' : '0'); } catch { /* ok */ } };
const desde = (at) => { const m = Math.round((Date.now() - at) / 60000); return m < 1 ? 'agora' : m < 60 ? `há ${m} min` : `há ${Math.round(m / 60)} h`; };
const face = (c, size = 56) => c.photo ? `<span class="stface" style="--s:${size}px"><img src="${esc(c.photo)}" alt=""></span>` : `<span class="stface" style="--s:${size}px;background:${esc(c.color || '#FF6B1A')}">${esc((c.name || '?').charAt(0).toUpperCase())}</span>`;

/* ---------- cache do feed (o Lembra usa para puxar assunto) ---------- */
let feed = { rows: [], pedidos: 0, online: [], at: 0 }, visitas = { list: [], at: 0 };
export const feedCache = () => (doAparelho(), feed);
export const visitasCache = () => (doAparelho(), visitas);
/* o último feed/visitas fica guardado no aparelho: as bolinhas de story aparecem na hora ao abrir */
let doCache = false;
const doAparelho = () => { if (doCache || !store.user) return; doCache = true; const f = leCache('feed', 864e5), v = leCache('visitas', 7 * 864e5); if (f && !feed.at) feed = { ...f, at: 0 }; if (v && !visitas.at) visitas = { ...v, at: 0 }; };
export async function refreshFeed() {
  if (!store.user || store.mode !== 'cloud') return feed;
  doAparelho();
  try { const r = await call('/friends/stories'); feed = { rows: r.rows || [], pedidos: r.pedidos || 0, online: r.online || [], at: Date.now() }; gravaCache('feed', feed); } catch { /* ok */ }
  limpaFotos();
  window.__meuStory = !!meuStory(); document.querySelectorAll('[data-lvring]').forEach((el) => el.classList.toggle('has-story', window.__meuStory));
  return feed;
}
export async function refreshVisitors() {
  if (!store.user || store.mode !== 'cloud') return visitas;
  doAparelho();
  try { const r = await call('/friends/visitors'); visitas = { list: r.visitors || [], at: Date.now() }; gravaCache('visitas', visitas); } catch { /* ok */ }
  return visitas;
}

/* ---------- câmera: só foto tirada agora ---------- */
/* foto → JPEG leve (até 1080 px, até ~400 KB) */
export function prepara(f) {
  return new Promise((res, rej) => {
    const img = new Image(), url = URL.createObjectURL(f);
    img.onload = () => {
      const max = 1080, k = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas'); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url);
      let q = 0.8, out = c.toDataURL('image/jpeg', q);
      while (out.length > 400000 && q > 0.35) { q -= 0.1; out = c.toDataURL('image/jpeg', q); }
      res(out);
    };
    img.onerror = () => rej(new Error('Não consegui ler a foto.'));
    img.src = url;
  });
}
/* câmera (story do compromisso: só foto da hora) */
function tiraFoto(cam = 'environment') {
  return new Promise((res, rej) => {
    const inp = document.createElement('input');
    inp.type = 'file'; inp.accept = 'image/*'; inp.setAttribute('capture', cam); // abre a câmera direto (sem galeria); 'user' = selfie
    inp.style.display = 'none'; document.body.appendChild(inp);
    const t0 = Date.now();
    inp.onchange = () => {
      const f = inp.files && inp.files[0]; inp.remove();
      if (!f) return rej(new Error('cancelou'));
      // foto antiga (da galeria) não vale como prova: a câmera gera um arquivo com data de agora
      if (f.lastModified && f.lastModified < t0 - 10 * 60e3) return rej(new Error('A foto precisa ser tirada agora, pela câmera 📸'));
      prepara(f).then(res, rej);
    };
    inp.click();
  });
}

/* postar o story de um compromisso concluído (kind: 'w' trabalho | 'p' pessoal) */
export const selfie = (t) => /cabel|corte|barb|unha|manicure|sobrancelh|maqui|make|escova|penteado|academia|treino|corrida|caminhada|selfie|look|roupa|pele|dentista|clareamento/i.test(t || '');
export async function postStory({ title = '', ref = '', kind = 'w', cam } = {}) {
  let photo;
  try { photo = await tiraFoto(cam || (selfie(title) ? 'user' : 'environment')); } catch (e) { if (e.message !== 'cancelou') toast(e.message); return null; }
  toast('Postando seu story…');
  try {
    const r = await call('/friends/story-post', { photo, camera: true, title, ref, podeCom: pref('com', true), podeRp: !isTeen() && pref('rp', false) });
    const G = await import('./game.js');
    const livre = !ref, k = livre ? 'livre' : kind, rf = ref || `livre-${todayKey()}`; // story livre: 25 XP, uma vez por dia
    const got = G.storyXp(r.id, k, rf);
    toast(got ? `📸 Story no ar! +${got} XP (em dobro)` : '📸 Story no ar! Seus amigos vão ver por 24 h');
    refreshFeed();
    import('./mascote.js').then((M) => M.react('story')).catch(() => {});
    return r.id;
  } catch (e) { toast(e.message || 'Não consegui postar agora.'); return null; }
}

/* ---------- faixa de stories (bolinhas com anel colorido) ---------- */
/* o story do próprio Lembra (novidades e dicas), como a conta oficial no Instagram */
const lembraKey = () => `lembra.storyLembra.${APP_VERSION}`;
// visto uma vez, some (volta só quando tiver novidade nova); e como todo story, some em 24 h mesmo sem ver
const lembraVisto = () => { try { if (localStorage.getItem(lembraKey()) === '1') return true; const k = lembraKey() + '.desde', d = Number(localStorage.getItem(k)); if (!d) { localStorage.setItem(k, String(Date.now())); return false; } return Date.now() - d > 24 * 3600e3; } catch { return true; } };
export const meuStory = () => feed.rows.find((r) => r.me && r.stories.length) || null;
export function storyStrip(rows = feed.rows, { comMeu = true, lembra = true, convidar = false, dot = false } = {}) {
  const meus = rows.find((r) => r.me && r.stories.length), on = onSet();
  const itens = rows.filter((r) => !r.me && r.stories.length);
  const novos = itens.filter((r) => r.stories.some((x) => !x.seen)), vistos = itens.filter((r) => !r.stories.some((x) => !x.seen)); // quem tem story novo vem primeiro
  const lb = lembra && mascotOn() ? `<button class="ststrip__it" data-st-lembra role="listitem"><span class="stface stface--snh" style="--s:60px">${sininho('feliz', { size: 58 })}</span>${anel({ stories: [{}] })}<small>Lembra</small></button>` : '';
  return `<div class="ststrip" role="list">
    ${comMeu ? `<button class="ststrip__it" data-st-me role="listitem" aria-label="${rotulo(meus, '', true)}">${face(store.member(store.me) || { name: 'Você' }, 60)}<i class="ststrip__plus" data-st-novo role="button" aria-label="Novo story">${icon('plus', 14)}</i><small>Seu story</small>${anel(meus, { meu: true })}</button>` : ''}
    ${!lembraVisto() ? lb : ''}
    ${novos.map((r) => `<button class="ststrip__it${pulsa(r)}" data-st-owner="${esc(r.uid)}" role="listitem" aria-label="${esc(rotulo(r, r.name.split(' ')[0]))}">${face(r, 60)}${anel(r)}${bolinha(r)}${ponto(r.uid, on)}<small>${esc(r.name.split(' ')[0])}</small></button>`).join('')}
    ${vistos.map((r) => `<button class="ststrip__it" data-st-owner="${esc(r.uid)}" role="listitem" aria-label="${esc(rotulo(r, r.name.split(' ')[0]))}">${face(r, 60)}${anel(r)}${ponto(r.uid, on)}<small>${esc(r.name.split(' ')[0])}</small></button>`).join('')}
    ${recentes().map((c) => `<button class="ststrip__it ststrip__conv${c.novas ? ' is-nova' : ''}" data-st-conv="${esc(c.uid)}" role="listitem" aria-label="Conversar com ${esc((c.name || '').split(' ')[0])}">${face(c, 60)}<i class="ststrip__chat" aria-hidden="true">${ICO.chat(13)}</i>${c.novas ? `<i class="ststrip__n">${c.novas > 9 ? '9+' : c.novas}</i>` : ''}${ponto(c.uid, on)}<small>${esc((c.name || '').split(' ')[0])}</small></button>`).join('')}
    ${(feed.online || []).filter((o) => o.uid && !itens.some((r) => r.uid === o.uid) && !recentes().some((c) => c.uid === o.uid)).slice(0, 8).map((o) => `<button class="ststrip__it ststrip__conv" data-st-conv="${esc(o.uid)}" role="listitem" aria-label="${esc((o.name || '').split(' ')[0])} está online. Conversar">${face(o, 60)}<i class="ststrip__on" aria-hidden="true"></i><small>${esc((o.name || '').split(' ')[0])}</small></button>`).join('')}
    ${convidar ? `<button class="ststrip__it ststrip__inv${dot ? ' is-dot' : ''}" data-action="friends" role="listitem" aria-label="Amigos e convites"><span class="ststrip__invc">${icon('plus', 24)}</span><i class="iconbtn__dot"></i><small>Convidar</small></button>` : ''}
  </div>`;
}
/* conversas recentes na mesma faixa: um toque na foto e a conversa abre (antes eram 2 ou 3 toques) */
const onSet = () => new Set((feed.online || []).map((x) => x.uid));
const ponto = (uid, on) => (on.has(uid) ? '<i class="ststrip__on" aria-label="online agora"></i>' : '');
function recentes() { try { return (conversas().lista || []).filter((c) => c.uid && c.name).slice(0, 6); } catch { return []; } }
export function bindStrip(el, onChange) {
  el.querySelectorAll('[data-st-conv]').forEach((b) => (b.onclick = () => import('./privado.js').then((P) => P.openConversa(b.dataset.stConv, recentes().find((c) => c.uid === b.dataset.stConv) || (feed.online || []).find((c) => c.uid === b.dataset.stConv) || {}))));
  el.querySelectorAll('[data-st-owner]').forEach((b) => (b.onclick = () => openViewer(b.dataset.stOwner, onChange)));
  const me = el.querySelector('[data-st-me]');
  if (me) me.onclick = (ev) => { if (ev.target.closest('[data-st-novo]')) return novoStory(onChange); const meus = meuStory(); if (meus) openViewer(meus.uid, onChange); else novoStory(onChange); };
  const lb = el.querySelector('[data-st-lembra]'); if (lb) lb.onclick = () => openLembraStory(onChange);
}
export function comoPostar(onChange) { return novoStory(onChange); }

/* ---------- visualizador em tela cheia ---------- */
/* fotos dos stories guardadas no aparelho: vista uma vez, abre na hora da próxima (somem junto com o story, em 24 h) */
const FOTOS = new Map(), CACHE_ST = 'lembra-stories-v1', chaveFoto = (id) => `/__story/${id}`;
async function fotoGuardada(id) {
  if (FOTOS.has(id)) return FOTOS.get(id);
  try { const c = await caches.open(CACHE_ST); const r = await c.match(chaveFoto(id)); if (r) { const t = await r.text(); FOTOS.set(id, t); return t; } } catch { /* sem cache: tudo bem */ }
  return null;
}
async function guardaFoto(id, foto) {
  FOTOS.set(id, foto);
  try { const c = await caches.open(CACHE_ST); await c.put(chaveFoto(id), new Response(foto, { headers: { 'Content-Type': 'text/plain' } })); } catch { /* ok */ }
}
async function limpaFotos() { // apaga as de stories que já sumiram
  try { const vivos = new Set(feed.rows.flatMap((r) => r.stories.map((x) => chaveFoto(x.id)))); const c = await caches.open(CACHE_ST); for (const k of await c.keys()) if (!vivos.has(new URL(k.url).pathname)) c.delete(k); } catch { /* ok */ }
}
/* a foto de um story: do aparelho se já tiver; senão baixa (e marca visto). "adianta" baixa sem marcar */
async function fotoDe(r, st, { adianta = false } = {}) {
  const tem = await fotoGuardada(st.id);
  if (tem) { if (!adianta && !st.seen && !r.me) { st.seen = true; gravaCache('feed', feed); call('/friends/story-view', { owner: r.uid, id: st.id, modo: 'visto' }).catch(() => {}); } return tem; }
  const res = await call('/friends/story-view', { owner: r.uid, id: st.id, ...(adianta ? { modo: 'foto' } : {}) });
  if (!adianta) { st.seen = true; gravaCache('feed', feed); }
  guardaFoto(st.id, res.photo);
  return res.photo;
}

export async function fotoDoStory(dono, id) {
  const tem = await fotoGuardada(id); if (tem) return tem;
  const r = await call('/friends/story-view', { owner: dono, id, modo: 'foto' }); guardaFoto(id, r.photo); return r.photo;
}
/* ---------- visualizador em tela cheia ----------
   toque à direita/esquerda: próximo/anterior · segurar: pausa · arrastar pra baixo: fecha · arrastar pra cima (no seu): quem viu */
export async function openViewer(ownerUid, onChange, storyId = '') {
  if (!feed.rows.length || Date.now() - feed.at > 60e3) await refreshFeed();
  const ordem = feed.rows.filter((r) => r.stories.length);
  let oi = Math.max(0, ordem.findIndex((r) => r.uid === ownerUid)), si = 0, timer = 0, pausado = false, vez = 0;
  if (!ordem.length) return toast('Nenhum story agora.');
  const alvoSt = storyId ? ordem[oi].stories.findIndex((x) => x.id === storyId) : -1;
  if (storyId && alvoSt < 0) return toast('Esse story já sumiu.');
  const first = ordem[oi].stories.findIndex((x) => !x.seen); si = alvoSt >= 0 ? alvoSt : first < 0 ? 0 : first;
  const w = document.createElement('div');
  w.className = 'stv'; w.setAttribute('role', 'dialog'); w.setAttribute('aria-label', 'Stories');
  (document.getElementById('sheets') || document.body).appendChild(w); document.body.classList.add('has-stv'); // na mesma pilha das janelas: o que abrir depois (Visto por, Apagar) fica na frente
  const DUR = 6000;
  let mudo = (() => { try { return localStorage.getItem('lembra.storyMudo') === '1'; } catch { return false; } })(), som = null;
  const paraSom = () => { if (som) { try { som.pause(); } catch { /* ok */ } som = null; } };
  const fecha = () => { clearInterval(timer); paraSom(); w.classList.add('is-out'); setTimeout(() => { w.remove(); document.body.classList.remove('has-stv'); }, 220); onChange && onChange(); };
  const proximo = () => { const r = ordem[oi]; if (si < r.stories.length - 1) si++; else if (oi < ordem.length - 1) { oi++; si = 0; } else return fecha(); mostra(); };
  const anterior = () => { if (si > 0) si--; else if (oi > 0) { oi--; si = ordem[oi].stories.length - 1; } mostra(); };
  const abreQuemViu = () => { const r = ordem[oi], st = r.stories[si]; if (!r.me) return; pausado = true; openViewers(st.id, () => { pausado = false; }, w.querySelector('.stv__img img')?.src, st); };
  // adianta os próximos 2 (do mesmo amigo e o primeiro do próximo): abrem na hora
  const adianta = () => { const L = []; const r = ordem[oi]; if (r.stories[si + 1]) L.push([r, r.stories[si + 1]]); const r2 = ordem[oi + 1]; if (r2) { const k = Math.max(0, r2.stories.findIndex((x) => !x.seen)); L.push([r2, r2.stories[k]]); } L.forEach(([rr, ss]) => fotoDe(rr, ss, { adianta: true }).catch(() => {})); };
  async function mostra() {
    clearInterval(timer); paraSom();
    const minha = ++vez, r = ordem[oi], st = r.stories[si];
    const n1 = esc(r.name.split(' ')[0]);
    const rodape = r.me ? `<footer class="stv__me"><button class="stv__ativ" data-viewers><span class="stv__faces" data-faces></span><b>Atividade</b><small>${st.views || 0} ${st.views === 1 ? 'viu' : 'viram'}${st.likes ? ` · ${st.likes} ♥` : ''}</small></button>${st.podeCom ? `<button class="stv__ic" data-coms aria-label="Comentários">${ICO.coment(22)}<small>${st.ncom || 'Comentar'}</small></button>` : ''}<button class="stv__ic" data-postar aria-label="Postar outro">${icon('camera', 22)}<small>Postar</small></button><button class="stv__ic" data-del aria-label="Apagar">${icon('trash', 22)}<small>Apagar</small></button></footer>`
      : `<footer class="stv__soc"><div class="stv__emo" data-emo hidden>${['😂', '😮', '😍', '😢', '👏', '🔥'].map((e) => `<button type="button" data-e="${e}" aria-label="Reagir ${e}">${e}</button>`).join('')}</div>
        <form class="stv__resp" data-resp autocomplete="off">${st.podeCom ? `<button type="button" class="stv__modo" data-modo aria-label="Trocar entre privado e comentário público">${icon('lock', 17)}</button>` : ''}<input type="text" maxlength="${st.podeCom ? 200 : 500}" placeholder="Responder ${n1}…" data-in enterkeyhint="send" aria-label="Responder"><button class="stv__manda" data-manda hidden aria-label="Enviar">${ICO.manda(20)}</button></form>
        <button class="stv__b${st.gostei ? ' is-on' : ''}" data-gosta aria-label="Curtir" aria-pressed="${!!st.gostei}">${ICO.coracao(27, st.gostei)}</button>
        ${st.podeCom ? `<button class="stv__b" data-coms aria-label="Comentários">${ICO.coment(26)}${st.ncom ? `<em>${st.ncom}</em>` : ''}</button>` : ''}
        ${(st.podeRp || st.rp) && !(st.rp && st.rp.meu) ? `<button class="stv__b" data-rep aria-label="Repostar no seu story">${icon('repeat', 25)}</button>` : ''}</footer>`;
    w.innerHTML = `<div class="stv__bars">${r.stories.map((x, i) => `<i><b style="width:${i < si ? 100 : 0}%"></b></i>`).join('')}</div>
      <header class="stv__top"><button class="stv__who" data-perfil-dono aria-label="Ver perfil de ${esc(r.name)}">${face(r, 36)}<span><b>${r.me ? 'Seu story' : esc(r.name)}</b><small>${desde(st.at)}${st.rp ? ` · repostou de ${esc(st.rp.name.split(' ')[0])}` : st.title ? ` · ✓ ${esc(st.title)}` : ''}</small></span></button><button class="stv__x" data-x aria-label="Fechar">${icon('x', 22)}</button></header>
      <div class="stv__img"><div class="stv__load"><i></i><i></i><i></i></div></div>
      ${st.caption ? `<p class="stv__cap">${esc(st.caption)}</p>` : ''}
      <div class="stv__falas" data-falas aria-live="polite"></div>
      ${r.me ? '' : `<button class="stv__more" data-more aria-label="Mais opções">${icon('dots', 22)}</button>`}
      ${rodape}
      <button class="stv__nav stv__nav--l" data-prev aria-label="Anterior"></button><button class="stv__nav stv__nav--r" data-next aria-label="Próximo"></button>`;
    w.querySelector('[data-x]').onclick = fecha;
    /* tocar na foto ou no nome leva ao perfil da pessoa (o seu próprio abre o seu perfil) */
    const quem = w.querySelector('[data-perfil-dono]');
    if (quem) quem.onclick = (ev) => { ev.stopPropagation(); if (r.me) return; const uid = r.uid, nome = r.name; fecha(); setTimeout(() => import('./friends.js').then((F) => F.openPublicProfile(uid, { uid, name: nome, photo: r.photo, color: r.color })).catch(() => {}), 260); };
    w.querySelector('[data-prev]').onclick = (ev) => { if (!arrastou) toque(ev, anterior); };
    w.querySelector('[data-next]').onclick = (ev) => { if (!arrastou) toque(ev, proximo); };
    const v = w.querySelector('[data-viewers]'); if (v) v.onclick = abreQuemViu;
    ligaSocial(r, st, minha);
    const pp = w.querySelector('[data-postar]'); if (pp) pp.onclick = () => { fecha(); novoStory(onChange); };
    if (r.me && st.views) call('/friends/story-viewers', { id: st.id }).then((x) => { const f = w.querySelector('[data-faces]'); if (f) f.innerHTML = (x.viewers || []).slice(0, 3).map((c) => face(c, 26)).join(''); }).catch(() => {});
    const mais = w.querySelector('[data-more]');
    if (mais) mais.onclick = () => { pausado = true; denunciaOuBloqueia({ uid: r.uid, name: r.name, storyId: st.id }, () => { pausado = false; }, fecha); };
    const d = w.querySelector('[data-del]');
    if (d) d.onclick = async () => {
      pausado = true;
      if (!(await confirmDialog({ title: 'Apagar este story?', text: st.title ? 'A foto some na hora. O XP em dobro que ele deu sai também (você fica só com o XP normal do compromisso).' : 'A foto some na hora para todo mundo.', ok: 'Apagar', danger: true }))) { pausado = false; return; }
      try { await call('/friends/story-delete', { id: st.id }); const G = await import('./game.js'); const v2 = G.storyXpOff(st.id); toast(v2 ? `Story apagado · −${v2} XP do bônus` : 'Story apagado'); r.stories.splice(si, 1); } catch (e) { toast(e.message || 'Não consegui apagar.'); }
      if (!r.stories.length) return fecha();
      si = Math.min(si, r.stories.length - 1); pausado = false; mostra();
    };
    try {
      const foto = await fotoDe(r, st);
      if (!w.isConnected || minha !== vez) return;
      w.querySelector('.stv__img').innerHTML = st.rp ? `<div class="stv__fundo" style="background-image:url('${foto}')"></div><figure class="stv__cartao"><img src="${foto}" alt="Story de ${esc(st.rp.name)}, repostado" draggable="false"><figcaption>${icon('repeat', 15)} ${esc(st.rp.name)}</figcaption></figure>` : `<img src="${foto}" alt="Story de ${esc(r.name)}" draggable="false">`;
    } catch (e) { if (minha === vez) w.querySelector('.stv__img').innerHTML = `<p class="stv__gone">${esc(e.message || 'Esse story já sumiu.')}</p>`; }
    if (minha !== vez) return;
    adianta();
    // música do story: figurinha no lugar escolhido, trecho tocando e botão de som
    const DURA = st.musica ? 15000 : DUR;
    if (st.musica) {
      const M = await import('./musica.js'); if (minha !== vez || !w.isConnected) return;
      const box = w.querySelector('.stv__img'), f = document.createElement('div');
      f.className = 'mfig-pos is-ver'; f.innerHTML = M.figurinha(st.musica);
      box.appendChild(f); const im = box.querySelector('.stv__cartao img, img');
      const pos = () => im ? M.posiciona(f, im, st.musica.x ?? 0.5, st.musica.y ?? 0.62) : (f.style.left = '50%', f.style.top = '62%');
      if (im && !im.complete) im.addEventListener('load', pos, { once: true }); pos();
      const bt = document.createElement('button'); bt.className = 'stv__som'; bt.type = 'button';
      const pintaBt = () => { bt.innerHTML = mudo ? M.SVG_MUDO : M.SVG_SOM; bt.setAttribute('aria-label', mudo ? 'Ligar o som' : 'Tirar o som'); };
      pintaBt(); w.appendChild(bt);
      som = M.toca(st.musica, { mudo });
      bt.onclick = (ev) => { ev.stopPropagation(); mudo = !mudo; try { localStorage.setItem('lembra.storyMudo', mudo ? '1' : '0'); } catch { /* ok */ } if (som) som.muted = mudo; pintaBt(); };
      if (st.musica.link) f.onclick = (ev) => { ev.stopPropagation(); pausado = true; if (som) som.pause(); window.open(st.musica.link, '_blank', 'noopener'); };
    }
    let gasto = 0, ult = Date.now();
    const bar = w.querySelectorAll('.stv__bars b')[si];
    timer = setInterval(() => { const agora = Date.now(); if (zera) { zera = false; gasto = 0; } if (!pausado && !document.hidden) gasto += agora - ult; ult = agora; if (som) { if (pausado && !som.paused) som.pause(); else if (!pausado && som.paused && !document.hidden) som.play().catch(() => {}); } if (bar) bar.style.width = `${Math.min(100, (gasto / DURA) * 100)}%`; if (gasto >= DURA) proximo(); }, 50);
  }
  /* curtir, comentar, responder e repostar */
  let publico = false, coms = [], zera = false; // zera: interagiu, o tempo do story recomeça
  function coracaoVoa(x, y) {
    zera = true;
    const c = document.createElement('span'); c.className = 'stv__voa'; c.innerHTML = ICO.coracao(96, true); Object.assign(c.style, { left: x + 'px', top: y + 'px' }); w.appendChild(c);
    const g = (Math.random() - 0.5) * 30;
    c.animate([{ transform: `translate(-50%,-50%) scale(0) rotate(${g}deg)`, opacity: 1 }, { transform: `translate(-50%,-50%) scale(1.25) rotate(${g / 2}deg)`, opacity: 1, offset: 0.22 }, { transform: `translate(-50%,-50%) scale(1) rotate(${g / 2}deg)`, opacity: 1, offset: 0.42 }, { transform: `translate(-50%,-190%) scale(.7) rotate(${-g}deg)`, opacity: 0 }], { duration: 1000, easing: 'cubic-bezier(.2,.9,.3,1)' }).finished.finally(() => c.remove());
    for (let i = 0; i < 7; i++) { const p = document.createElement('span'); p.className = 'stv__voa stv__voa--p'; p.innerHTML = ICO.coracao(22, true); Object.assign(p.style, { left: x + 'px', top: y + 'px' }); w.appendChild(p); const a = Math.random() * 6.28, d = 50 + Math.random() * 70; p.animate([{ transform: 'translate(-50%,-50%) scale(.2)', opacity: 1 }, { transform: `translate(calc(-50% + ${Math.cos(a) * d}px), calc(-50% + ${Math.sin(a) * d - 60}px)) scale(1)`, opacity: 0 }], { duration: 700 + Math.random() * 300, delay: 80, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' }).finished.finally(() => p.remove()); }
  }
  function gosta(r, st, x, y, so = false) {
    const b = w.querySelector('[data-gosta]'); if (!b || r.me) return;
    const on = so ? true : !st.gostei;
    if (on) { coracaoVoa(x, y); som('curtida'); try { navigator.vibrate && navigator.vibrate(12); } catch { /* ok */ } }
    if (on === !!st.gostei) return;
    st.gostei = on; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on); b.innerHTML = ICO.coracao(27, on);
    b.animate([{ transform: 'scale(.6)' }, { transform: 'scale(1.35)', offset: 0.5 }, { transform: 'scale(1)' }], { duration: 360, easing: 'cubic-bezier(.2,1.1,.3,1)' });
    call('/friends/story-like', { owner: r.uid, id: st.id, on }).catch((e) => { st.gostei = !on; b.classList.toggle('is-on', !on); b.innerHTML = ICO.coracao(27, !on); toast(e.message || 'Não consegui curtir agora.'); });
  }
  async function falas(r, st, minha) { // comentários passando sobre a foto
    const cx = w.querySelector('[data-falas]'); if (!cx || !st.podeCom || !st.ncom) return;
    try { const x = await call('/friends/story-comments', { owner: r.uid, id: st.id }); coms = x.comentarios || []; } catch { return; }
    if (minha !== vez || !w.isConnected || !coms.length) return;
    let i = Math.max(0, coms.length - 6); const L = coms;
    const passa = () => {
      if (minha !== vez || !w.isConnected) return;
      if (!pausado && i < L.length) { const c = L[i++], e = document.createElement('button'); e.type = 'button'; e.className = 'stv__fala'; e.innerHTML = `${rosto(c, 26)}<span><b>${esc((c.name || '').split(' ')[0])}</b> ${esc(c.t)}</span>`; e.onclick = () => abreComs(r, st); cx.appendChild(e); e.animate([{ transform: 'translateY(18px) scale(.9)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 380, easing: 'cubic-bezier(.16,1,.3,1)' }); while (cx.children.length > 3) cx.firstChild.remove(); }
      if (i < L.length) setTimeout(passa, 1100);
    };
    setTimeout(passa, 500);
  }
  function abreComs(r, st) {
    pausado = true; zera = true;
    const html = () => `${sheetHead(`Comentários${coms.length ? ` · ${coms.length}` : ''}`, { left: '<button class="btn-text" data-close>Fechar</button>' })}<div class="page page--sheet coms">${coms.length ? coms.map((c) => `<div class="com">${rosto(c, 40)}<span><b>${esc(c.name)}</b><p>${esc(c.t)}</p><small>${desde(c.at)}</small></span>${c.apaga ? `<button class="iconbtn" data-ap="${esc(c.id)}" aria-label="Apagar comentário">${icon('trash', 17)}</button>` : `<button class="iconbtn" data-dn="${esc(c.id)}" data-u="${esc(c.uid)}" aria-label="Denunciar comentário">${icon('flag', 17)}</button>`}</div>`).join('') : '<p class="fhelp coms__v">Nenhum comentário ainda. Seja a primeira pessoa 😄</p>'}</div>
      <form class="coms__f" data-f autocomplete="off"><input class="input" maxlength="200" placeholder="Comentar para todos…" data-c aria-label="Comentário"><button class="conv__b conv__b--ir" aria-label="Enviar">${ICO.manda(20)}</button></form>`;
    const a = openSheet({ className: 'sheet--coms', html: html(), onClose: () => { pausado = false; }, onMount: (x) => {
      x.el.querySelector('[data-f]').onsubmit = async (e) => { e.preventDefault(); const t = x.el.querySelector('[data-c]').value.trim(); if (!t) return; if (await comenta(r, st, t)) { if (!a.closed) a.set(html()); } };
      x.el.querySelectorAll('[data-ap]').forEach((b) => (b.onclick = async () => { try { const k = await call('/friends/story-comment-del', { owner: r.uid, id: st.id, cid: b.dataset.ap }); st.ncom = k.n; coms = coms.filter((c) => c.id !== b.dataset.ap); a.set(html()); } catch (e2) { toast(e2.message); } }));
      x.el.querySelectorAll('[data-dn]').forEach((b) => (b.onclick = async () => { if (!(await confirmDialog({ title: 'Denunciar este comentário?', text: 'A denúncia é anônima.', ok: 'Denunciar', danger: true }))) return; try { await call('/friends/report', { owner: b.dataset.u, motivo: 'Comentário em story', cid: b.dataset.dn }); toast('Denúncia enviada 🙏'); } catch { toast('Não consegui enviar agora.'); } }));
    } });
    call('/friends/story-comments', { owner: r.uid, id: st.id }).then((k) => { coms = k.comentarios || []; if (!a.closed && !a.el.querySelector('[data-c]').value) a.set(html()); }).catch(() => {});
  }
  async function comenta(r, st, t) {
    zera = true;
    try {
      const k = await call('/friends/story-comment', { owner: r.uid, id: st.id, text: t }), me = store.member(store.me) || {};
      st.ncom = k.n; coms = [...coms, { id: k.id, uid: store.user?.uid, t, at: k.at, meu: true, apaga: true, name: me.name || 'Você', photo: me.photo, color: me.color }];
      const b = w.querySelector('[data-coms]'); if (b && !r.me) { let e = b.querySelector('em'); if (!e) { e = document.createElement('em'); b.appendChild(e); } e.textContent = k.n; }
      som('msgVai'); try { navigator.vibrate && navigator.vibrate(8); } catch { /* ok */ }
      const cx = w.querySelector('[data-falas]'); if (cx) { const c = coms.at(-1), e = document.createElement('span'); e.className = 'stv__fala'; e.innerHTML = `${rosto(c, 26)}<span><b>Você</b> ${esc(t)}</span>`; cx.appendChild(e); e.animate([{ transform: 'translateY(30px) scale(.8)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 420, easing: 'cubic-bezier(.2,1.1,.3,1)' }); while (cx.children.length > 3) cx.firstChild.remove(); }
      return true;
    } catch (e) { toast(e.message || 'Não consegui comentar agora.'); return false; }
  }
  async function responde(r, st, t, emo) {
    zera = true;
    try { await call('/friends/msg-send', { com: r.uid, tipo: 'story', owner: r.uid, id: st.id, txt: t }); som('msgVai'); toast(emo ? `${t} enviado para ${r.name.split(' ')[0]}` : `Enviado só para ${r.name.split(' ')[0]} 🔒`); return true; } catch (e) { toast(e.message || 'Não consegui enviar agora.'); return false; }
  }
  function ligaSocial(r, st, minha) {
    coms = []; publico = false; falas(r, st, minha);
    const q = (s2) => w.querySelector(s2), g = q('[data-gosta]'), inp = q('[data-in]'), emo = q('[data-emo]'), md = q('[data-modo]'), mn = q('[data-manda]');
    if (g) g.onclick = () => { const k = g.getBoundingClientRect(); gosta(r, st, k.left + k.width / 2, k.top - 70); };
    w.querySelectorAll('[data-coms]').forEach((b) => (b.onclick = () => abreComs(r, st)));
    const rp = q('[data-rep]'); if (rp) rp.onclick = () => { pausado = true; repostar(r, st, q('.stv__img img')?.src, () => { pausado = false; }, onChange); };
    if (!inp) return;
    const n1 = r.name.split(' ')[0], foco = (on) => { w.classList.toggle('is-escreve', on); if (on) pausado = true; emo.hidden = !on || publico; };
    inp.onfocus = () => foco(true);
    inp.onblur = () => setTimeout(() => { if (!w.isConnected || w.contains(document.activeElement) && document.activeElement.closest('.stv__soc')) return; foco(false); if (!document.querySelector('.sheet-wrap.is-open')) pausado = false; }, 160);
    inp.oninput = () => { mn.hidden = !inp.value.trim(); };
    if (md) md.onclick = () => { publico = !publico; md.classList.toggle('is-pub', publico); md.innerHTML = publico ? ICO.coment(18) : icon('lock', 17); inp.placeholder = publico ? 'Comentar…' : `Responder ${n1}…`; md.animate([{ transform: 'rotateY(90deg)' }, { transform: 'none' }], { duration: 220 }); inp.focus(); emo.hidden = publico; };
    q('[data-resp]').onsubmit = async (e) => { e.preventDefault(); const t = inp.value.trim(); if (!t) return; inp.disabled = true; const ok = publico ? await comenta(r, st, t) : await responde(r, st, t); inp.disabled = false; if (ok) { inp.value = ''; mn.hidden = true; inp.blur(); foco(false); pausado = false; } };
    w.querySelectorAll('[data-e]').forEach((b) => (b.onclick = async () => { const k = b.getBoundingClientRect(); for (let i = 0; i < 9; i++) { const p = document.createElement('span'); p.className = 'stv__emov'; p.textContent = b.dataset.e; Object.assign(p.style, { left: k.left + k.width / 2 + (Math.random() - 0.5) * 120 + 'px', top: k.top + 'px' }); w.appendChild(p); p.animate([{ transform: 'translate(-50%,0) scale(.4)', opacity: 0 }, { transform: 'translate(-50%,-60px) scale(1.2)', opacity: 1, offset: 0.25 }, { transform: `translate(calc(-50% + ${(Math.random() - 0.5) * 120}px), -${300 + Math.random() * 200}px) scale(.9) rotate(${(Math.random() - 0.5) * 60}deg)`, opacity: 0 }], { duration: 1300 + Math.random() * 500, delay: i * 45, easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'backwards' }).finished.finally(() => p.remove()); } inp.blur(); foco(false); pausado = false; som('curtida'); responde(r, st, b.dataset.e, true); }));
  }
  // dois toques na foto: curtir
  let tTap = 0, tNav = 0;
  const toque = (ev, vai) => { const r = ordem[oi], st = r.stories[si]; if (w.classList.contains('is-escreve')) { w.querySelector('[data-in]')?.blur(); return; } if (r.me) return vai(); if (Date.now() - tTap < 280) { tTap = 0; clearTimeout(tNav); return gosta(r, st, ev.clientX || innerWidth / 2, ev.clientY || innerHeight / 2, true); } tTap = Date.now(); clearTimeout(tNav); tNav = setTimeout(() => { if (w.isConnected) vai(); }, 285); };
  // gestos: o dedo segura (pausa), arrasta pra baixo (fecha) ou pra cima (quem viu, no seu story)
  let y0 = null, x0 = 0, arrastou = false;
  w.addEventListener('pointerdown', (e) => { if (e.target.closest('button:not(.stv__nav), a, input, .stv__soc')) return; pausado = true; y0 = e.clientY; x0 = e.clientX; arrastou = false; w.classList.add('is-drag'); });
  w.addEventListener('pointermove', (e) => {
    if (y0 == null) return;
    const dy = e.clientY - y0;
    if (Math.abs(dy) > 8 || Math.abs(e.clientX - x0) > 8) arrastou = true;
    if (dy > 0) w.style.transform = `translateY(${dy * 0.75}px) scale(${1 - Math.min(0.12, dy / 2400)})`;
    else w.style.transform = `translateY(${Math.max(-60, dy * 0.25)}px)`;
    w.style.borderRadius = dy > 0 ? `${Math.min(28, dy / 6)}px` : '';
  });
  const solta = (e) => {
    if (y0 == null) return;
    const dy = e.clientY - y0; y0 = null; pausado = w.classList.contains('is-escreve'); w.classList.remove('is-drag');
    if (dy > 110) { w.style.transform = `translateY(${innerHeight}px)`; return setTimeout(fecha, 120); }
    w.style.transform = ''; w.style.borderRadius = '';
    if (dy < -70 && ordem[oi].me) abreQuemViu(); else if (dy < -70) w.querySelector('[data-in]')?.focus();
    setTimeout(() => { arrastou = false; }, 60);
  };
  w.addEventListener('pointerup', solta);
  w.addEventListener('pointercancel', solta);
  requestAnimationFrame(() => w.classList.add('is-in'));
  mostra();
}

/* quem viu o seu story */
function openViewers(id, onClose, foto, st = {}) {
  let lista = null;
  const html = () => `<div class="stvw">
    <header class="stvw__top"><button class="stvw__x" data-close aria-label="Fechar">${icon('x', 22)}</button>
      ${foto ? `<span class="stvw__thumb"><img src="${esc(foto)}" alt=""></span>` : ''}
      <span class="stvw__n">${icon('eye', 16)} ${lista ? lista.length : st.views || 0}${lista && lista.some((c) => c.gostou) ? ` · ${ICO.coracao(15, true)} ${lista.filter((c) => c.gostou).length}` : ''}</span>${st.title ? `<small class="stvw__t">${icon('check', 12)} ${esc(st.title)}</small>` : ''}</header>
    <h3 class="stvw__h">Quem viu este story</h3>
    ${!lista ? '<div class="fx__load"><i></i><i></i><i></i></div>' : lista.length ? lista.map((c) => `<button class="stvw__row" data-uid="${esc(c.uid || '')}" aria-label="Ver perfil de ${esc(c.name)}">${face(c, 52)}<span><b>${esc(c.name)}</b><small>${desde(c.at).replace(/^há/, 'Há').replace(/^agora$/, 'Agora')}</small></span>${c.repostou ? `<i class="stvw__r">${icon('repeat', 18)}</i>` : ''}${c.gostou ? `<i class="stvw__g">${ICO.coracao(20, true)}</i>` : ''}</button>`).join('') : '<p class="fhelp">Ninguém viu ainda. Daqui a pouco aparece gente 👀</p>'}</div>`;
  const liga = (el) => el.querySelectorAll('.stvw__row[data-uid]').forEach((b) => (b.onclick = async () => { const c = (lista || []).find((v) => v.uid === b.dataset.uid); if (c) (await import('./friends.js')).openFriendProfile(c); }));
  const a = openSheet({ className: 'sheet--tall sheet--stview sheet--fx', html: html(), onClose, onMount: (x) => liga(x.el) });
  call('/friends/story-viewers', { id }).then((r) => { lista = r.viewers || []; if (!a.closed) { a.set(html()); liga(a.el); } }).catch(() => { lista = []; if (!a.closed) { a.set(html()); liga(a.el); } });
}

/* ---------- tela "Stories" (feed) ---------- */
export async function openStoriesFeed() {
  const html = () => `${sheetHead('Stories', { left: '<button class="btn-text" data-close>Fechar</button>' })}<div class="page page--sheet">
    ${storyStrip()}
    ${feed.rows.filter((r) => !r.me).length ? `<h3 class="ah">Atualizações recentes</h3><div class="agroup">${feed.rows.filter((r) => !r.me).map((r) => { const novo = r.stories.some((x) => !x.seen); const ult = Math.max(...r.stories.map((x) => x.at)); return `<button class="frow" data-st-owner="${esc(r.uid)}"><span class="anelf">${face(r, 46)}${anel(r)}${bolinha(r)}</span><span class="frow__id"><b>${esc(r.name)}</b><small>${desde(ult)} · ${novo ? `${conta(r).novos} para ver` : 'tudo visto'}</small></span></button>`; }).join('')}</div>` : '<p class="fhelp">Nenhum amigo postou nas últimas 24 h. Que tal ser o primeiro? Conclua um compromisso e poste a foto 📸</p>'}
  </div>`;
  const a = openSheet({ className: 'sheet--tall sheet--fx sheet--fxl', html: html(), onMount: (x) => bindStrip(x.el, () => { if (!a.closed) a.set(html()); }) });
  await refreshFeed(); if (!a.closed) a.set(html());
  return a;
}

/* ---------- quem visitou o seu perfil ---------- */
export const visitasNovas = () => { let v = 0; try { v = +localStorage.getItem('lembra.visitasVistas') || 0; } catch { /* ok */ } return visitasCache().list.filter((x) => x.at > v); };
/* cartão que chama atenção só quando há visita NOVA de verdade (some depois de vista) */
export const olhandoAgora = (agora = Date.now()) => visitasCache().list.filter((x) => agora - x.at < 3 * 60e3);
export function visitaCard() {
  const ag = olhandoAgora();
  if (ag.length) return `<button class="visita visita--agora" data-action="visitas"><span class="visita__rostos">${ag.slice(0, 3).map((c) => `<i class="visita__anel">${face(c, 44)}</i>`).join('')}</span><span class="visita__t"><b>👀 ${ag.length === 1 ? '1 pessoa está' : `${ag.length} pessoas estão`} olhando o seu perfil agora</b><small>Toque para ver quem é</small></span><em class="visita__ao">ao vivo</em></button>`;
  const n = visitasNovas(); if (!n.length) return '';
  const p = (n[0].name || 'Alguém').split(' ')[0];
  return `<button class="visita" data-action="visitas"><span class="visita__rostos">${n.slice(0, 3).map((c) => `<i class="visita__anel">${face(c, 44)}</i>`).join('')}</span><span class="visita__t"><b>${n.length === 1 ? `${esc(p)} viu seu perfil` : `${esc(p)} e mais ${n.length - 1} viram seu perfil`}</b><small>${desde(n[0].at)} · toque para ver</small></span><em>${n.length}</em></button>`;
}
/** põe (ou atualiza) o cartão de visita no Hoje sem redesenhar a tela */
export function pintaVisita() { const v = document.getElementById('view'); if (!v) return; v.querySelector('.visita')?.remove(); const alvo = v.querySelector('.page > .foco, .page > .pquick'); const h = alvo && visitaCard(); if (h) alvo.insertAdjacentHTML('afterend', h); }
export async function openVisitors() {
  let lista = null;
  const novos = new Set(visitasNovas().map((x) => x.uid));
  const html = () => `${sheetHead('Quem visitou seu perfil', { left: '<button class="btn-text" data-close>Fechar</button>' })}<div class="page page--sheet">
    ${mascotOn() ? `<div class="atr__hero vis__hero"><div class="atr__fig">${sininho('desconfiado', { size: 84 })}</div><p class="atr__bub"><span data-vbub>Deixa eu ver quem andou xeretando… 🕵️</span></p></div>` : ''}
    <p class="fhelp">Amigos que passaram pelo seu perfil nos últimos 7 dias. Quando você visita o perfil de alguém, essa pessoa também vê 👀</p>
    ${!lista ? '<p class="fhelp">Carregando…</p>' : lista.length ? `<div class="vis__lista">${lista.map((c, i) => `<button class="frow visrow${novos.has(c.uid) ? ' is-nova' : ''}" style="--i:${Math.min(i, 8)}" data-uid="${esc(c.uid)}"><i class="visita__anel">${face(c, 52)}</i><span class="frow__id"><b>${esc(c.name)}</b><small>passou ${desde(c.at).replace('há', 'há')}${c.n > 1 ? ` · ${c.n} vezes` : ''}</small></span>${novos.has(c.uid) ? '<em class="visrow__novo">novo</em>' : ''}${icon('right', 16)}</button>`).join('')}</div>` : '<p class="fhelp">Ninguém passou por aqui ainda. Poste um story que o povo aparece 😉</p>'}</div>`;
  const a = openSheet({ className: 'sheet--tall sheet--fx sheet--fxl', html: html(), onMount: (x) => {
    x.el.querySelectorAll('[data-uid]').forEach((b) => (b.onclick = async () => { const c = lista.find((v) => v.uid === b.dataset.uid); if (c) (await import('./friends.js')).openFriendProfile(c); }));
  } });
  await refreshVisitors(); lista = visitas.list; visitasNovas().forEach((x) => novos.add(x.uid)); if (!a.closed) a.set(html());
  if (novos.size) import('./sound.js').then((s) => s.espia()).catch(() => {});
  try { localStorage.setItem('lembra.visitasVistas', String(Date.now())); } catch { /* ok */ }
  // o Lembra olha pra você, desconfia e solta a fofoca (com a risadinha de quem sabe das coisas)
  const fig = a.el.querySelector('.vis__hero [data-snh]'), bub = a.el.querySelector('[data-vbub]');
  if (fig && bub) {
    alive();
    const n1 = lista[0] ? lista[0].name.split(' ')[0] : '';
    const t = !lista.length ? 'Ninguém passou ainda… posta um story que o povo aparece 😉'
      : lista.length === 1 ? `Hmm… que que será que ${n1} tava querendo, hein? 🤭`
      : `${lista.length} pessoas passaram por aqui! ${n1} foi a última… será que tá com saudade? 👀`;
    setTimeout(() => { act(fig, 'olhaLados'); }, 300);
    setTimeout(() => { setMood(fig, lista.length ? 'desconfiado' : 'feliz'); say(fig, t, { bubble: bub, speed: 24 }); }, 1100);
    if (lista.length) { setTimeout(() => act(fig, 'sobrancelha'), 2600); setTimeout(() => act(fig, 'maoBoca'), 4300); }
    setTimeout(() => vivo(fig, { aponta: a.el.querySelector('[data-uid]'), gestos: ['pisca', 'cinico', 'olhaLados', 'sobrancelha'] }), 6500);
  }
  return a;
}

/* denunciar um story / bloquear uma pessoa (sem sair do app) */
export function denunciaOuBloqueia({ uid, name, storyId = '' }, onClose, depoisBloquear) {
  const n1 = (name || 'essa pessoa').split(' ')[0];
  const MOTIVOS = ['Nudez ou conteúdo sexual', 'Violência ou ameaça', 'Assédio ou bullying', 'Discurso de ódio', 'Spam ou golpe', 'Outro motivo'];
  const a = openSheet({ className: 'sheet--solid', onClose, html: `${sheetHead(storyId ? 'Denunciar ou bloquear' : `Opções · ${esc(n1)}`, { left: '<button class="btn-text" data-close>Fechar</button>' })}
    <div class="page page--sheet"><p class="fhelp">A denúncia é anônima: ${esc(n1)} não fica sabendo. O conteúdo é revisado e sai do ar se violar as regras.</p>
    <div class="agroup">${MOTIVOS.map((m) => `<button class="frow" data-mot="${esc(m)}">${icon('flag', 18)}<span class="frow__id"><b>Denunciar: ${esc(m)}</b></span></button>`).join('')}</div>
    <button class="btn btn--danger-soft btn--block" data-bloq>${icon('x', 16)} Bloquear ${esc(n1)}</button>
    <p class="fhelp">Bloquear desfaz a amizade, esconde os stories e impede novos convites de ${esc(n1)}.</p></div>` ,
    onMount: (x) => {
      x.el.querySelectorAll('[data-mot]').forEach((b) => (b.onclick = async () => { try { await call('/friends/report', { owner: uid, id: storyId, motivo: b.dataset.mot }); toast('Denúncia enviada. Obrigado por avisar 🙏'); } catch { toast('Não consegui enviar agora.'); } x.close(); }));
      x.el.querySelector('[data-bloq]').onclick = async () => {
        if (!(await confirmDialog({ title: `Bloquear ${n1}?`, text: 'Vocês deixam de ser amigos e ninguém vê mais o perfil nem os stories do outro.', ok: 'Bloquear', danger: true }))) return;
        try { await call('/friends/block', { uid }); toast(`${n1} foi bloqueado(a)`); feed.rows = feed.rows.filter((r) => r.uid !== uid); } catch { toast('Não consegui bloquear agora.'); }
        x.close(); depoisBloquear && depoisBloquear();
      };
    } });
  return a;
}

/* ---------- convite para postar o story logo depois de concluir ----------
   Aparece na hora em que a pessoa conclui algo (neste aparelho), quando não tem outra comemoração na tela.
   Mostra só o que é VERDADE: o XP da foto (com o limite do dia), o nível que ela alcança e os emblemas que
   destravam com esse XP (calculado com as mesmas regras do jogo). Se já postou desse compromisso, não aparece. */
let ultimoToque = 0, ultConvite = 0;
if (typeof document !== 'undefined') document.addEventListener('pointerdown', () => { ultimoToque = Date.now(); }, { passive: true, capture: true });
const ocupado = () => !!document.querySelector('.stk, .gx, .okfx, .photogate, .avgate, .paywall, .ficha, .stv, .sheet--cvs');
function quandoLivre(fn, n = 0) { if (!ocupado()) return fn(); if (n < 50) setTimeout(() => quandoLivre(fn, n + 1), 600); }
if (typeof window !== 'undefined') window.addEventListener('lembra:concluiu', (ev) => {
  const d = ev.detail || {};
  if (!d.ref || store.mode !== 'cloud' || !store.solo || !store.user) return;
  if (Date.now() - ultimoToque > 10000) return;          // concluído em outro aparelho: aqui não convida
  if (Date.now() - ultConvite < 20000) return;            // várias de uma vez: um convite só
  ultConvite = Date.now();
  setTimeout(() => quandoLivre(() => convidaStory(d)), 2100); // depois da comemoração do Lembra (~1,2 s de reação antes)
});
const tituloDe = (ref) => {
  const [k, id] = ref.split(':');   // e:id | p:id | p:id:data (lembrete que repete: cada dia vale uma foto)
  if (k === 'e') { const e = store.event(id); return e ? (e.title || 'Compromisso') : ''; }
  const p = personal.item(id); return p ? (p.title || 'Lembrete') : '';
};
export async function convidaStory({ ref, kind = 'w' }) {
  const G = await import('./game.js');
  const { badgeArt, crest, RARITY } = await import('./badges.js');
  const title = tituloDe(ref);
  if (!title) return;
  const P = G.previewStory(kind, ref);
  if (P.ja) return;                                       // já postou desse: nada de pedir de novo
  const snh = mascotOn();
  const amigos = feed.rows.filter((r) => !r.me && r.stories.length);
  const sobe = P.lv1 > P.lv0, bs = P.badges.slice(0, 2);
  const frases = bs.length ? [`Posta a foto e o emblema “${bs[0].name()}” é seu na hora 🏅`, `Uma foto e “${bs[0].name()}” entra pra sua coleção ✨`]
    : sobe ? [`Uma foto e você sobe pro nível ${P.lv1}! 🚀`, `Tá a uma foto do nível ${P.lv1}! Bora? 😎`]
    : !P.got ? ['Seu XP de hoje já bateu o limite… mas seus amigos vão adorar ver 📸']
    : selfie(title) ? ['Ficou bom demais, né? Mostra pra galera! 🤳', 'Isso merece uma selfie 😏 XP em dobro!']
    : ['Foto = XP em dobro. Bora mostrar que você fez? 😎', 'Quem posta, prova. E quem prova, sobe no ranking 🏆', 'Seus amigos vão ver que você mandou bem 👀'];
  const fala = frases[Math.floor(Math.random() * frases.length)];
  const barra = () => {
    if (sobe || !P.got) return '';
    const a = Math.round(P.L0.pct * 100), b = Math.round(P.L1.pct * 100), falta = P.L1.need;
    return `<div class="cvs__nivel"><span class="cvs__nv">${crest(P.lv0, 40)}</span><div class="cvs__bar"><small>Nível ${P.lv0} → ${P.lv0 + 1}</small><span class="cvs__trilho"><i style="width:${a}%"></i><i class="cvs__ganho" style="left:${a}%;width:${Math.max(2, b - a)}%"></i></span><small>${falta ? `Com a foto, faltam só <b>${falta.toLocaleString('pt-BR')} XP</b> pro nível ${P.lv0 + 1}` : `Com a foto você chega no nível ${P.lv0 + 1}`}</small></div></div>`;
  };
  const html = `<div class="cvs">
    <button class="cvs__x" data-close aria-label="Fechar">${icon('x', 18)}</button>
    <div class="cvs__hero">${snh ? `<span class="cvs__snh">${sininho('comemora', { size: 112 })}</span>` : `<span class="cvs__cam">${icon('camera', 40)}</span>`}<p class="cvs__bub">${esc(fala)}</p></div>
    <h2 class="cvs__t">Feito! Agora mostra que você fez 📸</h2>
    <p class="cvs__task">${icon('check', 14)} ${esc(title)}</p>
    ${P.got ? `<div class="cvs__xp"><span><b>+${P.got} XP</b><small>pela foto · o dobro do que você ganhou</small></span><i>2×</i></div>` : ''}
    ${bs.length ? `<div class="cvs__unlock"><small>Desbloqueia agora com essa foto</small>${bs.map((b) => `<div class="cvs__emb">${badgeArt(b, 64)}<span><b>${esc(b.name())}</b><small>${RARITY[b.rarity].label} · +${RARITY[b.rarity].xp} XP</small></span></div>`).join('')}</div>` : ''}
    ${sobe ? `<div class="cvs__unlock cvs__unlock--lv">${crest(P.lv1, 64)}<span><b>Você sobe pro nível ${P.lv1}</b><small>${P.novoBrasao ? `e ganha o brasão ${esc(P.tier.name())} 🛡️` : `${(P.xpDepois).toLocaleString('pt-BR')} XP no total`}</small></span></div>` : barra()}
    ${amigos.length ? `<div class="cvs__amigos"><span class="cvs__faces">${amigos.slice(0, 3).map((r) => face(r, 28)).join('')}</span><small>${esc(amigos[0].name.split(' ')[0])}${amigos.length > 1 ? ` e mais ${amigos.length - 1}` : ''} ${amigos.length > 1 ? 'postaram' : 'postou'} nas últimas 24 h</small></div>` : ''}
    <button class="cvs__go" data-foto>${icon('camera', 20)} ${P.got ? `Tirar foto agora · +${P.total} XP` : 'Tirar foto agora'}</button>
    <button class="cvs__depois" data-close>Agora não</button>
    <p class="cvs__fine">${icon('lock', 12)} Foto tirada na hora, pela câmera · só seus amigos veem · some em 24 h</p>
  </div>`;
  const a = openSheet({ className: 'sheet--cvs', html, onMount: (x) => {
    alive();
    const f = x.el.querySelector('.cvs__snh [data-snh]'); if (f) vivo(f, { aponta: x.el.querySelector('[data-foto]'), gestos: ['pisca', 'riso', 'sim'], cada: [2.6, 4.2] });
    // a câmera precisa abrir no mesmo toque (o navegador bloqueia se esperar)
    x.el.querySelector('[data-foto]').onclick = () => { a.close(); postStory({ title, ref, kind }); };
  } });
  return a;
}

/* algo concluído hoje que ainda pode virar story com bônus (o Lembra lembra depois, com os números de verdade) */
export function fotoPendente() {
  if (store.mode !== 'cloud' || !store.solo || !store.user) return null;
  const t = todayKey();
  const ws = (store.eventsOn ? store.eventsOn(t, { person: store.me || 'all' }) : [])
    .filter((e) => e.status === 'feito' && [...(e.assignees || []), e.createdBy].includes(store.me))
    .map((e) => ({ ref: `e:${e.id}`, title: e.title || 'Compromisso', kind: 'w', at: e.updatedAt || 0 }));
  const ps = (personal.events || []).filter((p) => p.done && p.date === t && (!p.repeat || p.repeat === 'none'))
    .map((p) => ({ ref: `p:${p.id}`, title: p.title || 'Lembrete', kind: 'p', at: p.updatedAt || 0 }));
  for (const x of [...ws, ...ps].sort((a, b) => b.at - a.at)) { const P = previewStory(x.kind, x.ref); if (!P.ja && P.got) return { ...x, P }; }
  return null;
}

/* ---------- o story do Lembra: novidades da versão + dicas, em cartões com ele ---------- */
export function openLembraStory(onChange) {
  const dicas = [
    { t: 'Poste um story e ganhe mais 📸', s: 'Story vale 25 XP e 5 pontos no ranking, mais que qualquer outra coisa aqui. Toque em + e poste!', m: 'comemora' },
    { t: 'Concluiu? Mostra! 📸', s: 'A foto do que você fez vale XP em dobro. E eu te conto na hora se ela destrava nível ou emblema.', m: 'comemora' },
    { t: 'Me leva pra onde quiser', s: 'Arrasta eu pra qualquer altura da tela. Só não me sacode muito, tá? 😵', m: 'surpreso' },
    { t: 'Quem passou no seu perfil? 👀', s: 'Em Amigos aparece quem visitou você nos últimos 7 dias.', m: 'desconfiado' },
    { t: 'Sua agenda em primeiro lugar', s: 'Marcou, eu lembro. Atrasou, eu aviso com jeitinho. Feito, a gente comemora.', m: 'acena' },
  ];
  /* as novidades vêm dos quadros da versão mais nova (sempre atualizadas); sem eles, as notas da versão */
  const vers = Object.keys(NOVIDADES).sort((x, y) => { const A = x.split('.').map(Number), B = y.split('.').map(Number); for (let k = 0; k < 3; k++) if ((A[k] || 0) !== (B[k] || 0)) return (B[k] || 0) - (A[k] || 0); return 0; });
  const quadros = (vers[0] && NOVIDADES[vers[0]]) || [];
  const novas = quadros.slice(0, 5).map((q, i) => ({ t: i ? q.t : 'Novidade no Lembra ✨', s: q.s.replace('|', ' '), m: q.m || 'feliz' }));
  const slides = [...(novas.length ? novas : (APP_NOTES || []).slice(0, 3).map((n, i) => ({ t: i ? 'E mais…' : 'Novidade no Lembra ✨', s: n, m: i ? 'feliz' : 'danca' }))), ...dicas];
  let i = 0, timer = 0, gasto = 0, ult = 0, pausado = false;
  const w = document.createElement('div'); w.className = 'stv stv--lembra'; w.setAttribute('role', 'dialog');
  (document.getElementById('sheets') || document.body).appendChild(w); document.body.classList.add('has-stv');
  try { localStorage.setItem(lembraKey(), '1'); } catch { /* ok */ }
  const fecha = () => { clearInterval(timer); w.classList.add('is-out'); setTimeout(() => { w.remove(); document.body.classList.remove('has-stv'); }, 220); onChange && onChange(); };
  const mostra = () => {
    clearInterval(timer);
    const sl = slides[i];
    w.innerHTML = `<div class="stv__bars">${slides.map((_, k) => `<i><b style="width:${k < i ? 100 : 0}%"></b></i>`).join('')}</div>
      <header class="stv__top"><span class="stface stface--snh" style="--s:36px">${sininho('feliz', { size: 34 })}</span><span><b>Lembra</b><small>novidades e dicas</small></span><button class="stv__x" data-x aria-label="Fechar">${icon('x', 22)}</button></header>
      <div class="stvl"><span class="stvl__snh">${sininho(sl.m, { size: 210 })}</span><h2>${esc(sl.t)}</h2><p>${esc(sl.s)}</p></div>
      <button class="stv__nav stv__nav--l" data-prev aria-label="Anterior"></button><button class="stv__nav stv__nav--r" data-next aria-label="Próximo"></button>`;
    alive();
    w.querySelector('[data-x]').onclick = fecha;
    w.querySelector('[data-prev]').onclick = () => { if (i > 0) { i--; mostra(); } };
    w.querySelector('[data-next]').onclick = () => { if (i < slides.length - 1) { i++; mostra(); } else fecha(); };
    gasto = 0; ult = Date.now();
    const bar = w.querySelectorAll('.stv__bars b')[i];
    timer = setInterval(() => { const agora = Date.now(); if (!pausado && !document.hidden) gasto += agora - ult; ult = agora; if (bar) bar.style.width = `${Math.min(100, (gasto / 5500) * 100)}%`; if (gasto >= 5500) { if (i < slides.length - 1) { i++; mostra(); } else fecha(); } }, 50);
  };
  w.addEventListener('pointerdown', () => { pausado = true; }); w.addEventListener('pointerup', () => { pausado = false; }); w.addEventListener('pointercancel', () => { pausado = false; });
  requestAnimationFrame(() => w.classList.add('is-in'));
  mostra();
}

/* ---------- novo story (livre, como no Instagram): câmera ou galeria, com legenda ----------
   o story do compromisso concluído (foto da hora) continua valendo XP em dobro; o livre não dá XP */
export function novoStory(onChange) {
  if (store.mode !== 'cloud' || !store.user) return toast('Entre na sua conta para postar stories.');
  const fp = fotoPendente();
  const a = openSheet({
    className: 'sheet--actions sheet--phm',
    html: `<div class="phm">
      <div class="phm__head"><span class="phm__pic"><span>${face(store.member(store.me) || { name: 'Você' }, 72)}</span></span><b>Novo story</b><small>Seus amigos veem · some em 24 h</small></div>
      ${fp ? `<div class="phm__grp"><button class="phm__row" data-tarefa><span class="phm__ic is-cam">${icon('check', 21)}</span><span class="phm__t"><b>Foto de “${esc(fp.title)}”</b><small>Prova do que você fez · +${fp.P.total} XP agora</small></span>${icon('right', 16)}</button></div>` : ''}
      <div class="phm__grp">
        <label class="phm__row"><span class="phm__ic is-story">${icon('camera', 21)}</span><span class="phm__t"><b>Câmera</b><small>Tirar uma foto agora</small></span>${icon('right', 16)}<input type="file" accept="image/*" capture="environment" data-livre hidden></label>
        <label class="phm__row"><span class="phm__ic is-n">${icon('image', 21)}</span><span class="phm__t"><b>Galeria</b><small>Escolher uma foto do celular</small></span>${icon('right', 16)}<input type="file" accept="image/*" data-livre hidden></label>
      </div>
      <button class="phm__cancel" data-close>Cancelar</button>
    </div>`,
    onMount: (x) => {
      const t = x.el.querySelector('[data-tarefa]'); if (t) t.onclick = () => { x.close(); postStory({ title: fp.title, ref: fp.ref, kind: fp.kind }).then(() => onChange && onChange()); };
      x.el.querySelectorAll('[data-livre]').forEach((inp) => (inp.onchange = async () => {
        const f = inp.files && inp.files[0]; if (!f) return; x.close();
        try { editorStory(await prepara(f), onChange); } catch (e) { toast(e.message || 'Não consegui abrir a foto.'); }
      }));
    },
  });
  return a;
}
/** abre o editor de story já com uma imagem pronta (ex.: o cartão da vitória do time) */
export function editorStoryFoto(foto, onChange) { return editorStory(foto, onChange); }
function editorStory(foto, onChange) {
  const w = document.createElement('div');
  w.className = 'stv stv--edit'; w.setAttribute('role', 'dialog'); w.setAttribute('aria-label', 'Novo story');
  (document.getElementById('sheets') || document.body).appendChild(w); document.body.classList.add('has-stv');
  w.innerHTML = `<header class="stv__top"><button class="stv__x" data-x aria-label="Cancelar">${icon('x', 22)}</button><span><b>Novo story</b><small>some em 24 h</small></span></header>
    <div class="stv__img"><img src="${foto}" alt="" draggable="false"><div class="mfig-pos" data-mfig hidden></div></div>
    <button type="button" class="stve__mus" data-mus aria-label="Adicionar música"><svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M9 17.5a3 3 0 1 1-2-2.83V5l12-2v11.5a3 3 0 1 1-2-2.83V6.1L9 7.4z"/></svg><span>Música</span></button>
    <div class="stve"><input class="stve__cap" type="text" maxlength="120" placeholder="Escreva uma legenda…" data-cap>
    <div class="stve__ops"><button type="button" class="stve__op${pref('com', true) ? ' is-on' : ''}" data-op="com" aria-pressed="${pref('com', true)}">${ICO.coment(18)} Comentários</button>${isTeen() ? '' : `<button type="button" class="stve__op${pref('rp', true) ? ' is-on' : ''}" data-op="rp" aria-pressed="${pref('rp', true)}">${icon('repeat', 18)} Amigos podem repostar</button>`}</div>
    <button class="stve__go" data-go>${face(store.member(store.me) || { name: 'Você' }, 26)}<span>Seu story</span>${icon('right', 18)}</button></div>`;
  let musica = null, posM = { x: 0.5, y: 0.62 };
  const fecha = () => { import('./musica.js').then((M) => M.para()).catch(() => {}); w.classList.add('is-out'); setTimeout(() => { w.remove(); document.body.classList.remove('has-stv'); }, 220); };
  w.querySelector('[data-x]').onclick = fecha;
  /* música, como no Instagram: escolhe, a figurinha aparece no story (arraste para mudar de lugar; toque para trocar) */
  const fig = w.querySelector('[data-mfig]');
  const poeFig = async () => {
    const M = await import('./musica.js');
    if (!musica) { fig.hidden = true; fig.innerHTML = ''; w.querySelector('[data-mus] span').textContent = 'Música'; return; }
    fig.hidden = false; fig.innerHTML = `${M.figurinha(musica)}<button type="button" class="mfig__tira" data-tira aria-label="Tirar a música">×</button>`;
    M.posiciona(fig, w.querySelector('.stv__img img'), posM.x, posM.y);
    w.querySelector('[data-mus] span').textContent = 'Trocar';
    fig.querySelector('[data-tira]').onclick = (ev) => { ev.stopPropagation(); M.para(); musica = null; poeFig(); };
    M.toca(musica);
  };
  w.querySelector('[data-mus]').onclick = async () => { const M = await import('./musica.js'); M.para(); const m = await M.escolheMusica(); if (m) { musica = m; } poeFig(); };
  fig.addEventListener('pointerdown', (ev) => {
    if (ev.target.closest('[data-tira]')) return;
    const img = w.querySelector('.stv__img img'); let area = null, M = null; import('./musica.js').then((x) => { M = x; area = x.areaDaFoto(img); }); fig.setPointerCapture(ev.pointerId);
    const move = (e) => { if (!area) return; posM = { x: Math.min(0.85, Math.max(0.15, (e.clientX - area.left) / area.width)), y: Math.min(0.9, Math.max(0.1, (e.clientY - area.top) / area.height)) }; M.posiciona(fig, img, posM.x, posM.y); };
    const fim = () => { fig.removeEventListener('pointermove', move); fig.removeEventListener('pointerup', fim); };
    fig.addEventListener('pointermove', move); fig.addEventListener('pointerup', fim);
  });
  w.querySelectorAll('[data-op]').forEach((o) => (o.onclick = () => { const on = o.classList.toggle('is-on'); o.setAttribute('aria-pressed', on); }));
  const op = (k) => !!w.querySelector(`[data-op="${k}"].is-on`);
  w.querySelector('[data-go]').onclick = async (ev) => {
    const b = ev.currentTarget; b.disabled = true; b.classList.add('is-busy');
    guardaPref('com', op('com')); if (!isTeen()) guardaPref('rp', op('rp'));
    try {
      const r = await call('/friends/story-post', { photo: foto, caption: w.querySelector('[data-cap]').value.trim(), podeCom: op('com'), podeRp: op('rp'), ...(musica ? { musica: { ...musica, x: posM.x, y: posM.y } } : {}) });
      guardaFoto(r.id, foto);
      toast('📸 Story no ar! Seus amigos vão ver por 24 h');
      fecha(); await refreshFeed(); onChange && onChange();
      import('./mascote.js').then((M) => M.react('story')).catch(() => {});
    } catch (e) { toast(e.message || 'Não consegui postar agora.'); b.disabled = false; b.classList.remove('is-busy'); }
  };
  requestAnimationFrame(() => w.classList.add('is-in'));
}

/* ---------- repostar no meu story ---------- */
function repostar(r, st, foto, fim, onChange) {
  const dono = st.rp ? st.rp.name : r.name, n1 = dono.split(' ')[0];
  const w = document.createElement('div'); w.className = 'stv stv--edit stv--rep'; w.setAttribute('role', 'dialog'); w.setAttribute('aria-label', 'Repostar');
  (document.getElementById('sheets') || document.body).appendChild(w);
  w.innerHTML = `<header class="stv__top"><button class="stv__x" data-x aria-label="Cancelar">${icon('x', 22)}</button><span><b>Repostar no seu story</b><small>${esc(n1)} recebe um aviso · some em ${falta((st.fim || st.at + 864e5) - 864e5)}</small></span></header>
    <div class="stv__img"><div class="stv__fundo" style="background-image:url('${foto || ''}')"></div><figure class="stv__cartao"><img src="${foto || ''}" alt="" draggable="false"><figcaption>${icon('repeat', 15)} ${esc(dono)}</figcaption></figure></div>
    <div class="stve"><input class="stve__cap" type="text" maxlength="120" placeholder="Diga algo sobre…" data-cap><button class="stve__go" data-go>${face(store.member(store.me) || { name: 'Você' }, 26)}<span>Seu story</span>${icon('right', 18)}</button></div>`;
  const fecha = () => { w.classList.add('is-out'); setTimeout(() => w.remove(), 220); fim && fim(); };
  w.querySelector('[data-x]').onclick = fecha;
  w.querySelector('[data-go]').onclick = async (ev) => {
    const b = ev.currentTarget; b.disabled = true; b.classList.add('is-busy');
    try { const k = await call('/friends/story-repost', { owner: r.uid, id: st.id, caption: w.querySelector('[data-cap]').value.trim(), podeCom: pref('com', true) }); if (foto) guardaFoto(k.id, foto); som('abreMundo', 'personal'); if (window.__motion) window.__motion.chuva(26); toast('🔁 No seu story!'); fecha(); refreshFeed().then(() => onChange && onChange()); } catch (e) { toast(e.message || 'Não consegui repostar agora.'); b.disabled = false; b.classList.remove('is-busy'); }
  };
  const c = w.querySelector('.stv__cartao'); c.animate([{ transform: 'scale(1.4) rotate(0)', opacity: 0.2 }, { transform: 'scale(.94) rotate(-3deg)', opacity: 1, offset: 0.6 }, { transform: 'scale(1) rotate(-2deg)' }], { duration: 480, easing: 'cubic-bezier(.2,1.1,.3,1)', fill: 'forwards' });
  requestAnimationFrame(() => w.classList.add('is-in'));
}
