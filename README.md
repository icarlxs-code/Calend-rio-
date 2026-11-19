# Calendário — agenda de conteúdo da dupla Henrique & Matheus

Calendário pensado para o celular (iPhone 16 Pro Max / 17 Pro Max) para organizar o dia a dia de quem faz marketing para várias empresas:
o que postar, para qual empresa, em que horário, quem faz e onde cada um vai estar.

## O que o app faz

| Tela | Para que serve |
|---|---|
| **Hoje** | Agenda do dia em ordem de horário (manhã, tarde e noite), card do **próximo compromisso** com contagem regressiva, **onde cada um vai estar** (captações e reuniões do Henrique e do Matheus), **dicas e alertas** e **bilhetes do dia** |
| **Calendário** | Mês inteiro com bolinhas na cor de cada empresa, filtro por empresa e por pessoa, números do mês (posts, captações, reuniões) |
| **Empresas** | Cada cliente com **nome, cor e logomarca**, Instagram, endereço e observações. Página da empresa com cronograma dos próximos 30 dias e o **link do cliente** |
| **Ajustes** | Quem está usando o celular, lembretes no Calendário do iPhone, backup e tabela de melhores horários |

**Filtro Todos / Henrique / Matheus** no topo: os dois veem tudo um do outro, ou só a agenda de um deles.

### Eventos
Feed · Story · Reels · Carrossel · Captação · Reunião · Edição · Outro. Cada evento tem empresa, dia, horário, duração, **responsável (Henrique, Matheus ou os dois)**,
local (com botão para abrir no Mapas), descrição/legenda (o cliente vê), **nota interna** (só a equipe vê), lembrete, repetição (todo dia, dias úteis, toda semana)
e status (A fazer → Pronto → Feito).

### Assistente automático (sem chave, sem internet)
Botão ✨ no topo da tela **Hoje** (ou o cartão “Assistente”). Ele roda dentro do próprio app e analisa a agenda sozinho a cada mudança:
- **Proteção contra marcação em cima de outra**: ao criar ou editar um evento, o app mostra a **agenda dos dois naquele dia** (linha do tempo do Henrique e do Matheus) e, se a pessoa já tiver compromisso no horário, **bloqueia o salvamento** com um aviso dizendo o que já existe e **quem marcou**. Oferece saídas prontas: *Mudar para HH:MM (livre)*, *Passar para o parceiro (está livre)* ou *Marcar mesmo assim*.
- **Duplicados**: se o Matheus tentar marcar um post que o Henrique já marcou (mesma empresa, mesmo tipo, horário parecido), o app avisa “Isso já está na agenda”.
- **Repetições**: ao criar eventos repetidos, mostra quais datas batem com outros compromissos e permite criar só nas datas livres.
- **Aviso em tempo real**: se o parceiro marcar algo que cria conflito na sua agenda, aparece um alerta na tela.
- **Correção com 1 toque** nos alertas: “Passar para Matheus”, “Mover story para 12h”.
- **Tempo livre**: horas livres de cada um por dia, respeitando expediente, almoço, folga e deslocamento (configuráveis em **Ajustes → Rotina e tempo livre**). Avisa quando alguém fica sem pausa ou sobrecarregado.
- **Encontrar o melhor horário**: escolha o tipo de post e o dia e veja os horários livres de cada um, priorizando os horários de pico.

### Perguntar ao Claude (com o login normal)
No Assistente, **Perguntar ao Claude** abre o Claude (app ou claude.ai) **com a sua conta normal**, já com a agenda dos próximos 14 dias e a pergunta escritas. Não usa chave de API e o app não envia nada sozinho: é você que manda a mensagem no Claude.
- O modelo é escolhido no próprio Claude. Para usar o **Haiku 5.5**, selecione-o uma vez no seletor de modelo do Claude. O app não consegue escolher o modelo pela sua conta, e “esforço baixo” é uma opção que só existe na API paga. O pedido já vai escrito para respostas curtas e diretas.
- A agenda também fica copiada. Se o Claude abrir vazio, cole no campo de mensagem.

### Dicas e alertas automáticos
- **Conflito**: post marcado no meio de uma captação. O app sugere deixar programado ou passar para o parceiro, se ele estiver livre.
- **Alguém em dois lugares** ao mesmo tempo.
- **Pouco tempo de deslocamento** entre duas captações/reuniões em lugares diferentes.
- **Posts da mesma empresa muito próximos** (menos de 3 h).
- **Tarefas atrasadas**, tarefas **sem responsável** e **dia desequilibrado** entre a dupla.
- **Véspera de captação**: checklist (baterias, cartões, roteiro).
- Ao criar um evento: **melhores horários** para o tipo de post, mostrando quais já estão ocupados.
- Uma **dica do dia** sobre organização.

