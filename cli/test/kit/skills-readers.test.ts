import { readFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { describe, expect, it } from 'vitest';
import { filesUnder, repoRoot } from './kit-files.ts';

// skills/ es la fuente anotada: sus marcas rompen un bloque de código que un test ejecuta o compara.
const WARNING = 'lee skills/ y ejecuta o compara un bloque de código: léelo de dist/skills/, que es lo que carga el agente';
const READS_SKILLS = /readText\(\s*['"`]skills\/|join\(\s*repoRoot\s*,\s*['"`]skills/;
const NAMES_FENCE = /`{3}|~{3}/;

function skillsReaders(file: string, text: string): string[] {
  if (!NAMES_FENCE.test(text)) return [];
  const line = text.split(/\r?\n/).findIndex((candidate) => READS_SKILLS.test(candidate));
  return line < 0 ? [] : [`${file}:${line + 1}: ${WARNING}`];
}

const FENCE = '`'.repeat(3);
const readerOf = (path: string): string =>
  ["import { readText } from './kit-files.ts';", `const text = readText('${path}');`, `const block = new RegExp('^${FENCE}bash').exec(text);`].join('\n');

describe('los tests que leen skills/', () => {
  it('flags a test that runs a fenced block read from skills/', () => {
    expect(skillsReaders('cli/test/kit/x.test.ts', readerOf('skills/sdd-worktrees/SKILL.md'))).toEqual([`cli/test/kit/x.test.ts:2: ${WARNING}`]);
  });

  it('accepts the same test reading dist/skills/', () => {
    expect(skillsReaders('cli/test/kit/x.test.ts', readerOf('dist/skills/sdd-worktrees/SKILL.md'))).toEqual([]);
  });

  it('accepts a reader of skills/ without a fence', () => {
    expect(skillsReaders('cli/test/kit/x.test.ts', "const text = readText('skills/sdd-init/SKILL.md');")).toEqual([]);
  });

  it('no test reads skills/ to run or compare a code block', () => {
    const tests = filesUnder(join(repoRoot, 'cli', 'test'), (path) => path.endsWith('.ts') && !path.includes(`${sep}fixtures${sep}`) && !path.endsWith(`${sep}skills-readers.test.ts`));
    expect(tests.flatMap((path) => skillsReaders(relative(repoRoot, path).replaceAll(sep, '/'), readFileSync(path, 'utf8')))).toEqual([]);
  });
});
