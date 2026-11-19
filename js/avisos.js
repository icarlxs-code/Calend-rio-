/* Notificações no celular (Web Push) pelo servidor gratuito (Cloudflare Workers).
   No iPhone, só funcionam com o app instalado na Tela de Início (iOS 16.4 ou mais novo). */
import { store } from './store.js';
import { isStandalone } from './utils.js';
import { CONFIG } from '../config.js';

const LS_DEVICE = 'pauta.device';
const LS_PREFS = 'pauta.notifyPrefs';

export const server = () => {
  // só para testes no computador do desenvolvedor
  try {
    if (['localhost', '127.0.0.1'].includes(location.hostname) && localStorage.getItem('cal.pushServer')) return localStorage.getItem('cal.pushServer');
  } catch { /* ok */ }
  return (CONFIG.pushServer || '').replace(/\/+$/, '');
};
export const isIOS = () => /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
export const pushSupported = () => 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
export const permission = () => ('Notification' in window ? Notification.permission : 'unsupported');
/* No iPhone, o Safari comum não pode pedir notificações: só o app instalado */
export const needsInstall = () => isIOS() && !isStandalone();

export const getPrefs = () => {
  try {
    return { reminders: true, partner: true, daily: true, coach: true, ...JSON.parse(localStorage.getItem(LS_PREFS) || '{}') };
  } catch {
    return { reminders: true, partner: true, daily: true };
  }
};

const b64ToBytes = (b64) => {
  const pad = '='.repeat((4 - (b64.length % 4)) % 4);
  const raw = atob((b64 + pad).replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
};
const hashId = async (text) => {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return 'd_' + Array.from(new Uint8Array(buf).slice(0, 16), (b) => b.toString(16).padStart(2, '0')).join('');
};

/* Chamada autenticada ao servidor (manda o login do Firebase para provar quem é) */
export async function api(path, body) {
  if (!server()) throw Object.assign(new Error('Servidor de avisos não configurado.'), { code: 'no-server' });
  const token = await store.idToken();
  if (!token) throw Object.assign(new Error('Faça login para usar.'), { code: 'no-login' });
  const res = await fetch(server() + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body || {}),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.error || `Erro ${res.status}`), { status: res.status });
  return data;
}

/* Estado para a tela */
export async function status() {
  if (needsInstall()) return { state: 'install' };
  if (!pushSupported()) return { state: 'unsupported' };
  const perm = permission();
  if (perm === 'denied') return { state: 'denied' };
  if (perm !== 'granted') return { state: 'ask' };
  if (store.mode !== 'cloud' || !server()) return { state: 'local' };
  return { state: localStorage.getItem(LS_DEVICE) ? 'on' : 'ask' };
}

/* Pede a permissão (precisa vir de um toque do usuário) e cadastra o aparelho */
export async function enable() {
  if (needsInstall()) return { ok: false, reason: 'install' };
  if (!pushSupported()) return { ok: false, reason: 'unsupported' };
  const perm = await Notification.requestPermission();
  if (perm !== 'granted') return { ok: false, reason: 'denied' };
  if (store.mode !== 'cloud' || !server()) return { ok: true, local: true };
  return register();
}

/* Cadastra (ou atualiza) este aparelho no servidor */
export async function register() {
  if (store.mode !== 'cloud' || !server() || permission() !== 'granted' || !store.me) return { ok: false, reason: 'not-ready' };
  let key;
  try {
    key = (await (await fetch(server() + '/vapid')).json()).publicKey;
  } catch {
    return { ok: false, reason: 'server' };
  }
  if (!key) return { ok: false, reason: 'server' };
  const reg = await navigator.serviceWorker.ready;
  let sub = await reg.pushManager.getSubscription();
  // se a chave do servidor mudou, refaz a inscrição
  if (sub && sub.options?.applicationServerKey) {
    const cur = new Uint8Array(sub.options.applicationServerKey);
    const want = b64ToBytes(key);
    if (cur.length !== want.length || cur.some((b, i) => b !== want[i])) {
      await sub.unsubscribe();
      sub = null;
    }
  }
  if (!sub) sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64ToBytes(key) });
  const json = sub.toJSON();
  const id = await hashId(json.endpoint);
  await api('/subscribe', { id, subscription: { endpoint: json.endpoint, keys: json.keys }, prefs: getPrefs() });
  localStorage.setItem(LS_DEVICE, id);
  return { ok: true, id };
}

export async function setPrefs(prefs) {
  localStorage.setItem(LS_PREFS, JSON.stringify(prefs));
  if (store.mode === 'cloud' && permission() === 'granted') await register().catch(() => {});
}

/* Pede ao servidor uma notificação de teste para este aparelho */
export async function sendTest() {
  if (store.mode === 'cloud' && server()) {
    if (!localStorage.getItem(LS_DEVICE)) return { kind: 'not-registered' };
    const r = await api('/test');
    return { kind: 'server', ...r };
  }
  // sem servidor: mostra uma notificação local, só para conferir a aparência
  const reg = await navigator.serviceWorker.ready;
  await reg.showNotification('Notificações ativadas ✓', { body: 'É assim que os lembretes vão chegar.', icon: 'icons/icon-192.png', badge: 'icons/icon-192.png', tag: 'teste' });
  return { kind: 'local' };
}

/* Quantos celulares de cada pessoa estão cadastrados para receber avisos */
export async function teamDevices() {
  if (store.mode !== 'cloud' || !server()) return null;
  const r = await api('/devices').catch(() => null);
  return r && r.counts ? r.counts : null;
}

export const deviceRegistered = () => !!localStorage.getItem(LS_DEVICE);

/* Número no ícone do app = tarefas pendentes de hoje */
export function updateBadge(count) {
  try {
    if (!('setAppBadge' in navigator)) return;
    if (count > 0) navigator.setAppBadge(count).catch(() => {});
    else navigator.clearAppBadge().catch(() => {});
  } catch { /* não suportado */ }
}
