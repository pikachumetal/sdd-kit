// Uso: node tests/own/check.ts (moon run kit:own). Las comprobaciones de las skills propias sobre lo que viaja en dist/.
import { join, resolve } from 'node:path';
import { INCLUDE_MARK, listSources } from '../../build/dist.ts';
import { BuildError } from '../../build/errors.ts';
import { kindOf, readRegistry, type Registry } from '../../build/sources.ts';
import { formatProblem, type Problem } from '../copies/annotated.ts';
import { exceptionProblems } from './exceptions.ts';
import { readLf, skillLines } from './kit-text.ts';
import { repeatedLines } from './repeated.ts';
import { spanishProblems } from './spanish.ts';

export interface OwnReport {
  code: number;
  lines: string[];
}

function includeInCopyProblems(repoRoot: string, files: string[], registry: Registry): Problem[] {
  const copies = files.filter((file) => file.endsWith('.md') && ['copy', 'pending'].includes(kindOf(registry, file) ?? ''));
  return copies.flatMap((file) =>
    readLf(join(repoRoot, file))
      .split('\n')
      .flatMap((line, index) => (INCLUDE_MARK.test(line) ? [{ file, line: index + 1, message: `una inclusión es solo de las propias, y ${file} es una copia` }] : [])),
  );
}

export function ownReport(repoRoot: string, files: string[]): OwnReport {
  const registry = readRegistry(join(repoRoot, 'upstream.json'));
  const lines = skillLines(repoRoot, files, registry);
  const repeated = repeatedLines(lines);
  const problems = [...exceptionProblems(lines), ...spanishProblems(lines), ...includeInCopyProblems(repoRoot, files, registry)];
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
