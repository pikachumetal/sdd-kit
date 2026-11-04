// Uso: node tests/copies/update.ts <fuente> <tag> [<ruta de upstream.json>], con SDD_UPSTREAM_DIR apuntando a la carpeta de los clones.
// Sube cada copia anotada de esa fuente al tag nuevo con git merge-file, y cada from de esa fuente, y cambia sus versiones en el registro.
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { BuildError } from '../../build/errors.ts';
import { readRegistry, type Entry, type Registry } from '../../build/sources.ts';
import { git } from '../../cli/src/git/git.ts';
import { DEFAULT_REGISTRY, findClones, hasCommit, MISSING_UPSTREAM_DIR, report, showAt } from '../upstream/clones.ts';
import { markTask, splitFrontmatter } from './annotated.ts';

// git merge-file sale con el número de conflictos (hasta 127) o con un código negativo, que el proceso ve como 128 o más.
const MAX_CONFLICTS = 127;

interface Texts {
  kit: string;
  older: string;
  newer: string;
}

interface Merged {
  text: string;
  conflicts: number;
}

interface Planned {
  entry: Entry;
  merged: Merged;
}

interface Request {
  source: string;
  tag: string;
  clonesDir: string;
}

interface Target {
  clone: string;
  tag: string;
  repoRoot: string;
}

const lf = (text: string): string => text.replace(/\r\n/g, '\n');

// Se fusiona solo el cuerpo: el frontmatter es siempre el del kit, también si el original cambia el suyo.
export async function mergeCopy({ kit, older, newer }: Texts, labels: [string, string]): Promise<Merged> {
  const dir = mkdtempSync(join(tmpdir(), 'sdd-merge-'));
  try {
    const files = ['kit', 'older', 'newer'].map((name) => join(dir, name));
    [kit, older, newer].forEach((text, index) => writeFileSync(files[index], splitFrontmatter(lf(text)).body));
    const result = await git(dir, ['merge-file', '-p', '-L', 'kit', '-L', labels[0], '-L', labels[1], ...files]);
    if (result.code < 0 || result.code > MAX_CONFLICTS) throw new BuildError(`git merge-file falló: ${result.stderr.trim()}`);
    return { text: splitFrontmatter(lf(kit)).front + result.stdout, conflicts: result.code };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

export function conflictBlocks(text: string): { line: number; tasks: string[] }[] {
  const conflicts: { line: number; tasks: string[] }[] = [];
  let inKitSide = false;
  text.split('\n').forEach((line, index) => {
    if (line.startsWith('<<<<<<< ')) conflicts.push({ line: index + 1, tasks: [] });
    if (line.startsWith('<<<<<<< ') || line === '=======') inKitSide = line !== '=======';
    const task = inKitSide ? markTask(line) : null;
    if (task) conflicts.at(-1)?.tasks.push(task);
  });
  return conflicts;
}

function conflictLines(file: string, merged: Merged): string[] {
  return conflictBlocks(merged.text).flatMap(({ line, tasks }) =>
    tasks.map((task) => `${file}:${line}: conflicto con el bloque ${task}; si te quedas con la versión de la fuente, el bloque se pierde`),
  );
}

async function planEntry(entry: Entry, target: Target): Promise<Planned | string> {
  const [file] = entry.kit;
  const [path] = entry.paths;
  const newer = await showAt(target.clone, target.tag, path);
  if (newer === null) return `${file}: su original ${path} no existe en ${target.tag}: mapéalo antes de actualizar`;
  const older = await showAt(target.clone, entry.version, path);
  if (older === null) return `${file}: su original ${path} no existe en ${entry.version}`;
  try {
    const kit = readFileSync(resolve(target.repoRoot, file), 'utf8');
    return { entry, merged: await mergeCopy({ kit, older, newer }, [entry.version, target.tag]) };
  } catch (error) {
    if (error instanceof BuildError) throw new BuildError(`${file}: ${error.message}`);
    throw error;
  }
}

async function cloneWithTag(registry: Registry, { source, tag, clonesDir }: Request): Promise<string> {
  const repo = registry.sources[source]?.repo;
  if (!repo) throw new BuildError(`${source}: no está en las fuentes de upstream.json`);
  const clone = (await findClones(clonesDir)).get(repo.toLowerCase());
  if (!clone) throw new BuildError(`${source}: sin clone de ${repo} en ${clonesDir}.`);
  if (!(await hasCommit(clone, tag))) throw new BuildError(`${source}: falta ${tag} en el clon ${clone}`);
  return clone;
}

function bumpFrom(entries: Entry[], { source, tag }: Request): string[] {
  const lines: string[] = [];
  for (const entry of entries)
    for (const ref of entry.from ?? [])
      if (ref.source === source && ref.version !== tag) {
        lines.push(`${entry.kit[0]}: from ${source} ${ref.version} → ${tag}`);
        ref.version = tag;
      }
  return lines;
}

function reportMerges(planned: (Planned | string)[], tag: string): string[] {
  return planned.flatMap((plan) =>
    typeof plan === 'string' ? [plan] : [`${plan.entry.kit[0]}: ${plan.entry.version} → ${tag}, ${plan.merged.conflicts} conflictos`, ...conflictLines(plan.entry.kit[0], plan.merged)],
  );
}

async function updateSource(registryPath: string, request: Request): Promise<{ lines: string[]; clean: boolean }> {
  const registry = readRegistry(registryPath);
  const target: Target = { clone: await cloneWithTag(registry, request), tag: request.tag, repoRoot: dirname(registryPath) };
  const annotated = registry.entries.filter((entry) => entry.kind === 'copy' && entry.pending === undefined);
  const due = annotated.filter((entry) => entry.source === request.source && entry.version !== request.tag);
  const planned = await Promise.all(due.map((entry) => planEntry(entry, target)));
  const lines = reportMerges(planned, request.tag);
  const merged = planned.filter((plan): plan is Planned => typeof plan !== 'string');
  for (const { entry, merged: result } of merged) writeFileSync(resolve(target.repoRoot, entry.kit[0]), result.text);
  for (const { entry } of merged) entry.version = request.tag;
  const skipped = new Set(due.filter((_, index) => typeof planned[index] === 'string'));
  const bumped = bumpFrom(annotated.filter((entry) => !skipped.has(entry)), request);
  if (merged.length + bumped.length > 0) writeFileSync(registryPath, `${JSON.stringify(registry, null, 2)}\n`);
  const all = [...lines, ...bumped];
  if (all.length === 0) all.push(`${request.source}: nada que subir a ${request.tag}.`);
  return { lines: all, clean: merged.length === planned.length && merged.every((plan) => plan.merged.conflicts === 0) };
}

async function main(argv: string[]): Promise<number> {
  const [source, tag, registryArg] = argv;
  if (!source || !tag) return report(['Uso: moon run kit:copies-update -- <fuente> <tag>']);
  const clonesDir = process.env.SDD_UPSTREAM_DIR;
  if (!clonesDir) return report([MISSING_UPSTREAM_DIR]);
  try {
    const { lines, clean } = await updateSource(resolve(registryArg ?? DEFAULT_REGISTRY), { source, tag, clonesDir });
    return report(lines, clean ? 0 : 1);
  } catch (error) {
    if (error instanceof BuildError) return report([error.message]);
    throw error;
  }
}

if (resolve(process.argv[1] ?? '') === import.meta.filename) process.exitCode = await main(process.argv.slice(2));
