/* Camada de dados: local (neste aparelho) ou nuvem (Firebase) */
import { CONFIG } from '../config.js';
import { todayKey, addDays, uid, randomToken, debounce, toMin, nowMin } from './utils.js';
import { buildClientPayload } from './share.js';
import { sanitizeItem } from './sanitize.js';

const LS_DATA = 'pauta.data.v1';
const LS_ME = 'pauta.me';
const COLS = ['companies', 'events', 'notes', 'settings'];

const listeners = new Set();
let backend = null;

const readLocal = () => {
  try {
    return JSON.parse(localStorage.getItem(LS_DATA) || 'null');
  } catch {
    return null;
  }
};

export const store = {
  state: { companies: [], events: [], notes: [], settings: [] },
  hooks: { eventChange: null, activity: null },
  mode: 'local',
  me: null,
  demo: false,
  user: null,

  on(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  emit() {
    listeners.forEach((fn) => fn());
  },

  /* ---------- leitura ---------- */
  team: CONFIG.team,
  member: (id) => CONFIG.team.find((m) => m.id === id),
  company(id) {
    return this.state.companies.find((c) => c.id === id);
  },
  event(id) {
    return this.state.events.find((e) => e.id === id);
  },
  companiesSorted() {
    return [...this.state.companies].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  },
  eventsOn(date, { person = 'all', companyId = null } = {}) {
    return this.state.events
      .filter((e) => e.date === date)
      .filter((e) => person === 'all' || (e.assignees || []).includes(person))
      .filter((e) => !companyId || e.companyId === companyId)
      .sort((a, b) => (toMin(a.time) ?? -1) - (toMin(b.time) ?? -1));
  },
  eventsBetween(from, to, filter = {}) {
    return this.state.events
      .filter((e) => e.date >= from && e.date <= to)
      .filter((e) => !filter.person || filter.person === 'all' || (e.assignees || []).includes(filter.person))
      .filter((e) => !filter.companyId || e.companyId === filter.companyId)
      .sort((a, b) => (a.date + (a.time || '')).localeCompare(b.date + (b.time || '')));
  },
  notesOn(date) {
    return this.state.notes.filter((n) => n.date === date).sort((a, b) => a.createdAt - b.createdAt);
  },

  /* ---------- escrita ---------- */
  /* Quem cadastrou é o dono: só ele altera ou apaga. O outro só vê. */
  ownerOf(col, item) {
    if (!item) return null;
    if (col === 'notes') return item.author || item.createdBy || null;
    if (col === 'events') return item.createdBy || (item.assignees || [])[0] || null;
    if (col === 'companies') return item.createdBy || null;
    return null;
  },
  canEdit(col, item) {
    if (this.mode !== 'cloud' || !['events', 'notes', 'companies'].includes(col)) return true;
    const owner = this.ownerOf(col, item);
    return !owner || owner === this.me;
  },
  _denied(col, item) {
    const owner = this.member(this.ownerOf(col, item))?.name || 'o parceiro';
    if (this.onDenied) this.onDenied(`Só ${owner} pode alterar isso (foi ${owner === 'o parceiro' ? 'ele' : owner} quem cadastrou).`);
  },

  async upsert(col, item) {
    const existing = this.state[col]?.find((x) => x.id === item.id);
    if (existing && !this.canEdit(col, existing)) {
      this._denied(col, existing);
      return existing;
    }
    const before = col === 'events' ? this.state.events.find((x) => x.id === item.id) : null;
    const prev = before ? { ...before } : null;
    item.updatedAt = Date.now();
    if (this.me) item.updatedBy = this.me;
    if (!item.createdAt) item.createdAt = item.updatedAt;
    if (!item.createdBy && this.me) item.createdBy = this.me;
    applyLocal(col, item);
    persist(() => backend.write(col, item));
    touch(col, item);
    this.emit();
    if (col === 'events' && this.hooks.eventChange) this.hooks.eventChange(prev, { ...item });
    return item;
  },
  async upsertMany(col, items, { activity = null } = {}) {
    items = items.filter((it) => {
      const existing = this.state[col]?.find((x) => x.id === it.id);
      return !existing || this.canEdit(col, existing);
    });
    if (!items.length) return;
    const now = Date.now();
    items.forEach((it) => {
      it.updatedAt = now;
      it.bulkAt = now; // gravação em lote: o servidor não manda uma notificação por item
      if (this.me) it.updatedBy = this.me;
      if (!it.createdAt) it.createdAt = now;
      if (!it.createdBy && this.me) it.createdBy = this.me;
      applyLocal(col, it);
    });
    persist(() => backend.writeMany(items.map((it) => ({ col, item: it }))));
    items.forEach((it) => touch(col, it));
    if (activity) logActivity(activity);
    this.emit();
  },
  async remove(col, id) {
    const target = this.state[col]?.find((x) => x.id === id);
    if (target && !this.canEdit(col, target)) {
      this._denied(col, target);
      return;
    }
    const old = this.state[col].find((x) => x.id === id);
    if (col === 'events' && old) logActivity({ kind: 'deleted', events: [compactEvent(old)] });
    this.state[col] = this.state[col].filter((x) => x.id !== id);
    persist(() => backend.del(col, id));
    if (col === 'companies' && old?.shareToken && backend.unpublish) persist(() => backend.unpublish(old.shareToken));
    if (old) touch(col, old);
    this.emit();
  },
  async removeMany(col, ids, opts = {}) {
    const blocked = this.state[col].filter((x) => ids.includes(x.id) && !this.canEdit(col, x));
    if (blocked.length) {
      if (!opts.silent) this._denied(col, blocked[0]);
      ids = ids.filter((id) => !blocked.some((b) => b.id === id));
      if (!ids.length) return;
    }
    const olds = this.state[col].filter((x) => ids.includes(x.id));
    if (col === 'events' && olds.length && !opts.silent) logActivity({ kind: 'deleted', events: olds.slice(0, 20).map(compactEvent) });
    this.state[col] = this.state[col].filter((x) => !ids.includes(x.id));
    if (ids.length) persist(() => backend.delMany(col, ids));
    olds.forEach((o) => touch(col, o));
    this.emit();
  },

  /* Assistente (Claude) — só com a nuvem ligada */
  async idToken() {
    return this.mode === 'cloud' && backend.idToken ? backend.idToken() : null;
  },
  async askAssistant(question, history = []) {
    if (this.hooks.ask) return this.hooks.ask(question, history);
    if (this.mode !== 'cloud' || !backend.ask) {
      const e = new Error('O assistente precisa da sincronização na nuvem.');
      e.code = 'local';
      throw e;
    }
    return backend.ask(question, history);
  },

  /* Acesso direto à nuvem (aparelhos para notificação, testes, chave pública) */
  writeRaw(col, item) {
    if (this.mode !== 'cloud') return false;
    persist(() => backend.write(col, item));
    return true;
  },
  async readDoc(path) {
    if (this.mode !== 'cloud' || !backend.getDoc) return null;
    try {
      return await backend.getDoc(path);
    } catch {
      return null;
    }
  },

  setMe(id) {
    this.me = id;
    localStorage.setItem(LS_ME, id);
    this.emit();
  },

  /* ---------- empresa / link do cliente ---------- */
  async ensureShareToken(company) {
    if (!company.shareToken) {
      company.shareToken = randomToken();
      await this.upsert('companies', company);
    }
    return company.shareToken;
  },
  async regenerateShareToken(company) {
    const old = company.shareToken;
    company.shareToken = randomToken();
    await this.upsert('companies', company);
    if (old && backend.unpublish) persist(() => backend.unpublish(old));
    await this.publishCompany(company.id);
  },
  async publishCompany(companyId) {
    if (this.mode !== 'cloud') return;
    const c = this.company(companyId);
    if (!c || !c.shareToken) return;
    persist(() => backend.publish(c.shareToken, buildClientPayload(c, this.state.events)));
  },

  /* ---------- backup ---------- */
  exportData() {
    return JSON.stringify({ app: 'pauta', version: 1, exportedAt: new Date().toISOString(), ...this.state }, null, 2);
  },
  async importData(json, { replace = false } = {}) {
    const data = typeof json === 'string' ? JSON.parse(json) : json;
    if (!data || !Array.isArray(data.events) || !Array.isArray(data.companies)) throw new Error('Arquivo inválido');
    if (replace) await this.clearAll();
    for (const col of COLS) {
      const items = (data[col] || []).filter((x) => x && typeof x.id === 'string').map((x) => sanitizeItem(col, x)).filter(Boolean);
      const stamp = Date.now();
      items.forEach((it) => (it.updatedAt = it.bulkAt = stamp));
      if (items.length) {
        items.forEach((it) => applyLocal(col, it));
        persist(() => backend.writeMany(items.map((item) => ({ col, item }))));
      }
    }
    this.demo = false;
    saveLocalFlags();
    logActivity({ kind: 'import', count: (data.events || []).length });
    this.state.companies.forEach((c) => c.shareToken && pendingPublish.add(c.id));
    flushPublish();
    this.emit();
  },
  async clearAll() {
    for (const col of COLS) {
      const ids = this.state[col].map((x) => x.id);
      this.state[col] = [];
      if (ids.length) persist(() => backend.delMany(col, ids));
    }
    this.demo = false;
    saveLocalFlags();
    this.emit();
  },
  async clearDemo() {
    await this.clearAll();
  },
};

/* Grava sem travar a tela: na nuvem, a gravação só "termina" quando o servidor
   confirma; sem internet isso pode demorar. O Firestore guarda localmente e envia depois. */
function persist(fn) {
  try {
    const p = fn();
    if (p && p.catch) p.catch((err) => {
      console.error('Falha ao salvar', err);
      store.onError && store.onError(err);
    });
  } catch (err) {
    console.error('Falha ao salvar', err);
    store.onError && store.onError(err);
  }
}

/* Registro de atividade: o servidor usa para avisar o parceiro (ex.: "Matheus removeu…") */
const compactEvent = (e) => ({ id: e.id, type: e.type, companyId: e.companyId || '', date: e.date, time: e.time || '', title: e.title || '', assignees: e.assignees || [] });
function logActivity(a) {
  if (store.mode !== 'cloud' || !backend.write) return;
  const item = { id: uid('a_'), by: store.me || '', at: Date.now(), ...a };
  // com o servidor gratuito ligado, o próprio app avisa o parceiro na hora
  if (store.hooks.activity) store.hooks.activity(item);
  else persist(() => backend.write('activity', item));
}

/* aplica no estado em memória */
function applyLocal(col, item) {
  const arr = store.state[col];
  const i = arr.findIndex((x) => x.id === item.id);
  if (i >= 0) arr[i] = { ...item };
  else arr.push({ ...item });
}

/* ---------- publicação automática do link do cliente (nuvem) ---------- */
const pendingPublish = new Set();
const flushPublish = debounce(async () => {
  const ids = [...pendingPublish];
  pendingPublish.clear();
  for (const id of ids) {
    try {
      await store.publishCompany(id);
    } catch (e) {
      console.warn('Falha ao publicar link do cliente', e);
    }
  }
}, 1200);

function touch(col, item) {
  if (store.mode !== 'cloud') return;
  const cid = col === 'events' ? item.companyId : col === 'companies' ? item.id : null;
  const c = cid && store.company(cid);
  if (c && c.shareToken) {
    pendingPublish.add(cid);
    flushPublish();
  }
}

/* ---------- backend local ---------- */
function saveLocal() {
  try {
    localStorage.setItem(LS_DATA, JSON.stringify({ ...store.state, demo: store.demo }));
  } catch (err) {
    // Ex.: memória do navegador cheia (muitas logos grandes)
    store.onError && store.onError(err);
    throw err;
  }
}
function saveLocalFlags() {
  if (store.mode === 'local') saveLocal();
}
const localBackend = {
  async write() { saveLocal(); },
  async writeMany() { saveLocal(); },
  async del() { saveLocal(); },
  async delMany() { saveLocal(); },
};

export async function initLocal() {
  store.mode = 'local';
  backend = localBackend;
  store.me = localStorage.getItem(LS_ME);
  const saved = readLocal();
  if (saved && !saved.demo) {
    COLS.forEach((c) => (store.state[c] = (Array.isArray(saved[c]) ? saved[c] : []).map((x) => sanitizeItem(c, x)).filter(Boolean)));
    store.demo = false;
  } else {
    // Começa zerado. Se o celular ainda tinha os exemplos antigos, eles são removidos.
    COLS.forEach((c) => (store.state[c] = []));
    store.demo = false;
    saveLocal();
  }
  store.ready = true;
}

/* ---------- backend nuvem ---------- */
export async function initCloud(cloud, user) {
  store.mode = 'cloud';
  store.user = user;
  const m = CONFIG.team.find((t) => t.email && t.email.toLowerCase() === (user.email || '').toLowerCase());
  store.me = m ? m.id : null;
  backend = cloud;
  store.ready = false;
  await cloud.subscribe(COLS, (col, items) => {
    store.state[col] = items.map((x) => sanitizeItem(col, x)).filter(Boolean);
    store.emit();
  }, (err) => store.onError && store.onError(err));
  store.ready = true;
}

/* ---------- dados de exemplo ---------- */
function seedDemo() {
  const t = todayKey();
  const d = (n) => addDays(t, n);
  const now = Date.now();
  const companies = [
    { id: 'c_puravida', name: 'Pura Vida', color: '#16A34A', instagram: 'puravida', address: 'Rua das Palmeiras, 120 – Centro', contact: '', notes: 'Não postar preços no feed.' },
    { id: 'c_aroma', name: 'Café Aroma', color: '#CA8A04', instagram: 'cafearoma', address: 'Av. Brasil, 845', contact: '', notes: '' },
    { id: 'c_studiofit', name: 'Studio Fit', color: '#7C3AED', instagram: 'studiofit', address: 'Rua Goiás, 33 – sala 2', contact: '', notes: '' },
    { id: 'c_bella', name: 'Bella Estética', color: '#DB2777', instagram: 'bellaestetica', address: 'Rua XV de Novembro, 410', contact: '', notes: '' },
  ].map((c) => ({ ...c, logo: null, shareToken: null, createdAt: now, updatedAt: now }));

  // Captação de exemplo no dia 22 (ou daqui a 3 dias)
  const day22 = (() => {
    const base = t.slice(0, 8) + '22';
    return base > t ? base : d(3);
  })();

  const H = ['henrique'], M = ['matheus'], HM = ['henrique', 'matheus'];
  const rows = [
    // hoje
    [0, '09:00', 'producao', 'c_studiofit', 'Editar Reels da semana', M, { duration: 90 }],
    [0, '11:30', 'feed', 'c_aroma', 'Lançamento do cappuccino de avelã', H],
    [0, '12:00', 'story', 'c_puravida', 'Prato do dia + enquete', M],
    [0, '13:00', 'feed', 'c_puravida', 'Cardápio de verão', H],
    [0, '14:00', 'feed', 'c_studiofit', 'Antes e depois – aluna destaque', M],
    [0, '15:30', 'captacao', 'c_studiofit', 'Vídeos da aula de funcional', H, { duration: 120, location: 'Rua Goiás, 33 – sala 2' }],
    [0, '16:00', 'story', 'c_bella', 'Bastidores do atendimento', H],
    [0, '17:00', 'captacao', 'c_bella', 'Fotos dos novos tratamentos', M, { duration: 90, location: 'Rua XV de Novembro, 410' }],
    [0, '19:00', 'reels', 'c_puravida', 'Preparando o bowl tropical', M],
    [0, '21:00', 'story', 'c_aroma', 'Caixinha de perguntas', H],
    // amanhã
    [1, '08:30', 'story', 'c_aroma', 'Bom dia com café', H],
    [1, '10:00', 'reuniao', 'c_aroma', 'Planejamento de dezembro', HM, { duration: 60, location: 'Av. Brasil, 845' }],
    [1, '12:30', 'carrossel', 'c_bella', '5 cuidados com a pele no verão', M],
    [1, '15:00', 'story', 'c_puravida', 'Promoção do suco detox', M],
    [1, '18:00', 'reels', 'c_studiofit', 'Treino de 10 minutos', H],
    [1, '19:30', 'feed', 'c_puravida', 'Depoimento de cliente', H],
    // depois
    [2, '09:00', 'producao', 'c_puravida', 'Editar fotos da semana', H, { duration: 120 }],
    [2, '12:00', 'reels', 'c_aroma', 'Como fazemos o cold brew', M],
    [2, '18:30', 'feed', 'c_bella', 'Agenda de dezembro aberta', H],
    [2, '20:00', 'story', 'c_studiofit', 'Desafio da semana', M],
    [3, '11:30', 'feed', 'c_studiofit', 'Horários de fim de ano', M],
    [3, '16:30', 'captacao', 'c_aroma', 'Fotos do cardápio natalino', HM, { duration: 120, location: 'Av. Brasil, 845' }],
    [4, '12:00', 'story', 'c_bella', 'Antes e depois', H],
    [4, '19:00', 'reels', 'c_bella', 'Rotina de skincare', M],
    [5, '10:00', 'reuniao', 'c_studiofit', 'Aprovação da pauta', H, { duration: 45 }],
    [6, '12:30', 'feed', 'c_aroma', 'Combo de fim de semana', M],
    [8, '18:00', 'reels', 'c_puravida', 'Making of da captação', M],
    [9, '11:30', 'carrossel', 'c_puravida', 'Benefícios dos ingredientes', H],
    // passado (feito)
    [-1, '12:00', 'feed', 'c_bella', 'Promoção de novembro', H, { status: 'feito' }],
    [-1, '18:00', 'reels', 'c_aroma', 'Latte art', M, { status: 'feito' }],
    [-2, '09:00', 'captacao', 'c_puravida', 'Fotos dos pratos novos', HM, { duration: 120, status: 'feito', location: 'Rua das Palmeiras, 120 – Centro' }],
  ];
  const events = rows.map(([off, time, type, companyId, title, assignees, extra = {}]) => ({
    id: uid('e_'),
    date: d(off),
    time,
    type,
    companyId,
    title,
    assignees,
    description: '',
    internalNote: '',
    location: '',
    reminder: 30,
    visibleToClient: type !== 'producao',
    status: off < 0 || (off === 0 && toMin(time) + 30 < nowMin()) ? 'feito' : 'pendente',
    createdBy: assignees[0],
    createdAt: now,
    updatedAt: now,
    ...extra,
  }));
  events.push({
    id: uid('e_'), date: day22, time: '15:00', type: 'captacao', companyId: 'c_puravida',
    title: 'Captação de pratos e ambiente', assignees: HM, description: 'Fotos para o feed de dezembro e vídeos para Reels.',
    internalNote: 'Levar refletor e lente 50mm.', location: 'Rua das Palmeiras, 120 – Centro', duration: 120,
    reminder: 1440, visibleToClient: true, status: 'pronto', createdBy: 'henrique', createdAt: now, updatedAt: now,
  });
  const notes = [
    { id: uid('n_'), date: t, text: 'Levar o tripé grande e o refletor para a Studio Fit.', author: 'matheus', createdAt: now - 5000 },
    { id: uid('n_'), date: t, text: 'O cliente da Pura Vida pediu para não colocar preço no feed.', author: 'henrique', createdAt: now },
  ];
  return { companies, events, notes, settings: [] };
}
