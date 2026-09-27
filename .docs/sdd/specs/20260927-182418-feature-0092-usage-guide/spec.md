---
id: 20260927-182418-feature-0092-usage-guide
feature: 0092
title: Guía de uso del kit para los devs del equipo
mode: full
status: approved
created: 2026-09-27
author: agente (Opus 5.5), por delegación del dev-lead
approvers:
  - role: dev-lead
    name: dev-lead
    approved_at: 2026-09-27
---

# Spec — Guía de uso del kit para los devs del equipo

## Capacidades

- Ninguna, porque docs: la guía y la revisión de `.docs/workflow/` son documentación de este repo, que ninguna skill lee.

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: área no explorada (la guía describe skills que no he leído enteras en esta sesión: `sdd-roadmap`, `sdd-config`, `sdd-end-release`, `sdd-feedback`) · tamaño: ~450 líneas en 7 ficheros
- Técnica: si cada regla que cuenta la guía coincide con el texto vigente de `skills/` (señal: área no explorada). Lo cubre la revisión final de rama, que contrasta la guía con las skills.
- Mínimo razonable: ninguna. Deja sin mirar antes del plan si alguna regla de la guía está mal contada, y la revisión final lo mira después.

1. **El marcador de revisión se compara como «igual o posterior» a `plugin.json`, no como «igual».** Hoy `WorkflowDocs.Tests.ps1` exige que el marcador sea igual a la versión de `plugin.json` (1.1.0). Con «kit v2.0.0» el test fallaría y el pre-commit bloquearía cada commit hasta el corte. Con «igual o posterior», los tres documentos revisados ahora para la 2.0.0 pasan hoy, siguen pasando cuando el corte suba a 2.0.0 y fallan en la 2.0.1, que es cuando hay que releerlos. Descartado subir `plugin.json` aquí: es el punto 2 del corte de la release.
2. **La guía entra en la vigilancia del test** con greenfield y brownfield: existe, lleva su marcador y no nombra artefactos retirados. El anexo sigue fuera de la lista versionada, porque describe fuentes externas; se revisa igual para la 2.0.0 (solo cambia lo que dice del kit).
3. **`sdd-start-task` entra en la lista de nombres retirados del test**, con `hotfix`, `funcional.md` y `sdd-start-release`. Es el renombrado de la 2.0.0 (feature 0064), el mismo tipo de desfase para el que existe el test.
4. **El test comprueba también que los enlaces relativos de `.docs/workflow/*.md` resuelven** y que el README enlaza la guía. La guía remite a los otros tres documentos en lugar de repetirlos. Si un enlace se rompe, la guía pierde justo lo que no repite.
5. **El README solo cambia en cuatro sitios**: el enlace a la guía como punto de entrada, al principio de «Cómo se usa»; la frase «Luego el plan, otro gate», que contradice el perfil `delegate` que cuenta la guía; la lista de documentos de «Cómo está escrito», que pasa de tres a cuatro; y el recuento de la primera línea («Once skills»: hoy son 14). El resto del README de salida (Estado, instalación desde `main`, `model` en `settings.json`) es el punto 5 del corte de la 2.0.0 y no entra.
6. **La guía se escribe para el dev de un proyecto consumidor**, no para quien mantiene el kit. `Start-KitSession.ps1`, los sujetos headless y las campañas RED/GREEN no salen. De los tickets del 2026-09-27 uso solo las confusiones que un dev puede encontrarse en su proyecto (tabla del Approach). Los hallazgos de lanzadores, moldes y presupuestos de campaña se quedan fuera.
7. **Cada regla que cuenta la guía sale del texto vigente de `skills/` en esta rama**, con la frase del usuario y la respuesta que la skill espera. La guía no cita artículos, tests ni evidencia: eso es «cómo está hecho el kit», y la prioridad es «cómo se trabaja».
8. **La pasada de humanizer va sobre la guía entera y sobre los párrafos que reescribo en greenfield y brownfield**, antes de la revisión final. Los párrafos que no toco no pasan por ella.
9. **Se actualizan el índice del `CLAUDE.md` del repo y la línea «Vigencia de `.docs/workflow/`» de `tech-stack.md`**: el primero lista los documentos de `.docs/workflow/` y el segundo describe la comparación «igual» que cambia en la decisión 1.
10. **La 0092 entra en la tabla de la Release 2.0.0 del roadmap y en el punto 1 de «Cierre de la 2.0.0»**, tras la 0091 y la 0089, porque hoy no tiene fila. Lo hago en el commit de apertura.

