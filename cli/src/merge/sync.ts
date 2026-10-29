import { DomainError, UsageError } from '../cli/args.ts';
import type { Io } from '../cli/io.ts';
import { gitLines } from '../git/git.ts';
import { resolveMergePolicy } from './policy.ts';
import { resolveProjectRoot, type MergeOptions } from './run.ts';
import { assertNothingPending, fetchBase, integrateRef, remoteForBranch } from './steps.ts';

const REFUSED: [keyof MergeOptions, string][] = [
  ['into', '--into'], ['tag', '--tag'], ['order', '--order'], ['push', '--push'], ['verify', '--verify'], ['verifiedAt', '--verified-at'], ['check', '--check'], ['branch', '--branch'],
];

function refuseMergeOptions(options: MergeOptions): void {
  const refused = REFUSED.find(([key]) => options[key] !== null && options[key] !== false);
  if (refused !== undefined) throw new UsageError(`--sync no admite ${refused[1]}`);
}

export async function syncBranch(options: MergeOptions, io: Io): Promise<void> {
  refuseMergeOptions(options);
  const root = resolveProjectRoot(options.projectRoot);
  const { into } = resolveMergePolicy(root);
  const [branch] = await gitLines(root, ['branch', '--show-current']);
  if (branch === undefined) throw new DomainError('base: HEAD desacoplado; --sync integra la base en una rama');
  await assertNothingPending(root, branch);
  const base = await fetchBase(root, { into, remote: await remoteForBranch(root, into) });
  if (!(await integrateRef(root, base, io.out))) io.out(`base: al día: '${base}' ya está en '${branch}'`);
}
