type JsonObject = Record<string, any>;

const FIXED_KEYS = ['version', 'channel', 'updated', 'init'];

function isObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function deepMerge(target: JsonObject, source: JsonObject): JsonObject {
  const merged = structuredClone(target);
  for (const [key, value] of Object.entries(source)) {
    merged[key] = isObject(value) && isObject(merged[key]) ? deepMerge(merged[key], value) : structuredClone(value);
  }
  return merged;
}

export function recordApproved(marker: JsonObject, path: string): JsonObject {
  const normalized = path.replaceAll('\\', '/');
  const init = marker.init ?? {};
  const approved: string[] = init.approved ?? [];
  if (approved.includes(normalized)) return marker;
  return { ...marker, init: { ...init, approved: [...approved, normalized] } };
}

export function mergeConfig(marker: JsonObject, config: JsonObject): { marker: JsonObject; notes: string[] } {
  const notes = FIXED_KEYS.filter((key) => key in config).map((key) => `${key}: la fija sdd init, se ignora`);
  const kept = Object.fromEntries(Object.entries(config).filter(([key]) => !FIXED_KEYS.includes(key)));
  if (!isObject(marker.init)) return { marker: deepMerge(marker, kept), notes };
  const init = { ...marker.init, config: deepMerge(marker.init.config ?? {}, kept) };
  return { marker: { ...marker, init }, notes };
}

function canonical(value: unknown): string {
  if (!isObject(value)) return JSON.stringify(value);
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`).join(',')}}`;
}

export function finishMarker(marker: JsonObject, kitVersion: string, today: string): JsonObject {
  const { init, updated, version, channel, ...rest } = marker;
  const body = deepMerge(rest, init?.config ?? {});
  const finished = { version: version ?? kitVersion, channel: 'plugin', ...body };
  const unchanged = init === undefined && updated !== undefined && canonical(finished) === canonical({ version, channel, ...rest });
  return { ...finished, updated: unchanged ? updated : today };
}
