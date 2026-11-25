/* Modo Pessoal: um "outro app" dentro do Calendário. Visual, telas e menu próprios,
   mesmo login. Só o dono vê o que está aqui (nem o parceiro, nem o trabalho). */
import { avisaApagado, listaHtml } from '../lixeira.js';
import { disposicao, acessorios, fraseDaHora } from '../hora.js';
import { botaoMensagens } from '../social.js';
import { ajudante, ajudanteHtml } from '../ajudante.js';
import { cena, boneco3d, momento } from '../cena.js';
import { postStory } from '../stories.js';
import { itemLook, roupaDe } from '../itemicons.js';
import { roupa } from '../roupas.js';
import { okFx } from '../okfx.js';
import {
  personal, CATS, REPEATS, LIST_PRESETS, occurrences, overdue, savePersonal, removePersonal, toggleDone, parseQuick,
  doneOn, birthdays, phraseOfDay, quoteOfDay, addMemo, guessCat, newList, addEntry, toggleEntry, removeEntry, clearDone, savePrefs, LIST_ICONS, listIcon,
} from '../personal.js';
import { modoSwitch, openSheet, sheetHead, toast, confirmDialog, avatar, meRing } from '../components.js';
import { isMarketing } from '../constants.js';
import { icon } from '../icons.js';
import { store } from '../store.js';
import { ui, saveUi } from '../ui.js';
import * as push from '../avisos.js';
import { usagePlaceholder, fillUsage } from '../usage.js';
import { onDone, streak } from '../reward.js';
import { suggestions, addSuggestion, hideSuggestion, forYouLead } from '../foryou.js';
import { agruparInicio } from '../inicio-pessoal.js';
import { sininho, greetLine, interactive, say, alive, vivo, veste } from '../sininho.js';
import { offensive } from '../game.js';
import { esc, todayKey, addDays, dayLabel, fmtTime, fromKey, toKey, diffDays, greeting, fmtDayLong, monthKey, addMonths, fmtMonth, fmtDayShort, WD_SHORT, WD_LETTER, MONTHS } from '../utils.js';

const firstName = () => store.member(store.me)?.name || '';
/* Ícone profissional num bloco em degradê (estilo iOS) */
export const tile = (ic, g, size = 40, cls = '') => `<span class="ptile ${cls}" style="--s:${size}px;--g1:${g[0]};--g2:${g[1]}">${icon(ic, Math.round(size * 0.52))}</span>`;
const catTile = (cat, size = 40) => { const c = CATS[cat] || CATS.lembrete; return tile(c.ic, c.g, size); };
/* ícone de cada coisa pelo que está escrito (cabelo → secador, conta de luz → lâmpada…); senão, o da categoria */
const itemTile = (it, size = 40) => { const l = it.cat !== 'aniversario' && itemLook(it.title || '', it.note || ''); return l ? tile(l.ic, l.g, size) : catTile(it.cat, size); };
const listTile = (l, size = 40) => { const k = listIcon(l); return tile(k, LIST_ICONS[k].g, size); };

/* ---------- peças ---------- */
const row = (it, date, done, { showDate = false, selo = '' } = {}) => {
  const c = CATS[it.cat] || CATS.lembrete;
  const age = it.cat === 'aniversario' && it.birthYear ? ` · faz ${+date.slice(0, 4) - it.birthYear} anos` : '';
  const when = showDate ? `${dayLabel(date)}${it.time ? ' · ' + fmtTime(it.time) : ''}` : it.time ? fmtTime(it.time) : 'Qualquer hora';
  return `<div class="prow${done ? ' is-done' : ''}" style="--pc:${c.color}" data-action="p-open" data-id="${it.id}" data-date="${date}">
    ${itemTile(it, 40)}
    <div class="prow__body"><strong>${esc(it.title)}</strong><small>${esc(when)}${esc(age)}${it.repeat && it.repeat !== 'none' && !selo ? ` · ${icon('repeat', 11)}` : ''}${it.note ? ' · ' + esc(it.note.slice(0, 40)) : ''}</small>${selo ? seloHtml(selo) : ''}</div>
    <button class="prow__check${done ? ' is-on' : ''}" data-action="p-done" data-id="${it.id}" data-date="${date}" aria-label="${done ? 'Desmarcar' : 'Feito'}">${icon('check', 15)}</button>
  </div>`;
};
const section = (title, html, extra = '') => `<section class="block"><h2 class="block__title">${title}${extra}</h2>${html}</section>`;
const HUMOR = { sun: 'feliz', cake: 'comemora', sparkles: 'acena', listcheck: 'acena', note: 'feliz' };
const emptyCard = (ic, title, text) => `<div class="pempty"><span class="vazio__fig">${sininho(HUMOR[ic] || 'acena', { size: 96 })}</span><h3>${esc(title)}</h3><p>${esc(text)}</p></div>`;

const header = (eyebrow, title, right = '', modo = false) => `
  <header class="phdr">
    ${modo ? workBtn : ''}
    <div class="phdr__row">
      <div><p class="phdr__eyebrow">${eyebrow}</p><h1>${title}</h1></div>
      <div class="phdr__actions">${right}</div>
    </div>
  </header>`;
const workBtn = modoSwitch('personal');

/* ---------- grupos do Início: cada coisa uma vez só ---------- */
const diaCurto = (k) => fmtDayShort(k).toLowerCase();
const grupo = (t, lado, html) => `<section class="block pgrupo"><h2 class="pgrupo__t">${t}<small>${esc(lado)}</small></h2>${html}</section>`;
const calma = (t, rot = []) => `<p class="pcalma">${rot.slice(0, 3).map((r) => itemTile(r.item, 28)).join('')}<span>${esc(t)}</span></p>`;
const seloHtml = (s) => `<span class="pselo">${icon('repeat', 13)} ${esc(s)}</span>`;
const bola = (it, date, on) => `<button class="prow__check${on ? ' is-on' : ''}" data-action="p-done" data-id="${it.id}" data-date="${date}" aria-label="${on ? 'Desmarcar' : 'Feito'}">${icon('check', 15)}</button>`;
function rotina(R) {
  if (!R.length) return ''; const n = R.filter((r) => r.feitoHoje).length, mais = R.length > 4 && !ui.rotinaTudo, L = mais ? R.slice(0, 4) : R;
  return `<div class="protina"><div class="protina__h"><span>Rotina diária</span><b>${n} de ${R.length} feita${R.length > 1 ? 's' : ''}</b></div>${L.map((r) => `<div class="protina__l${r.feitoHoje ? ' is-done' : ''}" style="--pc:${(CATS[r.item.cat] || CATS.lembrete).color}" data-action="p-open" data-date="${r.date}" data-id="${r.item.id}">${itemTile(r.item, 34)}<span><strong>${esc(r.item.title)}</strong>${seloHtml(r.selo)}</span>${bola(r.item, r.date, r.feitoHoje)}</div>`).join('')}${mais ? `<button class="protina__m" data-action="p-rotina">+${R.length - 4} na rotina ›</button>` : ''}</div>`;
}
function destaque(o) {
  const it = o.item, n = diffDays(todayKey(), o.date), d = fromKey(o.date);
  return `<div class="pdest" data-action="p-open" data-id="${it.id}" data-date="${o.date}"><span class="pdest__d"><small>${WD_SHORT[d.getDay()]}</small><b>${d.getDate()}</b></span><span class="pdest__c"><em>${n === 1 ? 'Amanhã' : `Em ${n} dias`}</em><strong>${esc(it.title)}</strong><small>${itemTile(it, 24)} ${esc([it.time ? fmtTime(it.time) : 'Qualquer hora', it.note ? it.note.slice(0, 40) : ''].filter(Boolean).join(' · '))}</small></span>${bola(it, o.date, o.done)}</div>`;
}
const lista = (L, dest) => `${dest && L.includes(dest) ? destaque(dest) : ''}${L.filter((o) => o !== dest).length ? `<div class="plist">${L.filter((o) => o !== dest).map((o) => row(o.item, o.date, o.done, { ...o, showDate: true })).join('')}</div>` : ''}`;

