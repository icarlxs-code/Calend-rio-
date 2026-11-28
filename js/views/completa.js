/* O Lembra insiste (com jeito) no que falta no perfil: uma pergunta por vez, no máximo uma a cada 6 horas.
   "Agora não" pergunta de novo depois; "Prefiro não dizer" nunca mais pergunta aquilo. Fica só na conta da pessoa. */
import { store, saveProfileQuiet } from '../store.js';
import { openSheet, sheetHead, toast } from '../components.js';
import { esc } from '../utils.js';

const UFS = 'AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO'.split(' ');
const INTERVALO = 6 * 3600e3;
const LS_ = () => `lembra.completa.${store.user?.uid || 'local'}`;
const le = () => { try { return JSON.parse(localStorage.getItem(LS_()) || '{}'); } catch { return {}; } };
const grava = (o) => { try { localStorage.setItem(LS_(), JSON.stringify(o)); } catch { /* ok */ } };

/* o que pode faltar, na ordem em que vale perguntar; cada um sabe se já está preenchido */
export const PERGUNTAS = [
  { k: 'nickname', t: 'Como você quer que eu te chame?', tem: (p) => !!(p.nickname || '').trim(),
    campo: (p) => `<input class="input" name="v" maxlength="30" autocomplete="nickname" placeholder="Seu apelido ou primeiro nome" value="${esc(p.nickname || '')}">`,
    valor: (f) => { const v = f.v.value.trim().slice(0, 30); return v ? { nickname: v } : null; } },
  { k: 'pronoun', t: 'Como prefere que eu fale com você?', tem: (p) => ['f', 'm', 'n'].includes(p.pronoun),
    campo: () => `<div class="vida__bts vida__bts--col">${[['f', 'No feminino (ela)'], ['m', 'No masculino (ele)'], ['n', 'Neutro']].map(([v, l]) => `<label class="btn btn--soft"><input type="radio" name="v" value="${v}"> ${l}</label>`).join('')}</div>`,
    valor: (f) => { const v = f.querySelector('input[name="v"]:checked')?.value; return v ? { pronoun: v } : null; } },
  { k: 'birth', t: 'Quando é o seu aniversário? Quero comemorar com você 🎂', tem: (p) => /^\d{4}-\d{2}-\d{2}$/.test(p.birth || ''),
    campo: () => '<input class="input" type="date" name="v" min="1920-01-01">',
    valor: (f) => { const v = f.v.value; const y = +v.slice(0, 4); return /^\d{4}-\d{2}-\d{2}$/.test(v) && y > 1900 && y <= new Date().getFullYear() - 5 ? { birth: v } : null; } },
  { k: 'cidade', t: 'De onde você é? Assim eu falo do seu tempo e da sua região.', tem: (p) => !!(p.cidade || '').trim() && !!p.uf,
    campo: (p) => `<div class="row2"><input class="input" name="v" maxlength="60" autocomplete="address-level2" placeholder="Cidade" value="${esc(p.cidade || '')}"><select class="input" name="uf"><option value="">UF</option>${UFS.map((u) => `<option${p.uf === u ? ' selected' : ''}>${u}</option>`).join('')}</select></div>`,
    valor: (f) => { const c = f.v.value.trim().slice(0, 60), u = f.uf.value; return c && UFS.includes(u) ? { cidade: c, uf: u } : null; } },
];

/** a próxima pergunta que falta (ou null): pula o que já tem e o que a pessoa disse que prefere não dizer */
export function proxima(p = store.profile || {}, est = le(), now = Date.now()) {
  if (now - (est.ultima || 0) < INTERVALO) return null;
  return PERGUNTAS.find((q) => !q.tem(p) && !(est.nao || []).includes(q.k) && !(p.naoDizer || []).includes(q.k)) || null;
}
const ocupado = () => document.querySelector('.sheet-wrap.is-open, .ficha, .paywall, .ob, .guide, .termsgate, .photogate, .avgate, .mustupd, .nv, .gx');

/** chamado ao entrar e ao voltar para o app: abre UMA pergunta, se estiver na hora */
export function insiste() {
  if (store.mode === 'cloud' && !store.user) return false;
  const q = proxima(); if (!q) return false;
  if (ocupado()) { setTimeout(insiste, 5000); return false; }
  const est = le(); grava({ ...est, ultima: Date.now() });
  const p = store.profile || {};
  const a = openSheet({
    className: 'completasheet',
    html: `${sheetHead('')}<form class="page page--sheet vida" onsubmit="return false"><p class="vida__fala">${esc(q.t)}</p>${q.campo(p)}
      <p class="fhelp" data-err hidden role="status">Preencha para eu salvar, ou toque em “Agora não”.</p>
      <button class="btn btn--primary btn--block" data-ok>Salvar</button>
      <div class="vida__bts"><button type="button" class="btn btn--soft" data-close>Agora não</button><button type="button" class="btn btn--soft" data-nao>Prefiro não dizer</button></div></form>`,
    onMount: (x) => {
      const f = x.el.querySelector('form');
      x.el.querySelector('[data-ok]').onclick = async () => {
        const v = q.valor(f);
        if (!v) { x.el.querySelector('[data-err]').hidden = false; return; }
        store.profile = { ...(store.profile || {}), ...v };
        try { await saveProfileQuiet(v); } catch { /* sobe quando a internet voltar */ }
        a.close(); toast('Anotado! Obrigado 💛');
      };
      x.el.querySelector('[data-nao]').onclick = async () => {
        const e2 = le(); grava({ ...e2, nao: [...new Set([...(e2.nao || []), q.k])] });
        const nd = [...new Set([...((store.profile || {}).naoDizer || []), q.k])];
        store.profile = { ...(store.profile || {}), naoDizer: nd };
        try { await saveProfileQuiet({ naoDizer: nd }); } catch { /* ok */ }
        a.close();
      };
    },
  });
  return true;
}
/** liga: ao abrir e ao voltar para o app (a regra das 6 horas segura a frequência) */
let ligado = false;
export function liga() {
  if (ligado) return; ligado = true;
  setTimeout(insiste, 20000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) setTimeout(insiste, 3000); });
}
