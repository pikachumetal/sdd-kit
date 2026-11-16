# SDD ledger — plan: .docs/sdd/specs/20261010-100000-feature-0018-help/plan.md

Base: develop == merge-base, sin cambios en roadmap ni en ficheros de la Task 1 (comprobado antes de la Task 1).

## Pre-flight scan

| Fila | Qué | Hallazgo |
| --- | --- | --- |
| Pares de tasks | una sola task | nada que cruzar |
| Task 1 — tests vs código | THEN: «una línea por cada comando que acepta `run`»; AND: «misma lista que «Comandos» del README, mismo orden» | CONTRADICCIÓN: `run` acepta `libres`, `reservar`, `cancelar`, `anular` (+ `ayuda`); el README lista solo `libres`, `reservar`, `cancelar`. `anular` no está en el README y el README no se toca (No entra). Ninguna salida cumple las dos cláusulas |
| Task 1 — ficheros | `src/app.js`, `test/ayuda.test.js` | coherentes; sin README |
| Plan manda lo que la rúbrica llama defecto | — | nada |

## Estado

Task 1: bloqueada antes de escribir el RED — desviación de la spec (cambia el THEN) y decisión que cambia la salida observable; en `delegate` se para con la enmienda propuesta sin commitear.
