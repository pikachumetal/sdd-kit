import { describe, it, expect, vi } from 'vitest';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { memoryIo } from '../../src/cli/io.ts';
import { run } from '../../src/main.ts';
import { execFileSync } from 'node:child_process';
import { isolatedEnv } from '../../src/git/git.ts';
import { commitsOf } from '../../src/session/branches.ts';
import { buildTiming, isGateCall, marginWarning, readGateCommand } from '../../src/session/timing.ts';
import { line, measure, newWorktree, tempDir, type Worktree } from './helpers.ts';

vi.setConfig({ testTimeout: 20_000 });

const branch = 'feature/0192';
const usage = { input_tokens: 1, cache_read_input_tokens: 0, output_tokens: 1 };
const GATE = 'moon run kit:test-headless cli:typecheck cli:test --affected --base develop';
const at = (time: string): string => `2026-11-02T${time}.000Z`;

type Entry = Record<string, unknown>;

let ids = 0;
function agent(time: string, content: unknown[], stop?: string): Entry {
  ids += 1;
  return { type: 'assistant', uuid: `a${ids}`, timestamp: at(time), gitBranch: branch, message: { model: 'claude-sonnet-5', id: `m${ids}`, role: 'assistant', content, usage, stop_reason: stop } };
}
const tool = (id: string, name: string, input: Entry): Entry => ({ type: 'tool_use', id, name, input });
const skillCall = (time: string, id: string, skill: string): Entry => agent(time, [tool(id, 'Skill', { skill })]);
const bash = (time: string, id: string, command: string): Entry => agent(time, [tool(id, 'Bash', { command })]);
const result = (time: string, id: string): Entry => ({ type: 'user', timestamp: at(time), gitBranch: branch, message: { role: 'user', content: [{ type: 'tool_result', tool_use_id: id, content: 'ok' }] } });

const flow: Entry[] = [
  skillCall('13:48:00', 's1', 'sdd-kit:sdd-propose'),
  result('13:48:01', 's1'),
  skillCall('14:54:00', 's2', 'sdd-kit:sdd-implement'),
  result('14:54:01', 's2'),
  bash('14:57:00', 't1', 'node cli/bin/sdd.js task start "$P" 1'),
  result('14:57:01', 't1'),
  skillCall('15:35:00', 's3', 'sdd-kit:sdd-verify'),
  result('15:35:01', 's3'),
  skillCall('15:59:00', 's4', 'sdd-kit:sdd-retro'),
  result('15:59:01', 's4'),
  bash('16:00:00', 'g1', `${GATE} 2>&1 | tail -5`),
  result('16:04:00', 'g1'),
  bash('16:04:10', 'v1', 'npx vitest run test/session/'),
  result('16:04:40', 'v1'),
  agent('16:05:00', [{ type: 'text', text: 'hecho' }], 'end_turn'),
];

function worktreeWith(entries: Entry[], gateLine: string | null = `- **Gate de cierre**: \`${GATE}\``): Worktree {
  const worktree = newWorktree([], null);
  writeFileSync(join(worktree.folder, 's1.jsonl'), entries.map((entry) => JSON.stringify(entry)).join('\n'));
  mkdirSync(join(worktree.path, '.docs/sdd'), { recursive: true });
  if (gateLine !== null) writeFileSync(join(worktree.path, '.docs/sdd/tech-stack.md'), `# Tech\n\n## Testing\n\n${gateLine}, una vez.\n`);
  return worktree;
}

async function timingOf(worktree: Worktree, plan?: { file: string; text: string }): Promise<{ timing: Record<string, any>; folder: string; output: string }> {
  const folder = tempDir();
  if (plan !== undefined) writeFileSync(join(folder, plan.file), plan.text);
  const { output } = await measure(worktree, ['--branch', branch, '--artifact', folder]);
  return { timing: JSON.parse(readFileSync(join(folder, 'timing.json'), 'utf8')), folder, output };
}

const phaseOf = (timing: Record<string, any>, name: string): Record<string, any> => timing.phases.find((phase: { name: string }) => phase.name === name);
const sum = (timing: Record<string, any>, key: string): number => timing.phases.reduce((total: number, phase: Record<string, number>) => total + (phase[key] ?? 0), 0);

