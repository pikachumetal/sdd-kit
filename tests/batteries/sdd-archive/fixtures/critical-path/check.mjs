// Check del camino crítico del molde: compara los títulos de e2e/*.e2e.mjs con critical-path.md y con la base (develop).
// Prefijos del contrato del kit: fuera:, ya-en-base:, lista-tocada:, sin-base:. Con --extras --run pasa una vez los fuera:.
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';

const LIST = '.docs/sdd/steering/critical-path.md';
const git = (...args) => execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
const titles = (text) => [...text.matchAll(/name: '([^']+)'/g)].map((match) => match[1]);

function mergeBase() {
  try {
    return git('merge-base', 'HEAD', 'develop');
  } catch {
    return '';
  }
}

function baseText(base, file) {
  try {
    return git('show', `${base}:e2e/${file}`);
  } catch {
    return '';
  }
}

function listed() {
  if (!existsSync(LIST)) return new Set();
  return new Set([...readFileSync(LIST, 'utf8').matchAll(/`([^`]+ › [^`]+)`/g)].map((match) => match[1]));
}

function classify(base) {
  const keep = listed();
  const lines = [];
  for (const file of readdirSync('e2e').filter((name) => name.endsWith('.e2e.mjs')).sort()) {
    const before = titles(baseText(base, file));
    for (const title of titles(readFileSync(`e2e/${file}`, 'utf8'))) {
      const id = `${file} › ${title}`;
      if (!keep.has(id)) lines.push({ prefix: before.includes(title) ? 'ya-en-base:' : 'fuera:', id, file });
    }
  }
  return lines;
}

const base = mergeBase();
if (!base) {
  console.log('sin-base: no encuentro develop');
  process.exit(0);
}
const lines = classify(base);
const extras = lines.filter((line) => line.prefix === 'fuera:');
if (process.argv.includes('--extras') && process.argv.includes('--run')) {
  const files = [...new Set(extras.map((line) => `e2e/${line.file}`))];
  if (files.length === 0) {
    console.log('sin tests de feature');
    process.exit(0);
  }
  process.exit(spawnSync(process.execPath, ['e2e/run.mjs', ...files], { stdio: 'inherit' }).status ?? 1);
}
for (const line of lines) console.log(`${line.prefix} ${line.id}`);
if (spawnSync('git', ['diff', '--quiet', base, '--', LIST]).status !== 0) console.log(`lista-tocada: ${LIST}`);
process.exit(extras.length > 0 ? 1 : 0);
