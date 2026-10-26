import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { bookingsFixture, sddFolder } from './capability/helpers.ts';
import { run } from '../src/main.ts';
import { memoryIo } from '../src/cli/io.ts';
import { VERBS, type Verb } from '../src/cli/verbs.ts';
import { nodeVersionProblem } from '../bin/node-version.js';

const testVerbs: Verb[] = [
  {
    noun: 'capability',
    verb: 'index',
    summary: 'Lista las capacidades con su propósito',
    options: { path: { type: 'string' }, json: { type: 'boolean' } },
    run: async (_args, io) => {
      io.out('ok');
      return 0;
    },
  },
  {
    noun: 'capability',
    verb: 'check',
    summary: 'Valida las capacidades',
    options: { path: { type: 'string' } },
    run: async () => 0,
  },
  {
    noun: 'merge',
    summary: 'Fusiona la rama del cierre',
    options: {},
    run: async () => 0,
  },
];

describe('sdd --help', () => {
  it('help lists every registered verb', async () => {
    const io = memoryIo();
    const code = await run(['--help'], io, testVerbs);
    expect(code).toBe(0);
    const text = io.stdout.join('\n');
    expect(text).toContain('sdd capability index');
    expect(text).toContain('Lista las capacidades con su propósito');
    expect(text).toContain('sdd capability check');
    expect(text).toContain('sdd merge');
  });

  it('--help lista init', async () => {
    const io = memoryIo();
    expect(await run(['--help'], io)).toBe(0);
    expect(io.stdout.join('\n')).toMatch(/^sdd init\s/m);
  });

  it('--help lista id next e id claim', async () => {
    const io = memoryIo();
    expect(await run(['--help'], io)).toBe(0);
    const text = io.stdout.join('\n');
    expect(text).toContain('sdd id next');
    expect(text).toContain('sdd id claim');
  });

  it('--help lista decision check y decision index', async () => {
    const io = memoryIo();
    expect(await run(['--help'], io)).toBe(0);
    const text = io.stdout.join('\n');
    expect(text).toContain('sdd decision check');
    expect(text).toContain('sdd decision index');
  });

  it('a verb with --help prints its usage without running', async () => {
    const io = memoryIo();
    expect(await run(['capability', 'index', '--help'], io, testVerbs)).toBe(0);
    expect(io.stdout).toEqual(['uso: sdd capability index [--path <valor>] [--json]', 'Lista las capacidades con su propósito']);
  });

  it('every registered verb accepts --help', async () => {
    for (const verb of VERBS) {
      const io = memoryIo();
      const command = [verb.noun, verb.verb].filter((part): part is string => part !== undefined);
      expect(await run([...command, '--help'], io), command.join(' ')).toBe(0);
      expect(io.stdout[0]).toMatch(new RegExp(`^uso: sdd ${command.join(' ')}\\b`));
    }
  });
});

describe('node version', () => {
  it('rejects node 20.11.0', () => {
    expect(nodeVersionProblem('20.11.0')).toBe('sdd necesita Node 22.18 o posterior; tienes 20.11.0');
    expect(nodeVersionProblem('22.17.1')).toBe('sdd necesita Node 22.18 o posterior; tienes 22.17.1');
  });

  it('accepts 22.18.0 and later', () => {
    expect(nodeVersionProblem('22.18.0')).toBeNull();
    expect(nodeVersionProblem('24.20.0')).toBeNull();
    expect(nodeVersionProblem('26.10.0')).toBeNull();
  });
});

