---
name: sdd-start-task
description: Usar cuando el usuario arranca una tarea, feature o cambio no trivial en un proyecto con carpeta .docs/sdd/ — al invocar el comando, al enunciar una nueva task del roadmap o al llegar un ticket nuevo. No usar para bugs pequeños deterministas (eso es sdd-start-patch) ni para cambios describibles en una frase.
---

# sdd-start-task

## Overview

Este proyecto trabaja con **Spec-Driven Development**: la spec es la fuente de verdad, el código es output. Las skills `superpowers:*` se usan como **proceso**; los artefactos (carpetas, nombres, estructura de documentos) siguen la convención del kit, que sobreescribe los defaults de superpowers.

**Regla de oro:** los artefactos viven SOLO en `.docs/sdd/specs/<carpeta-de-tarea>/`. Nunca crear `docs/superpowers/` ni dejar planes sueltos.

**Violar la letra de los gates es violar su espíritu.**

## ⛔ Gate 1 — Al invocar: cargar contexto y PARAR

Invocar esta skill NO significa "ejecuta toda la SDD ahora". Es el paso 0: primar el contexto SDD. Si el usuario aún no ha enunciado la tarea, tu único objetivo en este turno es **leer el contexto SDD y DETENERTE** hasta que la enuncie.

**NO** explores el código de la feature (grep / `semble` / Read de la implementación). El contexto SDD son los **docs**, no el código — y aún no sabes cuál es la tarea.

| Racionalización | Realidad |
| --- | --- |
| "Necesito explorar el código para tener contexto" | El contexto SDD son los docs (constitution, architecture…). Explorar código antes del enunciado es prematuro y quema tokens sobre suposiciones. |
| "Aprovecho y preparo algo mientras" | No hay "mientras". Contexto → parar. |

## Checklist por tarea (crea un todo por paso)

1. **Contexto** — leer `.docs/sdd/`: `constitution.md`, `mission.md`, `tech-stack.md`, `roadmap.md` (+ `architecture.md` y `funcional.md` si existen).
2. **Enrutado** — cuatro salidas: pregunta de viabilidad cuya salida es una **respuesta**, no código que se conserve ("¿se puede…?", "pruébalo rápido") → NO es una task, es un spike: `sdd-consult` la sondea sin artefactos; bug pequeño y **determinista** (<30 min, sin interpretación de requisitos) → NO es una task, usa `sdd-start-patch` (carpeta prefijada `patch-`, nunca `task-`); cambio acotado que cumple el predicado → **modo lite** (condiciones en [modo-lite.md](references/modo-lite.md)); todo lo demás → task en modo full.
3. **Branch** — `feature/<ticket>` desde `develop`, o la convención que fije la constitution del proyecto.
4. **Spec** — **invoca la skill `superpowers:brainstorming`** con el tool `Skill`. El paso nombra una skill, no una actividad: explorar el código por tu cuenta NO la sustituye. Luego crear la carpeta (naming y módulos por predicado en [nombrado.md](references/nombrado.md)) + `spec.md` calcando `spec-template.md` del skill `sdd-templates`, con `mode: full | lite` en el frontmatter.
   ⛔ **GATE de aprobación**: presenta la spec y ESPERA la aprobación explícita del usuario. Si el usuario no responde, la tarea queda EN ESPERA — "documentar la decisión y seguir" no sustituye la aprobación.
5. **Plan** *(solo en modo full)* — solo tras aprobar la spec: `superpowers:writing-plans` → `plan.md` calcando `plan-template.md` del skill `sdd-templates`.
   ⛔ **GATE de aprobación**: igual que la spec. Sin plan aprobado no se toca código.
6. **Implementación** — `superpowers:executing-plans` **en línea con checkpoints** (el usuario corrige en el momento). Si el plan tiene más de una task → `tasks.md` como **registro vivo** (status + commit hash por task; la lista de todos del harness es efímera, `tasks.md` es el registro durable).
7. **Cierre** — SOLO vía `sdd-end-task`. Nada se marca ✅ sin smoke ejecutado y documentado.

> Detalle en el punto de uso: [modo-lite.md](references/modo-lite.md) · [nombrado.md](references/nombrado.md) · [overrides-superpowers.md](references/overrides-superpowers.md).

## Trabajo descubierto fuera de scope

No lo absorbas en silencio ni lo ignores. Decide **con el usuario** (`AskUserQuestion`): ¿se arregla ahora o se difiere a ticket aparte? ¿misma rama o rama nueva? Antes de proponer cualquier fix: `superpowers:systematic-debugging` (causa raíz primero).

## Red flags — STOP y vuelve al gate

- Vas a redactar la spec sin haber invocado `superpowers:brainstorming`, porque "ya has explorado el código".
- Estás tratando la tarea como pequeña sin citar las condiciones del predicado, o sin que el usuario haya confirmado el modo lite.
- Estás escribiendo `plan.md` y la spec no tiene aprobación explícita del usuario.
- Vas a editar código y el plan no está aprobado.
- Estás "documentando la decisión en la spec" en lugar de esperar la respuesta.
- La carpeta dice `task-` pero el contenido es un `patch.md`, o el `<id>` es un módulo en vez de un ticket.
- Vas a marcar el roadmap como ✅ sin haber ejecutado y documentado el smoke.
- El walkthrough tiene el tiempo en blanco "porque no lo sé exacto".

| Racionalización | Realidad |
| --- | --- |
| "Es una feature pequeña y de baja ambigüedad, ya tengo contexto suficiente" | Ese juicio es tuyo y no está escrito en ninguna parte. Para eso existe el modo lite: cita las condiciones del predicado y deja que el usuario confirme. |
| "El paso 4 describe una actividad; explorando el código ya la cumplo" | Nombra una skill concreta, no una actividad. `superpowers:brainstorming` se invoca con el tool `Skill`. |
| "El usuario no va a responder; sigo y lo documento" | Una spec sin aprobar no es un contrato. La tarea ESPERA en el gate; tu último mensaje presenta la spec y pide la aprobación. |
| "Es sencillo / el cliente lo espera hoy" | La presión no cambia el proceso. Lo realmente pequeño tiene sus carriles: patch o cambio-de-una-frase. |
| "«Pruébalo rápido» es verbo de acción, no consulta; el usuario invocó esta skill, así que es task" | Una pregunta de viabilidad sigue siendo una pregunta aunque pida probar: su salida es una respuesta. `sdd-consult` la sondea; abrir rama y spec la convierte en trabajo que nadie pidió. |
| "Dejo el tiempo en blanco, no lo sé exacto" | Aproxima. Un registro aproximado alimenta el estimation-log; un blanco lo rompe. |
| "✅ implementado (pendiente de smoke)" | Ese estado no existe. Sin verificación documentada no hay ✅. |
