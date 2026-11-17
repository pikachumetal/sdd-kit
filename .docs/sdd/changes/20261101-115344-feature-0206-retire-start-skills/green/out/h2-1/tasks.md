# Tasks — Motivo al cancelar (0010)

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — Cancelar con motivo | hecha | a6c0323 |
| 2 — Listado de canceladas | hecha | 08d8cae |

Revisión final: Spec opus+high, Ready to merge: Yes · Código sonnet+high, With fixes (1 Important, arreglado) · Arquitectura no (plan), sobre 08d8cae
Pasada de fix: 758770c, 1 hallazgo RED→GREEN
Re-revisión: 08d8cae..758770c, sdd-kit:effort-high + opus, ADDRESSED
Gate: `node --test` → 6/6 (sobre 758770c)

## Rulings

Task 0: Ruling: método SDD — la línea Ejecución del plan aprobado dice subagent (revisión por task) y sdd-kit.json fija native; manda el plan aprobado — cuesta 2 implementadores y 2 revisores más que Native si era innecesario
Task 0: Ruling: plan sin Modelo ni pasos — modelo mid-tier (sonnet), effort medium; el brief es el texto de la task + los THEN de la spec — cuesta rework si el brief es corto
Task 1: Ruling: el test existente 'cancelar una reserva activa' se reescribe a la spec (motivo obligatorio); la spec manda sobre el estado previo — cuesta nada, es el cambio pedido
Task 1: Ruling: un motivo inválido o ausente NO cancela la reserva (queda activa) — la spec solo fija el mensaje; lo contrario perdería la reserva por un error de tecleo — cuesta rework si se quería cancelar igualmente
Task 0: Ruling: effort-medium/low disponibles en la lista de agentes; sin degradación
Task 1: Ruling: motivo inválido y sin reserva activa → responde «motivo no válido» (el motivo se valida primero) — la spec no lo fija; cuesta un cambio de una línea
Task 1: Ruling: hallazgo Important del revisor («test/cancel.test.js modificado») rechazado — los tests los escribió el hilo como RED desde los THEN (la copia RED es idéntica a la commiteada, git diff --no-index sin diferencias); el diff contra la base es el cambio pedido y el test previo 'cancelar una reserva activa' contradice la spec; restaurarlo la violaría — cuesta nada si el revisor leyó mal; el final lo ve
Task 1: minor (deferred): ningún test demuestra que un motivo rechazado deja la reserva activa ni que se guarda `reason`
Task 1: minor (deferred): readReason toma el token siguiente aunque sea otra bandera (`cancelar Norte --motivo otro` → «sin reserva Norte --motivo»)
Task 2: minor (deferred): sin test del listado con varias canceladas (separador \n) ni vacío
Final: minor (deferred): listado vacío imprime línea en blanco (sin mensaje «sin canceladas») ni test
Final: minor (deferred): readReason parsea por posición; `cancelar --motivo otro Norte lun` responde «sin reserva --motivo otro»
Final: minor (deferred): test/cancel.test.js pasó de CRLF a LF en la Task 1 (diff reescrito entero)
Final: minor (deferred): falta test explícito de que un motivo rechazado deja la reserva activa y de varias canceladas
Final: Ruling: persistencia entre invocaciones del CLI (bookings en memoria) — queda fuera: limitación previa de toda la app y «Dónde se prueba» fija el mismo proceso; se señala al dev-lead — cuesta: `canceladas` en un proceso nuevo sale vacío
Final: Ruling: etiquetas ADDED vs «Modificadas»/MODIFIED y numeración 1,3 de la spec — incoherencia de la spec aprobada, no de la rama; se señala — cuesta nada
Final: Ruling: validar el motivo antes de buscar la reserva (declined-to-judge del eje Spec lo da por razonable) — cuesta un cambio de una línea

## Deferred minors
Task 1: minor (deferred): ningún test demuestra que un motivo rechazado deja la reserva activa ni que se guarda `reason`
Task 1: minor (deferred): readReason toma el token siguiente aunque sea otra bandera (`cancelar Norte --motivo otro` → «sin reserva Norte --motivo»)
Task 2: minor (deferred): sin test del listado con varias canceladas (separador \n) ni vacío
Final: minor (deferred): listado vacío imprime línea en blanco (sin mensaje «sin canceladas») ni test
Final: minor (deferred): readReason parsea por posición; `cancelar --motivo otro Norte lun` responde «sin reserva --motivo otro»
Final: minor (deferred): test/cancel.test.js pasó de CRLF a LF en la Task 1 (diff reescrito entero)
Final: minor (deferred): falta test explícito de que un motivo rechazado deja la reserva activa y de varias canceladas
