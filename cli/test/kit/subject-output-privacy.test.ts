import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { findMachineLeak, machineUserPattern, readEvidence, selectEvidencePath, stagedEvidence } from './privacy.ts';
import { cleanGitEnv } from './process.ts';

const ACCOUNT_EMAIL = 'cuenta.falsa@example.net';
const ACCOUNT_WARNING = 'no se pudo leer oauthAccount.emailAddress de .claude.json: el email de la cuenta queda sin comprobar';

// Una carpeta con un fichero falso: ningún test lee el .claude.json ni la identidad de git de la máquina.
const fakeFile = (name: string, content: string): string => {
  const dir = mkdtempSync(join(tmpdir(), 'machine-leak-'));
  writeFileSync(join(dir, name), content);
  return dir;
};
const fakeEnv = (claudeJson: string): NodeJS.ProcessEnv => ({
  ...cleanGitEnv,
  CLAUDE_CONFIG_DIR: fakeFile('.claude.json', claudeJson),
  GIT_CONFIG_GLOBAL: join(fakeFile('gitconfig', '[user]\n\tname = Alice Liddell\n'), 'gitconfig'),
});
const CLEAN = { path: 'a/red/clean.txt', text: 'commits de Fixture' };

describe('La evidencia que lleva el commit no tiene el home de la máquina', () => {
  it('toma como evidencia las salidas de sujetos y los RED y GREEN de tests/, y nada más', () => {
    const spec = '.docs/sdd/specs/20260101-000000-feature-0001-x';
    const evidence = [`${spec}/red/out/a.txt`, `${spec}/green2/state.txt`, `${spec}/battery-s1/out/b.md`, `${spec}/campaign/out/x.md`, 'tests/patch-lane-red.md'];
    const others = [`${spec}/spec.md`, 'tests/SubjectOutputPrivacy.Tests.ps1', 'tests/batteries/x/out-red.md', 'skills/sdd-propose/SKILL.md'];

    expect(selectEvidencePath([...evidence, ...others])).toEqual(evidence);
  });

  it('ningún fichero de evidencia del commit tiene una ruta de usuario, el usuario ni el user.name de git', () => {
    expect(findMachineLeak(readEvidence(stagedEvidence())), 'el repo es público: pasa las salidas por tests/headless/extract.mjs clean').toEqual([]);
  });

  it('da por fuga la evidencia con el email de la cuenta de .claude.json, y solo nombra el fichero', () => {
    const env = fakeEnv(JSON.stringify({ oauthAccount: { emailAddress: ACCOUNT_EMAIL } }));
    const leak = { path: 'a/red/leak.txt', text: `userEmail: ${ACCOUNT_EMAIL.toUpperCase()}` };

    expect(findMachineLeak([CLEAN, leak], env)).toEqual(['a/red/leak.txt']);
  });

  it('sin la clave de la cuenta avisa, deja pasar la evidencia limpia y sigue parando la identidad de git', () => {
    const warn = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);
    const leak = { path: 'a/red/leak.txt', text: 'aprobada por Alice Liddell' };

    try {
      expect(findMachineLeak([CLEAN], fakeEnv('{"oauthAccount":{}}'))).toEqual([]);
      expect(findMachineLeak([CLEAN, leak], fakeEnv('{"oauthAccount":{}}'))).toEqual(['a/red/leak.txt']);
      expect(warn).toHaveBeenCalledWith(`${ACCOUNT_WARNING}\n`);
    } finally {
      warn.mockRestore();
    }
  });

  it('sin home no da por fuga cualquier fichero', () => {
    expect(machineUserPattern({}).test('cualquier texto')).toBe(false);
  });

  it('un usuario que es palabra corriente, como runner en GitHub Actions, no da por fuga el texto normal (patch 0245)', () => {
    expect(machineUserPattern({ HOME: '/home/runner' }).test('TDD con el test runner nativo')).toBe(false);
    expect(machineUserPattern({ HOME: '/home/alice' }).test('drwxr-xr-x alice')).toBe(true);
  });
});
