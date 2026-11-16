// Compone el encargo del revisor de la spec de s1 con el texto del kit que se prueba (review-spec.md),
// como revisor único: con todos sus puntos y sin la frontera de una lente.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const [kit, spec, capability] = process.argv.slice(2);
const text = readFileSync(join(kit, 'skills/sdd-propose/references/review-spec.md'), 'utf8');
const start = text.indexOf('> You are an adversarial reviewer');
if (start < 0) throw new Error('sin el encargo del revisor en review-spec.md');
const brief = text.slice(start + 2, text.indexOf('\n', start))
  .replace('<domain|technical>', 'domain')
  .replace('`<path of spec.md>`', `\`${spec}\``)
  .replace('`<touched capabilities from capabilities/>`', `\`${capability}\``)
  .replace(/ \[technical lens: [^\]]*\]/, '')
  .replace(" With two reviewers, end with your lens's frontier.", '');
process.stdout.write(brief);
