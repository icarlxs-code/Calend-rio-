/* Exporta eventos para o Calendário do iPhone (.ics) com alarmes */
import { store } from './store.js';
import { TYPES, durationOf } from './constants.js';
import { toMin, fromMin, addDays } from './utils.js';
import { CONFIG } from '../config.js';
import { server as pushServer } from './avisos.js';

const EMOJI = { feed: '🖼️', carrossel: '🗂️', reels: '🎬', story: '⭕', captacao: '📸', reuniao: '🤝', producao: '✂️', outro: '•' };

const escText = (s) => String(s || '').replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
const fold = (line) => {
  const out = [];
  while (line.length > 74) {
    out.push(line.slice(0, 74));
    line = ' ' + line.slice(74);
  }
  out.push(line);
  return out.join('\r\n');
};
const dt = (date, time) => date.replace(/-/g, '') + 'T' + time.replace(':', '') + '00';
const stamp = () => new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');

export function buildICS(events, calName) {
  const L = ['BEGIN:VCALENDAR', 'VERSION:2.0', `PRODID:-//${CONFIG.appName}//PT-BR`, 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', `X-WR-CALNAME:${escText(calName)}`];
  events.forEach((e) => {
    const c = store.company(e.companyId);
    const who = (e.assignees || []).map((id) => store.member(id)?.name).filter(Boolean).join(' e ');
    const summary = `${EMOJI[e.type] || ''} ${TYPES[e.type]?.label || 'Evento'} · ${c?.name || ''}${e.title ? ' — ' + e.title : ''}`.trim();
    const desc = [who && `Responsável: ${who}`, e.description, e.internalNote && `Nota interna: ${e.internalNote}`].filter(Boolean).join('\n');
    L.push('BEGIN:VEVENT', `UID:${e.id}@pauta`, `DTSTAMP:${stamp()}`);
    if (e.time) {
      const end = toMin(e.time) + durationOf(e);
      const endDate = end >= 1440 ? addDays(e.date, 1) : e.date;
      L.push(`DTSTART:${dt(e.date, e.time)}`, `DTEND:${dt(endDate, fromMin(end % 1440))}`);
    } else {
      L.push(`DTSTART;VALUE=DATE:${e.date.replace(/-/g, '')}`, `DTEND;VALUE=DATE:${addDays(e.date, 1).replace(/-/g, '')}`);
    }
    L.push(`SUMMARY:${escText(summary)}`);
    if (desc) L.push(`DESCRIPTION:${escText(desc)}`);
    if (e.location) L.push(`LOCATION:${escText(e.location)}`);
    const rem = e.reminder ?? 30;
    if (rem >= 0) {
      L.push('BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${escText(summary)}`, `TRIGGER:-PT${rem}M`, 'END:VALARM');
    }
    L.push('END:VEVENT');
  });
  L.push('END:VCALENDAR');
  return L.map(fold).join('\r\n');
}

export async function downloadICS(events, filename, calName) {
  const text = buildICS(events, calName);
  // Com o servidor: abre direto em "Adicionar ao Calendário", sem passar pelo menu de apps
  const server = pushServer();
  if (server) {
    const f = document.createElement('form');
    f.method = 'POST'; f.action = server.replace(/\/$/, '') + '/ics'; f.target = '_blank'; f.style.display = 'none';
    const inp = document.createElement('textarea'); inp.name = 'ics'; inp.value = text; f.appendChild(inp);
    document.body.appendChild(f); f.submit(); f.remove();
    return;
  }
  const file = new File([text], filename, { type: 'text/calendar' });
  // No iPhone, o menu Compartilhar oferece abrir direto no Calendário
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: calName });
      return;
    } catch (err) {
      if (err && err.name === 'AbortError') return;
    }
  }
  const url = URL.createObjectURL(file);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
