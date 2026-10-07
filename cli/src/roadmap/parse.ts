export const CLOSED = 'Releases cerradas';
export const TEMPLATE_SECTIONS = ['Próximo', 'Release', 'Backlog', 'Deuda técnica', 'Patches', CLOSED];
const SEPARATOR = /^\|(\s*:?-{3,}:?\s*\|)+\s*$/;

export interface Section {
  title: string;
  kind: string;
  line: number;
  last: number;
}

export interface Block {
  start: number;
  end: number;
  header: number | null;
  section: Section | undefined;
}

export function lineAt(lines: string[], index: number): string {
  return lines[index] ?? '';
}

export function indices(from: number, to: number): number[] {
  const step = from <= to ? 1 : -1;
  return Array.from({ length: Math.abs(to - from) + 1 }, (_, offset) => from + offset * step);
}

export function sectionRank(section: Section): number {
  return TEMPLATE_SECTIONS.indexOf(section.kind);
}

export function parseSections(lines: string[]): Section[] {
  const sections: Section[] = [];
  lines.forEach((text, index) => {
    const title = /^## (.+?)\s*$/.exec(text)?.[1];
    if (title === undefined) return;
    const previous = sections.at(-1);
    if (previous) previous.last = index - 1;
    const kind = /^Release(\s|$)/i.test(title) ? 'Release' : title;
    sections.push({ title, kind, line: index + 1, last: lines.length - 1 });
  });
  return sections;
}

export function sectionAt(sections: Section[], index: number): Section | undefined {
  return sections.find((section) => index >= section.line && index <= section.last);
}

export function cells(line: string): string[] {
  return line
    .trim()
    .replace(/^\|+|\|+$/g, '')
    .split(/(?<!\\)\|/)
    .map((cell) => cell.trim());
}

function blockEnd(lines: string[], start: number): number {
  let end = start;
  while (end < lines.length && lineAt(lines, end).startsWith('|')) end++;
  return end;
}

function headerIndex(lines: string[], start: number, end: number): number | null {
  const separator = indices(start, end - 1).find((index) => SEPARATOR.test(lineAt(lines, index)));
  return separator !== undefined && separator > start ? separator - 1 : null;
}

export function tableBlocks(lines: string[], sections: Section[]): Block[] {
  const blocks: Block[] = [];
  let index = 0;
  while (index < lines.length) {
    if (!lineAt(lines, index).startsWith('|')) {
      index++;
      continue;
    }
    const start = index;
    index = blockEnd(lines, start);
    const section = sectionAt(sections, start);
    if (section?.kind === CLOSED) continue;
    blocks.push({ start, end: index - 1, header: headerIndex(lines, start, index), section });
  }
  return blocks;
}
