/* Segunda fonte do futebol: a ESPN (pública, grátis e sem chave).
   Entra quando a API-Futebol está sem chave, sem cota do dia ou falhando.
   Tudo sai no MESMO formato da API-Futebol: o motor, as falas e a proteção contra aviso repetido são os mesmos.
   Regras: nenhuma chave, nada inventado (se a fonte não trouxe, não existe), tudo em cache e poucas chamadas por rodada
   (o plano grátis do Cloudflare permite no máximo 50 chamadas externas por execução). */
import { porTime, timeDoNome } from '../../functions/times.js';

const BASE = 'https://site.api.espn.com/apis/site/v2/sports/soccer';
const BASE_TAB = 'https://site.api.espn.com/apis/v2/sports/soccer';
const H = 3600e3, BR = -3 * H;
/* campeonatos que os times do app jogam (a ESPN cobre Série A, B e C, Copa do Brasil e as copas da Conmebol) */
export const LIGAS = ['bra.1', 'bra.2', 'bra.3', 'bra.copa_do_brazil', 'conmebol.libertadores', 'conmebol.sudamericana'];
const LIGAS_TABELA = ['bra.1', 'bra.2', 'bra.3'];
export const NOME_LIGA = { 'bra.1': 'Brasileirão', 'bra.2': 'Série B', 'bra.3': 'Série C', 'bra.copa_do_brazil': 'Copa do Brasil', 'conmebol.libertadores': 'Libertadores', 'conmebol.sudamericana': 'Sul-Americana' };
const ligaOk = (l) => LIGAS.includes(l);

async function busca(url, ms = 8000) {
  const ctrl = new AbortController(), t = setTimeout(() => ctrl.abort(), ms);
  try {
    const r = await fetch(url, { signal: ctrl.signal, headers: { accept: 'application/json' } });
    if (!r || !r.ok) return { erro: `http-${r ? r.status : 0}` };
    const dados = await r.json();
    return dados && typeof dados === 'object' ? { dados } : { erro: 'vazio' };
  } catch (e) { return { erro: e && e.name === 'AbortError' ? 'demorou' : 'rede' }; } finally { clearTimeout(t); }
}

/* ---------- times: ESPN → clube do app (só quando o nome bate certinho; sigla sozinha nunca decide) ---------- */
/** "BRA" é Bragantino na ESPN e Brasiliense no app; "Botafogo" não pode virar Botafogo-PB/SP: por isso só nome e apelido exatos */
export function clubeDoTime(t) {
  if (!t) return null;
  for (const n of [t.displayName, t.shortDisplayName, t.location, t.name]) { const id = n ? timeDoNome(n) : null; if (id) return id; }
  return null;
}
const nomeDe = (t) => { const id = clubeDoTime(t); return id ? porTime(id).nome : String(t?.shortDisplayName || t?.displayName || '').slice(0, 40); };

/* ---------- jogos: o placar do dia de cada campeonato ---------- */
export const diaBR = (ms) => new Date(ms + BR).toISOString().slice(0, 10);
/** um jogo do placar da ESPN, já com o clube do app de cada lado */
export function jogoDe(ev, liga) {
  const c = ev && Array.isArray(ev.competitions) ? ev.competitions[0] : null;
  const casa = c?.competitors?.find((x) => x.homeAway === 'home'), fora = c?.competitors?.find((x) => x.homeAway === 'away');
  const at = Date.parse(ev?.date || '');
  if (!casa?.team?.id || !fora?.team?.id || !Number.isFinite(at)) return null;
  return {
    id: String(ev.id), liga, at, casaId: Number(casa.team.id), foraId: Number(fora.team.id),
    casa: nomeDe(casa.team), fora: nomeDe(fora.team), casaApp: clubeDoTime(casa.team), foraApp: clubeDoTime(fora.team),
    camp: NOME_LIGA[liga] || '', estadio: String(c.venue?.fullName || '').slice(0, 60), status: String(c.status?.type?.name || ''),
  };
}
/** os dias que valem a pena ter guardados agora (ontem só de madrugada, para jogo que passou da meia-noite) */
export function diasDaAgenda(now) {
  const dias = [0, 1, 2].map((i) => diaBR(now + i * 864e5));
  if (new Date(now + BR).getUTCHours() < 4) dias.unshift(diaBR(now - 864e5));
  return dias;
}
/**
 * Agenda de todos os campeonatos para hoje, amanhã e depois (para o "ao vivo" e para os avisos de antes do jogo).
 * Cada dia de cada campeonato é guardado e só é buscado de novo quando fica velho; no máximo `max` buscas por rodada.
 */
