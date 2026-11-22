/* Presente "Vitalício": o dono libera para sempre → a pessoa recebe um aviso (sem revelar o que é),
   ganha um número de membro único e o app sabe mostrar a surpresa. Só o dono pode dar. */
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
const require = createRequire(new URL('../../functions/package.json', import.meta.url));
const ece = require('http_ece');
const { handle } = await import('../src/index.js');

const kv = new Map();
const env = {
  CAL: {
    get: async (k, t) => (kv.has(k) ? (t === 'json' ? JSON.parse(kv.get(k)) : kv.get(k)) : null),
    put: async (k, v) => kv.set(k, v),
    delete: async (k) => kv.delete(k),
  },
  TEAM: JSON.stringify([{ id: 'henrique', name: 'Henrique', email: 'dono@teste.local' }, { id: 'matheus', name: 'Matheus', email: 'socio@teste.local' }]),
  ADMIN_EMAIL: 'dono@teste.local',
  PROJECT_ID: 'demo',
  ALLOW_EMULATOR_TOKENS: '1',
  ALLOWED_ORIGINS: 'https://icarlxs-code.github.io',
};
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
const token = (email, uid, name) => `${b64({ alg: 'none' })}.${b64({ email, exp: Math.floor(Date.now() / 1000) + 3600, ...{ user_id: uid || ('x' + Buffer.from(email).toString('hex')).slice(0, 24), sub: uid || ('x' + Buffer.from(email).toString('hex')).slice(0, 24) }, ...(name ? { name } : {}) })}.`;

