// gh falso de la batería: apunta cada llamada en gh.log y responde con gh.json ({ stdout, stderr, code }).
import { appendFileSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
appendFileSync(join(here, 'gh.log'), `gh ${process.argv.slice(2).join(' ')}\n`);
const { stdout = '', stderr = '', code = 0 } = JSON.parse(readFileSync(join(here, 'gh.json'), 'utf8'));
process.stdout.write(stdout);
process.stderr.write(stderr);
process.exitCode = code;
