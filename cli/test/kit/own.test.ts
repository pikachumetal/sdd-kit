import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import type { Entry } from '../../../build/sources.ts';
import { ownReport } from '../../../tests/own/check.ts';
import { isSpanish } from '../../../tests/own/spanish.ts';
import { repoRoot } from './kit-files.ts';
import { tempDirs, writeTree } from './temp-tree.ts';

const tempDir = tempDirs();

const FRONT = (name: string): string => `---\nname: ${name}\ndescription: Use when testing.\n---\n\n`;
const RULE = 'Write everything the user reads in their language, skill announcements included.';
const RULE_WORDS = 'write everything the user reads in their language skill announcements';
const REMEDY =
  'déjala en un solo sitio, en includes/ si la necesitan varias skills; antes de quitar una copia, relee cada paso que la nombra por su posición: su orden tiene que dejar aplicarla';
const OWN = ['skills/example-a/', 'skills/example-b/', 'skills/example-c/'];
const SOURCES = { superpowers: { repo: 'obra/superpowers', tagPrefix: 'v', license: 'MIT', copyright: 'x' } };

interface Repo {
  files: Record<string, string>;
  own?: string[];
  entries?: Entry[];
}

const copyEntry = (kit: string, pending?: string): Entry => ({
  kind: 'copy',
  source: 'superpowers',
  version: 'v7.0.2',
  paths: [`skills/${kit.split('/')[1]}/SKILL.md`],
  kit: [kit],
  ...(pending ? { pending } : {}),
});

function report({ files, own = OWN, entries = [] }: Repo): { code: number; lines: string[] } {
  const root = tempDir('own-');
  writeTree(root, { ...files, 'upstream.json': JSON.stringify({ sources: SOURCES, entries, own }) });
  return ownReport(
    root,
    Object.keys(files).filter((path) => path.startsWith('skills/')),
  );
}

const skill = (name: string, body: string): Record<string, string> => ({ [`skills/${name}/SKILL.md`]: FRONT(name) + body });
const repeated = (sites: string[], words = RULE_WORDS): string => `${sites.join(' y ')} repiten «${words}»: ${REMEDY}`;

