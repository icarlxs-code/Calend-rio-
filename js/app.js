/* Inicialização, navegação e ações globais */
import { avisaApagado, openLixeira } from './lixeira.js';
import { ehRemedio, avisoRemedio } from '../functions/remedio.js';
import { cena, momento, boneco3d, pose3d, aquece3d } from './cena.js';
import { say } from './sininho.js';
import { brand } from './brand.js';
import { syncCoach } from './coach.js';
import { polishSoon } from './polish.js';
import { renderPersonalSpace, personalTabbar, bindPersonal, personalActions, openPersonalEditor } from './views/personal.js';
import { personal, startPersonal, occurrences } from './personal.js';
import { CONFIG } from '../config.js';
import { store, initLocal, initCloud, saveMyProfile, LS_DATA } from './store.js';
import * as cofre from './cofre.js';
import { CHAVE_LOCAL as LS_PESSOAL } from './personal.js';
import { ui, saveUi } from './ui.js';
import { esc, isStandalone, todayKey, addDays, addMonths, monthKey, uid, toMin, nowMin, resizeImage } from './utils.js';
import { TYPES, TYPE_ORDER, WORK, ent, isMarketing, applyArch, crew } from './constants.js';
import { icon } from './icons.js';
import { openSheets, openSheet, toast, confirmDialog, avatar, refreshLevelRings } from './components.js';
import { renderToday, renderMonth } from './views/calendar.js';
import { renderCompanies, openCompany, openCompanyEditor } from './views/companies.js';
import { renderSettings, settingsActions } from './views/settings.js';
import { openEventDetail, openEventEditor } from './views/event.js';
import { showClient, showClientError } from './views/client.js';
import { openAssistant } from './views/assistant.js';
import { upcomingConflicts } from './insights.js';
import { decodeSnapshot } from './share.js';
import { sanitizePayload } from './sanitize.js';
import { maybeOnboard } from './views/onboarding.js';
import { showInstallGuide } from './install.js';
import { onDone } from './reward.js';
import { chime, setSound } from './sound.js';
import { checkBilling, trialBanner, openPlans, confirmPayment, openPortal, buying, clearBuying, hasAccess, requireAccess, lastKnown, emLancamento, limitado } from './billing.js';
import { captureInvite, maybeAcceptInvite, startTeam, openShare, pendingInvite } from './equipe.js';
import { personaOf } from './notifier.js';
import { applyProfTheme, applyThemePref, setThemePref } from './theme.js';
import { startErrorLog } from './errlog.js';
import { track, startTracking } from './track.js';
import { computePersona, cleanEmail, validEmail, emailTypo, tidyName, validNameChars } from './persona.js';
import { reportStats, loadStatsDays, reportSoon, startPresence } from './stats.js';
import { ensureSeedCompanies, ensureMatheusLogo, ensureNotifyOwners } from './seed-companies.js';
import { ensureMatheusJG } from './seed-matheus.js';
import { ensureSeedRoutine } from './seed-routine.js';
import { onEventChange, onActivity, syncSchedule, setNotifyFeedback, onNoteAdded } from './notifier.js';
import { buildContext } from '../functions/context.js';
import { routine } from './planner.js';
import * as push from './avisos.js';
import { dueReminders, reminderMessage } from '../functions/reminder-rules.js';

const root = document.getElementById('app');
// avisa a página que o app carregou (a proteção de abertura não deve mais agir)
window.__calStarted = true;
let cloudApi = null;

/* ---------- casca do app ---------- */
function shell() {
  const personalMode = ui.space === 'personal';
  document.documentElement.dataset.space = personalMode ? 'personal' : 'work';
  applySpaceMeta(personalMode);
  root.innerHTML = `
    <main id="view" class="view"></main>
    <nav class="tabbar" aria-label="Navegação">
      ${personalMode ? personalTabbar() : `
      ${tabBtn('hoje', 'today', 'Hoje')}
      ${tabBtn('mes', 'calendar', 'Calendário')}
      <button class="tabbar__fab" data-action="new-event" aria-label="Novo evento">${icon('plus', 28)}</button>
      ${tabBtn('empresas', WORK.entity.icon, ent(true))}
      ${tabBtn('ajustes', 'settings', 'Ajustes')}`}
    </nav>`;
}
/* Cor da barra de status do iPhone (hora/bateria) acompanha o app */
const SPACE_BAR = { work: ['#FFF6EE', '#0A0A0A'], personal: ['#FFF6EE', '#0A0A0A'] };
function setBarColor(light, dark = light) {
  // tema escolhido à mão (Claro/Escuro) vale para as duas situações do celular
  const forced = document.documentElement.dataset.theme;
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => {
    const media = m.getAttribute('media') || '';
    m.setAttribute('content', forced === 'dark' ? dark : forced === 'light' ? light : /dark/.test(media) ? dark : light);
  });
}
/* Pessoal parece outro app: título, ícone e cor da barra do iPhone próprios */
function applySpaceMeta(personalMode) {
  const [l, d] = personalMode ? SPACE_BAR.personal : SPACE_BAR.work;
  if (document.documentElement.classList.contains('intro-done')) setBarColor(l, d); // durante a abertura fica preta
  const set = (sel, attr, val) => { const el = document.querySelector(sel); if (el) el.setAttribute(attr, val); };
  // ícone e nome na tela inicial: sempre a marca principal (Lembra), em qualquer modo
  set('link[rel="manifest"]', 'href', 'manifest.webmanifest');
  set('link[rel="apple-touch-icon"]', 'href', 'icons/icon-180.png');
  set('meta[name="apple-mobile-web-app-title"]', 'content', 'Lembra');
  document.title = personalMode ? 'Pessoal · Lembra' : 'Lembra · Sua agenda';
}
/* Troca entre Trabalho e Pessoal com uma transição de "outro app" */
function switchSpace(space, from) {
  if (ui.space === space || document.querySelector('.spaceveil')) return;
  document.querySelectorAll('.sheet-wrap.is-open [data-close]').forEach((b) => b.click());
  const M = window.__motion;
  if (M && M.pronto()) {
    M.mundo(space, from, () => { ui.space = space; saveUi(); shell(); render(); window.scrollTo(0, 0); document.getElementById('view')?.querySelectorAll('.page').forEach((n) => { n.style.animation = 'none'; }); }, setBarColor, SPACE_BAR[space]);
    return;
  }
  const veil = document.createElement('div');
  veil.className = `spaceveil spaceveil--${space}`;
  // o círculo nasce do botão tocado
  const r = from && from.getBoundingClientRect ? from.getBoundingClientRect() : null;
  if (r) { veil.style.setProperty('--x', `${r.left + r.width / 2}px`); veil.style.setProperty('--y', `${r.top + r.height / 2}px`); }
  const me = store.member(store.me);
  // o ícone de onde você está pulsa, cresce e vira o ícone do destino (coração ⇄ maleta)
  const icFrom = space === 'personal' ? 'briefcase' : 'heart', icTo = space === 'personal' ? 'heart' : 'briefcase';
  const label = space === 'personal' ? 'Pessoal' : 'Trabalho';
  const sub = space === 'personal' ? `${me ? esc(me.name) + ' · ' : ''}só você vê` : store.team.length > 1 ? `Agenda da ${crew()}` : isMarketing() ? 'Suas empresas e clientes' : `Seus compromissos de ${esc(ent(true, true))}`;
  veil.innerHTML = `<div><span class="spaceveil__badge"><i class="sv-from">${icon(icFrom, 40)}</i><i class="sv-to">${icon(icTo, 40)}</i></span><strong>${label}</strong><small>${sub}</small></div>`;
  document.body.appendChild(veil);
  // a barra do topo (hora/bateria) entra na mesma cor da transição, quando o círculo chega lá em cima
  const veilBar = space === 'personal' ? '#FF6B1A' : '#000000';
  setTimeout(() => setBarColor(veilBar), 180);
  if (navigator.vibrate) navigator.vibrate(8);
  chime(space);
  requestAnimationFrame(() => requestAnimationFrame(() => veil.classList.add('is-in')));
  setTimeout(() => {
    ui.space = space;
    saveUi();
    shell();
    render();
    window.scrollTo(0, 0);
    const view = document.getElementById('view');
    if (view) { view.classList.add('is-entering'); setTimeout(() => view.classList.remove('is-entering'), 600); }
    setBarColor(veilBar); // continua na cor da transição enquanto ela está na tela
  }, 430);
  setTimeout(() => { veil.classList.add('is-out'); const [l, d] = space === 'personal' ? SPACE_BAR.personal : SPACE_BAR.work; setBarColor(l, d); }, 700);
  setTimeout(() => veil.remove(), 1050);
}
window.__calRender = () => render();
const tabBtn = (id, ic, label) => `<button class="tabbar__btn" data-action="tab" data-tab="${id}">${icon(ic, 24)}<span>${label}</span></button>`;