/* ---------- Hoje ---------- */
function renderHome() {
  const t = todayKey();
  const late = overdue();
  const G = agruparInicio(personal.events, new Date());
  const today = [...G.rotina.map((r) => ({ item: r.item, date: t, done: r.feitoHoje })), ...G.hoje];
  const bdays = birthdays().filter((b) => diffDays(t, b.next) <= 45).slice(0, 8);
  const pending = today.filter((o) => !o.done).length;
  const lists = personal.lists;
  const quickCats = ['aniversario', 'beleza', 'buscar', 'saude', 'pagar', 'compromisso'];
  return `
  ${header(`${icon('lock', 11)} Só você vê`, `${esc(greeting())}${firstName() ? ', ' + esc(firstName()) : ''}`, `${botaoMensagens()}<button class="iconbtn iconbtn--ai" data-action="assistant" aria-label="Assistente">${icon('sparkle', 19)}</button><button class="iconbtn iconbtn--me" data-action="profile" aria-label="Seu perfil e conquistas">${store.me ? meRing(store.me, 32) : icon('user', 20)}</button>`, true)}
  <div class="page ppage">
    ${personal.error === 'rules' ? `<div class="palert">${tile('alert', ['#FF8A7A', '#E5341F'], 36)}<div><strong>O Pessoal ainda não está liberado na nuvem</strong><small>O que você anota não fica salvo. No Firebase: Firestore → Regras → cole as regras novas → Publicar. Depois feche e abra o app.</small></div></div>` : personal.error === 'net' ? `<div class="palert">${tile('alert', ['#FFB547', '#FF7A1A'], 36)}<div><strong>Sem conexão com a nuvem</strong><small>Confira a internet. O que você anotar aparece quando a conexão voltar.</small></div></div>` : ''}
    <div class="pcena">${cena()}${(() => { const base = late.length ? 'desconfiado' : !pending && today.length ? 'comemora' : 'feliz', d = disposicao(base); return `<span class="pcena__fig pcena__fig--snh" data-hr-fig data-base="${base}">${sininho(d.mood, { size: 128 })}${acessorios(d)}</span>`; })()}<p class="pcena__bal">${late.length ? (late.length === 1 ? 'Ficou 1 coisa pra trás. Bora juntos?' : `Ficaram ${late.length} pra trás. Bora juntos?`) : !pending && today.length ? 'Tudo feito hoje. Que orgulho!' : pending ? `${pending === 1 ? 'Uma coisa' : `${pending} coisas`} pra hoje. Eu te lembro na hora.` : fraseDaHora()}${(() => { const q = quoteOfDay(t); return q.t.length < 90 ? `<small>“${esc(q.t)}”</small>` : ''; })()}</p></div>
    <form class="pquick" data-form="pquick" onsubmit="return false">
      ${icon('sparkle', 18)}
      <input name="q" placeholder="Marque, anote ou pergunte…" aria-label="Falar com o assistente" autocomplete="off" enterkeyhint="send" maxlength="400">
      <button class="pquick__go" aria-label="Enviar para o assistente">${icon('right', 18)}</button>
    </form>
    ${late.length || bdays.some((b) => diffDays(t, b.next) <= 7) ? `<div class="phero__stats">
        <span>${icon('cal2', 14)}<b>${pending}</b> para hoje</span>
        ${streak().days >= 2 ? `<span>🔥<b>${streak().days}</b> dias seguidos</span>` : ''}
        ${late.length ? `<button class="is-warn" data-action="atrasados">${icon('alert', 14)}<b>${late.length}</b> atrasad${late.length > 1 ? 'os' : 'o'} ›</button>` : ''}
        ${bdays.some((b) => diffDays(t, b.next) <= 7) ? `<span>${icon('cake', 14)}<b>${bdays.filter((b) => diffDays(t, b.next) <= 7).length}</b> aniversário${bdays.filter((b) => diffDays(t, b.next) <= 7).length > 1 ? 's' : ''} na semana</span>` : ''}
      </div>` : ''}
    ${late.length ? section('<span style="color:var(--danger)">Ficou pra trás</span>', `<div class="plist">${late.map((it) => row(it, it.date, false, { showDate: true })).join('')}</div>`) : ''}
    ${grupo('Hoje', diaCurto(t), `${rotina(G.rotina)}${G.hoje.length ? `<div class="plist">${G.hoje.map((o) => row(o.item, o.date, o.done, o)).join('')}</div>` : G.rotina.length ? '' : calma('Nada por aqui. Escreva no campo acima ou toque num atalho.')}`)}
    ${grupo('Amanhã', G.amanha.length ? diaCurto(addDays(t, 1)) : G.rotina.length ? 'só a rotina, dia livre' : 'dia livre', G.amanha.length ? lista(G.amanha, G.destaque) : '')}
    ${grupo('Esta semana', `até ${diaCurto(addDays(t, 7))}`, G.semana.length ? lista(G.semana, G.destaque) : calma('Nada marcado ainda.'))}
    ${G.depois.length ? grupo('Depois', `a partir de ${diaCurto(addDays(t, 8))}`, `${lista(G.depois)}${G.maisDepois ? `<button class="btn-text" data-action="ptab" data-tab="p-agenda">Ver na Agenda ›</button>` : ''}`) : ''}

    <div class="pchips pchips--ini">${quickCats.slice(0, 4).map((k) => `<button class="pchip" data-action="p-new" data-cat="${k}">${catTile(k, 24)}${esc(CATS[k].label)}</button>`).join('')}</div>
    ${bdays.length ? section(`<span class="ptitle">${tile('cake', CATS.aniversario.g, 26)}Aniversários chegando</span>`, `<div class="pbdays">${bdays.map((b) => {
      const d = diffDays(t, b.next);
      return `<button class="pbday" data-action="p-open" data-id="${b.item.id}" data-date="${b.next}">
        ${tile('gift', CATS.aniversario.g, 34)}
        <span class="pbday__when">${d === 0 ? 'Hoje!' : d === 1 ? 'Amanhã' : `em ${d} dias`}</span>
        <strong>${esc(b.item.title.replace(/^anivers[aá]rio (d[aoe] )?/i, ''))}</strong>
        <small>${Number(b.next.slice(8))} de ${MONTHS[+b.next.slice(5, 7) - 1]}${b.age ? ` · ${b.age} anos` : ''}</small>
      </button>`;
    }).join('')}</div>`) : ''}

    ${lists.length ? section('Listas', `<div class="pgrid">${lists.slice(0, 4).map(listCard).join('')}</div>`, `<button class="btn-text btn-text--sm" data-action="ptab" data-tab="p-listas">Ver todas</button>`) : ''}
    ${forYou()}
    <div style="height:28px"></div>
  </div>`;
}

