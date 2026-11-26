/* Visualização única: a sala segura.
   A verdade técnica, sem enrolação: nenhum site do mundo consegue impedir uma captura de tela.
   No Android isso só existe em app instalado (FLAG_SECURE) e no iPhone nem app consegue — e ninguém
   impede a pessoa de fotografar a tela com outro celular. Então o Lembra faz tudo o que É possível:
   - a foto NUNCA entra no HTML: não existe <img src>, não dá para "inspecionar elemento" e salvar;
     ela é desenhada num quadro (canvas) e apagada da memória assim que o dedo sai da tela;
   - só aparece enquanto a pessoa segura o dedo;
   - fica preta no instante em que o app perde o foco, some da frente ou a tela é trocada;
   - no computador, as teclas de print apagam a imagem antes do clique;
   - marca d'água com o nome de quem vê e a hora, desenhada DENTRO da imagem: se vazar, dá para saber de onde saiu;
   - salvar, arrastar, copiar e o menu de segurar estão bloqueados;
   - ao primeiro sinal de captura o mascote aparece balançando a cabeça e a foto não volta mais;
   - quem mandou é avisado. */
import { icon } from './icons.js';
import { sininho, alive, setMood, act, say } from './sininho.js';

const TECLAS = (e) => e.key === 'PrintScreen' || e.code === 'PrintScreen'
  || ((e.metaKey || e.ctrlKey) && e.shiftKey && ['3', '4', '5', 'S', 's'].includes(e.key))
  || (e.metaKey && e.shiftKey && e.key === '0');
const NEGA = [
  'Não pode! Aqui é segredo 🤫',
  'Ei! Isso aqui é só pra você ver, não pra guardar 🙅',
  'Opa! Foto de uma vez só é de uma vez só 😤',
  'Nada de print, combinado? Confiaram em você 🤐',
  'Xiiii… vou ter que contar pra quem mandou 😬',
];
const um = (a) => a[Math.floor(Math.random() * a.length)];

