/* Notícias do time da pessoa: o Lembra acompanha a ESPN Brasil e avisa quando sai algo novo,
   com uma chamada que dá vontade de abrir. Ao tocar, a matéria abre DENTRO do Lembra:
   um resumo escrito pelo Lembra com as próprias palavras (só com os fatos da matéria), a foto,
   a data e o crédito com link para a matéria completa na ESPN (não copiamos o texto deles). */
import { porTime } from '../../functions/times.js';
import { mapaEspn } from './fut-espn.js';
import { brNow } from './coach.js';
import { textoDaIA } from './cota.js';

const H = 3600e3;
const MODELS = ['@cf/meta/llama-3.3-70b-instruct-fp8-fast', '@cf/meta/llama-3.1-8b-instruct-fast'];
const ent = (t) => String(t || '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&[a-z#0-9]+;/gi, ' ');

/** "X vence Y": o time da pessoa venceu (true), perdeu (false) ou a frase não diz (null) */
export function venceu(s, nome) {
  const t = String(s).toLowerCase(), n = String(nome).toLowerCase(), m = /(vence|venceu|bate|goleia|derrota|supera|atropela)/.exec(t), i = t.indexOf(n);
  if (!m || i < 0) return null;
  return i < m.index;
}
/** a chamada do aviso: chama atenção, mas a notícia é a de verdade (a manchete vai no texto) */
export function chamada(nome, manchete, seed = 0) {
  const s = String(manchete || '').toLowerCase();
  const L = /renov|contrat|assina|chega|reforç|anunci|acert/.test(s) ? [`🚨 REFORÇO? Mexida no ${nome}!`, `✍️ Acabou de sair no ${nome}!`, `🔥 Bomba no ${nome}: olha isso`]
    : /les[aã]o|machuc|desfalque|fora d|cirurgia/.test(s) ? [`😱 Preocupação no ${nome}!`, `⚠️ Notícia chata no ${nome}`, `🚑 Atenção, torcedor do ${nome}`]
      : /vaia|pol[eê]mic|briga|confus|desabaf|crise|demit|sai do/.test(s) ? [`😳 Treta no ${nome}!`, `🔥 O clima esquentou no ${nome}`, `👀 Você viu o que aconteceu no ${nome}?`]
        : venceu(s, nome) === false || /derrota|perde|eliminad|rebaixad/.test(s) ? [`😬 Doeu, torcedor do ${nome}…`, `💔 Noite difícil pro ${nome}`, `😤 Tem que reagir, ${nome}!`]
          : venceu(s, nome) === true || /classific|lider|campe/.test(s) ? [`🏆 Que fase do ${nome}!`, `🔥 ${nome} tá voando!`, `😍 Notícia boa no ${nome}!`]
          : [`🚨 Acabou de sair: ${nome}`, `👀 Torcedor do ${nome}, olha isso`, `⚡ Novidade quente no ${nome}`];
  return L[Math.abs(seed) % L.length];
}

/** as notícias mais recentes do clube (ESPN Brasil), guardadas por 30 min */
export async function noticiasDoClube(env, m, now = Date.now()) {
  const k = `futnews:lista:${m.id}`, g = await env.CAL.get(k, 'json');
  if (g && g.at > now - 0.5 * H) return g.lista;
  let lista = g?.lista || [];
  try {
    const r = await fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/${m.liga}/news?team=${m.id}&lang=pt&region=br&limit=8`, { headers: { accept: 'application/json' } });
    const j = r.ok ? await r.json() : null;
    if (j && Array.isArray(j.articles)) lista = j.articles.filter((a) => a.id && a.headline && !a.premium).map((a) => ({ id: String(a.id), t: String(a.headline).slice(0, 160), d: String(a.description || '').slice(0, 240), at: Date.parse(a.published) || 0, l: a.links?.web?.href || a.links?.mobile?.href || '', img: (a.images || []).find((x) => x.url)?.url || '' }));
    for (const a of lista) if (!(g?.lista || []).some((x) => x.id === a.id)) await env.CAL.put(`futnews:item:${a.id}`, JSON.stringify(a), { expirationTtl: 7 * 86400 });
  } catch { /* fica a lista guardada */ }
  await env.CAL.put(k, JSON.stringify({ at: now, lista }), { expirationTtl: 2 * 86400 });
  return lista;
}

/** a matéria para ler no Lembra: { titulo, descricao, resumo:[parágrafos], imagem, data, fonte, link } */
export async function materia(env, id, now = Date.now()) {
  if (!/^\d{4,12}$/.test(String(id))) return null;
  const k = `futnews:mat:${id}`, g = await env.CAL.get(k, 'json');
  if (g && g.resumo && g.resumo.length) return g;
  // a notícia vem da lista do clube (o id da ESPN sozinho pode apontar para outra matéria)
  const it = await env.CAL.get(`futnews:item:${id}`, 'json');
  if (!it) return g || null;
  const link = it.l || '';
  let corpo = [];
  try {
    if (/^https:\/\/www\.espn\.com\.br\//.test(link)) {
      const html = await (await fetch(link, { headers: { accept: 'text/html' } })).text();
      const i = html.indexOf('class="article-body"'), seg = i >= 0 ? html.slice(i, i + 80000) : '';
      corpo = [...seg.matchAll(/<p>([\s\S]*?)<\/p>/g)].map((x) => ent(x[1].replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim()).filter((t) => t.length > 30).slice(0, 14);
    }
  } catch { /* só com o título e a descrição */ }
  const base = { id: String(id), titulo: it.t, descricao: it.d || '', imagem: /^https:\/\/a\.espncdn\.com\//.test(it.img || '') ? it.img : '', data: it.at || now, fonte: 'ESPN Brasil', link };
  // o Lembra resume com as palavras dele, só com o que está na matéria
  let resumo = [];
  if (env.AI && corpo.length) {
    const sys = 'Você é o Lembra, um amigo torcedor. Resuma a matéria em português do Brasil, com SUAS palavras (não copie frases inteiras), em 3 ou 4 parágrafos curtos (2 a 3 frases cada), no tom de quem conta a notícia para um amigo. Use SÓ os fatos do texto: nada de inventar números, nomes ou opiniões. Se houver uma fala de alguém, pode resumir em uma frase curta entre aspas. Responda só com os parágrafos, separados por uma linha em branco.';
    for (const mdl of MODELS) {
      try {
        const o = textoDaIA(await env.AI.run(mdl, { messages: [{ role: 'system', content: sys }, { role: 'user', content: `Título: ${base.titulo}\n\n${corpo.join('\n\n').slice(0, 6000)}` }], max_tokens: 520 }));
        resumo = String(o?.response || '').split(/\n\s*\n/).map((p) => p.replace(/^[-*#\s]+/, '').trim()).filter((p) => p.length > 30).slice(0, 5);
        if (resumo.length) break;
      } catch { /* tenta o próximo modelo */ }
    }
  }
  if (!resumo.length) resumo = [base.descricao, ...(corpo[0] ? [corpo[0].length > 320 ? `${corpo[0].slice(0, 317)}…` : corpo[0]] : [])].filter(Boolean);
  const out = { ...base, resumo, ia: resumo.length > 0 && !!env.AI && corpo.length > 0 };
  await env.CAL.put(k, JSON.stringify(out), { expirationTtl: 5 * 86400 });
  return out;
}

/** de 30 em 30 min (9h às 22h): notícia nova do time → aviso, no máximo 3 por pessoa por dia */
export async function rodaNoticias(env, now, send, { max = 80 } = {}) {
  const br = brNow(now); if (br.h < 9 || br.h >= 22 || br.m % 30 > 4) return { motivo: 'hora' };
  const bloco = `${br.date}:${br.h}:${Math.floor(br.m / 30)}`;
  if ((await env.CAL.get('futnews:bloco')) === bloco) return { pulou: 'cedo' };
  await env.CAL.put('futnews:bloco', bloco, { expirationTtl: 3 * 3600 });
  const gente = Object.entries((await env.CAL.get('fut:gente', 'json')) || {});
  if (!gente.length) return { motivo: 'ninguem-segue' };
  const mapa = await mapaEspn(env, { now }), cache = {};
  let n = 0;
  for (const [quem, timeApp] of gente) {
    if (n >= max) break;
    const clube = porTime(timeApp), m = mapa[timeApp]; if (!clube || !m) continue;
    const lista = cache[timeApp] || (cache[timeApp] = await noticiasDoClube(env, m, now));
    const kk = `futnews:env:${quem}`, st = (await env.CAL.get(kk, 'json')) || { ids: [] };
    if (st.dia !== br.date) { st.dia = br.date; st.n = 0; }
    if (st.n >= 3) continue;
    const nova = lista.find((a) => now - a.at < 12 * H && !st.ids.includes(a.id));
    if (!nova) continue;
    st.ids = [nova.id, ...st.ids].slice(0, 60); st.n += 1;
    await env.CAL.put(kk, JSON.stringify(st), { expirationTtl: 30 * 86400 });
    await send(env, quem, { title: chamada(clube.nome, nova.t, Number(nova.id) + quem.length), body: nova.t, tag: `fut-news-${nova.id}`, url: `./#/noticia/${nova.id}/${timeApp}` }, 'futebol');
    n++;
  }
  return { avisos: n };
}
