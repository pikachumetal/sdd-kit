// Escribe THIRD_PARTY_NOTICES.md (su sección «## Fuentes») y los NOTICE de las skills desde upstream.json.
// Uso: node build/notices.ts (moon run kit:notices).
import { writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { BuildError } from './dist.ts';
import { noticeFiles, readRegistry } from './sources.ts';

const root = resolve(import.meta.dirname, '..');
try {
  const files = noticeFiles(readRegistry(join(root, 'upstream.json')), root);
  for (const [path, content] of files) writeFileSync(join(root, path), content);
  console.log(`Avisos escritos desde upstream.json: ${files.size} ficheros.`);
} catch (error) {
  if (!(error instanceof BuildError)) throw error;
  console.error(error.message);
  process.exitCode = 1;
}
