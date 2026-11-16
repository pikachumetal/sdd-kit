---
id: 20261116-120120-feature-0010-motivo-cancelar
feature: 0010
title: Motivo al cancelar una reserva
mode: full
status: approved
created: 2026-11-16
author: Fixture
approvers:
  - name: Fixture
    approved_at: 2026-11-16
---

# Spec — Motivo al cancelar una reserva

🦆 Hoy `salas cancelar Norte lun` cancela y no deja constancia de por qué. Con esto, cancelar pide un motivo de una lista cerrada: `salas cancelar Norte lun sala-ocupada` responde `cancelada Norte lun (sala ocupada)`. Sin motivo, o con uno que no está en la lista, no cancela y dice cuáles valen. Un comando nuevo, `salas canceladas`, enseña las reservas canceladas con su motivo: `Norte lun 10:00-12:00 — sala ocupada`. Por dentro, la reserva guarda el motivo y el listado filtra por estado `cancelled`.

Validación: dev-lead — es un comando que usa una persona; la frase de delegación no nombra `agente`.

## Capacidades

- Nuevas: `booking-cancellation` — cancelar una reserva con motivo de una lista cerrada y listar las canceladas.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva, contrato público (los argumentos de `cancelar` y el comando `canceladas` los usa la persona desde la terminal) · tamaño: ~35 líneas de código y ~40 de test en 2 ficheros
- Dominio (sonnet): si «motivo obligatorio» y «`anular` no pide motivo» son coherentes con Cancelación/Anulación de `PRODUCT.md`, y si el orden «motivo antes que reserva» da respuestas razonables (señal: capacidad nueva)
- Técnica (sonnet): si las respuestas de `cancelar` quedan sin ambigüedad frente a los tests existentes y si `canceladas` excluye las anuladas (señal: contrato público)
- Mínimo razonable: solo técnica — deja sin mirar la coherencia de Cancelación/Anulación del glosario con el motivo obligatorio y qué pasa con reservas en otros estados

