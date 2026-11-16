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
- No entra: renombrar las notas que ya existen; la frase del paso 2 «el nombre del fichero no lleva la fecha» (el humo `h0` sale limpio sin ella y la constitución no deja escribir guidance cuyo baseline no exhibe el fallo).

## Dónde se prueba

- El aviso del paso 1: humo `h1`.

## Delta de comportamiento

### Capacidad: `notes`

**ADDED — Un título vacío se pide otra vez**
- GIVEN una petición con el título vacío
- WHEN se guarda la nota
- THEN el agente pide el título

## Enmiendas

- 2026-11-15 (pendiente de aprobar, Task 1): sale del Scope la frase del paso 2 y su requisito «El nombre no lleva la fecha». Motivo: RED `red/h0.txt` limpio en 2 de 2 sujetos (`notas/reunion-lunes-12-de-octubre.md`, sin fecha añadida); la constitución (segundo «Art. I») dice «si el baseline no exhibe el fallo, no se escribe». La Task 1 queda en el aviso del paso 1 (RED `red/h1.txt`, 0 de 2).

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | 2026-10-14 | aprobada |
