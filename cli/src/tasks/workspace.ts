import { existsSync, mkdirSync, readFileSync, realpathSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, relative, resolve, sep } from 'node:path';
import { UsageError } from '../cli/args.ts';
import { toplevel } from '../git/git.ts';

interface Claim {
  planId: string;
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
  return { planId: (inRepo ? rel : absolute).split(sep).join('/'), parent: basename(planDir) };
}

function owns(dir: string, planId: string): boolean {
  const marker = join(dir, 'plan-path');
  if (existsSync(marker)) return readFileSync(marker, 'utf8').replace(/\r?\n$/, '') === planId;
  mkdirSync(dir, { recursive: true });
  writeFileSync(marker, `${planId}\n`);
  return true;
}

function chooseDirectory(base: string, slug: string, claim: Claim): string {
  const candidates = [slug, `${slug}-${claim.parent}`];
  for (const name of candidates) if (owns(join(base, name), claim.planId)) return join(base, name);
  for (let n = 2; ; n++) if (owns(join(base, `${candidates[1]}-${n}`), claim.planId)) return join(base, `${candidates[1]}-${n}`);
}

export async function workspaceFor(plan: string): Promise<string> {
  planFile(plan);
  const slug = slugOf(plan);
  const root = await toplevel(process.cwd());
  if (root === null) throw new UsageError('fatal: not a git repository');
  const base = join(root, '.superpowers', 'sdd');
  const dir = chooseDirectory(base, slug, planIdentity(plan, root));
  writeFileSync(join(base, '.gitignore'), '*\n');
  return dir;
}
