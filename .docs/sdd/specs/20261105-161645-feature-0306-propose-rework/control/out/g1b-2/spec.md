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

> 🦆 Hoy, al cancelar una reserva, no queda constancia de por qué se liberó la sala. Con esta feature, `cancelar` exige elegir un motivo de una lista cerrada, y un comando nuevo, `canceladas`, enseña cada sala cancelada con su motivo. Sin motivo ya no se cancela. Como las reservas viven en memoria, el listado solo ve lo cancelado en ese mismo proceso, igual que pasa hoy con `libres`.

## Capacidades

- Nuevas: `reservas` — cancelar pide un motivo y el listado de canceladas lo enseña. Nueva como fichero: el proyecto aún no tiene `capabilities/`, aunque `cancelar` ya existe en el código.

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: MODIFIED (`cancelar` ya existe y hoy responde «cancelada Norte lun» sin motivo), datos (el motivo, dato nuevo que se guarda con la reserva) · tamaño: ~35 líneas en 2 ficheros (`src/app.js`, `test/cancel.test.js`)
- Dominio (opus): si el MODIFIED de «Cancelar pide un motivo de la lista» deja claro qué pasa sin `--motivo` y si `canceladas` excluye las anulaciones (estado `voided`) (señal: MODIFIED)
- Técnica (sonnet): si el motivo con espacios llega entero desde `process.argv` y si el test existente «cancelar una reserva activa» queda reescrito y no duplicado (señal: datos + MODIFIED)
- Mínimo razonable (no aplicado: se despacharon los dos): solo técnica — dejaría sin revisar si la regla «sin motivo no se cancela» encaja con la Cancelación de `PRODUCT.md`

Política de modelos: revisores, dominio en opus y técnica en sonnet; segunda ronda, un revisor en sonnet; la implementación la hace la sesión (`execution: native`, fijado en `sdd-kit.json`).

1. La lista de motivos es cerrada: cambio de planes, sala ocupada, otro — decidido con el dev-lead en la entrevista. «Otro» no lleva texto libre: es a propósito, porque la lista es cerrada.
1 bis. **Pregunta para ti:** la revisión de dominio señala que «sala ocupada» suena a motivo de Anulación (la hace el responsable de sala, `PRODUCT.md`), no de Cancelación (la hace el propio cliente). Lo dejo como lo fijaste; si lo quitas o lo cambias, solo cambian la lista y los dos avisos.
2. **Corregido en el repaso:** el listado de canceladas enseña sala, día y motivo, **sin «quién canceló»**. La fila 0010 del roadmap no pide «quién»; la reserva no guarda titular en el código (`src/app.js`), la herramienta no tiene login y `mission.md` dice que solo hay un usuario. `PRODUCT.md` define la reserva «a nombre de quien la pide»; aquí manda `mission.md`. Para añadir el titular habría que guardarlo como dato nuevo y decidir de dónde sale: si lo quieres, va a una fila propia.
3. **Corregido en el repaso:** el primer requisito **cambia un comportamiento que ya existe**: `cancelar <sala> <día>` está en el código (`test/cancel.test.js:5`). En el delta sigue como ADDED solo porque `capabilities/reservas.md` aún no existe y la CLI rechaza un MODIFIED sin fichero; se revisa como un MODIFIED. **Antes:** `cancelar Norte lun` cancelaba y respondía «cancelada Norte lun». **Ahora:** sin un motivo de la lista no cancela, porque la fila dice que «se elige un motivo de una lista», y con motivo responde «cancelada Norte lun (<motivo>)». Se rompe la salida actual de `cancelar`, y el test «cancelar una reserva activa» (`test/cancel.test.js:5`) se reescribe, no se duplica. La CLI no admite la nota de antes dentro del requisito, así que va aquí.
4. **Corregido en el repaso:** se sustituye «Sin review de spec: dos señales». Las señales deciden cuántos revisores hay, no si hay review. Con un cambio de comportamiento existente tocan dos (bloque de arriba).
5. `canceladas` solo lista reservas con estado `cancelled`. Las anuladas (`voided`, del comando `anular`, que ya existe en `src/app.js`) no salen: son Anulación, no Cancelación (`PRODUCT.md`).
6. Formato de las respuestas: «cancelada <sala> <día> (<motivo>)»; cada fila de `canceladas` es «<sala> <día> — <motivo>», con raya y espacios, una por línea y en el orden en que se cancelaron (hoy no se puede observar: la única reserva es la de ejemplo y `reservar` no crea reservas; queda `sin medir` hasta que haya más de una); sin ninguna, «sin canceladas». Los dos avisos repiten la lista separada por comas. Cambia la salida actual de `cancelar` («cancelada Norte lun» pasa a llevar el motivo entre paréntesis).
7. El motivo es el argumento que sigue a `--motivo`, tal como llega en `process.argv`: con espacios va entre comillas en el shell. Se compara exacto y en minúsculas, como está en la lista; `sala` a secas, o `Sala Ocupada`, es «motivo no válido». `--motivo` sin valor equivale a no traerlo. La firma es `cancelar <sala> <día> --motivo <motivo>`: sala y día son los dos primeros argumentos y `--motivo` va detrás; otras posiciones no se contemplan (un solo usuario, `mission.md`).
8. Orden de las comprobaciones: primero la reserva y luego el motivo. Sin reserva activa (no existe, ya está cancelada o anulada) responde «sin reserva <sala> <día>», como hoy, traiga el motivo que traiga; el motivo de una cancelada no se sobrescribe.
9. Una reserva por sala y día, como ya da por hecho `cancelar`, que la busca por sala y día: la fila no enseña la franja.
10. Delta en una copia: `sdd capability merge` → «reservas.md: añadido» de los cuatro requisitos (exit 0). El `capabilities/` del repo no cambia.

