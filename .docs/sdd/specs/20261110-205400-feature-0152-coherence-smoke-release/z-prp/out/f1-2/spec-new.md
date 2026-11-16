---
id: 20261112-163730-feature-0010-motivo-cancelar
feature: 0010
title: Motivo al cancelar una reserva
mode: full
status: approved
created: 2026-11-12
author: Fixture
approvers:
  - name: Fixture
    approved_at: 2026-11-12  # por delegación; versión tras las dos rondas de review
---

# Spec — Motivo al cancelar una reserva

🦆 Hoy `salas cancelar Norte lun` cancela la reserva sin más. Con esta feature hay que decir por qué: `salas cancelar Norte lun sala-ocupada` y la salida es `cancelada Norte lun · sala ocupada`. Los motivos son tres: cambio de planes, sala ocupada u otro; sin motivo, o con uno que no está en la lista, no se cancela nada y se avisa. Un comando nuevo, `salas canceladas`, lista las reservas canceladas con su motivo: `Norte lun · sala ocupada`. Por dentro, la reserva cancelada guarda el motivo (`reason`) junto a su estado. El listado solo ve lo cancelado en el mismo proceso (las reservas viven en memoria).

Validación: dev-lead (el propio Fixture, único responsable según PRODUCT.md) — cambia lo que ve quien usa el comando (salidas nuevas y un comando nuevo).

## Capacidades

