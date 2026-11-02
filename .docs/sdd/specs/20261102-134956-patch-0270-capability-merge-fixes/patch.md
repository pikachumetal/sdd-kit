---
id: 20261102-134956-patch-0270-capability-merge-fixes
task: 0270
title: Patch — sdd capability merge compara los huecos con el vivo y rechaza lo que check rechazaría
type: patch
solution: causa raíz
status: done
created: 2026-11-02
branch: patch/0270-capability-merge-fixes
commit: pendiente
---

# Patch 0270 — `sdd capability merge` compara los huecos con el vivo y rechaza lo que check rechazaría

Validación: agente, «Perfil delegate» — `validation.mode: field`: el uso real lo validan los tickets.

## Capacidades

- Modificadas: `capabilities` — «La fusión del delta falla sin escribir nada» gana los huecos frente al vivo y lo que `sdd capability check` rechazaría

## 1. Síntoma

Dos fallos opuestos del mismo verbo:

- Ticket de la feature 0129 §1: un `MODIFIED` que copia un requisito vivo con `\`<nombre>\`` responde `spec.md: «<nombre>» es un hueco de la plantilla: rellénalo o borra lo que no aplique`. La 0129 lo esquivó con un `ADDED` aparte.
- Ticket de la feature 0279 §2: `capability merge` copió «Prueba en una copia…» a `migration.md` sin avisar, y `sdd capability check` falló después con `línea suelta en «Lo que escribe una migración lo reciben también las init»`; el pre-commit rechazó el commit.

Otro caso, en los menores de la 0272: `check` rechazó «Ninguna:» sin «porque», que `merge` no mira. Es una regla del bloque «Capacidades», no del requisito escrito, y queda fuera de este patch por alcance del dev-lead.

## 2. Causa raíz

Reproducidas las dos con `cli/test/capability/merge.test.ts` antes de tocar el código (4 rojos; los 3 de regresión ya en verde).

- **Hueco en una línea copiada**: `entryProblem` (`merge.ts`) comprueba todas las líneas del delta sin mirar el vivo, tras quitar el código con `` /`[^`]*`/g ``. En `` `### Capacidad: \`<nombre>\`` `` esa expresión empareja `` `### Capacidad: \` `` y `` \`` ``, así que `<nombre>` queda fuera de todo código y coincide con un literal de `spec-template.md`. El patch 0154 acotó qué es un hueco, pero siguió comprobando líneas que ya estaban aprobadas.
- **Línea suelta aceptada**: `merge` y `check` no comparten ninguna regla de forma del requisito. `mergeableLines` solo quita las líneas de ayuda, `Se valida en`, `motivo` y `REMOVED`, y todo lo demás se copia. `looseLineProblems` y `scenarioProblems` viven privadas en `check.ts`, y solo corren sobre el fichero ya escrito.

## 3. Fix

- **Fichero(s)**: `cli/src/capabilities/merge.ts`, `cli/src/capabilities/check.ts`, `cli/test/capability/merge.test.ts`, `.docs/sdd/capabilities/capabilities.md` (por el delta).
- **Cambio**: los huecos de un `MODIFIED` se comprueban solo en las líneas que no están, literales, en el requisito vivo. `check.ts` exporta `writtenRequirementProblems`, sobre las mismas `scenarioProblems` y `looseLines` que usa `check`, y `merge` la llama por cada `ADDED` y `MODIFIED` antes de escribir.
- **Decisiones**:
  - Comparar con el vivo y no afinar la expresión; una sola lógica, sin copiarla — dev-lead
  - Un hueco nuevo sigue parando, también en una línea cambiada de un `MODIFIED` — dev-lead
  - El título y el nombre de capacidad se siguen comprobando siempre: la exención es solo de líneas — sin el dev-lead
  - «Lo que check rechazaría en el requisito» son la línea suelta y el escenario incompleto. Los restos de delta no hacen falta: `deltaEntries` corta en esas marcas y `mergeableLines` quita `Se valida en`, así que no llegan al requisito — sin el dev-lead
  - El mensaje de `merge` es el de `check` sin el «(línea N)»: el fichero aún no está escrito, y ese número no apuntaría a nada; la línea se nombra literal — sin el dev-lead

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: `npx vitest run test/capability/merge.test.ts`, antes del fix | ❌ 4 rojos de 59: la copia literal y los tres de lo que `check` rechazaría; los de un hueco que sigue parando, ya en verde |
| 2 | GREEN: `npx vitest run test/capability` | ✅ 146/146 · suite |
| 3 | `MODIFIED` de «La spec y el patch declaran sus capacidades al principio», el que la 0129 no pudo fusionar, con sus dos líneas `\`<nombre>\`` copiadas y otra cambiada, sobre una copia de `capabilities/` | ✅ `capabilities.md: sustituido «…»`, sale con 0 · ejecución real |
| 4 | el mismo delta con `- AND el aviso sale en <nombre>` | ✅ `patch.md: «<nombre>» es un hueco de la plantilla: rellénalo o borra lo que no aplique`, sale con 1, fichero igual · ejecución real |
| 5 | el mismo delta con la línea `Prueba en una copia de .docs/sdd` | ✅ `patch.md: línea suelta en «…»: «Prueba en una copia de .docs/sdd»`, sale con 1, fichero igual · ejecución real |
| 6 | el delta de este patch sobre una copia: `capability merge` y después `capability check` | ✅ los dos salen con 0 · ejecución real |
| 7 | un problema en un requisito que el delta no toca no para la fusión | ✅ suite |

