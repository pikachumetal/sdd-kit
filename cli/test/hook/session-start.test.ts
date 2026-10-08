import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { sessionStartOutput } from '../../bin/session-start.js';

const fixtures = fileURLToPath(new URL('../fixtures/hook/', import.meta.url));
const pluginRoot = `${fixtures}plugin`;
const project = (name: string) => `${fixtures}projects/${name}`;
const expected = (name: string) => readFileSync(`${fixtures}${name}.json`, 'utf8');

describe('sdd hook session-start', () => {
  it.each(['pending-migration', 'outdated-kit', 'up-to-date', 'no-config'])('matches the bash hook output for %s', (name) => {
    expect(sessionStartOutput(project(name), pluginRoot, '26.10.0')).toBe(expected(name));
  });

  it('writes nothing without .docs/sdd', () => {
    expect(sessionStartOutput(project('no-sdd'), pluginRoot, '26.10.0')).toBe('');
  });

  it('old node adds the warning', () => {
    const output = JSON.parse(sessionStartOutput(project('up-to-date'), pluginRoot, '20.11.0'));
    expect(output.systemMessage).toContain('sdd-kit necesita Node 22.18 o posterior; tienes 20.11.0');
    expect(output.hookSpecificOutput.additionalContext).toContain('# using-sdd');
  });

  it('old node keeps the migration warning', () => {
    const output = JSON.parse(sessionStartOutput(project('pending-migration'), pluginRoot, '20.11.0'));
    expect(output.systemMessage).toContain('trae migraciones hasta la 2.3.0');
    expect(output.systemMessage).toContain('sdd-kit necesita Node 22.18 o posterior; tienes 20.11.0');
  });
});
