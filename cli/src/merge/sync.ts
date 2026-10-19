import { DomainError, UsageError } from '../cli/args.ts';
import type { Io } from '../cli/io.ts';
import { git, gitLines } from '../git/git.ts';
import { completeMergeAttempt, gitWithOutput, mergeArgs } from './attempt.ts';
import { resolveMergePolicy } from './policy.ts';
import { resolveProjectRoot, type MergeOptions } from './run.ts';
import { fetchBase, remoteForBranch, shortHead } from './steps.ts';

const REFUSED: [keyof MergeOptions, string][] = [
  ['into', '--into'], ['tag', '--tag'], ['order', '--order'], ['push', '--push'], ['verify', '--verify'], ['verifiedAt', '--verified-at'], ['check', '--check'], ['branch', '--branch'],
];

function refuseMergeOptions(options: MergeOptions): void {
  const refused = REFUSED.find(([key]) => options[key] !== null && options[key] !== false);
  if (refused !== undefined) throw new UsageError(`--sync no admite ${refused[1]}`);
}

async function assertNothingPending(root: string, branch: string): Promise<void> {
  const changed = (await gitLines(root, ['status', '--porcelain', '--untracked-files=no'])).length > 0;
  const merging = (await git(root, ['rev-parse', '--verify', '--quiet', 'MERGE_HEAD'])).code === 0;
  if (changed || merging) throw new DomainError(`base: '${branch}' tiene cambios sin commitear; commitéalos antes de integrar la base`);
}

export async function syncBranch(options: MergeOptions, io: Io): Promise<void> {
  refuseMergeOptions(options);
  const root = resolveProjectRoot(options.projectRoot);
  const { into } = resolveMergePolicy(root);
  const [branch] = await gitLines(root, ['branch', '--show-current']);
  if (branch === undefined) throw new DomainError('base: HEAD desacoplado; --sync integra la base en una rama');
  await assertNothingPending(root, branch);
  const base = await fetchBase(root, { into, remote: await remoteForBranch(root, into) });
  if ((await git(root, ['merge-base', '--is-ancestor', base, 'HEAD'])).code === 0) return io.out(`base: al día: '${base}' ya está en '${branch}'`);
  const merged = await gitWithOutput(root, mergeArgs(['--no-edit', base]));
  await completeMergeAttempt({ worktree: root, stepName: 'base', output: merged.output, report: io.out, destinationIsTheirs: true }, merged.code);
  io.out(`base: integrada '${base}' en '${branch}': ${await shortHead(root)}`);
}
