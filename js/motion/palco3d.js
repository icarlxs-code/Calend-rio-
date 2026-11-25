/* Palco 3D: liga o motor (mundo3d.js) à tela. Prefere um Worker (a animação não disputa com o app);
   sem isso, roda na página; sem WebGL, devolve false e o app usa a passagem 2D. */
import { motor3d } from './mundo3d.js';

const PECAS = ['olho-l', 'olho-r', 'pupila-l', 'pupila-r', 'sob-l', 'sob-r', 'boca-aberta', 'boca-riso', 'boca-oo', 'boca-canto', 'boca-cerrado', 'boca-tristinha', 'boca-o'];
const MARCAS = [[0.5, 'bate'], [0.56, 'cobriu'], [0.7, 'bate'], [0.9, 'abre'], [1.5, 'pousa'], [1.98, 'sai']];
let estado = '', cv = null, obra = null, local = null, ouvir = null;

/* toca a cena quadro a quadro; usado igual no Worker e na página */
function tocador(M, d, avisa, raf, marcas) {
  let t0 = 0, n = 0, pulo = 0, dpr = d.dpr, ult = 0, lento = 0, pior = 0, parou = false; const feitas = new Set();
  M.tela(d.w, d.h, dpr);
  const passo = () => {
    if (parou) return;
    const agora = performance.now(); if (!t0) t0 = agora;
    if (n > 2) { lento += agora - ult; pior = Math.max(pior, agora - ult); } ult = agora; n++;
    if (n === 12 && lento / 9 > 23 && dpr > 1) { dpr = Math.max(1, dpr * 0.66); M.tela(d.w, d.h, dpr); } // aparelho fraco: menos pixels, mesma fluidez
    const t = ((agora - t0) / 1000) * d.ritmo + pulo;
    const fim = M.cena(Math.min(t, M.dur), d.o);
    marcas.forEach(([q, m], i) => { if (t >= q && !feitas.has(i)) { feitas.add(i); avisa(m); } });
    if (fim) { parou = true; avisa('q:' + n + ',' + Math.round(pior)); avisa('fim'); M.zera(); } else raf(passo);
  };
  raf(passo);
  return { pula() { const t = ((performance.now() - t0) / 1000) * d.ritmo + pulo; if (t < 1.98) pulo += 1.98 - t; }, para() { parou = true; M.zera(); } };
}
const aquece = (M) => { M.tela(96, 208, 1); ['personal', 'work'].forEach((m) => { M.cena(0.4, { mundo: m, x: 60, y: 20, fx: 80, fy: 180 }); M.cena(1.35, { mundo: m, x: 60, y: 20, fx: 80, fy: 180 }); }); M.zera(); };

const codigo = () => `const F=(${motor3d.toString()})();const tocador=(${tocador.toString()});const aquece=(${aquece.toString()});let M=null,J=null;
const raf=(f)=>self.requestAnimationFrame?self.requestAnimationFrame(f):setTimeout(f,16);
onmessage=(e)=>{const d=e.data;try{
if(d.t==='inicia'){M=F(d.cv,{img:d.img,lay:d.lay},{novaTela:(a,b)=>new OffscreenCanvas(a,b)});aquece(M);postMessage('pronto');}
else if(d.t==='toca'){if(J)J.para();J=tocador(M,d,(m)=>postMessage(m),raf,d.marcas);}
else if(d.t==='pula'){if(J)J.pula();}
else if(d.t==='para'){if(J)J.para();J=null;}
}catch(x){postMessage('erro:'+x.message);}}`;

async function materiais(dentro) {
  const raiz = new URL('assets/mascot/rig/', document.baseURI).href;
  const lay = await (await fetch(raiz + 'layout.json')).json(), img = {};
  await Promise.all(PECAS.map(async (n) => {
    const i = new Image(); i.src = `${raiz}${n}.webp`; await i.decode();
    img[n] = dentro ? await createImageBitmap(i) : i;
  }));
  return { img, lay };
}
function novoCanvas() { const c = document.createElement('canvas'); c.className = 'lm-tela3d'; c.setAttribute('aria-hidden', 'true'); document.body.appendChild(c); return c; }

/** prepara tudo no tempo livre; pode chamar várias vezes */
export function prepara() {
  if (estado) return;
  estado = 'preparando';
  (async () => {
    const podeObra = typeof Worker !== 'undefined' && typeof OffscreenCanvas !== 'undefined' && HTMLCanvasElement.prototype.transferControlToOffscreen;
    if (podeObra) {
      try {
        const m = await materiais(true), url = URL.createObjectURL(new Blob([codigo()], { type: 'text/javascript' }));
        obra = new Worker(url); cv = novoCanvas();
        const off = cv.transferControlToOffscreen();
        await new Promise((ok, nao) => {
          const fim = setTimeout(() => nao(new Error('demorou')), 8000);
          obra.onerror = (e) => { clearTimeout(fim); nao(new Error(e.message)); };
          obra.onmessage = (e) => { if (e.data === 'pronto') { clearTimeout(fim); ok(); } else if (/^erro/.test(e.data)) { clearTimeout(fim); nao(new Error(e.data)); } };
          obra.postMessage({ t: 'inicia', cv: off, ...m }, [off, ...Object.values(m.img)]);
        });
        URL.revokeObjectURL(url);
        obra.onmessage = (e) => { if (/^erro/.test(e.data)) { estado = 'sem'; } if (ouvir) ouvir(e.data); };
        estado = 'obra'; return;
      } catch { if (obra) obra.terminate(); obra = null; if (cv) cv.remove(); cv = null; }
    }
    const m = await materiais(false);
    cv = novoCanvas();
    local = motor3d()(cv, m, { novaTela: (a, b) => { const c = document.createElement('canvas'); c.width = a; c.height = b; return c; } });
    aquece(local);
    cv.addEventListener('webglcontextlost', (e) => { e.preventDefault(); estado = 'sem'; });
    estado = 'local';
  })().catch((e) => { estado = 'sem'; if (cv) cv.remove(); cv = null; console.warn('3D indisponível', e.message); });
}
export const tem3d = () => estado === 'obra' || estado === 'local';
export const modo3d = () => estado;

/** toca a passagem. `marca(nome)` avisa os momentos (para som, texto e troca de tela). */
export function toca(o, ritmo, marca) {
  const d = { w: innerWidth, h: innerHeight, dpr: Math.min(2, devicePixelRatio || 1), ritmo, o, marcas: MARCAS };
  cv.style.visibility = 'visible';
  return new Promise((ok) => {
    let j = null;
    const acaba = () => { clearTimeout(guarda); ouvir = null; cv.style.visibility = ''; ok(); };
    const guarda = setTimeout(() => { if (obra) obra.postMessage({ t: 'para' }); else if (j) j.para(); acaba(); }, 5200); // segurança: nada fica por cima da tela
    const recebe = (m) => { if (m === 'fim' || /^erro/.test(m)) acaba(); else marca(m); };
    if (obra) { ouvir = recebe; obra.postMessage({ t: 'toca', ...d }); toca.pula = () => obra.postMessage({ t: 'pula' }); } else { j = tocador(local, d, recebe, (f) => requestAnimationFrame(f), MARCAS); toca.pula = () => j.pula(); }
  });
}
