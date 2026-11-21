/* Plano da conta no app: teste grátis de 24h, tela de planos (mensal / vitalício) e confirmação do pagamento.
   A dupla Henrique + Matheus não paga. Quem verifica e libera é o servidor (Stripe). */
import { store } from './store.js';
import { server, api } from './avisos.js';
import { icon } from './icons.js';
import { brand } from './brand.js';
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
/* Última situação conhecida NESTE aparelho e desta conta — só vale se o plano ainda estiver dentro do prazo */
const stillValid = (b, now = Date.now()) => !!b && !!b.active && (
  b.plan === 'lifetime' || b.plan === 'team'
  || (b.plan === 'trial' && b.trialEndsAt > now)
  || (b.plan === 'comp' && b.compUntil > now)
  || (b.plan === 'monthly' && (!b.paidUntil || b.paidUntil + 3 * 864e5 > now) && now - (b.at || 0) < 35 * 864e5)
  || (b.plan === 'shared' && now - (b.at || 0) < 3 * 864e5));
export const lastKnown = () => { try { const j = JSON.parse(localStorage.getItem(LS_LAST) || 'null'); return j && j.ws === store.workspace && stillValid(j) ? j : null; } catch { return null; } };

/* A conta pode usar o app agora? (conta própria sem plano ativo: tudo travado) */
export function hasAccess() {
  if (!store.solo || store.mode !== 'cloud') return true;
  const b = store.billing;
  if (!b || !b.active) return false;
  if (b.plan === 'trial' && !(b.trialEndsAt > Date.now())) return false;
  if (b.plan === 'comp' && !(b.compUntil > Date.now())) return false;
  return true;
}
/* Tentou mexer sem plano: não deixa e mostra os planos */
let lastNag = 0;
export function requireAccess() {
  if (hasAccess()) return true;
  if (Date.now() - lastNag > 800) {
    lastNag = Date.now();
    if (!document.querySelector('.paywall')) openPlans({ blocking: true });
  }
  return false;
}

/* Situação do plano (começa o teste no 1º acesso) */
export async function checkBilling() {
  if (!store.solo || store.mode !== 'cloud') return (store.billing = { plan: 'team', active: true });
  if (!server()) return (store.billing = { plan: 'offline', active: false });
  try {
    // o teste grátis NÃO começa sozinho: a pessoa escolhe começar (botão na tela de planos)
    const st = await api('/billing/status', {});
    store.billing = st;
    saveLast(st);
  } catch (e) {
    // sem conexão com o servidor: usa a última situação conhecida, se ainda estiver no prazo (não trava quem já pagou).
    // Sem nenhuma confirmação: fica travado até conseguir conferir (nunca libera "no escuro").
    store.billing = lastKnown() || { plan: 'offline', active: false };
  }
  return store.billing;
}

