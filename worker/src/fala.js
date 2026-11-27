/* Falas do mascote escritas pela IA na hora, com o contexto de cada pessoa (agenda, time, filhos, relacionamento, ânimo,
   assuntos de que ela mais gosta). Nunca repete: guarda as últimas falas de cada pessoa e recusa as parecidas.
   IA grátis do Cloudflare com cota diária por pessoa; acabou a cota (ou a IA caiu), o app usa as frases dele. */
import { risco, limpaVida } from '../../js/vida.js';
import { porTime } from '../../functions/times.js';
import { cenaDoTime } from './fut-motor.js';
import { proximosEspn } from './fut-espn.js';
import { proximos } from './futebol.js';

const MODELS = ['@cf/meta/llama-3.3-70b-instruct-fp8-fast', '@cf/meta/llama-3.1-8b-instruct-fast'];
export const COTA_DIA = 8;            // falas geradas por pessoa por dia (o resto usa as frases do app)
const HIST = 60;                       // quantas falas antigas de cada pessoa ficam guardadas para não repetir
const dia = (ms) => new Date(ms - 3 * 3600e3).toISOString().slice(0, 10);
const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
/** parecida demais com alguma já dita? (mesmo texto, ou 70% das palavras iguais) */
export function repetida(t, hist) {
  const a = norm(t); if (!a) return true;
  const A = new Set(a.split(' ').filter((w) => w.length > 3));
  return hist.some((h) => { const b = norm(h); if (a === b) return true; const B = b.split(' ').filter((w) => w.length > 3); if (!A.size || !B.length) return false; const iguais = B.filter((w) => A.has(w)).length; return iguais / Math.max(A.size, B.length) >= 0.7; });
}
const limpa = (t) => String(t || '').replace(/<[^>]*>/g, '').replace(/^["“'\s]+|["”'\s]+$/g, '').replace(/\s+/g, ' ').trim().slice(0, 180);
const lista = (L, n) => (Array.isArray(L) ? L : []).map((x) => String(x || '').replace(/[<>{}]/g, '').slice(0, 60)).filter(Boolean).slice(0, n);
const MOMENTO = { manha: 'de manhã', tarde: 'à tarde', noite: 'à noite' };

/** monta o retrato da pessoa para a IA (só o necessário; nada de documento, telefone ou endereço) */
export async function retrato(env, me, c = {}, now = Date.now()) {
  const v = limpaVida(c.vida), L = [];
  if (c.nome) L.push(`Nome: ${String(c.nome).slice(0, 20)}.`);
  L.push(c.pronome === 'f' ? 'Fale no feminino.' : c.pronome === 'm' ? 'Fale no masculino.' : 'Use linguagem neutra.');
  if (v) {
    const rel = { solteiro: 'solteiro(a)', namorando: 'namorando', noivo: 'noivo(a)', casado: 'casado(a)', uniao: 'em união estável', complicado: 'num relacionamento complicado', separado: 'separado(a)', viuvo: 'viúvo(a)' }[v.rel];
    if (rel) L.push(`Relacionamento: ${rel}${v.par ? ` (com ${v.par})` : ''}.`);
    if (v.filhos === 'sim') L.push(v.nomes.length ? `Filhos: ${v.nomes.join(', ')}.` : 'Tem filhos.');
    if (v.filhos === 'gravida') L.push('Está esperando um bebê.');
    const an = { bem: 'animado(a)', normal: 'normal', desanimado: 'meio desanimado(a)', dificil: 'passando por uma fase difícil' }[v.animo];
    if (an) L.push(`Ânimo: ${an}.`);
  }
  const hoje = lista(c.hoje, 6), amanha = lista(c.amanha, 4);
  if (hoje.length) L.push(`Agenda de hoje: ${hoje.join('; ')}.`);
  if (amanha.length) L.push(`Amanhã: ${amanha.join('; ')}.`);
  if (Number(c.atrasados) > 0) L.push(`${Math.min(99, Number(c.atrasados))} coisa(s) atrasada(s).`);
  if (Number(c.feitos) > 0) L.push(`Já concluiu ${Math.min(99, Number(c.feitos))} hoje.`);
  const gostos = lista(c.gostos, 4); if (gostos.length) L.push(`Assuntos de que mais gosta: ${gostos.join(', ')}.`);
  const time = porTime(c.time);
  if (time) {
    L.push(`Torce para o ${time.nome}.`);
    try {
      const cena = await cenaDoTime(env, c.time, now);
      if (cena) L.push(`Último lance do time: ${cena.tipo === 'fim' ? `terminou ${cena.meu} x ${cena.dele}` : `${cena.tipo} (${cena.meu} x ${cena.dele})`}${cena.rival ? ` contra ${cena.rival}` : ''}.`);
      let j = (await proximos(env, c.time, now))[0];
      if (!j) j = (await proximosEspn(env, c.time, { now }))[0];
      if (j) L.push(`Próximo jogo: ${j.casa} x ${j.fora}, ${new Date(j.at).toLocaleString('pt-BR', { weekday: 'long', hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' })}.`);
    } catch { /* sem futebol agora */ }
  }
  return L.join(' ');
}

const REGRAS = (onde) => `Você é o mascote do Lembra, um amigo carinhoso, divertido e esperto que conhece bem a pessoa.
Escreva UMA fala ${onde === 'tela' ? 'para a tela inicial do app (frase do momento)' : 'para quando a pessoa toca em você'}: no máximo 22 palavras, em português do Brasil, natural como um amigo falando.
Use UM assunto do retrato da pessoa (agenda, time, filhos, relacionamento, ânimo ou um assunto de que ela gosta), escolhendo o que faz mais sentido para o momento do dia.
Se ela estiver desanimada ou numa fase difícil, levante a autoestima. Nunca invente compromissos, placares ou fatos que não estão no retrato.
Nunca incentive alguém a aceitar agressão ou controle. Sem aspas, sem listas, sem hashtags, no máximo 1 emoji.
Varie de verdade: não comece com as mesmas palavras das falas já ditas, troque o assunto e o emoji, e não chame a pessoa pelo nome em toda fala.`;

/** gera uma fala nova (ou '' quando não dá: sem IA, cota do dia acabou, ou só saiu repetida) */
export async function geraFala(env, me, { onde = 'tela', momento = '', ctx = {} } = {}, now = Date.now()) {
  if (!env.AI) return { t: '', motivo: 'sem-ia' };
  const kc = `fala:n:${me.id}:${dia(now)}`, n = Number(await env.CAL.get(kc)) || 0;
  if (n >= COTA_DIA) return { t: '', motivo: 'cota' };
  const kh = `fala:h:${me.id}`, hist = (await env.CAL.get(kh, 'json')) || [];
  const perfil = await retrato(env, me, ctx, now);
  const sys = `${REGRAS(onde)}\nAgora é ${MOMENTO[momento] || 'agora'}.\nRetrato da pessoa: ${perfil}\nFalas que você JÁ disse (não repita nem parafraseie): ${hist.slice(-15).map((h) => `«${h}»`).join(' ') || 'nenhuma'}`;
  await env.CAL.put(kc, String(n + 1), { expirationTtl: 2 * 86400 });
  for (let tentativa = 0; tentativa < 2; tentativa++) {
    for (const m of MODELS) {
      try {
        const o = await env.AI.run(m, { messages: [{ role: 'system', content: sys }, { role: 'user', content: tentativa ? 'Escreva outra, com assunto e palavras diferentes.' : 'Escreva a fala.' }], max_tokens: 90, temperature: tentativa ? 1 : 0.85 });
        const t = limpa(o && (o.response || o.result?.response));
        if (!t || risco(t) || t.split(/\s+/).length > 30) break;
        if (repetida(t, hist)) break;          // parecida com uma antiga: tenta de novo
        await env.CAL.put(kh, JSON.stringify([...hist, t].slice(-HIST)), { expirationTtl: 60 * 86400 });
        return { t };
      } catch { /* tenta o modelo menor */ }
    }
  }
  return { t: '', motivo: 'repetida' };
}
