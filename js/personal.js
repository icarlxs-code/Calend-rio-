/* Espaço Pessoal: privado de cada pessoa. Fica em pessoal/{uid}/itens na nuvem
   (só o dono lê e escreve) e não se mistura com o calendário de trabalho.
   Tipos de documento: compromisso/lembrete (padrão), lista ("list") e preferências ("prefs"). */
import { store } from './store.js';
import { todayKey, addDays, fromKey, pad, uid } from './utils.js';
import { server, api } from './avisos.js';
import { streak } from './reward.js';

export const CATS = {
  lembrete: { label: 'Lembrete', emoji: '📝', ic: 'note', g: ['#8E9AAF', '#5B6478'], color: '#6B7489', words: [] },
  aniversario: { label: 'Aniversário', emoji: '🎂', ic: 'cake', g: ['#FF7A9C', '#E8326A'], color: '#F0457A', words: ['aniversário', 'aniversario', 'niver', 'aniver'] },
  compromisso: { label: 'Compromisso', emoji: '📍', ic: 'mappin', g: ['#5AA8FF', '#2F6BFF'], color: '#2F7BFF', words: ['ir ao', 'ir na', 'ir no', 'ir para', 'ir pra', 'reunião', 'encontro', 'evento', 'festa', 'casamento', 'igreja', 'culto', 'missa'] },
  buscar: { label: 'Buscar / levar', emoji: '🚗', ic: 'car', g: ['#FFB547', '#FF7A1A'], color: '#FF8A1F', words: ['buscar', 'levar', 'pegar ', 'carona'] },
  beleza: { label: 'Cabelo / beleza', emoji: '💈', ic: 'sparkles', g: ['#C78BFF', '#8A4DFF'], color: '#9B5CFF', words: ['cabelo', 'barba', 'barbeiro', 'unha', 'manicure', 'sobrancelha', 'salão'] },
  saude: { label: 'Saúde', emoji: '🩺', ic: 'pulse', g: ['#4BD88B', '#16A35A'], color: '#1FB566', words: ['médico', 'medico', 'dentista', 'exame', 'consulta', 'remédio', 'remedio', 'academia', 'treino', 'vacina'] },
  pagar: { label: 'Pagar conta', emoji: '💸', ic: 'card', g: ['#3FD0E0', '#0E8FB0'], color: '#14A3C2', words: ['pagar', 'conta de', 'boleto', 'fatura', 'aluguel', 'pix'] },
  compras: { label: 'Compras', emoji: '🛒', ic: 'cart', g: ['#8B8CFF', '#5146E5'], color: '#5E5CF0', words: ['comprar', 'mercado', 'farmácia', 'farmacia'] },
};
export const REPEATS = { none: 'Não repete', daily: 'Todo dia', weekly: 'Toda semana', biweekly: 'A cada 2 semanas', monthly: 'Todo mês', yearly: 'Todo ano' };
export const LIST_ICONS = {
  cart: { g: ['#8B8CFF', '#5146E5'] },
  listcheck: { g: ['#4BD88B', '#16A35A'] },
  bulb: { g: ['#FFD25A', '#F59E0B'] },
  gift: { g: ['#FF7A9C', '#E8326A'] },
  note: { g: ['#8E9AAF', '#5B6478'] },
  pulse: { g: ['#3FD0E0', '#0E8FB0'] },
  sparkles: { g: ['#C78BFF', '#8A4DFF'] },
  mappin: { g: ['#5AA8FF', '#2F6BFF'] },
};
export const LIST_PRESETS = [
  { ic: 'cart', name: 'Mercado' },
  { ic: 'listcheck', name: 'Coisas para fazer' },
  { ic: 'bulb', name: 'Ideias' },
  { ic: 'gift', name: 'Presentes' },
];
const OLD_EMOJI = { '🛒': 'cart', '✅': 'listcheck', '💡': 'bulb', '🎁': 'gift', '📝': 'note' };
export const listIcon = (l) => (l && LIST_ICONS[l.ic] ? l.ic : OLD_EMOJI[l?.emoji] || 'note');
const DEFAULT_PREFS = { reminders: true, morning: true, night: true, nudges: true, water: true, meals: true, faith: true, freq: 'normal' };

const LS = 'cal.pessoal.v1';
let items = [], started = false;
const listeners = new Set();
const isEvent = (x) => !x.kind || x.kind === 'event';

