import { existsSync } from 'node:fs';
import { DomainError } from '../cli/args.ts';
import { kitConfigPath, readText } from '../cli/files.ts';

export interface MergePolicy {
  into: string;
  noFf: boolean;
}

function parseConfig(configPath: string): { merge?: { into?: unknown; noFf?: unknown } } | null {
  try {
    return JSON.parse(readText(configPath));
  } catch {
    throw new DomainError(`política: '${configPath}' no es un JSON válido.`);
  }
}

export function configuredMergeInto(projectRoot: string): string | null {
  const configPath = kitConfigPath(projectRoot);
  if (!existsSync(configPath)) return null;
  const into = parseConfig(configPath)?.merge?.into;
  return typeof into === 'string' && into.trim() !== '' ? into : null;
}

export function resolveMergePolicy(projectRoot: string): MergePolicy {
  const configPath = kitConfigPath(projectRoot);
  if (!existsSync(configPath)) throw new DomainError(`política: no existe '${configPath}'.`);
  const { into, noFf } = parseConfig(configPath)?.merge ?? {};
  if (typeof into !== 'string' || into.trim() === '' || noFf === undefined || noFf === null) {
    throw new DomainError(`política: falta 'merge.into' o 'merge.noFf' en '${configPath}'.`);
  }
  return { into, noFf: Boolean(noFf) };
}
