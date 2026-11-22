/* Mudança de endereço do app (github.io → meulembra.com.br): o servidor aceita os dois endereços e
   o mesmo celular, ao ativar os avisos no endereço novo, não fica recebendo cada aviso duas vezes. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
const { handle } = await import('../src/index.js');

const kv = new Map();
const env = {
  CAL: { get: async (k, t) => (kv.has(k) ? (t === 'json' ? JSON.parse(kv.get(k)) : kv.get(k)) : null), put: async (k, v) => kv.set(k, v), delete: async (k) => kv.delete(k), scan: async (p) => [...kv.entries()].filter(([k]) => k.startsWith(p)) },
  TEAM: '[]', PROJECT_ID: 'demo', ALLOW_EMULATOR_TOKENS: '1',
  ALLOWED_ORIGINS: 'https://icarlxs-code.github.io,https://meulembra.com.br,https://www.meulembra.com.br',
};
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
const token = (uid) => `${b64({ alg: 'none' })}.${b64({ email: `${uid}@teste.local`, user_id: uid, sub: uid, exp: Math.floor(Date.now() / 1000) + 3600 })}.`;
const sub = (n) => ({ endpoint: `https://web.push.apple.com/${n}`, keys: { p256dh: 'BAAA' + n, auth: 'aa' + n } });
const call = async (path, { uid, origin, ua = 'iPhone Safari 18', body = {} }) => {
  const res = await handle(new Request(`https://w.dev${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: origin, 'User-Agent': ua, Authorization: `Bearer ${token(uid)}` }, body: JSON.stringify(body) }), env);
  return { status: res.status, cors: res.headers.get('Access-Control-Allow-Origin'), data: await res.json().catch(() => null) };
};
const subsOf = (uid) => Object.values(JSON.parse(kv.get('dev:u' + uid) || '{}'));

test('o servidor aceita chamadas dos dois endereços (antigo e novo)', async () => {
  for (const o of ['https://icarlxs-code.github.io', 'https://meulembra.com.br', 'https://www.meulembra.com.br']) {
    const r = await call('/billing/status', { uid: 'anaUid0000000001', origin: o });
    assert.equal(r.status, 200);
    assert.equal(r.cors, o);
  }
  assert.notEqual((await call('/billing/status', { uid: 'anaUid0000000001', origin: 'https://site-falso.com' })).cors, 'https://site-falso.com');
});

test('mesmo celular ativando os avisos no endereço novo: a inscrição antiga sai (sem aviso em dobro)', async () => {
  await call('/subscribe', { uid: 'anaUid0000000001', origin: 'https://icarlxs-code.github.io', body: { id: 'velho', subscription: sub('velho') } });
  await call('/subscribe', { uid: 'anaUid0000000001', origin: 'https://icarlxs-code.github.io', ua: 'Android Chrome', body: { id: 'outro', subscription: sub('outro') } });
  assert.equal(subsOf('anaUid0000000001').length, 2);
  await call('/subscribe', { uid: 'anaUid0000000001', origin: 'https://meulembra.com.br', body: { id: 'novo', subscription: sub('novo') } });
  const left = subsOf('anaUid0000000001').map((d) => d.subscription.endpoint.split('/').pop()).sort();
  assert.deepEqual(left, ['novo', 'outro'], 'sai só a do mesmo aparelho; o outro celular (ainda no endereço antigo) continua');
});
