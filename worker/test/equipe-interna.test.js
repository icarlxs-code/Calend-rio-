/* Equipe interna: o dono cadastra pessoas com cargos; cada cargo só alcança o que precisa (menor acesso). */
import { test } from 'node:test';
import assert from 'node:assert/strict';
const { handle } = await import('../src/index.js');
const kv = new Map();
const env = {
  CAL: { get: async (k, t) => (kv.has(k) ? (t === 'json' ? JSON.parse(kv.get(k)) : kv.get(k)) : null), put: async (k, v) => kv.set(k, v), delete: async (k) => kv.delete(k), scan: async (p) => [...kv.entries()].filter(([k]) => k.startsWith(p)) },
  TEAM: '[]', ADMIN_EMAIL: 'dono@teste.local', PROJECT_ID: 'demo', ALLOW_EMULATOR_TOKENS: '1', ALLOWED_ORIGINS: 'https://meulembra.com.br',
};
globalThis.fetch = async () => new Response(null, { status: 201 });
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
const tok = (uid, email) => `${b64({ alg: 'none' })}.${b64({ email, user_id: uid, sub: uid, exp: Math.floor(Date.now() / 1000) + 3600 })}.`;
const call = async (path, [uid, email], body = {}) => {
  const res = await handle(new Request(`https://w.dev${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://meulembra.com.br', Authorization: `Bearer ${tok(uid, email)}` }, body: JSON.stringify({ ws: '', ...body }) }), env);
  return { status: res.status, data: await res.json().catch(() => null) };
};
const DONO = ['donoUid00000001', 'dono@teste.local'], SUP = ['supUid000000001', 'sup@teste.local'], MKT = ['mktUid000000001', 'mkt@teste.local'], ZE = ['zeUid0000000001', 'ze@teste.local'];

test('dono cadastra cargos; cada cargo só alcança o que precisa', async () => {
  assert.deepEqual((await call('/staff/me', ZE)).data.perms, [], 'usuário comum não é equipe');
  assert.equal((await call('/staff/metrics', ZE)).status, 403);
  assert.equal((await call('/staff/set', SUP, { email: 'x@teste.local', cargos: ['admin'] })).status, 403, 'só o dono mexe na equipe');
  assert.equal((await call('/staff/set', DONO, { email: 'sup@teste.local', nome: 'Sup', cargos: ['suporte'] })).status, 200);
  assert.equal((await call('/staff/set', DONO, { email: 'mkt@teste.local', cargos: ['marketing', 'inventado'] })).status, 200);
  assert.deepEqual((await call('/staff/me', SUP)).data.perms, ['suporte']);
  assert.equal((await call('/support/inbox', SUP)).status, 200, 'suporte atende o chat');
  assert.equal((await call('/support/inbox', MKT)).status, 403, 'marketing não lê conversas');
  assert.equal((await call('/staff/metrics', SUP)).status, 403, 'suporte não vê métricas');
  const m = (await call('/staff/metrics', MKT)).data.m;
  assert.equal(typeof m.contas, 'number'); assert.ok(m.ativos && m.social);
  assert.ok(!/@|cpf|phone/i.test(JSON.stringify(m)), 'métricas sem dado pessoal');
  assert.equal((await call('/staff/reports', MKT)).status, 403);
  assert.equal((await call('/billing/all', MKT)).status, 403, 'marketing não vê receita');
  await call('/staff/remove', DONO, { email: 'sup@teste.local' });
  assert.equal((await call('/support/inbox', SUP)).status, 403, 'tirou da equipe → perde o acesso na hora');
});

test('moderação: vê denúncias sem saber quem denunciou e tira o story do ar', async () => {
  await call('/staff/set', DONO, { email: 'sup@teste.local', cargos: ['moderacao'] });
  kv.set('stories:alvoUid00000001', JSON.stringify([{ id: 'st1', at: Date.now(), views: {} }])); kv.set('storyimg:st1', 'data:image/jpeg;base64,AA');
  kv.set('card:alvoUid00000001', JSON.stringify({ name: 'Alvo' }));
  kv.set('reports', JSON.stringify([{ by: 'denuncianteUid01', owner: 'alvoUid00000001', id: 'st1', motivo: 'Spam ou golpe', at: Date.now() }]));
  const r = (await call('/staff/reports', SUP)).data.rows;
  assert.equal(r[0].alvo, 'Alvo'); assert.equal(r[0].storyNoAr, true);
  assert.ok(!JSON.stringify(r).includes('denuncianteUid01'), 'quem denunciou fica anônimo');
  await call('/staff/report-action', SUP, { i: 0, acao: 'remover' });
  assert.equal(kv.has('storyimg:st1'), false);
  assert.equal((await call('/staff/reports', SUP)).data.rows[0].resolvida.acao, 'removido');
});
