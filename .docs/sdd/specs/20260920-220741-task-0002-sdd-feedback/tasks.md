---
id: 20260920-220741-task-0002-sdd-feedback
title: Tasks — Skill sdd-feedback
spec: ./spec.md
plan: ./plan.md
created: 2026-09-21
---

# Tasks — Skill `sdd-feedback` (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0002`

> **Creado en el cierre, no antes de implementar.** El plan tenía tres tasks y el paso 6 de `sdd-start-task` pide este registro desde el principio; se omitió porque la decisión 1 del plan hablaba de «ahorrar el bookkeeping de `tasks.md`», que era una razón para fusionar tasks, no para no llevar el registro. Se reconstruye desde el historial de git.

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Campaña RED | done | `ea3908c`, `a57c973`, `ddafe35` | Ocho sujetos: E3 se repitió porque su primera fixture era defectuosa. Dos reglas recortadas |
| 2 | Skill, plantilla y oferta en los cierres | done | `9c387da`, `d5b30bd`, `521c019` | Implementador Sonnet; dos fixes del hilo (enlace entre skills, línea de lectura en cita, recuento de pasos) y uno del revisor de task (`id:` de la cabecera) |
| 3 | Campaña GREEN | done | `49ee2e8` | Seis sujetos; los cinco fallos del RED corregidos 2/2 |

## Verificación por task

- [x] Task 1 — `tests/kit-feedback-red.md`, artefactos en `evidencia-red/`
- [x] Task 2 — `Invoke-Pester tests`: 202/0, con los 10 tests de `tests/KitFeedback.Tests.ps1` en verde; revisor de task: 2 hallazgos, 1 aceptado
- [x] Task 3 — `tests/kit-feedback-green.md`, artefactos en `evidencia-green/`

## Fixes adicionales (trabajo descubierto fuera de scope)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
| Tests RED del hilo imposibles de commitear antes del despacho | El pre-commit del repo ejecuta la suite entera y rechaza un test en rojo; el paso 6 de `sdd-start-task` no contempla un gate de commit | Ruling: el fichero se aparca fuera de `tests/` y lo mueve el implementador con `git mv`. La regla va al alcance de la task 0007 (dev-lead, 2026-09-21) | `9c387da` |
| En modo lite no hay fuente para las «Restricciones globales» | Lite suprime `plan.md` y las reglas de despacho siguen apuntando a él | Al alcance de la task 0005 (dev-lead, 2026-09-21) | — |
