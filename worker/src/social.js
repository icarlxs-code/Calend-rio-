/* Social: curtir, comentar e repostar stories + conversas privadas (texto, foto e áudio).
   Regras que valem sempre:
   - só amigos conversam; bloqueou ou desfez a amizade, não envia mais;
   - tudo some em 24 horas: o relógio do servidor APAGA as linhas (mensagem, foto e áudio) do banco;
   - quem posta decide se aceita comentários e se os amigos podem repostar. Conta de 13 a 17 anos nunca é repostada;
   - apagou o story: somem junto os comentários e os reposts dele.

   Banco (SQLite do Durable Object), pensado para gravar pouco:
   conv  uma linha por dupla (quem, última mensagem, até onde cada um leu, o que cada um limpou)
   msg   chave (dupla, hora, id): ler a conversa e apagar o que venceu usam a própria chave, sem índice extra
   midia foto ou áudio de uma mensagem (some junto com ela) */
export const DIA = 864e5;
export const parDe = (a, b) => (a < b ? `${a}|${b}` : `${b}|${a}`);
const J = (s, d = null) => { try { return s ? JSON.parse(s) : d; } catch { return d; } };

export function makeSocial(sql, meter = {}) {
  sql.exec(`CREATE TABLE IF NOT EXISTS conv (par TEXT PRIMARY KEY, a TEXT NOT NULL, b TEXT NOT NULL, ini INTEGER NOT NULL, ult INTEGER NOT NULL, la INTEGER NOT NULL DEFAULT 0, lb INTEGER NOT NULL DEFAULT 0, ca INTEGER NOT NULL DEFAULT 0, cb INTEGER NOT NULL DEFAULT 0) WITHOUT ROWID`);
  sql.exec('CREATE INDEX IF NOT EXISTS conv_a ON conv(a)');
  sql.exec('CREATE INDEX IF NOT EXISTS conv_b ON conv(b)');
  sql.exec('CREATE INDEX IF NOT EXISTS conv_ini ON conv(ini)');
  sql.exec(`CREATE TABLE IF NOT EXISTS msg (par TEXT NOT NULL, at INTEGER NOT NULL, id TEXT NOT NULL, de TEXT NOT NULL, tipo TEXT NOT NULL, txt TEXT, meta TEXT, reac TEXT, PRIMARY KEY (par, at, id)) WITHOUT ROWID`);
  sql.exec('CREATE TABLE IF NOT EXISTS midia (id TEXT PRIMARY KEY, v TEXT NOT NULL)');
  const q = (s, ...p) => sql.exec(s, ...p).toArray();
  const escreve = (n = 1) => { meter.rowsWritten = (meter.rowsWritten || 0) + n; };
  const conv = (u, o) => q('SELECT * FROM conv WHERE par = ?', parDe(u, o))[0] || null;
  const lado = (c, u) => (c.a === u ? 'a' : 'b');
  const sai = (r, u) => ({ id: r.id, at: r.at, de: r.de, meu: r.de === u, tipo: r.tipo, txt: r.txt || '', ...(J(r.meta) || {}), reac: J(r.reac, {}) });
  const api = {
    envia(de, para, { id, tipo, txt = '', meta = null, midia = null }, now = Date.now()) {
      const par = parDe(de, para), c = conv(de, para), at = Math.max(now, (c ? c.ult : 0) + 1);
      if (midia) { q('INSERT INTO midia (id, v) VALUES (?, ?)', id, midia); escreve(); }
      q('INSERT INTO msg (par, at, id, de, tipo, txt, meta, reac) VALUES (?, ?, ?, ?, ?, ?, ?, NULL)', par, at, id, de, tipo, txt, meta ? JSON.stringify(meta) : null);
      const [a, b] = par.split('|');
      if (!c) q('INSERT INTO conv (par, a, b, ini, ult, la, lb) VALUES (?, ?, ?, ?, ?, ?, ?)', par, a, b, at, at, a === de ? at : 0, b === de ? at : 0);
      else q(`UPDATE conv SET ult = ?, l${lado(c, de)} = ? WHERE par = ?`, at, at, par);
      escreve(2);
      return { id, at };
    },
    acha(u, o, at, id) { const r = q('SELECT * FROM msg WHERE par = ? AND at = ? AND id = ?', parDe(u, o), Number(at) || 0, String(id || ''))[0]; return r || null; },
    lista(u, o, { antes = 0, limite = 60 } = {}, now = Date.now()) {
      const c = conv(u, o); if (!c) return { msgs: [], lidoAte: 0 };
      const corte = Math.max(now - DIA, c['c' + lado(c, u)]), rows = antes
        ? q('SELECT * FROM msg WHERE par = ? AND at > ? AND at < ? ORDER BY at DESC LIMIT ?', c.par, corte, antes, limite)
        : q('SELECT * FROM msg WHERE par = ? AND at > ? ORDER BY at DESC LIMIT ?', c.par, corte, limite);
      return { msgs: rows.reverse().map((r) => sai(r, u)), lidoAte: c['l' + (lado(c, u) === 'a' ? 'b' : 'a')], mais: rows.length === limite };
    },
    /** marca como lido até a última; devolve true se mudou */
    leu(u, o) {
      const c = conv(u, o); if (!c) return 0;
      const k = 'l' + lado(c, u); if (c[k] >= c.ult) return 0;
      q(`UPDATE conv SET ${k} = ? WHERE par = ?`, c.ult, c.par); escreve();
      return c.ult;
    },
    conversas(u, now = Date.now()) {
      const corte = now - DIA;
      return q('SELECT * FROM conv WHERE a = ? OR b = ?', u, u).filter((c) => c.ult > corte && c.ult > c['c' + lado(c, u)]).sort((x, y) => y.ult - x.ult).slice(0, 60).map((c) => {
        const l = lado(c, u), outro = l === 'a' ? c.b : c.a, limpo = Math.max(corte, c['c' + l]);
        const r = q('SELECT * FROM msg WHERE par = ? AND at > ? ORDER BY at DESC LIMIT 1', c.par, limpo)[0];
        const n = q('SELECT COUNT(*) AS n FROM (SELECT 1 FROM msg WHERE par = ? AND at > ? AND de <> ? LIMIT 100)', c.par, Math.max(limpo, c['l' + l]), u)[0].n;
        return r ? { uid: outro, ult: r.at, meu: r.de === u, tipo: r.tipo, txt: (r.txt || '').slice(0, 90), novas: n, unica: !!(J(r.meta) || {}).unica, visto: c['l' + (l === 'a' ? 'b' : 'a')] >= r.at } : null;
      }).filter(Boolean);
    },
    /** o autor apaga para os dois: some o texto e a mídia na hora */
    apaga(u, o, at, id) {
      const r = api.acha(u, o, at, id); if (!r || r.de !== u || r.tipo === 'apagada') return false;
      q("UPDATE msg SET tipo = 'apagada', txt = '', meta = NULL, reac = NULL WHERE par = ? AND at = ? AND id = ?", r.par, r.at, r.id);
      q('DELETE FROM midia WHERE id = ?', r.id); escreve(2);
      return true;
    },
    reage(u, o, at, id, emo) {
      const r = api.acha(u, o, at, id); if (!r || r.tipo === 'apagada') return null;
      const m = J(r.reac, {}); if (!emo || m[u] === emo) delete m[u]; else m[u] = emo;
      q('UPDATE msg SET reac = ? WHERE par = ? AND at = ? AND id = ?', JSON.stringify(m), r.par, r.at, r.id); escreve();
      return m;
    },
    midia(u, o, at, id, now = Date.now(), abrir = false) {
      const r = api.acha(u, o, at, id); if (!r || r.at <= now - DIA) return null;
      const mt = J(r.meta) || {};
      if (mt.unica) { // visualização única: só quem recebeu abre, uma vez, e a mídia é apagada na mesma hora
        if (!abrir || r.de === u || mt.vista) return null;
        const x = q('SELECT v FROM midia WHERE id = ?', r.id)[0]; if (!x) return null;
        q('DELETE FROM midia WHERE id = ?', r.id);
        q('UPDATE msg SET meta = ? WHERE par = ? AND at = ? AND id = ?', JSON.stringify({ ...mt, vista: now }), r.par, r.at, r.id); escreve(2);
        return x.v;
      }
      const m = q('SELECT v FROM midia WHERE id = ?', r.id)[0]; return m ? m.v : null;
    },
    /** limpa a conversa só para quem pediu */
    limpaPara(u, o, now = Date.now()) { const c = conv(u, o); if (!c) return false; q(`UPDATE conv SET c${lado(c, u)} = ?, l${lado(c, u)} = ? WHERE par = ?`, Math.max(now, c.ult), c.ult, c.par); escreve(); return true; },
    /** o relógio: apaga de verdade o que passou de 24 h (poucas duplas por vez) */
    limpa(now = Date.now(), duplas = 60) {
      const corte = now - DIA; let n = 0;
      for (const { par } of q('SELECT par FROM conv WHERE ini <= ? LIMIT ?', corte, duplas)) {
        for (const { id } of q("SELECT id FROM msg WHERE par = ? AND at <= ? AND tipo IN ('foto', 'audio')", par, corte)) { q('DELETE FROM midia WHERE id = ?', id); n++; }
        const t = q('SELECT COUNT(*) AS n FROM msg WHERE par = ? AND at <= ?', par, corte)[0].n;
        q('DELETE FROM msg WHERE par = ? AND at <= ?', par, corte); n += t;
        const m = q('SELECT MIN(at) AS m FROM msg WHERE par = ?', par)[0].m;
        if (m === null) q('DELETE FROM conv WHERE par = ?', par); else q('UPDATE conv SET ini = ? WHERE par = ?', m, par);
        escreve(t + 1);
      }
      return n;
    },
    apagaDupla(u, o) {
      const par = parDe(u, o);
      for (const { id } of q("SELECT id FROM msg WHERE par = ? AND tipo IN ('foto', 'audio')", par)) q('DELETE FROM midia WHERE id = ?', id);
      q('DELETE FROM msg WHERE par = ?', par); q('DELETE FROM conv WHERE par = ?', par); escreve(2);
    },
    apagaConta(u) { for (const c of q('SELECT a, b FROM conv WHERE a = ? OR b = ?', u, u)) api.apagaDupla(c.a, c.b); },
    conta() { return { conv: q('SELECT COUNT(*) AS n FROM conv')[0].n, msg: q('SELECT COUNT(*) AS n FROM msg')[0].n, midia: q('SELECT COUNT(*) AS n FROM midia')[0].n }; },
  };
  return api;
}