/* Perfil de trabalho do espaço: a profissão define os nomes (Empresas, Pacientes, Turmas…) e os tipos de compromisso */
let workSig = '';
function syncWork() {
  const wp = store.state.settings.find((s) => s.id === 'workprofile');
  const arch = wp?.arch || (store.workspace === 'main' ? 'marketing' : store.profile?.arch) || 'generico';
  const prof = wp?.profession || (store.workspace === 'main' ? '' : store.profile?.profession) || '';
  const sig = `${arch}|${prof}`;
  if (sig === workSig) return false;
  workSig = sig;
  applyArch(arch, prof);
  WORK.main = store.workspace === 'main';
  applyProfTheme();
  applySpaceMeta(ui.space === 'personal');
  return true;
}
const htmlDaAba = (personalMode) => (personalMode ? renderPersonalSpace() : ui.tab === 'mes' ? renderMonth() : ui.tab === 'empresas' ? renderCompanies() : ui.tab === 'ajustes' ? renderSettings() : renderToday());
function poeComeco(view, personalMode) {
  if (!(personalMode ? (ui.ptab || 'p-hoje') === 'p-hoje' : ui.tab === 'hoje') || !window.__comeco) return;
  const C = window.__comeco, h = C.cartaoPrimeiro() || window.__retro?.cartaoRetro() || C.cartaoCheckup() || C.cartaoEnquete(); if (!h) return;
  const alvo = view.querySelector(personalMode ? '.page > .pquick' : '.page > .foco'); if (alvo) alvo.insertAdjacentHTML(/class="prim"/.test(h) ? 'beforebegin' : 'afterend', h); else view.querySelector('.page')?.insertAdjacentHTML('afterbegin', h);
}
import('./retro-telas.js').then((m) => { window.__retro = m; }).catch(() => {});
import('./comeco.js').then((m) => { window.__comeco = m; m.avisoDados(); }).catch(() => {});
function poeFaixa(view, personalMode) {
  // em Ajustes o plano já aparece em "Seu plano": sem a faixa repetida
  const tb = !hasAccess() ? lockBanner() : ui.tab === 'ajustes' && !personalMode ? '' : trialBanner();
  const soGratis = /trialbar--free/.test(tb), inicio = personalMode ? (ui.ptab || 'p-hoje') === 'p-hoje' : ui.tab === 'hoje';
  if (soGratis) { if (inicio) view.querySelector('.page')?.insertAdjacentHTML('beforeend', tb); } // aviso que não é urgente: só no fim do início
  else if (tb) { const fo = view.querySelector('.page > .foco'); if (fo) fo.insertAdjacentHTML('afterend', tb); else (view.querySelector('.page') || view).insertAdjacentHTML('afterbegin', tb); } // no Hoje: abaixo do Foco
}
/* ---------- deslizar o dedo entre as abas ---------- */
const abaAtual = () => (ui.space === 'personal' ? (ui.ptab === 'p-notas' ? 'p-listas' : ui.ptab || 'p-hoje') : ui.tab);
/* a tela vizinha montada do mesmo jeito que a de verdade, sem mudar nada do app */
function previaDaAba(id) {
  const pessoal = ui.space === 'personal', era = pessoal ? ui.ptab : ui.tab, d = document.createElement('div');
  try {
    if (pessoal) ui.ptab = id; else ui.tab = id;
    d.innerHTML = htmlDaAba(pessoal); poeFaixa(d, pessoal); recolhe(d, pessoal);
    const S = window.__stories, rows = S && store.user && store.mode === 'cloud' && (id === 'hoje' || id === 'p-hoje') ? S.feedCache().rows : null;
    if (rows && id === 'hoje') d.querySelector('header.hdr')?.insertAdjacentHTML('beforeend', `<div class="ststrip-wrap">${S.storyStrip(rows, { convidar: true })}</div>`);
    if (rows && id === 'p-hoje') d.querySelector('.page')?.insertAdjacentHTML('afterbegin', `<div class="ststrip-wrap">${S.storyStrip(rows)}</div>`);
  } catch (e) { console.warn('prévia', e); } finally { if (pessoal) ui.ptab = era; else ui.tab = era; }
  d.querySelectorAll('[id]').forEach((n) => n.removeAttribute('id'));
  return d;
}
import('./deslizar.js').then((m) => m.ligaDeslizar({
  lista: () => [...document.querySelectorAll('.tabbar .tabbar__btn')].map((b) => b.dataset.tab), atual: abaAtual, previa: previaDaAba,
  vive: () => { import('./sininho.js').then((s) => s.alive()); document.querySelectorAll('.dz__lado [data-strip]').forEach((s) => { const on = s.querySelector('.is-on, .is-sel, [aria-current]'); if (on) s.scrollLeft = Math.floor(on.offsetLeft / s.clientWidth) * s.clientWidth; }); },
  marca: (id) => document.querySelectorAll('.tabbar__btn').forEach((b) => b.classList.toggle('is-on', b.dataset.tab === id)),
  vai: (id) => { const go = () => { if (ui.space === 'personal') ui.ptab = id; else ui.tab = id; saveUi(); ui.stripReset = true; render(); window.scrollTo(0, 0); }; if (window.__motion?.direto) window.__motion.direto(id, go); else go(); },
})).catch((e) => console.warn('deslizar', e));
function render() {
  // proteção: se a abertura não terminou por algum motivo, termina aqui (o fundo branco dela nunca fica preso na tela)
  clearTimeout(window.__introGuard);
  window.__introGuard = setTimeout(() => { const de = document.documentElement, it = document.getElementById('intro'); if (!de.classList.contains('intro-done') && (!it || it.classList.contains('is-gone') || !it.isConnected || getComputedStyle(it).opacity === '0')) { de.classList.add('intro-done'); } else if (!de.classList.contains('intro-done') && window.PautaIntro) window.PautaIntro.finish(); }, 9000);
  // mudou a profissão do espaço: refaz a barra de abas (o nome da aba muda)
  if (syncWork() && document.getElementById('view')) shell();
  const view = document.getElementById('view');
  if (!view) return;
  const scroll = window.scrollY;
  // preserva o que estiver sendo digitado (ex.: bilhete) quando a tela atualiza
  const noteInput = view.querySelector('[data-form="note"] input');
  const draftNote = noteInput ? noteInput.value : '';
  const hadFocus = noteInput && document.activeElement === noteInput;
  const pIn = view.querySelector('[data-form="pquick"] input');
  const draftP = pIn ? pIn.value : '';
  const hadP = pIn && document.activeElement === pIn;
  // lembra até onde a faixa de dias estava rolada, para não pular ao atualizar a tela
  const oldStrip = view.querySelector('[data-strip]');
  if (oldStrip && !ui.stripReset) ui.stripLeft = stripLeftDay(oldStrip);
  ui.stripReset = false;
  const personalMode = ui.space === 'personal';
  view.innerHTML = htmlDaAba(personalMode);
  document.querySelectorAll('.tabbar__btn').forEach((b) => b.classList.toggle('is-on', b.dataset.tab === (personalMode ? (ui.ptab === 'p-notas' ? 'p-listas' : ui.ptab || 'p-hoje') : ui.tab)));
  window.scrollTo(0, scroll);
  const ni = view.querySelector('[data-form="note"] input');
  if (ni && draftNote) ni.value = draftNote;
  if (ni && hadFocus) ni.focus({ preventScroll: true });
  // faixa do teste grátis (contagem regressiva) ou de conta sem plano (tudo travado)
  const locked = !hasAccess();
  document.documentElement.classList.toggle('is-locked', locked);
  poeFaixa(view, personalMode);
  poeComeco(view, personalMode);
  recolhe(view, personalMode);
  bindSwipes();
  bindStrip(view);
  if (store.user && !window.__snhTried) { window.__snhTried = 1; import('./mascote.js').then((m) => m.start()).catch(() => {}); setTimeout(() => import('./cache.js').then((m) => m.aqueceEmblemas()), 6000); }
  // stories dos amigos no topo do Hoje (Trabalho e Pessoal), como no Instagram/WhatsApp
  if (store.user && store.mode === 'cloud' && (personalMode ? (ui.ptab || 'p-hoje') === 'p-hoje' : ui.tab === 'hoje')) {
    import('./stories.js').then((m) => {
      window.__stories = m;
      const pinta = () => {
        const v = document.getElementById('view'); if (!v) return;
        v.querySelector('.ststrip-wrap')?.remove();
        const fc = m.feedCache(), rows = fc.rows;
        const tem = rows.some((r) => !r.me && r.stories.some((x) => !x.seen)) || fc.pedidos > 0;
        v.querySelectorAll('.iconbtn--friends').forEach((b) => b.classList.toggle('is-dot', tem));
        if (personalMode) {
          const host = v.querySelector('.page'); if (!host) return;
          host.insertAdjacentHTML('afterbegin', `<div class="ststrip-wrap">${m.storyStrip(rows)}</div>`);
          return m.bindStrip(host.querySelector('.ststrip-wrap'), pinta);
        }
        // Hoje do Trabalho: stories SEMPRE no topo (antes da semana), com "Convidar" no fim
        const host = v.querySelector('header.hdr'); if (!host) return;
        host.insertAdjacentHTML('beforeend', `<div class="ststrip-wrap">${m.storyStrip(rows, { convidar: true, dot: tem })}</div>`);
        m.bindStrip(host.querySelector('.ststrip-wrap'), pinta);
      };
      pinta();
      if (Date.now() - m.feedCache().at > 3 * 60e3) m.refreshFeed().then(pinta);
    }).catch(() => {});
  }
  // visita nova no perfil: logo abaixo do que importa agora
  if (store.user && store.mode === 'cloud' && (personalMode ? (ui.ptab || 'p-hoje') === 'p-hoje' : ui.tab === 'hoje')) {
    import('./stories.js').then((m) => {
      const poe = () => { const v = document.getElementById('view'); if (!v) return; v.querySelector('.visita')?.remove(); const alvo = v.querySelector('.page > .foco, .page > .pquick'); const h = alvo && m.visitaCard(); if (h) alvo.insertAdjacentHTML('afterend', h); };
      poe();
      if (Date.now() - m.visitasCache().at > 3 * 60e3) m.refreshVisitors().then(poe);
    }).catch(() => {});
  }
  // Foco visível no Hoje: o mascote do canto não cobre nada (some enquanto o Foco está na tela)
  window.__focoIO?.disconnect(); document.body.classList.remove('foco-visivel');
  import('./hora.js').then((m) => m.liga(view));
  const fo = !personalMode && ui.tab === 'hoje' && view.querySelector('.foco');
  if (fo && 'IntersectionObserver' in window) { window.__focoIO = new IntersectionObserver(([e]) => document.body.classList.toggle('foco-visivel', e.isIntersecting)); window.__focoIO.observe(fo); }
  // conta sem nenhum lembrete: uma vez, um balão sobre o + da barra
  if (fo && !store.state.events.length) { try { if (!localStorage.getItem('lembra.coachFab')) { localStorage.setItem('lembra.coachFab', '1'); setTimeout(coachFab, 1400); } } catch { /* ok */ } }
  // o Lembra acompanha em que tela a pessoa está (para falar do que ela está vendo)
  window.dispatchEvent(new CustomEvent('lembra:tela', { detail: { space: personalMode ? 'personal' : 'work', tab: personalMode ? ui.ptab || 'p-hoje' : ui.tab, date: ui.date } }));
  if (personalMode) {
    const pq = view.querySelector('[data-form="pquick"] input');
    bindPersonal(view);
    if (pq && draftP) pq.value = draftP;
    if (pq && hadP) pq.focus({ preventScroll: true });
  }
}
/* Conta própria sem plano: faixa no topo; o resto do app fica apagado e não responde */
function lockBanner() {
  const b = store.billing || {};
  const checking = b.plan === 'checking';
  return `<button class="trialbar trialbar--lock" data-action="plans" data-allow-locked>
    <span class="trialbar__ic">${icon(checking ? 'clock' : 'lock', 16)}</span>
    <span><b>${checking ? 'Conferindo seu plano…' : b.plan === 'offline' ? 'Sem conexão para conferir seu plano' : 'Seu Lembra está pausado'}</b><small>${checking ? 'Só um instante' : b.plan === 'offline' ? 'Toque para tentar de novo' : 'Comece o teste grátis ou assine para liberar tudo'}</small></span>
    <span class="trialbar__go">${checking ? '…' : 'Liberar'}</span>
  </button>`;
}
/* Ajustes: cada assunto vira uma linha que abre (uma tela curta, nada se perde) */
function recolhe(view, pessoal) {
  if (pessoal ? ui.ptab !== 'p-ajustes' : ui.tab !== 'ajustes') return;
  view.querySelectorAll('.page > .block').forEach((s) => {
    const h = s.querySelector(':scope > .block__title');
    if (!h || s.querySelector('.plan, .plans, .vipcard')) return;
    const k = (pessoal ? 'p:' : 'w:') + h.textContent.trim();
    s.classList.add('acc');
    s.classList.toggle('is-open', !!ui.acc[k]);
    h.dataset.action = 'acc'; h.dataset.k = k; h.setAttribute('role', 'button'); h.tabIndex = 0; h.setAttribute('aria-expanded', !!ui.acc[k]); h.setAttribute('data-allow-locked', '');
    h.insertAdjacentHTML('beforeend', icon('down', 18));
  });
  const acc = [...view.querySelectorAll('.page > .acc')];
  if (pessoal || acc.length < 5) return;
  const GRUPOS = [['Você', /conta|usando|apar|dia de trabalho/i], ['Avisos e ajuda', /notifica|assistente|lembretes|hor[aá]rios/i], ['App e dados', /./]];
  const marca = document.createComment(''); acc[0].before(marca);
  let resto = acc;
  GRUPOS.forEach(([nome, re]) => {
    const meus = resto.filter((s) => re.test(s.querySelector('.block__title').textContent)); resto = resto.filter((s) => !meus.includes(s));
    if (!meus.length) return;
    const g = document.createElement('section'); g.className = 'accg'; g.innerHTML = `<h3 class="accg__t">${nome}</h3>`; g.append(...meus); marca.before(g);
  });
  marca.remove();
}
document.addEventListener('keydown', (e) => { if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('[data-action="acc"]')) { e.preventDefault(); e.target.click(); } });
function rerenderAll() {
  render();
  openSheets().forEach((s) => s.refresh && s.refresh());
}

function setTab(tab, from) {
  const go = () => { ui.tab = tab; saveUi(); render(); window.scrollTo(0, 0); };
  if (window.__motion && document.getElementById('view')) window.__motion.trocar(tab, go, from, ui.tab === tab); else go();
}