1. Los tres motivos se escriben en la terminal como `cambio-de-planes`, `sala-ocupada`, `otro` (la lista es tuya; la forma sin espacios es mía, porque los argumentos se separan por espacios).
2. El motivo es **obligatorio** y va como tercer argumento posicional: `cancelar <sala> <día> <motivo>`. Alternativa descartada: opcional (deja cancelaciones sin motivo, que es lo que se quiere evitar).
3. Motivo ausente o fuera de la lista → no cancela y responde `motivo no válido: usa cambio-de-planes, sala-ocupada u otro`.
4. El motivo se valida **antes** de buscar la reserva: `cancelar Sur mar` (sin motivo) da el error del motivo, no `sin reserva Sur mar`.
5. Respuesta al cancelar: `cancelada Norte lun (sala ocupada)`, con el motivo en castellano normal, con espacios (tabla en «Límites»).
6. El listado de la fila 0010 es el comando nuevo `canceladas`, sin argumentos; una línea por reserva cancelada: `<sala> <día> <franja> — <motivo>`; sin ninguna, `sin canceladas`. Orden: el de creación de las reservas.
7. `canceladas` no lista las anuladas (`anular`, fila 0011): son otro concepto en `PRODUCT.md`. `anular` no cambia, deja la reserva en `voided` y no pide motivo; eso es transitorio hasta la fila 0011.
8. Capacidad nueva `booking-cancellation` (no existe ninguna en `capabilities/`): lo que `cancelar` ya hacía (`sin reserva …`) entra como ADDED porque aún no está documentado.
9. Enfoque: A, frente a B y C (ver Approach).
10. Sin `§Frontend`: no hay pantalla, solo texto de terminal.
11. Cancelar una reserva ya cancelada o anulada responde `sin reserva <sala> <día>` (no hay reserva activa): no sobrescribe el motivo.
12. El motivo distingue mayúsculas: `Sala-Ocupada` es no válido. Sala o día desconocidos responden `sin reserva …`, como hoy.
13. Argumentos de más en `cancelar` y cualquier argumento en `canceladas` se ignoran.
14. Entrada nueva en `CHANGELOG.md`, bajo `### Added`, enlazando esta carpeta.
- Delta probado en una copia de `.docs/sdd`: `sdd capability merge` → requisitos y reglas añadidos en `booking-cancellation.md`, exit 0; `capability check` → «Capacidades válidas: 1» (repetido tras la review).
- Política de modelos: revisores de la spec, 2 en sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents`

### Hallazgos de la review

Dominio:
- **Rechazado** — Crítico: `ADDED` oculta un `MODIFIED` → no existe ninguna capacidad (`sdd capability index`: «Sin capacidades»), así que no hay requisito vigente que modificar; decisión 8.
- **Rechazado** — Crítico: `anular` y `cancelar` comparten estado → falso: `anular` deja `voided` y `cancelar` deja `cancelled` (`src/app.js:16,21`); decisión 7 y el escenario de anuladas.
- **Aceptado** — Importante: cancelar una ya cancelada o anulada → escenario «Cancelar dos veces», decisión 11.
- **Aceptado** — Importante: `anular` sin motivo es transitorio → decisión 7.
- **Aceptado** — Importante: mayúsculas, argumentos de más, sala o día desconocidos → decisiones 12 y 13.
- **Aceptado** — Importante: «Regla ante conflicto» sin justificar → ahora la declara.
- **Aceptado** — Menor: tabla argumento → texto → en «Límites».
- **Aceptado** — Menor: orden con un solo escenario → escenario «Listar varias canceladas».
- **Aceptado** — Menor: «Mínimo razonable» mal redactado → corregido.
- **Rechazado** — Menor: quién consulta `canceladas` → una sola persona usa el producto (`PRODUCT.md`), sin roles.

Técnica:
- **Aceptado** — Crítico: «Listar canceladas» sin reserva completa y sin los tres motivos → GIVEN completo y escenarios por motivo.
- **Aceptado** — Crítico: sin varias canceladas ni activa → «Listar varias canceladas».
- **Aceptado** — Crítico: dos WHEN en un escenario y decisión 4 sin escenario → separados; «Motivo antes que reserva».
- **Aceptado** — Importante: `status` de `anular` → decisión 7; el test siembra con `run('anular', …)`.
- **Aceptado** — Importante: decisiones sin declarar → 11–14.
- **Aceptado** — Importante: cancelar dos veces → escenario.
- **Rechazado** — Importante: parseo de CLI y ayuda → `run` ya recibe `params`; el comando desconocido imprime `salas` y no hay ayuda que liste comandos (`src/app.js:31`).
- **Aceptado** — Importante: fuente única de motivos → «Límites».
- **Rechazado** — Menor: recreación de reservas → no hay comando para crearlas; se siembran en memoria.
- **Rechazado** — Menor: «parar tras la Task 1» en la spec → frase literal del dev-lead, se queda para trazabilidad.

Segunda ronda: no procede (ningún Crítico aceptado reescribe la decisión central: el enfoque A no cambia; los Críticos aceptados solo añaden escenarios).

### Decisiones tomadas con el dev-lead

- Spec aprobada por delegación — «Apruebo la spec por delegación; cuando tengas el commit de la Task 1, para.» (2026-11-16)
- Parar tras el commit de la Task 1 — «cuando tengas el commit de la Task 1, para»
- Motivos de la lista: cambio de planes, sala ocupada, otro — «de una lista: cambio de planes, sala ocupada, otro»

## Intent

Hoy cancelar una reserva no deja rastro de la causa y quien revisa las canceladas no sabe por qué se liberó la sala. Se quiere que cada cancelación lleve un motivo de una lista cerrada y que se pueda consultar. Éxito: ninguna reserva pasa a cancelada sin motivo y `salas canceladas` lo muestra. Anti-objetivo: que `cancelar` siga aceptando cancelaciones sin motivo, o que el listado mezcle anuladas.

## Scope

- Entra: motivo obligatorio en `cancelar`; guardarlo en la reserva; comando `canceladas`; tests de ambos; entrada en `CHANGELOG.md`.
- No entra: `anular` y sus motivos (fila 0011); motivo libre de texto para `otro`; la regla de las 24 h de la Cancelación; persistencia (las reservas viven en memoria); filtrar o paginar el listado.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `cancelar <sala> <día>` sin motivo deja de cancelar | `src/app.js:13-18,30`; `test/cancel.test.js:5-11` | Scope: los dos tests se actualizan a la forma nueva; decisión 2 |
| Respuesta `cancelada Norte lun` pasa a `cancelada Norte lun (sala ocupada)` | `src/app.js:17`; `test/cancel.test.js:6` | Delta «Cancelar con motivo»; decisión 5 |
| `cancelar Sur mar` ya no responde `sin reserva` sin motivo | `test/cancel.test.js:10` | decisión 4 |

- Filas que implementa: 0010 → ningún otro fichero la nombra: comprobado con `git grep -n "0010"` (solo `ROADMAP.md`).

## Approach

- A — guardar el motivo en la propia reserva (`booking.reason`) y listar filtrando por `status === 'cancelled'`: cero estructuras nuevas, sigue el patrón del fichero.
- B — registro aparte de cancelaciones (`cancellations[]`): duplica datos de la reserva y se desincroniza.
- C — motivo opcional con valor por defecto `otro`: no obliga a elegir, que es el sentido de la fila.
- Elegido: A — la reserva ya lleva `status`; el motivo es otro atributo de la misma transición.

`cancelBooking(room, day, reason)` valida `reason` contra la lista antes de buscar; `run` pasa `params[2]`. Nuevo `listCancelled()` y rama `canceladas` en `run`.

## Dónde se prueba

- Cancelar con motivo, motivo inválido, sin reserva, dos veces: por `run('cancelar', …)`, como `test/cancel.test.js` actual.
- Listado: por `run('canceladas', [])`, en el mismo fichero; las anuladas se siembran con `run('anular', …)`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-cancellation`

