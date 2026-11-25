import './_base.js';
import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
/* Firestore de mentira: guarda documentos e respeita mergeFields */
const D = new Map(), log = []; let t = 1000, subs = [];
const TS = (n) => ({ toMillis: () => n }), DEL = Symbol('del'), ST = Symbol('st');
const aplica = (p, d, o) => { log.push({ op: 'set', p, d, o }); const cur = o && (o.merge || o.mergeFields) ? { ...(D.get(p) || {}) } : {}; for (const k of o && o.mergeFields ? o.mergeFields : Object.keys(d)) { if (d[k] === DEL) delete cur[k]; else cur[k] = d[k] === ST ? TS(++t) : JSON.parse(JSON.stringify(d[k])); } D.set(p, cur); avisa(); };
const avisa = () => subs.forEach((s) => s());
const fsm = { initializeFirestore: () => ({}), memoryLocalCache: () => ({}), collection: (_, ...p) => p.join('/'), doc: (_, ...p) => p.join('/'), query: (c) => c, where: () => 0, Timestamp: { fromMillis: TS }, serverTimestamp: () => ST, deleteField: () => DEL, increment: (n) => n, setDoc: async (p, d, o) => aplica(p, d, o), deleteDoc: async (p) => { log.push({ op: 'delete', p }); D.delete(p); }, getDocs: async (c) => ({ docs: [...D].filter(([p]) => p.startsWith(c + '/')).map(([p, d]) => ({ id: p.split('/').pop(), data: () => d })) }), getDoc: async () => ({ exists: () => false }),
  writeBatch: () => { const f = []; return { set: (p, d, o) => f.push(() => aplica(p, d, o)), delete: (p) => f.push(() => { log.push({ op: 'delete', p }); D.delete(p); }), commit: async () => f.forEach((x) => x()) }; },
  onSnapshot: (c, cb) => { let vis = new Map(); const go = () => { const now = new Map([...D].filter(([p]) => p.startsWith(c + '/')).map(([p, d]) => [p.split('/').pop(), d])), ch = []; for (const [id, d] of now) if (vis.get(id) !== d) ch.push({ type: 'modified', doc: { id, data: () => ({ ...d }), metadata: {} } }); for (const id of vis.keys()) if (!now.has(id)) ch.push({ type: 'removed', doc: { id } }); vis = now; cb({ metadata: {}, docChanges: () => ch }); }; subs.push(go); setTimeout(go, 0); return () => (subs = subs.filter((x) => x !== go)); } };
mock.module('firebase/app', { namedExports: { initializeApp: () => ({}), getApps: () => [] } }); mock.module('firebase/firestore', { namedExports: fsm }); mock.module('firebase/auth', { namedExports: { initializeAuth: () => ({ currentUser: { uid: 'U' } }), getAuth: () => ({ currentUser: { uid: 'U' } }), indexedDBLocalPersistence: 0, browserLocalPersistence: 0, inMemoryPersistence: 0, onAuthStateChanged() {} } }); mock.module('firebase/functions', { namedExports: { getFunctions: () => ({}) } });
const { connect } = await import('../js/cloud.js'), { marca, desmarca, conteudo } = await import('../js/lixeira-core.js'); const { backend: b } = await connect({}); b.setWorkspace('U'); const visto = {}; await b.subscribe(['events'], (c, L) => (visto[c] = L)); const solta = []; b.subscribePersonal((L) => (visto.p = L));
const espera = () => new Promise((r) => setTimeout(r, 10));
const E = { id: 'e1', title: 'Reunião', date: '2027-01-01', description: 'texto', assignees: ['a', 'b'], seriesId: 's', status: 'pendente' };
test('apagar grava a marca com merge e mantém todos os campos; nunca "_del"', async () => {
  await b.write('events', E); await b.writePersonal({ id: 'p1', title: 'Cabelo', doneDates: ['2025-01-01'] }); const m = marca({ por: 'U' }); await b.mark('events', ['e1'], m); await b.markPersonal(['p1'], m); await espera();
  const d = D.get('ws/U/events/e1'); for (const k of Object.keys(E)) assert.deepEqual(d[k], E[k], k); assert.equal(d.deletedAt, m.deletedAt); assert.deepEqual(D.get('pessoal/U/itens/p1').doneDates, ['2025-01-01']);
  assert.ok(!log.some((l) => l.op === 'delete' || (l.d && l.d._del === true))); assert.ok(visto.events.find((x) => x.id === 'e1').deletedAt, 'o item segue no aparelho, na lixeira');
  await b.mark('events', ['e1'], desmarca()); await espera(); assert.deepEqual(conteudo(JSON.parse(JSON.stringify({ ...D.get('ws/U/events/e1'), _u: undefined }))), E);
});
test('edição num aparelho desatualizado: só o campo mudado sobe, não ressuscita nem perde campo novo', async () => {
  await b.write('events', { ...E, id: 'e2' }); await espera(); // outro aparelho escreve um campo e apaga, sem este saber
  D.set('ws/U/events/e2', { ...D.get('ws/U/events/e2'), novo: 'x', title: 'Outro título', ...marca({ por: 'V' }) }); log.length = 0;
  await b.write('events', { ...E, id: 'e2', status: 'feito' }); const d = D.get('ws/U/events/e2'); assert.deepEqual(log[0].o.mergeFields.sort(), ['_u', 'status']); assert.equal(d.novo, 'x'); assert.equal(d.title, 'Outro título'); assert.equal(d.status, 'feito'); assert.ok(d.deletedAt, 'continua na lixeira'); await espera();
  await b.write('events', { ...visto.events.find((x) => x.id === 'e2'), deletedAt: null, purgeAt: null, title: 'T' }); assert.ok(D.get('ws/U/events/e2').deletedAt, 'uma edição nunca restaura sozinha');
});
test('dois aparelhos editam campos diferentes: nenhum se perde', async () => { await b.write('events', { ...E, id: 'e3' }); await espera(); D.set('ws/U/events/e3', { ...D.get('ws/U/events/e3'), location: 'Sala 2' }); await b.writeMany([{ col: 'events', item: { ...E, id: 'e3', time: '10:00' } }]); const d = D.get('ws/U/events/e3'); assert.equal(d.location, 'Sala 2'); assert.equal(d.time, '10:00'); });
test('marca antiga "_del": é lida como já apagada e nada é criado a partir dela', async () => { D.set('ws/U/events/velho', { _del: true, _u: TS(++t) }); avisa(); await espera(); assert.ok(!visto.events.some((x) => x.id === 'velho')); });
test('purga do aparelho: só o que venceu pela hora do servidor', async () => {
  const H = 36e5; D.set('ws/U/events/v', { title: 'v', ...marca({ por: 'U', agora: 1000 - 30 * H }), _u: TS(500) }); D.set('ws/U/events/n', { title: 'n', ...marca({ por: 'U', agora: Date.now() }), _u: TS(501) }); D.set('ws/U/events/c', { title: 'c', deletedAt: 1, purgeAt: 2, _u: TS(502) }); avisa(); await espera(); log.length = 0; await b.purga(['events']); const del = log.filter((l) => l.op === 'delete').map((l) => l.p); assert.deepEqual(del, ['ws/U/events/v']);
});
