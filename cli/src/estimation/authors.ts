import { execFileSync } from 'node:child_process';
import { CHANGE_FOLDER_NAMES } from '../cli/layout.ts';
import { gitSync, isolatedEnv } from '../git/git.ts';
import type { Warn } from './fields.ts';
import { UNATTRIBUTED, UNMARKED } from './report.ts';
import type { Attribution, ReportSource } from './report.ts';

export const MIGRATION_SUBJECT = 'chore(sdd): migrar al kit';
const ARTIFACT_FILES = ['walkthrough.md', 'patch.md', 'hotfix.md'];
const HEADER_MARK = '\u0000';
const NO_ATTRIBUTION: Attribution = { person: UNATTRIBUTED, kitVersion: UNMARKED };

interface ClosingCommit {
  sha: string;
  author: string | null;
}

// El log va del más nuevo al más viejo y gana el último: el commit más antiguo de «<carpeta>/<fichero>»,
// sea en specs/ o en changes/, así el git mv de la migración no cambia quién lo escribió.
export function closingCommits(docsPath: string): Map<string, ClosingCommit> | null {
  const format = '--format=%x00%H%x09%aN%x09%s';
  const lines = gitSync(docsPath, ['log', '--no-renames', '--diff-filter=AM', format, '--name-only', '--', ...CHANGE_FOLDER_NAMES]);
  if (lines === null) return null;
  const commits = new Map<string, ClosingCommit>();
  let current: ClosingCommit = { sha: '', author: null };
  for (const line of lines) {
    if (line.startsWith(HEADER_MARK)) current = parseHeader(line.slice(1));
    else commits.set(line.split('/').slice(-2).join('/'), current);
  }
  return commits;
}

function parseHeader(header: string): ClosingCommit {
  const [sha = '', author = '', subject = ''] = header.split('\t');
  return { sha, author: subject.startsWith(MIGRATION_SUBJECT) ? null : author };
}

function versionOf(content: string): string | null {
  try {
    const version = (JSON.parse(content) as { version?: unknown }).version;
    return typeof version === 'string' && version !== '' ? version : null;
  } catch {
    return null;
  }
}

function parseBatch(output: Buffer, count: number): (string | null)[] {
  const contents: (string | null)[] = [];
  let offset = 0;
  for (let index = 0; index < count; index++) {
    const end = output.indexOf(0x0a, offset);
    const size = /^\S+ blob (\d+)\s*$/.exec(output.subarray(offset, end).toString('utf8'))?.[1];
    offset = end + 1;
    if (size === undefined) contents.push(null);
    else {
      contents.push(output.subarray(offset, offset + Number(size)).toString('utf8'));
      offset += Number(size) + 1;
    }
  }
  return contents;
}

export function markedVersions(docsPath: string, shas: string[]): Map<string, string> {
  if (shas.length === 0) return new Map();
  const input = shas.map((sha) => `${sha}:./sdd-kit.json`).join('\n') + '\n';
  const output = execFileSync('git', ['cat-file', '--batch'], { cwd: docsPath, input, env: isolatedEnv(), windowsHide: true, maxBuffer: 64 * 1024 * 1024 });
  const contents = parseBatch(output, shas.length);
  return new Map(shas.flatMap((sha, index) => {
    const version = contents[index] === null ? null : versionOf(contents[index]!);
    return version === null ? [] : [[sha, version] as const];
  }));
}

function commitOf(folder: string, commits: Map<string, ClosingCommit>): ClosingCommit | undefined {
  return ARTIFACT_FILES.map((file) => commits.get(`${folder}/${file}`)).find(Boolean);
}

export function attributeRows(docsPath: string, sources: ReportSource[], warn: Warn): Attribution[] {
  const commits = closingCommits(docsPath);
  if (commits === null) {
    warn(`Sin historial de git en ${docsPath}: persona y versión salen sin atribuir y sin marcador.`);
    return sources.map(() => NO_ATTRIBUTION);
  }
  const picked = sources.map((source) => commitOf(source.row.folder, commits));
  const shas = [...new Set(picked.flatMap((commit) => (commit?.author ? [commit.sha] : [])))];
  const versions = markedVersions(docsPath, shas);
  return picked.map((commit) =>
    commit?.author ? { person: commit.author, kitVersion: versions.get(commit.sha) ?? UNMARKED } : NO_ATTRIBUTION,
  );
}
