---
id: 20260922-083703-task-0013-postponed-anchor
task: 0013
title: Anclaje pospuesto sin vía de retorno
mode: full
status: approved
created: 2026-09-22
author: agente
approvers:
  - role: dev-lead
    name: dev-lead
    approved_at: 2026-09-22
---

# Spec — Anclaje pospuesto sin vía de retorno

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: **sin review**. Señales contadas: una, `ADDED` sobre una capacidad existente. No hay capacidad nueva, contrato público, `MODIFIED`/`REMOVED`, datos ni dependencia externa, y el área ya la exploró el RED. La opción mínima deja sin cubrir una lente técnica sobre la forma de la plantilla, y eso lo mide el GREEN.

1. **La spec se recorta por el RED** ([`red/README.md`](red/README.md), 6 sujetos, 4,67 $). La pérdida en silencio del ticket no se reproduce: 0 de 4 sujetos descartan el aprendizaje. Sí se reproducen dos cosas: sin destino, cada sujeto improvisa uno y no lo dice (0 de 4 avisan), y 3 sujetos escriben `architecture.md` con 3 formas distintas. La spec ataca solo esas dos.
2. **Plantilla solo de `architecture.md`** (`architecture-template.md` en `sdd-templates`), no de los cinco documentos de anclaje. Es el único anclaje que el init puede dejar sin crear y que el cierre necesita: mission, constitution, tech-stack y roadmap los crea siempre el init. El criterio de «el anclaje se entrevista» ya tenía excepciones (`environments-template.md`, `capability-template.md`). El dev-lead no tenía preferencia («no lo sé») y lo decidí yo.
3. **Quién crea el documento que falta**: quien lo necesite, calcando la plantilla. El cierre lo crea sin parar a preguntar, también en `delegate`, porque es un documento interno y no una acción hacia fuera. Lo que no puede hacer es crearlo o redirigir el aprendizaje sin decirlo: lo anuncia en el informe final. `architecture.md` sigue siendo predicado de lectura: su ausencia no activa nada al arrancar una task.
4. **Un destino sin plantilla no se inventa.** Si falta `constitution.md` o `tech-stack.md`, un estado que el init no deja, el cierre no crea el documento: lo dice y apunta una fila de deuda en el roadmap.
5. **`sdd-consult` no se toca**: su paso 4 ya escribe «en el doc que le corresponde» con aprobación, y la forma la encuentra en el índice de `sdd-templates`, que es donde la buscó el sujeto e2-1. **Las init tampoco se tocan**: que greenfield y brownfield calquen la misma plantilla deja una sola fuente (Art. VIII), pero es otra conducta sin RED. Va a deuda.
6. **Sin capacidad nueva**: los dos requisitos entran en `task-flow`.

### Decisiones tomadas con el dev-lead

- Carril task, modo full, perfil `delegate`, sin partir y sin ampliar a la plantilla de `estimation.md`. Respuesta del dev-lead: «Sí, task full (Recomendado)» · «delegate (Recomendado)».
- RED con E1 y E2 antes de la spec, 2 sujetos Sonnet por escenario: «Sí, E1 y E2 (Recomendado)». E1b es un rerun de E1 sin el sesgo del molde, dentro del mismo presupuesto.
- Forma del anclaje: el dev-lead respondió «no lo sé» y delegó en mí la decisión 2.
- Tras aprobar, el dev-lead amplía a plantillas de todos los documentos: «tendríamos que empezar un proyecto fresco sin ejemplos de otro proyecto» · alcance: «Todo en la 0013». Queda en la enmienda del 2026-09-22.

## Intent

Un proyecto que pospone `architecture.md` en el init no tiene cómo recuperarlo: la forma del documento no está en ningún sitio que un agente de task pueda calcar. Además, el cierre de task manda los aprendizajes estructurales a un fichero que no existe. Medido en el RED: cada agente improvisa una forma y un destino distintos, y ninguno lo dice. El proyecto acaba con la estructura repartida entre `tech-stack.md`, `review.md` y `architecture.md` a medio hacer. Se quiere una única forma que calcar y que un destino que falta nunca pase en silencio.

## Scope

- Entra: `architecture-template.md` en `sdd-templates`, con su fila en el índice y el recuento del README. Una regla en el paso 4 de `sdd-end-task` (`aprendizajes-skills.md`) para cuando falta el destino. La fila de `architecture.md` en `nombrado.md`, que dice de dónde sale su forma. RED y GREEN de las dos conductas.
- No entra: plantillas de mission, constitution, tech-stack y roadmap. Plantilla de `estimation.md`, que sigue en su fila de deuda. Cambios en `sdd-init-greenfield`, `sdd-init-brownfield` y `sdd-consult`. Una vía nueva de «completar anclaje».

## Approach

La forma se resuelve con el mecanismo que el kit ya tiene para todo lo que se calca: una plantilla en la fuente única, que un agente encuentra listando `sdd-templates`. La plantilla describe la estructura real (piezas, responsabilidades, dependencias, reglas de dónde va lo nuevo) y hereda la regla de reparto: enlaza `capabilities/`, no copia valores de comportamiento. El aviso va donde nace el problema, el paso 4 del cierre: un aprendizaje cuyo destino no existe se lleva a la plantilla si la hay, o a deuda si no, y en los dos casos se dice en el informe.

## Delta de comportamiento

### Capacidad: `task-flow`