/* ---------- ações (delegação de cliques) ---------- */
const actions = {
  retro: () => window.__retro?.abreRetro(),
  'retro-nao': () => window.__retro?.naoQuero(),
  prim: (b) => window.__comeco?.criaPrimeiro(b.dataset.id),
  checkup: () => window.__comeco?.checkup(),
  enq: (b) => window.__comeco?.respondeEnquete(b.dataset.v),
  'snh-toggle': async () => {
    const M = await import('./mascote.js'); let off = false;
    try { off = localStorage.getItem('lembra.companheiroOff') === '1'; off ? localStorage.removeItem('lembra.companheiroOff') : localStorage.setItem('lembra.companheiroOff', '1'); } catch { /* ok */ }
    if (off) { M.start(); toast('O Lembra voltou! 👋'); } else { M.stop(); toast('Lembra escondido. Ele continua cuidando da sua agenda 😉'); }
    render();
  },
  'ia-toggle': async () => {
    const m = await import('./ia-consent.js');
    if (m.iaStatus() === true) { await m.setIa(false); toast('IA desativada: nada mais é enviado para ela'); }
    else { localStorage.removeItem('lembra.iaConsent'); if (store.profile) store.profile.iaConsent = undefined; await m.pedeIa({ motivo: 'usar o assistente, arrumar títulos e escrever mensagens' }); }
    render();
  },
  atrasados: () => import('./views/atrasados.js').then((m) => m.openAtrasados()),
  tab: (b) => setTab(b.dataset.tab, b),
  space: (b) => switchSpace(b.dataset.space, b),
  'edit-profile': async () => (await import('./views/profile.js')).openProfile(),
  profile: async () => (await import('./views/profile.js')).openProfilePage(),
  'team-board': async () => (await import('./views/teamboard.js')).openTeamBoard(),
  friends: async () => (await import('./friends.js')).openFriends(),
  'confirm-phone': async () => (await import('./phone.js')).confirmPhone(() => render()),
  support: async () => {
    // o dono do app abre a caixa com as mensagens dos clientes (para responder); os outros, o próprio chat
    if (store.mode === 'cloud' && store.user && (store.user.email || '').toLowerCase() === (CONFIG.adminEmail || '').toLowerCase()) return (await import('./views/support.js')).openSupportInbox();
    if (store.mode === 'cloud' && store.user) return (await import('./views/support.js')).openSupport();
    const wa = String(CONFIG.supportWhatsapp || '').replace(/\D/g, '');
    const who = store.member(store.me)?.name || '';
    if (wa) window.open(`https://wa.me/${wa}?text=${encodeURIComponent(`Olá! Sou ${who} e uso o Lembra. Preciso de ajuda com:`)}`, '_blank');
    else if (CONFIG.supportEmail) location.href = `mailto:${CONFIG.supportEmail}?subject=${encodeURIComponent('Ajuda com o Lembra')}`;
  },
  ranking: async () => (await import('./views/ranking.js')).openRanking(),
  'install-guide': () => showInstallGuide({ force: true }),
  plans: () => openPlans(),
  'gratis-info': () => openSheet({ className: 'sheet--dialog', html: `<div class="dialog gratisdlg">
      <span class="gratisdlg__ic">${icon('gift', 30)}</span>
      <h3>O Lembra é grátis até 31 de dezembro de 2026</h3>
      <p>Tudo liberado pra todo mundo durante o lançamento: agenda, modo Pessoal, lembretes, mascote, stories, amigos, ranking e o assistente com IA. Sem cartão e sem pegadinha.</p>
      <p class="fhelp">A partir de 2027 vai ter planos pagos. A gente avisa com antecedência, e ninguém é cobrado sem escolher assinar.</p>
      <button class="btn btn--primary btn--block" data-ok>Entendi</button>
      <button class="btn btn--ghost btn--block" data-esconde>Não mostrar mais a faixa</button></div>`,
    onMount: (x) => { x.el.querySelector('[data-ok]').onclick = () => x.close(); x.el.querySelector('[data-esconde]').onclick = () => { try { localStorage.setItem('lembra.gratisbar', '1'); } catch { /* ok */ } x.close(); render(); }; } }),
  'billing-portal': () => openPortal().catch((e) => toast(e.message || 'Não consegui abrir agora')),
  guide: async () => (await import('./views/guide.js')).openGuide(),
  ficha: async () => (await import('./views/ficha.js')).editFicha(),
  share: () => openShare(),
  privacy: async () => (await import('./privacy.js')).openPrivacy(),
  theme: (b) => { setThemePref(b.dataset.v); applySpaceMeta(ui.space === 'personal'); render(); },
  admin: async () => (await import('./views/admin.js')).openAdmin(),
  staff: async () => (await import('./views/staff.js')).openStaff(),
  'set-person': (b) => {
    ui.person = b.dataset.p;
    saveUi();
    render();
  },
  'set-date': (b) => {
    ui.date = b.dataset.k;
    render();
  },
  'go-today': () => {
    ui.date = todayKey();
    ui.stripCenter = null; ui.stripLeft = null; ui.stripReset = true;
    render();
  },
  week: (b) => {
    // setas: anda uma semana na faixa (sem mudar o dia escolhido)
    const strip = document.querySelector('[data-strip]');
    if (!strip) return;
    const days = [...strip.children].map((c) => c.dataset.k);
    const target = addDays(strip.dataset.left || days[0], Number(b.dataset.n));
    const i = days.indexOf(target);
    // perto da ponta (ou fora dela): redesenha a faixa já centralizada na semana nova — nunca perde semanas
    if (i < 7 || i > days.length - 14) {
      ui.stripCenter = addDays(target, 3);
      ui.stripLeft = target;
      ui.stripReset = true;
      render();
      return;
    }
    strip.dataset.left = target;
    strip.dataset.touch = String(Date.now());
    strip.scrollTo({ left: i * cellW(strip), behavior: 'smooth' });
  },
  month: (b) => {
    ui.month = addMonths(ui.month, Number(b.dataset.n));
    ui.monthSel = ui.month === monthKey(todayKey()) ? todayKey() : `${ui.month}-01`;
    render();
  },
  'month-today': () => {
    ui.month = monthKey(todayKey());
    ui.monthSel = todayKey();
    render();
  },
  'month-select': (b) => {
    ui.monthSel = b.dataset.k;
    if (monthKey(b.dataset.k) !== ui.month) ui.month = monthKey(b.dataset.k);
    render();
  },
  'month-company': (b) => {
    ui.monthCompany = b.dataset.id || null;
    render();
  },
  'open-day': (b) => {
    ui.date = b.dataset.k;
    setTab('hoje');
  },
  lixeira: () => openLixeira(),
  'minhas-frases': () => import('./frase.js').then((m) => m.minhasFrases()),
  mensagens: () => import('./privado.js').then((m) => m.openMensagens()),
  visitas: () => import('./stories.js').then((m) => m.openVisitors()).then(() => render()),
  'ui-toggle': (b) => { ui[b.dataset.k] = !ui[b.dataset.k]; render(); },
  acc: (b) => { const k = b.dataset.k; ui.acc[k] = !ui.acc[k]; const s = b.closest('.acc'); s.classList.toggle('is-open', ui.acc[k]); b.setAttribute('aria-expanded', !!ui.acc[k]); },
  'toggle-types': () => { ui.showTypes = !ui.showTypes; render(); },
  'new-event-preset': (b) => openEventEditor({ date: b.dataset.date || null, time: b.dataset.time || null, title: b.dataset.title || '' }),
  'adiar-1h': async (b) => {
    const e = store.event(b.dataset.id); if (!e) return;
    if (!e.time) return openEventEditor({ id: e.id }); // sem horário: escolhe no editor
    const m = Math.min(23 * 60 + 59, toMin(e.time) + 60), t = `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
    const M = window.__motion, g = M && M.guardar(b.closest('.foco, .ecard'));
    await store.upsert('events', { ...e, time: t });
    if (M && store.event(e.id)?.time === t) M.adiado(g);
    toast(`Adiado para ${t}`);
  },
  'toggle-tips': () => {
    ui.showAllTips = !ui.showAllTips;
    render();
  },
  'open-event': (b) => openEventDetail(b.dataset.id),
  assistant: () => openAssistant(),
  'apply-fix': async (b) => {
    const e = store.event(b.dataset.id);
    if (!e) return;
    let patch;
    try {
      patch = JSON.parse(b.dataset.patch);
    } catch {
      return;
    }
    const allowed = {};
    if (typeof patch.time === 'string' && /^\d{2}:\d{2}$/.test(patch.time)) allowed.time = patch.time;
    if (Array.isArray(patch.assignees)) allowed.assignees = patch.assignees.filter((id) => store.member(id));
    const { confirmMove } = await import('./views/event.js');
    if (!(await confirmMove(e, allowed))) return;
    const before = { ...e };
    await store.upsert('events', { ...e, ...allowed });
    toast('Pronto, ajustado', { action: 'Desfazer', onAction: () => store.upsert('events', before) });
  },
  'toggle-done': async (b) => {
    const e = store.event(b.dataset.id);
    if (!e) return;
    const status = e.status === 'feito' ? 'pendente' : 'feito';
    const at = b.getBoundingClientRect(); // a tela é redesenhada ao salvar: mede o botão antes
    const M = window.__motion, foto = M && status === 'feito' && b.closest('#view') ? M.antes(b.closest('.foco, .ecard')) : null;
    await store.upsert('events', { ...e, status });
    if (foto && store.event(e.id)?.status === 'feito') M.concluir(foto);
    if (status === 'feito' && store.event(e.id)?.status === 'feito') {
      const left = e.date === todayKey() ? store.eventsOn(e.date, { person: store.me }).filter((x) => x.status !== 'feito').length : null;
      toast(onDone({ el: at, left }), { action: 'Desfazer', onAction: () => store.upsert('events', { ...store.event(e.id), status: e.status }) });
    }
  },
  ...personalActions,
  'new-event': (b) => {
    if (!store.state.companies.length && isMarketing()) {
      toast('Cadastre uma empresa primeiro');
      return openCompanyEditor(null, () => openEventEditor({}));
    }
    openEventEditor({ date: b.dataset.date || null });
  },
  'open-company': (b) => openCompany(b.dataset.id),
  'new-company': () => openCompanyEditor(),
  'del-note': async (b) => {
    const lote = await store.remove('notes', b.dataset.id);
    if (lote) avisaApagado(lote, 'Bilhete apagado');
  },
  'set-me': (b) => {
    store.setMe(b.dataset.p);
    toast(`Olá, ${store.member(b.dataset.p).name}!`);
  },
  'clear-demo': async () => {
    const ok = await confirmDialog({ title: 'Apagar os dados de exemplo?', text: 'O calendário ficará vazio para vocês cadastrarem as empresas e eventos reais.', ok: 'Apagar exemplos', danger: true });
    if (!ok) return;
    await store.clearDemo();
    toast('Pronto! Agora cadastre suas empresas.');
  },
  'clear-all': () => settingsActions.clearAll(),
  ics: (b) => settingsActions.ics(b),
  'notify-enable': () => settingsActions.notifyEnable(),
  'vip-card': () => import('./vip.js').then((v) => v.openVipReveal({ cardOnly: true })),
  'notify-test': () => settingsActions.notifyTest(),
  'coach-test': () => settingsActions.coachTest(),
  'onboarding-again': () => settingsActions.onboardingAgain(),
  export: () => settingsActions.export(),
  whatsnew: async () => (await import('./version.js')).openNews(),
  'check-update': async (b) => {
    if (b) b.disabled = true;
    const r = await (await import('./version.js')).updateNow();
    if (b) b.disabled = false;
    if (!r.ok) return toast('Sem internet agora. Tente de novo daqui a pouco.');
    toast(r.current ? `Você já está na versão mais recente (${r.version}) ✓` : `Baixando a versão ${r.version}…`, { ms: 3500 });
  },
  logout: async () => {
    if (await confirmDialog({ title: 'Sair da conta?', text: 'Este celular deixa de receber os lembretes desta conta até você entrar de novo.', ok: 'Sair' })) {
      // antes de sair: este aparelho para de receber as notificações desta conta (privacidade)
      await Promise.race([push.unregisterDevice(), new Promise((r) => setTimeout(r, 4000))]);
      window.__saiu = true;
      await cloudApi.signOut();
      // (não apaga o banco do login aqui: com o app aberto, o apagar fica pendente e levaria junto o próximo login)
      try { Object.keys(localStorage).filter((k) => /^firebase:authUser:/.test(k)).forEach((k) => localStorage.removeItem(k)); } catch { /* ok */ }
      try { localStorage.removeItem(LS_UID); } catch { /* ok */ }
      // mostra o "Entrar" na hora: no app instalado (iPhone) o recarregar às vezes não acontece e a tela ficava vazia
      try {
        document.querySelectorAll('.sheet-wrap, .stv, .snhbud, .cvs, .toast, .photoview').forEach((e) => e.remove());
        document.body.className = ''; document.body.style.overflow = '';
        history.replaceState(null, '', location.pathname + location.search);
        showLogin();
      } catch { location.replace(location.pathname + '?saiu=' + Date.now()); }
    }
  },
};

// rede de segurança: nenhum formulário do app pode "enviar" a página (isso recarregaria o app)
document.addEventListener('submit', (ev) => ev.preventDefault(), true);

/* Conta sem plano ativo: qualquer toque na agenda ou nas abas não faz nada — abre os planos.
   (Ficam livres a tela de planos, a ficha, os termos, o convite da agenda compartilhada e "Sair".) */
const lockGuard = (ev) => {
  if (hasAccess() || document.body.classList.contains('is-client')) return;
  // só a agenda e as abas: janelas de convite, termos e confirmações continuam funcionando
  // (gravar continua bloqueado no store, para qualquer caminho)
  const inApp = ev.target.closest && ev.target.closest('#view, .tabbar');
  if (!inApp || ev.target.closest('[data-allow-locked], [data-action="logout"]')) return;
  // modo "só olhar": trocar de aba e ver a agenda é livre; criar/editar/concluir abre os planos
  if (ev.target.closest('[data-action="tab"], [data-action="ptab"], [data-action="space"], [data-action="switch-space"], [data-action="support"], [data-action="ranking"], [data-action="profile"], [data-action="team-board"], [data-action="check-update"], [data-action="whatsnew"]')) return;
  if (ev.type === 'focusin' && !ev.target.matches('input, textarea, select, [contenteditable]')) return;
  if (ev.type === 'click' && !ev.target.closest('button, a, input, textarea, select, label, [data-action], [role="button"], [data-id]')) return;
  ev.preventDefault();
  ev.stopPropagation();
  if (ev.type === 'focusin' && ev.target.blur) ev.target.blur();
  requireAccess();
};
['click', 'focusin'].forEach((t) => document.addEventListener(t, lockGuard, true));

document.addEventListener('click', (ev) => {
  const b = ev.target.closest('[data-action]');
  if (!b || document.body.classList.contains('is-client')) return;
  const fn = actions[b.dataset.action];
  if (!fn) return;
  ev.preventDefault();
  ev.stopPropagation();
  fn(b);
});
document.addEventListener('change', (ev) => {
  if (ev.target.matches('[data-humor]')) { try { localStorage.setItem('lembra.humor', ev.target.checked ? '1' : '0'); } catch { /* ok */ } }
  if (ev.target.matches('[data-motion]')) { try { localStorage.setItem('lembra.motion', ev.target.checked ? '1' : '0'); } catch { /* ok */ } }
  if (ev.target.matches('[data-sound]')) { setSound(ev.target.checked); if (ev.target.checked) chime(ui.space); }
  if (ev.target.matches('[data-action-change="import"]')) settingsActions.import(ev.target);
  if (ev.target.closest('[data-notify-form]')) settingsActions.notifyPrefs(ev.target.closest('[data-notify-form]'));
  if (ev.target.closest('[data-routine-form]')) settingsActions.routine(ev.target.closest('[data-routine-form]'));
});
document.addEventListener('submit', async (ev) => {
  const f = ev.target.closest('[data-form="note"]');
  if (!f) return;
  ev.preventDefault();
  const text = f.text.value.trim();
  if (!text) return;
  if (!store.me) {
    toast('Escolha quem você é em Ajustes');
    return;
  }
  const mentions = [...f.querySelectorAll('[name="mention"]:checked')].map((x) => x.value);
  const note = { id: uid('n_'), date: ui.date, text, author: store.me, mentions, createdAt: Date.now() };
  await store.upsert('notes', note);
  onNoteAdded(note);
  import('./rank.js').then((r) => r.rankAct('note', note.id));
  toast(mentions.length ? `Bilhete enviado para ${mentions.map((id) => store.member(id)?.name || '').filter(Boolean).join(' e ')}` : store.team.length > 1 ? 'Bilhete adicionado — a equipe foi avisada' : 'Bilhete adicionado');
});

/* ---------- gestos: deslizar semana/mês ---------- */
/* ---------- faixa contínua de dias (rola sem parar, vira o mês sozinha) ---------- */
const cellW = (strip) => (strip.firstElementChild ? strip.firstElementChild.getBoundingClientRect().width : 1) || 1;
function coachFab() {
  const fab = document.querySelector('.tabbar__fab'); if (!fab || document.querySelector('.coachfab')) return;
  const r = fab.getBoundingClientRect(), b = document.createElement('button');
  b.className = 'coachfab'; b.type = 'button'; b.textContent = 'Ou toque no + quando quiser';
  b.style.left = `${r.left + r.width / 2}px`; b.style.top = `${r.top - 12}px`;
  document.body.appendChild(b);
  const sai = () => { b.classList.add('is-out'); setTimeout(() => b.remove(), 300); };
  b.onclick = sai; setTimeout(sai, 6500);
}
function stripLeftDay(strip) {
  return strip.dataset.left || null; // posição guardada (não lê no meio de uma animação)
}
function bindStrip(view) {
  const strip = view.querySelector('[data-strip]');
  if (!strip) return;
  const days = [...strip.children].map((c) => c.dataset.k);
  let idx = ui.stripLeft ? days.indexOf(ui.stripLeft) : -1;
  if (idx < 0) idx = Math.max(0, days.indexOf(strip.dataset.sel) - 3);
  strip.dataset.left = days[idx];
  let ready = false;
  // posiciona só quando a tela já tem largura (mede de novo a cada vez)
  const place = (tries = 0) => {
    const w = cellW(strip);
    if (w < 10 && tries < 60) return requestAnimationFrame(() => place(tries + 1));
    strip.style.scrollBehavior = 'auto';
    strip.scrollLeft = idx * w;
    // o dia escolhido tem que aparecer (antes, no dia 23 a faixa podia mostrar 7–13): centraliza nele
    const sel = days.indexOf(strip.dataset.sel), vis = Math.max(1, Math.floor(strip.clientWidth / w));
    if (sel >= 0 && (sel < idx || sel >= idx + vis)) { idx = Math.max(0, sel - Math.floor(vis / 2)); strip.dataset.left = days[idx]; strip.scrollLeft = idx * w; }
    requestAnimationFrame(() => (ready = true));
  };
  place();
  const label = view.querySelector('[data-striplabel]');
  const M = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  let t = null, raf = 0;
  // só reage à rolagem que a PESSOA fez (dedo, mouse, setas). Rolagens causadas pelo navegador
  // (tela redesenhada, janela aberta por cima, print da tela) não podem mudar o mês.
  const touched = () => { strip.dataset.touch = String(Date.now()); };
  ['touchstart', 'pointerdown', 'wheel', 'mousedown'].forEach((ev) => strip.addEventListener(ev, touched, { passive: true }));
  strip.addEventListener('scroll', () => {
    if (!ready) return;
    if (Date.now() - Number(strip.dataset.touch || 0) > 2500) {
      // não foi a pessoa: volta para onde estava
      const want = days.indexOf(strip.dataset.left);
      const w = cellW(strip);
      if (want >= 0 && w >= 10 && Math.abs(strip.scrollLeft - want * w) > w / 2) { strip.style.scrollBehavior = 'auto'; strip.scrollLeft = want * w; }
      return;
    }
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      if (!strip.isConnected) return; // faixa antiga (a tela foi redesenhada): ignora
      const i = Math.round(strip.scrollLeft / cellW(strip));
      if (days[i]) strip.dataset.left = days[i];
      const mid = days[Math.min(days.length - 1, i + 3)];
      if (label && mid) label.textContent = `${M[+mid.slice(5, 7) - 1]}${+mid.slice(0, 4) !== new Date().getFullYear() ? ` de ${mid.slice(0, 4)}` : ''}`;
    });
    clearTimeout(t);
    t = setTimeout(() => {
      // a tela foi redesenhada no meio da rolagem: a faixa antiga não manda mais em nada
      // (sem isso, ela lia posição 0 e jogava o calendário para meses atrás)
      if (!strip.isConnected || cellW(strip) < 10) return;
      const i = Math.round(strip.scrollLeft / cellW(strip));
      // perto das pontas: anda a janela de dias e continua de onde estava (rolagem infinita)
      if (i < 14 || i > days.length - 7 - 14) {
        ui.stripCenter = days[Math.min(days.length - 1, i + 3)];
        ui.stripLeft = days[i];
        ui.stripReset = true; // usa o stripLeft acima, não o lido da tela
        render();
      }
    }, 160);
  }, { passive: true });
  strip.addEventListener('mousedown', (e) => { if (e.button === 0) { drag = { strip, x0: e.clientX, s0: strip.scrollLeft, moved: false, w: cellW(strip) }; strip.style.scrollSnapType = 'none'; } });
  strip.addEventListener('click', (e) => { if (dragMoved) { e.stopPropagation(); e.preventDefault(); dragMoved = false; } }, true);
}
let drag = null, dragMoved = false;
window.addEventListener('mousemove', (e) => {
  if (!drag) return;
  const dx = e.clientX - drag.x0;
  if (Math.abs(dx) > 5) drag.moved = true;
  drag.strip.scrollLeft = drag.s0 - dx;
});
window.addEventListener('mouseup', () => {
  if (!drag) return;
  const { strip, w, moved } = drag;
  drag = null;
  dragMoved = moved;
  strip.style.scrollSnapType = '';
  strip.scrollTo({ left: Math.round(strip.scrollLeft / w) * w, behavior: 'smooth' });
});

/* Arrastar para o lado troca a semana / o mês, acompanhando o dedo (ou o mouse/touchpad) */
let swipeEnterDir = 0;
function bindSwipes() {
  document.querySelectorAll('[data-swipe]').forEach((el) => {
    if (el.dataset.swipe === 'pmonth') return; // o Pessoal cuida do dele
    // animação de entrada depois da troca
    if (swipeEnterDir) {
      el.style.transition = 'none';
      el.style.transform = `translateX(${swipeEnterDir * 40}%)`;
      el.style.opacity = '0';
      requestAnimationFrame(() => requestAnimationFrame(() => {
        el.style.transition = 'transform .32s cubic-bezier(.2,.8,.2,1), opacity .25s ease';
        el.style.transform = '';
        el.style.opacity = '';
      }));
    }
    let x0 = null, y0 = null, dx = 0, locked = null, moved = false;
    const go = (dir) => {
      el.style.transition = 'transform .2s ease-in, opacity .2s ease-in';
      el.style.transform = `translateX(${-dir * 45}%)`;
      el.style.opacity = '0';
      setTimeout(() => {
        if (el.dataset.swipe === 'week') ui.date = addDays(ui.date, 7 * dir);
        else { ui.month = addMonths(ui.month, dir); ui.monthSel = `${ui.month}-01`; }
        swipeEnterDir = dir;
        render();
        swipeEnterDir = 0;
      }, 180);
    };
    const start = (x, y) => { x0 = x; y0 = y; dx = 0; locked = null; moved = false; el.style.transition = 'none'; };
    const move = (x, y, ev) => {
      if (x0 == null) return;
      dx = x - x0;
      const dy = y - y0;
      if (!locked && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) locked = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      if (locked !== 'x') return;
      moved = true;
      if (ev && ev.cancelable) ev.preventDefault();
      el.style.transform = `translateX(${dx * 0.9}px)`;
      el.style.opacity = String(Math.max(0.35, 1 - Math.abs(dx) / 500));
    };
    const end = () => {
      if (x0 == null) return;
      x0 = null;
      if (locked === 'x' && Math.abs(dx) > 50) return go(dx < 0 ? 1 : -1);
      el.style.transition = 'transform .25s cubic-bezier(.2,.8,.2,1), opacity .2s';
      el.style.transform = '';
      el.style.opacity = '';
    };
    el.addEventListener('touchstart', (e) => start(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
    el.addEventListener('touchmove', (e) => move(e.touches[0].clientX, e.touches[0].clientY, e), { passive: false });
    el.addEventListener('touchend', end);
    // mouse (computador): arrastar com o botão apertado
    el.addEventListener('mousedown', (e) => { if (e.button === 0) start(e.clientX, e.clientY); });
    el.addEventListener('mousemove', (e) => { if (x0 != null) move(e.clientX, e.clientY, e); });
    el.addEventListener('mouseup', end);
    el.addEventListener('mouseleave', end);
    // um arrasto não vira toque no dia
    el.addEventListener('click', (e) => { if (moved) { e.stopPropagation(); e.preventDefault(); moved = false; } }, true);
    // touchpad: rolagem lateral com dois dedos
    let wheelAcc = 0, wheelT = 0;
    el.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      if (Date.now() - wheelT < 450) return;
      wheelAcc += e.deltaX;
      if (Math.abs(wheelAcc) > 60) { wheelT = Date.now(); go(wheelAcc > 0 ? 1 : -1); wheelAcc = 0; }
    }, { passive: false });
  });
}

/* ---------- avisos com o app aberto ---------- */
const notified = new Set();
/* Com o app aberto: mostra os lembretes na tela (e como notificação, se o servidor
   ainda não estiver mandando). Usa as mesmas regras do servidor. */
function checkReminders() {
  if (!store.me) return;
  const d = new Date();
  const now = { date: todayKey(), minutes: d.getHours() * 60 + d.getMinutes() };
  const mine = store.eventsBetween(addDays(now.date, -1), addDays(now.date, 1), { person: store.me });
  const serverOn = store.mode === 'cloud' && !!localStorage.getItem('pauta.device');
  dueReminders(mine, now, 2).forEach(({ ev, offset }) => {
    const key = `${ev.id}@${offset}@${ev.date}${ev.time}`;
    if (notified.has(key)) return;
    notified.add(key);
    const msg = reminderMessage(ev, offset, store.company(ev.companyId)?.name || '');
    toast(`${msg.title}`, { ms: 7000, action: 'Ver', onAction: () => openEventDetail(ev.id) });
    if (!serverOn && push.permission() === 'granted' && navigator.serviceWorker) {
      if (ehRemedio(ev)) Object.assign(msg, avisoRemedio());
      navigator.serviceWorker.ready.then((reg) => reg.showNotification(msg.title, { body: msg.body, tag: `rem-${ev.id}`, icon: 'icons/icon-192.png', badge: 'icons/icon-192.png', data: { url: `./#/e/${ev.id}` } })).catch(() => {});
    }
  });
  // número no ícone: tarefas pendentes de hoje
  push.updateBadge(store.eventsOn(now.date, { person: store.me }).filter((e) => e.status !== 'feito').length);
}

