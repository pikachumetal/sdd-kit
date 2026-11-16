import { describe, it, expect } from 'vitest';
import { breakdown, kitEvents, phaseStarts, type Commit } from '../../src/session/phases.ts';
import type { Timeline, ToolCall } from '../../src/session/clock.ts';

const HOUR = 3_600_000;
const MINUTE = 60_000;
const at = (minutes: number): number => minutes * MINUTE;

function call(name: string, minute: number, input: Record<string, unknown> = {}): ToolCall {
  return { name, input, from: at(minute), to: at(minute) };
}

const skill = (name: string, minute: number): ToolCall => call('Skill', minute, { skill: name });
const task = (verb: 'start' | 'done', number: number, minute: number): ToolCall =>
  call('Bash', minute, { command: `node cli/bin/sdd.js task ${verb} "$P" ${number}` });

function timeline(calls: ToolCall[], last: number, spans: Partial<Timeline> = {}): Timeline {
  return { from: 0, to: at(last), waitSpans: [], idleSpans: [], runSpans: [], calls, ...spans };
}

const noCommits: Commit[] = [];
const fullFlow = [skill('sdd-kit:sdd-propose', 0), skill('sdd-kit:sdd-implement', 10), task('start', 1, 12), task('done', 1, 25), skill('sdd-kit:sdd-verify', 30), skill('sdd-kit:sdd-archive', 40)];
const startsOf = (calls: ToolCall[], commits = noCommits) => phaseStarts(kitEvents([timeline(calls, 60)], commits));

describe('fronteras de fase', () => {
  it('abre cada fase con su evento', () => {
    const { implementacion, revision, cierre } = startsOf(fullFlow);
    expect([implementacion, revision, cierre]).toEqual([at(10), at(30), at(40)]);
  });

  it('el commit de apertura abre la implementación si va antes que sdd-implement', () => {
    expect(startsOf(fullFlow, [{ time: at(8), closing: false }]).implementacion).toBe(at(8));
  });

  it('las fases no retroceden con un sdd-verify tras el cierre', () => {
    const { revision, cierre } = startsOf([...fullFlow, skill('sdd-kit:sdd-verify', 50)]);
    expect([revision, cierre]).toEqual([at(30), at(40)]);
  });

  it('un sdd-verify con un sdd task start detrás no abre la revisión', () => {
    expect(startsOf([skill('sdd-kit:sdd-verify', 5), task('start', 1, 12)]).revision).toBeNull();
  });

  it('sdd-retro abre el cierre', () => {
    expect(startsOf([skill('sdd-kit:sdd-verify', 30), skill('sdd-kit:sdd-retro', 45)]).cierre).toBe(at(45));
  });

  it('un cierre anterior a la implementación no la adelanta', () => {
    const { implementacion, cierre } = startsOf([skill('sdd-kit:sdd-retro', 5), skill('sdd-kit:sdd-implement', 10), skill('sdd-kit:sdd-archive', 40)]);
    expect([implementacion, cierre]).toEqual([at(10), at(40)]);
  });

  it.each([
    'git commit -m "sdd task start plan 9"',
    'echo sdd task start plan 9',
  ])('%s no es un evento de task', (command) => {
    expect(startsOf([call('Bash', 5, { command })]).implementacion).toBeNull();
  });

  it('el commit de cierre solo abre el cierre si es el evento más temprano', () => {
    expect(startsOf([skill('sdd-kit:sdd-verify', 30)], [{ time: at(50), closing: true }]).cierre).toBe(at(50));
    expect(startsOf(fullFlow, [{ time: at(50), closing: true }]).cierre).toBe(at(40));
  });
});

