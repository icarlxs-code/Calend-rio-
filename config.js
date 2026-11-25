/* ============================================================
   CONFIGURAÇÃO DO APP — edite apenas este arquivo
   ============================================================ */
export const CONFIG = {
  // Nome que aparece no topo do app e na tela do cliente
  appName: 'Lembra',
  // dono do app: vê o painel com todas as contas (Ajustes → Painel do dono)
  adminEmail: 'icarlxs@gmail.com',
  // o mascote Lembra (companheiro, guia do cadastro, telas) para todo mundo
  mascotPublic: true,

  // Endereço oficial do app (links de convite, volta do pagamento, termos e privacidade).
  siteUrl: 'https://meulembra.com.br/',
  // LGPD: quem responde pelos dados (aparece nos Termos e na Política de Privacidade).
  // Se abrir empresa, coloque a razão social e o CNPJ, ex.: 'Lembra Tecnologia LTDA (CNPJ 00.000.000/0001-00)'.
  legalName: 'Lembra',
  // Lei do comércio eletrônico (Decreto 7.962/2013): quem vende online mostra CPF ou CNPJ e um endereço.
  // Preencha antes de anunciar, ex.: legalId: '', legalAddress: ''.
  legalId: '',
  legalAddress: '',
  // WhatsApp de atendimento (só números, com DDI e DDD), ex.: '5521999998888'. Aparece na página de apresentação e nos Ajustes.
  supportWhatsapp: '',
  supportEmail: 'meulembra@gmail.com', // e-mail oficial (lojas, privacidade, suporte)
  // versão dos Termos/Privacidade: ao mudar, o app pede o aceite de novo
  termsVersion: '1.2',
  termsDate: '23/11/2026',

  // Celular confirmado por SMS e "recuperar a senha pelo celular" (Firebase → Authentication → Telefone).
  // Precisa do plano Blaze do Firebase (≈ US$ 0,02 por SMS no Brasil). Depois de ligar lá, troque para true.
  phoneAuth: false,

  // Endereço do servidor gratuito de avisos (Cloudflare Workers). Preenchido depois de publicar.
  pushServer: 'https://calend-rio.icarlxs.workers.dev',

  // Equipe. O "email" só é usado quando a sincronização na nuvem
  // (Firebase) estiver ligada — é o login de cada um.
  team: [
    { id: 'henrique', name: 'Henrique', email: 'icarlxs@gmail.com', color: '#2563EB', photo: 'media/team/henrique.jpg' },
    { id: 'matheus',  name: 'Matheus',  email: 'contatopedrazzi1@gmail.com', color: '#D9480F', photo: 'media/team/matheus.jpg' },
  ],

  // SINCRONIZAÇÃO NA NUVEM (opcional, recomendado)
  // Sem isso, os dados ficam salvos só no aparelho.
  // Para ligar, cole aqui a configuração do Firebase (veja o README):
  // firebase: {
  //   apiKey: '...',
  //   authDomain: '...firebaseapp.com',
  //   projectId: '...',
  //   storageBucket: '...',
  //   messagingSenderId: '...',
  //   appId: '...'
  // },
  firebase: {
    apiKey: 'AIzaSyAQb8nUAuN4-gKsBa2SPE9d-SNobBAOqDo',
    authDomain: 'calendario-48fdb.firebaseapp.com',
    projectId: 'calendario-48fdb',
    storageBucket: 'calendario-48fdb.firebasestorage.app',
    messagingSenderId: '1066297054489',
    appId: '1:1066297054489:web:0ac54d7989365001942188',
  },
};
