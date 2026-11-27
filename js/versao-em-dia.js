/* O aparelho da pessoa está na versão publicada agora?
   O número (2.32.0) ficou igual em várias publicações seguidas, então número igual NÃO quer dizer em dia:
   em dia é ter o mesmo build (impressão digital do arquivo) ou um número maior que o publicado. */
export function cmpV(a, b) {
  const A = String(a || '0').split('.').map((x) => parseInt(x, 10) || 0), B = String(b || '0').split('.').map((x) => parseInt(x, 10) || 0);
  for (let i = 0; i < 3; i++) if ((A[i] || 0) !== (B[i] || 0)) return (A[i] || 0) > (B[i] || 0) ? 1 : -1;
  return 0;
}
export function emDia(app, latest) {
  if (!app) return false;
  if (!latest) return true; // sem saber a última, não acusa ninguém
  if (app.b && latest.build && app.b === latest.build) return true;
  return cmpV(app.v, latest.version) > 0;
}
