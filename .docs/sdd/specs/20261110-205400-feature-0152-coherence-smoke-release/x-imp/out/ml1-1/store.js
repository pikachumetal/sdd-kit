import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const dir = 'data';
const file = join(dir, 'bookings.json');

export function load(fallback) {
  if (!existsSync(file)) return fallback;
  return JSON.parse(readFileSync(file, 'utf8'));
}

export function save(bookings) {
  mkdirSync(dir, { recursive: true });
  writeFileSync(file, JSON.stringify(bookings, null, 2));
}
