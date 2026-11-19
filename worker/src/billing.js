/* Cobrança do Lembra (Stripe) + teste grátis de 24h.
   - Planos: mensal R$ 9,90 (assinatura) e vitalício R$ 150 (pagamento único).
   - Complemento mensal, à parte: Agenda compartilhada Dupla R$ 6,90 (+1 pessoa) ou Equipe R$ 14,90 (+4).
     Exige o plano base pago; quem entra pelo convite fica coberto pelo plano do dono.
   - Teste: 24h a partir do 1º acesso. Um teste por aparelho e por rede (IP) — quem já testou
     não ganha outro criando conta nova.
   - A dupla Henrique + Matheus (equipe do app) não paga.
   Chaves (segredos do Worker, configurados no painel da Cloudflare):
     STRIPE_SECRET_KEY (sk_live_... ou sk_test_...) e STRIPE_WEBHOOK_SECRET (whsec_...). */

export const TRIAL_MS = 24 * 3600e3;
export const PLANS = {
  mensal: { name: 'Lembra mensal', amount: 990, mode: 'subscription' },
  vitalicio: { name: 'Lembra vitalício', amount: 15000, mode: 'payment' },
  // Agenda compartilhada: complemento mensal, à parte (não vem no mensal nem no vitalício)
  dupla: { name: 'Lembra · Agenda compartilhada Dupla (você + 1 pessoa)', amount: 690, mode: 'subscription', addon: true, seats: 1 },
  equipe: { name: 'Lembra · Agenda compartilhada Equipe (você + até 4 pessoas)', amount: 1490, mode: 'subscription', addon: true, seats: 4 },
};
const isAddon = (plan) => !!PLANS[plan]?.addon;
const IP_WINDOW = 30 * 864e5; // a mesma rede só ganha um teste a cada 30 dias

async function sha(text) {
  const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, '0')).join('').slice(0, 32);
}
const getBill = async (env, uid) => (await env.CAL.get(`bill:${uid}`, 'json')) || null;
const putBill = (env, uid, b) => env.CAL.put(`bill:${uid}`, JSON.stringify(b));

/* Complemento "Agenda compartilhada" (Dupla/Equipe): ativo enquanto a assinatura dele estiver em dia */
export function addonOf(b, now = Date.now()) {
  const a = b && b.addon;
  if (!a || !PLANS[a.plan]) return null;
  const active = !!a.subActive && (!a.paidUntil || a.paidUntil > now - 3 * 864e5);
  return { plan: a.plan, seats: PLANS[a.plan].seats, active, paidUntil: a.paidUntil || null, cancelAt: a.cancelAt || null };
}
/* Plano base pago (mensal em dia ou vitalício): exigido para o complemento funcionar */
export const basePaid = (b, now = Date.now()) => !!b && (!!b.lifetime || (!!b.subActive && (!b.paidUntil || b.paidUntil > now - 3 * 864e5)));

/* Situação da conta: team | lifetime | monthly | trial | expired | blocked | none */
export function statusOf(b, me, now = Date.now()) {
  if (me.ws === 'main') return { plan: 'team', active: true };
  if (!b) return { plan: 'none', active: false };
  const addon = addonOf(b, now);
  const extra = addon ? { addon } : {};
  if (b.lifetime) return { plan: 'lifetime', active: true, ...extra };
  if (b.subActive && (!b.paidUntil || b.paidUntil > now - 3 * 864e5)) return { plan: 'monthly', active: true, paidUntil: b.paidUntil || null, cancelAt: b.cancelAt || null, ...extra };
  if (b.pending && now - b.pending.at < 4 * 864e5) extra.pending = b.pending.plan;
  if (b.trialEndsAt && b.trialEndsAt > now) return { plan: 'trial', active: true, trialEndsAt: b.trialEndsAt, ...extra };
  if (b.trialDenied) return { plan: 'blocked', active: false, reason: b.trialDenied, ...extra };
  return { plan: 'expired', active: false, trialEndsAt: b.trialEndsAt || null, ...extra };
}

/* ---------- Agenda compartilhada: quem está em qual equipe ----------
   team:{ownerUid} = { ownerUid, ownerId, ownerName, members:[{uid,id,name}], seats }
   member:{uid}    = ownerUid (a equipe em que a pessoa entrou) */
