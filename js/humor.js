/* O humor do Lembra: trocadilhos de sino e brincadeiras sobre o que a pessoa está marcando ou concluindo.
   Entende o assunto pelo título, nunca repete a última frase do mesmo assunto e respeita Ajustes → Piadas do Lembra. */
const K = 'lembra.piadas';
export const humorOn = () => { try { return localStorage.getItem('lembra.humor') !== '0'; } catch { return true; } };

/* c = ao marcar · f = ao concluir · a = no lembrete, antes da hora */
const TEMAS = [
  { re: /anivers|\bniver\b|parab[eé]ns/, c: ['Você não vai ser a pessoa do “parabéns atrasado” 🎂', 'Bolo é a minha parte favorita. E olha que eu nem tenho estômago!', 'Vou tocar o parabéns no tom certo 🎶'], f: ['Parabéns dado em dia. Amizade nível sino de ouro 🔔'], a: ['Hoje tem bolo, abraço e zero desculpa 🎂'] },
  { re: /dentista|ortodon|aparelho|\bdente/, c: ['Abre a boca e diz “plim”! 🦷', 'Essa consulta é de cair o queixo. Só não deixa cair o dente!', 'Dentista marcado. Nada de fugir com o rabo entre os dentes 😄'], f: ['Sorriso renovado! Agora brilha mais que eu 😁', 'Coragem de dente… digo, de leão! 🦁'], a: ['Passa o fio dental e finge que sempre passou 😅'] },
  { re: /academia|treino|muscula|crossfit|corrida|\bcorrer\b|pilates|\byoga\b|personal trainer|futebol|\bbike\b/, c: ['Treino marcado. Desculpa não queima caloria 😏', 'Bora malhar! Eu só levanto badalo, mas tô contigo 💪', 'O peso sai da consciência e vai pro braço!'], f: ['Suou bonito! Tô orgulhoso 💪', 'Esse treino foi sino-fônico. Sinfônico, vai 🎶'], a: ['Tênis no pé, desculpa na gaveta 👟'] },
  { re: /reuni[aã]o|\bcall\b|\bmeet\b|\bzoom\b|alinhamento/, c: ['Podia ser um e-mail? Talvez. Mas tá marcada 😄', 'Reunião anotada. Que seja breve e tenha café ☕', 'Toco antes do primeiro “vocês estão me ouvindo?”'], f: ['Sobreviveu a mais uma reunião! Medalha de paciência 🏅', 'Reunião vencida e ninguém passou vergonha no microfone. Vitória!'], a: ['Confere o microfone e faz cara de quem leu a pauta 😌'] },
  { re: /boleto|\bconta(s)? d[aeo]\b|\bpagar\b|\bpix\b|fatura|aluguel|imposto|\biptu\b|\bipva\b/, c: ['Boleto nunca esquece de você. Agora você também não esquece dele 😎', 'Juros? Aqui não, meu bem!', 'Conta anotada. A parte de pagar eu deixo contigo 😅'], f: ['Pago! O boleto até chorou 🥲', 'Uma conta a menos, uma noite de sono a mais 😴'], a: ['O boleto tá na porta. Atende logo que ele cobra por hora 😄'] },
  { re: /cabelo|cabelei|barbe|sal[aã]o|\bunha|manicure|escova|sobrancelha/, c: ['Eu não tenho um fio, mas entendo de brilho ✨', 'Vai sair de lá um arraso!', 'Cabelo marcado. Eu sou penteado só por dentro 💇'], f: ['Que visual! Até me vi refletido ✨'], a: ['Hora do tapa no visual. Eu fico aqui, careca e feliz 😌'] },
  { re: /m[eé]dic|consulta|exame|hospital|vacina|psic[oó]|terapia|fisio|cl[ií]nica/, c: ['Cuidar de você é compromisso número 1 🧡', 'Se perguntarem, eu bato bem da cabeça. Literalmente 🔔', 'Saúde marcada. Essa eu toco com carinho'], f: ['Se cuidou? Meu badalo até acalmou 🧡', 'Saúde em dia! Isso sim é bater o sino da alegria 🔔'], a: ['Documento na mão e respira fundo. Vai dar tudo certo 🧡'] },
  { re: /rem[eé]dio|comprimido|vitamina|antibi[oó]tico/, c: ['Na hora certa! Eu sou praticamente um sino farmacêutico 💊'], f: ['Tomou direitinho! O corpo agradece 💊'], a: ['Copo d’água na mão e vamos lá 💊'] },
  { re: /mercado|\bfeira\b|compras|hortifr|padaria|a[cç]ougue|\bceasa\b/, c: ['Vai de barriga cheia, senão volta com quatro sorvetes 🍦', 'Mercado anotado. Eu lembro, mas não carrego sacola 😅'], f: ['Geladeira feliz, gente feliz 🥦', 'Missão compras: cumprida sem esquecer o principal!'], a: ['Pega a lista! A memória de sino é minha, não sua 😄'] },
  { re: /\bprova\b|estud|\baula\b|curso|faculdade|escola|vestib|\benem\b|\btcc\b|\bler\b/, c: ['Estudar comigo é en-SINO de qualidade 📚', 'Cérebro também faz musculação 🧠', 'Saber não ocupa espaço. Só na mochila, um pouquinho'], f: ['Aprendeu? Então valeu o en-SINO 📚', 'Cérebro malhado! 🧠💪'], a: ['Respira, revisa e confia. O toque final é meu 😌'] },
  { re: /viagem|viajar|\bvoo\b|aeroporto|hotel|passagem|embarque/, c: ['Viagem marcada! É o nosso de-SINO ✈️', 'Deixa 20% da mala vazia pras comprinhas 😎'], f: ['Que passeio! Era mesmo o de-SINO ✈️'], a: ['Documento, carregador e calma. Nessa ordem ✈️'] },
  { re: /contrato|proposta|or[cç]amento|\bvenda|\bcliente\b|assinar|negoci/, c: ['Contrato? Eu as-SINO embaixo ✍️', 'Bora fechar negócio e bater o sino da venda 🔔'], f: ['Fechado! Pode bater o sino 🔔🔔', 'Negócio bonito. Eu as-SINO embaixo ✍️'], a: ['Postura, sorriso e proposta na mão. Vai que é sua!'] },
  { re: /grava|\bpost\b|\breels?\b|\bstory\b|stories|v[ií]deo|edi[cç][aã]o|capta[cç]|\bfotos?\b|\bfeed\b|carrossel/, c: ['Luz, câmera… plim! 🎬', 'O algoritmo que lute 😎', 'Se viralizar, eu quero crédito 😏'], f: ['Corta! Ficou lindo 🎬', 'Conteúdo pronto! Meu like imaginário já foi 👏'], a: ['Bateria carregada e cartão vazio? Então bora 🎥'] },
  { re: /entreg|enviar|\bprazo\b|relat[oó]rio|planilha|\bartes?\b/, c: ['Prazo anotado. Deixar pra véspera é esporte radical 🪂', 'Vai ficar pronto antes do meu próximo dim-dom'], f: ['Entregue! E ninguém precisou virar a noite 🌙', 'Prazo vencido? Não: prazo VENCIDO por você 🏆'], a: ['Capricha no final, que o começo já tá bonito ✨'] },
  { re: /limp|faxina|\blavar\b|lou[cç]a|\broupa|arrumar|organiza/, c: ['A louça não vai se lavar. Eu já pedi, ela me ignorou 🍽️', 'Faxina marcada. O pó que se prepare 🧹'], f: ['Brilhando! Quase igual a mim ✨'], a: ['Música alta e vassoura na mão 🧹'] },
  { re: /jantar|encontro|\bdate\b|namor|cinema|\bbar\b|barzinho|\bfesta\b|\bshow\b|churras|almo[cç]o com/, c: ['Programa bom! Se tiver música, eu toco junto 🔔', 'Se for date, prometo não apitar na hora errada 🤫'], f: ['Viveu! Agenda boa é agenda com história 🎉'], a: ['Cheirinho bom e celular no silencioso. Menos eu, né 😄'] },
  { re: /cachorro|\bgato\b|\bpet\b|veterin|ra[cç][aã]o|tosa/, c: ['Au-au anotado 🐶', 'Na hora eu toco. Ele late. Dupla imbatível 🐾'], f: ['Seu bichinho manda lambidas 🐾'], a: ['Tem alguém de quatro patas te esperando 🐶'] },
  { re: /carro|oficina|mec[aâ]nic|\b[oó]leo\b|\bpneu|detran|\bcnh\b/, c: ['Carro na revisão, cabeça no lugar 🚗', 'Essa eu não deixo passar no sinal vermelho 🚦'], f: ['Motor ronronando e você em dia 🚗'], a: ['Chave, documento e paciência com o trânsito 🚗'] },
  { re: /\b[aá]gua\b|hidrat/, c: ['Água! Você também é planta 🌱'], f: ['Glub-glub de respeito 💧'], a: ['Um golinho por mim? Eu enferrujo 💧'] },
  { re: /igreja|\bmissa\b|\bculto\b|ora[cç][aã]o|c[eé]lula|b[ií]blia/, c: ['Sino e igreja? Tô em casa 🔔🙏'], f: ['Coração leve 🙏'], a: ['Esse toque eu conheço de longe 🔔🙏'] },
  { re: /\bligar\b|telefon|retornar|liga[cç][aã]o/, c: ['Trim… digo, plim! ☎️', 'Anotado. Nada de “oi, sumiço” depois'], f: ['Ligou! Uma pendência a menos no fio ☎️'], a: ['Respira e disca. A parte difícil é só o “alô” ☎️'] },
  { re: /\bm[aã]e\b|\bpai\b|\bfilh|\bav[oóô]\b|\bfam[ií]lia\b/, c: ['Família primeiro. Já separei o meu melhor toque 🧡'], f: ['Família agradece. E o coração também 🧡'], a: ['Leva um abraço por mim. Meus braços são curtos 🧡'] },
  { re: /dormir|\bsono\b|descans|f[eé]rias|\bfolga\b/, c: ['Descansar também é compromisso 😴'], f: ['Bateria recarregada! 🔋'], a: ['Vai com calma. Hoje a pressa é folga minha 😌'] },
];
const GERAL = {
  c: ['Deixa comigo!', 'Minha memória é de sino: não falha 🔔', 'Pode esquecer, que eu não esqueço 😉', 'Guardado a sete badaladas 🔔', 'Cumprir isso é o nosso de-SINO 😄', 'Marcado! Eu as-SINO embaixo ✍️', 'Tá na agenda, tá no coração 🧡'],
  f: ['Ouviu esse dim-dom? Foi meu coração 🔔', 'Mais um! Assim eu fico sem ter o que lembrar 😅', 'Que afinação! Tá tocando a vida bonito 🎶', 'Se esforço desse XP… ah, dá mesmo! ✨', 'Feito! Até balancei o badalo de alegria'],
  a: ['Tá quase na hora. Eu nem pisquei 👀', 'Plim! Só passando pra você chegar com classe 😌'],
  t: ['Psiu… esse ficou pra trás. Bora buscar antes que ele faça amizade com os outros 😄', 'Esse compromisso tá me olhando com cara de abandono. Resolve comigo? 🥺', 'Passou um pouquinho da hora. Sem drama: faz e a gente comemora 🔔', 'Eu toquei, você não veio… nosso encontro furou 💔 Ainda dá tempo!'],
  adiar: ['Empurrou com a barriga? Eu nem tenho barriga, tenho badalo 😏', 'Adiado! Mas eu tô de olho. Dois, e bem grandes 👀', 'Tá bom, tá bom… na próxima eu faço cara de pidão 🥺'],
  apagar: ['Sumiu! Nem mágico faz tão rápido 🎩', 'Apagado. Esse até eu esqueço. Mentira, eu nunca esqueço 😌'],
  escuro: ['Quem apagou a luz? 🌚', 'Modo coruja ligado 🦉'], claro: ['Que claridão! Cadê meu óculos? 😎', 'Bom diaaa, tema claro ☀️'],
  assistente: ['Chamou reforço? Eu e a IA somos uma dupla e tanto 🤖', 'Pergunta difícil? Eu faço cara de inteligente 🧐'],
  ranking: ['Bora ver quem tá tocando mais alto 🏆'], amigos: ['Cadê a galera? Sino sozinho não faz carnaval 🤝'], perfil: ['Olha a estante de troféus! 😎'],
};
const norm = (s) => String(s || '').toLowerCase();
export const tema = (titulo) => { const t = norm(titulo); return TEMAS.findIndex((x) => x.re.test(t)); };
const ler = () => { try { return JSON.parse(localStorage.getItem(K) || '{}'); } catch { return {}; } };
function sorteia(lista, chave) { // nunca a mesma duas vezes seguidas
  if (!lista || !lista.length) return '';
  const m = ler(); let i = Math.floor(Math.random() * lista.length);
  if (lista.length > 1 && i === m[chave]) i = (i + 1) % lista.length;
  m[chave] = i; try { localStorage.setItem(K, JSON.stringify(m)); } catch { /* ok */ }
  return lista[i];
}
/** piada do momento. q: 'c' marcar, 'f' concluir, 'a' antes, 't' atraso, ou um dos gerais ('adiar', 'apagar'…). '' = sem humor */
export function piada(titulo, q = 'c', { geral = true } = {}) {
  if (!humorOn()) return '';
  const i = tema(titulo);
  if (i >= 0 && TEMAS[i][q]) return sorteia(TEMAS[i][q], i + q);
  return geral ? sorteia(GERAL[q], 'g' + q) : '';
}
/** a mesma frase para o mesmo compromisso (os avisos agendados não podem mudar a cada sincronização) */
export function piadaFixa(titulo, q, semente) {
  if (!humorOn()) return '';
  let h = 0; for (const c of String(semente)) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const i = tema(titulo), L = (i >= 0 && TEMAS[i][q]) || GERAL[q] || [];
  return L.length ? L[h % L.length] : '';
}
