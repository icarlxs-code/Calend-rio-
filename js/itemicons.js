/* Ícone de cada coisa do Pessoal pelo que a pessoa escreveu (não pela categoria genérica):
   "fazer cabelo" → secador · "unha" → esmalte · "maquiagem" → batom · "conta de luz" → lâmpada ·
   "conta de água" → gota · "internet" → Wi-Fi · "dentista" → dente…  Cada um com a sua cor e o seu emoji
   (o emoji vai nas notificações). A ordem importa: do mais específico para o mais geral. */
const norm = (s) => ' ' + String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim() + ' ';

// cores (degradê do bloquinho)
const C = {
  rosa: ['#FF8FB8', '#D9367A'], lilas: ['#C78BFF', '#8A4DFF'], vinho: ['#FF6B8A', '#B0123F'], pele: ['#FFB38A', '#E26A3D'],
  luz: ['#FFD54F', '#F59E0B'], agua: ['#5CC8FF', '#0A84FF'], gas: ['#FF9A57', '#E8530E'], net: ['#7DD3FC', '#0284C7'],
  casa: ['#9AD07F', '#3F8F2E'], dinheiro: ['#4BD88B', '#0E9F5A'], cartao: ['#8B8CFF', '#5146E5'], imposto: ['#A8B3C7', '#5B6478'],
  saude: ['#4BD88B', '#16A35A'], dente: ['#7FE0E8', '#0E9FB0'], remedio: ['#FF8A80', '#E53935'], mente: ['#B39DFF', '#6D4AE0'],
  pet: ['#E0B07A', '#A86B2D'], carro: ['#8EA4C8', '#41557A'], viagem: ['#5AA8FF', '#2F6BFF'], comida: ['#FFB547', '#FF7A1A'],
  fe: ['#FFD98A', '#C98B12'], estudo: ['#6FA8FF', '#2F5BD8'], festa: ['#FF7A9C', '#E8326A'], esporte: ['#4ADE80', '#15803D'],
  compra: ['#8B8CFF', '#5146E5'], limpa: ['#67E8F9', '#0891B2'], cinza: ['#8E9AAF', '#5B6478'], bebe: ['#FFC2D9', '#F06292'],
};
// [padrão (sem acento), ícone, cor, emoji]
const RULES = [
  // frases que enganariam as regras gerais ("escova de dente" não é cabelo; "comprar roupa" não é lavar roupa)
  [/ (escova de dente|fio dental) /, 'tooth', C.dente, '🦷'],
  [/ (comprar roupa|roupa nova|comprar sapato|comprar tenis) /, 'shoppingbag', C.compra, '🛍️'],
  [/ (receita federal) /, 'receipt', C.imposto, '🧾'],
  // ---- beleza ----
  [/ (unha|unhas|manicure|pedicure|esmalte|alongamento de unha|fibra de vidro|gel nas unhas|cuticula) /, 'nailpolish', C.vinho, '💅'],
  [/ (maquiagem|make|maquiar|maquiadora?|batom|automaquiagem) /, 'lipstick', C.rosa, '💄'],
  [/ (sobrancelha|sobrancelhas|design de sobrancelha|henna|micropigmentacao|cilios|lash|extensao de cilios) /, 'eye', C.lilas, '👁️'],
  [/ (barba|barbeiro|barbearia|bigode|navalha) /, 'razor', C.carro, '💈'],
  [/ (cabelo|cabelos|escova|progressiva|hidratacao|luzes|mechas|tintura|pintar o cabelo|corte de cabelo|cortar o cabelo|cortar cabelo|salao|cabeleireir[ao]|trancas|tranca|penteado|chapinha|cachos|botox capilar|reconstrucao|alisamento|relaxamento|retoque da raiz|raiz) /, 'hairdryer', C.rosa, '💇'],
  [/ (depilacao|depilar|cera|laser) /, 'sparkles', C.pele, '✨'],
  [/ (limpeza de pele|skincare|skin care|estetica|esteticista|peeling|drenagem|massagem|spa|day spa|massoterapia|relaxar) /, 'lotus', C.lilas, '🧖'],
  [/ (tatuagem|tattoo|piercing) /, 'pencil', C.carro, '🖋️'],
  [/ (perfume|hidratante|creme) /, 'spray', C.rosa, '🧴'],
  // ---- contas da casa ----
  [/ (conta de luz|luz|energia|enel|cemig|copel|light|celesc|coelba|cpfl|equatorial|neoenergia|eletropaulo) /, 'bulb', C.luz, '💡'],
  [/ (conta de agua|agua e esgoto|sabesp|cedae|copasa|sanepar|embasa|compesa|caesb|saneamento) /, 'droplet', C.agua, '💧'],
  [/ (conta de gas|gas|botijao|comgas|ultragaz|liquigas) /, 'flame', C.gas, '🔥'],
  [/ (internet|wifi|wi fi|fibra|vivo fibra|claro net|net claro|oi fibra|tim live|provedor) /, 'wifi', C.net, '📶'],
  [/ (conta de celular|celular|telefone|recarga|plano do celular|ligar|ligacao|telefonar|retornar a ligacao) /, 'phone', C.net, '📱'],
  [/ (netflix|streaming|spotify|disney|prime video|hbo|hbo max|globoplay|tv a cabo|sky|youtube premium|assinatura) /, 'tv', C.festa, '📺'],
  [/ (aluguel|condominio|iptu|imovel|apartamento|casa nova|mudanca|chave) /, 'home', C.casa, '🏠'],
  [/ (ipva|licenciamento|multa|detran|cnh|habilitacao) /, 'car', C.carro, '🚗'],
  [/ (imposto|imposto de renda|irpf|darf|guia do das|mei|inss|taxa|guia) /, 'receipt', C.imposto, '🧾'],
  [/ (cartao|fatura|nubank|credito) /, 'card', C.cartao, '💳'],
  [/ (boleto|conta|contas|pagar|pagamento|parcela|prestacao|mensalidade) /, 'receipt', C.dinheiro, '🧾'],
  [/ (pix|transferir|transferencia|deposito|depositar|banco|caixa economica|emprestimo|financiamento|investimento|investir|poupanca) /, 'bank', C.dinheiro, '🏦'],
  [/ (salario|receber|cobrar|dinheiro|troco|vender) /, 'cash', C.dinheiro, '💵'],
  [/ (seguro|seguradora) /, 'shield', C.imposto, '🛡️'],
  // ---- saúde ----
  [/ (dentista|dente|dentes|aparelho nos dentes|aparelho dental|ortodontista|tratamento de canal|limpeza dos dentes|clareamento) /, 'tooth', C.dente, '🦷'],
  [/ (vacina|vacinar|injecao|exame de sangue|coleta|coletar sangue|doar sangue|insulina) /, 'syringe', C.saude, '💉'],
  [/ (remedio|remedios|comprimido|antibiotico|vitamina|farmacia|drogaria|receita medica) /, 'pill', C.remedio, '💊'],
  [/ (psicologo|psicologa|psiquiatra|terapia|terapeuta) /, 'brain', C.mente, '🧠'],
  [/ (oftalmo|oftalmologista|oculos|lente de contato|lentes de contato|otica|exame de vista) /, 'glasses', C.carro, '👓'],
  [/ (exame|exames|ultrassom|raio x|ressonancia|tomografia|mamografia|laboratorio|resultado do exame) /, 'microscope', C.saude, '🔬'],
  [/ (hospital|cirurgia|internacao|pronto socorro|upa|emergencia) /, 'hospital', C.remedio, '🏥'],
  [/ (fisioterapia|fisio|sessao de fisio|quiropraxia|rpg) /, 'bandage', C.saude, '🩹'],
  [/ (pediatra|bebe|neném|nenem|fralda|fraldas|mamadeira) /, 'baby2', C.bebe, '👶'],
  [/ (gineco|ginecologista|obstetra|pre natal|prenatal|gravidez) /, 'heart2', C.bebe, '🩺'],
  [/ (nutricionista|dieta|nutri) /, 'apple', C.saude, '🥗'],
  [/ (medico|medica|consulta|clinica|cardiologista|dermatologista|ortopedista|neurologista|endocrino|urologista|check up|checkup|posto de saude) /, 'stethoscope', C.saude, '🩺'],
  // ---- corpo e esporte ----
  [/ (academia|treino|musculacao|personal|crossfit|malhar) /, 'dumbbell', C.esporte, '🏋️'],
  [/ (corrida|correr|caminhada|caminhar|maratona) /, 'run', C.esporte, '🏃'],
  [/ (yoga|ioga|pilates|meditacao|meditar|alongamento) /, 'lotus', C.mente, '🧘'],
  [/ (bicicleta|bike|pedal|ciclismo|spinning) /, 'bike', C.esporte, '🚴'],
  [/ (futebol|futsal|pelada|jogo do|volei|basquete|jogar tenis|beach tennis|natacao|nadar|piscina|luta|jiu jitsu|muay thai|boxe) /, 'ball', C.esporte, '⚽'],
  // ---- pets ----
  [/ (veterinario|vet|banho e tosa|tosa|petshop|pet shop|racao|vermifugo|castracao|cachorro|cachorra|gato|gata|cao|pet) /, 'paw', C.pet, '🐾'],
  // ---- carro e transporte ----
  [/ (gasolina|abastecer|combustivel|etanol|posto de gasolina|diesel) /, 'fuel', C.gas, '⛽'],
  [/ (mecanico|oficina|revisao do carro|troca de oleo|pneu|pneus|alinhamento|funilaria|bateria do carro) /, 'wrench', C.carro, '🔧'],
  [/ (lavar o carro|lava jato|lavagem do carro) /, 'droplet', C.agua, '🚿'],
  [/ (carro|moto|estacionamento|uber|99|taxi) /, 'car', C.carro, '🚗'],
  [/ (voo|aeroporto|viagem|viajar|passagem|embarque|hotel|ferias|pousada|check in|checkin) /, 'plane', C.viagem, '✈️'],
  [/ (onibus|rodoviaria|metro|trem) /, 'bus', C.viagem, '🚌'],
  [/ (praia|piscina|sol) /, 'sun2', C.luz, '🏖️'],
  // ---- família e pessoas ----
  [/ (buscar|levar|pegar o|pegar a|carona|deixar na escola|deixar no) /, 'car', C.comida, '🚗'],
  [/ (aniversario|niver|aniver|parabens) /, 'cake', C.festa, '🎂'],
  [/ (casamento|noivado|bodas) /, 'heart', C.festa, '💍'],
  [/ (presente|presentear|lembrancinha) /, 'gift', C.festa, '🎁'],
  [/ (namoro|namorad[ao]|date|encontro romantico|jantar romantico) /, 'heart', C.vinho, '❤️'],
  [/ (festa|balada|churrasco|confraternizacao|happy hour|barzinho|bar) /, 'wine', C.festa, '🎉'],
  [/ (cinema|filme|teatro|show|ingresso|ingressos|museu|exposicao) /, 'ticket', C.lilas, '🎟️'],
  [/ (videogame|video game|game|jogar|playstation|xbox) /, 'gamepad', C.mente, '🎮'],
  // ---- fé ----
  [/ (igreja|culto|missa|celula|grupo de oracao|retiro|batismo|catequese|crisma|ebd|escola biblica) /, 'church', C.fe, '⛪'],
  [/ (orar|oracao|biblia|devocional|leitura biblica|jejum|rezar|terco) /, 'book', C.fe, '🙏'],
  // ---- estudo e trabalho ----
  [/ (prova|provas|simulado|vestibular|enem|concurso) /, 'clipboard', C.estudo, '📝'],
  [/ (aula|curso|faculdade|escola|estudar|estudo|trabalho da faculdade|tcc|matricula|reuniao de pais) /, 'gradcap', C.estudo, '🎓'],
  [/ (livro|ler|leitura|biblioteca) /, 'book', C.estudo, '📚'],
  [/ (entrevista|curriculo|emprego|vaga) /, 'briefcase', C.carro, '💼'],
  [/ (reuniao|call|videochamada|zoom|meet) /, 'users', C.estudo, '👥'],
  [/ (documento|documentos|rg|cpf|passaporte|cartorio|certidao|procuracao|assinar) /, 'idcard', C.imposto, '🪪'],
  [/ (correio|correios|encomenda|entrega|pacote|sedex|rastreio) /, 'package', C.pet, '📦'],
  // ---- casa ----
  [/ (faxina|limpar|limpeza|arrumar a casa|organizar a casa|diarista) /, 'broom', C.limpa, '🧹'],
  [/ (lavar roupa|roupa|roupas|lavanderia|passar roupa|varal) /, 'shirt', C.limpa, '👕'],
  [/ (lixo|reciclagem|coleta de lixo) /, 'trash2', C.cinza, '🗑️'],
  [/ (regar|planta|plantas|jardim|horta|vaso) /, 'plant', C.casa, '🪴'],
  [/ (conserto|consertar|eletricista|encanador|pedreiro|reforma|pintor|marceneiro|chaveiro|instalacao) /, 'hammer', C.carro, '🔨'],
  [/ (banho|banheira) /, 'bath', C.agua, '🛁'],
  // ---- comida e compras ----
  [/ (cafe|cafe da manha|padaria|cafeteria) /, 'coffee', C.pet, '☕'],
  [/ (pizza|pizzaria|lanche|hamburguer|ifood|delivery) /, 'pizza', C.comida, '🍕'],
  [/ (almoco|almocar|jantar|janta|restaurante|marmita|comer|cozinhar|receita) /, 'utensils', C.comida, '🍽️'],
  [/ (bolo|doce|sobremesa|confeitaria) /, 'cake', C.festa, '🍰'],
  [/ (mercado|supermercado|feira|hortifruti|acougue|atacadao|compras do mes) /, 'cart', C.compra, '🛒'],
  [/ (shopping|loja|comprar|compra|roupa nova|sapato|tenis novo) /, 'shoppingbag', C.compra, '🛍️'],
  [/ (promocao|cupom|desconto|black friday) /, 'tag', C.festa, '🏷️'],
  [/ (agua|beber agua|garrafa) /, 'droplet', C.agua, '💧'],
];

const cache = new Map();
/* { ic, g, emoji } da coisa, ou null (aí vale o ícone da categoria) */
export function itemLook(title, extra = '') {
  const key = `${title}|${extra}`;
  if (cache.has(key)) return cache.get(key);
  const t = norm(`${title} ${extra}`);
  const hit = RULES.find(([re]) => re.test(t));
  const out = hit ? { ic: hit[1], g: hit[2], emoji: hit[3] } : null;
  if (cache.size > 500) cache.clear();
  cache.set(key, out);
  return out;
}
export const ITEM_RULES = RULES; // para os testes
