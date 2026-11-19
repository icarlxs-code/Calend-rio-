import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nowIn, dueReminders, reminderMessage, changeMessage, dailyMessage, reminderOffsets, addDaysKey } from '../reminder-rules.js';

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
  assert.match(m.body, /^18h — postar o Reels/);
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

test('cobrança 30 min depois só se ainda estiver "a fazer"', () => {
  const now = { date: '2026-11-18', minutes: 18 * 60 + 30 };
  assert.equal(dueReminders([ev()], now)[0].offset, -30);
  assert.equal(dueReminders([ev({ status: 'pronto' })], now).length, 0);
  assert.equal(dueReminders([ev({ status: 'feito' })], { date: '2026-11-18', minutes: 17 * 60 }).length, 0);
  assert.match(reminderMessage(ev(), -30, 'Pura Vida').title, /^Já postou\?/);
});

test('sem horário não gera lembrete', () => {
  assert.equal(dueReminders([ev({ time: '' })], { date: '2026-11-18', minutes: 17 * 60 }).length, 0);
});

test('lembrete personalizado de 1 dia antes é incluído', () => {
  assert.ok(reminderOffsets(ev({ reminder: 1440 })).includes(1440));
  assert.deepEqual(reminderOffsets(ev({ reminder: -1 })), [-30]);
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
  assert.equal(m.title, 'Bom dia, Henrique! Seu dia hoje');
  assert.equal(m.body, '2 tarefas (1 post) · primeira: 11h30 Feed · Café Aroma · sai para Pura Vida às 15h');
  assert.equal(dailyMessage('morning', 'X', [], () => ''), null);
});

test('addDaysKey atravessa mês e ano', () => {
  assert.equal(addDaysKey('2026-12-31', 1), '2027-01-01');
  assert.equal(addDaysKey('2026-03-01', -1), '2026-02-28');
});
