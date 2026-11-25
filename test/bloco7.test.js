import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { MAX, ativos, semAviso, podeCriar, textoLimite, fundadoresAbertos, ANUNCIO } from '../js/limite.js';
import { metricas, filtra, ehTeste, mostraEnquete, resumoEnquete } from '../js/metricas.js';
const le = (f) => readFileSync(new URL(f, import.meta.url), 'utf8');
const ev = (i, o = {}) => ({ id: 'e' + i, cat: 'lembrete', repeat: 'none', date: '2027-01-10', createdAt: i, ...o });
test('limite do grátis: nada some, recorrente conta 1, aniversário não conta', () => {
  const L = [...Array.from({ length: 25 }, (_, i) => ev(i, i % 2 ? { repeat: 'daily' } : {})), ev(90, { cat: 'aniversario' }), ev(91, { done: true }), ev(92, { kind: 'list' }), ev(93, { title: 'conta de água', cat: 'pagar' })];
  assert.equal(ativos(L, '2027-01-02').length, 26); assert.equal(semAviso(L, '2027-01-02', true).size, 26 - MAX); assert.equal(semAviso(L, '2027-01-02', false).size, 0);
  assert.ok(!podeCriar(L, ev(200), '2027-01-02', true)); assert.ok(podeCriar(L, ev(200), '2027-01-02', false)); assert.ok(podeCriar(L, ev(200, { cat: 'aniversario' }), '2027-01-02', true));
  assert.doesNotMatch(textoLimite(ANUNCIO - 1), /\d/); assert.match(textoLimite(ANUNCIO), /20/);
  assert.ok(fundadoresAbertos(Date.parse('2027-01-31T23:59:00-03:00'))); assert.ok(!fundadoresAbertos(Date.parse('2027-02-01T00:00:00-03:00')));
});
test('o 20 e o 31/01 não aparecem em público antes do anúncio', () => { for (const f of ['../pages/conheca.html', '../pages/termos.html', '../js/billing.js', '../js/views/settings.js']) assert.doesNotMatch(le(f), /20 lembretes|31\/01\/2027/, f); });
const T = Date.parse('2026-11-25T15:00:00-03:00'), d = (n) => T - n * 864e5, dia = (n) => new Date(d(n) - 3 * 36e5).toISOString().slice(0, 10);
test('North Star: WAU-3, D1, D7, ativação 24 h e contas de teste fora', () => {
  const U = [
    { email: 'a@x.com', createdAt: d(10), activeDays: [dia(10), dia(9), dia(3), dia(2), dia(1), dia(0)], firstEventAt: d(10) + 36e5, counts: { myEvents: 2 } },
    { email: 'b@x.com', createdAt: d(8), activeDays: [dia(8), dia(1)], firstEventAt: d(5), counts: { myEvents: 1 } },
    { email: 'c@x.com', createdAt: d(1) + 36e5 * 23, activeDays: [dia(0)], counts: {} },
    { email: 'q@teste.local', createdAt: d(9), activeDays: [dia(0), dia(1), dia(2)], counts: {} }, { email: 'm@x.com', teste: true, createdAt: d(9), activeDays: [] },
  ];
  const R = filtra(U, 'reais'), M = metricas(R, T);
  assert.equal(R.length, 3); assert.equal(filtra(U, 'teste').length, 2); assert.ok(ehTeste(U[3]));
  assert.equal(M.wau3, 1); assert.equal(M.wau, 3); assert.equal(M.inelegiveis, 1);
  assert.deepEqual([M.ativacao.n, M.ativacao.de], [1, 2]); assert.deepEqual([M.d1.n, M.d1.de], [1, 2]); assert.deepEqual([M.d7.n, M.d7.de], [2, 2]); assert.ok(M.d7.pequena);
});
test('enquete: só real, uma vez, 7 dias depois de fechar e no máximo duas', () => {
  assert.ok(mostraEnquete({ aberturas: 2, now: T })); assert.ok(!mostraEnquete({ aberturas: 1, criada: T - 1, now: T })); assert.ok(!mostraEnquete({ teste: true, aberturas: 9, now: T })); assert.ok(!mostraEnquete({ aberturas: 9, i: { choice: 'gratis' }, now: T }));
  assert.ok(!mostraEnquete({ aberturas: 9, i: { dismissedAt: T - 6 * 864e5 }, now: T })); assert.ok(mostraEnquete({ aberturas: 9, i: { dismissedAt: T - 8 * 864e5 }, now: T })); assert.ok(!mostraEnquete({ aberturas: 9, i: { dismissedAt: T - 8 * 864e5, dismissals: 2 }, now: T }));
  const r = resumoEnquete(filtra([{ email: 'a@x.com', lastSeen: T, intent2027: { choice: 'fundadores', shownAt: 1 } }, { email: 'z@teste.local', lastSeen: T, intent2027: { choice: 'gratis', shownAt: 1 } }, { email: 'b@x.com', lastSeen: T }], 'reais'), T);
  assert.equal(r.n, 1); assert.equal(r.fundadores, 1); assert.ok(r.indicativo);
  assert.doesNotMatch(le('../js/comeco.js'), /R\$|20 lembretes|vagas/);
});
test('CPF não é pedido na ficha nem guardado aberto; Azonix e Chico Xavier saíram', () => {
  assert.doesNotMatch(le('../js/views/ficha.js'), /fi-cpf|'cpf'/); assert.doesNotMatch(le('../css/app.css'), /azonix\.otf/i); assert.doesNotMatch(le('../worker/src/mind.js'), /'Chico Xavier'/);
});
