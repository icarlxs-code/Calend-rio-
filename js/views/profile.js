/* Perfil no jeito das redes sociais (Instagram/WhatsApp), para a pessoa se sentir em casa:
   - foto grande com o anel de nível em volta; tocar na foto abre "Ver foto · Tirar foto · Escolher da galeria · Remover";
   - recorte redondo (arrastar e dar zoom), igual ao WhatsApp;
   - números lado a lado (concluídos · no horário · dias seguidos), nome, profissão e uma frase sua;
   - destaques com os últimos emblemas e uma grade de emblemas (3 por linha), como as fotos no Instagram;
   - abas: Emblemas · Níveis · Números. Sair da conta fica no fim, bem visível. */
import { store, saveMyProfile } from '../store.js';
import { openSheet, sheetHead, toast, avatar } from '../components.js';
import { icon } from '../icons.js';
import { esc } from '../utils.js';
import { CONFIG } from '../../config.js';
import { professionFor } from '../../functions/catalog.js';

const COLORS = ['#7C5CFF', '#2563EB', '#0E9F6E', '#D9480F', '#DB2777', '#0891B2', '#CA8A04', '#4B5563'];
const fmt = (n) => Number(n || 0).toLocaleString('pt-BR');
const dt = (ms) => new Date(ms).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.', '');

/* compatibilidade: "Editar perfil" dos Ajustes */
export function openProfile() { return openEditProfile(); }

