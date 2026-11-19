/* "Instale o app": quem abre pelo navegador vê como colocar na Tela de Início
   (iPhone: Compartilhar → Adicionar à Tela de Início; Android: botão Instalar ou menu ⋮).
   Instalado, o app abre mais rápido, em tela cheia e recebe notificações no iPhone. */
import { icon } from './icons.js';
import { isStandalone } from './utils.js';

let deferred = null; // pedido de instalação do Android/Chrome
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferred = e;
  document.querySelectorAll('[data-install-native]').forEach((b) => (b.hidden = false));
});
window.addEventListener('appinstalled', () => { deferred = null; closeGuide(); });

const ua = navigator.userAgent || '';
export const platform = () => {
  if (/iPhone|iPad|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
    return /CriOS|FxiOS|EdgiOS/.test(ua) ? 'ios-other' : 'ios';
  }
  if (/Android/.test(ua)) return /SamsungBrowser/.test(ua) ? 'samsung' : 'android';
  return 'desktop';
};
const LS = 'cal.installSnooze';
const snoozed = () => { try { return Date.now() < +(localStorage.getItem(LS) || 0); } catch { return false; } };
const snooze = (days) => { try { localStorage.setItem(LS, String(Date.now() + days * 864e5)); } catch { /* ok */ } };

function steps(pf) {
  const step = (n, ic, html) => `<li><span class="istep__n">${n}</span><span class="istep__ic">${icon(ic, 20)}</span><span>${html}</span></li>`;
  if (pf === 'ios') return [
    step(1, 'iosshare', 'Toque em <b>Compartilhar</b> (o quadrado com a seta para cima) na barra do Safari. Se não aparecer, toque antes nos <b>•••</b>.'),
    step(2, 'plussq', 'Role a lista e toque em <b>Adicionar à Tela de Início</b>.'),
    step(3, 'check', 'Toque em <b>Adicionar</b>. Depois abra sempre pelo <b>ícone</b> na Tela de Início.'),
  ];
  if (pf === 'ios-other') return [
    step(1, 'iosshare', 'Toque em <b>Compartilhar</b> (no Chrome fica no canto de cima, ao lado do endereço).'),
    step(2, 'plussq', 'Toque em <b>Adicionar à Tela de Início</b>. Se não aparecer, abra este endereço no <b>Safari</b>.'),
    step(3, 'check', 'Depois abra sempre pelo <b>ícone</b> na Tela de Início.'),
  ];
  if (pf === 'android' || pf === 'samsung') return [
    step(1, 'dots', pf === 'samsung' ? 'Toque no menu <b>☰</b> (embaixo, à direita).' : 'Toque no menu <b>⋮</b> (canto de cima, à direita).'),
    step(2, 'download', 'Toque em <b>Instalar app</b> ou <b>Adicionar à tela inicial</b>.'),
    step(3, 'check', 'Confirme. O ícone aparece na tela do celular: abra sempre por ele.'),
  ];
  return [
    step(1, 'download', 'No Chrome ou Edge, clique no ícone de <b>instalar</b> na barra de endereço (ou menu ⋮ → <b>Instalar</b>).'),
    step(2, 'phone', 'No celular, abra este mesmo endereço e siga as instruções que aparecem.'),
  ];
}

function closeGuide() {
  const w = document.querySelector('.iguide');
  if (!w) return;
  w.classList.remove('is-open');
  setTimeout(() => w.remove(), 300);
}

/* Mostra o guia (force = aberto pelo botão nos Ajustes) */
export function showInstallGuide({ force = false } = {}) {
  if (isStandalone() || document.querySelector('.iguide')) return false;
  if (!force && snoozed()) return false;
  const pf = platform();
  const wrap = document.createElement('div');
  wrap.className = 'iguide';
  wrap.innerHTML = `<div class="iguide__backdrop" data-iclose></div>
    <section class="iguide__card" role="dialog" aria-label="Instalar o app">
      <div class="iguide__head">
        <img src="icons/icon-192.png" alt="" width="56" height="56">
        <div><strong>Instale o Lembra</strong><small>Fica como um app de verdade no seu celular</small></div>
      </div>
      <ul class="iguide__why">
        <li>${icon('bell', 15)} Recebe as notificações${pf.startsWith('ios') ? ' (no iPhone só funciona instalado)' : ''}</li>
        <li>${icon('sparkles', 15)} Abre na hora, em tela cheia</li>
        <li>${icon('heart', 15)} Ícone próprio na tela inicial</li>
      </ul>
      <button class="btn btn--primary btn--block" data-install-native ${deferred ? '' : 'hidden'}>${icon('download', 18)} Instalar agora</button>
      <ol class="isteps">${steps(pf).join('')}</ol>
      <div class="iguide__foot"><button class="btn-text btn-text--sm" data-ilater>Agora não</button></div>
    </section>`;
  document.body.appendChild(wrap);
  requestAnimationFrame(() => requestAnimationFrame(() => wrap.classList.add('is-open')));
  wrap.querySelector('[data-iclose]').onclick = () => { snooze(1); closeGuide(); };
  wrap.querySelector('[data-ilater]').onclick = () => { snooze(3); closeGuide(); };
  wrap.querySelector('[data-install-native]').onclick = async () => {
    if (!deferred) return;
    deferred.prompt();
    const r = await deferred.userChoice.catch(() => null);
    deferred = null;
    if (r && r.outcome === 'accepted') closeGuide();
  };
  return true;
}
export const canInstall = () => !isStandalone();
