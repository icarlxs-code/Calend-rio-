/* Cartões do time no estilo oficial do Lembra (o das campanhas): fundo creme ou céu, manchas orgânicas,
   título grosso com pílula amarela, raios de brilho, o Lembra grande com a camisa do time e o placar em destaque.
   Vale para vitória, empate, derrota e notícia. Cada cartão sorteia o visual e as frases (não fica repetitivo). */
import { porTime } from '../functions/times.js';
import { ALMA } from './times-alma.js';
import { roupa } from './roupas.js';
import { retrato } from './sininho.js';

const W = 1080, H = 1920, MARROM = '#2A1408', AMARELO = '#FFD21E', ROXO = '#5B2A86', VERMELHO = '#E8392E', CREME = '#FFF4E3';
const pick = (L, s) => L[Math.abs(s) % L.length];
const fim = (t) => (/[!?.]$/.test(t) ? t : `${t}!`);
const img = (src) => new Promise((ok) => { const i = new Image(); i.crossOrigin = 'anonymous'; i.onload = () => ok(i); i.onerror = () => ok(null); i.src = src; });
const lum = (hex) => { const n = parseInt(String(hex).slice(1), 16); return ((n >> 16) * 299 + ((n >> 8) & 255) * 587 + (n & 255) * 114) / 1000; };
const quebra = (c, t, larg) => { const out = []; let l = ''; for (const w of String(t).split(' ')) { const n = l ? `${l} ${w}` : w; if (c.measureText(n).width > larg && l) { out.push(l); l = w; } else l = n; } if (l) out.push(l); return out; };
const fonte = (p, s) => `${p} ${s}px Nunito, "Nunito Variable", system-ui, sans-serif`;

/** dados do time para o cartão (cores, camisa, frases) */
export function timeDoCartao(id) {
  const t = porTime(id); if (!t) return null;
  const a = ALMA[id] || {};
  return { id, nome: t.nome, sigla: t.sigla || t.nome.slice(0, 3).toUpperCase(), cores: t.cores || ['#FF6A1A', '#111111'], e: a.e || '⚽', ap: a.ap || t.nome, grito: a.grito || `Vamos, ${t.nome}!`, est: a.est || '', frase: a.frase || `${t.nome} de coração`, cam: a.cam || { c: 'lisa', cores: t.cores || ['#FF6A1A', '#FFFFFF'] } };
}

/* ---------- peças do desenho ---------- */
function mancha(c, x, y, r, cor, s) {
  c.fillStyle = cor; c.beginPath();
  const n = 7; for (let i = 0; i <= n; i++) { const a = (i / n) * Math.PI * 2, k = r * (0.82 + 0.22 * Math.sin(i * 2.3 + s)); const px = x + Math.cos(a) * k, py = y + Math.sin(a) * k; if (!i) c.moveTo(px, py); else { const a0 = ((i - 0.5) / n) * Math.PI * 2, k0 = r * (0.95 + 0.18 * Math.cos(i * 1.7 + s)); c.quadraticCurveTo(x + Math.cos(a0) * k0, y + Math.sin(a0) * k0, px, py); } }
  c.closePath(); c.fill();
}
function raios(c, x, y, lado, cor, tam = 1) { // os tracinhos de brilho das campanhas
  c.save(); c.strokeStyle = cor; c.lineCap = 'round'; c.lineWidth = 14 * tam;
  [[-40, 0], [-12, 1], [16, 2]].forEach(([ang], i) => { const a = (ang * Math.PI) / 180, d = (lado < 0 ? Math.PI : 0); const r0 = 26 * tam, r1 = (70 + (i === 1 ? 14 : 0)) * tam; c.beginPath(); c.moveTo(x + Math.cos(a + d) * r0 * lado * lado, y + Math.sin(a) * r0); c.lineTo(x + Math.cos(a + d) * r1, y + Math.sin(a) * r1); c.stroke(); });
  c.restore();
}
function pilula(c, x, y, w, h, cor, sombra = true) {
  c.save(); if (sombra) { c.shadowColor = 'rgba(60,20,0,.22)'; c.shadowBlur = 24; c.shadowOffsetY = 8; }
  c.fillStyle = cor; c.beginPath(); c.roundRect(x, y, w, h, h / 2); c.fill(); c.restore();
}
function sino(c, x, y, s) { // o sininho do logo
  c.save(); c.translate(x, y); c.scale(s, s);
  c.fillStyle = '#FFB000'; c.beginPath(); c.arc(0, -10, 26, Math.PI, 0); c.lineTo(32, 22); c.quadraticCurveTo(0, 30, -32, 22); c.closePath(); c.fill();
  c.fillStyle = '#FF7A00'; c.beginPath(); c.arc(0, 28, 8, 0, 7); c.fill();
  c.strokeStyle = '#FFB000'; c.lineWidth = 7; c.beginPath(); c.arc(0, -38, 9, Math.PI, 0); c.stroke();
  c.restore();
}
/** veste o Lembra com uma camiseta de verdade (gola, mangas e barra), no padrão do time.
    Medidas tiradas do desenho do Lembra: a boca termina em ~70% da altura, o corpo vai de ~21% a ~79% da largura
    e os pés começam em ~86%. A camiseta fica abaixo da boca: o rosto nunca é coberto. */