/* "Feito para você": sugestões calculadas pela ficha (idade, identidade, dificuldades, rotina) */
function forYou() {
  const list = suggestions(2);
  if (!list.length) return '';
  return `<section class="block foryou">
    <h2 class="block__title"><span class="ptitle">${tile('sparkles', ['#C78BFF', '#7C5CFF'], 26)}Feito para você</span></h2>
    <p class="foryou__lead">${esc(forYouLead())}</p>
    ${!(store.profile?.likes || []).length ? `<button class="foryou__likes" data-action="p-likes">${icon('heart', 16)}<span><b>Conte o que você curte</b><small>Leitura, academia, música, cozinhar… e as sugestões ficam do seu gosto</small></span>${icon('right', 16)}</button>` : ''}
    <div class="foryou__list">${list.map((x) => `<div class="foryou__item">
      <div class="foryou__add">${itemLook(x.title || '') ? itemTile({ title: x.title, cat: x.cat }, 36) : x.ic ? tile(x.ic, x.g, 36) : catTile(x.cat, 36)}<span><b>${esc(x.title)}</b><small>${esc(x.why)}</small></span><button class="foryou__plus" data-action="p-sug" data-id="${x.id}" aria-label="Adicionar ${esc(x.title)}">${icon('plus', 16)}</button></div>
      <button class="foryou__x" data-action="p-sug-x" data-id="${x.id}" aria-label="Não quero esta sugestão">${icon('x', 14)}</button>
    </div>`).join('')}</div>
  </section>`;
}

/* ---------- Agenda (mês + aniversários) ---------- */
function renderAgenda() {
  const t = todayKey();
  const mk = ui.pMonth || monthKey(t);
  const sel = ui.pSel || t;
  const view = ui.pView || 'mes';
  const seg = `<div class="pseg"><button class="${view === 'mes' ? 'is-on' : ''}" data-action="pview" data-v="mes">Mês</button><button class="${view === 'niver' ? 'is-on' : ''}" data-action="pview" data-v="niver">Aniversários</button></div>`;
  if (view === 'niver') {
    const all = birthdays();
    const byMonth = {};
    all.forEach((b) => (byMonth[b.item.date.slice(5, 7)] = byMonth[b.item.date.slice(5, 7)] || []).push(b));
    const order = Array.from({ length: 12 }, (_, i) => String(((+t.slice(5, 7) - 1 + i) % 12) + 1).padStart(2, '0'));
    return `${header(`${icon('lock', 11)} Só você vê`, 'Agenda', '', true)}
    <div class="page ppage">${seg}
      ${all.length ? order.filter((m) => byMonth[m]).map((m) => section(MONTHS[+m - 1].replace(/^./, (c) => c.toUpperCase()), `<div class="plist">${byMonth[m].sort((a, b) => (a.item.date.slice(8) < b.item.date.slice(8) ? -1 : 1)).map((b) => {
        const d = diffDays(t, b.next);
        return `<div class="prow" style="--pc:${CATS.aniversario.color}" data-action="p-open" data-id="${b.item.id}" data-date="${b.next}">${catTile('aniversario', 40)}<div class="prow__body"><strong>${esc(b.item.title)}</strong><small>Dia ${Number(b.item.date.slice(8))}${b.age ? ` · vai fazer ${b.age}` : ''} · ${d === 0 ? 'hoje!' : `em ${d} dia${d > 1 ? 's' : ''}`}</small></div></div>`;
      }).join('')}</div>`)).join('') : emptyCard('cake', 'Nenhum aniversário', 'Escreva “aniversário da Maria 25/12” e ele repete todo ano, com aviso na véspera e no dia.')}
      <div style="height:28px"></div></div>`;
  }
  const [y, m] = mk.split('-').map(Number);
  const first = new Date(y, m - 1, 1);
  const start = toKey(new Date(y, m - 1, 1 - first.getDay()));
  const occ = occurrences(start, addDays(start, 41));
  const cells = Array.from({ length: 42 }, (_, i) => addDays(start, i));
  const dayList = occurrences(sel, sel);
  return `${header(`${icon('lock', 11)} Só você vê`, 'Agenda', '', true)}
  <div class="page ppage">${seg}
    <div class="pmonth" data-swipe="pmonth">
      <div class="pmonth__head"><button class="iconbtn" data-action="pmonth" data-d="-1" aria-label="Mês anterior">${icon('left', 18)}</button><strong>${esc(fmtMonth(mk))}</strong><button class="iconbtn" data-action="pmonth" data-d="1" aria-label="Próximo mês">${icon('right', 18)}</button></div>
      <div class="month__wd">${WD_LETTER.map((l) => `<span>${l}</span>`).join('')}</div>
      <div class="pmonth__grid">${cells.map((k) => {
        const de = occ.filter((o) => o.date === k);
        return `<button class="pday${k.slice(0, 7) === mk ? '' : ' is-out'}${k === t ? ' is-today' : ''}${k === sel ? ' is-sel' : ''}" data-action="psel" data-k="${k}">
          <span class="pday__n">${Number(k.slice(8))}</span>
          <span class="pday__dots">${de.slice(0, 4).map((o) => `<i style="background:${(CATS[o.item.cat] || CATS.lembrete).color}"></i>`).join('')}</span>
        </button>`;
      }).join('')}</div>
    </div>
    ${section(esc(dayLabel(sel)), dayList.length ? `<div class="plist">${dayList.map((o) => row(o.item, o.date, o.done)).join('')}</div>` : emptyCard('sparkles', 'Nada nesse dia', 'Toque no + para anotar algo aqui.'), `<button class="btn-text btn-text--sm" data-action="p-new" data-date="${sel}">${icon('plus', 14)} Anotar</button>`)}
    <div style="height:28px"></div>
  </div>`;
}

