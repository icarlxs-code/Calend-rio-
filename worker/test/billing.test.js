import { test } from 'node:test';
import assert from 'node:assert/strict';
import { startTrial, billingStatus, createCheckout, verifyStripe, handleStripeEvent, statusOf, TRIAL_MS } from '../src/billing.js';

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

test('conta nova no mesmo aparelho ou na mesma rede não ganha outro teste', async () => {
  const env = mkEnv(); const now = Date.now();
  await startTrial(env, user('A'), { deviceId: 'dev1', ip: '1.1.1.1', now });
  const sameDev = await startTrial(env, user('B'), { deviceId: 'dev1', ip: '9.9.9.9', now });
  assert.equal(sameDev.plan, 'blocked'); assert.equal(sameDev.reason, 'aparelho');
  const sameNet = await startTrial(env, user('C'), { deviceId: 'dev2', ip: '1.1.1.1', now });
  assert.equal(sameNet.plan, 'blocked'); assert.equal(sameNet.reason, 'rede');
  const other = await startTrial(env, user('D'), { deviceId: 'dev3', ip: '2.2.2.2', now });
  assert.equal(other.plan, 'trial');
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
  assert.equal(b1.get('success_url'), 'https://icarlxs-code.github.io/Calend-rio-/#/pago');
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
