import { test } from 'node:test';
import assert from 'node:assert/strict';
import { humorDaFala } from '../js/humor-fala.js';
test('a cara combina com a fala', () => {
  assert.equal(humorDaFala('Já disse pra Ana o quanto gosta dela? Amor é cuidado ❤️', 0), 'apaixonado');
  assert.equal(humorDaFala('Pagar o aluguel · R$ 1.500', 0), 'rico');
  assert.equal(humorDaFala('GOL DO FLAMENGO! Que golaço!', 0), 'estrelado');
  assert.equal(humorDaFala('Perdemos por 2 a 1… levanta a cabeça', 0), 'chorando', 'tristeza vence a palavra "gol" ou "vitória"');
  assert.equal(humorDaFala('Boa noite! Descansa que amanhã tem mais', 0), 'sono');
  assert.equal(humorDaFala('Tá tranquilo, tá favorável 😎', 0), 'descolado');
  assert.equal(humorDaFala('Quer agendar alguma coisa?', 0), '', 'fala comum: fica a cara de sempre');
  assert.equal(humorDaFala('Pagar a conta de luz', 0.99), 'descolado', 'variação: nem sempre a mesma cara');
  assert.equal(humorDaFala('golfinho no aquário', 0), '', 'golfinho não é gol');
  assert.equal(humorDaFala('Que golaço!', 0), 'estrelado');
});
