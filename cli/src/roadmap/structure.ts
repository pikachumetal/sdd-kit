import { CLOSED, TEMPLATE_SECTIONS, indices, lineAt, sectionAt, sectionRank } from './parse.ts';
import type { Section } from './parse.ts';

const REQUIRED_SECTIONS = TEMPLATE_SECTIONS.filter((name) => name !== 'Release');
const PROSE_RULE = 'fuera de «Releases cerradas» el roadmap solo lleva tablas';
const SUBSECTION = /^#{3,} (.+?)\s*$/;
const CLOSED_TITLE = /^### v\S+ — \d{4}-\d{2}-\d{2}\s*$/i;

function sectionProblem(section: Section, seen: Set<string>, previous: Section | undefined): string | undefined {
  if (sectionRank(section) < 0) return `sección «${section.title}» fuera de la plantilla`;
  if (section.kind === 'Release' && !/^Release \d+(\.\d+)+$/i.test(section.title)) {
    return `«${section.title}» no lleva versión: «## Release <versión>»`;
  }
  if (seen.has(section.title.toLowerCase())) return `sección «${section.title}» repetida`;
  if (previous && sectionRank(section) < sectionRank(previous)) return `«${section.title}» va antes que «${previous.title}»`;
  return undefined;
}

function missingSections(sections: Section[]): string[] {
  const titles = sections.map((section) => section.title.toLowerCase());
  return REQUIRED_SECTIONS.filter((name) => !titles.includes(name.toLowerCase())).map((name) => `falta la sección «${name}»`);
}

export function sectionSetProblems(sections: Section[]): string[] {
  const found: string[] = [];
  const seen = new Set<string>();
  let previous: Section | undefined;
  for (const section of sections) {
    const problem = sectionProblem(section, seen, previous);
    if (problem) found.push(`línea ${section.line}: ${problem}`);
    seen.add(section.title.toLowerCase());
    if (sectionRank(section) >= 0) previous = section;
  }
  return [...missingSections(sections), ...found];
}

export function subsectionProblems(lines: string[], sections: Section[]): string[] {
  return lines.flatMap((text, index) => {
    const title = SUBSECTION.exec(text)?.[1];
    if (title === undefined || sectionAt(sections, index)?.kind === CLOSED) return [];
    return [`línea ${index + 1}: subsección «${title}» fuera de «${CLOSED}»`];
  });
}

export function closedTitleProblems(lines: string[], sections: Section[]): string[] {
  const problems: string[] = [];
  for (const section of sections.filter((candidate) => candidate.kind === CLOSED)) {
    for (const index of indices(section.line, section.last)) {
      const text = lineAt(lines, index);
      const title = SUBSECTION.exec(text)?.[1];
      if (title !== undefined && !CLOSED_TITLE.test(text)) {
        problems.push(`línea ${index + 1}: «${title}» no es «### v<versión> — <AAAA-MM-DD>»`);
      }
    }
  }
  return problems;
}

function proseChecked(section: Section, statusLines: Set<number>): boolean {
  if (section.kind === CLOSED || sectionRank(section) < 0) return false;
  if (section.kind !== 'Release' || statusLines.has(section.line)) return true;
  statusLines.add(section.line);
  return false;
}

export function proseProblems(lines: string[], sections: Section[]): string[] {
  const statusLines = new Set<number>();
  const problems: string[] = [];
  for (let index = 1; index < lines.length; index++) {
    if (/^\s*$|^\||^#{2,} /.test(lineAt(lines, index))) continue;
    const section = sectionAt(sections, index);
    if (section && !proseChecked(section, statusLines)) continue;
    const place = section ? `«${section.title}»` : 'la cabecera';
    problems.push(`línea ${index + 1}: prosa en ${place}; ${PROSE_RULE}`);
  }
  return problems;
}
