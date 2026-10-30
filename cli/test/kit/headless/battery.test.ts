import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { BatteryError, runBattery, verdict } from '../../../../tests/headless/battery.mjs';
import { memoryFs, type MemoryFs } from './memory-fs.ts';

// Una raíz absoluta en la plataforma que corre: el CI corre esta suite en Linux.
const CWD = resolve('/w');
const DIR = join(CWD, 'battery');
const TABLE = join(DIR, 'battery.md');
const SPEC = join(CWD, 'spec');
const RUNS = join(CWD, 'scratchpad', 'runs');
const KIT = join(CWD, 'kit');
const OUT = join(RUNS, 'dry', 'battery', 'out');

const TOY = `# Batería de juguete

| Id | Paso | Petición | Molde | Esperado | n | Umbral | Modelo | Procedencia |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| r1 | roadmap | Apunta lo del filtro. | salas | \`sdd-kit:sdd-roadmap\` | 2 | 2/2 | sonnet | toy |
| r2 | roadmap | Reordena el roadmap. | salas | \`sdd-kit:sdd-roadmap\` | 1 | 1/1 | opus | toy |
| f1 | feature | Añade un filtro. | salas | \`sdd-kit:sdd-start-feature\` | 1 | 1/1 | sonnet | toy |
| t1 | directa | Corrige la errata «Guadar», ¿vale? | salas | ninguna | 1 | 1/1 | sonnet | toy |
| d1 | duda | Hay que mejorar las reservas. | salas | ninguna | 2 | 1/2 | sonnet | toy |
| a1 | brief | Implementa la Task 1. | reservas | \`cualquiera\` | 2 | 2/2 | sonnet | toy |
`;

const finished = (text: string) => `${text}\n=== RESULTADO (1 turnos, 0.1 $)\n`;

function toyFs(): MemoryFs {
  const fs = memoryFs();
  fs.write(TABLE, TOY);
  fs.write(join(KIT, 'cli', 'bin', 'sdd.js'), '');
  return fs;
}

const tools = (fs: MemoryFs, label: string, text: string) => fs.write(join(OUT, `${label}.tools.txt`), text);
const lineOf = (lines: string[], id: string) => lines.find((line) => line.startsWith(`${id} ·`));

describe('verdict', () => {
  it('da verde y rojo por escenario', () => {
    const fs = toyFs();
    for (const label of ['r1-1', 'r1-2', 'r2-1']) tools(fs, label, finished('>>> Skill: sdd-kit:sdd-roadmap'));
    tools(fs, 'f1-1', finished('>>> Skill: sdd-kit:sdd-start-patch'));
    tools(fs, 't1-1', finished('>>> Edit: README.md'));
    const { lines, red } = verdict(TABLE, OUT, ['roadmap', 'feature', 'directa'], fs);
    expect(lines).toEqual(['r1 · 2/2 · umbral 2/2 · verde', 'r2 · 1/1 · umbral 1/1 · verde', 'f1 · 0/1 · umbral 1/1 · rojo', 't1 · 1/1 · umbral 1/1 · verde']);
    expect(red).toBe(true);
  });

  it('no cuenta como puerta la invocación de using-sdd, que es el enrutador', () => {
    const fs = toyFs();
    tools(fs, 'f1-1', finished('>>> Skill: sdd-kit:using-sdd\n>>> Skill: sdd-kit:sdd-start-feature'));
    tools(fs, 't1-1', finished('>>> Skill: sdd-kit:using-sdd\n>>> Edit: README.md'));
    const { lines } = verdict(TABLE, OUT, ['feature', 'directa'], fs);
    expect(lines).toEqual(['f1 · 1/1 · umbral 1/1 · verde', 't1 · 1/1 · umbral 1/1 · verde']);
  });

  it('cuenta como faltan los sujetos que no terminaron, sin RESULTADO', () => {
    const fs = toyFs();
    tools(fs, 'd1-1', finished('>>> Read: README.md'));
    tools(fs, 'd1-2', '>>> Read: README.md\n');
    expect(verdict(TABLE, OUT, ['duda'], fs).lines).toEqual(['d1 · 1/2 · umbral 1/2 · rojo · faltan 1']);
  });

  it('da por buena cualquier skill con «cualquiera», pero no un sujeto sin terminar', () => {
    const fs = toyFs();
    tools(fs, 'a1-1', finished('>>> Skill: sdd-kit:sdd-tdd'));
    tools(fs, 'a1-2', finished('>>> Edit: src/informe.js'));
    expect(verdict(TABLE, OUT, ['brief'], fs).lines).toEqual(['a1 · 2/2 · umbral 2/2 · verde']);
  });

  it('da rojo y nombra la ejecución cuya primera llamada a Skill no encuentra la skill: el kit no cargó', () => {
    const fs = toyFs();
    tools(fs, 'd1-1', finished('>>> Read: README.md'));
    tools(fs, 'd1-2', finished('>>> Skill: sdd-kit:sdd-explore\n<<< <tool_use_error>Unknown skill: sdd-kit:sdd-explore</tool_use_error>'));
    expect(verdict(TABLE, OUT, ['duda'], fs).lines).toEqual(['d1 · 1/2 · umbral 1/2 · rojo · el kit no cargó en d1-2']);
  });

  it('rechaza un paso desconocido', () => {
    expect(() => verdict(TABLE, OUT, ['nope'], toyFs())).toThrow(new BatteryError('paso desconocido: nope', 2));
  });
});

