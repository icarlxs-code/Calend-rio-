/* Monta o texto com a agenda que o assistente recebe. Sem dependências:
   usado pelo app (navegador) e pelo servidor. */
import { addDaysKey, TYPE_LABEL, hm } from './reminder-rules.js';

const WEEKDAYS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
const weekday = (k) => WEEKDAYS[new Date(Date.UTC(+k.slice(0, 4), +k.slice(5, 7) - 1, +k.slice(8, 10))).getUTCDay()];
const STATUS = { pendente: 'a fazer', pronto: 'pronto/agendado', feito: 'feito' };

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
    const who = (e.assignees || []).map(name).join(' e ') || 'sem responsável';
    let when = 'sem horário';
    if (e.time) {
      when = hm(e.time);
      if (e.duration) {
        const [h, m] = e.time.split(':').map(Number);
        const end = h * 60 + m + e.duration;
        when += ` às ${hm(`${String(Math.floor(end / 60) % 24).padStart(2, '0')}:${String(end % 60).padStart(2, '0')}`)}`;
      }
    }
    const extra = [e.location && `local ${e.location}`, e.description && `legenda: ${e.description.slice(0, 140)}`, e.internalNote && `obs: ${e.internalNote.slice(0, 140)}`].filter(Boolean).join('; ');
    lines.push(`- ${when} — ${TYPE_LABEL[e.type] || e.type}: ${e.title || 'sem título'} — empresa ${co.get(e.companyId) || '?'} — responsável ${who}${e.status === 'feito' ? ' (já feito)' : ''}${extra ? ' — ' + extra : ''}`);
  });
  if (!evs.length) lines.push('(nenhum compromisso)');
  const recentNotes = (notes || []).filter((n) => n.date >= addDaysKey(now.date, -2)).slice(-10);
  if (recentNotes.length) lines.push('', 'Bilhetes recentes da dupla:', ...recentNotes.map((n) => `- ${n.date.split('-').reverse().join('/')} ${name(n.author)}: ${n.text}`));
  return lines.join('\n');
}

