// Comprueba la lectura: cada sujeto tiene una línea por fila de su escenario, y los encargos no nombran el brazo.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const [readings, inputs] = process.argv.slice(2);
const R = ['Reparo forma', 'Reparo idioma'];
const ROWS = {
  g1: ['E0', 'E2a', 'E2b', 'E4', 'E5', ...R], g9: ['E0', 'E2a', 'E2b', 'E4', 'E5', ...R], rq: ['E0', 'E2a', 'E2b', 'E4', 'E5', ...R],
  g2: ['E0', 'E5', 'E6', ...R], g8: ['E0', 'E2a', 'E2b', 'E5', 'E6', ...R], g3: ['E0', 'E2a', 'E2b', 'E4', 'E5', ...R],
  p1: ['E0', 'E2a', 'E2b', 'E5', 'E6', ...R], p2: ['E0', 'E2a', 'E2b', 'E3', 'E5', ...R], p3: ['E0', 'E2a', 'E2b', 'E3', 'E5', ...R],
  fp: ['E0', 'E1', 'E2a', 'E2b', 'E3', 'E5', ...R], pe: ['E0', 'E2a', 'E2b', 'E3', 'E5', 'E7', ...R],
};
let errors = 0;
for (const reader of readdirSync(inputs).filter((d) => !d.endsWith('.md'))) {
  const scenario = reader.replace(/-[ab]$/, '');
  const subjects = readdirSync(join(inputs, reader)).map((f) => f.replace('.transcript.txt', ''));
  const lines = readFileSync(join(readings, `${reader}.md`), 'utf8').split(/\r?\n/);
  for (const s of subjects) {
    const rows = lines.filter((l) => l.startsWith(`| ${s} |`)).map((l) => l.split('|')[2].trim());
    const want = ROWS[scenario];
    if (rows.length !== want.length || want.some((r) => !rows.includes(r))) {
      console.log(`${reader} ${s}: filas ${rows.join(',')} ≠ ${want.join(',')}`);
      errors++;
    }
  }
  for (const f of readdirSync(join(inputs, reader))) {
    if (/kit-(control|matt|brainstorming|openspec|look)|control-a|control-b|look-decide-ask/.test(readFileSync(join(inputs, reader, f), 'utf8'))) {
      console.log(`${reader}/${f}: nombra un brazo`);
      errors++;
    }
  }
  console.log(`${reader}: ${subjects.length} sujetos`);
}
if (errors) process.exit(1);
console.log('lectura completa, sin fugas de la clave');
