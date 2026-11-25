/* Frase da notificação (motivacional, bíblica, cuidado, aniversário, viagem…): tocou no aviso → abre uma página
   com o Lembra vestido do assunto e a frase em cima, pronta para o story. A arte da tela é a mesma que sai na imagem. */
import { icon } from './icons.js';
import { esc, comUtm } from './utils.js';
import { toast } from './components.js';
import { CONFIG } from '../config.js';
import { store } from './store.js';
import { podeSocial, call } from './social.js';
import { roupa } from './roupas.js';
import { sininho, alive, veste, rigDe } from './sininho.js';

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
export const ehFrase = (n) => !!n && !!n.body && (n.tag === 'p-amigo' || n.tag === 'coach' || n.tag === 'frase') && n.kind !== 'rank' && (n.kind !== 'agenda' || /anivers|🎂|🎁/i.test(`${n.title} ${n.body}`));

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

/* ---------- a arte (a mesma na tela e na imagem) ---------- */
export const ESTILOS = [
  { id: 'creme', nome: 'Creme', bg: '#FFF1DF', bolha: '#FFC48A', bolha2: '#FFDDB8', cor: '#210C04', sub: '#5A2A12', marca: '#C2410C', f: ['#F4561A', '#FFB938', '#FFFFFF'] },
  { id: 'pessego', nome: 'Pêssego', bg: '#FFDDBA', bolha: '#FFF3E2', bolha2: '#FFC78F', cor: '#210C04', sub: '#5A2A12', marca: '#A8340A', f: ['#F4561A', '#FFFFFF', '#FFA62B'] },
  { id: 'laranja', nome: 'Laranja', bg: '#FF7A2A', bolha: '#FFF1DF', bolha2: '#FF9A52', cor: '#210C04', sub: '#3A1506', marca: '#210C04', f: ['#FFFFFF', '#FFE08A', '#B93B0C'] },
  { id: 'noite', nome: 'Noite', bg: '#1B1436', bolha: '#4B2F63', bolha2: '#2E2150', cor: '#FFF6EA', sub: '#FFD9B0', marca: '#FFA45C', f: ['#FFE9C4', '#FF8A3D', '#C9A6FF'], estrelas: true },
];
export const FORMATOS = { story: [1080, 1920], post: [1080, 1350] };
const semente = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
function linhas(c, texto, larg, eq = false) {
  const out = [];
  for (const par of texto.split(/\n+/)) { let l = ''; for (const w of par.split(/\s+/)) { const t = l ? `${l} ${w}` : w; if (c.measureText(t).width > larg && l) { out.push(l); l = w; } else l = t; } if (l) out.push(l); }
  // linhas equilibradas: a menor largura que mantém o mesmo número de linhas
  if (!eq && out.length > 1) { let a = larg * 0.5, b = larg; for (let i = 0; i < 9; i++) { const m = (a + b) / 2; linhas(c, texto, m, true).length <= out.length ? (b = m) : (a = m); } return linhas(c, texto, b, true); }
  // nada de palavra sozinha na última linha
  if (!eq && out.length > 1) { const u = out[out.length - 1], p = out[out.length - 2].split(' '); if (!u.includes(' ') && p.length > 2) { const w = p.pop(); if (c.measureText(`${w} ${u}`).width <= larg) { out[out.length - 2] = p.join(' '); out[out.length - 1] = `${w} ${u}`; } } }
  return out;
}
const estrela = (c, x, y, r) => { c.beginPath(); for (let i = 0; i < 4; i++) { const a = (i * Math.PI) / 2 - Math.PI / 2, b = a + Math.PI / 4; c[i ? 'lineTo' : 'moveTo'](x + Math.cos(a) * r, y + Math.sin(a) * r); c.quadraticCurveTo(x, y, x + Math.cos(b + Math.PI / 4) * r, y + Math.sin(b + Math.PI / 4) * r); } c.fill(); };
const BLOBS = ['M-430 60C-470-120-380-300-210-270-110-252-60-320 40-390 170-480 350-440 380-290 400-190 330-150 350-40 366 50 450 90 430 210 406 340 270 360 130 350-40 338-190 380-320 320-420 274-418 150-430 60Z', 'M-400-90C-380-270-230-360-90-300 0-262 60-330 170-350 320-376 430-270 410-120 398-30 450 30 440 140 424 300 280 372 120 344 10 324-60 372-190 366-350 358-452 250-440 100-434 30-408-20-400-90Z'];
/* parte parada: fundo, bolha, marca e a frase. Devolve onde fica o boneco. */
export function fundo(c, W, H, n, E, { margemTopo = 0.085, rodape = true } = {}) {
  const u = W / 1080, M = 80 * u, s = semente(n.texto);
  c.fillStyle = E.bg; c.fillRect(0, 0, W, H);
  if (E.estrelas) for (let i = 0; i < 60; i++) { const r = semente(n.texto + i); c.globalAlpha = 0.25 + (r % 60) / 100; c.fillStyle = '#FFE9C4'; c.beginPath(); c.arc((r % 1080) * u, ((r >> 8) % 1000) / 1000 * H * 0.55 + H * 0.45, (1.6 + (r % 3)) * u, 0, 7); c.fill(); } c.globalAlpha = 1;
  let y = H * margemTopo + 26 * u;
  c.textBaseline = 'alphabetic'; c.textAlign = 'left'; c.fillStyle = E.marca; c.font = `900 ${30 * u}px Nunito, system-ui, sans-serif`; if ('letterSpacing' in c) c.letterSpacing = `${8 * u}px`; c.fillText('LEMBRA', M, y); if ('letterSpacing' in c) c.letterSpacing = '0px';
  c.textAlign = 'right'; c.fillStyle = E.sub; c.font = `700 ${28 * u}px Nunito, system-ui, sans-serif`; c.fillText('@meulembra', W - M, y);
  const rod = rodape ? 120 * u : 24 * u, alto = H - y - rod, areaT = alto * (H / W > 1.5 ? 0.36 : 0.38);
  let fs = 92, L; const larg = W - M * 2;
  for (; fs >= 34; fs -= 2) { c.font = `900 ${fs * u}px Nunito, system-ui, sans-serif`; L = linhas(c, n.texto, larg); if (L.length * fs * 1.14 * u + (n.ref ? 64 * u : 0) <= areaT) break; }
  y += 44 * u; c.textAlign = 'left'; c.fillStyle = E.cor; c.font = `900 ${fs * u}px Nunito, system-ui, sans-serif`;
  for (const l of L) { y += fs * 1.14 * u; c.fillText(l, M, y); }
  if (n.ref) { y += 62 * u; c.fillStyle = E.marca; c.font = `800 ${38 * u}px Nunito, system-ui, sans-serif`; c.fillText(n.ref, M, y); }
  // palco: o que sobra entre a frase e o rodapé, sempre centralizado
  const t0 = y + 34 * u, t1 = H - rod, tam = Math.min(W, (t1 - t0) * 0.92), cx = W / 2, cy = t0 + (t1 - t0) / 2 + 6 * u;
  const bl = new Path2D(BLOBS[s % BLOBS.length]), k = Math.min(W / 960, (t1 - t0) / 800);
  c.save(); c.translate(cx, cy); c.save(); c.scale(k * 1.1, k * 1.04); c.rotate(0.1); c.fillStyle = E.bolha2; c.fill(bl); c.restore(); c.scale(k, k * 0.94); c.fillStyle = E.bolha; c.fill(bl); c.restore();
  const w = Math.min(W * 0.98, tam * 1.07), h = (w * 1080) / 1160;
  // sombra no chão
  c.fillStyle = 'rgba(60,20,0,.16)'; c.beginPath(); c.ellipse(cx, cy + h * 0.455, w * 0.3, h * 0.036, 0, 0, 7); c.fill();
  if (rodape) { c.textAlign = 'center'; c.fillStyle = E.cor; c.font = `800 ${34 * u}px Nunito, system-ui, sans-serif`; c.fillText(SITE(), W / 2, H - 62 * u); }
  return { cx, cy, w, h, t0, t1, u, s };
}
/* enfeites de cada assunto, em volta do boneco */
const SIMB = { aniversario: 'confete', conquista: 'confete', amor: 'coracao', saude: 'coracao', agua: 'gota', sono: 'lua', viagem: 'aviao', fe: 'luz', amigos: 'coracao', calma: 'folha', dinheiro: 'moeda', comida: 'coracao' };
function enfeites(c, A, E, tema, t) {
  const { cx, cy, w, h, u, s, t0 } = A, tipo = SIMB[tema] || 'brilho';
  if (tipo === 'luz') { c.save(); c.translate(cx, cy - h * 0.1); c.globalAlpha = 0.4; c.fillStyle = E.f[1]; for (let i = 0; i < 14; i++) { c.rotate(6.2832 / 14); c.beginPath(); c.moveTo(0, -w * 0.34); c.lineTo(-13 * u, -w * 0.47 - Math.sin(t * 2 + i) * 8 * u); c.lineTo(13 * u, -w * 0.47 - Math.sin(t * 2 + i) * 8 * u); c.fill(); } c.restore(); c.globalAlpha = 1; }
  // pares espelhados: o desenho fica equilibrado dos dois lados
  for (let i = 0; i < 12; i++) {
    const lado = i % 2 ? 1 : -1, k = Math.floor(i / 2), r = semente(`${s}${k}`), ang = -1.15 + k * 0.42 + ((r % 20) - 10) / 120, R = w * (0.46 + ((r >> 5) % 9) / 130);
    let x = cx + lado * Math.cos(ang) * R, y = cy + Math.sin(ang) * R * 0.92; y = Math.max(t0 + 24 * u, y); x = Math.max(40 * u, Math.min(cx * 2 - 40 * u, x)); const bo = Math.sin(t * 1.6 + k * 1.3 + (lado > 0 ? 0.5 : 0)) * 9 * u, z = (18 + (r >> 3) % 16) * u;
    c.fillStyle = E.f[(i + k) % 3]; c.save(); c.translate(x, y + bo);
    if (tipo === 'confete') { c.rotate(t * 0.9 * lado + k); if (k % 3 === 0) { c.beginPath(); c.arc(0, 0, z * 0.45, 0, 7); c.fill(); } else c.fillRect(-z * 0.6, -z * 0.3, z * 1.2, z * 0.6); }
    else if (tipo === 'coracao' && k % 2 === 0) { c.scale(z / 30, z / 30); c.beginPath(); c.moveTo(0, 34); c.bezierCurveTo(-44, 6, -42, -30, -18, -32); c.bezierCurveTo(-6, -33, 0, -24, 0, -18); c.bezierCurveTo(0, -24, 6, -33, 18, -32); c.bezierCurveTo(42, -30, 44, 6, 0, 34); c.fill(); }
    else if (tipo === 'gota' && k % 2 === 0) { c.fillStyle = '#4FA8E8'; c.beginPath(); c.moveTo(0, -z * 1.3); c.bezierCurveTo(z * 1.1, 0, z * 0.9, z, 0, z); c.bezierCurveTo(-z * 0.9, z, -z * 1.1, 0, 0, -z * 1.3); c.fill(); }
    else if (tipo === 'folha' && k % 2 === 0) { c.fillStyle = '#39A96B'; c.rotate(lado * 0.7); c.beginPath(); c.moveTo(0, -z * 1.2); c.quadraticCurveTo(z * 1.2, 0, 0, z * 1.2); c.quadraticCurveTo(-z * 1.2, 0, 0, -z * 1.2); c.fill(); }
    else if (tipo === 'moeda' && k % 2 === 0) { c.fillStyle = '#FFB938'; c.beginPath(); c.arc(0, 0, z, 0, 7); c.fill(); c.strokeStyle = '#E5902A'; c.lineWidth = z * 0.22; c.stroke(); }
    else if (tipo === 'lua' && k === 0 && lado > 0) { c.fillStyle = '#FFE08A'; c.beginPath(); c.arc(0, 0, z * 1.8, 0.6, 5.2); c.quadraticCurveTo(-z * 0.1, 0, Math.cos(0.6) * z * 1.8, Math.sin(0.6) * z * 1.8); c.fill(); }
    else if (tipo === 'aviao' && k === 0 && lado < 0) { c.scale(z / 15, z / 15); c.rotate(-0.25); c.fillStyle = '#FFFFFF'; c.fill(new Path2D('M-44 4L-30 0-40-16H-32L-12-3 10-6-6-34H6L30-8 44-10C56-10 56 2 44 4L14 10-8 34H-18L-4 12-30 14Z')); }
    else estrela(c, 0, 0, z * (0.9 + 0.2 * Math.sin(t * 2.4 + i)));
    c.restore();
  }
}
function zzz(c, A, E, t) { c.fillStyle = E.estrelas ? '#FFE9C4' : '#6B4FA8'; c.textAlign = 'center'; for (let i = 0; i < 3; i++) { const k = (t / 3 + i / 3) % 1; c.globalAlpha = Math.sin(k * Math.PI); c.font = `900 ${(46 + i * 16) * A.u}px Nunito, system-ui, sans-serif`; c.fillText('z', A.cx + A.w * (0.33 + k * 0.08), A.cy - A.h * (0.1 + k * 0.28)); } c.globalAlpha = 1; }
function boneco(c, A, cv) { if (!cv || !cv.width) return; const k = A.w / 1160; c.drawImage(cv, A.cx - (988 - 238) * k, A.cy - A.h * 0.5 - 190 * k, 1500 * k, 1310 * k); } // o centro do sino (988) fica no centro da arte
/** imagem final, em tamanho de publicação */
export async function imagem(n, E, tema, fmt, cvBoneco, t = 0.75) {
  const [W, H] = FORMATOS[fmt], cv = document.createElement('canvas'); cv.width = W; cv.height = H; const c = cv.getContext('2d');
  if (document.fonts) await Promise.all([document.fonts.load('900 60px Nunito'), document.fonts.load('700 30px Nunito')]).catch(() => {});
  const A = fundo(c, W, H, n, E, { margemTopo: fmt === 'story' ? 0.085 : 0.045 }); enfeites(c, A, E, tema, t); boneco(c, A, cvBoneco); if (tema === 'sono') zzz(c, A, E, t);
  return cv;
}

