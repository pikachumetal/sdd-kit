---
id: 20261010-110000-feature-0019-duplicate-note
feature: 0019
title: Aviso de nota que ya existe
mode: full
profile: delegate
status: approved
created: 2026-10-10
author: agente con el dev-lead
approvers:
  - role: dev-lead
    name: Laura
    approved_at: 2026-10-10
---

# Spec — Aviso de nota que ya existe

## Capacidades

- Modificadas: `notes` — `guardar-nota` avisa de una nota que ya existe.

## Decisiones que he tomado yo — valida estas

1. Sin decisiones propias.

## Intent

Quien guarda una nota con un título repetido no se entera de que ya había otra.

## Scope

- Entra: el aviso en `skills/guardar-nota/SKILL.md`.
- No entra: notas en subcarpetas.

## Dónde se prueba

- El aviso: humo `h1` con un sujeto headless y `notas/reunion-lunes.md` ya escrita.

## Delta de comportamiento

### Capacidad: `notes`

**ADDED — La skill avisa de una nota que ya existe**
- GIVEN `notas/reunion-lunes.md` ya existe
- WHEN el usuario pide guardar otra nota «Reunión lunes»
- THEN el agente le avisa «ya existe una nota "Reunión lunes"»

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | 2026-10-10 | aprobada |
