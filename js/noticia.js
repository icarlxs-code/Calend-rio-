/* A notícia do time, lida dentro do Lembra: foto, título, o resumo que o Lembra escreveu e o crédito da fonte.
   Embaixo: postar no story (cartão nas cores do time), mandar no WhatsApp ou compartilhar em qualquer app. */
import { openSheet, sheetHead, toast } from './components.js';
import { esc } from './utils.js';
import { porTime } from '../functions/times.js';
import { retrato } from './sininho.js';
import { roupa, cachecol } from './roupas.js';

const quando = (at) => { try { return new Date(at).toLocaleString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }); } catch { return ''; } };
const quebra = (c, t, larg) => { const out = []; let l = ''; for (const w of String(t).split(' ')) { const n = l ? `${l} ${w}` : w; if (c.measureText(n).width > larg && l) { out.push(l); l = w; } else l = n; } if (l) out.push(l); return out; };
const img = (src) => new Promise((ok) => { const i = new Image(); i.crossOrigin = 'anonymous'; i.onload = () => ok(i); i.onerror = () => ok(null); i.src = src; });

/** cartão 1080×1920 da notícia para o story */
export async function cartaoNoticia(m, timeId) {
  const t = porTime(timeId), [a, b] = (t && t.cores) || ['#FF6A1A', '#2A1A12'];
  const W = 1080, H = 1920, cv = document.createElement('canvas'); cv.width = W; cv.height = H; const c = cv.getContext('2d');
  const g = c.createLinearGradient(0, 0, W, H); g.addColorStop(0, a); g.addColorStop(1, b); c.fillStyle = g; c.fillRect(0, 0, W, H);
  c.fillStyle = 'rgba(0,0,0,.25)'; c.fillRect(0, 0, W, H);
  c.textAlign = 'left'; c.fillStyle = '#fff';
  c.font = '900 46px Nunito, system-ui, sans-serif'; c.fillText(`🚨 ${t ? t.nome.toUpperCase() : 'FUTEBOL'}`, 80, 190);
  c.font = '900 84px Nunito, system-ui, sans-serif';
  let y = 320; for (const l of quebra(c, m.titulo, W - 160).slice(0, 6)) { c.fillText(l, 80, y); y += 98; }
  c.font = '600 44px Nunito, system-ui, sans-serif'; c.fillStyle = 'rgba(255,255,255,.9)';
  y += 20; for (const l of quebra(c, m.descricao || m.resumo[0] || '', W - 160).slice(0, 4)) { c.fillText(l, 80, y); y += 58; }
  const v = { ...roupa('torcida', [a, b]), ros: cachecol([a, b]), mood: 'surpreso' };
  const snh = await retrato(v, 900, 0.6).catch(() => null);
  if (snh) c.drawImage(snh, W - 640, H - 820, 600, 600 * (snh.height / snh.width));
  c.font = '800 34px Nunito, system-ui, sans-serif'; c.fillStyle = 'rgba(255,255,255,.9)'; c.fillText(`Fonte: ${m.fonte}`, 80, H - 150);
  c.fillText('LEMBRA · meulembra.com.br', 80, H - 96);
  return cv;
}

export async function abreNoticia(id, timeId = '') {
  let m = null, erro = '';
  const html = () => `${sheetHead('')}<article class="page page--sheet nota">
    ${!m && !erro ? '<div class="fx__load"><i></i><i></i><i></i></div><p class="fhelp" style="text-align:center">O Lembra está preparando a notícia pra você…</p>' : ''}
    ${erro ? `<p class="fhelp">${esc(erro)}</p>` : ''}
    ${m ? `${m.imagem ? `<img class="nota__img" src="${esc(m.imagem)}" alt="">` : ''}
      <small class="nota__meta">${esc(porTime(timeId)?.nome || 'Futebol')} · ${esc(quando(m.data))}</small>
      <h1 class="nota__t">${esc(m.titulo)}</h1>
      ${m.descricao ? `<p class="nota__d">${esc(m.descricao)}</p>` : ''}
      <div class="nota__corpo">${m.ia ? '<p class="nota__selo">✍️ O Lembra resumiu pra você</p>' : ''}${m.resumo.map((p) => `<p>${esc(p)}</p>`).join('')}</div>
      <p class="nota__fonte">Fonte: ${esc(m.fonte)}${m.link ? ` · <a href="${esc(m.link)}" target="_blank" rel="noopener">ler a matéria completa</a>` : ''}</p>
      <div class="nota__bts">
        <button class="btn btn--primary btn--block" data-story>📸 Postar no meu story</button>
        <div class="nota__dois"><button class="btn btn--soft" data-zap>WhatsApp</button><button class="btn btn--soft" data-share>Compartilhar</button></div>
      </div>` : ''}
  </article>`;
  const a = openSheet({ className: 'sheet--tall', html: html(), onMount: (x) => liga(x) });
  function liga(x) {
    const el = x.el; if (!m) return;
    const texto = `${m.titulo}${m.link ? `\n${m.link}` : ''}\n\nVi no Lembra ⚽ meulembra.com.br`;
    el.querySelector('[data-zap]').onclick = () => window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank', 'noopener');
    el.querySelector('[data-share]').onclick = async () => { try { if (navigator.share) await navigator.share({ title: m.titulo, text: texto }); else { await navigator.clipboard.writeText(texto); toast('Copiado! É só colar onde quiser.'); } } catch { /* cancelou */ } };
    el.querySelector('[data-story]').onclick = async (ev) => {
      const b = ev.currentTarget; b.disabled = true; b.textContent = 'Montando o cartão…';
      const cv = await cartaoNoticia(m, timeId);
      const S = await import('./stories.js'); a.close(); S.editorStoryFoto(cv.toDataURL('image/jpeg', 0.86));
    };
  }
  try {
    const { api } = await import('./avisos.js');
    const r = await api('/futebol/noticia', { ws: '', id });
    m = r && r.materia;
    if (!m) erro = 'Não achei essa notícia agora. Tenta de novo daqui a pouco.';
  } catch (e) { erro = (e && e.message) || 'Sem internet agora.'; }
  if (!a.closed) a.set(html());
}
