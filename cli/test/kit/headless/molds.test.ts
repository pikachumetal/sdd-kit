import { spawn, spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { afterAll, beforeAll, expect, it, vi } from 'vitest';
import { scenarios } from '../../../../tests/headless/battery.mjs';
import { kitVersion } from '../../../../tests/headless/lib.mjs';
import { cleanGitEnv, kitRoot } from '../process.ts';

// Cada clase de molde de cada batería se construye en seco en el gate: un molde que se rompe o envejece
// (capacidades de otra versión, un marcador por debajo de la última migración) sale aquí y no en un sujeto pagado.
// Cada molde hace git init y sus commits: con varios a la vez, uno tarda segundos.
vi.setConfig({ testTimeout: 120_000, hookTimeout: 120_000 });

const BATTERIES = join(kitRoot, 'tests', 'batteries');
// Corto y bajo .temp/ del repo: el molde de sdd-archive anida carpetas de spec y git pasaba del tope de ruta.
mkdirSync(join(kitRoot, '.temp'), { recursive: true });
const root = mkdtempSync(join(kitRoot, '.temp', 'm-'));
const kit = join(root, 'kit');

interface MoldCase {
  battery: string;
  id: string;
  mold: string;
  runs: string;
}

const cases: MoldCase[] = readdirSync(BATTERIES).flatMap((battery, b) => {
  const seen = new Set<string>();
  return scenarios(join(BATTERIES, battery, 'battery.md'))
    .filter((row: Record<string, string>) => !seen.has(row.Molde) && seen.add(row.Molde))
    .map((row: Record<string, string>, m: number) => ({ battery, id: row.Id, mold: row.Molde, runs: join(root, `${b}-${m}`) }));
});

// La copia que saca git archive, sin tar: el tar del PATH puede ser el de Git Bash, que lee «D:» como un host.
beforeAll(() => {
  for (const folder of ['skills', '.claude-plugin', 'agents', 'cli', 'hooks']) {
    cpSync(join(kitRoot, folder), join(kit, folder), { recursive: true, filter: (source) => !/[\\/]node_modules$/.test(source) });
  }
});

afterAll(() => rmSync(root, { recursive: true, force: true }));

function launchMold({ battery, id, runs }: MoldCase): Promise<{ code: number; output: string }> {
  const env = { ...cleanGitEnv, DRY_RUN: '1', KEEP_MOLD: '1', RUNS_DIR: runs, SUPERPOWERS_DIR: join(root, 'superpowers'), NODE: process.execPath };
  const subject = join(BATTERIES, battery, 'subject.mjs');
  const child = spawn(process.execPath, [subject, kit, `${id}-1`, id, join(runs, 'out')], { env, windowsHide: true });
  let output = '';
  child.stdout.on('data', (chunk) => (output += chunk));
  child.stderr.on('data', (chunk) => (output += chunk));
  return new Promise((done) => child.on('close', (code) => done({ code: code ?? 1, output })));
}

const built = new Map<MoldCase, Promise<{ code: number; output: string }>>();
const buildMold = (moldCase: MoldCase) => built.get(moldCase) ?? built.set(moldCase, launchMold(moldCase)).get(moldCase)!;

it.concurrent.each(cases)('$battery construye en seco el molde $mold ($id)', async (moldCase) => {
  const { code, output } = await buildMold(moldCase);

  expect(code, output).toBe(0);
  for (const kind of ['state', 'tools']) expect(existsSync(join(moldCase.runs, 'out', `${moldCase.id}-1.${kind}.txt`)), output).toBe(true);
});

const closing = cases.filter(({ battery }) => battery === 'sdd-archive');

it.concurrent.each(closing)('el molde de cierre $mold ($id) lleva la versión del kit y pasa sdd capability check', async (moldCase) => {
  const { output } = await buildMold(moldCase);
  const docs = join(moldCase.runs, 'red', `${moldCase.id}-1`, 'repo', '.docs', 'sdd');

  expect(JSON.parse(readFileSync(join(docs, 'sdd-kit.json'), 'utf8')).version, output).toBe(kitVersion(kit));
  const check = spawnSync(process.execPath, [join(kitRoot, 'cli', 'bin', 'sdd.js'), 'capability', 'check', '--path', docs], { encoding: 'utf8' });
  expect(check.status, `${check.stdout}${check.stderr}`).toBe(0);
});
