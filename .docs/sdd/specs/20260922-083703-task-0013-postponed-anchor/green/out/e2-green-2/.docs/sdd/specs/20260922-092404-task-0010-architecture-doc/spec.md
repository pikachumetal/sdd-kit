---
id: 20260922-092404-task-0010-architecture-doc
task: 0010
title: Documentar la arquitectura del proyecto
mode: full
profile: delegate
status: draft
created: 2026-09-22
author: Àngel Delgado
approvers:
  - role: dev-lead
    name: TBD
    approved_at: null
---

# Spec — Documentar la arquitectura del proyecto

> **Estado**: draft.
> **Siguiente paso**: `plan.md` con `superpowers:writing-plans`.

## Decisiones que he tomado yo — valida estas

1. `architecture.md` se calca de `architecture-template.md` (skill `sdd-templates`) y vive en `.docs/sdd/architecture.md` — es la ubicación que fija el propio kit (`nombrado.md`).
2. Documento la estructura **real** actual: un único fichero `src/app.js` con un dispatcher `run(cmd, params)`, sin capas ni módulos adicionales — no invento estructura que no existe.
3. La sección "Dónde va lo nuevo" fija una sola regla de reparto: todo comando o regla nueva entra en `src/app.js`, porque `tech-stack.md` ya fija "un solo fichero de entrada" como restricción del proyecto — no la reinterpreto, la enlazo.
4. No hay `capabilities/` en el proyecto todavía: la sección de "Decisiones estructurales" no enlaza ninguna, solo registra el hecho de que el proyecto documenta su arquitectura por primera vez en esta task.
5. Es una task de documentación pura, sin delta de comportamiento observable: la sección "Delta de comportamiento" del template no aplica (no hay capacidad tocada) — la spec no la incluye.
6. Revisión de spec: nivel **bajo** — 1 fichero nuevo, sin código, sin ambigüedad de requisitos; la única lente que aporta algo es "¿la estructura descrita coincide con el repo real?", que yo mismo verifico línea a línea contra `src/app.js` antes de considerarla lista. No pido review externa.

## Intent

`architecture.md` se pospuso en el `init` del proyecto para arrancar antes con las funcionalidades (tasks 0005, 0006, patch 0007). El roadmap lo marca pendiente como task 0010. El proyecto ya tiene tres tasks/patches cerrados y conviene dejar escrito cómo está construido antes de que crezca más, para que la siguiente task sepa dónde entra lo nuevo sin tener que releer `src/app.js` entero.

## Scope

- Entra: crear `.docs/sdd/architecture.md` describiendo estructura, piezas, flujo principal y regla de reparto para código nuevo.
- No entra: crear `capabilities/`, tocar `src/app.js` o los tests, documentar despliegue (no hay `environments.md` en el proyecto).

## Approach

Leer `src/app.js` y `test/app.test.js` como fuente de verdad, y calcar `architecture-template.md` rellenando cada sección con la estructura observada. Sin secciones vacías salvo que de verdad no apliquen (se marcan `_Pendiente._`).

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | | pendiente |
