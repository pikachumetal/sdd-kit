import { UsageError } from '../cli/args.ts';
import { git } from '../git/git.ts';

export async function requireRevision(rev: string, label: string): Promise<void> {
  const { code } = await git(process.cwd(), ['rev-parse', '--verify', '--quiet', rev]);
  if (code !== 0) throw new UsageError(`bad ${label}: ${rev}`);
}
