import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { buildInto, listSources } from '../../../build/dist.ts';
import { cleanGitEnv, kitRoot, run } from './process.ts';
import { tempDirs, writeTree } from './temp-tree.ts';

const tempDir = tempDirs();

function git(cwd: string, args: string[]): void {
  const result = run('git', ['-C', cwd, '-c', 'user.name=test', '-c', 'user.email=test@example.com', ...args]);
  if (result.code !== 0) throw new Error(`git ${args.join(' ')}: ${result.output}`);
}

function toyRepo(): string {
  const root = tempDir('dist-repo-');
  git(root, ['init', '-q', '-b', 'main']);
  writeTree(root, { '.gitignore': 'node_modules/\n', 'skills/a/SKILL.md': '# a\n', 'tests/t.md': '# t\n' });
  git(root, ['add', '-A']);
  git(root, ['commit', '-q', '-m', 'base']);
  writeTree(root, { 'skills/a/new.md': '# nuevo\n', 'skills/a/node_modules/x.js': 'x\n' });
  return root;
}

describe('build de dist/ con git', () => {
  it('takes only tracked or addable files of the whitelist', async () => {
    expect(await listSources(toyRepo())).toEqual(['skills/a/SKILL.md', 'skills/a/new.md']);
  });

  it('leaves dist untouched when the build fails', async () => {
    const root = toyRepo();
    writeTree(root, { 'skills/a/SKILL.md': 'x <!-- kit: a -->\n', 'dist/skills/a/SKILL.md': 'previo\n' });
    await expect(buildInto(root, join(root, 'dist'))).rejects.toThrow('skills/a/SKILL.md:1: marca mal puesta');
    expect(readFileSync(join(root, 'dist/skills/a/SKILL.md'), 'utf8')).toBe('previo\n');
  });

  it('runs the session-start hook from dist', () => {
    const project = tempDir('dist-project-');
    writeTree(project, { '.docs/sdd/sdd-kit.json': '{"version":"2.0.0"}\n' });
    const env = { ...cleanGitEnv, CLAUDE_PROJECT_DIR: project };
    const hook = run(process.execPath, [join(kitRoot, 'dist', 'cli', 'bin', 'sdd.js'), 'hook', 'session-start'], {
      env,
      input: '{"session_id":"dist-slow-test"}',
    });
    expect(hook.code).toBe(0);
    const output = JSON.parse(hook.output);
    expect(output.hookSpecificOutput.additionalContext).toContain('name: using-sdd');
    expect(output.systemMessage).toContain('trae migraciones hasta la');
  });
});
