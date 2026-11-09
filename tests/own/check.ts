// Uso: node tests/own/check.ts (moon run kit:own). Las comprobaciones de las skills propias sobre lo que viaja en dist/, leído de la fuente.
import { join, resolve } from 'node:path';
import { listSources } from '../../build/dist.ts';
import { BuildError } from '../../build/errors.ts';
import { readRegistry } from '../../build/sources.ts';
import { formatProblem } from '../copies/annotated.ts';
import { exceptionProblems } from './exceptions.ts';
import { skillLines } from './kit-text.ts';
import { repeatedLines } from './repeated.ts';
import { spanishProblems } from './spanish.ts';

export interface OwnReport {
  code: number;
  lines: string[];
}

export function ownReport(repoRoot: string, files: string[]): OwnReport {
  const registry = readRegistry(join(repoRoot, 'upstream.json'));
  const lines = skillLines(repoRoot, files, registry);
  const repeated = repeatedLines(lines);
  const problems = [...exceptionProblems(lines), ...spanishProblems(lines)];
  if (repeated.length + problems.length === 0) return { code: 0, lines: [`Skills al día: ${new Set(lines.map((line) => line.file)).size} ficheros.`] };
  return { code: 1, lines: [...repeated, ...problems.map(formatProblem)] };
}

export async function checkOwn(repoRoot: string): Promise<OwnReport> {
  return ownReport(repoRoot, await listSources(repoRoot));
}

if (resolve(process.argv[1] ?? '') === import.meta.filename) {
  try {
    const { code, lines } = await checkOwn(resolve(import.meta.dirname, '../..'));
    for (const line of lines) (code === 0 ? console.log : console.error)(line);
    process.exitCode = code;
  } catch (error) {
    if (!(error instanceof BuildError)) throw error;
    console.error(error.message);
    process.exitCode = 1;
  }
}
