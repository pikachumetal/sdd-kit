import { describe, it, expect, afterAll } from 'vitest';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { memoryIo } from '../../src/cli/io.ts';
import { runInit } from '../../src/init/run.ts';

const MARK_LINE = 'PRODUCT.md: queda <!-- sdd-template: pending -->: hasta quitarla, el kit no migra el proyecto y manda a sdd-init';
const dirs: string[] = [];

afterAll(() => {
  dirs.splice(0).forEach((dir) => rmSync(dir, { recursive: true, force: true }));
});

function projectWith(files: Record<string, string>): string {
  const root = mkdtempSync(join(tmpdir(), 'sdd-init-finish-'));
  dirs.push(root);
  for (const [path, text] of Object.entries(files)) {
    mkdirSync(join(root, path, '..'), { recursive: true });
    writeFileSync(join(root, path), text, 'utf8');
  }
  return root;
}

function finish(root: string): string[] {
  const io = memoryIo();
  runInit({ root, action: { kind: 'finish', ignores: [], memoryOff: false }, kitVersion: '3.0.3', today: '2026-11-19' }, io);
  return io.stdout;
}

describe('sdd init --finish with template marks', () => {
  it('finish names each file that keeps a template mark', () => {
    const root = projectWith({ 'PRODUCT.md': '# Producto\n\n## Terminology\n\n<!-- sdd-template: pending -->\n', '.docs/sdd/sdd-kit.json': '{"version": "3.0.2"}' });
    expect(finish(root)).toContain(MARK_LINE);
  });

  it('finish prints one mark line per file, in reading order', () => {
    const root = projectWith({
      '.docs/sdd/steering/constitution.md': '<!-- sdd-template: pending -->\n',
      'PRODUCT.md': '<!-- sdd-template: pending -->\n',
      '.docs/sdd/sdd-kit.json': '{"version": "3.0.2"}',
    });
    const marks = finish(root).filter((line) => line.includes('queda <!-- sdd-template: pending -->'));
    expect(marks).toEqual([MARK_LINE, MARK_LINE.replace('PRODUCT.md', '.docs/sdd/steering/constitution.md')]);
  });

  it('finish prints no mark line without marks', () => {
    const root = projectWith({ 'PRODUCT.md': '# Producto\n', '.docs/sdd/sdd-kit.json': '{"version": "3.0.2"}' });
    expect(finish(root).some((line) => line.includes('sdd-template'))).toBe(false);
  });

  it('finish without docs prints no mark line', () => {
    const root = projectWith({});
    expect(finish(root).some((line) => line.includes('sdd-template'))).toBe(false);
  });
});
