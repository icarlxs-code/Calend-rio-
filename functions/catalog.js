/* Catálogo do Lembra: tipos de compromisso, perfis de trabalho (por área) e profissões.
   Sem dependências — usado pelo app e pelas regras de lembrete.
   Cada profissão aponta para um perfil ("arch"), que define:
   - como se chama a aba de trabalho (Empresas, Locais, Turmas, Obras, Clientes…)
   - quais tipos de compromisso aparecem no editor
   - as dicas do dia e o jeito das cobranças */

/* ---------- tipos de compromisso ----------
   kind: post | shoot | meeting | work | other (usado nas regras de agenda)
   onSite: acontece em outro lugar (conta deslocamento)
   offsets: avisos padrão (minutos antes) · ask: pergunta na hora · verb: o que fazer */
export const TYPE_DEFS = {
  // marketing / conteúdo
  feed: { label: 'Feed', icon: 'grid', color: '#2563EB', kind: 'post', dur: 15, ask: 'Já postou?', verb: 'publicar o feed', offsets: [60, 30, 0], words: ['feed', 'post', 'postagem', 'publicacao'] },
  carrossel: { label: 'Carrossel', icon: 'layers', color: '#0E7490', kind: 'post', dur: 15, ask: 'Já postou?', verb: 'publicar o carrossel', offsets: [60, 30, 0], words: ['carrossel', 'carousel'] },
  reels: { label: 'Reels', icon: 'play', color: '#9333EA', kind: 'post', dur: 15, ask: 'Já postou?', verb: 'postar o Reels', offsets: [60, 30, 0], words: ['reels', 'reel', 'video'] },
  story: { label: 'Story', icon: 'story', color: '#DB2777', kind: 'post', dur: 10, ask: 'Já postou?', verb: 'postar o story', offsets: [60, 30, 0], words: ['story', 'stories', 'storie'] },
  captacao: { label: 'Captação', icon: 'camera', color: '#EA580C', kind: 'shoot', dur: 120, onSite: true, ask: 'Já fez a captação?', verb: 'fazer a captação', offsets: [1440, 60, 30], words: ['captacao', 'gravacao', 'gravar', 'filmagem', 'fotos', 'captar'] },
  producao: { label: 'Edição', icon: 'scissors', color: '#475569', kind: 'work', dur: 90, ask: 'Já editou?', verb: 'fazer a edição', offsets: [60, 30, 0], words: ['edicao', 'editar', 'roteiro', 'producao'] },
  // gerais
  reuniao: { label: 'Reunião', icon: 'users', color: '#047857', kind: 'meeting', dur: 60, onSite: true, ask: 'A reunião aconteceu?', verb: 'ir à reunião', offsets: [1440, 60, 15], words: ['reuniao', 'call', 'encontro', 'alinhamento'] },
  tarefa: { label: 'Tarefa', icon: 'check', color: '#475569', kind: 'work', dur: 60, ask: 'Já fez?', verb: 'fazer a tarefa', offsets: [60, 15, 0], words: ['tarefa', 'fazer', 'resolver'] },
  prazo: { label: 'Prazo', icon: 'calclock', color: '#DC2626', kind: 'other', dur: 30, ask: 'Já entregou?', verb: 'entregar', offsets: [2880, 1440, 120, 0], words: ['prazo', 'entrega final', 'deadline', 'vencimento'] },
  treinamento: { label: 'Treinamento', icon: 'presentation', color: '#0891B2', kind: 'meeting', dur: 120, onSite: true, ask: 'Foi ao treinamento?', verb: 'ir ao treinamento', offsets: [1440, 60, 15], words: ['treinamento', 'capacitacao', 'curso'] },
  estudo: { label: 'Estudo', icon: 'book', color: '#2563EB', kind: 'work', dur: 60, ask: 'Estudou?', verb: 'estudar', offsets: [30, 0], words: ['estudo', 'estudar', 'revisao', 'leitura'] },
  pagamento: { label: 'Pagamento', icon: 'cash', color: '#0D9488', kind: 'other', dur: 15, ask: 'Pagamento feito?', verb: 'fazer o pagamento', offsets: [1440, 120, 0], words: ['pagamento', 'pagar', 'boleto', 'fatura', 'cobranca', 'receber'] },
  documento: { label: 'Documento', icon: 'note', color: '#CA8A04', kind: 'other', dur: 30, ask: 'Resolveu?', verb: 'resolver o documento', offsets: [10080, 1440, 120], words: ['documento', 'cnh', 'ipva', 'licenciamento', 'certidao', 'renovar'] },
  relatorio: { label: 'Relatório', icon: 'chart', color: '#4F46E5', kind: 'work', dur: 90, ask: 'Relatório pronto?', verb: 'fazer o relatório', offsets: [1440, 60, 0], words: ['relatorio', 'planilha', 'fechamento'] },
  entrega: { label: 'Entrega', icon: 'package', color: '#16A34A', kind: 'other', dur: 30, onSite: true, ask: 'Entregou?', verb: 'fazer a entrega', offsets: [120, 30, 0], words: ['entrega', 'entregar'] },
  compra: { label: 'Compra', icon: 'shoppingbag', color: '#4F46E5', kind: 'other', dur: 45, onSite: true, ask: 'Comprou?', verb: 'fazer a compra', offsets: [120, 30], words: ['compra', 'comprar', 'material', 'insumo', 'mercado'] },
  outro: { label: 'Outro', icon: 'dot', color: '#71717A', kind: 'other', dur: 30, ask: 'Já fez?', verb: 'fazer', offsets: [60, 30, 0], words: ['outro'] },
  // saúde
  consulta: { label: 'Consulta', icon: 'stethoscope', color: '#0284C7', kind: 'meeting', dur: 30, ask: 'Já atendeu?', verb: 'atender', offsets: [60, 15, 0], words: ['consulta', 'atender', 'paciente', 'atendimento'] },
  retorno: { label: 'Retorno', icon: 'repeat', color: '#0EA5E9', kind: 'meeting', dur: 20, ask: 'Atendeu o retorno?', verb: 'atender o retorno', offsets: [60, 15, 0], words: ['retorno'] },
  procedimento: { label: 'Procedimento', icon: 'bandage', color: '#DB2777', kind: 'work', dur: 60, onSite: true, ask: 'Procedimento feito?', verb: 'fazer o procedimento', offsets: [120, 30, 0], words: ['procedimento', 'curativo', 'sessao'] },
  cirurgia: { label: 'Cirurgia', icon: 'medcross', color: '#B91C1C', kind: 'work', dur: 180, onSite: true, ask: 'Cirurgia feita?', verb: 'ir para a cirurgia', offsets: [1440, 120, 60], words: ['cirurgia', 'operacao'] },
  exame: { label: 'Exame', icon: 'microscope', color: '#7C3AED', kind: 'meeting', dur: 30, ask: 'Exame feito?', verb: 'fazer o exame', offsets: [1440, 60, 15], words: ['exame', 'laudo', 'coleta'] },
  plantao: { label: 'Plantão', icon: 'hospital', color: '#0F766E', kind: 'work', dur: 720, onSite: true, ask: 'Chegou ao plantão?', verb: 'começar o plantão', offsets: [1440, 120, 60], words: ['plantao', 'escala', '12x36', 'turno'] },
  medicacao: { label: 'Medicação', icon: 'pill', color: '#E11D48', kind: 'other', dur: 10, ask: 'Medicação aplicada?', verb: 'aplicar a medicação', offsets: [15, 5, 0], words: ['medicacao', 'remedio', 'dose', 'aplicar'] },
  visitadom: { label: 'Visita domiciliar', icon: 'ambulance', color: '#0D9488', kind: 'meeting', dur: 60, onSite: true, ask: 'Fez a visita?', verb: 'fazer a visita', offsets: [120, 30], words: ['visita domiciliar', 'domicilio'] },
  // educação
  aula: { label: 'Aula', icon: 'chalkboard', color: '#2563EB', kind: 'work', dur: 50, onSite: true, ask: 'Aula dada?', verb: 'dar a aula', offsets: [60, 15], words: ['aula', 'turma', 'lecionar'] },
  prova: { label: 'Prova', icon: 'pencil', color: '#DC2626', kind: 'work', dur: 100, onSite: true, ask: 'Prova aplicada?', verb: 'aplicar a prova', offsets: [2880, 1440, 60], words: ['prova', 'avaliacao', 'teste', 'simulado'] },
  correcao: { label: 'Correção', icon: 'clipcheck', color: '#7C3AED', kind: 'work', dur: 120, ask: 'Correções feitas?', verb: 'corrigir', offsets: [1440, 60, 0], words: ['correcao', 'corrigir', 'notas', 'diario'] },
  planejamento: { label: 'Planejamento', icon: 'book', color: '#0E9F6E', kind: 'work', dur: 90, ask: 'Planejamento feito?', verb: 'planejar', offsets: [60, 0], words: ['planejamento', 'planejar', 'plano de aula'] },
  evento: { label: 'Evento', icon: 'gradcap', color: '#7C3AED', kind: 'work', dur: 240, onSite: true, ask: 'O evento aconteceu?', verb: 'ir ao evento', offsets: [1440, 180, 60], words: ['evento', 'festa', 'apresentacao', 'reuniao de pais'] },
  // obra / serviços
  visita: { label: 'Visita', icon: 'hardhat', color: '#EA580C', kind: 'meeting', dur: 90, onSite: true, ask: 'Fez a visita?', verb: 'fazer a visita', offsets: [1440, 60, 30], words: ['visita', 'obra', 'cliente'] },
  vistoria: { label: 'Vistoria', icon: 'ruler', color: '#CA8A04', kind: 'meeting', dur: 60, onSite: true, ask: 'Vistoria feita?', verb: 'fazer a vistoria', offsets: [1440, 60, 30], words: ['vistoria', 'medicao', 'inspecao de obra'] },
  orcamento: { label: 'Orçamento', icon: 'calcl', color: '#0D9488', kind: 'work', dur: 60, ask: 'Orçamento enviado?', verb: 'enviar o orçamento', offsets: [120, 0], words: ['orcamento', 'cotacao', 'proposta de preco'] },
  servico: { label: 'Serviço', icon: 'hammer', color: '#EA580C', kind: 'work', dur: 120, onSite: true, ask: 'Serviço concluído?', verb: 'fazer o serviço', offsets: [1440, 60, 30], words: ['servico', 'instalacao', 'conserto', 'reparo', 'diaria', 'limpeza'] },
  // indústria / operação
  turno: { label: 'Turno', icon: 'factory', color: '#475569', kind: 'work', dur: 480, onSite: true, ask: 'Começou o turno?', verb: 'começar o turno', offsets: [120, 60, 15], words: ['turno', 'expediente', 'jornada'] },
  manutencao: { label: 'Manutenção', icon: 'cog', color: '#EA580C', kind: 'work', dur: 90, onSite: true, ask: 'Manutenção feita?', verb: 'fazer a manutenção', offsets: [1440, 60, 15], words: ['manutencao', 'revisao', 'troca de oleo', 'preventiva'] },
  inspecao: { label: 'Inspeção', icon: 'clipcheck', color: '#CA8A04', kind: 'work', dur: 60, onSite: true, ask: 'Inspeção feita?', verb: 'fazer a inspeção', offsets: [60, 15], words: ['inspecao', 'auditoria', 'checklist', 'dds'] },
  meta: { label: 'Meta', icon: 'target', color: '#DC2626', kind: 'other', dur: 30, ask: 'Bateu a meta?', verb: 'bater a meta', offsets: [1440, 240], words: ['meta', 'objetivo', 'fechamento do mes'] },
  // segurança / militar
  escala: { label: 'Serviço/Escala', icon: 'star', color: '#1E3A8A', kind: 'work', dur: 720, onSite: true, ask: 'Assumiu o serviço?', verb: 'assumir o serviço', offsets: [1440, 180, 60], words: ['escala', 'servico', 'plantao', 'guarda', 'ronda'] },
  instrucao: { label: 'Instrução', icon: 'flag2', color: '#0F766E', kind: 'meeting', dur: 120, onSite: true, ask: 'Foi à instrução?', verb: 'ir à instrução', offsets: [1440, 60, 15], words: ['instrucao', 'aula', 'curso'] },
  missao: { label: 'Missão', icon: 'target', color: '#B91C1C', kind: 'work', dur: 240, onSite: true, ask: 'Missão cumprida?', verb: 'cumprir a missão', offsets: [1440, 120, 60], words: ['missao', 'operacao', 'diligencia'] },
  formatura: { label: 'Formatura', icon: 'chevrons', color: '#4F46E5', kind: 'meeting', dur: 60, onSite: true, ask: 'Esteve na formatura?', verb: 'ir à formatura', offsets: [1440, 90, 30], words: ['formatura', 'parada', 'cerimonia'] },
  treino: { label: 'Treino físico', icon: 'dumbbell', color: '#16A34A', kind: 'work', dur: 60, ask: 'Treinou?', verb: 'treinar', offsets: [60, 15], words: ['treino', 'taf', 'academia', 'corrida', 'teste fisico'] },
  // vendas / atendimento
  followup: { label: 'Retorno ao cliente', icon: 'phone', color: '#0EA5E9', kind: 'other', dur: 15, ask: 'Retornou o contato?', verb: 'retornar o contato', offsets: [30, 0], words: ['follow', 'followup', 'retornar', 'ligar', 'mensagem'] },
  proposta: { label: 'Proposta', icon: 'handshake', color: '#7C3AED', kind: 'other', dur: 60, ask: 'Proposta enviada?', verb: 'enviar a proposta', offsets: [120, 0], words: ['proposta', 'contrato'] },
  atendimento: { label: 'Atendimento', icon: 'brush', color: '#DB2777', kind: 'meeting', dur: 60, ask: 'Atendeu?', verb: 'atender', offsets: [60, 15, 0], words: ['atendimento', 'cliente', 'corte', 'unha', 'escova', 'sessao', 'horario'] },
  encomenda: { label: 'Encomenda', icon: 'package', color: '#DB2777', kind: 'work', dur: 60, ask: 'Encomenda pronta?', verb: 'aprontar a encomenda', offsets: [1440, 120, 60], words: ['encomenda', 'pedido', 'bolo', 'salgado'] },
  // tecnologia
  deploy: { label: 'Deploy', icon: 'rocket', color: '#7C3AED', kind: 'work', dur: 60, ask: 'Deploy feito?', verb: 'fazer o deploy', offsets: [60, 15], words: ['deploy', 'publicar', 'release', 'lancamento'] },
  // jurídico / ciência
  audiencia: { label: 'Audiência', icon: 'gavel', color: '#1E3A8A', kind: 'meeting', dur: 90, onSite: true, ask: 'Foi à audiência?', verb: 'ir à audiência', offsets: [2880, 1440, 120, 60], words: ['audiencia', 'julgamento', 'forum', 'pericia'] },
  experimento: { label: 'Experimento', icon: 'flask', color: '#7C3AED', kind: 'work', dur: 120, onSite: true, ask: 'Experimento feito?', verb: 'fazer o experimento', offsets: [60, 15], words: ['experimento', 'analise', 'laboratorio', 'ensaio', 'amostra'] },
  // agro
  plantio: { label: 'Plantio', icon: 'sprout', color: '#16A34A', kind: 'work', dur: 240, onSite: true, ask: 'Plantou?', verb: 'fazer o plantio', offsets: [1440, 60], words: ['plantio', 'plantar', 'semeadura'] },
  colheita: { label: 'Colheita', icon: 'wheat', color: '#CA8A04', kind: 'work', dur: 300, onSite: true, ask: 'Colheu?', verb: 'fazer a colheita', offsets: [1440, 60], words: ['colheita', 'colher'] },
  manejo: { label: 'Manejo/Animais', icon: 'paw', color: '#0D9488', kind: 'work', dur: 120, onSite: true, ask: 'Manejo feito?', verb: 'fazer o manejo', offsets: [1440, 60], words: ['manejo', 'vacina', 'vacinacao', 'animais', 'gado', 'ordenha'] },
  feira: { label: 'Feira', icon: 'store', color: '#EA580C', kind: 'work', dur: 300, onSite: true, ask: 'Foi à feira?', verb: 'ir à feira', offsets: [1440, 120], words: ['feira', 'mercado'] },
};

