/* Versão do app.
   - Número (2.0.0) vem do release.json no build; o "build" é a impressão digital do arquivo (muda a cada publicação).
   - Ao abrir e ao voltar para o app, confere o version.json: se tem versão nova, recarrega sozinho
     (só quando a pessoa não está no meio de algo). Ninguém precisa reinstalar o ícone.
   - Se a versão da pessoa estiver abaixo da mínima ("min"), mostra a tela de atualização obrigatória.
   - Depois de atualizar, mostra uma vez as novidades.
   - A versão vai junto no resumo de uso: o Painel do dono vê quem está atualizado. */
import { openSheet, sheetHead } from './components.js';
import { icon } from './icons.js';
import { esc } from './utils.js';

/* eslint-disable no-undef */
export const APP_VERSION = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '0.0.0';
export const APP_TITLE = typeof __APP_TITLE__ !== 'undefined' ? __APP_TITLE__ : '';
export const APP_NOTES = typeof __APP_NOTES__ !== 'undefined' ? __APP_NOTES__ : [];
const APP_MIN = typeof __APP_MIN__ !== 'undefined' ? __APP_MIN__ : '';
/* eslint-enable no-undef */
export const APP_BUILD = (() => {
  const m = /a-([A-Za-z0-9]+)\.js/.exec(String(window.__appEntry || ''));
  return m ? m[1].slice(0, 8).toLowerCase() : 'dev';
})();

/* compara 2.10.0 com 2.9.3 do jeito certo (número a número) */
export function cmpVer(a, b) {
  const A = String(a || '0').split('.').map((x) => parseInt(x, 10) || 0), B = String(b || '0').split('.').map((x) => parseInt(x, 10) || 0);
  for (let i = 0; i < 3; i++) if ((A[i] || 0) !== (B[i] || 0)) return (A[i] || 0) > (B[i] || 0) ? 1 : -1;
  return 0;
}
export const verLabel = () => `${APP_VERSION}${APP_BUILD !== 'dev' ? ` (${APP_BUILD})` : ''}`;

/* desde quando ESTE aparelho está nesta versão (o painel mostra "recebeu em …") */
const LS = 'lembra.ver';
let since = Date.now();
let prevVersion = '';
try {
  const s = JSON.parse(localStorage.getItem(LS) || 'null');
  if (s && s.b === APP_BUILD && s.at) since = s.at;
  else { prevVersion = s?.v || (window.__firstRun === false ? '1.9.0' : ''); localStorage.setItem(LS, JSON.stringify({ v: APP_VERSION, b: APP_BUILD, at: since, prev: prevVersion })); }
  if (s && s.b === APP_BUILD) prevVersion = s.prev || '';
} catch { /* ok */ }
export const appInfo = () => ({ v: APP_VERSION, b: APP_BUILD, since });

/* ---------- conferir se há versão nova ---------- */
export let latest = null;
let lastCheck = 0;
const busy = () => !!document.querySelector('.sheet-wrap, .ficha, .paywall, .ob, .termsgate, .guide, .spaceveil, .okfx, .gx') || (document.activeElement && /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName));
export async function fetchLatest() {
  const r = await fetch(`version.json?t=${Date.now()}`, { cache: 'no-store' });
  if (!r.ok) throw new Error('sem version.json');
  const j = await r.json();
  if (!j || !/^\d+\.\d+\.\d+$/.test(j.version || '')) throw new Error('version.json inválido');
  latest = j;
  return j;
}
export async function checkVersion({ force = false } = {}) {
  if (APP_BUILD === 'dev' || location.protocol === 'file:') return null;
  if (!force && Date.now() - lastCheck < 60e3) return latest;
  lastCheck = Date.now();
  let j;
  try { j = await fetchLatest(); } catch { return null; }
  if (j.build === APP_BUILD) return j;
  // abaixo da versão mínima: atualização obrigatória (a versão antiga pode estar com problema)
  const minNeeded = j.min && cmpVer(APP_VERSION, j.min) < 0;
  if (minNeeded) { mustUpdate(j); return j; }
  // versão nova: recarrega sozinho quando estiver livre (uma vez por versão, nunca em sequência)
  let tried = '';
  try { tried = sessionStorage.getItem('cal.updTried') || ''; } catch { /* ok */ }
  if (tried === j.build || busy()) return j;
  try { sessionStorage.setItem('cal.updTried', j.build); } catch { /* ok */ }
  location.replace(`${location.pathname}?u=${encodeURIComponent(j.build)}${location.hash}`);
  return j;
}

