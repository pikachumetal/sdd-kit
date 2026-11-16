import { globToRegExp } from './glob.ts';
import { readDecisions } from './document.ts';
import type { Decision } from './document.ts';

const GOVERNING = /^(?:accepted|proposed)$/;

function indexLine({ file, number, title, status }: Decision): string {
  return `- \`${number ?? '----'}\` — ${title ?? '(sin título)'} (${status ?? ''}) · \`.docs/sdd/decisions/${file}\``;
}

function governs(decision: Decision, files: string[]): boolean {
  if (!GOVERNING.test(decision.status ?? '')) return false;
  const patterns = decision.rutas.flatMap((glob) => globToRegExp(glob) ?? []);
  return files.some((file) => patterns.some((pattern) => pattern.test(file)));
}

export function decisionIndex(docsPath: string, files?: string[]): string[] {
  const decisions = readDecisions(docsPath);
  if (files === undefined) return decisions.map(indexLine);
  const normalized = files.map((file) => file.replace(/\\/g, '/'));
  return decisions.filter((decision) => governs(decision, normalized)).map(indexLine);
}
