import { roundHalfAwayFromZero, formatNumber } from './numbers.ts';

export type Warn = (message: string) => void;

export const ESTIMATE_LABEL = String.raw`Estimaci[oó]n de implementaci[oó]n(?: \([^)]*\))?|Estimaci[oó]n`;
export const REAL_LABEL = String.raw`Esfuerzo real de implementaci[oó]n|Esfuerzo real|Real`;
export const THREAD_TOKENS_LABEL = 'Tokens del hilo';
export const SUBAGENT_TOKENS_LABEL = 'Tokens de subagentes|Coste de subagentes';
export const SUBJECT_COST_LABEL = 'Coste de los sujetos headless|Coste de sujetos';
export const SESSION_COST_LABEL = String.raw`Coste de la sesi[oó]n`;

const NUMBER_PREFIX = String.raw`^[\s*~≈≃]*(\d+(?:[.,]\d+)?)`;
const NOT_WORD_AFTER = String.raw`(?![\p{L}\p{N}_])`;
const DECLARED_ABSENCES = ['no medido', 'no aplica', 'sin precio'];

export function getFieldText(content: string, label: string): string | null {
  const field = new RegExp(String.raw`^\s*-\s*\**(?:${label})\**\s*:\s*([^\n]*)$`, 'imu');
  return field.exec(content)?.[1] ?? null;
}

export function getTimeSection(content: string, heading: string): string | null {
  const section = new RegExp(String.raw`${heading}[\s\S]*?(?=\n#+\s|(?![\s\S]))`, 'imu');
  return section.exec(content)?.[0] ?? null;
}

const isBlank = (text: string): boolean => text.trim() === '';
const toNumber = (text: string) => Number(text.replace(',', '.'));

export function toHours(text: string | null, source: string, warn: Warn): number | null {
  if (text === null || isBlank(text)) return null;
  const head = new RegExp(String.raw`${NUMBER_PREFIX}\s*\**\s*([\p{L}\p{Mn}]+)?`, 'iu').exec(text);
  if (!head) return null;
  const amount = toNumber(head[1]!);
  const unit = head[2];
  if (unit === undefined || /^(?:h|horas?)$/i.test(unit)) return amount + minutesAfterHours(text) / 60;
  if (/^(?:min|mins|minutos?)$/i.test(unit)) return amount / 60;
  warn(`Unidad de tiempo no reconocida en '${text.trim()}': ${source}. Celda vacía.`);
  return null;
}

function minutesAfterHours(text: string): number {
  const tail = new RegExp(
    String.raw`${NUMBER_PREFIX}\s*\**\s*(?:h|horas?)\s*(?:y\s+)?(\d+)\s*(?:min|mins|minutos?)${NOT_WORD_AFTER}`,
    'iu',
  );
  return Number(tail.exec(text)?.[2] ?? 0);
}

function declaredAbsence(text: string | null): string | null {
  if (text === null || isBlank(text)) return null;
  const normalized = text.replaceAll('*', '').trim().toLowerCase();
  return DECLARED_ABSENCES.find((answer) => normalized.startsWith(answer)) ?? null;
}

function removeThousandsSeparator(text: string): string {
  return text.replace(/(?<=\d)\.(?=\d{3}(?!\d))/g, '');
}

export function toThousands(raw: string | null): string | null {
  const absence = declaredAbsence(raw);
  if (absence !== null) return absence;
  const head = new RegExp(String.raw`${NUMBER_PREFIX}\s*([kKmM])?`, 'u').exec(removeThousandsSeparator(raw ?? ''));
  if (!head) return null;
  const amount = toNumber(head[1]!);
  const unit = head[2]?.toLowerCase();
  const thousands = unit === 'm' ? amount * 1000 : unit === 'k' ? amount : amount / 1000;
  return `${roundHalfAwayFromZero(thousands, 0)}k`;
}

export function toMoney(raw: string | null): string | null {
  const absence = declaredAbsence(raw);
  if (absence !== null) return absence;
  const head = new RegExp(String.raw`${NUMBER_PREFIX}\s*\$`, 'u').exec(removeThousandsSeparator(raw ?? ''));
  return head ? formatNumber(toNumber(head[1]!)) : null;
}
