/* Sincronização na nuvem (Firebase Firestore + login por e-mail).
   Só é carregado quando CONFIG.firebase estiver preenchido. */
/* O Firebase vem embutido no próprio app (sem baixar de outro servidor ao abrir). */
import * as appMod from 'firebase/app';
import * as fsMod from 'firebase/firestore';
import * as authMod from 'firebase/auth';
import * as fnMod from 'firebase/functions';
import { CONFIG } from '../config.js';
import { mudancas, vencido } from './lixeira-core.js';
import { criaFila } from './fila.js';

let fs, auth, db, authApi, functions;

/* Só para testes no computador do desenvolvedor: usa o Firebase local (emuladores).
   Nunca é ativado no site publicado. */
const useEmulator = () => {
  try {
    return ['localhost', '127.0.0.1'].includes(location.hostname) && localStorage.getItem('cal.emulator') === '1';
  } catch {
    return false;
  }
};

let appConfig = null;
export async function connect(config) {
  if (useEmulator()) config = { ...config, projectId: 'demo-calendario' };
  appConfig = config;
  fs = fsMod;
  authApi = authMod;
  const app = appMod.initializeApp(config);
  // Cache em memória: o mais confiável no Safari do iPhone (o armazenamento do Safari pode travar).
  // Long polling automático: funciona mesmo em redes que bloqueiam conexões de streaming.
  db = fs.initializeFirestore(app, { localCache: fs.memoryLocalCache(), experimentalAutoDetectLongPolling: true });
  if (useEmulator()) fs.connectFirestoreEmulator(db, '127.0.0.1', 8085);
  // Login sem janelas extras (o Safari do iPhone pode bloquear a janela invisível do getAuth)
  try {
    auth = authApi.initializeAuth(app, {
      persistence: [authApi.indexedDBLocalPersistence, authApi.browserLocalPersistence, authApi.inMemoryPersistence],
    });
  } catch {
    auth = authApi.getAuth(app);
  }
  if (useEmulator()) { authApi.connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true }); try { auth.settings.appVerificationDisabledForTesting = true; } catch { /* ok */ } }
  // e-mails do login (confirmação e "esqueci a senha") em português
  try { auth.languageCode = 'pt-BR'; } catch { /* ok */ }
  functions = fnMod.getFunctions(app, CONFIG.functionsRegion || 'southamerica-east1');
  if (useEmulator()) fnMod.connectFunctionsEmulator(functions, '127.0.0.1', 5001);
  return {
    onUser: (cb) => authApi.onAuthStateChanged(auth, cb),
    signIn: (email, pass) => authApi.signInWithEmailAndPassword(auth, email, pass),
    // e-mail de "esqueci a senha": o botão do e-mail volta para o app (se o endereço do app estiver autorizado no Firebase)
    resetPassword: async (email, continueUrl = '') => {
      if (!continueUrl) return authApi.sendPasswordResetEmail(auth, email);
      try { return await authApi.sendPasswordResetEmail(auth, email, { url: continueUrl, handleCodeInApp: false }); }
      catch (e) { if (/continue-uri|domain/i.test(String(e.code || e.message))) return authApi.sendPasswordResetEmail(auth, email); throw e; }
    },
    // tela própria de "criar nova senha" (link do e-mail com ?mode=resetPassword&oobCode=…)
    phoneStart, phoneFinish, setPassword,
    verifyReset: (code) => authApi.verifyPasswordResetCode(auth, code),
    confirmReset: (code, pass) => authApi.confirmPasswordReset(auth, code, pass),
    applyCode: (code) => authApi.applyActionCode(auth, code),
    // sair: a agenda guardada neste celular é apagada (celular emprestado não guarda nada de ninguém)
    signOut: async () => { if (fila && fila.pendentes().length) await Promise.race([fila.esvazia().catch(() => {}), new Promise((r) => setTimeout(r, 4000))]); try { Object.keys(localStorage).filter((k) => /^lembra\.(perfil|equipe)\./.test(k)).forEach((k) => localStorage.removeItem(k)); } catch { /* ok */ } while (subs.length) subs.pop().stop(); await idb.clear().catch(() => {}); try { indexedDB.deleteDatabase('lembra-backup'); } catch { /* ok */ } return authApi.signOut(auth); },
    signUp: async (email, pass, name) => {
      const cred = await authApi.createUserWithEmailAndPassword(auth, email, pass);
      if (name) await authApi.updateProfile(cred.user, { displayName: name }).catch(() => {});
      // confirma que o e-mail é da pessoa (protege a recuperação de senha)
      authApi.sendEmailVerification(cred.user).catch(() => {});
      return cred;
    },
    backend,
  };
}
/* ---------- conta (LGPD) ---------- */
export const account = {
  emailVerified: () => !!auth?.currentUser?.emailVerified,
  resendVerification: () => authApi.sendEmailVerification(auth.currentUser),
  reload: () => auth.currentUser.reload(),
  /* confirma a senha antes de ações sensíveis (excluir a conta) */
  async reauth(password) {
    const u = auth.currentUser;
    await authApi.reauthenticateWithCredential(u, authApi.EmailAuthProvider.credential(u.email, password));
  },
  deleteUser: () => authApi.deleteUser(auth.currentUser),
};

