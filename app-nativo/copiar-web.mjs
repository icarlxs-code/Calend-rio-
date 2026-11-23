/* Copia o site já compilado para app-nativo/www (o que vai DENTRO do app; nada é baixado de fora depois).
   Assim o app aprovado é exatamente o que foi revisado (Apple 2.5.2 / 2.5.19). */
import { cpSync, rmSync, mkdirSync } from 'node:fs';
const raiz = new URL('../', import.meta.url).pathname, www = new URL('www/', import.meta.url).pathname;
rmSync(www, { recursive: true, force: true }); mkdirSync(www, { recursive: true });
for (const p of ['index.html', 'manifest.webmanifest', 'sw.js', 'version.json', 'config.js', 'dist', 'css', 'icons', 'media', 'assets', 'vendor', 'privacidade', 'termos', 'suporte', 'excluir-conta'])
  cpSync(raiz + p, www + p, { recursive: true });
console.log('www pronto');
