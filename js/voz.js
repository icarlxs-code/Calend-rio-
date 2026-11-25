/* Áudio: gravar e tocar. Formato que toca em qualquer celular:
   - onde o navegador grava AAC (iPhone e Android novos), usa AAC;
   - onde não grava, guarda a voz em µ-law 12 kHz feito aqui mesmo (leve) e o outro aparelho abre como WAV. */
const TX = 12000;
export const MAX = 90;
export const podeGravar = () => !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && (window.AudioContext || window.webkitAudioContext));
const AAC = () => (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported ? ['audio/mp4;codecs=mp4a.40.2', 'audio/mp4'].find((t) => { try { return MediaRecorder.isTypeSupported(t) && !/opus/i.test(t); } catch { return false; } }) : '') || '';
const b64 = (u8) => { let s = ''; for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000)); return btoa(s); };
const de64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
const mu = (x) => { const s = x < 0 ? 0x80 : 0; let v = Math.min(32635, Math.abs(x) * 32767) + 132, e = 7; for (let m = 0x4000; e > 0 && !(v & m); m >>= 1) e--; return ~(s | (e << 4) | ((v >> (e + 3)) & 15)) & 255; };
const umu = (b) => { b = ~b & 255; const e = (b >> 4) & 7, v = ((((b & 15) << 3) + 132) << e) - 132; return b & 0x80 ? -v : v; };
function wav(u8) {
  const n = u8.length, b = new ArrayBuffer(44 + n * 2), d = new DataView(b), t = (o, s) => [...s].forEach((c, i) => d.setUint8(o + i, c.charCodeAt(0)));
  t(0, 'RIFF'); d.setUint32(4, 36 + n * 2, true); t(8, 'WAVEfmt '); d.setUint32(16, 16, true); d.setUint16(20, 1, true); d.setUint16(22, 1, true); d.setUint32(24, TX, true); d.setUint32(28, TX * 2, true); d.setUint16(32, 2, true); d.setUint16(34, 16, true); t(36, 'data'); d.setUint32(40, n * 2, true);
  for (let i = 0; i < n; i++) d.setInt16(44 + i * 2, umu(u8[i]), true);
  return new Blob([b], { type: 'audio/wav' });
}
/** endereço para tocar (blob:) a partir do que veio do servidor */
export function paraTocar(dados) {
  const m = /^data:(audio\/[a-z0-9-]+);base64,(.+)$/.exec(dados || ''); if (!m) return '';
  const u = de64(m[2]);
  return URL.createObjectURL(m[1] === 'audio/x-lembra-mulaw' ? wav(u) : new Blob([u], { type: m[1] }));
}
/** resume a onda em n barrinhas (0 a 100) */
export function resumo(L, n = 40) {
  if (!L.length) return Array(n).fill(8);
  const o = Array.from({ length: n }, (_, i) => { const a = Math.floor((i * L.length) / n), b = Math.max(a + 1, Math.floor(((i + 1) * L.length) / n)); let m = 0; for (let k = a; k < b && k < L.length; k++) m = Math.max(m, L[k]); return m; }), top = Math.max(0.04, ...o);
  return o.map((x) => Math.max(8, Math.round(Math.pow(x / top, 0.7) * 100)));
}
/** começa a gravar. nivel(0..1, segundos) a cada quadro. Devolve { para(), cancela() } */
export async function grava(nivel) {
  const som = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
  const AC = window.AudioContext || window.webkitAudioContext, ctx = new AC();
  if (ctx.state === 'suspended') await ctx.resume().catch(() => {});
  const fonte = ctx.createMediaStreamSource(som), an = ctx.createAnalyser(); an.fftSize = 1024; fonte.connect(an);
  const buf = new Float32Array(an.fftSize), onda = [], t0 = performance.now(), tipo = AAC();
  let vivo = true, rec = null, partes = [], pcm = [], proc = null, mudo = null;
  if (tipo) { rec = new MediaRecorder(som, { mimeType: tipo, audioBitsPerSecond: 32000 }); rec.ondataavailable = (e) => e.data && e.data.size && partes.push(e.data); rec.start(400); }
  else { proc = ctx.createScriptProcessor(4096, 1, 1); mudo = ctx.createGain(); mudo.gain.value = 0; const r = ctx.sampleRate / TX; let p = 0; proc.onaudioprocess = (e) => { const d = e.inputBuffer.getChannelData(0), o = []; for (; p < d.length; p += r) { const i = Math.floor(p), f = p - i, a = d[i], b = i + 1 < d.length ? d[i + 1] : a; o.push(mu(Math.max(-1, Math.min(1, a + (b - a) * f)))); } p -= d.length; pcm.push(Uint8Array.from(o)); }; fonte.connect(proc); proc.connect(mudo); mudo.connect(ctx.destination); }
  const passo = () => { if (!vivo) return; an.getFloatTimeDomainData(buf); let s = 0; for (let i = 0; i < buf.length; i++) s += buf[i] * buf[i]; const v = Math.min(1, Math.sqrt(s / buf.length) * 4), t = (performance.now() - t0) / 1000; onda.push(v); nivel && nivel(v, t); requestAnimationFrame(passo); };
  requestAnimationFrame(passo);
  const solta = () => { vivo = false; som.getTracks().forEach((x) => x.stop()); try { fonte.disconnect(); proc && proc.disconnect(); ctx.close(); } catch { /* ok */ } };
  return {
    async para() {
      const dur = Math.min(MAX, (performance.now() - t0) / 1000); let dados = '';
      if (rec) {
        await new Promise((ok) => { rec.onstop = ok; try { rec.stop(); } catch { ok(); } setTimeout(ok, 1500); });
        const u = new Uint8Array(await new Blob(partes, { type: 'audio/mp4' }).arrayBuffer());
        dados = u.length ? 'data:audio/mp4;base64,' + b64(u) : '';
      } else { const n = pcm.reduce((a, x) => a + x.length, 0), u = new Uint8Array(n); let k = 0; pcm.forEach((x) => { u.set(x, k); k += x.length; }); dados = n ? 'data:audio/x-lembra-mulaw;base64,' + b64(u) : ''; }
      solta();
      return { dados, dur, onda: resumo(onda) };
    },
    cancela() { try { rec && rec.state !== 'inactive' && rec.stop(); } catch { /* ok */ } solta(); },
  };
}