Los casos los verificó el agente.

Validación en campo: 2026-11-02 · RED→GREEN en `test/capability` 146/146 · smoke real de los casos 3 a 6 · el gate de cierre corre en la base integrada, porque `feature/0271-clean-red-rules` está abierta a la vez

## 5. Tiempo (ligero)

- Estimación: 0,5 h + 0,07 h del gate de cierre (4 min, patch 0286)
- Inicio: 2026-11-02T13:49Z

## 6. Delta de capacidad

### Capacidad: `capabilities`

#### MODIFIED — La fusión del delta falla sin escribir nada

- GIVEN la spec del requisito anterior con un `**MODIFIED — Anular una reserva**` más, que no está en `bookings.md`
- WHEN se ejecuta `sdd capability merge`
- THEN escribe `spec.md: «Anular una reserva» del MODIFIED no está en capabilities/bookings.md`, sale con 1 y no cambia ningún fichero de `capabilities/`, tampoco por el ADDED y el REMOVED que sí podía aplicar
- AND con un `- THEN se rechaza, por la decisión 10` en «Cancelar una reserva», escribe `spec.md: «Cancelar una reserva» cita la spec («decisión 10»): reescríbelo en el delta sin la referencia y vuelve a ejecutar`, sale con 1 y no escribe
- AND la misma frase entre comillas invertidas (`` `por la decisión 10` ``), como ejemplo, no cuenta como cita
- AND un `ADDED` que ya está en la capacidad con las mismas líneas no se duplica ni falla; con otras líneas falla con `spec.md: «Cancelar una reserva» del ADDED ya está en capabilities/bookings.md con otro texto: usa MODIFIED`
- AND un `REMOVED` cuyo título ya no está escribe `bookings.md: «Consultar salas libres» ya no estaba` y no falla
- AND una capacidad del delta sin fichero se crea solo si el bloque «Capacidades» de una spec la declara con `- Nuevas: \`rooms\` — Salas, su aforo y su mantenimiento`: `# Capacidad — rooms`, `## Propósito` con «Salas, su aforo y su mantenimiento», y sus requisitos; sin esa línea, salvo una capacidad en `- Retiradas:` cuyo delta solo trae `REMOVED`, o desde un `patch.md`, falla con `spec.md: «rooms» no tiene fichero en capabilities/ y el bloque no la declara en «Nuevas»`
- AND un `MODIFIED` con menos líneas `- THEN` y `- AND` que el requisito vivo falla con `spec.md: «Reservar una franja» del MODIFIED perdería «- AND <texto>» de capabilities/bookings.md: cópiala en el delta o retírala con «- REMOVED AND <texto>»`, una línea por cada una del vivo que no copió, y no escribe; con la retirada `- REMOVED AND <texto literal>` en el bloque, la quita y no la copia a la capacidad, y una retirada que no casa con ninguna línea del vivo no cuenta
- AND un literal de `spec-template.md` en una línea de un `MODIFIED` que ya está, literal, en el requisito vivo no cuenta como hueco; en una línea nueva o cambiada, o en un `ADDED`, falla con `spec.md: «<título estable>» es un hueco de la plantilla: rellénalo o borra lo que no aplique` y no escribe
- AND una línea que no empieza por `- `, `>` ni un espacio, en un `ADDED` o un `MODIFIED`, falla con `spec.md: línea suelta en «Cancelar una reserva»: «<la línea>»`, y un escenario sin `- GIVEN`, `- WHEN` o `- THEN` falla con `spec.md: «Cancelar una reserva» no tiene escenario completo (falta - WHEN)`, las dos con la comprobación de `sdd capability check`, y no escribe
