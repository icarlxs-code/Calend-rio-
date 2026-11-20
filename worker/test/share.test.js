import { test } from 'node:test';
import assert from 'node:assert/strict';
import { startTrial, billingStatus, createCheckout, handleStripeEvent, syncTeam, sharedOf, validCPF } from '../src/billing.js';
import { withWorkspace } from '../src/index.js';

const mkEnv = (extra = {}) => {
  const kv = {};
  return { kv, STRIPE_SECRET_KEY: 'sk_test_x', STRIPE_WEBHOOK_SECRET: 'whsec_test', ...extra,
    CAL: { get: async (k, t) => (kv[k] == null ? null : t === 'json' ? JSON.parse(kv[k]) : kv[k]), put: async (k, v) => (kv[k] = v), delete: async (k) => { delete kv[k]; } } };
};
const user = (ws, name = ws) => ({ id: 'u' + ws, ws, email: `${ws}@teste.local`, name });
const OWNER = 'Owner123', GUEST = 'Guest456', GUEST2 = 'Guest789';
const fakeFetch = (calls) => async (url, opt) => { calls.push(new URLSearchParams(opt.body)); return { ok: true, json: async () => ({ url: 'https://checkout.stripe.com/c/x' }) }; };

test('CPF: valida os dígitos e só dá um teste grátis por CPF', async () => {
  assert.equal(validCPF('529.982.247-25'), true);
  assert.equal(validCPF('111.111.111-11'), false);
  assert.equal(validCPF('529.982.247-26'), false);
  const env = mkEnv(); const now = Date.now();
  const a = await startTrial(env, user('A'), { deviceId: 'd1', ip: '1.1.1.1', cpf: '52998224725', now });
  assert.equal(a.plan, 'trial');
  const b = await startTrial(env, user('B'), { deviceId: 'd2', ip: '2.2.2.2', cpf: '529.982.247-25', now });
  assert.equal(b.plan, 'blocked'); assert.equal(b.reason, 'cpf');
  assert.ok(!JSON.stringify(env.kv).includes('52998224725'), 'o CPF nunca fica guardado em texto');
});

test('agenda compartilhada: exige plano base pago e é cobrada à parte (não vem no vitalício)', async () => {
  const env = mkEnv(); const calls = [];
  await startTrial(env, user(OWNER), { deviceId: 'd1', ip: '1.1.1.1', now: Date.now() });
  await assert.rejects(createCheckout(env, user(OWNER), { plan: 'dupla', returnUrl: 'https://x.test/' }, fakeFetch(calls)), /primeiro assine/);
  // compra o vitalício
  await handleStripeEvent(env, { type: 'checkout.session.completed', data: { object: { client_reference_id: OWNER, mode: 'payment', payment_status: 'paid', customer: 'cus_1', metadata: { uid: OWNER, plan: 'vitalicio' } } } });
  let st = await billingStatus(env, user(OWNER));
  assert.equal(st.plan, 'lifetime'); assert.equal(st.addon, undefined, 'vitalício não inclui o compartilhamento');
  // agora pode assinar o complemento
  await createCheckout(env, user(OWNER), { plan: 'equipe', returnUrl: 'https://x.test/' }, fakeFetch(calls));
  const p = calls[0];
  assert.equal(p.get('mode'), 'subscription');
  assert.equal(p.get('line_items[0][price_data][unit_amount]'), '990', 'vitalício paga a Equipe com desconto (R$ 9,90)');
  assert.equal(p.get('line_items[0][price_data][recurring][interval]'), 'month');
  assert.equal(p.get('subscription_data[metadata][plan]'), 'equipe');
  await handleStripeEvent(env, { type: 'checkout.session.completed', data: { object: { client_reference_id: OWNER, mode: 'subscription', subscription: 'sub_add', customer: 'cus_1', metadata: { uid: OWNER, plan: 'equipe' } } } });
  st = await billingStatus(env, user(OWNER));
  assert.equal(st.plan, 'lifetime');
  assert.deepEqual([st.addon.plan, st.addon.seats, st.addon.active], ['equipe', 4, true]);
  // a renovação do complemento não mexe no plano base
  await handleStripeEvent(env, { type: 'customer.subscription.updated', data: { object: { id: 'sub_add', customer: 'cus_1', status: 'active', metadata: { uid: OWNER, plan: 'equipe' }, current_period_end: Math.floor(Date.now() / 1000) + 30 * 86400 } } });
  st = await billingStatus(env, user(OWNER));
  assert.equal(st.plan, 'lifetime'); assert.equal(st.addon.active, true);
  // não deixa assinar outro complemento por cima
  await assert.rejects(createCheckout(env, user(OWNER), { plan: 'dupla', returnUrl: 'https://x.test/' }, fakeFetch(calls)), /Para trocar de plano/);
});

