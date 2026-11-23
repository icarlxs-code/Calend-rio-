/* Utilitários de data, texto e cor */

export const pad = (n) => String(n).padStart(2, '0');

export const toKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const fromKey = (k) => {
  const [y, m, d] = k.split('-').map(Number);
  return new Date(y, m - 1, d);
};
export const todayKey = () => toKey(new Date());
export const addDays = (k, n) => {
  const d = fromKey(k);
  d.setDate(d.getDate() + n);
  return toKey(d);
};
export const startOfWeek = (k) => {
  const d = fromKey(k);
  d.setDate(d.getDate() - d.getDay());
  return toKey(d);
};
export const monthKey = (k) => k.slice(0, 7);
export const addMonths = (mk, n) => {
  const [y, m] = mk.split('-').map(Number);
  const d = new Date(y, m - 1 + n, 1);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
};
export const diffDays = (a, b) => Math.round((fromKey(b) - fromKey(a)) / 86400000);

export const toMin = (t) => {
  if (!t) return null;
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};
export const fromMin = (m) => `${pad(Math.floor(m / 60) % 24)}:${pad(m % 60)}`;
export const nowMin = () => {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
};
export const fmtTime = (t) => (t ? t.replace(/^0/, '').replace(':00', 'h').replace(':', 'h') : '');

export const WEEKDAYS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
export const WD_SHORT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
export const WD_LETTER = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
export const MONTHS = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
export const MONTHS_SHORT = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

export const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export const fmtDayLong = (k) => {
  const d = fromKey(k);
  return `${WEEKDAYS[d.getDay()]}, ${d.getDate()} de ${MONTHS[d.getMonth()]}`;
};
export const fmtDayShort = (k) => {
  const d = fromKey(k);
  return `${WD_SHORT[d.getDay()]}, ${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`;
};
export const fmtMonth = (mk) => {
  const [y, m] = mk.split('-').map(Number);
  return `${cap(MONTHS[m - 1])} ${y}`;
};
export const relDay = (k) => {
  const diff = diffDays(todayKey(), k);
  if (diff === 0) return 'Hoje';
  if (diff === 1) return 'Amanhã';
  if (diff === -1) return 'Ontem';
  return WEEKDAYS[fromKey(k).getDay()];
};
export const dayLabel = (k) => {
  const diff = diffDays(todayKey(), k);
  if (Math.abs(diff) <= 1) return `${relDay(k)} · ${fmtDayShort(k)}`;
  return fmtDayLong(k);
};
export const fmtDuration = (min) => {
  if (!min) return '';
  const h = Math.floor(min / 60), m = min % 60;
  if (!h) return `${m} min`;
  return m ? `${h}h${pad(m)}` : `${h}h`;
};
export const fmtCountdown = (min) => {
  if (min <= 0) return 'agora';
  if (min < 60) return `em ${min} min`;
  const h = Math.floor(min / 60), m = min % 60;
  return m ? `em ${h}h${pad(m)}` : `em ${h}h`;
};
export const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
};

export const uid = (p = '') => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
export const randomToken = (len = 22) => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
  const arr = crypto.getRandomValues(new Uint8Array(len));
  return Array.from(arr, (b) => chars[b % chars.length]).join('');
};

export const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export const initials = (name = '') =>
  name.trim().split(/\s+/).slice(0, 2).map((w) => w[0] || '').join('').toUpperCase() || '?';

export const hexToRgb = (hex) => {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
export const rgba = (hex, a) => {
  const [r, g, b] = hexToRgb(hex || '#888888');
  return `rgba(${r},${g},${b},${a})`;
};
export const textOn = (hex) => {
  const [r, g, b] = hexToRgb(hex || '#888888');
  const L = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return L > 0.62 ? '#111111' : '#ffffff';
};

export const debounce = (fn, ms) => {
  let t;
  return (...a) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...a), ms);
  };
};

/* Redimensiona uma imagem (logo) para um quadrado e devolve dataURL */
export function resizeImage(file, size = 160) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = c.height = size;
      const ctx = c.getContext('2d');
      // logo inteira, centralizada, sem cortar (fundo preto: combina com logos de fundo escuro ou transparente)
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, size, size);
      const scale = Math.min(size / img.width, size / img.height) * 0.9;
      const w = img.width * scale, h = img.height * scale;
      ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL('image/jpeg', 0.86));
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };
    img.src = url;
  });
}

export const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

/* links de convite/compartilhamento com a origem marcada (o app lê utm_* no 1º acesso e o painel mostra de onde vieram os cadastros).
   Os parâmetros vão ANTES do # (as rotas do app ficam no #). medium: 'convite' ou 'story'. */
export function comUtm(url, medium = 'convite') {
  const [base, hash = ''] = String(url).split('#');
  const q = `utm_source=app&utm_medium=${encodeURIComponent(medium)}&utm_campaign=indicacao`;
  const limpo = base.replace(/([?&])utm_(source|medium|campaign)=[^&]*/g, '$1').replace(/[?&]+$/, '').replace(/\?&/, '?');
  return `${limpo}${limpo.includes('?') ? '&' : '?'}${q}${hash ? `#${hash}` : ''}`;
}
