import { UsageError, lockTimeoutOption, requiredOption, text } from '../cli/args.ts';
import type { Verb } from '../cli/verbs.ts';
import { configuredMergeInto } from '../merge/policy.ts';
import { checkRoadmap } from './check.ts';
import { publish, resolveProjectRoot } from './publish.ts';

export const roadmapCheckVerb: Verb = {
  noun: 'roadmap',
  verb: 'check',
  summary: 'Valida que el roadmap tiene la forma de la plantilla',
  options: { path: { type: 'string' }, json: { type: 'boolean' } },
  async run(args, io) {
    const { errors, warnings, lines, code } = checkRoadmap(requiredOption(args, 'path'));
    if (args.values.json) io.json({ valid: errors.length === 0, errors, warnings });
    else lines.forEach((line) => io.out(line));
    return code;
  },
};

export const roadmapPublishVerb: Verb = {
  noun: 'roadmap',
  verb: 'publish',
  summary: 'Publica ficheros de .docs/sdd/ y los documentos de la raíz en la rama de integración, bajo el cerrojo de merge',
  options: { message: { type: 'string' }, into: { type: 'string' }, 'project-root': { type: 'string' }, 'lock-timeout': { type: 'string' } },
  positionals: ['FILES...'],
  async run(args, io) {
    const projectRoot = resolveProjectRoot(text(args, 'project-root') ?? '.');
    const into = text(args, 'into') ?? configuredMergeInto(projectRoot);
    if (into === null) throw new UsageError('falta la rama de integración: pasa --into o define merge.into en .docs/sdd/sdd-kit.json');
    if (args.positionals.length === 0) throw new UsageError('falta al menos un fichero que publicar');
    const message = requiredOption(args, 'message');
    await publish({ projectRoot, files: args.positionals, message, into, lockTimeoutMinutes: lockTimeoutOption(args) }, io);
    return 0;
  },
};
