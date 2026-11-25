import './_base.js';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const s = fs.readFileSync(new URL('../js/privacy.js', import.meta.url), 'utf8');
test('excluir conta: confere a senha, lê tudo antes, e devolve se o login não puder ser encerrado', () => {
  const i = (x) => { const k = s.indexOf(x); assert.ok(k > 0, x); return k; };
  assert.ok(i('account.reauth(password)') < i('b.contaLe()') && i('b.contaLe()') < i('b.contaMarca(true)') && i('b.contaMarca(true)') < i('b.contaApaga(copia)') && i('b.contaApaga(copia)') < i('account.deleteUser()') && i('account.deleteUser()') < i('b.contaRepoe('));
});
test('nenhum caminho do app apaga de vez fora da purga de 24 h e da conta', () => {
  for (const f of fs.readdirSync(new URL('../js/', import.meta.url), { recursive: true }).filter((x) => String(x).endsWith('.js'))) { const c = fs.readFileSync(new URL('../js/' + String(f).replace(/\\/g, '/'), import.meta.url), 'utf8'); assert.ok(!/_del:\s*true/.test(c), f); if (!/cloud\.js$/.test(String(f))) assert.ok(!/deleteDoc\(|batch\.delete\(|backend\.del(Many|Personal)?\(|b\.delMany/.test(c), f); }
  const c = fs.readFileSync(new URL('../js/cloud.js', import.meta.url), 'utf8'); assert.equal((c.match(/bt\.delete\(/g) || []).length, 2); assert.ok(!/fs\.deleteDoc\(ref\(/.test(c));
});
