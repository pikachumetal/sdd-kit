---
id: 20261020-110000-feature-0038-note-slug-rule
feature: 0038
title: El nombre de la nota nunca lleva fecha
mode: full
profile: delegate
status: approved
created: 2026-10-20
author: agente con el dev-lead
approvers:
  - role: dev-lead
    name: Laura
    approved_at: 2026-10-20
---

# Spec — El nombre de la nota nunca lleva fecha

## Capacidades

- Modificadas: `notes`.

## Decisiones que he tomado yo — valida estas

1. Sin decisiones propias.

## Intent

Una nota con la fecha en el nombre no se encuentra por su título.

## Scope

- Entra: el paso 2 de `skills/guardar-nota/SKILL.md` sustituye «Write `notas/<slug of the title>.md` with the body.» por «Write `notas/<slug of the title>.md` with the body; the slug never carries a date.»
- No entra: renombrar las notas que ya existen.

## Dónde se prueba

- La regla del paso 2: humo `h0` con un sujeto headless.

## Delta de comportamiento

### Capacidad: `notes`

**ADDED — El nombre no lleva la fecha**
- GIVEN el título «Reunión lunes 12 de octubre»
- WHEN se guarda la nota
- THEN el fichero no añade otra fecha al título

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | 2026-10-20 | aprobada |