### Hallazgos de la review

- **Aceptado** — (técnica, Crítico) `canceladas` en otro proceso siempre vería el listado vacío, porque las reservas viven en memoria → el Approach declara que no hay persistencia entre invocaciones, como hoy con `libres`, y «Dónde se prueba» dice que los tests importan `run` de `src/app.js` y encadenan las órdenes en el mismo proceso, como ya hace `test/cancel.test.js`.
- **Aceptado** — (técnica) «la reserva sigue activa» no se observa por la salida → los dos AND dicen ahora que `canceladas` no la lista y que un `cancelar` válido posterior responde «cancelada…».
- **Aceptado** — (técnica y dominio) la anulada no tenía GIVEN y parecía depender de 0011 → se añade el GIVEN con `anular Norte lun`. **Rechazada** la dependencia: `anular` y el estado `voided` ya existen en `src/app.js:20-25`, y 0011 es otra regla (quién puede anular).
- **Aceptado** — (técnica y dominio) faltaban el listado vacío y el orden → decisión 6 y un AND con «sin canceladas».
- **Aceptado** — (técnica) los formatos de salida eran decisiones del cuerpo → decisión 6.
- **Aceptado** — (técnica) el motivo con espacios, sin valor, en mayúsculas y la posición del flag → decisión 7 y un AND con `--motivo` sin comillas.
- **Aceptado** — (técnica y dominio) faltaban cancelar una reserva inexistente, ya cancelada o anulada y el orden de las comprobaciones → decisión 8 y un AND.
- **Aceptado** — (técnica y dominio) no quedaba rastro de que antes sin motivo se cancelaba → «Antes / Ahora» en la decisión 3 (la CLI no admite una línea suelta en el requisito).
- **Aceptado** — (técnica) el gate completo no figuraba en la verificación → «Dónde se prueba» cita `node --test && node scripts/lint.mjs`.
- **Rechazado** — (técnica) declarar si `cancelled` existe → ya existe en `src/app.js:16`; se cita en el Approach.
- **Aceptado** — (dominio) faltaba la sección con las cinco reglas → «Reglas de la capacidad».
- **Aceptado** — (dominio) `bookings` contradice «_Evitar_: booking» de `PRODUCT.md` → la capacidad se llama `reservas`.
- **Rechazado en parte** — (dominio) «sala ocupada» sería un motivo de Anulación, no del cliente → la lista la fijó el dev-lead en la entrevista y no la cambio yo; los ejemplos pasan a «cambio de planes». **Te lo pregunto en el gate.**
- **Rechazado** — (dominio) qué enseña `canceladas` de las cancelaciones de antes de esta feature → no hay: las reservas viven en memoria y cada proceso arranca sin canceladas.
- **Aceptado** — (dominio) la fila no enseña la franja → decisión 9: una reserva por sala y día, como ya supone `cancelar`.
- **Aceptado** — (dominio) la contradicción entre `PRODUCT.md` y `mission.md` sobre el titular → decisión 2: manda `mission.md`.
- **Aceptado** — (dominio) «otro» sin texto → decisión 1: sin texto, a propósito.

Segunda ronda (sonnet, siete puntos), por el Crítico aceptado:

