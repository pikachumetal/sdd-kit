// Compone el encargo de un eje de la revisión final (f3, f3n, f4) con el texto del kit que se prueba:
// el de sdd-verify si existe; si no, la cabecera de encargo-revision.md más code-reviewer.md de superpowers.
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';

const names = ['kit', 'superpowers', 'axis', 'scenario', 'package', 'sha', 'dir', 'adrs', 'caps'];
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

function sourceText() {
  const fork = join(opt.kit, `skills/sdd-verify/references/${opt.axis}-reviewer-prompt.md`);
  return existsSync(fork) ? fencedAfter(readFileSync(fork, 'utf8'), '# ', '```text') : legacyBrief();
}

function briefValues() {
  const fixed = JSON.parse(readFileSync(new URL(`./fixtures/axis-${opt.scenario}.json`, import.meta.url), 'utf8'));
  return [
    ...fixed,
    ['<ruta del paquete que imprime la receta>', opt.package],
    ['<sha>', opt.sha],
    ['<REVIEW_DIR>', opt.dir],
    ['<líneas que imprime sdd decision index --files con los ficheros del diff, o «ninguna»>', opt.adrs || 'ninguna'],
    ['<salida de sdd capability index --path .docs/sdd>', opt.caps],
    ['[BASE_SHA]', `${opt.sha}~`],
    ['[HEAD_SHA]', opt.sha],
  ];
}

let text = sourceText();
for (const [literal, value] of briefValues()) text = text.split(literal).join(value);
process.stdout.write(text);