/* ---------- Listas ---------- */
function listCard(l) {
  const total = (l.entries || []).length, open = (l.entries || []).filter((e) => !e.done).length;
  return `<button class="plistcard" data-action="p-list" data-id="${l.id}">
    ${listTile(l, 44)}
    <strong>${esc(l.name)}</strong>
    <small>${total ? `${open} pendente${open === 1 ? '' : 's'} de ${total}` : 'vazia'}</small>
  </button>`;
}
function renderLists() {
  const lists = personal.lists;
  const presets = LIST_PRESETS.filter((p) => !lists.some((l) => l.name.toLowerCase() === p.name.toLowerCase()));
  const memos = personal.memos;
  return `${header(`${icon('lock', 11)} Só você vê`, 'Listas', '', true)}
  <div class="page ppage">
    <button class="pmemocard" data-action="ptab" data-tab="p-notas">${tile('note', ['#FFB86B', '#FF7A59'], 44)}
      <span><strong>Notas</strong><small>${memos.length ? `Última: ${esc(memos[0].text.slice(0, 48))}` : 'O que você fez ou onde deixou as coisas, com dia e hora'}</small></span>${icon('right', 16)}</button>
    <button class="pmemocard" data-action="minhas-frases">${tile('sparkles', ['#FFB347', '#E85A0C'], 44)}
      <span><strong>Minhas frases</strong><small>As frases das notificações, prontas para postar</small></span>${icon('right', 16)}</button>
    ${lists.length ? `<div class="pgrid">${lists.map(listCard).join('')}<button class="plistcard plistcard--new" data-action="p-newlist">${icon('plus', 22)}<strong>Nova lista</strong></button></div>`
      : emptyCard('listcheck', 'Suas listas', 'Mercado, coisas pra fazer, ideias, presentes… tudo num lugar só, sem data.')}
    ${presets.length ? section('Começar rápido', `<div class="pchips">${presets.map((p) => `<button class="pchip" data-action="p-newlist" data-name="${esc(p.name)}" data-ic="${p.ic}">${tile(p.ic, LIST_ICONS[p.ic].g, 24)}${esc(p.name)}</button>`).join('')}<button class="pchip" data-action="p-newlist">${tile('plus', ['#B9B2C6', '#8A8296'], 24)}Outra</button></div>`) : ''}
    <div style="height:28px"></div>
  </div>`;
}

/* ---------- Notas: o que eu fiz / onde deixei (com dia e hora) ---------- */
function renderMemos() {
  const q = (ui.memoQ || '').trim().toLowerCase();
  const all = personal.memos;
  const list = q ? all.filter((m) => m.text.toLowerCase().includes(q)) : all;
  const days = [];
  for (const m of list) { const d = days[days.length - 1]; if (d && d.date === m.date) d.items.push(m); else days.push({ date: m.date, items: [m] }); }
  return `${header(`<button class="pback" data-action="ptab" data-tab="p-listas">${icon('left', 14)} Listas</button>`, 'Notas')}
  <div class="page ppage">
    <form class="memoadd" data-form="memo" autocomplete="off">
      <textarea name="t" rows="2" maxlength="500" placeholder="O que você fez ou onde deixou? Ex.: deixei o tênis em cima da mesa"></textarea>
      <button class="btn btn--primary" type="submit">${icon('plus', 18)} Anotar agora</button>
    </form>
    <p class="fhelp">Nota só guarda o texto: não aparece na agenda e não avisa. Para virar compromisso, toque em ${icon('cal2', 14)}.</p>
    ${all.length > 3 ? `<input class="input memosearch" type="search" placeholder="Procurar nas notas" data-memoq value="${esc(ui.memoQ || '')}">` : ''}
    ${days.length ? days.map((d) => section(esc(dayLabel(d.date)), `<div class="memos">${d.items.map((m) => `<div class="memo"><span class="memo__t">${esc(m.time ? fmtTime(m.time) : '')}</span><p>${esc(m.text)}</p><button class="iconbtn memo__x" data-action="memo-agenda" data-id="${esc(m.id)}" aria-label="Colocar na agenda">${icon('cal2', 17)}</button><button class="iconbtn memo__x" data-action="memo-del" data-id="${esc(m.id)}" aria-label="Apagar">${icon('trash', 16)}</button></div>`).join('')}</div>`)).join('')
      : q ? '<p class="fhelp">Nada encontrado.</p>' : emptyCard('note', 'Suas notas do dia a dia', 'Anote o que fez ou onde deixou as coisas. Ex.: “deixei a chave na gaveta da cozinha”, “paguei a conta de luz”.')}
    <div style="height:28px"></div>
  </div>`;
}

