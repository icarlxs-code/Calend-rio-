import { test } from 'node:test';
import assert from 'node:assert/strict';
import { agruparInicio, occursOn, selo } from '../js/inicio-pessoal.js';
const ag = new Date(2026, 10, 25, 11, 47);
const ev = (o) => ({ id: o.id || 'x', title: 't', cat: 'lembrete', repeat: 'none', ...o });
test('diários uma vez só, com selo e próxima; único em destaque', () => {
  const G = agruparInicio([ev({ id: 'a', date: '2026-11-01', time: '07:30', repeat: 'daily', doneDates: ['2026-11-25'] }), ev({ id: 'b', date: '2026-11-01', time: '22:00', repeat: 'daily' }), ev({ id: 'c', date: '2026-11-30', time: '14:00' })], ag);
  assert.deepEqual(G.rotina.map((r) => [r.item.id, r.selo, r.proxima, r.feitoHoje]), [['a', 'todo dia 7h30', '2026-11-26', true], ['b', 'todo dia 22h', '2026-11-25', false]]);
  assert.equal(G.amanha.length, 0); assert.equal(G.semana.length, 1); assert.equal(G.destaque.item.id, 'c');
});
test('semanal, quinzenal, único de hoje que já passou, until, feito e sem hora', () => {
  const G = agruparInicio([ev({ id: 's', date: '2026-11-02', time: '09:00', repeat: 'weekly' }), ev({ id: 'q', date: '2026-11-12', repeat: 'biweekly' }), ev({ id: 'h', date: '2026-11-25', time: '08:00' }), ev({ id: 'u', date: '2026-01-01', repeat: 'weekly', until: '2026-11-20' }), ev({ id: 'f', date: '2026-11-28', done: true }), ev({ id: 'z', date: '2026-11-25' })], ag);
  assert.deepEqual(G.hoje.map((o) => o.item.id), ['h', 'z']); assert.deepEqual(G.amanha.map((o) => o.item.id), ['q']); assert.deepEqual(G.semana.map((o) => o.item.id), ['s']);
  assert.equal(G.semana[0].selo, 'toda segunda 9h'); assert.equal(G.depois.length, 0);
});
test('mensal no fim do mês', () => {
  for (const n of [28, 29, 30, 31]) for (let m = 0; m < 24; m++) { const y = 2026 + Math.floor(m / 12), mm = (m % 12) + 1, ult = new Date(y, mm, 0).getDate(); const L = []; for (let d = 1; d <= ult; d++) { const k = `${y}-${String(mm).padStart(2, '0')}-${String(d).padStart(2, '0')}`; if (occursOn(ev({ date: `2025-12-${n}`, repeat: 'monthly' }), k)) L.push(d); } assert.deepEqual(L, [Math.min(n, ult)]); }
  assert.ok(occursOn(ev({ date: '2026-01-29', repeat: 'monthly' }), '2028-02-29')); assert.ok(!occursOn(ev({ date: '2026-01-29', repeat: 'monthly' }), '2028-02-28')); assert.ok(!occursOn(ev({ date: '2026-03-31', repeat: 'monthly' }), '2026-02-28'));
  assert.equal(agruparInicio([ev({ date: '2026-01-31', repeat: 'monthly' })], ag).semana[0].date, '2026-11-30');
});
test('virada do dia e 50 diários', () => {
  const L = [ev({ id: 'a', date: '2026-11-26', time: '09:00' }), ...Array.from({ length: 50 }, (_, i) => ev({ id: 'd' + i, date: '2026-01-01', repeat: 'daily', doneDates: ['2026-11-25'] }))];
  const A = agruparInicio(L, new Date(2026, 10, 25, 23, 59, 30)), B = agruparInicio(L, new Date(2026, 10, 26, 0, 0, 30));
  assert.equal(A.amanha.length, 1); assert.equal(B.hoje.length, 1); assert.ok(A.rotina[0].feitoHoje && !B.rotina[0].feitoHoje); assert.equal(B.rotina.length, 50);
  assert.equal(selo(ev({ date: '2026-11-29', repeat: 'weekly' })), 'todo domingo');
});
