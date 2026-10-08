---
status: proposed
date: <AAAA-MM-DD>
rutas:
  - <glob, p. ej. src/db/**>
---

# <Título corto de la decisión>

> ADR del proyecto: el porqué de una decisión, en `.docs/sdd/decisions/NNNN-<slug-en-inglés>.md`, con el número siguiente al mayor de la carpeta. Se ofrece solo si se cumplen las tres a la vez: es difícil de deshacer, sorprende a quien la lea sin contexto y hubo una alternativa real. Es inmutable: una decisión nueva escribe otra ADR y esta solo cambia `status` a `superseded by NNNN`.
>
> Frontmatter: `status` es `proposed`, `accepted`, `rejected`, `deprecated` o `superseded by NNNN`; `date`, la de la última decisión que la formó, en `AAAA-MM-DD`; `rutas`, los globs de los ficheros a los que aplica (`*` dentro de una carpeta, `**` a cualquier profundidad; sin `?`, `{}`, `[]` ni `!`). Lo comprueba `sdd decision check`, y `sdd decision index --files` la encuentra para quien toca esas rutas. Borra los bloques de ayuda (`>`) al redactar.

## Contexto y problema

<qué pasa y por qué hay que decidir, en pocas líneas>

## Opciones consideradas

- <opción>

## Decisión

<lo que se decide y por qué esta opción>

### Consecuencias

- <lo que cambia, lo bueno y lo que cuesta>

### Confirmación

<cómo se comprueba que se cumple: un test, un chequeo de la CLI, la revisión>
