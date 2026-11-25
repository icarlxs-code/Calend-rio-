/* "Mente" do amigo do Lembra: escolhe as mensagens de acordo com QUEM a pessoa é.
   Vem da ficha de cadastro (como apps de afirmações tipo "I am" e "Mantra" fazem no começo):
     - motivação (baixa / média / alta), autoestima (baixa / oscila / boa), ansiedade (muita / às vezes / pouca)
     - jeito de ser (impulsivo, perfeccionista, procrastinador, organizado, sensível, competitivo, sonhador, prático)
     - o que quer trabalhar (autoestima, ansiedade, foco, disciplina, fé, relacionamentos, saúde, dinheiro, gratidão, descanso)
     - religião (ou nenhuma), se quer motivação, quantas mensagens por dia e de quanto em quanto tempo beber água
   Cada pessoa recebe uma sequência própria: a escolha usa a identidade da pessoa + o dia + o horário,
   e nunca repete uma frase que ela recebeu nos últimos dias. Duas pessoas não recebem a mesma coisa ao mesmo tempo. */

export const RELIGIONS = {
  catolica: { label: 'Católica', fam: 'catolica' },
  evangelica: { label: 'Evangélica', fam: 'crista' },
  protestante: { label: 'Protestante', fam: 'crista' },
  crista: { label: 'Cristã (sem denominação)', fam: 'crista' },
  adventista: { label: 'Adventista', fam: 'crista' },
  testemunha: { label: 'Testemunha de Jeová', fam: 'crista' },
  ortodoxa: { label: 'Cristã ortodoxa', fam: 'crista' },
  sud: { label: 'Santos dos Últimos Dias', fam: 'crista' },
  espirita: { label: 'Espírita', fam: 'espirita' },
  umbanda: { label: 'Umbanda', fam: 'afro' },
  candomble: { label: 'Candomblé', fam: 'afro' },
  judaica: { label: 'Judaica', fam: 'judaica' },
  islamica: { label: 'Islâmica', fam: 'islamica' },
  budista: { label: 'Budista', fam: 'budista' },
  hindu: { label: 'Hinduísta', fam: 'hindu' },
  espiritualizado: { label: 'Espiritualizado(a), sem religião', fam: 'espiritual' },
  agnostico: { label: 'Agnóstico(a)', fam: 'secular' },
  ateu: { label: 'Ateu / ateia', fam: 'secular' },
  outra: { label: 'Outra', fam: 'espiritual' },
  nao_dizer: { label: 'Prefiro não dizer', fam: 'secular' },
};

/* textos de fé por tradição (citações conhecidas; quando não há texto sagrado único, frases de bênção respeitosas) */
/* Trechos de livros sagrados abaixo são paráfrases próprias, em palavras nossas, com a referência.
   Frases de santos, Kardec, Chico Xavier e Buda seguem como eram, com a fonte conhecida e revisaoJuridica: true (aguardando o jurídico). */
