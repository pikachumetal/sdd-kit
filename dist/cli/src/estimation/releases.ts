import { existsSync } from 'node:fs';
import { formatNumber, median, sum } from './numbers.ts';
import type { Row } from './artifacts.ts';
import { readText } from '../cli/files.ts';
import { MISSING } from './text.ts';
import { gitSync } from '../git/git.ts';
import { CHANGE_FOLDER_NAMES, resolveDocument } from '../cli/layout.ts';

export const UNPUBLISHED = 'sin publicar';
export const UNDATED = 'sin fecha';
const RELEASE_HEADING = /^##\s*\[([^\]]+)\]\s*[-—]\s*(\d{4}-\d{2}-\d{2})\s*$/gm;
const ARTIFACT_FILES = ['walkthrough.md', 'patch.md', 'hotfix.md'];
const HEADER_MARK = '\u0000';

interface Version {
  name: string;
  date: string;
  // Commits del tag v<versión>; sin tag o sin git, null y la versión se decide por fecha.
  commits: Set<string> | null;
}

function taggedCommits(docsPath: string, name: string): Set<string> | null {
  const commits = gitSync(docsPath, ['rev-list', `v${name}^{commit}`]);
  return commits === null ? null : new Set(commits);
}

function readVersions(changelogPath: string, docsPath: string): Version[] {
  if (!existsSync(changelogPath)) return [];
  const content = readText(changelogPath);
  const versions = [...content.matchAll(RELEASE_HEADING)].map((found) => ({
    name: found[1]!,
    date: found[2]!,
    commits: taggedCommits(docsPath, found[1]!),
  }));
  // Dos versiones del mismo día: la anterior tiene menos commits, porque su tag es ascendiente del otro.
  return versions.sort((a, b) => a.date.localeCompare(b.date) || (a.commits?.size ?? 0) - (b.commits?.size ?? 0));
}

export interface ClosingCommit {
  sha: string;
  author: string;
  subject: string;
}

function parseHeader(header: string): ClosingCommit {
  const [sha = '', author = '', subject = ''] = header.split('\t');
  return { sha, author, subject };
}

// Commit más antiguo de cada «<carpeta>/<fichero>» en changes/ o specs/: el log va del más nuevo al más viejo y gana el último,
// así una carpeta movida de specs/ a changes/ cuenta desde su commit en specs/.
// ponytail: un fichero renombrado (renumerar una carpeta) cuenta desde el renombrado; si se renombra tras el corte, cae en la versión siguiente.
export function closingCommits(docsPath: string): Map<string, ClosingCommit> | null {
  const format = '--format=%x00%H%x09%aN%x09%s';
  const lines = gitSync(docsPath, ['log', '--no-renames', '--diff-filter=AM', format, '--name-only', '--', ...CHANGE_FOLDER_NAMES]);
  if (lines === null) return null;
  const commits = new Map<string, ClosingCommit>();
  let current = parseHeader('');
  for (const line of lines) {
    if (line.startsWith(HEADER_MARK)) current = parseHeader(line.slice(HEADER_MARK.length));
    else commits.set(line.split('/').slice(-2).join('/'), current);
  }
  return commits;
}

export function artifactCommit(folder: string, commits: Map<string, ClosingCommit>): ClosingCommit | undefined {
  return ARTIFACT_FILES.map((file) => commits.get(`${folder}/${file}`)).find(Boolean);
}

// El día no ordena un artefacto fusionado tras el corte del mismo día: con el tag de la versión, manda la ascendencia en git.
function releaseLabel(row: Row, versions: Version[], commits: Map<string, ClosingCommit>): string {
  if (row.date === MISSING) return UNDATED;
  const commit = artifactCommit(row.folder, commits)?.sha;
  const inVersion = (version: Version): boolean =>
    version.commits === null ? version.date >= row.date : commit !== undefined && version.commits.has(commit);
  return versions.find(inVersion)?.name ?? UNPUBLISHED;
}

function costSum(rows: Row[], field: 'subjectCost' | 'sessionCost'): string {
  const numbers = rows
    .map((row) => row[field])
    .filter((value): value is string => value !== null && /^\d+(\.\d+)?$/.test(value));
  return numbers.length === 0 ? MISSING : formatNumber(sum(numbers.map(Number)));
}

function releaseRow(label: string, rows: Row[]): string {
  const ratios = rows.flatMap((row) => (row.ratio === null ? [] : [row.ratio]));
  const medianText = ratios.length > 0 ? formatNumber(median(ratios)) : MISSING;
  const hours = formatNumber(sum(rows.map((row) => row.real)));
  return `| ${label} | ${rows.length} | ${hours} | ${medianText} | ${costSum(rows, 'subjectCost')} | ${costSum(rows, 'sessionCost')} |`;
}

export interface ReleaseIndex {
  changelog: string | null;
  shadowed: string | null;
  versions: string[];
  label: (row: Row) => string;
}

export function releaseIndex(docsPath: string): ReleaseIndex {
  const { file: changelog, shadowed } = resolveDocument(docsPath, 'changelog');
  const versions = changelog === null ? [] : readVersions(changelog, docsPath);
  const commits = (versions.length === 0 ? null : closingCommits(docsPath)) ?? new Map<string, ClosingCommit>();
  const label = (row: Row): string => releaseLabel(row, versions, commits);
  return { changelog, shadowed, versions: versions.map((version) => version.name), label };
}

export function releaseTable(rows: Row[], docsPath: string): string[] {
  const { versions, label: labelOf } = releaseIndex(docsPath);
  if (versions.length === 0) return [];
  const byLabel = Map.groupBy(rows, labelOf);
  const labels = [...versions, UNPUBLISHED, UNDATED];
  return [
    '',
    '| Release | Artefactos | Horas reales | Mediana | Sujetos ($) | Sesión ($) |',
    '| --- | --- | --- | --- | --- | --- |',
    ...labels.flatMap((label) => (byLabel.has(label) ? [releaseRow(label, byLabel.get(label)!)] : [])),
  ];
}
