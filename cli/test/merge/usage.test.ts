import { describe, it, expect, vi } from 'vitest';

const { mergeBranch } = vi.hoisted(() => ({ mergeBranch: vi.fn() }));
vi.mock('../../src/merge/run.ts', () => ({ mergeBranch }));

const { run } = await import('../../src/main.ts');
const { memoryIo } = await import('../../src/cli/io.ts');

describe('sdd merge without arguments', () => {
  it('prints the usage and exits 2 without merging', async () => {
    const io = memoryIo();
    expect(await run(['merge'], io)).toBe(2);
    expect(io.stderr.join('\n')).toContain('uso: sdd merge [--project-root <valor>]');
    expect(mergeBranch).not.toHaveBeenCalled();
  });
});
