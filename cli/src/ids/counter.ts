import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import type { Io } from '../cli/io.ts';
import { commonDir, samePath, toplevel } from '../git/git.ts';

export function formatId(number: number): string {
  return String(number).padStart(4, '0');
}

function counterName(top: string, root: string): string {
  if (samePath(top, root)) return 'sdd-ids';
  const subfolder = relative(top, root).replace(/[\\/]+$/, '');
  return `sdd-ids-${subfolder.replace(/[\\/:]+/g, '-')}`;
}

export async function counterPath(root: string): Promise<string | null> {
  const top = await toplevel(root);
  if (top === null) return null;
  return join(await commonDir(root), counterName(top, root));
}

export function readCounter(path: string | null, io: Io): number {
  if (path === null || !existsSync(path)) return 0;
  const text = readFileSync(path, 'utf8').trim();
  if (/^[0-9]{1,4}$/.test(text)) return Number(text);
  io.err(`El contador de ids '${path}' no se puede leer ('${text}'): se reinicializa con el escaneo.`);
  return 0;
}

export function writeCounter(path: string, last: number): void {
  writeFileSync(path, `${formatId(last)}\n`);
}
