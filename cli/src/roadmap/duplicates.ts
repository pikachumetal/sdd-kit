import { ID_COLUMNS, TABLE_SEPARATOR as SEPARATOR } from '../merge/keyed.ts';
import { cells } from './parse.ts';

const firstIsId = (header: string): boolean => ID_COLUMNS.includes((cells(header)[0] ?? '').toLowerCase());

function rowIds(lines: string[]): { id: string; line: number }[] {
  const ids: { id: string; line: number }[] = [];
  let column = -1;
  lines.forEach((line, index) => {
    if (!line.startsWith('|')) column = -1;
    else if (SEPARATOR.test(lines[index + 1] ?? '')) column = firstIsId(line) ? 0 : -1;
    else if (column >= 0 && !SEPARATOR.test(line)) ids.push({ id: (cells(line)[column] ?? '').trim(), line: index + 1 });
  });
  return ids.filter(({ id }) => id !== '' && id !== '—' && id !== '0000' && !/^<.*>$/.test(id));
}

export function duplicateIdWarnings(lines: string[]): string[] {
  const first = new Map<string, number>();
  return rowIds(lines).flatMap(({ id, line }) => {
    const seen = first.get(id);
    if (seen === undefined) first.set(id, line);
    return seen === undefined ? [] : [`aviso: línea ${line}: el id «${id}» ya está en la línea ${seen}`];
  });
}
