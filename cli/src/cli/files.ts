import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const SDD_KIT_CONFIG = '.docs/sdd/sdd-kit.json';
const BYTE_ORDER_MARK = /^\uFEFF/;

export function kitConfigPath(root: string): string {
  return join(root, SDD_KIT_CONFIG);
}

export function readText(file: string): string {
  return readFileSync(file, 'utf8').replace(BYTE_ORDER_MARK, '');
}

export function readLines(file: string): string[] {
  const lines = readText(file).split(/\r\n|\n|\r/);
  if (lines.at(-1) === '') lines.pop();
  return lines;
}