/* ---------- Ajustes do Pessoal ---------- */
function renderPSettings() {
  const me = store.member(store.me);
  const prefs = personal.prefs;
  const perm = push.permission();
  const install = push.needsInstall();
  const ok = perm === 'granted' && push.deviceRegistered();
  const totals = { events: personal.events.length, lists: personal.lists.length, bdays: birthdays().length };
  return `${header(`${icon('lock', 11)} Só você vê`, 'Ajustes')}
  <div class="page ppage">
    <div class="pprofile">
      ${me ? avatar(me.id, 56) : ''}
      <div><strong>${esc(me?.name || 'Você')}</strong><small>${esc(store.user?.email || '')}</small></div>
      ${store.solo ? `<button class="btn btn--soft btn--sm" data-action="edit-profile" style="margin-left:auto">Editar</button>` : ''}
    </div>
    <div class="glist"><button class="glist__row" data-action="space" data-space="work"><span class="glist__ic" style="--c:#1C1C1E">${icon('briefcase', 18)}</span><span class="glist__txt"><b>Ir para o Trabalho</b><small>${store.team.length > 1 ? (isMarketing() ? 'Agenda da dupla, empresas e clientes' : 'Agenda compartilhada da equipe') : isMarketing() ? 'Suas empresas e clientes' : 'Seus compromissos de trabalho'}</small></span>${icon('right', 16)}</button></div>

    ${section(`${icon('bell', 16)} Avisos no celular`, `
      <div class="pnotice ${ok ? 'is-ok' : 'is-warn'}">${ok ? '✅ Ligados neste celular.' : install ? '⚠️ No iPhone, abra o app pelo ícone da Tela de Início para receber avisos.' : perm === 'denied' ? '⚠️ Bloqueados. Ajustes do iPhone → Notificações → Lembra.' : '⚠️ Ainda não ligados neste celular.'}
        ${!ok && !install && perm !== 'denied' ? '<button class="btn btn--primary btn--sm" data-action="notify-enable">Ativar</button>' : ''}${install ? '<button class="btn btn--primary btn--sm" data-action="install-guide">Como instalar</button>' : ''}</div>
      <form class="list" data-form="pprefs" onsubmit="return false">
        <label class="list__row"><span><b>Lembretes</b><small>30 min antes, na hora e um “já fez?” depois</small></span><input type="checkbox" class="switch" name="reminders" ${prefs.reminders ? 'checked' : ''}></label>
        <label class="list__row"><span><b>Resumo às 8h</b><small>o que você tem hoje</small></span><input type="checkbox" class="switch" name="morning" ${prefs.morning ? 'checked' : ''}></label>
        <label class="list__row"><span><b>Boa noite, às 21h</b><small>o que vem amanhã, pra nada te pegar de surpresa</small></span><input type="checkbox" class="switch" name="night" ${prefs.night ? 'checked' : ''}></label>
        <label class="list__row"><span><b>Mensagens de ânimo</b><small>ao longo do dia: motivação, versículos e lembretes do que você anotou</small></span><input type="checkbox" class="switch" name="nudges" ${prefs.nudges ? 'checked' : ''}></label>
        <label class="list__row"><span><b>Frequência</b><small>das mensagens de ânimo</small></span><select class="input input--inline" name="freq"><option value="alta"${prefs.freq === 'alta' ? ' selected' : ''}>A cada 1h30</option><option value="normal"${prefs.freq === 'normal' ? ' selected' : ''}>A cada 1h30–2h30</option><option value="calma"${prefs.freq === 'calma' ? ' selected' : ''}>A cada 3–4h</option></select></label>
        <label class="list__row"><span><b>Beber água</b><small>de hora em hora, das 8h às 21h30</small></span><input type="checkbox" class="switch" name="water" ${prefs.water ? 'checked' : ''}></label>
        <label class="list__row"><span><b>Hora de comer</b><small>almoço e jantar</small></span><input type="checkbox" class="switch" name="meals" ${prefs.meals ? 'checked' : ''}></label>
        <label class="list__row"><span><b>Versículos e fé</b><small>uma palavra da Bíblia de manhã e à noite</small></span><input type="checkbox" class="switch" name="faith" ${prefs.faith ? 'checked' : ''}></label>
      </form>
      ${ok ? `<button class="btn btn--soft btn--block" data-action="notify-test">${icon('bell', 16)} Enviar aviso de teste</button><button class="btn btn--soft btn--block" data-action="p-nudge-test">${icon('sparkles', 16)} Receber uma mensagem agora</button>` : ''}`)}

    ${usagePlaceholder() ? section(`${icon('bell', 16)} Uso de hoje`, `${usagePlaceholder()}<p class="fhelp">Os avisos, a água, os versículos e os lembretes não gastam crédito: o servidor e as notificações são grátis. Só as mensagens escritas pela IA usam uma cota grátis diária; se ela acabar, as mensagens continuam chegando com textos prontos e a cota volta no dia seguinte.</p>`) : ''}

    ${section(`${icon('heart', 16)} Ícone próprio na Tela de Início`, `<div class="pcard"><p>Quer o Pessoal como se fosse outro app, com ícone próprio?</p>
      <ol><li>Abra este endereço no <b>Safari</b> com o modo Pessoal aberto.</li><li>Toque em <b>Compartilhar</b> → <b>Adicionar à Tela de Início</b>.</li><li>Vai aparecer o ícone <b>“Pessoal”</b>, que abre direto aqui. Entre com o mesmo e-mail e senha.</li></ol></div>`)}

    ${section(`${icon('lock', 16)} Privacidade`, `<div class="pcard"><p>Tudo aqui fica guardado só na sua conta: ${totals.events} anotaç${totals.events === 1 ? 'ão' : 'ões'}, ${totals.lists} lista${totals.lists === 1 ? '' : 's'} e ${totals.bdays} aniversário${totals.bdays === 1 ? '' : 's'}. ${store.team.length > 1 ? 'Nem o parceiro nem os clientes conseguem ver.' : 'Ninguém mais consegue ver: nem clientes, nem quem divide a agenda de trabalho com você.'}</p></div>`)}
    <button class="btn btn--soft btn--block" data-action="lixeira">${icon('trash', 16)} Lixeira (24 horas)</button>
    <button class="btn btn--soft btn--block" data-action="logout">Sair da conta</button>
    <div style="height:28px"></div>
  </div>`;
}

/* Sininho cumprimentando (a frase fica a mesma enquanto a situação do dia não muda) */
let greet = { key: '', g: null, typed: false };
function heroMascotHtml(pending, late) {
  let off = 0, offToday = true;
  try { const o = offensive(); off = o.days; offToday = o.today; } catch { /* ok */ }
  const h = new Date().getHours();
  const key = `${todayKey()}|${pending}|${late}|${off}|${offToday}|${h >= 23 || h < 5}`;
  if (greet.key !== key) greet = { key, g: greetLine({ first: (firstName() || '').split(' ')[0], pending, late, off, offToday }), typed: false };
  const fig = sininho(greet.g.mood, { size: 124 });
  return `<div class="snhwrap snhwrap--hero" data-snh-hero>${fig}<div class="snhb"><span class="snhb__txt">${greet.typed ? esc(greet.g.text) : ''}</span></div></div>`;
}
export function renderPersonalSpace() {
  const tab = ui.ptab || 'p-hoje';
  if (tab === 'p-agenda') return renderAgenda();
  if (tab === 'p-listas') return renderLists();
  if (tab === 'p-notas') return renderMemos();
  if (tab === 'p-ajustes') return renderPSettings();
  return renderHome();
}

const ptabBtn = (id, ic, label) => `<button class="tabbar__btn" data-action="ptab" data-tab="${id}">${icon(ic, 24)}<span>${label}</span></button>`;
export const personalTabbar = () => `
  ${ptabBtn('p-hoje', 'heart', 'Início')}
  ${ptabBtn('p-agenda', 'calendar', 'Agenda')}
  <button class="tabbar__fab" data-action="p-new" aria-label="Anotar">${icon('plus', 28)}</button>
  ${ptabBtn('p-listas', 'list', 'Listas')}
  ${ptabBtn('p-ajustes', 'settings', 'Ajustes')}`;

