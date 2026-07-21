---
name: sdd-start-release
description: Usar cuando hay que abrir o planificar la siguiente release en un proyecto con .docs/sdd/ — tras cerrar una release, con un acta de feedback triada pendiente de convertir en plan, o cuando el usuario dice "prepara la release N", "qué entra en la siguiente entrega". No para arrancar una task individual (eso es sdd-start-task).
---

# sdd-start-release

## Overview

Abrir una release es convertir el material acumulado (acta de feedback, backlog, deuda técnica, action
items de la retro) en un **scope decidido por el usuario**, refinando solo lo inmediato. El roadmap es la
única fuente del scope.

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
3. **Repriorizar** — riesgo primero, después coste-beneficio, contando dependencias. La deuda técnica solo
   entra si es prerequisito verificable de un item del scope (no se arrastra en bloque).
4. **Estado de la release** — "comprometida" SOLO si el usuario lo dice y no hay bloqueos externos sobre
   el scope; con bloqueos abiertos → "en preparación" con los bloqueos explícitos en la sección.
5. **Roadmap como única fuente** — sección "Release N" con filas trazables al acta/origen. **No crear
   documentos paralelos de scope** (`scope.md`, snapshots): duplicar el roadmap es fabricar deriva; git ya
   versiona los cambios de alcance. **Los ids de ticket no se inventan**: los da el gestor del proyecto;
   sin gestor a la vista, la numeración se acuerda con el usuario.
6. **Refinar SOLO el top** — **TRAS la decisión de scope del usuario (gate del paso 2)**: la primera task
   (o las 2-3 primeras si son independientes) se arranca vía `sdd-start-task`, cada una con su spec y su
   gate. Scope sin decidir → ninguna task arrancada: la apertura queda EN PREPARACIÓN. **PROHIBIDO crear
   specs en batch** para todo el scope: sobre-detallar lo lejano produce specs que caducan y salta los
   gates de aprobación uno a uno.
7. **Changelog** *(si existe `changelog.md`)* — verificar que hay una `[Unreleased]` vacía abierta (la
   deja `sdd-end-release`; créala si falta).

## Red flags — STOP

- Estás creando specs para todos los items del scope de golpe.
- Estás arrancando la primera task y el usuario aún no ha decidido el scope.
- Has marcado la release "comprometida" con bloqueos externos abiertos, o sin que el usuario lo diga.
- Has creado un documento de scope paralelo al roadmap.
- Has movido items de backlog a la release por el énfasis verbal de un stakeholder.
- Has escrito ids de ticket nuevos en el roadmap que no existen en ningún gestor.
- El usuario no ha confirmado el scope y ya estás editando el roadmap como definitivo.

| Racionalización | Realidad |
| --- | --- |
| "El triage del acta ya lo decidió; creo la sección comprometida" | El triage decidió el destino de cada petición; comprometer el hito, su orden y su estado es OTRA decisión del usuario. |
| "Adelanto todas las specs para ganar tiempo" | Cada spec tiene gate de aprobación y contexto fresco. En batch: gates saltados + detalle que caduca antes de tocarse. |
| "El cliente dijo que todo es importante" | Énfasis verbal ≠ priorización del PO. Se registra en el acta y se decide con criterio de producto. |
| "Congelo el scope en un doc aparte para auditarlo" | El roadmap versionado en git YA es auditable. Un segundo documento es el que nadie actualiza. |
| "Arrastro la deuda técnica entera, así se salda" | La deuda entra por prerequisito o por decisión explícita, no por inercia — infla el scope y diluye el hito. |
| "El encargo de 'dejarlo todo listo' ya autoriza arrancar la primera task" | "Listo" = propuesta ordenada con bloqueos claros. El scope no está decidido hasta que el usuario decide; sin esa decisión no se abre ninguna task. |
| "Propongo numeración correlativa de tickets para adelantar" | Un id inventado en el roadmap se confunde con un ticket real para siempre. El id lo da el gestor, o lo acuerda el usuario. |
