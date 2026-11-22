/* Testes do servidor grátis: roda o código do Worker em Node com um KV de mentira
   e intercepta os envios de notificação (decifrando cada um). */
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
const require = createRequire(new URL('../../functions/package.json', import.meta.url));
const ece = require('http_ece');
const { handle, cronTick } = await import('../src/index.js');
const runSchedule = async (e) => (await cronTick(e, { kinds: ['rem'] })).sent;
const devicesAll = () => [...kv.entries()].filter(([k]) => k.startsWith('dev:')).flatMap(([, v]) => Object.values(JSON.parse(v)));

const kv = new Map();
const env = {
  CAL: {
    get: async (k, t) => (kv.has(k) ? (t === 'json' ? JSON.parse(kv.get(k)) : kv.get(k)) : null),
    put: async (k, v) => kv.set(k, v),
    delete: async (k) => kv.delete(k),
    scan: async (p) => [...kv.entries()].filter(([k]) => k.startsWith(p)),
  },
  TEAM: JSON.stringify([{ id: 'henrique', name: 'Henrique', email: 'icarlxs@gmail.com' }, { id: 'matheus', name: 'Matheus', email: 'contatopedrazzi1@gmail.com' }]),
  PROJECT_ID: 'demo',
  ALLOW_EMULATOR_TOKENS: '1',
  ALLOWED_ORIGINS: 'https://icarlxs-code.github.io',
};
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
// a antiga dupla agora são duas contas próprias; o Matheus participa da agenda compartilhada do Henrique
const UID = { 'icarlxs@gmail.com': 'henriqueUid00001', 'contatopedrazzi1@gmail.com': 'matheusUid000001' };
const ID = { h: 'uhenriqueUid00001', m: 'umatheusUid000001' };
const uidOf = (email) => UID[email] || ('x' + Buffer.from(email).toString('hex')).slice(0, 24);
const token = (email, exp = Math.floor(Date.now() / 1000) + 3600) => `${b64({ alg: 'none' })}.${b64({ email, exp, user_id: uidOf(email), sub: uidOf(email) })}.`;

