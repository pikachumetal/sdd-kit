import type { Hunk } from './keyed.ts';

interface Edit {
  start: number;
  end: number;
  lines: string[];
}

const CONSEQUENCE = /^- (?:THEN|AND) /;

// Longitud de la subsecuencia común más larga desde cada par de posiciones: los trozos de un conflicto son cortos.
function commonSuffixes(base: string[], side: string[]): (i: number, j: number) => number {
  const common = base.map(() => side.map(() => 0));
  const length = (i: number, j: number) => (i < base.length && j < side.length ? common[i][j] : 0);
  for (let i = base.length - 1; i >= 0; i--) {
    for (let j = side.length - 1; j >= 0; j--) {
      common[i][j] = base[i] === side[j] ? length(i + 1, j + 1) + 1 : Math.max(length(i + 1, j), length(i, j + 1));
    }
  }
  return length;
}

function editsAgainst(base: string[], side: string[]): Edit[] {
  const length = commonSuffixes(base, side);
  const edits: Edit[] = [];
  let [i, j, start, from] = [0, 0, 0, 0];
  const close = () => {
    if (start < i || from < j) edits.push({ start, end: i, lines: side.slice(from, j) });
  };
  while (i < base.length || j < side.length) {
    if (i < base.length && j < side.length && base[i] === side[j]) {
      close();
      [i, j] = [i + 1, j + 1];
      [start, from] = [i, j];
    } else if (j < side.length && (i === base.length || length(i, j + 1) >= length(i + 1, j))) j++;
    else i++;
  }
  close();
  return edits;
}

const sameEdit = (a: Edit, b: Edit) => a.start === b.start && a.end === b.end && a.lines.join('\n') === b.lines.join('\n');
const grows = (edit: Edit) => edit.lines.length > edit.end - edit.start;
// Una inserción justo detrás de un tramo que el otro lado alarga cae en el mismo hueco: no hay orden que elegir.
const addsToSameGap = (insertion: Edit, other: Edit) => insertion.start === insertion.end && other.end === insertion.start && grows(other);
const clash = (a: Edit, b: Edit) => a.start === b.start || (a.start < b.end && b.start < a.end) || addsToSameGap(a, b) || addsToSameGap(b, a);

// Une un trozo en conflicto de un requisito si cada lado cambia líneas THEN o AND distintas de la base; si no, null.
export function mergeRequirementLines({ ours, base, theirs }: Hunk): string[] | null {
  if (![...ours, ...base, ...theirs].every((line) => CONSEQUENCE.test(line))) return null;
  const mine = editsAgainst(base, ours);
  const other = editsAgainst(base, theirs).filter((edit) => !mine.some((own) => sameEdit(own, edit)));
  if (mine.some((own) => other.some((edit) => clash(own, edit)))) return null;
  const merged: string[] = [];
  let next = 0;
  for (const edit of [...mine, ...other].sort((a, b) => a.start - b.start)) {
    merged.push(...base.slice(next, edit.start), ...edit.lines);
    next = edit.end;
  }
  return [...merged, ...base.slice(next)];
}
