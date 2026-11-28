import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lembraAtualizar, guardaVersao } from '../src/atualiza-aviso.js';
const kv = () => { const m = new Map(); return { m, get: async (k, t) => (m.has(k) ? (t === 'json' ? JSON.parse(m.get(k)) : m.get(k)) : null), put: async (k, v) => m.set(k, v), delete: async (k) => m.delete(k), scan: async (p) => [...m.entries()].filter(([k]) => k.startsWith(p)) }; };
test('avisa de 5 em 5 min quem está desatualizado; para quando atualiza; nunca de madrugada', async () => {
  globalThis.fetch = async () => ({ ok: true, json: async () => ({ version: '2.33.0', build: 'novo1234' }) });
  const CAL = kv(), env = { CAL };
  for (const m of ['uAna', 'uBia', 'uCaio']) await CAL.put(`dev:${m}`, '{}');
  await guardaVersao(env, 'uAna', { v: '2.33.0', b: 'velho999' });
  await guardaVersao(env, 'uBia', { v: '2.33.0', b: 'novo1234', nv: true });
  // uCaio nunca informou (app antigo): também é avisado
  const env1 = []; const send = async (e, m, msg) => env1.push([m, msg.tag]);
  const t0 = Date.parse('2026-11-28T15:00:00-03:00');
  const r = await lembraAtualizar(env, t0, send);
  assert.deepEqual(env1.map(([m]) => m).sort(), ['uAna', 'uCaio']); assert.equal(env1[0][1], 'atualizar', 'mesma etiqueta: substitui o aviso anterior');
  assert.equal(r.emDia, 1);
  assert.equal((await lembraAtualizar(env, t0 + 60e3, send)).pulou, 'cedo', 'no máximo um aviso a cada 5 min');
  await guardaVersao(env, 'uAna', { v: '2.33.0', b: 'novo1234' });
  env1.length = 0; await lembraAtualizar(env, t0 + 10 * 60e3, send);
  assert.deepEqual(env1.map(([m]) => m), ['uCaio'], 'quem atualizou para de receber (novidade não é aviso)');
  env1.length = 0; await lembraAtualizar(env, Date.parse('2026-11-28T23:20:00-03:00'), send);
  assert.equal(env1.length, 1, 'até 23h30 ainda avisa quem está desatualizado');
  env1.length = 0; await lembraAtualizar(env, Date.parse('2026-11-28T23:30:00-03:00'), send);
  assert.equal(env1.length, 0, 'de madrugada, nada');
});
test('celular antigo que ainda pinga não reabre o aviso de quem já viu as novidades na versão nova', async () => {
  globalThis.fetch = async () => ({ ok: true, json: async () => ({ version: '2.34.0', build: 'nov5678' }) });
  const CAL = kv(), env = { CAL }; await CAL.put('dev:uOwner', '{}');
  await guardaVersao(env, 'uOwner', { v: '2.34.0', b: 'nov5678', nv: true });
  await guardaVersao(env, 'uOwner', { v: '2.33.0', b: 'velho1', nv: false }); // outro aparelho, versão antiga
  const sent = []; const send = async (e, m) => sent.push(m);
  const r = await lembraAtualizar(env, Date.parse('2026-11-28T15:00:00-03:00'), send);
  assert.equal(sent.length, 0, 'não reabre o aviso'); assert.equal(r.emDia, 1);
});
test('quem tem um aparelho na versão nova nunca recebe "atualize", mesmo com outro aparelho antigo', async () => {
  globalThis.fetch = async () => ({ ok: true, json: async () => ({ version: '2.34.0', build: 'nov9999' }) });
  const CAL = kv(), env = { CAL }; await CAL.put('dev:uDual', '{}');
  await guardaVersao(env, 'uDual', { v: '2.34.0', b: 'nov9999', nv: false });
  await guardaVersao(env, 'uDual', { v: '2.33.0', b: 'velho1', nv: false });
  await guardaVersao(env, 'uDual', { v: '2.33.0', b: 'velho1', nv: false });
  const titles = []; const send = async (e, m, msg) => titles.push(msg.title);
  await lembraAtualizar(env, Date.parse('2026-11-28T15:00:00-03:00'), send);
  assert.ok(titles.every((t) => !/Chegou versão nova/.test(t)), 'nada de "atualize"');
});
test('por aparelho: o aparelho já atualizado não recebe "atualize"; o atrasado recebe', async () => {
  globalThis.fetch = async () => ({ ok: true, json: async () => ({ version: '2.35.0', build: 'nov7777' }) });
  const CAL = kv(), env = { CAL };
  await CAL.put('dev:uPhone', JSON.stringify({ 'd-novo': { b: 'nov7777', subscription: {} }, 'd-velho': { b: 'velho1', subscription: {} } }));
  await CAL.put('dev:uAllNew', JSON.stringify({ 'd-a': { b: 'nov7777', subscription: {} } }));
  const calls = []; const send = async (e, m, msg, excl) => calls.push([m, excl]);
  await lembraAtualizar(env, Date.parse('2026-11-28T15:00:00-03:00'), send);
  assert.deepEqual(calls, [['uPhone', ['d-novo']]], 'manda só para o aparelho atrasado');
});
