/* Assistente dentro do app: responde com base na agenda real da dupla.
   Usa o Claude Haiku 5.5 com esforço baixo (rápido e barato). A chave da API fica
   só no servidor (variável ANTHROPIC_API_KEY), nunca no app. */
import Anthropic from '@anthropic-ai/sdk';
import { TZ, nowIn } from './reminder-rules.js';
import { buildContext } from './context.js';
export { buildContext };

const MODEL = 'claude-haiku-5-5';
const SYSTEM = `Você é o assistente da agenda de uma dupla de social media que cuida do Instagram de várias empresas.
Você recebe a agenda real deles (posts, stories, reels, captações, reuniões, edição) e responde perguntas sobre ela.
Regras:
- Responda em português do Brasil, curto e direto, como num chat de celular. Use listas curtas quando ajudar.
- Baseie-se só nos dados da agenda. Se algo não estiver lá, diga que não está na agenda.
- Quando sugerir horários, respeite a rotina combinada (expediente, almoço, folga, deslocamento) e não marque nada em cima de outro compromisso da mesma pessoa.
- Pense no bem-estar da dupla: aponte sobrecarga e sugira pausas quando fizer sentido.
- Você não altera a agenda; diga o que fazer e a pessoa ajusta no app.`;

export async function ask({ question, history = [], context }) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    const err = new Error('A chave do Claude ainda não foi configurada no servidor.');
    err.code = 'no-key';
    throw err;
  }
  const client = new Anthropic({ apiKey, timeout: 45000, maxRetries: 2 });
  const turns = history
    .filter((h) => h && (h.role === 'user' || h.role === 'assistant') && typeof h.text === 'string')
    .slice(-8)
    .map((h) => ({ role: h.role, content: h.text.slice(0, 4000) }));
  // a conversa precisa começar pela pessoa
  while (turns.length && turns[0].role !== 'user') turns.shift();
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 2000,
    output_config: { effort: 'low' },
    system: [
      { type: 'text', text: SYSTEM },
      { type: 'text', text: `Dados atuais da agenda:\n${context}` },
    ],
    messages: [...turns, { role: 'user', content: question.slice(0, 2000) }],
  });
  if (response.stop_reason === 'refusal') {
    return 'Não consigo responder isso. Tente perguntar de outro jeito sobre a agenda.';
  }
  const text = response.content.filter((b) => b.type === 'text').map((b) => b.text).join('\n').trim();
  return text || 'Não consegui montar uma resposta. Tente de novo.';
}

export { TZ, nowIn };
