import './_base.js';
import { test } from 'node:test';
import assert from 'node:assert/strict';
const { proxima, PERGUNTAS } = await import('../js/views/completa.js');
test('pergunta o que falta, uma por vez, e respeita o intervalo e o "prefiro não dizer"', () => {
  const agora = Date.parse('2026-11-28T12:00:00Z');
  assert.equal(proxima({}, {}, agora).k, 'nickname');
  assert.equal(proxima({ nickname: 'Nat' }, {}, agora).k, 'pronoun');
  assert.equal(proxima({ nickname: 'Nat', pronoun: 'f' }, { nao: ['birth'] }, agora).k, 'cidade', 'pulou o que ela não quis dizer');
  assert.equal(proxima({ nickname: 'Nat', pronoun: 'f', naoDizer: ['birth'], cidade: 'Rio', uf: 'RJ' }, {}, agora), null, 'nada falta');
  assert.equal(proxima({}, { ultima: agora - 3600e3 }, agora), null, 'perguntou há 1 hora: espera');
  assert.equal(proxima({}, { ultima: agora - 7 * 3600e3 }, agora).k, 'nickname', 'passaram 6 horas: pergunta de novo');
  assert.deepEqual(PERGUNTAS.map((q) => q.k), ['nickname', 'pronoun', 'birth', 'cidade']);
});
