/* Exemplo do campo "Cargo ou função" de acordo com a profissão escolhida
   (ex.: Confeiteiro → "Auxiliar de cozinha, confeitaria artesanal"). Se não houver um exemplo da profissão, usa o da área. */
import { PROFESSIONS } from '../functions/catalog.js';

const BY = {
  // saúde
  'Médico': 'Plantonista, residente de cardiologia', 'Dentista': 'Ortodontista, clínico geral', 'Psicólogo': 'Clínica, hospitalar, TCC',
  'Fisioterapeuta': 'Ortopédica, home care', 'Personal trainer': 'Musculação, funcional, online', 'Educador físico': 'Academia, escolinha de esportes',
  'Nutricionista': 'Clínica, esportiva', 'Veterinário': 'Pequenos animais, clínica 24h', 'Farmacêutico': 'Responsável técnico, drogaria',
  'Enfermeiro': 'Plantonista da UTI, chefe de setor', 'Técnico de enfermagem': 'Plantão noturno, centro cirúrgico', 'Auxiliar de enfermagem': 'Posto de saúde, plantão',
  'Cuidador de idosos': 'Diurno, folguista', 'Socorrista': 'SAMU, ambulância particular', 'Recepcionista hospitalar': 'Pronto-socorro, internação',
  // educação
  'Professor': 'Matemática, 5º ano, rede estadual', 'Professor de educação infantil': 'Maternal II, berçário', 'Professor de ensino fundamental': 'Português, 7º ano',
  'Professor de ensino médio': 'Química, 3º ano', 'Professor universitário': 'Adjunto, substituto', 'Diretor escolar': 'Rede municipal, escola particular',
  'Coordenador pedagógico': 'Ensino fundamental I', 'Professor de idiomas': 'Inglês, aulas particulares', 'Instrutor de cursos': 'Informática, autoescola',
  // tecnologia e comunicação
  'Programador': 'Front-end pleno, back-end sênior', 'Desenvolvedor de software': 'Pleno, tech lead', 'Desenvolvedor web': 'Front-end, freelancer',
  'Analista de sistemas': 'Sênior, sustentação', 'Técnico de informática': 'Suporte em campo, assistência técnica', 'Designer gráfico': 'Identidade visual, freelancer',
  'Social media': 'Freelancer, agência', 'Gestor de tráfego': 'Meta Ads, Google Ads', 'Jornalista': 'Repórter, editor(a)', 'Fotógrafo': 'Casamentos, produtos',
  'Videomaker': 'Eventos, conteúdo para redes', 'Editor de vídeo': 'YouTube, publicidade', 'Produtor de conteúdo': 'Criador(a) de conteúdo, UGC',
  // construção e manutenção
  'Pedreiro': 'Encarregado, autônomo', 'Servente de obras': 'Ajudante geral', 'Mestre de obras': 'Obras residenciais', 'Engenheiro civil': 'Obra, projetos, fiscalização',
  'Arquiteto': 'Interiores, projetos residenciais', 'Pintor': 'Residencial, predial', 'Eletricista': 'Residencial, predial', 'Encanador': 'Autônomo, manutenção predial',
  'Marceneiro': 'Móveis planejados, autônomo', 'Instalador de ar-condicionado': 'Split, manutenção preventiva', 'Montador de móveis': 'Lojas, autônomo',
  // transporte
  'Motorista': 'Particular, executivo', 'Motorista de aplicativo': 'Uber, 99, turno da noite', 'Motorista de ônibus': 'Linha 123, urbano', 'Motorista de caminhão': 'Rota fixa, carreteiro',
  'Motoboy': 'Entregas da loja, iFood', 'Entregador': 'iFood, Mercado Livre', 'Mecânico automotivo': 'Chefe de oficina, autônomo', 'Frentista': 'Turno da manhã, caixa',
  // alimentação
  'Cozinheiro': 'Chefe de praça, cozinha industrial', 'Auxiliar de cozinha': 'Pré-preparo, restaurante', 'Chefe de cozinha': 'Restaurante próprio, eventos',
  'Garçom': 'Chefe de fila, eventos', 'Garçonete': 'Bar, restaurante', 'Padeiro': 'Forneiro, padaria artesanal', 'Confeiteiro': 'Auxiliar de cozinha, confeitaria artesanal',
  'Pizzaiolo': 'Forno a lenha, delivery', 'Churrasqueiro': 'Eventos, churrascaria', 'Salgadeiro': 'Encomendas, festas', 'Barista': 'Cafeteria, líder de turno', 'Bartender': 'Coquetelaria, eventos',
  // segurança e serviços gerais
  'Vigilante': 'Escala 12x36, posto bancário', 'Porteiro': 'Noturno, condomínio', 'Policial militar': 'Patrulhamento, 2º batalhão', 'Policial civil': 'Investigador(a), escrivão(ã)',
  'Bombeiro militar': 'Salvamento, 1º grupamento', 'Guarda municipal': 'Ronda escolar, trânsito', 'Zelador': 'Condomínio residencial', 'Faxineiro': 'Hospital, escritório',
  'Diarista': 'Faxina pesada, passadoria', 'Doméstica': 'Mensalista, folguista', 'Jardineiro': 'Condomínios, paisagismo',
  // beleza e serviços pessoais
  'Cabeleireiro': 'Colorista, salão próprio', 'Barbeiro': 'Barbearia própria, autônomo', 'Manicure': 'Alongamento em gel, a domicílio', 'Pedicure': 'Podologia, salão',
  'Maquiador': 'Noivas, maquiagem social', 'Esteticista': 'Facial, corporal', 'Designer de sobrancelhas': 'Henna, micropigmentação', 'Lash designer': 'Volume russo, autônoma',
  'Massoterapeuta': 'Relaxante, drenagem', 'Tatuador': 'Fine line, estúdio próprio', 'Costureiro': 'Ajustes, sob medida', 'Alfaiate': 'Ternos sob medida',
  // comércio
  'Vendedor': 'Loja de roupas, vendas externas', 'Atendente de loja': 'Shopping, turno da tarde', 'Operador de caixa': 'Supermercado, turno da manhã', 'Gerente de loja': 'Loja de rua, franquia',
  'Corretor de imóveis': 'Lançamentos, aluguel', 'Corretor de seguros': 'Auto, vida', 'Representante comercial': 'Zona sul, distribuidora', 'Feirante': 'Hortifrúti, barraca própria',
  // administração
  'Administrador': 'Coordenador(a) administrativo(a)', 'Recepcionista': 'Clínica, hotel', 'Secretário': 'Executiva, escolar', 'Contador': 'Fiscal, escritório próprio',
  'Analista de RH': 'Recrutamento, departamento pessoal', 'Empresário': 'Dono(a) de loja, sócio(a)', 'Analista financeiro': 'Contas a pagar, FP&A',
  // militar
  'Militar do Exército': 'Sargento, cabo, tenente', 'Militar da Marinha': 'Marinheiro, cabo, sargento', 'Militar da Aeronáutica': 'Sargento, controlador de voo',
  'Soldado': '1º batalhão, guarda', 'Cabo': 'Comandante de esquadra', 'Sargento': 'Furriel, comandante de grupo', 'Subtenente': 'Encarregado de pessoal',
  'Tenente': 'Comandante de pelotão', 'Capitão': 'Comandante de companhia', 'Policial federal': 'Agente, escrivão(ã)', 'Policial rodoviário': 'Fiscalização, plantão',
  // jurídico
  'Advogado': 'Trabalhista, sócio(a) do escritório', 'Juiz': 'Vara cível, 1ª instância', 'Promotor de justiça': 'Criminal, comarca', 'Estagiário de direito': 'Escritório, tribunal',
  // estudos
  'Estudante': '3º ano do ensino médio, técnico', 'Universitário': 'Direito, 5º período', 'Concurseiro': 'Polícia Federal, INSS', 'Vestibulando': 'Medicina, ENEM',
  // indústria e campo
  'Operador de máquinas': 'Turno A, CNC', 'Operador de produção': 'Linha 2, turno da noite', 'Técnico em segurança do trabalho': 'Obra, indústria',
  'Agricultor': 'Hortaliças, produção familiar', 'Pecuarista': 'Gado de leite, corte', 'Agrônomo': 'Consultoria, cooperativa',
};
const AREA = {
  'Administração e negócios': 'Analista júnior, coordenador(a)', 'Comércio e vendas': 'Vendedor(a) sênior, líder de loja', 'Saúde': 'Plantonista, coordenador(a) de equipe',
  'Educação': 'Professor(a) de matemática, coordenador(a)', 'Tecnologia e comunicação': 'Pleno, sênior, freelancer', 'Construção civil e manutenção': 'Encarregado(a), autônomo(a)',
  'Transporte e logística': 'Rota fixa, autônomo(a)', 'Alimentação e gastronomia': 'Auxiliar de cozinha, chefe de praça', 'Segurança e serviços gerais': 'Diurno, noturno, supervisor(a)',
  'Beleza, estética e serviços pessoais': 'Autônoma em salão, a domicílio', 'Indústria, agricultura e outras áreas': 'Operador(a) de linha, encarregado(a)', 'Militar': 'Comandante de pelotão, guarda',
  'Ciência e pesquisa': 'Pesquisador(a) de laboratório, bolsista', 'Jurídico': 'Associado(a), sócio(a)', 'Estudos': 'Curso e período, concurso',
};
export function roleHint(profession) {
  const p = String(profession || '').trim();
  if (!p) return 'Ex.: escolha a profissão acima';
  if (BY[p]) return `Ex.: ${BY[p]}`;
  const area = PROFESSIONS.find((x) => x.name.toLowerCase() === p.toLowerCase())?.area;
  return `Ex.: ${AREA[area] || 'Gerente, auxiliar, autônomo(a)'}`;
}
