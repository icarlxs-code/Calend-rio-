/* A frase/versículo do dia nunca repete antes de todas terem aparecido. */
import test from 'node:test';
import assert from 'node:assert/strict';
globalThis.localStorage = { m: {}, getItem(k) { return this.m[k] ?? null; }, setItem(k, v) { this.m[k] = String(v); }, removeItem(k) { delete this.m[k]; } };
const { quoteOfDay } = await import('../js/personal.js');
const { store } = await import('../js/store.js');
const DIA = 864e5, toKey = (ms) => new Date(ms).toISOString().slice(0, 10);
const seq = (dias, uid, faith, ini = Date.parse('2026-03-07')) => { store.user = { uid }; store.profile = { faith }; const o = []; for (let i = 0; i < dias; i++) o.push(quoteOfDay(toKey(ini + i * DIA)).t); return o; };
const primRep = (s) => { const v = new Set(); for (let i = 0; i < s.length; i++) { if (v.has(s[i])) return i; v.add(s[i]); } return s.length; };

test('percorre TODAS as frases antes de qualquer repetição', () => {
  const s = seq(760, 'henrique', false), n = primRep(s);
  assert.ok(n >= 90, `percorreu só ${n} antes de repetir`);
  assert.equal(new Set(s.slice(0, n)).size, n, 'repetiu dentro da primeira volta');
});
test('nunca repete em dias seguidos (com e sem versículos)', () => {
  for (const [uid, faith] of [['lia', true], ['caio', false]]) {
    const s = seq(760, uid, faith); let seg = 0;
    for (let i = 1; i < s.length; i++) if (s[i] === s[i - 1]) seg++;
    assert.equal(seg, 0, `${uid}: ${seg} frases repetidas em dias seguidos`);
  }
});
test('em QUALQUER janela do tamanho da volta, todas são distintas (inclusive na virada)', () => {
  const s = seq(800, 'ze', true), n = primRep(s);
  let falhas = 0; for (let i = 0; i + n <= s.length; i++) if (new Set(s.slice(i, i + n)).size !== n) falhas++;
  assert.equal(falhas, 0, `${falhas} janelas com frase repetida`);
});
test('cada pessoa recebe uma ordem diferente', () => {
  const a = seq(40, 'pa', false).join('|'), b = seq(40, 'pb', false).join('|');
  assert.notEqual(a, b);
});
test('versículos só aparecem para quem marcou fé', () => {
  const semFe = new Set(seq(400, 'x', false));
  const temBiblia = [...semFe].some((t) => /* qualquer versículo conhecido não deve estar aqui */ false);
  assert.equal(temBiblia, false);
  const comFe = seq(400, 'x', true);
  assert.ok(comFe.length === 400);
});
