import { cpSync, existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { CONCURRENT, maxConcurrent, newCampaign, readText, runCampaign, runSh, setTools, slashed, subjects, testRoot, write } from './campaign.ts';

describe('Lanzador de referencia de sujetos headless (tests/headless/run.sh)', () => {
  it('no pasa de SUBJECT_CAP sujetos', () => {
    const campaign = newCampaign(testRoot('cap'));

    const result = runCampaign(campaign, { SUBJECT_CAP: '2' });

    expect(result.output).toMatch(/techo de 2 sujetos/i);
    expect(subjects(campaign)).toHaveLength(2);
  });

  it('no lanza si el coste de la campaña, sumando todas las fases, llega a COST_CAP', () => {
    const campaign = newCampaign(testRoot('cost'));
    // Dos eventos result: cuenta solo el último.
    setTools(join(campaign.dry, 'green/out'), 'x-1', '=== RESULTADO (3 turnos, 9 $)\n=== RESULTADO (4 turnos, 4.5 $)');

    const result = runCampaign(campaign, { COST_CAP: '4' });

    expect(result.output).toMatch(/techo de 4 \$ alcanzado \(4\.50 \$ gastados, 0 en curso a 0\.4 \$\)/i);
    expect(subjects(campaign)).toHaveLength(1);
  });

  it('no relanza una etiqueta que ya tiene tools.txt en su fase (ticket de la feature 0032 §2)', () => {
    const campaign = newCampaign(testRoot('existing'));
    setTools(campaign.out, 'a-1', 'marca');

    const result = runCampaign(campaign, { SCENARIOS: 'a b' });

    expect(result.output).toMatch(/ya existe a-1: sube SUBJECT/i);
    expect(readText(join(campaign.out, 'a-1.tools.txt'))).toMatch(/^marca/i);
    expect(existsSync(join(campaign.out, 'b-1.tools.txt'))).toBe(true);
  });

  it('no lanza si lo gastado más lo lanzado a SUBJECT_COST pasa de COST_CAP (ticket de la feature 0086 §3)', () => {
    const campaign = newCampaign(testRoot('launched'), { launch: 'sleep 3; subject_launch "x"' });

    const result = runCampaign(campaign, { SCENARIOS: 'a b c', COST_CAP: '1', SUBJECT_COST: '0.4' });

    expect(result.output).toMatch(/techo de 1 \$ alcanzado \(0\.00 \$ gastados, 2 en curso a 0\.4 \$\)/i);
    expect(subjects(campaign)).toHaveLength(2);
  });

  it('cuenta un sujeto cortado como sujeto y como SUBJECT_COST (ticket del patch 0094 §3)', () => {
    const campaign = newCampaign(testRoot('cut'));
    write(join(campaign.runs, 'dry/live/red.z-1'), '999999\n');

    const result = runCampaign(campaign, { SCENARIOS: 'a b', SUBJECT_CAP: '2' });

    expect(result.output).toMatch(/techo de 2 sujetos/i);
    expect(subjects(campaign)).toHaveLength(1);
    expect(result.output).toMatch(/cortados sin salida: 1 \(contados a 5 \$ cada uno\)/i);
  });

  it('un sujeto cortado de una tanda real no cuenta en un ensayo en seco', () => {
    const campaign = newCampaign(testRoot('cut-real'));
    write(join(campaign.runs, 'live/red.z-1'), '999999\n');

    const result = runCampaign(campaign, { SCENARIOS: 'a b', SUBJECT_CAP: '2' });

    expect(subjects(campaign), result.output).toHaveLength(2);
    expect(result.output).not.toMatch(/cortados sin salida/i);
  });

  it('no relanza una etiqueta que está en curso', () => {
    const campaign = newCampaign(testRoot('running-label'), { launch: 'sleep 4; subject_launch "x"' });

    const result = runCampaign(campaign, { SCENARIOS: 'a a' });

    expect(result.output).toMatch(/ya existe a-1: sube SUBJECT/i);
    expect(result.output.match(/\[a-1\] listo/gi)).toHaveLength(1);
  });

  it('lanza si lo gastado más lo lanzado iguala COST_CAP: el techo es estrictamente mayor', () => {
    const campaign = newCampaign(testRoot('cost-edge'), { launch: 'sleep 3; subject_launch "x"' });

    const result = runCampaign(campaign, { SCENARIOS: 'a b', COST_CAP: '1', SUBJECT_COST: '0.5' });

    expect(subjects(campaign), result.output).toHaveLength(2);
    expect(result.output).not.toMatch(/techo de/i);
  });

  it('rompe un cerrojo sin dueño escrito y lanza', () => {
    const campaign = newCampaign(testRoot('orphan-lock'));
    mkdirSync(join(campaign.runs, 'live/.lock'), { recursive: true });

    const result = runCampaign(campaign, { SCENARIOS: 'a' }, { command: `timeout 60 bash '${runSh}'` });

    expect(subjects(campaign), result.output).toHaveLength(1);
  });

  it.each([
    { name: 'MAX_PARALLEL', value: '0' },
    { name: 'SUBJECT_CAP', value: '0' },
  ])('aborta con MAX_PARALLEL o SUBJECT_CAP que no son enteros positivos', ({ name, value }) => {
    const campaign = newCampaign(testRoot(`invalid-${name}`));

    const result = runCampaign(campaign, { SCENARIOS: 'a', [name]: value }, { command: `timeout 30 bash '${runSh}'` });

    expect(result.code).not.toBe(0);
    expect(result.output).toMatch(new RegExp(`${name} tiene que ser un entero positivo: 0`, 'i'));
    expect(subjects(campaign)).toHaveLength(0);
  });

  it('MAX_PARALLEL limita los sujetos a la vez (ticket de la feature 0091 §1)', () => {
    const campaign = newCampaign(testRoot('parallel'), { launch: CONCURRENT });

    const result = runCampaign(campaign, { SCENARIOS: 'a b c d', MAX_PARALLEL: '1' });

    expect(maxConcurrent(campaign), result.output).toBe(1);
    expect(subjects(campaign)).toHaveLength(4);
    expect(result.output).toMatch(/esperando hueco: 1 sujetos en curso \(MAX_PARALLEL=1\)/i);
  });

  it('MAX_PARALLEL cuenta los sujetos de otro run.sh sobre el mismo RUNS_DIR', () => {
    const campaign = newCampaign(testRoot('two-launchers'), { launch: CONCURRENT });
    cpSync(join(campaign.spec, 'red'), join(campaign.spec, 'green'), { recursive: true });
    const green = slashed(join(campaign.spec, 'green/subject.sh'));
    const command = `SCENARIOS='a b' bash '${runSh}' & PHASE=green SUBJECT_SH='${green}' SCENARIOS='c d' bash '${runSh}'; wait`;

    const result = runCampaign(campaign, { MAX_PARALLEL: '1' }, { command });

    expect(maxConcurrent(campaign), result.output).toBe(1);
    expect(subjects(campaign)).toHaveLength(4);
  });

  it('marca al sujeto en RUNS_DIR/dry/live mientras corre en seco y borra la marca al acabar', () => {
    const campaign = newCampaign(testRoot('marker-live'), { launch: CONCURRENT });

    const result = runCampaign(campaign, { SCENARIOS: 'a' });

    expect(readText(join(campaign.runs, '../conc.live')).split(/\r?\n/), result.output).toContain('red.a-1');
    const live = join(campaign.runs, 'dry/live');
    expect(existsSync(live) ? readdirSync(live) : []).toHaveLength(0);
  });

  it('dos fases con el mismo RUNS_DIR no comparten molde ni stream (ticket del patch 0082 §1)', () => {
    const campaign = newCampaign(testRoot('phases'));
    cpSync(join(campaign.spec, 'red'), join(campaign.spec, 'green'), { recursive: true });

    // En secuencia basta: con la ruta sin fase, la segunda borraba el molde de la primera (rm -rf en subject_init).
    for (const phase of ['red', 'green']) {
      const result = runCampaign(campaign, { SCENARIOS: 'a', PHASE: phase, SUBJECT_SH: join(campaign.spec, `${phase}/subject.sh`), KEEP_MOLD: '1' });
      expect(result.code, result.output).toBe(0);
    }

    for (const phase of ['red', 'green']) {
      expect(existsSync(join(campaign.runs, `${phase}/a-1/repo/README.md`))).toBe(true);
      expect(existsSync(join(campaign.runs, `${phase}/a-1.jsonl`))).toBe(true);
    }
  });

  it('para a petición si existe el fichero stop en RUNS_DIR', () => {
    const campaign = newCampaign(testRoot('stop'));
    writeFileSync(join(campaign.runs, 'stop'), '');

    const result = runCampaign(campaign);

    expect(result.output).toMatch(/parada a petición/i);
    expect(subjects(campaign)).toHaveLength(0);
  });
});

