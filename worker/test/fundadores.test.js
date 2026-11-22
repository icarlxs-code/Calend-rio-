/* A antiga dupla (Henrique + Matheus) vira duas contas próprias: cada um no seu espaço, para sempre,
   com a agenda compartilhada inclusa; os celulares guardados com o id antigo saem (sem aviso em dobro). */
import { test } from 'node:test';
import assert from 'node:assert/strict';
const { handle } = await import('../src/index.js');
const kv = new Map();
const env = {
  CAL: { get: async (k, t) => (kv.has(k) ? (t === 'json' ? JSON.parse(kv.get(k)) : kv.get(k)) : null), put: async (k, v) => kv.set(k, v), delete: async (k) => kv.delete(k) },
  TEAM: JSON.stringify([{ id: 'henrique', name: 'Henrique', email: 'dono@teste.local' }, { id: 'matheus', name: 'Matheus', email: 'socio@teste.local' }]),
  ADMIN_EMAIL: 'dono@teste.local', PROJECT_ID: 'demo', ALLOW_EMULATOR_TOKENS: '1', ALLOWED_ORIGINS: 'https://meulembra.com.br',
};
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
const tok = (email, uid) => `${b64({ alg: 'none' })}.${b64({ email, user_id: uid, sub: uid, exp: Math.floor(Date.now() / 1000) + 3600 })}.`;
const call = async (path, email, uid, body = {}) => {
  const res = await handle(new Request(`https://w.dev${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://meulembra.com.br', 'User-Agent': 'iPhone', Authorization: `Bearer ${tok(email, uid)}` }, body: JSON.stringify(body) }), env);
  return { status: res.status, data: await res.json().catch(() => null) };
};

test('cada fundador tem o próprio espaço, para sempre, com a agenda compartilhada inclusa', async () => {
  const st = (await call('/billing/status', 'dono@teste.local', 'henriqueUid00001')).data;
  assert.equal(st.plan, 'lifetime');
  assert.equal(st.active, true);
  assert.equal(st.addon.active, true);
  assert.equal(st.addon.gift, true);
  assert.equal(st.vip, undefined, 'fundador não recebe a surpresa do Vitalício');
  const sm = (await call('/billing/status', 'socio@teste.local', 'matheusUid000001')).data;
  assert.equal(sm.plan, 'lifetime');
  assert.ok(JSON.parse(kv.get('users')).umatheusUid000001, 'Matheus entra no registro como conta própria');
});

test('celulares guardados com o id antigo da dupla saem quando ele ativa os avisos de novo', async () => {
  kv.set('subs', JSON.stringify({ velho: { member: 'henrique', subscription: { endpoint: 'https://web.push.apple.com/velho', keys: { p256dh: 'a', auth: 'b' } } } }));
  await call('/subscribe', 'dono@teste.local', 'henriqueUid00001', { id: 'novo', subscription: { endpoint: 'https://web.push.apple.com/novo', keys: { p256dh: 'BAAA', auth: 'aa' } } });
  const subs = JSON.parse(kv.get('subs'));
  assert.deepEqual(Object.keys(subs), ['novo']);
  assert.equal(subs.novo.member, 'uhenriqueUid00001');
  assert.equal(kv.get('admin-member'), 'uhenriqueUid00001', 'avisos do dono (cadastro, suporte) vão para a conta nova');
});
