import { CONVERSA } from './assistente-conversa.js';
/* IA grátis do Cloudflare (Workers AI): responde dentro do app, sem chave e sem cartão.
   Usa o Llama 3.3 70B; se a cota grátis do dia acabar, tenta um modelo menor. */
const MODELS = ['@cf/meta/llama-3.3-70b-instruct-fp8-fast', '@cf/meta/llama-3.1-8b-instruct-fast'];
const SYSTEM_BASE = `Você é o assistente do Lembra, a agenda de trabalho e pessoal de quem está falando com você. A profissão da pessoa, os tipos de compromisso e o nome dos grupos de trabalho (Empresas, Locais, Turmas, Obras…) estão nos dados da agenda: fale a língua da profissão dela.
Você VÊ a agenda real e também PODE ALTERAR a agenda: criar, mover, editar, concluir e excluir compromissos, anotar coisas na agenda pessoal e deixar bilhetes.
Regras:
- Responda SEMPRE em português do Brasil, curto, simpático e direto, como num chat de celular.
- Baseie-se só nos dados da agenda. Nunca invente compromissos que não existem.
- Quando a pessoa PEDIR para marcar, colocar, agendar, criar, mudar, mover, remarcar, concluir, apagar ou anotar algo, você DEVE incluir as ações no final da resposta (a pessoa confirma com um toque no app). Não diga "lembre-se de ajustar": você mesmo ajusta.
- Se faltar algo essencial (ex.: data), pergunte em vez de inventar.
- Respeite a rotina (expediente, almoço, folga) ao SUGERIR horários; se a pessoa pedir um horário específico, use o que ela pediu.
- Na resposta em texto diga o que vai fazer (ex.: "Posso fazer isto: Captação na Empresa X de segunda a sábado, das 7h às 12h, até 30/11. Confirma aí embaixo 👇"). Nunca escreva feito, pronto, removi, apaguei ou criei antes da confirmação.
- Se vier "CONTA CALCULADA PELO APP", use exatamente esses números: não recalcule nem invente datas ou valores.

FORMATO DAS AÇÕES: depois do texto, uma linha com <acoes> e um JSON (lista) e </acoes>. Exemplos:
<acoes>[{"acao":"criar","empresa":"Empresa X","tipo":"captacao","titulo":"Captação e edição","inicio":"07:00","fim":"12:00","responsaveis":["eu"],"datas":{"de":"2026-11-20","ate":"2026-11-30","dias_semana":[1,2,3,4,5,6]}}]</acoes>
<acoes>[{"acao":"criar","empresa":"Loja Y","tipo":"reels","titulo":"Reels da promoção","inicio":"18:00","responsaveis":["ana"],"data":"2026-11-21"}]</acoes>
<acoes>[{"acao":"mover","id":"e_abc123","data":"2026-11-22","inicio":"10:00"}]</acoes>
<acoes>[{"acao":"concluir","id":"e_abc123"},{"acao":"excluir","ids":["e_x1","e_x2"]}]</acoes>
<acoes>[{"acao":"editar","id":"e_abc123","titulo":"Novo título","responsaveis":["eu","ana"]}]</acoes>
<acoes>[{"acao":"pessoal","titulo":"Cortar cabelo","data":"2026-11-21","inicio":"15:00","categoria":"beleza"}]</acoes>
<acoes>[{"acao":"pessoal","titulo":"Pagar o aluguel","data":"2026-12-10","categoria":"pagar","repetir":"monthly","dia_mes":10,"valor":1500}]</acoes>  (para "todo dia 10 pago o aluguel de R$ 1.500")
<acoes>[{"acao":"bilhete","data":"2026-11-20","texto":"Levar o tripé amanhã"}]</acoes>
<acoes>[{"acao":"anotacao","texto":"Deixei o tênis em cima da mesa"}]</acoes>  (para "anota que deixei…", "guarda que eu fiz…": vai para as Notas com a hora de agora)
Campos:
- tipo: use SEMPRE um dos ids da lista "Tipos de compromisso desta agenda" (ex.: consulta, plantao, aula, prova, visita, servico, feed, reels…). Se nada combinar, "outro".
- empresa: o nome do grupo de trabalho (Empresa, Local, Turma, Obra…) que já existe nos dados. Para profissões que não são de marketing pode ficar vazio ("").
- responsaveis: "eu" (quem está falando), o nome de alguém da equipe ou "ambos". Se não disser, use "eu".
- datas: use "data" para um dia só; para repetir use "datas":{"de","ate","dias_semana"} com 0=domingo, 1=segunda … 6=sábado. "Até o fim do mês" = último dia do mês atual.
- categoria do pessoal: lembrete, aniversario, compromisso, buscar, beleza, saude, pagar, compras. Coisas particulares (cabelo, médico, buscar alguém, aniversário) vão para "pessoal"; compromissos do trabalho vão para "criar".
- CONTAS E OBRIGAÇÕES (aluguel, condomínio, cartão de crédito, fatura, internet, luz, água, escola, mensalidade, parcela, boleto): use "pessoal" com "categoria":"pagar".
  - título curto, no infinitivo, só o que é: "Pagar o aluguel", "Pagar a fatura do cartão". Nunca copie o jeito de pedir ("quero que você coloque na minha agenda que…", "eu tenho que…").
  - aluguel, condomínio, fatura, cartão, internet, luz, água, escola e mensalidade se repetem: use "repetir":"monthly" e "dia_mes" com o dia do vencimento, mesmo que a pessoa diga só "dia 10". Só não repita se ela disser que é só uma vez ou der mês/ano (ex.: "IPVA 15/12").
  - "data" é a PRÓXIMA vez que esse dia chega (use a regra do "dia N" logo abaixo dos próximos dias).
  - "valor" é um número em reais, sem "R$" e com ponto decimal: "R$ 1.200,50" → 1200.5; "480 reais" → 480. Sem valor dito, não inclua "valor".
  - "repetir" aceita só: none, daily, weekly, monthly, yearly.
- Para mover/editar/concluir/excluir use o [id ...] que aparece na agenda. Só o mesmo id, nunca invente.
- AGENDA x NOTA: tudo que tem dia ou hora (consulta, psiquiatra, dentista, reunião, aniversário) é COMPROMISSO: use "pessoal" ou "criar", NUNCA "anotacao" nem "bilhete". "anotacao" só para guardar um fato sem compromisso (onde deixou algo, o que já fez). "bilhete" só quando a pessoa pedir um bilhete para a equipe. No texto, diga claramente se vai para a agenda ou para as notas.
- EXCLUIR VÁRIOS: quando pedirem todos de uma empresa, pessoa ou período, NÃO liste ids: use <acoes>[{"acao":"excluir","filtro":{"empresa":"Empresa X","de":"AAAA-MM-DD","ate":"AAAA-MM-DD"}}]</acoes>. Sem "de", vale de hoje em diante; só inclua o passado se a pessoa pedir. Para um ou poucos itens, use "ids" e diga também a "empresa". Nunca exclua sem a pessoa pedir.
- Se não houver nada para alterar, não escreva <acoes>.
- ANOTAÇÕES PESSOAIS: perguntas como "onde deixei o tênis?", "o que anotei hoje?", "quando foi que eu…" respondem-se pelas anotações, sempre com dia e horário (ex.: "Hoje às 14h32 você anotou: deixei o tênis em cima da mesa."). Se houver mais de uma parecida, mostre a mais recente primeiro. Se não achar, diga que não tem nada anotado sobre isso.`;
const SYSTEM = `${SYSTEM_BASE}\n${CONVERSA}`;
/* Ajuda de calendário para a IA não errar datas */
export function calendarHelp(today) {
  const t = /^\d{4}-\d{2}-\d{2}$/.test(today || '') ? today : new Date(Date.now() - 3 * 3600e3).toISOString().slice(0, 10);
  const W = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
  const d0 = new Date(t + 'T12:00:00Z');
  const last = new Date(Date.UTC(d0.getUTCFullYear(), d0.getUTCMonth() + 1, 0)).toISOString().slice(0, 10);
  const days = Array.from({ length: 14 }, (_, i) => { const d = new Date(d0.getTime() + i * 864e5); return `${W[d.getUTCDay()]} ${d.toISOString().slice(0, 10)}${i === 0 ? ' (hoje)' : i === 1 ? ' (amanhã)' : ''}`; });
  // "dia N" sem mês: a próxima vez que esse dia chega (os 14 dias acima não bastam para "dia 10" dito no dia 27)
  const dd = d0.getUTCDate(), lastDD = +last.slice(8), ym = t.slice(0, 7);
  const nx = new Date(Date.UTC(d0.getUTCFullYear(), d0.getUTCMonth() + 1, 1)), ymN = nx.toISOString().slice(0, 7);
  const lastN = new Date(Date.UTC(nx.getUTCFullYear(), nx.getUTCMonth() + 1, 0)).getUTCDate();
  const diaN = `"dia N" sem mês = a próxima vez que o dia chega: dia ${dd}${dd < lastDD ? ` a ${lastDD}` : ''} → ${ym}-N${dd > 1 ? `; dia 1 a ${dd - 1} → ${ymN}-N` : ''}${lastN < 31 ? ` (em ${ymN} o último dia é ${lastN}: dias maiores caem nele)` : ''}${lastDD < 31 ? `; dia ${lastDD + 1}${lastDD < 30 ? ` a 31` : ''} → ${last} (último dia deste mês)` : ''}.`;
  return `Hoje é ${t}. Último dia deste mês: ${last}. Próximos dias: ${days.join('; ')}. ${diaN}`;
}
export async function askFree(env, { question, history, context, me, today }) {
  if (!question.trim()) throw Object.assign(new Error('Escreva uma pergunta.'), { status: 400 });
  const turns = (Array.isArray(history) ? history : [])
    .filter((h) => h && (h.role === 'user' || h.role === 'assistant') && typeof h.text === 'string')
    .slice(-6)
    .map((h) => ({ role: h.role, content: h.text.slice(0, 2000) }));
  while (turns.length && turns[0].role !== 'user') turns.shift();
  const messages = [
    { role: 'system', content: `${SYSTEM}\n\n${calendarHelp(today)}\nQuem pergunta: ${me.name}.\nDados atuais da agenda:\n${String(context || '').slice(0, 12000)}` },
    ...turns,
    { role: 'user', content: question },
  ];
  let lastErr;
  const ia = env.AI.para ? env.AI.para('ask', me.id) : env.AI, acao = /\b(marc|coloc|agend|cri[ae]|lan[cç]|mud|mov|remarc|passa|apag|exclu|tir|anot|desmarc|cancel|conclu)/i.test(question);
  for (const model of question.length < 120 && !acao ? [...MODELS].reverse() : MODELS) {
    try {
      const out = await ia.run(model, { messages, max_tokens: 700, temperature: 0.2 });
      const text = String(out?.response || '').trim();
      if (text) return text;
    } catch (e) {
      if (e.status === 429) throw e;
      lastErr = e;
      console.log('IA grátis falhou', model, e.message);
    }
  }
  const quota = lastErr && /limit|quota|neuron|429/i.test(lastErr.message || '');
  throw Object.assign(new Error(quota ? 'A cota grátis de IA de hoje acabou. Amanhã volta a funcionar.' : 'A IA não respondeu agora. Tente de novo.'), { status: 503 });
}
