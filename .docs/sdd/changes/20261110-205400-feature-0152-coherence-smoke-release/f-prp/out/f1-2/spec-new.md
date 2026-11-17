---
id: 20261112-125901-feature-0010-motivo-cancelar
feature: 0010
title: Motivo al cancelar una reserva
mode: full
profile: delegate
status: approved
created: 2026-11-12
author: Fixture
approvers:
  - name: Fixture
    approved_at: 2026-11-12
---

# Spec — Motivo al cancelar una reserva

🦆 Hoy `cancelar Norte lun` anula la reserva sin más. Después de esto hay que decir por qué: `cancelar Norte lun --motivo sala-ocupada` responde `cancelada Norte lun (motivo: sala ocupada)`. Los motivos posibles son tres: cambio de planes, sala ocupada y otro; sin motivo, o con uno que no está en la lista, no se cancela y se avisa. Un comando nuevo, `canceladas`, lista las reservas canceladas con su motivo: `Norte lun 10:00-12:00 · sala ocupada`. Por dentro, la reserva guarda el motivo en memoria junto a su estado, como el resto de datos.

Validación: dev-lead — es un comando que usa una persona y lo que responde se ve en la terminal.

## Capacidades

- Nuevas: `booking-cancellation` — cancelar una reserva con motivo de una lista cerrada y listar las canceladas con su motivo.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: contrato público (`cancelar` cambia de forma: ahora exige `--motivo`), capacidad nueva (`booking-cancellation`) · tamaño: ~40 líneas en 3 ficheros
- Dominio (sonnet): si los textos y el orden de comprobación de «Cancelar con motivo» (motivo antes que reserva) son razonables para quien cancela, y si `canceladas` deja fuera las anuladas como pide `PRODUCT.md` (señal: capacidad nueva)
- Técnica (sonnet): si los THEN de «Dónde se prueba» se pueden observar con `run(...)` sobre la memoria compartida del fichero de test, y si el cambio de `cancelar` rompe algo más que `test/cancel.test.js` (señal: contrato público)
- Mínimo razonable: un solo revisor con los siete puntos — deja sin mirar a fondo el estado compartido en memoria entre tests, el hueco que no se ve hasta que un test depende del orden

### Hallazgos de la review

- **Aceptado** — Crítico (dominio): «Términos resueltos» afirma que `canceladas` lista solo las del cliente, pero `cancelar` no distingue autor ni 24 h → «Términos y ADR» y «No entra» dicen que hoy `cancelar` no distingue ni autor ni antelación y que `canceladas` lista lo que sale por `cancelar`, no lo de `anular`.
- **Rechazado** — Crítico (dominio): comprobar primero la reserva y después el motivo → el motivo es validación de la entrada y no depende del estado: el aviso sale igual con o sin reserva y no obliga a mirar nada. Se mantiene la decisión 4 y se añaden los escenarios del caso combinado (sin reserva + sin motivo, sin reserva + motivo inválido), que era lo que faltaba.
- **Aceptado** — Crítico (técnica): tests de `cancelar` dependen del orden por la memoria compartida → «Dónde se prueba» y decisión 12: cada test resiembra `bookings` (`bookings.length = 0` y `push`) con las filas que su GIVEN dice.
- **Aceptado** — Crítico (técnica): «sin canceladas» y la lista con dos líneas en el mismo fichero y el duplicado de Norte lun → mismo cambio: cada test vacía y siembra, con la forma exacta de las filas (decisión 12) y el orden del array para `canceladas`.
- **Aceptado** — Importante (técnica, dominio): cómo se extrae `--motivo`, `--motivo` sin valor, vacío y mayúsculas → decisión 14 y escenarios «sin valor» y «Sala-Ocupada».
- **Aceptado** — Importante (técnica): motivo antes que reserva sin escenario, y sin reserva solo con motivo válido → dos escenarios nuevos en «Cancelar sin reserva lo dice».
- **Aceptado** — Importante (técnica): cancelar una ya cancelada y `anular` sin escenario → escenarios «Cancelar una ya cancelada» y «anular sigue igual».
- **Aceptado** — Importante (técnica): exportar `bookings` no está en Scope ni en la tabla → añadido a «Entra» y a la tabla. Se mantiene el export del array y no un `seed`/`reset`: el test necesita construir filas con forma exacta y un helper nuevo sería más código en producción solo para tests.
- **Aceptado** — Menor: `libres` antes y después con valores exactos, `canceladas` ignora `params`, `canceladas` sin titular, `reason` solo en canceladas, identificadores internos en inglés, texto con espacios frente a avisos con guiones → decisiones 15, 16, 17, 18 y 3.
- **Rechazado** — Crítico (2.ª ronda): «Cancelar una ya cancelada» no distingue ya cancelada de nunca existió → el propio revisor concluye que el escenario lo cubre (el motivo guardado `otro` frente al nuevo `sala-ocupada` hace que sobrescribir `reason` falle el AND); no hay cambio que hacer.
- **Aceptado** — Importante (2.ª ronda): `--motivo ""`, `--motivo` antes de sala y día, repetido y seguido de otra opción sin escenario; `status` literales sin fijar; «sin canceladas» sin «ninguna otra cancelada» → escenarios nuevos con respuesta literal, valores `active`/`cancelled`/`voided` en la decisión 12 y GIVEN completado.
- **Aceptado** — Importante (2.ª ronda): el AND de `libres` supone un formato que esta capacidad no define → se mantiene como comportamiento ya vigente de `libres` (`test/app.test.js`) y se dice en la decisión 19.
- **Aceptado** — Menor (2.ª ronda): «cancelación» sin las 24 h ni autor frente a `PRODUCT.md` → decisión 20. `approvers` y `status` se rellenan al aprobar (abajo). Se deja la lista de decisiones en una sola, como pide la plantilla.
- **Aceptado** — Importante (dominio): «Dónde viven los datos» cita `operations.md` → esa fuente dice «las reservas viven en memoria», que es exactamente lo que se cita; se aclara en la regla que `reason` solo existe en canceladas.

