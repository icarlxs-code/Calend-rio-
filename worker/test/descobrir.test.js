/* Descobrir amigos e recompensas: sugestões por amigos em comum, busca por e-mail, perto de você (só a região),
   amigos próximos e o XP por convite (pago pelo servidor uma vez só, sem dar pra repetir removendo e adicionando). */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
const { handle } = await import('../src/index.js');
const kv = new Map();
const env = {
  CAL: { get: async (k, t) => (kv.has(k) ? (t === 'json' ? JSON.parse(kv.get(k)) : kv.get(k)) : null), put: async (k, v) => kv.set(k, v), delete: async (k) => kv.delete(k), scan: async (p) => [...kv.entries()].filter(([k]) => k.startsWith(p)) },
  TEAM: '[]', PROJECT_ID: 'demo', ALLOW_EMULATOR_TOKENS: '1', ALLOWED_ORIGINS: 'https://meulembra.com.br',
};
globalThis.fetch = async () => new Response(null, { status: 201 });
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
const tok = (uid) => `${b64({ alg: 'none' })}.${b64({ email: `${uid}@teste.local`, user_id: uid, sub: uid, exp: Math.floor(Date.now() / 1000) + 3600 })}.`;
const call = async (path, uid, body = {}) => {
  const res = await handle(new Request(`https://w.dev${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://meulembra.com.br', Authorization: `Bearer ${tok(uid)}` }, body: JSON.stringify({ ws: '', ...body }) }), env);
  return { status: res.status, data: await res.json().catch(() => null) };
};
const H = (s) => createHash('sha256').update(s).digest('hex');
const [ANA, BIA, CIC, DUD, TEO] = ['anaDesc00000001', 'biaDesc00000001', 'cicDesc00000001', 'dudDesc00000001', 'teoDesc00000001'];
const amigos = async (a, b) => { await call('/friends/request', a, { uid: b }); await call('/friends/request', b, { uid: a }); };

test('convite: conta nova que entra pelo link → +300 pra quem convidou, +100 pra quem chegou; não repete', async () => {
  await call('/friends/card', ANA, { name: 'Ana Souza', since: Date.now() - 90 * 864e5 });
  const { token } = (await call('/friends/link', ANA)).data;
  await call('/friends/card', BIA, { name: 'Bia Lima', since: Date.now() });
  const o = (await call('/friends/open', BIA, { token })).data;
  assert.equal(o.premio, 100, 'avisa a quem chegou que ganha as boas-vindas');
  await call('/friends/answer', BIA, { from: ANA, ok: true });
  const pa = (await call('/friends/list', ANA)).data.premios, pb = (await call('/friends/list', BIA)).data.premios;
  assert.deepEqual(pa.map((x) => x.xp).sort(), [300, 40]);
  assert.deepEqual(pb.map((x) => x.xp).sort(), [100, 40]);
  assert.match(pa.find((x) => x.xp === 300).why, /Bia entrou no Lembra pelo seu convite/);
  // remover e adicionar de novo não paga de novo
  await call('/friends/remove', ANA, { uid: BIA });
  await amigos(ANA, BIA);
  assert.equal((await call('/friends/list', ANA)).data.premios.length, 2, 'sem XP repetido');
});

test('conta antiga que abre o convite não conta como "trazida" (só a amizade)', async () => {
  await call('/friends/card', CIC, { name: 'Cic', since: Date.now() - 400 * 864e5 });
  const { token } = (await call('/friends/link', ANA)).data;
  const o = (await call('/friends/open', CIC, { token })).data;
  assert.equal(o.premio, 0);
  await call('/friends/answer', CIC, { from: ANA, ok: true });
  assert.deepEqual((await call('/friends/list', CIC)).data.premios.map((x) => x.xp), [40]);
});

test('sugestões: amigos de amigos com o motivo; dispensar some; bloqueado nunca aparece', async () => {
  await call('/friends/card', DUD, { name: 'Dudu', since: 1 });
  await amigos(BIA, DUD); await amigos(CIC, DUD);
  const s = (await call('/friends/suggest', ANA)).data.rows;
  assert.equal(s[0].uid, DUD);
  assert.equal(s[0].mutuos, 2);
  assert.match(s[0].motivo, /2 amigos em comum/);
  await call('/friends/dismiss', ANA, { uid: DUD });
  assert.equal((await call('/friends/suggest', ANA)).data.rows.length, 0);
  // menor de idade não é sugerido para adulto
  await call('/friends/card', TEO, { name: 'Teo', teen: true });
  await amigos(BIA, TEO);
  assert.ok(!(await call('/friends/suggest', CIC)).data.rows.some((r) => r.uid === TEO));
});

test('achar pelo e-mail embaralhado; menor e quem desligou não são achados', async () => {
  const h = H('lembra-mail:dudu@teste.local');
  await call('/friends/card', DUD, { name: 'Dudu', emailHash: h });
  const r = (await call('/friends/email', ANA, { hash: h })).data.row;
  assert.equal(r.uid, DUD); assert.equal(r.rel, 'nenhum');
  await call('/friends/card', DUD, { name: 'Dudu', emailHash: h, achavel: false });
  assert.equal((await call('/friends/email', ANA, { hash: h })).data.row, null);
  const ht = H('lembra-mail:teo@teste.local');
  await call('/friends/card', TEO, { name: 'Teo', teen: true, emailHash: ht });
  assert.equal((await call('/friends/email', ANA, { hash: ht })).data.row, null);
});

test('perto de você: até 100 km, do mais perto ao mais longe, amigos também; sem coordenadas; sem menores; desligar tira', async () => {
  await call('/friends/perto', DUD, { lat: -22.9035, lon: -43.2096 });   // ~0 km
  await call('/friends/perto', CIC, { lat: -22.95, lon: -43.6 });       // ~40 km (e amigo da Bia)
  await call('/friends/perto', BIA, { lat: -23.5, lon: -46.6 });        // São Paulo: ~350 km → fora
  const r = (await call('/friends/perto', ANA, { lat: -22.9068, lon: -43.1729 })).data.rows;
  const ids = r.map((x) => x.uid);
  assert.deepEqual(ids.filter((u) => [DUD, CIC, BIA].includes(u)), [DUD, CIC], 'ordem por distância; SP fica de fora');
  assert.match(r.find((x) => x.uid === DUD).motivo, /a menos de 2 km|a \d km/);
  assert.match(r.find((x) => x.uid === CIC).motivo, /~40 km|~35 km|~45 km/);
  assert.ok(!/-22\.9|-43\./.test(JSON.stringify(r)), 'nunca devolve coordenadas');
  // amigo também aparece (marcado como amigo)
  await amigos(ANA, DUD);
  const r2 = (await call('/friends/perto', ANA, { lat: -22.9068, lon: -43.1729 })).data.rows;
  assert.equal(r2[0].uid, DUD); assert.equal(r2[0].rel, 'amigo'); assert.match(r2[0].motivo, /^Amigo · /);
  assert.equal((await call('/friends/perto', TEO, { lat: -22.9, lon: -43.2 })).status, 403);
  await call('/friends/perto', DUD, { on: false });
  assert.ok(!(await call('/friends/perto', ANA, { lat: -22.9068, lon: -43.1729 })).data.rows.some((x) => x.uid === DUD));
});

test('amigos próximos: marcar e desmarcar; só amigos', async () => {
  await call('/friends/close', ANA, { uid: BIA, on: true });
  assert.equal((await call('/friends/list', ANA)).data.friends.find((f) => f.uid === BIA).close, true);
  assert.equal((await call('/friends/close', ANA, { uid: TEO, on: true })).status, 400);
  await call('/friends/close', ANA, { uid: BIA, on: false });
  assert.equal((await call('/friends/list', ANA)).data.friends.find((f) => f.uid === BIA).close, false);
});