/* ---------- perfis de trabalho ---------- */
const A = (o) => o;
export const ARCHETYPES = {
  marketing: A({
    name: 'Marketing e conteúdo', entity: { one: 'Empresa', many: 'Empresas', icon: 'building', hint: 'clientes que você atende' }, clientLike: true,
    types: ['feed', 'story', 'reels', 'carrossel', 'captacao', 'reuniao', 'producao', 'outro'],
    tips: [
      'Programe os posts na véspera: nenhum horário fica dependendo de você estar com o celular na mão.',
      'Faça a captação de vários conteúdos numa visita só: feed, Reels e material para stories.',
      'Reserve um bloco fixo na semana para planejar a pauta de todos os clientes.',
      'Mande o cronograma da semana para o cliente aprovar até sexta. Menos retrabalho.',
      'Depois de postar, fique 15–20 min respondendo comentários: ajuda o alcance.',
      'Agrupe tarefas parecidas: edite todos os Reels juntos, escreva todas as legendas juntas.',
      'Tenha 2 ou 3 posts reserva por cliente para dias imprevisíveis.',
    ],
  }),
  saude_clinica: A({
    name: 'Saúde — consultório e clínica', entity: { one: 'Local', many: 'Locais', icon: 'hospital', hint: 'consultórios, clínicas e hospitais onde atende' },
    types: ['consulta', 'retorno', 'procedimento', 'exame', 'cirurgia', 'plantao', 'reuniao', 'estudo', 'outro'],
    tips: [
      'Deixe 10 minutos entre consultas para registrar o prontuário: o atraso não vira bola de neve.',
      'Confirme as consultas do dia seguinte até as 18h: reduz faltas em até um terço.',
      'Agrupe retornos no mesmo turno da semana: fica mais fácil de lembrar e de remarcar.',
      'Reserve um bloco fixo por semana para estudo e atualização — trate como uma consulta.',
      'Antes de um plantão, durma ao menos 6 horas e deixe a refeição pronta.',
      'Anote no Lembra os laudos e exames pendentes com prazo: nada fica esquecido.',
    ],
  }),
  saude_plantao: A({
    name: 'Saúde — plantão e cuidado', entity: { one: 'Local', many: 'Locais', icon: 'hospital', hint: 'hospitais, UPAs, casas de pacientes' },
    types: ['plantao', 'medicacao', 'procedimento', 'visitadom', 'treinamento', 'reuniao', 'outro'],
    tips: [
      'Marque as medicações com horário exato: o Lembra avisa 15 e 5 minutos antes.',
      'No dia anterior ao plantão, separe uniforme, crachá e marmita à noite.',
      'Use a passagem de plantão para anotar no Lembra o que ficou pendente.',
      'Depois de um plantão noturno, proteja seu sono: nada marcado nas 6 horas seguintes.',
      'Beba água a cada pausa: plantão longo desidrata sem você perceber.',
      'Revise suas escalas do mês no domingo e marque todas de uma vez.',
    ],
  }),
  educacao: A({
    name: 'Educação', entity: { one: 'Turma', many: 'Turmas', icon: 'chalkboard', hint: 'turmas ou escolas' },
    types: ['aula', 'prova', 'correcao', 'planejamento', 'reuniao', 'prazo', 'evento', 'outro'],
    tips: [
      'Planeje as aulas da semana num bloco só, de preferência no domingo ou na segunda cedo.',
      'Corrija provas em lotes de 10 com pausas: rende mais e cansa menos.',
      'Marque o prazo de lançamento de notas como Prazo: o Lembra avisa 2 dias antes.',
      'Deixe um plano B de aula pronto para dias de imprevisto.',
      'Anote as reuniões de pais e conselhos de classe assim que saírem no calendário da escola.',
      'Reserve 15 minutos no fim do dia para organizar o material de amanhã.',
    ],
  }),
  obra: A({
    name: 'Construção e obras', entity: { one: 'Obra', many: 'Obras', icon: 'hardhat', hint: 'obras e clientes' }, clientLike: true,
    types: ['visita', 'servico', 'vistoria', 'orcamento', 'compra', 'entrega', 'reuniao', 'prazo', 'outro'],
    tips: [
      'Compre o material na véspera: obra parada esperando material custa caro.',
      'Mande o orçamento no mesmo dia da visita: quem responde primeiro fecha mais.',
      'Agrupe as visitas por bairro para economizar deslocamento.',
      'Fotografe o antes e o depois de cada serviço e guarde junto da obra.',
      'Confirme com o cliente o horário de chegada um dia antes.',
      'Anote prazos de entrega com folga de 1 dia para imprevistos de chuva e material.',
    ],
  }),
  servicos_tecnicos: A({
    name: 'Serviços técnicos e manutenção', entity: { one: 'Cliente', many: 'Clientes', icon: 'wrench', hint: 'clientes que você atende' }, clientLike: true,
    types: ['servico', 'visita', 'orcamento', 'retorno', 'compra', 'pagamento', 'outro'],
    tips: [
      'Confirme o endereço e o horário com o cliente um dia antes do serviço.',
      'Separe as peças e ferramentas na noite anterior.',
      'Marque um retorno 30 dias depois do serviço: cliente lembrado volta a chamar.',
      'Mande o orçamento por escrito no mesmo dia.',
      'Agrupe atendimentos da mesma região no mesmo período do dia.',
      'Anote os pagamentos a receber com data: o Lembra te cobra para você cobrar.',
    ],
  }),
  industria: A({
    name: 'Indústria e produção', entity: { one: 'Setor', many: 'Setores', icon: 'factory', hint: 'linhas, máquinas ou setores' },
    types: ['turno', 'manutencao', 'inspecao', 'treinamento', 'meta', 'reuniao', 'relatorio', 'outro'],
    tips: [
      'Registre as manutenções preventivas com antecedência: máquina parada custa caro.',
      'Faça o checklist de segurança no início de cada turno.',
      'Anote as metas do turno e confira no meio do expediente.',
      'Marque os treinamentos obrigatórios (NRs) com aviso de 1 dia antes.',
      'Use a passagem de turno para registrar o que ficou pendente.',
      'Depois do turno da noite, proteja o seu sono antes de marcar compromissos.',
    ],
  }),
  seguranca_militar: A({
    name: 'Segurança e carreira militar', entity: { one: 'Unidade', many: 'Unidades', icon: 'shield', hint: 'batalhão, quartel, posto ou unidade' },
    types: ['escala', 'instrucao', 'missao', 'formatura', 'treino', 'documento', 'reuniao', 'outro'],
    tips: [
      'Lance a escala do mês inteira no Lembra assim que ela sair.',
      'Na véspera do serviço, deixe farda, documentos e equipamento separados.',
      'Treino físico marcado como compromisso: TAF não se prepara na última semana.',
      'Anote prazos de documentos e cursos com aviso de uma semana.',
      'Depois de serviço noturno, descanse antes de qualquer compromisso.',
      'Revise no domingo as instruções e formaturas da semana.',
    ],
  }),
  vendas: A({
    name: 'Comércio e vendas', entity: { one: 'Cliente', many: 'Clientes', icon: 'store', hint: 'clientes e contas' }, clientLike: true,
    types: ['visita', 'followup', 'proposta', 'reuniao', 'meta', 'turno', 'entrega', 'outro'],
    tips: [
      'Retorne o contato de quem pediu orçamento em até 24 horas: a chance de fechar cai muito depois disso.',
      'Marque um follow-up 3 dias depois de cada proposta enviada.',
      'Divida a meta do mês por dia e confira todo fim de tarde.',
      'Agrupe visitas por região para atender mais clientes no mesmo dia.',
      'Anote o aniversário dos melhores clientes no Pessoal: um parabéns vende.',
      'Reserve um horário fixo por dia só para prospectar.',
    ],
  }),
  administrativo: A({
    name: 'Administração e escritório', entity: { one: 'Projeto', many: 'Projetos', icon: 'briefcase', hint: 'projetos, áreas ou clientes' },
    types: ['reuniao', 'prazo', 'tarefa', 'pagamento', 'relatorio', 'entrega', 'followup', 'outro'],
    tips: [
      'Comece o dia pelas 3 tarefas mais importantes, antes de abrir o e-mail.',
      'Marque prazos com aviso de 2 dias antes: dá tempo de pedir o que falta.',
      'Agrupe reuniões no mesmo período e proteja um bloco sem interrupções.',
      'Pagamentos e fechamentos: cadastre como recorrentes uma vez e esqueça.',
      'Termine o dia anotando o que fica para amanhã.',
      'Revise a semana toda segunda de manhã em 15 minutos.',
    ],
  }),
  tecnologia: A({
    name: 'Tecnologia', entity: { one: 'Projeto', many: 'Projetos', icon: 'laptop', hint: 'projetos, produtos ou clientes' },
    types: ['tarefa', 'reuniao', 'prazo', 'deploy', 'estudo', 'entrega', 'outro'],
    tips: [
      'Bloqueie 2 horas seguidas de foco por dia, sem reunião.',
      'Marque o deploy com antecedência e evite sexta à tarde.',
      'Divida tarefas grandes em partes de até meio dia.',
      'Reserve um horário fixo na semana para estudo.',
      'Anote os prazos com folga para testes e revisão.',
      'Faça pausas curtas a cada 50 minutos de tela.',
    ],
  }),
  transporte: A({
    name: 'Transporte e entregas', entity: { one: 'Plataforma', many: 'Plataformas', icon: 'truck', hint: 'empresas ou apps em que trabalha' },
    types: ['turno', 'entrega', 'manutencao', 'documento', 'pagamento', 'meta', 'outro'],
    tips: [
      'Marque revisão e troca de óleo pela data: carro parado é dia sem ganho.',
      'CNH, IPVA e licenciamento: cadastre o vencimento com aviso de uma semana.',
      'Defina uma meta de ganho por dia e confira no fim do turno.',
      'Trabalhe nos horários de maior demanda da sua cidade e descanse nos fracos.',
      'Beba água e faça pausas: horas seguidas no volante cansam mais do que parece.',
      'Separe todo dia uma parte do ganho para manutenção e combustível.',
    ],
  }),
  gastronomia: A({
    name: 'Alimentação e gastronomia', entity: { one: 'Cliente', many: 'Clientes', icon: 'chefhat', hint: 'clientes, eventos ou locais' }, clientLike: true,
    types: ['turno', 'encomenda', 'evento', 'compra', 'entrega', 'pagamento', 'outro'],
    tips: [
      'Compre os insumos na véspera das encomendas grandes.',
      'Marque o horário de começar a produção, não só o de entrega.',
      'Confirme encomendas e eventos com o cliente 1 dia antes.',
      'Faça a lista de compras da semana em um dia fixo.',
      'Anote a validade dos insumos que vencem logo.',
      'Cobre o sinal da encomenda e marque a data do restante.',
    ],
  }),
  beleza: A({
    name: 'Beleza e cuidados pessoais', entity: { one: 'Cliente', many: 'Clientes', icon: 'brush', hint: 'seus clientes' }, clientLike: true,
    types: ['atendimento', 'retorno', 'encomenda', 'compra', 'pagamento', 'estudo', 'outro'],
    tips: [
      'Confirme os atendimentos de amanhã por mensagem até as 19h: reduz faltas.',
      'Marque o retorno de cada cliente no tempo certo (unha 15 dias, corte 30 dias).',
      'Deixe 10 minutos entre atendimentos para limpar e organizar.',
      'Anote os produtos que estão acabando e compre antes de faltar.',
      'Separe um horário por semana para postar seus trabalhos.',
      'Cobre um sinal para horários disputados (sábado, véspera de feriado).',
    ],
  }),
  agro: A({
    name: 'Agro e campo', entity: { one: 'Área', many: 'Áreas', icon: 'tractor', hint: 'sítio, fazenda, talhão ou criação' },
    types: ['plantio', 'colheita', 'manejo', 'manutencao', 'feira', 'compra', 'pagamento', 'outro'],
    tips: [
      'Marque as vacinas e o manejo dos animais com aviso de 1 dia antes.',
      'Faça a manutenção das máquinas antes da safra, não durante.',
      'Anote as datas de plantio e a previsão de colheita de cada área.',
      'Compre insumos com antecedência: no pico da safra o preço sobe.',
      'Confira a previsão do tempo antes de marcar serviço no campo.',
      'Registre os pagamentos de safra e financiamento com aviso.',
    ],
  }),
  servicos_gerais: A({
    name: 'Serviços gerais', entity: { one: 'Local', many: 'Locais', icon: 'home', hint: 'casas, condomínios ou empresas' }, clientLike: true,
    types: ['turno', 'servico', 'compra', 'pagamento', 'documento', 'outro'],
    tips: [
      'Marque as diárias da semana logo que combinar com os clientes.',
      'Anote o endereço e o que levar em cada serviço.',
      'Cobre na data combinada: cadastre os recebimentos como Pagamento.',
      'Separe os produtos e materiais na noite anterior.',
      'Deixe um intervalo entre um serviço e outro para o deslocamento.',
      'Cuide do corpo: alongue antes e depois do trabalho pesado.',
    ],
  }),
  juridico: A({
    name: 'Jurídico', entity: { one: 'Cliente', many: 'Clientes', icon: 'scale', hint: 'clientes e processos' }, clientLike: true,
    types: ['audiencia', 'prazo', 'reuniao', 'documento', 'followup', 'pagamento', 'outro'],
    tips: [
      'Cadastre o prazo processual no mesmo dia da intimação, com aviso de 2 dias antes.',
      'Revise a pauta de audiências da semana toda segunda.',
      'Dê retorno ao cliente sobre o andamento a cada 15 dias.',
      'Bloqueie um período diário só para peças e petições.',
      'Na véspera da audiência, separe documentos e testemunhas.',
      'Registre honorários a receber com data.',
    ],
  }),
  ciencia: A({
    name: 'Ciência e pesquisa', entity: { one: 'Projeto', many: 'Projetos', icon: 'microscope', hint: 'projetos, laboratórios ou missões' },
    types: ['experimento', 'reuniao', 'prazo', 'relatorio', 'estudo', 'treinamento', 'outro'],
    tips: [
      'Marque cada etapa do experimento com horário: incubação e coleta não esperam.',
      'Reserve blocos longos para análise de dados, sem interrupções.',
      'Cadastre os prazos de editais, relatórios e artigos com aviso de 2 dias.',
      'Anote os resultados no mesmo dia, enquanto está fresco.',
      'Revise a semana do laboratório toda segunda de manhã.',
      'Faça pausas: concentração longa cansa e aumenta o erro.',
    ],
  }),
  estudante: A({
    name: 'Estudos', entity: { one: 'Matéria', many: 'Matérias', icon: 'gradcap', hint: 'matérias, cursos ou disciplinas' },
    types: ['aula', 'prova', 'estudo', 'prazo', 'reuniao', 'outro'],
    tips: [
      'Estude em blocos de 25–50 minutos com pausas curtas.',
      'Marque a data das provas assim que saírem, com aviso de 2 dias.',
      'Revise a matéria no mesmo dia da aula: você lembra muito mais.',
      'Divida trabalhos grandes em partes com prazos próprios.',
      'Durma bem antes da prova: vale mais que virar a noite.',
      'Reserve um horário fixo por dia para estudar.',
    ],
  }),
  generico: A({
    name: 'Outras áreas', entity: { one: 'Projeto', many: 'Projetos', icon: 'briefcase', hint: 'projetos, clientes ou áreas' },
    types: ['tarefa', 'reuniao', 'prazo', 'visita', 'pagamento', 'estudo', 'outro'],
    tips: [
      'Comece o dia pelas 3 tarefas mais importantes.',
      'Marque prazos com aviso de 2 dias antes.',
      'Agrupe compromissos parecidos no mesmo período.',
      'Termine o dia anotando o que fica para amanhã.',
      'Revise a semana toda segunda de manhã.',
      'Proteja um bloco de tempo sem interrupções todo dia.',
    ],
  }),
};

