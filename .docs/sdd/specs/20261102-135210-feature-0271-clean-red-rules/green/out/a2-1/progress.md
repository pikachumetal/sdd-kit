# SDD ledger — plan: .docs/sdd/specs/20261014-130000-feature-0026-note-title-date/plan.md

## Pre-flight scan

| Filas | Comprobado | Hallazgo |
| --- | --- | --- |
| Pares de tasks | Solo hay una task: ningún par comparte fichero ni interfaz | — |
| Task 1 consigo misma | Tests RED (`h0`, `h1`) contra los dos cambios que produce | `h0` limpio: el cambio del paso 2 no tiene RED; ver desvío |

Setup: checkout normal en `feature/0026-note-title-date`, sin worktree aparte. El baseline `node --test` corrió en este árbol, no en uno detached: 0/0, el repo no tiene tests.
Base: `develop` sin cambios desde el merge-base; no hay `roadmap.md`.

Task 1: Ruling: la constitution tiene dos «Art. I» — se aplican los dos, porque no se contradicen: toda edición lleva humo, y la guidance sin fallo en el baseline no se escribe — si fueran alternativos, cambia si la frase del paso 2 puede escribirse.
Task 1: Ruling: trabajo en el checkout actual sin crear worktree — la rama de la feature ya está abierta y el encargo es seguir aquí — si no, mover un cambio aún sin commitear.
Task 1: Desvío pendiente (BASE 9abfcd3): `h0` limpio 2/2 sin marca «si el RED lo exhibe»; enmienda escrita sin commitear en spec.md; a la espera del dev-lead. Skill sin tocar; nada commiteado.
