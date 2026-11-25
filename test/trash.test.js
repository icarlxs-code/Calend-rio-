import './_base.js';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nova, ev, igual } from './_base.js';
import { conteudo, PRAZO, vencido, desmarca, marca } from '../js/lixeira-core.js';
const { lotes, restauraLote, itensDaLixeira } = await import('../js/lixeira.js');
const P = await import('../js/personal.js');
const agora = Date.now();

test('cada tipo do trabalho vai inteiro para a lixeira e volta idêntico', async () => {
  for (const [col, item] of [['events', ev('e1')], ['notes', { id: 'n1', date: '2027-01-01', text: 'bilhete', author: 'henrique', mentions: ['matheus'], createdAt: 5 }], ['companies', { id: 'c1', name: 'JG Garcia', color: '#16A34A', instagram: 'jg', logo: null, shareToken: null, notes: 'x', niche: 'hortifruti', createdAt: 1 }], ['settings', { id: 'seed-x', done: ['a'], updatedAt: 1 }]]) {
    const s = await nova(); await s.upsert(col, item); const antes = igual(s.state[col][0]);
    const lote = await s.remove(col, item.id); assert.ok(lote); assert.equal(s.state[col].length, 0);
    const t = s.trash[0]; assert.deepEqual(conteudo(igual(t.item)), antes, col); assert.equal(t.item.purgeAt - t.item.deletedAt, PRAZO); assert.ok(t.item.deletedVia && 'deletedBy' in t.item);
    assert.equal(await restauraLote(lote), 1); if (col === 'settings') assert.deepEqual(igual(s.state[col][0].done), antes.done); else assert.deepEqual(igual(s.state[col][0]), antes); assert.equal(s.trash.length, 0);
  }
});
test('série e lote: restaura tudo junto ou um só', async () => {
  const s = await nova(); await s.upsertMany('events', Array.from({ length: 9 }, (_, i) => ev('e' + i)));
  const lote = await s.removeMany('events', s.state.events.map((e) => e.id)); assert.equal(lotes().length, 1); assert.equal(lotes()[0].itens.length, 9); assert.equal(lotes()[0].via, 'lote');
  assert.equal(await s.restore('events', ['e3']), 1); assert.deepEqual(s.state.events.map((e) => e.id), ['e3']); assert.equal(await restauraLote(lote), 8); assert.equal(s.state.events.length, 9);
});
test('empresa leva os compromissos no mesmo lote e volta com eles', async () => {
  const s = await nova(); await s.upsert('companies', { id: 'c1', name: 'JG', color: '#16A34A' }); await s.upsertMany('events', [ev('a'), ev('b'), ev('z', { companyId: 'c2' })]); const antes = igual(s.state);
  const lote = 'l_emp'; await s.removeMany('events', ['a', 'b'], { via: 'empresa', lote }); await s.remove('companies', 'c1', { via: 'empresa', lote });
  assert.equal(lotes()[0].itens.length, 3); assert.equal(s.state.events.length, 1); await restauraLote(lote);
  const ord = (L) => [...L].sort((x, y) => (x.id < y.id ? -1 : 1)); assert.deepEqual(ord(igual(s.state.events)), ord(antes.events)); assert.deepEqual(igual(s.state.companies), antes.companies);
});
test('apagar tudo e substituir tudo: o que havia fica na lixeira', async () => {
  const s = await nova(); await s.upsert('companies', { id: 'c1', name: 'JG', color: '#16A34A' }); await s.upsertMany('events', [ev('a'), ev('b')]);
  const lote = await s.clearAll(); assert.equal(s.state.events.length + s.state.companies.length, 0); assert.equal(lotes()[0].itens.length, 3); assert.equal(await restauraLote(lote), 3);
  const l2 = await s.importData({ events: [ev('novo')], companies: [] }, { replace: true }); assert.deepEqual(s.state.events.map((e) => e.id), ['novo']); assert.equal(itensDaLixeira().length, 3); await restauraLote(l2); assert.equal(s.state.events.length, 3);
});
test('pessoal: lembrete, aniversário, nota, lista e item de lista', async () => {
  await nova(); P.startPersonal();
  const L = [P.savePersonal({ title: 'Dentista', cat: 'saude', date: '2027-01-01', time: '09:00', repeat: 'weekly', doneDates: ['2026-01-01'], note: 'x' }), P.savePersonal({ title: 'Aniversário da Bia', cat: 'aniversario', date: '2000-05-01', repeat: 'yearly', birthYear: 2000 }), P.addMemo('chave na gaveta'), P.newList('Mercado', 'cart')];
  for (const x of L) { const antes = igual(P.personal.items.find((y) => y.id === x.id)), lote = P.removePersonal(x.id); assert.ok(!P.personal.item(x.id)); assert.deepEqual(conteudo(igual(P.personal.trash.find((y) => y.id === x.id))), antes); assert.equal(await restauraLote(lote), 1); assert.deepEqual(igual(P.personal.items.find((y) => y.id === x.id)), antes); }
  const id = L[3].id; for (const t of ['leite', 'pão', 'café']) P.addEntry(P.personal.item(id), t); P.toggleEntry(P.personal.item(id), P.personal.item(id).entries[0].id); P.toggleEntry(P.personal.item(id), P.personal.item(id).entries[1].id);
  const lote = P.clearDone(P.personal.item(id)); assert.deepEqual(P.personal.item(id).entries.map((e) => e.text), ['café']); P.addEntry(P.personal.item(id), 'ovo'); assert.equal(await restauraLote(lote), 2); assert.equal(P.personal.item(id).entries.length, 4); assert.ok(P.personal.item(id).entries.every((e) => !('deletedAt' in e)));
  const l2 = P.removeEntry(P.personal.item(id), P.personal.item(id).entries[0].id); assert.equal(P.personal.item(id).entries.length, 3); assert.equal(P.personal.lists[0].entries.length, 3); await restauraLote(l2); assert.equal(P.personal.item(id).entries.length, 4);
});
test('24 horas: antes dá para restaurar, depois não; reabrir o app tira o vencido', async () => {
  const s = await nova(); await s.upsertMany('events', [ev('a'), ev('b')]); await s.remove('events', 'a', { agora: agora - PRAZO + 60e3 }); await s.remove('events', 'b', { agora: agora - PRAZO - 1 });
  assert.equal(itensDaLixeira().length, 1); assert.equal(await s.restore('events', ['b']), 0); assert.equal(await s.restore('events', ['a']), 1);
  s.trash.push({ col: 'events', item: { ...ev('v'), ...marca({ agora: agora - 2 * PRAZO }) } }); s.trash.push({ col: 'events', item: { ...ev('n'), ...marca({ agora }) } }); await s.upsert('notes', { id: 'n9', date: '2027-01-01', text: 'x' });
  const { initLocal } = await import('../js/store.js'); await initLocal(); assert.deepEqual(s.trash.map((t) => t.item.id), ['n']);
  assert.ok(vencido(marca({ agora: agora - PRAZO })) && !vencido(marca({ agora })) && desmarca().purgeAt === null);
});
