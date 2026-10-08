import { describe, it, expect, vi, afterEach } from 'vitest';
import { cpSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { runSessionStart, sessionStartOutput } from '../../bin/session-start.js';

const fixtures = fileURLToPath(new URL('../fixtures/hook/', import.meta.url));
const pluginRoot = `${fixtures}plugin`;
const project = `${fixtures}projects/pending-migration`;
const copies: string[] = [];

function pluginCopy(): string {
  const root = mkdtempSync(join(tmpdir(), 'hook-plugin-'));
  copies.push(root);
  cpSync(pluginRoot, root, { recursive: true });
  return root;
}

afterEach(() => {
  vi.restoreAllMocks();
  copies.splice(0).forEach((root) => rmSync(root, { recursive: true, force: true }));
});

describe('sdd hook session-start with missing files', () => {
  it('drops only the migration warning without the migrations folder', () => {
    const root = pluginCopy();
    rmSync(join(root, 'skills', 'sdd-init-brownfield'), { recursive: true });
    const output = sessionStartOutput(project, root, '26.10.0');
    expect(output).not.toContain('trae migraciones');
    expect(output).toContain('# using-sdd');
  });

  it('exits 0 and writes nothing when the skill is missing', () => {
    const root = pluginCopy();
    rmSync(join(root, 'skills', 'using-sdd'), { recursive: true });
    vi.stubEnv('CLAUDE_PROJECT_DIR', project);
    const write = vi.spyOn(process.stdout, 'write').mockReturnValue(true);
    expect(runSessionStart(root)).toBe(0);
    expect(write).not.toHaveBeenCalled();
  });
});
