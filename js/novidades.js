/* Novidades animadas: na primeira vez depois de uma atualização grande, o Lembra aparece e mostra o que mudou,
   um toque por vez. Cada pessoa vê UMA vez por atualização (no aparelho e na conta).
   ATUALIZAÇÃO NOVA: basta pôr a versão em NOVIDADES com os quadros dela: { t título, s fala, m humor, g gesto, c cena, v roupa }. */
import { sininho, alive, setMood, act, say, veste } from './sininho.js';
import { roupa, cachecol } from './roupas.js';
import { icon } from './icons.js';
import { locutor, temVoz, vozLigada, ligaVoz, duracao, carrega } from './voz-novidades.js';
import { anel, bolinha } from './anel.js';

export const NOVIDADES = {
  '2.32.0': [
    { t: 'Eu mudei!', s: 'Senhoras, senhores e distraídos… chegou novidade! Vem ver, é rapidinho.', m: 'feliz', g: 'tchau', c: 'abre' },
    { t: 'Deslize o dedo', s: 'Agora é possível trocar de aba só deslizando o dedo. Que elegância!', m: 'feliz', g: 'olhaLados', c: 'desliza' },
    { t: 'Abro sem internet', s: 'Sem internet? Eu abro mesmo assim. O que você mudar, sobe depois.', m: 'feliz', g: 'sim', c: 'offline' },
    { t: 'Seu Pessoal limpo', s: 'O seu Pessoal ficou limpo: cada coisa uma vez só, com o ícone certo.', m: 'feliz', g: 'pisca', c: 'limpo' },
    { t: 'Assistente mais claro', s: 'Meu lado assistente mostra tudo antes. Nada muda sem você confirmar.', m: 'feliz', g: 'sobrancelha', c: 'assist' },
    { t: 'Nada some sem querer', s: 'Apagou sem querer? 24 horas na lixeira, e volta com um toque.', m: 'surpreso', g: 'sim', c: 'lixeira' },
    { t: 'Eu fico na conversa', s: 'E na conversa, adivinha? Eu escrevo, gravo e leio junto com vocês.', m: 'feliz', c: 'conversa', v: 'digita' },
    { t: 'Arraste a conversa', s: 'Arraste a conversa: fixe, arquive ou tranque. E mande foto para ver uma vez só.', m: 'feliz', g: 'sim', c: 'arrasta' },
    { t: 'Stories com número', s: 'Nos stories, o anel agora conta quantos faltam ver. Curiosos agradecem.', m: 'surpreso', g: 'olhaLados', c: 'stories' },
    { t: 'Achou, é só tocar', s: 'Também é possível achar alguém por telefone, e-mail ou ID. Simples assim.', m: 'feliz', g: 'olhaLados', c: 'achar' },
    { t: 'Seu perfil do seu jeito', s: 'Seu perfil, do seu jeito: edite tudo e escolha o que aparece.', m: 'feliz', g: 'sobrancelha', c: 'perfil' },
    { t: 'Meu time, seu time', s: 'E conte para mim: qual é o seu time? Eu lembro. Você vive.', m: 'feliz', c: 'time', v: 'torcida' },
  ],
};
const num = (v) => String(v).split('.').map((x) => parseInt(x, 10) || 0);
const maior = (a, b) => { const A = num(a), B = num(b); for (let i = 0; i < 3; i++) if ((A[i] || 0) !== (B[i] || 0)) return (A[i] || 0) > (B[i] || 0); return false; };
/** quadros de tudo que é novo entre a versão que a pessoa tinha e a de agora */
export function quadrosDesde(antes, agora, lista = NOVIDADES) {
  const vs = Object.keys(lista).filter((v) => maior(v, antes) && !maior(v, agora)).sort((a, b) => (maior(a, b) ? -1 : 1));
  return vs.flatMap((v) => lista[v]).slice(0, 12);
}

