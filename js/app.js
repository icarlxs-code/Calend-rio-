/* Inicialização, navegação e ações globais */
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
import { ensureSeedCompanies } from './seed-companies.js';
import * as push from './avisos.js';
import { dueReminders, reminderMessage } from '../functions/reminder-rules.js';

const root = document.getElementById('app');
// avisa a página que o app carregou (a proteção de abertura não deve mais agir)
window.__calStarted = true;
let cloudApi = null;

/* ---------- casca do app ---------- */
function shell() {
  root.innerHTML = `
    <main id="view" class="view"></main>
    <nav class="tabbar" aria-label="Navegação">
      ${tabBtn('hoje', 'today', 'Hoje')}
      ${tabBtn('mes', 'calendar', 'Calendário')}
      <button class="tabbar__fab" data-action="new-event" aria-label="Novo evento">${icon('plus', 28)}</button>
      ${tabBtn('empresas', 'building', 'Empresas')}
      ${tabBtn('ajustes', 'settings', 'Ajustes')}
    </nav>`;
}
const tabBtn = (id, ic, label) => `<button class="tabbar__btn" data-action="tab" data-tab="${id}">${icon(ic, 24)}<span>${label}</span></button>`;

function render() {
  const view = document.getElementById('view');
  if (!view) return;
  const scroll = window.scrollY;
  // preserva o que estiver sendo digitado (ex.: bilhete) quando a tela atualiza
  const noteInput = view.querySelector('[data-form="note"] input');
  const draftNote = noteInput ? noteInput.value : '';
  const hadFocus = noteInput && document.activeElement === noteInput;
  const html = ui.tab === 'mes' ? renderMonth() : ui.tab === 'empresas' ? renderCompanies() : ui.tab === 'ajustes' ? renderSettings() : renderToday();
  view.innerHTML = html;
  document.querySelectorAll('.tabbar__btn').forEach((b) => b.classList.toggle('is-on', b.dataset.tab === ui.tab));
  window.scrollTo(0, scroll);
  const ni = view.querySelector('[data-form="note"] input');
  if (ni && draftNote) ni.value = draftNote;
  if (ni && hadFocus) ni.focus({ preventScroll: true });
  bindSwipes();
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
    render();
  },
  week: (b) => {
    ui.date = addDays(ui.date, Number(b.dataset.n));
    render();
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
function bindSwipes() {
  document.querySelectorAll('[data-swipe]').forEach((el) => {
    let x0 = null, y0 = null;
    el.addEventListener('touchstart', (e) => {
      x0 = e.touches[0].clientX;
      y0 = e.touches[0].clientY;
    }, { passive: true });
    el.addEventListener('touchend', (e) => {
      if (x0 == null) return;
      const dx = e.changedTouches[0].clientX - x0;
      const dy = e.changedTouches[0].clientY - y0;
      x0 = null;
      if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
      const dir = dx < 0 ? 1 : -1;
      if (el.dataset.swipe === 'week') ui.date = addDays(ui.date, 7 * dir);
      else {
        ui.month = addMonths(ui.month, dir);
        ui.monthSel = `${ui.month}-01`;
      }
      render();
    });
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
function openDeepLink(hash = location.hash) {
  const m = /^#\/(e|d)\/([\w-]+)/.exec(hash || '');
  if (!m) return false;
  history.replaceState(null, '', location.pathname + location.search);
  if (m[1] === 'e' && store.event(m[2])) {
    ui.date = store.event(m[2]).date;
    setTab('hoje');
    openEventDetail(m[2]);
  } else if (m[1] === 'd' && /^\d{4}-\d{2}-\d{2}$/.test(m[2])) {
    ui.date = m[2];
    setTab('hoje');
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
  // empresas pré-cadastradas (uma única vez)
  ensureSeedCompanies().catch((e) => console.warn('pré-cadastro', e));
  // boas-vindas / permissão de notificações (depois da abertura)
  setTimeout(maybeOnboard, 600);
  // atualiza o cadastro deste celular para notificações (se já tiver permissão)
  if (store.mode === 'cloud' && push.permission() === 'granted') push.register().catch(() => {});
  setTimeout(() => openDeepLink(), 300);
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
  if (/^#\/(e|d)\//.test(location.hash)) return openDeepLink();
  if (/^#\/(c|v)\//.test(location.hash)) location.reload();
});

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
boot();
