/* Música no story (como no Instagram): busca qualquer artista ou música no catálogo da Apple Music
   (o maior que existe, sem chave e sem login), ouve o trecho, escolhe os 15 s que quer e a figurinha.
   O que toca é o trecho de 30 s que a Apple libera para divulgação, sempre com o link da música completa. */
import { openSheet, sheetHead, toast } from './components.js';
import { esc } from './utils.js';

export const TRECHO = 15; // segundos que tocam no story
const PAIS = 'BR';

/** busca no catálogo (Apple Music e, se falhar, Deezer) pelo servidor do Lembra; sem servidor, direto na Apple */
const memo = new Map();
export async function buscaMusicas(termo, { limite = 30 } = {}) {
  const q = String(termo || '').trim();
  if (q.length < 2) return [];
  const k = q.toLowerCase(); if (memo.has(k)) return memo.get(k);
  let lista = null, erro = null;
  try { const { api, server } = await import('./avisos.js'); if (server()) { const r = await api('/musica/busca', { ws: '', q }); lista = (r && r.musicas) || []; } } catch (e) { erro = e; }
  if (!lista) {
    try {
      const r = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(q)}&media=music&entity=song&country=${PAIS}&limit=${limite}`);
      if (!r.ok) throw new Error();
      const j = await r.json();
      lista = (j.results || []).filter((x) => x.previewUrl).map((x) => ({ id: String(x.trackId), titulo: x.trackName, artista: x.artistName, capa: String(x.artworkUrl100 || '').replace('100x100bb', '300x300bb'), preview: x.previewUrl, link: x.trackViewUrl, explicita: x.trackExplicitness === 'explicit', fonte: 'apple' }));
    } catch { throw new Error((erro && erro.message) || 'A busca de músicas não respondeu. Confira a internet e tente de novo.'); }
  }
  memo.set(k, lista); if (memo.size > 40) memo.delete(memo.keys().next().value);
  return lista;
}

/* um tocador só no app inteiro: tocar outra música para a anterior */
let atual = null;
export function para() { if (atual) { try { atual.pause(); } catch { /* ok */ } atual.onended = atual.ontimeupdate = null; atual = null; } }
/** toca o trecho escolhido (15 s a partir de "inicio") e repete; devolve o controle */
export function toca(m, { repete = true, mudo = false } = {}) {
  para();
  const a = new Audio(m.preview); a.preload = 'auto'; a.muted = mudo; atual = a;
  if (m.fonte === 'deezer') a.addEventListener('error', async () => { // o link do trecho do Deezer expira: busca um novo
    try { const { api } = await import('./avisos.js'); const r = await api('/musica/trecho', { ws: '', id: m.id }); if (r && r.preview && atual === a) { a.src = r.preview; a.play().catch(() => {}); } } catch { /* sem som */ }
  }, { once: true });
  const ini = Math.max(0, Number(m.inicio) || 0);
  a.addEventListener('loadedmetadata', () => { try { a.currentTime = ini; } catch { /* ok */ } }, { once: true });
  a.ontimeupdate = () => { if (a.currentTime >= ini + TRECHO || a.currentTime >= (a.duration || 30) - 0.15) { if (repete) a.currentTime = ini; else a.pause(); } };
  a.play().catch(() => {});
  return a;
}

const SVG_NOTA = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M9 17.5a3 3 0 1 1-2-2.83V5l12-2v11.5a3 3 0 1 1-2-2.83V6.1L9 7.4z"/></svg>';
const SVG_PLAY = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
const SVG_PAUSA = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>';
export const SVG_SOM = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11"/></svg>';
export const SVG_MUDO = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor"/><path d="M17 9l5 6M22 9l-5 6"/></svg>';

/** a figurinha da música por cima do story */
export function figurinha(m) {
  const e = m.estilo || 'card';
  if (e === 'mini') return `<div class="mfig mfig--mini"><span class="mfig__ic">${SVG_NOTA}</span><b>${esc(m.titulo)}</b><small>· ${esc(m.artista)}</small></div>`;
  if (e === 'letra') return `<div class="mfig mfig--letra"><b>${esc(m.titulo)}</b><small>${esc(m.artista)}</small><span class="mfig__ondas"><i></i><i></i><i></i><i></i><i></i></span></div>`;
  return `<div class="mfig mfig--card"><img src="${esc(m.capa)}" alt="" crossorigin="anonymous"><span><b>${esc(m.titulo)}</b><small>${esc(m.artista)}</small></span><span class="mfig__ondas"><i></i><i></i><i></i><i></i></span></div>`;
}

/** abre a busca; devolve a música escolhida (com início do trecho e estilo) ou null */
export function escolheMusica() {
  return new Promise((ok) => {
    let lista = [], tocando = '', pronto = false;
    const sug = ['Anitta', 'Marília Mendonça', 'Henrique e Juliano', 'Taylor Swift', 'Jorge e Mateus', 'Ana Castela', 'Bruno Mars', 'Gusttavo Lima'];
    const a = openSheet({
      className: 'sheet--tall msel',
      html: `${sheetHead('Música', { left: '<button class="btn-text" data-close>Cancelar</button>' })}
        <div class="msel__busca"><input type="search" enterkeyhint="search" placeholder="Busque uma música ou artista" aria-label="Buscar música" data-q autocomplete="off"></div>
        <div class="msel__sug" data-sug>${sug.map((x) => `<button type="button" data-s="${esc(x)}">${esc(x)}</button>`).join('')}</div>
        <div class="msel__lista" data-lista><p class="msel__vazio">Qualquer artista, de qualquer lugar do mundo 🎵</p></div>
        <p class="msel__cred">Trechos de 30 s do catálogo da Apple Music e do Deezer</p>`,
      onClose: () => { para(); if (!pronto) ok(null); },
      onMount: (x) => liga(x.el),
    });
    function desenha(el) {
      const L = el.querySelector('[data-lista]');
      if (!lista.length) { L.innerHTML = '<p class="msel__vazio">Nada encontrado. Tente outro nome.</p>'; return; }
      L.innerHTML = lista.map((m, i) => `<div class="msel__item" data-i="${i}"><button type="button" class="msel__play${tocando === m.id ? ' is-on' : ''}" data-play="${i}" aria-label="Ouvir ${esc(m.titulo)}"><img src="${esc(m.capa)}" alt="" loading="lazy"><span>${tocando === m.id ? SVG_PAUSA : SVG_PLAY}</span></button>
        <button type="button" class="msel__info" data-usa="${i}"><b>${esc(m.titulo)}${m.explicita ? ' <em>E</em>' : ''}</b><small>${esc(m.artista)}</small></button>
        <button type="button" class="msel__usa" data-usa="${i}">Usar</button></div>`).join('');
      L.querySelectorAll('[data-play]').forEach((b) => (b.onclick = () => { const m = lista[+b.dataset.play]; if (tocando === m.id) { para(); tocando = ''; } else { toca({ ...m, inicio: 0 }, { repete: false }); tocando = m.id; } desenha(el); }));
      L.querySelectorAll('[data-usa]').forEach((b) => (b.onclick = () => trecho(el, lista[+b.dataset.usa])));
    }
    function liga(el) {
      const q = el.querySelector('[data-q]'); let t = 0, vez = 0;
      const busca = async () => {
        const minha = ++vez, termo = q.value;
        el.querySelector('[data-sug]').hidden = termo.trim().length > 0;
        if (termo.trim().length < 2) return;
        el.querySelector('[data-lista]').innerHTML = '<div class="fx__load"><i></i><i></i><i></i></div>';
        try { const r = await buscaMusicas(termo); if (minha !== vez) return; lista = r; desenha(el); }
        catch (e) { if (minha !== vez) return; const L = el.querySelector('[data-lista]'); L.innerHTML = `<p class="msel__vazio">${esc(e.message || 'Não consegui buscar agora.')}</p><button type="button" class="msel__de-novo" data-de-novo>Tentar de novo</button>`; L.querySelector('[data-de-novo]').onclick = busca; }
      };
      q.oninput = () => { clearTimeout(t); t = setTimeout(busca, 450); };
      q.onkeydown = (e) => { if (e.key === 'Enter') { e.preventDefault(); clearTimeout(t); q.blur(); busca(); } };
      el.querySelectorAll('[data-s]').forEach((b) => (b.onclick = () => { q.value = b.dataset.s; busca(); }));
      setTimeout(() => q.focus(), 300);
    }
    /* escolher o pedaço (15 s dos 30) e o jeito da figurinha */
    function trecho(el, m0) {
      const m = { ...m0, inicio: 0, estilo: 'card' };
      const box = el.querySelector('.page, .sheet__body') || el;
      const tela = document.createElement('div'); tela.className = 'mtre';
      const pinta = () => {
        tela.innerHTML = `<button type="button" class="btn-text mtre__volta" data-volta>‹ Voltar</button>
          <div class="mtre__fig">${figurinha(m)}</div>
          <p class="mtre__t">Arraste para escolher o trecho</p>
          <div class="mtre__faixa"><div class="mtre__ondas">${Array.from({ length: 48 }, (_, i) => `<i style="height:${30 + Math.round(Math.abs(Math.sin(i * 1.7) * 55 + Math.sin(i * 0.6) * 15))}%"></i>`).join('')}</div>
            <input type="range" min="0" max="${30 - TRECHO}" step="0.5" value="${m.inicio}" aria-label="Início do trecho" data-ini><div class="mtre__janela" style="left:${(m.inicio / 30) * 100}%;width:${(TRECHO / 30) * 100}%"></div></div>
          <p class="mtre__tempo">${fmt(m.inicio)} – ${fmt(m.inicio + TRECHO)}</p>
          <div class="mtre__estilos">${[['card', 'Capa'], ['mini', 'Compacta'], ['letra', 'Nome grande']].map(([k, n]) => `<button type="button" data-e="${k}" class="${m.estilo === k ? 'is-on' : ''}">${n}</button>`).join('')}</div>
          <button type="button" class="mtre__ok" data-ok>Pronto</button>`;
        tela.querySelector('[data-volta]').onclick = () => { para(); tela.remove(); };
        const r = tela.querySelector('[data-ini]');
        r.oninput = () => { m.inicio = +r.value; tela.querySelector('.mtre__janela').style.left = `${(m.inicio / 30) * 100}%`; tela.querySelector('.mtre__tempo').textContent = `${fmt(m.inicio)} – ${fmt(m.inicio + TRECHO)}`; };
        r.onchange = () => toca(m);
        tela.querySelectorAll('[data-e]').forEach((b) => (b.onclick = () => { m.estilo = b.dataset.e; pinta(); }));
        tela.querySelector('[data-ok]').onclick = () => { pronto = true; para(); a.close(); ok(m); };
      };
      pinta(); box.appendChild(tela); toca(m);
    }
  });
}
/** onde a imagem aparece de verdade dentro da caixa (a foto é encaixada sem cortar) */
export function areaDaFoto(img) {
  const r = img.getBoundingClientRect(), nw = img.naturalWidth || r.width, nh = img.naturalHeight || r.height;
  const k = Math.min(r.width / nw, r.height / nh), w = nw * k, h = nh * k;
  return { left: r.left + (r.width - w) / 2, top: r.top + (r.height - h) / 2, width: w, height: h };
}
/** põe a figurinha no ponto (x, y) da foto, de 0 a 1 */
export function posiciona(fig, img, x, y) {
  const box = fig.offsetParent || fig.parentElement, b = box.getBoundingClientRect(), a = areaDaFoto(img);
  fig.style.left = `${a.left - b.left + x * a.width}px`; fig.style.top = `${a.top - b.top + y * a.height}px`;
}
const fmt = (s) => `0:${String(Math.round(s)).padStart(2, '0')}`;