const clean = (obj) => JSON.parse(JSON.stringify(obj)); // remove undefined
/* Espaço de dados: a dupla Henrique+Matheus usa a raiz (como sempre);
   cada conta nova tem o próprio espaço em ws/{uid}, que só ela acessa. */
let base = [];
const col = (name) => fs.collection(db, ...base, name);
const ref = (name, id) => fs.doc(db, ...base, name, id);

/* ---------- agenda guardada no celular: ao abrir, o banco manda SÓ o que mudou ----------
   Cada gravação leva "_u" (hora do servidor). O celular guarda tudo (IndexedDB) e, ao abrir, pede só os
   documentos com _u depois da última vez — em vez de reler a agenda inteira a cada abertura (economiza a
   cota grátis de leituras do Firebase). Apagar vira uma marca "deletedAt" com o conteúdo inteiro (lixeira de 24 h).
   A marca antiga "_del" só é lida: nunca mais é gravada.
   A cada 3 dias relê tudo, para conferir. Se o armazenamento do celular falhar, funciona como antes. */
const SYNC_V = 2, FULL_EVERY = 3 * 864e5, OVERLAP = 10 * 60e3;
const stamp = (item) => ({ ...clean(item), _u: fs.serverTimestamp() });
const idb = (() => {
  let dbp = null;
  const open = () => (dbp ||= new Promise((res, rej) => {
    try {
      const r = indexedDB.open('lembra-agenda', 1);
      r.onupgradeneeded = () => r.result.createObjectStore('c');
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
      setTimeout(() => rej(new Error('armazenamento lento')), 2500);
    } catch (e) { rej(e); }
  }).catch((e) => { dbp = null; throw e; }));
  const run = (mode, fn) => open().then((d) => new Promise((res, rej) => {
    const t = d.transaction('c', mode), r = fn(t.objectStore('c'));
    t.oncomplete = () => res(r && r.result); t.onerror = () => rej(t.error); t.onabort = () => rej(t.error);
    setTimeout(() => rej(new Error('armazenamento lento')), 2500);
  }));
  return { get: (k) => run('readonly', (st) => st.get(k)), put: (k, v) => run('readwrite', (st) => st.put(v, k)), clear: () => run('readwrite', (st) => { const r = st.openCursor(); r.onsuccess = () => { const c = r.result; if (!c) return; if (!String(c.key).startsWith('fila|')) c.delete(); c.continue(); }; return r; }) }; // a fila do que ainda não subiu nunca é apagada
})();
const live = new Map(); // coleção → { docs, emit } (para as gravações deste celular aparecerem na hora)
const liveKey = (path) => path.join('/');
/* alterações que ainda não subiram (sobrevivem a fechar o app) */
let fila = null, filaDe = '';
function minhaFila() {
  const uid = auth.currentUser?.uid || '-';
  if (fila && filaDe === uid) return fila;
  filaDe = uid; const K = `fila|${uid}`;
  fila = criaFila({
    le: () => idb.get(K), grava: (L) => idb.put(K, L.map(({ indo, ...e }) => e)),
    envia: (e) => { const d = { ...e.por, _u: fs.serverTimestamp() }; for (const t of e.tira || []) d[t] = fs.deleteField(); const r = fs.doc(db, ...e.k.split('/')); if (!e.novo) return fs.updateDoc(r, d); d._del = fs.deleteField(); return fs.setDoc(r, d, { mergeFields: Object.keys(d) }); },
    aoMudar: (n) => { try { window.dispatchEvent(new CustomEvent('lembra:fila', { detail: n })); } catch { /* ok */ } },
    aoRecusar: (e, c) => { console.warn('alteração recusada', e.k, c); try { window.dispatchEvent(new CustomEvent('lembra:recusada')); } catch { /* ok */ } },
  });
  return fila;
}
/* grava agora e deixa na fila até o servidor confirmar */
async function comFila(entradas, envio) {
  const f = minhaFila(), itens = [];
  for (const e of entradas) { const it = await f.poe(e).catch(() => null); if (it) { it.indo = 1; itens.push(it); } }
  try { const r = await envio(); for (const it of itens) await f.tira(it); return r; }
  catch (e) { for (const it of itens) { delete it.indo; if (/permission-denied|invalid-argument/.test(String(e.code || ''))) await f.tira(it); } throw e; }
}
const entrada = (path, item, base) => { const { por, tira } = mudancas(base, item); return { k: [...path, item.id].join('/'), por: clean(por), tira, novo: !base }; };
export const esvaziaFila = () => (auth?.currentUser ? minhaFila().esvazia() : Promise.resolve());
function syncCollection(path, onList, onErr) {
  const key = `${SYNC_V}|${auth.currentUser?.uid || '-'}|${liveKey(path)}`;
  const docs = new Map();
  let since = 0, fullAt = 0, unsub = null, stopped = false, saveT = null, firstDone = false;
  const list = () => { // o que a pessoa mudou e ainda não subiu vale por cima do servidor
    const f = filaDe === auth.currentUser?.uid ? fila : null, L = [...docs.values()]; if (!f || !f.pendentes().length) return L;
    const pre = `${liveKey(path)}/`, ks = new Set(f.chaves(pre)); if (!ks.size) return L;
    const out = L.map((d) => (ks.has(pre + d.id) ? (ks.delete(pre + d.id), { ...f.porCima(pre + d.id, d), id: d.id }) : d));
    for (const k of ks) { const e = f.pendentes().find((x) => x.k === k && x.novo); if (e) out.push({ ...f.porCima(k, null), id: k.slice(pre.length) }); }
    return out;
  };
  const emit = () => onList(list());
  const save = () => { clearTimeout(saveT); saveT = setTimeout(() => idb.put(key, { docs: Object.fromEntries(docs), since, fullAt }).catch(() => {}), 1500); };
  const me = { docs, emit, save, hora: () => since };
  live.set(liveKey(path), me);
  const ready = new Promise((resolve) => {
    const start = (full) => {
      if (stopped) return;
      const c = fs.collection(db, ...path);
      const q = full ? c : fs.query(c, fs.where('_u', '>', fs.Timestamp.fromMillis(Math.max(0, since - OVERLAP))));
      let first = true;
      unsub = fs.onSnapshot(q, (snap) => {
        if (first && full) docs.clear(); // releitura completa: vale o que o banco tem
        // conta aproximada das leituras cobradas (para os testes de consumo)
        if (!snap.metadata.fromCache) globalThis.__lembraReads = (globalThis.__lembraReads || 0) + Math.max(first ? 1 : 0, snap.docChanges().filter((c) => !c.doc.metadata.hasPendingWrites).length);
        for (const ch of snap.docChanges()) {
          if (ch.type === 'removed') { docs.delete(ch.doc.id); continue; }
          const d = ch.doc.data({ serverTimestamps: 'estimate' });
          const t = d._u && d._u.toMillis ? d._u.toMillis() : 0;
          if (t > since && !ch.doc.metadata.hasPendingWrites) since = t;
          if (d._del) docs.delete(ch.doc.id);
          else { delete d._u; docs.set(ch.doc.id, { ...d, id: ch.doc.id }); }
        }
        if (first && full) fullAt = Date.now();
        first = false;
        emit(); save();
        if (!firstDone) { firstDone = true; resolve(); }
      }, (err) => {
        console.error('Firestore', liveKey(path), err);
        onErr && onErr(err);
        if (!firstDone) { firstDone = true; resolve(); }
      });
    };
    minhaFila().carrega().then(() => idb.get(key)).then((c) => {
      if (c && c.docs && typeof c.docs === 'object') {
        for (const [id, d] of Object.entries(c.docs)) docs.set(id, d);
        since = c.since || 0; fullAt = c.fullAt || 0;
        if (docs.size) { emit(); firstDone = true; resolve(); } // abre na hora com o que está no celular
      }
      start(!c || Date.now() - fullAt > FULL_EVERY);
    }).catch(() => start(true));
  });
  return { ready, stop: () => { stopped = true; live.delete(liveKey(path)); unsub && unsub(); } };
}
/* gravação deste celular: aparece na hora (o banco confirma depois) */
function localApply(path, id, item) {
  const l = live.get(liveKey(path));
  if (!l) return;
  l.docs.set(id, { ...(l.docs.get(id) || {}), ...clean(item), id });
  l.emit(); l.save();
}
/* grava só o que mudou (campo a campo): um aparelho desatualizado não apaga o que outro escreveu,
   e uma edição nunca tira um item da lixeira */
