---
name: sdd-start-task
description: Usar cuando el usuario arranca una tarea, feature o cambio no trivial en un proyecto con carpeta .docs/sdd/ — al invocar el comando, al enunciar una nueva task del roadmap o al llegar un ticket nuevo. No usar para bugs pequeños deterministas (eso es sdd-start-hotfix) ni para cambios describibles en una frase.
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
2. **Enrutado** — ¿es un bug pequeño y **determinista** (<30 min, sin interpretación de requisitos)? Entonces NO es una task: usa `sdd-start-hotfix`. Su carpeta irá prefijada `hotfix-`, nunca `task-`.
3. **Branch** — `feature/<ticket>` desde `develop`, o la convención que fije la constitution del proyecto.
4. **Spec** — `superpowers:brainstorming` para explorar intención y requisitos → crear la carpeta (ver Nombrado) + `spec.md` calcando `.docs/sdd/templates/spec-template.md`.
   ⛔ **GATE de aprobación**: presenta la spec y ESPERA la aprobación explícita del usuario. Si el usuario no responde, la tarea queda EN ESPERA — "documentar la decisión y seguir" no sustituye la aprobación.
5. **Plan** — solo tras aprobar la spec: `superpowers:writing-plans` → `plan.md` con el template del proyecto.
   ⛔ **GATE de aprobación**: igual que la spec. Sin plan aprobado no se toca código.
6. **Implementación** — `superpowers:executing-plans` **en línea con checkpoints** (el usuario corrige en el momento). Si el plan tiene más de una task → `tasks.md` como **registro vivo** (status + commit hash por task; la lista de todos del harness es efímera, `tasks.md` es el registro durable).
7. **Cierre** — SOLO vía `sdd-end-task`. Nada se marca ✅ sin smoke ejecutado y documentado.

## Nombrado de carpetas de spec

`<yyyyMMdd-HHmmss>-(task|hotfix)-<id>-<slug>`, todo en UTC:

- Timestamp: `Get-Date -AsUTC -Format 'yyyyMMdd-HHmmss'` (PowerShell).
- `task` o `hotfix` según el carril. Una carpeta que contiene `hotfix.md` SIEMPRE va prefijada `hotfix-`.
- `<id>`: el id del ticket en el gestor del proyecto. **Nunca el nombre de un módulo** ("M4" no es un id). Si no hay ticket: `0000`.
- `<slug>`: kebab-case corto descriptivo.

## Módulos por predicado observable (no preguntes: observa el proyecto)

| Si existe… | Entonces… |
| --- | --- |
| `.docs/sdd/estimation.md` | Bloque "Estimación y esfuerzo" obligatorio en `plan.md`, y tiempo real obligatorio en `walkthrough.md` |
| `.docs/sdd/changelog.md` | Entrada vía `add-to-changelog` durante el cierre |
| `.docs/sdd/architecture.md` | Se lee en el paso 1 |

## Overrides sobre superpowers

| Default de superpowers | En este flujo |
| --- | --- |
| Specs/planes en `docs/superpowers/` | SOLO en `.docs/sdd/specs/` |
| Formato de spec/plan del skill | Plantillas de `.docs/sdd/templates/` |
| `using-git-worktrees` | No-op: se usa el git-flow del proyecto |
| `subagent-driven-development` | Se evita: ejecución en línea con checkpoints |

## Cuándo NO aplicar SDD

Si el cambio se puede describir en una frase y no toca contratos ni datos, se hace directamente (commit correcto y listo). Un bug determinista va al carril hotfix. La planificación es proporcional a la incertidumbre, no un trámite universal.

## Trabajo descubierto fuera de scope

No lo absorbas en silencio ni lo ignores. Decide **con el usuario** (`AskUserQuestion`): ¿se arregla ahora o se difiere a ticket aparte? ¿misma rama o rama nueva? Antes de proponer cualquier fix: `superpowers:systematic-debugging` (causa raíz primero).

## Red flags — STOP y vuelve al gate

- Estás escribiendo `plan.md` y la spec no tiene aprobación explícita del usuario.
- Vas a editar código y el plan no está aprobado.
- Estás "documentando la decisión en la spec" en lugar de esperar la respuesta.
- La carpeta dice `task-` pero el contenido es un `hotfix.md`, o el `<id>` es un módulo en vez de un ticket.
- Vas a marcar el roadmap como ✅ sin haber ejecutado y documentado el smoke.
- El walkthrough tiene el tiempo en blanco "porque no lo sé exacto".

| Racionalización | Realidad |
| --- | --- |
| "El usuario no va a responder; sigo y lo documento" | Una spec sin aprobar no es un contrato. La tarea ESPERA en el gate; tu último mensaje presenta la spec y pide la aprobación. |
| "Es sencillo / el cliente lo espera hoy" | La presión no cambia el proceso. Lo realmente pequeño tiene sus carriles: hotfix o cambio-de-una-frase. |
| "Dejo el tiempo en blanco, no lo sé exacto" | Aproxima. Un registro aproximado alimenta el estimation-log; un blanco lo rompe. |
| "✅ implementado (pendiente de smoke)" | Ese estado no existe. Sin verificación documentada no hay ✅. |
