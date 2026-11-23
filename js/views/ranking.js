/* Ranking mundial do Lembra: ESTE MÊS (zera todo dia 1º) e GERAL (XP desde sempre).
   Pódio com os 3 primeiros, a sua posição em destaque (ex.: 599º de 2.340) com os pontos,
   quanto falta para passar quem está logo acima e a lista de quem está no topo. */
import { rankHidden, isTeen } from '../teen.js';
import { store, saveUserProfile } from '../store.js';
import { openSheet, sheetHead, toast } from '../components.js';
import { icon } from '../icons.js';
import { esc } from '../utils.js';
import { mascotOn } from '../mascote.js';
import { sininho, alive, vivo } from '../sininho.js';

const fmt = (n) => Number(n || 0).toLocaleString('pt-BR');
const MONTHS = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
const daysLeft = () => { const d = new Date(); const end = new Date(d.getFullYear(), d.getMonth() + 1, 1); return Math.max(1, Math.ceil((end - d) / 864e5)); };
let ST = null; import('../stories.js').then((m) => { ST = m; }).catch(() => {});
const anel = (p) => { const r = ST && ST.feedCache().rows.find((x) => x.uid === p.uid && x.stories.length); return r ? (r.stories.some((x) => !x.seen) ? ' rkstory' : ' rkstory is-seen') : ''; };
const abre = (p) => (p.uid && p.name !== 'Pessoa anônima' ? ` data-uid="${esc(p.uid)}" role="button" tabindex="0"` : '');
const face = (p, size) => p.photo
  ? `<span class="rkface${anel(p)}" style="--s:${size}px"><img src="${p.photo}" alt="" loading="lazy"></span>`
  : `<span class="rkface${anel(p)}" style="--s:${size}px;background:${esc(p.color || '#7C5CFF')}">${esc((p.name || '?').charAt(0).toUpperCase())}</span>`;
const flame = (n) => (n > 0 ? `<i class="rkfire${n >= 30 ? ' is-blue' : n >= 7 ? ' is-hot' : ''}">${icon('flame', 12)}${n}</i>` : '');

