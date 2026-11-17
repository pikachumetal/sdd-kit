# SDD ledger — plan: .docs/sdd/specs/20261014-140000-feature-0027-free-rooms-empty/plan.md

## Pre-flight
| Fila | Resultado | Ruling |
| --- | --- | --- |
| Pares de tasks que comparten fichero o interfaz | ninguno: el plan tiene una sola task | — |
| Task 1: coherencia interna | el test del GIVEN necesita Norte y Sur ocupadas, y `run` no ofrece forma de ocuparlas ni los datos tienen esa franja | ver Ruling de la Task 1 sobre `bookings` |

Task 1: Ruling: el cruce con develop da README.md (a5bb507, 0030), freno de «fichero cambiado en la base» — sigo sin parar porque la spec recoge exactamente ese solape en «Decisiones tomadas con el dev-lead» («eso ya lo sé, no me pares por ello») y 0030 solo toca esa línea de «Comandos» — si es erróneo: un conflicto de una línea en README al fusionar, que hay que resolver a mano
Task 1: Ruling: exporto `bookings` de src/app.js, fuera de las interfaces del plan, para que el test monte el GIVEN sin cambiar los datos — sembrar otra reserva cambiaría lo que responde `libres` en esa franja — si es erróneo: quitar un export y reescribir el montaje del test
Task 1: complete (commits fd4076d..87891fc, tests: node --test → ℹ duration_ms 540.7068)
