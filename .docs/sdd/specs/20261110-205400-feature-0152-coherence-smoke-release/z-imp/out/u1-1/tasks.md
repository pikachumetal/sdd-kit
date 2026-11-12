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
| 1 | Cancelar con motivo | done | (commit de la task 1) | |
| 2 | Listado de canceladas | done | (commit de la task 2) | Con la enmienda 2026-11-12: sin «quién canceló» |

Revisión final: Spec opus+high, con fixes (2 Important) · Código sonnet+high, con fixes (1 Important) · Arquitectura no (plan), sobre 0448fad
Pasada de fix: 08a900f, 2 hallazgos RED→GREEN (tests que detectan su mutación)
Re-revisión: 0448fad..08a900f, sdd-kit:effort-high + opus, todos resueltos, sin roturas nuevas

## Rulings

Final: minor (deferred): el test de `canceladas` depende del orden de los tests por el estado de módulo (Spec y Code)
Final: minor (deferred): `canceladas` sin canceladas imprime una línea vacía; la spec calla y añadir un texto cambia la salida observable (Spec y Code)
Final: minor (deferred): `reasonOf` solo lee el token tras `--motivo`; `cancelar --motivo otro Norte lun` responde «sin reserva --motivo otro» (Code)
Final: minor (deferred): literales de estado repetidos (`active`, `cancelled`, `voided`), anterior a la rama (Code)
Final: Ruling: persistencia entre ejecuciones — las reservas viven en memoria y la base ya era así; la 0014 del roadmap («Motivo guardado») la trata — si falla, `cancelar` y `canceladas` en procesos distintos no se ven
Final: Ruling: motivo sin comillas en la shell (`--motivo sala ocupada` llega como `sala`) — el mensaje de error enseña los motivos válidos y la spec usa comillas — si falla, la persona repite el comando
Final: Ruling: mayúsculas en el motivo («Sala ocupada» se rechaza) — la lista es cerrada por decisión del dev-lead y el mensaje guía — si falla, un rechazo evitable
Final: Ruling: `--motivo` en el lugar de la sala o el día — la spec fija el orden `cancelar <sala> <día> --motivo <motivo>` — si falla, respuesta rara sin daño
Final: Ruling: orden de las validaciones (motivo inválido sobre reserva inexistente responde «motivo no válido») — la spec no lo fija y los dos mensajes son correctos — si falla, la persona ve el otro error en el segundo intento
Final: Ruling: cambio de firma de `cancelBooking` (tercer parámetro) — sin otros llamadores en el repo (lo comprobó el eje Spec) — si falla, un llamador futuro olvida el motivo y recibe «motivo no válido»
Final: Ruling: parseo y formato dentro de `app.js`, ejecución por `process.argv` al importar y `reasons` fijas — fuera de plan (Architecture no sale; anterior a la rama) — si falla, deuda a pagar en otra feature
Final: Ruling: no verificado «suite entera» — ya la ejecuté yo: `node --test` 5/5 antes del fix y 7/7 después
Final: Ruling: no verificado «evidencia de la Task 1» — la Task 1 se cerró en una sesión anterior sin línea `complete` en este ledger; su commit es 1e0c09a y su verificación la cubre `node --test` 7/7 — si falla, falta el rastro histórico, no el comportamiento
