/* O Lembra como guia (cadastro, entrar, ficha) — no estilo do Duolingo: o personagem pequeno à esquerda,
   o balão com a fala ao lado. É SEMPRE o mesmo elemento: entre as etapas ele não some e reaparece,
   ele pula, anda e muda de expressão. Os erros de preenchimento são falados por ele, com jeito de quem ajuda.
   Por enquanto só aparece para o dono (ou no celular onde o dono já entrou), igual ao companheiro. */
import { sininho, setMood, act, say, alive } from './sininho.js';
import { store } from './store.js';
import { CONFIG } from '../config.js';
import { ui as uiSom } from './sfx.js';

const isOwner = () => !!store.user && !!CONFIG.adminEmail && (store.user.email || '').toLowerCase() === CONFIG.adminEmail.toLowerCase();
export function guiaOn() {
  if (CONFIG.mascotPublic) return true;
  if (isOwner()) { try { localStorage.setItem('lembra.mascote', '1'); } catch { /* ok */ } return true; }
  try { return localStorage.getItem('lembra.mascote') === '1'; } catch { return false; }
}

/* frases das mensagens de erro, ditas pelo Lembra (o texto técnico continua no campo, para leitores de tela) */
export function falaDoErro(msg) {
  const m = (msg || '').toLowerCase();
  if (m.includes('nome completo') || m.includes('nome e sobrenome')) return { t: 'Quase lá! Me diz seu nome completo, nome e sobrenome, pra eu te chamar direitinho 😊', m: 'acena' };
  if (m.includes('só letras')) return { t: 'Ops, esse nome tem número ou símbolo. Pode tirar pra mim? 🙂', m: 'desconfiado' };
  if (m.includes('apelido')) return { t: 'Esse apelido precisa ter pelo menos uma letra 😅', m: 'desconfiado' };
  if (m.includes('nascimento')) return { t: 'Qual é a sua data de nascimento? Quero te dar parabéns no dia certo 🎂', m: 'feliz' };
  if (m.includes('maiores de 13')) return { t: 'Ah… o Lembra é para quem tem 13 anos ou mais. Te espero quando crescer 🌱', m: 'triste' };
  if (m.includes('cpf')) return { t: 'Esse CPF não bateu aqui. Confere os números comigo? 🧐', m: 'desconfiado' };
  if (m.includes('identifica')) return { t: 'Como você se identifica? Pode escolher “Prefiro não dizer” também 💛', m: 'feliz' };
  if (m.includes('fala com você')) return { t: 'Como você quer que eu fale com você? Escolhe um jeito 😊', m: 'acena' };
  if (m.includes('celular')) return { t: 'Esse celular ficou estranho. DDD + número, tá? Ou deixa em branco 📱', m: 'triste' };
  if (m.includes('profiss')) return { t: 'Me conta com o que você trabalha? Pode escrever e tocar em “Usar” 💼', m: 'acena' };
  if (m.includes('e-mail')) return { t: 'Hmm, esse e-mail não parece certo. Confere pra mim? 📧', m: 'desconfiado' };
  if (m.includes('senha') && (m.includes('incorret') || m.includes('errad'))) return { t: 'Essa senha não bateu… tenta de novo? Se esqueceu, eu te ajudo a criar outra 🔑', m: 'triste' };
  if (m.includes('senha')) return { t: 'A senha precisa de 8 caracteres, com letras e números. Pra ficar seguro 🔒', m: 'desconfiado' };
  if (m.includes('termos') || m.includes('concord')) return { t: 'Só falta você aceitar os termos ali embaixo ✍️', m: 'acena' };
  if (m.includes('internet') || m.includes('conex')) return { t: 'Acho que a internet caiu… tenta de novo daqui a pouco? 📶', m: 'triste' };
  return { t: msg, m: 'triste' };
}

/* cria o guia: devolve o elemento e os comandos */
export function criaGuia({ tamanho = 74 } = {}) {
  const el = document.createElement('div');
  el.className = 'guia is-entrando';
  el.innerHTML = `<div class="guia__fig">${sininho('acena', { size: tamanho, label: 'Lembra' })}</div><div class="guia__bub"><span class="guia__ghost" aria-hidden="true"></span><span class="guia__txt"></span></div>`;
  alive();
  const fig = () => el.querySelector('[data-snh]');
  const txt = el.querySelector('.guia__txt');
  let ultimo = '';
  const api = {
    el,
    /* fala: texto digitado, expressão e um gesto */
    fala(t, m = 'feliz', gesto = 'sim') {
      if (!t || t === ultimo) return;
      ultimo = t;
      setMood(fig(), m);
      if (gesto) setTimeout(() => act(fig(), gesto), 120);
      const b = el.querySelector('.guia__bub');
      b.classList.remove('is-in'); void b.offsetWidth; b.classList.add('is-in');
      el.querySelector('.guia__ghost').textContent = t; // reserva a altura da frase inteira: nada abaixo pula enquanto ele "digita"
      say(fig(), t, { bubble: txt, speed: 22 });
    },
    /* erro: balança a cabeça e explica, sem bronca */
    erro(msg) { const l = falaDoErro(msg); ultimo = ''; uiSom('erro'); api.fala(l.t, l.m, 'nao'); },
    /* avançou de etapa: pula de alegria (e o som de avanço) */
    avanca(t, m = 'comemora') { uiSom('avanco'); el.classList.remove('is-pulando'); void el.offsetWidth; el.classList.add('is-pulando'); setTimeout(() => api.fala(t, m, 'pulo'), 140); },
    /* chega andando da lateral (primeira vez) */
    chega() { requestAnimationFrame(() => requestAnimationFrame(() => el.classList.remove('is-entrando'))); },
  };
  return api;
}
