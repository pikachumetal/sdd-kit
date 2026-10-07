#!/usr/bin/env node
import { nodeVersionProblem } from './node-version.js';

const problem = nodeVersionProblem(process.versions.node);
if (problem) {
  process.stderr.write(`${problem}\n`);
  process.exit(2);
}

const { run } = await import('../src/main.ts');
const { processIo } = await import('../src/cli/io.ts');
process.exitCode = await run(process.argv.slice(2), processIo());
