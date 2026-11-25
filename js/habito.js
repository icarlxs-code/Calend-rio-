/* Aprende (só neste aparelho) quanto tempo depois do horário a pessoa costuma marcar como feito, por tipo de compromisso.
   Serve para a primeira cobrança não chegar antes da hora em que ela normalmente já resolveu. */
const K = 'lembra.habito';
const ler = () => { try { return JSON.parse(localStorage.getItem(K) || '{}'); } catch { return {}; } };
export function aprende(tipo, minutosDepois) {
  if (!tipo || !Number.isFinite(minutosDepois) || minutosDepois < -240 || minutosDepois > 480) return;
  const h = ler(); h[tipo] = [...(h[tipo] || []), Math.round(minutosDepois)].slice(-15);
  try { localStorage.setItem(K, JSON.stringify(h)); } catch { /* ok */ }
}
/** folga em minutos (0 a 45) antes da primeira cobrança; 0 enquanto não há pelo menos 4 exemplos */
export function folga(tipo) {
  const L = (ler()[tipo] || []).slice().sort((a, b) => a - b);
  if (L.length < 4) return 0;
  return Math.max(0, Math.min(45, L[Math.floor(L.length / 2)]));
}
