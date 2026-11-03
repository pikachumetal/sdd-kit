import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
// Uso: node kept.mjs <dir de la skill del kit> <fichero fuente>...
// Mide qué parte de las palabras de la fuente sigue literal (frases de 6 palabras) en la skill del kit.
const [skillDir, ...sources] = process.argv.slice(2);
const norm = (t) => t.toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').split(/\s+/).filter(Boolean);
const K = 6;
const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : f.endsWith('.md') ? [join(d, f)] : []));
const kit = new Set();
for (const f of walk(skillDir)) {
  const w = norm(readFileSync(f, 'utf8'));
  for (let i = 0; i + K <= w.length; i++) kit.add(w.slice(i, i + K).join(' '));
}
let kept = 0, total = 0;
for (const s of sources) {
  const w = norm(readFileSync(s, 'utf8'));
  const covered = new Array(w.length).fill(false);
  for (let i = 0; i + K <= w.length; i++) if (kit.has(w.slice(i, i + K).join(' '))) for (let j = i; j < i + K; j++) covered[j] = true;
  const c = covered.filter(Boolean).length;
  console.log(`  ${s.split(/[\\/]/).slice(-2).join('/')}: ${Math.round((100 * c) / w.length)}% de ${w.length} palabras`);
  kept += c; total += w.length;
}
console.log(`  total: ${Math.round((100 * kept) / total)}% del texto de la fuente sigue literal`);
