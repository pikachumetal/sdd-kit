---
id: 20260923-214917-task-0053-fewer-stops
task: 0053
parent: 0015
title: Menos paradas y avisos llanos
mode: full
status: done
created: 2026-09-23
author: Claude (Opus 5.5) con el dev-lead
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-09-24
---

# Spec — Menos paradas y avisos llanos

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: `MODIFIED` (tres requisitos vigentes), tres o más capacidades (`task-flow`, `control-profiles`, `routing`, `roadmap`)
- Mínimo razonable: ninguna — deja sin mirar si los `MODIFIED` conservan cada cláusula vigente; lo cubre el repaso de coherencia, que contrasta cada bloque con el texto de `capabilities/`

1. **Lo que deja el RED** ([`tests/fewer-stops-red.md`](../../../../tests/fewer-stops-red.md)) — las cuatro piezas fallan 2/2 cada una en sus seis escenarios, así que ninguna se recorta. Tu añadido del 0051 (s7) no falla en la conducta: 2/2 fijan el fix sobre el síntoma medido y no persiguen el predicho. Sí falla en la forma: 2/2 dejan en `patch.md` §1 el síntoma predicho, literal, y el medido solo aparece en la causa raíz. **Recomiendo** escribir solo la forma, en el paso 3 de `sdd-start-patch` («si la investigación midió otro síntoma, §1 lleva el medido y en qué difiere del predicho»), y **no** la fila de racionalización que pediste. Sin fallo que dirigir, el Art. I no la admite («si el baseline no exhibe el fallo, no se escribe la guidance»). Si la quieres igual, dilo al aprobar y entra como regla tuya.
2. **Previsión común de la campaña, declarada antes del primer sujeto** (Art. I) — 37 sujetos como máximo, ~17 $ y ~3 h: RED 14, GREEN 14 más 3 controles de 1 sujeto para las guías que quitan una parada, y una tanda de REFACTOR de hasta 6. **Techo: 18 $**, RED y GREEN sumados, aplicado por el lanzador (`red/run.sh`). **Gastado en el RED: 4,61 $** en 16 sujetos (2 descartados por el molde de s7). Quedan 13,39 $ para el GREEN, que se prevé en ~6 $.
3. **Pieza 3, sin nombrar `AskUserQuestion`** — la fila dice «se pregunta sola, con `AskUserQuestion`», pero el commit `60fffcb` retiró de esta task las preguntas con esa herramienta porque son preferencia del `CLAUDE.md` global del dev-lead, no regla del kit. La regla dice «sola, en su propio turno»; la herramienta la pone el `CLAUDE.md` de cada cual.
4. **Pieza 3, el «sí» sin detalle toca `sdd-end-task`** — su paso 0 exige que el usuario haya dicho qué probó y su paso 1 escribe la línea de validación del walkthrough: sin tocarlos, el cierre volvería a parar. La fila de la task añade `sdd-end-task` (pasos 0 y 1) a «Ficheros que toca».
5. **Pieza 2, qué quita la delegación** — solo la parada de la spec, y la pregunta de review de spec, que la decide el agente como en `unattended` y la registra. El perfil no cambia: en `pair` sigue el gate del plan, y la validación no se quita nunca. La opción se ofrece en `pair` y `delegate`; en `unattended` no hay primera pregunta.
6. **Pieza 4, una sola regla para las dos salidas** — «el fallo no se reproduce» al abrir un patch y la re-medición en su cierre dejan la fila igual: se reescriben las celdas que afirman lo que la medición contradice, con la fecha y la evidencia nuevas. No es el formato de cierre (la fila no se salda), así que no choca con «el texto con que se abrió la fila sigue detrás del prefijo», que vale solo para filas saldadas.
7. **Pieza 4, sin id** — «sin consumir id» se cumple no creando rama ni carpeta: en `sequence`, el id lo consumen la rama y la carpeta. Que `Get-NextSddId.ps1` no lea `field-reports/` (el motivo del 0053) es del repo del kit y no entra.
8. **Pieza 1, dónde vive el aviso** — en `sdd-start-task`, en la cabecera del checklist, porque es la regla de todo cambio de paso; la fila no nombra `sdd-end-task` ni los carriles de patch. Forma: qué se hace ahora en llano, lo que queda hasta la próxima parada del usuario y su tiempo, y el coste en dinero cuando el paso lanza subagentes o sujetos. Un contador («van 7 de 15») o un número de paso solos no cuentan.
9. **Síntoma predicho frente a medido** (añadido del dev-lead, ver «Enmiendas») — distingue dos salidas del paso 1 de `sdd-start-patch`. Si no hay fallo, «no se reproduce» (pieza 4). Si hay otro fallo distinto del predicho, manda el medido y el patch sigue con él. Tiene escenario propio (s7) en el RED y en el GREEN, y en el GREEN s5 y s7 se miden juntos, porque la guía de s5 (parar) no puede arrastrar a s7 (seguir).
10. **Capacidades** — sin capacidad nueva. El aviso de fase y la decisión separada van a `task-flow`; la delegación en la primera pregunta, a `control-profiles`; la salida «no se reproduce», a `routing`; la fila re-medida, a `roadmap`.

