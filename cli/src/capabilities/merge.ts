import { existsSync, rmSync } from 'node:fs';
import { basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  findRequirement, findRule, formatTitle, newDocument, readDocument, requirementsEnd, ruleInsertIndex,
  saveDocument, type Document,
} from './document.ts';
import { readLines, readText } from '../cli/files.ts';
import { capabilitiesDir } from './files.ts';
import {
  declaredCapabilities, deltaEntries, equalsIgnoringCase, isPatch, requirementsOf, sectionLines, type Declared, type Delta,
} from './sections.ts';

export type MergeResult = { lines: string[]; code: number };

interface Run {
  capabilitiesDir: string;
  artifactName: string;
  isPatch: boolean;
  declared: Declared[];
  entries: Delta[];
  errors: string[];
  messages: string[];
  deleted: string[];
}

type Rule = { name: string; lines: string[] };

const GAP = /<[^<>\s][^<>]*>/g;
// Solo es hueco un <…> literal de la plantilla: los <!-- … --> y <…> del proyecto (tags de dialecto, marcadores) pasan.
const TEMPLATE_GAPS = new Set(
  readText(fileURLToPath(new URL('../../../skills/sdd-templates/templates/spec-template.md', import.meta.url))).match(GAP) ?? [],
);

function removeInlineCode(text: string): string {
  return text.replace(/`[^`]*`/g, '');
}

function findPattern(text: string, pattern: RegExp): string | undefined {
  return pattern.exec(removeInlineCode(text))?.[0];
}

function mergeableLines(lines: string[]): string[] {
  return lines
    .filter((line) => line.trim() && !/^\s*>/.test(line) && !/^- (Se valida en|motivo):/i.test(line) && !/^- REMOVED /i.test(line))
    .map((line) => line.trimEnd());
}

function outcomeLines(lines: string[]): string[] {
  return lines.filter((line) => /^- (THEN|AND)\b/i.test(line)).map(formatTitle);
}

function lostLines(existingBody: string[], entryLines: string[]): string[] {
  const live = outcomeLines(existingBody);
  const kept = outcomeLines(entryLines);
  const retired = entryLines
    .flatMap((line) => /^- REMOVED (.+)$/i.exec(line)?.[1] ?? [])
    .map((text) => `- ${formatTitle(text)}`)
    .filter((line) => live.includes(line));
  if (kept.length + retired.length >= live.length) return [];
  return live.filter((line) => !kept.includes(line) && !retired.includes(line));
}

function entryProblem(entry: Delta, artifactName: string): string | undefined {
  if (entry.kind !== 'RULES' && !entry.title) {
    return `${artifactName}: no leo el título de «${entry.header}»: escríbelo como «#### ${entry.writtenKind} — <título>», con raya`;
  }
  const body = mergeableLines(entry.lines);
  const gap = [entry.capability, entry.title, ...body]
    .flatMap((text) => removeInlineCode(text).match(GAP) ?? [])
    .find((candidate) => TEMPLATE_GAPS.has(candidate));
  if (gap) return `${artifactName}: «${gap}» es un hueco de la plantilla: rellénalo o borra lo que no aplique`;
  const citation = body.map((line) => findPattern(line, /decisi[oó]n(es)?\s+\d+/i)).find(Boolean);
  if (!citation) return undefined;
  const label = entry.title || 'Reglas de la capacidad';
  return `${artifactName}: «${label}» cita la spec («${citation}»): reescríbelo en el delta sin la referencia y vuelve a ejecutar`;
}

function loadDocument(run: Run, name: string): Document | undefined {
  const file = join(run.capabilitiesDir, `${name}.md`);
  if (existsSync(file)) return readDocument(file);
  const declared = run.declared.find((item) => item.kind === 'Nuevas' && equalsIgnoringCase(item.name, name));
  if (!declared || run.isPatch) {
    run.errors.push(`${run.artifactName}: «${name}» no tiene fichero en capabilities/ y el bloque no la declara en «Nuevas»`);
    return undefined;
  }
  const lines = [`# Capacidad — ${name}`, '', '## Propósito', '', declared.summary, '', '## Requisitos', ''];
  return newDocument(file, lines, '\n');
}

function requirementBlock(entry: Delta): string[] {
  return ['', `### ${entry.title}`, '', ...mergeableLines(entry.lines), ''];
}

function addRequirement(run: Run, document: Document, entry: Delta): void {
  const existing = findRequirement(document, entry.title);
  if (!existing) {
    document.lines.splice(requirementsEnd(document), 0, ...requirementBlock(entry));
    run.messages.push(`${document.name}: añadido «${entry.title}»`);
  } else if (mergeableLines(existing.body).join('\n') === mergeableLines(entry.lines).join('\n')) {
    run.messages.push(`${document.name}: «${entry.title}» ya estaba`);
  } else {
    run.errors.push(
      `${run.artifactName}: «${entry.title}» del ADDED ya está en capabilities/${document.name} con otro texto: usa MODIFIED`,
    );
  }
}

function replaceRequirement(run: Run, document: Document, entry: Delta): void {
  const existing = findRequirement(document, entry.title);
  if (!existing) {
    run.errors.push(`${run.artifactName}: «${entry.title}» del MODIFIED no está en capabilities/${document.name}`);
    return;
  }
  const lost = lostLines(existing.body, entry.lines);
  for (const line of lost) {
    run.errors.push(
      `${run.artifactName}: «${entry.title}» del MODIFIED perdería «${line}» de capabilities/${document.name}: cópiala en el delta o retírala con «- REMOVED ${line.substring(2)}»`,
    );
  }
  if (lost.length) return;
  document.lines.splice(existing.start, existing.end - existing.start, ...requirementBlock(entry));
  run.messages.push(`${document.name}: sustituido «${entry.title}»`);
}

