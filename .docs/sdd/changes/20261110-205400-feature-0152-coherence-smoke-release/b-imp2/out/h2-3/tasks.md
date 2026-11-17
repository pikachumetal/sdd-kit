# Tasks — 0010 Motivo al cancelar

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — Cancelar con motivo | hecha | 1089315 |
| 2 — Listado de canceladas | hecha | bfddf41 |

Revisión final: Spec opus+high, Yes · Código sonnet+high, Yes · Arquitectura no (plan), sobre 22c1f6c

## Rulings

- Task 0: Ruling: spec manda — el test existente de cancelar sin motivo se actualiza al nuevo contrato (motivo obligatorio) — la spec lo dice literal — coste si falla: reescribir un test.
- Task 0: Ruling: el motivo se valida antes de buscar la reserva (la spec no distingue el caso sin reserva ni motivo); el test «sin reserva» pasa un motivo válido — es lo más literal con «sin --motivo responde motivo no válido» — coste si falla: invertir el orden y un test.
- Task 0: Ruling: los tests nuevos usan una instancia fresca del módulo (`import('../src/app.js?<n>')`) para no depender del orden ni del estado compartido — higiene de tests — coste: nada.
- Task 1: Ruling: modelo sonnet + sdd-kit:effort-low — un fichero de código, spec completa — coste si falla: ronda de fix
- Task 1: Ruling: hallazgo Important «tests reescritos, el informe dice sin modificar» — los tests RED los escribió el hilo antes del despacho y reescriben los dos tests antiguos por el nuevo contrato de la spec (Ruling del preflight); el implementador no los tocó (comparado con la copia RED: idéntico). «unmodified» del informe se refiere a eso — no hay cambio de código que hacer — coste si falla: nada, es de redacción del informe
- Task 1: minor (deferred): test/cancel.test.js pasó de CRLF a LF (original CRLF) — ruido de diff
- Task 1: minor (deferred): sin test para `--motivo` como último argumento (devuelve motivo no válido; cubierto por el camino de «sin motivo»)
- Task 1: minor (deferred): comentario de por qué el import dinámico con `?t=`
- Task 2: minor (deferred): solo caso positivo en el test de `canceladas` (falta una reserva anulada/activa ausente del listado)
- Task 2: minor (deferred): lista vacía devuelve '' (la spec no lo define; decisión del autor)
- Final: Ruling: sin eje Arquitectura — un único fichero src/app.js sin cambio de fronteras — coste si falla: un eje sin revisar
- Final: minor (deferred): `canceladas` sin canceladas devuelve '' (línea en blanco en la CLI)
- Final: minor (deferred): sin test de que anuladas/activas no salen en `canceladas`
- Final: minor (deferred): test/cancel.test.js CRLF→LF (los ejes discrepan; ruido de diff)
- Final: minor (deferred): `--motivo` antes de los posicionales mal asignado (fuera de la sintaxis de la spec)
- Final: minor (deferred): helper para el literal repetido en los tests; magic strings de estado (ya existían)
- Final: Ruling: sin pasada de fix ni re-revisión — 0 Critical/Important y `review.minors` no es `fix` — coste si falla: minors diferidos
