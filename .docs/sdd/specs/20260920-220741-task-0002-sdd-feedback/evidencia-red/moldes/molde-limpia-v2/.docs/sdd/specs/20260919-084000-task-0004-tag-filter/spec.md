---
id: 20260919-084000-task-0004-tag-filter
task: 0004
title: Filtro por etiqueta
mode: lite
status: approved
created: 2026-09-19
author: desarrollador único
approvers:
  - role: dev-lead
    name: desarrollador único
    approved_at: 2026-09-19
---

# Spec — Filtro por etiqueta

## Decisiones que he tomado yo — valida estas

1. **Capacidad nueva `search`** en `capabilities/`: es el primer comportamiento de localización de notas y no encaja en ninguna capacidad existente.
2. **Una sola etiqueta a la vez** — el filtro por varias etiquetas no tiene task todavía.
3. **Una etiqueta es una palabra precedida de `#`** en el cuerpo de la nota, sin distinguir mayúsculas.

## Intent

Hoy el listado solo se ordena por fecha y encontrar las notas de un mismo tema obliga a leerlas. Se quiere poder filtrar el listado por una etiqueta.

## Scope

- Entra: extraer las etiquetas de una nota; filtrar el listado por una etiqueta elegida.
- No entra: varias etiquetas a la vez, autocompletado.

## Approach

Una función pura sobre la lista de notas ya cargada; la vista solo la llama al cambiar la etiqueta elegida.

## Delta de comportamiento

### Capacidad: `search`

**ADDED — Filtro por etiqueta**
- GIVEN una colección de notas, algunas con la etiqueta `#viaje`
- WHEN se elige la etiqueta `viaje`
- THEN el listado muestra solo las notas que la contienen, sin distinguir mayúsculas

**ADDED — Filtro vacío muestra todas las notas**
- GIVEN el listado de notas
- WHEN no hay ninguna etiqueta elegida
- THEN se muestran todas las notas, en el orden de siempre

### Estimación y esfuerzo

- Tipo: frontend
- Esfuerzo spec: 0.2h
- Estimación de implementación: 1h
- Base de la estimación: una función pura y su test; referencia 0003 (0.85)
- Confianza: alta

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | desarrollador único | 2026-09-19 | aprobada |
