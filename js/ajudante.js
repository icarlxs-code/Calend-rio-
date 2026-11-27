/* O Lembra dentro do editor: lê o que a pessoa escreve, brinca com o assunto e oferece preencher dia e hora
   ("dentista amanhã 15h" → um toque e pronto). Nada sai do aparelho. */
import { sininho, alive, act, say, setMood } from './sininho.js';
import { reaisTxt } from './frase-conta.js';
import { parseQuick } from './personal.js';
import { piada, tema, humorOn } from './humor.js';
import { dayLabel, fmtTime, todayKey } from './utils.js';

export const ajudanteHtml = (frase = 'O que eu não posso deixar você esquecer?') => `<div class="ajd"><span class="ajd__fig">${sininho('feliz', { size: 64 })}</span><div class="ajd__c"><p class="ajd__b" aria-live="polite">${frase}</p><button type="button" class="ajd__ok" hidden></button></div></div>`;
const TEM_QUANDO = /\b(hoje|amanh[ãa]|segunda|ter[çc]a|quarta|quinta|sexta|s[áa]bado|domingo|meio-dia|dia \d{1,2}|\d{1,2}\/\d{1,2}|tod[oa]s? (?:os |as )?(?:dia|m[eê]s|semana|ano|segunda|ter[çc]a|quarta|quinta|sexta|s[áa]bado|domingo)|mensal|reais)(?![\p{L}\d])|r\$\s?\d|\b(?:[àa]s )?\d{1,2}(?:h\d{0,2}|:\d{2})\b/iu;
export function ajudante(raiz, form) {
  const cx = raiz.querySelector('.ajd'); if (!cx || !form.title) return;
  alive();
  const fig = cx.querySelector('[data-snh]'), bal = cx.querySelector('.ajd__b'), ok = cx.querySelector('.ajd__ok');
  let t = 0, ultTema = -2, ult = '';
  const fala = (x, humor, gesto) => { if (!x || x === ult) return; ult = x; setMood(fig, humor || 'feliz'); say(fig, x, { bubble: bal, speed: 20 }); setTimeout(() => act(fig, gesto || 'sim'), 120); };
  const olha = () => {
    const v = form.title.value.trim();
    ok.hidden = true;
    if (v.length < 3) return;
    const tem = TEM_QUANDO.test(v) ? parseQuick(v) : null;
    if (tem && tem.title && (tem.date !== form.date.value || (tem.time && tem.time !== form.time.value) || (tem.repeat !== 'none' && form.repeat && tem.repeat !== form.repeat.value) || (tem.valor && form.valor && !form.valor.value))) {
      const quando = tem.repeat === 'monthly' ? `todo dia ${tem.diaMes}` : tem.repeat === 'weekly' ? `toda ${dayLabel(tem.date).split(' · ')[0].toLowerCase()}` : tem.repeat === 'daily' ? 'todo dia' : tem.date === todayKey() && !tem.time ? 'hoje' : dayLabel(tem.date).split(' · ')[0].toLowerCase();
      const alvo = `${quando}${tem.time ? ' às ' + fmtTime(tem.time) : ''}${tem.valor ? ` · ${reaisTxt(tem.valor)}` : ''}`;
      fala(`Entendi! Coloco para ${alvo}?`, 'feliz', 'sobrancelha');
      ok.textContent = `Colocar ${alvo}`; ok.hidden = false;
      ok.onclick = () => {
        form.title.value = tem.title; form.date.value = tem.date; if (tem.time) form.time.value = tem.time;
        if (form.repeat && tem.repeat !== 'none') form.repeat.value = tem.repeat;
        if (tem.diaMes) form.dataset.diaMes = String(tem.diaMes);
        if (form.valor && tem.valor) form.valor.value = String(tem.valor).replace('.', ',');
        [form.title, form.date, form.time].forEach((i) => { i.dispatchEvent(new Event('input', { bubbles: true })); i.dispatchEvent(new Event('change', { bubbles: true })); });
        ok.hidden = true; ultTema = -2; ult = '';
        fala(piada(tem.title, 'c') || 'Prontinho!', 'feliz', 'soco');
      };
      return;
    }
    const i = tema(v); if (i === ultTema) return; ultTema = i;
    if (i >= 0 && humorOn()) fala(piada(v, 'c', { geral: false }), 'feliz', ['riso', 'pisca', 'balanca', 'soco'][i % 4]);
  };
  form.title.addEventListener('input', () => { clearTimeout(t); t = setTimeout(olha, 650); });
  form.title.addEventListener('focus', () => act(fig, 'olhaLados'));
}
