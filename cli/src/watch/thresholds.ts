import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { caseInsensitiveGet, isRecord } from '../cli/records.ts';
import { readText } from '../estimation/text.ts';
import type { Thresholds } from './verdict.ts';

const DEFAULT_THRESHOLDS: Thresholds = { betweenStepsMinutes: 8, longCommandMinutes: 20 };

const isValidMinutes = (value: unknown): value is number => typeof value === 'number' && value > 0;

function readSilence(configPath: string): unknown {
  try {
    const config: unknown = JSON.parse(readText(configPath));
    const control = isRecord(config) ? caseInsensitiveGet(config, 'control') : undefined;
    return isRecord(control) ? caseInsensitiveGet(control, 'silence') : undefined;
  } catch {
    return undefined;
  }
}

export function readThresholds(worktreePath: string): Thresholds {
  const thresholds = { ...DEFAULT_THRESHOLDS };
  const configPath = join(worktreePath, '.docs/sdd/sdd-kit.json');
  const silence = existsSync(configPath) ? readSilence(configPath) : undefined;
  if (!isRecord(silence)) return thresholds;
  for (const key of Object.keys(thresholds) as Array<keyof Thresholds>) {
    const value = caseInsensitiveGet(silence, key);
    if (isValidMinutes(value)) thresholds[key] = value;
  }
  return thresholds;
}
