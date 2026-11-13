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
| 1 | Cancelar con motivo | done | 89ca43b | |
| 2 | Listado de canceladas | done | f27471a | Minor sin acción: el test de `canceladas` depende del estado del test previo |

Revisión final: Spec opus+high, con fixes (2 Important) · Código sonnet+high, con fixes (1 Important) · Arquitectura no (plan sin señales), sobre 7427a26, 1 sin verificar
Pasada de fix: 6244351, 2 hallazgos RED→GREEN (mutación)
Re-revisión: 7427a26..0cb9195, sdd-kit:effort-high + opus, todos los hallazgos resueltos, sin roturas nuevas

## Rulings

- Task 2: Ruling: recuperación tras corte por cuota — informe task-2-report.md completo (DONE, commit f27471a, 4/4); cuenta como devuelto y pasa a su revisión de task
- Final: minor (deferred): test de canceladas depende del estado del test 1 (test/cancel.test.js:13-15)
- Final: minor (deferred): canceladas sin canceladas imprime línea vacía (src/app.js)
- Final: minor (deferred): línea larga en src/app.js; --motivo sin comillas se lee como «sala»; motivo se valida antes que la reserva (deliberado, lo exige el AND de la spec)
- Final: Ruling: Declined (Spec) persistencia entre invocaciones de la CLI — bookings en memoria como antes, la spec no pide persistencia; un usuario que lanza dos procesos ve canceladas vacío, ya pasaba con cancelar — coste si me equivoco: feature de persistencia aparte
- Final: Ruling: Declined (Spec) mayúsculas/variantes del motivo — la lista cerrada exacta la decidió el dev-lead y el error enseña los valores válidos — coste: un usuario escribe «Sala ocupada» y reintenta
- Final: Ruling: Declined (Spec) decisión 3 y numeración de decisiones (falta la 2) y etiqueta ADDED vs MODIFIED — redacción de la spec, no del diff — coste: cosmético
- Final: Ruling: Declined (Spec/Código) validar motivo antes que la reserva — el AND de la spec pide «motivo no válido» sin --motivo sin más condiciones; el orden cumple el contrato — coste: ninguno
- Final: Ruling: Declined (Código) lugar del estado y la lógica en un solo app.js — eje Arquitectura, que no sale (sin señales) — coste: el módulo crecerá con 0011
- Final: Ruling: Declined (Código) si los tests antiguos cuentan como RED — el paquete no separa test y código; no consta en esta sesión que se comparase la copia RED de cada task (la sesión anterior se cortó) — coste: ninguno verificable
- Final: no verificado resuelto: patch 0007 nombra «test de regresión» sin ruta; la cobertura que se perdió es la de la rama «sin reserva» de cancelar, que el fix restaura — Ruling: no busco más — coste: si el test del patch era otro, vive en test/app.test.js que no se tocó
