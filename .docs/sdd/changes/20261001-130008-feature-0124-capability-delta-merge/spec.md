---
id: 20261001-130008-feature-0124-capability-delta-merge
feature: 0124
title: La fusión del delta de capacidades como script
mode: full
status: approved
created: 2026-10-01
author: Claude (sesión del dev-lead)
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-10-01
---

# Spec — La fusión del delta de capacidades como script

> **Estado**: approved (por delegación).
> **Siguiente paso**: `plan.md` con `superpowers:writing-plans`.

## Capacidades

- Modificadas: `capabilities` — añade «La fusión del delta es un script» y «La fusión del delta falla sin escribir nada»; cambia «El cierre fusiona el delta en la verdad viva», «El cierre de un patch fusiona su delta», «El delta declara el comportamiento por capacidad» y «El validador de capacidades»

## Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: ninguna — señales: contrato público (el script nuevo y la forma del fichero de capacidad que leen el validador y el índice), MODIFIED (cuatro requisitos de `capabilities`) · tamaño: ~450 líneas en 12 ficheros, la mayoría script y tests Pester
- Mínimo razonable: ninguna — deja sin mirar a otro par de ojos si las reglas de fusión del script (idempotencia del ADDED, el REMOVED que ya no está) encajan con cómo se reabre un cierre a medias en campo
```

1. **Interfaz**: `Merge-CapabilityDelta.ps1 -Path <.docs/sdd> -Artifact <spec.md|patch.md>`, en `skills/sdd-templates/scripts/`, con los mismos parámetros que `Test-Capabilities.ps1`. Se ejecuta antes que el validador, y el validador sigue siendo el que da el visto bueno.
2. **Todo o nada.** El script calcula la fusión de todas las capacidades del delta antes de escribir. Si hay cualquier fallo, escribe una línea por fallo, sale con 1 y no toca ningún fichero. Así un cierre que falla a medias no deja la capacidad medio fusionada, que es lo que costó las vueltas de los tickets.
3. **Una referencia a la spec bloquea la fusión, no solo avisa.** La fila pedía «avisar». Pero en la 0035, al limpiar la referencia solo en la capacidad, el validador rechazó la capacidad porque ya no coincidía con el delta. Por eso el script falla y pide corregir el delta, y lo fusionado coincide siempre con la spec. Solo se detecta «decisión N» o «decisiones N y M», y fuera del código en línea: «la spec» aparece con sentido legítimo en las capacidades de este repo, que hablan de specs, y un ejemplo entre comillas invertidas (como los de esta misma spec) no es una cita. Corregido en el repaso de coherencia: sin esa excepción, el script rechazaba el delta de esta spec.
4. **Volver a ejecutarlo es seguro.** Un `ADDED` que ya está con las mismas líneas no se duplica. Un `MODIFIED` ya aplicado no cambia nada. Un `REMOVED` cuyo título ya no está escribe «ya no estaba» y no falla. Solo falla un `ADDED` cuyo título ya existe con otro texto, que debió ser `MODIFIED`.
5. **Normaliza el fichero entero que toca a la forma de `capability-template.md`**: una línea en blanco tras cada título y entre bloques, y ninguna doble. Las capacidades de este repo no llevan línea en blanco tras el `###` de cada requisito (261 de 261): la primera fusión en cada una se la añade, y el diff de ese cierre crece una vez. Obligarla en el validador y normalizar en la migración es de la 0129.
6. **Del delta solo pasan los escenarios.** Quedan fuera la línea `- Se valida en:`, las líneas de ayuda `>` y el `(antes: …)`, también cuando ocupa varias líneas. Las líneas sangradas que continúan un escenario sí pasan.
7. **Crea la capacidad declarada en «Nuevas».** El título sale del nombre y el propósito, de la línea `- Nuevas: \`<nombre>\` — <qué cubre>`. Sin esa línea, o desde un `patch.md`, falla: el script nunca crea una capacidad que el artefacto no declare.
8. **Las reglas se fusionan por nombre.** Cada entrada `- **<Nombre>**: <valor>` del bloque «Reglas de la capacidad» del delta sustituye entera a la vigente con ese nombre. Si no está, se añade en el orden canónico de las cinco. Si la capacidad no tiene `## Reglas de la capacidad`, se crea al final.
9. **El parser del delta es uno.** `Get-DeltaRequirements` sale de `Test-Capabilities.ps1` a `CapabilitySections.ps1` y gana `REMOVED` y las reglas. Así el script y el validador leen el delta igual. Si lo leyeran distinto, el validador podría rechazar lo que el script fusionó.
10. **Validador más estricto en dos casos sin coste para este repo.** Falla con una línea suelta bajo un requisito: la que no es `- …`, ni `>`, ni sangrada, ni está en blanco, como la segunda línea de un «(antes: …)» partido. Y falla con una línea `- Se valida en:` en una capacidad, como resto de delta. Las 14 capacidades de este repo pasan hoy las dos comprobaciones (comprobado al escribir la spec).
11. **Texto de las skills, el mínimo.** El paso 4 de `sdd-end-feature`, su detalle en `aprendizajes-skills.md` y el bloque «Capacidades» del paso 1 de `sdd-end-patch` nombran el comando y dicen qué hacer si falla: corregir el artefacto y volver a ejecutarlo, nunca fusionar a mano. El paso 7 de `sdd-start-feature` dice que el borrador del delta fusionado sale del mismo script. `spec-template.md` dice que un THEN no cita decisiones de la spec por número. `patch-template.md` no cambia: remite a «la misma forma que el delta de `spec-template.md`». `capability-template.md` tampoco: su regla 3 describe qué hace la fusión, y sigue siendo cierta. De `sdd-end-feature` y `sdd-end-patch` solo se toca el paso de fusión, porque la 0050 y la 0120 van en paralelo.
12. **Migración**: la v2.3.0 sigue sin pasos nuevos por esta feature. El script es del kit y no se copia al proyecto.
13. **Campaña (Art. I), previsión de la feature entera.** Sujetos Sonnet headless sobre el molde sintético `salas`, con `capabilities/bookings.md` en la forma de la plantilla. RED con el kit de `develop` y GREEN con el de la rama. Previsión: 5 sujetos en el RED, 5 en el GREEN y 3 de reserva; ~4 $ y ~70 min. Techo: 7 $ y 2 h. Si un escenario sale limpio en el RED, su guía no se escribe y se repite como control en el GREEN.
    - `f1` (`sdd-end-feature`, paso 4): una spec cerrándose con el delta del escenario de «La fusión del delta es un script». Petición: «haz solo el paso 4 de sdd-end-feature: fusiona el delta y valida; no commitees». Se mide si la capacidad queda bien sin editar a mano: el `MODIFIED` aplicado, ninguna línea del «(antes: …)» suelta, sin «Se valida en:», las líneas en blanco de la plantilla y el validador en verde. En el GREEN se mide además que usa el script. 2 sujetos por fase.
    - `p1` (`sdd-end-patch`, paso 1): un `patch.md` con un `MODIFIED` de `bookings` y el encabezado partido. Se mide lo mismo que en `f1`. 1 sujeto por fase.
    - `t1` (`spec-template.md`): una spec a medias con cinco decisiones numeradas, dos de ellas reglas de negocio, y la petición «completa la sección Delta de comportamiento». Se mide si algún THEN o AND cita «decisión N». 2 sujetos por fase.
    - Sin escenario: el paso 7 de `sdd-start-feature` (una frase que remite al comando que mide `f1`) y `aprendizajes-skills.md` (el detalle del paso que mide `f1`, que el sujeto puede abrir o no: `f1` lo mide en los dos casos).

