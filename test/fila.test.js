import { test } from 'node:test';
import assert from 'node:assert/strict';
import { criaFila } from '../js/fila.js';
const disco = () => { let v = null; return { le: async () => JSON.parse(JSON.stringify(v)), grava: async (L) => { v = JSON.parse(JSON.stringify(L.map(({ indo, ...e }) => e))); }, ver: () => v }; };
test('fechou sem internet: a alteração continua e sobe na ordem quando a rede volta', async () => {
  const d = disco(); let rede = false; const foi = [];
  const envia = async (e) => { if (!rede) throw new Error('unavailable'); foi.push([e.k, e.por]); };
  const a = criaFila({ ...d, envia }); await a.poe({ k: 'ws/u/events/1', por: { title: 'A' }, novo: true }); await a.poe({ k: 'ws/u/events/2', por: { status: 'feito' } }); await a.poe({ k: 'ws/u/events/1', por: { title: 'B', time: '10:00' }, tira: ['nota'] }); await a.esvazia();
  const b = criaFila({ ...d, envia }); await b.carrega(); assert.equal(b.pendentes().length, 2);
  assert.deepEqual(b.porCima('ws/u/events/1', { title: 'velho', nota: 'x' }), { title: 'B', time: '10:00' }, 'servidor velho não passa por cima');
  rede = true; await b.esvazia(); assert.deepEqual(foi, [['ws/u/events/1', { title: 'B', time: '10:00' }], ['ws/u/events/2', { status: 'feito' }]]); assert.deepEqual(d.ver(), []);
});
test('recusada fica guardada e não trava as outras; item que já não existe sai da fila', async () => {
  const d = disco(), foi = []; let rec = 0;
  const f = criaFila({ ...d, aoRecusar: () => rec++, envia: async (e) => { if (e.k === 'a') throw { code: 'permission-denied' }; if (e.k === 'b') throw { code: 'not-found' }; foi.push(e.k); } });
  for (const k of ['a', 'b', 'c']) await f.poe({ k, por: { x: 1 } });
  await f.esvazia(); assert.deepEqual(foi, ['c']); assert.equal(rec, 1); assert.equal(d.ver().length, 1); assert.equal(f.pendentes().length, 0);
});
