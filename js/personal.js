/* Agenda pessoal: privada de cada pessoa. Fica em pessoal/{uid}/itens na nuvem
   (só o dono lê e escreve) e não se mistura com o calendário de trabalho. */
import { store } from './store.js';
import { todayKey, addDays, fromKey, toKey, pad, uid } from './utils.js';
import { server, api } from './avisos.js';

export const CATS = {
  lembrete: { label: 'Lembrete', emoji: '📝', color: '#8E8E93', words: [] },
  aniversario: { label: 'Aniversário', emoji: '🎂', color: '#FF2D55', words: ['aniversário', 'aniversario', 'niver', 'aniver'] },
  compromisso: { label: 'Compromisso', emoji: '📍', color: '#007AFF', words: ['ir ao', 'ir na', 'ir no', 'ir para', 'ir pra', 'reunião', 'encontro', 'evento', 'festa', 'casamento'] },
  buscar: { label: 'Buscar / levar', emoji: '🚗', color: '#FF9500', words: ['buscar', 'levar', 'pegar ', 'carona'] },
  beleza: { label: 'Cabelo / beleza', emoji: '💈', color: '#AF52DE', words: ['cabelo', 'barba', 'barbeiro', 'unha', 'manicure', 'sobrancelha', 'salão'] },
  saude: { label: 'Saúde', emoji: '🩺', color: '#34C759', words: ['médico', 'medico', 'dentista', 'exame', 'consulta', 'remédio', 'remedio', 'academia', 'treino', 'vacina'] },
  pagar: { label: 'Pagar conta', emoji: '💸', color: '#30B0C7', words: ['pagar', 'conta de', 'boleto', 'fatura', 'aluguel', 'pix'] },
  compras: { label: 'Compras', emoji: '🛒', color: '#5856D6', words: ['comprar', 'mercado', 'farmácia', 'farmacia'] },
};
export const REPEATS = { none: 'Não repete', weekly: 'Toda semana', monthly: 'Todo mês', yearly: 'Todo ano' };

const LS = 'cal.pessoal.v1';
let items = [], unsub = null, started = false;
const listeners = new Set();
export const personal = {
  get items() { return items; },
  on(fn) { listeners.add(fn); return () => listeners.delete(fn); },
  item: (id) => items.find((x) => x.id === id),
};
const emit = () => { listeners.forEach((f) => f()); syncPersonalSchedule(); };
const cloud = () => (store.mode === 'cloud' && store.backendApi && store.backendApi.writePersonal ? store.backendApi : null);

export function startPersonal() {
  if (started) return;
  started = true;
  const c = cloud();
  if (c) {
    unsub = c.subscribePersonal((list) => { items = list; emit(); }, (err) => store.onError && store.onError(err));
  } else {
    try { items = JSON.parse(localStorage.getItem(LS) || '[]'); } catch { items = []; }
    emit();
  }
}
const saveLocal = () => { try { localStorage.setItem(LS, JSON.stringify(items)); } catch { /* cheio */ } };

export function savePersonal(it) {
  it = { ...it, updatedAt: Date.now() };
  if (!it.id) it.id = uid('p_');
  if (!it.createdAt) it.createdAt = Date.now();
  const i = items.findIndex((x) => x.id === it.id);
  items = i >= 0 ? items.map((x) => (x.id === it.id ? it : x)) : [...items, it];
  const c = cloud();
  if (c) c.writePersonal(it).catch((e) => store.onError && store.onError(e)); else saveLocal();
  emit();
  return it;
}
export function removePersonal(id) {
  items = items.filter((x) => x.id !== id);
  const c = cloud();
  if (c) c.delPersonal(id).catch((e) => store.onError && store.onError(e)); else saveLocal();
  emit();
}

/* Quando um item cai num dia (inclui repetições) */
function occursOn(it, day) {
  if (day < it.date) return false;
  if (it.until && day > it.until) return false;
  const r = it.repeat || 'none';
  if (r === 'none') return day === it.date;
  if (r === 'yearly') return day.slice(5) === it.date.slice(5);
  if (r === 'monthly') return day.slice(8) === it.date.slice(8);
  if (r === 'weekly') return fromKey(day).getDay() === fromKey(it.date).getDay();
  return false;
}
const doneOn = (it, day) => (it.repeat && it.repeat !== 'none' ? (it.doneDates || []).includes(day) : !!it.done);
export { doneOn };

/* Lista de { item, date } entre duas datas, em ordem */
export function occurrences(from, to) {
  const out = [];
  for (let d = from; d <= to; d = addDays(d, 1)) {
    for (const it of items) if (occursOn(it, d)) out.push({ item: it, date: d, done: doneOn(it, d) });
  }
  return out.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : (a.item.time || '99') < (b.item.time || '99') ? -1 : 1));
}
export function overdue() {
  const t = todayKey();
  return items.filter((it) => (it.repeat || 'none') === 'none' && !it.done && it.date < t && it.date >= addDays(t, -60))
    .sort((a, b) => (a.date < b.date ? -1 : 1));
}
export function toggleDone(it, day) {
  if (it.repeat && it.repeat !== 'none') {
    const s = new Set(it.doneDates || []);
    s.has(day) ? s.delete(day) : s.add(day);
    return savePersonal({ ...it, doneDates: [...s].filter((d) => d >= addDays(todayKey(), -60)) });
  }
  return savePersonal({ ...it, done: !it.done });
}

