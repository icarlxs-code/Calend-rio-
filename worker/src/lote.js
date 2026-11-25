/* Lotes de frases escritas pela IA grátis, de madrugada, SEM nome nem dado de ninguém (só categoria, 2 assuntos e tom).
   Se a cota acabar ou a IA falhar, nada para: o banco de frases continua valendo. */
import { BANCO } from './vivo.js';
import { bloqueado, medico } from './filtro.js';
import { hashStr } from './mind.js';
import { achaRemedio } from '../../functions/remedios-lista.js';

const MODELO = '@cf/meta/llama-3.1-8b-instruct-fp8-fast';
export const TETO = 3000; // neurônios por dia só para os lotes
const POR_NOITE = 10, MAX_CAT = 120, RATE = [0.0041, 0.035];
const CATS = { // só categorias em que uma frase genérica é segura (nada de fé, remédio ou aniversário)
  agua: ['beber água', ['nome']], manha: ['dar bom dia', ['nome', 'diasemana']], noite: ['dar boa noite', ['nome']], motivacao: ['animar a pessoa', ['nome']],
  socializar: ['lembrar de falar com alguém querido', []], estudo: ['estudar um pouco', ['nome']], trabalho: ['organizar o trabalho', ['nome']], contas: ['cuidar das contas no prazo', []],
};
const ASSUNTOS = 'leitura esporte corrida musica cozinhar series games natureza viagem arte danca pets moda estudar amigos familia meditacao jardinagem voluntariado procrastinador organizado perfeccionista competitivo sonhador ansiedade autoestima foco disciplina gratidao descanso'.split(' ');
const TONS = ['carinhoso', 'firme', 'direto', 'trocadilho', 'leve'];
const FE = /\bdeus\b|jesus|cristo|senhor\b|b[ií]blia|ora[cç][aã]o|\borar\b|\brez|igreja|\bf[eé]\b|aben[cç]|\bsanto|\bmilagre|\bpecad|\banjo|amém|amen\b|al[aá]\b|buda|orix/i;
const INGLES = /\b(the|and|your|you|with|drink|water|day|good)\b/i;
const palavras = (t) => new Set(String(t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\{\w+\}/g, ' ').split(/[^a-z0-9]+/).filter((x) => x.length > 2));
/** 0 = igual, 1 = nada em comum */
export function diferenca(A, B) { if (!A.size || !B.size) return 1; let n = 0; for (const x of A) if (B.has(x)) n++; return 1 - (2 * n) / (A.size + B.size); }
/** passa no filtro? devolve a frase limpa ou '' */
export function peneira(texto, cat, existentes = []) {
  const t = String(texto || '').replace(/^\s*(?:\d+[.)-]|[-•*])\s*/, '').replace(/^["“'']+|["”'']+$/g, '').replace(/\s+/g, ' ').trim();
  if (t.length < 18 || t.length > 140 || /["“”<>#*_[\]|\\]|https?:|@/.test(t)) return '';
  const ok = CATS[cat] ? CATS[cat][1] : [];
  for (const m of t.matchAll(/\{([^}]*)\}/g)) if (!ok.includes(m[1])) return '';
  if (/[{}]/.test(t.replace(/\{\w+\}/g, '')) || /\([oa]\)|\/a\b/.test(t)) return '';
  if (bloqueado(t) || medico(t) || achaRemedio(t) || FE.test(t) || INGLES.test(t) || /rem[eé]dio|comprimido|m[eé]dico/i.test(t)) return '';
  const P = palavras(t); if (P.size < 3) return '';
  for (const E of existentes) if (diferenca(P, E) <= 0.35) return '';
  return t;
}

