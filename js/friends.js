/* Amizades: convite por link → a pessoa recebe o PEDIDO na conta dela e aceita (ou recusa).
   Amigos veem o perfil uns dos outros: foto, nível, XP e emblemas. Quem é Vitalício aparece com a
   moldura lendária. Dá para remover a amizade a qualquer momento. */
import { store } from './store.js';
import { api, server } from './avisos.js';
import { openSheet, sheetHead, toast, confirmDialog } from './components.js';
import { icon } from './icons.js';
import { esc } from './utils.js';
import { CONFIG } from '../config.js';
import { sininho, alive, vivo } from './sininho.js';

const LS = 'lembra.amigo';
const call = (path, body = {}) => api(path, { ws: '', ...body }); // sempre a própria conta (nunca a agenda de outra pessoa)
const pad = (n) => String(n || 0).padStart(3, '0');
/* celular → SHA-256 (só os 11 últimos dígitos): o servidor nunca vê o número */
export async function hashTel(t) {
  const d = String(t || '').replace(/\D/g, '').slice(-11);
  if (d.length < 10 || !crypto?.subtle) return '';
  const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('lembra:' + d));
  return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, '0')).join('');
}
const site = () => (CONFIG.siteUrl || location.href.replace(/#.*$/, '')).replace(/\/?$/, '/');

/* link aberto antes de entrar: guarda para depois do login */
export function captureFriendLink(hash = location.hash) {
  const m = /^#\/amigo\/([A-Za-z0-9]{10,40})$/.exec(hash || '');
  if (!m) return false;
  try { localStorage.setItem(LS, JSON.stringify({ token: m[1], at: Date.now() })); } catch { /* ok */ }
  history.replaceState(null, '', location.pathname + location.search);
  return true;
}
const pending = () => { try { const p = JSON.parse(localStorage.getItem(LS) || 'null'); return p && Date.now() - p.at < 14 * 864e5 ? p : null; } catch { return null; } };

/* ---------- cartão público (o que os amigos veem) ---------- */
let lastCard = '';
export async function publishCard() {
  if (store.mode !== 'cloud' || !server() || !store.solo || store.shared || !store.user) return;
  try {
    const G = await import('./game.js');
    const st = G.state(), L = G.levelInfo();
    const me = store.member(store.me) || {};
    const card = { name: me.name || '', photo: me.photo && me.photo.length < 90000 ? me.photo : null, color: me.color || '#7C5CFF', level: L.level, xp: L.xp, tier: L.tier.name(), badges: Object.keys(st.badges || {}), teen: (await import('./teen.js')).isTeen(), hide: (await import('./teen.js')).rankHidden(),
      bio: store.profile?.bio || '', job: store.profile?.profession ? (await import('../functions/catalog.js')).professionFor(store.profile.profession, store.profile.pronoun) : '', role: store.profile?.role || '', place: store.profile?.workplace || '',
      phoneHash: await hashTel(store.profile?.phone),
      since: store.user.metadata?.creationTime ? Date.parse(store.user.metadata.creationTime) : null };
    const sig = JSON.stringify(card);
    if (sig === lastCard) return;
    lastCard = sig;
    await call('/friends/card', card);
  } catch (e) { console.warn('cartão de amigo', e.message); }
}

/* ---------- foto com moldura (lendária para quem é Vitalício) ---------- */
export function framedPhoto(c, size = 64) {
  const inner = c.photo ? `<img src="${c.photo}" alt="">` : `<span>${esc((c.name || '?').charAt(0).toUpperCase())}</span>`;
  return `<span class="fpic${c.vip ? ' fpic--vip' : ''}" style="--s:${size}px;--c:${esc(c.color || '#7C5CFF')}"><span class="fpic__in">${inner}</span>${c.vip ? `<i class="fpic__crown">${icon('crown', Math.max(10, Math.round(size / 6)))}</i>` : `<i class="fpic__lv">${c.level || 0}</i>`}</span>`;
}

/* ---------- pedido de amizade (aparece na conta de quem abriu o link) ---------- */
function requestSheet(c, onDone) {
  return openSheet({
    className: 'sheet--dialog',
    html: `<div class="dialog freq">
      ${framedPhoto(c, 96)}
      <h3>${esc(c.name)} quer ser seu amigo no Lembra</h3>
      <p>Amigos veem o nível, os emblemas e acompanham quem cumpre mais o que marca.</p>
      ${c.vip ? `<div class="freq__vip">${icon('crown', 14)} Membro Vitalício Nº ${pad(c.vip.no)}</div>` : `<div class="freq__lv">Nível ${c.level || 0}${c.tier ? ' · ' + esc(c.tier) : ''} · ${(c.badges || []).length} emblemas</div>`}
      <button class="btn btn--primary btn--block" data-yes>Aceitar</button>
      <button class="btn btn--ghost btn--block" data-no>Recusar</button>
    </div>`,
    onMount: (a) => {
      const go = async (ok) => {
        try { await call('/friends/answer', { from: c.uid, ok }); a.close(); toast(ok ? `Agora você e ${c.name.split(' ')[0]} são amigos 🤝` : 'Pedido recusado'); onDone && onDone(); }
        catch (e) { toast(e.message || 'Não consegui agora.'); }
      };
      a.el.querySelector('[data-yes]').onclick = () => go(true);
      a.el.querySelector('[data-no]').onclick = () => go(false);
    },
  });
}
/* depois de entrar: se veio por um link de amizade, mostra o pedido */
export async function processFriendLink() {
  const p = pending();
  if (!p || store.mode !== 'cloud' || !server()) return;
  try { localStorage.removeItem(LS); } catch { /* ok */ }
  try {
    const r = await call('/friends/open', { token: p.token });
    if (r.self) return toast('Esse é o seu próprio convite: mande para um amigo 😉', { ms: 4000 });
    if (r.already) return toast(`Você e ${r.from.name.split(' ')[0]} já são amigos`);
    requestSheet(r.from);
  } catch (e) { toast(e.message || 'Não consegui abrir o convite de amizade.', { ms: 5000 }); }
}

/* ---------- perfil de um amigo ---------- */
export const openFriendProfile = (c, onRemoved) => friendProfile(c, onRemoved);
async function friendProfile(c, onRemoved) { return openPublicProfile(c.uid, c, onRemoved); }

/* ---------- lista de amigos + pedidos + convidar ---------- */
const foto = (c) => `<span class="fxava__in">${c.photo ? `<img src="${esc(c.photo)}" alt="">` : `<span style="background:${esc(c.color || '#7C5CFF')}">${esc((c.name || '?').charAt(0).toUpperCase())}</span>`}</span>`;
export function openFriends() {
  let data = null, err = '', busca = '';
  const S = import('./stories.js');
  let St = null, snhOn = false;
  import('./mascote.js').then((m) => { snhOn = m.mascotOn(); }).catch(() => {});
  const anelDe = (c) => { const st = St && St.feedCache().rows.find((r) => r.uid === c.uid && r.stories.length); return !st ? '' : st.stories.some((x) => !x.seen) ? ' is-story' : ' is-seen'; };
  const card = (c) => `<button class="fxrow" data-fr="${esc(c.uid)}">
      <span class="fxava${anelDe(c)}">${foto(c)}${isOnline(c.online) ? '<i class="fxava__on"></i>' : ''}</span>
      <span class="fxrow__id"><b>${esc(c.name.split(' ').slice(0, 2).join(' '))}${c.vip ? `<i class="fxcrown">${icon('crown', 12)}</i>` : ''}</b>
        <small>${isOnline(c.online) ? `<em class="is-on">online agora</em>${c.job ? ` · ${esc(c.job)}` : ''}` : c.online ? `Visto por último ${esc(onlineTxt(c.online).replace('visto ', ''))}${c.job ? ` · ${esc(c.job)}` : ''}` : esc(c.job || `Nível ${c.level || 0}`)}</small></span>
      <span class="fxrow__go">${icon('right', 18)}</span></button>`;
  const html = () => {
    const vis = St ? St.visitasCache().list : [];
    const todos = !data ? [] : data.friends.slice().sort((x, y) => (y.online || 0) - (x.online || 0) || x.name.localeCompare(y.name, 'pt-BR'));
    const on = todos.filter((c) => isOnline(c.online));
    return `<div class="fx">
      <header class="fx__head">
        <button class="fx__pill" data-close>Fechar</button>
        <h2 class="fx__title">Amigos</h2>
        <span class="fx__right">${snhOn ? `<span class="fx__snh">${sininho('acena', { size: 120 })}</span>` : ''}<button class="fx__inv" data-invite>${icon('plus', 18)} Convidar</button></span>
      </header>
      ${St ? St.storyStrip() : ''}
      <div class="fx__busca"><label class="fsearch">${icon('search', 18)}<input type="search" placeholder="Buscar amigo" value="${esc(busca)}" data-busca autocomplete="off"></label>
        <button class="fx__round" ${contatosDisponivel() ? 'data-contatos' : 'data-invite'} aria-label="${contatosDisponivel() ? 'Encontrar amigos nos contatos' : 'Convidar amigos'}">${icon('users', 22)}</button></div>
      ${vis.length ? `<button class="fvisit" data-visitas><span class="fvisit__faces">${vis.slice(0, 3).map((c) => framedPhoto(c, 30)).join('')}</span><span><b>${vis.length} ${vis.length === 1 ? 'pessoa visitou' : 'pessoas visitaram'} seu perfil</b><small>Toque pra ver quem foi 👀</small></span>${icon('right', 16)}</button>` : ''}
      ${err ? `<p class="fhelp">${esc(err)}</p>` : !data ? '<div class="fx__load"><i></i><i></i><i></i></div>' : `
      ${data.requests.length ? `<h3 class="fx__h">${icon('bell', 18)} Pedidos de amizade · ${data.requests.length}</h3>${data.requests.map((c) => `<button class="fxrow" data-req="${esc(c.uid)}"><span class="fxava">${foto(c)}</span><span class="fxrow__id"><b>${esc(c.name)}</b><small>quer ser seu amigo</small></span><span class="fx__ver">Ver</span></button>`).join('')}` : ''}
      ${on.length ? `<h3 class="fx__h"><i class="ah__on"></i> Online agora · ${on.length}</h3>${on.map(card).join('')}` : ''}
      <h3 class="fx__h">${icon('users', 18)} Seus amigos${data.friends.length ? ` · ${data.friends.length}` : ''}</h3>
      ${todos.length ? (todos.length > on.length ? todos.filter((c) => !isOnline(c.online)).map(card).join('') : '<p class="fhelp">Todo mundo tá online agora 🎉</p>') : '<p class="fhelp">Nenhum amigo ainda. Convide alguém e vejam quem cumpre mais o que marca.</p>'}`}
      <div class="fxpromo">${snhOn ? `<span class="fxpromo__snh">${sininho('feliz', { size: 96 })}</span>` : ''}<p>Amigos deixam a jornada <b>mais divertida!</b></p><button class="fxpromo__btn" data-invite>${icon('users', 16)} Convidar</button></div>
      <p class="fhelp fx__nota">Amigos veem seu nível, emblemas e stories. Sua agenda continua só sua.</p>
    </div>`;
  };
  const bind = (x) => {
    alive();
    const topo = x.el.querySelector('.fx__snh [data-snh]'); if (topo) vivo(topo, { aponta: x.el.querySelector('.fx__inv'), gestos: ['pisca', 'olhaLados', 'sobrancelha', 'riso'] });
    const promo = x.el.querySelector('.fxpromo__snh [data-snh]'); if (promo) vivo(promo, { aponta: x.el.querySelector('.fxpromo__btn'), gestos: ['pisca', 'timido', 'riso'], cada: [3, 5] });
    x.el.querySelectorAll('[data-invite]').forEach((b) => (b.onclick = () => openShareChoice()));
    const bu = x.el.querySelector('[data-busca]'); if (bu) bu.oninput = () => { busca = bu.value; const q = busca.trim().toLowerCase(); x.el.querySelectorAll('.fxrow[data-fr]').forEach((r) => { r.hidden = !!q && !r.textContent.toLowerCase().includes(q); }); };
    const vi = x.el.querySelector('[data-visitas]'); if (vi) vi.onclick = () => St.openVisitors();
    if (St) St.bindStrip(x.el, () => { if (!x.closed) x.set(html()); });
    x.el.querySelectorAll('[data-req]').forEach((b) => (b.onclick = () => openPublicProfile(b.dataset.req).then((pp) => { const t = setInterval(() => { if (pp.closed) { clearInterval(t); load(x); } }, 500); })));
    const ct = x.el.querySelector('[data-contatos]');
    if (ct) ct.onclick = async () => {
      const rows = await buscarPelosContatos(); if (!rows) return;
      if (!rows.length) return toast('Nenhum dos contatos escolhidos usa o Lembra ainda. Convide! 😉');
      openSheet({ className: 'sheet--tall sheet--fx', html: `<div class="fx"><header class="fx__head"><button class="fx__pill" data-close>Fechar</button><h2 class="fx__title">Dos seus contatos</h2><span></span></header><p class="fhelp">${rows.length} ${rows.length === 1 ? 'pessoa' : 'pessoas'} da sua agenda já usa${rows.length === 1 ? '' : 'm'} o Lembra:</p>${rows.map((c) => `<button class="fxrow" data-pp="${esc(c.uid)}"><span class="fxava">${foto(c)}</span><span class="fxrow__id"><b>${esc(c.name)}</b><small>${c.rel === 'enviado' ? 'pedido enviado' : c.rel === 'recebido' ? 'quer ser seu amigo' : esc(c.job || `Nível ${c.level || 0}`)}</small></span><span class="fxrow__go">${icon('right', 18)}</span></button>`).join('')}</div>`,
        onMount: (y) => y.el.querySelectorAll('[data-pp]').forEach((b) => (b.onclick = () => openPublicProfile(b.dataset.pp))) });
    };
    x.el.querySelectorAll('[data-fr]').forEach((b) => (b.onclick = () => { const c = data.friends.find((r) => r.uid === b.dataset.fr); if (c) friendProfile(c, () => load(x)); }));
  };
  const load = async (a) => { try { data = await call('/friends/list'); err = ''; } catch (e) { err = e.message || 'Não consegui carregar agora.'; } if (!a.closed) a.set(html()); };
  const a = openSheet({ className: 'sheet--tall sheet--fx', html: html(), onMount: bind });
  publishCard();
  load(a);
  S.then(async (m) => { St = m; await Promise.all([m.refreshFeed(), m.refreshVisitors()]); if (!a.closed) a.set(html()); });
  return a;
}

/* Compartilhar: a pessoa escolhe se convida para a lista de amigos dela ou só indica o app.
   O link de amizade vale 14 dias e pode ir para quantas pessoas quiser (cada uma manda o pedido e você aceita). */
export function openShareChoice() {
  const me = store.member(store.me) || {};
  const send = async (title, text, url) => {
    if (navigator.share) { try { await navigator.share({ title, text, url }); } catch { /* cancelou */ } }
    else { await navigator.clipboard?.writeText(`${text} ${url}`).catch(() => {}); toast('Link copiado! Cole no WhatsApp 📋'); }
  };
  const a = openSheet({
    className: 'sheet--actions',
    html: `${sheetHead('Compartilhar', { left: '<button class="btn-text" data-close>Fechar</button>' })}
    <div class="page page--sheet shch">
      <button class="shch__op" data-amigo><span class="shch__ic shch__ic--a">${icon('users', 22)}</span><span><b>Convidar pra ser meu amigo</b><small>Quem abrir o link entra na sua lista de amigos. Pode mandar o mesmo link pra várias pessoas (vale 14 dias).</small></span></button>
      <button class="shch__op" data-app><span class="shch__ic shch__ic--b">${icon('share', 22)}</span><span><b>Só indicar o Lembra</b><small>Manda o link do app, sem convite de amizade.</small></span></button>
    </div>`,
    onMount: (x) => {
      x.el.querySelector('[data-amigo]').onclick = async (ev) => {
        ev.currentTarget.disabled = true;
        try { const { token } = await call('/friends/link'); a.close(); await send('Convite de amizade · Lembra', `${me.name || 'Eu'} quer ser seu amigo no Lembra 🤝 Toque para aceitar:`, `${site()}#/amigo/${token}`); }
        catch (e) { toast(e.message || 'Não consegui criar o convite.'); ev.currentTarget.disabled = false; }
      };
      x.el.querySelector('[data-app]').onclick = async () => { a.close(); await send('Lembra', 'Conhece o Lembra? A agenda que lembra de tudo por você 🔔', `${site()}conheca/`); };
    },
  });
  return a;
}

/* ---------- perfil público (aberto pelo ranking, pelos contatos ou pela lista) ----------
   Como visitar um perfil no Instagram, com o "o que faz" do LinkedIn: foto (com anel se postou story),
   nome, profissão · cargo, local, bio, nível, XP, brasão e conquistas. Dá para pedir amizade dali. */
export const onlineTxt = (t) => { if (!t) return ''; const m = Math.round((Date.now() - t) / 60000); return m < 5 ? 'online agora' : m < 60 ? `visto há ${m} min` : m < 1440 ? `visto há ${Math.round(m / 60)} h` : `visto há ${Math.round(m / 1440)} d`; };
export const isOnline = (t) => t && Date.now() - t < 5 * 60e3;
export async function openPublicProfile(uid, prev = {}, onRemoved) {
  const { badgeById, badgeArt, RARITY, crest } = await import('./badges.js');
  const G = await import('./game.js');
  const snhOn = (await import('./mascote.js')).mascotOn();
  let d = null, err = '', busy = false, todos = false, veio = null;
  const html = () => {
    const c = d?.card || prev;
    const rel = d?.rel || '';
    const order = { lendario: 0, epico: 1, raro: 2, comum: 3 };
    const bs = (c.badges || []).map(badgeById).filter(Boolean).sort((a, b) => order[a.rarity] - order[b.rarity]);
    const L = G.levelInfo(c.xp || 0);
    const ring = d?.story === 'novo' ? 'is-story' : d?.story === 'visto' ? 'is-seen' : '';
    const me = store.member(store.me) || {};
    const btn = !d ? '' : rel === 'eu' ? '' : rel === 'amigo' ? `<span class="pp2__amigos">${icon('check', 14)} Vocês são amigos</span>`
      : rel === 'enviado' ? `<span class="pp__tag">${icon('clock', 14)} Pedido enviado</span>`
      : rel === 'recebido' ? `<button class="fxbtn" data-aceitar ${busy ? 'disabled' : ''}>${icon('check', 18)} Aceitar pedido de amizade</button>`
      : `<button class="fxbtn" data-pedir ${busy ? 'disabled' : ''}>${icon('plus', 18)} Adicionar amigo</button>`;
    const mostra = todos ? bs : bs.slice(0, 3);
    return `<div class="fx pp2">
      <header class="fx__head">
        <button class="fx__pill" data-close>Fechar</button>
        <h2 class="fx__title">${esc((c.name || '').split(' ')[0])}</h2>
        ${rel && rel !== 'eu' ? `<button class="fx__dots" data-menu aria-label="Mais opções">${icon('dots', 20)}</button>` : '<span></span>'}
      </header>
      ${rel === 'amigo' ? `<div class="pp2__visit">${me.photo ? `<img src="${esc(me.photo)}" alt="">` : `<i style="background:${esc(me.color || '#FF6B1A')}">${esc((me.name || 'V').charAt(0))}</i>`}<span><b>Você passou por aqui</b><small>${veio ? `${esc(c.name.split(' ')[0])} também passou no seu perfil 👀` : 'A visita fica marcada no perfil 😉'}</small></span></div>` : ''}
      <div class="pp2__hero">
        <button class="pp2__foto ${ring}" ${d?.story && d.story !== 'amigos' ? 'data-story' : ''} aria-label="Foto${ring ? ' · ver story' : ''}">
          <span class="pp2__img">${c.photo ? `<img src="${esc(c.photo)}" alt="">` : `<span style="background:${esc(c.color || '#FF6B1A')}">${esc((c.name || '?').charAt(0))}</span>`}</span>
          ${c.vip ? `<i class="pp2__crown">${icon('crown', 18)}</i>` : ''}${isOnline(d?.online) ? '<i class="pp__on"></i>' : ''}</button>
        ${snhOn ? `<span class="pp2__snh">${sininho(rel === 'amigo' ? 'amor' : 'acena', { size: 150 })}<i class="pp2__coracao">♥</i><i class="pp2__coracao pp2__coracao--2">♥</i></span>` : ''}
      </div>
      <h1 class="pp2__nome">${esc(c.name || '')}${c.vip ? `<i class="pp2__ok">${icon('check', 14)}</i>` : ''}</h1>
      ${c.vip ? `<div class="pp2__vip">${icon('crown', 16)} Membro Nº ${pad(c.vip.no)}</div><p class="pp2__vipt">Um dos raríssimos membros para sempre 🧡</p>` : ''}
      ${c.job || c.role ? `<p class="pp__job">${icon('briefcase', 14)} ${esc([c.job, c.role].filter(Boolean).join(' · '))}</p>` : ''}
      ${c.place ? `<p class="pp__place">${icon('building', 14)} ${esc(c.place)}</p>` : ''}
      ${c.bio ? `<p class="pp__bio">${esc(c.bio)}</p>` : ''}
      ${d?.online && rel === 'amigo' ? `<p class="pp__visto${isOnline(d.online) ? ' is-on' : ''}">${esc(onlineTxt(d.online))}</p>` : ''}
      ${d?.story === 'amigos' ? `<p class="fhelp">${icon('lock', 12)} Postou story hoje — só amigos veem.</p>` : ''}
      ${btn}
      ${err ? `<p class="fhelp">${esc(err)}</p>` : ''}
      ${d?.privado ? `<div class="pp__priv">${icon('lock', 28)}<b>Perfil privado</b><small>Adicione como amigo para ver as conquistas, o brasão e os stories.</small></div>` : !d ? '<div class="fx__load"><i></i><i></i><i></i></div>' : `
      <div class="pp2__lv">${crest(L.level, 64)}<span class="pp2__lvt"><b>Nível ${L.level}</b><small>${esc(c.tier || L.tier.name())}</small></span>
        <span class="pp2__lvb"><small>${(c.xp || 0).toLocaleString('pt-BR')} / ${L.next.toLocaleString('pt-BR')} XP</small><span class="pp2__bar"><i style="width:${Math.round(L.pct * 100)}%"></i></span></span></div>
      <div class="pp2__tiles">
        <div><i style="color:#FFC21A">${icon('bolt', 24)}</i><b>${(c.xp || 0).toLocaleString('pt-BR')}</b><small>XP</small></div>
        <div><i style="color:#FF9A1A">${icon('trophy', 24)}</i><b>${bs.length}</b><small>Emblemas</small></div>
        <div><i style="color:#FF6B1A">${icon('crown', 24)}</i><b>${bs.filter((x) => x.rarity === 'lendario').length}</b><small>Lendários</small></div>
      </div>
      <div class="pp2__embh"><h3>Emblemas</h3>${bs.length > 3 ? `<button class="pp2__todos" data-todos>${todos ? 'Ver menos' : 'Ver todos'} ${icon('right', 16)}</button>` : ''}</div>
      ${bs.length ? `<div class="pp2__emb${todos ? ' is-todos' : ''}">${mostra.map((b) => `<div class="pp2__e">${badgeArt(b, 84)}<b>${esc(b.name())}</b><small>${RARITY[b.rarity].label}</small></div>`).join('')}${!todos && bs.length > 3 ? `<button class="pp2__mais" data-todos>${icon('plus', 26)}<small>mais ${bs.length - 3}</small></button>` : ''}</div>` : '<p class="fhelp">Ainda sem emblemas.</p>'}`}
      <div class="fxpromo fxpromo--big">${snhOn ? `<span class="fxpromo__snh">${sininho('comemora', { size: 96 })}</span>` : ''}<p><b>Convide seus amigos!</b><small>Compartilhe a diversão e conquistem juntos.</small></p><button class="fxpromo__btn" data-invite>${icon('users', 16)} Convidar</button></div>
    </div>`;
  };
  const a = openSheet({ className: 'sheet--tall sheet--fx', html: html(), onMount: (x) => {
    alive();
    const sn = x.el.querySelector('.pp2__snh [data-snh]'); if (sn) vivo(sn, { aponta: x.el.querySelector('.pp2__foto'), gestos: ['pisca', 'timido', 'olhaLados', 'riso', 'sobrancelha'] });
    const pr = x.el.querySelector('.fxpromo__snh [data-snh]'); if (pr) vivo(pr, { aponta: x.el.querySelector('.fxpromo__btn'), gestos: ['pisca', 'riso'], cada: [3, 5] });
    x.el.querySelectorAll('[data-invite]').forEach((b) => (b.onclick = () => openShareChoice()));
    x.el.querySelectorAll('[data-todos]').forEach((b) => (b.onclick = () => { todos = !todos; x.set(html()); }));
    const st = x.el.querySelector('[data-story]'); if (st) st.onclick = () => import('./stories.js').then((m) => m.openViewer(uid));
    const mn = x.el.querySelector('[data-menu]');
    if (mn) mn.onclick = () => {
      const c = d?.card || prev;
      const m = openSheet({ className: 'sheet--actions', html: `${sheetHead('Opções', { left: '<button class="btn-text" data-close>Fechar</button>' })}<div class="page page--sheet"><div class="agroup">
        ${d?.rel === 'amigo' ? `<button class="frow" data-rm>${icon('x', 18)}<span class="frow__id"><b>Remover amizade</b></span></button>` : ''}
        <button class="frow" data-bq>${icon('flag', 18)}<span class="frow__id"><b>Denunciar ou bloquear</b></span></button></div></div>`,
        onMount: (y) => {
          const rm = y.el.querySelector('[data-rm]');
          if (rm) rm.onclick = async () => { if (!(await confirmDialog({ title: `Remover ${c.name.split(' ')[0]} dos amigos?`, text: 'Vocês deixam de ver o perfil e os stories um do outro.', ok: 'Remover', danger: true }))) return; try { await call('/friends/remove', { uid }); toast('Amizade removida'); y.close(); a.close(); onRemoved && onRemoved(); } catch (e) { toast(e.message || 'Não consegui agora.'); } };
          y.el.querySelector('[data-bq]').onclick = () => { y.close(); import('./stories.js').then((S) => S.denunciaOuBloqueia({ uid, name: c.name }, null, () => { a.close(); onRemoved && onRemoved(); })); };
        } });
      return m;
    };
    const pe = x.el.querySelector('[data-pedir]');
    if (pe) pe.onclick = async () => { busy = true; x.set(html()); try { const r = await call('/friends/request', { uid }); d.rel = r.rel; toast(r.rel === 'amigo' ? 'Agora vocês são amigos! 🤝' : 'Pedido de amizade enviado 👋'); import('./mascote.js').then((M) => M.react('pedido', { nome: d.card.name })).catch(() => {}); } catch (e) { err = e.message || 'Não consegui enviar agora.'; } busy = false; if (!x.closed) x.set(html()); };
    const ac = x.el.querySelector('[data-aceitar]');
    if (ac) ac.onclick = async () => { busy = true; x.set(html()); try { await call('/friends/answer', { from: uid, ok: true }); d.rel = 'amigo'; toast('Agora vocês são amigos! 🤝'); } catch (e) { err = e.message || 'Não consegui agora.'; } busy = false; if (!x.closed) x.set(html()); };
  } });
  try {
    d = await call('/friends/public', { uid });
    if (d.rel === 'amigo') {
      call('/friends/visit', { uid }).catch(() => {});
      const S = await import('./stories.js'); if (Date.now() - S.visitasCache().at > 60e3) await S.refreshVisitors().catch(() => {});
      veio = S.visitasCache().list.find((v) => v.uid === uid) || null;
    }
  } catch (e) { err = e.message || 'Não consegui abrir o perfil.'; }
  if (!a.closed) a.set(html());
  return a;
}

/* ---------- achar amigos pelos contatos do celular (com permissão) ----------
   Só funciona onde o sistema oferece o seletor de contatos (Android/Chrome e o app das lojas).
   Os números viram códigos embaralhados (SHA-256) NO APARELHO: o servidor nunca recebe os números. */
export const contatosDisponivel = () => !!(navigator.contacts && navigator.contacts.select) || !!window.Capacitor?.Plugins?.Contacts;
export async function buscarPelosContatos() {
  if (!(await confirmDialog({ title: 'Procurar amigos nos seus contatos?', text: 'Você escolhe quais contatos compartilhar. Os números são embaralhados no seu celular antes de sair dele: o Lembra só descobre quem dos escolhidos já usa o app. Nada fica guardado.', ok: 'Escolher contatos' }))) return null;
  let tels = [];
  try {
    if (navigator.contacts?.select) { const cs = await navigator.contacts.select(['tel'], { multiple: true }); tels = cs.flatMap((c) => c.tel || []); }
    else if (window.Capacitor?.Plugins?.Contacts) { const r = await window.Capacitor.Plugins.Contacts.getContacts({ projection: { phones: true } }); tels = (r.contacts || []).flatMap((c) => (c.phones || []).map((p) => p.number)); }
  } catch { return null; }
  const hashes = [...new Set((await Promise.all(tels.slice(0, 1500).map(hashTel))).filter(Boolean))];
  if (!hashes.length) { toast('Nenhum número escolhido.'); return []; }
  const r = await call('/friends/contacts', { hashes });
  return r.rows || [];
}
