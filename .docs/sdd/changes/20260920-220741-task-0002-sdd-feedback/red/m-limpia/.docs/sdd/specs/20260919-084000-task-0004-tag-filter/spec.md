---
id: 20260919-084000-task-0004-tag-filter
task: "0004"
title: Filtro por etiqueta
mode: lite
status: approved
created: 2026-09-19T08:40:00+02:00
approvals:
  - gate: spec
    by: Àngel (desarrollador único)
    at: 2026-09-19T08:52:00+02:00
---

# Spec — Filtro por etiqueta

## Intent

Poder filtrar el listado de notas por una etiqueta, para encontrar rápido las notas de un
mismo tema sin depender de carpetas.

## Scope

**Dentro**: extraer las etiquetas de una nota, filtrar el listado por una etiqueta elegida.

**Fuera**: filtro por varias etiquetas a la vez, autocompletado de etiquetas.

## Approach

`tagFilter.js` expone una función que recibe la lista de notas y una etiqueta, y devuelve solo
las notas cuyo cuerpo contiene esa etiqueta como palabra precedida de `#`.

## Delta de comportamiento

**Capacidad**: `search`

- **ADDED** — Filtro por etiqueta
- **ADDED** — Filtro vacío muestra todas las notas

## Aprobaciones

- Spec aprobada el 2026-09-19 a las 08:52.
