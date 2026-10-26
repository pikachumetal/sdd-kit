import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { requiredRootOption, text, UsageError } from '../cli/args.ts';
import { localDay } from '../cli/dates.ts';
import type { Verb } from '../cli/verbs.ts';
import { runUpgrade } from './run.ts';

const migrationsDir = fileURLToPath(new URL('../../../skills/sdd-upgrade/references/migrations', import.meta.url));
const VERSION = /^\d+\.\d+\.\d+$/;

function markOption(mark: string | null): string | null {
  if (mark !== null && !VERSION.test(mark)) throw new UsageError(`--mark debe ser una versión X.Y.Z: «${mark}»`);
  return mark;
}

export const upgradeVerb: Verb = {
  noun: 'upgrade',
  summary: 'Lista las migraciones pendientes del proyecto en orden SemVer, o escribe su marcador (--mark)',
  options: {
    root: { type: 'string' },
    'project-root': { type: 'string' },
    mark: { type: 'string' },
  },
  async run(args, io) {
    const root = requiredRootOption(args, 'root', (root) => root);
    if (!fs.existsSync(root)) throw new UsageError(`no existe la raíz: «${root}»`);
    const mark = markOption(text(args, 'mark'));
    return runUpgrade({ root, migrationsDir, today: localDay(new Date()), mark }, io);
  },
};