function campos(path, item) {
  const base = live.get(liveKey(path))?.docs.get(item.id), { por, tira } = mudancas(base, item), dados = { ...clean(por), _u: fs.serverTimestamp() };
  for (const k of tira) dados[k] = fs.deleteField();
  if (!base) dados._del = fs.deleteField();
  return [dados, { mergeFields: Object.keys(dados) }];
}
const marcaEm = (d) => [{ ...d, _u: fs.serverTimestamp() }, { mergeFields: [...Object.keys(d), '_u'] }];
async function emLotes(lista, n, fn) { for (let i = 0; i < lista.length; i += n) { const batch = fs.writeBatch(db); lista.slice(i, i + n).forEach((x) => fn(batch, x)); await batch.commit(); } }
const subs = [];

/* ---------- celular por SMS (Firebase Phone Auth) ----------
   Confirmar o celular: liga o número à conta já aberta.
   Recuperar a senha: o SMS é conferido num login SEPARADO (só na memória), sem mexer no app.
   Só se o número for de uma conta com e-mail é que a senha nova é gravada e o app entra com ela. */
let verifier = null, smsMode = 'link', auth2 = null;
function smsAuth() {
  if (auth2) return auth2;
  const app2 = appMod.initializeApp(appConfig, 'recuperar-sms');
  auth2 = authApi.initializeAuth(app2, { persistence: authApi.inMemoryPersistence });
  if (useEmulator()) { authApi.connectAuthEmulator(auth2, 'http://127.0.0.1:9099', { disableWarnings: true }); try { auth2.settings.appVerificationDisabledForTesting = true; } catch { /* ok */ } }
  try { auth2.languageCode = 'pt-BR'; } catch { /* ok */ }
  return auth2;
}
async function phoneStart(e164, boxId, mode = 'link') {
  try { verifier?.clear(); } catch { /* ok */ }
  smsMode = mode;
  const a = mode === 'signin' ? smsAuth() : auth;
  verifier = new authApi.RecaptchaVerifier(a, boxId, { size: 'invisible' });
  return mode === 'signin' ? authApi.signInWithPhoneNumber(a, e164, verifier) : authApi.linkWithPhoneNumber(auth.currentUser, e164, verifier);
}
async function phoneFinish(confirmation, code) {
  const r = await confirmation.confirm(code);
  if (smsMode === 'signin') {
    // número que não é de nenhuma conta (ou conta só de telefone): desfaz e avisa — não cria conta vazia
    const info = authApi.getAdditionalUserInfo ? authApi.getAdditionalUserInfo(r) : null;
    if ((info && info.isNewUser) || !r.user.email) {
      await r.user.delete().catch(() => {});
      await authApi.signOut(auth2).catch(() => {});
      throw Object.assign(new Error('sem conta'), { code: 'auth/user-not-found' });
    }
  }
  return r;
}
async function setPassword(p) {
  if (smsMode !== 'signin') return authApi.updatePassword(auth.currentUser, p);
  // recuperação: grava a senha nova na conta do SMS e entra no app com o e-mail + senha nova
  const u = auth2.currentUser;
  if (!u || !u.email) throw Object.assign(new Error('sem conta'), { code: 'auth/user-not-found' });
  await authApi.updatePassword(u, p);
  const email = u.email;
  await authApi.signOut(auth2).catch(() => {});
  smsMode = 'link';
  return authApi.signInWithEmailAndPassword(auth, email, p);
}

