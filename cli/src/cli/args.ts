import { join } from 'node:path';
import { parseArgs } from 'node:util';
import type { Verb, VerbArgs } from './verbs.ts';

export class UsageError extends Error {}

export class DomainError extends Error {}

const PARSE_ERRORS: Record<string, string> = {
  ERR_PARSE_ARGS_UNKNOWN_OPTION: 'opción desconocida',
  ERR_PARSE_ARGS_INVALID_OPTION_VALUE: 'valor no válido para la opción',
  ERR_PARSE_ARGS_UNEXPECTED_POSITIONAL: 'argumento inesperado',
};

const PROJECT_ROOT = 'project-root';
const ROOT_ALIASES = ['--path', '--root'];

function rootHint(verb: Verb, code: string, token: string): string {
  const misplaced = code === 'ERR_PARSE_ARGS_UNKNOWN_OPTION' && ROOT_ALIASES.includes(token) && PROJECT_ROOT in verb.options;
  return misplaced ? `; la raíz del proyecto va en --${PROJECT_ROOT}` : '';
}

function toUsageError(error: unknown, verb: Verb): UsageError {
  const { code = '', message = String(error) } = error as { code?: string; message?: string };
  const token = /'([^' ]+)/.exec(message)?.[1] ?? '';
  return new UsageError(`${PARSE_ERRORS[code] ?? message}: «${token}»${rootHint(verb, code, token)}`);
}

export function parseVerbArgs(verb: Verb, argv: string[]): VerbArgs {
  try {
    const { values, positionals, tokens } = parseArgs({
      args: argv,
      options: verb.options,
      allowPositionals: verb.positionals !== undefined,
      strict: true,
      tokens: true,
    });
    return { values, positionals, hasSeparator: tokens.some((token) => token.kind === 'option-terminator') };
  } catch (error) {
    throw toUsageError(error, verb);
  }
}

export function rootOption(args: VerbArgs, legacy: 'path' | 'root', fromRoot: (root: string) => string): string | null {
  const own = text(args, legacy);
  const root = text(args, PROJECT_ROOT);
  if (own !== null && root !== null) throw new UsageError(`--${legacy} y --${PROJECT_ROOT} no van juntas`);
  return root === null ? own : fromRoot(root);
}

export function requiredRootOption(args: VerbArgs, legacy: 'path' | 'root', fromRoot: (root: string) => string): string {
  const value = rootOption(args, legacy, fromRoot);
  if (value === null) throw new UsageError(`falta la opción --${legacy}`);
  return value;
}

export const docsFolder = (root: string): string => join(root, '.docs', 'sdd');

export function requiredOption(args: VerbArgs, name: string): string {
  const value = args.values[name];
  if (typeof value !== 'string') throw new UsageError(`falta la opción --${name}`);
  return value;
}

const DEFAULT_LOCK_TIMEOUT_MINUTES = 30;

export function text(args: VerbArgs, name: string): string | null {
  const value = args.values[name];
  return typeof value === 'string' ? value : null;
}

export function lockTimeoutOption(args: VerbArgs, defaultMinutes = DEFAULT_LOCK_TIMEOUT_MINUTES): number {
  const raw = text(args, 'lock-timeout');
  if (raw === null) return defaultMinutes;
  const minutes = Number(raw);
  if (raw === '' || !Number.isFinite(minutes) || minutes < 0) throw new UsageError('--lock-timeout debe ser un número de minutos');
  return minutes;
}

