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

function sweepFile(file) {
  const lines = readLines(file);
  const hits = hitsOf(lines);
  const plan = readingPlan(file, lines, hits);
  const fileWords = words(lines.join('\n'));
  const read = rangeWords(lines, plan.ranges);
  return {
    mode: plan.mode,
    read,
    fileWords,
    hitRows: hits.map((hit) => `${file}\t${hit.line}\t${hit.marker}`),
    headingRows: [`\n## ${file} (${fileWords} palabras)\n`, ...headingsOf(lines).map((h) => `- ${h.line}: ${h.text}`)],
    readingRow: `${file}\t${plan.mode}\t${plan.ranges.map(([a, b]) => `${a}-${b}`).join(';')}\t${read}\t${fileWords}`,
  };
}

function sweep() {
  mkdirSync(outDir, { recursive: true });
  const results = skillFiles().map(sweepFile);
  const count = (mode) => results.filter((r) => r.mode === mode).length;
  const sum = (key) => results.reduce((total, r) => total + r[key], 0);
  writeFileSync(join(outDir, 'hits.tsv'), ['file\tline\tmarker', ...results.flatMap((r) => r.hitRows)].join('\n') + '\n');
  writeFileSync(join(outDir, 'headings.md'), '# Encabezados por fichero\n' + results.flatMap((r) => r.headingRows).join('\n') + '\n');
  writeFileSync(join(outDir, 'reading.tsv'), ['file\tmode\tranges\twords_read\twords_file', ...results.map((r) => r.readingRow)].join('\n') + '\n');
  console.log(`ficheros: ${results.length} · entero: ${count('entero')} · sección: ${count('seccion')} · contexto: ${count('contexto')} · índice: ${count('indice')} · palabras leídas: ${sum('read')} de ${sum('fileWords')}`);
}

function readTsv(name) {
  const path = join(here, name);
  if (!existsSync(path)) return [];
  const numbered = readFileSync(path, 'utf8').split(/\r?\n/).map((text, index) => ({ text, line: index + 1 }))
    .filter(({ text }) => text.trim() && !text.startsWith('#'));
  const columns = numbered[0].text.split('\t');
  return numbered.slice(1).map(({ text, line }) => ({ row: line, ...Object.fromEntries(text.split('\t').map((cell, i) => [columns[i], cell])) }));
}

function pieceError(piece, fileSet) {
  if (!fileSet.has(piece.file)) return `fichero inexistente: ${piece.file}`;
  const from = Number(piece.from);
  const to = Number(piece.to);
  if (!(from >= 1 && to >= from && to <= readLines(piece.file).length)) return `rango fuera del fichero: ${piece.from}-${piece.to}`;
  if (!destinations.has(piece.destination)) return `destino no válido: ${piece.destination}`;
  if (!piece.reason?.trim()) return 'sin motivo';
  if (!/^\d+$/.test(piece.hook_words ?? '')) return `hook_words no es un entero: ${piece.hook_words}`;
  if (Number(piece.hook_words) > 0 && !piece.hook_text?.trim()) return 'enganche sin texto';
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
  const header = '| Skill | Fichero | Líneas | Destino | Motivo | Palabras | Enganche (palabras estimadas · texto) |\n| --- | --- | --- | --- | --- | --- | --- |';
  const hook = (p) => (Number(p.hook_words) > 0 ? `${p.hook_words} · ${p.hook_text}` : '—');
  const rows = pieces.map((p) => `| ${skillOf(p.file)} | \`${p.file.split('/').slice(1).join('/')}\` | ${p.from}-${p.to} | ${p.destination} | ${p.reason} | ${pieceWords(p)} | ${hook(p)} |`);
  return ['### Piezas', '', header, ...rows].join('\n');
}

