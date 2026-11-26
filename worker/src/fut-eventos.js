/* O que aconteceu na partida: compara o retrato anterior com o novo e devolve só o que é NOVO.
   Puro (sem rede, sem banco): dá para testar inteiro. Formato de entrada = resposta de /v1/partidas/{id}
   da API-Futebol (gols por lado, cartões, substituições, período).
   Nada aqui inventa jogador, assistência ou lance: se o dado não veio, o evento sai sem ele. */

const n0 = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);
const minuto = (m) => (typeof m === 'string' && /^\d+/.test(m) ? `${parseInt(m, 10)}'` : '');
const PERIODO = { 'primeiro-tempo': '1º tempo', 'segundo-tempo': '2º tempo', intervalo: 'intervalo', 'fim-de-jogo': 'fim de jogo', 'disputa-penalti': 'pênaltis', 'nao-iniciada': 'antes de começar' };

/** retrato enxuto da partida, do jeito que o Lembra guarda entre uma consulta e outra */
export function retrato(p, meuTimeId) {
  if (!p || !p.partida_id) return null;
  const casa = p.time_mandante || {}, fora = p.time_visitante || {};
  const lado = Number(casa.time_id) === Number(meuTimeId) ? 'mandante' : Number(fora.time_id) === Number(meuTimeId) ? 'visitante' : '';
  const lista = (quem) => (Array.isArray(p.gols?.[quem]) ? p.gols[quem] : []).map((g) => ({
    k: `${quem}:${g.minuto || ''}:${g.atleta?.atleta_id || g.atleta?.nome_popular || ''}:${g.gol_contra ? 'c' : ''}${g.penalti ? 'p' : ''}`,
    autor: g.atleta?.nome_popular || '', minuto: g.minuto || '', periodo: g.periodo_slug || '', penalti: !!g.penalti, contra: !!g.gol_contra,
  }));
  const vermelhos = (quem) => (Array.isArray(p.cartoes?.vermelho?.[quem]) ? p.cartoes.vermelho[quem] : []).map((c) => ({
    k: `v:${quem}:${c.cartao_id || ''}${c.minuto || ''}`, autor: c.atleta?.nome_popular || '', minuto: c.minuto || '', periodo: c.periodo_slug || '',
  }));
  return {
    id: p.partida_id, lado, periodo: p.periodo || p.status || '', status: p.status || '',
    casa: casa.nome_popular || '', fora: fora.nome_popular || '', casaId: Number(casa.time_id) || 0, foraId: Number(fora.time_id) || 0,
    pc: n0(p.placar_mandante), pf: n0(p.placar_visitante),
    camp: p.campeonato?.nome_popular || p.campeonato?.nome || '', campId: Number(p.campeonato?.campeonato_id) || 0,
    estadio: p.estadio?.nome_popular || '', rodada: p.campeonato?.rodada_atual?.nome || '',
    gols: { mandante: lista('mandante'), visitante: lista('visitante') },
    vermelhos: { mandante: vermelhos('mandante'), visitante: vermelhos('visitante') },
    penaltis: p.disputa_penalti && typeof p.disputa_penalti === 'object' ? { c: n0(p.disputa_penalti.placar_penalti_mandante), f: n0(p.disputa_penalti.placar_penalti_visitante) } : null,
  };
}

const placarMeu = (r) => (r.lado === 'mandante' ? r.pc : r.pf);
const placarDele = (r) => (r.lado === 'mandante' ? r.pf : r.pc);
/* como estava o jogo ANTES deste gol (para saber se foi empate, virada ou ampliou) */
function contexto(meu, dele) {
  if (meu === dele) return 'empate';
  if (meu === dele + 1) return meu === 1 ? 'abriu' : 'virada';
  return meu > dele ? 'amplia' : 'desconto';
}

