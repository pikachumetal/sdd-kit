import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { delimiter, join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { cleanGitEnv, kitRoot } from '../process.ts';

// El único extremo a extremo de la biblioteca del sujeto: run.mjs lanza el subject.mjs real de using-sdd,
// y el sujeto, un claude falso que apunta lo que recibe.
const ASK = 'Añade «reservas» con tildes: canción "ya" y ¿vale?';
const TABLE = `| Id | Paso | Petición | Molde | Esperado | n | Umbral | Modelo | Procedencia |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| x1 | sdd-propose | ${ASK} | salas | ninguna | 1 | 1/1 | sonnet | e2e |
`;
const FAKE_CLAUDE = `import { writeFileSync } from 'node:fs';
writeFileSync(process.env.FAKE_CLAUDE_LOG, JSON.stringify({ args: process.argv.slice(2), path: process.env.PATH ?? process.env.Path }));
console.log(JSON.stringify({ type: 'system', subtype: 'init', session_id: 'fake-1' }));
console.log(JSON.stringify({ type: 'result', num_turns: 1, total_cost_usd: 0.25, result: 'hecho' }));
`;

function write(path: string, content: string): string {
  mkdirSync(join(path, '..'), { recursive: true });
  writeFileSync(path, content);
  return path;
}

// RUNS_DIR va en .temp/ del repo y corto: run.mjs rechaza uno de más de 80 caracteres.
mkdirSync(join(kitRoot, '.temp'), { recursive: true });
const root = mkdtempSync(join(kitRoot, '.temp', 's-'));
const runs = join(root, 'runs');
const log = join(root, 'fake-claude.json');
let output = '';
let code = 1;

// Lanza run.mjs, el sujeto y git de verdad: con molds.test.ts a la vez pasa de los 10 s por omisión.
beforeAll(() => {
  const kit = join(root, 'kit');
  write(join(kit, 'skills', 'using-sdd', 'SKILL.md'), '# using-sdd\n');
  write(join(kit, '.claude-plugin', 'plugin.json'), '{"name":"sdd-kit","version":"9.9.9"}\n');
  write(join(kit, 'cli', 'bin', 'sdd.js'), '');
  const env = {
    ...cleanGitEnv,
    SPEC_DIR: join(root, 'spec'),
    RUNS_DIR: runs,
    KIT_DIR: kit,
    SUBJECT_SH: join(kitRoot, 'tests', 'batteries', 'using-sdd', 'subject.mjs'),
    BATTERY_DIR: join(root, 'battery'),
    SCENARIOS: 'x1',
    SUBJECT_CAP: '1',
    COST_CAP: '1',
    SUPERPOWERS_DIR: join(root, 'superpowers'),
    CLAUDE_BIN: write(join(root, 'fake-claude.mjs'), FAKE_CLAUDE),
    FAKE_CLAUDE_LOG: log,
    KEEP_MOLD: '1',
  };
  write(join(env.BATTERY_DIR, 'battery.md'), TABLE);
  const result = spawnSync(process.execPath, [join(kitRoot, 'tests', 'headless', 'run.mjs')], { env, encoding: 'utf8', windowsHide: true });
  output = `${result.stdout}${result.stderr}`;
  code = result.status ?? 1;
}, 120_000);

afterAll(() => rmSync(root, { recursive: true, force: true }));

const received = (): { args: string[]; path: string } => JSON.parse(readFileSync(log, 'utf8'));

describe('subject.mjs de using-sdd con un claude falso', () => {
  it('lanza, guarda y cuenta el sujeto', () => {
    expect(code, output).toBe(0);
    expect(output).toMatch(/sujetos de la campaña: 1 · coste acumulado: 0\.25 \$/);
    expect(existsSync(join(root, 'spec', 'red', 'out', 'x1-1.tools.txt')), output).toBe(true);
  });

  it('passes the request byte for byte: la petición con «», tildes y comillas llega igual a claude', () => {
    expect(received().args.at(-1), output).toBe(ASK);
  });

  it('el molde lleva el marcador con la versión del kit', () => {
    const marker = readFileSync(join(runs, 'red', 'x1-1', 'repo', '.docs', 'sdd', 'sdd-kit.json'), 'utf8');

    expect(marker, output).toMatch(/^\{"version": "9\.9\.9", "channel": "plugin"/);
  });

  it('claude ve primero no-claude/ en el PATH', () => {
    expect(received().path.split(delimiter)[0], output).toBe(join(kitRoot, 'tests', 'headless', 'no-claude'));
  });
});

it('extract.mjs last devuelve el texto del último resultado, que lee la persona', () => {
  const stream = write(join(root, 'last.jsonl'), [
    '{"type":"result","num_turns":1,"total_cost_usd":0.5,"result":"¿Primera?"}',
    '{"type":"result","num_turns":2,"total_cost_usd":1,"result":"Última respuesta."}',
  ].join('\n'));

  const result = spawnSync(process.execPath, [join(kitRoot, 'tests', 'headless', 'extract.mjs'), 'last', stream], { encoding: 'utf8', windowsHide: true });

  expect(result.stdout).toBe('Última respuesta.');
});
