/* Conversa com o Claude (Haiku 5.5, esforço baixo). O app envia a pergunta e o
   retrato da agenda; a chave da API fica só aqui no servidor. */
import Anthropic from '@anthropic-ai/sdk';

const MODEL = 'claude-haiku-5-5';
const SYSTEM = `Você é o assistente da agenda de uma dupla de social media que cuida do Instagram de várias empresas.
Você recebe a agenda real deles (posts, stories, reels, captações, reuniões, edição) e responde perguntas sobre ela.
Regras:
- Responda em português do Brasil, curto e direto, como num chat de celular. Use listas curtas quando ajudar.
- Baseie-se só nos dados da agenda. Se algo não estiver lá, diga que não está na agenda.
- Quando sugerir horários, respeite a rotina combinada (expediente, almoço, folga, deslocamento) e não marque nada em cima de outro compromisso da mesma pessoa.
- Pense no bem-estar da dupla: aponte sobrecarga e sugira pausas quando fizer sentido.
- Você não altera a agenda; diga o que fazer e a pessoa ajusta no app.`;

export async function askClaude(env, { question, history, context, me }) {
  if (!question.trim()) throw Object.assign(new Error('Escreva uma pergunta.'), { status: 400 });
  const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY, timeout: 45000, maxRetries: 2 });
  const turns = (Array.isArray(history) ? history : [])
    .filter((h) => h && (h.role === 'user' || h.role === 'assistant') && typeof h.text === 'string')
    .slice(-8)
    .map((h) => ({ role: h.role, content: h.text.slice(0, 4000) }));
  while (turns.length && turns[0].role !== 'user') turns.shift();
  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 2000,
      output_config: { effort: 'low' },
      system: [
        { type: 'text', text: SYSTEM },
        { type: 'text', text: `Quem pergunta: ${me.name}.\nDados atuais da agenda:\n${context}` },
      ],
      messages: [...turns, { role: 'user', content: question }],
    });
    if (response.stop_reason === 'refusal') return 'Não consigo responder isso. Tente perguntar de outro jeito sobre a agenda.';
    return response.content.filter((b) => b.type === 'text').map((b) => b.text).join('\n').trim() || 'Não consegui montar uma resposta. Tente de novo.';
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError) throw Object.assign(new Error('A chave do Claude é inválida.'), { status: 412 });
    if (err instanceof Anthropic.RateLimitError) throw Object.assign(new Error('Muitas perguntas seguidas. Espere um pouco.'), { status: 429 });
    if (err instanceof Anthropic.APIConnectionError) throw Object.assign(new Error('Não consegui falar com o Claude agora.'), { status: 503 });
    if (err instanceof Anthropic.APIError) {
      throw Object.assign(new Error(/credit|billing/i.test(err.message) ? 'Sem créditos na conta da Anthropic.' : 'O Claude não respondeu. Tente de novo.'), { status: 502 });
    }
    throw err;
  }
}
