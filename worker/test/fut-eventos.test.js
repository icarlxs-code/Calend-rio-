/* O motor de acompanhamento do jogo: só pode avisar o que realmente aconteceu, uma vez só. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { retrato, novidades, fala, situacao } from '../src/fut-eventos.js';

const PARTIDA = (o = {}) => ({
  partida_id: 27650,
  campeonato: { campeonato_id: 10, nome: 'Campeonato Brasileiro', nome_popular: 'Brasileirão', rodada_atual: { nome: '18ª Rodada' } },
  time_mandante: { time_id: 30, nome_popular: 'Atlético-MG', sigla: 'CAM' },
  time_visitante: { time_id: 56, nome_popular: 'Palmeiras', sigla: 'PAL' },
  placar_mandante: 0, placar_visitante: 0, disputa_penalti: false,
  status: 'andamento', periodo: 'primeiro-tempo', estadio: { nome_popular: 'Arena MRV' },
  gols: { mandante: [], visitante: [] }, cartoes: { amarelo: { mandante: [], visitante: [] }, vermelho: { mandante: [], visitante: [] } },
  ...o,
});
const gol = (nome, minuto, extra = {}) => ({ atleta: { atleta_id: nome.length, nome_popular: nome }, minuto, periodo: '1º tempo', periodo_slug: 'primeiro-tempo', penalti: false, gol_contra: false, ...extra });
const MEU = 56; // Palmeiras (visitante)

test('retrato: entende lados, placar e gols', () => {
  const r = retrato(PARTIDA({ placar_mandante: 1, gols: { mandante: [gol('Hulk', '10:00')], visitante: [] } }), MEU);
  assert.equal(r.lado, 'visitante'); assert.equal(r.pc, 1); assert.equal(r.pf, 0);
  assert.equal(r.gols.mandante.length, 1); assert.equal(r.gols.mandante[0].autor, 'Hulk');
  assert.equal(retrato(PARTIDA(), 30).lado, 'mandante');
  assert.equal(retrato(PARTIDA(), 999).lado, '', 'time que não joga essa partida não vira lado');
});

test('gol do meu time: detecta uma vez só e sabe que abriu o placar', () => {
  const a = retrato(PARTIDA(), MEU);
  const b = retrato(PARTIDA({ placar_visitante: 1, gols: { mandante: [], visitante: [gol('Vitor Roque', '22:10')] } }), MEU);
  const ev = novidades(a, b);
  assert.equal(ev.length, 1); assert.equal(ev[0].tipo, 'gol'); assert.equal(ev[0].ctx, 'abriu'); assert.equal(ev[0].autor, 'Vitor Roque');
  assert.deepEqual(novidades(b, b), [], 'consultar de novo não repete o gol');
});

test('empate, virada e ampliação saem com o contexto certo', () => {
  const p1 = PARTIDA({ placar_mandante: 1, gols: { mandante: [gol('Hulk', '10:00')], visitante: [] } });
  const p2 = PARTIDA({ placar_mandante: 1, placar_visitante: 1, gols: { mandante: [gol('Hulk', '10:00')], visitante: [gol('Flaco', '30:00')] } });
  const p3 = PARTIDA({ placar_mandante: 1, placar_visitante: 2, gols: { mandante: [gol('Hulk', '10:00')], visitante: [gol('Flaco', '30:00'), gol('Estêvão', '80:00')] } });
  const p4 = PARTIDA({ placar_mandante: 1, placar_visitante: 3, gols: { mandante: [gol('Hulk', '10:00')], visitante: [gol('Flaco', '30:00'), gol('Estêvão', '80:00'), gol('Raphael Veiga', '90:00')] } });
  assert.equal(novidades(retrato(p1, MEU), retrato(p2, MEU))[0].ctx, 'empate');
  assert.equal(novidades(retrato(p2, MEU), retrato(p3, MEU))[0].ctx, 'virada');
  assert.equal(novidades(retrato(p3, MEU), retrato(p4, MEU))[0].ctx, 'amplia');
});

test('gol sofrido, pênalti, gol contra e expulsão', () => {
  const a = retrato(PARTIDA(), MEU);
  const b = retrato(PARTIDA({ placar_mandante: 1, gols: { mandante: [gol('Paulinho', '12:00', { penalti: true })], visitante: [] },
    cartoes: { amarelo: { mandante: [], visitante: [] }, vermelho: { mandante: [{ cartao_id: 1, atleta: { nome_popular: 'Zé' }, minuto: '40:00', periodo_slug: 'primeiro-tempo' }], visitante: [] } } }), MEU);
  const ev = novidades(a, b);
  assert.equal(ev.find((x) => x.tipo === 'gol-sofrido').penalti, true);
  const v = ev.find((x) => x.tipo === 'vermelho');
  assert.equal(v.meuTime, false, 'o vermelho foi do adversário');
  const c = retrato(PARTIDA({ placar_visitante: 1, gols: { mandante: [], visitante: [gol('Fulano', '50:00', { gol_contra: true })] } }), MEU);
  assert.equal(novidades(a, c)[0].contra, true);
});

test('dois gols entre uma consulta e outra: os dois saem, na ordem', () => {
  const a = retrato(PARTIDA(), MEU);
  const b = retrato(PARTIDA({ placar_mandante: 1, placar_visitante: 1, gols: { mandante: [gol('Hulk', '10:00')], visitante: [gol('Flaco', '35:00')] } }), MEU);
  const ev = novidades(a, b);
  assert.deepEqual(ev.map((x) => x.tipo), ['gol-sofrido', 'gol']);
  assert.deepEqual(ev.map((x) => [x.meu, x.dele]), [[0, 1], [1, 1]], 'o placar de cada momento é o certo');
});

test('intervalo, fim de jogo e começo saem uma vez', () => {
  const t1 = retrato(PARTIDA({ periodo: 'nao-iniciada', status: 'agendada' }), MEU);
  assert.equal(novidades(t1, retrato(PARTIDA({ periodo: 'primeiro-tempo' }), MEU))[0].tipo, 'comecou');
  const i = retrato(PARTIDA({ periodo: 'intervalo' }), MEU);
  assert.equal(novidades(retrato(PARTIDA(), MEU), i)[0].tipo, 'intervalo');
  const f = retrato(PARTIDA({ periodo: 'fim-de-jogo', placar_visitante: 2, gols: { mandante: [], visitante: [gol('A', '10:00'), gol('B', '20:00')] } }), MEU);
  const ev = novidades(i, f);
  assert.ok(ev.some((x) => x.tipo === 'fim'));
  assert.deepEqual(novidades(f, f), [], 'depois do fim, nada mais é dito');
});

test('as falas são verdadeiras, variadas e nunca inventam jogador', () => {
  const ev = novidades(retrato(PARTIDA(), MEU), retrato(PARTIDA({ placar_visitante: 1, gols: { mandante: [], visitante: [gol('Vitor Roque', '22:10')] } }), MEU))[0];
  const m = fala(ev, { time: 'Palmeiras', quem: 'u1' });
  assert.match(m.body, /Vitor Roque/); assert.match(m.body, /22'/); assert.match(m.title, /GOL DO PALMEIRAS/);
  const semAutor = fala({ ...ev, autor: '' }, { time: 'Palmeiras', quem: 'u1' });
  assert.ok(!/undefined|null/.test(semAutor.body) && !/Gol do \b/.test(semAutor.body), semAutor.body);
  const vistas = new Set();
  for (let i = 0; i < 40; i++) vistas.add(fala({ ...ev, k: 'g:' + i }, { time: 'Palmeiras', quem: 'u' + i }).body);
  assert.ok(vistas.size >= 3, `pouca variedade: ${vistas.size}`);
  const fim = fala({ tipo: 'fim', meu: 2, dele: 1, k: 'f:1' }, { time: 'Palmeiras', tabela: { pontos: 45, posicao: 3, doLider: 4 } });
  assert.match(fim.body, /45 pontos/); assert.match(fim.body, /3º lugar/); assert.match(fim.body, /4 pontos do líder/);
  const derrota = fala({ tipo: 'fim', meu: 1, dele: 2, k: 'f:2' }, { time: 'Palmeiras' });
  assert.match(derrota.title, /Fim de jogo/);
});

test('tabela: posição, pontos e distâncias calculadas de verdade', () => {
  const tab = Array.from({ length: 20 }, (_, i) => ({ posicao: i + 1, pontos: 60 - i * 3, jogos: 30, vitorias: 18 - i, empates: 3, derrotas: i, gols_pro: 40, gols_contra: 20 + i, saldo_gols: 20 - i, time: { time_id: 100 + i, nome_popular: 'T' + i } }));
  const s = situacao(tab, 104);   // 5º lugar, 48 pontos
  assert.equal(s.posicao, 5); assert.equal(s.pontos, 48);
  assert.equal(s.doLider, 12); assert.equal(s.doG4, 3, 'faltam 3 pontos para o 4º');
  assert.equal(s.noG4, false); assert.equal(s.naZona, false);
  const z = situacao(tab, 118);   // 19º: na zona
  assert.equal(z.naZona, true);
  assert.equal(situacao(tab, 100).lider, true);
  assert.equal(situacao([], 100), null); assert.equal(situacao(tab, 999), null);
});
