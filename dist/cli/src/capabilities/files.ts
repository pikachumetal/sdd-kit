import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

export function capabilitiesDir(sddPath: string): string {
  return join(sddPath, 'capabilities');
}

export function capabilityFiles(sddPath: string): string[] {
  const dir = capabilitiesDir(sddPath);
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith('.md'))
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right))
    .map((name) => join(dir, name));
}
