/* ============================================================
   CONFIGURAÇÃO DO APP — edite apenas este arquivo
   ============================================================ */
export const CONFIG = {
  // Nome que aparece no topo do app e na tela do cliente
  appName: 'Calendário',
  agencyName: 'Henrique & Matheus',

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
  firebase: null,
};
