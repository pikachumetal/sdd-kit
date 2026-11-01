import { extname } from 'node:path';
import { requiredOption, text } from '../cli/args.ts';
import type { Io } from '../cli/io.ts';
import type { Verb } from '../cli/verbs.ts';
import { git } from '../git/git.ts';
import { citedKinds } from './citations.ts';
import { addedLinesByFile } from './diff.ts';
import { commentLinesOf, hasLexer, type CommentLine } from './lexer.ts';

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
const DIFF_OPTIONS = ['diff', '-U0', '-M', '--inter-hunk-context=0', '--diff-filter=d', '--no-color', '--no-ext-diff', '--src-prefix=a/', '--dst-prefix=b/'];
const DIFF_PATHS = ['--', ':/', ':(top,exclude,glob).docs/sdd/specs/**', ':(top,exclude,glob).docs/sdd/changes/**'];

async function branchDiff(root: string, base: string): Promise<string> {
  const { code, stdout, stderr } = await git(root, [...DIFF_OPTIONS, base, 'HEAD', ...DIFF_PATHS]);
  if (code !== 0) throw new Error(stderr.trim() || `git diff falló con el código ${code}`);
  return stdout;
}

function citingComments(file: string, lines: number[], comments: Map<number, CommentLine>): CitingComment[] {
  return lines.flatMap((line) => {
    const found = comments.get(line);
    if (found === undefined) return [];
    const cites = citedKinds(found.comment);
    return cites.length === 0 ? [] : [{ file, line, cites, text: found.text }];
  });
}

async function commentsAtHead(root: string, file: string): Promise<Map<number, CommentLine> | null> {
  if (!hasLexer(file)) return null;
  const { code, stdout } = await git(root, ['show', `HEAD:${file}`]);
  return code === 0 ? commentLinesOf(file, stdout) : null;
}

async function scanBranch(root: string, base: string): Promise<Scan> {
  const scan: Scan = { comments: [], unread: [] };
  for (const [file, lines] of addedLinesByFile(await branchDiff(root, base))) {
    if (NOT_CODE.includes(extname(file).toLowerCase()) || lines.length === 0) continue;
    const comments = await commentsAtHead(root, file);
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
