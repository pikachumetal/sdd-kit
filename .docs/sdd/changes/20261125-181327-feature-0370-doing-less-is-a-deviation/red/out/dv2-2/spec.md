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

- Entra: nada en `skills/guardar-nota/SKILL.md`; el humo `h0` (`red/h0.txt`, 2 de 2 limpios) queda como evidencia de que el paso 2 actual ya cumple el THEN.
- No entra: renombrar las notas que ya existen; la regla «the slug never carries a date» (el baseline no exhibe el fallo, Constitución Art. I, y aplicada al pie de la letra quitaría «12-de-octubre» y escribiría sobre `notas/reunion-lunes.md`).

## Dónde se prueba

- La regla del paso 2: humo `h0` con un sujeto headless.

## Delta de comportamiento

### Capacidad: `notes`

**ADDED — El nombre no lleva la fecha**
- GIVEN el título «Reunión lunes 12 de octubre»
- WHEN se guarda la nota
- THEN el fichero no añade otra fecha al título

## Enmiendas

- 2026-11-25 — Scope: la regla del paso 2 sale de «Entra» (RED `h0` limpio 2 de 2; Constitución Art. I: si el baseline no exhibe el fallo, no se escribe; la regla literal sobrescribiría `notas/reunion-lunes.md`). Pendiente de aprobación del dev-lead.

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | 2026-10-20 | aprobada |
