---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Motivo al cancelar
mode: full
profile: delegate
status: draft
created: 2026-10-08
author: agente con el dev-lead
approvers:
  - role: dev-lead
    name: Laura
    approved_at: null
---

# Spec — Motivo al cancelar

## Capacidades

- Nuevas: `reservas` — cancelar pide un motivo y quién cancela, y el listado de canceladas lo enseña. (El proyecto aún no tiene `capabilities/`: la capacidad nace con esta spec y su primera versión ya trae el cancelar con motivo. El comportamiento de hoy que cambia —la respuesta de `cancelar` sin flags— queda en «Lo que cambia de forma».)

## Decisiones que he tomado yo — valida estas

Review de spec: un revisor con los siete puntos (opus) — señales: capacidad nueva (`reservas`), datos (motivo y quién cancela, guardados con la reserva) · tamaño: ~40 líneas en 2 ficheros. Segunda ronda (sonnet) por dos Críticos aceptados; sus Críticos van abajo aceptados o rechazados, sin tercera ronda.

1. La lista de motivos es cerrada: cambio de planes, sala ocupada, otro. Se compara el texto exacto, distinguiendo mayúsculas. Decidido con el dev-lead en la entrevista.
2. El listado de canceladas enseña sala, día, motivo y quién canceló, una línea por reserva con la forma «<sala> <día> — <motivo> — <persona>». La petición habla de «saber quién y por qué». Esta spec no fija el orden con varias canceladas: hoy los datos traen una sola reserva (Norte, lunes) y no hay comando que cree reservas sueltas, así que no habría escenario que lo probara.
3. Quién cancela se da en el propio comando, con `--por <persona>`. Hoy las reservas no guardan titular, aunque PRODUCT.md diga «a nombre de quien la pide», y el producto declara un solo usuario. Por eso `--por` se registra y no se comprueba contra nadie: no impide cancelar la reserva de otro. Quién puede tocar reservas ajenas es cosa de la 0011. Esto choca con «la uso yo, no hay más usuarios» de PRODUCT.md: valida que «quién» sigue haciendo falta.
4. `--motivo` y `--por` son obligatorios. `cancelar <sala> <día>` sin ellos deja de cancelar y responde qué falta. Un flag sin valor o con valor vacío cuenta como ausente. Los avisos salen en este orden: primero falta el motivo, después motivo no válido y por último falta quién cancela. Esto cambia la respuesta de hoy (ver «Lo que cambia de forma»).
5. `canceladas` lista solo las reservas canceladas. Las anuladas con el comando `anular`, que ya existe, no salen.
6. El plazo de «antes de 24 h» que PRODUCT.md pone a la Cancelación no está implementado hoy y esta feature no lo añade (no entra).

### Hallazgos de la review

- **Aceptado** — Crítico: faltan las cinco reglas de la capacidad → nueva sección «Reglas de la capacidad», con cada regla nombrada.
- **Aceptado** — Crítico: el nombre `bookings` contradice PRODUCT.md («_Evitar_: booking») y la constitución §4 → la capacidad pasa a `reservas` y los estados se nombran en castellano en la spec.
- **Aceptado** — si `--por` no coincide con el titular → decisión 3: no hay titular en los datos, `--por` se registra sin comprobarse, y se señala el choque con PRODUCT.md.
- **Aceptado** — el plazo de 24 h y cancelar una reserva ya cancelada → decisión 6 (no entra) y un AND para la ya cancelada.
- **Aceptado** — el GIVEN del listado se podía sembrar a mano → ahora se construye ejecutando `cancelar`.
- **Aceptado** — que las anuladas no salgan no tenía escenario → AND con una anulada.
- **Rechazado** — «aclarar si `anular` existe» → existe hoy (`src/app.js:20`, `voidBooking`). La feature no lo toca y la decisión 5 lo dice.
- **Aceptado** — el Intent no prometía quién ni la consulta → Intent ampliado.
- **Aceptado** — formato, orden, los dos flags ausentes y las mayúsculas, sin decidir → decisiones 1, 2 y 4. El escenario con dos canceladas no cabe: hoy solo existe una reserva (decisión 2).
- **Rechazado** — nombres reales en los ejemplos → «Laura» es la aprobadora del frontmatter, no un ejemplo. «Ana» y «Marta» son inventados. El choque con «un solo usuario» queda en la decisión 3.

