// Borrador de anotación de una copia del kit contra su original (feature 0312, a partir del de la 0302).
// node annotate.mjs <original> <kit> <out> <tarea>
// Las líneas del original cuyas palabras sobreviven seguidas quedan como texto de la fuente; lo demás pasa a bloques del kit.
// Frente al borrador de la 0302: el contenido de un bloque conserva los saltos de línea y la sangría del kit, y un bloque
// cuyo tramo del original acaba en una línea en blanco acaba en ella, sin `fin`.
import { readFileSync, writeFileSync } from 'node:fs';

const [originalPath, kitPath, outPath, task] = process.argv.slice(2);
const lf = (text) => text.replace(/\r\n/g, '\n');

function splitFront(text) {
  const lines = lf(text).split('\n');
  if (lines.at(-1) === '') lines.pop();
  if (lines[0] !== '---') return { front: [], body: lines };
  const close = lines.indexOf('---', 1);
  return { front: lines.slice(0, close + 1), body: lines.slice(close + 1) };
}

function kitTokens(body) {
  const text = body.join('\n');
  const tokens = [];
  const re = /(\s*)(\S+)/g;
  for (let m = re.exec(text); m; m = re.exec(text)) tokens.push({ pre: m[1], word: m[2] });
  return tokens;
}

function lcsMatch(ow, kw) {
  const table = Array.from({ length: ow.length + 1 }, () => new Uint32Array(kw.length + 1));
  for (let i = ow.length - 1; i >= 0; i--)
    for (let j = kw.length - 1; j >= 0; j--)
      table[i][j] = ow[i].word === kw[j].word ? table[i + 1][j + 1] + 1 : Math.max(table[i + 1][j], table[i][j + 1]);
  const match = new Array(ow.length).fill(-1);
  for (let i = 0, j = 0; i < ow.length && j < kw.length; ) {
    if (ow[i].word === kw[j].word && table[i][j] === table[i + 1][j + 1] + 1) match[i++] = j++;
    else if (table[i + 1][j] >= table[i][j + 1]) i++;
    else j++;
  }
  return match;
}

// El contenido de kit[from, to) con sus separadores; la sangría de la primera palabra se conserva si abre línea.
function kitText(kw, from, to) {
  if (from >= to) return '';
  const first = kw[from].pre.includes('\n') ? kw[from].pre.slice(kw[from].pre.lastIndexOf('\n') + 1) : '';
  return first + kw[from].word + kw.slice(from + 1, to).map((t) => t.pre + t.word).join('');
}

const o = splitFront(readFileSync(originalPath, 'utf8'));
const k = splitFront(readFileSync(kitPath, 'utf8'));
const ow = [];
o.body.forEach((line, index) => line.split(/\s+/).filter(Boolean).forEach((word) => ow.push({ word, line: index })));
const kw = kitTokens(k.body);
const match = lcsMatch(ow, kw);
const wordsByLine = o.body.map(() => []);
ow.forEach((w, index) => wordsByLine[w.line].push(index));
const intact = o.body.map((_, line) => {
  const ws = wordsByLine[line];
  return ws.every((w, n) => match[w] >= 0 && (n === 0 || match[w] === match[ws[n - 1]] + 1));
});

const out = [...k.front];
let kCursor = 0;
let region = [];

// Como kit:copies: lo quitado son las palabras del tramo que no vuelven, en orden, en el contenido del sitio.
function removedCite(kEnd) {
  const removed = region.flatMap((line) => wordsByLine[line].map((w) => ow[w].word));
  const content = kw.slice(kCursor, kEnd).map((t) => t.word);
  const keptAt = new Set(lcsMatch(removed.map((word) => ({ word })), content.map((word) => ({ word }))).flatMap((j, i) => (j >= 0 ? [i] : [])));
  const pieces = [];
  removed.forEach((word, i) => {
    if (keptAt.has(i)) return;
    if (i === 0 || keptAt.has(i - 1) || pieces.length === 0) pieces.push([]);
    pieces.at(-1).push(word);
  });
  const shorten = (piece) => (piece.length > 6 ? [...piece.slice(0, 3), '…', ...piece.slice(-3)] : piece).join(' ').replace(/ … /g, '…');
  return pieces.map((piece) => shorten(piece).replace(/[«»]|-->/g, '…')).join('…');
}

const opensParagraph = (pre) => /\n[ \t]*\n/.test(pre);

