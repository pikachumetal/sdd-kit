---
id: 20261112-212159-feature-0010-cancel-reason
feature: 0010
title: Motivo al cancelar una reserva
mode: full
status: approved
created: 2026-11-12
author: Fixture
approvers:
  - name: Fixture
    approved_at: 2026-11-12
---

# Spec — Motivo al cancelar una reserva

🦆 Hoy `cancelar Norte lun` anula la reserva sin más. Con esto, al cancelar hay que elegir un motivo de una lista cerrada: `cancelar Norte lun sala-ocupada` responde `cancelada Norte lun (motivo: sala-ocupada)`, y un comando nuevo `canceladas` enseña cada cancelación con su motivo (`Norte lun 10:00-12:00 · sala-ocupada`). Sin motivo, o con uno que no está en la lista, no se cancela nada y se dice cuáles valen. Por dentro, `cancelBooking` recibe el motivo y lo guarda en la reserva.

Validación: dev-lead — es lo que usa una persona desde la terminal; ve los textos de `cancelar` ejecutándolos. El listado `canceladas` no se puede ver desde la terminal (las reservas viven en memoria, decisión 9): lo validan los tests y una ejecución de `run` en un script de una línea.

## Capacidades

- Nuevas: `cancellations` — la cancelación de reservas por el propio cliente: motivo obligatorio de una lista y listado de canceladas.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor con los siete puntos — señales: capacidad nueva (`cancellations`), datos nuevos (campo `reason` en la reserva) · tamaño: ~40 líneas en 3 ficheros
- Único (sonnet): si el orden «motivo antes que reserva» del requisito «El motivo se comprueba antes que la reserva» no contradice «sin reserva» ni el listado, y si el lugar donde viven los datos (memoria) deja observable `canceladas` (señal: datos nuevos)
- Mínimo razonable: es ya un solo revisor — deja sin mirar una segunda lente de dominio, que aquí aportaría poco porque no hay roles ni estados nuevos

1. Capacidad nueva `cancellations` (slug en inglés, contenido en castellano): hoy no hay ninguna en `capabilities/` y la cancelación es un sustantivo del dominio (PRODUCT.md «Cancelación»).
2. El motivo es obligatorio, tercer argumento posicional: `cancelar <sala> <día> <motivo>`. Enfoque: A frente a B y C (ver Approach).
3. Valores de la lista, en kebab-case castellano: `cambio-de-planes`, `sala-ocupada`, `otro` (los tres nombres son los tuyos; el formato kebab, mío, para no tener que entrecomillar en la terminal).
4. Sin motivo: `falta el motivo: elige cambio-de-planes, sala-ocupada u otro`. Con un motivo fuera de la lista: `motivo no válido «vacaciones»: elige cambio-de-planes, sala-ocupada u otro`. En ambos casos no se cancela nada.
5. El motivo se comprueba antes que la reserva: `cancelar Sur mar` sin reserva y sin motivo responde `falta el motivo…`, no `sin reserva Sur mar`.
6. Éxito: `cancelada Norte lun (motivo: sala-ocupada)`; conserva el prefijo `cancelada <sala> <día>` de hoy.
7. El listado de canceladas **no existe hoy en el código** aunque la fila 0010 del roadmap lo da por hecho: lo creo, como comando `canceladas`, una línea por cancelación en orden de cancelación: `<sala> <día> <franja> · <motivo>`; sin ninguna: `sin canceladas`.
8. Las anuladas (`anular`, del responsable de sala) no llevan motivo ni salen en `canceladas`: es otro estado (PRODUCT.md «Anulación») y su motivo, si lo hay, es de la fila 0011.
9. Las reservas viven en memoria (operations.md), así que `canceladas` solo ve las cancelaciones del mismo proceso: desde la terminal, `node src/app.js canceladas` en una invocación aparte siempre dirá `sin canceladas`. No lo arreglo aquí: persistir reservas es otra feature. Lo ves en los tests, que llaman a `run` en el mismo proceso.
10. `app.js` exporta `bookings` para que los tests siembren reservas (hoy solo existe `Norte lun` y no hay forma de crear otra con `run`; ver plan).
11. Política de modelos: revisor de la spec: uno, sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno (Native) · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario.

