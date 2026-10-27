import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { fakeClaude, headless, newCampaign, readLines, runCampaign, slashed, subjects, testRoot, withPath, write } from './campaign.ts';

describe('Lanzador de referencia de sujetos headless (tests/headless/run.sh)', () => {
  it('con SUPERPOWERS_DIR aísla al sujeto de la configuración del usuario y carga superpowers desde esa ruta (feature 0074)', () => {
    const campaign = newCampaign(testRoot('isolated'));

    const result = runCampaign(campaign, { SCENARIOS: 'a', SUPERPOWERS_DIR: 'C:/sp/6.4.1' });

    expect(result.code, result.output).toBe(0);
    const claudeArgs = readLines(join(campaign.runs, 'red/a-1.args'));
    const sources = claudeArgs.indexOf('--setting-sources');
    expect(sources).toBeGreaterThan(-1);
    expect(claudeArgs[sources + 1]).toBe('');
    expect(claudeArgs).toContain('C:/sp/6.4.1');
    expect(claudeArgs[claudeArgs.indexOf('C:/sp/6.4.1') - 1]).toBe('--plugin-dir');
  });

  it('sin SUPERPOWERS_DIR no aísla al sujeto', () => {
    const campaign = newCampaign(testRoot('not-isolated'));

    const result = runCampaign(campaign, { SCENARIOS: 'a' });

    expect(result.code, result.output).toBe(0);
    const argsFile = join(campaign.runs, 'red/a-1.args');
    expect(existsSync(argsFile)).toBe(true);
    expect(readLines(argsFile)).not.toContain('--setting-sources');
  });

  it('sin SUPERPOWERS_DIR aborta antes del primer claude -p si el kit declara dependencies (ticket de la feature 0095 §2)', () => {
    const campaign = newCampaign(testRoot('dependencies'));
    write(join(campaign.kit, '.claude-plugin/plugin.json'), '{"name":"sdd-kit","dependencies":[{"name":"superpowers"}]}\n');

    const result = runCampaign(campaign, { SCENARIOS: 'a' });

    expect(result.output).toMatch(/define SUPERPOWERS_DIR/i);
    expect(existsSync(join(campaign.runs, 'red/a-1.args'))).toBe(false);
    expect(subjects(campaign)).toHaveLength(0);
  });

  it('deja al sujeto leer su carpeta de ejecución, junto al molde (ticket de la feature 0099 §4)', () => {
    const campaign = newCampaign(testRoot('add-dir'));

    const result = runCampaign(campaign, { SCENARIOS: 'a' });

    expect(result.code, result.output).toBe(0);
    const claudeArgs = readLines(join(campaign.runs, 'red/a-1.args'));
    const dirs = claudeArgs.flatMap((arg, index) => (arg === '--add-dir' && index < claudeArgs.length - 1 ? [claudeArgs[index + 1]] : []));
    // Ruta Windows, como la del kit: con la de Git Bash, claude no resolvía el --plugin-dir.
    expect(dirs.filter((dir) => /^[A-Za-z]:\/.*\/red\/a-1$/i.test(dir))).toHaveLength(1);
  });

  it('con SUBJECT_TIMEOUT corta al sujeto encallado y sigue con el siguiente escenario (ticket de la feature 0098 §4)', () => {
    const root = testRoot('timeout');
    const campaign = newCampaign(root);
    // Un claude falso que se encalla: el tope tiene que alcanzar al ejecutable, no a un builtin.
    const bin = join(root, 'bin');
    write(join(bin, 'claude'), '#!/usr/bin/env bash\nexec sleep 60');

    const start = Date.now();
    const result = runCampaign(campaign, { SCENARIOS: 'a b', DRY_RUN: null, SUBJECT_TIMEOUT: '3', PATH: withPath(bin) });

    expect((Date.now() - start) / 1000, result.output).toBeLessThan(40);
    expect(result.output).toMatch(/tope de 3 s/i);
    expect(subjects(campaign)).toHaveLength(2);
  });

  it('el sujeto no puede lanzar su propio claude: su coste no lo vería run.sh (walkthrough de la feature 0173)', () => {
    const root = testRoot('nested-claude');
    const campaign = newCampaign(root);
    const log = join(root, 'nested.log');
    // La guarda evita que, sin el bloqueo, el claude falso se llame a sí mismo sin fin.
    const nested = '[ -n "${FAKE_NESTED:-}" ] && { echo "claude sin bloquear"; exit 0; }; export FAKE_NESTED=1; claude --version > "$NESTED_LOG" 2>&1; echo "rc=$?" >> "$NESTED_LOG"';
    const bin = fakeClaude(root, 'nested', nested);

    const result = runCampaign(campaign, { SCENARIOS: 'a', DRY_RUN: null, PATH: withPath(bin), NESTED_LOG: log });

    const logText = existsSync(log) ? readFileSync(log, 'utf8') : '';
    expect(logText, result.output).toMatch(/claude anidado bloqueado en un sujeto: run\.sh no ve su coste/i);
    expect(logText).toMatch(/rc=1/i);
  });

  it('aborta si SETTINGS no deshabilita el kit instalado', () => {
    const campaign = newCampaign(testRoot('settings'));

    const result = runCampaign(campaign, { SCENARIOS: 'a', SETTINGS: '{"enabledPlugins":{}}' });

    expect(result.output).toMatch(/SETTINGS sin deshabilitar el kit instalado/i);
    expect(subjects(campaign)).toHaveLength(0);
  });

  it('el SETTINGS por defecto carga deny-kill.mjs (walkthrough de la feature 0168 §5)', () => {
    const campaign = newCampaign(testRoot('deny-default'));

    const result = runCampaign(campaign, { SCENARIOS: 'a' });

    expect(result.code, result.output).toBe(0);
    expect(readFileSync(join(campaign.runs, 'red/a-1.args'), 'utf8')).toMatch(/tests\/headless\/deny-kill\.mjs/i);
  });

  it('aborta si SETTINGS no carga deny-kill.mjs', () => {
    const campaign = newCampaign(testRoot('deny-missing'));

    const result = runCampaign(campaign, { SCENARIOS: 'a', SETTINGS: '{"enabledPlugins":{"sdd-kit@sdd-kit":false}}' });

    expect(result.output).toMatch(/SETTINGS sin el hook deny-kill\.mjs: añade \$DENY_KILL_HOOK a sus PreToolUse/i);
    expect(subjects(campaign)).toHaveLength(0);
  });

  it('acepta un SETTINGS propio que lleva el hook', () => {
    const campaign = newCampaign(testRoot('deny-own'));
    const hook = slashed(join(headless, 'deny-kill.mjs'));
    const settings = `{"enabledPlugins":{"sdd-kit@sdd-kit":false},"hooks":{"PreToolUse":[{"matcher":"Edit","hooks":[{"type":"command","command":"node other.mjs"}]},{"matcher":"Bash|PowerShell","hooks":[{"type":"command","command":"node \\"${hook}\\""}]}]}}`;
    mkdirSync(campaign.runs, { recursive: true });

    const result = runCampaign(campaign, { SCENARIOS: 'a', SETTINGS: settings });

    expect(result.code, result.output).toBe(0);
    expect(subjects(campaign)).toHaveLength(1);
  });
});
