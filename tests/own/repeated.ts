// Una racha de palabras que el kit dice en dos skills: la regla vive en dos sitios.
import { elementsOf, skillOf, withoutCode, type Element, type SkillLine } from './kit-text.ts';

const RUN = 10;
const WORD = /[\p{L}\p{N}'’-]+/gu;
const HAS_LETTER = /[\p{L}\p{N}]/u;
const EXCLUDED = ['dist/skills/sdd-templates/templates/', 'dist/skills/sdd-upgrade/references/migrations/'];
const REMEDY = 'déjala en un solo sitio, en includes/ si la necesitan varias propias';

interface Word {
  text: string;
  line: SkillLine;
}

interface Occurrence {
  element: number;
  index: number;
}

interface Site {
  file: string;
  line: number;
}

function wordsOf(element: Element): Word[] {
  return element.parts.flatMap((line) =>
    (withoutCode(line.text).toLowerCase().match(WORD) ?? []).filter((text) => HAS_LETTER.test(text)).map((text) => ({ text, line })),
  );
}

function canPair(a: Word[], b: Word[]): boolean {
  if (skillOf(a[0].line.file) === skillOf(b[0].line.file)) return false;
  const kit = (run: Word[]): boolean => run.some((word) => word.line.kit);
  return (kit(a) || kit(b)) && !(a[0].line.copy && b[0].line.copy);
}

class Runs {
  private readonly parent = new Map<string, string>();

  find(key: string): string {
    const parent = this.parent.get(key) ?? key;
    if (parent === key) return key;
    const root = this.find(parent);
    this.parent.set(key, root);
    return root;
  }

  union(a: string, b: string): void {
    this.parent.set(this.find(a), this.find(b));
  }
}

function shingles(words: Word[][]): Map<string, Occurrence[]> {
  const byText = new Map<string, Occurrence[]>();
  words.forEach((list, element) => {
    for (let index = 0; index + RUN <= list.length; index++) {
      const text = list
        .slice(index, index + RUN)
        .map((word) => word.text)
        .join(' ');
      byText.set(text, [...(byText.get(text) ?? []), { element, index }]);
    }
  });
  return byText;
}

function flaggedOccurrences(words: Word[][], occurrences: Occurrence[]): Occurrence[] {
  const run = (occurrence: Occurrence): Word[] => words[occurrence.element].slice(occurrence.index, occurrence.index + RUN);
  return occurrences.filter((a) => occurrences.some((b) => canPair(run(a), run(b))));
}

function runStarts(flagged: Map<number, Set<number>>): Map<string, string> {
  const startOf = new Map<string, string>();
  for (const [element, indexes] of flagged) {
    for (const index of [...indexes].sort((a, b) => a - b)) {
      const previous = startOf.get(`${element}:${index - 1}`);
      startOf.set(`${element}:${index}`, previous ?? `${element}:${index}`);
    }
  }
  return startOf;
}

function siteOf(words: Word[][], start: string): Site {
  const [element, index] = start.split(':').map(Number);
  const word = words[element][index];
  return { file: word.line.file, line: word.line.line };
}

const bySite = (a: Site, b: Site): number => (a.file === b.file ? a.line - b.line : a.file < b.file ? -1 : 1);

function joinSites(sites: Site[]): string {
  const names = sites.map((site) => `${site.file}:${site.line}`);
  return names.length === 1 ? names[0] : `${names.slice(0, -1).join(', ')} y ${names.at(-1)}`;
}

function groupsOf(words: Word[][]): Map<string, string[]> {
  const flagged = new Map<number, Set<number>>();
  const keys: Occurrence[][] = [];
  for (const occurrences of shingles(words).values()) {
    const hits = flaggedOccurrences(words, occurrences);
    if (hits.length === 0) continue;
    keys.push(hits);
    for (const hit of hits) flagged.set(hit.element, (flagged.get(hit.element) ?? new Set()).add(hit.index));
  }
  const startOf = runStarts(flagged);
  const runs = new Runs();
  for (const hits of keys) for (const hit of hits.slice(1)) runs.union(startOf.get(`${hits[0].element}:${hits[0].index}`)!, startOf.get(`${hit.element}:${hit.index}`)!);
  const groups = new Map<string, string[]>();
  for (const start of new Set(startOf.values())) groups.set(runs.find(start), [...(groups.get(runs.find(start)) ?? []), start]);
  return groups;
}

export function repeatedLines(lines: SkillLine[]): string[] {
  const kept = lines.filter((line) => skillOf(line.file) !== null && !EXCLUDED.some((prefix) => line.file.startsWith(prefix)));
  const words = elementsOf(kept).map(wordsOf);
  return [...groupsOf(words).values()]
    .map((starts) => {
      const sorted = starts.map((start) => ({ start, site: siteOf(words, start) })).sort((a, b) => bySite(a.site, b.site));
      const [element, index] = sorted[0].start.split(':').map(Number);
      const first = words[element].slice(index, index + RUN).map((word) => word.text).join(' ');
      return { site: sorted[0].site, text: `${joinSites(sorted.map((entry) => entry.site))} repiten «${first}»: ${REMEDY}` };
    })
    .sort((a, b) => bySite(a.site, b.site))
    .map((entry) => entry.text);
}
