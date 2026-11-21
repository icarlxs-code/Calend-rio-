/* "Marcado!": confirmação ao lançar um compromisso.
   Um círculo se desenha, o ✓ aparece, um som calmo toca e tudo some sozinho em ~1,5s.
   Não bloqueia a tela (dá para continuar tocando) e respeita "reduzir movimento" do celular.
   O símbolo do Lembra aparece junto: a marca fica ligada à sensação de "resolvido" (memória de marca). */
import { brand } from './brand.js';
import { esc } from './utils.js';

let timer = null;
export function okFx({ title = 'Marcado!', sub = '', sound = true } = {}) {
  if (typeof document === 'undefined') return;
  document.querySelectorAll('.okfx').forEach((x) => x.remove());
  clearTimeout(timer);
  const el = document.createElement('div');
  el.className = 'okfx';
  el.setAttribute('role', 'status');
  el.innerHTML = `<div class="okfx__card">
      <svg class="okfx__ring" viewBox="0 0 120 120" aria-hidden="true">
        <circle class="okfx__halo" cx="60" cy="60" r="50"/>
        <circle class="okfx__track" cx="60" cy="60" r="46"/>
        <circle class="okfx__prog" cx="60" cy="60" r="46"/>
        <path class="okfx__check" d="M40 61.5 54 75 81 46"/>
      </svg>
      <b class="okfx__t">${esc(title)}</b>${sub ? `<small class="okfx__s">${esc(sub)}</small>` : ''}
      <span class="okfx__brand">${brand('simbolo', { h: 18 })}</span>
    </div>`;
  document.body.appendChild(el);
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('is-in')));
  if (sound) import('./sound.js').then((s) => s.softOk()).catch(() => {});
  try { navigator.vibrate && navigator.vibrate(12); } catch { /* ok */ }
  const close = () => { el.classList.add('is-out'); setTimeout(() => el.remove(), 420); };
  timer = setTimeout(close, 1500);
  el.addEventListener('click', () => { clearTimeout(timer); close(); });
}
