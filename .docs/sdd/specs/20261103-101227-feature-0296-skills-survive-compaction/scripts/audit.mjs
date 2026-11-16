import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

// Uso: node audit.mjs <dir de la skill del kit> <dir de las fuentes> <salida.md>
// Hoja de auditoría: unidades que mezclan texto de la fuente y del kit, con el párrafo de la fuente al lado,
// y frases absolutas de la fuente que siguen literales en la copia.
const [skillDir, sourceDir, output] = process.argv.slice(2);
const K = 6;
const norm = (t) => t.toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').split(/\s+/).filter(Boolean);
const walk = (d) => readdirSync(d).flatMap((f) => {
  const p = join(d, f);
  if (statSync(p).isDirectory()) return f === 'migrations' ? [] : walk(p);
  return f.endsWith('.md') ? [p] : [];
});

const sources = walk(sourceDir).map((f) => ({ name: relative(sourceDir, f), lines: readFileSync(f, 'utf8').replace(/\r\n/g, '\n').split('\n') }));
const shingles = new Map();
for (const s of sources) {
  const words = [];
  s.lines.forEach((line, i) => norm(line).forEach((w) => words.push([w, i])));
  for (let i = 0; i + K <= words.length; i++) {
    const key = words.slice(i, i + K).map((x) => x[0]).join(' ');
    if (!shingles.has(key)) shingles.set(key, { source: s, line: words[i][1] });
  }
}

function unitsOf(file) {
  const lines = readFileSync(file, 'utf8').replace(/\r\n/g, '\n').split('\n');
  const units = [];
  let current = null;
  let fence = false;
  const flush = () => { if (current && current.text.trim()) units.push(current); current = null; };
  lines.forEach((line, i) => {
    if (line.startsWith('```')) { fence = !fence; flush(); return; }
    if (fence) return;
    if (!line.trim() || /^#{1,4} /.test(line) || /^\| ?-/.test(line)) { flush(); return; }
    if (/^(\s*\d+\. |\s*- |\| )/.test(line) || !current) { flush(); current = { file, line: i + 1, text: '' }; }
    current.text += line + '\n';
  });
  flush();
  return units;
}

function paragraphAround(source, line) {
  let start = line;
  let end = line;
  while (start > 0 && source.lines[start - 1].trim()) start--;
  while (end < source.lines.length - 1 && source.lines[end + 1].trim()) end++;
  return source.lines.slice(start, end + 1).join(' ').replace(/\s+/g, ' ').slice(0, 700);
}

const mixed = [];
const keptSource = new Set();
for (const file of walk(skillDir)) {
  for (const unit of unitsOf(file)) {
    const words = norm(unit.text);
    if (words.length < 8) continue;
    const covered = new Array(words.length).fill(false);
    const hits = [];
    for (let i = 0; i + K <= words.length; i++) {
      const hit = shingles.get(words.slice(i, i + K).join(' '));
      if (!hit) continue;
      for (let j = i; j < i + K; j++) covered[j] = true;
      hits.push(hit);
      keptSource.add(`${hit.source.name}:${hit.line}`);
    }
    const pct = Math.round((100 * covered.filter(Boolean).length) / words.length);
    if (pct < 20 || pct >= 95) continue;
    const first = hits[0];
    mixed.push({ where: `${relative(skillDir, file)}:${unit.line}`, pct, kit: unit.text.replace(/\s+/g, ' ').trim().slice(0, 900), source: `${first.source.name}:${first.line + 1}`, sourceText: paragraphAround(first.source, first.line) });
  }
}

const absolute = /\b(only|never|always|every|must|do not|don't|no exceptions|without exception|exactly|forbidden)\b/i;
const absolutes = [];
for (const s of sources) {
  s.lines.forEach((line, i) => {
    if (!absolute.test(line) || !keptSource.has(`${s.name}:${i}`)) return;
    absolutes.push(`${s.name}:${i + 1} — ${line.trim().slice(0, 300)}`);
  });
}

const out = [`# Auditoría — ${relative(join(skillDir, '..'), skillDir)}`, '', `## Unidades que mezclan fuente y kit (${mixed.length})`, ''];
mixed.forEach((m, i) => out.push(`### M${i + 1} · ${m.where} · ${m.pct} % de la fuente`, '', `- **Copia**: ${m.kit}`, `- **Fuente** (${m.source}): ${m.sourceText}`, ''));
out.push(`## Frases absolutas de la fuente que siguen en la copia (${absolutes.length})`, '', ...absolutes.map((a) => `- ${a}`));
writeFileSync(output, out.join('\n') + '\n');
console.log(`${relative(join(skillDir, '..'), skillDir)}: ${mixed.length} mixtas, ${absolutes.length} absolutas`);
