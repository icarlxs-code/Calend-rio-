/* Link do cliente: cada empresa vê SOMENTE o próprio cronograma */
import { todayKey, addDays } from './utils.js';

const PAST_DAYS = 30;
const FUTURE_DAYS = 180;

/* Monta o pacote público de uma empresa. Nunca inclui notas internas,
   outras empresas, nem eventos marcados como "não visível ao cliente". */
export function buildClientPayload(company, allEvents, { maxFuture = FUTURE_DAYS } = {}) {
  const from = addDays(todayKey(), -PAST_DAYS);
  const to = addDays(todayKey(), maxFuture);
  const events = allEvents
    .filter((e) => e.companyId === company.id && e.visibleToClient !== false && e.date >= from && e.date <= to)
    .sort((a, b) => (a.date + (a.time || '')).localeCompare(b.date + (b.time || '')))
    .map((e) => ({
      date: e.date,
      time: e.time || '',
      type: e.type,
      title: e.title || '',
      description: e.description || '',
      status: e.status || 'pendente',
      duration: e.duration || 0,
      location: e.type === 'captacao' || e.type === 'reuniao' ? e.location || '' : '',
    }));
  return {
    v: 1,
    company: {
      name: company.name,
      color: company.color,
      logo: company.logo || null,
      instagram: company.instagram || '',
    },
    events,
    updatedAt: Date.now(),
  };
}

/* ---------- modo local: dados vão compactados dentro do próprio link ---------- */
const b64url = (bytes) => {
  let s = '';
  bytes.forEach((b) => (s += String.fromCharCode(b)));
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};
const fromB64url = (str) => {
  const s = atob(str.replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(s, (c) => c.charCodeAt(0));
};
async function streamBytes(bytes, stream) {
  const res = new Response(new Blob([bytes]).stream().pipeThrough(stream));
  return new Uint8Array(await res.arrayBuffer());
}

const KEYS = ['date', 'time', 'type', 'title', 'description', 'status', 'duration', 'location'];

export async function encodeSnapshot(payload) {
  const compact = {
    v: 1,
    c: [payload.company.name, payload.company.color, payload.company.instagram, payload.company.logo && payload.company.logo.length < 9000 ? payload.company.logo : null],
    e: payload.events.map((e) => KEYS.map((k) => e[k])),
    u: payload.updatedAt,
  };
  const raw = new TextEncoder().encode(JSON.stringify(compact));
  if ('CompressionStream' in window) {
    try {
      return 'z' + b64url(await streamBytes(raw, new CompressionStream('deflate-raw')));
    } catch { /* cai no modo sem compressão */ }
  }
  return 'j' + b64url(raw);
}

export async function decodeSnapshot(str) {
  const kind = str[0];
  let bytes = fromB64url(str.slice(1));
  if (kind === 'z') bytes = await streamBytes(bytes, new DecompressionStream('deflate-raw'));
  const o = JSON.parse(new TextDecoder().decode(bytes));
  return {
    v: o.v,
    company: { name: o.c[0], color: o.c[1], instagram: o.c[2], logo: o.c[3] },
    events: o.e.map((row) => Object.fromEntries(KEYS.map((k, i) => [k, row[i]]))),
    updatedAt: o.u,
  };
}

export const appBaseUrl = () => location.href.split('#')[0].split('?')[0];
export const liveLink = (token) => `${appBaseUrl()}#/c/${token}`;
export const snapshotLink = (encoded) => `${appBaseUrl()}#/v/${encoded}`;
