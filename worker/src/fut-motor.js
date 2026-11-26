/* O motor de torcida: acompanha a partida do time de cada pessoa e avisa na hora.
   Regras que não se negociam:
   - a partida é consultada UMA vez e o acontecimento é distribuído para todo mundo que torce para aquele time;
   - cada acontecimento é enviado uma única vez (nada de gol repetido);
   - fora da janela do jogo o Lembra fica quieto: o ciclo acaba quando a partida acaba;
   - sem chave ou sem orçamento do dia, não chama nada e não inventa nada. */
import { porTime } from '../../functions/times.js';
import { temChave, orcamento, mapaTimes, idDoTime, proximasDoTime, proximasLista, partidaDetalhe, tabelaDe, intervalo } from './fut-api.js';
import { retrato, novidades, fala, situacao, recadoAntes } from './fut-eventos.js';
import { momentoDe, horaBR } from './futebol.js';

const H = 3600e3;
const ANTES = 10 * 60e3;     // começa a acompanhar 10 min antes
const DEPOIS = 3.5 * H;      // e solta a partida 3h30 depois do início
const MAX_MSG = 40;          // teto de mensagens por rodada (proteção)

/** acompanha quem está jogando agora. Devolve um resumo do que fez (bom para log). */
export async function rodaAoVivo(env, now, send, { maxPartidas = 3 } = {}) {
  const fora = { chave: temChave(env) };
  if (!fora.chave) return { ...fora, motivo: 'sem-chave' };
  const gente = (await env.CAL.get('fut:gente', 'json')) || {};
  const membros = Object.entries(gente);
  if (!membros.length) return { ...fora, motivo: 'ninguem-segue' };

  const o = await orcamento(env, now);
  if (!o.sobra) return { ...fora, motivo: 'sem-orcamento', orcamento: o };

  const mapa = await mapaTimes(env, { now });
  const times = [...new Set(membros.map(([, t]) => t))];
  const idApi = {}; for (const t of times) { const id = idDoTime(mapa, porTime(t)); if (id) idApi[t] = id; }
  const quemTorce = (timeApp) => membros.filter(([, t]) => t === timeApp).map(([m]) => m);

  // 1) a agenda de cada time (uma vez a cada 6 h)
  const emJogo = [];
  for (const [timeApp, id] of Object.entries(idApi)) {
    const k = `futv:prox:${id}`;
    let g = await env.CAL.get(k, 'json');
    if (!g || g.at < now - 6 * H) {
      const r = await proximasDoTime(env, id, { now });
      if (r.dados) { g = { at: now, lista: proximasLista(r.dados) }; await env.CAL.put(k, JSON.stringify(g), { expirationTtl: 2 * 86400 }); }
    }
    for (const p of g?.lista || []) if (p.at - ANTES <= now && now <= p.at + DEPOIS) emJogo.push({ ...p, timeApp, timeId: id });
  }
  if (!emJogo.length) return { ...fora, motivo: 'nenhum-jogo-agora', times: Object.keys(idApi).length };

  // 2) acompanha cada partida (uma consulta serve para todos os torcedores dela)
  let enviadas = 0; const detalhe = [];
  for (const p of emJogo.slice(0, maxPartidas)) {
    if (await env.CAL.get(`futv:fim:${p.id}`)) continue;                         // ciclo encerrado
    const ult = Number(await env.CAL.get(`futv:ult:${p.id}`)) || 0;
    const espera = intervalo((await orcamento(env, now)).sobra, true);
    if (!espera || now - ult < espera) { detalhe.push({ partida: p.id, pulou: 'cedo' }); continue; }
    const r = await partidaDetalhe(env, p.id, { now, forca: true, ttl: 40 });
    await env.CAL.put(`futv:ult:${p.id}`, String(now), { expirationTtl: 2 * 86400 });
    if (!r.dados) { detalhe.push({ partida: p.id, erro: r.erro }); continue; }
    const novo = retrato(r.dados, p.timeId);
    if (!novo || !novo.lado) { detalhe.push({ partida: p.id, erro: 'time-nao-joga' }); continue; }
    const antes = await env.CAL.get(`futv:ret:${p.id}`, 'json');
    const evs = novidades(antes, novo);
    await env.CAL.put(`futv:ret:${p.id}`, JSON.stringify(novo), { expirationTtl: 3 * 86400 });

    // 3) tabela só quando o jogo acaba (e só se o campeonato for de pontos corridos)
    let tab = null;
    if (evs.some((e) => e.tipo === 'fim') && novo.campId) {
      const t = await tabelaDe(env, novo.campId, { now });
      tab = Array.isArray(t.dados) ? situacao(t.dados, p.timeId) : null;
    }
    const jaViu = new Set((await env.CAL.get(`futv:ev:${p.id}`, 'json')) || []);
    const rival = novo.lado === 'mandante' ? novo.fora : novo.casa;
    const clube = porTime(p.timeApp);
    for (const ev of evs) {
      if (jaViu.has(ev.k)) continue;
      jaViu.add(ev.k);
      for (const quem of quemTorce(p.timeApp)) {
        if (enviadas >= MAX_MSG) break;
        const msg = fala(ev, { time: clube?.nome || 'seu time', rival, quem, tabela: ev.tipo === 'fim' ? tab : null });
        if (!msg) continue;
        await send(env, quem, { ...msg, tag: `fut-${p.id}-${ev.k}` }, 'futebol');
        enviadas++;
      }
      // o app lê isto para o mascote reagir na tela (bandeira, comemoração)
      await env.CAL.put(`futv:cena:${p.timeApp}`, JSON.stringify({ at: now, tipo: ev.tipo, meu: ev.meu, dele: ev.dele, autor: ev.autor || '', ctx: ev.ctx || '', rival, camp: novo.camp, tabela: ev.tipo === 'fim' ? tab : null, partida: p.id }), { expirationTtl: 2 * 86400 });
      if (ev.tipo === 'fim') await env.CAL.put(`futv:fim:${p.id}`, '1', { expirationTtl: 7 * 86400 });
    }
    await env.CAL.put(`futv:ev:${p.id}`, JSON.stringify([...jaViu].slice(-60)), { expirationTtl: 3 * 86400 });
    detalhe.push({ partida: p.id, eventos: evs.map((e) => e.tipo) });
  }
  return { ...fora, enviadas, partidas: emJogo.length, detalhe };
}