export async function agendaEspn(env, now, { max = 6, orc = { buscas: 0 } } = {}) {
  const jogos = new Map();
  // campeonato por campeonato (Série A dos 3 dias primeiro): com poucas buscas por rodada, o principal fica completo antes
  for (const liga of LIGAS) {
    for (const dia of diasDaAgenda(now)) {
      const k = `futespn:dia:${liga}:${dia}`;
      let g = await env.CAL.get(k, 'json');
      const validade = dia === diaBR(now) ? 2 * H : 6 * H;
      if ((!g || g.at < now - validade) && orc.buscas < max) {
        orc.buscas++;
        const r = await busca(`${BASE}/${liga}/scoreboard?dates=${dia.replace(/-/g, '')}`);
        if (Array.isArray(r.dados?.events)) {
          g = { at: now, jogos: r.dados.events.map((e) => jogoDe(e, liga)).filter(Boolean) };
          await env.CAL.put(k, JSON.stringify(g), { expirationTtl: 3 * 86400 });
        }
      }
      for (const j of g?.jogos || []) jogos.set(j.id, j);
    }
  }
  return [...jogos.values()].sort((a, b) => a.at - b.at);
}

/* ---------- a partida ao vivo, no formato de /v1/partidas/{id} da API-Futebol ---------- */
const minutoDe = (v) => { const m = /^(\d+)'?(?:\s*\+\s*(\d+)'?)?/.exec(String(v || '').trim()); return m ? `${m[1].padStart(2, '0')}${m[2] ? `+${m[2]}` : ''}` : ''; };
const periodoSlug = (n) => (n === 1 ? 'primeiro-tempo' : n === 2 ? 'segundo-tempo' : 'prorrogacao');
/** de "STATUS_HALFTIME" e companhia para o período da API-Futebol */
export function periodoDe(status) {
  const st = status?.type || {}, n = String(st.name || ''), per = Number(status?.period) || 0;
  if (st.state === 'pre' || /SCHEDULED/.test(n)) return 'nao-iniciada';
  if (st.state === 'post') return st.completed ? 'fim-de-jogo' : 'adiada';
  if (/HALFTIME/.test(n)) return 'intervalo';
  if (/SHOOTOUT|PENALT/.test(n)) return 'disputa-penalti';
  return per >= 3 ? 'prorrogacao' : per === 2 ? 'segundo-tempo' : 'primeiro-tempo';
}
/** resumo da ESPN → partida da API-Futebol. O placar oficial manda: a lista de gols é conferida contra ele. */
export function partidaDe(sum, liga) {
  const comp = sum?.header?.competitions?.[0];
  const casa = comp?.competitors?.find((x) => x.homeAway === 'home'), fora = comp?.competitors?.find((x) => x.homeAway === 'away');
  if (!comp || !casa?.team?.id || !fora?.team?.id) return null;
  const idCasa = String(casa.team.id), pc = Number(casa.score) || 0, pf = Number(fora.score) || 0;
  const lado = (t) => (String(t?.id) === idCasa ? 'mandante' : 'visitante');
  const outro = (l) => (l === 'mandante' ? 'visitante' : 'mandante');
  const gols = { mandante: [], visitante: [] }, verm = { mandante: [], visitante: [] };
  for (const e of Array.isArray(sum.keyEvents) ? sum.keyEvents : []) {
    const tipo = String(e.type?.type || e.type?.text || '').toLowerCase(), quem = e.participants?.[0]?.athlete || {};
    const base = { minuto: minutoDe(e.clock?.displayValue), periodo_slug: periodoSlug(Number(e.period?.number) || 1), atleta: quem.id || quem.displayName ? { atleta_id: quem.id || '', nome_popular: String(quem.displayName || '').slice(0, 40) } : null };
    if (/red-card|red card|yellow-red/.test(tipo) && e.team) { verm[lado(e.team)].push({ ...base, cartao_id: String(e.id || '') }); continue; }
    if (!e.scoringPlay || /miss|saved|disallow/.test(tipo) || !e.team) continue;
    const contra = /own/.test(tipo);
    gols[lado(e.team)].push({ ...base, penalti: /penalty/.test(tipo), gol_contra: contra });
  }
  // gol contra: a ESPN pode listar no time de quem fez ou no que ganhou o gol; vale a leitura que bate com o placar
  const conta = (troca) => ['mandante', 'visitante'].map((l) => gols[l].filter((g) => !g.gol_contra).length + gols[troca ? outro(l) : l].filter((g) => g.gol_contra).length);
  const erro = ([m, v]) => Math.abs(m - pc) + Math.abs(v - pf);
  if (erro(conta(true)) < erro(conta(false))) {
    const om = gols.mandante.filter((g) => g.gol_contra), ov = gols.visitante.filter((g) => g.gol_contra);
    gols.mandante = [...gols.mandante.filter((g) => !g.gol_contra), ...ov]; gols.visitante = [...gols.visitante.filter((g) => !g.gol_contra), ...om];
  }
  // o placar é a verdade: gol a mais na lista sai; gol a menos entra sem autor (nada de inventar jogador)
  for (const [l, alvo] of [['mandante', pc], ['visitante', pf]]) {
    gols[l] = gols[l].sort((a, b) => a.minuto.localeCompare(b.minuto)).slice(0, alvo);
    for (let i = gols[l].length; i < alvo; i++) gols[l].push({ minuto: '', periodo_slug: '', atleta: { atleta_id: `sem-autor-${i + 1}`, nome_popular: '' }, penalti: false, gol_contra: false });
  }
  const pen = (x) => Number(x?.shootoutScore);
  return {
    partida_id: `espn-${comp.id || sum.header.id}`, fonte: 'espn', liga,
    time_mandante: { time_id: Number(idCasa), nome_popular: nomeDe(casa.team) },
    time_visitante: { time_id: Number(fora.team.id), nome_popular: nomeDe(fora.team) },
    placar_mandante: pc, placar_visitante: pf,
    periodo: periodoDe(comp.status), status: String(comp.status?.type?.name || ''),
    campeonato: { campeonato_id: 0, nome_popular: NOME_LIGA[liga] || '', slug: liga },
    estadio: { nome_popular: String(sum.gameInfo?.venue?.fullName || comp.venue?.fullName || '').slice(0, 60) },
    gols, cartoes: { vermelho: verm },
    disputa_penalti: Number.isFinite(pen(casa)) && Number.isFinite(pen(fora)) ? { placar_penalti_mandante: pen(casa), placar_penalti_visitante: pen(fora) } : false,
  };
}
/** consulta a partida (sem cache: só o motor chama, e ele já controla o intervalo) */
export async function detalheEspn(jogo) {
  if (!jogo?.id || !ligaOk(jogo.liga)) return { erro: 'sem-jogo' };
  const r = await busca(`${BASE}/${jogo.liga}/summary?event=${encodeURIComponent(jogo.id)}`);
  if (!r.dados) return r;
  const p = partidaDe(r.dados, jogo.liga);
  return p ? { dados: p } : { erro: 'formato' };
}

