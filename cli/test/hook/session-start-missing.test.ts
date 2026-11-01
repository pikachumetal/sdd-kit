import { describe, it, expect, vi, afterEach } from 'vitest';
import { cpSync, existsSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { removeSessionMarks } from '../../bin/session-end.js';
import { markSession, runSessionStart, sessionMarkerPath, sessionStartOutput } from '../../bin/session-start.js';

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
  vi.unstubAllEnvs();
  copies.splice(0).forEach((root) => rmSync(root, { recursive: true, force: true }));
});

describe('sdd hook session-start marks the session', () => {
  function tempBase(): string {
    const base = mkdtempSync(join(tmpdir(), 'hook-marker-'));
    copies.push(base);
    return base;
  }

  it('marks the session', () => {
    const base = tempBase();
    expect(markSession('{"session_id": "abc-1", "source": "startup"}', base)).toBe('startup');
    expect(existsSync(sessionMarkerPath('abc-1', base))).toBe(true);
  });

  it('does not mark an unsafe session id', () => {
    const base = tempBase();
    expect(markSession('{"session_id": "../fuera", "source": "startup"}', base)).toBe('startup');
    expect(readdirSync(base)).toEqual([]);
  });

  it('injects nothing on resume', () => {
    const write = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
    vi.stubEnv('CLAUDE_PROJECT_DIR', project);
    expect(runSessionStart(pluginRoot, () => '{"session_id": "resume-1", "source": "resume"}')).toBe(0);
    expect(write).not.toHaveBeenCalled();
  });

  it('injects without a session id', () => {
    const write = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
    vi.stubEnv('CLAUDE_PROJECT_DIR', project);
    expect(runSessionStart(pluginRoot, () => { throw new Error('sin stdin'); })).toBe(0);
    expect(String(write.mock.calls[0][0])).toContain('using-sdd');
  });

  it('removes the marks when the session ends', () => {
    const base = tempBase();
    markSession('{"session_id": "abc-2"}', base);
    writeFileSync(`${sessionMarkerPath('abc-2', base)}.warned`, '');
    removeSessionMarks('{"session_id": "abc-2"}', base);
    expect(readdirSync(join(base, 'sdd-kit-sessions'))).toEqual([]);
    expect(() => removeSessionMarks('{"session_id": "abc-2"}', base)).not.toThrow();
  });
});

describe('sdd hook session-start with missing files', () => {
  it('drops only the migration warning without the migrations folder', () => {
    const root = pluginCopy();
    rmSync(join(root, 'skills', 'sdd-upgrade'), { recursive: true });
    const output = sessionStartOutput(project, root, '26.10.0');
    expect(output).not.toContain('trae migraciones');
    expect(output).toContain('# using-sdd');
  });

  it('exits 0 and writes nothing when the skill is missing', () => {
    const root = pluginCopy();
    rmSync(join(root, 'skills', 'using-sdd'), { recursive: true });
    vi.stubEnv('CLAUDE_PROJECT_DIR', project);
    const write = vi.spyOn(process.stdout, 'write').mockReturnValue(true);
    expect(runSessionStart(root, () => '')).toBe(0);
    expect(write).not.toHaveBeenCalled();
  });
});
