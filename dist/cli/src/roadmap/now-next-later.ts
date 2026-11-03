import { lineAt, parseSections, tableBlocks } from './parse.ts';
import type { Block, Section } from './parse.ts';
import { namesId } from './changelog.ts';
import { formProseProblems, formSectionProblems } from './structure.ts';
import type { FormRules } from './structure.ts';
import { STATE_HELP, STATE_PREFIXES, headerIs, headerProblem, rowsOf, tableBlockProblems } from './tables.ts';
import type { Row } from './tables.ts';

const HEADER = '| Id | Externo | Tarea | Estado | Tras | Tamaño |';
const NOW_TITLE = /^## Now( — \S+ · (en preparación|comprometida))?$/;
const NOW_TITLE_HELP = '«## Now» ni «## Now — <versión> · en preparación|comprometida»';
const PROFILE_LINE = /^Perfil de control: \S/;
const SEQUENCE_ID = /^(?!0000$)\d{4}$/;
const RETIRED_ID = /^B\d+$/;
const TITLE = /^\*\*.+?\*\*/;
const SIZES = ['S', 'M', 'L'];
const LATER_STATE_PREFIXES = ['⏳', '⏸️ aparcada:'];
const LATER_STATE_HELP = '⏳, ⏸️ aparcada: …';

export type IdsMode = 'sequence' | 'tracker';

interface RowContext {
  known: Set<string>;
  changelogText: string;
  mode: IdsMode;
}

function kindOf(section: Section): string {
  return /^Now\b/.test(section.title) ? 'Now' : section.title;
}

const RULES: FormRules = {
  names: ['Now', 'Next', 'Later'],
  kindOf,
  subject: 'el roadmap',
  allowedLine: (text, kind) => kind === 'Now' && PROFILE_LINE.test(text),
};

function stateProblems(row: Row, kind: string): string[] {
  const state = row.cells[3] ?? '';
  const later = kind === 'Later';
  if ((later ? LATER_STATE_PREFIXES : STATE_PREFIXES).some((prefix) => state.startsWith(prefix))) return [];
  const place = later ? ' en «Later»' : '';
  return [`estado «${state}» no admitido${place}: ${later ? LATER_STATE_HELP : STATE_HELP}`];
}

function idProblems(id: string, mode: IdsMode): string[] {
  if (mode === 'sequence') return SEQUENCE_ID.test(id) ? [] : [`el id «${id}» no es de la secuencia: resérvale uno con sdd id next --reserve`];
  return RETIRED_ID.test(id) ? [`el id «${id}» ya no se usa: usa el del ticket o 0000`] : [];
}

function taskProblems(row: Row, kind: string): string[] {
  const [id = '', , task = ''] = row.cells;
  return [
    ...(TITLE.test(task) ? [] : ['la «Tarea» no empieza por «**<título>**»']),
    ...(kind === 'Later' || task.includes('<details>') ? [] : [`la fila ${id} no lleva brief («<details>»)`]),
  ];
}

function afterProblems(row: Row, known: Set<string>, changelogText: string): string[] {
  const after = (row.cells[4] ?? '').split(',').map((id) => id.trim()).filter((id) => id !== '' && id !== '—');
  return after
    .filter((id) => !known.has(id) && !namesId(changelogText, id))
    .map((id) => `«Tras» nombra ${id}, que no está en el roadmap ni en CHANGELOG.md`);
}

function sizeProblems(row: Row, kind: string): string[] {
  const size = row.cells[5] ?? '';
  return kind === 'Later' || SIZES.includes(size) ? [] : [`tamaño «${size}» no admitido: ${SIZES.join(', ')}`];
}

function rowProblems(row: Row, kind: string, { known, changelogText, mode }: RowContext): string[] {
  const problems = [
    ...idProblems(row.cells[0] ?? '', mode),
    ...stateProblems(row, kind),
    ...taskProblems(row, kind),
    ...afterProblems(row, known, changelogText),
    ...sizeProblems(row, kind),
  ];
  return problems.map((problem) => `línea ${row.index + 1}: ${problem}`);
}

function titleProblems(lines: string[], sections: Section[]): string[] {
  return sections
    .filter((section) => kindOf(section) === 'Now' && !NOW_TITLE.test(lineAt(lines, section.line - 1).trimEnd()))
    .map((section) => `línea ${section.line}: «${section.title}» no es ${NOW_TITLE_HELP}`);
}

function blockProblems(lines: string[], block: Block, context: RowContext): string[] {
  const kind = block.section ? kindOf(block.section) : '';
  if (!RULES.names.includes(kind)) return [];
  const rows = headerIs(lines, block, HEADER) ? rowsOf(lines, block).flatMap((row) => rowProblems(row, kind, context)) : [];
  return [...tableBlockProblems(lines, block), ...headerProblem(lines, block, kind, HEADER), ...rows];
}

function knownIds(lines: string[], blocks: Block[]): Set<string> {
  return new Set(blocks.flatMap((block) => rowsOf(lines, block).map((row) => row.cells[0] ?? '')));
}

export function nowNextLaterProblems(lines: string[], changelogText: string, mode: IdsMode): string[] {
  const sections = parseSections(lines);
  const blocks = tableBlocks(lines, sections);
  const context = { known: knownIds(lines, blocks), changelogText, mode };
  return [
    ...(/^# Roadmap\b/i.test(lineAt(lines, 0)) ? [] : ['línea 1: no empieza por «# Roadmap»']),
    ...formSectionProblems(sections, RULES),
    ...titleProblems(lines, sections),
    ...formProseProblems(lines, sections, RULES),
    ...blocks.flatMap((block) => blockProblems(lines, block, context)),
  ];
}
