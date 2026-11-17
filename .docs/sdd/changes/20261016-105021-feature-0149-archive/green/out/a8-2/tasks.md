---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 977e219 | |
| 2 | Listado de canceladas | done | a963cec | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre a963cec

Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, 1 hallazgo Important (el `trim()` del fix de validación no tenía test ni enmienda) RED→GREEN, 2 Minor diferidos

## Rulings

- Task 2: Ruling: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble
- Cierre: Ruling: la spec aprobada recibe una enmienda y un requisito `ADDED` («El motivo se recorta») sin pasar por el dev-lead — el código ya recortaba desde el fix de validación y la capacidad tiene que decirlo — coste si es erróneo: el dev-lead prefiere rechazar los motivos con espacios, y se quita el `trim()` y el requisito

## Final

- Final: fixed el `trim()` sin test ni enmienda — `el motivo con espacios alrededor se acepta recortado` RED→GREEN, suite 7/7
- Final: minor (deferred): el fix de validación convirtió todo `src/app.js` de CRLF a LF (48+/48− para una línea) — sin `.gitattributes` ni `.editorconfig`; a la deuda
- Final: minor (deferred): el registro de tareas no recogía el fix posterior a la revisión final — corregido en este cierre
- Final: observación: `cancelBooking` exportada no recorta; solo lo hace la ruta por línea de comandos (`reasonOf`); a la deuda
