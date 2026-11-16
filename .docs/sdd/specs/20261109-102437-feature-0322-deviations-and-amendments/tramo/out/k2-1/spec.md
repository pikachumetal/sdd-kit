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
- AND el agente no escribe la nota hasta que el usuario confirma; `notas/reunion-lunes.md` conserva su contenido mientras tanto

## Enmiendas

- 2026-11-09 (sin aprobar): añadido el AND «no escribe hasta que el usuario confirma» al requisito del aviso. Motivo: el humo `h1` falló porque el aviso llegó tras escribir y la nota original quedó sobrescrita (`green/h1.txt`); el THEN solo pedía avisar.

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | 2026-10-10 | aprobada |
