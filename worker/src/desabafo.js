/* Conversa curtinha do mascote quando a pessoa conta que não está bem.
   IA grátis do Cloudflare; resposta de 1 a 3 frases, carinhosa e motivadora. NADA do que a pessoa escreveu é guardado.
   Risco (agressão, ameaça, pensamento de se machucar) nunca vai para a IA: volta a marca e o app mostra os números de ajuda. */
import { risco, limpaVida } from '../../js/vida.js';
const MODELS = ['@cf/meta/llama-3.3-70b-instruct-fp8-fast', '@cf/meta/llama-3.1-8b-instruct-fast'];
const REGRAS = `Você é o mascote do Lembra, um amigo carinhoso. A pessoa contou um problema do relacionamento ou da vida.
Responda em português do Brasil, em NO MÁXIMO 3 frases curtas, acolhendo e levantando a autoestima, dizendo que vai ficar tudo bem.
Regras: não faça perguntas; não dê diagnóstico; não julgue ninguém; não invente fatos; não use listas.
Nunca incentive a pessoa a aceitar agressão, ameaça, controle, humilhação ou medo: nesses casos diga que ela merece segurança e que pode ligar 190 ou 180.
Se ela falar em se machucar, diga que ela importa e que o CVV atende no 188, 24 horas.
Não escreva "espero ter ajudado" (o app já escreve).`;
const contexto = (vida, pronome) => {
  const v = limpaVida(vida); if (!v) return '';
  const rel = { namorando: 'namora', noivo: 'está noivo(a)', casado: 'é casado(a)', uniao: 'vive em união estável', complicado: 'está num relacionamento complicado' }[v.rel] || '';
  return [rel && `A pessoa ${rel}${v.par ? ` com ${v.par}` : ''}.`, v.nomes.length ? `Tem filhos: ${v.nomes.join(', ')}.` : '', pronome === 'f' ? 'Fale no feminino.' : pronome === 'm' ? 'Fale no masculino.' : ''].filter(Boolean).join(' ');
};
const curto = (t) => String(t || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().split(/(?<=[.!?…])\s+/).slice(0, 3).join(' ').slice(0, 420);
export async function desabafo(env, { texto, vida, pronome }) {
  const t = String(texto || '').slice(0, 600).trim();
  if (!t) return { erro: 'Escreva o que aconteceu.' };
  const r = risco(t);
  if (r) return { risco: r };
  if (!env.AI) return { texto: '' };   // o app usa a frase de reserva
  for (const m of MODELS) {
    try {
      const o = await env.AI.run(m, { messages: [{ role: 'system', content: `${REGRAS}\n${contexto(vida, pronome)}` }, { role: 'user', content: t }], max_tokens: 160 });
      const txt = curto(o && (o.response || o.result?.response));
      if (txt) return { texto: risco(txt) ? '' : txt };
    } catch { /* tenta o menor */ }
  }
  return { texto: '' };
}