#### ADDED — Cancelar con motivo

- GIVEN reserva activa Norte lun 10:00-12:00
- WHEN `cancelar Norte lun sala-ocupada`
- THEN responde `cancelada Norte lun (sala ocupada)`
- AND la reserva queda cancelada con el motivo `sala-ocupada`

#### ADDED — Etiqueta de cambio de planes

- GIVEN reserva activa Norte lun 10:00-12:00
- WHEN `cancelar Norte lun cambio-de-planes`
- THEN responde `cancelada Norte lun (cambio de planes)`

#### ADDED — Etiqueta de otro

- GIVEN reserva activa Norte lun 10:00-12:00
- WHEN `cancelar Norte lun otro`
- THEN responde `cancelada Norte lun (otro)`

#### ADDED — Motivo obligatorio

- GIVEN reserva activa Norte lun 10:00-12:00
- WHEN `cancelar Norte lun`
- THEN responde `motivo no válido: usa cambio-de-planes, sala-ocupada u otro`
- AND la reserva sigue activa

#### ADDED — Motivo de la lista

- GIVEN reserva activa Norte lun 10:00-12:00
- WHEN `cancelar Norte lun lluvia`
- THEN responde `motivo no válido: usa cambio-de-planes, sala-ocupada u otro`
- AND la reserva sigue activa

#### ADDED — Motivo antes que reserva

- GIVEN no hay reserva activa de Sur el martes
- WHEN `cancelar Sur mar`
- THEN responde `motivo no válido: usa cambio-de-planes, sala-ocupada u otro`

#### ADDED — Cancelar sin reserva

- GIVEN no hay reserva activa de Sur el martes
- WHEN `cancelar Sur mar otro`
- THEN responde `sin reserva Sur mar`

#### ADDED — Cancelar dos veces

- GIVEN Norte lun ya cancelada por `otro`
- WHEN `cancelar Norte lun sala-ocupada`
- THEN responde `sin reserva Norte lun`
- AND el motivo guardado sigue siendo `otro`

#### ADDED — Listar canceladas

- GIVEN reserva Norte lun 10:00-12:00 cancelada por `cambio-de-planes`
- WHEN `canceladas`
- THEN responde `Norte lun 10:00-12:00 — cambio de planes`

#### ADDED — Listar varias canceladas

- GIVEN reservas Norte lun 10:00-12:00 y Sur mar 10:00-12:00 creadas en ese orden, Sur mar cancelada por `sala-ocupada` antes que Norte lun por `otro`, y Norte mie 10:00-12:00 activa
- WHEN `canceladas`
- THEN responde dos líneas, `Norte lun 10:00-12:00 — otro` y `Sur mar 10:00-12:00 — sala ocupada`, en ese orden
- AND Norte mie no aparece

#### ADDED — Listar sin canceladas

- GIVEN ninguna reserva cancelada
- WHEN `canceladas`
- THEN responde `sin canceladas`

#### ADDED — Las anuladas no son canceladas

- GIVEN Norte lun anulada con `anular Norte lun` (la reserva queda `voided`)
- WHEN `canceladas`
- THEN responde `sin canceladas`

#### Reglas de la capacidad — booking-cancellation

- **Dónde viven los datos**: en memoria, en la propia reserva (`reason`).
- **Idioma de los nombres**: castellano en los textos; los motivos como argumento van en kebab-case sin espacios.
- **Límites**: tres motivos, argumento → texto mostrado: `cambio-de-planes` → `cambio de planes`, `sala-ocupada` → `sala ocupada`, `otro` → `otro`; distingue mayúsculas; esta tabla es la única fuente.
- **Avisos**: `motivo no válido: usa cambio-de-planes, sala-ocupada u otro`.
- **Regla ante conflicto**: sala y día identifican la reserva activa; si hubiera varias, se cancela la primera (como hoy).

## Enmiendas

_Ninguna_

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Fixture | 2026-11-16 | aprobada por delegación: «Apruebo la spec por delegación; cuando tengas el commit de la Task 1, para.» |
