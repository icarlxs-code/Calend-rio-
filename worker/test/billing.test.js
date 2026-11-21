import { test } from 'node:test';
import assert from 'node:assert/strict';
import { startTrial, billingStatus, createCheckout, verifyStripe, handleStripeEvent, statusOf, untilOf, TRIAL_MS } from '../src/billing.js';

const mkEnv = (extra = {}) => {
  const kv = {};
  return { kv, STRIPE_SECRET_KEY: 'sk_test_x', STRIPE_WEBHOOK_SECRET: 'whsec_test', ...extra,
    CAL: { get: async (k, t) => (kv[k] == null ? null : t === 'json' ? JSON.parse(kv[k]) : kv[k]), put: async (k, v) => (kv[k] = v) } };
};
const user = (ws) => ({ id: 'u' + ws, ws, email: `${ws}@teste.local`, name: ws });

test('dupla não paga', async () => {
  const st = await billingStatus(mkEnv(), { id: 'henrique', ws: 'main' });
  assert.equal(st.plan, 'team'); assert.equal(st.active, true);
});

test('teste grátis de 24h e depois expira', async () => {
  const env = mkEnv(); const now = Date.now();
  const st = await startTrial(env, user('A'), { deviceId: 'dev1', ip: '1.1.1.1', now });
  assert.equal(st.plan, 'trial'); assert.equal(st.trialEndsAt, now + TRIAL_MS);
  const again = await startTrial(env, user('A'), { deviceId: 'dev1', ip: '1.1.1.1', now: now + 1000 });
  assert.equal(again.trialEndsAt, now + TRIAL_MS); // não reinicia
  const b = JSON.parse(env.kv['bill:A']);
  assert.equal(statusOf(b, user('A'), now + TRIAL_MS + 1).plan, 'expired');
});

test('conta nova no mesmo aparelho ou no mesmo endereço de internet (IP) não ganha outro teste', async () => {
  const env = mkEnv(); const now = Date.now();
  await startTrial(env, user('A'), { deviceId: 'dev1', ip: '1.1.1.1', now });
  const sameDev = await startTrial(env, user('B'), { deviceId: 'dev1', ip: '9.9.9.9', now });
  assert.equal(sameDev.plan, 'blocked'); assert.equal(sameDev.reason, 'aparelho');
  const sameNet = await startTrial(env, user('C'), { deviceId: 'dev2', ip: '1.1.1.1', now: now + 26 * 3600e3 });
  assert.equal(sameNet.plan, 'blocked'); assert.equal(sameNet.reason, 'rede');
  // celular no 4G/5G (IPv6): o final do endereço muda, mas o bloco do aparelho é o mesmo
  await startTrial(env, user('V1'), { deviceId: 'dv1', ip: '2804:14c:5b81:4a2b:1111:2222:3333:4444', now });
  const v2 = await startTrial(env, user('V2'), { deviceId: 'dv2', ip: '2804:14c:5b81:4a2b:aaaa::1', now });
  assert.equal(v2.plan, 'blocked'); assert.equal(v2.reason, 'rede');
  // depois de 30 dias a mesma conexão pode testar de novo (endereços mudam de dono)
  assert.equal((await startTrial(env, user('C2'), { deviceId: 'dev2b', ip: '1.1.1.1', now: now + 31 * 864e5 })).plan, 'trial');
  const other = await startTrial(env, user('D'), { deviceId: 'dev3', ip: '2.2.2.2', now });
  assert.equal(other.plan, 'trial');
});

test('IPv6 vira o bloco /64 do aparelho; IPv4 fica igual', async () => {
  const { netOf } = await import('../src/billing.js');
  assert.equal(netOf('2804:14c:5b81:4a2b:1111:2222:3333:4444'), '2804:14c:5b81:4a2b::/64');
  assert.equal(netOf('2804:014c:5b81:4a2b::1'), '2804:14c:5b81:4a2b::/64');
  assert.equal(netOf('2001:db8::1'), '2001:db8:0:0::/64');
  assert.equal(netOf('187.10.20.30'), '187.10.20.30');
});

test('checkout: monta a assinatura de R$ 9,90 e o vitalício de R$ 150', async () => {
  const env = mkEnv(); const calls = [];
  const fakeFetch = async (url, opt) => { calls.push({ url, body: new URLSearchParams(opt.body) }); return { ok: true, json: async () => ({ url: 'https://checkout.stripe.com/c/x' }) }; };
  const r = await createCheckout(env, user('A'), { plan: 'mensal', returnUrl: 'https://icarlxs-code.github.io/Calend-rio-/#/x' }, fakeFetch);
  assert.equal(r.url, 'https://checkout.stripe.com/c/x');
  const b1 = calls[0].body;
  assert.equal(b1.get('mode'), 'subscription');
  assert.equal(b1.get('line_items[0][price_data][unit_amount]'), '990');
  assert.equal(b1.get('line_items[0][price_data][currency]'), 'brl');
  assert.equal(b1.get('line_items[0][price_data][recurring][interval]'), 'month');
  assert.equal(b1.get('client_reference_id'), 'A');
  assert.equal(b1.get('success_url'), 'https://icarlxs-code.github.io/Calend-rio-/pago/?p=mensal'); // página oficial de pagamento recebido
  await createCheckout(env, user('A'), { plan: 'vitalicio', returnUrl: '' }, fakeFetch);
  assert.equal(calls[1].body.get('mode'), 'payment');
  assert.equal(calls[1].body.get('line_items[0][price_data][unit_amount]'), '15000');
  await assert.rejects(createCheckout(mkEnv({ STRIPE_SECRET_KEY: '' }), user('A'), { plan: 'mensal' }, fakeFetch), /chave da Stripe/);
});

