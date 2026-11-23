/* Stories do Lembra (estilo WhatsApp/Instagram, mas ligados à agenda):
   - só existe story de um compromisso CONCLUÍDO, com foto tirada NA HORA pela câmera (não dá para escolher da galeria);
   - postar dá XP em dobro; apagar a foto tira só o bônus;
   - a foto some sozinha em 24h (o servidor apaga; nada fica guardado);
   - só os amigos veem; quem viu aparece para o dono do story ("Visto por");
   - visitas ao perfil: cada um vê quem passou pelo perfil nos últimos 7 dias. */
import { store } from './store.js';
import { api } from './avisos.js';
import { openSheet, sheetHead, toast, confirmDialog } from './components.js';
import { icon } from './icons.js';
import { esc } from './utils.js';
import { sininho, setMood, act, say, alive } from './sininho.js';
import { mascotOn } from './mascote.js';

const call = (path, body = {}) => api(path, { ws: '', ...body });
const desde = (at) => { const m = Math.round((Date.now() - at) / 60000); return m < 1 ? 'agora' : m < 60 ? `há ${m} min` : `há ${Math.round(m / 60)} h`; };
const face = (c, size = 56) => c.photo ? `<span class="stface" style="--s:${size}px"><img src="${esc(c.photo)}" alt=""></span>` : `<span class="stface" style="--s:${size}px;background:${esc(c.color || '#FF6B1A')}">${esc((c.name || '?').charAt(0).toUpperCase())}</span>`;

/* ---------- cache do feed (o Lembra usa para puxar assunto) ---------- */
let feed = { rows: [], at: 0 }, visitas = { list: [], at: 0 };
export const feedCache = () => feed;
export const visitasCache = () => visitas;
export async function refreshFeed() {
  if (!store.user || store.mode !== 'cloud') return feed;
  try { const r = await call('/friends/stories'); feed = { rows: r.rows || [], at: Date.now() }; } catch { /* ok */ }
  return feed;
}
export async function refreshVisitors() {
  if (!store.user || store.mode !== 'cloud') return visitas;
  try { const r = await call('/friends/visitors'); visitas = { list: r.visitors || [], at: Date.now() }; } catch { /* ok */ }
  return visitas;
}

/* ---------- câmera: só foto tirada agora ---------- */
function tiraFoto() {
  return new Promise((res, rej) => {
    const inp = document.createElement('input');
    inp.type = 'file'; inp.accept = 'image/*'; inp.setAttribute('capture', 'environment'); // abre a câmera direto (sem galeria)
    inp.style.display = 'none'; document.body.appendChild(inp);
    const t0 = Date.now();
    inp.onchange = () => {
      const f = inp.files && inp.files[0]; inp.remove();
      if (!f) return rej(new Error('cancelou'));
      // foto antiga (da galeria) não vale: a câmera gera um arquivo com data de agora
      if (f.lastModified && f.lastModified < t0 - 10 * 60e3) return rej(new Error('A foto precisa ser tirada agora, pela câmera 📸'));
      const img = new Image(), url = URL.createObjectURL(f);
      img.onload = () => {
        const max = 1080, k = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement('canvas'); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url);
        let q = 0.78, out = c.toDataURL('image/jpeg', q);
        while (out.length > 400000 && q > 0.35) { q -= 0.1; out = c.toDataURL('image/jpeg', q); }
        res(out);
      };
      img.onerror = () => rej(new Error('Não consegui ler a foto.'));
      img.src = url;
    };
    inp.click();
  });
}

