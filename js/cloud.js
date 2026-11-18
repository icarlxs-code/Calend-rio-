/* Sincronização na nuvem (Firebase Firestore + login por e-mail).
   Só é carregado quando CONFIG.firebase estiver preenchido. */
/* O Firebase vem embutido no próprio app (sem baixar de outro servidor ao abrir). */
import * as appMod from 'firebase/app';
import * as fsMod from 'firebase/firestore';
import * as authMod from 'firebase/auth';

let fs, auth, db, authApi;

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
  return {
    onUser: (cb) => authApi.onAuthStateChanged(auth, cb),
    signIn: (email, pass) => authApi.signInWithEmailAndPassword(auth, email, pass),
    resetPassword: (email) => authApi.sendPasswordResetEmail(auth, email),
    signOut: () => authApi.signOut(auth),
    backend,
  };
}

const clean = (obj) => JSON.parse(JSON.stringify(obj)); // remove undefined

const backend = {
  async subscribe(cols, onData, onErr) {
    await Promise.all(
      cols.map(
        (col) =>
          new Promise((resolve) => {
            let first = true;
            fs.onSnapshot(
              fs.collection(db, col),
              (snap) => {
                onData(col, snap.docs.map((d) => ({ ...d.data(), id: d.id })));
                if (first) { first = false; resolve(); }
              },
              (err) => {
                console.error('Firestore', col, err);
                onErr && onErr(err);
                if (first) { first = false; resolve(); }
              },
            );
          }),
      ),
    );
  },
  write(col, item) {
    return fs.setDoc(fs.doc(db, col, item.id), clean(item));
  },
  async writeMany(ops) {
    for (let i = 0; i < ops.length; i += 400) {
      const batch = fs.writeBatch(db);
      ops.slice(i, i + 400).forEach(({ col, item }) => batch.set(fs.doc(db, col, item.id), clean(item)));
      await batch.commit();
    }
  },
  del(col, id) {
    return fs.deleteDoc(fs.doc(db, col, id));
  },
  async delMany(col, ids) {
    for (let i = 0; i < ids.length; i += 400) {
      const batch = fs.writeBatch(db);
      ids.slice(i, i + 400).forEach((id) => batch.delete(fs.doc(db, col, id)));
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
