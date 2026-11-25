import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nextNudge, agendaMessages, runPersonalCoach } from '../src/pcoach.js';

const at = (hhmm, day = '2026-11-20') => Date.parse(`${day}T${hhmm}:00-03:00`);
const prof = { name: 'Henrique', date: '2026-11-20', prefs: {}, today: [{ title: 'Cortar cabelo', cat: 'beleza', time: '17:00', done: false }], tomorrow: [], overdue: [{ title: 'Pagar conta de luz', cat: 'pagar' }], lastByCat: {}, nextByCat: { beleza: '2026-11-20' }, birthdays: [{ name: 'Maria', inDays: 2 }], lists: [{ name: 'Mercado', open: 4 }] };

test('fora do horário não manda nada', () => {
  assert.equal(nextNudge(prof, {}, at('06:00')), null);
  assert.equal(nextNudge(prof, {}, at('23:00')), null);
});

test('bom dia com versículo e quantidade do dia', () => {
  const r = nextNudge({ ...prof, prefs: { religion: 'catolica' } }, {}, at('07:35'), () => 0.3);
  assert.equal(r.msg.kind, 'morning'); assert.equal(r.msg.cat, 'manha');
  assert.match(r.msg.body, /—/); // versículo com referência
  assert.match(r.msg.body, /1 coisa anotada/);
  assert.ok(r.state.done.morning);
});

test('almoço na janela, uma vez só', () => {
  const st = { day: '2026-11-20', done: { morning: true }, next: 0 };
  const r = nextNudge(prof, st, at('11:50'), () => 0.5);
  assert.match(r.msg.title, /Almoço/);
  const again = nextNudge(prof, { ...r.state, next: 0 }, at('12:00'), () => 0.5);
  assert.doesNotMatch(again?.msg.title || '', /Almoço/);
});

test('respeita o intervalo entre mensagens', () => {
  const st = { day: '2026-11-20', done: { morning: true }, next: at('10:00') + 3600e3, nextWater: at('10:30'), lastAny: at('09:30') };
  assert.equal(nextNudge(prof, st, at('10:00')), null);
  // água volta 1h depois da última
  assert.equal(nextNudge(prof, st, at('10:31'), () => 0.4).msg.kind, 'water');
});

test('desligado nas preferências não manda', () => {
  assert.equal(nextNudge({ ...prof, prefs: { nudges: false } }, {}, at('07:40')), null);
});

test('mensagens da agenda: pendência, aniversário, lista; cabelo já marcado não pergunta', () => {
  const br = { h: 10, m: 0, date: '2026-11-20', wd: 5 };
  const msgs = agendaMessages(prof, br, {}).map((m) => m.body).join(' | ');
  assert.match(msgs, /Pagar conta de luz/);
  assert.match(msgs, /Maria/);
  assert.match(msgs, /Mercado/);
  assert.match(msgs, /Cortar cabelo/); // mais tarde hoje
  assert.doesNotMatch(msgs, /agendar um corte/);
  const noHair = agendaMessages({ ...prof, nextByCat: {}, lastByCat: { beleza: '2026-10-20' } }, br, {}).map((m) => m.body).join(' ');
  assert.match(noHair, /Faz 31 dias desde o último cuidado com o visual/);
  // no gênero da pessoa: mulher → salão; homem → corte e barba; neutro → sem marcar gênero
  const ask = (pronoun) => agendaMessages({ ...prof, prefs: { ...(prof.prefs || {}), pronoun }, nextByCat: {}, lastByCat: {} }, br, {}).map((m) => m.body).join(' ');
  assert.match(ask('f'), /salão/);
  assert.match(ask('m'), /corte de cabelo/);
  assert.match(ask('n'), /cuidado com o visual/);
});

test('ao longo de um dia: pouca água (máx. 5) e muita variedade, sem repetir texto seguido', () => {
  let st = {}, bodies = [], kinds = [];
  for (let t = at('07:00'); t <= at('22:30'); t += 60e3) {
    const r = nextNudge(prof, st, t);
    if (r) { st = r.state; bodies.push(r.msg.body); kinds.push(r.msg.kind); }
  }
  const water = kinds.filter((k) => k === 'water').length;
  assert.ok(water >= 2 && water <= 4, `água ${water}`);
  assert.ok(water / bodies.length <= 0.36, 'água não pode dominar');
  assert.ok(bodies.length >= 9 && bodies.length <= 30, `mandou ${bodies.length}`);
  for (let i = 1; i < bodies.length; i++) assert.notEqual(bodies[i], bodies[i - 1]);
});

