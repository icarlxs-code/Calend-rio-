/* O relógio do Lembra: céu, luz e disposição mudam aos poucos, o dia inteiro.
   Cada cor é misturada minuto a minuto entre os momentos abaixo (nada de pulo de uma cena para outra). */
const C = ['ceu1', 'ceu2', 'm3', 'm2', 'm1', 'folha', 'folha2', 'tronco', 'astro'];
const DIA = [ // hora, [céu alto, céu baixo, morro longe, meio, perto, folha, folha 2, tronco, astro], estrelas, nuvens
  [0, '#0F0B26 #2B1B45 #33224F #291A40 #1E1330 #4A2C4E #573458 #140C22 #FFF0CF', 1, 0],
  [4.4, '#171033 #3B2552 #3D2955 #301E46 #231636 #53304F #613A58 #180F28 #FFF0CF', 0.9, 0],
  [5.4, '#5E4A86 #F3A58C #A86E85 #8A5568 #6B3F4C #A2543C #B5643F #4A2436 #FFD9A0', 0.25, 0.3],
  [6.4, '#FFB98E #FFE6C4 #FFC9A0 #F7A973 #EC8C4E #DB6A2A #EE8442 #A94E1E #FFC44A', 0, 0.7],
  [9, '#FFDDB0 #FFF5E6 #FFDDBA #FFC994 #FFB066 #F58A3A #FFA45A #C9692A #FFC23D', 0, 0.8],
  [11.5, '#A9DDF7 #FFF3DC #FFDFB4 #FFC888 #FFAC58 #F2852F #FF9F4E #BF6224 #FFD23F', 0, 0.9],
  [14.5, '#B8DDF0 #FFEFD2 #FFD7A6 #FFBC78 #FF9F4C #EC7A28 #FB9446 #B4571C #FFD04A', 0, 0.9],
  [16.6, '#FFCF8F #FFE9C4 #FFC68E #FDA760 #F48A3C #DB661C #EC7C30 #9E4712 #FFC544', 0, 0.8],
  [17.7, '#FF9A78 #FFD0A0 #F79A74 #E5774A #CC5526 #AE4014 #C9521F #74280A #FFB347', 0, 0.6],
  [18.5, '#7A4A86 #F48E78 #A85A72 #8A4458 #6A3042 #7E3236 #93403C #421B2C #FFD39A', 0.2, 0.35],
  [19.4, '#2E1F57 #7A4668 #5A3560 #46284D #341C3A #62334C #723F54 #20122E #FFF0CF', 0.75, 0.1],
  [21.5, '#171033 #43285A #3F2A58 #322048 #251738 #54304F #623A58 #190F2A #FFF0CF', 1, 0],
  [24, '#0F0B26 #2B1B45 #33224F #291A40 #1E1330 #4A2C4E #573458 #140C22 #FFF0CF', 1, 0],
].map(([h, c, e, n]) => ({ h, c: c.split(' ').map((x) => [1, 3, 5].map((i) => parseInt(x.slice(i, i + 2), 16))), e, n }));
const lin = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
const lum = (c) => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
export const contraste = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
export const horaAgora = (d = new Date()) => d.getHours() + d.getMinutes() / 60;

