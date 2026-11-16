import { fileURLToPath } from 'node:url';
import { DomainError } from '../cli/args.ts';
import { readText } from '../cli/files.ts';
import { isRecord, type Json } from '../cli/records.ts';
import { jsonText, parseJson, readOptional, writeChange } from './json-file.ts';

const SOURCE = fileURLToPath(new URL('../../../hooks/project/sdd-kit-loaded.mjs', import.meta.url));
const SETTINGS = '.claude/settings.json';
const NOT_MERGEABLE = `${SETTINGS} no se puede fusionar`;

export const PROJECT_HOOK_SCRIPT = '.claude/hooks/sdd-kit-loaded.mjs';
export const projectHookSource = (): string => readText(SOURCE);

export function withProjectHook(settings: Json): Json {
  const hooks = settings.hooks ?? {};
  if (!isRecord(hooks)) throw new DomainError(`${NOT_MERGEABLE}: hooks no es un objeto`);
  const entries = hooks.UserPromptSubmit ?? [];
  if (!Array.isArray(entries)) throw new DomainError(`${NOT_MERGEABLE}: hooks.UserPromptSubmit no es una lista`);
  if (JSON.stringify(entries).includes('sdd-kit-loaded.mjs')) return settings;
  const entry = { hooks: [{ type: 'command', command: `node "\${CLAUDE_PROJECT_DIR}/${PROJECT_HOOK_SCRIPT}"` }] };
  return { ...settings, hooks: { ...hooks, UserPromptSubmit: [...entries, entry] } };
}

function writeIfChanged(root: string, file: string, content: string): string {
  const before = readOptional(root, file);
  return before === content ? `${file}: sin cambios` : writeChange(root, file, before, content);
}

// el script antes que la entrada: una entrada sin su fichero haría fallar a node en cada mensaje
export function installProjectHook(root: string): string[] {
  const settings = parseJson(root, SETTINGS) ?? {};
  const next = withProjectHook(settings);
  const scriptLine = writeIfChanged(root, PROJECT_HOOK_SCRIPT, projectHookSource());
  const settingsLine = next === settings ? `${SETTINGS}: sin cambios` : writeIfChanged(root, SETTINGS, jsonText(next));
  return [settingsLine, scriptLine];
}
