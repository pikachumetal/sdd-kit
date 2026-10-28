import { delimiter, join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { HEADLESS, initSubject } from '../../../../tests/headless/lib.mjs';
import { kitRoot } from '../process.ts';
import { memoryFs, type MemoryFs } from './memory-fs.ts';

// Una raíz absoluta en la plataforma que corre: el CI corre esta suite en Linux.
const CWD = resolve('/w');
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

interface ClaudeCall {
  command: string;
  args: string[];
  cwd: string;
  env: Env;
  stdout: string;
  append: boolean;
}

interface FakeOptions {
  run?: (call: RunCall) => RunReply | undefined;
  claude?: (call: ClaudeCall) => { stream?: string; code?: number; hang?: boolean };
  netstat?: () => string;
  alive?: number[];
  which?: () => string | undefined;
}

const STREAM = '{"type":"system","subtype":"init","session_id":"s-1"}\n{"type":"result","num_turns":1,"total_cost_usd":0.5,"result":"hecho"}\n';

const lastResult = (text: string): string =>
  text.split('\n').filter(Boolean).map((line) => JSON.parse(line)).filter((event) => event.type === 'result').at(-1)?.result ?? '';

function kitFs(): MemoryFs {
  const fs = memoryFs();
  fs.write(join(KIT, 'skills', 'sdd-plan', 'SKILL.md'), '# sdd-plan\n');
  fs.write(join(KIT, '.claude-plugin', 'plugin.json'), '{"name":"sdd-kit","version":"2.9.1"}\n');
  return fs;
}

// Los procesos son llamadas registradas: git responde 0, extract.mjs devuelve su entrada (y last, el último result),
// claude escribe un stream y el tope de tiempo vence cuando el test llama a fireTimers.
function fakeDeps(fs: MemoryFs, options: FakeOptions = {}) {
  const calls: RunCall[] = [];
  const claudeCalls: ClaudeCall[] = [];
  const errs: string[] = [];
  const outs: string[] = [];
  const exits: (() => number)[] = [];
  const killed: { pid: number; tree: boolean }[] = [];
  const timers: { ms: number; fire: () => void }[] = [];
  const armed: number[] = [];
  // Un claude encallado acaba cuando lo matan.
  let hanging = (_code: number) => {};
  const defaultReply = (args: string[], input?: string): RunReply => {
    if (args.includes('clean')) return { stdout: input ?? '' };
    if (args.includes('last')) return { stdout: lastResult(fs.read(args.at(-1) ?? '')) };
    return {};
  };
  const deps = {
    fs,
    run: (command: string, args: string[], opts: { input?: string } = {}) => {
      const call = { command, args, input: opts.input };
      calls.push(call);
      const reply = options.run?.(call) ?? defaultReply(args, opts.input);
      return { code: reply.code ?? 0, stdout: reply.stdout ?? '', stderr: reply.stderr ?? '' };
    },
    spawnClaude: (command: string, args: string[], opts: { cwd: string; env: Env; stdout: string; append: boolean }) => {
      const call = { command, args, ...opts };
      claudeCalls.push(call);
      const reply = options.claude?.(call) ?? {};
      const previous = opts.append && fs.exists(opts.stdout) ? fs.read(opts.stdout) : '';
      fs.write(opts.stdout, previous + (reply.stream ?? STREAM));
      if (!reply.hang) return { pid: 4242, exited: Promise.resolve(reply.code ?? 0) };
      return { pid: 4242, exited: new Promise<number>((resolve) => (hanging = resolve)) };
    },
    startTimer: (ms: number, fire: () => void) => {
      const timer = { ms, fire };
      timers.push(timer);
      armed.push(ms);
      return () => timers.splice(timers.indexOf(timer), 1);
    },
    kill: (pid: number, tree: boolean) => {
      killed.push({ pid, tree });
      hanging(1);
    },
    isAlive: (pid: number) => (options.alive ?? []).includes(pid),
    whichClaude: options.which ?? (() => 'C:\\bin\\claude.exe'),
    onExit: (fn: () => number) => exits.push(fn),
    exit: (code: number) => {
      throw new Exited(code);
    },
    err: (line: string) => errs.push(line),
    out: (line: string) => outs.push(line),
    netstat: options.netstat ?? (() => ''),
  };
  const cleanup = () => exits.map((fn) => fn());
  return { deps, calls, claudeCalls, errs, outs, killed, timers, armed, cleanup };
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

  it.each([{ label: '' }, { label: '..' }, { label: 'x/../../y' }])('aborta con una etiqueta que no es un nombre plano: «$label»', ({ label }) => {
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
    expect(errs).toEqual([`[a-1] el molde ${subject.R} no es su propio repo git: falta git init en el subject.mjs antes del primer git`]);
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

const argsOf = (fs: MemoryFs, name = 'a-1.args'): string[] => fs.read(join(RUNS, 'red', name)).replace(/\n$/, '').split('\n');
const DENY_KILL = join(HEADLESS, 'deny-kill.mjs').replaceAll('\\', '/');

describe('Argumentos de claude -p (lib.mjs)', () => {
  it('lanza con los argumentos de siempre y los deja en <etiqueta>.args, con la petición al final', async () => {
    const { subject, fs } = start({ DRY_RUN: '1' });

    await subject.launch('Invoca la skill.');

    const args = argsOf(fs);
    expect(args.slice(0, 5)).toEqual(['-p', '--model', 'sonnet', '--settings', args[4]]);
    expect(JSON.parse(args[4])).toEqual({
      enabledPlugins: { 'sdd-kit@sdd-kit': false },
      hooks: { PreToolUse: [{ matcher: 'Bash|PowerShell', hooks: [{ type: 'command', command: `node "${DENY_KILL}"` }] }] },
    });
    expect(args.slice(5)).toEqual([
      '--plugin-dir', KIT, '--add-dir', KIT, '--add-dir', subject.RUN,
      '--permission-mode', 'acceptEdits', '--allowedTools', 'Bash(*)', 'PowerShell(*)', 'Agent',
      '--disallowedTools', 'SendMessage', 'ListAgents', 'AskUserQuestion',
      '--max-turns', '60', '--output-format', 'stream-json', '--verbose', 'Invoca la skill.',
    ]);
  });

  it('con SUPERPOWERS_DIR aísla al sujeto y carga superpowers desde esa ruta (feature 0074)', async () => {
    const { subject, fs } = start({ DRY_RUN: '1', SUPERPOWERS_DIR: 'C:/sp/6.4.1' });

    await subject.launch('x');

    const args = argsOf(fs);
    const at = args.indexOf('--setting-sources');
    expect(args.slice(at, at + 4)).toEqual(['--setting-sources', '', '--plugin-dir', 'C:/sp/6.4.1']);
  });

  it('suma MODEL, MAX_TURNS, EXTRA_ALLOWED, EXTRA_DISALLOWED y APPEND_SYSTEM', async () => {
    const { subject, fs } = start({ DRY_RUN: '1', MODEL: 'haiku', EXTRA_ALLOWED: 'WebSearch WebFetch', EXTRA_DISALLOWED: 'PowerShell', APPEND_SYSTEM: 'Responde en castellano.' });
    subject.env.MAX_TURNS ??= '8';

    await subject.launch('x');

    const args = argsOf(fs);
    expect(args[2]).toBe('haiku');
    expect(args.slice(args.indexOf('Agent'), args.indexOf('Agent') + 3)).toEqual(['Agent', 'WebSearch', 'WebFetch']);
    expect(args.slice(args.indexOf('AskUserQuestion'), args.indexOf('AskUserQuestion') + 4)).toEqual(['AskUserQuestion', 'PowerShell', '--append-system-prompt', 'Responde en castellano.']);
    expect(args[args.indexOf('--max-turns') + 1]).toBe('8');
  });

  it('aborta si SETTINGS no deshabilita el kit instalado', async () => {
    const { subject, errs, fs } = start({ SETTINGS: '{"enabledPlugins":{}}' });

    await expect(subject.launch('x')).rejects.toThrow('exit 1');
    expect(errs).toEqual(['[a-1] SETTINGS sin deshabilitar el kit instalado: {"enabledPlugins":{}}']);
    expect(fs.exists(join(RUNS, 'red', 'a-1.args'))).toBe(false);
  });

  it('aborta si SETTINGS no carga deny-kill.mjs', async () => {
    const { subject, errs } = start({ SETTINGS: '{"enabledPlugins":{"sdd-kit@sdd-kit":false}}' });

    await expect(subject.launch('x')).rejects.toThrow('exit 1');
    expect(errs).toEqual(['[a-1] SETTINGS sin el hook deny-kill.mjs: añade $DENY_KILL_HOOK a sus PreToolUse']);
  });

  it('acepta un SETTINGS propio que lleva el hook', async () => {
    const settings = `{"enabledPlugins":{"sdd-kit@sdd-kit":false},"hooks":{"PreToolUse":[{"matcher":"Bash|PowerShell","hooks":[{"type":"command","command":"node \\"${DENY_KILL}\\""}]}]}}`;
    const { subject, fs } = start({ DRY_RUN: '1', SETTINGS: settings });

    await subject.launch('x');

    expect(argsOf(fs)[4]).toBe(settings);
  });

  it('aborta si el molde no cuelga de RUNS_DIR', async () => {
    const { subject, errs } = start({ MOLD_NAME: '../../../fuera' });

    await expect(subject.launch('x')).rejects.toThrow('exit 1');
    expect(errs).toEqual([`[a-1] cwd fuera del scratchpad: ${subject.R}`]);
  });
});

describe('Lanzar claude (lib.mjs)', () => {
  it('lanza el claude del PATH en el molde, con no-claude/ delante y la identidad Fixture', async () => {
    const { subject, claudeCalls, fs } = start({ Path: join(CWD, 'bin') });

    expect(await subject.launch('x')).toBe(0);

    const [call] = claudeCalls;
    expect(call.command).toBe('C:\\bin\\claude.exe');
    expect(call.cwd).toBe(subject.R);
    expect(call.stdout).toBe(join(RUNS, 'red', 'a-1.jsonl'));
    expect(call.env.Path).toBe(`${join(HEADLESS, 'no-claude')}${delimiter}${join(CWD, 'bin')}`);
    expect(Object.keys(call.env).filter((name) => name.toLowerCase() === 'path')).toEqual(['Path']);
    expect(call.env).toMatchObject({ GIT_CONFIG_COUNT: '2', GIT_CONFIG_KEY_0: 'user.name', GIT_CONFIG_VALUE_0: 'Fixture', GIT_CONFIG_KEY_1: 'user.email', GIT_CONFIG_VALUE_1: 'fixture@example.com' });
    expect(call.args.at(-1)).toBe('x');
    expect(fs.read(join(RUNS, 'red', 'a-1.err'))).toBe('');
  });

  it('con CLAUDE_BIN en .mjs lanza ese claude con node', async () => {
    const fake = join(CWD, 'f', 'fake-claude.mjs');
    const { subject, claudeCalls } = start({ CLAUDE_BIN: fake });

    await subject.launch('x');

    expect(claudeCalls[0].command).toBe('node');
    expect(claudeCalls[0].args[0]).toBe(fake);
    expect(claudeCalls[0].args.at(-1)).toBe('x');
  });

  it('en seco escribe el stream falso sin lanzar claude', async () => {
    const { subject, claudeCalls, fs } = start({ DRY_RUN: '1', DRY_COST: '0.7', HOME: '/c/Users/alice' });

    await subject.launch('x');

    const events = fs.read(join(RUNS, 'red', 'a-1.jsonl')).trim().split('\n').map((line) => JSON.parse(line));
    expect(claudeCalls).toEqual([]);
    expect(events[0]).toEqual({ type: 'system', subtype: 'init', session_id: 'dry-a-1' });
    expect(events[1].message.content[0].text).toBe('En seco desde /c/Users/alice · permitidas extra:  · git: Fixture <fixture@example.com>');
    expect(events[1].message.content[1]).toEqual({ type: 'tool_use', name: 'Bash', input: { command: `ls ${subject.R}` } });
    expect(events[2]).toEqual({ type: 'result', num_turns: 1, total_cost_usd: 0.7, result: 'hecho' });
  });

  it('con SUBJECT_TIMEOUT mata el árbol de claude al vencer y sale con 124 (ticket de la feature 0098 §4)', async () => {
    const { subject, timers, killed, errs } = start({ SUBJECT_TIMEOUT: '5' }, kitFs(), { claude: () => ({ hang: true }) });

    const launched = subject.launch('x');
    expect(timers.map(({ ms }) => ms)).toEqual([5000]);
    timers[0].fire();

    expect(await launched).toBe(124);
    expect(killed).toEqual([{ pid: 4242, tree: true }]);
    expect(errs).toEqual(['[a-1] tope de 5 s: sujeto cortado']);
  });

  it('sin SUBJECT_TIMEOUT pone un tope de 30 min: sin él, un sujeto colgado paró la tanda una hora (ticket de la feature 0230 §1)', async () => {
    const { subject, armed } = start();

    await subject.launch('x');

    expect(armed).toEqual([1_800_000]);
  });

  it('con SUBJECT_TIMEOUT=0 no pone tope', async () => {
    const { subject, armed } = start({ SUBJECT_TIMEOUT: '0' });

    await subject.launch('x');

    expect(armed).toEqual([]);
  });
});

describe('Segundo turno y persona (lib.mjs)', () => {
  it('TURN2 reanuda la sesión del primer turno', async () => {
    const { subject, fs } = start({ DRY_RUN: '1', TURN2: 'Sigue.', SUPERPOWERS_DIR: 'C:/sp/6.4.2' });

    await subject.launch('Primera.');

    const second = argsOf(fs, 'a-1.resume.args');
    expect(second[second.indexOf('--resume') + 1]).toBe('dry-a-1');
    expect(second).toContain('C:/sp/6.4.2');
    expect(second.at(-1)).toBe('Sigue.');
    expect(argsOf(fs).at(-1)).toBe('Primera.');
    const results = fs.read(join(RUNS, 'red', 'a-1.jsonl')).trim().split('\n').map((line) => JSON.parse(line)).filter((event) => event.type === 'result');
    expect(results.map((event) => event.total_cost_usd)).toEqual([0.5, 1]);
  });

  it('resume reanuda la sesión real con claude', async () => {
    const { subject, claudeCalls } = start();
    await subject.launch('x');

    await subject.resume('Sigue.');

    expect(claudeCalls[1].args.slice(-3)).toEqual(['--resume', 's-1', 'Sigue.']);
    expect(claudeCalls[1].append).toBe(true);
  });

  it('resume sin session_id muere con su mensaje', async () => {
    const { subject, fs, errs } = start({ DRY_RUN: '1' });
    await subject.launch('x');
    fs.write(join(RUNS, 'red', 'a-1.jsonl'), '');

    await expect(subject.resume('y')).rejects.toThrow('exit 1');
    expect(errs).toEqual(['[a-1] sin session_id: no se puede reanudar']);
    expect(fs.exists(join(RUNS, 'red', 'a-1.resume.args'))).toBe(false);
  });

  const personaFiles = (fs: MemoryFs): string[] => fs.list(join(RUNS, 'red')).filter((name) => /^a-1\.persona-\d+\.txt$/.test(name));

  it('converse reanuda hasta que el sujeto deja de preguntar', async () => {
    const { subject, fs } = start({ DRY_RUN: '1', DRY_RESULT: '¿Seguimos?' });
    fs.write(join(RUNS, 'hoja.md'), 'Contesta sí.');
    await subject.launch('x');
    delete subject.env.DRY_RESULT;

    await subject.converse(join(RUNS, 'hoja.md'), 5);

    expect(argsOf(fs, 'a-1.resume.args').at(-1)).toBe('Respuesta de la persona.');
    expect(personaFiles(fs)).toHaveLength(1);
  });

  it('converse para en el tope de turnos', async () => {
    const { subject, fs } = start({ DRY_RUN: '1', DRY_RESULT: '¿Seguimos?' });
    fs.write(join(RUNS, 'hoja.md'), 'Contesta sí.');
    await subject.launch('x');

    await subject.converse(join(RUNS, 'hoja.md'), 3);

    expect(personaFiles(fs)).toHaveLength(3);
  });

  it('converse suma el coste de la persona al último RESULTADO', async () => {
    const { subject, fs } = start({ DRY_RUN: '1', DRY_RESULT: '¿Seguimos?', DRY_PERSONA_COST: '0.25' });
    fs.write(join(RUNS, 'hoja.md'), 'Contesta sí.');
    await subject.launch('x');
    delete subject.env.DRY_RESULT;

    await subject.converse(join(RUNS, 'hoja.md'), 5);

    const last = JSON.parse(fs.read(join(RUNS, 'red', 'a-1.jsonl')).trim().split('\n').at(-1) ?? '');
    expect(last).toEqual({ type: 'result', num_turns: 1, total_cost_usd: 1.25, result: 'conversación con persona: 1 respuestas' });
  });

  it('la persona real contesta con haiku y deja su coste', async () => {
    const reply = '{"result":"Sí, adelante.","total_cost_usd":0.01}';
    const question = '{"type":"system","session_id":"s-1"}\n{"type":"result","total_cost_usd":0.5,"result":"¿Seguimos?"}\n';
    const { subject, fs, claudeCalls } = start({}, kitFs(), { claude: ({ args }) => ({ stream: args.includes('haiku') ? reply : question }) });
    fs.write(join(RUNS, 'hoja.md'), 'Contesta sí.');
    await subject.launch('x');

    await subject.converse(join(RUNS, 'hoja.md'), 1);

    const persona = claudeCalls[1];
    expect(persona.args.slice(0, 9)).toEqual(['-p', '--model', 'haiku', '--setting-sources', '', '--output-format', 'json', '--max-turns', '1']);
    expect(persona.args.at(-1)).toMatch(/^Eres el usuario de esta hoja: Contesta sí\..*El agente dice: ¿Seguimos\?$/s);
    expect(fs.read(join(RUNS, 'red', 'a-1.persona-1.txt'))).toBe('0.01');
    expect(claudeCalls[2].args.at(-1)).toBe('Sí, adelante.');
  });
});

const listen = (port: number, pid: number): string => `  TCP    0.0.0.0:${port}           0.0.0.0:0              LISTENING       ${pid}\n`;

function netstatSequence(...outputs: string[]): () => string {
  let call = 0;
  return () => outputs[Math.min(call++, outputs.length - 1)];
}

const errLine = (fs: MemoryFs): string => fs.read(join(RUNS, 'red', 'a-1.err')).trim().split('\n').at(-1) ?? '';

describe('Puertos del sujeto (lib.mjs)', () => {
  it('ports junta PORT y los puertos del stream', () => {
    const { subject, fs } = start({ PORT: '4300' });
    fs.write(subject.JSONL, '{"text":"abre http://localhost:4567 y PORT=5173 npm start; otra vez localhost:4567"}\n');

    expect(subject.ports()).toBe('4300,4567,5173');
  });

  it('ports descarta puertos fuera de rango (feature 0215)', () => {
    const { subject, fs } = start({ PORT: '99999' });
    fs.write(subject.JSONL, '{"text":"abre http://localhost:70000 y http://localhost:4567"}\n');

    expect(subject.ports()).toBe('4567');
  });

  it('para al acabar lo que escucha en sus puertos y arrancó con el sujeto (ticket de la feature 0036 §3)', () => {
    const { subject, fs, killed, cleanup } = start({ PORT: '4300' }, kitFs(), { netstat: netstatSequence('', listen(4300, 77)) });
    fs.write(subject.JSONL, '');

    cleanup();

    expect(killed).toEqual([{ pid: 77, tree: false }]);
    expect(errLine(fs)).toBe('puertos del sujeto: 4300 · escuchando al acabar: 4300');
  });

  it('no para el PID que ya escuchaba antes del sujeto (revisión final de la feature 0214)', () => {
    const { subject, fs, killed, cleanup } = start({ PORT: '4300' }, kitFs(), { netstat: netstatSequence(listen(4300, 50)) });
    fs.write(subject.JSONL, '');

    cleanup();

    expect(killed).toEqual([]);
    expect(errLine(fs)).toBe('puertos del sujeto: 4300 · escuchando al acabar: ninguno');
  });

  it('para un PID nuevo en un puerto que antes escuchaba otro', () => {
    const { subject, fs, killed, cleanup } = start({ PORT: '4300' }, kitFs(), { netstat: netstatSequence(listen(4300, 50), listen(4300, 60)) });
    fs.write(subject.JSONL, '');

    cleanup();

    expect(killed).toEqual([{ pid: 60, tree: false }]);
  });

  it('sin respuesta de netstat lo dice', () => {
    let call = 0;
    const netstat = () => {
      if (call++ > 0) throw new Error('netstat no está');
      return '';
    };
    const { subject, fs, cleanup } = start({ PORT: '4300' }, kitFs(), { netstat });
    fs.write(subject.JSONL, '');

    cleanup();

    expect(errLine(fs)).toBe('puertos del sujeto: 4300 · escuchando al acabar: no comprobado (netstat no respondió)');
  });

  describe('un puerto que nombra otro sujeto (feature 0215)', () => {
    function withOther(mark: string, options: FakeOptions = {}) {
      const fs = kitFs();
      fs.write(join(RUNS, 'live', 'red.b-1'), mark);
      fs.write(join(RUNS, 'red', 'b-1.jsonl'), '{"text":"localhost:4300"}\n');
      const started = start({ PORT: '4300' }, fs, { netstat: netstatSequence('', listen(4300, 77)), ...options });
      fs.write(started.subject.JSONL, '');
      return started;
    }

    it('no para un puerto que nombra otro sujeto en curso y le deja la foto del arranque', () => {
      const { fs, killed, cleanup } = withOther('900\n', { alive: [900] });

      cleanup();

      expect(killed).toEqual([]);
      expect(JSON.parse(fs.read(join(RUNS, 'ports', '4300')))).toEqual([]);
      expect(errLine(fs)).toBe('puertos del sujeto: 4300 · escuchando al acabar: sin consultar · compartidos con otro sujeto en curso, sin parar: 4300');
    });

    it('trata como en curso la marca a medio escribir de otro sujeto', () => {
      const { fs, killed, cleanup } = withOther('');

      cleanup();

      expect(killed).toEqual([]);
      expect(errLine(fs)).toMatch(/compartidos con otro sujeto en curso, sin parar: 4300$/);
    });

    it('para un puerto de otro sujeto que ya no corre', () => {
      const { fs, killed, cleanup } = withOther('900\n');

      cleanup();

      expect(killed).toEqual([{ pid: 77, tree: false }]);
      expect(errLine(fs)).toBe('puertos del sujeto: 4300 · escuchando al acabar: 4300');
    });

    it('el último en acabar para el servidor compartido que arrancó antes que él, con la foto del primero', () => {
      const fs = kitFs();
      fs.write(join(RUNS, 'ports', '4300'), '[]');
      const { subject, killed, cleanup } = start({ PORT: '4300' }, fs, { netstat: netstatSequence(listen(4300, 77)) });
      fs.write(subject.JSONL, '');

      cleanup();

      expect(killed).toEqual([{ pid: 77, tree: false }]);
      expect(fs.exists(join(RUNS, 'ports', '4300'))).toBe(false);
    });
  });
});

describe('Fallos de la limpieza, el tope, los puertos y la copia del kit (lib.mjs)', () => {
  it('la limpieza borra el molde aunque un paso anterior lance', () => {
    const fs = kitFs();
    const remove = fs.remove;
    fs.remove = (path: string) => {
      if (path.includes('cc-tmp')) throw new Error('EBUSY: carpeta en uso');
      remove(path);
    };
    const { subject, errs, cleanup } = start({ CLAUDE_CODE_TMPDIR: join(CWD, 'cc-tmp') }, fs);

    cleanup();

    expect(fs.exists(subject.RUN)).toBe(false);
    expect(errs).toEqual(['[a-1] EBUSY: carpeta en uso']);
  });

  it('al vencer el tope el sujeto sale con 124', async () => {
    const { subject, timers, cleanup } = start({ SUBJECT_TIMEOUT: '5' }, kitFs(), { claude: () => ({ hang: true }) });
    const launched = subject.launch('x');
    timers[0].fire();
    await launched;

    expect(cleanup()).toEqual([124]);
  });

  it('aborta con un SUBJECT_TIMEOUT que no es un número de segundos', async () => {
    const { subject, errs } = start({ SUBJECT_TIMEOUT: 'media hora' });

    await expect(subject.launch('x')).rejects.toThrow('exit 1');
    expect(errs).toEqual(['[a-1] SUBJECT_TIMEOUT tiene que ser un número de segundos: media hora']);
  });

  it('aborta sin claude en el PATH', async () => {
    const { subject, errs } = start({}, kitFs(), { which: () => undefined });

    await expect(subject.launch('x')).rejects.toThrow('exit 1');
    expect(errs).toEqual(['[a-1] no encuentro claude en el PATH']);
  });

  it('putKitMarker aborta si la copia del kit no da ninguna versión', () => {
    const fs = kitFs();
    fs.write(join(KIT, '.claude-plugin', 'plugin.json'), '{"name":"sdd-kit"}\n');
    const { subject, errs } = start({}, fs);

    expect(dies(() => subject.putKitMarker('"channel": "plugin"'))).toBe('exit 1');
    expect(errs).toEqual([`[a-1] sin versión en la copia del kit ${KIT}: ni plugin.json ni migraciones`]);
  });

  it('converse para y devuelve 1 si la persona falla', async () => {
    const question = '{"type":"system","session_id":"s-1"}\n{"type":"result","total_cost_usd":0.5,"result":"¿Seguimos?"}\n';
    const { subject, fs, claudeCalls } = start({}, kitFs(), { claude: ({ args }) => (args.includes('haiku') ? { code: 1, stream: '' } : { stream: question }) });
    fs.write(join(RUNS, 'hoja.md'), 'Contesta sí.');
    await subject.launch('x');

    expect(await subject.converse(join(RUNS, 'hoja.md'), 3)).toBe(1);
    expect(claudeCalls).toHaveLength(2);
  });

  it('sin foto del arranque no deja relevo de un puerto compartido', () => {
    let call = 0;
    const netstat = () => {
      if (call++ === 0) throw new Error('netstat no está');
      return listen(4300, 77);
    };
    const fs = kitFs();
    fs.write(join(RUNS, 'live', 'red.b-1'), '900\n');
    fs.write(join(RUNS, 'red', 'b-1.jsonl'), '{"text":"localhost:4300"}\n');
    const { subject, killed, cleanup } = start({ PORT: '4300' }, fs, { netstat, alive: [900] });
    fs.write(subject.JSONL, '');

    cleanup();

    expect(killed).toEqual([]);
    expect(fs.exists(join(RUNS, 'ports', '4300'))).toBe(false);
  });

  it('un relevo ilegible vale lo que la foto propia', () => {
    const fs = kitFs();
    fs.write(join(RUNS, 'ports', '4300'), '[77, 8');
    const { subject, killed, cleanup } = start({ PORT: '4300' }, fs, { netstat: netstatSequence(listen(4300, 50), listen(4300, 50)) });
    fs.write(subject.JSONL, '');

    cleanup();

    expect(killed).toEqual([]);
    expect(errLine(fs)).toBe('puertos del sujeto: 4300 · escuchando al acabar: ninguno');
  });
});
