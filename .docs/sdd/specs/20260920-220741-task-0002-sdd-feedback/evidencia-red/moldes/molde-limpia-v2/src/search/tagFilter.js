/**
 * Extrae las etiquetas de una nota: palabras precedidas de `#` en el cuerpo.
 * @param {string} body - Cuerpo Markdown de la nota.
 * @returns {string[]} Etiquetas encontradas, sin el `#`.
 */
function extractTags(body) {
  const matches = body.match(/#(\w+)/g) || [];
  return matches.map((tag) => tag.slice(1).toLowerCase());
}

/**
 * Filtra una lista de notas por etiqueta. Si no se pasa etiqueta, devuelve
 * todas las notas sin filtrar.
 * @param {{ title: string, body: string }[]} notes
 * @param {string|null} tag
 * @returns {{ title: string, body: string }[]}
 */
function filterByTag(notes, tag) {
  if (!tag) return notes;
  return notes.filter((note) => extractTags(note.body).includes(tag.toLowerCase()));
}

module.exports = { extractTags, filterByTag };
