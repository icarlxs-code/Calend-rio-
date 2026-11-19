/* "Coach": a cada ~1h30–2h30 (das 8h30 às 21h30) manda para cada um uma dica,
   cobrança ou motivação sobre as empresas, usando a agenda e as trends do Brasil. */
const MODELS = ['@cf/meta/llama-3.3-70b-instruct-fp8-fast', '@cf/meta/llama-3.1-8b-instruct-fast'];
const KINDS = ['cobranca', 'ideia', 'trend', 'ideia', 'motivacao', 'cliente', 'trend'];
const pick = (a) => a[Math.floor(Math.random() * a.length)];

/* Hora de Brasília */
export function brNow(now = Date.now()) {
  const d = new Date(now - 3 * 3600e3);
  return { h: d.getUTCHours(), m: d.getUTCMinutes(), date: d.toISOString().slice(0, 10), wd: d.getUTCDay() };
}

/* Datas comemorativas próximas (até 45 dias) */
const DATES = [
  ['01-01', 'Ano Novo'], ['02-14', 'Valentine’s'], ['03-08', 'Dia da Mulher'], ['03-15', 'Dia do Consumidor'],
  ['05-01', 'Dia do Trabalhador'], ['06-12', 'Dia dos Namorados'], ['06-24', 'Festa Junina / São João'],
  ['08-11', 'Dia dos Pais (2º domingo de agosto)'], ['09-15', 'Dia do Cliente'], ['10-12', 'Dia das Crianças'],
  ['10-31', 'Halloween'], ['11-27', 'Black Friday'], ['12-25', 'Natal'], ['12-31', 'Réveillon'], ['05-10', 'Dia das Mães (2º domingo de maio)'],
];
export function upcomingDates(date) {
  const y = +date.slice(0, 4), t = Date.parse(date);
  return DATES.map(([md, n]) => {
    let d = Date.parse(`${y}-${md}`);
    if (d < t) d = Date.parse(`${y + 1}-${md}`);
    return { n, days: Math.round((d - t) / 86400e3) };
  }).filter((x) => x.days <= 45).sort((a, b) => a.days - b.days).map((x) => `${x.n} (em ${x.days} dias)`);
}

