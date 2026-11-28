import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lembraStory } from '../src/story-lembra.js';
const kv = () => { const m = new Map(); return { m, get: async (k) => (m.has(k) ? m.get(k) : null), put: async (k, v) => m.set(k, v), scan: async (p) => [...m.entries()].filter(([k]) => k.startsWith(p)) }; };
test('lembrete de story: três vezes por dia (10h, 15h, 20h)', async () => {
  const CAL = kv(), env = { CAL }; await CAL.put('dev:uAna', '{}'); await CAL.put('dev:uBia', '{}');
  const sent = []; const send = async (e, m, msg) => sent.push([m, msg.title]);
  const t19 = Date.parse('2026-11-28T20:01:00-03:00');
  assert.equal((await lembraStory(env, Date.parse('2026-11-28T13:00:00-03:00'), send)).motivo, 'hora');
  const r = await lembraStory(env, t19, send);
  assert.equal(r.avisos, 2); assert.equal(sent.length, 2);
  assert.equal((await lembraStory(env, t19 + 60e3, send)).pulou, 'ja', 'não repete na mesma janela');
  const t10 = Date.parse('2026-11-28T10:01:00-03:00');
  assert.equal((await lembraStory(env, t10, send)).avisos, 2, 'a janela das 10h também manda');
});
