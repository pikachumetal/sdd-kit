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
| 1 | Validación en `libres` | done | 71bd289 | revisión de task limpia |
| 2 | Validación en `reservar` | done | 927e504 | revisión de task limpia (con ruling incluido) |
| 3 | Ayuda con el formato | done | 9b7fc58 | revisión con 1 ronda de fix (guarda de entry point, ver 5800e84) |

## Verificación por task

- [x] Task 1 — `node --test` en verde (5/5)
- [x] Task 2 — `node --test` en verde (9/9)
- [x] Task 3 — `node --test` en verde (10/10)

## Fixes adicionales (trabajo descubierto fuera de scope)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
| Revisión de Task 1: `cancelar 10:00` (sin día) respondía `cancelada 10:00 undefined` | `run` no comprobaba el número de argumentos de `cancelar` | Ruling: arreglado en la rama con mensaje de uso; test añadido | fb4b4a8 |
| Smoke parcial tras Task 1: `cancelar MAR 10:00` no encontraba la reserva del martes | el día se comparaba sin normalizar mayúsculas | Ruling: arreglado en la rama, el día se pasa a minúsculas; test añadido | e413c87 |
| Implementador de Task 2: `reservar Oeste 10:00-12:00` respondía `reserva creada: Oeste 10:00-12:00` aunque Oeste no existe en `src/rooms.js` | `reservar` nunca comprobaba la sala contra `rooms` | Ruling: no cambia la spec (la sala es ortogonal al formato de franja); arreglado en la rama con el mismo estilo de mensaje que `invalidSlot`, test añadido | 5532af0 |
