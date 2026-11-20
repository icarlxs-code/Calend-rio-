/* Inicialização, navegação e ações globais */
import { brand } from './brand.js';
import { syncCoach } from './coach.js';
import { polishSoon } from './polish.js';
import { renderPersonalSpace, personalTabbar, bindPersonal, personalActions, openPersonalEditor } from './views/personal.js';
import { personal, startPersonal, occurrences } from './personal.js';
import { CONFIG } from '../config.js';
import { store, initLocal, initCloud } from './store.js';
import { ui, saveUi } from './ui.js';
import { esc, isStandalone, todayKey, addDays, addMonths, monthKey, uid, toMin, nowMin } from './utils.js';
import { TYPES, TYPE_ORDER, WORK, ent, isMarketing, applyArch, crew } from './constants.js';
import { icon } from './icons.js';
import { openSheets, toast, confirmDialog, avatar } from './components.js';
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
import { checkBilling, trialBanner, openPlans, confirmPayment, openPortal, buying, clearBuying, hasAccess, requireAccess, lastKnown } from './billing.js';
import { captureInvite, maybeAcceptInvite, startTeam, openShare, pendingInvite } from './equipe.js';
import { personaOf } from './notifier.js';
import { applyProfTheme, applyThemePref, setThemePref } from './theme.js';
import { startErrorLog } from './errlog.js';
import { computePersona } from './persona.js';
import { reportStats, loadStatsDays, reportSoon } from './stats.js';
import { ensureSeedCompanies, ensureMatheusLogo, ensureNotifyOwners } from './seed-companies.js';
import { ensureMatheusJG } from './seed-matheus.js';
import { ensureSeedRoutine } from './seed-routine.js';
import { onEventChange, onActivity, syncSchedule, setNotifyFeedback } from './notifier.js';
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
const SPACE_BAR = { work: ['#F2F2F7', '#000000'], personal: ['#F2F2F7', '#000000'] };
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
  const [l, d] = personalMode ? SPACE_BAR.personal : [WORK.theme?.bg || SPACE_BAR.work[0], SPACE_BAR.work[1]];
  if (document.documentElement.classList.contains('intro-done')) setBarColor(l, d); // durante a abertura fica preta
  const set = (sel, attr, val) => { const el = document.querySelector(sel); if (el) el.setAttribute(attr, val); };
  set('link[rel="manifest"]', 'href', personalMode ? 'pessoal.webmanifest' : 'manifest.webmanifest');
  set('link[rel="apple-touch-icon"]', 'href', personalMode ? 'icons/pessoal-180.png' : 'icons/icon-180.png');
  set('meta[name="apple-mobile-web-app-title"]', 'content', personalMode ? 'Pessoal' : 'Lembra');
  document.title = personalMode ? 'Pessoal · Lembra' : 'Lembra · Sua agenda';
}
/* Troca entre Trabalho e Pessoal com uma transição de "outro app" */
function switchSpace(space, from) {
  if (ui.space === space || document.querySelector('.spaceveil')) return;
  document.querySelectorAll('.sheet-wrap.is-open [data-close]').forEach((b) => b.click());
  const veil = document.createElement('div');
  veil.className = `spaceveil spaceveil--${space}`;
  // o círculo nasce do botão tocado
  const r = from && from.getBoundingClientRect ? from.getBoundingClientRect() : null;
  if (r) { veil.style.setProperty('--x', `${r.left + r.width / 2}px`); veil.style.setProperty('--y', `${r.top + r.height / 2}px`); }
  const me = store.member(store.me);
  veil.innerHTML = space === 'personal'
    ? `<div><span class="spaceveil__badge">${icon('heart', 40)}</span><strong>Pessoal</strong><small>${me ? esc(me.name) + ' · ' : ''}só você vê</small></div>`
    : `<div><span class="spaceveil__badge">${icon('briefcase', 40)}</span><strong>Trabalho</strong><small>${store.team.length > 1 ? `Agenda da ${crew()}` : isMarketing() ? 'Suas empresas e clientes' : `Seus compromissos de ${esc(ent(true, true))}`}</small></div>`;
  document.body.appendChild(veil);
  // a barra do topo (hora/bateria) entra na mesma cor da transição, quando o círculo chega lá em cima
  const veilBar = space === 'personal' ? '#FF2D55' : '#000000';
  setTimeout(() => setBarColor(veilBar), 180);
  if (navigator.vibrate) navigator.vibrate(8);
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
  setTimeout(() => { veil.classList.add('is-out'); const [l, d] = space === 'personal' ? SPACE_BAR.personal : [WORK.theme?.bg || SPACE_BAR.work[0], SPACE_BAR.work[1]]; setBarColor(l, d); }, 560);
  setTimeout(() => veil.remove(), 900);
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
function render() {
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
  const html = personalMode ? renderPersonalSpace() : ui.tab === 'mes' ? renderMonth() : ui.tab === 'empresas' ? renderCompanies() : ui.tab === 'ajustes' ? renderSettings() : renderToday();
  view.innerHTML = html;
  document.querySelectorAll('.tabbar__btn').forEach((b) => b.classList.toggle('is-on', b.dataset.tab === (personalMode ? ui.ptab || 'p-hoje' : ui.tab)));
  window.scrollTo(0, scroll);
  const ni = view.querySelector('[data-form="note"] input');
  if (ni && draftNote) ni.value = draftNote;
  if (ni && hadFocus) ni.focus({ preventScroll: true });
  // faixa do teste grátis (contagem regressiva) ou de conta sem plano (tudo travado)
  const locked = !hasAccess();
  document.documentElement.classList.toggle('is-locked', locked);
  // em Ajustes o plano já aparece em "Seu plano": sem a faixa repetida
  const tb = locked ? lockBanner() : ui.tab === 'ajustes' && !personalMode ? '' : trialBanner();
  if (tb) (view.querySelector('.page') || view).insertAdjacentHTML('afterbegin', tb);
  bindSwipes();
  bindStrip(view);
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
function rerenderAll() {
  render();
  openSheets().forEach((s) => s.refresh && s.refresh());
}

function setTab(tab) {
  ui.tab = tab;
  saveUi();
  render();
  window.scrollTo(0, 0);
}

/* ---------- ações (delegação de cliques) ---------- */
const actions = {
  tab: (b) => setTab(b.dataset.tab),
  space: (b) => switchSpace(b.dataset.space, b),
  'edit-profile': async () => (await import('./views/profile.js')).openProfile(),
  'install-guide': () => showInstallGuide({ force: true }),
  plans: () => openPlans(),
  'billing-portal': () => openPortal().catch((e) => toast(e.message || 'Não consegui abrir agora')),
  guide: async () => (await import('./views/guide.js')).openGuide(),
  ficha: async () => (await import('./views/ficha.js')).editFicha(),
  share: () => openShare(),
  privacy: async () => (await import('./privacy.js')).openPrivacy(),
  theme: (b) => { setThemePref(b.dataset.v); applySpaceMeta(ui.space === 'personal'); render(); },
  admin: async () => (await import('./views/admin.js')).openAdmin(),
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
    await store.upsert('events', { ...e, status });
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
    const n = store.state.notes.find((x) => x.id === b.dataset.id);
    await store.remove('notes', b.dataset.id);
    if (n) toast('Bilhete apagado', { action: 'Desfazer', onAction: () => store.upsert('notes', n) });
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
  'notify-test': () => settingsActions.notifyTest(),
  'coach-test': () => settingsActions.coachTest(),
  'onboarding-again': () => settingsActions.onboardingAgain(),
  export: () => settingsActions.export(),
  logout: async () => {
    if (await confirmDialog({ title: 'Sair da conta?', ok: 'Sair' })) {
      await cloudApi.signOut();
      purgeAuth();
      try { localStorage.removeItem(LS_UID); } catch { /* ok */ }
      location.reload();
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
  await store.upsert('notes', { id: uid('n_'), date: ui.date, text, author: store.me });
  toast('Bilhete adicionado');
});

/* ---------- gestos: deslizar semana/mês ---------- */
/* ---------- faixa contínua de dias (rola sem parar, vira o mês sozinha) ---------- */
const cellW = (strip) => (strip.firstElementChild ? strip.firstElementChild.getBoundingClientRect().width : 1) || 1;
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
      if (label && mid) label.textContent = `${M[+mid.slice(5, 7) - 1]} de ${mid.slice(0, 4)}`;
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
      navigator.serviceWorker.ready.then((reg) => reg.showNotification(msg.title, { body: msg.body, tag: `rem-${ev.id}`, icon: 'icons/icon-192.png', badge: 'icons/icon-192.png', data: { url: `./#/e/${ev.id}` } })).catch(() => {});
    }
  });
  // número no ícone: tarefas pendentes de hoje
  push.updateBadge(store.eventsOn(now.date, { person: store.me }).filter((e) => e.status !== 'feito').length);
}

