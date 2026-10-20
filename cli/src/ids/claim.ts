import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { DomainError, UsageError } from '../cli/args.ts';
import type { Io } from '../cli/io.ts';
import { git, gitLines, samePath, toplevel } from '../git/git.ts';
import { runGit, withIntegrationTarget, withMergeLock } from '../merge/integration.ts';
import { configuredMergeInto, configuredMergePush } from '../merge/policy.ts';
import { fetchBase, remoteForBranch, remoteMoved, syncBaseBranch, unpublishedLines } from '../merge/steps.ts';
import { resolveProjectRoot } from '../roadmap/publish.ts';
import { raiseCounter, reserveIds } from './next.ts';
import { renumberLines, type IdChange } from './renumber.ts';
import { BRANCH_CHANGE_FOLDERS, BRANCH_ID, BRANCH_ROADMAPS, ID_TAG_PREFIX, assertSequenceMode, idsOutsideTask, rowIds } from './scan.ts';
import { refIds, unpublishedReservations, type Reservation } from './unpublished.ts';

export interface ClaimOptions {
  projectRoot: string;
  id: string | null;
  into: string | null;
  lockTimeoutMinutes: number;
}

interface Claim {
  root: string;
  id: string;
  into: string;
  remote: string;
  publish: boolean;
  lockTimeoutMinutes: number;
  io: Io;
}

interface Outcome {
  id: string;
  report: string[];
}

const ATTEMPTS = 3;
const TAG_ATTEMPTS = 3;
const RENUMBERED_FILES = [...BRANCH_ROADMAPS, '.docs/sdd/steering/debt.md'];
const TASK_ID = /^[0-9]{4}$/;

const remoteName = (claim: Claim) => `${claim.remote}/${claim.into}`;
const remoteRef = (claim: Claim) => `refs/remotes/${claim.remote}/${claim.into}`;
const takenLine = (claim: Claim, { from, to }: IdChange) => `id: la ${from} ya la tiene otro en ${remoteName(claim)}; la ${from} pasa a ${to}`;
const artifactPattern = (id: string) => new RegExp(`(-(?:feature|task|patch|proposal)-)${id}(?=-)`);

function rewriteFile(path: string, changes: IdChange[], remoteLines: Set<string>): void {
  const text = readFileSync(path, 'utf8');
  const eol = text.includes('\r\n') ? '\r\n' : '\n';
  const lines = changes.reduce((current, change) => renumberLines(current, change, remoteLines), text.split(/\r?\n/));
  writeFileSync(path, lines.join(eol));
}

async function remoteLinesOf(target: string, claim: Claim, file: string): Promise<string[]> {
  return gitLines(target, ['show', `${remoteRef(claim)}:${file}`]);
}

async function moveOwnFolders(target: string, claim: Claim, { from, to }: IdChange): Promise<void> {
  for (const folder of BRANCH_CHANGE_FOLDERS.filter((relative) => existsSync(join(target, relative)))) {
    const published = new Set(await gitLines(target, ['ls-tree', '-d', '--name-only', `${remoteRef(claim)}:${folder}`]));
    const own = readdirSync(join(target, folder)).filter((name) => artifactPattern(from).test(name) && !published.has(name));
    for (const name of own) await runGit(target, ['mv', `${folder}/${name}`, `${folder}/${name.replace(artifactPattern(from), `$1${to}`)}`]);
  }
}

async function nextFreeIds(claim: Claim, count: number): Promise<string[]> {
  return count === 0 ? [] : reserveIds({ root: claim.root, io: claim.io }, count, claim.lockTimeoutMinutes);
}

async function commitRenumbering(target: string, changes: IdChange[], files: string[]): Promise<void> {
  await runGit(target, ['add', '--', ...files]);
  if ((await git(target, ['diff', '--cached', '--quiet'])).code === 0) return;
  const subject = changes.map(({ from, to }) => `la ${from} pasa a ${to}`).join(', ');
  await runGit(target, ['commit', '-q', '-m', `chore(roadmap): ${subject}`]);
}

async function renumber(target: string, claim: Claim, taken: string[]): Promise<IdChange[]> {
  const fresh = await nextFreeIds(claim, taken.length);
  const changes = taken.map((from, index) => ({ from, to: fresh[index]! }));
  if (changes.length === 0) return changes;
  const files = RENUMBERED_FILES.filter((file) => existsSync(join(target, file)));
  for (const file of files) rewriteFile(join(target, file), changes, new Set(await remoteLinesOf(target, claim, file)));
  for (const change of changes) await moveOwnFolders(target, claim, change);
  await commitRenumbering(target, changes, files);
  return changes;
}

async function pushInto(target: string, claim: Claim): Promise<'pushed' | 'moved' | 'protected'> {
  const pushed = await git(target, ['push', claim.remote, `refs/heads/${claim.into}:refs/heads/${claim.into}`]);
  if (pushed.code === 0) return 'pushed';
  return (await remoteMoved(target, claim.remote, claim.into)) ? 'moved' : 'protected';
}