const phones = {};
function phone(name) {
  const ecdh = crypto.createECDH('prime256v1'); ecdh.generateKeys();
  const auth = crypto.randomBytes(16);
  phones[name] = { ecdh, auth, inbox: [], endpoint: `https://web.push.apple.com/${name}` };
  return { endpoint: phones[name].endpoint, keys: { p256dh: ecdh.getPublicKey().toString('base64url'), auth: auth.toString('base64url') } };
}
globalThis.fetch = async (url, init) => {
  const p = Object.values(phones).find((x) => x.endpoint === url);
  if (!p) throw new Error('rede bloqueada no teste: ' + url);
  p.inbox.push(JSON.parse(ece.decrypt(Buffer.from(init.body), { version: 'aes128gcm', privateKey: p.ecdh, authSecret: p.auth }).toString()));
  return new Response(null, { status: 201 });
};
const call = async (path, { email, uid, name, body = {} } = {}) => {
  const res = await handle(new Request(`https://w.dev${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://icarlxs-code.github.io', Authorization: `Bearer ${token(email, uid, name)}` }, body: JSON.stringify(body) }), env);
  return { status: res.status, data: await res.json().catch(() => null) };
};
const DONO = { email: 'dono@teste.local' };
const CARLA = { email: 'carla@teste.local', uid: 'carlaUid00000001', name: 'Carla Souza' };
const JOAO = { email: 'joao@teste.local', uid: 'joaoUid000000001', name: 'João Lima' };
const raros = (who) => phones[who].inbox.filter((m) => m.tag === 'vitalicio');

before(async () => {
  await call('/billing/status', CARLA); await call('/billing/status', JOAO);
  await call('/subscribe', { ...CARLA, body: { id: 'c1', subscription: phone('carla') } });
  await call('/subscribe', { ...JOAO, body: { id: 'j1', subscription: phone('joao') } });
  await call('/subscribe', { ...DONO, body: { id: 'd1', subscription: phone('dono') } });
});

test('só o dono pode dar o acesso vitalício', async () => {
  const r = await call('/admin/grant', { ...JOAO, body: { uid: JOAO.uid, on: true } });
  assert.equal(r.status, 403);
  assert.equal(raros('joao').length, 0);
});

test('dar vitalício: a pessoa recebe o aviso misterioso e vira o membro Nº 1', async () => {
  const r = await call('/admin/grant', { ...DONO, body: { uid: CARLA.uid, on: true } });
  assert.equal(r.status, 200);
  assert.equal(r.data.gifted, true);
  assert.equal(r.data.sent, 1);
  assert.equal(r.data.status.plan, 'lifetime');
  assert.equal(r.data.status.vip.no, 1);
  const msg = raros('carla');
  assert.equal(msg.length, 1);
  assert.equal(msg[0].title, 'Você recebeu algo raro.');
  assert.doesNotMatch(msg[0].title + msg[0].body, /Henrique|vital/i, 'não diz o que é nem quem deu');
  assert.equal(raros('dono').length + raros('joao').length, 0, 'só a pessoa recebe');
});

test('o app da pessoa sabe o número, a data e quantos vitalícios existem', async () => {
  const st = (await call('/billing/status', CARLA)).data;
  assert.equal(st.plan, 'lifetime');
  assert.equal(st.active, true);
  assert.equal(st.vip.no, 1);
  assert.equal(st.vip.total, 1);
  assert.ok(st.vip.at > Date.now() - 60e3);
});

test('dar de novo para a mesma pessoa não repete o aviso nem troca o número', async () => {
  const r = await call('/admin/grant', { ...DONO, body: { uid: CARLA.uid, on: true } });
  assert.equal(r.data.gifted, undefined);
  assert.equal(r.data.status.vip.no, 1);
  assert.equal(raros('carla').length, 1);
});

test('segunda pessoa: Nº 2, e o total sobe para todo mundo', async () => {
  const r = await call('/admin/grant', { ...DONO, body: { uid: JOAO.uid, on: true } });
  assert.equal(r.data.status.vip.no, 2);
  assert.equal(raros('joao').length, 1);
  assert.equal((await call('/billing/status', CARLA)).data.vip.total, 2);
});

test('liberar só até uma data não é o presente vitalício', async () => {
  const r = await call('/admin/grant', { ...DONO, body: { uid: 'outraUid00000001', on: true, until: Date.now() + 7 * 864e5 } });
  assert.equal(r.data.status.plan, 'comp');
  assert.equal(r.data.status.vip, undefined);
  assert.equal(r.data.gifted, undefined);
});

test('tirar o acesso apaga o cartão; o número não volta a ser usado', async () => {
  await call('/admin/grant', { ...DONO, body: { uid: JOAO.uid, on: false } });
  const st = (await call('/billing/status', JOAO)).data;
  assert.notEqual(st.plan, 'lifetime');
  assert.equal(st.vip, undefined);
  const r = await call('/admin/grant', { ...DONO, body: { uid: JOAO.uid, on: true } });
  assert.equal(r.data.status.vip.no, 3);
});

test('quem ganhou o "para sempre" antes da surpresa existir recebe número e aviso (uma vez só)', async () => {
  const { vipMigrate } = await import('../src/billing.js');
  const old = { uid: 'lorenaUid0000001', lifetime: true, comp: true, lifetimeAt: Date.now() - 3600e3 };
  kv.set('bill:lorenaUid0000001', JSON.stringify(old));
  kv.set('bill:pagouUid00000001', JSON.stringify({ uid: 'pagouUid00000001', lifetime: true, lifetimeAt: Date.now() - 7200e3 })); // pagou: não é presente
  const reg = JSON.parse(kv.get('users') || '{}');
  reg.ulorenaUid0000001 = { ws: 'lorenaUid0000001' }; reg.upagouUid00000001 = { ws: 'pagouUid00000001' };
  kv.set('users', JSON.stringify(reg));
  const told = [];
  const n = await vipMigrate(env, async (uid) => { told.push(uid); return 1; });
  assert.equal(n, 1);
  assert.deepEqual(told, ['lorenaUid0000001']);
  const b = JSON.parse(kv.get('bill:lorenaUid0000001'));
  assert.ok(b.vip.no >= 1);
  assert.equal(b.vip.sent, 1);
  assert.equal(JSON.parse(kv.get('bill:pagouUid00000001')).vip, undefined, 'quem pagou não vira presente');
  // rodar de novo não repete
  assert.equal(await vipMigrate(env, async (uid) => { told.push(uid); return 1; }), 0);
  assert.equal(told.length, 1);
  const st = (await call('/billing/status', { email: 'lorena@teste.local', uid: 'lorenaUid0000001', name: 'Lorena' })).data;
  assert.equal(st.vip.no, b.vip.no);
});

test('o painel guarda se o aviso chegou no celular', async () => {
  const r = await call('/admin/grant', { ...DONO, body: { uid: 'semAvisoUid00001', on: true } });
  assert.equal(r.data.sent, 0);
  assert.equal(r.data.status.vip.sent, 0);
  const reg = JSON.parse(kv.get('users') || '{}'); reg.usemAvisoUid00001 = { ws: 'semAvisoUid00001' }; kv.set('users', JSON.stringify(reg));
  const all = (await call('/billing/all', DONO)).data;
  assert.equal(all.byWs.semAvisoUid00001.vip.sent, 0, 'o painel sabe que o aviso não chegou');
});

test('Vitalício presenteado já vem com a agenda compartilhada Equipe, sem pagar à parte', async () => {
  const { addonOf, createCheckout } = await import('../src/billing.js');
  const b = JSON.parse(kv.get(`bill:${CARLA.uid}`));
  const a = addonOf(b);
  assert.equal(a.active, true);
  assert.equal(a.plan, 'equipe');
  assert.equal(a.seats, 4);
  assert.equal(a.gift, true);
  await assert.rejects(createCheckout(env, { ws: CARLA.uid, id: 'u' + CARLA.uid, email: CARLA.email }, { plan: 'equipe' }), /já está incluída/);
  // quem pagou o vitalício (não é presente) continua com o complemento à parte
  assert.equal(addonOf({ lifetime: true }), null);
});
