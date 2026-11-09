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
- No entra: renombrar las notas que ya existen; una frase sobre la fecha en el paso 2 (el baseline ya no la añade: humo `h0`, 2 de 2 limpios).

## Dónde se prueba

- El aviso del paso 1: humo `h1`.

## Delta de comportamiento

### Capacidad: `notes`

**ADDED — Un título vacío se pide otra vez**
- GIVEN una petición con el título vacío
- WHEN se guarda la nota
- THEN el agente pide el título

## Enmiendas

- 2026-11-09 — pendiente de aprobar: el humo `h0` sale limpio en el baseline (2 de 2 sujetos escriben `notas/reunion-lunes-12-de-octubre.md`, sin fecha añadida) y la constitución (Art. I) prohíbe escribir guidance cuyo fallo el baseline no exhibe. Propuesta: sale del Scope la frase del paso 2 y su requisito «El nombre no lleva la fecha» (el comportamiento ya se cumple); queda solo el aviso de título vacío del paso 1 (`h1`, 0 de 2).

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | 2026-10-14 | aprobada |
