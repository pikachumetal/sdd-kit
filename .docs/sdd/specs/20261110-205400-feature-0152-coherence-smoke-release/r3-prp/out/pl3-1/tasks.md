---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
created: 2026-11-11
---

# Tasks — Motivo al cancelar (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0010-cancel-reason`

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`).

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar pide un motivo de la lista | done | 86fc422 | |
| 2 | El listado de canceladas enseña el motivo | done | 90b8e8a | |

Revisión final: Spec opus+high, sin hallazgos · Código sonnet+high, 6 Minor diferidos · Arquitectura no (plan), sobre 90b8e8a

## Verificación por task

- [x] Task 1 — `node --test test/cancel.test.js` y `node scripts/lint.mjs`
- [x] Task 2 — `node --test test/cancel.test.js` y `node scripts/lint.mjs`

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |

## Rulings

Final: minor (deferred): src/app.js:4 `bookings =[{` pierde un espacio (ruido de diff)
Final: minor (deferred): test/cancel.test.js pasa de CRLF a LF y reescribe todo el diff
Final: minor (deferred): los tests de cancel.test.js dependen del orden (estado en memoria compartido) y los nombres no lo dicen
Final: minor (deferred): `motivo()` en castellano entre nombres en inglés (reason, cancelReasons)
Final: minor (deferred): sin test para `--motivo` sin valor ni seguido de otro flag
Final: minor (deferred): ningún test fija la decisión 4 (motivo se valida antes de buscar la reserva)
Final: minor (deferred): datos de dos tests (otro, porque sí) distintos de los del Review Focus (sala ocupada, xyz); equivalentes
Final: minor (deferred): tasks.md deja la fila de la Task 2 con «Commit —» (se rellena en el cierre)
Final: Ruling: orden de validación motivo→reserva — lo pide la decisión 4 del plan; una persona espera el error de motivo primero — si se quiere el otro orden, cambia un mensaje
Final: Ruling: canceladas sin otros campos ni orden — la spec solo fija «sala día — motivo»; sale en orden de reserva — coste: si piden ordenar, una línea
Final: Ruling: voidBooking sin motivo — las anulaciones son la 0011 — coste: ninguno en esta rama
Final: Ruling: forma del estado (reason añadido dinámicamente) — suficiente en memoria a este tamaño — coste: refactor si hay persistencia
Final: Ruling: límites de módulos y CLI en src/app.js — eje Arquitectura no sale (sin módulo, dependencia ni contrato) — coste: ninguno
Final: Ruling: `cancelar --motivo x Norte lun` (orden de argumentos) — la spec fija `<sala> <día> --motivo` — coste: respuesta «sin reserva»
Final: Ruling: mayúsculas/espacios en el motivo — lista cerrada y literal (decisión del dev-lead), el error lista los válidos — coste: «Sala ocupada» se rechaza
Final: Ruling: canceladas excluye anuladas — decisión 5 del plan, las anulaciones son la 0011 — coste: ninguno
Final: Ruling: estado no persiste entre ejecuciones de la CLI — ya era así — coste: ninguno
Final: Ruling: cancelar dos veces responde «sin reserva» — comportamiento previo — coste: ninguno
Final: Ruling: freeRooms sin día — previo y fuera de alcance — coste: ninguno
Final: Ruling: CHANGELOG y README sin tocar — van en el cierre/release — coste: ninguno
