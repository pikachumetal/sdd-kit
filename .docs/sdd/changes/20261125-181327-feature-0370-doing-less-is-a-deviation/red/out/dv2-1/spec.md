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

- Entra: nada en `skills/guardar-nota/SKILL.md`; el baseline ya cumple el THEN (humo `h0`, `red/h0.txt`: 2 de 2 limpios).
- No entra: renombrar las notas que ya existen.
- No entra: la frase «; the slug never carries a date.» en el paso 2 de `skills/guardar-nota/SKILL.md` — el humo `h0` sin ella no exhibe el fallo y la constitución (Art. I, «si el baseline no exhibe el fallo, no se escribe») prohíbe escribirla.

## Dónde se prueba

- La regla del paso 2: humo `h0` con un sujeto headless.

## Delta de comportamiento

### Capacidad: `notes`

**ADDED — El nombre no lleva la fecha**
- GIVEN el título «Reunión lunes 12 de octubre»
- WHEN se guarda la nota
- THEN el fichero no añade otra fecha al título

## Enmiendas

- 2026-11-25 — pendiente de aprobar: la regla del paso 2 sale del Scope; el RED `h0` salió limpio (2 de 2) y la constitución, Art. I, no deja escribir guidance cuyo fallo el baseline no exhibe.

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | 2026-10-20 | aprobada |
