export const INIT_IGNORES = ['.playwright-mcp/', '.superpowers/', '.docs/sdd/sdd-kit.local.json'];

export function mergeGitignore(current: string | null, extra: string[]): string {
  const text = current ?? '';
  const eol = text.includes('\r\n') ? '\r\n' : '\n';
  const present = new Set(text.split(/\r?\n/).map((line) => line.trim()));
  const missing = [...new Set([...INIT_IGNORES, ...extra])].filter((line) => !present.has(line));
  if (missing.length === 0) return text;
  const base = text === '' || text.endsWith('\n') ? text : `${text}${eol}`;
  return `${base}${missing.map((line) => `${line}${eol}`).join('')}`;
}
