import fs from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DomainError } from '../cli/args.ts';
import { readText } from '../cli/files.ts';
import { isRecord, type Json } from '../cli/records.ts';

const SOURCE = fileURLToPath(new URL('../../../hooks/project/sdd-kit-loaded.mjs', import.meta.url));
const SETTINGS = '.claude/settings.json';
const COMMAND_FILE = 'sdd-kit-loaded.mjs';
const NOT_MERGEABLE = `${SETTINGS} no se puede fusionar`;

export const PROJECT_HOOK_SCRIPT = '.claude/hooks/sdd-kit-loaded.mjs';
export const projectHookSource = (): string => readText(SOURCE);

function readSettings(root: string): Json {
  const path = join(root, SETTINGS);
  if (!fs.existsSync(path)) return {};
  let parsed: unknown;
  try {
    parsed = JSON.parse(readText(path));
  } catch {
    throw new DomainError(`${SETTINGS} no es JSON válido: no se toca`);
  }
  if (!isRecord(parsed)) throw new DomainError(`${NOT_MERGEABLE}: la raíz no es un objeto`);
  return parsed;
}

export function withProjectHook(settings: Json): Json {
  const hooks = settings.hooks ?? {};
  if (!isRecord(hooks)) throw new DomainError(`${NOT_MERGEABLE}: hooks no es un objeto`);
  const entries = hooks.UserPromptSubmit ?? [];
  if (!Array.isArray(entries)) throw new DomainError(`${NOT_MERGEABLE}: hooks.UserPromptSubmit no es una lista`);
  if (JSON.stringify(entries).includes(COMMAND_FILE)) return settings;
  const entry = { hooks: [{ type: 'command', command: `node "\${CLAUDE_PROJECT_DIR}/${PROJECT_HOOK_SCRIPT}"` }] };
  return { ...settings, hooks: { ...hooks, UserPromptSubmit: [...entries, entry] } };
}

export function installProjectHook(root: string): string[] {
  const settings = readSettings(root);
  const next = withProjectHook(settings);
  fs.mkdirSync(dirname(join(root, PROJECT_HOOK_SCRIPT)), { recursive: true });
  fs.writeFileSync(join(root, PROJECT_HOOK_SCRIPT), projectHookSource(), 'utf8');
  if (next === settings) return [`${PROJECT_HOOK_SCRIPT}: escrito`, `${SETTINGS}: el hook ya estaba`];
  fs.writeFileSync(join(root, SETTINGS), `${JSON.stringify(next, null, 2)}\n`, 'utf8');
  return [`${PROJECT_HOOK_SCRIPT}: escrito`, `${SETTINGS}: hook añadido`];
}
