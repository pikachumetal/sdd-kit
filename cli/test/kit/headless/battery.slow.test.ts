import { existsSync, mkdirSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { cleanGitEnv, kitRoot, type RunResult } from '../process.ts';
import { headless, readLines, runToFile, slashed, testRoot, write } from './campaign.ts';

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
  write(join(kit, 'cli/bin/sdd.js'), '');
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
  return runToFile(process.execPath, [batteryJs, 'run'], env);
}

// La batería real de using-sdd sobre un kit de juguete en 2.2.0 con la migración v2.3.0.
function usingSddBattery(root: string): Battery {
  const kit = join(root, 'kit');
  write(join(kit, 'skills/using-sdd/SKILL.md'), '# using-sdd\n');
  write(join(kit, 'cli/bin/sdd.js'), '');
  write(join(kit, '.claude-plugin/plugin.json'), '{"name":"sdd-kit","version":"2.2.0"}\n');
  write(join(kit, 'skills/sdd-upgrade/references/migrations/v2.3.0.md'), '# v2.3.0\n');
  mkdirSync(join(root, 'spec'), { recursive: true });
  mkdirSync(join(root, 'scratchpad/runs'), { recursive: true });
  return { battery: join(kitRoot, 'tests/batteries/using-sdd'), kit, spec: join(root, 'spec'), runs: join(root, 'scratchpad/runs') };
}

function argsFiles(battery: Battery): string[] {
  const dir = join(battery.runs, 'battery');
  return existsSync(dir) ? readdirSync(dir).filter((name) => name.endsWith('.args')).sort() : [];
}

const argAfter = (args: string[], flag: string): string | undefined => args[args.indexOf(flag) + 1];

// Lo que prueba el subject.sh de bash sobre lib.sh: el lanzamiento y el veredicto se prueban en proceso (battery.test.ts).
describe('Sujetos de una batería (battery.mjs run sobre lib.sh)', () => {
  it('la batería de using-sdd monta su molde con el marcador del kit', () => {
    const real = usingSddBattery(testRoot('using-sdd'));

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

