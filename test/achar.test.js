import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
/* os arquivos usam a tela; aqui só as contas puras */
const le = (f) => readFileSync(new URL(f, import.meta.url), 'utf8');
const src = le('../js/achar.js');
const { entende } = await import('data:text/javascript,' + encodeURIComponent(src.slice(src.indexOf('export const DDDS'), src.indexOf('let meu ='))));
test('telefone de todo jeito', () => {
  for (const t of ['21988887777', '(21) 98888-7777', '21 98888 7777', '+55 21 98888-7777', '5521988887777', '021988887777', '0 15 21 98888-7777', '(021)98888.7777']) { const e = entende(t); assert.equal(e.tipo, 'tel', t); assert.ok(e.tels.includes('21988887777'), t); }
  assert.ok(entende('2188887777').tels.includes('21988887777'), 'sem o 9');
  assert.ok(entende('5532221111').tels.includes('5532221111'), 'DDD 55 fixo');
});
test('sem DDD pergunta', () => { assert.deepEqual(entende('98888-7777'), { tipo: 'ddd', num: '988887777' }); assert.equal(entende('8888-7777').tipo, 'ddd'); });
test('e-mail, ID e erros', () => {
  assert.equal(entende(' Lia@Exemplo.com ').email, 'lia@exemplo.com');
  assert.equal(entende('@Lia.Moraes').id, 'lia.moraes');
  assert.equal(entende('lia4821').tipo, 'id');
  for (const t of ['20988887777', '123', '21888877771', 'a', 'lia@', '+1 305 555 0000']) assert.equal(entende(t).tipo, 'erro', t);
});
test('novidades: só o que é novo, na ordem', async () => {
  const s = le('../js/novidades.js');
  const { quadrosDesde } = await import('data:text/javascript,' + encodeURIComponent(s.slice(s.indexOf('const num ='), s.indexOf('const d = (n)')).replace('lista = NOVIDADES', 'lista')));
  const L = { '2.32.0': [{ t: 'a' }], '2.4.0': [{ t: 'v' }], '2.33.0': [{ t: 'b' }], '2.40.0': [{ t: 'c' }] };
  assert.deepEqual(quadrosDesde('2.30.0', '2.33.0', L).map((x) => x.t), ['b', 'a']);
  assert.deepEqual(quadrosDesde('2.33.0', '2.33.0', L), []);
});