/* ---------- profissões (nome → perfil) ---------- */
const P = (area, arch, names) => names.map((name) => ({ name, area, arch }));
export const PROFESSIONS = [
  ...P('Administração e negócios', 'administrativo', ['Administrador', 'Assistente administrativo', 'Auxiliar administrativo', 'Secretário', 'Recepcionista', 'Gerente comercial', 'Gerente de vendas', 'Analista financeiro', 'Contador', 'Auxiliar contábil', 'Analista de RH', 'Assistente de RH', 'Comprador', 'Almoxarife', 'Supervisor operacional', 'Empresário', 'Consultor empresarial', 'Analista de logística', 'Auxiliar de escritório', 'Diretor comercial']),
  ...P('Comércio e vendas', 'vendas', ['Vendedor', 'Atendente de loja', 'Operador de caixa', 'Gerente de loja', 'Promotor de vendas', 'Representante comercial', 'Consultor de vendas', 'Corretor de imóveis', 'Corretor de seguros', 'Atendente de supermercado', 'Repositor de mercadorias', 'Estoquista', 'Fiscal de loja', 'Supervisor de vendas', 'Gerente de supermercado', 'Vendedor de veículos', 'Vendedor ambulante', 'Feirante', 'Balconista', 'Telemarketing']),
  ...P('Saúde', 'saude_clinica', ['Médico', 'Dentista', 'Psicólogo', 'Fisioterapeuta', 'Nutricionista', 'Fonoaudiólogo', 'Veterinário', 'Biomédico', 'Radiologista', 'Terapeuta ocupacional', 'Farmacêutico']),
  ...P('Saúde', 'saude_plantao', ['Enfermeiro', 'Técnico de enfermagem', 'Auxiliar de enfermagem', 'Técnico em radiologia', 'Cuidador de idosos', 'Agente comunitário de saúde', 'Socorrista', 'Instrumentador cirúrgico', 'Recepcionista hospitalar']),
  ...P('Educação', 'educacao', ['Professor', 'Professor de educação infantil', 'Professor de ensino fundamental', 'Professor de ensino médio', 'Professor universitário', 'Pedagogo', 'Diretor escolar', 'Coordenador pedagógico', 'Auxiliar de creche', 'Monitor escolar', 'Instrutor de cursos', 'Professor de idiomas', 'Professor de educação física', 'Bibliotecário', 'Psicopedagogo']),
  ...P('Tecnologia e comunicação', 'tecnologia', ['Programador', 'Desenvolvedor de software', 'Desenvolvedor web', 'Analista de sistemas', 'Analista de suporte técnico', 'Técnico de informática', 'Analista de dados']),
  ...P('Tecnologia e comunicação', 'marketing', ['Designer gráfico', 'Web designer', 'Analista de marketing', 'Social media', 'Gestor de tráfego', 'Jornalista', 'Fotógrafo', 'Videomaker', 'Editor de vídeo', 'Redator', 'Copywriter', 'Publicitário', 'Produtor de conteúdo']),
  ...P('Construção civil e manutenção', 'obra', ['Pedreiro', 'Servente de obras', 'Mestre de obras', 'Engenheiro civil', 'Arquiteto', 'Pintor', 'Gesseiro', 'Azulejista', 'Técnico em edificações', 'Carpinteiro', 'Serralheiro', 'Vidraceiro']),
  ...P('Construção civil e manutenção', 'servicos_tecnicos', ['Eletricista', 'Encanador', 'Marceneiro', 'Instalador de ar-condicionado', 'Técnico em refrigeração', 'Bombeiro hidráulico', 'Soldador', 'Montador de móveis']),
  ...P('Transporte e logística', 'transporte', ['Motorista', 'Motorista de aplicativo', 'Motorista de ônibus', 'Motorista de caminhão', 'Motoboy', 'Entregador', 'Taxista', 'Mototaxista', 'Operador de empilhadeira', 'Conferente de mercadorias', 'Auxiliar de logística', 'Agente de cargas', 'Frentista']),
  ...P('Transporte e logística', 'servicos_tecnicos', ['Mecânico automotivo', 'Mecânico de motos']),
  ...P('Alimentação e gastronomia', 'gastronomia', ['Cozinheiro', 'Auxiliar de cozinha', 'Chefe de cozinha', 'Garçom', 'Garçonete', 'Atendente de lanchonete', 'Padeiro', 'Confeiteiro', 'Pizzaiolo', 'Churrasqueiro', 'Açougueiro', 'Salgadeiro', 'Barista', 'Bartender', 'Nutricionista de produção']),
  ...P('Segurança e serviços gerais', 'seguranca_militar', ['Vigilante', 'Porteiro', 'Controlador de acesso', 'Segurança patrimonial', 'Bombeiro civil', 'Policial militar', 'Policial civil', 'Guarda municipal', 'Agente penitenciário', 'Bombeiro militar', 'Porteiro de condomínio']),
  ...P('Segurança e serviços gerais', 'servicos_gerais', ['Zelador', 'Faxineiro', 'Auxiliar de limpeza', 'Diarista', 'Doméstica', 'Jardineiro', 'Piscineiro', 'Lavador de carros', 'Manobrista']),
  ...P('Beleza, estética e serviços pessoais', 'beleza', ['Cabeleireiro', 'Barbeiro', 'Manicure', 'Pedicure', 'Maquiador', 'Esteticista', 'Depilador', 'Designer de sobrancelhas', 'Lash designer', 'Massoterapeuta', 'Tatuador', 'Body piercer', 'Costureiro', 'Alfaiate', 'Lavadeiro']),
  ...P('Indústria, agricultura e outras áreas', 'industria', ['Operador de máquinas', 'Operador de produção', 'Auxiliar de produção', 'Técnico em segurança do trabalho', 'Engenheiro de produção', 'Mecânico industrial', 'Torneiro mecânico', 'Eletricista industrial', 'Técnico em automação industrial', 'Engenheiro industrial', 'Engenheiro mecânico', 'Engenheiro eletricista']),
  ...P('Indústria, agricultura e outras áreas', 'agro', ['Agricultor', 'Pecuarista', 'Trabalhador rural', 'Tratorista', 'Agrônomo', 'Técnico agrícola', 'Pescador', 'Apicultor']),
  ...P('Indústria, agricultura e outras áreas', 'gastronomia', ['Florista', 'Artesão']),
  ...P('Indústria, agricultura e outras áreas', 'servicos_gerais', ['Catador de materiais recicláveis']),
  // além da lista: carreiras que aparecem bastante
  ...P('Militar', 'seguranca_militar', ['Militar do Exército', 'Militar da Marinha', 'Militar da Aeronáutica', 'Soldado', 'Cabo', 'Sargento', 'Subtenente', 'Tenente', 'Capitão', 'Policial federal', 'Policial rodoviário']),
  ...P('Ciência e pesquisa', 'ciencia', ['Bioquímico', 'Químico', 'Biólogo', 'Físico', 'Pesquisador', 'Cientista de dados', 'Astronauta', 'Engenheiro aeroespacial']),
  ...P('Jurídico', 'juridico', ['Advogado', 'Juiz', 'Promotor de justiça', 'Defensor público', 'Escrivão', 'Oficial de justiça', 'Estagiário de direito']),
  ...P('Estudos', 'estudante', ['Estudante', 'Universitário', 'Concurseiro', 'Vestibulando']),
];

