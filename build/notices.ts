// Los avisos de terceros que salen de upstream.json: la sección «## Fuentes» de THIRD_PARTY_NOTICES.md y el NOTICE
// de cada skill con copias. Uso: node build/notices.ts (moon run kit:notices), que los escribe y reconstruye dist/.
import { existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { buildInto, WHOLE_LINE_MARK } from './dist.ts';
import { BuildError } from './errors.ts';
import { mergeRefs, readRegistry, watchedRefs, type Entry, type Registry, type Source, type WatchedRef } from './sources.ts';

const NOTICES_FILE = 'THIRD_PARTY_NOTICES.md';
const SOURCES_HEADING = '## Fuentes';

const MIT_PERMISSION = `Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`;

const backticked = (items: string[]): string => items.map((item) => `\`${item}\``).join(', ');

const versionLabel = (version: string): string => (/^[0-9a-f]{7,40}$/.test(version) ? `commit ${version}` : `version ${version}`);

// La carpeta de skill de una ruta del kit; null fuera de skills/, donde no hay NOTICE.
function skillDirOf(kitPath: string): string | null {
  const match = /^skills\/[^/]+/.exec(kitPath);
  return match ? match[0] : null;
}

function licenseText(name: string, source: Source): string {
  if (source.license !== 'MIT') throw new BuildError(`${name}: licencia ${source.license} sin plantilla en build/notices.ts`);
  return `MIT License\n\n${source.copyright}\n\n${MIT_PERMISSION}`;
}

function noticeBlock(registry: Registry, ref: WatchedRef): string {
  const source = registry.sources[ref.source];
  const origin = `https://github.com/${source.repo}, ${versionLabel(ref.version)} (${ref.paths.join(', ')})`;
  return `Portions of this skill are adapted from ${origin},\ndistributed under the following license:\n\n${licenseText(ref.source, source)}`;
}

export function renderNotice(registry: Registry, skillDir: string): string | null {
  const copies = registry.entries.filter((entry) => entry.kind === 'copy' && entry.kit.some((path) => skillDirOf(path) === skillDir));
  if (copies.length === 0) return null;
  return mergeRefs(copies.flatMap(watchedRefs))
    .map((ref) => noticeBlock(registry, ref))
    .join('\n');
}

function sourcesRow(registry: Registry, entry: Entry, ref: WatchedRef): string {
  const source = registry.sources[ref.source];
  const license = source.copyright ? `${source.license}, ${source.copyright}` : source.license;
  const cells = [
    backticked(entry.kit),
    `[${ref.source}](https://github.com/${source.repo})`,
    entry.kind === 'copy' ? 'copia' : 'concepto',
    `\`${ref.version}\``,
    backticked(ref.paths),
    license,
  ];
  const note = ref.source === entry.source ? entry.note : undefined;
  return `| ${cells.join(' | ')} |${note ? ` ${note} |` : ' |'}`;
}

export function renderSourcesTable(registry: Registry): string {
  const header = ['| Fichero del kit | Fuente | Tipo | Versión | Rutas de la fuente | Licencia | Nota |', '| --- | --- | --- | --- | --- | --- | --- |'];
  const rows = registry.entries.flatMap((entry) => watchedRefs(entry).map((ref) => sourcesRow(registry, entry, ref)));
  return [SOURCES_HEADING, '', ...header, ...rows, ''].join('\n');
}

function withSourcesTable(notices: string, table: string): string {
  const lines = notices.replace(/\r\n/g, '\n').split('\n');
  const start = lines.indexOf(SOURCES_HEADING);
  if (start < 0) throw new BuildError(`${NOTICES_FILE} no tiene la sección «${SOURCES_HEADING}»`);
  const next = lines.findIndex((line, index) => index > start && line.startsWith('## '));
  const tail = next < 0 ? [] : ['', ...lines.slice(next)];
  return [...lines.slice(0, start), table.trimEnd(), ...tail].join('\n');
}

export function noticeFiles(registry: Registry, repoRoot: string): Map<string, string> {
  const files = new Map<string, string>();
  const skillDirs = new Set(registry.entries.flatMap((entry) => entry.kit.map(skillDirOf)).filter((dir) => dir !== null));
  for (const dir of [...skillDirs].sort()) {
    const notice = renderNotice(registry, dir);
    if (notice !== null) files.set(`${dir}/NOTICE`, notice);
  }
  const noticesPath = join(repoRoot, NOTICES_FILE);
  const current = existsSync(noticesPath) ? readFileSync(noticesPath, 'utf8') : '';
  files.set(NOTICES_FILE, withSourcesTable(current, renderSourcesTable(registry)));
  return files;
}

const SEE_NOTICE = /see `?NOTICE`?/;

export function seeNoticeWithout(repoRoot: string, files: string[]): string[] {
  return files
    .filter((file) => SEE_NOTICE.test(readFileSync(join(repoRoot, file), 'utf8')))
    .filter((file) => !existsSync(join(repoRoot, `${skillDirOf(file)}/NOTICE`)))
    .map((file) => `${file} dice see NOTICE, y la skill no tiene NOTICE: una skill sin copias no lo genera`);
}

const MIGRATIONS_DIR = 'skills/sdd-upgrade/references/migrations/';

function sourceVersionPattern(registry: Registry): RegExp {
  const escape = (name: string): string => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const names = Object.entries(registry.sources).flatMap(([key, source]) => [key, source.repo]);
  return new RegExp(`\`?(?:${names.map(escape).join('|')})\`?\\s+v?\\d+(?:\\.\\d+)+`);
}

// Las migraciones son historia: citan las versiones que tocaba cada release.
export function versionsInText(repoRoot: string, files: string[], registry: Registry): string[] {
  const pattern = sourceVersionPattern(registry);
  return files
    .filter((file) => !file.startsWith(MIGRATIONS_DIR) && !file.endsWith('/NOTICE'))
    .flatMap((file) =>
      readFileSync(join(repoRoot, file), 'utf8')
        .split('\n')
        .flatMap((line, index) => {
          const found = WHOLE_LINE_MARK.test(line) ? null : pattern.exec(line);
          return found ? [`${file}:${index + 1}: la versión de una fuente vive en upstream.json, no en el texto: «${found[0]}»`] : [];
        }),
    );
}

// Un NOTICE de una skill sin copias en el registro viajaría con una versión vieja.
function removeOrphanNotices(repoRoot: string, files: Map<string, string>): void {
  for (const name of readdirSync(join(repoRoot, 'skills'))) {
    const path = `skills/${name}/NOTICE`;
    if (!files.has(path) && existsSync(join(repoRoot, path))) rmSync(join(repoRoot, path));
  }
}

async function writeNotices(root: string): Promise<number> {
  const files = noticeFiles(readRegistry(join(root, 'upstream.json')), root);
  for (const [path, content] of files) writeFileSync(join(root, path), content);
  removeOrphanNotices(root, files);
  await buildInto(root, join(root, 'dist'));
  return files.size;
}

if (resolve(process.argv[1] ?? '') === import.meta.filename) {
  try {
    console.log(`Avisos escritos desde upstream.json y dist/ reconstruido: ${await writeNotices(resolve(import.meta.dirname, '..'))} ficheros.`);
  } catch (error) {
    if (!(error instanceof BuildError)) throw error;
    console.error(error.message);
    process.exitCode = 1;
  }
}
