import { isRecord, type Json } from '../cli/records.ts';

const FIXED_KEYS = ['version', 'channel', 'updated', 'init'];

function deepMerge(target: Json, source: Json): Json {
  const merged = structuredClone(target);
  for (const [key, value] of Object.entries(source)) {
    merged[key] = isRecord(value) && isRecord(merged[key]) ? deepMerge(merged[key], value) : structuredClone(value);
  }
  return merged;
}

export function recordApproved(marker: Json, path: string): Json {
  const normalized = path.replaceAll('\\', '/');
  const init = marker.init ?? {};
  const approved: string[] = init.approved ?? [];
  if (approved.includes(normalized)) return marker;
  return { ...marker, init: { ...init, approved: [...approved, normalized] } };
}

export function mergeConfig(marker: Json, config: Json): { marker: Json; notes: string[] } {
  const notes = FIXED_KEYS.filter((key) => key in config).map((key) => `${key}: la fija sdd init, se ignora`);
  const kept = Object.fromEntries(Object.entries(config).filter(([key]) => !FIXED_KEYS.includes(key)));
  if (!isRecord(marker.init) && marker.version !== undefined) return { marker: deepMerge(marker, kept), notes };
  const current: Json = isRecord(marker.init) ? marker.init : {};
  const init = { ...current, config: deepMerge(current.config ?? {}, kept) };
  return { marker: { ...marker, init }, notes };
}

function canonical(value: unknown): string {
  if (!isRecord(value)) return JSON.stringify(value);
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`).join(',')}}`;
}

export function finishMarker(marker: Json, kitVersion: string, today: string): Json {
  const { init, updated, version, channel, ...rest } = marker;
  const body = deepMerge(rest, init?.config ?? {});
  const finished = { version: version ?? kitVersion, channel: 'plugin', ...body };
  const unchanged = init === undefined && updated !== undefined && canonical(finished) === canonical({ version, channel, ...rest });
  return { ...finished, updated: unchanged ? updated : today };
}
