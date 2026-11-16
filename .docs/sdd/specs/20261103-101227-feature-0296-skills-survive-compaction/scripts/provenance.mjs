import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

// Uso: node provenance.mjs <repo> <dir fuentes 7.0.0> <dir fuentes 7.0.1> <salida.json>
const [repo, dir700, dir701, out] = process.argv.slice(2);
const K = 6;
const norm = (t) => t.toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').split(/\s+/).filter(Boolean);

function index(files) {
  const map = new Map();
  for (const f of files) {
    const lines = readFileSync(f, 'utf8').replace(/\r\n/g, '\n').split('\n');
    const words = [];
    lines.forEach((line, i) => norm(line).forEach((w) => words.push([w, i + 1])));
    for (let i = 0; i + K <= words.length; i++) {
      const key = words.slice(i, i + K).map((x) => x[0]).join(' ');
      if (!map.has(key)) map.set(key, { file: f.split(/[\\/]/).slice(-1)[0], line: words[i][1] });
    }
  }
  return map;
}

const src700 = ['sdd.md', 'ep.md', 'implementer-prompt.md', 'task-reviewer-prompt.md', 're-review-prompt.md'].map((f) => `${dir700}/${f}`);
const src701 = ['sdd.md', 'ep.md', 'batching.md', 'cannot-verify.md', 'final-review.md', 'fix-loop.md', 'handling-reports.md', 'preflight.md', 'resuming.md', 'implementer-prompt.md', 'task-reviewer-prompt.md', 're-review-prompt.md'].map((f) => `${dir701}/${f}`);
const idx700 = index(src700);
const idx701 = index(src701);

const text = readFileSync(`${repo}/skills/sdd-implement/SKILL.md`, 'utf8').replace(/\r\n/g, '\n');
const body = text.replace(/^---\n[\s\S]*?\n---\n/, '');
const lines = body.split('\n');

const units = [];
let section = '';
let current = null;
let inFence = false;
const flush = () => { if (current && current.text.trim()) units.push(current); current = null; };
lines.forEach((line, i) => {
  const n = i + 1 + (text.split('\n').length - lines.length);
  if (line.startsWith('```')) {
    if (!inFence) { flush(); current = { section, start: n, kind: 'bloque', text: '' }; inFence = true; return; }
    inFence = false; current.text += line + '\n'; flush(); return;
  }
  if (inFence) { current.text += line + '\n'; return; }
  const h = line.match(/^(#{1,3}) (.*)/);
  if (h) { flush(); section = h[2]; return; }
  if (!line.trim()) { flush(); return; }
  const startsItem = /^(\d+\. |- |\| )/.test(line) && !/^\| ?-+/.test(line);
  if (/^\| ?(-|Excuse)/.test(line)) { flush(); return; }
  if (startsItem || !current || /^\s{3,}- /.test(line)) { flush(); current = { section, start: n, kind: line.startsWith('|') ? 'fila' : 'regla', text: '' }; }
  current.text += line + '\n';
});
flush();

function coverage(words, idx) {
  const covered = new Array(words.length).fill(false);
  const hits = new Map();
  for (let i = 0; i + K <= words.length; i++) {
    const hit = idx.get(words.slice(i, i + K).join(' '));
    if (!hit) continue;
    for (let j = i; j < i + K; j++) covered[j] = true;
    const key = hit.file;
    if (!hits.has(key)) hits.set(key, hit.line);
  }
  const pct = words.length ? Math.round((100 * covered.filter(Boolean).length) / words.length) : 0;
  return { pct, where: [...hits.entries()].map(([f, l]) => `${f}:${l}`) };
}

// La frase literal más larga del texto que no viene de la fuente: es la que busca git log -S.
function kitProbe(unit, idx) {
  const words = norm(unit.text);
  const covered = new Array(words.length).fill(false);
  for (let i = 0; i + K <= words.length; i++) if (idx.has(words.slice(i, i + K).join(' '))) for (let j = i; j < i + K; j++) covered[j] = true;
  let best = [];
  let run = [];
  words.forEach((w, i) => {
    if (covered[i]) { run = []; return; }
    run.push(w);
    if (run.length > best.length) best = [...run];
  });
  for (let size = Math.min(8, best.length); size >= 4; size--) {
    for (let start = 0; start + size <= best.length; start++) {
      const pattern = best.slice(start, start + size).map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('[^a-z0-9]+');
      const match = unit.text.match(new RegExp(pattern, 'i'));
      if (match && !match[0].includes('\n')) return match[0];
    }
  }
  return '';
}

function origin(unit, idx) {
  const cite = unit.text.match(/`tests\/[^`]+`[^)]*/g);
  const probe = kitProbe(unit, idx);
  let commit = '';
  if (probe) {
    try {
      commit = execFileSync('git', ['-C', repo, 'log', '--reverse', '--format=%h %ad %s', '--date=short', `-S${probe}`, '--', 'skills/'], { encoding: 'utf8' }).split('\n')[0];
    } catch { commit = ''; }
  }
  return { cite: cite ? cite.join('; ') : '', commit, probe };
}

const rows = units.map((u, i) => {
  const words = norm(u.text);
  const c700 = coverage(words, idx700);
  const c701 = coverage(words, idx701);
  const row = { n: i + 1, section: u.section, line: u.start, kind: u.kind, chars: u.text.length, head: u.text.replace(/\s+/g, ' ').slice(0, 90), pct700: c700.pct, where700: c700.where, pct701: c701.pct, where701: c701.where };
  if (c700.pct < 95) Object.assign(row, origin(u, idx700));
  return row;
});
writeFileSync(out, JSON.stringify(rows, null, 1));
console.log(`unidades: ${rows.length}; >=60% de superpowers 7.0.0: ${rows.filter((r) => r.pct700 >= 60).length}`);
