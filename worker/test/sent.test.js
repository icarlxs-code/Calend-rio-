import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runSchedule, runPersonal } from '../src/index.js';

const mkEnv = (kv) => ({ TEAM: '[{"id":"henrique","name":"Henrique"},{"id":"matheus","name":"Matheus"}]', CAL: { get: async (k, t) => (kv[k] ? (t === 'json' ? JSON.parse(kv[k]) : kv[k]) : null), put: async (k, v) => (kv[k] = v) } });

test('lembrete de trabalho: manda uma vez só, mesmo se o app regravar a lista', async () => {
  const now = Date.now();
  const kv = { schedule: JSON.stringify({ items: [{ id: 'a', at: now - 1000, member: 'henrique', title: 't', body: 'b' }] }), subs: '{}', vapid: JSON.stringify({ publicKey: 'x', privateKey: 'y' }) };
  const env = mkEnv(kv);
  assert.equal(await runSchedule(env), 1);
  kv.schedule = JSON.stringify({ items: [{ id: 'a', at: now - 1000, member: 'henrique', title: 't', body: 'b' }] }); // app regrava
  assert.equal(await runSchedule(env), 0);
  assert.ok(JSON.parse(kv['schedule-sent']).a);
});

test('lembrete pessoal: lê o formato novo e o antigo, e não repete', async () => {
  const now = Date.now();
  const kv = { 'pitems:henrique': JSON.stringify([{ id: 'p1', at: now - 1000, title: 't', body: 'b' }]), personal: JSON.stringify({ byMember: { matheus: [{ id: 'p2', at: now - 1000, title: 't', body: 'b' }] }, sent: {} }), subs: '{}', vapid: JSON.stringify({ publicKey: 'x', privateKey: 'y' }) };
  const env = mkEnv(kv);
  assert.equal(await runPersonal(env), 2);
  assert.equal(await runPersonal(env), 0);
});
