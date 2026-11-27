import './_base.js';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nova, ev, igual } from './_base.js';
import { todayKey, addDays } from '../js/utils.js';
const A = await import('../js/agent.js'), P = await import('../js/personal.js');
const { itensDaLixeira } = await import('../js/lixeira.js');
const H = todayKey();
async function base(n = 5) { const s = await nova(); await s.upsert('companies', { id: 'c1', name: 'JG Garcia', color: '#16A34A' }); await s.upsert('companies', { id: 'c2', name: 'Pura Vida', color: '#16A34A' }); await s.upsertMany('events', [...Array.from({ length: n }, (_, i) => ev('f' + i, { date: addDays(H, i * 20), seriesId: null })), ev('pas', { date: addDays(H, -3), seriesId: null }), ev('o', { companyId: 'c2', date: H, seriesId: null })]); return s; }
test('todos da empresa: pega muito além de 30 dias, não pega o passado, mostra a lista', async () => {
  await base(9); const pl = A.congela([{ acao: 'excluir', filtro: { empresa: 'JG Garcia' } }]); assert.equal(pl[0].apaga.length, 9); assert.ok(!pl[0].apaga.some((x) => x.id === 'pas')); assert.match(pl[0].text, /9 itens da JG Garcia de hoje até/);
  assert.equal(A.congela([{ acao: 'excluir', filtro: { empresa: 'JG Garcia', de: addDays(H, -30) } }])[0].apaga.length, 10); assert.equal(A.congela([{ acao: 'excluir', filtro: {} }])[0].ok, false); assert.equal(A.congela([{ acao: 'excluir', filtro: { empresa: 'Inexistente' } }])[0].ok, false);
});
test('id de outra empresa é barrado com aviso; 101 itens recusados', async () => {
  await base(3); const pl = A.congela([{ acao: 'excluir', empresa: 'JG Garcia', ids: ['f0', 'f1', 'o'] }])[0]; assert.deepEqual(pl.apaga.map((x) => x.id), ['f0', 'f1']); assert.match(pl.warn, /1 item não é da JG Garcia e ficou/);
  const s = await base(1); await s.upsertMany('events', Array.from({ length: 101 }, (_, i) => ev('x' + i, { date: addDays(H, 1), seriesId: null }))); const g = A.congela([{ acao: 'excluir', filtro: { empresa: 'JG Garcia' } }])[0]; assert.equal(g.ok, false); assert.match(g.text, /100/);
});
test('4 ou mais, ou série: pede a segunda confirmação', async () => {
  await base(4); assert.equal(A.pedeSegunda(A.congela([{ acao: 'excluir', ids: ['f0', 'f1', 'f2'] }])), false); const q = A.congela([{ acao: 'excluir', ids: ['f0', 'f1', 'f2', 'f3'] }]); assert.equal(A.pedeSegunda(q), true); assert.equal(A.quantosApaga(q), 4);
  const s = await base(1); await s.upsert('events', ev('ser', { date: H })); assert.equal(A.pedeSegunda(A.congela([{ acao: 'excluir', id: 'ser' }])), true);
});
test('executa só a lista mostrada; se a agenda mudou, avisa', async () => {
  const s = await base(3), pl = A.congela([{ acao: 'excluir', filtro: { empresa: 'JG Garcia' } }]); assert.equal(A.mudou(pl), false); await s.upsert('events', ev('novo', { date: H, seriesId: null })); assert.equal(A.mudou(pl), true);
  const r = await A.executa(pl, { lote: 'L1' }); assert.equal(r.apagou, 3); assert.ok(s.event('novo') && s.event('pas') && s.event('o')); assert.equal(itensDaLixeira().length, 3); assert.ok(itensDaLixeira().every((x) => x.item.deletedVia === 'assistente' && x.item.deleteBatch === 'L1'));
});
test('desfazer: apagar, mover, concluir, criar e pessoal voltam como estavam', async () => {
  const s = await base(3); P.startPersonal(); const pid = P.savePersonal({ title: 'Cabelo', cat: 'beleza', date: H, time: '10:00' }).id; const foto = () => { const o = {}; for (const e of [...s.state.events, ...P.personal.items]) { const x = igual(e); delete x.updatedAt; delete x.bulkAt; delete x.updatedBy; o[x.id] = x; } return o; };
  const antes = foto(), pl = A.congela([{ acao: 'excluir', ids: ['f0'] }, { acao: 'mover', id: 'f1', data: addDays(H, 9), inicio: '18:00' }, { acao: 'concluir', id: 'f2' }, { acao: 'criar', empresa: 'Pura Vida', tipo: 'reuniao', titulo: 'Nova', data: H, inicio: '11:00' }, { acao: 'excluir_pessoal', id: pid }, { acao: 'pessoal', titulo: 'Outro', data: H }]);
  assert.ok(pl.every((x) => x.ok), JSON.stringify(pl.map((x) => x.text))); const r = await A.executa(pl, { lote: 'L2' }); assert.equal(r.apagou, 2); assert.notDeepEqual(foto(), antes); await A.desfaz(r.undo); assert.deepEqual(foto(), antes);
  assert.ok(itensDaLixeira().some((x) => x.item.title === 'Nova'), 'o criado foi para a lixeira');
});
test('conta pela IA: mensal no dia certo, com valor (número ou texto) e o texto da confirmação mostra tudo', async () => {
  await nova(); P.startPersonal();
  const d = addDays(H, 3), dia = +d.slice(8);
  const p = A.planAction({ acao: 'pessoal', titulo: 'Pagar o aluguel', data: d, categoria: 'pagar', repetir: 'monthly', dia_mes: dia, valor: 1500 });
  assert.equal(p.ok, true); assert.match(p.text, new RegExp(`todo dia ${dia} · R\\$ 1\\.500`));
  await p.run();
  const it = P.personal.events.find((x) => x.title === 'Pagar o aluguel');
  assert.deepEqual([it.repeat, it.cat, it.valor, it.date], ['monthly', 'pagar', 1500, d]);
  const q = A.planAction({ acao: 'pessoal', titulo: 'Pagar a luz', data: d, categoria: 'pagar', valor: 'R$ 230,50' }); await q.run();
  assert.equal(P.personal.events.find((x) => x.title === 'Pagar a luz').valor, 230.5);
  const r = A.planAction({ acao: 'pessoal', titulo: 'Sem valor', data: d, valor: 'abc' }); await r.run();
  assert.equal(P.personal.events.find((x) => x.title === 'Sem valor').valor, undefined);
});
