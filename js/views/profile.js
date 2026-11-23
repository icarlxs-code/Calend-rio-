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
import { sininho, alive, act, vivo } from '../sininho.js';
import { mascotOn } from '../mascote.js';
import { meuStory, openViewer, comoPostar, refreshFeed, fotoPendente } from '../stories.js';
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
          <span class="b3d${p.done ? ' is-on' : ''}" style="--d:${(b.id.length * 37) % 50 / 10}s">${badgeArt(b, 84, { locked: !p.done })}</span>
          <b>${esc(b.name())}</b>
          ${p.done ? `<small>${RARITY[b.rarity].label}</small>` : `<span class="bgrid__p"><i style="width:${Math.round(p.pct * 100)}%"></i></span><small>${fmt(p.value)}/${fmt(p.goal)}</small>`}
        </button>`).join('')}</div>`;
    };
    const levels = () => {
      const curT = L.tier, idx = TIERS.indexOf(TIERS.find((t, i) => L.level >= t.from && (!TIERS[i + 1] || L.level < TIERS[i + 1].from)));
      const nextT = TIERS[idx + 1];
      return `<div class="lvhero" style="--h:${curT.hue}">
        <div class="lvhero__stage"><div class="spin3d">${crest(L.level, 132)}</div><div class="lvhero__floor"></div></div>
        <b class="lvhero__t">${esc(curT.name())}</b><small>Nível ${L.level}${L.level >= 100 ? ' · máximo' : ''}</small>
        <div class="lvhero__bar"><i style="width:${Math.round(L.pct * 100)}%"></i></div>
        <small class="lvhero__need">${L.level >= 100 ? 'Você chegou ao topo. Lenda do Lembra!' : `<b>${fmt(L.need)} XP</b> para o nível ${L.level + 1}`}</small>
        ${nextT ? `<div class="lvhero__next">${crest(nextT.from, 44, { locked: true })}<span><small>Próximo brasão</small><b>${esc(nextT.name())} · nível ${nextT.from}</b><small>faltam ${fmt(Math.max(0, G.xpFor(nextT.from) - L.xp))} XP</small></span></div>` : ''}
      </div>
      <div class="lvpath">${TIERS.map((t, i) => {
        const to = TIERS[i + 1] ? TIERS[i + 1].from - 1 : 100;
        const state = L.level >= t.from && L.level <= to ? 'is-cur' : L.level > to ? 'is-done' : '';
        const need = Math.max(0, G.xpFor(t.from) - L.xp);
        return `<div class="lvpath__it ${state}" style="--h:${t.hue}"><span class="lvpath__dot"></span><span class="b3d${state ? ' is-on' : ''}" style="--d:${i * 0.4}s">${crest(t.from, 58, { locked: !state })}</span>
          <div><b>${esc(t.name())}</b><small>${t.from === to ? `Nível ${t.from}` : `Níveis ${t.from}–${to}`}</small>
          ${state === 'is-cur' ? '<small class="lvlist__now">Você está aqui</small>' : state === 'is-done' ? '<small class="lvlist__ok">Conquistado ✓</small>' : `<small>${icon('lock', 11)} faltam ${fmt(need)} XP</small>`}</div></div>`;
      }).join('')}</div>
      <p class="fhelp">Como ganhar XP: concluir no horário +20 · concluir atrasado +8 · lembrete do Pessoal +12 · marcar compromisso +5 · bilhete +3 · abrir o app no dia +10 · dia 100% +40 · voltar depois de uns dias +30 · cada emblema dá XP extra.</p>`;
    };
    const nums = () => {
      const off = G.offensive(), days = new Set([...(st.od || []), ...(st.days || [])]);
      const lvlF = off.days >= 100 ? 'f5' : off.days >= 30 ? 'f4' : off.days >= 14 ? 'f3' : off.days >= 7 ? 'f2' : off.days >= 1 ? 'f1' : 'f0';
      const fireName = { f0: 'Acenda a sua ofensiva hoje', f1: 'Chama acesa', f2: 'Pegando fogo!', f3: 'Fogo forte', f4: 'Chama azul: raríssima', f5: 'Chama lendária' }[lvlF];
      const wk = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); const k = d.toISOString().slice(0, 10); const kk = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; return { on: days.has(kk) || days.has(k), l: 'DSTQQSS'[d.getDay()], today: i === 6 }; });
      const goal = [3, 7, 14, 30, 60, 100, 365].find((x) => x > off.days) || off.days + 100;
      const T = [['clock', 'No horário', onTime, '#34C759'], ['alert', 'Com atraso', late, '#FF9500'], ['calendar', 'Marcados', m.created || 0, '#0A84FF'], ['star', 'Dias 100%', m.perfectDays || 0, '#FFB800'],
        ['heart', 'Lembretes do Pessoal', m.personalDone || 0, '#FF2D55'], ['note', 'Bilhetes', m.notes || 0, '#AF52DE'], ['cal2', 'Dias usando o Lembra', m.activeDays || 0, '#5AC8FA'], ['refresh', 'Voltas por cima', m.comebacks || 0, '#30B0C7']];
      const snh = mascotOn();
      // cada número tem o Lembra espiando do canto, com a cara do que o número quer dizer
      const PEEK = { 'No horário': ['feliz', '', 'olhaLados'], 'Com atraso': ['sono', '<i class="pn2__zz">z<i>z</i></i>', ''], 'Dias 100%': ['feliz', '<i class="pn2__conf"></i>', 'pisca'], 'Lembretes do Pessoal': ['amor', '', 'timido'], Bilhetes: ['desconfiado', '', 'pensa'] };
      return `<div class="ofs ofs--${lvlF}">
        <div class="ofs__head">
          <div class="ofs__fire"><span class="fire"><i></i><i></i><i></i><i class="fire__core"></i></span></div>
          <div class="ofs__txt"><b>${off.days} ${off.days === 1 ? 'dia' : 'dias'}</b><span>${fireName}</span></div>
          ${snh ? `<button class="ofs__snh" data-replay-streak aria-label="Ver a comemoração da ofensiva">${sininho(off.today ? (off.days >= 7 ? 'danca' : 'feliz') : off.days ? 'triste' : 'acena', { size: 104 })}</button>` : ''}
        </div>
        <div class="ofs__week">${wk.map((d) => `<span class="${d.on ? 'is-on' : ''}${d.today ? ' is-today' : ''}"><i>${d.on ? icon('check', 14) : ''}</i><small>${d.l}</small></span>`).join('')}</div>
        <div class="ofs__goal"><span><i style="width:${Math.max(4, Math.min(100, Math.round((off.days / goal) * 100)))}%"></i></span><small>${off.today ? `Próxima meta: <b>${goal} dias</b>` : '<b>Abra o Lembra hoje</b> para não perder a ofensiva'} · recorde ${Math.max(off.best, m.bestStreak || 0)} dias</small></div>
      </div>
      <div class="xpbig"><span class="xpbig__ic">${icon('sparkles', 22)}</span><div><small>XP total</small><b>${fmt(L.xp)}</b></div><div class="xpbig__m"><small>Este mês</small><b>${fmt(G.monthXp())}</b></div><button class="xpbig__rk" data-action="ranking">Ranking ${icon('right', 14)}</button></div>
      <div class="pnums2">${T.map(([ic, l, v, c]) => { const pk = snh && PEEK[l]; return `<div class="pn2${pk ? ' has-peek' : ''}${l === 'Marcados' ? ' is-cal' : ''}" style="--c:${c}"><span class="pn2__ic">${icon(ic, 18)}</span><b>${fmt(v)}</b><small>${esc(l)}</small>${pk ? `<span class="pn2__peek" data-g="${pk[2]}">${sininho(pk[0], { size: 58 })}${pk[1]}</span>` : ''}${l === 'Marcados' ? `<span class="pn2__cal">${icon('calendar', 44)}</span>` : ''}</div>`; }).join('')}</div>`;
    };
    return `${sheetHead(esc((me.name || 'Perfil').split(' ')[0]), { left: '<button class="btn-text" data-close>Fechar</button>', right: '<button class="btn-text" data-edit>Editar</button>' })}
    <div class="prof">
      ${(() => {
        const ms = meuStory(), o = G.offensive(), nEmb = Object.keys(st.badges).length;
        return `<div class="prof2__head">
        <button class="prof2__pic${ms ? (ms.stories.some((x) => !x.seen) ? ' has-story' : ' has-story is-seen') : ''}${store.billing?.plan === 'lifetime' && store.billing?.vip ? ' is-vip' : ''}" data-pic aria-label="Sua foto e seus stories">
          <span class="prof2__ring"><span class="prof2__img">${avatar(store.me, 88)}</span></span><i class="prof2__plus">${icon('plus', 14)}</i></button>
        <div class="prof2__right">
          <div class="prof__name prof2__name"><b>${esc(me.name || '')}</b>${prof.phoneVerified ? `<span class="prof__ok" title="Celular confirmado">${icon('check', 11)}</span>` : ''}</div>
          <div class="prof2__nums">
            <div><b>${fmt(done)}</b><small>${done === 1 ? 'concluído' : 'concluídos'}</small></div>
            <div><b>${pct}</b><small>no horário</small></div>
            <button data-tab="emblemas"><b>${fmt(nEmb)}</b><small>${nEmb === 1 ? 'emblema' : 'emblemas'}</small></button>
          </div>
        </div>
      </div>
      ${store.billing?.plan === 'lifetime' && store.billing?.vip ? `<div class="prof__vipline">${icon('crown', 13)} Lembra Vitalício · Nº ${String(store.billing.vip.no).padStart(3, '0')}</div>` : ''}
      ${prof.profession ? `<div class="prof2__job">${esc(professionFor(prof.profession, prof.pronoun))}${prof.role ? ' · ' + esc(prof.role) : ''}</div>` : ''}
      ${prof.bio ? `<div class="prof2__bio">${esc(prof.bio)}</div>` : ''}
      <div class="prof2__lvrow">
        <button class="prof2__lv" data-tab="niveis">
          <span class="prof__crest">${crest(L.level, 46)}</span>
          <span class="prof__lvtxt"><b>Nível ${L.level} · ${esc(L.tier.name())}</b>
            <span class="prof__bar"><i style="width:${Math.round(L.pct * 100)}%;background:${L.tier.hue}"></i></span>
            <small>${L.level >= 100 ? 'Nível máximo! Você é lenda.' : `${fmt(L.xp - L.cur)} / ${fmt(L.next - L.cur)} XP para o nível ${L.level + 1}`}</small></span>
        </button>
        <button class="prof2__fire${o.days >= 30 ? ' is-blue' : o.days >= 7 ? ' is-hot' : ''}" data-tab="numeros" aria-label="Ofensiva"><span class="fire fire--sm"><i></i><i></i><i></i><i class="fire__core"></i></span><b>${o.days}</b><small>${o.days === 1 ? 'dia' : 'dias'}</small></button>
        ${mascotOn() ? `<span class="prof2__snh" aria-hidden="true">${sininho('acena', { size: 62 })}</span>` : ''}
      </div>
      <div class="prof2__btns">
        <button data-edit>Editar perfil</button>
        <button data-share>Compartilhar perfil</button>
        <button class="is-ic" data-action="friends" aria-label="Amigos">${icon('users', 19)}</button>
      </div>
      <div class="prof2__hl">
        <button class="prof2__hlit" data-meustory><span class="prof2__hlc${ms ? ' has-story' : ''}">${ms ? icon('camera', 24) : icon('plus', 26)}</span><small>${ms ? 'Seu story' : 'Novo story'}</small></button>
        <button class="prof2__hlit" data-action="ranking"><span class="prof2__hlc is-rk">${icon('trophy', 24)}</span><small>Ranking</small></button>
        ${earned.slice(0, 8).map((b) => `<button class="prof2__hlit" data-badge="${b.id}"><span class="prof2__hlc">${badgeArt(b, 56)}</span><small>${esc(b.name())}</small></button>`).join('')}
      </div>`;
      })()}
      <div class="prof__tabs" role="tablist">
        <button role="tab" class="${cur === 'emblemas' ? 'is-on' : ''}" data-tab="emblemas" aria-label="Emblemas">${icon('grid', 20)}</button>
        <button role="tab" class="${cur === 'niveis' ? 'is-on' : ''}" data-tab="niveis" aria-label="Níveis">${icon('trophy', 20)}</button>
        <button role="tab" class="${cur === 'numeros' ? 'is-on' : ''}" data-tab="numeros" aria-label="Ofensiva e números">${icon('flame', 20)}</button>
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
      alive();
      { const f = el.querySelector('.ofs__snh [data-snh]'); if (f) vivo(f, { gestos: ['pisca', 'olhaLados', 'riso', 'sim'] }); }
      // os Lembras dos números: um gesto calmo de vez em quando (piscar, olhar, pensar), cada um no seu tempo
      clearInterval(a._peek);
      a._peek = setInterval(() => {
        if (!el.isConnected) return clearInterval(a._peek);
        const all = [...el.querySelectorAll('.pn2__peek[data-g]:not([data-g=""])')];
        const one = all[Math.floor(Math.random() * all.length)];
        if (one) act(one.querySelector('[data-snh]'), one.dataset.g);
      }, 2600);
      el.addEventListener('click', (ev) => { if (ev.target.closest('[data-replay-streak]')) import('../streak.js').then((m) => m.showStreak(Math.max(1, G.offensive().days))); });
      el.querySelectorAll('[data-tab]').forEach((b) => (b.onclick = () => { cur = b.dataset.tab; a.set(html()); el.querySelector('.prof__tabs')?.scrollIntoView({ block: 'start', behavior: 'smooth' }); }));
      el.querySelectorAll('[data-cat]').forEach((b) => (b.onclick = () => { cat = b.dataset.cat; a.set(html()); }));
      el.querySelectorAll('[data-badge]').forEach((b) => (b.onclick = () => badgeDetail(b.dataset.badge)));
      el.querySelectorAll('[data-edit]').forEach((b) => (b.onclick = () => openEditProfile(() => a.set(html()))));
      el.querySelector('[data-pic]').onclick = () => photoActions(() => a.set(html()));
      const msb = el.querySelector('[data-meustory]'); if (msb) msb.onclick = () => { const ms = meuStory(); if (ms) openViewer(ms.uid, () => { if (!a.closed) a.set(html()); }); else comoPostar(); };
      { const f = el.querySelector('.prof2__snh [data-snh]'); if (f) vivo(f, { aponta: el.querySelector('[data-share]'), gestos: ['pisca', 'olhaLados', 'riso', 'sobrancelha'], cada: [4, 8] }); }
      const sh = el.querySelector('[data-share]');
      if (sh) sh.onclick = () => import('../friends.js').then((m) => m.openShareChoice());
    },
  });
  const off = G.onGame(() => { if (!api.closed) api.set(html()); else off(); });
  if (store.mode === 'cloud') refreshFeed().then(() => { if (!api.closed) api.set(html()); }).catch(() => {}); // o anel do story na foto
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
  const ms = meuStory(), fp = fotoPendente();
  const nViews = ms ? ms.stories.reduce((t, x) => t + (x.views || 0), 0) : 0;
  const row = (attr, ic, cls, t, sub = '') => `<button class="phm__row" ${attr}><span class="phm__ic ${cls}">${icon(ic, 21)}</span><span class="phm__t"><b>${t}</b>${sub ? `<small>${sub}</small>` : ''}</span>${icon('right', 16)}</button>`;
  const a = openSheet({
    className: 'sheet--actions sheet--phm',
    html: `<div class="phm">
      <div class="phm__head"><span class="phm__pic${ms ? ' has-story' : ''}"><span>${avatar(store.me, 84)}</span></span><b>Sua foto e seus stories</b><small>Amigos veem sua foto, nível e stories</small></div>
      <div class="phm__grp">
        ${ms ? row('data-vermeus', 'eye', 'is-story', 'Ver seus stories', `${ms.stories.length} ${ms.stories.length === 1 ? 'story no ar' : 'stories no ar'} · ${nViews} ${nViews === 1 ? 'visualização' : 'visualizações'}`) : ''}
        ${row('data-postar', 'camera', 'is-cam', ms ? 'Postar outro story' : 'Postar story', fp ? `Foto de “${esc(fp.title)}” · +${fp.P.total} XP agora` : 'Câmera ou galeria · só seus amigos veem')}
      </div>
      <div class="phm__grp">
        ${me.photo ? row('data-view', 'image', 'is-n', 'Ver foto') : ''}
        ${me.photo ? row('data-ajusta', 'edit', 'is-n', 'Ajustar foto', 'Recortar e reposicionar') : ''}
        <label class="phm__row"><span class="phm__ic is-n">${icon('camera', 21)}</span><span class="phm__t"><b>Tirar foto</b></span>${icon('right', 16)}<input type="file" accept="image/*" capture="user" data-file hidden></label>
        <label class="phm__row"><span class="phm__ic is-n">${icon('image', 21)}</span><span class="phm__t"><b>Escolher da galeria</b></span>${icon('right', 16)}<input type="file" accept="image/*" data-file hidden></label>
        ${me.photo ? row('data-del', 'trash', 'is-del', '<span class="is-danger">Remover foto</span>') : ''}
      </div>
      <button class="phm__cancel" data-close>Cancelar</button>
    </div>`,
    onMount: (x) => {
      const usa = async (f) => {
        const url = await cropper(f);
        if (!url) return;
        try { await saveMyProfile({ photo: url }); toast('Foto atualizada ✓'); after && after(); }
        catch { toast('Não consegui salvar agora. Verifique a internet.'); }
      };
      x.el.querySelectorAll('[data-file]').forEach((inp) => (inp.onchange = () => { const f = inp.files && inp.files[0]; if (!f) return; x.close(); usa(f); }));
      const vm = x.el.querySelector('[data-vermeus]'); if (vm) vm.onclick = () => { x.close(); openViewer(ms.uid, after); };
      x.el.querySelector('[data-postar]').onclick = () => { x.close(); comoPostar(after); };
      const v = x.el.querySelector('[data-view]'); if (v) v.onclick = () => { x.close(); viewPhoto(me.photo); };
      const aj = x.el.querySelector('[data-ajusta]'); if (aj) aj.onclick = async () => { x.close(); try { const blob = await (await fetch(me.photo)).blob(); usa(new File([blob], 'foto.jpg', { type: blob.type || 'image/jpeg' })); } catch { toast('Não consegui abrir a foto atual.'); } };
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
