/* Usado pelo GitHub Actions antes de publicar o servidor gratuito:
   cria (ou reaproveita) o armazenamento KV e prepara as variáveis da equipe. */
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, appendFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const here = import.meta.dirname;
const { CONFIG } = await import(pathToFileURL(resolve(here, '../config.js')).href);
const run = (cmd) => execSync(cmd, { cwd: here, encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] });

const TITLE = 'calendario-avisos-CAL';
let list = JSON.parse(run('npx wrangler kv namespace list'));
let ns = list.find((n) => n.title === TITLE);
if (!ns) {
  run('npx wrangler kv namespace create CAL');
  list = JSON.parse(run('npx wrangler kv namespace list'));
  ns = list.find((n) => n.title === TITLE);
}
if (!ns) throw new Error('Não consegui criar o armazenamento KV.');
const tomlPath = resolve(here, 'wrangler.toml');
writeFileSync(tomlPath, readFileSync(tomlPath, 'utf8').replace(/id = "[^"]*"/, `id = "${ns.id}"`));

const team = CONFIG.team.map((m) => ({ id: m.id, name: m.name, email: (m.email || '').toLowerCase() }));
const out = process.env.GITHUB_OUTPUT;
const vals = {
  team: JSON.stringify(team),
  project: CONFIG.firebase?.projectId || '',
  origin: 'https://icarlxs-code.github.io',
};
if (out) for (const [k, v] of Object.entries(vals)) appendFileSync(out, `${k}=${v}\n`);
console.log('KV:', ns.id, '| equipe:', team.map((m) => m.name).join(', '), '| projeto:', vals.project);
