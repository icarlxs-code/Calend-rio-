/* Segunda fonte do futebol (ESPN, grátis e sem chave): o jogo inteiro sem a API-Futebol, as duas torcidas,
   troca de fonte no meio do jogo sem aviso repetido, e os avisos de antes do jogo. Tudo sem internet (respostas gravadas). */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rodaAoVivo, rodaAntes, cenaDoTime, chaveJogo } from '../src/fut-motor.js';
import { partidaDe, jogoDe, clubeDoTime, tabelaDe, periodoDe, proximosEspn } from '../src/fut-espn.js';

const kv = () => { const m = new Map(); return { m, get: async (k, t) => (m.has(k) ? (t === 'json' ? JSON.parse(m.get(k)) : m.get(k)) : null), put: async (k, v) => m.set(k, v), delete: async (k) => m.delete(k) }; };
const INICIO = Date.parse('2026-11-29T16:00:00-0300');           // Coritiba x Flamengo, Couto Pereira
const time = (id, nome, abbr) => ({ id: String(id), displayName: nome, shortDisplayName: nome, location: nome, abbreviation: abbr });
const CFC = time(3456, 'Coritiba', 'CFC'), FLA = time(819, 'Flamengo', 'FLA');
const evento = { id: '401841333', date: '2026-11-29T19:00Z', competitions: [{ venue: { fullName: 'Couto Pereira' }, status: { type: { name: 'STATUS_SCHEDULED', state: 'pre' } }, competitors: [{ homeAway: 'home', team: CFC }, { homeAway: 'away', team: FLA }] }] };
const ke = (tipo, min, per, t, nome, extra = {}) => ({ id: `${tipo}${min}`, type: { type: tipo }, clock: { displayValue: min }, period: { number: per }, team: t, participants: nome ? [{ athlete: { id: nome.length * 7, displayName: nome } }] : [], scoringPlay: /goal|penalty---scored/.test(tipo), ...extra });
const resumo = ({ state = 'in', name = 'STATUS_FIRST_HALF', period = 1, pc = 0, pf = 0, eventos = [] }) => ({
  header: { id: '401841333', competitions: [{ id: '401841333', status: { period, type: { name, state, completed: state === 'post' } }, competitors: [{ homeAway: 'home', team: CFC, score: String(pc) }, { homeAway: 'away', team: FLA, score: String(pf) }] }] },
  gameInfo: { venue: { fullName: 'Couto Pereira' } }, keyEvents: eventos,
});
const TABELA = { children: [{ standings: { entries: [
  { team: FLA, stats: [{ name: 'rank', value: 1 }, { name: 'points', value: 83 }, { name: 'gamesPlayed', value: 37 }] },
  { team: time(2029, 'Palmeiras', 'PAL'), stats: [{ name: 'rank', value: 2 }, { name: 'points', value: 74 }] },
  { team: CFC, stats: [{ name: 'rank', value: 15 }, { name: 'points', value: 40 }] },
] } }] };

function monta(estado, { apiFutebol = null } = {}) {
  const CAL = kv(), chamadas = [];
  globalThis.fetch = async (u) => {
    const url = String(u); chamadas.push(url);
    let d = {};
    if (url.includes('api-futebol') && apiFutebol) d = apiFutebol(url);
    else if (url.includes('/scoreboard?dates=20261129') && url.includes('/bra.1/')) d = { events: [evento] };
    else if (url.includes('/scoreboard')) d = { events: [] };
    else if (url.includes('/summary?event=401841333')) d = estado();
    else if (url.includes('/standings')) d = TABELA;
    if (d === null) return { ok: false, status: 429, json: async () => ({}) };
    return { ok: true, status: 200, json: async () => d };
  };
  return { CAL, chamadas };
}
const envio = () => { const L = []; return { L, send: async (env, quem, msg) => L.push({ quem, ...msg }) }; };

