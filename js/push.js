/* Notificações no celular (Web Push).
   No iPhone, só funcionam com o app instalado na Tela de Início (iOS 16.4 ou mais novo). */
import { store } from './store.js';
import { isStandalone } from './utils.js';

const LS_DEVICE = 'pauta.device';
const LS_PREFS = 'pauta.notifyPrefs';

export const isIOS = () => /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
export const pushSupported = () => 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
export const permission = () => ('Notification' in window ? Notification.permission : 'unsupported');
/* No iPhone, o Safari comum não pode pedir notificações: só o app instalado */
export const needsInstall = () => isIOS() && !isStandalone();

export const getPrefs = () => {
  try {
    return { reminders: true, partner: true, daily: true, ...JSON.parse(localStorage.getItem(LS_PREFS) || '{}') };
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

/* Estado para a tela: o que já está funcionando neste aparelho */
export async function status() {
  if (!pushSupported()) return { state: needsInstall() ? 'install' : 'unsupported' };
  if (needsInstall()) return { state: 'install' };
  const perm = permission();
  if (perm === 'denied') return { state: 'denied' };
  if (perm !== 'granted') return { state: 'ask' };
  if (store.mode !== 'cloud') return { state: 'local' };
  const reg = await navigator.serviceWorker.ready;
  const sub = await reg.pushManager.getSubscription();
  return { state: sub && localStorage.getItem(LS_DEVICE) ? 'on' : 'ask' };
}

/* Pede a permissão (precisa vir de um toque do usuário) e cadastra o aparelho */
export async function enable() {
  if (needsInstall()) return { ok: false, reason: 'install' };
  if (!pushSupported()) return { ok: false, reason: 'unsupported' };
  const perm = await Notification.requestPermission();
  if (perm !== 'granted') return { ok: false, reason: 'denied' };
  if (store.mode !== 'cloud') return { ok: true, local: true };
  return register();
}

/* Cadastra (ou atualiza) este aparelho na nuvem */
export async function register() {
  if (store.mode !== 'cloud' || permission() !== 'granted' || !store.me) return { ok: false, reason: 'not-ready' };
  const meta = await store.readDoc('meta/push');
  const key = meta?.vapidPublicKey;
  if (!key) return { ok: false, reason: 'server' }; // servidor de notificações ainda não publicado
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
  store.writeRaw('devices', {
    id,
    member: store.me,
    subscription: { endpoint: json.endpoint, keys: json.keys },
    prefs: getPrefs(),
    device: isIOS() ? 'iPhone' : navigator.platform || 'navegador',
    updatedAt: Date.now(),
  });
  localStorage.setItem(LS_DEVICE, id);
  return { ok: true, id };
}

export async function setPrefs(prefs) {
  localStorage.setItem(LS_PREFS, JSON.stringify(prefs));
  if (store.mode === 'cloud' && permission() === 'granted') await register();
}

/* Pede ao servidor uma notificação de teste para este aparelho */
export async function sendTest() {
  const id = localStorage.getItem(LS_DEVICE);
  if (store.mode === 'cloud' && id) {
    store.writeRaw('pings', { id: 'p_' + Date.now().toString(36), device: id, member: store.me, at: Date.now() });
    return 'server';
  }
  // sem servidor: mostra uma notificação local, só para conferir a aparência
  const reg = await navigator.serviceWorker.ready;
  await reg.showNotification('Notificações ativadas ✓', { body: 'É assim que os lembretes vão chegar.', icon: 'icons/icon-192.png', badge: 'icons/icon-192.png', tag: 'teste' });
  return 'local';
}

/* Número no ícone do app = tarefas pendentes de hoje */
export function updateBadge(count) {
  try {
    if (!('setAppBadge' in navigator)) return;
    if (count > 0) navigator.setAppBadge(count).catch(() => {});
    else navigator.clearAppBadge().catch(() => {});
  } catch { /* não suportado */ }
}
