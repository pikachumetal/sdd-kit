import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { DomainError } from '../cli/args.ts';
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

const SPEC_FOLDER_ID = /-(?:feature|task|patch|proposal)-([0-9]{4})[a-z]*-/i;
const SUFFIXED_FOLDER = /-[0-9]{4}[a-z]+-/i;
const BRANCH_ID = /(?:^|\/)([0-9]{4})(?:$|-)/;
const ROADMAP_ROW_ID = /^\|\s*(?:[0-9]{4}-[0-9]{2}-[0-9]{2}\s*\|\s*)?([0-9]{4})\s*\|/;
const NO_GIT_IDS: GitIds = { usedIds: [], currentBranchId: null };

function readIdsMode(root: string): unknown {
  const configPath = join(root, '.docs/sdd/sdd-kit.json');
  if (!existsSync(configPath)) return undefined;
  try {
    return JSON.parse(readFileSync(configPath, 'utf8').replace(/^﻿/, ''))?.ids?.mode;
  } catch {
    throw new DomainError(`No se puede leer '${configPath}': no es JSON válido.`);
  }
}

export function assertSequenceMode(root: string): void {
  const mode = readIdsMode(root);
  if (typeof mode === 'string' && mode.toLowerCase() === 'sequence') return;
  throw new DomainError(
    `El proyecto no está en modo 'sequence' (modo actual: 'tracker'); asigna el id con el gestor de tickets, no con este script.`,
  );
}

function byName(first: { name: string }, second: { name: string }): number {
  return first.name.toLowerCase() < second.name.toLowerCase() ? -1 : 1;
}

function specArtifacts(root: string): SpecArtifact[] {
  const specs = join(root, '.docs/sdd/specs');
  if (!existsSync(specs)) return [];
  return readdirSync(specs, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .sort(byName)
    .flatMap((entry) => {
      const id = SPEC_FOLDER_ID.exec(entry.name)?.[1];
      return id === undefined ? [] : [{ id, folder: entry.name }];
    });
}

function rowIds(lines: string[]): string[] {
  return lines.flatMap((line) => ROADMAP_ROW_ID.exec(line)?.[1] ?? []);
}

function roadmapIds(root: string): string[] {
  const roadmapPath = join(root, '.docs/sdd/roadmap.md');
  if (!existsSync(roadmapPath)) return [];
  return rowIds(readFileSync(roadmapPath, 'utf8').split(/\r\n|\n|\r/));
}

function assertNoSharedIds(artifacts: SpecArtifact[], io: Io): void {
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
    if (folders.size > 1) throw new DomainError(`Dos artefactos distintos comparten el id ${id}: ${[...folders].join(', ')}.`);
  }
}

async function branchContentIds(root: string, branch: string): Promise<string[]> {
  const roadmap = await gitLines(root, ['show', `${branch}:.docs/sdd/roadmap.md`]);
  const folders = await gitLines(root, ['ls-tree', '-d', '--name-only', `${branch}:.docs/sdd/specs`]);
  return [...rowIds(roadmap), ...folders.flatMap((folder) => SPEC_FOLDER_ID.exec(folder)?.[1] ?? [])];
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

async function gitIds({ root, io }: Ctx): Promise<GitIds> {
  const top = await toplevel(root);
  if (top === null) return NO_GIT_IDS;
  if (!samePath(top, root)) {
    io.err(`Se omiten las ramas: la raíz del proyecto no es la raíz del repositorio (repositorio en '${top}').`);
    return NO_GIT_IDS;
  }
  const [current = ''] = await gitLines(root, ['branch', '--show-current']);
  const usedIds = [...(await branchIds(root, current)), ...(await worktreeDiskIds(root))];
  return { usedIds, currentBranchId: BRANCH_ID.exec(current)?.[1] ?? null };
}

export async function idScan(ctx: Ctx): Promise<IdScan> {
  assertSequenceMode(ctx.root);
  const artifacts = specArtifacts(ctx.root).filter((artifact) => artifact.id !== '0000');
  assertNoSharedIds(artifacts, ctx.io);
  const fromGit = await gitIds(ctx);
  const allIds = [...artifacts.map((artifact) => artifact.id), ...roadmapIds(ctx.root), ...fromGit.usedIds];
  const usedIds = allIds.filter((id) => id !== '0000').map(Number);
  return { usedIds, max: usedIds.reduce((max, id) => Math.max(max, id), 0), currentBranchId: fromGit.currentBranchId };
}
