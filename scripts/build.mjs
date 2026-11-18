/* Junta o app inteiro em poucos arquivos com nome versionado (dist/).
   - Nenhum bloqueador do Safari consegue barrar uma peça solta.
   - O nome muda a cada versão: o iPhone nunca fica preso numa versão antiga.
   Uso: npm run build  (rodar depois de qualquer mudança em js/ ou config.js) */
import { build } from 'esbuild';
import { rmSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, relative } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const out = resolve(root, 'dist');
rmSync(out, { recursive: true, force: true });

const result = await build({
  entryPoints: [resolve(root, 'js/app.js')],
  bundle: true,
  splitting: true,
  format: 'esm',
  outdir: out,
  entryNames: 'a-[hash]',
  chunkNames: 'c-[hash]',
  minify: true,
  target: ['safari15'],
  legalComments: 'none',
  metafile: true,
  logLevel: 'warning',
});

const files = Object.keys(result.metafile.outputs).map((f) => relative(root, resolve(root, f)).replace(/\\/g, '/'));
const entry = files.find((f) => /\/a-[^/]+\.js$/.test(f));
const version = entry.match(/a-([^.]+)\.js$/)[1].slice(0, 8).toLowerCase();

const idxPath = resolve(root, 'index.html');
const preload = files.filter((f) => f.endsWith('.js')).map((f) => `<link rel="modulepreload" href="${f}">`).join('\n  ');
writeFileSync(idxPath, readFileSync(idxPath, 'utf8')
  .replace(/\/\*APP\*\/'[^']*'\/\*APP\*\//, `/*APP*/'./${entry}'/*APP*/`)
  .replace(/<!--PRELOAD-->[\s\S]*?<!--\/PRELOAD-->/, `<!--PRELOAD-->\n  ${preload}\n  <!--/PRELOAD-->`));

const swPath = resolve(root, 'sw.js');
writeFileSync(swPath, readFileSync(swPath, 'utf8')
  .replace(/\/\*CACHE\*\/'[^']*'\/\*CACHE\*\//, `/*CACHE*/'cal-${version}'/*CACHE*/`)
  .replace(/\/\*FILES\*\/.*$/m, `/*FILES*/ ${files.map((f) => `'${f}'`).join(', ')},`));

const kb = (f) => Math.round(readFileSync(resolve(root, f)).length / 1024);
console.log(`Versão ${version}:`, files.map((f) => `${f} (${kb(f)} KB)`).join(', '));
