/* Perfil da conta: nome, foto e cor (contas próprias) */
import { store, saveMyProfile } from '../store.js';
import { openSheet, sheetHead, toast, avatar } from '../components.js';
import { icon } from '../icons.js';
import { esc, resizeImage } from '../utils.js';

const COLORS = ['#7C5CFF', '#2563EB', '#0E9F6E', '#D9480F', '#DB2777', '#0891B2', '#CA8A04', '#4B5563'];

export function openProfile() {
  const me = store.member(store.me) || {};
  const d = { name: me.name || '', photo: me.photo || null, color: me.color || COLORS[0] };
  const html = () => `${sheetHead('Seu perfil', { left: '<button class="btn-text" data-close>Cancelar</button>', right: '<button class="btn btn--primary btn--sm" data-save>Salvar</button>' })}
    <form class="form" onsubmit="return false">
      <div class="profpic">
        <span class="profpic__img" style="background:${d.color}">${d.photo ? `<img src="${d.photo}" alt="">` : esc((d.name || '?')[0].toUpperCase())}</span>
        <label class="btn btn--soft btn--sm">${icon('camera', 16)} ${d.photo ? 'Trocar foto' : 'Colocar foto'}<input type="file" accept="image/*" data-photo hidden></label>
        ${d.photo ? '<button type="button" class="btn-text btn-text--sm" data-nophoto>Tirar foto</button>' : ''}
      </div>
      <div class="fgroup"><label class="flabel" for="p-name">Nome</label><input id="p-name" class="input" name="name" value="${esc(d.name)}" maxlength="40" autocomplete="name"></div>
      <div class="fgroup"><label class="flabel">Sua cor</label><div class="palette">${COLORS.map((c) => `<button type="button" class="swatch${d.color === c ? ' is-on' : ''}" style="background:${c}" data-color="${c}" aria-label="Cor">${icon('check', 16)}</button>`).join('')}</div></div>
      <p class="fhelp">E-mail da conta: ${esc(store.user?.email || '')}</p>
    </form>`;
  const api = openSheet({
    html: html(),
    onMount: (a) => {
      const el = a.el, form = el.querySelector('form');
      const keep = () => { d.name = form.name.value; };
      el.querySelector('[data-photo]').onchange = async (e) => {
        const f = e.target.files && e.target.files[0];
        if (!f) return;
        keep();
        try { d.photo = await resizeImage(f, 256); a.set(html()); } catch { toast('Não consegui abrir essa foto'); }
      };
      const np = el.querySelector('[data-nophoto]');
      if (np) np.onclick = () => { keep(); d.photo = null; a.set(html()); };
      el.querySelectorAll('[data-color]').forEach((b) => (b.onclick = () => { keep(); d.color = b.dataset.color; a.set(html()); }));
      el.querySelector('[data-save]').onclick = async () => {
        const name = form.name.value.trim();
        if (!name) return toast('Escreva seu nome');
        try { await saveMyProfile({ name, photo: d.photo, color: d.color }); toast('Perfil salvo'); a.close(); }
        catch { toast('Não consegui salvar agora. Verifique a internet.'); }
      };
    },
  });
  return api;
}
