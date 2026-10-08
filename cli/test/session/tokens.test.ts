import { describe, it, expect, vi, afterEach } from 'vitest';
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { memoryIo } from '../../src/cli/io.ts';
import { run } from '../../src/main.ts';
import { fixtures, folderName, line, measure, newWorktree, opus, sonnet, tempDir } from './helpers.ts';

const bothPrices = { 'claude-sonnet-5': sonnet, 'claude-opus-5-5': opus };
const baseThread = '- Tokens del hilo: 2.605.005 — claude-sonnet-5 2.605.005';
const bothBranchesThread = '- Tokens del hilo: 3.505.005 — claude-sonnet-5 3.505.005';

afterEach(() => vi.unstubAllEnvs());

describe('session tokens con un subagente y precios de los dos modelos', () => {
  it('suma el hilo con el máximo de cada categoría por message.id', async () => {
    const { output } = await measure(newWorktree(['base'], bothPrices));
    expect(line(output, 'Tokens del hilo')).toBe(baseThread);
    expect(output).toMatch(/^\| Hilo \| claude-sonnet-5 \| 5 \| 0 \| 100\.000 \| 2\.500\.000 \| 5\.000 \| 2\.605\.005 \| 0,95 \|$/m);
    expect(output).not.toContain('<synthetic>');
  });

  it('deja los tokens del subagente fuera del hilo y los describe', async () => {
    const { output } = await measure(newWorktree(['base'], bothPrices));
    expect(output).toMatch(/^\| Subagentes \| claude-opus-5-5 \| 10 \| 0 \| 0 \| 500\.000 \| 10\.000 \| 510\.010 \| 0,30 \|$/m);
    expect(line(output, 'Tokens de subagentes')).toBe('- Tokens de subagentes: 510.010 en 1 despacho — Revisión final de rama claude-opus-5-5 510.010 / 12 min');
  });

  it('calcula el coste de la sesión con la tabla de precios', async () => {
    const { output, code } = await measure(newWorktree(['base'], bothPrices));
    expect(line(output, 'Coste de la sesión')).toBe('- Coste de la sesión: 1,25 $ (hilo 0,95 $ + subagentes 0,30 $)');
    expect(code).toBe(0);
  });
});

describe('session tokens sin precio', () => {
  it('dice sin precio si falta la clave pricing', async () => {
    const { output } = await measure(newWorktree(['base'], null));
    expect(line(output, 'Coste de la sesión')).toBe('- Coste de la sesión: sin precio (sin tabla pricing en sdd-kit.json)');
  });

  it('nombra el modelo que falta en la tabla', async () => {
    const { output } = await measure(newWorktree(['base'], { 'claude-sonnet-5': sonnet }));
    expect(line(output, 'Coste de la sesión')).toBe('- Coste de la sesión: sin precio (modelos sin precio: claude-opus-5-5)');
  });

  it('cuenta el fast mode con su propio modelo, que necesita fila', async () => {
    const { output } = await measure(newWorktree(['fast'], { 'claude-sonnet-5': sonnet }));
    expect(line(output, 'Coste de la sesión')).toBe('- Coste de la sesión: sin precio (modelos sin precio: claude-sonnet-5:fast)');
  });
});

describe('session tokens filtro de rama', () => {
  it('con --branch solo cuenta las líneas de esa rama', async () => {
    const { output } = await measure(newWorktree(['base', 'other-branch'], null), ['--branch', 'feature/0068']);
    expect(line(output, 'Tokens del hilo')).toBe(baseThread);
  });

  it('sin --branch cuenta todas las sesiones de la carpeta', async () => {
    const { output } = await measure(newWorktree(['base', 'other-branch'], null));
    expect(line(output, 'Tokens del hilo')).toBe(bothBranchesThread);
  });
});

