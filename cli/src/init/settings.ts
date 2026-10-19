import { DomainError } from '../cli/args.ts';
import { isRecord, type Json } from '../cli/records.ts';

export const INIT_SETTINGS: Json = {
  autoMemoryEnabled: false,
  extraKnownMarketplaces: {
    'sdd-kit': { source: { source: 'github', repo: 'pikachumetal/sdd-kit' }, autoUpdate: true },
    'superpowers-marketplace': { source: { source: 'github', repo: 'obra/superpowers-marketplace' }, autoUpdate: true },
  },
  enabledPlugins: {
    'sdd-kit@sdd-kit': true,
    'superpowers@superpowers-marketplace': true,
  },
};

const MEMORY_KEY = 'autoMemoryEnabled';

function noteFor(path: string, current: unknown): string {
  if (path === MEMORY_KEY && current === true) return `${MEMORY_KEY}: se deja true; pregunta al usuario si lo cambia`;
  return `${path}: se deja ${JSON.stringify(current)}`;
}

function mergeNode(target: Json, wanted: Json, prefix: string): string[] {
  const notes: string[] = [];
  for (const [key, value] of Object.entries(wanted)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (!(key in target)) target[key] = structuredClone(value);
    else if (isRecord(value)) {
      if (!isRecord(target[key])) throw new DomainError(`.claude/settings.json no se puede fusionar: ${path} no es un objeto`);
      notes.push(...mergeNode(target[key], value, path));
    } else if (target[key] !== value) notes.push(noteFor(path, target[key]));
  }
  return notes;
}

export function mergeSettings(current: Json | null, memoryOff: boolean): { merged: Json; notes: string[] } {
  const merged: Json = structuredClone(current ?? {});
  if (memoryOff) merged[MEMORY_KEY] = false;
  return { merged, notes: mergeNode(merged, INIT_SETTINGS, '') };
}
