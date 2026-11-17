import { readFileSync } from 'node:fs';
const buf = readFileSync(process.argv[2]);
const at = +process.argv[3];
const from = Math.max(0, at - 4_000_000);
const text = buf.subarray(from, at).toString('latin1');
const re = /import\{([^}]*)\}from"(B:\/~BUN\/root\/chunk-[a-z0-9]+\.js)"/g;
let m;
const hits = [];
while ((m = re.exec(text))) {
  if (m[1].split(',').some((s) => s.trim() === 'bc' || s.trim().endsWith(' as bc'))) hits.push(from + m.index + ' ' + m[2]);
}
console.log(hits.slice(-5).join('\n'));
const defs = [];
const reDef = /function bc\(|[,{ ]bc=/g;
while ((m = reDef.exec(text))) defs.push(from + m.index);
console.log('defs', defs.slice(-5));
