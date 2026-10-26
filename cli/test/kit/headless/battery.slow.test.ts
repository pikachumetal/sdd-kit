import { existsSync, mkdirSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { cleanGitEnv, kitRoot, run, type RunResult } from '../process.ts';
import { headless, readLines, runBash, slashed, testRoot, write } from './campaign.ts';

const batteryJs = join(headless, 'battery.mjs');

const TABLE = `# Batería de juguete

| Id | Paso | Petición | Molde | Esperado | n | Umbral | Modelo | Procedencia |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| r1 | roadmap | Apunta lo del filtro. | salas | \`sdd-kit:sdd-roadmap\` | 2 | 2/2 | sonnet | toy |
| r2 | roadmap | Reordena el roadmap. | salas | \`sdd-kit:sdd-roadmap\` | 1 | 1/1 | opus | toy |
| f1 | feature | Añade un filtro. | salas | \`sdd-kit:sdd-start-feature\` | 1 | 1/1 | sonnet | toy |
| t1 | directa | Corrige la errata «Guadar», ¿vale? | salas | ninguna | 1 | 1/1 | sonnet | toy |
| d1 | duda | Hay que mejorar las reservas. | salas | ninguna | 2 | 1/2 | sonnet | toy |
`;

interface Battery {
  battery: string;
  kit: string;
  spec: string;
  runs: string;
}

function newBattery(root: string): Battery {
  const battery = join(root, 'battery');
  const kit = join(root, 'kit');
  mkdirSync(join(root, 'spec'), { recursive: true });
  mkdirSync(join(root, 'scratchpad/runs'), { recursive: true });
  write(join(kit, 'skills/using-sdd/SKILL.md'), '# using-sdd\n');
  write(join(battery, 'battery.md'), TABLE);
  const subject = [
    '#!/usr/bin/env bash',
    'set -u',
    `. "${slashed(join(headless, 'lib.sh'))}"`,
    'subject_init "$1" "$2" "$4" using-sdd',
    `ASK="$("$NODE" "${slashed(batteryJs)}" field "$(dirname "$0")/battery.md" "$3" Petición)"`,
    "g init -q -b main; put README.md <<< 'salas'; commit \"feat: base\"",
    'subject_launch "$ASK"',
    "echo '## estado' | subject_save",
  ].join('\n');
  write(join(battery, 'subject.sh'), subject);
  return { battery, kit, spec: join(root, 'spec'), runs: join(root, 'scratchpad/runs') };
}

function runBattery(battery: Battery, overrides: Record<string, string>): RunResult {
  const env = {
    ...cleanGitEnv,
    NODE: process.execPath,
    DRY_RUN: '1',
    BATTERY_DIR: battery.battery,
    SPEC_DIR: battery.spec,
    PHASE: 'battery',
    RUNS_DIR: battery.runs,
    KIT_DIR: battery.kit,
    SUBJECT_CAP: '20',
    COST_CAP: '20',
    ...overrides,
  };
  return runBash([join(headless, 'battery.sh')], env);
}

const verdict = (table: string, out: string): RunResult => run(process.execPath, [batteryJs, 'verdict', table, out]);

const setFinishedTools = (path: string, text: string): string => write(path, `${text}\n=== RESULTADO (1 turnos, 0.1 $)\n`);

function argsFiles(battery: Battery): string[] {
  const dir = join(battery.runs, 'battery');
  return existsSync(dir) ? readdirSync(dir).filter((name) => name.endsWith('.args')).sort() : [];
}

const argAfter = (args: string[], flag: string): string | undefined => args[args.indexOf(flag) + 1];

describe('Veredicto de una batería (tests/headless/battery.mjs)', () => {
  let tablePath: string;

  beforeAll(() => {
    tablePath = join(newBattery(testRoot('verdict')).battery, 'battery.md');
  });

  it('verdict da verde y rojo por escenario', () => {
    const out = testRoot('verdict-out');
    for (const label of ['r1-1', 'r1-2', 'r2-1']) setFinishedTools(join(out, `${label}.tools.txt`), '>>> Skill: sdd-kit:sdd-roadmap');
    setFinishedTools(join(out, 'f1-1.tools.txt'), '>>> Skill: sdd-kit:sdd-start-patch');
    setFinishedTools(join(out, 't1-1.tools.txt'), '>>> Edit: README.md');

    const result = verdict(tablePath, out);

    expect(result.output).toMatch(/r1 · 2\/2 · umbral 2\/2 · verde/i);
    expect(result.output).toMatch(/f1 · 0\/1 · umbral 1\/1 · rojo/i);
    expect(result.output).toMatch(/t1 · 1\/1 · umbral 1\/1 · verde/i);
    expect(result.code).toBe(1);
  });

  it('verdict no cuenta como puerta la invocación de using-sdd, que es el enrutador', () => {
    const out = testRoot('router-out');
    setFinishedTools(join(out, 'f1-1.tools.txt'), '>>> Skill: sdd-kit:using-sdd\n>>> Skill: sdd-kit:sdd-start-feature');
    setFinishedTools(join(out, 't1-1.tools.txt'), '>>> Skill: sdd-kit:using-sdd\n>>> Edit: README.md');

    const result = verdict(tablePath, out);

    expect(result.output).toMatch(/f1 · 1\/1 · umbral 1\/1 · verde/i);
    expect(result.output).toMatch(/t1 · 1\/1 · umbral 1\/1 · verde/i);
  });

  it('verdict cuenta como rojo un escenario con sujetos de menos', () => {
    const out = testRoot('missing-out');
    setFinishedTools(join(out, 'r1-1.tools.txt'), '>>> Skill: sdd-kit:sdd-roadmap');
    setFinishedTools(join(out, 'd1-1.tools.txt'), '>>> Read: README.md');

    const result = verdict(tablePath, out);

    expect(result.output).toMatch(/r1 · 1\/2 · umbral 2\/2 · rojo · faltan 1/i);
    expect(result.output).toMatch(/d1 · 1\/2 · umbral 1\/2 · rojo · faltan 1/i);
  });

  it('verdict da por buena cualquier skill con «cualquiera», pero no un sujeto sin terminar (ticket de la feature 0165)', () => {
    const root = testRoot('any');
    const table = write(join(root, 'any.md'), [
      '| Id | Paso | Petición | Molde | Esperado | n | Umbral | Modelo | Procedencia |',
      '| --- | --- | --- | --- | --- | --- | --- | --- | --- |',
      '| a1 | brief | Implementa la Task 1. | reservas | `cualquiera` | 2 | 2/2 | sonnet | toy |',
      '| a2 | brief | Implementa la Task 1. | reservas | `cualquiera` | 2 | 2/2 | sonnet | toy |',
      '',
    ].join('\n'));
    const out = join(root, 'any-out');
    setFinishedTools(join(out, 'a1-1.tools.txt'), '>>> Skill: sdd-kit:sdd-tdd');
    setFinishedTools(join(out, 'a1-2.tools.txt'), '>>> Edit: src/informe.js');
    setFinishedTools(join(out, 'a2-1.tools.txt'), '>>> Skill: sdd-kit:sdd-tdd');
    write(join(out, 'a2-2.tools.txt'), '>>> Read: README.md\n');

    const result = verdict(table, out);

    expect(result.output).toMatch(/a1 · 2\/2 · umbral 2\/2 · verde/i);
    expect(result.output).toMatch(/a2 · 1\/2 · umbral 2\/2 · rojo · faltan 1/i);
  });

  it('verdict cuenta como faltan los sujetos que no terminaron, sin RESULTADO', () => {
    const out = testRoot('cut-out');
    write(join(out, 't1-1.tools.txt'), '\n');
    write(join(out, 'd1-1.tools.txt'), '>>> Read: README.md\n=== RESULTADO (3 turnos, 0.07 $)\n');
    write(join(out, 'd1-2.tools.txt'), '>>> Read: README.md\n');

    const result = verdict(tablePath, out);

    expect(result.output).toMatch(/t1 · 0\/1 · umbral 1\/1 · rojo · faltan 1/i);
    expect(result.output).toMatch(/d1 · 1\/2 · umbral 1\/2 · rojo · faltan 1/i);
  });
});

describe('Lanzador de baterías (tests/headless/battery.sh)', () => {
  it('battery.sh lanza solo el tramo pedido', () => {
    const toy = newBattery(testRoot('step'));

    const result = runBattery(toy, { STEPS: 'roadmap' });

    expect(argsFiles(toy), result.output).toEqual(['r1-1.args', 'r1-2.args', 'r2-1.args']);
    expect(argAfter(readLines(join(toy.runs, 'battery/r1-2.args')), '--model')).toBe('sonnet');
    expect(argAfter(readLines(join(toy.runs, 'battery/r2-1.args')), '--model')).toBe('opus');
    expect(result.output).toMatch(/r1 · 0\/2 · umbral 2\/2 · rojo/i);
    expect(result.output).not.toMatch(/faltan/i);
  });

  it('battery.sh no relanza una batería cuyas etiquetas ya tienen salida en su fase', () => {
    const toy = newBattery(testRoot('existing'));
    setFinishedTools(join(toy.runs, 'dry/battery/out/r1-1.tools.txt'), 'marca');

    const result = runBattery(toy, { STEPS: 'roadmap' });

    expect(result.code).not.toBe(0);
    expect(result.output).toMatch(/ya existe r1-1 en .*: borra esa carpeta o cambia PHASE/i);
    expect(argsFiles(toy)).toEqual([]);
  });

  it('battery.sh rechaza un paso desconocido', () => {
    const toy = newBattery(testRoot('unknown'));

    const result = runBattery(toy, { STEPS: 'nope' });

    expect(result.code).not.toBe(0);
    expect(result.output).toMatch(/paso desconocido: nope/i);
    expect(argsFiles(toy)).toEqual([]);
  });

  it('la batería de using-sdd monta su molde con el marcador del kit', () => {
    const root = testRoot('using-sdd');
    const kit = join(root, 'kit');
    write(join(kit, 'skills/using-sdd/SKILL.md'), '# using-sdd\n');
    write(join(kit, '.claude-plugin/plugin.json'), '{"name":"sdd-kit","version":"2.2.0"}\n');
    write(join(kit, 'skills/sdd-upgrade/references/migrations/v2.3.0.md'), '# v2.3.0\n');
    mkdirSync(join(root, 'spec'), { recursive: true });
    mkdirSync(join(root, 'scratchpad/runs'), { recursive: true });
    const real: Battery = { battery: join(kitRoot, 'tests/batteries/using-sdd'), kit, spec: join(root, 'spec'), runs: join(root, 'scratchpad/runs') };

    const result = runBattery(real, { STEPS: 'sdd-config sdd-propose', KEEP_MOLD: '1' });

    expect(argsFiles(real), result.output).toEqual([
      'bt1-1.args', 'bt1-2.args', 'c1w-1.args', 'c2-1.args', 'c2-2.args', 'f1-1.args', 'f2-1.args', 'f3-1.args',
      'p1-1.args', 'pc1-1.args', 'pc1-2.args', 's1-1.args', 's1-2.args', 't1-1.args', 'v1-1.args', 'v1-2.args',
    ]);
    for (const label of ['s1-1', 'v1-1']) {
      expect(readFileSync(join(real.runs, `battery/${label}/repo/.docs/sdd/sdd-kit.json`), 'utf8')).toMatch(/^\{"version": "2\.3\.0", "channel": "plugin"/i);
    }
    expect(existsSync(join(real.runs, 'battery/s1-1/repo/src/app.js'))).toBe(true);
    expect(existsSync(join(real.runs, 'battery/v1-1/repo/pages/pedido-detalle.html'))).toBe(true);
    expect(readLines(join(real.runs, 'battery/v1-1.args')).at(-1)).toMatch(/^Pon Guardar y Cancelar/i);
  });

  it('la petición llega intacta con comillas latinas y tildes', () => {
    const toy = newBattery(testRoot('accents'));

    const result = runBattery(toy, { STEPS: 'directa' });

    expect(readLines(join(toy.runs, 'battery/t1-1.args')).at(-1), result.output).toBe('Corrige la errata «Guadar», ¿vale?');
  });
});

