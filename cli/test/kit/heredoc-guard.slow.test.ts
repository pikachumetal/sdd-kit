import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { kitRoot, run } from './process.ts';

const hook = join(kitRoot, '.claude', 'hooks', 'heredoc-guard.mjs');
const runHook = (input: string) => run(process.execPath, [hook], { input });
const withCommand = (command: string) => JSON.stringify({ tool_name: 'Bash', tool_input: { command } });

describe('heredoc-guard.mjs', () => {
  it('deniega un heredoc hacia x.mjs y nombra Write', () => {
    const result = runHook(withCommand("cat > x.mjs <<'EOF'\nconst a = 1;\nEOF"));
    const { hookSpecificOutput } = JSON.parse(result.output);
    expect(hookSpecificOutput.hookEventName).toBe('PreToolUse');
    expect(hookSpecificOutput.permissionDecision).toBe('deny');
    expect(hookSpecificOutput.permissionDecisionReason).toBe(
      'Este Bash escribe x.mjs con un heredoc: en Git Bash pierde barras invertidas y rompe escapes. Escríbelo con la herramienta Write (para un cambio, Edit).',
    );
  });

  it.each([
    ['un mensaje de commit', withCommand("git commit -F - <<'EOF'\ndocs: algo\nEOF")],
    ['un Markdown', withCommand("cat > notas.md <<'EOF'\na\nEOF")],
    ['una entrada ilegible', 'no es json'],
    ['una entrada sin comando', '{}'],
  ])('deja pasar %s, sin salida y con 0', (_name, input) => {
    expect(runHook(input)).toEqual({ output: '', code: 0 });
  });
});

describe('.claude/settings.json', () => {
  it('registra el hook como PreToolUse de Bash, con node', () => {
    const { PreToolUse } = JSON.parse(readFileSync(join(kitRoot, '.claude', 'settings.json'), 'utf8')).hooks;
    const entry = PreToolUse.find((candidate: { matcher: string }) => candidate.matcher === 'Bash');
    expect(entry.hooks[0].command).toMatch(/^node\s.*heredoc-guard\.mjs/);
  });
});