describe('session tokens --artifact', () => {
  it('escribe las cuatro fases en orden, con sus tiempos y su ceremonia', async () => {
    const { timing } = await timingOf(worktreeWith(flow));
    expect(timing.version).toBe(1);
    expect(timing.measured).toBe(true);
    expect(timing.phases.map((phase: Record<string, unknown>) => [phase.name, phase.ceremony])).toEqual([['apertura', true], ['implementacion', false], ['revision', true], ['cierre', true]]);
    expect(phaseOf(timing, 'implementacion').tasks[0]).toMatchObject({ task: 1, source: 'events' });
    for (const phase of timing.phases) expect(Object.keys(phase)).toEqual(expect.arrayContaining(['agentSeconds', 'execSeconds', 'waitSeconds', 'idleSeconds']));
  });

  it('las fases suman el reloj dentro del margen', async () => {
    const { timing } = await timingOf(worktreeWith(flow));
    const total = ['agentSeconds', 'execSeconds', 'waitSeconds', 'idleSeconds'].reduce((all, key) => all + sum(timing, key), 0);
    expect(Math.abs(total - timing.clockSeconds)).toBeLessThanOrEqual(Math.max(60, timing.clockSeconds * 0.01));
    expect(timing.withinMargin).toBe(true);
  });

  it('agente y ejecución dan el esfuerzo real, y las líneas no cambian', async () => {
    const worktree = worktreeWith(flow);
    const plain = await measure(worktree, ['--branch', branch]);
    const { timing, output } = await timingOf(worktree);
    expect(output).toBe(plain.output);
    const hours = (sum(timing, 'agentSeconds') + sum(timing, 'execSeconds')) / 3600;
    expect(hours.toFixed(2).replace('.', ',')).toBe(/Esfuerzo real: ([\d,]+) h/.exec(line(output, 'Esfuerzo real')!)![1]);
  });

  it('sin --artifact no escribe nada, y regenerarlo deja el fichero idéntico', async () => {
    const worktree = worktreeWith(flow);
    const { folder } = await timingOf(worktree);
    const first = readFileSync(join(folder, 'timing.json'), 'utf8');
    await measure(worktree, ['--branch', branch, '--artifact', folder]);
    expect(readFileSync(join(folder, 'timing.json'), 'utf8')).toBe(first);
    await measure(worktree, ['--branch', branch]);
    expect(existsSync(join(worktree.path, 'timing.json'))).toBe(false);
  });

  it('una fase sin eventos no da cifra, y la suma sigue en el margen', async () => {
    const { timing } = await timingOf(worktreeWith(flow.slice(0, 8)));
    expect(phaseOf(timing, 'cierre')).toMatchObject({ measured: false, agentSeconds: null, gateSeconds: null, reason: 'sin eventos: su tiempo queda en revision' });
    expect(timing.withinMargin).toBe(true);
  });

  it('sin transcripts escribe measured false', async () => {
    const folder = tempDir();
    const worktree = newWorktree([], null);
    const io = memoryIo();
    const missing = join(tempDir(), 'sin-transcripts');
    mkdirSync(missing);
    const code = await run(['session', 'tokens', '--path', missing, '--projects-root', worktree.projects, '--artifact', folder], io);
    const timing = JSON.parse(readFileSync(join(folder, 'timing.json'), 'utf8'));
    expect(code).toBe(0);
    expect(timing).toMatchObject({ version: 1, measured: false });
    expect(timing.reason).toContain('sin transcripts de Claude Code para');
  });
});

describe('el gate se atribuye por su comando', () => {
  it('suma la pasada del gate dentro de la ejecución, y no un vitest', async () => {
    const { timing } = await timingOf(worktreeWith(flow));
    const closing = phaseOf(timing, 'cierre');
    expect(closing.gateSeconds).toBe(240);
    expect(closing.execSeconds).toBe(270 + 1);
    expect(timing.gateCommand).toBe(GATE);
    expect(timing.totals.gateSeconds).toBe(240);
  });

  it.each([
    [`${GATE} 2>&1 | tail -5`, true],
    [`cd cli && moon run kit:test-headless cli:typecheck cli:test --force`, true],
    ['moon run cli:test', false],
    ['echo moon run kit:test-headless cli:typecheck cli:test', false],
    ['npx vitest run test/session/', false],
  ])('%s → %s', (command, expected) => {
    expect(isGateCall(command, GATE)).toBe(expected);
  });

  it('sin gate declarado, gateCommand y gateSeconds son null', async () => {
    const { timing } = await timingOf(worktreeWith(flow, null));
    expect(timing.gateCommand).toBeNull();
    expect(phaseOf(timing, 'cierre').gateSeconds).toBeNull();
    expect(timing.totals.gateSeconds).toBeNull();
  });

  it('el de operations.md manda sobre el de tech-stack.md', () => {
    const docs = tempDir();
    mkdirSync(join(docs, 'steering'));
    writeFileSync(join(docs, 'tech-stack.md'), '- **Gate de cierre**: `npm test`\n');
    writeFileSync(join(docs, 'steering/operations.md'), '- **Gate de cierre**: `moon run a:b`\n');
    expect(readGateCommand(docs)).toBe('moon run a:b');
  });
});

