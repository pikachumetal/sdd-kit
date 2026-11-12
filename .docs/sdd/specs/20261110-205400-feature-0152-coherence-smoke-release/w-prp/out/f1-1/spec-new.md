---
id: 20261112-211624-feature-0010-motivo-cancelar
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

🦆 Hoy `cancelar Norte lun` anula la reserva sin más. Con esto hay que decir por qué: `cancelar Norte lun sala-ocupada` la cancela y guarda «sala ocupada». Un comando nuevo, `canceladas`, lista las canceladas con su motivo: `Norte lun 10:00-12:00 · sala ocupada`. Sin motivo, o con uno que no está en la lista (cambio de planes, sala ocupada, otro), no se cancela nada y se avisa de cuáles valen. Por dentro, la reserva guarda un campo `reason` al cancelarse.

Validación: dev-lead — es un comando que usa una persona y lo que ve es texto de terminal.

## Capacidades

- Nuevas: `booking-cancellation` — cancelar una reserva con motivo de una lista y listar las canceladas con su motivo.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`booking-cancellation`), contrato público (la forma del comando `cancelar` cambia y aparece `canceladas`) · tamaño: ~40 líneas en 4 ficheros
- Dominio (sonnet): si el motivo obligatorio contradice la terminología de `PRODUCT.md` (Cancelación frente a Anulación) y si los THEN fijan qué pasa con las anuladas en `canceladas` (señal: capacidad nueva)
- Técnica (sonnet): si el cambio de la forma de `cancelar` rompe algo que lo llama y si cada THEN lo observa un test por `run(...)` (señal: contrato público)
- Mínimo razonable: un revisor con los siete puntos — deja sin mirar la segunda lente sobre el contrato de la línea de comandos

1. Enfoque: un campo `reason` en la reserva y el motivo como tercer argumento posicional de `cancelar`, frente a un flag `--motivo` o a una pregunta interactiva (ver Approach).
2. Lista de motivos: `cambio-de-planes`, `sala-ocupada`, `otro` — los tres que dijiste; el argumento va en kebab-case sin espacios porque la línea de comandos separa por espacios.
3. El motivo es obligatorio: sin él no se cancela. Alternativa descartada: `otro` por defecto, porque dejaría la lista sin efecto.
4. Textos: `cancelada Norte lun (cambio de planes)`; `falta el motivo: elige cambio-de-planes, sala-ocupada u otro`; `motivo no válido «vacaciones»: elige cambio-de-planes, sala-ocupada u otro`.
5. Se valida el motivo antes de buscar la reserva: `cancelar Sur mar` sin motivo da el error de motivo, no `sin reserva Sur mar`.
6. «El listado de canceladas» no existe hoy: lo creo como comando `canceladas`, una línea por reserva: `Norte lun 10:00-12:00 · cambio de planes`; sin ninguna, `sin canceladas`. No lista las anuladas (`voided`): las anula el responsable de sala y no llevan motivo.
7. Se actualizan los dos tests existentes de `test/cancel.test.js` (`cancelar una reserva activa`, `cancelar sin reserva lo dice`) a la forma nueva: la forma de dos argumentos deja de cancelar (lo fija «El motivo es obligatorio»).
8. Capacidad nueva `booking-cancellation` (no existía ninguna en `capabilities/`); el comportamiento de `cancelar` de antes no estaba escrito en ninguna, por eso es `ADDED`, no `MODIFIED`. Nombre en inglés kebab-case por la regla de capacidades; los textos de la interfaz, en castellano (constitución, art. 4); los identificadores del código siguen los que ya hay (`cancelBooking`, `room`).
9. Sin `§Frontend`: es una terminal, `operations.md` dice `sin login` y no hay pantalla que capturar.
10. Resultado de `sdd capability merge` sobre una copia de `.docs/sdd`: añadió los 6 requisitos iniciales a `booking-cancellation.md` sin rechazos (repetir tras esta revisión en el cierre).
11. Reglas de la capacidad: la coincidencia del motivo es exacta y en minúsculas (`Otro` no vale); los argumentos de más se ignoran (`cancelar Norte lun otro extra` cancela con `otro`); `canceladas` ignora sus argumentos; no hay roles (`sin login`): cualquiera cancela y lista; el plazo de 24 h de `PRODUCT.md` no se aplica hoy ni lo toca esta feature; el listado sale en el orden de las reservas en memoria.
12. Cancelar una reserva ya cancelada o anulada responde `sin reserva <sala> <día>` y no toca su motivo: solo se cancelan las activas, como hoy.
13. Revisión: rechazo un escenario con varias canceladas porque hoy solo existe una reserva en memoria (`Norte lun`) y no se puede observar por `run(...)`; cada motivo de la lista se cubre con un escenario propio.
14. Aislamiento de tests: las reservas viven en el módulo y los tests las mutan; el plan decide cómo se reinician (`resetBookings` exportada para tests).
- Política de modelos: dos revisores de la spec en sonnet, en paralelo · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo

