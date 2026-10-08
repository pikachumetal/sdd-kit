import { readLines } from '../cli/files.ts';
import { basename, extname } from 'node:path';

export const RULE_NAMES = ['Dónde viven los datos', 'Idioma de los nombres', 'Límites', 'Avisos', 'Regla ante conflicto'];

const DELTA_HEADER = /^\*\*(ADDED|MODIFIED|REMOVED|Reglas de la capacidad)\b/i;
const DELTA_TITLE = /^\*\*[\p{L}\p{N}_]+ —\s*([^*]+?)\s*\*\*/u;

export type Requirement = { title: string; lines: string[] };
export type Declared = { kind: 'Nuevas' | 'Modificadas'; name: string; summary: string };
export type DeltaKind = 'ADDED' | 'MODIFIED' | 'REMOVED' | 'RULES';
export type Delta = { capability: string; kind: DeltaKind; writtenKind: string; title: string; header: string; lines: string[] };
export type Capability = { name: string; fileName: string; lines: string[]; purpose: string | null };

export function equalsIgnoringCase(left: string, right: string): boolean {
  return left.toLowerCase() === right.toLowerCase();
}

export function includesIgnoringCase(items: string[], wanted: string): boolean {
  return items.some((item) => equalsIgnoringCase(item, wanted));
}

export function sectionTitle(line: string): string | null {
  const match = /^## (.+)$/.exec(line);
  if (!match) return null;
  return match[1].replace(/\s*\*\(.*\)\*\s*$/, '').trim();
}

export function sectionTitles(lines: string[]): string[] {
  return lines.map(sectionTitle).filter((title): title is string => Boolean(title));
}

export function sectionLines(lines: string[], title: string): string[] | null {
  const start = lines.findIndex((line) => equalsIgnoringCase(sectionTitle(line) ?? '\0', title));
  if (start < 0) return null;
  const rest = lines.slice(start + 1);
  const end = rest.findIndex((line) => line.startsWith('## '));
  return end < 0 ? rest : rest.slice(0, end);
}

export function purposeOf(lines: string[]): string | null {
  const section = sectionLines(lines, 'Propósito');
  if (!section) return null;
  const text = section
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('>'))
    .join(' ');
  return /^<[^>]*>$/.test(text) ? '' : text;
}

export function readCapability(path: string): Capability {
  const lines = readLines(path);
  const fileName = basename(path);
  return { name: basename(path, extname(path)), fileName, lines, purpose: purposeOf(lines) };
}

export function requirementsOf(lines: string[]): Requirement[] {
  const found: Requirement[] = [];
  for (const line of lines) {
    const match = /^### (.+)$/.exec(line);
    if (match) found.push({ title: match[1].trim(), lines: [] });
    else found.at(-1)?.lines.push(line);
  }
  return found;
}

export function declaredCapabilities(block: string[]): Declared[] {
  return block.flatMap((line) => {
    const match = /^(?:-\s*)?(Nuevas|Modificadas):(.*)$/i.exec(line);
    if (!match) return [];
    const kind = equalsIgnoringCase(match[1], 'Nuevas') ? 'Nuevas' : 'Modificadas';
    const [names, ...rest] = match[2].split('—');
    const summary = rest.length ? rest.join('—').trim() : '';
    return [...names.matchAll(/`([^`]+)`/g)].map((name) => ({ kind, name: name[1], summary }));
  });
}

function isHeaderClosed(header: string): boolean {
  if (!/^\*\*[^*]+\*\*/.test(header)) return false;
  return (header.match(/\(/g) ?? []).length <= (header.match(/\)/g) ?? []).length;
}

function continuesHeader(lines: string[], index: number): boolean {
  const line = lines[index];
  return line !== undefined && line.trim() !== '' && !/^(- |#|\*\*)/.test(line);
}

function joinHeader(lines: string[], start: number): { header: string; end: number } {
  let header = lines[start];
  let end = start;
  while (!isHeaderClosed(header) && continuesHeader(lines, end + 1)) {
    end++;
    header += ' ' + lines[end].trim();
  }
  return { header, end };
}

function newDelta(capability: string, header: string): Delta {
  const kindWritten = DELTA_HEADER.exec(header)![1];
  const kindText = kindWritten.toUpperCase();
  const kind = (kindText === 'REGLAS DE LA CAPACIDAD' ? 'RULES' : kindText) as DeltaKind;
  const title = (DELTA_TITLE.exec(header)?.[1] ?? '').replace(/\s+/g, ' ');
  return { capability, kind, writtenKind: kindWritten, title, header, lines: [] };
}

export function deltaEntries(lines: string[]): Delta[] {
  const entries: Delta[] = [];
  let capability: string | null = null;
  let current: Delta | undefined;
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];
    if (/^#{1,3} /.test(line)) {
      current = undefined;
      capability = /^### Capacidad: `([^`]+)`/.exec(line)?.[1] ?? null;
    } else if (capability && DELTA_HEADER.test(line)) {
      const { header, end } = joinHeader(lines, index);
      index = end;
      current = newDelta(capability, header);
      entries.push(current);
    } else current?.lines.push(line);
  }
  return entries;
}

export function readDelta(artifactPath: string): Delta[] {
  return deltaEntries(readLines(artifactPath));
}

export function isPatch(fileName: string, lines: string[]): boolean {
  return equalsIgnoringCase(fileName, 'patch.md') || lines.some((line) => /^type:\s*patch\s*$/i.test(line));
}
