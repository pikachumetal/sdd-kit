import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const file = () => resolve('data', 'bookings.json');

export function load(fallback) {
  if (!existsSync(file())) return fallback;
  return JSON.parse(readFileSync(file(), 'utf8'));
}

export function save(bookings) {
  mkdirSync(dirname(file()), { recursive: true });
  writeFileSync(file(), JSON.stringify(bookings, null, 2));
}