12. Coherencia: `sdd capability merge` sobre una copia fusiona los 4 requisitos y las 5 reglas de `cancellations` sin rechazos; `git grep -n 0010 -- . ':!.docs/sdd/changes' ':!.docs/sdd/specs'` no encuentra más sitio que `ROADMAP.md:7`.
13. `cancellations` nace con la línea base de la 0.3.0 más este cambio: no hay `capabilities/` previo que modificar, así que todo va como ADDED; la forma de dos argumentos de la 0.3.0 queda retirada (ver la tabla de arriba).
14. La regla de las 24 h de PRODUCT.md («Cancelación») hoy no se aplica en el código y sigue sin aplicarse: es deuda anterior a esta feature, que no la empeora; la dejo fuera para no meter una regla de tiempo sin que nadie la pidiera.
15. Casos de entrada no pedidos, resueltos así: motivo vacío (`""`) cuenta como sin motivo; argumentos de más se ignoran (`cancelar Norte lun sala ocupada` toma `sala` como motivo y responde `motivo no válido «sala»…`); `cancelar` sin sala ni día responde `falta el motivo…` por la decisión 5 (hoy responde `sin reserva undefined undefined`; no lo trato más allá). La forma de dos argumentos de la 0.3.0 es un cambio incompatible: irá en `### Changed` del changelog al cortar la release.
16. El orden de `canceladas` es el de la lista de reservas, no el instante de cancelación (no guardo marca de tiempo; nadie la pidió).

### Hallazgos de la review

Revisor único (sonnet), una ronda y una segunda tras el Crítico aceptado.

- **Aceptado** — Crítico: el `git grep` se encontraba a sí mismo en `.docs/sdd/changes/` → el comando excluye también `changes` (decisión 12 y tabla de «retira»).
- **Aceptado** — Importante: `cancellations` sin línea base es un MODIFIED encubierto → decisión 13.
- **Aceptado** — Importante: «orden de cancelación» no lo da el Approach → decisión 16 y requisito del listado dicen «orden de la lista de reservas».
- **Aceptado** — Importante: el Scope no cubre `bookings` exportado, tests nuevos ni estado compartido → Scope y plan.
- **Aceptado** — Importante: la regla de 24 h no estaba en ✋ → decisión 14.
- **Aceptado** — Importante: escenarios mezclados y entradas sin especificar → «Sin motivo válido» se parte en dos y la decisión 15 fija los casos.
- **Aceptado** — Menor: sin escenario con cancelada y anulada a la vez → añadido.
- **Aceptado** — Menor: el dev-lead no ve el listado desde la terminal → «Validación» lo dice.
Segunda ronda:

- **Aceptado** — Importante: «`cancelar` sin argumentos como hoy» era falso → decisión 15.
- **Aceptado** — Importante: motivo vacío y argumentos de más sin escenario → escenarios añadidos a «Sin motivo válido no se cancela».
- **Aceptado** — Importante: falta el caso motivo inválido sin reserva → añadido a «El motivo se comprueba antes que la reserva».
- **Aceptado** — Menor: `sala ocupada` (el fracaso del Intent) sin escenario → añadido, con la decisión 15.
- **Aceptado** — Importante: cómo se reinicia `bookings` → Scope: se vacía el mismo array y se siembra explícitamente en cada test; los escenarios «no hay reserva `Sur mar`» no dependen de la semilla.
- **Aceptado** — Menor: separador de `canceladas` → THEN dice `\n`.
- **Aceptado** — Menor: «4 ficheros» → 3.
- **Aceptado** — Menor: cambio incompatible en el changelog → decisión 15.
- **Rechazado** — Menor: documentar los comandos en README u `operations.md` → ninguno de los dos lista los comandos hoy (solo el arranque); añadirlos es otra cosa.
- **Rechazado** — Menor: fragilidad del `git grep` tras archivar → la decisión 12 lo da como comprobación del momento de la spec.

Primera ronda:

- **Rechazado** — Menor: «Motivo» como término nuevo de PRODUCT.md → es una palabra común usada igual en «Anulación»; no define nada que haya que desambiguar.
- **Rechazado** — Menor: formato de `canceladas` en las reglas → ya está en el requisito, que es donde se prueba; las reglas solo recogen límites y avisos.