/** abre a sala segura. Devolve { sinal, segundos } */
export function abreUnica({ tipo = 'foto', src = '', legenda = '', de = '', quem = '', aoSinal } = {}) {
  return new Promise((pronto) => {
    const w = document.createElement('div');
    w.className = 'unica';
    w.setAttribute('role', 'dialog'); w.setAttribute('aria-modal', 'true'); w.setAttribute('aria-label', tipo === 'audio' ? 'Áudio de uma vez só' : 'Foto de uma vez só');
    const marca = `${quem || 'Lembra'} · ${new Date().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}`;
    w.innerHTML = `
      <div class="unica__topo"><b>${tipo === 'audio' ? 'Áudio' : 'Foto'} de uma vez só</b><small>${de ? `de ${de}` : ''}</small>
        <button class="unica__x" data-sai aria-label="Fechar">${icon('x', 22)}</button></div>
      <div class="unica__palco" data-palco>
        ${tipo === 'audio'
    ? `<div class="unica__som"><span class="unica__onda">${Array.from({ length: 28 }, (_, i) => `<i style="--d:${i * 0.045}s"></i>`).join('')}</span></div>`
    : '<canvas class="unica__cv" data-cv width="1" height="1"></canvas>'}
        <div class="unica__tampa" data-tampa>
          <div><span class="unica__snh" data-snh-wrap>${sininho('desconfiado', { size: 150 })}</span>
          <b data-titulo>Tela protegida</b><small data-motivo>Segure para ver</small></div>
        </div>
      </div>
      ${legenda ? `<p class="unica__cap">${legenda}</p>` : ''}
      <div class="unica__pe"><span class="unica__dica">${icon('eye', 18)} Segure com o dedo para ver</span></div>`;
    document.body.append(w); document.body.classList.add('has-unica');
    alive();
    const q = (s) => w.querySelector(s);
    const cv = q('[data-cv]'), motivo = q('[data-motivo]'), titulo = q('[data-titulo]');
    const boneco = () => w.querySelector('[data-snh]');
    let aberto = false, suspeita = '', fechado = false, t0 = 0, vistos = 0, bmp = null, carregando = null;

    /* a foto nunca vira elemento da página: vira pixels num quadro, com a marca d'água por cima */
    const carrega = () => (carregando ||= (async () => {
      if (!src || tipo !== 'foto') return null;
      const r = await fetch(src); const b = await r.blob();
      try { bmp = await createImageBitmap(b); }
      catch { // alguns formatos (SVG) não viram bitmap: carrega fora da página e desenha igual
        const i = new Image(); const u = URL.createObjectURL(b); i.src = u;
        try { await i.decode(); } catch { /* ok */ }
        URL.revokeObjectURL(u); bmp = i.naturalWidth ? i : null;
      }
      src = '';                                   // some com o endereço da imagem
      return bmp;
    })().catch(() => null));
    /* A imagem com a marca d'água é montada FORA da página (num quadro solto que ninguém alcança)
       e jogada na tela por WebGL sem guardar o desenho (preserveDrawingBuffer: false): assim, mesmo
       com o console aberto, pedir a imagem do quadro visível devolve vazio. */
    let gl = null, tex = null;
    const monta = () => {
      const bw = bmp.width || bmp.naturalWidth, bh = bmp.height || bmp.naturalHeight;
      const off = document.createElement('canvas'); off.width = bw; off.height = bh;
      const c = off.getContext('2d'); c.drawImage(bmp, 0, 0, bw, bh);
      const tam = Math.max(12, Math.round(bw / 26));
      c.save(); c.globalAlpha = 0.3; c.fillStyle = '#fff'; c.font = `600 ${tam}px system-ui, sans-serif`;
      c.translate(bw / 2, bh / 2); c.rotate(-0.42); c.textAlign = 'center';
      for (let y = -bh; y < bh; y += tam * 5) for (let x = -bw; x < bw; x += tam * 16) c.fillText(marca, x, y);
      c.restore();
      return off;
    };
    const VS = 'attribute vec2 p;varying vec2 t;void main(){t=vec2((p.x+1.0)/2.0,(1.0-p.y)/2.0);gl_Position=vec4(p,0.0,1.0);}';
    const FS = 'precision mediump float;varying vec2 t;uniform sampler2D s;void main(){gl_FragColor=texture2D(s,t);}';
    const desenha = () => {
      if (!cv || !bmp) return;
      const p = cv.parentElement.getBoundingClientRect(), d = Math.min(2, devicePixelRatio || 1);
      const bw = bmp.width || bmp.naturalWidth, bh = bmp.height || bmp.naturalHeight;
      const esc = Math.min(p.width / bw, p.height / bh), lw = Math.round(bw * esc), lh = Math.round(bh * esc);
      cv.style.width = `${lw}px`; cv.style.height = `${lh}px`; cv.width = Math.round(lw * d); cv.height = Math.round(lh * d);
      const fonte = monta();
      if (!gl) gl = cv.getContext('webgl', { preserveDrawingBuffer: false, alpha: true, antialias: false, desynchronized: true });
      if (!gl) { const c = cv.getContext('2d'); c.drawImage(fonte, 0, 0, cv.width, cv.height); return; }   // sem WebGL: ainda mostra
      const sh = (t, src) => { const o = gl.createShader(t); gl.shaderSource(o, src); gl.compileShader(o); return o; };
      if (!tex) {
        const pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(pr); gl.useProgram(pr);
        const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
        const a = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(a); gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
        tex = gl.createTexture();
      }
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, fonte);
      gl.viewport(0, 0, cv.width, cv.height); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (gl.getError()) {   // placa de vídeo recusou: melhor mostrar a foto pelo caminho simples do que não mostrar
        gl = null; tex = null; const c2 = document.createElement('canvas'); c2.width = cv.width; c2.height = cv.height;
        cv.replaceWith(c2); c2.className = 'unica__cv'; c2.dataset.cv = ''; c2.getContext('2d').drawImage(fonte, 0, 0, c2.width, c2.height);
      }
      fonte.width = fonte.height = 1;   // o quadro de montagem é apagado na hora
    };
    const apaga = () => {
      if (!cv) return;
      if (gl) { gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); if (tex) gl.deleteTexture(tex); tex = null; }
      else { const c = cv.getContext('2d'); c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, cv.width, cv.height); }
      cv.width = cv.height = 1;
    };

    const mostra = async (on) => {
      if (fechado) return;
      if (on && !suspeita) {
        await carrega();
        if (fechado || suspeita) return;
        aberto = true; w.classList.add('is-vendo'); desenha(); t0 = t0 || Date.now();
      } else {
        aberto = false; w.classList.remove('is-vendo'); apaga();
        if (t0) { vistos += Date.now() - t0; t0 = 0; }
      }
    };
    /* qualquer sinal de captura: apaga tudo e o mascote reclama */
    const risco = (por) => {
      if (fechado || suspeita) return;
      suspeita = por; mostra(false); w.classList.add('is-risco');
      titulo.textContent = 'Opa! Não pode';
      motivo.textContent = 'A foto fechou. Quem mandou foi avisado.';
      const e = boneco();
      setMood(e, 'bravo'); act(e, 'nao');
      setTimeout(() => act(e, 'nao'), 900);
      setTimeout(() => setMood(e, 'triste'), 1800);
      say(e, um(NEGA), { bubble: q('[data-fala]') || criaFala(), speed: 22 });
      try { navigator.vibrate && navigator.vibrate([40, 60, 40]); } catch { /* ok */ }
      if (aoSinal) aoSinal(por);
    };
    const criaFala = () => { const b = document.createElement('span'); b.className = 'unica__fala'; b.dataset.fala = '1'; q('[data-tampa] > div').append(b); return b; };
    const esconde = () => mostra(false);

    const ouvintes = [
      [document, 'visibilitychange', () => (document.hidden ? risco('saiu-do-app') : esconde())],
      [window, 'blur', () => risco('perdeu-o-foco')],
      [window, 'pagehide', () => fecha('saiu')],
      [window, 'resize', esconde],
      [document, 'keyup', (e) => TECLAS(e) && risco('tecla-de-print')],
      [document, 'keydown', (e) => TECLAS(e) && risco('tecla-de-print')],
    ];
    ouvintes.forEach(([a, b, c]) => a.addEventListener(b, c, true));
    const palco = q('[data-palco]');
    const segura = (e) => { if (e.pointerType === 'mouse' && e.button) return; palco.setPointerCapture?.(e.pointerId); mostra(true); };
    palco.addEventListener('pointerdown', segura);
    ['pointerup', 'pointercancel', 'pointerleave'].forEach((t) => palco.addEventListener(t, esconde));
    ['contextmenu', 'dragstart', 'copy', 'cut'].forEach((t) => w.addEventListener(t, (e) => e.preventDefault()));

    const fecha = (como = 'fim') => {
      if (fechado) return; fechado = true;
      if (t0) { vistos += Date.now() - t0; t0 = 0; }
      ouvintes.forEach(([a, b, c]) => a.removeEventListener(b, c, true));
      apaga(); if (bmp && bmp.close) bmp.close(); bmp = null; src = '';
      w.classList.add('is-out'); document.body.classList.remove('has-unica');
      setTimeout(() => w.remove(), 200);
      pronto({ sinal: suspeita || como, segundos: Math.round(vistos / 1000) });
    };
    q('[data-sai]').onclick = () => fecha('fim');
    w.addEventListener('keydown', (e) => { if (e.key === 'Escape') fecha('fim'); });
    requestAnimationFrame(() => w.classList.add('is-in'));
    w.tabIndex = -1; w.focus({ preventScroll: true });
    setMood(boneco(), 'desconfiado');
  });
}