describe('kit:own: la frase repetida', () => {
  it('reports a run of 10 words repeated in two own skills', () => {
    const result = report({ files: { ...skill('example-a', `${RULE}\n`), ...skill('example-b', `${RULE}\n`) } });

    expect(result.code).toBe(1);
    expect(result.lines).toEqual([repeated(['dist/skills/example-a/SKILL.md:6', 'dist/skills/example-b/SKILL.md:6'])]);
  });

  it('joins a run of 12 words in one line', () => {
    const twelve = 'Alpha bravo charlie delta echo foxtrot golf hotel india juliet kilo lima.';
    const result = report({ files: { ...skill('example-a', `${twelve}\n`), ...skill('example-b', `Intro.\n\n${twelve}\n`) } });

    expect(result.lines).toEqual([
      repeated(['dist/skills/example-a/SKILL.md:6', 'dist/skills/example-b/SKILL.md:8'], 'alpha bravo charlie delta echo foxtrot golf hotel india juliet'),
    ]);
  });

  it('reports two separate runs of the same pair twice', () => {
    const other = 'One two three four five six seven eight nine ten.';
    const body = `${RULE}\n\nUnrelated words here.\n\n${other}\n`;
    const result = report({ files: { ...skill('example-a', body), ...skill('example-b', body) } });

    expect(result.lines).toHaveLength(2);
  });

  it('lists every site of the same run once', () => {
    const result = report({
      files: { ...skill('example-a', `${RULE}\n\nMore.\n\n${RULE}\n`), ...skill('example-b', `${RULE}\n`), ...skill('example-c', `${RULE}\n`) },
    });

    expect(result.lines).toEqual([
      `dist/skills/example-a/SKILL.md:6, dist/skills/example-a/SKILL.md:10, dist/skills/example-b/SKILL.md:6 y dist/skills/example-c/SKILL.md:6 repiten «${RULE_WORDS}»: ${REMEDY}`,
    ]);
  });

  it('does not cross a blank line, a list item, a heading or a table cell', () => {
    const halves = ['Write everything the user reads', 'in their language skill announcements included.'];
    const a = `${halves[0]}\n\n${halves[1]}\n\n- ${halves[0]}\n- ${halves[1]}\n\n# ${halves[0]}\n${halves[1]}\n\n| ${halves[0]} | ${halves[1]} |\n`;
    const b = `${halves.join(' ')}\n`;

    expect(report({ files: { ...skill('example-a', a), ...skill('example-b', b) } }).code).toBe(0);
  });

  it('crosses the broken lines of one paragraph', () => {
    const result = report({ files: { ...skill('example-a', 'Write everything the user\nreads in their language, skill announcements included.\n'), ...skill('example-b', `${RULE}\n`) } });

    expect(result.lines).toEqual([repeated(['dist/skills/example-a/SKILL.md:6', 'dist/skills/example-b/SKILL.md:6'])]);
  });

  it('ignores inline code and fenced code', () => {
    const command = '`node cli/bin/sdd.js merge --project-root the worktree of the branch --push now`';
    const fenced = `\`\`\`text\n${RULE}\n\`\`\`\n`;
    const files = { ...skill('example-a', `Run ${command}.\n\n${fenced}`), ...skill('example-b', `Run ${command}.\n\n${fenced}`) };

    expect(report({ files }).code).toBe(0);
  });

  it('ignores two copies that share a run', () => {
    const block = `<!-- kit: 0186 -->\n${RULE}\n`;
    const files = { ...skill('example-a', block), ...skill('example-b', `${RULE}\n`) };
    const entries = [copyEntry('skills/example-a/SKILL.md'), copyEntry('skills/example-b/SKILL.md')];

    expect(report({ files, own: [], entries }).code).toBe(0);
  });

  it('reports a copy block that repeats an own skill', () => {
    const files = { ...skill('example-a', `Original text.\n\n<!-- kit: 0186 -->\n${RULE}\n`), ...skill('example-b', `${RULE}\n`) };
    const result = report({ files, own: ['skills/example-b/'], entries: [copyEntry('skills/example-a/SKILL.md')] });

    expect(result.lines).toEqual([repeated(['dist/skills/example-a/SKILL.md:8', 'dist/skills/example-b/SKILL.md:6'])]);
  });

  it('ignores a run that two skills include; reports it written by hand in a third', () => {
    const include = '<!-- kit: incluye user-language -->\n';
    const files = { ...skill('example-a', include), ...skill('example-b', include), 'includes/user-language.md': `${RULE}\n` };

    expect(report({ files }).code).toBe(0);
    const third = report({ files: { ...files, ...skill('example-c', `${RULE}\n`) } });
    expect(third.lines).toEqual([
      `dist/skills/example-a/SKILL.md:6, dist/skills/example-b/SKILL.md:6 y dist/skills/example-c/SKILL.md:6 repiten «${RULE_WORDS}»: ${REMEDY}`,
    ]);
  });

  it('ignores runs within one skill, in templates and in migrations', () => {
    const files = {
      ...skill('example-a', `${RULE}\n`),
      'skills/example-a/references/more.md': `${RULE}\n`,
      'skills/sdd-templates/templates/spec-template.md': `${RULE}\n`,
      'skills/sdd-upgrade/references/migrations/v1.0.0.md': `${RULE}\n`,
    };

    expect(report({ files, own: [...OWN, 'skills/sdd-templates/', 'skills/sdd-upgrade/'] }).code).toBe(0);
  });

  it('counts a pending copy as kit text', () => {
    const files = { ...skill('example-a', `${RULE}\n`), ...skill('example-b', `${RULE}\n`) };
    const result = report({ files, own: ['skills/example-b/'], entries: [copyEntry('skills/example-a/', '0296')] });

    expect(result.code).toBe(1);
  });

  it('reports dist line numbers after a stripped mark and an include', () => {
    const body = '<!-- kit: 0186 -->\n<!-- kit: incluye two-lines -->\nIntro.\n\n' + `${RULE}\n`;
    const files = { ...skill('example-a', body), ...skill('example-b', `${RULE}\n`), 'includes/two-lines.md': 'First.\nSecond.\n' };

    expect(report({ files }).lines).toEqual([repeated(['dist/skills/example-a/SKILL.md:10', 'dist/skills/example-b/SKILL.md:6'])]);
  });
});

