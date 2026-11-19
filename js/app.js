/* Inicialização, navegação e ações globais */
import { syncCoach } from './coach.js';
import { polishSoon } from './polish.js';
import { renderPersonalSpace, personalTabbar, bindPersonal, personalActions, openPersonalEditor } from './views/personal.js';
import { personal, startPersonal, occurrences } from './personal.js';
import { CONFIG } from '../config.js';
import { store, initLocal, initCloud } from './store.js';
import { ui, saveUi } from './ui.js';
import { esc, todayKey, addDays, addMonths, monthKey, uid, toMin, nowMin } from './utils.js';
import { TYPES } from './constants.js';
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
      ${tabBtn('empresas', 'building', 'Empresas')}
      ${tabBtn('ajustes', 'settings', 'Ajustes')}`}
    </nav>`;
}
/* Cor da barra de status do iPhone (hora/bateria) acompanha o app */
const SPACE_BAR = { work: ['#F4F4F6', '#000000'], personal: ['#F7F3FA', '#0E0A13'] };
function setBarColor(light, dark = light) {
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => {
    const media = m.getAttribute('media') || '';
    m.setAttribute('content', /dark/.test(media) ? dark : light);
  });
}
/* Pessoal parece outro app: título, ícone e cor da barra do iPhone próprios */
function applySpaceMeta(personalMode) {
  const [l, d] = SPACE_BAR[personalMode ? 'personal' : 'work'];
  setBarColor(l, d);
  const set = (sel, attr, val) => { const el = document.querySelector(sel); if (el) el.setAttribute(attr, val); };
  set('link[rel="manifest"]', 'href', personalMode ? 'pessoal.webmanifest' : 'manifest.webmanifest');
  set('link[rel="apple-touch-icon"]', 'href', personalMode ? 'icons/pessoal-180.png' : 'icons/icon-180.png');
  set('meta[name="apple-mobile-web-app-title"]', 'content', personalMode ? 'Pessoal' : 'Calendário');
  document.title = personalMode ? 'Pessoal · Calendário' : 'Calendário · Agenda de conteúdo';
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
    : `<div><span class="spaceveil__badge">${icon('briefcase', 40)}</span><strong>Trabalho</strong><small>Agenda da dupla</small></div>`;
  document.body.appendChild(veil);
  // a barra do topo (hora/bateria) entra na mesma cor da transição, quando o círculo chega lá em cima
  const veilBar = space === 'personal' ? '#C88AE8' : '#1E1E25';
  setTimeout(() => setBarColor(veilBar), 260);
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
  }, 680);
  setTimeout(() => { veil.classList.add('is-out'); const [l, d] = SPACE_BAR[space]; setBarColor(l, d); }, 900);
  setTimeout(() => veil.remove(), 1350);
}
window.__calRender = () => render();
const tabBtn = (id, ic, label) => `<button class="tabbar__btn" data-action="tab" data-tab="${id}">${icon(ic, 24)}<span>${label}</span></button>`;

