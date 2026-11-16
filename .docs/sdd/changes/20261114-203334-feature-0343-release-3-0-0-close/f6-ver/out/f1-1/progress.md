# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md
Task 1: complete (commits 156b338..fc85718, tests: node --test test/cancel.test.js → 2/2 pass)
Task 2: complete (commits fc85718..2e6f6bf, tests: node --test test/cancel.test.js → 3/3 pass)
Final: Eje Arquitectura: no en el plan · señales en el diff: ninguna (sin módulo nuevo, sin dependencia en manifiesto, sin contrato entre módulos; el campo `reason` es de la reserva en memoria, ADR 0003) → no sale
Final: revisión 2e6f6bf — Spec opus+high: With fixes · Código sonnet+high: With fixes · Arquitectura: no (plan)
Final: fixed cancelar sin --motivo sin test (Spec I1, Code m3) — test «cancelar sin motivo pide uno de la lista», verde a la primera (hueco de cobertura, no defecto de código); mutación sin validar el motivo → falla, suite 7/7
Final: fixed test «cancelar sin reserva lo dice» borrado (Spec I2, Code I2) — restaurado con --motivo otro, verde a la primera, suite 7/7
Final: fixed test de canceladas acoplado al orden (Code I1, Spec m1) — cancela dentro del test; pasa aislado con --test-name-pattern, suite 7/7
Final: Ruling: canceladas sin canceladas imprime línea vacía (Spec I3, Code m1) — NO se arregla: el fix añade un texto de salida que la spec no dice (cambia la salida observable = deviation); se pregunta al dev-lead — si es erróneo, el usuario ve una línea en blanco
Final: Ruling: Intent vs ADR 0003 (Spec I4) — NO es arreglo del ejecutor: con reservas en memoria y un comando por proceso, `canceladas` desde la CLI nunca enseña lo cancelado antes; decide el dev-lead (enmienda de spec, REPL o revisar ADR) — si se ignora, la feature solo se ve en los tests
Final: minor (deferred): invalid motivo no deja la reserva activa sin test (Spec m2)
Final: minor (deferred): `cancelar Norte --motivo otro` / flag antes de posicionales toma `--motivo` como día (Code m2)
Final: minor (deferred): `sin reserva` duplicado entre cancelBooking y voidBooking, 2 ocurrencias (Code m4)
Final: Ruling: Declined to judge de ambos ejes — lista cerrada de motivos, persistencia (0014), informe por sala (0012), voidBooking sin motivo, módulos/Arquitectura, anular fuera de canceladas, cancelaciones previas sin reason (imposible con ADR 0003), mayúsculas/acentos del motivo, texto libre tras otro — todo fuera de la spec o ya decidido; coste si erróneo: bajo
Final: Ruling: numeración de «Decisiones que he tomado yo» salta de 1 a 3 en la spec — defecto de documento, no del diff; se avisa al dev-lead
Final: no verificado: el gate completo `node --test` — verificado ahora: 7/7 pass; origen del test borrado (patch 0007) no determinable en el historial, ya restaurado
Final: Re-revisión: 2e6f6bf..66780d5, sdd-kit:effort-high + opus, Findings remain open (3 arreglados; 1 Important nuevo traído por la pasada: test 1 dependía del orden por el cancelar dentro del test de canceladas)
Final: fixed Important de la re-revisión (acoplamiento por orden test 1 ↔ canceladas) — rojo reproducido invirtiendo el orden de los tests (falla «cancelar con un motivo de la lista»), verde con instancia propia del módulo (import con ?canceladas): orden normal 7/7, invertido 5/5, aislado 1/1 — commit d6069d6
Final: sin revisar: d6069d6 — test de canceladas con instancia propia del módulo (una re-revisión no abre otra)
