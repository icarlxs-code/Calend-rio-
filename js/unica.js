/* Visualização única: a sala segura.
   Nenhum navegador deixa um site bloquear a captura de tela (isso só existe em app nativo no Android).
   Então o Lembra faz tudo o que é possível para proteger:
   - só mostra enquanto o dedo está na tela ("segure para ver"); soltou, fecha na hora;
   - fica PRETA no instante em que o app perde o foco, some da frente ou a tela é trocada;
   - no computador, a tecla de print (PrintScreen, Win+Shift+S, Cmd+Shift+3/4/5) apaga a imagem antes do clique;
   - marca d'água com o nome de quem está vendo e a hora: se vazar, dá para saber de onde saiu;
   - bloqueia salvar, arrastar, copiar e o menu de segurar;
   - se houver sinal de captura, o remetente é avisado. */
import { icon } from './icons.js';

const TECLAS = (e) => e.key === 'PrintScreen' || e.code === 'PrintScreen'
  || ((e.metaKey || e.ctrlKey) && e.shiftKey && ['3', '4', '5', 'S', 's'].includes(e.key))
  || (e.metaKey && e.shiftKey && e.key === '0');

/** abre a sala segura. Devolve { sinal: 'fim'|'suspeita', segundos } */
export function abreUnica({ tipo = 'foto', src = '', legenda = '', de = '', quem = '', segundos = 0, aoSinal } = {}) {
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
    ? `<div class="unica__som"><span class="unica__onda" data-onda>${Array.from({ length: 28 }, (_, i) => `<i style="--d:${i * 0.045}s"></i>`).join('')}</span><span class="unica__tempo" data-tempo>0:00</span></div>`
    : `<img class="unica__img" data-img alt="" draggable="false">`}
        <div class="unica__marca" aria-hidden="true">${Array.from({ length: 10 }, () => `<span>${marca}</span>`).join('')}</div>
        <div class="unica__tampa" data-tampa><div><b>Tela protegida</b><small data-motivo>Segure para ver</small></div></div>
      </div>
      ${legenda ? `<p class="unica__cap">${legenda}</p>` : ''}
      <div class="unica__pe"><span class="unica__dica" data-dica>${icon('eye', 18)} Segure com o dedo para ver</span></div>`;
    document.body.append(w); document.body.classList.add('has-unica');
    const q = (s) => w.querySelector(s);
    const img = q('[data-img]'), tampa = q('[data-tampa]'), motivo = q('[data-motivo]');
    let aberto = false, suspeita = '', fechado = false, t0 = 0, vistos = 0;

    const mostra = (on, por = '') => {
      if (fechado) return;
      aberto = on && !suspeita;
      w.classList.toggle('is-vendo', aberto);
      motivo.textContent = suspeita ? 'Captura detectada' : por || 'Segure para ver';
      if (aberto) { t0 = t0 || Date.now(); if (img && !img.src && src) img.src = src; }
      else if (t0) { vistos += Date.now() - t0; t0 = 0; }
    };
    /* qualquer coisa que tire o app da frente é tratada como risco: tampa na hora */
    const risco = (por) => { if (fechado) return; suspeita = suspeita || por; mostra(false); w.classList.add('is-risco'); if (aoSinal) aoSinal(por); };
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
    // segurar para ver
    const palco = q('[data-palco]');
    const segura = (e) => { if (e.pointerType === 'mouse' && e.button) return; palco.setPointerCapture?.(e.pointerId); mostra(true); };
    palco.addEventListener('pointerdown', segura);
    ['pointerup', 'pointercancel', 'pointerleave'].forEach((t) => palco.addEventListener(t, esconde));
    // nada de salvar, arrastar, copiar ou menu
    ['contextmenu', 'dragstart', 'copy', 'cut'].forEach((t) => w.addEventListener(t, (e) => e.preventDefault()));

    const fecha = (como = 'fim') => {
      if (fechado) return; fechado = true;
      if (t0) { vistos += Date.now() - t0; t0 = 0; }
      ouvintes.forEach(([a, b, c]) => a.removeEventListener(b, c, true));
      if (img) img.src = '';
      w.classList.add('is-out'); document.body.classList.remove('has-unica');
      setTimeout(() => w.remove(), 200);
      pronto({ sinal: suspeita || como, segundos: Math.round(vistos / 1000) });
    };
    q('[data-sai]').onclick = () => fecha('fim');
    w.addEventListener('keydown', (e) => { if (e.key === 'Escape') fecha('fim'); });
    if (segundos) setTimeout(() => fecha('fim'), segundos * 1000 + 400);
    requestAnimationFrame(() => w.classList.add('is-in'));
    w.tabIndex = -1; w.focus({ preventScroll: true });
    w._api = { fecha, mostra, risco, elemento: w };
    w.querySelector('[data-palco]').addEventListener('click', (e) => e.preventDefault());
    pronto.api = w._api;
  });
}