/* ---------- tabela (só campeonato de pontos corridos), no formato de /v1/campeonatos/{id}/tabela ---------- */
export function tabelaDe(dados) {
  const ent = dados?.children?.[0]?.standings?.entries || dados?.standings?.entries || [];
  const v = (e, n) => Number((e.stats || []).find((s) => s.name === n)?.value) || 0;
  return ent.map((e) => ({
    posicao: v(e, 'rank'), pontos: v(e, 'points'), jogos: v(e, 'gamesPlayed'), vitorias: v(e, 'wins'), empates: v(e, 'ties'), derrotas: v(e, 'losses'),
    gols_pro: v(e, 'pointsFor'), gols_contra: v(e, 'pointsAgainst'), saldo_gols: v(e, 'pointDifferential'),
    time: { time_id: Number(e.team?.id) || 0, nome_popular: nomeDe(e.team) },
  })).filter((l) => l.time.time_id).sort((a, b) => (a.posicao || 99) - (b.posicao || 99));
}
export async function tabelaEspn(env, liga, { now = Date.now() } = {}) {
  if (!LIGAS_TABELA.includes(liga)) return null;
  const k = `futespn:tab:${liga}`, g = await env.CAL.get(k, 'json');
  if (g && g.at > now - 2 * H) return g.tab;
  const r = await busca(`${BASE_TAB}/${liga}/standings`);
  const tab = r.dados ? tabelaDe(r.dados) : [];
  if (tab.length) { await env.CAL.put(k, JSON.stringify({ at: now, tab }), { expirationTtl: 2 * 86400 }); return tab; }
  return g?.tab || null;
}

