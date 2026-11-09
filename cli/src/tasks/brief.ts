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

const TASK_HEADING = /^(#+)[ \t]+Task[ \t]/;
const ID_BODY = '[A-Za-z0-9]+(?:\\.[A-Za-z0-9]+)*';
const ID_PREFIX = new RegExp(`^${ID_BODY}`);
const WHOLE_ID = new RegExp(`^${ID_BODY}$`);
const TASK_SHAPED_HEADING = /^#+[ \t]+[^ \t]+[ \t]+[A-Za-z0-9.]*[0-9]/;
const MAX_SHAPED = 5;

interface PlanScan {
  picked: string[];
  tasks: number;
  shaped: string[];
  fence: { line: number; hidden: boolean } | null;
  inTask: boolean;
}

export function isTaskId(value: string): boolean {
  return WHOLE_ID.test(value) && /[0-9]/.test(value);
}

class PlanScanner {
  readonly scan: PlanScan = { picked: [], tasks: 0, shaped: [], fence: null, inTask: false };
  private readonly task: string;
  private level = 0;

  constructor(task: string) {
    this.task = task;
  }

  visit(line: string, lineNumber: number): void {
    if (line.startsWith('```')) this.toggleFence(lineNumber);
    else if (this.scan.fence) this.scan.fence.hidden ||= TASK_HEADING.test(line);
    else this.visitOutsideFence(line);
    if (this.scan.inTask) this.scan.picked.push(line);
  }

  private toggleFence(lineNumber: number): void {
    this.scan.fence = this.scan.fence ? null : { line: lineNumber, hidden: false };
  }

  private visitOutsideFence(line: string): void {
    const heading = TASK_HEADING.exec(line);
    const id = heading && ID_PREFIX.exec(line.slice(heading[0].length).trimStart())?.[0];
    if (heading && id && isTaskId(id)) this.enterHeading(heading[1].length, id);
    if (TASK_SHAPED_HEADING.test(line) && this.scan.shaped.length < MAX_SHAPED) this.scan.shaped.push(line);
  }

  private enterHeading(depth: number, id: string): void {
    this.scan.tasks++;
    const extendsTask = id.startsWith(this.task) && /[A-Za-z.]/.test(id[this.task.length] ?? '');
    if (this.scan.inTask && depth > this.level && extendsTask) return;
    this.scan.inTask = id === this.task;
    this.level = depth;
  }
}

function scanPlan(planText: string, task: string): PlanScan {
  const scanner = new PlanScanner(task);
  splitLines(planText).forEach((line, index) => scanner.visit(line, index + 1));
  return scanner.scan;
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

function requireTasksFile(count: number, plan: string): void {
  const tasksFile = join(dirname(resolve(plan)), 'tasks.md');
  if (count > 1 && !existsSync(tasksFile)) {
    throw new DomainError(`plan with ${count} tasks and no tasks.md: write ${tasksFile} before the first task (status and commit per task)`);
  }
}

function unclosedFence(scan: PlanScan, plan: string): string {
  return `el bloque de código abierto en la línea ${scan.fence?.line} de ${plan} no se cierra`;
}

function hidingFence(scan: PlanScan, plan: string): string {
  return `${unclosedFence(scan, plan)} y oculta los encabezados de task que le siguen: ciérralo en el plan y vuelve a lanzarlo`;
}

const TRANSLATED_PLAN_HINT = 'no hay encabezados de task: se escriben con la palabra inglesa «Task» («### Task 1: …») aunque el plan esté en otro idioma. Encabezados con forma de task:';

function notFoundMessage(scan: PlanScan, request: BriefRequest): string {
  const { plan, task } = request;
  const lines: string[] = [];
  if (scan.fence?.hidden) lines.push(hidingFence(scan, plan));
  else if (scan.tasks === 0 && scan.shaped.length > 0) lines.push(TRANSLATED_PLAN_HINT, ...scan.shaped.map((heading) => `  ${heading}`));
  lines.push(`task ${task} not found in ${plan} (no heading matching 'Task ${task}')`);
  return lines.join('\n');
}

function strayFenceWarnings(scan: PlanScan, plan: string): string[] {
  if (!scan.fence || scan.fence.hidden || !scan.inTask) return [];
  return [`${unclosedFence(scan, plan)}; no oculta ningún encabezado de task, así que el brief está completo`];
}

function briefOf(planText: string, request: BriefRequest): { picked: string[]; warnings: string[] } {
  if (isLiteSpec(planText)) return { picked: splitLines(planText), warnings: [] };
  const scan = scanPlan(planText, request.task);
  requireTasksFile(scan.tasks, request.plan);
  if (scan.fence?.hidden && scan.inTask) throw new DomainError(hidingFence(scan, request.plan));
  if (scan.picked.length === 0) throw new DomainError(notFoundMessage(scan, request));
  return { picked: scan.picked, warnings: strayFenceWarnings(scan, request.plan) };
}

export async function writeBrief(request: BriefRequest): Promise<{ path: string; lines: number; warnings: string[] }> {
  const { plan, task } = request;
  const planText = readPlan(plan);
  const path = request.out ?? join(await workspaceFor(plan), `task-${task}-brief.md`);
  const { picked, warnings } = briefOf(planText, request);
  writeFileSync(path, `${picked.join('\n')}\n`);
  return { path, lines: picked.length, warnings };
}
