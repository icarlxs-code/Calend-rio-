/* Push com id e receita da arte. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { receitaArte, FUNDO, fonteDe } from '../../js/receita.js';
import { amigoOne, msgIdDe, dadosDaArte, nextNudge } from '../src/pcoach.js';
import { brNow } from '../src/coach.js';

const at = (h) => Date.parse(`2026-11-20T${h}:00-03:00`);
const kv = (o = {}) => { const m = new Map(Object.entries(o).map(([k, v]) => [k, JSON.stringify(v)])); return { m, async get(k, t) { const v = m.get(k); return v == null ? null : t === 'json' ? JSON.parse(v) : v; }, async put(k, v) { m.set(k, v); }, async delete(k) { m.delete(k); } }; };

test('mesma mensagem, mesma receita; mensagem nova varia', () => {
  for (const cat of Object.keys(FUNDO)) for (const t of ['manha', 'tarde', 'noite']) assert.deepEqual(receitaArte('abc', cat, t, 'oi'), receitaArte('abc', cat, t, 'oi'));
  const L = Array.from({ length: 60 }, (_, i) => receitaArte('m' + i, 'agua', 'tarde', 'oi')), un = (f) => new Set(L.map(f)).size;
  assert.ok(un((r) => JSON.stringify(r.blob)) > 50); assert.equal(un((r) => r.layout), 3); assert.equal(un((r) => r.fundo), 2); assert.ok(un((r) => r.brilhos.seed) === 60);
  for (const r of L) { assert.ok(r.brilhos.qtd >= 6 && r.brilhos.qtd <= 14); assert.ok(Math.abs(r.blob.girar) <= 15 && r.blob.escala >= 0.9 && r.blob.escala <= 1.15); }
});
test('fundos pedidos por assunto e turno, e todos existem', () => {
  const f = (c, t) => new Set(Array.from({ length: 40 }, (_, i) => receitaArte('x' + i, c, t, '').fundo.slice(0, 2)));
  for (const [c, d, n] of [['agua', '17,31', '18'], ['socializar', '19', '20'], ['contas', '21', '27'], ['remedio', '08', '22'], ['estudo', '09', '23'], ['trabalho', '10', '24'], ['refeicao', '25', '26'], ['calma', '28', '28'], ['manha', '01,29', '01,29'], ['ofensiva', '30', '30'], ['noite', '03', '03'], ['versiculo', '04', '13'], ['motivacao', '05', '14'], ['aniversario', '06', '16']]) { assert.deepEqual([...f(c, 'tarde')].sort().join(), d); assert.deepEqual([...f(c, 'noite')].sort().join(), n); }
  for (const L of Object.values(FUNDO)) for (const x of L.flat()) assert.ok(fs.existsSync(new URL(`../../assets/stories/${x}.webp`, import.meta.url)), x);
});
test('fonte por comprimento; noite preta com #FFF6EE e #FF8A3D, nada marrom', () => {
  assert.deepEqual([40, 41, 70, 71, 110, 111, 160, 161].map(fonteDe), [96, 84, 84, 72, 72, 60, 60, 50]);
  const r = receitaArte('a', 'agua', 'noite', 'x'); assert.deepEqual([r.paleta.base, r.paleta.texto, r.paleta.eyebrow], ['#0A0A0A', '#FFF6EE', '#FF8A3D']);
});
test('id estável por pessoa, frase e hora', () => { assert.equal(msgIdDe('u', 'agua-001', '2026-11-20T10'), msgIdDe('u', 'agua-001', '2026-11-20T10')); assert.notEqual(msgIdDe('u', 'agua-001', '2026-11-20T10'), msgIdDe('u', 'agua-001', '2026-11-20T11')); assert.notEqual(msgIdDe('u', 'agua-001', 'x'), msgIdDe('v', 'agua-001', 'x')); assert.match(msgIdDe('u', 'a', 'b'), /^[a-z0-9]{6,20}$/); });
test('o aviso leva id, categoria, frase e o endereço #/frase/<id>; recado da agenda e ranking não', async () => {
  const p = { name: 'Lia', date: '2026-11-20', prefs: { religion: 'catolica' }, today: [], tomorrow: [], likes: [] }; let vistos = new Set();
  for (let i = 0; i < 80; i++) { const R = Math.random; let k = i * 7919 + 1; Math.random = () => (k = (k * 16807) % 2147483647) / 2147483647; const out = []; try { await amigoOne({ CAL: kv({ 'pprofile:u1': { ...p, prefs: { ...p.prefs, water: i % 3 === 0 } }, 'pc:u1': { day: '2026-11-20', done: i % 4 ? { morning: true, lunch: true } : {} } }) }, async (e, id, m) => { out.push(m); }, { id: 'u1', name: 'Lia' }, at(i % 4 === 0 ? '07:40' : i % 4 === 2 ? '21:50' : '15:10')); } finally { Math.random = R; }
    for (const m of out) { if (!m.data) { assert.doesNotMatch(m.url, /frase/); continue; } vistos.add(m.data.cat); assert.equal(m.url, `./#/frase/${m.data.id}`); assert.ok(FUNDO[m.data.cat], m.data.cat); assert.ok(m.data.fid && m.data.arte && m.data.t); assert.ok(m.data.arte.length <= 320); assert.ok(JSON.stringify(m).length < 3000); assert.ok(!('kind' in m) && !('verse' in m)); if (m.data.cat === 'versiculo') assert.ok(m.data.ref && m.body.includes(m.data.arte)); } }
  assert.ok(vistos.size >= 5, [...vistos].join());
  const br = brNow(at('10:00')); assert.equal(dadosDaArte({ kind: 'agenda', body: 'Dentista às 9h' }, 'u', br, 'manha'), null); assert.equal(dadosDaArte({ kind: 'rank', body: 'x' }, 'u', br, 'manha'), null);
});
test('outras tradições de fé não recebem arte cristã', () => { let n = 0; for (let i = 0; i < 80; i++) { const r = nextNudge({ name: 'Lia', uid: 'j' + i, prefs: { water: false, religion: 'budista' } }, { day: '2026-11-20', done: { morning: true, lunch: true }, next: 0 }, at('15:10'), () => ((i * 37) % 80) / 80); if (r?.msg.kind === 'verse') { n++; assert.equal(r.msg.cat, 'palavra'); assert.ok(r.msg.arte && r.msg.ref); } } assert.ok(n); });
