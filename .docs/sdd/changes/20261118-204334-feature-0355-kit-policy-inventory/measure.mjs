import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, '..', '..', '..', '..');
const skillsRoot = join(repoRoot, 'dist', 'skills');
const outDir = join(here, 'out');
const destinations = new Set(['queda', 'skill-proyecto', 'template']);
const markers = [
  'E2E', 'end-to-end', 'Playwright', 'Flujos core', 'Títulos heredados', 'Presupuesto', 'Retries', 'Timeouts',
  'flaky', 'stress', 'estrés', 'repeat-each', 'validation', 'validación', 'guion', 'script', '§Frontend',
  'impeccable', 'screenshot', 'captura', 'Acceso a la aplicación', 'Entorno de la suite', 'Datos',
  'critical-path', 'Camino crítico', 'coverage', 'cobertura', 'lint',
];

const weakMarkers = new Set(['script', 'Datos', 'coverage', 'cobertura', 'lint']);
const fullReads = new Set([
  'sdd-tdd/references/writing-e2e.md', 'sdd-archive/references/e2e-suite.md',
  'sdd-templates/templates/operations-template.md', 'sdd-verify/references/code-reviewer-prompt.md',
  'sdd-archive/references/dev-validation.md', 'sdd-implement/references/frontend-verification.md',
  'sdd-templates/templates/validation-template.md', 'sdd-archive/references/validation-modes.md',
  'sdd-end-release/SKILL.md', 'sdd-end-release/references/versionado.md',
  'sdd-end-release/references/release-notes.md', 'sdd-archive/references/closing-suite.md',
]);
const contextLines = 3;

function words(text) {
  return text.split(/\s+/).filter(Boolean).length;
}

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return walk(path);
    return path.endsWith('.md') ? [path] : [];
  });
}

function skillFiles() {
  return walk(skillsRoot)
    .map((path) => relative(skillsRoot, path).replaceAll('\\', '/'))
    .filter((file) => !file.split('/').includes('migrations'))
    .sort();
}

function readLines(file) {
  return readFileSync(join(skillsRoot, file), 'utf8').split(/\r?\n/);
}

