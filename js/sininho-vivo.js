/* Sininho "vivo": toca as animações feitas quadro a quadro (os vídeos do dono do app),
   interpoladas para 60 fps, sem fundo e sem sombra.
   Cada vídeo traz a COR em cima e a TRANSPARÊNCIA embaixo (funciona em todo navegador, inclusive iPhone);
   a placa de vídeo (WebGL) junta as duas metades a cada quadro.
   Clipes: idle (respirando, em laço) · oi (acena e dá um passinho) · festa (acena, ri, pisca, sorri).
   Troca entre clipes com fusão de 180 ms; pausa sozinho fora da tela e com o app em segundo plano. */
const BASE = 'assets/mascot/sininho-';
const W = 540, H = 440; // proporção de cada quadro
const calm = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

const VS = 'attribute vec2 p;varying vec2 v;void main(){v=vec2((p.x+1.)*.5,(1.-p.y)*.5);gl_Position=vec4(p,0.,1.);}';
const FS = 'precision mediump float;varying vec2 v;uniform sampler2D t;uniform float o;void main(){vec3 c=texture2D(t,vec2(v.x,v.y*.5)).rgb;float a=texture2D(t,vec2(v.x,.5+v.y*.5)).g;a=smoothstep(.02,.98,a);gl_FragColor=vec4(c*a,a)*o;}';

function makeVideo(name, loop) {
  const v = document.createElement('video');
  v.src = `${BASE}${name}.mp4`; v.muted = true; v.defaultMuted = true; v.playsInline = true; v.loop = loop; v.preload = 'auto';
  v.setAttribute('playsinline', ''); v.setAttribute('muted', ''); v.setAttribute('aria-hidden', 'true');
  v.style.cssText = 'position:fixed;left:-9999px;top:0;width:2px;height:2px;opacity:0;pointer-events:none';
  document.body.appendChild(v);
  return v;
}

export function sininhoVivo(size = 120, { label = 'Sininho, o mascote do Lembra' } = {}) {
  return `<span class="snhv" style="--s:${size}px" data-snhv role="img" aria-label="${label}"><img src="${BASE}idle.webp" alt="" draggable="false"><canvas></canvas></span>`;
}

/* liga o Sininho vivo num elemento [data-snhv]; start: 'oi' (chega acenando) ou 'idle' */
export function live(el, { start = 'idle' } = {}) {
  if (!el || el._live) return el?._live;
  const cv = el.querySelector('canvas');
  const api = { play() {}, stop() {} };
  el._live = api;
  if (calm()) return api;
  const gl = cv.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false, powerPreference: 'low-power' });
  if (!gl) return api;
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(pr); gl.useProgram(pr);
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const uo = gl.getUniformLocation(pr, 'o');
  gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  const tex = () => { const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t); [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T].forEach((k) => gl.texParameteri(gl.TEXTURE_2D, k, gl.CLAMP_TO_EDGE)); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); return t; };

  const resize = () => {
    const dpr = Math.min(3, window.devicePixelRatio || 1), w = el.clientWidth || 120;
    cv.width = Math.round(w * dpr); cv.height = Math.round((w * H / W) * dpr);
    gl.viewport(0, 0, cv.width, cv.height);
  };
  resize();

  const clips = {};
  const clip = (name) => clips[name] || (clips[name] = { v: makeVideo(name, name === 'idle'), t: tex(), ok: false });
  let cur = null, prev = null, fadeAt = 0, raf = 0, visible = true, dead = false;
  const FADE = 180;

  const setCur = (name) => {
    const c = clip(name);
    if (cur === c) { c.v.currentTime = 0; c.v.play().catch(() => {}); return; }
    prev = cur; cur = c; fadeAt = performance.now();
    c.v.currentTime = 0;
    c.v.play().catch(() => {});
    if (name !== 'idle') c.v.onended = () => { if (cur === c) setCur('idle'); };
  };
  api.play = (name) => { if (!dead) setCur(name); };

  const upload = (c) => {
    if (c.v.readyState < 2) return false;
    gl.bindTexture(gl.TEXTURE_2D, c.t);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, c.v);
    c.ok = true; return true;
  };
  const draw = (c, op) => { if (!c.ok) return; gl.bindTexture(gl.TEXTURE_2D, c.t); gl.uniform1f(uo, op); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); };

  const frame = (now) => {
    if (dead) return;
    if (!el.isConnected) return api.stop();
    raf = requestAnimationFrame(frame);
    if (!visible || document.hidden) return;
    const k = prev ? Math.min(1, (now - fadeAt) / FADE) : 1;
    upload(cur); if (prev && k < 1) upload(prev);
    if (!cur.ok) return;
    if (!el.classList.contains('is-live')) el.classList.add('is-live');
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    if (prev && k < 1) draw(prev, 1 - k);
    draw(cur, prev ? k : 1);
    if (prev && k >= 1) { prev.v.pause(); prev = null; }
  };

  const io = 'IntersectionObserver' in window ? new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    Object.values(clips).forEach((c) => { if (c === cur && visible) c.v.play().catch(() => {}); else if (!visible) c.v.pause(); });
  }) : null;
  io && io.observe(el);
  const onVis = () => { if (!document.hidden && visible && cur) cur.v.play().catch(() => {}); };
  document.addEventListener('visibilitychange', onVis);
  window.addEventListener('resize', resize);

  api.stop = () => {
    if (dead) return; dead = true;
    cancelAnimationFrame(raf); io && io.disconnect();
    document.removeEventListener('visibilitychange', onVis); window.removeEventListener('resize', resize);
    Object.values(clips).forEach((c) => { c.v.pause(); c.v.removeAttribute('src'); c.v.load(); c.v.remove(); gl.deleteTexture(c.t); });
  };

  setCur(start === 'idle' ? 'idle' : start);
  if (start !== 'idle') clip('idle'); // deixa o laço pronto para emendar
  raf = requestAnimationFrame(frame);
  return api;
}
