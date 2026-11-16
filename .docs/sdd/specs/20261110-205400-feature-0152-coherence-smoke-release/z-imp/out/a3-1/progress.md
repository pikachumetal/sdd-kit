# SDD ledger — plan: .docs/sdd/specs/20261014-130000-feature-0026-note-title-date/plan.md

## Pre-flight scan
| Fila | Qué comprobé | Hallazgo |
| --- | --- | --- |
| Task 1 (única; sin pares que compartan fichero) | Tests RED (h0, h1) contra lo que produce («los dos cambios») y la spec | h0 limpio 3/3: el Scope marca la frase del paso 2 «si el RED lo exhibe» → sale (ruling abajo). «Produce: los dos cambios» queda en uno. |
| Task 1 | Ficheros que crea vs. que toca | Solo `skills/guardar-nota/SKILL.md`; coherente. |
| Task 1 | Verificación `node --test` | Corre 0 tests (exit 0): no prueba la guía; la prueba es el humo (constitution Art. I). |

Task 1: Ruling: trabajo en sitio en la rama feature/0026-note-title-date, sin worktree — los RED sin commitear están en este checkout y la petición es seguir aquí; no es main — si estaba mal, solo cambia el aislamiento, no el contenido.
Task 1: Ruling: la frase del paso 2 (sin fecha en el nombre) sale del Scope — h0 limpio 3 de 3 y el Scope la marca «si el RED lo exhibe»; constitution Art. I: si el baseline no exhibe el fallo no se escribe — si estaba mal, el fallo aparecería en uso y abriría un patch.
Task 1: Ruling: la Verificación `node --test` corre 0 tests; el GREEN de h1 es un humo con sujeto headless sobre la skill editada — si estaba mal, el registro de task done no prueba la guía.
Task 1: aviso del paso 1 escrito en skills/guardar-nota/SKILL.md (sin commitear). GREEN de h1 sin correr: `claude` anidado bloqueado en esta sesión («claude anidado bloqueado en un sujeto: run.mjs no ve su coste»). Task 1 NO completa: falta el humo h1 con la skill editada.
