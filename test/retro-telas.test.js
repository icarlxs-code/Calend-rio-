import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const src = readFileSync(new URL('../js/retro-telas.js', import.meta.url), 'utf8');
const ini = src.indexOf('const pl ='), fim = src.indexOf('const imgs ='), R = new URL('../js/retro.js', import.meta.url).href;
globalThis.localStorage = { getItem: () => null, setItem: () => {}, length: 0 };
const { telas } = await import('data:text/javascript,' + encodeURIComponent(`import { le, totaisDoAno, maiorOfensiva, horarioFavorito, perfilDoAno } from '${R}';\n` + src.slice(ini, fim)));
const ano = (n, extra = {}) => ({ v: 1, x: Object.fromEntries(Array.from({ length: n }, (_, i) => ['k' + i, [`2026-0${1 + (i % 9)}-1${i % 9}`, i % 2 ? 't' : 'p', 9, 1, 'reuniao', 0]])), a: {}, d: Array.from({ length: Math.min(n, 27) }, (_, i) => `2026-03-${String(i + 1).padStart(2, '0')}`), b: 2, rec: 1, ...extra });
test('telas só do que existe; sem água, some; nunca zero', () => {
  const T = telas(2026, ano(30)), ids = T.map((t) => t.id); assert.ok(ids.includes('feitos') && ids.includes('ofensiva') && ids.includes('hora') && ids.includes('ponto')); assert.ok(!ids.includes('agua') && !ids.includes('niver')); assert.equal(ids[0], 'abre'); assert.equal(ids.at(-1), 'fim'); assert.ok(T.every((t) => !/^0\b/.test(t.g)));
  assert.ok(telas(2026, ano(30, { a: { '2026-03-01': 3 } })).some((t) => t.id === 'agua' && /3 copos/.test(t.g)));
  assert.equal(new Set(T.map((t) => t.x)).size > 4, true, 'mascote muda de lugar');
});
test('caminho curto para quem tem pouco', () => { const T = telas(2026, ano(2)); assert.deepEqual(T.map((t) => t.id), ['abre', 'dias', 'fim']); assert.equal(T.at(-1).g, 'Primeiro Capítulo'); });
test('trava: nada vai para o servidor; texto honesto; sem preço e sem Wrapped', () => {
  assert.doesNotMatch(src, /stats\.js|track\(|saveProfile|reportStats|fetch\(|avisos\.js|Wrapped|R\$/); assert.match(src, /Ele não é enviado a ninguém até você compartilhar/); assert.match(src, /Gerado no Lembra · eu escolhi compartilhar/); assert.doesNotMatch(src, /nunca saíram do celular/);
});
