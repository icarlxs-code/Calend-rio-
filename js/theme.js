/* Aparência: tema (Automático / Claro / Escuro) e a cor de cada área de trabalho.
   Médico/saúde: branco limpo com azul-petróleo; obra: laranja; militar: verde-oliva; jurídico: azul-marinho… */
import { WORK } from './constants.js';

const LS = 'lembra.theme';
export const THEMES = [
  { id: 'auto', label: 'Automático', hint: 'segue o celular' },
  { id: 'light', label: 'Claro', hint: 'sempre claro' },
  { id: 'dark', label: 'Escuro', hint: 'modo noturno' },
];
export const themePref = () => { try { return localStorage.getItem(LS) || 'auto'; } catch { return 'auto'; } };
export function applyThemePref() {
  const v = themePref();
  if (v === 'light' || v === 'dark') document.documentElement.dataset.theme = v;
  else delete document.documentElement.dataset.theme;
}
export function setThemePref(v) {
  try { if (v === 'light' || v === 'dark') localStorage.setItem(LS, v); else localStorage.removeItem(LS); } catch { /* ok */ }
  applyThemePref();
}
export const isDark = () => {
  const v = themePref();
  return v === 'dark' || (v === 'auto' && typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: dark)').matches);
};

const rgba = (hex, a) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};
/* Cor da área no modo Trabalho (o modo Pessoal tem a própria cara) */
export function applyProfTheme() {
  let el = document.getElementById('proftheme');
  const t = WORK.theme;
  if (!t) { if (el) el.textContent = ''; return; }
  if (!el) { el = document.createElement('style'); el.id = 'proftheme'; document.head.appendChild(el); }
  const light = `--ink:${t.accent};--ink-on:#FFFFFF;--bg:${t.bg};--blur-bg:${rgba(t.bg, 0.84)};--brand:${t.accent};--brand-soft:${rgba(t.accent, 0.1)}`;
  const dark = `--ink:${t.dark};--ink-on:#06121A;--brand:${t.dark};--brand-soft:${rgba(t.dark, 0.14)}`;
  el.textContent = `@media (prefers-color-scheme: light){:root[data-space="work"]:not([data-theme="dark"]){${light}}}
:root[data-space="work"][data-theme="light"]{${light}}
@media (prefers-color-scheme: dark){:root[data-space="work"]:not([data-theme="light"]){${dark}}}
:root[data-space="work"][data-theme="dark"]{${dark}}`;
}
/* fundo do topo do iPhone (barra de hora/bateria) no modo Trabalho */
export const workBarColor = () => (isDark() ? '#000000' : WORK.theme?.bg || '#F4F4F6');
