import { test } from 'node:test';
import assert from 'node:assert/strict';
import { geraFala, repetida, retrato, COTA_DIA } from '../src/fala.js';
const kv = () => { const m = new Map(); return { m, get: async (k, t) => (m.has(k) ? (t === 'json' ? JSON.parse(m.get(k)) : m.get(k)) : null), put: async (k, v) => m.set(k, v), delete: async (k) => m.delete(k) }; };
globalThis.fetch = async () => ({ ok: true, status: 200, json: async () => ({}) });

test('fala nova com o retrato da pessoa; não repete; cota por dia; sem IA o app usa as frases dele', async () => {
  const respostas = ['Bora arrasar na academia hoje! 💪', 'Bora arrasar na academia hoje! 💪', 'Que tal um café antes do dentista? ☕'];
  const pedidos = [];
  const env = { CAL: kv(), AI: { run: async (m, o) => { pedidos.push(o.messages[0].content); return { response: respostas.shift() || 'Outra fala bem diferente das outras.' }; } } };
  const ctx = { nome: 'Natasha', pronome: 'f', vida: { rel: 'complicado', filhos: 'sim', nomes: 'Lia', animo: 'desanimado' }, hoje: ['15:00 Dentista'], gostos: ['autoestima'] };
  assert.equal((await geraFala(env, { id: 'nat' }, { momento: 'manha', ctx })).t, 'Bora arrasar na academia hoje! 💪');
  assert.match(pedidos[0], /Fale no feminino/); assert.match(pedidos[0], /Filhos: Lia/); assert.match(pedidos[0], /complicado/); assert.match(pedidos[0], /15:00 Dentista/); assert.match(pedidos[0], /autoestima/);
  // a mesma fala de novo é recusada e vem outra
  assert.equal((await geraFala(env, { id: 'nat' }, { momento: 'tarde', ctx })).t, 'Que tal um café antes do dentista? ☕');
  assert.match(pedidos.at(-1), /Bora arrasar na academia/, 'a IA recebe o que já foi dito');
  for (let i = 0; i < COTA_DIA; i++) await geraFala(env, { id: 'nat' }, { ctx });
  assert.equal((await geraFala(env, { id: 'nat' }, { ctx })).motivo, 'cota');
  assert.equal((await geraFala({ CAL: kv() }, { id: 'x' }, { ctx })).motivo, 'sem-ia');
  // fala com risco nunca sai
  const r = await geraFala({ CAL: kv(), AI: { run: async () => ({ response: 'quero morrer de rir' }) } }, { id: 'y' }, { ctx });
  assert.equal(r.t, '');
});
test('parecida demais conta como repetida', () => {
  assert.ok(repetida('Vai dar tudo certo hoje, Natasha!', ['vai dar tudo certo hoje natasha']));
  assert.ok(!repetida('O Flamengo joga domingo, bora torcer!', ['Vai dar tudo certo hoje, Natasha!']));
});
test('retrato não leva quem não quis dizer', async () => {
  const t = await retrato({ CAL: kv() }, { id: 'z' }, { vida: { rel: 'nao_dizer', filhos: 'nao_dizer', animo: 'nao_dizer' } });
  assert.doesNotMatch(t, /Relacionamento|Filhos|Ânimo/);
});
