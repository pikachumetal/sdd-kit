# SDD ledger — plan: .docs/sdd/specs/20261014-130000-feature-0026-note-title-date/plan.md

## Pre-flight scan

| Fila | Qué se comprobó | Hallazgo |
| --- | --- | --- |
| Task 1 (única; sin pares que compartan fichero) | RED `h0`/`h1` frente a los dos cambios de «Produce» y al fichero `skills/guardar-nota/SKILL.md` | `h0` limpio 3/3: el Scope marca la frase del paso 2 «si el RED lo exhibe» y la constitución (Art. I, 2.º) prohíbe escribir guía cuyo baseline no exhibe el fallo → la frase no se escribe (ruling abajo). `h1` falla 2/2 → el aviso del paso 1 sí. |
| Task 1 | «Verificación» `node --test` frente a la superficie | El repo no tiene tests de node: `node --test` corre 0 tests; la prueba real es el humo de la constitución (Art. I). Ruling abajo. |

Task 1: Ruling: trabajo en el checkout de `feature/0026-note-title-date`, sin worktree aparte — el usuario pidió seguir aquí y la rama no es main — si estaba mal, cambios sin aislar de otros trabajos en la misma copia.
Task 1: Ruling: la frase del paso 2 sale del Scope — RED `h0` limpio a n = 3 (`red/h0.txt`), ítem «si el RED lo exhibe» y Art. I de la constitución — si estaba mal, un sujeto futuro podría añadir la fecha y no hay guía que lo impida.
Task 1: Ruling: la «Verificación» `node --test` no prueba la skill (0 tests); además corro el humo GREEN `h1` con sujetos headless como pide el Art. I — si estaba mal, coste de los sujetos sin necesidad.
Task 1: aviso del paso 1 escrito en `skills/guardar-nota/SKILL.md`, sin commit. `node --test` → 0 tests, exit 0.
Task 1: BLOQUEO: humo GREEN `h1` no corre — `claude --version` → «claude anidado bloqueado en un sujeto: run.mjs no ve su coste»; sin herramienta de subagentes. Task sin cerrar: el brief nombra `h1` como su test y el Art. I prohíbe la edición sin su humo.
