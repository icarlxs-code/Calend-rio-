/* Agenda compartilhada (complemento pago, à parte): o dono convida pessoas para a agenda de TRABALHO dele.
   - +1 pessoa · R$ 7,90/mês   - +4 pessoas · R$ 29,90/mês (Fundadores/vitalício: R$ 4,90 e R$ 19,90)
   Não vem no plano Mensal nem no Vitalício. Quem é convidado não paga nada enquanto o dono mantiver o complemento.
   Cada pessoa usa o próprio login e continua com a própria agenda e o próprio modo Pessoal.

   Convites: cada convite é de UMA pessoa. É um código aleatório de 32 caracteres (impossível de adivinhar),
   vale 7 dias e só pode ser usado uma vez. O link não mostra nada da conta de quem convidou.
   As regras do Firebase conferem tudo de novo: código, validade, uso único, vaga e plano ativo. */
import { store, saveUserProfile, soloMember } from './store.js';
import { openSheet, sheetHead, toast, confirmDialog, avatar } from './components.js';
import { icon } from './icons.js';
import { esc } from './utils.js';
import { api, server } from './avisos.js';
import { openPlans, openPortal, markBuying } from './billing.js';
import { CONFIG } from '../config.js';

export const ADDONS = {
  dupla: { name: '+1 pessoa', price: '7,90', vprice: '4,90', seats: 1, line: 'Você + 1 pessoa' },
  equipe: { name: '+4 pessoas', price: '29,90', vprice: '19,90', seats: 4, line: 'Você + até 4 pessoas' },
};
/* Vitalício paga o complemento mais barato (o servidor cobra o mesmo valor) */
export const addonPrice = (k) => (store.billing?.plan === 'lifetime' ? ADDONS[k].vprice : ADDONS[k].price);
const perPerson = (k) => `R$ ${(Number(addonPrice(k).replace(',', '.')) / (ADDONS[k].seats + 1)).toFixed(2).replace('.', ',')} por pessoa`;
const LS_INVITE = 'lembra.invite';
const INVITE_DAYS = 7;
const wsKey = () => `lembra.ws.${store.user?.uid || 'x'}`;
export const idOf = (uid) => 'u' + String(uid || '').replace(/[^A-Za-z0-9]/g, '').slice(0, 24);
const COLORS = ['#2563EB', '#0E9F6E', '#D9480F', '#DB2777', '#0891B2', '#CA8A04'];
const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
/* 32 caracteres aleatórios do gerador criptográfico (~190 bits): ninguém adivinha um convite */
export const newToken = () => Array.from(crypto.getRandomValues(new Uint8Array(32)), (b) => ALPHA[b % 62]).join('');
export const isToken = (t) => /^[A-Za-z0-9]{32}$/.test(t || '');
/* Endereço oficial do app (muda num lugar só quando comprar o domínio) */
export const siteUrl = () => {
  const local = /^(localhost|127\.0\.0\.1)$/.test(location.hostname); // testes no computador
  return ((!local && CONFIG.siteUrl) || `${location.origin}${location.pathname.replace(/[^/]*$/, '')}`).replace(/\/?$/, '/');
};
export const inviteLink = (token) => `${siteUrl()}convite/#${token}`;