export const personal = {
  get items() { return items; },
  get events() { return items.filter(isEvent); },
  get lists() { return items.filter((x) => x.kind === 'list').sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0)); },
  get prefs() { return { ...DEFAULT_PREFS, ...(items.find((x) => x.kind === 'prefs') || {}) }; },
  ready: false,
  gate: null, // portão do plano (definido pelo app)
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
    c.subscribePersonal((list) => { items = list; personal.ready = true; personal.error = null; emit(); }, (err) => {
      console.error('pessoal', err);
      personal.error = /permission/i.test(String(err?.code || err?.message)) ? 'rules' : 'net';
      personal.ready = true;
      emit();
    });
  } else {
    try { items = JSON.parse(localStorage.getItem(LS) || '[]'); } catch { items = []; }
    personal.ready = true;
    emit();
  }
}
function writeFailed(e) {
  console.error('pessoal: falha ao salvar', e);
  if (/permission/i.test(String(e?.code || e?.message))) { personal.error = 'rules'; emit(); }
  else if (store.onError) store.onError(e);
}
const saveLocal = () => { try { localStorage.setItem(LS, JSON.stringify(items)); } catch { /* cheio */ } };

export function savePersonal(it) {
  // sem plano ativo: nada é gravado (só as preferências da ficha)
  if (personal.gate && it.kind !== 'prefs' && !personal.gate(it)) return null;
  it = { ...it, updatedAt: Date.now() };
  if (!it.id) it.id = uid('p_');
  if (!it.createdAt) it.createdAt = Date.now();
  const i = items.findIndex((x) => x.id === it.id);
  if (personal.onSaved) try { personal.onSaved(i >= 0 ? items[i] : null, it); } catch { /* ok */ }
  items = i >= 0 ? items.map((x) => (x.id === it.id ? it : x)) : [...items, it];
  const c = cloud();
  if (c) c.writePersonal(it).catch(writeFailed); else saveLocal();
  emit();
  return it;
}
export function removePersonal(id) {
  if (personal.gate && !personal.gate({ id })) return;
  items = items.filter((x) => x.id !== id);
  const c = cloud();
  if (c) c.delPersonal(id).catch(writeFailed); else saveLocal();
  emit();
}
export const savePrefs = (p) => savePersonal({ ...personal.prefs, ...p, id: 'prefs', kind: 'prefs' });

/* ---------- listas (mercado, coisas para fazer...) ---------- */
export const newList = (name, ic = 'note') => savePersonal({ kind: 'list', name, ic: LIST_ICONS[ic] ? ic : 'note', entries: [] });
export function addEntry(list, text) {
  const t = text.trim();
  if (!t) return list;
  return savePersonal({ ...list, entries: [...(list.entries || []), { id: uid('i'), text: t.slice(0, 200), done: false }] });
}
export const toggleEntry = (list, eid) => savePersonal({ ...list, entries: list.entries.map((e) => (e.id === eid ? { ...e, done: !e.done } : e)) });
export const removeEntry = (list, eid) => savePersonal({ ...list, entries: list.entries.filter((e) => e.id !== eid) });
export const clearDone = (list) => savePersonal({ ...list, entries: list.entries.filter((e) => !e.done) });

/* ---------- compromissos e repetições ---------- */
export function occursOn(it, day) {
  if (!it.date || day < it.date) return false;
  if (it.until && day > it.until) return false;
  const r = it.repeat || 'none';
  if (r === 'none') return day === it.date;
  if (r === 'daily') return true;
  if (r === 'yearly') return day.slice(5) === it.date.slice(5);
  if (r === 'monthly') return day.slice(8) === it.date.slice(8);
  if (r === 'weekly') return fromKey(day).getDay() === fromKey(it.date).getDay();
  if (r === 'biweekly') return Math.round((fromKey(day) - fromKey(it.date)) / 864e5) % 14 === 0;
  return false;
}
export const doneOn = (it, day) => (it.repeat && it.repeat !== 'none' ? (it.doneDates || []).includes(day) : !!it.done);

