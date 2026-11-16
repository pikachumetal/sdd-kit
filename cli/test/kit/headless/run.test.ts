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

it('la lista de procesos trae el padre y el arranque de cada uno, para seguir a los nietos de un sujeto', { timeout: 30_000 }, async () => {
  const all: { pid: number; ppid: number; created: string }[] = await realDeps().processes();
  const self = all.find(({ pid }) => pid === process.pid);
  expect(self?.ppid).toBe(process.ppid);
  expect(self?.created).toMatch(/^\d+$/);
});

// Lanzan procesos de node de verdad: con la máquina cargada pasan de los 5 s por omisión.
it('sale con 3 y nombra la etiqueta de un sujeto que no deja nada', { timeout: 30_000 }, () => {
  const result = runCampaign({ ...campaignEnv('process.exit(0);\n'), SCENARIOS: 'a' });
  expect(result.status, result.stderr).toBe(3);
  expect(result.stdout).toContain('sin RESULTADO: a-1');
});

it('battery.mjs verdict sale con 3 y lo dice con una tabla sin escenarios', { timeout: 30_000 }, () => {
  const table = writeFile(join(root, 'battery.md'), '| Id | Paso | Petición | Molde | Esperado | n | Umbral | Modelo | Procedencia |\n| --- | --- | --- | --- | --- | --- | --- | --- | --- |\n');
  const result = spawnSync(process.execPath, [join(kitRoot, 'tests', 'headless', 'battery.mjs'), 'verdict', table, root], { env: cleanGitEnv, encoding: 'utf8', windowsHide: true });
  expect(result.status, result.stderr).toBe(3);
  expect(result.stdout).toContain(`sin escenarios en ${table}`);
});

it('battery.mjs run para antes del primer sujeto si subject.mjs no compila, con la línea del error', { timeout: 30_000 }, () => {
  const table = '| Id | Paso | Petición | Molde | Esperado | n | Umbral | Modelo | Procedencia |\n| --- | --- | --- | --- | --- | --- | --- | --- | --- |\n| a | p | x | m | `cualquiera` | 1 | 1/1 | sonnet | toy |\n';
  const dir = join(root, 'battery');
  writeFile(join(dir, 'battery.md'), table);
  writeFile(join(dir, 'subject.mjs'), "const a = 1;\nconst b = 'sin cerrar\n';\n");
  const { SUBJECT_SH: _subjectSh, SCENARIOS: _scenarios, ...env } = campaignEnv(FAKE_SUBJECT);
  const result = spawnSync(process.execPath, [join(kitRoot, 'tests', 'headless', 'battery.mjs'), 'run'], { env: { ...env, BATTERY_DIR: dir, PHASE: 'broken' }, encoding: 'utf8', windowsHide: true });
  expect(result.status).toBe(1);
  expect(result.stderr).toContain('subject.mjs no compila:');
  expect(result.stderr).toMatch(/subject\.mjs:2\b/);
  expect(result.stderr).toContain('SyntaxError');
  expect(existsSync(join(env.RUNS_DIR as string, 'broken', 'live'))).toBe(false);
  expect(result.stdout).not.toContain('sujetos de la campaña');
});

it('syntaxError no da nada con un fichero que compila', () => {
  expect(realDeps().syntaxError(writeFile(join(root, 'ok.mjs'), 'export const a = 1;\n'))).toBeNull();
});

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
