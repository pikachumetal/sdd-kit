import { readFileSync, writeFileSync } from 'node:fs';
// Uso: node destinations.mjs <prov.json> <salida.md>
const [input, output] = process.argv.slice(2);
const rows = JSON.parse(readFileSync(input, 'utf8'));
const KIT = 'sdd-implement';
const NATIVE = 'sdd-implement-native';
const SUBAGENT = 'sdd-implement-subagent';
const BOTH = 'native + subagent';
const DROP = 'sale (superpowers 7.0.1 lo quitó)';

const kitSections = new Set(['Patch', 'Before each task', 'After each task', 'Deviations and rulings', 'Recovery', 'After the last task', 'Red flags — STOP']);
const subagentSections = new Set(['SDD loop', '1. Dispatch the implementer', '2. Handle the report', '3. Review the task', '4. The fix loop', '5. Complete the task']);

function destination(r) {
  const source = r.pct700 >= 80;
  if (r.section === 'Example workflows') return DROP;
  if (kitSections.has(r.section)) return r.section === 'Deviations and rulings' && r.pct700 >= 40 ? `${BOTH} (texto de superpowers) + ${KIT} (lo del kit)` : KIT;
  if (r.section === 'Native loop') return NATIVE;
  if (subagentSections.has(r.section)) return SUBAGENT;
  if (r.section === 'Finish') return `${BOTH}, con el cambio del kit marcado`;
  if (r.section === 'Overview') return source ? BOTH : KIT;
  if (r.section === 'Method') return source ? BOTH : KIT;
  if (r.section === 'Setup') {
    if (/^7\. \*\*Effort/.test(r.head) || /^With no approved/.test(r.head)) return KIT;
    if (/^5\. \*\*TDD/.test(r.head)) return `${NATIVE}, con el cambio del kit marcado`;
    return source ? BOTH : `${BOTH}, con el cambio del kit marcado`;
  }
  return KIT;
}

const where = (list) => (list && list.length ? list.join(', ') : '—');
const originOf = (r) => {
  if (r.pct700 >= 95) return 'superpowers 7.0.0';
  const parts = [];
  if (r.commit) parts.push(r.commit);
  if (r.cite) parts.push(r.cite);
  return parts.join(' · ') || 'sin localizar';
};
const esc = (s) => String(s).replace(/\|/g, '\\|');

const lines = [
  '# Origen y destino de cada regla de `sdd-implement`',
  '',
  'Generado comparando `skills/sdd-implement/SKILL.md` con `executing-plans` y `subagent-driven-development` (con sus tres prompts) de superpowers 7.0.0 y 7.0.1, por frases de 6 palabras. «% 7.0.0» es la parte del texto de la unidad que sale literal de superpowers 7.0.0; «Origen del kit» es el primer commit de `skills/` que introdujo el texto propio de la unidad (`git log -S`), y la cita de evidencia que lleva.',
  '',
  '| # | Línea | Sección | Unidad | % 7.0.0 | Dónde en 7.0.1 | Origen del kit | Destino |',
  '| --- | --- | --- | --- | --- | --- | --- | --- |',
  ...rows.map((r) => `| ${r.n} | ${r.line} | ${esc(r.section)} | ${esc(r.head.slice(0, 70))} | ${r.pct700} | ${esc(where(r.where701))} | ${esc(originOf(r))} | ${destination(r)} |`),
];
writeFileSync(output, lines.join('\n') + '\n');

const totals = {};
for (const r of rows) {
  const d = destination(r);
  const kitChars = Math.round((r.chars * (100 - r.pct700)) / 100);
  totals[d] ??= { units: 0, chars: 0, kitChars: 0 };
  totals[d].units++;
  totals[d].chars += r.chars;
  totals[d].kitChars += kitChars;
}
console.log(JSON.stringify(totals, null, 1));
