// La prosa en castellano que queda en una skill: las skills se escriben en inglés.
import type { Problem } from '../copies/annotated.ts';
import type { SkillLine } from './kit-text.ts';

// Palabras gramaticales, y las de los títulos y etiquetas del kit que el inglés no tiene: un título corto no lleva otra señal.
const ES = new Set(
  [
    'que de del la las los el en y o u para por con una uno unos unas se es su sus al lo como más cuando sin antes después cada también hay está',
    'son pero este esta ese esa qué cómo solo ya entre hasta donde sobre tras paso pasos lee leer hace va van sigue siguen si sí toda todos todas',
    'escribe perfil perfiles revisor tarea tareas fila filas rama carpeta fichero ficheros plantilla entonces existe',
  ]
    .join(' ')
    .split(' '),
);
const EN = new Set('the of and to in is it that for on with as be by this are or not an if when each before after what from which its you your does do has have'.split(' '));
const SPANISH_LETTER = /[áéíóúñ¿¡]/i;
const SPANISH_ENDING = /(?:ción|ciones|sión|siones|encia|encias|ancia|ancias|dades|mente|ajes?|ivos?|ivas?|ados|adas|idos|idas)$/;
const TEMPLATES = 'dist/skills/sdd-templates/templates/';
const ABBREVIATE_AFTER = 12;

function prose(text: string): string {
  return text
    .replace(/«[^»]*»/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/\]\([^)]*\)/g, ']')
    .replace(/"[^"]*"/g, ' ');
}

export function isSpanish(text: string): boolean {
  const kept = prose(text);
  const words = kept.toLowerCase().match(/\p{L}+/gu) ?? [];
  const es = words.filter((word) => ES.has(word) || SPANISH_ENDING.test(word)).length;
  const en = words.filter((word) => EN.has(word)).length;
  if (en === 0) return es >= 1 || SPANISH_LETTER.test(kept);
  return es >= 3 && es > 2 * en;
}

function abbreviated(text: string): string {
  const words = text.trim().split(/\s+/);
  return words.length > ABBREVIATE_AFTER ? `${words.slice(0, ABBREVIATE_AFTER).join(' ')}…` : words.join(' ');
}

const isProse = (line: SkillLine): boolean => line.region === 'text' || (line.region === 'front' && line.text.startsWith('description:'));

export function spanishProblems(lines: SkillLine[]): Problem[] {
  return lines
    .filter((line) => !line.included && !line.file.startsWith(TEMPLATES) && isProse(line) && isSpanish(line.text))
    .map((line) => ({ file: line.file, line: line.line, message: `prosa en castellano; las skills van en inglés: «${abbreviated(line.text)}»` }));
}
