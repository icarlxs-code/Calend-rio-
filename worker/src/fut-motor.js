/* O motor de torcida: acompanha a partida do time de cada pessoa e avisa na hora.
   Regras que não se negociam:
   - a partida é consultada UMA vez e o acontecimento é distribuído para todo mundo que torce para aquele time;
   - cada acontecimento é enviado uma única vez (nada de gol repetido);
   - fora da janela do jogo o Lembra fica quieto: o ciclo acaba quando a partida acaba;
   - sem chave, sem orçamento do dia ou com a API-Futebol falhando, usa a segunda fonte (ESPN, grátis e sem chave);
     se nenhuma responder, não inventa nada. Mudar de fonte no meio do jogo não repete aviso (guarda por placar). */
import { porTime, timeDoNome } from '../../functions/times.js';
import { quer } from './fut-camp.js';
import { temChave, orcamento, mapaTimes, idDoTime, proximasDoTime, proximasLista, partidaDetalhe, tabelaDe, intervalo } from './fut-api.js';
import { retrato, novidades, fala, situacao, recadoAntes } from './fut-eventos.js';
import { momentoDe, horaBR, diaBR } from './futebol.js';
import { agendaEspn, detalheEspn, tabelaEspn } from './fut-espn.js';

const H = 3600e3;
const ANTES = 10 * 60e3;     // começa a acompanhar 10 min antes
const DEPOIS = 3.5 * H;      // e solta a partida 3h30 depois do início
const MAX_MSG = 40;          // teto de mensagens por rodada (proteção)

const slug = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '');
/** a mesma partida, venha de qual fonte vier: dia + clube da casa + clube de fora */
export const chaveJogo = (j) => `${diaBR(j.at)}:${j.casaApp || timeDoNome(j.casa) || slug(j.casa)}:${j.foraApp || timeDoNome(j.fora) || slug(j.fora)}`;
const doEspn = (j, timeApp) => ({ id: `espn-${j.id}`, espn: j, liga: j.liga, at: j.at, casa: j.casa, fora: j.fora, casaId: j.casaId, foraId: j.foraId, casaApp: j.casaApp, foraApp: j.foraApp, camp: j.camp, estadio: j.estadio, timeApp, timeId: j.casaApp === timeApp ? j.casaId : j.foraId, fonte: 'espn' });

/**
 * A agenda de cada time, da fonte que responder: API-Futebol (com chave e cota) e, se ela não tiver o time, estiver
 * sem chave, sem cota ou falhando, a ESPN (grátis, sem chave). Devolve { porTime: { timeApp: [partidas] }, fontes }.
 */
async function agendas(env, now, times, { orc } = {}) {
  const porTime = {}, fontes = new Set();
  const o = temChave(env) ? await orcamento(env, now) : { sobra: 0 };
  const faltam = [];
  if (temChave(env) && o.sobra > 0) {
    const mapa = await mapaTimes(env, { now });
    for (const t of times) {
      const id = idDoTime(mapa, porTime_(t));
      let g = id ? await env.CAL.get(`futv:prox:${id}`, 'json') : null;
      if (id && (!g || g.at < now - 6 * H)) {
        const r = await proximasDoTime(env, id, { now });
        if (r.dados) { g = { at: now, lista: proximasLista(r.dados) }; await env.CAL.put(`futv:prox:${id}`, JSON.stringify(g), { expirationTtl: 2 * 86400 }); }
      }
      if (id && g?.lista?.length) { porTime[t] = g.lista.map((p) => ({ ...p, timeApp: t, timeId: id, fonte: 'api' })); fontes.add('api'); } else faltam.push(t);
    }
  } else faltam.push(...times);
  if (faltam.length) {
    const jogos = await agendaEspn(env, now, { orc });
    for (const t of faltam) { const L = jogos.filter((j) => j.casaApp === t || j.foraApp === t).map((j) => doEspn(j, t)); if (L.length) { porTime[t] = L; fontes.add('espn'); } }
  }
  return { porTime, fontes: [...fontes], api: temChave(env) && o.sobra > 0 };
}
const porTime_ = (t) => porTime(t);

/* proteção que vale entre fontes: o que já foi avisado deste jogo para a torcida deste time (por placar e por marco) */
function passaNaGuarda(g, ev, novo) {
  if (ev.tipo === 'gol') { if (ev.meu <= g.meu) return false; g.meu = ev.meu; return true; }
  if (ev.tipo === 'gol-sofrido') { if (ev.dele <= g.dele) return false; g.dele = ev.dele; return true; }
  if (ev.tipo === 'vermelho') {
    const k = ev.meuTime ? 'vm' : 'vd', lado = ev.meuTime ? novo.lado : novo.lado === 'mandante' ? 'visitante' : 'mandante';
    if (g[k] >= (novo.vermelhos[lado] || []).length) return false; g[k]++; return true;
  }
  const m = { comecou: 'c', intervalo: 'i', fim: 'f' }[ev.tipo];
  if (!m) return true;
  if (g[m]) return false; g[m] = 1; return true;
}

