import { closeSync, openSync, readFileSync, unlinkSync, writeSync } from 'node:fs';
import { hostname } from 'node:os';
import { DomainError } from '../cli/args.ts';
import type { Io } from '../cli/io.ts';

const POLL_MILLISECONDS = 500;
const UNREADABLE_POLL_MILLISECONDS = 50;
const CONTENTION_CODES = ['EEXIST', 'EPERM', 'EACCES', 'EBUSY'];

interface LockOwner {
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
}

interface Waiting {
  deadline: number;
  announcedKey: string;
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

function tryCreate(path: string, owner: LockOwner): number | null {
  let descriptor: number;
  try {
    descriptor = openSync(path, 'wx');
  } catch (error) {
    if (CONTENTION_CODES.includes((error as NodeJS.ErrnoException).code ?? '')) return null;
    throw error;
  }
  writeSync(descriptor, JSON.stringify(owner));
  return descriptor;
}

function readOwner(path: string): LockOwner | null {
  try {
    const owner = JSON.parse(readFileSync(path, 'utf8').replace(/^﻿/, ''));
    return typeof owner?.pid === 'number' && typeof owner.host === 'string' ? owner : null;
  } catch {
    return null;
  }
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

function formatOwner(owner: LockOwner): string {
  return `${owner.branch ?? ''} (${owner.worktree}, PID ${owner.pid}) desde ${formatSince(owner.since)}.`;
}

function removeQuietly(path: string): void {
  try {
    unlinkSync(path);
  } catch {
    return;
  }
}

function announceOnce(lock: Lock, owner: LockOwner, waiting: Waiting): void {
  const key = `${owner.branch}|${owner.pid}|${owner.since}`;
  if (key === waiting.announcedKey) return;
  lock.io.err(`Esperando el cerrojo de ${lock.label}: lo tiene ${formatOwner(owner)}`);
  waiting.announcedKey = key;
}

async function handleHeld(lock: Lock, waiting: Waiting): Promise<void> {
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
  announceOnce(lock, owner, waiting);
  if (Date.now() > waiting.deadline) throw new DomainError(`cerrojo: no se libera; lo tiene ${formatOwner(owner)}`);
  return sleep(POLL_MILLISECONDS);
}

async function acquire(lock: Lock, timeoutMinutes: number): Promise<number> {
  const self = selfOwner(lock);
  const waiting: Waiting = { deadline: Date.now() + timeoutMinutes * 60_000, announcedKey: '' };
  for (;;) {
    const descriptor = tryCreate(lock.path, self);
    if (descriptor !== null) return descriptor;
    await handleHeld(lock, waiting);
  }
}

export async function withLock<T>(lock: Lock, timeoutMinutes: number, body: () => Promise<T>): Promise<T> {
  const descriptor = await acquire(lock, timeoutMinutes);
  try {
    return await body();
  } finally {
    closeSync(descriptor);
    removeQuietly(lock.path);
  }
}
