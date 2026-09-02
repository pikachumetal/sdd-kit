---
id: 20260902-160308-task-0000-dependencias-declaradas
title: Tasks — Declaración de dependencias del kit
spec: ./spec.md
plan: ./plan.md
created: 2026-09-02
---

# Tasks — Declaración de dependencias del kit (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `master` (rama única del kit, `tech-stack.md`)

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`).

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Declaración en los manifests | done | b2bd8d2 | Sin restricción de versión, a propósito |
| 2 | Declaración humana en fuente única | done | 4d0057b | El plan decía "11 skills de proceso"; son 10 + sdd-templates (mission.md). No se tocó el recuento |
| 3 | Degradación de `grilling` (Art. I) | skipped | — | RED limpio 2/2: por Art. I no se escribe la guidance. Solo queda la evidencia |

## Verificación por task

- [x] Task 1 — ambos JSON parsean; nombres exactos contrastados con `installed_plugins.json`
- [x] Task 2 — una sola enumeración de skills invocadas en todo el repo
- [x] Task 3 — RED escrito en `tests/sdd-consult-degradacion-red.md`; documenta el recorte y la fuga del staging. Sin GREEN: no hay fallo que revertir

## Fixes adicionales (trabajo descubierto fuera de scope)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
| `README.md:5` decía "v0.3.0 publicada" (dos releases por detrás, y ninguna publicada) | El README no se actualizó en los cierres de v0.4.0 | Absorbido en la Task 2: es una línea del mismo fichero que ya se edita. Decidido con el usuario el 2026-09-02 | 4d0057b |
