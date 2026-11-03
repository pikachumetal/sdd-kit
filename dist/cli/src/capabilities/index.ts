import { capabilityFiles } from './files.ts';
import { isNotCapability, readCapability } from './sections.ts';

export type IndexEntry = { name: string; purpose: string | null };

export function capabilityIndex(sddPath: string): IndexEntry[] {
  return capabilityFiles(sddPath)
    .map(readCapability)
    .filter(({ lines }) => !isNotCapability(lines))
    .map(({ name, purpose }) => ({ name, purpose: purpose || null }));
}

export function indexLines(entries: IndexEntry[]): string[] {
  if (!entries.length) return ['Sin capacidades'];
  return entries.map((entry) => `- \`${entry.name}\` — ${entry.purpose ?? '(sin propósito)'}`);
}
