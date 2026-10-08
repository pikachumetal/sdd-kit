import { existsSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import {
  ESTIMATE_LABEL,
  REAL_LABEL,
  SESSION_COST_LABEL,
  SUBAGENT_TOKENS_LABEL,
  SUBJECT_COST_LABEL,
  THREAD_TOKENS_LABEL,
  getFieldText,
  getTimeSection,
  toHours,
  toMoney,
  toThousands,
} from './fields.ts';
import type { Warn } from './fields.ts';
import { readText } from '../cli/files.ts';
import { MISSING } from './text.ts';

const WALKTHROUGH_HEADING = String.raw`^#+[^\n]*estimado vs real`;
const PATCH_HEADING = String.raw`^#+\s*(?:\d+\.\s*)?Tiempo(?![\p{L}\p{N}_])`;
const TIME_OUTSIDE_BLOCK = /(?<![\p{L}\p{N}_])(?:Real|Estimaci[oó]n|Estimado)\s*:/imu;

export interface Cost {
  threadTokens: string | null;
  subagentTokens: string | null;
  subjectCost: string | null;
  sessionCost: string | null;
}

interface Artifact {
  content: string;
  type: string;
  estimate: number | null;
  real: number | null;
  cost: Cost;
}

export interface Row extends Cost {
  date: string;
  id: string;
  type: string;
  estimate: number | null;
  real: number;
  ratio: number | null;
  folder: string;
}


function readCost(section: string): Cost {
  return {
    threadTokens: toThousands(getFieldText(section, THREAD_TOKENS_LABEL)),
    subagentTokens: toThousands(getFieldText(section, SUBAGENT_TOKENS_LABEL)),
    subjectCost: toMoney(getFieldText(section, SUBJECT_COST_LABEL)),
    sessionCost: toMoney(getFieldText(section, SESSION_COST_LABEL)),
  };
}

function firstToken(text: string | null): string {
  if (text === null) return MISSING;
  return /^\**\s*([A-Za-z][\p{L}\p{Mn}\p{Nd}_/-]*)/u.exec(text)?.[1] ?? MISSING;
}

interface Source {
  content: string;
  type: string;
  path: string;
}

function readTimes(section: string, source: Source, warn: Warn): Artifact {
  const { content, type, path } = source;
  return {
    content,
    type,
    estimate: toHours(getFieldText(section, ESTIMATE_LABEL), path, warn),
    real: toHours(getFieldText(section, REAL_LABEL), path, warn),
    cost: readCost(section),
  };
}

function readWalkthrough(path: string, warn: Warn): Artifact | null {
  const content = readText(path);
  const section = getTimeSection(content, WALKTHROUGH_HEADING);
  if (section === null) return null;
  return readTimes(section, { content, type: firstToken(getFieldText(section, 'Tipo')), path }, warn);
}

function readPatch(path: string, type: string, warn: Warn): Artifact | null {
  const content = readText(path);
  const section = getTimeSection(content, PATCH_HEADING);
  if (section !== null) return readTimes(section, { content, type, path }, warn);
  if (TIME_OUTSIDE_BLOCK.test(content)) {
    warn(`Tiempo fuera del bloque «Tiempo» de la plantilla, sin leer: ${path}. Fila excluida.`);
  }
  return null;
}

function readArtifact(dir: string, warn: Warn): Artifact | null {
  const walkthrough = join(dir, 'walkthrough.md');
  const patch = join(dir, 'patch.md');
  const hotfix = join(dir, 'hotfix.md');
  const fromWalkthrough = existsSync(walkthrough) ? readWalkthrough(walkthrough, warn) : null;
  if (fromWalkthrough !== null) return fromWalkthrough;
  const fromPatch = existsSync(patch) ? readPatch(patch, 'patch', warn) : null;
  if (fromPatch !== null) return fromPatch;
  return existsSync(hotfix) ? readPatch(hotfix, 'hotfix', warn) : null;
}

function artifactId(content: string, folder: string): string {
  const declared = /^(?:feature|task):\s*(\S+)/im.exec(content)?.[1];
  if (declared !== undefined) return declared;
  return /^\d{8}-\d{6}-(?:feature|task|patch|hotfix)-([^-]+)-/i.exec(folder)?.[1] ?? MISSING;
}

function rowDate(content: string, folder: string): string {
  const closed = /^(?:created|date):\s*(\d{4}-\d{2}-\d{2})(?![\p{L}\p{N}_])/imu.exec(content)?.[1];
  if (closed !== undefined) return closed;
  const opened = /^(\d{4})(\d{2})(\d{2})-\d{6}-/.exec(folder);
  return opened ? `${opened[1]}-${opened[2]}-${opened[3]}` : MISSING;
}

function toRow(folder: string, artifact: Artifact, real: number): Row {
  const { estimate } = artifact;
  return {
    date: rowDate(artifact.content, folder),
    id: artifactId(artifact.content, folder),
    type: artifact.type,
    estimate,
    real,
    ratio: estimate !== null && estimate > 0 ? real / estimate : null,
    ...artifact.cost,
    folder,
  };
}

function folderNames(specsPath: string): string[] {
  return readdirSync(specsPath, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));
}

export function readRows(specsPath: string, warn: Warn): Row[] {
  const rows: Row[] = [];
  for (const folder of folderNames(specsPath)) {
    const artifact = readArtifact(resolve(specsPath, folder), warn);
    if (artifact === null) continue;
    if (artifact.real === null) warn(`Bloque de tiempo presente pero sin esfuerzo real legible: ${folder}. Fila excluida.`);
    else rows.push(toRow(folder, artifact, artifact.real));
  }
  return rows;
}
