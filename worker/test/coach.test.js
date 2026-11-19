import { test } from 'node:test';
import assert from 'node:assert/strict';
import { workFallback, runCoach } from '../src/coach.js';

const w = { arch: 'saude_plantao', profession: 'Enfermeiro', tips: ['Confira a passagem de plantão por escrito.'], next: [{ date: '2026-11-20', time: '19:00', label: 'Plantão', title: 'Plantão UTI', who: 'u1' }], late: 0, me: 'u1' };

test('dicas de outras profissões não falam de posts', () => {
  assert.match(workFallback('dica', w, 'Ana', '2026-11-20').body, /passagem de plantão/);
  assert.match(workFallback('dica', w, 'Ana', '2026-11-20').title, /enfermeiro/);
  const ag = workFallback('agenda', w, 'Ana', '2026-11-20');
  assert.match(ag.title, /Plantão às 19h/);
  assert.match(ag.body, /^Hoje/);
  assert.match(workFallback('agenda', { ...w, late: 2 }, 'Ana', '2026-11-20').body, /2 compromissos atrasados/);
  for (const k of ['dica', 'agenda', 'motivacao', 'pausa']) assert.doesNotMatch(JSON.stringify(workFallback(k, w, 'Ana', '2026-11-20')), /post|story|reels|feed/i);
});

test('coach de uma enfermeira usa o perfil de trabalho (sem trends)', async () => {
  const kv = new Map([['coach-ctx:u1', JSON.stringify({ companies: [], work: w })]]);
  let fetched = 0;
  const origFetch = globalThis.fetch;
  globalThis.fetch = async () => { fetched++; return new Response('', { status: 500 }); };
  const env = { CAL: { get: async (k, t) => (kv.has(k) ? (t === 'json' ? JSON.parse(kv.get(k)) : kv.get(k)) : null), put: async (k, v) => kv.set(k, v) } };
  const sent = [];
  const realNow = Date.now;
  Date.now = () => Date.parse('2026-11-20T15:00:00-03:00');
  try {
    await runCoach(env, async (e, id, msg) => { sent.push(msg); return 1; }, [{ id: 'u1', name: 'Ana', ctxKey: 'coach-ctx:u1' }]);
  } finally { Date.now = realNow; globalThis.fetch = origFetch; }
  assert.equal(sent.length, 1);
  assert.doesNotMatch(sent[0].body, /post|story|reels/i);
  assert.equal(fetched, 0, 'não busca trends para outras profissões');
});