// aparelhos falsos: guardam a chave para decifrar o que chegar
const phones = {};
function phone(name) {
  const ecdh = crypto.createECDH('prime256v1'); ecdh.generateKeys();
  const auth = crypto.randomBytes(16);
  phones[name] = { ecdh, auth, inbox: [], endpoint: `https://web.push.apple.com/${name}` };
  return { endpoint: phones[name].endpoint, keys: { p256dh: ecdh.getPublicKey().toString('base64url'), auth: auth.toString('base64url') } };
}
const realFetch = globalThis.fetch;
globalThis.fetch = async (url, init) => {
  const p = Object.values(phones).find((x) => x.endpoint === url);
  if (!p) return realFetch(url, init);
  assert.match(init.headers.Authorization, /^vapid t=[\w-]+\.[\w-]+\.[\w-]+, k=[\w-]{80,}$/);
  assert.equal(init.headers['Content-Encoding'], 'aes128gcm');
  const msg = JSON.parse(ece.decrypt(Buffer.from(init.body), { version: 'aes128gcm', privateKey: p.ecdh, authSecret: p.auth }).toString());
  p.inbox.push(msg);
  return new Response(null, { status: 201 });
};
const call = async (path, { as, body, method = 'POST', origin = 'https://icarlxs-code.github.io' } = {}) => {
  const headers = { 'Content-Type': 'application/json', Origin: origin };
  if (as) headers.Authorization = `Bearer ${token(as)}`;
  if (as === 'contatopedrazzi1@gmail.com' && body && typeof body === 'object' && !body.ws) body = { ...body, ws: UID['icarlxs@gmail.com'] };
  const res = await handle(new Request(`https://w.dev${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined }), env);
  return { status: res.status, data: await res.json().catch(() => null), headers: res.headers };
};

before(async () => {
  // Henrique (fundador: para sempre, agenda compartilhada inclusa) convidou o Matheus
  await call('/billing/status', { as: 'icarlxs@gmail.com', body: {} });
  kv.set(`team:${UID['icarlxs@gmail.com']}`, JSON.stringify({ ownerUid: UID['icarlxs@gmail.com'], ownerId: ID.h, ownerName: 'Henrique', members: [{ uid: UID['contatopedrazzi1@gmail.com'], id: ID.m, name: 'Matheus' }], seats: 4, active: true }));
  kv.set(`member:${UID['contatopedrazzi1@gmail.com']}`, UID['icarlxs@gmail.com']);
  await call('/subscribe', { as: 'icarlxs@gmail.com', body: { id: 'h1', subscription: phone('henrique') } });
  await call('/subscribe', { as: 'contatopedrazzi1@gmail.com', body: { id: 'm1', subscription: phone('matheus') } });
});

test('chave pública para o app', async () => {
  const r = await call('/vapid', { method: 'GET' });
  assert.equal(r.status, 200);
  assert.equal(Buffer.from(r.data.publicKey, 'base64url').length, 65);
});

test('aviso do parceiro chega na hora (e não volta para quem marcou)', async () => {
  const r = await call('/notify', { as: 'contatopedrazzi1@gmail.com', body: { to: [ID.h, ID.m], title: 'Matheus marcou para você', body: 'Story · Pura Vida — amanhã, 16h' } });
  assert.equal(r.data.sent, 1);
  assert.equal(phones.henrique.inbox.at(-1).title, 'Matheus marcou para você');
  assert.equal(phones.matheus.inbox.length, 0);
});

test('compromisso novo avisa os dois celulares e diz quem recebeu', async () => {
  const h = phones.henrique.inbox.length, m = phones.matheus.inbox.length;
  const r = await call('/notify', { as: 'icarlxs@gmail.com', body: { to: [ID.h, ID.m], includeSelf: true, title: 'Novo na agenda: Feed · Garcia Hortifruti', body: 'hoje, 22h' } });
  assert.deepEqual(r.data.results, { [ID.h]: 1, [ID.m]: 1 });
  assert.equal(phones.henrique.inbox.length, h + 1);
  assert.equal(phones.matheus.inbox.length, m + 1);
});

test('lembrete dispara no minuto certo e só uma vez', async () => {
  const now = Date.now();
  await call('/schedule', { as: 'icarlxs@gmail.com', body: { items: [
    { id: 'r1', at: now - 1000, member: ID.h, title: 'Daqui a 2h: Reels · Pura Vida', body: '18h — postar o Reels', kind: 'reminders' },
    { id: 'r2', at: now + 3600e3, member: ID.h, title: 'futuro', body: 'x' },
  ] } });
  const before = phones.henrique.inbox.length;
  assert.equal(await runSchedule(env), 1);
  assert.equal(phones.henrique.inbox.at(-1).title, 'Daqui a 2h: Reels · Pura Vida');
  assert.equal(await runSchedule(env), 0, 'não repete');
  assert.equal(phones.henrique.inbox.length, before + 1);
  // reenviar a lista (outro celular atualizou) não pode repetir o que já foi enviado
  await call('/schedule', { as: 'contatopedrazzi1@gmail.com', body: { items: [{ id: 'r1', at: now - 1000, member: ID.h, title: 'Daqui a 2h: Reels · Pura Vida', body: 'x' }] } });
  assert.equal(await runSchedule(env), 0);
});

test('preferência desligada é respeitada', async () => {
  await call('/subscribe', { as: 'contatopedrazzi1@gmail.com', body: { id: 'm1', subscription: { endpoint: phones.matheus.endpoint, keys: { p256dh: phones.matheus.ecdh.getPublicKey().toString('base64url'), auth: phones.matheus.auth.toString('base64url') } }, prefs: { partner: false } } });
  const r = await call('/notify', { as: 'icarlxs@gmail.com', body: { to: [ID.m], title: 'oi', body: 'x' } });
  assert.equal(r.data.sent, 0);
});

test('segurança: sem login, login vencido e intruso são barrados', async () => {
  assert.equal((await call('/notify', { body: { to: [ID.h], title: 'x' } })).status, 401);
  // qualquer pessoa com login tem conta própria; sem plano e fora da equipe, não avisa ninguém
  assert.ok([401, 402, 403].includes((await call('/notify', { as: 'intruso@exemplo.com', body: { to: [ID.h], title: 'x' } })).status));
  const old = await handle(new Request('https://w.dev/notify', { method: 'POST', headers: { Authorization: `Bearer ${token('icarlxs@gmail.com', 1000)}` }, body: '{}' }), env);
  assert.equal(old.status, 401);
  // sem o modo de teste, token sem assinatura é recusado
  const r = await handle(new Request('https://w.dev/notify', { method: 'POST', headers: { Authorization: `Bearer ${token('icarlxs@gmail.com')}` }, body: '{}' }), { ...env, ALLOW_EMULATOR_TOKENS: '0' });
  assert.equal(r.status, 401);
});

test('aparelho que desinstalou é removido', async () => {
  phones.henrique.endpoint = 'https://web.push.apple.com/gone';
  const saved = globalThis.fetch;
  globalThis.fetch = async () => new Response(null, { status: 410 });
  await call('/notify', { as: 'contatopedrazzi1@gmail.com', body: { to: [ID.h], title: 'x', body: 'y' } });
  globalThis.fetch = saved;
  assert.equal(devicesAll().filter((d) => d.member === ID.h).length, 0);
});

test('CORS para o site do app', async () => {
  const r = await call('/vapid', { method: 'GET' });
  assert.equal(r.headers.get('Access-Control-Allow-Origin'), 'https://icarlxs-code.github.io');
});

test('chat grátis (IA do Cloudflare) responde com a agenda', async () => {
  let got;
  const AI = { run: async (model, input) => { got = { model, input }; return { response: 'Amanhã: 13h Feed · Garcia Hortifruti' }; } };
  const r = await handle(new Request('https://w.dev/ask', { method: 'POST', headers: { Authorization: `Bearer ${token('icarlxs@gmail.com')}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ question: 'O que tenho amanhã?', context: 'Agenda: 13h Feed Garcia' }) }), { ...env, AI });
  const data = await r.json();
  assert.equal(r.status, 200, JSON.stringify(data));
  assert.equal(data.answer, 'Amanhã: 13h Feed · Garcia Hortifruti');
  assert.match(got.model, /llama-3\.3-70b/);
  assert.match(got.input.messages[0].content, /Quem pergunta: Henrique[\s\S]*13h Feed Garcia/);
  const h = await handle(new Request('https://w.dev/health'), { ...env, AI });
  assert.equal((await h.json()).chat, true);
});

