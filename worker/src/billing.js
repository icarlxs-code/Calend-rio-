/* Cobrança do Lembra (Stripe) + teste grátis de 24h.
   - Planos: mensal R$ 9,90 (assinatura) e vitalício R$ 150 (pagamento único).
   - Teste: 24h a partir do 1º acesso. Um teste por aparelho e por rede (IP) — quem já testou
     não ganha outro criando conta nova.
   - A dupla Henrique + Matheus (equipe do app) não paga.
   Chaves (segredos do Worker, configurados no painel da Cloudflare):
     STRIPE_SECRET_KEY (sk_live_... ou sk_test_...) e STRIPE_WEBHOOK_SECRET (whsec_...). */

export const TRIAL_MS = 24 * 3600e3;
export const PLANS = {
  mensal: { name: 'Lembra mensal', amount: 990, mode: 'subscription' },
  vitalicio: { name: 'Lembra vitalício', amount: 15000, mode: 'payment' },
};
const IP_WINDOW = 30 * 864e5; // a mesma rede só ganha um teste a cada 30 dias

async function sha(text) {
  const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, '0')).join('').slice(0, 32);
}
const getBill = async (env, uid) => (await env.CAL.get(`bill:${uid}`, 'json')) || null;
const putBill = (env, uid, b) => env.CAL.put(`bill:${uid}`, JSON.stringify(b));

/* Situação da conta: team | lifetime | monthly | trial | expired | blocked | none */
export function statusOf(b, me, now = Date.now()) {
  if (me.ws === 'main') return { plan: 'team', active: true };
  if (!b) return { plan: 'none', active: false };
  if (b.lifetime) return { plan: 'lifetime', active: true };
  if (b.subActive && (!b.paidUntil || b.paidUntil > now - 3 * 864e5)) return { plan: 'monthly', active: true, paidUntil: b.paidUntil || null, cancelAt: b.cancelAt || null };
  if (b.trialEndsAt && b.trialEndsAt > now) return { plan: 'trial', active: true, trialEndsAt: b.trialEndsAt };
  if (b.trialDenied) return { plan: 'blocked', active: false, reason: b.trialDenied };
  return { plan: 'expired', active: false, trialEndsAt: b.trialEndsAt || null };
}

/* 1º acesso: começa o teste — se este aparelho/rede ainda não testou */
export async function startTrial(env, me, { deviceId, ip, now = Date.now() }) {
  if (me.ws === 'main') return statusOf(null, me, now);
  const uid = me.ws;
  let b = await getBill(env, uid);
  if (b && (b.trialEndsAt || b.trialDenied || b.lifetime || b.subActive)) return statusOf(b, me, now);
  const dev = deviceId ? await sha('dev:' + deviceId) : null;
  const net = ip ? await sha('ip:' + ip) : null;
  const [usedDev, usedNet] = await Promise.all([dev ? env.CAL.get(`trial-dev:${dev}`, 'json') : null, net ? env.CAL.get(`trial-ip:${net}`, 'json') : null]);
  const otherDev = usedDev && usedDev.uid !== uid;
  const otherNet = usedNet && usedNet.uid !== uid && now - usedNet.at < IP_WINDOW;
  b = { ...(b || {}), uid, email: me.email, createdAt: now };
  if (otherDev || otherNet) {
    b.trialDenied = otherDev ? 'aparelho' : 'rede';
  } else {
    b.trialStartedAt = now;
    b.trialEndsAt = now + TRIAL_MS;
    const mark = JSON.stringify({ uid, at: now });
    await Promise.all([dev && env.CAL.put(`trial-dev:${dev}`, mark), net && env.CAL.put(`trial-ip:${net}`, mark, { expirationTtl: IP_WINDOW / 1000 })].filter(Boolean));
  }
  await putBill(env, uid, b);
  return statusOf(b, me, now);
}

export async function billingStatus(env, me) {
  return statusOf(me.ws === 'main' ? null : await getBill(env, me.ws), me);
}

/* ---------- Stripe ---------- */
const form = (obj, prefix = '', out = new URLSearchParams()) => {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}[${k}]` : k;
    if (v && typeof v === 'object') form(v, key, out);
    else if (v !== undefined && v !== null) out.append(key, String(v));
  }
  return out;
};
async function stripe(env, path, params, fetchImpl = fetch) {
  if (!env.STRIPE_SECRET_KEY) throw Object.assign(new Error('O pagamento ainda não foi configurado (falta a chave da Stripe no servidor).'), { status: 412 });
  const r = await fetchImpl(`https://api.stripe.com/v1/${path}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form(params).toString(),
  });
  const j = await r.json();
  if (!r.ok) throw Object.assign(new Error(j?.error?.message || 'A Stripe recusou o pedido.'), { status: 502 });
  return j;
}

