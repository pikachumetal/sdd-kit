import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { checkCopy, checkVerbatim, copyShareProblem, formatProblem, keptShare, markTask, type CopyInput } from '../../../tests/copies/annotated.ts';
import { conflictBlocks, mergeCopy } from '../../../tests/copies/update.ts';
import { repoRoot } from './kit-files.ts';

const ORIGINAL = `---
name: subagent-driven-development
description: Use when executing implementation plans
---

# Subagent-Driven Development

Four things stop you, and only these: an irreversible or destructive
operation; a security-sensitive action; a side effect outside this worktree
that norms say you ask about first (a merge, a push to a shared branch, a
publish); and a plan so broken that every path forward is a guess. For those,
stop and ask.

## Setup

Ensure the work happens in an isolated workspace: use
superpowers:using-git-worktrees to create one or verify the existing one.
Never start implementation on a main/master branch without your human
partner's explicit consent.

Conversation memory does not survive compaction.
`;

const KIT_FRONTMATTER = `---
name: sdd-implement
description: Use when sdd-propose hands off an approved plan
---
`;

const FILE = 'skills/sdd-x/SKILL.md';
const LABEL = 'skills/subagent-driven-development/SKILL.md@v7.0.0';
const STOPS = 'Four things stop you, and only these…For those, stop and ask.';
const STOPS_PARAGRAPH = ORIGINAL.split('\n').slice(7, 12).join('\n');
const RENAMED_LINE = '`sdd-worktrees` to create one or verify the existing one.';

const annotatedFrom = (original: string): string => KIT_FRONTMATTER + original.slice(original.indexOf('---\n', 4) + 4);
const BASE = annotatedFrom(ORIGINAL);

function check(annotated: string, overrides: Partial<CopyInput> = {}): string[] {
  const input: CopyInput = { file: FILE, annotated, original: ORIGINAL, label: LABEL, fragments: new Map(), ...overrides };
  return checkCopy(input).map(formatProblem);
}

const lineOf = (text: string, needle: string): number => text.split('\n').findIndex((line) => line.includes(needle)) + 1;
const replaceLine = (text: string, from: string, to: string): string => {
  if (!text.includes(from)) throw new Error(`fixture sin «${from}»`);
  return text.replace(from, to);
};

describe('checkCopy: el diff contra el original', () => {
  it('accepts the original with its own frontmatter', () => {
    expect(check(BASE)).toEqual([]);
  });

  it('reports a deleted original line without quita', () => {
    const annotated = replaceLine(BASE, 'Never start implementation on a main/master branch without your human\n', '');
    const neighbor = lineOf(annotated, 'superpowers:using-git-worktrees to create');
    expect(check(annotated)).toEqual([
      `${FILE}:${neighbor}: falta texto del original sin marca quita: «Never start implementation on a main/master…»`,
    ]);
  });

  it('reports an unmarked line', () => {
    const annotated = replaceLine(BASE, 'stop and ask.\n', 'stop and ask.\nThe kit adds this.\n');
    expect(check(annotated)).toEqual([`${FILE}:${lineOf(annotated, 'The kit adds this.')}: texto que no es del original ni está en un bloque del kit`]);
  });

  it('reports a new blank line that splits a paragraph', () => {
    const annotated = replaceLine(BASE, 'operation; a security-sensitive action;', '\noperation; a security-sensitive action;');
    expect(check(annotated)).toEqual([`${FILE}:${lineOf(annotated, 'operation; a security') - 1}: texto que no es del original ni está en un bloque del kit`]);
  });

  it('ignores the frontmatter', () => {
    expect(check(replaceLine(BASE, 'name: sdd-implement', 'name: otra-cosa'))).toEqual([]);
  });

  it('compares files without frontmatter', () => {
    const original = 'Line one.\n\nLine two.\n';
    expect(check(original, { original })).toEqual([]);
    expect(check('Line one.\n\nLine 2.\n', { original })).toEqual([
      `${FILE}:1: falta texto del original sin marca quita: «Line two.»`,
      `${FILE}:3: texto que no es del original ni está en un bloque del kit`,
    ]);
  });
});

