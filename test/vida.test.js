import { test } from 'node:test';
import assert from 'node:assert/strict';
import { limpaVida, respondeu, frasesDaVida, totalFrases, risco, respostaDeRisco, perguntaDoPar, EMERGENCIA } from '../js/vida.js';
import { readFileSync } from 'node:fs';

test('toda pergunta é obrigatória, mas "prefiro não dizer" vale', () => {
  assert.equal(limpaVida({ rel: 'casado', filhos: 'sim' }), null, 'faltou o ânimo');
  const v = limpaVida({ rel: 'nao_dizer', filhos: 'nao_dizer', animo: 'nao_dizer' });
  assert.ok(v); assert.ok(respondeu({ vida: v }));
  assert.deepEqual(frasesDaVida(v, { pronome: 'n' }), [], 'quem não quis dizer não recebe frase sobre isso');
  assert.equal(limpaVida({ rel: 'solteiro', par: 'X', filhos: 'nao', nomes: 'Y', animo: 'normal' }).par, '', 'solteiro não guarda nome de par');
  assert.deepEqual(limpaVida({ rel: 'casado', filhos: 'sim', nomes: 'Lucas, Bia e <b>Teo</b>', animo: 'bem' }).nomes, ['Lucas', 'Bia', 'bTeo/b']);
});
test('frases personalizadas: nome do filho, do par, gênero e várias opções por pessoa', () => {
  const v = { rel: 'casado', par: 'Ana', filhos: 'sim', nomes: 'Pedro', animo: 'desanimado' };
  const todas = new Set(); for (let i = 0; i < 60; i++) frasesDaVida(v, { pronome: 'm', semente: String(i) }).forEach((x) => todas.add(x.t));
  assert.ok([...todas].some((t) => t.includes('Pedro'))); assert.ok([...todas].some((t) => t.includes('Ana')));
  assert.ok(![...todas].some((t) => /\{|\}/.test(t)), 'nenhuma lacuna sem preencher');
  assert.ok(totalFrases(v) >= 15);
  const f = frasesDaVida({ rel: 'complicado', filhos: 'nao', animo: 'normal' }, { pronome: 'f', semente: '3', max: 9 });
  assert.ok(f.some((x) => x.k === 'vida-complicado')); assert.ok(f.some((x) => x.k === 'vida-autoestima'));
  assert.ok(!f.some((x) => /lindo\b/.test(x.t)), 'feminino');
});
test('risco: agressão e se machucar viram ajuda; briga comum não', () => {
  for (const t of ['ele me bateu ontem', 'meu marido me agrediu', 'tenho medo dele', 'ele ameaçou me matar']) assert.equal(risco(t), 'violencia', t);
  for (const t of ['quero morrer', 'não quero mais viver', 'penso em suicídio']) assert.equal(risco(t), 'autolesao', t);
  for (const t of ['brigamos por causa da louça', 'ele esqueceu nosso aniversário']) assert.equal(risco(t), null, t);
  assert.match(respostaDeRisco('violencia'), /190/); assert.match(respostaDeRisco('violencia'), /180/); assert.match(respostaDeRisco('autolesao'), /188/);
  assert.deepEqual(EMERGENCIA.map((e) => e.n), ['190', '180', '188', '192']);
});
test('"vocês estão bem?" só para quem tem par; respostas nunca vão para o painel do dono', () => {
  assert.equal(perguntaDoPar({ rel: 'casado', par: 'Ana', filhos: 'nao', animo: 'bem' }), 'E você e Ana, estão bem?');
  assert.equal(perguntaDoPar({ rel: 'solteiro', filhos: 'nao', animo: 'bem' }), null);
  const stats = readFileSync(new URL('../js/stats.js', import.meta.url), 'utf8');
  assert.doesNotMatch(stats, /vida/, 'o resumo do painel não leva a vida da pessoa');
});
