import type { Hunk } from './keyed.ts';

interface Edit {
  start: number;
  end: number;
  lines: string[];
}

const CONSEQUENCE = /^- (?:THEN|AND) /;

// Los tramos de la base que un lado cambia, por la subsecuencia común más larga: los trozos de un conflicto son cortos.
function editsAgainst(base: string[], side: string[]): Edit[] {
  const common = base.map(() => side.map(() => 0));
  const length = (i: number, j: number) => (i < base.length && j < side.length ? common[i][j] : 0);
  for (let i = base.length - 1; i >= 0; i--) {
    for (let j = side.length - 1; j >= 0; j--) {
      common[i][j] = base[i] === side[j] ? length(i + 1, j + 1) + 1 : Math.max(length(i + 1, j), length(i, j + 1));
    }
  }
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
const clash = (a: Edit, b: Edit) => a.start === b.start || (a.start < b.end && b.start < a.end);

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
