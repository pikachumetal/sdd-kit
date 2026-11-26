---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 6110d34 | |
| 2 | Listado de canceladas | done | 5538e7c | |

Revisión final: Spec opus+high, con arreglos · Código sonnet+high, con arreglos · Arquitectura no (plan), sobre e40e922
Pasada de fix: e0fd07e, 5 hallazgos (1 RED→GREEN)
Re-revisión: e40e922..e0fd07e, sdd-kit:effort-high + opus, con 2 Minor (CRLF de app.js y de cancel.e2e.mjs), arreglados en c12b454, revisado en el hilo (solo finales de línea, 0 líneas de código)

## Rulings

- Task 2: Ruling: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden
- Final: Eje Arquitectura: no en el plan · señales en el diff: ninguna (sin módulo nuevo, sin manifiesto tocado, sin contrato entre módulos) → no sale
- Final: fixed c56a712 cancelada ocupaba la sala en libres (Spec Important, Código Important) — «cancelar libera la sala en libres» RED→GREEN, suite 8/8 + e2e 5/5
- Final: fixed sin --motivo sin test (Spec Important) — suite 8/8
- Final: fixed canceladas dependía del primer test (Código Important; Ruling de la Task 2 queda sin efecto) — resetBookings por test, suite 8/8
- Final: fixed rama «sin reserva» sin test (Código Important) — suite 8/8
- Final: fixed dos e2e fuera de los flujos core (Código Important) — retirados; cubiertos en unitarios, e2e 5/5
- Final: fixed app.js reescrito de CRLF a LF (Código Minor) — CRLF restaurado en c12b454 (e0fd07e lo dejó en LF; lo vio la re-revisión)
- Final: minor (deferred): cancelBooking/voidBooking repiten buscar+estado; reasonOf acepta un flag como motivo; canceladas vacío imprime línea en blanco
- Final: Ruling: La spec no cubre «canceladas» vacío ni el orden motivo-antes-que-reserva — una persona recibe un motivo no válido igual, coherente con el AND de la spec — coste: mensaje poco específico
- Final: Gate: `node --test test/` → unit: corrió 8/8 · `node e2e/run.mjs` → e2e: corrió 5/5
