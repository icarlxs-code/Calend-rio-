/* Novidades animadas: na primeira vez depois de uma atualização grande, o Lembra aparece e mostra o que mudou,
   um toque por vez. Cada pessoa vê UMA vez por atualização (no aparelho e na conta).
   ATUALIZAÇÃO NOVA: basta pôr a versão em NOVIDADES com os quadros dela: { t título, s fala, m humor, g gesto, c cena, v roupa }. */
import { sininho, alive, setMood, act, say, veste } from './sininho.js';
import { roupa, cachecol } from './roupas.js';
import { icon } from './icons.js';

export const NOVIDADES = {
  '2.32.0': [
    { t: 'Eu mudei!', s: 'Cheguei com novidade boa. Vem ver, é rapidinho.', m: 'feliz', g: 'tchau', c: 'abre' },
    { t: 'Nada some sem querer', s: 'Apagou? Fica 24 horas na lixeira e volta com um toque.', m: 'surpreso', g: 'sim', c: 'lixeira' },
    { t: 'Frases que não se repetem', s: 'Agora é possível dizer 👎 e aquela frase nunca mais volta.', m: 'feliz', g: 'pisca', c: 'frase' },
    { t: 'Eu fico na conversa', s: 'Escrevo, gravo e leio junto com vocês.', m: 'feliz', c: 'conversa', v: 'digita' },
    { t: 'Achou, é só tocar', s: 'Telefone, e-mail ou ID: tudo no mesmo lugar, do jeito que você escrever.', m: 'feliz', g: 'olhaLados', c: 'achar' },
    { t: 'Seu perfil do seu jeito', s: 'Nome, ID, bairro, idade: edite tudo e escolha o que aparece.', m: 'feliz', g: 'sobrancelha', c: 'perfil' },
    { t: 'Meu time, seu time', s: 'Me conta o seu time e eu lembro você dos jogos dele.', m: 'feliz', c: 'time', v: 'torcida' },
  ],
};
const num = (v) => String(v).split('.').map((x) => parseInt(x, 10) || 0);
const maior = (a, b) => { const A = num(a), B = num(b); for (let i = 0; i < 3; i++) if ((A[i] || 0) !== (B[i] || 0)) return (A[i] || 0) > (B[i] || 0); return false; };
/** quadros de tudo que é novo entre a versão que a pessoa tinha e a de agora */
export function quadrosDesde(antes, agora, lista = NOVIDADES) {
  const vs = Object.keys(lista).filter((v) => maior(v, antes) && !maior(v, agora)).sort((a, b) => (maior(a, b) ? -1 : 1));
  return vs.flatMap((v) => lista[v]).slice(0, 9);
}

