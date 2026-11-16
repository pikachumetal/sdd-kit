import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { requiredRootOption, text, UsageError } from '../cli/args.ts';
import { localDay } from '../cli/dates.ts';
import type { Verb } from '../cli/verbs.ts';
import { installProjectHook } from '../init/project-hook.ts';
import { runUpgrade } from './run.ts';

const migrationsDir = fileURLToPath(new URL('../../../skills/sdd-upgrade/references/migrations', import.meta.url));
const VERSION = /^\d+\.\d+\.\d+$/;

function markOption(mark: string | null): string | null {
  if (mark !== null && !VERSION.test(mark)) throw new UsageError(`--mark debe ser una versión X.Y.Z: «${mark}»`);
  return mark;
}

export const upgradeVerb: Verb = {
  noun: 'upgrade',
  summary: 'Lista las migraciones pendientes del proyecto en orden SemVer, escribe su marcador (--mark) o instala el hook del proyecto (--project-hook)',
  options: {
    root: { type: 'string' },
    'project-root': { type: 'string' },
    mark: { type: 'string' },
    'project-hook': { type: 'boolean' },
  },
  async run(args, io) {
    const root = requiredRootOption(args, 'root');
    if (!fs.existsSync(root)) throw new UsageError(`no existe la raíz: «${root}»`);
    const mark = markOption(text(args, 'mark'));
    if (args.values['project-hook'] === true) {
      if (mark !== null) throw new UsageError('--project-hook y --mark no van juntas');
      installProjectHook(root).forEach((line) => io.out(line));
      return 0;
    }
    return runUpgrade({ root, migrationsDir, today: localDay(new Date()), mark }, io);
  },
};
