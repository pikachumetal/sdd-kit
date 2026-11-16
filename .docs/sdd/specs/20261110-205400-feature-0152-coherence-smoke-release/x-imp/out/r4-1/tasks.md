---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
created: 2026-10-08
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | fa32668 | |
| 2 | Listado de canceladas | done | e5dade3 | |

Revisión final: Spec opus+high, With fixes (2 Important, 3 Minor) · Código sonnet+high, With fixes (2 Important, 3 Minor) · Arquitectura no (plan), sobre 5b7aa66

Pasada de fix: 4a10aa7, 3 hallazgos RED→GREEN

Re-revisión: 5b7aa66..d3d0095, sdd-kit:effort-high + opus, todos los hallazgos resueltos, sin roturas nuevas

## Rulings

- Task 2: Ruling: recuperación tras corte por cuota — informe task-2-report.md completo (DONE, e5dade3), lo cuento como devuelto y va a la revisión de la task
- Final: minor (deferred): canceladas vacía imprime línea en blanco (spec silente)
- Final: minor (deferred): reasonOf frágil si --motivo va antes de sala/día o sin valor (spec solo define el orden sala día --motivo)
- Final: minor (deferred): booking.reason solo existe en canceladas (forma implícita, aceptable a este tamaño)
- Final: minor (deferred): test de motivo fuera de lista usa Sur mar inexistente, no prueba que una reserva real siga activa
- Final: Ruling: declined (Spec) mayúsculas distintas de «Sala ocupada» se rechazan — la decisión 1 fija lista cerrada y literal — coste: si el dev-lead quería tolerancia, es otra feature
- Final: Ruling: declined (Spec) orden de argumentos distinto, reservas previas sin motivo, anuladas en canceladas — fuera de la spec/0011; se rechaza o no aplica — coste: bajo
- Final: Ruling: declined (Code) límite de módulo CLI/run/dominio en src/app.js, formato de salida, commits de docs — pertenecen a Arquitectura/Spec/proceso — coste: nulo
- Final: Ruling: no verificado (Spec) numeración de «Decisiones» salta del 1 al 3 — no puedo saber si se perdió una decisión del dev-lead; no cambia el código; lo elevo en ✋ para que Laura confirme — coste: una decisión perdida
- Final: Ruling: no verificado (Spec) test borrado = regresión del patch 0007 — verificado: el test borrado era «cancelar sin reserva lo dice», no el de la causa raíz (comparación por hora); su cobertura se restaura en el fix (b)