const d = (n) => `style="--d:${n}s"`;
/* cenas desenhadas em código: só transform e opacidade */
const CENAS = {
  abre: () => `<div class="nvc nvc--abre">${Array.from({ length: 14 }, (_, i) => `<i style="--a:${(i * 360) / 14}deg;--c:${['#FF6A1A', '#FFB800', '#34C759', '#5AA9FF'][i % 4]};--d:${0.2 + (i % 4) * 0.06}s"></i>`).join('')}<b ${d(0.1)}>Novidades</b></div>`,
  lixeira: () => `<div class="nvc nvc--lix"><span class="nvc__card">${icon('calendar', 20)}<b>Reunião às 15h</b></span><span class="nvc__bin">${icon('trash', 34)}</span><span class="nvc__undo">Desfazer</span></div>`,
  frase: () => '<div class="nvc nvc--frase"><span class="is-a"><b>Um passo pequeno hoje já conta.</b></span><span class="is-b"><b>Descansar também é cuidar de você.</b></span><em>👎</em></div>',
  conversa: () => `<div class="nvc nvc--conv"><span class="is-eu" ${d(0.2)}>Bora sábado?</span><span ${d(0.9)}>Bora! Que horas?</span><span class="is-dig" ${d(1.6)}><i></i><i></i><i></i></span></div>`,
  achar: () => `<div class="nvc nvc--achar"><span class="nvc__campo">${icon('search', 20)}<b><i>21 98888 7777</i><i>(21) 98888-7777</i><i>lia@exemplo.com</i><i>@lia.moraes</i></b></span><span class="nvc__achou"><u>L</u><b>Lia Moraes</b><em>${icon('check', 16)}</em></span></div>`,
  perfil: () => `<div class="nvc nvc--perf">${[['Nome', 'Lia Moraes'], ['ID', '@lia.moraes'], ['Cidade', 'Rio de Janeiro'], ['Bairro', 'Centro']].map(([a, b], i) => `<span ${d(0.15 + i * 0.22)}><small>${a}</small><b>${b}</b><em>${icon('check', 14)}</em></span>`).join('')}</div>`,
  time: () => `<div class="nvc nvc--time"><span class="nvc__push"><u>${icon('bell', 24)}</u><span><b>Hoje tem jogo do seu time</b><small>às 21h30. Já separou a pipoca?</small></span></span><i class="nvc__bola"></i></div>`,
};
let aberta = null;
export function abreNovidades(quadros, aoFechar) {
  if (aberta || !quadros.length) return null;
  let i = 0, vez = 0; const antes = document.activeElement;
  const w = document.createElement('div'); w.className = 'nv'; w.tabIndex = -1; w.setAttribute('role', 'dialog'); w.setAttribute('aria-modal', 'true'); w.setAttribute('aria-label', 'Novidades do Lembra');
  w.innerHTML = `<div class="nv__bars">${quadros.map(() => '<i><b></b></i>').join('')}</div><button class="nv__pula" data-pula>Pular</button>
    <div class="nv__palco" data-palco></div>
    <div class="nv__baixo snhwrap"><h2 data-t></h2><div class="snhb nv__fala"><span class="snhb__txt" aria-live="polite"></span></div><span class="nv__snh">${sininho('feliz', { size: 220 })}</span></div>
    <button class="nv__zona nv__zona--l" data-volta tabindex="-1" aria-label="Voltar"></button><button class="nv__zona nv__zona--r" data-vai tabindex="-1" aria-label="Próxima novidade"></button>
    <button class="nv__ok" data-ok><span></span></button>`;
  document.body.appendChild(w); document.body.classList.add('has-nv'); aberta = w; alive();
  const q = (s) => w.querySelector(s), snh = () => q('.nv__snh [data-snh]');
  const fecha = () => { if (!aberta) return; aberta = null; document.removeEventListener('keydown', tecla, true); w.classList.add('is-out'); setTimeout(() => { w.remove(); document.body.classList.remove('has-nv'); }, 260); if (antes && antes.focus) antes.focus({ preventScroll: true }); if (aoFechar) aoFechar(); };
  const mostra = (dir = 1) => {
    const s = quadros[i], minha = ++vez; w.dataset.c = s.c; w.style.setProperty('--dir', dir);
    w.querySelectorAll('.nv__bars i').forEach((b, k) => b.classList.toggle('is-on', k <= i));
    const velho = q('[data-palco] .nvc:not(.is-sai)'); if (velho) { velho.classList.add('is-sai'); setTimeout(() => velho.remove(), 220); }
    setTimeout(() => { if (minha === vez) q('[data-palco]').insertAdjacentHTML('beforeend', (CENAS[s.c] || CENAS.abre)()); }, velho ? 160 : 0);
    const t = q('[data-t]'); t.textContent = s.t; t.classList.remove('is-in'); void t.offsetWidth; t.classList.add('is-in');
    q('[data-ok] span').textContent = i < quadros.length - 1 ? 'Próxima' : 'Bora!';
    const e = snh();
    if (e) {
      const r = s.v ? roupa(s.v) : { mood: s.m || 'feliz', l: ['baixo'], r: ['baixo'] };
      veste(e, s.v === 'torcida' ? { ...r, ros: cachecol(['#2E6FE0', '#FFF6EE']) } : r);
      setMood(e, s.m || 'feliz');
      if (!s.v) { veste(e, null); setTimeout(() => minha === vez && act(e, s.g || 'sim'), 380); }
    }
    say(e, s.s, { bubble: q('.snhb__txt'), speed: 20 });
  };
  const anda = (n) => { if (i + n < 0) return; if (i + n >= quadros.length) { fecha(); return; } i += n; mostra(n); import('./sound.js').then((m) => m.msgVai && m.msgVai()).catch(() => {}); };
  const tecla = (e) => { if (e.key === 'Escape') { e.preventDefault(); fecha(); } else if (e.key === 'ArrowRight' || (e.key === 'Enter' && document.activeElement === w)) anda(1); else if (e.key === 'ArrowLeft') anda(-1); else if (e.key === 'Tab') { const f = [q('[data-pula]'), q('[data-ok]')]; e.preventDefault(); f[document.activeElement === f[1] ? 0 : 1].focus(); } };
  document.addEventListener('keydown', tecla, true);
  q('[data-pula]').onclick = fecha; q('[data-ok]').onclick = () => anda(1); q('[data-vai]').onclick = () => anda(1); q('[data-volta]').onclick = () => anda(-1);
  requestAnimationFrame(() => w.classList.add('is-in')); mostra(); w.focus({ preventScroll: true });
  return { fecha };
}
