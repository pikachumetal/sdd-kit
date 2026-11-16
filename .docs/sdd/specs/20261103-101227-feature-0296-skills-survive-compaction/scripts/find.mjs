import { readFileSync } from 'node:fs';
const buf = readFileSync(process.argv[2]);
const needle = Buffer.from(process.argv[3]);
let i = 0, n = 0;
while ((i = buf.indexOf(needle, i)) !== -1 && n < 40) {
  const s = buf.subarray(Math.max(0, i - +process.argv[4]), i + +process.argv[5]).toString('latin1');
  console.log('@' + i + ': ' + s.replace(/[^\x20-\x7e\n]/g, '?'));
  console.log('-----');
  i += needle.length; n++;
}
