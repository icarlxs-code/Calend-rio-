/* Contas e repetições faladas do jeito da pessoa: o intérprete de verdade (parseQuick + entende), sem IA. */
import './_base.js';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nova } from './_base.js';
import { tiraValor, tiraRepeticao, numeroBR, proximoDiaDoMes, contaMensal, limpaTitulo, reaisTxt } from '../js/frase-conta.js';
const P = await import('../js/personal.js');
const { entende } = await import('../js/destino.js');
const { occursOn } = await import('../js/inicio-pessoal.js');
const { todayKey, addDays } = await import('../js/utils.js');
const hoje = todayKey();

test('valores do jeito brasileiro', () => {
  assert.equal(numeroBR('1.200'), 1200); assert.equal(numeroBR('1.200,50'), 1200.5); assert.equal(numeroBR('230,5'), 230.5);
  assert.equal(numeroBR('480'), 480); assert.equal(numeroBR('R$ 2 mil'), 2000); assert.equal(numeroBR('1,5 mil'), 1500);
  assert.equal(tiraValor(' cartão vence R$ 480 ').valor, 480);
  assert.equal(tiraValor(' conta de luz de R$ 230,50 vence ').valor, 230.5);
  assert.equal(tiraValor(' cartão 1.200 reais ').valor, 1200);
  assert.equal(tiraValor(' aluguel no valor de R$1.500,00 ').valor, 1500);
  assert.equal(tiraValor(' reunião às 15h na sala 12 ').valor, 0, 'número solto não é dinheiro');
  assert.equal(reaisTxt(1500), 'R$ 1.500'); assert.equal(reaisTxt(230.5), 'R$ 230,50');
});

test('repetição: mensal, semanal, diária e anual', () => {
  const r = (f) => tiraRepeticao(` ${f} `, '2026-11-27');
  assert.deepEqual([r('todo dia 10').repeat, r('todo dia 10').diaMes, r('todo dia 10').date], ['monthly', 10, '2026-12-10']);
  assert.equal(r('todo dia 30').date, '2026-11-30', 'ainda dá neste mês');
  assert.equal(r('todo mês no dia 25').diaMes, 25);
  assert.equal(r('dia 8 de cada mês').diaMes, 8);
  assert.equal(r('toda segunda').repeat, 'weekly'); assert.equal(r('toda segunda').date, '2026-11-30');
  assert.equal(r('todo dia às 8h tomar remédio').repeat, 'daily');
  assert.equal(r('todos os dias').repeat, 'daily');
  assert.equal(r('todo ano').repeat, 'yearly');
  assert.equal(r('dentista amanhã').repeat, 'none');
  // dia 31 vira o último dia dos meses menores (e o 1º lançamento não pula fevereiro)
  assert.equal(proximoDiaDoMes(31, '2027-02-01'), '2027-02-28');
  assert.equal(proximoDiaDoMes(10, '2026-12-31'), '2027-01-10', 'virada de ano');
});

test('conta de todo mês x conta de uma vez só', () => {
  for (const f of ['pagar o aluguel', 'condomínio', 'pagar internet', 'conta de água', 'cartão vence', 'fatura do cartão', 'mensalidade da escola']) assert.ok(contaMensal(f), f);
  for (const f of ['beber água', 'academia', 'IPVA', 'pagar o aluguel só esse mês', 'boleto da geladeira']) assert.ok(!contaMensal(f), f);
});

test('títulos limpos, sem o jeito de conversar', () => {
  const T = {
    'quero que você coloque na minha agenda que eu tenho que pagar o aluguel': 'Pagar o aluguel',
    'me lembra de pagar o cartão de crédito': 'Pagar o cartão de crédito',
    'não deixa eu esquecer de pagar o condomínio': 'Pagar o condomínio',
    'marque na agenda que pago a escola das crianças': 'Pagar a escola das crianças',
    'você pode colocar pra mim que tenho dentista': 'Dentista',
    'cartão vence': 'Pagar cartão',
    'conta de luz vence': 'Pagar conta de luz',
    'Cortar o cabelo': 'Cortar o cabelo',
    'Levar o carro na oficina': 'Levar o carro na oficina',
  };
  for (const [a, b] of Object.entries(T)) assert.equal(limpaTitulo(a), b, a);
});