describe('checkCopy: lo que sustituye una marca', () => {
  const renamed = (cite: string): string =>
    replaceLine(BASE, 'superpowers:using-git-worktrees to create one or verify the existing one.\n', `<!-- kit: d59bf7b5 · sustituye: «${cite}» -->\n${RENAMED_LINE}\n<!-- kit: fin -->\n`);

  it('accepts a mid-line rename cited alone', () => {
    expect(check(renamed('superpowers:using-git-worktrees'))).toEqual([]);
  });

  it('rejects a cite that does not match what the block removes', () => {
    const annotated = renamed('superpowers:using-git-worktrees to create');
    expect(check(annotated)).toEqual([
      `${FILE}:${lineOf(annotated, '<!-- kit: d59bf7b5')}: la marca sustituye «superpowers:using-git-worktrees to create», y el bloque quita «superpowers:using-git-worktrees»`,
    ]);
  });

  it('rejects a quita whose cite does not match what it removes', () => {
    const annotated = replaceLine(BASE, 'Conversation memory does not survive compaction.\n', '<!-- kit: 0296 · quita: «Conversation memory» -->\n');
    expect(check(annotated)).toEqual([
      `${FILE}:${lineOf(annotated, '<!-- kit: 0296')}: la marca quita «Conversation memory», y el bloque quita «Conversation memory does not survive compaction.»`,
    ]);
  });

  it('accepts a quita that cites what it removes', () => {
    expect(check(replaceLine(BASE, 'Conversation memory does not survive compaction.\n', '<!-- kit: 0296 · quita: «Conversation memory does not survive compaction.» -->\n'))).toEqual([]);
  });

  it('accepts an ellipsis cite for a whole paragraph', () => {
    const annotated = replaceLine(BASE, STOPS_PARAGRAPH, `<!-- kit: 0296 · sustituye: «${STOPS}» -->\nSeven things stop you, and only these.`);
    expect(check(annotated)).toEqual([]);
  });

  it('concatenates the cites of two blocks at one site', () => {
    const two = 'Ensure the work happens in an isolated workspace: use\nsuperpowers:using-git-worktrees to create one or verify the existing one.\n';
    const annotated = replaceLine(
      BASE,
      two,
      '<!-- kit: 0001 · sustituye: «Ensure the work happens in an isolated workspace: use» -->\nWork in a worktree: use\n<!-- kit: 0002 · sustituye: «superpowers:using-git-worktrees to create one or verify the existing one.» -->\n`sdd-worktrees`, which creates it.\n<!-- kit: fin -->\n',
    );
    expect(check(annotated)).toEqual([]);
  });

  it('rejects the cites of two blocks at one site in the wrong order', () => {
    const two = 'Ensure the work happens in an isolated workspace: use\nsuperpowers:using-git-worktrees to create one or verify the existing one.\n';
    const annotated = replaceLine(
      BASE,
      two,
      '<!-- kit: 0002 · sustituye: «superpowers:using-git-worktrees to create one or verify the existing one.» -->\n`sdd-worktrees`, which creates it.\n<!-- kit: 0001 · sustituye: «Ensure the work happens in an isolated workspace: use» -->\nWork in a worktree: use\n<!-- kit: fin -->\n',
    );
    expect(check(annotated)).not.toEqual([]);
  });
});

describe('checkCopy: A+C', () => {
  it('reports a block that says the substituted text again (A+C)', () => {
    const annotated = replaceLine(BASE, STOPS_PARAGRAPH, `<!-- kit: 0296 · sustituye: «${STOPS}» -->\n${STOPS_PARAGRAPH}\nThe kit's own stops are a fifth class.`);
    expect(check(annotated)).toEqual([
      `${FILE}:${lineOf(annotated, '<!-- kit: 0296')}: la marca sustituye «Four things stop you, and only these…», y el bloque vuelve a decir «Four things stop you, and only these»`,
    ]);
  });

  it('does not report a cite the original repeats elsewhere', () => {
    const original = `${ORIGINAL}\nstop and ask.\n`;
    const annotated = replaceLine(annotatedFrom(original), STOPS_PARAGRAPH, `<!-- kit: 0296 · sustituye: «${STOPS}» -->\nSeven things stop you.`);
    expect(check(annotated, { original })).toEqual([]);
  });

  it('reports a stale cite', () => {
    const annotated = replaceLine(BASE, STOPS_PARAGRAPH, '<!-- kit: 0296 · sustituye: «Five things stop you» -->\nSeven things stop you.');
    expect(check(annotated)[0]).toBe(`${FILE}:${lineOf(annotated, '<!-- kit: 0296')}: la marca sustituye «Five things stop you», que no está en el original ${LABEL}: la marca es vieja`);
  });
});

