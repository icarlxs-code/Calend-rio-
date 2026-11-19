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
      if (j.title && j.body) return { title: String(j.title).slice(0, 60), body: String(j.body).slice(0, 220) };
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
  const st = (await env.CAL.get('coach', 'json')) || { ctx: null, next: {}, recent: {} };
  const due = team.filter((m) => (st.next[m.id] || 0) <= now);
  if (!due.length) return 0;
  const ctx = st.ctx || { companies: [] };
  ctx.today = `${br.date} (${['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'][br.wd]})`;
  const dates = upcomingDates(br.date);
  const trends = await getTrends(env);
  let sent = 0;
  for (const m of due) {
    const kind = mins < 9 * 60 + 30 ? 'motivacao' : pick(KINDS);
    const co = chooseCompany(ctx.companies || []);
    const recent = (st.recent[m.id] || []).slice(-5);
    const msg = (co || kind === 'motivacao' ? await aiMessage(env, co ? kind : 'motivacao', co, m.name, ctx, trends, dates, recent) : null)
      || fallback(co ? kind : 'motivacao', co, m.name, dates);
    sent += await sendToMember(env, m.id, { title: msg.title, body: msg.body, tag: 'coach', url: './' }, 'coach');
    st.recent[m.id] = [...recent, msg.body].slice(-6);
    st.next[m.id] = now + (90 + Math.random() * 60) * 60e3; // próxima entre 1h30 e 2h30
  }
  await env.CAL.put('coach', JSON.stringify(st));
  return sent;
}
