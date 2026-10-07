import { readText } from '../estimation/text.ts';
import { DomainError } from './args.ts';

export function parseJsonFile(file: string): unknown {
  try {
    return JSON.parse(readText(file));
  } catch {
    throw new DomainError(`no se pudo leer ${file}: no es un JSON válido`);
  }
}
