import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ehConsulta, jaTem, limpaResposta } from '../js/intencao.js';

test('pergunta é consulta; pedido é pedido', () => {
  for (const q of ['tenho compromisso pra dezembro?', 'Quais são minhas coisas em dezembro', 'o que eu tenho amanhã?', 'quando é a neuro?', 'tô livre sexta à tarde?']) assert.equal(ehConsulta(q), true, q);
  for (const q of ['marca neuro dia 23/12', 'me lembra de pagar a luz amanhã', 'pode agendar dentista quinta?', 'anota que o tênis tá na mesa', 'quinta tenho dentista às 15h', 'apaga a reunião de amanhã']) assert.equal(ehConsulta(q), false, q);
});

test('não propõe de novo o que já está na agenda', () => {
  const ex = [{ title: 'Neuro psiquiatra', date: '2026-12-23' }];
  assert.equal(jaTem({ acao: 'pessoal', titulo: 'Neuro', data: '2026-12-23' }, ex), true);
  assert.equal(jaTem({ acao: 'pessoal', titulo: 'Dentista', data: '2026-12-23' }, ex), false);
  assert.equal(jaTem({ acao: 'pessoal', titulo: 'Neuro', data: '2026-12-30' }, ex), false);
});

test('tira o recado interno que a IA copiou', () => {
  assert.equal(limpaResposta('Só tem uma neuro em 23/12/2026 sem horário. (ações aguardando confirmação)'), 'Só tem uma neuro em 23/12/2026 sem horário.');
});
