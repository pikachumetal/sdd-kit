// Prototype of checks (a) and (c) of the 0300 proposal on an annotated source.
// Usage: node checks.mjs <annotated.md> <original.md>
// (a) every unmarked line (whitespace-normalized) must appear in the original:
//     - "line" mode: the normalized line is a substring of the normalized original;
//     - "block" mode: each unmarked paragraph, normalized, is a substring.
// (c) every «sustituye: S» must exist in the original and not in the output.
import { readFileSync } from 'node:fs';
const [annPath, origPath] = process.argv.slice(2);
const norm = (s) => s.replace(/\s+/g, ' ').trim();
const ann = readFileSync(annPath, 'utf8').replace(/\r\n/g, '\n');
const orig = norm(readFileSync(origPath, 'utf8').replace(/\r\n/g, '\n'));
const MARK = /^<!-- kit: ([^·]*?)(?: · sustituye: «(.*)»)? -->$/;
const lines = ann.split('\n');
// A kit block runs from its mark to the next blank line (paragraph end).
const unmarked = [];
const subs = [];
let inKit = false;
lines.forEach((l, i) => {
  const m = MARK.exec(l.trim());
  if (m) { inKit = true; if (m[2]) subs.push({ line: i + 1, s: m[2] }); return; }
  if (!l.trim()) { inKit = false; return; }
  if (!inKit) unmarked.push({ line: i + 1, text: l });
});
const failA = unmarked.filter((u) => !orig.includes(norm(u.text)));
console.log(`(a) unmarked lines: ${unmarked.length}, not literal in original: ${failA.length}`);
for (const f of failA.slice(0, 8)) console.log(`   L${f.line}: ${f.text.slice(0, 110)}`);
const output = norm(lines.filter((l) => !MARK.test(l.trim())).join('\n'));
for (const { line, s } of subs) {
  const inOrig = orig.includes(norm(s));
  const inOut = output.includes(norm(s));
  console.log(`(c) L${line} «${s.slice(0, 50)}»: in original=${inOrig} in output=${inOut} -> ${inOrig && !inOut ? 'OK' : 'RED'}`);
}
const conflicts = (ann.match(/^<<<<<<< /gm) || []).length;
if (conflicts) console.log(`conflict markers: ${conflicts}`);