/** tudo o que o cenário precisa saber sobre esta hora */
export function ceu(h = horaAgora()) {
  const i = Math.max(0, DIA.findIndex((x, k) => k < DIA.length - 1 && h >= x.h && h < DIA[k + 1].h)), a = DIA[i], b = DIA[i + 1], t = (h - a.h) / (b.h - a.h), mix = (x, y) => x + (y - x) * t;
  const cor = a.c.map((c, k) => c.map((v, j) => Math.round(mix(v, b.c[k][j]))));
  const claro = [255, 246, 234], forte = [33, 12, 4], fundos = [cor[0], cor[1], cor[2]];
  const pior = (x) => Math.min(...fundos.map((f) => contraste(x, f)));
  const escuro = pior(claro) > pior(forte);
  // véu atrás do texto: só o necessário para a leitura ficar confortável
  const tinta = escuro ? [22, 12, 34] : [255, 243, 226], txt = escuro ? claro : forte; let veu = 0, ct = 0;
  for (; veu <= 0.9; veu += 0.05) { ct = Math.min(...fundos.map((f) => contraste(txt, f.map((v, j) => v + (tinta[j] - v) * veu)))); if (ct >= 5.2) break; }
  const sol = h >= 5.2 && h < 18.4, p = sol ? (h - 5.2) / 13.2 : ((h + 24 - 18.4) % 24) / 10.8; // 0 nasce, 1 se põe
  return { h, cor, escuro, estrelas: mix(a.e, b.e), nuvens: mix(a.n, b.n), sol, x: 60 + p * 32, veu: `rgba(${tinta.join(',')},${Math.min(0.9, veu).toFixed(2)})`, y: 66 - Math.sin(Math.PI * Math.min(1, Math.max(0, p))) * 55, contraste: ct };
}
export const estilo = (k = ceu()) => `${C.map((n, i) => `--${n}:rgb(${k.cor[i].join(',')})`).join(';')};--ax:${k.x.toFixed(1)}%;--ay:${k.y.toFixed(1)}%;--est:${k.estrelas.toFixed(2)};--nuv:${k.nuvens.toFixed(2)};--veu:${k.veu}`;
export const periodo = (h = horaAgora()) => (h < 5 ? 'madrugada' : h < 7 ? 'acordando' : h < 11.5 ? 'manha' : h < 14.5 ? 'meio' : h < 17.5 ? 'tarde' : h < 20 ? 'fim' : h < 22 ? 'sono' : 'dormindo');

/* ---------- a disposição do Lembra ---------- */
const DISPO = {
  acordando: { mood: 'sonolento', gestos: ['boceja', 'pisca', 'tchau', 'olhaLados'], cada: [5, 9] },
  manha: { mood: 'acena', gestos: ['pulo', 'sim', 'sobrancelha', 'tchau', 'olhaLados', 'riso'], cada: [3, 6] },
  meio: { mood: 'feliz', gestos: ['sim', 'riso', 'olhaLados', 'pisca', 'sobrancelha'], cada: [4, 7] },
  tarde: { mood: 'calmo', gestos: ['pisca', 'olhaLados', 'pensa', 'sim'], cada: [5, 9] },
  fim: { mood: 'cansado', gestos: ['boceja', 'pisca', 'olhaLados', 'pensa'], cada: [6, 11] },
  sono: { mood: 'sonolento', gestos: ['boceja', 'pisca'], cada: [7, 12], gorro: true },
  dormindo: { mood: 'sono', gestos: [], cada: [12, 20], gorro: true, zzz: true },
  madrugada: { mood: 'sono', gestos: [], cada: [12, 20], gorro: true, zzz: true },
};
/** base = o humor que a tela pede (ex.: "desconfiado" quando há atraso). De dia ele vale; com sono, o sono ganha. */
export function disposicao(base = '', h = horaAgora()) {
  const d = DISPO[periodo(h)], per = periodo(h), forte = ['desconfiado', 'triste'].includes(base) || (['comemora', 'danca'].includes(base) && h < 14.5);
  return { ...d, mood: forte && !d.gorro && per !== 'acordando' ? base : d.mood };
}
export const acessorios = (d) => `${d.gorro ? '<svg class="hr__gorro" viewBox="0 0 120 92" aria-hidden="true"><path d="M14 74C18 34 44 8 78 12c24 3 34 20 34 44 0 4-6 4-8 0-4-10-10-14-18-14 6 10 9 22 10 34Z" fill="#6B4FA8"/><path d="M30 46c6-14 16-24 30-28l7 1C52 26 43 36 38 52ZM62 40c2-9 6-15 12-19l8 3c-6 5-9 10-10 18Z" fill="#9A7FD6"/><rect x="6" y="66" width="98" height="20" rx="10" fill="#FFF3E2"/><circle cx="109" cy="62" r="10" fill="#FFF3E2"/></svg>' : ''}${d.zzz ? '<span class="hr__z" aria-hidden="true"><i>z</i><i>z</i><i>Z</i></span>' : ''}`;

