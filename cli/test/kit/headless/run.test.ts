import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, expect, it } from 'vitest';
import { realDeps } from '../../../../tests/headless/real-deps.mjs';
import { cleanGitEnv, kitRoot } from '../process.ts';

const runMjs = join(kitRoot, 'tests', 'headless', 'run.mjs');
// RUNS_DIR va en .temp/ del repo y corto: run.mjs rechaza uno largo, y aquí cuelga del nombre del worktree.
mkdirSync(join(kitRoot, '.temp'), { recursive: true });
const root = mkdtempSync(join(kitRoot, '.temp', 'r'));
afterEach(() => rmSync(root, { recursive: true, force: true }));

// El sujeto falso deja su tools.txt con un RESULTADO, como lo haría lib.mjs al guardar.
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

// Un proceso suelto que nombra la carpeta del sujeto, como el que deja un nohup, y sigue vivo cuando el sujeto acaba.
const LEAKY_SUBJECT = `import { spawn } from 'node:child_process';
const folder = join(process.env.RUNS_DIR, process.env.PHASE || 'red', process.argv[3]);
spawn(process.execPath, ['-e', 'setInterval(() => {}, 1000)', folder], { detached: true, stdio: 'ignore' }).unref();
${FAKE_SUBJECT}`;

function campaignEnv(subject: string): NodeJS.ProcessEnv {
  const kit = join(root, 'kit');
  writeFile(join(kit, 'cli', 'bin', 'sdd.js'), '');
  return {
    ...cleanGitEnv,
    SPEC_DIR: join(root, 'spec'),
    RUNS_DIR: root,
    KIT_DIR: kit,
    SUBJECT_SH: writeFile(join(root, 'subject.mjs'), subject),
    SCENARIOS: 'a b',
    SUBJECT_CAP: '4',
    COST_CAP: '4',
    MAX_PARALLEL: '1',
    DRY_RUN: '1',
  };
}

const runCampaign = (env: NodeJS.ProcessEnv) => spawnSync(process.execPath, [runMjs], { env, encoding: 'utf8', windowsHide: true });

// La consulta del lanzador: pwsh en Windows, ps en el CI de Linux.
async function processesNaming(folder: string): Promise<number[]> {
  const all: { pid: number; commandLine: string }[] = await realDeps().processes();
  return all.filter(({ pid, commandLine }) => pid !== process.pid && commandLine.includes(folder)).map(({ pid }) => pid);
}

// Lanzan procesos de node de verdad: con la máquina cargada pasan de los 5 s por omisión.
it('lanza, cuenta e informa con un sujeto en node', { timeout: 30_000 }, () => {
  const env = campaignEnv(FAKE_SUBJECT);
  const result = runCampaign(env);
  expect(result.status, result.stderr).toBe(0);
  expect(result.stdout).toContain('sujetos de la campaña: 2 · coste acumulado: 1.00 $');
  const live = join(env.RUNS_DIR as string, 'dry', 'live');
  expect(existsSync(live) ? readdirSync(live).filter((name) => !name.startsWith('.')) : []).toEqual([]);
});

it('no deja vivo ningún proceso del sujeto', { timeout: 60_000 }, async () => {
  const env = campaignEnv(LEAKY_SUBJECT);
  const folder = join(env.RUNS_DIR as string, 'red', 'a-1');
  const result = runCampaign({ ...env, SCENARIOS: 'a' });
  const left = await processesNaming(folder);
  for (const pid of left) process.kill(pid);
  expect(result.stdout).toContain(`[a-1] paro 1 procesos de ${folder}`);
  expect(left).toEqual([]);
});