export const FAITH = {
  crista: [
    ['Com Cristo me sustentando, consigo encarar o que vier.', 'Filipenses 4:13'], ['Deus diz: estou do seu lado, então respire. Eu te dou força e te seguro pela mão.', 'Isaías 41:10'],
    ['Pode soltar em Deus tudo o que te deixa ansioso. Ele se importa com você.', '1 Pedro 5:7'], ['Deus cuida de mim como um pastor cuida do rebanho: não vai me faltar o essencial.', 'Salmos 23:1'],
    ['Coloque o seu caminho nas mãos de Deus e confie: ele cuida do resto.', 'Salmos 37:5'], ['Obrigado, Deus, por ter me criado de um jeito tão incrível e só meu.', 'Salmos 139:14'],
    ['Jesus convida quem anda exausto e carregando peso demais: chega perto, aqui tem descanso.', 'Mateus 11:28'], ['Jesus deixou um presente de despedida: a paz dele, para ficar com a gente.', 'João 14:27'],
    ['Entregue a Deus o que você faz e veja os seus planos ganharem firmeza.', 'Provérbios 16:3'], ['A alegria que vem de Deus é o que te mantém de pé.', 'Neemias 8:10'],
    ['Quem espera em Deus ganha fôlego novo: levanta voo, corre e segue sem desabar.', 'Isaías 40:31'], ['O medo não veio de Deus. Dele vêm a força, o amor e a cabeça no lugar.', '2 Timóteo 1:7'],
    ['Para quem ama a Deus, até os dias difíceis acabam servindo para algo bom.', 'Romanos 8:28'], ['A tristeza pode dormir aqui uma noite, mas quando amanhece a alegria chega.', 'Salmos 30:5'],
  ],
  catolica: [
    ['Com Cristo me sustentando, consigo encarar o que vier.', 'Filipenses 4:13'], ['Deus cuida de mim como um pastor cuida do rebanho: não vai me faltar o essencial.', 'Salmo 23'],
    ['Nada te perturbe, nada te espante. Quem a Deus tem, nada lhe falta. Só Deus basta.', 'Santa Teresa de Ávila', { fonte: 'Poema atribuído a Santa Teresa de Ávila ("Nada te turbe"), séc. XVI', revisaoJuridica: true }],
    ['Reze, espere e não se preocupe.', 'São Padre Pio', { fonte: 'Atribuída a São Pio de Pietrelcina (Padre Pio)', revisaoJuridica: true }], ['Faça o que puder, peça o que não puder, e Deus te dará o poder.', 'Santo Agostinho', { fonte: 'Santo Agostinho, De natura et gratia, 43 (versão livre)', revisaoJuridica: true }],
    ['Comece fazendo o que é necessário, depois o que é possível, e de repente estará fazendo o impossível.', 'São Francisco de Assis', { fonte: 'Atribuída a São Francisco de Assis; sem fonte primária conhecida', revisaoJuridica: true }],
    ['Maria, passa na frente e abre os caminhos de hoje.', 'Oração popular', { fonte: 'Oração popular; autoria não confirmada', revisaoJuridica: true }], ['Senhor, fazei de mim um instrumento de vossa paz.', 'Oração de São Francisco', { fonte: 'Oração de São Francisco; anônima, publicada em 1912 (La Clochette)', revisaoJuridica: true }],
    ['Não tenham medo!', 'São João Paulo II', { fonte: 'São João Paulo II, homilia de início do pontificado, 22/10/1978', revisaoJuridica: true }], ['Jesus deixou um presente de despedida: a paz dele, para ficar com a gente.', 'João 14:27'],
  ],
  espirita: [
    ['Fora da caridade não há salvação.', 'Allan Kardec', { fonte: 'Allan Kardec, O Evangelho segundo o Espiritismo, cap. XV', revisaoJuridica: true }],
    ['Nascer, morrer, renascer ainda e progredir sempre, tal é a lei.', 'Allan Kardec', { fonte: 'Inscrição no túmulo de Allan Kardec (Paris)', revisaoJuridica: true }],
    ['Cada dia é uma nova chance de fazer o bem, começando por perto.', 'Reflexão do Lembra'], ['O que a gente planta de carinho hoje volta em paz amanhã.', 'Reflexão do Lembra'],
  ],
  afro: [
    ['Que Oxalá te dê paz e sabedoria para hoje. Axé!', 'Bênção'], ['Que os bons caminhos se abram e a proteção dos seus orixás esteja contigo. Axé!', 'Bênção'],
    ['Firmeza no pensamento: o que é seu ninguém tira. Axé!', 'Bênção'], ['Que Ogum abra os caminhos do seu trabalho hoje. Axé!', 'Bênção'],
    ['Que Iemanjá acalme as águas do seu coração. Odoyá!', 'Bênção'], ['Que Xangô traga justiça e equilíbrio às suas decisões. Kaô!', 'Bênção'],
  ],
  judaica: [
    ['Preciso cuidar de mim, mas não só de mim. E o momento é agora.', 'Hillel, Pirkei Avot 1:14'],
    ['Você não precisa terminar tudo sozinho, mas também não dá para largar.', 'Rabi Tarfon, Pirkei Avot 2:16'],
    ['Deus ilumina e salva a minha vida. De quem eu teria medo?', 'Salmos 27:1'], ['O dia de hoje é presente de Deus. Que tal receber com alegria?', 'Salmos 118:24'],
    ['Sabedoria é conseguir aprender com qualquer pessoa.', 'Pirkei Avot 4:1'], ['Shalom: que a paz esteja contigo hoje.', 'Bênção'],
  ],
  islamica: [
    ['Junto com o aperto, Deus também manda o alívio.', 'Alcorão 94:6'], ['Deus não coloca sobre ninguém um peso maior do que a pessoa aguenta.', 'Alcorão 2:286'],
    ['Quem se lembra de Deus é lembrado por ele.', 'Alcorão 2:152'], ['Lembrar de Deus acalma o coração.', 'Alcorão 13:28'],
    ['Onde quer que você esteja, Deus está com você.', 'Alcorão 57:4'], ['Que a paz esteja contigo — As-salamu alaykum.', 'Saudação'],
  ],
  budista: [
    ['A paz vem de dentro. Não a procure fora.', 'Buda', { fonte: 'Atribuída a Buda; sem fonte canônica conhecida', revisaoJuridica: true }], ['A vida vai tomando a forma do que a gente pensa.', 'Dhammapada'],
    ['Não insista no passado, não sonhe com o futuro: concentre a mente no momento presente.', 'Buda', { fonte: 'Atribuída a Buda; sem fonte canônica conhecida', revisaoJuridica: true }],
    ['Uma palavra que traz paz vale mais que mil palavras vazias.', 'Dhammapada 100'], ['Respire. Você está aqui, agora. Isso basta.', 'Prática de atenção plena'],
    ['Como pedra firme no vento, quem tem sabedoria não balança com elogio nem com crítica.', 'Dhammapada 81'],
  ],
  hindu: [
    ['Cuide de agir bem. O resultado não está nas suas mãos.', 'Bhagavad Gita 2:47'], ['Vale mais viver o seu próprio caminho, com falhas, do que o de outra pessoa com perfeição.', 'Bhagavad Gita 3:35'],
    ['A mente não para quieta, mas com treino e calma ela se aquieta.', 'Bhagavad Gita 6:35'], ['Namastê: a luz em mim saúda a luz em você.', 'Saudação'],
  ],
  espiritual: [
    ['O universo não te dá o que você pede com os pensamentos, te dá o que você pede com as ações.', 'Reflexão'], ['Gratidão transforma o que temos em suficiente.', 'Reflexão'],
    ['Confie no processo. O que é seu está a caminho.', 'Reflexão'], ['Silêncio, respiração e intenção: comece por aí hoje.', 'Reflexão'],
  ],
  secular: [
    ['Não é porque as coisas são difíceis que não ousamos; é porque não ousamos que elas são difíceis.', 'Sêneca'],
    ['Você tem poder sobre a sua mente, não sobre os acontecimentos. Perceba isso e encontrará força.', 'Marco Aurélio'],
    ['A felicidade da sua vida depende da qualidade dos seus pensamentos.', 'Marco Aurélio'], ['Sofremos mais na imaginação do que na realidade.', 'Sêneca'],
    ['Comece onde você está. Use o que você tem. Faça o que você pode.', 'Arthur Ashe'], ['O segredo de avançar é começar.', 'Mark Twain'],
  ],
};

