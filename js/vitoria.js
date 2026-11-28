/* Vitória do time: a notificação "GANHAMOS!" abre um cartão para postar no story.
   Estádio nas cores do time, arquibancada cheia de Lembras com a camisa do time, o Lembra torcedor na frente
   e o que o time representa (apelido, estádio, o grito da torcida). Sem escudo e sem desenho oficial de clube:
   só cores, nomes e fatos conhecidos. */
import { porTime } from '../functions/times.js';
import { roupa, cachecol } from './roupas.js';
import { retrato } from './sininho.js';

/* o que cada time representa (apelido, estádio, grito): texto e emoji, nada de marca registrada */
export const ALMA = {
  flamengo: { e: '🦅', apelido: 'Mengão', grito: 'O Urubu voa alto!', est: 'Maracanã', frase: 'Uma vez Flamengo, sempre Flamengo' },
  fluminense: { e: '🛡️', apelido: 'Flu', grito: 'Time de Guerreiros!', est: 'Maracanã', frase: 'Guerreiros até o fim' },
  vasco: { e: '⚓', apelido: 'Gigante da Colina', grito: 'O Almirante não afunda!', est: 'São Januário', frase: 'Vasco é Vasco' },
  botafogo: { e: '⭐', apelido: 'Glorioso', grito: 'A Estrela Solitária brilhou!', est: 'Nilton Santos', frase: 'Fogo neles!' },
  palmeiras: { e: '🐷', apelido: 'Verdão', grito: 'O Porco é gigante!', est: 'Allianz Parque', frase: 'Avanti, Palestra!' },
  corinthians: { e: '⚔️', apelido: 'Timão', grito: 'Vai, Corinthians!', est: 'Neo Química Arena', frase: 'Aqui é Corinthians' },
  saopaulo: { e: '👑', apelido: 'Tricolor Paulista', grito: 'Soberano!', est: 'Morumbis', frase: 'Vamos, São Paulo!' },
  santos: { e: '🐟', apelido: 'Peixe', grito: 'O Peixe tá voando!', est: 'Vila Belmiro', frase: 'Santos é Santos' },
  bragantino: { e: '🐂', apelido: 'Massa Bruta', grito: 'Força, Massa Bruta!', est: 'Nabi Abi Chedid', frase: 'Bragantino de garra' },
  mirassol: { e: '🦁', apelido: 'Leão', grito: 'O Leão rugiu!', est: 'Maião', frase: 'Mirassol de coração' },
  atleticomg: { e: '🐓', apelido: 'Galo', grito: 'Galo doido!', est: 'Arena MRV', frase: 'Eu acredito!' },
  cruzeiro: { e: '🦊', apelido: 'Raposa', grito: 'A Raposa é celeste!', est: 'Mineirão', frase: 'Cabuloso!' },
  gremio: { e: '⚔️', apelido: 'Imortal Tricolor', grito: 'Imortal!', est: 'Arena do Grêmio', frase: 'Até a pé nós iremos' },
  internacional: { e: '🎩', apelido: 'Colorado', grito: 'Vamo, Colorado!', est: 'Beira-Rio', frase: 'Clube do Povo' },
  juventude: { e: '🍇', apelido: 'Ju', grito: 'Papo de Ju!', est: 'Alfredo Jaconi', frase: 'Juventude de garra' },
  athletico: { e: '🌪️', apelido: 'Furacão', grito: 'O Furacão passou!', est: 'Ligga Arena', frase: 'Furacão!' },
  coritiba: { e: '🟢', apelido: 'Coxa', grito: 'Coxa Branca!', est: 'Couto Pereira', frase: 'Coritiba de coração' },
  bahia: { e: '🔵', apelido: 'Esquadrão de Aço', grito: 'Bora, Bahêa!', est: 'Fonte Nova', frase: 'Bahêa minha vida' },
  vitoria: { e: '🦁', apelido: 'Leão da Barra', grito: 'O Leão rugiu!', est: 'Barradão', frase: 'Vitória de raça' },
  fortaleza: { e: '🦁', apelido: 'Leão do Pici', grito: 'Laion!', est: 'Castelão', frase: 'Fortaleza de garra' },
  ceara: { e: '👴', apelido: 'Vozão', grito: 'Vozão!', est: 'Castelão', frase: 'Ceará de coração' },
  sport: { e: '🦁', apelido: 'Leão da Ilha', grito: 'Cazá, cazá!', est: 'Ilha do Retiro', frase: 'Sport de raça' },
  chapecoense: { e: '💚', apelido: 'Chape', grito: 'Vamos, Chape!', est: 'Arena Condá', frase: 'Força Chape' },
  criciuma: { e: '🐯', apelido: 'Tigre', grito: 'O Tigre rugiu!', est: 'Heriberto Hülse', frase: 'Tigre de garra' },
  goias: { e: '🟢', apelido: 'Verdão do Cerrado', grito: 'Vamo, Goiás!', est: 'Serrinha', frase: 'Goiás de coração' },
};
const geral = (t) => ({ e: '⚽', apelido: t.nome, grito: `Vamos, ${t.nome}!`, est: 'o estádio', frase: `${t.nome} no coração` });
export const almaDe = (id) => { const t = porTime(id); return t ? { ...geral(t), ...(ALMA[id] || {}), nome: t.nome, cores: t.cores || ['#FF6A1A', '#111111'] } : null; };