## Intent

Cuatro huecos del kit hacen perder tiempo al dev-lead o lo dejan sin saber qué pasa. Los avisos del agente son contadores que no dicen en qué punto está el flujo (ticket 0040 §1a). La aprobación por delegación existe, pero nadie la ofrece, y una task quedó ~4 h parada en el gate (0010 §3). En el paso 7 una decisión del dev-lead se pierde dentro de la pregunta de validación (0044 §4), y el «sí» sin detalle no tiene regla (0046 §5). Además, `sdd-start-patch` no tiene salida para un fallo que no se reproduce, y un cierre que re-mide una fila deja texto que la contradice (0052 §1–§2).

## Scope

- Entra: aviso de fase en `sdd-start-task`; la opción de aprobar la spec por delegación en la primera pregunta, y su efecto en el gate del paso 4; paso 7: la decisión del dev-lead en su propio turno y el «sí» sin detalle como validación, con su reflejo en los pasos 0 y 1 de `sdd-end-task`; paso 1 de `sdd-start-patch` con la salida «no se reproduce» y, en su paso 3, el síntoma medido frente al predicho; paso 4 de `sdd-end-patch` con la fila re-medida; `control-profiles.md` (fila «Spec» de la tabla de gates); evidencia en `tests/`.
- No entra: avisos de fase en `sdd-end-task` y en los carriles de patch; preguntas con `AskUserQuestion` (retiradas en `60fffcb`); `Get-NextSddId.ps1` leyendo `field-reports/`; el resto de la 0015.

## Approach

Guidance mínima en el punto de uso de cada skill, dirigida a los fallos que exhibió el RED (Art. I y II): una regla de forma para el aviso, una opción más en la primera pregunta, dos frases en el paso 7 y en los pasos 0 y 1 de `sdd-end-task`, una tercera salida en el paso 1 de `sdd-start-patch`, la forma del síntoma medido en su paso 3 y una frase en el paso 4 de `sdd-end-patch`. GREEN con los mismos siete escenarios y tres controles de las guías que quitan una parada: una spec sin delegación sigue parando en el gate, «cierra la 0012» sin validación sigue parando, y un patch cuyo fallo sí se reproduce sigue adelante.

## Delta de comportamiento

### Capacidad: `task-flow`

**ADDED — Cada cambio de paso lleva un aviso en llano**
- GIVEN una task en curso con `sdd-start-task`
- WHEN el agente pasa de un paso del flujo al siguiente
- THEN su mensaje dice, en lenguaje llano, qué hace ahora, lo que queda hasta la próxima parada del usuario y cuánto tardará, y cuánto costará cuando el paso lanza subagentes o sujetos
- AND un contador («van 7 de 15») o un número de paso sin esa frase no cuentan como aviso

**ADDED — Una decisión del dev-lead que sale de la revisión final se pregunta sola**
- GIVEN la revisión final de rama con un hallazgo cuya resolución es del dev-lead
- WHEN el agente llega al paso 7
- THEN pregunta esa decisión sola, en su propio turno, y presenta la validación después de la respuesta
- AND no la resuelve por defecto ni la mete en el mensaje de la validación

