// El registro de fuentes (upstream.json): de qué repo, en qué versión y con qué rutas sale cada copia o concepto del kit.
import { readFileSync } from 'node:fs';
import { BuildError } from './errors.ts';

export interface Source {
  repo: string;
  tagPrefix: string;
  license: string;
  copyright: string;
}

export interface Entry {
  kind: 'copy' | 'concept';
  source: string;
  version: string;
  paths: string[];
  kit: string[];
  note?: string;
}

export interface Registry {
  sources: Record<string, Source>;
  entries: Entry[];
}

const KINDS = ['copy', 'concept'];

export function validateRegistry(registry: Registry): Registry {
  registry.entries.forEach((entry, index) => {
    const at = `upstream.json: la entrada ${index + 1}`;
    if (!KINDS.includes(entry.kind)) throw new BuildError(`${at} tiene kind «${entry.kind}»; vale copy o concept`);
    if (!(entry.source in registry.sources)) throw new BuildError(`${at} nombra la fuente «${entry.source}», que no está en sources`);
  });
  return registry;
}

export function readRegistry(path: string): Registry {
  return validateRegistry(JSON.parse(readFileSync(path, 'utf8')));
}
