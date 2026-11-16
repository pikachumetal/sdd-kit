---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 166fb2c | |
| 2 | Listado de canceladas | done | fa15b28 | |


Revisión final: Spec opus+high, listo para fusionar (1 Minor) · Código sonnet+high, con arreglos (1 Important) · Arquitectura no (plan), sobre fa15b28
Pasada de fix: cc214d8, 2 hallazgos RED→GREEN
Re-revisión: fa15b28..cc214d8, sdd-kit:effort-high + opus, todo atendido, sin roturas Critical/Important (3 Minor con ruling)

## Rulings

Final: Ruling: Minor del eje Spec propone tope de 10 — se aplica 20 + «… y N más», que fija la decisión 4 de la spec con el dev-lead — si la spec cambia, es una constante (MAX_CANCELLED)
Final: Ruling: cancelledList exportada con parámetro por defecto — costura de test: la reserva de la app es de módulo y no hay forma de crear 21 canceladas por el comando — coste: una exportación más
Final: Ruling: test del recorte con aserción débil (doesNotMatch; la reserva ya está cancelada por el test 1) — protege contra quitar el trim() y no hay segunda pasada de fix — coste: no comprueba el camino de éxito con el motivo recortado
Final: Ruling: «últimas» sigue el orden de creación de la reserva, no el de cancelación — hoy la app no genera más de una cancelada y no hay fecha de cancelación en los datos; añadirla es un cambio de datos que la spec no pide — coste: con reservas reales, el tope puede enseñar canceladas que no son las más recientes
Final: Ruling: cancelledList exportada se prueba por función y no por el comando `canceladas` («Dónde se prueba» de la spec) — el THEN sigue probado por el comando (test 3); solo el tope usa la costura; no edito la spec — coste: «Dónde se prueba» no refleja el test del tope
Final: Ruling: test/cancel.test.js cambió de finales de línea CRLF→LF en el commit del fix — no toca aserciones, nombres ni datos de los tests RED — coste: ruido en el historial
