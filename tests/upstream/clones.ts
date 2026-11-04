// Lo común de las órdenes que leen las fuentes: los clones de SDD_UPSTREAM_DIR por repo de GitHub, lo que hay en un tag y la salida.
import { existsSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { git } from '../../cli/src/git/git.ts';

export const DEFAULT_REGISTRY = resolve(import.meta.dirname, '../../upstream.json');
export const MISSING_UPSTREAM_DIR = 'Falta SDD_UPSTREAM_DIR: la carpeta con los clones de las fuentes vigiladas.';

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

export async function showAt(clone: string, version: string, path: string): Promise<string | null> {
  const result = await git(clone, ['show', `${version}:${path}`]);
  return result.code === 0 ? result.stdout : null;
}

export async function hasCommit(clone: string, version: string): Promise<boolean> {
  return (await git(clone, ['cat-file', '-e', `${version}^{commit}`])).code === 0;
}

export function report(lines: string[], code = 1): number {
  for (const line of lines) console.log(line);
  return code;
}
