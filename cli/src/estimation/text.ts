import { readFileSync } from 'node:fs';

export const MISSING = '—';

export function readText(file: string): string {
  return readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
}
