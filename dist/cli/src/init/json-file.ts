import fs from 'node:fs';
import { dirname, join } from 'node:path';
import { DomainError } from '../cli/args.ts';
import { readText } from '../cli/files.ts';
import { isRecord } from '../cli/records.ts';

export function readOptional(root: string, file: string): string | null {
  const path = join(root, file);
  return fs.existsSync(path) ? readText(path) : null;
}

export function parseJson(root: string, file: string): Record<string, any> | null {
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

export const jsonText = (value: unknown): string => `${JSON.stringify(value, null, 2)}\n`;

export function writeChange(root: string, file: string, before: string | null, after: string): string {
  const path = join(root, file);
  fs.mkdirSync(dirname(path), { recursive: true });
  fs.writeFileSync(path, after, 'utf8');
  return `${file}: ${before === null ? 'creado' : 'actualizado'}`;
}
