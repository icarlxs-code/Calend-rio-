/* Frase da notificação (motivacional, bíblica, cuidado, dica): tocou no aviso → a frase abre DENTRO do app
   e fica na tela até a pessoa fechar. Dá para compartilhar como imagem pronta para stories/feed, em modelos
   com personalidade diferente — e sempre com a marca e o endereço do Lembra (quem vê sabe de onde veio). */
import { icon } from './icons.js';
import { esc } from './utils.js';
import { toast } from './components.js';
import { CONFIG } from '../config.js';

const SITE = () => (CONFIG.siteUrl || 'https://meulembra.com.br/').replace(/^https?:\/\//, '').replace(/\/$/, '');
const HIST = 'lembra.frases';

/* separa a referência bíblica do texto: "… — Salmos 23:1" ou "… (Filipenses 4:13)" */
export function partes(body = '') {
  let t = String(body).trim(), ref = '';
  const m = t.match(/\s*[—–-]\s*([1-3]?\s?[A-ZÁÉÍÓÚÂÊÔÃÕÇ][\wÀ-ÿ]+(?:\s[\wÀ-ÿ]+)?\s\d+[:.]\d+(?:[-–]\d+)?)\s*\.?$/) || t.match(/\s*\(([1-3]?\s?[A-ZÁÉÍÓÚÂÊÔÃÕÇ][\wÀ-ÿ]+(?:\s[\wÀ-ÿ]+)?\s\d+[:.]\d+(?:[-–]\d+)?)\)\s*\.?$/);
  if (m) { ref = m[1].trim(); t = t.slice(0, m.index).trim(); }
  t = t.replace(/^["“]|["”]$/g, '').trim();
  return { texto: t, ref };
}
/* é frase (pra abrir no app)? os avisos de compromisso e de ranking continuam indo pra tela deles */
export const ehFrase = (n) => !!n && !!n.body && (n.tag === 'p-amigo' || n.tag === 'coach' || n.tag === 'frase') && !['agenda', 'rank'].includes(n.kind);

/* ---------- modelos (cada um com a sua personalidade) ---------- */
const SANS = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
const SERIF = 'Georgia, "Times New Roman", "Noto Serif", serif';
export const MODELOS = [
  { id: 'fogo', nome: 'Fogo', snh: 'comemora', fundo: ['#FFB054', '#FF6B1A', '#C2370C'], cor: '#FFFFFF', fonte: SANS, peso: 800, logo: 'branco', sub: 'rgba(255,255,255,.85)' },
  { id: 'noite', nome: 'Noite', snh: 'amor', fundo: ['#1E2A5A', '#0E1330'], cor: '#F6EBDD', fonte: SERIF, peso: 400, italico: true, logo: 'branco', sub: '#FFB27A', estrelas: true },
  { id: 'papel', nome: 'Papel', snh: 'acena', fundo: ['#F8F1E4', '#EFE3CD'], cor: '#2B1A0E', fonte: SERIF, peso: 700, logo: 'preto', sub: '#C2560E', aspas: '#FF6B1A' },
  { id: 'neon', nome: 'Neon', snh: 'danca', fundo: ['#111116', '#050507'], cor: '#FFFFFF', fonte: SANS, peso: 900, logo: 'branco', sub: '#FF8A3D', brilho: '#FF6B1A', grade: true },
  { id: 'por', nome: 'Pôr do sol', snh: 'amor', fundo: ['#FF8A5B', '#E2508C', '#5B3FD0'], cor: '#FFFFFF', fonte: SANS, peso: 800, logo: 'branco', sub: 'rgba(255,255,255,.9)' },
  { id: 'minimal', nome: 'Minimal', snh: 'desconfiado', fundo: ['#FFFFFF', '#FFFFFF'], cor: '#111111', fonte: SANS, peso: 900, logo: 'preto', sub: '#FF6B1A', moldura: '#FF6B1A', esquerda: true },
];
export const FORMATOS = { story: [1080, 1920], post: [1080, 1350] };

const cacheImg = new Map();
function img(src) {
  if (cacheImg.has(src)) return cacheImg.get(src);
  const p = new Promise((res) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = src; });
  cacheImg.set(src, p); return p;
}
function linhas(ctx, texto, larg) {
  const out = [];
  for (const par of texto.split(/\n+/)) {
    let l = '';
    for (const w of par.split(/\s+/)) { const t = l ? `${l} ${w}` : w; if (ctx.measureText(t).width > larg && l) { out.push(l); l = w; } else l = t; }
    if (l) out.push(l);
  }
  return out;
}
/* desenha o cartão no canvas (W×H) */
export async function desenha(canvas, { texto, ref, titulo }, mod, [W, H]) {
  canvas.width = W; canvas.height = H;
  const c = canvas.getContext('2d');
  // fundo
  const g = c.createLinearGradient(0, 0, W * 0.4, H);
  mod.fundo.forEach((cor, i) => g.addColorStop(mod.fundo.length === 1 ? 0 : i / (mod.fundo.length - 1), cor));
  c.fillStyle = g; c.fillRect(0, 0, W, H);
  if (mod.estrelas) { let s = 7; const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280); for (let i = 0; i < 140; i++) { c.globalAlpha = 0.25 + rnd() * 0.6; c.fillStyle = '#fff'; c.beginPath(); c.arc(rnd() * W, rnd() * H * 0.8, 1 + rnd() * 2.4, 0, 7); c.fill(); } c.globalAlpha = 1; }
  if (mod.grade) { c.strokeStyle = 'rgba(255,107,26,.10)'; c.lineWidth = 2; for (let x = 0; x < W; x += 90) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, H); c.stroke(); } for (let y = 0; y < H; y += 90) { c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); } }
  if (mod.id === 'fogo' || mod.id === 'por') { const r = c.createRadialGradient(W * 0.85, H * 0.12, 10, W * 0.85, H * 0.12, W * 0.9); r.addColorStop(0, 'rgba(255,255,255,.28)'); r.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = r; c.fillRect(0, 0, W, H); }
  if (mod.moldura) { c.strokeStyle = mod.moldura; c.lineWidth = 14; c.strokeRect(44, 44, W - 88, H - 88); }
  const M = 110, topo = H > 1500 ? 330 : 250;
  // logo (de onde veio)
  const logo = await img(`media/marca/completa-${mod.logo}.png`);
  if (logo) { const lh = H > 1500 ? 190 : 150, lw = (logo.width / logo.height) * lh; c.drawImage(logo, mod.esquerda ? M - 20 : (W - lw) / 2, topo - lh - 20, lw, lh); }
  // título pequeno (ex.: "Versículo do dia")
  if (titulo) { c.font = `800 36px ${SANS}`; c.fillStyle = mod.sub; c.textAlign = mod.esquerda ? 'left' : 'center'; c.fillText(titulo.toUpperCase().split('').join(String.fromCharCode(8202)), mod.esquerda ? M : W / 2, topo + 20); }
  // aspas grandes
  if (mod.aspas) { c.font = `700 260px ${SERIF}`; c.fillStyle = mod.aspas; c.textAlign = 'left'; c.globalAlpha = 0.9; c.fillText('“', M - 20, topo + 250); c.globalAlpha = 1; }
  // texto: o maior tamanho que couber na área
  const areaH = H - topo - (H > 1500 ? 760 : 560), larg = W - M * 2;
  let fs = 124, ls;
  for (; fs >= 40; fs -= 4) { c.font = `${mod.italico ? 'italic ' : ''}${mod.peso} ${fs}px ${mod.fonte}`; ls = linhas(c, texto, larg); if (ls.length * fs * 1.25 <= areaH) break; }
  const alt = ls.length * fs * 1.25;
  let y = topo + 90 + Math.max(0, (areaH - alt) / 2) + fs;
  c.textAlign = mod.esquerda ? 'left' : 'center'; c.fillStyle = mod.cor;
  if (mod.brilho) { c.shadowColor = mod.brilho; c.shadowBlur = 38; }
  for (const l of ls) { c.fillText(l, mod.esquerda ? M : W / 2, y); y += fs * 1.25; }
  c.shadowBlur = 0;
  if (ref) { c.font = `700 40px ${SANS}`; c.fillStyle = mod.sub; c.fillText(`— ${ref}`, mod.esquerda ? M : W / 2, y + 30); }
  // mascote
  const snh = await img(`media/lp/snh-${mod.snh}.webp`);
  if (snh) {
    if (H > 1500) { const sh = 380, sw = (snh.width / snh.height) * sh; c.drawImage(snh, mod.esquerda ? W - sw - 70 : (W - sw) / 2, H - sh - 250, sw, sh); }
    else { const sh = 210, sw = (snh.width / snh.height) * sh; c.drawImage(snh, W - sw - 70, H - sh - 165, sw, sh); } // feed: no cantinho, sem cobrir o texto
  }
  // rodapé: endereço (quem vê sabe onde baixar)
  c.textAlign = 'center'; c.fillStyle = mod.sub; c.font = `800 38px ${SANS}`;
  c.fillText(SITE(), W / 2, H - (H > 1500 ? 150 : 118));
  c.font = `500 30px ${SANS}`; c.fillStyle = mod.cor; c.globalAlpha = 0.75;
  c.fillText('A agenda que lembra de tudo por você', W / 2, H - (H > 1500 ? 100 : 76));
  c.globalAlpha = 1;
  return canvas;
}