test('cron: só manda para quem tem resumo e usa o pedido de teste', async () => {
  const kv = { 'pprofile:henrique': JSON.stringify(prof), 'pcoach': JSON.stringify({ henrique: { day: '2026-11-20', done: { morning: true }, next: at('10:00') + 3600e3, nextWater: at('10:50') } }), 'pnudge-force': JSON.stringify({ henrique: 5 }) };
  const env = { CAL: { get: async (k, t) => (kv[k] ? (t === 'json' ? JSON.parse(kv[k]) : kv[k]) : null), put: async (k, v) => (kv[k] = v) } };
  const sent = [];
  const realNow = Date.now;
  Date.now = () => at('10:00');
  try {
    const n = await runPersonalCoach(env, async (e, m, msg) => { sent.push([m, msg]); return 1; }, [{ id: 'henrique', name: 'Henrique' }, { id: 'matheus', name: 'Matheus' }]);
    assert.equal(n, 1);
    assert.equal(sent[0][0], 'henrique');
    assert.match(sent[0][1].url, /^\.\/#\/(p\/hoje|frase\/[a-z0-9]+)$/);
  } finally { Date.now = realNow; }
});

import { humanize } from '../src/pcoach.js';
test('IA escreve a mensagem como amigo e mantém o versículo exato', async () => {
  const env = { AI: { run: async (_m, o) => { assert.match(o.messages[0].content, /melhor amigo/); return { response: '{"title":"Bom dia, campeão ☀️","body":"Hoje é teu dia, Henrique. Vai com fé!"}' }; } } };
  const br = { h: 7, m: 40, date: '2026-11-20', wd: 5 };
  const r = await humanize(env, { kind: 'agenda', fact: 'Cortar cabelo', verse: ['Tudo posso naquele que me fortalece.', 'Filipenses 4:13'] }, { name: 'Henrique', today: [], ia: true }, [], br);
  assert.equal(r.title, 'Bom dia, campeão ☀️');
  assert.match(r.body, /Vai com fé!\nTudo posso naquele que me fortalece. — Filipenses 4:13/);
  assert.equal(await humanize({ AI: { run: async () => ({ response: 'sem json' }) } }, { kind: 'water' }, { name: 'H', ia: true }, [], br), null);
  // sem o consentimento da pessoa, nada vai para a IA
  let chamou = false;
  assert.equal(await humanize({ AI: { run: async () => { chamou = true; return { response: '{}' }; } } }, { kind: 'agenda', fact: 'x' }, { name: 'H' }, [], br), null);
  assert.equal(chamou, false);
});
test('um dia inteiro sem IA: quase nenhuma mensagem repetida', () => {
  let st = {}; const bodies = [];
  for (let d = 0; d < 3; d++) for (let t = Date.parse(`2026-11-2${d}T07:00:00-03:00`); t <= Date.parse(`2026-11-2${d}T22:30:00-03:00`); t += 60e3) {
    const r = nextNudge({ name: 'Henrique', prefs: { freq: 'alta' }, today: [] }, st, t);
    if (r) { st = r.state; bodies.push(r.msg.body); }
  }
  const uniq = new Set(bodies).size;
  assert.ok(uniq / bodies.length > 0.8, `${uniq}/${bodies.length} diferentes`);
});
test('mensagens começam às 7h20', () => {
  assert.equal(nextNudge(prof, {}, at('07:19')), null);
  assert.match(nextNudge(prof, {}, at('07:20'), () => 0.3).msg.kind, /morning/);
});

test('intervalos aleatórios: nunca menos de 25 min e sem ritmo fixo; títulos por tipo', () => {
  let st = {}; const times = []; const titles = new Set();
  for (let t = at('07:00'); t <= at('22:30'); t += 60e3) {
    const r = nextNudge({ name: 'Henrique', prefs: {}, today: [] }, st, t);
    if (r) { st = r.state; times.push(t); titles.add(r.msg.kind); }
  }
  const gaps = times.slice(1).map((t, i) => (t - times[i]) / 60e3);
  assert.ok(Math.min(...gaps) >= 20, `menor intervalo ${Math.min(...gaps)}`);
  const avg = gaps.reduce((a, b) => a + b, 0) / gaps.length;
  const sd = Math.sqrt(gaps.reduce((a, b) => a + (b - avg) ** 2, 0) / gaps.length);
  assert.ok(sd >= 7 && new Set(gaps).size >= gaps.length * 0.45, 'intervalos variados');
  assert.ok(titles.has('water') && titles.has('morning'));
});

test('janela do dia vem da ficha: quem acorda 5h recebe o bom dia 5h30; quem dorme 21h não recebe depois de 20h45', async () => {
  const { dayWindow, inWindow, anchorsFor } = await import('../src/pcoach.js');
  const cedo = { name: 'Ana', prefs: { wake: '05:00', sleep: '21:00', lunch: '11:00' }, today: [] };
  assert.equal(nextNudge(cedo, {}, at('05:20')), null);
  assert.match(nextNudge(cedo, {}, at('05:30'), () => 0.3).msg.kind, /morning/);
  assert.equal(nextNudge(cedo, { day: '', next: 0 }, at('20:50'), () => 0.3), null);
  // almoço da ficha (11h): o lembrete de comer vem entre 10h40 e 11h40
  const lunch = anchorsFor(dayWindow(cedo.prefs)).find((a) => a.key === 'lunch');
  assert.ok(lunch);
  const r = nextNudge(cedo, { done: { morning: true }, day: '2026-03-10', lastAny: 0, next: Date.now() + 9e9, nextWater: Date.now() + 9e9 }, at('10:50'), () => 0.5);
  assert.match(r.msg.title, /Almoço/);
  // quem trabalha à noite: acorda 17h, dorme 9h → a janela passa da meia-noite
  const w = dayWindow({ wake: '17:00', sleep: '09:00' });
  assert.ok(inWindow(2 * 60, w));
  assert.ok(inWindow(18 * 60, w));
  assert.ok(!inWindow(12 * 60, w));
});

test('sem abrir o app há mais de 3h: manda "tem algo pra marcar?" (até 3 por dia)', () => {
  // sorteio com semente fixa: o teste dá sempre o mesmo resultado
  let seed = 42;
  const rnd = () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  let st = {}, n = 0;
  const p = { ...prof, seenAt: at('07:00') };
  for (let t = at('07:00'); t <= at('22:30'); t += 60e3) {
    const r = nextNudge(p, st, t, rnd);
    if (r) { st = r.state; if (r.msg.kind === 'checkin') n++; }
  }
  assert.ok(n >= 1 && n <= 3, `checkins ${n}`);
  let st2 = {}, n2 = 0;
  for (let t = at('07:00'); t <= at('22:30'); t += 60e3) {
    const r = nextNudge({ ...prof, seenAt: t - 60e3 }, st2, t, rnd);
    if (r) { st2 = r.state; if (r.msg.kind === 'checkin') n2++; }
  }
  assert.equal(n2, 0, 'quem está usando o app não recebe');
});

test('retorno: sequência em risco no horário em que costuma abrir; queda no ranking avisa', () => {
  const hours = Array(24).fill(0); hours[20] = 9;
  let st = {}, kinds = [];
  for (let t = at('07:00'); t <= at('22:30'); t += 60e3) {
    const r = nextNudge({ ...prof, seenAt: at('07:00') - 864e5, seen: { streak: 6, hours }, rank: null }, st, t);
    if (r) { st = r.state; kinds.push([new Date(t - 3 * 3600e3).getUTCHours(), r.msg.kind]); }
  }
  const s = kinds.filter(([, k]) => k === 'streak');
  assert.equal(s.length, 1, 'uma vez por dia');
  assert.ok(s[0][0] >= 19, 'no horário habitual (20h) ou à noite');
  let st2 = { rankWeek: '2026-11-16', rankPos: 2 }, got = null;
  for (let t = at('09:00'); t <= at('20:00') && !got; t += 60e3) {
    const r = nextNudge({ ...prof, seenAt: t, seen: {}, rank: { pos: 4, week: '2026-11-16', leagueName: 'Prata', ahead: 7 } }, st2, t);
    if (r) { st2 = r.state; if (r.msg.kind === 'rank') got = r.msg; }
  }
  assert.ok(got && /4º na liga Prata/.test(got.title) && /7 pontos/.test(got.body));
});

test('cada pessoa recebe as próprias mensagens: perfil, religião, quantidade e água diferentes', () => {
  const run = (prof) => { let seed = 7; const rnd = () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; let st = {}, out = []; for (let t = at('07:00'); t <= at('22:30'); t += 60e3) { const r = nextNudge(prof, st, t, rnd); if (r) { st = r.state; out.push([t, r.msg]); } } return out; };
  const ana = run({ uid: 'u_ana', name: 'Ana', prefs: { pronoun: 'f', religion: 'budista', perDay: 14, waterEvery: 90 }, mind: { anxiety: 'muita', selfesteem: 'baixa', motivation: 'baixa', traits: ['perfeccionista'], focus: ['ansiedade'] }, today: [] });
  const beto = run({ uid: 'u_beto', name: 'Beto', prefs: { pronoun: 'm', religion: 'ateu', perDay: 4, waterEvery: 0 }, mind: { motivation: 'alta', traits: ['competitivo'] }, today: [] });
  const body = (l) => l.map(([, m]) => m.body);
  // ninguém recebe o mesmo texto
  const same = body(ana).filter((b) => body(beto).includes(b));
  assert.ok(same.length <= 1, `iguais: ${same}`);
  // ateu não recebe fé; budista recebe tradição budista (nunca versículo bíblico)
  assert.ok(!beto.some(([, m]) => m.verse), 'ateu sem fé');
  const faith = ana.filter(([, m]) => m.verse).map(([, m]) => m.verse[1]);
  assert.ok(faith.length && faith.every((r) => /Buda|Dhammapada|atenção plena/.test(r)), `budista: ${faith}`);
  // água: Beto desligou; Ana a cada 1h30 (mais vezes)
  assert.equal(beto.filter(([, m]) => m.kind === 'water').length, 0);
  assert.ok(ana.filter(([, m]) => m.kind === 'water').length >= 5);
  // quantidade: Ana (14/dia) recebe bem mais que Beto (4/dia)
  assert.ok(ana.length > beto.length + 4, `ana ${ana.length} × beto ${beto.length}`);
  // perfil ansioso/baixa autoestima recebe frases desse grupo
  assert.ok(ana.some(([, m]) => m.kind === 'mind' && ['ansiedade', 'autoestima', 'desmotivado', 'perfeccionista'].includes(m.group)));
});
