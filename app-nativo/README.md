# Lembra — app da App Store e da Google Play (Capacitor)

O app das lojas usa **o mesmo código do site**, empacotado dentro do app (nada de "site num WebView" carregado de fora).

## O que já está pronto no código
- **Compra pela loja** (`js/loja.js`): dentro do app nativo, o botão de assinar usa a Compra no App da Apple / o Faturamento do Google (plugin `@capgo/native-purchases`); no site continua a Stripe. Botão **Restaurar compras** aparece só no app.
- **Servidor** (`/billing/store-verify`): só libera o plano depois de conferir o recibo com a loja. Fica desligado até você criar as contas e colocar as chaves (passo 4).
- Consentimento de IA, denúncia/bloqueio, exclusão de conta, conta de adolescente, páginas públicas.

## Passo a passo (na ordem)
1. **Contas**: Apple Developer Program (US$ 99/ano) e Google Play Console (US$ 25, uma vez). Pessoa física. Na Apple, **deixe a União Europeia fora** da disponibilidade.
2. **Gerar os projetos** (num Mac com Xcode 26 e Android Studio):
   ```
   cd app-nativo
   npm install
   npx cap add ios
   npx cap add android
   npm run ios       # abre no Xcode
   npm run android   # abre no Android Studio
   ```
3. **Permissões** — `ios/App/App/Info.plist`:
   - `NSCameraUsageDescription` = "O Lembra usa a câmera para você tirar a foto do story do compromisso que concluiu."
   - `NSPhotoLibraryAddUsageDescription` = "Para salvar no seu celular a foto do story, se você quiser."
   - Capacidades no Xcode: **Push Notifications**, **In-App Purchase**. Não ative modos de segundo plano.
   - Android: `targetSdkVersion 36`; a permissão de notificação é pedida no momento certo pelo app; não use READ_MEDIA_IMAGES (a foto vem da câmera).
4. **Produtos** (App Store Connect → Assinaturas, e Play Console → Produtos), com estes códigos:
   `lembra.essencial.mensal`, `lembra.essencial.anual`, `lembra.profissional.mensal`, `lembra.profissional.anual`, `lembra.fundadores` (compra única), `lembra.dupla.mensal`, `lembra.equipe.mensal`.
   Depois coloque no Cloudflare (Workers → Configurações → Variáveis, como **segredo**): `APPLE_ISSUER_ID`, `APPLE_KEY_ID`, `APPLE_PRIVATE_KEY` (App Store Server API) e `GOOGLE_PLAY_SERVICE_ACCOUNT` (JSON da conta de serviço). Me avise que eu ligo a validação.
5. **Notificações nativas**: Apple → chave APNs (.p8); Google → Firebase Cloud Messaging. O servidor passa a mandar para os dois tipos.
6. **Conta de demonstração** para os revisores: `revisor.lembra@gmail.com` (crie e me passe a senha; eu deixo o plano liberado e coloco dados de exemplo).
7. Envie para revisão com os textos de `LOJAS-TEXTOS.md`.
