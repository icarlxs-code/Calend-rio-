/* Retrospectiva 2026: telas montadas só neste aparelho. Nada aqui vai para o servidor, para o painel ou para a conta.
   Compartilhar é um passo separado, depois da prévia fiel (a mesma arte que sai no arquivo). */
import { store } from './store.js';
import { le, totaisDoAno, maiorOfensiva, horarioFavorito, perfilDoAno, usaDono } from './retro.js';
import { sininho, alive, veste, act, retrato } from './sininho.js';
import { roupa } from './roupas.js';
import { icon } from './icons.js';
import { esc } from './utils.js';
import { isTeen, idade } from './teen.js';
import { toast } from './components.js';

const INI = Date.UTC(2026, 11, 1, 3), FIM = Date.UTC(2027, 0, 16, 3);
const naEpoca = (now = Date.now()) => (now >= INI && now < FIM) || (['localhost', '127.0.0.1'].includes(location.hostname) && (() => { try { return localStorage.getItem('lembra.retroTeste') === '1'; } catch { return false; } })());
const hoje = () => new Date().toISOString().slice(0, 10);
const naoHoje = () => { try { return localStorage.getItem('lembra.retroNao') === hoje(); } catch { return false; } };
const pode = () => idade() === null || idade() >= 13;
export const cartaoRetro = ({ perfil = false } = {}) => (naEpoca() && pode() && (perfil || !naoHoje()) ? `<section class="rtc"><span class="rtc__s">${sininho('feliz', { size: 92 })}</span><div><h3>Sua retrospectiva de 2026 chegou</h3><div class="rtc__b"><button class="btn btn--primary" data-action="retro">Ver meu 2026</button>${perfil ? '' : '<button class="btn btn--ghost" data-action="retro-nao">Não quero ver</button>'}</div></div></section>` : '');
export const naoQuero = () => { try { localStorage.setItem('lembra.retroNao', hoje()); } catch { /* ok */ } window.__calRender && window.__calRender(); };

