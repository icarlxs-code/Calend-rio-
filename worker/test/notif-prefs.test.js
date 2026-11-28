import { test } from 'node:test';
import assert from 'node:assert/strict';
import { limpaNp, quer, limiteDia, somaEnvio, taxa } from '../src/notif-prefs.js';
test('sem escolha: tudo ligado e nível normal; escolha da pessoa é respeitada', () => {
  assert.equal(quer(null, 'story'), true);
  assert.equal(quer({ cats: { story: false } }, 'story'), false);
  assert.equal(limpaNp({ freq: 'pouco' }).freq, 'pouco');
  assert.equal(limpaNp({ freq: 'qualquer' }).freq, 'normal');
});
test('limite do dia segue o nível e cai quando a pessoa quase nunca abre', () => {
  assert.equal(limiteDia({ freq: 'muito' }, 'agua'), 10);
  let m = {}; for (let i = 0; i < 14; i++) m = somaEnvio(m, 'agua');
  assert.equal(limiteDia({ freq: 'normal' }, 'agua', m), 3, 'metade do normal quando ignorado');
  m = somaEnvio(m, 'agua', true); assert.equal(taxa(m, 'agua'), 0.07);
});