// kit:copies cierra un bloque en la primera línea en blanco fuera de una valla, aunque lleve fin:
// un contenido de varios párrafos va en un bloque por párrafo, y la marca con la cita, en el primero.
function paragraphsOf(content) {
  const paragraphs = [[]];
  let fence = null;
  for (const line of content.split('\n')) {
    const opener = line.match(/^\s*(`{3,}|~{3,})/)?.[1];
    if (opener && (!fence || opener.startsWith(fence))) fence = fence ? null : opener;
    if (!fence && !opener && line.trim() === '') paragraphs.at(-1).length && paragraphs.push([]);
    else paragraphs.at(-1).push(line);
  }
  return paragraphs.filter((p) => p.length).map((p) => p.join('\n'));
}

// Dentro de un recuadro una línea en blanco no cierra un bloque: lo cierra fin, y la línea en blanco sigue siendo texto.
function inFence() {
  let fence = null;
  // Un párrafo de un bloque entra en out como una sola cadena con sus saltos de línea.
  for (const line of out.join('\n').split('\n')) {
    const opener = line.startsWith('<!-- kit:') ? null : line.match(/^ {0,3}(`{3,}|~{3,})/)?.[1];
    if (opener && (!fence || opener.startsWith(fence))) fence = fence ? null : opener;
  }
  return fence !== null;
}

function pushBlocks(mark, content, closing, kitBlank = false) {
  paragraphsOf(content).forEach((paragraph, index) => out.push(...(index ? ['', `<!-- kit: ${task} -->`] : [mark]), paragraph));
  const fenced = inFence() && closing[0] === '';
  out.push(...(!fenced ? closing : kitBlank ? [...closing, '<!-- kit: fin -->'] : ['<!-- kit: fin -->', ...closing]));
}

// Un añadido sin tramo del original: va al final del párrafo anterior si el kit lo pega a él,
// o en su propio párrafo, que acaba en la línea en blanco que el kit pone detrás.
function insert(kEnd) {
  const content = kitText(kw, kCursor, kEnd);
  const blanks = [];
  if (!opensParagraph(kw[kCursor].pre) && !(kCursor === 0 && k.body[0] === '')) while (out.at(-1) === '') blanks.push(out.pop());
  // Una línea en blanco que el original no tiene va tras una marca: la que cierra un bloque no es texto.
  else if (out.length > k.front.length && out.at(-1) !== '') out.push(`<!-- kit: ${task} -->`, '');
  const blankBehind = blanks.length > 0 || kEnd === kw.length || opensParagraph(kw[kEnd].pre);
  pushBlocks(`<!-- kit: ${task} -->`, content, blankBehind ? (blanks.length ? blanks : ['']) : ['<!-- kit: fin -->'], blanks.length === 0);
  kCursor = kEnd;
}

function flush(kEnd) {
  if (region.length === 0 && kEnd > kCursor) return insert(kEnd);
  const content = kitText(kw, kCursor, kEnd);
  // El kit une su contenido al párrafo anterior: la línea en blanco del original que los separaba sale (unir párrafos pasa).
  if (content && kCursor > 0 && !opensParagraph(kw[kCursor].pre)) while (out.at(-1) === '') out.pop();
  const cite = removedCite(kEnd);
  const blankAfter = region.length > 0 && o.body[region.at(-1)] === '';
  const kitBlankAfter = kEnd < kw.length && opensParagraph(kw[kEnd].pre);
  const close = blankAfter || kitBlankAfter ? [''] : ['<!-- kit: fin -->'];
  // Lo quitado entre dos líneas en blanco deja una sola, y lo quitado al final no deja ninguna.
  if (cite && !content && kEnd === kw.length) while (out.at(-1) === '') out.pop();
  if (cite && !content) out.push(`<!-- kit: ${task} · quita: «${cite}» -->`, ...(blankAfter && out.at(-1) !== '' && kEnd < kw.length ? [''] : []));
  else if (cite) pushBlocks(`<!-- kit: ${task} · sustituye: «${cite}» -->`, content, close, !blankAfter);
  else if (content) pushBlocks(`<!-- kit: ${task} -->`, content, close, !blankAfter);
  else if (blankAfter) out.push('');
  region = [];
  kCursor = kEnd;
}

o.body.forEach((line, index) => {
  if (line === '' && region.length === 0) return void (out.length > k.front.length || k.body[0] === '' ? out.push('') : null);
  if (!intact[index] || line === '') return void region.push(index);
  const ws = wordsByLine[index];
  const kStart = ws.length ? match[ws[0]] : kCursor;
  if (region.length || kStart > kCursor) flush(kStart);
  out.push(line);
  if (ws.length) kCursor = match[ws.at(-1)] + 1;
});
flush(kw.length);
writeFileSync(outPath, `${out.join('\n')}\n`);
console.log(`${out.filter((line) => line.startsWith('<!-- kit:') && !line.includes('kit: fin')).length} bloques`);
