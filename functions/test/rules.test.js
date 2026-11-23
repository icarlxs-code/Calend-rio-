import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nowIn, dueReminders, reminderMessage, lateReminders, changeMessage, dailyMessage, reminderOffsets, addDaysKey } from '../reminder-rules.js';

const ev = (o) => ({ id: 'e1', date: '2026-11-18', time: '18:00', type: 'reels', status: 'pendente', reminder: 30, assignees: ['henrique'], ...o });

test('fuso de São Paulo', () => {
  const n = nowIn('America/Sao_Paulo', new Date('2026-11-18T13:00:00Z'));
  assert.deepEqual(n, { date: '2026-11-18', minutes: 10 * 60 });
  const virada = nowIn('America/Sao_Paulo', new Date('2026-11-19T02:30:00Z'));
  assert.deepEqual(virada, { date: '2026-11-18', minutes: 23 * 60 + 30 });
});

test('lembrete 1h antes do Reels', () => {
  const due = dueReminders([ev()], { date: '2026-11-18', minutes: 17 * 60 });
  assert.equal(due.length, 1);
  assert.equal(due[0].offset, 60);
  const m = reminderMessage(due[0].ev, 60, 'Pura Vida');
  assert.equal(m.title, 'Daqui a 1h: Reels · Pura Vida');
  assert.match(m.body, /18h/); assert.match(m.body, /postar o Reels/); // o texto varia por item (sempre com hora e o quê)
});

test('janela tolera atraso de alguns minutos, mas não repete depois', () => {
  assert.equal(dueReminders([ev()], { date: '2026-11-18', minutes: 17 * 60 + 3 }).length, 1);
  assert.equal(dueReminders([ev()], { date: '2026-11-18', minutes: 17 * 60 + 5 }).length, 0);
});

test('captação: aviso na véspera, mesmo virando o dia', () => {
  const c = ev({ type: 'captacao', date: '2026-11-19', time: '09:00' });
  const due = dueReminders([c], { date: '2026-11-18', minutes: 9 * 60 });
  assert.equal(due[0].offset, 1440);
  assert.match(reminderMessage(c, 1440, 'Pura Vida').title, /^Amanhã: Captação · Pura Vida às 9h/);
});

test('atrasado: cobrança a cada 10 min até 3h, nunca de madrugada, textos variados', () => {
  const start = Date.parse('2026-11-18T18:00:00-03:00');
  const list = lateReminders(ev({ id: 'e1' }), start, 'Pura Vida');
  assert.equal(list[0].late, 10);
  assert.equal(list[0].at, start + 10 * 60e3);
  assert.match(list[0].title, /^⏰ Atrasado 10 min · Reels · Pura Vida/);
  assert.equal(list.length, 18);
  assert.match(list[17].title, /Atrasado 3h/);
  assert.ok(new Set(list.map((x) => x.body)).size >= 15);
  const late = lateReminders(ev({ id: 'e2' }), Date.parse('2026-11-18T22:30:00-03:00'), 'X');
  assert.ok(late.length <= 3); // para às 23h
  assert.match(reminderMessage(ev(), 0, 'Pura Vida').title, /^Já postou\?/);
});

test('lembrete personalizado de 1 dia antes é incluído', () => {
  assert.ok(reminderOffsets(ev({ reminder: 1440 })).includes(1440));
  assert.deepEqual(reminderOffsets(ev({ reminder: -1 })), []);
});

test('mensagens de mudança na agenda', () => {
  const now = { date: '2026-11-18', minutes: 600 };
  const a = ev({ assignees: ['henrique'], date: '2026-11-19', time: '16:00', type: 'story', title: 'Enquete' });
  assert.deepEqual(changeMessage(null, a, { actor: 'Matheus', company: 'Pura Vida', recipient: 'henrique', now }),
    { title: 'Matheus marcou para você', body: 'Story · Pura Vida — amanhã, 16h · Enquete' });
  assert.equal(changeMessage(null, a, { actor: 'Matheus', recipient: 'matheus', now }).title, 'Matheus adicionou na agenda');
  assert.equal(changeMessage(a, { ...a, time: '18:00' }, { actor: 'Matheus', now }).body, 'Story: amanhã, 16h → amanhã, 18h');
  assert.equal(changeMessage(a, { ...a, status: 'feito' }, { actor: 'Henrique', now }).title, 'Henrique concluiu ✓');
  assert.equal(changeMessage(a, { ...a, description: 'nova legenda' }, { actor: 'Matheus', now }), null);
  assert.equal(changeMessage({ ...a, assignees: ['matheus'] }, a, { actor: 'Matheus', recipient: 'henrique', now }).title, 'Matheus passou para você');
});

test('resumo do dia', () => {
  const evs = [ev({ time: '11:30', type: 'feed', companyId: 'a' }), ev({ time: '15:00', type: 'captacao', companyId: 'b' })];
  const m = dailyMessage('morning', 'Henrique', evs, (e) => ({ a: 'Café Aroma', b: 'Pura Vida' })[e.companyId]);
  assert.match(m.title, /Henrique/); // título varia (bom dia, café, plim…)
  assert.ok(m.body.startsWith('2 tarefas (1 post) · primeira: 11h30 Feed · Café Aroma · sai para Pura Vida às 15h'));
  assert.ok(!/undefined/.test(m.title + m.body));
  assert.equal(dailyMessage('morning', 'X', [], () => ''), null);
});

test('addDaysKey atravessa mês e ano', () => {
  assert.equal(addDaysKey('2026-12-31', 1), '2027-01-01');
  assert.equal(addDaysKey('2026-03-01', -1), '2026-02-28');
});
