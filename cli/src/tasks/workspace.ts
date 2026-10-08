import { existsSync, mkdirSync, readFileSync, realpathSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { UsageError } from '../cli/args.ts';
import { toplevel } from '../git/git.ts';

interface Claim {
  planId: string;
  absolute: string;
  root: string;
  parent: string;
}

function planFile(plan: string): string {
  if (!existsSync(plan) || !statSync(plan).isFile()) throw new UsageError(`no such plan file: ${plan}`);
  return plan;
}

function slugOf(plan: string): string {
  const slug = basename(plan, '.md');
  if (slug === '' || slug === '.' || slug === '..') throw new UsageError(`cannot derive a workspace name from: ${plan}`);
  return slug;
}

function planIdentity(plan: string, root: string): Claim {
  const planDir = realpathSync.native(dirname(resolve(plan)));
  const absolute = join(planDir, basename(plan));
  const rel = relative(realpathSync.native(root), absolute);
  const inRepo = rel !== '' && !rel.startsWith('..') && resolve(rel) !== rel;
  return { planId: (inRepo ? rel : absolute).split(sep).join('/'), absolute, root: realpathSync.native(root), parent: basename(planDir) };
}

const MSYS_DRIVE = /^\/([a-zA-Z])\//;

function canonicalSpelling(spelling: string, root: string): string {
  const slashed = spelling.trim().replace(/\\/g, '/').replace(MSYS_DRIVE, (_, drive: string) => `${drive.toUpperCase()}:/`);
  const absolute = isAbsolute(slashed) ? slashed : join(root, slashed);
  const normalized = resolve(absolute).split(sep).join('/');
  return process.platform === 'win32' ? normalized.toLowerCase() : normalized;
}

function namesSamePlan(marker: string, claim: Claim): boolean {
  return canonicalSpelling(marker, claim.root) === canonicalSpelling(claim.absolute, claim.root);
}

function owns(dir: string, claim: Claim): boolean {
  const marker = join(dir, 'plan-path');
  if (existsSync(marker)) return namesSamePlan(readFileSync(marker, 'utf8'), claim);
  mkdirSync(dir, { recursive: true });
  writeFileSync(marker, `${claim.planId}\n`);
  return true;
}

function candidate(base: string, slug: string, claim: Claim, index: number): string {
  if (index === 0) return join(base, slug);
  if (index === 1) return join(base, `${slug}-${claim.parent}`);
  return join(base, `${slug}-${claim.parent}-${index}`);
}

function chooseDirectory(base: string, slug: string, claim: Claim): string {
  for (let index = 0; ; index++) {
    const dir = candidate(base, slug, claim, index);
    if (owns(dir, claim)) return dir;
  }
}

async function planContext(plan: string): Promise<{ base: string; slug: string; claim: Claim }> {
  planFile(plan);
  const root = await toplevel(process.cwd());
  if (root === null) throw new UsageError('fatal: not a git repository');
  return { base: join(root, '.superpowers', 'sdd'), slug: slugOf(plan), claim: planIdentity(plan, root) };
}

export async function workspaceFor(plan: string): Promise<string> {
  const { base, slug, claim } = await planContext(plan);
  const dir = chooseDirectory(base, slug, claim);
  writeFileSync(join(base, '.gitignore'), '*\n');
  return dir;
}

export async function existingWorkspace(plan: string): Promise<string | null> {
  const { base, slug, claim } = await planContext(plan);
  for (let index = 0; ; index++) {
    const dir = candidate(base, slug, claim, index);
    const marker = join(dir, 'plan-path');
    if (!existsSync(marker)) return null;
    if (namesSamePlan(readFileSync(marker, 'utf8'), claim)) return dir;
  }
}
