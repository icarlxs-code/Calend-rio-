/* Avisos obrigatórios: sem a permissão de notificação, o Lembra não abre.
   O navegador não deixa ligar sozinho: a tela pede, confere e só sai quando estiver ligado.
   Aparelho que não aceita notificação (não há o que ativar) nunca fica trancado para fora. */
import { store } from './store.js';
import { CONFIG } from '../config.js';
import * as push from './avisos.js';
import { icon } from './icons.js';
import { sininho, alive, setMood, act } from './sininho.js';

const local = () => ['localhost', '127.0.0.1'].includes(location.hostname);
const forca = () => { try { return localStorage.getItem('lembra.forcaAviso') === '1'; } catch { return false; } };
const iosAntigo = () => { const m = navigator.userAgent.match(/(?:iPhone )?OS (\d+)_(\d+)/); return !!m && (Number(m[1]) < 16 || (Number(m[1]) === 16 && Number(m[2]) < 4)); };
/* o que falta: 'pedir', 'bloqueado', 'instalar' ou null (tudo certo, ou aparelho que não aceita) */
export function falta() {
  if (CONFIG.avisosObrigatorios === false || (local() && !forca()) || (store.mode !== 'cloud' && !forca())) return null;
  if (push.needsInstall()) return iosAntigo() ? null : 'instalar';
  if (!push.pushSupported()) return null;
  return { granted: null, denied: 'bloqueado', default: 'pedir' }[push.permission()] ?? null;
}
const passos = () => {
  if (push.isIOS()) return ['Abra os <b>Ajustes</b> do iPhone', 'Toque em <b>Apps</b> e em <b>Lembra</b> (ou em <b>Notificações</b>)', 'Ligue <b>Permitir Notificações</b> e volte para cá'];
  if (/Android/i.test(navigator.userAgent)) return ['Segure o ícone do Lembra e toque em <b>Informações do app</b>', 'Toque em <b>Notificações</b> e ligue', 'Pelo navegador: toque no <b>cadeado</b> do endereço, em <b>Permissões</b>, e ligue'];
  return ['Clique no <b>cadeado</b> ao lado do endereço', 'Em <b>Notificações</b>, escolha <b>Permitir</b>', 'Volte para esta tela'];
};
const TELA = {
  pedir: () => ({ m: 'feliz', t: 'Deixa eu te avisar?', s: 'Para lembrar de você na hora certa, eu preciso das notificações. É só um toque.', b: 'Ativar notificações' }),
  bloqueado: () => ({ m: 'triste', t: 'Estou sem voz aqui', s: 'As notificações estão desligadas neste aparelho. Ligue para continuar:', l: passos(), b: 'Já liguei' }),
  instalar: () => ({ m: 'feliz', t: 'Me coloque na tela', s: 'No iPhone, as notificações só funcionam pelo ícone do Lembra:', l: ['Toque em <b>Compartilhar</b> no Safari', 'Escolha <b>Adicionar à Tela de Início</b>', 'Abra o Lembra pelo ícone e ative'], b: 'Entendi, vou instalar' }),
};
let w = null;
const libera = () => {
  if (!w) return; const x = w; w = null; document.body.classList.remove('has-avgate'); x.classList.add('is-out'); setTimeout(() => x.remove(), 260);
  push.register().catch(() => {});
};
function pinta() {
  const k = falta(); if (!k) { libera(); return; }
  if (!w || w.dataset.k === k) return;
  w.dataset.k = k; const T = TELA[k]();
  w.innerHTML = `<div class="avgate__in"><span class="avgate__snh">${sininho(T.m, { size: 170 })}</span><h1 id="avgate-t" tabindex="-1">${T.t}</h1><p>${T.s}</p>
    ${T.l ? `<ol>${T.l.map((x) => `<li><span>${x}</span></li>`).join('')}</ol>` : ''}
    <p class="avgate__err" data-err role="status" hidden></p><button class="btn btn--primary btn--block btn--big" data-vai>${k === 'pedir' ? icon('bell', 20) : ''} ${T.b}</button>
    <div class="avgate__pe"><a href="suporte/">Ajuda</a><a href="excluir-conta/">Excluir conta</a><button data-action="logout" data-sair>Sair da conta</button></div></div>`;
  alive(); const e = w.querySelector('[data-snh]'); setMood(e, T.m); setTimeout(() => act(e, 'tchau'), 400);
  w.querySelector('h1').focus({ preventScroll: true });
  // sair: o app confirma e sai; se desistir, esta tela volta
  w.querySelector('[data-sair]').onclick = () => { const x = w; setTimeout(() => { x.remove(); if (w === x) w = null; document.body.classList.remove('has-avgate'); setTimeout(exige, 1500); }); };
  w.querySelector('[data-vai]').onclick = async (ev) => {
    const b = ev.currentTarget, err = w.querySelector('[data-err]'); err.hidden = true;
    if (k === 'pedir') { b.disabled = true; try { await Promise.race([push.enable(), new Promise((r) => setTimeout(r, 12e3))]); } catch { /* a permissão é o que vale */ } b.disabled = false; }
    const era = k; pinta();
    if (w && w.dataset.k === era) { err.textContent = era === 'instalar' ? 'Depois de instalar, abra pelo ícone na Tela de Início.' : 'Ainda não ligou. Toque em permitir para continuar.'; err.hidden = false; act(w.querySelector('[data-snh]'), 'nao'); }
  };
}
const ocupado = () => document.querySelector('.sheet-wrap.is-open, .ficha, .paywall, .ob, .guide, .termsgate, .photogate, .mustupd, .nv');
/* chamada ao abrir e ao voltar para o app */
export function exige() {
  if (w) { pinta(); return; }
  if (!falta()) return;
  if (ocupado()) { setTimeout(exige, 1500); return; }
  w = document.createElement('div'); w.className = 'avgate'; w.setAttribute('role', 'dialog'); w.setAttribute('aria-modal', 'true'); w.setAttribute('aria-labelledby', 'avgate-t');
  document.body.append(w); document.body.classList.add('has-avgate'); pinta(); requestAnimationFrame(() => w && w.classList.add('is-in'));
}
let ligado = false;
export function vigia() {
  exige(); if (ligado) return; ligado = true;
  document.addEventListener('visibilitychange', () => { if (!document.hidden) setTimeout(exige, 400); });
  addEventListener('focus', () => setTimeout(exige, 400));
  if (navigator.permissions) navigator.permissions.query({ name: 'notifications' }).then((p) => { p.onchange = () => exige(); }).catch(() => {});
  document.addEventListener('keydown', (e) => { if (!w) return; if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); } if (e.key === 'Tab') { const f = [...w.querySelectorAll('a, button')], k = f.indexOf(document.activeElement); e.preventDefault(); f[(k + (e.shiftKey ? f.length - 1 : 1) + f.length) % f.length]?.focus(); } }, true);
}
