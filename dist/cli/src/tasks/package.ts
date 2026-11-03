import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { DomainError } from '../cli/args.ts';
import { git } from '../git/git.ts';
import { requireRevision } from './revision.ts';
import { workspaceFor } from './workspace.ts';

export interface PackageRequest {
  plan: string;
  base: string;
  head: string;
  out?: string;
}

async function output(args: string[]): Promise<string> {
  return (await git(process.cwd(), args)).stdout;
}

async function checkRange(range: { base: string; head: string }): Promise<number> {
  const { base, head } = range;
  const ancestor = await git(process.cwd(), ['merge-base', '--is-ancestor', base, head]);
  if (ancestor.code !== 0) throw new DomainError(`HEAD is not a descendant of BASE: ${base}..${head}`);
  const count = Number((await output(['rev-list', '--count', `${base}..${head}`])).trim());
  if (count === 0) throw new DomainError(`empty commit range: ${base}..${head}`);
  return count;
}

async function defaultPath(request: PackageRequest): Promise<string> {
  const short = async (rev: string) => (await output(['rev-parse', '--short', rev])).trim();
  const name = `review-${await short(request.base)}..${await short(request.head)}.diff`;
  return join(await workspaceFor(request.plan), name);
}

async function packageBody(range: string): Promise<string> {
  const sections: [string, string[]][] = [
    ['Commits', ['log', '--oneline', range]],
    ['Files changed', ['diff', '--stat', range]],
    ['Diff', ['diff', '-U10', range]],
  ];
  const lines = [`# Review package: ${range}`, ''];
  for (const [title, args] of sections) lines.push(`## ${title}`, (await output(args)).replace(/\n$/, ''), '');
  return lines.join('\n');
}

export async function writePackage(request: PackageRequest): Promise<{ path: string; commits: number; bytes: number }> {
  const { base, head } = request;
  await requireRevision(base, 'BASE');
  await requireRevision(head, 'HEAD');
  const commits = await checkRange({ base, head });
  const path = request.out ?? (await defaultPath(request));
  const body = await packageBody(`${base}..${head}`);
  writeFileSync(path, body);
  return { path, commits, bytes: Buffer.byteLength(body) };
}
