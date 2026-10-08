import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('../../', import.meta.url));

function markdownFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return markdownFiles(path);
    return name.endsWith('.md') ? [path] : [];
  });
}

describe('skills keep PowerShell cmdlets intact', () => {
  it.each(markdownFiles(join(repoRoot, 'skills')).map((file) => [relative(repoRoot, file), file] as const))(
    '%s has no cmdlet turned into Verb--option',
    (_name, file) => {
      expect(readFileSync(file, 'utf8')).not.toMatch(/\b[A-Z][a-z]+--[a-z]/);
    },
  );
});
