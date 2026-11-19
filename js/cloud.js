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
      return cred;
    },
    backend,
  };
}

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