/* limpa o que estiver guardado e abre de novo (resolve celular preso numa versão antiga) */
export async function hardReload() {
  try { const rs = await navigator.serviceWorker?.getRegistrations(); await Promise.all((rs || []).map((r) => r.update().catch(() => {}))); } catch { /* ok */ }
  try { const ks = await caches.keys(); await Promise.all(ks.map((k) => caches.delete(k))); } catch { /* ok */ }
  location.replace(`${location.pathname}?r=${Date.now()}${location.hash}`);
}
function mustUpdate(j) {
  if (document.querySelector('.mustupd')) return;
  const el = document.createElement('div');
  el.className = 'mustupd';
  el.innerHTML = `<div class="mustupd__in">${icon('refresh', 34)}<h2>Atualização necessária</h2>
    <p>O Lembra ${esc(j.version)} já está no ar e a sua versão (${esc(APP_VERSION)}) não funciona mais direito. Leva 2 segundos e você não perde nada.</p>
    <button class="btn btn--primary btn--block" data-upd>Atualizar agora</button></div>`;
  document.body.appendChild(el);
  el.querySelector('[data-upd]').onclick = (e) => { e.currentTarget.disabled = true; e.currentTarget.textContent = 'Atualizando…'; hardReload(); };
}

/* ---------- novidades (uma vez depois de atualizar) ---------- */
export function maybeShowWhatsNew() {
  if (!prevVersion || cmpVer(APP_VERSION, prevVersion) <= 0 || !APP_NOTES.length) return false;
  const key = `lembra.news.${APP_VERSION}`;
  try { if (localStorage.getItem(key)) return false; localStorage.setItem(key, '1'); } catch { return false; }
  openNews();
  return true;
}
export function openNews() {
  return openSheet({
    html: `${sheetHead(`Novidades · versão ${esc(APP_VERSION)}`, { right: '<button class="btn btn--primary btn--sm" data-close>Legal!</button>' })}
      <div class="page page--sheet news">
        ${APP_TITLE ? `<p class="news__title">${esc(APP_TITLE)}</p>` : ''}
        <ul class="news__list">${APP_NOTES.map((n) => `<li>${icon('sparkles', 16)}<span>${esc(n)}</span></li>`).join('')}</ul>
        <p class="fhelp">O Lembra se atualiza sozinho sempre que você abre. Não precisa reinstalar nada.</p>
      </div>`,
  });
}
/* Ajustes → "Procurar atualização agora" */
export async function updateNow() {
  let j = null;
  try { j = await fetchLatest(); } catch { return { ok: false }; }
  if (j.build === APP_BUILD || APP_BUILD === 'dev') return { ok: true, current: true, version: j.version };
  hardReload();
  return { ok: true, current: false, version: j.version };
}

/* liga a conferência: ao voltar para o app e a cada 30 min com ele aberto */
let started = false;
export function startVersionWatch() {
  if (started) return;
  started = true;
  window.__verWatch = true;
  if (APP_MIN && cmpVer(APP_VERSION, APP_MIN) < 0) { /* build quebrado: nunca acontece, mas não trava */ }
  document.addEventListener('visibilitychange', () => { if (!document.hidden) setTimeout(() => checkVersion(), 1200); });
  setInterval(() => { if (!document.hidden) checkVersion(); }, 30 * 60e3);
  setTimeout(() => checkVersion({ force: true }), 4000);
}
