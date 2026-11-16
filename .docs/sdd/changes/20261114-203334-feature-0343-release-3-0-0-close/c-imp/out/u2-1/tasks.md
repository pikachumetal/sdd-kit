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
| 1 | Cancelar con motivo | done | 8a11353 | afectada por enmienda 2026-11-15 → Task 3 |
| 2 | Listado de canceladas | done | (ver git log) | cubre el listado y el AND sin `--por` |
| 3 | enmienda 2026-11-15: `--por` en `cancelar` | done | (ver git log) | Tras Task 1; va después de la 2 |

Revisión final: Spec opus+high, With fixes (1 Important, 2 Minor) · Código sonnet+high, With fixes (2 Important) · Arquitectura no (plan), sobre 9bd14a3
Pasada de fix: e90a09b, 2 hallazgos RED→GREEN (mutación)
Re-revisión: 9bd14a3..e90a09b, sdd-kit:effort-high + opus, limpia

## Rulings

Task 2: Ruling: el orden pasa a 2 → 3 — el nombre de `--por` solo se ve por `canceladas`; un test de la Task 3 sin listado pasaría en verde sin RED — coste si me equivoco: ninguno, es solo el orden
Task 2: Ruling: los tests usan `await import('../src/app.js?<tag>')` para tener un módulo con reservas nuevas; el seed es una sola reserva y `cancel.test.js` ya cancela Norte lun — coste: ninguno en producción
Final: Ruling: Eje Arquitectura no — el plan no lleva línea y el diff no cruza ninguna de las cuatro señales — si me equivoco, un límite entre módulos queda sin revisar (el cambio son dos funciones de un fichero)
Final: Ruling: --por sin valor o seguido de otra bandera (Código Important 2, Spec Minor 2) no se arregla en esta pasada — arreglarlo inventa un mensaje de error que la spec no dice (decisión que cambia la salida observable, freno de alcance) — coste: un 'quién canceló' falso o vacío si alguien teclea mal el comando; queda para ✋
Final: Ruling: la app guarda todo en memoria y cada ejecución de la CLI empieza vacía, así que 'canceladas' no enseña nada entre ejecuciones (Spec, declined to judge) — es el diseño actual de toda la app y la spec no pide persistencia — coste: la feature solo se ve dentro de un proceso; queda para ✋
Final: Ruling: imports con '?etiqueta' cargan un módulo nuevo — lo comprobé en esta sesión (los 3 tests con import dinámico dan verde y falla bajo mutación) — coste: ninguno
Final: Ruling: el RED de las Tasks 2 y 3 sí existió — salida fallando vista en esta sesión antes del código ('salas' ≠ línea esperada; falta '— Ana') — coste: ninguno
Final: minor (deferred): canceladas sin canceladas imprime una línea vacía (cambiaría la salida, no está en la spec)
Final: minor (deferred): CRLF→LF de src/app.js desde 8a11353 y finales mixtos en test/cancel.test.js
Final: minor (deferred): cancelBooking con 4 parámetros (posible Long Parameter List) y --por "" tratado como sin autor
Final: minor (deferred): el import con ?query no tiene un comentario que explique por qué
