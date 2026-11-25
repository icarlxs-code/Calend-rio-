/* Jogos do time do coração. Só funciona com o segredo FOOTBALL_API_KEY (API-Football) ou FOOTBALL_DATA_TOKEN
   (football-data.org) no servidor. Sem segredo: não chama nada e não avisa nada. Nenhum escudo é baixado.
   Uma busca por dia (até 6 chamadas); se falhar, usa a tabela guardada. Só avisa quem ligou, só do time da pessoa. */
import { brNow } from './coach.js';
import { porTime, timeDoNome } from '../../functions/times.js';
const H = 3600e3, BR = -3 * H;
export const diaBR = (ms) => new Date(ms + BR).toISOString().slice(0, 10);
export const horaBR = (ms) => new Date(ms + BR).toISOString().slice(11, 16);
const minBR = (ms, tz) => { const b = brNow(ms, tz); return b.h * 60 + b.m; }, diaDe = (ms, tz) => brNow(ms, tz).date;
const LIGAS = [71, 72, 73, 13, 11]; // Série A, Série B, Copa do Brasil, Libertadores, Sul-Americana
const limpa = (s, n = 60) => String(s || '').replace(/[<>{}\u0000-\u001f]/g, '').trim().slice(0, n);

export function normaliza(lista) {
  const vistos = new Set(), out = [];
  for (const j of lista) {
    const c = timeDoNome(j.casa), f = timeDoNome(j.fora), at = Number(j.at);
    if ((!c && !f) || !Number.isFinite(at)) continue;
    const id = `${diaBR(at)}:${c || limpa(j.casa)}:${f || limpa(j.fora)}`;
    if (vistos.has(id)) continue; vistos.add(id);
    out.push({ id, at, c, f, casa: c ? porTime(c).nome : limpa(j.casa), fora: f ? porTime(f).nome : limpa(j.fora), comp: limpa(j.comp, 40) });
  }
  return out.sort((a, b) => a.at - b.at).slice(0, 400);
}
const SEM_HORA = new Set(['PST', 'CANC', 'ABD', 'TBD', 'FT', 'AET', 'PEN', 'AWD', 'WO', 'SUSP']);
async function baixa(env, now) {
  const de = diaBR(now), ate = diaBR(now + 21 * 864e5), L = [];
  if (env.FOOTBALL_API_KEY) {
    for (const liga of LIGAS) {
      const r = await fetch(`https://v3.football.api-sports.io/fixtures?league=${liga}&season=${de.slice(0, 4)}&from=${de}&to=${ate}`, { headers: { 'x-apisports-key': env.FOOTBALL_API_KEY } });
      const j = r.ok ? await r.json().catch(() => null) : null;
      for (const x of Array.isArray(j?.response) ? j.response : []) if (!SEM_HORA.has(x.fixture?.status?.short)) L.push({ at: Date.parse(x.fixture?.date), casa: x.teams?.home?.name, fora: x.teams?.away?.name, comp: x.league?.name });
    }
    if (L.length) return L; // o plano grátis pode não trazer a temporada atual: aí tenta o plano B
  }
  if (env.FOOTBALL_DATA_TOKEN) {
    const r = await fetch(`https://api.football-data.org/v4/competitions/BSA/matches?dateFrom=${de}&dateTo=${ate}`, { headers: { 'X-Auth-Token': env.FOOTBALL_DATA_TOKEN } });
    const j = r.ok ? await r.json().catch(() => null) : null;
    for (const x of j?.matches || []) if (x.status === 'TIMED') L.push({ at: Date.parse(x.utcDate), casa: x.homeTeam?.shortName || x.homeTeam?.name, fora: x.awayTeam?.shortName || x.awayTeam?.name, comp: 'Brasileirão' });
  }
  return L;
}
const FR = {
  vespera: ['Amanhã tem {time} x {rival}, às {hora}. Já deixa o horário reservado.', '{time} joga amanhã, às {hora}, contra {rival}. Combina com a turma hoje?', 'Amanhã, às {hora}: {time} x {rival}. Sua agenda já está na torcida.'],
  dia: ['Hoje tem jogo do seu time: {time} x {rival}, às {hora}.', 'É hoje! {time} x {rival}, às {hora}. Não marca nada por cima, hein?', 'Dia de jogo: {time} x {rival}, às {hora}. Só falta a pipoca.'],
  perto: ['Falta pouco: {time} x {rival}, às {hora}.', 'Daqui a pouco tem {time} x {rival}, às {hora}. Dá tempo de se ajeitar.', 'Aquecimento: {time} x {rival} começa às {hora}.'],
};
const h32 = (s) => { let h = 2166136261; for (const c of String(s)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
export function recado(j, timeId, momento, quem = '', tz) {
  const t = porTime(timeId); if (!t || !FR[momento] || (j.c !== timeId && j.f !== timeId)) return null;
  const rival = j.c === timeId ? j.fora : j.casa, L = FR[momento], S = { time: t.nome, rival, hora: (({ h, m }) => `${h}:${String(m).padStart(2, '0')}`)(brNow(j.at, tz)).replace(':', 'h').replace(/h00$/, 'h') };
  const txt = L[h32(`${quem}${j.id}${momento}`) % L.length].replace(/\{(\w+)\}/g, (_, k) => S[k] || '');
  if (!rival || /[{}]/.test(txt)) return null;
  return { title: `⚽ ${{ vespera: 'Amanhã tem', dia: 'Hoje tem', perto: 'Já já tem' }[momento]} ${t.nome}`, body: txt, tag: `fut-${j.id}`, url: './#/hoje' };
}
const mm = (s, p) => (/^\d{2}:\d{2}$/.test(s || '') ? +s.slice(0, 2) * 60 + +s.slice(3) : p);
/** qual aviso cabe agora (ou nenhum): véspera às 18h, no dia às 9h e perto do jogo; nunca enquanto a pessoa dorme */
export function momentoDe(j, now, { wake, sleep, tz } = {}) {
  const m = minBR(now, tz), w = Math.max(mm(wake, 480), 420); let s = Math.min(mm(sleep, 1350), 1350); if (s <= w) s = 1350;
  if (m < w || m >= s || now >= j.at) return null;
  const falta = j.at - now, manha = Math.max(540, w);
  if (falta <= 2 * H && falta > 1.25 * H) return 'perto';
  if (diaDe(now, tz) === diaDe(j.at, tz) && falta > 2 * H && m >= manha && m < manha + 120) return 'dia';
  if (diaDe(now + 864e5, tz) === diaDe(j.at, tz) && m >= 1080 && m < 1200) return 'vespera';
  return null;
}
/* guarda o time só de quem ligou os avisos (desligou = apaga) */
export async function guardaTime(env, member, { time, avisos }) {
  const L = (await env.CAL.get('fut:gente', 'json')) || {}, t = porTime(time) ? time : '', ok = !!t && avisos === true;
  if (ok ? L[member] !== t : member in L) { if (ok) L[member] = t; else delete L[member]; await env.CAL.put('fut:gente', JSON.stringify(L)); }
  return { time: t, avisos: ok };
}
export async function tiraTime(env, member) { await guardaTime(env, member, {}); await env.CAL.delete(`fut:env:${member}`); }
export async function proximos(env, time, now = Date.now()) { const g = await env.CAL.get('fut:jogos', 'json'); return (g?.jogos || []).filter((j) => (j.c === time || j.f === time) && j.at > now - 2 * H).slice(0, 3); }
export const ligado = (env) => !!(env.FOOTBALL_API_KEY || env.FOOTBALL_DATA_TOKEN);

export async function rodaFutebol(env, now, send, max = 6) {
  if (!ligado(env)) return 0;
  const bl = String(Math.floor(now / 6e5)); if (bl === (await env.CAL.get('fut:bloco'))) return 0; // confere a cada 10 minutos
  const gente = (await env.CAL.get('fut:gente', 'json')) || {}; if (!Object.keys(gente).length) return 0;
  const g = await env.CAL.get('fut:jogos', 'json');
  if (minBR(now) >= 360 && g?.dia !== diaBR(now) && now - (Number(await env.CAL.get('fut:tentou')) || 0) > 6 * H) {
    await env.CAL.put('fut:tentou', String(now));
    const L = normaliza(await baixa(env, now).catch(() => []));
    if (L.length) await env.CAL.put('fut:jogos', JSON.stringify({ dia: diaBR(now), jogos: L }));
    return 0; // os avisos saem na próxima rodada
  }
  const jogos = (g?.jogos || []).filter((j) => j.at > now && j.at < now + 36 * H); let n = 0, sobrou = false;
  for (const [quem, time] of jogos.length ? Object.entries(gente) : []) {
    const meus = jogos.filter((j) => j.c === time || j.f === time); if (!meus.length) continue;
    if (n >= max) { sobrou = true; break; }
    const pp = (await env.CAL.get(`pprofile:${quem}`, 'json')) || {}, pf = { ...(pp.prefs || {}), tz: pp.tz }, sent = (await env.CAL.get(`fut:env:${quem}`, 'json')) || {};
    for (const j of meus) {
      const mo = momentoDe(j, now, pf), k = `${j.id}:${mo}`; if (!mo || sent[k]) continue;
      const msg = recado(j, time, mo, quem, pp.tz); if (!msg) continue;
      sent[k] = now; for (const [a, t] of Object.entries(sent)) if (t < now - 5 * 864e5) delete sent[a];
      await env.CAL.put(`fut:env:${quem}`, JSON.stringify(sent)); await send(env, quem, msg, 'futebol'); n++;
    }
  }
  if (!sobrou) await env.CAL.put('fut:bloco', bl);
  return n;
}
