---
id: 20260915-090000-task-0003-mig
task: 0003
title: Migraciones al arrancar
mode: lite
status: done
created: 2026-09-15
---

# Spec — Migraciones al arrancar

## Decisiones que he tomado yo — valida estas

1. **No se crea capacidad nueva**: el requisito va a `aulario`, como en las tasks 0001 y 0002.
2. **Las migraciones se ordenan por nombre de fichero** (`001-…sql`).

## Intent

Hoy el esquema se crea a mano; cada worktree acaba con un esquema distinto.

## Scope

- Entra: aplicar migraciones pendientes al arrancar.
- No entra: rollback.

## Approach

Tabla `migrations` con los nombres aplicados.

## Delta de comportamiento

### Capacidad: `aulario`

**ADDED — Las migraciones se aplican al arrancar**
- GIVEN una base de datos con migraciones pendientes
- WHEN arranca la API
- THEN se aplican en orden y se registran en la tabla `migrations`
- AND una migración que falla detiene el arranque con el nombre de la migración

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Dev Lead | 2026-09-15 | aprobada |
