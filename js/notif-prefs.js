/* "Do que você quer ser avisado": a própria pessoa escolhe, na primeira vez e de vez em quando,
   quais avisos quer e quanto. Fica na conta (banco) e no servidor, que respeita a escolha em todo envio. */
import { store, saveProfileQuiet } from './store.js';
import { openSheet, sheetHead, toast } from './components.js';
import { api } from './avisos.js';
import { esc } from './utils.js';

export const TIPOS = [
  { id: 'agua', label: 'Lembrete de água', ajuda: 'Um toque de vez em quando para beber água.' },
  { id: 'motivacao', label: 'Frases motivacionais', ajuda: 'Uma palavra gentil no meio do dia.' },
  { id: 'dica', label: 'Dicas e coach do dia', ajuda: 'Sugestões para organizar sua rotina.' },
  { id: 'story', label: 'Stories', ajuda: 'Quando amigos postam, e lembrete para você postar (25 XP).' },
  { id: 'amigos', label: 'Amigos', ajuda: 'Pedidos de amizade e avisos de amigos.' },
  { id: 'visita', label: 'Visitas no seu perfil', ajuda: 'Quando alguém olha o seu perfil.' },
  { id: 'ranking', label: 'Ranking e conquistas', ajuda: 'Subiu de posição, ganhou emblema ou brasão.' },
];
export const NIVEIS = [['pouco', 'Pouco', 'até 3 por dia'], ['normal', 'Normal', 'até 6 por dia'], ['muito', 'Bastante', 'até 10 por dia']];
export const COMPROMISSOS = 'Compromissos e lembretes de horário sempre chegam, porque é para isso que o Lembra existe.';
const DIA = 'lembra.npDia';

/** o que a pessoa já escolheu (conta; no aparelho se estiver sem internet) */
export const npAtual = () => {
  const p = store.profile?.notifPrefs;
  if (p && p.v) return p;
  return null;
};
const ligado = (np, id) => !np || np.cats?.[id] !== false;

function salva(np) {
  store.profile = { ...(store.profile || {}), notifPrefs: np };
  saveProfileQuiet({ notifPrefs: np }).catch(() => {});
  if (store.mode === 'cloud' && store.user) api('/prefs/notif', { np }).catch(() => {});
}

/** abre a tela; `forca` abre mesmo se já respondeu (botão em Editar perfil) */
export function abreNotifPrefs({ forca = false, aoSalvar } = {}) {
  const atual = npAtual() || { v: 0, cats: {}, freq: 'normal' };
  const d = { cats: Object.fromEntries(TIPOS.map((t) => [t.id, ligado(atual, t.id)])), freq: atual.freq || 'normal' };
  const html = () => `${sheetHead('Do que você quer ser avisado', { right: '<button class="btn btn--primary btn--sm" data-ok>Salvar</button>' })}
    <div class="page page--sheet npref">
      <p class="fhelp">Escolha o que você quer receber. Pode mudar quando quiser, em Editar perfil.</p>
      <div class="list">${TIPOS.map((t) => `<label class="list__row"><span><b>${esc(t.label)}</b><small>${esc(t.ajuda)}</small></span><input type="checkbox" class="switch" data-tipo="${t.id}" ${d.cats[t.id] ? 'checked' : ''}></label>`).join('')}</div>
      <h3 class="npref__h">Quanto você quer receber?</h3>
      <div class="npref__niv" role="radiogroup">${NIVEIS.map(([k, t, s]) => `<button class="npref__op${d.freq === k ? ' is-on' : ''}" role="radio" aria-checked="${d.freq === k}" data-freq="${k}"><b>${t}</b><small>${s}</small></button>`).join('')}</div>
      <p class="fhelp">${esc(COMPROMISSOS)}</p>
    </div>`;
  const a = openSheet({
    html: html(),
    onMount: (x) => {
      const el = x.el;
      el.querySelectorAll('[data-tipo]').forEach((c) => (c.onchange = () => { d.cats[c.dataset.tipo] = c.checked; }));
      el.querySelectorAll('[data-freq]').forEach((b) => (b.onclick = () => {
        d.freq = b.dataset.freq;
        el.querySelectorAll('[data-freq]').forEach((o) => { o.classList.toggle('is-on', o === b); o.setAttribute('aria-checked', o === b); });
      }));
      el.querySelector('[data-ok]').onclick = () => {
        const np = { v: 1, cats: { ...d.cats }, freq: d.freq };
        salva(np);
        try { localStorage.setItem(DIA, new Date().toDateString()); } catch { /* ok */ }
        a.close(); toast('Pronto! Agora eu aviso do jeito que você escolheu 💛');
        aoSalvar && aoSalvar(np);
      };
    },
  });
  return a;
}

/** ao abrir o app: se a pessoa ainda não escolheu, abre a tela (uma vez por dia até responder) */
export function pedeNotifPrefs() {
  if (!store.user || store.mode !== 'cloud') return false;
  if (npAtual()) return false;
  try { if (localStorage.getItem(DIA) === new Date().toDateString()) return false; } catch { /* ok */ }
  if (document.querySelector('.sheet-wrap.is-open, .ficha, .vficha, .ob, .nv')) return false;
  abreNotifPrefs();
  return true;
}

/** o aviso chegou pelo link (?n=tipo): conta para a média de quanto a pessoa abre cada tipo */
export function leAbertura() {
  try {
    const u = new URL(location.href), n = u.searchParams.get('n');
    if (!n) return;
    u.searchParams.delete('n');
    history.replaceState(null, '', u.pathname + (u.search || '') + u.hash);
    if (store.user && store.mode === 'cloud') api('/notif/abriu', { n }).catch(() => {});
  } catch { /* ok */ }
}