const backend = {
  phoneStart, phoneFinish, setPassword, esvaziaFila,
  pendentes: () => (fila ? fila.pendentes().length : 0),
  setWorkspace(uid) { base = uid ? ['ws', uid] : []; },
  /* separação da antiga dupla: lê a agenda que ficava na raiz e copia para o espaço da pessoa (a raiz fica intacta) */
  async readRoot(name) {
    const snap = await fs.getDocs(fs.collection(db, name));
    return snap.docs.map((d) => ({ ...d.data(), id: d.id }));
  },
  async copyToWs(uid, name, items) {
    // só o que ainda não existe no espaço novo (rodar de novo nunca sobrescreve o que já foi editado lá)
    const have = new Set((await fs.getDocs(fs.collection(db, 'ws', uid, name))).docs.map((d) => d.id));
    items = items.filter((it) => !have.has(it.id));
    for (let i = 0; i < items.length; i += 20) {
      const batch = fs.writeBatch(db);
      for (const it of items.slice(i, i + 20)) batch.set(fs.doc(db, 'ws', uid, name, it.id), stamp(it));
      await batch.commit();
    }
  },
  /* Resumo de uso de cada conta (o dono vê no painel) */
  writeStats(uid, data) {
    return fs.setDoc(fs.doc(db, 'stats', uid), { ...clean(data), opens: fs.increment(1) }, { merge: true });
  },
  touchStats(uid, data) {
    return fs.setDoc(fs.doc(db, 'stats', uid), clean(data), { merge: true });
  },
  async listStats() {
    const snap = await fs.getDocs(fs.collection(db, 'stats'));
    return snap.docs.map((d) => ({ ...d.data(), uid: d.id }));
  },
  /* painel do dono ao vivo: avisa a cada mudança em qualquer conta */
  watchStats(cb, onErr) {
    return fs.onSnapshot(fs.collection(db, 'stats'), (snap) => cb(snap.docs.map((d) => ({ ...d.data(), uid: d.id }))), onErr);
  },
  async getProfile(uid) {
    const s = await fs.getDoc(fs.doc(db, 'users', uid));
    return s.exists() ? s.data() : null;
  },
  saveProfile(uid, data) {
    return fs.setDoc(fs.doc(db, 'users', uid), clean(data), { merge: true });
  },
  idToken: () => (auth.currentUser ? auth.currentUser.getIdToken() : null),
  /* ---------- agenda compartilhada (teams/{dono}) ---------- */
  async getTeam(owner) {
    const s = await fs.getDoc(fs.doc(db, 'teams', owner));
    return s.exists() ? s.data() : null;
  },
  setTeam(owner, data) {
    return fs.setDoc(fs.doc(db, 'teams', owner), clean(data), { merge: true });
  },
  /* Convites: invites/{token} (uso único, expira) */
  async getInvite(token) {
    const s = await fs.getDoc(fs.doc(db, 'invites', token));
    return s.exists() ? s.data() : null;
  },
  createInvite(token, data) {
    return fs.setDoc(fs.doc(db, 'invites', token), clean(data));
  },
  deleteInvite(token) {
    return fs.deleteDoc(fs.doc(db, 'invites', token));
  },
  async listInvites(owner) {
    const snap = await fs.getDocs(fs.query(fs.collection(db, 'invites'), fs.where('owner', '==', owner)));
    return snap.docs.map((d) => ({ ...d.data(), id: d.id })).sort((a, b) => b.createdAt - a.createdAt);
  },
  watchTeam(owner, cb) {
    return fs.onSnapshot(fs.doc(db, 'teams', owner), (s) => cb(s.exists() ? s.data() : null), () => cb(null));
  },
  /* Convidado entra, tudo de uma vez: gasta o convite (uso único), registra a entrada e se acrescenta na equipe.
     As regras do Firebase conferem o convite, a validade, se a agenda está ativa e se ainda há vaga. */
  async joinTeam(owner, token, person) {
    const me = auth.currentUser.uid;
    const now = Date.now();
    const batch = fs.writeBatch(db);
    batch.update(fs.doc(db, 'invites', token), { used: true, usedBy: me, usedAt: now });
    batch.set(fs.doc(db, 'teams', owner, 'joins', me), { token, ...clean(person), at: now });
    batch.update(fs.doc(db, 'teams', owner), { members: fs.arrayUnion(me), [`names.${me}`]: clean(person) });
    await batch.commit();
  },
  /* Nível de conquistas no placar da equipe: o dono grava no próprio documento; o convidado só no próprio nome */
  async setMyTeamLevel(owner, uid, level, vip = false) {
    const lv = Math.max(0, Math.min(100, Math.round(Number(level) || 0)));
    if (!owner || owner === uid) {
      const s = await fs.getDoc(fs.doc(db, 'teams', uid));
      if (s.exists()) await fs.updateDoc(fs.doc(db, 'teams', uid), { ownerLevel: lv, ownerVip: !!vip });
      return;
    }
    await fs.updateDoc(fs.doc(db, 'teams', owner), { [`names.${uid}.level`]: lv, [`names.${uid}.vip`]: !!vip });
  },
  /* convidado: mantém o próprio nome e foto atualizados na lista de quem participa */
  async setMyTeamCard(owner, uid, card) {
    const up = {};
    for (const k of ['name', 'color', 'photo']) if (card[k]) up[`names.${uid}.${k}`] = card[k];
    if (Object.keys(up).length) await fs.updateDoc(fs.doc(db, 'teams', owner), up);
  },
  /* ---------- excluir conta (LGPD) ---------- */
  async deleteTeam(owner) {
    const joins = await fs.getDocs(fs.collection(db, 'teams', owner, 'joins')).catch(() => null);
    if (joins) await Promise.all(joins.docs.map((d) => fs.deleteDoc(d.ref).catch(() => {})));
    await fs.deleteDoc(fs.doc(db, 'teams', owner)).catch(() => {});
  },
  /* única exclusão direta do app: a conta que a própria pessoa mandou apagar (senha conferida há menos de 10 min) */
  async contaLe() {
    const u = auth.currentUser, out = [];
    for (const p of [...['events', 'companies', 'notes', 'settings'].map((c) => ['ws', u.uid, c]), ['pessoal', u.uid, 'itens']]) { const snap = await fs.getDocs(fs.collection(db, ...p)); snap.docs.forEach((d) => out.push({ path: [...p, d.id], data: d.data() })); }
    return out;
  },
  async contaMarca(on) { const u = auth.currentUser; await fs.setDoc(fs.doc(db, 'users', u.uid), { accountDeletion: on ? { at: fs.serverTimestamp() } : null }, { merge: true }); },
  async contaApaga(lista) { await emLotes(lista, 100, (bt, x) => bt.delete(fs.doc(db, ...x.path))); },
  async contaRepoe(lista) { await emLotes(lista, 100, (bt, x) => bt.set(fs.doc(db, ...x.path), x.data)); },
  async deleteOwnDocs(uid) {
    await fs.deleteDoc(fs.doc(db, 'stats', uid)).catch(() => {});
    await fs.deleteDoc(fs.doc(db, 'users', uid));
  },
  /* Sai da equipe (o próprio convidado) ou tira alguém (o dono) */
  async leaveTeam(owner, uid) {
    await fs.updateDoc(fs.doc(db, 'teams', owner), { members: fs.arrayRemove(uid), [`names.${uid}`]: fs.deleteField() });
    await fs.deleteDoc(fs.doc(db, 'teams', owner, 'joins', uid)).catch(() => {});
  },
  /* Pergunta ao assistente (Claude) no servidor */
  async ask(question, history) {
    const call = fnMod.httpsCallable(functions, 'perguntar', { timeout: 70000 });
    const res = await call({ question, history });
    return res.data.answer;
  },
  async subscribe(cols, onData, onErr) {
    while (subs.length) subs.pop().stop(); // trocou de agenda: para as anteriores
    const started = cols.map((c) => { const s = syncCollection([...base, c], (list) => onData(c, list), onErr); subs.push(s); return s.ready; });
    await Promise.all(started);
  },
  /* Agenda pessoal: pessoal/{uid}/itens — só o dono acessa */
  subscribePersonal(onData, onErr) {
    const u = auth.currentUser;
    if (!u) return () => {};
    const s = syncCollection(['pessoal', u.uid, 'itens'], onData, onErr);
    return s.stop;
  },
  writePersonal(item) {
    const path = ['pessoal', auth.currentUser.uid, 'itens'], g = campos(path, item), en = entrada(path, item, live.get(liveKey(path))?.docs.get(item.id));
    localApply(path, item.id, item);
    return comFila([en], () => fs.setDoc(fs.doc(db, ...path, item.id), ...g));
  },
  /* lixeira: marca (ou tira a marca) sem tocar no conteúdo */
  markPersonal(ids, marca) {
    const path = ['pessoal', auth.currentUser.uid, 'itens'];
    for (const id of ids) localApply(path, id, marca);
    return comFila(ids.map((id) => ({ k: [...path, id].join('/'), por: clean(marca), tira: [], novo: false })), () => emLotes(ids, 400, (bt, id) => bt.set(fs.doc(db, ...path, id), ...marcaEm(marca))));
  },
  write(name, item) {
    const path = [...base, name], g = campos(path, item), en = entrada(path, item, live.get(liveKey(path))?.docs.get(item.id)), r = ref(name, item.id);
    localApply(path, item.id, item);
    return comFila([en], () => fs.setDoc(r, ...g));
  },
  async writeMany(ops) {
    // até 400 por lote (cada item gravado uma vez só)
    const en = [], L = ops.map(({ col: name, item }) => { const g = campos([...base, name], item); en.push(entrada([...base, name], item, live.get(liveKey([...base, name]))?.docs.get(item.id))); localApply([...base, name], item.id, item); return [ref(name, item.id), g]; });
    await comFila(en, () => emLotes(L, 400, (bt, [r, g]) => bt.set(r, ...g)));
  },
  async mark(name, ids, marca) {
    for (const id of ids) localApply([...base, name], id, marca);
    const path = [...base, name]; await comFila(ids.map((id) => ({ k: [...path, id].join('/'), por: clean(marca), tira: [], novo: false })), () => emLotes(ids, 400, (bt, id) => bt.set(fs.doc(db, ...path, id), ...marcaEm(marca))));
  },
  /* passadas as 24 h: apaga de vez o que já venceu. Usa a hora do SERVIDOR (última gravação vista), não a do celular;
     a regra do banco confere de novo e recusa antes da hora. */
  async purga(cols) {
    const u = auth.currentUser; if (!u) return 0;
    let n = 0;
    const paths = [...(cols || []).map((c) => [...base, c]), ['pessoal', u.uid, 'itens']];
    for (const p of paths) {
      const l = live.get(liveKey(p)); if (!l) continue;
      const h = Math.min(l.hora() || 0, Date.now()), ids = [...l.docs.values()].filter((d) => vencido(d, h) && d.purgeAt - d.deletedAt >= 24 * 36e5).map((d) => d.id).slice(0, 200);
      if (!ids.length) continue;
      try { await emLotes(ids, 100, (bt, id) => bt.delete(fs.doc(db, ...p, id))); n += ids.length; } catch (e) { console.warn('purga', e.code || e.message); }
    }
    if (n) fs.setDoc(fs.doc(db, 'stats', u.uid), { purged: fs.increment(n) }, { merge: true }).catch(() => {});
    return n;
  },
  /* sair da conta: apaga a agenda guardada neste celular */
  clearLocal: () => idb.clear().catch(() => {}),
  async getDoc(path) {
    const s = await fs.getDoc(fs.doc(db, path));
    return s.exists() ? s.data() : null;
  },
  publish(token, payload) {
    return fs.setDoc(fs.doc(db, 'public', token), clean(payload));
  },
  unpublish(token) {
    return fs.deleteDoc(fs.doc(db, 'public', token));
  },
};

/* Convite antes do login: só o nome de quem convidou (quem tem o link lê; ninguém lista) */
export async function fetchInvite(config, token) {
  if (useEmulator()) config = { ...config, projectId: 'demo-calendario' };
  const f = fsMod;
  const app = appMod.getApps().find((a) => a.name === 'convite') || appMod.initializeApp(config, 'convite');
  const d = f.getFirestore(app);
  if (useEmulator() && !d._emu) { f.connectFirestoreEmulator(d, '127.0.0.1', 8085); d._emu = true; }
  const snap = await f.getDoc(f.doc(d, 'invites', token));
  return snap.exists() ? snap.data() : null;
}

/* Leitura pública (tela do cliente) — não exige login */
export async function fetchPublic(config, token) {
  if (useEmulator()) config = { ...config, projectId: 'demo-calendario' };
  const f = fsMod;
  const app = appMod.initializeApp(config, 'public');
  const d = f.getFirestore(app);
  if (useEmulator()) f.connectFirestoreEmulator(d, '127.0.0.1', 8085);
  const snap = await f.getDoc(f.doc(d, 'public', token));
  return snap.exists() ? snap.data() : null;
}
