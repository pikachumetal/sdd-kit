import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { DomainError } from '../cli/args.ts';
import { kitConfigPath, readText } from '../cli/files.ts';
import { changeFolders, documentCandidates } from '../cli/layout.ts';
import type { Io } from '../cli/io.ts';
import { gitLines, samePath, toplevel, worktrees } from '../git/git.ts';

export interface Ctx {
  root: string;
  io: Io;
}

export interface IdScan {
  usedIds: number[];
  max: number;
  currentBranchId: string | null;
}

interface SpecArtifact {
  id: string;
  folder: string;
}

interface GitIds {
  usedIds: string[];
  currentBranchId: string | null;
}

export const SPEC_FOLDER_ID = /-(?:feature|task|patch|proposal)-([0-9]{4})[a-z]*-/i;
export const SUFFIXED_FOLDER = /-[0-9]{4}[a-z]+-/i;
export const BRANCH_ID = /(?:^|\/)([0-9]{4})(?:$|-)/;
export const ID_TAG_PREFIX = 'sdd-id/';
const ROADMAP_ROW_ID = /^\|\s*(?:[0-9]{4}-[0-9]{2}-[0-9]{2}\s*\|\s*)?([0-9]{4})\s*\|/;
const NO_GIT_IDS: GitIds = { usedIds: [], currentBranchId: null };
const DOCS = '.docs/sdd';
export const BRANCH_ROADMAPS = ['ROADMAP.md', `${DOCS}/roadmap.md`];
export const BRANCH_CHANGE_FOLDERS = [`${DOCS}/changes`, `${DOCS}/specs`];
export const BRANCH_KIT_CONFIG = `${DOCS}/sdd-kit.json`;

function parsedIdsMode(config: string, source: string): unknown {
  try {
    return JSON.parse(config)?.ids?.mode;
  } catch {
    throw new DomainError(`No se puede leer '${source}': no es JSON válido.`);
  }
}

export function idsModeOf(config: string | null, source: string): 'sequence' | 'tracker' {
  const mode = config === null ? undefined : parsedIdsMode(config, source);
  return typeof mode === 'string' && mode.toLowerCase() === 'sequence' ? 'sequence' : 'tracker';
}

export function idsMode(root: string): 'sequence' | 'tracker' {
  const configPath = kitConfigPath(root);
  return idsModeOf(existsSync(configPath) ? readText(configPath) : null, configPath);
}

export function assertSequenceMode(root: string): void {
  if (idsMode(root) === 'sequence') return;
  throw new DomainError(
    `El proyecto no está en modo 'sequence' (modo actual: 'tracker'); asigna el id con el gestor de tickets, no con este script.`,
  );
}

function byName(first: { name: string }, second: { name: string }): number {
  return first.name.toLowerCase() < second.name.toLowerCase() ? -1 : 1;
}

