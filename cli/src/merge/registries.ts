import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { generateEstimationLog, writeEstimationLog } from '../estimation/log.ts';
import { git } from '../git/git.ts';

const REGISTRY = /(^|\/)\.docs\/sdd\/(roadmap|changelog|estimation-log)\.md$/i;
const LOG = /estimation-log\.md$/i;
const HUNK = /^<<<<<<< [^\n]*\n(.*?)^\|\|\|\|\|\|\| [^\n]*\n(.*?)^=======\r?\n(.*?)^>>>>>>> [^\n]*(?:\n|(?![\s\S]))/gms;
const MARKER = /^(<<<<<<<|\|\|\|\|\|\|\||=======|>>>>>>>)/m;

async function mergeAddedLines(worktree: string, file: string): Promise<boolean> {
  if ((await git(worktree, ['checkout', '--conflict=diff3', '--', file])).code !== 0) return false;
  const path = join(worktree, file);
  const content = readFileSync(path, 'utf8');
  if ([...content.matchAll(HUNK)].some((match) => match[2] !== '')) return false;
  const merged = content.replace(HUNK, (_all, ours: string, _base: string, theirs: string) => ours + theirs);
  if (MARKER.test(merged)) return false;
  writeFileSync(path, merged, 'utf8');
  return true;
}

function regenerateLog(worktree: string): void {
  const { text, docsPath } = generateEstimationLog(worktree, () => undefined);
  writeEstimationLog(text, join(docsPath, 'estimation-log.md'), () => undefined);
}

export async function resolveRegistryConflicts(worktree: string, conflicted: string[]): Promise<boolean> {
  if (conflicted.some((file) => !REGISTRY.test(file))) return false;
  for (const file of conflicted.filter((name) => !LOG.test(name))) {
    if (!(await mergeAddedLines(worktree, file))) return false;
  }
  if (conflicted.some((file) => LOG.test(file))) regenerateLog(worktree);
  await git(worktree, ['add', '--', ...conflicted]);
  return (await git(worktree, ['commit', '--no-edit'])).code === 0;
}
