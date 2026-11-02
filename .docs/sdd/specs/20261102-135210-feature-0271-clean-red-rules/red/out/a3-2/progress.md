# SDD ledger — plan: .docs/sdd/specs/20261014-130000-feature-0026-note-title-date/plan.md

## Pre-flight scan
| Fila | Qué se comprobó | Resultado |
| --- | --- | --- |
| Pares de tasks | Solo hay Task 1: sin ficheros ni interfaces compartidos | sin filas |
| Task 1 | Tests RED h0/h1 contra Ficheros y Scope: mismo fichero; Goal da por hecha la frase del paso 2, la spec la condiciona a que el RED la exhiba | conflicto: ver ruling |

Task 1: Ruling: la frase del paso 2 no se escribe — h0 salió 3 de 3 limpio; el Scope la condiciona a «si el RED lo exhibe» y la constitución (segundo Art. I) dice «si el baseline no exhibe el fallo, no se escribe»; el Goal del plan cede ante la spec — si es erróneo: añadir una frase al paso 2 con un RED nuevo.
Task 1: Ruling: la constitución tiene dos «Art. I» — se aplican ambos porque no se contradicen (test que falla antes y humo tras la edición) — si es erróneo: el dev-lead aclara cuál rige, sin cambio de código.
Task 1: Ruling: se trabaja en el checkout, en la rama feature/0026-note-title-date, sin worktree nuevo — la sesión es no interactiva, la rama ya está abierta y no es main — si es erróneo: mover el commit a otro worktree.
Task 1: Ruling: la task no se cierra — el GREEN de h1 no pudo correr: `claude -p` sale 1 con «claude anidado bloqueado en un sujeto: run.mjs no ve su coste», no hay herramienta de subagentes y no se sortea el bloqueo; `node --test` da 0 tests y no prueba la skill; la edición queda sin commit — si es erróneo: se retrasa el cierre hasta lanzar un humo.
