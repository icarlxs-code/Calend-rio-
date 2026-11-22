/* Plano da conta no app: teste grátis de 24h, tela de planos (mensal / vitalício) e confirmação do pagamento.
   A dupla Henrique + Matheus não paga. Quem verifica e libera é o servidor (Stripe). */
import { store } from './store.js';
import { server, api } from './avisos.js';
import { icon } from './icons.js';
import { brand } from './brand.js';
import { esc } from './utils.js';
import { vipBanner } from './vip.js';

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
  if (b && b.plan === 'lifetime' && b.vip) return vipBanner();
  // anual pago no Pix: faltando 10 dias ou menos, lembra de renovar (o Pix não renova sozinho)
  if (b && b.plan === 'monthly' && b.prepaid && b.paidUntil && b.paidUntil - Date.now() < 10 * 864e5) {
    const d = Math.max(0, Math.ceil((b.paidUntil - Date.now()) / 864e5));
    return `<button class="trialbar${d <= 3 ? ' is-ending' : ''}" data-action="plans">
      <span class="trialbar__ic">${icon('clock', 16)}</span>
      <span><b>${d ? `Seu plano no Pix vence em ${d} ${d === 1 ? 'dia' : 'dias'}` : 'Seu plano no Pix vence hoje'}</b><small>Renove no Pix ou no cartão para não parar os lembretes</small></span>
      <span class="trialbar__go">Renovar</span>
    </button>`;
  }
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
  // anual no Pix: paga uma vez, vale 12 meses (o Pix não renova sozinho)
  essencial_ano_pix: { tier: 'essencial', name: 'Essencial', price: 'R$ 9,99', per: '/mês', note: 'R$ 119,90 no Pix, vale 12 meses', cta: 'Pagar com Pix · R$ 119,90 (12 meses)' },
  pro_ano_pix: { tier: 'pro', name: 'Profissional', price: 'R$ 14,99', per: '/mês', note: 'R$ 179,90 no Pix, vale 12 meses', cta: 'Pagar com Pix · R$ 179,90 (12 meses)' },
};
/* quanto custa por dia e o preço "cheio" (mensal × 12) para comparar */
const PER_DAY = { essencial_mes: 'R$ 0,43', essencial_ano: 'R$ 0,33', pro_mes: 'R$ 0,66', pro_ano: 'R$ 0,49' };
const ANCHOR = { essencial_ano: 'R$ 12,90', pro_ano: 'R$ 19,90' };
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
  const prepaid = b.plan === 'monthly' && !!b.prepaid; // pagou 12 meses no Pix: pode renovar o mesmo plano
  const isMonthly = b.plan === 'monthly' && !prepaid;
  const founders = (b.foundersLeft ?? 200) > 0 && b.plan !== 'lifetime';
  const title = prepaid ? 'Renove seu plano' : offline ? 'Não consegui conferir seu plano'
    : canTrial ? 'Experimente o Lembra grátis por 7 dias'
      : isMonthly ? 'Mude de plano quando quiser'
        : !blocking ? 'Escolha seu plano'
          : b.plan === 'blocked' ? (b.reason === 'cpf' ? 'Este CPF já usou o teste grátis' : b.reason === 'rede' ? 'O teste grátis já foi usado nesta conexão' : 'O teste grátis já foi usado neste aparelho')
            : 'Seu teste grátis terminou';
  const sub = prepaid ? `Seu plano está pago até ${new Date(b.paidUntil).toLocaleDateString('pt-BR')}. Renovando agora no Pix, os 12 meses novos somam ao que falta — você não perde nenhum dia.`
    : offline ? 'Verifique a internet e toque em “Tentar de novo”. Assim que conectar, tudo volta ao normal.'
    : canTrial ? 'Tudo liberado, sem cartão e sem compromisso. Nunca mais esqueça um compromisso — depois, escolha o plano que preferir.'
      : isMonthly ? 'Para trocar entre Essencial e Profissional ou entre mensal e anual, use “Gerenciar assinatura” em Ajustes. Virar Fundador cancela a assinatura na hora, sem cobrança dupla.'
        : !blocking ? 'Continue com tudo liberado, sem limites.'
          : b.plan === 'blocked' ? 'O teste grátis é um por pessoa. Para usar o Lembra com esta conta, escolha um plano abaixo.'
            : 'Sua agenda, seus lembretes e o seu modo Pessoal estão guardados, esperando você. Escolha um plano e continue de onde parou.';
  let yearly = true, chosen = prepaid && b.tier === 'essencial' ? 'essencial_ano' : 'pro_ano', pm = prepaid ? 'pix' : 'card';
  // o que vai para o pagamento: no anual com Pix, o plano de 12 meses no Pix
  const finalPlan = () => (pm === 'pix' && /_ano$/.test(chosen) ? `${chosen}_pix` : chosen);
  const tick = (on) => (on ? `<span class="cmp__yes">${icon('check', 15)}</span>` : '<span class="cmp__no">—</span>');
  const w = document.createElement('div');
  w.className = 'paywall';
  w.innerHTML = `<div class="paywall__inner">
    <div class="brandwrap">${brand('completa', { h: 96, on: 'dark' })}</div>
    <h1>${esc(title)}</h1>
    <p>${esc(sub)}</p>
    ${!offline && !prepaid && !isMonthly ? `<ul class="pw-why">
      <li><span style="--c:#34C759">${icon('bell', 16)}</span><b>Nunca mais esqueça um compromisso</b><small>O Lembra avisa na hora certa, mesmo com o celular fechado</small></li>
      <li><span style="--c:#A06BFF">${icon('sparkles', 16)}</span><b>Um assistente que organiza por você</b><small>Fala o que precisa e ele marca, move e cobra</small></li>
      <li><span style="--c:#FF9F0A">${icon('heart', 16)}</span><b>Sua vida pessoal também em dia</b><small>Aniversários, contas, saúde e listas no mesmo lugar</small></li>
    </ul>` : ''}
    ${offline ? `<button class="btn btn--primary btn--block" data-retry>${icon('refresh', 18)} Tentar de novo</button>` : ''}
    ${canTrial ? `<button class="btn btn--trial btn--block" data-trial>${icon('sparkles', 18)} Começar meu teste grátis de 7 dias</button><p class="paywall__or">ou escolha seu plano</p>` : ''}
    <div class="period" role="tablist"><button data-period="mes" role="tab">Mensal</button><button data-period="ano" role="tab" class="is-on">Anual <span>-25%</span></button></div>
    <div class="plans" role="radiogroup" aria-label="Planos" data-plans></div>
    <div class="paymeth" data-paymeth role="radiogroup" aria-label="Forma de pagamento"></div>
    ${founders ? `<button class="plan plan--founder" data-plan="fundador" role="radio" aria-checked="false"><span class="plan__tag">Só ${b.foundersLeft ?? 200} vagas</span><span class="plan__radio" aria-hidden="true">${icon('check', 13)}</span><span class="plan__name">${icon('crown', 14)} Fundadores</span><span class="plan__price"><b>R$ 199</b> uma única vez</span><span class="plan__note">O Profissional para sempre, sem mensalidade. Só para as primeiras 200 contas.</span></button>` : ''}
    <div class="cmp" aria-label="O que vem em cada plano">
      <div class="cmp__row cmp__row--head"><span>O que vem</span><span>Essencial</span><span>Pro</span></div>
      ${COMPARE.map(([t, m, v]) => `<div class="cmp__row"><span>${esc(t)}</span>${tick(m)}${tick(v)}</div>`).join('')}
    </div>
    <div class="pw-guar"><span class="pw-guar__seal">${icon('shield', 22)}<b>7</b></span><div><b>Garantia de 7 dias</b><small>Não gostou? Devolvemos 100% do valor, sem perguntas.</small></div></div>
    <div class="pw-team">
      <div class="pw-team__top"><span class="pw-team__faces"><i style="--c:#7C5CFF">A</i><i style="--c:#0E9F6E">B</i><i style="--c:#D9480F">C</i><i class="pw-team__plus">+</i></span><span class="pw-team__tag">Para quem trabalha com alguém</span></div>
      <h3>Sócio, equipe ou secretária esquecendo as coisas?</h3>
      <p>Coloque todo mundo <b>na mesma agenda</b>. Você marca “Reunião com cliente · Ana” e <b>a Ana recebe o aviso no celular dela</b>, na hora certa.</p>
      <ul>
        <li>${icon('check', 14)} Cada pessoa com o próprio login (ninguém usa a sua senha)</li>
        <li>${icon('check', 14)} Cada um recebe só o aviso do que é dele</li>
        <li>${icon('check', 14)} Placar da semana: você vê quem cumpre o que marca</li>
        <li>${icon('check', 14)} <b>Quem você convidar não paga nada</b></li>
      </ul>
      <div class="pw-team__prices"><div><small>Você + 1 pessoa</small><b>R$ 7,90</b><small>/mês</small></div><div class="is-best"><small>Você + até 4 pessoas</small><b>R$ 29,90</b><small>/mês · R$ 7,48 por pessoa</small></div></div>
      <small class="pw-team__how">${icon('info', 12)} É um complemento: assine seu plano agora e ative a equipe depois em Ajustes → Agenda compartilhada.${founders ? ' Fundadores pagam menos (R$ 4,90 e R$ 19,90).' : ''}</small>
    </div>
    <p class="paywall__err" data-err hidden></p>
    <p class="pw-fine">${icon('lock', 11)} Pagamento seguro pela Stripe. Cartão de crédito (renova sozinho até você cancelar) ou Pix no anual e no Fundadores (vale 12 meses, sem renovação automática). Cancele quando quiser em Ajustes → Gerenciar assinatura. Reembolso integral em até 7 dias. Preços em reais, com impostos.</p>
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
      ${p.tier === 'pro' ? `<span class="plan__tag">${yearly ? 'Melhor escolha' : 'Mais escolhido'}</span>` : cur ? '<span class="plan__tag plan__tag--cur">Seu plano</span>' : ''}
      <span class="plan__radio" aria-hidden="true">${icon('check', 13)}</span>
      <span class="plan__name">${p.name}</span>
      ${ANCHOR[k] ? `<span class="plan__was"><s>${ANCHOR[k]}</s> no mensal</span>` : ''}
      <span class="plan__price"><b>${p.price}</b>${p.per}</span>
      ${PER_DAY[k] ? `<span class="plan__day">${p.tier === 'pro' ? icon('sparkles', 12) + ' ' : ''}Só ${PER_DAY[k]} por dia</span>` : ''}
      <span class="plan__note">${p.note}</span>
      ${yearly ? `<span class="plan__save">${p.tier === 'pro' ? 'Economize R$ 58,90 por ano' : 'Economize R$ 34,90 por ano'}</span>` : ''}
    </button>`; };
  const paint = () => {
    box.innerHTML = [yearly ? 'essencial_ano' : 'essencial_mes', yearly ? 'pro_ano' : 'pro_mes'].map(card).join('');
    w.querySelectorAll('[data-period]').forEach((x) => x.classList.toggle('is-on', (x.dataset.period === 'ano') === yearly));
    w.querySelectorAll('[data-plan]').forEach((btn) => { const on = btn.dataset.plan === chosen; btn.classList.toggle('is-on', on); btn.setAttribute('aria-checked', String(on)); });
    const pmBox = w.querySelector('[data-paymeth]');
    pmBox.innerHTML = chosen === 'fundador'
      ? `<p class="paymeth__note">${icon('info', 14)} No Fundadores você escolhe <b>cartão ou Pix</b> na página de pagamento.</p>`
      : yearly ? `<span class="paymeth__k">Como prefere pagar o anual?</span>
        <button class="paymeth__b${pm === 'card' ? ' is-on' : ''}" data-pm="card" role="radio" aria-checked="${pm === 'card'}">${icon('card', 18)}<span><b>Cartão de crédito</b><small>Renova sozinho todo ano</small></span></button>
        <button class="paymeth__b${pm === 'pix' ? ' is-on' : ''}" data-pm="pix" role="radio" aria-checked="${pm === 'pix'}"><span class="paymeth__pix">PIX</span><span><b>Pix</b><small>Paga uma vez, vale 12 meses</small></span></button>`
        : `<p class="paymeth__note">${icon('info', 14)} No mensal o pagamento é no cartão. Prefere Pix? Escolha o <b>Anual</b>.</p>`;
    buy.textContent = PLAN_INFO[finalPlan()].cta;
  };
  w.addEventListener('click', (e) => {
    const per = e.target.closest('[data-period]');
    if (per) { yearly = per.dataset.period === 'ano'; if (chosen !== 'fundador') chosen = chosen.replace(/_(mes|ano)$/, yearly ? '_ano' : '_mes'); paint(); return; }
    const pmb = e.target.closest('[data-pm]');
    if (pmb) { pm = pmb.dataset.pm; paint(); if (navigator.vibrate) navigator.vibrate(6); return; }
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
      const plan = finalPlan();
      const r = await api('/billing/checkout', { plan, returnUrl: location.href });
      if (!r.url) throw new Error(r.error || 'sem endereço');
      markBuying(plan);
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
      w.querySelector('.paywall__inner').innerHTML = `<div class="brandwrap">${brand('simbolo', { h: 64, on: 'dark' })}</div><h1>Pagamento confirmado! 🎉</h1><p>${st.plan === 'lifetime' ? (st.founder ? 'Bem-vindo aos Fundadores: o Profissional é seu para sempre. Obrigado!' : 'Seu Lembra é vitalício. Obrigado!') : (st.prepaid ? `Seu ${st.tier === 'essencial' ? 'Essencial' : 'Profissional'} está pago até ${new Date(st.paidUntil).toLocaleDateString('pt-BR')} (12 meses no Pix). Obrigado!` : `Seu plano ${st.tier === 'essencial' ? 'Essencial' : 'Profissional'} ${st.interval === 'year' ? 'anual' : 'mensal'} está ativo. Obrigado!`)}</p><button class="btn btn--primary btn--block" data-go>Começar a usar</button>`;
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
