/* IA grátis do Cloudflare (Workers AI): responde dentro do app, sem chave e sem cartão.
   Usa o Llama 3.3 70B; se a cota grátis do dia acabar, tenta um modelo menor. */
const MODELS = ['@cf/meta/llama-3.3-70b-instruct-fp8-fast', '@cf/meta/llama-3.1-8b-instruct-fast'];
const SYSTEM = `Você é o assistente da agenda de uma dupla de social media (Henrique e Matheus) que cuida do Instagram de várias empresas.
Você VÊ a agenda real e também PODE ALTERAR a agenda: criar, mover, editar, concluir e excluir compromissos, anotar coisas na agenda pessoal e deixar bilhetes.
Regras:
- Responda SEMPRE em português do Brasil, curto, simpático e direto, como num chat de celular.
- Baseie-se só nos dados da agenda. Nunca invente compromissos que não existem.
- Quando a pessoa PEDIR para marcar, colocar, agendar, criar, mudar, mover, remarcar, concluir, apagar ou anotar algo, você DEVE incluir as ações no final da resposta (a pessoa confirma com um toque no app). Não diga "lembre-se de ajustar": você mesmo ajusta.
- Se faltar algo essencial (ex.: empresa que não existe), pergunte em vez de inventar.
- Respeite a rotina (expediente, almoço, folga) ao SUGERIR horários; se a pessoa pedir um horário específico, use o que ela pediu.
- Na resposta em texto diga o que vai fazer (ex.: "Feito! Vou colocar Captação na JG Garcia de segunda a sábado, das 7h às 12h, até 30/11. Confirma aí embaixo 👇").

FORMATO DAS AÇÕES: depois do texto, uma linha com <acoes> e um JSON (lista) e </acoes>. Exemplos:
<acoes>[{"acao":"criar","empresa":"JG Garcia","tipo":"captacao","titulo":"Captação e edição","inicio":"07:00","fim":"12:00","responsaveis":["eu"],"datas":{"de":"2026-11-20","ate":"2026-11-30","dias_semana":[1,2,3,4,5,6]}}]</acoes>
<acoes>[{"acao":"criar","empresa":"Pura Vida","tipo":"reels","titulo":"Reels da promoção","inicio":"18:00","responsaveis":["matheus"],"data":"2026-11-21"}]</acoes>
<acoes>[{"acao":"mover","id":"e_abc123","data":"2026-11-22","inicio":"10:00"}]</acoes>
<acoes>[{"acao":"concluir","id":"e_abc123"},{"acao":"excluir","ids":["e_x1","e_x2"]}]</acoes>
<acoes>[{"acao":"editar","id":"e_abc123","titulo":"Novo título","responsaveis":["henrique","matheus"]}]</acoes>
<acoes>[{"acao":"pessoal","titulo":"Cortar cabelo","data":"2026-11-21","inicio":"15:00","categoria":"beleza"}]</acoes>
<acoes>[{"acao":"bilhete","data":"2026-11-20","texto":"Levar o tripé amanhã"}]</acoes>
Campos:
- tipo: feed, carrossel, reels, story, captacao, reuniao, producao (edição/roteiro) ou outro.
- responsaveis: "eu" (quem está falando), "henrique", "matheus" ou "ambos". Se não disser, use "eu".
- datas: use "data" para um dia só; para repetir use "datas":{"de","ate","dias_semana"} com 0=domingo, 1=segunda … 6=sábado. "Até o fim do mês" = último dia do mês atual.
- categoria do pessoal: lembrete, aniversario, compromisso, buscar, beleza, saude, pagar, compras. Coisas particulares (cabelo, médico, buscar alguém, aniversário) vão para "pessoal"; trabalho de empresa vai para "criar".
- Para mover/editar/concluir/excluir use o [id ...] que aparece na agenda. Só o mesmo id, nunca invente.
- Se não houver nada para alterar, não escreva <acoes>.`;
/* Ajuda de calendário para a IA não errar datas */
export function calendarHelp(today) {
  const t = /^\d{4}-\d{2}-\d{2}$/.test(today || '') ? today : new Date(Date.now() - 3 * 3600e3).toISOString().slice(0, 10);
  const W = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
  const d0 = new Date(t + 'T12:00:00Z');
  const last = new Date(Date.UTC(d0.getUTCFullYear(), d0.getUTCMonth() + 1, 0)).toISOString().slice(0, 10);
  const days = Array.from({ length: 14 }, (_, i) => { const d = new Date(d0.getTime() + i * 864e5); return `${W[d.getUTCDay()]} ${d.toISOString().slice(0, 10)}${i === 0 ? ' (hoje)' : i === 1 ? ' (amanhã)' : ''}`; });
  return `Hoje é ${t}. Último dia deste mês: ${last}. Próximos dias: ${days.join('; ')}.`;
}
export async function askFree(env, { question, history, context, me, today }) {
  if (!question.trim()) throw Object.assign(new Error('Escreva uma pergunta.'), { status: 400 });
  const turns = (Array.isArray(history) ? history : [])
    .filter((h) => h && (h.role === 'user' || h.role === 'assistant') && typeof h.text === 'string')
    .slice(-6)
    .map((h) => ({ role: h.role, content: h.text.slice(0, 2000) }));
  while (turns.length && turns[0].role !== 'user') turns.shift();
  const messages = [
    { role: 'system', content: `${SYSTEM}\n\n${calendarHelp(today)}\nQuem pergunta: ${me.name}.\nDados atuais da agenda:\n${context}` },
    ...turns,
    { role: 'user', content: question },
  ];
  let lastErr;
  for (const model of MODELS) {
    try {
      const out = await env.AI.run(model, { messages, max_tokens: 1400, temperature: 0.2 });
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
