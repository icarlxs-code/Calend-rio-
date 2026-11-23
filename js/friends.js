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
    const card = { name: me.name || '', photo: me.photo && me.photo.length < 90000 ? me.photo : null, color: me.color || '#7C5CFF', level: L.level, xp: L.xp, tier: L.tier.name(), badges: Object.keys(st.badges || {}),
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
async function friendProfile(c, onRemoved) {
  const { badgeById, badgeArt, RARITY, crest } = await import('./badges.js');
  const order = { lendario: 0, epico: 1, raro: 2, comum: 3 };
  const bs = (c.badges || []).map(badgeById).filter(Boolean).sort((a, b) => order[a.rarity] - order[b.rarity]);
  return openSheet({
    className: 'sheet--tall',
    html: `${sheetHead(esc(c.name.split(' ')[0]), { left: '<button class="btn-text" data-close>Fechar</button>' })}
    <div class="page page--sheet fprof${c.vip ? ' fprof--vip' : ''}">
      ${c.vip ? '<div class="fprof__aura"></div>' : ''}
      <div class="fprof__top">${framedPhoto(c, 120)}
        <h2>${esc(c.name)}</h2>
        ${c.vip ? `<div class="fprof__vip"><span>${icon('crown', 14)} LEMBRA VITALÍCIO</span><b>Membro Nº ${pad(c.vip.no)}</b><small>Um dos raríssimos membros para sempre</small></div>` : ''}
        <div class="fprof__lv">${crest(c.level || 0, 40)}<span><b>Nível ${c.level || 0}</b>${c.tier ? `<small>${esc(c.tier)}</small>` : ''}</span></div>
      </div>
      <div class="fprof__nums"><div><b>${(c.xp || 0).toLocaleString('pt-BR')}</b><small>XP</small></div><div><b>${bs.length}</b><small>emblemas</small></div><div><b>${bs.filter((b) => b.rarity === 'lendario').length}</b><small>lendários</small></div></div>
      <h3 class="ah">Emblemas</h3>
      ${bs.length ? `<div class="bgrid">${bs.map((b) => `<div class="bgrid__it">${badgeArt(b, 72)}<b>${esc(b.name())}</b><small>${RARITY[b.rarity].label}</small></div>`).join('')}</div>` : '<p class="fhelp">Ainda sem emblemas.</p>'}
      <button class="btn btn--danger-soft btn--block" data-rm>Remover amizade</button>
    </div>`,
    onMount: (a) => {
      a.el.querySelector('[data-rm]').onclick = async () => {
        if (!(await confirmDialog({ title: `Remover ${c.name.split(' ')[0]} dos amigos?`, text: 'Vocês deixam de ver o perfil um do outro. Dá para virar amigo de novo com um novo convite.', ok: 'Remover', danger: true }))) return;
        try { await call('/friends/remove', { uid: c.uid }); a.close(); toast('Amizade removida'); onRemoved && onRemoved(); } catch (e) { toast(e.message || 'Não consegui agora.'); }
      };
    },
  });
}

/* ---------- lista de amigos + pedidos + convidar ---------- */
export function openFriends() {
  let data = null, err = '';
  const html = () => `${sheetHead('Amigos', { left: '<button class="btn-text" data-close>Fechar</button>' })}
    <div class="page page--sheet friends">
      <button class="btn btn--primary btn--block" data-invite>${icon('plus', 16)} Convidar amigo</button>
      <p class="fhelp">Você manda um link (pode ser o mesmo pra várias pessoas); cada uma manda o pedido e entra na sua lista. Amigos veem o nível e os emblemas uns dos outros.</p>
      ${err ? `<p class="fhelp">${esc(err)}</p>` : !data ? '<p class="fhelp">Carregando…</p>' : `
      ${data.requests.length ? `<h3 class="ah">Pedidos de amizade</h3><div class="agroup">${data.requests.map((c) => `<div class="frow">${framedPhoto(c, 44)}<span class="frow__id"><b>${esc(c.name)}</b><small>quer ser seu amigo</small></span><button class="btn btn--primary btn--sm" data-req="${esc(c.uid)}">Ver</button></div>`).join('')}</div>` : ''}
      <h3 class="ah">Seus amigos${data.friends.length ? ` · ${data.friends.length}` : ''}</h3>
      ${data.friends.length ? `<div class="agroup">${data.friends.map((c, i) => `<button class="frow" data-fr="${esc(c.uid)}"><span class="frow__pos">${i + 1}º</span>${framedPhoto(c, 44)}<span class="frow__id"><b>${esc(c.name)}${c.vip ? ` <i class="frow__vip">${icon('crown', 11)} Vitalício</i>` : ''}</b><small>Nível ${c.level || 0} · ${(c.badges || []).length} emblemas</small></span>${icon('right', 16)}</button>`).join('')}</div>`
        : '<p class="fhelp">Nenhum amigo ainda. Convide alguém e vejam quem cumpre mais o que marca.</p>'}`}
    </div>`;
  const load = async (a) => { try { data = await call('/friends/list'); err = ''; } catch (e) { err = e.message || 'Não consegui carregar agora.'; } if (!a.closed) a.set(html()); };
  const a = openSheet({
    className: 'sheet--tall',
    html: html(),
    onMount: (x) => {
      const inv = x.el.querySelector('[data-invite]');
      if (inv) inv.onclick = () => openShareChoice();
      x.el.querySelectorAll('[data-req]').forEach((b) => (b.onclick = () => { const c = data.requests.find((r) => r.uid === b.dataset.req); if (c) requestSheet(c, () => load(x)); }));
      x.el.querySelectorAll('[data-fr]').forEach((b) => (b.onclick = () => { const c = data.friends.find((r) => r.uid === b.dataset.fr); if (c) friendProfile(c, () => load(x)); }));
    },
  });
  publishCard();
  load(a);
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
