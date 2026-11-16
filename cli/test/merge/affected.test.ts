import { describe, it, expect } from 'vitest';
import { branchOnly, matches, noCross, parseTaskTargets, planGate, readMoonGate, type MoonGate } from '../../src/merge/affected.ts';
import { parseGate } from '../../src/merge/verify.ts';

const QUERY = JSON.stringify({
  tasks: {
    cli: { test: { id: 'test', target: 'cli:test', command: 'pnpm' } },
    kit: { roadmap: { id: 'roadmap', target: 'kit:roadmap', command: 'node' } },
  },
  options: { affected: {} },
});

const gateOf = (text: string): MoonGate => {
  const gate = readMoonGate(parseGate(text));
  if (gate === null) throw new Error(`sin moon run: ${text}`);
  return gate;
};

const bases = { mergeBase: 'm0m0m0m', verifiedAt: 'a1b2c3d' };

describe('merge --verify: el gate de moon', () => {
  it('reads the targets after moon run', () => {
    const gate = gateOf('moon run :test --affected --base develop');

    expect(gate.targets).toEqual([':test']);
    expect(gate.affected).toBe(true);
    expect(gate.options).toEqual(['--affected']);
  });

  it('reads --base=<ref> and --affected=<value>', () => {
    const gate = gateOf('moon run :test --affected=local --base=develop');

    expect(gate.affected).toBe(true);
    expect(gate.options).toEqual(['--affected=local']);
  });

  it('refuses to cross a tag target', () => {
    expect(gateOf("moon run '#ci:test' --affected").blocker).toBe('#ci:test');
    expect(gateOf('moon run :test --affected --force').blocker).toBe('--force');
  });

  it('moves a target after the options to the targets', () => {
    const gate = gateOf('moon run --affected --base develop :test');

    expect(gate.targets).toEqual([':test']);
    expect(gate.options).toEqual(['--affected']);
    expect(gate.blocker).toBeNull();
  });

  it('keeps option values in place', () => {
    const gate = gateOf('moon run :test --affected --concurrency 2 --base develop -- --reporter=dot');

    expect(gate.options).toEqual(['--affected', '--concurrency', '2']);
    expect(gate.blocker).toBeNull();
    expect(branchOnly(gate, 'm0m0m0m').run).toEqual(['moon', 'run', ':test', '--affected', '--concurrency', '2', '--base', 'm0m0m0m', '--', '--reporter=dot']);
  });

  it('drops the affected value from the contrast', () => {
    expect(branchOnly(gateOf('moon run :test --affected local'), 'm0m0m0m').contrast).toEqual(['moon', 'run', ':test']);
  });

  it('reads relations and blocking options', () => {
    expect(gateOf('moon run :test --affected -g').relations).toBe(true);
    expect(gateOf('moon run :test --affected --include-relations').relations).toBe(true);
    expect(gateOf('moon run :test --affected --stdin').blocker).toBe('--stdin');
    expect(gateOf('moon run :test --affected --status=added').blocker).toBe('--status=added');
  });

  it('drops the declared head', () => {
    expect(gateOf('moon run :test --affected --head HEAD~1 --base=develop').options).toEqual(['--affected']);
  });

  it('is not a moon gate without moon run', () => {
    expect(readMoonGate(parseGate('node -e 1'))).toBeNull();
  });

  it('matches project and any-project targets', () => {
    expect(matches(':test', 'cli:test')).toBe(true);
    expect(matches('cli:test', 'cli:test')).toBe(true);
    expect(matches('kit:test', 'cli:test')).toBe(false);
  });

  it('reads the task keys of moon query', () => {
    expect(parseTaskTargets(QUERY)).toEqual(['cli:test', 'kit:roadmap']);
  });
});

describe('merge --verify: lo que se cruza', () => {
  it('keeps the wrapper and replaces only targets and base', () => {
    const gate = gateOf('node cli/bin/sdd.js lock run -- moon run kit:test-headless cli:typecheck cli:test --affected --base develop');

    const plan = planGate(gate, { branch: ['cli:test'], base: ['cli:test', 'kit:roadmap'] }, bases);

    expect(plan.run).toEqual(['node', 'cli/bin/sdd.js', 'lock', 'run', '--', 'moon', 'run', 'cli:test', '--affected', '--base', 'a1b2c3d']);
  });

  it('skips what does not cross', () => {
    const plan = planGate(gateOf('moon run :test --affected --base develop'), { branch: ['frontend:test'], base: ['backend:test'] }, bases);

    expect(plan.run).toBeNull();
    expect(plan.lines).toEqual(['verificación: frontend:test: saltada (la base no toca sus inputs)', 'verificación: backend:test: saltada (solo la toca la base)']);
  });

  it('runs what crosses', () => {
    const plan = planGate(gateOf('moon run :test --affected --base develop'), { branch: ['frontend:test'], base: ['frontend:test'] }, bases);

    expect(plan.lines[0]).toBe('verificación: corre frontend:test (las tocan la rama y la base)');
    expect(plan.run).toEqual(['moon', 'run', 'frontend:test', '--affected', '--base', 'a1b2c3d']);
  });

  it('contrasts the crossed targets on the base', () => {
    const plan = planGate(gateOf('moon run :test --affected --base develop'), { branch: ['frontend:test'], base: ['frontend:test'] }, bases);

    expect(plan.contrast).toEqual(['moon', 'run', 'frontend:test']);
  });

  it('runs the branch without verified-at', () => {
    const plan = planGate(gateOf('moon run :test --affected --base develop'), { branch: ['frontend:test'], base: null }, { mergeBase: 'm0m0m0m', verifiedAt: null });

    expect(plan.run).toEqual(['moon', 'run', 'frontend:test', '--affected', '--base', 'm0m0m0m']);
    expect(plan.lines.some((line) => line.includes('saltada'))).toBe(false);
  });

  it('keeps passthrough arguments after the base', () => {
    const plan = planGate(gateOf('moon run :test --affected --base develop -- --reporter=dot'), { branch: ['frontend:test'], base: ['frontend:test'] }, bases);

    expect(plan.run).toEqual(['moon', 'run', 'frontend:test', '--affected', '--base', 'a1b2c3d', '--', '--reporter=dot']);
    expect(plan.contrast).toEqual(['moon', 'run', 'frontend:test', '--', '--reporter=dot']);
  });

  it('runs what the branch touches when it cannot cross', () => {
    const fallback = branchOnly(gateOf('moon run :test --affected --base develop --force'), 'm0m0m0m');

    expect(fallback.run).toEqual(['moon', 'run', ':test', '--affected', '--force', '--base', 'm0m0m0m']);
    expect(fallback.contrast).toEqual(['moon', 'run', ':test', '--force']);
  });

  it('writes the no-cross line', () => {
    expect(noCross("'#ci:test' no admitido")).toBe("verificación: sin cruce: '#ci:test' no admitido; corre lo que toca la rama");
  });

  it('leaves out tasks the gate does not name', () => {
    const plan = planGate(gateOf('moon run cli:test --affected'), { branch: ['cli:test', 'kit:roadmap'], base: ['kit:roadmap'] }, bases);

    expect(plan.lines).toEqual(['verificación: cli:test: saltada (la base no toca sus inputs)']);
  });
});