/* frases por jeito de ser e por momento emocional ({n} = nome; {lindo}/{campeao} = gênero escolhido) */
export const MIND = {
  ansiedade: [
    'Respira comigo, {n}: inspira em 4, segura 4, solta em 6. Repete 3 vezes. Pronto, a cabeça desacelera 🌿',
    'Uma coisa de cada vez. Qual é a ÚNICA coisa que precisa de você agora? Só ela.',
    'Nem tudo que a cabeça grita é verdade. Você está seguro(a) agora. Respira 💜',
    'Ansiedade é o futuro batendo antes da hora. Volta pro agora: 3 coisas que você está vendo ao redor.',
    'Escreve no Lembra o que tá te preocupando. Tirar da cabeça já alivia — o app guarda por você.',
    'Você não precisa resolver o dia inteiro agora. Só os próximos 10 minutos.',
  ],
  autoestima: [
    'Você é suficiente do jeito que é, {n}. Hoje e sempre 💜',
    'Fala com você como falaria com quem você mais ama. Você merece esse carinho.',
    'Lembra de tudo que você já superou? Pois é. Você é mais forte do que pensa.',
    'Você não precisa provar nada pra ninguém hoje. Só ser você já é muito.',
    'Seu valor não depende da sua produtividade. Você importa, {n}.',
    'Olha no espelho hoje e diz: eu me respeito. Parece bobo, funciona.',
  ],
  desmotivado: [
    'Tá sem vontade? Normal. Faz só 2 minutinhos da primeira tarefa. O resto vem 💪',
    'Não espere a motivação chegar. Ela aparece DEPOIS que você começa.',
    'Dia difícil também conta. Uma coisinha feita hoje já é vitória.',
    'Pequeno passo, {n}. Só um. Você consegue.',
    'Você não precisa estar 100% pra começar. 30% já dá pra dar o primeiro passo.',
  ],
  motivado: [
    'Você tá on fire, {n} 🔥 Que tal atacar a tarefa mais difícil do dia agora?',
    'Desafio de hoje: termina tudo antes do horário. Bora ver se você consegue?',
    'Constância é o seu superpoder. Mantém o ritmo hoje e amanhã você agradece.',
    'Você já provou que consegue. Agora é sobre ir além.',
  ],
  impulsivo: ['Antes de decidir algo grande hoje, respira e conta até 10. A melhor versão de você responde, não reage.', 'Pausa de 5 segundos antes de responder aquela mensagem. Vale ouro.'],
  perfeccionista: ['Feito é melhor que perfeito, {n}. Entrega o 80% e segue.', 'Ninguém vai notar o detalhe que você tá corrigindo pela 4ª vez. Solta.'],
  procrastinador: ['Regra dos 2 minutos: se leva menos que isso, faz agora 😉', 'Aquela tarefa que você tá adiando… começa só pela primeira linha.', 'Coloca um timer de 10 minutos e começa. Quando tocar, você decide se para.'],
  organizado: ['Sua organização é sua arma. Dá uma olhada na agenda de amanhã e chega na frente.', 'Que tal revisar a semana hoje e deixar tudo redondinho?'],
  sensivel: ['Tá tudo bem sentir muito, {n}. Isso também é força. Cuida de você hoje 💜', 'Se algo te machucou hoje, não guarda sozinho(a). Conversa com alguém de confiança.'],
  competitivo: ['Você contra você de ontem. Bora ganhar hoje? 🏆', 'Tem gente no ranking subindo. Uma tarefa no horário e você passa na frente.'],
  sonhador: ['Sonho sem agenda vira só desejo. Bota um passo do seu sonho no Lembra hoje ✨', 'Grande sonho, pequeno passo diário. Qual é o passo de hoje?'],
  pratico: ['Lista do que importa hoje: 3 itens. O resto é bônus.', 'Resolve a mais rápida primeiro e ganha embalo.'],
  // áreas que a pessoa quer trabalhar
  foco: ['Celular longe por 25 minutos e uma tarefa só. Depois, 5 de pausa. Topa?', 'Foco é dizer não para o que não importa agora.'],
  disciplina: ['Disciplina é fazer mesmo sem vontade. Você é capaz disso, {n}.', 'Faz hoje o que o você de amanhã vai agradecer.'],
  relacionamentos: ['Manda uma mensagem pra alguém que você ama dizendo isso. Sem motivo.', 'Ouvir de verdade é um presente. Faz isso com alguém hoje.'],
  saude: ['Levanta, alonga, respira. Seu corpo carrega tudo — cuida dele 🌿', 'Já se mexeu hoje? 10 minutos de caminhada mudam o humor.'],
  dinheiro: ['Antes de comprar hoje, pergunta: eu preciso ou só quero agora?', 'Confere se tem alguma conta vencendo essa semana. O Lembra te ajuda a não pagar juros.'],
  gratidao: ['Pensa em 3 coisas boas de hoje. Pode ser pequena. Gratidão muda o filtro da mente 🙏', 'Agradece alguém hoje. Faz bem pros dois.'],
  descanso: ['Descansar também é produtivo, {n}. Pausa sem culpa.', 'Hoje à noite: tela longe 30 min antes de dormir. Seu sono agradece 🌙'],
  fe: [],
};

