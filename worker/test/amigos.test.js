/* Amizades: o link de convite cria um PEDIDO na conta de quem abriu; só vira amizade quando ela aceita.
   Dá para recusar e remover. O cartão mostra nível, emblemas e, se for, o Vitalício (vem do servidor). */
import { test } from 'node:test';
import assert from 'node:assert/strict';
const { handle } = await import('../src/index.js');
const kv = new Map();
const env = {
  CAL: { get: async (k, t) => (kv.has(k) ? (t === 'json' ? JSON.parse(kv.get(k)) : kv.get(k)) : null), put: async (k, v) => kv.set(k, v), delete: async (k) => kv.delete(k) },
  TEAM: '[]', PROJECT_ID: 'demo', ALLOW_EMULATOR_TOKENS: '1', ALLOWED_ORIGINS: 'https://meulembra.com.br',
};
globalThis.fetch = async () => new Response(null, { status: 201 });
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
const tok = (uid) => `${b64({ alg: 'none' })}.${b64({ email: `${uid}@teste.local`, user_id: uid, sub: uid, exp: Math.floor(Date.now() / 1000) + 3600 })}.`;
const call = async (path, uid, body = {}) => {
  const res = await handle(new Request(`https://w.dev${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://meulembra.com.br', Authorization: `Bearer ${tok(uid)}` }, body: JSON.stringify({ ws: '', ...body }) }), env);
  return { status: res.status, data: await res.json().catch(() => null) };
};
const ANA = 'anaUid0000000001', BIA = 'biaUid0000000001', CIC = 'cicUid0000000001';

test('convite → pedido na conta de quem abriu → só vira amizade quando aceita', async () => {
  await call('/friends/card', ANA, { name: 'Ana', level: 12, xp: 900, badges: ['ficha', 'vitalicio', '<script>'] });
  kv.set(`bill:${ANA}`, JSON.stringify({ uid: ANA, lifetime: true, comp: true, vip: { no: 7, at: 1 } }));
  const { token } = (await call('/friends/link', ANA)).data;
  assert.match(token, /^[A-Za-z0-9]{18}$/);
  const o = (await call('/friends/open', BIA, { token })).data;
  assert.equal(o.from.name, 'Ana');
  assert.equal(o.from.vip.no, 7, 'mostra que a Ana é Vitalícia (dado do servidor)');
  assert.deepEqual(o.from.badges, ['ficha', 'vitalicio'], 'emblema inválido é descartado');
  let l = (await call('/friends/list', BIA)).data;
  assert.equal(l.friends.length, 0, 'ainda não são amigas');
  assert.equal(l.requests.length, 1);
  await call('/friends/answer', BIA, { from: ANA, ok: true });
  l = (await call('/friends/list', BIA)).data;
  assert.equal(l.friends.length, 1);
  assert.equal(l.requests.length, 0);
  assert.equal((await call('/friends/list', ANA)).data.friends[0].uid, BIA, 'a amizade vale para as duas');
});

test('recusar não cria amizade; abrir o próprio convite não faz nada; convite inválido avisa', async () => {
  const { token } = (await call('/friends/link', ANA)).data;
  await call('/friends/open', CIC, { token });
  await call('/friends/answer', CIC, { from: ANA, ok: false });
  assert.equal((await call('/friends/list', CIC)).data.friends.length, 0);
  assert.equal((await call('/friends/open', ANA, { token })).data.self, true);
  assert.equal((await call('/friends/open', CIC, { token: 'naoexiste123' })).status, 404);
  assert.equal((await call('/friends/answer', CIC, { from: 'quemnaopediu01', ok: true })).status, 404, 'não dá para virar amigo sem pedido');
});

test('remover desfaz a amizade dos dois lados', async () => {
  await call('/friends/remove', BIA, { uid: ANA });
  assert.equal((await call('/friends/list', BIA)).data.friends.length, 0);
  assert.equal((await call('/friends/list', ANA)).data.friends.length, 0);
});
