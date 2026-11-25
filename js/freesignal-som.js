/* FreeSignal · canal de som: manda bytes de um celular para outro pelo alto-falante e pelo microfone,
   numa faixa quase inaudível (17 a 20 kHz). Sem internet, sem Bluetooth, sem par: só estar por perto.
   16 tons (4 bits por símbolo), preâmbulo para achar o começo, CRC-16 para conferir.
   Só matemática: dá para testar fora do navegador. */
export const TAXA = 48000;          // amostras por segundo
export const T0 = 17000;            // primeiro tom
export const PASSO = 200;           // distância entre tons (Hz)
export const TONS = 16;             // 4 bits por símbolo
export const SIMBOLO = 0.04;        // 40 ms por símbolo = 100 bits/s
const N = () => Math.round(TAXA * SIMBOLO);
const PRE = [0, 15, 0, 15, 5, 10];  // preâmbulo: alto-baixo para o microfone se ajustar, e marca o início
const freq = (i) => T0 + i * PASSO;

export function crc16(b) {
  let c = 0xffff;
  for (const x of b) { c ^= x << 8; for (let i = 0; i < 8; i++) c = c & 0x8000 ? ((c << 1) ^ 0x1021) & 0xffff : (c << 1) & 0xffff; }
  return c;
}
/* bytes -> símbolos (4 bits cada), com tamanho e CRC */
export function pacote(bytes) {
  const d = Uint8Array.from(bytes);
  if (d.length > 255) throw new Error('mensagem longa demais para um pacote (255 bytes)');
  const c = crc16(d), corpo = [d.length, ...d, c >> 8, c & 0xff], s = [];
  for (const b of corpo) { s.push(b >> 4, b & 15); }
  return [...PRE, ...s];
}
/* símbolos -> som (fase contínua: sem estalo entre tons) */
export function toca(simbolos) {
  const n = N(), out = new Float32Array(simbolos.length * n);
  let fase = 0, k = 0;
  for (const s of simbolos) {
    const w = (2 * Math.PI * freq(s)) / TAXA;
    for (let i = 0; i < n; i++, k++) {
      const r = i / n, env = Math.min(1, r * 12, (1 - r) * 12);   // sobe e desce suave nas pontas
      out[k] = Math.sin(fase) * 0.8 * env; fase += w;
    }
    fase %= 2 * Math.PI;
  }
  return out;
}
export const codifica = (bytes) => toca(pacote(bytes));
export const texto = (s) => new TextEncoder().encode(s);
export const detexto = (b) => new TextDecoder().decode(Uint8Array.from(b));

/* energia de um tom numa janela (Goertzel) */
function forca(x, ini, n, f) {
  const w = 2 * Math.cos((2 * Math.PI * Math.round((f * n) / TAXA)) / n);
  let a = 0, b = 0;
  for (let i = 0; i < n; i++) { const t = x[ini + i] * (0.54 - 0.46 * Math.cos((2 * Math.PI * i) / n)) + w * a - b; b = a; a = t; }
  return a * a + b * b - w * a * b;
}
const melhorTom = (x, ini, n) => { let m = -1, v = -1, soma = 0; for (let t = 0; t < TONS; t++) { const e = forca(x, ini, n, freq(t)); soma += e; if (e > v) { v = e; m = t; } } return { t: m, v, rel: v / (soma - v + 1e-9) }; };

/* som -> bytes. Procura o preâmbulo, trava no começo e lê símbolo a símbolo. */
export function decodifica(x) {
  const L = leitor({ janela: Math.max(13, x.length / TAXA + 1) });
  const passo = Math.round(TAXA / 4);
  for (let p = 0; p < x.length; p += passo) { const r = L.poe(x.subarray(p, Math.min(x.length, p + passo))); if (r && r.ok) return r; }
  return { ok: false, erro: 'não achei o começo' };
}

/* Leitor em fluxo: recebe pedaços do microfone e procura só no que chegou (não relê tudo,
   senão a tela trava depois de alguns segundos). */
