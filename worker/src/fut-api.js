/* Cliente da API-Futebol (api-futebol.com.br). A chave fica SÓ aqui no servidor, como segredo.
   O plano tem limite diário de requisições, então cada chamada é contada e tudo é guardado em cache:
   um jogo é consultado uma vez e o resultado serve para todas as pessoas que torcem para aquele time. */
const BASE = 'https://api.api-futebol.com.br/v1';
export const temChave = (env) => !!env.API_FUTEBOL_KEY;
const dia = (ms) => new Date(ms - 3 * 3600e3).toISOString().slice(0, 10);
/* quantas chamadas por dia o plano aguenta (ajuste pelo segredo API_FUTEBOL_LIMITE) */
const LIMITE = (env) => Math.max(1, Number(env.API_FUTEBOL_LIMITE) || 100);

/** quanto já foi gasto hoje e quanto sobra */
export async function orcamento(env, now = Date.now()) {
  const k = `futapi:gasto:${dia(now)}`;
  const gasto = Number(await env.CAL.get(k)) || 0;
  const esgotou = (await env.CAL.get(`futapi:429:${dia(now)}`)) === '1';
  return { gasto, limite: LIMITE(env), sobra: esgotou ? 0 : Math.max(0, LIMITE(env) - gasto), esgotou };
}
const gasta = async (env, now) => { const k = `futapi:gasto:${dia(now)}`; await env.CAL.put(k, String((Number(await env.CAL.get(k)) || 0) + 1), { expirationTtl: 3 * 86400 }); };

/** uma chamada, com cache e orçamento. `ttl` em segundos; `forca` ignora o cache (mas não o orçamento). */
export async function pega(env, rota, { ttl = 300, now = Date.now(), forca = false } = {}) {
  if (!temChave(env)) return { erro: 'sem-chave' };
  const ck = `futapi:c:${rota}`;
  if (!forca) { const c = await env.CAL.get(ck, 'json'); if (c) return { dados: c, cache: true }; }
  const o = await orcamento(env, now);
  if (!o.sobra) return { erro: 'sem-orcamento', orcamento: o };
  const ctrl = new AbortController(), t = setTimeout(() => ctrl.abort(), 8000);
  try {
    const r = await fetch(`${BASE}${rota}`, { headers: { Authorization: `Bearer ${env.API_FUTEBOL_KEY}` }, signal: ctrl.signal });
    await gasta(env, now);
    if (r.status === 429) { await env.CAL.put(`futapi:429:${dia(now)}`, '1', { expirationTtl: 86400 }); return { erro: 'limite-diario' }; }
    if (r.status === 401 || r.status === 403) return { erro: 'chave-recusada' };
    if (!r.ok) return { erro: `http-${r.status}` };
    const dados = await r.json();
    if (ttl > 0) await env.CAL.put(ck, JSON.stringify(dados), { expirationTtl: Math.max(60, ttl) });
    return { dados };
  } catch (e) { return { erro: String(e && e.name === 'AbortError' ? 'demorou' : e).slice(0, 40) }; } finally { clearTimeout(t); }
}

/* ---------- de que time estamos falando: nome do app → time_id da API ---------- */
const limpa = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
/** monta (e guarda por 7 dias) o mapa sigla/nome → time_id, a partir da tabela do Brasileirão (1 chamada) */
export async function mapaTimes(env, { now = Date.now(), campeonatos = [10, 9] } = {}) {
  const k = 'futapi:times';
  const guardado = await env.CAL.get(k, 'json');
  if (guardado && guardado.at > now - 7 * 864e5) return guardado.mapa;
  const mapa = { ...(guardado?.mapa || {}) };
  for (const c of campeonatos) {
    const r = await pega(env, `/campeonatos/${c}/tabela`, { ttl: 6 * 3600, now });
    for (const l of Array.isArray(r.dados) ? r.dados : []) {
      const t = l.time || {};
      if (t.time_id) { mapa[limpa(t.nome_popular)] = t.time_id; if (t.sigla) mapa[limpa(t.sigla)] = t.time_id; }
    }
    if (Object.keys(mapa).length) break;      // achou numa: não gasta a outra
  }
  if (Object.keys(mapa).length) await env.CAL.put(k, JSON.stringify({ at: now, mapa }), { expirationTtl: 30 * 86400 });
  return mapa;
}
/** o id da API para um time do app (usa nome, sigla e apelidos de functions/times.js) */
export function idDoTime(mapa, clube) {
  if (!clube) return 0;
  const tenta = [clube.nome, clube.sigla, clube.id, ...(clube.ap || [])].map(limpa);
  for (const t of tenta) if (mapa[t]) return mapa[t];
  const chaves = Object.keys(mapa);
  for (const t of tenta) { const achou = chaves.find((k) => k.startsWith(t) || t.startsWith(k)); if (achou && t.length > 3) return mapa[achou]; }
  return 0;
}

export const proximasDoTime = (env, id, o = {}) => pega(env, `/times/${id}/partidas/proximas`, { ttl: 6 * 3600, ...o });
export const anterioresDoTime = (env, id, o = {}) => pega(env, `/times/${id}/partidas/anteriores`, { ttl: 3 * 3600, ...o });
export const partidaDetalhe = (env, id, o = {}) => pega(env, `/partidas/${id}`, { ttl: 45, ...o });
export const tabelaDe = (env, camp, o = {}) => pega(env, `/campeonatos/${camp}/tabela`, { ttl: 2 * 3600, ...o });
export const aoVivoAgora = (env, o = {}) => pega(env, '/ao-vivo', { ttl: 50, ...o });
export const minhaConta = (env, o = {}) => pega(env, '/me', { ttl: 6 * 3600, ...o });

/** achata o resultado de /times/{id}/partidas/proximas (vem agrupado por campeonato) */
export function proximasLista(dados) {
  const out = [];
  const poe = (p) => { if (p && p.partida_id) out.push(p); };
  if (Array.isArray(dados)) dados.forEach(poe);
  else if (dados && typeof dados === 'object') Object.values(dados).forEach((v) => (Array.isArray(v) ? v.forEach(poe) : poe(v)));
  return out.map((p) => ({
    id: p.partida_id, at: Date.parse(p.data_realizacao_iso || '') || 0,
    casa: p.time_mandante?.nome_popular || '', fora: p.time_visitante?.nome_popular || '',
    casaId: Number(p.time_mandante?.time_id) || 0, foraId: Number(p.time_visitante?.time_id) || 0,
    camp: p.campeonato?.nome_popular || p.campeonato?.nome || '', campId: Number(p.campeonato?.campeonato_id) || 0,
    estadio: p.estadio?.nome_popular || '', status: p.status || '',
  })).filter((p) => p.at > 0).sort((a, b) => a.at - b.at);
}
/** de quanto em quanto tempo consultar, conforme o que sobrou do orçamento do dia */
export function intervalo(sobra, emJogo) {
  if (!emJogo) return 0;
  if (sobra > 400) return 60e3;
  if (sobra > 150) return 2 * 60e3;
  if (sobra > 60) return 4 * 60e3;
  if (sobra > 20) return 8 * 60e3;
  return sobra > 0 ? 15 * 60e3 : 0;
}
