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
import { decodeSnapshot } from './share.js';

const root = document.getElementById('app');
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
  const html = ui.tab === 'mes' ? renderMonth() : ui.tab === 'empresas' ? renderCompanies() : ui.tab === 'ajustes' ? renderSettings() : renderToday();
  view.innerHTML = html;
  document.querySelectorAll('.tabbar__btn').forEach((b) => b.classList.toggle('is-on', b.dataset.tab === ui.tab));
  window.scrollTo(0, scroll);
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
  notif: () => settingsActions.notif(),
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
function checkReminders() {
  if (!store.me) return;
  const t = todayKey();
  const now = nowMin();
  store.eventsOn(t, { person: store.me }).forEach((e) => {
    const rem = e.reminder ?? 30;
    if (rem < 0 || rem >= 1440 || !e.time || e.status === 'feito') return;
    const at = toMin(e.time) - rem;
    const key = `${e.id}@${e.date}${e.time}`;
    if (now >= at && now <= toMin(e.time) && !notified.has(key)) {
      notified.add(key);
      const c = store.company(e.companyId);
      const msg = `${e.time} · ${TYPES[e.type].label} · ${c?.name || ''}`;
      toast(`Lembrete: ${msg}`, { ms: 6000 });
      if ('Notification' in window && Notification.permission === 'granted' && navigator.serviceWorker?.ready) {
        navigator.serviceWorker.ready.then((reg) => reg.showNotification('Pauta · Lembrete', { body: `${msg}\n${e.title || ''}`, tag: key, icon: 'icons/icon-192.png' }));
      }
    }
  });
}

/* ---------- login (modo nuvem) ---------- */
function showLogin(errMsg = '') {
  root.innerHTML = `
  <div class="login">
    <img src="icons/icon-192.png" alt="" width="84" height="84">
    <h1>${esc(CONFIG.appName)}</h1>
    <p>Agenda de conteúdo · ${esc(CONFIG.agencyName)}</p>
    <form class="form" data-login>
      <div class="fgroup"><label class="flabel" for="l-email">E-mail</label><input id="l-email" class="input" type="email" name="email" autocomplete="username" required></div>
      <div class="fgroup"><label class="flabel" for="l-pass">Senha</label><input id="l-pass" class="input" type="password" name="pass" autocomplete="current-password" required></div>
      ${errMsg ? `<p class="login__err">${esc(errMsg)}</p>` : ''}
      <button class="btn btn--primary btn--block" type="submit">Entrar</button>
      <button class="btn-text btn-text--sm" type="button" data-reset>Esqueci minha senha</button>
    </form>
  </div>`;
  const f = root.querySelector('[data-login]');
  f.onsubmit = async (ev) => {
    ev.preventDefault();
    try {
      await cloudApi.signIn(f.email.value.trim(), f.pass.value);
    } catch {
      showLogin('E-mail ou senha incorretos.');
    }
  };
  root.querySelector('[data-reset]').onclick = async () => {
    const email = f.email.value.trim();
    if (!email) return toast('Digite seu e-mail primeiro');
    try {
      await cloudApi.resetPassword(email);
      toast('Enviamos um e-mail para redefinir a senha');
    } catch {
      toast('Não foi possível enviar o e-mail');
    }
  };
}

function loading(msg = 'Carregando…') {
  root.innerHTML = `<div class="splash"><img src="icons/icon-192.png" alt="" width="72" height="72"><p>${esc(msg)}</p></div>`;
}

function startApp() {
  shell();
  render();
  store.on(rerenderAll);
  setInterval(() => {
    if (ui.tab === 'hoje' && !openSheets().length) render();
    checkReminders();
  }, 60000);
  checkReminders();
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      if (ui.date < todayKey() && ui.tab === 'hoje') ui.date = todayKey();
      render();
    }
  });
  if (!store.me && store.mode === 'local') setTimeout(askWhoAmI, 400);
}

async function askWhoAmI() {
  const { openSheet } = await import('./components.js');
  openSheet({
    className: 'sheet--dialog',
    html: `<div class="dialog">
      <h3>Quem está usando este celular?</h3>
      <p>Assim o app te cumprimenta e mostra “Minha agenda”. Dá para trocar depois em Ajustes.</p>
      <div class="whogrid">${store.team.map((m) => `<button class="whobtn" style="--mc:${m.color}" data-me="${m.id}">${avatar(m.id, 34)}<span>${esc(m.name)}</span></button>`).join('')}</div>
    </div>`,
    onMount: (api) => api.el.querySelectorAll('[data-me]').forEach((b) => (b.onclick = () => {
      store.setMe(b.dataset.me);
      api.close();
    })),
  });
}

/* ---------- rotas ---------- */
async function boot() {
  const hash = location.hash || '';
  const fb = CONFIG.firebase;

  // Tela do cliente (link compartilhado)
  if (hash.startsWith('#/c/') || hash.startsWith('#/v/')) {
    loading('Carregando cronograma…');
    const isTeamDevice = !!localStorage.getItem('pauta.me');
    try {
      if (hash.startsWith('#/v/')) {
        const data = await decodeSnapshot(hash.slice(4));
        return showClient(root, data, { canGoBack: isTeamDevice });
      }
      if (!fb) return showClientError(root, 'Este link precisa da sincronização na nuvem ativada.');
      const { fetchPublic } = await import('./cloud.js');
      const data = await fetchPublic(fb, hash.slice(4));
      if (!data) return showClientError(root, 'Este link não existe mais. Peça um novo link para a equipe.');
      return showClient(root, data, { canGoBack: isTeamDevice });
    } catch (e) {
      console.error(e);
      return showClientError(root, 'Não foi possível abrir o cronograma. Verifique a conexão e tente novamente.');
    }
  }

  if (!fb) {
    await initLocal();
    return startApp();
  }

  loading();
  try {
    const { connect } = await import('./cloud.js');
    cloudApi = await connect(fb);
  } catch (e) {
    console.error(e);
    // Sem internet na primeira abertura: segue no modo local
    toast('Sem conexão com a nuvem — usando dados deste aparelho');
    await initLocal();
    return startApp();
  }
  let started = false;
  cloudApi.onUser(async (user) => {
    if (!user) return showLogin();
    if (started) return;
    const allowed = CONFIG.team.some((m) => m.email && m.email.toLowerCase() === (user.email || '').toLowerCase());
    if (!allowed) {
      await cloudApi.signOut();
      return showLogin('Este e-mail não faz parte da equipe (veja config.js).');
    }
    started = true;
    loading('Sincronizando…');
    await initCloud(cloudApi.backend, user);
    startApp();
  });
}

window.addEventListener('hashchange', () => {
  if (/^#\/(c|v)\//.test(location.hash)) location.reload();
});

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
boot();
