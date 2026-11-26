/* Mensagem escrita sem internet não pode se perder, nem subir duas vezes. */
import './_base.js';
import test from 'node:test';
import assert from 'node:assert/strict';
globalThis.indexedDB = undefined;   // pior caso: só o armazenamento simples
const F = await import('../js/msg-fila.js');

test('guarda, sobe na ordem e some da fila', async () => {
  await F.guardaParaDepois({ com: 'lia', txt: 'oi' }, { com: 'lia', txt: 'oi' });
  await F.guardaParaDepois({ com: 'lia', txt: 'tudo bem?' }, { com: 'lia', txt: 'tudo bem?' });
  assert.equal(F.quantas(), 2);
  const subiram = [];
  await F.esvazia(async (p) => { subiram.push(p.txt); return { id: 'x' + subiram.length }; });
  assert.deepEqual(subiram, ['oi', 'tudo bem?'], 'na ordem em que foram escritas');
  assert.equal(F.quantas(), 0, 'saiu da fila depois de subir');
});

test('sem internet: para e guarda para a próxima', async () => {
  await F.guardaParaDepois({ com: 'lia', txt: 'a' }, { com: 'lia', txt: 'a' });
  await F.guardaParaDepois({ com: 'lia', txt: 'b' }, { com: 'lia', txt: 'b' });
  let tentativas = 0;
  await F.esvazia(async () => { tentativas++; const e = new Error('Isso precisa de internet'); e.code = 'sem-rede'; throw e; });
  assert.equal(tentativas, 1, 'não fica martelando a rede morta');
  assert.equal(F.quantas(), 2, 'as duas continuam guardadas');
  const subiram = [];
  await F.esvazia(async (p) => { subiram.push(p.txt); return { id: '1' }; });
  assert.deepEqual(subiram, ['a', 'b']);
  assert.equal(F.quantas(), 0);
});

test('erro definitivo (bloqueado) não fica preso para sempre', async () => {
  await F.guardaParaDepois({ com: 'x', txt: 'c' }, { com: 'x', txt: 'c' });
  await F.esvazia(async () => { throw new Error('Você foi bloqueado (403)'); });
  assert.equal(F.quantas(), 0, 'saiu da fila: insistir não adianta');
});

test('uma mensagem não sobe duas vezes, mesmo com duas chamadas juntas', async () => {
  await F.guardaParaDepois({ com: 'lia', txt: 'unica' }, { com: 'lia', txt: 'unica' });
  let n = 0;
  await Promise.all([F.esvazia(async () => { n++; await new Promise((r) => setTimeout(r, 30)); return { id: '1' }; }), F.esvazia(async () => { n++; return { id: '2' }; })]);
  assert.equal(n, 1, `subiu ${n} vezes`);
  assert.equal(F.quantas(), 0);
});
