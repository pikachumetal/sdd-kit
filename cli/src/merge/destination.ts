import { existsSync } from 'node:fs';
import { basename } from 'node:path';
import { DomainError } from '../cli/args.ts';
import { git, gitLines, worktrees, type Worktree } from '../git/git.ts';
import { destinationExits } from './exits.ts';
import { freeTempFolder, withWorktreeFolder } from './temp-worktree.ts';

export interface DestinationRequest {
  projectRoot: string;
  into: string;
  branch: string;
  warn: (message: string) => void;
  folder?: string;
}

function changedFile(statusLine: string): string {
  const path = statusLine.slice(3);
  return path.includes(' -> ') ? path.split(' -> ')[1] : path;
}

async function assertClean(path: string, into: string): Promise<void> {
  const status = await gitLines(path, ['status', '--porcelain']);
  if (status.length === 0) return;
  const untracked = status.filter((line) => line.startsWith('??')).map(changedFile);
  const stat = await gitLines(path, ['diff', '--stat', 'HEAD']);
  const message = [
    `destino sacado: el checkout de '${into}' en '${path}' tiene cambios sin commitear; el merge se haría encima de ellos, así que no se toca.`,
    ...stat,
    ...(untracked.length > 0 ? [`sin seguimiento: ${untracked.join(', ')}`] : []),
    ...destinationExits(path, status.map(changedFile)),
  ];
  throw new DomainError(message.join('\n'));
}

async function checkedOut(projectRoot: string, into: string): Promise<Worktree | undefined> {
  return (await worktrees(projectRoot)).find((entry) => entry.branch === into && existsSync(entry.path));
}

const tempFolder = ({ branch, folder }: DestinationRequest) => folder ?? `merge-${basename(branch)}`;

export async function withDestination<T>(request: DestinationRequest, body: (path: string) => Promise<T>): Promise<T> {
  const { projectRoot, into, warn } = request;
  await git(projectRoot, ['worktree', 'prune']);
  const found = await checkedOut(projectRoot, into);
  if (found === undefined) return withWorktreeFolder(projectRoot, { branch: into, folder: tempFolder(request), warn }, body);
  await assertClean(found.path, into);
  return body(found.path);
}

export async function checkDestination(request: DestinationRequest): Promise<string> {
  const { projectRoot, into } = request;
  const found = await checkedOut(projectRoot, into);
  if (found === undefined) return `destino: listo: '${into}' irá en el worktree temporal '${await freeTempFolder(projectRoot, tempFolder(request))}'`;
  await assertClean(found.path, into);
  return `destino: listo: '${into}' sacado en '${found.path}', sin cambios`;
}
