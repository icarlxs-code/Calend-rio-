/* Tela da ofensiva (estilo Duolingo): a pessoa concluiu o 1º lembrete do dia ou bateu um marco (3, 7, 30… dias).
   Toca a animação desenhada do Sininho (60 quadros: pula, a chama aparece, ele abraça a chama e acena),
   o número de dias sobe contando quando a chama acende e a semana ganha o fogo de hoje. */
import { esc } from './utils.js';

const SHEET = 'assets/mascot/ofensiva.webp';
const COLS = 10, ROWS = 6, FRAMES = 60, FPS = 30, FLAME_AT = 12;
const MARCOS = {
  3: ['3 dias seguidos!', 'Começou a virar hábito. Não para agora!'],
  7: ['Uma semana inteira!', 'Sete dias sem esquecer nada importante. Que orgulho!'],
  14: ['Duas semanas!', 'Você está construindo uma rotina de verdade.'],
  30: ['Um mês de ofensiva!', '30 dias seguidos. Isso é disciplina de campeão.'],
  60: ['60 dias!', 'Dois meses lembrando de tudo. Lendário.'],
  100: ['100 dias!', 'Você entrou para o clube dos 100. Poucos chegam aqui.'],
  365: ['Um ano inteiro!', '365 dias seguidos. Não temos palavras.'],
};
const NORMAL = ['Ofensiva mantida!', 'Mais um dia na conta!', 'A chama continua acesa!'];
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const calm = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

let img = null;
const load = () => img || (img = new Promise((res) => { const i = new Image(); i.onload = () => res(true); i.onerror = () => res(false); i.src = SHEET; }));
export const preloadStreak = () => load();

export async function showStreak(days = 1) {
  if (!days || document.querySelector('.stk')) return;
  // espera outras telas cheias (conquista, planos…) saírem
  if (document.querySelector('.gx, .paywall, .ficha, .photogate, .okfx')) { setTimeout(() => showStreak(days), 1200); return; }
  if (!(await load())) return;
  const marco = MARCOS[days];
  const [title, sub] = marco || [pick(NORMAL), days === 1 ? 'Primeiro dia da sua ofensiva. Volte amanhã para ela crescer!' : `Você concluiu algo ${days} dias seguidos. Volte amanhã para não perder!`];
  const week = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); return { l: 'DSTQQSS'[d.getDay()], on: 6 - i < days, today: i === 6 }; });
  const el = document.createElement('div');
  el.className = `stk${marco ? ' stk--marco' : ''}`;
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-label', `${days} ${days === 1 ? 'dia' : 'dias'} de ofensiva`);
  el.innerHTML = `<div class="stk__glow"></div>
    <div class="stk__card">
      <button class="stk__anim" aria-label="Ver de novo"><span class="stk__spr"></span></button>
      <div class="stk__num"><b data-n>${Math.max(0, days - 1)}</b><span>${days === 1 ? 'dia' : 'dias'} de ofensiva</span></div>
      <h2 class="stk__title">${esc(title)}</h2>
      <p class="stk__sub">${esc(sub)}</p>
      <div class="stk__week">${week.map((w) => `<span class="${w.on && !w.today ? 'is-on' : ''}${w.today ? ' is-today' : ''}"><i></i><small>${w.l}</small></span>`).join('')}</div>
      <button class="btn stk__go" data-ok>Continuar</button>
    </div>`;
  document.body.appendChild(el);
  const spr = el.querySelector('.stk__spr'), num = el.querySelector('[data-n]');
  const frame = (f) => { spr.style.backgroundPosition = `${((f % COLS) / (COLS - 1)) * 100}% ${(Math.floor(f / COLS) / (ROWS - 1)) * 100}%`; };
  let raf = 0, lit = false;
  const light = () => {
    if (lit) return; lit = true;
    num.textContent = days; num.parentElement.classList.add('is-pop');
    el.querySelector('.stk__week .is-today')?.classList.add('is-on');
    try { navigator.vibrate && navigator.vibrate([16, 50, 24]); } catch { /* ok */ }
    import('./sound.js').then((s) => (marco ? s.levelUp() : s.achievement())).catch(() => {});
  };
  const play = () => {
    cancelAnimationFrame(raf);
    if (calm()) { frame(FRAMES - 1); light(); return; }
    const t0 = performance.now();
    const step = (t) => {
      const f = Math.min(FRAMES - 1, Math.floor(((t - t0) / 1000) * FPS));
      frame(f);
      if (f >= FLAME_AT) light();
      if (f < FRAMES - 1) raf = requestAnimationFrame(step);
      else spr.parentElement.classList.add('is-idle');
    };
    spr.parentElement.classList.remove('is-idle');
    raf = requestAnimationFrame(step);
  };
  frame(0);
  requestAnimationFrame(() => { el.classList.add('is-in'); setTimeout(play, 280); });
  el.querySelector('.stk__anim').onclick = play;
  const close = () => { cancelAnimationFrame(raf); el.classList.remove('is-in'); el.classList.add('is-out'); setTimeout(() => el.remove(), 320); };
  el.querySelector('[data-ok]').onclick = close;
}
