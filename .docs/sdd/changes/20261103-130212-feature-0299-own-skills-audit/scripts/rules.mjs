import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// Uso: node rules.mjs <raíz del repo> <carpeta de salida> [commit]
// Candidatos de las tres reglas del dev-lead en skills/ de un commit: excepciones con su absoluta,
// frases de 6 palabras repetidas en dos sitios y unidades que citan un ticket, con el sha de git blame.
const [repoRoot, outDir, commit = '8e22a49f'] = process.argv.slice(2);
const SHINGLE = 6;
const MIN_SHARED_WORDS = 2;
const EXCEPTION = /\b(except|unless|not an exception|instead of|exception)\b/i;
const ABSOLUTE = /\b(only|never|always|must|every)\b/i;
const TICKET = /tests\/[\w./-]*-(red|green)\.md|field-reports\/|ticket (de|of) (la|el|the) |dev-lead, 20\d\d/i;
const MIN_SHARED_PHRASES = 5;
const STOPWORDS = new Set('about after again before being below between could doesn either every other their there these those through under until where which while would should never always unless except instead first second third without within before still never'.split(' '));

const git = (...args) => execFileSync('git', ['-C', repoRoot, ...args], { encoding: 'utf8', maxBuffer: 1 << 28 });
const norm = (text) => text.toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').split(/\s+/).filter(Boolean);
const contentWords = (text) => new Set(norm(text).filter((w) => w.length >= 5 && !STOPWORDS.has(w)));
const skillOf = (path) => path.split('/')[1];
const clip = (text) => text.replace(/\s+/g, ' ').trim().slice(0, 400);

function listFiles() {
  return git('ls-tree', '-r', '--name-only', commit, 'skills')
    .split('\n')
    .filter((p) => p.endsWith('.md') && !p.includes('/migrations/') && !p.endsWith('NOTICE.md'));
}

function blameOf(path) {
  const shas = [];
  let current = null;
  for (const line of git('blame', '--porcelain', commit, '--', path).split('\n')) {
    const header = /^([0-9a-f]{40}) \d+ (\d+)/.exec(line);
    if (header) current = { sha: header[1].slice(0, 8), line: Number(header[2]) };
    else if (line.startsWith('\t') && current) shas[current.line] = current.sha;
  }
  return shas;
}

