import { readFileSync } from 'node:fs';
const [target, ...sources] = process.argv.slice(2);
const norm = (t) => t.toLowerCase().replace(/[^a-z0-9áéíóúñ ]+/g, ' ').split(/\s+/).filter(Boolean);
const K = 6;
const shingles = new Set();
for (const s of sources) {
  const w = norm(readFileSync(s, 'utf8'));
  for (let i = 0; i + K <= w.length; i++) shingles.add(w.slice(i, i + K).join(' '));
}
const text = readFileSync(target, 'utf8').replace(/\r\n/g, '\n');
let fromSource = 0;
let total = 0;
const bySection = new Map();
let section = 'top';
for (const para of text.split(/\n(?=#{2,3} )/)) {
  const h = para.match(/^#{2,3} (.*)/);
  if (h) section = h[1].slice(0, 40);
  const w = norm(para);
  const covered = new Array(w.length).fill(false);
  for (let i = 0; i + K <= w.length; i++) if (shingles.has(w.slice(i, i + K).join(' '))) for (let j = i; j < i + K; j++) covered[j] = true;
  const c = covered.filter(Boolean).length;
  fromSource += c; total += w.length;
  bySection.set(section, [c, w.length, para.length]);
}
for (const [k, [c, n, chars]] of bySection) console.log(String(chars).padStart(6), String(Math.round((100 * c) / Math.max(n, 1))).padStart(3) + '%', k);
console.log(`palabras de la fuente: ${fromSource}/${total} = ${Math.round((100 * fromSource) / total)}%`);