export async function openProfilePage({ tab = 'emblemas' } = {}) {
  const G = await import('../game.js');
  const { BADGES, RARITY, badgeArt, crest, TIERS, CATS } = await import('../badges.js');
  let cur = tab, cat = 'todas';
  const html = () => {
    const me = store.member(store.me) || {};
    const st = G.state(), m = G.metrics(), L = G.levelInfo();
    const done = m.doneAll || 0, onTime = m.onTime || 0, late = m.late || 0;
    const pct = onTime + late ? `${Math.round((onTime / (onTime + late)) * 100)}%` : '—';
    const earned = BADGES.filter((b) => st.badges[b.id]).sort((a, b) => st.badges[b.id] - st.badges[a.id]);
    const locked = BADGES.filter((b) => !st.badges[b.id]).map((b) => ({ b, p: G.progressOf(b) })).sort((x, y) => y.p.pct - x.p.pct);
    const prof = store.profile || {};
    const ring = `conic-gradient(${L.tier.hue} ${Math.round(L.pct * 360)}deg, color-mix(in srgb, ${L.tier.hue} 18%, transparent) 0)`;
    const grid = () => {
      const list = [...earned.map((b) => ({ b, p: { done: true, at: st.badges[b.id] } })), ...locked].filter((x) => cat === 'todas' || x.b.cat === cat);
      return `<div class="pcats">${[['todas', 'Todas'], ...Object.entries(CATS).map(([k, v]) => [k, v.name])].map(([k, l]) => `<button class="pcats__b${cat === k ? ' is-on' : ''}" data-cat="${k}">${esc(l)}</button>`).join('')}</div>
        <div class="bgrid">${list.map(({ b, p }) => `<button class="bgrid__it${p.done ? '' : ' is-locked'}" data-badge="${b.id}">
          ${badgeArt(b, 84, { locked: !p.done })}
          <b>${esc(b.name())}</b>
          ${p.done ? `<small>${RARITY[b.rarity].label}</small>` : `<span class="bgrid__p"><i style="width:${Math.round(p.pct * 100)}%"></i></span><small>${fmt(p.value)}/${fmt(p.goal)}</small>`}
        </button>`).join('')}</div>`;
    };
    const levels = () => `<div class="lvlist">${TIERS.map((t, i) => {
      const to = TIERS[i + 1] ? TIERS[i + 1].from - 1 : 100;
      const state = L.level >= t.from && L.level <= to ? 'is-cur' : L.level > to ? 'is-done' : '';
      const need = Math.max(0, G.xpFor(t.from) - L.xp);
      return `<div class="lvlist__it ${state}">${crest(t.from, 64, { locked: !state })}<div><b>${esc(t.name())}</b><small>${t.from === to ? `Nível ${t.from}` : `Níveis ${t.from}–${to}`}</small>
        ${state === 'is-cur' ? `<small class="lvlist__now">Você está aqui · faltam ${fmt(L.need)} XP para o nível ${Math.min(100, L.level + 1)}</small>` : state === 'is-done' ? '<small class="lvlist__ok">Conquistado ✓</small>' : `<small>Faltam ${fmt(need)} XP</small>`}</div></div>`;
    }).join('')}</div>
      <p class="fhelp">Como ganhar XP: concluir no horário +20 · concluir atrasado +8 · lembrete do Pessoal +12 · marcar compromisso +5 · bilhete +3 · abrir o app no dia +10 · dia 100% +40 · voltar depois de uns dias +30 · cada emblema dá XP extra.</p>`;
    const nums = () => `<div class="pnums">
      ${[['Concluídos no horário', onTime, 'clock'], ['Concluídos com atraso', late, 'alert'], ['Compromissos marcados', m.created || 0, 'calendar'], ['Dias 100%', m.perfectDays || 0, 'star'],
        ['Melhor sequência', `${m.bestStreak || 0} ${(m.bestStreak || 0) === 1 ? 'dia' : 'dias'}`, 'flame'], ['Lembretes do Pessoal feitos', m.personalDone || 0, 'heart'], ['Bilhetes', m.notes || 0, 'note'], ['Dias usando o Lembra', m.activeDays || 0, 'cal2'],
        ['Voltas por cima', m.comebacks || 0, 'refresh'], ['XP total', fmt(L.xp), 'sparkles']].map(([l, v, ic]) => `<div class="pnums__it">${icon(ic, 18)}<b>${typeof v === 'number' ? fmt(v) : esc(v)}</b><small>${esc(l)}</small></div>`).join('')}
    </div>`;
    return `${sheetHead(esc((me.name || 'Perfil').split(' ')[0]), { left: '<button class="btn-text" data-close>Fechar</button>', right: '<button class="btn-text" data-edit>Editar</button>' })}
    <div class="prof">
      <div class="prof__top">
        <button class="prof__pic" data-pic aria-label="Foto do perfil" style="--ring:${ring}">
          <span class="prof__ring">${avatar(store.me, 96)}</span>
          <span class="prof__cam">${icon('camera', 15)}</span>
        </button>
        <div class="prof__stats">
          <div><b>${fmt(done)}</b><small>${done === 1 ? 'concluído' : 'concluídos'}</small></div>
          <div><b>${pct}</b><small>no horário</small></div>
          <div><b>${fmt(Object.keys(st.badges).length)}</b><small>${Object.keys(st.badges).length === 1 ? 'emblema' : 'emblemas'}</small></div>
        </div>
      </div>
      <div class="prof__name"><b>${esc(me.name || '')}</b>${prof.phoneVerified ? `<span class="prof__ok" title="Celular confirmado">${icon('check', 11)}</span>` : ''}</div>
      ${prof.profession ? `<div class="prof__job">${esc(professionFor(prof.profession, prof.pronoun))}${prof.role ? ' · ' + esc(prof.role) : ''}</div>` : ''}
      ${prof.bio ? `<div class="prof__bio">${esc(prof.bio)}</div>` : ''}
      <button class="prof__lv" data-tab="niveis">
        <span class="prof__crest">${crest(L.level, 54)}</span>
        <span class="prof__lvtxt"><b>Nível ${L.level} · ${esc(L.tier.name())}</b>
          <span class="prof__bar"><i style="width:${Math.round(L.pct * 100)}%;background:${L.tier.hue}"></i></span>
          <small>${L.level >= 100 ? 'Nível máximo! Você é lenda.' : `${fmt(L.xp - L.cur)} / ${fmt(L.next - L.cur)} XP para o nível ${L.level + 1}`}</small></span>
      </button>
      <div class="prof__btns"><button class="btn btn--soft btn--sm" data-edit>Editar perfil</button><button class="btn btn--soft btn--sm" data-share>${icon('share', 15)} Compartilhar</button></div>
      ${earned.length ? `<div class="prof__hl">${earned.slice(0, 8).map((b) => `<button class="prof__hlit" data-badge="${b.id}"><span>${badgeArt(b, 58)}</span><small>${esc(b.name())}</small></button>`).join('')}</div>` : ''}
      <div class="prof__tabs" role="tablist">
        <button role="tab" class="${cur === 'emblemas' ? 'is-on' : ''}" data-tab="emblemas" aria-label="Emblemas">${icon('grid', 20)}</button>
        <button role="tab" class="${cur === 'niveis' ? 'is-on' : ''}" data-tab="niveis" aria-label="Níveis">${icon('trophy', 20)}</button>
        <button role="tab" class="${cur === 'numeros' ? 'is-on' : ''}" data-tab="numeros" aria-label="Números">${icon('chart', 20)}</button>
      </div>
      <div class="prof__body">${cur === 'emblemas' ? grid() : cur === 'niveis' ? levels() : nums()}</div>
      ${store.mode === 'cloud' ? `<button class="logoutbig" data-action="logout">${icon('logout', 20)}<span>Sair da conta</span></button><p class="fhelp center">${esc(store.user?.email || '')}</p>` : ''}
    </div>`;
  };
  const api = openSheet({
    className: 'sheet--tall sheet--prof',
    html: html(),
    onMount: (a) => {
      const el = a.el;
      el.querySelectorAll('[data-tab]').forEach((b) => (b.onclick = () => { cur = b.dataset.tab; a.set(html()); el.querySelector('.prof__tabs')?.scrollIntoView({ block: 'start', behavior: 'smooth' }); }));
      el.querySelectorAll('[data-cat]').forEach((b) => (b.onclick = () => { cat = b.dataset.cat; a.set(html()); }));
      el.querySelectorAll('[data-badge]').forEach((b) => (b.onclick = () => badgeDetail(b.dataset.badge)));
      el.querySelectorAll('[data-edit]').forEach((b) => (b.onclick = () => openEditProfile(() => a.set(html()))));
      el.querySelector('[data-pic]').onclick = () => photoActions(() => a.set(html()));
      const sh = el.querySelector('[data-share]');
      if (sh) sh.onclick = async () => {
        const L = G.levelInfo();
        const text = `Estou no nível ${L.level} (${L.tier.name()}) do ${CONFIG.appName}, com ${Object.keys(G.state().badges).length} emblemas! 🏆 A agenda que lembra de tudo por você:`;
        const url = (CONFIG.siteUrl || location.href).replace(/#.*$/, '') + 'conheca/';
        try { if (navigator.share) await navigator.share({ title: CONFIG.appName, text, url }); else { await navigator.clipboard.writeText(`${text} ${url}`); toast('Texto copiado! Cole no WhatsApp ou Instagram 📋'); } } catch { /* cancelou */ }
      };
    },
  });
  const off = G.onGame(() => { if (!api.closed) api.set(html()); else off(); });
  return api;
}

/* ---------- detalhes de um emblema: dá para girar a medalha com o dedo ---------- */
export async function badgeDetail(id) {
  const G = await import('../game.js');
  const { badgeById, badgeArt, RARITY, CATS } = await import('../badges.js');
  const b = badgeById(id);
  if (!b) return;
  const p = G.progressOf(b), r = RARITY[b.rarity];
  const a = openSheet({
    className: 'sheet--bdg',
    html: `${sheetHead('')}
      <div class="bdet">
        <div class="bdet__stage" data-tilt><div class="bdet__medal">${badgeArt(b, 210, { locked: !p.done })}</div><div class="bdet__shadow"></div></div>
        <span class="bdet__rar" style="--rc:${r.color}">${esc(r.label)} · ${esc(CATS[b.cat].name)}</span>
        <h2>${esc(b.name())}</h2>
        <p>${esc(b.desc())}</p>
        ${p.done ? `<p class="bdet__when">${icon('check', 14)} Conquistado em ${esc(dt(p.at))} · +${r.xp} XP</p>`
          : `<div class="bdet__prog"><span><i style="width:${Math.round(p.pct * 100)}%"></i></span><small>${fmt(p.value)} de ${fmt(p.goal)} · vale +${r.xp} XP</small></div>`}
        <p class="fhelp">Arraste a medalha para girar.</p>
      </div>`,
    onMount: (x) => tilt(x.el.querySelector('[data-tilt]')),
  });
  return a;
}
/* girar com o dedo (perspectiva 3D) e voltar com mola */
function tilt(stage) {
  if (!stage) return;
  const med = stage.querySelector('.bdet__medal');
  let sx = 0, sy = 0, rx = 0, ry = 0, on = false, raf = 0;
  const apply = () => { med.style.transform = `rotateY(${ry}deg) rotateX(${rx}deg)`; };
  stage.addEventListener('pointerdown', (e) => { on = true; sx = e.clientX; sy = e.clientY; med.style.transition = 'none'; stage.setPointerCapture?.(e.pointerId); });
  stage.addEventListener('pointermove', (e) => {
    if (!on) return;
    ry = Math.max(-180, Math.min(180, (e.clientX - sx) * 0.9)); rx = Math.max(-35, Math.min(35, -(e.clientY - sy) * 0.4));
    cancelAnimationFrame(raf); raf = requestAnimationFrame(apply);
  });
  const end = () => { if (!on) return; on = false; med.style.transition = 'transform .9s cubic-bezier(.2,1.4,.4,1)'; rx = 0; ry = Math.abs(ry) > 120 ? (ry > 0 ? 360 : -360) : 0; apply(); setTimeout(() => { med.style.transition = 'none'; ry = 0; apply(); }, 950); };
  stage.addEventListener('pointerup', end);
  stage.addEventListener('pointercancel', end);
}

/* ---------- foto: como no WhatsApp ---------- */
export function photoActions(after) {
  const me = store.member(store.me) || {};
  const a = openSheet({
    className: 'sheet--actions',
    html: `<div class="asheet">
      <div class="asheet__pic">${avatar(store.me, 72)}<b>Foto do perfil</b><small>Aparece para quem divide a agenda com você</small></div>
      <div class="asheet__grp">
        ${me.photo ? `<button class="asheet__b" data-view>${icon('eye', 20)} Ver foto</button>` : ''}
        <label class="asheet__b">${icon('camera', 20)} Tirar foto<input type="file" accept="image/*" capture="user" data-file hidden></label>
        <label class="asheet__b">${icon('image', 20)} Escolher da galeria<input type="file" accept="image/*" data-file hidden></label>
        ${me.photo ? `<button class="asheet__b is-danger" data-del>${icon('trash', 20)} Remover foto</button>` : ''}
      </div>
      <button class="asheet__b asheet__cancel" data-close>Cancelar</button>
    </div>`,
    onMount: (x) => {
      x.el.querySelectorAll('[data-file]').forEach((inp) => (inp.onchange = async () => {
        const f = inp.files && inp.files[0];
        if (!f) return;
        x.close();
        const url = await cropper(f);
        if (!url) return;
        try { await saveMyProfile({ photo: url }); toast('Foto atualizada ✓'); after && after(); }
        catch { toast('Não consegui salvar agora. Verifique a internet.'); }
      }));
      const v = x.el.querySelector('[data-view]');
      if (v) v.onclick = () => { x.close(); viewPhoto(me.photo); };
      const d = x.el.querySelector('[data-del]');
      if (d) d.onclick = async () => { x.close(); try { await saveMyProfile({ photo: null }); toast('Foto removida'); after && after(); } catch { toast('Não consegui agora.'); } };
    },
  });
  return a;
}
function viewPhoto(src) {
  const el = document.createElement('div');
  el.className = 'photoview';
  el.innerHTML = `<img src="${src}" alt="Foto do perfil"><button class="photoview__x" aria-label="Fechar">${icon('x', 22)}</button>`;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add('is-in'));
  el.onclick = () => { el.classList.remove('is-in'); setTimeout(() => el.remove(), 250); };
}
/* recorte redondo: arrastar para posicionar, pinçar ou usar a barra para o zoom */
export function cropper(file) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onerror = () => { URL.revokeObjectURL(url); toast('Não consegui abrir essa foto'); resolve(null); };
    img.onload = () => {
      const el = document.createElement('div');
      el.className = 'crop';
      el.innerHTML = `<div class="crop__top"><button class="btn-text crop__btn" data-no>Cancelar</button><b>Mover e ajustar</b><button class="btn-text crop__btn crop__ok" data-ok>Usar</button></div>
        <div class="crop__area" data-area><img src="${url}" alt="" draggable="false"><div class="crop__mask"></div></div>
        <div class="crop__zoom">${icon('image', 16)}<input type="range" min="1" max="4" step="0.01" value="1" data-z aria-label="Zoom">${icon('image', 22)}</div>`;
      document.body.appendChild(el);
      const area = el.querySelector('[data-area]'), im = area.querySelector('img'), zr = el.querySelector('[data-z]');
      const D = () => Math.min(area.clientWidth, area.clientHeight) * 0.82; // diâmetro do círculo
      let z = 1, x = 0, y = 0;
      const base = () => D() / Math.min(img.naturalWidth, img.naturalHeight); // escala que cobre o círculo
      const clamp = () => {
        const s = base() * z, w = img.naturalWidth * s, h = img.naturalHeight * s, r = D() / 2;
        x = Math.min(w / 2 - r, Math.max(-(w / 2 - r), x)); y = Math.min(h / 2 - r, Math.max(-(h / 2 - r), y));
      };
      const mask = el.querySelector('.crop__mask');
      const draw = () => { mask.style.setProperty('--d', `${D()}px`); clamp(); const s = base() * z; im.style.width = `${img.naturalWidth * s}px`; im.style.height = `${img.naturalHeight * s}px`; im.style.transform = `translate(-50%,-50%) translate(${x}px,${y}px)`; };
      draw();
      const pts = new Map();
      let last = null, pinch = null;
      area.addEventListener('pointerdown', (e) => { area.setPointerCapture?.(e.pointerId); pts.set(e.pointerId, [e.clientX, e.clientY]); last = [e.clientX, e.clientY]; if (pts.size === 2) { const [a, b] = [...pts.values()]; pinch = { d: Math.hypot(a[0] - b[0], a[1] - b[1]), z }; } });
      area.addEventListener('pointermove', (e) => {
        if (!pts.has(e.pointerId)) return;
        pts.set(e.pointerId, [e.clientX, e.clientY]);
        if (pts.size === 2 && pinch) { const [a, b] = [...pts.values()]; z = Math.max(1, Math.min(4, pinch.z * (Math.hypot(a[0] - b[0], a[1] - b[1]) / pinch.d))); zr.value = z; draw(); return; }
        if (last) { x += e.clientX - last[0]; y += e.clientY - last[1]; last = [e.clientX, e.clientY]; draw(); }
      });
      const up = (e) => { pts.delete(e.pointerId); if (pts.size < 2) pinch = null; last = pts.size ? [...pts.values()][0] : null; };
      area.addEventListener('pointerup', up); area.addEventListener('pointercancel', up);
      zr.oninput = () => { z = +zr.value; draw(); };
      const done = (val) => { el.remove(); URL.revokeObjectURL(url); resolve(val); };
      el.querySelector('[data-no]').onclick = () => done(null);
      el.querySelector('[data-ok]').onclick = () => {
        const OUT = 320, s = base() * z, r = D() / 2;
        // pedaço da foto original que está dentro do círculo
        const sw = (2 * r) / s, sxp = img.naturalWidth / 2 - (x + r) / s, syp = img.naturalHeight / 2 - (y + r) / s;
        const c = document.createElement('canvas'); c.width = OUT; c.height = OUT;
        const ctx = c.getContext('2d');
        ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, OUT, OUT);
        ctx.drawImage(img, sxp, syp, sw, sw, 0, 0, OUT, OUT);
        let q = 0.86, data = c.toDataURL('image/jpeg', q);
        while (data.length > 180000 && q > 0.5) { q -= 0.08; data = c.toDataURL('image/jpeg', q); }
        done(data);
      };
    };
    img.src = url;
  });
}

