import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';
import { compare } from '../cli/records.ts';

function homeConfigDirs(): string[] {
  const home = homedir();
  try {
    return readdirSync(home, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && /^\.claude(-.*)?$/i.test(entry.name))
      .map((entry) => join(home, entry.name));
  } catch {
    return [];
  }
}

function uniqueByPath(paths: string[]): string[] {
  const comparable = (path: string) => (process.platform === 'win32' ? path.toLowerCase() : path);
  const byKey = new Map(paths.map((path) => [comparable(path), path]));
  return [...byKey.entries()].sort(([first], [second]) => compare(first, second)).map(([, path]) => path);
}

// Con dos cuentas (CLAUDE_CONFIG_DIR en ~/.claude-<cuenta>), las sesiones de un worktree quedan repartidas entre configuraciones.
export function defaultProjectsRoots(): string[] {
  const fromEnv = process.env.CLAUDE_CONFIG_DIR ? [process.env.CLAUDE_CONFIG_DIR] : [];
  const configs = [...fromEnv, ...homeConfigDirs()].map((config) => resolve(config));
  return uniqueByPath(configs).map((config) => join(config, 'projects'));
}

export function transcriptFolders(worktreePath: string, roots: string[]): string[] {
  const name = worktreePath.replace(/[^A-Za-z0-9]/g, '-');
  return roots.map((root) => join(root, name)).filter((folder) => existsSync(folder));
}
