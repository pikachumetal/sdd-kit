import { describe, it, expect } from 'vitest';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { memoryIo } from '../../src/cli/io.ts';
import { run } from '../../src/main.ts';
import { line, measure, newWorktree, type Worktree } from './helpers.ts';

const branch = 'feature/0181';
const usage = { input_tokens: 1, cache_read_input_tokens: 0, output_tokens: 1 };

type Entry = Record<string, unknown>;

const at = (time: string, day = '2026-10-14'): string => `${day}T${time}:00.000Z`;

function agent(time: string, id: string, onBranch = branch, content: unknown[] = [{ type: 'text', text: '...' }]): Entry {
  const message = { model: 'claude-sonnet-5', id, role: 'assistant', content, usage };
  return { type: 'assistant', uuid: `a-${id}`, timestamp: at(time), gitBranch: onBranch, message };
}

function user(time: string, content: unknown, extra: Entry = {}): Entry {
  return { type: 'user', uuid: `u-${time}`, timestamp: at(time), gitBranch: branch, message: { role: 'user', content }, ...extra };
}

const askUser = (time: string, id: string): Entry =>
  agent(time, `ask-${id}`, branch, [{ type: 'tool_use', id, name: 'AskUserQuestion', input: {} }]);

const toolResult = (time: string, id: string): Entry => user(time, [{ type: 'tool_result', tool_use_id: id, content: 'ok' }]);

const firstSession: Entry[] = [
  user('12:26', 'arranca la 0181', { gitBranch: 'develop' }),
  user('12:26', '<system-reminder>contexto</system-reminder>', { isMeta: true, gitBranch: 'develop' }),
  agent('12:27', 'c1', 'develop'),
  agent('12:40', 'c2'),
  user('12:58', 'sí'),
  agent('13:05', 'c3', branch, [{ type: 'tool_use', id: 't1', name: 'Bash', input: {} }]),
  toolResult('13:06', 't1'),
  agent('13:07', 'c4'),
  user('13:10', '<task-notification>sujeto terminado</task-notification>'),
  askUser('13:28', 'q1'),
  toolResult('13:30', 'q1'),
  agent('13:35', 'c6'),
];

const secondSession: Entry[] = [user('15:00', 'sigue'), agent('15:30', 'd1')];

function writeSession(worktree: Worktree, name: string, entries: Entry[]): void {
  writeFileSync(join(worktree.folder, `${name}.jsonl`), entries.map((entry) => JSON.stringify(entry)).join('\n'));
}

function worktreeWith(sessions: Record<string, Entry[]>): Worktree {
  const worktree = newWorktree([], null);
  for (const [name, entries] of Object.entries(sessions)) writeSession(worktree, name, entries);
  return worktree;
}

async function realLine(worktree: Worktree): Promise<string | undefined> {
  const { output } = await measure(worktree, ['--branch', branch]);
  return line(output, 'Esfuerzo real');
}

describe('session tokens mide el esfuerzo real', () => {
  it('descuenta del reloj las esperas al dev-lead', async () => {
    expect(await realLine(worktreeWith({ s5: firstSession }))).toBe(
      '- Esfuerzo real: 0,82 h — reloj de la sesión 1,15 h desde 2026-10-14T12:26Z, sin 20 min de espera al dev-lead (2 esperas)',
    );
  });

  it('es la cuarta línea del informe', async () => {
    const { output } = await measure(worktreeWith({ s5: firstSession }), ['--branch', branch]);
    const labels = output.split('\n').filter((text) => text.startsWith('- ')).map((text) => text.split(':')[0]);
    expect(labels).toEqual(['- Tokens del hilo', '- Tokens de subagentes', '- Coste de la sesión', '- Esfuerzo real']);
  });

  it('suma dos sesiones de la rama desde el inicio de la más antigua', async () => {
    expect(await realLine(worktreeWith({ s5: firstSession, s6: secondSession }))).toBe(
      '- Esfuerzo real: 1,32 h — reloj de 2 sesiones 1,65 h desde 2026-10-14T12:26Z, sin 20 min de espera al dev-lead (2 esperas)',
    );
  });

  it('no cuenta una sesión sin respuestas de la rama', async () => {
    const otherBranch = [user('16:00', 'otra cosa', { gitBranch: 'develop' }), agent('16:45', 'e1', 'develop')];
    expect(await realLine(worktreeWith({ s5: firstSession, s7: otherBranch }))).toContain('reloj de la sesión 1,15 h');
  });

  it('el primer mensaje no es espera', async () => {
    expect(await realLine(worktreeWith({ s8: [user('10:00', 'hola'), agent('10:05', 'f1')] }))).toBe(
      '- Esfuerzo real: 0,08 h — reloj de la sesión 0,08 h desde 2026-10-14T10:00Z, sin 0 min de espera al dev-lead (0 esperas)',
    );
  });

  it('ignora una pregunta sin respuesta', async () => {
    const cut = [user('10:00', 'hola'), agent('10:05', 'f1'), askUser('10:06', 'q9')];
    expect(await realLine(worktreeWith({ s9: cut }))).toContain('sin 0 min de espera al dev-lead (0 esperas)');
  });

  it('da el esfuerzo real en --json', async () => {
    const worktree = worktreeWith({ s5: firstSession });
    const io = memoryIo();
    await run(['session', 'tokens', '--path', worktree.path, '--projects-root', worktree.projects, '--branch', branch, '--json'], io);
    expect(JSON.parse(io.stdout[0]!).real).toEqual({
      measured: true,
      hours: 0.82,
      clockHours: 1.15,
      start: '2026-10-14T12:26Z',
      waitMinutes: 20,
      waits: 2,
    });
  });
});
