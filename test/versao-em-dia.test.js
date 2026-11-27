import { test } from 'node:test';
import assert from 'node:assert/strict';
import { emDia, cmpV } from '../js/versao-em-dia.js';

const pub = { version: '2.33.0', build: 'novo1234' };
test('mesmo número com build antigo é desatualizado (o caso do 2.32.0 repetido)', () => {
  assert.equal(emDia({ v: '2.33.0', b: 'velho999' }, pub), false);
  assert.equal(emDia({ v: '2.32.0', b: 'ogiapgzr' }, { version: '2.32.0', build: 'xemudadl' }), false);
});
test('mesmo build, número menor, maior e sem dados', () => {
  assert.equal(emDia({ v: '2.33.0', b: 'novo1234' }, pub), true);
  assert.equal(emDia({ v: '2.31.4', b: 'qualquer' }, pub), false);
  assert.equal(emDia({ v: '2.34.0', b: 'outro' }, pub), true);
  assert.equal(emDia(null, pub), false);
  assert.equal(emDia({ v: '2.0.0', b: 'x' }, null), true);
});
test('compara número a número (2.10.0 > 2.9.3)', () => {
  assert.equal(cmpV('2.10.0', '2.9.3'), 1);
  assert.equal(cmpV('2.30.0', '2.33.0'), -1);
  assert.equal(cmpV('2.33.0', '2.33.0'), 0);
});
