/* Ranking mundial do Lembra: GERAL (XP desde sempre) e MENSAL (XP ganho no mês; zera todo dia 1º).
   Todo mundo vê o top e a própria posição (ex.: 599º de 2.340) com os pontos.
   - No servidor (Durable Object): uma linha por pessoa na tabela "lb" + o placar inteiro na memória,
     ordenado; a posição sai por busca binária (não gasta leitura do banco a cada consulta).
   - Anti-trapaça: o XP só sobe, e no máximo um tanto por dia (o app já limita o XP diário). */
export const monthKey = (now = Date.now()) => new Date(now - 3 * 3600e3).toISOString().slice(0, 7); // mês de Brasília
const DAY_MAX = 3000; // XP máximo que uma conta pode subir por dia (900 de tarefas + emblemas)

function cleanEntry(uid, b, prev, now) {
  const mon = monthKey(now);
  const day = new Date(now - 3 * 3600e3).toISOString().slice(0, 10);
  const xp0 = prev?.xp || 0;
  // quanto já subiu hoje (o teto vale por dia)
  const usedToday = prev?.day === day ? prev.dayGain || 0 : 0;
  const wantXp = Math.max(0, Math.min(5e6, Math.round(Number(b.xp) || 0)));
  const room = Math.max(0, DAY_MAX - usedToday);
  const xp = prev ? Math.max(xp0, Math.min(wantXp, xp0 + room)) : Math.min(wantXp, 200000); // primeira vez: aceita o histórico
  const gained = prev ? xp - xp0 : 0;
  const sameMon = prev?.mon === mon;
  const mxpWant = b.month === mon ? Math.max(0, Math.round(Number(b.mxp) || 0)) : 0;
  const mxp0 = sameMon ? prev.mxp || 0 : 0;
  const mxp = Math.max(mxp0, Math.min(mxpWant, mxp0 + Math.max(gained, prev ? 0 : mxpWant), 120000));
  const photo = typeof b.photo === 'string' && b.photo.length < 16000 && /^data:image\/(png|jpe?g|webp);base64,[A-Za-z0-9+/=]+$/.test(b.photo) ? b.photo : (prev?.photo || null);
  return {
    uid, name: String(b.name || prev?.name || 'Alguém').trim().slice(0, 30), photo: b.hide ? null : photo,
    color: /^#[0-9a-fA-F]{6}$/.test(b.color || '') ? b.color : prev?.color || '#7C5CFF',
    level: Math.max(0, Math.min(100, Math.round(Number(b.level) || 0))), streak: Math.max(0, Math.min(3650, Math.round(Number(b.streak) || 0))),
    xp, mon, mxp, day, dayGain: (prev?.day === day ? prev.dayGain || 0 : 0) + Math.max(0, gained),
    hide: !!b.hide, vip: !!b.vip, at: now,
  };
}
const pub = (e, pos) => ({ pos, uid: e.uid, name: e.hide ? 'Pessoa anônima' : e.name, photo: e.hide ? null : e.photo, color: e.color, level: e.level, streak: e.streak, vip: e.vip });

/* placar em memória sobre qualquer armazenamento (SQL no servidor, chave única nos testes) */
function board(load, save) {
  let all = null, sorted = { all: null, month: null }, mon = '';
  const ensure = async () => { if (!all) { all = new Map(); for (const e of await load()) all.set(e.uid, e); } };
  const rank = (kind, now) => {
    const m = monthKey(now);
    if (m !== mon) { mon = m; sorted.month = null; }
    if (!sorted[kind]) {
      const val = kind === 'all' ? (e) => e.xp : (e) => (e.mon === m ? e.mxp : 0);
      sorted[kind] = [...all.values()].filter((e) => val(e) > 0).map((e) => ({ e, v: val(e) })).sort((a, b) => b.v - a.v || a.e.at - b.e.at);
    }
    return sorted[kind];
  };
  return {
    async report(uid, body, now = Date.now()) {
      await ensure();
      const e = cleanEntry(uid, body, all.get(uid), now);
      all.set(uid, e);
      sorted = { all: null, month: null };
      await save(e);
      return e;
    },
    async view(uid, kind = 'all', { limit = 50, now = Date.now() } = {}) {
      await ensure();
      const list = rank(kind === 'month' ? 'month' : 'all', now);
      const top = list.slice(0, limit).map((x, i) => ({ ...pub(x.e, i + 1), points: x.v }));
      const i = list.findIndex((x) => x.e.uid === uid);
      const me = all.get(uid);
      const mine = i >= 0 ? { ...pub(list[i].e, i + 1), points: list[i].v } : me ? { ...pub(me, null), points: 0 } : null;
      // quem está logo acima (para "faltam X pontos para passar fulano")
      const above = i > 0 ? { ...pub(list[i - 1].e, i), points: list[i - 1].v } : null;
      return { kind: kind === 'month' ? 'month' : 'all', month: monthKey(now), total: list.length, top, me: mine, above };
    },
    async remove(uid) { await ensure(); all.delete(uid); sorted = { all: null, month: null }; },
  };
}

/* Durable Object: tabela própria (uma linha por pessoa) */
export function sqlBoard(sql, meter = {}) {
  sql.exec('CREATE TABLE IF NOT EXISTS lb (uid TEXT PRIMARY KEY, v TEXT NOT NULL)');
  const b = board(
    async () => { const rows = sql.exec('SELECT v FROM lb').toArray(); meter.rowsRead = (meter.rowsRead || 0) + rows.length; return rows.map((r) => { try { return JSON.parse(r.v); } catch { return null; } }).filter(Boolean); },
    async (e) => { sql.exec('INSERT INTO lb (uid, v) VALUES (?, ?) ON CONFLICT(uid) DO UPDATE SET v = excluded.v', e.uid, JSON.stringify(e)); meter.rowsWritten = (meter.rowsWritten || 0) + 1; },
  );
  const rm = b.remove;
  b.remove = async (uid) => { await rm(uid); sql.exec('DELETE FROM lb WHERE uid = ?', uid); };
  return b;
}
/* testes (KV em memória): todo mundo numa chave */
const kvBoards = new WeakMap();
export function boardOf(env) {
  if (env.LB) return env.LB;
  let b = kvBoards.get(env.CAL);
  if (!b) {
    b = board(async () => Object.values((await env.CAL.get('lb-all', 'json')) || {}), async (e) => { const m = (await env.CAL.get('lb-all', 'json')) || {}; m[e.uid] = e; await env.CAL.put('lb-all', JSON.stringify(m)); });
    kvBoards.set(env.CAL, b);
  }
  return b;
}
