// La salida que el cierre pega sin cambios en Markdown tiene que pasar el MD013 de los proyectos (patch 0373).
export const WRAP_WIDTH = 120;
const CONTINUATION = '  ';
// Una continuación que empieza por uno de estos se leería como otro elemento de lista o un encabezado.
const MARKDOWN_MARKER = /^(?:[-*+#>]+|\d+[.)])$/;

// Parte por palabras; la sangría deja cada continuación en el mismo elemento de lista. Una palabra más larga que el ancho queda entera.
export function wrapLine(line: string, width = WRAP_WIDTH): string[] {
  if (line.length <= width) return [line];
  const indent = /^ */.exec(line)![0];
  const [first = '', ...words] = line.slice(indent.length).split(/ +/);
  const lines: string[] = [];
  let current = indent + first;
  for (const word of words) {
    if (current.length + 1 + word.length <= width) current = `${current} ${word}`;
    else if (MARKDOWN_MARKER.test(word) && current.lastIndexOf(' ') > indent.length) {
      // Se lleva la palabra anterior a la continuación para que el marcador no la abra.
      const cut = current.lastIndexOf(' ');
      lines.push(current.slice(0, cut));
      current = `${CONTINUATION}${current.slice(cut + 1)} ${word}`;
    } else {
      lines.push(current);
      current = CONTINUATION + word;
    }
  }
  return [...lines, current];
}
