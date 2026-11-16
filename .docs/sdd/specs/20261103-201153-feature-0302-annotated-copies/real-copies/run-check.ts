// node run-check.ts <repo> <draft> <original> <kit> [<fragment key>=<file> …]: checkCopy on a draft and output equality with the kit file.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const [repo, draftPath, originalPath, kitPath, ...fragmentArgs] = process.argv.slice(2);
const { checkCopy, formatProblem, keptShare, outputOf } = await import(pathToFileURL(join(repo, 'tests/copies/annotated.ts')).href);
const fragments = new Map(fragmentArgs.map((arg) => [arg.split('=')[0], readFileSync(arg.split('=')[1], 'utf8')]));
const draft = readFileSync(draftPath, 'utf8');
const original = readFileSync(originalPath, 'utf8');
const problems = checkCopy({ file: 'draft.md', annotated: draft, original, label: 'original', fragments });
for (const problem of problems) console.log(formatProblem(problem));
const norm = (text: string): string => text.replace(/\s+/g, ' ').trim();
const kit = readFileSync(kitPath, 'utf8');
console.log(`rojos: ${problems.length} · salida = kit: ${norm(outputOf(draft)) === norm(kit)} · conserva: ${keptShare(outputOf(draft), original)} %`);