**MODIFIED — El trabajo se valida con el usuario antes de cerrar** (antes: sin regla para el «sí» sin detalle)
- GIVEN una task con la implementación terminada y la revisión final limpia
- WHEN el agente va a cerrar
- THEN antes de invocar `sdd-end-task` presenta, empezando por «Me salí del plan en…», las decisiones sin el dev-lead, cómo probarlo y el smoke que ejecutó, y espera la validación explícita (qué probó el usuario y que funciona; «cierra la tarea» no lo es)
- AND un «sí» sin detalle a la pregunta de validación, que ya pedía el detalle, es validación: no se repregunta, y el walkthrough registra la frase literal y «no detalló qué probó»
- AND si el usuario no responde, la task queda en espera con el smoke documentado; si difiere, se aplica «La validación puede diferirse con condiciones» de [`control-profiles`](control-profiles.md); en `unattended` se difiere al smoke de la release
- AND el walkthrough registra la validación separada de lo verificado por el agente, y las decisiones sin el dev-lead en su propia sección

### Capacidad: `control-profiles`

**MODIFIED — La primera pregunta confirma carril, modo y perfil** (antes: sin la opción de aprobar la spec por delegación)
- GIVEN una task que arranca con usuario presente
- WHEN el agente termina de leer el contexto
- THEN su primera pregunta, sola en su turno, confirma carril y modo, ofrece lite citando el predicado si se cumple y dice el perfil vigente con la opción de cambiarlo para esta task
- AND si la rama es `feature/<id>` y `<id>` tiene fila pendiente en el roadmap, la pregunta propone esa fila como enunciado
- AND en `pair` y `delegate`, una de sus opciones aprueba la spec por delegación con la frase «apruebo la spec por delegación, nos vemos en la validación»

**ADDED — La spec aprobada por delegación en la primera pregunta no para**
- GIVEN el usuario eligió en la primera pregunta la opción que aprueba la spec por delegación
- WHEN la spec está escrita y repasada
- THEN el agente la aprueba sin parar, registra la frase literal y la fecha en «Decisiones tomadas con el dev-lead» y en «Aprobaciones», decide él la review de spec y la registra, y sigue
- AND el resto de paradas del perfil vigente sigue igual: la validación final no se quita nunca

### Capacidad: `routing`

**ADDED — Un patch cuyo fallo no se reproduce no se abre**
- GIVEN una petición de patch (una fila de deuda, un ticket) cuyo fallo la investigación del paso 1 no reproduce sobre la base actual
- WHEN el agente termina la investigación
- THEN para: no crea rama ni carpeta, no escribe `patch.md` ni fix, y no reserva id
- AND si viene de una fila del roadmap, la deja re-medida según «Una re-medición que contradice una fila la reescribe» de [`roadmap`](roadmap.md), y lo dice al usuario

**ADDED — En un patch manda el síntoma medido, no el predicho**
- GIVEN una petición de patch cuyo ticket o fila predice un síntoma A, y una investigación del paso 1 que mide otro fallo B
- WHEN el agente fija el alcance del fix
- THEN el patch sigue con B: la sección de síntoma de `patch.md` recoge B como síntoma medido y dice en qué difiere de A, y el fix cubre B
- AND si no mide ningún fallo, no es este caso: se aplica «Un patch cuyo fallo no se reproduce no se abre»

### Capacidad: `roadmap`

**ADDED — Una re-medición que contradice una fila la reescribe**
- GIVEN una fila de «Deuda técnica» o de «Backlog» que un patch re-mide, al abrirse o en su cierre, sin saldarla
- WHEN el resultado contradice lo que la fila afirma (su evidencia, su recuento, su propuesta)
- THEN las celdas que lo afirman se reescriben con la medición nueva, su fecha y su evidencia
- AND la fila ya no afirma el estado contradicho: añadir la re-medición y dejar el texto viejo no cuenta

## Enmiendas

- 2026-09-23 — Entra en la pieza 4 la racionalización del paso 1 de `sdd-start-patch` «El ticket ya dice qué falla» → «Un ticket de campo predice el síntoma; el RED lo mide. Si no coinciden, manda el RED, y el `patch.md` recoge el síntoma medido y en qué difiere del predicho», con su requisito en `routing` — origen: [ticket del patch 0051](../../field-reports/20260923-212835-patch-0051-verify-gate.md) §2, misma familia que la fila del tag del 0052; la fila de la task en `develop` no lo recoge y se anota en su cierre. Pedida por el dev-lead antes del gate, entra con la aprobación de la spec. El RED (s7) midió que la conducta ya se cumple y la forma no, y la decisión 1 propone escribir solo la forma

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-09-24 | aprobada: «si» |
