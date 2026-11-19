/* Plano da conta no app: teste grátis de 24h, tela de planos (mensal / vitalício) e confirmação do pagamento.
   A dupla Henrique + Matheus não paga. Quem verifica e libera é o servidor (Stripe). */
import { store } from './store.js';
import { server, api } from './avisos.js';
import { icon } from './icons.js';
import { esc } from './utils.js';

const LS_DEV = 'lembra.device', LS_LAST = 'lembra.plan';
export function deviceId() {
  try {
    let id = localStorage.getItem(LS_DEV);
    if (!id) { id = (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2)); localStorage.setItem(LS_DEV, id); }
    return id;
  } catch { return ''; }
}
const saveLast = (st) => { try { localStorage.setItem(LS_LAST, JSON.stringify({ ...st, at: Date.now(), ws: store.workspace })); } catch { /* ok */ } };
const lastKnown = () => { try { const j = JSON.parse(localStorage.getItem(LS_LAST) || 'null'); return j && j.ws === store.workspace ? j : null; } catch { return null; } };

/* Situação do plano (começa o teste no 1º acesso) */
export async function checkBilling() {
  if (!store.solo || store.mode !== 'cloud' || !server()) return (store.billing = { plan: 'team', active: true });
  try {
    let st = await api('/billing/status', {});
    if (st.plan === 'none') st = await api('/billing/trial', { deviceId: deviceId() });
    store.billing = st;
    saveLast(st);
  } catch (e) {
    // sem conexão com o servidor: usa a última situação conhecida (não trava quem já pagou)
    store.billing = lastKnown() || { plan: 'unknown', active: true };
  }
  return store.billing;
}

export const fmtLeft = (ms) => {
  if (ms <= 0) return '0 min';
  const h = Math.floor(ms / 3600e3), m = Math.floor((ms % 3600e3) / 60e3);
  return h ? `${h}h ${String(m).padStart(2, '0')}min` : `${m} min`;
};

/* Faixa do teste grátis (vai no topo das telas) */
export function trialBanner() {
  const b = store.billing;
  if (!b || b.plan !== 'trial') return '';
  const left = b.trialEndsAt - Date.now();
  return `<button class="trialbar${left < 3 * 3600e3 ? ' is-ending' : ''}" data-action="plans">
    <span class="trialbar__ic">${icon('clock', 16)}</span>
    <span><b>Teste grátis: ${esc(fmtLeft(left))}</b><small>Depois, R$ 9,90/mês ou R$ 150 para sempre</small></span>
    <span class="trialbar__go">Assinar</span>
  </button>`;
}

