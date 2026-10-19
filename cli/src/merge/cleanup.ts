import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { DomainError } from '../cli/args.ts';
import { git } from '../git/git.ts';
import { duplicateIdWarnings } from '../roadmap/duplicates.ts';
import { dedupeNewRows, repeatedIdentities } from './keyed.ts';
import { KEYED_REGISTRIES } from './registries.ts';

type Report = (line: string) => void;

const ROADMAPS = ['.docs/sdd/roadmap.md', 'ROADMAP.md'];
const warnedId = (warning: string) => /«(.+?)»/.exec(warning)?.[1] ?? warning;

async function linesAt(worktree: string, revision: string, file: string): Promise<string[]> {
  const shown = await git(worktree, ['show', `${revision}:${file}`]);
  return shown.code === 0 ? shown.stdout.split(/\r?\n/) : [];
}

function newRoadmapWarnings(file: string, lines: string[], before: string[], reported: string[]): string[] {
  const old = new Set([...duplicateIdWarnings(before).map(warnedId), ...reported]);
  return duplicateIdWarnings(lines).filter((warning) => !old.has(warnedId(warning))).map((warning) => `${file}: ${warning}`);
}

async function cleanFile(worktree: string, before: string, file: string, report: Report): Promise<string[]> {
  const path = join(worktree, file);
  if (!existsSync(path)) return [];
  const content = readFileSync(path, 'utf8');
  const old = await linesAt(worktree, before, file);
  const { lines, duplicates, removed } = dedupeNewRows(content.split(/\r?\n/), repeatedIdentities(old));
  duplicates.forEach((id) => report(`registros: dos filas distintas con el id '${id}' en ${file}; se quedan las dos, revísalas`));
  if (ROADMAPS.includes(file)) newRoadmapWarnings(file, lines, old, duplicates).forEach(report);
  if (removed.length > 0) writeFileSync(path, lines.join(content.includes('\r\n') ? '\r\n' : '\n'), 'utf8');
  return removed;
}

// La limpieza va en un commit propio: el merge de --sync cae en la rama de la feature, que puede estar publicada.
export async function cleanRegistries(worktree: string, before: string, report: Report): Promise<void> {
  const removed: string[] = [];
  for (const file of KEYED_REGISTRIES) removed.push(...(await cleanFile(worktree, before, file, report)));
  if (removed.length === 0) return;
  await git(worktree, ['add', '--', ...KEYED_REGISTRIES.filter((file) => existsSync(join(worktree, file)))]);
  const body = `Filas: ${[...new Set(removed)].join(', ')}.`;
  const committed = await git(worktree, ['commit', '-m', 'docs(registros): quita las filas repetidas del merge', '-m', body]);
  if (committed.code !== 0) throw new DomainError('registros: no se pudo commitear la limpieza de filas repetidas');
}