/* identidade estável de cada pessoa → sequência própria (FNV-1a) */
export function hashStr(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }

/* Monta o "cardápio" da pessoa: quais grupos de frases ela recebe e com que peso */
export function mindMix(m = {}) {
  const w = {};
  const add = (k, n) => { if (MIND[k] && MIND[k].length) w[k] = (w[k] || 0) + n; };
  if (m.anxiety === 'muita') add('ansiedade', 4); else if (m.anxiety === 'as_vezes') add('ansiedade', 2);
  if (m.selfesteem === 'baixa') add('autoestima', 4); else if (m.selfesteem === 'oscila') add('autoestima', 2);
  if (m.motivation === 'baixa') add('desmotivado', 4); else if (m.motivation === 'alta') add('motivado', 3); else add('desmotivado', 1), add('motivado', 1);
  (m.traits || []).forEach((t) => add(t, 2));
  (m.focus || []).forEach((t) => add(t, 2));
  if (!Object.keys(w).length) { add('motivado', 1); add('desmotivado', 1); add('gratidao', 1); }
  return w;
}

/* Escolhe uma frase só desta pessoa: sorteio ponderado com a semente dela, sem repetir as recentes */
export function pickMind(m, personId, slot, recent = []) {
  const w = mindMix(m);
  const keys = Object.keys(w), total = keys.reduce((a, k) => a + w[k], 0);
  let r = (hashStr(`${personId}|${slot}`) % 1000) / 1000 * total, group = keys[0];
  for (const k of keys) { if ((r -= w[k]) <= 0) { group = k; break; } }
  const pool = MIND[group].filter((t) => !recent.includes(t));
  const list = pool.length ? pool : MIND[group];
  return { group, text: list[hashStr(`${personId}|${slot}|t`) % list.length] };
}

