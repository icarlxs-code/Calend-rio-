import { test } from 'node:test';
import assert from 'node:assert/strict';
import { recordAct, getBoard, suspicious, weekKey, monthlyAward } from '../src/rank.js';
const kv = () => { const m = new Map(); return { get: async (k, t) => { const v = m.get(k); return v == null ? null : t === 'json' ? JSON.parse(v) : v; }, put: async (k, v) => m.set(k, v), m }; };
const monthly = { plan: 'monthly', active: true };
const at = (s) => Date.parse(`2026-11-${s}-03:00`);

test('só plano mensal pontua; o mesmo item não pontua duas vezes', async () => {
  const env = { CAL: kv() };
  const me = { ws: 'u1', id: 'u1', name: 'Ana' };
  assert.equal((await recordAct(env, me, { plan: 'lifetime', active: true }, { type: 'create', ref: 'ev_1' })).ok, false);
  let r = await recordAct(env, me, monthly, { type: 'create', ref: 'ev_1' }, at('18T10:00:00'));
  assert.equal(r.added, 3);
  r = await recordAct(env, me, monthly, { type: 'create', ref: 'ev_1' }, at('18T10:01:00'));
  assert.equal(r.added, 0);
  r = await recordAct(env, me, monthly, { type: 'create', ref: 'ev_2' }, at('18T10:01:03'));
  assert.equal(r.added, 0, 'menos de 6 s depois não pontua');
});

test('teto por hora e por dia', async () => {
  const env = { CAL: kv() };
  const me = { ws: 'u2', id: 'u2', name: 'Bia' };
  let total = 0;
  for (let i = 0; i < 40; i++) total += (await recordAct(env, me, monthly, { type: 'create', ref: `e_${i}` }, at('18T10:00:00') + i * 61e3 + (i % 7) * 9e3)).added || 0;
  assert.ok(total <= 18, `hora: ${total}`);
});

test('robô (ritmo perfeitamente regular) sai do ranking; ninguém vê nome nem foto', async () => {
  const env = { CAL: kv() };
  const bot = { ws: 'bot', id: 'bot', name: 'Robo' }, gente = { ws: 'gente', id: 'gente', name: 'Carla' };
  for (let i = 0; i < 30; i++) await recordAct(env, bot, monthly, { type: 'done', ref: `d_${i}` }, at('18T08:00:00') + i * 300e3);
  for (let i = 0; i < 5; i++) await recordAct(env, gente, monthly, { type: 'create', ref: `x_${i}` }, at('18T09:00:00') + i * 400e3 + i * i * 37e3);
  const b = await getBoard(env, gente, at('18T12:00:00'));
  assert.equal(b.top.length, 1);
  assert.equal(b.top[0].i, 'C');
  assert.ok(!('name' in b.top[0]) && !('photo' in b.top[0]));
  assert.ok(suspicious(Array.from({ length: 30 }, (_, i) => i * 300e3), 30 * 300e3));
});

test('dia 1: campeão do mês ganha cupom de 100% na assinatura', async () => {
  const env = { CAL: kv() };
  const me = { ws: 'w1', id: 'uw1', name: 'Duda' };
  for (let i = 0; i < 4; i++) await recordAct(env, me, monthly, { type: 'create', ref: `c_${i}` }, Date.parse('2026-11-09T10:00:00-03:00') + i * 500e3 + i * i * 41e3);
  await env.CAL.put('bill:w1', JSON.stringify({ subActive: true, subscription: 'sub_1' }));
  const calls = [];
  const deps = { stripe: async (_e, path, params) => { calls.push([path, params]); return { id: 'cp_1' }; }, getBill: async (e, ws) => JSON.parse(await e.CAL.get(`bill:${ws}`)), putBill: async (e, ws, b) => e.CAL.put(`bill:${ws}`, JSON.stringify(b)), notify: async () => 1 };
  const r = await monthlyAward(env, deps, Date.parse('2026-12-01T00:10:00-03:00'));
  assert.equal(r.ws, 'w1'); assert.equal(r.applied, true);
  assert.equal(calls[1][0], 'subscriptions/sub_1');
  assert.equal(await monthlyAward(env, deps, Date.parse('2026-12-01T00:20:00-03:00')), null, 'só uma vez por mês');
  assert.equal(weekKey(Date.parse('2026-11-22T23:00:00-03:00')), '2026-11-16');
});
