import { DomainError } from '../cli/args.ts';
import { DECISIONS_FOLDER, decisionNumber } from '../decisions/document.ts';
import { git, gitLines } from '../git/git.ts';
import { BRANCH_KIT_CONFIG, SPEC_FOLDER_ID, SUFFIXED_FOLDER, changeFolderNamesAt, idsModeOf } from '../ids/scan.ts';

export interface Numbered {
  changes: string[];
  decisions: string[];
}

export interface ClashInput {
  base: Numbered;
  branch: Numbered;
  destination: Numbered;
  sequence: boolean;
}

export interface ClashRefs {
  branch: string;
  destination: string;
  destinationName: string;
}

export interface Clash {
  kind: 'id' | 'adr';
  branch: string;
  destination: string;
  number: string;
}

interface Sides {
  base: string[];
  branch: string[];
  destination: string[];
}

type NumberOf = (name: string) => string | null;

const DECISIONS = `.docs/sdd/${DECISIONS_FOLDER}`;
const UNNUMBERED = '0000';
const EMPTY: Numbered = { changes: [], decisions: [] };

const folderId: NumberOf = (name) => (SUFFIXED_FOLDER.test(name) ? null : (SPEC_FOLDER_ID.exec(name)?.[1] ?? null));

function clashesOf(kind: Clash['kind'], numberOf: NumberOf, sides: Sides): Clash[] {
  const brought = sides.branch.filter((name) => !sides.base.includes(name) && !sides.destination.includes(name));
  return brought.flatMap((name) => {
    const number = numberOf(name);
    if (number === null || number === UNNUMBERED) return [];
    return sides.destination.filter((other) => numberOf(other) === number).map((other) => ({ kind, branch: name, destination: other, number }));
  });
}

export function numberingClashes({ base, branch, destination, sequence }: ClashInput): Clash[] {
  const sides = (key: keyof Numbered): Sides => ({ base: base[key], branch: branch[key], destination: destination[key] });
  return [...(sequence ? clashesOf('id', folderId, sides('changes')) : []), ...clashesOf('adr', decisionNumber, sides('decisions'))];
}

function clashLine({ kind, branch, destination, number }: Clash, destinationName: string): string {
  const [what, prefix] = kind === 'id' ? ['el id', ''] : ['el número', 'decisions/'];
  return `numeración: la rama trae ${prefix}${branch} y '${destinationName}' ya tiene ${prefix}${destination} con ${what} ${number}; renumera la de la rama a mano`;
}

export function clashLines(clashes: Clash[], destinationName: string): string[] {
  return clashes.map((clash) => clashLine(clash, destinationName));
}

async function namesAt(root: string, ref: string): Promise<Numbered> {
  return { changes: await changeFolderNamesAt(root, ref), decisions: await gitLines(root, ['ls-tree', '--name-only', `${ref}:${DECISIONS}`]) };
}

// El modo sale de la rama, que es lo que quedará en el destino tras fusionar, y no de qué checkout corre la comprobación.
async function sequenceAt(root: string, ref: string): Promise<boolean> {
  const shown = await git(root, ['show', `${ref}:${BRANCH_KIT_CONFIG}`]);
  return idsModeOf(shown.code === 0 ? shown.stdout : null, `${ref}:${BRANCH_KIT_CONFIG}`) === 'sequence';
}

export async function assertNoNumberingClash(root: string, { branch, destination, destinationName }: ClashRefs): Promise<void> {
  const [base] = await gitLines(root, ['merge-base', branch, destination]);
  const clashes = numberingClashes({
    base: base === undefined ? EMPTY : await namesAt(root, base),
    branch: await namesAt(root, branch),
    destination: await namesAt(root, destination),
    sequence: await sequenceAt(root, branch),
  });
  if (clashes.length > 0) throw new DomainError(clashLines(clashes, destinationName).join('\n'));
}