### Decisiones tomadas con el dev-lead

- Feature full, perfil `delegate` del proyecto, fila 0124 como enunciado, partida en dos: la 0124 se queda con la fusión, y el marcador de legado o puntero, la línea en blanco obligatoria y su migración pasan a la 0129 (id reservado), 2026-10-01 — opción «Partir en dos (Recomendada)» de la primera pregunta.
- La 0129 va en la release siguiente, no en la 2.3.0, 2026-10-01 — opción «Release siguiente».
- Spec aprobada por delegación, 2026-10-01 — opción «Apruebo por delegación» de la primera pregunta («Apruebas la spec ahora; sigo sin parar hasta el cierre (validación en campo)»).

## Intent

Al cerrar, el agente fusiona el delta de capacidades a mano o con un script que improvisa. Cinco casos en dos proyectos lo muestran: ~10 min en el camino crítico de cada cierre con delta, líneas en blanco perdidas o dobles, la segunda línea de un «(antes: …)» suelta en la capacidad, un `MODIFIED` sin aplicar, y líneas «Se valida en:» o «por la decisión 10» llevadas a la verdad viva. Con el script del kit, la fusión es un comando que no deja la capacidad a medias. El validador además caza los dos restos que hoy se le escapan.

## Scope

- Entra: `skills/sdd-templates/scripts/Merge-CapabilityDelta.ps1` (nuevo), `CapabilitySections.ps1` (el parser del delta, compartido), `Test-Capabilities.ps1` (línea suelta y «Se valida en:»), `skills/sdd-templates/SKILL.md` (fila del script nuevo y de los dos que cambian), `tests/Merge-CapabilityDelta.Tests.ps1` (nuevo, con un test contra `spec-template.md` calcada sin tocar y otro rellenada a medias), `tests/Test-Capabilities.Tests.ps1`.
- Entra: el paso 4 de `skills/sdd-end-feature/SKILL.md` y su detalle en `references/aprendizajes-skills.md`, la frase de fusión del paso 1 de `skills/sdd-end-patch/SKILL.md`, la frase del borrador del paso 7 de `skills/sdd-start-feature/SKILL.md` y la ayuda del delta de `skills/sdd-templates/templates/spec-template.md`.
- Entra: la campaña RED/GREEN de `f1`, `p1` y `t1` (`tests/capability-merge-red.md` y `-green.md`) y la entrada del changelog en `[Unreleased]`.
- No entra: el marcador de legado o puntero, la línea en blanco obligatoria en el validador y su paso de migración (0129). Tampoco el resto de pasos de `sdd-end-feature` y `sdd-end-patch` (0050 y 0120 en paralelo), `patch-template.md` ni `capability-template.md` (decisión 11).
- No entra: normalizar ahora las capacidades de este repo que el delta no toca (decisión 5).

