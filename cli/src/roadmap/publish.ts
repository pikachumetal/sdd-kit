import { copyFileSync, existsSync, mkdirSync, realpathSync, rmSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { DomainError, UsageError } from '../cli/args.ts';
import type { Io } from '../cli/io.ts';
import { commonDir, git, gitLines, worktrees } from '../git/git.ts';
import { withLock } from '../git/lock.ts';
import { withTempWorktree } from '../merge/temp-worktree.ts';

const DOCS_DIR = '.docs/sdd';

export interface PublishOptions {
  projectRoot: string;
  files: string[];
  message: string;
  into: string;
  lockTimeoutMinutes: number;
}

function docsRelativePath(projectRoot: string, file: string): string {
  const inside = relative(join(projectRoot, DOCS_DIR), resolve(projectRoot, file)).split(sep);
  if (inside[0] === '..' || inside[0] === '' || /^[a-z]:$/i.test(inside[0])) {
    throw new UsageError(`el fichero '${file}' no está bajo ${DOCS_DIR}/`);
  }
  return `${DOCS_DIR}/${inside.join('/')}`;
}

async function assertBaseIntegrated({ projectRoot, files, into }: PublishOptions): Promise<void> {
  const [base] = await gitLines(projectRoot, ['merge-base', 'HEAD', into]);
  if (base === undefined) throw new DomainError(`no hay base común entre HEAD y ${into}`);
  for (const file of files) {
    const { code, stderr } = await git(projectRoot, ['diff', '--quiet', base, into, '--', file]);
    if (code === 1) throw new DomainError(`${into} cambió ${file} desde tu base: integra ${into} antes de publicar`);
    if (code !== 0) throw new DomainError(`git diff falló en '${projectRoot}': ${stderr.trim()}`);
  }
}

async function assertTargetClean(target: string, files: string[]): Promise<void> {
  for (const file of files) {
    const { code, stdout, stderr } = await git(target, ['status', '--porcelain', '--', file]);
    if (code !== 0) throw new DomainError(`git status falló en '${target}': ${stderr.trim()}`);
    if (stdout.trim() !== '') throw new DomainError(`destino con cambios: ${file} en ${target}`);
  }
}

async function isTracked(target: string, file: string): Promise<boolean> {
  return (await git(target, ['cat-file', '-e', `HEAD:${file}`])).code === 0;
}

async function rollback(target: string, files: string[]): Promise<void> {
  for (const file of files) {
    if (await isTracked(target, file)) await git(target, ['checkout', 'HEAD', '--', file]);
    else {
      await git(target, ['rm', '-f', '--cached', '--ignore-unmatch', '--', file]);
      rmSync(join(target, file), { force: true });
    }
  }
}

async function commitFiles(target: string, options: PublishOptions): Promise<void> {
  const { projectRoot, files, message } = options;
  await assertTargetClean(target, files);
  try {
    for (const file of files) {
      mkdirSync(dirname(join(target, file)), { recursive: true });
      copyFileSync(join(projectRoot, file), join(target, file));
    }
    await runGit(target, ['add', '--', ...files]);
    await runGit(target, ['commit', '-m', message, '--', ...files]);
  } catch (error) {
    await rollback(target, files);
    throw error;
  }
}

async function runGit(cwd: string, args: string[]): Promise<void> {
  const { code, stderr, stdout } = await git(cwd, args);
  if (code !== 0) throw new DomainError(`git ${args[0]} falló en '${cwd}': ${(stderr || stdout).trim()}`);
}

async function withTarget<T>(options: PublishOptions, body: (target: string) => Promise<T>): Promise<T> {
  const { projectRoot, into } = options;
  await git(projectRoot, ['worktree', 'prune']);
  const found = (await worktrees(projectRoot)).find((entry) => entry.branch === into);
  return found === undefined ? withTempWorktree(projectRoot, into, body) : body(found.path);
}

export function resolveProjectRoot(path: string): string {
  if (!existsSync(path)) throw new DomainError(`No existe la ruta de proyecto '${path}'.`);
  return realpathSync.native(resolve(path));
}

export async function publish(options: PublishOptions, io: Io): Promise<void> {
  const { projectRoot } = options;
  const files = options.files.map((file) => docsRelativePath(projectRoot, file));
  const missing = files.find((file) => !existsSync(join(projectRoot, file)));
  if (missing !== undefined) throw new DomainError(`No existe '${missing}' en '${projectRoot}'.`);
  const job = { ...options, files };
  const [branch = ''] = await gitLines(projectRoot, ['branch', '--show-current']);
  const lockPath = resolve(await commonDir(projectRoot), 'sdd-merge.lock');
  const lock = { path: lockPath, label: 'merge', io: { ...io, err: io.out }, owner: { branch, worktree: projectRoot } };
  await withLock(lock, options.lockTimeoutMinutes, async () => {
    await assertBaseIntegrated(job);
    await withTarget(job, (target) => commitFiles(target, job));
  });
}
