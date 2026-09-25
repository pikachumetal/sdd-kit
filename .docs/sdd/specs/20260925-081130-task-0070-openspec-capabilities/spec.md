---
id: 20260925-081130-task-0070-openspec-capabilities
task: 0070
title: Capacidades al estilo OpenSpec — sin Historial, con validador y con bloque «Capacidades»
mode: full
profile: delegate
status: approved
created: 2026-09-25
author: agente (Opus 5.5)
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-09-25
---

# Spec — Capacidades al estilo OpenSpec

## Capacidades

- Modificadas: `capabilities` — «El cierre fusiona el delta en la verdad viva», «El cierre de un patch fusiona su delta», «Un patch que devuelve el comportamiento a la capacidad no lleva delta» y «El volcado inicial es una excepción de greenfield»; añade «La spec y el patch declaran sus capacidades al principio», «Una capacidad no guarda historial» y «El validador de capacidades»
- Modificadas: `migration` — añade «La migración a v2.0.0 quita el historial de las capacidades»

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: contrato público (`spec-template.md`, `patch-template.md` y el formato de `capabilities/*.md` que leen los proyectos), MODIFIED (cuatro requisitos de `capabilities`), datos o migración (`migrations/v2.0.0.md`)
- Dominio: si los cuatro `MODIFIED` de `capabilities` conservan todas las cláusulas vigentes salvo la del historial (señal: MODIFIED)
- Técnica: si las reglas de «El validador de capacidades» pasan sobre las 13 capacidades reales una vez quitado el historial, y si el paso de la migración choca con `MigrationInitParity.Tests.ps1` o con la `v2.0.0.md` de la 0062 (señal: contrato público + migración)
- Mínimo razonable: solo técnica — deja sin mirar la conservación de cláusulas de los `MODIFIED`, que cubre mi repaso de coherencia comparando cada bloque con el requisito vigente

**Decidido por mí, con la delegación: un revisor, lente técnica** (Sonnet, `sdd-kit:effort-medium`). La lente dominio la cubre el repaso de coherencia; dos revisores en paralelo pedirían tu confirmación (tu `CLAUDE.md` global).

