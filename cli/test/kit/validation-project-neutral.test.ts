import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { markdownFiles, repoRoot } from './kit-files.ts';

describe('sdd-validate', () => {
  it('does not name project tools or projects', () => {
    const text = markdownFiles(join(repoRoot, 'skills', 'sdd-validate'))
      .map((path) => readFileSync(path, 'utf8'))
      .join('\n');
    expect(text).not.toMatch(/playwright|validation-script|document-manager/i);
  });
});
