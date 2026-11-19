/* Agenda compartilhada (complemento pago, à parte): o dono convida pessoas para a agenda de TRABALHO dele.
   - Dupla: você + 1 pessoa · R$ 6,90/mês   - Equipe: você + até 4 pessoas · R$ 14,90/mês
   Não vem no plano Mensal nem no Vitalício. Quem é convidado não paga nada enquanto o dono mantiver o complemento.
   Cada pessoa usa o próprio login e continua com a própria agenda e o próprio modo Pessoal. */
import { store, saveUserProfile, soloMember } from './store.js';
import { openSheet, sheetHead, toast, confirmDialog, avatar } from './components.js';
import { icon } from './icons.js';
import { esc } from './utils.js';
import { api, server } from './avisos.js';
import { openPlans, openPortal, markBuying } from './billing.js';

export const ADDONS = {
  dupla: { name: 'Dupla', price: '6,90', seats: 1, line: 'Você + 1 pessoa', each: 'R$ 3,45 por pessoa' },
  equipe: { name: 'Equipe', price: '14,90', seats: 4, line: 'Você + até 4 pessoas', each: 'R$ 2,98 por pessoa' },
};
const LS_INVITE = 'lembra.invite';
const wsKey = () => `lembra.ws.${store.user?.uid || 'x'}`;
export const idOf = (uid) => 'u' + String(uid || '').replace(/[^A-Za-z0-9]/g, '').slice(0, 24);
const COLORS = ['#2563EB', '#0E9F6E', '#D9480F', '#DB2777', '#0891B2', '#CA8A04'];
const code = () => Array.from(crypto.getRandomValues(new Uint8Array(9)), (b) => 'abcdefghjkmnpqrstuvwxyz23456789'[b % 31]).join('');

/* Pessoas de uma equipe, na ordem: dono e convidados */
export function teamPeople(t, owner, mine = null) {
  const out = [{ id: idOf(owner), name: t.ownerName || 'Dono', color: t.ownerColor || '#7C5CFF', photo: null, uid: owner, owner: true }];
  (t.members || []).forEach((uid, i) => out.push({ id: idOf(uid), name: t.names?.[uid]?.name || 'Convidado', color: t.names?.[uid]?.color || COLORS[i % COLORS.length], photo: null, uid }));
  // a própria pessoa aparece com a foto e a cor do perfil dela
  return mine ? out.map((p) => (p.id === mine.id ? { ...p, ...mine, uid: p.uid, owner: p.owner } : p)) : out;
}

/* ---------- convite pelo link ---------- */
/* Guarda o convite do link (#/convite/dono.codigo.nome) para depois do login */
export function captureInvite(hash = location.hash) {
  const m = /^#\/convite\/([A-Za-z0-9]{6,64})\.([a-z0-9]{6,20})(?:\.([^/]*))?/.exec(hash || '');
  if (!m) return false;
  try { localStorage.setItem(LS_INVITE, JSON.stringify({ owner: m[1], code: m[2], name: decodeURIComponent(m[3] || '').slice(0, 40), at: Date.now() })); } catch { /* ok */ }
  history.replaceState(null, '', location.pathname + location.search);
  return true;
}
const pendingInvite = () => { try { return JSON.parse(localStorage.getItem(LS_INVITE) || 'null'); } catch { return null; } };
const clearInvite = () => { try { localStorage.removeItem(LS_INVITE); } catch { /* ok */ } };

