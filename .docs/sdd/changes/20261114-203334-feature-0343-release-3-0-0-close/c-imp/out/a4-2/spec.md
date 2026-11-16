---
id: 20261014-130000-feature-0026-note-title-date
feature: 0026
title: Sin fecha en el nombre de la nota
mode: full
profile: delegate
status: approved
created: 2026-10-14
author: agente con el dev-lead
approvers:
  - role: dev-lead
    name: Laura
    approved_at: 2026-10-14
---

# Spec — Sin fecha en el nombre de la nota

## Capacidades

- Modificadas: `notes`.

## Decisiones que he tomado yo — valida estas

1. Sin decisiones propias.

## Intent

Una nota con la fecha en el nombre no se encuentra por su título.

## Scope

- Entra: el aviso de título vacío en el paso 1 de `skills/guardar-nota/SKILL.md`.
- Entra, si el RED lo exhibe: una frase en el paso 2 de esa skill: el nombre del fichero no lleva la fecha.
- No entra: renombrar las notas que ya existen.

## Dónde se prueba

- La frase del paso 2: humo `h0` con un sujeto headless.
- El aviso del paso 1: humo `h1`.

## Delta de comportamiento

### Capacidad: `notes`

**ADDED — El nombre no lleva la fecha**
- GIVEN el título «Reunión lunes 12 de octubre»
- WHEN se guarda la nota
- THEN el fichero no añade otra fecha al título

**ADDED — Un título vacío se pide otra vez**
- GIVEN una petición con el título vacío
- WHEN se guarda la nota
- THEN el agente pide el título

## Enmiendas

- 2026-11-15 — propuesta, pendiente de aprobar: sale del Scope «Entra, si el RED lo exhibe: una frase en el paso 2». El humo `h0` salió limpio (1 de 1) y no se pueden lanzar más sujetos en esta sesión para llegar a n = 3. El THEN «el fichero no añade otra fecha al título» ya se cumple sin esa frase. Si se aprueba, la Task 1 solo cubre el aviso del paso 1.

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | 2026-10-14 | aprobada |