### Hallazgos de la review

- **Aceptado** — el AND del motivo guardado no se observaba por `run` → ahora se observa con `canceladas`
- **Aceptado** — validar antes de buscar no tenía escenario → «El motivo se valida antes de buscar la reserva»
- **Aceptado** — cancelar una ya cancelada o anulada sin decir → escenario y decisión 12
- **Aceptado** — listado solo con un motivo y título que prometía «ni activas» → escenario por motivo y AND con la activa
- **Aceptado** — reglas de mayúsculas, argumentos de más, roles y plazo de 24 h sin declarar → decisión 11 y «Reglas de la capacidad»
- **Aceptado** — decisión 7 nombraba un test y la tabla dos; aislamiento de tests → decisiones 7 y 14
- **Aceptado** — el Intent atribuía el motivo al responsable de sala → reformulado
- **Rechazado** — escenario con varias canceladas y su orden → decisión 13: hoy solo existe una reserva en memoria
- **Rechazado** — renombrar la capacidad a castellano por el _Evitar_ de `PRODUCT.md` → decisión 8: el nombre de capacidad en inglés lo fija la regla del kit

### Decisiones tomadas con el dev-lead

- Spec aprobada por delegación — «Apruebo la spec por delegación»
- Parar tras el commit de la Task 1 — «cuando tengas el commit de la Task 1, para»
- Motivos de la lista — «cambio de planes, sala ocupada, otro»

## Intent

Hoy se cancela una reserva sin dejar rastro de por qué. Quien consulta las canceladas no puede saber si fue por cambio de planes o porque la sala estaba ocupada. Con esto, cada cancelación guarda un motivo de una lista cerrada y `canceladas` lo enseña. Falla si se puede cancelar sin motivo, o si el listado no distingue el motivo de cada una.

## Scope

- Entra: `cancelar <sala> <día> <motivo>` con motivo obligatorio de la lista; el comando `canceladas`; el campo `reason` en la reserva.
- No entra: motivos libres de texto, editar el motivo de una ya cancelada, el motivo de las anulaciones (`anular`), persistencia entre ejecuciones (las reservas siguen en memoria), el plazo de 24 h de la cancelación.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `cancelar <sala> <día>` sin motivo deja de cancelar | `src/app.js:13-17` (`cancelBooking`), `src/app.js:30` | Scope y decisión 3 |
| Test `cancelar una reserva activa` con la forma antigua | `test/cancel.test.js:5-7` | decisión 7: pasa a la forma nueva |
| Test `cancelar sin reserva lo dice` | `test/cancel.test.js:9-11` | decisión 5: lleva ya un motivo válido |
| «Cancelar una reserva propia» (0.3.0) | `CHANGELOG.md:20` | queda: historial de una versión cerrada |

- Filas que implementa: 0010 → `ROADMAP.md:7` la nombra; el cierre la pasa a hecha, sin otro fichero que la cite (comprobado con `git grep -n 0010`)

## Approach

- Tercer argumento posicional con `reason` en la reserva — el mínimo: `cancelBooking(room, day, reason)` y una constante con la lista; los comandos ya son posicionales (`cancelar Norte lun`).
- Flag `--motivo=…` — más legible, pero ningún otro comando del proyecto usa flags con valor y hay que parsearlo.
- Pregunta interactiva — rompe el uso por script y los tests por `run(...)`.
- Elegido: el tercer argumento posicional — encaja con cómo se llama hoy y se prueba por `run`.

Una cancelación pone `status: 'cancelled'` (ya existente) y `reason` con el texto legible; `canceladas` filtra por `status === 'cancelled'`. La lista de reservas vive en `src/app.js`.

