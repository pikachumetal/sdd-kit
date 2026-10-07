import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname } from 'node:path';
import { equalsIgnoringCase, RULE_NAMES, sectionTitle } from './sections.ts';

export interface Document {
  file: string;
  name: string;
  newline: string;
  lines: string[];
}

export type Span = { start: number; end: number };
export type FoundRequirement = Span & { body: string[] };

export function formatTitle(title: string): string {
  return title.replace(/\s+/g, ' ').trim();
}

export function newDocument(file: string, lines: string[], newline: string): Document {
  return { file, name: basename(file), newline, lines };
}

export function readDocument(file: string): Document {
  const raw = readFileSync(file, 'utf8').replace(/^﻿/, '');
  return newDocument(file, raw.split(/\r?\n/), raw.includes('\r\n') ? '\r\n' : '\n');
}

function withBlankLines(lines: string[]): string[] {
  const result: string[] = [];
  for (const line of lines) {
    const previous = result.at(-1);
    if (!line.trim()) {
      if (previous) result.push('');
      continue;
    }
    const isHeading = (text: string) => /^#{1,3} /.test(text);
    if (previous && (isHeading(line) || isHeading(previous))) result.push('');
    result.push(line);
  }
  while (result.at(-1) === '') result.pop();
  return result;
}

export function saveDocument(document: Document): void {
  const content = withBlankLines(document.lines).join(document.newline) + document.newline;
  mkdirSync(dirname(document.file), { recursive: true });
  writeFileSync(document.file, content, 'utf8');
}

function findSectionIndex(document: Document, title: string): number {
  return document.lines.findIndex((line) => equalsIgnoringCase(sectionTitle(line) ?? '\0', title));
}

function sectionEnd(document: Document, title: string): number {
  const start = findSectionIndex(document, title);
  if (start < 0) return -1;
  let end = start + 1;
  while (end < document.lines.length && !document.lines[end].startsWith('## ')) end++;
  return end;
}

export function requirementsEnd(document: Document): number {
  const end = sectionEnd(document, 'Requisitos');
  if (end >= 0) return end;
  const rules = findSectionIndex(document, 'Reglas de la capacidad');
  const at = rules >= 0 ? rules : document.lines.length;
  document.lines.splice(at, 0, '', '## Requisitos', '');
  return at + 3;
}

export function findRequirement(document: Document, title: string): FoundRequirement | undefined {
  const { lines } = document;
  for (let start = 0; start < lines.length; start++) {
    const heading = /^### (.+)$/.exec(lines[start]);
    if (!heading || formatTitle(heading[1]) !== title) continue;
    let end = start + 1;
    while (end < lines.length && !/^#{1,3} /.test(lines[end])) end++;
    return { start, end, body: lines.slice(start + 1, end) };
  }
  return undefined;
}

export function findRule(document: Document, name: string): Span | undefined {
  const { lines } = document;
  const start = lines.findIndex((line) => line.startsWith(`- **${name}**:`));
  if (start < 0) return undefined;
  let end = start + 1;
  while (end < lines.length && /^\s+\S/.test(lines[end])) end++;
  return { start, end };
}

function rulesSectionEnd(document: Document): number {
  const end = sectionEnd(document, 'Reglas de la capacidad');
  if (end < 0) {
    document.lines.push('', '## Reglas de la capacidad', '');
    return document.lines.length;
  }
  let trimmed = end;
  while (trimmed > 0 && !document.lines[trimmed - 1].trim()) trimmed--;
  return trimmed;
}

export function ruleInsertIndex(document: Document, name: string): number {
  const position = RULE_NAMES.indexOf(name);
  const following = position < 0 ? [] : RULE_NAMES.slice(position + 1);
  for (const next of following) {
    const found = findRule(document, next);
    if (found) return found.start;
  }
  return rulesSectionEnd(document);
}
