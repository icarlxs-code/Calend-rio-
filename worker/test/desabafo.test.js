import { test } from 'node:test';
import assert from 'node:assert/strict';
import { desabafo } from '../src/desabafo.js';

test('resposta curta (até 3 frases), com o contexto da pessoa; risco nunca vai para a IA; nada é guardado', async () => {
  const pedidos = [];
  const kv = new Map();
  const env = { CAL: { get: async (k) => kv.get(k) ?? null, put: async (k, v) => kv.set(k, v) }, AI: { run: async (m, o) => { pedidos.push(o); return { response: 'Vai ficar tudo bem. Você é forte. Respira. Isso passa. Mais uma frase.' }; } } };
  const r = await desabafo(env, { texto: 'brigamos feio hoje', vida: { rel: 'casado', par: 'Ana', filhos: 'sim', nomes: 'Pedro', animo: 'normal' }, pronome: 'm' });
  assert.equal(r.texto, 'Vai ficar tudo bem. Você é forte. Respira.');
  assert.match(pedidos[0].messages[0].content, /casado\(a\) com Ana/); assert.match(pedidos[0].messages[0].content, /Pedro/);
  assert.match(pedidos[0].messages[0].content, /Nunca incentive a pessoa a aceitar agressão/);
  const n = pedidos.length;
  assert.deepEqual(await desabafo(env, { texto: 'ele me bateu de novo' }), { risco: 'violencia' });
  assert.deepEqual(await desabafo(env, { texto: 'não quero mais viver' }), { risco: 'autolesao' });
  assert.equal(pedidos.length, n, 'texto com risco não foi para a IA');
  assert.equal(kv.size, 0, 'nada guardado');
  assert.deepEqual(await desabafo({}, { texto: 'tô triste' }), { texto: '' }, 'sem IA: o app usa a frase de reserva');
});
