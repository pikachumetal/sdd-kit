// Arranca Claude Code con las skills del working tree y el plugin publicado deshabilitado.
// Sin esto, el .claude/settings.json del repo activa sdd-kit@sdd-kit y las skills salen de la caché.
// Los argumentos extra pasan tal cual: node start-kit-session.mjs --model sonnet
// Para reanudar una sesión, el script con los mismos argumentos más --resume o --continue
// (node start-kit-session.mjs --model sonnet --continue): un `claude --resume` suelto la reanuda sin las skills ni los agentes de la rama.
// Las variables van solo al proceso de claude: la terminal que lo lanza no se queda con ellas.
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runInherited } from './cli/src/tasks/command.ts';

const root = dirname(fileURLToPath(import.meta.url));
// SDD_KIT_SESSION_ROOT le dice al hook SessionStart del repo que la sesión salió de aquí.
process.env.SDD_KIT_SESSION_ROOT = root;
// CLAUDE_CODE_TMPDIR lleva el scratchpad y las salidas en segundo plano a .temp/, que muere con el worktree;
// Claude Code no lo borra nunca y en los settings del proyecto se ignora. Si ya viene fijada, manda la de fuera.
if (!process.env.CLAUDE_CODE_TMPDIR) process.env.CLAUDE_CODE_TMPDIR = join(root, '.temp');
// Ctrl+C es de la TUI: si este proceso muriera con él, la terminal volvería al prompt con claude aún vivo.
process.on('SIGINT', () => {});

const settings = '{"enabledPlugins":{"sdd-kit@sdd-kit":false}}';
process.exitCode = await runInherited(['claude', '--settings', settings, '--plugin-dir', root, ...process.argv.slice(2)], process.cwd());
