import { randomUUID } from 'node:crypto';
import { existsSync, mkdirSync, rmSync } from 'node:fs';
import { parse, resolve, join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { kitRoot, run } from '../process.ts';
import { newCampaign, runCampaign, runLib, slashed, subjects, testRoot } from './campaign.ts';

const repoTemp = (name: string): string => join(kitRoot, '.temp', name);
const uuid = (): string => randomUUID().replaceAll('-', '');
const shortId = (): string => uuid().slice(0, 8);

describe('Lanzador de referencia de sujetos headless (tests/headless/run.mjs)', () => {
  it('aborta con RUNS_DIR fuera del scratchpad y de .temp/', () => {
    const campaign = newCampaign(testRoot('outside'));
    // La carpeta temporal cuelga de .temp/ del repo: la ruta de fuera no se crea, la guarda aborta antes.
    const outside = join(parse(kitRoot).root, `sdd-fuera-${uuid()}`, 'runs');

    const result = runCampaign(campaign, { RUNS_DIR: outside });

    expect(result.code).not.toBe(0);
    expect(result.output).toMatch(/fuera del scratchpad o de \.temp\//i);
    expect(subjects(campaign)).toHaveLength(0);
    expect(existsSync(join(outside, '..'))).toBe(false);
  });

  it('acepta RUNS_DIR bajo .temp/ del repo', () => {
    const campaign = newCampaign(testRoot('repo-temp'));
    const runs = repoTemp(`launcher-${uuid()}`);
    try {
      const result = runCampaign(campaign, { SCENARIOS: 'a', RUNS_DIR: runs });

      expect(result.code, result.output).toBe(0);
      expect(existsSync(join(runs, 'dry/red/out/a-1.tools.txt'))).toBe(true);
    } finally {
      rmSync(runs, { recursive: true, force: true });
    }
  });

  it('en seco no corta por la ruta del scratchpad, aunque cuelgue del repo con un nombre largo', () => {
    const campaign = newCampaign(testRoot('dry-long-runs'));
    const runs = repoTemp(`launcher-${'x'.repeat(100)}-${shortId()}`);
    try {
      const result = runCampaign(campaign, { SCENARIOS: 'a', RUNS_DIR: runs });

      expect(existsSync(join(runs, 'dry/red/out/a-1.tools.txt')), result.output).toBe(true);
    } finally {
      rmSync(runs, { recursive: true, force: true });
    }
  });

  it('en seco corta la ruta que tendría la salida en SPEC_DIR', () => {
    const campaign = newCampaign(testRoot('dry-long-spec'));
    const spec = repoTemp(`launcher-${'x'.repeat(100)}-${shortId()}`);
    mkdirSync(spec, { recursive: true });
    try {
      const result = runCampaign(campaign, { SCENARIOS: 'a', SPEC_DIR: spec });

      expect(result.output).toMatch(/ruta de \d+ caracteres/i);
      expect(existsSync(join(campaign.out, 'a-1.tools.txt'))).toBe(false);
    } finally {
      rmSync(spec, { recursive: true, force: true });
    }
  });

  it('borra el molde del sujeto y conserva su stream y sus argumentos', () => {
    const campaign = newCampaign(testRoot('cleanup'));

    const result = runCampaign(campaign, { SCENARIOS: 'a' });

    expect(result.code, result.output).toBe(0);
    expect(existsSync(join(campaign.runs, 'red/a-1'))).toBe(false);
    expect(existsSync(join(campaign.runs, 'red/a-1.jsonl'))).toBe(true);
    expect(existsSync(join(campaign.runs, 'red/a-1.args'))).toBe(true);
    expect(existsSync(join(campaign.out, 'a-1/readme.md'))).toBe(true);
  });

  it('con KEEP_MOLD=1 conserva el molde', () => {
    const campaign = newCampaign(testRoot('keep'));

    const result = runCampaign(campaign, { SCENARIOS: 'a', KEEP_MOLD: '1' });

    expect(result.code, result.output).toBe(0);
    expect(existsSync(join(campaign.runs, 'red/a-1/repo/README.md'))).toBe(true);
  });

  it('borra la carpeta de Claude Code del sujeto y no la de otros', () => {
    const root = testRoot('claude-tmp');
    const campaign = newCampaign(root);
    const base = join(root, 'cc-tmp');
    const mold = resolve(join(campaign.runs, 'red/a-1/repo'));
    const own = join(base, 'claude', mold.replace(/[^A-Za-z0-9]/g, '-'));
    const other = join(base, 'claude', 'D--code-otro-proyecto');
    mkdirSync(join(own, 'tasks'), { recursive: true });
    mkdirSync(other, { recursive: true });

    const result = runCampaign(campaign, { SCENARIOS: 'a', CLAUDE_CODE_TMPDIR: base });

    expect(result.code, result.output).toBe(0);
    expect(existsSync(own)).toBe(false);
    expect(existsSync(other)).toBe(true);
  });

  it('subject_cleanup no borra con la etiqueta vacía ni fuera de RUNS_DIR', () => {
    const root = slashed(testRoot('guard'));
    mkdirSync(`${root}/runs/red/x`, { recursive: true });
    mkdirSync(`${root}/elsewhere`, { recursive: true });
    const script = `RUNS='${root}/runs/red'; ` +
      `LABEL=''; RUN='${root}/runs/red/x'; R="$RUN/repo"; subject_cleanup; ` +
      `LABEL=x; RUN='${root}/elsewhere'; R="$RUN/repo"; subject_cleanup`;

    const output = runLib(script).output;

    expect(existsSync(`${root}/runs/red/x`)).toBe(true);
    expect(existsSync(`${root}/elsewhere`)).toBe(true);
    expect(output.match(/no se borra/gi), output).toHaveLength(2);
  });

  it('aborta antes de escribir si el molde no es su propio repo git (ticket 0086 §1)', () => {
    // El %TEMP% de aquel sujeto colgaba de un repo: sin g init, git subía hasta él y le cambió el HEAD.
    const root = testRoot('nested');
    run('git', ['-C', root, 'init', '-q', '-b', 'main']);
    const campaign = newCampaign(root, { init: '' });

    const result = runCampaign(campaign, { SCENARIOS: 'a' });

    expect(result.output).toMatch(/no es su propio repo git/i);
    expect(run('git', ['-C', root, 'rev-parse', '-q', '--verify', 'HEAD']).output).toBe('');
    expect(subjects(campaign)).toHaveLength(0);
  });

  it('guarda solo copias planas: una ruta con carpetas crece hasta pasar de 140 caracteres (task 0062)', () => {
    const campaign = newCampaign(testRoot('flat'), { keepName: 'specs/0001/spec.md' });

    const result = runCampaign(campaign, { SCENARIOS: 'a' });

    expect(result.output).toMatch(/copia plana/i);
    expect(existsSync(join(campaign.out, 'a-1/specs'))).toBe(false);
  });

  it('exige SUBJECT_CAP y COST_CAP, que salen de la previsión de la spec', () => {
    const campaign = newCampaign(testRoot('caps'));

    const result = runCampaign(campaign, { SUBJECT_CAP: null });

    expect(result.code).not.toBe(0);
    expect(subjects(campaign)).toHaveLength(0);
  });
});