describe('usage errors', () => {
  it('unknown verb exits 2', async () => {
    const io = memoryIo();
    const code = await run(['capability', 'lista'], io, testVerbs);
    expect(code).toBe(2);
    const err = io.stderr.join('\n');
    expect(err).toContain('lista');
    expect(err).toContain('uso: sdd capability index|check');
  });

  it('unknown option exits 2', async () => {
    const io = memoryIo();
    const code = await run(['capability', 'index', '--ruta', 'x'], io, testVerbs);
    expect(code).toBe(2);
    expect(io.stderr.join('\n')).toContain('--ruta');
  });

  it('runs a known verb', async () => {
    const io = memoryIo();
    const code = await run(['capability', 'index', '--path', '.docs/sdd'], io, testVerbs);
    expect(code).toBe(0);
    expect(io.stdout).toEqual(['ok']);
  });
});

async function runReal(argv: string[]) {
  const io = memoryIo();
  const code = await run(argv, io);
  return { code, stdout: io.stdout, stderr: io.stderr.join('\n') };
}

describe('--project-root', () => {
  const project = () => {
    const sdd = sddFolder({ 'roadmap.md': '# Notas\n', 'capabilities/bookings.md': bookingsFixture, 'specs/.gitkeep': '' });
    return { sdd, root: dirname(dirname(sdd)) };
  };

  it.each([['roadmap', 'check'], ['capability', 'index'], ['decision', 'check']])('project-root resolves the docs folder in %s %s', async (noun, verb) => {
    const { sdd, root } = project();
    const byRoot = await runReal([noun, verb, '--project-root', root]);
    expect(byRoot).toEqual(await runReal([noun, verb, '--path', sdd]));
  });

  it('project-root without .docs/sdd has no roadmap to check', async () => {
    const root = dirname(dirname(sddFolder({})));
    expect((await runReal(['roadmap', 'check', '--project-root', join(root, 'otra')])).stdout).toEqual(['Sin roadmap que validar']);
  });

  it('project-root is an alias of --root in estimation log', async () => {
    const { root } = project();
    const out = join(root, 'log.md');
    const byRoot = await runReal(['estimation', 'log', '--project-root', root, '--out', out]);
    expect(byRoot).toEqual(await runReal(['estimation', 'log', '--root', root, '--out', out]));
    expect(byRoot.code).toBe(0);
  });

  it('project-root is an alias of --path in session tokens', async () => {
    const { root } = project();
    const empty = join(root, 'sin-sesiones');
    const byRoot = await runReal(['session', 'tokens', '--project-root', root, '--projects-root', empty, '--json']);
    expect(byRoot).toEqual(await runReal(['session', 'tokens', '--path', root, '--projects-root', empty, '--json']));
  });

  it('rejects path with project-root', async () => {
    const { sdd, root } = project();
    const result = await runReal(['roadmap', 'check', '--path', sdd, '--project-root', root]);
    expect(result.code).toBe(2);
    expect(result.stderr).toContain('--path y --project-root no van juntas');
  });

  it('rejects root with project-root', async () => {
    const { root } = project();
    const result = await runReal(['upgrade', '--root', root, '--project-root', root]);
    expect(result.code).toBe(2);
    expect(result.stderr).toContain('--root y --project-root no van juntas');
  });

  it.each([['merge', '--path'], ['id next', '--root']])('hints project-root on %s %s', async (command, option) => {
    const result = await runReal([...command.split(' '), option, '.']);
    expect(result.code).toBe(2);
    expect(result.stderr).toContain(`opción desconocida: «${option}»; la raíz del proyecto va en --project-root`);
  });
});

describe('package', () => {
  it('package has no runtime dependencies', () => {
    const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
    expect(pkg.dependencies).toBeUndefined();
  });
});

describe('unexpected errors', () => {
  it('prints only the message and exits 1', async () => {
    const failing = { noun: 'boom', summary: 'Falla', options: {}, run: async () => Promise.reject(new Error('ENOENT: no such file')) };
    const io = memoryIo();
    const code = await run(['boom'], io, [failing]);
    expect(code).toBe(1);
    expect(io.stderr).toEqual(['ENOENT: no such file']);
    expect(io.stderr.join('\n')).not.toMatch(/\n\s+at /);
  });
});
