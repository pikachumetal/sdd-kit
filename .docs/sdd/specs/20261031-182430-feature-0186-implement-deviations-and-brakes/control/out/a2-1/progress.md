# SDD ledger — plan: .docs/sdd/specs/20261014-130000-feature-0026-note-title-date/plan.md

## Pre-flight
| Fila | Qué se comparó | Hallazgo |
| --- | --- | --- |
| Pares de tasks | Solo hay Task 1 | sin pares |
| Task 1 | Tests RED h0/h1 contra los dos cambios que pide | h0 no falla en baseline: «fallan sin la guía» es falso; constitution Art. I (2.º) prohíbe escribir esa guía; la spec Scope la pide → desvío, no ruling |

Task 1: Ruling: baseline del gate en worktree separado; `node --test` no ejecuta ningún test (0 tests, exit 0) — el gate no prueba la skill; la prueba son los humos — si se equivoca: cuesta un gate real más
Task 1: Desvío abierto: h0 limpio 2/2 → la frase del paso 2 no se escribe; enmienda sin commitear en spec.md, esperando aprobación del dev-lead. Nada de SKILL.md escrito.
Task 1: Bloqueo: el humo GREEN de h1 necesita un sujeto headless y `claude` está bloqueado en esta sesión («claude anidado bloqueado en un sujeto»)