/** compara dois retratos e devolve os acontecimentos novos, na ordem */
export function novidades(antes, agora) {
  if (!agora || !agora.lado) return [];
  const out = [], a = antes || { gols: { mandante: [], visitante: [] }, vermelhos: { mandante: [], visitante: [] }, periodo: '', pc: 0, pf: 0 };
  const vistos = new Set([...(a.gols?.mandante || []), ...(a.gols?.visitante || [])].map((g) => g.k));
  const vistosV = new Set([...(a.vermelhos?.mandante || []), ...(a.vermelhos?.visitante || [])].map((g) => g.k));
  const meuLado = agora.lado, outroLado = meuLado === 'mandante' ? 'visitante' : 'mandante';
  const novos = [
    ...(agora.gols[meuLado] || []).filter((g) => !vistos.has(g.k)).map((g) => ({ ...g, meu: true })),
    ...(agora.gols[outroLado] || []).filter((g) => !vistos.has(g.k)).map((g) => ({ ...g, meu: false })),
  ].sort((x, y) => String(x.minuto).localeCompare(String(y.minuto)));
  // placar antes dos gols novos: o de agora menos os que acabaram de entrar
  let meu = placarMeu(agora) - novos.filter((g) => g.meu).length, dele = placarDele(agora) - novos.filter((g) => !g.meu).length;
  for (const g of novos) {
    if (g.meu) meu += 1; else dele += 1;
    out.push({ tipo: g.meu ? 'gol' : 'gol-sofrido', autor: g.autor, minuto: g.minuto, periodo: g.periodo, penalti: g.penalti, contra: g.contra, meu, dele, ctx: g.meu ? contexto(meu, dele) : contexto(dele, meu), k: `g:${g.k}` });
  }
  for (const lado of ['mandante', 'visitante']) {
    for (const v of agora.vermelhos[lado] || []) if (!vistosV.has(v.k)) out.push({ tipo: 'vermelho', meuTime: lado === meuLado, autor: v.autor, minuto: v.minuto, meu: placarMeu(agora), dele: placarDele(agora), k: v.k });
  }
  if (a.periodo !== agora.periodo) {
    if (agora.periodo === 'intervalo') out.push({ tipo: 'intervalo', meu: placarMeu(agora), dele: placarDele(agora), k: `i:${agora.id}` });
    if (agora.periodo === 'fim-de-jogo') out.push({ tipo: 'fim', meu: placarMeu(agora), dele: placarDele(agora), k: `f:${agora.id}`, penaltis: agora.penaltis });
    if (agora.periodo === 'primeiro-tempo' && (!a.periodo || a.periodo === 'nao-iniciada')) out.push({ tipo: 'comecou', meu: 0, dele: 0, k: `c:${agora.id}` });
  }
  return out;
}

