/* Sincronização na nuvem (Firebase Firestore + login por e-mail).
   Só é carregado quando CONFIG.firebase estiver preenchido. */
const V = '10.14.1';
const BASE = `https://www.gstatic.com/firebasejs/${V}`;

let fs, auth, db, authApi;

export async function connect(config) {
  const appMod = await import(`${BASE}/firebase-app.js`);
  fs = await import(`${BASE}/firebase-firestore.js`);
  authApi = await import(`${BASE}/firebase-auth.js`);
  const app = appMod.initializeApp(config);
  try {
    db = fs.initializeFirestore(app, {
      localCache: fs.persistentLocalCache({ tabManager: fs.persistentMultipleTabManager() }),
    });
  } catch {
    db = fs.getFirestore(app);
  }
  auth = authApi.getAuth(app);
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
  const appMod = await import(`${BASE}/firebase-app.js`);
  const f = await import(`${BASE}/firebase-firestore.js`);
  const app = appMod.initializeApp(config, 'public');
  const d = f.getFirestore(app);
  const snap = await f.getDoc(f.doc(d, 'public', token));
  return snap.exists() ? snap.data() : null;
}
