/* A notícia do time, lida dentro do Lembra: foto, título, o resumo que o Lembra escreveu e o crédito da fonte.
   Embaixo: postar no story (cartão nas cores do time), mandar no WhatsApp ou compartilhar em qualquer app. */
import { openSheet, sheetHead, toast } from './components.js';
import { esc } from './utils.js';
import { porTime } from '../functions/times.js';
import { retrato } from './sininho.js';
import { cartaoNoticia as cartaoNoticiaTime } from './cartao-time.js';
import { roupa, cachecol } from './roupas.js';

const SVG_CAM = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>';
const SVG_ZAP = '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.2c0-.1-.2-.2-.4-.3z"/></svg>';
const SVG_SHARE = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12M7 8l5-5 5 5"/><path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/></svg>';
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
  const cor = (porTime(timeId)?.cores || ['#FF6A1A'])[0];
  const html = () => `${sheetHead('')}<article class="page page--sheet nota">
    ${!m && !erro ? '<div class="fx__load"><i></i><i></i><i></i></div><p class="fhelp" style="text-align:center">O Lembra está preparando a notícia pra você…</p>' : ''}
    ${erro ? `<p class="fhelp">${esc(erro)}</p>` : ''}
    ${m ? `<header class="nota__topo">
        <span class="nota__tag" style="--tc:${esc(cor)}">${esc(porTime(timeId)?.nome || 'Futebol')}</span><small class="nota__meta">${esc(quando(m.data))}</small>
      </header>
      <h1 class="nota__t">${esc(m.titulo)}</h1>
      ${m.descricao ? `<p class="nota__d">${esc(m.descricao)}</p>` : ''}
      ${m.imagem ? `<figure class="nota__fig"><img class="nota__img" src="${esc(m.imagem)}" alt="" loading="lazy"><figcaption>Foto: ${esc(m.fonte)}</figcaption></figure>` : ''}
      ${m.ia && m.resumo[0] ? `<section class="nota__res"><b class="nota__selo"><span class="nota__dot"></span>O Lembra resumiu pra você</b><p>${esc(m.resumo[0])}</p></section>` : ''}
      <div class="nota__corpo">${(m.ia ? m.resumo.slice(1) : m.resumo).map((p) => `<p>${esc(p)}</p>`).join('')}</div>
      <p class="nota__fonte">Fonte: ${esc(m.fonte)}${m.link ? ` · <a href="${esc(m.link)}" target="_blank" rel="noopener">ler a matéria completa</a>` : ''}</p>
      <div class="nota__bts">
        <button class="nota__story" data-story>${SVG_CAM}<span>Postar no meu story</span></button>
        <div class="nota__dois"><button class="nota__bt nota__bt--zap" data-zap>${SVG_ZAP}<span>WhatsApp</span></button><button class="nota__bt" data-share>${SVG_SHARE}<span>Compartilhar</span></button></div>
      </div>` : ''}
  </article>`;
  const a = openSheet({ className: 'sheet--tall', html: html(), onMount: (x) => liga(x) });
  function liga(x) {
    const el = x.el; if (!m) return;
    const texto = `${m.titulo}${m.link ? `\n${m.link}` : ''}\n\nVi no Lembra ⚽ meulembra.com.br`;
    el.querySelector('[data-zap]').onclick = () => window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank', 'noopener');
    el.querySelector('[data-share]').onclick = async () => { try { if (navigator.share) await navigator.share({ title: m.titulo, text: texto }); else { await navigator.clipboard.writeText(texto); toast('Copiado! É só colar onde quiser.'); } } catch { /* cancelou */ } };
    el.querySelector('[data-story]').onclick = async (ev) => {
      const b = ev.currentTarget; b.disabled = true; b.querySelector('span').textContent = 'Montando o cartão…';
      const cv = await cartaoNoticiaTime({ time: timeId, titulo: m.titulo, descricao: m.descricao || m.resumo[0] || '', fonte: m.fonte, seed: String(m.id).length + Number(String(m.id).slice(-2)) });
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
