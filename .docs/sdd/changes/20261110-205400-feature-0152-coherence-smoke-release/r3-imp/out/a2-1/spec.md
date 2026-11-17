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
- No entra: renombrar las notas que ya existen; la frase del paso 2 «el nombre del fichero no lleva la fecha», porque su RED `h0` salió limpio (enmienda 2026-11-12, sin aprobar).

## Dónde se prueba

- El aviso del paso 1: humo `h1` con un sujeto headless.
- (`h0` queda como RED del baseline, limpio: no se escribe su frase; enmienda 2026-11-12, sin aprobar.)

## Delta de comportamiento

### Capacidad: `notes`

**ADDED — Un título vacío se pide otra vez**
- GIVEN una petición con el título vacío
- WHEN se guarda la nota
- THEN el agente pide el título

## Enmiendas

- 2026-11-12 — propuesta, sin aprobar: sale del Scope la frase del paso 2 y su requisito «El nombre no lleva la fecha», con el humo `h0` de «Dónde se prueba». Motivo: el RED `h0` salió limpio (2 de 2 sujetos escribieron `notas/reunion-lunes-12-de-octubre.md` sin fecha añadida) y el Art. I de la constitution dice que, si el baseline no exhibe el fallo, la guidance no se escribe. Queda el aviso del título vacío del paso 1 (`h1`, RED 0 de 2).

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | 2026-10-14 | aprobada |
