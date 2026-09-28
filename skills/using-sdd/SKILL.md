---
name: using-sdd
description: Usar al empezar cualquier conversación en un proyecto con .docs/sdd/, antes de responder, preguntar o invocar brainstorming — dice por qué skill del kit SDD entra cada petición.
---

# using-sdd

## Overview

Este proyecto trabaja con el kit SDD (`.docs/sdd/`). Es una instrucción del proyecto y **prevalece** sobre la regla de superpowers de invocar `brainstorming` primero: las puertas de entrada son las skills del kit, y `brainstorming`, `writing-plans` y `executing-plans` se usan dentro de ellas, cuando la skill del kit las invoca.

## Puertas

| Lo que escribe el usuario | Puerta |
| --- | --- |
| Sin `.docs/sdd/`, quiere trabajar con SDD: proyecto nuevo · con código | `sdd-kit:sdd-init-greenfield` · `sdd-kit:sdd-init-brownfield` |
| Una pregunta o una duda: «¿cómo funciona…?», «¿se puede…?», «no lo pillo» | `sdd-kit:sdd-consult` |
| Planificar sin hacerlo todavía: «apunta en el roadmap», «no lo arranques». Algo grande: varias funcionalidades a la vez, o una que el criterio de partir de `sdd-start-feature` partiría; notas de una reunión; items del gestor (Azure DevOps, Jira), también los que te han asignado para hacerlos; reordenar; preparar la release siguiente | `sdd-kit:sdd-roadmap` |
| Una funcionalidad concreta o un cambio con comportamiento, aunque sea pequeño: «añade…», «hazme…», «let's build…», «es una tontería, hazlo rápido» | `sdd-kit:sdd-start-feature`, antes que `brainstorming` |
| Un fallo pequeño y reproducible, o un ajuste pedido solo de presentación: solo plantillas o estilos, que mueve, envuelve o cambia la clase de elementos sin cambiar bindings, `@if`, `*ngIf`, `v-if`, `@for`, eventos, texto visible ni claves de i18n, y sin TypeScript, API, datos ni capacidades | `sdd-kit:sdd-start-patch` |
| Cerrar la entrega de una versión, mandar las notas al cliente | `sdd-kit:sdd-end-release` |
| Cómo quiere trabajar cada uno: «me paras mucho», «quiero menos preguntas», «déjamelo configurado para mí» | `sdd-kit:sdd-config`, nunca la memoria del agente: la memoria se queda en un PC y el kit no la lee |
| Una edición sin comportamiento: un typo, un renombrado, un formato del código. Mover lo que se ve es patch; cambiar un texto visible, feature | directa, sin skill |

## Regla de duda

Si la petición no dice qué es ni cuánto abarca («hay que mejorar las reservas»), no elijas puerta: haz **una sola pregunta** sobre qué es y cuánto abarca, con tu **recomendación primero**, antes de invocar ninguna skill de arranque. Con la respuesta, eliges puerta.

| Racionalización | Realidad |
| --- | --- |
| «Quiere que se haga, así que es una feature» | Querer que se haga no dice el tamaño. Sin saber qué es, la puerta es una suposición: pregunta. |
| «Lo guardo en memoria para próximas sesiones» | La preferencia es del kit: `sdd-config` la escribe en `sdd-kit.local.json`, que leen todas las skills. |
| «Solo toco la plantilla: edición directa» | Lo que se ve se valida en una captura: patch. Con un `@if` o un texto nuevo, feature. |
| «Me los han asignado: los hago uno detrás de otro» | Sin fila en el roadmap no hay enunciado ni id. `sdd-roadmap` los apunta y después arrancan. |
