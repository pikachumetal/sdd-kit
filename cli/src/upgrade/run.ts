import fs from 'node:fs';
import { join } from 'node:path';
import { DomainError, UsageError } from '../cli/args.ts';
import { kitConfigPath, readText } from '../cli/files.ts';
import { isRecord, type Json } from '../cli/records.ts';
import type { Io } from '../cli/io.ts';

export interface UpgradeOptions {
  root: string;
  migrationsDir: string;
  today: string;
  mark: string | null;
}

const MARKER = '.docs/sdd/sdd-kit.json';
const MIGRATION_NAME = /^v(\d+)\.(\d+)\.(\d+)\.md$/;

type Version = [number, number, number];

function parseVersion(text: string): Version {
  const [major, minor, patch] = text.split('.').map((part) => parseInt(part, 10) || 0);
  return [major ?? 0, minor ?? 0, patch ?? 0];
}

function compareVersions(left: Version, right: Version): number {
  return left[0] - right[0] || left[1] - right[1] || left[2] - right[2];
}

function kitVersions(migrationsDir: string): string[] {
  return fs
    .readdirSync(migrationsDir)
    .flatMap((name) => MIGRATION_NAME.exec(name)?.slice(1, 4).join('.') ?? [])
    .sort((left, right) => compareVersions(parseVersion(left), parseVersion(right)));
}

function readMarker(root: string): Json | null {
  const path = kitConfigPath(root);
  if (!fs.existsSync(path)) return null;
  let marker: unknown;
  try {
    marker = JSON.parse(readText(path));
  } catch {
    throw new DomainError(`${MARKER} no es JSON válido: no se toca`);
  }
  if (!isRecord(marker)) throw new DomainError(`${MARKER} no se puede fusionar: la raíz no es un objeto`);
  if ('init' in marker) throw new DomainError('init en curso: sigue con sdd-init');
  return marker;
}

function listPending(marker: Json | null, options: UpgradeOptions, io: Io): number {
  const versions = kitVersions(options.migrationsDir);
  const current = typeof marker?.version === 'string' ? marker.version : null;
  if (current === null) io.out('sin sdd-kit.json: se aplican todas');
  const pending = current === null ? versions : versions.filter((version) => compareVersions(parseVersion(version), parseVersion(current)) > 0);
  if (current !== null && pending.length === 0) io.out(`el proyecto ya está al día con el kit ${current}`);
  pending.forEach((version) => io.out(join(options.migrationsDir, `v${version}.md`)));
  return 0;
}

function markVersion(marker: Json | null, options: UpgradeOptions & { mark: string }, io: Io): number {
  const { mark } = options;
  if (!kitVersions(options.migrationsDir).includes(mark)) throw new UsageError(`--mark ${mark}: el kit no trae esa migración`);
  const current = typeof marker?.version === 'string' ? marker.version : null;
  if (current !== null && compareVersions(parseVersion(mark), parseVersion(current)) <= 0) {
    throw new DomainError(`--mark ${mark}: el proyecto ya está en ${current}`);
  }
  const { version, channel, updated, ...rest } = marker ?? {};
  const next = { version: mark, channel: 'plugin', updated: options.today, ...rest };
  fs.writeFileSync(kitConfigPath(options.root), `${JSON.stringify(next, null, 2)}\n`, 'utf8');
  io.out(`${MARKER}: actualizado`);
  return 0;
}

export function runUpgrade(options: UpgradeOptions, io: Io): number {
  const marker = readMarker(options.root);
  if (options.mark === null) return listPending(marker, options, io);
  return markVersion(marker, { ...options, mark: options.mark }, io);
}
