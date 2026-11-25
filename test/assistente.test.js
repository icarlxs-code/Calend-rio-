import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parcelas, entendeConta, respostaConta } from '../js/contas.js';
const le = (f) => readFileSync(new URL(f, import.meta.url), 'utf8');
test('conta do empréstimo, exata e sem IA', () => {
  const c = entendeConta('Recebo R$4000; todo dia 15 e 30 descontam R$250; faltam 3000.', '2026-11-25');
  assert.deepEqual(c.datas, ['2026-11-30', '2026-12-15', '2026-12-30', '2027-01-15', '2027-01-30', '2027-02-15', '2027-02-28', '2027-03-15', '2027-03-30', '2027-04-15', '2027-04-30', '2027-05-15']);
  assert.equal(c.ultima, '2027-05-15'); assert.equal(c.sobra, 3500); assert.equal(c.n, 12);
  assert.ok(entendeConta('Recebo 4000, dia 15 e 30 descontam 250 do empréstimo, faltam 3000. Quando acaba?', '2026-11-25'));
  const r = respostaConta(c); assert.equal(r.acoes.length, 3); assert.deepEqual(r.acoes.map((a) => [a.data, a.ate || '']), [['2026-12-15', '2027-05-15'], ['2026-11-30', '2027-04-30'], ['2027-05-15', '']]);
  assert.equal(entendeConta('pagar a luz dia 10', '2026-11-25'), null);
});
test('mês curto, bissexto e saldo que não divide', () => {
  assert.ok(parcelas({ saldo: 1000, valor: 250, dias: [30], inicio: '2028-01-30' }).datas.includes('2028-02-29'));
  assert.deepEqual(parcelas({ saldo: 750, valor: 250, dias: [31], inicio: '2026-03-31' }).datas, ['2026-04-30', '2026-05-31', '2026-06-30']);
  const p = parcelas({ saldo: 3100, valor: 250, dias: [15], inicio: '2026-11-25' }); assert.equal(p.n, 13); assert.equal(p.resto, 100);
});
/* destino.js usa o leitor de frases da tela: aqui só a parte que decide */
const src = le('../js/destino.js');
const { decide } = await import('data:text/javascript,' + encodeURIComponent(src.replace(/import[^\n]+\n/, 'const parseQuick = (t) => ({ title: t, date: "2026-11-26", time: "", cat: "lembrete", repeat: "none" });\n') + '\nexport const decide = entende;'));
test('mudar, desfazer e perguntar nunca viram lembrete', () => {
  for (const f of ['desmarca o médico de quinta', 'desmarca', 'desmarca a reunião de amanhã', 'desfaz', 'desfazer', 'volta como estava', 'não era isso', 'cancela isso', 'cancela', 'cancela o dentista amanhã', 'cancela tudo', 'tira tudo que o Matheus marcou essa semana', 'apaga tudo de sexta', 'na verdade é às 16h', 'muda pra 16h', 'to livre sexta', 'tô ocupado amanhã', 'tira']) { const x = decide(f); assert.ok(x === null || x.intencao, f); }
  for (const f of ['dentista amanhã às 15h', 'lembrar de pagar a luz dia 10', 'aniversário da minha mãe 12 de março']) assert.ok(decide(f) && !decide(f).intencao, f);
  assert.equal(decide('desfaz').intencao, 'desfazer'); assert.equal(decide('desmarca').intencao, 'qual');
});
test('nada de "feito" antes de confirmar e nenhum nome real no assistente', () => {
  const free = le('../worker/src/freeai.js'), cl = le('../worker/src/claude.js');
  assert.doesNotMatch(free + cl, /feito!/i); assert.match(free, /Nunca escreva feito/); assert.match(free, /não recalcule/i);
  for (const f of ['../js/claude-link.js', '../js/views/assistant.js', '../js/destino.js', '../js/contas.js', '../worker/src/freeai.js', '../worker/src/claude.js']) assert.doesNotMatch(le(f), /Henrique|Matheus|JG Garcia|Pura Vida|Garcia Hortifruti|"henrique"|"matheus"/, f);
});