describe('cada fase lleva su estimado', () => {
  const estimates = (timing: Record<string, any>): unknown[] => timing.phases.map((phase: { estimateHours: unknown }) => phase.estimateHours);
  const full = '- Esfuerzo spec + plan: 0,5h\n- Estimación de implementación: 1h\n- Estimación de revisión: 0,25h\n- Estimación de cierre: 0,25h\n';

  it('los lee del plan', async () => {
    expect(estimates((await timingOf(worktreeWith(flow), { file: 'plan.md', text: full })).timing)).toEqual([0.5, 1, 0.25, 0.25]);
  });

  it('un plan sin las dos últimas líneas da null en revisión y cierre', async () => {
    const text = '- Esfuerzo spec + plan: 0,5h\n- Estimación de implementación: 1h\n';
    expect(estimates((await timingOf(worktreeWith(flow), { file: 'plan.md', text })).timing)).toEqual([0.5, 1, null, null]);
  });

  it('un lite los lee de spec.md', async () => {
    const text = '- Esfuerzo spec: 0,5h\n- Estimación de implementación: 1h\n';
    expect(estimates((await timingOf(worktreeWith(flow), { file: 'spec.md', text })).timing)).toEqual([0.5, 1, null, null]);
  });

  it('sin plan ni esas líneas, null en todas', async () => {
    expect(estimates((await timingOf(worktreeWith(flow))).timing)).toEqual([null, null, null, null]);
  });

  it('los eventos de task mandan sobre los encabezados del plan', async () => {
    const text = `${full}\n### Task 1 — a\n\n### Task 2 — b\n`;
    const { timing } = await timingOf(worktreeWith(flow), { file: 'plan.md', text });
    expect(phaseOf(timing, 'implementacion').tasks).toHaveLength(1);
  });
});

describe('casos de borde del reloj y la rama', () => {
  it('una llamada sin resultado no cuenta como ejecución', async () => {
    const entries = [skillCall('10:00:00', 's1', 'sdd-kit:sdd-propose'), result('10:00:01', 's1'), bash('10:10:00', 'cut', 'npm test'), agent('10:20:00', [{ type: 'text', text: 'sigo' }])];
    const { timing } = await timingOf(worktreeWith(entries, null));
    expect(phaseOf(timing, 'apertura').execSeconds).toBe(1);
  });

  it('fuera del margen lo marca y avisa, sin cambiar la salida', () => {
    const timing = buildTiming({ timelines: [], commits: [], branch, clockSeconds: 7200, folder: tempDir(), docsPath: tempDir() });
    expect(timing.withinMargin).toBe(false);
    expect(marginWarning(timing)).toBe('timing.json fuera del margen: fases 0 s, reloj 7200 s');
  });

  it('commitsOf da la apertura y las tasks, y solo con la rama fusionada el cierre', () => {
    const repo = tempDir();
    const git = (...args: string[]): void => void execFileSync('git', ['-C', repo, '-c', 'user.name=Fixture', '-c', 'user.email=f@example.invalid', ...args], { stdio: 'ignore', env: isolatedEnv() });
    git('init', '-q', '-b', 'develop');
    git('commit', '-q', '--allow-empty', '-m', 'base');
    git('checkout', '-q', '-b', 'feature/1');
    git('commit', '-q', '--allow-empty', '-m', 'apertura');
    git('commit', '-q', '--allow-empty', '-m', 'cierre');
    expect(commitsOf(repo, 'feature/1', 'develop').map(({ closing }) => closing)).toEqual([false, false]);
    git('checkout', '-q', 'develop');
    git('merge', '-q', '--no-ff', '-m', 'merge', 'feature/1');
    expect(commitsOf(repo, 'feature/1', 'develop').map(({ closing }) => closing)).toEqual([false, true]);
  });
});

describe('fixture de transcript real', () => {
  const session = join(import.meta.dirname, 'fixtures/feature-0271/session.jsonl');

  it('no lleva rutas de usuario ni emails', () => {
    expect(readFileSync(session, 'utf8')).not.toMatch(/Users|\/home\/|[\w.+-]+@[\w-]+\.[\w.]+/);
  });

  it('da las cuatro fases con withinMargin true y el esfuerzo real medido', async () => {
    const worktree = newWorktree([], null);
    writeFileSync(join(worktree.folder, 'session.jsonl'), readFileSync(session, 'utf8'));
    const folder = tempDir();
    await measure(worktree, ['--branch', 'feature/0271-clean-red-rules', '--artifact', folder]);
    const timing = JSON.parse(readFileSync(join(folder, 'timing.json'), 'utf8'));
    expect(timing.phases.map((phase: { measured: boolean }) => phase.measured)).toEqual([true, true, true, true]);
    expect(timing.withinMargin).toBe(true);
    expect(((timing.totals.agentSeconds + timing.totals.execSeconds) / 3600).toFixed(2)).toBe('1.40');
    expect(phaseOf(timing, 'implementacion').tasks.map((task: { task: number }) => task.task)).toEqual([1, 2]);
  });
});
