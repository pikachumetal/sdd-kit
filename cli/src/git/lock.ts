import { closeSync, mkdirSync, openSync, readdirSync, renameSync, unlinkSync, writeFileSync, writeSync } from 'node:fs';
import { hostname } from 'node:os';
import { basename, join } from 'node:path';
import { DomainError } from '../cli/args.ts';
import { readText } from '../cli/files.ts';
import type { Io } from '../cli/io.ts';

const POLL_MILLISECONDS = 500;
const UNREADABLE_POLL_MILLISECONDS = 50;
const CONTENTION_CODES = ['EEXIST', 'EPERM', 'EACCES', 'EBUSY'];
const QUEUE_ENTRY = '.json';

export interface LockOwner {
  branch: string | null;
  worktree: string;
  pid: number;
  host: string;
  since: string;
}

export interface Lock {
  path: string;
  label: string;
  io: Io;
  owner: { branch: string; worktree: string };
  // Carpeta de la cola: con ella, las esperas entran por orden de llegada.
  queue?: string;
}

interface Waiting {
  deadline: number;
  announced: string;
}

const sleep = (milliseconds: number) => new Promise<void>((done) => setTimeout(done, milliseconds));

function machineName(): string {
  return process.env.COMPUTERNAME ?? hostname();
}

function selfOwner({ owner }: Lock): LockOwner {
  return {
    branch: owner.branch === '' ? null : owner.branch,
    worktree: owner.worktree,
    pid: process.pid,
    host: machineName(),
    since: new Date().toISOString(),
  };
}

// El «desde» del cerrojo es la hora en que se coge, no la de llegada.
function tryCreate(path: string, owner: LockOwner): number | null {
  let descriptor: number;
  try {
    descriptor = openSync(path, 'wx');
  } catch (error) {
    if (CONTENTION_CODES.includes((error as NodeJS.ErrnoException).code ?? '')) return null;
    throw error;
  }
  writeSync(descriptor, JSON.stringify({ ...owner, since: new Date().toISOString() }));
  return descriptor;
}

function readOwner(path: string): LockOwner | null {
  try {
    const owner = JSON.parse(readText(path));
    return typeof owner?.pid === 'number' && typeof owner.host === 'string' ? owner : null;
  } catch {
    return null;
  }
}

export function lockHolderPid(path: string): number | null {
  return readOwner(path)?.pid ?? null;
}

function isAlive(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return (error as NodeJS.ErrnoException).code === 'EPERM';
  }
}

function isOrphan(owner: LockOwner): boolean {
  return owner.host.toLowerCase() === machineName().toLowerCase() && !isAlive(owner.pid);
}

function formatSince(since: string): string {
  const date = new Date(since);
  if (Number.isNaN(date.getTime())) return since;
  const two = (value: number) => String(value).padStart(2, '0');
  const day = `${date.getFullYear()}-${two(date.getMonth() + 1)}-${two(date.getDate())}`;
  return `${day} ${two(date.getHours())}:${two(date.getMinutes())}:${two(date.getSeconds())}`;
}

function formatWaiter(owner: LockOwner): string {
  const place = `(${owner.worktree}, PID ${owner.pid})`;
  return owner.branch ? `${owner.branch} ${place}` : place;
}

function formatHolder(owner: LockOwner): string {
  return `${formatWaiter(owner)} desde ${formatSince(owner.since)}`;
}

function formatOwner(owner: LockOwner): string {
  return `${formatHolder(owner)}.`;
}

function waitMessage(lock: Lock, owner: LockOwner, ahead: LockOwner[] | null): string {
  if (ahead === null) return `Esperando el cerrojo de ${lock.label}: lo tiene ${formatOwner(owner)}`;
  const before = ahead.length === 0 ? '' : `; delante de ti, ${ahead.map(formatWaiter).join(', ')}`;
  return `Esperando el cerrojo de ${lock.label}: vas ${ahead.length + 1}.º en la cola; lo tiene ${formatHolder(owner)}${before}.`;
}

function removeQuietly(path: string): void {
  try {
    unlinkSync(path);
  } catch {
    return;
  }
}

function announceOnce(lock: Lock, waiting: Waiting, message: string): void {
  if (message === waiting.announced) return;
  lock.io.err(message);
  waiting.announced = message;
}

async function handleHeld(lock: Lock, waiting: Waiting, ahead: LockOwner[] | null): Promise<void> {
  const owner = readOwner(lock.path);
  if (owner === null) {
    if (Date.now() > waiting.deadline) throw new DomainError('cerrojo: no se libera; no se puede leer quién lo tiene.');
    return sleep(UNREADABLE_POLL_MILLISECONDS);
  }
  if (isOrphan(owner)) {
    removeQuietly(lock.path);
    lock.io.err(`Cerrojo huérfano: lo tenía ${formatOwner(owner)}`);
    return;
  }
  announceOnce(lock, waiting, waitMessage(lock, owner, ahead));
  if (Date.now() > waiting.deadline) throw new DomainError(`cerrojo: no se libera; lo tiene ${formatOwner(owner)}`);
  return sleep(POLL_MILLISECONDS);
}

function newWaiting(timeoutMinutes: number): Waiting {
  return { deadline: Date.now() + timeoutMinutes * 60_000, announced: '' };
}

async function acquire(lock: Lock, timeoutMinutes: number): Promise<number> {
  const self = selfOwner(lock);
  const waiting = newWaiting(timeoutMinutes);
  for (;;) {
    const descriptor = tryCreate(lock.path, self);
    if (descriptor !== null) return descriptor;
    await handleHeld(lock, waiting, null);
  }
}

// Se escribe aparte y se renombra: quien llega después nunca lee una entrada a medias.
function enqueue(queue: string, self: LockOwner): string {
  mkdirSync(queue, { recursive: true });
  const entry = join(queue, `${String(Date.now()).padStart(13, '0')}-${String(self.pid).padStart(10, '0')}${QUEUE_ENTRY}`);
  writeFileSync(`${entry}.tmp`, JSON.stringify(self));
  renameSync(`${entry}.tmp`, entry);
  return entry;
}

// Las entradas se ordenan por su nombre: la hora de llegada y, en el mismo milisegundo, el PID.
export function waitersAhead(queue: string, entry: string): LockOwner[] {
  const own = basename(entry);
  const ahead: LockOwner[] = [];
  for (const name of readdirSync(queue).filter((file) => file.endsWith(QUEUE_ENTRY)).sort()) {
    if (name >= own) break;
    const owner = readOwner(join(queue, name));
    if (owner === null) continue;
    if (isOrphan(owner)) removeQuietly(join(queue, name));
    else ahead.push(owner);
  }
  return ahead;
}

async function acquireInTurn(lock: Lock, queue: string, timeoutMinutes: number): Promise<number> {
  const self = selfOwner(lock);
  const waiting = newWaiting(timeoutMinutes);
  const entry = enqueue(queue, self);
  try {
    for (;;) {
      const ahead = waitersAhead(queue, entry);
      const descriptor = ahead.length === 0 ? tryCreate(lock.path, self) : null;
      if (descriptor !== null) return descriptor;
      await handleHeld(lock, waiting, ahead);
    }
  } finally {
    removeQuietly(entry);
  }
}

export async function withLock<T>(lock: Lock, timeoutMinutes: number, body: () => Promise<T>): Promise<T> {
  const descriptor = lock.queue === undefined ? await acquire(lock, timeoutMinutes) : await acquireInTurn(lock, lock.queue, timeoutMinutes);
  try {
    return await body();
  } finally {
    closeSync(descriptor);
    removeQuietly(lock.path);
  }
}
