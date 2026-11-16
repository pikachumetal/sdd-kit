---
status: accepted
date: 2026-11-09
rutas:
  - includes/**
  - skills/**
  - tests/copies/**
  - tests/own/**
---

# Una copia incluye dentro de un bloque del kit

## Contexto y problema

La feature 0304 creó `includes/` para que una regla que necesitan dos skills se escriba una vez, pero solo en las propias: su decisión 4 dejaba fuera las copias («no toco su gramática»). En la 0311, `kit:own` daba 23 frases repetidas, y 4 de las 15 reglas que había que unir caían también en una copia, en 8 sitios: la frase de idioma en `sdd-debugging`, `sdd-parallel-agents`, `sdd-tdd`, `sdd-verify` y `sdd-worktrees`; las suites antes del gate en `sdd-verify`; la deuda de un rojo de la base en `sdd-worktrees`, y el effort no disponible en `sdd-parallel-agents`. Sin cambiar la gramática, esas reglas no podían tener una sola fuente.

## Opciones consideradas

- Inclusiones también en las copias, dentro de un bloque `add` o `sustituye`.
- Quitar la frase de las copias y dejarla solo en las propias que las invocan: la frase de idioma desaparece de skills que en Native hablan con el usuario desde el hilo, y la 0306 midió que importa en la skill que se sigue (7 de 160 sujetos de control con líneas en inglés). Pedía un A/B por skill.
- Que `kit:own` no cuente lo que entra por una inclusión: la regla quedaría en `includes/` y en cinco copias, seis fuentes con el detector en verde.

## Decisión

Una copia incluye dentro de un bloque del kit: `kit:copies` lee `<!-- kit: incluye <nombre> -->` como una línea más del bloque abierto, que el build expande como en una propia. La inclusión no abre ni cierra bloque. Fuera de un bloque es un rojo de `kit:copies` («una inclusión en una copia va dentro de un bloque del kit»), y dentro de una valla, el mismo aviso que el build. En una copia `pending`, que cuenta entera como texto del kit, vale en cualquier sitio. Es la única opción que deja una fuente por regla sin quitar texto medido.

### Consecuencias

- Sustituye la decisión 4 de la spec de la 0304, que no tenía ADR propia.
- Lo que entra por una inclusión no es texto del kit de ninguna skill, propia o copia, y `kit:own` no lo empareja; escrito a mano en otra skill, sí.
- Una inclusión no ahorra palabras: `word-budget.test.ts` cuenta `dist/`, con la inclusión copiada en cada skill que la usa.

### Confirmación

`cli/test/kit/copies.test.ts` (dentro de `add` y de `sustituye`, antes de `fin`, tras la línea en blanco que cierra el bloque, fuera de bloque y en valla), `cli/test/kit/own.test.ts` y `cli/test/kit/dist.test.ts`; `kit:copies` y `kit:own` corren en el pre-commit y en la CI.