export async function teamActive(env, team, now = Date.now()) {
  if (!team || !team.ownerUid) return false;
  const b = await getBill(env, team.ownerUid);
  const a = addonOf(b, now);
  return !!(a && a.active && basePaid(b, now));
}
/* O dono manda a lista de quem entrou; o servidor corta no número de vagas pagas */
export async function syncTeam(env, me, members, now = Date.now(), ownerName = '') {
  if (me.ws === 'main') throw Object.assign(new Error('A dupla já compartilha a agenda.'), { status: 400 });
  const b = await getBill(env, me.ws);
  const a = addonOf(b, now);
  const active = !!(a && a.active && basePaid(b, now));
  const seats = active ? a.seats : 0;
  const prev = (await env.CAL.get(`team:${me.ws}`, 'json')) || { members: [] };
  const list = (Array.isArray(members) ? members : [])
    .filter((m) => m && /^[A-Za-z0-9]{6,64}$/.test(m.uid || '') && m.uid !== me.ws)
    .slice(0, seats)
    .map((m) => ({ uid: m.uid, id: 'u' + m.uid.slice(0, 24), name: String(m.name || 'Convidado').slice(0, 40) }));
  const team = { ownerUid: me.ws, ownerId: me.id, ownerName: String(ownerName || me.name || 'Dono').slice(0, 40), members: list, seats, active, updatedAt: now };
  await env.CAL.put(`team:${me.ws}`, JSON.stringify(team));
  const gone = (prev.members || []).filter((m) => !list.some((x) => x.uid === m.uid));
  await Promise.all([...list.map((m) => env.CAL.put(`member:${m.uid}`, me.ws)), ...gone.map((m) => env.CAL.delete(`member:${m.uid}`))]);
  return { active, seats, plan: a ? a.plan : null, members: list.length };
}
/* Equipe ativa de uma pessoa convidada (ou null) */
export async function sharedOf(env, uid, now = Date.now()) {
  const owner = await env.CAL.get(`member:${uid}`);
  if (!owner) return null;
  const team = await env.CAL.get(`team:${owner}`, 'json');
  if (!team || !(team.members || []).some((m) => m.uid === uid)) return null;
  return (await teamActive(env, team, now)) ? team : null;
}

/* 1º acesso: começa o teste — se este aparelho/rede ainda não testou */
/* CPF válido (dígitos verificadores) — o servidor confere de novo, não confia no app */
export function validCPF(raw) {
  const c = String(raw || '').replace(/\D/g, '');
  if (c.length !== 11 || /^(\d)\1{10}$/.test(c)) return false;
  const dv = (len) => { let sum = 0; for (let i = 0; i < len; i++) sum += +c[i] * (len + 1 - i); const r = (sum * 10) % 11; return r === 10 ? 0 : r; };
  return dv(9) === +c[9] && dv(10) === +c[10];
}

export async function startTrial(env, me, { deviceId, ip, cpf, now = Date.now() }) {
  if (me.ws === 'main') return statusOf(null, me, now);
  const uid = me.ws;
  let b = await getBill(env, uid);
  if (b && (b.trialEndsAt || b.trialDenied || b.lifetime || b.subActive)) return statusOf(b, me, now);
  const dev = deviceId ? await sha('dev:' + deviceId) : null;
  const net = ip ? await sha('ip:' + ip) : null;
  // CPF: guardado só embaralhado (com o segredo do servidor), um teste por pessoa
  const doc = validCPF(cpf) ? await sha(`cpf:${env.CPF_SALT || 'lembra'}:${String(cpf).replace(/\D/g, '')}`) : null;
  const [usedDev, usedNet, usedDoc] = await Promise.all([dev ? env.CAL.get(`trial-dev:${dev}`, 'json') : null, net ? env.CAL.get(`trial-ip:${net}`, 'json') : null, doc ? env.CAL.get(`trial-cpf:${doc}`, 'json') : null]);
  const otherDev = usedDev && usedDev.uid !== uid;
  const otherNet = usedNet && usedNet.uid !== uid && now - usedNet.at < IP_WINDOW;
  const otherDoc = usedDoc && usedDoc.uid !== uid;
  b = { ...(b || {}), uid, email: me.email, createdAt: now };
  if (otherDoc || otherDev || otherNet) {
    b.trialDenied = otherDoc ? 'cpf' : otherDev ? 'aparelho' : 'rede';
  } else {
    b.trialStartedAt = now;
    b.trialEndsAt = now + TRIAL_MS;
    const mark = JSON.stringify({ uid, at: now });
    await Promise.all([dev && env.CAL.put(`trial-dev:${dev}`, mark), net && env.CAL.put(`trial-ip:${net}`, mark, { expirationTtl: IP_WINDOW / 1000 }), doc && env.CAL.put(`trial-cpf:${doc}`, mark)].filter(Boolean));
  }
  await putBill(env, uid, b);
  return statusOf(b, me, now);
}

