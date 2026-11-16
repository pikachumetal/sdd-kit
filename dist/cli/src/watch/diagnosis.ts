import { isRecord } from '../cli/records.ts';
import type { Json } from '../cli/records.ts';
import { hasHookAfter, outputTokens, type ToolUse } from './events.ts';

const MAX_VALUE_LENGTH = 60;

export function formatEventTime(timestamp: unknown): string {
  const millis = timestamp == null ? NaN : Date.parse(String(timestamp));
  if (Number.isNaN(millis)) return 'hora desconocida';
  return `${new Date(millis).toISOString().slice(11, 19)}Z`;
}

function powerShellText(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'boolean') return value ? 'True' : 'False';
  return typeof value === 'object' ? JSON.stringify(value) : String(value);
}

function formatInputValue(name: string, value: unknown): string {
  const raw = powerShellText(value);
  const text = name === 'file_path' ? (raw.split(/[\\/]/).at(-1) ?? '') : raw;
  return text.length <= MAX_VALUE_LENGTH ? text : `${text.slice(0, MAX_VALUE_LENGTH - 3)}...`;
}

function formatToolInput(toolInput: unknown): string {
  if (!isRecord(toolInput)) return '';
  return Object.entries(toolInput).slice(0, 3).map(([name, value]) => `${name} ${formatInputValue(name, value)}`).join(', ');
}

export function diagnosis(events: Json[], lastUse: ToolUse | undefined, pending: boolean): string[] {
  const tokens = `${outputTokens(events)} tokens de salida`;
  if (lastUse === undefined) return [`Último evento: ${formatEventTime(events.at(-1)?.timestamp)} · sin llamada a herramienta`, tokens];
  const result = pending ? 'sin tool_result' : 'con tool_result';
  const preToolUse = hasHookAfter(events, lastUse, 'PreToolUse') ? 'PreToolUse: sí' : 'PreToolUse: sin PreToolUse';
  const permission = hasHookAfter(events, lastUse, 'PermissionRequest') ? 'petición de permiso pendiente' : 'sin petición de permiso';
  const call = `${lastUse.call.name} ${formatToolInput(lastUse.call.input)}`.trim();
  return [`Último evento: ${formatEventTime(lastUse.timestamp)} · ${call} · ${result}`, preToolUse, `Petición de permiso: ${permission}`, tokens];
}
