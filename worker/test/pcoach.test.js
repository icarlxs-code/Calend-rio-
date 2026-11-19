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
  const r = nextNudge(prof, {}, at('07:35'), () => 0.3);
  assert.match(r.msg.title, /Bom dia, Henrique/);
  assert.match(r.msg.body, /—/); // versículo com referência
  assert.match(r.msg.body, /1 coisa anotada/);
  assert.ok(r.state.done.morning);
});

test('almoço na janela, uma vez só', () => {
  const st = { day: '2026-11-20', done: { morning: true }, next: 0 };
  const r = nextNudge(prof, st, at('11:50'), () => 0.5);
  assert.match(r.msg.title, /almoço/);
  const again = nextNudge(prof, { ...r.state, next: 0 }, at('12:00'), () => 0.5);
  assert.doesNotMatch(again?.msg.title || '', /almoço/);
});

test('respeita o intervalo entre mensagens', () => {
  const st = { day: '2026-11-20', done: { morning: true }, next: at('10:00') + 3600e3 };
  assert.equal(nextNudge(prof, st, at('10:00')), null);
});

test('desligado nas preferências não manda', () => {
  assert.equal(nextNudge({ ...prof, prefs: { nudges: false } }, {}, at('07:40')), null);
});

test('mensagens da agenda: pendência, aniversário, lista; cabelo já marcado não pergunta', () => {
  const br = { h: 10, m: 0, date: '2026-11-20', wd: 5 };
  const msgs = agendaMessages(prof, br, {}).map((m) => m.body).join(' | ');
  assert.match(msgs, /Pagar conta de luz/);
  assert.match(msgs, /Maria faz aniversário em 2 dias/);
  assert.match(msgs, /Mercado/);
  assert.match(msgs, /Cortar cabelo/); // mais tarde hoje
  assert.doesNotMatch(msgs, /agendar um corte/);
  const noHair = agendaMessages({ ...prof, nextByCat: {}, lastByCat: { beleza: '2026-10-20' } }, br, {}).map((m) => m.body).join(' ');
  assert.match(noHair, /Faz 31 dias desde o último corte/);
});

test('ao longo de um dia inteiro manda entre 8 e 14 mensagens, sem repetir texto seguido', () => {
  let st = {}, bodies = [];
  for (let t = at('07:00'); t <= at('22:30'); t += 60e3) {
    const r = nextNudge(prof, st, t);
    if (r) { st = r.state; bodies.push(r.msg.body); }
  }
  assert.ok(bodies.length >= 8 && bodies.length <= 14, `mandou ${bodies.length}`);
  for (let i = 1; i < bodies.length; i++) assert.notEqual(bodies[i], bodies[i - 1]);
});

test('cron: só manda para quem tem resumo e usa o pedido de teste', async () => {
  const kv = { 'pprofile:henrique': JSON.stringify(prof), 'pcoach': JSON.stringify({ henrique: { day: '2026-11-20', done: { morning: true }, next: at('10:00') + 3600e3 } }), 'pnudge-force': JSON.stringify({ henrique: 5 }) };
  const env = { CAL: { get: async (k, t) => (kv[k] ? (t === 'json' ? JSON.parse(kv[k]) : kv[k]) : null), put: async (k, v) => (kv[k] = v) } };
  const sent = [];
  const realNow = Date.now;
  Date.now = () => at('10:00');
  try {
    const n = await runPersonalCoach(env, async (e, m, msg) => { sent.push([m, msg]); return 1; }, [{ id: 'henrique', name: 'Henrique' }, { id: 'matheus', name: 'Matheus' }]);
    assert.equal(n, 1);
    assert.equal(sent[0][0], 'henrique');
    assert.equal(sent[0][1].url, './#/p/hoje');
  } finally { Date.now = realNow; }
});

import { humanize } from '../src/pcoach.js';
test('IA escreve a mensagem como amigo e mantém o versículo exato', async () => {
  const env = { AI: { run: async (_m, o) => { assert.match(o.messages[0].content, /melhor amigo/); return { response: '{"title":"Bom dia, campeão ☀️","body":"Hoje é teu dia, Henrique. Vai com fé!"}' }; } } };
  const br = { h: 7, m: 40, date: '2026-11-20', wd: 5 };
  const r = await humanize(env, { kind: 'morning', verse: ['Tudo posso naquele que me fortalece.', 'Filipenses 4:13'] }, { name: 'Henrique', today: [] }, [], br);
  assert.equal(r.title, 'Bom dia, campeão ☀️');
  assert.match(r.body, /Vai com fé!\n“Tudo posso naquele que me fortalece.” — Filipenses 4:13/);
  assert.equal(await humanize({ AI: { run: async () => ({ response: 'sem json' }) } }, { kind: 'water' }, { name: 'H' }, [], br), null);
});
test('um dia inteiro sem IA: quase nenhuma mensagem repetida', () => {
  let st = {}; const bodies = [];
  for (let d = 0; d < 3; d++) for (let t = Date.parse(`2026-11-2${d}T07:00:00-03:00`); t <= Date.parse(`2026-11-2${d}T22:30:00-03:00`); t += 60e3) {
    const r = nextNudge({ name: 'Henrique', prefs: { freq: 'alta' }, today: [] }, st, t);
    if (r) { st = r.state; bodies.push(r.msg.body); }
  }
  const uniq = new Set(bodies).size;
  assert.ok(uniq / bodies.length > 0.85, `${uniq}/${bodies.length} diferentes`);
});
test('mensagens começam às 7h20', () => {
  assert.equal(nextNudge(prof, {}, at('07:19')), null);
  assert.match(nextNudge(prof, {}, at('07:20'), () => 0.3).msg.title, /Bom dia/);
});
