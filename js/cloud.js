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

export async function connect(config) {
  if (useEmulator()) config = { ...config, projectId: 'demo-calendario' };
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
  if (useEmulator()) authApi.connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
  // e-mails do login (confirmação e "esqueci a senha") em português
  try { auth.languageCode = 'pt-BR'; } catch { /* ok */ }
  functions = fnMod.getFunctions(app, CONFIG.functionsRegion || 'southamerica-east1');
  if (useEmulator()) fnMod.connectFunctionsEmulator(functions, '127.0.0.1', 5001);
  return {
    onUser: (cb) => authApi.onAuthStateChanged(auth, cb),
    signIn: (email, pass) => authApi.signInWithEmailAndPassword(auth, email, pass),
    resetPassword: (email) => authApi.sendPasswordResetEmail(auth, email),
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

const backend = {
  setWorkspace(uid) { base = uid ? ['ws', uid] : []; },
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
