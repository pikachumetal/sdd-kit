import { mkdirSync, writeFileSync } from 'node:fs';

export function writeExport(month, ics) {
  mkdirSync('exports', { recursive: true });
  const path = `exports/${month}.ics`;
  writeFileSync(path, ics);
  return path;
}
