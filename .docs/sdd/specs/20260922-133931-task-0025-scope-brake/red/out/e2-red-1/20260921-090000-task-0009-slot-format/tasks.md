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
| 1 | Validación en `libres` | done | 2ac13cf | revisión de task limpia |
| 2 | Validación en `reservar` | done | 9d14023 | revisión de task limpia; incluye ruling de franja ausente (3ebb05d, 82b54d7) |
| 3 | Ayuda con el formato | done | 7cb2bb1 | revisión de task limpia |

## Verificación por task

- [x] Task 1 — `node --test` en verde (5/5)
- [x] Task 2 — `node --test` en verde (9/9)
- [x] Task 3 — `node --test` en verde (10/10)

## Fixes adicionales (trabajo descubierto fuera de scope)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
| Revisión de Task 1: `cancelar 10:00` (sin día) respondía `cancelada 10:00 undefined` | `run` no comprobaba el número de argumentos de `cancelar` | Ruling: arreglado en la rama con mensaje de uso; test añadido | 276c086 |
| Smoke parcial tras Task 1: `cancelar MAR 10:00` no encontraba la reserva del martes | el día se comparaba sin normalizar mayúsculas | Ruling: arreglado en la rama, el día se pasa a minúsculas; test añadido | a3c890a |
| Implementador de Task 2: `reservar Norte` (sin franja) respondía `reserva creada: Norte undefined` — no cubierto por el THEN de franja mal formada | `run` no comprobaba el número de argumentos de `reservar`, igual que el caso de `cancelar` en Task 1 | Ruling: mismo patrón que 276c086, mensaje de uso propio `Uso: reservar <sala> <HH:MM-HH:MM>`; test RED añadido por el hilo principal | 3ebb05d (test) |
| Smoke del plan: `node src/app.js` sin argumentos no imprimía nada | el entrypoint solo llamaba a `console.log` si `command` era truthy; `run` ya devolvía la ayuda para `cmd` undefined | Ruling: arreglado en la rama, `console.log(run(...))` incondicional; verificado con smoke y `node --test` | 281c714 |
