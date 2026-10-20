export interface IdChange {
  from: string;
  to: string;
}

const ID_LIST_CELL = /^\s*\d{4}(\s*,\s*\d{4})*\s*$/;

function inlinePatterns(from: string): RegExp[] {
  return [
    new RegExp(`(\\btras )${from}(?!\\d)`, 'g'),
    new RegExp(`(\\bparent: )${from}(?!\\d)`, 'g'),
    new RegExp(`(\\bActuar(?:\\*\\*)?\\s*(?:→|:)\\s*)${from}(?!\\d)`, 'g'),
    new RegExp(`(-(?:feature|task|patch|proposal)-)${from}(?=-)`, 'g'),
  ];
}

function renumberCell(cell: string, { from, to }: IdChange): string {
  if (!ID_LIST_CELL.test(cell)) return cell;
  return cell.replace(new RegExp(`(?<!\\d)${from}(?!\\d)`, 'g'), to);
}

function renumberLine(line: string, change: IdChange): string {
  const withCells = line.startsWith('|') ? line.split('|').map((cell) => renumberCell(cell, change)).join('|') : line;
  return inlinePatterns(change.from).reduce((text, pattern) => text.replace(pattern, `$1${change.to}`), withCells);
}

export function renumberLines(lines: string[], change: IdChange, remoteLines: Set<string>): string[] {
  return lines.map((line) => (remoteLines.has(line) ? line : renumberLine(line, change)));
}
