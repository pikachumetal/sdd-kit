# SDD ledger — plan: .docs/sdd/specs/20261014-130000-feature-0026-note-title-date/plan.md

## Pre-flight scan
| Fila | Qué se comprobó | Hallazgo | Ruling |
| --- | --- | --- | --- |
| Pares de tasks | una sola task | no hay pares | — |
| Task 1 | texto contra sí mismo y la spec | «que fallan sin la guía» no vale para h0: limpio 1 de 1 | Desvío, ver abajo |
| Task 1 | Verificación `node --test` | 0 tests, exit 0: no prueba los humos | No basta para el contrato |
| Constitución | Art. I duplicado | compatibles: test que falla antes y humo después | Se aplican los dos |

Task 1: base check: develop sin cambios frente a la merge-base.
Task 1: Ruling: paso 1 redactado sin «no escribas hasta…» — el THEN solo dice pedir el título; otra frase sería un AND nuevo — si no basta, una ronda de REFACTOR.
Task 1: Ruling: no se lanza `sdd task done` — `node --test` registraría complete con 0 tests y sin humo h1 en verde — coste si es erróneo: un comando.
Task 1: Desvío abierto: frase del paso 2 fuera del Scope con n = 1; correction sin commitear en spec.md, espera aprobación.
Task 1: BLOQUEO: `claude` bloqueado en este entorno («claude anidado bloqueado en un sujeto: run.mjs no ve su coste») y sin herramienta de subagentes: no se pueden lanzar h0 (+2) ni el GREEN de h1. Bloqueo respetado, no se busca otro binario.
