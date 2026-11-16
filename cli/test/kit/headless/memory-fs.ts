import { dirname, join, normalize } from 'node:path';

export interface CampaignFs {
  exists(path: string): boolean;
  read(path: string): string;
  write(path: string, text: string): void;
  remove(path: string): void;
  list(dir: string): string[];
  mkdir(dir: string): void;
}

export interface MemoryFs extends CampaignFs {
  files: Map<string, string>;
}

export function memoryFs(): MemoryFs {
  const files = new Map<string, string>();
  const dirs = new Set<string>();
  const addParents = (path: string) => {
    for (let dir = dirname(path); dir !== dirname(dir); dir = dirname(dir)) dirs.add(dir);
  };
  const childrenOf = (dir: string) =>
    [...files.keys(), ...dirs].filter((path) => dirname(path) === normalize(dir)).map((path) => path.slice(normalize(dir).length + 1));
  return {
    files,
    exists: (path) => files.has(normalize(path)) || dirs.has(normalize(path)),
    read: (path) => {
      const text = files.get(normalize(path));
      if (text === undefined) throw Object.assign(new Error(`ENOENT: ${path}`), { code: 'ENOENT' });
      return text;
    },
    write: (path, text) => {
      files.set(normalize(path), text);
      addParents(normalize(path));
    },
    remove: (path) => {
      const target = normalize(path);
      for (const key of [...files.keys()]) if (key === target || key.startsWith(join(target, '/'))) files.delete(key);
      dirs.delete(target);
    },
    list: (dir) => [...new Set(childrenOf(dir))].sort(),
    mkdir: (dir) => {
      dirs.add(normalize(dir));
      addParents(join(normalize(dir), 'x'));
    },
  };
}