/* Cria a página de pagamento da Stripe e devolve o endereço */
export async function createCheckout(env, me, { plan, returnUrl }, fetchImpl = fetch) {
  const p = PLANS[plan];
  if (!p) throw Object.assign(new Error('Plano inválido.'), { status: 400 });
  if (me.ws === 'main') throw Object.assign(new Error('A sua conta já é liberada.'), { status: 400 });
  const back = /^https:\/\/|^http:\/\/(localhost|127\.0\.0\.1)/.test(returnUrl || '') ? returnUrl.split('#')[0] : 'https://icarlxs-code.github.io/Calend-rio-/';
  const b = (await getBill(env, me.ws)) || {};
  const price = { currency: 'brl', unit_amount: p.amount, product_data: { name: p.name } };
  if (p.mode === 'subscription') price.recurring = { interval: 'month' };
  const params = {
    mode: p.mode,
    client_reference_id: me.ws,
    success_url: `${back}#/pago`,
    cancel_url: `${back}#/planos`,
    locale: 'pt-BR',
    allow_promotion_codes: 'true',
    line_items: { 0: { quantity: 1, price_data: price } },
    metadata: { uid: me.ws, plan },
  };
  if (b.customer) params.customer = b.customer; else params.customer_email = me.email;
  if (p.mode === 'subscription') params.subscription_data = { metadata: { uid: me.ws } };
  else params.payment_intent_data = { metadata: { uid: me.ws, plan } };
  const s = await stripe(env, 'checkout/sessions', params, fetchImpl);
  return { url: s.url };
}

/* Portal da Stripe: cancelar assinatura, trocar cartão */
export async function createPortal(env, me, { returnUrl }, fetchImpl = fetch) {
  const b = await getBill(env, me.ws);
  if (!b || !b.customer) throw Object.assign(new Error('Não encontrei uma assinatura nesta conta.'), { status: 404 });
  const s = await stripe(env, 'billing_portal/sessions', { customer: b.customer, return_url: (returnUrl || '').split('#')[0] || 'https://icarlxs-code.github.io/Calend-rio-/' }, fetchImpl);
  return { url: s.url };
}

/* Confere a assinatura do aviso da Stripe (HMAC-SHA256, tolerância de 5 min) */
export async function verifyStripe(env, payload, header, now = Date.now()) {
  if (!env.STRIPE_WEBHOOK_SECRET) throw new Error('sem segredo do webhook');
  const parts = Object.fromEntries(String(header || '').split(',').map((p) => p.split('=')));
  const t = Number(parts.t);
  if (!t || Math.abs(now / 1000 - t) > 300) throw new Error('aviso velho ou sem data');
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(env.STRIPE_WEBHOOK_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${t}.${payload}`));
  const hex = [...new Uint8Array(sig)].map((x) => x.toString(16).padStart(2, '0')).join('');
  const given = String(header).split(',').filter((p) => p.startsWith('v1=')).map((p) => p.slice(3));
  if (!given.includes(hex)) throw new Error('assinatura inválida');
  return JSON.parse(payload);
}

/* Avisos da Stripe: pagamento confirmado, renovação, cancelamento */
export async function handleStripeEvent(env, ev) {
  const o = ev?.data?.object || {};
  const now = Date.now();
  if (ev.type === 'checkout.session.completed') {
    const uid = o.client_reference_id || o.metadata?.uid;
    if (!uid) return;
    const b = (await getBill(env, uid)) || { uid };
    b.customer = o.customer || b.customer;
    if (o.mode === 'payment' && o.payment_status === 'paid') { b.lifetime = true; b.lifetimeAt = now; }
    if (o.mode === 'subscription') { b.subActive = true; b.subscription = o.subscription; b.paidUntil = now + 32 * 864e5; }
    b.updatedAt = now;
    if (b.customer) await env.CAL.put(`cust:${b.customer}`, uid);
    await putBill(env, uid, b);
    return;
  }
  if (ev.type === 'customer.subscription.updated' || ev.type === 'customer.subscription.deleted' || ev.type === 'customer.subscription.created') {
    const uid = o.metadata?.uid || (o.customer && (await env.CAL.get(`cust:${o.customer}`)));
    if (!uid) return;
    const b = (await getBill(env, uid)) || { uid };
    b.customer = o.customer || b.customer;
    b.subscription = o.id;
    b.subActive = ev.type !== 'customer.subscription.deleted' && ['active', 'trialing', 'past_due'].includes(o.status);
    if (o.current_period_end) b.paidUntil = o.current_period_end * 1000;
    b.cancelAt = o.cancel_at ? o.cancel_at * 1000 : null;
    b.updatedAt = now;
    await putBill(env, uid, b);
    return;
  }
  if (ev.type === 'invoice.paid' && o.customer) {
    const uid = await env.CAL.get(`cust:${o.customer}`);
    if (!uid) return;
    const b = (await getBill(env, uid)) || { uid };
    b.subActive = true;
    const end = o.lines?.data?.[0]?.period?.end;
    b.paidUntil = end ? end * 1000 : now + 32 * 864e5;
    await putBill(env, uid, b);
  }
}

/* Para o Painel do dono: situação de cada conta */
export async function billingAll(env) {
  const reg = (await env.CAL.get('users', 'json')) || {};
  const out = {};
  await Promise.all(Object.values(reg).map(async (u) => {
    const b = await getBill(env, u.ws);
    out[u.ws] = statusOf(b, { ws: u.ws });
  }));
  return out;
}
