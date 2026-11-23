/* Tela da ofensiva (estilo Duolingo): a pessoa concluiu o 1º lembrete do dia ou bateu um marco (3, 7, 30… dias).
   Toca a animação desenhada do Sininho (60 quadros: pula, a chama aparece, ele abraça a chama e acena),
   o número de dias sobe contando quando a chama acende e a semana ganha o fogo de hoje. */
import { esc } from './utils.js';

const SHEET = 'assets/mascot/ofensiva.webp';
/* folha com os 60 quadros desenhados (10 × 6, cada quadro 377 × 400); toca a 60 fps, 1 quadro por atualização de tela */
const COLS = 10, FW = 377, FH = 400, FRAMES = 60, FLAME_AT = 44; // 44: ele abraça a chama — é aí que o número sobe
/* os 60 desenhos são poses-chave (muito diferentes entre si): tocar 1 por atualização de tela deixava tudo em 1 s,
   acelerado e fora de sincronia. Agora: ~23 poses por segundo (2,6 s no total) com uma fusão curta entre uma pose
   e a seguinte, então o movimento fica contínuo a 60/120 fps sem pular. */
const DUR = 2.6;
/* ofensiva fica mais rica com o tempo: cada nível muda a aura, o brilho e os enfeites em volta do Lembra */
export const TIERS = [
  { from: 0, id: 't0', nome: 'Chama acesa' }, { from: 7, id: 't1', nome: 'Pegando fogo' }, { from: 30, id: 't2', nome: 'Chama dourada' },
  { from: 100, id: 't3', nome: 'Coroa de fogo' }, { from: 365, id: 't4', nome: 'Diamante' }, { from: 1000, id: 't5', nome: 'Lenda eterna' },
];
export const tierOf = (d) => [...TIERS].reverse().find((t) => d >= t.from);
const enfeite = (d) => { const t = tierOf(d).id; return `<span class="stkx stkx--${t}" aria-hidden="true"><i class="stkx__aura"></i><i class="stkx__rays"></i>${t >= 't3' ? '<i class="stkx__crown"></i>' : ''}${t >= 't2' ? '<i class="stkx__sp"></i><i class="stkx__sp"></i><i class="stkx__sp"></i><i class="stkx__sp"></i>' : ''}</span>`; };
const MARCOS = {
  3: ['3 dias seguidos!', 'Começou a virar hábito. Não para agora!'],
  7: ['Uma semana inteira!', 'Sete dias sem esquecer nada importante. Que orgulho!'],
  14: ['Duas semanas!', 'Você está construindo uma rotina de verdade.'],
  30: ['Um mês de ofensiva!', '30 dias seguidos. Isso é disciplina de campeão.'],
  60: ['60 dias!', 'Dois meses lembrando de tudo. Lendário.'],
  100: ['100 dias!', 'Você entrou para o clube dos 100. Poucos chegam aqui.'],
  365: ['Um ano inteiro!', '365 dias seguidos. Não temos palavras.'],
  500: ['500 dias!', 'Meio milhar de dias sem falhar. Você é diamante.'],
  1000: ['MIL DIAS!', 'Lenda eterna do Lembra. Pouquíssimas pessoas no mundo chegam aqui.'],
};
const NORMAL = ['Ofensiva mantida!', 'Mais um dia na conta!', 'A chama continua acesa!'];
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const calm = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

let img = null, sheet = null;
/* baixa e DECODIFICA antes de mostrar: nenhum quadro engasga na primeira vez */
const load = () => img || (img = new Promise((res) => {
  const i = new Image(); i.src = SHEET;
  (i.decode ? i.decode() : new Promise((ok, no) => { i.onload = ok; i.onerror = no; })).then(() => {
    sheet = i;
    // "aquece": desenha uma vez fora da tela para a imagem já estar pronta na placa de vídeo
    try { const c = document.createElement('canvas'); c.width = c.height = 2; c.getContext('2d').drawImage(i, 0, 0, 2, 2); } catch { /* ok */ }
    res(true);
  }).catch(() => res(false));
}));
export const preloadStreak = () => load();

