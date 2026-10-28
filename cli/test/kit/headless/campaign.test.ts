import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { CampaignError, readConfig, runCampaign, stopCampaign, stopSubjectProcesses, subjectProcesses, sweepCut } from '../../../../tests/headless/campaign.mjs';
import { memoryFs, type MemoryFs } from './memory-fs.ts';

const CWD = 'C:\\w';
const SPEC = join(CWD, 'spec');
const RUNS = join(CWD, 'scratchpad', 'runs');
const KIT = join(CWD, 'kit');

type Env = Record<string, string | undefined>;

interface LaunchRequest {
  subjectSh: string;
  args: string[];
  env: Env;
}

function baseEnv(overrides: Env = {}): Env {
  return {
    SPEC_DIR: SPEC,
    RUNS_DIR: RUNS,
    KIT_DIR: KIT,
    SUBJECT_SH: join(SPEC, 'red', 'subject.mjs'),
    SCENARIOS: 'a',
    SUBJECT_CAP: '10',
    COST_CAP: '10',
    ...overrides,
  };
}

function kitFs(): MemoryFs {
  const fs = memoryFs();
  fs.write(join(KIT, 'cli', 'bin', 'sdd.js'), '');
  return fs;
}

const tools = (cost: number) => `>>> Bash: ls\n=== RESULTADO (1 turnos, ${cost.toFixed(2)} $)\nhecho\n`;

interface ProcessInfo {
  pid: number;
  commandLine: string;
}

interface FakeOptions {
  cost?: number;
  manual?: boolean;
  unsaved?: boolean;
  onWait?: () => void;
  processes?: ProcessInfo[];
  processesFail?: boolean;
}

// Un sujeto que acaba al instante deja su tools.txt (sin él, con unsaved); con manual, el test decide cuándo acaba.
function fakeDeps(fs: MemoryFs, options: FakeOptions = {}) {
  const log: string[] = [];
  const killed: { pid: number; tree: boolean }[] = [];
  const launched: LaunchRequest[] = [];
  const alive = new Set<number>();
  const finishers = new Map<string, () => void>();
  let nextPid = 1000;
  let waits = 0;
  let queries = 0;
  let chain: Promise<unknown> = Promise.resolve();
  const deps = {
    fs,
    log: (line: string) => log.push(line),
    wait: async () => {
      waits++;
      options.onWait?.();
    },
    isAlive: (pid: number) => alive.has(pid),
    lock: <T>(_path: string, body: () => Promise<T>): Promise<T> => {
      const result = chain.then(body);
      chain = result.catch(() => undefined);
      return result;
    },
    launch: (request: LaunchRequest) => {
      const pid = nextPid++;
      const [, label, , out] = request.args;
      alive.add(pid);
      launched.push(request);
      let done!: (code: number) => void;
      const exited = new Promise<number>((resolve) => (done = resolve));
      const finish = () => {
        if (!options.unsaved) fs.write(join(out, `${label}.tools.txt`), tools(options.cost ?? 0.5));
        alive.delete(pid);
        done(0);
      };
      if (options.manual) finishers.set(label, finish);
      else queueMicrotask(finish);
      return { pid, exited };
    },
    processes: async () => {
      queries++;
      if (options.processesFail) throw new Error('pwsh no arrancó');
      return options.processes ?? [];
    },
    kill: (pid: number, tree: boolean) => killed.push({ pid, tree }),
  };
  return { deps, log, launched, alive, finishers, killed, waits: () => waits, queries: () => queries };
}

function mark(fs: MemoryFs, dir: string, name: string, pid: number | '') {
  fs.write(join(dir, name), `${pid}\n`);
}