export const fmtLeft = (ms) => {
  if (ms <= 0) return '0 min';
  if (ms >= 48 * 3600e3) { const d = Math.floor(ms / 864e5), hh = Math.floor((ms % 864e5) / 3600e3); return `${d} dias${hh ? ` e ${hh}h` : ''}`; }
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
    <span><b>Teste grátis: ${esc(fmtLeft(left))}</b><small>Depois, a partir de R$ 9,99/mês no plano anual</small></span>
    <span class="trialbar__go">Assinar</span>
  </button>`;
}

/* Começa o teste grátis (só quando a pessoa toca no botão) */
export async function startTrialNow() {
  const st = await api('/billing/trial', { deviceId: deviceId(), cpf: store.profile?.cpf || '' });
  store.billing = st;
  saveLast(st);
  return st;
}

/* Tela de planos. blocking = sem plano ativo (não dá para fechar: o app fica bloqueado até começar o teste ou assinar).
   Tocar num plano só ESCOLHE; o pagamento abre no botão "Continuar". */
const PLAN_INFO = {
  essencial_mes: { tier: 'essencial', name: 'Essencial', price: 'R$ 12,90', per: '/mês', note: 'Cobrança mensal', cta: 'Assinar o Essencial · R$ 12,90/mês' },
  essencial_ano: { tier: 'essencial', name: 'Essencial', price: 'R$ 9,99', per: '/mês', note: 'R$ 119,90 por ano', cta: 'Assinar o Essencial · R$ 119,90/ano' },
  pro_mes: { tier: 'pro', name: 'Profissional', price: 'R$ 19,90', per: '/mês', note: 'Cobrança mensal', cta: 'Assinar o Profissional · R$ 19,90/mês' },
  pro_ano: { tier: 'pro', name: 'Profissional', price: 'R$ 14,99', per: '/mês', note: 'R$ 179,90 por ano', cta: 'Assinar o Profissional · R$ 179,90/ano' },
  fundador: { tier: 'pro', name: 'Fundadores', price: 'R$ 199', per: ' uma vez', note: 'Profissional para sempre', cta: 'Garantir minha vaga de Fundador · R$ 199' },
};
const COMPARE = [
  ['Agenda com a cara da sua profissão', true, true],
  ['Modo Pessoal: aniversários, contas e listas', true, true],
  ['Avisos calculados para o seu ritmo', true, true],
  ['Mensagens de ânimo e lembretes de cuidado', true, true],
  ['Assistente com IA que organiza a agenda por você', false, true],
  ['Cobrança de atraso: o app insiste até você resolver', false, true],
  ['Ranking semanal com prêmios (meses grátis)', false, true],
];
/* plano com tudo (Profissional): teste, vitalício, cortesia, equipe e quem assina o Profissional */
export const hasPro = () => { const b = store.billing || {}; return !store.solo || ['team', 'trial', 'lifetime', 'comp', 'shared'].includes(b.plan) || (b.plan === 'monthly' && b.tier !== 'essencial'); };
export function openPlans({ blocking = false } = {}) {
  document.querySelector('.paywall')?.remove();
  const b = store.billing || {};
  const canTrial = b.plan === 'none';
  const offline = b.plan === 'offline';
  const isMonthly = b.plan === 'monthly';
  const founders = (b.foundersLeft ?? 200) > 0 && b.plan !== 'lifetime';
  const title = offline ? 'Não consegui conferir seu plano'
    : canTrial ? 'Experimente o Lembra grátis por 7 dias'
      : isMonthly ? 'Mude de plano quando quiser'
        : !blocking ? 'Escolha seu plano'
          : b.plan === 'blocked' ? (b.reason === 'cpf' ? 'Este CPF já usou o teste grátis' : b.reason === 'rede' ? 'O teste grátis já foi usado nesta conexão' : 'O teste grátis já foi usado neste aparelho')
            : 'Seu teste grátis terminou';
  const sub = offline ? 'Verifique a internet e toque em “Tentar de novo”. Assim que conectar, tudo volta ao normal.'
    : canTrial ? 'Tudo liberado, sem cartão e sem compromisso. Nunca mais esqueça um compromisso — depois, escolha o plano que preferir.'
      : isMonthly ? 'Para trocar entre Essencial e Profissional ou entre mensal e anual, use “Gerenciar assinatura” em Ajustes. Virar Fundador cancela a assinatura na hora, sem cobrança dupla.'
        : !blocking ? 'Continue com tudo liberado, sem limites.'
          : b.plan === 'blocked' ? 'O teste grátis é um por pessoa. Para usar o Lembra com esta conta, escolha um plano abaixo.'
            : 'Sua agenda, seus lembretes e o seu modo Pessoal estão guardados, esperando você. Escolha um plano e continue de onde parou.';
  let yearly = true, chosen = 'pro_ano';
  const tick = (on) => (on ? `<span class="cmp__yes">${icon('check', 15)}</span>` : '<span class="cmp__no">—</span>');
  const w = document.createElement('div');
  w.className = 'paywall';
  w.innerHTML = `<div class="paywall__inner">
    <div class="brandwrap">${brand('completa', { h: 96, on: 'dark' })}</div>
    <h1>${esc(title)}</h1>
    <p>${esc(sub)}</p>
    ${offline ? `<button class="btn btn--primary btn--block" data-retry>${icon('refresh', 18)} Tentar de novo</button>` : ''}
    ${canTrial ? `<button class="btn btn--trial btn--block" data-trial>${icon('sparkles', 18)} Começar meu teste grátis de 7 dias</button><p class="paywall__or">ou escolha seu plano</p>` : ''}
    <div class="period" role="tablist"><button data-period="mes" role="tab">Mensal</button><button data-period="ano" role="tab" class="is-on">Anual <span>-25%</span></button></div>
    <div class="plans" role="radiogroup" aria-label="Planos" data-plans></div>
    ${founders ? `<button class="plan plan--founder" data-plan="fundador" role="radio" aria-checked="false"><span class="plan__tag">Só ${b.foundersLeft ?? 200} vagas</span><span class="plan__radio" aria-hidden="true">${icon('check', 13)}</span><span class="plan__name">${icon('crown', 14)} Fundadores</span><span class="plan__price"><b>R$ 199</b> uma única vez</span><span class="plan__note">O Profissional para sempre, sem mensalidade. Só para as primeiras 200 contas.</span></button>` : ''}
    <div class="cmp" aria-label="O que vem em cada plano">
      <div class="cmp__row cmp__row--head"><span>O que vem</span><span>Essencial</span><span>Pro</span></div>
      ${COMPARE.map(([t, m, v]) => `<div class="cmp__row"><span>${esc(t)}</span>${tick(m)}${tick(v)}</div>`).join('')}
      <div class="cmp__row cmp__row--addon"><span>${icon('users', 14)} Agenda compartilhada com sócio ou equipe</span><span class="cmp__price">à parte<br><b>R$&nbsp;7,90</b><br>por pessoa</span><span class="cmp__price">à parte<br><b>R$&nbsp;7,90</b><br>por pessoa</span></div>
    </div>
    <p class="paywall__addon">${icon('info', 14)}<span><b>Compartilhar a agenda é um complemento à parte</b>, cobrado por pessoa: +1 pessoa R$ 7,90/mês ou +4 pessoas R$ 29,90/mês (Fundadores pagam R$ 4,90 e R$ 19,90). Quem você convidar não paga nada.</span></p>
    <p class="paywall__safe">${icon('lock', 13)} Pagamento seguro pela Stripe, com cartão de crédito. Cancele quando quiser. Arrependeu? Devolvemos em até 7 dias.</p>
    <p class="paywall__err" data-err hidden></p>
    <div class="paywall__foot">
      <button class="btn-text btn-text--sm" data-paid>Já paguei — verificar</button>
      ${blocking ? '<button class="btn-text btn-text--sm" data-pclose>Só olhar o app</button><button class="btn-text btn-text--sm" data-action="logout">Sair da conta</button>' : '<button class="btn-text btn-text--sm" data-pclose>Agora não</button>'}
    </div>
    <div class="paywall__cta"><button class="btn btn--primary btn--block btn--big${canTrial ? ' btn--alt' : ''}" data-buy>${esc(PLAN_INFO[chosen].cta)}</button></div>
  </div>`;
  document.body.appendChild(w);
  requestAnimationFrame(() => w.classList.add('is-open'));
  const err = w.querySelector('[data-err]');
  const buy = w.querySelector('[data-buy]');
  // tocar no plano só marca a escolha (não abre o pagamento); Mensal/Anual troca os preços
  const box = w.querySelector('[data-plans]');
  const card = (k) => { const p = PLAN_INFO[k]; const cur = isMonthly && b.tier === p.tier;
    return `<button class="plan${p.tier === 'pro' ? ' plan--best' : ''}${k === chosen ? ' is-on' : ''}" data-plan="${k}" role="radio" aria-checked="${k === chosen}"${cur ? ' disabled' : ''}>
      ${p.tier === 'pro' ? '<span class="plan__tag">Mais escolhido</span>' : cur ? '<span class="plan__tag plan__tag--cur">Seu plano</span>' : ''}
      <span class="plan__radio" aria-hidden="true">${icon('check', 13)}</span>
      <span class="plan__name">${p.name}</span>
      <span class="plan__price"><b>${p.price}</b>${p.per}</span>
      <span class="plan__note">${p.note}</span>
      ${yearly ? `<span class="plan__save">${p.tier === 'pro' ? 'Economize R$ 58,90 por ano' : 'Economize R$ 34,90 por ano'}</span>` : ''}
    </button>`; };
  const paint = () => {
    box.innerHTML = [yearly ? 'essencial_ano' : 'essencial_mes', yearly ? 'pro_ano' : 'pro_mes'].map(card).join('');
    w.querySelectorAll('[data-period]').forEach((x) => x.classList.toggle('is-on', (x.dataset.period === 'ano') === yearly));
    w.querySelectorAll('[data-plan]').forEach((btn) => { const on = btn.dataset.plan === chosen; btn.classList.toggle('is-on', on); btn.setAttribute('aria-checked', String(on)); });
    buy.textContent = PLAN_INFO[chosen].cta;
  };
  w.addEventListener('click', (e) => {
    const per = e.target.closest('[data-period]');
    if (per) { yearly = per.dataset.period === 'ano'; if (chosen !== 'fundador') chosen = chosen.replace(/_(mes|ano)$/, yearly ? '_ano' : '_mes'); paint(); return; }
    const btn = e.target.closest('[data-plan]');
    if (!btn || btn.disabled) return;
    chosen = btn.dataset.plan; err.hidden = true; paint();
    if (navigator.vibrate) navigator.vibrate(6);
  });
  paint();
  buy.onclick = async () => {
    err.hidden = true;
    buy.disabled = true; buy.classList.add('is-busy');
    const label = buy.textContent;
    buy.textContent = 'Abrindo o pagamento seguro…';
    try {
      const r = await api('/billing/checkout', { plan: chosen, returnUrl: location.href });
      if (!r.url) throw new Error(r.error || 'sem endereço');
      markBuying(chosen);
      location.href = r.url; // página de pagamento da Stripe
    } catch (e) {
      err.textContent = /[a-z]{3,} [a-z]{3,} [a-z]{3,}/.test(e.message || '') && !/[ãçéêóõíá]/.test(e.message || '') ? 'O pagamento está temporariamente indisponível. Tente de novo em alguns minutos.' : e.message || 'Não consegui abrir o pagamento agora. Tente de novo.';
      err.hidden = false;
      buy.disabled = false; buy.classList.remove('is-busy'); buy.textContent = label;
      err.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  };
  const close = w.querySelector('[data-pclose]');
  if (close) close.onclick = () => { w.classList.remove('is-open'); setTimeout(() => w.remove(), 250); };
  w.querySelector('[data-paid]').onclick = () => confirmPayment({ manual: true });
  const retry = w.querySelector('[data-retry]');
  if (retry) retry.onclick = async () => {
    retry.disabled = true;
    const st = await checkBilling();
    if (st.active) { w.classList.remove('is-open'); setTimeout(() => w.remove(), 250); window.__calRender && window.__calRender(); return; }
    openPlans({ blocking: true });
  };
  const tb = w.querySelector('[data-trial]');
  if (tb) tb.onclick = async () => {
    tb.disabled = true; tb.textContent = 'Liberando…';
    try {
      const st = await startTrialNow();
      if (st.active) {
        w.classList.remove('is-open'); setTimeout(() => w.remove(), 250);
        window.__calRender && window.__calRender();
        window.dispatchEvent(new Event('lembra:trial'));
        return;
      }
      openPlans({ blocking: true }); // teste já usado (CPF, aparelho ou conexão): mostra o motivo
    } catch (e) {
      tb.disabled = false; tb.innerHTML = `${icon('sparkles', 18)} Começar meu teste grátis de 7 dias`;
      err.textContent = 'Não consegui liberar agora. Verifique a internet e tente de novo.'; err.hidden = false;
    }
  };
  return w;
}

/* O que a pessoa foi pagar (para saber o que conferir na volta da Stripe) */
export const markBuying = (plan) => { try { localStorage.setItem('lembra.buying', JSON.stringify({ plan, at: Date.now() })); } catch { /* ok */ } };
/* compra em andamento (vale por 2 horas: depois disso a pessoa desistiu) */
export const buying = () => {
  try { const j = JSON.parse(localStorage.getItem('lembra.buying') || 'null'); return j && Date.now() - j.at < 2 * 3600e3 ? j.plan : ''; } catch { return ''; }
};
export const clearBuying = () => { try { localStorage.removeItem('lembra.buying'); } catch { /* ok */ } };

/* Voltou da Stripe: confere até liberar (o aviso da Stripe chega em segundos) */
export async function confirmPayment({ quiet = false, manual = false } = {}) {
  const what = buying();
  // voltou ao app sem ter certeza se pagou: confere em silêncio; só aparece se confirmou
  if (quiet) {
    for (let i = 0; i < 4; i++) {
      const st = await checkBilling();
      const done = what === 'dupla' || what === 'equipe' ? st.addon && st.addon.active : st.plan === 'lifetime' || st.plan === 'monthly';
      if (done || st.pending) return confirmPayment();
      await new Promise((r) => setTimeout(r, 3000));
    }
    return false;
  }
  clearBuying();
  if (what === 'dupla' || what === 'equipe') return confirmAddon(what);
  document.querySelector('.paywall')?.remove();
  const w = document.createElement('div');
  w.className = 'paywall is-open';
  w.innerHTML = `<div class="paywall__inner"><div class="brandwrap">${brand('simbolo', { h: 64, on: 'dark' })}</div><h1>Confirmando seu pagamento…</h1><p>Leva só alguns segundos.</p><div class="spinner"></div></div>`;
  document.body.appendChild(w);
  for (let i = 0, n = manual ? 3 : 15; i < n; i++) {
    const st = await checkBilling();
    // Pix ou boleto: a Stripe confirma depois (Pix em minutos, boleto em até 3 dias úteis)
    if (st.pending && st.plan !== 'lifetime') {
      w.querySelector('.paywall__inner').innerHTML = `<div class="brandwrap">${brand('simbolo', { h: 64, on: 'dark' })}</div><h1>Pagamento em processamento</h1><p>Pagou com Pix ou boleto? Assim que o banco confirmar (Pix em alguns minutos, boleto em até 3 dias úteis), tudo é liberado sozinho. Você recebe o recibo por e-mail.</p><button class="btn btn--primary btn--block" data-go>Entendi</button>`;
      w.querySelector('[data-go]').onclick = () => { w.remove(); if (!st.active) openPlans({ blocking: true }); };
      return false;
    }
    if (st.plan === 'lifetime' || st.plan === 'monthly') {
      w.querySelector('.paywall__inner').innerHTML = `<div class="brandwrap">${brand('simbolo', { h: 64, on: 'dark' })}</div><h1>Pagamento confirmado! 🎉</h1><p>${st.plan === 'lifetime' ? (st.founder ? 'Bem-vindo aos Fundadores: o Profissional é seu para sempre. Obrigado!' : 'Seu Lembra é vitalício. Obrigado!') : `Seu plano ${st.tier === 'essencial' ? 'Essencial' : 'Profissional'} ${st.interval === 'year' ? 'anual' : 'mensal'} está ativo. Obrigado!`}</p><button class="btn btn--primary btn--block" data-go>Começar a usar</button>`;
      w.querySelector('[data-go]').onclick = () => { w.remove(); window.__calRender && window.__calRender(); };
      return true;
    }
    await new Promise((r) => setTimeout(r, 2000));
  }
  w.remove();
  openPlans({ blocking: !(store.billing && store.billing.active) });
  const e = document.querySelector('.paywall [data-err]');
  if (e) { e.textContent = manual ? 'Não encontramos pagamento nesta conta ainda. Se você acabou de pagar, espere 1 minuto e toque de novo.' : 'Ainda não recebemos a confirmação. Se você pagou, espere 1 minuto e toque em “Já paguei — verificar”.'; e.hidden = false; }
  return false;
}

/* Abre o portal da Stripe (cancelar assinatura, trocar cartão) */
export async function openPortal() {
  const r = await api('/billing/portal', { returnUrl: location.href });
  if (r.url) location.href = r.url;
}

/* Voltou da Stripe depois de contratar a agenda compartilhada */
async function confirmAddon(plan) {
  const w = document.createElement('div');
  w.className = 'paywall is-open';
  w.innerHTML = `<div class="paywall__inner"><div class="brandwrap">${brand('simbolo', { h: 64, on: 'dark' })}</div><h1>Ativando a agenda compartilhada…</h1><p>Leva só alguns segundos.</p><div class="spinner"></div></div>`;
  document.body.appendChild(w);
  for (let i = 0; i < 20; i++) {
    const st = await checkBilling();
    if (st.addon && st.addon.active) {
      const { startTeam, openShare } = await import('./equipe.js');
      await startTeam();
      w.querySelector('.paywall__inner').innerHTML = `<div class="brandwrap">${brand('simbolo', { h: 64, on: 'dark' })}</div><h1>Agenda compartilhada ativa! 🎉</h1><p>Plano ${plan === 'equipe' ? 'Equipe: você + até 4 pessoas' : 'Dupla: você + 1 pessoa'}. Agora mande o convite para quem vai participar.</p><button class="btn btn--primary btn--block" data-go>Convidar agora</button>`;
      w.querySelector('[data-go]').onclick = () => { w.remove(); window.__calRender && window.__calRender(); openShare(); };
      return true;
    }
    await new Promise((r) => setTimeout(r, 3000));
  }
  w.remove();
  const { openShare } = await import('./equipe.js');
  openShare();
  setTimeout(() => { const e = document.querySelector('[data-err]'); if (e) { e.textContent = 'Ainda não recebemos a confirmação da Stripe. Se você pagou, espere 1 minuto e abra esta tela de novo.'; e.hidden = false; } }, 400);
  return false;
}
