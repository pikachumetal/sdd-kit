import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

// Uso: node render.mjs <hallazgos.json> <salida.md> [commit]
// Cada hallazgo confirmado a mano se escribe con la frase literal que contiene su clave, su fichero:línea
// y el sha de git blame de esa línea, leídos del commit base, para que la cita no dependa de la memoria.
const [input, output, commit = '8e22a49f'] = process.argv.slice(2);
const SEARCH_WINDOW = 12;
const git = (...args) => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 1 << 26 });
const cache = new Map();

function linesOf(path) {
  if (!cache.has(path)) cache.set(path, git('show', `${commit}:${path}`).replace(/\r\n/g, '\n').split('\n'));
  return cache.get(path);
}

function sentenceWith(text, key) {
  const previousStop = text.lastIndexOf('. ', text.indexOf(key));
  const start = previousStop === -1 ? 0 : previousStop + 2;
  const endDot = text.indexOf('. ', text.indexOf(key) + key.length);
  return text.slice(start, endDot === -1 ? undefined : endDot + 1).trim().replace(/^[-|>\s\d.]+/, '');
}

function locate(site) {
  const lines = linesOf(site.p);
  for (let n = site.l; n < site.l + SEARCH_WINDOW && n <= lines.length; n++) {
    if (!lines[n - 1].includes(site.k)) continue;
    const sha = git('blame', '--porcelain', '-L', `${n},${n}`, commit, '--', site.p).slice(0, 8);
    return `\`${site.p}:${n}\` · \`${sha}\` · «${sentenceWith(lines[n - 1], site.k)}»`;
  }
  throw new Error(`clave no encontrada: ${site.p}:${site.l} «${site.k}»`);
}

function render(finding) {
  const sites = finding.sites.map((site, i) => `  - ${String.fromCharCode(65 + i)}: ${locate(site)}`);
  return [`- **${finding.id} · ${finding.type} · ${finding.dist}** — ${finding.note}`, ...sites].join('\n');
}

const findings = JSON.parse(readFileSync(input, 'utf8'));
const bySkill = Map.groupBy(findings, (f) => f.skill);
const out = [...bySkill].flatMap(([skill, list]) => [`### ${skill}`, '', ...list.map(render), '']);
writeFileSync(output, out.join('\n'));
console.log(`hallazgos: ${findings.length} · skills: ${bySkill.size}`);
