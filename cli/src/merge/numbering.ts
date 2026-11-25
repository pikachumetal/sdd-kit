import { DomainError } from '../cli/args.ts';
import { gitLines } from '../git/git.ts';
import { BRANCH_CHANGE_FOLDERS, SPEC_FOLDER_ID, SUFFIXED_FOLDER, idsMode } from '../ids/scan.ts';

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

interface Clash {
  kind: 'id' | 'adr';
  branch: string;
  destination: string;
  number: string;
}

type NumberOf = (name: string) => string | undefined;

const DECISIONS = '.docs/sdd/decisions';
const ADR_NUMBER = /^(\d{4})-.+\.md$/;
const UNNUMBERED = '0000';
const EMPTY: Numbered = { changes: [], decisions: [] };

const folderId: NumberOf = (name) => (SUFFIXED_FOLDER.test(name) ? undefined : SPEC_FOLDER_ID.exec(name)?.[1]);
const adrNumber: NumberOf = (name) => ADR_NUMBER.exec(name)?.[1];

function clashesOf(kind: Clash['kind'], numberOf: NumberOf, sides: { base: string[]; branch: string[]; destination: string[] }): Clash[] {
  const brought = sides.branch.filter((name) => !sides.base.includes(name) && !sides.destination.includes(name));
  return brought.flatMap((name) => {
    const number = numberOf(name);
    if (number === undefined || number === UNNUMBERED) return [];
    return sides.destination.filter((other) => numberOf(other) === number).map((other) => ({ kind, branch: name, destination: other, number }));
  });
}

export function numberingClashes({ base, branch, destination, sequence }: ClashInput): Clash[] {
  const side = (key: keyof Numbered) => ({ base: base[key], branch: branch[key], destination: destination[key] });
  return [...(sequence ? clashesOf('id', folderId, side('changes')) : []), ...clashesOf('adr', adrNumber, side('decisions'))];
}

function clashLine({ kind, branch, destination, number }: Clash, destinationName: string): string {
  const [what, prefix] = kind === 'id' ? ['el id', ''] : ['el número', 'decisions/'];
  return `numeración: la rama trae ${prefix}${branch} y '${destinationName}' ya tiene ${prefix}${destination} con ${what} ${number}; renumera la de la rama a mano`;
}

export function clashLines(clashes: Clash[], destinationName: string): string[] {
  return clashes.map((clash) => clashLine(clash, destinationName));
}

async function namesAt(root: string, ref: string): Promise<Numbered> {
  const changes: string[] = [];
  for (const folder of BRANCH_CHANGE_FOLDERS) changes.push(...(await gitLines(root, ['ls-tree', '-d', '--name-only', `${ref}:${folder}`])));
  return { changes, decisions: await gitLines(root, ['ls-tree', '--name-only', `${ref}:${DECISIONS}`]) };
}

export async function assertNoNumberingClash(root: string, { branch, destination, destinationName }: ClashRefs): Promise<void> {
  const [base] = await gitLines(root, ['merge-base', branch, destination]);
  const clashes = numberingClashes({
    base: base === undefined ? EMPTY : await namesAt(root, base),
    branch: await namesAt(root, branch),
    destination: await namesAt(root, destination),
    sequence: idsMode(root) === 'sequence',
  });
  if (clashes.length > 0) throw new DomainError(clashLines(clashes, destinationName).join('\n'));
}
