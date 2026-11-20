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