describe('checkCopy: añadido junto a una absoluta', () => {
  it('reports an addition next to an absolute', () => {
    const annotated = replaceLine(BASE, 'stop and ask.\n', "stop and ask.\n<!-- kit: 4597d47e -->\nThe kit's own stops are a fifth class, not an exception to the four.\n");
    expect(check(annotated)).toEqual([`${FILE}:${lineOf(annotated, '<!-- kit: 4597d47e')}: añadido del kit sin sustituye en un párrafo con una absoluta del original («only»)`]);
  });

  it('ignores an addition in its own paragraph', () => {
    const annotated = replaceLine(BASE, 'stop and ask.\n\n', "stop and ask.\n\n<!-- kit: 4597d47e -->\nThe kit's own stops are a fifth class.\n\n");
    expect(check(annotated)).toEqual([]);
  });
});

describe('checkCopy: la gramática de la marca', () => {
  const at = (annotated: string, needle: string): string => `${FILE}:${lineOf(annotated, needle)}`;
  const withLine = (line: string): string => replaceLine(BASE, 'stop and ask.\n\n', `stop and ask.\n\n${line}\n\n`);

  it('reports each grammar error', () => {
    const noTask = withLine('<!-- kit: sustituye: «x» -->');
    expect(check(noTask)).toContain(`${at(noTask, '<!-- kit: sustituye')}: marca del kit sin tarea o con un campo desconocido: sustituye: «x»`);
    const unknown = withLine('<!-- kit: 0186 · cambia: «x» -->\nKit text.');
    expect(check(unknown)).toContain(`${at(unknown, '<!-- kit: 0186')}: marca del kit sin tarea o con un campo desconocido: cambia`);
    const empty = replaceLine(BASE, 'Conversation memory does not survive compaction.\n', '<!-- kit: 0296 · sustituye: «Conversation memory does not survive compaction.» -->\n');
    expect(check(empty)).toContain(`${at(empty, '<!-- kit: 0296')}: la marca sustituye no tiene contenido: para quitar sin sustituir, usa quita`);
    const orphanEnd = withLine('<!-- kit: fin -->');
    expect(check(orphanEnd)).toContain(`${at(orphanEnd, '<!-- kit: fin')}: <!-- kit: fin --> sin bloque abierto`);
    const quoted = withLine('<!-- kit: 0186 · sustituye: «a «b» c» -->\nKit text.');
    expect(check(quoted)).toContain(`${at(quoted, '<!-- kit: 0186')}: la cita de la marca no puede llevar «, » ni -->: sáltalos con …`);
    const stranger = withLine('<!-- kit: 0186 · de: Wondel plugins/x/SKILL.md -->\nKit text.');
    expect(check(stranger)).toContain(`${at(stranger, '<!-- kit: 0186')}: el bloque dice de Wondel plugins/x/SKILL.md, que no está en el from de su entrada`);
  });

  it('rejects an include in an annotated copy', () => {
    const include = withLine('<!-- kit: incluye user-language -->');
    expect(check(include)).toContain(`${at(include, '<!-- kit: incluye')}: marca del kit sin tarea o con un campo desconocido: incluye user-language`);
  });

  it('ends a block at the first blank line outside a fence', () => {
    const fenced = "<!-- kit: 0186 -->\n```text\nfirst\n\nsecond\n```\n";
    expect(check(replaceLine(BASE, '## Setup\n', `## Setup\n${fenced}`))).toEqual([]);
  });

  const FENCED = 'Intro.\n\n```text\nfirst line\n\nsecond line\nthird line\n```\n\nAfter.\n';

  it('reads a mark inside a fence', () => {
    const annotated = FENCED.replace('third line\n', '<!-- kit: 0186 · sustituye: «third» -->\nfourth line\n');
    expect(check(annotated, { original: FENCED })).toEqual([]);
    expect(check(FENCED.replace('third', 'fourth'), { original: FENCED })).toEqual([
      `${FILE}:6: falta texto del original sin marca quita: «third line»`,
      `${FILE}:7: texto que no es del original ni está en un bloque del kit`,
    ]);
  });

  it('ends a block inside a fence only at fin', () => {
    const annotated = FENCED.replace('first line\n\nsecond line\n', '<!-- kit: 0186 · sustituye: «first…second» -->\nprimera line\n\nsegunda line\n<!-- kit: fin -->\n');
    expect(check(annotated, { original: FENCED })).toEqual([]);
  });
});