describe('kit:own: la absoluta con excepción', () => {
  const message = (site: string, absolute: string, exception: string): string =>
    `${site}: absoluta con excepción en la misma frase («${absolute}» … «${exception}»): sustituye la regla por una que ya diga su caso`;

  it('reports an absolute with its exception in one sentence', () => {
    const result = report({ files: skill('example-a', 'The validation is never removed, except with `validation.mode: field`, which does it in the field.\n') });

    expect(result.lines).toEqual([message('dist/skills/example-a/SKILL.md:6', 'never', 'except')]);
  });

  it('does not cut after e.g.', () => {
    const result = report({ files: skill('example-a', 'Never skip the gate, e.g. for a typo, unless the user asks.\n') });

    expect(result.lines).toEqual([message('dist/skills/example-a/SKILL.md:6', 'never', 'unless')]);
  });

  it('does not cut after an abbreviation inside parentheses or quotes', () => {
    const result = report({ files: skill('example-a', 'Never skip it (e.g. for a typo) unless asked.\n\nOnly this "i.e. that" except here.\n') });

    expect(result.lines).toEqual([message('dist/skills/example-a/SKILL.md:6', 'never', 'unless'), message('dist/skills/example-a/SKILL.md:8', 'only', 'except')]);
  });

  it('does not cut inside a «…» quote', () => {
    const result = report({ files: skill('example-a', 'Always ask «is it done. Really?» instead of guessing.\n') });

    expect(result.lines).toEqual([message('dist/skills/example-a/SKILL.md:6', 'always', 'instead of')]);
  });

  it('ignores an absolute and an exception in two sentences', () => {
    expect(report({ files: skill('example-a', 'Never skip the gate. Unless the user asks, run it.\n') }).code).toBe(0);
  });

  it('ignores inline code', () => {
    expect(report({ files: skill('example-a', 'Run `never unless` here.\n') }).code).toBe(0);
  });

  it('ignores an original sentence of a copy', () => {
    const files = skill('example-a', 'You must stop, unless told otherwise.\n');

    expect(report({ files, own: [], entries: [copyEntry('skills/example-a/SKILL.md')] }).code).toBe(0);
  });

  it('names includes/<nombre>.md:<línea> for an include', () => {
    const files = { ...skill('example-a', '<!-- kit: incluye rule -->\n'), 'includes/rule.md': 'Intro.\n\nOnly this, unless that.\n' };

    expect(report({ files }).lines).toEqual([message('includes/rule.md:3', 'only', 'unless')]);
  });
});

describe('kit:own: la inclusión en una copia', () => {
  const include = '<!-- kit: incluye user-language -->\n';

  it('ignores a run included in a copy block and in an own skill', () => {
    const files = {
      ...skill('example-a', `Original text.\n\n<!-- kit: 0311 -->\n${include}`),
      ...skill('example-b', include),
      'includes/user-language.md': `${RULE}\n`,
    };

    expect(report({ files, own: ['skills/example-b/'], entries: [copyEntry('skills/example-a/SKILL.md')] }).code).toBe(0);
  });

  it('accepts an include anywhere in a pending copy', () => {
    const files = { ...skill('example-a', `Text.\n\n${include}`), 'includes/user-language.md': `${RULE}\n` };

    expect(report({ files, own: [], entries: [copyEntry('skills/example-a/', '0305')] }).code).toBe(0);
  });

  it('reports the run written by hand in a copy block next to the include of an own skill', () => {
    const files = {
      ...skill('example-a', `Original text.\n\n<!-- kit: 0311 -->\n${RULE}\n`),
      ...skill('example-b', include),
      'includes/user-language.md': `${RULE}\n`,
    };
    const result = report({ files, own: ['skills/example-b/'], entries: [copyEntry('skills/example-a/SKILL.md')] });

    expect(result.code).toBe(1);
  });
});

