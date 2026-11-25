import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { conta, numero, rotulo, anel, bolinha, pulsa } from '../js/anel.js';
import { criarItemLook, criarClassificador } from '../js/classificar.js';
import DIC from '../js/icones-dicionario.js';
const r = (...v) => ({ uid: 'u', stories: v.map((seen, i) => ({ id: 's' + i, seen })) });
test('anel: um traço por story, número do que falta, rótulos', () => {
  assert.equal((anel(r(0, 0, 0)).match(/<circle/g) || []).length, 3); assert.match(bolinha(r(0, 0, 0)), />3</); assert.equal(rotulo(r(0, 0, 0), 'Ana'), '3 stories novos de Ana'); assert.equal(rotulo(r(0), 'Caio'), '1 story novo de Caio');
  const p = r(1, 0, 0); assert.equal(conta(p).estado, 'parcial'); assert.match(bolinha(p), />2</); assert.equal((anel(p).match(/is-v/g) || []).length, 1);
  assert.equal(bolinha(r(1, 1)), ''); assert.equal(rotulo(r(1), 'Ana'), 'Story de Ana, já visto'); assert.equal(numero(10), '9+'); assert.equal(rotulo(r(0), '', true), 'Seu story, 1 no ar'); assert.equal(rotulo(r(), '', true), 'Novo story'); assert.match(anel(r()), /anel--vazio/);
  assert.match(anel(r(1, 1), { meu: true }), /url\(#/); assert.equal(pulsa(r(0)), '');
});
test('ícones pelo texto', () => {
  const look = criarItemLook(DIC), L = (t) => look(t, '');
  assert.equal(L('Levar no hospital').ic, 'hospital'); assert.equal(L('Buscar Ana').ic, 'car'); assert.equal(L('Buscar Ana').fantasia, 'motorista'); assert.equal(L('Cortar cabelo').ic, 'scissors'); assert.equal(L('Cortar cabelo').fantasia, 'barbeiro'); assert.equal(L('dentsta 15h').ic, 'tooth'); assert.equal(L('levar o cachorro no veterinário').ic, 'vet'); assert.equal(L('xyz'), null);
  for (const t of ['apagar a luz', 'acender a luz da varanda', 'luz do quarto', 'desligar a luz']) assert.equal(L(t).cat, 'casa-rotina', t);
  for (const t of ['conta de luz', 'pagar luz', 'Enel vence dia 12', 'pagar a Light']) assert.equal(L(t).cat, 'conta-luz', t);
  for (const t of ['coca light no mercado', 'comprar requeijão light']) assert.notEqual(L(t)?.cat, 'conta-luz', t);
});
test('todo símbolo do dicionário existe e o motor é rápido', async () => {
  const src = readFileSync(new URL('../js/icons.js', import.meta.url), 'utf8');
  for (const s of new Set(DIC.categorias.map((c) => c.simbolo))) assert.match(src, new RegExp(`(^|[\\s,{"'])${s}["']?: ?['"\`]`, 'm'), s);
  const c = criarClassificador(DIC), t0 = performance.now(); for (let i = 0; i < 5000; i++) c('buscar as crianças na escola ' + i); assert.ok((performance.now() - t0) / 5000 < 1);
});