/* ---------- escrever do jeito que fala: "cortar cabelo amanhã 15h" ---------- */
const WD = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
export function guessCat(text) {
  const t = ' ' + text.toLowerCase() + ' ';
  for (const [k, c] of Object.entries(CATS)) if (c.words.some((w) => t.includes(w))) return k;
  return 'lembrete';
}
export function parseQuick(raw) {
  let text = ' ' + raw.trim() + ' ';
  const low = () => text.toLowerCase();
  let date = null, time = null;
  const take = (re, fn) => { const m = re.exec(low()); if (m) { fn(m); text = text.slice(0, m.index) + ' ' + text.slice(m.index + m[0].length); } };
  const t = todayKey();
  take(/\s(depois de amanhã|depois de amanha)\s/, () => (date = addDays(t, 2)));
  take(/\s(amanhã|amanha)\s/, () => (date = addDays(t, 1)));
  take(/\shoje\s/, () => (date = t));
  take(/\s(?:dia\s)?(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?\s/, (m) => {
    const y = m[3] ? (m[3].length === 2 ? '20' + m[3] : m[3]) : t.slice(0, 4);
    let k = `${y}-${pad(+m[2])}-${pad(+m[1])}`;
    if (!m[3] && k < t) k = `${+y + 1}-${pad(+m[2])}-${pad(+m[1])}`;
    date = k;
  });
  take(/\s(?:no |na |nesta |nessa |próxima |proxima )?(domingo|segunda|terça|terca|quarta|quinta|sexta|sábado|sabado)(?:-feira)?\s/, (m) => {
    const name = m[1].replace('terca', 'terça').replace('sabado', 'sábado');
    const want = WD.indexOf(name);
    let d = addDays(t, 1);
    while (fromKey(d).getDay() !== want) d = addDays(d, 1);
    date = d;
  });
  take(/\s(?:às|as)\s(\d{1,2})(?:[:h](\d{2}))?h?\s|\s(\d{1,2})(?:h(\d{2})?|:(\d{2}))\s/, (m) => {
    const h = +(m[1] ?? m[3]), mi = +(m[2] ?? m[4] ?? m[5] ?? 0);
    if (h <= 23 && mi <= 59) time = `${pad(h)}:${pad(mi)}`;
  });
  take(/\s(?:ao )?meio-dia\s/, () => (time = '12:00'));
  const title = text.replace(/\s+/g, ' ').trim().replace(/^(de|do|da|para|pra)\s/i, '');
  const cat = guessCat(raw);
  return { title: title.charAt(0).toUpperCase() + title.slice(1), date: date || t, time, cat, repeat: cat === 'aniversario' ? 'yearly' : 'none' };
}
export const quickParse = parseQuick;

/* ---------- lembretes no celular (só para o dono) ---------- */
const at = (date, time) => Date.parse(`${date}T${time}:00-03:00`);
export function buildPersonalSchedule() {
  const now = Date.now(), t = todayKey();
  const out = [];
  for (const { item: it, date, done } of occurrences(addDays(t, -1), addDays(t, 35))) {
    if (done || it.remind === 'none') continue;
    const c = CATS[it.cat] || CATS.lembrete;
    const name = `${c.emoji} ${it.title}`;
    const url = `./#/p/${it.id}`;
    const push = (when, title, body, key) => { if (when > now - 60e3) out.push({ id: `p-${it.id}-${date}-${key}`, at: when, title, body, tag: `p-${it.id}`, url }); };
    if (it.cat === 'aniversario') {
      push(at(addDays(date, -1), '20:00'), 'Amanhã tem aniversário 🎂', it.title, 'd1');
      push(at(date, '08:00'), 'Hoje é aniversário 🎂', `${it.title} — não esquece de dar os parabéns!`, 'd0');
    } else if (it.time) {
      const [h, m] = it.time.split(':').map(Number);
      const base = at(date, it.time);
      push(base - 60 * 60e3, 'Daqui a 1 hora', `${name} às ${it.time.replace(':00', 'h')}`, 'm60');
      push(base - 15 * 60e3, 'Daqui a 15 min', name, 'm15');
      push(base, 'Agora', name, 'm0');
      if (h >= 10 || m) push(at(date, '08:00'), 'Hoje você tem', `${name} às ${it.time.replace(':00', 'h')}`, 'am');
    } else {
      push(at(addDays(date, -1), '20:00'), 'Amanhã', name, 'd1');
      push(at(date, '08:00'), 'Não esquece hoje', name, 'd0');
    }
  }
  return out.sort((a, b) => a.at - b.at).slice(0, 300);
}
let timer = null, lastSig = '';
export function syncPersonalSchedule() {
  if (store.mode !== 'cloud' || !server()) return;
  clearTimeout(timer);
  timer = setTimeout(() => {
    const list = buildPersonalSchedule();
    const sig = JSON.stringify(list);
    if (sig === lastSig) return;
    api('/personal', { items: list }).then(() => (lastSig = sig)).catch(() => {});
  }, 2500);
}
setInterval(() => { lastSig = ''; syncPersonalSchedule(); }, 6 * 3600e3); // renova a janela de 35 dias