describe('readConfig', () => {
  it('exige SPEC_DIR', () => {
    expect(() => readConfig(baseEnv({ SPEC_DIR: undefined }), CWD, kitFs())).toThrow(new CampaignError('define SPEC_DIR'));
  });

  it('rechaza un SUBJECT_SH que no es .mjs', () => {
    expect(() => readConfig(baseEnv({ SUBJECT_SH: join(SPEC, 'red', 'subject.sh') }), CWD, kitFs())).toThrow(
      new CampaignError('SUBJECT_SH tiene que ser un .mjs: los subject.sh se fueron con la 0238'),
    );
  });

  it('exige que MAX_PARALLEL sea un entero positivo', () => {
    expect(() => readConfig(baseEnv({ MAX_PARALLEL: '0' }), CWD, kitFs())).toThrow('MAX_PARALLEL tiene que ser un entero positivo: 0');
  });

  it('rechaza un RUNS_DIR fuera del scratchpad y de .temp/', () => {
    expect(() => readConfig(baseEnv({ RUNS_DIR: 'C:\\otro\\runs' }), CWD, kitFs())).toThrow('RUNS_DIR fuera del scratchpad o de .temp/: C:\\otro\\runs');
  });

  it('aborta si la copia del kit no lleva cli/bin/sdd.js', () => {
    expect(() => readConfig(baseEnv(), CWD, memoryFs())).toThrow(
      'la copia del kit no lleva cli/: sácala con git archive <commit> skills .claude-plugin agents cli hooks',
    );
  });

  it('resuelve un KIT_DIR relativo contra el cwd de quien lanza', () => {
    expect(readConfig(baseEnv({ KIT_DIR: 'kit' }), CWD, kitFs()).kitDir).toBe(KIT);
  });

  it('pasa al sujeto RUNS_DIR, SPEC_DIR y KIT_DIR en ruta absoluta', () => {
    const { env } = readConfig(baseEnv({ RUNS_DIR: 'scratchpad\\runs', SPEC_DIR: 'spec', KIT_DIR: 'kit' }), CWD, kitFs());
    expect([env.RUNS_DIR, env.SPEC_DIR, env.KIT_DIR]).toEqual([RUNS, SPEC, KIT]);
  });

  it('exige SUBJECT_CAP y COST_CAP, que salen de la previsión de la spec', () => {
    expect(() => readConfig(baseEnv({ SUBJECT_CAP: undefined }), CWD, kitFs())).toThrow(new CampaignError('define SUBJECT_CAP (previsión de la spec)'));
    expect(() => readConfig(baseEnv({ COST_CAP: undefined }), CWD, kitFs())).toThrow(new CampaignError('define COST_CAP (previsión de la spec)'));
  });

  it('exige que COST_CAP sea un número', () => {
    expect(() => readConfig(baseEnv({ COST_CAP: 'abc' }), CWD, kitFs())).toThrow('COST_CAP tiene que ser un número: abc');
  });

  it('reparte COST_CAP entre SUBJECT_CAP si no hay SUBJECT_COST', () => {
    expect(readConfig(baseEnv({ SUBJECT_CAP: '4', COST_CAP: '6' }), CWD, kitFs()).subjectCost).toBe('1.5');
  });
});