const img = (src) => new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => ok(null); i.src = src; });
const claro = (hex) => { const n = parseInt(String(hex).slice(1), 16); return ((n >> 16) * 299 + ((n >> 8) & 255) * 587 + (n & 255) * 114) / 1000 > 150; };
/* um Lembra pequeno da arquibancada, com a camisa do time (listras nas duas cores) */
function lembrinha(c, x, y, s, a, b, k) {
  c.save(); c.translate(x, y); c.scale(s, s);
  c.fillStyle = '#FF7A1F'; c.beginPath(); c.arc(0, -26, 24, Math.PI, 0); c.lineTo(30, 18); c.quadraticCurveTo(0, 30, -30, 18); c.closePath(); c.fill(); // sino
  c.beginPath(); c.rect(-27, 2, 54, 18); c.clip(); // camisa
  for (let i = -3; i < 4; i++) { c.fillStyle = (i + k) % 2 ? a : b; c.fillRect(i * 9 - 4, 0, 9, 24); }
  c.restore(); c.save(); c.translate(x, y); c.scale(s, s);
  c.fillStyle = '#fff'; c.beginPath(); c.arc(-9, -22, 6, 0, 7); c.arc(9, -22, 6, 0, 7); c.fill();
  c.fillStyle = '#222'; c.beginPath(); c.arc(-8, -21, 3, 0, 7); c.arc(10, -21, 3, 0, 7); c.fill();
  c.strokeStyle = '#7a2a00'; c.lineWidth = 3; c.beginPath(); c.arc(0, -12, 6, 0.1, Math.PI - 0.1); c.stroke();
  c.restore();
}
const quebra = (c, t, larg) => { const out = []; let l = ''; for (const w of t.split(' ')) { const n = l ? `${l} ${w}` : w; if (c.measureText(n).width > larg && l) { out.push(l); l = w; } else l = n; } if (l) out.push(l); return out; };

