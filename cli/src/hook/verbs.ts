import { fileURLToPath } from 'node:url';
import { runSessionStart } from '../../bin/session-start.js';
import type { Verb } from '../cli/verbs.ts';

const pluginRoot = fileURLToPath(new URL('../../..', import.meta.url));

export const hookSessionStartVerb: Verb = {
  noun: 'hook',
  verb: 'session-start',
  summary: 'Escribe el contexto de arranque de sesión del kit',
  options: {},
  async run() {
    return runSessionStart(pluginRoot);
  },
};