/* Foto de perfil obrigatória para contas novas (criadas a partir de 21/11/2026): tela que só fecha com a foto */
const PHOTO_FROM = Date.parse('2026-11-21T00:00:00-03:00');
function requirePhoto(tries = 0) {
  if (!store.solo || store.mode !== 'cloud' || !store.user || store.shared) return;
  const me = store.member(store.me) || {};
  const created = store.user.metadata?.creationTime ? Date.parse(store.user.metadata.creationTime) : 0;
  if (window.__comeco?.semNada() && tries < 200) { setTimeout(() => requirePhoto(tries + 1), 15000); return; } // primeiro o 1º lembrete
  if (me.photo || created < PHOTO_FROM || document.querySelector('.photogate')) return;
  // espera a ficha, os termos e a tela de planos saírem da frente
  // (e também perguntas abertas, como "entrar na agenda de quem te convidou?", e comemorações de conquistas)
  if (document.querySelector('.ficha, .termsgate, .paywall.is-open, .sheet--dialog, .gx, .pkr') || pendingInvite()) { if (tries < 200) setTimeout(() => requirePhoto(tries + 1), 3000); return; }
  const w = document.createElement('div');
  w.className = 'photogate';
  w.innerHTML = `<div class="photogate__in">
    <div class="photogate__pic" data-pic>${avatar(store.me, 120)}</div>
    <h2>Coloque sua foto de perfil</h2>
    <p>Assim sua dupla, sua equipe e seus clientes sabem quem é quem. Leva 5 segundos.</p>
    <label class="btn btn--primary btn--block btn--big">${icon('camera', 18)} Escolher foto<input type="file" accept="image/*" data-photo hidden></label>
    <p class="photogate__err" data-err hidden></p>
  </div>`;
  document.body.appendChild(w);
  requestAnimationFrame(() => w.classList.add('is-open'));
  w.querySelector('[data-photo]').onchange = async (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const err = w.querySelector('[data-err]');
    try {
      const photo = await (await import('./views/profile.js')).cropper(f); // recortar e posicionar antes de salvar
      if (!photo) return;
      w.querySelector('[data-pic]').innerHTML = `<img src="${photo}" alt="">`;
      // não mexe no nome: o "me.name" é o apelido e apagaria o nome completo da ficha
      await saveMyProfile({ ...(store.profile?.name ? {} : { name: me.name }), photo, color: me.color });
      toast('Foto salva ✓');
      setTimeout(() => { w.classList.remove('is-open'); setTimeout(() => w.remove(), 300); render(); }, 600);
    } catch (x) { err.textContent = 'Não consegui usar essa foto. Tente outra.'; err.hidden = false; }
  };
}

/* Avisos desligados: o Lembra não consegue te alcançar. Pede de novo, com jeito (no máximo a cada 3 dias).
   Quem ganhou o Vitalício: nos 3 primeiros dias pede toda vez que abrir o app; depois, uma vez por dia
   (e a faixa no topo fica até ativar). */
let askedThisOpen = false;
function askNotifications() {
  if (store.mode !== 'cloud' || typeof Notification === 'undefined' || Notification.permission === 'granted' || askedThisOpen || window.__vipAskedNotif) return;
  if (document.querySelector('.sheet-wrap.is-open, .paywall.is-open, .photogate, .ficha, .vip, .gx, .avgate')) { setTimeout(askNotifications, 8000); return; }
  let last = 0; try { last = Number(localStorage.getItem('lembra.askNotif') || 0); } catch { /* ok */ }
  const vip = store.billing?.plan === 'lifetime' && store.billing?.vip;
  const every = vip ? (Date.now() - (vip.at || 0) < 3 * 864e5 ? 0 : 20 * 3600e3) : 3 * 864e5;
  if (Date.now() - last < every) return;
  askedThisOpen = true;
  try { localStorage.setItem('lembra.askNotif', String(Date.now())); } catch { /* ok */ }
  const denied = Notification.permission === 'denied';
  const s = openSheet({
    className: 'sheet--dialog',
    html: `<div class="dialog">
      <h3>🔔 Sem avisos, o Lembra fica mudo</h3>
      <p>${denied ? 'As notificações estão bloqueadas neste celular. Para receber os lembretes na hora certa, ative em <b>Ajustes do iPhone → Notificações → Lembra</b> (no Android: segure o ícone → Informações do app → Notificações).' : 'É pelos avisos que o Lembra te lembra na hora certa — mesmo com o app fechado. Leva 2 segundos.'}</p>
      ${denied ? '<button class="btn btn--primary btn--block" data-close>Entendi</button>' : '<button class="btn btn--primary btn--block" data-enable>Ativar os avisos</button><button class="btn-text btn--block" data-close>Agora não</button>'}
    </div>`,
    onMount: (a) => { const b = a.el.querySelector('[data-enable]'); if (b) b.onclick = () => { a.close && a.close(); settingsActions.notifyEnable(); }; },
  });
  return s;
}

/* Aviso único (ex.: Matheus usa uma instalação antiga): pede para abrir o site no Safari e instalar de novo */
const REINSTALL_FOR = ['matheus'];
const REINSTALL_HASH = /^#\/atualizar/.test(location.hash);
function askReinstall() {
  const forced = REINSTALL_HASH;
  if (forced) history.replaceState(null, '', location.pathname + location.search);
  let seen = false; try { seen = localStorage.getItem('lembra.reinstall.2611') === '1'; } catch { /* ok */ }
  if (!forced && (seen || !REINSTALL_FOR.includes(store.me))) return;
  const site = CONFIG.siteUrl || 'https://icarlxs-code.github.io/Calend-rio-/';
  const s = openSheet({
    className: 'sheet--dialog',
    html: `<div class="dialog">
      <h3>📲 Tem versão nova do Lembra</h3>
      <p>Para receber todas as novidades, instale o app de novo:</p>
      <p><b>1.</b> Toque em “Abrir no Safari” abaixo.<br><b>2.</b> No Safari, toque em <b>Compartilhar</b> (o quadrado com a seta) → <b>Adicionar à Tela de Início</b>.<br><b>3.</b> Entre com a sua conta e pode apagar o ícone antigo.</p>
      <a class="btn btn--primary btn--block" href="${site}?v=${Date.now()}" target="_blank" rel="noopener" data-ok>Abrir no Safari</a>
      <button class="btn-text btn--block" data-close>Agora não</button>
    </div>`,
  });
  try { localStorage.setItem('lembra.reinstall.2611', '1'); } catch { /* ok */ }
  return s;
}

