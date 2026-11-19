/* Empresas pré-cadastradas (com logo). Entram uma única vez na agenda da dupla:
   se depois forem editadas ou apagadas, não voltam. */
import { store } from './store.js';

const SEED_ID = 'seed-v1';
export const SEED_COMPANIES = [
  { id: 'c_puravida', name: 'Pura Vida', color: '#15803D', logoFile: 'pura-vida.jpg' },
  { id: 'c_jggarcia', name: 'JG Garcia', color: '#16A34A', logoFile: 'jg-garcia.jpg' },
  { id: 'c_garciahortifruti', name: 'Garcia Hortifruti', color: '#65A30D', logoFile: 'garcia-hortifruti.jpg' },
  { id: 'c_tobiasbbq', name: "Tobia's BBQ", color: '#DC2626', logoFile: 'tobias-bbq.jpg' },
  { id: 'c_verdeerosa', name: 'Verde e Rosa Multimarcas', color: '#DB2777', logoFile: 'verde-e-rosa.jpg' },
  { id: 'c_sophiafestas', name: 'Sophia Festas', color: '#0284C7', logoFile: 'sophia-festas.jpg' },
];

const toDataUrl = async (url) => {
  const blob = await (await fetch(url, { cache: 'no-cache' })).blob();
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(blob);
  });
};

/* Fotos como logo das empresas pessoais: a do Matheus (nome dele) e a do @euvarejao (Henrique) — uma vez cada */
const PHOTO_LOGOS = [
  { id: 'seed-logo-matheus-v1', file: 'matheus.jpg', match: (c) => /matheus/i.test(c.name) },
  { id: 'seed-logo-henrique-v1', file: 'henrique.jpg', match: (c) => /euvarej[aã]o/i.test(c.instagram || '') || /euvarej[aã]o/i.test(c.name) },
];
export async function ensureMatheusLogo() {
  if (!store.ready || store.mode !== 'cloud') return;
  for (const p of PHOTO_LOGOS) {
    if (store.state.settings.some((s) => s.id === p.id)) continue;
    const cos = store.state.companies.filter(p.match);
    if (!cos.length) continue;
    try {
      const logo = await toDataUrl(`media/logos/${p.file}`);
      cos.forEach((c) => store.writeRaw('companies', { ...c, logo, updatedAt: Date.now() }));
      store.writeRaw('settings', { id: p.id, done: cos.map((c) => c.id) });
    } catch { /* tenta de novo na próxima abertura */ }
  }
}

/* Quem recebe as notificações de cada empresa (pedido do Henrique, 19/11):
   Garcia Hortifruti → só o Henrique · JG Garcia → só o Matheus. Uma vez só; depois dá para mudar na empresa. */
const OWNER_ID = 'seed-notify-owner-v1';
export function ensureNotifyOwners() {
  if (!store.ready || store.mode !== 'cloud' || store.state.settings.some((s) => s.id === OWNER_ID)) return;
  const rules = [[/garcia\s*hortifruti/i, 'henrique'], [/^\s*jg\s*garcia/i, 'matheus']];
  const done = [];
  for (const c of store.state.companies) {
    const r = rules.find(([re]) => re.test(c.name));
    if (r && c.notifyOnly !== r[1]) { store.writeRaw('companies', { ...c, notifyOnly: r[1], updatedAt: Date.now() }); done.push(c.id); }
  }
  if (store.state.companies.length) store.writeRaw('settings', { id: OWNER_ID, done });
}

let running = false;
export async function ensureSeedCompanies() {
  if (running || !store.ready || store.state.settings.some((s) => s.id === SEED_ID)) return;
  running = true;
  try {
    const missing = SEED_COMPANIES.filter((c) => !store.company(c.id) && !store.state.companies.some((x) => x.name.trim().toLowerCase() === c.name.toLowerCase()));
    const items = [];
    for (const c of missing) {
      let logo = null;
      try {
        logo = await toDataUrl(`media/logos/${c.logoFile}`);
      } catch { /* sem logo: usa as iniciais */ }
      items.push({ id: c.id, name: c.name, color: c.color, logo, instagram: '', address: '', contact: '', notes: '', shareToken: null });
    }
    if (items.length) await store.upsertMany('companies', items);
    await store.upsert('settings', { id: SEED_ID, done: SEED_COMPANIES.map((c) => c.id) });
  } finally {
    running = false;
  }
}
