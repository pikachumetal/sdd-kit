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
| 1 | Cancelar con motivo | done | ab98b32 | |
| 2 | Listado de canceladas | done | e5d459d | Enmienda aprobada 2026-11-14: el listado no enseña «quién canceló» (sin usuarios en la app) |

Revisión final: Spec opus+high, con arreglos (1 Important, cubierto por la pasada de fix) · Código sonnet+high, con arreglos (2 Important de cobertura, cubiertos por la pasada de fix) · Arquitectura no (plan: sin línea; sin señales en el diff, ruling del ledger), sobre e5d459d, 1 sin verificar (test de regresión del patch 0007, fuera del diff)
Pasada de fix: ea6436b, 2 hallazgos RED→GREEN (por mutación)

Re-revisión: e5d459d..ea6436b, sdd-kit:effort-high + opus, 3 de 4 hallazgos resueltos; abierta la mitad del guard de doble cancelación (ruling en el ledger), 0 roturas nuevas

## Rulings

Final: Ruling: sin línea «Eje Arquitectura» en el plan, decidido al despachar: no — ninguna señal en el diff — coste si me equivoco: un fallo de frontera entre módulos llegaría sin revisar por ese eje
Final: minor (deferred): canceladas sin canceladas imprime una línea vacía; devolver un mensaje en castellano
Final: minor (deferred): el test de canceladas depende del estado compartido del módulo (acoplamiento temporal entre tests)
Final: minor (deferred): cancelar --motivo "sala ocupada" sin sala ni día responde «sin reserva --motivo sala ocupada»
Final: minor (deferred): estados 'active'/'cancelled'/'voided' como literales repetidos en src/app.js
Final: Ruling: persistencia entre invocaciones (Spec, declined) — cada `node src/app.js` arranca con el array en memoria, así que `canceladas` en un proceso aparte no ve lo cancelado en otro; ya era así en todo el molde y el Approach de la spec no pide persistencia, se apunta como deuda, no como finding — coste si me equivoco: desde el CLI real el listado sale siempre vacío
Final: Ruling: regla de 24 h de PRODUCT.md (Spec, declined) — ni spec ni plan la mencionan y ya faltaba antes de la rama — coste si me equivoco: se puede cancelar a menos de 24 h sin aviso
Final: Ruling: mayúsculas y espacios en el motivo (Spec, declined) — la lista es cerrada (decisión 1) y el error enseña los valores válidos — coste si me equivoco: «Sala ocupada» se rechaza
Final: Ruling: --motivo antes de sala y día (Spec, declined) — el Scope fija `cancelar <sala> <día> --motivo <motivo>` — coste si me equivoco: orden distinto da «sin reserva»
Final: Ruling: motivo inválido sobre reserva inexistente responde «motivo no válido» (Spec, declined) — coherente con la AND «sin --motivo responde lo mismo»; la spec no fija el orden — coste si me equivoco: mensaje menos preciso
Final: Ruling: test de regresión del patch 0007 (Spec, no verificado) — queda fuera del diff y la rama no lo toca — coste si me equivoco: una regresión del 0007 pasaría sin test
Final: Ruling: recuento pass/fail en el ledger (Spec, no verificado) — lo he verificado yo: `node --test` completo da 7 pass / 0 fail tras la pasada de fix — coste si me equivoco: ninguno
Final: Ruling: guard de doble cancelación sin aserción (Código Important, mitad abierta tras la re-revisión) — el test original de bd597c5 tampoco lo cubría, no es una regresión de esta feature; queda sin test y con un ruling en lugar de una segunda pasada de fix — coste si me equivoco: quitar el filtro status === 'active' de findBooking dejaría cancelar dos veces y sobrescribir el motivo sin que ningún test falle (un test de una línea lo cerraría)
