import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { buildDist, listSources, relativeFiles as unsortedFiles, stripMarks, syncDir, WHITELIST } from '../../../build/dist.ts';
import { filesUnder, repoRoot } from './kit-files.ts';
import { tempDirs, writeTree } from './temp-tree.ts';

const MISPLACED = 'marca mal puesta: una marca va sola en su línea, <!-- kit: … -->, fuera del frontmatter y de un bloque de código';
const MARK = '<!-- kit: 0186 · sustituye: «x» -->';

const tempDir = tempDirs();
const relativeFiles = (root: string): string[] => unsortedFiles(root).sort();
const lf = (text: string): string => text.replace(/\r\n/g, '\n');

describe('stripMarks', () => {
  it('strips a whole-line kit mark with its LF and CRLF', () => {
    expect(stripMarks(`a\n${MARK}\nb\n`, 'x.md')).toBe('a\nb\n');
    expect(stripMarks(`a\r\n${MARK}\r\nb\r\n`, 'x.md')).toBe('a\r\nb\r\n');
    expect(stripMarks(`a\n  ${MARK}  \nb\n`, 'x.md')).toBe('a\nb\n');
  });

  it('strips a whole-line kit mark inside a fenced code block', () => {
    for (const fence of ['```', '~~~', '   ```markdown']) {
      const close = fence.trim().slice(0, 3);
      const inside = `a\n${fence}\n%s\nx <!-- kit: a\n${close}\nb\n`;
      expect(stripMarks(inside.replace('%s', MARK), 'x.md')).toBe(inside.replace('%s\n', ''));
    }
  });

  it('fails on a misplaced kit mark', () => {
    expect(() => stripMarks('a\nx <!-- kit: a -->\n', 'x.md')).toThrow(`x.md:2: ${MISPLACED}`);
    expect(() => stripMarks('a\n<!-- kit: a --> x\n', 'x.md')).toThrow(`x.md:2: ${MISPLACED}`);
    expect(() => stripMarks('a\nb\n<!-- kit: a\n', 'x.md')).toThrow(`x.md:3: ${MISPLACED}`);
    expect(() => stripMarks(`---\nname: x\n${MARK}\n---\nb\n`, 'x.md')).toThrow(`x.md:3: ${MISPLACED}`);
  });

  it('fails on text after a closed mark', () => {
    expect(() => stripMarks('<!-- kit: a --> texto -->\n', 'x.md')).toThrow(`x.md:1: ${MISPLACED}`);
    expect(() => stripMarks('<!-- kit: a --><!-- kit: b -->\n', 'x.md')).toThrow(`x.md:1: ${MISPLACED}`);
  });

  it('strips a kit mark inside a fence nested in a list', () => {
    const fenced = (inside: string): string => `- paso:\n\n    \`\`\`text\n${inside}    \`\`\`\n`;
    expect(stripMarks(fenced(`    ${MARK}\n`), 'x.md')).toBe(fenced(''));
  });
});

describe('buildDist', () => {
  it('copies a source without marks byte for byte', () => {
    const source = tempDir('dist-src-');
    const files = { 'skills/a/SKILL.md': '---\nname: a\n---\n\n# a\r\n', 'skills/a/NOTICE': 'MIT\n', 'cli/src/x.ts': 'export {};\n' };
    writeTree(source, files);
    const out = tempDir('dist-out-');
    buildDist(source, Object.keys(files), out);
    for (const [path, content] of Object.entries(files)) expect(readFileSync(join(out, path), 'utf8')).toBe(content);
  });

  it('strips marks from every travelling markdown file', () => {
    const source = tempDir('dist-src-');
    writeTree(source, { 'agents/x.md': `a\n${MARK}\nb\n` });
    const out = tempDir('dist-out-');
    buildDist(source, ['agents/x.md'], out);
    expect(readFileSync(join(out, 'agents/x.md'), 'utf8')).toBe('a\nb\n');
  });

  it('skips listed files that no longer exist', () => {
    const source = tempDir('dist-src-');
    writeTree(source, { 'skills/a/SKILL.md': '# a\n' });
    const out = tempDir('dist-out-');
    expect(() => buildDist(source, ['skills/a/SKILL.md', 'skills/a/gone.md'], out)).not.toThrow();
    expect(relativeFiles(out)).toEqual(['skills/a/SKILL.md']);
  });
});

describe('syncDir', () => {
  it('syncs dist without emptying it', () => {
    const from = tempDir('dist-from-');
    const to = tempDir('dist-to-');
    writeTree(from, { 'same.md': 'igual\n', 'changed.md': 'nuevo\n' });
    writeTree(to, { 'same.md': 'igual\n', 'changed.md': 'viejo\n', 'stale/old.md': 'sobra\n' });
    const sameBefore = statSync(join(to, 'same.md')).mtimeMs;
    syncDir(from, to);
    expect(relativeFiles(to)).toEqual(['changed.md', 'same.md']);
    expect(readFileSync(join(to, 'changed.md'), 'utf8')).toBe('nuevo\n');
    expect(statSync(join(to, 'same.md')).mtimeMs).toBe(sameBefore);
    expect(readdirSync(to)).not.toContain('stale');
  });
});

describe('dist/ del repo', () => {
  vi.setConfig({ testTimeout: 20_000 });
  const dist = join(repoRoot, 'dist');

  it('dist/ is what the build outputs', async () => {
    const out = tempDir('dist-repo-');
    buildDist(repoRoot, await listSources(repoRoot), out);
    const expected = relativeFiles(out);
    const actual = relativeFiles(dist);
    const differing = [...new Set([...expected, ...actual])]
      .filter((path) => !expected.includes(path) || !actual.includes(path) || lf(readFileSync(join(out, path), 'utf8')) !== lf(readFileSync(join(dist, path), 'utf8')))
      .map((path) => `dist/${path}`);
    expect(differing, `dist/ no es lo que sale del build: ejecuta moon run kit:build\n${differing.join('\n')}`).toEqual([]);
  });

  it('dist has no kit mark outside code blocks', () => {
    const marked = filesUnder(dist, (path) => path.endsWith('.md')).filter((path) => {
      const text = readFileSync(path, 'utf8');
      try {
        return stripMarks(text, path) !== text;
      } catch {
        return true;
      }
    });
    expect(marked.map((path) => relative(repoRoot, path))).toEqual([]);
  });

  it('dist holds only the whitelist', () => {
    const top = new Set(WHITELIST.map((entry) => entry.split('/')[0]));
    const underCli = new Set(WHITELIST.filter((entry) => entry.startsWith('cli/')).map((entry) => entry.split('/')[1]));
    expect(new Set(readdirSync(dist))).toEqual(top);
    expect(new Set(readdirSync(join(dist, 'cli')))).toEqual(underCli);
  });
});
