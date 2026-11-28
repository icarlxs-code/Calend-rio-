import { test } from 'node:test';
import assert from 'node:assert/strict';
import { falaTabela, falaProximo } from '../src/fut-papo.js';
const tab = Array.from({ length: 20 }, (_, i) => ({ posicao: i + 1, pontos: 70 - i * 3, time: { time_id: 100 + i } }));
test('tabela: líder, G4, perto do G4, perto do Z4 e dentro do Z4, com números de verdade', () => {
  assert.match(falaTabela('Fluminense', tab, 100), /líder|Líder/);
  assert.match(falaTabela('Fluminense', tab, 102), /G4/);
  assert.match(falaTabela('Fluminense', tab, 104), /G4/);
  assert.match(falaTabela('Fluminense', tab, 114), /Z4/);
  assert.match(falaTabela('Fluminense', tab, 118), /rebaixamento|Z4/);
  assert.equal(falaTabela('X', tab, 999), null, 'time fora da tabela: não fala');
});
test('próximo jogo: só de 1 a 7 dias, nunca hoje', () => {
  const now = Date.parse('2026-11-28T15:00:00-03:00');
  const j = { at: Date.parse('2026-12-02T21:30:00-03:00'), c: 'flu', f: 'fla', casa: 'Fluminense', fora: 'Flamengo' };
  assert.match(falaProximo('Fluminense', j, 'flu', now), /Flamengo/);
  assert.equal(falaProximo('Fluminense', { ...j, at: now + 3 * 3600e3 }, 'flu', now), null);
});
