import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import type { RunResult } from '../process.ts';
import { run } from '../process.ts';
import { headless, newCampaign, readLines, readText, runCampaign, testRoot, write } from './campaign.ts';

describe('Marcador del molde con la versión del kit (lib.sh)', () => {
  let markerRun: RunResult;
  let markerJson: string;

  beforeAll(() => {
    const campaign = newCampaign(testRoot('marker'), { keepName: 'marker.json', launch: `put_kit_marker '"channel": "plugin"'; subject_launch "x"` });
    const migrations = join(campaign.kit, 'skills/sdd-upgrade/references/migrations');
    write(join(migrations, 'v2.9.0.md'), '# v2.9.0\n');
    write(join(migrations, 'v2.10.0.md'), '# v2.10.0\n');
    write(join(campaign.kit, '.claude-plugin/plugin.json'), '{"name":"sdd-kit","version":"2.9.1"}\n');
    const subject = join(campaign.spec, 'red/subject.sh');
    writeFileSync(subject, readFileSync(subject, 'utf8').replace('subject_keep "$R/README.md" marker.json', 'subject_keep "$R/.docs/sdd/sdd-kit.json" marker.json'));
    markerRun = runCampaign(campaign, { SCENARIOS: 'a' });
    markerJson = readText(join(campaign.out, 'a-1/marker.json'));
  });

  it('kit_version compara por SemVer', () => {
    expect(markerJson, markerRun.output).toMatch(/"version": "2\.10\.0"/i);
  });

  it('put_kit_marker escribe la versión del kit', () => {
    expect(markerJson, markerRun.output).toMatch(/^\{"version": "2\.10\.0", "channel": "plugin"\}/i);
  });
});

const personaFiles = (runs: string): string[] => readdirSync(join(runs, 'red')).filter((name) => /^a-1\.persona-.*\.txt$/i.test(name));

describe('Segundo turno real (lib.sh)', () => {
  it('TURN2 reanuda la sesión del primer turno', () => {
    const campaign = newCampaign(testRoot('turn2'));

    const result = runCampaign(campaign, { SCENARIOS: 'a', TURN2: 'Sigue.', SUPERPOWERS_DIR: 'C:/sp/6.4.2' });

    const first = readLines(join(campaign.runs, 'red/a-1.args'));
    const second = readLines(join(campaign.runs, 'red/a-1.resume.args'));
    expect(second[second.indexOf('--resume') + 1], result.output).toBe('dry-a-1');
    expect(second).toContain('C:/sp/6.4.2');
    expect(second[second.indexOf('--setting-sources') + 1]).toBe('');
    expect(second.at(-1)).toBe('Sigue.');
    expect(first.at(-1)).toBe('Invoca la skill sdd-kit:sdd-plan.');
    expect(readText(join(campaign.out, 'a-1.tools.txt')).match(/=== RESULTADO/gi)).toHaveLength(2);
    expect(result.output).toMatch(/coste acumulado: 1\.00 \$/i);
  });

  it('subject_converse reanuda hasta que el sujeto deja de preguntar', () => {
    const launch = 'echo "Contesta sí." > "$RUNS/hoja.md"; DRY_RESULT="¿Seguimos?" subject_launch "x"; subject_converse "$RUNS/hoja.md" 5';
    const campaign = newCampaign(testRoot('converse'), { launch });

    const result = runCampaign(campaign, { SCENARIOS: 'a' });

    expect(readLines(join(campaign.runs, 'red/a-1.resume.args')).at(-1), result.output).toBe('Respuesta de la persona.');
    expect(personaFiles(campaign.runs)).toHaveLength(1);
  });

  it('subject_converse para en el tope de turnos', () => {
    const launch = 'echo "Contesta sí." > "$RUNS/hoja.md"; export DRY_RESULT="¿Seguimos?"; subject_launch "x"; subject_converse "$RUNS/hoja.md" 3';
    const campaign = newCampaign(testRoot('cap'), { launch });

    const result = runCampaign(campaign, { SCENARIOS: 'a' });

    expect(personaFiles(campaign.runs), result.output).toHaveLength(3);
  });

  it('subject_converse suma el coste de la persona al último RESULTADO', () => {
    const launch = 'echo "Contesta sí." > "$RUNS/hoja.md"; DRY_RESULT="¿Seguimos?" subject_launch "x"; subject_converse "$RUNS/hoja.md" 5';
    const campaign = newCampaign(testRoot('cost'), { launch });

    const result = runCampaign(campaign, { SCENARIOS: 'a', DRY_PERSONA_COST: '0.25' });

    expect(result.output).toMatch(/coste acumulado: 1\.25 \$/i);
  });

  it('extract.mjs last devuelve el texto del último resultado', () => {
    const stream = write(join(testRoot('last'), 'last.jsonl'), [
      '{"type":"result","num_turns":1,"total_cost_usd":0.5,"result":"¿Primera?"}',
      '{"type":"result","num_turns":2,"total_cost_usd":1,"result":"Ultima respuesta."}',
    ].join('\n'));

    expect(run(process.execPath, [join(headless, 'extract.mjs'), 'last', stream]).output).toBe('Ultima respuesta.');
  });

  it('subject_resume sin session_id muere con su mensaje', () => {
    const campaign = newCampaign(testRoot('nosession'), { launch: 'subject_launch "x"; : > "$JSONL"; subject_resume "y"' });

    const result = runCampaign(campaign, { SCENARIOS: 'a' });

    expect(result.output).toMatch(/sin session_id: no se puede reanudar/i);
    expect(existsSync(join(campaign.runs, 'red/a-1.resume.args'))).toBe(false);
  });
});