const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
/* Perfil de uma profissão (também para profissões digitadas à mão) */
export function archOf(profession) {
  const n = norm(profession);
  if (!n) return 'generico';
  const exact = PROFESSIONS.find((p) => norm(p.name) === n);
  if (exact) return exact.arch;
  const KEYS = [
    [/medic|dentist|psicolog|fisioter|nutricion|fono|veterin|clinic|odonto|cardio|pediatr|dermat/, 'saude_clinica'],
    [/enferm|plantao|socorr|cuidador|hospital|samu/, 'saude_plantao'],
    [/professor|docente|pedagog|escola|educador|tutor/, 'educacao'],
    [/program|desenvolv|software|sistemas|\bti\b|dados|devops|suporte|computa/, 'tecnologia'],
    [/quimic|biolog|fisic|pesquis|cientist|laborat|astronaut|aeroespac|geolog|oceanograf/, 'ciencia'],
    [/advog|juiz|jurid|promotor|direito|cartor/, 'juridico'],
    [/engenheiro civil|engenheira civil|arquitet|obra|pedreiro|constru|edifica/, 'obra'],
    [/militar|soldado|\bcabo\b|sargento|tenente|capitao|policia|bombeiro|vigilan|seguranca|guarda|exercito|marinha|aeronautica|coronel|major/, 'seguranca_militar'],
    [/engenheir|industr|producao|fabrica|operador|metalurg/, 'industria'],
    [/vend|comerci|loja|corretor|representante|caixa|atendente/, 'vendas'],
    [/social media|marketing|design|fotograf|video|conteudo|influenc|publicit|jornal|redator/, 'marketing'],
    [/motorista|entregad|motoboy|caminhon|logistic|uber|taxi/, 'transporte'],
    [/cozinh|chef|confeit|padeir|garcom|\bbar\b|restaurante|lanch|salgad/, 'gastronomia'],
    [/cabele|barbe|manicure|estetic|maquia|tatua|sobrancelha|lash|costur|beleza/, 'beleza'],
    [/agro|rural|fazend|agricul|pecuar|pesca|plant/, 'agro'],
    [/estudante|universit|concurs|vestibul|aluno/, 'estudante'],
    [/eletric|encanad|mecanic|tecnico|refriger|instalad|montador|reparo/, 'servicos_tecnicos'],
    [/limpeza|diarista|domestic|zelador|jardin|porteiro/, 'servicos_gerais'],
    [/administr|gerente|analista|contad|financ|\brh\b|secretar|assistente|escritorio/, 'administrativo'],
  ];
  const hit = KEYS.find(([re]) => re.test(n));
  return hit ? hit[1] : 'generico';
}
export function searchProfessions(q, limit = 40) {
  const n = norm(q);
  if (!n) return PROFESSIONS.slice(0, limit);
  const starts = PROFESSIONS.filter((p) => norm(p.name).startsWith(n));
  const has = PROFESSIONS.filter((p) => !norm(p.name).startsWith(n) && (norm(p.name).includes(n) || norm(p.area).includes(n)));
  return [...starts, ...has].slice(0, limit);
}
export const typeDef = (id) => TYPE_DEFS[id] || TYPE_DEFS.outro;

