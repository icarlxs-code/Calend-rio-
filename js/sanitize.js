/* Validação de dados vindos de fora (backup importado, nuvem, link do cliente).
   Impede que um arquivo ou link malicioso injete código na página. */
import { TYPES, STATUS } from './constants.js';

const HEX = /^#[0-9a-fA-F]{6}$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;
const IMG = /^data:image\/(png|jpe?g|webp|gif);base64,[A-Za-z0-9+/=]+$/;

const str = (v, max = 2000) => (typeof v === 'string' ? v.slice(0, max) : '');
const num = (v, min, max, def) => (Number.isFinite(Number(v)) && v !== null && v !== '' ? Math.min(max, Math.max(min, Number(v))) : def);
export const safeColor = (c, def = '#64748B') => (HEX.test(c || '') ? c : def);
export const safeLogo = (l) => (typeof l === 'string' && l.length < 400000 && IMG.test(l) ? l : null);
export const safeDate = (d) => (DATE.test(d || '') ? d : null);
export const safeTime = (t) => (TIME.test(t || '') ? t : '');
const safeType = (t) => (TYPES[t] ? t : 'outro');
const safeStatus = (s) => (STATUS[s] ? s : 'pendente');
const ids = (a) => (Array.isArray(a) ? a.filter((x) => typeof x === 'string').slice(0, 10) : []);

export function sanitizeItem(col, x) {
  if (!x || typeof x !== 'object' || typeof x.id !== 'string') return null;
  if (col === 'events') {
    const date = safeDate(x.date);
    if (!date) return null;
    return {
      ...x,
      date,
      time: safeTime(x.time),
      type: safeType(x.type),
      status: safeStatus(x.status),
      title: str(x.title, 200),
      description: str(x.description),
      internalNote: str(x.internalNote),
      location: str(x.location, 300),
      assignees: ids(x.assignees),
      duration: x.duration ? num(x.duration, 5, 1440, null) : null,
      reminder: num(x.reminder, -1, 10080, 30),
      visibleToClient: x.visibleToClient !== false,
    };
  }
  if (col === 'companies') {
    return {
      ...x,
      name: str(x.name, 80) || 'Sem nome',
      color: safeColor(x.color),
      logo: safeLogo(x.logo),
      instagram: str(x.instagram, 60).replace(/[^\w.]/g, ''),
      niche: str(x.niche, 160),
      address: str(x.address, 300),
      contact: str(x.contact, 300),
      notes: str(x.notes),
      shareToken: typeof x.shareToken === 'string' && /^[A-Za-z0-9]{10,64}$/.test(x.shareToken) ? x.shareToken : null,
    };
  }
  if (col === 'notes') {
    const date = safeDate(x.date);
    if (!date) return null;
    return { ...x, date, text: str(x.text, 500), author: str(x.author, 40) };
  }
  if (col === 'settings') {
    if (/^seed-[\w-]{1,40}$/.test(x.id)) return { id: x.id, done: ids(x.done), updatedAt: x.updatedAt };
    if (x.id !== 'routine') return null;
    return {
      id: 'routine',
      workStart: safeTime(x.workStart) || '08:00',
      workEnd: safeTime(x.workEnd) || '19:00',
      lunchStart: safeTime(x.lunchStart) || '12:00',
      lunchEnd: safeTime(x.lunchEnd) || '13:00',
      daysOff: Array.isArray(x.daysOff) ? x.daysOff.filter((d) => Number.isInteger(d) && d >= 0 && d <= 6) : [0],
      travelMin: num(x.travelMin, 0, 240, 45),
      maxTasks: num(x.maxTasks, 1, 50, 8),
      updatedAt: x.updatedAt,
    };
  }
  return x;
}

/* Pacote do link do cliente */
export function sanitizePayload(p) {
  if (!p || typeof p !== 'object' || !p.company) throw new Error('payload inválido');
  return {
    v: 1,
    company: {
      name: str(p.company.name, 80) || 'Empresa',
      color: safeColor(p.company.color),
      logo: safeLogo(p.company.logo),
      instagram: str(p.company.instagram, 60).replace(/[^\w.]/g, ''),
    },
    events: (Array.isArray(p.events) ? p.events : []).slice(0, 2000).map((e) => ({
      date: safeDate(e?.date),
      time: safeTime(e?.time),
      type: safeType(e?.type),
      title: str(e?.title, 200),
      description: str(e?.description),
      status: safeStatus(e?.status),
      duration: e?.duration ? num(e.duration, 5, 1440, 0) : 0,
      location: str(e?.location, 300),
    })).filter((e) => e.date),
    updatedAt: num(p.updatedAt, 0, 9e15, Date.now()),
  };
}
