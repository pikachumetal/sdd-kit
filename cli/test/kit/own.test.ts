import { describe, expect, it } from 'vitest';
import type { Entry } from '../../../build/sources.ts';
import { ownReport } from '../../../tests/own/check.ts';
import { tempDirs, writeTree } from './temp-tree.ts';

const tempDir = tempDirs();

const FRONT = (name: string): string => `---\nname: ${name}\ndescription: Use when testing.\n---\n\n`;
const RULE = 'Write everything the user reads in their language, skill announcements included.';
const RULE_WORDS = 'write everything the user reads in their language skill announcements';
const REMEDY = 'déjala en un solo sitio, en includes/ si la necesitan varias propias';
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
  it('reports an include in a copy, pending too', () => {
    const files = {
      ...skill('example-a', '<!-- kit: incluye rule -->\n'),
      ...skill('example-b', 'Text.\n\n<!-- kit: incluye rule -->\n'),
      'includes/rule.md': 'A rule.\n',
    };
    const entries = [copyEntry('skills/example-a/SKILL.md'), copyEntry('skills/example-b/', '0305')];

    expect(report({ files, own: [], entries }).lines).toEqual([
      'skills/example-a/SKILL.md:6: una inclusión es solo de las propias, y skills/example-a/SKILL.md es una copia',
      'skills/example-b/SKILL.md:8: una inclusión es solo de las propias, y skills/example-b/SKILL.md es una copia',
    ]);
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

    expect(() => ownReport(root, ['skills/example-a/SKILL.md'])).toThrow(/upstream\.json/);
  });
});