function guarda(n) { try { const l = JSON.parse(localStorage.getItem(HIST) || '[]').filter((x) => x.body !== n.body); l.unshift({ title: n.title, body: n.body, kind: n.kind || '', tag: n.tag || '', at: Date.now() }); localStorage.setItem(HIST, JSON.stringify(l.slice(0, 30))); } catch { /* ok */ } }
export const historico = () => { try { return JSON.parse(localStorage.getItem(HIST) || '[]'); } catch { return []; } };

const SV = {
  insta: '<rect x="3.500" y="3.500" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17" cy="7" r=".6" fill="currentColor"/>',
  zap: '<path d="M4 20l1.200-4A8 8 0 1 1 8.300 19Z"/><path d="M9 8.800c.300 3 2.800 5.600 6 6 .800 0 1.500-.700 1.400-1.500l-1.900-.900-1 1c-1.300-.600-2.200-1.500-2.800-2.800l1-1-.800-1.900C10 7.500 9 8 9 8.800Z" fill="currentColor" stroke="none"/>',
  face: '<path d="M14 21v-7h2.800l.500-3.300H14V8.600c0-1 .500-1.800 1.900-1.800h1.500V4c-.400-.100-1.300-.200-2.200-.200-2.500 0-4.100 1.500-4.100 4.200v2.700H8.300V14h2.800v7" fill="currentColor" stroke="none"/>',
};
const sv = (k) => `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${SV[k]}</svg>`;

