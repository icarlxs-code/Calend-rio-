/* Papo de torcida: fora do dia de jogo, até 1 aviso por dia sobre o time que a PRÓPRIA pessoa escolheu.
   Três assuntos que se revezam, sempre com dado de verdade (nada inventado):
   - tabela: posição, pontos e a distância para G4/G6 ou para o Z4;
   - próximo jogo nos próximos dias ("sábado a gente pega o X, tô confiante");
   - notícia do clube (manchete da ESPN Brasil das últimas 36 h).
   Só para quem deixou os avisos do time ligados; nunca no dia do jogo (esse é o aviso do jogo). */
import { porTime } from '../../functions/times.js';
import { mapaEspn, tabelaEspn, proximosEspn } from './fut-espn.js';
import { brNow } from './coach.js';

const H = 3600e3;
const DIAS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
const pick = (L, s) => L[Math.abs(s) % L.length];

/** a fala sobre a tabela (pura: os testes conferem) */
export function falaTabela(nome, tab, timeEspn, seed = 0) {
  const n = tab.length, i = tab.findIndex((l) => l.time.time_id === timeEspn); if (i < 0 || n < 8) return null;
  const l = tab[i], pos = l.posicao || i + 1, pts = l.pontos, z4 = n - 3; // os 4 últimos caem
  const ptsDe = (p) => (tab.find((x) => x.posicao === p) || tab[p - 1] || {}).pontos;
  if (pos === 1) return pick([`🏆 O ${nome} é o líder! ${pts} pontos e ninguém na frente. Bora manter!`, `👑 Líder! O ${nome} tá no topo da tabela com ${pts} pontos. Que fase!`], seed);
  if (pos <= 4) return pick([`🔥 Tamo no G4! O ${nome} tá em ${pos}º com ${pts} pontos. Cada ponto conta agora!`, `💪 ${pos}º lugar! O ${nome} tá no G4. Se vacilar, cai fora. Bora segurar!`], seed);
  if (pos <= 6) { const f = (ptsDe(4) ?? pts) - pts; return pick([`👀 O ${nome} tá em ${pos}º, ${f > 0 ? `a ${f} ${f === 1 ? 'ponto' : 'pontos'} do G4` : 'colado no G4'}. Se ganhar os próximos, a gente sobe!`, `Cara, eu tava pensando: ${f > 0 ? `faltam ${f} ${f === 1 ? 'ponto' : 'pontos'}` : 'falta pouco'} pro ${nome} entrar no G4. Dá pra sonhar! ⚽`], seed); }
  if (pos >= z4) { const f = (ptsDe(z4 - 1) ?? pts) - pts; return pick([`😬 Tá apertado: o ${nome} tá na zona de rebaixamento (${pos}º). ${f > 0 ? `Faltam ${f} ${f === 1 ? 'ponto' : 'pontos'} pra sair.` : 'Precisa pontuar já.'} Bora reagir! 🙏`, `🙏 ${nome} em ${pos}º, dentro do Z4. Cada jogo agora é final!`], seed); }
  if (pos >= z4 - 3) { const f = pts - (ptsDe(z4) ?? pts); return pick([`⚠️ Cara, tava pensando aqui: o ${nome} tá em ${pos}º, só ${f} ${f === 1 ? 'ponto' : 'pontos'} acima do Z4. Se não pontuar, complica!`, `O ${nome} tá em ${pos}º e o Z4 tá ali perto (${f} ${f === 1 ? 'ponto' : 'pontos'}). Bora somar! 💪`], seed); }
  const f = (ptsDe(6) ?? pts) - pts;
  return pick([`📊 O ${nome} tá em ${pos}º com ${pts} pontos. ${f > 0 ? `Faltam ${f} pro G6.` : ''} Dá pra subir! ⚽`, `Tabela do dia: ${nome} em ${pos}º, ${pts} pontos. Bora buscar o G6! 🔥`], seed);
}
/** o próximo jogo daqui a 2 a 7 dias (pura) */
export function falaProximo(nome, jogo, timeApp, now, seed = 0) {
  if (!jogo || jogo.at < now + 24 * H || jogo.at > now + 7 * 24 * H) return null;
  const rival = jogo.c === timeApp ? jogo.fora : jogo.casa, dia = DIAS[new Date(jogo.at - 3 * H).getUTCDay()], casa = jogo.c === timeApp;
  return pick([`📅 ${dia.charAt(0).toUpperCase() + dia.slice(1)} a gente pega o ${rival}${casa ? ' em casa' : ''}. Tô confiante demais! ⚽`, `Já tô contando os dias: ${nome} x ${rival} na ${dia}. Vamos com tudo! 🔥`, `Semana de ${nome} x ${rival}! ${casa ? 'Em casa, com a torcida.' : 'Fora de casa, mas dá!'} Bora! 💪`], seed);
}
async function noticias(env, m, now) {
  const k = `futespn:news:${m.id}`, g = await env.CAL.get(k, 'json');
  if (g && g.at > now - 6 * H) return g.lista;
  let lista = [];
  try {
    const r = await fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/${m.liga}/news?team=${m.id}&lang=pt&region=br&limit=6`, { headers: { accept: 'application/json' } });
    const j = r.ok ? await r.json() : null;
    lista = ((j && j.articles) || []).map((a) => ({ t: String(a.headline || '').slice(0, 140), at: Date.parse(a.published) || 0 })).filter((a) => a.t && now - a.at < 36 * H);
  } catch { /* sem notícia agora */ }
  await env.CAL.put(k, JSON.stringify({ at: now, lista }), { expirationTtl: 2 * 86400 });
  return lista;
}

/** uma vez por dia (18h, horário de Brasília), um assunto por pessoa, revezando */
export async function rodaPapo(env, now, send, { max = 60 } = {}) { // 60 por minuto, na janela de 10 min (cache por time: poucas chamadas à ESPN)
  const br = brNow(now); if (br.h !== 18 || br.m > 9) return { motivo: 'hora' };
  const gente = Object.entries((await env.CAL.get('fut:gente', 'json')) || {});
  if (!gente.length) return { motivo: 'ninguem-segue' };
  const mapa = await mapaEspn(env, { now });
  let n = 0;
  for (const [quem, timeApp] of gente) {
    if (n >= max) break;
    const clube = porTime(timeApp), m = mapa[timeApp]; if (!clube || !m) continue;
    const kd = `futpapo:${quem}`, st = (await env.CAL.get(kd, 'json')) || {};
    if (st.dia === br.date) continue;
    const prox = await proximosEspn(env, timeApp, { now });
    if (prox[0] && prox[0].at - now < 30 * H) { await env.CAL.put(kd, JSON.stringify({ ...st, dia: br.date }), { expirationTtl: 30 * 86400 }); continue; } // dia de jogo: quem fala é o aviso do jogo
    const seed = Number(br.date.replace(/-/g, '')) + quem.length, ordem = ['tabela', 'proximo', 'tabela']; // notícia tem aviso próprio (fut-noticia)
    const ini = ((st.ult ?? -1) + 1) % 3;
    let texto = '', tipo = -1;
    for (let k = 0; k < 3 && !texto; k++) {
      const t = (ini + k) % 3, o = ordem[t];
      if (o === 'tabela') { const tab = await tabelaEspn(env, m.liga, { now }); texto = tab ? falaTabela(clube.nome, tab, m.id, seed) : null; }
      else if (o === 'proximo') texto = falaProximo(clube.nome, prox[0], timeApp, now, seed);
      else { const ns = (await noticias(env, m, now)).filter((x) => !(st.vistas || []).includes(x.t)); if (ns[0]) { texto = `📰 ${ns[0].t}`; st.vistas = [ns[0].t, ...(st.vistas || [])].slice(0, 20); } }
      if (texto) tipo = t;
    }
    await env.CAL.put(kd, JSON.stringify({ ...st, dia: br.date, ult: tipo >= 0 ? tipo : st.ult }), { expirationTtl: 30 * 86400 });
    if (!texto) continue;
    await send(env, quem, { title: `⚽ ${clube.nome}`, body: texto, tag: `fut-papo`, url: './' }, 'futebol');
    n++;
  }
  return { avisos: n };
}
