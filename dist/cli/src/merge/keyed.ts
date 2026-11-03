import { cells } from '../roadmap/parse.ts';
import { CLOSING_PREFIX } from '../roadmap/releases.ts';

export interface Hunk {
  ours: string[];
  base: string[];
  theirs: string[];
}

export interface KeyedMerge {
  lines: string[];
  duplicates: string[];
}

interface Entry {
  line: string;
  id: string;
  isNew: boolean;
}

export const TABLE_SEPARATOR = /^\|[\s:|-]+\|?\s*$/;
const ENTRY = /^- \*\*(.+?)\*\*/;
const HEADING = /^#{1,6} /;
export const ID_COLUMNS = ['#', 'id'];

export interface KeyContext {
  headers: Set<string>;
  column: number;
}

const NO_CONTEXT: KeyContext = { headers: new Set(), column: 0 };

// La columna de id de una tabla es la que se llama # o id; sin ella, la primera (la deuda se identifica por su ítem).
export function idColumn(header: string): number {
  return Math.max(0, cells(header).findIndex((cell) => ID_COLUMNS.includes(cell.toLowerCase())));
}

// El cierre antepone a una fila de deuda «**[Feature NNNN, fecha: saldada — …]** » (o parcial): no es parte de su clave.
const CLOSING_PREFIXES = new RegExp(String.raw`^(?<prefixes>\s*(?:${CLOSING_PREFIX}(?:saldada|parcial) — .*?\]\*\* )*)(?<text>.*)$`, 'is');
const CELL_DIVIDER = /(?<!\\)\|/;

function splitPrefixes(cell: string): [string, string] {
  const groups = CLOSING_PREFIXES.exec(cell)?.groups;
  return groups === undefined ? ['', cell] : [groups.prefixes, groups.text];
}

const withoutPrefixes = (cell: string) => splitPrefixes(cell)[1];

function rowKey(line: string, column: number): string | null {
  if (line.startsWith('|') && !TABLE_SEPARATOR.test(line)) return withoutPrefixes(cells(line)[column] ?? '');
  return ENTRY.exec(line)?.[1] ?? null;
}

export const lineKey = (line: string): string | null => rowKey(line, 0);

// Una fila se identifica por su id dentro de su sección; una línea sin id, por su orden entre las demás sin id.
export function tableHeaders(lines: string[]): Set<string> {
  return new Set(lines.filter((line, index) => line.startsWith('|') && TABLE_SEPARATOR.test(lines[index + 1] ?? '')));
}

function identities(lines: string[], { headers, column: initial }: KeyContext = NO_CONTEXT): string[] {
  let heading = '';
  let plain = 0;
  let column = initial;
  return lines.map((line, index) => {
    if (HEADING.test(line)) heading = line.trim();
    const isHeader = TABLE_SEPARATOR.test(lines[index + 1] ?? '') || headers.has(line);
    if (isHeader) column = idColumn(line);
    const key = isHeader ? null : rowKey(line, column);
    return key === null ? `plain\u0000${plain++}\u0000${line}` : `row\u0000${heading}\u0000${key}`;
  });
}

function byIdentity(lines: string[], context: KeyContext): Map<string, string> | null {
  const ids = identities(lines, context);
  const map = new Map(ids.map((id, index) => [id, lines[index]]));
  return map.size === ids.length ? map : null;
}

function pick<T>(ours: T, base: T, theirs: T): T | null {
  if (ours === theirs || theirs === base) return ours;
  return ours === base ? theirs : null;
}

// Cada celda se une con sus prefijos de cierre aparte del texto: así gana el lado que salda la fila.
function mergeCells(ours: string, base: string, theirs: string): string | null {
  if (!ours.startsWith('|')) return null;
  const [mine, original, other] = [ours, base, theirs].map((line) => line.split(CELL_DIVIDER).map(splitPrefixes));
  if (mine.length !== original.length || other.length !== original.length) return null;
  const merged: string[] = [];
  for (const [index, [prefixes, text]] of mine.entries()) {
    const parts = [pick(prefixes, original[index][0], other[index][0]), pick(text, original[index][1], other[index][1])];
    if (parts[0] === null || parts[1] === null) return null;
    merged.push(parts.join(''));
  }
  return merged.join('|');
}

function resolveRow(ours: string | undefined, base: string | undefined, theirs: string | undefined): string[] | null {
  if (ours === theirs) return ours === undefined ? [] : [ours];
  if (ours === base) return theirs === undefined ? [] : [theirs];
  if (theirs === base) return ours === undefined ? [] : [ours];
  if (base === undefined && ours !== undefined && theirs !== undefined) return [ours, theirs];
  if (ours === undefined || base === undefined || theirs === undefined) return null;
  const merged = mergeCells(ours, base, theirs);
  return merged === null ? null : [merged];
}