describe('runCampaign', () => {
  it('no pasa de SUBJECT_CAP sujetos', async () => {
    const fs = kitFs();
    const fake = fakeDeps(fs);
    await runCampaign(readConfig(baseEnv({ SCENARIOS: 'a b c', SUBJECT_CAP: '2' }), CWD, fs), fake.deps);
    expect(fake.launched.map((request) => request.args[1])).toEqual(['a-1', 'b-1']);
    expect(fake.log).toContain('techo de 2 sujetos alcanzado: decide el dev-lead');
  });

  it('cuenta lo gastado en todas las fases y lo lanzado a SUBJECT_COST contra COST_CAP', async () => {
    const fs = kitFs();
    fs.write(join(SPEC, 'green', 'out', 'z-1.tools.txt'), tools(0.6));
    const fake = fakeDeps(fs);
    await runCampaign(readConfig(baseEnv({ COST_CAP: '1', SUBJECT_COST: '0.50' }), CWD, fs), fake.deps);
    expect(fake.launched).toHaveLength(0);
    expect(fake.log).toContain('techo de 1 $ alcanzado (0.60 $ gastados, 0 en curso a 0.50 $)');
  });

  it('lanza si lo gastado más lo lanzado iguala COST_CAP', async () => {
    const fs = kitFs();
    fs.write(join(SPEC, 'green', 'out', 'z-1.tools.txt'), tools(0.5));
    const fake = fakeDeps(fs);
    await runCampaign(readConfig(baseEnv({ COST_CAP: '1', SUBJECT_COST: '0.50' }), CWD, fs), fake.deps);
    expect(fake.launched).toHaveLength(1);
  });

  it('espera hueco contando las marcas de otro run.mjs y lanza cuando una muere', async () => {
    const fs = kitFs();
    const live = join(RUNS, 'live');
    mark(fs, live, 'red.x-1', 1);
    mark(fs, live, 'red.y-1', 2);
    const fake: ReturnType<typeof fakeDeps> = fakeDeps(fs, { onWait: () => fake.alive.delete(1) });
    fake.alive.add(1);
    fake.alive.add(2);
    await runCampaign(readConfig(baseEnv({ MAX_PARALLEL: '2' }), CWD, fs), fake.deps);
    expect(fake.log.filter((line) => line.startsWith('esperando hueco'))).toEqual(['esperando hueco: 2 sujetos en curso (MAX_PARALLEL=2)']);
    expect(fake.waits()).toBe(1);
    expect(fake.launched).toHaveLength(1);
  });

  it('comprueba la etiqueta dentro del cerrojo, tras esperar hueco: dos lanzadores con la misma etiqueta lanzan una vez', async () => {
    const fs = kitFs();
    const fake = fakeDeps(fs, { manual: true });
    const config = readConfig(baseEnv(), CWD, fs);
    const first = runCampaign(config, fake.deps);
    const second = runCampaign(config, fake.deps);
    await new Promise((resolve) => setImmediate(resolve));
    fake.finishers.get('a-1')?.();
    await Promise.all([first, second]);
    expect(fake.launched).toHaveLength(1);
    expect(fake.log).toContain('ya existe a-1: sube SUBJECT');
  });

  it('una etiqueta ya guardada no espera hueco', async () => {
    const fs = kitFs();
    fs.write(join(SPEC, 'red', 'out', 'a-1.tools.txt'), tools(0.5));
    mark(fs, join(RUNS, 'live'), 'red.x-1', 1);
    const fake: ReturnType<typeof fakeDeps> = fakeDeps(fs, { onWait: () => fake.alive.delete(1) });
    fake.alive.add(1);
    await runCampaign(readConfig(baseEnv({ MAX_PARALLEL: '1' }), CWD, fs), fake.deps);
    expect(fake.log).toContain('ya existe a-1: sube SUBJECT');
    expect(fake.waits()).toBe(0);
  });

  it('no relanza una etiqueta que ya tiene tools.txt en su fase', async () => {
    const fs = kitFs();
    fs.write(join(SPEC, 'red', 'out', 'a-1.tools.txt'), tools(0.5));
    const fake = fakeDeps(fs);
    await runCampaign(readConfig(baseEnv(), CWD, fs), fake.deps);
    expect(fake.launched).toHaveLength(0);
    expect(fake.log).toContain('ya existe a-1: sube SUBJECT');
  });

  it('cuenta un sujeto cortado como sujeto y como SUBJECT_COST', async () => {
    const fs = kitFs();
    mark(fs, join(RUNS, 'live'), 'red.z-1', 77);
    const fake = fakeDeps(fs);
    await runCampaign(readConfig(baseEnv({ SUBJECT_CAP: '1', SUBJECT_COST: '0.50' }), CWD, fs), fake.deps);
    expect(fake.launched).toHaveLength(0);
    expect(fake.log).toContain('cortados sin salida: 1 (contados a 0.50 $ cada uno)');
    expect(fake.log).toContain('sujetos de la campaña: 1 · coste acumulado: 0.50 $');
  });

  it('un cortado de una tanda real no cuenta en un ensayo en seco, ni al revés', async () => {
    const realCut = kitFs();
    mark(realCut, join(RUNS, 'live'), 'red.z-1', 77);
    const dry = fakeDeps(realCut);
    await runCampaign(readConfig(baseEnv({ SUBJECT_CAP: '1', DRY_RUN: '1' }), CWD, realCut), dry.deps);
    const dryCut = kitFs();
    mark(dryCut, join(RUNS, 'dry', 'live'), 'red.w-1', 78);
    const real = fakeDeps(dryCut);
    await runCampaign(readConfig(baseEnv({ SUBJECT_CAP: '1' }), CWD, dryCut), real.deps);
    expect(dry.launched).toHaveLength(1);
    expect(real.launched).toHaveLength(1);
  });

  it('para a petición si existe RUNS_DIR/stop', async () => {
    const fs = kitFs();
    fs.write(join(RUNS, 'stop'), '');
    const fake = fakeDeps(fs);
    await runCampaign(readConfig(baseEnv(), CWD, fs), fake.deps);
    expect(fake.launched).toHaveLength(0);
    expect(fake.log).toContain('parada a petición');
  });

  it('deja la marca con el PID lanzado mientras el sujeto corre y la borra al acabar', async () => {
    const fs = kitFs();
    const fake = fakeDeps(fs, { manual: true });
    const done = runCampaign(readConfig(baseEnv(), CWD, fs), fake.deps);
    await new Promise((resolve) => setImmediate(resolve));
    const markPath = join(RUNS, 'live', 'red.a-1');
    expect(fs.read(markPath).trim()).toBe('1000');
    fake.finishers.get('a-1')?.();
    await done;
    expect(fs.exists(markPath)).toBe(false);
  });

  it('lanza cada sujeto con el kit, la etiqueta, el escenario y la salida', async () => {
    const fs = kitFs();
    const fake = fakeDeps(fs);
    await runCampaign(readConfig(baseEnv({ SUBJECT: '2', PHASE: 'green' }), CWD, fs), fake.deps);
    expect(fake.launched[0].args).toEqual([KIT, 'a-2', 'a', join(SPEC, 'green', 'out')]);
    expect(fake.launched[0].subjectSh).toBe(join(SPEC, 'red', 'subject.mjs'));
  });

  it('informa del coste por carpeta de salida, los cortados y el total', async () => {
    const fs = kitFs();
    fs.write(join(SPEC, 'red', 'out', 'a-1.tools.txt'), tools(0.6));
    fs.write(join(SPEC, 'red', 'out', 'b-1.tools.txt'), tools(0.5));
    fs.write(join(SPEC, 'green', 'out', 'c-1.tools.txt'), '>>> Bash: ls\n');
    fs.write(join(RUNS, 'stop'), '');
    mark(fs, join(RUNS, 'live'), 'red.z-1', 77);
    const fake = fakeDeps(fs);
    await runCampaign(readConfig(baseEnv({ SUBJECT_COST: '0.50' }), CWD, fs), fake.deps);
    expect(fake.log.slice(-4)).toEqual([
      'green: 1 sujetos · 0.00 $ · 1 sin RESULTADO',
      'red: 2 sujetos · 1.10 $',
      'cortados sin salida: 1 (contados a 0.50 $ cada uno)',
      'sujetos de la campaña: 4 · coste acumulado: 1.60 $',
    ]);
  });

  it('en seco escribe en RUNS_DIR/dry y lo dice al acabar', async () => {
    const fs = kitFs();
    const fake = fakeDeps(fs);
    await runCampaign(readConfig(baseEnv({ DRY_RUN: '1' }), CWD, fs), fake.deps);
    const out = join(RUNS, 'dry', 'red', 'out');
    expect(fs.exists(join(out, 'a-1.tools.txt'))).toBe(true);
    expect(fake.log).toContain(`en seco: salidas en ${out}`);
  });
});

