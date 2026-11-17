// Draft annotation of a kit copy against its original (feature 0302, decision 12 smoke).
// node annotate-draft.mjs <original> <kit> <out> <task>
// Original lines whose words all survive, contiguous, stay as source lines; everything else becomes kit blocks.
import { readFileSync, writeFileSync } from 'node:fs';
const [originalPath, kitPath, outPath, task] = process.argv.slice(2);
const strip = (text) => text.replace(/\r\n/g, '\n');
const splitFront = (text) => {
  const lines = strip(text).split('\n');
  if (lines.at(-1) === '') lines.pop();
  if (lines[0] !== '---') return { front: [], body: lines };
  const close = lines.indexOf('---', 1);
  return { front: lines.slice(0, close + 1), body: lines.slice(close + 1) };
};
const o = splitFront(readFileSync(originalPath, 'utf8'));
const k = splitFront(readFileSync(kitPath, 'utf8'));
const ow = [];
o.body.forEach((line, index) => line.split(/\s+/).filter(Boolean).forEach((word) => ow.push({ word, line: index })));
const kw = k.body.join('\n').split(/\s+/).filter(Boolean);
const table = Array.from({ length: ow.length + 1 }, () => new Uint32Array(kw.length + 1));
for (let i = ow.length - 1; i >= 0; i--)
  for (let j = kw.length - 1; j >= 0; j--) table[i][j] = ow[i].word === kw[j] ? table[i + 1][j + 1] + 1 : Math.max(table[i + 1][j], table[i][j + 1]);
const match = new Array(ow.length).fill(-1);
for (let i = 0, j = 0; i < ow.length && j < kw.length; ) {
  if (ow[i].word === kw[j] && table[i][j] === table[i + 1][j + 1] + 1) match[i++] = j++;
  else if (table[i + 1][j] >= table[i][j + 1]) i++;
  else j++;
}
const wordsOf = (line) => ow.map((w, index) => ({ ...w, index })).filter((w) => w.line === line);
const intact = o.body.map((line, index) => {
  const ws = wordsOf(index);
  return ws.every((w, n) => match[w.index] >= 0 && (n === 0 || match[w.index] === match[ws[n - 1].index] + 1));
});
const out = [...k.front];
let kCursor = 0;
let region = [];
const flush = (kEnd) => {
  const content = kw.slice(kCursor, kEnd).join(' ');
  const removedPieces = [];
  let current = [];
  for (const line of region)
    for (const w of wordsOf(line)) {
      if (match[w.index] >= 0 && match[w.index] >= kCursor && match[w.index] < kEnd) {
        if (current.length) removedPieces.push(current.join(' ')), (current = []);
      } else current.push(w.word);
    }
  if (current.length) removedPieces.push(current.join(' '));
  const cite = removedPieces.map((piece) => piece.replace(/[«»]/g, '…')).join('…');
  const blankAfter = region.length > 0 && o.body[region.at(-1)] === '';
  if (cite && !content) out.push(`<!-- kit: ${task} · quita: «${cite}» -->`);
  else if (cite) out.push(`<!-- kit: ${task} · sustituye: «${cite}» -->`, content, '<!-- kit: fin -->');
  else if (content) out.push(`<!-- kit: ${task} -->`, content, '<!-- kit: fin -->');
  if (blankAfter) out.push('');
  region = [];
  kCursor = kEnd;
};
o.body.forEach((line, index) => {
  if (line === '' && region.length === 0) return void out.push('');
  if (!intact[index] || line === '') return void region.push(index);
  const ws = wordsOf(index);
  const kStart = ws.length ? match[ws[0].index] : kCursor;
  if (region.length || kStart > kCursor) flush(kStart);
  out.push(line);
  if (ws.length) kCursor = match[ws.at(-1).index] + 1;
});
flush(kw.length);
writeFileSync(outPath, `${out.join('\n')}\n`);
console.log(`${out.filter((line) => line.startsWith('<!-- kit:') && !line.includes('fin')).length} bloques`);