/* ---------- editar perfil: nome, frase e cor ---------- */
export function openEditProfile(after) {
  const me = store.member(store.me) || {};
  const d = { name: me.name || '', bio: store.profile?.bio || '', color: me.color || COLORS[0] };
  const html = () => `${sheetHead('Editar perfil', { left: '<button class="btn-text" data-close>Cancelar</button>', right: '<button class="btn btn--primary btn--sm" data-save>Salvar</button>' })}
    <form class="form" onsubmit="return false">
      <div class="profpic"><button type="button" class="profpic__btn" data-pic>${avatar(store.me, 88)}<span>${icon('camera', 14)} Alterar foto</span></button></div>
      <div class="fgroup"><label class="flabel" for="p-name">${store.profile?.nickname ? 'Como prefere ser chamado(a)' : 'Nome'}</label><input id="p-name" class="input" name="name" value="${esc(d.name)}" maxlength="40" autocomplete="nickname"></div>
      <div class="fgroup"><label class="flabel" for="p-bio">Uma frase sobre você <small class="muted">(opcional)</small></label><input id="p-bio" class="input" name="bio" value="${esc(d.bio)}" maxlength="80" placeholder="Ex.: Confeiteira apaixonada por bolo de pote 🍰"></div>
      <div class="fgroup"><label class="flabel">Sua cor</label><div class="palette palette--8">${COLORS.map((c) => `<button type="button" class="swatch${d.color === c ? ' is-on' : ''}" style="background:${c}" data-color="${c}" aria-label="Cor">${icon('check', 16)}</button>`).join('')}</div></div>
      <p class="fhelp">E-mail da conta: ${esc(store.user?.email || '')}</p>
    </form>`;
  return openSheet({
    html: html(),
    onMount: (a) => {
      const el = a.el, form = el.querySelector('form');
      const keep = () => { d.name = form.name.value; d.bio = form.bio.value; };
      el.querySelector('[data-pic]').onclick = () => { keep(); photoActions(() => a.set(html())); };
      el.querySelectorAll('[data-color]').forEach((b) => (b.onclick = () => { keep(); d.color = b.dataset.color; a.set(html()); }));
      el.querySelector('[data-save]').onclick = async () => {
        keep();
        const name = d.name.replace(/\s+/g, ' ').trim();
        if (!name || !/\p{L}/u.test(name)) return toast('Escreva seu nome');
        const nameField = store.profile?.nickname ? { nickname: name } : { name };
        try { await saveMyProfile({ ...nameField, bio: d.bio.replace(/\s+/g, ' ').trim().slice(0, 80), color: d.color }); toast('Perfil salvo ✓'); a.close(); after && after(); }
        catch { toast('Não consegui salvar agora. Verifique a internet.'); }
      };
    },
  });
}