/* ---------- cara de cada área: cor de destaque e fundo (claro e escuro) ----------
   accent = botões, dia escolhido, abas; bg = fundo do app no modo claro. Marketing mantém o preto original. */
export const ARCH_THEME = {
  saude_clinica: { accent: '#0E7490', dark: '#38BDF8', bg: '#F6FAFC' },
  saude_plantao: { accent: '#0F766E', dark: '#2DD4BF', bg: '#F5FAF9' },
  educacao: { accent: '#2563EB', dark: '#60A5FA', bg: '#F5F7FC' },
  obra: { accent: '#C2410C', dark: '#FB923C', bg: '#FAF7F3' },
  servicos_tecnicos: { accent: '#B45309', dark: '#FBBF24', bg: '#FAF8F3' },
  industria: { accent: '#475569', dark: '#FACC15', bg: '#F5F6F7' },
  seguranca_militar: { accent: '#3F6212', dark: '#A3E635', bg: '#F5F6F1' },
  vendas: { accent: '#047857', dark: '#34D399', bg: '#F3F8F6' },
  administrativo: { accent: '#1E40AF', dark: '#93C5FD', bg: '#F4F6FA' },
  tecnologia: { accent: '#6D28D9', dark: '#A78BFA', bg: '#F6F5FB' },
  transporte: { accent: '#0369A1', dark: '#38BDF8', bg: '#F3F7FA' },
  gastronomia: { accent: '#B91C1C', dark: '#F87171', bg: '#FBF6F4' },
  beleza: { accent: '#BE185D', dark: '#F472B6', bg: '#FBF5F8' },
  agro: { accent: '#15803D', dark: '#4ADE80', bg: '#F4F8F2' },
  servicos_gerais: { accent: '#0F766E', dark: '#2DD4BF', bg: '#F4F8F7' },
  juridico: { accent: '#1E3A8A', dark: '#93C5FD', bg: '#F5F6F9' },
  ciencia: { accent: '#0E7490', dark: '#22D3EE', bg: '#F3F8FA' },
  estudante: { accent: '#7C3AED', dark: '#A78BFA', bg: '#F6F5FB' },
};

