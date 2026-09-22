---
id: 20260922-083703-task-0013-postponed-anchor
task: 0013
title: Anclaje pospuesto sin vía de retorno
mode: full
status: draft
created: 2026-09-22
author: agente
approvers:
  - role: dev-lead
    name: TBD
    approved_at: null
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
- AND si el destino que falta no tiene plantilla (`constitution.md`, `tech-stack.md`), no lo crea: lo dice en el informe y añade una fila en la tabla de deuda técnica del roadmap

**ADDED — Un `architecture.md` que falta se calca de su plantilla**
- GIVEN un proyecto sin `architecture.md`
- WHEN una task, un cierre o una consulta lo tiene que crear
- THEN el documento sigue las secciones de `architecture-template.md`, sin secciones inventadas ni omitidas (las vacías llevan su marcador)

## Enmiendas

- _Ninguna._

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | | | pendiente |