/* Pessoas de uma equipe, na ordem: dono e convidados */
const hex = (c, d) => (/^#[0-9a-fA-F]{6}$/.test(c || '') ? c : d);
const nm = (n, d) => (typeof n === 'string' && n.trim() ? n.trim().slice(0, 40) : d);
export function teamPeople(t, owner, mine = null) {
  const lv = (v) => (Number.isFinite(v) && v >= 0 && v <= 100 ? Math.round(v) : null); // nível de conquistas (placar da equipe)
  const out = [{ id: idOf(owner), name: nm(t.ownerName, 'Dono'), color: hex(t.ownerColor, '#7C5CFF'), photo: null, uid: owner, owner: true, level: lv(t.ownerLevel), vip: t.ownerVip === true }];
  (t.members || []).filter((uid) => typeof uid === 'string' && /^[A-Za-z0-9]{6,64}$/.test(uid))
    .forEach((uid, i) => out.push({ id: idOf(uid), name: nm(t.names?.[uid]?.name, 'Convidado'), color: hex(t.names?.[uid]?.color, COLORS[i % COLORS.length]), photo: typeof t.names?.[uid]?.photo === 'string' && t.names[uid].photo.startsWith('data:image/') ? t.names[uid].photo : null, uid, level: lv(t.names?.[uid]?.level), vip: t.names?.[uid]?.vip === true }));
  // a própria pessoa aparece com a foto e a cor do perfil dela
  return mine ? out.map((p) => (p.id === mine.id ? { ...p, ...mine, uid: p.uid, owner: p.owner } : p)) : out;
}

/* ---------- convite pelo link ---------- */
/* Guarda o convite do link (#/convite/TOKEN) para depois do login */
export function captureInvite(hash = location.hash) {
  const m = /^#\/convite\/([A-Za-z0-9]{32})\b/.exec(hash || '');
  if (!/^#\/convite\//.test(hash || '')) return false;
  history.replaceState(null, '', location.pathname + location.search);
  if (!m) return false;
  try { localStorage.setItem(LS_INVITE, JSON.stringify({ token: m[1], at: Date.now() })); } catch { /* ok */ }
  return true;
}
export const pendingInvite = () => { try { const i = JSON.parse(localStorage.getItem(LS_INVITE) || 'null'); return i && isToken(i.token) && Date.now() - i.at < 3 * 864e5 ? i : null; } catch { return null; } };
const clearInvite = () => { try { localStorage.removeItem(LS_INVITE); } catch { /* ok */ } };
export const inviteState = (inv, now = Date.now()) => (!inv ? 'missing' : inv.used ? 'used' : inv.expiresAt <= now ? 'expired' : 'ok');
const STATE_MSG = {
  missing: 'Esse convite não existe mais (pode ter sido cancelado). Peça um novo para quem te convidou.',
  used: 'Esse convite já foi usado. Cada convite vale para uma pessoa só: peça um novo.',
  expired: 'Esse convite expirou (vale 7 dias). Peça um novo para quem te convidou.',
};

/* Depois do login e da ficha: pergunta se quer entrar na agenda de quem convidou */
export async function maybeAcceptInvite() {
  const p = pendingInvite();
  if (!p || store.mode !== 'cloud' || !store.user) return false;
  clearInvite();
  if (store.workspace === 'main') { toast('Sua conta já faz parte da agenda da dupla.'); return false; }
  let inv = null;
  try { inv = await store.backendApi.getInvite(p.token); } catch (e) { console.warn('convite', e); }
  if (inv && inv.owner === store.user.uid) { toast('Esse é o seu próprio convite. Envie o link para a pessoa que você quer chamar.', { ms: 5000 }); return false; }
  if (inv && store.profile?.teams?.[inv.owner]) return switchWorkspace(inv.owner);
  const st = inviteState(inv);
  if (st !== 'ok') { toast(STATE_MSG[st], { ms: 8000 }); return false; }
  const who = inv.ownerName || 'Uma pessoa';
  const ok = await confirmDialog({
    title: `${who} convidou você 💼`,
    text: `Para participar da agenda de trabalho compartilhada de ${who}. Você continua com a sua agenda e o seu modo Pessoal, e troca entre elas quando quiser. Você não paga nada por isso.`,
    ok: 'Entrar na agenda',
  });
  if (!ok) return false;
  const me = store.member(store.me) || {};
  try {
    await store.backendApi.joinTeam(inv.owner, p.token, { name: me.name || 'Convidado', color: me.color || '#2563EB', at: Date.now(), ...(await smallPhoto(me.photo)) });
  } catch (e) {
    console.warn('convite', e);
    toast(/permission/i.test(String(e.code || e.message)) ? 'Não deu para entrar: o convite já foi usado ou cancelado, a agenda está cheia ou o plano de quem convidou não está ativo. Peça um novo convite.' : 'Não consegui entrar agora. Verifique a internet e abra o link de novo.', { ms: 8000 });
    return false;
  }
  await saveUserProfile({ teams: { ...(store.profile?.teams || {}), [inv.owner]: { ownerName: who, at: Date.now() } } }).catch(() => {});
  toast(`Pronto! Você entrou na agenda de ${who}.`, { ms: 3000 });
  setTimeout(() => switchWorkspace(inv.owner), 900);
  return true;
}

/* Troca entre a sua agenda e a agenda compartilhada (recarrega o app no outro espaço) */
export function switchWorkspace(ws) {
  try {
    if (!ws || ws === store.user?.uid) localStorage.removeItem(wsKey());
    else localStorage.setItem(wsKey(), ws);
  } catch { /* ok */ }
  location.reload();
  return true;
}
export const chosenWorkspace = (uid) => { try { return localStorage.getItem(`lembra.ws.${uid}`); } catch { return null; } };
export const forgetWorkspace = (uid) => { try { localStorage.removeItem(`lembra.ws.${uid}`); } catch { /* ok */ } };

/* ---------- dono: mantém a equipe em dia com o plano ---------- */
let teamDoc = null, unwatch = null, lastSync = '';
export const myTeam = () => teamDoc;
const ownSpace = () => store.mode === 'cloud' && store.solo && store.user && store.workspace === store.user.uid;

/* Liga/desliga a agenda compartilhada conforme o complemento pago e acompanha quem entrou */
export async function startTeam() {
  if (!ownSpace() || !store.backendApi?.watchTeam) return;
  const uid = store.user.uid;
  const addon = store.billing?.addon;
  const paidBase = ['monthly', 'lifetime'].includes(store.billing?.plan);
  const active = !!(addon && addon.active && paidBase);
  const me = store.member(store.me) || {};
  try {
    const cur = await store.backendApi.getTeam(uid);
    if (active || cur) {
      const want = { ownerUid: uid, ownerName: me.name || 'Dono', ownerColor: me.color || '#7C5CFF', active, seats: active ? ADDONS[addon.plan]?.seats || 1 : 0, plan: addon?.plan || null };
      if (!cur || cur.active !== want.active || cur.seats !== want.seats || cur.ownerName !== want.ownerName || cur.plan !== want.plan) await store.backendApi.setTeam(uid, { members: cur?.members || [], names: cur?.names || {}, ...want });
    }
  } catch (e) { console.warn('equipe', e); }
  if (unwatch) return;
  unwatch = store.backendApi.watchTeam(uid, (t) => {
    teamDoc = t;
    const mine = store.member(store.me) || soloMember(store.user, store.profile || {});
    const people = t && t.active && (t.members || []).length ? teamPeople(t, uid, mine) : [mine];
    const sig = people.map((p) => p.id + p.name + (p.level ?? '') + (p.vip ? '*' : '')).join('|');
    if (sig !== store.team.map((p) => p.id + p.name + (p.level ?? '') + (p.vip ? '*' : '')).join('|')) { store.team = people; store.emit(); }
    // o servidor confere as vagas pagas e libera os avisos para os convidados
    const syncSig = JSON.stringify([t?.active, t?.members, t?.names]);
    if (t && server() && syncSig !== lastSync) {
      lastSync = syncSig;
      api('/share/sync', { ownerName: t.ownerName || '', members: (t.members || []).map((m) => ({ uid: m, name: t.names?.[m]?.name || 'Convidado' })) }).catch((e) => console.warn('share/sync', e.message));
    }
  });
}

/* foto pequena para a lista de quem participa (não pesa a agenda do dono) */
export async function smallPhoto(src) {
  if (!src || !String(src).startsWith('data:image/')) return {};
  try {
    const img = await new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = src; });
    const c = document.createElement('canvas'); c.width = c.height = 96;
    const k = Math.max(96 / img.width, 96 / img.height), w = img.width * k, h = img.height * k;
    c.getContext('2d').drawImage(img, (96 - w) / 2, (96 - h) / 2, w, h);
    return { photo: c.toDataURL('image/jpeg', 0.8) };
  } catch { return {}; }
}