### Decisiones tomadas con el dev-lead

- La spec se aprueba por delegación — «Apruebo la spec por delegación»
- Se para al tener el commit de la Task 1 — «cuando tengas el commit de la Task 1, para»
- Motivos de la lista — «cambio de planes, sala ocupada, otro»

## Intent

Hoy una cancelación no deja rastro de por qué se hizo. Se quiere que cancelar exija un motivo de una lista corta y que el listado de canceladas lo muestre. Éxito: ninguna reserva cancelada queda sin motivo, y `canceladas` enseña cada una con el suyo. Fracaso aunque «funcione»: que un motivo escrito a mano libre o con una errata (`sala ocupada`, `vacaciones`) se acepte y ensucie el listado.

## Scope

- Entra: `cancelar` con motivo obligatorio y validado; guardar el motivo en la reserva; comando `canceladas`; exportar `bookings` desde `src/app.js` para sembrar reservas en los tests (decisión 10); los dos tests de `test/cancel.test.js`, adaptados al argumento nuevo, y los tests nuevos de los escenarios, que antes de cada uno vacían el mismo array `bookings` y siembran explícitamente las reservas que necesitan (ningún escenario depende de la semilla `Norte lun` de `app.js`). Ficheros: `src/app.js`, `test/cancel.test.js` y uno nuevo, `test/cancelled-list.test.js`.
- No entra: persistir las reservas entre invocaciones; la regla de las 24 h de la cancelación (hoy no se aplica y sigue sin aplicarse); `anular` y sus motivos (fila 0011); cualquier otro motivo o motivos configurables; mostrar el motivo en `libres`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `cancelar <sala> <día>` sin motivo deja de cancelar | `src/app.js:30`, `src/app.js:13` (`cancelBooking(room, day)`), `test/cancel.test.js:5-10` | Scope y decisiones 2, 4 y 5; los dos tests pasan a llevar motivo |
| Respuesta `cancelada <sala> <día>` | `src/app.js:17`, `test/cancel.test.js:6` | decisión 6 (conserva el prefijo y añade el motivo); el test se actualiza |
| Entrada «Cancelar una reserva propia.» de la 0.3.0 | `CHANGELOG.md:20` | se queda: es historia de una versión ya entregada; la 0010 entra en `[Unreleased]` al cortar la release |

- Filas que implementa: 0010 → `ROADMAP.md:7` (la fila se marca ✅ al cerrar) | nada más la nombra: comprobado con `git grep -n 0010 -- . ':!.docs/sdd/changes' ':!.docs/sdd/specs'`.

## Approach

- A. Motivo como tercer argumento posicional, validado en `cancelBooking(room, day, reason)` contra una constante `CANCEL_REASONS` — una función y una constante en `src/app.js`; consistente con `cancelar <sala> <día>`. Cuesta romper la forma de dos argumentos de hoy, que es lo que se pide.
- B. Opción `--motivo <valor>`, como `--cada-semana` en `reservar` — obligaría a analizar flags en `run`, que hoy solo hace `params.includes`, para un argumento que no es opcional.
- C. Preguntar el motivo de forma interactiva — la CLI es de una sola invocación y los tests llaman a `run`; no se puede probar ni encadenar.
- Elegido: A — es lo más pequeño que da una lista cerrada y se prueba por `run`, como los tests de hoy.

`cancelBooking` valida primero el motivo, luego busca la reserva, y guarda `reason` en ella al cancelar. `canceladas` filtra las reservas con estado `cancelled`.

## Dónde se prueba

- Motivo obligatorio y validado, y orden «motivo antes que reserva»: por `run('cancelar', …)`, como los tests actuales de `test/cancel.test.js`.
- Listado `canceladas`: por `run('canceladas', [])` en el mismo proceso, tras cancelar; una reserva anulada no aparece.
- La sala sigue ocupada si no se canceló: `run('libres', ['10:00-12:00'])`, como `test/app.test.js`.

## Términos y ADR

- Términos resueltos: ninguno nuevo («Cancelación» y «Anulación» ya definidos en PRODUCT.md; aquí solo `cancelar` lleva motivo).
- ADR candidatas: ninguna.

## Delta de comportamiento

