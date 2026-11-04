// Una regla absoluta con su excepción pegada en la misma frase.
import type { Problem } from '../copies/annotated.ts';
import { elementsOf, withoutCode, type Element, type SkillLine } from './kit-text.ts';
import { splitSentences } from './sentences.ts';

const ABSOLUTE = /\b(only|never|always|must|every)\b/i;
const EXCEPTION = /\b(except|unless|instead of)\b/i;

export interface LocatedSentence {
  file: string;
  line: number;
  text: string;
}

function sentencesOfElement(element: Element): LocatedSentence[] {
  const starts: number[] = [];
  let text = '';
  for (const part of element.parts) {
    starts.push(text.length);
    text += `${withoutCode(part.text)} `;
  }
  const lineAt = (offset: number): number => element.parts[starts.findLastIndex((start) => start <= offset)].line;
  return splitSentences(text).map((sentence) => {
    const offset = sentence.start + (sentence.text.length - sentence.text.trimStart().length);
    return { file: element.file, line: lineAt(offset), text: sentence.text.trim() };
  });
}

export function sentencesOf(lines: SkillLine[]): LocatedSentence[] {
  return elementsOf(lines.filter((line) => line.kit)).flatMap(sentencesOfElement);
}

export function exceptionProblems(lines: SkillLine[]): Problem[] {
  return sentencesOf(lines).flatMap((sentence) => {
    const absolute = ABSOLUTE.exec(sentence.text)?.[1];
    const exception = EXCEPTION.exec(sentence.text)?.[1];
    if (!absolute || !exception) return [];
    const message = `absoluta con excepción en la misma frase («${absolute.toLowerCase()}» … «${exception.toLowerCase()}»): sustituye la regla por una que ya diga su caso`;
    return [{ file: sentence.file, line: sentence.line, message }];
  });
}