1. Motivo **obligatorio**: la fila 0010 dice «se elige un motivo», así que `cancelar` sin motivo ya no cancela. Es un cambio incompatible para quien tecleaba `cancelar Norte lun`; lo único que lo usa es `test/cancel.test.js`.
2. Forma: opción `--motivo <valor>` tras sala y día, con tres valores en kebab-case: `cambio-de-planes`, `sala-ocupada`, `otro` (sin espacios para teclearlos sin comillas).
3. Textos (literales): éxito `cancelada Norte lun (motivo: sala ocupada)` y listado con el motivo con espacios (para leerlo); los avisos y los valores para teclear, con guiones; falta `falta el motivo: cambio-de-planes, sala-ocupada, otro`; inválido `motivo no válido: lluvia (usa cambio-de-planes, sala-ocupada, otro)`; sin canceladas `sin canceladas`.
4. Orden de comprobación: primero el motivo, después si hay reserva. Así `cancelar Sur mar` sin motivo avisa del motivo y no de que no hay reserva; con motivo válido y sin reserva sigue `sin reserva Sur mar`.
5. Una reserva con motivo inválido o sin motivo **sigue activa**.
6. Nuevo comando `canceladas` (la fila 0010 pide el listado y hoy no existe): una línea por reserva cancelada, `<sala> <día> <franja> · <motivo con espacios>`, en el orden de `bookings`; las anuladas (`anular`) no salen. Sin ninguna, `sin canceladas`. No muestra titular: la reserva hoy no guarda a nombre de quién va.
7. `anular` queda igual: sin motivo (el motivo de la anulación no entra).
8. Capacidad nueva `booking-cancellation`: hoy no hay capacidades, y el comportamiento actual de `cancelar` (`cancelada …`, `sin reserva …`) tampoco está escrito en ninguna; el delta lo recoge como `ADDED`.
9. Enfoque: A, frente a B y C (ver Approach).
10. Política de modelos: revisores de la spec, dominio y técnica en sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura no · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` (3) — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte.
11. Perfil `delegate` del proyecto y método Native (`execution: native` en `sdd-kit.json`).
12. Costura de test: `src/app.js` exporta `bookings` (hoy es privado) y cada test lo vacía y lo siembra con `bookings.length = 0; bookings.push({ room, day, slot, status, reason })` según su GIVEN (`reason` solo en las canceladas), con `status` `'active'`, `'cancelled'` o `'voided'` (los de hoy); de fábrica solo existe Norte lun y `run` no puede crear reservas.
13. Delta probado sobre una copia de `.docs/sdd` en una carpeta temporal: `sdd capability merge` sale 0 y crea `booking-cancellation.md`; el `capabilities/` del repo no cambia. Se vuelve a probar tras la review.
14. Lectura de `--motivo`: valor = el elemento que sigue a `--motivo` en `params` (`params[params.indexOf('--motivo') + 1]`); sala y día son `params[0]` y `params[1]`. Sin `--motivo`, sin valor detrás o con valor vacío cuenta como falta. La comparación con la lista es exacta, sin normalizar mayúsculas.
15. `canceladas` ignora `params`.
16. Los identificadores internos (`REASONS`, `reason`, `cancelledList`, `bookings`) van en inglés, como el código actual; los textos y los valores, en castellano.
17. `reason` existe solo en las reservas canceladas; `anular` no lo escribe.
18. Textos de error y avisos con comparación exacta de los valores de la lista.
19. El formato de `libres` (`Sur`, `Norte, Sur`) es el vigente de `test/app.test.js`; el AND de «Cancelar con motivo» solo lo usa para observar que la reserva ya no está activa.
20. La capacidad usa el nombre «cancelación» sin la regla de 24 h ni la distinción de autor de `PRODUCT.md`; `PRODUCT.md` no cambia en esta feature.
21. `--motivo` seguido de otra opción (`--otra`) se trata como valor: `motivo no válido: --otra (usa …)`. `--motivo` antes de sala y día, o repetido, no está definido: no se promete ni se prueba (se retira de la decisión 14).

### Decisiones tomadas con el dev-lead

- Aprobación de la spec por delegación — «Apruebo la spec por delegación; cuando tengas el commit de la Task 1, para.» (2026-11-12)
- Parada: tras el commit de la Task 1, no antes — «cuando tengas el commit de la Task 1, para.» (2026-11-12)
- Lista de motivos — «cambio de planes, sala ocupada, otro» (2026-11-12)

## Intent

Hoy cancelar una reserva no deja rastro de por qué se cancela. Quien gestiona las salas quiere saber qué motivos se repiten (planes que cambian, sala ocupada…) y para eso hace falta elegirlo al cancelar y poder verlo después. Éxito: toda reserva cancelada desde esta versión tiene uno de los tres motivos y `canceladas` los enseña; fracaso, aunque funcione: que una cancelación sin motivo siga pasando, o que una anulación aparezca como cancelada.

## Scope

- Entra: `cancelar <sala> <día> --motivo <valor>` con la lista cerrada; el aviso sin motivo y con motivo inválido; el comando `canceladas`; exportar `bookings` desde `src/app.js` como costura de test; actualizar `test/cancel.test.js` (las dos pruebas actuales de `cancelar`).
- No entra: motivo en `anular`; texto libre en «otro»; editar el motivo de una cancelada; filtrar `canceladas` por sala o día; mostrar titular; persistencia (las reservas viven en memoria); distinguir quién cancela o la regla de las 24 h de `PRODUCT.md` (no implementada hoy).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `cancelar <sala> <día>` sin motivo deja de cancelar | `src/app.js:30`, `test/cancel.test.js:6`, `test/cancel.test.js:10` | delta, `ADDED` «Cancelar exige un motivo de la lista»; los dos tests se actualizan en la Task 1 |
| salida `cancelada Norte lun` → `cancelada Norte lun (motivo: …)` | `src/app.js:17`, `test/cancel.test.js:6` | delta, `ADDED` «Cancelar con motivo» |
| `bookings` pasa de privado a exportado | `src/app.js:3` | Scope («Entra») y decisión 12, solo como costura de test |
| `Cancelar una reserva propia.` (changelog de 0.3.0) | `CHANGELOG.md:20` | queda: es historia de una versión ya entregada; el cambio entra en `[Unreleased]` al cerrar la release |

- Filas que implementa: 0010 → `ROADMAP.md:7` (la fila ya la nombra; la cierra `sdd-archive`; ningún otro fichero la cita: `git grep -n "0010"` solo da esa línea y esta spec).

## Approach

- A — `cancelBooking(room, day, reason)` valida el motivo y lo guarda en la reserva (`booking.reason`); `run` extrae `--motivo` de `params`; `canceladas` filtra `status === 'cancelled'`. Todo en `src/app.js`, una constante `REASONS` con los tres valores. Barato: sigue la forma actual del fichero.
- B — módulo aparte `src/cancellation.js`. Cuesta un fichero y un contrato entre módulos para ~25 líneas; la arquitectura dice «un solo fichero de entrada».
- C — motivo como tercer argumento posicional (`cancelar Norte lun sala-ocupada`). Más corto, pero un valor suelto es fácil de teclear mal y de mezclar con otros argumentos futuros.
- Elegido: A — la arquitectura fija un solo fichero y A es el cambio más pequeño; `--motivo` se parece a `--cada-semana` de `reservar`.

Fija el enfoque: `REASONS = ['cambio-de-planes', 'sala-ocupada', 'otro']`; el texto de salida pone el motivo con los guiones cambiados por espacios; `canceladas` se implementa como `cancelledList()` en `src/app.js` y se llama desde `run`.

## Dónde se prueba

- Cancelar con motivo, falta, motivo inválido, sin reserva, ya cancelada y `anular`: por `run('cancelar' | 'anular', [...])` en `test/cancel.test.js`, como los tests actuales; cada test siembra `bookings` con su GIVEN (decisión 12), así que no dependen del orden.
- `canceladas`: por `run('canceladas', [])` en `test/cancelled.test.js`, con la misma siembra por test.

## Términos y ADR

- Términos resueltos: **Cancelación** (la reserva que anula el propio cliente) frente a **Anulación** (la que anula el responsable de sala): hoy `cancelar` no distingue autor ni antelación; `canceladas` lista lo que sale por `cancelar`, nunca lo de `anular`.
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-cancellation`

