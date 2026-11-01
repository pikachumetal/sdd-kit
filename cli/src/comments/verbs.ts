import { extname } from 'node:path';
import { requiredOption, text } from '../cli/args.ts';
import type { Io } from '../cli/io.ts';
import type { Verb } from '../cli/verbs.ts';
import { git } from '../git/git.ts';
import { citedKinds } from './citations.ts';
import { commentLinesOf } from './lexer.ts';

export interface CitingComment {
  file: string;
  line: number;
  cites: string[];
  text: string;
}

interface Scan {
  comments: CitingComment[];
  unread: string[];
}

const NOT_CODE = ['.md', '.mdx', '.json'];
const EVIDENCE = ['.docs/sdd/specs/', '.docs/sdd/changes/'];
const HUNK_NEW_START = /^@@ -\S+ \+(\d+)(?:,(\d+))? @@/;

async function gitOrThrow(root: string, args: string[]): Promise<string> {
  const { code, stdout, stderr } = await git(root, args);
  if (code !== 0) throw new Error(stderr.trim());
  return stdout;
}

// Las cabeceras se separan del cuerpo con el primer @@: una línea añadida «++ b/x» también empieza por +++ en el diff.
function addedLinesByFile(diff: string): Map<string, number[]> {
  const added = new Map<string, number[]>();
  let file: string | null = null;
  let inHeader = false;
  for (const line of diff.split(/\r?\n/)) {
    if (line.startsWith('diff --git ')) [file, inHeader] = [null, true];
    else if (inHeader && line.startsWith('+++ b/')) file = line.slice('+++ b/'.length).replace(/\t$/, '');
    else if (line.startsWith('@@ ') && file !== null) {
      inHeader = false;
      added.set(file, [...(added.get(file) ?? []), ...hunkLines(line)]);
    }
  }
  return added;
}

function hunkLines(header: string): number[] {
  const [, start, count] = HUNK_NEW_START.exec(header) ?? [];
  return Array.from({ length: Number(count ?? 1) }, (_, offset) => Number(start) + offset);
}

function isRead(file: string): boolean {
  return !NOT_CODE.includes(extname(file).toLowerCase()) && !EVIDENCE.some((folder) => file.startsWith(folder));
}

function citingComments(file: string, lines: number[], comments: Map<number, string>): CitingComment[] {
  return lines.flatMap((line) => {
    const comment = comments.get(line);
    const cites = comment === undefined ? [] : citedKinds(comment);
    return comment === undefined || cites.length === 0 ? [] : [{ file, line, cites, text: comment }];
  });
}

async function scanBranch(root: string, base: string): Promise<Scan> {
  const diffOptions = ['diff', '-U0', '--diff-filter=d', '--no-color', '--no-ext-diff', '--src-prefix=a/', '--dst-prefix=b/'];
  const added = addedLinesByFile(await gitOrThrow(root, [...diffOptions, base, 'HEAD']));
  const scan: Scan = { comments: [], unread: [] };
  for (const [file, lines] of added) {
    if (!isRead(file) || lines.length === 0) continue;
    const comments = commentLinesOf(file, await gitOrThrow(root, ['show', `HEAD:${file}`]));
    if (comments === null) scan.unread.push(file);
    else scan.comments.push(...citingComments(file, lines, comments));
  }
  return scan;
}

function closingLine(count: number): string {
  if (count === 0) return 'ningún comentario cita documentos';
  return count === 1 ? '1 comentario cita documentos' : `${count} comentarios citan documentos`;
}

function report({ comments, unread }: Scan, io: Io): void {
  comments.forEach(({ file, line, cites, text: comment }) => io.out(`${file}:${line} · ${cites.join(', ')} · ${comment}`));
  if (unread.length > 0) io.out(`sin leer: ${unread.join(', ')}`);
  io.out(closingLine(comments.length));
}

export const reviewCommentsVerb: Verb = {
  noun: 'review',
  verb: 'comments',
  summary: 'Lista los comentarios añadidos en la rama que citan documentos; informa y no falla por encontrarlos',
  options: { base: { type: 'string' }, 'project-root': { type: 'string' }, json: { type: 'boolean' } },
  async run(args, io) {
    const base = requiredOption(args, 'base');
    const root = text(args, 'project-root') ?? '.';
    const mergeBase = await git(root, ['merge-base', 'HEAD', base]);
    if (mergeBase.code !== 0) {
      io.err(`base: no se encuentra ${base}`);
      return 1;
    }
    const scan = await scanBranch(root, mergeBase.stdout.trim());
    if (args.values.json) io.json(scan);
    else report(scan, io);
    return 0;
  },
};
