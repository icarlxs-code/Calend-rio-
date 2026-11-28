/* Relógio novo: só olha quem está na hora, manda em lotes (limite grátis da Cloudflare),
   nunca repete e nunca perde um lembrete — inclusive com muita gente no mesmo minuto. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runTick, planReminders, planPersonal, upgradeLegacy, nextOf } from '../src/tick.js';
import { dueOf } from '../src/kvsql.js';

const mkEnv = (init = {}) => {
  const kv = new Map(Object.entries(init));
  return { kv, env: { CAL: { get: async (k, t) => (kv.has(k) ? (t === 'json' ? JSON.parse(kv.get(k)) : kv.get(k)) : null), put: async (k, v) => kv.set(k, String(v)), delete: async (k) => kv.delete(k), scan: async (p) => [...kv.entries()].filter(([k]) => k.startsWith(p)) } } };
};
const recorder = () => { const out = []; const meter = { pushes: 0 }; return { out, meter, send: async (e, m, msg) => { meter.pushes++; out.push([m, msg.title]); return 1; } }; };
const reg = (ids, now, until = now + 864e5) => Object.fromEntries(ids.map((id) => [`reg:u${id}`, JSON.stringify({ name: id, ws: id, until })]));

test('lembrete sai uma vez só, mesmo se o app regravar a lista', async () => {
  const now = Date.now();
  const { env, kv } = mkEnv({ ...reg(['A'], now), 'upgraded:v2': '1' });
  const items = [{ id: 'a', at: now - 1000, member: 'uA', title: 'agora' }, { id: 'b', at: now + 3600e3, member: 'uA', title: 'depois' }];
  kv.set('schedule:A', JSON.stringify({ items }));
  await planReminders(env, 'A', items, now);
  const r = recorder();
  await runTick(env, { now, send: r.send, meter: r.meter });
  assert.deepEqual(r.out, [['uA', 'agora']]);
  await planReminders(env, 'A', items, now + 1000); // o app manda a mesma lista de novo
  await runTick(env, { now: now + 60e3, send: r.send, meter: { pushes: 0 } });
  assert.equal(r.out.length, 1, 'não repete');
  assert.equal(await dueOf(env).get('rem:A'), now + 3600e3, 'a fila já aponta para o próximo');
  await runTick(env, { now: now + 3600e3 + 5e3, send: r.send, meter: { pushes: 0 } });
  assert.deepEqual(r.out.at(-1), ['uA', 'depois']);
  assert.equal(await dueOf(env).get('rem:A'), null, 'sem mais nada: sai da fila');
});

test('sem plano ativo não manda (e sai da fila)', async () => {
  const now = Date.now();
  const { env, kv } = mkEnv({ ...reg(['B'], now, now - 1), 'upgraded:v2': '1' });
  const items = [{ id: 'x', at: now - 1000, member: 'uB', title: 't' }];
  kv.set('schedule:B', JSON.stringify({ items }));
  await planReminders(env, 'B', items, now);
  const r = recorder();
  await runTick(env, { now, send: r.send, meter: r.meter });
  assert.equal(r.out.length, 0);
  assert.equal(await dueOf(env).get('rem:B'), null);
});

test('lembretes do Pessoal: cada lista vai só para o dono dela, uma vez', async () => {
  const now = Date.now();
  const { env, kv } = mkEnv({ ...reg(['H', 'M'], now), 'upgraded:v2': '1' });
  for (const [m, id] of [['uH', 'p1'], ['uM', 'p2']]) { const it = [{ id, at: now - 500, title: id }]; kv.set(`pitems:${m}`, JSON.stringify(it)); await planPersonal(env, m, it, now); }
  const r = recorder();
  await runTick(env, { now, send: r.send, meter: r.meter });
  assert.deepEqual(r.out.sort(), [['uH', 'p1'], ['uM', 'p2']]);
  await runTick(env, { now: now + 60e3, send: r.send, meter: { pushes: 0 } });
  assert.equal(r.out.length, 2);
});

test('1000 pessoas com lembrete no mesmo minuto: lotes pequenos, todo mundo recebe uma vez só', async () => {
  const now = Date.now();
  const ids = Array.from({ length: 1000 }, (_, i) => `P${i}`);
  const { env, kv } = mkEnv({ ...reg(ids, now), 'upgraded:v2': '1' });
  for (const id of ids) { const it = [{ id: `r-${id}`, at: now, member: `u${id}`, title: `lembrete ${id}` }]; kv.set(`schedule:${id}`, JSON.stringify({ items: it })); await planReminders(env, id, it, now - 60e3); }
  const all = [];
  let runs = 0, maxInRun = 0;
  for (;;) {
    const r = recorder();
    const res = await runTick(env, { now: now + runs * 300, send: r.send, meter: r.meter });
    all.push(...r.out); maxInRun = Math.max(maxInRun, r.meter.pushes); runs++;
    if (!res.more && !(await dueOf(env).dueBefore(now + runs * 300, 1)).length) break;
    assert.ok(runs < 200, 'termina');
  }
  assert.equal(all.length, 1000, 'todo mundo recebeu');
  assert.equal(new Set(all.map((x) => x[0])).size, 1000, 'ninguém recebeu duas vezes');
  assert.ok(maxInRun <= 8, `no máximo 8 envios por execução (teve ${maxInRun})`);
  assert.ok(runs * 0.3 < 60, `tudo sai em menos de 1 minuto (${runs} execuções)`);
});

test('pessoa com 40 lembretes vencidos de uma vez: sai em partes, nada se perde', async () => {
  const now = Date.now();
  const { env, kv } = mkEnv({ ...reg(['Z'], now), 'upgraded:v2': '1' });
  const items = Array.from({ length: 40 }, (_, i) => ({ id: `z${i}`, at: now - 1000, member: 'uZ', title: `z${i}` }));
  kv.set('schedule:Z', JSON.stringify({ items }));
  await planReminders(env, 'Z', items, now);
  const got = [];
  for (let i = 0; i < 20; i++) { const r = recorder(); await runTick(env, { now: now + i * 200, send: r.send, meter: r.meter }); got.push(...r.out); }
  assert.equal(got.length, 40);
  assert.equal(new Set(got.map((x) => x[1])).size, 40);
});

test('lista nova chegando enquanto os avisos saem: a fila segue a lista nova', async () => {
  const now = Date.now();
  const { env, kv } = mkEnv({ ...reg(['N'], now), 'upgraded:v2': '1' });
  const items = [{ id: 'n1', at: now - 100, member: 'uN', title: 'n1' }, { id: 'n2', at: now + 3 * 3600e3, member: 'uN', title: 'n2' }];
  kv.set('schedule:N', JSON.stringify({ items }));
  await planReminders(env, 'N', items, now);
  const novo = [...items, { id: 'n3', at: now + 600e3, member: 'uN', title: 'n3' }];
  const send = async (e, m, msg) => { kv.set('schedule:N', JSON.stringify({ items: novo })); return 1; }; // chega no meio do envio
  await runTick(env, { now, send, meter: { pushes: 0 } });
  assert.equal(await dueOf(env).get('rem:N'), now + 600e3);
});

test('primeira vez do servidor novo: separa as listas antigas e coloca todo mundo na fila', async () => {
  const now = Date.now();
  const { env, kv } = mkEnv({
    users: JSON.stringify({ uH: { name: 'H', ws: 'H', until: now + 864e5 }, uX: { name: 'X', ws: 'X', until: now + 864e5 } }),
    subs: JSON.stringify({ d1: { member: 'uH', subscription: { endpoint: 'https://push/1', keys: { p256dh: 'a', auth: 'b' } } }, d2: { member: 'uX', subscription: { endpoint: 'https://push/2', keys: { p256dh: 'a', auth: 'b' } } } }),
    pcoach: JSON.stringify({ uH: { next: 5, day: '2026-11-20' } }),
    coach: JSON.stringify({ next: { uH: 7 }, recent: { uH: ['oi'] } }),
    'schedule:H': JSON.stringify({ items: [{ id: 's1', at: now + 60e3, member: 'uH', title: 's1' }, { id: 's0', at: now - 1000, member: 'uH', title: 's0' }] }),
    'schedule-sent': JSON.stringify({ s0: now - 500 }),
    'pitems:uX': JSON.stringify([{ id: 'q1', at: now + 120e3, title: 'q1' }]),
  });
  await upgradeLegacy(env, now);
  assert.equal(kv.get('subs'), undefined);
  assert.deepEqual(Object.keys(JSON.parse(kv.get('dev:uH'))), ['d1']);
  assert.equal(kv.get('devid:d2'), 'uX');
  assert.equal(JSON.parse(kv.get('pc:uH')).next, 5);
  assert.deepEqual(JSON.parse(kv.get('co:uH')).recent, ['oi']);
  assert.ok(JSON.parse(kv.get('ssent:H')).s0, 'o que já tinha saído continua marcado');
  const D = dueOf(env);
  assert.equal(await D.get('rem:H'), now + 60e3);
  assert.equal(await D.get('per:uX'), now + 120e3);
  assert.equal(await D.get('amg:uH'), now);
  assert.equal(await D.get('cch:uX'), now);
  assert.ok(kv.get('upgraded:v2'));
  assert.equal(kv.get('users'), undefined, 'a lista única virou uma linha por pessoa');
  assert.equal(JSON.parse(kv.get('reg:uH')).ws, 'H');
});

test('próximo horário ignora o que já saiu e o que passou da janela', () => {
  const now = 1_000_000_000;
  assert.equal(nextOf([{ id: 'a', at: now - 20 * 60e3 }, { id: 'b', at: now + 5 }], {}, now), now + 5);
  assert.equal(nextOf([{ id: 'a', at: now - 60e3 }], {}, now), now, 'atrasado até 15 min: sai já');
  assert.equal(nextOf([{ id: 'a', at: now - 60e3 }], { a: 1 }, now), null);
});

test('bom dia, boa noite e frases com arte para TODO mundo: quem não tem plano entra na fila e recebe', async () => {
  const { seedTodos } = await import('../src/tick.js');
  const d = (hhmm) => Date.parse(`2026-11-20T${hhmm}:00-03:00`);
  const { env, kv } = mkEnv({ ...reg(['L'], d('07:00'), 0), ...reg(['P'], d('07:00'), d('07:00') + 30 * 864e5), 'upgraded:v2': '1' });
  for (const id of ['uL', 'uP']) kv.set(`pprofile:${id}`, JSON.stringify({ name: id, prefs: {}, today: [] }));
  assert.equal(await seedTodos(env, d('07:40')), 2);
  assert.equal(await seedTodos(env, d('07:41')), 0, 'uma vez só');
  const out = [];
  for (let t = d('07:40'); t <= d('23:00'); t += 60e3) await runTick(env, { now: t, send: async (e, m, msg) => { out.push([m, msg.title]); return 1; }, meter: { pushes: 0 } });
  const livre = out.filter(([m]) => m === 'uL').map(([, t]) => t);
  assert.ok(livre.length >= 4 && livre.length <= 5, `sem plano recebeu: ${livre.join(' | ')}`);
  assert.ok(out.filter(([m]) => m === 'uP').length > 2, 'com plano continua recebendo o dia todo');
});
