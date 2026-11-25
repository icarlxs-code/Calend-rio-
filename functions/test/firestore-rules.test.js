/* Regras do Firestore no emulador. Sem emulador, pula.
   Rodar: firebase emulators:exec --only firestore --project demo-regras "node --test functions/test/firestore-rules.test.js" (RULES_LIB = pasta com @firebase/rules-unit-testing) */
import { test } from 'node:test';
import fs from 'node:fs';
import { createRequire } from 'node:module';
const pular = !process.env.FIRESTORE_EMULATOR_HOST || !process.env.RULES_LIB;
test('regras', { skip: pular && 'sem emulador' }, async (t) => {
  const req = createRequire(process.env.RULES_LIB + '/package.json'), { initializeTestEnvironment, assertSucceeds: sim, assertFails: nao } = req('@firebase/rules-unit-testing'), F = req('firebase/firestore');
  const env = await initializeTestEnvironment({ projectId: 'demo-regras', firestore: { rules: fs.readFileSync(new URL('../../firestore.rules', import.meta.url), 'utf8') } });
  const A = env.authenticatedContext('ana', { email: 'ana@x.com', auth_time: Math.floor(Date.now() / 1000) }).firestore(), B = env.authenticatedContext('bia', { email: 'bia@x.com' }).firestore(), C = env.authenticatedContext('cic', { email: 'cic@x.com' }).firestore(), T = env.authenticatedContext('hen', { email: 'icarlxs@gmail.com' }).firestore();
  const H = 36e5, IT = { title: 'T', date: '2027-01-01', description: 'd' }, marca = (u, at = Date.now()) => ({ deletedAt: at, deletedBy: u, deletedVia: 'manual', deleteBatch: 'l', purgeAt: at + 24 * H });
  const poe = (p, d) => env.withSecurityRulesDisabled((c) => F.setDoc(F.doc(c.firestore(), p), d));
  await poe('teams/ana', { active: true, members: ['bia'] });
  const CASOS = [['ws/ana/events/', A, 'ana'], ['ws/ana/notes/', A, 'ana'], ['ws/ana/companies/', A, 'ana'], ['ws/ana/settings/', A, 'ana'], ['pessoal/ana/itens/', A, 'ana'], ['events/', T, 'hen'], ['notes/', T, 'hen'], ['companies/', T, 'hen'], ['settings/', T, 'hen'], ['ws/ana/events/eq', B, 'bia']];
  for (const [p, db, u] of CASOS) await t.test(p + u, async () => {
    const r = (x) => F.doc(db, p + x), full = (x) => p + x;
    await sim(F.setDoc(r('a'), IT)); await nao(F.deleteDoc(r('a'))); await nao(F.setDoc(r('a'), { _del: true })); await nao(F.setDoc(r('z'), { _del: true })); await nao(F.setDoc(r('y'), { ...IT, ...marca(u) }));
    await sim(F.setDoc(r('a'), { title: 'T2' }, { merge: true })); await nao(F.setDoc(r('a'), { date: '2027-01-01' })); // tirou o título
    await nao(F.setDoc(r('a'), marca('outra'), { merge: true })); await nao(F.setDoc(r('a'), { ...marca(u), purgeAt: Date.now() + 1000 }, { merge: true })); await nao(F.setDoc(r('a'), marca(u, Date.now() + 5 * H), { merge: true }));
    await sim(F.setDoc(r('a'), marca(u), { merge: true })); await nao(F.deleteDoc(r('a')));
    await nao(F.setDoc(r('a'), IT)); // gravação inteira de aparelho antigo não ressuscita
    await sim(F.setDoc(r('a'), { description: 'nova' }, { merge: true })); await nao(F.setDoc(r('a'), { purgeAt: 1 }, { merge: true })); await nao(F.setDoc(r('a'), { _del: true }));
    await sim(F.setDoc(r('a'), { deletedAt: null, deletedBy: null, purgeAt: null, deletedVia: null, deleteBatch: null, restoredAt: 1 }, { merge: true })); await nao(F.deleteDoc(r('a')));
    await poe(full('v'), { ...IT, ...marca(u, Date.now() - 25 * H) }); await sim(F.deleteDoc(r('v'))); await poe(full('q'), { ...IT, ...marca(u, Date.now() - 23 * H) }); await nao(F.deleteDoc(r('q'))); await poe(full('f'), { ...IT, deletedAt: Date.now() - 2 * H, purgeAt: Date.now() - H }); await nao(F.deleteDoc(r('f')));
  });
  await t.test('estranho não lê nem apaga', async () => { await poe('ws/ana/events/x', IT); await nao(F.getDoc(F.doc(C, 'ws/ana/events/x'))); await nao(F.deleteDoc(F.doc(C, 'ws/ana/events/x'))); await nao(F.setDoc(F.doc(C, 'ws/ana/events/x'), marca('cic'), { merge: true })); });
  await t.test('excluir a conta: só a dona, com marca e login recentes', async () => {
    await poe('ws/ana/events/k', IT); await poe('pessoal/ana/itens/k', IT); await nao(F.deleteDoc(F.doc(A, 'ws/ana/events/k'))); await sim(F.setDoc(F.doc(A, 'users/ana'), { accountDeletion: { at: F.serverTimestamp() } }, { merge: true })); await nao(F.deleteDoc(F.doc(B, 'ws/ana/events/k'))); await sim(F.deleteDoc(F.doc(A, 'ws/ana/events/k'))); await sim(F.deleteDoc(F.doc(A, 'pessoal/ana/itens/k')));
    await poe('ws/ana/events/k2', IT); const V = env.authenticatedContext('ana', { email: 'ana@x.com', auth_time: Math.floor(Date.now() / 1000) - 3600 }).firestore(); await nao(F.deleteDoc(F.doc(V, 'ws/ana/events/k2'))); await poe('users/ana', { accountDeletion: { at: F.Timestamp.fromMillis(Date.now() - 2 * H) } }); await nao(F.deleteDoc(F.doc(A, 'ws/ana/events/k2')));
  });
  await env.cleanup();
});