/* ---------- tabela "frases" no Hub (SQLite) ---------- */
export function makeFrases(sql, meter = {}) {
  sql.exec('CREATE TABLE IF NOT EXISTS frases (id TEXT PRIMARY KEY, cat TEXT NOT NULL, texto TEXT NOT NULL, tom TEXT, tags TEXT, hora TEXT, origem TEXT NOT NULL, ativo INTEGER NOT NULL DEFAULT 1, queixas INTEGER NOT NULL DEFAULT 0, at INTEGER NOT NULL)');
  sql.exec('CREATE TABLE IF NOT EXISTS frases_queixa (id TEXT NOT NULL, quem TEXT NOT NULL, at INTEGER NOT NULL, PRIMARY KEY (id, quem))');
  const w = (n = 1) => { meter.rowsWritten = (meter.rowsWritten || 0) + n; };
  let mem = null; const limpa = () => { mem = null; };
  const todas = () => sql.exec('SELECT * FROM frases').toArray();
  return {
    /** o que o motor usa: frases extras ativas e as desligadas */
    atual() {
      if (mem) return mem;
      const extra = {}, off = new Set(); for (const f of todas()) { if (!f.ativo) off.add(f.id); else if (f.origem === 'ia') (extra[f.cat] = extra[f.cat] || []).push({ id: f.id, texto: f.texto, tom: f.tom, tags: JSON.parse(f.tags || '[]'), hora: f.hora || 'qualquer', dia: null }); }
      return (mem = { extra, off });
    },
    nova(cat, texto, tom, tags, now) { const id = `ia-${cat}-${hashStr(texto).toString(36)}`; if (sql.exec('SELECT id FROM frases WHERE id = ?', id).toArray().length) return false; sql.exec("INSERT INTO frases (id, cat, texto, tom, tags, hora, origem, ativo, queixas, at) VALUES (?, ?, ?, ?, ?, 'qualquer', 'ia', 1, 0, ?)", id, cat, texto, tom, JSON.stringify(tags), now); w(); limpa(); return true; },
    conta(cat) { return sql.exec("SELECT COUNT(*) AS n FROM frases WHERE cat = ? AND origem = 'ia' AND ativo = 1", cat).toArray()[0].n; },
    /** 3 pessoas diferentes dizendo "não curti" desligam a frase para todo mundo */
    queixa(id, quem, now) {
      const s = semente(id), ja = sql.exec('SELECT * FROM frases WHERE id = ?', id).toArray()[0];
      if (!ja && !s) return null;
      if (sql.exec('SELECT id FROM frases_queixa WHERE id = ? AND quem = ?', id, quem).toArray().length) return { queixas: ja ? ja.queixas : 0, ativo: !ja || !!ja.ativo, repetida: true };
      sql.exec('INSERT INTO frases_queixa (id, quem, at) VALUES (?, ?, ?)', id, quem, now); w();
      if (!ja) { sql.exec("INSERT INTO frases (id, cat, texto, tom, tags, hora, origem, ativo, queixas, at) VALUES (?, ?, ?, '', '[]', 'qualquer', 'semente', 1, 0, ?)", id, s.cat, s.texto, now); w(); }
      const q = (ja ? ja.queixas : 0) + 1, ativo = q >= 3 ? 0 : ja ? ja.ativo : 1; sql.exec('UPDATE frases SET queixas = ?, ativo = ? WHERE id = ?', q, ativo, id); w(); limpa();
      return { queixas: q, ativo: !!ativo };
    },
    apagaPessoa(quem) { sql.exec('DELETE FROM frases_queixa WHERE quem = ?', quem); w(); },
    /** guarda espaço: tira frases da IA desligadas há mais de 60 dias */
    limpa(now) { sql.exec("DELETE FROM frases WHERE origem = 'ia' AND ativo = 0 AND at < ?", now - 60 * 864e5); limpa(); },
  };
}
/* a frase existe no banco (ou é uma combinação válida da gramática)? */
let IDX = null;
export function semente(id) {
  if (!IDX) { IDX = new Map(); for (const [cat, L] of Object.entries(BANCO.categorias)) for (const f of L) IDX.set(f.id, { cat, texto: f.texto }); }
  if (IDX.has(id)) return IDX.get(id);
  const m = /^([a-z]+)-g-a(\d{1,2})n(\d{1,2})f(\d{1,2})$/.exec(id), g = m && BANCO.gramaticas[m[1]];
  return g && g.abertura[+m[2]] !== undefined && g.nucleo[+m[3]] !== undefined && g.fecho[+m[4]] !== undefined ? { cat: m[1], texto: `${g.abertura[+m[2]]} ${g.nucleo[+m[3]]}. ${g.fecho[+m[4]]}` } : null;
}

