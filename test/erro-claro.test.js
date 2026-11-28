import { test } from 'node:test';
import assert from 'node:assert/strict';
import { explica, caminho } from '../js/erro-claro.js';
test('os erros do print viram português simples, com a correção', () => {
  const a = explica({ msg: "Can't find variable: x", where: 'onMount@https://meulembra.com.br/dist/c-IGGYIPOL.js:18:4334', ver: '2.32.0', steps: '# · aba:hoje › mensagens', users: ['u1'], count: 4, dev: 'iPhone (app)' }, '2.33.0');
  assert.match(a.oque, /Mensagens/); assert.match(a.situacao, /Já corrigido na versão 2\.33\.0/); assert.equal(a.onde, 'tela Hoje › Mensagens'); assert.match(a.quem, /1 pessoa · 4 vezes · iPhone \(app instalado\)/);
  const b = explica({ msg: "TypeError: e.then is not a function. (In 'e.then(s)', 'e.then' is undefined)", ver: '2.32.0', steps: '# · aba:ajustes › acc › aba:hoje › profile', users: ['a', 'b'] }, '2.33.0');
  assert.match(b.oque, /deslizando o dedo/); assert.equal(b.gravidade, 'trava'); assert.equal(b.onde, 'Ajustes › abriu um item › tela Hoje › Perfil'); assert.match(b.quem, /^2 pessoas/);
  assert.match(explica({ msg: "Can't find variable: x", ver: '2.34.0', steps: 'mensagens' }).situacao, /Voltou a acontecer/);
  assert.equal(explica({ msg: 'Script error.' }).gravidade, 'externo');
  assert.match(explica({ msg: 'TypeError: Load failed' }).oque, /sem internet/);
  assert.equal(caminho('# · pessoal:p-listas › minhas-frases'), 'Pessoal › Listas › Minhas frases');
});
