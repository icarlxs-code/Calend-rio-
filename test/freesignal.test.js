/* Experimento E2: mensagem por som, com sala simulada (eco, chiado, volume baixo e relógio torto) */
import test from 'node:test';
import assert from 'node:assert/strict';
import { codifica, decodifica, texto, detexto, TAXA, SIMBOLO } from '../js/freesignal-som.js';

const sala = (x, { ruido = 0.02, ganho = 0.5, eco = 0.25, atraso = 0.013, corte = 0 } = {}) => {
  const d = Math.round(atraso * TAXA), y = new Float32Array(x.length + d + Math.round(TAXA * 0.3));
  let s = 1; // chiado rosa simples
  for (let i = 0; i < x.length; i++) { y[i + Math.round(TAXA * 0.15)] += x[i] * ganho; if (eco) y[i + d + Math.round(TAXA * 0.15)] += x[i] * ganho * eco; }
  for (let i = 0; i < y.length; i++) { s = (s * 1103515245 + 12345) % 2147483648; y[i] += ((s / 1073741824) - 1) * ruido; }
  return corte ? y.slice(0, Math.round(y.length * corte)) : y;
};
const volta = (msg, cond) => { const r = decodifica(sala(codifica(texto(msg)), cond)); return r.ok ? detexto(r.bytes) : `FALHOU: ${r.erro}`; };

test('som: mensagem curta atravessa uma sala com eco e chiado', () => {
  assert.equal(volta('Oi! Tô sem internet, me liga depois 🧡'), 'Oi! Tô sem internet, me liga depois 🧡');
});
test('som: volume baixo e longe', () => {
  assert.equal(volta('Cheguei, tô na portaria', { ganho: 0.12, ruido: 0.03, eco: 0.4 }), 'Cheguei, tô na portaria');
});
test('som: mensagem do tamanho máximo', () => {
  const m = 'a'.repeat(250);
  assert.equal(volta(m), m);
});
test('som: ninguém inventa mensagem (CRC pega o erro)', () => {
  const x = sala(codifica(texto('transferir mil reais')));
  for (let i = 30000; i < 30400; i++) x[i] = Math.sin(i) * 0.9;           // alguém atrapalha no meio
  const r = decodifica(x);
  assert.ok(!r.ok || detexto(r.bytes) === 'transferir mil reais', 'nunca pode entregar texto trocado');
});
test('som: silêncio não vira mensagem', () => {
  assert.equal(decodifica(new Float32Array(TAXA * 2)).ok, false);
});
test('som: velocidade medida', () => {
  const m = 'x'.repeat(100), seg = codifica(texto(m)).length / TAXA;
  const bps = (m.length * 8) / seg;
  console.log(`      100 bytes em ${seg.toFixed(1)} s = ${bps.toFixed(0)} bits/s (${(100 / seg).toFixed(0)} bytes/s)`);
  assert.ok(bps > 70, String(bps));
  assert.ok(SIMBOLO * 2 * (100 + 3) + 0.3 > seg - 0.3);
});
