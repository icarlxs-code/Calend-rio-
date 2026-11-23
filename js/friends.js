/* Amizades: convite por link → a pessoa recebe o PEDIDO na conta dela e aceita (ou recusa).
   Amigos veem o perfil uns dos outros: foto, nível, XP e emblemas. Quem é Vitalício aparece com a
   moldura lendária. Dá para remover a amizade a qualquer momento. */
import { store } from './store.js';
import { api, server } from './avisos.js';
import { openSheet, sheetHead, toast, confirmDialog } from './components.js';
import { icon } from './icons.js';
import { esc } from './utils.js';
import { CONFIG } from '../config.js';

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
async function friendProfile(c, onRemoved) {
  // registra a visita (o amigo vê que você passou por lá) e confere se ele também passou no seu
  call('/friends/visit', { uid: c.uid }).catch(() => {});
  const S = await import('./stories.js');
  if (Date.now() - S.visitasCache().at > 60e3) await S.refreshVisitors().catch(() => {});
  const veio = S.visitasCache().list.find((v) => v.uid === c.uid);
  const temStory = S.feedCache().rows.find((r) => r.uid === c.uid && r.stories.length);
  const me = store.member(store.me) || {};
  const { badgeById, badgeArt, RARITY, crest } = await import('./badges.js');
  const order = { lendario: 0, epico: 1, raro: 2, comum: 3 };
  const bs = (c.badges || []).map(badgeById).filter(Boolean).sort((a, b) => order[a.rarity] - order[b.rarity]);
  return openSheet({
    className: 'sheet--tall',
    html: `${sheetHead(esc(c.name.split(' ')[0]), { left: '<button class="btn-text" data-close>Fechar</button>' })}
    <div class="page page--sheet fprof${c.vip ? ' fprof--vip' : ''}">
      ${c.vip ? '<div class="fprof__aura"></div>' : ''}
      <div class="fprof__visit">${me.photo ? `<img src="${esc(me.photo)}" alt="">` : `<i style="background:${esc(me.color || '#FF6B1A')}">${esc((me.name || 'V').charAt(0))}</i>`}<span><b>Você passou por aqui</b>${veio ? `<small>${esc(c.name.split(' ')[0])} também passou no seu perfil 👀</small>` : '<small>Ele(a) vai ver que você visitou 😉</small>'}</span></div>
      <div class="fprof__top">${temStory ? `<button class="fprof__story" data-story aria-label="Ver story">${framedPhoto(c, 120)}<i class="ststrip__ring"></i></button>` : framedPhoto(c, 120)}
        <h2>${esc(c.name)}</h2>
        ${c.vip ? `<div class="fprof__vip"><span>${icon('crown', 14)} LEMBRA VITALÍCIO</span><b>Membro Nº ${pad(c.vip.no)}</b><small>Um dos raríssimos membros para sempre</small></div>` : ''}
        <div class="fprof__lv">${crest(c.level || 0, 40)}<span><b>Nível ${c.level || 0}</b>${c.tier ? `<small>${esc(c.tier)}</small>` : ''}</span></div>
      </div>
      <div class="fprof__nums"><div><b>${(c.xp || 0).toLocaleString('pt-BR')}</b><small>XP</small></div><div><b>${bs.length}</b><small>emblemas</small></div><div><b>${bs.filter((b) => b.rarity === 'lendario').length}</b><small>lendários</small></div></div>
      <h3 class="ah">Emblemas</h3>
      ${bs.length ? `<div class="bgrid">${bs.map((b) => `<div class="bgrid__it">${badgeArt(b, 72)}<b>${esc(b.name())}</b><small>${RARITY[b.rarity].label}</small></div>`).join('')}</div>` : '<p class="fhelp">Ainda sem emblemas.</p>'}
      <button class="btn btn--danger-soft btn--block" data-rm>Remover amizade</button>
      <button class="btn-text btn-text--danger btn-text--sm fprof__bloq" data-bloq>${icon('flag', 14)} Denunciar ou bloquear</button>
    </div>`,
    onMount: (a) => {
      const sb = a.el.querySelector('[data-story]'); if (sb) sb.onclick = () => S.openViewer(c.uid);
      const bq = a.el.querySelector('[data-bloq]'); if (bq) bq.onclick = () => S.denunciaOuBloqueia({ uid: c.uid, name: c.name }, null, () => { a.close(); onRemoved && onRemoved(); });
      a.el.querySelector('[data-rm]').onclick = async () => {
        if (!(await confirmDialog({ title: `Remover ${c.name.split(' ')[0]} dos amigos?`, text: 'Vocês deixam de ver o perfil um do outro. Dá para virar amigo de novo com um novo convite.', ok: 'Remover', danger: true }))) return;
        try { await call('/friends/remove', { uid: c.uid }); a.close(); toast('Amizade removida'); onRemoved && onRemoved(); } catch (e) { toast(e.message || 'Não consegui agora.'); }
      };
    },
  });
}