/* ---------- ícones de cada profissão (dentro da mesma área) ----------
   icon = emblema da profissão; types = ícone de cada tipo de compromisso para essa profissão */
const PROF_STYLE = [
  [/dentist/, { icon: 'tooth', types: { consulta: 'tooth', procedimento: 'tooth', retorno: 'tooth' } }],
  [/veterin/, { icon: 'paw', types: { consulta: 'paw', procedimento: 'paw', cirurgia: 'paw', retorno: 'paw' } }],
  [/psic[oó]log|psicopedag|terapeuta ocup/, { icon: 'brain', types: { consulta: 'brain', retorno: 'brain' } }],
  [/fisioter/, { icon: 'dumbbell', types: { consulta: 'dumbbell', procedimento: 'dumbbell' } }],
  [/nutricion/, { icon: 'apple', types: { consulta: 'apple', retorno: 'apple' } }],
  [/fonoaud/, { icon: 'mic', types: { consulta: 'mic' } }],
  [/farmac/, { icon: 'pill', types: { consulta: 'pill' } }],
  [/radiolog|biom[eé]dic/, { icon: 'microscope', types: { exame: 'microscope' } }],
  [/socorr/, { icon: 'ambulance', types: { plantao: 'ambulance' } }],
  [/cuidador/, { icon: 'heartpulse', types: { plantao: 'home', visitadom: 'home' } }],
  [/enferm|instrumentador|agente comunit|recepcionista hosp/, { icon: 'heartpulse' }],
  [/m[eé]dic/, { icon: 'stethoscope' }],
  [/educa[cç][aã]o f[ií]sica/, { icon: 'dumbbell', types: { aula: 'dumbbell' } }],
  [/educa[cç][aã]o infantil|creche/, { icon: 'baby', types: { aula: 'baby' } }],
  [/bibliotec/, { icon: 'book' }],
  [/professor|pedagog|diretor escolar|coordenador pedag|monitor escolar|instrutor/, { icon: 'chalkboard' }],
  [/arquitet/, { icon: 'compass', types: { visita: 'blueprint', vistoria: 'ruler' } }],
  [/engenheiro civil|t[eé]cnico em edifica/, { icon: 'ruler', types: { visita: 'hardhat', vistoria: 'ruler' } }],
  [/pintor/, { icon: 'brush', types: { servico: 'brush' } }],
  [/eletricista/, { icon: 'plug', types: { servico: 'bolt', manutencao: 'bolt' } }],
  [/encanador|bombeiro hidr|piscineiro|lavador/, { icon: 'droplet', types: { servico: 'droplet' } }],
  [/mec[aâ]nico/, { icon: 'wrench', types: { servico: 'wrench', manutencao: 'wrench' } }],
  [/refrigera|ar-condicionado/, { icon: 'cog', types: { servico: 'cog' } }],
  [/soldador/, { icon: 'flame', types: { servico: 'flame' } }],
  [/marceneiro|montador|carpinteiro/, { icon: 'hammer', types: { servico: 'hammer' } }],
  [/pedreiro|servente|mestre de obras|gesseiro|azulejista|serralheiro|vidraceiro/, { icon: 'hardhat' }],
  [/engenheiro (de produ|industrial|mec|eletric)|automa[cç][aã]o|seguran[cç]a do trabalho/, { icon: 'cog', types: { inspecao: 'clipcheck' } }],
  [/programador|desenvolvedor|analista de sistemas/, { icon: 'code' }],
  [/suporte|inform[aá]tica/, { icon: 'server' }],
  [/cientista de dados|analista de dados/, { icon: 'chart' }],
  [/astronauta|aeroespacial/, { icon: 'rocket', types: { experimento: 'rocket' } }],
  [/bioqu[ií]mic|qu[ií]mic/, { icon: 'flask' }],
  [/bi[oó]log/, { icon: 'leaf', types: { experimento: 'microscope' } }],
  [/f[ií]sico/, { icon: 'atom', types: { experimento: 'atom' } }],
  [/pesquisador/, { icon: 'microscope' }],
  [/motorista de [oô]nibus/, { icon: 'bus', types: { turno: 'bus' } }],
  [/caminh[aã]o|agente de cargas|empilhadeira|conferente|log[ií]stica/, { icon: 'truck', types: { turno: 'truck' } }],
  [/motoboy|mototaxi|entregador/, { icon: 'package', types: { turno: 'package' } }],
  [/frentista/, { icon: 'droplet' }],
  [/motorista|taxista|manobrista|vendedor de ve[ií]culos/, { icon: 'car2', types: { turno: 'car2' } }],
  [/cozinh|chefe|pizzaiolo|churrasq|salgadeiro|padeiro|confeiteiro|a[cç]ougueiro/, { icon: 'chefhat', types: { turno: 'chefhat' } }],
  [/gar[cç]o|lanchonete|barista|bartender/, { icon: 'utensils' }],
  [/cabeleireiro|barbeiro|costureiro|alfaiate/, { icon: 'scissors2', types: { atendimento: 'scissors2' } }],
  [/tatuador|piercer/, { icon: 'pencil', types: { atendimento: 'pencil' } }],
  [/massoterap/, { icon: 'heartpulse', types: { atendimento: 'heartpulse' } }],
  [/manicure|pedicure|maquiador|esteticista|sobrancelha|lash|depilador/, { icon: 'brush' }],
  [/bombeiro/, { icon: 'flame', types: { escala: 'flame', missao: 'flame' } }],
  [/policial|guarda municipal|penitenci/, { icon: 'siren', types: { escala: 'siren' } }],
  [/vigilante|porteiro|controlador de acesso|seguran[cç]a patrimonial/, { icon: 'shield', types: { escala: 'shield' } }],
  [/soldado|cabo|sargento|subtenente|tenente|capit[aã]o|militar/, { icon: 'chevrons' }],
  [/juiz/, { icon: 'gavel' }],
  [/escriv|oficial de justi/, { icon: 'note' }],
  [/advogad|defensor|promotor de justi|direito/, { icon: 'scale' }],
  [/corretor de im[oó]veis/, { icon: 'key', types: { visita: 'home' } }],
  [/operador de caixa/, { icon: 'cash' }],
  [/telemarketing|atendente/, { icon: 'headset' }],
  [/jornalista|produtor de conte/, { icon: 'mic' }],
  [/fot[oó]grafo|videomaker|editor de v[ií]deo/, { icon: 'camera' }],
  [/designer|artes[aã]o/, { icon: 'palette' }],
  [/redator|copywriter/, { icon: 'pencil' }],
  [/contador|cont[aá]bil|financeiro/, { icon: 'calcl' }],
  [/tratorista/, { icon: 'tractor' }],
  [/pecuarista/, { icon: 'paw' }],
  [/pescador/, { icon: 'droplet' }],
  [/agricultor|rural|agr[ií]cola|agr[oô]nomo|apicultor|florista|jardineiro/, { icon: 'sprout' }],
  [/faxineiro|limpeza|diarista|dom[eé]stica/, { icon: 'sparkles' }],
  [/zelador/, { icon: 'key' }],
  [/estudante|universit|vestibul|concurseiro/, { icon: 'gradcap' }],
];
export function profStyle(profession = '') {
  const n = String(profession || '').toLowerCase();
  const hit = n && PROF_STYLE.find(([re]) => re.test(n));
  return hit ? hit[1] : {};
}

