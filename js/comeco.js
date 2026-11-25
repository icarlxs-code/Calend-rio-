/* Primeiros minutos: 1º lembrete com um toque, check-up do aviso, enquete curta, aviso de dados no aparelho e idade.
   Tudo opcional e sem insistência; nada disso bloqueia o Hoje. */
import { store, saveUserProfile, saveProfileQuiet } from './store.js';
import { personal, savePersonal } from './personal.js';
import { openSheet, toast } from './components.js';
import { icon } from './icons.js';
import { esc, todayKey, addDays } from './utils.js';
import { okFx } from './okfx.js';
import { sininho, alive, veste } from './sininho.js';
import { roupa } from './roupas.js';
import { ageOf } from './persona.js';
import { CONFIG } from '../config.js';
import { mostraEnquete, OPCOES, ehTeste } from './metricas.js';

const LS = (k) => `lembra.${k}.${store.user?.uid || 'x'}`;
const le = (k) => { try { return JSON.parse(localStorage.getItem(LS(k)) || 'null'); } catch { return null; } };
const poe = (k, v) => { try { localStorage.setItem(LS(k), JSON.stringify(v)); } catch { /* ok */ } };
const nuvem = () => store.mode === 'cloud' && store.solo && !!store.user;

/* ---------- 1º lembrete ---------- */
const PRONTOS = [
  { id: 'agua', ic: 'drop', t: 'Beber água', quando: () => ({ date: todayKey(), time: '10:00', repeat: 'daily', cat: 'saude' }), s: 'todo dia, 10h' },
  { id: 'rem', ic: 'pill', t: 'Tomar meu remédio', quando: () => ({ date: todayKey(), time: '08:00', repeat: 'daily', cat: 'saude' }), s: 'todo dia, 8h' },
  { id: 'lig', ic: 'phone', t: 'Ligar para alguém querido', quando: () => ({ date: addDays(todayKey(), 1), time: '18:00', repeat: 'none', cat: 'lembrete' }), s: 'amanhã, 18h' },
];
export const semNada = () => !personal.events.length && !store.state.events.some((e) => (e.createdBy || store.me) === store.me);
export function cartaoPrimeiro() {
  if (!nuvem() || !personal.ready || !semNada()) return '';
  return `<section class="prim"><div class="prim__t"><span class="prim__snh">${sininho('acena', { size: 92 })}</span><h2>Seu primeiro lembrete</h2></div>${PRONTOS.map((p) => `<button class="prim__b" data-action="prim" data-id="${p.id}"><span>${icon(p.ic, 24)}</span><span><b>${p.t}</b><small>${p.s}</small></span>${icon('plus', 22)}</button>`).join('')}</section>`;
}
export function criaPrimeiro(id) {
  const p = PRONTOS.find((x) => x.id === id); if (!p) return; const q = p.quando();
  savePersonal({ title: p.t, note: '', remind: 'auto', ...q });
  okFx({ title: 'Pronto!', sub: 'Eu te aviso na hora', item: { title: p.t, date: q.date, time: q.time } });
  setTimeout(() => window.__calRender && window.__calRender(), 300);
}

/* ---------- check-up do aviso ---------- */
const ANDROID = () => (/xiaomi|redmi|poco|mi \d/i.test(navigator.userAgent) ? 'Xiaomi: Configurações → Apps → Lembra (ou Chrome) → Economia de bateria → Sem restrições. Ligue também “Início automático”.' : /samsung|sm-[a-z]\d/i.test(navigator.userAgent) ? 'Samsung: Configurações → Bateria → Limites de uso em segundo plano → tire o Lembra (ou o Chrome) de “Apps suspensos”.' : 'Android: Configurações → Apps → Lembra (ou Chrome) → Bateria → Sem restrições.');
export const faltaCheckup = () => nuvem() && typeof Notification !== 'undefined' && Notification.permission === 'granted' && store.profile?.checkup?.chegou !== true && Date.now() - (le('chk') || 0) > 3 * 864e5;
export async function checkup() {
  poe('chk', Date.now());
  const push = await import('./avisos.js'); let ok = true;
  try { await push.sendTest({ primeiro: true }); } catch { ok = false; }
  const grava = (c) => saveProfileQuiet({ checkup: { enviado: Date.now(), ...c } }).catch(() => {}); grava({ ...(store.profile?.checkup || {}), chegou: store.profile?.checkup?.chegou ?? null });
  const guia = `<h3>Vamos resolver</h3><ol class="chk__l">${/iPad|iPhone|iPod/.test(navigator.userAgent) ? '<li>No Safari, toque em Compartilhar.</li><li>Toque em Adicionar à Tela de Início.</li><li>Abra o Lembra pelo ícone e ative os avisos.</li>' : `<li>${esc(ANDROID())}</li><li>Confira se as notificações do Lembra estão ligadas.</li>`}</ol><button class="btn btn--primary btn--block" data-de-novo>Testar de novo</button><button class="btn btn--ghost btn--block" data-close>Agora não</button>`;
  return openSheet({ className: 'sheet--dialog', html: `<div class="dialog chk"><span class="chk__s">${sininho('feliz', { size: 104 })}</span><div data-c>${ok ? '<h3>Mandei um aviso. Chegou?</h3><button class="btn btn--primary btn--block" data-sim>Chegou!</button><button class="btn btn--soft btn--block" data-nao>Não chegou</button>' : guia}</div></div>`, onMount: (x) => {
    alive(); const q = (s) => x.el.querySelector(s), liga = () => { const d = q('[data-de-novo]'); if (d) d.onclick = () => { x.close(); poe('chk', 0); setTimeout(checkup, 300); }; };
    if (q('[data-sim]')) q('[data-sim]').onclick = () => { grava({ chegou: true }); x.close(); okFx({ title: 'Tudo certo!', sub: 'Seus avisos chegam' }); };
    if (q('[data-nao]')) q('[data-nao]').onclick = () => { grava({ chegou: false }); q('[data-c]').innerHTML = guia; liga(); };
    liga();
  } });
}
export const cartaoCheckup = () => (faltaCheckup() ? `<button class="cbar" data-action="checkup">${icon('bell', 22)}<span><b>Seus avisos estão chegando?</b><small>Teste em um toque</small></span>${icon('right', 18)}</button>` : '');