/* Abre o lugar certo quando a pessoa toca numa notificação (#/e/ID ou #/d/DATA) */
function openDeepLink(hash = location.hash, tries = 0) {
  // veio do aviso "Você recebeu algo raro.": confere o plano de novo e mostra a revelação (uma vez)
  if (/^#\/vitalicio$/.test(hash || '')) {
    history.replaceState(null, '', location.pathname + location.search);
    if (store.solo && store.mode === 'cloud') checkBilling().then(() => { render(); import('./vip.js').then((v) => v.maybeShowVip()); }).catch(() => {});
    return true;
  }
  if (/^#\/stories$/.test(hash || '')) { history.replaceState(null, '', location.pathname + location.search); import('./stories.js').then((m) => m.openStoriesFeed()); return true; }
  const fr = /^#\/frase\/([A-Za-z0-9-]{3,40})$/.exec(hash || '');
  if (fr || /^#\/frases$/.test(hash || '')) { history.replaceState(null, '', location.pathname + location.search); window.PautaIntro && window.PautaIntro.finish(); import('./frase.js').then((m) => (fr ? m.abrePorId(fr[1]) : m.minhasFrases())); return true; }
  if (/^#\/retro\/2026$/.test(hash || '')) { history.replaceState(null, '', location.pathname + location.search); window.PautaIntro && window.PautaIntro.finish(); import('./retro-telas.js').then((m) => m.abreRetro()); return true; }
  const priv = /^#\/privado(?:\/([A-Za-z0-9]{6,64}))?$/.exec(hash || '');
  if (priv) { history.replaceState(null, '', location.pathname + location.search); window.PautaIntro && window.PautaIntro.finish(); import('./privado.js').then((m) => (priv[1] ? m.openConversa(priv[1]) : m.openMensagens())); return true; }
  if (/^#\/visitas$/.test(hash || '')) { history.replaceState(null, '', location.pathname + location.search); import('./stories.js').then((m) => m.openVisitors()); return true; }
  if (/^#\/amigos$/.test(hash || '')) { history.replaceState(null, '', location.pathname + location.search); import('./friends.js').then((m) => m.openFriends()); return true; }
  if (/^#\/amigo\//.test(hash || '')) { import('./friends.js').then((m) => { m.captureFriendLink(hash); m.processFriendLink(); }); return true; }
  if (/^#\/ranking$/.test(hash || '')) { history.replaceState(null, '', location.pathname + location.search); import('./views/ranking.js').then((m) => m.openRanking()); return true; }
  if (/^#\/suporte(-dono)?$/.test(hash || '')) {
    history.replaceState(null, '', location.pathname + location.search);
    import('./views/support.js').then((m) => (/dono/.test(hash) ? m.openSupportInbox() : m.openSupport()));
    return true;
  }
  const m = /^#\/(e|d|p)\/([\w-]+)/.exec(hash || '');
  if (!m) return false;
  window.PautaIntro && window.PautaIntro.finish(); // veio de uma notificação: vai direto ao ponto
  // app abrindo do zero: espera os dados chegarem (até ~10 s) antes de procurar o evento
  if (m[1] === 'p') {
    if (m[2] !== 'hoje' && !personal.item(m[2]) && tries < 20) { setTimeout(() => openDeepLink(hash, tries + 1), 500); return true; }
    history.replaceState(null, '', location.pathname + location.search);
    if (ui.space !== 'personal') { ui.space = 'personal'; saveUi(); shell(); }
    ui.ptab = 'p-hoje';
    render();
    if (personal.item(m[2])) openPersonalEditor(m[2]);
    return true;
  }
  if (m[1] === 'e' && !store.event(m[2]) && tries < 20) {
    setTimeout(() => openDeepLink(hash, tries + 1), 500);
    return true;
  }
  history.replaceState(null, '', location.pathname + location.search);
  if (ui.space !== 'work') { ui.space = 'work'; saveUi(); shell(); }
  if (m[1] === 'e' && store.event(m[2])) {
    // fecha o que estiver aberto e mostra o evento certo
    document.querySelectorAll('.sheet-wrap.is-open [data-close]').forEach((b) => b.closest('.sheet-wrap') && b.click());
    ui.date = store.event(m[2]).date;
    setTab('hoje');
    openEventDetail(m[2]);
  } else if (m[1] === 'd' && /^\d{4}-\d{2}-\d{2}$/.test(m[2])) {
    ui.date = m[2];
    setTab('hoje');
  } else if (m[1] === 'e') {
    toast('Esse compromisso não existe mais (foi removido).');
  }
  return true;
}

/* ---------- login (modo nuvem) ---------- */
const LOGIN_ERRORS = {
  'auth/email-already-in-use': 'Este e-mail já tem conta. Toque em “Entrar” e use a sua senha.',
  'auth/weak-password': 'Senha fraca: use pelo menos 8 caracteres, com letras e números.',
  'auth/invalid-email': 'E-mail inválido. Confira se digitou certo.',
  'auth/invalid-credential': 'E-mail ou senha incorretos. Confira a senha (toque no olho para ver o que digitou).',
  'auth/wrong-password': 'Senha incorreta.',
  'auth/user-not-found': 'Não existe conta com este e-mail. Toque em “Criar conta”.',
  'auth/too-many-requests': 'Muitas tentativas seguidas. Espere alguns minutos ou use "Esqueci minha senha".',
  'auth/network-request-failed': 'Sem conexão com a internet. Verifique o Wi-Fi/4G e tente de novo.',
  'auth/user-disabled': 'Este usuário foi desativado no Firebase.',
  'auth/operation-not-allowed': 'O login por e-mail/senha não está ativado no Firebase.',
  'auth/api-key-not-valid': 'Configuração do Firebase inválida (apiKey).',
  'auth/missing-email': 'Digite o seu e-mail.',
  'auth/missing-password': 'Digite a sua senha.',
  'auth/invalid-login-credentials': 'E-mail ou senha incorretos. Confira a senha (toque no olho para ver o que digitou).',
  'auth/password-does-not-meet-requirements': 'Senha fraca: use pelo menos 8 caracteres, com letras e números.',
};
// "Lembrar de mim": o e-mail fica salvo neste celular e a tela já abre em "Entrar" (a senha quem guarda é o
// cofre de senhas do celular — Chaves do iCloud / Google —, nunca o Lembra)
const LS_REMEMBER = 'lembra.lembrar';
const remembered = () => { try { return JSON.parse(localStorage.getItem(LS_REMEMBER) || 'null'); } catch { return null; } };
let loginEmail = remembered()?.email || '';
let rememberMe = remembered() ? !!remembered().on : true;
let loginName = '', loginPass = ''; // não perde o que foi digitado quando aparece um aviso
let loginNotice = '';
let loginTypo = '', typoAsked = ''; // sugestão de correção do e-mail (gmial.com → gmail.com)
let signupMode = false;
let pendingProfile = null;
/* qual conta entrou por último neste aparelho (protege contra sessão antiga de outra conta) */
const LS_UID = 'lembra.uid';
/* chegou por um link de amizade (guardado até entrar): o mais comum é ainda não ter conta */
const conviteAmigo = () => { if (/^#\/amigo\//.test(location.hash || '')) return true; try { const p = JSON.parse(localStorage.getItem('lembra.amigo') || 'null'); return !!p && Date.now() - p.at < 14 * 864e5; } catch { return false; } };
function purgeAuth() {
  try { Object.keys(localStorage).filter((k) => /^firebase:authUser:/.test(k)).forEach((k) => localStorage.removeItem(k)); } catch { /* ok */ }
  try { indexedDB.deleteDatabase('firebaseLocalStorageDb'); } catch { /* ok */ }
}
let loginConsent = false;
/* endereço oficial (páginas de termos e privacidade) */
const siteBase = () => (/^(localhost|127\.0\.0\.1)$/.test(location.hostname) || !CONFIG.siteUrl ? location.pathname.replace(/[^/]*$/, '') : CONFIG.siteUrl.replace(/\/?$/, '/'));

/* Convite recebido pelo link: mostra quem convidou já na tela de login */
let inviteInfo = null;
const invitedBy = () => (pendingInvite() ? (inviteInfo && inviteInfo.ownerName) || 'Uma pessoa' : '');
async function loadInviteInfo() {
  const p = pendingInvite();
  if (!p || !CONFIG.firebase) return;
  try {
    const { fetchInvite } = await import('./cloud.js');
    inviteInfo = await fetchInvite(CONFIG.firebase, p.token);
  } catch (e) { console.warn('convite', e); }
  const box = document.querySelector('.login__invite b');
  if (box && inviteInfo?.ownerName) box.textContent = inviteInfo.ownerName;
}
function showLogin(errMsg = '') {
  // 1ª vez na tela: quem nunca entrou neste aparelho cai em "Criar conta"; quem já entrou, em "Entrar"
  if (!showLogin.ini) {
    showLogin.ini = true;
    const jaEntrou = (() => { try { return !!remembered() || !!localStorage.getItem('lembra.jaentrou') || !!localStorage.getItem(LS_UID); } catch { return false; } })();
    signupMode = !jaEntrou;
  }
  // já entrou antes neste celular: abre direto em "Entrar", com o e-mail lembrado
  if (remembered()?.email && !showLogin.rem && !invitedBy() && !conviteAmigo()) { showLogin.rem = true; signupMode = false; }
  try { if (sessionStorage.getItem('lembra.deleted')) { sessionStorage.removeItem('lembra.deleted'); loginNotice = 'Sua conta foi excluída e seus dados foram apagados. Obrigado por ter usado o Lembra.'; } } catch { /* ok */ }
  // convidado chegando pelo link: o mais comum é ainda não ter conta
  if ((invitedBy() || conviteAmigo()) && !showLogin.seen) { showLogin.seen = true; signupMode = true; }
  // veio do anúncio / da página de apresentação ("Testar grátis"): abre direto em "Criar conta"
  if (/^#\/cadastro/.test(location.hash)) { signupMode = true; history.replaceState(null, '', location.pathname + location.search); }
  const msg = errMsg || loginNotice;
  root.innerHTML = `
  <div class="login login--novo${showLogin.ja ? '' : ' login--entra'}">
    <div class="login__cena">${cena()}<div class="login__marca">${brand('palavra', { h: 34, alt: esc(CONFIG.appName), on: momento() === 'noite' ? 'dark' : 'light' })}</div>${boneco3d(msg ? 'pensa' : 'acena', 172)}<p class="login__fala" role="status"></p></div>
    <div class="login__folha">
    <h1 class="login__hook">${signupMode ? 'Crie sua conta grátis' : 'Que bom ter você aqui'}</h1>
    <p class="login__lead">${signupMode ? 'Em 2 minutos eu aprendo a sua rotina.' : 'Entre para ver o que tem para hoje.'}</p>
    ${invitedBy() ? `<div class="login__invite">${icon('users', 18)}<span><b>${esc(invitedBy())}</b> convidou você para a agenda de trabalho compartilhada. ${signupMode ? 'Crie sua conta' : 'Entre ou crie sua conta'} para participar — você não paga nada.</span></div>` : ''}
    <form class="form" data-login novalidate>
      ${signupMode ? `<div class="fgroup"><label class="flabel" for="l-name">Seu nome</label><input id="l-name" class="input" name="name" autocomplete="name" maxlength="40" placeholder="Seu primeiro nome" value="${esc(loginName)}"></div>` : ''}
      <div class="fgroup"><label class="flabel" for="l-email">E-mail</label><input id="l-email" class="input" type="email" name="email" value="${esc(loginEmail)}" autocomplete="username" autocapitalize="none" autocorrect="off" spellcheck="false" inputmode="email"></div>
      <div class="fgroup"><label class="flabel" for="l-pass">Senha</label>
        <div class="input-eye"><input id="l-pass" class="input" type="password" name="pass" autocomplete="${signupMode ? 'new-password' : 'current-password'}" placeholder="${signupMode ? '8+ caracteres, letras e números' : ''}" value="${esc(loginPass)}" autocapitalize="none" autocorrect="off" spellcheck="false">
        <button type="button" class="iconbtn iconbtn--sm" data-eye aria-label="Mostrar senha">${icon('eye', 18)}</button></div>
      </div>
      ${signupMode ? `<div class="login__forca" data-n="0"><i><b></b></i><ul><li data-r="8">${icon('check', 14)} 8 caracteres</li><li data-r="l">${icon('check', 14)} letras</li><li data-r="n">${icon('check', 14)} números</li></ul></div>
      <label class="consent"><input type="checkbox" name="consent" ${loginConsent ? 'checked' : ''}><span class="consent__dot" aria-hidden="true">${icon('check', 14)}</span>
        <span>Li e concordo com os <a href="${siteBase()}termos/" target="_blank" rel="noopener">Termos de Uso</a> e a <a href="${siteBase()}privacidade/" target="_blank" rel="noopener">Política de Privacidade</a> (LGPD).</span></label>` : ''}
      ${loginTypo ? `<div class="login__typo">Você quis dizer <b>${esc(loginTypo)}</b>? <button class="btn-text btn-text--sm" type="button" data-fixmail>Corrigir</button></div>` : ''}
      ${msg ? `<p class="login__err" role="alert">${esc(msg)}</p>` : ''}
      <button class="btn btn--primary btn--block" type="submit" data-go>${signupMode ? 'Criar minha conta' : 'Entrar'}</button>
      <label class="consent consent--remember"><input type="checkbox" name="remember" ${rememberMe ? 'checked' : ''}><span class="consent__dot" aria-hidden="true">${icon('check', 14)}</span>
        <span>Lembrar de mim neste celular</span></label>
      <div class="login__links">${signupMode ? '' : '<button class="btn-text btn-text--sm" type="button" data-reset>Esqueci minha senha</button>'}</div>
      <div class="login__switch">${signupMode ? 'Já tem conta?' : 'Ainda não tem conta?'} <button class="btn-text btn-text--sm" type="button" data-mode>${signupMode ? 'Entrar' : 'Criar conta'}</button></div>
      <p class="login__pe">${icon('lock', 14)} Seus dados são só seus.${isStandalone() ? '' : ` <button type="button" data-installguide>${icon('download', 15)} Instalar o app</button>`}</p>
    </form></div>
  </div>`;
  showLogin.ja = true;
  const f = root.querySelector('[data-login]');
  /* o Lembra recebe, reage a cada campo e explica os erros */
  const bon = root.querySelector('.c3d'), bal = root.querySelector('.login__fala');
  aquece3d(['acena', 'aponta', 'segredo', 'joia', 'festa', 'triste', 'pensa', 'amor']);
  const diz = (t, pose) => { if (!bal || bal._u === t) return; bal._u = t; pose3d(bon, pose); say(null, t, { bubble: bal, speed: 18 }); };
  if (msg) { const p0 = { triste: 'triste', desconfiado: 'pensa', acena: 'acena', feliz: 'joia' }; import('./guia.js').then(({ falaDoErro }) => { const l = falaDoErro(msg); setTimeout(() => diz(l.t, p0[l.m] || 'pensa'), 200); import('./sfx.js').then((m) => m.ui('erro')); }).catch(() => {}); }
  else setTimeout(() => diz(signupMode ? 'Oi! Eu sou o Lembra. Você vive, eu lembro 🔔' : 'Voltou! Eu já tava com saudade 🧡', 'acena'), 520);
  const senhaBoa = (v) => [v.length >= 8, /[A-Za-zÀ-ÿ]/.test(v), /\d/.test(v)];
  const escuta = (c, ev, fn) => { const i = f.elements[c]; if (i) i.addEventListener(ev, () => fn(i)); };
  escuta('name', 'focus', () => diz('Como eu te chamo?', 'aponta'));
  escuta('name', 'blur', (i) => { const n = tidyName(i.value).split(' ')[0]; i.classList.toggle('is-ok', n.length > 1); if (n.length > 1) diz(`Prazer, ${n}! Nome bonito assim eu não esqueço 😄`, 'amor'); });
  escuta('email', 'focus', () => diz(signupMode ? 'Seu e-mail. Prometo não mandar corrente 😅' : 'Me lembra o seu e-mail? Ironia, né 😄', 'aponta'));
  escuta('email', 'blur', (i) => { const e = cleanEmail(i.value); if (!e) return; const t = emailTypo(e); i.classList.toggle('is-ok', validEmail(e) && !t); if (t) diz(`Será que não era ${t}?`, 'pensa'); else if (!validEmail(e)) diz('Esse e-mail ficou incompleto. Confere comigo?', 'pensa'); else diz('E-mail certinho!', 'joia'); });
  escuta('pass', 'focus', (i) => { const e0 = cleanEmail(f.email.value), t0 = e0 && emailTypo(e0); if (t0) return diz(`Antes da senha: será que não era ${t0}?`, 'pensa'); diz(i.type === 'password' ? 'Pode digitar. Fechei os olhos! 🙈' : 'Tá aparecendo, hein? Olha em volta 👀', i.type === 'password' ? 'segredo' : 'pensa'); });
  const mede = (i) => { const fx0 = root.querySelector('.login__forca'); if (!fx0) return; const r = senhaBoa(i.value), n = r.filter(Boolean).length; fx0.dataset.n = i.value ? n : 0; ['8', 'l', 'n'].forEach((k, j) => fx0.querySelector(`[data-r="${k}"]`).classList.toggle('is-ok', r[j])); i.classList.toggle('is-ok', n === 3); return n; };
  if (f.pass.value) mede(f.pass);
  escuta('pass', 'input', (i) => { if (mede(i) === 3) diz('Essa nem eu adivinho! 🔒', 'joia'); });
  escuta('consent', 'change', (i) => { if (i.checked) diz('Combinado! Eu as-SINO embaixo ✍️', 'festa'); });
  f.addEventListener('submit', () => import('./sfx.js').then((m) => m.ui('clique')));
  const fx = root.querySelector('[data-fixmail]');
  if (fx) fx.onclick = () => { loginEmail = loginTypo; loginTypo = ''; loginName = tidyName(f.name?.value || loginName); loginPass = f.pass.value; loginConsent = !!f.consent?.checked; showLogin(); };
  root.querySelector('[data-eye]').onclick = () => {
    f.pass.type = f.pass.type === 'password' ? 'text' : 'password';
    diz(f.pass.type === 'text' ? 'Opa, espiei só um pouquinho 👀' : 'Olhos fechados de novo! 🙈', f.pass.type === 'text' ? 'pensa' : 'segredo');
  };
  f.onsubmit = async (ev) => {
    ev.preventDefault();
    // e-mail: tira espaços (o teclado do celular costuma pôr um no fim) e confere a digitação
    const email = cleanEmail(f.email.value);
    const pass = f.pass.value;
    loginEmail = email;
    loginPass = pass;
    if (signupMode) loginName = tidyName(f.name.value);
    if (signupMode) loginConsent = !!f.consent?.checked;
    loginNotice = '';
    loginTypo = '';
    if (!email || !pass) return showLogin(!email ? 'Digite o seu e-mail.' : 'Digite a sua senha.');
    if (!validEmail(email)) return showLogin('E-mail incompleto ou com erro de digitação. Exemplo: nome@gmail.com');
    const name = signupMode ? loginName : '';
    if (signupMode && !name) return showLogin('Escreva seu nome.');
    if (signupMode && !validNameChars(name)) return showLogin('O nome deve ter só letras (sem números ou símbolos).');
    // domínio parecido com um famoso (gmial.com, hotmail.con): pergunta antes de criar a conta com e-mail errado
    if (signupMode && emailTypo(email) && typoAsked !== email) { typoAsked = email; loginTypo = emailTypo(email); return showLogin('Confira o seu e-mail antes de continuar (toque de novo em “Criar minha conta” se estiver certo).'); }
    // senha forte: 8+ caracteres com letras e números (dificulta invasão por tentativa)
    if (signupMode && (pass.length < 8 || !/[A-Za-zÀ-ÿ]/.test(pass) || !/\d/.test(pass))) return showLogin('Crie uma senha com pelo menos 8 caracteres, misturando letras e números.');
    if (signupMode && !loginConsent) return showLogin('Para criar a conta, aceite os Termos de Uso e a Política de Privacidade.');
    const go = f.querySelector('[data-go]');
    go.disabled = true;
    go.textContent = signupMode ? 'Criando…' : 'Entrando…';
    diz(signupMode ? 'Preparando o seu cantinho…' : 'Abrindo a porta…', 'festa');
    try {
      if (signupMode) pendingProfile = { name, consentAt: Date.now(), termsVersion: CONFIG.termsVersion || '1.0' };
      // vai entrar outra conta: esquece qualquer sessão guardada antes
      try { localStorage.removeItem(LS_UID); } catch { /* ok */ }
      await Promise.race([
        (signupMode ? cloudApi.signUp(email, pass, name) : cloudApi.signIn(email, pass)).then((cred) => { try { localStorage.setItem(LS_UID, cred.user.uid); rememberMe = !!f.remember?.checked; sessionStorage.setItem('lembra.sess', '1'); localStorage.setItem(LS_REMEMBER, JSON.stringify(rememberMe ? { on: true, email } : { on: false })); } catch { /* ok */ } return cred; }),
        new Promise((_, rej) => setTimeout(() => rej({ code: 'timeout' }), 20000)),
      ]);
      // deu certo: a tela muda sozinha quando o Firebase confirmar o login
      loginPass = '';
      go.textContent = 'Abrindo…';
    } catch (err) {
      const code = err && err.code;
      showLogin(code === 'timeout' ? 'O servidor demorou para responder. Verifique a internet e tente de novo.' : LOGIN_ERRORS[code] || `Não foi possível entrar (${code || err?.message || 'erro desconhecido'}).`);
    }
  };
  const ig = root.querySelector('[data-installguide]');
  if (ig) ig.onclick = () => showInstallGuide({ force: true });
  root.querySelector('[data-mode]').onclick = () => { loginEmail = cleanEmail(f.email.value); loginPass = f.pass.value; loginTypo = ''; signupMode = !signupMode; showLogin(); };
  const rs = root.querySelector('[data-reset]');
  if (rs) rs.onclick = () => { loginEmail = cleanEmail(f.email.value); showForgot(); };
}

/* ---------- Esqueci minha senha: tela própria, à prova de erro ----------
   1) confere o e-mail (formato e erro de digitação: gmial.com…)  2) envia o link (Firebase)
   3) mostra onde procurar (Spam/Promoções), botão para abrir o app de e-mail e "Reenviar" com contador
   4) não chegou? fala com o suporte mesmo sem entrar (o dono responde por e-mail) */
const phoneOn = () => { try { return !!CONFIG.phoneAuth || localStorage.getItem('cal.phoneAuth') === '1'; } catch { return !!CONFIG.phoneAuth; } };
const MAILAPP = [[/@(gmail|googlemail)\./, 'Abrir o Gmail', 'https://mail.google.com/mail/u/0/#search/Lembra'], [/@(hotmail|outlook|live|msn)\./, 'Abrir o Outlook', 'https://outlook.live.com/mail/'], [/@(icloud|me|mac)\./, 'Abrir o iCloud Mail', 'https://www.icloud.com/mail'], [/@yahoo\./, 'Abrir o Yahoo Mail', 'https://mail.yahoo.com/']];
let forgotSentAt = 0, forgotTo = '';
function showForgot(state = 'form', msg = '') {
  const email = loginEmail || '';
  const app = MAILAPP.find(([re]) => re.test(forgotTo || email));
  const wait = Math.max(0, 60 - Math.round((Date.now() - forgotSentAt) / 1000));
  root.innerHTML = `<div class="login login--novo login--forgot">
    <div class="login__cena">${cena()}<div class="login__marca">${brand('palavra', { h: 34, alt: esc(CONFIG.appName), on: momento() === 'noite' ? 'dark' : 'light' })}</div>${boneco3d(msg ? 'triste' : state === 'sent' || state === 'helped' ? 'joia' : 'pensa', 172)}<p class="login__fala" role="status">${state === 'sent' ? 'Mandei! Corre no seu e-mail 📬' : state === 'helped' ? 'Recado recebido 🧡' : state === 'help' ? 'Conta pra mim, eu resolvo.' : 'Esqueceu? Relaxa, lembrar é comigo 😄'}</p></div>
    <div class="login__folha">
    ${state === 'sent' ? `<h1 class="login__hook">Confira seu e-mail</h1>
      <p class="login__lead">Enviamos um link para <b>${esc(forgotTo)}</b>. Toque nele para criar uma senha nova. Ele vale por 1 hora.</p>
      <ul class="fsteps">
        <li>${icon('mail', 18)}<span>Procure por <b>“Redefinir senha”</b> ou <b>“Lembra”</b>.</span></li>
        <li>${icon('alert', 18)}<span>Não achou? Olhe também em <b>Spam</b>, <b>Lixo eletrônico</b> e <b>Promoções</b>. Pode levar até 5 minutos.</span></li>
        <li>${icon('check', 18)}<span>Criou a senha nova? Volte aqui e entre com ela.</span></li>
      </ul>
      ${app ? `<a class="btn btn--primary btn--block" href="${app[2]}" target="_blank" rel="noopener">${icon('mail', 18)} ${app[1]}</a>` : ''}
      <button class="btn btn--soft btn--block" data-resend ${wait ? 'disabled' : ''}>${wait ? `Reenviar em ${wait}s` : 'Reenviar o e-mail'}</button>
      <button class="btn-text btn-text--sm" data-other>Usar outro e-mail</button>
      <div class="fhelpbox"><b>Não chegou de jeito nenhum?</b><p>Fale com a gente sem precisar entrar: respondemos no seu e-mail.</p><button class="btn btn--soft btn--sm" data-help>${icon('headset', 16)} Pedir ajuda</button></div>`
    : state === 'help' ? `<h1 class="login__hook">Pedir ajuda</h1>
      <p class="login__lead">Conte o que aconteceu. A equipe do Lembra responde no e-mail abaixo em até 24h.</p>
      <form class="form" data-helpform novalidate>
        <div class="fgroup"><label class="flabel" for="h-email">Seu e-mail</label><input id="h-email" class="input" type="email" name="email" value="${esc(email)}" autocomplete="email" autocapitalize="none" inputmode="email"></div>
        <div class="fgroup"><label class="flabel" for="h-text">Mensagem</label><textarea id="h-text" class="input" name="text" rows="4" maxlength="1000" placeholder="Ex.: pedi para trocar a senha e o e-mail não chegou."></textarea></div>
        ${msg ? `<p class="login__err" role="alert">${esc(msg)}</p>` : ''}
        <button class="btn btn--primary btn--block" data-go>Enviar pedido de ajuda</button>
      </form>
      <button class="btn-text btn-text--sm" data-back>Voltar</button>`
    : state === 'helped' ? `<h1 class="login__hook">Pedido enviado ✓</h1>
      <p class="login__lead">Recebemos sua mensagem. Vamos responder no seu e-mail em até 24h (olhe também o Spam).</p>
      <button class="btn btn--primary btn--block" data-back>Voltar para entrar</button>`
    : `<h1 class="login__hook">Esqueceu a senha?</h1>
      <p class="login__lead">Sem problema. Digite o e-mail da sua conta e enviamos um link para criar uma senha nova.</p>
      <form class="form" data-forgot novalidate>
        <div class="fgroup"><label class="flabel" for="r-email">E-mail da conta</label><input id="r-email" class="input" type="email" name="email" value="${esc(email)}" autocomplete="username" autocapitalize="none" autocorrect="off" spellcheck="false" inputmode="email"></div>
        ${loginTypo ? `<div class="login__typo">Você quis dizer <b>${esc(loginTypo)}</b>? <button class="btn-text btn-text--sm" type="button" data-fixmail>Corrigir</button></div>` : ''}
        ${msg ? `<p class="login__err" role="alert">${esc(msg)}</p>` : ''}
        <button class="btn btn--primary btn--block" data-go>Enviar link</button>
      </form>
      ${phoneOn() ? `<button class="btn btn--soft btn--block" data-sms>${icon('phone', 18)} Recuperar pelo celular (SMS)</button>` : ''}
      <button class="btn-text btn-text--sm" data-back>Voltar para entrar</button>`}
  </div></div>`;
  const $ = (sel) => root.querySelector(sel);
  if ($('[data-back]')) $('[data-back]').onclick = () => { loginTypo = ''; showLogin(); };
  if ($('[data-other]')) $('[data-other]').onclick = () => showForgot('form');
  if ($('[data-help]')) $('[data-help]').onclick = () => showForgot('help');
  if ($('[data-sms]')) $('[data-sms]').onclick = async () => (await import('./phone.js')).recoverBySms(cloudApi, () => {});
  if ($('[data-fixmail]')) $('[data-fixmail]').onclick = () => { loginEmail = loginTypo; loginTypo = ''; showForgot('form'); };
  const send = async (to, btn) => {
    if (btn) { btn.disabled = true; btn.textContent = 'Enviando…'; }
    try {
      await Promise.race([cloudApi.resetPassword(to, `${siteBase().startsWith('http') ? siteBase() : location.origin + siteBase()}?senha=nova&email=${encodeURIComponent(to)}`), new Promise((_, rej) => setTimeout(() => rej({ code: 'timeout' }), 20000))]);
      forgotSentAt = Date.now(); forgotTo = to; loginEmail = to;
      showForgot('sent');
      const tick = setInterval(() => { const b = root.querySelector('[data-resend]'); if (!b) return clearInterval(tick); const w = Math.max(0, 60 - Math.round((Date.now() - forgotSentAt) / 1000)); b.disabled = !!w; b.textContent = w ? `Reenviar em ${w}s` : 'Reenviar o e-mail'; if (!w) clearInterval(tick); }, 1000);
    } catch (err) {
      const code = err && err.code;
      showForgot('form', code === 'timeout' ? 'O servidor demorou para responder. Verifique a internet e tente de novo.'
        : code === 'auth/too-many-requests' ? 'Muitos pedidos seguidos. Espere alguns minutos e tente de novo (ou use “Pedir ajuda”).'
        // limite diário de e-mails do plano grátis do Firebase: a pessoa não fica sem saída
        : code === 'auth/quota-exceeded' || /QUOTA|quota/.test(String(err?.message || '')) ? 'O envio de e-mails do Lembra está muito movimentado hoje. Toque em “Pedir ajuda” abaixo: a gente libera o seu acesso pelo suporte, ou tente de novo amanhã cedo.'
        : LOGIN_ERRORS[code] || 'Não consegui enviar agora. Tente de novo em instantes.');
    }
  };
  const ff = $('[data-forgot]');
  if (ff) ff.onsubmit = (ev) => {
    ev.preventDefault();
    const to = cleanEmail(ff.email.value);
    loginEmail = to;
    if (!to) return showForgot('form', 'Digite o e-mail da sua conta.');
    if (!validEmail(to)) return showForgot('form', 'E-mail incompleto ou com erro de digitação. Exemplo: nome@gmail.com');
    if (emailTypo(to) && typoAsked !== to) { typoAsked = to; loginTypo = emailTypo(to); return showForgot('form', 'Confira o e-mail antes de enviar (toque de novo em “Enviar link” se estiver certo).'); }
    loginTypo = '';
    send(to, ff.querySelector('[data-go]'));
  };
  if ($('[data-resend]')) $('[data-resend]').onclick = (e) => send(forgotTo, e.currentTarget);
  const hf = $('[data-helpform]');
  if (hf) hf.onsubmit = async (ev) => {
    ev.preventDefault();
    const em = cleanEmail(hf.email.value), text = hf.text.value.trim();
    loginEmail = em;
    if (!validEmail(em)) return showForgot('help', 'Digite um e-mail válido para a gente responder.');
    if (text.length < 5) return showForgot('help', 'Escreva o que aconteceu (pode ser curtinho).');
    const b = hf.querySelector('[data-go]'); b.disabled = true; b.textContent = 'Enviando…';
    try {
      const base = (localStorage.getItem('cal.pushServer') || CONFIG.pushServer || '').replace(/\/+$/, '');
      const r = await fetch(`${base}/support/guest`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: em, text, about: 'senha' }) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error || 'erro');
      showForgot('helped');
    } catch (e) { showForgot('help', e.message && e.message !== 'erro' ? e.message : 'Não consegui enviar agora. Verifique a internet e tente de novo.'); }
  };
}

/* ---------- Link do e-mail: criar a senha nova aqui mesmo no app ---------- */
async function showNewPassword(code) {
  let email = '';
  loading('Conferindo o link…');
  try { email = await cloudApi.verifyReset(code); }
  catch (e) {
    root.innerHTML = `<div class="login"><div class="brandwrap login__brand">${brand('simbolo', { h: 64 })}</div>
      <h1 class="login__hook">Esse link não vale mais</h1>
      <p class="login__lead">${e?.code === 'auth/expired-action-code' ? 'Ele passou de 1 hora.' : 'Ele já foi usado ou está incompleto.'} Peça um novo: leva 1 minuto.</p>
      <button class="btn btn--primary btn--block" data-again>Pedir um link novo</button></div>`;
    root.querySelector('[data-again]').onclick = () => { history.replaceState(null, '', location.pathname); showForgot('form'); };
    return;
  }
  const draw = (msg = '') => {
    root.innerHTML = `<div class="login"><div class="brandwrap login__brand">${brand('simbolo', { h: 64 })}</div>
      <h1 class="login__hook">Crie sua senha nova</h1>
      <p class="login__lead">Conta: <b>${esc(email)}</b></p>
      <form class="form" data-newpass novalidate>
        <div class="fgroup"><label class="flabel" for="n-pass">Senha nova</label>
          <div class="input-eye"><input id="n-pass" class="input" type="password" name="pass" autocomplete="new-password" placeholder="8+ caracteres, letras e números" autocapitalize="none" autocorrect="off" spellcheck="false">
          <button type="button" class="iconbtn iconbtn--sm" data-eye aria-label="Mostrar senha">${icon('eye', 18)}</button></div></div>
        <div class="fgroup"><label class="flabel" for="n-pass2">Repita a senha nova</label><input id="n-pass2" class="input" type="password" name="pass2" autocomplete="new-password" autocapitalize="none" autocorrect="off" spellcheck="false"></div>
        <p class="login__hint">Mínimo de 8 caracteres, com letras e números.</p>
        ${msg ? `<p class="login__err" role="alert">${esc(msg)}</p>` : ''}
        <button class="btn btn--primary btn--block" data-go>Salvar senha nova e entrar</button>
      </form></div>`;
    const f = root.querySelector('[data-newpass]');
    root.querySelector('[data-eye]').onclick = () => { const t = f.pass.type === 'password' ? 'text' : 'password'; f.pass.type = t; f.pass2.type = t; };
    f.onsubmit = async (ev) => {
      ev.preventDefault();
      const pass = f.pass.value;
      if (pass.length < 8 || !/[A-Za-zÀ-ÿ]/.test(pass) || !/\d/.test(pass)) return draw('Crie uma senha com pelo menos 8 caracteres, misturando letras e números.');
      if (pass !== f.pass2.value) return draw('As duas senhas não estão iguais. Digite de novo.');
      const b = f.querySelector('[data-go]'); b.disabled = true; b.textContent = 'Salvando…';
      try {
        await cloudApi.confirmReset(code, pass);
        history.replaceState(null, '', location.pathname);
        toast('Senha nova salva ✓ Entrando…', { ms: 3000 });
        loginEmail = email;
        try { localStorage.removeItem(LS_UID); } catch { /* ok */ }
        await cloudApi.signIn(email, pass).then((cred) => { try { localStorage.setItem(LS_UID, cred.user.uid); sessionStorage.setItem('lembra.sess', '1'); } catch { /* ok */ } });
        // já entrou: abre o app normalmente (a tela de senha nova abriu antes do app começar)
        setTimeout(() => location.replace(location.pathname), 600);
      } catch (err) {
        const c = err && err.code;
        if (c === 'auth/expired-action-code' || c === 'auth/invalid-action-code') return showNewPassword(code);
        draw(LOGIN_ERRORS[c] || 'Não consegui salvar agora. Verifique a internet e tente de novo.');
      }
    };
  };
  draw();
}

/* Não conseguiu falar com a nuvem: mostra o motivo e deixa tentar de novo */
function cloudError(err) {
  if (document.querySelector('[data-login]') || document.getElementById('view')) return;
  root.innerHTML = `<div class="splash">
    <div class="brandwrap">${brand('simbolo', { h: 64 })}</div>
    <h2>Não consegui conectar</h2>
    <p>Verifique a internet e tente de novo.</p>
    <button class="btn btn--primary" data-retry>Tentar de novo</button>
    <small class="muted">Detalhe: ${esc(String(err && (err.code || err.message) || err))}</small>
  </div>`;
  root.querySelector('[data-retry]').onclick = () => location.reload();
}

function loading(msg = 'Carregando…') {
  root.innerHTML = `<div class="splash"><div class="brandwrap">${brand('simbolo', { h: 64 })}</div><p>${esc(msg)}</p></div>`;
}

async function showGuideSoon() {
  const { guideSeen, openGuide } = await import('./views/guide.js');
  if (guideSeen()) return;
  const showGuide = (n = 0) => {
    if (document.querySelector('.sheet-wrap.is-open, .paywall, .iguide, .ob, .ficha') && n < 40) return setTimeout(() => showGuide(n + 1), 1500);
    openGuide();
  };
  setTimeout(showGuide, 1200);
}
async function startBilling() {
  // voltou para o app depois de pagar (no iPhone o pagamento abre numa janela à parte): confere sozinho
  let checking = false;
  document.addEventListener('visibilitychange', async () => {
    if (document.visibilityState !== 'visible' || !buying() || checking) return;
    checking = true;
    try { await confirmPayment({ quiet: true }); } finally { checking = false; }
  });
  // desistiu na página da Stripe (voltou por "cancelar")
  if (/^#\/planos/.test(location.hash)) clearBuying();
  const fromStripe = /^#\/pago/.test(location.hash);
  if (fromStripe) { history.replaceState(null, '', location.pathname + location.search); return confirmPayment(); }
  if (buying()) confirmPayment({ quiet: true });
  const st = await checkBilling();
  render();
  // agenda compartilhada do dono: liga/desliga conforme o complemento pago
  startTeam().catch((e) => console.warn('equipe', e));
  if (!st.active && !emLancamento()) {
    // sem plano: tudo bloqueado até começar o teste grátis ou assinar; ao começar o teste, mostra o guia
    window.addEventListener('lembra:trial', () => { toast('Seu teste grátis de 7 dias começou ✓', { ms: 3500 }); showGuideSoon(); }, { once: true });
    return openPlans({ blocking: true });
  }
  if (/^#\/planos/.test(location.hash)) { history.replaceState(null, '', location.pathname + location.search); openPlans(); }
  // presente Vitalício: a revelação aparece uma vez, assim que a pessoa abre o app
  if (st.vip) import('./vip.js').then((v) => v.maybeShowVip()).catch(() => {});
  // 1º acesso: explica os dois modos
  showGuideSoon();
  // confere o tempo do teste a cada minuto; acabou → tela de planos
  setInterval(async () => {
    const b = store.billing;
    if (!b || b.plan !== 'trial') return;
    if (b.trialEndsAt <= Date.now()) {
      const s2 = await checkBilling();
      if (!s2.active) openPlans({ blocking: true });
    }
    if (!document.querySelector('.sheet-wrap.is-open')) render();
  }, 60000);
}

function startApp() {
  // pessoa escolhida no filtro precisa existir neste espaço (ex.: celular usado por outra conta antes)
  if (ui.person !== 'all' && !store.member(ui.person)) ui.person = 'all';
  // conta própria: até o servidor confirmar o plano, nada fica liberado (a não ser o último plano válido deste aparelho)
  // fundadores (a antiga dupla): acesso para sempre desde o primeiro segundo (o servidor confirma depois)
  const founder = CONFIG.team.some((t) => t.email && t.email.toLowerCase() === (store.user?.email || '').toLowerCase());
  if (store.solo && store.mode === 'cloud' && !store.billing) store.billing = lastKnown() || (founder ? { plan: 'lifetime', active: true, tier: 'pro', comp: true } : { plan: 'checking', active: false });
  // portão do plano: sem plano ativo nada é criado, alterado ou apagado (a ficha e os ajustes de rotina podem)
  store.gate = (col) => col === 'settings' || requireAccess();
  personal.gate = () => requireAccess(); personal.limitado = () => limitado(); personal.aoLimite = (t) => toast(t, { ms: 6000, action: 'Ver planos', onAction: () => openPlans() });
  syncWork();
  shell();
  render();
  store.on(rerenderAll);
  import('./rede.js').then((r) => r.repintaRede()).catch(() => {});
  window.addEventListener('lembra:recusada', () => toast('Uma alteração não foi aceita pela nuvem. Ela continua guardada neste aparelho.', { ms: 6000 }));
  startPersonal();
  import('./motion/auto.js').catch((e) => console.warn('animações', e));
  personal.onSaved = (b, a) => { import('./rank.js').then((r) => r.rankPersonal(b, a)); import('./game.js').then((gm) => gm.onPersonal(b, a)).catch(() => {}); };
  // conquistas: XP, níveis e emblemas (concluir, marcar, bilhetes); começa depois que a agenda carregou
  store.hooks.game = (b, a) => {
    // uso (só contagem): compromisso criado / concluído
    if (a && !b) track('compromisso:criado');
    if (a && a.status === 'feito' && (!b || b.status !== 'feito')) track('compromisso:concluido');
    import('./game.js').then((gm) => gm.onEvent(b, a)).catch(() => {});
  };
  store.hooks.note = (n) => import('./game.js').then((gm) => gm.onNote(n)).catch(() => {});
  setTimeout(() => import('./game.js').then((gm) => { gm.startGame(); gm.onGame(() => refreshLevelRings()); refreshLevelRings(); }).catch((e) => console.warn('conquistas', e)), 1800);
  // amizades: publica o cartão (nível, emblemas) e, se veio por um link de amizade, mostra o pedido
  setTimeout(() => import('./frase.js').then((F) => F.confereAvisoTocado()).catch(() => {}), 1500);
  // equipe interna: quem tem cargo vê o "Painel da equipe" em Ajustes
  setTimeout(() => import('./views/staff.js').then(async (S) => { window.__equipe = await S.minhaEquipe(); if (window.__equipe?.perms?.length && ui.tab === 'ajustes') render(); }).catch(() => {}), 4000);
  setTimeout(() => import('./friends.js').then((f) => { f.publishCard(); f.processFriendLink(); f.pingOnline(); setTimeout(f.pertoAuto, 15e3); setInterval(f.pingOnline, 60e3); document.addEventListener('visibilitychange', f.pingOnline); import('./game.js').then((gm) => gm.onGame(() => { clearTimeout(window.__cardT); window.__cardT = setTimeout(f.publishCard, 8000); })); }).catch(() => {}), 5000);
  setTimeout(() => { window.__comeco?.contaAbertura(); if (window.__comeco?.faltaCheckup() && !window.__comeco.semNada()) render(); }, 2000);
  setTimeout(askReinstall, 2500); // aviso de instalar a versão nova (só para quem precisa)
  // versão: confere se há nova ao voltar para o app (atualiza sozinho) e mostra as novidades uma vez
  import('./version.js').then((v) => {
    v.startVersionWatch();
    const news = (n = 0) => (openSheets().length || document.querySelector('.ficha, .paywall, .ob, .guide, .photogate, .termsgate, .avgate') ? n < 30 && setTimeout(() => news(n + 1), 4000) : v.maybeShowWhatsNew());
    setTimeout(news, 6000);
  }).catch(() => {});
  setTimeout(requirePhoto, 3500);
  setTimeout(() => import('./avisos-obrigatorio.js').then((m) => m.vigia()).catch((e) => console.warn('avisos', e)), 2500);
  setTimeout(askNotifications, 12000);
  // voltou para o app depois de um tempo (o app não fecha de verdade no celular): conta como "abrir de novo"
  let hiddenAt = 0;
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { hiddenAt = Date.now(); return; }
    if (hiddenAt && Date.now() - hiddenAt > 30 * 60e3) { askedThisOpen = false; window.__vipAskedNotif = false; setTimeout(askNotifications, 3000); }
  });
  setTimeout(() => import('./social.js').then((m) => m.inicia()).catch(() => {}), 3500); // mensagens em tempo real
  setTimeout(() => Promise.all([import('./retro.js'), import('./game.js')]).then(([r, g]) => { r.usaDono(store.user?.uid || ''); r.reconstroi(2026, { eventos: store.state.events, pessoal: personal.items, ...g.diasAtivos(), meu: (e) => (e.assignees || []).includes(store.me) || e.createdBy === store.me }); }).catch(() => {}), 12e3);
  setTimeout(() => import('./backup.js').then((m) => m.backupDiario()).catch(() => {}), 30e3);
  startPresence();
  personal.on(() => { if (ui.space === 'personal' || document.querySelector('.atrcard')) rerenderAll(); }); // o cartão "ficou pra trás" do Trabalho também mostra o Pessoal
  store.onDenied = (msg) => toast(msg, { ms: 5000 });
  store.onError = (err) => {
    const quota = err && /quota/i.test(String(err.name || err.message));
    const denied = err && /permission/i.test(String(err.code || err.message));
    toast(quota ? 'Memória do aparelho cheia: use logos menores ou ative a nuvem' : denied ? 'Sem permissão na nuvem: confira as regras do Firebase' : 'Não foi possível salvar. Verifique a conexão.', { ms: 5000 });
    import('./mascote.js').then((M) => { if (M.mascotOn()) M.react('erro'); }).catch(() => {});
  };
  watchConflicts();
  store.on(watchConflicts);
  store.on(() => push.updateBadge(store.me ? store.eventsOn(todayKey(), { person: store.me }).filter((e) => e.status !== 'feito').length : 0));
  setInterval(() => {
    const a = document.activeElement;
    const typing = a && /INPUT|TEXTAREA|SELECT/.test(a.tagName);
    if (ui.tab === 'hoje' && !openSheets().length && !typing) render();
    checkReminders();
  }, 60000);
  checkReminders();
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      if (ui.date < todayKey() && ui.tab === 'hoje') ui.date = todayKey();
      render();
    }
  });
  // servidor gratuito de avisos: aviso ao parceiro na hora + lembretes no horário + chat
  if (store.mode === 'cloud' && push.server()) {
    store.hooks.eventChange = (b, a) => { onEventChange(b, a); import('./rank.js').then((r) => r.rankEvent(b, a)); };
    // mostra na tela quem recebeu o aviso (e quem ainda não ativou as notificações)
    setNotifyFeedback(({ ok, missing, error }) => {
      if (error) return toast(`Aviso não enviado: ${error}`, { ms: 6000 });
      if (missing.length) return toast(`${missing.join(' e ')} ainda não ativou as notificações no celular (Ajustes → Notificações → Ativar)`, { ms: 8000 });
      if (ok.length) toast(`Aviso enviado para ${ok.join(' e ')} ✓`, { ms: 3500 });
    });
    store.hooks.activity = onActivity;
    store.hooks.ask = async (question, history) => {
      const { pedeIa } = await import('./ia-consent.js');
      if (!(await pedeIa({ motivo: 'responder e mexer na sua agenda pelo assistente' }))) return { text: 'Tudo bem! Sem a sua autorização eu não envio nada para a inteligência artificial. Se mudar de ideia, é só ativar em Ajustes → Inteligência artificial. 😉', actions: [] };
      const d = new Date();
      const context = buildContext({
        events: store.state.events, companies: store.state.companies, routine: routine(), notes: store.state.notes,
        team: store.team, me: store.me, now: { date: todayKey(), minutes: d.getHours() * 60 + d.getMinutes() },
        withIds: true,
        work: { profession: WORK.profession, entity: WORK.entity, marketing: isMarketing(), types: TYPE_ORDER.map((id) => ({ id, label: TYPES[id]?.label || id })) },
        memos: personal.memos.map((m) => ({ date: m.date, time: m.time, text: m.text })),
        personal: occurrences(todayKey(), addDays(todayKey(), 30)).map((o) => ({ id: o.item.id, date: o.date, time: o.item.time, title: o.item.title, cat: o.item.cat, done: o.done })),
      });
      const r = await push.api('/ask', { question, history, context, today: todayKey() });
      return { text: r.answer, actions: Array.isArray(r.actions) ? r.actions : [] };
    };
    store.on(syncSchedule);
    syncSchedule();
    store.on(syncCoach);
    syncCoach();
    store.on(polishSoon);
    polishSoon();
    setInterval(syncSchedule, 15 * 60e3);
  }
  // dados cadastrados antes do login (guardados só neste aparelho): oferece levar para a nuvem
  if (store.mode === 'cloud') setTimeout(() => offerLocalMigration().catch((e) => console.warn('migração', e)), 2500);
  // empresas pré-cadastradas e rotinas: só no espaço da dupla Henrique + Matheus
  if (store.workspace === 'main') ensureSeedCompanies()
    .then(() => setTimeout(() => ensureMatheusLogo().catch(() => {}), 800))
    .then(() => setTimeout(() => { try { ensureNotifyOwners(); } catch (e) { console.warn(e); } }, 1000))
    .then(() => setTimeout(() => ensureMatheusJG().catch((e) => console.warn('pedido Matheus', e)), 1200))
    .then(() => setTimeout(() => ensureSeedRoutine().catch((e) => console.warn('rotina', e)), 1500))
    .catch((e) => console.warn('pré-cadastro', e));
  // ficha de cadastro (conta própria: obrigatória antes de começar o teste; dupla: oferecida uma vez)
  // depois, plano da conta: teste grátis de 24h e depois assinatura (a dupla não paga)
  import('./views/ficha.js')
    .then((m) => m.ensureFicha())
    .catch((e) => console.warn('ficha', e))
    // LGPD: concordância com os Termos e a Privacidade (contas antigas ou termos atualizados)
    .then(() => import('./privacy.js').then((m) => m.ensureTermsAccepted()).catch((e) => console.warn('termos', e)))
    .then(() => {
      ensurePersona();
      if (store.sharedLost) toast(store.sharedLost === 'removido' ? 'Você não faz mais parte daquela agenda compartilhada. Voltou para a sua agenda.' : `A agenda compartilhada de ${store.sharedLost} não está ativa agora. Voltou para a sua agenda.`, { ms: 6000 });
      // veio por um link de convite: pergunta antes do plano (quem é convidado não paga)
      return maybeAcceptInvite().catch((e) => console.warn('convite', e));
    })
    .then((joined) => {
      if (joined) return;
      render();
      // boas-vindas / permissão de notificações (depois da ficha)
      // conta nova: primeiro o 1º lembrete; os avisos são oferecidos logo depois dele (ou em 90 s)
      const t0 = Date.now(), oferece = () => (window.__comeco?.semNada() && store.mode === 'cloud' && store.solo && Date.now() - t0 < 90e3 ? setTimeout(oferece, 1500) : setTimeout(maybeOnboard, 1200));
      setTimeout(oferece, 400);
      if (store.solo) startBilling();
    });
  // resumo de uso da conta (para o Painel do dono)
  if (store.mode === 'cloud') {
    loadStatsDays().then(() => setTimeout(() => reportStats({ open: true }), 4000));
    document.addEventListener('visibilitychange', () => { if (!document.hidden) reportStats(); });
    store.on(reportSoon);
    personal.on(reportSoon);
  }
  // aberto pelo navegador: ensina a colocar na tela inicial (quando nenhuma outra tela estiver aberta)
  const tryInstall = (n = 0) => {
    if (document.querySelector('.sheet-wrap.is-open, .spaceveil, .ob, .ficha, .paywall') && n < 20) return setTimeout(() => tryInstall(n + 1), 3000);
    showInstallGuide();
  };
  setTimeout(tryInstall, 3500);
  // atualiza o cadastro deste celular para notificações (se já tiver permissão)
  if (store.mode === 'cloud' && push.permission() === 'granted') push.register().catch(() => {});
  setTimeout(() => openDeepLink(), 300);
}

/* Lembretes calculados pela ficha valem em qualquer agenda em que a pessoa estiver (dupla, própria ou compartilhada) */
function ensurePersona() {
  const p = store.profile;
  if (store.mode !== 'cloud' || !store.me || !p?.onboardedAt) return;
  const cur = personaOf(store.me);
  // persona antiga (cobrava de 10 em 10 min): recalcula no ritmo novo, mais equilibrado
  if (cur && !(store.solo && cur.lateEvery < 20)) return;
  const r = computePersona(p);
  store.upsert('settings', { id: `persona-${store.me}`, offsets: r.offsets, lateEvery: r.lateEvery, lateMax: r.lateMax, tone: r.tone, index: r.index });
}

/* Encontra o que foi cadastrado antes do login (só neste aparelho) e leva para a nuvem */
async function offerLocalMigration() {
  if (!store.ready || localStorage.getItem('cal.migrated') || !hasAccess()) return; // sem plano ativo: oferece depois

  let saved;
  try {
    saved = JSON.parse(localStorage.getItem('pauta.data.v1') || 'null');
  } catch {
    saved = null;
  }
  if (!saved || saved.demo) return;
  // empresas com o mesmo nome de uma que já está na nuvem viram a mesma empresa
  const byName = new Map(store.state.companies.map((c) => [c.name.trim().toLowerCase(), c.id]));
  const remap = {};
  const companies = (saved.companies || []).filter((c) => {
    const same = byName.get((c.name || '').trim().toLowerCase());
    if (same) {
      remap[c.id] = same;
      return false;
    }
    return !store.company(c.id);
  });
  const events = (saved.events || []).filter((e) => !store.event(e.id)).map((e) => ({ ...e, companyId: remap[e.companyId] || e.companyId }));
  const notes = (saved.notes || []).filter((n) => !store.state.notes.some((x) => x.id === n.id));
  if (!companies.length && !events.length && !notes.length) {
    localStorage.setItem('cal.migrated', '1');
    return;
  }
  const parts = [events.length && `${events.length} compromisso${events.length > 1 ? 's' : ''}`, companies.length && `${companies.length} empresa${companies.length > 1 ? 's' : ''}`, notes.length && `${notes.length} bilhete${notes.length > 1 ? 's' : ''}`].filter(Boolean).join(', ');
  const many = companies.length + events.length + notes.length > 1;
  const ok = await confirmDialog({
    title: 'Encontrei dados só neste aparelho',
    text: `${parts} ${many ? 'foram cadastrados' : 'foi cadastrado'} antes do login e ${many ? 'estão guardados' : 'está guardado'} só aqui. Enviar para a nuvem? Assim ${many ? 'aparecem' : 'aparece'} em qualquer celular, no Safari e para o parceiro.`,
    ok: 'Enviar para a nuvem',
  });
  if (!ok) {
    localStorage.setItem('cal.migrated', 'recusado');
    return;
  }
  await store.importData({ companies, events, notes, settings: [] });
  localStorage.setItem('cal.migrated', '1');
  toast(`Pronto! ${parts} agora ${many ? 'estão' : 'está'} na nuvem.`, { ms: 5000 });
}

/* Avisa quando aparece um conflito novo na SUA agenda (ex.: o parceiro marcou algo em cima) */
let knownConflicts = null;
function watchConflicts() {
  if (!store.me) return;
  const list = upcomingConflicts(store.me, 14);
  const sig = (c) => c.date + ':' + c.ids.slice().sort().join('|');
  const now = new Set(list.map(sig));
  if (knownConflicts) {
    const fresh = list.find((c) => !knownConflicts.has(sig(c)) && c.ids.some((id) => store.event(id)?.updatedBy && store.event(id).updatedBy !== store.me));
    if (fresh) {
      toast(`Atenção: ${fresh.title} (${fresh.date.slice(8)}/${fresh.date.slice(5, 7)})`, {
        action: 'Ver',
        onAction: () => {
          ui.date = fresh.date;
          ui.person = 'all';
          setTab('hoje');
        },
        ms: 7000,
      });
    }
  }
  knownConflicts = now;
}

/* ---------- rotas ---------- */
/* De onde a pessoa veio (anúncio, Instagram, WhatsApp…): guardado neste aparelho na 1ª visita e enviado no resumo de uso.
   Só para o dono medir a divulgação; nenhum rastreador de terceiros. */
function captureOrigin() {
  try {
    if (localStorage.getItem('lembra.origem') && (localStorage.getItem('lembra.jaentrou') || JSON.parse(localStorage.getItem('lembra.origem')).medium)) return; // um link marcado antes do cadastro ainda vale
    const q = new URLSearchParams(location.search);
    const o = {};
    for (const k of ['source', 'medium', 'campaign', 'content', 'term']) { const v = q.get(`utm_${k}`); if (v) o[k] = v.slice(0, 60); }
    if (q.get('fbclid')) o.source = o.source || 'facebook';
    if (q.get('gclid')) o.source = o.source || 'google';
    if (!o.source && document.referrer) { const h = new URL(document.referrer).hostname.replace(/^www\./, ''); if (h && h !== location.hostname) o.source = h.slice(0, 60); }
    if (o.source) localStorage.setItem('lembra.origem', JSON.stringify({ ...o, page: 'app', at: Date.now() }));
  } catch { /* ok */ }
}

/* App de verdade não dá zoom: o iPhone às vezes ignora o "sem zoom" da página, então bloqueia o gesto de pinça
   e o toque duplo (telas que usam dois dedos de propósito, como o recorte da foto, continuam funcionando) */
['gesturestart', 'gesturechange', 'gestureend'].forEach((t) => document.addEventListener(t, (e) => { if (!e.target.closest?.('.crop__area')) e.preventDefault(); }, { passive: false }));
document.addEventListener('touchmove', (e) => { if (e.touches.length > 1 && !e.target.closest?.('.crop__area')) e.preventDefault(); }, { passive: false });
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => { const now = Date.now(); if (now - lastTouchEnd < 300 && !e.target.closest?.('input, textarea, select, .crop__area')) e.preventDefault(); lastTouchEnd = now; }, { passive: false });
/* o cofre avisa quando algo deu errado ao salvar — a pessoa precisa saber na hora */
function avisaCofre() {
  const dito = new Set();
  const mostra = (txt, ms = 9000) => { if (dito.has(txt)) return; dito.add(txt); import('./components.js').then((c) => c.toast(txt, { ms })).catch(() => {}); };
  if (cofre.estado.recuperou.length) mostra('Recuperei dados que tinham sumido deste aparelho ✓');
  cofre.aoAvisar((tipo) => {
    if (tipo === 'cheio') mostra('A memória deste celular encheu. Seus dados estão guardados, mas libere espaço.', 14000);
    else if (tipo === 'sem-localstorage') mostra('Este navegador bloqueou parte do armazenamento. Estou salvando pelo caminho reserva.', 14000);
    else if (tipo === 'idb-falhou') mostra('Não consegui gravar a cópia de segurança agora. Vou tentar de novo.', 10000);
    else if (tipo === 'encolheu') mostra('Muita coisa sumiu de uma vez. Guardei a versão anterior, dá para voltar.', 14000);
    else if (tipo === 'recuperou') mostra('Recuperei dados que tinham sumido deste aparelho ✓');
  });
}

async function boot() {
  // só nos testes automáticos no computador (emulador local): o robô enxerga o estado do app
  try { if (['localhost', '127.0.0.1'].includes(location.hostname) && localStorage.getItem('cal.emulator') === '1') window.__lembraStore = store; } catch { /* ok */ }
  // o cofre primeiro: se a cópia principal sumiu ou encolheu, ele repõe ANTES de qualquer leitura
  await cofre.prepara([LS_DATA, LS_PESSOAL]).catch((e) => console.error('cofre', e));
  avisaCofre();
  startErrorLog();
  startTracking();
  // versão: confere já na abertura (também na tela de entrar); versão antiga → atualiza ou mostra o botão "Atualizar"
  import('./version.js').then((v) => v.startVersionWatch()).catch(() => {});
  captureOrigin();
  // link de convite para a agenda compartilhada: guarda para depois do login
  captureInvite();
  import('./friends.js').then((f) => f.captureFriendLink()).catch(() => {});
  loadInviteInfo();
  const hash = location.hash || '';
  const fb = CONFIG.firebase;

  // Tela do cliente (link compartilhado)
  if (hash.startsWith('#/c/') || hash.startsWith('#/v/')) {
    loading('Carregando cronograma…');
    const isTeamDevice = !!(localStorage.getItem('pauta.me') || localStorage.getItem('cal.team'));
    try {
      if (hash.startsWith('#/v/')) {
        const data = await decodeSnapshot(hash.slice(4));
        return showClient(root, sanitizePayload(data), { canGoBack: isTeamDevice });
      }
      if (!fb) return showClientError(root, 'Este link precisa da sincronização na nuvem ativada.');
      const { fetchPublic } = await import('./cloud.js');
      const data = await fetchPublic(fb, hash.slice(4));
      if (!data) return showClientError(root, 'Este link não existe mais. Peça um novo link para a equipe.');
      return showClient(root, sanitizePayload(data), { canGoBack: isTeamDevice });
    } catch (e) {
      console.error(e);
      return showClientError(root, 'Não foi possível abrir o cronograma. Verifique a conexão e tente novamente.');
    }
  }

  if (!fb) {
    await initLocal();
    return startApp();
  }

  import('./rede.js').then((r) => r.ligaRede()).catch(() => {});
  loading('Abrindo sua agenda…');
  const withTimeout = (p, ms) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error('tempo esgotado')), ms))]);
  try {
    const { connect } = await import('./cloud.js');
    cloudApi = await withTimeout(connect(fb), 15000);
  } catch (e) {
    console.error(e);
    return cloudError(e);
  }
  {
    const qp = new URLSearchParams(location.search);
    if (qp.get('mode') === 'resetPassword' && qp.get('oobCode')) return showNewPassword(qp.get('oobCode'));
    if (qp.get('mode') === 'verifyEmail' && qp.get('oobCode')) { cloudApi.applyCode(qp.get('oobCode')).then(() => toast('E-mail confirmado ✓', { ms: 3500 })).catch(() => {}); history.replaceState(null, '', location.pathname + location.hash); }
    if (qp.get('senha') === 'nova') { const em = cleanEmail(qp.get('email') || ''); if (validEmail(em)) loginEmail = em; loginNotice = 'Senha trocada? Agora é só entrar com a senha nova.'; history.replaceState(null, '', location.pathname + location.hash); }
  }
  let authAnswered = false;
  let started = false;
  setTimeout(() => {
    if (!authAnswered) cloudError(new Error('o login não respondeu'));
  }, 25000);
  cloudApi.onUser(async (user) => {
    authAnswered = true;
    if (!user) {
      // a sessão caiu com o app aberto: recomeça do zero para o próximo login funcionar
      if (window.__saiu) return showLogin(); // saiu pelo botão: o "Entrar" já está na tela
      if (started) return location.reload();
      return showLogin();
    }
    // PROTEÇÃO: o login só pode ser o da última pessoa que entrou NESTE aparelho.
    // Uma sessão antiga guardada (de outra conta) nunca pode "voltar" sozinha.
    const expected = (() => { try { return localStorage.getItem(LS_UID); } catch { return null; } })();
    if (expected && expected !== user.uid) {
      try { await cloudApi.signOut(); } catch { /* ok */ }
      purgeAuth();
      // o aparelho para de receber avisos da conta antiga (a inscrição velha deixa de existir)
      try { const reg = await navigator.serviceWorker?.ready; const sub = reg && (await reg.pushManager.getSubscription()); if (sub) await sub.unsubscribe(); localStorage.removeItem('pauta.device'); } catch { /* ok */ }
      loginNotice = 'Por segurança, entre de novo com a sua conta.';
      if (started) return location.reload();
      return showLogin();
    }
    // escolheu NÃO ser lembrado: a sessão vale só enquanto o app está aberto (fechou o app → pede login de novo)
    if (!started && remembered() && remembered().on === false && !(() => { try { return sessionStorage.getItem('lembra.sess'); } catch { return '1'; } })()) {
      try { await cloudApi.signOut(); } catch { /* ok */ }
      purgeAuth();
      return showLogin();
    }
    try { sessionStorage.setItem('lembra.sess', '1'); } catch { /* ok */ }
    try { localStorage.setItem(LS_UID, user.uid); localStorage.setItem('lembra.jaentrou', '1'); } catch { /* ok */ }
    // entrou de novo depois de sair (sem fechar o app): recomeça do zero para não misturar nada
    if (window.__saiu && started) { setTimeout(() => location.replace(location.pathname + '?r=' + Date.now()), 300); return; }
    // trocou de conta com o app aberto: recomeça do zero (nunca mistura uma conta com a outra)
    if (started) { if (store.user && store.user.uid !== user.uid) location.reload(); return; }
    // qualquer conta entra: a dupla vê o espaço dela; contas novas, o próprio espaço (vazio no começo)
    started = true;
    try {
      localStorage.setItem('cal.team', '1');
    } catch { /* ok */ }
    loading('Entrando…');
    // conta acabou de ser criada: guarda o nome no perfil
    if (pendingProfile && cloudApi.backend.saveProfile) {
      try { await cloudApi.backend.saveProfile(user.uid, pendingProfile); } catch (e) { console.warn('perfil', e); }
      pendingProfile = null;
    }
    // se a nuvem demorar, abre mesmo assim: os dados chegam assim que a conexão responder
    try {
      await Promise.race([initCloud(cloudApi.backend, user), new Promise((r) => setTimeout(r, 12000))]);
    } catch (e) {
      console.error(e);
      setTimeout(() => toast('Não consegui carregar os dados agora. Verifique a internet.', { ms: 6000 }), 800);
    }
    startApp();
  });
}

