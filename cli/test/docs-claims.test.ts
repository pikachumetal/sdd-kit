import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { VERBS } from '../src/cli/verbs.ts';

const repoRoot = fileURLToPath(new URL('../../', import.meta.url));
const scannedRoots = ['skills', '.docs/sdd/capabilities'];
const kitScripts = [
  'Build-EstimationLog',
  'CapabilitySections',
  'Get-CapabilityIndex',
  'Get-NextSddId',
  'Invoke-SddMerge',
  'Measure-SessionTokens',
  'Merge-CapabilityDelta',
  'SddLock',
  'Test-Capabilities',
  'Test-Roadmap',
  'TranscriptPaths',
  'Watch-SubagentSilence',
];
const forbidden: RegExp[] = [
  new RegExp(`(?<!tools/sdd/)\\b(?:${kitScripts.join('|')})\\.ps1\\b`),
  /hooks\/session-start/,
  /(?<!tests\/[\w-]*)\b(?:task-start|task-done|task-brief|review-package|sdd-workspace)\b/,
  /\bcygpath\b/,
  /\bPLAN_FILE\b/,
];

function markdownFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return markdownFiles(path);
    return name.endsWith('.md') ? [path] : [];
  });
}

const files = scannedRoots.flatMap((root) => markdownFiles(join(repoRoot, root)));

interface Claim {
  where: string;
  tokens: string[];
}

function claimsIn(path: string): Claim[] {
  const claims: Claim[] = [];
  readFileSync(path, 'utf8').split(/\r?\n/).forEach((line, index) => {
    for (const match of line.matchAll(/\bsdd(?:\.js"?)?\s+([^`\n]+)/g)) {
      const tokens = match[1].trim().split(/\s+/);
      if (!/^[a-z][a-z-]*$/.test(tokens[0])) continue;
      claims.push({ where: `${relative(repoRoot, path)}:${index + 1}`, tokens });
    }
  });
  return claims;
}

function findVerb(tokens: string[]) {
  return VERBS.find((verb) => verb.noun === tokens[0] && (verb.verb === undefined || verb.verb === tokens[1]));
}

function knownNoun(noun: string): boolean {
  return VERBS.some((verb) => verb.noun === noun);
}

describe('skills and capabilities name only existing verbs', () => {
  const claims = files.flatMap(claimsIn).filter((claim) => knownNoun(claim.tokens[0]));

  it('finds at least one claim per data verb', () => {
    const named = new Set(claims.map((claim) => claim.tokens.slice(0, 2).join(' ')));
    for (const expected of ['capability index', 'capability check', 'capability merge', 'roadmap check', 'id next']) {
      expect(named.has(expected), expected).toBe(true);
    }
  });

  it.each(claims.map((claim) => [claim.where, claim] as const))(
    'verb and options exist at %s',
    (_where, claim) => {
      const verb = findVerb(claim.tokens);
      expect(verb, claim.tokens.join(' ')).toBeDefined();
      const options = claim.tokens.filter((token) => /^--[a-z][a-z-]*$/.test(token)).map((token) => token.slice(2));
      for (const option of options) {
        expect(Object.keys(verb!.options), `--${option} en ${claim.tokens.join(' ')}`).toContain(option);
      }
    },
  );
});

describe('skills and capabilities do not name retired scripts', () => {
  it.each(files.map((file) => [relative(repoRoot, file), file] as const))('%s', (_name, file) => {
    const offending = readFileSync(file, 'utf8')
      .split(/\r?\n/)
      .map((line, index) => ({ line, index }))
      .filter(({ line }) => forbidden.some((pattern) => pattern.test(line)))
      .map(({ line, index }) => `${index + 1}: ${line.trim().slice(0, 120)}`);
    expect(offending).toEqual([]);
  });
});
