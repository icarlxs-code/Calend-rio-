/* "Perto de mim": conversa sem internet nenhuma.
   Dois celulares com o Lembra, lado a lado: um chama (o aparelho toca um som quase inaudível com o
   convite), o outro escuta e responde pelo mesmo caminho. Feito o aperto de mão, a conversa corre
   direto entre os dois pela rede local — sem Wi-Fi com internet, sem dados, sem servidor.
   Cada mensagem fica só nos dois aparelhos. */
import { icon } from './icons.js';
import { openSheet, toast } from './components.js';
import { sininho, alive, setMood, act } from './sininho.js';
import * as elo from './elo.js';
import * as som from './freesignal-som.js';

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const agora = () => new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

export function abrePerto() {
  let pc = null, canal = null, ouvindo = null, vivo = false, base = null;
  const msgs = [];
  const s = openSheet({
    className: 'sheet--tall sheet--fx sheet--perto',
    html: `<div class="perto">
      <header class="perto__top"><button class="iconbtn" data-close aria-label="Fechar">${icon('left', 22)}</button>
        <span><b>Perto de mim</b><small data-st>sem internet, direto entre vocês</small></span></header>
      <div class="perto__palco" data-palco>
        <span class="perto__snh">${sininho('feliz', { size: 150 })}</span>
        <p class="perto__dica" data-dica>Dois celulares, um do lado do outro. Um chama, o outro escuta.</p>
        <div class="perto__btns" data-btns>
          <button class="btn btn--primary btn--block btn--big" data-chamar>${icon('volume', 20)} Chamar quem está perto</button>
          <button class="btn btn--soft btn--block" data-ouvir>${icon('mic', 20)} Escutar um chamado</button>
        </div>
        <div class="perto__barra" data-barra hidden><i></i><span data-passo></span></div>
      </div>
      <div class="perto__conversa" data-lista hidden></div>
      <form class="perto__barraenv" data-env hidden autocomplete="off">
        <input type="text" maxlength="250" placeholder="Mensagem" data-txt aria-label="Mensagem">
        <button class="conv__b conv__b--ir" type="submit" aria-label="Enviar">${icon('right', 20)}</button>
      </form>
    </div>`,
    onClose: () => { try { if (ouvindo) ouvindo.para && ouvindo.para(); } catch { /* ok */ } try { canal && canal.close(); pc && pc.close(); } catch { /* ok */ } },
    onMount: (a) => { base = a.el; liga(); },
  });
  function q(sel) { return (base || s.el).querySelector(sel); }   // função (não const): a tela se liga antes desta linha rodar

  function passo(txt, mostrando = true) {
    const b = q('[data-barra]'); b.hidden = !mostrando; q('[data-passo]').textContent = txt;
    q('[data-dica]').textContent = mostrando ? '' : 'Dois celulares, um do lado do outro. Um chama, o outro escuta.';
  }
  function pinta() {
    const l = q('[data-lista]');
    l.innerHTML = msgs.map((m) => `<div class="pmsg${m.meu ? ' is-eu' : ''}"><span>${esc(m.txt)}</span><small>${esc(m.hora)}</small></div>`).join('');
    l.scrollTop = l.scrollHeight;
  }
  function conectado() {
    vivo = true;
    q('[data-btns]').hidden = true; q('[data-barra]').hidden = true;
    q('[data-lista]').hidden = false; q('[data-env]').hidden = false;
    q('[data-st]').textContent = 'ligados! sem internet 🔥';
    setMood(q('[data-snh]'), 'comemora'); act(q('[data-snh]'), 'pulo');
    toast('Vocês estão conversando sem internet 🔥', { ms: 5000 });
    canal.onmessage = (e) => { try { const o = JSON.parse(e.data); msgs.push({ txt: o.txt, hora: o.hora || agora(), meu: false }); pinta(); } catch { /* ignora */ } };
    canal.onclose = () => { vivo = false; q('[data-st]').textContent = 'o elo caiu'; };
  }
  /* quem chama: toca o convite e fica ouvindo a resposta */
  async function chamar() {
    try {
      passo('preparando o convite…');
      const o = await elo.convida({ prazo: 2500 });
      pc = o.pc; canal = o.canal;
      passo('tocando o convite (som quase inaudível)…');
      await som.manda(som.texto(o.texto));
      passo('ouvindo a resposta… deixe os aparelhos próximos');
      ouvindo = { para: null };
      const r = await som.escuta({ segundos: 60 });
      if (!r.ok) { passo(''); toast('Não ouvi a resposta. Tente de novo mais perto.', { ms: 6000 }); return; }
      passo('fechando o elo…');
      await elo.fecha(pc, som.detexto(r.bytes));
      await elo.esperaAbrir(canal, 15000);
      conectado();
    } catch (e) { passo(''); toast(`Não deu: ${e.message}`, { ms: 6000 }); }
  }
  /* quem escuta: ouve o convite, responde pelo som e espera o canal abrir */
  async function ouvir() {
    try {
      passo('escutando um chamado… peça para a outra pessoa tocar em "Chamar"');
      const r = await som.escuta({ segundos: 90 });
      if (!r.ok) { passo(''); toast('Não ouvi nenhum chamado por aqui.', { ms: 6000 }); return; }
      passo('respondendo…');
      const o = await elo.aceita(som.detexto(r.bytes), { prazo: 2500 });
      pc = o.pc;
      await som.manda(som.texto(o.texto));
      passo('esperando o outro aparelho…');
      canal = await Promise.race([o.canal, new Promise((_, no) => setTimeout(() => no(new Error('não veio')), 20000))]);
      await elo.esperaAbrir(canal, 15000);
      conectado();
    } catch (e) { passo(''); toast(`Não deu: ${e.message}`, { ms: 6000 }); }
  }
  function liga() {
    alive();
    q('[data-chamar]').onclick = chamar;
    q('[data-ouvir]').onclick = ouvir;
    q('[data-env]').onsubmit = (e) => {
      e.preventDefault();
      const i = q('[data-txt]'), txt = i.value.trim();
      if (!txt || !vivo) return;
      i.value = '';
      const m = { txt, hora: agora(), meu: true };
      try { canal.send(JSON.stringify({ txt, hora: m.hora })); msgs.push(m); pinta(); } catch { toast('O elo caiu. Chame de novo.'); }
    };
  }
  return s;
}