export function pickFaith(religion, personId, slot, recent = []) {
  const fam = (RELIGIONS[religion] || RELIGIONS.crista).fam;
  const pool = FAITH[fam] || FAITH.crista;
  const free = pool.filter(([t]) => !recent.some((r) => r.includes(t)));
  const list = free.length ? free : pool;
  return list[hashStr(`${personId}|${slot}|f`) % list.length];
}

/* Descrição da pessoa para a IA escrever do jeito certo */
export function mindBrief(m = {}) {
  const parts = [];
  if (m.anxiety === 'muita') parts.push('é bem ansiosa: fale com calma, frases curtas, nada de pressão');
  if (m.selfesteem === 'baixa') parts.push('tem autoestima baixa: valorize, acolha, nunca critique');
  if (m.motivation === 'baixa') parts.push('anda desmotivada: proponha passos minúsculos e celebre pouco progresso');
  if (m.motivation === 'alta') parts.push('é muito motivada: pode desafiar e falar de metas');
  const T = { impulsivo: 'impulsiva', perfeccionista: 'perfeccionista', procrastinador: 'procrastina', organizado: 'organizada', sensivel: 'sensível', competitivo: 'competitiva', sonhador: 'sonhadora', pratico: 'prática' };
  const tr = (m.traits || []).map((t) => T[t]).filter(Boolean);
  if (tr.length) parts.push(`se descreve como ${tr.join(', ')}`);
  if ((m.focus || []).length) parts.push(`quer trabalhar: ${m.focus.join(', ')}`);
  return parts.join('; ');
}
