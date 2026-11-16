import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

// El slug de GitHub: minúsculas, sin puntuación (las letras con tilde se quedan), espacios a guiones.
// shortcut: no numera los títulos repetidos (-1, -2) como GitHub; ningún enlace apunta hoy a uno.
function headingSlugs(path: string): string[] {
  const outsideCode = readFileSync(path, 'utf8').replace(/^```[\s\S]*?^```/gm, '');
  return [...outsideCode.matchAll(/^#{1,6} +(.+?) *$/gm)].map((match) =>
    match[1].toLowerCase().replace(/[^\p{L}\p{N} _-]/gu, '').replace(/ /g, '-'),
  );
}

// Un hueco de plantilla (`<carpeta>`) no es una ruta; un destino entre `<…>` sí.
const isPlaceholder = (target: string): boolean => target.includes('<') && !target.startsWith('<');

export function brokenRelativeLinks(text: string, baseDir: string): string[] {
  const outsideCode = text.replace(/^ *```[\s\S]*?^ *```/gm, '').replace(/``[^`\n]*``|`[^`\n]*`/g, '');
  const targets = [...new Set([...outsideCode.matchAll(/\]\(([^)\s]+)\)/g)].map((match) => match[1].replace(/^<(.*)>$/, '$1')))];
  return targets
    .filter((target) => !target.includes(':') && !target.startsWith('#') && !isPlaceholder(target))
    .filter((target) => {
      const [path, anchor] = target.split('#', 2);
      const full = join(baseDir, decodeURIComponent(path));
      if (!existsSync(full)) return true;
      return Boolean(anchor) && !headingSlugs(full).includes(anchor);
    });
}
