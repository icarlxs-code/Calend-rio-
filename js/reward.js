/* Recompensa: cada coisa concluída dá um retorno na hora (vibração curta, faíscas e uma frase),
   a sequência de dias organizados cresce e o dia 100% concluído vira comemoração.
   Tudo calculado para incentivar o hábito — sem culpa, sem alarme falso. */
import { store } from './store.js';
import { todayKey, addDays } from './utils.js';
import { g } from './persona.js';
import { pop } from './sound.js';

const key = () => `lembra.streak.${store.user?.uid || store.me || 'x'}`;
const read = () => { try { return JSON.parse(localStorage.getItem(key()) || 'null') || { days: [], best: 0 }; } catch { return { days: [], best: 0 }; } };
const write = (s) => { try { localStorage.setItem(key(), JSON.stringify(s)); } catch { /* ok */ } };

/* dias seguidos com pelo menos uma coisa concluída (hoje ainda vale se ontem contou) */
export function streak() {
  const s = read();
  const set = new Set(s.days);
  let d = set.has(todayKey()) ? todayKey() : addDays(todayKey(), -1);
  let n = 0;
  while (set.has(d)) { n++; d = addDays(d, -1); }
  return { days: n, today: set.has(todayKey()), best: Math.max(s.best || 0, n) };
}
const MILESTONES = { 3: 'Três dias seguidos! O hábito está nascendo 🌱', 7: 'Uma semana inteira organizada! 🔥', 14: 'Duas semanas sem deixar nada escapar 💪', 21: '21 dias: isso já é hábito de verdade 🧠', 30: 'Um mês inteiro! Você é outra pessoa agora 🏆', 60: 'Dois meses seguidos. Lenda. 👑', 100: '100 dias! Ninguém te segura 🚀' };

const pr = () => store.profile?.pronoun;
const PRAISE = () => [
  'Mandou bem! ✓', 'Mais um riscado ✓', 'Isso! Um a menos na cabeça ✓', 'Feito. A mente agradece ✓',
  g('Você está imparável ✓', 'Você está imparável ✓', 'Ritmo imparável ✓', pr()),
  g('Organizado assim dá gosto ✓', 'Organizada assim dá gosto ✓', 'Organização que dá gosto ✓', pr()),
  'Check! Próximo ✓', 'Dia rendendo ✓',
];
let lastPraise = -1;
export function praise() {
  const list = PRAISE();
  let i = Math.floor(Math.random() * list.length);
  if (i === lastPraise) i = (i + 1) % list.length;
  lastPraise = i;
  return list[i];
}

/* Faíscas saindo do botão tocado (leve, some sozinha; respeita quem pediu menos animação) */
export function burst(el, { big = false } = {}) {
  if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const r = el.getBoundingClientRect ? el.getBoundingClientRect() : el; // elemento ou posição já medida
  if (!r || !r.width) return;
  const box = document.createElement('div');
  box.className = 'burst';
  box.style.left = `${r.left + r.width / 2}px`;
  box.style.top = `${r.top + r.height / 2}px`;
  const colors = ['#FF6B1A', '#FFB020', '#FFFFFF', '#FFC24A', '#E85A0C'];
  const n = big ? 26 : 12;
  for (let i = 0; i < n; i++) {
    const p = document.createElement('i');
    const a = (Math.PI * 2 * i) / n + Math.random() * 0.4;
    const d = (big ? 90 : 46) + Math.random() * (big ? 70 : 26);
    p.style.setProperty('--x', `${Math.cos(a) * d}px`);
    p.style.setProperty('--y', `${Math.sin(a) * d}px`);
    p.style.background = colors[i % colors.length];
    if (i % 2) { p.style.clipPath = 'polygon(50% 0,61% 39%,100% 50%,61% 61%,50% 100%,39% 61%,0 50%,39% 39%)'; p.style.borderRadius = '0'; p.style.scale = '1.6'; } // metade vira estrelinha de 4 pontas
    box.appendChild(p);
  }
  document.body.appendChild(box);
  setTimeout(() => box.remove(), 900);
}

/* Algo foi concluído: marca o dia, vibra, faísca e devolve a frase certa (marco de sequência, dia 100% ou elogio) */
export function onDone({ el = null, left = null } = {}) {
  const s = read();
  const t = todayKey();
  const before = streak().days;
  if (!s.days.includes(t)) { s.days = [...s.days.filter((d) => d >= addDays(t, -120)), t]; write(s); }
  const after = streak().days;
  if (after > (s.best || 0)) { s.best = after; write(s); }
  try { window.dispatchEvent(new Event('lembra:done')); } catch { /* ok */ }
  try { navigator.vibrate && navigator.vibrate(left === 0 ? [12, 40, 18] : 10); } catch { /* ok */ }
  pop(left === 0 || (after !== before && !!MILESTONES[after]));
  burst(el, { big: left === 0 || (after !== before && MILESTONES[after]) });
  if (after !== before && MILESTONES[after]) return MILESTONES[after];
  if (left === 0) return g('Dia 100% concluído! Pode descansar tranquilo 🏆', 'Dia 100% concluído! Pode descansar tranquila 🏆', 'Dia 100% concluído! Hora de descansar 🏆', pr());
  if (left === 1) return 'Falta só 1 para fechar o dia ✓';
  return praise();
}

/* Faixa de progresso do dia (Hoje e Pessoal) */
export function progressBar(done, total, { label = 'hoje' } = {}) {
  if (!total) return '';
  const st = streak();
  const pct = Math.round((done / total) * 100);
  const msg = done === total ? 'Tudo feito! 🏆' : done === 0 ? `Comece pelo mais fácil: ${total} ${label}` : `${done} de ${total} feitos · ${pct}%`;
  return `<div class="dayprog${done === total ? ' is-full' : ''}">
    <div class="dayprog__top"><b>${msg}</b>${st.days >= 2 ? `<span class="dayprog__streak" title="Dias seguidos">🔥 ${st.days} dias</span>` : ''}</div>
    <div class="dayprog__bar"><i style="width:${pct}%"></i></div>
  </div>`;
}
