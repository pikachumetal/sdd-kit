// node coverage.mjs <antes…> -- <después…>: párrafos de los ficheros de antes que no están en ninguno de después (espacios y almohadillas aparte).
import { readFileSync } from 'node:fs';

const args = process.argv.slice(2);
const cut = args.indexOf('--');
const norm = (p) => p.replace(/^#+\s*/gm, '').replace(/\s+/g, ' ').trim();
const paragraphs = (path) => readFileSync(path, 'utf8').replace(/\r\n/g, '\n').split(/\n\s*\n/).map(norm).filter(Boolean);
const after = new Set(args.slice(cut + 1).flatMap(paragraphs));
const afterText = [...after].join(' ');
for (const path of args.slice(0, cut))
  for (const p of paragraphs(path)) if (!after.has(p) && !afterText.includes(p)) console.log(`${path.split(/[\\/]/).pop()}: «${p.slice(0, 140)}»`);
