/* Lembra 3D · motor próprio (WebGL puro, sem biblioteca, ~20 KB)
   Esta função é autossuficiente de propósito: roda igual na página ou dentro de um Worker (OffscreenCanvas),
   onde a animação segue a 60 quadros mesmo enquanto o app monta a tela nova.
   O corpo é o perfil do sino do mascote torneado; o rosto é o desenho original projetado na frente dele. */
export function motor3d() {
  /* ---------- contas ---------- */
  const PI = Math.PI, sen = Math.sin, cos = Math.cos, max = Math.max, min = Math.min;
  const lim = (x, a, b) => max(a, min(b, x)), mix = (a, b, k) => a + (b - a) * k, trecho = (t, a, b) => lim((t - a) / (b - a), 0, 1);
  const sai = (k) => 1 - Math.pow(1 - k, 3), sai5 = (k) => 1 - Math.pow(1 - k, 5), vai = (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2), entra = (k) => k * k * k;
  const mola = (t, f = 3, z = 5) => (t <= 0 ? 0 : 1 - Math.exp(-z * t) * cos(f * 2 * PI * t)); // passa do ponto e assenta
  const I = () => [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  const mul = (a, b) => { const o = new Array(16); for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) o[c * 4 + r] = a[r] * b[c * 4] + a[4 + r] * b[c * 4 + 1] + a[8 + r] * b[c * 4 + 2] + a[12 + r] * b[c * 4 + 3]; return o; };
  const T = (x, y, z) => [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1], S = (x, y = x, z = x) => [x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1];
  const RX = (a) => [1, 0, 0, 0, 0, cos(a), sen(a), 0, 0, -sen(a), cos(a), 0, 0, 0, 0, 1], RY = (a) => [cos(a), 0, -sen(a), 0, 0, 1, 0, 0, sen(a), 0, cos(a), 0, 0, 0, 0, 1], RZ = (a) => [cos(a), sen(a), 0, 0, -sen(a), cos(a), 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  const junta = (...m) => m.reduce(mul);
  const normal = (m) => { // inversa transposta 3x3
    const [a, b, c, , d, e, f, , g, h, i] = m, A = e * i - f * h, B = f * g - d * i, C = d * h - e * g, det = a * A + b * B + c * C || 1e-6;
    return [A / det, B / det, C / det, (c * h - b * i) / det, (a * i - c * g) / det, (b * g - a * h) / det, (b * f - c * e) / det, (c * d - a * f) / det, (a * e - b * d) / det];
  };
  const hex = (h) => [parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255];
  const mixc = (a, b, k) => [mix(a[0], b[0], k), mix(a[1], b[1], k), mix(a[2], b[2], k)];
  const acaso = (n) => { const x = sen(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

  /* ---------- malhas ---------- */
  function superficie(nu, nv, f, centro) { // f(u, v) -> [x, y, z]; normal por diferença, sempre para fora
    const p = [], n = [], ix = [], e = 1e-3;
    for (let j = 0; j <= nv; j++) for (let i = 0; i <= nu; i++) {
      const u = i / nu, v = j / nv, P = f(u, v), a = f(u + e, v), b = f(u - e, v), c = f(u, min(1, v + e)), d = f(u, max(0, v - e));
      const du = [a[0] - b[0], a[1] - b[1], a[2] - b[2]], dv = [c[0] - d[0], c[1] - d[1], c[2] - d[2]];
      let N = [du[1] * dv[2] - du[2] * dv[1], du[2] * dv[0] - du[0] * dv[2], du[0] * dv[1] - du[1] * dv[0]];
      const l = Math.hypot(...N); const cc = centro ? centro(u, v) : [0, 0, 0];
      if (l > 1e-7) N = N.map((x) => x / l); else { const q = [P[0] - cc[0], P[1] - cc[1], P[2] - cc[2]], m = Math.hypot(...q) || 1; N = q.map((x) => x / m); }
      if (N[0] * (P[0] - cc[0]) + N[1] * (P[1] - cc[1]) + N[2] * (P[2] - cc[2]) < 0) N = N.map((x) => -x);
      p.push(...P); n.push(...N);
    }
    for (let j = 0; j < nv; j++) for (let i = 0; i < nu; i++) { const a = j * (nu + 1) + i, b = a + 1, c = a + nu + 1, d = c + 1; ix.push(a, c, b, b, c, d); }
    return { p, n, ix };
  }
  const suave = (P, k) => { // curva suave (Catmull-Rom) pelos pontos do perfil
    const m = P.length - 1, x = lim(k, 0, 1) * m, i = min(m - 1, Math.floor(x)), t = x - i, g = (j) => P[lim(j, 0, m)], a = g(i - 1), b = g(i), c = g(i + 1), d = g(i + 2);
    return [0, 1].map((q) => 0.5 * (2 * b[q] + (c[q] - a[q]) * t + (2 * a[q] - 5 * b[q] + 4 * c[q] - d[q]) * t * t + (3 * b[q] - a[q] - 3 * c[q] + d[q]) * t * t * t));
  };
  const torno = (P, nu, nv) => superficie(nu, nv, (u, v) => { const [r, y] = suave(P, v), a = u * 2 * PI; return [sen(a) * max(0, r), y, cos(a) * max(0, r)]; }, () => [0, (P[0][1] + P[P.length - 1][1]) / 2, 0]);
  const px = (L) => L.map(([r, y]) => [r / 400, (902.2 - y) / 400]);
  const SINO = px([[0, 148], [58, 148], [113, 154], [160, 168], [199, 192], [230, 224], [253, 256], [275, 290], [290, 330], [301, 366], [308, 405], [313, 440], [318, 474], [327, 505], [344, 543], [364, 580], [379, 615], [386, 650], [381, 680], [366, 705], [346, 720]]);
  const DENTRO = px([[346, 720], [328, 716], [312, 690], [290, 610], [262, 500], [210, 380], [110, 330], [0, 320]]);
  const BRACO = [[0, 0.06], [0.09, 0.05], [0.14, 0], [0.165, -0.1], [0.175, -0.24], [0.185, -0.4], [0.195, -0.52], [0.18, -0.64], [0.12, -0.73], [0, -0.75]];
  const esfera = superficie(28, 18, (u, v) => { const a = u * 2 * PI, b = v * PI; return [sen(a) * sen(b), cos(b), cos(a) * sen(b)]; });
  const rosca = superficie(32, 14, (u, v) => { const a = u * 2 * PI, b = -v * 2 * PI, R = 1, r = 0.42; return [cos(a) * (R + r * cos(b)), sen(a) * (R + r * cos(b)), r * sen(b)]; }, (u) => [cos(u * 2 * PI), sen(u * 2 * PI), 0]);
  /* coração estufado, em duas metades que abrem como um medalhão */
  const hx = (t) => 16 * Math.pow(sen(t), 3) / 16, hy = (t) => (13 * cos(t) - 5 * cos(2 * t) - 2 * cos(3 * t) - cos(4 * t) + 2.4) / 15;
  const metade = (lado) => superficie(40, 26, (u, v) => { // u contorna só um lado; v vai de trás pra frente
    const t = lado > 0 ? mix(0.0, PI, u) : mix(2 * PI, PI, u), b = mix(-PI / 2, PI / 2, v), c = Math.pow(max(0, cos(b)), 0.62);
    return [hx(t) * c, hy(t) * c, sen(b) * 0.6 * (1 - 0.12 * Math.abs(hx(t)) * c)];
  });
  const coracao = superficie(30, 16, (u, v) => { const t = u * 2 * PI, b = mix(-PI / 2, PI / 2, v), c = Math.pow(max(0, cos(b)), 0.62); return [hx(t) * c, hy(t) * c, sen(b) * 0.5]; });
  /* maleta: caixa bem arredondada (superelipsoide) cortada ao meio */
  const sg = (x, e) => Math.sign(x) * Math.pow(Math.abs(x), e);
  const caixa = (z0, z1) => superficie(56, 16, (u, v) => { const a = u * 2 * PI, z = mix(z0, z1, v), k = Math.pow(max(0, 1 - Math.pow(Math.abs(z), 5)), 1 / 5); return [sg(cos(a), 0.36) * 1.18 * k, sg(sen(a), 0.36) * 0.84 * k, z * 0.42]; });

  /* ---------- sombreadores ---------- */
  const VS = `attribute vec3 aP,aN;uniform mat4 uM,uVP;uniform mat3 uN;varying vec3 vN,vO,vW,vON;void main(){vec4 w=uM*vec4(aP,1.);vW=w.xyz;vO=aP;vON=aN;vN=uN*aN;gl_Position=uVP*w;}`;
  const FS = `precision highp float;varying vec3 vN,vO,vW,vON;uniform vec3 uEye,uC1,uC2,uIn;uniform vec4 uY;uniform vec4 uQ;uniform float uA,uFace,uGloss,uLuz,uInK;uniform sampler2D uT;
  void main(){vec3 N=normalize(vN),V=normalize(uEye-vW);bool tras=dot(N,V)<-.02;if(tras)N=-N;
  vec3 base=mix(uC2,uC1,smoothstep(uY.x,uY.y,vO.y));float a=uA,fosco=1.;
  if(uFace>.5){vec2 b=vO.xy*uQ.xy+uQ.zw;vec2 q=vec2((b.x*400.+385.4)/772.,(902.2-b.y*400.)/816.);if(q.x>0.&&q.x<1.&&q.y>0.&&q.y<1.&&(vON.z>-.05||uFace>1.5)){vec4 f=texture2D(uT,q);float k=uFace>1.5?1.:smoothstep(-.02,.12,vON.z);base=mix(uFace>1.5?vec3(1.):base,f.rgb/max(f.a,.001),f.a*k);fosco=1.-f.a*k*(uFace>1.5?0.:.75);}}
  vec3 L=normalize(vec3(-.5,.85,.72));float d=dot(N,L),w=clamp((d+.42)/1.42,0.,1.);
  vec3 sombra=base*vec3(.70,.43,.40);vec3 c=mix(sombra,base,smoothstep(.05,.85,w));
  c+=base*vec3(.22,.12,.05)*max(0.,dot(N,normalize(vec3(.7,-.35,.4))));
  c+=vec3(.20,.05,.0)*exp(-pow((w-.36)*5.,2.))*uGloss;
  float fr=pow(1.-max(dot(N,V),0.),3.2);c+=vec3(1.,.72,.45)*fr*.42*uLuz;
  vec3 R=reflect(-V,N);float s=smoothstep(.80,1.,dot(R,normalize(vec3(-.55,.75,.62))));
  c+=vec3(1.,.93,.82)*s*s*.42*uGloss*fosco;
  c*=mix(1.,smoothstep(uY.z-.02,uY.w,vO.y),.32);
  if(tras)c=mix(c,uIn,uInK);
  gl_FragColor=vec4(c*a,a);}`;
  const VF = 'attribute vec3 aP;void main(){gl_Position=vec4(aP.xy,0.,1.);}';
  const FF = `precision highp float;uniform vec2 uRes,uO,uC;uniform float uR,uFuro,uTipo,uT,uRaio,uAnel,uSom,uDpr,uBrilho;uniform vec3 uA1,uA2,uA3;uniform vec2 uPe;
  float d2(vec2 p){return dot(p,p);}
  float cor(vec2 p){p.x=abs(p.x);p.y+=.56;if(p.y+p.x>1.)return sqrt(d2(p-vec2(.25,.75)))-.35355;return sqrt(min(d2(p-vec2(0.,1.)),d2(p-.5*max(p.x+p.y,0.))))*sign(p.x-p.y);}
  float mala(vec2 p){vec2 q=abs(p+vec2(0.,.06))-vec2(.56,.36);float b=length(max(q,0.))+min(max(q.x,q.y),0.)-.10;vec2 h=p-vec2(0.,.42);vec2 k=abs(h)-vec2(.17,.10);float e=length(max(k,0.))+min(max(k.x,k.y),0.)-.07;return min(b,e);}
  void main(){vec2 p=vec2(gl_FragCoord.x,uRes.y-gl_FragCoord.y)/uDpr;vec2 R=uRes/uDpr;
  vec2 o=p-uO;float ang=atan(o.y,o.x),raio=length(o);float onda=uR+sin(ang*5.+uT*5.)*10.+sin(ang*9.-uT*7.)*5.;float a=1.-smoothstep(onda-1.2,onda+1.2,raio);if(a<.004){gl_FragColor=vec4(0.);return;}
  vec2 c=(p-uC)/R.x;float l=length(c*vec2(1.,.82));vec3 col=mix(uA1,uA2,smoothstep(.05,1.05,l));
  float g=atan(c.y,c.x);float rr=smoothstep(.15,.85,sin(g*9.+uT*.7)*.5+.5);col=mix(col,uA3,rr*uRaio*smoothstep(1.25,.12,l)*.55);
  col=mix(col,vec3(1.,.97,.9),uBrilho*exp(-l*l*7.));
  if(uAnel>0.){float k=abs(l-uAnel*.9);col=mix(col,uA3,(1.-smoothstep(0.,.05,k))*.5*(1.-uAnel));}
  for(int i=0;i<9;i++){float f=float(i);vec2 b=vec2(fract(sin(f*71.3)*437.5),fract(sin(f*31.7)*917.3+uT*(.03+.02*fract(f*.37))));float q=length((p/R-vec2(b.x,1.-b.y))*vec2(R.x/R.y,1.))-(.008+.016*fract(f*.61));col=mix(col,uA3,(1.-smoothstep(0.,.006,q))*.30);}
  vec2 s=(p-uPe)/vec2(R.x*.24,R.x*.052);col*=1.-uSom*.34*exp(-d2(s)*1.7);
  if(uFuro>0.){float esc=uFuro*R.y*1.5;vec2 q=(p-uC)/max(esc,1.);q.y=-q.y;float d=(uTipo<.5?cor(q):mala(q))*esc;float fora=smoothstep(-1.,1.,d);col=mix(uA3,col,smoothstep(8.,26.,d));col=mix(vec3(1.,.98,.94),col,smoothstep(0.,8.,d)*.8+.2);a*=fora;}
  gl_FragColor=vec4(col*a,a);}`;

  /* ---------- rosto: desenho original em texturas ---------- */
  function rostos(img, lay, novaTela) {
    const OX = 595.6, OY = 106.8, tela = () => { const c = novaTela(772, 816); return [c, c.getContext('2d')]; };
    const poe = (g, n, dx = 0, dy = 0, k = 1) => { const i = img[n], l = lay[n]; if (!i || !l) return; const w = l[2] * k, h = l[3] * k; g.drawImage(i, l[0] - OX + dx + (l[2] - w) / 2, l[1] - OY + dy + (l[3] - h) / 2, w, h); };
    const olhos = (g, dx = 0, dy = 0, k = 1) => { poe(g, 'olho-l'); poe(g, 'olho-r'); poe(g, 'pupila-l', dx, dy, k); poe(g, 'pupila-r', dx, dy, k); };
    const sob = (g, dy) => { poe(g, 'sob-l', 0, dy); poe(g, 'sob-r', 0, dy); };
    const arco = (g, x, y, r) => { g.strokeStyle = '#2E1A12'; g.lineWidth = 24; g.lineCap = 'round'; g.beginPath(); g.arc(x - OX, y - OY, r, PI * 1.12, PI * 1.88); g.stroke(); };
    const cor = (g, x, y, e) => { g.fillStyle = '#E8243C'; g.beginPath(); for (let i = 0; i <= 60; i++) { const t = (i / 60) * 2 * PI; g.lineTo(x - OX + hx(t) * e, y - OY - hy(t) * e); } g.fill(); g.fillStyle = 'rgba(255,255,255,.85)'; g.beginPath(); g.arc(x - OX - e * 0.36, y - OY - e * 0.38, e * 0.17, 0, 7); g.fill(); };
    const blush = (g) => { [[742, 640], [1222, 640]].forEach(([x, y]) => { const r = g.createRadialGradient(x - OX, y - OY, 4, x - OX, y - OY, 62); r.addColorStop(0, 'rgba(226,32,20,.5)'); r.addColorStop(1, 'rgba(226,32,20,0)'); g.fillStyle = r; g.fillRect(x - OX - 70, y - OY - 70, 140, 140); }); };
    const faz = (f) => { const [c, g] = tela(); f(g); return c; };
    return {
      normal: faz((g) => { olhos(g); sob(g, 0); poe(g, 'boca-aberta'); }),
      feliz: faz((g) => { blush(g); arco(g, 848, 545, 82); arco(g, 1103, 548, 78); sob(g, -22); poe(g, 'boca-riso'); }),
      susto: faz((g) => { olhos(g, 0, 0, 0.84); sob(g, -30); poe(g, 'boca-oo'); }),
      amor: faz((g) => { blush(g); cor(g, 848, 520, 76); cor(g, 1103, 526, 74); sob(g, -18); poe(g, 'boca-riso'); }),
      pisca: faz((g) => { blush(g); poe(g, 'olho-l'); poe(g, 'pupila-l'); arco(g, 1103, 548, 78); sob(g, -12); poe(g, 'boca-riso'); }),
      pensa: faz((g) => { olhos(g, 26, -24); poe(g, 'sob-l', 0, -26); poe(g, 'sob-r', 0, 2); poe(g, 'boca-canto'); }),
      bravo: faz((g) => { olhos(g, 0, 8); g.save(); poe(g, 'sob-l', 10, 34); poe(g, 'sob-r', -10, 34); g.restore(); poe(g, 'boca-cerrado'); }),
      triste: faz((g) => { olhos(g, 0, 22); sob(g, -6); poe(g, 'boca-tristinha'); }),
      sono: faz((g) => { arco(g, 848, 480, 78); arco(g, 1103, 484, 74); sob(g, 14); poe(g, 'boca-o'); }),
      direita: faz((g) => { olhos(g, 36, 0); sob(g, -8); poe(g, 'boca-aberta'); }),
    };
  }

  /* ---------- o motor ---------- */
  return function cria(cv, dados, opc) {
    const gl = cv.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: true, powerPreference: 'high-performance', preserveDrawingBuffer: !!opc.guarda });
    if (!gl) throw new Error('sem webgl');
    const prog = (v, f) => { const p = gl.createProgram(); [[gl.VERTEX_SHADER, v], [gl.FRAGMENT_SHADER, f]].forEach(([t, s]) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o)); gl.attachShader(p, o); }); gl.bindAttribLocation(p, 0, 'aP'); gl.bindAttribLocation(p, 1, 'aN'); gl.linkProgram(p); if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p)); const u = {}; for (let i = 0, n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS); i < n; i++) { const a = gl.getActiveUniform(p, i); u[a.name] = gl.getUniformLocation(p, a.name); } return { p, u }; };
    const P3 = prog(VS, FS), PF = prog(VF, FF);
    const malha = ({ p, n, ix }) => { const b = gl.createBuffer(), e = gl.createBuffer(), d = new Float32Array(p.length * 2); for (let i = 0; i < p.length / 3; i++) for (let k = 0; k < 3; k++) { d[i * 6 + k] = p[i * 3 + k]; d[i * 6 + 3 + k] = n[i * 3 + k]; } gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, d, gl.STATIC_DRAW); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, e); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(ix), gl.STATIC_DRAW); return { b, e, n: ix.length }; };
    const M = { sino: malha(torno(SINO, 56, 48)), dentro: malha(torno(DENTRO, 40, 20)), braco: malha(torno(BRACO, 22, 22)), esfera: malha(esfera), rosca: malha(rosca), esq: malha(metade(-1)), dir: malha(metade(1)), cor: malha(coracao), tras: malha(caixa(-1, 0)), frente: malha(caixa(0, 1)), faixa: malha(caixa(-0.06, 0.06)) };
    const quad = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, quad); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), gl.STATIC_DRAW);
    const R = rostos(dados.img, dados.lay, opc.novaTela), tex = {};
    Object.keys(R).forEach((k) => { const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t); gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, R[k]); [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]].forEach(([a, b]) => gl.texParameteri(gl.TEXTURE_2D, a, b)); tex[k] = t; });
    let W = 390, H = 844, dpr = 2, HW = 7, VP = I(), olho = [0, 0.5, 10];
    const LARG = 3.4;
    function tela(w, h, d) { W = w; H = h; dpr = d; cv.width = Math.round(w * d); cv.height = Math.round(h * d); gl.viewport(0, 0, cv.width, cv.height); HW = LARG * h / w; }
    const camera = (dz = 10, dy = 0) => { // tela em z=0 mede LARG x HW
      const n = 1, f = 40, k = n / dz, r = (LARG / 2) * k, t = (HW / 2) * k, Pj = [n / r, 0, 0, 0, 0, n / t, 0, 0, 0, 0, -(f + n) / (f - n), -1, 0, 0, (-2 * f * n) / (f - n), 0];
      olho = [0, dy, dz]; VP = mul(Pj, T(0, -dy, -dz)); if (dy) VP = mul(mul(Pj, junta(T(0, 0, -dz), RX(Math.atan2(dy, dz)))), I());
    };
    const mundoX = (x) => (x / W - 0.5) * LARG, mundoY = (y) => (0.5 - y / H) * HW;
    let atual = null;
    const liga = (m) => { if (atual === m) return; atual = m; gl.bindBuffer(gl.ARRAY_BUFFER, m.b); gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 24, 0); gl.enableVertexAttribArray(1); gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 24, 12); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, m.e); };
    const LARANJA = [hex('#FF8E22'), hex('#F9520E')], VERM = [hex('#F45A0A'), hex('#DD3B05')], BRANCO = [hex('#FFFFFF'), hex('#FFF7EE')];
    function peca(m, mat, o = {}) {
      const u = P3.u; liga(m);
      gl.uniformMatrix4fv(u.uM, false, mat); gl.uniformMatrix3fv(u.uN, false, normal(mat));
      const c = o.c || LARANJA; gl.uniform3fv(u.uC1, c[0]); gl.uniform3fv(u.uC2, c[1]); gl.uniform4fv(u.uY, o.y || [-1, 1, -9, -8]);
      gl.uniform1f(u.uA, o.a == null ? 1 : o.a); gl.uniform1f(u.uFace, o.face ? (o.olho ? 2 : 1) : 0); gl.uniform4fv(u.uQ, o.olho || [1, 1, 0, 0]); gl.uniform1f(u.uGloss, o.brilho == null ? 1 : o.brilho); gl.uniform1f(u.uLuz, o.luz == null ? 1 : o.luz);
      gl.uniform3fv(u.uIn, o.dentro || [0.35, 0.07, 0.02]); gl.uniform1f(u.uInK, o.dentroK == null ? 0.85 : o.dentroK);
      if (o.face) gl.bindTexture(gl.TEXTURE_2D, o.face);
      gl.drawElements(gl.TRIANGLES, m.n, gl.UNSIGNED_SHORT, 0);
    }
    /* o Lembra. q: x,y,z,e(escala), ry, rz, rx, sq(achata), bl/br (braços em rad, 0 = caído, 2.6 = pro alto), pl/pr (pés sobem), rosto, a */
    function lembra(q) {
      const sq = q.sq || 0, base = junta(T(q.x || 0, q.y || 0, q.z || 0), RZ(q.rz || 0), RX(q.rx || 0), RY(q.ry || 0), S(q.e || 1));
      const corpo = junta(base, T(0, 0.12, 0), S(1 + sq * 0.55, 1 - sq, 1 + sq * 0.55), T(0, -0.12, 0)), f = tex[q.rosto || 'normal'], a = q.a, abertos = !['feliz', 'amor', 'sono'].includes(q.rosto), dirF = q.rosto === 'pisca';
      [-1, 1].forEach((s) => { const up = (s < 0 ? q.pl : q.pr) || 0, pe = junta(base, T(0.38 * s, 0.13 + up, 0.12)); peca(M.esfera, junta(base, T(0.38 * s, 0.34 + up * 0.5, 0), S(0.2, 0.3, 0.2)), { c: [hex('#FF7A18'), hex('#F2570C')], a }); peca(M.esfera, mul(pe, S(0.27, 0.15, 0.36)), { c: VERM, a }); });
      peca(M.dentro, corpo, { c: [hex('#8E1E04'), hex('#6E1402')], y: [0.4, 1.2, -9, -8], brilho: 0.2, luz: 0.2, dentroK: 0, a });
      peca(M.esfera, junta(corpo, T(sen(q.bada || 0) * 0.2, 0.33, 0), S(0.19, 0.22, 0.19)), { c: [hex('#FFA02E'), hex('#F2650F')], a });
      peca(M.rosca, junta(corpo, T(0, 1.975, 0), S(0.155, 0.16, 0.14)), { a });
      peca(M.sino, corpo, { y: [0.3, 1.9, 0.34, 0.75], face: f, a });
      if (abertos) [[-0.333, 1.228, 0.3, 0.235, -1], [0.305, 1.222, 0.283, 0.23, 1]].forEach(([x, y, w, h, s]) => { if (dirF && s > 0) return; peca(M.esfera, junta(corpo, T(x, y, 0.64), S(w * 0.97, h * 0.97, 0.16)), { c: BRANCO, face: f, olho: [w * 0.97, h * 0.97, x, y], brilho: 1.5, luz: 0.2, a }); });
      [-1, 1].forEach((s) => { const ang = ((s < 0 ? q.bl : q.br) || 0) + 0.34; peca(M.braco, junta(corpo, T(0.8 * s, 1.0, 0.02), RZ(ang * s), RX(-0.12 + (q.bz || 0)), S(1, 1, 0.82)), { c: [hex('#FF7D18'), hex('#EE4706')], y: [-0.75, -0.1, -9, -8], a }); });
    }
    function fundo(o) {
      gl.useProgram(PF.p); gl.disable(gl.DEPTH_TEST); atual = null; gl.bindBuffer(gl.ARRAY_BUFFER, quad); gl.enableVertexAttribArray(0); gl.disableVertexAttribArray(1); gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 12, 0);
      const u = PF.u; gl.uniform2f(u.uRes, cv.width, cv.height); gl.uniform1f(u.uDpr, dpr); gl.uniform2f(u.uO, o.ox, o.oy); gl.uniform2f(u.uC, o.cx, o.cy); gl.uniform1f(u.uR, o.r); gl.uniform1f(u.uFuro, o.furo || 0); gl.uniform1f(u.uTipo, o.tipo || 0); gl.uniform1f(u.uT, o.t); gl.uniform1f(u.uRaio, o.raio || 0); gl.uniform1f(u.uAnel, o.anel || 0); gl.uniform1f(u.uSom, o.som || 0); gl.uniform1f(u.uBrilho, o.brilho || 0); gl.uniform2f(u.uPe, o.px || 0, o.py || 0); gl.uniform3fv(u.uA1, o.c1); gl.uniform3fv(u.uA2, o.c2); gl.uniform3fv(u.uA3, o.c3);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    const tres = () => { gl.useProgram(P3.p); gl.enable(gl.DEPTH_TEST); gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); gl.uniformMatrix4fv(P3.u.uVP, false, VP); gl.uniform3fv(P3.u.uEye, olho); gl.uniform1i(P3.u.uT, 0); atual = null; };
    const limpa = () => { gl.clearColor(0, 0, 0, 0); gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); };

    /* ---------- a passagem entre os mundos ----------
       0,00 o objeto (coração ou maleta) sai do botão e vem para a frente, girando
       0,42 chega, bate duas vezes como um coração de verdade
       0,86 abre ao meio: luz e confete
       1,02 o Lembra salta de dentro, gira no ar e pousa perto de você
       1,95 a abertura no formato do objeto revela a tela nova, e ele volta para o cantinho dele */
    const PAL = {
      personal: { c1: hex('#FFF6EA'), c2: hex('#FFA564'), c3: hex('#FFFFFF'), a: [hex('#FF6C8A'), hex('#E8203F')], b: [hex('#FF9A3A'), hex('#F4520C')] },
      work: { c1: hex('#8A3A12'), c2: hex('#2C0F04'), c3: hex('#FFB46A'), a: [hex('#B4612B'), hex('#7A3411')], b: [hex('#C9702F'), hex('#86390F')] },
    };
    const DUR = 2.62;
    function cena(t, o) {
      const pal = PAL[o.mundo], pess = o.mundo === 'personal', cx = W / 2, cy = H * 0.46, X0 = mundoX(o.x), Y0 = mundoY(o.y), CY = mundoY(cy);
      const k = vai(trecho(t, 0.02, 0.5)), bate = (a) => { const s = trecho(t, a, a + 0.3); return s > 0 && s < 1 ? sen(s * PI) * Math.exp(-s * 1.4) : 0; };
      const b = bate(0.5) + bate(0.68) * 1.25, ab = t > 0.9 ? mola(t - 0.9, 1.5, 4.6) : 0, some = entra(trecho(t, 1.3, 1.8));
      camera(10, 0);
      limpa();
      const saiK = trecho(t, 1.98, DUR), furo = t > 1.98 ? Math.pow(saiK, 2.3) * 2.4 + 0.02 * saiK : 0;
      const Rmax = Math.hypot(max(o.x, W - o.x), max(o.y, H - o.y)) + 40;
      const s = trecho(t, 1.04, 1.5), noAr = s > 0 && s < 1, alt = s <= 0 ? 0 : sen(min(1, s) * PI) * 0.95, pouso = t - 1.5;
      const meuX = 0, chao = CY - 1.42, fim = vai(trecho(t, 1.92, 2.5));
      fundo({ ox: o.x, oy: o.y, cx, cy, r: entra(trecho(t, 0.04, 0.12)) * 30 + sai(trecho(t, 0.1, 0.52)) * Rmax, t, raio: trecho(t, 0.8, 1.15) * (1 - trecho(t, 1.9, 2.2)), anel: t > 0.9 ? trecho(t, 0.9, 1.5) % 1 : (t > 0.5 ? (trecho(t, 0.5, 0.82) % 1) * 0.6 : 0), brilho: sen(trecho(t, 0.84, 1.5) * PI) * 0.85, som: t > 1.2 ? (1 - fim) * (noAr ? 0.55 : 1) : 0, px: cx, py: (0.5 - (chao + 0.02) / HW) * H, c1: pal.c1, c2: pal.c2, c3: pal.c3, furo, tipo: pess ? 0 : 1 });
      tres();
      /* objeto */
      const ox = mix(X0, 0, k), oy = mix(Y0, CY + 0.1, k) + sen(k * PI) * 0.35 - some * 3.4, e = mix(0.1, 0.96, sai(trecho(t, 0.02, 0.5))) * (1 + b * 0.13) * (1 - some * 0.25), gira = (1 - sai5(trecho(t, 0.02, 0.62))) * -PI * 2.2 + sen(t * 2.2) * 0.06, oz = mix(1.2, -0.2, k) - trecho(t, 0.95, 1.4) * 0.9;
      if (some < 1) {
        const obj = junta(T(ox, oy, oz), RZ((1 - k) * 0.7), RY(gira), RX(0.06), S(e)), cor = [mixc(pal.a[0], pal.b[0], trecho(t, 0.42, 0.9)), mixc(pal.a[1], pal.b[1], trecho(t, 0.42, 0.9))], dentro = mixc([1, 0.86, 0.55], [1, 0.96, 0.82], b), oo = { c: cor, y: [-1, 1, -9, -8], brilho: 1.5, dentro, dentroK: 0.92 };
        if (pess) [[M.esq, -1], [M.dir, 1]].forEach(([m, l]) => peca(m, junta(obj, T(0, 0, -0.5), RY(l * ab * 1.22), T(0, 0, 0.5), T(l * ab * 0.06, 0, 0)), oo));
        else {
          peca(M.tras, obj, oo);
          peca(M.frente, junta(obj, T(0, -0.8, 0), RX(ab * 1.75), T(0, 0.8, 0)), oo);
          if (ab < 0.4) peca(M.faixa, junta(obj, S(1.015, 1.02, 1)), { c: [hex('#FFCB62'), hex('#E59A1E')], brilho: 1.8, a: 1 });
          peca(M.rosca, junta(obj, T(0, 0.92, 0), S(0.3, 0.22, 0.2)), { c: [hex('#FFCB62'), hex('#D98A18')], brilho: 1.8 });
          peca(M.esfera, junta(obj, T(0, -0.8, 0), RX(ab * 1.75), T(0, 0.86, 0.42), S(0.13, 0.15, 0.07)), { c: [hex('#FFD982'), hex('#E59A1E')], brilho: 2 });
        }
      }
      /* confete 3D: corações no Pessoal, papeizinhos e estrelas no Trabalho */
      if (t > 0.92 && t < 2.5) for (let i = 0; i < 34; i++) {
        const u = t - 0.92 - acaso(i) * 0.08; if (u < 0) continue;
        const a = acaso(i + 9) * 2 * PI, v = 1.5 + acaso(i + 3) * 2.4, x = cos(a) * v * (1 - Math.exp(-2.6 * u)) * 0.8, y = CY + (sen(a) * v * 0.8 + 1.2) * (1 - Math.exp(-2.6 * u)) - 0.95 * u * u, z = (acaso(i + 5) - 0.2) * 2.6 * (1 - Math.exp(-2 * u)), tam = (0.06 + acaso(i + 7) * 0.085) * trecho(u, 0, 0.12) * (1 - trecho(t, 2.0, 2.4));
        if (tam < 0.004) continue;
        const pal2 = pess ? [['#FF5C7A', '#D91E3E'], ['#FFB054', '#F2650F'], ['#FFFFFF', '#FFE3CC']] : [['#FFD27A', '#E59A1E'], ['#FF9A3A', '#E8520C'], ['#FFF3E0', '#FFD9B0']], c = pal2[i % 3].map(hex);
        peca(pess || i % 3 ? M.cor : M.esfera, junta(T(x, y, z), RY(u * (3 + acaso(i) * 5)), RX(u * (2 + acaso(i + 1) * 4)), S(tam, tam, pess || i % 3 ? tam : tam * 0.3)), { c, brilho: 1.4 });
      }
      /* o Lembra */
      if (t > 1.0) {
        const g = trecho(t, 1.04, 1.46), esc = mix(0.2, 0.94, sai(trecho(t, 1.0, 1.36))) * mix(1, 0.3, fim), q = { e: esc };
        q.x = mix(meuX, mundoX(o.fx), fim); q.y = mix(mix(CY - 0.7, chao, s) + alt, mundoY(o.fy) - 0.1, fim) + sen(fim * PI) * 1.0; q.z = mix(-0.4, 1.5, sai(s)) * (1 - fim);
        q.ry = (1 - sai(g)) * -PI * 2 + sen(t * 3) * 0.10 * (1 - fim) + fim * PI * 2; q.rx = noAr ? -0.16 : 0.05;
        const amassa = pouso > 0 ? Math.exp(-7 * pouso) * cos(pouso * 19) * 0.24 : 0; q.sq = (noAr ? -0.13 * sen(s * PI) : 0) + amassa;
        const festa = pouso > 0.1 && fim < 0.02 ? sen((t - 1.6) * 17) * 0.24 : 0;
        q.bl = q.br = noAr ? 2.5 : mix(2.5, pess ? 2.2 : 0.5, sai(trecho(pouso, 0.02, 0.3))); q.bl += festa; q.br -= festa; if (!pess && pouso > 0.12) q.br = 2.4 + festa;
        q.pl = noAr ? 0.16 : 0; q.pr = noAr ? 0.24 : 0; q.bada = sen(t * 13) * 0.8 * Math.exp(-max(0, pouso) * 1.4);
        q.rosto = noAr ? 'susto' : pouso < 0.12 ? 'normal' : pess ? 'amor' : 'pisca'; if (fim > 0.4) q.rosto = 'feliz';
        q.a = 1 - trecho(t, 2.48, DUR); lembra(q);
      }
      return t >= DUR;
    }
    return {
      gl, tela, dur: DUR, cena,
      /* quadro parado, fundo transparente (usado para as ilustrações da marca) */
      foto(q) { camera(10, q.camY || 0); limpa(); tres(); (q.antes || []).forEach((z) => peca(M[z.m], junta(T(z.x, z.y, z.z), RZ(z.rz || 0), RY(z.ry || 0), S(z.e, z.e * (z.ey || 1), z.e * (z.ez || 1))), { c: z.c.map(hex), brilho: z.b == null ? 1.4 : z.b })); lembra(q); (q.depois || []).forEach((z) => peca(M[z.m], junta(T(z.x, z.y, z.z), RZ(z.rz || 0), RY(z.ry || 0), S(z.e, z.e * (z.ey || 1), z.e * (z.ez || 1))), { c: z.c.map(hex), brilho: z.b == null ? 1.4 : z.b })); },
      zera() { limpa(); cv.width = cv.height = 2; },
    };
  };
}
