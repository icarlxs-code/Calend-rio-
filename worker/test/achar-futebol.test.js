/* Achar pessoas (telefone, e-mail, ID) e time do coração */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
const { handle } = await import('../src/index.js');
const F = await import('../src/futebol.js');
const { achaTimes, timeDoNome, TIMES } = await import('../../functions/times.js');
const kv = new Map();
const env = { CAL: { get: async (k, t) => (kv.has(k) ? (t === 'json' ? JSON.parse(kv.get(k)) : kv.get(k)) : null), put: async (k, v) => kv.set(k, v), delete: async (k) => kv.delete(k), scan: async (p) => [...kv.entries()].filter(([k]) => k.startsWith(p)) }, TEAM: '[]', PROJECT_ID: 'demo', ALLOW_EMULATOR_TOKENS: '1', ALLOWED_ORIGINS: 'https://meulembra.com.br' };
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
const tok = (uid) => `${b64({ alg: 'none' })}.${b64({ email: `${uid}@teste.local`, user_id: uid, sub: uid, exp: Math.floor(Date.now() / 1000) + 3600 })}.`;
const call = async (path, uid, body = {}) => { const r = await handle(new Request(`https://w.dev${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://meulembra.com.br', Authorization: `Bearer ${tok(uid)}` }, body: JSON.stringify({ ws: '', ...body }) }), env); return { status: r.status, ...(await r.json().catch(() => ({}))) }; };
const H = (s) => createHash('sha256').update(s).digest('hex');
const [ANA, BIA, TEO] = ['anaAchar00000001', 'biaAchar00000001', 'teoAchar00000001'];

test('achar por telefone, e-mail e ID; menor e quem desligou não aparecem', async () => {
  await call('/friends/card', ANA, { name: 'Ana Prado' });
  await call('/friends/card', BIA, { name: 'Bia Lima', phoneHash: H('lembra:21988887777'), emailHash: H('lembra-mail:bia@x.com'), achavel: true });
  await call('/friends/card', TEO, { name: 'Teo Reis', phoneHash: H('lembra:21911112222'), teen: true, cidade: 'Rio', idade: 15 });
  const id = (await call('/friends/id', BIA)).id; assert.match(id, /^bia\d{4}$/);
  assert.equal((await call('/friends/id', BIA)).id, id, 'não muda sozinho');
  assert.equal((await call('/friends/achar', ANA, { tel: [H('lembra:21988887777')] })).row.uid, BIA);
  assert.equal((await call('/friends/achar', ANA, { mail: H('lembra-mail:bia@x.com') })).row.uid, BIA);
  assert.equal((await call('/friends/achar', ANA, { id: '@' + id.toUpperCase() })).row.uid, BIA);
  assert.equal((await call('/friends/achar', BIA, { id })).self, true);
  assert.equal((await call('/friends/achar', ANA, { tel: [H('lembra:21911112222')] })).row, null, 'menor');
  assert.equal((await call('/friends/achar', ANA, { id: (await call('/friends/id', TEO)).id })).row, null, 'menor pelo ID');
  assert.ok(!JSON.parse(kv.get(`card:${TEO}`)).idade, 'menor sem idade');
  assert.equal((await call('/friends/id', BIA, { novo: 'bia.lima' })).id, 'bia.lima');
  assert.equal((await call('/friends/achar', ANA, { id })).row, null, 'o ID antigo não vale mais');
  for (const ruim of ['a', '1abc', 'a..b', 'lembra', 'admin1', 'ab c', 'x'.repeat(21)]) assert.equal((await call('/friends/id', ANA, { novo: ruim })).status, 400, ruim);
  assert.equal((await call('/friends/id', ANA, { novo: 'bia.lima' })).status, 400, 'já tem dono');
  await call('/friends/card', BIA, { name: 'Bia Lima', phoneHash: H('lembra:21933334444'), emailHash: '', achavel: true });
  assert.equal((await call('/friends/achar', ANA, { tel: [H('lembra:21988887777')] })).row, null, 'número antigo');
  await call('/friends/card', BIA, { name: 'Bia Lima', phoneHash: H('lembra:21933334444'), achavel: false });
  assert.equal((await call('/friends/achar', ANA, { tel: [H('lembra:21933334444')] })).row, null, 'desligou');
});
test('excluir a conta solta o ID e os códigos', async () => {
  await call('/account/delete', BIA);
  assert.ok(!kv.has('uname:bia.lima') && ![...kv.values()].includes(BIA));
});
test('times: busca por apelido, sem repetição e sem escudo', () => {
  assert.equal(achaTimes('Mengão')[0].id, 'flamengo'); assert.equal(achaTimes('furacão')[0].id, 'athletico'); assert.equal(achaTimes('remo')[0].id, 'remo');
  assert.equal(new Set(TIMES.map((t) => t.id)).size, TIMES.length);
  for (const [n, id] of [['Sport Recife', 'sport'], ['Vasco DA Gama', 'vasco'], ['Atletico-MG', 'atleticomg'], ['Atletico Paranaense', 'athletico'], ['RB Bragantino', 'bragantino'], ['Goias', 'goias'], ['Vitoria', 'vitoria'], ['Botafogo', 'botafogo'], ['Fortaleza EC', 'fortaleza'], ['Clube do Remo', 'remo'], ['Racing Club', null], ['River Plate', null], ['Sport Huancayo', null]]) assert.equal(timeDoNome(n), id, n);
});
const at = (s) => Date.parse(`${s}-03:00`);
test('momento certo: véspera, dia e perto; nunca de madrugada nem depois do começo', () => {
  const j = { id: 'x', at: at('2026-11-25T21:30:00') };
  assert.equal(F.momentoDe(j, at('2026-11-24T18:10:00')), 'vespera');
  assert.equal(F.momentoDe(j, at('2026-11-25T09:10:00')), 'dia');
  assert.equal(F.momentoDe(j, at('2026-11-25T19:40:00')), 'perto');
  assert.equal(F.momentoDe(j, at('2026-11-25T03:00:00')), null);
  assert.equal(F.momentoDe(j, at('2026-11-25T21:31:00')), null);
  assert.equal(F.momentoDe(j, at('2026-11-25T19:40:00'), { sleep: '19:00' }), null, 'dormindo');
});
test('14 dias simulados: só o time da pessoa, sem repetir, sem {campo}; desligado ou sem segredo = zero', async () => {
  const jogos = F.normaliza([
    { at: at('2026-11-26T21:30:00'), casa: 'Flamengo', fora: 'Palmeiras', comp: 'A' }, { at: at('2026-11-29T16:00:00'), casa: 'Vasco da Gama', fora: 'Flamengo', comp: 'A' },
    { at: at('2026-11-30T20:00:00'), casa: 'Remo', fora: 'Goias', comp: 'B' }, { at: at('2026-11-30T20:00:00'), casa: 'Racing Club', fora: 'River Plate' }]);
  assert.equal(jogos.length, 3);
  await F.guardaTime(env, 'm1', { time: 'flamengo', avisos: true });
  await F.guardaTime(env, 'm2', { time: 'vasco', avisos: false });
  await F.guardaTime(env, 'm3', { time: 'naoexiste', avisos: true });
  const roda = async (e) => {
    const out = [];
    for (const k of [...kv.keys()]) if (/^fut:(env|bloco|tentou)/.test(k)) kv.delete(k);
    for (let t = at('2026-11-24T00:00:00'); t < at('2026-12-08T00:00:00'); t += 6e5) { kv.set('fut:jogos', JSON.stringify({ dia: F.diaBR(t), jogos })); await F.rodaFutebol({ ...env, ...e }, t, async (_, q, m, pref) => out.push({ q, m, pref })); }
    return out;
  };
  const s = await roda({ FOOTBALL_DATA_TOKEN: 'x' });
  assert.equal(s.length, 6);
  assert.ok(s.every((x) => x.q === 'm1' && x.pref === 'futebol' && /Flamengo/.test(x.m.body) && !/[{}]/.test(x.m.body)));
  assert.equal((await roda({})).length, 0, 'sem segredo');
  await F.tiraTime(env, 'm1');
  assert.equal((await roda({ FOOTBALL_DATA_TOKEN: 'x' })).length, 0, 'desligou');
});
test('rota /futebol: olhar não liga aviso', async () => {
  await call('/futebol', ANA, { time: 'remo', ver: true });
  assert.ok(!(kv.get('fut:gente') || '').includes('remo'));
  assert.equal((await call('/futebol', ANA, { time: 'remo', avisos: true })).ligado, false);
  assert.ok(kv.get('fut:gente').includes('remo'));
});