/* ---------- lista de amigos + pedidos + convidar ---------- */
export function openFriends() {
  let data = null, err = '', busca = '';
  const S = import('./stories.js');
  let St = null;
  const linha = (c) => { const st = St && St.feedCache().rows.find((r) => r.uid === c.uid && r.stories.length); const novo = st && st.stories.some((x) => !x.seen);
    return `<button class="frow" data-fr="${esc(c.uid)}"><span class="frow__ring${st ? (novo ? '' : ' is-seen') : ' is-none'}">${framedPhoto(c, 46)}${isOnline(c.online) ? '<i class="frow__on"></i>' : ''}</span><span class="frow__id"><b>${esc(c.name)}${c.vip ? ` <i class="frow__vip">${icon('crown', 11)}</i>` : ''}</b><small>${st ? `${novo ? '🟠 story novo' : 'story visto'} · ` : ''}${c.online ? `<span class="${isOnline(c.online) ? 'is-on' : ''}">${esc(onlineTxt(c.online))}</span> · ` : ''}${esc(c.job || `Nível ${c.level || 0}`)}</small></span>${icon('right', 16)}</button>`; };
  const html = () => {
    const vis = St ? St.visitasCache().list : [];
    const lista = !data ? [] : data.friends.filter((c) => !busca || c.name.toLowerCase().includes(busca.toLowerCase())).sort((x, y) => x.name.localeCompare(y.name, 'pt-BR'));
    return `${sheetHead('Amigos', { left: '<button class="btn-text" data-close>Fechar</button>', right: `<button class="btn-text" data-invite>${icon('plus', 16)} Convidar</button>` })}
    <div class="page page--sheet friends">
      ${St ? St.storyStrip() : ''}
      <label class="fsearch">${icon('search', 16)}<input type="search" placeholder="Buscar amigo" value="${esc(busca)}" data-busca autocomplete="off"></label>
      ${vis.length ? `<button class="fvisit" data-visitas><span class="fvisit__faces">${vis.slice(0, 3).map((c) => framedPhoto(c, 30)).join('')}</span><span><b>${vis.length} ${vis.length === 1 ? 'pessoa visitou' : 'pessoas visitaram'} seu perfil</b><small>Toque pra ver quem foi 👀</small></span>${icon('right', 16)}</button>` : ''}
      ${err ? `<p class="fhelp">${esc(err)}</p>` : !data ? '<p class="fhelp">Carregando…</p>' : `
      ${data.requests.length ? `<h3 class="ah">Pedidos de amizade · ${data.requests.length}</h3><div class="agroup">${data.requests.map((c) => `<div class="frow">${framedPhoto(c, 44)}<span class="frow__id"><b>${esc(c.name)}</b><small>quer ser seu amigo</small></span><button class="btn btn--primary btn--sm" data-req="${esc(c.uid)}">Ver</button></div>`).join('')}</div>` : ''}
      ${(() => { const on = data.friends.filter((c) => isOnline(c.online)); return on.length ? `<h3 class="ah"><i class="ah__on"></i> Online agora · ${on.length}</h3><div class="fonline">${on.map((c) => `<button class="fonline__it" data-fr="${esc(c.uid)}"><span>${framedPhoto(c, 52)}<i class="frow__on"></i></span><small>${esc(c.name.split(' ')[0])}</small></button>`).join('')}</div>` : ''; })()}
      ${contatosDisponivel() ? `<button class="fvisit fcont" data-contatos>${icon('users', 20)}<span><b>Encontrar amigos nos contatos</b><small>Veja quem da sua agenda do celular já usa o Lembra</small></span>${icon('right', 16)}</button>` : ''}
      <h3 class="ah">Seus amigos${data.friends.length ? ` · ${data.friends.length}` : ''}</h3>
      ${lista.length ? `<div class="agroup">${lista.map(linha).join('')}</div>`
        : data.friends.length ? '<p class="fhelp">Ninguém com esse nome.</p>' : '<p class="fhelp">Nenhum amigo ainda. Convide alguém e vejam quem cumpre mais o que marca.</p>'}`}
      <p class="fhelp">Amigos veem seu nível, emblemas e stories. Sua agenda continua só sua (agenda compartilhada é outra coisa).</p>
    </div>`;
  };
  const bind = (x) => {
    const inv = x.el.querySelector('[data-invite]'); if (inv) inv.onclick = () => openShareChoice();
    const bu = x.el.querySelector('[data-busca]'); if (bu) bu.oninput = () => { busca = bu.value; const pos = bu.selectionStart; x.set(html()); const nb = x.el.querySelector('[data-busca]'); nb.focus(); nb.setSelectionRange(pos, pos); };
    const vi = x.el.querySelector('[data-visitas]'); if (vi) vi.onclick = () => St.openVisitors();
    if (St) St.bindStrip(x.el, () => { if (!x.closed) x.set(html()); });
    x.el.querySelectorAll('[data-req]').forEach((b) => (b.onclick = () => openPublicProfile(b.dataset.req).then((pp) => { const t = setInterval(() => { if (pp.closed) { clearInterval(t); load(x); } }, 500); })));
    const ct = x.el.querySelector('[data-contatos]');
    if (ct) ct.onclick = async () => {
      const rows = await buscarPelosContatos(); if (!rows) return;
      if (!rows.length) return toast('Nenhum dos contatos escolhidos usa o Lembra ainda. Convide! 😉');
      openSheet({ className: 'sheet--tall', html: `${sheetHead('Dos seus contatos', { left: '<button class="btn-text" data-close>Fechar</button>' })}<div class="page page--sheet"><p class="fhelp">${rows.length} ${rows.length === 1 ? 'pessoa' : 'pessoas'} da sua agenda já usa${rows.length === 1 ? '' : 'm'} o Lembra:</p><div class="agroup">${rows.map((c) => `<button class="frow" data-pp="${esc(c.uid)}">${framedPhoto(c, 44)}<span class="frow__id"><b>${esc(c.name)}</b><small>${c.rel === 'enviado' ? 'pedido enviado' : c.rel === 'recebido' ? 'quer ser seu amigo' : esc(c.job || `Nível ${c.level || 0}`)}</small></span>${icon('right', 16)}</button>`).join('')}</div></div>`,
        onMount: (y) => y.el.querySelectorAll('[data-pp]').forEach((b) => (b.onclick = () => openPublicProfile(b.dataset.pp))) });
    };
    x.el.querySelectorAll('[data-fr]').forEach((b) => (b.onclick = () => { const c = data.friends.find((r) => r.uid === b.dataset.fr); if (c) friendProfile(c, () => load(x)); }));
  };
  const load = async (a) => { try { data = await call('/friends/list'); err = ''; } catch (e) { err = e.message || 'Não consegui carregar agora.'; } if (!a.closed) a.set(html()); };
  const a = openSheet({ className: 'sheet--tall', html: html(), onMount: bind });
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
export async function openPublicProfile(uid, prev = {}) {
  const { badgeById, badgeArt, RARITY, crest } = await import('./badges.js');
  let d = null, err = '', busy = false;
  const html = () => {
    const c = d?.card || prev;
    const rel = d?.rel || '';
    const order = { lendario: 0, epico: 1, raro: 2, comum: 3 };
    const bs = (c.badges || []).map(badgeById).filter(Boolean).sort((a, b) => order[a.rarity] - order[b.rarity]);
    const ring = d?.story === 'novo' ? 'is-new' : d?.story === 'visto' ? 'is-seen' : '';
    const btn = !d ? '' : rel === 'eu' ? '<span class="pp__tag">Este é você</span>'
      : rel === 'amigo' ? `<span class="pp__tag pp__tag--ok">${icon('check', 14)} Amigos</span>`
      : rel === 'enviado' ? `<span class="pp__tag">${icon('clock', 14)} Pedido enviado</span>`
      : rel === 'recebido' ? `<button class="btn btn--primary btn--block" data-aceitar ${busy ? 'disabled' : ''}>${icon('check', 16)} Aceitar pedido de amizade</button>`
      : `<button class="btn btn--primary btn--block" data-pedir ${busy ? 'disabled' : ''}>${icon('plus', 16)} Adicionar amigo</button>`;
    return `${sheetHead('', { left: '<button class="btn-text" data-close>Fechar</button>' })}
    <div class="page page--sheet pp">
      <div class="pp__top">
        <button class="pp__foto ${ring}" ${d?.story && d.story !== 'amigos' ? 'data-story' : ''} aria-label="Foto${ring ? ' · ver story' : ''}">${framedPhoto(c, 104)}${isOnline(d?.online) ? '<i class="pp__on" title="online agora"></i>' : ''}</button>
        <div class="pp__nums"><div><b>${c.level || 0}</b><small>nível</small></div><div><b>${(c.xp || 0).toLocaleString('pt-BR')}</b><small>XP</small></div><div><b>${bs.length}</b><small>conquistas</small></div></div>
      </div>
      <h2 class="pp__nome">${esc(c.name || '')}${c.vip ? ` <i class="frow__vip">${icon('crown', 13)}</i>` : ''}</h2>
      ${c.job || c.role ? `<p class="pp__job">${icon('briefcase', 14)} ${esc([c.job, c.role].filter(Boolean).join(' · '))}</p>` : ''}
      ${c.place ? `<p class="pp__place">${icon('building', 14)} ${esc(c.place)}</p>` : ''}
      ${c.bio ? `<p class="pp__bio">${esc(c.bio)}</p>` : ''}
      ${d?.online && rel === 'amigo' ? `<p class="pp__visto${isOnline(d.online) ? ' is-on' : ''}">${esc(onlineTxt(d.online))}</p>` : ''}
      ${d?.story === 'amigos' ? `<p class="fhelp">${icon('lock', 12)} Postou story hoje — só amigos veem.</p>` : ''}
      ${btn}
      ${err ? `<p class="fhelp">${esc(err)}</p>` : ''}
      ${d?.privado ? `<div class="pp__priv">${icon('lock', 28)}<b>Perfil privado</b><small>Adicione como amigo para ver as conquistas, o brasão e os stories.</small></div>` : !d ? '<p class="fhelp">Carregando…</p>' : `
      <div class="pp__lv">${crest(c.level || 0, 56)}<span><b>Nível ${c.level || 0}${c.tier ? ` · ${esc(c.tier)}` : ''}</b><small>${(c.xp || 0).toLocaleString('pt-BR')} XP no total</small></span></div>
      <h3 class="ah">Conquistas · ${bs.length}</h3>
      ${bs.length ? `<div class="bgrid">${bs.map((b) => `<div class="bgrid__it">${badgeArt(b, 72)}<b>${esc(b.name())}</b><small>${RARITY[b.rarity].label}</small></div>`).join('')}</div>` : '<p class="fhelp">Ainda sem conquistas.</p>'}`}
    </div>`;
  };
  const a = openSheet({ className: 'sheet--tall', html: html(), onMount: (x) => {
    const st = x.el.querySelector('[data-story]'); if (st) st.onclick = () => import('./stories.js').then((m) => m.openViewer(uid));
    const pe = x.el.querySelector('[data-pedir]');
    if (pe) pe.onclick = async () => { busy = true; x.set(html()); try { const r = await call('/friends/request', { uid }); d.rel = r.rel; toast(r.rel === 'amigo' ? 'Agora vocês são amigos! 🤝' : 'Pedido de amizade enviado 👋'); import('./mascote.js').then((M) => M.react('pedido', { nome: d.card.name })).catch(() => {}); } catch (e) { err = e.message || 'Não consegui enviar agora.'; } busy = false; if (!x.closed) x.set(html()); };
    const ac = x.el.querySelector('[data-aceitar]');
    if (ac) ac.onclick = async () => { busy = true; x.set(html()); try { await call('/friends/answer', { from: uid, ok: true }); d.rel = 'amigo'; toast('Agora vocês são amigos! 🤝'); } catch (e) { err = e.message || 'Não consegui agora.'; } busy = false; if (!x.closed) x.set(html()); };
  } });
  try { d = await call('/friends/public', { uid }); if (d.rel === 'amigo') call('/friends/visit', { uid }).catch(() => {}); } catch (e) { err = e.message || 'Não consegui abrir o perfil.'; }
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
