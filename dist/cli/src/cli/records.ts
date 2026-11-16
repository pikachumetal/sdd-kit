export type Json = Record<string, any>;

export const isRecord = (value: unknown): value is Json => typeof value === 'object' && value !== null && !Array.isArray(value);

export function caseInsensitiveGet(record: Json, key: string): unknown {
  const found = Object.keys(record).find((candidate) => candidate.toLowerCase() === key.toLowerCase());
  return found === undefined ? undefined : record[found];
}

export const sameText = (value: unknown, expected: string): boolean => typeof value === 'string' && value.toLowerCase() === expected.toLowerCase();

export const toCount = (value: unknown): number => Math.round(Number(value ?? 0)) || 0;

export const compare = <T extends number | string>(first: T, second: T): number => (first < second ? -1 : first > second ? 1 : 0);
