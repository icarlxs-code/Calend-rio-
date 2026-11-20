# Lançamento do Lembra — o que falta configurar

Tudo o que é código já está pronto e testado. Estes passos são de contas e painéis (precisam ser feitos por você).

## 1. Firebase (regras de segurança) — obrigatório agora
1. console.firebase.google.com → projeto **calendario-48fdb** → **Firestore Database → Regras**.
2. Apague tudo, cole o conteúdo do arquivo `firestore.rules` deste repositório e toque em **Publicar**.
3. **Authentication → Templates**: troque o idioma para **Português (Brasil)** (e-mails de confirmação e de nova senha).
   O app já pede os e-mails em português; ali você também pode trocar o nome do remetente para **Lembra**.
   Os e-mails saem de `noreply@calendario-48fdb.firebaseapp.com` e às vezes caem no **Spam/Promoções** — avise isso no suporte.

## 2. Stripe (pagamentos) — obrigatório para vender
1. **Chave secreta**: Stripe → Desenvolvedores → Chaves de API → *Chave secreta* (`sk_live_…`).
   Cloudflare → Workers → **calend-rio** → Settings → Variables and Secrets → *Add* → tipo **Secret**, nome `STRIPE_SECRET_KEY`.
2. **Webhook**: Stripe → Desenvolvedores → Webhooks → *Adicionar endpoint*
   - URL: `https://calend-rio.icarlxs.workers.dev/billing/webhook`
   - Eventos: `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`,
     `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.paid`, `charge.refunded`
   - Copie o *Segredo de assinatura* (`whsec_…`) → Cloudflare, Secret `STRIPE_WEBHOOK_SECRET`.
3. **Portal do cliente** (cancelar/trocar cartão): Stripe → Configurações → Billing → **Portal do cliente** → Ativar.
4. **Cartões**: Stripe → Configurações → Payments → Formas de pagamento → **Cartões** ativado (o app cobra só no cartão).
   Termine também os itens "Incompleto" da conta (dados do responsável, conta bancária) — sem isso a Stripe recusa cobranças reais.
5. Recomendado: Cloudflare, Secret `CPF_SALT` com uma palavra só sua (deixa o CPF embaralhado exclusivo do seu servidor).

## 3. Domínio próprio (ex.: lembra.com.br)
1. Compre em registro.br.
2. GitHub → repositório → Settings → Pages → *Custom domain* → `lembra.com.br` (o GitHub mostra os registros DNS para colocar no registro.br).
3. No código, troque em `config.js` → `siteUrl: 'https://lembra.com.br/'` e em `worker/wrangler.toml` → `SITE_URL` e acrescente o domínio em `ALLOWED_ORIGINS`.
4. Firebase → Authentication → Settings → **Domínios autorizados** → adicione `lembra.com.br`.

## 4. Google Play (Android)
O Lembra já é um app instalável (PWA). Para a loja, ele é empacotado como **Trusted Web Activity**:
1. Conta de desenvolvedor Google Play (taxa única de US$ 25).
2. Em pwabuilder.com, cole o endereço do app → *Package for stores* → **Android** → baixe o pacote (.aab) e o arquivo `assetlinks.json`.
3. Publique `assetlinks.json` em `https://SEU-DOMINIO/.well-known/assetlinks.json` (precisa do domínio próprio do passo 3).
4. Play Console → criar app → enviar o .aab, prints (estão em `media/screens/`), Política de Privacidade: `https://SEU-DOMINIO/privacidade/`.
   No formulário *Segurança dos dados* e *Exclusão de conta*, informe: exclusão no app em Ajustes → Privacidade e dados.

## 5. App Store (iPhone)
1. Conta Apple Developer (US$ 99/ano) e um Mac com Xcode (ou um serviço que gere o app, como o PWABuilder → iOS).
2. Atenção às regras de pagamento: para assinaturas digitais vendidas **dentro** do app de iPhone, a Apple exige a compra pelo próprio
   sistema dela (In-App Purchase, com taxa de 15–30%). O mesmo vale, em regra, para o Google Play Billing. As exceções variam por país:
   confirme as regras vigentes na hora de publicar. Caminho mais simples: lançar primeiro pelo site (Stripe, sem taxa de loja) e,
   para as lojas, ligar a cobrança da loja (dá para unificar as duas com um serviço como o RevenueCat).
3. Já está pronto para a revisão da Apple: exclusão de conta dentro do app, Política de Privacidade e Termos públicos.

## 6. Teste grátis (regra atual)
- 24 horas a partir do toque em **Começar meu teste grátis** (nunca começa sozinho).
- Um teste por **CPF**, por **aparelho** e por **endereço de internet (IP)** nos últimos 30 dias. Em celular com IPv6 (a maioria no 4G/5G),
  vale o bloco do aparelho. Efeito colateral: duas pessoas da mesma casa (mesmo Wi-Fi) ou da mesma rede no mesmo mês — só a
  primeira ganha o teste; a segunda vê os planos. Para afrouxar, troque `IP_WINDOW`/`IP_MAX` em `worker/src/billing.js`.

## 7. Conferir depois de configurar
- Abra o app, vá em Ajustes → Seu plano → Assinar → pague com um cartão de teste da Stripe (modo teste) e confira se volta liberado.
- Ajustes → Painel do dono: contas, pagantes, receita, erros do app.
