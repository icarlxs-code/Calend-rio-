/* IA grátis do Cloudflare (Workers AI): responde dentro do app, sem chave e sem cartão.
   Usa o Llama 3.3 70B; se a cota grátis do dia acabar, tenta um modelo menor. */
const MODELS = ['@cf/meta/llama-3.3-70b-instruct-fp8-fast', '@cf/meta/llama-3.1-8b-instruct-fast'];
const SYSTEM = `Você é o assistente da agenda de uma dupla de social media que cuida do Instagram de várias empresas.
Você recebe a agenda real deles (posts, stories, reels, captações, reuniões, edição) e responde perguntas sobre ela.
Regras:
- Responda SEMPRE em português do Brasil, curto e direto, como num chat de celular. Use listas curtas com "- " quando ajudar.
- Baseie-se só nos dados da agenda abaixo. Se algo não estiver lá, diga que não está na agenda. Nunca invente compromissos.
- Quando sugerir horários, respeite a rotina combinada (expediente, almoço, folga, deslocamento) e não marque nada em cima de outro compromisso da mesma pessoa.
- Pense no bem-estar da dupla: aponte sobrecarga e sugira pausas quando fizer sentido.
- Você não altera a agenda; diga o que fazer e a pessoa ajusta no app.`;

export async function askFree(env, { question, history, context, me }) {
  if (!question.trim()) throw Object.assign(new Error('Escreva uma pergunta.'), { status: 400 });
  const turns = (Array.isArray(history) ? history : [])
    .filter((h) => h && (h.role === 'user' || h.role === 'assistant') && typeof h.text === 'string')
    .slice(-6)
    .map((h) => ({ role: h.role, content: h.text.slice(0, 2000) }));
  while (turns.length && turns[0].role !== 'user') turns.shift();
  const messages = [
    { role: 'system', content: `${SYSTEM}\n\nQuem pergunta: ${me.name}.\nDados atuais da agenda:\n${context}` },
    ...turns,
    { role: 'user', content: question },
  ];
  let lastErr;
  for (const model of MODELS) {
    try {
      const out = await env.AI.run(model, { messages, max_tokens: 900, temperature: 0.3 });
      const text = String(out?.response || '').trim();
      if (text) return text;
    } catch (e) {
      lastErr = e;
      console.log('IA grátis falhou', model, e.message);
    }
  }
  const quota = lastErr && /limit|quota|neuron|429/i.test(lastErr.message || '');
  throw Object.assign(new Error(quota ? 'A cota grátis de IA de hoje acabou. Amanhã volta a funcionar.' : 'A IA não respondeu agora. Tente de novo.'), { status: 503 });
}
