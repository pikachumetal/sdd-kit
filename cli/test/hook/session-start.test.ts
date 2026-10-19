import { describe, it, expect, afterAll } from 'vitest';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { sessionStartOutput } from '../../bin/session-start.js';

const fixtures = fileURLToPath(new URL('../fixtures/hook/', import.meta.url));
const pluginRoot = `${fixtures}plugin`;
const project = (name: string) => `${fixtures}projects/${name}`;
const expected = (name: string) => readFileSync(`${fixtures}${name}.json`, 'utf8');
const temps: string[] = [];

afterAll(() => {
  temps.splice(0).forEach((dir) => rmSync(dir, { recursive: true, force: true }));
});

function tempDir(prefix: string): string {
  const dir = mkdtempSync(join(tmpdir(), prefix));
  temps.push(dir);
  return dir;
}

function pluginWith(version: string, migrations: string[]): string {
  const root = tempDir('hook-plugin-');
  cpSync(pluginRoot, root, { recursive: true });
  writeFileSync(join(root, '.claude-plugin', 'plugin.json'), JSON.stringify({ version }));
  const dir = join(root, 'skills', 'sdd-upgrade', 'references', 'migrations');
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  migrations.forEach((name) => writeFileSync(join(dir, name), `# ${name}\n`));
  return root;
}

function projectAt(version: string): string {
  const root = tempDir('hook-project-');
  mkdirSync(join(root, '.docs', 'sdd'), { recursive: true });
  writeFileSync(join(root, '.docs', 'sdd', 'sdd-kit.json'), JSON.stringify({ version }));
  return root;
}

describe('sdd hook session-start', () => {
  it.each(['pending-migration', 'outdated-kit', 'up-to-date', 'no-config'])('matches the bash hook output for %s', (name) => {
    expect(sessionStartOutput(project(name), pluginRoot, '26.10.0')).toBe(expected(name));
  });

  it('does not warn with an init in progress', () => {
    const root = mkdtempSync(join(tmpdir(), 'hook-init-'));
    try {
      mkdirSync(join(root, '.docs', 'sdd'), { recursive: true });
      writeFileSync(join(root, '.docs', 'sdd', 'sdd-kit.json'), '{"init": {"approved": ["PRODUCT.md"]}}');
      const output = JSON.parse(sessionStartOutput(root, pluginRoot, '26.10.0'));
      expect(output.systemMessage).toBeUndefined();
      expect(output.hookSpecificOutput.additionalContext).toContain('# using-sdd');
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it('writes nothing without .docs/sdd', () => {
    expect(sessionStartOutput(project('no-sdd'), pluginRoot, '26.10.0')).toBe('');
  });

  it('old node adds the warning', () => {
    const output = JSON.parse(sessionStartOutput(project('up-to-date'), pluginRoot, '20.11.0'));
    expect(output.systemMessage).toContain('sdd-kit necesita Node 22.18 o posterior; tienes 20.11.0');
    expect(output.hookSpecificOutput.additionalContext).toContain('# using-sdd');
  });

  it('orders migrations by semver', () => {
    const plugin = pluginWith('2.0.0', ['v0.9.0.md', 'v0.10.0.md']);
    const output = JSON.parse(sessionStartOutput(projectAt('0.9.0'), plugin, '26.10.0'));
    expect(output.systemMessage).toContain('hasta la 0.10.0');
  });

  it('ignores non-semver migration names', () => {
    const plugin = pluginWith('2.0.0', ['v0.9.0.md', 'vNEXT.md']);
    expect(sessionStartOutput(projectAt('0.9.0'), plugin, '26.10.0')).not.toContain('trae migraciones');
  });

  it('shows both warnings, the version one first', () => {
    const plugin = pluginWith('2.0.0', ['v2.2.0.md']);
    const output = JSON.parse(sessionStartOutput(projectAt('2.1.0'), plugin, '26.10.0'));
    const [version, migrations] = output.systemMessage.split('\n\n');
    expect(version).toContain('esta sesión carga el kit 2.0.0 y el proyecto pide el 2.1.0');
    expect(migrations).toContain('trae migraciones hasta la 2.2.0');
  });

  it('gives the offer order only to the agent', () => {
    const output = JSON.parse(sessionStartOutput(project('pending-migration'), pluginRoot, '26.10.0'));
    expect(output.systemMessage).not.toContain('Antes de atender la primera petición');
    expect(output.hookSpecificOutput.additionalContext).toContain('Antes de atender la primera petición');
  });

  it('gives no offer order without pending migrations', () => {
    const output = JSON.parse(sessionStartOutput(project('outdated-kit'), pluginRoot, '26.10.0'));
    expect(output.hookSpecificOutput.additionalContext).not.toContain('Antes de atender la primera petición');
  });

  it('old node keeps the migration warning', () => {
    const output = JSON.parse(sessionStartOutput(project('pending-migration'), pluginRoot, '20.11.0'));
    expect(output.systemMessage).toContain('trae migraciones hasta la 2.3.0');
    expect(output.systemMessage).toContain('sdd-kit necesita Node 22.18 o posterior; tienes 20.11.0');
  });
});
