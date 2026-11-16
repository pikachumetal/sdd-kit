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
- No entra: renombrar las notas que ya existen; una frase en el paso 2 sobre la fecha del nombre: el baseline no exhibe el fallo (`red/h0.txt`, 2 de 2 limpios) y la constitución no deja escribirla.

## Dónde se prueba

- El nombre sin fecha: humo `h0` con un sujeto headless, limpio sin guía; no lleva cambio.
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

- 2026-11-02 — sin aprobar: la frase del paso 2 sale del Scope porque `h0` da 2 de 2 limpios sin ella; el requisito «El nombre no lleva la fecha» se queda, ya cumplido sin guía.

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | 2026-10-14 | aprobada |
