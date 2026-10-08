import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { DomainError } from '../cli/args.ts';
import type { Io } from '../cli/io.ts';
import { gitLines } from '../git/git.ts';
import { withLock } from '../git/lock.ts';
import { counterPath, formatId, readCounter, writeCounter } from './counter.ts';
import { assertSequenceMode, idScan, type Ctx } from './scan.ts';

export interface NextOptions {
  projectRoot: string;
  reserve: boolean;
  count: number;
  lockTimeoutMinutes: number;
}

const MAX_ID = 9999;

async function proposeId(ctx: Ctx): Promise<string> {
  const scan = await idScan(ctx);
  const { currentBranchId } = scan;
  if (currentBranchId !== null && !scan.usedIds.includes(Number(currentBranchId))) return currentBranchId;
  const base = Math.max(scan.max, readCounter(await counterPath(ctx.root), ctx.io));
  return formatId(base + 1);
}

async function consumeIds(ctx: Ctx, path: string, count: number): Promise<string[]> {
  const base = Math.max((await idScan(ctx)).max, readCounter(path, ctx.io));
  const last = base + count;
  if (last > MAX_ID) {
    throw new DomainError(`La reserva pasaría de ${MAX_ID} (último id consumido: ${formatId(base)}); no se reserva nada.`);
  }
  writeCounter(path, last);
  return Array.from({ length: count }, (_, index) => formatId(base + 1 + index));
}

async function reserveIds(ctx: Ctx, count: number, lockTimeoutMinutes: number): Promise<string[]> {
  assertSequenceMode(ctx.root);
  const path = await counterPath(ctx.root);
  if (path === null) throw new DomainError('El proyecto no está en un repositorio git: no hay dónde reservar el id.');
  const [branch = ''] = await gitLines(ctx.root, ['branch', '--show-current']);
  const lock = { path: join(dirname(path), 'sdd-ids.lock'), label: 'ids', io: ctx.io, owner: { branch, worktree: ctx.root } };
  return withLock(lock, lockTimeoutMinutes, () => consumeIds(ctx, path, count));
}

export async function nextIds(options: NextOptions, io: Io): Promise<string[]> {
  if (!existsSync(options.projectRoot)) throw new DomainError(`No existe la ruta de proyecto '${options.projectRoot}'.`);
  const ctx: Ctx = { root: resolve(options.projectRoot), io };
  if (options.reserve) return reserveIds(ctx, options.count, options.lockTimeoutMinutes);
  return [await proposeId(ctx)];
}