/* ---------- enquete ---------- */
export function contaAbertura() { poe('ab', (le('ab') || 0) + 1); }
const enq = () => store.profile?.intent2027 || {};
export function cartaoEnquete() {
  if (!nuvem() || store.profile?.teste || ehTeste({ email: store.user.email }) || !mostraEnquete({ teste: false, i: enq(), aberturas: le('ab') || 0, criada: Date.parse(store.user.metadata?.creationTime || '') || 0 }) || semNada()) return '';
  if (!enq().shownAt || Date.now() - (le('enqv') || 0) > 6e4) { poe('enqv', Date.now()); setTimeout(() => saveProfileQuiet({ intent2027: { ...enq(), shownAt: enq().shownAt || Date.now(), shownCount: (enq().shownCount || 0) + 1 } }).catch(() => {}), 1500); }
  return `<section class="enq"><button class="enq__x" data-action="enq" data-v="" aria-label="Agora não">${icon('x', 18)}</button><h3>Em 2027, o que você escolheria?</h3><div class="enq__b">${OPCOES.map(([k, l]) => `<button data-action="enq" data-v="${k}">${l}</button>`).join('')}</div><p>Em 2027 o Lembra continua tendo uma versão grátis. Os detalhes dos planos saem em dezembro.</p></section>`;
}
export async function respondeEnquete(v) {
  const i = enq(); if (i.choice) return;
  const novo = v ? { ...i, choice: v, at: Date.now() } : { ...i, dismissedAt: Date.now(), dismissals: (i.dismissals || 0) + 1 };
  store.profile = { ...store.profile, intent2027: novo }; window.__calRender && window.__calRender();
  try { await saveProfileQuiet({ intent2027: novo }); import('./stats.js').then((s) => s.reportStats({ force: true })); if (v) toast('Anotado. Obrigado! 🧡'); } catch { toast('Não consegui guardar agora.'); }
}

/* ---------- o que fica neste aparelho (primeira visita) ---------- */
export function avisoDados() {
  try { if (localStorage.getItem('lembra.dados')) return; } catch { return; }
  if (document.querySelector('.avdados')) return;
  const w = document.createElement('div'); w.className = 'avdados'; w.setAttribute('role', 'region'); w.setAttribute('aria-label', 'Dados neste aparelho');
  w.innerHTML = '<p>Guardamos seu login e suas preferências neste aparelho. Sem cookies de publicidade. <a href="privacidade/" target="_blank" rel="noopener">Privacidade</a></p><button>Entendi</button>';
  w.querySelector('button').onclick = () => { try { localStorage.setItem('lembra.dados', '1'); } catch { /* ok */ } w.remove(); };
  document.body.appendChild(w);
}

/* ---------- idade: só quando a pessoa entra na parte social ---------- */
export const idadeSabida = () => !nuvem() || ageOf(store.profile?.birth || '') !== null;
export const RESP = 'Um dos meus pais ou meu responsável legal autoriza o uso do Lembra e o tratamento dos meus dados, nos termos da Política de Privacidade.';
export function pedeIdade() {
  if (idadeSabida()) return Promise.resolve(true);
  return new Promise((ok) => { let deu = false; const s = openSheet({ className: 'sheet--dialog', onClose: () => ok(deu), html: `<div class="dialog idd"><h3>Qual é a sua data de nascimento?</h3><p>Serve para proteger quem tem menos de 18 anos. Ninguém vê.</p><input class="input" type="date" data-n min="1900-01-01" max="${todayKey()}" aria-label="Data de nascimento"><label class="idd__r" data-r hidden><input type="checkbox" data-ck><span>${RESP}</span></label><p class="ep__erro" data-e hidden></p><button class="btn btn--primary btn--block" data-ok disabled>Continuar</button><button class="btn btn--ghost btn--block" data-close>Agora não</button></div>`, onMount: (x) => {
    const q = (z) => x.el.querySelector(z), i = q('[data-n]'), ck = q('[data-ck]'), b = q('[data-ok]'), e = q('[data-e]');
    const ve = () => { const a = ageOf(i.value), men = a !== null && a >= 13 && a < 18, ruim = i.value && (a === null || a > 110 || i.value > todayKey()); q('[data-r]').hidden = !men; e.hidden = !(ruim || (a !== null && a < 13)); e.textContent = ruim ? 'Confira o dia, o mês e o ano.' : a !== null && a < 13 ? 'O Lembra é para maiores de 13 anos.' : ''; b.disabled = a === null || ruim || a < 13 || (men && !ck.checked); };
    i.oninput = i.onchange = ve; ck.onchange = ve;
    b.onclick = async () => { b.disabled = true; try { const a = ageOf(i.value); await saveUserProfile({ birth: i.value, ...(a < 18 ? { responsavelOk: { at: Date.now(), versao: CONFIG.termsVersion || '1.0' } } : {}) }); deu = true; s.close(); import('./friends.js').then((f) => f.publishCard()); } catch { e.hidden = false; e.textContent = 'Não consegui salvar agora.'; b.disabled = false; } };
  } }); });
}
export const vesteComeco = () => document.querySelectorAll('.prim__snh [data-snh]').forEach((e) => veste(e, roupa('agua')));
