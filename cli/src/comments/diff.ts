const HUNK_NEW_START = /^@@ -\S+ \+(\d+)(?:,(\d+))? @@/;

function hunkLines(header: string): number[] {
  const [, start, count] = HUNK_NEW_START.exec(header) ?? [];
  return Array.from({ length: Number(count ?? 1) }, (_, offset) => Number(start) + offset);
}

// Las cabeceras se separan del cuerpo con el primer @@: una línea añadida «++ b/x» también empieza por +++ en el diff.
export function addedLinesByFile(diff: string): Map<string, number[]> {
  const added = new Map<string, number[]>();
  let file: string | null = null;
  let inHeader = false;
  for (const line of diff.split(/\r?\n/)) {
    if (line.startsWith('diff --git ')) [file, inHeader] = [null, true];
    else if (inHeader && line.startsWith('+++ b/')) file = line.slice('+++ b/'.length).replace(/\t$/, '');
    else if (line.startsWith('@@ ') && file !== null) {
      inHeader = false;
      added.set(file, [...(added.get(file) ?? []), ...hunkLines(line)]);
    }
  }
  return added;
}
