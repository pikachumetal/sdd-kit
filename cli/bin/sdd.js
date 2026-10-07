#!/usr/bin/env node
import { fileURLToPath } from 'node:url';
import { runSessionStart } from './session-start.js';
import { nodeVersionProblem } from './node-version.js';

const args = process.argv.slice(2);
const problem = nodeVersionProblem(process.versions.node);

if (args[0] === 'hook' && args[1] === 'session-start') {
  process.exitCode = runSessionStart(fileURLToPath(new URL('../..', import.meta.url)));
} else if (problem) {
  process.stderr.write(`${problem}\n`);
  process.exitCode = 2;
} else {
  const { run } = await import('../src/main.ts');
  const { processIo } = await import('../src/cli/io.ts');
  process.exitCode = await run(args, processIo());
}
