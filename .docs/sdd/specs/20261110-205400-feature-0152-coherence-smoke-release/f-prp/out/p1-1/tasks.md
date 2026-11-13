---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
created: 2026-11-12
---

# Tasks — Motivo al cancelar (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0010-cancel-reason`

Revisión final: Spec opus+high, listo para merge (3 Minor) · Código sonnet+high, con arreglos menores (3 Minor, diferidos) · Arquitectura no (plan), sobre 89bf3e9

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar pide un motivo de la lista | done | b01d497 | |
| 2 | El listado de canceladas enseña el motivo | done | — | |

## Verificación por task

- [x] Task 1 — `node --test test/cancel.test.js` → `ℹ fail 0`
- [x] Task 2 — `node --test test/cancel.test.js` → `ℹ fail 0`

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |

## Rulings

- Final: Ruling: canceladas no lista las anuladas (voided) — la spec pide «reservas con estado cancelada» y la 0011 es la de anulaciones — si se quiere verlas, es otra feature
- Final: Ruling: validar el motivo antes que la reserva — decisión 3 del plan, explícita; quien cancela sin motivo ve la lista de motivos aunque la sala esté libre — coste: un mensaje distinto en un caso raro
- Final: Ruling: sala/día se leen de las posiciones 0 y 1 y `--motivo` en cualquier sitio — la spec fija el orden `<sala> <día> --motivo`; `cancelar --motivo otro Norte lun` da un error confuso — coste: bajo
- Final: Ruling: motivos sensibles a mayúsculas («Sala ocupada» se rechaza) — lista cerrada por decisión del dev-lead y el mensaje enseña los valores exactos — coste: bajo
- Final: Ruling: sustituir el test existente `cancelar una reserva activa` — lo ordena el plan (decisión 4): la spec cambia la salida de cancelar — coste: ninguno
- Final: Ruling: CRLF→LF de test/cancel.test.js — formato, el Write del fichero lo normalizó; se deja en LF, git lo normaliza (aviso de autocrlf) — coste: ruido en el diff
- Final: Ruling: persistencia entre ejecuciones de la CLI — las reservas viven en memoria desde el molde, la spec no pide guardarlas — coste: `cancelar` y luego `canceladas` en dos procesos distintos da «sin canceladas»; hay que decirlo en el walkthrough
- Final: minor (deferred): tests de cancel.test.js dependen del orden por el estado compartido de `bookings` (canceladas enseña el motivo, canceladas sin canceladas)
- Final: minor (deferred): el test `cancelar sin motivo lo rechaza` no fija por sí solo que la reserva sigue activa (la fija `cancelar con motivo` por el orden)
- Final: minor (deferred): el Review Focus dice `--motivo "sala ocupada"` en «sin reserva» y el test usa `otro`; mismo comportamiento
- Final: minor (deferred): `--motivo` sin comillas con varias palabras se lee como `sala` y se rechaza (el mensaje lista los motivos)
- Final: minor (deferred): la prueba manual de la Task 2 en la CLI no es reproducible entre procesos (ver ruling de persistencia)