const d = (n) => `style="--d:${n}s"`;
/* cenas desenhadas em código: só transform e opacidade */
const CENAS = {
  abre: () => `<div class="nvc nvc--abre">${Array.from({ length: 14 }, (_, i) => `<i style="--a:${(i * 360) / 14}deg;--c:${['#FF6A1A', '#FFB800', '#34C759', '#5AA9FF'][i % 4]};--d:${0.2 + (i % 4) * 0.06}s"></i>`).join('')}<b ${d(0.1)}>Novidades</b></div>`,
  lixeira: () => `<div class="nvc nvc--lix"><span class="nvc__card">${icon('calendar', 20)}<b>Reunião às 15h</b></span><span class="nvc__bin">${icon('trash', 34)}</span><span class="nvc__undo">Desfazer</span></div>`,
  frase: () => '<div class="nvc nvc--frase"><span class="is-a"><b>Um passo pequeno hoje já conta.</b></span><span class="is-b"><b>Descansar também é cuidar de você.</b></span><em>👎</em></div>',
  conversa: () => `<div class="nvc nvc--conv"><span class="is-eu" ${d(0.2)}>Bora sábado?</span><span ${d(0.9)}>Bora! Que horas?</span><span class="is-dig" ${d(1.6)}><i></i><i></i><i></i></span></div>`,
  desliza: () => '<div class="nvc nvc--des"><span class="nvc__tela"><i></i><i></i><i></i></span><span class="nvc__tela is-b"><i></i><i></i></span><u></u></div>',
  offline: () => `<div class="nvc nvc--off"><span class="nvc__faixa">Sem internet: sua agenda está aqui</span><span class="nvc__lin"><u>${icon('calendar', 22)}</u><span><b>Dentista</b><small>15h</small></span></span><span class="nvc__lin"><u>${icon('check', 22)}</u><span><b>Pagar a luz</b><small>feito</small></span></span></div>`,
  limpo: () => `<div class="nvc nvc--arr">${[['droplet', '#0A8AD8', 'Beber água', 'todo dia 10h'], ['hospital', '#12894B', 'Levar no hospital', 'segunda 14h'], ['scissors', '#D9367A', 'Cortar cabelo', 'sexta 18h']].map(([ic, c, t, q], i) => `<span class="nvc__lin nvc__lin--e" style="--d:${0.15 + i * 0.25}s"><u style="background:${c}">${icon(ic, 24)}</u><span><b>${t}</b><small>${q}</small></span></span>`).join('')}</div>`,
  assist: () => '<div class="nvc nvc--ass"><span class="nvc__pede">Quando acaba o empréstimo?</span><span class="nvc__card2"><b>Quer que eu crie?</b><small>Desconto do empréstimo · todo dia 15</small><em><i>Confirmar</i><i>Agora não</i></em></span></div>',
  stories: () => `<div class="nvc nvc--st">${[['A', '#0A8AD8', [0, 0, 0]], ['B', '#6D3AE0', [1, 0]], ['C', '#05855F', [1]]].map(([n, c, v], i) => { const r = { uid: n, stories: v.map((x, k) => ({ id: n + k, seen: !!x })) }; return `<span style="--d:${0.15 + i * 0.2}s"><u style="background:${c}">${n}</u>${anel(r)}${bolinha(r)}</span>`; }).join('')}</div>`,
  arrasta: () => `<div class="nvc nvc--arr"><span class="nvc__tras">${icon('lock', 24)}<b>Trancar</b></span><span class="nvc__lin"><u>L</u><span><b>Lia Moraes</b><small>Bora sábado?</small></span></span><span class="nvc__lin"><u>C</u><span><b>Caio Prado</b><small>① Foto</small></span></span></div>`,
  achar: () => `<div class="nvc nvc--achar"><span class="nvc__campo">${icon('search', 20)}<b><i>21 98888 7777</i><i>(21) 98888-7777</i><i>lia@exemplo.com</i><i>@lia.moraes</i></b></span><span class="nvc__achou"><u>L</u><b>Lia Moraes</b><em>${icon('check', 16)}</em></span></div>`,
  perfil: () => `<div class="nvc nvc--perf">${[['Nome', 'Lia Moraes'], ['ID', '@lia.moraes'], ['Cidade', 'Rio de Janeiro'], ['Bairro', 'Centro']].map(([a, b], i) => `<span ${d(0.15 + i * 0.22)}><small>${a}</small><b>${b}</b><em>${icon('check', 14)}</em></span>`).join('')}</div>`,
  time: () => `<div class="nvc nvc--time"><span class="nvc__push"><u>${icon('bell', 24)}</u><span><b>Hoje tem jogo do seu time</b><small>às 21h30. Já separou a pipoca?</small></span></span><i class="nvc__bola"></i></div>`,
};
let aberta = null;
export function abreNovidades(quadros, aoFechar) {
  if (aberta || !quadros.length) return null;
  let i = 0, vez = 0; const antes = document.activeElement;
  const w = document.createElement('div'); w.className = 'nv'; w.tabIndex = -1; w.setAttribute('role', 'dialog'); w.setAttribute('aria-modal', 'true'); w.setAttribute('aria-label', 'Novidades do Lembra');
  w.innerHTML = `<div class="nv__bars">${quadros.map(() => '<i><b></b></i>').join('')}</div><div class="nv__topo"><button class="nv__som" data-som></button><button class="nv__pula" data-pula>Pular</button></div>
    <div class="nv__palco" data-palco></div>
    <div class="nv__baixo snhwrap"><h2 data-t></h2><div class="snhb nv__fala"><span class="snhb__txt" aria-live="polite"></span></div><span class="nv__snh">${sininho('feliz', { size: 220 })}</span></div>
    <button class="nv__zona nv__zona--l" data-volta tabindex="-1" aria-label="Voltar"></button><button class="nv__zona nv__zona--r" data-vai tabindex="-1" aria-label="Próxima novidade"></button>
    <button class="nv__ok" data-ok><span></span></button>`;
  document.body.appendChild(w); document.body.classList.add('has-nv'); aberta = w; alive();
  const q = (s) => w.querySelector(s), snh = () => q('.nv__snh [data-snh]');
  const fecha = () => { if (!aberta) return; aberta = null; voz.fim(); document.removeEventListener('keydown', tecla, true); w.classList.add('is-out'); setTimeout(() => { w.remove(); document.body.classList.remove('has-nv'); }, 260); if (antes && antes.focus) antes.focus({ preventScroll: true }); if (aoFechar) aoFechar(); };
  const voz = locutor(); let espera = false;
  const rapidez = (s) => (vozLigada() && temVoz(s.c) ? Math.round((duracao(s.c) * 0.85) / s.s.length) : 20);
  const rotulo = () => {
    const on = vozLigada(), b = q('[data-som]'); b.hidden = !temVoz(quadros[i].c);
    b.innerHTML = icon(on ? 'volume' : 'mudo', 24); b.setAttribute('aria-label', on ? 'Desligar a voz' : 'Ligar a voz');
    q('[data-ok] span').textContent = espera ? 'Ouvir' : i < quadros.length - 1 ? 'Próxima' : 'Bora!';
  };
  /* sem toque antes, o celular segura o som: o primeiro toque vira "Ouvir" */
  const fala = async () => {
    const minha = vez, s = quadros[i]; espera = false;
    if (!vozLigada() || !temVoz(s.c)) { voz.para(); rotulo(); return; }
    const ok = await voz.fala(s.c, snh);
    if (minha !== vez || !aberta || !vozLigada()) return;
    espera = !ok; rotulo();
    if (quadros[i + 1]) carrega(quadros[i + 1].c);
  };
  const mostra = (dir = 1) => {
    const s = quadros[i], minha = ++vez; w.dataset.c = s.c; w.style.setProperty('--dir', dir);
    w.querySelectorAll('.nv__bars i').forEach((b, k) => b.classList.toggle('is-on', k <= i));
    const velho = q('[data-palco] .nvc:not(.is-sai)'); if (velho) { velho.classList.add('is-sai'); setTimeout(() => velho.remove(), 220); }
    setTimeout(() => { if (minha === vez) q('[data-palco]').insertAdjacentHTML('beforeend', (CENAS[s.c] || CENAS.abre)()); }, velho ? 160 : 0);
    const t = q('[data-t]'); t.textContent = s.t; t.classList.remove('is-in'); void t.offsetWidth; t.classList.add('is-in');
    voz.para(); espera = false; rotulo();
    const e = snh();
    if (e) {
      const r = s.v ? roupa(s.v) : { mood: s.m || 'feliz', l: ['baixo'], r: ['baixo'] };
      veste(e, s.v === 'torcida' ? { ...r, ros: cachecol(['#2E6FE0', '#FFF6EE']) } : r);
      setMood(e, s.m || 'feliz');
      if (!s.v) { veste(e, null); setTimeout(() => minha === vez && act(e, s.g || 'sim'), 380); }
    }
    say(e, s.s, { bubble: q('.snhb__txt'), speed: rapidez(s) });
    fala();
  };
  const anda = (n) => { if (espera && n > 0) { const s = quadros[i]; say(snh(), s.s, { bubble: q('.snhb__txt'), speed: rapidez(s) }); fala(); return; } if (i + n < 0) return; if (i + n >= quadros.length) { fecha(); return; } i += n; mostra(n); import('./sound.js').then((m) => m.msgVai && m.msgVai()).catch(() => {}); };
  const tecla = (e) => { if (e.key === 'Escape') { e.preventDefault(); fecha(); } else if (e.key === 'ArrowRight' || (e.key === 'Enter' && document.activeElement === w)) anda(1); else if (e.key === 'ArrowLeft') anda(-1); else if (e.key === 'Tab') { const f = [q('[data-som]'), q('[data-pula]'), q('[data-ok]')].filter((x) => !x.hidden), k = f.indexOf(document.activeElement); e.preventDefault(); f[k < 0 ? f.length - 1 : (k + (e.shiftKey ? f.length - 1 : 1)) % f.length].focus(); } };
  document.addEventListener('keydown', tecla, true);
  q('[data-som]').onclick = () => { ligaVoz(!vozLigada()); fala(); };
  q('[data-pula]').onclick = fecha; q('[data-ok]').onclick = () => anda(1); q('[data-vai]').onclick = () => anda(1); q('[data-volta]').onclick = () => anda(-1);
  requestAnimationFrame(() => w.classList.add('is-in')); mostra(); w.focus({ preventScroll: true });
  return { fecha };
}