describe('checkCopy: fragmentos de otra fuente', () => {
  const fragment = 'Functions should do one thing.\nThey should do it well.';
  const fragments = new Map([['Wondel plugins/x/SKILL.md', fragment]]);
  const withBlock = (text: string): string =>
    replaceLine(BASE, 'Conversation memory does not survive compaction.\n', `Conversation memory does not survive compaction.\n<!-- kit: 0148 · de: Wondel plugins/x/SKILL.md -->\n${text}\n`);

  it('accepts a de block whose text is in its fragment, reflowed', () => {
    expect(check(withBlock('Functions should do one thing. They should'), { fragments })).toEqual([]);
  });

  it('reports a de block whose text is not in its fragment', () => {
    const annotated = withBlock('Functions should do two things.');
    expect(check(annotated, { fragments })).toEqual([
      `${FILE}:${lineOf(annotated, '<!-- kit: 0148')}: el bloque dice de Wondel plugins/x/SKILL.md, y su texto no está en ese original`,
    ]);
  });
});

describe('checkCopy: lo que acompaña a un rojo', () => {
  it('appends the fixing row', () => {
    const annotated = replaceLine(BASE, 'stop and ask.\n', "stop and ask.\n<!-- kit: 4597d47e · arregla: 0307 -->\nThe kit's own stops are a fifth class.\n");
    expect(check(annotated)).toEqual([`${FILE}:${lineOf(annotated, '<!-- kit: 4597d47e')}: añadido del kit sin sustituye en un párrafo con una absoluta del original («only») → 0307`]);
  });

  it('reports CRLF', () => {
    expect(check(BASE.replace(/\n/g, '\r\n'))).toEqual([`${FILE}: tiene finales de línea CRLF; la fuente de una copia va en LF`]);
  });

  it('reports an unresolved merge conflict', () => {
    const annotated = replaceLine(BASE, 'stop and ask.\n', 'stop and ask.\n<<<<<<< kit\nours\n=======\ntheirs\n>>>>>>> v7.0.1\n');
    expect(check(annotated)).toEqual([
      `${FILE}:${lineOf(annotated, '<<<<<<< kit')}: conflicto de git merge-file sin resolver`,
      `${FILE}:${lineOf(annotated, '=======')}: conflicto de git merge-file sin resolver`,
      `${FILE}:${lineOf(annotated, '>>>>>>> v7.0.1')}: conflicto de git merge-file sin resolver`,
    ]);
  });

  it('reports a merge conflict in the frontmatter and inside a fence', () => {
    const conflict = '<<<<<<< kit\nours\n=======\ntheirs\n>>>>>>> v7.0.1\n';
    const front = replaceLine(BASE, 'name: sdd-implement\n', `name: sdd-implement\n${conflict}`);
    expect(check(front)).toContain(`${FILE}:${lineOf(front, '<<<<<<< kit')}: conflicto de git merge-file sin resolver`);
    const fenced = replaceLine(BASE, '## Setup\n', `## Setup\n\`\`\`text\n${conflict}\`\`\`\n`);
    expect(check(fenced)).toContain(`${FILE}:${lineOf(fenced, '<<<<<<< kit')}: conflicto de git merge-file sin resolver`);
  });

  it('does not take a setext underline for a conflict', () => {
    const original = 'Title\n=======\n\nText.\n';
    expect(check(original, { original })).toEqual([]);
  });

  it('accepts the annotated fixture of the experiment', () => {
    const fixture = (name: string): string => readFileSync(join(repoRoot, 'cli/test/fixtures/copies', name), 'utf8');
    expect(check(fixture('sdd-annotated-v7.0.0.md'), { original: fixture('sdd-v7.0.0.md') })).toEqual([]);
  });
});