const pl = (n, a, b) => `${n.toLocaleString('pt-BR')} ${n === 1 ? a : b}`;
const CAT = { reuniao: 'Reuniões', tarefa: 'Tarefas', lembrete: 'Lembretes', saude: 'Saúde', beleza: 'Beleza', pagar: 'Contas', aniversario: 'Aniversários', compromisso: 'Compromissos', compras: 'Compras', buscar: 'Buscar alguém', feed: 'Posts', reels: 'Reels', captacao: 'Captações', outro: 'Um pouco de tudo' };
/** as telas que têm o que mostrar (puro; sem amostra, a tela some) */
export function telas(ano, o = le(ano)) {
  const t = totaisDoAno(ano, o), of = maiorOfensiva(ano, o), h = horarioFavorito(ano, o), p = perfilDoAno(ano, o), L = [];
  L.push({ id: 'abre', f: '07-viagem', k: 'Seu ano no Lembra', g: '2026', s: 'Montamos este resumo neste aparelho, com os dados da sua conta. Ele não é enviado a ninguém até você compartilhar.', r: 'aniversario', x: 0.5, gesto: 'tchau' });
  if (t.curto) L.push({ id: 'dias', f: '01-manha', k: 'A gente se viu em', g: pl(Math.max(1, t.diasAtivos), 'dia', 'dias'), s: 'É só o começo da nossa história.', r: 'manha', x: 0.34, gesto: 'sim' });
  else if (t.conclusoes) L.push({ id: 'feitos', f: '11-conquista-semana', k: 'Você concluiu', g: pl(t.conclusoes, 'coisa', 'coisas'), s: [t.trabalho ? `${t.trabalho} no trabalho` : '', t.pessoal ? `${t.pessoal} na vida pessoal` : ''].filter(Boolean).join(' · '), r: 'conquista', x: 0.66, gesto: 'pulo' });
  if (t.aniversarios) L.push({ id: 'niver', f: '06-aniversario', k: 'Você lembrou no dia de', g: pl(t.aniversarios, 'aniversário', 'aniversários'), s: 'Teve gente sorrindo por sua causa.', r: 'aniversario', x: 0.3, gesto: 'riso' });
  if (!t.curto && t.copos) L.push({ id: 'agua', f: '17-agua', k: 'Você marcou', g: pl(t.copos, 'copo d’água', 'copos d’água'), s: `em ${pl(t.diasAgua, 'dia', 'dias')}`, r: 'agua', x: 0.62, gesto: 'olhaLados' });
  if (!t.curto && of) L.push({ id: 'ofensiva', f: '30-ofensiva', k: 'Sua maior ofensiva', g: `${of} dias`, s: 'seguidos por aqui, sem perder um.', r: 'treino', x: 0.4, gesto: 'balanca' });
  if (!t.curto && h !== null) L.push({ id: 'hora', f: h >= 18 || h < 5 ? '03-noite' : '29-manha-b', noite: h >= 18 || h < 5, k: 'Seu horário de resolver', g: `${h}h`, s: h >= 5 && h < 12 ? 'De manhã você voa.' : h < 18 && h >= 12 ? 'A tarde é sua.' : 'A noite rende com você.', r: h >= 18 || h < 5 ? 'sono' : 'manha', x: 0.68, gesto: 'pisca' });
  if (!t.curto && t.noHorario !== null && t.noHorario / t.medidos >= 0.3) L.push({ id: 'ponto', f: '10-trabalho', k: 'No horário', g: `${Math.round((t.noHorario / t.medidos) * 100)}%`, s: `${t.noHorario} de ${t.medidos} no tempo certo.`, r: 'trabalho', x: 0.32, gesto: 'sim' });
  if (!t.curto && t.emblemas) L.push({ id: 'emblemas', f: '05-motivacao', k: 'Você ganhou', g: pl(t.emblemas, 'emblema', 'emblemas'), s: 'e cada um tem uma história.', r: 'forca', x: 0.6, gesto: 'pulo' });
  if (!t.curto && t.categoria) L.push({ id: 'jeito', f: '12-lembrete', k: 'O que mais passou por aqui', g: CAT[t.categoria] || 'Compromissos', s: 'O assunto campeão do seu ano.', r: 'estudo', x: 0.36, gesto: 'pensa' });
  const man = [!t.curto && t.conclusoes ? pl(t.conclusoes, 'coisa feita', 'coisas feitas') : '', !t.curto && of ? `${of} dias de ofensiva` : '', t.aniversarios ? pl(t.aniversarios, 'aniversário lembrado', 'aniversários lembrados') : '', !t.curto && t.copos ? pl(t.copos, 'copo d’água', 'copos d’água') : ''].filter(Boolean).slice(0, 3);
  L.push({ id: 'fim', f: '03-noite', noite: true, k: 'Em 2026 você foi', g: p, s: man.join('\n') || 'Que venha 2027, juntos.', r: 'conquista', x: 0.5, gesto: 'pulo' });
  return L;
}
const veste1 = (s) => { const r = roupa(s.r), alto = (x) => x && x[0] === 'cima'; return alto(r.l) && alto(r.r) ? { ...r, l: ['baixo'] } : r; }; // nunca os dois braços erguidos
const imgs = new Map();
const img = (n) => { if (!imgs.has(n)) imgs.set(n, new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => ok(null); i.src = `assets/stories/${n}.webp`; })); return imgs.get(n); };
function quebra(c, t, w) { const out = []; for (const par of String(t).split('\n')) { let l = ''; for (const p of par.split(' ')) { const n = l ? `${l} ${p}` : p; if (c.measureText(n).width > w && l) { out.push(l); l = p; } else l = n; } out.push(l); } return out; }
/** a arte 1080×1920; a mesma da tela e do arquivo */
export async function desenha(s, { mascote = true } = {}) {
  await Promise.all([document.fonts?.load('900 120px Nunito'), document.fonts?.load('700 50px Nunito')].map((p) => p && p.catch(() => {})));
  const cv = document.createElement('canvas'); cv.width = 1080; cv.height = 1920; const c = cv.getContext('2d'), i = await img(s.f), cor = s.noite ? '#fff' : '#201008';
  c.fillStyle = s.noite ? '#0A0A0A' : '#FFF6EE'; c.fillRect(0, 0, 1080, 1920);
  if (i) { const k = Math.max(1080 / i.width, 1920 / i.height); c.drawImage(i, (1080 - i.width * k) / 2, (1920 - i.height * k) / 2, i.width * k, i.height * k); }
  const g = c.createLinearGradient(0, 0, 0, 1000), a = s.noite ? '10,10,10' : '255,246,238'; g.addColorStop(0, `rgba(${a},.96)`); g.addColorStop(0.62, `rgba(${a},.88)`); g.addColorStop(1, `rgba(${a},0)`); c.fillStyle = g; c.fillRect(0, 0, 1080, 1000);
  c.textAlign = 'center'; c.fillStyle = s.noite ? '#FFB27A' : '#B8430A'; c.font = '800 52px Nunito, system-ui, sans-serif'; let y = 300; for (const l of quebra(c, s.k, 880)) { c.fillText(l, 540, y); y += 62; }
  c.fillStyle = cor; let F = s.g.length < 6 ? 230 : s.g.length < 12 ? 150 : s.g.length < 22 ? 112 : 92; c.font = `900 ${F}px Nunito, system-ui, sans-serif`; let L = quebra(c, s.g, 930); while (L.length > 3) { F -= 10; c.font = `900 ${F}px Nunito, system-ui, sans-serif`; L = quebra(c, s.g, 930); } y += F * 0.72; for (const l of L) { c.fillText(l, 540, y); y += F * 1.06; }
  y -= F * 0.34;
  const fs = s.id === 'abre' ? 42 : 50; c.font = `700 ${fs}px Nunito, system-ui, sans-serif`; y += s.id === 'abre' ? -20 : 4; for (const l of quebra(c, s.s, 860)) { c.fillText(l, 540, y); y += fs * 1.35; }
  if (mascote) { const m = await retrato(veste1(s), 1200); if (m) { const W = 820, H = (W * m.height) / m.width; c.drawImage(m, 1080 * s.x - W / 2, 1690 - H, W, H); } }
  c.font = '700 32px Nunito, system-ui, sans-serif'; c.fillStyle = s.noite ? 'rgba(255,255,255,.86)' : 'rgba(32,16,8,.8)'; c.fillText('Gerado no Lembra · eu escolhi compartilhar', 540, 1850);
  return cv;
}
const arquivo = (cv) => new Promise((ok) => cv.toBlob((b) => ok(new File([b], 'meu-2026-no-lembra.png', { type: 'image/png' })), 'image/png'));
async function compartilha(s) {
  const cv = await desenha(s), w = document.createElement('div'); w.className = 'rtp'; w.setAttribute('role', 'dialog'); w.setAttribute('aria-label', 'Prévia');
  w.innerHTML = `<img alt="Prévia da imagem" src="${cv.toDataURL('image/jpeg', 0.9)}"><div class="rtp__b"><button class="btn btn--soft" data-n>Cancelar</button><button class="btn btn--primary" data-s>Compartilhar</button></div>`;
  document.body.appendChild(w); w.querySelector('[data-n]').onclick = () => w.remove();
  w.querySelector('[data-s]').onclick = async (e) => { e.currentTarget.disabled = true; const f = await arquivo(cv); try { if (navigator.canShare?.({ files: [f] })) { await navigator.share({ files: [f] }); w.remove(); return; } } catch (er) { if (er && er.name === 'AbortError') { e.target.disabled = false; return; } } const a = document.createElement('a'); a.href = URL.createObjectURL(f); a.download = f.name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); toast('Imagem salva ✓'); w.remove(); };
}
const podeComp = () => { if (!isTeen()) return true; try { return localStorage.getItem('lembra.retroComp') === '1'; } catch { return false; } };
let aberta = null;
export async function abreRetro(ano = 2026) {
  if (aberta || !pode()) return; usaDono(store.user?.uid || '');
  const T = telas(ano); let i = 0, vez = 0;
  const w = document.createElement('div'); w.className = 'rt'; w.tabIndex = -1; w.setAttribute('role', 'dialog'); w.setAttribute('aria-modal', 'true'); w.setAttribute('aria-label', 'Retrospectiva 2026');
  w.innerHTML = `<div class="rt__bars">${T.map(() => '<i><b></b></i>').join('')}</div><button class="rt__x" data-x aria-label="Fechar">${icon('x', 26)}</button><div class="rt__palco"><div class="rt__art"><div data-art></div><span class="rt__snh">${sininho('feliz', { size: 250 })}</span></div></div><button class="rt__z rt__z--l" data-l aria-label="Voltar"></button><button class="rt__z rt__z--r" data-r aria-label="Próxima"></button><div class="rt__pe">${isTeen() ? '' : ''}<button class="btn btn--soft" data-c>${icon('share', 20)} Compartilhar</button></div>`;
  document.body.appendChild(w); aberta = w; alive(); const q = (s) => w.querySelector(s), e = q('.rt__snh [data-snh]');
  const fecha = () => { aberta = null; document.removeEventListener('keydown', tecla, true); w.classList.add('is-out'); setTimeout(() => w.remove(), 250); };
  const mostra = async () => {
    const s = T[i], minha = ++vez; w.classList.toggle('is-noite', !!s.noite); w.querySelectorAll('.rt__bars i').forEach((b, k) => b.classList.toggle('is-on', k <= i));
    const cv = await desenha(s, { mascote: false }); if (minha !== vez) return;
    const a = q('[data-art]'); cv.className = 'rt__cv'; cv.setAttribute('role', 'img'); cv.setAttribute('aria-label', `${s.k} ${s.g}. ${s.s}`); a.replaceChildren(cv);
    const m = q('.rt__snh'); m.style.left = `${s.x * 100}%`; m.classList.remove('is-in'); void m.offsetWidth; m.classList.add('is-in'); veste(e, veste1(s)); if (!matchMedia('(prefers-reduced-motion: reduce)').matches) setTimeout(() => minha === vez && act(e, s.gesto), 500);
    q('[data-c]').textContent = podeComp() ? 'Compartilhar' : 'Liberar compartilhar'; if (T[i + 1]) img(T[i + 1].f);
  };
  const anda = (n) => { if (i + n < 0) return; if (i + n >= T.length) return fecha(); i += n; mostra(); };
  const tecla = (ev) => { if (document.querySelector('.rtp')) return; if (ev.key === 'Escape') fecha(); else if (ev.key === 'ArrowRight' || (ev.key === 'Enter' && document.activeElement === w)) anda(1); else if (ev.key === 'ArrowLeft') anda(-1); };
  document.addEventListener('keydown', tecla, true);
  q('[data-x]').onclick = fecha; q('[data-l]').onclick = () => anda(-1); q('[data-r]').onclick = () => anda(1);
  q('[data-c]').onclick = () => { if (!podeComp()) { try { localStorage.setItem('lembra.retroComp', '1'); } catch { /* ok */ } mostra(); return; } compartilha(T[i]); };
  requestAnimationFrame(() => w.classList.add('is-in')); w.focus({ preventScroll: true }); mostra();
}