1. **Orden del bloque en la plantilla**: `## Capacidades` va justo tras el título, antes de «Decisiones que he tomado yo». Al presentar una spec en el gate, la skill sigue empezando por las decisiones: el orden del fichero no cambia la presentación. En `patch.md` va sin número, antes de «## 1. Síntoma», para que §1–§6 no se renumeren: `Build-EstimationLog.ps1` lee el tiempo de §5.
2. **Motivos de «Ninguna, porque…»**: refactor, herramientas o docs, como pidió el dev-lead, y en un patch dos más que salen del carril: «el fix devuelve `<comando>` a lo que ya dice `<capacidad>`» (la salida corta de la 0067) y «ninguna capacidad describe `<pieza>`». El validador comprueba solo que tras «Ninguna, porque» hay un motivo, no cuál.
3. **La pieza (4) pasa a deuda** — RED de 8 sujetos (3,32 $): el cierre con un `MODIFIED` que otra task cambió conservó la cláusula del patch 6 de 6 veces, las dos últimas sin la pista del `(antes:)`; los sujetos lo vieron al leer la capacidad y el `patch.md` de la 0014. Posible falso negativo: el molde es un repo pequeño y en campo se detectó al integrar. Nueva fila de deuda con esta evidencia y el disparador observable (un `MODIFIED` cuyo requisito cambió en la base tras escribirse la spec). Además, el ensayo del molde mostró que la propuesta del ticket fallaría tal cual: tras integrar `develop`, el `merge-base` ya es la punta de `develop` y no ve el cambio; la fila de deuda lo anota con la comparación que sí funciona, contra el commit que añadió la spec.
4. **El bloque entra aunque el RED de nombres salió limpio** (2 de 2 reutilizaron `bookings`): no corrige un fallo medido, es la forma que el dev-lead pidió para declarar las capacidades en un solo sitio. La línea «reutiliza el nombre exacto tras listar `capabilities/`» queda en la ayuda de la plantilla, sin prohibición ni tabla, y el GREEN la mide como control.
5. **Qué valida `Test-Capabilities.ps1`**: título `# Capacidad — <nombre del fichero>`; solo `## Requisitos` y `## Reglas de la capacidad` como secciones; cada requisito con escenario completo (líneas `- GIVEN`, `- WHEN` y `- THEN`); ninguna marca de delta, incluido el bloque `**Reglas de la capacidad**` en negrita, que es la forma del delta; las cinco entradas de reglas por nombre si la sección existe (una entrada de más, como «Contrato de lectura del roadmap» de `task-ids`, se admite). Con `-Artifact`, y siempre después de fusionar, el bloque frente al delta. La auditoría a mano de las 13 capacidades del repo daba todo bien salvo el `## Historial`; la review encontró que `migration`, `roadmap`, `task-flow` y `task-ids` llevan el bloque de reglas del delta pegado dentro de un requisito, con 2, 3, 2 y 6 entradas. Entra en esta task pasarlos a `## Reglas de la capacidad` con las cinco entradas: el valor que falte sale de los requisitos de la capacidad, y si no lo dicen, «no aplica». No valida el contenido de una regla (la pérdida de la 0059 era de contenido dentro de una entrada presente): eso sigue en la regla de valor completo de la plantilla.
6. **`## Historial` es un fallo del validador**, con el mensaje «resto del kit 1.x: lo quita la migración a 2.0.0». Un proyecto sin migrar lo ve en su primer cierre.
7. **La migración quita el historial sin gate**: la sección vive en git y el dev-lead la ve en el diff, como las sustituciones de texto. El README de migraciones pide gate para borrados de ficheros o de memoria, que no se recuperan igual.
8. **Dónde va cada regla**: la ejecución del validador, en el `SKILL.md` de cada cierre (`sdd-end-task` paso 4 y `sdd-end-patch` paso 1), no solo en `aprendizajes-skills.md`: en la task 0013 una regla que vivía solo en esa referencia se leyó 0 de 2 veces. El bloque, solo en las plantillas: `sdd-start-task` ya manda calcar `spec-template.md`, y `sdd-start-patch` es de la 0062.
9. **Campaña (Art. I), previsión y techo comunes, declarados antes del primer sujeto y ampliados con la tanda que aprobó el dev-lead**: RED 8 sujetos (3,32 $, hecho); GREEN 4 escenarios y 7 sujetos (~3 $): la spec con el bloque (2), el cierre de task (2), el cierre de patch con delta (2) y el patch sin delta (1). Filas de control de lo que el RED ya cumplía en los pasos tocados: nombre exacto reutilizado, `MODIFIED` en bloque entero con datos, regla con valor completo, la cláusula del 0014 conservada al fusionar y la salida corta del patch. Techo: `SUBJECT_CAP=17`, `COST_CAP=16`, con el fichero `stop`; deja 2 sujetos para una tanda de REFACTOR.
10. **Primera pregunta**: te recomendé seguir entera, y la skill pide recomendar partir cuando el plan prevé más de 3 tasks. Lo recomendé porque las tres piezas se validan con el mismo script y salen en una sola migración.

### Hallazgos de la review

- **Rechazado** — 1. Crítico: el delta escribe `**Reglas de la capacidad**` en negrita y el validador lo rechazaría → es la forma del delta en `spec-template.md`; la fusión lo lleva a la sección `## Reglas de la capacidad` de la capacidad. Pero el hallazgo destapó el 2, y el validador trata ahora ese bloque en negrita dentro de una capacidad como resto de delta.
- **Aceptado** — 2. Crítico: `migration.md` tiene las reglas en negrita y con 2 de 5 entradas → confirmado y más amplio (también `roadmap`, `task-flow` y `task-ids`); entra en el Scope, la decisión 5 se corrige y el validador lo detecta.
- **Aceptado** — 3. Importante: un patch con `- Nuevas:` pasaría el validador → añadido a los fallos de `-Artifact`.
- **Aceptado** — 4. Importante: la comprobación de fichero de `-Artifact` da falso fallo antes de fusionar → el requisito dice que `-Artifact` se ejecuta después de fusionar.
- **Aceptado** — 5. Menor: nada comprueba `MigrationInitParity.Tests.ps1` → AND en el requisito de la migración.
- **Aceptado** — 6. Menor: carpeta `capabilities/` vacía sin salida definida → `Sin capacidades que validar`, como sin carpeta.

### Decisiones tomadas con el dev-lead

