// Compone el encargo del revisor de la spec de s1 con el texto del kit que se prueba (review-spec.md),
// como revisor único: con todos sus puntos y sin la frontera de una lente.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const [kit, spec, capability] = process.argv.slice(2);
const text = readFileSync(join(kit, 'skills/sdd-start-feature/references/review-spec.md'), 'utf8');
const start = text.indexOf('> Eres un revisor adversarial');
if (start < 0) throw new Error('sin el encargo del revisor en review-spec.md');
const brief = text.slice(start + 2, text.indexOf('\n', start))
  .replace('<dominio|técnica>', 'dominio')
  .replace('`<ruta spec.md>`', `\`${spec}\``)
  .replace('`<capacidades tocadas de capabilities/>`', `\`${capability}\``)
  .replace(/ \[lente técnica: [^\]]*\]/, '')
  .replace(' Con dos revisores, termina con la frontera de tu lente.', '');
process.stdout.write(brief);