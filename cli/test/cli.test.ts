import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { run } from '../src/main.ts';
import { memoryIo } from '../src/cli/io.ts';
import type { Verb } from '../src/cli/verbs.ts';
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

  it('--help lista decision check y decision index', async () => {
    const io = memoryIo();
    expect(await run(['--help'], io)).toBe(0);
    const text = io.stdout.join('\n');
    expect(text).toContain('sdd decision check');
    expect(text).toContain('sdd decision index');
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