const TITULO = { verse: 'Versículo do dia', morning: 'Bom dia', night: 'Boa noite', mind: 'Pra pensar', water: 'Cuidado com você', habit: 'Pequeno hábito', checkin: 'Pra hoje', streak: 'Ofensiva', coach: 'Dica do Lembra' };
function guarda(n) { try { const l = JSON.parse(localStorage.getItem(HIST) || '[]').filter((x) => x.body !== n.body); l.unshift({ title: n.title, body: n.body, kind: n.kind || '', tag: n.tag || '', at: Date.now() }); localStorage.setItem(HIST, JSON.stringify(l.slice(0, 30))); } catch { /* ok */ } }
export const historico = () => { try { return JSON.parse(localStorage.getItem(HIST) || '[]'); } catch { return []; } };

/* ---------- a frase aberta no app (fica até a pessoa fechar) ---------- */
export function abreFrase(n) {
  if (!ehFrase(n)) return false;
  document.querySelector('.frs')?.remove();
  guarda(n);
  const { texto, ref } = partes(n.body);
  const titulo = TITULO[n.kind] || TITULO[n.tag] || '';
  let mi = Math.floor(Math.random() * MODELOS.length), fmt = 'story', url = '';
  const w = document.createElement('div');
  w.className = 'frs'; w.setAttribute('role', 'dialog'); w.setAttribute('aria-label', 'Frase');
  w.innerHTML = `<div class="frs__card">
      <button class="frs__x" data-x aria-label="Fechar">${icon('x', 22)}</button>
      <span class="frs__kick">${esc(titulo || n.title || 'Lembra')}</span>
      <blockquote class="frs__txt">${esc(texto)}</blockquote>
      ${ref ? `<cite class="frs__ref">— ${esc(ref)}</cite>` : ''}
      <div class="frs__prev"><img alt="Prévia da imagem" data-prev><span class="frs__load" data-load><i></i><i></i><i></i></span></div>
      <div class="frs__mods" role="radiogroup" aria-label="Modelo">${MODELOS.map((m, i) => `<button class="frs__mod${i === mi ? ' is-on' : ''}" data-mod="${i}" style="--a:${m.fundo[0]};--b:${m.fundo[m.fundo.length - 1]}"><i></i><small>${esc(m.nome)}</small></button>`).join('')}</div>
      <div class="frs__fmt"><button class="is-on" data-fmt="story">Story</button><button data-fmt="post">Feed</button></div>
      <button class="frs__go" data-share>${icon('share', 18)} Compartilhar</button>
      <button class="frs__copy" data-copy>${icon('copy', 16)} Copiar texto</button>
    </div>`;
  document.body.appendChild(w);
  const cv = document.createElement('canvas');
  const fecha = () => { w.classList.remove('is-in'); setTimeout(() => w.remove(), 220); };
  const pinta = async () => {
    const vez = (pinta.v = (pinta.v || 0) + 1);
    w.querySelector('[data-load]').hidden = false;
    await desenha(cv, { texto, ref, titulo }, MODELOS[mi], FORMATOS[fmt]);
    if (vez !== pinta.v) return;
    url = cv.toDataURL('image/jpeg', 0.9);
    const p = w.querySelector('[data-prev]'); p.src = url; p.parentElement.dataset.fmt = fmt;
    w.querySelector('[data-load]').hidden = true;
  };
  w.querySelector('[data-x]').onclick = fecha;
  w.addEventListener('click', (e) => { if (e.target === w) fecha(); });
  w.querySelectorAll('[data-mod]').forEach((b) => (b.onclick = () => { mi = +b.dataset.mod; w.querySelectorAll('[data-mod]').forEach((x) => x.classList.toggle('is-on', x === b)); pinta(); }));
  w.querySelectorAll('[data-fmt]').forEach((b) => (b.onclick = () => { fmt = b.dataset.fmt; w.querySelectorAll('[data-fmt]').forEach((x) => x.classList.toggle('is-on', x === b)); pinta(); }));
  w.querySelector('[data-copy]').onclick = async () => { try { await navigator.clipboard.writeText(`${texto}${ref ? ` — ${ref}` : ''}\n\nvia Lembra · ${SITE()}`); toast('Texto copiado 📋'); } catch { toast('Não consegui copiar.'); } };
  w.querySelector('[data-share]').onclick = async () => {
    const blob = await new Promise((r) => cv.toBlob(r, 'image/png'));
    const file = blob && new File([blob], `lembra-${MODELOS[mi].id}.png`, { type: 'image/png' });
    const txt = `${texto}${ref ? ` — ${ref}` : ''}\n\nvia Lembra · ${SITE()}`;
    try {
      if (file && navigator.canShare?.({ files: [file] })) { await navigator.share({ files: [file], text: txt }); }
      else { const a = document.createElement('a'); a.href = url; a.download = file?.name || 'lembra.jpg'; document.body.appendChild(a); a.click(); a.remove(); toast('Imagem salva. É só postar 📸'); }
      import('./mascote.js').then((M) => M.react('story')).catch(() => {});
    } catch { /* cancelou */ }
  };
  requestAnimationFrame(() => w.classList.add('is-in'));
  pinta();
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
