// Compone el encargo del implementador de r1 y r5 con el texto del kit que se prueba:
// el fork de sdd-implement si existe; si no, la cabecera de encargo-revision.md más el prompt de superpowers.
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const [kit, superpowers, values] = process.argv.slice(2);
const fill = JSON.parse(readFileSync(values, 'utf8'));

function fencedAfter(text, marker, fence) {
  const start = text.indexOf(fence, text.indexOf(marker));
  const end = text.indexOf('\n```', start + fence.length);
  return text.slice(text.indexOf('\n', start) + 1, end);
}

function dedent(block, spaces) {
  return block.split('\n').map((line) => line.slice(spaces)).join('\n');
}

function sourceText() {
  const fork = join(kit, 'skills/sdd-implement/references/implementer-prompt.md');
  if (existsSync(fork)) return fencedAfter(readFileSync(fork, 'utf8'), '# ', '```text');
  const header = fencedAfter(readFileSync(join(kit, 'skills/sdd-start-feature/references/encargo-revision.md'), 'utf8'), '## Encargo del implementador', '```markdown');
  const prompt = readFileSync(join(superpowers, 'skills/subagent-driven-development/implementer-prompt.md'), 'utf8');
  const body = dedent(fencedAfter(prompt, "prompt: |", "prompt: |"), 4);
  return header.replace(/<sdd task brief a partir de aquí>\s*$/, '') + '\n' + body;
}

let text = sourceText();
for (const [literal, value] of fill) text = text.split(literal).join(value);
process.stdout.write(text);
