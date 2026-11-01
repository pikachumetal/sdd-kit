import { describe, it, expect, afterAll } from 'vitest';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { sessionMarkerPath } from '../../bin/session-start.js';
import { markerPath, sessionNotice } from '../../../hooks/project/sdd-kit-loaded.mjs';

const temps: string[] = [];
const FIX = 'Instálalo o actualízalo con «claude plugin install sdd-kit@sdd-kit --scope project» y reinicia Claude Code.';
const OPENING = 'AVISO sdd-kit: esta sesión no tiene cargadas las skills del kit.';

afterAll(() => {
  temps.splice(0).forEach((dir) => rmSync(dir, { recursive: true, force: true }));
});

function tempDir(prefix: string): string {
  const dir = mkdtempSync(join(tmpdir(), prefix));
  temps.push(dir);
  return dir;
}

interface World {
  env: Record<string, string>;
  base: string;
  route: string;
}

function world(marker: string | null, cached = true): World {
  const project = tempDir('project-hook-');
  mkdirSync(join(project, '.docs', 'sdd'), { recursive: true });
  if (marker !== null) writeFileSync(join(project, '.docs', 'sdd', 'sdd-kit.json'), marker);
  const config = tempDir('project-hook-config-');
  const route = join(config, 'plugins', 'cache', 'sdd-kit', 'sdd-kit', '3.0.0', 'skills');
  if (cached) mkdirSync(route, { recursive: true });
  return { env: { CLAUDE_PROJECT_DIR: project, CLAUDE_CONFIG_DIR: config }, base: tempDir('project-hook-tmp-'), route };
}

const input = (id = 'session-1') => JSON.stringify({ session_id: id, hook_event_name: 'UserPromptSubmit' });
const VERSION_300 = '{"version": "3.0.0"}';

describe('sdd-kit-loaded project hook', () => {
  it('warns with the route of the declared version', () => {
    const { env, base, route } = world(VERSION_300);
    const output = JSON.parse(sessionNotice(input(), env, base));
    const expected = `${OPENING} El proyecto declara el kit 3.0.0: léelas en ${route}/<skill>/SKILL.md. ${FIX}`;
    expect(output.systemMessage).toBe(expected);
    expect(output.hookSpecificOutput).toEqual({ hookEventName: 'UserPromptSubmit', additionalContext: expected });
  });

  it('says the version is not cached', () => {
    const { env, base, route } = world(VERSION_300, false);
    const output = JSON.parse(sessionNotice(input(), env, base));
    expect(output.systemMessage).toBe(`${OPENING} El proyecto declara el kit 3.0.0 y esa versión no está en la caché (${route}). ${FIX}`);
  });

  it.each([
    ['no version', '{"init": {"approved": []}}'],
    ['a broken marker', '{"version": '],
    ['a version that is not semver', '{"version": "../../x"}'],
    ['no marker', null],
  ])('warns without a route when the marker has %s', (_name, marker) => {
    const { env, base } = world(marker);
    expect(JSON.parse(sessionNotice(input(), env, base)).systemMessage).toBe(`${OPENING} ${FIX}`);
  });

  it('warns once per session', () => {
    const { env, base } = world(VERSION_300);
    expect(sessionNotice(input(), env, base)).not.toBe('');
    expect(sessionNotice(input(), env, base)).toBe('');
    expect(sessionNotice(input('session-2'), env, base)).not.toBe('');
  });

  it('stays silent with the marker', () => {
    const { env, base } = world(VERSION_300);
    mkdirSync(join(base, 'sdd-kit-sessions'), { recursive: true });
    writeFileSync(markerPath('session-1', base), '');
    expect(sessionNotice(input(), env, base)).toBe('');
  });

  it('stays silent without .docs/sdd', () => {
    const { base } = world(VERSION_300);
    expect(sessionNotice(input(), { CLAUDE_PROJECT_DIR: tempDir('project-hook-bare-') }, base)).toBe('');
  });

  it.each(['', 'no es json', '{"session_id": "../fuera"}', '{}'])('stays silent with broken input %j', (stdin) => {
    const { env, base } = world(VERSION_300);
    expect(sessionNotice(stdin, env, base)).toBe('');
  });

  it('uses the marker path of the plugin hook', () => {
    expect(markerPath('abc-1', 'base')).toBe(sessionMarkerPath('abc-1', 'base'));
  });
});