Segunda ronda:

- **Rechazado** — Crítico: el cambio de `cancelar` es un MODIFIED sin declarar → no hay `capabilities/` del que partir, y `sdd capability merge` rechaza un MODIFIED sobre una capacidad que no existe. La capacidad nace con el comportamiento nuevo, y el cambio respecto a hoy queda en «Capacidades» y en «Lo que cambia de forma».
- **Aceptado** — Crítico: los ANDs no decían qué comando daba cada respuesta, y faltaba el caso de mayúsculas → un escenario por caso, cada uno con su comando literal (mayúsculas, motivo inválido, falta motivo, falta quién, faltan ambos).
- **Aceptado** — «la reserva sigue activa» no se observaba → cada escenario de error termina con un `cancelar` válido que sí cancela.
- **Aceptado** — `--por` vacío y `--motivo` sin valor → decisión 4 (cuentan como ausentes) y sus ANDs.
- **Aceptado** — un solo dato en el listado se podía escribir a mano → el listado usa valores que no salen en el otro escenario («cambio de planes», Marta).
- **Aceptado** — el orden prometido no tenía escenario → se quita como requisito (decisión 2 y Approach).
- **Aceptado** — cancelar una anulada sin escenario → AND en «Las anuladas no son canceladas».
- **Aceptado** — precedencia entre motivo inválido y `--por` ausente → decisión 4 y su AND.
- **Rechazado** — resolver lo de «un solo usuario» antes de aprobar → es justo la pregunta de la decisión 3 en esta parada; enmendar PRODUCT.md queda fuera del Scope. El plazo de 24 h está en la decisión 6.
- **Aceptado** — relación implícita con `anular` → línea «Relación con `anular`» en Reglas.

## Intent

Hoy cancelar no deja rastro: nadie sabe por qué se liberó una sala. Se quiere guardar de cada cancelación quién la hizo y por qué, y poder consultarlo.

## Scope

- Entra: `cancelar <sala> <día> --motivo <motivo> --por <persona>`; comando `canceladas`.
- Ficheros: `src/app.js` (`cancelBooking` y `run`); `test/cancel.test.js` (el test `cancelar una reserva activa`, que cambia de respuesta), `test/cancel-errores.test.js` y `test/cancel-sin-flags.test.js` (nuevos, uno por estado de partida); `test/canceladas.test.js` y `test/canceladas-anulada.test.js` (nuevos). Las reservas viven en memoria del módulo y `node --test` aísla cada fichero en su proceso: cada estado de partida va en su fichero, sin tocar el código para reiniciarlo.
- No entra: las anulaciones del responsable de sala y quién puede tocar reservas ajenas (0011); el plazo de 24 h; guardar entre ejecuciones (las reservas siguen en memoria, como hoy).

## Reglas de la capacidad

- Dónde viven los datos: el motivo y quién cancela se guardan en la propia reserva, en memoria, como el resto de reservas.
- Idioma de los nombres: castellano en comandos, flags y respuestas (constitución §4). Los identificadores internos del código no cambian.
- Límites: el motivo es uno de los tres de la lista cerrada. `--por` acepta cualquier texto no vacío.
- Avisos: «motivo no válido: cambio de planes, sala ocupada, otro», «falta el motivo: cambio de planes, sala ocupada, otro», «falta quién cancela», «sin canceladas».
- Regla ante conflicto: una reserva ya cancelada o anulada no se puede volver a cancelar y responde «sin reserva <sala> <día>», como hoy.
- Relación con `anular`: `anular` deja la reserva como anulada (no se toca `voidBooking`) y `canceladas` filtra solo las canceladas.