/* Depois do login e da ficha: pergunta se quer entrar na agenda de quem convidou */
export async function maybeAcceptInvite() {
  const inv = pendingInvite();
  if (!inv || store.mode !== 'cloud' || !store.user) return false;
  if (store.workspace === 'main') { clearInvite(); toast('Sua conta já faz parte da agenda da dupla.'); return false; }
  if (inv.owner === store.user.uid) { clearInvite(); toast('Esse é o seu próprio convite. Envie o link para quem você quer chamar.', { ms: 5000 }); return false; }
  if (store.profile?.teams?.[inv.owner]) { clearInvite(); return switchWorkspace(inv.owner); }
  const who = inv.name || 'Uma pessoa';
  const ok = await confirmDialog({
    title: `${who} convidou você 💼`,
    text: `Para participar da agenda de trabalho compartilhada de ${who}. Você continua com a sua agenda e o seu modo Pessoal, e troca entre elas quando quiser. Você não paga nada por isso.`,
    ok: 'Entrar na agenda',
  });
  clearInvite();
  if (!ok) return false;
  const me = store.member(store.me) || {};
  try {
    await store.backendApi.joinTeam(inv.owner, inv.code, { name: me.name || 'Convidado', color: me.color || '#2563EB' });
  } catch (e) {
    console.warn('convite', e);
    toast(/permission/i.test(String(e.code || e.message)) ? 'Não deu para entrar: o link foi trocado, a agenda está cheia ou o plano de quem convidou não está ativo. Peça um novo convite.' : 'Não consegui entrar agora. Verifique a internet e abra o link de novo.', { ms: 8000 });
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
      if (active && !(await store.backendApi.getInvite(uid))) await store.backendApi.setInvite(uid, code());
    }
  } catch (e) { console.warn('equipe', e); }
  if (unwatch) return;
  unwatch = store.backendApi.watchTeam(uid, (t) => {
    teamDoc = t;
    const mine = store.member(store.me) || soloMember(store.user, store.profile || {});
    const people = t && t.active && (t.members || []).length ? teamPeople(t, uid, mine) : [mine];
    const sig = people.map((p) => p.id + p.name).join('|');
    if (sig !== store.team.map((p) => p.id + p.name).join('|')) { store.team = people; store.emit(); }
    // o servidor confere as vagas pagas e libera os avisos para os convidados
    const syncSig = JSON.stringify([t?.active, t?.members, t?.names]);
    if (t && server() && syncSig !== lastSync) {
      lastSync = syncSig;
      api('/share/sync', { ownerName: t.ownerName || '', members: (t.members || []).map((m) => ({ uid: m, name: t.names?.[m]?.name || 'Convidado' })) }).catch((e) => console.warn('share/sync', e.message));
    }
  });
}

/* ---------- tela "Agenda compartilhada" ---------- */
async function inviteLink() {
  const uid = store.user.uid;
  const inv = await store.backendApi.getInvite(uid);
  if (!inv) return '';
  const me = store.member(store.me) || {};
  return `${location.origin}${location.pathname}#/convite/${uid}.${inv.code}.${encodeURIComponent((me.name || '').split(' ')[0])}`;
}

