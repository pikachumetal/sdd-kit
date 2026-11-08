import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { DomainError, UsageError } from '../cli/args.ts';
import { workspaceFor } from './workspace.ts';

export interface BriefRequest {
  plan: string;
  task: string;
  out?: string;
}

function splitLines(text: string): string[] {
  const lines = text.split('\n');
  if (lines.at(-1) === '') lines.pop();
  return lines;
}

const ANY_TASK = /^#+[ \t]+Task[ \t]+[0-9]+/;

function withFenceState(planText: string): { line: string; inFence: boolean }[] {
  let inFence = false;
  return splitLines(planText).map((line) => {
    if (line.startsWith('```')) inFence = !inFence;
    return { line, inFence };
  });
}

export function extractTask(planText: string, task: string): string[] {
  const heading = new RegExp(`^#+[ \t]+Task[ \t]+${task}([^0-9]|$)`);
  const picked: string[] = [];
  let inTask = false;
  for (const { line, inFence } of withFenceState(planText)) {
    if (!inFence && ANY_TASK.test(line)) inTask = heading.test(line);
    if (inTask) picked.push(line);
  }
  return picked;
}

function countTasks(planText: string): number {
  return withFenceState(planText).filter(({ line, inFence }) => !inFence && ANY_TASK.test(line)).length;
}

function readPlan(plan: string): string {
  try {
    return readFileSync(plan, 'utf8').replace(/\r\n/g, '\n');
  } catch {
    throw new UsageError(`no such plan file: ${plan}`);
  }
}

const FRONTMATTER = /^---\n([\s\S]*?)\n---(?:\n|$)/;
const LITE_MODE = /^mode:[ \t]*lite[ \t]*(?:#|$)/m;

export function isLiteSpec(text: string): boolean {
  const frontmatter = FRONTMATTER.exec(text)?.[1];
  return frontmatter !== undefined && LITE_MODE.test(frontmatter);
}

function briefLines(text: string, task: string): string[] {
  return isLiteSpec(text) ? splitLines(text) : extractTask(text, task);
}

function requireTasksFile(planText: string, plan: string): void {
  if (isLiteSpec(planText)) return;
  const count = countTasks(planText);
  const tasksFile = join(dirname(resolve(plan)), 'tasks.md');
  if (count > 1 && !existsSync(tasksFile)) {
    throw new DomainError(`plan with ${count} tasks and no tasks.md: write ${tasksFile} before the first task (status and commit per task)`);
  }
}

export async function writeBrief(request: BriefRequest): Promise<{ path: string; lines: number }> {
  const { plan, task } = request;
  const planText = readPlan(plan);
  const path = request.out ?? join(await workspaceFor(plan), `task-${task}-brief.md`);
  requireTasksFile(planText, plan);
  const picked = briefLines(planText, task);
  if (picked.length === 0) throw new DomainError(`task ${task} not found in ${plan} (no heading matching 'Task ${task}')`);
  writeFileSync(path, `${picked.join('\n')}\n`);
  return { path, lines: picked.length };
}