function folderArtifacts(folder: string): SpecArtifact[] {
  return readdirSync(folder, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .sort(byName)
    .flatMap((entry) => {
      const id = SPEC_FOLDER_ID.exec(entry.name)?.[1];
      return id === undefined ? [] : [{ id, folder: entry.name }];
    });
}

function specArtifacts(root: string): SpecArtifact[] {
  return changeFolders(join(root, DOCS)).flatMap(folderArtifacts);
}

export function rowIds(lines: string[]): string[] {
  return lines.flatMap((line) => ROADMAP_ROW_ID.exec(line)?.[1] ?? []);
}

function roadmapIds(root: string): string[] {
  return documentCandidates(join(root, DOCS), 'roadmap')
    .filter((path) => existsSync(path))
    .flatMap((path) => rowIds(readFileSync(path, 'utf8').split(/\r\n|\n|\r/)));
}

function warnSharedIds(artifacts: SpecArtifact[], io: Io): void {
  const legacy = artifacts.filter((artifact) => SUFFIXED_FOLDER.test(artifact.folder));
  if (legacy.length > 0) {
    const folders = legacy.map((artifact) => artifact.folder).join(', ');
    io.err(`aviso: carpetas con sufijo anteriores a la secuencia (su número cuenta como ocupado): ${folders}.`);
  }
  const foldersById = new Map<string, Set<string>>();
  for (const { id, folder } of artifacts.filter((artifact) => !legacy.includes(artifact))) {
    foldersById.set(id, (foldersById.get(id) ?? new Set()).add(folder));
  }
  for (const [id, folders] of foldersById) {
    if (folders.size > 1) io.err(`aviso: dos artefactos distintos comparten el id ${id}: ${[...folders].join(', ')}; renumera uno.`);
  }
}

export async function branchContentIds(root: string, branch: string): Promise<string[]> {
  const ids: string[] = [];
  for (const roadmap of BRANCH_ROADMAPS) ids.push(...rowIds(await gitLines(root, ['show', `${branch}:${roadmap}`])));
  ids.push(...(await changeFolderNamesAt(root, branch)).flatMap((folder) => SPEC_FOLDER_ID.exec(folder)?.[1] ?? []));
  return ids;
}

export async function changeFolderNamesAt(root: string, ref: string): Promise<string[]> {
  const names: string[] = [];
  for (const changes of BRANCH_CHANGE_FOLDERS) names.push(...(await gitLines(root, ['ls-tree', '-d', '--name-only', `${ref}:${changes}`])));
  return names;
}

async function worktreeDiskIds(root: string): Promise<string[]> {
  const found = await worktrees(root);
  return found.flatMap(({ path }) => [...roadmapIds(path), ...specArtifacts(path).map((artifact) => artifact.id)]);
}

function isCurrentBranch(branch: string, current: string): boolean {
  return current !== '' && (branch.toLowerCase() === current.toLowerCase() || branch.endsWith(`/${current}`));
}

async function branchIds(root: string, current: string): Promise<string[]> {
  const ids: string[] = [];
  for (const branch of await gitLines(root, ['branch', '--all', '--format=%(refname:short)'])) {
    const own = isCurrentBranch(branch, current) ? undefined : BRANCH_ID.exec(branch)?.[1];
    ids.push(...(own === undefined ? [] : [own]), ...(await branchContentIds(root, branch)));
  }
  return ids;
}

export async function idsOutsideTask(root: string): Promise<string[]> {
  const [current = ''] = await gitLines(root, ['branch', '--show-current']);
  const ids: string[] = [];
  for (const branch of await gitLines(root, ['branch', '--all', '--format=%(refname:short)'])) {
    if (isCurrentBranch(branch, current)) continue;
    ids.push(...(BRANCH_ID.exec(branch)?.slice(1, 2) ?? []), ...(await branchContentIds(root, branch)));
  }
  const others = (await worktrees(root)).filter(({ path }) => !samePath(path, root));
  ids.push(...others.flatMap(({ path }) => [...roadmapIds(path), ...specArtifacts(path).map((artifact) => artifact.id)]));
  return [...ids, ...(await tagIds(root))];
}

export async function tagIds(root: string): Promise<string[]> {
  const tags = await gitLines(root, ['tag', '--list', `${ID_TAG_PREFIX}*`]);
  return tags.flatMap((tag) => (tag.startsWith(ID_TAG_PREFIX) && /^[0-9]{4}$/.test(tag.slice(ID_TAG_PREFIX.length)) ? [tag.slice(ID_TAG_PREFIX.length)] : []));
}

async function gitIds({ root, io }: Ctx): Promise<GitIds> {
  const top = await toplevel(root);
  if (top === null) return NO_GIT_IDS;
  if (!samePath(top, root)) {
    io.err(`Se omiten las ramas: la raíz del proyecto no es la raíz del repositorio (repositorio en '${top}').`);
    return NO_GIT_IDS;
  }
  const [current = ''] = await gitLines(root, ['branch', '--show-current']);
  const usedIds = [...(await branchIds(root, current)), ...(await worktreeDiskIds(root)), ...(await tagIds(root))];
  return { usedIds, currentBranchId: BRANCH_ID.exec(current)?.[1] ?? null };
}

export async function idScan(ctx: Ctx): Promise<IdScan> {
  assertSequenceMode(ctx.root);
  const artifacts = specArtifacts(ctx.root).filter((artifact) => artifact.id !== '0000');
  warnSharedIds(artifacts, ctx.io);
  const fromGit = await gitIds(ctx);
  const allIds = [...artifacts.map((artifact) => artifact.id), ...roadmapIds(ctx.root), ...fromGit.usedIds];
  const usedIds = allIds.filter((id) => id !== '0000').map(Number);
  return { usedIds, max: usedIds.reduce((max, id) => Math.max(max, id), 0), currentBranchId: fromGit.currentBranchId };
}