export function openShare() {
  let link = null, busy = '';
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
    const people = t ? (t.members || []).map((uid) => ({ uid, name: t.names?.[uid]?.name || 'Convidado' })) : [];
    const seats = active ? ADDONS[addon.plan].seats : 0;
    const ownerPart = active ? `<div class="share__plan">${icon('crown', 18)}<div><b>Plano ${esc(ADDONS[addon.plan].name)} ativo</b><small>${people.length} de ${seats} ${seats > 1 ? 'vagas usadas' : 'vaga usada'} · R$ ${ADDONS[addon.plan].price}/mês${addon.cancelAt ? ` · cancelado, vale até ${new Date(addon.cancelAt).toLocaleDateString('pt-BR')}` : ''}</small></div></div>
      <section class="block">
        <h2 class="block__title">${icon('link', 16)} Convite</h2>
        <div class="card">
          <p>Mande este link para quem vai participar. A pessoa cria o login dela (ou entra) e já cai na sua agenda de trabalho.</p>
          <div class="share__link"><input readonly value="${esc(link || 'Gerando…')}" data-link></div>
          <div class="btnrow"><button class="btn btn--primary btn--sm" data-send ${link ? '' : 'disabled'}>${icon('share', 16)} Enviar convite</button><button class="btn btn--soft btn--sm" data-copy ${link ? '' : 'disabled'}>${icon('copy', 16)} Copiar</button></div>
          <button class="btn-text btn-text--sm" data-renew>Trocar o link (o antigo para de funcionar)</button>
        </div>
      </section>
      <section class="block">
        <h2 class="block__title">${icon('users', 16)} Quem participa</h2>
        <div class="list">
          <div class="list__row">${avatar(store.me, 30)}<span><b>${esc(store.member(store.me)?.name || 'Você')}</b> <small>dono</small></span></div>
          ${people.map((p) => `<div class="list__row">${avatar(idOf(p.uid), 30)}<span>${esc(p.name)}</span><button class="btn-text btn-text--danger btn-text--sm" data-remove="${esc(p.uid)}">Remover</button></div>`).join('')}
          ${Array.from({ length: Math.max(0, seats - people.length) }, () => `<div class="list__row muted">${icon('plus', 18)}<span>Vaga livre</span></div>`).join('')}
        </div>
        <p class="fhelp">Cada pessoa vê a agenda de trabalho, marca compromissos e recebe os avisos do que é dela. O modo Pessoal de cada um continua privado.</p>
      </section>
      <button class="btn btn--soft btn--block" data-portal>Gerenciar assinatura</button>`
      : `<div class="share__hero">${icon('share2', 30)}<h2>Divida sua agenda de trabalho</h2><p>Sócio, equipe, secretária, colega de plantão: cada pessoa com o próprio login, vendo a mesma agenda e recebendo os avisos do que é dela.</p></div>
      <div class="plans plans--light">
        ${Object.entries(ADDONS).map(([k, a]) => `<button class="plan${k === 'equipe' ? ' plan--best' : ''}" data-addon="${k}">${k === 'equipe' ? '<span class="plan__tag">Mais vantajoso</span>' : ''}<span class="plan__name">${a.name}</span><span class="plan__price"><b>R$ ${a.price}</b>/mês</span><span class="plan__note">${a.line}<br>${a.each}</span></button>`).join('')}
      </div>
      <div class="share__note">${icon('alert', 16)}<div><b>Complemento à parte, por mês.</b> Não está incluso no plano Mensal nem no Vitalício. Quem você convidar <b>não paga nada</b> enquanto o complemento estiver ativo. Cancele quando quiser.</div></div>
      ${!paidBase ? `<p class="fhelp">Para contratar, primeiro escolha seu plano (Mensal ou Vitalício).</p><button class="btn btn--primary btn--block" data-base>Escolher meu plano</button>` : ''}
      <p class="share__err" data-err hidden></p>`;
    return `${sheetHead('Agenda compartilhada')}<div class="page page--sheet">${ownerPart}${guestPart}</div>`;
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
          const r = await api('/billing/checkout', { plan: x.dataset.addon, returnUrl: location.href });
          if (!r.url) throw new Error(r.error || 'sem endereço');
          markBuying(x.dataset.addon);
          location.href = r.url;
        } catch (e) { x.classList.remove('is-busy'); if (err) { err.textContent = e.message || 'Não consegui abrir o pagamento agora.'; err.hidden = false; } }
      }));
      const base = el.querySelector('[data-base]');
      if (base) base.onclick = () => openPlans();
      const portal = el.querySelector('[data-portal]');
      if (portal) portal.onclick = () => openPortal().catch((e) => toast(e.message || 'Não consegui abrir agora'));
      const send = el.querySelector('[data-send]');
      if (send) send.onclick = async () => {
        const me = store.member(store.me) || {};
        const text = `${me.name || 'Eu'} te convidou para a agenda de trabalho no Lembra. Toque para entrar:`;
        if (navigator.share) { try { await navigator.share({ title: 'Convite · Lembra', text, url: link }); return; } catch { /* cancelou */ } }
        location.href = `https://wa.me/?text=${encodeURIComponent(`${text} ${link}`)}`;
      };
      const copy = el.querySelector('[data-copy]');
      if (copy) copy.onclick = async () => { try { await navigator.clipboard.writeText(link); toast('Link copiado ✓'); } catch { el.querySelector('[data-link]').select(); } };
      const renew = el.querySelector('[data-renew]');
      if (renew) renew.onclick = async () => {
        if (!(await confirmDialog({ title: 'Trocar o link do convite?', text: 'O link antigo para de funcionar. Quem já entrou continua na agenda.', ok: 'Trocar' }))) return;
        await store.backendApi.setInvite(store.user.uid, code());
        link = await inviteLink();
        a.set(html());
      };
      el.querySelectorAll('[data-remove]').forEach((x) => (x.onclick = async () => {
        const name = teamDoc?.names?.[x.dataset.remove]?.name || 'essa pessoa';
        if (!(await confirmDialog({ title: `Remover ${name}?`, text: 'A pessoa deixa de ver a sua agenda de trabalho. O que ela já marcou continua na agenda.', ok: 'Remover', danger: true }))) return;
        try { await store.backendApi.leaveTeam(store.user.uid, x.dataset.remove); toast('Removido'); } catch { toast('Não consegui remover agora.'); }
        setTimeout(() => a.set(html()), 600);
      }));
    },
  });
  if (!store.shared && store.billing?.addon?.active) inviteLink().then((l) => { link = l; api2.set(html()); }).catch(() => {});
  return api2;
}
