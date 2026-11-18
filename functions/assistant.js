/* Assistente dentro do app: responde com base na agenda real da dupla.
   Usa o Claude Haiku 5.5 com esforço baixo (rápido e barato). A chave da API fica
   só no servidor (variável ANTHROPIC_API_KEY), nunca no app. */
import Anthropic from '@anthropic-ai/sdk';
import { TZ, nowIn, addDaysKey, TYPE_LABEL, hm } from './reminder-rules.js';

const MODEL = 'claude-haiku-5-5';
const WEEKDAYS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
const weekday = (k) => WEEKDAYS[new Date(Date.UTC(+k.slice(0, 4), +k.slice(5, 7) - 1, +k.slice(8, 10))).getUTCDay()];
const STATUS = { pendente: 'a fazer', pronto: 'pronto/agendado', feito: 'feito' };

/* Monta o retrato da agenda que o assistente recebe (sem dados de clientes de fora) */
export function buildContext({ events, companies, routine, notes, team, me, now }) {
  const co = new Map(companies.map((c) => [c.id, c.name]));
  const name = (id) => team.find((m) => m.id === id)?.name || id;
  const from = addDaysKey(now.date, -7), to = addDaysKey(now.date, 30);
  const evs = events
    .filter((e) => e.date >= from && e.date <= to)
    .sort((a, b) => (a.date + (a.time || '')).localeCompare(b.date + (b.time || '')));
  const lines = [];
  lines.push(`Agora: ${weekday(now.date)}, ${now.date.split('-').reverse().join('/')}, ${hm(`${String(Math.floor(now.minutes / 60)).padStart(2, '0')}:${String(now.minutes % 60).padStart(2, '0')}`)} (horário de Brasília).`);
  lines.push(`Quem pergunta: ${name(me)}. Equipe: ${team.map((m) => m.name).join(' e ')}.`);
  if (routine) lines.push(`Rotina combinada: expediente ${routine.workStart}–${routine.workEnd}, almoço ${routine.lunchStart}–${routine.lunchEnd}, folga: ${(routine.daysOff || []).map((d) => WEEKDAYS[d]).join(', ') || 'nenhuma'}, deslocamento mínimo ${routine.travelMin} min, máximo ${routine.maxTasks} tarefas por pessoa/dia.`);
  lines.push(`Empresas clientes: ${companies.map((c) => c.name + (c.instagram ? ` (@${c.instagram})` : '') + (c.address ? ` — endereço: ${c.address}` : '') + (c.notes ? ` — observações: ${c.notes}` : '')).join('; ') || 'nenhuma'}.`);
  lines.push('', `Agenda (de ${from.split('-').reverse().join('/')} a ${to.split('-').reverse().join('/')}):`);
  let last = '';
  evs.forEach((e) => {
    if (e.date !== last) {
      lines.push(`\n${weekday(e.date)} ${e.date.split('-').reverse().join('/')}:`);
      last = e.date;
    }
    const dur = e.duration ? ` (${e.duration} min)` : '';
    const who = (e.assignees || []).map(name).join(' e ') || 'sem responsável';
    lines.push(`- ${e.time ? hm(e.time) : 'sem horário'}${dur} · ${TYPE_LABEL[e.type] || e.type} · ${co.get(e.companyId) || '?'} · "${e.title || ''}" · ${who} · ${STATUS[e.status] || e.status}` +
      `${e.location ? ' · local: ' + e.location : ''}${e.description ? ' · legenda: ' + e.description.slice(0, 160) : ''}${e.internalNote ? ' · nota interna: ' + e.internalNote.slice(0, 160) : ''}`);
  });
  if (!evs.length) lines.push('(nenhum compromisso)');
  const recentNotes = (notes || []).filter((n) => n.date >= addDaysKey(now.date, -2)).slice(-10);
  if (recentNotes.length) lines.push('', 'Bilhetes recentes da dupla:', ...recentNotes.map((n) => `- ${n.date.split('-').reverse().join('/')} ${name(n.author)}: ${n.text}`));
  return lines.join('\n');
}

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
