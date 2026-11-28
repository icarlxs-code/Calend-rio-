import { test } from 'node:test';
import assert from 'node:assert/strict';
import { iaComCota, porHora, usoIA } from '../src/cota.js';
import { askFree } from '../src/freeai.js';
import { humanize } from '../src/pcoach.js';
const banco = () => { const m = new Map(); return { get: async (k, t) => (m.has(k) ? (t === 'json' ? JSON.parse(m.get(k)) : m.get(k)) : null), put: async (k, v) => m.set(k, v) }; };
const ai = (log = [], resp = 'x'.repeat(3500)) => ({ run: async (m, i) => { log.push([m, i]); return { response: resp }; } });
test('esgotar o assistente não tira a IA do amigo', async () => {
  const kv = banco(), A = iaComCota(ai([], '{"title":"Oi 😊","body":"Tem dentista hoje às 15h, vamos?"}'), kv, 'amigo', { cotas: { ask: 1, amigo: 2000, lotes: 10 } });
  await A.para('ask', 'a').run('70b', { messages: 'm'.repeat(2000) });
  await assert.rejects(A.para('ask', 'b').run('70b', {}), /limite|acabou por hoje/);
  const r = await humanize({ AI: A }, { kind: 'agenda', title: 't', body: 'b', fact: 'dentista 15h' }, { name: 'Ana', ia: true, work: { profession: 'designer', goal: 'subir de cargo' }, prefs: { pronoun: 'f' } }, [], { h: 10, m: 0, wd: 3 });
  assert.ok(r && r.body); assert.ok((await usoIA(kv)).porFuncao.ask > 0);
});
test('a segunda pessoa continua quando a primeira passa do limite dela', async () => {
  const A = iaComCota(ai(), banco(), 'ask', { pessoaMax: 100 });
  await A.para('ask', 'a').run('70b', {}); await assert.rejects(A.para('ask', 'a').run('70b', {}), (e) => e.status === 429); assert.ok(await A.para('ask', 'b').run('70b', {}));
});
test('contexto curto, modelo pequeno na pergunta curta e 30 por hora', async () => {
  const log = [], env = { AI: iaComCota(ai(log), banco(), 'ask') };
  await askFree(env, { question: 'o que tenho hoje?', history: [], context: '§'.repeat(60000), me: { id: 'a', name: 'Ana' }, today: '2026-11-25' });
  assert.match(log[0][0], /8b/); assert.ok(log[0][1].messages[0].content.split('§').length - 1 <= 12000); assert.ok(log[0][1].max_tokens <= 700);
  await askFree(env, { question: 'marca dentista amanhã 15h', history: [], context: '', me: { id: 'a', name: 'Ana' } }); assert.match(log[1][0], /70b/);
  const kv = banco(); let n = 0; for (let i = 0; i < 40; i++) if (await porHora(kv, 'a')) n++; assert.equal(n, 30);
});

test('resposta da IA no formato novo (choices) vira { response } para todo o servidor', async () => {
  const { iaComCota, textoDaIA } = await import('../src/cota.js');
  const m = new Map(), kv = { get: async (k) => (m.has(k) ? JSON.parse(m.get(k)) : null), put: async (k, v) => m.set(k, v) };
  const novo = { choices: [{ index: 0, message: { role: 'assistant', content: '{"title":"Oi","body":"Bebe água 💧"}' } }] };
  const ai = iaComCota({ run: async () => novo }, kv);
  assert.equal((await ai.run('@cf/meta/llama-3.1-8b-instruct-fast', { messages: [] })).response, '{"title":"Oi","body":"Bebe água 💧"}');
  assert.equal(textoDaIA({ response: 'antigo' }).response, 'antigo');
  assert.equal(textoDaIA(null), null);
});
