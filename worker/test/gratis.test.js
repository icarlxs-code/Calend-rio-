/* Lançamento: tudo grátis até 31/12/2026 23:59 (Brasília) para quem não tem plano; quem pagou continua com o plano. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { statusOf, untilOf, FREE_UNTIL_DEFAULT } from '../src/billing.js';
const me = { ws: 'uidGratis000001' };
test('até 31/12/2026: conta sem plano, com teste vencido ou negado fica liberada (IA inclusa)', () => {
  const now = Date.UTC(2026, 10, 23);
  for (const b of [null, { trialEndsAt: now - 864e5 }, { trialDenied: 'cpf' }]) {
    const st = statusOf(b, me, now);
    assert.equal(st.plan, 'gratis'); assert.equal(st.active, true); assert.equal(st.tier, 'pro');
    assert.equal(untilOf(st, now), FREE_UNTIL_DEFAULT);
  }
  assert.equal(new Date(FREE_UNTIL_DEFAULT).toISOString(), '2027-01-01T03:00:00.000Z', '= 31/12/2026 às 24h de Brasília');
  assert.equal(statusOf({ lifetime: true }, me, now).plan, 'lifetime', 'quem pagou continua com o plano');
});
test('a partir de 01/01/2027 volta a cobrança', () => {
  const now = Date.UTC(2027, 0, 1, 3, 0, 1);
  assert.equal(statusOf(null, me, now).active, false);
  assert.equal(statusOf({ trialEndsAt: 1 }, me, now).plan, 'expired');
});
