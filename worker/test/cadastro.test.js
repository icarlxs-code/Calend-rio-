/* Aviso de "novo cadastro": chega só no celular do dono do app, uma vez por conta nova,
   com nome e e-mail — e nunca para o sócio, para outros clientes ou para quem já tinha conta. */
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
const require = createRequire(new URL('../../functions/package.json', import.meta.url));
const ece = require('http_ece');
const { handle } = await import('../src/index.js');

const kv = new Map();
const env = {
  CAL: {
    get: async (k, t) => (kv.has(k) ? (t === 'json' ? JSON.parse(kv.get(k)) : kv.get(k)) : null),
    put: async (k, v) => kv.set(k, v),
  },
  TEAM: JSON.stringify([{ id: 'henrique', name: 'Henrique', email: 'dono@teste.local' }, { id: 'matheus', name: 'Matheus', email: 'socio@teste.local' }]),
  ADMIN_EMAIL: 'dono@teste.local',
  PROJECT_ID: 'demo',
  ALLOW_EMULATOR_TOKENS: '1',
  ALLOWED_ORIGINS: 'https://icarlxs-code.github.io',
};
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
const token = (email, uid, name) => `${b64({ alg: 'none' })}.${b64({ email, exp: Math.floor(Date.now() / 1000) + 3600, ...(uid ? { user_id: uid, sub: uid } : {}), ...(name ? { name } : {}) })}.`;

const phones = {};
function phone(name) {
  const ecdh = crypto.createECDH('prime256v1'); ecdh.generateKeys();
  const auth = crypto.randomBytes(16);
  phones[name] = { ecdh, auth, inbox: [], endpoint: `https://web.push.apple.com/${name}` };
  return { endpoint: phones[name].endpoint, keys: { p256dh: ecdh.getPublicKey().toString('base64url'), auth: auth.toString('base64url') } };
}
globalThis.fetch = async (url, init) => {
  const p = Object.values(phones).find((x) => x.endpoint === url);
  if (!p) throw new Error('rede bloqueada no teste: ' + url);
  p.inbox.push(JSON.parse(ece.decrypt(Buffer.from(init.body), { version: 'aes128gcm', privateKey: p.ecdh, authSecret: p.auth }).toString()));
  return new Response(null, { status: 201 });
};
const call = async (path, { email, uid, name, body = {} } = {}) => {
  const res = await handle(new Request(`https://w.dev${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://icarlxs-code.github.io', Authorization: `Bearer ${token(email, uid, name)}` }, body: JSON.stringify(body) }), env);
  return { status: res.status, data: await res.json().catch(() => null) };
};
const novos = (who) => phones[who].inbox.filter((m) => /Novo cadastro/.test(m.title));

before(async () => {
  // celulares cadastrados: o dono, o sócio e uma cliente antiga (já tinha conta)
  await call('/subscribe', { email: 'dono@teste.local', body: { id: 'd1', subscription: phone('dono') } });
  await call('/subscribe', { email: 'socio@teste.local', body: { id: 's1', subscription: phone('socio') } });
  kv.set('bill:antigaUid000001', JSON.stringify({ uid: 'antigaUid000001', trialEndsAt: Date.now() + 864e5 }));
  await call('/subscribe', { email: 'antiga@teste.local', uid: 'antigaUid000001', name: 'Antiga', body: { id: 'a1', subscription: phone('antiga') } });
});

test('conta nova: o aviso chega só para o dono, com nome e e-mail', async () => {
  const r = await call('/billing/status', { email: 'maria@teste.local', uid: 'mariaUid00000001', name: 'Maria Souza' });
  assert.equal(r.status, 200);
  assert.equal(novos('dono').length, 1, 'o dono recebeu');
  const msg = novos('dono')[0];
  assert.match(msg.title, /Novo cadastro: Maria Souza/);
  assert.match(msg.body, /maria@teste\.local/);
  assert.match(msg.body, /Total: 1 cadastro/);
  assert.equal(novos('socio').length, 0, 'o sócio NÃO recebe');
  assert.equal(novos('antiga').length, 0, 'outros clientes NÃO recebem');
});

test('a mesma pessoa abrindo de novo (ou em outro celular) não avisa de novo', async () => {
  await call('/billing/status', { email: 'maria@teste.local', uid: 'mariaUid00000001', name: 'Maria Souza' });
  await call('/billing/status', { email: 'maria@teste.local', uid: 'mariaUid00000001', name: 'Maria Souza' });
  assert.equal(novos('dono').length, 1);
});

test('quem já tinha conta antes não gera aviso; o próprio dono e o sócio também não', async () => {
  await call('/billing/status', { email: 'antiga@teste.local', uid: 'antigaUid000001', name: 'Antiga' });
  await call('/billing/status', { email: 'dono@teste.local' });
  await call('/billing/status', { email: 'socio@teste.local' });
  assert.equal(novos('dono').length, 1);
});

test('segunda conta nova: avisa de novo e o total sobe', async () => {
  await call('/billing/status', { email: 'joao@teste.local', uid: 'joaoUid000000001', name: 'João Lima' });
  assert.equal(novos('dono').length, 2);
  assert.match(novos('dono')[1].title, /João Lima/);
  assert.match(novos('dono')[1].body, /Total: 2 cadastros/);
  assert.equal(novos('socio').length + novos('antiga').length, 0);
});
