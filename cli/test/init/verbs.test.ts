import { describe, it, expect, afterAll, vi } from 'vitest';
import fs from 'node:fs';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { memoryIo } from '../../src/cli/io.ts';
import { run } from '../../src/main.ts';

const roots: string[] = [];

afterAll(() => {
  roots.splice(0).forEach((root) => rmSync(root, { recursive: true, force: true }));
});

function project(files: Record<string, string> = {}): string {
  const root = mkdtempSync(join(tmpdir(), 'sdd-init-'));
  roots.push(root);
  for (const [name, content] of Object.entries(files)) {
    mkdirSync(join(root, name, '..'), { recursive: true });
    writeFileSync(join(root, name), content, 'utf8');
  }
  return root;
}

async function sdd(args: string[]): Promise<{ lines: string[]; code: number }> {
  const io = memoryIo();
  const code = await run(args, io);
  return { lines: [...io.stdout, ...io.stderr], code };
}

const read = (root: string, name: string) => readFileSync(join(root, name), 'utf8');
const MARKER = '.docs/sdd/sdd-kit.json';
const SETTINGS = '.claude/settings.json';

describe('sdd init: arguments', () => {
  it('exit 2 without an action', async () => {
    expect((await sdd(['init', '--root', project()])).code).toBe(2);
  });

  it('exit 2 with two actions', async () => {
    expect((await sdd(['init', '--root', project(), '--finish', '--approved', 'PRODUCT.md'])).code).toBe(2);
  });

  it.each(['[1]', '{'])('exit 2 on bad config %s', async (config) => {
    expect((await sdd(['init', '--root', project(), '--config', config])).code).toBe(2);
  });

  it.each(['', 'C:/x', '/x', '../x'])('exit 2 on bad ignore «%s»', async (ignore) => {
    const root = project();
    expect((await sdd(['init', '--root', root, '--finish', '--ignore', ignore])).code).toBe(2);
    expect(fs.existsSync(join(root, '.gitignore'))).toBe(false);
  });

  it('exit 2 on a missing root', async () => {
    expect((await sdd(['init', '--root', join(project(), 'nope'), '--finish'])).code).toBe(2);
  });
});

describe('sdd init: progress', () => {
  it('records approvals and config in init', async () => {
    const root = project();
    await sdd(['init', '--root', root, '--approved', 'PRODUCT.md']);
    const { lines } = await sdd(['init', '--root', root, '--config', '{"ids":{"mode":"sequence"},"version":"9.9.9"}']);
    await sdd(['init', '--root', root, '--approved', 'PRODUCT.md']);
    expect(JSON.parse(read(root, MARKER))).toEqual({ init: { approved: ['PRODUCT.md'], config: { ids: { mode: 'sequence' } } } });
    expect(lines).toContain('version: la fija sdd init, se ignora');
  });
});

describe('sdd init --finish', () => {
  it('writes the three files with one line each', async () => {
    const root = project({ '.gitignore': 'node_modules/\r\n.superpowers/\r\n', [MARKER]: '{"init":{"config":{"ids":{"mode":"sequence"},"control":{"profile":"delegate"}}}}' });
    const { lines, code } = await sdd(['init', '--root', root, '--finish', '--ignore', '.auth/']);
    expect(code).toBe(0);
    expect(lines).toEqual([`${SETTINGS}: creado`, '.gitignore: actualizado', `${MARKER}: actualizado`]);
    expect(read(root, '.gitignore')).toBe('node_modules/\r\n.superpowers/\r\n.playwright-mcp/\r\n.docs/sdd/sdd-kit.local.json\r\n.auth/\r\n');
    const marker = JSON.parse(read(root, MARKER));
    expect(marker).toMatchObject({ channel: 'plugin', ids: { mode: 'sequence' }, control: { profile: 'delegate' } });
    expect(marker.init).toBeUndefined();
    expect(marker.version).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it('second finish says sin cambios three times', async () => {
    const root = project();
    await sdd(['init', '--root', root, '--finish']);
    const { lines } = await sdd(['init', '--root', root, '--finish']);
    expect(lines).toEqual([`${SETTINGS}: sin cambios`, '.gitignore: sin cambios', `${MARKER}: sin cambios`]);
  });

  it('finish works without init key', async () => {
    const root = project({ [MARKER]: '{"version":"1.1.0","ids":{"mode":"tracker"}}' });
    expect((await sdd(['init', '--root', root, '--finish'])).code).toBe(0);
    expect(JSON.parse(read(root, MARKER))).toMatchObject({ version: '1.1.0', channel: 'plugin', ids: { mode: 'tracker' } });
  });

  it('memory-off turns autoMemoryEnabled false', async () => {
    const root = project({ [SETTINGS]: '{"autoMemoryEnabled":true}' });
    const first = await sdd(['init', '--root', root, '--finish']);
    expect(first.lines).toContain('autoMemoryEnabled: se deja true; pregunta al usuario si lo cambia');
    await sdd(['init', '--root', root, '--finish', '--memory-off']);
    expect(JSON.parse(read(root, SETTINGS)).autoMemoryEnabled).toBe(false);
  });

  it('finish writes the marker last', async () => {
    const root = project();
    const order: string[] = [];
    const original = fs.writeFileSync;
    const spy = vi.spyOn(fs, 'writeFileSync').mockImplementation((file, ...rest) => {
      order.push(String(file).replaceAll('\\', '/'));
      return original(file, ...rest);
    });
    await sdd(['init', '--root', root, '--finish']);
    spy.mockRestore();
    expect(order.at(-1)).toMatch(/\.docs\/sdd\/sdd-kit\.json$/);
  });
});

describe('sdd init: nothing is written on a broken file', () => {
  const cases: [string, Record<string, string>, string][] = [
    ['broken settings', { [SETTINGS]: '{"autoMemoryEnabled": false,' }, '.claude/settings.json no es JSON válido: no se toca'],
    ['broken marker', { [MARKER]: '{' }, '.docs/sdd/sdd-kit.json no es JSON válido: no se toca'],
    ['a non-object node', { [SETTINGS]: '{"enabledPlugins": []}' }, '.claude/settings.json no se puede fusionar: enabledPlugins no es un objeto'],
  ];

  it.each(cases)('exit 1 and no writes on %s', async (_name, files, message) => {
    const root = project({ '.gitignore': 'node_modules/\n', ...files });
    const { lines, code } = await sdd(['init', '--root', root, '--finish']);
    expect(code).toBe(1);
    expect(lines).toContain(message);
    expect(read(root, '.gitignore')).toBe('node_modules/\n');
    for (const [name, content] of Object.entries(files)) expect(read(root, name)).toBe(content);
  });
});