test('ESPN → formato da API: placar manda, gol contra no lado certo, gol sem autor não inventa jogador', () => {
  // 1 x 1: o gol contra veio listado no Flamengo (time de quem fez), mas foi do Coritiba
  const p = partidaDe(resumo({ pc: 1, pf: 1, period: 2, name: 'STATUS_SECOND_HALF', eventos: [
    ke('goal', "12'", 1, FLA, 'Pedro'), ke('own-goal', "40'", 1, FLA, 'Zagueiro do Flamengo'), ke('yellow-card', "41'", 1, CFC, 'X'), ke('red-card', "70'", 2, CFC, 'Volante'),
  ] }), 'bra.1');
  assert.equal(p.periodo, 'segundo-tempo');
  assert.equal(p.gols.mandante.length, 1, 'o gol contra listado no Flamengo foi para o Coritiba');
  assert.equal(p.gols.mandante[0].gol_contra, true);
  assert.equal(p.gols.visitante.length, 1);
  assert.equal(p.cartoes.vermelho.mandante[0].atleta.nome_popular, 'Volante');
  // 0 x 2 com um gol só na lista: o outro entra sem autor (não inventa jogador); lista maior que o placar é cortada
  const q = partidaDe(resumo({ pf: 2, eventos: [ke('goal', "12'", 1, FLA, 'Pedro')] }), 'bra.1');
  assert.deepEqual(q.gols.visitante.map((g) => g.atleta.nome_popular), ['Pedro', '']);
  assert.equal(partidaDe(resumo({ pf: 0, eventos: [ke('goal', "12'", 1, FLA, 'Pedro')] }), 'bra.1').gols.visitante.length, 0);
  assert.equal(periodoDe({ type: { name: 'STATUS_HALFTIME', state: 'in' } }), 'intervalo');
  assert.equal(periodoDe({ type: { name: 'STATUS_FULL_TIME', state: 'post', completed: true } }), 'fim-de-jogo');
  assert.equal(periodoDe({ type: { name: 'STATUS_POSTPONED', state: 'post', completed: false } }), 'adiada');
});

test('times: nome exato; sigla igual de outro clube ou prefixo nunca casa errado', () => {
  assert.equal(clubeDoTime(time(6079, 'Red Bull Bragantino', 'BRA')), 'bragantino');
  assert.equal(clubeDoTime({ displayName: 'Brasiliense', abbreviation: 'BRA' }), 'brasiliense');
  assert.equal(clubeDoTime(time(6086, 'Botafogo', 'BOT')), 'botafogo');
  assert.equal(clubeDoTime(time(10281, 'Botafogo-SP', 'BOT')), 'botafogosp');
  assert.equal(clubeDoTime({ displayName: 'Operário PR', shortDisplayName: 'Operário PR' }), 'operario');
  assert.equal(clubeDoTime({ displayName: 'Atlético Goianiense' }), 'atleticogo');
  assert.equal(clubeDoTime({ displayName: 'São Bernardo', abbreviation: 'SBE' }), null, 'clube que o app não tem: nada');
  assert.equal(clubeDoTime({ displayName: 'Bota', abbreviation: 'BRA' }), null);
  const j = jogoDe(evento, 'bra.1'); assert.deepEqual([j.casaApp, j.foraApp, j.camp, j.estadio], ['coritiba', 'flamengo', 'Brasileirão', 'Couto Pereira']);
  assert.equal(tabelaDe(TABELA)[0].time.nome_popular, 'Flamengo');
});

