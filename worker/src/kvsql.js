/* Armazenamento do servidor dentro de um Durable Object com SQLite (plano grátis da Cloudflare):
   - "kv": a mesma interface do Workers KV (get/put/delete), mas sem o limite de 1.000 gravações/dia
     e sem disputa entre pedidos ao mesmo tempo (o objeto atende um de cada vez).
   - "due": a fila de "quando olhar cada pessoa de novo" (lembretes, amigo, dicas), para o relógio
     só mexer em quem tem algo vencendo, em vez de reler todo mundo a cada minuto.
   O mesmo código roda nos testes com o SQLite do Node (node:sqlite). */

/* sql: objeto com exec(query, ...params) → cursor com toArray()/one() (Cloudflare) */
export function makeKv(sql, meter = {}) {
  sql.exec(`CREATE TABLE IF NOT EXISTS kv (k TEXT PRIMARY KEY, v TEXT NOT NULL, exp INTEGER)`);
  sql.exec('CREATE INDEX IF NOT EXISTS kv_exp ON kv(exp) WHERE exp IS NOT NULL'); // a limpeza do que venceu não precisa ler o banco inteiro
  const count = (key, n = 1, k = null) => { meter[key] = (meter[key] || 0) + n; if (meter.detail && k) { const p = String(k).split(':')[0]; meter.detail[key + ':' + p] = (meter.detail[key + ':' + p] || 0) + n; } };
  const rowOf = (k) => { const r = sql.exec('SELECT v, exp FROM kv WHERE k = ?', k).toArray(); count('rowsRead'); return r[0] || null; };
  // chaves lidas o tempo todo (o registro de quem usa o app): o objeto já lido fica na memória
  // (o servidor é um só, então a memória está sempre igual ao banco)
  const HOT = new Set(['vapid', 'admin-member']);
  const hot = new Map();
  return {
    async get(k, type) {
      if (type === 'json' && HOT.has(k) && hot.has(k)) return hot.get(k);
      const r = rowOf(String(k));
      if (!r) return null;
      if (r.exp && r.exp < Date.now()) { sql.exec('DELETE FROM kv WHERE k = ?', String(k)); count('rowsWritten'); return null; }
      if (type === 'json') { try { const o = JSON.parse(r.v); if (HOT.has(k)) hot.set(k, o); return o; } catch { return null; } }
      return r.v;
    },
    async put(k, v, opts = {}) {
      hot.delete(k);
      const ttl = Number(opts.expirationTtl) || 0;
      const exp = opts.expiration ? Number(opts.expiration) * 1000 : ttl ? Date.now() + ttl * 1000 : null;
      sql.exec('INSERT INTO kv (k, v, exp) VALUES (?, ?, ?) ON CONFLICT(k) DO UPDATE SET v = excluded.v, exp = excluded.exp', String(k), typeof v === 'string' ? v : String(v), exp);
      count('rowsWritten', 1, k);
    },
    async delete(k) { hot.delete(k); sql.exec('DELETE FROM kv WHERE k = ?', String(k)); count('rowsWritten', 1, k); },
    /* limpeza das chaves vencidas (poucas por vez) */
    sweep(limit = 50) {
      const r = sql.exec('SELECT k FROM kv WHERE exp IS NOT NULL AND exp < ? LIMIT ?', Date.now(), limit).toArray();
      for (const { k } of r) sql.exec('DELETE FROM kv WHERE k = ?', k);
      count('rowsRead', r.length); count('rowsWritten', r.length);
      return r.length;
    },
    keys() { return sql.exec('SELECT k FROM kv').toArray().map((r) => r.k); },
    /* todas as chaves que começam com um prefixo (usa o índice da chave: lê só essas linhas) */
    async scan(prefix) {
      const rows = sql.exec('SELECT k, v FROM kv WHERE k >= ? AND k < ?', prefix, prefix + '\uffff').toArray();
      count('rowsRead', rows.length);
      return rows.map((r) => [r.k, r.v]);
    },
  };
}

/* Fila de horários. Lembretes ("rem:"/"per:") ficam gravados na hora (uma linha cada);
   as checagens do amigo e das dicas ("amg:"/"cch:") ficam na memória e vão para o banco numa
   foto única a cada 10 minutos (uma gravação só para todo mundo). */
