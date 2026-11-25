import { test } from 'node:test';
import assert from 'node:assert/strict';
import { purgaLixeira, podePurgar } from '../src/lixeira.js';
const N = 1795000000000, H = 36e5, d = (o = {}, name = 'projects/p/databases/(default)/documents/ws/u/events/e') => ({ name, updateTime: 't1', fields: { title: { stringValue: 'x' }, deletedAt: { integerValue: String(N - 25 * H) }, purgeAt: { integerValue: String(N - H) }, ...o } });
test('só apaga o que tem marca, venceu e é da agenda', () => {
  assert.ok(podePurgar(d(), N)); assert.ok(podePurgar(d({}, 'projects/p/databases/(default)/documents/pessoal/u/itens/i'), N)); assert.ok(podePurgar(d({}, 'projects/p/databases/(default)/documents/events/e'), N));
  for (const x of [d({ deletedAt: { nullValue: null } }), d({ purgeAt: { nullValue: null } }), d({ purgeAt: { integerValue: String(N + 1) } }), d({ deletedAt: { integerValue: String(N - 2 * H) } }), d({}, 'projects/p/databases/(default)/documents/users/u'), d({}, 'projects/p/databases/(default)/documents/ws/u/outra/e'), { ...d(), updateTime: '' }, {}]) assert.ok(!podePurgar(x, N));
});
test('sem credencial não faz nada; roda no máximo uma vez por hora; usa a versão lida', async () => {
  const m = new Map(), env = { CAL: { get: async (k) => m.get(k), put: async (k, v) => m.set(k, v) } }, calls = [];
  assert.equal((await purgaLixeira(env, N)).parou, 'sem credencial');
  Object.assign(env, { FIREBASE_SA: '{}', PROJECT_ID: 'p' }); const pega = async (u, o) => { const b = JSON.parse(o.body); calls.push([u.split(':').pop(), b]); return { ok: true, json: async () => (b.structuredQuery ? (b.structuredQuery.from[0].collectionId === 'events' ? [{ document: d() }, { document: d({ deletedAt: { nullValue: null } }) }, {}] : [{}]) : {}) }; };
  assert.equal((await purgaLixeira(env, N, { pega, tk: 'x' })).n, 1); const c = calls.filter((x) => x[0] === 'commit'); assert.equal(c.length, 1); assert.equal(c[0][1].writes[0].currentDocument.updateTime, 't1'); assert.equal((await purgaLixeira(env, N + 60e3, { pega, tk: 'x' })).parou, 'cedo');
});