/* Campos do editor de compromisso com a cara de cada área: [rótulo, exemplo].
   desc = detalhes do compromisso; note = anotação que só você (ou a equipe) vê. */
export const FORM = {
  marketing: { desc: ['Descrição / legenda', 'Ideia do post, legenda, roteiro…'], note: ['Nota interna', 'Equipamento, observações, combinados…'], title: 'Ex.: Post de lançamento' },
  saude_clinica: { desc: ['Detalhes do atendimento', 'Motivo, preparo, o que levar, convênio…'], note: ['Anotação privada', 'Lembretes seus sobre este atendimento…'] },
  saude_plantao: { desc: ['Detalhes do plantão', 'Setor, ala, quem passa o plantão…'], note: ['Anotação privada', 'Material, trocas de escala, combinados…'] },
  educacao: { desc: ['Conteúdo', 'Tema da aula, capítulo, exercícios, material…'], note: ['Anotação privada', 'Alunos para acompanhar, recados para a coordenação…'] },
  obra: { desc: ['Detalhes do serviço', 'Etapa da obra, medidas, materiais…'], note: ['Anotação interna', 'Equipe, ferramentas, combinados com o cliente…'] },
  servicos_tecnicos: { desc: ['O que vai ser feito', 'Defeito, equipamento, peças, endereço…'], note: ['Anotação interna', 'Peças, valor combinado, ferramentas…'] },
  industria: { desc: ['Detalhes', 'Máquina, linha, ordem de serviço…'], note: ['Anotação interna', 'EPI, ferramentas, quem acompanha…'] },
  seguranca_militar: { desc: ['Detalhes', 'Local, fardamento, material, horário de apresentação…'], note: ['Anotação privada', 'Escala, trocas, combinados…'] },
  vendas: { desc: ['Detalhes', 'Produto, valor, condição de pagamento…'], note: ['Anotação interna', 'Objeções, próximos passos…'] },
  administrativo: { desc: ['Detalhes', 'Pauta, documentos, o que preparar…'], note: ['Anotação interna', 'Responsáveis, combinados…'] },
  tecnologia: { desc: ['Detalhes', 'Tarefa, link do card, ambiente…'], note: ['Anotação interna', 'Riscos, dependências, quem revisa…'] },
  transporte: { desc: ['Detalhes da entrega', 'Endereço, cliente, horário combinado…'], note: ['Anotação privada', 'Valor, observações da rota…'] },
  gastronomia: { desc: ['Detalhes do pedido', 'Sabor, recheio, tamanho, quantidade, decoração…'], note: ['Anotação interna', 'Ingredientes para comprar, valor, sinal pago…'] },
  beleza: { desc: ['Detalhes do atendimento', 'Serviço, cor, comprimento, preferências…'], note: ['Anotação interna', 'Produtos, valor, alergias…'] },
  agro: { desc: ['Detalhes', 'Talhão, cultura, quantidade, insumos…'], note: ['Anotação privada', 'Clima, máquinas, quem ajuda…'] },
  servicos_gerais: { desc: ['Detalhes do serviço', 'Cômodos, tarefas, endereço…'], note: ['Anotação interna', 'Material, valor, chave, combinados…'] },
  juridico: { desc: ['Detalhes', 'Processo, vara, documentos…'], note: ['Anotação privada', 'Estratégia, prazos internos…'] },
  ciencia: { desc: ['Detalhes', 'Protocolo, amostras, equipamento…'], note: ['Anotação privada', 'Resultados parciais, ideias…'] },
  estudante: { desc: ['O que estudar', 'Capítulo, lista de exercícios, tema…'], note: ['Anotação', 'Dúvidas para levar ao professor…'] },
  generico: { desc: ['Detalhes', 'O que fazer, o que levar, observações…'], note: ['Anotação privada', 'Combinados, lembretes extras…'] },
};
/* Profissões com detalhes ainda mais específicos (ganham do padrão da área) */
const FORM_PROF = [
  [/confeit|doceir|boleir/, { first: 'encomenda', desc: ['Detalhes da encomenda', 'Sabor da massa, recheio, cobertura, tamanho, tema da festa…'], note: ['Anotação interna', 'Ingredientes para comprar, sinal pago, retirada ou entrega…'] }],
  [/salgadeir/, { first: 'encomenda', desc: ['Detalhes da encomenda', 'Tipos de salgado, quantidade, frito ou congelado…'], note: ['Anotação interna', 'Ingredientes, sinal pago, retirada ou entrega…'] }],
  [/pizzai|cozinh|chef/, { desc: ['Detalhes', 'Cardápio, quantidade de pessoas, restrições…'], note: ['Anotação interna', 'Compras, equipe, valor combinado…'] }],
  [/barbeir/, { desc: ['Detalhes do atendimento', 'Corte, barba, sobrancelha, pigmentação…'], note: ['Anotação interna', 'Máquina e pente preferidos, valor…'] }],
  [/manicur|pedicur|unh/, { desc: ['Detalhes do atendimento', 'Mão, pé, alongamento, cor do esmalte…'], note: ['Anotação interna', 'Alergias, valor, preferências…'] }],
  [/cabeleir/, { desc: ['Detalhes do atendimento', 'Corte, coloração, escova, química…'], note: ['Anotação interna', 'Fórmula da cor, produtos, valor…'] }],
  [/maquiad/, { desc: ['Detalhes do atendimento', 'Ocasião, horário da festa, estilo…'], note: ['Anotação interna', 'Tom de pele, produtos, valor…'] }],
  [/fot[oó]graf|videomaker|cinegraf/, { desc: ['Detalhes do ensaio', 'Local, tipo de ensaio, roupas, referências…'], note: ['Anotação interna', 'Equipamento, valor, entrega das fotos…'] }],
  [/personal|educador f[ií]sico|treinador/, { desc: ['Detalhes do treino', 'Treino do dia, foco, cargas…'], note: ['Anotação privada', 'Evolução, dores, observações do aluno…'] }],
  [/psic[oó]log|terapeut/, { desc: ['Detalhes da sessão', 'Online ou presencial, link da sala…'], note: ['Anotação privada', 'Só você vê. Lembretes para a próxima sessão…'] }],
  [/dentist|odont/, { desc: ['Detalhes do atendimento', 'Procedimento, dente, preparo…'], note: ['Anotação privada', 'Materiais, laboratório, retorno…'] }],
  [/veterin/, { desc: ['Detalhes do atendimento', 'Animal, tutor, vacina, exame…'], note: ['Anotação privada', 'Peso, medicação, retorno…'] }],
  [/motorist|entregad|motoboy|caminhon/, { desc: ['Detalhes da corrida', 'Origem, destino, carga, cliente…'], note: ['Anotação privada', 'Valor, pedágio, combustível…'] }],
];
export function formOf(arch, profession = '') {
  const n = String(profession || '').toLowerCase();
  const hit = n && FORM_PROF.find(([re]) => re.test(n));
  return { ...(FORM[arch] || FORM.generico), ...(hit ? hit[1] : {}) };
}
