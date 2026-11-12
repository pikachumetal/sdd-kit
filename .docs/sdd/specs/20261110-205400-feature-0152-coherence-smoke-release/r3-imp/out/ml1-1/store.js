import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const file = 'data/bookings.json';

export function load(fallback) {
  if (!existsSync(file)) return fallback;
  return JSON.parse(readFileSync(file, 'utf8'));
}

export function save(bookings) {
  mkdirSync('data', { recursive: true });
  writeFileSync(file, JSON.stringify(bookings, null, 2));
}
