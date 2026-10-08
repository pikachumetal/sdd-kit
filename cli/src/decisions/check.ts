import { globToRegExp } from './glob.ts';
import { readDecisions } from './document.ts';
import type { Decision } from './document.ts';

export interface CheckResult {
  lines: string[];
  code: number;
}

export const SECTIONS = ['## Contexto y problema', '## Opciones consideradas', '## Decisión', '### Consecuencias', '### Confirmación'];
const NAME = /^\d{4}-[a-z0-9-]+\.md$/;
const STATUS = /^(?:proposed|accepted|rejected|deprecated|superseded by (\d{4}))$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

function statusProblems({ file, status }: Decision, numbers: Set<string | null>): string[] {
  const match = STATUS.exec(status ?? '');
  if (match === null) return [`${file}: status «${status ?? ''}» no es proposed, accepted, rejected, deprecated ni superseded by NNNN`];
  const target = match[1];
  return target === undefined || numbers.has(target) ? [] : [`${file}: sustituida por ${target}, que no existe`];
}

function rutasProblems({ file, rutas }: Decision): string[] {
  if (rutas.length === 0) return [`${file}: falta rutas`];
  return rutas.filter((glob) => globToRegExp(glob) === null).map((glob) => `${file}: glob no soportado «${glob}»`);
}

function sectionProblems({ file, sections }: Decision): string[] {
  const problems: string[] = [];
  let previous: { name: string; at: number } | null = null;
  for (const name of SECTIONS) {
    const at = sections.indexOf(name);
    if (at === -1) problems.push(`${file}: falta la sección «${name}»`);
    else if (previous !== null && at < previous.at) problems.push(`${file}: «${previous.name}» va antes que «${name}»`);
    if (at !== -1) previous = { name, at };
  }
  return problems;
}

function decisionProblems(decision: Decision, numbers: Set<string | null>): string[] {
  return [
    ...(NAME.test(decision.file) ? [] : [`${decision.file}: el nombre no es NNNN-<slug>.md`]),
    ...statusProblems(decision, numbers),
    ...(DATE.test(decision.date ?? '') ? [] : [`${decision.file}: date «${decision.date ?? ''}» no es AAAA-MM-DD`]),
    ...rutasProblems(decision),
    ...sectionProblems(decision),
  ];
}

function repeatedNumbers(decisions: Decision[]): string[] {
  const byNumber = Map.groupBy(decisions.filter((decision) => decision.number !== null), (decision) => decision.number!);
  return [...byNumber]
    .filter(([, group]) => group.length > 1)
    .map(([number, group]) => `número ${number} repetido: ${group.map((decision) => decision.file).join(', ')}`);
}

export function checkDecisions(docsPath: string): CheckResult {
  const decisions = readDecisions(docsPath);
  if (decisions.length === 0) return { lines: ['Sin decisiones'], code: 0 };
  const numbers = new Set(decisions.map((decision) => decision.number));
  const problems = [...repeatedNumbers(decisions), ...decisions.flatMap((decision) => decisionProblems(decision, numbers))];
  return problems.length > 0 ? { lines: problems, code: 1 } : { lines: ['Decisiones válidas'], code: 0 };
}