#### ADDED — Cancelar con motivo

- GIVEN la reserva activa Norte lun 10:00-12:00, y `libres 10:00-12:00` responde `Sur`
- WHEN `cancelar Norte lun --motivo sala-ocupada`
- THEN responde `cancelada Norte lun (motivo: sala ocupada)`
- AND `libres 10:00-12:00` responde `Norte, Sur`

#### ADDED — Cancelar exige un motivo de la lista

- GIVEN la reserva activa Norte lun 10:00-12:00
- WHEN `cancelar Norte lun` sin `--motivo`
- THEN responde `falta el motivo: cambio-de-planes, sala-ocupada, otro`
- AND la reserva sigue activa

- GIVEN la reserva activa Norte lun 10:00-12:00
- WHEN `cancelar Norte lun --motivo` con nada detrás
- THEN responde `falta el motivo: cambio-de-planes, sala-ocupada, otro`
- AND la reserva sigue activa

- GIVEN la reserva activa Norte lun 10:00-12:00
- WHEN `cancelar Norte lun --motivo ""` (valor vacío)
- THEN responde `falta el motivo: cambio-de-planes, sala-ocupada, otro`
- AND la reserva sigue activa

- GIVEN la reserva activa Norte lun 10:00-12:00
- WHEN `cancelar Norte lun --motivo --otra`
- THEN responde `motivo no válido: --otra (usa cambio-de-planes, sala-ocupada, otro)`
- AND la reserva sigue activa