test('convidado entra coberto pelo plano do dono; vagas pagas; cancelou → sai', async () => {
  const env = mkEnv();
  await handleStripeEvent(env, { type: 'checkout.session.completed', data: { object: { client_reference_id: OWNER, mode: 'subscription', subscription: 'sub_base', customer: 'cus_1', metadata: { uid: OWNER, plan: 'mensal' } } } });
  await handleStripeEvent(env, { type: 'checkout.session.completed', data: { object: { client_reference_id: OWNER, mode: 'subscription', subscription: 'sub_add', customer: 'cus_1', metadata: { uid: OWNER, plan: 'dupla' } } } });
  const r = await syncTeam(env, user(OWNER, 'Rafa'), [{ uid: GUEST, name: 'Bia' }, { uid: GUEST2, name: 'Caio' }]);
  assert.deepEqual([r.active, r.seats, r.members], [true, 1, 1], 'Dupla: só 1 convidado');
  assert.ok(await sharedOf(env, GUEST));
  assert.equal(await sharedOf(env, GUEST2), null);
  // convidado sem plano próprio: liberado pelo dono
  const st = await billingStatus(env, user(GUEST));
  assert.equal(st.plan, 'shared'); assert.equal(st.active, true); assert.equal(st.ownerName, 'Rafa');
  // pode mexer na agenda do dono; um estranho não
  const w = await withWorkspace(env, user(GUEST), OWNER);
  assert.equal(w.ws, OWNER); assert.equal(w.guest, true);
  await assert.rejects(withWorkspace(env, user(GUEST2), OWNER), /não faz parte/);
  // o dono também enxerga a equipe (avisos para o convidado)
  const o = await withWorkspace(env, user(OWNER), '');
  assert.deepEqual([o.team.ownerId, o.team.members[0].id], ['u' + OWNER, 'u' + GUEST]);
  // cancelou o complemento: o convidado perde o acesso
  await handleStripeEvent(env, { type: 'customer.subscription.deleted', data: { object: { id: 'sub_add', customer: 'cus_1', status: 'canceled', metadata: { uid: OWNER, plan: 'dupla' } } } });
  assert.equal(await sharedOf(env, GUEST), null);
  assert.equal((await billingStatus(env, user(GUEST))).plan, 'none');
  await assert.rejects(withWorkspace(env, user(GUEST), OWNER), /não faz parte/);
  // o plano base do dono continua
  assert.equal((await billingStatus(env, user(OWNER))).plan, 'monthly');
});

test('sem plano base pago, o complemento não vale (mesmo assinado)', async () => {
  const env = mkEnv();
  env.kv[`bill:${OWNER}`] = JSON.stringify({ uid: OWNER, addon: { plan: 'equipe', subActive: true, paidUntil: Date.now() + 864e6 } });
  const r = await syncTeam(env, user(OWNER), [{ uid: GUEST, name: 'Bia' }]);
  assert.equal(r.active, false); assert.equal(r.members, 0);
});