function camisa(cv, cam) {
  const w = cv.width, h = cv.height, o = document.createElement('canvas'); o.width = w; o.height = h;
  const c = o.getContext('2d'); c.drawImage(cv, 0, 0);
  const X = (x) => x * w, Y = (y) => y * h, cs = cam.cores;
  const forma = () => {
    c.beginPath();
    c.moveTo(X(0.37), Y(0.712));
    c.quadraticCurveTo(X(0.5), Y(0.75), X(0.63), Y(0.712));            // gola
    c.quadraticCurveTo(X(0.71), Y(0.716), X(0.76), Y(0.73));           // ombro direito
    c.lineTo(X(0.83), Y(0.765)); c.lineTo(X(0.805), Y(0.805));          // manga direita
    c.lineTo(X(0.77), Y(0.792));
    c.quadraticCurveTo(X(0.785), Y(0.83), X(0.78), Y(0.858));          // lateral direita
    c.quadraticCurveTo(X(0.5), Y(0.875), X(0.22), Y(0.858));           // barra
    c.quadraticCurveTo(X(0.215), Y(0.83), X(0.23), Y(0.792));          // lateral esquerda
    c.lineTo(X(0.195), Y(0.805)); c.lineTo(X(0.17), Y(0.765));          // manga esquerda
    c.lineTo(X(0.24), Y(0.73));
    c.quadraticCurveTo(X(0.29), Y(0.716), X(0.37), Y(0.712));          // ombro esquerdo
    c.closePath();
  };
  c.save(); c.shadowColor = 'rgba(60,20,0,.25)'; c.shadowBlur = w * 0.012; c.shadowOffsetY = h * 0.006; forma(); c.fillStyle = cs[0]; c.fill(); c.restore();
  c.save(); forma(); c.clip();
  const x0 = X(0.15), x1 = X(0.85), y0 = Y(0.7), y1 = Y(0.88), alt = y1 - y0;
  if (cam.c === 'lh') { const n = 6; for (let i = 0; i < n; i++) { c.fillStyle = cs[i % cs.length]; c.fillRect(x0, y0 + (i * alt) / n, x1 - x0, alt / n + 1); } }
  else if (cam.c === 'lv' || cam.c === 'tri') { const lv = w * 0.05; for (let i = 0, x = X(0.5) - lv * 7.5; x < x1; i++, x += lv) { c.fillStyle = cam.c === 'tri' ? cs[i % 3] : cs[i % cs.length]; c.fillRect(x, y0, lv + 1, alt); } }
  else if (cam.c === 'diag') { c.fillStyle = cs[1]; c.beginPath(); c.moveTo(X(0.3), y0); c.lineTo(X(0.4), y0); c.lineTo(X(0.72), y1); c.lineTo(X(0.62), y1); c.closePath(); c.fill(); }
  else if (cam.c === 'faixa') { c.fillStyle = cs[1]; c.fillRect(x0, Y(0.765), x1 - x0, h * 0.03); if (cs[2]) { c.fillStyle = cs[2]; c.fillRect(x0, Y(0.795), x1 - x0, h * 0.02); } }
  // tecido: luz no peito, sombra na barra e nas laterais
  const g = c.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, 'rgba(255,255,255,.22)'); g.addColorStop(0.45, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(0,0,0,.18)');
  c.fillStyle = g; c.fillRect(x0, y0, x1 - x0, alt);
  const gl = c.createLinearGradient(X(0.2), 0, X(0.8), 0); gl.addColorStop(0, 'rgba(0,0,0,.14)'); gl.addColorStop(0.25, 'rgba(0,0,0,0)'); gl.addColorStop(0.75, 'rgba(0,0,0,0)'); gl.addColorStop(1, 'rgba(0,0,0,.14)');
  c.fillStyle = gl; c.fillRect(x0, y0, x1 - x0, alt);
  c.restore();
  // contorno e gola na segunda cor (acabamento)
  c.save(); forma(); c.lineWidth = w * 0.006; c.strokeStyle = 'rgba(60,20,0,.35)'; c.stroke(); c.restore();
  const golaCor = cs.find((x) => x.toLowerCase() !== String(cs[0]).toLowerCase()) || '#fff';
  c.save(); c.beginPath(); c.moveTo(X(0.37), Y(0.712)); c.quadraticCurveTo(X(0.5), Y(0.75), X(0.63), Y(0.712)); c.lineWidth = h * 0.012; c.strokeStyle = golaCor; c.lineCap = 'round'; c.stroke(); c.restore();
  return o;
}
/** um Lembra pequeno da torcida, com a camisa */
function torcedor(c, x, y, s, cam, k) {
  c.save(); c.translate(x, y); c.scale(s, s);
  c.fillStyle = '#FF7A1F'; c.beginPath(); c.arc(0, -24, 24, Math.PI, 0); c.lineTo(30, 18); c.quadraticCurveTo(0, 30, -30, 18); c.closePath(); c.fill();
  c.save(); c.beginPath(); c.rect(-30, 0, 60, 24); c.clip(); const cs = cam.cores;
  c.fillStyle = cs[0]; c.fillRect(-30, 0, 60, 24);
  if (cam.c === 'lv' || cam.c === 'tri') for (let i = 0; i < 6; i++) { c.fillStyle = cs[(i + k) % cs.length]; c.fillRect(-30 + i * 10, 0, 10, 24); }
  if (cam.c === 'lh') for (let i = 0; i < 4; i++) { c.fillStyle = cs[(i + k) % cs.length]; c.fillRect(-30, i * 6, 60, 6); }
  if (cam.c === 'faixa') { c.fillStyle = cs[1]; c.fillRect(-30, 8, 60, 7); }
  if (cam.c === 'diag') { c.fillStyle = cs[1]; c.beginPath(); c.moveTo(-30, 0); c.lineTo(-18, 0); c.lineTo(30, 20); c.lineTo(30, 24); c.lineTo(18, 24); c.closePath(); c.fill(); }
  c.restore();
  c.fillStyle = '#fff'; c.beginPath(); c.arc(-9, -20, 6.5, 0, 7); c.arc(9, -20, 6.5, 0, 7); c.fill();
  c.fillStyle = '#231109'; c.beginPath(); c.arc(-8, -19, 3.4, 0, 7); c.arc(10, -19, 3.4, 0, 7); c.fill();
  c.strokeStyle = '#7a2a00'; c.lineWidth = 3; c.beginPath(); c.arc(0, -10, 6, 0.15, Math.PI - 0.15); c.stroke();
  // braço pra cima segurando nada: só a mão (vibrando)
  c.fillStyle = '#FF7A1F'; c.beginPath(); c.ellipse(k % 2 ? 30 : -30, -34, 7, 11, k % 2 ? 0.5 : -0.5, 0, 7); c.fill();
  c.restore();
}