- **Rechazado** — (Crítico) el gate de la constitución (`node --test` entero) diverge del de `operations.md` → no hay divergencia: `operations.md` concreta el gate de cierre y lo contiene (`node --test && node scripts/lint.mjs`); la spec cita ese.
- **Aceptado** — (Crítico) la nota de antes metida en el GIVEN y un requisito con cuatro comportamientos → el GIVEN queda como estado puro, el «Antes / Ahora» va a la decisión 3, y la reserva no activa pasa a un requisito propio.
- **Aceptado** — «cancelada Norte lun (…)» no se puede verificar → literal completo «cancelada Norte lun (otro)».
- **Aceptado** — la reserva no activa con placeholders y tres GIVEN mezclados → requisito propio con casos concretos, y el motivo que no cambia se observa por `canceladas`.
- **Rechazado** — falta un escenario con dos canceladas para el orden → la única reserva es la de ejemplo y `reservar` no crea reservas: no se puede montar; queda `sin medir` en la decisión 6.
- **Aceptado** — «AND GIVEN» mal formado en la anulada → requisito propio: tras `anular Norte lun`, `canceladas` responde «sin canceladas».
- **Aceptado** — la rotura de la salida de `cancelar` no estaba en el Scope → el Scope la lista y la decisión 3 la dice.
- **Aceptado** — la posición de `--motivo` no estaba fijada → decisión 7.
- **Aceptado en parte** — «Límites» sin «no aplica» para tamaños → añadido. **Rechazado** dejar la lista en un solo sitio: cada THEN tiene que llevar el literal exacto que se compara.
- **Aceptado** — el «mínimo razonable» parecía el nivel aplicado y «sala ocupada» solo estaba en los hallazgos → el bloque dice que no se aplicó, y la pregunta va como decisión 1 bis.

## Intent

Hoy cancelar no deja rastro: nadie sabe por qué se liberó una sala. Se quiere el motivo de cada cancelación.

## Scope

- Entra: `cancelar <sala> <día> --motivo <motivo>` (motivo obligatorio; cambia la salida actual de `cancelar`, decisión 3) en `src/app.js`; comando `canceladas` en `src/app.js`; reescribir el test «cancelar una reserva activa» de `test/cancel.test.js`.
- No entra: quién puede anular reservas de otros (0011); quién canceló (decisión 2); la regla de las 24 h de `PRODUCT.md`; guardar las reservas entre invocaciones.

## Approach

El motivo se guarda en la reserva al pasarla al estado `cancelled`, que ya existe (`src/app.js:16`). `canceladas` recorre las reservas con ese estado en el orden en que se cancelaron. No hay persistencia: como hoy, las reservas viven en memoria y cada invocación de `node src/app.js` arranca con la reserva de ejemplo activa.

## Reglas de la capacidad

- **Dónde vive el dato:** el motivo, en la reserva cancelada, en memoria (`operations.md`: sin base de datos).
- **Idioma de los nombres:** castellano (constitución, 4): comando `canceladas`, flag `--motivo`, motivos en minúsculas.
- **Límites:** solo los tres motivos de la decisión 1, comparados exactos. Número de canceladas y longitud de argumentos: no aplica (memoria de un proceso, un usuario).
- **Avisos:** «falta el motivo: cambio de planes, sala ocupada, otro» y «motivo no válido: cambio de planes, sala ocupada, otro».
- **Regla ante conflicto:** primero la reserva, luego el motivo (decisión 8); una cancelada no se vuelve a cancelar ni cambia de motivo.

## Dónde se prueba

- Motivo: por `run('cancelar', …)` importado de `src/app.js`, en `test/cancel.test.js`.
- Listado: por la salida de `run('canceladas', [])` en el mismo proceso, en `test/cancel.test.js`.
- Gate: `node --test && node scripts/lint.mjs` en verde.

## Delta de comportamiento

### Capacidad: `reservas`

**ADDED — Cancelar pide un motivo de la lista**
- GIVEN la reserva activa de Norte del lunes, 10:00-12:00
- WHEN `cancelar Norte lun --motivo "cambio de planes"`
- THEN responde «cancelada Norte lun (cambio de planes)»
- AND con `--motivo sala` responde «motivo no válido: cambio de planes, sala ocupada, otro», `canceladas` responde «sin canceladas» y un `cancelar Norte lun --motivo otro` posterior responde «cancelada Norte lun (otro)»
- AND sin `--motivo`, o con `--motivo` sin valor, responde «falta el motivo: cambio de planes, sala ocupada, otro», `canceladas` responde «sin canceladas» y un `cancelar Norte lun --motivo otro` posterior responde «cancelada Norte lun (otro)»

**ADDED — Cancelar solo actúa sobre reservas activas**
- GIVEN la reserva de Norte del lunes ya cancelada con «cambio de planes»
- WHEN `cancelar Norte lun --motivo otro`
- THEN responde «sin reserva Norte lun»
- AND `canceladas` sigue respondiendo «Norte lun — cambio de planes»
- AND `cancelar Sur mar --motivo otro`, sin reserva de Sur el martes, responde «sin reserva Sur mar»
- AND `cancelar Sur mar` sin `--motivo` responde «sin reserva Sur mar»: la reserva se comprueba antes que el motivo

**ADDED — El listado de canceladas enseña el motivo**
- GIVEN la reserva de Norte del lunes cancelada con «cambio de planes»
- WHEN `canceladas`
- THEN responde «Norte lun — cambio de planes»
- AND sin ninguna cancelada responde «sin canceladas»

**ADDED — Las anuladas no salen en el listado de canceladas**
- GIVEN la reserva de Norte del lunes anulada con `anular Norte lun`
- WHEN `canceladas`
- THEN responde «sin canceladas»

## Enmiendas

- (ninguna)

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |
