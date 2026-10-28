import { describe, expect, it } from 'vitest';
import { findMachineLeak, machineUserPattern, readEvidence, selectEvidencePath, stagedEvidence } from './privacy.ts';

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

  it('sin home no da por fuga cualquier fichero', () => {
    expect(machineUserPattern({}).test('cualquier texto')).toBe(false);
  });

  it('un usuario que es palabra corriente, como runner en GitHub Actions, no da por fuga el texto normal (patch 0245)', () => {
    expect(machineUserPattern({ HOME: '/home/runner' }).test('TDD con el test runner nativo')).toBe(false);
    expect(machineUserPattern({ HOME: '/home/alice' }).test('drwxr-xr-x alice')).toBe(true);
  });
});