async function remoteTagCommit(target: string, claim: Claim, id: string): Promise<string | null> {
  const listed = await runGit(target, ['ls-remote', '--tags', claim.remote, `refs/tags/${ID_TAG_PREFIX}${id}`]);
  return listed === '' ? null : listed.split(/\s+/)[0]!;
}

async function isAncestor(target: string, commit: string, ref: string): Promise<boolean> {
  return (await git(target, ['merge-base', '--is-ancestor', commit, ref])).code === 0;
}

async function tagStep(target: string, claim: Claim, id: string): Promise<'mine' | 'fixed' | 'taken' | 'retry'> {
  const tagged = await remoteTagCommit(target, claim, id);
  if (tagged !== null) return (await isAncestor(target, tagged, claim.into)) ? 'mine' : 'taken';
  const tag = `${ID_TAG_PREFIX}${id}`;
  await runGit(target, ['tag', '-f', tag, claim.into]);
  return (await git(target, ['push', claim.remote, `refs/tags/${tag}`])).code === 0 ? 'fixed' : 'retry';
}

function fixedLine(claim: Claim, id: string): string {
  const reason = claim.publish ? 'no admite push directo' : 'no se publica (merge.push: false)';
  return `push: '${claim.into}' ${reason}; id fijado con la etiqueta ${ID_TAG_PREFIX}${id}`;
}

async function claimWithTag(target: string, claim: Claim, outcome: Outcome): Promise<Outcome> {
  let { id } = outcome;
  const report = [...outcome.report];
  for (let attempt = 1; attempt <= TAG_ATTEMPTS; attempt++) {
    const step = await tagStep(target, claim, id);
    if (step === 'mine') return { id, report: [...report, `id: ${id} ya fijada con la etiqueta ${ID_TAG_PREFIX}${id}`] };
    if (step === 'fixed') return { id, report: [...report, fixedLine(claim, id)] };
    if (step === 'taken') {
      const [change] = await renumber(target, claim, [id]);
      report.push(takenLine(claim, change!));
      id = change!.to;
    }
  }
  throw new DomainError(`push: no se pudo fijar la etiqueta ${ID_TAG_PREFIX}${id} en '${claim.remote}'.`);
}

async function claimWithoutRow(target: string, claim: Claim): Promise<Outcome> {
  const taken = (await idsOutsideTask(claim.root)).includes(claim.id) || (await refIds(target, remoteRef(claim))).has(claim.id);
  if (!taken) {
    await raiseCounter({ root: claim.root, io: claim.io }, claim.id, claim.lockTimeoutMinutes);
    return { id: claim.id, report: [`id: ${claim.id} libre en ${remoteName(claim)}`] };
  }
  const [to] = await nextFreeIds(claim, 1);
  return { id: to!, report: [takenLine(claim, { from: claim.id, to: to! })] };
}

async function publishRow(target: string, claim: Claim, reservations: Reservation[]): Promise<Outcome | 'moved'> {
  const others = reservations.filter((reservation) => !reservation.ids.includes(claim.id)).map((reservation) => reservation.commit);
  const remoteIds = await refIds(target, remoteRef(claim));
  const taken = [...new Set(reservations.flatMap((reservation) => reservation.ids))].filter((id) => remoteIds.has(id)).sort();
  const changes = await renumber(target, claim, taken);
  const id = changes.find((change) => change.from === claim.id)?.to ?? claim.id;
  await syncBaseBranch(target, { into: claim.into, remote: claim.remote }, claim.io.out);
  const report = changes.map((change) => takenLine(claim, change));
  const pushed = claim.publish ? await pushInto(target, claim) : 'protected';
  if (pushed === 'moved') return 'moved';
  if (pushed === 'protected') return claimWithTag(target, claim, { id, report });
  return { id, report: [...report, ...unpublishedLines(claim.into, `la ${claim.id}`, others), `id: ${id} es tuya; publicada en ${remoteName(claim)}`] };
}

function rowTitle(line: string): string {
  return /\*\*(.+?)\*\*/.exec(line)?.[1] ?? (line.split('|')[2] ?? '').trim();
}

async function publishedRowTitle(target: string, claim: Claim): Promise<string | null> {
  for (const file of BRANCH_ROADMAPS) {
    const row = (await remoteLinesOf(target, claim, file)).find((line) => rowIds([line])[0] === claim.id);
    if (row !== undefined) return rowTitle(row);
  }
  return null;
}

async function alreadyPublished(target: string, claim: Claim): Promise<Outcome | null> {
  const nothing = `id: ${claim.id} ya estaba en ${remoteName(claim)}`;
  if ((await refIds(target, claim.into)).has(claim.id)) return { id: claim.id, report: [`${nothing}; nada que publicar`] };
  const title = await publishedRowTitle(target, claim);
  return title === null ? null : { id: claim.id, report: [`${nothing} («${title}»); nada que publicar`] };
}

