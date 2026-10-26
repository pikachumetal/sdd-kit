import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { DomainError, UsageError } from '../cli/args.ts';
import { workspaceFor } from './workspace.ts';

export interface BriefRequest {
  plan: string;
  task: string;
  out?: string;
}

export function extractTask(planText: string, task: string): string[] {
  const heading = new RegExp(`^#+[ \t]+Task[ \t]+${task}([^0-9]|$)`);
  const anyTask = /^#+[ \t]+Task[ \t]+[0-9]+/;
  const lines = planText.split('\n');
  if (lines[lines.length - 1] === '') lines.pop();
  const picked: string[] = [];
  let inFence = false;
  let inTask = false;
  for (const line of lines) {
    if (line.startsWith('```')) inFence = !inFence;
    if (!inFence && anyTask.test(line)) inTask = heading.test(line);
    if (inTask) picked.push(line);
  }
  return picked;
}

function readPlan(plan: string): string {
  try {
    return readFileSync(plan, 'utf8').replace(/\r\n/g, '\n');
  } catch {
    throw new UsageError(`no such plan file: ${plan}`);
  }
}

const FRONTMATTER = /^---\n([\s\S]*?)\n---(?:\n|$)/;
const LITE_MODE = /^mode:[ \t]*lite\b/m;

export function isLiteSpec(text: string): boolean {
  const frontmatter = FRONTMATTER.exec(text.replace(/\r\n/g, '\n'))?.[1];
  return frontmatter !== undefined && LITE_MODE.test(frontmatter);
}

function briefLines(text: string, task: string): string[] {
  if (!isLiteSpec(text)) return extractTask(text, task);
  const lines = text.split('\n');
  if (lines.at(-1) === '') lines.pop();
  return lines;
}

export async function writeBrief(request: BriefRequest): Promise<{ path: string; lines: number }> {
  const { plan, task } = request;
  const path = request.out ?? join(await workspaceFor(plan), `task-${task}-brief.md`);
  const picked = briefLines(readPlan(plan), task);
  if (picked.length === 0) throw new DomainError(`task ${task} not found in ${plan} (no heading matching 'Task ${task}')`);
  writeFileSync(path, `${picked.join('\n')}\n`);
  return { path, lines: picked.length };
}
