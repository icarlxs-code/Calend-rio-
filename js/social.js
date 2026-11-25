/* Social: conexão em tempo real, contagem de mensagens e peças usadas pelos stories e pelo privado.
   Nada de conversa fica guardado no aparelho: só na memória, enquanto o app está aberto. */
import { store } from './store.js';
import { api, server } from './avisos.js';
import { esc } from './utils.js';

export const call = (path, body = {}) => api(path, { ws: '', ...body });
export const podeSocial = () => store.mode === 'cloud' && !!store.user && !!server();
const sv = (d, t = 24) => `<svg class="ic" width="${t}" height="${t}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
export const ICO = {
  chat: (t) => sv('<path d="M20.5 11.4c0 4.1-3.8 7.4-8.5 7.4-1 0-2-.2-2.9-.4L4.2 20l1.3-3.8a6.8 6.8 0 0 1-2-4.8C3.5 7.300 7.300 4 12 4s8.500 3.300 8.500 7.400Z"/><path d="M8.500 11.500h.01M12 11.500h.01M15.500 11.500h.01"/>', t),
  manda: (t) => sv('<path d="M20.500 3.500 10 14"/><path d="M20.500 3.500 14 20.500l-4-6.500-6.500-4Z"/>', t),
  coracao: (t, cheio) => `<svg class="ic" width="${t || 26}" height="${t || 26}" viewBox="0 0 24 24" fill="${cheio ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2.1" stroke-linejoin="round" aria-hidden="true"><path d="M12 20.300C5.800 15.900 3 12.700 3 9.100 3 6.500 5 4.500 7.500 4.500c1.800 0 3.400 1 4.500 2.700 1.100-1.700 2.700-2.700 4.500-2.700C19 4.500 21 6.500 21 9.100c0 3.600-2.800 6.800-9 11.200Z"/></svg>`,
  coment: (t) => sv('<path d="M20.500 11.500a8 8 0 0 1-8.300 7.700 9 9 0 0 1-3.300-.600L4 20l1.400-4a7.300 7.300 0 0 1-1.900-4.800A8 8 0 0 1 11.800 3.500a8 8 0 0 1 8.700 8Z"/>', t),
  volta: (t) => sv('<path d="m9 7-5 5 5 5"/><path d="M4 12h9a6 6 0 0 1 6 6v1"/>', t),
  pausa: (t) => sv('<path d="M9 5.500v13M15 5.500v13" stroke-width="3"/>', t),
  toca: (t) => `<svg class="ic" width="${t || 24}" height="${t || 24}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.200c0-.900 1-1.500 1.800-1l9.700 6.800c.700.500.700 1.500 0 2l-9.700 6.800c-.800.500-1.800 0-1.800-1Z"/></svg>`,
};
export const rosto = (c, s = 48) => (c && c.photo ? `<span class="stface" style="--s:${s}px"><img src="${esc(c.photo)}" alt=""></span>` : `<span class="stface" style="--s:${s}px;background:${esc((c && c.color) || '#FF6B1A')}">${esc(((c && c.name) || '?').charAt(0).toUpperCase())}</span>`);
export const desde = (at) => { const m = Math.round((Date.now() - at) / 60000); return m < 1 ? 'agora' : m < 60 ? `${m} min` : `${Math.round(m / 60)} h`; };
export const falta = (at) => { const m = Math.max(0, Math.round((at + 864e5 - Date.now()) / 60000)); return m < 60 ? `${m} min` : `${Math.floor(m / 60)} h`; };

/* ---------- eventos ---------- */
const ouv = new Set();
export const ouvir = (fn) => { ouv.add(fn); return () => ouv.delete(fn); };
export const emite = (e) => ouv.forEach((f) => { try { f(e); } catch (x) { console.warn('social', x); } });

/* ---------- conversas (memória) ---------- */
const CFG0 = { fix: [], arq: [], tra: [] };
let C = { lista: [], total: 0, at: 0, semLido: false, cfg: CFG0 }, emTroca = null, relogio = 0;
export const conversas = () => C;
/** fixar, arquivar, trancar ou silenciar */
export async function organiza(com, campo, on) {
  if (campo === 'mudo') { await call('/friends/msg-mute', { com, on }); const c = C.lista.find((x) => x.uid === com); if (c) c.mudo = on; }
  else { const r = await call('/friends/msg-organiza', { com, campo, on }); C = { ...C, cfg: { ...CFG0, ...r.cfg } }; }
  emite({ t: 'convs' }); atualiza(true);
}
/** tira qualquer seleção azul que o iPhone tenha aberto ao segurar */
export const semSelecao = () => { try { const s = getSelection(); if (s && s.rangeCount && !/INPUT|TEXTAREA/.test(document.activeElement?.tagName || '')) s.removeAllRanges(); } catch { /* ok */ } };
export function atualiza(forca = false) {
  if (!podeSocial()) return Promise.resolve(C);
  if (emTroca) return emTroca;
  if (!forca && Date.now() - C.at < 4000) return Promise.resolve(C);
  emTroca = call('/friends/convs').then((r) => { C = { lista: r.convs || [], total: r.total || 0, at: Date.now(), semLido: !!r.semLido, cfg: { ...CFG0, ...(r.cfg || {}) } }; pinta(); emite({ t: 'convs' }); return C; }).catch(() => C).finally(() => { emTroca = null; });
  return emTroca;
}
const logo = () => { clearTimeout(relogio); relogio = setTimeout(() => atualiza(true), 350); };
/* número nos ícones de mensagem espalhados pelo app */
export function pinta() {
  document.querySelectorAll('[data-msgs]').forEach((b) => { const n = C.total; let i = b.querySelector('.msgn'); if (!n) { i && i.remove(); return; } if (!i) { i = document.createElement('i'); i.className = 'msgn'; b.appendChild(i); } i.textContent = n > 99 ? '99+' : n; b.setAttribute('aria-label', `Mensagens, ${n} ${n === 1 ? 'nova' : 'novas'}`); });
}
export const botaoMensagens = () => (podeSocial() ? `<button class="iconbtn iconbtn--msgs" data-action="mensagens" data-msgs aria-label="Mensagens">${ICO.chat(21)}${C.total ? `<i class="msgn">${C.total > 99 ? '99+' : C.total}</i>` : ''}</button>` : '');

/* ---------- tempo real ---------- */
let ws = null, tenta = 0, tRe = 0, tPing = 0, ligado = false, aberto = '';
export const aoVivo = () => !!ws && ws.readyState === 1;
export const conversaAberta = (uid) => { aberto = uid || ''; };
const manda = (o) => { if (aoVivo()) try { ws.send(JSON.stringify(o)); } catch { /* ok */ } };
let ultDig = 0;
export const digitando = (para, v = 'txt') => { if (Date.now() - ultDig < 2500) return; ultDig = Date.now(); manda({ t: 'dig', para, v }); };
async function conecta() {
  clearTimeout(tRe);
  if (!podeSocial() || document.hidden || (ws && ws.readyState < 2) || typeof WebSocket === 'undefined') return;
  let token = ''; try { token = await store.idToken(); } catch { /* ok */ }
  if (!token) return repete();
  try { ws = new WebSocket(server().replace(/^http/, 'ws') + '/ws', ['lembra', token]); } catch { return repete(); }
  ws.onopen = () => { tenta = 0; clearInterval(tPing); tPing = setInterval(() => { if (aoVivo()) ws.send('ping'); }, 45e3); manda({ t: 'vis', v: !document.hidden }); atualiza(true); emite({ t: 'ligou' }); };
  ws.onmessage = (e) => { if (e.data === 'pong') return; let o; try { o = JSON.parse(e.data); } catch { return; } recebe(o); };
  ws.onclose = () => { clearInterval(tPing); ws = null; emite({ t: 'caiu' }); repete(); };
  ws.onerror = () => { /* o onclose cuida */ };
}
function repete() { if (document.hidden) return; clearTimeout(tRe); tRe = setTimeout(conecta, Math.min(120e3, 2000 * 2 ** Math.min(6, tenta++)) * (0.8 + Math.random() * 0.4)); }
function recebe(o) {
  if (['msg', 'eu', 'li', 'mudou'].includes(o.t)) logo();
  emite(o);
  const nome = String(o.nome || '').slice(0, 30);
  if (o.t === 'msg' && aberto !== o.de) { import('./sound.js').then((s) => s.msgVem()).catch(() => {}); try { navigator.vibrate && navigator.vibrate(12); } catch { /* ok */ } import('./mascote.js').then((M) => M.react('privado')).catch(() => {}); }
  if (o.t === 'gostou') { import('./sound.js').then((s) => s.curtida()).catch(() => {}); import('./mascote.js').then((M) => M.react('gostou', { nome })).catch(() => {}); }
  if (o.t === 'comentou' || o.t === 'repostou') import('./mascote.js').then((M) => M.react(o.t, { nome })).catch(() => {});
}
/** começa depois que o app abriu; pode chamar de novo */
export function inicia() {
  if (ligado || !podeSocial()) return; ligado = true;
  conecta();
  let tSome = 0;
  document.addEventListener('visibilitychange', () => {
    clearTimeout(tSome);
    if (document.hidden) { manda({ t: 'vis', v: false }); tSome = setTimeout(() => { if (document.hidden && ws) { const x = ws; x.onclose = null; x.close(); ws = null; clearInterval(tPing); } }, 45e3); } else { manda({ t: 'vis', v: true }); tenta = 0; if (aoVivo()) atualiza(); else conecta(); }
  });
  addEventListener('online', () => { tenta = 0; conecta(); });
  setInterval(() => { if (!document.hidden && !aoVivo()) atualiza(true); }, 60e3); // sem tempo real: confere de minuto em minuto
}
