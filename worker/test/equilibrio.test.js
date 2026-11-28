import { test } from 'node:test';
import assert from 'node:assert/strict';
import { categoriaDe, cabe, DIA_MAX } from '../src/equilibrio.js';
const kv = () => { const m = new Map(); return { get: async (k, t) => (m.has(k) ? (t === 'json' ? JSON.parse(m.get(k)) : m.get(k)) : null), put: async (k, v) => m.set(k, v) }; };
const BR = (h, m = 0) => Date.parse(`2026-11-28T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00-03:00`);
test('categorias: conversas entram no controle; compromisso, mensagem e atualização não', () => {
  assert.equal(categoriaDe('story-dia'), 'story'); assert.equal(categoriaDe('amigo-u1'), 'amigos');
  assert.equal(categoriaDe('visitas-1'), 'visita'); assert.equal(categoriaDe('coach'), 'dica');
  assert.equal(categoriaDe('atualizar'), null); assert.equal(categoriaDe('suporte'), null); assert.equal(categoriaDe('lembrete-123'), null);
});
test('limites: fora do horário, muito cedo, mesma categoria e limite do dia', async () => {
  const env = { CAL: kv() };
  assert.equal((await cabe(env, 'u', 'story', BR(6))).motivo, 'fora-da-janela');
  assert.equal((await cabe(env, 'u', 'story', BR(10))).ok, true);
  assert.equal((await cabe(env, 'u', 'visita', BR(10, 30))).motivo, 'muito-cedo', 'entre duas mensagens, espera 60 min');
  assert.equal((await cabe(env, 'u', 'story', BR(12))).motivo, 'categoria-repetida', 'mesma categoria só depois de 3 h');
  assert.equal((await cabe(env, 'u', 'visita', BR(11, 30))).ok, true);
  let t = BR(8, 0); let ok = 0;
  for (let k = 0; k < 12; k++) { t += 70 * 60e3; if ((await cabe(env, 'v', ['story', 'visita', 'dica', 'amigos', 'ranking'][k % 5], t)).ok) ok++; }
  assert.ok(ok <= DIA_MAX, `no máximo ${DIA_MAX} por dia (${ok})`);
});
test('rotina da noite não some: ainda sai às 21h e 22h30 mesmo depois de outros avisos', async () => {
  const env = { CAL: kv() };
  assert.equal(categoriaDe('p-amigo', 'morning'), 'rotina');
  assert.equal((await cabe(env, 'n', 'story', BR(15))).ok, true);
  assert.equal((await cabe(env, 'n', 'rotina', BR(21, 0), 8)).ok, true, 'às 21h sai');
  assert.equal((await cabe(env, 'n', 'rotina', BR(22, 30), 8)).ok, true, 'às 22h30 ainda sai');
});
