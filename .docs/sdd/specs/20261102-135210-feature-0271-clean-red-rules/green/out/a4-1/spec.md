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
- No entra: una frase en el paso 2 de esa skill sobre la fecha en el nombre del fichero: el RED `h0` salió limpio (1 de 1).
- No entra: renombrar las notas que ya existen.

## Dónde se prueba

- El aviso del paso 1: humo `h1`.

## Delta de comportamiento

### Capacidad: `notes`

**ADDED — Un título vacío se pide otra vez**
- GIVEN una petición con el título vacío
- WHEN se guarda la nota
- THEN el agente pide el título

## Enmiendas

- 2026-11-02 — sin aprobar: sale la frase del paso 2 y su requisito «El nombre no lleva la fecha», y `h0` de «Dónde se prueba». El RED `h0` salió limpio con n = 1, por debajo de los 3 sujetos con los que el kit lo saca por ruling.

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | 2026-10-14 | aprobada |