/** desenha o cartão 1080×1920 (formato de story) e devolve o canvas */
export async function cartaoVitoria({ time, meu, dele, rival = '', rivalId = '' }) {
  if (!rival && rivalId) rival = porTime(rivalId)?.nome || '';
  const A = almaDe(time); if (!A) return null;
  const [a, b] = A.cores, W = 1080, H = 1920, cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const c = cv.getContext('2d');
  // estádio + cores do time
  const fundo = await img('assets/stories/32-estadio.webp');
  if (fundo) { const r = Math.max(W / fundo.width, H / fundo.height); c.drawImage(fundo, (W - fundo.width * r) / 2, (H - fundo.height * r) / 2, fundo.width * r, fundo.height * r); }
  const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, a); g.addColorStop(0.55, `${b}cc`); g.addColorStop(1, a);
  c.globalAlpha = 0.72; c.fillStyle = g; c.fillRect(0, 0, W, H); c.globalAlpha = 1;
  // arquibancada lotada de Lembras com a camisa
  for (let row = 0; row < 7; row++) for (let i = 0; i < 13; i++) {
    const y = 330 + row * 92, x = 40 + i * 84 + (row % 2) * 42, s = 0.9 + row * 0.07;
    lembrinha(c, x, y, s, a, b, row + i);
  }
  // faixas de luz
  c.fillStyle = 'rgba(255,255,255,.08)'; for (let i = 0; i < 6; i++) { c.beginPath(); c.moveTo(i * 220 - 80, 0); c.lineTo(i * 220 + 40, 0); c.lineTo(i * 220 + 260, 1000); c.lineTo(i * 220 + 120, 1000); c.fill(); }
  // título
  const tx = claro(a) ? '#1a1a1a' : '#ffffff';
  c.textAlign = 'center'; c.fillStyle = tx; c.shadowColor = 'rgba(0,0,0,.35)'; c.shadowBlur = 18;
  c.font = '900 128px Nunito, system-ui, sans-serif'; c.fillText('GANHAMOS!', W / 2, 190);
  c.font = '800 54px Nunito, system-ui, sans-serif'; c.fillText(`${A.nome} ${meu} x ${dele}${rival ? ` ${rival}` : ''}`, W / 2, 272);
  // o Lembra torcedor
  const v = { ...roupa('torcida', [a, b]), ros: cachecol([a, b]), mood: 'comemora', boca: 'riso' };
  const snh = await retrato(v, 1100, 0.6).catch(() => null);
  c.shadowBlur = 0;
  if (snh) c.drawImage(snh, (W - 760) / 2, 990, 760, 760 * (snh.height / snh.width));
  // o que o time representa
  c.fillStyle = 'rgba(0,0,0,.42)'; const bx = 70, by = 1040, bw = W - 140; c.beginPath(); c.roundRect(bx, by - 100, bw, 200, 36); c.fill();
  c.fillStyle = '#fff'; c.shadowColor = 'rgba(0,0,0,.4)'; c.shadowBlur = 10;
  c.font = '900 76px Nunito, system-ui, sans-serif'; c.fillText(`${A.e} ${A.grito}`, W / 2, by - 8);
  c.font = '700 40px Nunito, system-ui, sans-serif'; c.fillText(`${A.apelido} · ${A.est}`, W / 2, by + 62);
  c.font = '800 44px Nunito, system-ui, sans-serif'; quebra(c, `“${A.frase}”`, W - 200).forEach((l, i) => c.fillText(l, W / 2, 1810 + i * 52 - 40));
  c.font = '800 30px Nunito, system-ui, sans-serif'; c.fillStyle = 'rgba(255,255,255,.85)'; c.fillText('LEMBRA · meulembra.com.br', W / 2, 1888);
  return cv;
}

/** abre a tela da vitória (vinda da notificação) com o botão de postar no story */
export async function abreVitoria(dados) {
  document.querySelector('.vit')?.remove();
  const A = almaDe(dados.time); if (!A) return;
  const w = document.createElement('div'); w.className = 'vit'; w.setAttribute('role', 'dialog'); w.setAttribute('aria-label', `Vitória do ${A.nome}`);
  w.style.setProperty('--a', A.cores[0]); w.style.setProperty('--b', A.cores[1]);
  w.innerHTML = `<div class="vit__conf" aria-hidden="true">${Array.from({ length: 28 }, (_, i) => `<i style="--x:${(i * 37) % 100}%;--d:${(i % 7) * 0.18}s;--c:${i % 2 ? A.cores[0] : A.cores[1]}"></i>`).join('')}</div>
    <div class="vit__card"><div class="fx__load"><i></i><i></i><i></i></div></div>
    <div class="vit__bts"><button class="btn btn--primary btn--block" data-post disabled>📸 Postar no meu story</button><button class="btn btn--soft btn--block" data-sai>Fechar</button></div>`;
  document.body.appendChild(w);
  w.querySelector('[data-sai]').onclick = () => { w.classList.add('is-sai'); setTimeout(() => w.remove(), 220); };
  import('./sound.js').then((m) => m.fanfare && m.fanfare()).catch(() => {});
  const cv = await cartaoVitoria(dados);
  const box = w.querySelector('.vit__card'); box.innerHTML = '';
  if (!cv) { box.textContent = 'Não consegui montar a imagem agora.'; return; }
  const foto = cv.toDataURL('image/jpeg', 0.86);
  box.innerHTML = `<img src="${foto}" alt="${A.nome} ganhou! ${A.grito}">`;
  const post = w.querySelector('[data-post]'); post.disabled = false;
  post.onclick = async () => { const S = await import('./stories.js'); w.remove(); S.editorStoryFoto(foto); };
}