### Decisiones tomadas con el dev-lead

- Guía en `.docs/workflow/usage-guide.md`, texto en castellano, marca «Última revisión: kit v2.0.0», enlazada desde el README, con el índice de siete secciones; revisar greenfield, brownfield y el anexo para la 2.0.0; pasar la guía por humanizer; va con el corte de la 2.0.0, tras la 0091 y la 0089 — enunciado de la petición, 2026-09-27.
- Carril feature, modo full, perfil `delegate` del proyecto; spec aprobada por delegación — «Full, spec por delegación» («apruebo la spec por delegación, nos vemos en la validación»), elegida en la primera pregunta, 2026-09-27.

## Intent

Un dev del equipo que instala el kit en su proyecto no tiene un sitio que le diga cómo se trabaja con él. El README cuenta qué es y cómo se instala, greenfield y brownfield cuentan el flujo por fases, y el resto está repartido en catorce skills. Las confusiones de los tickets del 2026-09-27 son de este tipo: qué contestar a la primera pregunta, si «sigue» aprueba la spec, cuándo vale diferir, qué hacer si el merge falla. Se quiere una guía que se lea de una vez y diga qué pasa en un día normal y qué se contesta en cada parada, con greenfield y brownfield al día con la 2.0.0.

## Scope

- Entra: `.docs/workflow/usage-guide.md` nuevo, con las siete secciones del índice (abajo).
- Entra: `tests/WorkflowDocs.Tests.ps1` (decisiones 1 a 4).
- Entra: revisión para la 2.0.0 de `.docs/workflow/greenfield.md`, `brownfield.md` y `evidence-and-references.md`, con el marcador a v2.0.0 en los dos primeros.
- Entra: `README.md` (decisión 5), `CLAUDE.md` y `.docs/sdd/tech-stack.md` (decisión 9), `.docs/sdd/roadmap.md` (decisión 10).
- Entra: pasada de humanizer (decisión 8).
- No entra: ninguna skill ni referencia de `skills/` (no hay ciclo RED→GREEN de skills).
- No entra: el bump de `plugin.json`, el changelog sellado ni el resto del README de salida, que son del corte de la 2.0.0.
- No entra: arreglar en las skills los huecos que señalan los tickets. La guía cuenta cómo funciona el kit hoy, y los huecos siguen en sus filas de deuda.

## Approach

Una guía de tareas, no de referencia: cada sección arranca de lo que le pasa al dev («llega un bug», «el agente me pregunta esto») y acaba en qué hace él y qué deja el kit. Frases de ejemplo literales del dev y del agente, con dominio inventado. Donde greenfield, brownfield o el anexo ya lo cuentan, la guía enlaza la sección en lugar de repetirla.

Índice, en este orden:

1. **La idea en una página**: los carriles consulta, patch, feature y release; qué deja cada uno y dónde (`specs/<ts>-feature-…`, `patch.md`, `releases/vX.Y.Z/`, nada en consulta); planificar con `sdd-roadmap`; las preferencias con `sdd-config`.
2. **Un día normal**: llega algo y cómo se elige carril, con frases de ejemplo por puerta (`using-sdd`), y qué hace el agente si la petición es vaga.
3. **Qué te pregunta el agente y qué contestar**: la primera pregunta (carril, modo lite o full, perfil, partir, aprobar la spec por delegación, bajar de modelo); `pair`, `delegate` y `unattended`; aprobar la spec (qué respuesta aprueba y cuál no); las paradas que quedan en cada perfil.
4. **Validar de verdad**: qué es validar y qué no («cierra», «los tests pasan»), el smoke y el guion de pruebas que presenta el agente, y diferir con disparador y dueño.
5. **Trabajo en paralelo**: un worktree por feature o patch, ids reservados (`Get-NextSddId.ps1 -Reserve`), develop sin sacar en ningún worktree con cambios, los frenos de alcance que paran cuando la base se mueve, y los conflictos en los registros.
6. **Cerrar y el ticket para el kit**: qué hace el cierre (walkthrough, capacidades, changelog, roadmap, merge según la política) y el ticket de `sdd-feedback`, con dónde se deja.
7. **Problemas típicos**: `CLAUDE_CONFIG_DIR`, skills que no cargan o que llegan viejas de la caché, un merge que falla.

Confusiones de los tickets del 2026-09-27 que la guía responde, y dónde:

