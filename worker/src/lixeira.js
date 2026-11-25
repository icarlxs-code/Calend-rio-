/* Passadas as 24 h, apaga de vez o que a PESSOA mandou para a lixeira. Roda no Worker (sem custo), de hora em hora.
   Só funciona com a credencial de serviço do Firebase (segredo FIREBASE_SA); sem ela não faz nada.
   Nunca apaga documento sem "deletedAt", antes da hora, ou que mudou (foi restaurado) entre ler e apagar. */
const COLS = ['events', 'notes', 'companies', 'settings', 'itens'];
const DIA = 24 * 36e5;
const b64u = (x) => btoa(typeof x === 'string' ? x : String.fromCharCode(...new Uint8Array(x))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
let cache = null;
async function token(sa, now) {
  if (cache && cache.ate > now + 60e3) return cache.t;
  const s = Math.floor(now / 1000), cab = b64u(JSON.stringify({ alg: 'RS256', typ: 'JWT' })), corpo = b64u(JSON.stringify({ iss: sa.client_email, scope: 'https://www.googleapis.com/auth/datastore', aud: 'https://oauth2.googleapis.com/token', iat: s, exp: s + 3600 }));
  const der = Uint8Array.from(atob(sa.private_key.replace(/-----[^-]+-----|\s/g, '')), (c) => c.charCodeAt(0));
  const key = await crypto.subtle.importKey('pkcs8', der, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(`${cab}.${corpo}`));
  const r = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${cab}.${corpo}.${b64u(sig)}` });
  const j = await r.json(); if (!j.access_token) throw new Error('credencial recusada');
  cache = { t: j.access_token, ate: now + (j.expires_in || 3600) * 1000 }; return cache.t;
}
const num = (v) => (v && v.integerValue !== undefined ? Number(v.integerValue) : v && typeof v.doubleValue === 'number' ? v.doubleValue : NaN);
/** pode mesmo apagar este documento? */
export function podePurgar(doc, now) {
  const f = (doc && doc.fields) || {}, d = num(f.deletedAt), p = num(f.purgeAt);
  return Number.isFinite(d) && Number.isFinite(p) && d > 0 && p - d >= DIA && p <= now && !!doc.updateTime
    && /\/documents\/((ws\/[^/]+\/)?(events|notes|companies|settings)\/[^/]+|pessoal\/[^/]+\/itens\/[^/]+)$/.test(doc.name || '');
}
export async function purgaLixeira(env, now = Date.now(), { max = 60, pega = fetch, tk = null } = {}) {
  if (!env.FIREBASE_SA || !env.PROJECT_ID) return { parou: 'sem credencial' };
  const key = 'lixeira:ult', ult = Number(await env.CAL.get(key)) || 0;
  if (now - ult < 36e5 - 30e3) return { parou: 'cedo' };
  await env.CAL.put(key, String(now));
  const t = tk || (await token(JSON.parse(env.FIREBASE_SA), now)), base = `https://firestore.googleapis.com/v1/projects/${env.PROJECT_ID}/databases/(default)/documents`, H = { Authorization: `Bearer ${t}`, 'Content-Type': 'application/json' };
  let n = 0;
  for (const col of COLS) {
    if (n >= max) break;
    const r = await pega(`${base}:runQuery`, { method: 'POST', headers: H, body: JSON.stringify({ structuredQuery: { from: [{ collectionId: col, allDescendants: true }], where: { fieldFilter: { field: { fieldPath: 'purgeAt' }, op: 'LESS_THAN', value: { integerValue: String(now) } } }, orderBy: [{ field: { fieldPath: 'purgeAt' } }], limit: Math.min(50, max - n) } }) });
    if (!r.ok) { console.log('lixeira', col, r.status); continue; }
    const docs = (await r.json()).map((x) => x.document).filter((d) => d && podePurgar(d, now)); // null = restaurado (não entra)
    for (const d of docs) { // um por um, com a versão lida: se a pessoa restaurou agora, o banco recusa
      const c = await pega(`${base}:commit`, { method: 'POST', headers: H, body: JSON.stringify({ writes: [{ delete: d.name, currentDocument: { updateTime: d.updateTime } }] }) });
      if (c.ok) n++;
    }
  }
  return { n };
}
