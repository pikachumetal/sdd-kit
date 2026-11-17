// Compara ficheros de dist/ con los de develop párrafo a párrafo, con los espacios de cada párrafo normalizados.
// node compare-dist.mjs [--base <ref>] <ruta de dist/>…
// Un salto de línea dentro de un párrafo no cuenta; un párrafo partido, juntado o con otras palabras, sí.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

const args = process.argv.slice(2);
const baseAt = args.indexOf('--base');
const base = baseAt >= 0 ? args.splice(baseAt, 2)[1] : 'develop';

const paragraphs = (text) =>
  text
    .replace(/\r\n/g, '\n')
    .split(/\n[ \t]*\n/)
    .map((p) => p.replace(/\s+/g, ' ').trim())
    .filter(Boolean);

function atBase(path) {
  try {
    return execFileSync('git', ['show', `${base}:${path}`], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  } catch {
    return '';
  }
}

function diff(a, b) {
  const t = Array.from({ length: a.length + 1 }, () => new Uint32Array(b.length + 1));
  for (let i = a.length - 1; i >= 0; i--) for (let j = b.length - 1; j >= 0; j--) t[i][j] = a[i] === b[j] ? t[i + 1][j + 1] + 1 : Math.max(t[i + 1][j], t[i][j + 1]);
  const lines = [];
  let i = 0;
  let j = 0;
  while (i < a.length || j < b.length) {
    if (i < a.length && j < b.length && a[i] === b[j]) (i++, j++);
    else if (j < b.length && (i === a.length || t[i][j + 1] >= t[i + 1][j])) lines.push(`  + ${b[j++]}`);
    else lines.push(`  - ${a[i++]}`);
  }
  return lines;
}

let changed = 0;
for (const path of args) {
  const now = existsSync(path) ? readFileSync(path, 'utf8') : '';
  const lines = diff(paragraphs(atBase(path)), paragraphs(now));
  if (lines.length) changed++;
  console.log(lines.length ? `${path}: ${lines.length} párrafos distintos\n${lines.join('\n')}` : `${path}: igual`);
}
process.exitCode = changed ? 1 : 0;
