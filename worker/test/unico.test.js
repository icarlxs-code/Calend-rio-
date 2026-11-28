import { test } from 'node:test';
import assert from 'node:assert/strict';
import { confereUnico, liberaUnico, telLimpo, cpfValido } from '../src/unico.js';
const kv = () => { const m = new Map(); return { get: async (k, t) => (m.has(k) ? (t === 'json' ? JSON.parse(m.get(k)) : m.get(k)) : null), put: async (k, v) => m.set(k, v), delete: async (k) => m.delete(k) }; };
test('telefone igual escrito de jeitos diferentes é o mesmo número', () => {
  assert.equal(telLimpo('(21) 99999-8888'), '21999998888'); assert.equal(telLimpo('+55 21 99999 8888'), '21999998888'); assert.equal(telLimpo('021999998888'), '21999998888');
  assert.equal(cpfValido('529.982.247-25'), true); assert.equal(cpfValido('111.111.111-11'), false);
});
test('um telefone e um CPF só em uma conta; excluir a conta libera', async () => {
  const env = { CAL: kv() };
  assert.deepEqual(await confereUnico(env, 'u1', { telefone: '(21) 99999-8888', cpf: '529.982.247-25', reservar: true }), { ok: true, ocupado: [] });
  const r = await confereUnico(env, 'u2', { telefone: '+55 21 99999-8888', cpf: '52998224725', reservar: true });
  assert.equal(r.ok, false); assert.deepEqual(r.ocupado, ['telefone', 'cpf']);
  assert.equal((await confereUnico(env, 'u1', { telefone: '21999998888' })).ok, true, 'a própria conta pode salvar de novo');
  await confereUnico(env, 'u1', { telefone: '21988887777', reservar: true }); // trocou de número: o antigo fica livre
  assert.equal((await confereUnico(env, 'u2', { telefone: '21999998888' })).ok, true);
  await liberaUnico(env, 'u1');
  assert.equal((await confereUnico(env, 'u2', { cpf: '52998224725' })).ok, true, 'conta excluída libera o CPF');
});
