---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 9ea4bcb | |
| 2 | Listado de canceladas | done | b5be669 | |


Revisión final: Spec opus+high, lista para mergear (1 Minor, re-graduado a Important) · Código sonnet+high, con fixes (1 Important) · Arquitectura no (plan), sobre b5be669
Pasada de fix: 607080f, 2 hallazgos RED→GREEN

Re-revisión: b5be669..607080f, sdd-kit:effort-high + opus, todo addressed, sin roturas nuevas

## Rulings

Final: Ruling: «las 20 últimas» = las 20 últimas en el orden del array de reservas (no se guarda la fecha de cancelación), y la línea «… y N más» va al final — la spec no fija el orden ni la posición — si el dev-lead la quería arriba o por fecha de cancelación, es un cambio de una línea
Final: Ruling: el «10» que sugería el informe de Spec no se aplica — el tope es el 20 que fija la decisión 4 — si el dev-lead quería otro, cambia una constante
Final: Ruling: cancelledList pasa a exportarse con parámetro opcional (list = bookings) — es la única forma de probar más de 20 cancelaciones, porque ningún comando crea reservas — cuesta un export más en el módulo
Final: Ruling: el test del espacio asserta «sin reserva Norte lun» (el motivo se acepta y se llega a buscar la reserva, ya cancelada por el test 1) — ninguna reserva activa queda para cancelar de verdad — si se añade un comando que cree reservas, el test podría asertar «cancelada»
Final: Ruling: el AND «sin --motivo responde lo mismo» y el caso `--motivo` sin valor no tienen test (observación Important de la re-revisión, previa al fix) — el código lo cumple (src/app.js:17,21) y un commit de test tras la re-revisión no se revisa — no se añade; queda en ✋ como hueco de tests — si un cambio futuro rompe ese camino, nada lo detecta
Final: Ruling: el orden de «las 20 últimas» es el de creación de la reserva, no el de cancelación, y la decisión 4 no tiene escenario GIVEN/WHEN/THEN ni test por el comando `canceladas` — hoy nada crea reservas, así que no se nota; no se enmienda la spec (cambiaría el Delta) — con reservas creables, una cancelada hace poco podría quedar fuera del listado
Final: minor (deferred): el test del espacio depende del orden de los tests (estado compartido de bookings); asertar notMatch(/^motivo no válido/) lo haría independiente
