/* Tem internet de verdade? (o celular diz "conectado" mesmo com o Wi-Fi sem internet, então conferimos)
   Mostra a faixa discreta e avisa quando a rede volta. */
export const SEM_REDE = 'Isso precisa de internet. Sua agenda continua aqui.';
let fora = false, t = 0, conferindo = null; const ouvintes = new Set();
export const semRede = () => fora;
export const aoVoltarRede = (f) => { ouvintes.add(f); return () => ouvintes.delete(f); };
function pinta() {
  document.documentElement.classList.toggle('is-semnet', fora);
  let f = document.querySelector('.semnet');
  if (!fora) { f?.remove(); return; }
  if (!f && document.getElementById('view')) { f = document.createElement('div'); f.className = 'semnet'; f.setAttribute('role', 'status'); f.textContent = 'Sem internet: mostrando sua agenda salva.'; document.body.appendChild(f); }
}
function muda(v) { const era = fora; fora = v; pinta(); if (era && !v) ouvintes.forEach((f) => { try { f(); } catch (e) { console.warn('rede', e); } }); clearTimeout(t); if (v) t = setTimeout(confere, 12e3); }
export function confere() {
  return (conferindo ||= (async () => {
    if (navigator.onLine === false) { muda(true); return false; }
    const c = new AbortController(), x = setTimeout(() => c.abort(), 5000);
    try { const r = await fetch(`version.json?ping=${Date.now()}`, { cache: 'no-store', signal: c.signal }); muda(!r.ok); return r.ok; } catch { muda(true); return false; } finally { clearTimeout(x); }
  })().finally(() => { conferindo = null; }));
}
export function ligaRede() {
  if (location.protocol === 'file:') return;
  addEventListener('online', confere); addEventListener('offline', () => muda(true));
  document.addEventListener('visibilitychange', () => { if (!document.hidden) confere(); });
  confere(); setInterval(() => { if (!document.hidden && !fora) confere(); }, 120e3);
}
export const repintaRede = () => pinta();