export function leitor({ janela = 12 } = {}) {
  const n = N(), salto = Math.max(1, Math.round(n / 6)), MAX = Math.round(TAXA * janela);
  let buf = new Float32Array(0), base = 0, visto = 0;   // base = quantas amostras já saíram do começo
  const precisa = n * PRE.length;
  return {
    poe(chunk) {
      const x = new Float32Array(buf.length + chunk.length); x.set(buf); x.set(chunk, buf.length); buf = x;
      if (buf.length > MAX) { const corta = buf.length - MAX; buf = buf.slice(corta); base += corta; visto = Math.max(0, visto - corta); }
      for (let p = visto; p + precisa < buf.length; p += salto) {
        visto = p;
        let ok = true;
        for (let i = 0; i < PRE.length && ok; i++) { const r = melhorTom(buf, p + i * n, n); if (r.t !== PRE[i] || r.rel < 1.2) ok = false; }
        if (!ok) continue;
        const r = leDe(buf, p + precisa);
        if (r.ok) { visto = p + precisa; return r; }
        if (r.erro === 'som cortado') { visto = Math.max(0, p - salto); return null; }   // espera chegar o resto
      }
      visto = Math.max(0, buf.length - precisa);
      return null;
    },
    segundos: () => (base + buf.length) / TAXA,
  };
}
function leDe(x, inicio) {
  const n = N();
  const le = (k) => { const a = melhorTom(x, inicio + 2 * k * n, n), b = melhorTom(x, inicio + (2 * k + 1) * n, n); return (a.t << 4) | b.t; };
  const cabe = (k) => inicio + (2 * k + 2) * n <= x.length;
  if (!cabe(0)) return { ok: false, erro: 'som cortado' };
  const tam = le(0);
  if (!cabe(tam + 2)) return { ok: false, erro: 'som cortado' };
  const d = []; for (let i = 1; i <= tam; i++) d.push(le(i));
  const c = (le(tam + 1) << 8) | le(tam + 2);
  return crc16(d) === c ? { ok: true, bytes: Uint8Array.from(d) } : { ok: false, erro: 'chegou com erro' };
}

/* ---------- no navegador ---------- */
export async function manda(bytes, ctx) {
  const a = ctx || new (window.AudioContext || window.webkitAudioContext)({ sampleRate: TAXA });
  if (a.state !== 'running') await a.resume().catch(() => {});
  const s = codifica(bytes), buf = a.createBuffer(1, s.length, TAXA);
  buf.getChannelData(0).set(s);
  const f = a.createBufferSource(); f.buffer = buf; f.connect(a.destination); f.start();
  return new Promise((r) => { f.onended = () => r(s.length / TAXA); });
}
/* escuta pelo microfone até entender uma mensagem (ou acabar o tempo) */
export async function escuta({ segundos = 30, ctx } = {}) {
  const mic = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false, channelCount: 1 } });
  const a = ctx || new (window.AudioContext || window.webkitAudioContext)({ sampleRate: TAXA });
  if (a.state !== 'running') await a.resume().catch(() => {});
  const fonte = a.createMediaStreamSource(mic), no = a.createScriptProcessor ? a.createScriptProcessor(4096, 1, 1) : null;
  if (!no) { mic.getTracks().forEach((t) => t.stop()); throw new Error('este aparelho não deixa ouvir'); }
  return new Promise((pronto) => {
    const fim = (r) => { try { no.disconnect(); fonte.disconnect(); mic.getTracks().forEach((t) => t.stop()); } catch { /* ok */ } pronto(r); };
    const limite = setTimeout(() => fim({ ok: false, erro: 'ninguém falou comigo' }), segundos * 1000);
    const L = leitor();
    const mudo = a.createGain(); mudo.gain.value = 0;
    no.onaudioprocess = (e) => {
      const r = L.poe(new Float32Array(e.inputBuffer.getChannelData(0)));
      if (r && r.ok) { clearTimeout(limite); fim(r); }
    };
    fonte.connect(no); no.connect(mudo); mudo.connect(a.destination);
  });
}