export function bindPersonal(view) {
  const hero = view.querySelector('[data-snh-hero]');
  if (hero && greet.g) {
    const el = hero.querySelector('[data-snh]'), bubble = hero.querySelector('.snhb__txt');
    interactive(el, { bubble }); alive();
    setTimeout(() => vivo(el, { gestos: ['pisca', 'olhaLados', 'sobrancelha', 'pensa'], cada: [6, 11] }), 4000);
    if (!window.__stkWarm) { window.__stkWarm = 1; const w = () => import('../streak.js').then((m) => m.preloadStreak()).catch(() => {}); ('requestIdleCallback' in window) ? requestIdleCallback(w, { timeout: 4000 }) : setTimeout(w, 2500); }
    if (!greet.typed) { greet.typed = true; setTimeout(() => say(el, greet.g.text, { bubble }), 350); }
  }
  const f = view.querySelector('[data-form="pquick"]');
  if (f) f.onsubmit = (ev) => {
    if (ev) ev.preventDefault(); // nunca deixa o navegador "enviar" o formulário (isso recarregava o app)
    const q = f.q.value.trim();
    f.q.value = ''; f.q.blur();
    import('./assistant.js').then((m) => m.openAssistant(q)); // o mesmo assistente do brilho lá de cima
    return false;
  };
  const mf = view.querySelector('[data-form="memo"]');
  if (mf) mf.onsubmit = (ev) => {
    ev.preventDefault();
    const it = addMemo(mf.t.value);
    if (!it) { mf.t.focus(); return false; }
    mf.t.value = '';
    okFx({ title: 'Anotado!', sub: `Hoje às ${fmtTime(it.time)}`, item: { title: it.text, date: it.date } });
    return false;
  };
  const mq = view.querySelector('[data-memoq]');
  if (mq) mq.oninput = () => { ui.memoQ = mq.value; const pos = mq.selectionStart; window.__calRender && window.__calRender(); const n = document.querySelector('[data-memoq]'); if (n) { n.focus(); n.setSelectionRange(pos, pos); } };
  if (view.querySelector('[data-usage]')) fillUsage(view);
  const pf = view.querySelector('[data-form="pprefs"]');
  if (pf) pf.onchange = () => {
    const v = { freq: pf.freq.value };
    pf.querySelectorAll('input[type="checkbox"]').forEach((i) => (v[i.name] = i.checked));
    savePrefs(v);
    toast('Preferências salvas');
  };
  // arrastar para o lado troca o mês
  const sw = view.querySelector('[data-swipe="pmonth"]');
  if (sw) {
    let x0 = null;
    sw.addEventListener('touchstart', (e) => (x0 = e.touches[0].clientX), { passive: true });
    sw.addEventListener('touchend', (e) => {
      if (x0 == null) return;
      const dx = e.changedTouches[0].clientX - x0;
      x0 = null;
      if (Math.abs(dx) > 60) { ui.pMonth = addMonths(ui.pMonth || monthKey(todayKey()), dx < 0 ? 1 : -1); window.__calRender && window.__calRender(); }
    });
  }
}

export const personalActions = {
  'p-rotina': () => { ui.rotinaTudo = true; window.__calRender && window.__calRender(); },
  ptab: (b) => {
    const tab = b.dataset.tab, go = () => { ui.ptab = tab; saveUi(); window.__calRender && window.__calRender(); window.scrollTo(0, 0); };
    if (window.__motion) window.__motion.trocar(tab, go, b, (ui.ptab || 'p-hoje') === tab); else go();
  },
  pview: (b) => { ui.pView = b.dataset.v; window.__calRender && window.__calRender(); },
  pmonth: (b) => { ui.pMonth = addMonths(ui.pMonth || monthKey(todayKey()), +b.dataset.d); window.__calRender && window.__calRender(); },
  psel: (b) => {
    ui.pSel = b.dataset.k;
    if (b.dataset.k.slice(0, 7) !== (ui.pMonth || monthKey(todayKey()))) ui.pMonth = b.dataset.k.slice(0, 7);
    window.__calRender && window.__calRender();
  },
  'p-open': (b) => openPersonalEditor(b.dataset.id),
  'memo-agenda': (b) => { const m = personal.item(b.dataset.id); if (m) import('./assistant.js').then((x) => x.openAssistant(m.text, { agenda: true, nota: m.id })); },
  'memo-del': async (b) => {
    const m = personal.item(b.dataset.id);
    if (!m || !(await confirmDialog({ title: 'Apagar esta nota?', text: `${m.text}\n\nFica na lixeira por 24 horas.`, ok: 'Apagar', danger: true }))) return;
    avisaApagado(removePersonal(m.id), 'Nota apagada');
  },
  'p-done': (b) => {
    const it = personal.item(b.dataset.id);
    if (!it) return;
    const was = doneOn(it, b.dataset.date);
    const at = b.getBoundingClientRect();
    const M = window.__motion, foto = M && !was && b.closest('#view') ? M.antes(b.closest('.prow')) : null;
    const saved = toggleDone(it, b.dataset.date);
    if (foto && saved && saved.updatedAt) M.concluir(foto);
    if (!was && saved && saved.updatedAt) {
      const t = todayKey();
      const left = b.dataset.date === t ? occurrences(t, t).filter((o) => !o.done).length : null;
      toast(onDone({ el: at, left }), { action: 'Desfazer', onAction: () => toggleDone(personal.item(it.id), b.dataset.date) });
    }
  },
  'p-new': (b) => {
    if (b.classList.contains('tabbar__fab') && ui.ptab === 'p-listas') return openListForm();
    if (b.classList.contains('tabbar__fab') && ui.ptab === 'p-notas') { const t = document.querySelector('[data-form="memo"] textarea'); if (t) { t.focus(); t.scrollIntoView({ block: 'center' }); } return; }
    openPersonalEditor(null, { cat: b.dataset.cat, date: b.dataset.date || (ui.ptab === 'p-agenda' ? ui.pSel : null) });
  },
  'p-list': (b) => openList(b.dataset.id),
  'p-sug': (b) => {
    const it = addSuggestion(b.dataset.id);
    if (!it) return;
    // só entra quando a pessoa toca no + (e dá para desfazer na hora)
    toast(`Adicionado: ${it.title} · ${REPEATS[it.repeat] ? REPEATS[it.repeat].toLowerCase() : ''}`, { action: 'Desfazer', onAction: () => removePersonal(it.id), ms: 5000 });
  },
  'p-likes': async () => {
    const [{ openPicker }, { LIKES }, { saveUserProfile }] = await Promise.all([import('../picker.js'), import('./ficha.js'), import('../store.js')]);
    openPicker({ title: 'O que você curte fazer no tempo livre?', hint: 'Marque o que quiser: o “Feito pra você” passa a sugerir coisas do seu gosto.', multi: true, value: store.profile?.likes || [],
      options: LIKES.map(([v, l]) => ({ v, l })),
      onDone: async (v) => { try { await saveUserProfile({ likes: v }); toast('Pronto! Sugestões do seu gosto 💜'); } catch { toast('Não consegui salvar agora.'); } } });
  },
  'p-sug-x': (b) => { hideSuggestion(b.dataset.id); toast('Ok, não sugiro mais essa'); },
  'p-nudge-test': async () => {
    try { await push.api('/pnudge-test', {}); toast('Pronto! A mensagem chega em até 1 minuto.', { ms: 4500 }); }
    catch { toast('Não deu para pedir agora. Verifique a conexão.'); }
  },
  'p-newlist': (b) => {
    if (b.dataset.name) { const l = newList(b.dataset.name, b.dataset.ic); return l && openList(l.id); }
    openListForm();
  },
};