/* ---------- as falas (variadas, nunca a mesma duas vezes seguidas) ---------- */
const F = {
  comecou: ['A bola rolou! Vamos juntos nessa 🔥', 'Começou! Tô aqui com você ⚽', 'Rolou a bola! Que venha jogo bom 🙏'],
  gol: {
    abriu: ['CARAAAACA! GOOOOOL DO NOSSO TIME! 🔥', 'GOOOOOL! Abrimos o placar! 😤', 'É NOSSO! 1 a 0! Que delícia!'],
    empate: ['GOOOOOL! EMPATAMOS! Agora a partida pegou fogo! 🔥', 'EMPATE! Eu sabia que a gente vinha! 😤', 'GOL! Tudo igual de novo! Bora virar!'],
    virada: ['VIRAMOS! EU NÃO ACREDITO! QUE PARTIDA ABSURDA! 🔥', 'VIRADA! Levanta daí que viramos! 😭🔥', 'VIROU! Meu coração não aguenta!'],
    amplia: ['MAIS UM! Tá tranquilo, tá favorável 😎', 'GOOOOOL! Ampliamos! Que jogo!', 'E tem mais! Que massacre 🔥'],
    desconto: ['Fizemos um! Ainda dá! 🙏', 'GOL nosso! Diminuiu! Bora buscar!'],
  },
  'gol-sofrido': {
    empate: ['Poxa, empataram… 😞 Mas tem jogo ainda!', 'Tomamos o empate. Calma, dá pra buscar!'],
    virada: ['Ih… viraram em cima da gente 😭 Mas ainda tem tempo!', 'Viraram. Respira. Ainda dá tempo de reagir 🙏'],
    amplia: ['Ahh não… mais um 😔 Vai ser difícil, mas vamos até o fim.', 'Tomamos outro. Dia complicado, né?'],
    abriu: ['Poxa, tomamos um gol… 😭 Mas calma, ainda dá pra buscar!', 'Saiu o deles. Bora acordar!'],
    desconto: ['Descontaram. Agora é segurar! 😬', 'Fizeram um. Segura o coração!'],
  },
  intervalo: ['Intervalo. Tá {placar} por enquanto.', 'Fim do primeiro tempo: {placar}. Respira!'],
  fim: {
    vitoria: ['CARACA, GANHAMOS! QUE FELICIDADE! ❤️', 'VITÓRIA! {placar}! Tô muito feliz 🔥', 'GANHAMOS! Dia bom demais 😍'],
    empate: ['Terminou empatado: {placar}. Fica pro próximo!', 'Empate. Nem tudo é derrota 🙂'],
    derrota: ['Ahhh, não foi dessa vez… 😔 Mas futebol é assim. Seguimos juntos!', 'Perdemos por {placar}. Levanta a cabeça, tem campeonato pela frente 🧡'],
  },
  vermelho: { meu: ['Vermelho pro nosso lado 😤 Agora é segurar com raça!', 'Expulsaram o nosso… que complicado 😬'], dele: ['Vermelho pra eles! Agora é pressionar! 😏', 'Ficaram com um a menos! 👀'] },
};
const h32 = (s) => { let h = 2166136261; for (const c of String(s)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
const um = (L, semente) => L[h32(semente) % L.length];

/** vira fala do mascote. `quem` entra na semente para duas pessoas não receberem a mesma frase. */
export function fala(ev, { time = 'nosso time', rival = '', quem = '', tabela = null } = {}) {
  const placar = `${ev.meu} a ${ev.dele}`;
  let base = '';
  if (ev.tipo === 'comecou') base = um(F.comecou, quem + ev.k);
  else if (ev.tipo === 'gol' || ev.tipo === 'gol-sofrido') base = um(F[ev.tipo][ev.ctx] || F[ev.tipo].abriu, quem + ev.k);
  else if (ev.tipo === 'intervalo') base = um(F.intervalo, quem + ev.k);
  else if (ev.tipo === 'vermelho') base = um(ev.meuTime ? F.vermelho.meu : F.vermelho.dele, quem + ev.k);
  else if (ev.tipo === 'fim') base = um(F.fim[ev.meu > ev.dele ? 'vitoria' : ev.meu === ev.dele ? 'empate' : 'derrota'], quem + ev.k);
  if (!base) return null;
  let txt = base.replace('{placar}', placar);
  // o autor do gol só entra quando a API informou
  if (ev.tipo === 'gol' && ev.autor) txt += ` ${ev.contra ? `(contra, do ${ev.autor})` : `Gol do ${ev.autor}${ev.penalti ? ', de pênalti' : ''}!`}`;
  if (ev.tipo === 'gol-sofrido' && ev.autor) txt += ` (${ev.autor}${ev.penalti ? ', de pênalti' : ''})`;
  if ((ev.tipo === 'gol' || ev.tipo === 'gol-sofrido') && ev.minuto) txt += ` ${minuto(ev.minuto)}`;
  if (ev.tipo === 'fim' && tabela && tabela.pontos != null) {
    txt += ` Agora são ${tabela.pontos} pontos`;
    if (tabela.posicao) txt += ` e ${tabela.posicao}º lugar`;
    if (tabela.doLider > 0) txt += `, a ${tabela.doLider} ${tabela.doLider === 1 ? 'ponto' : 'pontos'} do líder`;
    txt += '.';
  }
  const titulo = { comecou: `⚽ Começou: ${time}`, gol: `⚽ GOL DO ${time.toUpperCase()}!`, 'gol-sofrido': `⚽ ${time} ${ev.meu} x ${ev.dele}`, intervalo: `⚽ Intervalo: ${time}`, vermelho: `🟥 ${time}`, fim: `⚽ ${ev.meu > ev.dele ? 'Vitória do' : ev.meu === ev.dele ? 'Empate do' : 'Fim de jogo:'} ${time}` }[ev.tipo];
  return { title: titulo, body: rival ? `${txt}`.trim() : txt.trim(), tag: `fut-${ev.k}`, url: './#/hoje', periodo: PERIODO[ev.periodo] || '' };
}

/** situação do time na tabela (array de /v1/campeonatos/{id}/tabela) */
export function situacao(tab, timeId) {
  if (!Array.isArray(tab) || !tab.length) return null;
  const linha = tab.find((l) => Number(l.time?.time_id) === Number(timeId));
  if (!linha) return null;
  const lider = tab.reduce((m, l) => (n0(l.pontos) > n0(m.pontos) ? l : m), tab[0]);
  const pos = n0(linha.posicao) || tab.indexOf(linha) + 1;
  const zonas = { g4: 4, g6: 6, z4: tab.length - 3 };
  return {
    posicao: pos, pontos: n0(linha.pontos), jogos: n0(linha.jogos), vitorias: n0(linha.vitorias), empates: n0(linha.empates), derrotas: n0(linha.derrotas),
    golsPro: n0(linha.gols_pro), golsContra: n0(linha.gols_contra), saldo: n0(linha.saldo_gols),
    doLider: Math.max(0, n0(lider.pontos) - n0(linha.pontos)),
    doG4: pos > zonas.g4 && tab[zonas.g4 - 1] ? Math.max(0, n0(tab[zonas.g4 - 1].pontos) - n0(linha.pontos)) : 0,
    daZona: pos < zonas.z4 && tab[zonas.z4 - 1] ? Math.max(0, n0(linha.pontos) - n0(tab[zonas.z4 - 1].pontos)) : 0,
    naZona: pos >= zonas.z4, noG4: pos <= zonas.g4, lider: pos === 1,
    total: tab.length,
  };
}