function terrainsTable(terrains) {
  const header = '| Terreno | Ficheros | Palabras | Nota |\n| --- | --- | --- | --- |';
  const rows = terrains.map((t) => {
    const files = t.files.split(',').map((f) => f.trim());
    const total = files.reduce((sum, file) => sum + words(readLines(file).join('\n')), 0);
    return `| ${t.terrain} | ${files.map((f) => `\`${f}\``).join(', ')} | ${total} | ${t.note} |`;
  });
  return ['### Otros terrenos', '', header, ...rows].join('\n');
}

function wordsBySkill() {
  const totals = new Map();
  for (const file of skillFiles()) {
    totals.set(skillOf(file), (totals.get(skillOf(file)) ?? 0) + words(readLines(file).join('\n')));
  }
  return totals;
}

function skillRows(pieces) {
  return [...wordsBySkill()].map(([skill, today]) => {
    const leaving = pieces.filter((p) => skillOf(p.file) === skill && p.destination !== 'queda');
    const out = leaving.reduce((sum, p) => sum + pieceWords(p), 0);
    const hook = leaving.reduce((sum, p) => sum + Number(p.hook_words), 0);
    return { skill, today, out, hook, net: today - out + hook };
  });
}

function skillTable(rows) {
  const header = '| Skill | Hoy | Sale | Entra (enganche, estimado) | Neto | % que sale |\n| --- | --- | --- | --- | --- | --- |';
  const sum = (key) => rows.reduce((total, row) => total + row[key], 0);
  const body = rows.filter((r) => r.out > 0).sort((a, b) => b.out - a.out)
    .map((r) => `| ${r.skill} | ${r.today} | ${r.out} | ${r.hook} | ${r.net} | ${Math.round((100 * r.out) / r.today)} % |`);
  const total = `| **Kit (24 skills)** | ${sum('today')} | ${sum('out')} | ${sum('hook')} | ${sum('net')} | ${Math.round((100 * sum('out')) / sum('today'))} % |`;
  return ['### Por skill', '', header, ...body, total].join('\n');
}

function destinationTable(pieces) {
  const header = '| Destino | Piezas | Palabras |\n| --- | --- | --- |';
  const body = [...destinations].map((d) => {
    const of = pieces.filter((p) => p.destination === d);
    return `| ${d} | ${of.length} | ${of.reduce((sum, p) => sum + pieceWords(p), 0)} |`;
  });
  return ['### Por destino', '', header, ...body].join('\n');
}

function readingSummary() {
  const rows = readTsv(join('out', 'reading.tsv'));
  const hitLinesOnly = new Set(readFileSync(join(outDir, 'hit-lines-only.txt'), 'utf8').split(/\r?\n/).filter(Boolean));
  const count = (mode) => rows.filter((r) => r.mode === mode).length;
  const read = rows.filter((r) => !hitLinesOnly.has(r.file)).reduce((sum, r) => sum + Number(r.words_read), 0);
  return `lectura: entero ${count('entero')} · sección ${count('seccion') - hitLinesOnly.size} · solo la línea del acierto ${hitLinesOnly.size} · contexto ${count('contexto')} · índice ${count('indice')} · palabras leídas (entero, sección y contexto): ${read} de ${rows.reduce((sum, r) => sum + Number(r.words_file), 0)}`;
}

function budgetTotals() {
  const source = readFileSync(join(repoRoot, 'cli', 'test', 'kit', 'word-budget.test.ts'), 'utf8');
  return new Map([...source.matchAll(/'([\w-]+)': \{ skillMd: \d+, total: (\d+) \}/g)].map((m) => [m[1], Number(m[2])]));
}

function squareErrors(rows, pieces) {
  const budgets = budgetTotals();
  const leaving = pieces.filter((p) => p.destination !== 'queda').reduce((sum, p) => sum + pieceWords(p), 0);
  const errors = rows.filter((r) => !budgets.has(r.skill) || r.today > budgets.get(r.skill))
    .map((r) => `${r.skill}: hoy ${r.today} frente al tope ${budgets.get(r.skill) ?? 'ausente'} de word-budget.test.ts`);
  if (rows.length !== budgets.size) errors.push(`skills medidas ${rows.length} frente a ${budgets.size} con tope`);
  if (rows.reduce((sum, r) => sum + r.out, 0) !== leaving) errors.push('la suma por skill de lo que sale no es la de las piezas');
  return errors;
}

function table() {
  const pieces = readTsv('pieces.tsv');
  const errors = validate(pieces);
  if (errors.length) {
    errors.forEach((error) => console.error(error));
    process.exit(1);
  }
  const terrains = readTsv('terrains.tsv');
  const rows = skillRows(pieces);
  const tables = [skillTable(rows), destinationTable(pieces), piecesTable(pieces), terrainsTable(terrains)];
  writeFileSync(join(outDir, 'tables.md'), tables.join('\n\n') + '\n');
  console.log(readingSummary());
  console.log(`piezas: ${pieces.length} · sin destino: 0 · solapes: 0`);
  const errorsOfSquare = squareErrors(rows, pieces);
  errorsOfSquare.forEach((error) => console.error(error));
  console.log(`cuadra: ${errorsOfSquare.length ? 'no' : 'sí'}`);
  if (errorsOfSquare.length) process.exit(1);
}

const commands = { sweep, table };
const command = commands[process.argv[2]];
if (!command) {
  console.error('uso: node measure.mjs <sweep | table>');
  process.exit(2);
}
command();
