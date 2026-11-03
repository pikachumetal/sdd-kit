// El registro de fuentes (upstream.json): de qué repo, en qué versión y con qué rutas sale cada copia o concepto del kit.
import { readFileSync } from 'node:fs';
import { BuildError } from './errors.ts';

export interface Source {
  repo: string;
  tagPrefix: string;
  license: string;
  copyright: string;
  notCopied?: string[];
}

export interface FromRef {
  source: string;
  version: string;
  path: string;
}

export interface Entry {
  kind: 'copy' | 'concept';
  source: string;
  version: string;
  paths: string[];
  kit: string[];
  note?: string;
  pending?: string;
  from?: FromRef[];
}

export interface Registry {
  sources: Record<string, Source>;
  entries: Entry[];
  own?: string[];
}

export interface WatchedRef {
  source: string;
  version: string;
  paths: string[];
}

const KINDS = ['copy', 'concept'];
const UNCLASSIFIED = 'no está clasificado en upstream.json: ponlo en una entrada copy o en own';

function validateEntry(registry: Registry, entry: Entry, at: string): void {
  if (!KINDS.includes(entry.kind)) throw new BuildError(`${at} tiene kind «${entry.kind}»; vale copy o concept`);
  for (const source of [entry.source, ...(entry.from ?? []).map((ref) => ref.source)])
    if (!(source in registry.sources)) throw new BuildError(`${at} nombra la fuente «${source}», que no está en sources`);
  const grouped = entry.kit.length !== 1 || entry.paths.length !== 1;
  if (entry.kind === 'copy' && entry.pending === undefined && grouped)
    throw new BuildError(`${at} es una copia sin pending con más de un fichero; una copia anotada va fichero a fichero`);
}

export function validateRegistry(registry: Registry): Registry {
  registry.entries.forEach((entry, index) => validateEntry(registry, entry, `upstream.json: la entrada ${index + 1}`));
  return registry;
}

export function readRegistry(path: string): Registry {
  return validateRegistry(JSON.parse(readFileSync(path, 'utf8')));
}

// La entrada con sus from, una referencia por fuente y versión, en el orden en que aparecen.
export function watchedRefs(entry: Entry): WatchedRef[] {
  const refs: WatchedRef[] = [{ source: entry.source, version: entry.version, paths: [...entry.paths] }];
  for (const ref of entry.from ?? []) {
    const same = refs.find((watched) => watched.source === ref.source && watched.version === ref.version);
    if (!same) refs.push({ source: ref.source, version: ref.version, paths: [ref.path] });
    else if (!same.paths.includes(ref.path)) same.paths.push(ref.path);
  }
  return refs;
}

const covers = (path: string, file: string): boolean => (path.endsWith('/') ? file.startsWith(path) : file === path);

export function classify(registry: Registry, files: string[]): string[] {
  const copies = registry.entries.filter((entry) => entry.kind === 'copy').flatMap((entry) => entry.kit);
  const own = registry.own ?? [];
  return files
    .filter((file) => !file.endsWith('/NOTICE'))
    .filter((file) => copies.filter((path) => covers(path, file)).length + own.filter((path) => covers(path, file)).length !== 1)
    .map((file) => `${file} ${UNCLASSIFIED}`);
}