/* ---------- próximos jogos de um time (tela do app): a agenda do time no campeonato dele ---------- */
/** clube do app → time e campeonato na ESPN (guardado por 7 dias; 3 chamadas) */
export async function mapaEspn(env, { now = Date.now() } = {}) {
  const k = 'futespn:times', g = await env.CAL.get(k, 'json');
  if (g && g.at > now - 7 * 864e5 && Object.keys(g.app || {}).length) return g.app;
  const app = {}; let leu = false;
  for (const liga of LIGAS_TABELA) {
    const r = await busca(`${BASE}/${liga}/teams`);
    const ts = r.dados?.sports?.[0]?.leagues?.[0]?.teams || [];
    if (ts.length) leu = true;
    for (const { team: t } of ts) { const id = clubeDoTime(t); if (id && !app[id]) app[id] = { id: Number(t.id), liga }; }
  }
  if (leu) { await env.CAL.put(k, JSON.stringify({ at: now, app }), { expirationTtl: 30 * 86400 }); return app; }
  return g?.app || {};
}
/** os próximos jogos do time do app, no formato da tela ({ id, at, c, f, casa, fora, comp }) */
export async function proximosEspn(env, timeApp, { now = Date.now() } = {}) {
  if (!porTime(timeApp)) return [];
  const m = (await mapaEspn(env, { now }))[timeApp];
  let lista = [];
  if (m) {
    const k = `futespn:prox:${m.id}`, g = await env.CAL.get(k, 'json');
    if (g && g.at > now - 6 * H) lista = g.jogos;
    else {
      const r = await busca(`${BASE}/${m.liga}/teams/${m.id}/schedule?fixture=true`);
      if (Array.isArray(r.dados?.events)) { lista = r.dados.events.map((e) => jogoDe(e, m.liga)).filter(Boolean); await env.CAL.put(k, JSON.stringify({ at: now, jogos: lista }), { expirationTtl: 2 * 86400 }); } else lista = g?.jogos || [];
    }
  }
  // copas (Copa do Brasil, Libertadores…) que já estão na agenda dos próximos dias
  for (const dia of diasDaAgenda(now)) for (const liga of LIGAS) for (const j of ((await env.CAL.get(`futespn:dia:${liga}:${dia}`, 'json'))?.jogos || [])) if (!lista.some((x) => x.id === j.id)) lista.push(j);
  return lista.filter((j) => (j.casaApp === timeApp || j.foraApp === timeApp) && j.at > now - 2 * H && !/FINAL|FULL_TIME|POSTPONED|CANCEL/.test(j.status))
    .sort((a, b) => a.at - b.at).slice(0, 3)
    .map((j) => ({ id: `espn-${j.id}`, at: j.at, c: j.casaApp || '', f: j.foraApp || '', casa: j.casa, fora: j.fora, comp: j.camp }));
}