test('a frase do aluguel do dono: título, todo dia 10, mensal (o app entende sem IA)', () => {
  const f = 'quero que você coloque na minha agenda que dia 10 eu tenho que pagar o aluguel';
  const x = entende(f);
  assert.equal(x.titulo, 'Pagar o aluguel'); assert.equal(x.repetir, 'monthly'); assert.equal(x.diaMes, 10);
  assert.equal(x.data, proximoDiaDoMes(10, hoje)); assert.equal(x.cat, 'pagar'); assert.equal(x.dito, 'agenda');
});

test('frases do relatório: aluguel, cartão com valor, internet, conta única, condomínio', () => {
  const c = (f) => entende(f);
  let x = c('todo dia 10 eu tenho que pagar o aluguel'); assert.deepEqual([x.titulo, x.repetir, x.diaMes], ['Pagar o aluguel', 'monthly', 10]);
  x = c('cartão vence dia 15, R$ 480'); assert.deepEqual([x.titulo, x.repetir, x.diaMes, x.valor, x.cat], ['Pagar cartão', 'monthly', 15, 480, 'pagar']);
  x = c('pagar internet no dia 5'); assert.deepEqual([x.titulo, x.repetir, x.diaMes], ['Pagar internet', 'monthly', 5]);
  x = c('boleto do IPVA dia 15/12 de R$ 1.300'); assert.deepEqual([x.titulo, x.repetir, x.valor], ['Boleto do IPVA', 'none', 1300]);
  x = c('não deixa eu esquecer de pagar o condomínio dia 8'); assert.deepEqual([x.titulo, x.repetir, x.diaMes], ['Pagar o condomínio', 'monthly', 8]);
  x = c('me lembra de pagar o cartão de crédito todo dia 7, 1.200 reais'); assert.deepEqual([x.titulo, x.diaMes, x.valor], ['Pagar o cartão de crédito', 7, 1200]);
  x = c('conta de luz de R$ 230,50 vence dia 20'); assert.deepEqual([x.titulo, x.valor, x.diaMes], ['Pagar conta de luz', 230.5, 20]);
  // o que já funcionava continua igual
  x = c('dentista amanhã às 15h'); assert.deepEqual([x.titulo, x.data, x.hora, x.repetir], ['Dentista', addDays(hoje, 1), '15:00', 'none']);
  // várias regras ou um período continuam indo para a IA; perguntas e mudanças também
  for (const f of ['toda segunda e quarta academia', 'pagar dia 5 e dia 20', 'reunião de segunda a sexta às 9h', 'não', 'quanto eu gasto por mês?', 'muda o aluguel pra dia 12']) assert.equal(c(f), null, f);
});

test('guardado de verdade: repete todo mês no dia certo e o aviso diz o valor (inclusive na véspera)', async () => {
  await nova(); P.startPersonal();
  const x = entende('cartão vence dia 31, R$ 480');
  const it = P.savePersonal({ title: x.titulo, date: x.data, time: null, cat: x.cat, repeat: x.repetir, diaMes: x.diaMes, valor: x.valor, remind: 'auto' });
  const salvo = P.personal.item(it.id);
  assert.equal(salvo.valor, 480); assert.equal(salvo.diaMes, 31); assert.equal(salvo.repeat, 'monthly');
  // fevereiro: cai no dia 28 (ou 29); abril: no 30
  assert.ok(occursOn(salvo, '2027-02-28') && !occursOn(salvo, '2027-03-01'));
  assert.ok(occursOn(salvo, '2027-04-30') && occursOn(salvo, '2027-05-31'));
  const ocorr = P.occurrences(hoje, addDays(hoje, 70)).filter((o) => o.item.id === it.id);
  assert.ok(ocorr.length >= 2, 'aparece em mais de um mês');
  const avisos = P.buildPersonalSchedule(Date.parse(`${hoje}T00:00:00`) - 864e5).filter((a) => a.id.startsWith(`p-${it.id}`) || /Pagar cartão/.test(a.body));
  const vespera = avisos.find((a) => a.title.includes('Amanhã vence'));
  assert.ok(vespera, 'aviso da véspera'); assert.match(vespera.body, /Pagar cartão · R\$ 480/);
  assert.equal(new Date(vespera.at).getHours(), 19);
});
