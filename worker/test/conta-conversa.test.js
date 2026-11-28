import { test } from 'node:test';
import assert from 'node:assert/strict';
import { valorDe, diaDe, ehConta, novaConta, proximo, responde } from '../../js/conta-conversa.js';
test('entende valores do jeito que a pessoa fala', () => {
  assert.equal(valorDe('1500'), 1500); assert.equal(valorDe('R$ 1.500'), 1500); assert.equal(valorDe('1.200,50'), 1200.5);
  assert.equal(valorDe('mil e quinhentos'), 1500); assert.equal(valorDe('dois mil e duzentos'), 2200); assert.equal(valorDe('1,5 mil'), 1500);
  assert.equal(valorDe('não sei'), 0);
});
test('entende dia do mês', () => { assert.equal(diaDe('todo dia 10 eu pago'), 10); assert.equal(diaDe('dia dez'), 10); assert.equal(diaDe('nao sei'), 0); });
test('conversa completa do aluguel: valor, dia, agenda, pessoal, confirma', () => {
  const x = { texto: 'Todo dia 10 eu tenho que pagar meu aluguel', titulo: 'Pagar meu aluguel', repetir: 'monthly', diaMes: 10 };
  const t = x.texto;
  assert.equal(ehConta(x, t), true);
  let c = novaConta(x, t);
  assert.equal(c.etapa, 'valor', 'primeiro pergunta o valor');
  let r = responde(c, 'mil e quinhentos'); c = r.c; assert.equal(c.valor, 1500);
  assert.equal(c.etapa, 'dia', 'depois pergunta se é sempre no dia 10');
  r = responde(c, 'sim'); c = r.c; assert.equal(c.etapa, 'destino');
  r = responde(c, 'na agenda'); c = r.c; assert.equal(c.destino, 'agenda'); assert.equal(c.etapa, 'espaco');
  r = responde(c, 'pessoal'); c = r.c; assert.equal(c.espaco, 'personal'); assert.equal(c.etapa, 'confirma');
  r = responde(c, 'pode guardar'); assert.equal(r.salvar, true);
});
test('entende "não" no dia, "nota", mudança de valor e cancelamento', () => {
  const x = { texto: 'pagar a parcela do carro', titulo: 'Pagar a parcela do carro', repetir: 'monthly' };
  let c = novaConta(x, x.texto);
  assert.equal(c.etapa, 'valor');
  let r = responde(c, 'R$ 980'); c = r.c;
  assert.equal(c.etapa, 'diaNovo', 'sem dia no texto, pergunta qual dia');
  r = responde(c, 'dia 15'); c = r.c; assert.equal(c.diaMes, 15); assert.equal(c.etapa, 'destino', 'dia dito, segue');
  c = novaConta(x, x.texto); c = responde(c, '500').c; assert.equal(c.etapa, 'diaNovo');
  c = responde(c, 'dia 5').c; assert.equal(c.diaMes, 5);
  c = novaConta(x, x.texto); c = responde(c, '500').c; c = responde(c, 'dia 5').c;
  r = responde(c, 'como nota'); c = r.c; assert.equal(c.destino, 'nota'); assert.equal(c.etapa, 'confirma');
  r = responde(c, 'o valor é 600'); assert.equal(r.c.valor, 600);
  r = responde(c, 'deixa pra lá'); assert.equal(r.fim, true); assert.equal(r.c.cancelada, true);
});
