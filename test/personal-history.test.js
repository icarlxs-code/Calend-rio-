import './_base.js';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nova } from './_base.js';
const P = await import('../js/personal.js');
test('400 dias de histórico ficam inteiros ao marcar mais um', async () => {
  await nova(); P.startPersonal(); const dias = Array.from({ length: 400 }, (_, i) => new Date(Date.UTC(2025, 9, 1 + i)).toISOString().slice(0, 10));
  const it = P.savePersonal({ title: 'Água', cat: 'lembrete', date: '2025-10-01', repeat: 'daily', doneDates: dias }); const r = P.toggleDone(it, '2026-11-25'); assert.equal(r.doneDates.length, 401); assert.ok(r.doneDates.includes('2025-10-01'));
});