- Carril task, modo full, fila 0070 como enunciado — «Task full con la fila 0070 (Recomendada)» (2026-09-25).
- Sin partir — «Seguir entera (Recomendada)» (2026-09-25).
- Spec aprobada por delegación — «Apruebo la spec por delegación, nos vemos en la validación» (2026-09-25).
- Pieza (4) en la spec — «Integra develop, añádela a la spec como enmienda aprobada y sigue.» (2026-09-25); y después, fuera por el RED — «Una tanda más sin «(antes:)» (Recomendada)» (2026-09-25).

## Intent

Las capacidades del kit ya siguen lo esencial de OpenSpec (requisitos vigentes, deltas `ADDED`/`MODIFIED`/`REMOVED`, fusión al cerrar), pero con tres huecos que han costado pérdidas en campo: el `## Historial` de cada capacidad hace chocar a dos cierres que fusionan en la misma (ticket 0067 §2); nada comprueba la capacidad fusionada, y dos fusiones perdieron reglas en silencio (0059 §1, 0061 §2). Además, qué capacidades toca un cambio está repartido entre «Decisiones» y el delta, y un cambio sin capacidad no lo dice. Se quiere que la capacidad sea solo requisitos y reglas, que la spec y el patch declaren arriba sus capacidades y que un validador lo compruebe al cerrar.

## Scope

- Entra: quitar `## Historial` de `capability-template.md`, de la regla de fusión (`aprendizajes-skills.md` paso 4 y `sdd-end-patch` paso 1), del volcado de `sdd-init-greenfield` y de las 13 capacidades del repo.
- Entra: `Test-Capabilities.ps1` en `sdd-templates/scripts/`, con sus tests Pester, y su ejecución en los cierres (`sdd-end-task` paso 4, `sdd-end-patch` paso 1) tras fusionar.
- Entra: bloque `## Capacidades` al principio de `spec-template.md` y de `patch-template.md`, con su ayuda, y el validador comprobando que coincide con el delta. Revierte la regla de la 0067 «no lleva sección ni línea de sin delta».
- Entra: pasar a `## Reglas de la capacidad`, con sus cinco entradas, el bloque de reglas del delta que quedó pegado en `migration`, `roadmap`, `task-flow` y `task-ids` (hallazgo 2 de la review).
- Entra: `migrations/v2.0.0.md` con el paso que quita el historial, como último hito y tras integrar `develop` (la 0062 escribe en la misma carpeta).
- No entra: la pieza (4) de la fila, fusionar un `MODIFIED` contra la base de la spec. El RED salió 6 de 6 limpio, y pasa a deuda como posible falso negativo (decisión 3).
- No entra: capacidades anidadas, `RENAMED` ni la guarda de retirada (descartados en la consulta).
- No entra: `proposal.md` y la skill `sdd-plan` de la 0062, que usarán el mismo bloque; tampoco `sdd-start-task/SKILL.md` ni `sdd-start-patch/SKILL.md`: el bloque se pide en la plantilla, que es donde se escribe.
- No entra: validar specs, patches o capacidades históricas de otros proyectos; ni la convención de salida UTF-8 de scripts (deuda del ticket 0068 §3).

## Approach

Tres piezas de formato y una de proceso, en el orden en que se apoyan. Primero el validador, porque las otras tres se comprueban con él: script de PowerShell 7 portable, con la forma de los otros scripts de `sdd-templates/scripts/`, que lee `capabilities/` y, con `-Artifact`, la spec o el `patch.md` del cierre. Después, fuera el historial: plantilla, reglas de fusión, init y las 13 capacidades del repo, que el validador deja en verde. Tercero, el bloque «Capacidades» en las dos plantillas, con la comprobación del validador. La migración cierra, sobre `develop` recién integrado. Las skills se tocan con RED→GREEN proporcional (Art. I): el RED previo midió las dos conductas de campo, y el GREEN mide lo nuevo y, como control, lo que el RED ya cumplía en los pasos tocados.

## Delta de comportamiento

### Capacidad: `capabilities`

