// Compone el encargo de un eje de la revisión final (f3, f4) con el texto del kit que se prueba:
// el de sdd-verify si existe; si no, la cabecera de encargo-revision.md más code-reviewer.md de superpowers.
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const [kit, superpowers, axis, values] = process.argv.slice(2);
const fill = JSON.parse(readFileSync(values, 'utf8'));

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
  const brief = readFileSync(join(kit, 'skills/sdd-start-feature/references/encargo-revision.md'), 'utf8');
  const header = fencedAfter(brief, '# Encargo de revisión', '```markdown').replace(/<plantilla de superpowers a partir de aquí>\s*$/, '');
  const howTo = fencedAfter(brief, 'Tras la cabecera y antes de', '```markdown');
  const focus = axis === 'spec' ? fencedAfter(brief, 'tras «Cómo revisar» va esta sección', '```markdown') + '\n' : '';
  const reviewer = readFileSync(join(superpowers, 'skills/requesting-code-review/code-reviewer.md'), 'utf8');
  return header + howTo + '\n' + focus + dedent(fencedAfter(reviewer, 'prompt: |', 'prompt: |'), 4);
}

function sourceText() {
  const fork = join(kit, `skills/sdd-verify/references/${axis}-reviewer-prompt.md`);
  return existsSync(fork) ? fencedAfter(readFileSync(fork, 'utf8'), '# ', '```text') : legacyBrief();
}

let text = sourceText();
for (const [literal, value] of fill) text = text.split(literal).join(value);
process.stdout.write(text);