export async function billingStatus(env, me) {
  const st = statusOf(me.ws === 'main' ? null : await getBill(env, me.ws), me);
  if (me.ws === 'main' || st.plan === 'lifetime' || st.plan === 'monthly') return st;
  // convidado de uma agenda compartilhada ativa: o plano do dono cobre
  const team = await sharedOf(env, me.ws);
  if (team) return { plan: 'shared', active: true, owner: team.ownerUid, ownerName: team.ownerName, ...(st.addon ? { addon: st.addon } : {}) };
  return st;
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
async function stripe(env, path, params, fetchImpl = fetch, method = 'POST') {
  if (!env.STRIPE_SECRET_KEY) throw Object.assign(new Error('O pagamento ainda não foi configurado (falta a chave da Stripe no servidor).'), { status: 412 });
  const r = await fetchImpl(`https://api.stripe.com/v1/${path}`, {
    method,
    headers: { Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form(params).toString(),
  });
  const j = await r.json();
  if (!r.ok) throw Object.assign(new Error(j?.error?.message || 'A Stripe recusou o pedido.'), { status: 502 });
  return j;
}

/* Endereço do app para a volta do pagamento: só o site oficial ou um endereço autorizado (evita redirecionar para sites de fora) */
export function siteBase(env, returnUrl = '') {
  const official = (env.SITE_URL || 'https://icarlxs-code.github.io/Calend-rio-/').replace(/\/?$/, '/');
  let u;
  try { u = new URL(returnUrl); } catch { return official; }
  const allowed = (env.ALLOWED_ORIGINS || '').split(',').map((x) => x.trim()).filter(Boolean);
  const local = env.ALLOW_EMULATOR_TOKENS === '1' && /^(localhost|127\.0\.0\.1)$/.test(u.hostname);
  if (!local && !allowed.includes(u.origin) && !official.startsWith(u.origin)) return official;
  return `${u.origin}${u.pathname.replace(/[^/]*$/, '')}`;
}

/* Cria a página de pagamento da Stripe e devolve o endereço */
export async function createCheckout(env, me, { plan, returnUrl }, fetchImpl = fetch) {
  const p = PLANS[plan];
  if (!p) throw Object.assign(new Error('Plano inválido.'), { status: 400 });
  if (me.ws === 'main') throw Object.assign(new Error('A sua conta já é liberada.'), { status: 400 });
  const back = siteBase(env, returnUrl);
  const b = (await getBill(env, me.ws)) || {};
  if (p.addon) {
    if (!basePaid(b)) throw Object.assign(new Error('A agenda compartilhada é um complemento: primeiro assine o plano Mensal ou o Vitalício.'), { status: 409 });
    const cur = addonOf(b);
    if (cur && cur.active) throw Object.assign(new Error(cur.plan === plan ? 'Você já tem esse plano ativo.' : 'Você já tem a agenda compartilhada. Para trocar de plano, cancele em “Gerenciar assinatura” e assine o outro.'), { status: 409 });
  }
  const price = { currency: 'brl', unit_amount: p.amount, product_data: { name: p.name } };
  if (p.mode === 'subscription') price.recurring = { interval: 'month' };
  const params = {
    mode: p.mode,
    client_reference_id: me.ws,
    // volta da Stripe: página oficial "Pagamento recebido" (funciona em qualquer navegador, inclusive no iPhone)
    success_url: `${back}pago/?p=${plan}`,
    cancel_url: `${back}#/planos`,
    locale: 'pt-BR',
    allow_promotion_codes: 'true',
    line_items: { 0: { quantity: 1, price_data: price } },
    metadata: { uid: me.ws, plan },
  };
  if (b.customer) params.customer = b.customer; else params.customer_email = me.email;
  if (p.mode === 'subscription') params.subscription_data = { metadata: { uid: me.ws, plan } };
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
  if (ev.type === 'checkout.session.completed' || ev.type === 'checkout.session.async_payment_succeeded' || ev.type === 'checkout.session.async_payment_failed') {
    const uid = o.client_reference_id || o.metadata?.uid;
    if (!uid) return;
    const b = (await getBill(env, uid)) || { uid };
    b.customer = o.customer || b.customer;
    // vitalício: cartão confirma na hora; Pix/boleto confirmam depois (async_payment_succeeded)
    if (o.mode === 'payment' && o.payment_status === 'paid') { b.lifetime = true; b.lifetimeAt = now; b.lifetimePI = o.payment_intent || b.lifetimePI || null; b.pending = null; }
    else if (o.mode === 'payment' && ev.type === 'checkout.session.completed') b.pending = { plan: o.metadata?.plan || 'vitalicio', at: now };
    if (ev.type === 'checkout.session.async_payment_failed') b.pending = null;
    if (o.mode === 'subscription' && isAddon(o.metadata?.plan)) b.addon = { plan: o.metadata.plan, subscription: o.subscription, subActive: true, paidUntil: now + 32 * 864e5, since: now };
    else if (o.mode === 'subscription') { b.subActive = true; b.subscription = o.subscription; b.paidUntil = now + 32 * 864e5; }
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
    const alive = ev.type !== 'customer.subscription.deleted' && ['active', 'trialing', 'past_due'].includes(o.status);
    const end = o.current_period_end || o.items?.data?.[0]?.current_period_end;
    // assinatura do complemento (agenda compartilhada) ou do plano base
    if (isAddon(o.metadata?.plan) || (b.addon && b.addon.subscription === o.id)) {
      b.addon = { ...(b.addon || {}), plan: isAddon(o.metadata?.plan) ? o.metadata.plan : b.addon.plan, subscription: o.id, subActive: alive, cancelAt: o.cancel_at ? o.cancel_at * 1000 : null };
      if (end) b.addon.paidUntil = end * 1000;
    } else {
      b.subscription = o.id;
      b.subActive = alive;
      if (end) b.paidUntil = end * 1000;
      b.cancelAt = o.cancel_at ? o.cancel_at * 1000 : null;
    }
    b.updatedAt = now;
    await putBill(env, uid, b);
    return;
  }
  // reembolso total do vitalício (ex.: arrependimento em 7 dias): encerra o acesso vitalício
  if (ev.type === 'charge.refunded' && o.refunded) {
    const uid = o.metadata?.uid || (o.customer && (await env.CAL.get(`cust:${o.customer}`)));
    if (!uid) return;
    const b = await getBill(env, uid);
    if (b && b.lifetime && (!b.lifetimePI || b.lifetimePI === o.payment_intent)) { b.lifetime = false; b.refundedAt = now; b.updatedAt = now; await putBill(env, uid, b); }
    return;
  }
  if (ev.type === 'invoice.paid' && o.customer) {
    const uid = await env.CAL.get(`cust:${o.customer}`);
    if (!uid) return;
    const b = (await getBill(env, uid)) || { uid };
    const end = o.lines?.data?.[0]?.period?.end;
    const until = end ? end * 1000 : now + 32 * 864e5;
    const subId = o.subscription || o.parent?.subscription_details?.subscription || null;
    const plan = o.parent?.subscription_details?.metadata?.plan || o.subscription_details?.metadata?.plan || o.lines?.data?.[0]?.metadata?.plan;
    if ((subId && b.addon && b.addon.subscription === subId) || isAddon(plan)) b.addon = { ...(b.addon || {}), ...(isAddon(plan) ? { plan } : {}), ...(subId ? { subscription: subId } : {}), subActive: true, paidUntil: until };
    else { b.subActive = true; b.paidUntil = until; }
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

/* Excluir conta (LGPD): cancela as assinaturas na Stripe e tira os dados pessoais do registro de cobrança.
   Fica só o mínimo exigido pela lei fiscal (identificadores do pagamento), sem e-mail. */
export async function closeBilling(env, me, fetchImpl = fetch, now = Date.now()) {
  if (me.ws === 'main') return { canceled: 0 };
  const b = await getBill(env, me.ws);
  if (!b) return { canceled: 0 };
  let canceled = 0;
  for (const sub of [b.subActive && b.subscription, b.addon && b.addon.subActive && b.addon.subscription].filter(Boolean)) {
    try { await stripe(env, `subscriptions/${sub}`, {}, fetchImpl, 'DELETE'); canceled++; } catch (e) { console.log('cancelar assinatura', sub, e.message); }
  }
  const keep = { uid: b.uid, customer: b.customer || null, lifetime: !!b.lifetime, lifetimeAt: b.lifetimeAt || null, subscription: b.subscription || null, deletedAt: now, trialEndsAt: b.trialEndsAt || null, trialDenied: b.trialDenied || null };
  if (b.addon) keep.addon = { plan: b.addon.plan, subscription: b.addon.subscription || null, subActive: false };
  await putBill(env, me.ws, keep);
  // a equipe do dono acaba: convidados perdem o acesso
  const team = await env.CAL.get(`team:${me.ws}`, 'json');
  if (team) await Promise.all([...(team.members || []).map((m) => env.CAL.delete(`member:${m.uid}`)), env.CAL.delete(`team:${me.ws}`)]);
  await env.CAL.delete(`member:${me.ws}`);
  return { canceled };
}
