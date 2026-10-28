import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, expect, it } from 'vitest';
import { cleanGitEnv, kitRoot } from '../process.ts';

const runMjs = join(kitRoot, 'tests', 'headless', 'run.mjs');
const root = mkdtempSync(join(tmpdir(), 'run-mjs-'));
afterEach(() => rmSync(root, { recursive: true, force: true }));

// El sujeto falso deja su tools.txt con un RESULTADO, como lo haría lib.sh al guardar.
const FAKE_SUBJECT = `import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
const [, label, , out] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
writeFileSync(join(out, label + '.tools.txt'), '=== RESULTADO (1 turnos, 0.50 $)\\n');
`;

function writeFile(path: string, content: string): string {
  mkdirSync(join(path, '..'), { recursive: true });
  writeFileSync(path, content);
  return path;
}

// Lanza procesos de node de verdad: con la máquina cargada pasa de los 5 s por omisión.
it('lanza, cuenta e informa con un sujeto en node', { timeout: 30_000 }, () => {
  const runs = join(root, 'scratchpad', 'runs');
  const kit = join(root, 'kit');
  writeFile(join(kit, 'cli', 'bin', 'sdd.js'), '');
  const env = {
    ...cleanGitEnv,
    SPEC_DIR: join(root, 'spec'),
    RUNS_DIR: runs,
    KIT_DIR: kit,
    SUBJECT_SH: writeFile(join(root, 'subject.mjs'), FAKE_SUBJECT),
    SCENARIOS: 'a b',
    SUBJECT_CAP: '4',
    COST_CAP: '4',
    MAX_PARALLEL: '1',
    DRY_RUN: '1',
  };
  const result = spawnSync(process.execPath, [runMjs], { env, encoding: 'utf8', windowsHide: true });
  expect(result.status, result.stderr).toBe(0);
  expect(result.stdout).toContain('sujetos de la campaña: 2 · coste acumulado: 1.00 $');
  const live = join(runs, 'dry', 'live');
  expect(existsSync(live) ? readdirSync(live).filter((name) => !name.startsWith('.')) : []).toEqual([]);
});
