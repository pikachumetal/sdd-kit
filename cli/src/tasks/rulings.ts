import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const MARKERS = ['Ruling:', 'minor (deferred)'];

export function listRulings(workspace: string): string[] {
  const ledger = join(workspace, 'progress.md');
  if (!existsSync(ledger)) return [];
  const lines = readFileSync(ledger, 'utf8').split(/\r?\n/);
  return lines.filter((line) => MARKERS.some((marker) => line.includes(marker)));
}