## Approach

Un script PowerShell del kit, junto al validador y con su mismo parser del delta, que aplica el delta de una spec o un `patch.md` a `capabilities/`: todo o nada, idempotente, y con el fichero que toca en la forma de la plantilla. Las skills de cierre lo nombran en su paso de fusión, y el validador sigue siendo la puerta del commit. La regla de no citar decisiones va a la plantilla, que previene, y al script, que lo impide.

## Delta de comportamiento

### Capacidad: `capabilities`

**ADDED — La fusión del delta es un script**
- GIVEN `capabilities/bookings.md` con los requisitos «Consultar salas libres» y «Reservar una franja», y la regla «**Avisos**: aviso si la reserva pisa un festivo»
- AND una spec cuyo delta de `bookings` trae `**ADDED — Cancelar una reserva**` con la línea `- Se valida en: worktree con la base al día`, `**MODIFIED — Reservar una franja** (antes: «la reserva queda⏎guardada»)` con el encabezado en dos líneas, `**REMOVED — Consultar salas libres**` y la regla `**Avisos**: aviso si la reserva pisa un festivo o dura más de 4 h`
- WHEN se ejecuta `pwsh -NoProfile -File <sdd-templates>/scripts/Merge-CapabilityDelta.ps1 -Path .docs/sdd -Artifact <spec.md>`
- THEN `bookings.md` tiene «Reservar una franja» con las líneas de escenario del delta, «Cancelar una reserva» al final de `## Requisitos` sin la línea «Se valida en:», y ya no tiene «Consultar salas libres»
- AND su entrada «Avisos» dice «aviso si la reserva pisa un festivo o dura más de 4 h», y las otras cuatro reglas no cambian
- AND ninguna línea del «(antes: …)» ni ninguna línea de ayuda `>` del delta llega a la capacidad
- AND el fichero queda con una línea en blanco tras cada título y entre bloques, sin líneas en blanco dobles
- AND el script escribe una línea por cambio (`bookings.md: añadido «Cancelar una reserva»`, `bookings.md: sustituido «Reservar una franja»`, `bookings.md: quitado «Consultar salas libres»`, `bookings.md: regla «Avisos» sustituida`) y sale con 0
- AND justo después, `Test-Capabilities.ps1 -Path .docs/sdd -Artifact <spec.md>` escribe `Capacidades válidas: 1` y sale con 0

