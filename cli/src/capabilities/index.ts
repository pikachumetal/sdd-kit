import { capabilityFiles } from './files.ts';
import { readCapability } from './sections.ts';

export type IndexEntry = { name: string; purpose: string | null };

export function capabilityIndex(sddPath: string): IndexEntry[] {
  return capabilityFiles(sddPath).map((path) => {
    const { name, purpose } = readCapability(path);
    return { name, purpose: purpose || null };
  });
}

export function indexLines(entries: IndexEntry[]): string[] {
  if (!entries.length) return ['Sin capacidades'];
  return entries.map((entry) => `- \`${entry.name}\` — ${entry.purpose ?? '(sin propósito)'}`);
}
