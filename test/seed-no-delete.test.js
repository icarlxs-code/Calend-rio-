import './_base.js';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { nova, ev } from './_base.js';
test('a rotina pré-cadastrada nunca apaga nem ressuscita', async () => {
  const s = await nova(), { ensureSeedRoutine, buildGarciaRoutine } = await import('../js/seed-routine.js'); const M = fs.readFileSync(new URL('../js/seed-routine.js', import.meta.url), 'utf8'); assert.ok(!/removeMany|\.remove\(/.test(M));
  const C = /const COMPANY = '([^']+)'/.exec(M)[1]; await s.upsert('companies', { id: C, name: 'Garcia', color: '#16A34A' }); await s.upsertMany('events', [ev('e_garcia_1', { seedRoutine: true }), ev('meu')]);
  const g = buildGarciaRoutine()[0]; if (g) s.trash.push({ col: 'events', item: { ...g, deletedAt: Date.now(), purgeAt: Date.now() + 1e6 } });
  await ensureSeedRoutine(); assert.ok(s.event('e_garcia_1') && s.event('meu')); if (g) assert.ok(!s.event(g.id), 'o que a pessoa apagou não volta');
});
