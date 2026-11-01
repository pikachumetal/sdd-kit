const CITATIONS: [kind: string, pattern: RegExp][] = [
  ['spec', /(?<![\w.-])specs?(?![\w-])|§\s*\d/iu],
  ['task', /\b(?:task|tarea)\s*#?\d+\b|\b(?:feature|patch)\s*#?\d{2,}\b/iu],
  ['constitution', /\bconstituci[oó]n\b|\bconstitution\b|\bArt\.\s*[IVXLC]+\b|\bart[ií]culo\s+[IVXLC]+\b/iu],
  ['requisito', /\brequisitos?\b|\brequirements?\b|\bREQ-\d+/iu],
  ['capabilities/', /capabilities\//iu],
];

export function citedKinds(comment: string): string[] {
  return CITATIONS.filter(([, pattern]) => pattern.test(comment)).map(([kind]) => kind);
}
