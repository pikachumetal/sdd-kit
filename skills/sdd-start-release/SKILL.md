---
name: sdd-start-release
description: Usar cuando hay que abrir o planificar la siguiente release en un proyecto con .docs/sdd/ — tras cerrar una release, con un acta de feedback triada pendiente de convertir en plan, o cuando el usuario dice "prepara la release N", "qué entra en la siguiente entrega". No para arrancar una task individual (eso es sdd-start-task).
---

# sdd-start-release

## Overview

`sdd-start-release` es **opcional**: es la vía ideal para generar las tasks del scope, no un requisito del
carril — el corte de publicación (`sdd-end-release`) se lanza haya habido apertura o no. En un equipo la
planifica el PM o el PO; con un gestor de tickets (Jira, Azure DevOps) puede que nadie la use, porque el
scope vive allí y el dev arranca cada tarea con `sdd-start-task`/`sdd-start-patch` y el id del ticket
(`ids.mode: tracker`) — con gestor, el roadmap NO es la fuente del scope: guarda releases cerradas, deuda
técnica y backlog propio, sin replicarlo. En un equipo de una persona sigue siendo la vía cómoda, y ahí sí
el roadmap es la única fuente del scope.

Abrir una release es convertir el material acumulado (acta de feedback, backlog, deuda técnica, action
items de la retro) en un **scope decidido por el usuario**, refinando solo lo inmediato.

**Principio central: proponer no es decidir.** Tu trabajo es traer el inventario ordenado con
recomendación; qué entra, en qué orden y cuándo se compromete lo decide el usuario.

## Checklist de apertura (crea un todo por paso)

1. **Inputs** — leer el acta de la release anterior (`.docs/sdd/releases/<última>/feedback.md` si
   existe), la sección Backlog del roadmap, la tabla de deuda técnica y los action items de la última
   retro (sección Retro del mismo acta).
2. **Proponer el scope** — lista con recomendación por item y **bloqueos marcados** (🔒 + qué decisión
   falta + quién la debe). ⛔ **GATE: la decisión de qué entra es del usuario, item a item o por bloques.**
   La presión de un stakeholder ("todo es importante, cuanto antes") no es una decisión de priorización —
   se registra, no se obedece.
3. **Repriorizar** — riesgo primero, después coste-beneficio, contando dependencias. Criterio completo y
   cuándo entra la deuda técnica: [priorizacion.md](references/priorizacion.md).
4. **Estado de la release** — si `.docs/sdd/sdd-kit.json` no tiene `release.hasRecipient`, pregúntale una
   vez al usuario si la release se entrega a alguien distinto de quien la hace, y escribe su respuesta en
   ese campo fusionando (sin tocar `version`, `channel` ni `ids`); con el campo ya presente, aplica el
   valor que tiene en este momento, sin preguntar. Nunca escribas ni cambies el campo por tu cuenta — solo
   con una respuesta o petición explícita del usuario. **Comprometida** = scope prometido al destinatario,
   normalmente con fecha: SOLO si el usuario lo dice y no hay bloqueos externos sobre el scope.
   **En preparación** = cualquier otro caso, con los bloqueos explícitos en la sección. Con
   `release.hasRecipient: false` el estado es siempre "en preparación" y no se pregunta.
5. **Roadmap como única fuente** — sección "Release N" con filas trazables al acta/origen. **No crear
   documentos paralelos de scope.** **Los ids no se inventan**: el origen legítimo es el ticket del gestor
   o la secuencia del proyecto (`ids.mode`) — nunca un número a ojo. En `sequence`, cada fila lleva su id
   **reservado y correlativo** al escribir el scope: esa reserva es lo que impide que dos worktrees cojan
   el mismo número. Detalle: [roadmap-fuente.md](references/roadmap-fuente.md).
6. **Refinar SOLO el top** — **TRAS la decisión de scope del usuario (gate del paso 2)**: la primera task
   (o las 2-3 primeras si son independientes) se arranca vía `sdd-start-task`, cada una con su spec y su
   gate. Scope sin decidir → ninguna task arrancada: la apertura queda EN PREPARACIÓN. **PROHIBIDO crear
   specs en batch** para todo el scope: sobre-detallar lo lejano produce specs que caducan y salta los
   gates de aprobación uno a uno.
7. **Changelog** *(si existe `changelog.md`)* — ver [priorizacion.md](references/priorizacion.md).

## Red flags — STOP

- Estás creando specs para todos los items del scope de golpe.
- Estás arrancando la primera task y el usuario aún no ha decidido el scope.
- Has marcado la release "comprometida" con bloqueos externos abiertos, o sin que el usuario lo diga.
- Has creado un documento de scope paralelo al roadmap.
- Has movido items de backlog a la release por el énfasis verbal de un stakeholder.
- Has escrito en el roadmap un id que no viene del gestor ni de la secuencia del proyecto (`Get-NextSddId.ps1` o fila ya reservada).
- El usuario no ha confirmado el scope y ya estás editando el roadmap como definitivo.

| Racionalización | Realidad |
| --- | --- |
| "El triage del acta ya lo decidió; creo la sección comprometida" | El triage decidió el destino de cada petición; comprometer el hito, su orden y su estado es OTRA decisión del usuario. |
| "Adelanto todas las specs para ganar tiempo" | Cada spec tiene gate de aprobación y contexto fresco. En batch: gates saltados + detalle que caduca antes de tocarse. |
| "El cliente dijo que todo es importante" | Énfasis verbal ≠ priorización del PO. Se registra en el acta y se decide con criterio de producto. |
| "Congelo el scope en un doc aparte para auditarlo" | El roadmap versionado en git YA es auditable. Un segundo documento es el que nadie actualiza. |
| "Arrastro la deuda técnica entera, así se salda" | La deuda entra por prerequisito o por decisión explícita, no por inercia — infla el scope y diluye el hito. |
| "El encargo de 'dejarlo todo listo' ya autoriza arrancar la primera task" | "Listo" = propuesta ordenada con bloqueos claros. El scope no está decidido hasta que el usuario decide; sin esa decisión no se abre ninguna task. |
| "Propongo numeración correlativa de tickets para adelantar" | Un id inventado en el roadmap se confunde con un ticket real para siempre. El id lo da el gestor, o la secuencia del proyecto (`ids.mode: sequence` + `Get-NextSddId.ps1`) — nunca un número a ojo. |