| Confusión (ticket) | Sección |
| --- | --- |
| Un patch que edita varias cosas no cabe en «menos de 30 min» (patch 0087 §2) | 2 |
| La primera pregunta junta carril, modo, perfil, partir y delegación, y el dev-lead no la entiende («¿tenemos que partir?») (feature 0036 §2, feature 0032 §1) | 3 |
| El dev-lead ya delegó el método en la petición y aun así llega la primera pregunta (feature 0074 §4) | 3 |
| «sigue» como respuesta a «¿Apruebas la spec?» (feature 0032 §4) | 3 |
| Diferir la validación antes de que el trabajo exista (feature 0032 §5) | 4 |
| La opción «Diferir» ya trae disparador y dueño: elegirla basta (patch 0088) | 4 |
| El freno por fichero cambiado en la base salta con un solapamiento ya previsto (feature 0074 §3) | 5 |
| Una rama con un número que no es el id reservado (patch 0083 §2) | 5 |
| «No generar más tickets» no es «no ofrezcas el ticket» (patch 0088, errores) | 6 |
| Conflicto de merge solo en los registros y la carpeta `merge-<id>` que queda vacía (patch 0084 §2, patch 0088) | 7 |
| Tokens «no medido» y caché de superpowers con `CLAUDE_CONFIG_DIR` (feature 0032 §3, feature 0086 §6, feature 0085 §4, patch 0082 §2) | 7 |
| El harness sirve una skill con el nombre viejo, desde la caché, tras actualizar (feature 0036, contexto) | 7 |

### Criterios de aceptación

**C1 — El marcador se compara como igual o posterior**
- GIVEN `plugin.json` en 1.1.0 y greenfield, brownfield y la guía con «Última revisión: kit v2.0.0»
- WHEN se ejecuta `Invoke-Pester tests/WorkflowDocs.Tests.ps1`
- THEN pasa
- AND GIVEN un documento con «kit v1.0.0» y `plugin.json` en 1.1.0, THEN falla con un mensaje que dice que hay que releerlo
- AND GIVEN un documento con «kit v2.0.0» y `plugin.json` en 2.0.1, THEN falla igual

**C2 — La guía está bajo la vigilancia del test**
- GIVEN `.docs/workflow/` sin `usage-guide.md`
- WHEN se ejecuta el test
- THEN falla por el fichero que falta
- AND GIVEN la guía con `sdd-start-task`, `hotfix`, `funcional.md` o `sdd-start-release` en el texto, THEN falla

**C3 — Los enlaces de los documentos de flujo resuelven y el README enlaza la guía**
- GIVEN un enlace relativo de `.docs/workflow/*.md` a un fichero que no existe (p. ej. `[x](brownfeld.md)`)
- WHEN se ejecuta el test
- THEN falla nombrando el documento y el enlace
- AND GIVEN un `README.md` sin enlace a `.docs/workflow/usage-guide.md`, THEN falla

**C4 — La guía tiene el índice acordado y remite en vez de repetir**
- GIVEN `usage-guide.md` terminada
- WHEN se leen sus títulos de sección `## `
- THEN son siete, en el orden del índice del Approach
- AND enlaza `greenfield.md`, `brownfield.md` y `evidence-and-references.md`

**C5 — Cada confusión de la tabla tiene respuesta en su sección**
- GIVEN la tabla de confusiones del Approach
- WHEN se busca cada fila en la sección que indica
- THEN la sección dice qué hace el dev y qué hace el agente en ese caso, con la regla vigente de `skills/` (p. ej., para «sigue»: la respuesta que aprueba es un «sí», un «apruebo» o una opción cuyo texto dice que aprueba)

**C6 — Greenfield y brownfield ya no describen la 1.1.0**
- GIVEN greenfield y brownfield revisados
- WHEN se buscan las afirmaciones de la 1.1.0 que la 2.0.0 cambió: implementación con subagentes «por defecto», el plan con gate fuera de `pair`, los tests RED commiteados antes de despachar, el cierre de release con inventario, triaje y retro obligatoria, y el historial de `capabilities/`
- THEN ninguna sigue en el texto, y cada una está sustituida por lo que hace el kit en la 2.0.0

**C7 — La guía pasó por humanizer**
- GIVEN la guía y los párrafos reescritos de greenfield y brownfield
- WHEN se invoca la skill `humanizer:humanizer` sobre ellos antes de la revisión final
- THEN `tasks.md` apunta la pasada y los cambios que dejó

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | dev-lead | 2026-09-27 | aprobada por delegación: «Full, spec por delegación» («apruebo la spec por delegación, nos vemos en la validación»), elegida en la primera pregunta |