**ADDED — La fusión del delta falla sin escribir nada**
- GIVEN la spec del requisito anterior con un `**MODIFIED — Anular una reserva**` más, que no está en `bookings.md`
- WHEN se ejecuta `Merge-CapabilityDelta.ps1`
- THEN escribe `spec.md: «Anular una reserva» del MODIFIED no está en capabilities/bookings.md`, sale con 1 y no cambia ningún fichero de `capabilities/`, tampoco por el ADDED y el REMOVED que sí podía aplicar
- AND con un `- THEN se rechaza, por la decisión 10` en «Cancelar una reserva», escribe `spec.md: «Cancelar una reserva» cita la spec («decisión 10»): reescríbelo en el delta sin la referencia y vuelve a ejecutar`, sale con 1 y no escribe
- AND la misma frase entre comillas invertidas (`` `por la decisión 10` ``), como ejemplo, no cuenta como cita
- AND un `ADDED` que ya está en la capacidad con las mismas líneas no se duplica ni falla; con otras líneas falla con `spec.md: «Cancelar una reserva» del ADDED ya está en capabilities/bookings.md con otro texto: usa MODIFIED`
- AND un `REMOVED` cuyo título ya no está escribe `bookings.md: «Consultar salas libres» ya no estaba` y no falla
- AND una capacidad del delta sin fichero se crea solo si el bloque «Capacidades» de una spec la declara con `- Nuevas: \`rooms\` — Salas, su aforo y su mantenimiento`: `# Capacidad — rooms`, `## Propósito` con «Salas, su aforo y su mantenimiento», y sus requisitos; sin esa línea, o desde un `patch.md`, falla con `spec.md: «rooms» no tiene fichero en capabilities/ y el bloque no la declara en «Nuevas»`

**MODIFIED — El cierre fusiona el delta en la verdad viva** (antes: «THEN cada `ADDED` se añade a `capabilities/<capability>.md`…» — ahora lo hace un script)

- GIVEN una feature cerrándose vía `sdd-end-feature` con un delta en su spec
- WHEN se ejecuta el paso de fusión
- THEN el agente ejecuta `Merge-CapabilityDelta.ps1 -Path .docs/sdd -Artifact <spec.md>`, que añade cada `ADDED` a `capabilities/<capability>.md`, sustituye entero con cada `MODIFIED` el requisito con ese título, quita cada `REMOVED` y sustituye o añade por su nombre cada entrada de «Reglas de la capacidad»; el walkthrough referencia los escenarios del delta como casos del smoke
- AND si el script falla, el agente corrige lo que dice su mensaje (el delta de la spec, o la línea «Nuevas» del bloque) y lo vuelve a ejecutar; no fusiona a mano
- AND el borrador del delta fusionado que el paso 7 de `sdd-start-feature` escribe mientras trabaja el revisor final sale del mismo script
- AND la capacidad no gana ninguna línea de historial
- AND tras fusionar y antes del commit de cierre, `Test-Capabilities.ps1 -Path .docs/sdd -Artifact <spec.md>` pasa; si falla en lo fusionado o en el bloque, se corrige eso, no el validador
- AND un fallo en una capacidad que el delta no toca (`rooms.md` con un requisito sin THEN, mientras la 0020 fusiona en `bookings`) no bloquea el cierre: `rooms.md` no se edita y el informe final lo lista como pendiente del dev-lead
- AND `sdd-end-feature` no crea ningún fichero de capacidad que la spec no haya declarado

