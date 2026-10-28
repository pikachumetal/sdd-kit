import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { HEADLESS, initSubject } from '../../../../tests/headless/lib.mjs';
import { kitRoot } from '../process.ts';
import { memoryFs, type MemoryFs } from './memory-fs.ts';

const CWD = 'C:\\w';
const RUNS = join(CWD, 'scratchpad', 'runs');
const KIT = join(CWD, 'kit');
const OUT = join(CWD, 'spec', 'red', 'out');

type Env = Record<string, string | undefined>;

interface RunCall {
  command: string;
  args: string[];
  input?: string;
}

interface RunReply {
  code?: number;
  stdout?: string;
  stderr?: string;
}

class Exited extends Error {
  readonly code: number;

  constructor(code: number) {
    super(`exit ${code}`);
    this.code = code;
  }
}

interface FakeOptions {
  run?: (call: RunCall) => RunReply | undefined;
}

function kitFs(): MemoryFs {
  const fs = memoryFs();
  fs.write(join(KIT, 'skills', 'sdd-plan', 'SKILL.md'), '# sdd-plan\n');
  fs.write(join(KIT, '.claude-plugin', 'plugin.json'), '{"name":"sdd-kit","version":"2.9.1"}\n');
  return fs;
}

// Los procesos son llamadas registradas: git responde 0 y extract.mjs devuelve su entrada.
function fakeDeps(fs: MemoryFs, options: FakeOptions = {}) {
  const calls: RunCall[] = [];
  const errs: string[] = [];
  const outs: string[] = [];
  const exits: (() => number)[] = [];
  const deps = {
    fs,
    run: (command: string, args: string[], opts: { input?: string } = {}) => {
      const call = { command, args, input: opts.input };
      calls.push(call);
      const reply = options.run?.(call) ?? { stdout: args.includes('clean') ? (opts.input ?? '') : '' };
      return { code: reply.code ?? 0, stdout: reply.stdout ?? '', stderr: reply.stderr ?? '' };
    },
    now: () => 1_000_000,
    onExit: (fn: () => number) => exits.push(fn),
    exit: (code: number) => {
      throw new Exited(code);
    },
    err: (line: string) => errs.push(line),
    out: (line: string) => outs.push(line),
    netstat: () => '',
  };
  const cleanup = () => exits.map((fn) => fn());
  return { deps, calls, errs, outs, cleanup };
}

function baseEnv(overrides: Env = {}): Env {
  return { RUNS_DIR: RUNS, NODE: 'node', TEMP: join(CWD, 'tmp'), USERPROFILE: join(CWD, 'home'), ...overrides };
}

function start(overrides: Env = {}, fs = kitFs(), options: FakeOptions = {}) {
  const fake = fakeDeps(fs, options);
  const subject = initSubject([KIT, 'a-1', 'a', OUT], 'sdd-plan', { env: baseEnv(overrides), deps: fake.deps, cwd: CWD });
  return { subject, fs, ...fake };
}

function dies(action: () => unknown): string {
  try {
    action();
  } catch (error) {
    if (error instanceof Exited) return `exit ${error.code}`;
    throw error;
  }
  return 'no salió';
}

