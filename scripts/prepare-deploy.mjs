/* Prepara o deploy do servidor a partir do config.js:
   - functions/team.js (nomes e ids da equipe)
   - firestore.rules (e-mails da equipe nas regras de segurança)
   Uso: node scripts/prepare-deploy.mjs */
import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const { CONFIG } = await import(pathToFileURL(resolve(root, 'config.js')).href);

const team = CONFIG.team.map(({ id, name }) => ({ id, name }));
writeFileSync(resolve(root, 'functions/team.js'), `/* Gerado por scripts/prepare-deploy.mjs a partir do config.js */\nexport const TEAM = ${JSON.stringify(team, null, 2)};\n`);

const emails = CONFIG.team.map((m) => (m.email || '').trim().toLowerCase()).filter(Boolean);
if (process.argv.includes('--deploy')) {
  if (emails.length !== CONFIG.team.length) {
    console.error('Preencha o e-mail de todos da equipe em config.js antes de publicar o servidor.');
    process.exit(1);
  }
  if (!CONFIG.firebase?.projectId) {
    console.error('Preencha a configuração do Firebase em config.js antes de publicar o servidor.');
    process.exit(1);
  }
  const rules = readFileSync(resolve(root, 'firestore.rules'), 'utf8')
    .replace(/request\.auth\.token\.email in \[[^\]]*\]/, `request.auth.token.email in ${JSON.stringify(emails)}`);
  writeFileSync(resolve(root, 'firestore.rules'), rules);
  console.log(`projectId=${CONFIG.firebase.projectId}`);
}
console.log('Equipe:', team.map((m) => m.name).join(', '));
