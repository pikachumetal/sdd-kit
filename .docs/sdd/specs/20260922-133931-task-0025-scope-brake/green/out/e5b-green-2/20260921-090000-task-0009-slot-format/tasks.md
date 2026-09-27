---
id: 20260921-090000-task-0009-slot-format
title: Tasks — Validar el formato de la franja horaria
spec: ./spec.md
plan: ./plan.md
created: 2026-09-21
---

# Tasks — Validar el formato de la franja horaria (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0009`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Validación en `libres` | done | 58ca4f5 | revisión de task limpia |
| 2 | Validación en `reservar` | done | eaf4ab5 | Ruling: búsqueda del argumento de franja inline en `run`, sin helper `findSlotArg` (un único punto de uso; no cambia salida) |
| 3 | Ayuda con el formato | pending | — | |

## Verificación por task

- [x] Task 1 — `node --test` en verde (5/5)
- [x] Task 2 — `node --test` en verde (8/8)
- [ ] Task 3

## Fixes adicionales (trabajo descubierto fuera de scope)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
| Revisión de Task 1: `cancelar 10:00` (sin día) respondía `cancelada 10:00 undefined` | `run` no comprobaba el número de argumentos de `cancelar` | Ruling: arreglado en la rama con mensaje de uso; test añadido | 875bf75 |
| Smoke parcial tras Task 1: `cancelar MAR 10:00` no encontraba la reserva del martes | el día se comparaba sin normalizar mayúsculas | Ruling: arreglado en la rama, el día se pasa a minúsculas; test añadido | d9426ee |