test('sem chave da API-Futebol: jogo inteiro pela ESPN, para as DUAS torcidas, cada aviso uma vez, com a tabela no fim', async () => {
  let estado = resumo({ state: 'pre', name: 'STATUS_SCHEDULED', period: 0 });
  const a = monta(() => estado), env = { CAL: a.CAL };
  await a.CAL.put('fut:gente', JSON.stringify({ ana: 'flamengo', bia: 'flamengo', caio: 'coritiba', duda: 'palmeiras' }));
  const { L, send } = envio(); let t = INICIO - 5 * 60e3;
  assert.equal((await rodaAoVivo(env, t, send)).fontes.join(), 'espn');
  assert.equal(L.length, 0);
  t += 6 * 60e3; estado = resumo({});
  await rodaAoVivo(env, t, send);
  assert.deepEqual(L.filter((x) => /Começou/.test(x.title)).map((x) => x.quem).sort(), ['ana', 'bia', 'caio'], 'as duas torcidas, e só elas');
  t += 2 * 60e3; estado = resumo({ pf: 1, eventos: [ke('goal', "18'", 1, FLA, 'Pedro')] });
  await rodaAoVivo(env, t, send);
  const gol = L.filter((x) => /GOL DO FLAMENGO/.test(x.title)); assert.equal(gol.length, 2); assert.match(gol[0].body, /Gol do Pedro! 18'/);
  assert.equal(L.filter((x) => x.quem === 'caio' && /Coritiba 0 x 1/.test(x.title)).length, 1, 'a torcida do Coritiba também sabe do gol sofrido');
  t += 2 * 60e3; await rodaAoVivo(env, t, send);
  assert.equal(L.filter((x) => /GOL DO FLAMENGO/.test(x.title)).length, 2, 'sem novidade, nada repete');
  t += 30 * 60e3; estado = resumo({ name: 'STATUS_HALFTIME', pf: 1, eventos: [ke('goal', "18'", 1, FLA, 'Pedro')] });
  await rodaAoVivo(env, t, send);
  assert.equal(L.filter((x) => /Intervalo/.test(x.title)).length, 3);
  t += 60 * 60e3; estado = resumo({ state: 'post', name: 'STATUS_FULL_TIME', period: 2, pf: 1, eventos: [ke('goal', "18'", 1, FLA, 'Pedro')] });
  await rodaAoVivo(env, t, send);
  const fim = L.filter((x) => x.quem === 'ana' && /Vitória/.test(x.title));
  assert.equal(fim.length, 1); assert.match(fim[0].body, /83 pontos e 1º lugar/, 'tabela de verdade da fonte grátis');
  const n = L.length; t += 30 * 60e3; await rodaAoVivo(env, t, send);
  assert.equal(L.length, n, 'depois do fim, silêncio');
  assert.equal((await cenaDoTime(env, 'flamengo', t)).tipo, 'fim');
  assert.ok(!L.some((x) => x.quem === 'duda'), 'quem torce para outro time não recebe nada');
});

test('API-Futebol cai no meio do jogo: a ESPN assume e o gol já avisado NÃO se repete', async () => {
  const P = { partida_id: 555, data_realizacao_iso: '2026-11-29T16:00:00-0300', time_mandante: { time_id: 30, nome_popular: 'Coritiba' }, time_visitante: { time_id: 5, nome_popular: 'Flamengo' }, campeonato: { campeonato_id: 10, nome_popular: 'Brasileirão' } };
  let apiViva = true;
  const golApi = { atleta: { atleta_id: 9, nome_popular: 'Pedro' }, minuto: '18', periodo_slug: 'primeiro-tempo' };
  const api = (url) => {
    if (url.includes('/tabela')) return [{ posicao: 1, pontos: 80, time: { time_id: 5, nome_popular: 'Flamengo', sigla: 'FLA' } }, { posicao: 15, pontos: 40, time: { time_id: 30, nome_popular: 'Coritiba', sigla: 'CFC' } }];
    if (url.includes('/partidas/proximas')) return { 'campeonato-brasileiro': [P] };
    if (url.includes('/partidas/555')) return apiViva ? { ...P, periodo: 'primeiro-tempo', status: 'andamento', placar_mandante: 0, placar_visitante: 1, gols: { mandante: [], visitante: [golApi] }, cartoes: { vermelho: { mandante: [], visitante: [] } } } : null;
    return {};
  };
  const espn = resumo({ pf: 1, eventos: [ke('goal', "18'", 1, FLA, 'Pedro')] });
  const a = monta(() => espn, { apiFutebol: api }), env = { CAL: a.CAL, API_FUTEBOL_KEY: 'k', API_FUTEBOL_LIMITE: '500' };
  await a.CAL.put('fut:gente', JSON.stringify({ ana: 'flamengo' }));
  const { L, send } = envio(); let t = INICIO + 20 * 60e3;
  const r1 = await rodaAoVivo(env, t, send);
  assert.equal(r1.detalhe.find((d) => d.time === 'flamengo').fonte, 'api');
  assert.equal(L.filter((x) => /GOL DO FLAMENGO/.test(x.title)).length, 1);
  apiViva = false;                                   // a API devolve erro (cota estourada)
  t += 5 * 60e3; const r2 = await rodaAoVivo(env, t, send);
  assert.equal(r2.detalhe.find((d) => d.time === 'flamengo').fonte, 'espn', 'trocou de fonte');
  assert.equal(L.filter((x) => /GOL DO FLAMENGO/.test(x.title)).length, 1, 'o mesmo gol, vindo da outra fonte, não foi avisado de novo');
  // e o próximo gol de verdade, já pela ESPN, chega
  espn.header.competitions[0].competitors[1].score = '2'; espn.keyEvents.push(ke('goal', "50'", 2, FLA, 'Arrascaeta'));
  t += 2 * 60e3; await rodaAoVivo(env, t, send);
  assert.equal(L.filter((x) => /GOL DO FLAMENGO/.test(x.title)).length, 2);
  assert.match(L.at(-1).body, /Arrascaeta/);
});

test('antes do jogo sem chave: véspera às 19h com estádio e campeonato da ESPN; não repete; a tela mostra o próximo jogo', async () => {
  const a = monta(() => ({})), env = { CAL: a.CAL };
  await a.CAL.put('fut:gente', JSON.stringify({ ana: 'flamengo' }));
  const { L, send } = envio();
  // de madrugada as rodadas vão enchendo a agenda guardada (poucas buscas por vez) e ninguém é acordado
  for (let i = 0; i < 4; i++) await rodaAntes(env, Date.parse('2026-11-28T03:00:00-0300') + i * 60e3, send);
  assert.equal(L.length, 0);
  await rodaAntes(env, Date.parse('2026-11-28T19:00:00-0300'), send);
  assert.equal(L.length, 1); assert.match(L[0].title, /Amanhã tem jogo: Flamengo/);
  assert.match(L[0].body, /Flamengo x Coritiba, às 16h\. Brasileirão\. Fora de casa, no Couto Pereira\./);
  await rodaAntes(env, Date.parse('2026-11-28T19:10:00-0300'), send);
  assert.equal(L.length, 1, 'não repete');
  const prox = await proximosEspn(env, 'flamengo', { now: Date.parse('2026-11-28T19:00:00-0300') });
  assert.deepEqual([prox[0].c, prox[0].f, prox[0].fora, prox[0].comp], ['coritiba', 'flamengo', 'Flamengo', 'Brasileirão']);
  assert.equal(chaveJogo({ at: INICIO, casa: 'Coritiba', fora: 'Flamengo' }), '2026-11-29:coritiba:flamengo');
});

test('rota /futebol sem chave: a tela de perfil recebe o próximo jogo pela ESPN; o mascote (de 4 em 4 min) não gasta busca', async () => {
  globalThis.__LEMBRA_FREE_UNTIL = Date.parse('2099-01-01');
  const { handle } = await import('../src/index.js');
  const a = monta(() => ({}));
  const env = { CAL: { ...a.CAL, scan: async (p) => [...a.CAL.m.entries()].filter(([k]) => k.startsWith(p)) }, TEAM: '[]', PROJECT_ID: 'demo', ALLOW_EMULATOR_TOKENS: '1', ALLOWED_ORIGINS: 'https://meulembra.com.br' };
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
  const tok = `${b64({ alg: 'none' })}.${b64({ email: 'ana@teste.local', user_id: 'anaUid0000000001', sub: 'anaUid0000000001', exp: Math.floor(Date.now() / 1000) + 3600 })}.`;
  const call = async (body) => (await handle(new Request('https://w.dev/futebol', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://meulembra.com.br', Authorization: `Bearer ${tok}` }, body: JSON.stringify({ ws: '', ...body }) }), env)).json();
  // agenda do time na ESPN (o que a tela de perfil mostra)
  globalThis.fetch = async (u) => { const url = String(u); a.chamadas.push(url); const d = url.includes('/teams/819/schedule') ? { events: [{ ...evento, date: new Date(Date.now() + 2 * 864e5).toISOString() }] } : url.includes('/bra.1/teams') ? { sports: [{ leagues: [{ teams: [{ team: FLA }, { team: CFC }] }] }] } : {}; return { ok: true, status: 200, json: async () => d }; };
  const r = await call({ ver: true, jogos: true, time: 'flamengo' });
  assert.equal(r.ligado, true);
  assert.equal(r.jogos[0].casa, 'Coritiba'); assert.equal(r.jogos[0].c, 'coritiba'); assert.equal(r.jogos[0].comp, 'Brasileirão');
  const antes = a.chamadas.length;
  await call({ ver: true, time: 'flamengo' });
  assert.equal(a.chamadas.length, antes, 'a pergunta do mascote não busca agenda');
  // a reação do mascote vale sem a chave da API-Futebol (vem do motor com a ESPN)
  await env.CAL.put('futv:cena:flamengo', JSON.stringify({ at: Date.now(), tipo: 'gol', meu: 1, dele: 0 }));
  assert.equal((await call({ ver: true, time: 'flamengo' })).cena.tipo, 'gol');
});

test('campeonatos: quem escolheu só Libertadores não recebe o jogo do Brasileirão; "todos" recebe; antes do jogo também', async () => {
  const { campDe, quer, limpaCamps } = await import('../src/fut-camp.js');
  assert.equal(campDe({ liga: 'bra.1' }), 'brasileirao'); assert.equal(campDe({ camp: 'Copa Libertadores da América' }), 'libertadores');
  assert.equal(campDe({ camp: 'Campeonato Brasileiro Série B' }), 'serieb'); assert.equal(campDe({ comp: 'Paulistão' }), 'estadual'); assert.equal(campDe({ comp: 'Copa do Nordeste' }), 'outro'); assert.equal(campDe({ comp: 'Campeonato Carioca' }), 'estadual');
  assert.ok(quer([], { liga: 'bra.1' })); assert.ok(!quer(['libertadores'], { liga: 'bra.1' })); assert.deepEqual(limpaCamps(['libertadores', 'xyz', 'libertadores']), ['libertadores']);
  let estado = resumo({});
  const a = monta(() => estado), env = { CAL: a.CAL };
  await a.CAL.put('fut:gente', JSON.stringify({ tudo: 'flamengo', soLib: 'flamengo', soBra: 'flamengo' }));
  await a.CAL.put('fut:camps', JSON.stringify({ soLib: ['libertadores'], soBra: ['brasileirao'] }));
  const { L, send } = envio();
  await rodaAoVivo(env, INICIO + 60e3, send);
  assert.deepEqual([...new Set(L.map((x) => x.quem))].sort(), ['soBra', 'tudo'], 'quem quer só Libertadores não recebe o Brasileirão');
  const A = envio();
  for (let i = 0; i < 4; i++) await rodaAntes(env, Date.parse('2026-11-28T03:00:00-0300') + i * 60e3, A.send);
  await rodaAntes(env, Date.parse('2026-11-28T19:00:00-0300'), A.send);
  assert.deepEqual(A.L.map((x) => x.quem).sort(), ['soBra', 'tudo']);
});
