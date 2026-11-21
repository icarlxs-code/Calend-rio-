/* Presente "Lembra Vitalício": quando o dono libera o acesso para sempre, a pessoa vê, uma vez, uma revelação
   no preto e branco da marca (o símbolo acende → o cartão de membro com o nome dela e um número único →
   o emblema lendário → pedido para ligar os avisos). Depois, o cartão fica guardado nos Ajustes. */
import { store } from './store.js';
import { esc } from './utils.js';
import { icon } from './icons.js';
import * as push from './avisos.js';
import { levelUp, softOk } from './sound.js';

const LS = 'lembra.vip.seen';
export const vipOf = () => (store.billing && store.billing.plan === 'lifetime' && store.billing.vip) || null;
export const vipSeen = () => { const v = vipOf(); if (!v) return false; if (Number(store.profile?.vipSeen) === v.no) return true; try { return localStorage.getItem(LS) === String(v.no); } catch { return false; } };
const markSeen = () => {
  const v = vipOf(); if (!v) return;
  try { localStorage.setItem(LS, String(v.no)); } catch { /* ok */ }
  // guardado na conta: em outro celular, reinstalando ou saindo e entrando, não aparece de novo
  import('./store.js').then((m) => m.saveProfileQuiet && m.saveProfileQuiet({ vipSeen: v.no })).catch(() => {});
};
export const memberNo = (n) => `Nº ${String(n || 0).padStart(3, '0')}`;
export const notifOk = () => push.permission() === 'granted' && push.deviceRegistered();

// nome completo da ficha no cartão; no texto, o apelido (como o app chama a pessoa)
const myName = () => String(store.profile?.name || store.member(store.me)?.name || '').trim().slice(0, 40);
const first = () => String(store.profile?.nickname || store.member(store.me)?.name || myName()).trim().split(/\s+/)[0] || '';
const busy = () => !!document.querySelector('.sheet-wrap.is-open, .paywall.is-open, .photogate, .ficha, .ob, .guide, .termsgate, .gx, .vip');

/* chamada ao abrir o app: mostra a revelação uma vez (espera as outras telas fecharem) */
export function maybeShowVip({ force = false } = {}) {
  if (!vipOf() || (!force && vipSeen())) return;
  let n = 0;
  const go = () => { if (busy()) { if (++n < 40) setTimeout(go, 1500); return; } openVipReveal(); };
  setTimeout(go, force ? 300 : 900);
}

/* faixa no topo (no lugar da faixa do teste): avisos desligados → pede para ligar; nos 7 primeiros dias → o cartão */
export function vipBanner() {
  const v = vipOf();
  if (!v) return '';
  if (store.mode === 'cloud' && push.pushSupported() && !notifOk()) {
    return `<button class="trialbar vipbar" data-action="notify-enable">
      <span class="trialbar__ic">${icon('bell', 16)}</span>
      <span><b>Seus avisos estão desligados</b><small>Sem eles, o Lembra não consegue te lembrar na hora certa</small></span>
      <span class="trialbar__go">Ativar</span>
    </button>`;
  }
  return ''; // a faixa "Lembra Vitalício" não fica repetindo: o cartão está nos Ajustes
}

function cardHtml(v) {
  return `<div class="vcard" data-vcard>
    <div class="vcard__in">
      <span class="vcard__word" aria-label="Lembra"></span><span class="vcard__tier">VITALÍCIO</span>
      <span class="vcard__sym" aria-hidden="true"></span>
      <div class="vcard__nm">${esc(myName() || 'Membro')}</div>
      <div class="vcard__no">MEMBRO ${memberNo(v.no)}</div><div class="vcard__ed">DESDE ${new Date(v.at || Date.now()).getFullYear()}</div>
      <i class="vcard__sheen"></i>
    </div>
  </div>`;
}

