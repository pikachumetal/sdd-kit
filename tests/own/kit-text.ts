// Cada línea que viaja de una skill, con lo que necesitan las comprobaciones de las propias: dónde cae en dist/ y si la escribió el kit.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { includesFrom, nextBlock, renderLines, type Block, type IncludeReader } from '../../build/dist.ts';
import { kindOf, type Registry } from '../../build/sources.ts';
import { kitBlockLines } from '../copies/annotated.ts';

export type Region = 'front' | 'text' | 'code';

export interface SkillLine {
  file: string;
  line: number;
  text: string;
  region: Region;
  kit: boolean;
  copy: boolean;
  included: boolean;
}

export interface Element {
  file: string;
  parts: SkillLine[];
}

type Kind = 'own' | 'copy' | 'pending';

interface FileContext {
  repoRoot: string;
  registry: Registry;
  readInclude: IncludeReader;
}

const LIST_ITEM = /^\s*(?:[-*+]|\d+[.)])\s+/;
const HEADING = /^\s*#{1,6}\s/;
const TABLE_ROW = /^\s*\|/;

const readLf = (path: string): string => readFileSync(path, 'utf8').replace(/\r\n/g, '\n');

export const withoutCode = (text: string): string => text.replace(/`[^`]*`/g, ' ');

export const skillOf = (file: string): string | null => /^dist\/skills\/([^/]+)\//.exec(file)?.[1] ?? null;

function regionsOf(texts: string[]): Region[] {
  let block: Block = texts[0]?.trimEnd() === '---' ? 'frontmatter' : 'text';
  return texts.map((text, index) => {
    const next = nextBlock(block, text, index);
    const region: Region = block === 'frontmatter' ? 'front' : typeof block === 'object' || typeof next === 'object' ? 'code' : 'text';
    block = next;
    return region;
  });
}

function isKit(kind: Kind, source: number | null, kitSource: Set<number> | null): boolean {
  if (source === null) return false;
  return kind === 'copy' ? (kitSource?.has(source) ?? false) : true;
}

function fileLines(file: string, context: FileContext): SkillLine[] {
  const kind = kindOf(context.registry, file);
  if (kind === null) return [];
  const text = readLf(join(context.repoRoot, file));
  const kitSource = kind === 'copy' ? kitBlockLines(file, text) : null;
  const rendered = renderLines(text, file, context.readInclude);
  const texts = rendered.map((line) => line.text.replace(/\n$/, ''));
  const regions = regionsOf(texts);
  return rendered.map((line, index) => ({
    file: `dist/${file}`,
    line: index + 1,
    text: texts[index],
    region: regions[index],
    kit: isKit(kind, line.source, kitSource),
    copy: kind !== 'own',
    included: line.source === null,
  }));
}

function includeLines(repoRoot: string): SkillLine[] {
  const dir = join(repoRoot, 'includes');
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((name) => name.endsWith('.md'))
    .sort()
    .flatMap((name) => {
      const texts = readLf(join(dir, name)).replace(/\n$/, '').split('\n');
      const regions = regionsOf(texts);
      return texts.map((text, index) => ({ file: `includes/${name}`, line: index + 1, text, region: regions[index], kit: true, copy: false, included: false }));
    });
}

export function skillLines(repoRoot: string, files: string[], registry: Registry): SkillLine[] {
  const context: FileContext = { repoRoot, registry, readInclude: includesFrom(repoRoot) };
  const skills = files.filter((file) => file.startsWith('skills/') && file.endsWith('.md')).flatMap((file) => fileLines(file, context));
  return [...skills, ...includeLines(repoRoot)];
}

function cells(line: SkillLine): Element[] {
  return line.text
    .split('|')
    .slice(1, -1)
    .map((cell) => ({ file: line.file, parts: [{ ...line, text: cell }] }));
}

// Un párrafo, un elemento de lista, un título o una celda de tabla: lo que una frase o una racha no cruzan.
export function elementsOf(lines: SkillLine[]): Element[] {
  const elements: Element[] = [];
  let current: Element | null = null;
  const close = (): void => {
    if (current) elements.push(current);
    current = null;
  };
  for (const line of lines) {
    const last: SkillLine | undefined = (current as Element | null)?.parts.at(-1);
    const startsNew = last === undefined || last.file !== line.file || last.line + 1 !== line.line || LIST_ITEM.test(line.text);
    if (line.region !== 'text' || line.text.trim() === '' || TABLE_ROW.test(line.text) || HEADING.test(line.text) || startsNew) close();
    if (line.region !== 'text' || line.text.trim() === '') continue;
    if (TABLE_ROW.test(line.text)) elements.push(...cells(line));
    else if (HEADING.test(line.text)) elements.push({ file: line.file, parts: [line] });
    else if (current) (current as Element).parts.push(line);
    else current = { file: line.file, parts: [{ ...line, text: line.text.replace(LIST_ITEM, '') }] };
  }
  close();
  return elements;
}
