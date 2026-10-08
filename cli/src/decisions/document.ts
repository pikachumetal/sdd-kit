import { readdirSync, existsSync } from 'node:fs';
import { basename, join } from 'node:path';
import { readLines } from '../cli/files.ts';

export interface Decision {
  file: string;
  number: string | null;
  title: string | null;
  status: string | null;
  date: string | null;
  rutas: string[];
  sections: string[];
}

const NUMBER = /^(\d{4})-/;
const SECTION = /^#{2,3} \S/;
const INLINE_LIST = /^\[(.*)\]$/;
const BLOCK_ITEM = /^\s+- /;

function frontmatter(lines: string[]): string[] {
  if (lines[0] !== '---') return [];
  const end = lines.indexOf('---', 1);
  return end === -1 ? [] : lines.slice(1, end);
}

function field(front: string[], name: string): string | null {
  const line = front.find((entry) => entry.startsWith(`${name}:`));
  return line === undefined ? null : line.slice(name.length + 1).trim();
}

function unquote(value: string): string {
  return value.trim().replace(/^(['"])(.*)\1$/, '$2');
}

function rutas(front: string[]): string[] {
  const value = field(front, 'rutas');
  if (value === null) return [];
  const inline = INLINE_LIST.exec(value);
  if (inline) return inline[1]!.split(',').map(unquote).filter((item) => item !== '');
  if (value !== '') return [];
  return blockItems(front.slice(front.findIndex((entry) => entry.startsWith('rutas:')) + 1));
}

function blockItems(lines: string[]): string[] {
  const items: string[] = [];
  for (const line of lines) {
    if (!BLOCK_ITEM.test(line)) break;
    items.push(unquote(line.replace(BLOCK_ITEM, '')));
  }
  return items;
}

export function readDecision(path: string): Decision {
  const lines = readLines(path);
  const front = frontmatter(lines);
  const title = lines.find((line) => line.startsWith('# '));
  return {
    file: basename(path),
    number: NUMBER.exec(basename(path))?.[1] ?? null,
    title: title === undefined ? null : title.slice(2).trim(),
    status: field(front, 'status'),
    date: field(front, 'date'),
    rutas: rutas(front),
    sections: lines.filter((line) => SECTION.test(line)).map((line) => line.trim()),
  };
}

export function readDecisions(docsPath: string): Decision[] {
  const folder = join(docsPath, 'decisions');
  if (!existsSync(folder)) return [];
  return readdirSync(folder)
    .filter((name) => name.endsWith('.md'))
    .sort()
    .map((name) => readDecision(join(folder, name)));
}
