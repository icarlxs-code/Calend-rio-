/* Tela da ofensiva: a pessoa concluiu o 1º lembrete do dia ou bateu um marco (3, 7, 30… dias).
   O Lembra (vivo, a 60 quadros) se prepara, salta, a chama acende atrás dele, o número vira e a semana ganha o fogo de hoje. */
import { sininho, alive, act, setMood, vivo, rigOf } from './sininho.js';
import { esc } from './utils.js';

/* ofensiva fica mais rica com o tempo: cada nível muda a aura, o brilho e os enfeites em volta do Lembra */
export const TIERS = [
  { from: 0, id: 't0', nome: 'Chama acesa' }, { from: 7, id: 't1', nome: 'Pegando fogo' }, { from: 30, id: 't2', nome: 'Chama dourada' },
  { from: 100, id: 't3', nome: 'Coroa de fogo' }, { from: 365, id: 't4', nome: 'Diamante' }, { from: 1000, id: 't5', nome: 'Lenda eterna' },
];
export const tierOf = (d) => [...TIERS].reverse().find((t) => d >= t.from);
const enfeite = (d) => { const t = tierOf(d).id; return `<span class="stkx stkx--${t}" aria-hidden="true"><i class="stkx__aura"></i><i class="stkx__rays"></i>${t >= 't3' ? '<i class="stkx__crown"></i>' : ''}${t >= 't2' ? '<i class="stkx__sp"></i><i class="stkx__sp"></i><i class="stkx__sp"></i><i class="stkx__sp"></i>' : ''}</span>`; };
const MARCOS = {
  1: ['Sua chama acendeu!', 'Primeiro dia. Amanhã ela já fica maior.'],
  2: ['Dois dias seguidos!', 'Voltou! Tô muito feliz de te ver aqui de novo.'],
  3: ['3 dias seguidos!', 'Começou a virar hábito. Não para agora!'],
  4: ['Quatro dias!', 'Olha o tamanho dessa chama. É você que fez.'],
  5: ['Cinco dias!', 'Mão cheia de dias cumpridos. Que orgulho!'],
  6: ['Seis dias!', 'Amanhã fecha a semana inteira. Tô contando as horas!'],
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

/* chama desenhada: três camadas que balançam em tempos diferentes (só transform) */
const CHAMA = `<svg class="stkf" viewBox="0 0 200 240" aria-hidden="true"><path class="stkf__a" d="M100 6C112 52 172 84 172 150c0 46-32 82-72 82s-72-36-72-82c0-30 14-52 30-70 2 20 10 32 22 36-4-44 6-82 20-110Z" fill="var(--f1)"/><path class="stkf__b" d="M102 74c8 30 42 50 42 92 0 34-20 60-44 60s-44-26-44-60c0-20 8-34 18-46 2 14 8 22 16 24-2-28 4-50 12-70Z" fill="var(--f2)"/><path class="stkf__c" d="M101 96c8 26 47 48 47 92 0 28-20 42-47 42s-47-14-47-42c0-18 9-32 20-44 3 12 10 18 17 20-1-24 3-46 10-68Z" fill="var(--f3)"/></svg>`;
const GESTO = { 1: 'vibra', 2: 'soco', 3: 'vibra', 4: 'balanca', 5: 'soco', 6: 'orgulho' };
export const preloadStreak = () => { alive(); import('./sound.js').catch(() => {}); };

export async function showStreak(days = 1, tries = 0) {
  if (!days || document.querySelector('.stk')) return;
  // espera outras telas cheias (conquista, planos…) saírem — no máx. 8 tentativas
  if (document.querySelector('.gx, .paywall, .ficha, .photogate, .avgate, .okfx, .spaceveil')) { if (tries < 8) setTimeout(() => showStreak(days, tries + 1), 1200); return; }
  const snd = import('./sound.js').catch(() => null);
  const marco = MARCOS[days], grande = days >= 7 && !!marco, T = tierOf(days), prox = TIERS.find((t) => t.from > days);
  const [title, sub] = marco || [pick(NORMAL), `${days} dias seguidos concluindo. Amanhã eu te espero aqui!`];
  const week = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); return { l: 'DSTQQSS'[d.getDay()], on: 6 - i < days, today: i === 6 }; });
  const el = document.createElement('div');
  el.className = `stk stk--${T.id}${grande ? ' stk--marco' : ''}`;
  el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true');
  el.setAttribute('aria-label', `${days} ${days === 1 ? 'dia' : 'dias'} de ofensiva`);
  el.innerHTML = `<div class="stk__glow"></div>
    <div class="stk__card">
      <button class="stk__anim" aria-label="Ver de novo">${enfeite(days)}<span class="stk__fogo">${CHAMA}</span><span class="stk__snh">${sininho('acena', { size: 172 })}</span></button>
      <div class="stk__num"><span class="stk__roda"><b class="stk__de">${Math.max(0, days - 1)}</b><b class="stk__para" data-n>${days}</b></span><span>${days === 1 ? 'dia' : 'dias'} de ofensiva</span></div>
      <h2 class="stk__title">${esc(title)}</h2>
      <p class="stk__sub">${esc(sub)}</p>
      <div class="stk__week">${week.map((w) => `<span class="${w.on && !w.today ? 'era' : ''}${w.today ? ' is-today' : ''}"><i></i><small>${w.l}</small></span>`).join('')}</div>
      ${prox ? `<div class="stk__meta"><i><b style="width:${Math.round(((days - T.from) / (prox.from - T.from)) * 100)}%"></b></i><small>${prox.from - days === 1 ? 'Falta 1 dia' : `Faltam ${prox.from - days} dias`} para <b>${esc(prox.nome)}</b></small></div>` : ''}
      <button class="btn stk__go" data-ok>Continuar</button>
    </div>`;
  document.body.appendChild(el);
  alive();
  const q = (x) => el.querySelector(x), fig = q('.stk__snh [data-snh]'), fogo = q('.stk__fogo');
  const an = (n, k, o) => n && n.animate(k, { easing: 'cubic-bezier(.16,1,.3,1)', fill: 'both', ...o });
  let rodada = 0;
  const pronta = () => { fogo.classList.add('is-on'); q('.stk__roda').classList.add('is-novo'); el.querySelectorAll('.stk__week .era, .stk__week .is-today').forEach((x) => x.classList.add('is-on')); };
  const play = () => {
    const eu = ++rodada, em = (ms, fn) => setTimeout(() => { if (eu === rodada && el.isConnected) fn(); }, ms);
    if (calm()) { pronta(); setMood(fig, 'feliz'); snd.then((s) => s && s.achievement()).catch(() => {}); return; }
    fogo.classList.remove('is-on'); q('.stk__roda').classList.remove('is-novo'); el.querySelectorAll('.stk__week .is-on').forEach((x) => x.classList.remove('is-on'));
    [['.stk__num', 0], ['.stk__week', 80], ['.stk__meta', 140], ['.stk__go', 200]].forEach(([c, d]) => an(q(c), [{ transform: 'translateY(18px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 460, delay: 120 + d }));
    ['.stk__title', '.stk__sub'].forEach((c, i) => an(q(c), [{ transform: 'translateY(14px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 460, delay: 1120 + i * 90 }));
    an(q('.stk__snh'), [{ transform: 'translateY(90px) scale(.7)', opacity: 0 }, { transform: 'translateY(-10px) scale(1.02)', opacity: 1, offset: 0.6 }, { transform: 'none', opacity: 1 }], { duration: 620, delay: 80 });
    el.querySelectorAll('.stk__week .era').forEach((x, i) => em(360 + i * 70, () => { x.classList.add('is-on'); snd.then((s) => s && s.tick(i)).catch(() => {}); }));
    em(620, () => { setMood(fig, 'feliz'); act(fig, 'pulo', { alto: true }); });
    em(1040, () => { // pousou: a chama acende
      fogo.classList.add('is-on');
      an(fogo, [{ transform: 'scale(.1,.05)', opacity: 0 }, { transform: 'scale(1.16,1.22)', opacity: 1, offset: 0.45 }, { transform: 'scale(.95,.93)', opacity: 1, offset: 0.7 }, { transform: 'none', opacity: 1 }], { duration: 820 });
      an(q('.stk__glow'), [{ transform: 'scale(.4)', opacity: 0 }, { transform: 'scale(1.25)', opacity: 1, offset: 0.5 }, { transform: 'none', opacity: 1 }], { duration: 900, fill: 'none' });
      q('.stk__roda').classList.add('is-novo'); q('.stk__week .is-today')?.classList.add('is-on');
      try { navigator.vibrate && navigator.vibrate(grande ? [20, 50, 30, 50, 60] : [16, 50, 24]); } catch { /* ok */ }
      snd.then((s) => s && s.chama(days, grande)).catch(() => {});
      if (window.__motion) window.__motion.chuva(grande ? 44 : Math.min(26, 8 + days * 2), fogo, true);
    });
    em(1420, () => act(fig, grande ? 'vibra' : GESTO[days] || pick(['vibra', 'soco', 'orgulho', 'balanca']), { alto: grande }));
    em(4200, () => vivo(fig, { gestos: ['orgulho', 'pisca', 'soco', 'balanca', 'riso'], cada: [3.2, 5.5] }));
  };
  requestAnimationFrame(() => { el.classList.add('is-in'); play(); });
  q('.stk__anim').onclick = play;
  const esc2 = (ev) => { if (ev.key === 'Escape') close(); };
  const close = () => { rodada++; document.removeEventListener('keydown', esc2); el.classList.remove('is-in'); el.classList.add('is-out'); setTimeout(() => el.remove(), 320); };
  q('[data-ok]').onclick = close;
  document.addEventListener('keydown', esc2);
  setTimeout(() => q('[data-ok]')?.focus({ preventScroll: true }), 60);
}
