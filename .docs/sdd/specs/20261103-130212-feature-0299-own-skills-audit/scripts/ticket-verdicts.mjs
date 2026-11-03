import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

// Uso: node ticket-verdicts.mjs <tickets.md> <salida.md> [commit]
// Un veredicto por unidad con cita de ticket. Las leídas a mano van en READ; las demás se deciden por
// git log -S: si cada frase con cita nace en el commit de la primera frase de su unidad, la cita es la
// evidencia del Art. I. Una unidad sin origen rastreable y sin veredicto leído para el script.
const [input, output, commit = '8e22a49f'] = process.argv.slice(2);
const TICKET = /tests\/[\w./-]*-(red|green)\.md|field-reports\/|ticket (de|of) (la|el|the) |dev-lead, 20\d\d/i;
const MIN_PROBE = 12;
const SITE = 'sitio de un hallazgo';
const PRECISES = 'descartado (leída): la frase con cita precisa su propia regla sin repetir otra';
const CITE_ONLY = 'descartado (leída): la cita va sola, tras la frase que sostiene; es la evidencia del Art. I';
const READ = {
  T1: `${SITE}: K11`, T2: `${SITE}: K26`, T12: 'hallazgo K3', T20: `${SITE}: K11`, T21: 'hallazgo K4', T28: 'hallazgo K19',
  T31: 'hallazgo K8', T35: `${SITE}: P1`, T37: 'hallazgo K17', T40: `${SITE}: K15`, T44: `${SITE}: K20`, T45: `${SITE}: K20`,
  T46: `${SITE}: P14`, T47: `${SITE}: K16`, T59: `${SITE}: P2`, T60: `${SITE}: P1`, T61: `${SITE}: P3`, T62: `${SITE}: P5`,
  T67: `${SITE}: P14`, T68: `${SITE}: K13`, T69: 'hallazgo K32',
  T43: 'descartado: la frase y su cita nacen juntas en `9e0fc16a` (`sdd-start-feature`), antes K22',
  T13: PRECISES, T14: PRECISES, T15: PRECISES, T24: PRECISES, T29: PRECISES, T36: PRECISES, T63: PRECISES,
  T22: CITE_ONLY, T23: CITE_ONLY, T56: CITE_ONLY,
  T27: 'descartado (leída): nota de procedencia del encargo, no una regla',
  T50: 'descartado (leída): la frase con cita es la medida que sostiene la regla anterior',
  T77: 'descartado (leída): productor/consumidor con `implementer-prompt.md:126` (E30)',
};
const BORN_TOGETHER = 'descartado: nace con su regla, la cita es la evidencia del Art. I';
const ADDED = 'descartado (leída): la frase con cita, añadida después, precisa su regla sin repetir otra';

const git = (...args) => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 1 << 26 }).trim();
const cache = new Map();
const linesOf = (p) => cache.get(p) ?? cache.set(p, git('show', `${commit}:${p}`).replace(/\r\n/g, '\n').split('\n')).get(p);
const probe = (s) => s.replace(/\(`?tests\/[^)]*\)|\([^)]*field-reports[^)]*\)/g, '').trim().slice(0, 60);

function unitText(path, line) {
  const lines = linesOf(path);
  const out = [lines[line - 1]];
  for (let i = line; i < lines.length && lines[i].trim() && !/^(\s*\d+\. |\s*- |\| |#)/.test(lines[i]); i++) out.push(lines[i]);
  return out.join(' ');
}

function origin(path, sentence) {
  if (probe(sentence).length < MIN_PROBE) return null;
  return git('log', commit, '--reverse', '--format=%h', '-S', probe(sentence), '--', path).split('\n')[0] || null;
}

function verdict(id, path, line) {
  if (READ[id]) return READ[id];
  const sentences = unitText(path, line).split(/(?<=[.;])\s+(?=[A-Z«*`(¿])/);
  const first = origin(path, sentences[0]);
  const cited = sentences.filter((s) => TICKET.test(s)).map((s) => origin(path, s));
  if (!first || cited.includes(null)) throw new Error(`${id}: sin origen rastreable y sin veredicto leído`);
  return cited.every((o) => o === first) ? BORN_TOGETHER : ADDED;
}

const rows = readFileSync(input, 'utf8').split('\n').map((l) => /^- (T\d+) · skills\/(\S+):(\d+)/.exec(l)).filter(Boolean);
const out = rows.map(([, id, path, line]) => `- ${id} · \`skills/${path}:${line}\` · ${verdict(id, `skills/${path}`, +line)}`);
const tally = [...Map.groupBy(out, (l) => l.split(' · ').slice(2).join(' · ').replace(/:.*$/, ''))].map(([k, v]) => `${k}: ${v.length}`);
out.push('', `Total: ${rows.length} unidades`, ...tally.map((t) => `- ${t}`));
writeFileSync(output, `# Veredicto por cita de ticket — skills/ en ${commit}\n\n${out.join('\n')}\n`);
console.log([`Total: ${rows.length} unidades`, ...tally].join('\n'));
