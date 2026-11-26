/* Um jogo inteiro, do apito ao fim: o Lembra avisa o que aconteceu, uma vez só, e para quem torce. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rodaAoVivo, cenaDoTime } from '../src/fut-motor.js';

const kv = () => { const m = new Map(); return { m, get: async (k, t) => (m.has(k) ? (t === 'json' ? JSON.parse(m.get(k)) : m.get(k)) : null), put: async (k, v) => m.set(k, v), delete: async (k) => m.delete(k) }; };
const TAB = [
  { posicao: 1, pontos: 49, time: { time_id: 99, nome_popular: 'Líder', sigla: 'LID' } },
  { posicao: 2, pontos: 45, time: { time_id: 56, nome_popular: 'Palmeiras', sigla: 'PAL' } },
  { posicao: 3, pontos: 40, time: { time_id: 30, nome_popular: 'Atlético-MG', sigla: 'CAM' } },
];
const INICIO = Date.parse('2026-11-26T21:30:00-0300');
const PROX = { 'campeonato-brasileiro': [{ partida_id: 777, data_realizacao_iso: '2026-11-26T21:30:00-0300', time_mandante: { time_id: 56, nome_popular: 'Palmeiras' }, time_visitante: { time_id: 30, nome_popular: 'Atlético-MG' }, campeonato: { campeonato_id: 10, nome_popular: 'Brasileirão' }, estadio: { nome_popular: 'Allianz Parque' } }] };
const partida = (o) => ({ partida_id: 777, campeonato: { campeonato_id: 10, nome_popular: 'Brasileirão' }, time_mandante: { time_id: 56, nome_popular: 'Palmeiras' }, time_visitante: { time_id: 30, nome_popular: 'Atlético-MG' }, placar_mandante: 0, placar_visitante: 0, disputa_penalti: false, status: 'andamento', periodo: 'primeiro-tempo', estadio: { nome_popular: 'Allianz Parque' }, gols: { mandante: [], visitante: [] }, cartoes: { amarelo: { mandante: [], visitante: [] }, vermelho: { mandante: [], visitante: [] } }, ...o });
const gol = (nome, min) => ({ atleta: { atleta_id: nome.length, nome_popular: nome }, minuto: min, periodo_slug: 'primeiro-tempo', penalti: false, gol_contra: false });

function monta(estadoPartida) {
  const CAL = kv(); const chamadas = [];
  globalThis.fetch = async (u) => {
    chamadas.push(String(u).replace('https://api.api-futebol.com.br/v1', ''));
    const url = String(u);
    const d = url.includes('/tabela') ? TAB : url.includes('/partidas/proximas') ? PROX : url.includes('/partidas/777') ? estadoPartida() : {};
    return { ok: true, status: 200, json: async () => d };
  };
  return { env: { CAL, API_FUTEBOL_KEY: 'k', API_FUTEBOL_LIMITE: '500' }, CAL, chamadas };
}

test('jogo inteiro: começo, gol, intervalo, gol sofrido e fim — cada um uma vez', async () => {
  let estado = partida({ periodo: 'nao-iniciada', status: 'agendada' });
  const a = monta(() => estado);
  await a.CAL.put('fut:gente', JSON.stringify({ henrique: 'palmeiras', lia: 'palmeiras', caio: 'flamengo' }));
  const enviadas = [];
  const send = async (env, quem, msg) => enviadas.push({ quem, title: msg.title, body: msg.body, tag: msg.tag });
  let t = INICIO - 5 * 60e3;

  let r = await rodaAoVivo(a.env, t, send);
  assert.equal(r.motivo, undefined, JSON.stringify(r));
  assert.equal(enviadas.length, 0, 'antes de começar, nada é dito');

  t += 6 * 60e3; estado = partida({ periodo: 'primeiro-tempo' });
  await rodaAoVivo(a.env, t, send);
  assert.equal(enviadas.filter((x) => /Começou/.test(x.title)).length, 2, 'avisou as duas pessoas do Palmeiras');
  assert.ok(!enviadas.some((x) => x.quem === 'caio'), 'quem torce para outro time não recebe');

  t += 10 * 60e3; estado = partida({ periodo: 'primeiro-tempo', placar_mandante: 1, gols: { mandante: [gol('Vitor Roque', '18:40')], visitante: [] } });
  await rodaAoVivo(a.env, t, send);
  const g = enviadas.filter((x) => /GOL DO PALMEIRAS/.test(x.title));
  assert.equal(g.length, 2); assert.match(g[0].body, /Vitor Roque/);

  t += 10 * 60e3;              // consulta de novo sem novidade: não repete o gol
  await rodaAoVivo(a.env, t, send);
  assert.equal(enviadas.filter((x) => /GOL DO PALMEIRAS/.test(x.title)).length, 2, 'o gol não foi repetido');

  t += 10 * 60e3; estado = partida({ periodo: 'intervalo', placar_mandante: 1, gols: { mandante: [gol('Vitor Roque', '18:40')], visitante: [] } });
  await rodaAoVivo(a.env, t, send);
  assert.equal(enviadas.filter((x) => /Intervalo/.test(x.title)).length, 2);

  t += 20 * 60e3; estado = partida({ periodo: 'segundo-tempo', placar_mandante: 1, placar_visitante: 1, gols: { mandante: [gol('Vitor Roque', '18:40')], visitante: [gol('Hulk', '60:00')] } });
  await rodaAoVivo(a.env, t, send);
  assert.equal(enviadas.filter((x) => /Palmeiras 1 x 1/.test(x.title)).length, 2, 'avisou o gol sofrido');

  t += 20 * 60e3; estado = partida({ periodo: 'fim-de-jogo', status: 'finalizado', placar_mandante: 2, placar_visitante: 1, gols: { mandante: [gol('Vitor Roque', '18:40'), gol('Estêvão', '88:00')], visitante: [gol('Hulk', '60:00')] } });
  await rodaAoVivo(a.env, t, send);
  const fim = enviadas.filter((x) => /Vitória/.test(x.title));
  assert.equal(fim.length, 2, 'a vitória foi avisada');
  assert.match(fim[0].body, /45 pontos/, 'a mensagem traz a tabela de verdade');
  assert.match(fim[0].body, /4 pontos do líder/);

  const antes = enviadas.length;
  t += 30 * 60e3; await rodaAoVivo(a.env, t, send);
  t += 2 * 3600e3; await rodaAoVivo(a.env, t, send);
  assert.equal(enviadas.length, antes, 'depois do fim, o Lembra cala a boca sobre esse jogo');

  const cena = await cenaDoTime(a.env, 'palmeiras', t);
  assert.equal(cena.tipo, 'fim'); assert.equal(cena.meu, 2); assert.equal(cena.dele, 1);
  assert.equal(await cenaDoTime(a.env, 'palmeiras', t + 7 * 3600e3), null, 'a reação na tela não fica para sempre');
  assert.equal(await cenaDoTime(a.env, 'flamengo', t), null);
});

test('não chama a API sem ninguém torcendo, nem sem chave', async () => {
  const a = monta(() => partida({}));
  assert.equal((await rodaAoVivo(a.env, INICIO, async () => {})).motivo, 'ninguem-segue');
  assert.equal(a.chamadas.length, 0);
  const b = monta(() => partida({}));
  await b.CAL.put('fut:gente', JSON.stringify({ x: 'palmeiras' }));
  assert.equal((await rodaAoVivo({ CAL: b.CAL }, INICIO, async () => {})).motivo, 'sem-chave');
  assert.equal(b.chamadas.length, 0);
});

test('uma consulta serve para muita gente', async () => {
  let estado = partida({ periodo: 'primeiro-tempo' });
  const a = monta(() => estado);
  const gente = {}; for (let i = 0; i < 50; i++) gente['u' + i] = 'palmeiras';
  await a.CAL.put('fut:gente', JSON.stringify(gente));
  const enviadas = [];
  await rodaAoVivo(a.env, INICIO + 60e3, async (env, quem) => enviadas.push(quem));
  const consultasDaPartida = a.chamadas.filter((u) => u.includes('/partidas/777')).length;
  assert.equal(consultasDaPartida, 1, `consultou ${consultasDaPartida} vezes para 50 pessoas`);
  assert.equal(enviadas.length, 40, 'teto de mensagens por rodada respeitado');
});

test('API fora do ar não quebra nada e não inventa resultado', async () => {
  const CAL = kv(); globalThis.fetch = async () => { throw new Error('rede caiu'); };
  await CAL.put('fut:gente', JSON.stringify({ x: 'palmeiras' }));
  const r = await rodaAoVivo({ CAL, API_FUTEBOL_KEY: 'k' }, INICIO, async () => { throw new Error('não devia enviar'); });
  assert.ok(r.motivo === 'nenhum-jogo-agora' || r.detalhe, JSON.stringify(r));
});

test('antes do jogo: véspera, dia e pouco antes — um aviso por vez, e nunca de madrugada', async () => {
  const { rodaAntes } = await import('../src/fut-motor.js');
  const CAL = kv();
  globalThis.fetch = async (u) => ({ ok: true, status: 200, json: async () => (String(u).includes('/tabela') ? TAB : PROX) });
  const env = { CAL, API_FUTEBOL_KEY: 'k', API_FUTEBOL_LIMITE: '500' };
  await CAL.put('fut:gente', JSON.stringify({ henrique: 'palmeiras' }));
  await CAL.put('futv:prox:56', JSON.stringify({ at: INICIO, lista: [{ id: 777, at: INICIO, casa: 'Palmeiras', fora: 'Atlético-MG', casaId: 56, foraId: 30, camp: 'Brasileirão', estadio: 'Allianz Parque' }] }));
  const avisos = [];
  const send = async (e, quem, msg) => avisos.push(msg);

  await rodaAntes(env, INICIO - 26 * 3600e3, send);        // véspera, de tarde
  await rodaAntes(env, INICIO - 11 * 3600e3, send);        // no dia, de manhã
  await rodaAntes(env, INICIO - 90 * 60e3, send);          // pouco antes
  const tipos = avisos.map((a) => a.title);
  assert.ok(tipos.some((t) => /Amanhã tem jogo/.test(t)), JSON.stringify(tipos));
  assert.ok(tipos.some((t) => /Hoje tem jogo/.test(t)), JSON.stringify(tipos));
  assert.ok(tipos.some((t) => /Já já começa/.test(t)), JSON.stringify(tipos));
  assert.match(avisos[0].body, /Allianz Parque/, 'fala o estádio que a API informou');
  assert.match(avisos[0].body, /Brasileirão/);

  const antes = avisos.length;
  await rodaAntes(env, INICIO - 90 * 60e3 + 60e3, send);
  assert.equal(avisos.length, antes, 'não repete o mesmo aviso');

  const madrugada = Date.parse('2026-11-26T03:00:00-0300');
  await CAL.put('futv:antes:henrique', JSON.stringify({}));
  const n0 = avisos.length;
  await rodaAntes(env, madrugada, send);
  assert.equal(avisos.length, n0, 'de madrugada o Lembra não acorda ninguém');
});