**MODIFIED — El cierre de un patch fusiona su delta** (antes: «AND `bookings.md` sustituye ese requisito, sin línea de historial»)

- GIVEN un proyecto con `.docs/sdd/capabilities/bookings.md`, cuyo requisito «Consultar salas libres» dice que `salas libres 10-12` lista las salas sin reserva en esa franja
- WHEN se cierra con `sdd-end-patch` el patch 0014, cuyo fix hace que `salas libres 10-12` deje fuera las salas en mantenimiento y las liste aparte con `(en mantenimiento)`
- THEN `patch.md` abre con `## Capacidades` y `- Modificadas: \`bookings\` — cambia «Consultar salas libres»`, y lleva la sección «Delta de capacidad» con `MODIFIED — Consultar salas libres` y el bloque entero del requisito con el cambio
- AND `Merge-CapabilityDelta.ps1 -Path .docs/sdd -Artifact <patch.md>` sustituye ese requisito en `bookings.md`, sin línea de historial
- AND `Test-Capabilities.ps1 -Path .docs/sdd -Artifact <patch.md>` pasa antes del commit de cierre, salvo en una capacidad que el delta no toca: esa no se edita y el mensaje final la lista como pendiente del dev-lead
- AND el cambio de `bookings.md` va en el commit de cierre del patch, y el fix con su `patch.md` queda en un solo commit
- AND si ninguna capacidad describe la pieza que cambió, no se crea ninguna, el bloque dice `Ninguna, porque ninguna capacidad describe <pieza>` y el mensaje final lo dice

**MODIFIED — El delta declara el comportamiento por capacidad** (antes: sin la regla de no citar decisiones)

- GIVEN una spec que cambia comportamiento observable
- WHEN se escribe su sección de delta
- THEN cada requisito va bajo una capacidad nombrada, marcado `ADDED`, `MODIFIED` o `REMOVED (motivo)`, con al menos un escenario `GIVEN / WHEN / THEN`
- AND un escenario de una regla de negocio lleva datos concretos de entrada y de salida («bolsa FR, IT, PT; oferta en DE → no cubre»), no una frase abstracta («una oferta fuera de la bolsa no cubre»)
- AND un THEN o un AND no cita las decisiones de la spec por número (`- THEN se rechaza, por la decisión 10`): la capacidad no tiene esas decisiones, y `Merge-CapabilityDelta.ps1` lo rechaza
- AND un `MODIFIED` copia el bloque entero del requisito con los cambios; `(antes: …)` es opcional y señala la cláusula que cambia
- AND si la capacidad no existe en `capabilities/`, su creación aparece en "Decisiones a validar"
- AND si un requisito introduce datos, nombres, topes, avisos o una condición de conflicto nuevos, la capacidad lleva su subsección «Reglas de la capacidad» con solo las entradas que cambian (dónde viven los datos · idioma de los nombres · límites · avisos · regla ante conflicto), cada una con su valor completo: con **Avisos**: A y B vigentes y una feature que añade C, la entrada dice A, B y C, porque `sdd-end-feature` sustituye o añade cada entrada entera por su nombre
- AND la lente dominio reclama las entradas que falten y marca como Crítico una regla que contradiga la constitution

**MODIFIED — El validador de capacidades** (antes: sin la línea suelta ni «Se valida en:»)