/* postar o story de um compromisso concluído (kind: 'w' trabalho | 'p' pessoal) */
export async function postStory({ title = '', ref = '', kind = 'w' } = {}) {
  let photo;
  try { photo = await tiraFoto(); } catch (e) { if (e.message !== 'cancelou') toast(e.message); return null; }
  toast('Postando seu story…');
  try {
    const r = await call('/friends/story-post', { photo, camera: true, title, ref });
    const G = await import('./game.js');
    const got = G.storyXp(r.id, kind);
    toast(got ? `📸 Story no ar! +${got} XP (em dobro)` : '📸 Story no ar! Seus amigos vão ver por 24 h');
    refreshFeed();
    import('./mascote.js').then((M) => M.react('story')).catch(() => {});
    return r.id;
  } catch (e) { toast(e.message || 'Não consegui postar agora.'); return null; }
}

/* ---------- faixa de stories (bolinhas com anel colorido) ---------- */
export function storyStrip(rows = feed.rows, { comMeu = true } = {}) {
  const meus = rows.find((r) => r.me);
  const itens = rows.filter((r) => !r.me);
  return `<div class="ststrip" role="list">
    ${comMeu ? `<button class="ststrip__it" data-st-me role="listitem">${face(store.member(store.me) || { name: 'Você' }, 60)}${meus ? '' : `<i class="ststrip__plus">${icon('plus', 14)}</i>`}<small>${meus ? 'Seu story' : 'Seu story'}</small><i class="ststrip__ring${meus ? '' : ' is-off'}"></i></button>` : ''}
    ${itens.map((r) => { const novo = r.stories.some((x) => !x.seen); return `<button class="ststrip__it" data-st-owner="${esc(r.uid)}" role="listitem">${face(r, 60)}<i class="ststrip__ring${novo ? '' : ' is-seen'}"></i><small>${esc(r.name.split(' ')[0])}</small></button>`; }).join('')}
  </div>`;
}
export function bindStrip(el, onChange) {
  el.querySelectorAll('[data-st-owner]').forEach((b) => (b.onclick = () => openViewer(b.dataset.stOwner, onChange)));
  const me = el.querySelector('[data-st-me]');
  if (me) me.onclick = () => { const meus = feed.rows.find((r) => r.me); if (meus) openViewer(meus.uid, onChange); else comoPostar(); };
}
function comoPostar() {
  openSheet({ className: 'sheet--dialog', html: `${sheetHead('Seu story', { left: '<button class="btn-text" data-close>Fechar</button>' })}<div class="page page--sheet">
    <p>O story do Lembra é a prova de que você <b>fez</b>: abra um compromisso, marque como <b>feito</b> e toque em <b>📸 Postar story</b>. A foto é tirada na hora, vale <b>XP em dobro</b> e some sozinha em 24 h.</p></div>` });
}