describe('procesos del sujeto', () => {
  const folder = join(RUNS, 'red', 'a-1');

  it('reconoce la carpeta del sujeto con cualquier barra y capitalización', () => {
    const processes = [
      { pid: 1, commandLine: `claude.exe -p --add-dir ${folder.replaceAll('\\', '/').toLowerCase()} --verbose` },
      { pid: 2, commandLine: `claude.exe -p --add-dir "${folder}"` },
      { pid: 3, commandLine: `claude.exe -p --add-dir ${folder}0` },
      { pid: 4, commandLine: 'node.exe other.js' },
    ];
    expect(subjectProcesses(processes, folder)).toEqual([1, 2]);
  });

  it('para los procesos del sujeto al acabar y dice cuántos', async () => {
    const fs = kitFs();
    const fake = fakeDeps(fs, { processes: [{ pid: 51, commandLine: `timeout.exe 0 claude --add-dir ${folder}` }, { pid: 52, commandLine: `node serve ${folder}` }] });
    await runCampaign(readConfig(baseEnv(), CWD, fs), fake.deps);
    expect(fake.killed).toEqual([{ pid: 51, tree: true }, { pid: 52, tree: true }]);
    expect(fake.log).toContain(`[a-1] paro 2 procesos de ${folder}`);
  });

  it('no avisa si el sujeto no deja procesos', async () => {
    const fs = kitFs();
    const fake = fakeDeps(fs);
    await stopSubjectProcesses('a-1', folder, fake.deps);
    expect(fake.log).toEqual([]);
  });

  it('al arrancar para los procesos de los cortados de una tanda anterior', async () => {
    const fs = kitFs();
    mark(fs, join(RUNS, 'live'), 'red.z-1', 77);
    const cutFolder = join(RUNS, 'red', 'z-1');
    const fake = fakeDeps(fs, { processes: [{ pid: 61, commandLine: `claude.exe --add-dir ${cutFolder}` }] });
    fs.write(join(RUNS, 'stop'), '');
    await runCampaign(readConfig(baseEnv(), CWD, fs), fake.deps);
    expect(fake.killed).toEqual([{ pid: 61, tree: true }]);
  });

  it('al arrancar no toca las marcas cuyo PID sigue vivo', async () => {
    const fs = kitFs();
    mark(fs, join(RUNS, 'live'), 'red.z-1', 77);
    const fake = fakeDeps(fs, { processes: [{ pid: 61, commandLine: `claude.exe --add-dir ${join(RUNS, 'red', 'z-1')}` }] });
    fake.alive.add(77);
    fs.write(join(RUNS, 'stop'), '');
    await runCampaign(readConfig(baseEnv(), CWD, fs), fake.deps);
    expect(fake.killed).toEqual([]);
  });

  it('un sujeto que acaba sin tools.txt borra su marca y no queda como cortado de otra tanda', async () => {
    const fs = kitFs();
    const config = readConfig(baseEnv(), CWD, fs);
    const first = fakeDeps(fs, { unsaved: true });
    await runCampaign(config, first.deps);
    expect(fs.exists(join(RUNS, 'live', 'red.a-1'))).toBe(false);
    expect(first.log.some((line) => line.startsWith('cortados sin salida'))).toBe(false);
    const next = fakeDeps(fs, { processes: [{ pid: 61, commandLine: `claude.exe --add-dir ${folder}` }] });
    await sweepCut(config, next.deps);
    expect(next.killed).toEqual([]);
  });

  it('al arrancar lista los procesos una sola vez para todos los cortados', async () => {
    const fs = kitFs();
    mark(fs, join(RUNS, 'live'), 'red.y-1', 76);
    mark(fs, join(RUNS, 'live'), 'red.z-1', 77);
    const fake = fakeDeps(fs, {
      processes: [
        { pid: 61, commandLine: `claude.exe --add-dir ${join(RUNS, 'red', 'y-1')}` },
        { pid: 62, commandLine: `claude.exe --add-dir ${join(RUNS, 'red', 'z-1')}` },
      ],
    });
    await sweepCut(readConfig(baseEnv(), CWD, fs), fake.deps);
    expect(fake.queries()).toBe(1);
    expect(fake.killed).toEqual([{ pid: 61, tree: true }, { pid: 62, tree: true }]);
  });

  it('avisa si no puede listar los procesos y sigue', async () => {
    const fs = kitFs();
    const fake = fakeDeps(fs, { processesFail: true });
    await runCampaign(readConfig(baseEnv(), CWD, fs), fake.deps);
    expect(fake.log).toContain('[a-1] no pude listar los procesos: pwsh no arrancó');
    expect(fake.log.at(-1)).toBe('sujetos de la campaña: 1 · coste acumulado: 0.50 $');
  });

  it('al parar, mata el árbol de cada sujeto en curso y barre sus procesos', async () => {
    const fs = kitFs();
    mark(fs, join(RUNS, 'live'), 'red.z-1', 77);
    const fake = fakeDeps(fs, { processes: [{ pid: 61, commandLine: `claude.exe --add-dir ${join(RUNS, 'red', 'z-1')}` }] });
    await stopCampaign(readConfig(baseEnv(), CWD, fs), fake.deps, [77]);
    expect(fake.killed).toEqual([{ pid: 77, tree: true }, { pid: 61, tree: true }]);
  });
});
