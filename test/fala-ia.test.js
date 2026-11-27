import './_base.js';
import { test } from 'node:test';
import assert from 'node:assert/strict';
const F = await import('../js/fala-ia.js');
const P = await import('../js/personal.js');
test('aprende do que a pessoa gosta (tocou sobe, dispensou desce)', () => {
  F.gostou('vida-filho', 2); F.gostou('vida-filho', 2); F.gostou('late-1', -1);
  assert.ok(F.gostoDe('vida-filho') > 3); assert.ok(F.gostoDe('late') < 0);
  assert.deepEqual(F.preferidos(), ['filhos']);
});
test('frase do dia: três por dia, todas diferentes; a da IA entra no lugar quando chega', () => {
  const k = '2026-11-28', q = [0, 1, 2].map((t) => P.quoteOfDay(k, t).t);
  assert.equal(new Set(q).size, 3);
  localStorage.setItem(`lembra.fala.${k}.tarde`, JSON.stringify({ t: 'Fala da IA só para você', at: 1 }));
  assert.equal(P.quoteOfDay(k, 1).t, 'Fala da IA só para você');
  assert.equal(P.quoteOfDay(k, 0).t, q[0]);
});
