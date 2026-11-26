---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 2305b0c | |
| 2 | Listado de canceladas | done | ef8ba4f | |
| 3 | Arreglo de la revisión final (tests) | done | 487c9a1 | THEN «sin --motivo» con test; `canceladas` prepara su GIVEN; vuelve «sin reserva» con motivo |
| 4 | Validación del dev: declarar la versión de Node (paso 1) | done | 4663864 | `engines.node` en `package.json` |



## Rulings

- Task 2: Ruling (retirado en la Task 3, 487c9a1: el test de `canceladas` ya prepara su GIVEN): el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden

## Ledger

- Final: Eje Arquitectura: sin línea en el plan · señales en el diff: ninguna (sin módulo nuevo, sin dependencia (en d0189f8 `package.json` intacto; la Task 4 añade solo `engines`, que no es una dependencia), sin contrato entre módulos; el campo `reason` vive en la reserva en memoria) → no sale
- Revisión final: Spec opus+high, 2 Importantes + 1 Minor · Código sonnet+high, 3 Importantes + 5 Minor · Arquitectura no (plan), sobre d0189f8
- Final: Ruling: orden de argumentos (`cancelar --motivo otro Norte lun`) — Importante del eje Código bajado a Minor: es fuera de la forma de la spec, responde «sin reserva …» y no cambia ningún dato — coste si es erróneo: un mensaje confuso al teclear el orden contrario
- Final: minor (deferred): el test de motivo inválido no comprueba que la reserva siga activa
- Final: minor (deferred): `--motivo` sin valor o con otro flag como valor no se distingue de un motivo incorrecto
- Final: minor (deferred): `canceladas` sin resultados imprime una línea en blanco
- Final: minor (deferred): validar el motivo antes que la reserva oculta «sin reserva» cuando faltan ambos
- Final: minor (deferred): `cancelBooking` y `voidBooking` repiten buscar-comprobar-mutar
- Final: a la pasada de arreglo entran: THEN «sin --motivo» sin test; test de `canceladas` que no prepara su GIVEN (ruling de la Task 2); test «cancelar sin reserva» borrado
- Final: fixed THEN «sin --motivo» sin test — test «cancelar sin motivo»; sin RED posible (el código ya era correcto), comprobado por mutación: con `reasonOf` por defecto "otro" el test falla
- Final: fixed test de `canceladas` dependiente del orden (ruling de la Task 2) — RED solo con --test-name-pattern (`''` en vez de «Norte lun — sala ocupada»), GREEN solo y en el fichero
- Final: fixed test borrado «cancelar sin reserva» — test «cancelar con motivo una reserva que no existe lo dice»
- Pasada de fix: Task 3, 3 hallazgos
- Re-revisión: d0189f8..f15aba6, sdd-kit:effort-high + opus, 3 de 3 hallazgos resueltos, sin Críticos ni Importantes nuevos
- Final: minor (deferred): el test de `canceladas` sigue acoplado al estado compartido del proceso (si otro test cancela otra reserva, el listado tendría dos líneas); la raíz es la memoria compartida hasta la 0014
- Task 4: Ruling: el dev pidió en la validación (paso 1) declarar la versión de Node; elijo `>=20` (node:test estable y ESM; la máquina corre v26.10) — coste si es erróneo: un Node más viejo del que sí funciona queda excluido por `engines`, o uno más nuevo que no se ha probado queda permitido
- Task 4: Ruling: el test vive en `test/app.test.js` y no en un fichero nuevo — así lo corre `bookings:test` del gate; un fichero nuevo no estaba en ninguna tarea — coste si es erróneo: ninguno
- Final: Task 4 es un fallo de la validación del dev, no del código de la spec; `package.json` es «Sin filtro»: el gate corre entero
- Revisión Task 4: f15aba6..a4163c7, sdd-kit:effort-high + sonnet, sin Críticos ni Importantes
- Final: minor (deferred): `package.json` no está en los `inputs` de `bookings:test` de `gate.json`; con `--affected`, un cambio solo en `package.json` no dispara el test de `engines` (hoy lo cubre «Sin filtro»)
- Final: minor (deferred): el test de `engines` fija el literal `>=20`; un rango equivalente lo rompería
- Final: minor (deferred): el commit 4663864 usa `feat:` para un metadato de `package.json`; `chore:` o `build:` encajaría mejor
- Final: no verificado: `>=20` declara soportado un Node que no se ha probado (la máquina corre v26.10); el reviewer señala que `scripts/gate.mjs` cuenta con el formato del reporter `spec`, que en Node 20 sin TTY podría ser otro
