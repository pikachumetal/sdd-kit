// Busca texto copiado: frases de 8 palabras que un .md del kit comparte con otro fichero.
// Uso: node provenance-scan.mjs scan <skills-dir> <upstream-dir>      pares con 5 o más frases en común
//      node provenance-scan.mjs compare <fichero-del-kit> <fichero…>   frases en común con cada fichero
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const PHRASE_WORDS = 8;
const MIN_SHARED = 5;
const SKIPPED_DIRS = new Set(['.git', 'node_modules']);

function markdownFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return SKIPPED_DIRS.has(entry.name) ? [] : markdownFiles(path);
    return entry.name.endsWith('.md') ? [path] : [];
  });
}

function phrases(text) {
  const words = text.toLowerCase().match(/[a-z0-9']+/g) ?? [];
  const found = new Set();
  for (let i = 0; i + PHRASE_WORDS <= words.length; i++) found.add(words.slice(i, i + PHRASE_WORDS).join(' '));
  return found;
}

function indexKit(skillsDir) {
  const index = new Map();
  for (const file of markdownFiles(skillsDir)) {
    for (const phrase of phrases(readFileSync(file, 'utf8'))) {
      if (!index.has(phrase)) index.set(phrase, new Set());
      index.get(phrase).add(relative(skillsDir, file));
    }
  }
  return index;
}

function sharedCounts(kitIndex, upstreamFile) {
  const counts = new Map();
  for (const phrase of phrases(readFileSync(upstreamFile, 'utf8'))) {
    for (const kitFile of kitIndex.get(phrase) ?? []) counts.set(kitFile, (counts.get(kitFile) ?? 0) + 1);
  }
  return counts;
}

function scan(skillsDir, upstreamDir) {
  const kitIndex = indexKit(skillsDir);
  const pairs = [];
  for (const upstreamFile of markdownFiles(upstreamDir)) {
    for (const [kitFile, shared] of sharedCounts(kitIndex, upstreamFile)) {
      if (shared >= MIN_SHARED) pairs.push({ kitFile, upstream: relative(upstreamDir, upstreamFile), shared });
    }
  }
  pairs.sort((a, b) => b.shared - a.shared || a.kitFile.localeCompare(b.kitFile));
  for (const pair of pairs) console.log(`${pair.kitFile.replaceAll('\\', '/')} → ${pair.upstream.replaceAll('\\', '/')} · ${pair.shared}`);
}

function compare(kitFile, others) {
  const kitPhrases = phrases(readFileSync(kitFile, 'utf8'));
  for (const other of others) {
    const shared = [...phrases(readFileSync(other, 'utf8'))].filter((phrase) => kitPhrases.has(phrase)).length;
    console.log(`${other} · ${shared}`);
  }
}

const [mode, ...args] = process.argv.slice(2);
if (mode === 'scan' && args.length === 2) scan(args[0], args[1]);
else if (mode === 'compare' && args.length >= 2) compare(args[0], args.slice(1));
else {
  console.error('Uso: node provenance-scan.mjs scan <skills-dir> <upstream-dir> | compare <fichero-del-kit> <fichero…>');
  process.exit(2);
}