/* Lista de { item, date, done } entre duas datas, em ordem */
export function occurrences(from, to) {
  const out = [];
  const evs = personal.events;
  for (let d = from; d <= to; d = addDays(d, 1)) {
    for (const it of evs) if (occursOn(it, d)) out.push({ item: it, date: d, done: doneOn(it, d) });
  }
  return out.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : (a.item.time || '99') < (b.item.time || '99') ? -1 : 1));
}
export function overdue() {
  const t = todayKey();
  return personal.events.filter((it) => (it.repeat || 'none') === 'none' && !it.done && it.date < t && it.date >= addDays(t, -60))
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
/* Todos os aniversários, do mais próximo ao mais distante */
export function birthdays() {
  const t = todayKey();
  return personal.events.filter((it) => it.cat === 'aniversario').map((it) => {
    let next = `${t.slice(0, 4)}-${it.date.slice(5)}`;
    if (next < t) next = `${+t.slice(0, 4) + 1}-${it.date.slice(5)}`;
    const age = it.birthYear ? +next.slice(0, 4) - it.birthYear : null;
    return { item: it, next, age };
  }).sort((a, b) => (a.next < b.next ? -1 : 1));
}

/* ---------- escrever do jeito que fala: "cortar cabelo amanhã 15h" ---------- */
const WD = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
export function guessCat(text) {
  const t = ' ' + text.toLowerCase() + ' ';
  // do mais específico para o mais geral ("ir no mercado" é compras, não compromisso)
  for (const k of ['aniversario', 'beleza', 'saude', 'pagar', 'compras', 'buscar', 'compromisso']) if (CATS[k].words.some((w) => t.includes(w))) return k;
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
  take(/\s(?:ontem)\s/, () => (date = addDays(t, -1)));
  take(/\s(?:dia\s)?(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?\s/, (m) => {
    const y = m[3] ? (m[3].length === 2 ? '20' + m[3] : m[3]) : t.slice(0, 4);
    let k = `${y}-${pad(+m[2])}-${pad(+m[1])}`;
    if (!m[3] && k < t) k = `${+y + 1}-${pad(+m[2])}-${pad(+m[1])}`;
    date = k;
  });
  take(/\s(?:no |na |nesta |nessa |próxima |proxima )?(domingo|segunda|terça|terca|quarta|quinta|sexta|sábado|sabado)(?:-feira)?\s/, (m) => {
    const want = WD.indexOf(m[1].replace('terca', 'terça').replace('sabado', 'sábado'));
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

/* ---------- frase do dia ---------- */
const PHRASES = [
  'Um passo de cada vez ainda é andar para frente.',
  'Você é melhor do que imagina.',
  'Deus está contigo em cada detalhe do seu dia.',
  'Anotar é cuidar de você no futuro.',
  'Pequenas vitórias também contam. Comemore.',
  'Confia no seu processo.',
  'Hoje é um bom dia para começar.',
  'Feito é melhor que perfeito.',
  'Respira. Você dá conta.',
  'Quem planeja o dia, ganha o dia.',
  'Seja gentil com você hoje.',
  'Você tem potencial. Use um pouco dele hoje.',
  'Organização é liberdade.',
  'Não precisa lembrar de tudo: o app lembra por você.',
];
export const phraseOfDay = (k = todayKey()) => PHRASES[(+k.replace(/-/g, '') * 7) % PHRASES.length];

/* ---------- mensagens de amigo (humanizadas) ---------- */
// {t} = o que foi anotado, {h} = horário. Cada aviso sorteia uma frase (sempre a mesma para o mesmo aviso).
const V = {
  beleza: {
    m60: ['Daqui 1h tem {t}, hein! Já vai se organizando 💈', 'Lembrete carinhoso: {t} às {h}. Hoje é dia de se cuidar ✨'],
    m30: ['Não esquece de {tl}, tá? Vai melhorar sua autoestima demais 💈', 'Meia hora pra {tl}! Se cuidar também é prioridade 😉'],
    m20: ['Vai lá, hein! Se cuidar é um presente pra {vcmesmo}. Não esquece: você é {lindo} 💜', 'Bora? Daqui a pouco é {tl}. Vai sair de lá se sentindo outra pessoa ✨'],
    m0: ['É agora! {t} — aproveita esse momento seu 💈', 'Chegou a hora de {tl}. Você merece esse cuidado 💜'],
    after: ['E aí, ficou top? 😍 Marca como feito pra eu saber!', 'Já foi? Aposto que ficou lindo. Marca como feito 💜'],
  },
  compras: {
    m60: ['Daqui 1h é hora de {tl}. Já pensa no que precisa 🛒', 'Lembrete: {t} às {h}. Faz a lista no app pra não esquecer nada 📝'],
    m30: ['Vai no mercado, cara! Não enrola não, você precisa fazer compras 🛒', 'Meia hora pra {tl}. Já confere a lista de Mercado aqui no app 😉'],
    m20: ['Para de procrastinar, hein! Não deixa de ir fazer compra não, você precisa 😅', 'Bora, bora! {t} daqui a pouco. Você consegue 💪'],
    m0: ['É agora! {t}. Vai lá que depois você relaxa 🛒', 'Hora de {tl}! Missão rápida, você dá conta 😉'],
    after: ['Conseguiu ir? Marca como feito que eu paro de te perturbar 😂', 'E aí, fez as compras? Orgulho! Marca como feito ✅'],
  },
  saude: {
    m60: ['Daqui 1h: {t}. Cuidar da saúde é cuidar de você 🩺', 'Não esquece: {t} às {h}. Seu corpo agradece 💚'],
    m30: ['Meia hora pra {tl}. Vai lá, você está fazendo a coisa certa 💚', 'Já se arruma pra {tl}! Saúde em primeiro lugar 🩺'],
    m20: ['Bora, sem desculpa hoje! {t} é por você 💪', 'Vai lá! Quem se cuida vive melhor. Você consegue 💚'],
    m0: ['É agora: {t}. Tô torcendo por você 💚', 'Hora de {tl}! Orgulho de você por se cuidar 🙌'],
    after: ['Como foi? Espero que tudo certo 💚 Marca como feito!', 'Mandou bem demais em se cuidar hoje. Marca como feito ✅'],
  },
  buscar: {
    m60: ['Daqui 1h você precisa {tl}. Já se programa 🚗', 'Lembrete: {t} às {h}. Não vai deixar ninguém esperando, né? 😉'],
    m30: ['Meia hora pra {tl}! Confere se tá tudo certo pra sair 🚗', 'Já vai se organizando: {t} daqui a 30 min 😉'],
    m20: ['Hora de ir saindo! {t} — quem chega cedo é gente boa 😄', 'Bora? Daqui a pouco é {tl}. Pega a chave 🔑'],
    m0: ['É agora! {t} 🚗 Vai com calma e atenção no caminho.', 'Hora de {tl}! Dirige com cuidado, tá? 💜'],
    after: ['Deu tudo certo? Marca como feito 🚗', 'Missão cumprida? Marca como feito ✅'],
  },
  pagar: {
    m60: ['Daqui 1h: {t}. Bora deixar isso resolvido? 💸', 'Não esquece: {t} às {h}. Conta paga = cabeça leve 😌'],
    m30: ['Meia hora pra {tl}. Resolve logo e esquece o assunto 💸', 'Já separa o que precisa pra {tl} 😉'],
    m20: ['Paga logo, vai! Depois é só alívio 😌', 'Não deixa pra depois não, hein! {t} 💸'],
    m0: ['É agora: {t}. Dois minutinhos e pronto 💸', 'Hora de {tl}! Organização nível máximo, olha só 😎'],
    after: ['Pagou? Marca como feito e dorme {tranquilo} 😌', 'Resolvido? Marca como feito ✅'],
  },
  compromisso: {
    m60: ['Daqui 1h: {t}. Já vai se arrumando 📍', 'Lembrete: {t} às {h}. Vai ser bom, confia 😉'],
    m30: ['Meia hora pra {tl}! Confere o caminho e vai tranquilo 📍', 'Já se prepara: {t} daqui a pouco ✨'],
    m20: ['Bora sair! Melhor chegar com folga 😉', 'Vai lá! {t} — você vai arrasar 💜'],
    m0: ['É agora! {t} 📍 Aproveita!', 'Hora de {tl}! Vai com tudo ✨'],
    after: ['Como foi? Marca como feito 📍', 'Foi bom? Marca como feito ✅'],
  },
  lembrete: {
    m60: ['Daqui 1h: {t}. Só pra você não esquecer 😉', 'Ei, lembra: {t} às {h} 📝'],
    m30: ['Meia hora pra {tl}. Tô aqui te lembrando 💜', 'Não esquece de {tl}, tá? 😉'],
    m20: ['Bora resolver? {t} daqui a pouco. Você consegue 💪', 'Não deixa pra depois não, hein! {t} 😄'],
    m0: ['É agora: {t}! Faz e marca como feito 😉', 'Hora de {tl}! Vai lá ✨'],
    after: ['Fez? Marca como feito pra eu parar de te lembrar 😂', 'E aí, resolvido? Marca como feito ✅'],
  },
};
const hash = (str) => { let h = 0; for (const c of str) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; };
function voice(it, stage, date) {
  const t = (it.title || '').trim();
  const pool = (V[it.cat] || V.lembrete)[stage] || V.lembrete[stage];
  const s = pool[hash(it.id + date + stage) % pool.length];
  const tl = t.charAt(0).toLowerCase() + t.slice(1);
  // palavras no gênero que a pessoa escolheu na ficha (feminino, masculino ou neutro)
  const pr = store.profile?.pronoun || personal.prefs.pronoun;
  const G = { lindo: ['lindo', 'linda', 'incrível'], vcmesmo: ['você mesmo', 'você mesma', 'você'], tranquilo: ['tranquilo', 'tranquila', 'em paz'] };
  const gw = (k) => G[k][pr === 'm' ? 0 : pr === 'f' ? 1 : 2];
  return s.replace(/\{tl\}/g, tl).replace(/\{t\}/g, t).replace(/\{h\}/g, it.time ? hm(it.time) : '').replace(/\{(lindo|vcmesmo|tranquilo)\}/g, (_, k) => gw(k));
}
const TITLES = { m60: 'Daqui a 1 hora', m30: 'Daqui a 30 min', m20: 'Daqui a 20 min', m0: 'É agora!', after: 'E aí? 👀' };

/* ---------- avisos no celular (só para o dono) ---------- */
const at = (date, time) => Date.parse(`${date}T${time}:00-03:00`);
const hm = (t) => t.replace(/^0/, '').replace(':00', 'h').replace(':', 'h');
const short = (o) => `${(CATS[o.item.cat] || CATS.lembrete).emoji} ${o.item.time ? hm(o.item.time) + ' ' : ''}${o.item.title}`;
export function buildPersonalSchedule(now = Date.now()) {
  const t = todayKey();
  const prefs = personal.prefs;
  const out = [];
  const add = (when, title, body, id, tag, url) => { if (when > now - 60e3) out.push({ id, at: when, title, body, tag, url }); };
  const occ = occurrences(addDays(t, -1), addDays(t, 35));
  if (prefs.reminders) {
    for (const { item: it, date, done } of occ) {
      if (done || it.remind === 'none') continue;
      const c = CATS[it.cat] || CATS.lembrete;
      const name = `${c.emoji} ${it.title}`;
      const url = `./#/p/${it.id}`, tag = `p-${it.id}`;
      const k = (s) => `p-${it.id}-${date}-${s}`;
      if (it.cat === 'aniversario') {
        add(at(addDays(date, -1), '20:00'), 'Amanhã tem aniversário 🎂', `${it.title} — já pensou no presente?`, k('d1'), tag, url);
        add(at(date, '08:00'), 'Hoje é aniversário 🎂', `${it.title} — não esquece de dar os parabéns!`, k('d0'), tag, url);
      } else if (it.time) {
        const base = at(date, it.time);
        // hábito diário: só na hora; repetição semanal/mensal: 1h antes e na hora; compromisso único: a escada completa
        // compromisso único: 30 min antes, na hora e "já fez?" depois (quem esquece muito também recebe 1h antes)
        const many = (Number(store.profile?.index) || 0) >= 70;
        const stages = it.repeat === 'daily' ? [['m0', 0]] : it.repeat && it.repeat !== 'none' ? [['m60', 60], ['m0', 0]] : [...(many ? [['m60', 60]] : []), ['m30', 30], ['m0', 0], ['after', -45]];
        for (const [stage, min] of stages) {
          add(base - min * 60e3, `${c.emoji} ${TITLES[stage]}`, voice(it, stage, date), k(stage), tag, url);
        }
      } else if (!prefs.morning) {
        add(at(date, '08:00'), `${c.emoji} Não esquece hoje`, voice(it, 'm30', date), k('d0'), tag, url);
      }
    }
  }
  // resumo da manhã (o dia de hoje) e da noite (o dia de amanhã)
  for (let i = 0; i <= 14; i++) {
    const d = addDays(t, i);
    const list = occ.filter((o) => o.date === d && !o.done);
    if (!list.length) continue;
    const body = list.slice(0, 4).map(short).join(' · ') + (list.length > 4 ? ` · +${list.length - 4}` : '');
    if (prefs.morning) add(at(d, '08:00'), `Seu dia hoje: ${list.length} ${list.length > 1 ? 'coisas' : 'coisa'} 📋`, body, `pm-${d}-${list.length}`, 'p-manha', './#/p/hoje');
    if (prefs.night) add(at(addDays(d, -1), '21:00'), `Amanhã: ${list.length} ${list.length > 1 ? 'coisas' : 'coisa'} na agenda 🌙`, body, `pn-${d}-${list.length}`, 'p-noite', './#/p/hoje');
  }
  // sequência de dias em jogo: um toque no começo da noite (só se ainda não concluiu nada hoje)
  const st = streak();
  if (prefs.nudges !== false && st.days >= 2 && !st.today) {
    const sleep = /^\d{2}:\d{2}$/.test(prefs.sleep || '') ? prefs.sleep : '22:30';
    const [sh, sm] = sleep.split(':').map(Number);
    const when = Math.min(20 * 60, sh * 60 + sm - 90);
    if (when > 12 * 60) add(at(t, `${String(Math.floor(when / 60)).padStart(2, '0')}:${String(when % 60).padStart(2, '0')}`), `🔥 ${st.days} dias seguidos`, 'Sua sequência está em jogo. Conclua uma coisa hoje e ela continua crescendo 💪', `streak-${t}`, 'streak', './');
  }
  return out.sort((a, b) => a.at - b.at).slice(0, 300);
}
/* Resumo da agenda pessoal para as mensagens de ânimo do servidor */
const GOAL_TEXT = { lembrar: 'nunca mais esquecer compromissos', produtivo: 'render mais no dia', tempo: 'ter mais tempo livre', saude: 'cuidar melhor de si', carreira: 'crescer na carreira', organizar: 'organizar o trabalho e a equipe' };
export function personalProfile() {
  const t = todayKey();
  const ev = (o) => ({ title: o.item.title, cat: o.item.cat, time: o.item.time || null, done: o.done });
  const lastByCat = {}, nextByCat = {};
  for (const it of personal.events) {
    if ((it.repeat || 'none') !== 'none' || !it.date) continue;
    if (it.date <= t && (it.done || it.date < t)) { if (!lastByCat[it.cat] || it.date > lastByCat[it.cat]) lastByCat[it.cat] = it.date; }
    if (it.date >= t && !it.done) { if (!nextByCat[it.cat] || it.date < nextByCat[it.cat]) nextByCat[it.cat] = it.date; }
  }
  const p = personal.prefs;
  return {
    date: t,
    prefs: { nudges: p.nudges, water: p.water, meals: p.meals, faith: p.faith, freq: p.freq, wake: p.wake, sleep: p.sleep, lunch: p.lunch, tone: p.tone, pronoun: p.pronoun || store.profile?.pronoun,
      nickname: p.nickname, age: p.age, religion: p.religion, motivation: p.motivation, perDay: p.perDay, waterEvery: p.waterEvery, mind: p.mind },
    work: store.profile?.profession ? { profession: store.profile.profession, goal: GOAL_TEXT[store.profile.goal] || '' } : null,
    today: occurrences(t, t).map(ev),
    tomorrow: occurrences(addDays(t, 1), addDays(t, 1)).map(ev),
    overdue: overdue().slice(0, 10).map((it) => ({ title: it.title, cat: it.cat, time: it.time || null, done: false })),
    lastByCat, nextByCat,
    birthdays: birthdays().slice(0, 10).map((b) => ({ name: b.item.title.replace(/^anivers[aá]rio (d[aoe] )?/i, ''), inDays: Math.round((Date.parse(b.next) - Date.parse(t)) / 864e5) })),
    lists: personal.lists.map((l) => ({ name: l.name, open: (l.entries || []).filter((e) => !e.done).length })),
  };
}

let timer = null, lastSig = '';
export function syncPersonalSchedule() {
  if (store.mode !== 'cloud' || !server() || !personal.ready) return;
  clearTimeout(timer);
  timer = setTimeout(() => {
    const list = buildPersonalSchedule();
    const profile = personalProfile();
    const sig = JSON.stringify([list, profile]);
    if (sig === lastSig) return;
    api('/personal', { items: list, profile }).then(() => (lastSig = sig)).catch(() => {});
  }, 2500);
}
// concluiu algo (trabalho ou pessoal): refaz a lista (tira o aviso da sequência do dia)
if (typeof window !== 'undefined') window.addEventListener('lembra:done', () => { lastSig = ''; syncPersonalSchedule(); });
// renova a lista e o resumo do dia de tempos em tempos (e quando a pessoa volta ao app)
setInterval(() => { lastSig = ''; syncPersonalSchedule(); }, 3 * 3600e3);
if (typeof document !== 'undefined') document.addEventListener('visibilitychange', () => { if (!document.hidden) syncPersonalSchedule(); });
