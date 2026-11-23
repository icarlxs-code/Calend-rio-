/* Equipe interna do Lembra: cada pessoa da empresa entra com o próprio login e vê SÓ o que o cargo precisa
   (princípio do menor acesso). O dono (ADMIN_EMAIL) cadastra e tira pessoas e cargos.
   Nenhum cargo vê agenda, notas, CPF, celular ou e-mail de usuários: as métricas são números agregados. */

export const CARGOS = {
  admin: { nome: 'Administração', perms: ['metricas', 'suporte', 'denuncias', 'receita', 'equipe_ver'] },
  suporte: { nome: 'Suporte', perms: ['suporte'] },
  moderacao: { nome: 'Moderação', perms: ['denuncias'] },
  marketing: { nome: 'Marketing e crescimento', perms: ['metricas'] },
  analista: { nome: 'Dados e análise', perms: ['metricas'] },
  financeiro: { nome: 'Financeiro', perms: ['metricas', 'receita'] },
  rh: { nome: 'Pessoas e cultura (RH)', perms: ['equipe_ver'] },
  produto: { nome: 'Produto e design', perms: ['metricas', 'suporte'] },
};
const DONO = ['metricas', 'suporte', 'denuncias', 'receita', 'equipe_ver', 'equipe_editar'];

const ownerMail = (env) => (env.ADMIN_EMAIL || JSON.parse(env.TEAM || '[]')[0]?.email || '').toLowerCase();
export const isOwner = (env, me) => !!ownerMail(env) && (me.email || '').toLowerCase() === ownerMail(env);
const mailOk = (e) => /^[^@\s]{1,64}@[^@\s]{1,120}\.[a-z]{2,}$/i.test(e || '');

export async function staffOf(env) { return (await env.CAL.get('staff', 'json')) || {}; }
export async function permsOf(env, me) {
  if (isOwner(env, me)) return { cargos: ['dono'], perms: DONO };
  const s = (await staffOf(env))[(me.email || '').toLowerCase()];
  if (!s || !me.email) return { cargos: [], perms: [] };
  return { cargos: s.cargos, perms: [...new Set(s.cargos.flatMap((c) => CARGOS[c]?.perms || []))] };
}
export async function pode(env, me, perm) { return (await permsOf(env, me)).perms.includes(perm); }

/* números da plataforma (sem dado pessoal), guardados por 10 min para não pesar */
export async function metricas(env, now = Date.now()) {
  const c = await env.CAL.get('metricas-cache', 'json');
  if (c && now - c.at < 10 * 60e3) return c;
  const scan = async (p) => (env.CAL.scan ? await env.CAL.scan(p) : []);
  const parse = (v) => { try { return typeof v === 'string' ? JSON.parse(v) : v; } catch { return null; } };
  const DAY = 864e5;
  const cards = (await scan('card:')).map(([, v]) => parse(v)).filter(Boolean);
  const vistos = (await scan('ls:')).map(([, v]) => Number(v) || 0);
  const amigos = (await scan('friends:')).map(([, v]) => (parse(v) || []).length);
  const stories = (await scan('stories:')).map(([, v]) => (parse(v) || []).filter((x) => now - x.at < DAY).length);
  const premios = (await scan('fprem:')).flatMap(([, v]) => parse(v) || []);
  const perto = (await scan('geop:')).length;
  const reg = (await scan('reg:')).map(([, v]) => parse(v)).filter(Boolean);
  const denuncias = ((await env.CAL.get('reports', 'json')) || []);
  const desde = cards.map((x) => x.since || 0).filter(Boolean);
  const porDia = {};
  for (const t of desde) if (now - t < 30 * DAY) { const k = new Date(t - 3 * 3600e3).toISOString().slice(0, 10); porDia[k] = (porDia[k] || 0) + 1; }
  const out = {
    at: now,
    contas: Math.max(cards.length, reg.length),
    novas: { hoje: desde.filter((t) => now - t < DAY).length, semana: desde.filter((t) => now - t < 7 * DAY).length, mes: desde.filter((t) => now - t < 30 * DAY).length, porDia },
    ativos: { dia: vistos.filter((t) => now - t < DAY).length, semana: vistos.filter((t) => now - t < 7 * DAY).length, mes: vistos.filter((t) => now - t < 30 * DAY).length, agora: vistos.filter((t) => now - t < 5 * 60e3).length },
    social: {
      amizades: Math.round(amigos.reduce((a, b) => a + b, 0) / 2),
      comAmigos: amigos.filter((n) => n > 0).length,
      storiesHoje: stories.reduce((a, b) => a + b, 0),
      quemPostouHoje: stories.filter((n) => n > 0).length,
      convitesQueViraramConta: premios.filter((p) => p.tipo === 'convite').length,
      pertoLigado: perto,
    },
    niveis: { medio: cards.length ? Math.round(cards.reduce((a, x) => a + (x.level || 0), 0) / cards.length) : 0, acima10: cards.filter((x) => (x.level || 0) >= 10).length },
    menores: cards.filter((x) => x.teen).length,
    denunciasAbertas: denuncias.filter((d) => !d.resolvida).length,
  };
  await env.CAL.put('metricas-cache', JSON.stringify(out));
  return out;
}

