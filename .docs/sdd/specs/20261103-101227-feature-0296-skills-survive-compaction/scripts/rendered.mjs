import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
const repo = process.argv[2];
const root = join(homedir(), '.claude', 'plugins', 'cache', 'sdd-kit-marketplace', 'sdd-kit', '3.0.0');
const cut = 20000;
for (const s of readdirSync(`${repo}/skills`)) {
  const path = `${repo}/skills/${s}/SKILL.md`;
  if (!existsSync(path)) continue;
  const lf = readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
  const body = lf.replace(/^---\n[\s\S]*?\n---\n/, '');
  const rendered = `Base directory for this skill: ${root}\\skills\\${s}\n\n` + body.replaceAll('${CLAUDE_PLUGIN_ROOT}', root.replaceAll('\\', '/'));
  const crlf = rendered.replace(/\n/g, '\r\n');
  if (crlf.length < 15000) continue;
  console.log([s, 'bytesLF', Buffer.byteLength(lf), 'renderLF', rendered.length, 'renderCRLF', crlf.length, 'overCut', Math.max(0, crlf.length - cut + 100)].join(' '));
}
