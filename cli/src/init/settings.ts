import { DomainError } from '../cli/args.ts';

type JsonObject = Record<string, any>;

export const INIT_SETTINGS: JsonObject = {
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

function isObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function noteFor(path: string, current: unknown): string {
  if (path === MEMORY_KEY && current === true) return `${MEMORY_KEY}: se deja true; pregunta al usuario si lo cambia`;
  return `${path}: se deja ${JSON.stringify(current)}`;
}

function mergeNode(target: JsonObject, wanted: JsonObject, prefix: string, notes: string[]): void {
  for (const [key, value] of Object.entries(wanted)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (!(key in target)) target[key] = structuredClone(value);
    else if (isObject(value)) {
      if (!isObject(target[key])) throw new DomainError(`.claude/settings.json no se puede fusionar: ${path} no es un objeto`);
      mergeNode(target[key], value, path, notes);
    } else if (target[key] !== value) notes.push(noteFor(path, target[key]));
  }
}

export function mergeSettings(current: unknown, memoryOff: boolean): { merged: JsonObject; notes: string[] } {
  if (current !== null && !isObject(current)) throw new DomainError('.claude/settings.json no se puede fusionar: la raíz no es un objeto');
  const merged: JsonObject = structuredClone(current ?? {});
  if (memoryOff) merged[MEMORY_KEY] = false;
  const notes: string[] = [];
  mergeNode(merged, INIT_SETTINGS, '', notes);
  return { merged, notes };
}
