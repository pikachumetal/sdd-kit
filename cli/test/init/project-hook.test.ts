import { describe, it, expect, afterAll, vi } from 'vitest';
import fs from 'node:fs';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { memoryIo } from '../../src/cli/io.ts';
import { installProjectHook } from '../../src/init/project-hook.ts';
import { run } from '../../src/main.ts';

const SETTINGS = '.claude/settings.json';
const SCRIPT = '.claude/hooks/sdd-kit-loaded.mjs';
const COMMAND = 'node "${CLAUDE_PROJECT_DIR}/.claude/hooks/sdd-kit-loaded.mjs"';
const source = readFileSync(fileURLToPath(new URL('../../../hooks/project/sdd-kit-loaded.mjs', import.meta.url)), 'utf8');
const roots: string[] = [];

afterAll(() => {
  roots.splice(0).forEach((root) => rmSync(root, { recursive: true, force: true }));
});

function project(settings?: string): string {
  const root = mkdtempSync(join(tmpdir(), 'sdd-project-hook-'));
  roots.push(root);
  if (settings !== undefined) {
    mkdirSync(join(root, '.claude'), { recursive: true });
    writeFileSync(join(root, SETTINGS), settings);
  }
  return root;
}

const settingsOf = (root: string) => JSON.parse(readFileSync(join(root, SETTINGS), 'utf8'));
const ours = { hooks: [{ type: 'command', command: COMMAND }] };

describe('installProjectHook', () => {
  it('installs the script and the entry', () => {
    const root = project();
    installProjectHook(root);
    expect(readFileSync(join(root, SCRIPT), 'utf8')).toBe(source);
    expect(settingsOf(root).hooks.UserPromptSubmit).toEqual([ours]);
  });

  it('does not duplicate the entry', () => {
    const root = project();
    installProjectHook(root);
    installProjectHook(root);
    expect(settingsOf(root).hooks.UserPromptSubmit).toEqual([ours]);
  });

  it('keeps the user prompt hooks of the project', () => {
    const other = { hooks: [{ type: 'command', command: 'node mine.mjs' }] };
    const root = project(JSON.stringify({ permissions: { allow: ['x'] }, hooks: { UserPromptSubmit: [other], Stop: [] } }));
    installProjectHook(root);
    const settings = settingsOf(root);
    expect(settings.hooks.UserPromptSubmit).toEqual([other, ours]);
    expect(settings.hooks.Stop).toEqual([]);
    expect(settings.permissions).toEqual({ allow: ['x'] });
  });

  it.each(['{"hooks": []}', '{"hooks": {"UserPromptSubmit": {}}}'])('refuses hooks that are not an object: %s', (settings) => {
    const root = project(settings);
    expect(() => installProjectHook(root)).toThrow('.claude/settings.json no se puede fusionar');
    expect(readFileSync(join(root, SETTINGS), 'utf8')).toBe(settings);
  });

  it('refuses settings that are not JSON', () => {
    expect(() => installProjectHook(project('{'))).toThrow('.claude/settings.json no es JSON válido: no se toca');
  });
});

describe('the verbs install it', () => {
  it('sdd init --finish leaves the script and the entry', async () => {
    const root = project();
    expect(await run(['init', '--root', root, '--finish'], memoryIo())).toBe(0);
    expect(readFileSync(join(root, SCRIPT), 'utf8')).toBe(source);
    expect(settingsOf(root).hooks.UserPromptSubmit).toEqual([ours]);
    expect(settingsOf(root).autoMemoryEnabled).toBe(false);
  });

  it('sdd upgrade --project-hook leaves the script and the entry, once', async () => {
    const root = project();
    expect(await run(['upgrade', '--root', root, '--project-hook'], memoryIo())).toBe(0);
    expect(await run(['upgrade', '--root', root, '--project-hook'], memoryIo())).toBe(0);
    expect(settingsOf(root).hooks.UserPromptSubmit).toEqual([ours]);
  });

  it('sdd upgrade --project-hook prints one line per file', async () => {
    const root = project();
    const first = memoryIo();
    await run(['upgrade', '--root', root, '--project-hook'], first);
    expect(first.stdout).toEqual([`${SETTINGS}: creado`, `${SCRIPT}: creado`]);
    const second = memoryIo();
    await run(['upgrade', '--root', root, '--project-hook'], second);
    expect(second.stdout).toEqual([`${SETTINGS}: sin cambios`, `${SCRIPT}: sin cambios`]);
  });

  it('sdd upgrade rejects --project-hook with --mark and writes nothing', async () => {
    const root = project();
    expect(await run(['upgrade', '--root', root, '--project-hook', '--mark', '3.0.0'], memoryIo())).toBe(2);
    expect(existsSync(join(root, SCRIPT))).toBe(false);
  });

  it('writes the script before the entry that points at it', () => {
    const root = project();
    const order: string[] = [];
    const original = fs.writeFileSync;
    const spy = vi.spyOn(fs, 'writeFileSync').mockImplementation((file, ...rest) => {
      order.push(String(file).replaceAll('\\', '/'));
      return original(file, ...rest);
    });
    installProjectHook(root);
    spy.mockRestore();
    expect(order.at(-1)).toMatch(/\.claude\/settings\.json$/);
  });
});