/* o cartão gira com o dedo (como o emblema em detalhe) */
function tilt(el) {
  const c = el.querySelector('[data-vcard]');
  if (!c) return;
  const set = (x, y) => { c.style.setProperty('--rx', `${(10 - y * 22).toFixed(1)}deg`); c.style.setProperty('--ry', `${(-14 + x * 28).toFixed(1)}deg`); };
  c.addEventListener('pointermove', (e) => { const r = c.getBoundingClientRect(); set((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height); });
  c.addEventListener('pointerleave', () => { c.style.removeProperty('--rx'); c.style.removeProperty('--ry'); });
}

/* a revelação completa (ou só o cartão, quando a pessoa abre de novo pelos Ajustes) */
export async function openVipReveal({ cardOnly = false } = {}) {
  const v = vipOf();
  if (!v || document.querySelector('.vip')) return;
  const { badgeById, badgeArt } = await import('./badges.js'); // só carrega as medalhas quando precisa
  if (document.querySelector('.vip')) return;
  const total = Math.max(v.total || v.no || 1, v.no || 1);
  const askNotif = !cardOnly && store.mode === 'cloud' && push.pushSupported() && !notifOk();
  const denied = push.permission() === 'denied';
  const b = badgeById('vitalicio');
  const dust = Array.from({ length: 28 }, (_, i) => {
    const x = ((Math.sin(i * 12.99) * 43758.5) % 1 + 1) % 1, y = ((Math.sin(i * 78.23) * 12345.6) % 1 + 1) % 1;
    return `<i style="left:${(x * 100).toFixed(1)}%;top:${(4 + y * 60).toFixed(1)}%;--d:${(i % 7) * 0.6}s;--s:${1 + (i % 3)}px"></i>`;
  }).join('');
  const el = document.createElement('div');
  el.className = 'vip';
  el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', 'Lembra Vitalício');
  el.innerHTML = `<div class="vip__glow"></div><div class="vip__dust">${dust}</div>
    ${cardOnly ? '<button class="vip__x" data-vclose aria-label="Fechar">' + icon('x', 20) + '</button>' : `
    <section class="vip__s vip__intro" data-step="intro">
      <span class="vip__halo"></span><span class="vip__sym" aria-hidden="true"></span>
      ${first() ? `<div class="vip__nm">${esc(first().toUpperCase())}</div>` : ''}
      <div class="vip__ln">Isto não acontece<br>com quase ninguém.</div>
      <div class="vip__tap">TOQUE PARA CONTINUAR</div>
    </section>`}
    <section class="vip__s vip__rv" data-step="card">
      <div class="vip__kick">LEMBRA VITALÍCIO</div>
      <h1 class="vip__h1">${first() ? `<b>${esc(first())}.</b> ` : ''}Para sempre.</h1>
      ${cardHtml(v)}
      <div class="vip__rare">${total > 1 ? `<div class="vip__n">1 em ${total}</div><div class="vip__t">pessoas no mundo com o Lembra para sempre</div>` : '<div class="vip__n">A primeira</div><div class="vip__t">pessoa no mundo com o Lembra para sempre</div>'}</div>
      <p class="vip__p">Sem mensalidade. Sem prazo. Sem fim.<br>Tudo liberado, hoje e sempre.</p>
      ${cardOnly ? '' : '<button class="vip__btn" data-next>Continuar</button>'}
    </section>
    ${cardOnly ? '' : `<section class="vip__s vip__md" data-step="medal">
      <div class="vip__kick">NOVO EMBLEMA</div>
      <div class="vip__medal">${b ? badgeArt(b, 220) : ''}</div>
      <h2 class="vip__h2">Vitalício</h2>
      <div class="vip__rar">LENDÁRIO · O MAIS RARO DO LEMBRA</div>
      <ul class="vip__list">
        <li><span>${icon('infinity', 18)}</span><div><b>Tudo do Profissional</b><small>Para sempre, sem pagar nada</small></div></li>
        <li><span>${icon('user', 18)}</span><div><b>Anel Vitalício na sua foto</b><small>Quem divide a agenda com você vê</small></div></li>
        <li><span>#</span><div><b>Membro ${memberNo(v.no)}</b><small>Seu número nunca vai se repetir</small></div></li>
      </ul>
      <p class="vip__terms">Presente de cortesia do Lembra, nas regras dos <a href="termos/" target="_blank" rel="noopener">Termos de Uso</a>.</p>
      <button class="vip__btn" data-next>${askNotif ? 'Continuar' : 'Entrar no Lembra'}</button>
    </section>`}
    ${askNotif ? `<section class="vip__s vip__nf" data-step="notif">
      <div class="vip__sheet">
        <div class="vip__bell"><span class="vip__sym vip__sym--sm" aria-hidden="true"></span></div>
        <h3>Um último detalhe${first() ? `, ${esc(first())}` : ''}.</h3>
        <p>${denied ? 'Os avisos estão bloqueados neste celular. Para o Lembra te lembrar na hora certa, ative em <b>Ajustes do iPhone → Notificações → Lembra</b> (no Android: segure o ícone → Informações do app → Notificações).' : push.needsInstall() ? 'Para receber os avisos, instale o Lembra na Tela de Início: no Safari, toque em <b>Compartilhar</b> → <b>Adicionar à Tela de Início</b>.' : 'Ative os avisos para o Lembra cuidar dos seus compromissos na hora certa. Você escolhe o que recebe nos Ajustes.'}</p>
        ${denied || push.needsInstall() ? '<button class="vip__btn" data-vclose>Entendi</button>' : '<button class="vip__btn" data-enable>Ativar avisos</button><button class="vip__later" data-vclose>Agora não</button>'}
      </div>
    </section>` : ''}`;
  document.body.appendChild(el);
  if (askNotif) window.__vipAskedNotif = true; // a própria revelação já pede os avisos: não pede de novo agora
  document.documentElement.classList.add('has-vip');
  const steps = [...el.querySelectorAll('[data-step]')];
  let i = -1;
  const close = () => {
    el.classList.add('is-out');
    document.documentElement.classList.remove('has-vip');
    setTimeout(() => el.remove(), 450);
    store.emit && store.emit();
  };
  const show = (k) => {
    if (k >= steps.length) return close();
    steps.forEach((s, j) => s.classList.toggle('is-on', j === k));
    i = k;
    const name = steps[k].dataset.step;
    if (name === 'intro') { try { softOk(); } catch { /* ok */ } setTimeout(() => i === k && show(k + 1), 6500); }
    if (name === 'card') {
      try { levelUp(); } catch { /* ok */ }
      // o emblema entra na coleção sem a comemoração de sempre (esta já é a comemoração)
      if (!cardOnly) { markSeen(); import('./game.js').then((gm) => gm.quietSettle && gm.quietSettle()).catch(() => {}); }
    }
  };
  steps.forEach((s) => {
    if (s.dataset.step === 'intro') s.addEventListener('click', () => i === steps.indexOf(s) && show(i + 1));
  });
  el.querySelectorAll('[data-next]').forEach((b2) => (b2.onclick = () => show(i + 1)));
  el.querySelectorAll('[data-vclose]').forEach((b2) => (b2.onclick = close));
  const en = el.querySelector('[data-enable]');
  if (en) en.onclick = async () => {
    en.disabled = true;
    const { settingsActions } = await import('./views/settings.js');
    await settingsActions.notifyEnable();
    close();
  };
  tilt(el);
  requestAnimationFrame(() => { el.classList.add('is-in'); show(0); });
  return el;
}
