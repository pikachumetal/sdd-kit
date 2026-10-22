import { describe, it, expect } from 'vitest';
import { mergeGitignore } from '../../src/init/gitignore.ts';

const INIT_LINES = '.playwright-mcp/\n.superpowers/\n.docs/sdd/sdd-kit.local.json\n.temp/\n';

describe('mergeGitignore', () => {
  it('creates the file when missing', () => {
    expect(mergeGitignore(null, [])).toBe(INIT_LINES);
  });

  it('does not duplicate trimmed lines', () => {
    expect(mergeGitignore('node_modules/\n  .superpowers/  \n', ['.auth/'])).toBe(
      'node_modules/\n  .superpowers/  \n.playwright-mcp/\n.docs/sdd/sdd-kit.local.json\n.temp/\n.auth/\n',
    );
  });

  it('keeps CRLF', () => {
    expect(mergeGitignore('node_modules/\r\n.superpowers/\r\n', [])).toBe(
      'node_modules/\r\n.superpowers/\r\n.playwright-mcp/\r\n.docs/sdd/sdd-kit.local.json\r\n.temp/\r\n',
    );
  });

  it('gitignore without trailing newline', () => {
    expect(mergeGitignore('node_modules/', [])).toBe(`node_modules/\n${INIT_LINES}`);
  });

  it('treats .superpowers without slash as different', () => {
    expect(mergeGitignore('.superpowers\n', [])).toBe(`.superpowers\n${INIT_LINES}`);
  });

  it('returns the same text when nothing is missing', () => {
    expect(mergeGitignore(INIT_LINES, [])).toBe(INIT_LINES);
  });
});