function headingsOf(lines) {
  const found = [];
  let inFence = false;
  lines.forEach((line, index) => {
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
    const match = !inFence && /^(#{1,6}) /.exec(line);
    if (match) found.push({ line: index + 1, level: match[1].length, text: line });
  });
  return found;
}

function hitsOf(lines) {
  return lines.flatMap((line, index) => markers
    .filter((marker) => line.toLowerCase().includes(marker.toLowerCase()))
    .map((marker) => ({ line: index + 1, marker })));
}

function sectionAround(hitLine, headings, lineCount) {
  const owner = headings.filter((h) => h.line <= hitLine).at(-1);
  if (!owner) return [1, (headings[0]?.line ?? lineCount + 1) - 1];
  const next = headings.find((h) => h.line > owner.line && h.level <= owner.level);
  return [owner.line, (next?.line ?? lineCount + 1) - 1];
}

function mergeRanges(ranges) {
  const sorted = [...ranges].sort((a, b) => a[0] - b[0]);
  return sorted.reduce((merged, range) => {
    const last = merged.at(-1);
    if (last && range[0] <= last[1] + 1) last[1] = Math.max(last[1], range[1]);
    else merged.push([...range]);
    return merged;
  }, []);
}

function readingPlan(file, lines, hits) {
  if (fullReads.has(file)) return { mode: 'entero', ranges: [[1, lines.length]] };
  const strong = hits.filter((hit) => !weakMarkers.has(hit.marker));
  if (strong.length) {
    const headings = headingsOf(lines);
    return { mode: 'seccion', ranges: mergeRanges(strong.map((hit) => sectionAround(hit.line, headings, lines.length))) };
  }
  if (hits.length) {
    const around = hits.map((hit) => [Math.max(1, hit.line - contextLines), Math.min(lines.length, hit.line + contextLines)]);
    return { mode: 'contexto', ranges: mergeRanges(around) };
  }
  return { mode: 'indice', ranges: [] };
}

function rangeWords(lines, ranges) {
  return ranges.reduce((sum, [from, to]) => sum + words(lines.slice(from - 1, to).join('\n')), 0);
}

function sweep() {
  mkdirSync(outDir, { recursive: true });
  const hitRows = ['file\tline\tmarker'];
  const headingRows = [];
  const readingRows = ['file\tmode\tranges\twords_read\twords_file'];
  const totals = { entero: 0, seccion: 0, contexto: 0, indice: 0, read: 0, all: 0 };
  for (const file of skillFiles()) {
    const lines = readLines(file);
    const hits = hitsOf(lines);
    const plan = readingPlan(file, lines, hits);
    const fileWords = words(lines.join('\n'));
    const read = rangeWords(lines, plan.ranges);
    hits.forEach((hit) => hitRows.push(`${file}\t${hit.line}\t${hit.marker}`));
    headingRows.push(`\n## ${file} (${fileWords} palabras)\n`, ...headingsOf(lines).map((h) => `- ${h.line}: ${h.text}`));
    readingRows.push(`${file}\t${plan.mode}\t${plan.ranges.map(([a, b]) => `${a}-${b}`).join(';')}\t${read}\t${fileWords}`);
    totals[plan.mode] += 1;
    totals.read += read;
    totals.all += fileWords;
  }
  writeFileSync(join(outDir, 'hits.tsv'), hitRows.join('\n') + '\n');
  writeFileSync(join(outDir, 'headings.md'), '# Encabezados por fichero\n' + headingRows.join('\n') + '\n');
  writeFileSync(join(outDir, 'reading.tsv'), readingRows.join('\n') + '\n');
  console.log(`ficheros: ${skillFiles().length} · entero: ${totals.entero} · sección: ${totals.seccion} · contexto: ${totals.contexto} · índice: ${totals.indice} · palabras leídas: ${totals.read} de ${totals.all}`);
}

function readTsv(name) {
  const path = join(here, name);
  if (!existsSync(path)) return [];
  const [header, ...rows] = readFileSync(path, 'utf8').split(/\r?\n/).filter((row) => row.trim() && !row.startsWith('#'));
  const columns = header.split('\t');
  return rows.map((row, index) => ({ row: index + 2, ...Object.fromEntries(row.split('\t').map((cell, i) => [columns[i], cell])) }));
}

function pieceError(piece, fileSet) {
  if (!fileSet.has(piece.file)) return `fichero inexistente: ${piece.file}`;
  const from = Number(piece.from);
  const to = Number(piece.to);
  if (!(from >= 1 && to >= from && to <= readLines(piece.file).length)) return `rango fuera del fichero: ${piece.from}-${piece.to}`;
  if (!destinations.has(piece.destination)) return `destino no válido: ${piece.destination}`;
  if (!piece.reason?.trim()) return 'sin motivo';
  if (!Number.isInteger(Number(piece.hook_words))) return `hook_words no es un entero: ${piece.hook_words}`;
  return null;
}

function overlaps(pieces) {
  const sorted = [...pieces].sort((a, b) => a.file.localeCompare(b.file) || Number(a.from) - Number(b.from));
  return sorted.slice(1).flatMap((piece, i) => {
    const previous = sorted[i];
    const clash = piece.file === previous.file && Number(piece.from) <= Number(previous.to);
    return clash ? [`solape en ${piece.file}: filas ${previous.row} y ${piece.row}`] : [];
  });
}

function validate(pieces) {
  const fileSet = new Set(skillFiles());
  const errors = pieces.map((piece) => [piece.row, pieceError(piece, fileSet)]).filter(([, error]) => error)
    .map(([row, error]) => `pieces.tsv fila ${row}: ${error}`);
  return [...errors, ...overlaps(pieces)];
}

function pieceWords(piece) {
  return words(readLines(piece.file).slice(Number(piece.from) - 1, Number(piece.to)).join('\n'));
}

function skillOf(file) {
  return file.split('/')[0];
}

function piecesTable(pieces) {
  const header = '| Skill | Fichero | Líneas | Destino | Motivo | Palabras | Enganche |\n| --- | --- | --- | --- | --- | --- | --- |';
  const rows = pieces.map((p) => `| ${skillOf(p.file)} | \`${p.file.split('/').slice(1).join('/')}\` | ${p.from}-${p.to} | ${p.destination} | ${p.reason} | ${pieceWords(p)} | ${p.hook_words} |`);
  return ['## Piezas', '', header, ...rows].join('\n');
}

function terrainsTable(terrains) {
  const header = '| Terreno | Ficheros | Palabras | Nota |\n| --- | --- | --- | --- |';
  const rows = terrains.map((t) => {
    const files = t.files.split(',').map((f) => f.trim());
    const total = files.reduce((sum, file) => sum + words(readLines(file).join('\n')), 0);
    return `| ${t.terrain} | ${files.map((f) => `\`${f}\``).join(', ')} | ${total} | ${t.note} |`;
  });
  return ['## Otros terrenos', '', header, ...rows].join('\n');
}

function table() {
  const pieces = readTsv('pieces.tsv');
  const errors = validate(pieces);
  if (errors.length) {
    errors.forEach((error) => console.error(error));
    process.exit(1);
  }
  const terrains = readTsv('terrains.tsv');
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'tables.md'), [piecesTable(pieces), terrainsTable(terrains)].join('\n\n') + '\n');
  console.log(`piezas: ${pieces.length} · sin destino: 0 · solapes: 0`);
}

const commands = { sweep, table };
const command = commands[process.argv[2]];
if (!command) {
  console.error('uso: node measure.mjs <sweep | table>');
  process.exit(2);
}
command();
