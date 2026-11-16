import { readFileSync } from 'node:fs';
const text = readFileSync(process.argv[2], 'utf8').replace(/\r\n/g, '\n');
const lines = text.split('\n');
let current = '(frontmatter/top)';
const sizes = new Map();
const order = [];
for (const line of lines) {
  const heading = line.match(/^(#{2,3}) (.*)/);
  if (heading) { current = heading[1] + ' ' + heading[2].slice(0, 70); order.push(current); }
  else if (/^\d+\. \*\*/.test(line)) { current = '   step ' + line.slice(0, 60); order.push(current); }
  sizes.set(current, (sizes.get(current) ?? 0) + line.length + 1);
}
for (const k of [...new Set(['(frontmatter/top)', ...order])]) console.log(String(sizes.get(k) ?? 0).padStart(6), k);
console.log('total', text.length);
const cites = text.match(/\(`tests\/[^)]*\)|\(task \d+[^)]*\)|\(feature \d+[^)]*\)|\(patch \d+[^)]*\)/g) ?? [];
console.log('citas de evidencia entre paréntesis:', cites.length, 'chars:', cites.join('').length);
