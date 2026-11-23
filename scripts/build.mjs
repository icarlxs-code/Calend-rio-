/* Junta o app inteiro em poucos arquivos com nome versionado (dist/).
   - Nenhum bloqueador do Safari consegue barrar uma peça solta.
   - O nome muda a cada versão: o iPhone nunca fica preso numa versão antiga.
   Uso: npm run build  (rodar depois de qualquer mudança em js/ ou config.js) */
import { build } from 'esbuild';
import { rmSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, relative } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const out = resolve(root, 'dist');
rmSync(out, { recursive: true, force: true });

/* Versão do app (release.json): a cada mudança de estrutura sobe o número.
   2.0.0 → 2.1.0 (novidade) → 2.1.1 (correção). "min": versão mínima — abaixo dela o app se atualiza na marra. */
const release = JSON.parse(readFileSync(resolve(root, 'release.json'), 'utf8'));
if (!/^\d+\.\d+\.\d+$/.test(release.version || '')) throw new Error('release.json: "version" precisa ser no formato 2.0.0');

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
  define: {
    __APP_VERSION__: JSON.stringify(release.version),
    __APP_TITLE__: JSON.stringify(release.title || ''),
    __APP_NOTES__: JSON.stringify(Array.isArray(release.notes) ? release.notes.slice(0, 12) : []),
    __APP_MIN__: JSON.stringify(release.min || ''),
    __APP_DATE__: JSON.stringify(release.date || ''),
  },
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

/* Páginas públicas (convite, pagamento, termos, privacidade) com o endereço oficial do config.js */
const { CONFIG } = await import(resolve(root, 'config.js') + `?v=${Date.now()}`);
const site = (CONFIG.siteUrl || '').replace(/\/?$/, '/');
const style = readFileSync(resolve(root, 'pages/_style.css'), 'utf8').replace(/\s*\n\s*/g, '');
for (const name of ['convite', 'pago', 'termos', 'privacidade', 'conheca', 'excluir-conta', 'suporte']) {
  const html = readFileSync(resolve(root, `pages/${name}.html`), 'utf8')
    .replaceAll('{{STYLE}}', style).replaceAll('{{SITE}}', site).replaceAll('{{APP}}', CONFIG.appName || 'Lembra')
    .replaceAll('{{OWNER}}', CONFIG.legalName || CONFIG.appName || 'Lembra').replaceAll('{{CONTACT}}', CONFIG.supportEmail || CONFIG.adminEmail || '')
    .replaceAll('{{TERMS_VERSION}}', CONFIG.termsVersion || '1.0').replaceAll('{{DATE}}', CONFIG.termsDate || '')
    .replaceAll('{{LEGAL}}', [CONFIG.legalName, CONFIG.legalId, CONFIG.legalAddress].filter(Boolean).join(' · '))
    .replaceAll('{{WHATSAPP}}', CONFIG.supportWhatsapp ? `<a class="wa" href="https://wa.me/${String(CONFIG.supportWhatsapp).replace(/\D/g, '')}?text=${encodeURIComponent('Olá! Vim pelo site do Lembra.')}" target="_blank" rel="noopener">Falar no WhatsApp</a>` : '');
  mkdirSync(resolve(root, name), { recursive: true });
  writeFileSync(resolve(root, name, 'index.html'), html);
}

/* Prévia do link do app (WhatsApp, Instagram, Facebook): título, descrição e imagem com o endereço oficial */
const og = `<!--OG--><meta property="og:type" content="website"><meta property="og:site_name" content="${CONFIG.appName || 'Lembra'}"><meta property="og:title" content="${CONFIG.appName || 'Lembra'} · Nunca mais esqueça um compromisso"><meta property="og:description" content="Lembra: a agenda que avisa na hora certa, cobra com carinho e comemora cada coisa feita. Grátis até 31/12/2026."><meta property="og:url" content="${site}"><meta property="og:image" content="${site}media/og-v2.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:locale" content="pt_BR"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="${site}media/og-v2.jpg"><!--/OG-->`;
const idx = readFileSync(resolve(root, 'index.html'), 'utf8');
writeFileSync(resolve(root, 'index.html'), /<!--OG-->[\s\S]*?<!--\/OG-->/.test(idx) ? idx.replace(/<!--OG-->[\s\S]*?<!--\/OG-->/, og) : idx.replace('<link rel="manifest"', `${og}\n  <link rel="manifest"`));

/* version.json: o app confere ao abrir/voltar (atualiza sozinho) e o Painel do dono compara com a versão de cada pessoa */
writeFileSync(resolve(root, 'version.json'), JSON.stringify({
  version: release.version, build: version, date: release.date || '', min: release.min || '',
  title: release.title || '', notes: Array.isArray(release.notes) ? release.notes.slice(0, 12) : [], builtAt: new Date().toISOString(),
}, null, 2) + '\n');

const kb = (f) => Math.round(readFileSync(resolve(root, f)).length / 1024);
console.log(`Versão ${release.version} (build ${version}):`, files.map((f) => `${f} (${kb(f)} KB)`).join(', '));
