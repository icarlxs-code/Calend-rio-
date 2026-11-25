/* "Perguntar ao Claude": abre o Claude com o login normal da pessoa (app ou claude.ai),
   já com o contexto da agenda. Sem chave de API: nada é enviado por este app. */
import { store } from './store.js';
import { TYPES, WORK, isMarketing } from './constants.js';
import { todayKey, addDays, fmtDayLong, fromKey, WEEKDAYS } from './utils.js';
import { routine } from './planner.js';
import { toast } from './components.js';

/* atalhos fixos do assistente */
const DIA = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
export function presets() { const d = new Date().getDay(), alvo = d >= 5 ? 1 : 5; return [{ label: 'O que tenho hoje?', q: 'O que tenho hoje?' }, { label: '+ Criar lembrete', escreve: 'Lembrar de ' }, { label: `Estou livre ${DIA[alvo]}?`, q: `Estou livre ${DIA[alvo]}?` }]; }

const who = (ids = []) => ids.map((id) => store.member(id)?.name).filter(Boolean).join(' e ') || 'sem responsável';

export function buildPrompt(question, days = 14) {
  const r = routine();
  const t = todayKey();
  const now = new Date();
  const lines = [];
  lines.push(`${isMarketing() ? `Você é o assistente de organização de uma dupla de social media (${store.team.map((m) => m.name).join(' e ')}) que cuida do Instagram de várias empresas.` : `Você é o assistente de organização de ${store.team.map((m) => m.name).join(' e ')}${WORK.profession ? `, que trabalha como ${WORK.profession}` : ''}. Fale a língua dessa profissão.`} Responda em português do Brasil, de forma curta e direta (sem rodeios), com horários concretos e no máximo uns 10 itens.`);
  lines.push('');
  lines.push(`Agora: ${fmtDayLong(t)}, ${now.toTimeString().slice(0, 5)}.`);
  lines.push(`Rotina combinada: expediente ${r.workStart}–${r.workEnd}, almoço ${r.lunchStart}–${r.lunchEnd}, folga: ${r.daysOff.map((d) => WEEKDAYS[d]).join(', ') || 'nenhuma'}, deslocamento mínimo entre lugares: ${r.travelMin} min, máximo de ${r.maxTasks} tarefas por pessoa/dia.`);
  lines.push(`Empresas: ${store.companiesSorted().map((c) => c.name + (c.instagram ? ` (@${c.instagram})` : '')).join(', ') || 'nenhuma'}.`);
  lines.push('');
  lines.push(`Agenda (de hoje até ${days} dias):`);
  const evs = store.eventsBetween(addDays(t, -1), addDays(t, days));
  let last = '';
  evs.forEach((e) => {
    if (e.date !== last) {
      lines.push(`\n${fmtDayLong(e.date)}:`);
      last = e.date;
    }
    const c = store.company(e.companyId);
    const dur = e.duration ? ` (${e.duration} min)` : '';
    lines.push(`- ${e.time || 'sem horário'}${dur} · ${TYPES[e.type]?.label} · ${c?.name || '?'} · "${e.title || ''}" · ${who(e.assignees)} · ${e.status === 'feito' ? 'feito' : e.status === 'pronto' ? 'pronto' : 'a fazer'}${e.location ? ' · local: ' + e.location : ''}`);
  });
  if (!evs.length) lines.push('(nenhum compromisso)');
  lines.push('');
  lines.push(`Pergunta: ${question}`);
  return lines.join('\n');
}

export function askClaude(question) {
  const prompt = buildPrompt(question);
  // Copia (precisa acontecer no mesmo toque, por isso sem await)
  try {
    navigator.clipboard?.writeText(prompt).catch(() => {});
  } catch { /* ignora */ }
  const enc = encodeURIComponent(prompt);
  const url = enc.length < 7500 ? `https://claude.ai/new?q=${enc}` : 'https://claude.ai/new';
  window.open(url, '_blank', 'noopener');
  toast(enc.length < 7500 ? 'Abrindo o Claude… (a agenda também foi copiada)' : 'Agenda copiada: cole no Claude (segure no campo → Colar)', { ms: 5000 });
}
