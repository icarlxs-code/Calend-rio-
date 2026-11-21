/* Erros do app: manda para o servidor (sem conteúdo da agenda) para o dono ver no painel e corrigir */
import { store } from './store.js';
import { server, api } from './avisos.js';
import { lastSteps } from './track.js';
import { APP_VERSION } from './version.js';

const ver = (() => { try { return (import.meta.url.match(/([a-z]-[A-Z0-9]{6,})\.js/) || [])[1] || 'dev'; } catch { return 'dev'; } })();
// falhas de rede, permissão e cancelamentos não são bugs do app
const IGNORE = /ResizeObserver|Failed to fetch|NetworkError|Load failed|network|permission|PERMISSION|quota|AbortError|The operation was aborted|cancel/i;
let sent = 0;
const seen = new Set();
function report(msg, where) {
  msg = String(msg || '').slice(0, 300);
  if (!msg || IGNORE.test(msg) || sent >= 5 || seen.has(msg)) return;
  seen.add(msg);
  if (store.mode !== 'cloud' || !server() || !store.user) return;
  sent++;
  const ua = navigator.userAgent;
  const dev = /iPhone|iPad/.test(ua) ? 'iPhone' : /Android/.test(ua) ? 'Android' : 'Computador';
  const app = typeof matchMedia === 'function' && matchMedia('(display-mode: standalone)').matches ? ' (app)' : '';
  // "Script error." = o Safari esconde o detalhe (erro de fora do app: tradução, extensão, conteúdo de outro site)
  const steps = lastSteps();
  api('/log', { msg, where: String(where || '').slice(0, 160), ver: `${APP_VERSION} · ${ver}`, dev: dev + app, space: document.documentElement.dataset.space || '', steps: `${location.hash || '#'}${steps ? ' · ' + steps : ''}`.slice(0, 160) }).catch(() => {});
}
export function startErrorLog() {
  window.addEventListener('error', (e) => report(e.message, `${(e.filename || '').split('/').pop()}:${e.lineno || ''}`));
  window.addEventListener('unhandledrejection', (e) => {
    const r = e.reason;
    report(r && (r.message || r.code) ? `${r.code ? r.code + ': ' : ''}${r.message || ''}` : String(r), (r && r.stack ? String(r.stack).split('\n')[1] || '' : '').trim());
  });
}
