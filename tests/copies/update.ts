// Uso: node tests/copies/update.ts <fuente> <tag> [<ruta de upstream.json>], con SDD_UPSTREAM_DIR apuntando a la carpeta de los clones.
// Sube cada copia anotada de esa fuente al tag nuevo con git merge-file y cambia su versión en el registro.
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { BuildError } from '../../build/errors.ts';
import { readRegistry, type Entry, type Registry } from '../../build/sources.ts';
import { git } from '../../cli/src/git/git.ts';
import { findClones } from '../upstream/clones.ts';
import { markTask } from './annotated.ts';
import { showAt } from './check.ts';

const DEFAULT_REGISTRY = resolve(import.meta.dirname, '../../upstream.json');
// git merge-file sale con el número de conflictos (hasta 127) o con un código negativo, que el proceso ve como 128 o más.
const MAX_CONFLICTS = 127;

interface Merged {
  text: string;
  conflicts: number;
}

interface Planned {
  entry: Entry;
  merged: Merged;
}

const lf = (text: string): string => text.replace(/\r\n/g, '\n');

export async function mergeCopy(annotated: string, older: string, newer: string, labels: [string, string]): Promise<Merged> {
  const dir = mkdtempSync(join(tmpdir(), 'sdd-merge-'));
  try {
    const files = ['kit', 'older', 'newer'].map((name) => join(dir, name));
    [annotated, older, newer].forEach((text, index) => writeFileSync(files[index], lf(text)));
    const result = await git(dir, ['merge-file', '-p', '-L', 'kit', '-L', labels[0], '-L', labels[1], ...files]);
    if (result.code < 0 || result.code > MAX_CONFLICTS) throw new BuildError(`git merge-file falló: ${result.stderr.trim()}`);
    return { text: result.stdout, conflicts: result.code };
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

function conflictLines(kit: string, merged: Merged): string[] {
  return conflictBlocks(merged.text).flatMap(({ line, tasks }) =>
    tasks.map((task) => `${kit}:${line}: conflicto con el bloque ${task}; si te quedas con la versión de la fuente, el bloque se pierde`),
  );
}

async function planEntry(entry: Entry, clone: string, tag: string, repoRoot: string): Promise<Planned | string> {
  const [kit] = entry.kit;
  const [path] = entry.paths;
  const newer = await showAt(clone, tag, path);
  if (newer === null) return `${kit}: su original ${path} no existe en ${tag}: mapéalo antes de actualizar`;
  const older = (await showAt(clone, entry.version, path)) ?? '';
  try {
    return { entry, merged: await mergeCopy(readFileSync(resolve(repoRoot, kit), 'utf8'), older, newer, [entry.version, tag]) };
  } catch (error) {
    if (error instanceof BuildError) throw new BuildError(`${kit}: ${error.message}`);
    throw error;
  }
}

function bumpVersions(registry: Registry, merged: Entry[], source: string, tag: string): void {
  for (const entry of merged) {
    entry.version = tag;
    for (const ref of entry.from ?? []) if (ref.source === source) ref.version = tag;
  }
}

async function cloneWithTag(registry: Registry, source: string, tag: string, clonesDir: string): Promise<string> {
  const repo = registry.sources[source]?.repo;
  if (!repo) throw new BuildError(`${source}: no está en las fuentes de upstream.json`);
  const clone = (await findClones(clonesDir)).get(repo.toLowerCase());
  if (!clone) throw new BuildError(`${source}: sin clone de ${repo} en ${clonesDir}.`);
  if ((await git(clone, ['cat-file', '-e', `${tag}^{commit}`])).code !== 0) throw new BuildError(`${source}: falta ${tag} en el clon ${clone}`);
  return clone;
}

async function updateSource(registryPath: string, source: string, tag: string, clonesDir: string): Promise<{ lines: string[]; clean: boolean }> {
  const registry = readRegistry(registryPath);
  const clone = await cloneWithTag(registry, source, tag, clonesDir);
  const repoRoot = dirname(registryPath);
  const due = registry.entries.filter((entry) => entry.kind === 'copy' && entry.source === source && entry.pending === undefined && entry.version !== tag);
  const planned = await Promise.all(due.map((entry) => planEntry(entry, clone, tag, repoRoot)));
  const lines: string[] = [];
  for (const plan of planned) {
    if (typeof plan === 'string') lines.push(plan);
    else lines.push(`${plan.entry.kit[0]}: ${plan.entry.version} → ${tag}, ${plan.merged.conflicts} conflictos`, ...conflictLines(plan.entry.kit[0], plan.merged));
  }
  const merged = planned.filter((plan): plan is Planned => typeof plan !== 'string');
  for (const { entry, merged: result } of merged) writeFileSync(resolve(repoRoot, entry.kit[0]), result.text);
  bumpVersions(registry, merged.map((plan) => plan.entry), source, tag);
  if (merged.length > 0) writeFileSync(registryPath, `${JSON.stringify(registry, null, 2)}\n`);
  return { lines, clean: merged.length === planned.length && merged.every((plan) => plan.merged.conflicts === 0) };
}

async function main(argv: string[]): Promise<number> {
  const [source, tag, registryArg] = argv;
  if (!source || !tag) return report(['Uso: moon run kit:copies-update -- <fuente> <tag>']);
  const dir = process.env.SDD_UPSTREAM_DIR;
  if (!dir) return report(['Falta SDD_UPSTREAM_DIR: la carpeta con los clones de las fuentes vigiladas.']);
  try {
    const { lines, clean } = await updateSource(resolve(registryArg ?? DEFAULT_REGISTRY), source, tag, dir);
    return report(lines, clean ? 0 : 1);
  } catch (error) {
    if (error instanceof BuildError) return report([error.message]);
    throw error;
  }
}

function report(lines: string[], code = 1): number {
  for (const line of lines) console.log(line);
  return code;
}

if (resolve(process.argv[1] ?? '') === import.meta.filename) process.exitCode = await main(process.argv.slice(2));
