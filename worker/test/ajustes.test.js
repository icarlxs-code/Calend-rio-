import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { humanize, nextNudge, agendaMessages, amigoOne, VERSES } from '../src/pcoach.js';
import { FAITH, RELIGIONS } from '../src/mind.js';
import { proxima, BANCO, NEUTRAS } from '../src/vivo.js';
import { bloqueado } from '../src/filtro.js';
import { runTick, usageMeter } from '../src/tick.js';
import { brNow } from '../src/coach.js';
import { ehRemedio, avisoRemedio, barra, semNome } from '../../functions/remedio.js';

const at = (h, d = '2026-11-20') => Date.parse(`${d}T${h}:00-03:00`);
const kv = (o = {}) => { const m = new Map(Object.entries(o).map(([k, v]) => [k, typeof v === 'string' ? v : JSON.stringify(v)])); return { m, async get(k, t) { const v = m.get(k); return v == null ? null : t === 'json' ? JSON.parse(v) : v; }, async put(k, v) { m.set(k, v); }, async delete(k) { m.delete(k); } }; };
const prof = { name: 'Lia', date: '2026-11-20', ia: true, prefs: { water: false }, work: { profession: 'designer', goal: 'crescer na carreira' }, today: [], tomorrow: [], overdue: [{ title: 'Levar o carro', cat: 'lembrete' }] };

test('humanize com profissão e objetivo; falha vira log e contador, sem dado pessoal', async () => {
  let sys = ''; const env = { AI: { run: async (m, o) => { sys = o.messages[0].content; return { response: '{"title":"Oi","body":"tudo certo"}' }; } } };
  assert.equal((await humanize(env, { kind: 'agenda', fact: 'x' }, prof, [], brNow(at('10:00')))).body, 'tudo certo'); assert.match(sys, /o objetivo dele\(a\) é: crescer na carreira/);
});
async function envia({ ai, mock = 0, quebra = false } = {}) {
  const R = Math.random, out = [], log = console.log, logs = []; Math.random = () => mock; console.log = (...a) => logs.push(a.join(' '));
  const C = kv({ 'pprofile:u1': prof, 'pc:u1': { day: '2026-11-20', done: { morning: true, lunch: true }, recent: Array.from({ length: 40 }, (_, i) => 'antiga ' + i), asked: { trab: '2026-11-20', hair: '2026-11-20' }, win: null } });
  const env = { CAL: C, USAGE: undefined, get AI() { if (quebra) throw new Error('quebrou'); return ai; } }, u = usageMeter(env);
  try { await amigoOne(env, async (e, id, m) => { out.push(m); return 1; }, { id: 'u1', name: 'Lia' }, at('10:10'), null, u); } finally { Math.random = R; console.log = log; }
  return { out, st: JSON.parse(C.m.get('pc:u1')), usage: env.USAGE, logs };
}
test('depois da reescrita, recent guarda o texto-base e o da IA, com até 40', async () => {
  const r = await envia({ ai: { run: async () => ({ response: '{"title":"Oi","body":"texto novo da IA"}' }) } });
  assert.equal(r.out[0].body, 'texto novo da IA'); assert.equal(r.st.recent.length, 40); assert.equal(r.st.recent.at(-1), 'texto novo da IA'); assert.match(r.st.recent.at(-2), /carro/i);
});
test('erro da IA: conta em amigo.aiErr, registra sem dado pessoal e manda o texto do banco', async () => {
  const r = await envia({ quebra: true });
  assert.ok(/carro/i.test(r.out[0].body)); assert.equal(r.usage.amigo.aiErr, 1); const L = r.logs.join('|'); assert.match(L, /humanize falhou quebrou/); assert.doesNotMatch(L, /Lia|carro|designer/);
});
test('30 motivações seguidas sem repetir a frase-base', () => { let vh = {}; const s = new Set(); for (let i = 0; i < 30; i++) { const m = proxima({ cat: 'motivacao', perfil: { uid: 'z', name: 'Lia', prefs: {} }, slots: { nome: 'Lia' }, agora: { turno: 'tarde', wd: 2, chave: 'k' + i }, vh }); vh = m.vh; assert.ok(!s.has(m.id), m.id); s.add(m.id); } });

