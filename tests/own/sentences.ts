// Dónde acaba una frase: en . ? o ! seguidos de espacio o del final, salvo tras una abreviatura o dentro de una cita «…».
const ABBREVIATIONS = new Set(['e.g.', 'i.e.', 'etc.', 'vs.']);

export interface Sentence {
  start: number;
  text: string;
}

function endsSentence(text: string, index: number, depth: number): boolean {
  if (depth > 0 || !'.?!'.includes(text[index])) return false;
  if (index + 1 < text.length && !/\s/.test(text[index + 1])) return false;
  const word = (text.slice(0, index + 1).split(/\s/).at(-1) ?? '').replace(/^[("'“«[]+/, '').toLowerCase();
  return !ABBREVIATIONS.has(word);
}

export function splitSentences(text: string): Sentence[] {
  const sentences: Sentence[] = [];
  let start = 0;
  let depth = 0;
  for (let index = 0; index < text.length; index++) {
    if (text[index] === '«') depth++;
    if (text[index] === '»') depth = Math.max(0, depth - 1);
    if (!endsSentence(text, index, depth)) continue;
    sentences.push({ start, text: text.slice(start, index + 1) });
    start = index + 1;
  }
  if (text.slice(start).trim() !== '') sentences.push({ start, text: text.slice(start) });
  return sentences.filter((sentence) => sentence.text.trim() !== '');
}
