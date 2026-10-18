import { describe, it, expect, afterAll } from 'vitest';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { DomainError, UsageError } from '../../src/cli/args.ts';
import { localDay } from '../../src/cli/dates.ts';
import { memoryIo } from '../../src/cli/io.ts';
import { run } from '../../src/main.ts';
import { runUpgrade } from '../../src/upgrade/run.ts';

const MARKER = '.docs/sdd/sdd-kit.json';
const KIT_MIGRATIONS = ['v0.9.0.md', 'v0.10.0.md', 'v2.3.1.md', 'v2.3.2.md', 'notes.md'];
const dirs: string[] = [];

afterAll(() => {
  dirs.splice(0).forEach((dir) => rmSync(dir, { recursive: true, force: true }));
});

function tempDir(prefix: string): string {
  const dir = mkdtempSync(join(tmpdir(), prefix));
  dirs.push(dir);
  return dir;
}

function kit(): string {
  const dir = tempDir('sdd-upgrade-kit-');
  KIT_MIGRATIONS.forEach((name) => writeFileSync(join(dir, name), `# ${name}\n`, 'utf8'));
  return dir;
}

function project(marker?: string): string {
  const root = tempDir('sdd-upgrade-project-');
  mkdirSync(join(root, '.docs', 'sdd'), { recursive: true });
  if (marker !== undefined) writeFileSync(join(root, MARKER), marker, 'utf8');
  return root;
}

function upgrade(root: string, migrationsDir: string, mark: string | null = null) {
  const io = memoryIo();
  const code = runUpgrade({ root, migrationsDir, today: '2026-10-18', mark }, io);
  return { code, out: io.stdout };
}

const readMarker = (root: string) => readFileSync(join(root, MARKER), 'utf8');

describe('sdd upgrade: pending migrations', () => {
  it('lists pending migrations in semver order', () => {
    const dir = kit();
    const result = upgrade(project('{"version": "0.9.0"}'), dir);
    expect(result).toEqual({ code: 0, out: ['v0.10.0.md', 'v2.3.1.md', 'v2.3.2.md'].map((name) => join(dir, name)) });
  });

  it('says up to date', () => {
    expect(upgrade(project('{"version": "2.3.2"}'), kit())).toEqual({ code: 0, out: ['el proyecto ya está al día con el kit 2.3.2'] });
  });

  it.each([undefined, '{"ids": {"mode": "sequence"}}'])('lists all without a marker version (%s)', (marker) => {
    const dir = kit();
    const result = upgrade(project(marker), dir);
    const all = ['v0.9.0.md', 'v0.10.0.md', 'v2.3.1.md', 'v2.3.2.md'].map((name) => join(dir, name));
    expect(result).toEqual({ code: 0, out: ['sin sdd-kit.json: se aplican todas', ...all] });
  });

  it.each([null, '2.3.2'])('refuses an init in progress (mark %s)', (mark) => {
    const root = project('{"init": {"approved": []}}');
    expect(() => upgrade(root, kit(), mark)).toThrow(new DomainError('init en curso: sigue con sdd-init'));
    expect(readMarker(root)).toBe('{"init": {"approved": []}}');
  });

  it('refuses a broken marker', () => {
    expect(() => upgrade(project('{'), kit())).toThrow(new DomainError('.docs/sdd/sdd-kit.json no es JSON válido: no se toca'));
  });

  it('reads a marker with BOM', () => {
    expect(upgrade(project('﻿{"version": "2.3.2"}'), kit()).out).toEqual(['el proyecto ya está al día con el kit 2.3.2']);
  });

  it('ignores files that are not vX.Y.Z.md', () => {
    const dir = kit();
    writeFileSync(join(dir, 'vNEXT.md'), '# next\n', 'utf8');
    expect(upgrade(project('{"version": "2.3.1"}'), dir).out).toEqual([join(dir, 'v2.3.2.md')]);
  });
});

describe('sdd upgrade --mark', () => {
  const MARKED = '{"version": "2.3.1", "channel": "plugin", "updated": "2026-10-01", "ids": {"mode": "sequence"}}';

  it('marks a version', () => {
    const root = project(MARKED);
    expect(upgrade(root, kit(), '2.3.2')).toEqual({ code: 0, out: ['.docs/sdd/sdd-kit.json: actualizado'] });
    expect(JSON.parse(readMarker(root))).toEqual({ version: '2.3.2', channel: 'plugin', updated: '2026-10-18', ids: { mode: 'sequence' } });
  });

  it('marks a version that has its file', () => {
    const dir = kit();
    writeFileSync(join(dir, 'v3.0.0.md'), '# 3.0.0\n', 'utf8');
    const root = project(MARKED);
    expect(upgrade(root, dir, '3.0.0').code).toBe(0);
    expect(JSON.parse(readMarker(root)).version).toBe('3.0.0');
  });

  it('refuses a version without migration', () => {
    const root = project(MARKED);
    expect(() => upgrade(root, kit(), '2.9.9')).toThrow(new UsageError('--mark 2.9.9: el kit no trae esa migración'));
    expect(readMarker(root)).toBe(MARKED);
  });

  it('refuses marking backwards', () => {
    const root = project(MARKED);
    expect(() => upgrade(root, kit(), '2.3.1')).toThrow(new DomainError('--mark 2.3.1: el proyecto ya está en 2.3.1'));
    expect(readMarker(root)).toBe(MARKED);
  });
});

describe('sdd upgrade: usage', () => {
  it.each([['--mark'], ['--mark', '2.x'], ['--mark', '../x'], ['--foo']])('exit 2 with %j', async (...extra) => {
    const root = project('{"version": "2.3.1"}');
    const io = memoryIo();
    expect(await run(['upgrade', '--root', root, ...extra], io)).toBe(2);
    expect(io.stderr.at(-1)).toMatch(/^uso: sdd upgrade/);
    expect(readMarker(root)).toBe('{"version": "2.3.1"}');
  });

  it('exit 2 with a root that does not exist', async () => {
    const io = memoryIo();
    expect(await run(['upgrade', '--root', join(tmpdir(), 'sdd-upgrade-missing-root')], io)).toBe(2);
  });

  it('lists the real kit migrations', async () => {
    const io = memoryIo();
    expect(await run(['upgrade', '--root', project('{"version": "2.3.3"}')], io)).toBe(0);
    expect(io.stdout.map((line) => line.replaceAll('\\', '/'))).toEqual([expect.stringMatching(/skills\/sdd-upgrade\/references\/migrations\/v2\.3\.4\.md$/)]);
  });

  it('lists upgrade in the help', async () => {
    const io = memoryIo();
    await run(['--help'], io);
    expect(io.stdout.some((line) => line.startsWith('sdd upgrade'))).toBe(true);
  });
});

describe('localDay', () => {
  it('uses the local calendar day', () => {
    expect(localDay(new Date(2026, 9, 18, 0, 30))).toBe('2026-10-18');
  });
});
