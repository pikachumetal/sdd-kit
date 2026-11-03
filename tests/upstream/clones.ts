// Los clones de las fuentes en SDD_UPSTREAM_DIR, por repo de GitHub.
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { git } from '../../cli/src/git/git.ts';

function repoOfUrl(url: string): string | null {
  const match = /github\.com[/:]([^/\s)]+)\/([^/\s)]+?)(?:\.git)?(?:[)\s]|$)/i.exec(url);
  return match ? `${match[1]}/${match[2]}`.toLowerCase() : null;
}

// Se lee la configuración cruda: `git remote get-url` aplicaría `url.<base>.insteadOf`.
async function originRepo(clone: string): Promise<string | null> {
  const result = await git(clone, ['config', '--get', 'remote.origin.url']);
  return result.code === 0 ? repoOfUrl(result.stdout.trim()) : null;
}

export async function findClones(dir: string): Promise<Map<string, string>> {
  const clones = new Map<string, string>();
  const entries = existsSync(dir) ? readdirSync(dir, { withFileTypes: true }) : [];
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (!entry.isDirectory() || !existsSync(join(path, '.git'))) continue;
    const repo = await originRepo(path);
    if (repo) clones.set(repo, path);
  }
  return clones;
}
