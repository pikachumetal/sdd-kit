import { mkdirSync, mkdtempSync, rmSync, utimesSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll } from 'vitest';
import { memoryIo } from '../../src/cli/io.ts';
import { run } from '../../src/main.ts';

export const description = 'Revisor final 0095';
export const defaultConfig = { control: { silence: { betweenStepsMinutes: 8, longCommandMinutes: 20 } } };

type Event = Record<string, unknown>;

const dirs: string[] = [];

afterAll(() => {
  dirs.splice(0).forEach((dir) => rmSync(dir, { recursive: true, force: true }));
});

export function tempDir(): string {
  const dir = mkdtempSync(join(tmpdir(), 'sdd-watch-'));
  dirs.push(dir);
  return dir;
}

export interface Setup {
  repo: string;
  projects: string;
  folder: string;
}

export function newWorktree(config: unknown): Setup {
  const base = tempDir();
  const repo = join(base, 'repo');
  const projects = join(base, 'projects');
  mkdirSync(join(repo, '.docs/sdd'), { recursive: true });
  if (config !== null) writeFileSync(join(repo, '.docs/sdd/sdd-kit.json'), JSON.stringify(config));
  const folder = join(projects, repo.replace(/[^A-Za-z0-9]/g, '-'), 's1', 'subagents');
  mkdirSync(folder, { recursive: true });
  return { repo, projects, folder };
}

export function touch(file: string, ageMinutes: number): void {
  const when = new Date(Date.now() - ageMinutes * 60000);
  utimesSync(file, when, when);
}

export function newTranscript(setup: Setup, events: Event[], ageMinutes: number, name = 'agent-t1'): void {
  const file = join(setup.folder, `${name}.jsonl`);
  writeFileSync(file, events.map((event) => JSON.stringify(event)).join('\n') + '\n');
  writeFileSync(join(setup.folder, `${name}.meta.json`), JSON.stringify({ description }));
  touch(file, ageMinutes);
}

export function toolUse(name: string, input: Event, id = 'toolu_last', at: string | null = '2026-09-28T13:26:12.428Z'): Event {
  const event: Event = {
    type: 'assistant',
    message: { id: `msg_${id}`, stop_reason: 'tool_use', usage: { output_tokens: 0 }, content: [{ type: 'tool_use', id, name, input }] },
  };
  if (at !== null) event.timestamp = at;
  return event;
}

export const toolResult = (id: string): Event => ({
  type: 'user',
  timestamp: '2026-09-28T13:26:00.000Z',
  message: { content: [{ type: 'tool_result', tool_use_id: id, content: 'ok' }] },
});

export const hook = (hookEvent: string, toolUseID: string): Event => ({
  type: 'attachment',
  timestamp: '2026-09-28T13:26:00.000Z',
  attachment: { type: 'hook_success', hookEvent, toolUseID },
});

export const readCall = (): Event =>
  toolUse('Read', { file_path: 'C:\\repo\\.superpowers\\sdd\\plan\\review-final-0f264440.diff', offset: 500, limit: 420 });

export const pesterCall = (): Event => toolUse('PowerShell', { command: 'Invoke-Pester tests/' });

export async function watchOnce(setup: Setup, extra: string[] = ['--description', description]): Promise<string[]> {
  const verb = extra.includes('--path') ? 'command' : 'subagent';
  const roots = verb === 'subagent' ? ['--projects-root', setup.projects] : [];
  const io = memoryIo();
  await run(['watch', verb, '--worktree', setup.repo, ...roots, '--once', ...extra], io);
  return io.stdout;
}