/** acompanha quem está jogando agora. Devolve um resumo do que fez (bom para log). */
export async function rodaAoVivo(env, now, send, { maxPartidas = 3 } = {}) {
  const fora = { chave: temChave(env) };
  const gente = (await env.CAL.get('fut:gente', 'json')) || {};
  const membros = Object.entries(gente);
  if (!membros.length) return { ...fora, motivo: 'ninguem-segue' };
  const times = [...new Set(membros.map(([, t]) => t))].filter((t) => porTime(t));
  const campsDe = (await env.CAL.get('fut:camps', 'json')) || {};
  // quem torce para o time E quer avisos deste campeonato
  const quemTorce = (timeApp, jogo) => membros.filter(([m, t]) => t === timeApp && quer(campsDe[m], jogo || {})).map(([m]) => m);
  const orc = { buscas: 0 };

  // 1) a agenda de cada time (API-Futebol a cada 6 h; ESPN por dia de campeonato, poucas buscas por rodada)
  const { porTime: ag, fontes, api } = await agendas(env, now, times, { orc });
  const emJogo = [];
  for (const L of Object.values(ag)) for (const p of L) if (p.at - ANTES <= now && now <= p.at + DEPOIS) emJogo.push({ ...p, chave: chaveJogo(p) });
  if (!emJogo.length) return { ...fora, fontes, motivo: 'nenhum-jogo-agora', times: Object.keys(ag).length };

  // 2) cada partida é consultada UMA vez por rodada e serve para a torcida dos dois times
  const grupos = new Map(); for (const p of emJogo) (grupos.get(p.chave) || grupos.set(p.chave, []).get(p.chave)).push(p);
  let enviadas = 0; const detalhe = [];
  for (const [chave, G] of [...grupos].slice(0, maxPartidas)) {
    if (await env.CAL.get(`futv:fim:${chave}`)) continue;                         // ciclo encerrado
    const ult = Number(await env.CAL.get(`futv:ult:${chave}`)) || 0;
    const apiAqui = G.find((p) => p.fonte === 'api');
    const espera = apiAqui && api ? intervalo((await orcamento(env, now)).sobra, true) : 60e3;
    if (!espera || now - ult < espera) { detalhe.push({ partida: chave, pulou: 'cedo' }); continue; }
    await env.CAL.put(`futv:ult:${chave}`, String(now), { expirationTtl: 2 * 86400 });
    // a fonte desta rodada: a API se ela respondeu; se não, a ESPN (achando o mesmo jogo pelo dia e pelos clubes)
    let r = apiAqui ? await partidaDetalhe(env, apiAqui.id, { now, forca: true, ttl: 40 }) : { erro: 'sem-api' };
    let fonte = 'api', jogoEspn = G.find((p) => p.espn)?.espn || null;
    if (!r.dados) {
      if (!jogoEspn) jogoEspn = (await agendaEspn(env, now, { orc })).find((j) => chaveJogo(j) === chave) || null;
      const e = jogoEspn ? await detalheEspn(jogoEspn) : { erro: 'sem-jogo-na-espn' };
      if (!e.dados) { detalhe.push({ partida: chave, erro: r.erro, espn: e.erro }); continue; }
      r = e; fonte = 'espn';
    }
    let terminou = false;
    for (const p of G) {
      const timeId = fonte === 'api' ? p.timeId : (jogoEspn.casaApp === p.timeApp ? jogoEspn.casaId : jogoEspn.foraId);
      const novo = retrato(r.dados, timeId);
      if (!novo || !novo.lado) { detalhe.push({ partida: chave, time: p.timeApp, erro: 'time-nao-joga' }); continue; }
      const kT = `${chave}:${p.timeApp}`;
      // o que já estava guardado (inclusive no formato antigo, por id da partida: nada se repete na troca de versão)
      const antes = (await env.CAL.get(`futv:ret:${kT}`, 'json')) || (p.fonte === 'api' ? await env.CAL.get(`futv:ret:${p.id}`, 'json') : null);
      const evs = novidades(antes && antes.id === novo.id ? antes : antes ? { ...antes, gols: { mandante: [], visitante: [] }, vermelhos: { mandante: [], visitante: [] } } : null, novo);
      await env.CAL.put(`futv:ret:${kT}`, JSON.stringify(novo), { expirationTtl: 3 * 86400 });
      const jaViu = new Set((await env.CAL.get(`futv:ev:${kT}`, 'json')) || (p.fonte === 'api' ? (await env.CAL.get(`futv:ev:${p.id}`, 'json')) || [] : []));
      const guarda = (await env.CAL.get(`futv:g:${kT}`, 'json')) || { meu: 0, dele: 0, vm: 0, vd: 0, c: 0, i: 0, f: 0 };
      if (!(await env.CAL.get(`futv:g:${kT}`)) && antes) { guarda.meu = antes.lado === 'mandante' ? antes.pc : antes.pf; guarda.dele = antes.lado === 'mandante' ? antes.pf : antes.pc; if (antes.periodo && antes.periodo !== 'nao-iniciada') guarda.c = 1; if (antes.periodo === 'intervalo' || antes.periodo === 'segundo-tempo') guarda.i = 1; }

      // 3) tabela só quando o jogo acaba (e só se o campeonato for de pontos corridos)
      let tab = null;
      if (evs.some((e) => e.tipo === 'fim')) {
        if (fonte === 'api' && novo.campId) { const t = await tabelaDe(env, novo.campId, { now }); tab = Array.isArray(t.dados) ? situacao(t.dados, timeId) : null; }
        if (fonte === 'espn') { const t = await tabelaEspn(env, r.dados.liga, { now }); tab = t ? situacao(t, timeId) : null; }
      }
      const rival = novo.lado === 'mandante' ? novo.fora : novo.casa;
      const clube = porTime(p.timeApp);
      for (const ev of evs) {
        if (jaViu.has(ev.k)) continue;
        jaViu.add(ev.k);
        if (!passaNaGuarda(guarda, ev, novo)) continue;          // a outra fonte já tinha avisado
        for (const quem of quemTorce(p.timeApp, { liga: p.espn?.liga || r.dados.liga, camp: p.camp || novo.camp })) {
          if (enviadas >= MAX_MSG) break;
          const msg = fala(ev, { time: clube?.nome || 'seu time', rival, quem, tabela: ev.tipo === 'fim' ? tab : null, timeApp: p.timeApp, rivalApp: timeDoNome(rival) || '' });
          if (!msg) continue;
          await send(env, quem, { ...msg, tag: `fut-${chave}-${ev.tipo}-${ev.meu}x${ev.dele}${ev.tipo === 'vermelho' ? `-v${guarda.vm + guarda.vd}` : ''}` }, 'futebol');
          enviadas++;
        }
        // o app lê isto para o mascote reagir na tela (bandeira, comemoração)
        await env.CAL.put(`futv:cena:${p.timeApp}`, JSON.stringify({ at: now, tipo: ev.tipo, meu: ev.meu, dele: ev.dele, autor: ev.autor || '', ctx: ev.ctx || '', rival, camp: novo.camp, tabela: ev.tipo === 'fim' ? tab : null, partida: chave }), { expirationTtl: 2 * 86400 });
      }
      if (novo.periodo === 'fim-de-jogo' && guarda.f) terminou = true;
      await env.CAL.put(`futv:ev:${kT}`, JSON.stringify([...jaViu].slice(-60)), { expirationTtl: 3 * 86400 });
      await env.CAL.put(`futv:g:${kT}`, JSON.stringify(guarda), { expirationTtl: 3 * 86400 });
      detalhe.push({ partida: chave, time: p.timeApp, fonte, eventos: evs.map((e) => e.tipo) });
    }
    if (terminou) await env.CAL.put(`futv:fim:${chave}`, '1', { expirationTtl: 7 * 86400 });
  }
  return { ...fora, fontes, enviadas, partidas: emJogo.length, detalhe };
}

