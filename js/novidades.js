/* Novidades animadas: na primeira vez depois de uma atualização grande, o Lembra aparece e mostra o que mudou,
   um toque por vez. Cada pessoa vê UMA vez por atualização (no aparelho e na conta).
   ATUALIZAÇÃO NOVA: basta pôr a versão em NOVIDADES com os quadros dela: { t título, s fala, m humor, g gesto, c cena, v roupa }. */
import { sininho, alive, setMood, act, say, veste } from './sininho.js';
import { roupa, cachecol } from './roupas.js';
import { icon } from './icons.js';
import { locutor, temVoz, vozLigada, ligaVoz, duracao, carrega, corte } from './voz-novidades.js';
import { anel, bolinha } from './anel.js';

export const NOVIDADES = {
  '2.32.0': [
    { t: 'Eu mudei!', s: 'Respeitável público!|Chegou novidade, e das boas!', m: 'feliz', g: 'tchau', c: 'abre' },
    { t: 'Deslize o dedo', s: 'Deslizou?|Trocou de aba! Rápido assim!', m: 'feliz', g: 'olhaLados', c: 'desliza' },
    { t: 'Abro sem internet', s: 'Caiu a internet?|Eu não caio! Abro do mesmo jeito!', m: 'feliz', g: 'sim', c: 'offline' },
    { t: 'Seu Pessoal limpo', s: 'Seu Pessoal?|Limpinho! Cada coisa uma vez só!', m: 'feliz', g: 'pisca', c: 'limpo' },
    { t: 'Assistente mais claro', s: 'Pediu?|Eu mostro antes! Só muda se você confirmar!', m: 'feliz', g: 'sobrancelha', c: 'assist' },
    { t: 'Nada some sem querer', s: 'Apagou sem querer?|Calma! Tem um dia inteiro pra voltar atrás!', m: 'surpreso', g: 'sim', c: 'lixeira' },
    { t: 'Eu fico na conversa', s: 'E na conversa?|Eu escrevo, gravo e leio junto!', m: 'feliz', c: 'conversa', v: 'digita' },
    { t: 'Arraste a conversa', s: 'Arrastou?|Fixa, arquiva, tranca! E foto pra ver uma vez só!', m: 'feliz', g: 'sim', c: 'arrasta' },
    { t: 'Stories com número', s: 'Stories novos?|O anel conta quantos faltam!', m: 'surpreso', g: 'olhaLados', c: 'stories' },
    { t: 'Achou, é só tocar', s: 'Procurando alguém?|Telefone, e-mail ou ID. Achou!', m: 'feliz', g: 'olhaLados', c: 'achar' },
    { t: 'Seu perfil do seu jeito', s: 'Seu perfil?|Suas regras! Você escolhe o que aparece!', m: 'feliz', g: 'sobrancelha', c: 'perfil' },
    { t: 'Meu time, seu time', s: 'E agora me conta:|qual é o seu time? Eu lembro. Você vive!', m: 'feliz', c: 'time', v: 'torcida' },
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
  w.innerHTML = `<div class="nv__fundo" data-fundo></div><i class="nv__bola" data-bola hidden></i><div class="nv__bars">${quadros.map(() => '<i><b></b></i>').join('')}</div><div class="nv__topo"><button class="nv__som" data-som></button><button class="nv__pula" data-pula>Pular</button></div>
    <div class="nv__palco" data-palco></div>
    <div class="nv__baixo snhwrap"><h2 data-t></h2><div class="snhb nv__fala"><span class="snhb__txt" aria-live="polite"></span></div><span class="nv__snh">${sininho('feliz', { size: 220 })}</span></div>
    <button class="nv__zona nv__zona--l" data-volta tabindex="-1" aria-label="Voltar"></button><button class="nv__zona nv__zona--r" data-vai tabindex="-1" aria-label="Próxima novidade"></button>
    <button class="nv__ok" data-ok><span></span></button>`;
  document.body.appendChild(w); document.body.classList.add('has-nv'); aberta = w; alive();
  const q = (s) => w.querySelector(s), snh = () => q('.nv__snh [data-snh]');
  const fecha = () => { if (!aberta) return; aberta = null; voz.fim(); document.removeEventListener('keydown', tecla, true); w.classList.add('is-out'); setTimeout(() => { w.remove(); document.body.classList.remove('has-nv'); }, 260); if (antes && antes.focus) antes.focus({ preventScroll: true }); if (aoFechar) aoFechar(); };
  const voz = locutor(); let espera = false;
  const calmo = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rapidez = (s) => (vozLigada() && temVoz(s.c) ? Math.round((duracao(s.c) * 0.85) / s.s.length) : 20);
  const rotulo = () => {
    const on = vozLigada(), b = q('[data-som]'); b.hidden = !temVoz(quadros[i].c);
    b.innerHTML = icon(on ? 'volume' : 'mudo', 24); b.setAttribute('aria-label', on ? 'Desligar a voz' : 'Ligar a voz');
    q('[data-ok] span').textContent = espera ? 'Ouvir' : i < quadros.length - 1 ? 'Próxima' : 'Bora!';
  };
  const show = (s) => s.s.includes('|');
  const FITA = ['M-20 60 C 140 20 40 190 200 200 S 300 360 430 320', 'M430 40 C 260 60 340 220 190 210 S 90 330 -30 380', 'M-20 330 C 120 380 120 120 220 150 S 300 60 430 90'];
  const enquadra = (k) => { w.classList.toggle('is-rosto', k === 'rosto'); w.classList.toggle('is-cena', k === 'cena'); };
  /* a demonstração entra em cena (mais rápida quando há voz) */
  const poeCena = (s) => {
    const p = q('[data-palco]'); if (p.querySelector(':scope > .nvc:not(.is-sai)')) return;
    const c = (CENAS[s.c] || CENAS.abre)();
    p.insertAdjacentHTML('beforeend', show(s) ? `<div class="nvc nvx"><svg class="nvx__fita" viewBox="0 0 400 400" aria-hidden="true"><path pathLength="1" d="${FITA[i % 3]}"/></svg><span class="nvx__aneis"><i></i><i></i><i></i></span><div class="nvx__cel"><div class="nvx__tela"><span class="nvx__barra"><b>${s.t}</b></span>${c}</div></div><span class="nvx__voa nvx__voa--a">${icon('bell', 30)}</span><span class="nvx__voa nvx__voa--b">${icon('check', 26)}</span></div>` : c);
    if (vozLigada() && show(s) && !calmo()) p.querySelectorAll('.nvc:not(.is-sai), .nvc:not(.is-sai) *').forEach((x) => x.getAnimations && x.getAnimations().forEach((m) => { m.playbackRate = 1.7; }));
  };
  const tiraCena = () => { const velho = q('[data-palco] > .nvc:not(.is-sai)'); if (velho) { velho.classList.add('is-sai'); setTimeout(() => velho.remove(), 220); } };
  /* legenda viva: cada palavra entra na hora em que é dita */
  const legenda = (s, tudo) => {
    const t = q('.snhb__txt'), c = corte(s.c, s.s), d = duracao(s.c) / 1000; clearInterval(t._t); let k = 0;
    t.innerHTML = s.s.split('|').map((p, j) => { const ini = j ? c : 0, fim = j ? d : c, ps = p.trim().split(' '), tam = p.trim().length; let pos = 0; return `<span class="nv__p nv__p--${j}">${ps.map((x) => { const em = ini + (fim - ini - 0.1) * (pos / tam); pos += x.length + 1; return `<i data-em="${em.toFixed(2)}" style="--k:${(k++) % 2 ? 1 : -1}"${tudo ? ' class="is-dita"' : ''}>${x}</i>`; }).join(' ')}</span>`; }).join(' ');
    return { c, ps: [...t.querySelectorAll('i')] };
  };
  const inteiro = (s) => { pintaFundo(1); w.classList.add('is-inteiro'); legenda(s, true); enquadra('cena'); poeCena(s); };
  /* sem toque antes, o celular segura o som: o primeiro toque vira "Ouvir" */
  const fala = async () => {
    const minha = vez, s = quadros[i]; espera = false;
    if (!vozLigada() || !temVoz(s.c)) { voz.para(); voz.musica(false); rotulo(); if (show(s)) inteiro(s); return; }
    let op = {};
    if (show(s) && !calmo()) {
      w.classList.remove('is-inteiro'); pintaFundo(0); const { c, ps } = legenda(s); let cena = false; enquadra('rosto');
      op = {
        passo: (seg) => {
          ps.forEach((x) => { if (seg >= Number(x.dataset.em) - 0.04 && !x.classList.contains('is-dita')) { x.classList.add('is-dita'); if (!cena && x.closest('.nv__p--0')) bola(x); } });
          if (!cena && seg >= c) { cena = true; const b = q('[data-bola]'); pintaFundo(1, (Number(b.dataset.x) / w.clientWidth) * 100, (Number(b.dataset.y) / w.clientHeight) * 100); b.hidden = true; enquadra('cena'); poeCena(s); voz.corta(false); if (!s.v) act(snh(), ['sim', 'sobrancelha', 'riso'][i % 3]); }
        },
        fim: () => setTimeout(() => { if (minha === vez && aberta && i < quadros.length - 1) anda(1); else if (minha === vez) voz.musica(false); }, s.c === 'abre' ? 150 : 420),
      };
    } else if (show(s)) inteiro(s);
    const ok = await voz.fala(s.c, snh, op);
    if (minha !== vez || !aberta || !vozLigada()) return;
    espera = ok === false; rotulo(); if (ok && !calmo()) voz.musica(true); else if (!ok && show(s)) inteiro(s);
    if (quadros[i + 1]) carrega(quadros[i + 1].c);
  };
  /* dois fundos por novidade (rosto e cena): branco, laranja e amarelo, sem repetir vizinhos */
  const FUNDO = [['w', 'o'], ['w', 'y'], ['o', 'w'], ['y', 'o']];
  /* a bolinha cresce em anéis e vira o próximo fundo */
  const pintaFundo = (plano, x = 50, y = 50) => {
    const cor = FUNDO[i % 4][plano]; if (w.dataset.cor === cor && w.dataset.cor) return;
    w.dataset.cor = cor; const cx = q('[data-fundo]'); cx.style.setProperty('--x', `${x}%`); cx.style.setProperty('--y', `${y}%`);
    const novos = [2, 1, 0].map((k) => { const f = document.createElement('i'); f.className = `is-${cor} is-k${k}`; cx.append(f); return f; });
    setTimeout(() => { while (cx.firstChild && cx.firstChild !== novos[2] && cx.contains(novos[2])) cx.firstChild.remove(); }, 720);
  };
  const bola = (palavra) => {
    const b = q('[data-bola]'), r = palavra.getBoundingClientRect(), o = w.getBoundingClientRect();
    const x = Math.min(r.right - o.left + 16, o.width - 14), y = r.top - o.top + r.height * 0.62, x0 = Number(b.dataset.x || -30), y0 = Number(b.dataset.y || y - 60); b.dataset.x = x; b.dataset.y = y; b.hidden = false;
    b.animate([{ transform: `translate(${x0}px, ${y0}px)` }, { transform: `translate(${(x0 + x) / 2}px, ${Math.min(y0, y) - 70}px) scale(.82, 1.25)`, offset: 0.5 }, { transform: `translate(${x}px, ${y}px) scale(1.3, .7)`, offset: 0.9 }, { transform: `translate(${x}px, ${y}px)` }], { duration: 230, easing: 'cubic-bezier(.77, 0, .175, 1)', fill: 'forwards' });
  };
  const mostra = (dir = 1) => {
    const s = quadros[i], minha = ++vez; w.dataset.c = s.c; w.dataset.lado = i % 3; w.style.setProperty('--dir', dir); w.classList.toggle('is-show', show(s));
    w.querySelectorAll('.nv__bars i').forEach((b, k) => b.classList.toggle('is-on', k <= i));
    tiraCena(); pintaFundo(0, [50, 8, 92][i % 3], 78); const bl = q('[data-bola]'); bl.hidden = true; delete bl.dataset.x; delete bl.dataset.y;
    if (!show(s)) setTimeout(() => { if (minha === vez) poeCena(s); }, 160);
    const t = q('[data-t]'); t.textContent = s.t; t.classList.remove('is-in'); void t.offsetWidth; t.classList.add('is-in');
    voz.para(); voz.corta(true); espera = false; rotulo();
    const e = snh();
    if (e) {
      const r = s.v ? roupa(s.v) : { mood: s.m || 'feliz', l: ['baixo'], r: ['baixo'] };
      veste(e, s.v === 'torcida' ? { ...r, ros: cachecol(['#2E6FE0', '#FFF6EE']) } : r);
      setMood(e, s.m || 'feliz');
      if (!s.v) { veste(e, null); setTimeout(() => minha === vez && act(e, s.g || 'sim'), 160); }
    }
    if (!show(s)) say(e, s.s, { bubble: q('.snhb__txt'), speed: rapidez(s) });
    fala();
  };
  const anda = (n) => { if (espera && n > 0) { const s = quadros[i]; if (show(s)) { tiraCena(); } else say(snh(), s.s, { bubble: q('.snhb__txt'), speed: rapidez(s) }); vez += 1; fala(); return; } if (i + n < 0) return; if (i + n >= quadros.length) { fecha(); return; } i += n; mostra(n); import('./sound.js').then((m) => m.msgVai && m.msgVai()).catch(() => {}); };
  const tecla = (e) => { if (e.key === 'Escape') { e.preventDefault(); fecha(); } else if (e.key === 'ArrowRight' || (e.key === 'Enter' && document.activeElement === w)) anda(1); else if (e.key === 'ArrowLeft') anda(-1); else if (e.key === 'Tab') { const f = [q('[data-som]'), q('[data-pula]'), q('[data-ok]')].filter((x) => !x.hidden), k = f.indexOf(document.activeElement); e.preventDefault(); f[k < 0 ? f.length - 1 : (k + (e.shiftKey ? f.length - 1 : 1)) % f.length].focus(); } };
  document.addEventListener('keydown', tecla, true);
  q('[data-som]').onclick = () => { ligaVoz(!vozLigada()); fala(); };
  q('[data-pula]').onclick = fecha; q('[data-ok]').onclick = () => anda(1); q('[data-vai]').onclick = () => anda(1); q('[data-volta]').onclick = () => anda(-1);
  requestAnimationFrame(() => w.classList.add('is-in')); mostra(); w.focus({ preventScroll: true });
  return { fecha };
}
