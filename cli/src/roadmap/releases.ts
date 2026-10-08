import { CLOSED, indices, lineAt } from './parse.ts';
import type { Section } from './parse.ts';
import type { Row } from './tables.ts';
import { gitSync } from '../git/git.ts';

export const CLOSING_PREFIX = String.raw`\*\*\[(?:Feature|Task|Patch) [^\],]+, (\d{4}-\d{2}-\d{2}): `;
const SETTLED = new RegExp(String.raw`^\|(?:[^|]*\|)?\s*${CLOSING_PREFIX}saldada — `, 'i');
const PATCH_ROW = /^\|\s*(\d{4}-\d{2}-\d{2})\s*\|/;
const MIN_PUBLISHED_ID_LENGTH = 4;
const ARTIFACT_LINK = /\]\((specs\/[^)\s]+)\)/;

export interface Release {
  version: string;
  date: string;
  text: string;
}

interface DatedLine {
  index: number;
  date: string;
  text: string;
}

export interface Cut {
  sddPath: string;
  commit: string;
}

export function closedReleases(lines: string[], sections: Section[]): Release[] {
  const closed = sections.find((section) => section.kind === CLOSED);
  const releases: Release[] = [];
  if (!closed) return releases;
  for (const index of indices(closed.line, closed.last)) {
    const text = lineAt(lines, index);
    const match = /^### v(\S+) — (\d{4}-\d{2}-\d{2})/i.exec(text);
    if (match) releases.push({ version: match[1], date: match[2], text: '' });
    else if (releases.length) releases[releases.length - 1].text += `\n${text}`;
  }
  return releases;
}

interface DatedRows {
  kinds: string[];
  pattern: RegExp;
}

const SETTLED_ROWS: DatedRows = { kinds: ['Backlog', 'Deuda técnica'], pattern: SETTLED };
const PATCH_ROWS: DatedRows = { kinds: ['Patches'], pattern: PATCH_ROW };

function datedLines(lines: string[], sections: Section[], rows: DatedRows): DatedLine[] {
  const found: DatedLine[] = [];
  for (const section of sections.filter((candidate) => rows.kinds.includes(candidate.kind))) {
    for (const index of indices(section.line, section.last)) {
      const text = lineAt(lines, index);
      const date = rows.pattern.exec(text)?.[1];
      if (date !== undefined) found.push({ index, date, text });
    }
  }
  return found;
}

export function cutCommit(sddPath: string, last: Release | undefined): Cut | undefined {
  const commit = last && gitSync(sddPath, ['rev-parse', '-q', '--verify', `v${last.version}^{commit}`])?.[0];
  return commit ? { sddPath, commit } : undefined;
}

// El día no ordena un patch fusionado tras el corte del mismo día: con el tag de la release y el enlace al artefacto,
// manda la ascendencia en git; sin tag (el corte aún sin taggear) o sin enlace, la fecha.
function inRelease({ date, text }: DatedLine, last: Release, cut: Cut | undefined): boolean {
  if (date > last.date) return false;
  const link = ARTIFACT_LINK.exec(text)?.[1];
  if (!cut || link === undefined) return true;
  const added = gitSync(cut.sddPath, ['log', '--no-renames', '--diff-filter=A', '--format=%H', '--', link]) ?? [];
  if (added.length === 0) return false;
  return gitSync(cut.sddPath, ['merge-base', '--is-ancestor', added[added.length - 1], cut.commit]) !== null;
}

export function settledRowProblems(lines: string[], sections: Section[], last: Release | undefined, cut?: Cut): string[] {
  if (!last) return [];
  return datedLines(lines, sections, SETTLED_ROWS)
    .filter((dated) => inRelease(dated, last, cut))
    .map(({ index, date }) => `línea ${index + 1}: fila saldada el ${date}, no posterior a la v${last.version} (${last.date}): sale en el corte`);
}

export function releasedPatchProblems(lines: string[], sections: Section[], last: Release | undefined, cut?: Cut): string[] {
  if (!last) return [];
  return datedLines(lines, sections, PATCH_ROWS)
    .filter((dated) => inRelease(dated, last, cut))
    .map(({ index, date }) => `línea ${index + 1}: patch del ${date}, no posterior a la v${last.version} (${last.date}): sale en el corte`);
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
}

export function publishedProblem(row: Row, releases: Release[]): string[] {
  const id = row.cells[0];
  if (id.length < MIN_PUBLISHED_ID_LENGTH) return [];
  const pattern = new RegExp(`(?<![\\p{L}\\p{N}_-])${escapeRegExp(id)}(?![\\p{L}\\p{N}_-])`, 'iu');
  const release = releases.find((candidate) => pattern.test(candidate.text));
  if (!release) return [];
  return [`línea ${row.index + 1}: la ${id} ya está en la v${release.version}: su fila sale de «${row.title}»`];
}