## Approach

El motivo y quién cancela se guardan con la reserva cancelada. `canceladas` lista las reservas con estado cancelada.

## Dónde se prueba

- Motivo y quién: por el comando `cancelar`, en `test/cancel.test.js`, `test/cancel-errores.test.js` y `test/cancel-sin-flags.test.js`.
- Listado: por la salida del comando `canceladas`, en `test/canceladas.test.js` y `test/canceladas-anulada.test.js`, con el estado creado ejecutando `cancelar` y `anular`, nunca escrito a mano. Los escenarios de error van cada uno en su `test(...)` y en orden, porque comparten la reserva en memoria.

## Delta de comportamiento

### Capacidad: `reservas`

**ADDED — Cancelar pide un motivo de la lista y quién cancela**
- GIVEN la reserva de Norte del lunes, 10:00-12:00
- WHEN `cancelar Norte lun --motivo "sala ocupada" --por Ana`
- THEN responde «cancelada Norte lun (sala ocupada)»
- AND `cancelar Norte lun --motivo "sala ocupada" --por Ana` otra vez responde «sin reserva Norte lun»

**ADDED — Un motivo fuera de la lista no cancela**
- GIVEN la reserva de Norte del lunes
- WHEN `cancelar Norte lun --motivo "Sala ocupada" --por Ana` (mayúscula distinta)
- THEN responde «motivo no válido: cambio de planes, sala ocupada, otro»
- AND `cancelar Norte lun --motivo nada --por Ana` responde lo mismo
- AND `cancelar Norte lun --motivo nada` (sin `--por`) responde lo mismo
- AND después `cancelar Norte lun --motivo otro --por Ana` responde «cancelada Norte lun (otro)»: la reserva seguía activa

**ADDED — Sin motivo o sin quién no cancela**
- GIVEN la reserva de Norte del lunes
- WHEN `cancelar Norte lun`
- THEN responde «falta el motivo: cambio de planes, sala ocupada, otro»
- AND `cancelar Norte lun --por Ana` responde lo mismo
- AND `cancelar Norte lun --motivo --por Ana` (motivo sin valor) responde lo mismo
- AND `cancelar Norte lun --motivo otro` responde «falta quién cancela»
- AND `cancelar Norte lun --motivo otro --por ""` responde «falta quién cancela»
- AND después `cancelar Norte lun --motivo otro --por Ana` responde «cancelada Norte lun (otro)»: la reserva seguía activa

**ADDED — El listado de canceladas enseña el motivo y quién canceló**
- GIVEN la reserva de Norte del lunes, sin canceladas
- WHEN `canceladas`
- THEN responde «sin canceladas»
- AND después de `cancelar Norte lun --motivo "cambio de planes" --por Marta`, `canceladas` responde «Norte lun — cambio de planes — Marta»

**ADDED — Las anuladas no son canceladas**
- GIVEN que se ha ejecutado `anular Norte lun`
- WHEN `canceladas`
- THEN responde «sin canceladas»
- AND `cancelar Norte lun --motivo otro --por Ana` responde «sin reserva Norte lun»

## Lo que cambia de forma

| Literal | Dónde aparece hoy | Destino |
| --- | --- | --- |
| respuesta `cancelada <sala> <día>` | `src/app.js:17` | pasa a `cancelada <sala> <día> (<motivo>)` |
| `run('cancelar', ['Norte', 'lun'])` → `'cancelada Norte lun'` | `test/cancel.test.js:6` | el test pasa a dar `--motivo` y `--por` y espera la respuesta nueva |
| «Cancelar una reserva propia» | `CHANGELOG.md:20` | se queda: es historia de una versión cerrada |

## Enmiendas

- (ninguna)

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |
