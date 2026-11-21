/* Ranking semanal de uso (só assinantes do plano MENSAL).
   - Os pontos são contados AQUI no servidor, ação por ação, com regras anti-fraude:
     cada item só pontua uma vez, intervalo mínimo entre ações, teto por hora e por dia,
     e detector de comportamento de robô (ritmo regular demais, rajadas, sem descanso).
     Conta marcada como suspeita sai do ranking (o dono vê o motivo no painel).
   - No ranking ninguém vê foto nem nome: só a inicial.
   - No dia 1 de cada mês, quem somou mais pontos no mês anterior ganha o mês seguinte grátis
     (cupom de 100% aplicado na assinatura da Stripe: a fatura daquele mês sai zerada). */

export const POINTS = { create: 3, done: 2, note: 1, personal: 2, open: 1 };
const MIN_GAP = 6e3;          // ações com menos de 6 s de diferença não pontuam
const MAX_HOUR = 18;          // pontos por hora
const MAX_DAY = 70;           // pontos por dia
const OPEN_GAP = 2 * 3600e3;  // "abriu o app" vale no máximo 1 ponto a cada 2h (até 4 por dia)

/* dia e semana no horário de Brasília (semana começa na segunda) */
const brDate = (now) => new Date(now - 3 * 3600e3);
export const dayKey = (now) => brDate(now).toISOString().slice(0, 10);
export function weekKey(now) {
  const d = brDate(now);
  const wd = (d.getUTCDay() + 6) % 7; // segunda = 0
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - wd)).toISOString().slice(0, 10);
}
const initial = (name) => (String(name || '?').trim()[0] || '?').toUpperCase();

/* Detector de robô: olha as últimas ações da pessoa */
export function suspicious(acts, now) {
  const recent = acts.filter((t) => now - t < 864e5);
  // rajada: mais de 25 ações em 10 minutos
  for (let i = 0; i + 25 < recent.length; i++) if (recent[i + 25] - recent[i] < 10 * 60e3) return 'rajada de ações em poucos minutos';
  // ritmo de máquina: 20 intervalos seguidos quase idênticos
  const last = acts.slice(-21);
  if (last.length === 21) {
    const gaps = last.slice(1).map((t, i) => t - last[i]);
    const avg = gaps.reduce((a, b) => a + b, 0) / gaps.length;
    const sd = Math.sqrt(gaps.reduce((a, b) => a + (b - avg) ** 2, 0) / gaps.length);
    if (avg < 30 * 60e3 && sd / avg < 0.12) return 'ritmo regular demais (parece automático)';
  }
  // sem descanso: ações em 19 ou mais horas diferentes nas últimas 24h
  const hours = new Set(recent.map((t) => Math.floor(t / 3600e3)));
  if (hours.size >= 19) return 'ativo quase 24h seguidas';
  return null;
}

/* Registra uma ação. Retorna { ok, pts, added } */
export async function recordAct(env, me, plan, act, now = Date.now()) {
  if (!plan || plan.plan !== 'monthly' || !plan.active) return { ok: false, reason: 'Só assinantes do plano mensal participam do ranking.' };
  const type = String(act.type || '');
  const ref = String(act.ref || '').slice(0, 80);
  if (!POINTS[type]) return { ok: false, reason: 'ação inválida' };
  if (type !== 'open' && !/^[\w-]{3,80}$/.test(ref)) return { ok: false, reason: 'ação inválida' };
  const wk = weekKey(now), day = dayKey(now);
  const board = (await env.CAL.get(`rank:${wk}`, 'json')) || {};
  const u = board[me.ws] || { i: initial(me.name), id: me.id, pts: 0, acts: [], refs: [], day: '', dayPts: 0, hour: 0, hourPts: 0, lastOpen: 0, flag: null };
  u.i = initial(me.name); u.id = me.id;
  u.acts = [...(u.acts || []), now].slice(-200);
  if (u.day !== day) { u.day = day; u.dayPts = 0; }
  const hr = Math.floor(now / 3600e3);
  if (u.hour !== hr) { u.hour = hr; u.hourPts = 0; }
  let add = POINTS[type];
  const key = `${type}:${ref}`;
  if (type === 'open') { if (now - (u.lastOpen || 0) < OPEN_GAP) add = 0; else u.lastOpen = now; }
  else if ((u.refs || []).includes(key)) add = 0; // o mesmo item não pontua duas vezes
  if (u.acts.length > 1 && now - u.acts[u.acts.length - 2] < MIN_GAP) add = 0;
  add = Math.max(0, Math.min(add, MAX_HOUR - u.hourPts, MAX_DAY - u.dayPts));
  if (type !== 'open') u.refs = [...(u.refs || []), key].slice(-600);
  const why = suspicious(u.acts, now);
  if (why && !u.flag) u.flag = { why, at: now };
  u.pts += add; u.dayPts += add; u.hourPts += add;
  board[me.ws] = u;
  await env.CAL.put(`rank:${wk}`, JSON.stringify(board), { expirationTtl: 120 * 864e2 });
  return { ok: true, added: add, pts: u.pts };
}

/* Quadro público (só inicial e pontos) + a posição de quem pediu */
export async function getBoard(env, me, now = Date.now()) {
  const wk = weekKey(now);
  const board = (await env.CAL.get(`rank:${wk}`, 'json')) || {};
  const rows = Object.entries(board).filter(([, u]) => !u.flag && u.pts > 0).sort((a, b) => b[1].pts - a[1].pts);
  const pos = rows.findIndex(([ws]) => ws === me.ws);
  const mine = board[me.ws];
  const winners = (await env.CAL.get('rank-winners', 'json')) || [];
  return {
    ok: true, week: wk,
    top: rows.slice(0, 20).map(([ws, u], i) => ({ pos: i + 1, i: u.i, pts: u.pts, me: ws === me.ws })),
    me: mine ? { pos: pos >= 0 ? pos + 1 : null, pts: mine.pts, flagged: !!mine.flag } : null,
    total: rows.length,
    lastWinner: winners[0] ? { month: winners[0].month, i: winners[0].i, pts: winners[0].pts, me: winners[0].ws === me.ws } : null,
  };
}

/* Para o dono: todas as contas com pontos e suspeitas */
export async function adminBoard(env, now = Date.now()) {
  const wk = weekKey(now);
  const board = (await env.CAL.get(`rank:${wk}`, 'json')) || {};
  return { week: wk, rows: Object.entries(board).map(([ws, u]) => ({ ws, i: u.i, pts: u.pts, flag: u.flag })).sort((a, b) => b.pts - a.pts), winners: (await env.CAL.get('rank-winners', 'json')) || [] };
}

/* Dia 1 de cada mês: quem mais pontuou no mês anterior (somando as semanas) ganha o mês seguinte grátis */
export async function monthlyAward(env, { stripe, getBill, putBill, notify }, now = Date.now()) {
  const d = brDate(now);
  if (d.getUTCDate() !== 1 || d.getUTCHours() < 0 || d.getUTCHours() > 2) return null;
  const prev = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() - 1, 1));
  const month = prev.toISOString().slice(0, 7);
  if (await env.CAL.get(`rank-award:${month}`)) return null;
  await env.CAL.put(`rank-award:${month}`, String(now));
  // semanas que começaram no mês anterior
  const totals = {};
  for (let day = new Date(prev); day.getUTCMonth() === prev.getUTCMonth(); day = new Date(day.getTime() + 864e5)) {
    if ((day.getUTCDay() + 6) % 7 !== 0) continue;
    const board = (await env.CAL.get(`rank:${day.toISOString().slice(0, 10)}`, 'json')) || {};
    for (const [ws, u] of Object.entries(board)) {
      if (u.flag) { totals[ws] = { ...(totals[ws] || {}), flagged: true }; continue; }
      totals[ws] = { ...(totals[ws] || {}), i: u.i, id: u.id, pts: ((totals[ws] || {}).pts || 0) + u.pts };
    }
  }
  const best = Object.entries(totals).filter(([, t]) => !t.flagged && t.pts > 0).sort((a, b) => b[1].pts - a[1].pts);
  for (const [ws, t] of best) {
    const b = await getBill(env, ws);
    if (!b || !b.subActive || !b.subscription) continue; // precisa continuar no mensal
    let applied = false;
    try {
      let coupon = await env.CAL.get('rank-coupon');
      if (!coupon) { const c = await stripe(env, 'coupons', { percent_off: 100, duration: 'once', name: 'Lembra · campeão do mês (1 mês grátis)' }); coupon = c.id; await env.CAL.put('rank-coupon', coupon); }
      await stripe(env, `subscriptions/${b.subscription}`, { discounts: [{ coupon }] });
      applied = true;
    } catch (e) { console.log('ranking prêmio', e.message); }
    b.rankWins = [...(b.rankWins || []), { month, at: now, applied }];
    await putBill(env, ws, b);
    const winners = (await env.CAL.get('rank-winners', 'json')) || [];
    winners.unshift({ month, ws, i: t.i, pts: t.pts, applied, at: now });
    await env.CAL.put('rank-winners', JSON.stringify(winners.slice(0, 24)));
    if (t.id) await notify(t.id, { title: '🏆 Você foi o nº 1 do mês!', body: 'Parabéns! Seu próximo mês do Lembra é por nossa conta: a próxima fatura vem zerada.', tag: 'ranking', url: './#/ranking' }).catch(() => 0);
    return { month, ws, pts: t.pts, applied };
  }
  return { month, ws: null };
}