const EMO = ['❤️', '😂', '😮', '😢', '👏', '🔥', '😍', '👍', '🙏', '🎉'];
const novoId = () => Array.from(crypto.getRandomValues(new Uint8Array(12)), (x) => 'abcdefghijkmnpqrstuvwxyz23456789'[x % 32]).join('');
const FOTO = /^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/, AUDIO = /^data:audio\/(mp4|aac|x-lembra-mulaw);base64,[A-Za-z0-9+/=]+$/;
const usoMidia = new Map(); // fotos/áudios por pessoa no dia (na memória): protege o espaço grátis
const gastaMidia = (u) => { const d = new Date().toISOString().slice(0, 10), o = usoMidia.get(u); if (!o || o.d !== d) { usoMidia.set(u, { d, n: 1 }); if (usoMidia.size > 5000) usoMidia.clear(); return true; } return ++o.n <= 80; };
const texto = (s, n) => String(s || '').replace(/[\u0000-\u0009\u000B-\u001F\u007F‪-‮⁦-⁩]/g, '').replace(/\n{3,}/g, '\n\n').trim().slice(0, n);

/* Rotas. c: { env, meU, path, body, now, getL, cardOf, isFriend, vivos, memberOf, dormindo, send } → [dados, status] ou null (não é daqui) */
export async function socialRoute(c) {
  const { env, meU, path, body, now, getL, cardOf, isFriend, vivos, memberOf, dormindo, send } = c;
  const CAL = env.CAL, erro = (t, s = 400) => [{ error: t }, s];
  const avisa = (u, o) => { try { env.AVISA && env.AVISA(u, o); } catch { /* ok */ } };
  const bloqueio = async (a, b) => (await getL(`blocks:${a}`)).includes(b) || (await getL(`blocks:${b}`)).includes(a);
  const lista = async (u) => vivos(await getL(`stories:${u}`));
  const guarda = (u, l) => CAL.put(`stories:${u}`, JSON.stringify(l), { expirationTtl: 26 * 3600 });
  const fimDe = (st) => st.fim || st.at + DIA;
  const nome1 = async () => (await cardOf(meU)).name.split(' ')[0];
  const push = async (u, m) => ((await dormindo(u)) ? 0 : send(memberOf(u), m).catch(() => 0));
  /* o story pedido, se esta pessoa pode ver */
  const story = async () => {
    const owner = texto(body.owner, 64), id = texto(body.id, 40);
    if (!(await isFriend(meU, owner))) return { e: erro('Só amigos veem os stories.', 403) };
    const l = await lista(owner), st = l.find((x) => x.id === id);
    if (!st || (st.rp && (await bloqueio(st.rp.uid, meU)))) return { e: erro('Esse story já sumiu.', 404) };
    return { owner, id, l, st };
  };

  // ---------- stories ----------
  if (path === '/friends/story-like') {
    const s = await story(); if (s.e) return s.e;
    if (s.owner === meU) return erro('Esse story é seu 😄');
    s.st.likes = s.st.likes || {};
    const on = body.on !== false;
    if (on === !!s.st.likes[meU]) return [{ ok: true, on }];
    if (on) s.st.likes[meU] = now; else delete s.st.likes[meU];
    await guarda(s.owner, s.l);
    if (on) avisa(s.owner, { t: 'gostou', id: s.id, de: meU, nome: await nome1() });
    return [{ ok: true, on }];
  }
  if (path === '/friends/story-comments') {
    const s = await story(); if (s.e) return s.e;
    const [meus] = [await getL(`blocks:${meU}`)], cs = (await getL(`storycom:${s.id}`)).filter((x) => !meus.includes(x.u));
    const cards = new Map();
    for (const x of cs) if (!cards.has(x.u)) { const k = await cardOf(x.u); cards.set(x.u, { name: k.name, photo: k.photo, color: k.color }); }
    return [{ ok: true, pode: s.st.podeCom === true, comentarios: cs.map((x) => ({ id: x.c, uid: x.u, t: x.t, at: x.at, meu: x.u === meU, apaga: x.u === meU || s.owner === meU, ...cards.get(x.u) })) }];
  }
  if (path === '/friends/story-comment') {
    const s = await story(); if (s.e) return s.e;
    if (s.st.podeCom !== true) return erro('Este story não aceita comentários.', 403);
    const t = texto(body.text, 200); if (!t) return erro('Escreva o comentário.');
    const cs = await getL(`storycom:${s.id}`);
    if (cs.length >= 80) return erro('Este story já tem muitos comentários.', 429);
    if (cs.filter((x) => x.u === meU).length >= 6) return erro('Você já comentou bastante neste story 😄', 429);
    const k = { c: novoId(), u: meU, t, at: now };
    cs.push(k);
    await CAL.put(`storycom:${s.id}`, JSON.stringify(cs), { expirationTtl: Math.max(60, Math.ceil((fimDe(s.st) - now) / 1000)) });
    s.st.ncom = cs.length; await guarda(s.owner, s.l);
    if (s.owner !== meU) {
      const n = await nome1();
      avisa(s.owner, { t: 'comentou', id: s.id, de: meU, nome: n });
      if (!cs.some((x) => x.u === meU && x.c !== k.c && now - x.at < 10 * 60e3)) await push(s.owner, { title: `💬 ${n} comentou no seu story`, body: 'Toque pra ver antes que suma.', tag: `com-${s.id}`, url: './#/stories' });
    }
    return [{ ok: true, id: k.c, at: now, n: cs.length }];
  }
  if (path === '/friends/story-comment-del') {
    const s = await story(); if (s.e) return s.e;
    const cid = texto(body.cid, 40), cs = await getL(`storycom:${s.id}`), k = cs.find((x) => x.c === cid);
    if (!k) return erro('Comentário não encontrado.', 404);
    if (k.u !== meU && s.owner !== meU) return erro('Você só apaga os seus comentários.', 403);
    const nv = cs.filter((x) => x.c !== cid);
    await CAL.put(`storycom:${s.id}`, JSON.stringify(nv), { expirationTtl: Math.max(60, Math.ceil((fimDe(s.st) - now) / 1000)) });
    s.st.ncom = nv.length; await guarda(s.owner, s.l);
    return [{ ok: true, n: nv.length }];
  }
  if (path === '/friends/story-repost') {
    const s = await story(); if (s.e) return s.e;
    const dono = s.st.rp ? s.st.rp.uid : s.owner, idO = s.st.rp ? s.st.rp.id : s.id;
    if (dono === meU) return erro('Esse story já é seu 😄');
    const lo = await lista(dono), o = lo.find((x) => x.id === idO);
    if (!o) return erro('Esse story já sumiu.', 404);
    const cd = await cardOf(dono);
    if (o.podeRp !== true || cd.teen) return erro(`${cd.name.split(' ')[0]} não liberou repostar este story.`, 403);
    if (await bloqueio(dono, meU)) return erro('Esse story já sumiu.', 404);
    const meus = await lista(meU);
    if (meus.some((x) => x.rp && x.rp.id === idO)) return erro('Você já repostou este story.');
    if (meus.length >= 10) return erro('Você já postou 10 stories hoje. Espere alguns sumirem.', 429);
    const id = novoId();
    meus.push({ id, at: now, fim: fimDe(o), title: '', caption: texto(body.caption, 120), ref: '', livre: true, views: {}, podeCom: body.podeCom !== false, podeRp: false, rp: { uid: dono, id: idO, name: cd.name } });
    await guarda(meU, meus);
    o.reps = { ...(o.reps || {}), [meU]: id }; await guarda(dono, lo);
    const n = await nome1();
    avisa(dono, { t: 'repostou', id: idO, de: meU, nome: n });
    await push(dono, { title: `🔁 ${n} repostou seu story`, body: 'Toque pra ver. Se não quiser, apague o seu: o repost some junto.', tag: `rp-${idO}`, url: './#/stories' });
    return [{ ok: true, id }];
  }

  // ---------- conversas ----------
  if (!/^\/friends\/(msg-|convs$)/.test(path)) return null;
  const organizado = async (u) => { const o = (await CAL.get(`convcfg:${u}`, 'json')) || {}; return { fix: o.fix || [], arq: o.arq || [], tra: o.tra || [] }; };
  const S = env.SOCIAL; if (!S) return erro('As mensagens ainda não estão disponíveis.', 503);
  if (path === '/friends/convs') {
    const l = S.conversas(meU, now), mudos = await getL(`mudo:${meU}`), amigos = await getL(`friends:${meU}`);
    const rows = await Promise.all(l.map(async (x) => { const k = await cardOf(x.uid); return { ...x, name: k.name, photo: k.photo, color: k.color, amigo: amigos.includes(x.uid), mudo: mudos.includes(x.uid), online: env.VISIVEL && env.VISIVEL(x.uid) ? now : 0 }; }));
    const cfg = (await CAL.get(`mcfg:${meU}`, 'json')) || {}, org = await organizado(meU);
    return [{ ok: true, convs: rows.map((r) => (cfg.semLido ? { ...r, visto: false } : r)), total: rows.reduce((a, x) => a + (x.mudo || org.arq.includes(x.uid) ? 0 : x.novas), 0), cfg: org, semLido: !!cfg.semLido }];
  }
  if (path === '/friends/msg-organiza') {
    const u = texto(body.com, 64), campo = ['fix', 'arq', 'tra'].includes(body.campo) ? body.campo : '';
    if (!campo || !/^[A-Za-z0-9]{6,64}$/.test(u) || u === meU) return erro('Conversa inválida.');
    const g = await organizado(meU); g[campo] = g[campo].filter((x) => x !== u);
    if (body.on === true) {
      if (!(await getL(`friends:${meU}`)).includes(u)) return erro('Só conversas com amigos.', 403);
      if (campo === 'fix' && g.fix.length >= 5) return erro('Você pode fixar até 5 conversas.');
      g[campo].push(u); g[campo] = g[campo].slice(-200); if (campo === 'arq') g.fix = g.fix.filter((x) => x !== u); if (campo === 'fix') g.arq = g.arq.filter((x) => x !== u);
    }
    await CAL.put(`convcfg:${meU}`, JSON.stringify(g)); return [{ ok: true, cfg: g }];
  }
  if (path === '/friends/msg-config') { await CAL.put(`mcfg:${meU}`, JSON.stringify({ semLido: body.semLido === true })); return [{ ok: true, semLido: body.semLido === true }]; }
  const com = texto(body.com, 64);
  if (!/^[A-Za-z0-9]{6,64}$/.test(com) || com === meU) return erro('Conversa inválida.');
  const semLido = async (u) => !!((await CAL.get(`mcfg:${u}`, 'json')) || {}).semLido;

  if (path === '/friends/msg-list') {
    const amigo = await isFriend(meU, com), r = S.lista(meU, com, { antes: Number(body.antes) || 0 }, now), k = await cardOf(com);
    const esconde = (await semLido(meU)) || (await semLido(com)); // quem desliga a confirmação também deixa de ver a dos outros
    if (!body.antes) { const ate = S.leu(meU, com); if (ate && !esconde) avisa(com, { t: 'lida', de: meU, ate }); if (ate) avisa(meU, { t: 'li', com }); }
    return [{ ok: true, msgs: r.msgs, mais: !!r.mais, lidoAte: esconde ? 0 : r.lidoAte, amigo, com: { uid: com, name: k.name, photo: k.photo, color: k.color, teen: k.teen }, online: amigo && env.VISIVEL && env.VISIVEL(com) ? now : amigo ? +(await CAL.get(`ls:${com}`)) || 0 : 0, mudo: (await getL(`mudo:${meU}`)).includes(com) }];
  }
  if (path === '/friends/msg-media') { const v = S.midia(meU, com, body.at, body.id, now, body.abrir === true); if (v && body.abrir === true) avisa(com, { t: 'mudou', de: meU }); return v ? [{ ok: true, v }] : erro('Isso já sumiu.', 404); }
  if (path === '/friends/msg-del') { if (!S.apaga(meU, com, body.at, body.id)) return erro('Não dá mais para apagar.', 404); avisa(com, { t: 'mudou', de: meU }); return [{ ok: true }]; }
  if (path === '/friends/msg-clear') { S.limpaPara(meU, com, now); return [{ ok: true }]; }
  if (path === '/friends/msg-mute') { const m = (await getL(`mudo:${meU}`)).filter((x) => x !== com); if (body.on === true) m.push(com); await CAL.put(`mudo:${meU}`, JSON.stringify(m.slice(-200))); return [{ ok: true, mudo: body.on === true }]; }
  if (!(await isFriend(meU, com))) return erro('Só amigos conversam no privado.', 403);
  if (await bloqueio(meU, com)) return erro('Não dá para enviar para essa pessoa.', 403);
  if (path === '/friends/msg-react') {
    const emo = EMO.includes(body.emo) ? body.emo : '', m = S.reage(meU, com, body.at, body.id, emo);
    if (!m) return erro('Essa mensagem já sumiu.', 404);
    avisa(com, { t: 'mudou', de: meU }); return [{ ok: true, reac: m }];
  }
  if (path === '/friends/msg-send') {
    const tipo = ['txt', 'foto', 'audio', 'story'].includes(body.tipo) ? body.tipo : 'txt', meta = {};
    const txt = texto(body.txt, 1000); let midia = null;
    if (tipo === 'txt' && !txt) return erro('Escreva a mensagem.');
    if (tipo === 'foto') { midia = typeof body.midia === 'string' && body.midia.length < 420000 && FOTO.test(body.midia) ? body.midia : null; if (!midia) return erro('Foto inválida.'); meta.w = Math.max(1, Math.min(4000, Math.round(Number(body.w) || 3))); meta.h = Math.max(1, Math.min(4000, Math.round(Number(body.h) || 4))); }
    if (tipo === 'audio') {
      midia = typeof body.midia === 'string' && body.midia.length < 1250000 && AUDIO.test(body.midia) ? body.midia : null;
      const dur = Number(body.dur) || 0;
      if (!midia || dur < 0.4 || dur > 92) return erro('Áudio inválido (até 1 minuto e meio).');
      meta.dur = Math.round(dur * 10) / 10;
      meta.onda = (Array.isArray(body.onda) ? body.onda : []).slice(0, 44).map((x) => Math.max(0, Math.min(100, Math.round(Number(x) || 0))));
    }
    if (midia && body.unica === true) {
      if ((await cardOf(meU)).teen || (await cardOf(com)).teen) return erro('Visualização única não fica disponível para menores de 18 anos.', 403);
      meta.unica = true;
    }
    if (midia && !gastaMidia(meU)) return erro('Você já mandou muitas fotos e áudios hoje. Amanhã libera de novo.', 429);
    if (tipo === 'story') {
      const owner = texto(body.owner, 64), id = texto(body.id, 40), l = await lista(owner), st = l.find((x) => x.id === id);
      if (owner !== com || !st) return erro('Esse story já sumiu.', 404);
      if (!txt) return erro('Escreva a resposta.');
      meta.st = { owner, id };
    }
    if (body.resp && body.resp.id) { const r = S.acha(meU, com, body.resp.at, body.resp.id); if (r && r.tipo !== 'apagada') meta.resp = { id: r.id, at: r.at, de: r.de, tipo: r.tipo, txt: (J(r.meta) || {}).unica ? '' : (r.txt || '').slice(0, 90) }; }
    const r = S.envia(meU, com, { id: novoId(), tipo, txt, meta: Object.keys(meta).length ? meta : null, midia }, now);
    avisa(com, { t: 'msg', de: meU }); avisa(meU, { t: 'eu', com });
    const org = await organizado(com);
    if (!(env.VISIVEL && env.VISIVEL(com)) && !(await getL(`mudo:${com}`)).includes(meU) && !org.arq.includes(meU)) {
      if (org.tra.includes(meU)) { await push(com, { title: '🔒 Nova mensagem', body: 'Em uma conversa trancada.', tag: 'msg-trancada', url: './#/privado' }); return [{ ok: true, ...r }]; }
      const n = await nome1();
      await push(com, { title: n, body: tipo === 'foto' ? '📷 Te mandou uma foto' : tipo === 'audio' ? '🎤 Te mandou um áudio' : tipo === 'story' ? '💬 Respondeu ao seu story' : '💬 Te mandou uma mensagem', tag: `msg-${meU}`, url: `./#/privado/${meU}` });
    }
    return [{ ok: true, ...r }];
  }
  return erro('Pedido desconhecido.', 404);
}