export async function showStreak(days = 1) {
  if (!days || document.querySelector('.stk')) return;
  // espera outras telas cheias (conquista, planos…) saírem
  if (document.querySelector('.gx, .paywall, .ficha, .photogate, .okfx')) { setTimeout(() => showStreak(days), 1200); return; }
  const snd = import('./sound.js').catch(() => null); // carrega o som ANTES (não engasga quando a chama acende)
  if (!(await load())) return;
  const marco = MARCOS[days];
  const [title, sub] = marco || [pick(NORMAL), days === 1 ? 'Primeiro dia da sua ofensiva. Volte amanhã para ela crescer!' : `Você concluiu algo ${days} dias seguidos. Volte amanhã para não perder!`];
  const week = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); return { l: 'DSTQQSS'[d.getDay()], on: 6 - i < days, today: i === 6 }; });
  const el = document.createElement('div');
  el.className = `stk stk--${tierOf(days).id}${marco ? ' stk--marco' : ''}`;
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-label', `${days} ${days === 1 ? 'dia' : 'dias'} de ofensiva`);
  el.innerHTML = `<div class="stk__glow"></div>
    <div class="stk__card">
      <button class="stk__anim" aria-label="Ver de novo">${enfeite(days)}<canvas class="stk__spr"></canvas></button>
      <div class="stk__num"><b data-n>${Math.max(0, days - 1)}</b><span>${days === 1 ? 'dia' : 'dias'} de ofensiva</span></div>
      <h2 class="stk__title">${esc(title)}</h2>
      <p class="stk__sub">${esc(sub)}</p>
      <div class="stk__week">${week.map((w) => `<span class="${w.on && !w.today ? 'is-on' : ''}${w.today ? ' is-today' : ''}"><i></i><small>${w.l}</small></span>`).join('')}</div>
      <button class="btn stk__go" data-ok>Continuar</button>
    </div>`;
  document.body.appendChild(el);
  const spr = el.querySelector('.stk__spr'), num = el.querySelector('[data-n]');
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  spr.width = Math.round(236 * dpr); spr.height = Math.round(250 * dpr);
  const ctx = spr.getContext('2d');
  ctx.imageSmoothingQuality = 'high';
  let shown = -1;
  const pose = (f, a) => { ctx.globalAlpha = a; ctx.drawImage(sheet, (f % COLS) * FW, Math.floor(f / COLS) * FH, FW, FH, 0, 0, spr.width, spr.height); };
  /* x: posição contínua na folha (0…59). Segura cada pose e só funde nos últimos 35% do tempo dela */
  const frame = (x) => {
    const f = Math.min(FRAMES - 1, Math.floor(x)), k = x - f, mix = f < FRAMES - 1 ? Math.max(0, (k - 0.65) / 0.35) : 0;
    const key = f + mix.toFixed(2); if (key === shown) return; shown = key;
    ctx.clearRect(0, 0, spr.width, spr.height);
    pose(f, 1); if (mix > 0) pose(f + 1, mix * mix * (3 - 2 * mix));
    ctx.globalAlpha = 1;
  };
  let raf = 0, lit = false;
  const light = () => {
    if (lit) return; lit = true;
    num.textContent = days; num.parentElement.classList.add('is-pop');
    el.querySelector('.stk__week .is-today')?.classList.add('is-on');
    try { navigator.vibrate && navigator.vibrate([16, 50, 24]); } catch { /* ok */ }
    snd.then((s) => s && (marco ? s.levelUp() : s.achievement())).catch(() => {});
  };
  const play = () => {
    cancelAnimationFrame(raf);
    if (calm()) { frame(FRAMES - 1); light(); return; }
    let t0 = 0;
    const step = (t) => {
      if (!t0) t0 = t;
      const x = Math.min(FRAMES - 1, ((t - t0) / 1000 / DUR) * (FRAMES - 1));
      frame(x);
      if (x >= FLAME_AT) light();
      if (x < FRAMES - 1) raf = requestAnimationFrame(step);
      else spr.parentElement.classList.add('is-idle');
    };
    spr.parentElement.classList.remove('is-idle');
    shown = -1;
    raf = requestAnimationFrame(step);
  };
  frame(0);
  requestAnimationFrame(() => { el.classList.add('is-in'); setTimeout(play, 280); });
  el.querySelector('.stk__anim').onclick = play;
  const close = () => { cancelAnimationFrame(raf); el.classList.remove('is-in'); el.classList.add('is-out'); setTimeout(() => el.remove(), 320); };
  el.querySelector('[data-ok]').onclick = close;
}
