/* PIN das conversas trancadas. Fica só neste aparelho, embaralhado (PBKDF2), por conta.
   Esqueceu: sair da conta e entrar de novo (quem entra prova que é a pessoa) libera criar outro. Nada é apagado. */
import { store } from './store.js';
import { openSheet, toast } from './components.js';
import { icon } from './icons.js';
import { esc } from './utils.js';
import { emite } from './social.js';

const K = () => `lembra.pin.${store.user?.uid || 'x'}`;
const entrou = () => store.user?.metadata?.lastSignInTime || '';
const le = () => { try { const o = JSON.parse(localStorage.getItem(K()) || 'null'); return o && o.h && o.e === entrou() ? o : null; } catch { return null; } };
const hex = (b) => [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, '0')).join('');
async function embaralha(pin, sal) { const k = await crypto.subtle.importKey('raw', new TextEncoder().encode(pin), 'PBKDF2', false, ['deriveBits']); return hex(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: new TextEncoder().encode(sal), iterations: 150000 }, k, 256)); }
let ate = 0, saiu = 0;
export const estaAberta = () => Date.now() < ate;
export const fechaTranca = () => { ate = 0; emite({ t: 'trancou' }); };
if (typeof document !== 'undefined') document.addEventListener('visibilitychange', () => { if (document.hidden) saiu = Date.now(); else if (ate && saiu && Date.now() - saiu > 15e3) fechaTranca(); });

/** resolve true quando o PIN está certo (ou acabou de ser criado) */
export function tranca(titulo = 'Digite o seu PIN') {
  if (estaAberta()) { ate = Date.now() + 10 * 60e3; return Promise.resolve(true); }
  if (!crypto?.subtle) { toast('Este navegador não consegue trancar conversas.'); return Promise.resolve(false); }
  return new Promise((ok) => {
    const reg = le(), cria = !reg; let passo = cria ? 1 : 0, primeiro = '', v = '', feito = false, ocupado = false;
    const s = openSheet({ className: 'sheet--solid sheet--pin', onClose: () => ok(feito), html: `<div class="pin"><button class="pin__x" data-close aria-label="Fechar">${icon('x', 22)}</button><span class="pin__ic">${icon('lock', 30)}</span><h3>${esc(titulo)}</h3><p data-sub></p><div class="pin__pts" aria-hidden="true">${'<i></i>'.repeat(4)}</div><p class="pin__erro" data-erro role="alert"></p>
      <div class="pin__tec">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `<button type="button" data-n="${n}">${n}</button>`).join('')}<span></span><button type="button" data-n="0">0</button><button type="button" data-ap aria-label="Apagar">${icon('left', 24)}</button></div>${cria ? '' : '<button type="button" class="btn-text pin__esq" data-esq>Esqueci o PIN</button>'}</div>`,
    onMount: (x) => {
      const q = (z) => x.el.querySelector(z), pinta = () => x.el.querySelectorAll('.pin__pts i').forEach((n, i) => n.classList.toggle('is-on', i < v.length));
      const sub = (t) => { q('[data-sub]').textContent = t; }, erro = (t) => { q('[data-erro]').textContent = t; v = ''; pinta(); if (t) { try { navigator.vibrate && navigator.vibrate([30, 40, 30]); } catch { /* ok */ } } };
      const bloq = () => { const o = le(); const f = o && o.ate ? o.ate - Date.now() : 0; return f > 0 ? Math.ceil(f / 1000) : 0; };
      sub(cria ? 'Crie um PIN de 4 números' : 'PIN de 4 números');
      const entra = () => { feito = true; ate = Date.now() + 10 * 60e3; s.close(); };
      const fim = async () => {
        ocupado = true;
        try {
          if (cria) {
            if (passo === 1) { if (/^(\d)\1{3}$/.test(v) || v === '1234') { erro('Escolha um PIN menos óbvio.'); return; } primeiro = v; passo = 2; v = ''; pinta(); sub('Repita o PIN'); return; }
            if (v !== primeiro) { passo = 1; primeiro = ''; sub('Crie um PIN de 4 números'); erro('Não ficou igual. Tente de novo.'); return; }
            const sal = hex(crypto.getRandomValues(new Uint8Array(16))); localStorage.setItem(K(), JSON.stringify({ sal, h: await embaralha(v, sal), e: entrou(), n: 0 })); entra(); return;
          }
          const f = bloq(); if (f) { erro(`Muitas tentativas. Espere ${f} s.`); return; }
          if ((await embaralha(v, reg.sal)) === reg.h) { localStorage.setItem(K(), JSON.stringify({ ...reg, n: 0, ate: 0 })); entra(); return; }
          const n = ((le() || reg).n || 0) + 1; localStorage.setItem(K(), JSON.stringify({ ...reg, n, ate: n >= 5 ? Date.now() + Math.min(3600e3, 30e3 * 2 ** (n - 5)) : 0 })); erro(n >= 5 ? `Muitas tentativas. Espere ${bloq()} s.` : 'PIN errado. Tente de novo.');
        } catch { erro('Não consegui guardar o PIN neste aparelho.'); } finally { ocupado = false; }
      };
      const poe = (n) => { if (ocupado || v.length >= 4) return; q('[data-erro]').textContent = ''; v += n; pinta(); if (v.length === 4) setTimeout(fim, 90); };
      x.el.querySelectorAll('[data-n]').forEach((b) => (b.onclick = () => poe(b.dataset.n))); q('[data-ap]').onclick = () => { v = v.slice(0, -1); pinta(); };
      x.panel.tabIndex = -1; x.panel.focus({ preventScroll: true }); x.panel.onkeydown = (e) => { if (/^\d$/.test(e.key)) poe(e.key); else if (e.key === 'Backspace') q('[data-ap]').click(); };
      const e = q('[data-esq]'); if (e) e.onclick = () => { sub('Saia da conta e entre de novo. Aí você cria outro PIN e as conversas continuam trancadas.'); };
    } });
  });
}
