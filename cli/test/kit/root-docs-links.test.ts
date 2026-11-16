import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { repoRoot } from './kit-files.ts';
import { brokenRelativeLinks } from './relative-links.ts';

// La migración a la 3.0.0 cambió de carpeta estos documentos: un enlace relativo que no se reescribió no resuelve.
const steering = readdirSync(join(repoRoot, '.docs/sdd/steering')).map((name) => `.docs/sdd/steering/${name}`);
const docs = ['PRODUCT.md', 'ROADMAP.md', 'CHANGELOG.md', ...steering];

describe('documentos de la raíz y de steering/', () => {
  it.each(docs)('%s no tiene enlaces relativos rotos', (doc) => {
    const path = join(repoRoot, doc);
    expect(brokenRelativeLinks(readFileSync(path, 'utf8'), dirname(path))).toEqual([]);
  });
});