export async function openRanking({ kind = 'month' } = {}) {
  const G = await import('../game.js');
  const { leCache, gravaCache } = await import('../cache.js');
  let cur = kind, data = { month: leCache('rk.month', 864e5), all: leCache('rk.all', 864e5) }, err = '';
  const load = async (k, a) => {
    try { const { api } = await import('../avisos.js'); data[k] = await api('/lb/board', { kind: k, limit: 50 }); gravaCache(`rk.${k}`, data[k], 1200000); err = ''; }
    catch (e) { err = e.message || 'Sem conexão agora.'; }
    if (!a.closed) a.set(html());
  };
  const html = () => {
    const d = data[cur];
    const tabs = `<div class="rktabs" role="tablist">
      <button role="tab" class="${cur === 'month' ? 'is-on' : ''}" data-k="month">${icon('calendar', 16)} Este mês</button>
      <button role="tab" class="${cur === 'all' ? 'is-on' : ''}" data-k="all">${icon('trophy', 16)} Geral</button></div>`;
    if (!d) return `${sheetHead('Ranking', { left: '<button class="btn-text" data-close>Fechar</button>' })}<div class="page page--sheet rk">${tabs}${err ? `<p class="fhelp">${esc(err)}</p>` : '<div class="rkload"><i></i><i></i><i></i></div>'}</div>`;
    const me = d.me, L = G.levelInfo(), off = G.offensive();
    const top3 = d.top.slice(0, 3), rest = d.top.slice(3);
    const order = [top3[1], top3[0], top3[2]];
    const podium = top3.length ? `<div class="rkpod">${order.map((p, i) => p ? `<div class="rkpod__it rkpod__it--${[2, 1, 3][i]}${p.uid === me?.uid ? ' is-me' : ''}"${abre(p)}>
        ${[2, 1, 3][i] === 1 ? `<span class="rkcrown">${icon('crown', 22)}</span>` : ''}
        ${face(p, [2, 1, 3][i] === 1 ? 76 : 60)}
        <b>${esc(p.name)}</b><small>${fmt(p.points)} XP</small>
        <span class="rkpod__base"><em>${[2, 1, 3][i]}º</em></span></div>` : '<div class="rkpod__it rkpod__it--empty"></div>').join('')}</div>` : '';
    const mine = me && me.pos ? `<div class="rkme">
        <div class="rkme__pos"><small>Sua posição</small><b>${fmt(me.pos)}º</b><span>de ${fmt(d.total)}</span></div>
        <div class="rkme__info"><b>${fmt(me.points)} XP</b><small>${cur === 'month' ? `ganhos em ${MONTHS[new Date().getMonth()]}` : `nível ${L.level} · ${esc(L.tier.name())}`}</small>
          ${d.above ? `<small class="rkme__next">Faltam <b>${fmt(d.above.points - me.points + 1)} XP</b> para passar ${esc(d.above.name)}</small>` : me.pos === 1 ? `<small class="rkme__next">${icon('crown', 13)} Você é o 1º lugar!</small>` : ''}</div>
        ${off.days ? `<div class="rkme__fire">${icon('flame', 16)}<b>${off.days}</b><small>${off.days === 1 ? 'dia' : 'dias'}</small></div>` : ''}</div>`
      : `<div class="rkme rkme--out"><div class="rkme__info"><b>Você ainda não entrou ${cur === 'month' ? 'no ranking deste mês' : 'no ranking'}</b><small>Conclua um compromisso ou um lembrete para ganhar XP e aparecer aqui.</small></div></div>`;
    const row = (p) => `<div class="rkrow${p.uid === me?.uid ? ' is-me' : ''}"${abre(p)}><span class="rkrow__pos">${fmt(p.pos)}</span>${face(p, 40)}
      <span class="rkrow__id"><b>${esc(p.name)}${p.vip ? ` <i class="rkvip">${icon('crown', 11)}</i>` : ''}</b><small>Nível ${p.level}${p.streak ? ' · ' : ''}${flame(p.streak)}</small></span><span class="rkrow__pts">${fmt(p.points)}<small>XP</small></span></div>`;
    const meOutsideTop = me && me.pos && me.pos > d.top.length;
    const mes = MONTHS[new Date().getMonth()], dl = daysLeft();
    const confete = '<span class="rkconf" aria-hidden="true">' + Array.from({ length: 14 }, (_, i) => `<i style="--i:${i};top:${(i * 37) % 70}px"></i>`).join('') + '</span>';
    return `${sheetHead('Ranking', { left: '<button class="btn-text" data-close>Fechar</button>' })}
    <div class="page page--sheet rk">
      ${tabs}
      <div class="rkhero">
        <div class="rkhero__fig">${mascotOn() ? sininho('comemora', { size: 150 }) + `<span class="rkhero__trofeu">${icon('trophy', 34)}</span>` : `<span class="rkhero__big">${icon('trophy', 64)}</span>`}</div>
        <div class="rkhero__txt"><h3>${cur === 'month' ? `Quem mais ganhar XP em ${mes} fica no topo.` : 'Todo o XP que cada pessoa já ganhou, desde sempre.'}</h3>
          ${cur === 'month' ? `<span class="rkpill">${icon('refresh', 13)} Reinicia em ${dl} ${dl === 1 ? 'dia' : 'dias'}</span>` : `<span class="rkpill">${icon('infinity', 13)} Ranking geral</span>`}</div>
      </div>
      ${mine}
      ${d.total ? `<div class="rkstage">${confete}${podium}</div>` : `<div class="rkempty">${icon('trophy', 40)}<b>Ninguém pontuou ainda ${cur === 'month' ? 'neste mês' : ''}</b><small>Seja a primeira pessoa do ranking!</small></div>`}
      ${rest.length ? `<div class="rklist">${rest.map(row).join('')}</div>` : ''}
      ${meOutsideTop ? `<div class="rklist rklist--me"><div class="rkgap">· · ·</div>${row(me)}</div>` : ''}
      <button class="rkleague" data-league>${icon('trophy', 18)}<span><b>Liga semanal com prêmios</b><small>Para assinantes do plano mensal: o 1º do mês ganha o mês seguinte grátis</small></span>${icon('right', 16)}</button>
      <label class="rkpriv"><input type="checkbox" data-hide ${rankHidden() ? 'checked' : ''}><span>Aparecer sem nome e sem foto (anônimo)${isTeen() ? ' · ligado por padrão para menores de 18' : ''}</span></label>
      <p class="rkhow">Como ganhar XP: concluir no horário +20 · atrasado +8 · lembrete do Pessoal +12 · marcar compromisso +5 · abrir o app no dia +10 · dia 100% +40 · cada emblema dá XP extra.</p>
    </div>`;
  };
  const a = openSheet({
    className: 'sheet--tall sheet--rk',
    html: html(),
    onMount: (x) => {
      alive();
      { const f = x.el.querySelector('.rkhero__fig [data-snh]'); if (f) vivo(f, { gestos: ['pisca', 'riso', 'olhaLados', 'sim', 'sobrancelha'], aponta: x.el.querySelector('.rkme, .rk__me, [data-uid]') }); }
      x.el.querySelectorAll('[data-uid]').forEach((b) => (b.onclick = () => import('../friends.js').then((m) => m.openPublicProfile(b.dataset.uid))));
      x.el.querySelectorAll('[data-k]').forEach((b) => (b.onclick = () => { cur = b.dataset.k; x.set(html()); if (!data[cur]) load(cur, x); }));
      const lg = x.el.querySelector('[data-league]');
      if (lg) lg.onclick = async () => (await import('./league.js')).openLeague();
      const h = x.el.querySelector('[data-hide]');
      if (h) h.onchange = async () => {
        try { await saveUserProfile({ rankHide: h.checked }); await G.reportRankNow(); toast(h.checked ? 'Você aparece como anônimo no ranking' : 'Seu nome e foto aparecem no ranking'); data = { month: null, all: null }; load(cur, x); }
        catch { toast('Não consegui salvar agora.'); }
      };
    },
  });
  await G.reportRankNow(); // garante que a sua posição está em dia antes de mostrar
  load(cur, a);
  return a;
}