describe('verdict con las filas de la rúbrica que se comprueban', () => {
  const SCENARIOS = `| Id | Paso | Petición | Molde | Esperado | n | Umbral | Modelo | Procedencia |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| k1 | rc | Corta la release. | salas | \`cualquiera\` | 2 | 2/2 | sonnet | toy |
| k2 | rc | Corta la release. | salas | \`cualquiera\` | 2 | 1/2 | sonnet | toy |
`;
  const withRubric = (...rows: string[]) => {
    const fs = memoryFs();
    fs.write(TABLE, `${SCENARIOS}\n## Rúbrica\n\n| Fila | Escenarios | Falla si… |\n| --- | --- | --- |\n${rows.join('\n')}\n`);
    return fs;
  };
  const CHAINED = '>>> Bash: gh run list --workflow ci.yml; node --test 2>&1 | tail -8\n<<< ok';
  const CLEAN = '>>> Bash: gh run list --workflow ci.yml\n<<< ok';

  it('una fila «presente» tumba al sujeto que encadena el comando en la misma llamada', () => {
    const fs = withRubric('| K6 Sin suite | k1 | `tools: /node --test/` presente |');
    tools(fs, 'k1-1', finished(CLEAN));
    tools(fs, 'k1-2', finished(CHAINED));
    expect(verdict(TABLE, OUT, [], fs).lines[0]).toBe('k1 · 1/2 · umbral 2/2 · rojo · K6 falla en k1-2');
  });

  it('no cuenta lo que sale en un resultado o en el mensaje final: el sujeto no lo corrió', () => {
    const fs = withRubric('| K6 Sin suite | k1 | `tools: /node --test/` presente |');
    tools(fs, 'k1-1', finished(`>>> Read: operations.md\n<<< - **Suites**: \`node --test\`\n\n${CLEAN}`));
    tools(fs, 'k1-2', `${CLEAN}\n\n=== RESULTADO (1 turnos, 0.1 $)\nno he corrido node --test\n`);
    expect(verdict(TABLE, OUT, [], fs).lines[0]).toBe('k1 · 2/2 · umbral 2/2 · verde');
  });

  it('una llamada de varias líneas se mira entera', () => {
    const fs = withRubric('| K6 Sin suite | k1 | `tools: /node --test/` presente |');
    tools(fs, 'k1-1', finished('>>> Bash: gh run list\nnode --test\n<<< ok'));
    tools(fs, 'k1-2', finished(CLEAN));
    expect(verdict(TABLE, OUT, [], fs).lines[0]).toBe('k1 · 1/2 · umbral 2/2 · rojo · K6 falla en k1-1');
  });

  it('una fila «ausente» tumba al sujeto sin esa llamada, y una regex admite la alternativa escapada', () => {
    const fs = withRubric('| K1 Lee la CI | k1, k2 | `tools: /gh run\\|gh pr/` ausente |');
    tools(fs, 'k1-1', finished(CLEAN));
    tools(fs, 'k1-2', finished('>>> Read: README.md\n<<< gh run'));
    tools(fs, 'k2-1', finished('>>> Read: README.md\n<<< ok'));
    tools(fs, 'k2-2', finished(CLEAN));
    expect(verdict(TABLE, OUT, [], fs).lines).toEqual(['k1 · 1/2 · umbral 2/2 · rojo · K1 falla en k1-2', 'k2 · 1/2 · umbral 1/2 · verde · K1 falla en k2-1']);
  });

  it('deja a mano las filas de juicio', () => {
    const fs = withRubric('| J1 Juicio | k1 | `tools.txt` tiene `node --test` |');
    tools(fs, 'k1-1', finished(CHAINED));
    tools(fs, 'k1-2', finished(CHAINED));
    expect(verdict(TABLE, OUT, [], fs).lines[0]).toBe('k1 · 2/2 · umbral 2/2 · verde');
  });

  it.each([
    ['sin presente ni ausente', '| K6 Mal | k1 | `tools: /x/` |', 'K6: comprobación mal escrita'],
    ['con una regex que no compila', '| K6 Mal | k1 | `tools: /(/` presente |', 'K6: comprobación mal escrita'],
    ['con un escenario que no existe', '| K6 Mal | k9 | `tools: /x/` presente |', 'K6: escenario desconocido: k9'],
  ])('rechaza una comprobación %s: callada, no correría', (_name, row, message) => {
    expect(() => verdict(TABLE, OUT, [], withRubric(row))).toThrow(new BatteryError(message));
  });
});