/* ---------- uma lista (checklist) ---------- */
function listHtml(l) {
  const entries = l.entries || [];
  const open = entries.filter((e) => !e.done), done = entries.filter((e) => e.done);
  const item = (e) => `<div class="pentry${e.done ? ' is-done' : ''}">
    <button class="prow__check${e.done ? ' is-on' : ''}" style="--pc:var(--p-accent)" data-entry="${e.id}" aria-label="Marcar">${icon('check', 14)}</button>
    <span>${esc(e.text)}</span>
    <button class="pentry__del" data-del-entry="${e.id}" aria-label="Apagar">${icon('x', 14)}</button>
  </div>`;
  return `${sheetHead(l.name, { left: '<button class="btn-text" data-close>Fechar</button>', right: '<button class="btn-text" data-list-more>Editar</button>' })}
  <div class="plisthead">${listTile(l, 56)}<small>${open.length ? `${open.length} pendente${open.length > 1 ? 's' : ''}` : 'Tudo feito'}${done.length ? ` · ${done.length} feito${done.length > 1 ? 's' : ''}` : ''}</small></div>
  <div class="page page--sheet ppage">
    <form class="pquick" data-form="entry" onsubmit="return false">
      <input name="t" placeholder="Adicionar item…" autocomplete="off" enterkeyhint="done" maxlength="200">
      <button class="pquick__go" aria-label="Adicionar">${icon('plus', 18)}</button>
    </form>
    <div class="plist">${open.length ? open.map(item).join('') : '<p class="pentry pentry--empty">Nada pendente. Adicione itens acima.</p>'}</div>
    ${done.length ? `<div class="block"><h2 class="block__title">Feitos (${done.length})<button class="btn-text btn-text--sm" data-clear>Limpar</button></h2><div class="plist">${done.map(item).join('')}</div></div>` : ''}
  </div>`;
}
function openList(id) {
  const mount = (a) => {
    const l = personal.item(id);
    if (!l) return a.close();
    const el = a.el;
    const f = el.querySelector('[data-form="entry"]');
    f.onsubmit = () => { const v = f.t.value; if (v.trim()) { addEntry(personal.item(id), v); refresh(true); } return false; };
    el.querySelectorAll('[data-entry]').forEach((b) => (b.onclick = () => { toggleEntry(personal.item(id), b.dataset.entry); refresh(); }));
    el.querySelectorAll('[data-del-entry]').forEach((b) => (b.onclick = () => { const lt = removeEntry(personal.item(id), b.dataset.delEntry); refresh(); avisaApagado(lt, 'Item apagado'); }));
    const clr = el.querySelector('[data-clear]');
    if (clr) clr.onclick = async () => { const F = personal.item(id).entries.filter((e) => e.done); if (!(await confirmDialog({ title: `Limpar ${F.length} ${F.length === 1 ? 'item feito' : 'itens feitos'}?`, text: 'Vão para a lixeira por 24 horas.', html: listaHtml(F), ok: 'Limpar', danger: true }))) return; const lt = clearDone(personal.item(id)); refresh(); avisaApagado(lt, 'Itens feitos apagados'); };
    el.querySelector('[data-list-more]').onclick = () => openListForm(id);
  };
  const api = openSheet({ className: 'sheet--tall psheet', html: listHtml(personal.item(id)), onMount: mount });
  const refresh = (focus) => {
    const l = personal.item(id);
    if (!l) return api.close();
    api.set(listHtml(l));
    if (focus) api.el.querySelector('[data-form="entry"] input').focus();
  };
  api.refresh = () => {
    if (api.el.contains(document.activeElement) && document.activeElement.tagName === 'INPUT') return; // não atrapalha quem está digitando
    refresh();
  };
  return api;
}

/* ---------- criar / renomear lista ---------- */
function openListForm(id = null) {
  const cur = id ? personal.item(id) : null;
  let ic = cur ? listIcon(cur) : 'listcheck';
  const html = () => `${sheetHead(cur ? 'Editar lista' : 'Nova lista', { left: '<button class="btn-text" data-close>Cancelar</button>', right: '<button class="btn btn--primary btn--sm" data-save>Salvar</button>' })}
    <form class="form" onsubmit="return false">
      <div class="fgroup"><label class="flabel" for="l-name">Nome</label><input id="l-name" class="input" name="name" value="${esc(cur?.name || '')}" placeholder="Ex.: Mercado, Viagem, Casa…" maxlength="60" autocomplete="off"></div>
      <div class="fgroup"><label class="flabel">Ícone</label><div class="picons">${Object.keys(LIST_ICONS).map((k) => `<button type="button" class="picon${k === ic ? ' is-on' : ''}" data-ic="${k}">${tile(k, LIST_ICONS[k].g, 44)}</button>`).join('')}</div></div>
      ${cur ? `<button type="button" class="btn btn--block btn--danger-soft" data-del>${icon('trash', 16)} Apagar a lista</button>` : ''}
    </form>`;
  const api = openSheet({
    className: 'psheet',
    html: html(),
    onMount: (a) => {
      const el = a.el, form = el.querySelector('form');
      el.querySelectorAll('[data-ic]').forEach((b) => (b.onclick = () => { ic = b.dataset.ic; el.querySelectorAll('[data-ic]').forEach((x) => x.classList.toggle('is-on', x === b)); }));
      const save = () => {
        const name = form.name.value.trim();
        if (!name) { form.name.focus(); return toast('Dê um nome para a lista'); }
        a.close();
        if (cur) { savePersonal({ ...personal.item(id), name: name.slice(0, 60), ic }); toast('Lista atualizada'); }
        else { const l = newList(name.slice(0, 60), ic); setTimeout(() => openList(l.id), 320); }
      };
      el.querySelector('[data-save]').onclick = save;
      form.onsubmit = () => { save(); return false; };
      const del = el.querySelector('[data-del]');
      if (del) del.onclick = async () => {
        if (!(await confirmDialog({ title: 'Apagar a lista?', text: cur.name, ok: 'Apagar', danger: true }))) return;
        const lt = removePersonal(id);
        a.close();
        document.querySelectorAll('.psheet').length && [...document.querySelectorAll('.sheet-wrap.is-open [data-close]')].forEach((x) => x.click());
        avisaApagado(lt, 'Lista apagada');
      };
      if (!cur) setTimeout(() => form.name.focus(), 300);
    },
  });
  return api;
}

