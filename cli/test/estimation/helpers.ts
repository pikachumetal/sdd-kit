import { afterAll } from 'vitest';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateEstimationLog } from '../../src/estimation/log.ts';

const temporaryRoots: string[] = [];

afterAll(() => {
  temporaryRoots.splice(0).forEach((root) => rmSync(root, { recursive: true, force: true }));
});

export const fixtures = fileURLToPath(new URL('../fixtures/estimation-log/', import.meta.url));
export const repoRoot = fileURLToPath(new URL('../../../', import.meta.url));

export interface Build {
  text: string;
  warnings: string[];
}

export function build(root: string): Build {
  const warnings: string[] = [];
  const { text } = generateEstimationLog(root, (message) => warnings.push(message));
  return { text, warnings };
}

export function buildFixture(name: string): Build {
  return build(fixtures + name);
}

export function row(text: string, folder: string): string | undefined {
  return text.split('\n').find((line) => line.includes(`| ${folder} |`));
}

export function project(files: Record<string, string>): string {
  const root = mkdtempSync(join(tmpdir(), 'sdd-estimation-'));
  temporaryRoots.push(root);
  for (const [relative, content] of Object.entries(files)) {
    const target = join(root, '.docs/sdd', relative);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, content, 'utf8');
  }
  return root;
}

export interface Time {
  type: string;
  est: string;
  real: string;
  cost?: string;
  session?: string;
}

export function walkthrough(time: Time): string {
  const cost = time.cost ? `\n- Coste de sujetos: ${time.cost}` : '';
  const session = time.session ? `\n- Coste de la sesión: ${time.session}` : '';
  return `## 2. Tiempo: estimado vs real\n\n- Tipo: ${time.type}\n- Estimación de implementación (del plan): ${time.est}\n- Esfuerzo real: ${time.real}${cost}${session}\n`;
}