describe('reparto por fase', () => {
  const phase = (name: string, line: Timeline, tasksInPlan = 0, commits = noCommits) => {
    const phases = breakdown([line], kitEvents([line], commits), tasksInPlan);
    return phases.find((item) => item.name === name)!;
  };

  it('agente es el tramo de la fase menos la espera, el hueco y la ejecución', () => {
    const line = timeline(fullFlow, 60, { runSpans: [{ from: at(12), to: at(20) }], waitSpans: [{ from: at(21), to: at(24) }] });
    const { agentSeconds, execSeconds, waitSeconds, idleSeconds } = phase('implementacion', line);
    expect([execSeconds, waitSeconds, idleSeconds, agentSeconds]).toEqual([480, 180, 0, 1200 - 480 - 180]);
  });

  it('solo implementacion no es ceremonia', () => {
    const phases = breakdown([timeline(fullFlow, 60)], kitEvents([timeline(fullFlow, 60)], noCommits), 0);
    expect(phases.map((item) => [item.name, item.ceremony])).toEqual([['apertura', true], ['implementacion', false], ['revision', true], ['cierre', true]]);
  });

  it('parte un tramo entre dos fases', () => {
    const line = timeline(fullFlow, 60, { runSpans: [{ from: at(28), to: at(35) }] });
    expect([phase('implementacion', line).execSeconds, phase('revision', line).execSeconds]).toEqual([120, 300]);
  });

  it('una espera dentro de una ejecución cuenta solo como espera', () => {
    const line = timeline(fullFlow, 60, { runSpans: [{ from: at(12), to: at(20) }], waitSpans: [{ from: at(14), to: at(16) }] });
    const { execSeconds, waitSeconds } = phase('implementacion', line);
    expect([execSeconds, waitSeconds]).toEqual([360, 120]);
  });

  it('una fase sin eventos da null y su tiempo queda en la anterior', () => {
    const calls = [skill('sdd-kit:sdd-propose', 0), skill('sdd-kit:sdd-implement', 10), skill('sdd-kit:sdd-verify', 30)];
    const line = timeline(calls, 60);
    const closing = phase('cierre', line);
    expect(closing).toMatchObject({ measured: false, agentSeconds: null, execSeconds: null, waitSeconds: null, idleSeconds: null, reason: 'sin eventos: su tiempo queda en revision' });
    expect(phase('revision', line).agentSeconds).toBe(1800);
  });

  it('las tasks salen de sdd task start y done marca done', () => {
    const calls = [skill('sdd-kit:sdd-implement', 0), task('start', 1, 5), task('done', 1, 15), task('start', 2, 20), skill('sdd-kit:sdd-verify', 40)];
    const { tasks } = phase('implementacion', timeline(calls, 60));
    expect(tasks).toEqual([
      { task: 1, source: 'events', done: true, agentSeconds: 900, execSeconds: 0, waitSeconds: 0 },
      { task: 2, source: 'events', done: false, agentSeconds: 1200, execSeconds: 0, waitSeconds: 0 },
    ]);
  });

  it('reconoce varias órdenes de task en un mismo comando', () => {
    const chained = call('Bash', 5, { command: 'sdd task done "$P" 1 abc -- npx vitest; sdd task start "$P" 2' });
    const { tasks } = phase('implementacion', timeline([skill('sdd-kit:sdd-implement', 0), task('start', 1, 1), chained], 60));
    expect(tasks!.map((item) => item.task)).toEqual([1, 2]);
  });

  it('sin eventos de task, tasks salen de los commits si coinciden con las del plan', () => {
    const commits: Commit[] = [{ time: at(5), closing: false }, { time: at(20), closing: false }, { time: at(40), closing: false }];
    const calls = [skill('sdd-kit:sdd-implement', 5), skill('sdd-kit:sdd-verify', 50)];
    const { tasks } = phase('implementacion', timeline(calls, 60), 2, commits);
    expect(tasks!.map((item) => [item.task, item.source, item.done])).toEqual([[1, 'commits', true], [2, 'commits', true]]);
  });

  it('las tasks de los commits no pasan del final de la implementación', () => {
    const commits: Commit[] = [{ time: at(5), closing: false }, { time: at(20), closing: false }, { time: at(55), closing: false }];
    const calls = [skill('sdd-kit:sdd-implement', 5), skill('sdd-kit:sdd-verify', 50)];
    const { tasks } = phase('implementacion', timeline(calls, 60), 2, commits);
    expect(tasks![1]!.agentSeconds).toBe(1800);
  });

  it('si no coinciden, no hay tasks', () => {
    const commits: Commit[] = [{ time: at(5), closing: false }, { time: at(20), closing: false }];
    const calls = [skill('sdd-kit:sdd-implement', 5), skill('sdd-kit:sdd-verify', 50)];
    expect(phase('implementacion', timeline(calls, 60), 3, commits).tasks).toBeUndefined();
  });

  it('suma el reloj de dos transcripts', () => {
    const first = timeline(fullFlow, 60);
    const second: Timeline = { ...timeline([], 0), from: 2 * HOUR, to: 3 * HOUR };
    const phases = breakdown([first, second], kitEvents([first, second], noCommits), 0);
    const total = phases.reduce((sum, item) => sum + (item.agentSeconds ?? 0), 0);
    expect(total).toBe(7200);
  });
});