- Nuevas: `booking-cancellation` — cancelar una reserva con motivo de una lista y consultar las canceladas.
- Modificadas: ninguna — no hay capacidad vigente: el cambio de `cancelar <sala> <día>` (antes cancelaba, ahora avisa) se modela como `ADDED` en la capacidad nueva
- Retiradas: ninguna

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: un revisor — señales: capacidad nueva (`booking-cancellation`) · tamaño: ~40 líneas en 2 ficheros (`src/app.js`, tests)
- Dominio (sonnet): si «Cancelación» (PRODUCT.md: la anula el propio cliente) y «Anulación» (el responsable) quedan sin mezclar —`canceladas` no lista anuladas— y si el motivo obligatorio contradice algún comportamiento de cancelar vigente (señal: capacidad nueva)
- Mínimo razonable: sin review — deja sin mirar si el listado cuela las anuladas o si el cambio de la firma de `cancelar` rompe un uso existente
```

Se dispatchó el revisor (`sonnet`): 10 hallazgos, ver «Hallazgos de la review». La aprobación por delegación cubre la spec con ellos incorporados.

1. Enfoque: motivo como tercer argumento posicional de `cancelar`, frente a una opción `--motivo` y a un diálogo interactivo (ver Approach).
2. El motivo es **obligatorio**: «añade un motivo… de una lista» no dice que pueda omitirse, y un motivo opcional deja canceladas sin motivo en el listado. Cambia el comportamiento de `cancelar <sala> <día>` (hoy cancela): pasa a avisar.
3. Los tres valores se escriben en la línea de comandos en kebab-case: `cambio-de-planes`, `sala-ocupada`, `otro`; la salida los muestra con espacios: `cambio de planes`, `sala ocupada`, `otro`. Un argumento con espacios obligaría a entrecomillar.
4. Aviso de motivo ausente o no válido: `motivo no válido: usa cambio-de-planes, sala-ocupada u otro`. Se comprueba **antes** de buscar la reserva: no se cancela nada y no se dice `sin reserva`.
5. Salida al cancelar: `cancelada Norte lun · sala ocupada` (el motivo tras ` · `). `sin reserva Sur mar` no cambia.
6. «El listado de canceladas» (roadmap) no existe hoy: lo creo como comando `canceladas`. Una línea por reserva: `Norte lun · sala ocupada`, en el orden de la lista de reservas (no guardo marca de tiempo); vacío: `sin canceladas`. Argumentos sobrantes de `canceladas` y un cuarto argumento de `cancelar` se ignoran, como hace hoy el CLI.
7. `canceladas` lista solo las canceladas (estado `cancelled`), no las anuladas (`voided`): el producto las distingue (Cancelación frente a Anulación). `anular` no cambia y no lleva motivo.
8. Las reservas viven en memoria (operations.md) y cada ejecución del CLI empieza de cero: `canceladas` solo ve lo cancelado en el mismo proceso. Se prueba por `run()`, como los tests actuales; en el uso real desde la terminal el listado saldrá vacío hasta que haya persistencia. No la añado: sale del alcance.
9. El motivo se compara exacto y en minúsculas: `Otro` u `OTRO` no son válidos. El campo de la reserva se llama `reason`.
10. Capacidad nueva `booking-cancellation` (inglés kebab-case, regla 1 de `capability-template.md`): hoy no hay `capabilities/`. Solo `ADDED`, porque no hay requisito vigente que sustituir.
11. Siembra de los tests: `bookings` es un módulo global con una sola reserva (Norte lun) y no hay comando que cree otras (`reservar` devuelve un literal). Exporto `resetBookings(list)` en `src/app.js`, solo para los tests, que restablece las reservas con copias de los objetos de la lista; sin argumento, de una plantilla inicial (`{room:'Norte', day:'lun', slot:'10:00-12:00', status:'active'}`) que nunca se muta, para que el reset sea real; cada elemento tiene la forma `{room, day, slot, status}` y `reason` solo lo pone `cancelBooking`. Cada test la llama en `beforeEach`. Es una función de prueba en código de producción: la alternativa, exportar `bookings`, expone el array mutable.
12. La regla de las 24 h de «Cancelación» (PRODUCT.md) no está implementada hoy y no entra: la spec no la añade.
13. Dos tasks, sin partir la feature (Task 1: cancelar con motivo; Task 2: listado). Dos tests existentes de `test/cancel.test.js` cambian de firma en la Task 1.
14. Validación por el dev-lead, no por el agente.
15. Repaso de coherencia: `sdd capability merge` sobre una copia de `.docs/sdd` → rc=0, 6 requisitos y 5 reglas añadidos en `booking-cancellation.md`; `git grep` de `cancelar`/`cancelad`/`0010` fuera de la spec: solo `src/app.js`, `test/cancel.test.js`, `ROADMAP.md:7` y el histórico de `CHANGELOG.md:20` (todo en la tabla). Contrato: `cancelBooking` es un export; `git grep cancelBooking` → solo `src/app.js` (definición y `run`), ningún test ni otro módulo lo importa; su firma pasa a `(room, day, reason)` y la reserva gana el campo `reason`; exports nuevos: `cancelledBookings`, `resetBookings`.
- Política de modelos: revisor de la spec — uno, `sonnet` (`sdd-kit:effort-medium`) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura no (sin módulo ni dependencia nuevos) · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` (3) — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario.

### Hallazgos de la review