/* ---------- a página ---------- */
export function abreFrase(n) {
  if (!ehFrase(n)) return false;
  document.querySelectorAll('.frp').forEach((x) => x.remove());
  guarda(n);
  const f = partes(n.body), tema = temaDe(n), rp = roupa(tema) || roupa('forca');
  let ei = tema === 'sono' ? 3 : semente(f.texto) % 3, fmt = 'story', vivo = true, A = null, base = null, arq = null, vez = 0;
  const soc = podeSocial();
  const w = document.createElement('div');
  w.className = 'frp'; w.setAttribute('role', 'dialog'); w.setAttribute('aria-modal', 'true'); w.setAttribute('aria-label', f.texto);
  const bt = (k, ic, t) => `<button class="frp__b frp__b--${k}" data-vai="${k}"><i>${ic}</i><small>${t}</small></button>`;
  w.innerHTML = `<span class="frp__rig">${sininho(rp.mood, { size: 400 })}</span><canvas class="frp__cv" role="img" aria-label="${esc(f.texto)}${f.ref ? ` — ${esc(f.ref)}` : ''}"></canvas>
    <button class="frp__x" data-x aria-label="Fechar">${icon('x', 22)}</button>
    <footer class="frp__pe"><div class="frp__ops"><div class="frp__est" role="group" aria-label="Estilo">${ESTILOS.map((m, i) => `<button data-e="${i}" aria-label="${m.nome}" aria-pressed="${i === ei}" style="--ca:${m.bg};--cb:${m.bolha}"></button>`).join('')}</div><div class="frp__fmt" role="group" aria-label="Formato"><button data-f="story" aria-pressed="true">Story</button><button data-f="post" aria-pressed="false">Feed</button></div></div>
      <div class="frp__bs">${soc ? bt('lembra', icon('bell', 26), 'Seu story') : ''}${bt('insta', sv('insta'), 'Instagram')}${bt('zap', sv('zap'), 'WhatsApp')}${bt('face', sv('face'), 'Facebook')}${bt('mais', icon('share', 24), 'Mais')}</div></footer>`;
  document.body.appendChild(w); document.body.classList.add('has-stv');
  const cv = w.querySelector('.frp__cv'), c = cv.getContext('2d'), rigEl = w.querySelector('[data-snh]'), nn = { texto: f.texto, ref: f.ref };
  rigEl.dataset.nitido = '1'; rigEl.style.aspectRatio = '1500 / 1310'; alive(); veste(rigEl, rp);
  const fecha = () => { vivo = false; w.classList.add('is-out'); removeEventListener('keydown', esc27); setTimeout(() => { w.remove(); document.body.classList.remove('has-stv'); }, 240); };
  const esc27 = (e) => { if (e.key === 'Escape') fecha(); }; addEventListener('keydown', esc27);
  const monta = () => { // parte parada em um quadro à parte: a tela só redesenha o que se mexe
    const d = Math.min(2, devicePixelRatio || 1), r = cv.getBoundingClientRect(); if (!r.width) return;
    cv.width = Math.round(r.width * d); cv.height = Math.round(r.height * d); base = document.createElement('canvas'); base.width = cv.width; base.height = cv.height;
    const topo = parseFloat(getComputedStyle(w).getPropertyValue('--topo')) || 0;
    A = fundo(base.getContext('2d'), base.width, base.height, nn, ESTILOS[ei], { margemTopo: Math.max(0.1, (topo + 64) / r.height), rodape: false }); w.style.setProperty('--bg', ESTILOS[ei].bg); w.classList.toggle('is-noite', !!ESTILOS[ei].estrelas);
  };
  const red = matchMedia('(prefers-reduced-motion: reduce)').matches, t0 = performance.now(); let ult = 0;
  const pinta = (now) => {
    if (!vivo || !w.isConnected) return;
    requestAnimationFrame(pinta);
    if (document.hidden || !A || (red && now - ult < 500)) return; ult = now;
    const r = rigDe(rigEl); if (r && r.sleeping && !red) r.wake();
    const t = red ? 0.75 : (now - t0) / 1000; c.drawImage(base, 0, 0); enfeites(c, A, ESTILOS[ei], tema, t); boneco(c, A, rigEl.querySelector('canvas')); if (tema === 'sono') zzz(c, A, ESTILOS[ei], t);
  };
  // a imagem fica pronta antes do toque (o celular só deixa compartilhar na hora do toque)
  const prepara = async () => { const v = ++vez; arq = null; await new Promise((k) => setTimeout(k, rigDe(rigEl) ? 350 : 1400)); if (v !== vez || !vivo) return; const im = await imagem(nn, ESTILOS[ei], tema, fmt, rigEl.querySelector('canvas')); const blob = await new Promise((k) => im.toBlob(k, 'image/png')); if (v === vez && blob) arq = { im, file: new File([blob], `lembra-${tema}.png`, { type: 'image/png' }) }; };
  (document.fonts ? document.fonts.load('900 60px Nunito').catch(() => {}) : Promise.resolve()).then(() => { if (!vivo) return; monta(); requestAnimationFrame(pinta); prepara(); });
  const ro = 'ResizeObserver' in window ? new ResizeObserver(() => { if (!w.isConnected) return ro.disconnect(); monta(); }) : null; ro && ro.observe(cv);
  w.querySelector('[data-x]').onclick = fecha;
  w.querySelectorAll('[data-e]').forEach((b) => (b.onclick = () => { ei = +b.dataset.e; w.querySelectorAll('[data-e]').forEach((x) => x.setAttribute('aria-pressed', x === b)); monta(); prepara(); }));
  w.querySelectorAll('[data-f]').forEach((b) => (b.onclick = () => { fmt = b.dataset.f; w.querySelectorAll('[data-f]').forEach((x) => x.setAttribute('aria-pressed', x === b)); prepara(); }));
  const txt = `${f.texto}${f.ref ? ` — ${f.ref}` : ''}\n\nvia Lembra · ${LINK()}`;
  const salva = (msg) => { const a = document.createElement('a'); a.href = URL.createObjectURL(arq.file); a.download = arq.file.name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 8000); toast(msg, { ms: 4000 }); };
  const feliz = () => import('./mascote.js').then((M) => M.react('story')).catch(() => {});
  w.querySelectorAll('[data-vai]').forEach((b) => (b.onclick = async () => {
    if (!arq) return toast('Preparando a imagem…');
    const k = b.dataset.vai;
    if (k === 'lembra') {
      b.disabled = true;
      try {
        let im = arq.im; if (fmt !== 'story') im = await imagem(nn, ESTILOS[ei], tema, 'story', rigEl.querySelector('canvas'));
        const p = document.createElement('canvas'); p.width = 810; p.height = 1440; p.getContext('2d').drawImage(im, 0, 0, 810, 1440);
        let q = 0.86, foto = p.toDataURL('image/jpeg', q); while (foto.length > 400000 && q > 0.4) { q -= 0.1; foto = p.toDataURL('image/jpeg', q); }
        const pref = (x, d) => { try { const v = localStorage.getItem('lembra.st.' + x); return v === null ? d : v === '1'; } catch { return d; } };
        await call('/friends/story-post', { photo: foto, caption: '', podeCom: pref('com', true), podeRp: pref('rp', false) });
        import('./stories.js').then((m) => m.refreshFeed()).then(() => window.__calRender && window.__calRender()).catch(() => {});
        toast('No seu story do Lembra! 🔔'); feliz(); b.classList.add('is-ok');
      } catch (e) { toast(e.message || 'Não consegui postar agora.'); }
      b.disabled = false; return;
    }
    try {
      if (navigator.canShare?.({ files: [arq.file] })) {
        if (k === 'insta') toast('Escolha Instagram e depois Stories'); if (k === 'face') toast('Escolha Facebook na lista'); if (k === 'zap') toast('Escolha WhatsApp na lista');
        await navigator.share(k === 'insta' || k === 'face' ? { files: [arq.file] } : { files: [arq.file], text: txt }); return feliz();
      }
    } catch (e) { if (e && e.name === 'AbortError') return; }
    // sem a lista de compartilhar (computador)
    if (k === 'zap') return void open(`https://wa.me/?text=${encodeURIComponent(txt)}`, '_blank', 'noopener');
    if (k === 'face') return void open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(LINK())}`, '_blank', 'noopener');
    salva(k === 'insta' ? 'Imagem salva. Abra o Instagram e poste 📸' : 'Imagem salva ✓');
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
    if (Date.now() - (n.at || 0) < 5 * 60e3) abreFrase(n);
  } catch { /* ok */ }
}
/* teste local */
try { if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname) && localStorage.getItem('cal.emulator') === '1') window.__lembraFrase = { abreFrase, temaDe, store }; } catch { /* ok */ }