/* ---------- a madrugada ---------- */
/** as combinações da noite: mudam todo dia e dão a volta em tudo */
export function plano(dia, n = POR_NOITE) {
  const cats = Object.keys(CATS), d = Math.floor(Date.parse(`${dia}T12:00:00Z`) / 864e5), out = [];
  for (let i = 0; i < n; i++) { const k = d * n + i, a = ASSUNTOS[(k * 7) % ASSUNTOS.length], b = ASSUNTOS[(k * 11 + 3) % ASSUNTOS.length]; out.push({ cat: cats[k % cats.length], tags: a === b ? [a] : [a, b], tom: TONS[(k + Math.floor(k / cats.length)) % TONS.length] }); }
  return out;
}
export function pedido({ cat, tags, tom }) {
  const [o, slots] = CATS[cat];
  return [{ role: 'system', content: 'Você escreve notificações curtas de celular em português do Brasil para o Lembra, um sininho simpático e bem-humorado. Escreva sempre sem marcar gênero. Nunca cite religião, política, remédio, doença, aposta, marca ou pessoa.' },
    { role: 'user', content: `Escreva 20 frases diferentes para ${o}. Tom: ${tom}. Assuntos de que a pessoa gosta: ${tags.join(' e ')}. Cada frase com 40 a 120 caracteres, no máximo 1 emoji, sem aspas.${slots.length ? ` Se quiser, use ${slots.map((s) => `{${s}}`).join(' ou ')} (o app troca depois).` : ' Não use chaves.'} Varie muito: perguntas, trocadilhos, desafios, imagens concretas. Uma frase por linha, sem numerar.` }];
}
/** um lote por minuto, das 3h às 5h (horário do Brasil), até o teto. Nunca lança erro. */
export async function loteDiario(env, now = Date.now()) {
  const br = new Date(now - 3 * 36e5), h = br.getUTCHours(), dia = br.toISOString().slice(0, 10);
  if (h < 3 || h >= 5 || !env.AI || !env.FRASES) return { parou: 'fora' };
  const key = `lote:${dia}`, st = (await env.CAL.get(key, 'json')) || { i: 0, n: 0, novas: 0 };
  const L = plano(dia); if (st.fim || st.i >= L.length) return { parou: 'pronto', ...st };
  if (st.n >= TETO) return { parou: 'teto', ...st };
  if (st.i === 0) env.FRASES.limpa(now);
  const c = L[st.i]; st.i++;
  await env.CAL.put(key, JSON.stringify(st), { expirationTtl: 3 * 86400 }); // conta antes: se cair no meio, não repete
  if (env.FRASES.conta(c.cat) >= MAX_CAT) return { parou: 'cheia', ...st };
  const msgs = pedido(c), ent = JSON.stringify(msgs).length / 3.5 * RATE[0];
  if (st.n + ent + 1400 * RATE[1] > TETO) { st.fim = 1; await env.CAL.put(key, JSON.stringify(st), { expirationTtl: 3 * 86400 }); return { parou: 'teto', ...st }; }
  let txt = '';
  try { const r = await (env.AI.para ? env.AI.para('lotes') : env.AI).run(MODELO, { messages: msgs, max_tokens: 1400, temperature: 0.95 }); txt = String(r?.response || ''); } catch (e) { console.log('lote', e.message); if (/limite/.test(e.message)) st.fim = 1; await env.CAL.put(key, JSON.stringify(st), { expirationTtl: 3 * 86400 }); return { parou: 'ia', ...st }; }
  st.n = Math.round(st.n + ent + (txt.length / 3.5) * RATE[1]);
  const ja = [...BANCO.categorias[c.cat].map((f) => f.texto), ...(env.FRASES.atual().extra[c.cat] || []).map((f) => f.texto)].map(palavras);
  let n = 0;
  for (const linha of txt.split('\n').slice(0, 30)) { const t = peneira(linha, c.cat, ja); if (t && env.FRASES.nova(c.cat, t, c.tom, c.tags, now)) { ja.push(palavras(t)); n++; } }
  st.novas += n;
  await env.CAL.put(key, JSON.stringify(st), { expirationTtl: 3 * 86400 });
  return { novas: n, ...st };
}
