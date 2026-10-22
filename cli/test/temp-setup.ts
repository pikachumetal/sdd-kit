import { mkdirSync, mkdtempSync, readdirSync, rmSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const STALE_AFTER_MS = 24 * 60 * 60 * 1000;
const RUN_PREFIX = 'vitest-';
const tempRoot = resolve(import.meta.dirname, '..', '..', '.temp');

// Una pasada que muere no corre el teardown, y el clon principal no se borra nunca.
export function sweepRunFolders(root: string, now: number): void {
  for (const name of readdirSync(root)) {
    const path = join(root, name);
    const stats = name.startsWith(RUN_PREFIX) ? statSync(path, { throwIfNoEntry: false }) : undefined;
    if (stats !== undefined && stats.mtimeMs < now - STALE_AFTER_MS) removeQuietly(path);
  }
}

function removeQuietly(path: string): void {
  try {
    rmSync(path, { recursive: true, force: true, maxRetries: 5 });
  } catch (error) {
    console.warn(`no se pudo borrar ${path}: ${(error as Error).message}`);
  }
}

export default function setup(): () => void {
  mkdirSync(tempRoot, { recursive: true });
  sweepRunFolders(tempRoot, Date.now());
  const runFolder = mkdtempSync(join(tempRoot, RUN_PREFIX));
  process.env.TEMP = runFolder;
  process.env.TMP = runFolder;
  process.env.GIT_CEILING_DIRECTORIES = tempRoot;
  return () => removeQuietly(runFolder);
}
