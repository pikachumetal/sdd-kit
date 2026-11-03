// El registro de fuentes (upstream.json) y los avisos de terceros que salen de él: la tabla
// «## Fuentes» de THIRD_PARTY_NOTICES.md y el NOTICE de cada skill con copias.
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { BuildError } from './dist.ts';

export interface Source {
  repo: string;
  tagPrefix: string;
  license: string;
  copyright: string;
}

export interface Entry {
  kind: 'copy' | 'concept';
  source: string;
  version: string;
  paths: string[];
  kit: string[];
  note?: string;
}

export interface Registry {
  sources: Record<string, Source>;
  entries: Entry[];
}

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

export function readRegistry(path: string): Registry {
  return JSON.parse(readFileSync(path, 'utf8'));
}

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

function noticeBlock(registry: Registry, entry: Entry): string {
  const source = registry.sources[entry.source];
  const origin = `https://github.com/${source.repo}, ${versionLabel(entry.version)} (${entry.paths.join(', ')})`;
  return `Portions of this skill are adapted from ${origin},\ndistributed under the following license:\n\n${licenseText(entry.source, source)}`;
}

export function renderNotice(registry: Registry, skillDir: string): string | null {
  const copies = registry.entries.filter((entry) => entry.kind === 'copy' && entry.kit.some((path) => skillDirOf(path) === skillDir));
  if (copies.length === 0) return null;
  return copies.map((entry) => noticeBlock(registry, entry)).join('\n');
}

function sourcesRow(registry: Registry, entry: Entry): string {
  const source = registry.sources[entry.source];
  const license = source.copyright ? `${source.license}, ${source.copyright}` : source.license;
  const cells = [
    backticked(entry.kit),
    `[${entry.source}](https://github.com/${source.repo})`,
    entry.kind === 'copy' ? 'copia' : 'concepto',
    `\`${entry.version}\``,
    backticked(entry.paths),
    license,
  ];
  return `| ${cells.join(' | ')} |${entry.note ? ` ${entry.note} |` : ' |'}`;
}

export function renderSourcesTable(registry: Registry): string {
  const header = ['| Fichero del kit | Fuente | Tipo | Versión | Rutas de la fuente | Licencia | Nota |', '| --- | --- | --- | --- | --- | --- | --- |'];
  const rows = registry.entries.map((entry) => sourcesRow(registry, entry));
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