**ADDED — Un aprendizaje sin destino no se redirige en silencio**
- GIVEN un cierre de task cuyo walkthrough tiene un aprendizaje estructural y un proyecto sin `architecture.md`
- WHEN `sdd-end-task` vuelca los aprendizajes a los docs vivos
- THEN crea `architecture.md` calcando `architecture-template.md` de `sdd-templates`, vuelca ahí el aprendizaje y lo dice en el informe final («`architecture.md` no existía: creado desde la plantilla»)
- AND no escribe el aprendizaje estructural en `tech-stack.md` ni en otro documento en su lugar
- AND lo mismo con cualquier otro destino que falte (`constitution.md`, `tech-stack.md`): se crea calcando su plantilla y se dice en el informe; si un destino no tiene plantilla, no se inventa: se dice y se añade una fila en la tabla de deuda técnica del roadmap *(enmienda 2026-09-22)*

**ADDED — Un documento de anclaje que falta se calca de su plantilla**
- GIVEN un proyecto al que le falta un documento de anclaje con plantilla en `sdd-templates`
- WHEN una task, un cierre o una consulta lo tiene que crear
- THEN el documento sigue las secciones de su plantilla, sin secciones inventadas ni omitidas (las vacías llevan su marcador)

### Capacidad: `onboarding` *(enmienda 2026-09-22)*

**ADDED — La init calca cada documento de su plantilla**
- GIVEN un `sdd-init-greenfield` o un `sdd-init-brownfield` que crea `mission.md`, `constitution.md`, `tech-stack.md`, `architecture.md`, `roadmap.md`, `estimation.md` o `changelog.md`
- WHEN escribe cada documento
- THEN su estructura es la de la plantilla correspondiente de `sdd-templates`, y el contenido sale de la entrevista (greenfield) o del código (brownfield)
- AND ningún documento copia texto, secciones ni notas del `.docs/` del kit ni de otro proyecto
- AND las tablas que leen otras skills (patches, deuda técnica, backlog del roadmap; `## [Unreleased]` del changelog) tienen las columnas y cabeceras literales de la plantilla

## Enmiendas

- 2026-09-22 — **Plantillas de todos los documentos de SDD que crea el init, no solo de `architecture.md`, y las dos init las calcan.** Por qué: el dev-lead no quiere que un proyecto nuevo arranque con ejemplos de otro. La evidencia de campo lo confirma. En la init de `statusline` el agente copió `estimation.md` y `sdd-kit.json` del `.docs/` del kit, sacó la cabecera del changelog de otra skill e inventó las columnas de la tabla de patches ([ticket](../../field-reports/20260920-statusline-init-greenfield.md) A2). En otro proyecto, un `estimation.md` llegó con notas de calibración de un tercero (ticket 0008 §5). La causa es estructural y se ha verificado leyendo el kit: `sdd-init-greenfield/references/estructura.md` da una línea por documento y `sdd-templates` no tiene ninguna plantilla de anclaje. El dev-lead eligió «Todo en la 0013» frente a partir la task. Cambios:
  - **Decisión 2 sustituida**: siete plantillas en `sdd-templates`: `mission`, `constitution`, `tech-stack`, `architecture`, `roadmap`, `estimation` y `changelog`. Cada una lleva las secciones mínimas y, literal, lo que otra skill lee de ese documento: las tablas de patches y de deuda técnica y la sección Backlog del roadmap, la cabecera `## [Unreleased]` del changelog y la sección «Reglas de producto» de la constitution. Sin contenido de ningún proyecto: `estimation-template` lleva el método genérico y una sección vacía de calibración. `sdd-kit.json` no lleva plantilla, porque es un JSON que el init escribe con valores de la entrevista. `estimation-log.md` tampoco, porque lo genera `Build-EstimationLog.ps1`.
  - **Decisión 5 sustituida**: las init sí se tocan. `sdd-init-greenfield` (`estructura.md`) y `sdd-init-brownfield` (`generacion.md`) calcan cada documento de su plantilla. La entrevista sigue poniendo el contenido y la plantilla pone la forma. `sdd-consult` sigue sin tocarse.
  - **Decisión nueva (7)**: el RED de la init no se mide con sujetos: el ticket de campo es de primera mano y la causa es estructural. El RED E2 de esta task ya mide la conducta que produce la falta de plantilla: 3 formas distintas en 3 sujetos. El GREEN sí lleva sujetos de greenfield, con las respuestas de la entrevista dadas en la petición, y mide que cada documento siga su plantilla sin copiar nada del kit. Brownfield se verifica por lectura: comparte la regla con greenfield.
  - **Decisión 4 matizada**: con plantilla para todos, el cierre crea cualquier destino que falte calcando su plantilla y lo dice. La fila de deuda queda para un destino sin plantilla, que tras esta task no hay.
  - **Scope**: entran las siete plantillas, sus filas en el índice de `sdd-templates` y el recuento del README, y `estructura.md` y `generacion.md`. Se saldan la fila de deuda «`sdd-templates` no tiene plantilla de `estimation.md`» y el punto A2 de «Greenfield deja a la deducción la forma de casi todo». El resto de esa fila (A3–A6, B*) sigue en deuda.
  - **Delta**: se amplía el primer requisito y se añade uno en `onboarding` (abajo).
  - Aprobada: «te lo apruebo porque no tengo forma de decirte que no es lo correcto» (dev-lead, 2026-09-22). Deja escrito que la metodología solo se valora con el uso diario: la validación de esta task sale de ahí.

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | dev-lead | 2026-09-22 | aprobada: «si , apruebo» |