/* rotas da equipe: /staff/me, /staff/list, /staff/set, /staff/remove, /staff/metrics, /staff/reports, /staff/report-action */
export async function staffRoute(env, me, path, body, reply) {
  const P = await permsOf(env, me);
  const tem = (p) => P.perms.includes(p);
  if (path === '/staff/me') return reply({ ok: true, ...P, nomes: Object.fromEntries(Object.entries(CARGOS).map(([k, v]) => [k, v.nome])) });
  if (!P.perms.length) return reply({ error: 'Só para a equipe do Lembra.' }, 403);
  if (path === '/staff/list') {
    if (!tem('equipe_ver')) return reply({ error: 'Seu cargo não vê a equipe.' }, 403);
    const s = await staffOf(env);
    return reply({ ok: true, equipe: Object.entries(s).map(([email, v]) => ({ email, ...v })).sort((a, b) => a.at - b.at), cargos: Object.fromEntries(Object.entries(CARGOS).map(([k, v]) => [k, { nome: v.nome, perms: v.perms }])) });
  }
  if (path === '/staff/set' || path === '/staff/remove') {
    if (!tem('equipe_editar')) return reply({ error: 'Só o dono mexe na equipe.' }, 403);
    const email = String(body.email || '').trim().toLowerCase();
    if (!mailOk(email)) return reply({ error: 'E-mail inválido.' }, 400);
    if (email === ownerMail(env)) return reply({ error: 'O dono já tem acesso total.' }, 400);
    const s = await staffOf(env);
    if (path === '/staff/remove') delete s[email];
    else {
      const cargos = (Array.isArray(body.cargos) ? body.cargos : []).filter((c) => CARGOS[c]);
      if (!cargos.length) return reply({ error: 'Escolha pelo menos um cargo.' }, 400);
      s[email] = { nome: String(body.nome || '').slice(0, 60), cargos, at: s[email]?.at || Date.now(), por: me.email };
    }
    await env.CAL.put('staff', JSON.stringify(s));
    return reply({ ok: true });
  }
  if (path === '/staff/metrics') {
    if (!tem('metricas')) return reply({ error: 'Seu cargo não vê as métricas.' }, 403);
    return reply({ ok: true, m: await metricas(env) });
  }
  if (path === '/staff/reports' || path === '/staff/report-action') {
    if (!tem('denuncias')) return reply({ error: 'Seu cargo não vê denúncias.' }, 403);
    const rep = (await env.CAL.get('reports', 'json')) || [];
    if (path === '/staff/report-action') {
      const i = Number(body.i), r = rep[i];
      if (!r) return reply({ error: 'Denúncia não encontrada.' }, 404);
      if (body.acao === 'remover' && r.id && r.owner) {
        const l = (await env.CAL.get(`stories:${r.owner}`, 'json')) || [];
        await env.CAL.put(`stories:${r.owner}`, JSON.stringify(l.filter((x) => x.id !== r.id)), { expirationTtl: 26 * 3600 });
        await env.CAL.delete(`storyimg:${r.id}`);
      }
      rep[i] = { ...r, resolvida: { acao: body.acao === 'remover' ? 'removido' : 'mantido', por: me.email, at: Date.now() } };
      await env.CAL.put('reports', JSON.stringify(rep));
      return reply({ ok: true });
    }
    // quem denunciou fica anônimo até para a equipe; mostra o nome público de quem foi denunciado
    const cards = {};
    const rows = await Promise.all(rep.slice(0, 200).map(async (r, i) => {
      if (r.owner && !cards[r.owner]) cards[r.owner] = (await env.CAL.get(`card:${r.owner}`, 'json')) || {};
      const vivo = r.id ? !!(await env.CAL.get(`storyimg:${r.id}`)) : false;
      return { i, at: r.at, motivo: r.motivo, alvo: cards[r.owner]?.name || 'Conta', tipo: r.id ? 'story' : 'perfil', storyNoAr: vivo, resolvida: r.resolvida || null };
    }));
    return reply({ ok: true, rows });
  }
  return reply({ error: 'não encontrado' }, 404);
}
