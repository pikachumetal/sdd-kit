import { parseArgs } from 'node:util';
import type { Verb, VerbArgs } from './verbs.ts';

export class UsageError extends Error {}

export class DomainError extends Error {}

const PARSE_ERRORS: Record<string, string> = {
  ERR_PARSE_ARGS_UNKNOWN_OPTION: 'opción desconocida',
  ERR_PARSE_ARGS_INVALID_OPTION_VALUE: 'valor no válido para la opción',
  ERR_PARSE_ARGS_UNEXPECTED_POSITIONAL: 'argumento inesperado',
};

function toUsageError(error: unknown): UsageError {
  const { code = '', message = String(error) } = error as { code?: string; message?: string };
  const token = /'([^' ]+)/.exec(message)?.[1] ?? '';
  return new UsageError(`${PARSE_ERRORS[code] ?? message}: «${token}»`);
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
    throw toUsageError(error);
  }
}

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