navigator.serviceWorker?.addEventListener('message', (ev) => {
  if (ev.data?.type === 'open' && ev.data.url) {
    window.__openSrc = 'notif'; window.__avisoAt = Date.now(); // a abertura não toca quando vem da notificação
    // frase do aviso: abre no app (e fica até a pessoa fechar)
    if (ev.data.notif) import('./frase.js').then((F) => { if (F.abreFrase(ev.data.notif)) caches.open('lembra-notif').then((c) => c.delete('/__notif')).catch(() => {}); }).catch(() => {});
    import('./stats.js').then((m) => m.seenServer(true));
    const h = ev.data.url.split('#')[1];
    if (h) openDeepLink('#' + h);
  }
});

window.addEventListener('hashchange', () => {
  // abriu um convite com o app já aberto
  if (/^#\/convite\//.test(location.hash)) { captureInvite(); return maybeAcceptInvite(); }
  if (/^#\/((e|d|p)\/|suporte|ranking|vitalicio|amigos|amigo\/|stories|visitas|privado|frase|frases|retro\/)/.test(location.hash)) return openDeepLink();
  if (/^#\/(c|v)\//.test(location.hash)) location.reload();
});

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  // updateViaCache 'none': o celular sempre busca o service worker novo (nunca fica preso num antigo)
  navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).then((r) => r.update().catch(() => {})).catch(() => {});
}
boot();