test('chat grátis: se o modelo grande falhar, usa o menor', async () => {
  const AI = { run: async (model) => { if (/70b/.test(model)) throw new Error('daily limit'); return { response: 'ok pequeno' }; } };
  const r = await handle(new Request('https://w.dev/ask', { method: 'POST', headers: { Authorization: `Bearer ${token('icarlxs@gmail.com')}` }, body: JSON.stringify({ question: 'oi', context: 'x' }) }), { ...env, AI });
  assert.equal((await r.json()).answer, 'ok pequeno');
});

test('chat sem chave avisa claramente', async () => {
  const r = await call('/ask', { as: 'icarlxs@gmail.com', body: { question: 'oi', context: 'x' } });
  assert.equal(r.status, 412);
  assert.match(r.data.error, /ainda não foi ligada/);
});

test('chat com chave: usa Haiku 5.5 com esforço baixo e manda a agenda', async () => {
  let sent;
  const saved = globalThis.fetch;
  globalThis.fetch = async (url, init) => {
    const u = typeof url === 'string' ? url : url.url;
    if (!u.startsWith('https://api.anthropic.com/')) return saved(url, init);
    sent = JSON.parse(init.body);
    return new Response(JSON.stringify({ id: 'm', type: 'message', role: 'assistant', model: sent.model, content: [{ type: 'text', text: 'Amanhã: 13h Feed · Pura Vida' }], stop_reason: 'end_turn', stop_sequence: null, usage: { input_tokens: 1, output_tokens: 1 } }), { status: 200, headers: { 'content-type': 'application/json' } });
  };
  const r = await handle(new Request('https://w.dev/ask', { method: 'POST', headers: { Authorization: `Bearer ${token('icarlxs@gmail.com')}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ question: 'O que tenho amanhã?', context: 'Agenda: 13h Feed Pura Vida', history: [{ role: 'assistant', text: 'oi' }] }) }), { ...env, ANTHROPIC_API_KEY: 'sk-test' });
  globalThis.fetch = saved;
  const data = await r.json();
  assert.equal(r.status, 200, JSON.stringify(data));
  assert.equal(data.answer, 'Amanhã: 13h Feed · Pura Vida');
  assert.equal(sent.model, 'claude-haiku-5-5');
  assert.equal(sent.output_config.effort, 'low');
  assert.match(sent.system[1].text, /Quem pergunta: Henrique[\s\S]*13h Feed Pura Vida/);
  assert.equal(sent.messages[0].role, 'user', 'conversa começa pela pessoa');
});

test('ninguém sequestra o aparelho de outra pessoa reaproveitando o identificador dele', async () => {
  const [h, m] = JSON.parse(env.TEAM).map((x) => x.email);
  await call('/subscribe', { as: h, body: { id: 'h9', subscription: phone('henrique') } });
  const before = phones.henrique.inbox.length;
  // o parceiro tenta registrar o PRÓPRIO celular com o identificador do aparelho do Henrique
  await call('/subscribe', { as: m, body: { id: 'h9', subscription: phone('intruso') } });
  const r = await call('/test', { as: h });
  assert.equal(r.status, 200);
  assert.equal(phones.henrique.inbox.length, before + 1, 'o aviso do Henrique continua indo para o celular dele');
  assert.equal(phones.intruso.inbox.length, 0, 'e nunca para o celular de outra pessoa');
});

test('sem plano ativo o servidor não guarda lembretes, não manda avisos e o assistente não responde', async () => {
  const tk = `${b64({ alg: 'none' })}.${b64({ email: 'novo@teste.local', user_id: 'SEMPLANO123', exp: Math.floor(Date.now() / 1000) + 3600 })}.`;
  const req = (path, body = {}) => handle(new Request(`https://w.dev${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tk}` }, body: JSON.stringify(body) }), env);
  for (const p of ['/schedule', '/personal', '/coach', '/ask', '/notify', '/tidy', '/test']) {
    const r = await req(p, { items: [{ id: 'x', at: Date.now() + 60e3, member: 'uSEMPLANO123', title: 'burla' }], question: 'oi', title: 'x', to: ['uSEMPLANO123'] });
    assert.equal(r.status, 402, `${p} bloqueado sem plano`);
    assert.equal((await r.json()).locked, true);
  }
  assert.equal(kv.get('schedule:SEMPLANO123'), undefined, 'nada foi guardado');
  // começou o teste grátis: libera
  const t = await req('/billing/trial', { deviceId: 'dev-semplano', cpf: '' });
  assert.equal((await t.json()).plan, 'trial');
  const ok = await req('/schedule', { items: [{ id: 'y', at: Date.now() + 60e3, member: 'uSEMPLANO123', title: 'ok' }] });
  assert.equal(ok.status, 200);
  assert.ok(JSON.parse(kv.get('reg:uSEMPLANO123')).until > Date.now(), 'o relógio sabe até quando vale');
  // o teste acabou: o relógio para de mandar (sem o app precisar avisar)
  const reg = JSON.parse(kv.get('reg:uSEMPLANO123')); reg.until = Date.now() - 1; kv.set('reg:uSEMPLANO123', JSON.stringify(reg));
  const { everyone } = await import('../src/index.js');
  assert.ok(!(await everyone(env)).some((m) => m.id === 'uSEMPLANO123'));
});

test('segurança: notificação nunca leva para site de fora; sair da conta tira o aparelho; pedidos em rajada são barrados', async () => {
  const [h, m] = JSON.parse(env.TEAM).map((x) => x.email);
  await call('/subscribe', { as: m, body: { id: 'm-link', subscription: phone('matheus') } });
  phones.matheus.inbox.length = 0;
  await call('/notify', { as: h, body: { to: [ID.m], title: 'Clique aqui', url: 'https://golpe.example/login' } });
  await call('/notify', { as: h, body: { to: [ID.m], title: 'Outro', url: 'javascript:alert(1)' } });
  await call('/notify', { as: h, body: { to: [ID.m], title: 'Certo', url: './#/e/e_abc123' } });
  assert.deepEqual(phones.matheus.inbox.map((x) => x.url), ['./', './', './#/e/e_abc123']);
  // sair da conta: o aparelho deixa de receber
  await call('/subscribe', { as: m, body: { id: 'm-sair', subscription: phone('sair') } });
  const before = devicesAll().filter((d) => d.subscription.endpoint === phones.sair.endpoint).length;
  assert.equal(before, 1);
  // outra pessoa não consegue tirar o aparelho de alguém
  await call('/unsubscribe', { as: h, body: { id: 'm-sair', endpoint: phones.sair.endpoint } });
  assert.equal(devicesAll().filter((d) => d.subscription.endpoint === phones.sair.endpoint).length, 1);
  const r = await call('/unsubscribe', { as: m, body: { id: 'm-sair', endpoint: phones.sair.endpoint } });
  assert.equal(r.data.removed, 1);
  assert.equal(devicesAll().filter((d) => d.subscription.endpoint === phones.sair.endpoint).length, 0);
  // rajada: o limite por minuto devolve 429
  let last = 0;
  for (let i = 0; i < 14; i++) last = (await call('/log', { as: m, body: { msg: `erro ${i}` } })).status;
  assert.equal(last, 429);
  // pedido gigante é recusado
  const big = await handle(new Request('https://w.dev/schedule', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token(m)}`, 'Content-Length': '9000000' }, body: '{}' }), env);
  assert.equal(big.status, 413);
});