/* Assuntos em alta no Google Brasil (grátis, sem chave), guardados por 3 horas */
export async function getTrends(env) {
  const cached = await env.CAL.get('trends', 'json');
  if (cached && cached.at > Date.now() - 3 * 3600e3) return cached.list;
  let list = cached?.list || [];
  try {
    const r = await fetch('https://trends.google.com/trending/rss?geo=BR', { headers: { 'User-Agent': 'Mozilla/5.0 calendario' } });
    if (r.ok) {
      const xml = await r.text();
      const titles = [...xml.matchAll(/<item>[\s\S]*?<title>(?:<!\[CDATA\[)?([^<\]]+)/g)].map((m) => m[1].trim()).slice(0, 15);
      if (titles.length) list = titles;
    }
  } catch (e) { console.log('trends falhou', e.message); }
  await env.CAL.put('trends', JSON.stringify({ at: Date.now(), list }));
  return list;
}

/* Mensagens prontas (quando a IA não responder) */
export function fallback(kind, co, name, dates) {
  const n = co?.name || 'suas empresas';
  const M = {
    cobranca: [`E aí, ${name}, já postou hoje pra ${n}? 👀`, `Faz ${co?.daysSincePost ?? 'alguns'} dias sem post na ${n}. Bora soltar um story rápido?`],
    ideia: [`Ideia pra ${n}: um reels de bastidores mostrando o dia a dia. Simples e gera conexão.`, `Que tal uma enquete nos stories da ${n}? Engajamento fácil hoje.`],
    trend: [`Dá uma olhada no que está em alta hoje e pensa num gancho pra ${n}. Trend no timing certo viraliza.`],
    motivacao: [`Você é melhor do que imagina, ${name}. Um post de cada vez. 💪`, `Constância vence talento. Hoje é dia de fazer acontecer.`, `Deus está contigo. Confia no seu processo. 🙏`],
    cliente: [`Já mandou mensagem pra ${n} hoje pra saber o que estão achando dos posts?`],
  };
  let body = pick(M[kind] || M.motivacao);
  if (kind === 'ideia' && dates[0]) body = `${dates[0].split(' (')[0]} chegando! Já pensou em conteúdo temático pra ${n}?`;
  return { title: kind === 'motivacao' ? '✨ Bora!' : `💡 ${n}`, body };
}

async function aiMessage(env, kind, co, name, ctx, trends, dates, recent) {
  if (!env.AI) return null;
  const task = {
    cobranca: `Cobre de forma leve e amigável se ${name} já postou/criou conteúdo hoje para "${co.name}" (último post: ${co.lastPost || 'nenhum registrado'}; próximo agendado: ${co.nextPost || 'nenhum'}).`,
    ideia: `Dê UMA ideia concreta e criativa de conteúdo (diga o formato: reels, carrossel, story ou feed) para "${co.name}", que é ${co.niche}. Se houver data comemorativa próxima, aproveite.`,
    trend: `Escolha UM assunto em alta que combine com "${co.name}" (${co.niche}) e sugira como transformar em conteúdo (formato + gancho). Assuntos em alta no Brasil agora: ${trends.slice(0, 12).join('; ') || 'nenhum disponível — use uma trend comum de Instagram/TikTok'}.`,
    motivacao: `Mande uma frase motivacional curta e verdadeira para ${name}, que trabalha com social media (pode citar fé, constância, potencial). Sem clichê exagerado.`,
    cliente: `Lembre ${name} de mandar mensagem para o cliente "${co.name}" (${co.niche}) — pedir feedback, alinhar a próxima semana ou pedir fotos/novidades.`,
  }[kind];
  const sys = `Você escreve notificações de celular para ${name}, social media que cuida do Instagram de pequenas empresas.
Hoje é ${ctx.today}. Datas próximas: ${dates.join(', ') || 'nenhuma'}.
Escreva em português do Brasil, tom de amigo animado, direto. Pode usar 1 emoji.
Responda SÓ com JSON: {"title": "até 40 caracteres", "body": "até 160 caracteres"}.
Não repita estas mensagens recentes: ${recent.join(' | ') || '—'}`;
  for (const model of MODELS) {
    try {
      const out = await env.AI.run(model, { messages: [{ role: 'system', content: sys }, { role: 'user', content: task }], max_tokens: 200, temperature: 0.9 });
      const txt = String(out?.response || '');
      const m = /\{[\s\S]*\}/.exec(txt);
      if (!m) continue;
      const j = JSON.parse(m[0]);
      if (j.title && j.body) return { title: String(j.title).slice(0, 60), body: String(j.body).slice(0, 220), byAI: true };
    } catch (e) { console.log('coach IA', model, e.message); }
  }
  return null;
}

/* ---------- Outras profissões: dicas da rotina, agenda e ânimo (sem posts nem trends) ---------- */
const WORK_KINDS = ['dica', 'agenda', 'motivacao', 'dica', 'pausa', 'agenda'];
const hm = (t) => (t ? t.replace(':00', 'h').replace(':', 'h') : '');
export function workFallback(kind, w, name, today) {
  const nx = (w.next || []).filter((e) => !e.who || e.who === w.me);
  const first = nx[0];
  if (kind === 'agenda' && w.late) return { title: '⏰ Ficou algo para trás', body: `${name}, você tem ${w.late} ${w.late > 1 ? 'compromissos atrasados' : 'compromisso atrasado'}. Resolve e marca como feito, que o dia rende mais leve.` };
  if (kind === 'agenda' && first) return { title: `📅 ${first.label}${first.time ? ' às ' + hm(first.time) : ''}`, body: `${first.date === today ? 'Hoje' : 'Próximo'}: ${first.title || first.label}. Já deixa tudo pronto pra não correr depois.` };
  if (kind === 'dica' && (w.tips || []).length) return { title: `💡 Dica${w.profession ? ' para ' + w.profession.toLowerCase() : ''}`, body: pick(w.tips) };
  if (kind === 'pausa') return { title: '🌿 Respira um pouco', body: pick([`${name}, 2 minutos: ombros para baixo, respira fundo três vezes e bebe água.`, 'Levanta, alonga as costas e olha para longe da tela por um minuto. Seu corpo agradece.', 'Uma pausa curta agora rende mais do que forçar até o fim. Volta já, mais leve.']) };
  return { title: '✨ Bora!', body: pick([`Você é melhor do que imagina, ${name}. Um passo de cada vez. 💪`, 'Constância vence talento. Hoje é dia de fazer acontecer.', `Deus está contigo, ${name}. Confia no seu processo. 🙏`, 'Quem cumpre o que promete pra si mesmo fica imparável. Vai com tudo hoje.']) };
}
async function aiWork(env, kind, w, name, today, recent) {
  if (!env.AI) return null;
  const prof = w.profession || 'profissional';
  const nx = (w.next || []).filter((e) => !e.who || e.who === w.me).slice(0, 3).map((e) => `${e.date === today.slice(0, 10) ? 'hoje' : e.date} ${e.time} ${e.label}${e.title ? ' — ' + e.title : ''}`).join('; ');
  const task = {
    dica: `Dê UMA dica prática, específica e útil para a rotina de trabalho de quem é ${prof} (organização, produtividade, cuidado com o tempo, preparo, segurança). ${w.tips?.length ? 'Exemplos do tipo de dica (não copie): ' + w.tips.slice(0, 4).join(' | ') : ''}`,
    agenda: nx ? `Lembre ${name} do próximo compromisso de trabalho e sugira uma preparação rápida: ${nx}.` : `Incentive ${name} a planejar os próximos compromissos de trabalho no Lembra.`,
    motivacao: `Mande uma frase motivacional curta e verdadeira para ${name}, que trabalha como ${prof}. Valorize o trabalho dessa profissão. Pode citar fé e constância. Sem clichê exagerado.`,
    pausa: `Sugira uma pausa rápida de cuidado (respirar, alongar, beber água, postura) adequada para quem é ${prof}.`,
  }[kind];
  const sys = `Você escreve notificações de celular para ${name}, que trabalha como ${prof}.
Hoje é ${today}. Escreva em português do Brasil, tom de amigo que se importa, direto. Pode usar 1 emoji.
Responda SÓ com JSON: {"title": "até 40 caracteres", "body": "até 160 caracteres"}.
Não repita estas mensagens recentes: ${recent.join(' | ') || '—'}`;
  for (const model of MODELS) {
    try {
      const out = await env.AI.run(model, { messages: [{ role: 'system', content: sys }, { role: 'user', content: task }], max_tokens: 200, temperature: 0.9 });
      const m = /\{[\s\S]*\}/.exec(String(out?.response || ''));
      if (!m) continue;
      const j = JSON.parse(m[0]);
      if (j.title && j.body) return { title: String(j.title).slice(0, 60), body: String(j.body).slice(0, 220), byAI: true };
    } catch (e) { console.log('coach IA', model, e.message); }
  }
  return null;
}

/* Escolhe a empresa: quem está há mais tempo sem post tem mais chance */
function chooseCompany(list) {
  if (!list.length) return null;
  const w = list.map((c) => 1 + Math.min(10, c.daysSincePost ?? 7));
  let r = Math.random() * w.reduce((a, b) => a + b, 0);
  for (let i = 0; i < list.length; i++) if ((r -= w[i]) <= 0) return list[i];
  return list[0];
}

export async function runCoach(env, sendToMember, team) {
  const now = Date.now(), br = brNow(now);
  const mins = br.h * 60 + br.m;
  if (mins < 8 * 60 + 30 || mins > 21 * 60 + 30) return 0;
  const [st0, force] = await Promise.all([env.CAL.get('coach', 'json'), env.CAL.get('coach-force', 'json')]);
  const st = { next: {}, recent: {}, forced: {}, ...(st0 || {}) };
  for (const m of team) if (force && force[m.id] > (st.forced[m.id] || 0)) { st.next[m.id] = 0; st.forced[m.id] = force[m.id]; }
  const due = team.filter((m) => (st.next[m.id] || 0) <= now);
  if (!due.length) return 0;
  // a parte que o app manda (empresas) fica em outra chave; o formato antigo ainda é aceito
  // cada espaço tem as próprias empresas (a dupla: 'coach-ctx'; contas próprias: 'coach-ctx:{uid}')
  const today = `${br.date} (${['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'][br.wd]})`;
  const ctxCache = {};
  const ctxOf = async (m) => {
    const key = m.ctxKey || 'coach-ctx';
    if (!ctxCache[key]) ctxCache[key] = { ...((await env.CAL.get(key, 'json')) || (key === 'coach-ctx' && st.ctx) || { companies: [] }), today };
    return ctxCache[key];
  };
  const dates = upcomingDates(br.date);
  let trendsP = null;
  const trendsOf = () => (trendsP ||= getTrends(env));
  let sent = 0;
  // grava o próximo horário antes de enviar: nunca manda duas vezes seguidas
  for (const m of due) st.next[m.id] = now + (90 + Math.random() * 60) * 60e3;
  await env.CAL.put('coach', JSON.stringify(st));
  for (const m of due) {
    const ctx = await ctxOf(m);
    const recent0 = (st.recent[m.id] || []).slice(-5);
    // outras profissões: dica da rotina, agenda, ânimo e pausa (não fala de posts)
    if (ctx.work && ctx.work.arch && ctx.work.arch !== 'marketing') {
      const kind = mins < 9 * 60 + 30 ? 'motivacao' : pick(WORK_KINDS);
      const w = { ...ctx.work, me: m.id };
      const useAI = kind !== 'agenda' || !w.late;
      const msg = (useAI ? await aiWork(env, kind, w, m.name, today, recent0) : null) || workFallback(kind, w, m.name, br.date);
      sent += await sendToMember(env, m.id, { title: msg.title, body: msg.body, tag: 'coach', url: './' }, 'coach');
      st.recent[m.id] = [...recent0, msg.body].slice(-6);
      const u = st.usage && st.usage.date === br.date ? st.usage : { date: br.date, sent: 0, ai: 0 };
      u.sent++;
      if (msg.byAI) u.ai++;
      st.usage = u;
      continue;
    }
    const kind = mins < 9 * 60 + 30 ? 'motivacao' : pick(KINDS);
    const co = chooseCompany((ctx.companies || []).filter((c) => !c.onlyFor || c.onlyFor === m.id));
    const recent = (st.recent[m.id] || []).slice(-5);
    const trends = await trendsOf();
    const msg = (co || kind === 'motivacao' ? await aiMessage(env, co ? kind : 'motivacao', co, m.name, ctx, trends, dates, recent) : null)
      || fallback(co ? kind : 'motivacao', co, m.name, dates);
    sent += await sendToMember(env, m.id, { title: msg.title, body: msg.body, tag: 'coach', url: './' }, 'coach');
    st.recent[m.id] = [...recent, msg.body].slice(-6);
    const u = st.usage && st.usage.date === br.date ? st.usage : { date: br.date, sent: 0, ai: 0 };
    u.sent++;
    if (msg.byAI) u.ai++;
    st.usage = u;
  }
  await env.CAL.put('coach', JSON.stringify(st));
  return sent;
}
