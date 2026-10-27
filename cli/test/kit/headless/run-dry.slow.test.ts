import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { fakeClaude, newCampaign, readText, runCampaign, setTools, testRoot, withPath } from './campaign.ts';

function allText(dir: string): string {
  return readdirSync(dir, { recursive: true, encoding: 'utf8' })
    .map((name) => join(dir, name))
    .filter((path) => statSync(path).isFile())
    .map((path) => readFileSync(path, 'utf8'))
    .join('\n');
}

describe('Lanzador de referencia de sujetos headless (tests/headless/run.sh)', () => {
  it('lanza en seco y deja las salidas planas y sin el home ni el usuario', () => {
    const campaign = newCampaign(testRoot('dry'));

    const result = runCampaign(campaign, { SCENARIOS: 'a' });

    expect(result.code, result.output).toBe(0);
    for (const name of ['a-1.state.txt', 'a-1.tools.txt', 'a-1.texts.txt', 'a-1/readme.md']) expect(existsSync(join(campaign.out, name)), name).toBe(true);
    const all = allText(campaign.out);
    expect(all).not.toMatch(/\balice\b/i);
    expect(all).toMatch(/<home>\/\.claude/i);
    expect(all).toMatch(/=== RESULTADO \(1 turnos, 0\.5 \$\)/i);
    // El scratchpad cuelga de %TEMP%, que Git Bash escribe /tmp/…; node recibe la forma C:/… (conversión de MSYS).
    expect(readText(join(campaign.out, 'a-1.tools.txt'))).toMatch(/>>> Bash: ls <run>\/repo/i);
  });

  it('con SPEC_DIR relativo guarda las salidas y las cuenta (tickets 0077 §2 y 0064 §1)', () => {
    const root = testRoot('relative');
    const campaign = newCampaign(root);
    const bin = fakeClaude(root, 'relative');

    const result = runCampaign(campaign, { SCENARIOS: 'a', SPEC_DIR: 'spec', DRY_RUN: null, PATH: withPath(bin) }, { cwd: root });

    expect(result.code, result.output).toBe(0);
    expect(existsSync(join(campaign.spec, 'red/out/a-1.tools.txt'))).toBe(true);
    expect(result.output).toMatch(/sujetos de la campaña: 1 /i);
  });

  it('en seco deja las salidas en RUNS_DIR/dry y nada en SPEC_DIR (ticket de la feature 0115 §9)', () => {
    const campaign = newCampaign(testRoot('dry-out'));

    const result = runCampaign(campaign, { SCENARIOS: 'a' });

    expect(result.code, result.output).toBe(0);
    expect(result.output).not.toMatch(/No such file or directory/i);
    expect(existsSync(join(campaign.spec, 'red/out'))).toBe(false);
    expect(existsSync(join(campaign.runs, 'dry/red/out/a-1.tools.txt'))).toBe(true);
    expect(result.output).toMatch(/en seco: salidas en .*dry\/red\/out/i);
  });

  it('en seco no cuenta las salidas de SPEC_DIR', () => {
    const campaign = newCampaign(testRoot('dry-count'));
    setTools(join(campaign.spec, 'green/out'), 'x-1', '=== RESULTADO (1 turnos, 9 $)');

    const result = runCampaign(campaign, { SCENARIOS: 'a', COST_CAP: '4' });

    expect(result.output).toMatch(/coste acumulado: 0\.50 \$/i);
  });

  it('al acabar da el coste por carpeta de salida (ticket de la feature 0168 §4)', () => {
    const campaign = newCampaign(testRoot('folders'));
    setTools(join(campaign.dry, 'green-premature/out'), 'x-1', '=== RESULTADO (2 turnos, 0.9 $)');
    setTools(join(campaign.dry, 'green/out'), 'y-1', '>>> Bash: ls');

    const result = runCampaign(campaign, { SCENARIOS: 'a' });

    expect(result.output).toMatch(/red: 1 sujetos · 0\.50 \$/i);
    expect(result.output).toMatch(/green-premature: 1 sujetos · 0\.90 \$/i);
    expect(result.output).toMatch(/green: 1 sujetos · 0\.00 \$ · 1 sin RESULTADO/i);
    expect(result.output).toMatch(/coste acumulado: 1\.40 \$/i);
  });

  it('el sujeto ve la identidad fixture en git config, no la de la máquina (ticket del patch 0080 §2)', () => {
    const campaign = newCampaign(testRoot('identity'));

    const result = runCampaign(campaign, { SCENARIOS: 'a' });

    expect(result.code, result.output).toBe(0);
    expect(readText(join(campaign.out, 'a-1.texts.txt'))).toMatch(/git: Fixture <fixture@example\.com>/i);
  });

  it('suma EXTRA_ALLOWED a las herramientas permitidas del sujeto (task 0077)', () => {
    const campaign = newCampaign(testRoot('allowed'));

    const result = runCampaign(campaign, { SCENARIOS: 'a', EXTRA_ALLOWED: 'mcp__plugin_playwright_playwright' });

    expect(result.code, result.output).toBe(0);
    expect(readText(join(campaign.out, 'a-1.texts.txt'))).toMatch(/permitidas extra: mcp__plugin_playwright_playwright/i);
  });
});
