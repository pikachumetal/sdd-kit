# Tasks — 0010 Motivo al cancelar

| Task | Estado | Commit | Visual |
| --- | --- | --- | --- |
| 1 — Cancelar con motivo | hecha | 49c162f | n/a (backend) |
| 2 — Listado de canceladas | hecha | 01a83e0 | n/a (backend) |

## Rulings

- Task 2: Ruling: tests de «sin --motivo» y «sin reserva» añadidos tras las tasks — el AND de la spec no tenía test y el de «sin reserva» se borró en la Task 1 — si me equivoco, un test de más sin efecto en el código
- Final: minor (deferred): canceladas sin canceladas imprime una línea vacía (src/app.js, cancelledList)
- Final: minor (deferred): cancelar no distingue «falta --motivo» de «motivo fuera de lista» en el mensaje (lo fija la spec)
- Final: minor (deferred): --motivo antes de la sala/día se parsea como posicional (reasonOf, src/app.js)
- Final: minor (deferred): test «sin --motivo» usa Norte lun, cuyo estado depende del orden (hoy da igual resultado)
- Final: Ruling: duplicación cancelBooking/voidBooking (2 apariciones) — por debajo del umbral de 3, no se abstrae — si me equivoco, deuda menor al llegar un tercer cierre
- Final: Ruling: persistencia entre invocaciones (declined del Spec) — el ADR 0003 acepta memoria de proceso y afecta a todos los comandos — si me equivoco, canceladas solo enseña algo dentro del mismo proceso; conviene hablarlo con el dev-lead
- Final: Ruling: mayúsculas en el motivo, etiqueta ADDED vs MODIFIED y numeración 1,3 de la spec (declined) — lista cerrada por decisión; la etiqueta y la numeración son del documento — coste nulo en el código
- Final: Ruling: orden de --motivo, motivos de anulaciones (declined) — sintaxis fijada por la spec; anulaciones son la 0011 — coste nulo
- Final: Ruling: dependencia entre tests por estado mutable de módulo (Out-of-Scope de la re-revisión) — el fix aísla el test de canceladas; reiniciar el estado entre tests queda como deuda, node:test corre en orden de fichero — si me equivoco, un test podría fallar al reordenarlos

Revisión final: Spec opus+high, con arreglos · Código sonnet+high, con arreglos · Arquitectura no (plan), sobre 6ee2e1e
Pasada de fix: c1ff562, 1 hallazgo RED→GREEN

Re-revisión: 6ee2e1e..d5f93bc, sdd-kit:effort-high + opus, Yes