describe('initSubject (lib.mjs)', () => {
  it('aborta con RUNS_DIR fuera del scratchpad y de .temp/', () => {
    const fake = fakeDeps(kitFs());
    const outside = join(CWD, 'fuera', 'runs');

    expect(dies(() => initSubject([KIT, 'a-1', 'a', OUT], 'sdd-plan', { env: baseEnv({ RUNS_DIR: outside }), deps: fake.deps, cwd: CWD }))).toBe('exit 1');
    expect(fake.errs).toEqual([`[a-1] RUNS_DIR fuera del scratchpad o de .temp/: ${outside}`]);
  });

  it('acepta RUNS_DIR bajo .temp/ del repo con otras barras y mayúsculas', () => {
    const runs = join(kitRoot, '.temp', 'launcher').replaceAll('\\', '/').toUpperCase();

    const { subject } = start({ RUNS_DIR: runs });

    expect(subject.RUN.toLowerCase()).toBe(join(kitRoot, '.temp', 'launcher', 'red', 'a-1').toLowerCase());
  });

  it('aborta sin la skill medida en la copia del kit', () => {
    const fake = fakeDeps(kitFs());

    expect(dies(() => initSubject([KIT, 'a-1', 'a', OUT], 'sdd-otra', { env: baseEnv(), deps: fake.deps, cwd: CWD }))).toBe('exit 1');
    expect(fake.errs).toEqual([`[a-1] sin la skill sdd-otra en la copia del kit ${KIT} (task 0040)`]);
  });

  it.each([{ folder: '.docs' }, { folder: 'tests' }])('aborta si la copia del kit lleva $folder/ (walkthrough de la feature 0150 §4.3)', ({ folder }) => {
    const fs = kitFs();
    fs.mkdir(join(KIT, folder));
    const fake = fakeDeps(fs);

    expect(dies(() => initSubject([KIT, 'a-1', 'a', OUT], 'sdd-plan', { env: baseEnv(), deps: fake.deps, cwd: CWD }))).toBe('exit 1');
    expect(fake.errs).toEqual(['[a-1] la copia del kit lleva .docs/ o tests/: sácala con git archive <commit> skills .claude-plugin agents cli hooks']);
  });

  it('sin SUPERPOWERS_DIR aborta si el kit declara dependencies (ticket de la feature 0095 §2)', () => {
    const fs = kitFs();
    fs.write(join(KIT, '.claude-plugin', 'plugin.json'), '{"name":"sdd-kit","dependencies":[{"name":"superpowers"}]}\n');
    const fake = fakeDeps(fs);

    expect(dies(() => initSubject([KIT, 'a-1', 'a', OUT], 'sdd-plan', { env: baseEnv(), deps: fake.deps, cwd: CWD }))).toBe('exit 1');
    expect(fake.errs).toEqual(['[a-1] el kit declara dependencies: define SUPERPOWERS_DIR (ruta de superpowers)']);
  });

  it.each([{ label: '' }, { label: '..' }, { label: 'x\\..\\..\\y' }])('aborta con una etiqueta que no es un nombre plano: «$label»', ({ label }) => {
    const fake = fakeDeps(kitFs());

    expect(dies(() => initSubject([KIT, label, 'a', OUT], 'sdd-plan', { env: baseEnv(), deps: fake.deps, cwd: CWD }))).toBe('exit 1');
    expect(fake.errs).toEqual([`[${label || 'sujeto'}] etiqueta no válida: «${label}»`]);
  });

  it('pone el molde en RUNS_DIR/<fase>/<etiqueta>/<MOLD_NAME> y resuelve OUT relativo contra el cwd', () => {
    const fake = fakeDeps(kitFs());

    const subject = initSubject([KIT, 'a-1', 'a', 'out'], 'sdd-plan', { env: baseEnv({ PHASE: 'green', MOLD_NAME: 'app' }), deps: fake.deps, cwd: CWD });

    expect(subject.RUN).toBe(join(RUNS, 'green', 'a-1'));
    expect(subject.R).toBe(join(RUNS, 'green', 'a-1', 'app'));
    expect(subject.OUT).toBe(join(CWD, 'out'));
    expect(fake.deps.fs.exists(subject.R)).toBe(true);
  });
});

describe('Rutas de salida (lib.mjs)', () => {
  const longSpec = join(kitRoot, '.temp', `launcher-${'x'.repeat(110)}`);

  it('corta la salida cuya ruta en el repo pasa de 139 caracteres', () => {
    const fs = kitFs();
    const fake = fakeDeps(fs);
    const subject = initSubject([KIT, 'a-1', 'a', join(longSpec, 'red', 'out')], 'sdd-plan', { env: baseEnv(), deps: fake.deps, cwd: CWD });

    expect(dies(() => subject.save('estado'))).toBe('exit 1');
    expect(fake.errs[0]).toMatch(/^\[a-1\] ruta de \d+ caracteres \(máximo 139\): \.temp\/launcher-x+\/red\/out\/a-1\.state\.txt$/);
  });

  it('en seco mide la ruta que tendría la salida en SPEC_DIR', () => {
    const fs = kitFs();
    fs.mkdir(longSpec);
    const fake = fakeDeps(fs);
    const subject = initSubject([KIT, 'a-1', 'a', join(RUNS, 'dry', 'red', 'out')], 'sdd-plan', { env: baseEnv({ DRY_RUN: '1', SPEC_DIR: longSpec }), deps: fake.deps, cwd: CWD });

    expect(dies(() => subject.save('estado'))).toBe('exit 1');
    expect(fake.errs[0]).toMatch(/ruta de \d+ caracteres/);
  });

  it('en seco sin SPEC_DIR en disco no mide la ruta (carrera (c))', () => {
    const runs = join(kitRoot, '.temp', `launcher-${'x'.repeat(110)}`);
    const out = join(runs, 'dry', 'red', 'out');
    const fake = fakeDeps(kitFs());
    const subject = initSubject([KIT, 'a-1', 'a', out], 'sdd-plan', { env: baseEnv({ DRY_RUN: '1', SPEC_DIR: join(CWD, 'no-existe'), RUNS_DIR: runs }), deps: fake.deps, cwd: CWD });

    subject.save('estado');

    expect(fake.errs).toEqual([]);
    expect(fake.deps.fs.exists(join(out, 'a-1.state.txt'))).toBe(true);
  });
});

