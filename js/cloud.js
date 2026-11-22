/* Sincronização na nuvem (Firebase Firestore + login por e-mail).
   Só é carregado quando CONFIG.firebase estiver preenchido. */
/* O Firebase vem embutido no próprio app (sem baixar de outro servidor ao abrir). */
import * as appMod from 'firebase/app';
import * as fsMod from 'firebase/firestore';
import * as authMod from 'firebase/auth';
import * as fnMod from 'firebase/functions';
import { CONFIG } from '../config.js';

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
    signOut: () => authApi.signOut(auth),
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
  phoneStart, phoneFinish, setPassword,
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
    for (let i = 0; i < items.length; i += 400) {
      const batch = fs.writeBatch(db);
      for (const it of items.slice(i, i + 400)) batch.set(fs.doc(db, 'ws', uid, name, it.id), clean(it));
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
  /* ---------- excluir conta (LGPD) ---------- */
  async deleteTeam(owner) {
    const joins = await fs.getDocs(fs.collection(db, 'teams', owner, 'joins')).catch(() => null);
    if (joins) await Promise.all(joins.docs.map((d) => fs.deleteDoc(d.ref).catch(() => {})));
    await fs.deleteDoc(fs.doc(db, 'teams', owner)).catch(() => {});
  },
  async deletePersonal() {
    const u = auth.currentUser;
    const snap = await fs.getDocs(fs.collection(db, 'pessoal', u.uid, 'itens'));
    for (let i = 0; i < snap.docs.length; i += 400) {
      const batch = fs.writeBatch(db);
      snap.docs.slice(i, i + 400).forEach((d) => batch.delete(d.ref));
      await batch.commit();
    }
  },
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
    await Promise.all(
      cols.map(
        (c) =>
          new Promise((resolve) => {
            let first = true;
            fs.onSnapshot(
              col(c),
              (snap) => {
                onData(c, snap.docs.map((d) => ({ ...d.data(), id: d.id })));
                if (first) { first = false; resolve(); }
              },
              (err) => {
                console.error('Firestore', c, err);
                onErr && onErr(err);
                if (first) { first = false; resolve(); }
              },
            );
          }),
      ),
    );
  },
  /* Agenda pessoal: pessoal/{uid}/itens — só o dono acessa */
  subscribePersonal(onData, onErr) {
    const u = auth.currentUser;
    if (!u) return () => {};
    return fs.onSnapshot(fs.collection(db, 'pessoal', u.uid, 'itens'), (s) => onData(s.docs.map((d) => ({ ...d.data(), id: d.id }))), onErr);
  },
  writePersonal(item) {
    return fs.setDoc(fs.doc(db, 'pessoal', auth.currentUser.uid, 'itens', item.id), clean(item));
  },
  delPersonal(id) {
    return fs.deleteDoc(fs.doc(db, 'pessoal', auth.currentUser.uid, 'itens', id));
  },
  write(name, item) {
    return fs.setDoc(ref(name, item.id), clean(item));
  },
  async writeMany(ops) {
    for (let i = 0; i < ops.length; i += 400) {
      const batch = fs.writeBatch(db);
      ops.slice(i, i + 400).forEach(({ col: name, item }) => batch.set(ref(name, item.id), clean(item)));
      await batch.commit();
    }
  },
  del(name, id) {
    return fs.deleteDoc(ref(name, id));
  },
  async delMany(name, ids) {
    for (let i = 0; i < ids.length; i += 400) {
      const batch = fs.writeBatch(db);
      ids.slice(i, i + 400).forEach((id) => batch.delete(ref(name, id)));
      await batch.commit();
    }
  },
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