/* ---------- criar / editar anotação ---------- */
export function openPersonalEditor(id = null, preset = {}) {
  const old = id ? personal.item(id) : null;
  if (old && old.kind === 'list') return openList(id);
  const d = old ? { ...old } : { title: preset.title || '', date: preset.date || todayKey(), time: preset.time || '', cat: preset.cat || 'lembrete', repeat: preset.cat === 'aniversario' ? 'yearly' : 'none', note: '', remind: 'auto' };
  const api = openSheet({
    className: 'sheet--tall psheet',
    html: `${sheetHead(old ? 'Editar' : 'Anotar', { left: '<button class="btn-text" data-close>Cancelar</button>', right: '<button class="btn btn--primary btn--sm" data-save>Salvar</button>' })}
    <form class="form" onsubmit="return false">
      ${old ? `<div class="abre" aria-hidden="true"><span class="abre__s">${sininho('feliz', { size: 122 })}</span></div>` : ajudanteHtml()}
      <div class="fgroup"><label class="flabel">Tipo</label><div class="pcats">
        ${Object.entries(CATS).map(([k, c]) => `<button type="button" class="pcat${d.cat === k ? ' is-on' : ''}" style="--pc:${c.color}" data-cat="${k}">${tile(c.ic, c.g, 30)}<span>${esc(c.label)}</span></button>`).join('')}
      </div></div>
      <div class="fgroup"><label class="flabel" for="p-title" data-title-label>${d.cat === 'aniversario' ? 'De quem?' : 'O quê?'}</label><div class="ptitlerow"><span data-tprev>${itemTile(d, 38)}</span><input id="p-title" class="input" name="title" value="${esc(d.title)}" placeholder="${d.cat === 'aniversario' ? 'Ex.: Aniversário da Maria' : 'Ex.: Fazer cabelo, pagar conta de luz…'}" maxlength="120" autocomplete="off"></div></div>
      <div class="fgroup row2">
        <div><label class="flabel" for="p-date">Dia</label><input id="p-date" class="input" type="date" name="date" value="${d.date}"></div>
        <div><label class="flabel" for="p-time">Horário (opcional)</label><input id="p-time" class="input" type="time" name="time" value="${d.time || ''}" step="300"></div>
      </div>
      <div class="fgroup row2">
        <div><label class="flabel" for="p-rep">Repetir</label><select id="p-rep" class="input" name="repeat">${Object.entries(REPEATS).map(([k, l]) => `<option value="${k}"${(d.repeat || 'none') === k ? ' selected' : ''}>${l}</option>`).join('')}</select></div>
        <div data-by ${d.cat === 'aniversario' ? '' : 'hidden'}><label class="flabel" for="p-year">Ano que nasceu</label><input id="p-year" class="input" type="number" inputmode="numeric" name="birthYear" value="${d.birthYear || ''}" placeholder="opcional" min="1900" max="2100"></div>
      </div>
      <div class="fgroup"><label class="flabel" for="p-note">Observação</label><textarea id="p-note" class="input" name="note" rows="3" placeholder="Endereço, telefone, o que levar, ideia de presente…" maxlength="500">${esc(d.note || '')}</textarea></div>
      <label class="list__row premind"><span><b>Me lembrar no celular</b><small>Com horário: 1h, 30 e 20 min antes, na hora e um “já fez?” depois · Aniversário: na véspera às 20h e no dia às 8h · Sem horário: entra no resumo das 8h</small></span><input type="checkbox" class="switch" name="remind" ${d.remind !== 'none' ? 'checked' : ''}></label>
      ${old ? `<button type="button" class="btn btn--block btn--danger-soft" data-del>${icon('trash', 16)} Apagar</button>` : ''}
      <div class="form__spacer"></div>
    </form>`,
    onMount: (a) => {
      { const e = a.el.querySelector('.abre__s [data-snh]'); if (e) { alive(); const rp = roupaDe(d); if (rp) veste(e, roupa(rp)); vivo(e, { gestos: ['pisca', 'olhaLados', 'sim'], cada: [3, 6] }); } }
      const el = a.el, form = el.querySelector('form');
      // o ícone muda enquanto a pessoa escreve (cabelo → secador, conta de luz → lâmpada…)
      let catPicked = !!old;
      if (!old) ajudante(el, form);
      const prev = () => { const p = el.querySelector('[data-tprev]'); if (p) p.innerHTML = itemTile({ ...d, title: form.title.value }, 38); };
      form.title.addEventListener('input', () => {
        if (!catPicked && d.cat !== 'aniversario') { const g = guessCat(form.title.value); if (g !== d.cat && g !== 'lembrete') { d.cat = g; el.querySelectorAll('[data-cat]').forEach((x) => x.classList.toggle('is-on', x.dataset.cat === g)); } }
        prev();
      });
      el.querySelectorAll('[data-cat]').forEach((b) => (b.onclick = () => {
        catPicked = true;
        d.cat = b.dataset.cat;
        el.querySelectorAll('[data-cat]').forEach((x) => x.classList.toggle('is-on', x === b));
        el.querySelector('[data-by]').hidden = d.cat !== 'aniversario';
        el.querySelector('[data-title-label]').textContent = d.cat === 'aniversario' ? 'De quem?' : 'O quê?';
        if (d.cat === 'aniversario' && form.repeat.value === 'none') form.repeat.value = 'yearly';
        prev();
      }));
      el.querySelector('[data-save]').onclick = () => {
        const title = form.title.value.trim();
        if (!title) { form.title.focus(); return toast('Escreva o que é'); }
        const ok = savePersonal({ ...d, title, date: form.date.value || todayKey(), time: form.time.value || null, repeat: form.repeat.value, note: form.note.value.trim(), birthYear: +form.birthYear.value || null, remind: form.remind.checked ? 'auto' : 'none' });
        a.close();
        if (ok) { if (!id) okFx({ title: 'Anotado!', sub: `${dayLabel(ok.date || todayKey())}${ok.time ? ' às ' + fmtTime(ok.time) : ''}`, item: ok }); else toast('Salvo ✓'); }
      };
      const del = el.querySelector('[data-del]');
      if (del) del.onclick = async () => {
        if (!(await confirmDialog({ title: 'Apagar?', text: old.title, ok: 'Apagar', danger: true }))) return;
        const lt = removePersonal(old.id);
        a.close();
        avisaApagado(lt, 'Apagado');
      };
      if (!old) setTimeout(() => form.title.focus(), 300);
    },
  });
  return api;
}
