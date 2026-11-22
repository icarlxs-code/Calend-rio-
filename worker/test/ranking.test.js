/* Ranking mundial: geral (XP de sempre) e mensal (zera todo mês); posição de cada um; anti-trapaça */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { boardOf, monthKey } from '../src/leaderboard.js';
const kv = new Map();
const env = { CAL: { get: async (k, t) => (kv.has(k) ? (t === 'json' ? JSON.parse(kv.get(k)) : kv.get(k)) : null), put: async (k, v) => kv.set(k, v), delete: async (k) => kv.delete(k) } };
const B = boardOf(env);
const NOW = Date.parse('2026-11-20T15:00:00-03:00');

test('posição geral e mensal de cada pessoa, com o top', async () => {
  const mon = monthKey(NOW);
  for (let i = 1; i <= 700; i++) await B.report(`user${String(i).padStart(4, '0')}`, { name: `P${i}`, xp: i * 10, mxp: (701 - i) * 3, month: mon, level: 3 }, NOW);
  const all = await B.view('user0102', 'all', { now: NOW });
  assert.equal(all.total, 700);
  assert.equal(all.top[0].name, 'P700');
  assert.equal(all.me.pos, 599, 'quem tem 1.020 XP fica em 599º');
  assert.equal(all.me.points, 1020);
  assert.equal(all.above.points, 1030);
  const m = await B.view('user0102', 'month', { now: NOW });
  assert.equal(m.top[0].name, 'P1', 'no mês, quem mais pontuou no mês');
  assert.equal(m.me.pos, 102);
});
test('o mensal zera quando o mês vira; o geral continua', async () => {
  const next = Date.parse('2026-12-01T10:00:00-03:00');
  const m = await B.view('user0102', 'month', { now: next });
  assert.equal(m.total, 0);
  assert.equal(m.me.points, 0);
  assert.equal((await B.view('user0102', 'all', { now: next })).me.points, 1020);
  await B.report('user0102', { name: 'P102', xp: 1100, mxp: 80, month: monthKey(next) }, next);
  const m2 = await B.view('user0102', 'month', { now: next });
  assert.equal(m2.me.pos, 1); assert.equal(m2.me.points, 80);
});
test('anti-trapaça: XP só sobe e no máximo 3.000 por dia', async () => {
  const t = Date.parse('2026-12-02T10:00:00-03:00');
  await B.report('user0102', { xp: 99999999, mxp: 99999999, month: monthKey(t) }, t);
  const v = await B.view('user0102', 'all', { now: t });
  assert.equal(v.me.points, 1100 + 3000);
  await B.report('user0102', { xp: 10, month: monthKey(t) }, t);
  assert.equal((await B.view('user0102', 'all', { now: t })).me.points, 4100, 'nunca desce');
});
test('quem escolhe ficar anônimo aparece sem nome e sem foto', async () => {
  await B.report('user0700', { name: 'P700', xp: 7000, hide: true }, NOW);
  const v = await B.view('user0001', 'all', { now: NOW });
  assert.equal(v.top[0].name, 'Pessoa anônima');
  assert.equal(v.top[0].photo, null);
});