- **Aceptado** — Crítico: los escenarios no se pueden montar con `run()` (una sola reserva, sin comando que cree otras) → decisión 11 (`resetBookings(list)`), Scope y Task 1; los GIVEN usan reservas sembradas.
- **Aceptado (2.ª ronda)** — Crítico: recuento de requisitos del repaso (4 → 6), reset sin copia profunda (decisión 11: plantilla inmutable y copias; test «cancelar, resetear y Norte lun vuelve a estar activa» en Task 1), forma de los elementos sembrados (`{room, day, slot, status}`; el listado siembra activas y las cancela por `run`/`anular`).
- **Aceptado (2.ª ronda)** — Importante: `cancelar` sin motivo y con motivo no válido en escenarios propios; escenario de argumentos sobrantes; cambio de comportamiento sin capacidad vigente declarado en Capacidades; aprobación delegada pendiente de esta versión (se registra en Aprobaciones). Menor: `node --test` actual ya importa `app.js` sin salida (los tests existentes lo hacen), sin cambio.
- **Aceptado** — Crítico: estado global compartido, «sin canceladas» dependía del orden → `beforeEach(resetBookings)` y aserciones exactas; «por inclusión» eliminado de «Dónde se prueba».
- **Aceptado** — Intent promete consultar y desde terminal sale vacío → Intent y éxito acotados al mismo proceso; persistencia sigue fuera (decisión 8).
- **Aceptado** — contrato `cancelBooking` sin grep → decisión 15 con el `git grep`.
- **Aceptado** — spec aprobada antes de la review → bloque de review lo dice; la aprobación cubre la spec con los hallazgos.
- **Aceptado** — decisiones sin listar (mayúsculas, argumentos sobrantes, orden, `reason`) → decisiones 6 y 9, y un escenario de mayúsculas.
- **Aceptado** — escenario «sin reserva» ya pasa hoy; regla de 24 h → marcado como preservado; 24 h fuera (decisión 12).
- **Aceptado** — AND mezclado del escenario 2 → separado en su propio escenario.
- **Aceptado** — volatilidad de `reason` en «Dónde viven los datos» y porqué «Regla ante conflicto» no aplica.
- **Aceptado** — afirmaciones del repaso sin resultado → decisión 15 con el literal; la entrada de CHANGELOG: «Motivo al cancelar una reserva (`salas cancelar <sala> <día> <motivo>`) y listado `salas canceladas`.»

### Decisiones tomadas con el dev-lead

- Spec aprobada por delegación el 2026-11-12 — «Apruebo la spec por delegación; cuando tengas el commit de la Task 1, para.»
- Parada tras el commit de la Task 1 — «cuando tengas el commit de la Task 1, para.»
- Motivos de la lista — «de una lista: cambio de planes, sala ocupada, otro».
- El listado de canceladas enseña el motivo — fila 0010 del roadmap: «el listado de canceladas lo enseña».

## Intent

Hoy se cancela una reserva sin dejar rastro de por qué. Se quiere que cancelar pida un motivo de una lista cerrada y que se pueda consultar. Éxito: toda reserva cancelada tiene un motivo de la lista y `canceladas` lo muestra dentro del mismo proceso (la persistencia entre ejecuciones no entra). Fracaso, aunque funcione técnicamente: que se pueda cancelar sin motivo, o que el listado incluya anuladas.

## Scope

- Entra: `cancelar <sala> <día> <motivo>` con motivo obligatorio de la lista; aviso con motivo ausente o no válido; comando `canceladas`; `resetBookings(list)` para sembrar los tests; actualizar los dos tests de `test/cancel.test.js`.
- Entra: entrada en `CHANGELOG.md` (`Unreleased` → `Added`) al cerrar.
- No entra: motivo en `anular`; persistencia entre ejecuciones; motivos nuevos o editables; texto libre en «otro»; filtros del listado.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `cancelar <sala> <día>` sin motivo deja de cancelar | `src/app.js:13-18,30`, `test/cancel.test.js:5-11` | Scope y decisión 2: los dos tests pasan a la forma con motivo (Task 1) |
| Salida `cancelada Norte lun` → `cancelada Norte lun · <motivo>` | `test/cancel.test.js:6` | decisión 5 · Task 1 |
| Cancelar reserva propia (0.3.0) | `CHANGELOG.md:20` (histórico) | se queda: es historia de una versión publicada |

- Filas que implementa: 0010 → `ROADMAP.md:7` (su fila; el cierre la marca ✅) | comprobado con `git grep -n "0010"`: solo esa fila.

## Approach

- A. Tercer argumento posicional `cancelar <sala> <día> <motivo>` — una línea en `run`, consistente con los otros comandos, que ya son posicionales (`libres <franja>`, `anular <sala> <día>`); obliga a conocer los valores.
- B. Opción `--motivo=<valor>` — más legible, pero el CLI solo usa `--cada-semana` como bandera y no tiene parseo de opciones con valor: habría que escribirlo.
- C. Diálogo interactivo que pregunta el motivo — rompe el uso por línea de comandos y es difícil de probar.
- Elegido: A — la menor superficie nueva y la línea que el CLI ya usa. Tradeoff: sin lista a la vista; el aviso de motivo no válido las enumera.