function unitsOf(path) {
  const lines = git('show', `${commit}:${path}`).replace(/\r\n/g, '\n').split('\n');
  const units = [];
  let state = { section: '(inicio)', fence: false, current: null };
  const flush = () => { if (state.current?.text.trim()) units.push(state.current); state.current = null; };
  lines.forEach((line, i) => {
    if (line.startsWith('```')) { state.fence = !state.fence; flush(); return; }
    if (state.fence) return;
    if (/^#{1,4} /.test(line)) { flush(); state.section = line.replace(/^#+ /, ''); return; }
    if (!line.trim() || /^\| ?-/.test(line)) { flush(); return; }
    if (/^(\s*\d+\. |\s*- |\| )/.test(line) || !state.current) { flush(); state.current = { path, line: i + 1, section: state.section, text: '' }; }
    state.current.text += line + '\n';
  });
  flush();
  return units;
}

function distance(a, b) {
  if (a === b) return 'unidad';
  if (skillOf(a.path) !== skillOf(b.path)) return 'otra skill';
  if (a.path !== b.path) return 'skill';
  return a.section === b.section ? 'sección' : 'otra sección';
}

const DISTANCE_RANK = { unidad: 0, 'sección': 1, 'otra sección': 2, skill: 3, 'otra skill': 4 };

function bestAbsolute(unit, absolutes) {
  if (ABSOLUTE.test(unit.text)) return { unit, shared: [] };
  const words = contentWords(unit.text);
  let best = null;
  for (const other of absolutes) {
    if (other === unit) continue;
    const shared = [...contentWords(other.text)].filter((w) => words.has(w));
    if (shared.length < MIN_SHARED_WORDS) continue;
    const score = shared.length * 10 - DISTANCE_RANK[distance(unit, other)];
    if (!best || score > best.score) best = { unit: other, shared, score };
  }
  return best;
}

function sharedRuns(units) {
  const seen = new Map();
  const runs = new Map();
  for (const unit of units) {
    const words = norm(unit.text);
    for (let i = 0; i + SHINGLE <= words.length; i++) {
      const key = words.slice(i, i + SHINGLE).join(' ');
      const first = seen.get(key);
      if (!first) { seen.set(key, unit); continue; }
      if (first === unit) continue;
      const pair = `${first.path}:${first.line}|${unit.path}:${unit.line}`;
      if (!runs.has(pair)) runs.set(pair, { a: first, b: unit, phrases: new Set() });
      runs.get(pair).phrases.add(key);
    }
  }
  return [...runs.values()];
}

function makeCite(blames) {
  return (unit) => `skills/${unit.path.slice('skills/'.length)}:${unit.line} · ${blames.get(unit.path)[unit.line] ?? '?'}`;
}

function exceptionReport(units, cite) {
  const absolutes = units.filter((u) => ABSOLUTE.test(u.text));
  const out = [];
  units.filter((u) => EXCEPTION.test(u.text)).forEach((unit, i) => {
    const partner = bestAbsolute(unit, absolutes);
    out.push(`- E${i + 1} · ${cite(unit)} · «${clip(unit.text)}»`);
    if (!partner) out.push('  - ↔ sin absoluta con el mismo sujeto');
    else out.push(`  - ↔ ${cite(partner.unit)} · ${distance(unit, partner.unit)} · comunes: ${partner.shared.slice(0, 6).join(', ') || '—'} · «${clip(partner.unit.text)}»`);
  });
  return out;
}

function sharedReports(units, cite) {
  const entries = sharedRuns(units)
    .sort((x, y) => y.phrases.size - x.phrases.size)
    .map((run, i) => ({ size: run.phrases.size, lines: [
      `- S${i + 1} · ${run.phrases.size} frases · ${distance(run.a, run.b)} · ${cite(run.a)} ↔ ${cite(run.b)}`,
      `  - «${clip(run.a.text)}»`,
      `  - «${clip(run.b.text)}»`,
    ] }));
  const pick = (keep) => entries.filter((e) => keep(e.size)).flatMap((e) => e.lines);
  return { shared: pick((n) => n >= MIN_SHARED_PHRASES), 'shared-low': pick((n) => n < MIN_SHARED_PHRASES) };
}

function ticketReport(units, cite) {
  return units.filter((u) => TICKET.test(u.text)).map((unit, i) => `- T${i + 1} · ${cite(unit)} · «${clip(unit.text)}»`);
}

function main() {
  const files = listFiles();
  const blames = new Map(files.map((f) => [f, blameOf(f)]));
  const units = files.flatMap(unitsOf).filter((u) => norm(u.text).length >= 6);
  const cite = makeCite(blames);
  const reports = { exceptions: exceptionReport(units, cite), ...sharedReports(units, cite), tickets: ticketReport(units, cite) };
  mkdirSync(outDir, { recursive: true });
  for (const [name, lines] of Object.entries(reports)) {
    writeFileSync(join(outDir, `${name}.md`), `# ${name} — skills/ en ${commit}\n\n${lines.join('\n')}\n`);
  }
  const count = (lines, prefix) => lines.filter((l) => l.startsWith(`- ${prefix}`)).length;
  console.log(`ficheros: ${files.length} · unidades: ${units.length} · excepciones: ${count(reports.exceptions, 'E')} · compartidas: ${count(reports.shared, 'S')} (+${count(reports['shared-low'], 'S')} bajo el umbral) · tickets: ${count(reports.tickets, 'T')}`);
}

main();