function render() {
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
  bindSwipes();
  bindStrip(view);
  if (personalMode) {
    const pq = view.querySelector('[data-form="pquick"] input');
    bindPersonal(view);
    if (pq && draftP) pq.value = draftP;
    if (pq && hadP) pq.focus({ preventScroll: true });
  }
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
    const i = Math.max(0, Math.min(days.length - 7, days.indexOf(strip.dataset.left) + Number(b.dataset.n)));
    strip.dataset.left = days[i];
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
    await store.upsert('events', { ...e, status });
    if (status === 'feito') toast(`${TYPES[e.type].label} concluído`, { action: 'Desfazer', onAction: () => store.upsert('events', { ...store.event(e.id), status: e.status }) });
  },
  ...personalActions,
  'new-event': (b) => {
    if (!store.state.companies.length) {
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
      location.reload();
    }
  },
};

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
  strip.addEventListener('scroll', () => {
    if (!ready) return;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const i = Math.round(strip.scrollLeft / cellW(strip));
      if (days[i]) strip.dataset.left = days[i];
      const mid = days[Math.min(days.length - 1, i + 3)];
      if (label && mid) label.textContent = `${M[+mid.slice(5, 7) - 1]} de ${mid.slice(0, 4)}`;
    });
    clearTimeout(t);
    t = setTimeout(() => {
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
  'auth/invalid-credential': 'E-mail ou senha incorretos. Confira a senha (toque no olho para ver o que digitou).',
  'auth/wrong-password': 'Senha incorreta.',
  'auth/user-not-found': 'Este e-mail não está cadastrado no Firebase (Authentication → Usuários).',
  'auth/invalid-email': 'E-mail inválido.',
  'auth/too-many-requests': 'Muitas tentativas seguidas. Espere alguns minutos ou use "Esqueci minha senha".',
  'auth/network-request-failed': 'Sem conexão com a internet. Verifique o Wi-Fi/4G e tente de novo.',
  'auth/user-disabled': 'Este usuário foi desativado no Firebase.',
  'auth/operation-not-allowed': 'O login por e-mail/senha não está ativado no Firebase.',
  'auth/api-key-not-valid': 'Configuração do Firebase inválida (apiKey).',
};
let loginEmail = '';
let loginNotice = '';

function showLogin(errMsg = '') {
  const msg = errMsg || loginNotice;
  root.innerHTML = `
  <div class="login">
    <img src="icons/icon-192.png" alt="" width="84" height="84">
    <h1>${esc(CONFIG.appName)}</h1>
    <p>Agenda de conteúdo · ${esc(CONFIG.agencyName)}</p>
    <form class="form" data-login novalidate>
      <div class="fgroup"><label class="flabel" for="l-email">E-mail</label><input id="l-email" class="input" type="email" name="email" value="${esc(loginEmail)}" autocomplete="username" autocapitalize="none" autocorrect="off" spellcheck="false" inputmode="email"></div>
      <div class="fgroup"><label class="flabel" for="l-pass">Senha</label>
        <div class="input-eye"><input id="l-pass" class="input" type="password" name="pass" autocomplete="current-password" autocapitalize="none" autocorrect="off" spellcheck="false">
        <button type="button" class="iconbtn iconbtn--sm" data-eye aria-label="Mostrar senha">${icon('eye', 18)}</button></div>
      </div>
      ${msg ? `<p class="login__err">${esc(msg)}</p>` : ''}
      <button class="btn btn--primary btn--block" type="submit" data-go>Entrar</button>
      <button class="btn-text btn-text--sm" type="button" data-reset>Esqueci minha senha</button>
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
    loginNotice = '';
    if (!email || !pass) return showLogin('Preencha o e-mail e a senha.');
    const go = f.querySelector('[data-go]');
    go.disabled = true;
    go.textContent = 'Entrando…';
    try {
      await Promise.race([
        cloudApi.signIn(email, pass),
        new Promise((_, rej) => setTimeout(() => rej({ code: 'timeout' }), 20000)),
      ]);
      // deu certo: a tela muda sozinha quando o Firebase confirmar o login
      go.textContent = 'Abrindo…';
    } catch (err) {
      const code = err && err.code;
      showLogin(code === 'timeout' ? 'O servidor demorou para responder. Verifique a internet e tente de novo.' : LOGIN_ERRORS[code] || `Não foi possível entrar (${code || err?.message || 'erro desconhecido'}).`);
    }
  };
  root.querySelector('[data-reset]').onclick = async () => {
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
    <img src="icons/icon-192.png" alt="" width="72" height="72">
    <h2>Não consegui conectar</h2>
    <p>Verifique a internet e tente de novo.</p>
    <button class="btn btn--primary" data-retry>Tentar de novo</button>
    <small class="muted">Detalhe: ${esc(String(err && (err.code || err.message) || err))}</small>
  </div>`;
  root.querySelector('[data-retry]').onclick = () => location.reload();
}

function loading(msg = 'Carregando…') {
  root.innerHTML = `<div class="splash"><img src="icons/icon-192.png" alt="" width="72" height="72"><p>${esc(msg)}</p></div>`;
}

function startApp() {
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
  // empresas pré-cadastradas (uma única vez)
  ensureSeedCompanies()
    .then(() => setTimeout(() => ensureMatheusLogo().catch(() => {}), 800))
    .then(() => setTimeout(() => { try { ensureNotifyOwners(); } catch (e) { console.warn(e); } }, 1000))
    .then(() => setTimeout(() => ensureMatheusJG().catch((e) => console.warn('pedido Matheus', e)), 1200))
    .then(() => setTimeout(() => ensureSeedRoutine().catch((e) => console.warn('rotina', e)), 1500))
    .catch((e) => console.warn('pré-cadastro', e));
  // boas-vindas / permissão de notificações (depois da abertura)
  setTimeout(maybeOnboard, 600);
  // atualiza o cadastro deste celular para notificações (se já tiver permissão)
  if (store.mode === 'cloud' && push.permission() === 'granted') push.register().catch(() => {});
  setTimeout(() => openDeepLink(), 300);
}

/* Encontra o que foi cadastrado antes do login (só neste aparelho) e leva para a nuvem */
async function offerLocalMigration() {
  if (!store.ready || localStorage.getItem('cal.migrated')) return;
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
    if (started) return;
    const allowed = CONFIG.team.some((m) => m.email && m.email.toLowerCase() === (user.email || '').toLowerCase());
    if (!allowed) {
      loginNotice = `O e-mail ${user.email} não faz parte da equipe deste app.`;
      await cloudApi.signOut();
      return showLogin();
    }
    started = true;
    try {
      localStorage.setItem('cal.team', '1');
    } catch { /* ok */ }
    loading('Entrando…');
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
  if (/^#\/(e|d|p)\//.test(location.hash)) return openDeepLink();
  if (/^#\/(c|v)\//.test(location.hash)) location.reload();
});

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
boot();
