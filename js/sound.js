/* Sons curtos e suaves (gerados na hora, sem arquivo): troca de modo e tarefa concluída.
   Respeitam o modo silencioso do iPhone e podem ser desligados em Ajustes → Aparência. */
const KEY = 'lembra.sound';
let ctx = null;
export const soundOn = () => { try { return localStorage.getItem(KEY) !== '0'; } catch { return true; } };
export const setSound = (on) => { try { localStorage.setItem(KEY, on ? '1' : '0'); } catch { /* ok */ } };

function audio() {
  if (!soundOn()) return null;
  try {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  } catch { return null; }
}
/* uma nota: ataque rápido e cauda suave (som de "vidro") */
function note(a, freq, at, dur = 0.42, gain = 0.07) {
  const o = a.createOscillator(), g = a.createGain(), o2 = a.createOscillator(), g2 = a.createGain();
  o.type = 'sine'; o.frequency.setValueAtTime(freq, at);
  o2.type = 'sine'; o2.frequency.setValueAtTime(freq * 2.01, at); // harmônico leve dá brilho
  g.gain.setValueAtTime(0.0001, at); g.gain.exponentialRampToValueAtTime(gain, at + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  g2.gain.setValueAtTime(0.0001, at); g2.gain.exponentialRampToValueAtTime(gain * 0.25, at + 0.01); g2.gain.exponentialRampToValueAtTime(0.0001, at + dur * 0.6);
  o.connect(g).connect(a.destination); o2.connect(g2).connect(a.destination);
  o.start(at); o2.start(at); o.stop(at + dur + 0.05); o2.stop(at + dur + 0.05);
}
/* Trabalho → Pessoal sobe (mais leve); Pessoal → Trabalho desce (mais firme) */
export function chime(space) {
  const a = audio();
  if (!a) return;
  const t = a.currentTime + 0.01;
  if (space === 'personal') { note(a, 783.99, t); note(a, 1174.66, t + 0.09); } // sol → ré
  else { note(a, 659.25, t); note(a, 493.88, t + 0.09); } // mi → si
}
/* concluiu algo: um "tic" curto e alegre */
export function pop(big = false) {
  const a = audio();
  if (!a) return;
  const t = a.currentTime + 0.01;
  note(a, 880, t, 0.22, 0.05);
  if (big) { note(a, 1108.73, t + 0.08, 0.26, 0.05); note(a, 1318.51, t + 0.16, 0.34, 0.05); }
}

/* o iPhone só libera som depois de um toque: destrava no 1º toque em qualquer lugar */
if (typeof document !== 'undefined') {
  const unlock = () => { audio(); document.removeEventListener('pointerdown', unlock, true); document.removeEventListener('touchend', unlock, true); };
  document.addEventListener('pointerdown', unlock, true);
  document.addEventListener('touchend', unlock, true);
}
/* "subindo": batidinhas cada vez mais agudas acompanhando uma barra que enche (mesma curva da animação),
   e um acorde no final. ms = duração da subida. */
export function rise(ms = 2000, steps = 24) {
  const a = audio();
  if (!a) return;
  const t0 = a.currentTime + 0.03;
  for (let i = 1; i <= steps; i++) {
    const p = i / steps;
    const t = 1 - Math.cbrt(1 - p); // inversa da curva easeOutCubic usada no círculo
    note(a, 330 * Math.pow(3, p), t0 + t * (ms / 1000), 0.09, 0.03 + p * 0.02);
  }
  const end = t0 + ms / 1000 + 0.05;
  note(a, 783.99, end, 0.6, 0.06); note(a, 987.77, end + 0.07, 0.6, 0.06); note(a, 1174.66, end + 0.14, 0.9, 0.07);
}
/* virar a página de uma conquista: um "tic" curtinho */
export function tick(up = 0) {
  const a = audio();
  if (!a) return;
  note(a, 660 * Math.pow(1.12, up), a.currentTime + 0.01, 0.16, 0.04);
}

/* nota macia (sino abafado): ataque lento, cauda longa e um filtro que tira o "brilho" agressivo */
function soft(a, freq, at, dur = 1.1, gain = 0.05) {
  const o = a.createOscillator(), o2 = a.createOscillator(), g = a.createGain(), g2 = a.createGain(), f = a.createBiquadFilter();
  f.type = 'lowpass'; f.frequency.setValueAtTime(2600, at); f.Q.value = 0.4;
  o.type = 'sine'; o.frequency.setValueAtTime(freq, at);
  o2.type = 'triangle'; o2.frequency.setValueAtTime(freq * 2, at);
  g.gain.setValueAtTime(0.0001, at); g.gain.exponentialRampToValueAtTime(gain, at + 0.03); g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  g2.gain.setValueAtTime(0.0001, at); g2.gain.exponentialRampToValueAtTime(gain * 0.12, at + 0.025); g2.gain.exponentialRampToValueAtTime(0.0001, at + dur * 0.5);
  o.connect(g).connect(f); o2.connect(g2).connect(f); f.connect(a.destination);
  o.start(at); o2.start(at); o.stop(at + dur + 0.05); o2.stop(at + dur + 0.05);
}
/* compromisso marcado: "dlin-dlom" calmo e tranquilo (~1,2s) */
export function softOk() {
  const a = audio();
  if (!a) return;
  const t = a.currentTime + 0.02;
  soft(a, 523.25, t, 1.25, 0.022);      // dó (corpo, bem baixinho)
  soft(a, 783.99, t + 0.01, 0.9, 0.045); // sol
  soft(a, 1046.5, t + 0.16, 1.15, 0.04); // dó agudo
}
/* emblema desbloqueado: arpejo brilhante e um acorde que brilha no fim */
export function fanfare() {
  const a = audio();
  if (!a) return;
  const t = a.currentTime + 0.03;
  [1046.5, 1318.51, 1567.98, 2093].forEach((f, i) => note(a, f, t + i * 0.075, 0.32, 0.045));
  [1046.5, 1318.51, 1567.98].forEach((f) => soft(a, f, t + 0.34, 1.3, 0.03));
}
/* subiu de nível: escada subindo + acorde maior aberto, mais longo */
export function levelUp() {
  const a = audio();
  if (!a) return;
  const t = a.currentTime + 0.03;
  [392, 523.25, 659.25, 783.99, 1046.5, 1318.51].forEach((f, i) => note(a, f, t + i * 0.06, 0.26, 0.04));
  [523.25, 659.25, 783.99, 1046.5].forEach((f) => soft(a, f, t + 0.42, 1.8, 0.03));
}
