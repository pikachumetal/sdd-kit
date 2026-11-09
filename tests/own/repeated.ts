// Una racha de palabras que el kit dice en dos skills: la regla vive en dos sitios.
import { elementsOf, skillOf, TEMPLATES, withoutCode, type Element, type SkillLine } from './kit-text.ts';

const RUN = 10;
const WORD = /[\p{L}\p{N}'’-]+/gu;
const HAS_LETTER = /[\p{L}\p{N}]/u;
const EXCLUDED = [TEMPLATES, 'dist/skills/sdd-upgrade/references/migrations/'];
const REMEDY =
  'déjala en un solo sitio, en includes/ si la necesitan varias skills; antes de quitar una copia, relee cada paso que la nombra por su posición: su orden tiene que dejar aplicarla';

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

const keyOf = (occurrence: Occurrence): string => `${occurrence.element}:${occurrence.index}`;

// Cada racha flagged apunta a la primera de su tramo seguido: una racha de 12 palabras es un solo sitio.
function runStarts(flagged: Map<number, Set<number>>): Map<string, Occurrence> {
  const startOf = new Map<string, Occurrence>();
  for (const [element, indexes] of flagged) {
    for (const index of [...indexes].sort((a, b) => a - b)) {
      const previous = startOf.get(keyOf({ element, index: index - 1 }));
      startOf.set(keyOf({ element, index }), previous ?? { element, index });
    }
  }
  return startOf;
}

function siteOf(words: Word[][], start: Occurrence): Site {
  const word = words[start.element][start.index];
  return { file: word.line.file, line: word.line.line };
}

const firstWords = (words: Word[][], start: Occurrence): string =>
  words[start.element]
    .slice(start.index, start.index + RUN)
    .map((word) => word.text)
    .join(' ');

const bySite = (a: Site, b: Site): number => (a.file === b.file ? a.line - b.line : a.file < b.file ? -1 : 1);

function joinSites(sites: Site[]): string {
  const names = sites.map((site) => `${site.file}:${site.line}`);
  return names.length === 1 ? names[0] : `${names.slice(0, -1).join(', ')} y ${names.at(-1)}`;
}

function flaggedByText(words: Word[][]): { hitsByText: Occurrence[][]; flagged: Map<number, Set<number>> } {
  const flagged = new Map<number, Set<number>>();
  const hitsByText: Occurrence[][] = [];
  for (const occurrences of shingles(words).values()) {
    const hits = flaggedOccurrences(words, occurrences);
    if (hits.length === 0) continue;
    hitsByText.push(hits);
    for (const hit of hits) flagged.set(hit.element, (flagged.get(hit.element) ?? new Set()).add(hit.index));
  }
  return { hitsByText, flagged };
}

// Dos tramos que comparten alguna racha de 10 palabras van en la misma línea.
function groupsOf(words: Word[][]): Occurrence[][] {
  const { hitsByText, flagged } = flaggedByText(words);
  const startOf = runStarts(flagged);
  const start = (hit: Occurrence): Occurrence => startOf.get(keyOf(hit)) ?? hit;
  const runs = new Runs();
  for (const hits of hitsByText) for (const hit of hits.slice(1)) runs.union(keyOf(start(hits[0])), keyOf(start(hit)));
  const groups = new Map<string, Occurrence[]>();
  for (const run of new Set(startOf.values())) {
    const root = runs.find(keyOf(run));
    groups.set(root, [...(groups.get(root) ?? []), run]);
  }
  return [...groups.values()];
}

export function repeatedLines(lines: SkillLine[]): string[] {
  const kept = lines.filter((line) => skillOf(line.file) !== null && !EXCLUDED.some((prefix) => line.file.startsWith(prefix)));
  const words = elementsOf(kept).map(wordsOf);
  return groupsOf(words)
    .map((starts) => {
      const sorted = starts.map((start) => ({ start, site: siteOf(words, start) })).sort((a, b) => bySite(a.site, b.site));
      return { site: sorted[0].site, text: `${joinSites(sorted.map((entry) => entry.site))} repiten «${firstWords(words, sorted[0].start)}»: ${REMEDY}` };
    })
    .sort((a, b) => bySite(a.site, b.site))
    .map((entry) => entry.text);
}
