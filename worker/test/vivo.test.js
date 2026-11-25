import { test } from 'node:test';
import assert from 'node:assert/strict';
import { proxima, escolhe, candidatas, daGramatica, daAgenda, tagsDoPerfil, turnoDe, preenche, BANCO } from '../src/vivo.js';
import { nextNudge, agendaMessages, humanize } from '../src/pcoach.js';
import { brNow } from '../src/coach.js';
import { cleanProfile } from '../src/index.js';

const P = { uid: 'u1', name: 'Lia', likes: ['games', 'pets'], prefs: { tone: 'firme' }, work: { profession: 'designer', goal: 'render mais no dia' } };
const S = { nome: 'Lia', profissao: 'designer', meta: 'render mais no dia', diasemana: 'quarta' };
const ag = (i = 0, turno = 'tarde', wd = 3) => ({ turno, wd, chave: `2026-11-25T${i}` });
const at = (hhmm, day = '2026-11-20') => Date.parse(`${day}T${hhmm}:00-03:00`);

test('30 águas seguidas: nenhum texto e nenhuma frase-base se repetem; 1 em 4 vem da gramática', () => {
  let vh = {}; const t = new Set(), ids = new Set(); let g = 0; const ult = [];
  for (let i = 0; i < 30; i++) {
    const m = proxima({ cat: 'agua', perfil: P, slots: S, agora: ag(i), vh }); vh = m.vh;
    assert.ok(!t.has(m.texto), m.texto); assert.ok(!ids.has(m.id), m.id); t.add(m.texto); ids.add(m.id);
    if (m.partes) { g++; for (const x of m.partes) assert.ok(!ult.slice(-15).includes(x), 'parte repetida'); ult.push(...m.partes); }
  }
  assert.equal(g, 7);
});
test('trocar a ficha muda a distribuição (e as tags são as da pessoa)', () => {
  const conta = (perfil) => { const c = {}; for (let i = 0; i < 600; i++) { const m = escolhe({ cat: 'manha', perfil: { ...perfil, uid: 'p' + i }, slots: S, agora: ag(i, 'manha') }); m.tags.forEach((x) => (c[x] = (c[x] || 0) + 1)); c['tom:' + m.tom] = (c['tom:' + m.tom] || 0) + 1; } return c; };
  const a = conta({ likes: ['games'], prefs: { tone: 'firme' } }), b = conta({ likes: ['pets'], prefs: { tone: 'carinhoso' } });
  assert.ok(a.games > (b.games || 0) * 4, JSON.stringify(a)); assert.ok(b.pets > (a.pets || 0) * 4); assert.ok(a['tom:firme'] > b['tom:firme'] && b['tom:carinhoso'] > a['tom:carinhoso']);
  assert.deepEqual([...tagsDoPerfil({ likes: ['games'], mind: { traits: ['organizado'], focus: ['foco'], anxiety: 'muita' }, work: { profession: 'x' } })].sort(), ['ansiedade', 'foco', 'games', 'organizado', 'trabalho']);
});
test('pesos: +3 por tag, +1,5 pelo tom, +0,8 trocadilho e x0,35 no que não é da pessoa', () => {
  const L = [{ id: 'a', texto: 'a', hora: 'qualquer', tom: 'leve', tags: ['games'] }, { id: 'b', texto: 'b', hora: 'qualquer', tom: 'firme', tags: [] }, { id: 'c', texto: 'c', hora: 'qualquer', tom: 'trocadilho', tags: ['futebol'] }];
  const w = Object.fromEntries(candidatas({ cat: 'agua', perfil: P, slots: {}, agora: ag(), lista: L }).map((x) => [x.f.id, +x.w.toFixed(3)]));
  assert.deepEqual(w, { a: 4, b: 2.5, c: 0.63 });
});
test('1000 escolhas em todas as categorias sem nenhum { no resultado', () => {
  const cats = Object.keys(BANCO.categorias), sl = [S, { nome: '' }, {}, { ...S, pessoa: 'Caio', quando: 'amanhã', remedio: 'Losartana', hora: '8h', materia: 'inglês', conta: 'a conta de luz', proximo: 'Reunião' }];
  for (let i = 0; i < 1000; i++) { const m = proxima({ cat: cats[i % cats.length], perfil: { ...P, uid: 'x' + i }, slots: sl[i % 4], agora: ag(i, ['manha', 'tarde', 'noite'][i % 3], i % 7), vh: { _n: { agua: 3, manha: 3 } } }); if (!m) continue; assert.doesNotMatch(m.texto + m.titulo, /[{}]/); assert.ok(!/[?!]\./.test(m.texto), m.texto); }
  assert.equal(preenche('oi {nome}', {}), null); assert.equal(preenche('oi {nome}', { nome: '{x}' }), 'oi x');
});
test('versículo: texto idêntico ao banco, com referência, só para fé cristã ou católica', () => {
  const ok = new Map(BANCO.categorias.versiculo.map((v) => [v.ref + v.texto, 1]));
  const ver = (prefs) => { const L = []; for (let i = 0; i < 60; i++) { const r = nextNudge({ name: 'Lia', uid: 'f' + i, prefs: { water: false, ...prefs } }, { day: '2026-11-20', done: { morning: true, lunch: true }, next: 0 }, at('15:10'), () => ((i * 37) % 60) / 60); if (r?.msg.kind === 'verse') L.push(r.msg); } return L; };
  const c = ver({ religion: 'catolica' }); assert.ok(c.length > 3);
  for (const m of c) { const x = /“([\s\S]+)” — (.+)$/.exec(m.body); assert.ok(x && ok.has(x[2] + x[1]), m.body); assert.equal(m.ref, x[2]); }
  assert.equal(ver({}).length, 0, 'sem religião na ficha'); assert.equal(ver({ religion: 'catolica', faith: false }).length, 0);
  for (const m of ver({ religion: 'judaica' })) assert.ok(!m.fid, 'outras tradições seguem no mind.js');
});
test('remédio só na hora e nunca para consulta; conta, estudo, aniversário e trabalho usam a agenda', () => {
  const br = brNow(at('08:10')), p = { name: 'Lia', work: { profession: 'designer' }, today: [{ title: 'Tomar Losartana', cat: 'saude', time: '08:00' }, { title: 'Dentista', cat: 'saude', time: '08:05' }, { title: 'Neuropsiquiatra', cat: 'saude', time: '08:00' }, { title: 'Pagar conta de luz', cat: 'pagar' }, { title: 'Estudar inglês', cat: 'lembrete', time: '08:30' }], birthdays: [{ name: 'Caio', inDays: 0 }, { name: 'Bia', inDays: 3 }] };
  const L = daAgenda(p, br), c = (k) => L.filter((x) => x.cat === k);
  assert.deepEqual(c('remedio').map((x) => [x.slots.remedio, x.slots.hora]), [['Losartana', '8h']]); assert.equal(c('contas')[0].slots.conta, 'a conta de luz'); assert.equal(c('estudo')[0].slots.materia, 'inglês'); assert.deepEqual(c('aniversario').map((x) => x.slots.quando), ['hoje', 'em 3 dias']); assert.equal(c('trabalho').length, 1);
  assert.equal(daAgenda(p, brNow(at('07:40'))).filter((x) => x.cat === 'remedio').length, 0, 'antes da hora não diz "hora do remédio"');
  for (const m of agendaMessages(p, br, {})) { assert.doesNotMatch(m.title + m.body, /[{}]/); if (m.cat === 'aniversario' && /Bia/.test(m.body)) assert.doesNotMatch(m.title + m.body, /\bhoje\b/i); }
  for (let i = 0; i < 200; i++) for (const q of ['hoje', 'amanhã', 'em 3 dias']) { const m = proxima({ cat: 'aniversario', perfil: { uid: 'a' + i }, slots: { ...S, pessoa: 'Bia', quando: q }, agora: ag(i) }); if (q === 'hoje') assert.doesNotMatch(m.titulo, /chegando/); else assert.doesNotMatch(m.titulo + m.texto, /\bhoje (é|tem)\b/i, m.titulo + m.texto); }
});
test('turno segue a janela da pessoa', () => { assert.equal(turnoDe(60, 900), 'manha'); assert.equal(turnoDe(500, 900), 'tarde'); assert.equal(turnoDe(850, 900), 'noite'); const n = nextNudge({ name: 'Lia', uid: 'n', prefs: { wake: '14:00', sleep: '05:00' } }, {}, at('14:35'), () => 0.4); assert.equal(n.msg.kind, 'morning'); });
test('gramática não junta "?." e começa com maiúscula', () => { for (let i = 0; i < 400; i++) { const m = daGramatica('agua', S, i); assert.doesNotMatch(m.texto, /[?!]\.|\. \p{Ll}/u, m.texto); } });
test('perfil: likes e goals chegam limpos', () => { const x = cleanProfile({ likes: ['games', 'xss<', 'pets', 4], goals: ['produtivo', '../'], prefs: { nickname: 'Li' } }, { name: 'Lia' }); assert.deepEqual([x.likes, x.goals, x.prefs.nickname], [['games', 'pets'], ['produtivo'], 'Li']); });
test('humanize com profissão e objetivo não quebra; água e frases do banco não gastam IA', async () => {
  let n = 0; const env = { AI: { run: async () => (n++, { response: '{"title":"t","body":"b"}' }) } }, p = { name: 'Lia', ia: true, prefs: {}, work: { profession: 'designer', goal: 'crescer' } }, br = brNow(at('10:00'));
  assert.equal((await humanize(env, { kind: 'agenda', fact: 'x' }, p, [], br)).body, 'b'); assert.equal(await humanize(env, { kind: 'water' }, p, [], br), null); assert.equal(await humanize(env, { kind: 'agenda', fid: 'a', fact: 'x' }, p, [], br), null); assert.equal(n, 1);
});
test('500 escolhas completas cabem com folga no tempo do relógio', () => { const t = performance.now(); let st = {}; for (let i = 0; i < 500; i++) { const r = nextNudge({ ...P, today: [], prefs: { religion: 'catolica' } }, { day: '2026-11-20', done: { morning: true }, vh: st.vh }, at('15:10'), () => (i % 97) / 97); if (r) st = r.state; } assert.ok((performance.now() - t) / 500 < 2); });
