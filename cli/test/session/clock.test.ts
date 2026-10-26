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

const toolUse = (time: string, id: string, name = 'Bash'): Entry => agent(time, `use-${id}`, branch, [{ type: 'tool_use', id, name, input: {} }]);

const closing = (entry: Entry, reason = 'end_turn'): Entry => ({ ...entry, message: { ...(entry.message as Entry), stop_reason: reason } });

const onDay = (entry: Entry, day: string): Entry => ({ ...entry, timestamp: String(entry.timestamp).replace('2026-10-14', day) });

const notification = (time: string): Entry => user(time, '<task-notification>tarea terminada</task-notification>');

const firstSession: Entry[] = [
  user('12:26', 'arranca la 0181', { gitBranch: 'develop' }),
  user('12:26', '<system-reminder>contexto</system-reminder>', { isMeta: true, gitBranch: 'develop' }),
  agent('12:27', 'c1', 'develop'),
  closing(agent('12:40', 'c2')),
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
      idleMinutes: 0,
      idleGaps: 0,
    });
  });

  it('un mensaje tecleado con el turno abierto no es espera', async () => {
    const midTurn = [toolUse('10:00', 't2'), user('10:05', 'nos vemos en la validación'), toolResult('10:06', 't2'), closing(agent('10:20', 'g1'))];
    expect(await realLine(worktreeWith({ s10: midTurn }))).toBe(
      '- Esfuerzo real: 0,33 h — reloj de la sesión 0,33 h desde 2026-10-14T10:00Z, sin 0 min de espera al dev-lead (0 esperas)',
    );
  });

  it('un hueco dentro de una espera cuenta solo como espera', async () => {
    const longWait = [closing(agent('10:00', 'h1')), user('11:30', 'sigue'), closing(agent('11:40', 'h2'))];
    expect(await realLine(worktreeWith({ s11: longWait }))).toBe(
      '- Esfuerzo real: 0,17 h — reloj de la sesión 1,67 h desde 2026-10-14T10:00Z, sin 90 min de espera al dev-lead (1 espera)',
    );
  });
});

describe('session tokens: la espera a una tarea en segundo plano es trabajo', () => {
  it('el hueco que acaba en una notificación de tarea no es espera', async () => {
    const background = [user('09:50', 'arranca'), closing(agent('10:00', 'i1')), notification('10:18'), user('10:19', 'ok'), closing(agent('10:30', 'i2'))];
    expect(await realLine(worktreeWith({ s12: background }))).toBe(
      '- Esfuerzo real: 0,67 h — reloj de la sesión 0,67 h desde 2026-10-14T09:50Z, sin 0 min de espera al dev-lead (0 esperas)',
    );
  });

  it('una notificación 133 min después del cierre también es trabajo', async () => {
    const longTask = [closing(agent('10:00', 'j1')), notification('12:13'), closing(agent('12:20', 'j2'))];
    expect(await realLine(worktreeWith({ s13: longTask }))).toBe(
      '- Esfuerzo real: 2,33 h — reloj de la sesión 2,33 h desde 2026-10-14T10:00Z, sin 0 min de espera al dev-lead (0 esperas)',
    );
  });
});

describe('session tokens: la compactación no cierra la espera de un turno', () => {
  it('el resumen de la compactación no es un mensaje tecleado', async () => {
    const compacted = [
      closing(agent('07:33', 'k1')),
      user('08:28', 'This session is being continued from a previous conversation', { isCompactSummary: true }),
      notification('09:46'),
      closing(agent('10:00', 'k2')),
    ];
    expect(await realLine(worktreeWith({ s14: compacted }))).toBe(
      '- Esfuerzo real: 2,45 h — reloj de la sesión 2,45 h desde 2026-10-14T07:33Z, sin 0 min de espera al dev-lead (0 esperas)',
    );
  });
});

describe('session tokens descuenta los huecos sin actividad', () => {
  const night = [
    onDay(toolUse('21:00', 't3'), '2026-10-21'),
    onDay(toolResult('21:01', 't3'), '2026-10-21'),
    onDay(agent('21:02', 'l1'), '2026-10-21'),
    onDay(user('21:03', [{ type: 'text', text: '[Request interrupted by user]' }]), '2026-10-21'),
    onDay(closing(agent('06:48', 'l2', branch, [{ type: 'text', text: 'No response requested.' }]), 'stop_sequence'), '2026-10-22'),
    onDay(user('06:50', 'sigue'), '2026-10-22'),
    onDay(closing(agent('07:00', 'l3')), '2026-10-22'),
  ];

  it('la noche tras una interrupción no cuenta, y la línea lo dice', async () => {
    expect(await realLine(worktreeWith({ s15: night }))).toBe(
      '- Esfuerzo real: 0,22 h — reloj de la sesión 10,00 h desde 2026-10-21T21:00Z, sin 2 min de espera al dev-lead (1 espera), sin 9,75 h sin actividad (1 hueco)',
    );
  });

  it('da los huecos en --json', async () => {
    const worktree = worktreeWith({ s15: night });
    const io = memoryIo();
    await run(['session', 'tokens', '--path', worktree.path, '--projects-root', worktree.projects, '--branch', branch, '--json'], io);
    expect(JSON.parse(io.stdout[0]!).real).toMatchObject({ idleMinutes: 585, idleGaps: 1 });
  });

  it('un subagente de 90 min es una herramienta en curso: su hueco es trabajo', async () => {
    const subagent = [toolUse('10:00', 't4', 'Task'), toolResult('11:30', 't4'), closing(agent('11:31', 'm1'))];
    expect(await realLine(worktreeWith({ s16: subagent }))).toBe(
      '- Esfuerzo real: 1,52 h — reloj de la sesión 1,52 h desde 2026-10-14T10:00Z, sin 0 min de espera al dev-lead (0 esperas)',
    );
  });
});