**ADDED — La spec y el patch declaran sus capacidades al principio**
- GIVEN un proyecto con `capabilities/bookings.md` y la fila 0021 «Cancelar una reserva: `salas cancelar <sala> <franja>` libera la franja»
- WHEN se escribe la spec de la 0021
- THEN la spec abre, tras el título, con `## Capacidades` y la línea `- Modificadas: \`bookings\` — añade «Cancelar una reserva»`, escrita tras listar `capabilities/` y con el nombre exacto del fichero (`bookings`, no `reservations` ni `booking`)
- AND cada capacidad del bloque tiene su subsección `### Capacidad: \`<nombre>\`` en el delta, y ninguna subsección del delta falta en el bloque
- AND una capacidad que no existe en `capabilities/` va como `- Nuevas: \`<nombre>\` — <qué cubre>`, y su creación aparece también en «Decisiones que he tomado yo»
- AND un cambio sin comportamiento observable lleva `Ninguna, porque <motivo>` (refactor, herramientas, docs) y no lleva delta
- AND `patch.md` abre con el mismo bloque; un patch no lleva «Nuevas»

**MODIFIED — El cierre fusiona el delta en la verdad viva** (antes: sin validador; la línea de historial la pedía la plantilla)
- GIVEN una task cerrándose vía `sdd-end-task` con un delta en su spec
- WHEN se ejecuta el paso de fusión
- THEN cada `ADDED` se añade a `capabilities/<capability>.md`, cada `MODIFIED` sustituye entero el requisito con ese título, cada `REMOVED` lo quita, y el walkthrough referencia los escenarios del delta como casos del smoke
- AND la capacidad no gana ninguna línea de historial
- AND tras fusionar y antes del commit de cierre, `Test-Capabilities.ps1 -Path .docs/sdd -Artifact <spec.md>` pasa; si falla, se corrige la fusión, no el validador
- AND `sdd-end-task` no crea ningún fichero de capacidad que la spec no haya declarado

**MODIFIED — El cierre de un patch fusiona su delta** (antes: "añade a «Historial» `- <fecha de cierre> — <carpeta del patch 0014> — MODIFIED Consultar salas libres`")
- GIVEN un proyecto con `.docs/sdd/capabilities/bookings.md`, cuyo requisito «Consultar salas libres» dice que `salas libres 10-12` lista las salas sin reserva en esa franja
- WHEN se cierra con `sdd-end-patch` el patch 0014, cuyo fix hace que `salas libres 10-12` deje fuera las salas en mantenimiento y las liste aparte con `(en mantenimiento)`
- THEN `patch.md` abre con `## Capacidades` y `- Modificadas: \`bookings\` — cambia «Consultar salas libres»`, y lleva la sección «Delta de capacidad» con `MODIFIED — Consultar salas libres` y el bloque entero del requisito con el cambio
- AND `bookings.md` sustituye ese requisito, sin línea de historial
- AND `Test-Capabilities.ps1 -Path .docs/sdd -Artifact <patch.md>` pasa antes del commit de cierre
- AND el cambio de `bookings.md` va en el commit de cierre del patch, y el fix con su `patch.md` queda en un solo commit
- AND si ninguna capacidad describe la pieza que cambió, no se crea ninguna, el bloque dice `Ninguna, porque ninguna capacidad describe <pieza>` y el mensaje final lo dice

**MODIFIED — Un patch que devuelve el comportamiento a la capacidad no lleva delta** (antes: "`patch.md` no lleva sección de delta ni línea de «sin delta»")
- GIVEN `bookings.md` con la regla «Límites: una reserva dura como máximo 2 h»
- WHEN se cierra el patch 0013, cuyo fix hace que `salas reservar Norte 10-13` se rechace, como ya decía la capacidad
- THEN `bookings.md` no cambia, y `patch.md` lleva en su bloque `## Capacidades` la línea `Ninguna, porque el fix devuelve \`reservar\` a lo que ya dice \`bookings\`` y ninguna sección de delta; si la traía vacía de la plantilla, se borra

**MODIFIED — El volcado inicial es una excepción de greenfield** (antes: "cada capacidad lleva en «Historial» la línea `- <YYYY-MM-DD> — init — ADDED volcado inicial desde el código`")
- GIVEN un `sdd-init-greenfield` sobre un proyecto con código, en el que el usuario pide generar las capacidades desde el código
- WHEN el agente atiende la petición
- THEN antes de escribir ningún fichero propone la partición (slugs en inglés kebab-case, sustantivos del dominio) y espera la aprobación
- AND presenta cada capacidad para su aprobación, como los documentos de anclaje
- AND ninguna capacidad lleva sección de historial
- AND si no puede leer el código entero en la sesión, lo dice y no vuelca
- AND el agente no propone el volcado si el usuario no lo pide