async function sign(secret, payload, t) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${t}.${payload}`));
  return `t=${t},v1=${[...new Uint8Array(sig)].map((x) => x.toString(16).padStart(2, '0')).join('')}`;
}

test('aviso da Stripe: só aceita assinado; libera vitalício e assinatura; cancelamento bloqueia', async () => {
  const env = mkEnv(); const now = Date.now(); const t = Math.floor(now / 1000);
  const ev = JSON.stringify({ type: 'checkout.session.completed', data: { object: { client_reference_id: 'A', mode: 'payment', payment_status: 'paid', customer: 'cus_1' } } });
  await assert.rejects(verifyStripe(env, ev, `t=${t},v1=abc`), /assinatura/);
  const parsed = await verifyStripe(env, ev, await sign('whsec_test', ev, t));
  await handleStripeEvent(env, parsed);
  assert.equal((await billingStatus(env, user('A'))).plan, 'lifetime');

  await handleStripeEvent(env, { type: 'checkout.session.completed', data: { object: { client_reference_id: 'B', mode: 'subscription', customer: 'cus_2', subscription: 'sub_2' } } });
  assert.equal((await billingStatus(env, user('B'))).plan, 'monthly');
  await handleStripeEvent(env, { type: 'customer.subscription.deleted', data: { object: { id: 'sub_2', customer: 'cus_2', status: 'canceled' } } });
  assert.equal((await billingStatus(env, user('B'))).active, false);
});

test('nunca cobra em dobro: vitalício não compra mensal; mensal não assina de novo; virar vitalício cancela o mensal', async () => {
  const env = mkEnv(); const calls = [];
  const fakeFetch = async (url, opt) => { calls.push({ url, body: new URLSearchParams(opt.body) }); return { ok: true, json: async () => ({ url: 'https://checkout.stripe.com/c/x' }) }; };
  await handleStripeEvent(env, { type: 'checkout.session.completed', data: { object: { client_reference_id: 'M', mode: 'subscription', subscription: 'sub_m', customer: 'cus_m', metadata: { uid: 'M', plan: 'mensal' } } } });
  await assert.rejects(createCheckout(env, user('M'), { plan: 'mensal', returnUrl: 'https://x.test/' }, fakeFetch), /já assina/);
  // passa para o vitalício: a Stripe é chamada para cancelar a mensalidade
  const realFetch = globalThis.fetch; const deleted = [];
  env.STRIPE_SECRET_KEY = 'sk_test_x';
  globalThis.fetch = async (url, opt) => { deleted.push([opt.method, url]); return { ok: true, json: async () => ({}) }; };
  try {
    await handleStripeEvent(env, { type: 'checkout.session.completed', data: { object: { client_reference_id: 'M', mode: 'payment', payment_status: 'paid', customer: 'cus_m', payment_intent: 'pi_1', metadata: { uid: 'M', plan: 'vitalicio' } } } });
  } finally { globalThis.fetch = realFetch; }
  assert.deepEqual(deleted, [['DELETE', 'https://api.stripe.com/v1/subscriptions/sub_m']]);
  const st = statusOf(JSON.parse(env.kv['bill:M']), user('M'));
  assert.equal(st.plan, 'lifetime');
  await assert.rejects(createCheckout(env, user('M'), { plan: 'vitalicio', returnUrl: 'https://x.test/' }, fakeFetch), /já é vitalícia/);
  await assert.rejects(createCheckout(env, user('M'), { plan: 'mensal', returnUrl: 'https://x.test/' }, fakeFetch), /já é vitalícia/);
});

test('cortesia do dono: libera e tira o acesso (para revisores das lojas), sem mexer em quem pagou', async () => {
  const { grantComp } = await import('../src/billing.js');
  const env = mkEnv();
  let st = await grantComp(env, 'REVISOR1', true);
  assert.equal(st.plan, 'lifetime'); assert.equal(st.comp, true);
  st = await grantComp(env, 'REVISOR1', false);
  assert.equal(st.active, false);
  // quem pagou o vitalício não perde o acesso se o dono tocar em "tirar cortesia"
  await handleStripeEvent(env, { type: 'checkout.session.completed', data: { object: { client_reference_id: 'PAGOU1', mode: 'payment', payment_status: 'paid', metadata: { uid: 'PAGOU1', plan: 'vitalicio' } } } });
  st = await grantComp(env, 'PAGOU1', false);
  assert.equal(st.plan, 'lifetime');
  await assert.rejects(grantComp(env, '../x', true), /inválida/);
});

test('dono libera até uma data: tudo liberado até lá, depois precisa assinar', () => {
  const now = Date.parse('2026-11-21T10:00:00-03:00');
  const b = { compUntil: now + 3 * 864e5, trialEndsAt: now - 864e5 };
  const st = statusOf(b, { ws: 'abc' }, now);
  assert.equal(st.plan, 'comp'); assert.equal(st.active, true); assert.equal(untilOf(st, now), b.compUntil);
  const later = statusOf(b, { ws: 'abc' }, now + 4 * 864e5);
  assert.equal(later.active, false); assert.equal(later.plan, 'expired');
});
