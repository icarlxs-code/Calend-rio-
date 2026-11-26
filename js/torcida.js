/* O mascote torcedor: quando o time da pessoa faz gol, vira o jogo ou termina a partida,
   ele aparece na tela inicial com a bandeira nas cores do clube e fala do que ACABOU de acontecer.
   Só isso: nada de ficar falando de futebol todo dia. A reação vem do servidor (o jogo é acompanhado lá)
   e vale por algumas horas; depois ele volta ao normal. */
import { store } from './store.js';
import { api, server } from './avisos.js';
import { porTime } from '../functions/times.js';

const K = 'lembra.torcida';        // o que já foi mostrado neste aparelho
const lidas = () => { try { return JSON.parse(localStorage.getItem(K) || '{}'); } catch { return {}; } };
const marca = (id) => { try { const m = lidas(); m[id] = Date.now(); for (const k of Object.keys(m)) if (m[k] < Date.now() - 7 * 864e5) delete m[k]; localStorage.setItem(K, JSON.stringify(m)); } catch { /* ok */ } };

/** chave do acontecimento: a mesma cena não aparece duas vezes */
const chaveDe = (c) => `${c.partida}:${c.tipo}:${c.meu}-${c.dele}:${c.autor || ''}`;

/* a fala na tela (curta: o push já contou a novidade) */
function frase(c, nome) {
  const placar = `${c.meu} a ${c.dele}`;
  if (c.tipo === 'gol') return c.ctx === 'virada' ? `VIRAMOS! ${placar}! Que jogo! 🔥` : c.ctx === 'empate' ? `EMPATAMOS! ${placar}! Agora pegou fogo 🔥` : `GOOOOL DO ${nome.toUpperCase()}! ${placar}${c.autor ? `, gol do ${c.autor}` : ''}! 🔥`;
  if (c.tipo === 'gol-sofrido') return `Tomamos um… ${placar}. Mas ainda dá para buscar! 🙏`;
  if (c.tipo === 'intervalo') return `Intervalo: ${placar}. Respira comigo 😮‍💨`;
  if (c.tipo === 'comecou') return `A bola rolou! Vamos juntos 🧡`;
  if (c.tipo === 'vermelho') return 'Olha o vermelho! A partida mudou 👀';
  if (c.tipo === 'fim') {
    const t = c.tabela, extra = t && t.pontos != null ? ` Estamos com ${t.pontos} pontos${t.posicao ? `, em ${t.posicao}º` : ''}${t.doLider > 0 ? `, a ${t.doLider} do líder` : ''}.` : '';
    if (c.meu > c.dele) return `CARACA, GANHAMOS! ${placar}!${extra} QUE FELICIDADE! ❤️`;
    if (c.meu === c.dele) return `Terminou ${placar}. Fica pro próximo!${extra}`;
    return `Hoje não foi nosso dia… ${placar} 😔${extra} Seguimos juntos!`;
  }
  return '';
}
const HUMOR = { gol: 'comemora', fim: null, 'gol-sofrido': 'triste', intervalo: 'feliz', comecou: 'feliz', vermelho: 'surpreso' };

/** busca no servidor o que aconteceu com o time da pessoa (só quando faz sentido perguntar) */
export async function cena() {
  const time = store.profile?.teamId;
  if (!time || store.mode !== 'cloud' || !server() || !porTime(time)) return null;
  try {
    const r = await api('/futebol', { ws: '', ver: true, time });
    const c = r && r.cena;
    if (!c || !c.tipo) return null;
    return lidas()[chaveDe(c)] ? null : c;
  } catch { return null; }
}

/** mostra a reação (usa o mascote que já existe, com a bandeira do clube) */
export async function mostra(c) {
  const clube = porTime(store.profile?.teamId); if (!clube || !c) return false;
  if (lidas()[chaveDe(c)]) return false;          // esse acontecimento já foi mostrado neste aparelho
  const txt = frase(c, clube.nome); if (!txt) return false;
  const M = await import('./mascote.js');
  if (!M.active || !M.active()) return false;
  const S = await import('./sininho.js'), R = await import('./roupas.js');
  const ganhou = c.tipo === 'gol' || (c.tipo === 'fim' && c.meu > c.dele);
  const humor = HUMOR[c.tipo] || (c.meu > c.dele ? 'comemora' : c.meu === c.dele ? 'feliz' : 'triste');
  marca(chaveDe(c));
  M.react('torcida', {
    texto: txt,
    humor,
    // bandeira só quando há o que comemorar; derrota é com o cachecol, sem festa
    veste: ganhou ? R.roupa('torcida', clube.cores) : { mood: humor, l: ['baixo'], r: ['baixo'], ros: R.cachecol(clube.cores) },
    gesto: ganhou ? 'pulo' : 'tchau',
    S,
  });
  return true;
}

/** chamado pelo app de vez em quando: se houver novidade do jogo, o mascote reage */
export async function confere() {
  const c = await cena();
  return c ? mostra(c) : false;
}