async function attemptClaim(target: string, claim: Claim): Promise<Outcome | 'moved'> {
  await fetchBase(target, claim);
  await runGit(target, ['fetch', claim.remote, `+refs/tags/${ID_TAG_PREFIX}*:refs/tags/${ID_TAG_PREFIX}*`]);
  const reservations = await unpublishedReservations(target, remoteRef(claim), claim.into);
  if (reservations.some((reservation) => reservation.ids.includes(claim.id))) return publishRow(target, claim, reservations);
  return (await alreadyPublished(target, claim)) ?? claimWithoutRow(target, claim);
}

async function assertClean(target: string): Promise<void> {
  if ((await runGit(target, ['status', '--porcelain'])) !== '') {
    throw new DomainError(`destino con cambios: ${target}; límpialo y relanza sdd id claim`);
  }
}

async function claimIn(target: string, claim: Claim): Promise<Outcome> {
  await assertClean(target);
  const before = await runGit(target, ['rev-parse', 'HEAD']);
  try {
    for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
      if (attempt > 1) await runGit(target, ['reset', '-q', '--hard', before]);
      const outcome = await attemptClaim(target, claim);
      if (outcome !== 'moved') return outcome;
    }
    throw new DomainError(`push: '${claim.into}' sigue moviéndose en '${claim.remote}' tras ${ATTEMPTS} intentos; relanza sdd id claim en un rato`);
  } catch (error) {
    await git(target, ['merge', '--abort']);
    await git(target, ['reset', '-q', '--hard', before]);
    throw error;
  }
}

async function hasOwnCommits(root: string, into: string): Promise<boolean> {
  return (await gitLines(root, ['rev-list', 'HEAD', '--not', `refs/heads/${into}`])).length > 0;
}

async function renameBranch(claim: Claim, branch: string, renamed: string): Promise<string[]> {
  if ((await git(claim.root, ['rev-parse', '--verify', '--quiet', `refs/heads/${renamed}`])).code === 0) {
    return [`rama: ya existe ${renamed}; no se renombra`];
  }
  await runGit(claim.root, ['branch', '-m', branch, renamed]);
  return [`rama: ${branch} → ${renamed}`, `worktree: la carpeta sigue en ${claim.root}`];
}

async function fastForward(claim: Claim): Promise<string[]> {
  if (await isAncestor(claim.root, `refs/heads/${claim.into}`, 'HEAD')) return [];
  if ((await runGit(claim.root, ['status', '--porcelain'])) !== '') return [`rama: cambios sin commitear; no avanza a ${claim.into}`];
  await runGit(claim.root, ['merge', '-q', '--ff-only', `refs/heads/${claim.into}`]);
  return [];
}

async function settleBranch(claim: Claim, branch: string, id: string): Promise<string[]> {
  if (branch === '' || branch === claim.into) return [];
  const renamed = branch.replace(new RegExp(`(^|/)${claim.id}(?=$|-)`), `$1${id}`);
  if (await hasOwnCommits(claim.root, claim.into)) {
    return renamed === branch ? [] : [`rama: tiene commits propios; no se renombra: hazlo tú a ${renamed}`];
  }
  const lines = renamed === branch ? [] : await renameBranch(claim, branch, renamed);
  return [...lines, ...(await fastForward(claim))];
}

async function claimRemote(root: string, into: string): Promise<{ remote: string } | { reason: string }> {
  const top = await toplevel(root);
  if (top !== null && !samePath(top, root)) return { reason: 'sin comprobar en el remoto: la raíz del proyecto no es la del repositorio;' };
  const remote = top === null ? null : await remoteForBranch(root, into);
  if (remote === null || (await runGit(root, ['ls-remote', '--heads', remote, into])) === '') return { reason: 'sin remoto:' };
  return { remote };
}

function taskId(options: ClaimOptions, branch: string): string {
  const id = options.id ?? BRANCH_ID.exec(branch)?.[1];
  if (id === undefined) throw new UsageError(`--id: la rama '${branch}' no lleva id; pásalo con --id`);
  if (!TASK_ID.test(id)) throw new UsageError(`--id debe ser un id de cuatro cifras: '${id}'`);
  return id;
}

export async function claimIds(options: ClaimOptions, io: Io): Promise<string> {
  const root = resolveProjectRoot(options.projectRoot);
  assertSequenceMode(root);
  const [branch = ''] = await gitLines(root, ['branch', '--show-current']);
  const id = taskId(options, branch);
  const into = options.into ?? configuredMergeInto(root) ?? 'develop';
  const found = await claimRemote(root, into);
  if ('reason' in found) {
    io.out(`${found.reason} la ${id} vale (contador local)`);
    return id;
  }
  const claim: Claim = { root, id, into, remote: found.remote, publish: configuredMergePush(root) !== false, lockTimeoutMinutes: options.lockTimeoutMinutes, io };
  const outcome = await withMergeLock(root, { branch, io, minutes: claim.lockTimeoutMinutes }, () => withIntegrationTarget(root, into, (target) => claimIn(target, claim)));
  [...outcome.report, ...(await settleBranch(claim, branch, outcome.id))].forEach((line) => io.out(line));
  return outcome.id;
}
