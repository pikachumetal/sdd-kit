import { CLOSED, indices, lineAt } from './parse.ts';
import type { Section } from './parse.ts';
import type { Row } from './tables.ts';

export const CLOSING_PREFIX = String.raw`\*\*\[(?:Feature|Task|Patch) [^\],]+, (\d{4}-\d{2}-\d{2}): `;
const SETTLED = new RegExp(String.raw`^\|(?:[^|]*\|)?\s*${CLOSING_PREFIX}saldada — `, 'i');
const PATCH_ROW = /^\|\s*(\d{4}-\d{2}-\d{2})\s*\|/;
const MIN_PUBLISHED_ID_LENGTH = 4;

export interface Release {
  version: string;
  date: string;
  text: string;
}

interface DatedLine {
  index: number;
  date: string;
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

function datedLines(lines: string[], sections: Section[], kinds: string[], pattern: RegExp): DatedLine[] {
  const found: DatedLine[] = [];
  for (const section of sections.filter((candidate) => kinds.includes(candidate.kind))) {
    for (const index of indices(section.line, section.last)) {
      const date = pattern.exec(lineAt(lines, index))?.[1];
      if (date !== undefined) found.push({ index, date });
    }
  }
  return found;
}

export function settledRowProblems(lines: string[], sections: Section[], last: Release | undefined): string[] {
  if (!last) return [];
  return datedLines(lines, sections, ['Backlog', 'Deuda técnica'], SETTLED)
    .filter(({ date }) => date <= last.date)
    .map(({ index, date }) => `línea ${index + 1}: fila saldada el ${date}, no posterior a la v${last.version} (${last.date}): sale en el corte`);
}

export function releasedPatchProblems(lines: string[], sections: Section[], last: Release | undefined): string[] {
  if (!last) return [];
  return datedLines(lines, sections, ['Patches'], PATCH_ROW)
    .filter(({ date }) => date <= last.date)
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
