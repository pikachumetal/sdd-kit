import { existsSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';

export type DocumentName = 'roadmap' | 'changelog' | 'estimation';

export interface ResolvedDocument {
  file: string | null;
  shadowed: string | null;
}

export const ROOT_DOCUMENTS = ['PRODUCT.md', 'ROADMAP.md', 'CHANGELOG.md'];

export function projectRoot(docsPath: string): string {
  return dirname(dirname(resolve(docsPath)));
}

export function documentCandidates(docsPath: string, name: DocumentName): [string, string] {
  const docs = resolve(docsPath);
  const root = projectRoot(docs);
  if (name === 'roadmap') return [join(root, 'ROADMAP.md'), join(docs, 'roadmap.md')];
  if (name === 'changelog') return [join(root, 'CHANGELOG.md'), join(docs, 'changelog.md')];
  return [join(docs, 'steering', 'estimation.md'), join(docs, 'estimation.md')];
}

export function resolveDocument(docsPath: string, name: DocumentName): ResolvedDocument {
  const [current, legacy] = documentCandidates(docsPath, name);
  if (!existsSync(current)) return { file: existsSync(legacy) ? legacy : null, shadowed: null };
  return { file: current, shadowed: existsSync(legacy) ? legacy : null };
}

export function shadowWarning(docsPath: string, shadowed: string): string {
  const path = relative(projectRoot(docsPath), shadowed).split(sep).join('/');
  return `aviso: también existe ${path}, que no se lee`;
}

export function changeFolders(docsPath: string): string[] {
  const docs = resolve(docsPath);
  return ['changes', 'specs'].map((folder) => join(docs, folder)).filter((folder) => existsSync(folder));
}

export function estimationLogPath(docsPath: string): string {
  const { file } = resolveDocument(docsPath, 'estimation');
  return join(file === null ? resolve(docsPath) : dirname(file), 'estimation-log.md');
}
