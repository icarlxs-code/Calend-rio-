/* Ranking semanal em LIGAS (só assinantes do plano Profissional, mensal ou anual).
   Inspirado no que segura gente em apps como o Duolingo — mas medindo o que importa no Lembra:
   NÃO ESQUECER. Por isso vale mais concluir no horário do que criar muita coisa.

   Pontos (contados aqui no servidor, com anti-fraude):
     concluir no horário 3 · concluir atrasado 1 · criar compromisso 1 (até 10 por dia)
     lembrete pessoal 1 · bilhete 1 · 1º uso do dia +2 (vale a sequência de dias)
   Anti-fraude: cada item pontua 1 vez, intervalo mínimo de 6 s, teto por hora e por dia,
     detector de robô (rajadas, ritmo regular demais, ativo ~24h). Suspeito sai do ranking.
   Ligas: Bronze → Prata → Ouro, em grupos de até 30 pessoas. Toda segunda: os 5 primeiros de cada
     grupo sobem e os 5 últimos (de grupos com 10+) descem.
   Sequência: dias seguidos com pelo menos 1 ponto; 1 dia de folga por semana não quebra (proteção).
   Prêmios no dia 1º (somando o mês): 1º lugar 1 mês grátis (100%), 2º 50%, 3º 25% na próxima fatura;
     quem ficou ativo 20+ dias no mês ganha 10%. Cada pessoa ganha no máximo 1 prêmio a cada 90 dias. */

export const POINTS = { done: 3, late: 1, create: 1, personal: 1, note: 1, open: 0 };
export const LEAGUES = ['bronze', 'prata', 'ouro'];
export const LEAGUE_NAME = { bronze: 'Bronze', prata: 'Prata', ouro: 'Ouro' };
const MIN_GAP = 6e3, MAX_HOUR = 18, MAX_DAY = 60, MAX_CREATE_DAY = 10, GROUP = 30, MOVE = 5;
const PRIZES = [100, 50, 25], CONSTANCY_DAYS = 20, CONSTANCY_PCT = 10, PRIZE_COOLDOWN = 90 * 864e5;

const brDate = (now) => new Date(now - 3 * 3600e3);
export const dayKey = (now) => brDate(now).toISOString().slice(0, 10);
export function weekKey(now) {
  const d = brDate(now);
  const wd = (d.getUTCDay() + 6) % 7;
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - wd)).toISOString().slice(0, 10);
}
const prevWeek = (wk) => new Date(Date.parse(wk) - 7 * 864e5).toISOString().slice(0, 10);
const initial = (name) => (String(name || '?').trim()[0] || '?').toUpperCase();
export const eligible = (plan) => !!plan && plan.active && plan.plan === 'monthly' && plan.tier !== 'essencial';

/* Detector de robô */
export function suspicious(acts, now) {
  const recent = acts.filter((t) => now - t < 864e5);
  for (let i = 0; i + 25 < recent.length; i++) if (recent[i + 25] - recent[i] < 10 * 60e3) return 'rajada de ações em poucos minutos';
  const last = acts.slice(-21);
  if (last.length === 21) {
    const gaps = last.slice(1).map((t, i) => t - last[i]);
    const avg = gaps.reduce((a, b) => a + b, 0) / gaps.length;
    const sd = Math.sqrt(gaps.reduce((a, b) => a + (b - avg) ** 2, 0) / gaps.length);
    if (avg < 30 * 60e3 && sd / avg < 0.12) return 'ritmo regular demais (parece automático)';
  }
  const hours = new Set(recent.map((t) => Math.floor(t / 3600e3)));
  if (hours.size >= 19) return 'ativo quase 24h seguidas';
  return null;
}

/* Sequência de dias com proteção: no máximo 1 dia sem uso por semana não quebra */
export function streakOf(days, today) {
  const set = new Set(days);
  let d = Date.parse(today), n = 0, freezes = 0;
  if (!set.has(today)) d -= 864e5; // hoje ainda pode contar
  for (let i = 0; i < 400; i++) {
    const k = new Date(d).toISOString().slice(0, 10);
    if (set.has(k)) n++;
    else if (freezes < Math.floor(n / 7) + 1 && n > 0) freezes++;
    else break;
    d -= 864e5;
  }
  return n;
}

/* Liga da pessoa nesta semana: calculada a partir do resultado da semana anterior (sobe/desce) */
async function leagueFor(env, ws, wk) {
  const leagues = (await env.CAL.get('rank-league', 'json')) || {};
  const cur = leagues[ws];
  if (cur && cur.wk === wk) return cur.l;
  let l = cur ? cur.l : 'bronze';
  const prev = (await env.CAL.get(`rank:${prevWeek(wk)}`, 'json')) || {};
  if (prev[ws] && !prev[ws].flag) {
    const group = Object.entries(prev).filter(([, u]) => u.league === prev[ws].league && u.group === prev[ws].group && !u.flag).sort((a, b) => b[1].pts - a[1].pts);
    const pos = group.findIndex(([k]) => k === ws);
    const i = LEAGUES.indexOf(prev[ws].league || 'bronze');
    if (pos >= 0 && pos < MOVE && prev[ws].pts > 0) l = LEAGUES[Math.min(2, i + 1)];
    else if (group.length >= 10 && pos >= group.length - MOVE) l = LEAGUES[Math.max(0, i - 1)];
    else l = LEAGUES[i];
  }
  leagues[ws] = { l, wk };
  await env.CAL.put('rank-league', JSON.stringify(leagues));
  return l;
}