/* ---------- visualizador em tela cheia ---------- */
export async function openViewer(ownerUid, onChange) {
  if (!feed.rows.length || Date.now() - feed.at > 60e3) await refreshFeed();
  const ordem = feed.rows.filter((r) => r.stories.length);
  let oi = Math.max(0, ordem.findIndex((r) => r.uid === ownerUid)), si = 0, timer = 0, t0 = 0, pausado = false;
  if (!ordem.length) return toast('Nenhum story agora.');
  const first = ordem[oi].stories.findIndex((x) => !x.seen); si = first < 0 ? 0 : first;
  const w = document.createElement('div');
  w.className = 'stv'; w.setAttribute('role', 'dialog'); w.setAttribute('aria-label', 'Stories');
  (document.getElementById('sheets') || document.body).appendChild(w); document.body.classList.add('has-stv'); // na mesma pilha das janelas: o que abrir depois (Visto por, Apagar) fica na frente
  const DUR = 6000;
  const fecha = () => { clearInterval(timer); w.classList.add('is-out'); setTimeout(() => { w.remove(); document.body.classList.remove('has-stv'); }, 220); onChange && onChange(); };
  const proximo = () => { const r = ordem[oi]; if (si < r.stories.length - 1) si++; else if (oi < ordem.length - 1) { oi++; si = 0; } else return fecha(); mostra(); };
  const anterior = () => { if (si > 0) si--; else if (oi > 0) { oi--; si = ordem[oi].stories.length - 1; } mostra(); };
  async function mostra() {
    clearInterval(timer);
    const r = ordem[oi], st = r.stories[si];
    w.innerHTML = `<div class="stv__bars">${r.stories.map((x, i) => `<i><b style="width:${i < si ? 100 : 0}%"></b></i>`).join('')}</div>
      <header class="stv__top">${face(r, 36)}<span><b>${r.me ? 'Você' : esc(r.name)}</b><small>${desde(st.at)}${st.title ? ` · ${esc(st.title)}` : ''}</small></span><button class="stv__x" data-x aria-label="Fechar">${icon('x', 22)}</button></header>
      <div class="stv__img"><div class="stv__load"><i></i><i></i><i></i></div></div>
      ${st.caption ? `<p class="stv__cap">${esc(st.caption)}</p>` : ''}
      ${r.me ? `<footer class="stv__me"><button data-viewers>${icon('eye', 18)} Visto por ${st.views || 0}</button><button data-del>${icon('trash', 18)} Apagar</button></footer>` : `<footer class="stv__done">${icon('check', 16)} ${esc(r.name.split(' ')[0])} concluiu ${st.title ? `“${esc(st.title)}”` : 'um compromisso'}</footer>`}
      <button class="stv__nav stv__nav--l" data-prev aria-label="Anterior"></button><button class="stv__nav stv__nav--r" data-next aria-label="Próximo"></button>`;
    w.querySelector('[data-x]').onclick = fecha;
    w.querySelector('[data-prev]').onclick = anterior;
    w.querySelector('[data-next]').onclick = proximo;
    const v = w.querySelector('[data-viewers]'); if (v) v.onclick = () => { pausado = true; openViewers(st.id, () => { pausado = false; }); };
    const d = w.querySelector('[data-del]');
    if (d) d.onclick = async () => {
      pausado = true;
      if (!(await confirmDialog({ title: 'Apagar este story?', text: 'A foto some na hora. O XP em dobro que ele deu sai também (você fica só com o XP normal do compromisso).', ok: 'Apagar', danger: true }))) { pausado = false; return; }
      try { await call('/friends/story-delete', { id: st.id }); const G = await import('./game.js'); const v2 = G.storyXpOff(st.id); toast(v2 ? `Story apagado · −${v2} XP do bônus` : 'Story apagado'); r.stories.splice(si, 1); } catch (e) { toast(e.message || 'Não consegui apagar.'); }
      if (!r.stories.length) return fecha();
      si = Math.min(si, r.stories.length - 1); pausado = false; mostra();
    };
    try {
      const res = await call('/friends/story-view', { owner: r.uid, id: st.id });
      if (!w.isConnected) return;
      w.querySelector('.stv__img').innerHTML = `<img src="${res.photo}" alt="Story de ${esc(r.name)}">`;
      st.seen = true;
    } catch (e) { w.querySelector('.stv__img').innerHTML = `<p class="stv__gone">${esc(e.message || 'Esse story já sumiu.')}</p>`; }
    t0 = Date.now(); let gasto = 0, ult = Date.now();
    const bar = w.querySelectorAll('.stv__bars b')[si];
    timer = setInterval(() => { const agora = Date.now(); if (!pausado && !document.hidden) gasto += agora - ult; ult = agora; if (bar) bar.style.width = `${Math.min(100, (gasto / DUR) * 100)}%`; if (gasto >= DUR) proximo(); }, 50);
  }
  // segurar o dedo pausa (como no Instagram)
  w.addEventListener('pointerdown', () => { pausado = true; });
  w.addEventListener('pointerup', () => { pausado = false; });
  w.addEventListener('pointercancel', () => { pausado = false; });
  requestAnimationFrame(() => w.classList.add('is-in'));
  mostra();
}