La lista vive en una constante `CANCEL_REASONS` en `src/app.js` que mapea `cambio-de-planes` → `cambio de planes`, `sala-ocupada` → `sala ocupada`, `otro` → `otro`.

## Dónde se prueba

- Cancelar con motivo, sin motivo, con motivo inválido y sin reserva: por `run('cancelar', …)` en `test/cancel.test.js`, como los tests actuales.
- `canceladas`: por `run('canceladas', [])`, con una reserva cancelada antes en el mismo test, en `test/cancel.test.js`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-cancellation`

#### ADDED — Cancelar una reserva con motivo

- GIVEN la reserva activa `Norte lun 10:00-12:00`
- WHEN se ejecuta `cancelar Norte lun sala-ocupada`
- THEN responde `cancelada Norte lun (sala ocupada)`
- AND después, `canceladas` responde `Norte lun 10:00-12:00 · sala ocupada`

#### ADDED — El motivo es obligatorio

- GIVEN la reserva activa `Norte lun 10:00-12:00`
- WHEN se ejecuta `cancelar Norte lun`
- THEN responde `falta el motivo: elige cambio-de-planes, sala-ocupada u otro`
- AND la reserva sigue activa: `canceladas` responde `sin canceladas`

#### ADDED — El motivo tiene que ser de la lista

- GIVEN la reserva activa `Norte lun 10:00-12:00`
- WHEN se ejecuta `cancelar Norte lun vacaciones`
- THEN responde `motivo no válido «vacaciones»: elige cambio-de-planes, sala-ocupada u otro`
- AND la reserva sigue activa: `canceladas` responde `sin canceladas`

#### ADDED — El motivo se valida antes de buscar la reserva

- GIVEN no hay reserva activa de Sur el día `mar`
- WHEN se ejecuta `cancelar Sur mar`
- THEN responde `falta el motivo: elige cambio-de-planes, sala-ocupada u otro`

#### ADDED — Cancelar sin reserva con motivo válido

- GIVEN no hay reserva activa de Sur el día `mar`
- WHEN se ejecuta `cancelar Sur mar otro`
- THEN responde `sin reserva Sur mar`

#### ADDED — Cancelar una reserva que ya no está activa

- GIVEN la reserva `Norte lun 10:00-12:00` ya cancelada con `cambio-de-planes`
- WHEN se ejecuta `cancelar Norte lun otro`
- THEN responde `sin reserva Norte lun`
- AND `canceladas` sigue respondiendo `Norte lun 10:00-12:00 · cambio de planes`

#### ADDED — Listado de canceladas con su motivo

- GIVEN la reserva `Norte lun 10:00-12:00` cancelada con `cambio-de-planes`
- WHEN se ejecuta `canceladas`
- THEN responde `Norte lun 10:00-12:00 · cambio de planes`

#### ADDED — Cada motivo se enseña con su texto

- GIVEN la reserva `Norte lun 10:00-12:00` cancelada con `otro`
- WHEN se ejecuta `canceladas`
- THEN responde `Norte lun 10:00-12:00 · otro`

#### ADDED — El listado no incluye anuladas ni activas

- GIVEN la reserva `Norte lun 10:00-12:00` anulada con `anular Norte lun`, y ninguna cancelada
- WHEN se ejecuta `canceladas`
- THEN responde `sin canceladas`
- AND con la reserva activa y sin anular, `canceladas` también responde `sin canceladas`

#### Reglas de la capacidad — booking-cancellation

- **Dónde viven los datos**: en memoria, en la reserva (`reason`), como hoy las reservas
- **Idioma de los nombres**: textos de interfaz en castellano; motivos como argumento en kebab-case castellano
- **Límites**: coincidencia exacta y en minúsculas; los argumentos de más se ignoran
- **Avisos**: `falta el motivo: elige cambio-de-planes, sala-ocupada u otro` · `motivo no válido «<motivo>»: elige cambio-de-planes, sala-ocupada u otro`
- **Regla ante conflicto**: solo se cancelan reservas activas; una cancelada o anulada responde `sin reserva <sala> <día>` y su motivo no cambia

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Fixture | 2026-11-12 | aprobada por delegación: «Apruebo la spec por delegación» |