describe('Molde y guardado (lib.mjs)', () => {
  it('git pasa la identidad Fixture y core.longpaths (ticket de la feature 0089 §2)', () => {
    const { subject, calls } = start();

    subject.git('init', '-q', '-b', 'main');

    expect(calls.at(-1)?.args).toEqual(['-C', subject.R, '-c', 'user.email=fixture@example.com', '-c', 'user.name=Fixture', '-c', 'core.autocrlf=false', '-c', 'core.longpaths=true', 'init', '-q', '-b', 'main']);
  });

  it('aborta antes de escribir si el molde no es su propio repo git (ticket 0086 §1)', () => {
    const { subject, errs, calls } = start({}, kitFs(), { run: ({ args }) => (args.includes('--show-cdup') ? { stdout: '../\n' } : undefined) });

    expect(dies(() => subject.commit('feat: base'))).toBe('exit 1');
    expect(errs).toEqual([`[a-1] el molde ${subject.R} no es su propio repo git: falta g init en el subject.mjs antes del primer git`]);
    expect(calls.some(({ args }) => args.includes('add'))).toBe(false);
  });

  it('commit añade todo y commitea con el cuerpo por omisión', () => {
    const { subject, calls } = start();
    subject.git('init', '-q', '-b', 'main');

    subject.commit('feat: base');

    expect(calls.at(-1)?.args.slice(-6)).toEqual(['commit', '-q', '-m', 'feat: base', '-m', 'Cuerpo del commit.']);
  });

  it('put escribe dentro del molde', () => {
    const { subject, fs } = start();

    subject.put('.docs/sdd/roadmap.md', '# Roadmap\n');

    expect(fs.read(join(subject.R, '.docs', 'sdd', 'roadmap.md'))).toBe('# Roadmap\n');
  });

  it('save guarda estado, tools y texts y dice listo', () => {
    const { subject, fs, outs } = start();

    subject.save('## git log\nabc feat');

    expect(fs.read(join(OUT, 'a-1.state.txt'))).toBe('## git log\nabc feat');
    expect(fs.exists(join(OUT, 'a-1.tools.txt'))).toBe(true);
    expect(fs.exists(join(OUT, 'a-1.texts.txt'))).toBe(true);
    expect(outs).toEqual(['[a-1] listo']);
  });

  it('save no deja el estado si la salida lleva la identidad de git de la máquina (ticket de la feature 0160)', () => {
    const { subject, fs, errs, cleanup } = start({}, kitFs(), { run: ({ args }) => (args.includes('clean') ? { code: 3 } : undefined) });

    subject.save('aprobada por Alice Liddell');

    expect(fs.exists(join(OUT, 'a-1.state.txt'))).toBe(false);
    expect(fs.exists(join(OUT, 'a-1.tools.txt')), 'sin tools.txt, run.mjs no cuenta el coste del sujeto').toBe(true);
    expect(errs).toEqual([`[a-1] no se guarda a-1.state.txt: el stream sigue en ${join(RUNS, 'red', 'a-1.jsonl')}`]);
    expect(cleanup(), 'el sujeto sale con error').toEqual([1]);
  });

  it('keep copia plano y limpio', () => {
    const { subject, fs } = start();
    subject.put('README.md', 'salas');

    subject.keep(join(subject.R, 'README.md'), 'readme.md');

    expect(fs.read(join(OUT, 'a-1', 'readme.md'))).toBe('salas');
  });

  it('keep solo copia plano: una ruta con carpetas crece hasta pasar de 140 caracteres (task 0062)', () => {
    const { subject, fs, errs } = start();
    subject.put('README.md', 'salas');

    subject.keep(join(subject.R, 'README.md'), 'specs/0001/spec.md');

    expect(errs).toEqual(['[a-1] specs/0001/spec.md: solo copia plana, sin carpetas (<etiqueta>/walkthrough-task-<id>.md)']);
    expect(fs.exists(join(OUT, 'a-1', 'specs'))).toBe(false);
  });

  it('keep avisa si el fichero no existe', () => {
    const { subject, errs } = start();

    subject.keep(join(subject.R, 'falta.md'), 'falta.md');

    expect(errs).toEqual([`[a-1] sin ${join(subject.R, 'falta.md')}`]);
  });

  it('show vuelca un fichero de otra rama con las reglas de keep (ticket del patch 0075 §3)', () => {
    const { subject, fs, calls } = start({}, kitFs(), { run: ({ args }) => (args[0] === '-C' && args.includes('show') ? { stdout: 'fila 0013\n' } : undefined) });

    subject.show('feature/0013:.docs/sdd/roadmap.md', 'roadmap.md');

    expect(calls.some(({ args }) => args.at(-1) === 'feature/0013:.docs/sdd/roadmap.md')).toBe(true);
    expect(fs.read(join(OUT, 'a-1', 'roadmap.md'))).toBe('fila 0013\n');
  });

  it('show con una copia con carpetas da el aviso de copia plana', () => {
    const { subject, errs } = start();

    subject.show('main:README.md', 'docs/readme.md');

    expect(errs[0]).toMatch(/docs\/readme\.md: solo copia plana/);
  });
});