/* Registra uma ação. type: create | done (ontime) | personal | note | open */
export async function recordAct(env, me, plan, act, now = Date.now()) {
  if (!eligible(plan)) return { ok: false, reason: 'O ranking faz parte do plano Profissional (mensal ou anual).' };
  let type = String(act.type || '');
  const ref = String(act.ref || '').slice(0, 80);
  if (!(type in POINTS)) return { ok: false, reason: 'ação inválida' };
  if (type !== 'open' && !/^[\w-]{3,80}$/.test(ref)) return { ok: false, reason: 'ação inválida' };
  if (type === 'done' && act.ontime === false) type = 'late';
  const wk = weekKey(now), day = dayKey(now);
  const board = (await env.CAL.get(`rank:${wk}`, 'json')) || {};
  let u = board[me.ws];
  if (!u) {
    const league = await leagueFor(env, me.ws, wk);
    const inLeague = Object.values(board).filter((x) => x.league === league);
    u = { i: initial(me.name), id: me.id, pts: 0, acts: [], refs: [], day: '', dayPts: 0, dayCreate: 0, hour: 0, hourPts: 0, flag: null, league, group: Math.floor(inLeague.length / GROUP) };
  }
  u.i = initial(me.name); u.id = me.id;
  u.acts = [...(u.acts || []), now].slice(-200);
  const firstToday = u.day !== day;
  if (firstToday) { u.day = day; u.dayPts = 0; u.dayCreate = 0; }
  const hr = Math.floor(now / 3600e3);
  if (u.hour !== hr) { u.hour = hr; u.hourPts = 0; }
  let add = POINTS[type];
  const key = `${type === 'late' ? 'done' : type}:${ref}`;
  if (type !== 'open' && (u.refs || []).includes(key)) add = 0;
  if (type === 'create' && u.dayCreate >= MAX_CREATE_DAY) add = 0;
  if (u.acts.length > 1 && now - u.acts[u.acts.length - 2] < MIN_GAP) add = 0;
  if (firstToday) add += 2; // 1º uso do dia: vale a sequência
  add = Math.max(0, Math.min(add, MAX_HOUR - u.hourPts, MAX_DAY - u.dayPts));
  if (type !== 'open') u.refs = [...(u.refs || []), key].slice(-600);
  if (type === 'create' && add > 0) u.dayCreate++;
  const why = suspicious(u.acts, now);
  if (why && !u.flag) u.flag = { why, at: now };
  u.pts += add; u.dayPts += add; u.hourPts += add;
  board[me.ws] = u;
  await env.CAL.put(`rank:${wk}`, JSON.stringify(board), { expirationTtl: 120 * 864e2 });
  // dias ativos (para a sequência e o prêmio de constância)
  if (add > 0 && firstToday) {
    const days = (await env.CAL.get(`rank-days:${me.ws}`, 'json')) || [];
    if (!days.includes(day)) { days.push(day); await env.CAL.put(`rank-days:${me.ws}`, JSON.stringify(days.slice(-120))); }
  }
  return { ok: true, added: add, pts: u.pts };
}

/* Posição de alguém no grupo (usado também pelas mensagens de retorno) */
export function standing(board, ws) {
  const u = board[ws];
  if (!u || u.flag) return null;
  const group = Object.entries(board).filter(([, x]) => x.league === u.league && x.group === u.group && !x.flag && x.pts > 0).sort((a, b) => b[1].pts - a[1].pts);
  const pos = group.findIndex(([k]) => k === ws);
  return { pos: pos >= 0 ? pos + 1 : null, size: group.length, league: u.league, pts: u.pts, group };
}

/* Quadro da pessoa: só o grupo da liga dela, com iniciais */
export async function getBoard(env, me, now = Date.now()) {
  const wk = weekKey(now);
  const board = (await env.CAL.get(`rank:${wk}`, 'json')) || {};
  const s = standing(board, me.ws);
  const league = s ? s.league : ((await env.CAL.get('rank-league', 'json')) || {})[me.ws]?.l || 'bronze';
  const group = s ? s.group : Object.entries(board).filter(([, x]) => x.league === league && !x.flag && x.pts > 0).sort((a, b) => b[1].pts - a[1].pts).slice(0, GROUP);
  const days = (await env.CAL.get(`rank-days:${me.ws}`, 'json')) || [];
  const winners = (await env.CAL.get('rank-winners', 'json')) || [];
  return {
    ok: true, week: wk, league, leagueName: LEAGUE_NAME[league], move: MOVE,
    top: group.slice(0, 30).map(([ws, u], i) => ({ pos: i + 1, i: u.i, pts: u.pts, me: ws === me.ws })),
    me: board[me.ws] ? { pos: s?.pos || null, pts: board[me.ws].pts, flagged: !!board[me.ws].flag } : null,
    streak: streakOf(days, dayKey(now)),
    lastWinner: winners[0] ? { month: winners[0].month, i: winners[0].i, pts: winners[0].pts, me: winners[0].ws === me.ws } : null,
  };
}

