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
| 2 | Listado de canceladas | done | (commit de la task 2) | |

Revisión final: Spec opus+high, With fixes (1 Important, 4 Minor) · Código sonnet+high, With fixes (2 Important, 5 Minor) · Arquitectura no (ruling: el diff no cruza ninguna señal), sobre e576b7c

Pasada de fix: fd8c99d, 2 hallazgos (3 tests; cobertura de comportamiento ya existente: RED por mutación, no por ausencia de código)

Re-revisión: e576b7c..fd8c99d, sdd-kit:effort-high + opus, todos los hallazgos resueltos, sin roturas nuevas

## Rulings

Task 2: Ruling: recuperación tras corte por cuota — el informe task-2-report.md llegó completo (Status: DONE, commit bbeb20a); la task pasa a su revisión, sin relanzar el implementador — cuesta una revisión de más si el commit no fuera completo
Task 2: minor (deferred): src/app.js:28 canceladas sin canceladas imprime línea en blanco (la spec no lo define)
Task 2: Ruling: sin squash — entre bbeb20a y e576b7c está el commit docs 953a2a6 (tasks.md), squashar reescribiría historia ajena a la task — cuesta un commit de fix más en el historial
Final: Ruling: Eje Arquitectura sin línea en el plan — decidido no — el diff no cruza ninguna de las cuatro señales — coste si falla: un hallazgo de frontera sin revisar
Final: Ruling: canceladas vacío imprime línea en blanco (Código lo graduó Important) — re-graduado a Minor: la spec no define la salida vacía, `libres` ya imprime '' en el mismo caso, y añadir un mensaje cambia la salida observable (freno de alcance) — se difiere — coste si falla: una línea en blanco confusa para quien lista sin canceladas
Final: Ruling: el test 'cancelar sin reserva lo dice' lo quitó Task 1 al exigir motivo; Spec lo graduó Minor y Código Important — Important por efecto: la ruta `sin reserva` con motivo válido quedaba sin test — entró en la pasada de fix — coste si falla: un test de más
Final: minor (deferred): test 'canceladas…' acoplado al orden (su GIVEN es un no-op en la corrida completa; estado de módulo compartido)
Final: minor (deferred): `cancelar --motivo otro Norte lun` toma '--motivo' como sala (sintaxis fuera de la spec)
Final: minor (deferred): falta de --motivo y motivo no válido comparten mensaje (así lo pide la spec)
Final: minor (deferred): cancelledList mezcla filtro, formato y join en una línea larga (~115 car.)
Final: minor (deferred): literales 'active'/'cancelled'/'voided' repetidos
Final: minor (deferred): el test de motivo inválido usa Sur mar sin reserva: no prueba que una reserva real siga activa
Final: minor (deferred): spec etiqueta ADDED el requisito que modifica `cancelar`, y la numeración de decisiones salta de 1 a 3
Final: minor (deferred): voidBooking tiene su camino `sin reserva` sin test (anular es de la 0011)

## Deferred minors

- Task 2: minor (deferred): src/app.js:28 canceladas sin canceladas imprime línea en blanco (la spec no lo define)
- Final: minor (deferred): test 'canceladas…' acoplado al orden (su GIVEN es un no-op en la corrida completa; estado de módulo compartido)
- Final: minor (deferred): `cancelar --motivo otro Norte lun` toma '--motivo' como sala (sintaxis fuera de la spec)
- Final: minor (deferred): falta de --motivo y motivo no válido comparten mensaje (así lo pide la spec)
- Final: minor (deferred): cancelledList mezcla filtro, formato y join en una línea larga (~115 car.)
- Final: minor (deferred): literales 'active'/'cancelled'/'voided' repetidos
- Final: minor (deferred): el test de motivo inválido usa Sur mar sin reserva: no prueba que una reserva real siga activa
- Final: minor (deferred): spec etiqueta ADDED el requisito que modifica `cancelar`, y la numeración de decisiones salta de 1 a 3
- Final: minor (deferred): voidBooking tiene su camino `sin reserva` sin test (anular es de la 0011)
