import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { planTaskIds } from './brief.ts';

const MARKERS = ['Ruling:', 'minor (deferred)'];

export function listRulings(workspace: string): string[] {
  const ledger = join(workspace, 'progress.md');
  if (!existsSync(ledger)) return [];
  const lines = readFileSync(ledger, 'utf8').split(/\r?\n/);
  // Una fila de la tabla del pre-flight puede nombrar un ruling sin serlo.
  return lines.filter((line) => !line.trimStart().startsWith('|') && MARKERS.some((marker) => line.includes(marker)));
}

// La primera task del plan sin `Task <id>: complete`; null sin ninguna completa o con todas.
// shortcut: no comprueba que la primera línea del ledger nombre este plan (el directorio ya es del plan por `plan-path`); si un workspace hereda el ledger de otro plan, compararla.
export function resumeTask(workspace: string, plan: string): string | null {
  const ledger = join(workspace, 'progress.md');
  if (!existsSync(ledger)) return null;
  const done = new Set([...readFileSync(ledger, 'utf8').matchAll(/^Task (\S+): complete\b/gm)].map((match) => match[1]));
  if (done.size === 0) return null;
  return planTaskIds(plan).find((id) => !done.has(id)) ?? null;
}
