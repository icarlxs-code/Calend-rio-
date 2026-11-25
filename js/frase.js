/* Frase da notificação (motivacional, bíblica, cuidado, aniversário, viagem…): tocou no aviso → abre uma página
   com o Lembra vestido do assunto e a frase em cima, pronta para o story. A arte da tela é a mesma que sai na imagem. */
import { icon } from './icons.js';
import { esc, comUtm } from './utils.js';
import { toast, openSheet } from './components.js';
import { CONFIG } from '../config.js';
import { store } from './store.js';
import { podeSocial, call } from './social.js';
import { roupa } from './roupas.js';
import { sininho, alive, veste, rigDe, retrato } from './sininho.js';
import { receitaArte, FUNDO, CAT_DO_TEMA, hash, rng } from './receita.js';
import { pega, guarda, conta, apaga, limpaTudo } from './arte-cache.js';

const SITE = () => (CONFIG.siteUrl || 'https://meulembra.com.br/').replace(/^https?:\/\//, '').replace(/\/$/, '');
const LINK = () => comUtm(`${(CONFIG.siteUrl || 'https://meulembra.com.br/').replace(/\/?$/, '/')}conheca/`, 'story');
const HIST = 'lembra.frases';

/* separa a referência bíblica do texto: "… — Salmos 23:1" ou "… (Filipenses 4:13)" */
export function partes(body = '') {
  let t = String(body).trim(), ref = '';
  const m = t.match(/\s*[—–-]\s*([1-3]?\s?[A-ZÁÉÍÓÚÂÊÔÃÕÇ][\wÀ-ÿ]+(?:\s[\wÀ-ÿ]+)?\s\d+[:.]\d+(?:[-–]\d+)?)\s*\.?$/) || t.match(/\s*\(([1-3]?\s?[A-ZÁÉÍÓÚÂÊÔÃÕÇ][\wÀ-ÿ]+(?:\s[\wÀ-ÿ]+)?\s\d+[:.]\d+(?:[-–]\d+)?)\)\s*\.?$/);
  if (m) { ref = m[1].trim(); t = t.slice(0, m.index).trim(); }
  t = t.replace(/^["“]|["”]$/g, '').trim();
  return { texto: t, ref };
}
/* é frase (pra abrir no app)? compromissos e ranking continuam indo pra tela deles; aniversário ganha a página */
export const ehFrase = (n) => !!n && (!!n.remedio || !!(n.id && n.cat && n.body)) || !!n && !!n.body && (n.tag === 'p-amigo' || n.tag === 'coach' || n.tag === 'frase') && n.kind !== 'rank' && (n.kind !== 'agenda' || /anivers|🎂|🎁/i.test(`${n.title} ${n.body}`));

/* ---------- qual é o assunto? (primeiro o texto, depois o tipo do aviso) ---------- */
const TEMAS = [
  ['aniversario', /anivers|parab[eé]ns|\bniver\b|🎂|🎁/i], ['viagem', /viage|viajar|\bvoo\b|aeroporto|\bmala\b|f[eé]rias|praia|✈/i],
  ['fe', /\bdeus\b|senhor\b|jesus|cristo|b[ií]blia|ora[cç][aã]o|\borar\b|igreja|salmo|\bf[eé]\b|🙏|✝/i],
  ['pet', /cachorr|\bgat[oa]\b|\bpet\b|veterin|🐶|🐾|🐱/i], ['agua', /\b[aá]gua\b|hidrat|💧|🚰/i], ['comida', /almo[cç]|jantar|comer\b|refei[cç]|lanche|cozinh|receita|🍽|🍛/i],
  ['treino', /treino|academia|exerc[ií]cio|caminhad|corrida|correr\b|muscula|along|🏋|💪🏋/i], ['beleza', /cabel|barba|unha|sal[aã]o|visual|💈|💅/i], ['saude', /sa[uú]de|m[eé]dic|consulta|rem[eé]dio|exame|dentista|vacina|🩺|💊/i],
  ['sono', /dormir|\bsono\b|boa noite|descans|travesseiro|🌙|😴|💤/i], ['dinheiro', /dinheiro|boleto|conta de|pagar|fatura|econom|poupar|💸|💰/i], ['estudo', /estud|prova|livro|\bler\b|leitura|aprend|curso|faculdade|📚|🎓/i],
  ['compras', /mercado|compras|feira\b|🛒/i], ['obra', /\bobra\b|reforma|constru[cç]/i], ['amigos', /amig[oa]|mensagem pra|liga pra|ligar|chama algu|💬|☕/i],
  ['amor', /amor\b|fam[ií]lia|m[aã]e\b|\bpai\b|filh[oa]|abra[cç]|cora[cç][aã]o|carinho|❤|💜|🧡/i], ['calma', /respir|ansied|calma|pausa|ombro|medita|paz\b|🌿|🧘/i],
  ['conquista', /ofensiva|sequ[eê]ncia|dias seguidos|conquist|vit[oó]ria|venc|parab|🏆|🔥/i], ['trabalho', /trabalh|reuni[aã]o|cliente|empresa|projeto|meta\b|💼/i], ['manha', /bom dia|manh[aã]|caf[eé]|☀/i],
];
const POR_TIPO = { verse: 'fe', morning: 'manha', night: 'sono', water: 'agua', lunch: 'comida', dinner: 'comida', streak: 'conquista', social: 'amigos', selfcare: 'calma', habit: 'treino', checkin: 'trabalho', agenda: 'aniversario' };
export function temaDe(n) {
  if (n.kind === 'verse' || partes(n.body).ref) return 'fe';
  if (['water', 'lunch', 'streak', 'night'].includes(n.kind)) return POR_TIPO[n.kind];
  const t = `${n.title || ''} ${n.body || ''}`, a = TEMAS.find(([, re]) => re.test(t));
  return a ? a[0] : POR_TIPO[n.kind] || 'forca';
}

/* ---------- a arte (a mesma na tela e na imagem), sempre pela receita ---------- */
export const FORMATOS = { story: [1080, 1920], post: [1080, 1350] };
function linhas(c, texto, larg, eq = false) {
  const out = [];
  for (const par of texto.split(/\n+/)) { let l = ''; for (const w of par.split(/\s+/)) { const t = l ? `${l} ${w}` : w; if (c.measureText(t).width > larg && l) { out.push(l); l = w; } else l = t; } if (l) out.push(l); }
  // linhas equilibradas: a menor largura que mantém o mesmo número de linhas
  if (!eq && out.length > 1) { let a = larg * 0.5, b = larg; for (let i = 0; i < 9; i++) { const m = (a + b) / 2; linhas(c, texto, m, true).length <= out.length ? (b = m) : (a = m); } return linhas(c, texto, b, true); }
  return out;
}
const estrela = (c, x, y, r) => { c.beginPath(); for (let i = 0; i < 4; i++) { const a = (i * Math.PI) / 2 - Math.PI / 2, b = a + Math.PI / 4; c[i ? 'lineTo' : 'moveTo'](x + Math.cos(a) * r, y + Math.sin(a) * r); c.quadraticCurveTo(x, y, x + Math.cos(b + Math.PI / 4) * r, y + Math.sin(b + Math.PI / 4) * r); } c.fill(); };
const BLOBS = ['M-430 60C-470-120-380-300-210-270-110-252-60-320 40-390 170-480 350-440 380-290 400-190 330-150 350-40 366 50 450 90 430 210 406 340 270 360 130 350-40 338-190 380-320 320-420 274-418 150-430 60Z', 'M-400-90C-380-270-230-360-90-300 0-262 60-330 170-350 320-376 430-270 410-120 398-30 450 30 440 140 424 300 280 372 120 344 10 324-60 372-190 366-350 358-452 250-440 100-434 30-408-20-400-90Z'];
const imgs = new Map();
export function imagemDe(nome) { if (!imgs.has(nome)) imgs.set(nome, new Promise((ok) => { const i = new Image(); i.onload = () => (i.decode ? i.decode().then(() => ok(i), () => ok(i)) : ok(i)); i.onerror = () => { imgs.delete(nome); ok(null); }; i.src = `assets/stories/${nome}.webp`; })); return imgs.get(nome); }
/* parte parada: cenário, bolha de destaque, marca e frase. Devolve onde fica o boneco e onde brilha. */
export function pintaFundo(c, W, H, n, R, bg, { margem = 150, rodape = true } = {}) {
  const u = W / 1080, V = H / u, M = 80, P = R.paleta; c.save(); c.scale(u, u); // daqui em diante: 1080 de largura
  c.fillStyle = P.base; c.fillRect(0, 0, 1080, V);
  const bk = Math.max(1, V / 1920), by = (V - 1920 * bk) * (V < 1600 ? 0.45 : 0.75);
  if (bg) c.drawImage(bg, (1080 - 1080 * bk) / 2, by, 1080 * bk, 1920 * bk);
  // boneco: no mesmo lugar do projeto (y 1350, largura 620), proporcional em telas mais baixas
  const larg = R.largura * (0.4 + 0.6 * Math.min(1, V / 1920)), cy = V - (1920 - R.y) * Math.max(0.6, Math.min(1.05, V / 1920)) - (rodape ? 0 : -40), k = larg / 772, cab = cy - (460 + ({ aniversario: 125, comida: 90, conquista: 55, estudo: 45, viagem: 25, calma: 40 }[R.roupa] || 0)) * k, b = R.blob; // chapéu alto: a frase respeita o topo dele
  c.save(); c.translate(540, cy - 10); c.rotate((b.girar * Math.PI) / 180); c.scale(b.escala * (b.espelhar ? -1 : 1) * k * 0.98, b.escala * k * 0.92); c.fillStyle = R.escuro ? 'rgba(255,138,61,.12)' : 'rgba(255,122,46,.2)'; c.fill(new Path2D(BLOBS[b.forma])); c.restore();
  c.fillStyle = R.escuro ? 'rgba(0,0,0,.5)' : 'rgba(90,30,0,.16)'; c.beginPath(); c.ellipse(540, cy + 452 * k, 300 * k, 34 * k, 0, 0, 7); c.fill();
  // marca
  let y = margem; c.textBaseline = 'alphabetic'; c.textAlign = 'left'; // no centro: os cantos dos cenários têm lua, sol e balões
  const F1 = '900 30px Nunito, system-ui, sans-serif', F2 = '700 28px Nunito, system-ui, sans-serif'; c.font = F1; if ('letterSpacing' in c) c.letterSpacing = '8px'; const l1 = c.measureText('LEMBRA').width; c.font = F2; if ('letterSpacing' in c) c.letterSpacing = '0px'; const l2 = c.measureText('@meulembra').width, x0 = 540 - (l1 + 22 + l2) / 2;
  c.fillStyle = P.eyebrow; c.font = F1; if ('letterSpacing' in c) c.letterSpacing = '8px'; c.fillText('LEMBRA', x0, y); if ('letterSpacing' in c) c.letterSpacing = '0px'; c.fillStyle = P.texto; c.font = F2; c.fillText('@meulembra', x0 + l1 + 22, y);
  // frase: no máximo 5 linhas; diminui até caber no espaço livre do cenário
  const z = R.zona || {}, lt = Math.min(1080 - M * 2, z.larg || 920), esq = R.layout === 'esquerda' && !z.larg, topo = y + 46, fim = z.fim ? by + z.fim * bk : 9e9, alto = Math.max((cab - 30 - topo) * (V < 1700 ? 0.94 : 0.55), Math.min(cab - 30, fim) - topo), eb = n.eyebrow ? 62 : 0, rf = n.ref ? 66 : 0;
  let fs = R.fonte, L;
  for (; fs >= 30; fs -= 2) { c.font = `900 ${fs}px Nunito, system-ui, sans-serif`; L = linhas(c, n.texto, lt); if (L.length <= R.linhasMax && L.length * fs * 1.14 + eb + rf <= alto) break; }
  const ht = L.length * fs * 1.14 + eb + rf, folga = Math.max(0, alto - ht), x = esq ? M : 540; y = topo + (R.layout === 'centro' ? folga / 2 : Math.min(folga, 34)); const y0 = y;
  if (bg && y0 + ht > fim + 6) { // a frase passa sobre o cenário (tela baixa): véu suave para ler bem
    const a = P.base, v = c.createLinearGradient(0, topo - 60, 0, y0 + ht + 90), h2 = (o) => a + Math.round(o * 255).toString(16).padStart(2, '0'); v.addColorStop(0, h2(0)); v.addColorStop(0.22, h2(R.fundo === '05-motivacao' ? 0 : 0.86)); v.addColorStop(0.8, h2(R.fundo === '05-motivacao' ? 0 : 0.86)); v.addColorStop(1, h2(0)); c.fillStyle = v; c.fillRect(0, topo - 60, 1080, y0 + ht + 150 - topo);
  }
  c.textAlign = esq ? 'left' : 'center';
  if (n.eyebrow) { c.font = '800 36px Nunito, system-ui, sans-serif'; c.fillStyle = P.eyebrow; let e = n.eyebrow; while (c.measureText(e).width > lt && e.length > 8) e = e.slice(0, -2).trim() + '…'; c.fillText(e, x, y + 38); y += eb; }
  c.fillStyle = P.texto; c.font = `900 ${fs}px Nunito, system-ui, sans-serif`; for (const l of L) { y += fs * 1.14; c.fillText(l, x, y - fs * 0.24); }
  if (n.ref) { c.font = '800 38px Nunito, system-ui, sans-serif'; c.fillStyle = P.eyebrow; c.fillText(n.ref, x, y + 50); y += rf; }
  if (rodape) { c.textAlign = 'center'; c.fillStyle = P.texto; c.font = '800 34px Nunito, system-ui, sans-serif'; c.fillText(SITE(), 540, V - 62); }
  // brilhos: pares espelhados, longe do texto e do boneco
  const r = rng(R.brilhos.seed), S = [], livre = (px, py) => !(py > y0 - 40 && py < y + 30 && px > 540 - lt / 2 - 20 && px < 540 + lt / 2 + 20) && Math.hypot((px - 540) / (larg * 0.72), (py - cy) / (larg * 0.72)) > 1 && py > margem + 40;
  for (let i = 0; S.length < R.brilhos.qtd && i < 90; i++) { const px = 46 + r() * 400, py = margem + 60 + r() * (V - margem - 260), t = 11 + r() * 17, d = r() * 60 - 30, f = r() * 6.28, q = Math.floor(r() * 3); if (!livre(px, py) || S.some((o) => Math.hypot(o.x - px, o.y - py) < 90)) continue; S.push({ x: px, y: py, r: t, f, q }); if (S.length < R.brilhos.qtd && livre(1080 - px, py + d)) S.push({ x: 1080 - px, y: py + d, r: t * 0.86, f: f + 1, q: (q + 1) % 3 }); }
  c.restore();
  return { u, V, cy, k, S, linhas: L.length, fs, caixa: [y0, y] };
}
function brilhos(c, A, R, t) { c.save(); c.scale(A.u, A.u); for (const s of A.S) { c.globalAlpha = 0.75 + 0.25 * Math.sin(t * 2 + s.f); c.fillStyle = R.paleta.brilho[s.q]; estrela(c, s.x, s.y, s.r * (0.9 + 0.14 * Math.sin(t * 2.4 + s.f))); } c.restore(); }
function boneco(c, A, cv) { if (!cv || !cv.width) return; const k = A.k * A.u; c.drawImage(cv, 540 * A.u - (988 - 238) * k, A.cy * A.u - (558 + 230) * k, 1500 * k, 1310 * k); } // o centro do sino (988) fica no centro da arte
function zzz(c, A, R, t) { c.save(); c.scale(A.u, A.u); c.fillStyle = R.escuro ? '#FFE9C4' : '#6B4FA8'; c.textAlign = 'center'; for (let i = 0; i < 3; i++) { const k = (t / 3 + i / 3) % 1; c.globalAlpha = Math.sin(k * Math.PI); c.font = `900 ${46 + i * 16}px Nunito, system-ui, sans-serif`; c.fillText('z', 540 + 772 * A.k * (0.46 + k * 0.1), A.cy - 772 * A.k * (0.2 + k * 0.4)); } c.restore(); }
const T0 = 0.75;
/** imagem final, em tamanho de publicação: a mesma receita dá sempre a mesma imagem */
export async function imagem(n, R, fmt) {
  const [W, H] = FORMATOS[fmt], cv = document.createElement('canvas'); cv.width = W; cv.height = H; const c = cv.getContext('2d');
  if (document.fonts) await Promise.all(['900 60px Nunito', '800 36px Nunito', '700 28px Nunito'].map((x) => document.fonts.load(x))).catch(() => {});
  const [bg, bon] = await Promise.all([imagemDe(R.fundo), retrato(roupa(R.roupa) || roupa('forca'), Math.round(1500 * (R.largura / 772)), T0)]);
  const A = pintaFundo(c, W, H, n, R, bg, { margem: fmt === 'story' ? 150 : 92 }); brilhos(c, A, R, T0); boneco(c, A, bon); if (R.roupa === 'sono') zzz(c, A, R, T0);
  return cv;
}
const emPng = (cv) => new Promise((k) => cv.toBlob(k, 'image/png'));

/* ---------- minhas frases (só neste aparelho) ---------- */
const idLocal = (n) => 'l' + hash(`${n.title}|${n.body}|${new Date(n.at || Date.now()).toISOString().slice(0, 13)}`).toString(36);
export const historico = () => { try { return JSON.parse(localStorage.getItem(HIST) || '[]').map((x) => (x.id ? x : { ...x, id: idLocal(x), tag: x.tag || 'p-amigo' })); } catch { return []; } };
function guardaHist(n) { try { const l = historico().filter((x) => x.id !== n.id); l.unshift({ id: n.id, title: n.title, body: n.body, arte: n.arte || '', eyebrow: n.eyebrow || '', ref: n.ref || '', kind: n.kind || '', tag: n.tag || 'p-amigo', cat: n.cat || '', fid: n.fid || '', t: n.t || '', at: n.at || Date.now() }); localStorage.setItem(HIST, JSON.stringify(l.slice(0, 60))); } catch { /* ok */ } }
export function minhasFrases() {
  const L = historico(), urls = [];
  const a = openSheet({ className: 'sheet--tall sheet--fx', onClose: () => urls.forEach((u) => URL.revokeObjectURL(u)), html: `<div class="fx"><header class="fx__head"><button class="fx__pill" data-close>Fechar</button><h2 class="fx__title">Minhas frases</h2><span class="fx__right"></span></header>
    ${L.length ? `<p class="fhelp">Guardadas só neste aparelho (até 60).</p><div class="mfr">${L.map((x) => `<button class="mfr__i" data-f="${esc(x.id)}"><span class="mfr__a"><b>${esc((x.arte || partes(x.body).texto).slice(0, 90))}</b></span><small>${esc(new Date(x.at).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }))}</small></button>`).join('')}</div>` : '<p class="fhelp mfr__v">As frases que você abrir pelas notificações ficam aqui.</p>'}</div>` });
  a.el.querySelectorAll('[data-f]').forEach((b) => { b.onclick = () => { const x = historico().find((y) => y.id === b.dataset.f); if (x) abreFrase(x); }; pega(b.dataset.f).then((x) => { if (!x || !x.story || a.closed) return; const u = URL.createObjectURL(x.story); urls.push(u); b.querySelector('.mfr__a').style.backgroundImage = `url("${u}")`; b.classList.add('tem'); }); });
  return a;
}
/** abre pelo endereço #/frase/<id> */
export async function abrePorId(id) {
  if (document.querySelector(`.frp[data-id="${CSS.escape(id)}"]`)) return true;
  try { const c = await caches.open('lembra-notif'), r = await c.match('/__notif'); if (r) { const n = await r.json(); if (n.id === id) { await c.delete('/__notif'); return abreFrase(n); } } } catch { /* ok */ }
  if (document.querySelector(`.frp[data-id="${CSS.escape(id)}"]`)) return true;
  const h = historico().find((x) => x.id === id); if (h) return abreFrase(h);
  const g = await pega(id); if (g && g.n) return abreFrase(g.n);
  toast('Essa frase não está guardada neste aparelho.'); return false;
}

const SV = {
  insta: '<rect x="3.500" y="3.500" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17" cy="7" r=".6" fill="currentColor"/>',
  zap: '<path d="M4 20l1.200-4A8 8 0 1 1 8.300 19Z"/><path d="M9 8.800c.300 3 2.800 5.600 6 6 .800 0 1.500-.700 1.400-1.500l-1.900-.900-1 1c-1.300-.600-2.200-1.500-2.800-2.800l1-1-.800-1.900C10 7.500 9 8 9 8.800Z" fill="currentColor" stroke="none"/>',
  face: '<path d="M14 21v-7h2.800l.500-3.300H14V8.600c0-1 .500-1.800 1.900-1.800h1.500V4c-.400-.100-1.300-.200-2.200-.200-2.500 0-4.100 1.500-4.100 4.200v2.700H8.300V14h2.800v7" fill="currentColor" stroke="none"/>',
};
const sv = (k) => `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${SV[k]}</svg>`;
const DO_BANCO = /^(ia-)?(agua|manha|noite|motivacao|versiculo|aniversario|socializar|estudo|trabalho|contas)-[a-z0-9-]+$/;
const semEmoji = (t) => (/^lembra$/i.test(String(t || '').trim()) ? '' : String(t || '')).replace(/[\p{Extended_Pictographic}\u{FE0F}\u{200D}]/gu, '').replace(/\s{2,}/g, ' ').trim();

/* ---------- a página ---------- */
export function abreFrase(n) {
  if (!ehFrase(n)) return false;
  n = { ...n, at: n.at || Date.now() }; if (!n.id) n.id = idLocal(n);
  document.querySelectorAll('.frp').forEach((x) => x.remove());
  if (n.remedio) n = { ...n, arte: n.corpo || `Hora do ${n.remedio}.`, cat: 'remedio', ref: '', eyebrow: '' }; else guardaHist(n); // remédio: o nome só aparece aqui dentro, sem histórico, sem imagem guardada e sem compartilhar
  const p = partes(n.arte || n.body), f = { texto: (p.texto || n.body).slice(0, 320), ref: n.ref || p.ref, eyebrow: semEmoji(n.eyebrow || n.title) };
  const tema = temaDe({ ...n, body: f.texto }), cat = FUNDO[n.cat] ? n.cat : CAT_DO_TEMA[tema] || 'geral', h = new Date(n.at).getHours(), turno = n.t || (h >= 5 && h < 12 ? 'manha' : h < 18 && h >= 12 ? 'tarde' : 'noite');
  let R = receitaArte(n.id, cat, turno, f.texto); if (!n.cat || cat === 'motivacao' || cat === 'geral' || cat === 'lembrete') { const r2 = roupa(tema) ? tema : R.roupa; R = { ...R, roupa: r2 === 'forca' && cat === 'lembrete' ? R.roupa : r2 }; }
  let fmt = 'story', vivo = true, A = null, base = null, bg = null, arq = null;
  const soc = podeSocial() && !n.remedio, agenda = ['aniversario', 'contas', 'estudo', 'trabalho', 'remedio'].includes(cat), rp = roupa(R.roupa) || roupa('forca');
  const w = document.createElement('div');
  w.className = `frp${R.escuro ? ' is-noite' : ''}`; w.dataset.id = n.id; w.style.setProperty('--bg', R.paleta.base); w.setAttribute('role', 'dialog'); w.setAttribute('aria-modal', 'true'); w.setAttribute('aria-label', f.texto);
  const bt = (k, ic, t) => `<button class="frp__b frp__b--${k}" data-vai="${k}"><i>${ic}</i><small>${t}</small></button>`;
  const naoCurti = DO_BANCO.test(n.fid || '') ? `<button class="frp__op${agenda || cat === 'agua' ? ' frp__op--so' : ''}" data-nao aria-label="Não curti esta frase"><span aria-hidden="true">👎</span>${agenda || cat === 'agua' ? '' : ' Não curti'}</button>` : '';
  w.innerHTML = `<span class="frp__rig">${sininho(rp.mood, { size: 400 })}</span><canvas class="frp__cv" role="img" aria-label="${esc(f.texto)}${f.ref ? ` — ${esc(f.ref)}` : ''}"></canvas>
    ${n.remedio ? '' : `<button class="frp__x frp__x--l" data-minhas aria-label="Minhas frases">${icon('note', 21)}</button>`}<button class="frp__x" data-x aria-label="Fechar">${icon('x', 22)}</button>
    ${n.remedio ? `<footer class="frp__pe"><button class="frp__ver" data-agenda>${icon('calendar', 20)} Ver na agenda</button></footer>` : `<footer class="frp__pe"><div class="frp__ops">${cat === 'agua' ? `<button class="frp__op frp__op--bebi" data-bebi>💧 Bebi</button>` : ''}${naoCurti}${agenda ? `<button class="frp__op" data-agenda>${icon('calendar', 18)} Agenda</button>` : ''}<span class="frp__esp"></span><div class="frp__fmt" role="group" aria-label="Formato"><button data-f="story" aria-pressed="true">Story</button><button data-f="post" aria-pressed="false">Feed</button></div></div>
      <div class="frp__bs">${soc ? bt('lembra', icon('bell', 26), 'Seu story') : ''}${bt('insta', sv('insta'), 'Instagram')}${bt('zap', sv('zap'), 'WhatsApp')}${bt('face', sv('face'), 'Facebook')}${bt('mais', icon('share', 24), 'Mais')}</div></footer>`}`;
  document.body.appendChild(w); document.body.classList.add('has-stv');
  const cv = w.querySelector('.frp__cv'), c = cv.getContext('2d'), rigEl = w.querySelector('[data-snh]');
  rigEl.dataset.nitido = '1'; rigEl.style.aspectRatio = '1500 / 1310'; alive(); veste(rigEl, rp);
  const fecha = () => { vivo = false; w.classList.add('is-out'); removeEventListener('keydown', esc27); setTimeout(() => { w.remove(); if (!document.querySelector('.stv, .frp')) document.body.classList.remove('has-stv'); }, 240); };
  const esc27 = (e) => { if (e.key === 'Escape') fecha(); }; addEventListener('keydown', esc27);
  const monta = () => { // parte parada em um quadro à parte: a tela só redesenha o que se mexe
    const d = Math.min(2, devicePixelRatio || 1), r = cv.getBoundingClientRect(); if (!r.width) return;
    cv.width = Math.round(r.width * d); cv.height = Math.round(r.height * d); base = document.createElement('canvas'); base.width = cv.width; base.height = cv.height;
    const sob = document.createElement('div'); sob.style.cssText = 'position:absolute;visibility:hidden;height:env(safe-area-inset-top,0px)'; w.appendChild(sob); const topo = sob.offsetHeight; sob.remove();
    A = pintaFundo(base.getContext('2d'), base.width, base.height, f, R, bg, { margem: ((topo + 92) / r.width) * 1080, rodape: false });
  };
  const red = matchMedia('(prefers-reduced-motion: reduce)').matches, t0 = performance.now(); let ult = 0;
  const pinta = (now) => {
    if (!vivo || !w.isConnected) return;
    requestAnimationFrame(pinta);
    if (document.hidden || !A || (red && now - ult < 500)) return; ult = now;
    const r = rigDe(rigEl); if (r && r.sleeping && !red) r.wake();
    const t = red ? T0 : (now - t0) / 1000; c.drawImage(base, 0, 0); brilhos(c, A, R, t); boneco(c, A, rigEl.querySelector('canvas')); if (R.roupa === 'sono') zzz(c, A, R, t);
  };
  const arquivo = (b, k) => new File([b], `lembra-${cat}-${k}.png`, { type: 'image/png' });
  // as imagens ficam prontas antes do toque (o celular só deixa compartilhar na hora do toque) e guardadas para reabrir iguais
  const prepara = async () => {
    if (n.remedio) return;
    const g = await pega(n.id);
    if (g && g.story && g.post && g.receita && g.receita.v === R.v) { arq = { story: arquivo(g.story, 'story'), post: arquivo(g.post, 'feed') }; return; }
    await new Promise((k) => setTimeout(k, 500)); if (!vivo) return;
    const st = await emPng(await imagem(f, R, 'story')); if (!st) return; arq = { story: arquivo(st, 'story') };
    const ps = await emPng(await imagem(f, R, 'post')); if (!ps) return; arq.post = arquivo(ps, 'feed');
    if (await imagemDe(R.fundo)) await guarda({ msgId: n.id, receita: R, n, story: st, post: ps }); // sem o cenário (sem internet), não guarda a versão incompleta
  };
  Promise.all([document.fonts ? Promise.all(['900 60px Nunito', '800 36px Nunito'].map((x) => document.fonts.load(x))).catch(() => {}) : 0, pega(n.id).then((g) => { if (g && g.receita && g.receita.v === R.v && !n.remedio) R = g.receita; }).catch(() => {})]).then(async () => { if (!vivo) return; monta(); requestAnimationFrame(pinta); bg = await imagemDe(R.fundo); if (!vivo) return; monta(); prepara(); });
  const ro = 'ResizeObserver' in window ? new ResizeObserver(() => { if (!w.isConnected) return ro.disconnect(); monta(); }) : null; ro && ro.observe(cv);
  const q = (s) => w.querySelector(s);
  q('[data-x]').onclick = fecha; if (q('[data-minhas]')) q('[data-minhas]').onclick = () => { fecha(); setTimeout(minhasFrases, 260); };
  if (q('[data-bebi]')) q('[data-bebi]').onclick = async (e) => { const b = e.currentTarget, r = await import('./retro.js'), k = r.bebi(); b.innerHTML = `✓ ${k} ${k === 1 ? 'copo' : 'copos'} hoje`; b.disabled = true; b.classList.add('is-ok'); import('./sound.js').then((s) => s.msgVai && s.msgVai()).catch(() => {}); };
  if (q('[data-agenda]')) q('[data-agenda]').onclick = () => { fecha(); location.hash = '#/p/hoje'; };
  if (q('[data-nao]')) q('[data-nao]').onclick = async (e) => { const b = e.currentTarget; b.disabled = true; try { await call('/frase-queixa', { fid: n.fid }); b.innerHTML = agenda || cat === 'agua' ? '✓' : '✓ Anotado'; b.classList.add('is-ok'); toast('Anotado! Essa frase não volta para você.'); } catch (x) { b.disabled = false; toast(x.message || 'Sem internet agora.'); } };
  w.querySelectorAll('[data-f]').forEach((b) => (b.onclick = () => { fmt = b.dataset.f; w.querySelectorAll('[data-f]').forEach((x) => x.setAttribute('aria-pressed', x === b)); }));
  const txt = `${f.texto}${f.ref ? ` — ${f.ref}` : ''}\n\nvia Lembra · ${LINK()}`;
  const salva = (file, msg) => { const a = document.createElement('a'); a.href = URL.createObjectURL(file); a.download = file.name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 8000); toast(msg, { ms: 4000 }); };
  const feliz = () => import('./mascote.js').then((M) => M.react('story')).catch(() => {});
  w.querySelectorAll('[data-vai]').forEach((b) => (b.onclick = async () => {
    const file = arq && arq[fmt], k = b.dataset.vai; if (!file || (k === 'lembra' && !arq.story)) return toast('Preparando a imagem…');
    if (k === 'lembra') {
      b.disabled = true;
      try {
        const im = await createImageBitmap(arq.story), c2 = document.createElement('canvas'); c2.width = 810; c2.height = 1440; c2.getContext('2d').drawImage(im, 0, 0, 810, 1440);
        let ql = 0.86, foto = c2.toDataURL('image/jpeg', ql); while (foto.length > 400000 && ql > 0.4) { ql -= 0.1; foto = c2.toDataURL('image/jpeg', ql); }
        const pref = (x, d) => { try { const v = localStorage.getItem('lembra.st.' + x); return v === null ? d : v === '1'; } catch { return d; } };
        await call('/friends/story-post', { photo: foto, caption: '', podeCom: pref('com', true), podeRp: pref('rp', false) });
        import('./stories.js').then((m) => m.refreshFeed()).then(() => window.__calRender && window.__calRender()).catch(() => {});
        toast('No seu story do Lembra! 🔔'); feliz(); b.classList.add('is-ok');
      } catch (e) { toast(e.message || 'Não consegui postar agora.'); }
      b.disabled = false; return;
    }
    try {
      if (navigator.canShare?.({ files: [file] })) {
        if (k === 'insta') toast('Escolha Instagram e depois Stories'); if (k === 'face') toast('Escolha Facebook na lista'); if (k === 'zap') toast('Escolha WhatsApp na lista');
        await navigator.share(k === 'insta' || k === 'face' ? { files: [file] } : { files: [file], text: txt }); return feliz();
      }
    } catch (e) { if (e && e.name === 'AbortError') return; }
    // sem a lista de compartilhar (computador)
    if (k === 'zap') return void open(`https://wa.me/?text=${encodeURIComponent(txt)}`, '_blank', 'noopener');
    if (k === 'face') return void open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(LINK())}`, '_blank', 'noopener');
    salva(file, k === 'insta' ? 'Imagem salva. Abra o Instagram e poste 📸' : 'Imagem salva ✓');
  }));
  requestAnimationFrame(() => w.classList.add('is-in'));
  return true;
}

/* aviso tocado: o service worker guarda a notificação; o app abre a frase assim que carrega */
export async function confereAvisoTocado() {
  try {
    const c = await caches.open('lembra-notif');
    const r = await c.match('/__notif'); if (!r) return;
    const n = await r.json(); await c.delete('/__notif');
    if (Date.now() - (n.at || 0) < 5 * 60e3 && !(n.id && document.querySelector(`.frp[data-id="${CSS.escape(n.id)}"]`))) abreFrase(n);
  } catch { /* ok */ }
}
/* teste local */
try { if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname) && localStorage.getItem('cal.emulator') === '1') window.__lembraFrase = { abreFrase, temaDe, store, imagem, receitaArte, pega, guarda, conta, apaga, limpaTudo, historico, pintaFundo, imagemDe }; } catch { /* ok */ }
