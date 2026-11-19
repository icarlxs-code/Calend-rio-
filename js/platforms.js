/* Pacote de ícones de plataformas: detecta pelo texto do evento ("postar no Instagram",
   "subir stories no TikTok"...) e mostra o símbolo da rede ao lado do título. */
const W = (bg, inner, fg = '#fff') => `<svg viewBox="0 0 24 24" aria-hidden="true"><rect width="24" height="24" rx="6" fill="${bg}"/><g fill="none" stroke="${fg}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${inner}</g></svg>`;
const IG_BG = 'url(#pf-ig)';
export const PLATFORMS = [
  { id: 'instagram', name: 'Instagram', words: ['instagram', 'insta', ' ig ', 'feed', 'reels', 'reel', 'carrossel'],
    svg: `<svg viewBox="0 0 24 24" aria-hidden="true"><defs><linearGradient id="pf-ig" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#FEDA75"/><stop offset=".35" stop-color="#FA7E1E"/><stop offset=".6" stop-color="#D62976"/><stop offset="1" stop-color="#4F5BD5"/></linearGradient></defs><rect width="24" height="24" rx="6" fill="${IG_BG}"/><g fill="none" stroke="#fff" stroke-width="1.9"><rect x="5" y="5" width="14" height="14" rx="4"/><circle cx="12" cy="12" r="3.3"/></g><circle cx="16.3" cy="7.7" r="1" fill="#fff"/></svg>` },
  { id: 'tiktok', name: 'TikTok', words: ['tiktok', 'tik tok', 'tik-tok'],
    svg: W('#000', '<path d="M13 5v9.5a3 3 0 1 1-3-3" stroke="#25F4EE" transform="translate(-.7 -.5)"/><path d="M13 5v9.5a3 3 0 1 1-3-3" stroke="#FE2C55" transform="translate(.7 .5)"/><path d="M13 5v9.5a3 3 0 1 1-3-3M13 5c.4 2.2 1.8 3.6 4 3.8"/>') },
  { id: 'youtube', name: 'YouTube', words: ['youtube', 'you tube', 'shorts', ' yt '],
    svg: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect width="24" height="24" rx="6" fill="#FF0000"/><path d="M10 8.5v7l6-3.5z" fill="#fff"/></svg>` },
  { id: 'facebook', name: 'Facebook', words: ['facebook', ' face ', ' fb '],
    svg: W('#1877F2', '<path d="M14.5 6.5H13a2.5 2.5 0 0 0-2.5 2.5v11M8.5 12h6"/>') },
  { id: 'whatsapp', name: 'WhatsApp', words: ['whatsapp', 'whats', 'zap', 'wpp', 'status do whats'],
    svg: W('#25D366', '<path d="M6 18l1-3a6 6 0 1 1 2.3 2.2z"/><path d="M10 9.5c0 2 2.5 4.5 4.5 4.5" />') },
  { id: 'linkedin', name: 'LinkedIn', words: ['linkedin', 'linked in'],
    svg: W('#0A66C2', '<path d="M8 10.5V17M8 7.3v.1M11.5 17v-6.5M11.5 13a2.5 2.5 0 0 1 5 0v4"/>') },
  { id: 'x', name: 'X (Twitter)', words: ['twitter', 'tweet', ' x '],
    svg: W('#000', '<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>') },
  { id: 'threads', name: 'Threads', words: ['threads'],
    svg: W('#000', '<path d="M15.5 10.5c-.5-2.5-2-3.5-3.8-3.5C9 7 7.5 9.2 7.5 12s1.6 5 4.4 5c2.4 0 4-1.4 4-3.2 0-2-2.2-2.8-4-2.3-1.3.4-1.7 1.6-1 2.3.9.9 3.3.4 3.6-2.3"/>') },
  { id: 'pinterest', name: 'Pinterest', words: ['pinterest', 'pin '],
    svg: W('#E60023', '<path d="M11 11l-2 8M9.5 14.5c.4.9 1.4 1.5 2.6 1.5 2.5 0 4-2.2 4-4.7C16.1 8.6 14.3 7 12 7a4.5 4.5 0 0 0-4.3 5.8"/>') },
  { id: 'google', name: 'Google Meu Negócio', words: ['google', 'meu negócio', 'meu negocio', 'gmb', 'maps'],
    svg: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect width="24" height="24" rx="6" fill="#fff" stroke="#ddd"/><g fill="none" stroke-width="2.4"><path d="M17.5 12.2H12" stroke="#4285F4"/><path d="M17.5 12.2a5.6 5.6 0 0 1-9.9 3.3" stroke="#34A853"/><path d="M7.6 15.5a5.6 5.6 0 0 1 0-7" stroke="#FBBC05"/><path d="M7.6 8.5a5.6 5.6 0 0 1 8.3-.6" stroke="#EA4335"/></g></svg>` },
  { id: 'kwai', name: 'Kwai', words: ['kwai'],
    svg: W('#FF7E00', '<rect x="5" y="9" width="10" height="8" rx="2"/><path d="M15 12l4-2v6l-4-2"/><circle cx="8" cy="6.5" r="1.5"/><circle cx="12" cy="6.5" r="1.5"/>') },
  { id: 'spotify', name: 'Spotify', words: ['spotify', 'podcast'],
    svg: W('#1DB954', '<path d="M7 9.5c3.5-1 7-.6 10 1M7.7 12.6c2.8-.7 5.6-.4 8 .9M8.4 15.5c2.2-.5 4.3-.3 6.1.7"/>') },
  { id: 'telegram', name: 'Telegram', words: ['telegram'],
    svg: W('#26A5E4', '<path d="M5.5 11.5l12-5-2 11-4-3-2 2v-3.5l6-5"/>') },
  { id: 'email', name: 'E-mail', words: ['e-mail', 'email', 'newsletter'],
    svg: W('#6B7280', '<rect x="5" y="7" width="14" height="10" rx="2"/><path d="m5.5 8 6.5 5 6.5-5"/>') },
  { id: 'site', name: 'Site / Blog', words: ['site', 'blog', 'landing'],
    svg: W('#334155', '<circle cx="12" cy="12" r="6.5"/><path d="M5.5 12h13M12 5.5c2 2 2 11 0 13M12 5.5c-2 2-2 11 0 13"/>') },
];

