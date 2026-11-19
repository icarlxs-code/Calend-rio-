/* ============================================================
   CONFIGURAÇÃO DO APP — edite apenas este arquivo
   ============================================================ */
export const CONFIG = {
  // Nome que aparece no topo do app e na tela do cliente
  appName: 'Calendário',
  agencyName: 'Henrique & Matheus',

  // Endereço do servidor gratuito de avisos (Cloudflare Workers). Preenchido depois de publicar.
  pushServer: '',

  // Equipe. O "email" só é usado quando a sincronização na nuvem
  // (Firebase) estiver ligada — é o login de cada um.
  team: [
    { id: 'henrique', name: 'Henrique', email: 'icarlxs@gmail.com', color: '#2563EB' },
    { id: 'matheus',  name: 'Matheus',  email: 'contatopedrazzi1@gmail.com', color: '#D9480F' },
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