/* Para o dono: todas as contas, com liga, pontos e suspeitas */
export async function adminBoard(env, now = Date.now()) {
  const wk = weekKey(now);
  const board = (await env.CAL.get(`rank:${wk}`, 'json')) || {};
  return { week: wk, rows: Object.entries(board).map(([ws, u]) => ({ ws, i: u.i, pts: u.pts, flag: u.flag, league: LEAGUE_NAME[u.league || 'bronze'] })).sort((a, b) => b.pts - a.pts), winners: (await env.CAL.get('rank-winners', 'json')) || [] };
}

/* Dia 1º: prêmios do mês anterior (top 3 + constância), com teto de 1 prêmio a cada 90 dias por pessoa */
export async function monthlyAward(env, { stripe, getBill, putBill, notify }, now = Date.now()) {
  const d = brDate(now);
  if (d.getUTCDate() !== 1 || d.getUTCHours() > 2) return null;
  const prev = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() - 1, 1));
  const month = prev.toISOString().slice(0, 7);
  if (await env.CAL.get(`rank-award:${month}`)) return null;
  await env.CAL.put(`rank-award:${month}`, String(now));
  const totals = {};
  for (let day = new Date(prev.getTime() - 6 * 864e5); day.getTime() < prev.getTime() + 32 * 864e5; day = new Date(day.getTime() + 864e5)) {
    if ((day.getUTCDay() + 6) % 7 !== 0) continue;
    const wkStart = day.toISOString().slice(0, 10);
    if (wkStart.slice(0, 7) !== month && new Date(day.getTime() + 6 * 864e5).toISOString().slice(0, 7) !== month) continue;
    const board = (await env.CAL.get(`rank:${wkStart}`, 'json')) || {};
    for (const [ws, u] of Object.entries(board)) {
      const t = totals[ws] || (totals[ws] = { pts: 0 });
      if (u.flag) t.flagged = true;
      t.i = u.i; t.id = u.id; t.pts += u.pts;
    }
  }
  const coupon = async (pct) => {
    let id = await env.CAL.get(`rank-coupon-${pct}`);
    if (!id) { const c = await stripe(env, 'coupons', { percent_off: pct, duration: 'once', name: pct === 100 ? 'Lembra · campeão do mês (1 mês grátis)' : `Lembra · prêmio do ranking (${pct}% off)` }); id = c.id; await env.CAL.put(`rank-coupon-${pct}`, id); }
    return id;
  };
  const give = async (ws, t, pct, why) => {
    const b = await getBill(env, ws);
    if (!b || !b.subActive || !b.subscription) return null; // precisa continuar assinando
    if ((b.rankWins || []).some((w) => now - w.at < PRIZE_COOLDOWN)) return null; // 1 prêmio a cada 90 dias
    let applied = false;
    try { await stripe(env, `subscriptions/${b.subscription}`, { discounts: [{ coupon: await coupon(pct) }] }); applied = true; } catch (e) { console.log('ranking prêmio', e.message); }
    b.rankWins = [...(b.rankWins || []), { month, at: now, pct, why, applied }];
    await putBill(env, ws, b);
    if (t.id) await notify(t.id, { title: pct === 100 ? '🏆 Você foi o nº 1 do mês!' : why === 'constância' ? '🔥 Prêmio de constância!' : `🥈 Você ficou no pódio do mês!`, body: pct === 100 ? 'Parabéns! Seu próximo mês do Lembra é por nossa conta: a próxima fatura vem zerada.' : `Sua próxima fatura vem com ${pct}% de desconto. Continue assim!`, tag: 'ranking', url: './#/ranking' }).catch(() => 0);
    return { ws, i: t.i, pts: t.pts, pct, why, applied };
  };
  const winners = [];
  const ranked = Object.entries(totals).filter(([, t]) => !t.flagged && t.pts > 0).sort((a, b) => b[1].pts - a[1].pts);
  for (const [ws, t] of ranked) {
    if (winners.length >= PRIZES.length) break;
    const w = await give(ws, t, PRIZES[winners.length], `${winners.length + 1}º lugar`);
    if (w) winners.push(w);
  }
  // constância: 20+ dias ativos no mês
  for (const [ws, t] of Object.entries(totals)) {
    if (t.flagged || winners.some((w) => w.ws === ws)) continue;
    const days = ((await env.CAL.get(`rank-days:${ws}`, 'json')) || []).filter((x) => x.startsWith(month));
    if (days.length >= CONSTANCY_DAYS) { const w = await give(ws, t, CONSTANCY_PCT, 'constância'); if (w) winners.push(w); }
  }
  const list = (await env.CAL.get('rank-winners', 'json')) || [];
  await env.CAL.put('rank-winners', JSON.stringify([...winners.map((w) => ({ ...w, month, at: now })), ...list].slice(0, 60)));
  return { month, winners };
}
