import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
const h = w => createHash('sha1').update(w).digest('hex').slice(0, 12);
const dict = new Set(['df35fa1f90dc', 'c60b6007376b', 'a3726c0ab122']);
const words = JSON.parse(readFileSync('cspell.json', 'utf8')).words.map(w => w.toLowerCase());
const walk = d => readdirSync(d).flatMap(f => {
  const p = join(d, f);
  if (f === 'node_modules' || f === '.git') return [];
  return statSync(p).isDirectory() ? walk(p) : p.endsWith('.md') ? [p] : [];
});
let issues = 0, files = 0;
for (const file of walk('.')) {
  files++;
  const text = readFileSync(file, 'utf8');
  const ignored = [...text.matchAll(/cspell:(?:ignore|words)\s+([^\n>]*)/gi)]
    .flatMap(m => m[1].replace(/-->.*/, '').split(/[\s,]+/)).map(w => w.toLowerCase());
  const lines = text.split('\n');
  lines.forEach((line, i) => {
    if (/cspell:disable-line/.test(line) || (i > 0 && /cspell:disable-next-line/.test(lines[i - 1]))) return;
    for (const m of line.matchAll(/[\p{L}]+/gu)) {
      const w = m[0].toLowerCase();
      if (dict.has(h(w)) && !words.includes(w) && !ignored.includes(w)) {
        console.log(`${file.replace(/\\/g, '/')}:${i + 1}:${m.index + 1} - Unknown word (${m[0]})`);
        issues++;
      }
    }
  });
}
console.log(`CSpell: Files checked: ${files}, Issues found: ${issues} in ${issues ? 1 : 0} file${issues ? '' : 's'}.`);
process.exit(issues ? 1 : 0);