### Link do cliente (cada empresa vê só o dela)
Em **Empresas → (empresa) → Link do cliente**. O cliente abre no celular e vê, com a logo e a cor dele:
- somente os eventos **daquela empresa**;
- sem notas internas, sem as outras empresas e sem os eventos marcados como “não aparece para o cliente” (ex.: Edição);
- somente leitura, com status em linguagem de cliente: *Planejado · Agendado · Publicado*.

### Lembretes
- **Ajustes → Lembretes no iPhone** exporta a sua semana (ou 30 dias) para o **Calendário do iPhone**, com alarme em cada evento. O celular avisa mesmo com o app fechado.
- Também dá para mandar um evento só pelo botão **Lembrete no iPhone** dentro do evento.
- Com o app aberto, aparece um aviso na hora do lembrete.

---

## 1. Colocar no ar (GitHub Pages, grátis)

1. No GitHub, abra o repositório → **Settings** → **Pages**.
2. Em *Build and deployment*, escolha **Deploy from a branch**, selecione a branch (ex.: `main`) e a pasta **/ (root)**. Salve.
3. Em 1 ou 2 minutos o endereço aparece no topo da página (algo como `https://SEU-USUARIO.github.io/Calend-rio-/`).

## 2. Instalar no iPhone

1. Abra o endereço no **Safari**.
2. Toque em **Compartilhar** → **Adicionar à Tela de Início**.
3. O app “Calendário” abre em tela cheia, como um aplicativo.

> Na primeira abertura aparecem **dados de exemplo** (Pura Vida, Café Aroma, Studio Fit e Bella Estética). Explore e depois toque em **Apagar exemplos**.

## 3. Sincronizar Henrique e Matheus (recomendado)

Sem este passo, cada celular guarda os próprios dados (o app funciona, mas um não vê o que o outro cadastrou, e o link do cliente é uma “foto” que precisa ser reenviada após mudanças).
Com o Firebase (gratuito para esse uso), tudo fica **em tempo real** para a dupla e para os clientes.

1. Acesse <https://console.firebase.google.com> → **Adicionar projeto** (pode desativar o Google Analytics).
2. **Authentication** → *Começar* → **E-mail/senha** → Ativar. Na aba *Usuários*, **adicione o Henrique e o Matheus** (e-mail e senha de cada um).
3. **Firestore Database** → *Criar banco de dados* → modo de produção → escolha a região `southamerica-east1` (São Paulo).
4. Em **Firestore → Regras**, cole o conteúdo do arquivo [`firestore.rules`](firestore.rules), **troque os dois e-mails** e publique.
5. **Configurações do projeto** (engrenagem) → *Seus apps* → ícone **`</>`** (Web) → registre o app → copie o objeto `firebaseConfig`.
6. No GitHub, edite o arquivo [`config.js`](config.js):
   - cole o `firebaseConfig` no campo `firebase`;
   - preencha o `email` do Henrique e do Matheus em `team`.
7. Salve (commit). Em 1–2 minutos o site atualiza. Cada um entra com seu e-mail e senha.

> Já tem dados no celular e quer levar para a nuvem? Antes de ativar: **Ajustes → Exportar backup**. Depois de entrar: **Ajustes → Importar backup**.

## 4. Notificações no celular (lembretes e avisos do parceiro)

O que chega no iPhone:
- **Lembretes inteligentes** de cada post: 2h antes, 30 min antes, na hora e uma **cobrança 30 min depois** se ainda não foi marcado como feito (“Já postou? Reels · Pura Vida”).
- **Captações**: aviso na véspera (com checklist), 2h antes e 45 min antes.
- **Aviso do parceiro**: quando um marca, muda o horário, passa para o outro, conclui ou remove algo, o outro recebe na hora (“Matheus marcou para você: Story · Café Aroma — amanhã, 16h”).
- **Resumo do dia** às 8h e **da véspera** às 20h.
- **Número no ícone** do app com as tarefas pendentes de hoje.

Cada pessoa liga ou desliga cada tipo em **Ajustes → Notificações**.

**Limites do iPhone:** só funciona com o app **instalado na Tela de Início** (iOS 16.4 ou mais novo), e o app pede **apenas a permissão de notificações**. Apps da Tela de Início não podem pedir acesso a Atalhos, Ajustes ou outras áreas do iPhone (isso é exclusivo de apps da App Store).

Para os avisos chegarem **com o app fechado** e no **celular do parceiro na hora**, é preciso um servidor sempre ligado. O app usa o **Cloudflare Workers, plano gratuito, sem cartão de crédito**. O servidor está pronto em `worker/` e o GitHub publica sozinho. Faça **uma vez**:

