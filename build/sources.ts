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
  if (entry.kind === 'concept' && (entry.pending !== undefined || entry.from !== undefined))
    throw new BuildError(`${at} es un concepto con pending o from; esos campos son de una copia`);
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

// Una referencia por fuente y versión, con sus rutas sin repetir, en el orden en que aparecen.
export function mergeRefs(refs: WatchedRef[]): WatchedRef[] {
  const merged: WatchedRef[] = [];
  for (const ref of refs) {
    const same = merged.find((group) => group.source === ref.source && group.version === ref.version);
    if (!same) merged.push({ ...ref, paths: [...new Set(ref.paths)] });
    else same.paths.push(...ref.paths.filter((path) => !same.paths.includes(path)));
  }
  return merged;
}

export function watchedRefs(entry: Entry): WatchedRef[] {
  const fragments = (entry.from ?? []).map((ref) => ({ source: ref.source, version: ref.version, paths: [ref.path] }));
  return mergeRefs([{ source: entry.source, version: entry.version, paths: entry.paths }, ...fragments]);
}

const covers = (path: string, file: string): boolean => (path.endsWith('/') ? file.startsWith(path) : file === path);

// Una copia sin pending gana a la carpeta pending que la contiene; una copia con pending es pending, también si su kit es un fichero.
export function kindOf(registry: Registry, file: string): 'own' | 'copy' | 'pending' | null {
  if ((registry.own ?? []).some((path) => covers(path, file))) return 'own';
  const copies = registry.entries.filter((entry) => entry.kind === 'copy' && entry.kit.some((path) => covers(path, file)));
  if (copies.some((entry) => entry.pending === undefined)) return 'copy';
  return copies.length > 0 ? 'pending' : null;
}

// Una copia con pending y kit de carpeta solo clasifica lo que nada más clasifica: su carpeta puede contener copias ya fichero a fichero.
export function classify(registry: Registry, files: string[]): string[] {
  const copies = registry.entries.filter((entry) => entry.kind === 'copy');
  const kits = copies.flatMap((entry) => entry.kit.map((path) => ({ path, yields: entry.pending !== undefined && path.endsWith('/') })));
  const firm = [...kits.filter((kit) => !kit.yields).map((kit) => kit.path), ...(registry.own ?? [])];
  const pending = kits.filter((kit) => kit.yields).map((kit) => kit.path);
  const count = (paths: string[], file: string): number => paths.filter((path) => covers(path, file)).length;
  return files
    .filter((file) => !file.endsWith('/NOTICE'))
    .filter((file) => (count(firm, file) === 0 ? count(pending, file) === 0 : count(firm, file) > 1))
    .map((file) => `${file} ${UNCLASSIFIED}`);
}