function removeRequirement(run: Run, document: Document, entry: Delta): void {
  const existing = findRequirement(document, entry.title);
  if (!existing) {
    run.messages.push(`${document.name}: «${entry.title}» ya no estaba`);
    return;
  }
  document.lines.splice(existing.start, existing.end - existing.start);
  run.messages.push(`${document.name}: quitado «${entry.title}»`);
}

function ruleEntries(lines: string[]): Rule[] {
  const rules: Rule[] = [];
  for (const line of mergeableLines(lines)) {
    const name = /^- \*\*(.+?)\*\*:/.exec(line)?.[1];
    if (name) rules.push({ name, lines: [] });
    rules.at(-1)?.lines.push(line);
  }
  return rules;
}

function setRule(run: Run, document: Document, rule: Rule): void {
  const existing = findRule(document, rule.name);
  if (!existing) {
    document.lines.splice(ruleInsertIndex(document, rule.name), 0, ...rule.lines);
    run.messages.push(`${document.name}: regla «${rule.name}» añadida`);
    return;
  }
  document.lines.splice(existing.start, existing.end - existing.start, ...rule.lines);
  run.messages.push(`${document.name}: regla «${rule.name}» sustituida`);
}

function applyEntry(run: Run, document: Document, entry: Delta): void {
  if (entry.kind === 'ADDED') addRequirement(run, document, entry);
  else if (entry.kind === 'MODIFIED') replaceRequirement(run, document, entry);
  else if (entry.kind === 'REMOVED') removeRequirement(run, document, entry);
  else ruleEntries(entry.lines).forEach((rule) => setRule(run, document, rule));
}

function newRun(sddPath: string, artifactPath: string): Run {
  const artifactName = basename(artifactPath);
  const lines = readLines(artifactPath);
  const block = sectionLines(lines, 'Capacidades');
  return {
    capabilitiesDir: capabilitiesDir(sddPath), artifactName, isPatch: isPatch(artifactName, lines),
    declared: block ? declaredCapabilities(block) : [], entries: deltaEntries(lines), errors: [], messages: [], deleted: [],
  };
}

function entriesByCapability(entries: Delta[]): Map<string, Delta[]> {
  const groups = new Map<string, Delta[]>();
  for (const entry of entries) {
    const key = entry.capability.toLowerCase();
    groups.set(key, [...(groups.get(key) ?? []), entry]);
  }
  return groups;
}

function retirementOf(run: Run, name: string): Declared | undefined {
  return run.declared.find((item) => item.kind === 'Retiradas' && equalsIgnoringCase(item.name, name));
}

function requirementTitles(document: Document): string[] {
  return requirementsOf(sectionLines(document.lines, 'Requisitos') ?? []).map((requirement) => requirement.title);
}

function retirementProblem(retirement: Declared, left: string[]): string | undefined {
  if (left.length) {
    const titles = left.map((title) => `«${title}»`).join(', ');
    return `«${retirement.name}» está en «Retiradas» y le quedan requisitos: ${titles}`;
  }
  return retirement.summary ? undefined : `«${retirement.name}» está en «Retiradas» sin motivo: escríbelo tras el nombre, con raya`;
}

function retire(run: Run, document: Document, retirement: Declared): void {
  const problem = retirementProblem(retirement, requirementTitles(document));
  if (problem) {
    run.errors.push(`${run.artifactName}: ${problem}`);
    return;
  }
  run.deleted.push(document.file);
  run.messages.push(`${document.name}: borrado, está en «Retiradas»`);
}

function isAlreadyDeleted(run: Run, name: string, entries: Delta[]): boolean {
  return Boolean(retirementOf(run, name)) && entries.every((entry) => entry.kind === 'REMOVED') && !existsSync(join(run.capabilitiesDir, `${name}.md`));
}

function mergeCapability(run: Run, entries: Delta[]): Document | undefined {
  const name = entries[0].capability;
  if (isAlreadyDeleted(run, name, entries)) {
    run.messages.push(`${name}.md: ya estaba borrado`);
    return undefined;
  }
  const document = loadDocument(run, name);
  if (!document) return undefined;
  const hadRequirements = requirementTitles(document).length > 0;
  entries.forEach((entry) => applyEntry(run, document, entry));
  const retirement = retirementOf(run, name);
  if (retirement) retire(run, document, retirement);
  else if (hadRequirements && !requirementTitles(document).length) {
    run.errors.push(
      `${run.artifactName}: «${name}» se quedaría sin requisitos: declárala en una línea «- Retiradas:» del bloque «Capacidades» para borrar el fichero, o deja algún requisito`,
    );
  }
  return document;
}

export function mergeDelta(sddPath: string, artifactPath: string): MergeResult {
  const run = newRun(sddPath, artifactPath);
  if (!run.entries.length) return { lines: ['Sin delta que fusionar'], code: 0 };
  for (const entry of run.entries) {
    const problem = entryProblem(entry, run.artifactName);
    if (problem) run.errors.push(problem);
  }
  const documents = [...entriesByCapability(run.entries).values()].map((entries) => mergeCapability(run, entries));
  if (run.errors.length) return { lines: run.errors, code: 1 };
  documents.forEach((document) => document && !run.deleted.includes(document.file) && saveDocument(document));
  run.deleted.forEach((file) => rmSync(file));
  return { lines: run.messages, code: 0 };
}