describe('la batería de sdd-archive', () => {
  it('declara K6 como comprobación, con lo que da el rc2 de la 0257: 1/2', () => {
    const fs = memoryFs();
    const real = resolve(import.meta.dirname, '../../../../tests/batteries/sdd-archive/battery.md');
    fs.write(TABLE, readFileSync(real, 'utf8'));
    tools(fs, 'rc2-1', finished('>>> Bash: gh run list --workflow ci.yml --branch develop -L 1\n<<< ok\n\n=== RESULTADO\nno he corrido `node --test`'));
    tools(fs, 'rc2-2', finished('>>> Bash: gh run list --workflow ci.yml --branch develop -L 1 2>&1; node --test 2>&1 | tail -8\n<<< ok'));
    expect(lineOf(verdict(TABLE, OUT, [], fs).lines, 'rc2')).toContain('K6 falla en rc2-2');
  });
});

interface LaunchRequest {
  subjectSh: string;
  args: string[];
  env: Record<string, string | undefined>;
}

function fakeDeps(fs: MemoryFs) {
  const log: string[] = [];
  const launched: LaunchRequest[] = [];
  let chain: Promise<unknown> = Promise.resolve();
  const deps = {
    fs,
    log: (line: string) => log.push(line),
    wait: async () => undefined,
    isAlive: () => false,
    lock: <T>(_path: string, body: () => Promise<T>): Promise<T> => {
      const result = chain.then(body);
      chain = result.catch(() => undefined);
      return result;
    },
    launch: (request: LaunchRequest) => {
      launched.push(request);
      const [, label, , out] = request.args;
      fs.write(join(out, `${label}.tools.txt`), finished('>>> Skill: sdd-kit:sdd-roadmap'));
      return { pid: 1, exited: Promise.resolve(0) };
    },
    processes: async () => [],
    kill: () => undefined,
  };
  return { deps, log, launched };
}

const env = (overrides: Record<string, string> = {}) => ({
  BATTERY_DIR: DIR,
  SPEC_DIR: SPEC,
  PHASE: 'battery',
  RUNS_DIR: RUNS,
  KIT_DIR: KIT,
  SUBJECT_CAP: '20',
  COST_CAP: '20',
  DRY_RUN: '1',
  ...overrides,
});

describe('runBattery', () => {
  it('lanza solo el tramo pedido, cada índice con el modelo de su escenario', async () => {
    const fs = toyFs();
    const fake = fakeDeps(fs);
    const code = await runBattery(env({ STEPS: 'roadmap' }), CWD, fake.deps);
    expect(fake.launched.map((request) => [request.args[1], request.env.MODEL, request.env.SUBJECT])).toEqual([
      ['r2-1', 'opus', '1'],
      ['r1-1', 'sonnet', '1'],
      ['r1-2', 'sonnet', '2'],
    ]);
    expect(fake.launched[0].subjectSh).toBe(join(DIR, 'subject.mjs'));
    expect(fake.log.slice(-2)).toEqual(['r1 · 2/2 · umbral 2/2 · verde', 'r2 · 1/1 · umbral 1/1 · verde']);
    expect(code).toBe(0);
  });

  it('no relanza una batería cuyas etiquetas ya tienen salida en su fase', async () => {
    const fs = toyFs();
    tools(fs, 'r1-1', finished('marca'));
    const fake = fakeDeps(fs);
    await expect(runBattery(env({ STEPS: 'roadmap' }), CWD, fake.deps)).rejects.toThrow(`ya existe r1-1 en ${OUT}: borra esa carpeta o cambia PHASE`);
    expect(fake.launched).toEqual([]);
  });

  it('pasa la copia del kit en ruta absoluta respecto al cwd de quien lanza', async () => {
    const fs = toyFs();
    const fake = fakeDeps(fs);
    await runBattery(env({ STEPS: 'directa', KIT_DIR: 'kit' }), CWD, fake.deps);
    expect(fake.launched[0].args[0]).toBe(KIT);
  });

  it('sale con 1 si algún escenario queda en rojo', async () => {
    const fs = toyFs();
    const fake = fakeDeps(fs);
    expect(await runBattery(env({ STEPS: 'feature' }), CWD, fake.deps)).toBe(1);
  });
});