/* quem viu o seu story */
function openViewers(id, onClose) {
  let lista = null;
  const html = () => `${sheetHead('Visto por', { left: '<button class="btn-text" data-close>Fechar</button>' })}<div class="page page--sheet">
    ${!lista ? '<p class="fhelp">Carregando…</p>' : lista.length ? `<div class="agroup">${lista.map((c) => `<div class="frow">${face(c, 44)}<span class="frow__id"><b>${esc(c.name)}</b><small>viu ${desde(c.at)}</small></span></div>`).join('')}</div>` : '<p class="fhelp">Ninguém viu ainda. Daqui a pouco aparece gente 👀</p>'}</div>`;
  const a = openSheet({ className: 'sheet--stview', html: html(), onClose });
  call('/friends/story-viewers', { id }).then((r) => { lista = r.viewers || []; if (!a.closed) a.set(html()); }).catch(() => { lista = []; if (!a.closed) a.set(html()); });
}

/* ---------- tela "Stories" (feed) ---------- */
export async function openStoriesFeed() {
  const html = () => `${sheetHead('Stories', { left: '<button class="btn-text" data-close>Fechar</button>' })}<div class="page page--sheet">
    ${storyStrip()}
    ${feed.rows.filter((r) => !r.me).length ? `<h3 class="ah">Atualizações recentes</h3><div class="agroup">${feed.rows.filter((r) => !r.me).map((r) => { const novo = r.stories.some((x) => !x.seen); const ult = Math.max(...r.stories.map((x) => x.at)); return `<button class="frow" data-st-owner="${esc(r.uid)}"><span class="frow__ring${novo ? '' : ' is-seen'}">${face(r, 46)}</span><span class="frow__id"><b>${esc(r.name)}</b><small>${desde(ult)} · ${r.stories.length} ${r.stories.length === 1 ? 'story' : 'stories'}</small></span>${novo ? '<i class="frow__new">novo</i>' : ''}</button>`; }).join('')}</div>` : '<p class="fhelp">Nenhum amigo postou nas últimas 24 h. Que tal ser o primeiro? Conclua um compromisso e poste a foto 📸</p>'}
  </div>`;
  const a = openSheet({ className: 'sheet--tall', html: html(), onMount: (x) => bindStrip(x.el, () => { if (!a.closed) a.set(html()); }) });
  await refreshFeed(); if (!a.closed) a.set(html());
  return a;
}

/* ---------- quem visitou o seu perfil ---------- */
export async function openVisitors() {
  let lista = null;
  const html = () => `${sheetHead('Quem visitou seu perfil', { left: '<button class="btn-text" data-close>Fechar</button>' })}<div class="page page--sheet">
    ${mascotOn() ? `<div class="atr__hero vis__hero"><div class="atr__fig">${sininho('desconfiado', { size: 84 })}</div><p class="atr__bub"><span data-vbub>Deixa eu ver quem andou xeretando… 🕵️</span></p></div>` : ''}
    <p class="fhelp">Amigos que passaram pelo seu perfil nos últimos 7 dias. Quando você visita o perfil de alguém, essa pessoa também vê 👀</p>
    ${!lista ? '<p class="fhelp">Carregando…</p>' : lista.length ? `<div class="agroup">${lista.map((c) => `<button class="frow" data-uid="${esc(c.uid)}">${face(c, 46)}<span class="frow__id"><b>${esc(c.name)}</b><small>passou ${desde(c.at).replace('há', 'há')}${c.n > 1 ? ` · ${c.n} vezes` : ''}</small></span>${icon('right', 16)}</button>`).join('')}</div>` : '<p class="fhelp">Ninguém passou por aqui ainda. Poste um story que o povo aparece 😉</p>'}</div>`;
  const a = openSheet({ className: 'sheet--tall', html: html(), onMount: (x) => {
    x.el.querySelectorAll('[data-uid]').forEach((b) => (b.onclick = async () => { const c = lista.find((v) => v.uid === b.dataset.uid); if (c) (await import('./friends.js')).openFriendProfile(c); }));
  } });
  await refreshVisitors(); lista = visitas.list; if (!a.closed) a.set(html());
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
  }
  return a;
}