1. Crie uma conta grátis em **dash.cloudflare.com/sign-up** (só e-mail e senha) e confirme o e-mail.
2. No painel, abra **Workers e Pages** uma vez e escolha um subdomínio `*.workers.dev`, se ele pedir.
3. Copie o **Account ID**: em **Workers e Pages**, ele aparece na lateral direita (ou na URL do painel).
4. Crie um token: **Meu perfil → Tokens de API → Criar token → modelo "Editar Cloudflare Workers" → Continuar → Criar token**. Copie o token.
5. No GitHub: **Settings → Secrets and variables → Actions → New repository secret**:
   - `CLOUDFLARE_ACCOUNT_ID` = o Account ID
   - `CLOUDFLARE_API_TOKEN` = o token
6. **Actions → Publicar servidor gratuito (avisos) → Run workflow**. No fim aparece o endereço do servidor (`https://calendario-avisos.….workers.dev`).
7. Coloque esse endereço em `config.js` → `pushServer` e rode `npm run build` (ou peça ao Claude Code).
8. No iPhone: **Ajustes → Notificações → Ativar** e **Enviar notificação de teste**.

Limites do plano grátis (sobra muito para a dupla): 100 mil pedidos por dia e lembretes conferidos a cada minuto.

> Alternativa: o servidor em `functions/` (Firebase Functions) faz o mesmo, mas exige o plano Blaze (com cartão).

Sem o servidor, o app ainda avisa **enquanto estiver aberto**, e os lembretes podem ir para o **Calendário do iPhone** (Ajustes → Lembretes no Calendário), que avisa mesmo com o app fechado.

## 5. Assistente com o Claude dentro do app

No **Assistente** (✨) há uma conversa: vocês perguntam e o Claude responde ali mesmo, vendo a agenda inteira (posts, captações, reuniões, empresas, rotina e bilhetes dos últimos dias). Usa o **Claude Haiku 5.5 com esforço baixo** (rápido e barato).

O login normal do Claude só vale no app/site do próprio Claude; para responder **dentro** do app é preciso uma chave da API (paga por uso, à parte de qualquer assinatura do Claude). A chave fica **só no servidor**, nunca no app, e só vocês dois logados conseguem usar.

1. Fazer a seção 4 (servidor gratuito publicado).
2. Em **console.anthropic.com**: criar conta, adicionar créditos (Billing) e criar uma chave em **API Keys**. A API é paga por uso (o Haiku 5.5 é o modelo mais barato).
3. No GitHub: **Settings → Secrets and variables → Actions → New repository secret**, nome `ANTHROPIC_API_KEY`, valor: a chave.
4. **Actions → Publicar servidor gratuito (avisos) → Run workflow**.

Sem a chave, o botão **Abrir no app do Claude** continua funcionando com o login normal.

## Página do cliente

Em **Empresas → (empresa) → Página do cliente** aparece exatamente o que o cliente vê (sem notas internas e sem outras empresas). O botão **Enviar** manda o link para o cliente.

## Abertura com vídeo

Ao abrir o app (e ao voltar para ele depois de mais de 30 s fora) toca a animação de abertura, sem som, que termina com uma transição suave para a agenda. Toque na tela para pular. No **Modo Pouca Energia** o iPhone bloqueia vídeos automáticos; nesse caso aparece a imagem da abertura por 1 s. O vídeo fica em `media/intro.mp4`. O tempo fora para repetir está em `js/intro.js` (`AWAY_MS`).

## Personalizar

Tudo em [`config.js`](config.js): nome do app, nome da agência (aparece para o cliente), nomes e cores da dupla.

## Estrutura

```
index.html            página principal
config.js             configurações (equipe, Firebase)
css/app.css           visual (claro e escuro automático)
js/app.js             inicialização e navegação
js/store.js           dados (no aparelho ou na nuvem)
js/planner.js         assistente: conflitos, horários livres, tempo livre
js/insights.js        dicas e alertas do dia
js/claude-link.js     “Perguntar ao Claude” (login normal)
js/avisos.js          notificações no celular
js/intro.js           abertura com vídeo
js/views/onboarding.js boas-vindas e pedido de notificações
worker/               servidor gratuito: avisos em tempo real, lembretes e chat (Cloudflare Workers)
functions/            alternativa do servidor em Firebase Functions (exige plano Blaze)
functions/reminder-rules.js regras dos lembretes (usadas pelo app e pelo servidor)
.github/workflows/    publicação automática do servidor
js/sanitize.js        validação de dados importados e links
js/share.js           link do cliente
js/ics.js             exportação para o Calendário do iPhone
js/views/*.js         telas
sw.js                 funcionamento offline
firestore.rules       regras de segurança do Firebase
```

O app publicado fica em `dist/`: um arquivo só, com nome versionado, gerado a partir de `js/` com `npm install && npm run build`. **Rode o build depois de mudar qualquer coisa em `js/` ou no `config.js`.**
Para testar no computador: `npx http-server .` e abrir `http://localhost:8080`.
