/* O servidor segue o fuso de cada pessoa */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { brNow, fusoOk, instante, coachNextOpen } from '../src/coach.js';
import { nextNudge, amigoNextAt } from '../src/pcoach.js';
const { cleanProfile } = await import('../src/index.js');
const T = Date.parse('2026-11-26T03:30:00Z');
test('relógio por fuso', () => {
  assert.deepEqual(['America/Sao_Paulo', 'America/Manaus', 'America/Rio_Branco'].map((z) => { const b = brNow(T, z); return `${b.date} ${b.h}:${b.m}`; }), ['2026-11-26 0:30', '2026-11-25 23:30', '2026-11-25 22:30']);
  assert.equal(brNow(T, 'Mars/Base').h, 0, 'inválido cai em Brasília');
  assert.equal(instante('2026-11-25', '21:30', 'America/Rio_Branco'), Date.parse('2026-11-26T02:30:00Z'));
  assert.equal(instante('2026-07-01', '21:30', 'Europe/Lisbon'), Date.parse('2026-07-01T20:30:00Z'), 'horário de verão');
  for (const z of ['Mars/Base', '', 'x'.repeat(200), null, 5]) assert.equal(fusoOk(z), false);
  assert.equal(cleanProfile({ tz: 'America/Manaus', prefs: {} }, { name: 'A' }).tz, 'America/Manaus'); assert.equal(cleanProfile({ tz: 'Mars/Base', prefs: {} }, { name: 'A' }).tz, undefined);
});
test('bom-dia no horário da pessoa, dia vira à meia-noite dela', () => {
  for (const [z, off] of [['America/Sao_Paulo', 3], ['America/Manaus', 4], ['America/Rio_Branco', 5]]) {
    const p = { uid: 'u1', name: 'Ana', tz: z, prefs: { wake: '07:00', sleep: '22:00', perDay: 16 }, today: [], tomorrow: [] };
    const em = (h, m) => Date.parse('2026-11-25T00:00:00Z') + (h + off) * 3600e3 + m * 60e3;
    assert.equal(nextNudge(p, {}, em(6, 10)), null, `${z} antes de acordar`);
    let r = null; for (let m = 0; m <= 40 && !r; m += 5) r = nextNudge(p, {}, em(7, m));
    assert.ok(r, `${z} de manhã`); assert.equal(r.state.day, '2026-11-25');
    const n = coachNextOpen(em(23, 0), z); assert.ok(n >= em(32, 30) && n <= em(33, 11));
    assert.ok(amigoNextAt({ win: { start: 420, end: 1320 }, tz: z }, em(12, 0)) > em(12, 0));
  }
});
