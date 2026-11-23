/* Cache no aparelho (por conta): o que já foi carregado aparece NA HORA na próxima vez (amigos, stories,
   visitas, ranking) e o app atualiza por trás. Cada pessoa tem o seu (pelo id da conta). */
import { store } from './store.js';
const chave = (n) => `lembra.c.${store.user?.uid || 'x'}.${n}`;
export function leCache(n, maxIdade = 7 * 864e5) {
  try { const o = JSON.parse(localStorage.getItem(chave(n)) || 'null'); return o && Date.now() - o.at < maxIdade ? o.v : null; } catch { return null; }
}
export function gravaCache(n, v, limite = 900000) {
  try { const s = JSON.stringify({ at: Date.now(), v }); if (s.length <= limite) localStorage.setItem(chave(n), s); } catch { /* cheio: tudo bem, só não guarda */ }
}
/* baixa e guarda os desenhos dos emblemas e brasões em segundo plano (abrem na hora depois) */
export async function aqueceEmblemas() {
  if (!('caches' in window) || window.__aqueceu) return; window.__aqueceu = 1;
  try {
    const { BADGES, badgeSrc, crestSrc } = await import('./badges.js');
    const urls = [...new Set([...BADGES.map((b) => badgeSrc(b)), ...Array.from({ length: 100 }, (_, i) => crestSrc(i + 1))])];
    const c = await caches.open('lembra-media-v1');
    let i = 0;
    const um = async () => { while (i < urls.length) { const u = urls[i++]; if (await c.match(u, { ignoreSearch: true })) continue; try { const r = await fetch(u); if (r.ok) await c.put(u, r); } catch { /* sem internet: depois */ } } };
    await Promise.all([um(), um(), um(), um()]);
  } catch { /* ok */ }
}
