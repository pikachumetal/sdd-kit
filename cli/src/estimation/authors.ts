import { gitBatchSync } from '../git/git.ts';
import type { Warn } from './fields.ts';
import { artifactCommit, closingCommits } from './releases.ts';
import { UNATTRIBUTED, UNMARKED } from './report.ts';
import type { Attribution, ReportSource } from './report.ts';

export const MIGRATION_SUBJECT = 'chore(sdd): migrar al kit';
const NO_ATTRIBUTION: Attribution = { person: UNATTRIBUTED, kitVersion: UNMARKED };

function versionOf(content: string): string | null {
  try {
    const version = (JSON.parse(content) as { version?: unknown }).version;
    return typeof version === 'string' && version !== '' ? version : null;
  } catch {
    return null;
  }
}

function parseBatch(output: Buffer, count: number): (string | null)[] {
  const contents: (string | null)[] = [];
  let offset = 0;
  for (let index = 0; index < count; index++) {
    const end = output.indexOf(0x0a, offset);
    if (end < 0) break;
    const size = /^\S+ blob (\d+)\s*$/.exec(output.subarray(offset, end).toString('utf8'))?.[1];
    const start = end + 1;
    offset = size === undefined ? start : start + Number(size) + 1;
    contents.push(size === undefined ? null : output.subarray(start, start + Number(size)).toString('utf8'));
  }
  return contents;
}

export function markedVersions(docsPath: string, shas: string[]): Map<string, string> {
  if (shas.length === 0) return new Map();
  const input = shas.map((sha) => `${sha}:./sdd-kit.json`).join('\n') + '\n';
  const output = gitBatchSync(docsPath, ['cat-file', '--batch'], input);
  if (output === null) return new Map();
  const contents = parseBatch(output, shas.length);
  return new Map(shas.flatMap((sha, index) => {
    const content = contents[index];
    const version = content == null ? null : versionOf(content);
    return version === null ? [] : [[sha, version] as const];
  }));
}

export function attributeRows(docsPath: string, sources: ReportSource[], warn: Warn): Attribution[] {
  if (sources.length === 0) return [];
  const commits = closingCommits(docsPath);
  if (commits === null) {
    warn(`Sin historial de git en ${docsPath}: persona y versión salen sin atribuir y sin marcador.`);
    return sources.map(() => NO_ATTRIBUTION);
  }
  const writers = sources
    .map((source) => artifactCommit(source.row.folder, commits))
    .map((commit) => (commit === undefined || commit.subject.startsWith(MIGRATION_SUBJECT) ? undefined : commit));
  const versions = markedVersions(docsPath, [...new Set(writers.flatMap((commit) => (commit ? [commit.sha] : [])))]);
  return writers.map((commit) => (commit ? { person: commit.author, kitVersion: versions.get(commit.sha) ?? UNMARKED } : NO_ATTRIBUTION));
}