**ADDED — Una capacidad no guarda historial**
- GIVEN `capabilities/bookings.md` después de fusionar el patch 0014 y la task 0020
- WHEN se abre el fichero
- THEN tiene `## Requisitos` y, si aplica, `## Reglas de la capacidad`, y ninguna sección `## Historial`
- AND quién cambió cada requisito se lee en git (`git log -p -- .docs/sdd/capabilities/bookings.md`) y en la spec o el `patch.md` que lo declara en su bloque «Capacidades»

**ADDED — El validador de capacidades**
- GIVEN `.docs/sdd/capabilities/bookings.md` cuyo requisito `### Consultar salas libres` tiene GIVEN y WHEN pero no `- THEN`
- WHEN se ejecuta `pwsh -NoProfile -File <sdd-templates>/scripts/Test-Capabilities.ps1 -Path .docs/sdd`
- THEN sale con código 1 y escribe `bookings.md: «Consultar salas libres» no tiene escenario completo (falta - THEN)`
- AND también falla, nombrando fichero y, si aplica, requisito, ante: un título que no es `# Capacidad — <nombre del fichero sin .md>`; una sección `##` distinta de `## Requisitos` y `## Reglas de la capacidad` (una `## Historial` incluida); una marca de delta (`**ADDED —`, `**MODIFIED —`, `**REMOVED —`) en la capacidad; un bloque `**Reglas de la capacidad**` en negrita, que es la forma del delta; una sección de reglas a la que falte alguna de sus cinco entradas por nombre
- AND ante `## Historial` el mensaje es `bookings.md: sección «Historial», resto del kit 1.x: lo quita la migración a 2.0.0`
- AND con `-Artifact <spec.md|patch.md>`, que se ejecuta después de fusionar el delta, falla si falta el bloque `## Capacidades`, si sus nombres no coinciden con las subsecciones `### Capacidad:` del delta, si dice «Ninguna» y hay delta, si una capacidad del bloque no tiene fichero en `capabilities/`, o si un `patch.md` declara `- Nuevas:`
- AND sin fallos escribe `Capacidades válidas: <n>` y sale con 0; sin carpeta `capabilities/`, o con la carpeta vacía, y sin `-Artifact`, escribe `Sin capacidades que validar` y sale con 0

**Reglas de la capacidad**
- **Avisos**: `Test-Capabilities.ps1` escribe una línea por fallo, `<fichero>: <qué falla>`, en castellano, y sale con 1; sin fallos, `Capacidades válidas: <n>`.

### Capacidad: `migration`

**ADDED — La migración a v2.0.0 quita el historial de las capacidades**
- GIVEN un proyecto en el kit v1.2.0 con `capabilities/bookings.md` terminado en `## Historial` con dos líneas
- WHEN se migra al kit v2.0.0
- THEN `bookings.md` pierde la sección `## Historial` entera, con su ayuda y sus líneas, y nada más, sin gate
- AND la verificación de la migración ejecuta `Test-Capabilities.ps1 -Path .docs/sdd`; si falla por otra cosa que el historial (un bloque de reglas del delta pegado, un requisito sin escenario), el informe lo lista como pendiente del dev-lead, sin tocarlo
- AND `tests/MigrationInitParity.Tests.ps1` sigue en verde con `v2.0.0.md` en la carpeta
- AND sin carpeta `capabilities/`, el paso se salta y lo dice

## Enmiendas

- 2026-09-25 — Sale la pieza (4) y pasa a deuda — el RED salió 6 de 6 limpio, también sin la pista del `(antes:)` — aprobada: el dev-lead eligió «Una tanda más sin «(antes:)»», cuya opción decía «si sale limpia, pasa a deuda como posible falso negativo»
- 2026-09-25 — Entra la pieza (4), fusionar un `MODIFIED` contra la base de la spec (ticket 0068 §2, commit `bb11f59` de la fila) — la añadió el dev-lead a la fila durante el arranque — aprobada: «Integra develop, añádela a la spec como enmienda aprobada y sigue.»

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-09-25 | aprobada por delegación: «Apruebo la spec por delegación, nos vemos en la validación» |