/* Abre o lugar certo quando a pessoa toca numa notificação (#/e/ID ou #/d/DATA) */
function openDeepLink(hash = location.hash, tries = 0) {
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
};
let loginEmail = '';
let loginName = '', loginPass = ''; // não perde o que foi digitado quando aparece um aviso
let loginNotice = '';
let signupMode = false;
let pendingProfile = null;
/* qual conta entrou por último neste aparelho (protege contra sessão antiga de outra conta) */
const LS_UID = 'lembra.uid';
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
  try { if (sessionStorage.getItem('lembra.deleted')) { sessionStorage.removeItem('lembra.deleted'); loginNotice = 'Sua conta foi excluída e seus dados foram apagados. Obrigado por ter usado o Lembra.'; } } catch { /* ok */ }
  // convidado chegando pelo link: o mais comum é ainda não ter conta
  if (invitedBy() && !showLogin.seen) { showLogin.seen = true; signupMode = true; }
  const msg = errMsg || loginNotice;
  root.innerHTML = `
  <div class="login">
    <div class="brandwrap login__brand">${brand('completa', { h: 150, alt: esc(CONFIG.appName) })}</div>
    <h1 class="login__hook">${signupMode ? 'Crie sua conta grátis' : 'Que bom ter você aqui'}</h1>
    <p class="login__lead">${signupMode ? 'Em 2 minutos o Lembra aprende a sua rotina e passa a lembrar de tudo por você.' : 'Entre para ver o que tem para hoje.'}</p>
    ${invitedBy() ? `<div class="login__invite">${icon('users', 18)}<span><b>${esc(invitedBy())}</b> convidou você para a agenda de trabalho compartilhada. ${signupMode ? 'Crie sua conta' : 'Entre ou crie sua conta'} para participar — você não paga nada.</span></div>` : ''}
    <form class="form" data-login novalidate>
      ${signupMode ? `<div class="fgroup"><label class="flabel" for="l-name">Seu nome</label><input id="l-name" class="input" name="name" autocomplete="name" maxlength="40" placeholder="Seu primeiro nome" value="${esc(loginName)}"></div>` : ''}
      <div class="fgroup"><label class="flabel" for="l-email">E-mail</label><input id="l-email" class="input" type="email" name="email" value="${esc(loginEmail)}" autocomplete="username" autocapitalize="none" autocorrect="off" spellcheck="false" inputmode="email"></div>
      <div class="fgroup"><label class="flabel" for="l-pass">Senha</label>
        <div class="input-eye"><input id="l-pass" class="input" type="password" name="pass" autocomplete="${signupMode ? 'new-password' : 'current-password'}" placeholder="${signupMode ? '8+ caracteres, letras e números' : ''}" value="${esc(loginPass)}" autocapitalize="none" autocorrect="off" spellcheck="false">
        <button type="button" class="iconbtn iconbtn--sm" data-eye aria-label="Mostrar senha">${icon('eye', 18)}</button></div>
      </div>
      ${signupMode ? `<p class="login__hint">Mínimo de 8 caracteres, com letras e números.</p>
      <label class="consent"><input type="checkbox" name="consent" ${loginConsent ? 'checked' : ''}><span class="consent__dot" aria-hidden="true">${icon('check', 14)}</span>
        <span>Li e concordo com os <a href="${siteBase()}termos/" target="_blank" rel="noopener">Termos de Uso</a> e a <a href="${siteBase()}privacidade/" target="_blank" rel="noopener">Política de Privacidade</a> (LGPD).</span></label>` : ''}
      ${msg ? `<p class="login__err">${esc(msg)}</p>` : ''}
      <button class="btn btn--primary btn--block" type="submit" data-go>${signupMode ? 'Criar minha conta' : 'Entrar'}</button>
      ${signupMode ? '' : '<button class="btn-text btn-text--sm" type="button" data-reset>Esqueci minha senha</button>'}
      ${isStandalone() ? '' : `<button class="btn btn--soft btn--block login__install" type="button" data-installguide>${icon('phone', 16)} Instalar na tela inicial do celular</button>`}
      <div class="login__switch">${signupMode ? 'Já tem conta?' : 'Ainda não tem conta?'} <button class="btn-text btn-text--sm" type="button" data-mode>${signupMode ? 'Entrar' : 'Criar conta'}</button></div>
    </form>
  </div>`;
  const f = root.querySelector('[data-login]');
  root.querySelector('[data-eye]').onclick = () => {
    f.pass.type = f.pass.type === 'password' ? 'text' : 'password';
  };
  f.onsubmit = async (ev) => {
    ev.preventDefault();
    const email = f.email.value.trim().toLowerCase();
    const pass = f.pass.value;
    loginEmail = email;
    loginPass = pass;
    if (signupMode) loginName = (f.name.value || '').trim();
    loginNotice = '';
    if (!email || !pass) return showLogin('Preencha o e-mail e a senha.');
    const name = signupMode ? (f.name.value || '').trim() : '';
    if (signupMode) loginConsent = !!f.consent?.checked;
    if (signupMode && !name) return showLogin('Escreva seu nome.');
    // senha forte: 8+ caracteres com letras e números (dificulta invasão por tentativa)
    if (signupMode && (pass.length < 8 || !/[A-Za-zÀ-ÿ]/.test(pass) || !/\d/.test(pass))) return showLogin('Crie uma senha com pelo menos 8 caracteres, misturando letras e números.');
    if (signupMode && !loginConsent) return showLogin('Para criar a conta, aceite os Termos de Uso e a Política de Privacidade.');
    const go = f.querySelector('[data-go]');
    go.disabled = true;
    go.textContent = signupMode ? 'Criando…' : 'Entrando…';
    try {
      if (signupMode) pendingProfile = { name, consentAt: Date.now(), termsVersion: CONFIG.termsVersion || '1.0' };
      // vai entrar outra conta: esquece qualquer sessão guardada antes
      try { localStorage.removeItem(LS_UID); } catch { /* ok */ }
      await Promise.race([
        (signupMode ? cloudApi.signUp(email, pass, name) : cloudApi.signIn(email, pass)).then((cred) => { try { localStorage.setItem(LS_UID, cred.user.uid); } catch { /* ok */ } return cred; }),
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
  root.querySelector('[data-mode]').onclick = () => { signupMode = !signupMode; showLogin(); };
  const rs = root.querySelector('[data-reset]');
  if (rs) rs.onclick = async () => {
    const email = f.email.value.trim().toLowerCase();
    if (!email) return toast('Digite seu e-mail primeiro');
    try {
      await cloudApi.resetPassword(email);
      toast('Enviamos um e-mail para criar uma nova senha (veja também o spam)', { ms: 6000 });
    } catch (err) {
      toast(LOGIN_ERRORS[err?.code] || 'Não foi possível enviar o e-mail');
    }
  };
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
  if (!st.active) {
    // sem plano: tudo bloqueado até começar o teste grátis ou assinar; ao começar o teste, mostra o guia
    window.addEventListener('lembra:trial', () => { toast('Seu teste grátis de 24h começou ✓', { ms: 3500 }); showGuideSoon(); }, { once: true });
    return openPlans({ blocking: true });
  }
  if (/^#\/planos/.test(location.hash)) { history.replaceState(null, '', location.pathname + location.search); openPlans(); }
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
  if (store.solo && store.mode === 'cloud' && !store.billing) store.billing = lastKnown() || { plan: 'checking', active: false };
  // portão do plano: sem plano ativo nada é criado, alterado ou apagado (a ficha e os ajustes de rotina podem)
  store.gate = (col) => col === 'settings' || requireAccess();
  personal.gate = () => requireAccess();
  syncWork();
  shell();
  render();
  store.on(rerenderAll);
  startPersonal();
  personal.on(() => { if (ui.space === 'personal') rerenderAll(); });
  store.onDenied = (msg) => toast(msg, { ms: 5000 });
  store.onError = (err) => {
    const quota = err && /quota/i.test(String(err.name || err.message));
    const denied = err && /permission/i.test(String(err.code || err.message));
    toast(quota ? 'Memória do aparelho cheia: use logos menores ou ative a nuvem' : denied ? 'Sem permissão na nuvem: confira as regras do Firebase' : 'Não foi possível salvar. Verifique a conexão.', { ms: 5000 });
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
    store.hooks.eventChange = onEventChange;
    // mostra na tela quem recebeu o aviso (e quem ainda não ativou as notificações)
    setNotifyFeedback(({ ok, missing, error }) => {
      if (error) return toast(`Aviso não enviado: ${error}`, { ms: 6000 });
      if (missing.length) return toast(`${missing.join(' e ')} ainda não ativou as notificações no celular (Ajustes → Notificações → Ativar)`, { ms: 8000 });
      if (ok.length) toast(`Aviso enviado para ${ok.join(' e ')} ✓`, { ms: 3500 });
    });
    store.hooks.activity = onActivity;
    store.hooks.ask = async (question, history) => {
      const d = new Date();
      const context = buildContext({
        events: store.state.events, companies: store.state.companies, routine: routine(), notes: store.state.notes,
        team: store.team, me: store.me, now: { date: todayKey(), minutes: d.getHours() * 60 + d.getMinutes() },
        withIds: true,
        work: { profession: WORK.profession, entity: WORK.entity, marketing: isMarketing(), types: TYPE_ORDER.map((id) => ({ id, label: TYPES[id]?.label || id })) },
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
      setTimeout(maybeOnboard, 400);
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
  if (store.mode !== 'cloud' || !store.me || !p?.onboardedAt || personaOf(store.me)) return;
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
async function boot() {
  startErrorLog();
  // link de convite para a agenda compartilhada: guarda para depois do login
  captureInvite();
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

  loading('Conectando à nuvem…');
  const withTimeout = (p, ms) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error('tempo esgotado')), ms))]);
  try {
    const { connect } = await import('./cloud.js');
    cloudApi = await withTimeout(connect(fb), 15000);
  } catch (e) {
    console.error(e);
    return cloudError(e);
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
      if (started) return location.reload();
      return showLogin();
    }
    // PROTEÇÃO: o login só pode ser o da última pessoa que entrou NESTE aparelho.
    // Uma sessão antiga guardada (de outra conta) nunca pode "voltar" sozinha.
    const expected = (() => { try { return localStorage.getItem(LS_UID); } catch { return null; } })();
    if (expected && expected !== user.uid) {
      try { await cloudApi.signOut(); } catch { /* ok */ }
      purgeAuth();
      loginNotice = 'Por segurança, entre de novo com a sua conta.';
      if (started) return location.reload();
      return showLogin();
    }
    try { localStorage.setItem(LS_UID, user.uid); } catch { /* ok */ }
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
    const h = ev.data.url.split('#')[1];
    if (h) openDeepLink('#' + h);
  }
});

window.addEventListener('hashchange', () => {
  // abriu um convite com o app já aberto
  if (/^#\/convite\//.test(location.hash)) { captureInvite(); return maybeAcceptInvite(); }
  if (/^#\/(e|d|p)\//.test(location.hash)) return openDeepLink();
  if (/^#\/(c|v)\//.test(location.hash)) location.reload();
});

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
boot();
