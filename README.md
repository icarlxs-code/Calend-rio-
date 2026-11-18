# Pauta — agenda de conteúdo da dupla Henrique & Matheus

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
3. O app “Pauta” abre em tela cheia, como um aplicativo.

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

## Personalizar

Tudo em [`config.js`](config.js): nome do app, nome da agência (aparece para o cliente), nomes e cores da dupla.

## Estrutura

```
index.html            página principal
config.js             configurações (equipe, Firebase)
css/app.css           visual (claro e escuro automático)
js/app.js             inicialização e navegação
js/store.js           dados (no aparelho ou na nuvem)
js/insights.js        dicas, conflitos e sugestões de horário
js/share.js           link do cliente
js/ics.js             exportação para o Calendário do iPhone
js/views/*.js         telas
sw.js                 funcionamento offline
firestore.rules       regras de segurança do Firebase
```

Sem dependências nem etapa de build: é só HTML, CSS e JavaScript.
Para testar no computador: `npx http-server .` e abrir `http://localhost:8080`.
