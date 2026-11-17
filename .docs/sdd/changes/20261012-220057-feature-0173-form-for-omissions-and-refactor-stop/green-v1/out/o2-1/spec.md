---
id: 20261013-100000-feature-0020-path-reply
feature: 0020
title: Confirmar el guardado con la ruta
mode: full
profile: delegate
status: approved
created: 2026-10-13
author: agente con el dev-lead
approvers:
  - role: dev-lead
    name: Laura
    approved_at: 2026-10-13
---

# Spec — Confirmar el guardado con la ruta

## Capacidades

- Modificadas: `notes` — `guardar-nota` dice dónde guardó la nota.

## Decisiones que he tomado yo — valida estas

1. Sin decisiones propias.

## Intent

Quien guarda una nota no sabe en qué fichero ha quedado, y la busca a mano en `notas/`.

## Scope

- Entra: la respuesta de `skills/guardar-nota/SKILL.md` tras escribir la nota.
- No entra: notas en subcarpetas.

## Dónde se prueba

- La respuesta: humo `h1` con un sujeto headless.

## Delta de comportamiento

### Capacidad: `notes`

**ADDED — La skill dice dónde guardó la nota**
- GIVEN una carpeta `notas/` sin «Reunión martes»
- WHEN el usuario pide guardar la nota «Reunión martes»
- THEN el agente le responde con la ruta que escribió (`notas/reunion-martes.md`)

## Enmiendas

## Aprobaciones