describe('isSpanish', () => {
  const sample = readFileSync(join(repoRoot, 'cli/test/fixtures/own/spanish-sample.md'), 'utf8').replace(/\r\n/g, '\n').split('\n');
  const section = (name: string): string[] => {
    const start = sample.indexOf(`## ${name}`) + 1;
    const end = sample.findIndex((line, index) => index > start && /^## (es|en)$/.test(line));
    return sample.slice(start, end < 0 ? undefined : end).filter((line) => line.trim() !== '');
  };

  it('classifies every line of the sample', () => {
    const missed = section('es').filter((line) => !isSpanish(line));
    const wrong = section('en').filter((line) => isSpanish(line));

    expect({ missed, wrong }).toEqual({ missed: [], wrong: [] });
  });
});

describe('kit:own: la prosa en castellano', () => {
  const english = 'An English line.\n\nAnother one.\n\nA third.\n\n';
  const message = (site: string, line: string): string => `${site}: prosa en castellano; las skills van en inglés: «${line}»`;

  it('reports a line in Spanish with its dist line', () => {
    const files = { ...skill('example-a', 'English.\n'), 'skills/example-a/references/profiles.md': `${english}- **\`pair\`** — para en todos los gates de la tabla.\n` };

    expect(report({ files }).lines).toEqual([message('dist/skills/example-a/references/profiles.md:7', '- **`pair`** — para en todos los gates de la tabla.')]);
  });

  it('reports a short heading', () => {
    expect(report({ files: skill('example-a', '## Restricciones de código\n') }).lines).toEqual([message('dist/skills/example-a/SKILL.md:6', '## Restricciones de código')]);
  });

  it('abbreviates a long line to 12 words', () => {
    const line = 'Cada documento es de estado, un artefacto de evento o una ADR, y tiene quien lo escribe.';
    expect(report({ files: skill('example-a', `${line}\n`) }).lines).toEqual([
      message('dist/skills/example-a/SKILL.md:6', 'Cada documento es de estado, un artefacto de evento o una ADR,…'),
    ]);
  });

  it('ignores Spanish in inline code and «…» quotes', () => {
    expect(report({ files: skill('example-a', 'Open with `Ahora: <qué haces>` and a counter like «van 7 de 15».\n') }).code).toBe(0);
  });

  it('ignores templates, code blocks and the frontmatter but the description', () => {
    const files = {
      ...skill('example-a', '```text\nPara otro perfil: di cuál y para qué.\n```\n'),
      'skills/sdd-templates/templates/spec-template.md': 'Una línea de la plantilla en castellano para el equipo.\n',
    };
    expect(report({ files, own: [...OWN, 'skills/sdd-templates/'] }).code).toBe(0);

    const described = { 'skills/example-a/SKILL.md': '---\nname: example-a\ndescription: Úsala cuando el usuario pide una de las cosas.\n---\n\nEnglish.\n' };
    expect(report({ files: described }).lines).toEqual([
      message('dist/skills/example-a/SKILL.md:3', 'description: Úsala cuando el usuario pide una de las cosas.'),
    ]);
  });

  it('names includes/<nombre>.md:<línea> for an include', () => {
    const files = { ...skill('example-a', '<!-- kit: incluye rule -->\n'), 'includes/rule.md': 'Intro.\n\nSe escribe una vez y se incluye en las dos.\n' };

    expect(report({ files }).lines).toEqual([message('includes/rule.md:3', 'Se escribe una vez y se incluye en las dos.')]);
  });
});

describe('kit:own: lo que dice', () => {
  it('prints Skills al día with no problems', () => {
    const files = { ...skill('example-a', 'Alpha.\n'), ...skill('example-b', 'Bravo.\n'), 'includes/rule.md': 'A rule.\n' };

    expect(report({ files })).toEqual({ code: 0, lines: ['Skills al día: 3 ficheros.'] });
  });

  it('fails on an unreadable registry', () => {
    const root = tempDir('own-');
    writeTree(root, skill('example-a', 'Alpha.\n'));

    expect(() => ownReport(root, ['skills/example-a/SKILL.md'])).toThrow(/no such file or directory.*upstream\.json/);
  });
});