/* ---------- frases da hora (as mesmas ideias dos avisos de ânimo) ---------- */
const FRASES = {
  acordando: ['Bom diaaa… me dá só um minutinho e eu já tô de pé 🥱', 'O sol acordou. Eu tô tentando!'],
  manha: ['Começa pelo mais difícil. O resto do dia fica leve 💪', 'Um copo d’água antes de tudo? Eu te acompanho 💧', 'Manhã é hora de ouro. Bora fazer valer!'],
  meio: ['Já almoçou? Saco vazio não para em pé 🍽️', 'Levanta, estica as costas e volta. Dois minutinhos.', 'Metade do dia já foi. Olha o tanto que você andou!'],
  tarde: ['Reta final da tarde. Uma coisa por vez 🧡', 'Água de novo? Seu corpo agradece 💧', 'Respira fundo. Ombro pra baixo. Segue o jogo.'],
  fim: ['Ufa… eu já tô cansadinho. Fecha o que dá e deixa o resto pra amanhã.', 'O dia tá indo embora. Você fez o que pôde, e isso conta.'],
  sono: ['Que sono… bora deixar amanhã pronto e descansar? 🌙', 'Hora de desacelerar. Larga um pouco o celular 😴'],
  dormindo: ['Zzz… pode dormir também, eu te lembro de tudo.', 'Shhh… amanhã a gente resolve 🌙'],
  madrugada: ['Zzz… ainda é madrugada. Vai descansar 💤', 'Se não consegue dormir, respira devagar comigo.'],
};
const ACORDA = ['Hã?! Eu não tava dormindo! 👀', 'Só tava descansando os olhos…', 'Cinco minutinhos… tá bom, acordei!'];
export const fraseDaHora = (h = horaAgora(), semente = new Date().getDate()) => { const L = FRASES[periodo(h)]; return L[semente % L.length]; };

/* ---------- ligação com a tela ---------- */
let timer = 0, giro = 0;
export function aplica(raiz = document) {
  const k = ceu(), s = estilo(k);
  raiz.querySelectorAll('[data-hora]').forEach((c) => { c.style.cssText = s; const f = c.closest('.foco, .pcena, .login__cena'); if (f && !f.classList.contains('login__cena')) f.classList.toggle('hr--escuro', k.escuro); });
  return k;
}
/** depois de cada desenho da tela */
export async function liga(view) {
  clearInterval(timer); clearInterval(giro);
  const fig = view.querySelector('[data-hr-fig]'); if (!fig) return;
  const { setMood, act, vivo, alive } = await import('./sininho.js'); if (!fig.isConnected) return;
  const bon = fig.querySelector('[data-snh]'), base = fig.dataset.base || ''; let d = disposicao(base), per = periodo(), acordou = 0;
  alive(); if (bon && d.gestos.length) vivo(bon, { gestos: d.gestos, cada: d.cada });
  const faixa = view.querySelector('[data-falas-hora]'), L = faixa ? [...faixa.querySelectorAll('.hrf__i')] : []; let i = 0;
  const vai = (n) => { if (!L.length) return; i = (n + L.length) % L.length; L.forEach((x, k) => { x.classList.toggle('is-on', k === i); x.setAttribute('aria-hidden', k !== i); }); faixa.querySelectorAll('.hrf__p i').forEach((x, k) => x.classList.toggle('is-on', k === i)); };
  if (faixa) {
    faixa.onclick = (e) => { if (e.target.closest('[data-action]')) return; vai(i + 1); clearInterval(giro); };
    if (L.length > 1 && !matchMedia('(prefers-reduced-motion: reduce)').matches) giro = setInterval(() => { if (!faixa.isConnected) return clearInterval(giro); if (!document.hidden && document.activeElement !== faixa && !faixa.matches(':hover')) vai(i + 1); }, 9000);
  }
  fig.addEventListener('click', () => {
    if (!bon || !d.gorro || Date.now() - acordou < 6000) return;
    acordou = Date.now(); setMood(bon, 'surpreso'); act(bon, 'sobrancelha'); fig.classList.add('is-acordou');
    const a = faixa && L[i]; if (a) { const t = a.querySelector('.hrf__t'), velho = t.innerHTML; t.textContent = ACORDA[Math.floor(Math.random() * ACORDA.length)]; setTimeout(() => { t.innerHTML = velho; }, 3400); }
    setTimeout(() => { if (bon.isConnected) { setMood(bon, d.mood); act(bon, 'boceja'); } fig.classList.remove('is-acordou'); }, 3400);
  });
  timer = setInterval(() => { // a cada minuto: luz, astro e, quando muda o período, a disposição
    if (!fig.isConnected) return clearInterval(timer);
    if (document.hidden) return;
    aplica(view);
    if (periodo() !== per) { per = periodo(); window.__calRender && window.__calRender(); }
  }, 60e3);
}
if (typeof document !== 'undefined') document.addEventListener('visibilitychange', () => { if (!document.hidden) aplica(); });
