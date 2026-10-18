import fs from 'node:fs';
import { dirname, isAbsolute, join, normalize } from 'node:path';
import { DomainError, UsageError } from '../cli/args.ts';
import { readText } from '../cli/files.ts';
import { isRecord } from '../cli/records.ts';
import type { Io } from '../cli/io.ts';
import { mergeGitignore } from './gitignore.ts';
import { finishMarker, mergeConfig, recordApproved } from './marker.ts';
import { mergeSettings } from './settings.ts';

export type InitAction = { kind: 'approved'; path: string } | { kind: 'config'; config: Record<string, unknown> } | { kind: 'finish'; ignores: string[]; memoryOff: boolean };

export interface InitOptions {
  root: string;
  action: InitAction;
  kitVersion: string;
  today: string;
}

const SETTINGS = '.claude/settings.json';
const GITIGNORE = '.gitignore';
const MARKER = '.docs/sdd/sdd-kit.json';

type Write = { file: string; before: string | null; after: string };

function readOptional(root: string, file: string): string | null {
  const path = join(root, file);
  return fs.existsSync(path) ? readText(path) : null;
}

function parseJson(root: string, file: string): Record<string, any> | null {
  const text = readOptional(root, file);
  if (text === null) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new DomainError(`${file} no es JSON válido: no se toca`);
  }
  if (!isRecord(parsed)) throw new DomainError(`${file} no se puede fusionar: la raíz no es un objeto`);
  return parsed;
}

const jsonText = (value: unknown) => `${JSON.stringify(value, null, 2)}\n`;

function plan(options: InitOptions, notes: string[]): Write[] {
  const { root, action } = options;
  const marker = parseJson(root, MARKER) ?? {};
  const markerWrite = (after: unknown): Write => ({ file: MARKER, before: readOptional(root, MARKER), after: jsonText(after) });
  if (action.kind === 'approved') return [markerWrite(recordApproved(marker, action.path))];
  if (action.kind === 'config') {
    const merged = mergeConfig(marker, action.config);
    notes.push(...merged.notes);
    return [markerWrite(merged.marker)];
  }
  const settings = mergeSettings(parseJson(root, SETTINGS), action.memoryOff);
  notes.push(...settings.notes);
  const gitignore = readOptional(root, GITIGNORE);
  return [
    { file: SETTINGS, before: readOptional(root, SETTINGS), after: jsonText(settings.merged) },
    { file: GITIGNORE, before: gitignore, after: mergeGitignore(gitignore, action.ignores) },
    markerWrite(finishMarker(marker, options.kitVersion, options.today)),
  ];
}

function sameJson(before: string | null, after: string): boolean {
  if (before === null) return false;
  try {
    return JSON.stringify(JSON.parse(before)) === JSON.stringify(JSON.parse(after));
  } catch {
    return before === after;
  }
}

function apply(root: string, write: Write): string {
  if (write.before === write.after || (write.file !== GITIGNORE && sameJson(write.before, write.after))) return `${write.file}: sin cambios`;
  const path = join(root, write.file);
  fs.mkdirSync(dirname(path), { recursive: true });
  fs.writeFileSync(path, write.after, 'utf8');
  return `${write.file}: ${write.before === null ? 'creado' : 'actualizado'}`;
}

export function validateIgnore(path: string): string {
  if (path.trim() === '' || path !== path.trim() || /[\r\n]/.test(path) || isAbsolute(path) || /^[a-zA-Z]:/.test(path) || normalize(path).split(/[\\/]/).includes('..')) {
    throw new UsageError(`--ignore debe ser una ruta relativa a la raíz, sin «..»: «${path}»`);
  }
  return path;
}

export function runInit(options: InitOptions, io: Io): number {
  if (!fs.existsSync(options.root)) throw new UsageError(`no existe la raíz: «${options.root}»`);
  const notes: string[] = [];
  const writes = plan(options, notes);
  writes.forEach((write) => io.out(apply(options.root, write)));
  notes.forEach((note) => io.out(note));
  return 0;
}
