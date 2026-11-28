/* Câmera do story, como no Instagram: abre em tela cheia já no formato 9:16, com o botão de tirar foto,
   o de virar a câmera e a galeria. A foto sai EXATAMENTE como aparece na tela (mesmo corte, e a câmera da
   frente sai como no espelho, do jeito que a pessoa se viu), sempre em 9:16 (1080×1920). */
import { icon } from './icons.js';

const W = 1080, H = 1920, LIMITE = 400000; // o servidor aceita fotos até ~400 KB

/** canvas → JPEG que cabe no limite do servidor */
export function jpeg(c) {
  let q = 0.86, out = c.toDataURL('image/jpeg', q);
  while (out.length > LIMITE && q > 0.4) { q -= 0.08; out = c.toDataURL('image/jpeg', q); }
  if (out.length > LIMITE) { const m = document.createElement('canvas'); m.width = 720; m.height = 1280; m.getContext('2d').drawImage(c, 0, 0, 720, 1280); return jpeg(m); }
  return out;
}

/** foto da galeria em 9:16: a foto inteira no meio, com o fundo feito dela mesma, desfocado (como o Instagram) */
export function encaixa916(src) {
  return new Promise((ok, erro) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d');
      const iw = img.naturalWidth, ih = img.naturalHeight, r = iw / ih;
      if (Math.abs(r - W / H) < 0.02) { g.drawImage(img, 0, 0, W, H); return ok(jpeg(c)); } // já é 9:16
      // fundo: a própria foto cobrindo tudo, desfocada e um pouco escura
      const kc = Math.max(W / iw, H / ih); g.filter = 'blur(40px) brightness(.7)';
      g.drawImage(img, (W - iw * kc) / 2, (H - ih * kc) / 2, iw * kc, ih * kc); g.filter = 'none';
      // a foto inteira, centralizada
      const k = Math.min(W / iw, H / ih), w = iw * k, h = ih * k;
      g.drawImage(img, (W - w) / 2, (H - h) / 2, w, h);
      ok(jpeg(c));
    };
    img.onerror = () => erro(new Error('Não consegui ler a foto.'));
    img.src = src;
  });
}
const lerArquivo = (f) => new Promise((ok, erro) => { const u = URL.createObjectURL(f); encaixa916(u).then((x) => { URL.revokeObjectURL(u); ok(x); }, erro); });

export const temCamera = () => !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);

/** abre a câmera; devolve a foto 9:16 (data URL) ou null se fechou. soCamera: sem galeria (foto da hora) */
export function abreCamera({ soCamera = false, lado = 'environment' } = {}) {
  return new Promise((fim) => {
    let fluxo = null, frente = lado === 'user', acabou = false;
    const w = document.createElement('div');
    w.className = 'scam'; w.setAttribute('role', 'dialog'); w.setAttribute('aria-label', 'Câmera do story');
    w.innerHTML = `<div class="scam__quadro"><video class="scam__v" playsinline muted autoplay></video><div class="scam__flash"></div><p class="scam__msg" hidden></p>
        <button type="button" class="scam__x" data-x aria-label="Fechar">${icon('x', 26)}</button></div>
      <div class="scam__barra">
        ${soCamera ? '<span class="scam__vaga"></span>' : `<label class="scam__gal" aria-label="Escolher da galeria">${icon('image', 24)}<input type="file" accept="image/*" hidden data-gal></label>`}
        <button type="button" class="scam__clique" data-foto aria-label="Tirar foto"><i></i></button>
        <button type="button" class="scam__vira" data-vira aria-label="Virar a câmera"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 11a8 8 0 0 0-14.3-4.9L4 8"/><path d="M4 3v5h5"/><path d="M4 13a8 8 0 0 0 14.3 4.9L20 16"/><path d="M20 21v-5h-5"/></svg></button>
      </div>`;
    document.body.appendChild(w); document.body.classList.add('has-scam');
    const v = w.querySelector('video'), msg = w.querySelector('.scam__msg');
    const para = () => { if (fluxo) fluxo.getTracks().forEach((t) => t.stop()); fluxo = null; };
    const sai = (x) => { if (acabou) return; acabou = true; para(); w.classList.add('is-out'); setTimeout(() => { w.remove(); document.body.classList.remove('has-scam'); }, 220); fim(x); };
    const liga = async () => {
      para(); msg.hidden = true;
      try {
        fluxo = await navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: frente ? 'user' : { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } } });
        if (acabou) return para();
        v.srcObject = fluxo; v.classList.toggle('is-frente', frente); await v.play().catch(() => {});
      } catch (e) {
        msg.hidden = false;
        msg.textContent = /Permission|NotAllowed/i.test(e && e.name) ? 'O Lembra precisa da permissão da câmera. Libere nos ajustes do celular e tente de novo.' : 'Não consegui abrir a câmera agora.';
      }
    };
    w.querySelector('[data-x]').onclick = () => sai(null);
    w.querySelector('[data-vira]').onclick = () => { frente = !frente; w.querySelector('[data-vira]').animate([{ transform: 'rotate(0)' }, { transform: 'rotate(180deg)' }], { duration: 320, easing: 'ease-out' }); liga(); };
    const gal = w.querySelector('[data-gal]');
    if (gal) gal.onchange = async () => { const f = gal.files && gal.files[0]; if (!f) return; try { sai(await lerArquivo(f)); } catch (e) { msg.hidden = false; msg.textContent = e.message; } };
    w.querySelector('[data-foto]').onclick = () => {
      if (!v.videoWidth) return;
      const c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d');
      // o mesmo corte da tela: o vídeo cobre o quadro 9:16 pelo centro
      const vw = v.videoWidth, vh = v.videoHeight, k = Math.max(W / vw, H / vh), dw = vw * k, dh = vh * k;
      if (frente) { g.translate(W, 0); g.scale(-1, 1); } // a câmera da frente sai como a pessoa se viu (espelho), sem inverter
      g.drawImage(v, (W - dw) / 2, (H - dh) / 2, dw, dh);
      w.querySelector('.scam__flash').animate([{ opacity: 0.9 }, { opacity: 0 }], { duration: 260, easing: 'ease-out' });
      try { navigator.vibrate && navigator.vibrate(12); } catch { /* ok */ }
      setTimeout(() => sai(jpeg(c)), 140);
    };
    requestAnimationFrame(() => w.classList.add('is-in'));
    liga();
  });
}