/** antes do jogo: véspera, no dia e pouco antes (respeita a hora de dormir de cada pessoa) */
export async function rodaAntes(env, now, send, { max = 20 } = {}) {
  if (!temChave(env)) return { motivo: 'sem-chave' };
  const gente = Object.entries((await env.CAL.get('fut:gente', 'json')) || {});
  if (!gente.length) return { motivo: 'ninguem-segue' };
  const mapa = await mapaTimes(env, { now });
  let n = 0;
  for (const [quem, timeApp] of gente) {
    if (n >= max) break;
    const clube = porTime(timeApp); if (!clube) continue;
    const id = idDoTime(mapa, clube); if (!id) continue;
    const g = await env.CAL.get(`futv:prox:${id}`, 'json');
    const lista = (g?.lista || []).filter((p) => p.at > now && p.at < now + 36 * H);
    if (!lista.length) continue;
    const pp = (await env.CAL.get(`pprofile:${quem}`, 'json')) || {};
    const prefs = { ...(pp.prefs || {}), tz: pp.tz };
    const sent = (await env.CAL.get(`futv:antes:${quem}`, 'json')) || {};
    for (const p of lista) {
      const mo = momentoDe({ at: p.at, c: '', f: '' }, now, prefs);
      const k = `${p.id}:${mo}`;
      if (!mo || sent[k]) continue;
      const msg = recadoAntes({ ...p, meuId: id }, clube, mo, { quem, hora: horaBR(p.at).replace(':', 'h').replace(/h00$/, 'h') });
      if (!msg) continue;
      sent[k] = now;
      for (const a of Object.keys(sent)) if (sent[a] < now - 5 * 864e5) delete sent[a];
      await env.CAL.put(`futv:antes:${quem}`, JSON.stringify(sent), { expirationTtl: 7 * 86400 });
      await send(env, quem, msg, 'futebol');
      n++;
      break;        // um aviso por pessoa por rodada
    }
  }
  return { avisos: n };
}

/** o que o app mostra na tela inicial (a reação do mascote). Só vale por algumas horas. */
export async function cenaDoTime(env, timeApp, now = Date.now()) {
  if (!timeApp) return null;
  const c = await env.CAL.get(`futv:cena:${timeApp}`, 'json');
  if (!c) return null;
  const idade = now - (c.at || 0);
  const vale = { gol: 3 * H, 'gol-sofrido': 3 * H, fim: 6 * H, intervalo: 40 * 60e3, comecou: 2 * H, vermelho: 2 * H }[c.tipo] || 2 * H;
  return idade < vale ? { ...c, idade } : null;
}