- GIVEN `.docs/sdd/capabilities/bookings.md` cuyo requisito `### Consultar salas libres` tiene GIVEN y WHEN pero no `- THEN`
- WHEN se ejecuta `pwsh -NoProfile -File <sdd-templates>/scripts/Test-Capabilities.ps1 -Path .docs/sdd`
- THEN sale con código 1 y escribe `bookings.md: «Consultar salas libres» no tiene escenario completo (falta - THEN)`
- AND también falla, nombrando fichero y, si aplica, requisito, ante: un título que no es `# Capacidad — <nombre del fichero sin .md>`; una sección `##` distinta de `## Propósito`, `## Requisitos` y `## Reglas de la capacidad` (una `## Historial` incluida); una marca de delta (`**ADDED —`, `**MODIFIED —`, `**REMOVED —`) en la capacidad; un bloque `**Reglas de la capacidad**` en negrita, que es la forma del delta; una sección de reglas a la que falte alguna de sus cinco entradas por nombre
- AND ante una línea suelta bajo un requisito —ni `- …`, ni `>`, ni sangrada, ni en blanco—, como la segunda línea de un «(antes: …)» partido, escribe `bookings.md: línea suelta en «Reservar una franja» (línea 14): «guardada»)»`
- AND ante una línea `- Se valida en:` en la capacidad escribe `bookings.md: resto de delta «Se valida en:» en la línea 15`
- AND ante `## Historial` el mensaje es `bookings.md: sección «Historial», resto del kit 1.x: lo quita la migración a 2.0.0`
- AND sin `## Propósito` escribe `bookings.md: falta la sección «Propósito»`; con la sección vacía, o solo con la ayuda `>` y el hueco `<…>` de la plantilla, `bookings.md: «Propósito» está vacío: escribe en una o dos frases qué cubre la capacidad`; con un propósito de 412 caracteres, medidos sobre el propósito en una sola línea como lo escribe el índice, `bookings.md: «Propósito» tiene 412 caracteres; el máximo es 300 (una o dos frases)`; y con `## Propósito` detrás de otra sección, `bookings.md: «Propósito» debe ser la primera sección`
- AND con `-Artifact <spec.md|patch.md>`, que se ejecuta después de fusionar el delta, falla si falta el bloque `## Capacidades`, si sus nombres no coinciden con las subsecciones `### Capacidad:` del delta, si no nombra ninguna capacidad ni dice «Ninguna, porque…» (`<a>: el bloque «Capacidades» está vacío: declara las capacidades o «Ninguna, porque <motivo>»`), si dice «Ninguna» y hay delta, si una capacidad del bloque no tiene fichero en `capabilities/`, o si un `patch.md` declara `- Nuevas:`
- AND con `-Artifact`, un `**ADDED — Cancelar una reserva**` del delta de `bookings` sin fusionar falla con `spec.md: «Cancelar una reserva» del delta no está en capabilities/bookings.md`, y un `**MODIFIED — Reservar una franja**` cuyas líneas `- GIVEN`, `- WHEN`, `- THEN` y `- AND` no son, en orden, las de ese requisito en la capacidad, con `spec.md: «Reservar una franja» del delta no coincide con capabilities/bookings.md`; el título cuenta entero aunque el encabezado, con su `(antes: «…»)`, ocupe varias líneas
- AND sin fallos escribe `Capacidades válidas: <n>` y sale con 0; sin carpeta `capabilities/`, o con la carpeta vacía, y sin `-Artifact`, escribe `Sin capacidades que validar` y sale con 0

**Reglas de la capacidad**
- **Avisos**: `Test-Capabilities.ps1` escribe una línea por fallo, `<fichero>: <qué falla>`, en castellano, y sale con 1; sin fallos, `Capacidades válidas: <n>`. `Merge-CapabilityDelta.ps1` escribe una línea por cambio, `<fichero>: añadido|sustituido|quitado «<requisito>»` o `<fichero>: regla «<nombre>» sustituida|añadida`, y sale con 0; con fallos, una línea por fallo, sale con 1 y no escribe ningún fichero. `Get-CapabilityIndex.ps1` marca con `(sin propósito)` la capacidad que no lo tiene, y sale con 0.

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-10-01 | aprobada por delegación: «Apruebo por delegación» (primera pregunta) |
