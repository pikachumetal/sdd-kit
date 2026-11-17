# Constitución — Horizon Notes

## Artículo 1 — Idioma

Documentación y comentarios en castellano. Identificadores de código en inglés.

## Artículo 2 — Commits

`tipo: descripción breve`, en minúscula, sin cuerpo salvo que el cambio lo requiera.

## Artículo 3 — Testing

Toda función de parseo o filtrado lleva un test junto a ella en `tests/`.

## Artículo 4 — Convenciones de `.docs/sdd/`

Las tasks no triviales tienen carpeta en `.docs/sdd/specs/`. Las capacidades viven en
`.docs/sdd/capabilities/`.

## Artículo 5 — Calidad de código

Funciones pequeñas, sin dependencias nuevas si una función de pocas líneas resuelve lo mismo.