test('excluir conta: cancela as assinaturas na Stripe, tira o e-mail e desfaz a equipe', async () => {
  const { closeBilling } = await import('../src/billing.js');
  const env = mkEnv();
  await handleStripeEvent(env, { type: 'checkout.session.completed', data: { object: { client_reference_id: OWNER, mode: 'subscription', subscription: 'sub_base', customer: 'cus_9', metadata: { uid: OWNER, plan: 'mensal' } } } });
  await handleStripeEvent(env, { type: 'checkout.session.completed', data: { object: { client_reference_id: OWNER, mode: 'subscription', subscription: 'sub_add', customer: 'cus_9', metadata: { uid: OWNER, plan: 'dupla' } } } });
  env.kv[`bill:${OWNER}`] = JSON.stringify({ ...JSON.parse(env.kv[`bill:${OWNER}`]), email: 'dono@teste.local' });
  await syncTeam(env, user(OWNER), [{ uid: GUEST, name: 'Bia' }]);
  const calls = [];
  const r = await closeBilling(env, user(OWNER), async (url, opt) => { calls.push([opt.method, url]); return { ok: true, json: async () => ({}) }; });
  assert.equal(r.canceled, 2);
  assert.deepEqual(calls.map((c) => c[0]), ['DELETE', 'DELETE']);
  assert.ok(calls.some((c) => c[1].endsWith('/subscriptions/sub_base')) && calls.some((c) => c[1].endsWith('/subscriptions/sub_add')));
  assert.ok(!env.kv[`bill:${OWNER}`].includes('dono@teste.local'), 'sem e-mail depois de excluir');
  assert.equal(env.kv[`team:${OWNER}`], undefined);
  assert.equal(await sharedOf(env, GUEST), null);
});

test('volta do pagamento só para o site oficial; Pix/boleto confirmam depois; reembolso tira o vitalício', async () => {
  const { siteBase, statusOf } = await import('../src/billing.js');
  const env = mkEnv({ SITE_URL: 'https://lembra.test/', ALLOWED_ORIGINS: 'https://lembra.test' });
  assert.equal(siteBase(env, 'https://lembra.test/app/index.html#/planos'), 'https://lembra.test/app/');
  assert.equal(siteBase(env, 'https://site-malicioso.test/roubo'), 'https://lembra.test/', 'não manda para site de fora');
  assert.equal(siteBase(env, 'lixo'), 'https://lembra.test/');
  const calls = [];
  await handleStripeEvent(env, { type: 'checkout.session.completed', data: { object: { client_reference_id: OWNER, mode: 'payment', payment_status: 'paid', customer: 'cus_x', payment_intent: 'pi_card', metadata: { uid: OWNER, plan: 'vitalicio' } } } });
  await createCheckout(env, user(GUEST), { plan: 'mensal', returnUrl: 'https://lembra.test/' }, fakeFetch(calls));
  assert.equal(calls[0].get('success_url'), 'https://lembra.test/pago/?p=mensal');
  assert.equal(calls[0].get('cancel_url'), 'https://lembra.test/pago/?cancelado=1');
  // Pix: a sessão termina sem pagamento confirmado; confirma depois
  await handleStripeEvent(env, { type: 'checkout.session.completed', data: { object: { client_reference_id: GUEST, mode: 'payment', payment_status: 'unpaid', customer: 'cus_g', metadata: { uid: GUEST, plan: 'vitalicio' } } } });
  let b = JSON.parse(env.kv[`bill:${GUEST}`]);
  assert.equal(statusOf(b, user(GUEST)).pending, 'vitalicio');
  assert.equal(statusOf(b, user(GUEST)).active, false);
  await handleStripeEvent(env, { type: 'checkout.session.async_payment_succeeded', data: { object: { client_reference_id: GUEST, mode: 'payment', payment_status: 'paid', customer: 'cus_g', payment_intent: 'pi_pix', metadata: { uid: GUEST, plan: 'vitalicio' } } } });
  b = JSON.parse(env.kv[`bill:${GUEST}`]);
  assert.equal(statusOf(b, user(GUEST)).plan, 'lifetime');
  // reembolso total (arrependimento): perde o vitalício
  await handleStripeEvent(env, { type: 'charge.refunded', data: { object: { refunded: true, customer: 'cus_g', payment_intent: 'pi_pix', metadata: {} } } });
  b = JSON.parse(env.kv[`bill:${GUEST}`]);
  assert.notEqual(statusOf(b, user(GUEST)).plan, 'lifetime');
  // reembolso de outro pagamento não mexe
  await handleStripeEvent(env, { type: 'charge.refunded', data: { object: { refunded: true, customer: 'cus_x', payment_intent: 'pi_outro', metadata: { uid: OWNER } } } });
  assert.equal(statusOf(JSON.parse(env.kv[`bill:${OWNER}`]), user(OWNER)).plan, 'lifetime');
});
