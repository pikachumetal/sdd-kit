import { describe, it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { readDecisions } from '../../src/decisions/document.ts';
import { globToRegExp } from '../../src/decisions/glob.ts';
import { repoRoot } from './kit-files.ts';

// Un glob de `rutas` que no casa con ningún fichero deja la ADR sin lectores: `sdd decision index --files` no la ofrece.
const files = execFileSync('git', ['-C', repoRoot, 'ls-files'], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }).split('\n').filter(Boolean);
const live = readDecisions(join(repoRoot, '.docs', 'sdd')).filter((decision) => /^(accepted|proposed)$/.test(decision.status ?? ''));

describe('rutas de las ADR vigentes', () => {
  it.each(live.map((decision) => [decision.file, decision.rutas] as const))('%s: cada glob casa con algún fichero', (_file, rutas) => {
    const orphan = rutas.filter((glob) => {
      const pattern = globToRegExp(glob);
      return pattern !== null && !files.some((file) => pattern.test(file));
    });
    expect(orphan).toEqual([]);
  });
});
