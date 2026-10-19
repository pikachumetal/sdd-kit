import { describe, it, expect, vi } from 'vitest';

vi.mock('../../src/git/git.ts', async (original) => ({
  ...(await original<typeof import('../../src/git/git.ts')>()),
  git: vi.fn(async () => ({ code: 128, stdout: '', stderr: 'fatal: no se pudo leer del remoto' })),
}));

const { publishedBack } = await import('../../src/merge/hotfix.ts');

describe('vuelta del hotfix', () => {
  it('si ls-remote falla, dice que no se pudo consultar la vuelta', async () => {
    const plan = { into: 'main', back: 'develop', tag: null, order: 'x', remote: 'origin' };

    await expect(publishedBack('D:/r', plan)).rejects.toThrow("vuelta: no se pudo consultar 'develop' en 'origin'");
  });
});
