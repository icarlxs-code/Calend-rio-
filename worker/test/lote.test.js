/* Remédio pelo nome, fontes das frases e lotes de IA da madrugada. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { handle } from '../src/index.js';
import { makeFrases, loteDiario, peneira, plano, pedido, semente, TETO } from '../src/lote.js';
import { proxima, BANCO } from '../src/vivo.js';
import { FAITH, pickFaith } from '../src/mind.js';
import { REMEDIOS, achaRemedio, escondeNome } from '../../js/remedios-lista.js';
import { ehRemedio } from '../../functions/remedio.js';

const banco = () => { const db = new DatabaseSync(':memory:'); return { db, sql: { exec(s, ...p) { const st = db.prepare(s); const rows = /^\s*select/i.test(s) ? st.all(...p) : (st.run(...p), []); return { toArray: () => rows }; } } }; };
const kv = () => { const m = new Map(); return { m, async get(k, t) { const v = m.get(k); return v == null ? null : t === 'json' ? JSON.parse(v) : v; }, async put(k, v) { m.set(k, String(v)); }, async delete(k) { m.delete(k); } }; };
const MAD = Date.parse('2026-11-26T03:10:00-03:00');

test('remédio pelo nome: em qualquer categoria, com ou sem acento, maiúscula ou dose', () => {
  assert.ok(REMEDIOS.length >= 200 && new Set(REMEDIOS).size === REMEDIOS.length, REMEDIOS.length);
  for (const t of ['tomar losartana 50', 'Puran T4', 'insulina antes do almoço', 'METFORMINA', 'Ômeprazol', 'glifage xr', 'Rivotril', 'comprar dipirona', 'anticoncepcional', 'tomar Yasmin', 'Concerta 36mg', 'Ácido acetilsalicílico']) for (const cat of ['lembrete', 'compromisso', 'saude', 'compras']) assert.ok(ehRemedio({ title: t, cat }), t);
  for (const t of ['Aniversário da Yasmin', 'Concerta o portão da garagem', 'Reunião com a Diane', 'Comprar insumos da loja', 'Passar o relatório', 'Reforma do banheiro', 'Cálcio e ferro: aula de química']) assert.ok(!ehRemedio({ title: t, cat: 'compromisso' }) && !achaRemedio(t), t);
});
test('última barreira: o nome é trocado em qualquer aviso que o servidor manda', () => {
  assert.equal(escondeNome('Às 8h: Tomar Losartana 50mg agora'), 'Às 8h: Tomar remédio agora'); assert.equal(escondeNome('💊 Puran T4 · 7h'), '💊 remédio · 7h'); assert.equal(escondeNome('Insulina e metformina'), 'remédio e remédio'); assert.equal(escondeNome('Reunião às 10h'), 'Reunião às 10h');
});
test('frases de santos, Kardec, Chico Xavier e Buda têm fonte e revisão jurídica marcada', () => {
  const alvo = /Santa Teresa|Padre Pio|Agostinho|S[aã]o Francisco|Jo[aã]o Paulo|Kardec|Chico Xavier|^Buda$|Ora[cç][aã]o/; let n = 0;
  for (const L of Object.values(FAITH)) for (const [t, quem, x] of L) if (alvo.test(quem)) { n++; assert.ok(x && x.fonte && x.revisaoJuridica === true, t); }
  assert.ok(n >= 8); const p = pickFaith('espirita', 'u', 's'); assert.ok(p[0] && p[1]);
});
test('peneira: 140 caracteres, slots válidos, sem dose/diagnóstico, sem fé, sem remédio, diferente das existentes', () => {
  const ok = 'Que tal trocar cinco minutos de tela por um copo bem gelado?'; assert.equal(peneira('1. ' + ok, 'agua'), ok); assert.equal(peneira(`"${ok}"`, 'agua'), ok);
  for (const t of ['a'.repeat(141), 'Oi {cpf}, bora tomar água agora mesmo?', 'Deus te abençoe neste copo d’água', 'Tome 2 comprimidos com água agora', 'Beber água cura a ansiedade, sabia?', 'Faça sua aposta no copo de hoje, vai', 'Losartana pede água, sabia disso?', 'Você está pronto(a) para o próximo gole?', 'Drink water and have a good day', 'Oi', 'Aberta { chave solta no meio da frase']) assert.equal(peneira(t, 'agua'), '', t);
  const ex = [new Set(['trocar', 'cinco', 'minutos', 'tela', 'por', 'copo', 'bem', 'gelado', 'que', 'tal'])]; assert.equal(peneira(ok, 'agua', ex), '');
  assert.equal(peneira('{nome}, seu foco pediu um gole de coragem', 'agua'), '{nome}, seu foco pediu um gole de coragem'); assert.equal(peneira('{nome}, liga para quem você gosta hoje', 'socializar'), '');
});
test('o pedido à IA não leva nome nem dado de ninguém; o plano muda a cada dia', () => {
  const a = plano('2026-11-26'), b = plano('2026-11-27'); assert.equal(a.length, 10); assert.notDeepEqual(a, b);
  for (const c of [...a, ...b]) { assert.ok(!['versiculo', 'remedio', 'aniversario'].includes(c.cat)); assert.ok(c.tags.length <= 2); assert.doesNotMatch(JSON.stringify(pedido(c)), /Lia|Henrique|@|\d{4}-\d{2}/); }
});
test('madrugada: um lote por minuto, respeita o teto de 3.000 e nunca derruba nada', async () => {
  const { sql } = banco(), env = { CAL: kv(), FRASES: makeFrases(sql), AI: null }; let n = 0;
  assert.equal((await loteDiario(env, MAD)).parou, 'fora');
  env.AI = { run: async (m, o) => { n++; assert.equal(m, '@cf/meta/llama-3.1-8b-instruct-fp8-fast'); return { response: Array.from({ length: 20 }, (_, i) => `${i + 1}. Ideia número ${n}${i}${'bcdfghjklm'[i % 10]}: ${'abcdefghij'[n % 10].repeat(4)} ${'klmnopqrst'[i % 10].repeat(5)} ${'uvwxyzabcd'[(i * 3) % 10].repeat(6)} mesa${i}${n}`).join('\n') }; } };
  assert.equal((await loteDiario(env, Date.parse('2026-11-26T10:00:00-03:00'))).parou, 'fora');
  for (let i = 0; i < 15; i++) await loteDiario(env, MAD + i * 6e4);
  assert.equal(n, 10, 'para depois do plano do dia'); const st = await env.CAL.get('lote:2026-11-26', 'json'); assert.ok(st.n > 0 && st.n <= TETO && st.novas > 20, JSON.stringify(st));
  const x = env.FRASES.atual().extra; assert.ok(Object.values(x).flat().every((f) => f.id.startsWith('ia-') && f.tags.length));
  env.CAL.m.set('lote:2026-11-27', JSON.stringify({ i: 0, n: TETO - 5, novas: 0 })); const antes = n; assert.equal((await loteDiario(env, MAD + 864e5)).parou, 'teto'); assert.equal(n, antes);
  env.AI = { run: async () => { throw new Error('limite diário da IA grátis atingido'); } }; const log = console.log; console.log = () => {}; try { assert.equal((await loteDiario(env, MAD + 2 * 864e5)).parou, 'ia'); assert.equal((await loteDiario(env, MAD + 2 * 864e5 + 6e4)).parou, 'pronto'); } finally { console.log = log; }
});
test('o motor usa as frases da IA e respeita as desligadas', () => {
  const { sql } = banco(), Fr = makeFrases(sql), g = BANCO.categorias.contas; Fr.nova('contas', 'Um cafezinho e as contas em ordem, combina?', 'leve', ['leitura'], 1); BANCO.categorias.contas = [];
  try { const m = proxima({ cat: 'contas', perfil: { banco: Fr.atual() }, slots: {}, agora: { turno: 'tarde', wd: 1, chave: 'k' } }); assert.match(m.texto, /cafezinho/); for (const q of ['a', 'b', 'c']) Fr.queixa(m.id, q, 1); assert.match(proxima({ cat: 'contas', perfil: { banco: Fr.atual() }, slots: {}, agora: { turno: 'tarde', wd: 1, chave: 'k' } }).id, /neutra/); } finally { BANCO.categorias.contas = g; }
});
test('👎: 3 pessoas diferentes desligam; a mesma pessoa conta uma vez; id inventado não entra', async () => {
  const { sql } = banco(), Fr = makeFrases(sql), C = kv();
  assert.equal(Fr.queixa('inventada-1', 'a', 1), null); assert.ok(semente('agua-g-a1n2f3') && !semente('agua-g-a99n2f3'));
  assert.equal(Fr.queixa('agua-001', 'a', 1).queixas, 1); assert.ok(Fr.queixa('agua-001', 'a', 1).repetida); assert.equal(Fr.queixa('agua-001', 'b', 1).ativo, true); assert.equal(Fr.queixa('agua-001', 'c', 1).ativo, false); assert.ok(Fr.atual().off.has('agua-001'));
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url'), tok = `${b64({ alg: 'none' })}.${b64({ email: 'q@t.local', user_id: 'quemUid00000001', sub: 'quemUid00000001', exp: Math.floor(Date.now() / 1000) + 3600 })}.`;
  const env = { CAL: C, FRASES: Fr, TEAM: '[]', PROJECT_ID: 'demo', ALLOW_EMULATOR_TOKENS: '1', ALLOWED_ORIGINS: 'https://meulembra.com.br' };
  const pede = async (fid) => handle(new Request('https://w.dev/frase-queixa', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://meulembra.com.br', Authorization: `Bearer ${tok}` }, body: JSON.stringify({ fid, ws: '' }) }), env);
  assert.equal((await pede('agua-002')).status, 200); assert.equal((await pede('../x')).status, 404); const vh = [...C.m.entries()].find(([k]) => k.startsWith('vh:')); assert.deepEqual(JSON.parse(vh[1])._x, ['agua-002']);
  for (let i = 0; i < 200; i++) assert.notEqual(proxima({ cat: 'agua', perfil: { uid: 'u' + i }, slots: { nome: 'Lia' }, agora: { turno: 'tarde', wd: 1, chave: 'k' + i }, vh: { _x: ['agua-002'] } }).id, 'agua-002');
});
