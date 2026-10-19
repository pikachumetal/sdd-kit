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

const SEPARATOR = /^\|[\s:|-]+\|?\s*$/;
const ENTRY = /^- \*\*(.+?)\*\*/;
const HEADING = /^#{1,6} /;

export function lineKey(line: string): string | null {
  if (line.startsWith('|') && !SEPARATOR.test(line)) return line.split('|')[1].trim();
  return ENTRY.exec(line)?.[1] ?? null;
}

// Una fila se identifica por su id dentro de su sección; una línea sin id, por su orden entre las demás sin id.
export function tableHeaders(lines: string[]): Set<string> {
  return new Set(lines.filter((line, index) => line.startsWith('|') && SEPARATOR.test(lines[index + 1] ?? '')));
}

function identities(lines: string[], headers: Set<string> = new Set()): string[] {
  let heading = '';
  let plain = 0;
  return lines.map((line, index) => {
    if (HEADING.test(line)) heading = line.trim();
    const key = SEPARATOR.test(lines[index + 1] ?? '') || headers.has(line) ? null : lineKey(line);
    return key === null ? `plain\u0000${plain++}\u0000${line}` : `row\u0000${heading}\u0000${key}`;
  });
}

function byIdentity(lines: string[], headers: Set<string>): Map<string, string> | null {
  const ids = identities(lines, headers);
  const map = new Map(ids.map((id, index) => [id, lines[index]]));
  return map.size === ids.length ? map : null;
}

function resolveRow(ours: string | undefined, base: string | undefined, theirs: string | undefined): string[] | null {
  if (ours === theirs) return ours === undefined ? [] : [ours];
  if (ours === base) return theirs === undefined ? [] : [theirs];
  if (theirs === base) return ours === undefined ? [] : [ours];
  if (base === undefined && ours !== undefined && theirs !== undefined) return [ours, theirs];
  return null;
}

function insertAfterAnchor(result: Entry[], entry: Entry, anchor: string | undefined): void {
  let position = anchor === undefined ? 0 : result.findIndex((existing) => existing.id === anchor) + 1;
  while (position < result.length && result[position].isNew) position++;
  result.splice(position, 0, entry);
}

function plainLines(lines: string[], headers: Set<string>): string[] {
  const ids = identities(lines, headers);
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

function sides({ ours, base, theirs }: Hunk, headers: Set<string>): Sides | null {
  const [oursById, baseById, theirsById] = [ours, base, theirs].map((lines) => byIdentity(lines, headers));
  if (oursById === null || baseById === null || theirsById === null) return null;
  if (!keepsBaseOrder(theirsById, baseById)) return null;
  return sameLines(plainLines(ours, headers), plainLines(theirs, headers)) ? { ours: oursById, base: baseById, theirs: theirsById } : null;
}

const isPlain = (id: string) => id.startsWith('plain\u0000');

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
      removed.push(lineKey(line) ?? '');
      return false;
    }
    if (texts.size > 0) duplicates.add(lineKey(line) ?? '');
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
    merged.duplicates.push(lineKey(rows[1]) ?? '');
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

// La cabecera de una tabla no es una fila: headers trae las de la versión base, por si el trozo la separa de su separador.
export function mergeKeyedHunk(hunk: Hunk, headers: Set<string> = new Set()): KeyedMerge | null {
  const byId = sides(hunk, headers);
  if (byId === null) return null;
  const merged = { entries: [] as Entry[], duplicates: [] as string[] };
  if (!placeOurs(byId, merged) || !placeTheirs(byId, merged.entries)) return null;
  return { lines: merged.entries.map((entry) => entry.line), duplicates: merged.duplicates };
}