### Capacidad: `cancellations`

#### ADDED — Cancelar exige un motivo de la lista

- GIVEN la reserva activa `Norte lun 10:00-12:00`
- WHEN se ejecuta `cancelar Norte lun sala-ocupada`
- THEN responde `cancelada Norte lun (motivo: sala-ocupada)`
- AND `libres 10:00-12:00` pasa a responder `Norte, Sur`

#### ADDED — Sin motivo válido no se cancela

- GIVEN la reserva activa `Norte lun 10:00-12:00`
- WHEN se ejecuta `cancelar Norte lun`
- THEN responde `falta el motivo: elige cambio-de-planes, sala-ocupada u otro`
- AND la reserva sigue activa: `libres 10:00-12:00` responde `Sur`
- GIVEN la reserva activa `Norte lun 10:00-12:00`
- WHEN se ejecuta `cancelar Norte lun vacaciones`
- THEN responde `motivo no válido «vacaciones»: elige cambio-de-planes, sala-ocupada u otro`
- AND la reserva sigue activa: `libres 10:00-12:00` responde `Sur`
- GIVEN la reserva activa `Norte lun 10:00-12:00`
- WHEN se ejecuta `cancelar Norte lun sala ocupada` (dos palabras: el motivo es `sala`, el resto se ignora)
- THEN responde `motivo no válido «sala»: elige cambio-de-planes, sala-ocupada u otro`
- GIVEN la reserva activa `Norte lun 10:00-12:00`
- WHEN se ejecuta `cancelar Norte lun ""` (motivo vacío)
- THEN responde `falta el motivo: elige cambio-de-planes, sala-ocupada u otro`
- GIVEN la reserva activa `Norte lun 10:00-12:00`
- WHEN se ejecuta `cancelar Norte lun otro extra`
- THEN responde `cancelada Norte lun (motivo: otro)`

#### ADDED — El motivo se comprueba antes que la reserva

- GIVEN no hay reserva activa `Sur mar`
- WHEN se ejecuta `cancelar Sur mar`
- THEN responde `falta el motivo: elige cambio-de-planes, sala-ocupada u otro`
- WHEN se ejecuta `cancelar Sur mar vacaciones`
- THEN responde `motivo no válido «vacaciones»: elige cambio-de-planes, sala-ocupada u otro`
- WHEN se ejecuta `cancelar Sur mar otro`
- THEN responde `sin reserva Sur mar`

#### ADDED — El listado de canceladas enseña el motivo

- GIVEN las reservas `Norte lun 10:00-12:00` y `Sur mar 09:00-10:00`, en ese orden en la lista de reservas, y se cancelan primero `Sur mar` con `otro` y después `Norte lun` con `sala-ocupada`
- WHEN se ejecuta `canceladas`
- THEN responde dos líneas unidas con `\n`, en el orden de la lista de reservas: `Norte lun 10:00-12:00 · sala-ocupada` y `Sur mar 09:00-10:00 · otro`
- GIVEN ninguna reserva cancelada, y `Norte lun 10:00-12:00` anulada con `anular Norte lun`
- WHEN se ejecuta `canceladas`
- THEN responde `sin canceladas`
- GIVEN `Norte lun 10:00-12:00` anulada con `anular Norte lun` y `Sur mar 09:00-10:00` cancelada con `otro`
- WHEN se ejecuta `canceladas`
- THEN responde solo `Sur mar 09:00-10:00 · otro`

#### Reglas de la capacidad — cancellations

- **Dónde viven los datos**: en memoria del proceso, en la propia reserva (`reason`); no se guarda entre invocaciones.
- **Idioma de los nombres**: motivos en kebab-case castellano (`cambio-de-planes`, `sala-ocupada`, `otro`); avisos en castellano.
- **Límites**: lista cerrada de tres motivos; ningún otro valor se acepta.
- **Avisos**: `falta el motivo: elige cambio-de-planes, sala-ocupada u otro` y `motivo no válido «<valor>»: elige cambio-de-planes, sala-ocupada u otro`.
- **Regla ante conflicto**: el motivo se comprueba antes que la existencia de la reserva.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Fixture | 2026-11-12 | aprobada por delegación: «Apruebo la spec por delegación» |