/* Plataformas citadas no texto do evento (título, descrição, nota) */
export function detectPlatforms(e) {
  const text = ` ${[e?.title, e?.description, e?.internalNote].filter(Boolean).join(' ').toLowerCase()} `.replace(/[.,;:!?()/\-]/g, ' ');
  const found = PLATFORMS.filter((p) => !['instagram'].includes(p.id) && p.words.some((w) => text.includes(w.startsWith(' ') ? w : w)));
  const insta = PLATFORMS[0].words.slice(0, 3).some((w) => text.includes(w));
  if (insta) found.unshift(PLATFORMS[0]);
  return found;
}

import { TYPES } from './constants.js';
export const POST_NETS = ['instagram', 'tiktok', 'facebook', 'youtube', 'linkedin', 'whatsapp', 'pinterest', 'x'];
export const platformById = (id) => PLATFORMS.find((p) => p.id === id);
/* Rede do evento: a escolhida no editor; se for post sem escolha, Instagram; mais as citadas no texto */
export function eventPlatforms(e) {
  const found = detectPlatforms(e);
  const main = e?.platform ? platformById(e.platform) : TYPES[e?.type]?.kind === 'post' ? platformById('instagram') : null;
  return main ? [main, ...found.filter((p) => p.id !== main.id)] : found;
}
export function platformIcons(e, size = 18) {
  const list = Array.isArray(e) ? e : eventPlatforms(e);
  return list.map((p) => `<span class="pf" style="width:${size}px;height:${size}px" title="${p.name}">${p.svg}</span>`).join('');
}
