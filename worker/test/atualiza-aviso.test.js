import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lembraAtualizar, guardaVersao } from '../src/atualiza-aviso.js';
const kv = () => { const m = new Map(); return { m, get: async (k, t) => (m.has(k) ? (t === 'json' ? JSON.parse(m.get(k)) : m.get(k)) : null), put: async (k, v) => m.set(k, v), delete: async (k) => m.delete(k), scan: async (p) => [...m.entries()].filter(([k]) => k.startsWith(p)) }; };
test('avisa de 5 em 5 min quem está desatualizado; para quando atualiza; nunca de madrugada', async () => {
  globalThis.fetch = async () => ({ ok: true, json: async () => ({ version: '2.33.0', build: 'novo1234' }) });
  const CAL = kv(), env = { CAL };
  for (const m of ['uAna', 'uBia', 'uCaio']) await CAL.put(`dev:${m}`, '{}');
  await guardaVersao(env, 'uAna', { v: '2.33.0', b: 'velho999' });
  await guardaVersao(env, 'uBia', { v: '2.33.0', b: 'novo1234' });
  // uCaio nunca informou (app antigo): também é avisado
  const env1 = []; const send = async (e, m, msg) => env1.push([m, msg.tag]);
  const t0 = Date.parse('2026-11-28T15:00:00-03:00');
  const r = await lembraAtualizar(env, t0, send);
  assert.deepEqual(env1.map(([m]) => m).sort(), ['uAna', 'uCaio']); assert.equal(env1[0][1], 'atualizar', 'mesma etiqueta: substitui o aviso anterior');
  assert.equal(r.emDia, 1);
  assert.equal((await lembraAtualizar(env, t0 + 60e3, send)).pulou, 'cedo', 'no máximo um aviso a cada 5 min');
  await guardaVersao(env, 'uAna', { v: '2.33.0', b: 'novo1234' });
  env1.length = 0; await lembraAtualizar(env, t0 + 5 * 60e3, send);
  assert.deepEqual(env1.map(([m]) => m), ['uCaio'], 'quem atualizou para de receber');
  env1.length = 0; await lembraAtualizar(env, Date.parse('2026-11-28T23:30:00-03:00'), send);
  assert.equal(env1.length, 0, 'de madrugada, nada');
});