/* Tela de planos. blocking = o teste acabou (não dá para fechar) */
export function openPlans({ blocking = false } = {}) {
  document.querySelector('.paywall')?.remove();
  const b = store.billing || {};
  const title = !blocking ? 'Escolha seu plano'
    : b.plan === 'blocked' ? 'O teste grátis já foi usado neste aparelho'
      : 'Seu teste grátis terminou';
  const sub = !blocking ? 'Continue usando tudo do Lembra, sem limites.'
    : b.plan === 'blocked' ? 'Para usar o Lembra com esta conta, escolha um plano abaixo.'
      : 'Gostou? Escolha um plano para continuar usando tudo: suas empresas, lembretes, assistente e o modo Pessoal.';
  const w = document.createElement('div');
  w.className = 'paywall';
  w.innerHTML = `<div class="paywall__inner">
    <img class="paywall__logo" src="media/lembra-logo.jpg" alt="Lembra" width="96" height="96">
    <h1>${esc(title)}</h1>
    <p>${esc(sub)}</p>
    <div class="plans">
      <button class="plan" data-plan="mensal">
        <span class="plan__name">Mensal</span>
        <span class="plan__price"><b>R$ 9,90</b>/mês</span>
        <span class="plan__note">Cancele quando quiser</span>
      </button>
      <button class="plan plan--best" data-plan="vitalicio">
        <span class="plan__tag">Melhor valor</span>
        <span class="plan__name">Vitalício</span>
        <span class="plan__price"><b>R$ 150</b> uma vez</span>
        <span class="plan__note">Para sempre, sem mensalidade</span>
      </button>
    </div>
    <ul class="paywall__list">
      <li>${icon('check', 15)} Agenda de trabalho com empresas, posts e captações</li>
      <li>${icon('check', 15)} Modo Pessoal: aniversários, compromissos e listas</li>
      <li>${icon('check', 15)} Notificações, lembretes e mensagens de ânimo</li>
      <li>${icon('check', 15)} Assistente que organiza a agenda por você</li>
    </ul>
    <p class="paywall__safe">${icon('lock', 13)} Pagamento seguro pela Stripe (cartão de crédito).</p>
    <p class="paywall__err" data-err hidden></p>
    <div class="paywall__foot">
      <button class="btn-text btn-text--sm" data-paid>Já paguei — verificar</button>
      ${blocking ? '<button class="btn-text btn-text--sm" data-action="logout">Sair da conta</button>' : '<button class="btn-text btn-text--sm" data-pclose>Agora não</button>'}
    </div>
  </div>`;
  document.body.appendChild(w);
  requestAnimationFrame(() => w.classList.add('is-open'));
  const err = w.querySelector('[data-err]');
  w.querySelectorAll('[data-plan]').forEach((btn) => (btn.onclick = async () => {
    err.hidden = true;
    btn.classList.add('is-busy');
    try {
      const r = await api('/billing/checkout', { plan: btn.dataset.plan, returnUrl: location.href });
      if (!r.url) throw new Error(r.error || 'sem endereço');
      location.href = r.url; // página de pagamento da Stripe
    } catch (e) {
      err.textContent = e.message || 'Não consegui abrir o pagamento agora. Tente de novo.';
      err.hidden = false;
      btn.classList.remove('is-busy');
    }
  }));
  const close = w.querySelector('[data-pclose]');
  if (close) close.onclick = () => { w.classList.remove('is-open'); setTimeout(() => w.remove(), 250); };
  w.querySelector('[data-paid]').onclick = () => confirmPayment();
  return w;
}

/* Voltou da Stripe: confere até liberar (o aviso da Stripe chega em segundos) */
export async function confirmPayment() {
  document.querySelector('.paywall')?.remove();
  const w = document.createElement('div');
  w.className = 'paywall is-open';
  w.innerHTML = `<div class="paywall__inner"><img class="paywall__logo" src="media/lembra-logo.jpg" alt="" width="96" height="96"><h1>Confirmando seu pagamento…</h1><p>Leva só alguns segundos.</p><div class="spinner"></div></div>`;
  document.body.appendChild(w);
  for (let i = 0; i < 20; i++) {
    const st = await checkBilling();
    if (st.plan === 'lifetime' || st.plan === 'monthly') {
      w.querySelector('.paywall__inner').innerHTML = `<img class="paywall__logo" src="media/lembra-logo.jpg" alt="" width="96" height="96"><h1>Pagamento confirmado! 🎉</h1><p>${st.plan === 'lifetime' ? 'Seu Lembra é vitalício. Obrigado!' : 'Sua assinatura mensal está ativa. Obrigado!'}</p><button class="btn btn--primary btn--block" data-go>Começar a usar</button>`;
      w.querySelector('[data-go]').onclick = () => { w.remove(); window.__calRender && window.__calRender(); };
      return true;
    }
    await new Promise((r) => setTimeout(r, 3000));
  }
  w.remove();
  openPlans({ blocking: !(store.billing && store.billing.active) });
  const e = document.querySelector('.paywall [data-err]');
  if (e) { e.textContent = 'Ainda não recebemos a confirmação. Se você pagou, espere 1 minuto e toque em “Já paguei — verificar”.'; e.hidden = false; }
  return false;
}

/* Abre o portal da Stripe (cancelar assinatura, trocar cartão) */
export async function openPortal() {
  const r = await api('/billing/portal', { returnUrl: location.href });
  if (r.url) location.href = r.url;
}
