import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { isAlive, killProcess } from '../../../../tests/headless/lib.mjs';
import { cleanGitEnv, kitRoot } from '../process.ts';

// Cada escenario monta un molde con git init y sus commits, y la batería lanza un sujeto real por escenario.
vi.setConfig({ testTimeout: 120_000, hookTimeout: 120_000 });

mkdirSync(join(kitRoot, '.temp'), { recursive: true });
const root = mkdtempSync(join(kitRoot, '.temp', 'mc-'));
const battery = join(root, 'battery');
const kit = join(root, 'kit');
const runs = join(root, 'runs');
const spec = join(root, 'spec');
const out = join(runs, 'dry', 'battery', 'out');
const lib = pathToFileURL(join(kitRoot, 'tests', 'headless', 'lib.mjs')).href;

const MARKER = `node -e "require('fs').writeFileSync('ran.txt','');console.log('hola');process.exit(2)"`;
const HANG = `node -e "require('fs').writeFileSync('hang.pid',String(process.pid));setInterval(()=>{},1e3)"`;

const SUBJECT = `import { initSubject } from '${lib}';
const s = initSubject(process.argv.slice(2), 'toy');
s.put('README.md', 'molde de juguete\\n');
const molds = {
  roto: () => s.leave('node -e "process.exit(2)"'),
  codigo: () => s.leave(${JSON.stringify(MARKER)}, { code: 2, output: 'hola' }),
  salida: () => s.leave('node -e "console.log(\\'adios\\')"', { output: 'hola' }),
  casa: () => s.put('walkthrough.md', 'Validación en campo: 2026-11-25\\n'),
  nocasa: () => s.put('walkthrough.md', 'Borrador sin validar\\n'),
  ausente: () => {},
  colgado: () => s.leave(${JSON.stringify(HANG)}),
};
molds[s.SC]();
s.initRepo();
await s.launch('Haz la tarea.');
s.save('estado');
`;

const scenarioRow = (id: string) => `| ${id} | toy | Haz la tarea. | ${id} | cualquiera | 1 | 1/1 | sonnet | juguete |`;

const BATTERY = [
  '# Batería de juguete',
  '',
  '| Id | Paso | Petición | Molde | Esperado | n | Umbral | Modelo | Procedencia |',
  '| --- | --- | --- | --- | --- | --- | --- | --- | --- |',
  ...['roto', 'codigo', 'salida', 'casa', 'nocasa', 'ausente', 'colgado'].map(scenarioRow),
  '',
  '| Fila | Escenarios | Falla si… |',
  '| --- | --- | --- |',
  '| M1 Molde sin la validación | casa, nocasa, ausente | `mold: walkthrough.md /^Validación en campo:/` |',
  '',
].join('\n');

let result: { status: number | null; output: string };

function writeToyBattery(): void {
  mkdirSync(battery, { recursive: true });
  writeFileSync(join(battery, 'battery.md'), BATTERY);
  writeFileSync(join(battery, 'subject.mjs'), SUBJECT);
  mkdirSync(join(kit, 'skills', 'toy'), { recursive: true });
  writeFileSync(join(kit, 'skills', 'toy', 'SKILL.md'), '# toy\n');
  mkdirSync(join(kit, 'cli', 'bin'), { recursive: true });
  writeFileSync(join(kit, 'cli', 'bin', 'sdd.js'), '');
  mkdirSync(spec, { recursive: true });
  // Un ensayo anterior roto dejó su nota: el sujeto de ahora, con el molde bien, no la hereda.
  mkdirSync(out, { recursive: true });
  writeFileSync(join(out, 'codigo-1.mold.txt'), 'molde roto: de un ensayo anterior\n');
}

function filesNamed(dir: string, name: string): string[] {
  return readdirSync(dir, { recursive: true, encoding: 'utf8' }).filter((path) => path.endsWith(name));
}

const lineOf = (id: string) => result.output.split(/\r?\n/).find((line) => line.startsWith(`${id} · `)) ?? '';

beforeAll(() => {
  writeToyBattery();
  const env = {
    ...cleanGitEnv,
    BATTERY_DIR: battery,
    SPEC_DIR: spec,
    PHASE: 'battery',
    RUNS_DIR: runs,
    KIT_DIR: kit,
    SUBJECT_CAP: '20',
    COST_CAP: '20',
    DRY_RUN: '1',
    KEEP_MOLD: '1',
    MOLD_TIMEOUT_SECONDS: '5',
    NODE: process.execPath,
  };
  const run = spawnSync(process.execPath, [join(kitRoot, 'tests', 'headless', 'battery.mjs'), 'run'], { cwd: kitRoot, env, encoding: 'utf8', windowsHide: true });
  result = { status: run.status, output: `${run.stdout}${run.stderr}` };
});

// Si el tope no mató el árbol, el proceso colgado no sobrevive a la tanda de tests.
afterAll(() => {
  const pidFile = join(runs, 'battery', 'colgado-1', 'repo', 'hang.pid');
  if (existsSync(pidFile)) killProcess(Number(readFileSync(pidFile, 'utf8')), true);
  rmSync(root, { recursive: true, force: true });
});

describe('el ensayo en seco ejecuta lo que el molde deja', () => {
  it('un comando declarado que sale con error da rojo, nombra el escenario y no escribe el stream de su sujeto', () => {
    expect(result.status, result.output).toBe(1);
    expect(lineOf('roto'), result.output).toMatch(/^roto · 0\/1 · umbral 1\/1 · rojo/);
    expect(lineOf('roto')).toContain('molde roto en roto-1: molde roto: «node -e "process.exit(2)"» salió con 2 (esperado 0)');
    expect(filesNamed(runs, 'roto-1.jsonl')).toEqual([]);
  });

  it('un comando con el código y la salida que declara pasa, y se ejecutó de verdad', () => {
    expect(lineOf('codigo'), result.output).toBe('codigo · 1/1 · umbral 1/1 · verde');
    expect(existsSync(join(runs, 'battery', 'codigo-1', 'repo', 'ran.txt'))).toBe(true);
  });

  it('una salida que no contiene el texto declarado da molde roto', () => {
    expect(lineOf('salida'), result.output).toContain(`molde roto en salida-1: molde roto: «node -e "console.log('adios')"» no contiene «hola»`);
  });

  it('una fila mold: que casa con el molde montado da molde roto con su fila', () => {
    expect(lineOf('casa'), result.output).toContain('molde roto en casa-1: molde roto: walkthrough.md casa /^Validación en campo:/ (fila M1)');
  });

  it('una fila mold: sobre un fichero que no existe deja pasar el escenario: la señal no está', () => {
    expect(lineOf('ausente'), result.output).toBe('ausente · 1/1 · umbral 1/1 · verde');
  });

  it('un comando que no termina da molde roto al tope y no deja vivo el proceso que lanzó', () => {
    expect(lineOf('colgado'), result.output).toContain(`molde roto en colgado-1: molde roto: «${HANG}» no terminó en 5 s`);
    const pid = Number(readFileSync(join(runs, 'battery', 'colgado-1', 'repo', 'hang.pid'), 'utf8'));
    expect(isAlive(pid)).toBe(false);
  });

  it('una fila mold: que no casa deja pasar el escenario', () => {
    expect(lineOf('nocasa'), result.output).toBe('nocasa · 1/1 · umbral 1/1 · verde');
  });
});
