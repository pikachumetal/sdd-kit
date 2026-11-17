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
| 1 | Cancelar con motivo | done | 695a3bc | |
| 2 | Listado de canceladas | done | 3ce93ba | |

Revisión final: Spec opus+high, con arreglos (2 Important, 3 Minor), 1 sin verificar · Código sonnet+high, con arreglos (2 Important, 3 Minor), 1 sin verificar · Arquitectura no (plan), sobre c97616b
Pasada de fix: 8f653bb, 4 hallazgos RED→GREEN (3 pasaron al instante: la producción ya los cumplía)
Re-revisión: c97616b..8f653bb, sdd-kit:effort-high + opus, todos los hallazgos resueltos, sin rotura nueva

## Rulings

- Task 2: Ruling: recuperación tras corte por cuota — informe task-2-report.md completo (DONE, commit 3ce93ba) cuenta como devuelto; paso a la revisión de la task — sin redespachar al implementador — coste si falla: una ronda de arreglo
- Final: Ruling: Eje Arquitectura no — el plan no trae la línea y el diff no cruza ninguna señal — si falla, se pierde la revisión de fronteras de un cambio de dos ficheros
- Final: minor (deferred): `canceladas` vacía devuelve cadena vacía — cambia la salida observable y la spec calla: decisión del dev-lead, no mía
- Final: minor (deferred): `reasonOf` no distingue «falta --motivo» de «motivo inválido» — la spec pide el mismo mensaje para ambos
- Final: minor (deferred): colocación de cancelledList en src/app.js — cosmético
- Final: Ruling: Spec «sin verificar suite» — la suite entera la corro yo tras la pasada de fix — si falla, la pasada no termina
- Final: Ruling: Spec «informe de Task 2 recuperado» — task-2-report.md completo y revisado limpia en su task; los huecos de test que señala la revisión final entran en la pasada — coste: ninguno adicional
- Final: Ruling: Declined (persistencia entre procesos; orden de argumentos; motivo multi-palabra sin comillas; error de motivo gana a «sin reserva»; anulaciones 0011; numeración 1,3 de Decisiones) — fuera del alcance de la spec o literal en ella; sin cambios — coste si falla: un follow-up
- Final: Ruling: Code «no verificado: RED→modificación» — comparo yo la copia RED con el test antes de cerrar — coste: una enmienda
- Final: Ruling: Eje Code "módulo separado" — Architecture no sale; un fichero con 2 comandos no cruza frontera — coste: refactor futuro
- Final: minor (deferred): fin de línea del fichero de tests cambió en 8f653bb (ruido en blame) — sin efecto
- Final: Ruling: el test «sin reserva» pierde su entrada original (sin --motivo) porque la spec manda «motivo no válido» sin --motivo; queda anotado para el walkthrough — coste: ninguno
