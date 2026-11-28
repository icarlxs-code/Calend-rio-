import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chamada, venceu } from '../src/fut-noticia.js';
test('a chamada combina com a notícia: derrota não vira "notícia boa"', () => {
  assert.equal(venceu('kaio jorge marca, cruzeiro vence fluminense', 'Fluminense'), false);
  assert.equal(venceu('fluminense vence o vasco', 'Fluminense'), true);
  assert.match(chamada('Fluminense', 'Cruzeiro vence Fluminense e garante 3º lugar'), /Doeu|difícil|reagir/);
  assert.match(chamada('Fluminense', 'Thiago Silva renova com Fluminense para 2027'), /REFORÇO|Acabou de sair|Bomba/);
  assert.match(chamada('Fluminense', 'Hulk é vaiado pela torcida e dispara'), /Treta|esquentou|aconteceu/);
});