/** antes do jogo: véspera, no dia e pouco antes (respeita a hora de dormir de cada pessoa) */
export async function rodaAntes(env, now, send, { max = 20 } = {}) {
  const gente = Object.entries((await env.CAL.get('fut:gente', 'json')) || {});
  if (!gente.length) return { motivo: 'ninguem-segue' };
  const { porTime: ag } = await agendas(env, now, [...new Set(gente.map(([, t]) => t))].filter((t) => porTime(t)), { orc: { buscas: 0 } });
  const campsDe = (await env.CAL.get('fut:camps', 'json')) || {};
  let n = 0;
  for (const [quem, timeApp] of gente) {
    if (n >= max) break;
    const clube = porTime(timeApp); if (!clube) continue;
    const lista = (ag[timeApp] || []).filter((p) => p.at > now && p.at < now + 36 * H && quer(campsDe[quem], p));
    if (!lista.length) continue;
    const pp = (await env.CAL.get(`pprofile:${quem}`, 'json')) || {};
    const prefs = { ...(pp.prefs || {}), tz: pp.tz };
    const sent = (await env.CAL.get(`futv:antes:${quem}`, 'json')) || {};
    for (const p of lista) {
      const mo = momentoDe({ at: p.at, c: '', f: '' }, now, prefs);
      // mesma chave nas duas fontes: o aviso não se repete se a fonte mudar
      const k = `${chaveJogo(p)}:${mo}`;
      if (!mo || sent[k] || sent[`${p.id}:${mo}`]) continue;
      const msg = recadoAntes({ ...p, meuId: p.timeId }, clube, mo, { quem, hora: horaBR(p.at).replace(':', 'h').replace(/h00$/, 'h') });
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
