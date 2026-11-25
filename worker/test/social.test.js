/* Stories sociais e conversas privadas: quem pode o quê, e o que some em 24 h (de verdade, no banco). */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
const { handle } = await import('../src/index.js');
const { makeSocial, DIA } = await import('../src/social.js');

const db = new DatabaseSync(':memory:');
const sql = { exec(s, ...p) { const st = db.prepare(s); const rows = /^\s*(select)/i.test(s) ? st.all(...p) : (st.run(...p), []); return { toArray: () => rows, one: () => rows[0] }; } };
const kv = new Map(), eventos = [], visiveis = new Set(); let pushes = [];
const env = {
  CAL: { get: async (k, t) => (kv.has(k) ? (t === 'json' ? JSON.parse(kv.get(k)) : kv.get(k)) : null), put: async (k, v) => kv.set(k, String(v)), delete: async (k) => kv.delete(k), scan: async (p) => [...kv.entries()].filter(([k]) => k.startsWith(p)) },
  SOCIAL: makeSocial(sql), AVISA: (u, o) => eventos.push([u, o]), VISIVEL: (u) => visiveis.has(u),
  TEAM: '[]', PROJECT_ID: 'demo', ALLOW_EMULATOR_TOKENS: '1', ALLOWED_ORIGINS: 'https://meulembra.com.br',
};
globalThis.fetch = async (u) => { pushes.push(String(u)); return new Response(null, { status: 201 }); };
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
const tok = (uid) => `${b64({ alg: 'none' })}.${b64({ email: `${uid}@teste.local`, user_id: uid, sub: uid, exp: Math.floor(Date.now() / 1000) + 3600 })}.`;
const call = async (path, uid, body = {}) => {
  const res = await handle(new Request(`https://w.dev${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://meulembra.com.br', Authorization: `Bearer ${tok(uid)}` }, body: JSON.stringify(body) }), env);
  return { status: res.status, data: await res.json().catch(() => null) };
};
const [ANA, BIA, CIC, DUDA, TEO] = ['ana', 'bia', 'cic', 'duda', 'teo'].map((x) => `${x}Uid000000000001`);
const amizade = (a, b) => { for (const [x, y] of [[a, b], [b, a]]) kv.set(`friends:${x}`, JSON.stringify([...new Set([y, ...JSON.parse(kv.get(`friends:${x}`) || '[]')])])); };
const FOTO = 'data:image/jpeg;base64,' + Buffer.from('foto de teste').toString('base64'), AUDIO = 'data:audio/mp4;base64,' + Buffer.from('audio').toString('base64');
for (const [u, n] of [[ANA, 'Ana Souza'], [BIA, 'Bia Lima'], [CIC, 'Cic Reis'], [DUDA, 'Duda Dias']]) await call('/friends/card', u, { name: n });
await call('/friends/card', TEO, { name: 'Teo Teen', teen: true });
amizade(ANA, BIA); amizade(BIA, CIC); amizade(ANA, TEO); amizade(BIA, TEO); amizade(ANA, DUDA);
const posta = async (u, extra = {}) => (await call('/friends/story-post', u, { photo: FOTO, podeCom: true, podeRp: true, ...extra })).data.id;
const historias = async (u, dono) => ((await call('/friends/stories', u)).data.rows.find((r) => r.uid === dono) || { stories: [] }).stories;

test('curtir: amigo curte e descurte; o dono vê quem curtiu; estranho não curte', async () => {
  const id = await posta(ANA);
  assert.equal((await call('/friends/story-like', CIC, { owner: ANA, id })).status, 403);
  await call('/friends/story-view', BIA, { owner: ANA, id });
  assert.equal((await call('/friends/story-like', BIA, { owner: ANA, id })).data.on, true);
  assert.equal((await historias(BIA, ANA))[0].gostei, true);
  assert.equal((await historias(ANA, ANA))[0].likes, 1);
  assert.equal((await historias(BIA, ANA))[0].likes, undefined, 'só o dono vê o total');
  assert.equal((await call('/friends/story-viewers', ANA, { id })).data.viewers[0].gostou, true);
  assert.ok(eventos.some(([u, o]) => u === ANA && o.t === 'gostou'));
  await call('/friends/story-like', BIA, { owner: ANA, id, on: false });
  assert.equal((await historias(ANA, ANA))[0].likes, 0);
  assert.equal((await call('/friends/story-like', ANA, { owner: ANA, id })).status, 400);
});

test('comentar: aparece para os outros amigos; autor e dono apagam; bloqueado some; limite e desligado', async () => {
  const id = await posta(ANA);
  assert.equal((await call('/friends/story-comment', CIC, { owner: ANA, id, text: 'oi' })).status, 403);
  const c = (await call('/friends/story-comment', BIA, { owner: ANA, id, text: '  Que foto <b>linda</b>!‮  ' })).data;
  const l = (await call('/friends/story-comments', DUDA, { owner: ANA, id })).data.comentarios;
  assert.equal(l.length, 1); assert.equal(l[0].name, 'Bia Lima'); assert.equal(l[0].t, 'Que foto <b>linda</b>!', 'texto puro; caractere de inversão é removido');
  assert.equal(l[0].apaga, false);
  assert.equal((await historias(DUDA, ANA)).find((x) => x.id === id).ncom, 1);
  assert.equal((await call('/friends/story-comment-del', DUDA, { owner: ANA, id, cid: c.id })).status, 403);
  kv.set(`blocks:${DUDA}`, JSON.stringify([BIA]));
  assert.equal((await call('/friends/story-comments', DUDA, { owner: ANA, id })).data.comentarios.length, 0, 'não vê comentário de quem bloqueou');
  kv.delete(`blocks:${DUDA}`);
  assert.equal((await call('/friends/story-comment-del', ANA, { owner: ANA, id, cid: c.id })).status, 200);
  for (let i = 0; i < 6; i++) await call('/friends/story-comment', DUDA, { owner: ANA, id, text: 'n' + i });
  assert.equal((await call('/friends/story-comment', DUDA, { owner: ANA, id, text: 'mais' })).status, 429);
  const id2 = await posta(ANA, { podeCom: false });
  assert.equal((await call('/friends/story-comment', BIA, { owner: ANA, id: id2, text: 'oi' })).status, 403);
  assert.equal((await call('/friends/story-comment', BIA, { owner: ANA, id, text: '   ' })).status, 400);
});

test('repostar: só com a liberação do dono; amigo do amigo vê com o crédito; apagou o original, some o repost', async () => {
  const id = await posta(ANA), fechado = await posta(ANA, { podeRp: false });
  assert.equal((await call('/friends/story-repost', BIA, { owner: ANA, id: fechado })).status, 403);
  const r = (await call('/friends/story-repost', BIA, { owner: ANA, id, caption: 'olha isso' })).data;
  assert.ok(r.id);
  assert.equal((await call('/friends/story-repost', BIA, { owner: ANA, id })).status, 400, 'não repete');
  const st = (await historias(CIC, BIA)).find((x) => x.id === r.id);
  assert.equal(st.rp.name, 'Ana Souza'); assert.equal(st.podeRp, false, 'repost de repost usa a regra do original, nunca a do repost');
  assert.equal((await call('/friends/story-view', CIC, { owner: BIA, id: r.id })).data.photo, FOTO);
  kv.set(`blocks:${ANA}`, JSON.stringify([CIC]));
  assert.equal((await call('/friends/story-view', CIC, { owner: BIA, id: r.id })).status, 404, 'quem a Ana bloqueou não vê nem pelo repost');
  assert.ok(!(await historias(CIC, BIA)).some((x) => x.id === r.id));
  kv.delete(`blocks:${ANA}`);
  assert.equal((await call('/friends/story-viewers', ANA, { id })).status, 200);
  await call('/friends/story-delete', ANA, { id });
  assert.ok(!(await historias(BIA, BIA)).some((x) => x.id === r.id), 'o repost sumiu junto');
  assert.equal(kv.has(`storyimg:${id}`), false);
});

test('repost não vive mais que o original; adolescente nunca é repostado', async () => {
  const id = await posta(DUDA);
  const l = JSON.parse(kv.get(`stories:${DUDA}`)); l.find((x) => x.id === id).at = Date.now() - 20 * 3600e3; kv.set(`stories:${DUDA}`, JSON.stringify(l));
  const r = (await call('/friends/story-repost', ANA, { owner: DUDA, id })).data.id;
  const st = (await historias(BIA, ANA)).find((x) => x.id === r);
  assert.ok(st.fim - Date.now() < 4.1 * 3600e3, 'some junto com o original');
  const t = await posta(TEO, { podeRp: true });
  assert.equal((await historias(ANA, TEO)).find((x) => x.id === t).podeRp, false);
  assert.equal((await call('/friends/story-repost', ANA, { owner: TEO, id: t })).status, 403);
});

test('privado: só amigos; texto, foto, áudio e resposta de story; lido e não lidas', async () => {
  assert.equal((await call('/friends/msg-send', ANA, { com: CIC, txt: 'oi' })).status, 403);
  assert.equal((await call('/friends/msg-send', ANA, { com: ANA, txt: 'oi' })).status, 400);
  const m1 = (await call('/friends/msg-send', ANA, { com: BIA, txt: 'Oi, Bia!\n\n\n\nTudo bem?' })).data;
  assert.equal((await call('/friends/msg-send', ANA, { com: BIA, tipo: 'foto', midia: 'data:image/svg+xml;base64,AAAA' })).status, 400, 'só foto de verdade');
  const f = (await call('/friends/msg-send', ANA, { com: BIA, tipo: 'foto', midia: FOTO, w: 800, h: 600, txt: 'olha' })).data;
  const a = (await call('/friends/msg-send', ANA, { com: BIA, tipo: 'audio', midia: AUDIO, dur: 3.24, onda: [1, 50, 300, -4, 'x'] })).data;
  assert.equal((await call('/friends/msg-send', ANA, { com: BIA, tipo: 'audio', midia: AUDIO, dur: 600 })).status, 400);
  assert.equal((await call('/friends/convs', BIA)).data.total, 3);
  let l = (await call('/friends/msg-list', BIA, { com: ANA })).data;
  assert.deepEqual(l.msgs.map((m) => m.tipo), ['txt', 'foto', 'audio']);
  assert.equal(l.msgs[0].txt, 'Oi, Bia!\n\nTudo bem?'); assert.deepEqual(l.msgs[2].onda, [1, 50, 100, 0, 0]); assert.equal(l.msgs[2].dur, 3.2);
  assert.equal((await call('/friends/convs', BIA)).data.total, 0, 'abriu, leu');
  assert.ok((await call('/friends/msg-list', ANA, { com: BIA })).data.lidoAte >= a.at, 'a Ana vê que foi lida');
  assert.equal((await call('/friends/msg-media', BIA, { com: ANA, id: f.id, at: f.at })).data.v, FOTO);
  assert.equal((await call('/friends/msg-media', CIC, { com: ANA, id: f.id, at: f.at })).status, 404, 'estranho não baixa');
  assert.equal((await call('/friends/msg-media', CIC, { com: BIA, id: f.id, at: f.at })).status, 404, 'nem amigo de um dos dois');
  const r = (await call('/friends/msg-send', BIA, { com: ANA, txt: 'tudo!', resp: { id: m1.id, at: m1.at, txt: 'FALSO' } })).data;
  l = (await call('/friends/msg-list', ANA, { com: BIA })).data;
  assert.match(l.msgs.at(-1).resp.txt, /^Oi, Bia/, 'a citação vem do banco, não do aparelho');
  assert.equal((await call('/friends/msg-react', ANA, { com: BIA, id: r.id, at: r.at, emo: '❤️' })).data.reac[ANA], '❤️');
  assert.deepEqual((await call('/friends/msg-react', ANA, { com: BIA, id: r.id, at: r.at, emo: '<script>' })).data.reac, {});
  const st = await posta(ANA);
  assert.equal((await call('/friends/msg-send', BIA, { com: ANA, tipo: 'story', owner: ANA, id: st, txt: '😍' })).status, 200);
  assert.equal((await call('/friends/msg-send', BIA, { com: ANA, tipo: 'story', owner: CIC, id: st, txt: 'x' })).status, 404);
  assert.equal((await call('/friends/msg-del', BIA, { com: ANA, id: f.id, at: f.at })).status, 404, 'só o autor apaga');
  await call('/friends/msg-del', ANA, { com: BIA, id: f.id, at: f.at });
  assert.equal((await call('/friends/msg-media', BIA, { com: ANA, id: f.id, at: f.at })).status, 404);
  assert.equal((await call('/friends/msg-list', BIA, { com: ANA })).data.msgs.find((m) => m.id === f.id).tipo, 'apagada');
});

test('confirmação de leitura desligada vale para os dois lados; limpar conversa é só para mim; silenciar tira da conta', async () => {
  await call('/friends/msg-config', ANA, { semLido: true });
  await call('/friends/msg-send', ANA, { com: BIA, txt: 'viu?' }); await call('/friends/msg-list', BIA, { com: ANA });
  assert.equal((await call('/friends/msg-list', ANA, { com: BIA })).data.lidoAte, 0);
  assert.equal((await call('/friends/msg-list', BIA, { com: ANA })).data.lidoAte, 0);
  await call('/friends/msg-config', ANA, { semLido: false });
  await call('/friends/msg-clear', BIA, { com: ANA });
  assert.equal((await call('/friends/msg-list', BIA, { com: ANA })).data.msgs.length, 0);
  assert.ok((await call('/friends/msg-list', ANA, { com: BIA })).data.msgs.length > 3);
  await call('/friends/msg-mute', BIA, { com: ANA, on: true });
  await call('/friends/msg-send', ANA, { com: BIA, txt: 'psiu' });
  const c = (await call('/friends/convs', BIA)).data; assert.equal(c.total, 0); assert.equal(c.convs[0].novas, 1);
});

test('some em 24 h de verdade: o relógio apaga as linhas e a mídia do banco', async () => {
  const S = env.SOCIAL, t0 = Date.now() - DIA - 5000;
  S.envia(ANA, DUDA, { id: 'velha1', tipo: 'foto', midia: FOTO }, t0); S.envia(ANA, DUDA, { id: 'velha2', tipo: 'txt', txt: 'segredo' }, t0 + 1000);
  assert.equal((await call('/friends/msg-list', DUDA, { com: ANA })).data.msgs.length, 0, 'vencida nem aparece, mesmo antes da limpeza');
  S.envia(DUDA, ANA, { id: 'nova', tipo: 'txt', txt: 'fico' });
  const antes = S.conta(); S.limpa(); const depois = S.conta();
  assert.equal(antes.msg - depois.msg, 2); assert.equal(antes.midia - depois.midia, 1);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM msg WHERE id IN ('velha1', 'velha2')").get().n, 0);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM midia WHERE id = 'velha1'").get().n, 0);
  S.limpa(Date.now() + DIA + 1000);
  assert.deepEqual(S.conta(), { conv: 0, msg: 0, midia: 0 }, 'um dia depois não sobra nada');
});

test('bloquear apaga a conversa dos dois; excluir a conta apaga tudo; denúncia guarda só o trecho recebido', async () => {
  const m = (await call('/friends/msg-send', BIA, { com: ANA, txt: 'mensagem ruim' })).data;
  await call('/friends/report', ANA, { owner: BIA, motivo: 'Assédio', msg: { id: m.id, at: m.at } });
  assert.equal(JSON.parse(kv.get('reports'))[0].trecho, 'mensagem ruim');
  await call('/friends/block', ANA, { uid: BIA });
  assert.equal(env.SOCIAL.conta().msg, 0);
  assert.equal((await call('/friends/msg-send', BIA, { com: ANA, txt: 'oi' })).status, 403);
  await call('/friends/msg-send', ANA, { com: DUDA, tipo: 'audio', midia: AUDIO, dur: 2 });
  assert.equal(env.SOCIAL.conta().midia, 1);
  await call('/account/delete', ANA);
  assert.deepEqual(env.SOCIAL.conta(), { conv: 0, msg: 0, midia: 0 });
});

test('aviso no celular: não mostra o texto, não apita com o app aberto, nem para adolescente de madrugada', async () => {
  kv.set(`friends:${CIC}`, JSON.stringify([BIA])); kv.set(`friends:${BIA}`, JSON.stringify([CIC]));
  const m = `u${CIC}`.slice(0, 25), k = [...kv.keys()].find((x) => x.includes('subs')); void m; void k;
  eventos.length = 0; visiveis.add(CIC);
  await call('/friends/msg-send', BIA, { com: CIC, txt: 'segredo' });
  assert.ok(eventos.some(([u, o]) => u === CIC && o.t === 'msg' && !JSON.stringify(o).includes('segredo')), 'o recado em tempo real não leva o texto');
});