describe('session tokens sin --projects-root', () => {
  function measureFromHome(configs: Record<string, string>, configDir?: string): Promise<string> {
    const base = tempDir();
    const worktree = join(base, 'wt');
    const userHome = join(base, 'home');
    mkdirSync(worktree, { recursive: true });
    for (const [config, set] of Object.entries(configs)) {
      const folder = join(userHome, config, 'projects', folderName(worktree));
      mkdirSync(folder, { recursive: true });
      cpSync(join(fixtures, set), folder, { recursive: true });
    }
    vi.stubEnv('USERPROFILE', userHome);
    vi.stubEnv('HOME', userHome);
    vi.stubEnv('CLAUDE_CONFIG_DIR', configDir === undefined ? '' : join(userHome, configDir));
    const io = memoryIo();
    return run(['session', 'tokens', '--path', worktree], io).then(() => io.stdout.join('\n'));
  }

  it('junta las sesiones de ~/.claude y ~/.claude-<cuenta>', async () => {
    const output = await measureFromHome({ '.claude': 'base', '.claude-gco': 'other-branch' });
    expect(line(output, 'Tokens del hilo')).toBe(bothBranchesThread);
  });

  it('lee también CLAUDE_CONFIG_DIR aunque no se llame .claude*', async () => {
    const output = await measureFromHome({ '.claude': 'base', 'otra/config': 'other-branch' }, 'otra/config');
    expect(line(output, 'Tokens del hilo')).toBe(bothBranchesThread);
  });

  it('no cuenta dos veces la configuración que CLAUDE_CONFIG_DIR y el home nombran a la vez', async () => {
    const output = await measureFromHome({ '.claude-gco': 'base' }, '.claude-gco/');
    expect(line(output, 'Tokens del hilo')).toBe(baseThread);
  });
});

describe('session tokens no medido', () => {
  it('sin carpeta de transcripts las tres líneas dicen no medido y sale con 0', async () => {
    const worktree = join(tempDir(), 'sin-transcripts');
    const io = memoryIo();
    const code = await run(['session', 'tokens', '--path', worktree, '--projects-root', join(tempDir(), 'vacio')], io);
    const reason = `no medido (sin transcripts de Claude Code para ${worktree})`;
    expect(code).toBe(0);
    expect(io.stdout).toEqual([`- Tokens del hilo: ${reason}`, `- Tokens de subagentes: ${reason}`, `- Coste de la sesión: ${reason}`]);
  });

  it('con carpeta pero sin respuestas de la rama dice no medido con la rama', async () => {
    const { output } = await measure(newWorktree(['base'], null), ['--branch', 'feature/otra']);
    expect(line(output, 'Tokens del hilo')).toBe('- Tokens del hilo: no medido (sin respuestas de feature/otra en los transcripts)');
    expect(line(output, 'Coste de la sesión')).toBe('- Coste de la sesión: no medido (sin respuestas de feature/otra en los transcripts)');
  });
});

describe('session tokens sin subagentes', () => {
  it('dice no aplica y el coste lleva solo el hilo', async () => {
    const worktree = newWorktree([], { 'claude-sonnet-5': sonnet });
    cpSync(join(fixtures, 'base/s1.jsonl'), join(worktree.folder, 's1.jsonl'));
    const { output } = await measure(worktree);
    expect(line(output, 'Tokens de subagentes')).toBe('- Tokens de subagentes: no aplica');
    expect(line(output, 'Coste de la sesión')).toBe('- Coste de la sesión: 0,95 $ (hilo 0,95 $)');
  });
});