/* ---------- textos ---------- */
const TXT = {
  vitoria: { h: ['GANHAMOS!', 'VENCEMOS!', 'É VITÓRIA!'], p: [(t) => `O ${t.ap} é o melhor!`, (t) => t.grito, (t) => `Que jogo, ${t.ap}!`], mood: 'comemora', selo: 'FIM DE JOGO' },
  empate: { h: ['EMPATAMOS!', 'FICOU NO EMPATE', 'UM PONTINHO!'], p: [(t) => `Bola pra frente, ${t.ap}!`, () => 'Ponto é ponto!', (t) => fim(t.frase)], mood: 'feliz', selo: 'FIM DE JOGO' },
  derrota: { h: ['NÃO FOI DESSA VEZ', 'HOJE NÃO DEU', 'A GENTE VOLTA!'], p: [(t) => `${t.ap}, tô junto!`, (t) => `Cabeça erguida, ${t.ap}!`, (t) => fim(t.frase)], mood: 'triste', selo: 'FIM DE JOGO' },
};
export const resultadoDe = (meu, dele) => (meu > dele ? 'vitoria' : meu === dele ? 'empate' : 'derrota');

/** fundo e manchas: 3 visuais, sorteados */
function cenario(c, t, visual, s) {
  const [a, b] = t.cores, claroA = lum(a) > 170;
  if (visual === 'ceu') { const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#2F8CF0'); g.addColorStop(1, '#1E63D6'); c.fillStyle = g; }
  else if (visual === 'time') { const base = claroA ? b : a; const g = c.createLinearGradient(0, 0, W, H); g.addColorStop(0, base); g.addColorStop(1, lum(base) > 60 ? '#1a0d05' : '#2b2b2b'); c.fillStyle = g; }
  else c.fillStyle = CREME;
  c.fillRect(0, 0, W, H);
  const corM = visual === 'creme' ? [claroA ? b : a, AMARELO] : [AMARELO, claroA ? a : b];
  c.globalAlpha = visual === 'creme' ? 0.95 : 0.9;
  mancha(c, -40, 120, 230, corM[1], s); mancha(c, W + 30, 330, 210, corM[0], s + 1);
  mancha(c, -60, H - 260, 240, corM[0], s + 2); mancha(c, W + 40, H - 120, 230, corM[1], s + 3);
  c.globalAlpha = 1;
  if (visual === 'ceu') { c.fillStyle = 'rgba(255,255,255,.75)'; [[150, 250], [880, 210]].forEach(([x, y]) => { c.beginPath(); c.ellipse(x, y, 90, 34, 0, 0, 7); c.ellipse(x + 60, y - 18, 60, 30, 0, 0, 7); c.fill(); }); }
}

/** o cartão de fim de jogo: vitória, empate ou derrota */
export async function cartaoResultado({ time, meu, dele, rivalId = '', rival = '', seed = 0, visual } = {}) {
  const t = timeDoCartao(time); if (!t) return null;
  const r = rivalId ? timeDoCartao(rivalId) : null, rivalNome = r ? r.nome : rival || 'Adversário', rivalSigla = r ? r.sigla : (rivalNome.slice(0, 3).toUpperCase());
  const res = resultadoDe(meu, dele), T = TXT[res];
  try { await document.fonts.load(fonte(900, 100)); } catch { /* segue */ }
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const c = cv.getContext('2d');
  visual = visual || (res === 'derrota' ? 'creme' : pick(['creme', 'ceu', 'time'], seed));
  cenario(c, t, visual, seed % 7);
  const escuro = visual !== 'creme', corTit = escuro ? '#FFFFFF' : MARROM;
  // logo
  sino(c, W / 2 - 150, 120, 1.25); c.fillStyle = corTit; c.font = fonte(900, 76); c.textAlign = 'left'; c.fillText('Lembra', W / 2 - 100, 146);
  raios(c, W / 2 + 205, 96, 1, AMARELO, 0.6);
  // título
  c.textAlign = 'center'; c.fillStyle = corTit; c.save(); if (escuro) { c.shadowColor = 'rgba(0,0,0,.25)'; c.shadowBlur = 16; }
  const h1 = pick(T.h, seed); let tam = 150; c.font = fonte(900, tam); while (c.measureText(h1).width > W - 120 && tam > 80) { tam -= 6; c.font = fonte(900, tam); }
  c.fillText(h1, W / 2, 320); c.restore();
  // pílula amarela com a frase do time
  const p1 = pick(T.p, seed + 1)(t); c.font = fonte(900, 66); let pw = Math.min(W - 140, c.measureText(p1).width + 90);
  let fs = 66; while (c.measureText(p1).width > pw - 70 && fs > 40) { fs -= 4; c.font = fonte(900, fs); }
  pilula(c, (W - pw) / 2, 365, pw, 116, AMARELO); c.fillStyle = MARROM; c.fillText(p1, W / 2, 445);
  raios(c, (W - pw) / 2 - 20, 420, -1, AMARELO, 0.9); raios(c, (W + pw) / 2 + 20, 420, 1, AMARELO, 0.9);
  // cenário: estádio com a torcida de camisa
  const est = await img('assets/stories/32-estadio.webp');
  const sy = 560, sh = 820;
  if (est) {
    c.save(); c.beginPath(); c.roundRect(40, sy, W - 80, sh, 60); c.clip();
    const k = Math.max((W - 80) / est.width, sh / est.height); c.drawImage(est, (W - est.width * k) / 2, sy + (sh - est.height * k) / 2 - 60, est.width * k, est.height * k);
    const [a, b] = t.cores; c.globalAlpha = 0.28; c.fillStyle = lum(a) > 200 ? b : a; c.fillRect(40, sy, W - 80, sh); c.globalAlpha = 1;
    for (let row = 0; row < 3; row++) for (let i = 0; i < 10; i++) torcedor(c, 95 + i * 100 + (row % 2) * 50, sy + 120 + row * 70, 0.82 + row * 0.08, t.cam, row + i);
    c.restore();
    c.save(); c.lineWidth = 10; c.strokeStyle = escuro ? 'rgba(255,255,255,.9)' : '#fff'; c.beginPath(); c.roundRect(40, sy, W - 80, sh, 60); c.stroke(); c.restore();
  }
  // o Lembra com a camisa do time, bandeira e cachecol
  const v = { ...roupa('torcida', t.cores), mood: T.mood, boca: res === 'derrota' ? 'tristinha' : 'riso' }; // a camisa no lugar do cachecol
  let snh = await retrato(v, 1200, 0.6).catch(() => null);
  if (snh) { snh = camisa(snh, t.cam); const lw = 760, lh = lw * (snh.height / snh.width); c.drawImage(snh, (W - lw) / 2, sy + sh - lh + 80, lw, lh); }
  // placar: o número exato, grande, com as siglas
  const by = 1430;
  pilula(c, W / 2 - 200, by, 400, 74, ROXO); c.fillStyle = '#fff'; c.font = fonte(900, 38); c.fillText(T.selo, W / 2, by + 50);
  const cor2 = res === 'vitoria' ? VERMELHO : res === 'empate' ? '#2F8CF0' : '#5C4033';
  pilula(c, 90, by + 96, W - 180, 230, cor2);
  c.fillStyle = '#fff'; c.font = fonte(900, 44);
  c.fillText(t.sigla, 250, by + 170); c.fillText(rivalSigla, W - 250, by + 170);
  c.font = fonte(900, 170); c.fillStyle = res === 'vitoria' ? AMARELO : '#fff';
  c.fillText(`${meu}`, 250, by + 300); c.fillText(`${dele}`, W - 250, by + 300);
  c.fillStyle = '#fff'; c.font = fonte(900, 90); c.fillText('x', W / 2, by + 270);
  raios(c, 70, by + 210, -1, AMARELO, 0.8); raios(c, W - 70, by + 210, 1, AMARELO, 0.8);
  // o grito e o estádio
  c.font = fonte(800, 42); const linha = `${t.e} ${t.est || t.ap}`;
  c.fillStyle = corTit; c.fillText(linha, W / 2, by + 392);
  c.font = fonte(800, 30); c.fillStyle = escuro ? 'rgba(255,255,255,.85)' : 'rgba(42,20,8,.7)'; c.fillText('meulembra.com.br', W / 2, H - 34);
  return cv;
}

/** o cartão da notícia do time, no mesmo estilo */
export async function cartaoNoticia({ time, titulo, descricao = '', fonte: fnt = 'ESPN Brasil', seed = 0 } = {}) {
  const t = timeDoCartao(time) || { nome: 'Futebol', sigla: '', cores: ['#FF6A1A', '#2A1408'], e: '⚽', ap: 'Futebol', cam: { c: 'lisa', cores: ['#FF6A1A', '#fff'] } };
  try { await document.fonts.load(fonte(900, 100)); } catch { /* segue */ }
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const c = cv.getContext('2d');
  const visual = pick(['creme', 'ceu', 'time'], seed); cenario(c, t, visual, seed % 7);
  const escuro = visual !== 'creme', corTit = escuro ? '#fff' : MARROM;
  sino(c, W / 2 - 150, 120, 1.25); c.fillStyle = corTit; c.font = fonte(900, 76); c.textAlign = 'left'; c.fillText('Lembra', W / 2 - 100, 146);
  c.textAlign = 'center';
  pilula(c, W / 2 - 260, 210, 520, 92, VERMELHO); c.fillStyle = '#fff'; c.font = fonte(900, 50); c.fillText(`🚨 ${t.nome.toUpperCase()}`, W / 2, 274);
  raios(c, W / 2 - 290, 256, -1, AMARELO, 0.8); raios(c, W / 2 + 290, 256, 1, AMARELO, 0.8);
  // manchete em caixa clara (lê bem em qualquer fundo)
  c.font = fonte(900, 74); const linhas = quebra(c, titulo, W - 200).slice(0, 6);
  const bh = 80 + linhas.length * 88; pilula(c, 60, 360, W - 120, bh, escuro ? '#FFFFFF' : AMARELO); c.fillStyle = MARROM;
  linhas.forEach((l, i) => c.fillText(l, W / 2, 440 + i * 88));
  let y = 360 + bh + 70;
  if (descricao) { c.font = fonte(700, 44); c.fillStyle = corTit; quebra(c, descricao, W - 180).slice(0, 3).forEach((l) => { c.fillText(l, W / 2, y); y += 56; }); }
  // o estádio com a torcida e o Lembra surpreso, ocupando o espaço até o selo
  const sy = Math.max(y + 10, 980), sh = H - 300 - sy, est = await img('assets/stories/32-estadio.webp');
  if (est && sh > 260) {
    c.save(); c.beginPath(); c.roundRect(40, sy, W - 80, sh, 60); c.clip();
    const k = Math.max((W - 80) / est.width, sh / est.height); c.drawImage(est, (W - est.width * k) / 2, sy + (sh - est.height * k) / 2, est.width * k, est.height * k);
    c.globalAlpha = 0.25; c.fillStyle = lum(t.cores[0]) > 200 ? t.cores[1] : t.cores[0]; c.fillRect(40, sy, W - 80, sh); c.globalAlpha = 1;
    for (let i = 0; i < 10; i++) torcedor(c, 95 + i * 100, sy + 90, 0.85, t.cam, i);
    c.restore(); c.save(); c.lineWidth = 10; c.strokeStyle = '#fff'; c.beginPath(); c.roundRect(40, sy, W - 80, sh, 60); c.stroke(); c.restore();
  }
  const v = { ...roupa('torcida', t.cores), mood: 'surpreso' };
  let snh = await retrato(v, 1100, 0.6).catch(() => null);
  if (snh) { snh = camisa(snh, t.cam); const lw = Math.min(700, (sh + 120) * (snh.width / snh.height)), lh = lw * (snh.height / snh.width); c.drawImage(snh, (W - lw) / 2, H - 300 - lh + 70, lw, lh); }
  pilula(c, W / 2 - 300, H - 220, 600, 96, ROXO); c.fillStyle = '#fff'; c.font = fonte(900, 44); c.fillText('Li primeiro no Lembra 👀', W / 2, H - 157);
  c.font = fonte(800, 30); c.fillStyle = escuro ? 'rgba(255,255,255,.85)' : 'rgba(42,20,8,.7)'; c.fillText(`Fonte: ${fnt} · meulembra.com.br`, W / 2, H - 70);
  return cv;
}