/* Cria um convite novo, de uma pessoa só */
export async function createInvite(label = '') {
  const me = store.member(store.me) || {};
  const token = newToken();
  const now = Date.now();
  await store.backendApi.createInvite(token, {
    owner: store.user.uid, ownerName: (me.name || 'Alguém').slice(0, 40), ownerColor: me.color || '#7C5CFF',
    label: String(label || '').trim().slice(0, 40), createdAt: now, expiresAt: now + INVITE_DAYS * 864e5, used: false, usedBy: null, usedAt: null,
  });
  import('./game.js').then((g) => g.onInvite()).catch(() => {});
  return token;
}

/* ---------- tela "Agenda compartilhada" ---------- */
const fmtDate = (ms) => new Date(ms).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
export function openShare() {
  let invites = null, fresh = null, busy = false;
  const b = () => store.billing || {};
  const html = () => {
    const shared = store.shared;
    const teams = Object.entries(store.profile?.teams || {});
    const guestPart = teams.length || shared ? `<section class="block">
      <h2 class="block__title">${icon('users', 16)} Agendas em que você participa</h2>
      <div class="list">
        <button class="list__row" data-ws="">${icon('briefcase', 18)}<span><b>Minha agenda</b></span>${!shared ? '<small class="ok">em uso</small>' : icon('right', 16, 'muted')}</button>
        ${teams.map(([owner, t]) => `<button class="list__row" data-ws="${esc(owner)}">${icon('users', 18)}<span><b>Agenda de ${esc(t.ownerName || 'equipe')}</b></span>${shared?.owner === owner ? '<small class="ok">em uso</small>' : icon('right', 16, 'muted')}</button>`).join('')}
      </div>
      ${shared ? `<button class="btn-text btn-text--danger btn-text--sm" data-leave>Sair da agenda de ${esc(shared.ownerName)}</button>` : ''}
    </section>` : '';
    if (shared) return `${sheetHead('Agenda compartilhada')}<div class="page page--sheet">${guestPart}<p class="fhelp">Você está na agenda de ${esc(shared.ownerName)}. Os compromissos marcados para você chegam como notificação no seu celular.</p></div>`;
    const addon = b().addon;
    const paidBase = ['monthly', 'lifetime'].includes(b().plan);
    const active = addon && addon.active && paidBase;
    const t = teamDoc;
    const people = t ? (t.members || []).map((uid) => { const n = t.names?.[uid] || {}; return { uid, name: n.name || 'Convidado', photo: typeof n.photo === 'string' && n.photo.startsWith('data:image/') ? n.photo : null, level: Number.isFinite(n.level) ? n.level : null, vip: n.vip === true, at: n.at || null }; }) : [];
    const seats = active ? ADDONS[addon.plan].seats : 0;
    const pending = (invites || []).filter((i) => inviteState(i) === 'ok');
    const free = Math.max(0, seats - people.length);
    const ownerPart = active ? `<div class="share__plan">${icon('crown', 18)}<div><b>Plano ${esc(ADDONS[addon.plan].name)} ativo</b><small>${people.length} de ${seats} ${seats > 1 ? 'vagas usadas' : 'vaga usada'} · ${addon.gift ? 'incluído no seu acesso, sem custo' : `R$ ${addonPrice(addon.plan)}/mês`}${addon.cancelAt ? ` · cancelado, vale até ${new Date(addon.cancelAt).toLocaleDateString('pt-BR')}` : ''}</small></div></div>
      <section class="block">
        <h2 class="block__title">${icon('link', 16)} Convidar</h2>
        <div class="card">
          ${fresh ? `<p><b>Convite criado.</b> Este link é único, vale para <b>uma pessoa</b> e expira em ${INVITE_DAYS} dias.</p>
            <div class="share__link"><input readonly value="${esc(inviteLink(fresh.token))}" data-link></div>
            <div class="btnrow"><button class="btn btn--primary btn--sm" data-send>${icon('share', 16)} Enviar convite</button><button class="btn btn--soft btn--sm" data-copy>${icon('copy', 16)} Copiar</button></div>`
          : free ? `<p>Cada pessoa recebe um <b>link próprio</b>, que só funciona uma vez e expira em ${INVITE_DAYS} dias. Ninguém consegue entrar com o link de outra pessoa.</p>
            <button class="btn btn--primary btn--block" data-new ${busy ? 'disabled' : ''}>${icon('share', 16)} Enviar link de convite</button>
            <p class="fhelp">A pessoa cria a conta dela com o nome e a foto que quiser e já aparece aqui.</p>`
          : `<p>Todas as vagas estão ocupadas. Para chamar outra pessoa, remova alguém${addon.plan === 'dupla' ? ' ou passe para o plano Equipe (até 4 pessoas)' : ''}.</p>`}
        </div>
        ${pending.length ? `<div class="list share__pending">${pending.map((i) => `<div class="list__row">${icon('clock', 16)}<span class="share__pinfo"><span>Convite${i.label ? ` para <b>${esc(i.label)}</b>` : ''} enviado</span><small>aguardando · expira ${fmtDate(i.expiresAt)}</small></span><button class="btn-text btn-text--sm" data-again="${esc(i.id)}">Enviar</button><button class="btn-text btn-text--danger btn-text--sm" data-cancel="${esc(i.id)}">Cancelar</button></div>`).join('')}</div>` : ''}
      </section>
      <section class="block">
        <h2 class="block__title">${icon('users', 16)} Quem participa</h2>
        <div class="list">
          <div class="list__row mrow">${avatar(store.me, 52)}<span class="mrow__id"><b>${esc(store.member(store.me)?.name || 'Você')}</b><small>Dono da agenda</small></span></div>
          ${people.map((p) => `<div class="list__row mrow">${p.photo ? `<span class="avatar mrow__pic" style="width:52px;height:52px"><img src="${esc(p.photo)}" alt=""></span>` : avatar(idOf(p.uid), 52)}<span class="mrow__id"><b>${esc(p.name)}${p.vip ? ` ${icon('crown', 12)}` : ''}</b><small>${p.level != null ? `Nível ${p.level}` : 'Participante'}${p.at ? ` · entrou em ${new Date(p.at).toLocaleDateString('pt-BR')}` : ''}</small></span><button class="btn-text btn-text--danger btn-text--sm" data-remove="${esc(p.uid)}">Remover</button></div>`).join('')}
          ${Array.from({ length: free }, () => `<div class="list__row muted">${icon('plus', 18)}<span>Vaga livre</span></div>`).join('')}
        </div>
        <p class="fhelp">Cada pessoa vê a agenda de trabalho, marca compromissos e recebe os avisos do que é dela. O modo Pessoal de cada um continua privado.</p>
      </section>
      ${addon.gift ? '' : '<button class="btn btn--soft btn--block" data-portal>Gerenciar assinatura</button>'}`
      : `<div class="share__hero">${icon('share2', 30)}<h2>Divida sua agenda de trabalho</h2><p>Sócio, equipe, secretária, colega de plantão: cada pessoa com o próprio login, vendo a mesma agenda e recebendo os avisos do que é dela.</p></div>
      <div class="plans plans--light">
        ${Object.entries(ADDONS).map(([k, a]) => `<button class="plan${k === 'equipe' ? ' plan--best' : ''}" data-addon="${k}">${k === 'equipe' ? '<span class="plan__tag">Mais vantajoso</span>' : ''}<span class="plan__name">${a.name}</span><span class="plan__price"><b>R$ ${addonPrice(k)}</b>/mês</span><span class="plan__note">${a.line}<br>${perPerson(k)}${b().plan === 'lifetime' ? `<br><s>R$ ${a.price}</s> · preço de vitalício` : ''}</span></button>`).join('')}
      </div>
      <div class="share__note">${icon('alert', 16)}<div><b>Complemento à parte, por mês.</b> Não está incluso no plano Mensal nem no Vitalício (quem é Vitalício paga menos). Quem você convidar <b>não paga nada</b> enquanto o complemento estiver ativo. Cancele quando quiser.</div></div>
      ${!paidBase ? `<p class="fhelp">Para contratar, primeiro escolha seu plano (Mensal ou Vitalício).</p><button class="btn btn--primary btn--block" data-base>Escolher meu plano</button>` : ''}
      <p class="share__err" data-err hidden></p>`;
    return `${sheetHead('Agenda compartilhada')}<div class="page page--sheet">${ownerPart}${guestPart}</div>`;
  };
  const loadInvites = async (a) => {
    try { invites = await store.backendApi.listInvites(store.user.uid); } catch (e) { console.warn('convites', e); invites = []; }
    a.set(html());
  };
  const shareLink = async (token) => {
    const me = store.member(store.me) || {};
    const link = inviteLink(token);
    const text = `${me.name || 'Eu'} te convidou para a minha agenda de trabalho no ${CONFIG.appName || 'Lembra'}. Este convite é só seu:`;
    if (navigator.share) { try { await navigator.share({ title: `Convite · ${CONFIG.appName || 'Lembra'}`, text, url: link }); return; } catch { /* cancelou */ } }
    location.href = `https://wa.me/?text=${encodeURIComponent(`${text} ${link}`)}`;
  };
  const api2 = openSheet({
    className: 'sheet--tall',
    html: html(),
    onMount: (a) => {
      const el = a.el;
      el.querySelectorAll('[data-ws]').forEach((x) => (x.onclick = () => switchWorkspace(x.dataset.ws)));
      const leave = el.querySelector('[data-leave]');
      if (leave) leave.onclick = async () => {
        const s = store.shared;
        if (!(await confirmDialog({ title: `Sair da agenda de ${s.ownerName}?`, text: 'Você volta para a sua agenda. Para entrar de novo, precisa de um novo convite.', ok: 'Sair', danger: true }))) return;
        try { await store.backendApi.leaveTeam(s.owner, store.user.uid); } catch (e) { console.warn(e); }
        const teams = { ...(store.profile?.teams || {}) };
        delete teams[s.owner];
        await saveUserProfile({ teams }).catch(() => {});
        switchWorkspace('');
      };
      el.querySelectorAll('[data-addon]').forEach((x) => (x.onclick = async () => {
        const err = el.querySelector('[data-err]');
        if (!['monthly', 'lifetime'].includes(b().plan)) return openPlans();
        x.classList.add('is-busy');
        try {
          const r = await api('/billing/checkout', { plan: x.dataset.addon, returnUrl: siteUrl() });
          if (!r.url) throw new Error(r.error || 'sem endereço');
          markBuying(x.dataset.addon);
          location.href = r.url;
        } catch (e) { x.classList.remove('is-busy'); if (err) { err.textContent = e.message || 'Não consegui abrir o pagamento agora.'; err.hidden = false; } }
      }));
      const base = el.querySelector('[data-base]');
      if (base) base.onclick = () => openPlans();
      const portal = el.querySelector('[data-portal]');
      if (portal) portal.onclick = () => openPortal().catch((e) => toast(e.message || 'Não consegui abrir agora'));
      const nw = el.querySelector('[data-new]');
      if (nw) nw.onclick = async () => {
        busy = true; nw.disabled = true;
        try { const token = await createInvite(); fresh = { token }; busy = false; await loadInvites(a); await shareLink(token); return; } catch (e) { console.warn(e); toast('Não consegui criar o convite agora. Verifique a internet.'); }
        busy = false;
        await loadInvites(a);
      };
      const send = el.querySelector('[data-send]');
      if (send) send.onclick = () => shareLink(fresh.token);
      const copy = el.querySelector('[data-copy]');
      if (copy) copy.onclick = async () => { try { await navigator.clipboard.writeText(inviteLink(fresh.token)); toast('Link copiado ✓'); } catch { el.querySelector('[data-link]').select(); } };
      el.querySelectorAll('[data-again]').forEach((x) => (x.onclick = () => shareLink(x.dataset.again)));
      el.querySelectorAll('[data-cancel]').forEach((x) => (x.onclick = async () => {
        if (!(await confirmDialog({ title: 'Cancelar este convite?', text: 'O link para de funcionar na hora.', ok: 'Cancelar convite', danger: true }))) return;
        try { await store.backendApi.deleteInvite(x.dataset.cancel); if (fresh && fresh.token === x.dataset.cancel) fresh = null; } catch { toast('Não consegui cancelar agora.'); }
        await loadInvites(a);
      }));
      el.querySelectorAll('[data-remove]').forEach((x) => (x.onclick = async () => {
        const name = teamDoc?.names?.[x.dataset.remove]?.name || 'essa pessoa';
        if (!(await confirmDialog({ title: `Remover ${name}?`, text: 'A pessoa deixa de ver a sua agenda de trabalho na hora. O que ela já marcou continua na agenda.', ok: 'Remover', danger: true }))) return;
        try { await store.backendApi.leaveTeam(store.user.uid, x.dataset.remove); toast('Removido'); } catch { toast('Não consegui remover agora.'); }
        setTimeout(() => a.set(html()), 600);
      }));
    },
  });
  if (!store.shared && store.billing?.addon?.active) loadInvites(api2);
  return api2;
}