describe('Limpieza del sujeto (lib.mjs)', () => {
  it('borra el molde y conserva su stream y sus argumentos', () => {
    const { subject, fs, cleanup } = start();
    fs.write(join(RUNS, 'red', 'a-1.jsonl'), '{}');

    expect(cleanup()).toEqual([0]);
    expect(fs.exists(subject.RUN)).toBe(false);
    expect(fs.exists(join(RUNS, 'red', 'a-1.jsonl'))).toBe(true);
  });

  it('con KEEP_MOLD=1 conserva el molde', () => {
    const { subject, fs, cleanup } = start({ KEEP_MOLD: '1' });
    subject.put('README.md', 'salas');

    cleanup();

    expect(fs.exists(join(subject.R, 'README.md'))).toBe(true);
  });

  it('borra la carpeta de Claude Code del sujeto y no la de otros', () => {
    const base = join(CWD, 'cc-tmp');
    const { subject, fs, cleanup } = start({ CLAUDE_CODE_TMPDIR: base });
    const own = join(base, 'claude', subject.R.replace(/[^A-Za-z0-9]/g, '-'));
    const other = join(base, 'claude', 'D--code-otro-proyecto');
    fs.mkdir(join(own, 'tasks'));
    fs.mkdir(other);

    cleanup();

    expect(fs.exists(own)).toBe(false);
    expect(fs.exists(other)).toBe(true);
  });

  it('la limpieza corre una vez aunque se llame de nuevo', () => {
    const { subject, fs, cleanup } = start();
    cleanup();
    fs.mkdir(subject.R);

    cleanup();

    expect(fs.exists(subject.R)).toBe(true);
  });
});

describe('Marcador del molde con la versión del kit (lib.mjs)', () => {
  function kitWithMigrations(): MemoryFs {
    const fs = kitFs();
    const migrations = join(KIT, 'skills', 'sdd-upgrade', 'references', 'migrations');
    fs.write(join(migrations, 'v2.9.0.md'), '# v2.9.0\n');
    fs.write(join(migrations, 'v2.10.0.md'), '# v2.10.0\n');
    return fs;
  }

  it('kitVersion compara por SemVer', () => {
    const { subject } = start({}, kitWithMigrations());

    expect(subject.kitVersion()).toBe('2.10.0');
  });

  it('putKitMarker escribe la versión del kit', () => {
    const { subject, fs } = start({}, kitWithMigrations());

    subject.putKitMarker('"channel": "plugin"');

    expect(fs.read(join(subject.R, '.docs', 'sdd', 'sdd-kit.json'))).toBe('{"version": "2.10.0", "channel": "plugin"}\n');
  });
});

describe('Transcripts sembrados (lib.mjs)', () => {
  it('seedTranscript siembra en la carpeta del molde y la limpieza la borra (ticket de la feature 0188 §2)', () => {
    const config = join(CWD, 'config');
    const { subject, fs, cleanup } = start({ CLAUDE_CONFIG_DIR: config });
    const dir = join(config, 'projects', subject.R.replace(/[^A-Za-z0-9]/g, '-'));

    subject.seedTranscript('feature/0042', ['2026-10-14T09:00:00Z user el total no redondea', '2026-10-14T09:02:00Z assistant mirando']);

    const seed = fs.read(join(dir, 'seed-1.jsonl')).trim().split('\n').map((line) => JSON.parse(line));
    expect(seed).toHaveLength(2);
    expect(seed[0]).toMatchObject({ type: 'user', gitBranch: 'feature/0042', message: { content: 'el total no redondea' } });
    expect(seed[1].message).toMatchObject({ model: 'claude-sonnet-5', usage: { output_tokens: 1 } });
    cleanup();
    expect(fs.exists(dir)).toBe(false);
  });

  it('seedTranscript numera la siguiente siembra', () => {
    const config = join(CWD, 'config');
    const { subject, fs } = start({ CLAUDE_CONFIG_DIR: config });
    const dir = join(config, 'projects', subject.R.replace(/[^A-Za-z0-9]/g, '-'));

    subject.seedTranscript('feature/0042', ['2026-10-14T09:00:00Z user hola']);
    subject.seedTranscript('feature/0042', ['2026-10-14T09:00:00Z user otra']);

    expect(fs.exists(join(dir, 'seed-2.jsonl'))).toBe(true);
  });
});

it('HEADLESS es la carpeta de lib.mjs', () => {
  expect(HEADLESS.toLowerCase()).toBe(join(kitRoot, 'tests', 'headless').toLowerCase());
});