describe('checkVerbatim', () => {
  const file = 'skills/sdd-debugging/references/example.ts';
  const label = 'skills/systematic-debugging/example.ts@v7.0.0';

  const verbatim = (annotated: string, original: string): string[] => checkVerbatim({ file, annotated, original, label }).map(formatProblem);

  it('accepts its original byte for byte in LF', () => {
    expect(verbatim('a\nb\n', 'a\r\nb\r\n')).toEqual([]);
  });

  it('reports a non-md copy that is not its original', () => {
    expect(verbatim('a\nc\n', 'a\nb\n')).toEqual([`${file}: no es su original ${label} byte a byte`]);
  });

  it('reports CRLF', () => {
    expect(verbatim('a\r\nb\r\n', 'a\nb\n')).toEqual([`${file}: tiene finales de línea CRLF; la fuente de una copia va en LF`]);
  });
});

describe('copyShareProblem', () => {
  const firstWords = (count: number): string => Array.from({ length: count }, (_, index) => `x${index}`).join(' ');
  const original = firstWords(25);

  it('accepts 50 % exactly', () => {
    expect(keptShare(firstWords(15), original)).toBe(50);
    expect(copyShareProblem({ file: 'k.md', output: firstWords(15), original, path: 'o.md' })).toBeNull();
  });

  it('reports a copy below 50 %', () => {
    const problem = copyShareProblem({ file: 'k.md', output: firstWords(14), original, path: 'o.md' });
    expect(problem && formatProblem(problem)).toBe('k.md: conserva el 45 % de su original o.md; por debajo del 50 % es propia: pásala a own');
  });
});

describe('keptShare', () => {
  const words = (count: number, prefix: string): string => Array.from({ length: count }, (_, index) => `${prefix}${index}`).join(' ');

  it('keptShare measures the original kept', () => {
    const original = `${words(20, 'a')} ${words(25, 'b')}`;
    expect(keptShare(words(20, 'a'), original)).toBe(38);
    expect(keptShare(original, original)).toBe(100);
    expect(keptShare('', original)).toBe(0);
  });
});

describe('mergeCopy: el experimento de 7.0.0 a 7.0.1', () => {
  const fixture = (name: string): string => readFileSync(join(repoRoot, 'cli/test/fixtures/copies', name), 'utf8');

  it('merges the 7.0.0 experiment into 7.0.1 with its two conflicts', async () => {
    const texts = { kit: fixture('sdd-annotated-v7.0.0.md'), older: fixture('sdd-v7.0.0.md'), newer: fixture('sdd-v7.0.1.md') };
    const { text, conflicts } = await mergeCopy(texts, ['v7.0.0', 'v7.0.1']);
    expect(conflicts).toBe(2);
    const regions = text.split(/^<<<<<<< kit$/m).slice(1).map((part) => part.split(/^>>>>>>> v7\.0\.1$/m)[0]);
    expect(regions[0]).toContain("- Check for this plan's ledger with `sdd task status`.");
    expect(regions[1]).toContain('**Reproduce before fixing**');
    const outside = text.split(/^<<<<<<< kit$[\s\S]*?^>>>>>>> v7\.0\.1$/m).join('');
    for (const block of ['Seven things stop you, and only these', '**Your first message after loading this skill**', 'A scoped re-review takes a cheap-to-mid tier', '`sdd-worktrees` to create one or verify the existing one.'])
      expect(outside).toContain(block);
  });

  it('keeps the kit frontmatter when the original changes its own', async () => {
    const older = '---\nname: a\ndescription: old\n---\n\nBody.\n';
    const newer = '---\nname: a\ndescription: new\n---\n\nBody.\n\nMore.\n';
    const kit = '---\nname: sdd-a\ndescription: kit\n---\n\nBody.\n';
    expect(await mergeCopy({ kit, older, newer }, ['v1', 'v2'])).toEqual({ text: `${kit}\nMore.\n`, conflicts: 0 });
  });

  it('lists the blocks inside each conflict', () => {
    const text = 'a\n<<<<<<< kit\n<!-- kit: 4597d47e · sustituye: «x» -->\nkit\n=======\ntheirs\n>>>>>>> v7.0.1\nb\n<<<<<<< kit\nours\n=======\ntheirs\n>>>>>>> v7.0.1\n';
    expect(conflictBlocks(text)).toEqual([
      { line: 2, tasks: ['4597d47e'] },
      { line: 9, tasks: [] },
    ]);
  });
});

describe('markTask', () => {
  it('returns the task of an opening mark', () => {
    expect(markTask('<!-- kit: 4597d47e · sustituye: «x» -->')).toBe('4597d47e');
    expect(markTask('<!-- kit: fin -->')).toBeNull();
    expect(markTask('plain text')).toBeNull();
  });
});
