#!/usr/bin/env node
// Verifica que toda referencia a un asset en dist/**/*.html exista realmente en dist/.
// Cubre los 7 estilos de referencia del proyecto: src=, url(), bg-[url()], poster=, href de iconos.
import { readFileSync, existsSync, statSync } from 'node:fs';
import { globSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';

const DIST = process.argv[2] || 'dist';
const EXT = 'png|jpg|jpeg|avif|svg|webp|JPG|gif|mp4|webm|ico|pdf|mp3|ogg|woff2|woff';

const files = globSync(`${DIST}/**/*.html`).filter(f => !f.includes('tour-360'));
let refs = 0, broken = [];

for (const f of files) {
  const html = readFileSync(f, 'utf8');
  const pageDir = dirname(f);
  const found = new Set();

  // src="..." / href="..." / poster="..."
  for (const m of html.matchAll(new RegExp(`(?:src|href|poster)="([^"]+\\.(?:${EXT}))"`, 'g'))) found.add(m[1]);
  // url('...') / url("...") / url(...)  -> cubre style= y bg-[url()]
  for (const m of html.matchAll(new RegExp(`url\\(\\s*['"]?([^'")]+\\.(?:${EXT}))['"]?\\s*\\)`, 'g'))) found.add(m[1]);
  // srcset
  for (const m of html.matchAll(/srcset="([^"]+)"/g)) {
    for (const part of m[1].split(',')) {
      const u = part.trim().split(/\s+/)[0];
      if (u && new RegExp(`\\.(?:${EXT})$`).test(u)) found.add(u);
    }
  }

  for (let ref of found) {
    if (/^(https?:)?\/\//.test(ref) || ref.startsWith('data:')) continue;
    refs++;
    const decoded = decodeURIComponent(ref);
    const target = decoded.startsWith('/')
      ? join(DIST, decoded)
      : resolve(pageDir, decoded);
    if (!existsSync(target) || !statSync(target).isFile()) {
      broken.push(`${f}  ->  ${ref}`);
    }
  }
}

console.log(`Paginas: ${files.length} | referencias comprobadas: ${refs}`);
if (broken.length) {
  console.log(`\n*** ${broken.length} REFERENCIAS ROTAS ***`);
  for (const b of broken) console.log('  ' + b);
  process.exit(1);
}
console.log('OK: todas las referencias resuelven.');