function insertAfterAnchor(result: Entry[], entry: Entry, anchor: string | undefined): void {
  let position = anchor === undefined ? 0 : result.findIndex((existing) => existing.id === anchor) + 1;
  while (position < result.length && result[position].isNew) position++;
  result.splice(position, 0, entry);
}

function plainLines(lines: string[], context: KeyContext): string[] {
  const ids = identities(lines, context);
  return lines.filter((_line, index) => isPlain(ids[index]));
}
const sameLines = (a: string[], b: string[]) => a.length === b.length && a.every((line, index) => line === b[index]);

interface Sides {
  ours: Map<string, string>;
  base: Map<string, string>;
  theirs: Map<string, string>;
}

// La unión sigue el orden de la rama destino: si la otra rama reordena filas de la base, decide una persona.
function keepsBaseOrder(side: Map<string, string>, base: Map<string, string>): boolean {
  const kept = [...side.keys()].filter((id) => base.has(id));
  return sameLines(kept, [...base.keys()].filter((id) => side.has(id)));
}

function sides({ ours, base, theirs }: Hunk, context: KeyContext): Sides | null {
  const [oursById, baseById, theirsById] = [ours, base, theirs].map((lines) => byIdentity(lines, context));
  if (oursById === null || baseById === null || theirsById === null) return null;
  if (!keepsBaseOrder(theirsById, baseById)) return null;
  return sameLines(plainLines(ours, context), plainLines(theirs, context)) ? { ours: oursById, base: baseById, theirs: theirsById } : null;
}

const isPlain = (id: string) => id.startsWith('plain\u0000');
const keyOf = (id: string) => id.split('\u0000')[2] ?? '';

export function repeatedIdentities(lines: string[]): Set<string> {
  const ids = identities(lines).filter((id) => !isPlain(id));
  return new Set(ids.filter((id, index) => ids.indexOf(id) !== index));
}

export interface Deduplicated extends KeyedMerge {
  removed: string[];
}

export function dedupeNewRows(lines: string[], keep: Set<string>): Deduplicated {
  const seen = new Map<string, Set<string>>();
  const duplicates = new Set<string>();
  const removed: string[] = [];
  const ids = identities(lines);
  const kept = lines.filter((line, index) => {
    if (isPlain(ids[index]) || keep.has(ids[index])) return true;
    const texts = seen.get(ids[index]) ?? new Set<string>();
    seen.set(ids[index], texts);
    if (texts.has(line)) {
      removed.push(keyOf(ids[index]));
      return false;
    }
    if (texts.size > 0) duplicates.add(keyOf(ids[index]));
    texts.add(line);
    return true;
  });
  return { lines: kept, duplicates: [...duplicates], removed };
}

export function dedupeRows(lines: string[]): KeyedMerge {
  const { lines: kept, duplicates } = dedupeNewRows(lines, new Set());
  return { lines: kept, duplicates };
}

const rowsOf = (id: string, { ours, base, theirs }: Sides) => resolveRow(ours.get(id), base.get(id), theirs.get(id));

function placeOurs(byId: Sides, merged: { entries: Entry[]; duplicates: string[] }): boolean {
  for (const id of byId.ours.keys()) {
    const rows = rowsOf(id, byId);
    if (rows === null) return false;
    const isNew = !isPlain(id) && !byId.base.has(id);
    if (rows[0] !== undefined) merged.entries.push({ line: rows[0], id, isNew });
    if (rows[1] === undefined) continue;
    merged.duplicates.push(keyOf(id));
    insertAfterAnchor(merged.entries, { line: rows[1], id: `${id}\u0000rama`, isNew }, id);
  }
  return true;
}

function placeTheirs(byId: Sides, entries: Entry[]): boolean {
  const theirsIds = [...byId.theirs.keys()];
  for (const [index, id] of theirsIds.entries()) {
    if (byId.ours.has(id)) continue;
    const rows = rowsOf(id, byId);
    if (rows === null) return false;
    rows.forEach((line) => insertAfterAnchor(entries, { line, id, isNew: !isPlain(id) && !byId.base.has(id) }, theirsIds[index - 1]));
  }
  return true;
}

// La cabecera de una tabla no es una fila: el contexto trae las de la versión base, por si el trozo la separa de su
// separador, y la columna de id de la tabla en la que cae el trozo.
export function mergeKeyedHunk(hunk: Hunk, context: KeyContext = NO_CONTEXT): KeyedMerge | null {
  const byId = sides(hunk, context);
  if (byId === null) return null;
  const merged = { entries: [] as Entry[], duplicates: [] as string[] };
  if (!placeOurs(byId, merged) || !placeTheirs(byId, merged.entries)) return null;
  return { lines: merged.entries.map((entry) => entry.line), duplicates: merged.duplicates };
}
