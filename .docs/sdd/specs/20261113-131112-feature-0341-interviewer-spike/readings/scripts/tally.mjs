// Recuentos de la lectura por fila × brazo y por sitio, con la clave. Uso: node tally.mjs <readings>
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const dir = process.argv[2];
const ARMS = ['control-a', 'control-b', 'matt', 'brainstorming', 'openspec', 'look-decide-ask'];
const SITE = { g1: 'explore', g9: 'explore', rq: 'explore', g2: 'init', g8: 'init', g3: 'propose', p1: 'propose', p2: 'propose', p3: 'propose', fp: 'propose', pe: 'propose' };
const ROWS = ['E0', 'E1', 'E2a', 'E2b', 'E3', 'E4', 'E5', 'E6', 'E7', 'Reparo forma', 'Reparo idioma'];

const key = {};
let sc = null;
for (const line of readFileSync(join(dir, 'key.md'), 'utf8').split(/\r?\n/)) {
  const h = line.match(/^## (\S+)/);
  if (h) sc = h[1];
  const m = line.match(/^\| (c\d) \| (\S+) \|/);
  if (m && sc) key[`${sc}:${m[1]}`] = m[2];
}

const cell = () => ({ pasa: 0, falla: 0, 'no aplica': 0, 'no cargó': 0, 'sin veredicto': 0 });
// Literal reading of the load rule: only a `Skill` call loads the core. These subjects read SKILL.md with cat or Read,
// and p2 and pe fall under 80 % of control subjects loading it, so they leave the recommendation.
const SKILL_ONLY_UNLOADED = new Set(['matt:g3-2', 'matt:p3-1', 'brainstorming:p1-1', 'brainstorming:p1-2', 'openspec:g3-1', 'openspec:p1-2', 'look-decide-ask:g3-1']);
const SKILL_ONLY_DROPPED = new Set(['p2', 'pe']);

const byArm = {}; // row -> arm -> counts
const byArmSkillOnly = {};
const bySite = {}; // site -> row -> arm -> counts
const byScenario = {}; // scenario -> row -> arm -> counts
for (const r of ROWS) byArm[r] = Object.fromEntries(ARMS.map((a) => [a, cell()]));
for (const r of ROWS) byArmSkillOnly[r] = Object.fromEntries(ARMS.map((a) => [a, cell()]));

for (const [file, scenario] of [['g1'], ['g9'], ['rq'], ['g2'], ['g8'], ['g3'], ['p1'], ['p2'], ['p3'], ['fp-a', 'fp'], ['fp-b', 'fp'], ['pe-a', 'pe'], ['pe-b', 'pe']].map(([f, s]) => [f, s ?? f])) {
  for (const line of readFileSync(join(dir, `${file}.md`), 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\| (c\d)-(\d) \| ([^|]+?) \| ([^|]+?) \|/);
    if (!m) continue;
    const arm = key[`${scenario}:${m[1]}`];
    const row = m[3].trim();
    const verdict = m[4].trim();
    if (!arm || !ROWS.includes(row)) throw new Error(`línea sin brazo o fila: ${line}`);
    if (!(verdict in cell())) throw new Error(`veredicto desconocido: ${line}`);
    byArm[row][arm][verdict]++;
    if (!SKILL_ONLY_DROPPED.has(scenario)) {
      byArmSkillOnly[row][arm][SKILL_ONLY_UNLOADED.has(`${arm}:${scenario}-${m[2]}`) ? 'no cargó' : verdict]++;
    }
    const site = SITE[scenario];
    bySite[site] ??= {};
    bySite[site][row] ??= Object.fromEntries(ARMS.map((a) => [a, cell()]));
    bySite[site][row][arm][verdict]++;
    byScenario[scenario] ??= {};
    byScenario[scenario][row] ??= Object.fromEntries(ARMS.map((a) => [a, cell()]));
    byScenario[scenario][row][arm][verdict]++;
  }
}

const fmt = (c) => {
  const den = c.pasa + c.falla;
  const extra = [c['no cargó'] && `${c['no cargó']} nc`, c['sin veredicto'] && `${c['sin veredicto']} sv`].filter(Boolean).join(', ');
  return den === 0 && !extra ? '—' : `${c.pasa}/${den}${extra ? ` (${extra})` : ''}`;
};
const table = (rows, data) => [
  `| Fila | ${ARMS.join(' | ')} |`,
  `| --- | ${ARMS.map(() => '---').join(' | ')} |`,
  ...rows.filter((r) => data[r]).map((r) => `| ${r} | ${ARMS.map((a) => fmt(data[r][a])).join(' | ')} |`),
].join('\n');

const out = ['# Recuentos de la lectura', '', 'Pasa/(pasa + falla) por fila y brazo; «no aplica» fuera del denominador; nc = no cargó, sv = sin veredicto. Sale de `readings/*.md` con `key.md`.', '', '## Por fila y brazo', '', table(ROWS, byArm), ''];
out.push('## Por fila y brazo, solo con `Skill` como carga', '', 'Sin `p2` ni `pe` (el control carga el núcleo con `Skill` en 1 de 4 y en 6 de 10 sujetos), y con «no cargó» los sujetos que lo leen con `cat` o `Read`.', '', table(ROWS, byArmSkillOnly), '');
for (const site of ['explore', 'init', 'propose']) out.push(`## Sitio: ${site}`, '', table(ROWS, bySite[site]), '');
for (const s of Object.keys(SITE)) out.push(`## Escenario: ${s}`, '', table(ROWS, byScenario[s]), '');
writeFileSync(join(dir, 'totales.md'), out.join('\n'));
console.log(table(ROWS, byArm));