const DURABLE = /^(rem|per):/;
export function makeDue(sql, kv, meter = {}) {
  sql.exec(`CREATE TABLE IF NOT EXISTS due (k TEXT PRIMARY KEY, at INTEGER NOT NULL)`);
  const count = (key, n = 1) => { meter[key] = (meter[key] || 0) + n; };
  const mem = new Map();
  let loaded = false, dirtyAt = 0, savedAt = Date.now(), shape = false;
  const load = async () => {
    if (loaded) return;
    const rows = sql.exec('SELECT k, at FROM due').toArray();
    count('rowsRead', rows.length);
    for (const r of rows) mem.set(r.k, r.at);
    const snap = await kv.get('due-snap', 'json');
    if (snap && typeof snap === 'object') for (const [k, at] of Object.entries(snap)) if (!mem.has(k) && Number.isFinite(at)) mem.set(k, at);
    loaded = true;
  };
  const api = {
    async get(k) { await load(); return mem.has(k) ? mem.get(k) : null; },
    async set(k, at) {
      await load();
      at = Math.round(at);
      if (mem.get(k) === at) return;
      if (!mem.has(k)) shape = true;
      mem.set(k, at);
      if (DURABLE.test(k)) { sql.exec('INSERT INTO due (k, at) VALUES (?, ?) ON CONFLICT(k) DO UPDATE SET at = excluded.at', k, at); count('rowsWritten'); if (meter.detail) meter.detail['rowsWritten:due-' + k.split(':')[0]] = (meter.detail['rowsWritten:due-' + k.split(':')[0]] || 0) + 1; }
      else dirtyAt = dirtyAt || Date.now();
    },
    async del(k) {
      await load();
      if (!mem.has(k)) return;
      mem.delete(k);
      shape = true;
      if (DURABLE.test(k)) { sql.exec('DELETE FROM due WHERE k = ?', k); count('rowsWritten'); }
      else dirtyAt = dirtyAt || Date.now();
    },
    /* quem está vencendo agora, do mais atrasado para o mais novo */
    async dueBefore(now, limit = 200) {
      await load();
      const out = [];
      for (const [k, at] of mem) if (at <= now) out.push([k, at]);
      out.sort((a, b) => a[1] - b[1]);
      return out.slice(0, limit);
    },
    async size() { await load(); return mem.size; },
    /* grava a foto das checagens (no máximo a cada 10 min, ou já, se pedido) */
    async flush(force = false) {
      if (!dirtyAt) return false;
      // alguém entrou ou saiu da fila: grava já (horários que só mudaram podem esperar 10 min)
      if (!force && !shape && Date.now() - savedAt < 10 * 60e3) return false;
      const snap = {};
      for (const [k, at] of mem) if (!DURABLE.test(k)) snap[k] = at;
      await kv.put('due-snap', JSON.stringify(snap));
      dirtyAt = 0; savedAt = Date.now(); shape = false;
      return true;
    },
  };
  return api;
}

/* Versão para os testes antigos (KV em memória): a fila mora numa chave só */
export function kvDue(kv) {
  const KEY = 'due-map';
  const read = async () => (await kv.get(KEY, 'json')) || {};
  return {
    async get(k) { const m = await read(); return k in m ? m[k] : null; },
    async set(k, at) { const m = await read(); m[k] = Math.round(at); await kv.put(KEY, JSON.stringify(m)); },
    async del(k) { const m = await read(); if (k in m) { delete m[k]; await kv.put(KEY, JSON.stringify(m)); } },
    async dueBefore(now, limit = 200) { const m = await read(); return Object.entries(m).filter(([, at]) => at <= now).sort((a, b) => a[1] - b[1]).slice(0, limit); },
    async size() { return Object.keys(await read()).length; },
    async flush() { return false; },
  };
}
const dues = new WeakMap();
/* a fila de um ambiente: a do Durable Object (env.DUE) ou a versão em chave única */
export function dueOf(env) {
  if (env.DUE) return env.DUE;
  let d = dues.get(env.CAL);
  if (!d) { d = kvDue(env.CAL); dues.set(env.CAL, d); }
  return d;
}
