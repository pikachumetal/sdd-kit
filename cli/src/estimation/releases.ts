import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { formatNumber, median, sum } from './numbers.ts';
import type { Row } from './artifacts.ts';
import { readText } from '../cli/files.ts';
import { MISSING } from './text.ts';
import { gitSync } from '../git/git.ts';

const UNPUBLISHED = 'sin publicar';
const UNDATED = 'sin fecha';
const RELEASE_HEADING = /^##\s*\[([^\]]+)\]\s*[-—]\s*(\d{4}-\d{2}-\d{2})\s*$/gm;
const ARTIFACT_FILES = ['walkthrough.md', 'patch.md', 'hotfix.md'];

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

// Commit que añadió cada «<carpeta>/<fichero>» de specs/: el log va del más nuevo al más viejo y gana el último.
// ponytail: un fichero renombrado (renumerar una carpeta) cuenta desde el renombrado; si se renombra tras el corte, cae en la versión siguiente.
function addedCommits(specsPath: string): Map<string, string> {
  const added = new Map<string, string>();
  let commit = '';
  for (const line of gitSync(specsPath, ['log', '--no-renames', '--diff-filter=A', '--format=%H', '--name-only', '--', '.']) ?? []) {
    if (/^[0-9a-f]{40}$/.test(line)) commit = line;
    else added.set(line.split('/').slice(-2).join('/'), commit);
  }
  return added;
}

// El día no ordena un artefacto fusionado tras el corte del mismo día: con el tag de la versión, manda la ascendencia en git.
function releaseLabel(row: Row, versions: Version[], added: Map<string, string>): string {
  if (row.date === MISSING) return UNDATED;
  const commit = ARTIFACT_FILES.map((file) => added.get(`${row.folder}/${file}`)).find(Boolean);
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

export function releaseTable(rows: Row[], docsPath: string): string[] {
  const versions = readVersions(join(docsPath, 'changelog.md'), docsPath);
  if (versions.length === 0) return [];
  const added = addedCommits(join(docsPath, 'specs'));
  const byLabel = Map.groupBy(rows, (row) => releaseLabel(row, versions, added));
  const labels = [...versions.map((version) => version.name), UNPUBLISHED, UNDATED];
  return [
    '',
    '| Release | Artefactos | Horas reales | Mediana | Sujetos ($) | Sesión ($) |',
    '| --- | --- | --- | --- | --- | --- |',
    ...labels.flatMap((label) => (byLabel.has(label) ? [releaseRow(label, byLabel.get(label)!)] : [])),
  ];
}
