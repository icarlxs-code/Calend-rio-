import { test } from 'node:test';
import assert from 'node:assert/strict';
import { recordAct, getBoard, suspicious, weekKey, monthlyAward, streakOf } from '../src/rank.js';
const kv = () => { const m = new Map(); return { get: async (k, t) => { const v = m.get(k); return v == null ? null : t === 'json' ? JSON.parse(v) : v; }, put: async (k, v) => m.set(k, v), m }; };
const pro = { plan: 'monthly', active: true, tier: 'pro' };
const at = (s) => Date.parse(`2026-11-${s}-03:00`);

test('só o Profissional (mensal/anual) participa; Essencial e vitalício não', async () => {
  const env = { CAL: kv() }, me = { ws: 'u1', id: 'u1', name: 'Ana' };
  assert.equal((await recordAct(env, me, { plan: 'monthly', active: true, tier: 'essencial' }, { type: 'create', ref: 'ev_1' })).ok, false);
  assert.equal((await recordAct(env, me, { plan: 'lifetime', active: true, tier: 'pro' }, { type: 'create', ref: 'ev_1' })).ok, false);
});

test('qualidade vale mais: concluir no horário 3, atrasado 1; 1º uso do dia +2; item pontua 1 vez', async () => {
  const env = { CAL: kv() }, me = { ws: 'u1', id: 'u1', name: 'Ana' };
  let r = await recordAct(env, me, pro, { type: 'done', ref: 'ev_1', ontime: true }, at('18T10:00:00'));
  assert.equal(r.added, 5);
  r = await recordAct(env, me, pro, { type: 'done', ref: 'ev_2', ontime: false }, at('18T10:01:00'));
  assert.equal(r.added, 1);
  r = await recordAct(env, me, pro, { type: 'done', ref: 'ev_2', ontime: true }, at('18T10:02:00'));
  assert.equal(r.added, 0, 'mesmo item');
});

test('ligas: só vê o próprio grupo, com iniciais; robô sai do ranking', async () => {
  const env = { CAL: kv() };
  const bot = { ws: 'bot', id: 'bot', name: 'Robo' }, gente = { ws: 'gente', id: 'gente', name: 'Carla' };
  for (let i = 0; i < 30; i++) await recordAct(env, bot, pro, { type: 'done', ref: `d_${i}` }, at('18T08:00:00') + i * 300e3);
  for (let i = 0; i < 5; i++) await recordAct(env, gente, pro, { type: 'done', ref: `x_${i}` }, at('18T09:00:00') + i * 400e3 + i * i * 37e3);
  const b = await getBoard(env, gente, at('18T12:00:00'));
  assert.equal(b.league, 'bronze');
  assert.equal(b.top.length, 1);
  assert.equal(b.top[0].i, 'C');
  assert.ok(suspicious(Array.from({ length: 30 }, (_, i) => i * 300e3), 30 * 300e3));
});

test('sobe de liga na semana seguinte se ficar entre os 5 primeiros', async () => {
  const env = { CAL: kv() }, me = { ws: 'w1', id: 'w1', name: 'Duda' };
  await recordAct(env, me, pro, { type: 'done', ref: 'ev_a1' }, Date.parse('2026-11-10T10:00:00-03:00'));
  await recordAct(env, me, pro, { type: 'done', ref: 'ev_a2' }, Date.parse('2026-11-17T10:00:00-03:00'));
  const b = await getBoard(env, me, Date.parse('2026-11-17T12:00:00-03:00'));
  assert.equal(b.league, 'prata');
});

test('sequência com 1 dia de proteção', () => {
  assert.equal(streakOf(['2026-11-18', '2026-11-19', '2026-11-20'], '2026-11-20'), 3);
  assert.equal(streakOf(['2026-11-17', '2026-11-18', '2026-11-20'], '2026-11-20'), 3, 'um dia de folga não quebra');
  assert.equal(streakOf(['2026-11-10'], '2026-11-20'), 0);
});

test('dia 1º: top 3 ganham 100/50/25% e cada um só 1 prêmio a cada 90 dias', async () => {
  const env = { CAL: kv() };
  const people = ['a', 'b', 'c', 'd'].map((x, k) => ({ ws: x, id: 'id' + x, name: x.toUpperCase(), n: 5 - k }));
  for (const p of people) {
    for (let i = 0; i < p.n; i++) await recordAct(env, p, pro, { type: 'done', ref: `${p.ws}_${i}` }, Date.parse('2026-11-09T10:00:00-03:00') + i * 500e3 + i * i * 41e3);
    await env.CAL.put(`bill:${p.ws}`, JSON.stringify({ subActive: true, subscription: 'sub_' + p.ws }));
  }
  const calls = [];
  const deps = { stripe: async (_e, path, params) => { calls.push([path, params]); return { id: 'cp_' + (params.percent_off || '') }; }, getBill: async (e, ws) => JSON.parse(await e.CAL.get(`bill:${ws}`)), putBill: async (e, ws, b) => e.CAL.put(`bill:${ws}`, JSON.stringify(b)), notify: async () => 1 };
  const r = await monthlyAward(env, deps, Date.parse('2026-12-01T00:10:00-03:00'));
  assert.deepEqual(r.winners.map((w) => [w.ws, w.pct]), [['a', 100], ['b', 50], ['c', 25]]);
  assert.equal(await monthlyAward(env, deps, Date.parse('2026-12-01T00:20:00-03:00')), null, 'só uma vez por mês');
  assert.equal(weekKey(Date.parse('2026-11-22T23:00:00-03:00')), '2026-11-16');
});
