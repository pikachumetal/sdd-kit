---
id: 20261004-231556-patch-0139-merge-modified-lost-lines
task: 0139
title: Patch — Merge-CapabilityDelta.ps1 falla si un MODIFIED pierde líneas del requisito vivo
type: patch
solution: dev-lead
status: done
created: 2026-10-05
branch: hotfix/v2.3.2
commit: 3e673dd1
---

# Patch 0139 — Merge-CapabilityDelta.ps1 falla si un MODIFIED pierde líneas del requisito vivo

## Capacidades

- Modificadas: `capabilities` — cambia «La fusión del delta falla sin escribir nada»: un `MODIFIED` que perdería un `- AND` o un `- THEN` del vivo falla

## 1. Síntoma

Ticket del patch 0057 de un proyecto (`field-reports/20261004-225436-patch-0057-keep-app-base-href.md` §3, en `develop`): un delta `MODIFIED` copió el requisito de una lectura parcial de la capacidad, sin su último `AND`. `Merge-CapabilityDelta.ps1` escribió «sustituido» y el `AND` desapareció de la capacidad viva; solo se vio en el `git diff`.

## 2. Solución fijada

Dev-lead, 2026-10-05: «`Merge-CapabilityDelta.ps1` sustituye un requisito MODIFIED y borra en silencio las líneas `- AND` y `- THEN` del requisito vivo que el delta no copió. Que falle, nombre cada línea que se perdería y no escriba nada, salvo que el delta la retire de forma explícita. Decide en el patch la forma más simple de retirarla y documéntala en §6 de patch-template.md.»

Lo que da por existente, comprobado: `Set-Requirement` borra el bloque vivo y pone el del delta sin comparar nada. RED en `tests/Merge-CapabilityDelta.Tests.ps1`: con un requisito vivo con cuatro `AND` y un delta que copia tres, el script escribe `bookings.md: sustituido «Reservar una franja»`, sale con 0 y el cuarto `AND` ya no está.

## 3. Fix

- **Fichero(s)**:
  - `skills/sdd-templates/scripts/Merge-CapabilityDelta.ps1`
  - `skills/sdd-templates/templates/patch-template.md` (§6)
  - `tests/Merge-CapabilityDelta.Tests.ps1`
  - `tests/WordBudget.Tests.ps1` (topes)
  - `.docs/sdd/capabilities/capabilities.md` (fusión del delta, en el cierre)
- **Cambio**: antes de sustituir un `MODIFIED`, el script cuenta las líneas `- THEN` y `- AND` del vivo y las del delta. Si el delta tiene menos, descontadas las retiradas, falla con una línea por cada línea del vivo que no está en el delta: `spec.md: «<título>» del MODIFIED perdería «- AND <texto>» de capabilities/<x>.md: cópiala en el delta o retírala con «- REMOVED AND <texto>»`, sale con 1 y no escribe. La retirada es una línea `- REMOVED AND <texto literal>` dentro del bloque `MODIFIED`: solo cuenta si casa con una línea del vivo, y no pasa a la capacidad. §6 de la plantilla lo dice en una línea.
- **Decisiones**:
  - Que falle, nombre cada línea y no escriba, salvo retirada explícita — dev-lead
  - La forma de la retirada, `- REMOVED AND <texto literal>` (o `- REMOVED THEN …`), en la palabra clave que ya usa el delta — sin el dev-lead (delegada: «decide en el patch la forma más simple»)
  - Comparar por recuento y no línea a línea: un `MODIFIED` que edita el texto de un `THEN` (el caso normal, y el del test «fusiona ADDED, MODIFIED…») no pierde nada y no pide retirada. Límite: un delta que quita una línea y añade otra distinta no se detecta — sin el dev-lead
  - Subir los topes de palabras en lugar de recortar otra frase de la plantilla (un recorte también pediría su RED/GREEN): `sdd-templates` 11980 → 11990, kit 53930 → 53945 — sin el dev-lead (deriva de la orden de documentarlo en §6)

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: vivo con cuatro `AND`, delta con tres | ❌ antes: `sustituido`, sale con 0 y pierde el cuarto `AND` · ✅ ahora: falla nombrando `- AND el CLI lo apunta en el historial` y no escribe |
| 2 | el mismo delta con `- REMOVED AND el CLI lo apunta en el historial` | ✅ sustituye, quita la línea, no copia la retirada; volver a ejecutarlo no cambia nada; `Test-Capabilities` da `Capacidades válidas: 1` |
| 3 | retirada que no casa con ninguna línea del vivo | ✅ no cuenta: sigue fallando con la línea que se perdería |
| 4 | control: `MODIFIED` que edita el `THEN` (test existente) | ✅ sustituye sin pedir retirada |
| 5 | `Merge-CapabilityDelta`, `Test-Capabilities`, `WordBudget`, `AnchorTemplates`, `Skills` | ✅ 298/0 |

Los casos los verificó el agente.

Validación en campo: 2026-10-05 · RED/GREEN en Merge-CapabilityDelta.Tests.ps1 (3 casos nuevos, 27/27) · pre-commit 949/0

## 5. Tiempo (ligero)

- Real: 0,5h

## 6. Delta de capacidad

### Capacidad: `capabilities`

**MODIFIED — La fusión del delta falla sin escribir nada**
- GIVEN la spec del requisito anterior con un `**MODIFIED — Anular una reserva**` más, que no está en `bookings.md`
- WHEN se ejecuta `Merge-CapabilityDelta.ps1`
- THEN escribe `spec.md: «Anular una reserva» del MODIFIED no está en capabilities/bookings.md`, sale con 1 y no cambia ningún fichero de `capabilities/`, tampoco por el ADDED y el REMOVED que sí podía aplicar
- AND con un `- THEN se rechaza, por la decisión 10` en «Cancelar una reserva», escribe `spec.md: «Cancelar una reserva» cita la spec («decisión 10»): reescríbelo en el delta sin la referencia y vuelve a ejecutar`, sale con 1 y no escribe
- AND la misma frase entre comillas invertidas (`` `por la decisión 10` ``), como ejemplo, no cuenta como cita
- AND un `ADDED` que ya está en la capacidad con las mismas líneas no se duplica ni falla; con otras líneas falla con `spec.md: «Cancelar una reserva» del ADDED ya está en capabilities/bookings.md con otro texto: usa MODIFIED`
- AND un `REMOVED` cuyo título ya no está escribe `bookings.md: «Consultar salas libres» ya no estaba` y no falla
- AND una capacidad del delta sin fichero se crea solo si el bloque «Capacidades» de una spec la declara con `- Nuevas: \`rooms\` — Salas, su aforo y su mantenimiento`: `# Capacidad — rooms`, `## Propósito` con «Salas, su aforo y su mantenimiento», y sus requisitos; sin esa línea, o desde un `patch.md`, falla con `spec.md: «rooms» no tiene fichero en capabilities/ y el bloque no la declara en «Nuevas»`
- AND un `MODIFIED` con menos líneas `- THEN` y `- AND` que el requisito vivo falla con `spec.md: «Reservar una franja» del MODIFIED perdería «- AND <texto>» de capabilities/bookings.md: cópiala en el delta o retírala con «- REMOVED AND <texto>»`, una línea por cada una del vivo que no copió, y no escribe; con la retirada `- REMOVED AND <texto literal>` en el bloque, la quita y no la copia a la capacidad, y una retirada que no casa con ninguna línea del vivo no cuenta
