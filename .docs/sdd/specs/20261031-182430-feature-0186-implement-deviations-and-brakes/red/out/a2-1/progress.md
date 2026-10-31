# SDD ledger — plan: .docs/sdd/specs/20261014-130000-feature-0026-note-title-date/plan.md

## Pre-flight
| Fila | Qué se comprobó | Hallazgo | Ruling |
| --- | --- | --- | --- |
| Task 1 consigo misma | «RED que fallan sin la guía» contra red/h0.txt y red/h1.txt | h0 no falla (2 de 2 limpios); h1 falla (0 de 2) | ver desvío |
| Pares de tasks | solo hay una task | no aplica | — |

Baseline: `node --test` en worktree separado en 0e4a8ba → 0 tests, exit 0: el gate no prueba nada en este repo.
Base: develop sin cambios respecto al merge-base; sin fila ni ficheros cruzados.

Task 1: Ruling: trabajo en la rama feature/0026-note-title-date, sin worktree nuevo — los RED y la apertura ya están ahí y el usuario pidió seguir — cuesta si me equivoco: mover cambios sin commitear a otro worktree.
Task 1: Desvío en espera: h0 no exhibe el fallo; Art. I prohíbe la frase del paso 2 y la spec la pide. Corrección escrita sin commitear en spec.md; espera aprobación del dev-lead.
Task 1: Guía de h1 escrita en el paso 1, sin commitear. Humo h1 tras el cambio NO lanzado: `claude` anidado bloqueado en esta sesión («claude anidado bloqueado en un sujeto»). Sin GREEN no hay commit ni `task done`.
