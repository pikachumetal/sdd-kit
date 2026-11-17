export function parseSlot(text) {
  const match = /^(\d{4}-\d{2}-\d{2}) (\d{2}):(\d{2})-(\d{2}):(\d{2})$/.exec(text);
  if (!match) throw new Error(`Hueco con formato inválido: ${text}`);
  const [, day, h1, m1, h2, m2] = match;
  const start = Number(h1) * 60 + Number(m1);
  const end = Number(h2) * 60 + Number(m2);
  if (end <= start) throw new Error(`El hueco termina antes de empezar: ${text}`);
  return { day, start, end };
}

export function isOverlapping(a, b) {
  return a.day === b.day && a.start < b.end && b.start < a.end;
}