Partes que fija A: una constante `cancelReasons` con los tres valores (clave kebab-case → texto con espacios) en `src/app.js`; `cancelBooking(room, day, reason)` valida el motivo antes de buscar y guarda `reason` en la reserva; `cancelledBookings()` devuelve el texto de `canceladas`; `run` enruta `canceladas`.

## Dónde se prueba

- Cancelar con motivo, motivo ausente o no válido: por `run('cancelar', …)`, como `test/cancel.test.js`.
- `canceladas`: por `run('canceladas', [])`, tras cancelar en el mismo proceso, en `test/cancel.test.js`. Las reservas son un módulo global: cada test siembra con `resetBookings([...])` en `beforeEach` y las aserciones son exactas.

## Términos y ADR

- Términos resueltos: Cancelación frente a Anulación (PRODUCT.md): `canceladas` solo lista cancelaciones. La definición de PRODUCT.md añade «antes de 24 h»; esa regla no está implementada y no entra (decisión 12).
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-cancellation`

#### ADDED — Cancelar una reserva exige un motivo de la lista

- GIVEN reserva activa Norte lun
- WHEN `cancelar Norte lun sala-ocupada`
- THEN responde `cancelada Norte lun · sala ocupada` y la reserva queda cancelada con ese motivo
- AND los motivos admitidos son `cambio-de-planes`, `sala-ocupada` y `otro` (se muestran como `cambio de planes`, `sala ocupada`, `otro`)

#### ADDED — Un motivo ausente o no válido no cancela nada

- GIVEN reserva activa Norte lun
- WHEN `cancelar Norte lun` (sin motivo)
- THEN responde `motivo no válido: usa cambio-de-planes, sala-ocupada u otro` y la reserva sigue activa

#### ADDED — Un motivo fuera de la lista no cancela nada

- GIVEN reserva activa Norte lun
- WHEN `cancelar Norte lun vacaciones` o `cancelar Norte lun Otro` (mayúscula)
- THEN responde `motivo no válido: usa cambio-de-planes, sala-ocupada u otro` y la reserva sigue activa
- AND `cancelar Norte lun otro extra` después responde `cancelada Norte lun · otro` (el argumento sobrante se ignora)

#### ADDED — El motivo se valida antes de buscar la reserva

- GIVEN sin reserva Sur mar
- WHEN `cancelar Sur mar vacaciones`
- THEN responde el aviso de motivo no válido, no `sin reserva Sur mar`

#### ADDED — Cancelar sin reserva sigue avisando (comportamiento preservado)

- GIVEN sin reserva Sur mar
- WHEN `cancelar Sur mar otro`
- THEN responde `sin reserva Sur mar`

#### ADDED — El listado de canceladas enseña el motivo

- GIVEN reservas activas sembradas Norte lun, Sur mar y Norte mié; se cancelan con `cancelar Norte lun sala-ocupada` y `cancelar Sur mar cambio-de-planes`, y se anula Norte mié con `anular Norte mié`
- WHEN `canceladas`
- THEN responde dos líneas: `Norte lun · sala ocupada` y `Sur mar · cambio de planes`, sin la anulada
- AND sin ninguna cancelada responde `sin canceladas`
- Se valida en: la prueba, por `run()` en el mismo proceso (las reservas viven en memoria)

#### Reglas de la capacidad — booking-cancellation

- **Dónde viven los datos**: en memoria, en la propia reserva (`reason`), como el resto: se pierde al terminar el proceso.
- **Idioma de los nombres**: castellano en la salida; valores de entrada en kebab-case.
- **Límites**: tres motivos; sin texto libre.
- **Avisos**: `motivo no válido: usa cambio-de-planes, sala-ocupada u otro`.
- **Regla ante conflicto**: no aplica: un solo origen del dato (la reserva).

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Fixture | 2026-11-12 | aprobada por delegación: «Apruebo la spec por delegación; cuando tengas el commit de la Task 1, para.» |