- GIVEN la reserva activa Norte lun 10:00-12:00
- WHEN `cancelar Norte lun --motivo lluvia`
- THEN responde `motivo no válido: lluvia (usa cambio-de-planes, sala-ocupada, otro)`
- AND la reserva sigue activa

- GIVEN la reserva activa Norte lun 10:00-12:00
- WHEN `cancelar Norte lun --motivo Sala-Ocupada`
- THEN responde `motivo no válido: Sala-Ocupada (usa cambio-de-planes, sala-ocupada, otro)`
- AND la reserva sigue activa

#### ADDED — Cancelar sin reserva lo dice

- GIVEN no hay reserva activa de Sur el martes
- WHEN `cancelar Sur mar --motivo otro`
- THEN responde `sin reserva Sur mar`

- GIVEN no hay reserva activa de Sur el martes
- WHEN `cancelar Sur mar` sin `--motivo`
- THEN responde `falta el motivo: cambio-de-planes, sala-ocupada, otro`

- GIVEN no hay reserva activa de Sur el martes
- WHEN `cancelar Sur mar --motivo lluvia`
- THEN responde `motivo no válido: lluvia (usa cambio-de-planes, sala-ocupada, otro)`

#### ADDED — Cancelar una ya cancelada

- GIVEN Norte lun 10:00-12:00 cancelada con `otro`
- WHEN `cancelar Norte lun --motivo sala-ocupada`
- THEN responde `sin reserva Norte lun`
- AND `canceladas` sigue enseñando `Norte lun 10:00-12:00 · otro`

#### ADDED — Anular sigue igual

- GIVEN la reserva activa Norte lun 10:00-12:00 y ninguna otra cancelada
- WHEN `anular Norte lun`
- THEN responde `anulada Norte lun`
- AND `canceladas` responde `sin canceladas`

#### ADDED — Listar las canceladas con su motivo

- GIVEN Norte lun 10:00-12:00 cancelada con `cambio-de-planes`, Sur mar 14:00-15:00 cancelada con `otro` y Sur jue 10:00-12:00 anulada
- WHEN `canceladas`
- THEN responde dos líneas, en el orden en que se reservaron: `Norte lun 10:00-12:00 · cambio de planes` y `Sur mar 14:00-15:00 · otro`
- AND la anulada no sale

- GIVEN ninguna reserva cancelada
- WHEN `canceladas`
- THEN responde `sin canceladas`

#### Reglas de la capacidad — `booking-cancellation`

- **Dónde viven los datos**: en memoria, en la propia reserva, como el resto de reservas (`operations.md`: «las reservas viven en memoria»); `reason` solo existe en las canceladas.
- **Idioma de los nombres**: castellano en los textos, el comando, la opción y los valores del motivo (kebab-case); los identificadores internos, en inglés como el código actual.
- **Límites**: tres motivos, lista cerrada; sin texto libre; comparación exacta, sin normalizar mayúsculas.
- **Avisos**: `falta el motivo: …` y `motivo no válido: … (usa …)`.
- **Regla ante conflicto**: no aplica; cancelar una reserva ya cancelada da `sin reserva …`, porque solo se cancelan las activas.

## Enmiendas

_Ninguna._

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Fixture | 2026-11-12 | aprobada por delegación: «Apruebo la spec por delegación; cuando tengas el commit de la Task 1, para.» |