describe('session tokens entradas que la spec no nombra', () => {
  it('marca en curso un despacho cuyo último mensaje no es el final', async () => {
    const worktree = newWorktree(['base'], null);
    const agent = join(worktree.folder, 's1/subagents/agent-x1.jsonl');
    const original = '[{"type":"text","text":"..."}],"stop_reason":"end_turn"';
    writeFileSync(agent, readFileSync(agent, 'utf8').replace(original, '[{"type":"tool_use","name":"Bash"}],"stop_reason":null'));
    const { output } = await measure(worktree);
    expect(line(output, 'Tokens de subagentes')).toMatch(/— Revisión final de rama claude-opus-5-5 510\.010 \/ 12 min, en curso$/);
  });

  it('sin meta.json el despacho se nombra por su fichero', async () => {
    const worktree = newWorktree(['base'], null);
    rmSync(join(worktree.folder, 's1/subagents/agent-x1.meta.json'));
    const { output } = await measure(worktree);
    expect(line(output, 'Tokens de subagentes')).toMatch(/— agent-x1 claude-opus-5-5 510\.010 \/ 12 min$/);
  });

  it('una ruta con separador final resuelve la misma carpeta', async () => {
    const worktree = newWorktree(['base'], null);
    const { output } = await measure({ ...worktree, path: `${worktree.path}/` });
    expect(line(output, 'Tokens del hilo')).toBe(baseThread);
  });

  it('resuelve una ruta relativa contra el directorio actual', async () => {
    const worktree = newWorktree(['base'], null);
    vi.spyOn(process, 'cwd').mockReturnValue(join(worktree.path, '..'));
    const { output } = await measure({ ...worktree, path: 'wt' });
    expect(line(output, 'Tokens del hilo')).toBe(baseThread);
    vi.restoreAllMocks();
  });

  it('sin desglose de cache_creation la escritura cuenta como de 5 minutos', async () => {
    const { output } = await measure(newWorktree(['legacy'], null));
    expect(output).toMatch(/^\| Hilo \| claude-sonnet-5 \| 0 \| 1\.000 \| 0 \| 0 \| 0 \| 1\.000 \| sin precio \|$/m);
  });
});

describe('session tokens --json', () => {
  it('emite un objeto con los campos de las tres líneas', async () => {
    const io = memoryIo();
    const worktree = newWorktree(['base'], bothPrices);
    await run(['session', 'tokens', '--path', worktree.path, '--projects-root', worktree.projects, '--json'], io);
    expect(JSON.parse(io.stdout[0])).toEqual({
      thread: { measured: true, tokens: 2605005, models: [{ model: 'claude-sonnet-5', tokens: 2605005 }] },
      subagents: {
        measured: true,
        tokens: 510010,
        dispatches: [{ description: 'Revisión final de rama', model: 'claude-opus-5-5', tokens: 510010, minutes: 12, inProgress: false }],
      },
      cost: { measured: true, usd: expect.closeTo(1.25, 3), threadUsd: expect.closeTo(0.95, 3), subagentsUsd: expect.closeTo(0.3, 3), missingModels: [] },
    });
  });
});

describe('session tokens con ficheros corruptos', () => {
  it('aborta con exit 1 y nombra sdd-kit.json si no es JSON', async () => {
    const worktree = newWorktree(['base'], null);
    mkdirSync(join(worktree.path, '.docs/sdd'), { recursive: true });
    writeFileSync(join(worktree.path, '.docs/sdd/sdd-kit.json'), '{ pricing: ');
    const io = memoryIo();
    const code = await run(['session', 'tokens', '--path', worktree.path, '--projects-root', worktree.projects], io);
    expect(code).toBe(1);
    expect(io.stderr[0]).toContain('sdd-kit.json');
  });

  it('aborta con exit 1 y nombra el .meta.json corrupto', async () => {
    const worktree = newWorktree(['base'], null);
    writeFileSync(join(worktree.folder, 's1/subagents/agent-x1.meta.json'), '{ "descr');
    const io = memoryIo();
    const code = await run(['session', 'tokens', '--path', worktree.path, '--projects-root', worktree.projects], io);
    expect(code).toBe(1);
    expect(io.stderr[0]).toContain('agent-x1.meta.json');
  });

  it('lee pricing y description sin distinguir mayúsculas', async () => {
    const worktree = newWorktree(['base'], null);
    writeFileSync(join(worktree.folder, 's1/subagents/agent-x1.meta.json'), '{"Description":"Otro nombre"}');
    mkdirSync(join(worktree.path, '.docs/sdd'), { recursive: true });
    writeFileSync(join(worktree.path, '.docs/sdd/sdd-kit.json'), JSON.stringify({ Pricing: { UsdPerMillionTokens: bothPrices } }));
    const { output } = await measure(worktree);
    expect(line(output, 'Tokens de subagentes')).toContain('Otro nombre');
    expect(line(output, 'Coste de la sesión')).toContain('1,25 $');
  });
});
