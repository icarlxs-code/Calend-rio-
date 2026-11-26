/* O cliente da API: nunca estoura o limite diário, guarda em cache e identifica o time certo. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { orcamento, pega, mapaTimes, idDoTime, proximasLista, intervalo } from '../src/fut-api.js';

const kv = () => { const m = new Map(); return { m, get: async (k, t) => (m.has(k) ? (t === 'json' ? JSON.parse(m.get(k)) : m.get(k)) : null), put: async (k, v) => m.set(k, v), delete: async (k) => m.delete(k) }; };
const ambiente = (resp, limite = 5) => { const CAL = kv(); const chamadas = []; globalThis.fetch = async (u) => { chamadas.push(u); return resp(u); }; return { env: { CAL, API_FUTEBOL_KEY: 'x', API_FUTEBOL_LIMITE: String(limite) }, chamadas, CAL }; };
const ok = (dados) => async () => ({ ok: true, status: 200, json: async () => dados });

test('sem chave não chama nada', async () => {
  globalThis.fetch = async () => { throw new Error('não podia chamar'); };
  const r = await pega({ CAL: kv() }, '/campeonatos');
  assert.equal(r.erro, 'sem-chave');
});

test('o cache evita gastar o limite', async () => {
  const a = ambiente(ok([{ x: 1 }]));
  const p1 = await pega(a.env, '/campeonatos', { ttl: 600 });
  const p2 = await pega(a.env, '/campeonatos', { ttl: 600 });
  assert.deepEqual(p1.dados, [{ x: 1 }]); assert.equal(p2.cache, true);
  assert.equal(a.chamadas.length, 1, 'chamou a API só uma vez');
  assert.equal((await orcamento(a.env)).gasto, 1);
});

test('estourou o orçamento do dia: para de chamar', async () => {
  const a = ambiente(ok({ ok: 1 }), 3);
  for (let i = 0; i < 5; i++) await pega(a.env, `/r${i}`, { ttl: 0 });
  assert.equal(a.chamadas.length, 3, 'parou no limite configurado');
  const r = await pega(a.env, '/r9', { ttl: 0 });
  assert.equal(r.erro, 'sem-orcamento');
});

test('429 da API trava o dia inteiro', async () => {
  const a = ambiente(async () => ({ ok: false, status: 429, json: async () => ({}) }), 50);
  const r = await pega(a.env, '/campeonatos', { ttl: 0 });
  assert.equal(r.erro, 'limite-diario');
  assert.equal((await orcamento(a.env)).sobra, 0);
  const r2 = await pega(a.env, '/outra', { ttl: 0 });
  assert.equal(r2.erro, 'sem-orcamento', 'não insiste depois do 429');
});

test('chave recusada é reportada sem derrubar nada', async () => {
  const a = ambiente(async () => ({ ok: false, status: 401, json: async () => ({}) }), 9);
  assert.equal((await pega(a.env, '/me', { ttl: 0 })).erro, 'chave-recusada');
});

test('mapa de times e identificação do clube do app', async () => {
  const tab = [
    { posicao: 1, pontos: 60, time: { time_id: 56, nome_popular: 'Palmeiras', sigla: 'PAL' } },
    { posicao: 2, pontos: 58, time: { time_id: 30, nome_popular: 'Atlético-MG', sigla: 'CAM' } },
    { posicao: 3, pontos: 55, time: { time_id: 26, nome_popular: 'São Paulo', sigla: 'SAO' } },
  ];
  const a = ambiente(ok(tab), 9);
  const mapa = await mapaTimes(a.env);
  assert.equal(idDoTime(mapa, { nome: 'Palmeiras', sigla: 'PAL', id: 'palmeiras', ap: ['verdao'] }), 56);
  assert.equal(idDoTime(mapa, { nome: 'São Paulo', sigla: 'SAO', id: 'saopaulo', ap: ['spfc'] }), 26, 'acento não atrapalha');
  assert.equal(idDoTime(mapa, { nome: 'Atlético-MG', sigla: 'CAM', id: 'atleticomg', ap: ['galo'] }), 30);
  assert.equal(idDoTime(mapa, { nome: 'Inexistente FC', sigla: 'XXX', id: 'xxx', ap: [] }), 0);
  const a2 = ambiente(ok(tab), 9); const m2 = await mapaTimes({ ...a2.env, CAL: a.CAL });
  assert.equal(a2.chamadas.length, 0, 'o mapa fica guardado e não gasta de novo');
  assert.equal(Object.keys(m2).length >= 6, true);
});

test('próximas partidas: achata o agrupamento por campeonato', () => {
  const L = proximasLista({
    'campeonato-brasileiro': [{ partida_id: 1, data_realizacao_iso: '2026-11-29T16:00:00-0300', time_mandante: { time_id: 56, nome_popular: 'Palmeiras' }, time_visitante: { time_id: 30, nome_popular: 'Atlético-MG' }, campeonato: { campeonato_id: 10, nome_popular: 'Brasileirão' }, estadio: { nome_popular: 'Allianz Parque' } }],
    'copa-do-brasil': [{ partida_id: 2, data_realizacao_iso: '2026-11-27T21:30:00-0300', time_mandante: { time_id: 1, nome_popular: 'Outro' }, time_visitante: { time_id: 56, nome_popular: 'Palmeiras' }, campeonato: { campeonato_id: 13, nome_popular: 'Copa do Brasil' } }],
  });
  assert.equal(L.length, 2);
  assert.equal(L[0].id, 2, 'ordenado pela data');
  assert.equal(L[0].camp, 'Copa do Brasil'); assert.equal(L[1].estadio, 'Allianz Parque');
  assert.deepEqual(proximasLista(null), []);
});

test('o intervalo de consulta respeita o que sobrou do dia', () => {
  assert.equal(intervalo(500, true), 60e3);
  assert.equal(intervalo(200, true), 2 * 60e3);
  assert.equal(intervalo(100, true), 4 * 60e3);
  assert.equal(intervalo(30, true), 8 * 60e3);
  assert.equal(intervalo(0, true), 0, 'sem orçamento, não consulta');
  assert.equal(intervalo(500, false), 0, 'fora de jogo, não consulta');
});
