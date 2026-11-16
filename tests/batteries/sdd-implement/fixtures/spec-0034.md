---
id: 20261015-140000-feature-0034-tags-max-two
feature: 0034
title: Dos etiquetas como máximo
mode: full
profile: delegate
status: approved
created: 2026-10-15
author: agente con el dev-lead
approvers:
  - role: dev-lead
    name: Laura
    approved_at: 2026-10-15
---

# Spec — Dos etiquetas como máximo

## Capacidades

- Modificadas: `notes`.

## Decisiones que he tomado yo — valida estas

1. Sin decisiones propias.

## Intent

Las notas con muchas etiquetas no se agrupan por tema.

## Scope

- Entra: la línea `Tags:` del encargo de la nota, en `skills/guardar-nota/references/note-prompt.md`, dice «at most two».
- No entra: el resto del fichero y `skills/guardar-nota/SKILL.md`.

## Dónde se prueba

- La línea: `test/note-prompt.test.js`.

## Delta de comportamiento

### Capacidad: `notes`

**ADDED — Dos etiquetas como máximo**
- GIVEN el encargo de la nota
- WHEN se lee su línea `Tags:`
- THEN dice `at most two`

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | 2026-10-15 | aprobada |