test('nenhum aviso de remédio leva o nome em título ou corpo (agenda, resumos, frases, avisos antigos)', async () => {
  const REM = [['Tomar Losartana', 'saude'], ['Rivotril 2mg', 'lembrete'], ['Remédio da pressão', 'compromisso'], ['Puran T4', 'saude']];
  for (const [t, cat] of REM) assert.ok(ehRemedio({ title: t, cat }), t);
  for (const t of ['Dentista', 'Neuropsiquiatra', 'Academia', 'Exame de sangue', 'Beber água']) assert.ok(!ehRemedio({ title: t, cat: 'saude' }), t);
  const p = { ...prof, today: [...REM.map(([title, cat]) => ({ title, cat, time: '10:00' })), { title: 'Xarelto', cat: 'saude' }], tomorrow: [{ title: 'Puran T4', cat: 'saude', time: '07:00' }], overdue: [{ title: 'Losartana', cat: 'saude' }] };
  const nome = /losartana|rivotril|puran|xarelto|press[aã]o/i; let frases = 0;
  for (let h = 7; h < 23; h++) for (const m of [0, 10, 20]) for (const x of agendaMessages(p, brNow(at(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)), {})) if (!x.priv) assert.doesNotMatch(x.title + x.body, nome); else { frases++; assert.doesNotMatch(x.title, nome); }
  assert.ok(frases > 0);
  for (let i = 0; i < 400; i++) { const r = nextNudge({ ...p, uid: 'r' + i }, { day: '2026-11-20', done: { morning: i % 2 === 0, night: false } }, at(i % 3 ? '10:10' : '21:50'), () => (i % 89) / 89); if (r && !r.msg.priv) assert.doesNotMatch(r.msg.title + r.msg.body, nome); }
  // o que sai de verdade para o celular
  let vistos = 0; const R = Math.random; for (let i = 0; i < 60; i++) { Math.random = () => (i * 7 % 60) / 60; const out = []; await amigoOne({ CAL: kv({ 'pprofile:u1': { ...p, overdue: [] }, 'pc:u1': { day: '2026-11-20', done: { morning: true } } }) }, async (e, id, m) => { out.push(m); }, { id: 'u1', name: 'Lia' }, at('10:10')).catch((e) => { Math.random = R; throw e; }); for (const m of out) { assert.doesNotMatch(m.title + m.body + m.tag + m.url, nome); if (m.data?.remedio) { vistos++; assert.equal(m.title, '💊 Hora do seu remédio'); assert.equal(m.body, 'Toque para ver qual'); assert.match(m.data.remedio, nome); } } } Math.random = R;
  assert.ok(vistos > 0, 'o nome vai nos dados');
  for (const e of ['m60', 'm30', 'm20', 'm0', 'after']) assert.equal(avisoRemedio(e).body, 'Toque para ver qual');
  assert.equal(barra({ title: '💊 Losartana', body: 'x' }, ['Losartana']).title, '💊 Hora do seu remédio'); assert.equal(semNome({ title: 'Rivotril 2mg', location: 'casa' }).title, 'Seu remédio');
});
test('saída garantida: sem nenhum dado, com tudo no histórico ou sem banco, sempre há frase segura', () => {
  for (const cat of Object.keys(BANCO.categorias)) {
    const g = BANCO.categorias[cat]; let vh = { [cat]: g.map((x) => x.id) };
    for (const s of [{}, { nome: 'Lia' }]) { const m = proxima({ cat, perfil: {}, slots: s, agora: { turno: 'noite', wd: 1, chave: 'k' }, vh }); assert.ok(m && m.texto && m.titulo, cat); assert.doesNotMatch(m.texto + m.titulo, /[{}]/); }
    if (cat === 'versiculo') continue;
    BANCO.categorias[cat] = []; const gr = BANCO.gramaticas[cat]; delete BANCO.gramaticas[cat];
    try { const m = proxima({ cat, perfil: {}, slots: {}, agora: { turno: 'noite', wd: 1, chave: 'k' }, vh: {} }); assert.equal(m.texto, NEUTRAS[cat]); } finally { BANCO.categorias[cat] = g; if (gr) BANCO.gramaticas[cat] = gr; }
  }
});
test('filtro de conteúdo: pega o proibido (inclusive disfarçado), não pega o banco, e vale para a IA', async () => {
  for (const x of ['vai se foder', 'que m3rda'.replace('3', 'e'), 'PORRAAAA', 'faça sua aposta', 'joga no tigrinho', 'vote no candidato', 'conteúdo pornô', 'manda nudes', 'c4r4lho']) assert.ok(bloqueado(x), x);
  for (const x of ['Compute o dia', 'A disputa é boa', 'Sexta-feira chegou', 'curso de inglês', 'O Currículo', 'cuidado', 'transporte', 'beterraba', 'Ana Paula']) assert.ok(!bloqueado(x), x);
  for (const L of Object.values(BANCO.categorias)) for (const f of L) assert.ok(!bloqueado(f.texto), f.texto);
  for (const x of Object.values(NEUTRAS)) assert.ok(!bloqueado(x));
  assert.equal(await humanize({ AI: { run: async () => ({ response: '{"title":"Oi","body":"aposta no tigrinho hoje"}' }) } }, { kind: 'agenda', fact: 'x' }, prof, [], brNow(at('10:00'))), null);
  assert.equal(await humanize({ AI: { run: async () => ({ response: '{"title":"Oi","body":"toma 2 comprimidos agora"}' }) } }, { kind: 'agenda', fact: 'x' }, prof, [], brNow(at('10:00'))), null);
});
test('versículos: paráfrases próprias marcadas, nenhuma frase conhecida de tradução protegida', () => {
  const todos = [...BANCO.categorias.versiculo.map((v) => v.texto), ...VERSES.map((v) => v[0]), ...FAITH.crista.map((v) => v[0]), ...FAITH.catolica.filter((v) => /\d/.test(v[1])).map((v) => v[0])];
  assert.ok(BANCO.parafrases_proprias && BANCO.categorias.versiculo.every((v) => /paráfrase própria/.test(v.versao) && v.ref));
  const PROIB = /tudo posso naquele|nada me faltar[aá]|de nada terei falta|n[aã]o se apavore|planos de faz[eê]-los|cansados e sobrecarregados|seu pr[oó]prio entendimento|age em todas as coisas|aux[ií]lio sempre presente|esp[ií]rito de covardia|ele agir[aá]|renovam as suas for[cç]as|lancem sobre ele|alegremo-nos e exultemos|grande [eé] a tua fidelidade|especial e admir[aá]vel|minha paz dou|irrompe a alegria|bem-sucedidos|te aben[cç]oe e te guarde|fazei|fortalecer[aá]\./i;
  for (const t of todos) assert.doesNotMatch(t, PROIB, t);
  const js = fs.readFileSync(new URL('../../js/personal.js', import.meta.url), 'utf8'); assert.doesNotMatch(js, /Tudo posso naquele|e ele agirá|o amor é bondoso/);
  assert.ok(RELIGIONS.catolica);
});
