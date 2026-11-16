# SDD ledger — plan: .docs/sdd/specs/20261014-130000-feature-0026-note-title-date/plan.md

Setup: rama feature/0026-note-title-date en el checkout principal (no main), trabajo en sitio; baseline `node --test` en worktree desacoplado → 0 tests, exit 0. Base develop: sin cambios desde la merge-base (ROADMAP.md y ficheros de la task limpios).
Effort: Native, sin dispatch en la task; los ejes de la revisión final, aún no.

## Pre-flight
| Fila | Qué produce / consume | Hallazgo |
| --- | --- | --- |
| Task 1 (única) | Goal «la frase del paso 2 y el aviso del paso 1» vs Scope «Entra, si el RED lo exhibe» y red/h0.txt 3/3 limpio | El paso 2 sale por el Scope condicional → Ruling abajo |
| Task 1 | Verificación `node --test` vs superficie docs (skill) | `node --test` no ejercita la skill (0 tests); la prueba real es el humo h1 GREEN (constitución Art. I) |
| Constitución | Dos «Art. I» | Ambos aplican y no se contradicen; el segundo refuerza el ruling del paso 2 |

Task 1: Ruling: la frase del paso 2 no se escribe — red/h0.txt da 3/3 limpios (n = 3) y el Scope la marca «si el RED lo exhibe»; la constitución (Art. I, 2.º) prohíbe guidance cuyo baseline no exhibe el fallo — si es erróneo, un sujeto podría añadir fecha al nombre y haría falta otra task con un RED que lo muestre.
Task 1: Ruling: el humo h1 GREEN no lo lanzo yo — el `claude` del PATH es un stub que sale con «claude anidado bloqueado en un sujeto: run.mjs no ve su coste»; `node --test` (0 tests) no prueba la skill — si es erróneo, la task se daría por cerrada sin evidencia del GREEN: por eso queda pendiente del humo h1 relanzado por quien lanzó los RED.
Task 1: commit 9898647 (base 9b72503); RED h0/h1 idénticos a su copia; SIN línea complete: falta el humo h1 GREEN (sujeto headless bloqueado en esta sesión). Al volver con su salida: si pasa, `sdd task done <plan> 1 9b72503 -- node --test`; si falla, ronda de REFACTOR del paso 1.
