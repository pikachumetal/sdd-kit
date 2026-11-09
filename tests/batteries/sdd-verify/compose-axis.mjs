// Compone el encargo de un eje de la revisión final (f3, f3n, f4, f5, f6, f6b) con el texto del kit que se prueba:
// el de sdd-verify si existe; si no, la cabecera de encargo-revision.md más code-reviewer.md de superpowers.
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import { WHOLE_LINE_MARK } from '../../../build/dist.ts';

const names = ['kit', 'superpowers', 'axis', 'scenario', 'package', 'sha', 'dir', 'adrs', 'caps', 'comments'];
const { values: opt } = parseArgs({ options: Object.fromEntries(names.map((name) => [name, { type: 'string', default: '' }])) });

function fencedAfter(text, marker, fence) {
  const at = text.indexOf(marker);
  const start = at < 0 ? -1 : text.indexOf(fence, at);
  if (start < 0) throw new Error(`sin «${marker}» seguido de «${fence}»: el encargo saldría vacío`);
  const end = text.indexOf('\n```', start + fence.length);
  return text.slice(text.indexOf('\n', start) + 1, end);
}

function dedent(block, spaces) {
  return block.split('\n').map((line) => line.slice(spaces)).join('\n');
}

function legacyBrief() {
  const brief = readFileSync(join(opt.kit, 'skills/sdd-start-feature/references/encargo-revision.md'), 'utf8');
  const header = fencedAfter(brief, '# Encargo de revisión', '```markdown').replace(/<plantilla de superpowers a partir de aquí>\s*$/, '');
  const howTo = fencedAfter(brief, 'Tras la cabecera y antes de', '```markdown');
  const focus = opt.axis === 'spec' ? fencedAfter(brief, 'tras «Cómo revisar» va esta sección', '```markdown') + '\n' : '';
  const reviewer = readFileSync(join(opt.superpowers, 'skills/requesting-code-review/code-reviewer.md'), 'utf8');
  return header + howTo + '\n' + focus + dedent(fencedAfter(reviewer, 'prompt: |', 'prompt: |'), 4);
}

// Las marcas del kit no viajan: el encargo sale como lo deja el build.
const withoutMarks = (text) => text.split('\n').filter((line) => !WHOLE_LINE_MARK.test(line)).join('\n');

function sourceText() {
  const fork = join(opt.kit, `skills/sdd-verify/references/${opt.axis}-reviewer-prompt.md`);
  if (!existsSync(fork)) return legacyBrief();
  const text = withoutMarks(readFileSync(fork, 'utf8'));
  // El encargo de código sigue la forma de code-reviewer.md de superpowers: las instrucciones van en prompt: |, sangradas.
  return text.includes('  prompt: |') ? dedent(fencedAfter(text, 'prompt: |', 'prompt: |'), 4) : fencedAfter(text, '# ', '```text');
}

// El kit en inglés nombra igual los huecos que los fixtures guardan en castellano, del kit anterior.
const ENGLISH_HOLES = {
  '<copia literal del bloque «De código» de las Restricciones globales de plan.md, artículo de calidad de código incluido; en modo lite, sin plan: el artículo de calidad de código de la constitution, literal>':
    "<literal copy of the «De código» block of plan.md's Restricciones globales, the code quality article included; in lite mode, without a plan: the constitution's code quality article, literal>",
  '<copia literal de la sección `## Review Focus` del plan: todas sus líneas, enteras>': "<literal copy of the plan's `## Review Focus` section: all its lines, whole>",
  '<ruta del paquete que imprime la receta>': '<path of the package the recipe prints>',
};
const UNFILLED = [...Object.keys(ENGLISH_HOLES), ...Object.values(ENGLISH_HOLES)];

function withEnglishHoles(pairs) {
  return pairs.flatMap(([literal, value]) => (ENGLISH_HOLES[literal] ? [[literal, value], [ENGLISH_HOLES[literal], value]] : [[literal, value]]));
}

function briefValues() {
  const fixed = JSON.parse(readFileSync(new URL(`./fixtures/axis-${opt.scenario}.json`, import.meta.url), 'utf8'));
  return withEnglishHoles([
    ...fixed,
    ['<ruta del paquete que imprime la receta>', opt.package],
    ['<sha>', opt.sha],
    ['<REVIEW_DIR>', opt.dir],
    ['<líneas que imprime sdd decision index --files con los ficheros del diff, o «ninguna»>', opt.adrs || 'ninguna'],
    ['<salida de sdd capability index --path .docs/sdd>', opt.caps],
    ['<la salida de `sdd review comments`, literal>', opt.comments],
    ['[BASE_SHA]', `${opt.sha}~`],
    ['[HEAD_SHA]', opt.sha],
  ]);
}

let text = sourceText();
for (const [literal, value] of briefValues()) text = text.split(literal).join(value);
const unfilled = UNFILLED.filter((hole) => text.includes(hole));
if (unfilled.length > 0) throw new Error(`el encargo saldría con huecos sin rellenar: ${unfilled.join(' · ')}`);
process.stdout.write(text);
